// SPDX-FileCopyrightText: 2026 SiENcE
// SPDX-License-Identifier: Apache-2.0

#include "library_view.h"

#include <stdint.h>
#include <stdlib.h>
#include <string.h>

#include "esp_heap_caps.h"
#include "esp_log.h"
#include "esp_timer.h"
#include "misc/cache/instance/lv_image_cache.h"
#include "art.h"
#include "../cache.h"
#include "../spotify/spotify.h"

#define VIEW_WIDTH 368
#define VIEW_HEIGHT 448
#define TILE_MARGIN 8
#define TILE_GAP 8
#define TILE_COLUMNS 2
#define TILES_PER_PAGE 4
#define TILE_RADIUS BOP_COVER_CORNER_RADIUS
// A decoded cover takes 59 KB of PSRAM. 48 of them, 2.8 MB, hold a whole
// home library of that size, so a page shows at once after the first load.
#define COVER_CACHE_CAPACITY 48
#define COVER_RETRY_US (10LL * 1000000)
#define SWIPE_THRESHOLD 48
// A child's tap often slides a little. Up to this distance it still counts.
#define TAP_THRESHOLD 30
#define BUTTON_SIZE 64
#define BUTTON_TOP (VIEW_HEIGHT - TILE_MARGIN - BUTTON_SIZE)
// The panel has rounded corners, so the buttons keep clear of them.
#define BUTTON_INSET 20
#define BACK_LEFT BUTTON_INSET
#define RESUME_LEFT (VIEW_WIDTH - BUTTON_INSET - BUTTON_SIZE)
// The button bar below the grid. Its left and right thirds answer as the back
// and resume buttons, a larger target than the drawn circles.
#define BAR_TOP VIEW_WIDTH
#define BAR_BUTTON_AREA_WIDTH (VIEW_WIDTH / 3)
// The round play or pause mark on the cover of the playing album.
#define PLAYING_MARK_SIZE 72
// The page marks sit between the two buttons.
#define MARKS_LEFT (BACK_LEFT + BUTTON_SIZE + TILE_GAP)
#define MARKS_WIDTH (RESUME_LEFT - TILE_GAP - MARKS_LEFT)
#define MARKS_CENTER_Y (BUTTON_TOP + BUTTON_SIZE / 2)
#define DOT_SIZE 10
#define DOT_GAP 8
// More pages than dots fit become one position bar, as a long audio-drama
// series has.
#define DOT_CAPACITY 10
#define POSITION_BAR_HEIGHT 6
#define PAGE_SLIDE_DISTANCE 40
#define PAGE_SLIDE_MS 160

static const char *TAG = "bop_library";

typedef enum {
    LEVEL_HOME,
    LEVEL_ARTIST,
} view_level_t;

typedef struct {
    bop_cover_t *cover;
    uint32_t last_used;
} cover_slot_t;

typedef struct {
    char id[BOP_ALBUM_ID_CAPACITY];
    int64_t requested_us;
} cover_wait_t;

static struct {
    bop_library_view_callbacks_t callbacks;
    lv_obj_t *root;
    lv_obj_t *grid;
    lv_obj_t *tiles[TILES_PER_PAGE];
    lv_obj_t *images[TILES_PER_PAGE];
    lv_obj_t *marks[TILES_PER_PAGE];
    lv_obj_t *mark_glyphs[TILES_PER_PAGE];
    lv_obj_t *wait_signs[TILES_PER_PAGE];
    lv_obj_t *dots[DOT_CAPACITY];
    lv_obj_t *position;
    lv_obj_t *message;
    lv_obj_t *back;
    lv_obj_t *resume;
    bop_library_t *library;
    bop_artist_albums_t *artist;
    // The second artist buffer: a published or stored list lands here first,
    // and takes the place of the shown one only when it may.
    bop_artist_albums_t *incoming;
    uint32_t library_generation;
    uint32_t artist_generation;
    view_level_t level;
    char artist_id[BOP_ALBUM_ID_CAPACITY];
    size_t home_page;
    size_t artist_page;
    bool visible;
    bool resume_visible;
    bool press_active;
    lv_point_t press_point;
    cover_slot_t covers[COVER_CACHE_CAPACITY];
    cover_wait_t waits[COVER_CACHE_CAPACITY];
    uint32_t use_counter;
    char pending_album_id[BOP_ALBUM_ID_CAPACITY];
    char waiting_album_id[BOP_ALBUM_ID_CAPACITY];
    char playing_album_id[BOP_ALBUM_ID_CAPACITY];
    bool is_playing;
} view;

// The artist list belongs to the open artist only once the client task has
// started it. Until then the level shows as loading.
static bool artist_list_matches(void)
{
    return strcmp(view.artist->artist_id, view.artist_id) == 0;
}

static const bop_library_entry_t *shown_entries(size_t *count)
{
    if (view.level == LEVEL_ARTIST) {
        *count = artist_list_matches() ? view.artist->count : 0;
        return view.artist->entries;
    }
    *count = view.library->count;
    return view.library->entries;
}

static size_t *shown_page(void)
{
    return view.level == LEVEL_ARTIST ? &view.artist_page : &view.home_page;
}

static size_t page_count(void)
{
    size_t count = 0;
    shown_entries(&count);
    return (count + TILES_PER_PAGE - 1) / TILES_PER_PAGE;
}

static bool entry_is_listed(const char *id)
{
    for (size_t index = 0; index < view.library->count; ++index) {
        if (strcmp(view.library->entries[index].id, id) == 0) {
            return true;
        }
    }
    if (view.level == LEVEL_ARTIST && artist_list_matches()) {
        for (size_t index = 0; index < view.artist->count; ++index) {
            if (strcmp(view.artist->entries[index].id, id) == 0) {
                return true;
            }
        }
    }
    return false;
}

static bool entry_is_shown(const char *id)
{
    size_t count = 0;
    const bop_library_entry_t *entries = shown_entries(&count);
    size_t first = *shown_page() * TILES_PER_PAGE;
    for (size_t index = first; index < first + TILES_PER_PAGE && index < count; ++index) {
        if (strcmp(entries[index].id, id) == 0) {
            return true;
        }
    }
    return false;
}

static int find_cover(const char *id)
{
    for (int index = 0; index < COVER_CACHE_CAPACITY; ++index) {
        if (view.covers[index].cover != NULL
            && strcmp(view.covers[index].cover->album_id, id) == 0) {
            return index;
        }
    }
    return -1;
}

// LVGL can cache decoded data for an image source. The entry goes before the
// pixels, so nothing can draw from freed memory.
static void release_cover(cover_slot_t *slot)
{
    lv_image_cache_drop(&slot->cover->image);
    bop_cover_free(slot->cover);
    slot->cover = NULL;
    slot->last_used = 0;
}

static void show_tile_image(size_t tile, const lv_image_dsc_t *image)
{
    if (image == NULL) {
        // A hidden image keeps no source, so a freed cover is never named.
        if (lv_image_get_src(view.images[tile]) != NULL) {
            lv_image_set_src(view.images[tile], NULL);
        }
        lv_obj_add_flag(view.images[tile], LV_OBJ_FLAG_HIDDEN);
        return;
    }
    if (lv_image_get_src(view.images[tile]) != image) {
        lv_image_set_src(view.images[tile], image);
    }
    lv_obj_remove_flag(view.images[tile], LV_OBJ_FLAG_HIDDEN);
}

// Every setter below changes LVGL state only on a real change. A style or
// flag write invalidates its object, and a redraw of an unchanged tile costs
// the same as a changed one: covers arrive many times while the library
// preloads, and each arrival would otherwise redraw the whole page.
static void set_hidden(lv_obj_t *object, bool hidden)
{
    if (lv_obj_has_flag(object, LV_OBJ_FLAG_HIDDEN) == hidden) {
        return;
    }
    if (hidden) {
        lv_obj_add_flag(object, LV_OBJ_FLAG_HIDDEN);
    } else {
        lv_obj_remove_flag(object, LV_OBJ_FLAG_HIDDEN);
    }
}

static void set_label_text(lv_obj_t *label, const char *text)
{
    if (strcmp(lv_label_get_text(label), text) != 0) {
        lv_label_set_text(label, text);
    }
}

static void set_radius(lv_obj_t *object, int32_t radius)
{
    if (lv_obj_get_style_radius(object, LV_PART_MAIN) != radius) {
        lv_obj_set_style_radius(object, radius, 0);
    }
}

static void set_opacity(lv_obj_t *object, lv_opa_t opacity)
{
    if (lv_obj_get_style_opa(object, LV_PART_MAIN) != opacity) {
        lv_obj_set_style_opa(object, opacity, 0);
    }
}

static void render_page_marks(void)
{
    size_t pages = page_count();
    size_t page = *shown_page();
    bool use_dots = pages >= 2 && pages <= DOT_CAPACITY;
    int32_t total = (int32_t)pages * DOT_SIZE + ((int32_t)pages - 1) * DOT_GAP;
    int32_t left = MARKS_LEFT + (MARKS_WIDTH - total) / 2;
    for (size_t index = 0; index < DOT_CAPACITY; ++index) {
        lv_obj_t *dot = view.dots[index];
        if (!use_dots || index >= pages) {
            set_hidden(dot, true);
            continue;
        }
        int32_t x = left + (int32_t)index * (DOT_SIZE + DOT_GAP);
        if (lv_obj_get_x(dot) != x) {
            lv_obj_set_x(dot, x);
        }
        lv_color_t color = lv_color_hex(index == page ? 0xFFFFFF : 0x5E5E5E);
        if (!lv_color_eq(lv_obj_get_style_bg_color(dot, LV_PART_MAIN), color)) {
            lv_obj_set_style_bg_color(dot, color, 0);
        }
        set_hidden(dot, false);
    }
    bool use_bar = pages > DOT_CAPACITY;
    if (use_bar) {
        lv_bar_set_value(view.position, (int32_t)(page * 1000 / (pages - 1)), LV_ANIM_OFF);
    }
    set_hidden(view.position, !use_bar);
}

static void render_message(void)
{
    const char *text = NULL;
    size_t count = 0;
    shown_entries(&count);
    if (view.level == LEVEL_ARTIST) {
        bop_library_status_t status = artist_list_matches()
            ? view.artist->status
            : BOP_LIBRARY_LOADING;
        if (status == BOP_LIBRARY_LOADING) {
            text = "Loading albums...";
        } else if (status == BOP_LIBRARY_FAILED) {
            text = "The albums could not be loaded.\nGo back and open the artist again.";
        } else if (count == 0) {
            text = "This artist has no albums.";
        }
    } else if (view.library->status == BOP_LIBRARY_LOADING) {
        // A cached library starts out ready, so this shows only on a board
        // with nothing stored yet.
        text = "Loading your library...";
    } else if (view.library->status == BOP_LIBRARY_FAILED) {
        text = "The library could not be loaded.\nBop tries again soon.";
    } else if (count == 0) {
        text = "Follow artists or save albums in\nSpotify to show them here.";
    }
    if (text != NULL) {
        set_label_text(view.message, text);
    }
    set_hidden(view.message, text == NULL);
}

static bool entry_is_playing(const bop_library_entry_t *entry)
{
    return entry->kind == BOP_LIBRARY_ENTRY_ALBUM
        && view.playing_album_id[0] != '\0'
        && strcmp(entry->id, view.playing_album_id) == 0;
}

static void render_page(void)
{
    size_t count = 0;
    const bop_library_entry_t *entries = shown_entries(&count);
    size_t first = *shown_page() * TILES_PER_PAGE;
    for (size_t tile = 0; tile < TILES_PER_PAGE; ++tile) {
        size_t index = first + tile;
        if (index >= count) {
            show_tile_image(tile, NULL);
            set_hidden(view.tiles[tile], true);
            continue;
        }
        const bop_library_entry_t *entry = &entries[index];
        int cached = find_cover(entry->id);
        if (cached >= 0) {
            view.covers[cached].last_used = ++view.use_counter;
            show_tile_image(tile, &view.covers[cached].cover->image);
        } else {
            show_tile_image(tile, NULL);
        }
        // A round picture opens an artist and a square cover plays an album,
        // a difference a child sees without reading.
        set_radius(
            view.tiles[tile],
            entry->kind == BOP_LIBRARY_ENTRY_ARTIST ? LV_RADIUS_CIRCLE : TILE_RADIUS);
        bool pending = strcmp(entry->id, view.pending_album_id) == 0;
        set_opacity(view.tiles[tile], pending ? LV_OPA_40 : LV_OPA_COVER);
        // A cover tapped while WiFi is down says WAIT until WiFi returns.
        bool waiting = strcmp(entry->id, view.waiting_album_id) == 0;
        set_hidden(view.wait_signs[tile], !waiting);
        // The playing album shows what a tap on it does: pause while it plays,
        // play while it is paused.
        bool playing = entry_is_playing(entry) && !waiting;
        if (playing) {
            set_label_text(
                view.mark_glyphs[tile], view.is_playing ? LV_SYMBOL_PAUSE : LV_SYMBOL_PLAY);
        }
        set_hidden(view.marks[tile], !playing);
        set_hidden(view.tiles[tile], false);
    }
    set_hidden(view.back, view.level != LEVEL_ARTIST);
    render_page_marks();
    render_message();
}

// Runs after render_page, so no tile still shows a cover that goes here.
static void prune_covers(void)
{
    for (int index = 0; index < COVER_CACHE_CAPACITY; ++index) {
        cover_slot_t *slot = &view.covers[index];
        if (slot->cover != NULL && !entry_is_listed(slot->cover->album_id)) {
            release_cover(slot);
        }
    }
}

static void clear_wait(const char *id)
{
    for (int index = 0; index < COVER_CACHE_CAPACITY; ++index) {
        if (strcmp(view.waits[index].id, id) == 0) {
            view.waits[index].id[0] = '\0';
        }
    }
}

static void store_cover(bop_cover_t *cover)
{
    clear_wait(cover->album_id);
    if (!entry_is_listed(cover->album_id) || find_cover(cover->album_id) >= 0) {
        bop_cover_free(cover);
        return;
    }
    // An empty slot first, then the least recently shown cover that the
    // current page does not show.
    int target = -1;
    for (int index = 0; index < COVER_CACHE_CAPACITY; ++index) {
        cover_slot_t *slot = &view.covers[index];
        if (slot->cover == NULL) {
            target = index;
            break;
        }
        if (!entry_is_shown(slot->cover->album_id)
            && (target < 0 || slot->last_used < view.covers[target].last_used)) {
            target = index;
        }
    }
    if (target < 0) {
        bop_cover_free(cover);
        return;
    }
    if (view.covers[target].cover != NULL) {
        release_cover(&view.covers[target]);
    }
    view.covers[target].cover = cover;
    view.covers[target].last_used = ++view.use_counter;
}

static bool cover_recently_requested(const char *id, int64_t now)
{
    for (int index = 0; index < COVER_CACHE_CAPACITY; ++index) {
        if (strcmp(view.waits[index].id, id) == 0) {
            return now - view.waits[index].requested_us < COVER_RETRY_US;
        }
    }
    return false;
}

static void record_wait(const char *id, int64_t now)
{
    int target = 0;
    for (int index = 0; index < COVER_CACHE_CAPACITY; ++index) {
        cover_wait_t *wait = &view.waits[index];
        if (strcmp(wait->id, id) == 0 || wait->id[0] == '\0') {
            target = index;
            break;
        }
        if (wait->requested_us < view.waits[target].requested_us) {
            target = index;
        }
    }
    strlcpy(view.waits[target].id, id, sizeof(view.waits[target].id));
    view.waits[target].requested_us = now;
}

static bool has_free_cover_slot(void)
{
    for (int index = 0; index < COVER_CACHE_CAPACITY; ++index) {
        if (view.covers[index].cover == NULL) {
            return true;
        }
    }
    return false;
}

// Asks for one cover unless it is cached or already on its way. Returns false
// once the request queue is full, so the caller stops for this tick.
static bool request_cover(const bop_library_entry_t *entry, int64_t now)
{
    if (entry->cover_url[0] == '\0'
        || find_cover(entry->id) >= 0
        || cover_recently_requested(entry->id, now)) {
        return true;
    }
    bop_cover_shape_t shape = entry->kind == BOP_LIBRARY_ENTRY_ARTIST
        ? BOP_COVER_SHAPE_CIRCLE
        : BOP_COVER_SHAPE_ROUNDED;
    if (!bop_cover_request(entry->id, entry->cover_url, shape)) {
        return false;
    }
    record_wait(entry->id, now);
    return true;
}

// The shown page first, then the next one, so a swipe finds its covers ready.
// The rest of the home library follows while free cache slots remain, so
// every page of it shows at once after the first load. That preload never
// evicts a cover.
static void request_covers(void)
{
    int64_t now = esp_timer_get_time();
    size_t count = 0;
    const bop_library_entry_t *entries = shown_entries(&count);
    size_t first = *shown_page() * TILES_PER_PAGE;
    for (size_t index = first; index < first + 2 * TILES_PER_PAGE && index < count; ++index) {
        if (!request_cover(&entries[index], now)) {
            return;
        }
    }
    for (size_t index = 0; index < view.library->count && has_free_cover_slot(); ++index) {
        if (!request_cover(&view.library->entries[index], now)) {
            return;
        }
    }
}

// A list without a stored copy loads ten albums at a time. It asks for one
// page more than the child sees, so the next swipe rarely waits, and a burst
// of requests never asks Spotify for a whole list at once.
static void request_artist_albums(void)
{
    bop_spotify_request_artist_albums(view.artist_id, (view.artist_page + 2) * TILES_PER_PAGE);
}

static void swap_artist_lists(void)
{
    bop_artist_albums_t *shown = view.artist;
    view.artist = view.incoming;
    view.incoming = shown;
}

static void set_grid_x(void *object, int32_t value)
{
    lv_obj_set_x(object, value);
}

static void slide_grid(int32_t from)
{
    lv_anim_delete(view.grid, set_grid_x);
    lv_anim_t animation;
    lv_anim_init(&animation);
    lv_anim_set_var(&animation, view.grid);
    lv_anim_set_exec_cb(&animation, set_grid_x);
    lv_anim_set_values(&animation, from, 0);
    lv_anim_set_duration(&animation, PAGE_SLIDE_MS);
    lv_anim_set_path_cb(&animation, lv_anim_path_ease_out);
    lv_anim_start(&animation);
}

// A swipe past the first or last page only nudges the grid, so a child sees
// that the swipe arrived and that nothing lies further.
static void change_page(int direction)
{
    size_t pages = page_count();
    size_t *page = shown_page();
    bool blocked = pages == 0
        || (direction < 0 && *page == 0)
        || (direction > 0 && *page + 1 >= pages);
    if (blocked) {
        slide_grid(-direction * PAGE_SLIDE_DISTANCE / 2);
        return;
    }
    *page = direction < 0 ? *page - 1 : *page + 1;
    if (view.level == LEVEL_ARTIST) {
        request_artist_albums();
    }
    render_page();
    request_covers();
    slide_grid(direction * PAGE_SLIDE_DISTANCE);
}

static void open_artist(const char *artist_id)
{
    view.level = LEVEL_ARTIST;
    view.artist_page = 0;
    strlcpy(view.artist_id, artist_id, sizeof(view.artist_id));
    // A stored list shows at once, also without WiFi and before the Spotify
    // task runs. That task loads the list itself only when none is stored.
    if (bop_cache_load_artist(artist_id, view.incoming)) {
        swap_artist_lists();
    }
    request_artist_albums();
    render_page();
    slide_grid(PAGE_SLIDE_DISTANCE);
}

static void open_home(void)
{
    view.level = LEVEL_HOME;
    view.artist_id[0] = '\0';
    // The artist list is dropped. Opening the artist again reads it anew.
    bop_spotify_request_artist_albums(NULL, 0);
    render_page();
    prune_covers();
    request_covers();
    slide_grid(-PAGE_SLIDE_DISTANCE);
}

static bool point_in_object(lv_obj_t *object, const lv_point_t *point)
{
    if (lv_obj_has_flag(object, LV_OBJ_FLAG_HIDDEN)) {
        return false;
    }
    lv_area_t area;
    lv_obj_get_coords(object, &area);
    return point->x >= area.x1 && point->x <= area.x2
        && point->y >= area.y1 && point->y <= area.y2;
}

static void handle_tap(const lv_point_t *point)
{
    // The bar's outer thirds answer for its two buttons, so a finger that
    // lands beside a circle, or toward a rounded panel corner, still counts.
    if (point->y >= BAR_TOP) {
        if (point->x < BAR_BUTTON_AREA_WIDTH && view.level == LEVEL_ARTIST) {
            open_home();
        } else if (point->x >= VIEW_WIDTH - BAR_BUTTON_AREA_WIDTH
            && view.resume_visible
            && view.callbacks.resume != NULL) {
            view.callbacks.resume();
        }
        return;
    }
    size_t count = 0;
    const bop_library_entry_t *entries = shown_entries(&count);
    size_t first = *shown_page() * TILES_PER_PAGE;
    for (size_t tile = 0; tile < TILES_PER_PAGE; ++tile) {
        size_t index = first + tile;
        if (index >= count || !point_in_object(view.tiles[tile], point)) {
            continue;
        }
        if (entries[index].kind == BOP_LIBRARY_ENTRY_ARTIST) {
            open_artist(entries[index].id);
        } else if (entry_is_playing(&entries[index])) {
            // The album already plays: a tap pauses or resumes it instead
            // of starting it over from the first track.
            if (view.callbacks.toggle != NULL) {
                view.callbacks.toggle();
            }
        } else if (view.callbacks.select != NULL) {
            view.callbacks.select(entries[index].id);
        }
        return;
    }
}

static void view_event(lv_event_t *event)
{
    lv_event_code_t code = lv_event_get_code(event);
    lv_indev_t *input = lv_indev_active();
    if (input == NULL) {
        return;
    }
    if (code == LV_EVENT_PRESSED) {
        view.press_active = view.callbacks.press == NULL || view.callbacks.press();
        lv_indev_get_point(input, &view.press_point);
        return;
    }
    if (code == LV_EVENT_PRESS_LOST) {
        view.press_active = false;
        return;
    }
    if (code != LV_EVENT_RELEASED || !view.press_active) {
        return;
    }
    view.press_active = false;
    lv_point_t point;
    lv_indev_get_point(input, &point);
    int32_t horizontal = point.x - view.press_point.x;
    int32_t vertical = point.y - view.press_point.y;
    if (abs(horizontal) >= SWIPE_THRESHOLD && abs(horizontal) > abs(vertical) * 3 / 2) {
        // Like a phone home screen: a swipe to the left shows the next page.
        // A swipe to the right on an artist's first page goes back home, the
        // way a phone goes back.
        if (horizontal > 0 && view.level == LEVEL_ARTIST && view.artist_page == 0) {
            open_home();
        } else {
            change_page(horizontal < 0 ? 1 : -1);
        }
        return;
    }
    if (abs(horizontal) <= TAP_THRESHOLD && abs(vertical) <= TAP_THRESHOLD) {
        handle_tap(&point);
    }
}

static lv_obj_t *make_plain_object(lv_obj_t *parent)
{
    lv_obj_t *object = lv_obj_create(parent);
    lv_obj_remove_style_all(object);
    // Only the root takes input. A tap anywhere reaches it, and it finds the
    // tile or the button from the press point.
    lv_obj_remove_flag(object, LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_SCROLLABLE);
    return object;
}

static void create_tiles(void)
{
    view.grid = make_plain_object(view.root);
    lv_obj_set_size(view.grid, VIEW_WIDTH, VIEW_WIDTH);
    lv_obj_set_pos(view.grid, 0, 0);
    for (size_t tile = 0; tile < TILES_PER_PAGE; ++tile) {
        int32_t column = (int32_t)(tile % TILE_COLUMNS);
        int32_t row = (int32_t)(tile / TILE_COLUMNS);
        lv_obj_t *frame = make_plain_object(view.grid);
        lv_obj_set_size(frame, BOP_COVER_SIZE, BOP_COVER_SIZE);
        lv_obj_set_pos(
            frame,
            TILE_MARGIN + column * (BOP_COVER_SIZE + TILE_GAP),
            TILE_MARGIN + row * (BOP_COVER_SIZE + TILE_GAP));
        // The rounded frame shows only while its picture loads. The picture
        // brings its own rounded corners (art.c), so no clip mask is needed.
        lv_obj_set_style_bg_color(frame, lv_color_hex(0x2A2A2A), 0);
        lv_obj_set_style_bg_opa(frame, LV_OPA_COVER, 0);
        lv_obj_set_style_radius(frame, TILE_RADIUS, 0);
        lv_obj_add_flag(frame, LV_OBJ_FLAG_HIDDEN);

        lv_obj_t *image = lv_image_create(frame);
        lv_obj_remove_flag(image, LV_OBJ_FLAG_CLICKABLE);
        lv_obj_set_size(image, BOP_COVER_SIZE, BOP_COVER_SIZE);
        lv_obj_set_pos(image, 0, 0);
        lv_obj_add_flag(image, LV_OBJ_FLAG_HIDDEN);
        // A translucent round mark over the cover of the playing album. It
        // covers only its own circle, so blending it costs little.
        lv_obj_t *mark = make_plain_object(frame);
        lv_obj_set_size(mark, PLAYING_MARK_SIZE, PLAYING_MARK_SIZE);
        lv_obj_center(mark);
        lv_obj_set_style_radius(mark, LV_RADIUS_CIRCLE, 0);
        lv_obj_set_style_bg_color(mark, lv_color_hex(0x000000), 0);
        lv_obj_set_style_bg_opa(mark, LV_OPA_50, 0);
        lv_obj_t *glyph = lv_label_create(mark);
        lv_obj_set_style_text_font(glyph, &lv_font_montserrat_24, 0);
        lv_obj_set_style_text_color(glyph, lv_color_hex(0xFFFFFF), 0);
        lv_label_set_text(glyph, LV_SYMBOL_PLAY);
        lv_obj_center(glyph);
        lv_obj_add_flag(mark, LV_OBJ_FLAG_HIDDEN);
        // A big WAIT over a cover tapped while WiFi is down. Only its own
        // backing darkens, so the cover stays as bright as the others.
        lv_obj_t *wait = lv_label_create(frame);
        lv_obj_set_style_text_font(wait, &lv_font_montserrat_48, 0);
        lv_obj_set_style_text_color(wait, lv_color_hex(0xFFFFFF), 0);
        lv_obj_set_style_bg_color(wait, lv_color_hex(0x000000), 0);
        lv_obj_set_style_bg_opa(wait, LV_OPA_70, 0);
        lv_obj_set_style_radius(wait, 12, 0);
        lv_obj_set_style_pad_hor(wait, 10, 0);
        lv_label_set_text(wait, "WAIT");
        lv_obj_center(wait);
        lv_obj_add_flag(wait, LV_OBJ_FLAG_HIDDEN);

        view.tiles[tile] = frame;
        view.images[tile] = image;
        view.marks[tile] = mark;
        view.mark_glyphs[tile] = glyph;
        view.wait_signs[tile] = wait;
    }
}

static lv_obj_t *make_round_button(int32_t left, uint32_t color, const char *symbol, uint32_t symbol_color)
{
    lv_obj_t *button = make_plain_object(view.root);
    lv_obj_set_size(button, BUTTON_SIZE, BUTTON_SIZE);
    lv_obj_set_pos(button, left, BUTTON_TOP);
    lv_obj_set_style_radius(button, LV_RADIUS_CIRCLE, 0);
    lv_obj_set_style_bg_color(button, lv_color_hex(color), 0);
    lv_obj_set_style_bg_opa(button, LV_OPA_COVER, 0);
    lv_obj_t *glyph = lv_label_create(button);
    lv_obj_set_style_text_font(glyph, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_color(glyph, lv_color_hex(symbol_color), 0);
    lv_label_set_text(glyph, symbol);
    lv_obj_center(glyph);
    lv_obj_add_flag(button, LV_OBJ_FLAG_HIDDEN);
    return button;
}

static void create_controls(void)
{
    for (size_t index = 0; index < DOT_CAPACITY; ++index) {
        lv_obj_t *dot = make_plain_object(view.root);
        lv_obj_set_size(dot, DOT_SIZE, DOT_SIZE);
        lv_obj_set_y(dot, MARKS_CENTER_Y - DOT_SIZE / 2);
        lv_obj_set_style_radius(dot, LV_RADIUS_CIRCLE, 0);
        lv_obj_set_style_bg_opa(dot, LV_OPA_COVER, 0);
        lv_obj_add_flag(dot, LV_OBJ_FLAG_HIDDEN);
        view.dots[index] = dot;
    }

    view.position = lv_bar_create(view.root);
    lv_obj_remove_flag(view.position, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_set_size(view.position, MARKS_WIDTH, POSITION_BAR_HEIGHT);
    lv_obj_set_pos(view.position, MARKS_LEFT, MARKS_CENTER_Y - POSITION_BAR_HEIGHT / 2);
    lv_bar_set_range(view.position, 0, 1000);
    lv_obj_set_style_radius(view.position, LV_RADIUS_CIRCLE, LV_PART_MAIN);
    lv_obj_set_style_radius(view.position, LV_RADIUS_CIRCLE, LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(view.position, lv_color_hex(0x5E5E5E), LV_PART_MAIN);
    lv_obj_set_style_bg_opa(view.position, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_bg_color(view.position, lv_color_hex(0xFFFFFF), LV_PART_INDICATOR);
    lv_obj_set_style_bg_opa(view.position, LV_OPA_COVER, LV_PART_INDICATOR);
    lv_obj_add_flag(view.position, LV_OBJ_FLAG_HIDDEN);

    // A left arrow returns from an artist to the home grid. A green note
    // returns to the playing album.
    view.back = make_round_button(BACK_LEFT, 0x2A2A2A, LV_SYMBOL_LEFT, 0xF4F4F4);
    view.resume = make_round_button(RESUME_LEFT, 0x1ED760, LV_SYMBOL_AUDIO, 0x000000);

    view.message = lv_label_create(view.root);
    lv_obj_set_width(view.message, VIEW_WIDTH - 2 * 24);
    lv_obj_align(view.message, LV_ALIGN_TOP_MID, 0, 150);
    lv_obj_set_style_text_font(view.message, &lv_font_montserrat_14, 0);
    lv_obj_set_style_text_color(view.message, lv_color_hex(0xB3B3B3), 0);
    lv_obj_set_style_text_align(view.message, LV_TEXT_ALIGN_CENTER, 0);
    lv_label_set_long_mode(view.message, LV_LABEL_LONG_WRAP);
}

esp_err_t bop_library_view_create(lv_obj_t *screen, const bop_library_view_callbacks_t *callbacks)
{
    if (view.root != NULL || screen == NULL || callbacks == NULL) {
        return ESP_ERR_INVALID_STATE;
    }
    view.library = heap_caps_calloc(1, sizeof(*view.library), MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
    view.artist = heap_caps_calloc(1, sizeof(*view.artist), MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
    view.incoming = heap_caps_calloc(
        1, sizeof(*view.incoming), MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
    if (view.library == NULL || view.artist == NULL || view.incoming == NULL) {
        free(view.library);
        free(view.artist);
        free(view.incoming);
        view.library = NULL;
        view.artist = NULL;
        view.incoming = NULL;
        return ESP_ERR_NO_MEM;
    }
    view.callbacks = *callbacks;

    view.root = lv_obj_create(screen);
    lv_obj_remove_style_all(view.root);
    lv_obj_set_size(view.root, VIEW_WIDTH, VIEW_HEIGHT);
    lv_obj_set_pos(view.root, 0, 0);
    lv_obj_set_style_bg_color(view.root, lv_color_hex(BOP_IMAGE_BACKGROUND_RGB), 0);
    lv_obj_set_style_bg_opa(view.root, LV_OPA_COVER, 0);
    lv_obj_add_flag(view.root, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_remove_flag(view.root, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_add_event_cb(view.root, view_event, LV_EVENT_PRESSED, NULL);
    lv_obj_add_event_cb(view.root, view_event, LV_EVENT_PRESS_LOST, NULL);
    lv_obj_add_event_cb(view.root, view_event, LV_EVENT_RELEASED, NULL);

    create_tiles();
    create_controls();
    // The stored library shows right at boot, long before WiFi, the time
    // sync, and the Spotify login finish. Its pictures come from the same
    // cache. The Spotify task later publishes the same list, then the fresh one.
    if (bop_cache_load_library(view.library)) {
        view.library->status = BOP_LIBRARY_READY;
        view.library->complete = true;
        ESP_LOGI(TAG, "Showing %u cached artists and albums", (unsigned)view.library->count);
    }
    render_page();
    lv_obj_add_flag(view.root, LV_OBJ_FLAG_HIDDEN);
    ESP_LOGI(TAG, "Library grid is ready");
    return ESP_OK;
}

void bop_library_view_show(void)
{
    if (view.root == NULL) {
        return;
    }
    // A parent may have saved an album or followed an artist meanwhile.
    bop_spotify_request_library_refresh();
    view.visible = true;
    lv_obj_remove_flag(view.root, LV_OBJ_FLAG_HIDDEN);
    render_page();
    request_covers();
}

void bop_library_view_hide(void)
{
    if (view.root == NULL) {
        return;
    }
    view.visible = false;
    view.press_active = false;
    lv_obj_add_flag(view.root, LV_OBJ_FLAG_HIDDEN);
}

// A published list replaces the shown one only for the open artist, and a
// loading or failed list never replaces a ready one: a list from the flash
// cache stays when Spotify cannot be reached.
static bool take_artist_list(void)
{
    bool same_artist = strcmp(view.incoming->artist_id, view.artist_id) == 0;
    bool keeps_ready = artist_list_matches()
        && view.artist->status == BOP_LIBRARY_READY
        && view.incoming->status != BOP_LIBRARY_READY;
    if (!same_artist || keeps_ready) {
        return false;
    }
    swap_artist_lists();
    return true;
}

static void clamp_page(size_t *page)
{
    size_t pages = page_count();
    if (*page >= pages) {
        *page = pages > 0 ? pages - 1 : 0;
    }
}

void bop_library_view_update(const bop_library_view_playback_t *playback)
{
    if (view.root == NULL || playback == NULL) {
        return;
    }
    bool render = false;
    const char *album_id = playback->available && playback->album_id != NULL
        ? playback->album_id
        : "";
    if (strcmp(view.playing_album_id, album_id) != 0 || view.is_playing != playback->is_playing) {
        strlcpy(view.playing_album_id, album_id, sizeof(view.playing_album_id));
        view.is_playing = playback->is_playing;
        render = true;
    }
    bool playback_available = playback->available;
    if (bop_spotify_get_library_generation() != view.library_generation
        && bop_spotify_get_library(view.library)) {
        view.library_generation = view.library->generation;
        render = true;
    }
    if (bop_spotify_get_artist_albums_generation() != view.artist_generation
        && bop_spotify_get_artist_albums(view.incoming)) {
        view.artist_generation = view.incoming->generation;
        render = take_artist_list() || render;
    }
    if (render) {
        clamp_page(shown_page());
    }
    // A preloaded cover for another page changes nothing on screen, so only a
    // cover of the shown page asks for a redraw.
    bop_cover_t *cover = NULL;
    while (bop_cover_receive(&cover)) {
        render = render || entry_is_shown(cover->album_id);
        store_cover(cover);
    }
    if (render) {
        render_page();
        prune_covers();
    }
    if (playback_available != view.resume_visible) {
        view.resume_visible = playback_available;
        set_hidden(view.resume, !playback_available);
    }
    if (view.visible) {
        request_covers();
    }
}

void bop_library_view_set_pending(const char *album_id)
{
    if (view.root == NULL) {
        return;
    }
    strlcpy(
        view.pending_album_id,
        album_id != NULL ? album_id : "",
        sizeof(view.pending_album_id));
    render_page();
}

void bop_library_view_set_waiting(const char *album_id)
{
    if (view.root == NULL) {
        return;
    }
    const char *id = album_id != NULL ? album_id : "";
    if (strcmp(view.waiting_album_id, id) == 0) {
        return;
    }
    strlcpy(view.waiting_album_id, id, sizeof(view.waiting_album_id));
    render_page();
}

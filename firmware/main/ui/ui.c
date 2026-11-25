// SPDX-FileCopyrightText: 2026 Mark Phelps
// SPDX-License-Identifier: Apache-2.0

#include "ui.h"

#include <math.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#include "bsp/display.h"
#include "esp_log.h"
#include "esp_timer.h"
#include "freertos/FreeRTOS.h"
#include "freertos/queue.h"
#include "freertos/task.h"
#include "lvgl.h"
#include "misc/cache/instance/lv_image_cache.h"
#include "art.h"
#include "library_view.h"
#include "../motion.h"
#include "../power.h"
#include "../spotify/spotify.h"
#include "../wifi.h"

LV_FONT_DECLARE(lv_font_montserrat_bold_24);

#define SCREEN_WIDTH 368
#define SCREEN_HEIGHT 448
#define ART_SIZE 368
#define INFO_TOP 368
#define UI_TIMER_MS 250
#define SWIPE_THRESHOLD 48
#define TAP_THRESHOLD 20
#define UI_TASK_CORE 1
#define NORMAL_BRIGHTNESS 85
#define SCREENSAVER_BRIGHTNESS 40
#define OFF_BRIGHTNESS 0
// AMOLED pixels age with the light they emit, so a still screen burns in. Half
// a minute after the last touch or move of the board, a dim clock drifting over
// black replaces the screen, during playback too. Two minutes after the last
// touch, the screen goes dark. A touch or a move brings the screen back.
#define SCREENSAVER_TIMEOUT_US (30LL * 1000000)
#define SCREEN_OFF_TIMEOUT_US (2LL * 60 * 1000000)
// The clock moves this far per UI tick, 8 pixels a second. Even steps keep its
// invalidated areas on the even-pixel grid that the panel needs.
#define SCREENSAVER_STEP 2
#define SCREENSAVER_CLOCK_COLOR 0xA0A0A0
// Unix time of 2024-01-01. An earlier clock has not been synchronized yet.
#define CLOCK_VALID_AFTER 1704067200
// A touch or a lift of the board keeps the radio awake this long, and asks the
// Spotify task to get ready, at most once in the interval.
#define INPUT_AWAKE_MS 30000
#define INPUT_PREPARE_INTERVAL_US (30LL * 1000000)
// Static text and the progress bar move along a small loop. Even steps keep
// every invalidated area on the even-pixel grid that the panel needs.
#define PIXEL_SHIFT_INTERVAL_US (60LL * 1000000)
#define LOW_BATTERY_PERCENT 15
// Kid mode: the albums button sits at the right end of the info band. Its tap
// area is the whole band right of the title, larger than the drawn button.
#define HOME_BUTTON_SIZE 56
#define HOME_BUTTON_LEFT 300
#define HOME_TAP_LEFT 284
#define HOME_GLYPH_SQUARE 14
#define HOME_GLYPH_GAP 6
// A playback that ends returns to the album grid, but not while a new album is
// still starting and Spotify reports nothing playing for a moment.
#define ALBUM_START_GRACE_US (8LL * 1000000)
#define ART_CORNER_RADIUS BOP_ART_CORNER_RADIUS
#define FEEDBACK_SIZE 96
#define FEEDBACK_DURATION_MS 750
#define VOLUME_UPDATE_INTERVAL_US 150000
#define VOLUME_FINAL_DELAY_US 400000
#define VOLUME_CURVE_EXPONENT 1.8f
#define ATTRIBUTION_QR_SIZE 208
// "episode" is the longer of the two path segments, so it sizes the buffer.
#define ATTRIBUTION_URL_CAPACITY (sizeof("https://open.spotify.com/episode/") + BOP_TRACK_ID_CAPACITY)

static const char *TAG = "bop_ui";

typedef enum {
    GESTURE_AXIS_NONE,
    GESTURE_AXIS_HORIZONTAL,
    GESTURE_AXIS_VERTICAL,
} gesture_axis_t;

typedef struct {
    lv_obj_t *screen;
    lv_obj_t *band;
    lv_obj_t *art_placeholder;
    lv_obj_t *art_image;
    lv_obj_t *title;
    lv_obj_t *artist;
    lv_obj_t *progress;
    lv_obj_t *elapsed;
    lv_obj_t *total;
    lv_obj_t *idle;
    lv_obj_t *gesture_layer;
    lv_obj_t *offline;
    lv_obj_t *battery;
    lv_obj_t *home_button;
    lv_obj_t *feedback;
    lv_obj_t *feedback_glyph;
    lv_obj_t *attribution;
    lv_obj_t *attribution_qr;
    lv_obj_t *attribution_caption;
    lv_obj_t *screensaver;
    lv_obj_t *screensaver_clock;
    lv_obj_t *wait;
    QueueHandle_t art_queue;
    bop_album_art_t *active_art;
    playback_state_t state;
    int64_t state_received_us;
    uint32_t rendered_change_counter;
    uint32_t optimistic_change_counter;
    uint32_t next_feedback_request_id;
    int64_t optimistic_until_us;
    bool optimistic_toggle;
    bool attribution_visible;
    bool battery_visible;
    bool battery_low;
    char battery_text[16];
    int display_brightness;
    uint8_t pixel_shift_index;
    int64_t pixel_shift_changed_us;
    bool screensaver_visible;
    int32_t screensaver_x;
    int32_t screensaver_y;
    int32_t screensaver_step_x;
    int32_t screensaver_step_y;
    char screensaver_text[sizeof("00:00")];
    uint32_t motion_seen;
    int64_t input_prepared_us;
    bool connected;
    bool library_visible;
    uint32_t album_request_id;
    int64_t album_started_us;
    bool press_active;
    bool press_moved;
    bool volume_drag_available;
    bool volume_last_sent_valid;
    bool volume_enqueue_attempted;
    bool volume_final_pending;
    bool volume_target_awaiting_snapshot;
    gesture_axis_t gesture_axis;
    lv_point_t press_point;
    lv_point_t volume_last_point;
    uint8_t volume_start_percent;
    uint8_t volume_target_percent;
    uint8_t volume_last_sent_percent;
    uint32_t volume_snapshot_generation;
    int64_t volume_last_attempt_us;
    int64_t volume_final_deadline_us;
    int64_t volume_feedback_until_us;
} ui_context_t;

static ui_context_t ui;

static void show_library(void);

static lv_obj_t *make_label(
    lv_obj_t *parent,
    const lv_font_t *font,
    lv_color_t color,
    int32_t x,
    int32_t y,
    int32_t width,
    int32_t height)
{
    lv_obj_t *label = lv_label_create(parent);
    lv_obj_set_pos(label, x, y);
    lv_obj_set_size(label, width, height);
    lv_obj_set_style_text_font(label, font, 0);
    lv_obj_set_style_text_color(label, color, 0);
    lv_obj_set_style_pad_all(label, 0, 0);
    return label;
}

static lv_obj_t *make_logo_line(lv_obj_t *parent, int32_t y, int32_t width)
{
    lv_obj_t *line = lv_obj_create(parent);
    lv_obj_remove_style_all(line);
    lv_obj_set_size(line, width, 5);
    lv_obj_align(line, LV_ALIGN_CENTER, 0, y);
    lv_obj_set_style_bg_color(line, lv_color_hex(0x071107), 0);
    lv_obj_set_style_bg_opa(line, LV_OPA_COVER, 0);
    lv_obj_set_style_radius(line, LV_RADIUS_CIRCLE, 0);
    return line;
}

static lv_obj_t *make_spotify_mark(lv_obj_t *parent, int32_t size)
{
    lv_obj_t *mark = lv_obj_create(parent);
    lv_obj_remove_style_all(mark);
    lv_obj_set_size(mark, size, size);
    lv_obj_set_style_bg_color(mark, lv_color_hex(0x1ED760), 0);
    lv_obj_set_style_bg_opa(mark, LV_OPA_COVER, 0);
    lv_obj_set_style_radius(mark, LV_RADIUS_CIRCLE, 0);
    lv_obj_remove_flag(mark, LV_OBJ_FLAG_SCROLLABLE);

    int32_t line_height = size / 7;
    int32_t line_width = size * 3 / 4;
    for (int32_t index = 0; index < 3; ++index) {
        lv_obj_t *line = lv_obj_create(mark);
        lv_obj_remove_style_all(line);
        lv_obj_set_size(line, line_width - index * size / 10, line_height);
        lv_obj_align(line, LV_ALIGN_CENTER, 0, (index - 1) * size / 4);
        lv_obj_set_style_bg_color(line, lv_color_hex(0x000000), 0);
        lv_obj_set_style_bg_opa(line, LV_OPA_COVER, 0);
        lv_obj_set_style_radius(line, LV_RADIUS_CIRCLE, 0);
    }
    return mark;
}

static void create_idle_state(void)
{
    ui.idle = lv_obj_create(ui.screen);
    lv_obj_remove_style_all(ui.idle);
    lv_obj_set_size(ui.idle, SCREEN_WIDTH, SCREEN_HEIGHT);
    lv_obj_set_pos(ui.idle, 0, 0);
    lv_obj_remove_flag(ui.idle, LV_OBJ_FLAG_SCROLLABLE);

    lv_obj_t *logo = lv_obj_create(ui.idle);
    lv_obj_remove_style_all(logo);
    lv_obj_set_size(logo, 88, 88);
    lv_obj_align(logo, LV_ALIGN_CENTER, 0, -42);
    lv_obj_set_style_bg_color(logo, lv_color_hex(0x1ED760), 0);
    lv_obj_set_style_bg_opa(logo, LV_OPA_COVER, 0);
    lv_obj_set_style_radius(logo, LV_RADIUS_CIRCLE, 0);
    make_logo_line(logo, -18, 56);
    make_logo_line(logo, 0, 50);
    make_logo_line(logo, 18, 42);

    lv_obj_t *message = make_label(
        ui.idle,
        &lv_font_montserrat_24,
        lv_color_hex(0xF4F4F4),
        24,
        260,
        320,
        28);
    lv_label_set_text(message, "nothing playing");
    lv_obj_set_style_text_align(message, LV_TEXT_ALIGN_CENTER, 0);

    lv_obj_t *hint = make_label(
        ui.idle,
        &lv_font_montserrat_14,
        lv_color_hex(0xA7A7A7),
        24,
        296,
        320,
        22);
    lv_label_set_text(hint, "Start Spotify on any device");
    lv_obj_set_style_text_align(hint, LV_TEXT_ALIGN_CENTER, 0);
}

// Four squares draw a grid of albums, a picture a child knows without words.
// The button is drawing only: the gesture layer above it takes the tap.
static void create_home_button(void)
{
    ui.home_button = lv_obj_create(ui.screen);
    lv_obj_remove_style_all(ui.home_button);
    lv_obj_remove_flag(ui.home_button, LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_size(ui.home_button, HOME_BUTTON_SIZE, HOME_BUTTON_SIZE);
    lv_obj_set_pos(
        ui.home_button,
        HOME_BUTTON_LEFT,
        INFO_TOP + (SCREEN_HEIGHT - INFO_TOP - HOME_BUTTON_SIZE) / 2);
    lv_obj_set_style_radius(ui.home_button, LV_RADIUS_CIRCLE, 0);
    lv_obj_set_style_bg_color(ui.home_button, lv_color_hex(0x2A2A2A), 0);
    lv_obj_set_style_bg_opa(ui.home_button, LV_OPA_COVER, 0);

    int32_t glyph = 2 * HOME_GLYPH_SQUARE + HOME_GLYPH_GAP;
    int32_t inset = (HOME_BUTTON_SIZE - glyph) / 2;
    for (int32_t index = 0; index < 4; ++index) {
        lv_obj_t *square = lv_obj_create(ui.home_button);
        lv_obj_remove_style_all(square);
        lv_obj_remove_flag(square, LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_SCROLLABLE);
        lv_obj_set_size(square, HOME_GLYPH_SQUARE, HOME_GLYPH_SQUARE);
        lv_obj_set_pos(
            square,
            inset + (index % 2) * (HOME_GLYPH_SQUARE + HOME_GLYPH_GAP),
            inset + (index / 2) * (HOME_GLYPH_SQUARE + HOME_GLYPH_GAP));
        lv_obj_set_style_radius(square, 3, 0);
        lv_obj_set_style_bg_color(square, lv_color_hex(0xF4F4F4), 0);
        lv_obj_set_style_bg_opa(square, LV_OPA_COVER, 0);
    }
}

static void create_playing_state(void)
{
    ui.band = lv_obj_create(ui.screen);
    lv_obj_remove_style_all(ui.band);
    lv_obj_set_pos(ui.band, 0, INFO_TOP);
    lv_obj_set_size(ui.band, SCREEN_WIDTH, SCREEN_HEIGHT - INFO_TOP);
    lv_obj_set_style_bg_color(ui.band, lv_color_hex(0x181818), 0);
    lv_obj_set_style_bg_grad_color(ui.band, lv_color_hex(0x080808), 0);
    lv_obj_set_style_bg_grad_dir(ui.band, LV_GRAD_DIR_VER, 0);
    lv_obj_set_style_bg_opa(ui.band, LV_OPA_COVER, 0);

    ui.art_placeholder = lv_obj_create(ui.screen);
    lv_obj_remove_style_all(ui.art_placeholder);
    lv_obj_set_pos(ui.art_placeholder, 0, 0);
    lv_obj_set_size(ui.art_placeholder, ART_SIZE, ART_SIZE);
    lv_obj_set_style_bg_color(ui.art_placeholder, lv_color_hex(0x181818), 0);
    lv_obj_set_style_bg_opa(ui.art_placeholder, LV_OPA_COVER, 0);
    lv_obj_set_style_radius(ui.art_placeholder, ART_CORNER_RADIUS, 0);

    // The art arrives with its corners already rounded (art.c), so LVGL draws
    // it as a plain image without a mask.
    ui.art_image = lv_image_create(ui.screen);
    lv_obj_add_flag(ui.art_image, LV_OBJ_FLAG_HIDDEN);

    ui.title = make_label(
        ui.screen,
        &lv_font_montserrat_bold_24,
        lv_color_hex(0xFFFFFF),
        12,
        INFO_TOP,
        272,
        32);
    lv_label_set_long_mode(ui.title, LV_LABEL_LONG_SCROLL_CIRCULAR);

    ui.artist = make_label(
        ui.screen,
        &lv_font_montserrat_14,
        lv_color_hex(0xB3B3B3),
        12,
        INFO_TOP + 32,
        272,
        17);
    lv_label_set_long_mode(ui.artist, LV_LABEL_LONG_SCROLL_CIRCULAR);

    // The bar and the total time end left of the albums button.
    ui.progress = lv_bar_create(ui.screen);
    lv_obj_set_pos(ui.progress, 16, INFO_TOP + 51);
    lv_obj_set_size(ui.progress, 256, 3);
    lv_bar_set_range(ui.progress, 0, 1000);
    lv_obj_set_style_radius(ui.progress, LV_RADIUS_CIRCLE, LV_PART_MAIN);
    lv_obj_set_style_radius(ui.progress, LV_RADIUS_CIRCLE, LV_PART_INDICATOR);
    lv_obj_set_style_bg_color(ui.progress, lv_color_hex(0x5E5E5E), LV_PART_MAIN);
    lv_obj_set_style_bg_opa(ui.progress, LV_OPA_COVER, LV_PART_MAIN);
    lv_obj_set_style_bg_color(ui.progress, lv_color_hex(0x1ED760), LV_PART_INDICATOR);
    lv_obj_set_style_bg_opa(ui.progress, LV_OPA_COVER, LV_PART_INDICATOR);

    ui.elapsed = make_label(
        ui.screen,
        &lv_font_montserrat_14,
        lv_color_hex(0xA7A7A7),
        24,
        INFO_TOP + 55,
        88,
        17);
    ui.total = make_label(
        ui.screen,
        &lv_font_montserrat_14,
        lv_color_hex(0xA7A7A7),
        184,
        INFO_TOP + 55,
        88,
        17);
    lv_obj_set_style_text_align(ui.total, LV_TEXT_ALIGN_RIGHT, 0);

    create_home_button();
}

static bool point_on_home_button(const lv_point_t *point)
{
    return point->x >= HOME_TAP_LEFT && point->y >= INFO_TOP;
}

static void feedback_opacity(void *object, int32_t value)
{
    lv_obj_set_style_opa(object, value, 0);
}

static void hide_feedback(lv_anim_t *animation)
{
    lv_obj_add_flag(animation->var, LV_OBJ_FLAG_HIDDEN);
}

static void set_feedback_text(const char *text)
{
    lv_anim_delete(ui.feedback, feedback_opacity);
    lv_label_set_text(ui.feedback_glyph, text);
    lv_obj_remove_flag(ui.feedback, LV_OBJ_FLAG_HIDDEN);
    lv_obj_set_style_opa(ui.feedback, LV_OPA_COVER, 0);
}

static void show_feedback(const char *glyph)
{
    set_feedback_text(glyph);

    lv_anim_t animation;
    lv_anim_init(&animation);
    lv_anim_set_var(&animation, ui.feedback);
    lv_anim_set_exec_cb(&animation, feedback_opacity);
    lv_anim_set_values(&animation, LV_OPA_COVER, LV_OPA_COVER);
    lv_anim_set_duration(&animation, 1);
    lv_anim_set_delay(&animation, FEEDBACK_DURATION_MS);
    lv_anim_set_completed_cb(&animation, hide_feedback);
    lv_anim_start(&animation);
}

static void hide_attribution(lv_event_t *event)
{
    (void)event;
    lv_obj_add_flag(ui.attribution, LV_OBJ_FLAG_HIDDEN);
    ui.attribution_visible = false;
}

static void show_attribution(void)
{
    if (!ui.state.available || ui.state.track_id[0] == '\0') {
        return;
    }

    char url[ATTRIBUTION_URL_CAPACITY];
    const char *kind = ui.state.is_episode ? "episode" : "track";
    int written = snprintf(
        url,
        sizeof(url),
        "https://open.spotify.com/%s/%s",
        kind,
        ui.state.track_id);
    if (written < 0 || (size_t)written >= sizeof(url)) {
        ESP_LOGW(TAG, "Track URL is too long for attribution");
        return;
    }
    if (lv_qrcode_update(ui.attribution_qr, url, strlen(url)) != LV_RESULT_OK) {
        ESP_LOGW(TAG, "Could not create Spotify attribution QR code");
        return;
    }
    lv_label_set_text(
        ui.attribution_caption,
        ui.state.is_episode
            ? "Scan to open this episode in Spotify"
            : "Scan to open this track in Spotify");

    ui.attribution_visible = true;
    lv_obj_remove_flag(ui.attribution, LV_OBJ_FLAG_HIDDEN);
    lv_obj_move_foreground(ui.attribution);
}

static void create_attribution_screen(void)
{
    ui.attribution = lv_obj_create(ui.screen);
    lv_obj_remove_style_all(ui.attribution);
    lv_obj_set_size(ui.attribution, SCREEN_WIDTH, SCREEN_HEIGHT);
    lv_obj_set_pos(ui.attribution, 0, 0);
    lv_obj_set_style_bg_color(ui.attribution, lv_color_hex(0x080808), 0);
    lv_obj_set_style_bg_opa(ui.attribution, LV_OPA_COVER, 0);
    lv_obj_add_flag(ui.attribution, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_remove_flag(ui.attribution, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_add_event_cb(ui.attribution, hide_attribution, LV_EVENT_CLICKED, NULL);

    lv_obj_t *mark = make_spotify_mark(ui.attribution, 36);
    lv_obj_align(mark, LV_ALIGN_TOP_MID, 0, 26);
    lv_obj_t *heading = make_label(
        ui.attribution,
        &lv_font_montserrat_bold_24,
        lv_color_hex(0xFFFFFF),
        0,
        70,
        SCREEN_WIDTH,
        28);
    lv_label_set_text(heading, "Spotify");
    lv_obj_set_style_text_align(heading, LV_TEXT_ALIGN_CENTER, 0);

    ui.attribution_qr = lv_qrcode_create(ui.attribution);
    lv_qrcode_set_size(ui.attribution_qr, ATTRIBUTION_QR_SIZE);
    lv_qrcode_set_dark_color(ui.attribution_qr, lv_color_hex(0x000000));
    lv_qrcode_set_light_color(ui.attribution_qr, lv_color_hex(0xFFFFFF));
    lv_obj_align(ui.attribution_qr, LV_ALIGN_TOP_MID, 0, 112);

    ui.attribution_caption = make_label(
        ui.attribution,
        &lv_font_montserrat_14,
        lv_color_hex(0xB3B3B3),
        24,
        336,
        320,
        18);
    lv_label_set_text(ui.attribution_caption, "Scan to open this track in Spotify");
    lv_obj_set_style_text_align(ui.attribution_caption, LV_TEXT_ALIGN_CENTER, 0);

    lv_obj_t *hint = make_label(
        ui.attribution,
        &lv_font_montserrat_14,
        lv_color_hex(0xFFFFFF),
        24,
        378,
        320,
        18);
    lv_label_set_text(hint, "Tap to return");
    lv_obj_set_style_text_align(hint, LV_TEXT_ALIGN_CENTER, 0);

    lv_obj_add_flag(ui.attribution, LV_OBJ_FLAG_HIDDEN);
}

static void set_art_x(void *object, int32_t value)
{
    lv_obj_set_x(object, value);
}

static void animate_swipe(int direction)
{
    lv_obj_t *target = lv_obj_has_flag(ui.art_image, LV_OBJ_FLAG_HIDDEN)
        ? ui.art_placeholder
        : ui.art_image;
    int32_t base = lv_obj_get_x(target);
    lv_anim_delete(target, set_art_x);
    lv_anim_t animation;
    lv_anim_init(&animation);
    lv_anim_set_var(&animation, target);
    lv_anim_set_exec_cb(&animation, set_art_x);
    lv_anim_set_values(&animation, base, base + direction * 38);
    lv_anim_set_duration(&animation, 110);
    lv_anim_set_playback_duration(&animation, 190);
    lv_anim_set_path_cb(&animation, lv_anim_path_ease_out);
    lv_anim_start(&animation);
}

static bool volume_feedback_active(void)
{
    return ui.gesture_axis == GESTURE_AXIS_VERTICAL
        || ui.volume_final_pending
        || esp_timer_get_time() < ui.volume_feedback_until_us;
}

// Without WiFi a tap sends nothing: no command waits in a queue to start music
// long after the tap. A big WAIT stays over the art until WiFi returns.
static void show_wait(void)
{
    lv_obj_remove_flag(ui.wait, LV_OBJ_FLAG_HIDDEN);
    lv_obj_move_foreground(ui.wait);
}

static bool send_gesture_command(spotify_command_t command, uint32_t request_id)
{
    if (!bop_wifi_is_connected()) {
        show_wait();
        return false;
    }
    spotify_command_submission_t submission = bop_spotify_enqueue_command(command, request_id);
    if (submission == SPOTIFY_COMMAND_SUBMISSION_QUEUED) {
        return true;
    }
    if (submission == SPOTIFY_COMMAND_SUBMISSION_RATE_LIMITED
        && request_id != 0
        && !volume_feedback_active()) {
        show_feedback(LV_SYMBOL_WARNING);
    }
    return false;
}

static void handle_tap(void)
{
    bool was_playing = ui.state.is_playing;
    uint32_t request_id = ++ui.next_feedback_request_id;
    if (request_id == 0) {
        request_id = ++ui.next_feedback_request_id;
    }
    if (!send_gesture_command(SPOTIFY_COMMAND_TOGGLE, request_id)) {
        return;
    }

    int64_t now = esp_timer_get_time();
    if (was_playing && ui.state.duration_ms > 0) {
        int64_t elapsed_us = now - ui.state_received_us;
        if (elapsed_us > 0) {
            uint64_t progress = ui.state.progress_ms + (uint64_t)elapsed_us / 1000;
            ui.state.progress_ms = progress > ui.state.duration_ms
                ? ui.state.duration_ms
                : (uint32_t)progress;
        }
    }
    ui.state.is_playing = !was_playing;
    ui.state_received_us = now;
    ui.optimistic_toggle = true;
    ui.optimistic_change_counter = ui.rendered_change_counter;
    ui.optimistic_until_us = ui.state_received_us + 2000000;
}

static void set_display_brightness(int brightness)
{
    if (ui.display_brightness == brightness) {
        return;
    }
    esp_err_t error = bsp_display_brightness_set(brightness);
    if (error != ESP_OK) {
        ESP_LOGW(TAG, "Could not set display brightness to %d%%: %s",
            brightness, esp_err_to_name(error));
        return;
    }
    ui.display_brightness = brightness;
    ESP_LOGI(TAG, "Display brightness: %d%%", brightness);
}

static void restore_normal_brightness(void)
{
    set_display_brightness(NORMAL_BRIGHTNESS);
}

static void show_screensaver(void)
{
    if (ui.screensaver_visible) {
        return;
    }
    ui.screensaver_visible = true;
    lv_obj_remove_flag(ui.screensaver, LV_OBJ_FLAG_HIDDEN);
}

static void hide_screensaver(void)
{
    if (!ui.screensaver_visible) {
        return;
    }
    ui.screensaver_visible = false;
    lv_obj_add_flag(ui.screensaver, LV_OBJ_FLAG_HIDDEN);
}

// Asleep is the screensaver or a dark screen. Either way nobody sees what a tap
// would change, so the first touch only wakes the screen.
static bool screen_is_asleep(void)
{
    return ui.screensaver_visible || ui.display_brightness == OFF_BRIGHTNESS;
}

// A touch or a lift of the board: a tap may follow. The radio stays awake for
// it, also on battery, and the Spotify task renews a token that would expire
// soon and reads the play state.
static void prepare_for_input(void)
{
    int64_t now = esp_timer_get_time();
    if (ui.input_prepared_us != 0 && now - ui.input_prepared_us < INPUT_PREPARE_INTERVAL_US) {
        return;
    }
    ui.input_prepared_us = now;
    bop_wifi_keep_awake_for(INPUT_AWAKE_MS);
    bop_spotify_wake();
}

// The idle timers read LVGL's own inactivity clock, which every touch resets,
// including a touch on the attribution screen that never reaches this layer.
// This call only wakes the screen at once instead of on the next UI tick.
static void record_touch(void)
{
    hide_screensaver();
    restore_normal_brightness();
    prepare_for_input();
}

static void format_volume_feedback(uint8_t volume_percent, char text[sizeof("100%")])
{
    snprintf(text, sizeof("100%"), "%u%%", (unsigned int)volume_percent);
}

static void hold_volume_feedback(uint8_t volume_percent)
{
    char text[sizeof("100%")];
    format_volume_feedback(volume_percent, text);
    set_feedback_text(text);
}

static bool volume_target_is_sent(void)
{
    return ui.volume_last_sent_valid
        && ui.volume_target_percent == ui.volume_last_sent_percent;
}

static bool volume_enqueue_due(int64_t now)
{
    return !ui.volume_enqueue_attempted
        || now - ui.volume_last_attempt_us >= VOLUME_UPDATE_INTERVAL_US;
}

static bool enqueue_volume_target(int64_t now)
{
    if (volume_target_is_sent()) {
        return true;
    }
    ui.volume_enqueue_attempted = true;
    ui.volume_last_attempt_us = now;
    if (!bop_spotify_enqueue_volume(ui.volume_target_percent)) {
        ESP_LOGW(TAG, "Spotify volume target was not queued");
        return false;
    }
    ui.volume_last_sent_percent = ui.volume_target_percent;
    ui.volume_last_sent_valid = true;
    ui.volume_snapshot_generation = bop_spotify_get_volume_request_generation();
    ui.volume_target_awaiting_snapshot = true;
    return true;
}

static uint8_t calculate_volume_target(int32_t vertical)
{
    float normalized = (float)abs(vertical) / (float)ART_SIZE;
    if (normalized > 1.0f) {
        normalized = 1.0f;
    }
    int32_t change = (int32_t)(powf(normalized, VOLUME_CURVE_EXPONENT) * 100.0f + 0.5f);
    int32_t target = vertical < 0
        ? (int32_t)ui.volume_start_percent + change
        : (int32_t)ui.volume_start_percent - change;
    if (target < 0) {
        target = 0;
    } else if (target > 100) {
        target = 100;
    }
    return (uint8_t)target;
}

static void update_drag(const lv_point_t *point)
{
    if (point->x == ui.volume_last_point.x && point->y == ui.volume_last_point.y) {
        return;
    }
    ui.volume_last_point = *point;

    int32_t horizontal = point->x - ui.press_point.x;
    int32_t vertical = point->y - ui.press_point.y;
    int32_t horizontal_distance = abs(horizontal);
    int32_t vertical_distance = abs(vertical);
    if (horizontal_distance > TAP_THRESHOLD || vertical_distance > TAP_THRESHOLD) {
        ui.press_moved = true;
    }
    bool vertical_started = false;
    if (ui.gesture_axis == GESTURE_AXIS_NONE) {
        if (horizontal_distance >= SWIPE_THRESHOLD
            && horizontal_distance > vertical_distance * 3 / 2) {
            ui.gesture_axis = GESTURE_AXIS_HORIZONTAL;
        } else if (ui.volume_drag_available
            && vertical_distance >= SWIPE_THRESHOLD
            && vertical_distance > horizontal_distance * 3 / 2) {
            ui.gesture_axis = GESTURE_AXIS_VERTICAL;
            vertical_started = true;
        }
    }
    if (ui.gesture_axis != GESTURE_AXIS_VERTICAL) {
        return;
    }

    int64_t now = esp_timer_get_time();
    ui.volume_final_pending = true;
    ui.volume_final_deadline_us = now + VOLUME_FINAL_DELAY_US;
    uint8_t target = calculate_volume_target(vertical);
    bool target_changed = target != ui.volume_target_percent;
    ui.volume_target_percent = target;
    if (target_changed || vertical_started) {
        hold_volume_feedback(target);
    }
    if (!volume_target_is_sent() && volume_enqueue_due(now)) {
        enqueue_volume_target(now);
    }
}

static void finish_volume_update(int64_t now)
{
    if (!ui.volume_final_pending || now < ui.volume_final_deadline_us) {
        return;
    }
    if (!volume_target_is_sent()) {
        if (!volume_enqueue_due(now)) {
            ui.volume_final_deadline_us = ui.volume_last_attempt_us
                + VOLUME_UPDATE_INTERVAL_US;
            return;
        }
        if (!enqueue_volume_target(now)) {
            ui.volume_final_deadline_us = now + VOLUME_UPDATE_INTERVAL_US;
            return;
        }
    }
    if (ui.press_active) {
        return;
    }
    char text[sizeof("100%")];
    format_volume_feedback(ui.volume_target_percent, text);
    ui.volume_feedback_until_us = now + (int64_t)FEEDBACK_DURATION_MS * 1000;
    show_feedback(text);
    ui.volume_final_pending = false;
}

static void cancel_volume_gesture(void)
{
    bool vertical_press = ui.gesture_axis == GESTURE_AXIS_VERTICAL;
    bool available_press = ui.press_active
        && ui.volume_drag_available
        && ui.gesture_axis == GESTURE_AXIS_NONE;
    if (!vertical_press
        && !ui.volume_final_pending
        && !ui.volume_target_awaiting_snapshot
        && !available_press) {
        return;
    }
    lv_anim_delete(ui.feedback, feedback_opacity);
    lv_obj_add_flag(ui.feedback, LV_OBJ_FLAG_HIDDEN);
    if (vertical_press || available_press) {
        ui.press_active = false;
        ui.gesture_axis = GESTURE_AXIS_NONE;
    }
    ui.volume_drag_available = false;
    ui.volume_final_pending = false;
    ui.volume_target_awaiting_snapshot = false;
    ui.volume_feedback_until_us = 0;
}

static void gesture_event(lv_event_t *event)
{
    lv_event_code_t code = lv_event_get_code(event);
    lv_indev_t *input = lv_indev_active();
    if (input == NULL) {
        return;
    }
    if (code == LV_EVENT_PRESSED) {
        // A touch on a dark screen or on the screensaver only wakes it. Nobody
        // can see what a tap or a swipe there would change, so the press goes
        // no further.
        bool screen_was_asleep = screen_is_asleep();
        record_touch();
        if (screen_was_asleep) {
            ui.press_active = false;
            return;
        }
        lv_indev_get_point(input, &ui.press_point);
        ui.volume_last_point = ui.press_point;
        ui.press_active = true;
        ui.press_moved = false;
        ui.gesture_axis = GESTURE_AXIS_NONE;
        // Without WiFi a volume target would wait in its queue, so the drag
        // stays off.
        ui.volume_drag_available = ui.state.available
            && ui.state.volume_available
            && !ui.attribution_visible
            && bop_wifi_is_connected();
        bool use_local_target = ui.volume_final_pending
            || ui.volume_target_awaiting_snapshot;
        ui.volume_start_percent = use_local_target
            ? ui.volume_target_percent
            : ui.state.volume_percent;
        if (!use_local_target) {
            ui.volume_target_percent = ui.volume_start_percent;
            ui.volume_last_sent_percent = ui.volume_start_percent;
            ui.volume_last_sent_valid = true;
        }
        return;
    }
    if (code == LV_EVENT_PRESSING && ui.press_active) {
        record_touch();
        lv_point_t point;
        lv_indev_get_point(input, &point);
        update_drag(&point);
        return;
    }
    if (code == LV_EVENT_LONG_PRESSED
        && ui.press_active
        && !ui.press_moved
        && ui.gesture_axis == GESTURE_AXIS_NONE) {
        ui.press_active = false;
        show_attribution();
        return;
    }
    if (code != LV_EVENT_RELEASED || !ui.press_active) {
        return;
    }

    lv_point_t released;
    lv_indev_get_point(input, &released);
    update_drag(&released);
    ui.press_active = false;
    int32_t horizontal = released.x - ui.press_point.x;
    int32_t vertical = released.y - ui.press_point.y;
    int32_t horizontal_distance = abs(horizontal);
    int32_t vertical_distance = abs(vertical);
    if (ui.gesture_axis == GESTURE_AXIS_VERTICAL) {
        ui.volume_final_deadline_us = esp_timer_get_time() + VOLUME_FINAL_DELAY_US;
        ui.gesture_axis = GESTURE_AXIS_NONE;
        return;
    }
    if (ui.gesture_axis == GESTURE_AXIS_HORIZONTAL
        && horizontal_distance >= SWIPE_THRESHOLD) {
        if (horizontal < 0) {
            animate_swipe(-1);
            send_gesture_command(SPOTIFY_COMMAND_PREVIOUS, 0);
        } else {
            animate_swipe(1);
            send_gesture_command(SPOTIFY_COMMAND_NEXT, 0);
        }
    } else if (ui.gesture_axis == GESTURE_AXIS_NONE
        && horizontal_distance <= TAP_THRESHOLD
        && vertical_distance <= TAP_THRESHOLD) {
        if (point_on_home_button(&ui.press_point)) {
            show_library();
        } else {
            handle_tap();
        }
    }
    ui.gesture_axis = GESTURE_AXIS_NONE;
}

// The banner shows over the player and the grid alike while WiFi is down.
static void create_offline_indicator(void)
{
    ui.offline = make_label(
        ui.screen,
        &lv_font_montserrat_14,
        lv_color_hex(0xF4F4F4),
        0,
        8,
        LV_SIZE_CONTENT,
        18);
    lv_obj_set_width(ui.offline, LV_SIZE_CONTENT);
    lv_label_set_text(ui.offline, LV_SYMBOL_WIFI "  Connecting to WiFi...");
    lv_obj_align(ui.offline, LV_ALIGN_TOP_MID, 0, 8);
    lv_obj_set_style_bg_color(ui.offline, lv_color_hex(0x080808), 0);
    lv_obj_set_style_bg_opa(ui.offline, LV_OPA_70, 0);
    lv_obj_set_style_radius(ui.offline, 9, 0);
    lv_obj_set_style_pad_hor(ui.offline, 8, 0);
    lv_obj_add_flag(ui.offline, LV_OBJ_FLAG_HIDDEN);
}

// The player's WAIT, centered on the art. Only its own backing darkens.
static void create_wait_sign(void)
{
    ui.wait = lv_label_create(ui.screen);
    lv_obj_set_style_text_font(ui.wait, &lv_font_montserrat_48, 0);
    lv_obj_set_style_text_color(ui.wait, lv_color_hex(0xFFFFFF), 0);
    lv_obj_set_style_bg_color(ui.wait, lv_color_hex(0x000000), 0);
    lv_obj_set_style_bg_opa(ui.wait, LV_OPA_70, 0);
    lv_obj_set_style_radius(ui.wait, 12, 0);
    lv_obj_set_style_pad_hor(ui.wait, 12, 0);
    lv_label_set_text(ui.wait, "WAIT");
    lv_obj_align(ui.wait, LV_ALIGN_CENTER, 0, ART_SIZE / 2 - SCREEN_HEIGHT / 2);
    lv_obj_add_flag(ui.wait, LV_OBJ_FLAG_HIDDEN);
}

static void create_battery_indicator(void)
{
    ui.battery = make_label(
        ui.screen,
        &lv_font_montserrat_14,
        lv_color_hex(0xF4F4F4),
        12,
        8,
        80,
        18);
    lv_obj_set_width(ui.battery, LV_SIZE_CONTENT);
    lv_obj_set_style_bg_color(ui.battery, lv_color_hex(0x080808), 0);
    lv_obj_set_style_bg_opa(ui.battery, LV_OPA_70, 0);
    lv_obj_set_style_pad_hor(ui.battery, 4, 0);
    lv_obj_add_flag(ui.battery, LV_OBJ_FLAG_HIDDEN);
}

static void create_feedback_layer(void)
{
    ui.feedback = lv_obj_create(ui.screen);
    lv_obj_remove_style_all(ui.feedback);
    lv_obj_set_size(ui.feedback, FEEDBACK_SIZE, FEEDBACK_SIZE);
    lv_obj_align(ui.feedback, LV_ALIGN_TOP_MID, 0, (ART_SIZE - FEEDBACK_SIZE) / 2);
    lv_obj_set_style_bg_color(ui.feedback, lv_color_hex(0x080808), 0);
    lv_obj_set_style_bg_opa(ui.feedback, LV_OPA_80, 0);
    lv_obj_set_style_radius(ui.feedback, LV_RADIUS_CIRCLE, 0);
    lv_obj_remove_flag(ui.feedback, LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_add_flag(ui.feedback, LV_OBJ_FLAG_HIDDEN);

    ui.feedback_glyph = lv_label_create(ui.feedback);
    lv_obj_set_style_text_font(ui.feedback_glyph, &lv_font_montserrat_24, 0);
    lv_obj_set_style_text_color(ui.feedback_glyph, lv_color_hex(0xFFFFFF), 0);
    lv_obj_center(ui.feedback_glyph);

    ui.gesture_layer = lv_obj_create(ui.screen);
    lv_obj_remove_style_all(ui.gesture_layer);
    lv_obj_set_size(ui.gesture_layer, SCREEN_WIDTH, SCREEN_HEIGHT);
    lv_obj_set_pos(ui.gesture_layer, 0, 0);
    lv_obj_add_flag(ui.gesture_layer, LV_OBJ_FLAG_CLICKABLE);
    lv_obj_remove_flag(ui.gesture_layer, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_add_event_cb(ui.gesture_layer, gesture_event, LV_EVENT_PRESSED, NULL);
    lv_obj_add_event_cb(ui.gesture_layer, gesture_event, LV_EVENT_PRESSING, NULL);
    lv_obj_add_event_cb(ui.gesture_layer, gesture_event, LV_EVENT_RELEASED, NULL);
    lv_obj_add_event_cb(ui.gesture_layer, gesture_event, LV_EVENT_LONG_PRESSED, NULL);
    lv_obj_move_foreground(ui.feedback);
}

static void show_playing(bool playing)
{
    lv_obj_t *playing_objects[] = {
        ui.band,
        ui.art_placeholder,
        ui.title,
        ui.artist,
        ui.progress,
        ui.elapsed,
        ui.total,
    };
    for (size_t index = 0; index < sizeof(playing_objects) / sizeof(playing_objects[0]); ++index) {
        if (playing) {
            lv_obj_remove_flag(playing_objects[index], LV_OBJ_FLAG_HIDDEN);
        } else {
            lv_obj_add_flag(playing_objects[index], LV_OBJ_FLAG_HIDDEN);
        }
    }
    if (!playing) {
        lv_obj_add_flag(ui.art_image, LV_OBJ_FLAG_HIDDEN);
        lv_obj_remove_flag(ui.idle, LV_OBJ_FLAG_HIDDEN);
    } else {
        lv_obj_add_flag(ui.idle, LV_OBJ_FLAG_HIDDEN);
    }
}

static uint32_t darken_color(uint32_t rgb)
{
    uint32_t red = ((rgb >> 16) & 0xff) * 42 / 100;
    uint32_t green = ((rgb >> 8) & 0xff) * 42 / 100;
    uint32_t blue = (rgb & 0xff) * 42 / 100;
    return (red << 16) | (green << 8) | blue;
}

static void apply_art(bop_album_art_t *art)
{
    if (!ui.state.available || strcmp(ui.state.track_id, art->track_id) != 0) {
        bop_album_art_free(art);
        return;
    }

    bop_album_art_t *previous = ui.active_art;
    lv_image_set_src(ui.art_image, &art->image);
    int32_t width = art->image.header.w;
    int32_t height = art->image.header.h;
    lv_obj_set_size(ui.art_image, width, height);
    lv_obj_set_pos(ui.art_image, (ART_SIZE - width) / 2, (ART_SIZE - height) / 2);
    lv_image_set_scale(ui.art_image, ART_SIZE * LV_SCALE_NONE / width);
    lv_obj_remove_flag(ui.art_image, LV_OBJ_FLAG_HIDDEN);
    lv_obj_add_flag(ui.art_placeholder, LV_OBJ_FLAG_HIDDEN);

    uint32_t background = darken_color(art->dominant_rgb);
    lv_obj_set_style_bg_color(ui.band, lv_color_hex(background), 0);
    ui.active_art = art;
    bop_art_mark_active(art->track_id);
    if (previous != NULL) {
        lv_image_cache_drop(&previous->image);
        bop_album_art_free(previous);
    }
}

static void update_track(const playback_state_t *state)
{
    bool track_changed = strcmp(ui.state.track_id, state->track_id) != 0;
    bool was_available = ui.state.available;
    int64_t now = esp_timer_get_time();
    if (ui.volume_target_awaiting_snapshot
        && state->volume_command_generation == ui.volume_snapshot_generation) {
        ui.volume_target_awaiting_snapshot = false;
    }
    ui.state = *state;
    ui.state_received_us = now;
    ui.rendered_change_counter = state->change_counter;
    if (!state->available || !state->volume_available) {
        cancel_volume_gesture();
    }

    if (!state->available) {
        if (ui.attribution_visible) {
            hide_attribution(NULL);
        }
        show_playing(false);
        lv_obj_set_style_bg_color(ui.screen, lv_color_hex(BOP_IMAGE_BACKGROUND_RGB), 0);
        // When the album ends, the child returns to the covers to pick the
        // next one instead of facing an empty player.
        if (was_available
            && !ui.library_visible
            && now - ui.album_started_us >= ALBUM_START_GRACE_US) {
            show_library();
        }
        return;
    }

    show_playing(true);
    if (track_changed && ui.attribution_visible) {
        show_attribution();
    }
    lv_label_set_text(ui.title, state->title);
    lv_label_set_text(ui.artist, state->artists[0] != '\0' ? state->artists : "Spotify");
    if (track_changed) {
        if (ui.active_art != NULL
            && strcmp(ui.active_art->track_id, state->track_id) == 0) {
            lv_obj_remove_flag(ui.art_image, LV_OBJ_FLAG_HIDDEN);
            lv_obj_add_flag(ui.art_placeholder, LV_OBJ_FLAG_HIDDEN);
        } else {
            lv_obj_add_flag(ui.art_image, LV_OBJ_FLAG_HIDDEN);
            lv_obj_remove_flag(ui.art_placeholder, LV_OBJ_FLAG_HIDDEN);
        }
    }
}

static void format_time(uint32_t milliseconds, char *output, size_t capacity)
{
    uint32_t seconds = milliseconds / 1000;
    snprintf(output, capacity, "%u:%02u", (unsigned)(seconds / 60), (unsigned)(seconds % 60));
}

static void update_progress(void)
{
    if (!ui.state.available || ui.state.duration_ms == 0) {
        return;
    }
    uint64_t progress = ui.state.progress_ms;
    if (ui.state.is_playing) {
        int64_t elapsed_us = esp_timer_get_time() - ui.state_received_us;
        if (elapsed_us > 0) {
            progress += (uint64_t)elapsed_us / 1000;
        }
    }
    if (progress > ui.state.duration_ms) {
        progress = ui.state.duration_ms;
    }
    int32_t bar_value = (int32_t)(progress * 1000 / ui.state.duration_ms);
    lv_bar_set_value(ui.progress, bar_value, LV_ANIM_OFF);

    char elapsed[16];
    char total[16];
    format_time((uint32_t)progress, elapsed, sizeof(elapsed));
    format_time(ui.state.duration_ms, total, sizeof(total));
    lv_label_set_text(ui.elapsed, elapsed);
    lv_label_set_text(ui.total, total);
}

// Back on WiFi, the WAIT hints go, and nothing starts by itself: the child
// taps again.
static void update_connectivity(void)
{
    bool connected = bop_wifi_is_connected();
    if (connected == ui.connected) {
        return;
    }
    ui.connected = connected;
    if (connected) {
        lv_obj_add_flag(ui.offline, LV_OBJ_FLAG_HIDDEN);
        lv_obj_add_flag(ui.wait, LV_OBJ_FLAG_HIDDEN);
        bop_library_view_set_waiting(NULL);
    } else {
        lv_obj_remove_flag(ui.offline, LV_OBJ_FLAG_HIDDEN);
    }
}

// The clock bounces off the screen edges, so no pixel stays lit for long.
static void update_screensaver(void)
{
    char text[sizeof(ui.screensaver_text)] = "";
    time_t now = time(NULL);
    if (now >= CLOCK_VALID_AFTER) {
        struct tm local;
        localtime_r(&now, &local);
        strftime(text, sizeof(text), "%H:%M", &local);
    }
    if (strcmp(text, ui.screensaver_text) != 0) {
        strlcpy(ui.screensaver_text, text, sizeof(ui.screensaver_text));
        lv_label_set_text(ui.screensaver_clock, text);
        lv_obj_update_layout(ui.screensaver_clock);
    }
    int32_t limit_x = (SCREEN_WIDTH - lv_obj_get_width(ui.screensaver_clock)) & ~1;
    int32_t limit_y = (SCREEN_HEIGHT - lv_obj_get_height(ui.screensaver_clock)) & ~1;
    ui.screensaver_x += ui.screensaver_step_x;
    if (ui.screensaver_x <= 0) {
        ui.screensaver_x = 0;
        ui.screensaver_step_x = SCREENSAVER_STEP;
    } else if (ui.screensaver_x >= limit_x) {
        ui.screensaver_x = limit_x;
        ui.screensaver_step_x = -SCREENSAVER_STEP;
    }
    ui.screensaver_y += ui.screensaver_step_y;
    if (ui.screensaver_y <= 0) {
        ui.screensaver_y = 0;
        ui.screensaver_step_y = SCREENSAVER_STEP;
    } else if (ui.screensaver_y >= limit_y) {
        ui.screensaver_y = limit_y;
        ui.screensaver_step_y = -SCREENSAVER_STEP;
    }
    lv_obj_set_pos(ui.screensaver_clock, ui.screensaver_x, ui.screensaver_y);
}

// LVGL's inactivity clock runs from the last touch, and a move of the board
// resets it too. Playback does not count: a still album cover burns in like any
// other picture. A dark screen keeps the screensaver up beneath it, so the
// first touch still only wakes.
static void update_display_care(void)
{
    uint32_t moves = bop_motion_count();
    if (moves != ui.motion_seen) {
        ui.motion_seen = moves;
        lv_display_trigger_activity(NULL);
        prepare_for_input();
    }
    int64_t untouched_us = (int64_t)lv_display_get_inactive_time(NULL) * 1000;
    if (untouched_us >= SCREEN_OFF_TIMEOUT_US) {
        show_screensaver();
        set_display_brightness(OFF_BRIGHTNESS);
    } else if (untouched_us >= SCREENSAVER_TIMEOUT_US) {
        show_screensaver();
        update_screensaver();
        set_display_brightness(SCREENSAVER_BRIGHTNESS);
    } else {
        hide_screensaver();
        set_display_brightness(NORMAL_BRIGHTNESS);
    }
}

// The top layer covers the player, the grid, and the attribution screen alike.
// The overlay takes no input, so a touch reaches the layer below it, which
// wakes the screen and goes no further.
static void create_screensaver(void)
{
    ui.screensaver = lv_obj_create(lv_layer_top());
    lv_obj_remove_style_all(ui.screensaver);
    lv_obj_set_size(ui.screensaver, SCREEN_WIDTH, SCREEN_HEIGHT);
    lv_obj_set_pos(ui.screensaver, 0, 0);
    lv_obj_set_style_bg_color(ui.screensaver, lv_color_hex(0x000000), 0);
    lv_obj_set_style_bg_opa(ui.screensaver, LV_OPA_COVER, 0);
    lv_obj_remove_flag(ui.screensaver, LV_OBJ_FLAG_CLICKABLE | LV_OBJ_FLAG_SCROLLABLE);
    ui.screensaver_clock = lv_label_create(ui.screensaver);
    lv_obj_set_style_text_font(ui.screensaver_clock, &lv_font_montserrat_48, 0);
    lv_obj_set_style_text_color(ui.screensaver_clock, lv_color_hex(SCREENSAVER_CLOCK_COLOR), 0);
    lv_label_set_text(ui.screensaver_clock, "");
    lv_obj_add_flag(ui.screensaver, LV_OBJ_FLAG_HIDDEN);
    ui.screensaver_x = 100;
    ui.screensaver_y = 180;
    ui.screensaver_step_x = SCREENSAVER_STEP;
    ui.screensaver_step_y = SCREENSAVER_STEP;
}

static void update_pixel_shift(int64_t now)
{
    static const int8_t offsets[][2] = {
        {0, 0}, {2, 0}, {2, 2}, {0, 2}, {-2, 2}, {-2, 0}, {-2, -2}, {0, -2}, {2, -2},
    };
    if (now - ui.pixel_shift_changed_us < PIXEL_SHIFT_INTERVAL_US) {
        return;
    }
    ui.pixel_shift_changed_us = now;
    ui.pixel_shift_index = (ui.pixel_shift_index + 1) % (sizeof(offsets) / sizeof(offsets[0]));
    int32_t x = offsets[ui.pixel_shift_index][0];
    int32_t y = offsets[ui.pixel_shift_index][1];

    // The album art changes with every track and fills the screen edge to
    // edge, so it stays in place. Moving it would uncover a strip of screen.
    lv_obj_t *shifted[] = {
        ui.title,
        ui.artist,
        ui.progress,
        ui.elapsed,
        ui.total,
        ui.idle,
        ui.offline,
        ui.battery,
        ui.home_button,
    };
    for (size_t index = 0; index < sizeof(shifted) / sizeof(shifted[0]); ++index) {
        lv_obj_set_style_translate_x(shifted[index], x, 0);
        lv_obj_set_style_translate_y(shifted[index], y, 0);
    }
}

static const char *battery_symbol(const bop_battery_status_t *battery)
{
    if (battery->charging) {
        return LV_SYMBOL_CHARGE;
    }
    if (battery->percent < 0 || battery->percent >= 80) {
        return LV_SYMBOL_BATTERY_FULL;
    }
    if (battery->percent >= 55) {
        return LV_SYMBOL_BATTERY_3;
    }
    if (battery->percent >= 30) {
        return LV_SYMBOL_BATTERY_2;
    }
    if (battery->percent >= 10) {
        return LV_SYMBOL_BATTERY_1;
    }
    return LV_SYMBOL_BATTERY_EMPTY;
}

// The badge appears only while the battery matters: on battery power, or while
// it charges. On USB with a full battery, or with no battery, it stays hidden.
static void update_battery_indicator(void)
{
    bop_battery_status_t battery;
    bop_power_get_battery(&battery);
    bool visible = battery.present && (battery.on_battery || battery.charging);
    bool low = visible
        && battery.on_battery
        && battery.percent >= 0
        && battery.percent <= LOW_BATTERY_PERCENT;

    char text[sizeof(ui.battery_text)];
    if (battery.percent >= 0) {
        snprintf(text, sizeof(text), "%s %d%%", battery_symbol(&battery), battery.percent);
    } else {
        snprintf(text, sizeof(text), "%s", battery_symbol(&battery));
    }

    // A label redraws on every set, so it changes only when its text does.
    if (strcmp(text, ui.battery_text) != 0) {
        strlcpy(ui.battery_text, text, sizeof(ui.battery_text));
        lv_label_set_text(ui.battery, ui.battery_text);
    }
    if (low != ui.battery_low) {
        ui.battery_low = low;
        lv_obj_set_style_text_color(
            ui.battery, lv_color_hex(low ? 0xFF6B6B : 0xF4F4F4), 0);
    }
    if (visible != ui.battery_visible) {
        ui.battery_visible = visible;
        if (visible) {
            lv_obj_remove_flag(ui.battery, LV_OBJ_FLAG_HIDDEN);
        } else {
            lv_obj_add_flag(ui.battery, LV_OBJ_FLAG_HIDDEN);
        }
    }
}

static void show_library(void)
{
    if (ui.attribution_visible) {
        hide_attribution(NULL);
    }
    cancel_volume_gesture();
    // The player's WAIT lies above the grid.
    lv_obj_add_flag(ui.wait, LV_OBJ_FLAG_HIDDEN);
    // The grid takes its own input. The gesture layer above it would
    // otherwise catch every touch meant for a cover.
    lv_obj_add_flag(ui.gesture_layer, LV_OBJ_FLAG_HIDDEN);
    ui.library_visible = true;
    bop_library_view_show();
}

static void show_player(void)
{
    bop_library_view_hide();
    lv_obj_remove_flag(ui.gesture_layer, LV_OBJ_FLAG_HIDDEN);
    ui.library_visible = false;
}

static bool library_press(void)
{
    bool screen_was_asleep = screen_is_asleep();
    record_touch();
    return !screen_was_asleep;
}

static void library_select(const char *album_id)
{
    if (!bop_wifi_is_connected()) {
        bop_library_view_set_waiting(album_id);
        return;
    }
    uint32_t request_id = ++ui.next_feedback_request_id;
    if (request_id == 0) {
        request_id = ++ui.next_feedback_request_id;
    }
    spotify_command_submission_t submission = bop_spotify_enqueue_play_album(album_id, request_id);
    if (submission != SPOTIFY_COMMAND_SUBMISSION_QUEUED) {
        ESP_LOGW(
            TAG,
            "Album tap refused: %s",
            submission == SPOTIFY_COMMAND_SUBMISSION_RATE_LIMITED ? "Spotify rate limit"
                : submission == SPOTIFY_COMMAND_SUBMISSION_QUEUE_FULL ? "queue full"
                : "Spotify not started");
        show_feedback(LV_SYMBOL_WARNING);
        return;
    }
    ui.album_request_id = request_id;
    bop_library_view_set_pending(album_id);
}

static void library_resume(void)
{
    show_player();
}

// A tap on the playing album's cover pauses or resumes, through the same path
// as a tap on the player, with its immediate play-state update.
static void library_toggle(void)
{
    if (!bop_wifi_is_connected()) {
        bop_library_view_set_waiting(ui.state.album_id);
        return;
    }
    handle_tap();
}

// The grid stays until Spotify accepts the album, so a failed start leaves the
// child on the covers with a sign: a muted speaker when no device can play.
static void handle_album_result(const spotify_command_result_t *result)
{
    if (result->request_id == 0 || result->request_id != ui.album_request_id) {
        return;
    }
    ui.album_request_id = 0;
    bop_library_view_set_pending(NULL);
    if (result->accepted) {
        ui.album_started_us = esp_timer_get_time();
        show_player();
        return;
    }
    show_feedback(result->no_device ? LV_SYMBOL_MUTE : LV_SYMBOL_WARNING);
}

static void process_command_results(void)
{
    spotify_command_result_t result;
    while (bop_spotify_get_command_result(&result)) {
        if (result.command == SPOTIFY_COMMAND_PLAY_ALBUM) {
            handle_album_result(&result);
            continue;
        }
        if (result.command != SPOTIFY_COMMAND_TOGGLE || result.request_id == 0) {
            continue;
        }
        if (volume_feedback_active()) {
            continue;
        }
        if (result.accepted) {
            show_feedback(result.was_playing ? LV_SYMBOL_PAUSE : LV_SYMBOL_PLAY);
        } else if (result.rate_limited) {
            show_feedback(LV_SYMBOL_WARNING);
        }
    }
}

static void ui_timer(lv_timer_t *timer)
{
    (void)timer;
    update_connectivity();
    update_battery_indicator();
    bop_album_art_t *art = NULL;
    while (xQueueReceive(ui.art_queue, &art, 0) == pdTRUE) {
        apply_art(art);
    }
    process_command_results();

    playback_state_t snapshot = {0};
    if (bop_spotify_get_state(&snapshot)) {
        int64_t now = esp_timer_get_time();
        bool same_snapshot = snapshot.change_counter == ui.optimistic_change_counter;
        bool optimistic_expired = ui.optimistic_toggle
            && same_snapshot
            && now >= ui.optimistic_until_us;
        bool keep_optimistic = ui.optimistic_toggle
            && same_snapshot
            && !optimistic_expired;
        if (!keep_optimistic) {
            ui.optimistic_toggle = false;
            if (optimistic_expired
                || snapshot.change_counter != ui.rendered_change_counter) {
                update_track(&snapshot);
            }
        }
    }
    const bop_library_view_playback_t library_playback = {
        .available = ui.state.available,
        .is_playing = ui.state.is_playing,
        .album_id = ui.state.album_id,
    };
    bop_library_view_update(&library_playback);
    int64_t now = esp_timer_get_time();
    finish_volume_update(now);
    update_progress();
    // After the snapshot, so a playback start lights the screen on this tick.
    update_display_care();
    update_pixel_shift(now);
}

esp_err_t bop_ui_start(void)
{
    ui.art_queue = xQueueCreate(1, sizeof(bop_album_art_t *));
    if (ui.art_queue == NULL) {
        return ESP_ERR_NO_MEM;
    }
    esp_err_t error = bop_art_pipeline_start(ui.art_queue);
    if (error != ESP_OK) {
        vQueueDelete(ui.art_queue);
        ui.art_queue = NULL;
        return error;
    }

    ui.screen = lv_screen_active();
    lv_obj_remove_flag(ui.screen, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_pad_all(ui.screen, 0, 0);
    lv_obj_set_style_bg_color(ui.screen, lv_color_hex(BOP_IMAGE_BACKGROUND_RGB), 0);
    lv_obj_set_style_bg_opa(ui.screen, LV_OPA_COVER, 0);

    create_playing_state();
    create_idle_state();
    // The grid lies above the player and below the status labels, the
    // feedback overlay, and the attribution screen, which all follow it.
    const bop_library_view_callbacks_t library_callbacks = {
        .press = library_press,
        .select = library_select,
        .toggle = library_toggle,
        .resume = library_resume,
    };
    error = bop_library_view_create(ui.screen, &library_callbacks);
    if (error != ESP_OK) {
        return error;
    }
    create_offline_indicator();
    create_wait_sign();
    create_battery_indicator();
    create_feedback_layer();
    create_attribution_screen();
    create_screensaver();
    // start_display set this brightness before the UI started.
    ui.display_brightness = NORMAL_BRIGHTNESS;
    ui.motion_seen = bop_motion_count();
    ui.connected = true;
    ui.pixel_shift_changed_us = esp_timer_get_time();
    show_playing(false);
    // Kid mode starts on the album covers.
    show_library();
    lv_timer_create(ui_timer, UI_TIMER_MS, NULL);
    ESP_LOGI(TAG, "Now-playing UI is ready on core %d", UI_TASK_CORE);
    return ESP_OK;
}

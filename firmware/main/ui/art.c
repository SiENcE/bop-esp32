// SPDX-FileCopyrightText: 2026 Mark Phelps
// SPDX-License-Identifier: Apache-2.0

#include "art.h"

#include <math.h>
#include <stdbool.h>
#include <stdlib.h>
#include <string.h>

#include "esp_crt_bundle.h"
#include "esp_heap_caps.h"
#include "esp_http_client.h"
#include "esp_log.h"
#include "esp_timer.h"
#include "freertos/semphr.h"
#include "jpeg_decoder.h"
#include "../cache.h"
#include "../wifi.h"

#define ART_DOWNLOAD_CAPACITY (1024 * 1024)
#define ART_MAX_DIMENSION 640
#define ART_RENDER_SIZE 368
#define ART_RETRY_DELAY_MS 5000
#define ART_ACCEPT_DELAY_MS 2000
#define ART_TASK_CORE 0
#define ART_IDLE_WAIT_MS 250
#define IMAGE_CLIENT_IDLE_US (3LL * 1000000)
#define COVER_PIXEL_BYTES ((size_t)BOP_COVER_SIZE * BOP_COVER_SIZE * sizeof(uint16_t))
// One page of four covers plus the next page fits each queue.
#define COVER_QUEUE_LENGTH 8

static const char *TAG = "bop_art";
static QueueHandle_t art_result_queue;
static QueueHandle_t cover_request_queue;
static QueueHandle_t cover_result_queue;
static SemaphoreHandle_t art_cache_mutex;
static char active_track_id[BOP_TRACK_ID_CAPACITY];

typedef struct {
    char album_id[BOP_ALBUM_ID_CAPACITY];
    char url[BOP_COVER_URL_CAPACITY];
    bop_cover_shape_t shape;
} cover_request_t;

typedef struct {
    uint8_t *data;
    size_t length;
    size_t capacity;
    bool overflow;
} art_download_t;

static esp_err_t collect_art_data(esp_http_client_event_t *event)
{
    art_download_t *download = event->user_data;
    if (event->event_id != HTTP_EVENT_ON_DATA || event->data_len <= 0) {
        return ESP_OK;
    }
    if (download->length + (size_t)event->data_len > download->capacity) {
        download->overflow = true;
        return ESP_FAIL;
    }
    memcpy(download->data + download->length, event->data, event->data_len);
    download->length += event->data_len;
    return ESP_OK;
}

// Only the art task downloads, so one client serves every image. It stays
// connected between downloads: a new HTTPS connection costs a TLS handshake
// of several hundred milliseconds, which a page of four covers paid four times.
static esp_http_client_handle_t image_client;
static art_download_t image_download;
static int64_t image_client_used_us;
static bool image_radio_awake;

// A batch of downloads, such as a page of covers, holds the radio awake from
// its first request until the art task goes idle, so even on battery the
// covers arrive at full speed and the radio sleeps again afterwards.
static void set_image_radio_awake(bool awake)
{
    if (awake != image_radio_awake) {
        image_radio_awake = awake;
        bop_wifi_hold_awake(awake);
    }
}

// A kept TLS session holds internal RAM that WiFi and the Spotify connection
// also need. The connection therefore lives only across a batch of downloads
// and closes once the art task goes idle.
static void close_idle_image_client(void)
{
    if (esp_timer_get_time() - image_client_used_us < IMAGE_CLIENT_IDLE_US) {
        return;
    }
    if (image_client != NULL) {
        esp_http_client_cleanup(image_client);
        image_client = NULL;
    }
    set_image_radio_awake(false);
}

static esp_err_t perform_image_request(const char *url, int *status_code)
{
    image_client_used_us = esp_timer_get_time();
    set_image_radio_awake(true);
    for (int attempt = 0; attempt < 2; ++attempt) {
        bool reused = image_client != NULL;
        esp_err_t error = ESP_OK;
        if (!reused) {
            esp_http_client_config_t configuration = {
                .url = url,
                .event_handler = collect_art_data,
                .user_data = &image_download,
                .crt_bundle_attach = esp_crt_bundle_attach,
                .timeout_ms = 15000,
                .buffer_size = 4096,
                .keep_alive_enable = true,
            };
            image_client = esp_http_client_init(&configuration);
            if (image_client == NULL) {
                return ESP_ERR_NO_MEM;
            }
        } else {
            error = esp_http_client_set_url(image_client, url);
        }
        image_download.length = 0;
        image_download.overflow = false;
        if (error == ESP_OK) {
            error = esp_http_client_perform(image_client);
        }
        *status_code = esp_http_client_get_status_code(image_client);
        image_client_used_us = esp_timer_get_time();
        if (error == ESP_OK) {
            return ESP_OK;
        }
        // A failed connection is never reused. When the server had closed a
        // kept connection, one fresh attempt follows.
        esp_http_client_cleanup(image_client);
        image_client = NULL;
        if (!reused || image_download.overflow) {
            return error;
        }
    }
    return ESP_FAIL;
}

static esp_err_t download_jpeg(const char *url, uint8_t **jpeg, size_t *jpeg_size)
{
    *jpeg = NULL;
    *jpeg_size = 0;
    if (url == NULL || strncmp(url, "https://", 8) != 0) {
        return ESP_ERR_INVALID_ARG;
    }

    image_download = (art_download_t){
        .data = heap_caps_malloc(
            ART_DOWNLOAD_CAPACITY, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT),
        .capacity = ART_DOWNLOAD_CAPACITY,
    };
    if (image_download.data == NULL) {
        return ESP_ERR_NO_MEM;
    }
    int status_code = 0;
    esp_err_t error = perform_image_request(url, &status_code);
    art_download_t download = image_download;
    image_download = (art_download_t){0};
    if (error != ESP_OK || download.overflow || status_code != 200 || download.length == 0) {
        ESP_LOGE(
            TAG,
            "Album art download failed (HTTP %d, %s, %u bytes)",
            status_code,
            esp_err_to_name(error),
            (unsigned)download.length);
        free(download.data);
        return download.overflow ? ESP_ERR_INVALID_SIZE : (error == ESP_OK ? ESP_FAIL : error);
    }

    uint8_t *smaller = heap_caps_realloc(
        download.data,
        download.length,
        MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
    *jpeg = smaller != NULL ? smaller : download.data;
    *jpeg_size = download.length;
    return ESP_OK;
}

static uint32_t average_rgb565(const uint16_t *pixels, size_t pixel_count)
{
    uint64_t red = 0;
    uint64_t green = 0;
    uint64_t blue = 0;
    size_t samples = 0;
    for (size_t index = 0; index < pixel_count; index += 8) {
        uint16_t pixel = pixels[index];
        red += ((pixel >> 11) & 0x1f) * 255 / 31;
        green += ((pixel >> 5) & 0x3f) * 255 / 63;
        blue += (pixel & 0x1f) * 255 / 31;
        ++samples;
    }
    if (samples == 0) {
        return 0x282828;
    }
    return ((uint32_t)(red / samples) << 16)
        | ((uint32_t)(green / samples) << 8)
        | (uint32_t)(blue / samples);
}

static void resize_rgb565(
    const uint16_t *source,
    uint32_t source_width,
    uint32_t source_height,
    uint16_t *destination,
    uint32_t render_size)
{
    memset(destination, 0, render_size * render_size * sizeof(uint16_t));
    uint32_t rendered_width = render_size;
    uint32_t rendered_height = render_size;
    if (source_width > source_height) {
        rendered_height = source_height * render_size / source_width;
    } else if (source_height > source_width) {
        rendered_width = source_width * render_size / source_height;
    }
    uint32_t x_offset = (render_size - rendered_width) / 2;
    uint32_t y_offset = (render_size - rendered_height) / 2;
    for (uint32_t y = 0; y < rendered_height; ++y) {
        uint32_t source_y = y * source_height / rendered_height;
        for (uint32_t x = 0; x < rendered_width; ++x) {
            uint32_t source_x = x * source_width / rendered_width;
            destination[(y + y_offset) * render_size + x + x_offset]
                = source[source_y * source_width + source_x];
        }
    }
}

static uint16_t rgb888_to_rgb565(uint32_t rgb)
{
    return (uint16_t)((((rgb >> 16) & 0xf8) << 8) | (((rgb >> 8) & 0xfc) << 3) | ((rgb & 0xff) >> 3));
}

static uint16_t blend_rgb565(uint16_t foreground, uint16_t background, uint32_t alpha)
{
    uint32_t inverse = 255 - alpha;
    uint32_t red = (((foreground >> 11) & 0x1f) * alpha + ((background >> 11) & 0x1f) * inverse) / 255;
    uint32_t green = (((foreground >> 5) & 0x3f) * alpha + ((background >> 5) & 0x3f) * inverse) / 255;
    uint32_t blue = ((foreground & 0x1f) * alpha + (background & 0x1f) * inverse) / 255;
    return (uint16_t)((red << 11) | (green << 5) | blue);
}

// Paints everything outside a rounded square in the background color, with a
// one-pixel soft edge so the curve does not look stepped. A circle is the case
// where the radius is half the size. Only corner pixels are visited.
static void round_corners_rgb565(uint16_t *pixels, uint32_t size, uint32_t radius)
{
    if (radius == 0 || radius * 2 > size) {
        return;
    }
    uint16_t background = rgb888_to_rgb565(BOP_IMAGE_BACKGROUND_RGB);
    float corner = (float)radius;
    for (uint32_t y = 0; y < size; ++y) {
        float vertical = 0.0f;
        if (y < radius) {
            vertical = corner - ((float)y + 0.5f);
        } else if (y >= size - radius) {
            vertical = ((float)y + 0.5f) - (float)(size - radius);
        } else {
            continue;
        }
        for (uint32_t x = 0; x < size; ++x) {
            float horizontal = 0.0f;
            if (x < radius) {
                horizontal = corner - ((float)x + 0.5f);
            } else if (x >= size - radius) {
                horizontal = ((float)x + 0.5f) - (float)(size - radius);
            } else {
                continue;
            }
            float coverage = corner + 0.5f
                - sqrtf(horizontal * horizontal + vertical * vertical);
            if (coverage >= 1.0f) {
                continue;
            }
            uint16_t *pixel = &pixels[y * size + x];
            *pixel = coverage <= 0.0f
                ? background
                : blend_rgb565(*pixel, background, (uint32_t)(coverage * 255.0f));
        }
    }
}

// Every image decodes into a square RGB565 buffer of render_size pixels a side.
static uint8_t *render_rgb565(
    const uint16_t *source, uint32_t source_width, uint32_t source_height, uint32_t render_size)
{
    uint8_t *rendered = heap_caps_malloc(
        (size_t)render_size * render_size * sizeof(uint16_t),
        MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
    if (rendered != NULL) {
        resize_rgb565(source, source_width, source_height, (uint16_t *)rendered, render_size);
    }
    return rendered;
}

static void describe_rgb565_image(lv_image_dsc_t *image, uint8_t *pixels, uint32_t size)
{
    image->header.magic = LV_IMAGE_HEADER_MAGIC;
    image->header.cf = LV_COLOR_FORMAT_RGB565;
    image->header.w = size;
    image->header.h = size;
    image->header.stride = size * sizeof(uint16_t);
    image->data_size = size * size * sizeof(uint16_t);
    image->data = pixels;
}

static bool jpeg_is_bounded(
    const uint8_t *jpeg,
    size_t jpeg_size,
    uint32_t *image_width,
    uint32_t *image_height)
{
    if (jpeg_size < 4 || jpeg[0] != 0xff || jpeg[1] != 0xd8) {
        return false;
    }
    size_t offset = 2;
    bool frame_found = false;
    bool scan_started = false;
    while (offset < jpeg_size) {
        if (jpeg[offset] != 0xff) {
            if (!scan_started) {
                return false;
            }
            ++offset;
            continue;
        }
        while (offset < jpeg_size && jpeg[offset] == 0xff) {
            ++offset;
        }
        if (offset >= jpeg_size) {
            return false;
        }
        uint8_t marker = jpeg[offset++];
        if (scan_started && marker == 0x00) {
            continue;
        }
        if (marker == 0xd9) {
            return scan_started && frame_found;
        }
        if (marker >= 0xd0 && marker <= 0xd7) {
            if (!scan_started) {
                return false;
            }
            continue;
        }
        if (scan_started) {
            return false;
        }
        if (marker == 0xd8 || marker == 0x01) {
            continue;
        }
        if (offset + 2 > jpeg_size) {
            return false;
        }
        size_t segment_length = ((size_t)jpeg[offset] << 8) | jpeg[offset + 1];
        if (segment_length < 2 || segment_length > jpeg_size - offset) {
            return false;
        }
        bool unsupported_frame = (marker >= 0xc1 && marker <= 0xc3)
            || (marker >= 0xc5 && marker <= 0xc7)
            || (marker >= 0xc9 && marker <= 0xcb)
            || (marker >= 0xcd && marker <= 0xcf);
        if (unsupported_frame) {
            return false;
        }
        if (marker == 0xc0) {
            if (frame_found || segment_length < 8) {
                return false;
            }
            uint8_t component_count = jpeg[offset + 7];
            if ((component_count != 1 && component_count != 3)
                || segment_length != 8 + 3 * component_count
                || jpeg[offset + 2] != 8) {
                return false;
            }
            *image_height = ((uint32_t)jpeg[offset + 3] << 8) | jpeg[offset + 4];
            *image_width = ((uint32_t)jpeg[offset + 5] << 8) | jpeg[offset + 6];
            if (*image_width == 0
                || *image_height == 0
                || *image_width > ART_MAX_DIMENSION
                || *image_height > ART_MAX_DIMENSION) {
                return false;
            }
            frame_found = true;
        }
        if (marker == 0xda) {
            if (!frame_found) {
                return false;
            }
            scan_started = true;
        }
        offset += segment_length;
    }
    return false;
}

// Decodes the full image. The caller frees *pixels.
static esp_err_t decode_jpeg_pixels(
    const uint8_t *jpeg,
    size_t jpeg_size,
    uint8_t **pixels,
    uint32_t *width,
    uint32_t *height)
{
    *pixels = NULL;
    uint32_t source_width = 0;
    uint32_t source_height = 0;
    if (!jpeg_is_bounded(jpeg, jpeg_size, &source_width, &source_height)) {
        ESP_LOGE(TAG, "Album art JPEG structure is invalid or unsupported");
        return ESP_ERR_INVALID_RESPONSE;
    }
    size_t decoded_size = (size_t)source_width * source_height * sizeof(uint16_t);
    esp_jpeg_image_cfg_t configuration = {
        .indata = (uint8_t *)jpeg,
        .indata_size = jpeg_size,
        .out_format = JPEG_IMAGE_FORMAT_RGB565,
        .out_scale = JPEG_IMAGE_SCALE_0,
        .flags = {
            .swap_color_bytes = 0,
        },
    };
    esp_jpeg_image_output_t output = {0};
    uint8_t *decoded_pixels = heap_caps_malloc(
        decoded_size, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
    if (decoded_pixels == NULL) {
        return ESP_ERR_NO_MEM;
    }
    configuration.outbuf = decoded_pixels;
    configuration.outbuf_size = decoded_size;
    esp_err_t error = esp_jpeg_decode(&configuration, &output);
    if (error != ESP_OK) {
        free(decoded_pixels);
        return error;
    }
    if (output.width != source_width
        || output.height != source_height
        || output.output_len != decoded_size) {
        free(decoded_pixels);
        return ESP_ERR_INVALID_RESPONSE;
    }
    *pixels = decoded_pixels;
    *width = output.width;
    *height = output.height;
    return ESP_OK;
}

static esp_err_t decode_jpeg(
    const uint8_t *jpeg,
    size_t jpeg_size,
    const char *track_id,
    bop_album_art_t **decoded_art)
{
    *decoded_art = NULL;
    uint8_t *decoded_pixels = NULL;
    uint32_t width = 0;
    uint32_t height = 0;
    esp_err_t error = decode_jpeg_pixels(jpeg, jpeg_size, &decoded_pixels, &width, &height);
    if (error != ESP_OK) {
        return error;
    }

    bop_album_art_t *art = calloc(1, sizeof(*art));
    if (art == NULL) {
        free(decoded_pixels);
        return ESP_ERR_NO_MEM;
    }
    art->pixels = render_rgb565((const uint16_t *)decoded_pixels, width, height, ART_RENDER_SIZE);
    free(decoded_pixels);
    if (art->pixels == NULL) {
        free(art);
        return ESP_ERR_NO_MEM;
    }

    // The average runs before the corners take the background color, so the
    // band color comes from the artwork alone.
    art->dominant_rgb = average_rgb565(
        (const uint16_t *)art->pixels, ART_RENDER_SIZE * ART_RENDER_SIZE);
    round_corners_rgb565((uint16_t *)art->pixels, ART_RENDER_SIZE, BOP_ART_CORNER_RADIUS);
    describe_rgb565_image(&art->image, art->pixels, ART_RENDER_SIZE);
    strlcpy(art->track_id, track_id, sizeof(art->track_id));
    *decoded_art = art;
    ESP_LOGI(
        TAG,
        "Album art decoded: %ux%u, %u JPEG bytes",
        (unsigned)width,
        (unsigned)height,
        (unsigned)jpeg_size);
    return ESP_OK;
}

static esp_err_t decode_cover(
    const uint8_t *jpeg,
    size_t jpeg_size,
    const char *album_id,
    bop_cover_shape_t shape,
    bop_cover_t **decoded_cover)
{
    *decoded_cover = NULL;
    uint8_t *decoded_pixels = NULL;
    uint32_t width = 0;
    uint32_t height = 0;
    esp_err_t error = decode_jpeg_pixels(jpeg, jpeg_size, &decoded_pixels, &width, &height);
    if (error != ESP_OK) {
        return error;
    }
    bop_cover_t *cover = calloc(1, sizeof(*cover));
    if (cover == NULL) {
        free(decoded_pixels);
        return ESP_ERR_NO_MEM;
    }
    cover->pixels = render_rgb565((const uint16_t *)decoded_pixels, width, height, BOP_COVER_SIZE);
    free(decoded_pixels);
    if (cover->pixels == NULL) {
        free(cover);
        return ESP_ERR_NO_MEM;
    }
    round_corners_rgb565(
        (uint16_t *)cover->pixels,
        BOP_COVER_SIZE,
        shape == BOP_COVER_SHAPE_CIRCLE ? BOP_COVER_SIZE / 2 : BOP_COVER_CORNER_RADIUS);
    describe_rgb565_image(&cover->image, cover->pixels, BOP_COVER_SIZE);
    strlcpy(cover->album_id, album_id, sizeof(cover->album_id));
    *decoded_cover = cover;
    return ESP_OK;
}

void bop_cover_free(bop_cover_t *cover)
{
    if (cover == NULL) {
        return;
    }
    free(cover->pixels);
    free(cover);
}

void bop_album_art_free(bop_album_art_t *art)
{
    if (art == NULL) {
        return;
    }
    free(art->pixels);
    free(art);
}

static void publish_art(bop_album_art_t *art)
{
    bop_album_art_t *stale = NULL;
    if (xQueueReceive(art_result_queue, &stale, 0) == pdTRUE) {
        bop_album_art_free(stale);
    }
    if (xQueueSend(art_result_queue, &art, 0) != pdTRUE) {
        bop_album_art_free(art);
    }
}

static bool art_is_active(const char *track_id)
{
    bool active = false;
    if (xSemaphoreTake(art_cache_mutex, portMAX_DELAY) == pdTRUE) {
        active = strcmp(track_id, active_track_id) == 0;
        xSemaphoreGive(art_cache_mutex);
    }
    return active;
}

void bop_art_mark_active(const char *track_id)
{
    if (track_id == NULL || art_cache_mutex == NULL) {
        return;
    }
    if (xSemaphoreTake(art_cache_mutex, portMAX_DELAY) == pdTRUE) {
        strlcpy(active_track_id, track_id, sizeof(active_track_id));
        xSemaphoreGive(art_cache_mutex);
    }
}

static void publish_cover(bop_cover_t *cover)
{
    if (xQueueSend(cover_result_queue, &cover, 0) != pdTRUE) {
        bop_cover_free(cover);
    }
}

// A cached picture is stored exactly as drawn, corners included, so it needs
// one flash read and no network or decoder.
static bop_cover_t *load_cached_cover(const char *album_id)
{
    bop_cover_t *cover = calloc(1, sizeof(*cover));
    if (cover == NULL) {
        return NULL;
    }
    cover->pixels = heap_caps_malloc(COVER_PIXEL_BYTES, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
    if (cover->pixels == NULL
        || !bop_cache_load_cover(album_id, cover->pixels, COVER_PIXEL_BYTES)) {
        bop_cover_free(cover);
        return NULL;
    }
    describe_rgb565_image(&cover->image, cover->pixels, BOP_COVER_SIZE);
    strlcpy(cover->album_id, album_id, sizeof(cover->album_id));
    return cover;
}

static void load_cover(const cover_request_t *request)
{
    bop_cover_t *cached = load_cached_cover(request->album_id);
    if (cached != NULL) {
        publish_cover(cached);
        return;
    }
    if (!bop_wifi_is_connected()) {
        // At startup the grid asks for its covers before WiFi connects. Each
        // would fail at DNS, so the request waits for the next ask instead.
        return;
    }
    uint8_t *jpeg = NULL;
    size_t jpeg_size = 0;
    int64_t started_us = esp_timer_get_time();
    esp_err_t error = download_jpeg(request->url, &jpeg, &jpeg_size);
    int64_t downloaded_us = esp_timer_get_time();
    bop_cover_t *cover = NULL;
    if (error == ESP_OK) {
        error = decode_cover(jpeg, jpeg_size, request->album_id, request->shape, &cover);
        // The split shows whether the network or the decoder sets the pace.
        ESP_LOGI(
            TAG,
            "Cover: %u KB downloaded in %u ms, decoded in %u ms",
            (unsigned)(jpeg_size / 1024),
            (unsigned)((downloaded_us - started_us) / 1000),
            (unsigned)((esp_timer_get_time() - downloaded_us) / 1000));
    }
    free(jpeg);
    if (error != ESP_OK) {
        // The UI asks again when the page shows the album again.
        ESP_LOGW(TAG, "Album cover failed: %s", esp_err_to_name(error));
        return;
    }
    // The UI owns and frees a cover it receives, and a flash write takes most
    // of a second. The cache therefore writes from a copy, after the UI already
    // has the picture.
    uint8_t *copy = heap_caps_malloc(COVER_PIXEL_BYTES, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
    if (copy != NULL) {
        memcpy(copy, cover->pixels, COVER_PIXEL_BYTES);
    }
    publish_cover(cover);
    if (copy != NULL) {
        bop_cache_store_cover(request->album_id, copy, COVER_PIXEL_BYTES);
        free(copy);
    }
}

bool bop_cover_request(const char *album_id, const char *url, bop_cover_shape_t shape)
{
    if (cover_request_queue == NULL || album_id == NULL || url == NULL) {
        return false;
    }
    cover_request_t request = {.shape = shape};
    if (strlcpy(request.album_id, album_id, sizeof(request.album_id)) >= sizeof(request.album_id)
        || strlcpy(request.url, url, sizeof(request.url)) >= sizeof(request.url)) {
        return false;
    }
    return xQueueSend(cover_request_queue, &request, 0) == pdTRUE;
}

bool bop_cover_receive(bop_cover_t **cover)
{
    if (cover_result_queue == NULL || cover == NULL) {
        return false;
    }
    return xQueueReceive(cover_result_queue, cover, 0) == pdTRUE;
}

static void art_task(void *argument)
{
    (void)argument;
    char attempted_track[BOP_TRACK_ID_CAPACITY] = {0};
    int64_t retry_after = 0;

    for (;;) {
        playback_state_t state = {0};
        int64_t now = esp_timer_get_time() / 1000;
        bool have_track = bop_spotify_get_state(&state)
            && state.available
            && state.track_id[0] != '\0'
            && state.album_art_url[0] != '\0';
        bool already_cached = have_track && art_is_active(state.track_id);
        bool retry_blocked = have_track
            && strcmp(state.track_id, attempted_track) == 0
            && now < retry_after;
        if (!have_track || already_cached || retry_blocked) {
            // Covers load only while the now-playing art has nothing to do,
            // and the wait for a cover request is the idle delay.
            cover_request_t request;
            if (xQueueReceive(cover_request_queue, &request, pdMS_TO_TICKS(ART_IDLE_WAIT_MS))
                == pdTRUE) {
                load_cover(&request);
            } else {
                close_idle_image_client();
            }
            continue;
        }

        strlcpy(attempted_track, state.track_id, sizeof(attempted_track));
        uint8_t *jpeg = NULL;
        size_t jpeg_size = 0;
        esp_err_t error = download_jpeg(state.album_art_url, &jpeg, &jpeg_size);
        bop_album_art_t *art = NULL;
        if (error == ESP_OK) {
            error = decode_jpeg(jpeg, jpeg_size, state.track_id, &art);
        }
        free(jpeg);
        if (error != ESP_OK) {
            ESP_LOGE(TAG, "Album art pipeline failed: %s", esp_err_to_name(error));
            retry_after = esp_timer_get_time() / 1000 + ART_RETRY_DELAY_MS;
            continue;
        }

        playback_state_t latest = {0};
        if (!bop_spotify_get_state(&latest)
            || strcmp(latest.track_id, art->track_id) != 0) {
            bop_album_art_free(art);
            continue;
        }
        retry_after = esp_timer_get_time() / 1000 + ART_ACCEPT_DELAY_MS;
        publish_art(art);
    }
}

esp_err_t bop_art_pipeline_start(QueueHandle_t result_queue)
{
    if (result_queue == NULL || art_result_queue != NULL) {
        return ESP_ERR_INVALID_STATE;
    }
    art_cache_mutex = xSemaphoreCreateMutex();
    QueueHandle_t requests = xQueueCreate(COVER_QUEUE_LENGTH, sizeof(cover_request_t));
    QueueHandle_t covers = xQueueCreate(COVER_QUEUE_LENGTH, sizeof(bop_cover_t *));
    if (art_cache_mutex == NULL || requests == NULL || covers == NULL) {
        if (art_cache_mutex != NULL) {
            vSemaphoreDelete(art_cache_mutex);
            art_cache_mutex = NULL;
        }
        if (requests != NULL) {
            vQueueDelete(requests);
        }
        if (covers != NULL) {
            vQueueDelete(covers);
        }
        return ESP_ERR_NO_MEM;
    }
    active_track_id[0] = '\0';
    art_result_queue = result_queue;
    cover_request_queue = requests;
    cover_result_queue = covers;
    if (xTaskCreatePinnedToCore(
            art_task, "album_art", 8192, NULL, 4, NULL, ART_TASK_CORE)
        != pdPASS) {
        // Nothing has used the cover queues yet: bop_ui_start returns this
        // error before the UI exists, so no task holds the handles.
        art_result_queue = NULL;
        cover_request_queue = NULL;
        cover_result_queue = NULL;
        vQueueDelete(requests);
        vQueueDelete(covers);
        vSemaphoreDelete(art_cache_mutex);
        art_cache_mutex = NULL;
        return ESP_ERR_NO_MEM;
    }
    return ESP_OK;
}

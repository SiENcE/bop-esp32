// SPDX-FileCopyrightText: 2026 Mark Phelps
// SPDX-License-Identifier: Apache-2.0

#include "spotify.h"

#include <ctype.h>
#include <errno.h>
#include <limits.h>
#include <stdatomic.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>

#include "cJSON.h"
#include "esp_crt_bundle.h"
#include "esp_heap_caps.h"
#include "esp_http_client.h"
#include "esp_log.h"
#include "esp_timer.h"
#include "freertos/FreeRTOS.h"
#include "freertos/queue.h"
#include "freertos/semphr.h"
#include "freertos/task.h"
#include "mbedtls/platform_util.h"
#include "json_stream.h"
#include "../cache.h"
#include "../wifi.h"

#define ACCESS_TOKEN_CAPACITY 2048
#define TOKEN_RESPONSE_CAPACITY 8192
#define PLAYBACK_RESPONSE_CAPACITY 32768
#define COMMAND_QUEUE_LENGTH 8
#define PLAYING_POLL_INTERVAL_MS 10000
#define IDLE_POLL_INTERVAL_MS 60000
#define RATE_LIMIT_FALLBACK_SECONDS 60
#define RATE_LIMIT_WAIT_SLICE_MS 60000
#define TOKEN_REFRESH_MARGIN_SECONDS 60
#define SPOTIFY_TASK_CORE 0
#define LIBRARY_REFRESH_INTERVAL_MS (15 * 60 * 1000)
#define LIBRARY_REQUEST_MIN_INTERVAL_MS 60000
#define LIBRARY_MAX_PAGES 25
#define LIBRARY_URL_CAPACITY 256
// Spotify returns at most ten albums of an artist per request.
#define ARTIST_ALBUM_PAGE_SIZE 10
#define SPOTIFY_API_PREFIX "https://api.spotify.com/v1/"
#define DEVICE_ID_CAPACITY 64

static const char *TAG = "bop_spotify";

typedef struct {
    char *data;
    size_t length;
    size_t capacity;
    int64_t retry_after_seconds;
    bool overflow;
    // With a sink, a successful body streams into it instead of the buffer,
    // so a list larger than the buffer can still be read. Error bodies still
    // land in the buffer.
    bool (*sink)(void *context, const char *data, size_t length);
    void *sink_context;
    bool sink_failed;
} response_buffer_t;

typedef struct {
    bop_credentials_t *credentials;
    char access_token[ACCESS_TOKEN_CAPACITY];
    int64_t access_token_expires_at;
    response_buffer_t response;
    esp_http_client_handle_t api_client;
    uint32_t volume_command_generation;
    // The client task's own copy of the artist list it loads, in PSRAM, and
    // the URL of the page that comes next.
    bop_artist_albums_t *artist_albums;
    char artist_next_url[LIBRARY_URL_CAPACITY];
} client_context_t;

typedef struct {
    spotify_command_t command;
    uint32_t request_id;
    char album_id[BOP_ALBUM_ID_CAPACITY];
    bool no_device;
} spotify_command_request_t;

typedef struct {
    uint8_t volume_percent;
    uint32_t generation;
} spotify_volume_request_t;

static SemaphoreHandle_t state_mutex;
static SemaphoreHandle_t cooldown_mutex;
static QueueHandle_t command_queue;
static QueueHandle_t command_result_queue;
static QueueHandle_t volume_queue;
static TaskHandle_t client_task_handle;
static playback_state_t current_state;
static int64_t rate_limit_deadline_us;
static uint32_t volume_request_generation;
static bool state_ready;
static atomic_bool client_started;
// Allocated once in PSRAM and never freed, like the shared handles. They and
// the artist request are guarded by state_mutex.
static bop_library_t *published_library;
static bop_artist_albums_t *published_artist_albums;
static char requested_artist_id[BOP_ALBUM_ID_CAPACITY];
static size_t requested_artist_count;
static atomic_bool library_refresh_requested;

static bool is_positive_decimal(const char *value)
{
    if (value == NULL || *value == '\0') {
        return false;
    }
    for (const unsigned char *character = (const unsigned char *)value;
         *character != '\0';
         ++character) {
        if (!isdigit(*character)) {
            return false;
        }
    }
    return true;
}

static esp_err_t collect_response(esp_http_client_event_t *event)
{
    response_buffer_t *response = event->user_data;
    if (event->event_id == HTTP_EVENT_ON_HEADER
        && event->header_key != NULL
        && event->header_value != NULL
        && strcasecmp(event->header_key, "Retry-After") == 0) {
        char *end = NULL;
        errno = 0;
        long long seconds = strtoll(event->header_value, &end, 10);
        if (is_positive_decimal(event->header_value)
            && errno != ERANGE
            && seconds > 0
            && seconds <= INT64_MAX / 1000000) {
            response->retry_after_seconds = seconds;
        }
        return ESP_OK;
    }
    if (event->event_id != HTTP_EVENT_ON_DATA || event->data_len <= 0) {
        return ESP_OK;
    }
    if (response->sink != NULL && esp_http_client_get_status_code(event->client) == 200) {
        if (!response->sink(response->sink_context, event->data, (size_t)event->data_len)) {
            response->sink_failed = true;
            return ESP_FAIL;
        }
        return ESP_OK;
    }
    if (response->length + (size_t)event->data_len >= response->capacity) {
        response->overflow = true;
        return ESP_FAIL;
    }
    memcpy(response->data + response->length, event->data, event->data_len);
    response->length += event->data_len;
    response->data[response->length] = '\0';
    return ESP_OK;
}

static void secure_free(char *data, size_t capacity)
{
    if (data != NULL) {
        mbedtls_platform_zeroize(data, capacity);
        free(data);
    }
}

static void secure_free_string(char *data)
{
    if (data != NULL) {
        secure_free(data, strlen(data) + 1);
    }
}

static void delete_token_response(cJSON *root)
{
    if (root == NULL) {
        return;
    }
    cJSON *access = cJSON_GetObjectItemCaseSensitive(root, "access_token");
    cJSON *refresh = cJSON_GetObjectItemCaseSensitive(root, "refresh_token");
    if (cJSON_IsString(access) && access->valuestring != NULL) {
        mbedtls_platform_zeroize(access->valuestring, strlen(access->valuestring));
    }
    if (cJSON_IsString(refresh) && refresh->valuestring != NULL) {
        mbedtls_platform_zeroize(refresh->valuestring, strlen(refresh->valuestring));
    }
    cJSON_Delete(root);
}

static bool is_form_safe(unsigned char character)
{
    return isalnum(character) || character == '-' || character == '.' || character == '_' || character == '~';
}

static char *form_encode(const char *value)
{
    size_t length = strlen(value);
    char *encoded = malloc(length * 3 + 1);
    if (encoded == NULL) {
        return NULL;
    }

    char *output = encoded;
    static const char hexadecimal[] = "0123456789ABCDEF";
    for (const unsigned char *input = (const unsigned char *)value; *input != '\0'; ++input) {
        if (is_form_safe(*input)) {
            *output++ = (char)*input;
        } else {
            *output++ = '%';
            *output++ = hexadecimal[*input >> 4];
            *output++ = hexadecimal[*input & 0x0f];
        }
    }
    *output = '\0';
    return encoded;
}

static esp_err_t perform_request(
    esp_http_client_handle_t client, response_buffer_t *response, int *status_code)
{
    response->length = 0;
    response->retry_after_seconds = 0;
    response->overflow = false;
    response->sink_failed = false;
    response->data[0] = '\0';
    esp_err_t error = esp_http_client_perform(client);
    *status_code = esp_http_client_get_status_code(client);
    if (response->overflow) {
        return ESP_ERR_INVALID_SIZE;
    }
    if (response->sink_failed) {
        return ESP_ERR_INVALID_RESPONSE;
    }
    return error;
}

static esp_err_t refresh_access_token(
    client_context_t *context, int64_t *retry_after_seconds, bool *rate_limited)
{
    *retry_after_seconds = 0;
    *rate_limited = false;
    char *encoded_refresh_token = form_encode(context->credentials->refresh_token);
    char *encoded_client_id = form_encode(context->credentials->client_id);
    char *response_data = malloc(TOKEN_RESPONSE_CAPACITY);
    if (encoded_refresh_token == NULL || encoded_client_id == NULL || response_data == NULL) {
        secure_free_string(encoded_refresh_token);
        secure_free_string(encoded_client_id);
        secure_free(response_data, TOKEN_RESPONSE_CAPACITY);
        return ESP_ERR_NO_MEM;
    }

    size_t payload_capacity = strlen(encoded_refresh_token) + strlen(encoded_client_id) + 64;
    char *payload = malloc(payload_capacity);
    if (payload == NULL) {
        secure_free_string(encoded_refresh_token);
        secure_free_string(encoded_client_id);
        secure_free(response_data, TOKEN_RESPONSE_CAPACITY);
        return ESP_ERR_NO_MEM;
    }
    snprintf(
        payload,
        payload_capacity,
        "grant_type=refresh_token&refresh_token=%s&client_id=%s",
        encoded_refresh_token,
        encoded_client_id);
    secure_free_string(encoded_refresh_token);
    secure_free_string(encoded_client_id);

    response_buffer_t response = {
        .data = response_data,
        .capacity = TOKEN_RESPONSE_CAPACITY,
    };
    esp_http_client_config_t configuration = {
        .url = "https://accounts.spotify.com/api/token",
        .method = HTTP_METHOD_POST,
        .event_handler = collect_response,
        .user_data = &response,
        .crt_bundle_attach = esp_crt_bundle_attach,
        .timeout_ms = 15000,
    };
    esp_http_client_handle_t client = esp_http_client_init(&configuration);
    if (client == NULL) {
        secure_free(payload, payload_capacity);
        secure_free(response_data, TOKEN_RESPONSE_CAPACITY);
        return ESP_ERR_NO_MEM;
    }

    esp_err_t error = esp_http_client_set_header(
        client, "Content-Type", "application/x-www-form-urlencoded");
    if (error == ESP_OK) {
        error = esp_http_client_set_post_field(client, payload, strlen(payload));
    }
    int status_code = 0;
    if (error == ESP_OK) {
        error = perform_request(client, &response, &status_code);
    }
    esp_http_client_cleanup(client);
    secure_free(payload, payload_capacity);
    *retry_after_seconds = response.retry_after_seconds;
    if (status_code == 429) {
        *rate_limited = true;
        ESP_LOGW(TAG, "Token refresh rate limit");
        secure_free(response_data, TOKEN_RESPONSE_CAPACITY);
        return ESP_ERR_TIMEOUT;
    }
    if (error != ESP_OK || status_code != 200) {
        ESP_LOGE(TAG, "Access token refresh failed (HTTP %d, %s)", status_code, esp_err_to_name(error));
        secure_free(response_data, TOKEN_RESPONSE_CAPACITY);
        return error == ESP_OK ? ESP_FAIL : error;
    }

    cJSON *root = cJSON_Parse(response_data);
    secure_free(response_data, TOKEN_RESPONSE_CAPACITY);
    if (root == NULL) {
        return ESP_ERR_INVALID_RESPONSE;
    }
    cJSON *access = cJSON_GetObjectItemCaseSensitive(root, "access_token");
    if (!cJSON_IsString(access)
        || access->valuestring == NULL
        || strlen(access->valuestring) >= sizeof(context->access_token)) {
        delete_token_response(root);
        return ESP_ERR_INVALID_SIZE;
    }

    cJSON *rotated = cJSON_GetObjectItemCaseSensitive(root, "refresh_token");
    if (cJSON_IsString(rotated) && rotated->valuestring != NULL && rotated->valuestring[0] != '\0') {
        if (strlen(rotated->valuestring) >= sizeof(context->credentials->refresh_token)) {
            delete_token_response(root);
            return ESP_ERR_INVALID_SIZE;
        }
        error = bop_credentials_store_refresh_token(rotated->valuestring);
        if (error != ESP_OK) {
            delete_token_response(root);
            return error;
        }
        mbedtls_platform_zeroize(
            context->credentials->refresh_token, sizeof(context->credentials->refresh_token));
        strlcpy(
            context->credentials->refresh_token,
            rotated->valuestring,
            sizeof(context->credentials->refresh_token));
        ESP_LOGI(TAG, "Stored a rotated refresh token");
    }

    mbedtls_platform_zeroize(context->access_token, sizeof(context->access_token));
    strlcpy(context->access_token, access->valuestring, sizeof(context->access_token));
    cJSON *expires = cJSON_GetObjectItemCaseSensitive(root, "expires_in");
    int expires_in = cJSON_IsNumber(expires) && expires->valueint > 0 ? expires->valueint : 3600;
    context->access_token_expires_at = esp_timer_get_time() / 1000000 + expires_in;
    delete_token_response(root);
    ESP_LOGI(TAG, "Access token obtained");
    return ESP_OK;
}

static esp_err_t ensure_access_token(
    client_context_t *context,
    bool force_refresh,
    int64_t *retry_after_seconds,
    bool *rate_limited)
{
    int64_t now = esp_timer_get_time() / 1000000;
    bool expiring = context->access_token_expires_at - now <= TOKEN_REFRESH_MARGIN_SECONDS;
    if (force_refresh || context->access_token[0] == '\0' || expiring) {
        return refresh_access_token(context, retry_after_seconds, rate_limited);
    }
    *retry_after_seconds = 0;
    *rate_limited = false;
    return ESP_OK;
}

static esp_err_t set_authorization_header(client_context_t *context)
{
    size_t capacity = strlen(context->access_token) + sizeof("Bearer ");
    char *authorization = malloc(capacity);
    if (authorization == NULL) {
        return ESP_ERR_NO_MEM;
    }
    snprintf(authorization, capacity, "Bearer %s", context->access_token);
    esp_err_t error = esp_http_client_set_header(
        context->api_client, "Authorization", authorization);
    secure_free(authorization, capacity);
    return error;
}

// The API client is kept alive and reused, and it keeps a post field and its
// headers between requests. A body therefore leaves with this request only:
// a NULL post field also removes the Content-Type header that came with it.
static esp_err_t set_request_body(esp_http_client_handle_t client, const char *body)
{
    if (body == NULL) {
        // Without an earlier body there is no Content-Type header, and its
        // removal reports ESP_ERR_NOT_FOUND. Either way no body remains, so
        // the result is ignored: failing here failed every GET request.
        esp_http_client_set_post_field(client, NULL, 0);
        return ESP_OK;
    }
    esp_err_t error = esp_http_client_set_header(client, "Content-Type", "application/json");
    if (error == ESP_OK) {
        error = esp_http_client_set_post_field(client, body, (int)strlen(body));
    }
    return error;
}

static esp_err_t api_request_with_body(
    client_context_t *context,
    const char *url,
    esp_http_client_method_t method,
    const char *body,
    int *status_code,
    int64_t *retry_after_seconds,
    bool *rate_limited)
{
    *retry_after_seconds = 0;
    *rate_limited = false;
    for (int attempt = 0; attempt < 2; ++attempt) {
        esp_err_t error = ensure_access_token(
            context, attempt > 0, retry_after_seconds, rate_limited);
        if (error != ESP_OK) {
            return error;
        }
        error = esp_http_client_set_url(context->api_client, url);
        if (error == ESP_OK) {
            error = esp_http_client_set_method(context->api_client, method);
        }
        if (error == ESP_OK) {
            error = set_authorization_header(context);
        }
        if (error == ESP_OK) {
            error = set_request_body(context->api_client, body);
        }
        if (error == ESP_OK) {
            error = perform_request(context->api_client, &context->response, status_code);
        }
        if (body != NULL) {
            set_request_body(context->api_client, NULL);
        }
        *retry_after_seconds = context->response.retry_after_seconds;
        *rate_limited = *status_code == 429;
        if (error != ESP_OK || *status_code != 401) {
            return error;
        }
        ESP_LOGW(TAG, "Spotify rejected the access token; refreshing it once");
        mbedtls_platform_zeroize(context->access_token, sizeof(context->access_token));
        context->access_token_expires_at = 0;
    }
    return ESP_FAIL;
}

static esp_err_t api_request(
    client_context_t *context,
    const char *url,
    esp_http_client_method_t method,
    int *status_code,
    int64_t *retry_after_seconds,
    bool *rate_limited)
{
    return api_request_with_body(
        context, url, method, NULL, status_code, retry_after_seconds, rate_limited);
}

static bool playback_state_equal(const playback_state_t *left, const playback_state_t *right)
{
    return left->available == right->available
        && left->is_playing == right->is_playing
        && left->is_episode == right->is_episode
        && left->progress_ms == right->progress_ms
        && left->duration_ms == right->duration_ms
        && left->volume_percent == right->volume_percent
        && left->volume_available == right->volume_available
        && left->volume_command_generation == right->volume_command_generation
        && strcmp(left->track_id, right->track_id) == 0
        && strcmp(left->album_id, right->album_id) == 0
        && strcmp(left->title, right->title) == 0
        && strcmp(left->artists, right->artists) == 0
        && strcmp(left->album_art_url, right->album_art_url) == 0;
}

static void publish_state(playback_state_t *next)
{
    xSemaphoreTake(state_mutex, portMAX_DELAY);
    playback_state_t previous = current_state;
    bool first_state = !state_ready;
    bool changed = first_state || !playback_state_equal(&previous, next);
    if (changed) {
        next->change_counter = previous.change_counter + 1;
        current_state = *next;
        state_ready = true;
    }
    xSemaphoreGive(state_mutex);

    if (!changed) {
        return;
    }
    if (!next->available && (first_state || previous.available)) {
        ESP_LOGI(TAG, "Playback state: nothing is playing");
        return;
    }
    if (next->available
        && (first_state || !previous.available || strcmp(previous.track_id, next->track_id) != 0)) {
        ESP_LOGI(TAG, "Playback state: %s — %s", next->title, next->artists);
    }
    if (next->available
        && (!previous.available || previous.is_playing != next->is_playing)) {
        ESP_LOGI(TAG, "Playback is %s", next->is_playing ? "playing" : "paused");
    }
}

static void append_artist(char *artists, size_t capacity, const char *name)
{
    size_t used = strlen(artists);
    if (used > 0 && used + 2 < capacity) {
        strlcpy(artists + used, ", ", capacity - used);
        used += 2;
    }
    if (used < capacity) {
        strlcpy(artists + used, name, capacity - used);
    }
}

static uint32_t json_uint32(cJSON *value)
{
    if (!cJSON_IsNumber(value) || value->valuedouble <= 0) {
        return 0;
    }
    if (value->valuedouble >= UINT32_MAX) {
        return UINT32_MAX;
    }
    return (uint32_t)value->valuedouble;
}

// Spotify lists one image in several sizes. The 300-pixel image keeps the
// download and the JPEG decode small, and art.c scales it to the 368-pixel art
// area. The first listed image is the fallback when no 300-pixel one exists.
static void copy_art_url(cJSON *images, char *output, size_t capacity)
{
    cJSON *selected = cJSON_IsArray(images) ? cJSON_GetArrayItem(images, 0) : NULL;
    cJSON *image = NULL;
    cJSON_ArrayForEach(image, images) {
        cJSON *width = cJSON_GetObjectItemCaseSensitive(image, "width");
        if (cJSON_IsNumber(width) && width->valueint == 300) {
            selected = image;
            break;
        }
    }
    cJSON *url = cJSON_IsObject(selected)
        ? cJSON_GetObjectItemCaseSensitive(selected, "url")
        : NULL;
    if (cJSON_IsString(url) && url->valuestring != NULL) {
        strlcpy(output, url->valuestring, capacity);
    }
}

static esp_err_t parse_playback(const char *json, playback_state_t *state)
{
    cJSON *root = cJSON_Parse(json);
    if (root == NULL) {
        return ESP_ERR_INVALID_RESPONSE;
    }
    *state = (playback_state_t){0};
    cJSON *device = cJSON_GetObjectItemCaseSensitive(root, "device");
    cJSON *volume = cJSON_IsObject(device)
        ? cJSON_GetObjectItemCaseSensitive(device, "volume_percent")
        : NULL;
    if (cJSON_IsNumber(volume)
        && volume->valuedouble >= 0.0
        && volume->valuedouble <= 100.0
        && volume->valuedouble == (double)volume->valueint) {
        state->volume_percent = (uint8_t)volume->valueint;
        state->volume_available = true;
    }

    cJSON *item = cJSON_GetObjectItemCaseSensitive(root, "item");
    if (cJSON_IsNull(item)) {
        cJSON_Delete(root);
        return ESP_OK;
    }
    cJSON *title = cJSON_IsObject(item) ? cJSON_GetObjectItemCaseSensitive(item, "name") : NULL;
    if (!cJSON_IsString(title) || title->valuestring == NULL) {
        cJSON_Delete(root);
        return ESP_ERR_INVALID_RESPONSE;
    }

    state->available = true;
    strlcpy(state->title, title->valuestring, sizeof(state->title));
    cJSON *track_id = cJSON_GetObjectItemCaseSensitive(item, "id");
    if (cJSON_IsString(track_id) && track_id->valuestring != NULL) {
        strlcpy(state->track_id, track_id->valuestring, sizeof(state->track_id));
    }

    cJSON *type = cJSON_GetObjectItemCaseSensitive(item, "type");
    state->is_episode = cJSON_IsString(type)
        && type->valuestring != NULL
        && strcmp(type->valuestring, "episode") == 0;

    if (state->is_episode) {
        // An episode names its show where a track names its artists, and it
        // carries its own images where a track uses the album's. Some episodes
        // ship no images, so the show's images are the fallback.
        cJSON *show = cJSON_GetObjectItemCaseSensitive(item, "show");
        cJSON *show_name = cJSON_IsObject(show)
            ? cJSON_GetObjectItemCaseSensitive(show, "name")
            : NULL;
        if (cJSON_IsString(show_name) && show_name->valuestring != NULL) {
            strlcpy(state->artists, show_name->valuestring, sizeof(state->artists));
        }
        copy_art_url(
            cJSON_GetObjectItemCaseSensitive(item, "images"),
            state->album_art_url,
            sizeof(state->album_art_url));
        if (state->album_art_url[0] == '\0' && cJSON_IsObject(show)) {
            copy_art_url(
                cJSON_GetObjectItemCaseSensitive(show, "images"),
                state->album_art_url,
                sizeof(state->album_art_url));
        }
    } else {
        cJSON *artists = cJSON_GetObjectItemCaseSensitive(item, "artists");
        cJSON *artist = NULL;
        cJSON_ArrayForEach(artist, artists) {
            cJSON *name = cJSON_GetObjectItemCaseSensitive(artist, "name");
            if (cJSON_IsString(name) && name->valuestring != NULL) {
                append_artist(state->artists, sizeof(state->artists), name->valuestring);
            }
        }
        cJSON *album = cJSON_GetObjectItemCaseSensitive(item, "album");
        copy_art_url(
            cJSON_IsObject(album) ? cJSON_GetObjectItemCaseSensitive(album, "images") : NULL,
            state->album_art_url,
            sizeof(state->album_art_url));
        cJSON *album_id = cJSON_IsObject(album)
            ? cJSON_GetObjectItemCaseSensitive(album, "id")
            : NULL;
        if (cJSON_IsString(album_id) && album_id->valuestring != NULL) {
            strlcpy(state->album_id, album_id->valuestring, sizeof(state->album_id));
        }
    }

    cJSON *progress = cJSON_GetObjectItemCaseSensitive(root, "progress_ms");
    cJSON *duration = cJSON_GetObjectItemCaseSensitive(item, "duration_ms");
    cJSON *is_playing = cJSON_GetObjectItemCaseSensitive(root, "is_playing");
    state->progress_ms = json_uint32(progress);
    state->duration_ms = json_uint32(duration);
    state->is_playing = cJSON_IsTrue(is_playing);

    cJSON_Delete(root);
    return ESP_OK;
}

static esp_err_t poll_current_playback(
    client_context_t *context, int64_t *retry_after_seconds, bool *rate_limited)
{
    int status_code = 0;
    // Without additional_types, Spotify answers a playing podcast or audiobook
    // episode with a null item, and Bop would show "nothing playing".
    esp_err_t error = api_request(
        context,
        "https://api.spotify.com/v1/me/player?additional_types=episode",
        HTTP_METHOD_GET,
        &status_code,
        retry_after_seconds,
        rate_limited);
    if (error != ESP_OK) {
        ESP_LOGE(TAG, "Playback poll failed: %s", esp_err_to_name(error));
        return error;
    }
    if (status_code == 429) {
        ESP_LOGW(TAG, "Spotify rate limit");
        return ESP_ERR_TIMEOUT;
    }
    if (status_code == 204) {
        playback_state_t empty = {
            .volume_command_generation = context->volume_command_generation,
        };
        publish_state(&empty);
        return ESP_OK;
    }
    if (status_code != 200) {
        ESP_LOGE(TAG, "Playback poll failed (HTTP %d)", status_code);
        return ESP_FAIL;
    }

    playback_state_t next = {0};
    error = parse_playback(context->response.data, &next);
    if (error == ESP_OK) {
        next.volume_command_generation = context->volume_command_generation;
        publish_state(&next);
    } else {
        ESP_LOGE(TAG, "Playback response is invalid");
    }
    return error;
}

static const char *command_name(spotify_command_t command, bool is_playing)
{
    if (command == SPOTIFY_COMMAND_NEXT) {
        return "next";
    }
    if (command == SPOTIFY_COMMAND_PREVIOUS) {
        return "previous";
    }
    return is_playing ? "pause" : "play";
}

static esp_err_t send_command(
    client_context_t *context,
    spotify_command_t command,
    int64_t *retry_after_seconds,
    bool *rate_limited,
    bool *was_playing)
{
    playback_state_t state = {0};
    bop_spotify_get_state(&state);
    *was_playing = state.is_playing;
    const char *url = NULL;
    esp_http_client_method_t method = HTTP_METHOD_POST;
    if (command == SPOTIFY_COMMAND_NEXT) {
        url = "https://api.spotify.com/v1/me/player/next";
    } else if (command == SPOTIFY_COMMAND_PREVIOUS) {
        url = "https://api.spotify.com/v1/me/player/previous";
    } else if (state.is_playing) {
        url = "https://api.spotify.com/v1/me/player/pause";
        method = HTTP_METHOD_PUT;
    } else {
        url = "https://api.spotify.com/v1/me/player/play";
        method = HTTP_METHOD_PUT;
    }

    const char *name = command_name(command, state.is_playing);
    ESP_LOGI(TAG, "Sending %s command", name);
    int status_code = 0;
    esp_err_t error = api_request(
        context, url, method, &status_code, retry_after_seconds, rate_limited);
    if (error != ESP_OK) {
        ESP_LOGE(TAG, "%s command failed: %s", name, esp_err_to_name(error));
        return error;
    }
    if (status_code == 429) {
        ESP_LOGW(TAG, "Spotify rate limit");
        return ESP_ERR_TIMEOUT;
    }
    if (status_code < 200 || status_code >= 300) {
        ESP_LOGE(TAG, "%s command failed (HTTP %d)", name, status_code);
        return ESP_FAIL;
    }
    ESP_LOGI(TAG, "%s command accepted", name);
    return ESP_OK;
}

static esp_err_t send_volume(
    client_context_t *context,
    uint8_t volume_percent,
    int64_t *retry_after_seconds,
    bool *rate_limited)
{
    playback_state_t state = {0};
    if (!bop_spotify_get_state(&state) || !state.volume_available) {
        ESP_LOGW(TAG, "Volume command ignored because device volume is unavailable");
        return ESP_ERR_INVALID_STATE;
    }

    char url[96];
    int length = snprintf(
        url,
        sizeof(url),
        "https://api.spotify.com/v1/me/player/volume?volume_percent=%u",
        (unsigned int)volume_percent);
    if (length < 0 || (size_t)length >= sizeof(url)) {
        return ESP_ERR_INVALID_SIZE;
    }

    ESP_LOGI(TAG, "Sending volume command (%u%%)", (unsigned int)volume_percent);
    int status_code = 0;
    esp_err_t error = api_request(
        context,
        url,
        HTTP_METHOD_PUT,
        &status_code,
        retry_after_seconds,
        rate_limited);
    if (error != ESP_OK) {
        ESP_LOGE(TAG, "Volume command failed: %s", esp_err_to_name(error));
        return error;
    }
    if (status_code == 429) {
        ESP_LOGW(TAG, "Spotify rate limit");
        return ESP_ERR_TIMEOUT;
    }
    if (status_code != 204) {
        ESP_LOGE(TAG, "Volume command failed (HTTP %d)", status_code);
        return ESP_FAIL;
    }
    ESP_LOGI(TAG, "Volume command accepted");
    return ESP_OK;
}

static void publish_command_result(
    const spotify_command_request_t *request, bool accepted, bool rate_limited, bool was_playing)
{
    if (request->request_id == 0) {
        return;
    }
    spotify_command_result_t result = {
        .command = request->command,
        .request_id = request->request_id,
        .accepted = accepted,
        .rate_limited = rate_limited,
        .was_playing = was_playing,
        .no_device = request->no_device,
    };
    if (xQueueSend(command_result_queue, &result, 0) != pdTRUE) {
        ESP_LOGW(TAG, "Spotify command result queue is full");
    }
}

static void start_rate_limit_cooldown(int64_t retry_after_seconds);

// Spotify IDs are base 62. The check keeps an ID from the network or from the
// UI from carrying anything into a URL or a JSON body built around it.
static bool is_spotify_id(const char *value, size_t capacity)
{
    if (value == NULL || value[0] == '\0') {
        return false;
    }
    size_t length = 0;
    for (; value[length] != '\0'; ++length) {
        if (length + 1 >= capacity || !isalnum((unsigned char)value[length])) {
            return false;
        }
    }
    return true;
}

// The library and an artist's album list share one entry layout. A publish
// happens only on a real change, so the UI copies only then.
static bool entries_equal(
    const bop_library_entry_t *left, const bop_library_entry_t *right, size_t count)
{
    for (size_t index = 0; index < count; ++index) {
        if (left[index].kind != right[index].kind
            || strcmp(left[index].id, right[index].id) != 0
            || strcmp(left[index].cover_url, right[index].cover_url) != 0) {
            return false;
        }
    }
    return true;
}

static uint32_t next_generation(uint32_t generation)
{
    return generation + 1 == 0 ? 1 : generation + 1;
}

static void publish_library(bop_library_t *next)
{
    xSemaphoreTake(state_mutex, portMAX_DELAY);
    bool changed = published_library->status != next->status
        || published_library->complete != next->complete
        || published_library->count != next->count
        || !entries_equal(published_library->entries, next->entries, next->count);
    if (changed) {
        next->generation = next_generation(published_library->generation);
        *published_library = *next;
    }
    xSemaphoreGive(state_mutex);
    if (!changed) {
        return;
    }
    if (next->status == BOP_LIBRARY_READY && next->complete) {
        ESP_LOGI(TAG, "Library: %u artists and albums", (unsigned)next->count);
    } else if (next->status == BOP_LIBRARY_FAILED) {
        ESP_LOGW(TAG, "The library could not be read");
    }
}

static bop_library_status_t published_library_status(void)
{
    xSemaphoreTake(state_mutex, portMAX_DELAY);
    bop_library_status_t status = published_library->status;
    xSemaphoreGive(state_mutex);
    return status;
}

// Gathers one kind of entry from a streamed Spotify list. The paths name
// where an entry, its ID, and its images sit in that list's JSON.
typedef struct {
    bop_library_entry_t *entries;
    size_t *count;
    size_t capacity;
    bop_library_entry_kind_t kind;
    char entry_path[48];
    char id_path[56];
    char image_path[56];
    char image_url_path[64];
    char image_width_path[64];
    char next_path[48];
    char id[BOP_ALBUM_ID_CAPACITY];
    char image_url[BOP_COVER_URL_CAPACITY];
    int image_width;
    char cover_url[BOP_COVER_URL_CAPACITY];
    int cover_width;
    char next_url[LIBRARY_URL_CAPACITY];
} entry_collector_t;

static void init_collector(
    entry_collector_t *collector,
    bop_library_entry_t *entries,
    size_t *count,
    size_t capacity,
    bop_library_entry_kind_t kind,
    const char *entry_path,
    const char *next_path)
{
    memset(collector, 0, sizeof(*collector));
    collector->entries = entries;
    collector->count = count;
    collector->capacity = capacity;
    collector->kind = kind;
    strlcpy(collector->entry_path, entry_path, sizeof(collector->entry_path));
    strlcpy(collector->next_path, next_path, sizeof(collector->next_path));
    snprintf(collector->id_path, sizeof(collector->id_path), "%s.id", entry_path);
    snprintf(collector->image_path, sizeof(collector->image_path), "%s.images", entry_path);
    snprintf(
        collector->image_url_path, sizeof(collector->image_url_path), "%s.images.url", entry_path);
    snprintf(
        collector->image_width_path,
        sizeof(collector->image_width_path),
        "%s.images.width",
        entry_path);
}

// Keeps the narrowest image that still fills a grid tile. When no image is
// that wide, it keeps the widest one.
static void consider_image(entry_collector_t *collector)
{
    if (collector->image_url[0] == '\0') {
        return;
    }
    int width = collector->image_width;
    bool better = collector->cover_url[0] == '\0';
    if (!better && width >= BOP_COVER_MIN_WIDTH) {
        better = collector->cover_width < BOP_COVER_MIN_WIDTH || width < collector->cover_width;
    } else if (!better) {
        better = collector->cover_width < BOP_COVER_MIN_WIDTH && width > collector->cover_width;
    }
    if (better) {
        strlcpy(collector->cover_url, collector->image_url, sizeof(collector->cover_url));
        collector->cover_width = width;
    }
}

static void commit_entry(entry_collector_t *collector)
{
    bool valid = is_spotify_id(collector->id, sizeof(collector->id))
        && *collector->count < collector->capacity;
    for (size_t index = 0; valid && index < *collector->count; ++index) {
        valid = strcmp(collector->entries[index].id, collector->id) != 0;
    }
    if (valid) {
        bop_library_entry_t *entry = &collector->entries[(*collector->count)++];
        entry->kind = collector->kind;
        strlcpy(entry->id, collector->id, sizeof(entry->id));
        strlcpy(entry->cover_url, collector->cover_url, sizeof(entry->cover_url));
    }
    collector->id[0] = '\0';
    collector->cover_url[0] = '\0';
    collector->cover_width = 0;
}

static void collect_value(void *context, const char *path, const char *value, bool is_string)
{
    entry_collector_t *collector = context;
    if (strcmp(path, collector->id_path) == 0 && is_string) {
        strlcpy(collector->id, value, sizeof(collector->id));
    } else if (strcmp(path, collector->image_url_path) == 0 && is_string) {
        strlcpy(collector->image_url, value, sizeof(collector->image_url));
    } else if (strcmp(path, collector->image_width_path) == 0 && !is_string) {
        collector->image_width = atoi(value);
    } else if (strcmp(path, collector->next_path) == 0) {
        if (is_string) {
            strlcpy(collector->next_url, value, sizeof(collector->next_url));
        } else {
            collector->next_url[0] = '\0';
        }
    }
}

static void collect_close(void *context, const char *path, bool is_array)
{
    entry_collector_t *collector = context;
    if (is_array) {
        return;
    }
    if (strcmp(path, collector->image_path) == 0) {
        consider_image(collector);
        collector->image_url[0] = '\0';
        collector->image_width = 0;
    } else if (strcmp(path, collector->entry_path) == 0) {
        commit_entry(collector);
    }
}

// Counts the bytes of library lists, so the log can report the throughput.
static size_t library_bytes_received;

static bool feed_json_stream(void *context, const char *data, size_t length)
{
    library_bytes_received += length;
    return bop_json_stream_feed(context, data, length);
}

// Reads one page of a list while it streams in. On success the collector
// holds the next page URL, or an empty one at the end of the list.
static esp_err_t fetch_entry_page(
    client_context_t *context,
    const char *url,
    entry_collector_t *collector,
    int64_t *retry_after_seconds,
    bool *rate_limited)
{
    char request_url[LIBRARY_URL_CAPACITY];
    strlcpy(request_url, url, sizeof(request_url));
    bop_json_stream_t *stream = malloc(sizeof(*stream));
    if (stream == NULL) {
        return ESP_ERR_NO_MEM;
    }
    bop_json_stream_init(stream, collect_value, collect_close, collector);
    collector->next_url[0] = '\0';
    context->response.sink = feed_json_stream;
    context->response.sink_context = stream;
    int status_code = 0;
    esp_err_t error = api_request(
        context, request_url, HTTP_METHOD_GET, &status_code, retry_after_seconds, rate_limited);
    context->response.sink = NULL;
    context->response.sink_context = NULL;
    bool complete = bop_json_stream_complete(stream);
    free(stream);
    if (error != ESP_OK || *rate_limited) {
        return error != ESP_OK ? error : ESP_ERR_TIMEOUT;
    }
    if (status_code != 200) {
        ESP_LOGE(TAG, "Library request failed (HTTP %d)", status_code);
        return ESP_FAIL;
    }
    if (!complete) {
        ESP_LOGE(TAG, "Library response is incomplete");
        return ESP_ERR_INVALID_RESPONSE;
    }
    // The next page must come from the same API. Any other URL ends the list.
    if (strncmp(collector->next_url, SPOTIFY_API_PREFIX, strlen(SPOTIFY_API_PREFIX)) != 0) {
        collector->next_url[0] = '\0';
    }
    return ESP_OK;
}

// With a progress list, every page that arrives is published at once, so the
// grid fills while the rest still loads.
static esp_err_t fetch_entry_list(
    client_context_t *context,
    const char *first_url,
    entry_collector_t *collector,
    bop_library_t *progress,
    int64_t *retry_after_seconds,
    bool *rate_limited)
{
    char url[LIBRARY_URL_CAPACITY];
    strlcpy(url, first_url, sizeof(url));
    for (int page = 0; page < LIBRARY_MAX_PAGES; ++page) {
        esp_err_t error = fetch_entry_page(
            context, url, collector, retry_after_seconds, rate_limited);
        if (error != ESP_OK) {
            return error;
        }
        if (progress != NULL && progress->count > 0) {
            progress->status = BOP_LIBRARY_READY;
            progress->complete = false;
            publish_library(progress);
        }
        if (collector->next_url[0] == '\0' || *collector->count >= collector->capacity) {
            return ESP_OK;
        }
        strlcpy(url, collector->next_url, sizeof(url));
    }
    return ESP_OK;
}

// Followed artists come first, then saved albums. A failed refresh keeps a
// library that already works, so children keep their albums through a short
// network or Spotify fault.
static esp_err_t refresh_library(
    client_context_t *context, int64_t *retry_after_seconds, bool *rate_limited)
{
    int64_t started_us = esp_timer_get_time();
    library_bytes_received = 0;
    bop_library_t *next = heap_caps_calloc(1, sizeof(*next), MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
    entry_collector_t *collector = malloc(sizeof(*collector));
    if (next == NULL || collector == NULL) {
        free(next);
        free(collector);
        return ESP_ERR_NO_MEM;
    }
    // The first read shows each page as it arrives. A later refresh replaces a
    // working library only once it is whole, so the grid never shrinks.
    bop_library_t *progress = published_library_status() == BOP_LIBRARY_READY ? NULL : next;
    init_collector(
        collector,
        next->entries,
        &next->count,
        BOP_LIBRARY_ARTIST_CAPACITY,
        BOP_LIBRARY_ENTRY_ARTIST,
        "artists.items",
        "artists.next");
    esp_err_t error = fetch_entry_list(
        context,
        "https://api.spotify.com/v1/me/following?type=artist&limit=50",
        collector,
        progress,
        retry_after_seconds,
        rate_limited);
    if (error == ESP_OK) {
        // A saved album arrives with its whole track list. The stream keeps
        // only the album ID and the images.
        init_collector(
            collector,
            next->entries,
            &next->count,
            BOP_LIBRARY_CAPACITY,
            BOP_LIBRARY_ENTRY_ALBUM,
            "items.album",
            "next");
        // Fifty is Spotify's maximum page size. Fewer, larger pages save a
        // request round trip for every twenty albums.
        error = fetch_entry_list(
            context,
            "https://api.spotify.com/v1/me/albums?limit=50&market=from_token",
            collector,
            progress,
            retry_after_seconds,
            rate_limited);
    }
    free(collector);
    if (*rate_limited) {
        free(next);
        return ESP_ERR_TIMEOUT;
    }
    if (error == ESP_OK) {
        next->status = BOP_LIBRARY_READY;
        next->complete = true;
        publish_library(next);
        // Only a whole list is stored. The cache writes only on a change.
        bop_cache_store_library(next);
        unsigned milliseconds = (unsigned)((esp_timer_get_time() - started_us) / 1000);
        ESP_LOGI(
            TAG,
            "Library read in %u ms, %u KB (%u KB/s)",
            milliseconds,
            (unsigned)(library_bytes_received / 1024),
            milliseconds > 0 ? (unsigned)(library_bytes_received / milliseconds) : 0);
    } else if (progress != NULL && next->count > 0) {
        // The first read failed partway. The pages that arrived stay shown,
        // and the next refresh completes the list.
        next->status = BOP_LIBRARY_READY;
        next->complete = true;
        publish_library(next);
    } else if (published_library_status() != BOP_LIBRARY_READY) {
        next->status = BOP_LIBRARY_FAILED;
        next->count = 0;
        publish_library(next);
    }
    free(next);
    return error;
}

// The stored list shows at once after a restart. It counts as a working
// library, so the first network read replaces it only once that read is
// whole, and the grid never empties meanwhile.
static void publish_cached_library(void)
{
    bop_library_t *cached = heap_caps_calloc(
        1, sizeof(*cached), MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
    if (cached == NULL) {
        return;
    }
    if (bop_cache_load_library(cached)) {
        cached->status = BOP_LIBRARY_READY;
        cached->complete = true;
        publish_library(cached);
        ESP_LOGI(TAG, "Library from cache: %u artists and albums", (unsigned)cached->count);
    }
    free(cached);
}

static void publish_artist_albums(bop_artist_albums_t *working)
{
    xSemaphoreTake(state_mutex, portMAX_DELAY);
    bool changed = strcmp(published_artist_albums->artist_id, working->artist_id) != 0
        || published_artist_albums->status != working->status
        || published_artist_albums->complete != working->complete
        || published_artist_albums->count != working->count
        || !entries_equal(published_artist_albums->entries, working->entries, working->count);
    if (changed) {
        working->generation = next_generation(published_artist_albums->generation);
        *published_artist_albums = *working;
    }
    xSemaphoreGive(state_mutex);
}

// Loads one more page of the requested artist's albums. Returns true while the
// grid still wants more than has arrived, so the client task goes on.
static bool load_artist_albums_step(
    client_context_t *context, int64_t *retry_after_seconds, bool *rate_limited)
{
    *rate_limited = false;
    char artist_id[BOP_ALBUM_ID_CAPACITY];
    xSemaphoreTake(state_mutex, portMAX_DELAY);
    strlcpy(artist_id, requested_artist_id, sizeof(artist_id));
    size_t wanted = requested_artist_count;
    xSemaphoreGive(state_mutex);

    bop_artist_albums_t *working = context->artist_albums;
    if (strcmp(artist_id, working->artist_id) != 0) {
        // Another artist, or none: a new list starts.
        memset(working, 0, sizeof(*working));
        strlcpy(working->artist_id, artist_id, sizeof(working->artist_id));
        working->status = BOP_LIBRARY_LOADING;
        working->complete = artist_id[0] == '\0';
        // Only regular albums: an audio-drama episode is one, while singles
        // and compilations would bury them.
        snprintf(
            context->artist_next_url,
            sizeof(context->artist_next_url),
            "https://api.spotify.com/v1/artists/%s/albums"
            "?include_groups=album&limit=%d&market=from_token",
            artist_id,
            ARTIST_ALBUM_PAGE_SIZE);
        publish_artist_albums(working);
    }
    if (working->complete || working->count >= wanted) {
        return false;
    }

    entry_collector_t *collector = malloc(sizeof(*collector));
    if (collector == NULL) {
        return false;
    }
    init_collector(
        collector,
        working->entries,
        &working->count,
        BOP_ARTIST_ALBUM_CAPACITY,
        BOP_LIBRARY_ENTRY_ALBUM,
        "items",
        "next");
    bop_wifi_hold_awake(true);
    esp_err_t error = fetch_entry_page(
        context, context->artist_next_url, collector, retry_after_seconds, rate_limited);
    bop_wifi_hold_awake(false);
    if (*rate_limited) {
        free(collector);
        return false;
    }
    if (error == ESP_OK) {
        strlcpy(context->artist_next_url, collector->next_url, sizeof(context->artist_next_url));
        working->status = BOP_LIBRARY_READY;
        working->complete = context->artist_next_url[0] == '\0'
            || working->count >= BOP_ARTIST_ALBUM_CAPACITY;
    } else {
        // The grid keeps what arrived. Opening the artist again starts over.
        working->status = working->count > 0 ? BOP_LIBRARY_READY : BOP_LIBRARY_FAILED;
        working->complete = true;
    }
    free(collector);
    publish_artist_albums(working);
    return !working->complete && working->count < wanted;
}

// Without an active device, Spotify answers a play request with 404. The
// first device that accepts remote control, active or not, then plays.
static esp_err_t find_available_device(
    client_context_t *context,
    char device_id[DEVICE_ID_CAPACITY],
    int64_t *retry_after_seconds,
    bool *rate_limited)
{
    device_id[0] = '\0';
    int status_code = 0;
    esp_err_t error = api_request(
        context,
        "https://api.spotify.com/v1/me/player/devices",
        HTTP_METHOD_GET,
        &status_code,
        retry_after_seconds,
        rate_limited);
    if (error != ESP_OK || *rate_limited) {
        return error != ESP_OK ? error : ESP_ERR_TIMEOUT;
    }
    if (status_code != 200) {
        ESP_LOGE(TAG, "Device list failed (HTTP %d)", status_code);
        return ESP_FAIL;
    }
    cJSON *root = cJSON_Parse(context->response.data);
    if (root == NULL) {
        return ESP_ERR_INVALID_RESPONSE;
    }
    cJSON *device = NULL;
    cJSON_ArrayForEach(device, cJSON_GetObjectItemCaseSensitive(root, "devices")) {
        cJSON *id = cJSON_GetObjectItemCaseSensitive(device, "id");
        if (cJSON_IsTrue(cJSON_GetObjectItemCaseSensitive(device, "is_restricted"))
            || !cJSON_IsString(id)
            || !is_spotify_id(id->valuestring, DEVICE_ID_CAPACITY)) {
            continue;
        }
        bool active = cJSON_IsTrue(cJSON_GetObjectItemCaseSensitive(device, "is_active"));
        if (device_id[0] == '\0' || active) {
            strlcpy(device_id, id->valuestring, DEVICE_ID_CAPACITY);
        }
        if (active) {
            break;
        }
    }
    cJSON_Delete(root);
    return ESP_OK;
}

static esp_err_t send_play_album(
    client_context_t *context,
    spotify_command_request_t *request,
    int64_t *retry_after_seconds,
    bool *rate_limited)
{
    request->no_device = false;
    if (!is_spotify_id(request->album_id, sizeof(request->album_id))) {
        return ESP_ERR_INVALID_ARG;
    }
    char body[128];
    snprintf(
        body,
        sizeof(body),
        "{\"context_uri\":\"spotify:album:%s\",\"offset\":{\"position\":0},\"position_ms\":0}",
        request->album_id);

    ESP_LOGI(TAG, "Starting an album");
    char device_id[DEVICE_ID_CAPACITY] = {0};
    char url[160] = "https://api.spotify.com/v1/me/player/play";
    int status_code = 0;
    esp_err_t error = api_request_with_body(
        context, url, HTTP_METHOD_PUT, body, &status_code, retry_after_seconds, rate_limited);
    if (error == ESP_OK && !*rate_limited && status_code == 404) {
        error = find_available_device(context, device_id, retry_after_seconds, rate_limited);
        if (error == ESP_OK && !*rate_limited && device_id[0] == '\0') {
            request->no_device = true;
            ESP_LOGW(TAG, "No Spotify device is available to play the album");
            return ESP_ERR_NOT_FOUND;
        }
        if (error == ESP_OK && !*rate_limited) {
            snprintf(
                url,
                sizeof(url),
                "https://api.spotify.com/v1/me/player/play?device_id=%s",
                device_id);
            ESP_LOGI(TAG, "No device was active; starting the album on an available one");
            error = api_request_with_body(
                context, url, HTTP_METHOD_PUT, body, &status_code,
                retry_after_seconds, rate_limited);
        }
    }
    if (error != ESP_OK) {
        ESP_LOGE(TAG, "Album start failed: %s", esp_err_to_name(error));
        return error;
    }
    if (*rate_limited) {
        return ESP_ERR_TIMEOUT;
    }
    if (status_code < 200 || status_code >= 300) {
        request->no_device = status_code == 404;
        ESP_LOGE(TAG, "Album start failed (HTTP %d)", status_code);
        return ESP_FAIL;
    }

    // Children's albums are often stories told across tracks, so they play in
    // order. A failure here leaves the album playing and is only logged.
    if (device_id[0] != '\0') {
        snprintf(
            url,
            sizeof(url),
            "https://api.spotify.com/v1/me/player/shuffle?state=false&device_id=%s",
            device_id);
    } else {
        strlcpy(url, "https://api.spotify.com/v1/me/player/shuffle?state=false", sizeof(url));
    }
    error = api_request(
        context, url, HTTP_METHOD_PUT, &status_code, retry_after_seconds, rate_limited);
    if (*rate_limited) {
        // The album already plays, so the request succeeded. The rate limit
        // still stops every request until the cooldown ends.
        start_rate_limit_cooldown(*retry_after_seconds);
        *rate_limited = false;
        ESP_LOGW(TAG, "Shuffle could not be turned off because of a rate limit");
    } else if (error != ESP_OK || status_code < 200 || status_code >= 300) {
        ESP_LOGW(TAG, "Shuffle could not be turned off (HTTP %d)", status_code);
    }
    ESP_LOGI(TAG, "Album started");
    return ESP_OK;
}

static TickType_t ticks_until(TickType_t deadline)
{
    TickType_t now = xTaskGetTickCount();
    return (int32_t)(deadline - now) > 0 ? deadline - now : 0;
}

static void start_rate_limit_cooldown(int64_t retry_after_seconds)
{
    int64_t seconds = retry_after_seconds > 0 ? retry_after_seconds : RATE_LIMIT_FALLBACK_SECONDS;
    int64_t now = esp_timer_get_time();
    int64_t duration = seconds * 1000000;
    int64_t deadline = duration > INT64_MAX - now ? INT64_MAX : now + duration;

    xSemaphoreTake(cooldown_mutex, portMAX_DELAY);
    rate_limit_deadline_us = deadline;
    xSemaphoreGive(cooldown_mutex);
}

static int64_t rate_limit_remaining_us(void)
{
    xSemaphoreTake(cooldown_mutex, portMAX_DELAY);
    int64_t remaining = rate_limit_deadline_us - esp_timer_get_time();
    xSemaphoreGive(cooldown_mutex);
    return remaining > 0 ? remaining : 0;
}

static void wait_for_rate_limit_expiry(void)
{
    for (;;) {
        int64_t remaining = rate_limit_remaining_us();
        if (remaining == 0) {
            return;
        }
        int64_t milliseconds = (remaining + 999) / 1000;
        if (milliseconds > RATE_LIMIT_WAIT_SLICE_MS) {
            milliseconds = RATE_LIMIT_WAIT_SLICE_MS;
        }
        TickType_t delay = pdMS_TO_TICKS((uint32_t)milliseconds);
        vTaskDelay(delay > 0 ? delay : 1);
    }
}

static client_context_t *create_client_context(bop_credentials_t *credentials)
{
    client_context_t *context = malloc(sizeof(*context));
    if (context == NULL) {
        return NULL;
    }
    mbedtls_platform_zeroize(context, sizeof(*context));
    context->credentials = credentials;
    context->response.data = malloc(PLAYBACK_RESPONSE_CAPACITY);
    context->response.capacity = PLAYBACK_RESPONSE_CAPACITY;
    context->artist_albums = heap_caps_calloc(
        1, sizeof(*context->artist_albums), MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
    if (context->response.data == NULL || context->artist_albums == NULL) {
        free(context->response.data);
        free(context->artist_albums);
        secure_free((char *)context, sizeof(*context));
        return NULL;
    }

    esp_http_client_config_t configuration = {
        .url = "https://api.spotify.com/v1/me/player",
        .event_handler = collect_response,
        .user_data = &context->response,
        .crt_bundle_attach = esp_crt_bundle_attach,
        .timeout_ms = 15000,
        // The 512-byte default reads a large library page in many small
        // pieces. 4 KB needs an eighth of the reads.
        .buffer_size = 4096,
        .keep_alive_enable = true,
        .keep_alive_idle = 5,
        .keep_alive_interval = 5,
        .keep_alive_count = 3,
    };
    context->api_client = esp_http_client_init(&configuration);
    if (context->api_client == NULL) {
        free(context->response.data);
        free(context->artist_albums);
        secure_free((char *)context, sizeof(*context));
        return NULL;
    }
    return context;
}

static void destroy_client_context(client_context_t *context)
{
    if (context == NULL) {
        return;
    }
    if (context->api_client != NULL) {
        esp_http_client_cleanup(context->api_client);
    }
    free(context->response.data);
    free(context->artist_albums);
    secure_free((char *)context, sizeof(*context));
}

static void client_task(void *argument)
{
    client_context_t *context = argument;
    TickType_t poll_deadline = xTaskGetTickCount();
    spotify_command_request_t pending_command = {0};
    bool command_pending = false;
    spotify_volume_request_t pending_volume = {0};
    bool volume_pending = false;
    // The album list loads at once on start, then every 15 minutes, and when
    // the UI asks, at most once a minute.
    TickType_t library_deadline = xTaskGetTickCount();
    TickType_t library_refreshed = xTaskGetTickCount() - pdMS_TO_TICKS(LIBRARY_REQUEST_MIN_INTERVAL_MS);
    publish_cached_library();

    for (;;) {
        wait_for_rate_limit_expiry();

        bop_wifi_wait_connected();
        if (!command_pending) {
            command_pending = xQueueReceive(command_queue, &pending_command, 0) == pdTRUE;
        }

        int64_t retry_after_seconds = 0;
        bool rate_limited = false;
        bool request_completed = false;
        if (command_pending) {
            bool was_playing = false;
            // A child waits for this answer, so the radio does not sleep
            // between beacons while it travels.
            bop_wifi_hold_awake(true);
            esp_err_t command_error = pending_command.command == SPOTIFY_COMMAND_PLAY_ALBUM
                ? send_play_album(context, &pending_command, &retry_after_seconds, &rate_limited)
                : send_command(
                    context,
                    pending_command.command,
                    &retry_after_seconds,
                    &rate_limited,
                    &was_playing);
            bop_wifi_hold_awake(false);
            command_pending = false;
            if (rate_limited) {
                start_rate_limit_cooldown(retry_after_seconds);
                publish_command_result(&pending_command, false, true, was_playing);
                continue;
            }
            request_completed = true;
            publish_command_result(&pending_command, command_error == ESP_OK, false, was_playing);
            if (command_error != ESP_OK) {
                ESP_LOGW(TAG, "Command was not applied; refreshing playback state");
            }
        }

        spotify_volume_request_t newest_volume = {0};
        if (xQueueReceive(volume_queue, &newest_volume, 0) == pdTRUE) {
            pending_volume = newest_volume;
            volume_pending = true;
        }
        if (volume_pending) {
            esp_err_t volume_error = send_volume(
                context,
                pending_volume.volume_percent,
                &retry_after_seconds,
                &rate_limited);
            if (rate_limited) {
                start_rate_limit_cooldown(retry_after_seconds);
                continue;
            }
            context->volume_command_generation = pending_volume.generation;
            volume_pending = false;
            request_completed = true;
            if (volume_error != ESP_OK) {
                ESP_LOGW(TAG, "Volume was not applied; refreshing playback state");
            }
        }

        TickType_t now = xTaskGetTickCount();
        bool library_asked = atomic_load(&library_refresh_requested)
            && now - library_refreshed >= pdMS_TO_TICKS(LIBRARY_REQUEST_MIN_INTERVAL_MS);
        if (library_asked || ticks_until(library_deadline) == 0) {
            atomic_store(&library_refresh_requested, false);
            library_refreshed = now;
            library_deadline = now + pdMS_TO_TICKS(LIBRARY_REFRESH_INTERVAL_MS);
            // A library read is the largest download Bop makes, so the radio
            // stays awake for it even on battery.
            bop_wifi_hold_awake(true);
            refresh_library(context, &retry_after_seconds, &rate_limited);
            bop_wifi_hold_awake(false);
            if (rate_limited) {
                start_rate_limit_cooldown(retry_after_seconds);
                continue;
            }
        }

        // An open artist loads page by page as the child swipes. Each page
        // goes back through the loop, so commands still go first.
        bool artist_more = load_artist_albums_step(context, &retry_after_seconds, &rate_limited);
        if (rate_limited) {
            start_rate_limit_cooldown(retry_after_seconds);
            continue;
        }
        if (artist_more) {
            continue;
        }

        if (!request_completed) {
            TickType_t wait = ticks_until(poll_deadline);
            if (wait > 0) {
                ulTaskNotifyTake(pdTRUE, wait);
                continue;
            }
        }

        bop_wifi_wait_connected();
        TickType_t poll_started = xTaskGetTickCount();
        poll_current_playback(context, &retry_after_seconds, &rate_limited);
        if (rate_limited) {
            start_rate_limit_cooldown(retry_after_seconds);
            continue;
        }
        playback_state_t state = {0};
        bop_spotify_get_state(&state);
        TickType_t interval = state.available && state.is_playing
            ? pdMS_TO_TICKS(PLAYING_POLL_INTERVAL_MS)
            : pdMS_TO_TICKS(IDLE_POLL_INTERVAL_MS);
        poll_deadline = poll_started + interval;
    }
}

/* The mutex and the queues are shared with the UI task and the screenshot
   task, and those tasks reach the accessors below before this function
   returns. A handle they can already hold must therefore never be deleted:
   their NULL check reads the handle once, and a delete that lands after that
   read leaves them sending on freed memory. So a handle is published only
   once every handle exists, and a published handle lives for the life of the
   firmware. The locals here are invisible to the other tasks until the last
   store, which is what makes deleting them on the failure path safe. */
static esp_err_t publish_shared_handles(void)
{
    if (command_queue != NULL) {
        return ESP_OK;
    }
    SemaphoreHandle_t mutex = xSemaphoreCreateMutex();
    SemaphoreHandle_t cooldown = xSemaphoreCreateMutex();
    QueueHandle_t commands = xQueueCreate(COMMAND_QUEUE_LENGTH, sizeof(spotify_command_request_t));
    QueueHandle_t results = xQueueCreate(COMMAND_QUEUE_LENGTH, sizeof(spotify_command_result_t));
    QueueHandle_t volumes = xQueueCreate(1, sizeof(spotify_volume_request_t));
    if (mutex == NULL
        || cooldown == NULL
        || commands == NULL
        || results == NULL
        || volumes == NULL) {
        if (mutex != NULL) {
            vSemaphoreDelete(mutex);
        }
        if (cooldown != NULL) {
            vSemaphoreDelete(cooldown);
        }
        if (commands != NULL) {
            vQueueDelete(commands);
        }
        if (results != NULL) {
            vQueueDelete(results);
        }
        if (volumes != NULL) {
            vQueueDelete(volumes);
        }
        return ESP_ERR_NO_MEM;
    }
    state_mutex = mutex;
    cooldown_mutex = cooldown;
    command_result_queue = results;
    volume_queue = volumes;
    command_queue = commands;
    return ESP_OK;
}

static void reset_playback_state(void)
{
    xSemaphoreTake(state_mutex, portMAX_DELAY);
    mbedtls_platform_zeroize(&current_state, sizeof(current_state));
    state_ready = false;
    xSemaphoreGive(state_mutex);
    /* The cooldown deadline belongs to cooldown_mutex, not to state_mutex.
       Nothing else holds it yet, but taking it here keeps every write to the
       field under the one lock that owns it. */
    xSemaphoreTake(cooldown_mutex, portMAX_DELAY);
    rate_limit_deadline_us = 0;
    xSemaphoreGive(cooldown_mutex);
}

esp_err_t bop_spotify_start(bop_credentials_t *credentials)
{
    if (credentials == NULL || atomic_load(&client_started)) {
        return ESP_ERR_INVALID_STATE;
    }
    if (published_library == NULL || published_artist_albums == NULL) {
        // Never freed: the UI reads them for the life of the firmware once the
        // started flag is true. They start out loading, with generation zero.
        if (published_library == NULL) {
            published_library = heap_caps_calloc(
                1, sizeof(*published_library), MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
        }
        if (published_artist_albums == NULL) {
            published_artist_albums = heap_caps_calloc(
                1, sizeof(*published_artist_albums), MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
        }
        if (published_library == NULL || published_artist_albums == NULL) {
            return ESP_ERR_NO_MEM;
        }
    }
    client_context_t *context = create_client_context(credentials);
    if (context == NULL) {
        return ESP_ERR_NO_MEM;
    }
    esp_err_t error = publish_shared_handles();
    if (error != ESP_OK) {
        destroy_client_context(context);
        return error;
    }
    reset_playback_state();
    if (xTaskCreatePinnedToCore(
            client_task,
            "spotify_client",
            16384,
            context,
            5,
            &client_task_handle,
            SPOTIFY_TASK_CORE)
        != pdPASS) {
        destroy_client_context(context);
        client_task_handle = NULL;
        return ESP_ERR_NO_MEM;
    }
    atomic_store(&client_started, true);
    return ESP_OK;
}

bool bop_spotify_get_state(playback_state_t *state)
{
    if (state == NULL || state_mutex == NULL) {
        return false;
    }
    xSemaphoreTake(state_mutex, portMAX_DELAY);
    *state = current_state;
    bool ready = state_ready;
    xSemaphoreGive(state_mutex);
    return ready;
}

bool bop_spotify_commands_ready(void)
{
    return atomic_load(&client_started);
}

/* Both enqueue functions share this one cooldown gate. The caller has already
   read a true client_started, so the queue and the mutex are published. */
static spotify_command_submission_t submit_command_request(
    const spotify_command_request_t *request)
{
    xSemaphoreTake(cooldown_mutex, portMAX_DELAY);
    spotify_command_submission_t submission = SPOTIFY_COMMAND_SUBMISSION_RATE_LIMITED;
    if (rate_limit_deadline_us - esp_timer_get_time() <= 0) {
        submission = xQueueSend(command_queue, request, 0) == pdTRUE
            ? SPOTIFY_COMMAND_SUBMISSION_QUEUED
            : SPOTIFY_COMMAND_SUBMISSION_QUEUE_FULL;
    }
    xSemaphoreGive(cooldown_mutex);
    if (submission == SPOTIFY_COMMAND_SUBMISSION_QUEUED) {
        xTaskNotifyGive(client_task_handle);
    }
    return submission;
}

/* A true read of client_started also makes the handle store above visible, so
   the queue this sends on and the cooldown mutex are published and permanent.
   Gating on the flag rather than on the handle keeps an accepted command one
   that a running task will drain: a start that failed after publication leaves
   the flag false. */
spotify_command_submission_t bop_spotify_enqueue_command(
    spotify_command_t command, uint32_t request_id)
{
    if (!atomic_load(&client_started)
        || (command != SPOTIFY_COMMAND_NEXT
            && command != SPOTIFY_COMMAND_PREVIOUS
            && command != SPOTIFY_COMMAND_TOGGLE)) {
        return SPOTIFY_COMMAND_SUBMISSION_NOT_READY;
    }
    spotify_command_request_t request = {
        .command = command,
        .request_id = request_id,
    };
    return submit_command_request(&request);
}

bool bop_spotify_enqueue_volume(uint8_t volume_percent)
{
    playback_state_t state = {0};
    if (!atomic_load(&client_started)
        || volume_percent > 100
        || !bop_spotify_get_state(&state)
        || !state.volume_available) {
        return false;
    }
    uint32_t generation = volume_request_generation + 1;
    if (generation == 0) {
        generation = 1;
    }
    spotify_volume_request_t request = {
        .volume_percent = volume_percent,
        .generation = generation,
    };
    if (xQueueOverwrite(volume_queue, &request) != pdPASS) {
        return false;
    }
    volume_request_generation = generation;
    xTaskNotifyGive(client_task_handle);
    return true;
}

uint32_t bop_spotify_get_volume_request_generation(void)
{
    return volume_request_generation;
}

bool bop_spotify_get_command_result(spotify_command_result_t *result)
{
    if (result == NULL || command_result_queue == NULL) {
        return false;
    }
    return xQueueReceive(command_result_queue, result, 0) == pdTRUE;
}

/* The same gate as bop_spotify_enqueue_command: the started flag here, then
   the shared cooldown gate. */
spotify_command_submission_t bop_spotify_enqueue_play_album(
    const char *album_id, uint32_t request_id)
{
    if (!atomic_load(&client_started) || !is_spotify_id(album_id, BOP_ALBUM_ID_CAPACITY)) {
        return SPOTIFY_COMMAND_SUBMISSION_NOT_READY;
    }
    spotify_command_request_t request = {
        .command = SPOTIFY_COMMAND_PLAY_ALBUM,
        .request_id = request_id,
    };
    strlcpy(request.album_id, album_id, sizeof(request.album_id));
    return submit_command_request(&request);
}

bool bop_spotify_get_library(bop_library_t *library)
{
    if (library == NULL || !atomic_load(&client_started)) {
        return false;
    }
    xSemaphoreTake(state_mutex, portMAX_DELAY);
    *library = *published_library;
    xSemaphoreGive(state_mutex);
    return library->generation != 0;
}

uint32_t bop_spotify_get_library_generation(void)
{
    if (!atomic_load(&client_started)) {
        return 0;
    }
    xSemaphoreTake(state_mutex, portMAX_DELAY);
    uint32_t generation = published_library->generation;
    xSemaphoreGive(state_mutex);
    return generation;
}

void bop_spotify_request_library_refresh(void)
{
    if (!atomic_load(&client_started)) {
        return;
    }
    atomic_store(&library_refresh_requested, true);
    xTaskNotifyGive(client_task_handle);
}

void bop_spotify_request_artist_albums(const char *artist_id, size_t wanted)
{
    if (!atomic_load(&client_started)) {
        return;
    }
    // Anything that is not a Spotify ID clears the request, so no other text
    // can reach the artist URL.
    const char *id = artist_id != NULL && is_spotify_id(artist_id, BOP_ALBUM_ID_CAPACITY)
        ? artist_id
        : "";
    xSemaphoreTake(state_mutex, portMAX_DELAY);
    bool same_artist = strcmp(requested_artist_id, id) == 0;
    bool changed = !same_artist || wanted > requested_artist_count;
    if (!same_artist) {
        strlcpy(requested_artist_id, id, sizeof(requested_artist_id));
        requested_artist_count = wanted;
    } else if (wanted > requested_artist_count) {
        requested_artist_count = wanted;
    }
    xSemaphoreGive(state_mutex);
    if (changed) {
        xTaskNotifyGive(client_task_handle);
    }
}

bool bop_spotify_get_artist_albums(bop_artist_albums_t *albums)
{
    if (albums == NULL || !atomic_load(&client_started)) {
        return false;
    }
    xSemaphoreTake(state_mutex, portMAX_DELAY);
    *albums = *published_artist_albums;
    xSemaphoreGive(state_mutex);
    return albums->generation != 0;
}

uint32_t bop_spotify_get_artist_albums_generation(void)
{
    if (!atomic_load(&client_started)) {
        return 0;
    }
    xSemaphoreTake(state_mutex, portMAX_DELAY);
    uint32_t generation = published_artist_albums->generation;
    xSemaphoreGive(state_mutex);
    return generation;
}

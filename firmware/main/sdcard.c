// SPDX-FileCopyrightText: 2026 SiENcE
// SPDX-License-Identifier: Apache-2.0

#include "sdcard.h"

#include <dirent.h>
#include <stdarg.h>
#include <stdatomic.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <sys/stat.h>
#include <time.h>
#include <unistd.h>

#include "bsp/esp32_s3_touch_amoled_1_8.h"
#include "esp_heap_caps.h"
#include "esp_log.h"
#include "esp_system.h"
#include "esp_timer.h"
#include "freertos/FreeRTOS.h"
#include "freertos/idf_additions.h"
#include "freertos/semphr.h"
#include "freertos/task.h"

// FatFs here has no long file names, so every name fits 8.3.
#define LOG_PATH BOP_SDCARD_DIRECTORY "/log.txt"
#define LOG_ARCHIVE_COUNT 9
#define LOG_FILE_LIMIT (4 * 1024 * 1024)
#define RING_SIZE (64 * 1024)
#define CHUNK_SIZE (16 * 1024)
#define LINE_CAPACITY 320
#define FLUSH_PERIOD_MS 2000
#define CAPTURE_WAIT_MS 20
#define TASK_STACK_SIZE 4096
#define TASK_PRIORITY 2
#define TASK_CORE 0
// Unix time of 2024-01-01. An earlier clock has not been synchronized yet.
#define CLOCK_VALID_AFTER 1704067200

static const char *TAG = "bop_sdcard";
// Without a card, the driver and the file system report every failed step as
// an error. Bop says it once instead.
static const char *const quiet_mount_tags[] = {
    "sdmmc_common",
    "sdmmc_init",
    "sdmmc_sd",
    "sdmmc_cmd",
    "sdmmc_req",
    "sdmmc_periph",
    "diskio_sdmmc",
    "vfs_fat",
    "vfs_fat_sdmmc",
    // The board package warns on every mount that long file names are off.
    // Bop names its files in 8.3 on purpose.
    "ESP32-S3-Touch-AMOLED-1.8",
};

// The log component starts with vprintf. Like screenshot.c, this initializer
// covers the moment between installing the hook and storing what it returns.
static vprintf_like_t console_vprintf = vprintf;
// The capture mutex guards the ring and the line buffer. The card mutex guards
// the file system and the mounted flag. No code holds both at once.
static SemaphoreHandle_t capture_mutex;
static SemaphoreHandle_t card_mutex;
static char *ring;
static size_t ring_head;
static size_t ring_used;
static char *line;
static atomic_bool capturing;
static atomic_uint dropped_lines;
static atomic_bool erase_requested;
static bool mounted;
static TaskHandle_t writer_task;
// Only the writer task uses these.
static FILE *log_file;
static size_t log_size;
static bool clock_written;

// The card keeps Bop's own lines and every warning and error. Informational
// lines of ESP-IDF stay on the serial port: the WiFi driver, for example,
// names the network it joins.
static bool line_is_kept(const char *text)
{
    // ESP-IDF formats a log line as "L (milliseconds) tag: message".
    if (text[0] == '\0' || text[1] != ' ' || text[2] != '(') {
        return false;
    }
    if (text[0] == 'E' || text[0] == 'W') {
        return true;
    }
    const char *tag = strstr(text, ") ");
    return tag != NULL && strncmp(tag + 2, "bop", 3) == 0;
}

// Runs in the task that logs, so it never waits for the card. It formats into
// PSRAM and copies the line into the ring; the writer task does the slow part.
static void capture_line(const char *format, va_list arguments)
{
    if (!atomic_load(&capturing)
        || xPortInIsrContext()
        || xTaskGetSchedulerState() != taskSCHEDULER_RUNNING) {
        return;
    }
    if (xSemaphoreTake(capture_mutex, pdMS_TO_TICKS(CAPTURE_WAIT_MS)) != pdTRUE) {
        atomic_fetch_add(&dropped_lines, 1);
        return;
    }
    // The writer can stop the capture while this task waited for the mutex.
    if (ring == NULL) {
        xSemaphoreGive(capture_mutex);
        return;
    }
    int length = vsnprintf(line, LINE_CAPACITY, format, arguments);
    if (length > 0 && line_is_kept(line)) {
        size_t size = (size_t)length;
        if (size >= LINE_CAPACITY) {
            // A cut line still ends with its own line break.
            size = LINE_CAPACITY - 1;
            line[size - 1] = '\n';
        }
        if (size <= RING_SIZE - ring_used) {
            size_t first = RING_SIZE - ring_head;
            if (first > size) {
                first = size;
            }
            memcpy(ring + ring_head, line, first);
            memcpy(ring, line + first, size - first);
            ring_head = (ring_head + size) % RING_SIZE;
            ring_used += size;
        } else {
            atomic_fetch_add(&dropped_lines, 1);
        }
    }
    xSemaphoreGive(capture_mutex);
}

static int log_vprintf(const char *format, va_list arguments)
{
    va_list copy;
    va_copy(copy, arguments);
    int written = console_vprintf(format, arguments);
    capture_line(format, copy);
    va_end(copy);
    return written;
}

static size_t take_lines(char *chunk, size_t capacity)
{
    xSemaphoreTake(capture_mutex, portMAX_DELAY);
    size_t size = ring_used < capacity ? ring_used : capacity;
    size_t tail = (ring_head + RING_SIZE - ring_used) % RING_SIZE;
    size_t first = RING_SIZE - tail;
    if (first > size) {
        first = size;
    }
    memcpy(chunk, ring + tail, first);
    memcpy(chunk + first, ring, size - first);
    ring_used -= size;
    xSemaphoreGive(capture_mutex);
    return size;
}

// The hook stays installed, because screenshot.c chains its own hook to it and
// removing this one would remove both. It only stops copying.
static void stop_capture(void)
{
    atomic_store(&capturing, false);
    xSemaphoreTake(capture_mutex, portMAX_DELAY);
    free(ring);
    ring = NULL;
    free(line);
    line = NULL;
    ring_used = 0;
    xSemaphoreGive(capture_mutex);
}

static const char *reset_reason_name(esp_reset_reason_t reason)
{
    switch (reason) {
    case ESP_RST_POWERON:
        return "power on";
    case ESP_RST_SW:
        return "restart";
    case ESP_RST_PANIC:
        return "crash";
    case ESP_RST_INT_WDT:
    case ESP_RST_TASK_WDT:
    case ESP_RST_WDT:
        return "watchdog";
    case ESP_RST_BROWNOUT:
        return "low voltage";
    case ESP_RST_USB:
        return "USB";
    case ESP_RST_DEEPSLEEP:
        return "deep sleep";
    default:
        return "other";
    }
}

static void log_path(int index, char *path, size_t capacity)
{
    if (index == 0) {
        strlcpy(path, LOG_PATH, capacity);
    } else {
        snprintf(path, capacity, BOP_SDCARD_DIRECTORY "/log%d.txt", index);
    }
}

// log.txt is always the newest file; log1.txt to log9.txt hold earlier ones.
static void rotate_logs(void)
{
    char from[48];
    char to[48];
    log_path(LOG_ARCHIVE_COUNT, to, sizeof(to));
    remove(to);
    for (int index = LOG_ARCHIVE_COUNT - 1; index >= 0; --index) {
        log_path(index, from, sizeof(from));
        log_path(index + 1, to, sizeof(to));
        // A file that does not exist yet fails to rename, which changes nothing.
        rename(from, to);
    }
}

static bool write_text(const char *text, size_t size)
{
    if (fwrite(text, 1, size, log_file) != size) {
        return false;
    }
    log_size += size;
    return true;
}

static bool open_log(const char *heading)
{
    log_file = fopen(LOG_PATH, "a");
    if (log_file == NULL) {
        return false;
    }
    // Unbuffered: a stdio buffer would come from internal RAM, and the writer
    // already hands over large PSRAM chunks.
    setvbuf(log_file, NULL, _IONBF, 0);
    log_size = 0;
    return write_text(heading, strlen(heading));
}

static bool mount_card(void)
{
    size_t quiet_count = sizeof(quiet_mount_tags) / sizeof(quiet_mount_tags[0]);
    esp_log_level_t levels[sizeof(quiet_mount_tags) / sizeof(quiet_mount_tags[0])];
    for (size_t index = 0; index < quiet_count; ++index) {
        levels[index] = esp_log_level_get(quiet_mount_tags[index]);
        esp_log_level_set(quiet_mount_tags[index], ESP_LOG_NONE);
    }
    // bsp_sdcard_mount never formats a card: CONFIG_BSP_SD_FORMAT_ON_MOUNT_FAIL
    // stays off, so a card with other data on it is never erased.
    esp_err_t error = bsp_sdcard_mount();
    for (size_t index = 0; index < quiet_count; ++index) {
        esp_log_level_set(quiet_mount_tags[index], levels[index]);
    }
    if (error == ESP_FAIL) {
        ESP_LOGW(TAG, "SD card has no FAT32 file system; the log stays on the serial port");
        return false;
    }
    if (error != ESP_OK) {
        ESP_LOGI(TAG, "No SD card; the log stays on the serial port");
        return false;
    }
    mkdir(BOP_SDCARD_DIRECTORY, 0775);
    rotate_logs();
    char heading[96];
    snprintf(
        heading,
        sizeof(heading),
        "\n=== Bop started (reset: %s) ===\n",
        reset_reason_name(esp_reset_reason()));
    if (!open_log(heading)) {
        ESP_LOGW(TAG, "SD card log could not be opened");
        bsp_sdcard_unmount();
        return false;
    }
    ESP_LOGI(TAG, "SD card log: " LOG_PATH);
    return true;
}

// Log lines carry milliseconds since start. One line ties them to the clock.
static bool write_clock_line(void)
{
    time_t now = time(NULL);
    if (clock_written || now < CLOCK_VALID_AFTER) {
        return true;
    }
    struct tm local;
    localtime_r(&now, &local);
    char stamp[40];
    strftime(stamp, sizeof(stamp), "%Y-%m-%d %H:%M:%S %Z", &local);
    char text[96];
    int length = snprintf(
        text,
        sizeof(text),
        "=== Clock: %s at %lld ms after start ===\n",
        stamp,
        (long long)(esp_timer_get_time() / 1000));
    clock_written = true;
    return write_text(text, (size_t)length);
}

static void erase_private_data(void)
{
    char path[48];
    for (int index = 1; index <= LOG_ARCHIVE_COUNT; ++index) {
        log_path(index, path, sizeof(path));
        remove(path);
    }
    unsigned removed = 0;
    DIR *directory = opendir(BOP_SDCARD_COVER_DIRECTORY);
    if (directory != NULL) {
        struct dirent *entry;
        char file[sizeof(BOP_SDCARD_COVER_DIRECTORY) + 1 + sizeof(entry->d_name)];
        while ((entry = readdir(directory)) != NULL) {
            snprintf(file, sizeof(file), BOP_SDCARD_COVER_DIRECTORY "/%s", entry->d_name);
            if (remove(file) == 0) {
                ++removed;
            }
        }
        closedir(directory);
    }
    ESP_LOGI(TAG, "SD card cleared: earlier logs and %u pictures", removed);
}

// Writes what the ring holds, then makes the file system record it, so a
// power cut loses at most the last two seconds of the log.
static bool write_pending(char *chunk)
{
    bool wrote = false;
    for (;;) {
        size_t size = take_lines(chunk, CHUNK_SIZE);
        if (size == 0) {
            break;
        }
        if (!write_text(chunk, size)) {
            return false;
        }
        wrote = true;
    }
    unsigned dropped = atomic_exchange(&dropped_lines, 0);
    if (dropped > 0) {
        char note[64];
        int length = snprintf(note, sizeof(note), "=== %u log lines lost ===\n", dropped);
        if (!write_text(note, (size_t)length)) {
            return false;
        }
        wrote = true;
    }
    bool clock_pending = !clock_written;
    if (!write_clock_line()) {
        return false;
    }
    wrote = wrote || clock_pending != clock_written;
    if (wrote && (fflush(log_file) != 0 || fsync(fileno(log_file)) != 0)) {
        return false;
    }
    if (log_size >= LOG_FILE_LIMIT) {
        fclose(log_file);
        log_file = NULL;
        rotate_logs();
        if (!open_log("=== Log continues ===\n")) {
            return false;
        }
    }
    return true;
}

static void sdcard_task(void *argument)
{
    char *chunk = argument;
    xSemaphoreTake(card_mutex, portMAX_DELAY);
    mounted = mount_card();
    xSemaphoreGive(card_mutex);
    if (!mounted) {
        stop_capture();
        free(chunk);
        vTaskDeleteWithCaps(NULL);
        return;
    }
    for (;;) {
        xSemaphoreTake(card_mutex, portMAX_DELAY);
        if (atomic_exchange(&erase_requested, false)) {
            erase_private_data();
        }
        bool written = write_pending(chunk);
        if (!written) {
            // The card was most likely pulled out. Bop goes on without it.
            if (log_file != NULL) {
                fclose(log_file);
                log_file = NULL;
            }
            bsp_sdcard_unmount();
            mounted = false;
        }
        xSemaphoreGive(card_mutex);
        if (!written) {
            stop_capture();
            ESP_LOGW(TAG, "SD card write failed; the card stays unused until a restart");
            free(chunk);
            vTaskDeleteWithCaps(NULL);
            return;
        }
        ulTaskNotifyTake(pdTRUE, pdMS_TO_TICKS(FLUSH_PERIOD_MS));
    }
}

esp_err_t bop_sdcard_start(void)
{
    if (capture_mutex != NULL) {
        return ESP_ERR_INVALID_STATE;
    }
    capture_mutex = xSemaphoreCreateMutex();
    card_mutex = xSemaphoreCreateMutex();
    ring = heap_caps_malloc(RING_SIZE, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
    line = heap_caps_malloc(LINE_CAPACITY, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
    char *chunk = heap_caps_malloc(CHUNK_SIZE, MALLOC_CAP_SPIRAM | MALLOC_CAP_8BIT);
    if (capture_mutex == NULL || card_mutex == NULL || ring == NULL || line == NULL
        || chunk == NULL) {
        free(ring);
        ring = NULL;
        free(line);
        line = NULL;
        free(chunk);
        // The mutexes stay: bop_sdcard_acquire reads card_mutex, and a second
        // start is refused by the check above either way.
        return ESP_ERR_NO_MEM;
    }
    atomic_store(&capturing, true);
    vprintf_like_t previous = esp_log_set_vprintf(log_vprintf);
    if (previous != NULL) {
        console_vprintf = previous;
    }
    // The stack lies in PSRAM to spare internal RAM. That is safe because this
    // task never writes flash: a flash write turns off the cache that PSRAM
    // access goes through.
    if (xTaskCreatePinnedToCoreWithCaps(
            sdcard_task,
            "bop_sdcard",
            TASK_STACK_SIZE,
            chunk,
            TASK_PRIORITY,
            &writer_task,
            TASK_CORE,
            MALLOC_CAP_SPIRAM)
        != pdPASS) {
        stop_capture();
        free(chunk);
        return ESP_ERR_NO_MEM;
    }
    return ESP_OK;
}

void bop_sdcard_erase_private_data(void)
{
    atomic_store(&erase_requested, true);
    // The writer clears the mounted flag under this mutex before it ends, so
    // a notification never reaches a deleted task. Before the mount finishes,
    // the flag waits and the first write cycle sees it.
    if (card_mutex == NULL) {
        return;
    }
    xSemaphoreTake(card_mutex, portMAX_DELAY);
    if (mounted) {
        xTaskNotifyGive(writer_task);
    }
    xSemaphoreGive(card_mutex);
}

bool bop_sdcard_acquire(void)
{
    if (card_mutex == NULL) {
        return false;
    }
    xSemaphoreTake(card_mutex, portMAX_DELAY);
    if (!mounted) {
        xSemaphoreGive(card_mutex);
        return false;
    }
    return true;
}

void bop_sdcard_release(void)
{
    xSemaphoreGive(card_mutex);
}

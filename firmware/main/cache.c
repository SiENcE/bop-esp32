// SPDX-FileCopyrightText: 2026 SiENcE
// SPDX-License-Identifier: Apache-2.0

#include "cache.h"

#include <string.h>

#include "esp_log.h"
#include "esp_partition.h"
#include "esp_rom_crc.h"
#include "freertos/FreeRTOS.h"
#include "freertos/semphr.h"

#define CACHE_PARTITION_LABEL "cache"
#define SECTOR_SIZE 4096
// The library list lies in the first sectors, the pictures in fixed slots
// after it. A slot holds one 172-pixel RGB565 picture, 59,168 bytes, and its
// header, in 15 sectors.
#define LIBRARY_REGION_SIZE (8 * SECTOR_SIZE)
#define HEADER_SIZE 64
#define COVER_SLOT_SIZE (15 * SECTOR_SIZE)
#define COVER_SLOT_CAPACITY 80
#define LIBRARY_MAGIC 0x314C5042u
#define COVER_MAGIC 0x31435042u
// A new layout of the stored structures needs a new version, so an older
// cache reads as empty instead of as garbage.
#define CACHE_VERSION 1

typedef struct {
    uint32_t magic;
    uint32_t version;
    uint32_t entry_size;
    uint32_t count;
    uint32_t checksum;
} library_header_t;

typedef struct {
    uint32_t magic;
    uint32_t version;
    uint32_t sequence;
    uint32_t length;
    uint32_t checksum;
    char id[BOP_ALBUM_ID_CAPACITY];
} cover_header_t;

_Static_assert(sizeof(library_header_t) <= HEADER_SIZE, "library header outgrew its space");
_Static_assert(sizeof(cover_header_t) <= HEADER_SIZE, "cover header outgrew its space");
_Static_assert(
    HEADER_SIZE + BOP_LIBRARY_CAPACITY * sizeof(bop_library_entry_t) <= LIBRARY_REGION_SIZE,
    "library list outgrew its region");

typedef struct {
    bool used;
    uint32_t sequence;
    uint32_t length;
    uint32_t checksum;
    char id[BOP_ALBUM_ID_CAPACITY];
} cover_slot_t;

static const char *TAG = "bop_cache";
static const esp_partition_t *partition;
static SemaphoreHandle_t cache_mutex;
static cover_slot_t slots[COVER_SLOT_CAPACITY];
static size_t slot_count;
static uint32_t newest_sequence;
static bool library_stored;
static uint32_t library_checksum;

static size_t slot_offset(size_t slot)
{
    return LIBRARY_REGION_SIZE + slot * COVER_SLOT_SIZE;
}

static bool header_id_is_valid(const char *id)
{
    size_t length = strnlen(id, BOP_ALBUM_ID_CAPACITY);
    return length > 0 && length < BOP_ALBUM_ID_CAPACITY;
}

esp_err_t bop_cache_init(void)
{
    if (partition != NULL) {
        return ESP_OK;
    }
    const esp_partition_t *found = esp_partition_find_first(
        ESP_PARTITION_TYPE_DATA, ESP_PARTITION_SUBTYPE_ANY, CACHE_PARTITION_LABEL);
    if (found == NULL || found->size < LIBRARY_REGION_SIZE + COVER_SLOT_SIZE) {
        ESP_LOGW(TAG, "No cache partition; the library loads from the network only");
        return ESP_ERR_NOT_FOUND;
    }
    cache_mutex = xSemaphoreCreateMutex();
    if (cache_mutex == NULL) {
        return ESP_ERR_NO_MEM;
    }

    slot_count = (found->size - LIBRARY_REGION_SIZE) / COVER_SLOT_SIZE;
    if (slot_count > COVER_SLOT_CAPACITY) {
        slot_count = COVER_SLOT_CAPACITY;
    }
    size_t cached = 0;
    for (size_t slot = 0; slot < slot_count; ++slot) {
        cover_header_t header;
        if (esp_partition_read(found, slot_offset(slot), &header, sizeof(header)) != ESP_OK
            || header.magic != COVER_MAGIC
            || header.version != CACHE_VERSION
            || !header_id_is_valid(header.id)) {
            continue;
        }
        slots[slot].used = true;
        slots[slot].sequence = header.sequence;
        slots[slot].length = header.length;
        slots[slot].checksum = header.checksum;
        strlcpy(slots[slot].id, header.id, sizeof(slots[slot].id));
        if (header.sequence > newest_sequence) {
            newest_sequence = header.sequence;
        }
        ++cached;
    }

    library_header_t library;
    if (esp_partition_read(found, 0, &library, sizeof(library)) == ESP_OK
        && library.magic == LIBRARY_MAGIC
        && library.version == CACHE_VERSION) {
        library_stored = true;
        library_checksum = library.checksum;
    }
    partition = found;
    ESP_LOGI(TAG, "Cache holds %u of %u pictures", (unsigned)cached, (unsigned)slot_count);
    return ESP_OK;
}

void bop_cache_clear(void)
{
    if (partition == NULL) {
        return;
    }
    xSemaphoreTake(cache_mutex, portMAX_DELAY);
    // Erasing the first sector of the list and of each used slot removes its
    // header, and with it the whole entry.
    esp_partition_erase_range(partition, 0, SECTOR_SIZE);
    library_stored = false;
    size_t cleared = 0;
    for (size_t slot = 0; slot < slot_count; ++slot) {
        if (slots[slot].used) {
            esp_partition_erase_range(partition, slot_offset(slot), SECTOR_SIZE);
            slots[slot].used = false;
            ++cleared;
        }
    }
    newest_sequence = 0;
    xSemaphoreGive(cache_mutex);
    ESP_LOGI(TAG, "Cache cleared (%u pictures)", (unsigned)cleared);
}

bool bop_cache_load_library(bop_library_t *library)
{
    if (partition == NULL || library == NULL) {
        return false;
    }
    xSemaphoreTake(cache_mutex, portMAX_DELAY);
    library_header_t header;
    bool loaded = esp_partition_read(partition, 0, &header, sizeof(header)) == ESP_OK
        && header.magic == LIBRARY_MAGIC
        && header.version == CACHE_VERSION
        && header.entry_size == sizeof(bop_library_entry_t)
        && header.count <= BOP_LIBRARY_CAPACITY;
    size_t length = loaded ? header.count * sizeof(bop_library_entry_t) : 0;
    if (loaded && length > 0) {
        loaded = esp_partition_read(partition, HEADER_SIZE, library->entries, length) == ESP_OK
            && esp_rom_crc32_le(0, (const uint8_t *)library->entries, length) == header.checksum;
    }
    xSemaphoreGive(cache_mutex);
    if (!loaded) {
        library->count = 0;
        return false;
    }
    library->count = header.count;
    for (size_t index = 0; index < library->count; ++index) {
        // A stored string ends inside its field, whatever the flash held.
        library->entries[index].id[sizeof(library->entries[index].id) - 1] = '\0';
        library->entries[index].cover_url[sizeof(library->entries[index].cover_url) - 1] = '\0';
    }
    return true;
}

void bop_cache_store_library(const bop_library_t *library)
{
    if (partition == NULL || library == NULL || library->count > BOP_LIBRARY_CAPACITY) {
        return;
    }
    size_t length = library->count * sizeof(bop_library_entry_t);
    uint32_t checksum = esp_rom_crc32_le(0, (const uint8_t *)library->entries, length);
    xSemaphoreTake(cache_mutex, portMAX_DELAY);
    if (library_stored && checksum == library_checksum) {
        // The 15-minute refresh usually finds the same library. Flash wears
        // with every erase, so an unchanged list is not written again.
        xSemaphoreGive(cache_mutex);
        return;
    }
    library_header_t header = {
        .magic = LIBRARY_MAGIC,
        .version = CACHE_VERSION,
        .entry_size = sizeof(bop_library_entry_t),
        .count = (uint32_t)library->count,
        .checksum = checksum,
    };
    size_t erase_size = (HEADER_SIZE + length + SECTOR_SIZE - 1) / SECTOR_SIZE * SECTOR_SIZE;
    // The entries go first and the header last, so an interrupted write
    // leaves no header and therefore no half-written list.
    esp_err_t error = esp_partition_erase_range(partition, 0, erase_size);
    if (error == ESP_OK && length > 0) {
        error = esp_partition_write(partition, HEADER_SIZE, library->entries, length);
    }
    if (error == ESP_OK) {
        error = esp_partition_write(partition, 0, &header, sizeof(header));
    }
    library_stored = error == ESP_OK;
    library_checksum = checksum;
    xSemaphoreGive(cache_mutex);
    if (error != ESP_OK) {
        ESP_LOGW(TAG, "Library list was not stored: %s", esp_err_to_name(error));
    }
}

static int find_slot(const char *id)
{
    for (size_t slot = 0; slot < slot_count; ++slot) {
        if (slots[slot].used && strcmp(slots[slot].id, id) == 0) {
            return (int)slot;
        }
    }
    return -1;
}

bool bop_cache_load_cover(const char *id, uint8_t *pixels, size_t size)
{
    if (partition == NULL || id == NULL || pixels == NULL) {
        return false;
    }
    xSemaphoreTake(cache_mutex, portMAX_DELAY);
    int slot = find_slot(id);
    bool loaded = slot >= 0
        && slots[slot].length == size
        && esp_partition_read(partition, slot_offset(slot) + HEADER_SIZE, pixels, size) == ESP_OK
        && esp_rom_crc32_le(0, pixels, size) == slots[slot].checksum;
    if (slot >= 0 && !loaded) {
        // A damaged or outdated picture is dropped and downloads again.
        slots[slot].used = false;
    }
    xSemaphoreGive(cache_mutex);
    return loaded;
}

void bop_cache_store_cover(const char *id, const uint8_t *pixels, size_t size)
{
    if (partition == NULL || id == NULL || pixels == NULL || !header_id_is_valid(id)
        || HEADER_SIZE + size > COVER_SLOT_SIZE) {
        return;
    }
    xSemaphoreTake(cache_mutex, portMAX_DELAY);
    if (find_slot(id) >= 0) {
        xSemaphoreGive(cache_mutex);
        return;
    }
    // A free slot first. With every slot used, the oldest picture goes.
    size_t target = 0;
    for (size_t slot = 0; slot < slot_count; ++slot) {
        if (!slots[slot].used) {
            target = slot;
            break;
        }
        if (slots[slot].sequence < slots[target].sequence) {
            target = slot;
        }
    }
    cover_header_t header = {
        .magic = COVER_MAGIC,
        .version = CACHE_VERSION,
        .sequence = ++newest_sequence,
        .length = (uint32_t)size,
        .checksum = esp_rom_crc32_le(0, pixels, size),
    };
    strlcpy(header.id, id, sizeof(header.id));
    slots[target].used = false;
    // The pixels go first and the header last, so an interrupted write leaves
    // an empty slot instead of a damaged picture.
    esp_err_t error = esp_partition_erase_range(partition, slot_offset(target), COVER_SLOT_SIZE);
    if (error == ESP_OK) {
        error = esp_partition_write(partition, slot_offset(target) + HEADER_SIZE, pixels, size);
    }
    if (error == ESP_OK) {
        error = esp_partition_write(partition, slot_offset(target), &header, sizeof(header));
    }
    if (error == ESP_OK) {
        slots[target].used = true;
        slots[target].sequence = header.sequence;
        slots[target].length = header.length;
        slots[target].checksum = header.checksum;
        strlcpy(slots[target].id, id, sizeof(slots[target].id));
    }
    xSemaphoreGive(cache_mutex);
    if (error != ESP_OK) {
        ESP_LOGW(TAG, "Picture was not stored: %s", esp_err_to_name(error));
    }
}

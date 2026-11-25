// SPDX-FileCopyrightText: 2026 SiENcE
// SPDX-License-Identifier: Apache-2.0

#include "cache.h"

#include <dirent.h>
#include <inttypes.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>
#include <time.h>

#include "esp_heap_caps.h"
#include "esp_log.h"
#include "esp_partition.h"
#include "esp_rom_crc.h"
#include "freertos/FreeRTOS.h"
#include "freertos/semphr.h"
#include "sdcard.h"

#define CACHE_PARTITION_LABEL "cache"
#define SECTOR_SIZE 4096
// The library list lies in the first sectors. The album lists of the followed
// artists follow in fixed slots, one per artist, then the pictures. A picture
// slot holds one 172-pixel RGB565 picture, 59,168 bytes, and its header, in
// 15 sectors. The pictures take whatever the partition has left.
#define LIBRARY_REGION_SIZE (8 * SECTOR_SIZE)
#define HEADER_SIZE 64
#define ARTIST_SLOT_COUNT BOP_LIBRARY_ARTIST_CAPACITY
#define ARTIST_SLOT_SIZE (10 * SECTOR_SIZE)
#define ARTIST_REGION_OFFSET LIBRARY_REGION_SIZE
#define COVER_REGION_OFFSET (ARTIST_REGION_OFFSET + ARTIST_SLOT_COUNT * ARTIST_SLOT_SIZE)
#define COVER_SLOT_SIZE (15 * SECTOR_SIZE)
#define LIBRARY_MAGIC 0x314C5042u
#define ARTIST_MAGIC 0x31415042u
#define COVER_MAGIC 0x31435042u
// A new layout of the stored structures needs a new version, so an older
// cache reads as empty instead of as garbage. Version 2 added the artist lists
// in front of the pictures.
#define CACHE_VERSION 2
// The SD card takes pictures only once every flash slot is used, and stops at
// this count, about 118 MB. After that the oldest flash picture goes again.
#define SD_COVER_CAPACITY 2000

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
    uint32_t entry_size;
    uint32_t count;
    uint32_t checksum;
    // Unix time of the write.
    uint32_t stored_at;
    char id[BOP_ALBUM_ID_CAPACITY];
} artist_header_t;

typedef struct {
    uint32_t magic;
    uint32_t version;
    uint32_t sequence;
    uint32_t length;
    uint32_t checksum;
    char id[BOP_ALBUM_ID_CAPACITY];
} cover_header_t;

_Static_assert(sizeof(library_header_t) <= HEADER_SIZE, "library header outgrew its space");
_Static_assert(sizeof(artist_header_t) <= HEADER_SIZE, "artist header outgrew its space");
_Static_assert(sizeof(cover_header_t) <= HEADER_SIZE, "cover header outgrew its space");
_Static_assert(
    HEADER_SIZE + BOP_LIBRARY_CAPACITY * sizeof(bop_library_entry_t) <= LIBRARY_REGION_SIZE,
    "library list outgrew its region");
_Static_assert(
    HEADER_SIZE + BOP_ARTIST_ALBUM_CAPACITY * sizeof(bop_library_entry_t) <= ARTIST_SLOT_SIZE,
    "artist list outgrew its slot");

typedef struct {
    bool used;
    uint32_t count;
    uint32_t checksum;
    uint32_t stored_at;
    // Unix time of the last check against Spotify in this run. A check that
    // finds the same list writes no flash, so only this run remembers it.
    uint32_t checked_at;
    char id[BOP_ALBUM_ID_CAPACITY];
} artist_slot_t;

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
// Both indexes lie in PSRAM. Internal RAM is kept for WiFi and TLS.
static artist_slot_t *artists;
static cover_slot_t *slots;
static size_t slot_count;
static uint32_t newest_sequence;
static bool library_stored;
static uint32_t library_checksum;
// Counted on the first use of the card in a run. Only the art task stores
// pictures, so the count needs no lock of its own. bop_sdcard_erase_private_data
// runs only on a start without credentials, when no picture is stored.
static int sd_cover_count = -1;

static size_t slot_offset(size_t slot)
{
    return COVER_REGION_OFFSET + slot * COVER_SLOT_SIZE;
}

static size_t artist_offset(size_t slot)
{
    return ARTIST_REGION_OFFSET + slot * ARTIST_SLOT_SIZE;
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
    if (found == NULL || found->size < COVER_REGION_OFFSET + COVER_SLOT_SIZE) {
        ESP_LOGW(TAG, "No cache partition; the library loads from the network only");
        return ESP_ERR_NOT_FOUND;
    }
    slot_count = (found->size - COVER_REGION_OFFSET) / COVER_SLOT_SIZE;
    cache_mutex = xSemaphoreCreateMutex();
    artists = heap_caps_calloc(ARTIST_SLOT_COUNT, sizeof(*artists), MALLOC_CAP_SPIRAM);
    slots = heap_caps_calloc(slot_count, sizeof(*slots), MALLOC_CAP_SPIRAM);
    if (cache_mutex == NULL || artists == NULL || slots == NULL) {
        if (cache_mutex != NULL) {
            vSemaphoreDelete(cache_mutex);
            cache_mutex = NULL;
        }
        free(artists);
        artists = NULL;
        free(slots);
        slots = NULL;
        return ESP_ERR_NO_MEM;
    }

    size_t artist_lists = 0;
    for (size_t slot = 0; slot < ARTIST_SLOT_COUNT; ++slot) {
        artist_header_t header;
        if (esp_partition_read(found, artist_offset(slot), &header, sizeof(header)) != ESP_OK
            || header.magic != ARTIST_MAGIC
            || header.version != CACHE_VERSION
            || header.entry_size != sizeof(bop_library_entry_t)
            || header.count > BOP_ARTIST_ALBUM_CAPACITY
            || !header_id_is_valid(header.id)) {
            continue;
        }
        artists[slot].used = true;
        artists[slot].count = header.count;
        artists[slot].checksum = header.checksum;
        artists[slot].stored_at = header.stored_at;
        strlcpy(artists[slot].id, header.id, sizeof(artists[slot].id));
        ++artist_lists;
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
    ESP_LOGI(
        TAG,
        "Cache holds %u of %u pictures and %u artist lists",
        (unsigned)cached,
        (unsigned)slot_count,
        (unsigned)artist_lists);
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
    for (size_t slot = 0; slot < ARTIST_SLOT_COUNT; ++slot) {
        if (artists[slot].used) {
            esp_partition_erase_range(partition, artist_offset(slot), SECTOR_SIZE);
            artists[slot].used = false;
        }
    }
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
    ESP_LOGI(TAG, "Cache cleared (%u pictures and the artist lists)", (unsigned)cleared);
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
        // A refresh usually finds the same library. Flash wears
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

static int find_artist(const char *id)
{
    for (size_t slot = 0; slot < ARTIST_SLOT_COUNT; ++slot) {
        if (artists[slot].used && strcmp(artists[slot].id, id) == 0) {
            return (int)slot;
        }
    }
    return -1;
}

bool bop_cache_load_artist(const char *artist_id, bop_artist_albums_t *albums)
{
    if (partition == NULL || artist_id == NULL || albums == NULL
        || !header_id_is_valid(artist_id)) {
        return false;
    }
    xSemaphoreTake(cache_mutex, portMAX_DELAY);
    int slot = find_artist(artist_id);
    size_t count = slot >= 0 ? artists[slot].count : 0;
    size_t length = count * sizeof(bop_library_entry_t);
    bool loaded = slot >= 0
        && (length == 0
            || (esp_partition_read(
                    partition, artist_offset(slot) + HEADER_SIZE, albums->entries, length)
                    == ESP_OK
                && esp_rom_crc32_le(0, (const uint8_t *)albums->entries, length)
                    == artists[slot].checksum));
    if (slot >= 0 && !loaded) {
        // A damaged list is dropped and loads from Spotify again.
        artists[slot].used = false;
    }
    xSemaphoreGive(cache_mutex);
    if (!loaded) {
        return false;
    }
    strlcpy(albums->artist_id, artist_id, sizeof(albums->artist_id));
    albums->status = BOP_LIBRARY_READY;
    albums->complete = true;
    albums->count = count;
    for (size_t index = 0; index < count; ++index) {
        // A stored string ends inside its field, whatever the flash held.
        albums->entries[index].id[sizeof(albums->entries[index].id) - 1] = '\0';
        albums->entries[index].cover_url[sizeof(albums->entries[index].cover_url) - 1] = '\0';
    }
    return true;
}

void bop_cache_store_artist(const bop_artist_albums_t *albums)
{
    if (partition == NULL || albums == NULL || !header_id_is_valid(albums->artist_id)
        || albums->count > BOP_ARTIST_ALBUM_CAPACITY) {
        return;
    }
    uint32_t now = (uint32_t)time(NULL);
    size_t length = albums->count * sizeof(bop_library_entry_t);
    uint32_t checksum = esp_rom_crc32_le(0, (const uint8_t *)albums->entries, length);
    xSemaphoreTake(cache_mutex, portMAX_DELAY);
    int found = find_artist(albums->artist_id);
    if (found >= 0
        && artists[found].count == albums->count
        && artists[found].checksum == checksum) {
        // Artists rarely add albums. An unchanged list writes no flash, which
        // wears with every erase and pauses both cores while it runs.
        artists[found].checked_at = now;
        xSemaphoreGive(cache_mutex);
        return;
    }
    // The artist's own slot, else a free one, else the list seen longest ago:
    // most likely an artist the account no longer follows.
    size_t target = 0;
    if (found >= 0) {
        target = (size_t)found;
    } else {
        uint32_t oldest = UINT32_MAX;
        for (size_t slot = 0; slot < ARTIST_SLOT_COUNT; ++slot) {
            if (!artists[slot].used) {
                target = slot;
                break;
            }
            uint32_t seen = artists[slot].checked_at > artists[slot].stored_at
                ? artists[slot].checked_at
                : artists[slot].stored_at;
            if (seen < oldest) {
                oldest = seen;
                target = slot;
            }
        }
    }
    artist_header_t header = {
        .magic = ARTIST_MAGIC,
        .version = CACHE_VERSION,
        .entry_size = sizeof(bop_library_entry_t),
        .count = (uint32_t)albums->count,
        .checksum = checksum,
        .stored_at = now,
    };
    strlcpy(header.id, albums->artist_id, sizeof(header.id));
    artists[target].used = false;
    size_t erase_size = (HEADER_SIZE + length + SECTOR_SIZE - 1) / SECTOR_SIZE * SECTOR_SIZE;
    // The entries go first and the header last, so an interrupted write
    // leaves no header and therefore no half-written list.
    esp_err_t error = esp_partition_erase_range(partition, artist_offset(target), erase_size);
    if (error == ESP_OK && length > 0) {
        error = esp_partition_write(
            partition, artist_offset(target) + HEADER_SIZE, albums->entries, length);
    }
    if (error == ESP_OK) {
        error = esp_partition_write(partition, artist_offset(target), &header, sizeof(header));
    }
    if (error == ESP_OK) {
        artists[target].used = true;
        artists[target].count = header.count;
        artists[target].checksum = checksum;
        artists[target].stored_at = now;
        artists[target].checked_at = now;
        strlcpy(artists[target].id, header.id, sizeof(artists[target].id));
    }
    xSemaphoreGive(cache_mutex);
    if (error != ESP_OK) {
        ESP_LOGW(TAG, "Artist list was not stored: %s", esp_err_to_name(error));
    }
}

uint32_t bop_cache_artist_age(const char *artist_id)
{
    if (partition == NULL || artist_id == NULL) {
        return UINT32_MAX;
    }
    xSemaphoreTake(cache_mutex, portMAX_DELAY);
    int slot = find_artist(artist_id);
    uint32_t seen = 0;
    if (slot >= 0) {
        seen = artists[slot].checked_at > artists[slot].stored_at
            ? artists[slot].checked_at
            : artists[slot].stored_at;
    }
    xSemaphoreGive(cache_mutex);
    if (slot < 0) {
        return UINT32_MAX;
    }
    uint32_t now = (uint32_t)time(NULL);
    return now > seen ? now - seen : 0;
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

// FAT names here are 8.3 and ignore case, while Spotify IDs are 22 characters
// and case-sensitive. A file is therefore named by a checksum of the ID, and
// its header holds the ID, so a rare checksum collision reads as a miss.
static void sd_cover_path(const char *id, char *path, size_t capacity)
{
    uint32_t hash = esp_rom_crc32_le(0, (const uint8_t *)id, strlen(id));
    snprintf(path, capacity, BOP_SDCARD_COVER_DIRECTORY "/%08" PRIX32 ".bin", hash);
}

static bool load_sd_cover(const char *id, uint8_t *pixels, size_t size)
{
    if (!bop_sdcard_acquire()) {
        return false;
    }
    char path[48];
    sd_cover_path(id, path, sizeof(path));
    bool loaded = false;
    FILE *file = fopen(path, "rb");
    if (file != NULL) {
        // Unbuffered: a stdio buffer would come from internal RAM.
        setvbuf(file, NULL, _IONBF, 0);
        cover_header_t header;
        loaded = fread(&header, 1, sizeof(header), file) == sizeof(header)
            && header.magic == COVER_MAGIC
            && header.version == CACHE_VERSION
            && header.length == size
            && header_id_is_valid(header.id)
            && strcmp(header.id, id) == 0
            && fread(pixels, 1, size, file) == size
            && esp_rom_crc32_le(0, pixels, size) == header.checksum;
        fclose(file);
    }
    bop_sdcard_release();
    return loaded;
}

static int count_sd_covers(void)
{
    int count = 0;
    DIR *directory = opendir(BOP_SDCARD_COVER_DIRECTORY);
    if (directory != NULL) {
        while (readdir(directory) != NULL) {
            ++count;
        }
        closedir(directory);
    }
    return count;
}

// A new picture goes to a temporary file first and takes its name only when
// complete, so a power cut leaves no half-written picture under a real name.
static bool store_sd_cover(const char *id, const uint8_t *pixels, size_t size)
{
    if (!bop_sdcard_acquire()) {
        return false;
    }
    if (sd_cover_count < 0) {
        mkdir(BOP_SDCARD_COVER_DIRECTORY, 0775);
        sd_cover_count = count_sd_covers();
    }
    bool stored = false;
    if (sd_cover_count < SD_COVER_CAPACITY) {
        cover_header_t header = {
            .magic = COVER_MAGIC,
            .version = CACHE_VERSION,
            .length = (uint32_t)size,
            .checksum = esp_rom_crc32_le(0, pixels, size),
        };
        strlcpy(header.id, id, sizeof(header.id));
        static const char temporary_path[] = BOP_SDCARD_COVER_DIRECTORY "/new.tmp";
        FILE *file = fopen(temporary_path, "wb");
        if (file != NULL) {
            setvbuf(file, NULL, _IONBF, 0);
            stored = fwrite(&header, 1, sizeof(header), file) == sizeof(header)
                && fwrite(pixels, 1, size, file) == size;
            stored = fclose(file) == 0 && stored;
        }
        char path[48];
        sd_cover_path(id, path, sizeof(path));
        if (stored) {
            // FAT refuses to rename onto an existing name. A file there holds
            // another ID with the same checksum, or a damaged picture.
            bool replaced = remove(path) == 0;
            stored = rename(temporary_path, path) == 0;
            if (stored && !replaced) {
                ++sd_cover_count;
            }
        }
        if (!stored) {
            remove(temporary_path);
        }
    }
    int count = sd_cover_count;
    bop_sdcard_release();
    if (stored) {
        ESP_LOGI(TAG, "Flash cache full; picture stored on the SD card (%d there)", count);
    }
    return stored;
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
    return loaded || (slot < 0 && load_sd_cover(id, pixels, size));
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
    // A free slot first. With every slot used, the picture goes to the SD
    // card, so the flash keeps the pictures it already holds. Without a card,
    // or with a full one, the oldest flash picture goes.
    size_t target = 0;
    bool free_slot = false;
    for (size_t slot = 0; slot < slot_count; ++slot) {
        if (!slots[slot].used) {
            target = slot;
            free_slot = true;
            break;
        }
        if (slots[slot].sequence < slots[target].sequence) {
            target = slot;
        }
    }
    if (!free_slot) {
        // The card is slow, and the flash index does not depend on it.
        xSemaphoreGive(cache_mutex);
        if (store_sd_cover(id, pixels, size)) {
            return;
        }
        xSemaphoreTake(cache_mutex, portMAX_DELAY);
        if (find_slot(id) >= 0) {
            xSemaphoreGive(cache_mutex);
            return;
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

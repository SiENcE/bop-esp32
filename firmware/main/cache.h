// SPDX-FileCopyrightText: 2026 SiENcE
// SPDX-License-Identifier: Apache-2.0

#pragma once

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

#include "esp_err.h"
#include "spotify/spotify.h"

// A flash cache for the kid-mode library list, the album lists of the followed
// artists, and the decoded grid pictures, in the "cache" partition. After a
// restart the grid and every cached artist show at once, also without WiFi,
// and the network only refreshes them. The cache holds library IDs and pictures, never a
// credential, and Bop erases it whenever it starts without full credentials.
// Once every flash slot holds a picture, further pictures go to the SD card
// when one is mounted (sdcard.h), and the flash keeps the ones it has.

// Finds the partition and reads the picture index. Without the partition, for
// example on a board flashed with an older partition table, every other call
// does nothing and the cache stays empty.
esp_err_t bop_cache_init(void);
// Removes every stored list and picture.
void bop_cache_clear(void);

bool bop_cache_load_library(bop_library_t *library);
// Writes only when the list differs from the stored one.
void bop_cache_store_library(const bop_library_t *library);

// The album list of one followed artist, stored whole. A load fills a
// complete, ready list. A store writes flash only when the list changed; either
// way the list counts as checked now.
bool bop_cache_load_artist(const char *artist_id, bop_artist_albums_t *albums);
void bop_cache_store_artist(const bop_artist_albums_t *albums);
// Seconds since the artist's list was last stored or checked, or UINT32_MAX
// when none is stored.
uint32_t bop_cache_artist_age(const char *artist_id);

// Picture pixels are stored exactly as drawn, so a load is one flash read.
bool bop_cache_load_cover(const char *id, uint8_t *pixels, size_t size);
void bop_cache_store_cover(const char *id, const uint8_t *pixels, size_t size);

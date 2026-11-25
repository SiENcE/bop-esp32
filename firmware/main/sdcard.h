// SPDX-FileCopyrightText: 2026 SiENcE
// SPDX-License-Identifier: Apache-2.0

#pragma once

#include <stdbool.h>

#include "esp_err.h"

// The optional microSD card holds the log and the pictures that no longer fit
// the flash cache. Bop runs the same without a card. The card mounts only at
// startup, because the slot has no card-detect pin: a card inserted later is
// used after the next restart. Bop never formats a card.

#define BOP_SDCARD_DIRECTORY "/sdcard/bop"
#define BOP_SDCARD_COVER_DIRECTORY BOP_SDCARD_DIRECTORY "/covers"

// Starts collecting log lines in PSRAM and starts the task that mounts the card
// and writes them to it. Call it first in app_main, so the log holds startup.
esp_err_t bop_sdcard_start(void);

// Deletes the logs of earlier runs and every picture on the card, once it is
// mounted. Bop calls it whenever it starts without full credentials, like
// bop_cache_clear.
void bop_sdcard_erase_private_data(void);

// Reserves the card for file access. Returns false, and reserves nothing,
// while no card is mounted. Every true return needs bop_sdcard_release.
bool bop_sdcard_acquire(void);
void bop_sdcard_release(void);

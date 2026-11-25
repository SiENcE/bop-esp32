// SPDX-FileCopyrightText: 2026 SiENcE
// SPDX-License-Identifier: Apache-2.0

#pragma once

#include <stdbool.h>

#include "esp_err.h"
#include "lvgl.h"

// Kid mode starts here: the account's library, four pictures to a page, with
// no text a child has to read. Followed artists show round and open their
// albums. Saved albums show square and play. Every function runs in the LVGL
// task, like the rest of the UI.
typedef struct {
    // Called on each press. Returns false when the press only wakes the
    // display, so it selects nothing.
    bool (*press)(void);
    void (*select)(const char *album_id);
    // Pauses or resumes, for a tap on the album that is already playing.
    void (*toggle)(void);
    // Returns to the now-playing screen.
    void (*resume)(void);
} bop_library_view_callbacks_t;

typedef struct {
    bool available;
    bool is_playing;
    // The album of the playing track, or an empty string.
    const char *album_id;
} bop_library_view_playback_t;

esp_err_t bop_library_view_create(lv_obj_t *screen, const bop_library_view_callbacks_t *callbacks);
void bop_library_view_show(void);
void bop_library_view_hide(void);
// Runs on every UI tick. It takes a changed album list and finished covers,
// and asks for the covers that the shown page still lacks.
void bop_library_view_update(const bop_library_view_playback_t *playback);
// Dims the cover of an album that is starting. NULL clears the mark.
void bop_library_view_set_pending(const char *album_id);

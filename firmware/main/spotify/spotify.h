// SPDX-FileCopyrightText: 2026 Mark Phelps
// SPDX-License-Identifier: Apache-2.0

#pragma once

#include <stdbool.h>
#include <stdint.h>

#include "../credentials.h"
#include "esp_err.h"

#define BOP_TRACK_ID_CAPACITY 64
#define BOP_TITLE_CAPACITY 256
#define BOP_ARTISTS_CAPACITY 256
#define BOP_ALBUM_ART_URL_CAPACITY 512

typedef struct {
    bool available;
    bool is_playing;
    // A podcast or audiobook episode. `artists` then holds the show name, and
    // `track_id` holds the episode ID, which opens under /episode/, not /track/.
    bool is_episode;
    char track_id[BOP_TRACK_ID_CAPACITY];
    // The album of the playing track, so the kid-mode grid can mark it. Empty
    // for an episode.
    char album_id[BOP_TRACK_ID_CAPACITY];
    char title[BOP_TITLE_CAPACITY];
    char artists[BOP_ARTISTS_CAPACITY];
    char album_art_url[BOP_ALBUM_ART_URL_CAPACITY];
    uint32_t progress_ms;
    uint32_t duration_ms;
    uint8_t volume_percent;
    bool volume_available;
    uint32_t volume_command_generation;
    uint32_t change_counter;
} playback_state_t;

// Kid mode shows the account's library: followed artists first, then saved
// albums. An artist opens the list of its own albums. Spotify IDs are 22
// base-62 characters. Image URLs on i.scdn.co are about 64.
#define BOP_LIBRARY_ARTIST_CAPACITY 48
#define BOP_LIBRARY_CAPACITY 144
#define BOP_ARTIST_ALBUM_CAPACITY 200
#define BOP_ALBUM_ID_CAPACITY 32
#define BOP_COVER_URL_CAPACITY 160
// Spotify lists each image in several widths. The smallest one at least this
// wide still fills a 172-pixel grid tile.
#define BOP_COVER_MIN_WIDTH 160

typedef enum {
    BOP_LIBRARY_LOADING,
    BOP_LIBRARY_READY,
    BOP_LIBRARY_FAILED,
} bop_library_status_t;

typedef enum {
    BOP_LIBRARY_ENTRY_ALBUM,
    BOP_LIBRARY_ENTRY_ARTIST,
} bop_library_entry_kind_t;

typedef struct {
    bop_library_entry_kind_t kind;
    char id[BOP_ALBUM_ID_CAPACITY];
    char cover_url[BOP_COVER_URL_CAPACITY];
} bop_library_entry_t;

typedef struct {
    bop_library_status_t status;
    // Moves with every published change, so a reader copies only on change.
    uint32_t generation;
    // False while the first read still adds pages, which it publishes one by
    // one so the grid fills as the library arrives.
    bool complete;
    size_t count;
    bop_library_entry_t entries[BOP_LIBRARY_CAPACITY];
} bop_library_t;

// The albums of one artist. Spotify sends ten per request.
typedef struct {
    char artist_id[BOP_ALBUM_ID_CAPACITY];
    bop_library_status_t status;
    uint32_t generation;
    // True once Spotify has no further page.
    bool complete;
    size_t count;
    bop_library_entry_t entries[BOP_ARTIST_ALBUM_CAPACITY];
} bop_artist_albums_t;

typedef enum {
    SPOTIFY_COMMAND_NEXT,
    SPOTIFY_COMMAND_PREVIOUS,
    SPOTIFY_COMMAND_TOGGLE,
    SPOTIFY_COMMAND_SET_VOLUME,
    SPOTIFY_COMMAND_PLAY_ALBUM,
} spotify_command_t;

typedef enum {
    SPOTIFY_COMMAND_SUBMISSION_NOT_READY,
    SPOTIFY_COMMAND_SUBMISSION_QUEUE_FULL,
    SPOTIFY_COMMAND_SUBMISSION_RATE_LIMITED,
    SPOTIFY_COMMAND_SUBMISSION_QUEUED,
} spotify_command_submission_t;

typedef struct {
    spotify_command_t command;
    uint32_t request_id;
    bool accepted;
    bool rate_limited;
    bool was_playing;
    // A play-album request found no Spotify device to play on.
    bool no_device;
} spotify_command_result_t;

esp_err_t bop_spotify_start(bop_credentials_t *credentials);
bool bop_spotify_get_state(playback_state_t *state);
bool bop_spotify_commands_ready(void);
spotify_command_submission_t bop_spotify_enqueue_command(
    spotify_command_t command, uint32_t request_id);
bool bop_spotify_enqueue_volume(uint8_t volume_percent);
uint32_t bop_spotify_get_volume_request_generation(void);
bool bop_spotify_get_command_result(spotify_command_result_t *result);
// Starts the album from its first track, in order. The result arrives through
// bop_spotify_get_command_result with SPOTIFY_COMMAND_PLAY_ALBUM.
spotify_command_submission_t bop_spotify_enqueue_play_album(
    const char *album_id, uint32_t request_id);
// Copies the published library. Returns false before the first publish.
bool bop_spotify_get_library(bop_library_t *library);
uint32_t bop_spotify_get_library_generation(void);
// Asks for a fresh read of the library. The client task limits how often.
void bop_spotify_request_library_refresh(void);
// Asks for at least `wanted` albums of an artist, or for none with NULL.
// Another artist ID starts a new list. A stored list publishes whole at once.
void bop_spotify_request_artist_albums(const char *artist_id, size_t wanted);
bool bop_spotify_get_artist_albums(bop_artist_albums_t *albums);
uint32_t bop_spotify_get_artist_albums_generation(void);
// Someone touched or lifted the board. The client renews a token that would
// expire soon and reads the play state at once, so the next tap is quick.
void bop_spotify_wake(void);

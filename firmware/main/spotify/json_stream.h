// SPDX-FileCopyrightText: 2026 SiENcE
// SPDX-License-Identifier: Apache-2.0

#pragma once

#include <stdbool.h>
#include <stddef.h>

// A JSON reader that never holds the document. Spotify returns each saved
// album with its full track list, about 20 KB an album, while Bop needs only
// the album ID and a cover URL. This reader takes the response in chunks as
// it arrives and reports each scalar with its path, in constant memory.
//
// A path joins the object keys from the root with '.'. Array levels add
// nothing, so every image URL of every saved album reports as
// "items.album.images.url".

#define BOP_JSON_MAX_DEPTH 16
#define BOP_JSON_KEY_CAPACITY 24
#define BOP_JSON_VALUE_CAPACITY 256
#define BOP_JSON_PATH_CAPACITY 192

// value holds the text of a string, or the literal text of a number, true,
// false, or null. A string longer than the value capacity is not reported:
// the IDs and URLs that Bop reads are far shorter.
typedef void (*bop_json_value_handler_t)(
    void *context, const char *path, const char *value, bool is_string);
// Runs when an object or an array closes, with the path that names it.
typedef void (*bop_json_close_handler_t)(void *context, const char *path, bool is_array);

typedef enum {
    BOP_JSON_STATE_STRUCTURE,
    BOP_JSON_STATE_STRING,
    BOP_JSON_STATE_LITERAL,
} bop_json_state_t;

typedef struct {
    bop_json_value_handler_t on_value;
    bop_json_close_handler_t on_close;
    void *context;
    bop_json_state_t state;
    // Index 0 is outside the root. Levels 1 through depth are open.
    int depth;
    bool in_array[BOP_JSON_MAX_DEPTH + 1];
    bool expect_key[BOP_JSON_MAX_DEPTH + 1];
    char keys[BOP_JSON_MAX_DEPTH + 1][BOP_JSON_KEY_CAPACITY];
    char pending_key[BOP_JSON_KEY_CAPACITY];
    char token[BOP_JSON_VALUE_CAPACITY];
    size_t token_length;
    bool token_truncated;
    bool string_is_key;
    bool escape;
    int unicode_digits;
    bool done;
    bool failed;
} bop_json_stream_t;

void bop_json_stream_init(
    bop_json_stream_t *stream,
    bop_json_value_handler_t on_value,
    bop_json_close_handler_t on_close,
    void *context);
// Returns false once the input is not valid JSON or nests too deep.
bool bop_json_stream_feed(bop_json_stream_t *stream, const char *data, size_t length);
// True when one complete root object or array arrived without an error.
bool bop_json_stream_complete(const bop_json_stream_t *stream);

// SPDX-FileCopyrightText: 2026 SiENcE
// SPDX-License-Identifier: Apache-2.0

#include "json_stream.h"

#include <string.h>

void bop_json_stream_init(
    bop_json_stream_t *stream,
    bop_json_value_handler_t on_value,
    bop_json_close_handler_t on_close,
    void *context)
{
    memset(stream, 0, sizeof(*stream));
    stream->on_value = on_value;
    stream->on_close = on_close;
    stream->context = context;
    stream->state = BOP_JSON_STATE_STRUCTURE;
}

bool bop_json_stream_complete(const bop_json_stream_t *stream)
{
    return stream->done && !stream->failed;
}

static bool fail(bop_json_stream_t *stream)
{
    stream->failed = true;
    return false;
}

static bool innermost_is_object(const bop_json_stream_t *stream)
{
    return stream->depth > 0 && !stream->in_array[stream->depth];
}

// Joins the keys of the open levels, then the key of the value at hand.
static void build_path(const bop_json_stream_t *stream, const char *last, char *path)
{
    size_t used = 0;
    path[0] = '\0';
    for (int level = 1; level <= stream->depth + 1; ++level) {
        const char *key = level <= stream->depth ? stream->keys[level] : last;
        if (key == NULL || key[0] == '\0') {
            continue;
        }
        size_t length = strlen(key);
        size_t separator = used > 0 ? 1 : 0;
        if (used + separator + length >= BOP_JSON_PATH_CAPACITY) {
            // A path that does not fit cannot match a path that Bop reads.
            path[0] = '\0';
            return;
        }
        if (separator) {
            path[used++] = '.';
        }
        memcpy(path + used, key, length);
        used += length;
        path[used] = '\0';
    }
}

static void emit_value(bop_json_stream_t *stream, bool is_string)
{
    if (stream->depth == 0 || stream->on_value == NULL) {
        return;
    }
    char path[BOP_JSON_PATH_CAPACITY];
    build_path(stream, innermost_is_object(stream) ? stream->pending_key : NULL, path);
    if (path[0] != '\0') {
        stream->on_value(stream->context, path, stream->token, is_string);
    }
}

static void append_token(bop_json_stream_t *stream, char character)
{
    if (stream->token_length + 1 >= sizeof(stream->token)) {
        stream->token_truncated = true;
        return;
    }
    stream->token[stream->token_length++] = character;
    stream->token[stream->token_length] = '\0';
}

static void start_token(bop_json_stream_t *stream)
{
    stream->token_length = 0;
    stream->token[0] = '\0';
    stream->token_truncated = false;
}

static bool open_container(bop_json_stream_t *stream, bool is_array)
{
    if (stream->done || stream->depth >= BOP_JSON_MAX_DEPTH) {
        return fail(stream);
    }
    if (innermost_is_object(stream) && stream->expect_key[stream->depth]) {
        return fail(stream);
    }
    const char *name = innermost_is_object(stream) ? stream->pending_key : "";
    ++stream->depth;
    stream->in_array[stream->depth] = is_array;
    stream->expect_key[stream->depth] = !is_array;
    strlcpy(stream->keys[stream->depth], name, BOP_JSON_KEY_CAPACITY);
    stream->pending_key[0] = '\0';
    return true;
}

static bool close_container(bop_json_stream_t *stream, bool is_array)
{
    if (stream->depth == 0 || stream->in_array[stream->depth] != is_array) {
        return fail(stream);
    }
    if (stream->on_close != NULL) {
        char path[BOP_JSON_PATH_CAPACITY];
        build_path(stream, NULL, path);
        stream->on_close(stream->context, path, is_array);
    }
    --stream->depth;
    stream->pending_key[0] = '\0';
    if (stream->depth == 0) {
        stream->done = true;
    }
    return true;
}

static void finish_string(bop_json_stream_t *stream)
{
    if (stream->string_is_key) {
        // A key longer than the capacity is cut. It then matches no path
        // that Bop reads, which is the wanted result.
        strlcpy(stream->pending_key, stream->token, sizeof(stream->pending_key));
        return;
    }
    if (!stream->token_truncated) {
        emit_value(stream, true);
    }
}

static bool structure_character(bop_json_stream_t *stream, char character)
{
    switch (character) {
    case ' ':
    case '\t':
    case '\r':
    case '\n':
        return true;
    case '{':
        return open_container(stream, false);
    case '[':
        return open_container(stream, true);
    case '}':
        return close_container(stream, false);
    case ']':
        return close_container(stream, true);
    case ':':
        if (!innermost_is_object(stream) || !stream->expect_key[stream->depth]) {
            return fail(stream);
        }
        stream->expect_key[stream->depth] = false;
        return true;
    case ',':
        if (stream->depth == 0) {
            return fail(stream);
        }
        if (!stream->in_array[stream->depth]) {
            stream->expect_key[stream->depth] = true;
            stream->pending_key[0] = '\0';
        }
        return true;
    case '"':
        if (stream->done) {
            return fail(stream);
        }
        stream->string_is_key = innermost_is_object(stream) && stream->expect_key[stream->depth];
        stream->escape = false;
        stream->unicode_digits = 0;
        start_token(stream);
        stream->state = BOP_JSON_STATE_STRING;
        return true;
    default:
        if (stream->done
            || stream->depth == 0
            || (innermost_is_object(stream) && stream->expect_key[stream->depth])) {
            return fail(stream);
        }
        start_token(stream);
        append_token(stream, character);
        stream->state = BOP_JSON_STATE_LITERAL;
        return true;
    }
}

static char unescape(char character)
{
    switch (character) {
    case 'b':
        return '\b';
    case 'f':
        return '\f';
    case 'n':
        return '\n';
    case 'r':
        return '\r';
    case 't':
        return '\t';
    default:
        // '"', '\\', and '/' stand for themselves.
        return character;
    }
}

static void string_character(bop_json_stream_t *stream, char character)
{
    if (stream->unicode_digits > 0) {
        // Bop reads only ASCII IDs and URLs, so a \uXXXX escape becomes one
        // placeholder character instead of being decoded.
        if (--stream->unicode_digits == 0) {
            append_token(stream, '?');
        }
        return;
    }
    if (stream->escape) {
        stream->escape = false;
        if (character == 'u') {
            stream->unicode_digits = 4;
        } else {
            append_token(stream, unescape(character));
        }
        return;
    }
    if (character == '\\') {
        stream->escape = true;
        return;
    }
    if (character == '"') {
        stream->state = BOP_JSON_STATE_STRUCTURE;
        finish_string(stream);
        return;
    }
    append_token(stream, character);
}

bool bop_json_stream_feed(bop_json_stream_t *stream, const char *data, size_t length)
{
    for (size_t index = 0; index < length && !stream->failed; ++index) {
        char character = data[index];
        if (stream->state == BOP_JSON_STATE_STRING) {
            string_character(stream, character);
            continue;
        }
        if (stream->state == BOP_JSON_STATE_LITERAL) {
            bool ends = character == ',' || character == '}' || character == ']'
                || character == ' ' || character == '\t' || character == '\r'
                || character == '\n';
            if (!ends) {
                append_token(stream, character);
                continue;
            }
            stream->state = BOP_JSON_STATE_STRUCTURE;
            if (!stream->token_truncated) {
                emit_value(stream, false);
            }
            // The character that ended the literal is structure, so it runs
            // through the structure path below.
        }
        structure_character(stream, character);
    }
    return !stream->failed;
}

// SPDX-FileCopyrightText: 2026 Mark Phelps
// SPDX-License-Identifier: Apache-2.0

#pragma once

#include <stdbool.h>
#include <stdint.h>

#include "esp_err.h"
#include "freertos/FreeRTOS.h"
#include "freertos/queue.h"
#include "lvgl.h"
#include "../spotify/spotify.h"

typedef struct {
    lv_image_dsc_t image;
    uint8_t *pixels;
    uint32_t dominant_rgb;
    char track_id[BOP_TRACK_ID_CAPACITY];
} bop_album_art_t;

// Two covers per row with 8-pixel margins and gap fill the 368-pixel width.
#define BOP_COVER_SIZE 172
#define BOP_COVER_CORNER_RADIUS 8
#define BOP_ART_CORNER_RADIUS 4
// Rounded corners are painted into the pixels once, at decode time, in the
// color that the screen and the grid show behind every image. Clipping them in
// LVGL instead masks the whole image again on every redraw, every animation
// frame of a swipe included. A change to that background color must change
// this one too.
#define BOP_IMAGE_BACKGROUND_RGB 0x121212

typedef enum {
    BOP_COVER_SHAPE_ROUNDED,
    BOP_COVER_SHAPE_CIRCLE,
} bop_cover_shape_t;

typedef struct {
    lv_image_dsc_t image;
    uint8_t *pixels;
    char album_id[BOP_ALBUM_ID_CAPACITY];
} bop_cover_t;

esp_err_t bop_art_pipeline_start(QueueHandle_t result_queue);
void bop_art_mark_active(const char *track_id);
void bop_album_art_free(bop_album_art_t *art);

// Asks the art task for one album cover. The now-playing art goes first. A
// full request queue returns false, and the caller asks again later.
bool bop_cover_request(const char *album_id, const char *url, bop_cover_shape_t shape);
// The receiver owns a returned cover and frees it with bop_cover_free.
bool bop_cover_receive(bop_cover_t **cover);
void bop_cover_free(bop_cover_t *cover);

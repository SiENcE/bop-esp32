// SPDX-FileCopyrightText: 2026 SiENcE
// SPDX-License-Identifier: Apache-2.0

#pragma once

#include <stdint.h>

#include "esp_err.h"

// The QMI8658 motion sensor tells when someone picks up or tilts the board, so
// the screen wakes without a touch. Without the sensor, only a touch wakes it.

// Needs the board I2C bus, which the display start opens.
esp_err_t bop_motion_start(void);
// Counts the moves since start. A changed value means the board moved.
uint32_t bop_motion_count(void);

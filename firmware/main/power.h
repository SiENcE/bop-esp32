// SPDX-FileCopyrightText: 2026 Mark Phelps
// SPDX-License-Identifier: Apache-2.0

#pragma once

#include <stdbool.h>
#include <stdint.h>

#include "esp_err.h"

typedef struct {
    bool present;
    bool charging;
    bool on_battery;
    // The fuel-gauge estimate from 0 through 100, or -1 when it is unknown.
    int8_t percent;
} bop_battery_status_t;

esp_err_t bop_power_start(void);
bool bop_power_on_battery(void);
// Reports no battery until the power monitor has read the AXP2101 once.
void bop_power_get_battery(bop_battery_status_t *status);

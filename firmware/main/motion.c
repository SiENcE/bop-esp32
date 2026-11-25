// SPDX-FileCopyrightText: 2026 SiENcE
// SPDX-License-Identifier: Apache-2.0

#include "motion.h"

#include <stdatomic.h>
#include <stdbool.h>
#include <stdlib.h>

#include "bsp/esp32_s3_touch_amoled_1_8.h"
#include "driver/i2c_master.h"
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/idf_additions.h"
#include "freertos/task.h"

// The address depends on the SA0 pin, which the Waveshare documents do not
// name, so both are tried.
static const uint8_t sensor_addresses[] = {0x6B, 0x6A};
#define WHO_AM_I_REGISTER 0x00
#define WHO_AM_I_VALUE 0x05
#define CTRL1_REGISTER 0x02
#define CTRL2_REGISTER 0x03
#define CTRL7_REGISTER 0x08
#define ACCEL_X_LOW_REGISTER 0x35
// Register addresses advance on their own during a read.
#define CTRL1_ADDRESS_AUTO_INCREMENT 0x40
// Plus or minus 2 g, low-power mode at 21 Hz: enough to notice a hand, and
// the sensor draws only microamperes.
#define CTRL2_ACCEL_2G_21HZ_LOW_POWER 0x0D
#define CTRL7_ACCEL_ONLY 0x01
#define ACCEL_LSB_PER_G 16384
// A change of 0.1 g, summed over the three axes, is a tilt of about 6 degrees.
// A board lying still stays far below it.
#define MOVE_THRESHOLD (ACCEL_LSB_PER_G / 10)
#define POLL_INTERVAL_MS 100
#define TASK_STACK_SIZE 3072
#define TASK_PRIORITY 2

static const char *TAG = "bop_motion";
static i2c_master_dev_handle_t sensor;
static atomic_uint move_count;
// I2C transfers read and write these from an interrupt, so they lie in
// internal RAM, not on the PSRAM task stack.
static uint8_t register_address;
static uint8_t sample[6];

static esp_err_t read_registers(uint8_t address, uint8_t *values, size_t length)
{
    register_address = address;
    return i2c_master_transmit_receive(sensor, &register_address, 1, values, length, 100);
}

static esp_err_t write_register(uint8_t address, uint8_t value)
{
    static uint8_t buffer[2];
    buffer[0] = address;
    buffer[1] = value;
    return i2c_master_transmit(sensor, buffer, sizeof(buffer), 100);
}

static bool read_acceleration(int32_t axes[3])
{
    if (read_registers(ACCEL_X_LOW_REGISTER, sample, sizeof(sample)) != ESP_OK) {
        return false;
    }
    for (int axis = 0; axis < 3; ++axis) {
        axes[axis] = (int16_t)(sample[2 * axis] | (sample[2 * axis + 1] << 8));
    }
    return true;
}

// The reference moves only with a detected move, so a slow tilt adds up until
// it counts, and a board that lies still counts nothing.
static void motion_task(void *argument)
{
    (void)argument;
    int32_t reference[3] = {0};
    bool have_reference = false;
    for (;;) {
        int32_t axes[3];
        if (read_acceleration(axes)) {
            int32_t change = 0;
            for (int axis = 0; axis < 3; ++axis) {
                change += abs(axes[axis] - reference[axis]);
            }
            if (!have_reference || change > MOVE_THRESHOLD) {
                if (have_reference) {
                    atomic_fetch_add(&move_count, 1);
                }
                for (int axis = 0; axis < 3; ++axis) {
                    reference[axis] = axes[axis];
                }
                have_reference = true;
            }
        }
        vTaskDelay(pdMS_TO_TICKS(POLL_INTERVAL_MS));
    }
}

static esp_err_t find_sensor(i2c_master_bus_handle_t bus)
{
    for (size_t index = 0; index < sizeof(sensor_addresses); ++index) {
        if (i2c_master_probe(bus, sensor_addresses[index], 100) != ESP_OK) {
            continue;
        }
        const i2c_device_config_t configuration = {
            .dev_addr_length = I2C_ADDR_BIT_LEN_7,
            .device_address = sensor_addresses[index],
            .scl_speed_hz = 400000,
        };
        if (i2c_master_bus_add_device(bus, &configuration, &sensor) != ESP_OK) {
            continue;
        }
        uint8_t identity = 0;
        if (read_registers(WHO_AM_I_REGISTER, &identity, 1) == ESP_OK
            && identity == WHO_AM_I_VALUE) {
            ESP_LOGI(TAG, "QMI8658 motion sensor at 0x%02X", sensor_addresses[index]);
            return ESP_OK;
        }
        i2c_master_bus_rm_device(sensor);
        sensor = NULL;
    }
    return ESP_ERR_NOT_FOUND;
}

esp_err_t bop_motion_start(void)
{
    if (sensor != NULL) {
        return ESP_ERR_INVALID_STATE;
    }
    i2c_master_bus_handle_t bus = bsp_i2c_get_handle();
    if (bus == NULL) {
        return ESP_ERR_INVALID_STATE;
    }
    esp_err_t error = find_sensor(bus);
    if (error == ESP_OK) {
        error = write_register(CTRL1_REGISTER, CTRL1_ADDRESS_AUTO_INCREMENT);
    }
    if (error == ESP_OK) {
        error = write_register(CTRL2_REGISTER, CTRL2_ACCEL_2G_21HZ_LOW_POWER);
    }
    if (error == ESP_OK) {
        error = write_register(CTRL7_REGISTER, CTRL7_ACCEL_ONLY);
    }
    // The stack lies in PSRAM to spare internal RAM. This task never writes
    // flash, which would make PSRAM unreachable while it runs.
    if (error == ESP_OK
        && xTaskCreatePinnedToCoreWithCaps(
               motion_task,
               "bop_motion",
               TASK_STACK_SIZE,
               NULL,
               TASK_PRIORITY,
               NULL,
               tskNO_AFFINITY,
               MALLOC_CAP_SPIRAM)
            != pdPASS) {
        error = ESP_ERR_NO_MEM;
    }
    if (error != ESP_OK && sensor != NULL) {
        i2c_master_bus_rm_device(sensor);
        sensor = NULL;
    }
    return error;
}

uint32_t bop_motion_count(void)
{
    return atomic_load(&move_count);
}

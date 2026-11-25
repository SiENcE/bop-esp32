#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2026 SiENcE
# SPDX-License-Identifier: Apache-2.0

"""Verify the safety rules of the SD card log and picture overflow."""

from __future__ import annotations

from pathlib import Path

FIRMWARE = Path(__file__).resolve().parent.parent / "firmware"


def read(relative: str) -> str:
    return (FIRMWARE / relative).read_text(encoding="utf-8")


def function_body(source: str, signature: str) -> str:
    start = source.index(signature)
    end = source.index("\n}\n", start)
    return source[start:end]


def test_card_is_never_formatted() -> None:
    # A card can hold other data. Bop mounts it as it is or leaves it alone.
    assert "CONFIG_BSP_SD_FORMAT_ON_MOUNT_FAIL=y" not in read("sdkconfig.defaults")
    sdcard = read("main/sdcard.c")
    assert "bsp_sdcard_mount()" in sdcard
    for format_call in ("esp_vfs_fat_sdcard_format", "format_if_mount_failed", "f_mkfs"):
        assert format_call not in sdcard


def test_log_starts_first_and_private_data_goes_without_credentials() -> None:
    app_main = read("main/app_main.c")
    body = function_body(app_main, "void app_main(void)")
    assert body.index("bop_sdcard_start()") < body.index('"Starting the display"')
    clear = "    bop_cache_clear();\n    bop_sdcard_erase_private_data();\n"
    assert clear in app_main
    startup = function_body(app_main, "static void startup_task(void *argument)")
    assert startup.index("provision_state == BOP_PROVISION_COMPLETE") < startup.index(
        "bop_sdcard_erase_private_data();"
    )


def test_card_keeps_only_bop_lines_warnings_and_errors() -> None:
    # The WiFi driver names the joined network in an informational line, so
    # informational lines of other components stay off the card.
    body = function_body(read("main/sdcard.c"), "static bool line_is_kept(const char *text)")
    assert "text[0] == 'E' || text[0] == 'W'" in body
    assert 'strncmp(tag + 2, "bop", 3) == 0' in body


def test_hook_stays_installed_and_writer_never_writes_flash() -> None:
    sdcard = read("main/sdcard.c")
    # screenshot.c chains its hook to this one. Installing a second time, to
    # remove this hook, would remove the screenshot hook as well.
    assert sdcard.count("esp_log_set_vprintf(") == 1
    # The writer stack lies in PSRAM, which a flash write makes unreachable.
    assert "MALLOC_CAP_SPIRAM)" in sdcard
    for flash_call in ("esp_partition_", "nvs_", "spi_flash_"):
        assert flash_call not in sdcard


def test_card_takes_pictures_only_when_flash_is_full() -> None:
    body = function_body(
        read("main/cache.c"),
        "void bop_cache_store_cover(const char *id, const uint8_t *pixels, size_t size)",
    )
    assert body.count("store_sd_cover(") == 1
    assert body.index("if (!free_slot) {") < body.index("store_sd_cover(")


def main() -> int:
    test_card_is_never_formatted()
    test_log_starts_first_and_private_data_goes_without_credentials()
    test_card_keeps_only_bop_lines_warnings_and_errors()
    test_hook_stays_installed_and_writer_never_writes_flash()
    test_card_takes_pictures_only_when_flash_is_full()
    print("SD card checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

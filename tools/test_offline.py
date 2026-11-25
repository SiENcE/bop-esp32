#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2026 SiENcE
# SPDX-License-Identifier: Apache-2.0

"""Verify how Bop behaves without WiFi and how it keeps the artist lists."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FIRMWARE = ROOT / "firmware"


def read(relative: str) -> str:
    return (FIRMWARE / relative).read_text(encoding="utf-8")


def function_body(source: str, signature: str) -> str:
    start = source.index(signature)
    end = source.index("\n}\n", start)
    return source[start:end]


def test_no_command_waits_for_wifi() -> None:
    ui = read("main/ui/ui.c")
    # A tap without WiFi shows WAIT and sends nothing.
    for signature in (
        "static bool send_gesture_command(",
        "static void library_select(",
        "static void library_toggle(",
    ):
        body = function_body(ui, signature)
        assert "if (!bop_wifi_is_connected())" in body, signature
        assert body.index("bop_wifi_is_connected()") < body.index(
            "return;" if "void" in signature else "return false;"
        ), signature
    gesture = function_body(ui, "static bool send_gesture_command(")
    assert gesture.index("bop_wifi_is_connected()") < gesture.index("bop_spotify_enqueue_command(")
    select = function_body(ui, "static void library_select(")
    assert select.index("bop_wifi_is_connected()") < select.index("bop_spotify_enqueue_play_album(")
    assert "&& bop_wifi_is_connected();" in function_body(ui, "static void gesture_event(")
    # A command that waited for WiFi anyway is dropped on receive.
    spotify = read("main/spotify/spotify.c")
    assert "&& !drop_if_stale(&pending_command);" in spotify
    assert "#define COMMAND_MAX_AGE_MS 5000" in spotify
    assert "queued.queued_at = xTaskGetTickCount();" in spotify


def test_only_an_undelivered_or_harmless_request_repeats() -> None:
    spotify = read("main/spotify/spotify.c")
    body = function_body(spotify, "static bool request_may_repeat(")
    # A skip is a POST. A repeat after Spotify got it would skip twice.
    assert "error == ESP_ERR_HTTP_CONNECT || error == ESP_ERR_HTTP_WRITE_DATA" in body
    assert "method == HTTP_METHOD_GET || method == HTTP_METHOD_PUT" in body
    assert "HTTP_METHOD_POST" not in body
    request = function_body(spotify, "static esp_err_t api_request_with_body(")
    assert request.count("perform_request(") == 2
    assert request.index("request_may_repeat(") < request.index("esp_http_client_close(")


def test_artist_lists_live_in_flash() -> None:
    cache = read("main/cache.c")
    assert "#define CACHE_VERSION 2" in cache
    assert "artist list outgrew its slot" in cache
    # An unchanged list writes no flash.
    store = function_body(cache, "void bop_cache_store_artist(")
    assert store.index("artists[found].checksum == checksum") < store.index(
        "esp_partition_erase_range("
    )
    # The grid reads a stored list itself, so an artist opens without WiFi.
    library_view = read("main/ui/library_view.c")
    assert "bop_cache_load_artist(artist_id, view.incoming)" in library_view
    keep = function_body(library_view, "static bool take_artist_list(")
    assert "view.incoming->status != BOP_LIBRARY_READY" in keep


def test_cache_reaches_the_end_of_flash() -> None:
    line = next(
        line for line in read("partitions.csv").splitlines() if line.strip().startswith("cache,")
    )
    fields = [field.strip() for field in line.split(",")]
    offset = int(fields[3], 16)
    size = int(fields[4], 16)
    assert offset + size == 16 * 1024 * 1024
    # The application keeps the size that deprovision.py checks on the board.
    factory = next(
        line for line in read("partitions.csv").splitlines() if line.strip().startswith("factory,")
    )
    assert [field.strip() for field in factory.split(",")][4] == "8M"


def main() -> int:
    test_no_command_waits_for_wifi()
    test_only_an_undelivered_or_harmless_request_repeats()
    test_artist_lists_live_in_flash()
    test_cache_reaches_the_end_of_flash()
    print("Offline checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

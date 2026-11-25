# How Bop works

## Hardware and USB boot

Bop uses the Waveshare ESP32-S3 Touch AMOLED 1.8 board. The board has an ESP32-S3 processor, 16 MB flash, 8 MB PSRAM, and a 368 by 448 AMOLED display.

The display uses QSPI. The touch controller, AXP2101 power manager, QMI8658 motion sensor, and other low-speed devices use I2C. The microSD slot uses the SDMMC controller in 1-bit mode on GPIO 1 to 3, with no card-detect pin.

The board uses native USB. It appears as an Espressif USB serial device when you connect a USB data cable.

`mise run flash` uses ESP-IDF and esptool to write firmware through USB. The board resets after the flash and starts Bop after a normal power cycle.

If automatic reset fails, hold BOOT while you connect USB. Then run `mise run flash` again.

## ESP-IDF, BSP, and LVGL

ESP-IDF builds the firmware and starts FreeRTOS tasks. `mise install` installs the pinned ESP-IDF 5.5.5 toolchain for ESP32-S3.

The Waveshare BSP configures the panel, touch controller, display brightness, and shared I2C bus.

LVGL draws the interface. `esp_lvgl_port` runs the LVGL task on core 1. Code outside that task holds the display lock before it calls LVGL.

## Startup and task lifecycle

`app_main` first sets the time zone and starts the SD card log, so the log holds the whole start. It then starts the display, touch, brightness, AXP2101 monitor, and motion sensor, and opens the flash cache. Display startup also starts the LVGL task on core 1. It then reads the saved credentials from NVS.

Bop classifies the values as no credentials, the **WiFi-only state**, or complete credentials.

With no credentials, Bop prepares the **Bop setup AP** before WiFi starts. It shows the AP name, password, and QR code. Then it starts the **captive portal**.

In the WiFi-only state, Bop tries the saved network for 15 seconds. A failed connection starts the same prepared captive portal.

A successful WiFi-only connection synchronizes time. Bop then shows the USB provisioning command, `mise run provision`. A time-sync failure shows the same command with a recovery message.

With complete credentials, Bop initializes the current UI. This creates its 250 ms timer and starts the album-art task on core 0.

The complete state starts WiFi connection and time synchronization on core 0. It starts Spotify polling after both operations succeed.

The UI reads a protected playback-state snapshot and redraws only when it changes.

```text
app_main
  |
  +-- time zone and SD card log
  +-- display startup and LVGL task on core 1
  +-- touch, brightness, AXP2101 monitor, motion sensor, and flash cache
  +-- credential state from NVS
      |
      +-- none: Bop setup AP and captive portal
      +-- WiFi-only state: bounded WiFi, time sync, or captive portal
      +-- complete: Bop UI, WiFi, time sync, and Spotify
```

## Captive portal and WiFi credentials

`provisioning/portal.c` prepares the random Bop setup AP. It also scans networks, serves the embedded page, validates requests, and verifies a connection.

`provisioning/dns_hijack.c` validates DNS questions and answers valid A-record questions with `192.168.4.1`. The captive portal also uses this address.

`wifi.c` owns the shared ESP-IDF network services, interfaces, driver, and event handlers. Portal transitions reuse these services.

The captive portal supports open, WPA2-Personal, and WPA3-Personal networks. It shows WEP and enterprise networks as unsupported.

`credentials.c` is the only firmware module that writes WiFi values. The captive portal calls it only after the station receives an IP address.

## Spotify OAuth and NVS

`mise run provision` runs on the host computer. It requires `I AGREE` for [EULA.md](../EULA.md) and [PRIVACY.md](../PRIVACY.md) before it opens Spotify authorization.

The tool uses the Spotify Authorization Code flow with PKCE. The browser returns to a temporary loopback server at `127.0.0.1`.

The USB provisioning command queries the device state before Spotify authorization. It sends only the Spotify Client ID and refresh token through a bounded USB frame.

The firmware writes both Spotify values in one NVS transaction. It never reads, names, or replaces the WiFi values on this path.

The board has no Spotify client secret. On startup, it exchanges the refresh token for a short-lived access token.

The board stores a rotated refresh token when Spotify returns one. NVS stores credentials as plaintext. Read [SECURITY.md](../SECURITY.md) before you provision the board.

## Playback and album art

The Spotify task requests `GET /v1/me/player?additional_types=episode`. Without that parameter, Spotify reports a playing podcast episode as a null item. For an episode, the UI shows the show name in place of the artists, uses the episode or show image as art, and links the attribution QR code to the episode. It polls every 10 seconds while playback is active. It polls every 60 seconds while playback is paused or idle. A completed playback or volume command causes an immediate poll.

The task uses the ESP-IDF certificate bundle for HTTPS validation. It reads the active-device volume from `device.volume_percent`. A valid integer from 0 through 100 enables volume control. Bop intentionally ignores `device.supports_volume` and lets the volume request result decide whether control works.

Each playback change updates a snapshot behind a mutex. The UI shows the title, artist, progress, and album art. It uses valid volume state to enable vertical drag.

Normal playback commands use one request queue and one result queue. Volume commands use a separate one-slot overwrite queue. A new volume target replaces an older unsent target.

Bop sends volume with `PUT /v1/me/player/volume?volume_percent=<value>`. The next playback snapshot carries the generation of the processed volume request. The UI uses this generation to replace its temporary local target with Spotify state.

Spotify can return HTTP 429 with a `Retry-After` value. Bop accepts a positive numeric delay. It uses 60 seconds when the value is absent or invalid.

The Spotify task stops all requests during this cooldown. New normal commands are rejected. A rejected tap shows a warning. Bop keeps the newest volume target and retries it after the cooldown.

A 429 on a list request is different. Spotify can refuse one kind of request for hours while it answers the others: after a burst of artist album requests it asked for 18 hours there, while the library read a moment before went through. A 429 on the library pauses only library reads, and a 429 on an artist list pauses only artist lists, the background ones and those opened live, for the `Retry-After` time, at most 7 days. Playback, taps, and the stored lists go on. The log names each pause and its length: `Spotify rate limit on artist lists: they pause for N s`.

The art task downloads JPEG data into PSRAM. `esp_jpeg` decodes the image to RGB565 pixels.

The task scales album art to 368 by 368 pixels without cropping. It averages the pixels and darkens the result for the background gradient.

After successful decoding, the art task publishes the image. The UI timer validates and owns the current image in memory. It then marks the track as cached.

The task retries a failed download or decode after 5 seconds. It does not download art again after the UI accepts an image for the current track.

## Kid mode

Bop starts on the library grid. The Spotify task reads the artists the account follows with `GET /v1/me/following?type=artist`, then the saved albums with `GET /v1/me/albums`, and keeps each one with the URL of one picture. It keeps up to 48 artists, then albums up to 144 entries in all.

Spotify returns each saved album with its whole track list, about 20 KB an album. A small streaming JSON reader (`spotify/json_stream.c`) takes each response in chunks as it arrives. It reports every value with its path, such as `items.album.id`, and the task keeps only the IDs and image URLs. No response is held whole, so the 32 KB response buffer never limits a list. Error bodies still land in that buffer. Each list follows Spotify's `next` page URL, but only to an `https://api.spotify.com/v1/` address.

The task reads the library at startup, every three hours, and when the grid opens, at most every half hour. A library changes only when a parent edits it in Spotify, so fewer reads mean fewer requests that a weak WiFi can break. A failed read keeps a library that already worked. It publishes the library behind the playback-state mutex with a generation counter, and the UI copies it only when the generation moves.

The grid shows four 172-pixel pictures per page. Artists show round and albums square, so a child can tell them apart without reading. A swipe changes the page. Dots show up to ten pages, and a position bar shows longer lists. The art task decodes pictures on request, but only while the now-playing art has nothing to load. Of the image widths that Spotify lists, it takes the narrowest one that is at least 160 pixels wide. The UI keeps up to 48 decoded pictures, about 2.8 MB of PSRAM, and frees the least recently shown one first. It asks for the shown page and the next one first. While free slots remain, it then preloads the rest of the home library, so every page of it shows at once after the first load. A preloaded picture never evicts another, and only a picture of the shown page causes a redraw.

A tap on an artist opens its albums. The task reads `GET /v1/artists/{id}/albums` with `include_groups=album`, so regular albums appear and singles, compilations, and appearances do not. Spotify returns ten albums per request. The grid first reads the artist's list from the flash cache, so a stored list shows at once, also without WiFi. Without a stored list, the task loads pages as the child swipes, one page ahead of the shown one, up to 200 albums, with commands going first between pages. It stores the list once it is whole.

After the library read, the task also loads the album list of every followed artist in the background, one page every 20 seconds between commands and polls, and stores each one in the flash cache. It checks a list again once it is a week old, and rests for an hour after each pass. A first version loaded a page every second, and Spotify then refused artist album requests for 18 hours. A list that comes back unchanged writes no flash. A failed or loading list never replaces a stored one on the screen. The arrow button returns to the library and drops the artist list, and so does a swipe to the right on the artist's first page. The left and right thirds of the button bar answer for the arrow and the note button, a larger target than the drawn circles.

A tap on an album sends a play-album command through the normal command queue. The client sends `PUT /v1/me/player/play` with the album `context_uri`, from the first track. Spotify answers 404 when no device is active. Bop then reads `GET /v1/me/player/devices` and repeats the request on the first device that accepts remote control. After the album starts, Bop turns shuffle off, because children's albums are often stories told across tracks.

The cover of the playing album shows a translucent pause mark while it plays and a play mark while it is paused. A tap on that cover pauses or resumes, through the same command as a tap on the player, instead of starting the album over. Bop finds the playing album through the `context.uri` of the playback state, `spotify:album:<id>`, which keeps the ID of the album that started. The album ID of the playing track can differ, because Spotify relinks a track to the album version of the listener's market. Without an album context, for example in a playlist, Bop compares the album ID of the track, which misses a relinked album.

The grid stays until Spotify accepts the album, and the chosen cover dims meanwhile. A failed start shows a warning. When no device can play, it shows a muted speaker.

On the now-playing screen, the four-squares button right of the title returns to the grid. When playback ends, Bop returns to the grid by itself, except during the first 8 seconds after an album starts.

## Library cache

The `cache` partition after the application reaches the end of the 16 MB flash, 7.9 MB, and keeps the library list, the album lists of the followed artists, and the grid pictures across restarts (`main/cache.c`). The grid reads the stored list when it starts, before WiFi, the time sync, and the Spotify login finish, and the art task reads stored pictures before it downloads anything. A picture that is not stored waits until WiFi connects, and the grid asks for it again 10 seconds later. The network read then replaces the list in the background, all at once.

The list uses the first 32 KB. The artist lists follow in 48 slots of 40 KB, one per followed artist, each with up to 200 albums. A new artist takes a free slot, else the slot of the list seen longest ago. The pictures use the remaining 102 slots of 60 KB, each holding one 172-pixel picture exactly as drawn, corners included, so a stored picture needs one flash read and no decoder. When every slot is used and a microSD card is mounted, further pictures go to the card, as the next section describes. Without a card, a full cache reuses the slot of its oldest picture. Every write stores the data first and the header last, and a CRC-32 guards both, so an interrupted write or damaged flash reads as an empty entry. The list is written only when it changes.

A flash erase pauses both CPU cores for a moment, so the first time a picture is stored the display can stutter briefly. Bop erases the cache whenever it starts without full credentials, so a deprovisioned board keeps no library of the removed account.

## microSD card

A microSD card is optional (`main/sdcard.c`). The slot has no card-detect pin, so Bop mounts the card once at startup, and a card inserted later is used after the next restart. The card needs a FAT32 file system; Bop never formats a card, and exFAT is not built in. Without a card Bop runs the same.

The card holds the log in `bop/log.txt`. A new file starts at each start and after 4 MB; `log1.txt` to `log9.txt` keep the earlier ones. The file keeps Bop's own lines and the warnings and errors of every component. Informational lines of ESP-IDF stay on the serial port, because the WiFi driver names the network it joins in one of them. Each run starts with `=== Bop started (reset: ...) ===`, which names the cause of the restart, such as power on, crash, or watchdog. Each line carries milliseconds since start, and one `=== Clock: ... ===` line ties them to the local time of `CONFIG_BOP_TIMEZONE` once it is synchronized. Lines collect in a 64 KB PSRAM buffer and a low-priority task writes them every two seconds, so logging never waits for the card, and a power cut loses at most the last two seconds. A crash report goes to the serial port only.

Once every flash slot holds a picture, further pictures go to `bop/covers` on the card, up to 2000 (about 118 MB), and the flash keeps the pictures it already holds. Without a card, or with a full one, the flash reuses its oldest slot as before. A picture is written under a temporary name first and renamed when complete. FAT names here are 8.3 and ignore case while Spotify IDs do not, so a file is named by a CRC-32 of the album ID, and its header holds the ID and a CRC-32 of the pixels.

Like the flash cache, the card loses its pictures and the logs of earlier runs whenever Bop starts without full credentials.

## Network speed

ESP-IDF starts a WiFi station with modem sleep: the radio wakes only for the access point's beacons, and every round trip waits for the next one. On USB power Bop turns this sleep off. On battery the radio sleeps, except while a task holds it awake: a library read, an artist page, a playback command, or a batch of picture downloads, which keeps it awake until the art task has been idle for 3 seconds.

The library and the pictures are far larger downloads than playback state. The TCP receive window is 23,360 bytes, 16 packets per round trip instead of the 4 of the ESP-IDF default. WiFi and lwIP keep their buffers in internal RAM. Moving lwIP to PSRAM would force 16 static WiFi TX and 16 static RX buffers into internal RAM, which leaves too little for TLS. The log reports free internal memory after the startup and again 30 seconds later, each time with the lowest point so far. The Spotify client reads in 4 KB pieces. Picture downloads share one kept HTTPS connection per batch, which saves a TLS handshake for every picture after the first. The serial log reports `Library read in N ms` after each library read.

## Touch controls and display care

The UI records the first touch point and tracks movement while the press continues. Movement greater than 20 pixels prevents the press from opening the attribution screen. A stationary long press still opens that screen.

After 48 pixels of dominant movement, the gesture locks to one axis. A left swipe sends the previous-track command. A right swipe sends the next-track command. A short press sends pause or play.

A vertical drag controls volume when Spotify reports a valid volume value. Up increases volume, and down decreases it. The UI measures movement across the 368-pixel artwork height and applies a power-1.8 curve. It clamps the target from 0 through 100 and shows the target percentage.

Bop sends at most one changed volume target every 150 ms. It sends the final target after 400 ms without movement. The percentage remains visible until 750 ms after the final update.

The UI gives immediate feedback after an accepted playback command. Volume feedback takes priority over delayed playback feedback. The next Spotify response corrects temporary play and volume state when necessary.

While WiFi is down, the UI shows `Connecting to WiFi...` at the top, over the player and the grid. The WiFi event handler starts a new connection attempt after every drop. A tap that needs Spotify sends nothing without WiFi: the player or the tapped cover shows a big WAIT, without dimming, until WiFi returns, and then nothing starts by itself. No command waits in a queue, and the Spotify task drops a command that waited more than 5 seconds for WiFi, so music never starts long after a tap. Volume drag stays off without WiFi.

The kept HTTPS connection to Spotify is dead after a WiFi drop, so the first request after it fails. A request that failed before it reached Spotify (connect or send) goes once more on a new connection. A GET or PUT also repeats after a failure before the response headers, because a repeat changes nothing; a skip is a POST and never repeats, since it could skip twice.

A touch, or a lift of the board, prepares the next tap, at most every 30 seconds: the radio stays awake for 30 seconds also on battery, the Spotify task renews an access token that would expire within 10 minutes, and it reads the play state at once.

When the network offers several access points with the same name, as a mesh does, Bop scans all channels and joins the strongest one, instead of the first one it hears.

AMOLED pixels age with the light they emit, so a still image burns in, and a still album cover during a long playback is the largest still image Bop shows. On any power source and during playback too, Bop counts idle time from the last touch or the last move of the board. After 30 seconds the screensaver replaces the screen: the time in a dim gray over black at 40 percent brightness, drifting 8 pixels a second and bouncing off the edges. After 2 minutes the display goes dark.

A touch or a move of the board brings back the screen at 85 percent brightness. A touch on the screensaver or on a dark display only wakes it and sends no command. The QMI8658 motion sensor (`main/motion.c`) reports a move: a task reads its accelerometer every 100 ms in low-power mode and counts a change of more than 0.1 g, summed over the three axes, against the last reference. That is a lift or a tilt of about 6 degrees; a board that lies still stays far below it. Without the sensor, only a touch wakes the screen.

The clock shows local time from the build setting `CONFIG_BOP_TIMEZONE`, a POSIX TZ string. The repository default is `UTC0`. Set the zone of your board in `firmware/sdkconfig.local.defaults`, which Git ignores and `tools/run_idf.py` adds after the other defaults, for example `CONFIG_BOP_TIMEZONE="CET-1CEST,M3.5.0,M10.5.0/3"`. Then delete `firmware/sdkconfig` and build again, because defaults reach only settings that the sdkconfig file does not hold yet. Until the time is synchronized, the screensaver is black.

Once a minute, the title, artist, progress bar, times, status labels, and the idle screen move by 2 pixels along a small loop. The album art stays in place, because it changes with every track and fills the display edge to edge.

The AXP2101 monitor also enables the fuel gauge and reads the battery percentage and the charging state every 5 seconds. A badge in the top-left corner shows the level while the board runs on battery or charges. It turns red at 15 percent or less on battery. The badge stays hidden when no battery is connected, and on USB power when the battery does not charge.

## Screen capture

`mise run screenshot -- <output.png>` saves the live Bop screen as a 368×448 PNG file.

The AMOLED panel is write-only, so the firmware cannot read pixels back from it. Instead, the display flush copies each completed rectangle into a PSRAM image of the screen. A USB serial task sends that image, with a header and a CRC, and the host tool writes the PNG.

Close `mise run monitor` before a capture. The capture needs the USB serial port for itself. The command refuses an output file that already exists.

The capture works in every screen state, including the provisioning screen. The serial task starts after the credential check on both provisioned and unprovisioned paths. The capture does not reset the board, and playback continues.

## mise tasks

Run `mise install` first. It installs the pinned host tools and then runs `mise run setup`.

| Command | Function |
| --- | --- |
| `mise run setup` | Installs or repairs the pinned ESP-IDF toolchain. |
| `mise run build` | Builds normal firmware in `firmware/build`. |
| `mise run build-perf` | Builds performance firmware in `firmware/build-perf`. |
| `mise run backup` | Backs up a credential-free 16 MB image. |
| `mise run restore` | Writes a checked credential-free image after explicit approval. |
| `mise run provision` | Authorizes Spotify and writes only Spotify values to NVS. |
| `mise run deprovision` | Opens Spotify access removal, then erases Bop credentials through USB. |
| `mise run flash` | Flashes normal firmware after a credential-free backup. |
| `mise run flash -- --force` | Flashes normal firmware and takes no backup. It warns in one line. |
| `mise run flash-perf` | Flashes performance firmware after a credential-free backup. |
| `mise run flash-perf -- --force` | Flashes performance firmware and takes no backup. |
| `mise run monitor` | Opens the normal-firmware serial monitor. |
| `mise run monitor-perf` | Opens the performance-firmware serial monitor. |
| `mise run screenshot -- <output.png>` | Saves the live Bop screen as a PNG file. |
| `mise run test-host` | Runs host-side checks without a board. |
| `mise run format` | Formats the host Python files with Ruff. |
| `mise run format-check` | Checks host Python formatting without changes. |
| `mise run lint` | Lints the host Python files with Ruff. |
| `mise run secrets` | Scans tracked files, branches, and tags for secrets. |
| `mise run licenses` | Checks license and copyright information. |
| `mise run clean` | Removes ESP-IDF build output. |
| `mise run menuconfig` | Opens the ESP-IDF configuration menu. |

A backup made before the first flash protects the factory image. A backup made after deprovisioning can contain Bop firmware. Do not run a full backup after provisioning.

`-- --force` skips the backup step only. No flag makes the backup command copy a provisioned board. A flash after `-- --force` leaves the board with no new factory image to restore from.

Read [INSTALL.md](../INSTALL.md) for the supported installation and recovery procedures. Read [docs/TROUBLESHOOTING.md](TROUBLESHOOTING.md) when a command stops.

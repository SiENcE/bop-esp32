# Troubleshooting

This guide covers common Bop problems. Read [INSTALL.md](../INSTALL.md) for the
supported installation and factory-restore procedures.

Bop is source-only software for personal experimentation. Read the
[source-only notice](../README.md#project-status) before you use it.

## The USB command cannot find the board

1. Connect the board with a USB data cable.
2. Run `mise install` if the host tools are not installed.
3. Disconnect other Espressif boards.
4. Run the command again.

Bop finds one connected Espressif USB serial port. If more than one board is
connected, set `BOP_PORT` to the port for this board. Do not set it to a
network address.

If the command still cannot find the board, try another USB data cable or USB
port. A charge-only cable cannot transfer data.

## The board does not enter download mode

1. Disconnect the USB cable.
2. Press and hold the BOOT button.
3. Connect the USB cable.
4. Release the BOOT button.
5. Run the USB command again.

Use these steps when automatic reset does not work. Read
[INSTALL.md](../INSTALL.md) before you run `mise run flash`.

## The factory backup stops with `Packet content transfer stopped`

esptool 5.3.1 loads a new flasher stub by default. On the ESP32-S3 USB
Serial/JTAG port of this board, that stub can stop every `read-flash` larger
than 16 KB. The backup then fails within the first few kilobytes:

```
A fatal error occurred: Packet content transfer stopped
backup failed: Command '[... 'read-flash', '0x0', '0x1000000', ...]' returned non-zero exit status 2.
```

The failure repeats at the same size every time. It also happens on a native
USB port, so the USB path is not the cause.

Select the legacy stub that esptool still ships, then run the backup again:

```
ESPTOOL_STUB_VERSION=1 mise run backup
```

In PowerShell, run `$env:ESPTOOL_STUB_VERSION = "1"` first. The legacy stub
reads at about 92 kbit/s, so the 16 MB backup takes about 25 minutes. The
backup keeps all of its checks. Only the transfer changes.

After `backups/factory.bin` and its SHA-256 file exist, `mise run flash` skips
the backup step and needs no setting. Flash writes are not affected.

## Use the board from WSL on Windows

Windows hardware installation is untested, as the
[support levels](../README.md#support-levels) state. These notes record one
working setup.

WSL has no direct USB access. [usbipd-win](https://github.com/dorssel/usbipd-win)
passes the board into the WSL virtual machine.

1. In an administrator terminal, run `usbipd list` and note the BUSID of the
   `303a:` device.
2. Run `usbipd bind --busid <BUSID>` once. The binding persists.
3. Open a WSL terminal and keep it open.
4. In a Windows terminal, run `usbipd attach --wsl --busid <BUSID> --auto-attach`.

The board then appears in WSL as `/dev/ttyACM0`. Your WSL user needs the
`dialout` group. `--auto-attach` attaches the board again after each reset,
which the flash and provisioning commands cause.

WSL stops its virtual machine soon after the last WSL process ends. That ends
the attachment. Keep a WSL terminal open while you use the board.

Flash writes, provisioning, and the serial log work through usbipd. Large
reads from the board do not: even with `ESPTOOL_STUB_VERSION=1`, a 256 KB read
fails with `Corrupt data`. Take the factory backup natively on Windows instead:

1. Run `usbipd detach --busid <BUSID>`. The board returns as a COM port.
2. Create a Python virtual environment outside the repository, and install
   the esptool version that `mise.toml` pins into it.
3. Put the environment's `Scripts` directory first on `PATH`, and set
   `ESPTOOL_STUB_VERSION=1`.
4. From the repository, run `python tools\backup_flash.py`.
5. Attach the board to WSL again.

The backup lands in the same `backups/` directory, so `mise run flash` in WSL
finds it.

A clone on a Windows drive, such as `/mnt/c/...`, works from WSL with two
settings. Windows Git checks files out with CRLF line endings, so Git in WSL
needs `core.autocrlf=true` for that clone, or it reports every file as
changed. A firmware build on a Windows drive is slow, because WSL reaches
those files through a network file system. A clean build took about 17
minutes.

## `mise run licenses` reports `AGENTS.md` on a Windows clone

`AGENTS.md` is a symbolic link to `CLAUDE.md`. Git for Windows checks out
symbolic links as small text files unless `core.symlinks` is enabled. REUSE
skips symbolic links, but it checks that text file and reports it as missing
license information.

The report comes from the checkout, not from the repository. CI checks a Linux
clone, where the link is intact. To fix the local clone, enable Windows
Developer Mode and run `git config core.symlinks true`. Then delete
`AGENTS.md` and run `git checkout -- AGENTS.md`.

## The captive portal does not open

1. Scan the QR code on the Bop screen.
2. Join the **Bop setup AP** that the screen shows.
3. If the page does not open, go to <http://192.168.4.1/>.
4. When the phone reports that the AP has no internet, keep the phone connected.

The Bop setup AP uses a new password after each restart. Use the current screen values.

## The captive portal reports a connection failure

The captive portal stays available after a failed join. It also clears the password field.

1. Select the network again.
2. Enter the WiFi password again.
3. Submit the form.

For a hidden network, select manual entry and enter the network name. Bop saves the values only after it receives an IP address.

## The captive portal marks a network as unsupported

The captive portal supports open, WPA2-Personal, and WPA3-Personal networks. It marks WEP and enterprise networks as unsupported.

Use a supported guest network or change the access-point security mode. Do not enter enterprise credentials through manual entry.

## A saved network is unavailable before USB provisioning

In the **WiFi-only state**, Bop tries the saved network for 15 seconds. It starts the captive portal when the attempt times out.

Restore the saved network, or use the captive portal to select a different network. Then run the USB provisioning command, `mise run provision`.

The USB provisioning command asks only for the Spotify Client ID. It keeps the WiFi values that the captive portal stored.

## The board shows `Connecting to WiFi...` or a big WAIT

The board lost the saved WiFi network and tries to connect again all the time.
The grid and every artist still open from the flash memory, but playing,
pausing, skipping, and volume need WiFi. A tap without WiFi shows a big WAIT
and sends nothing. Once WiFi returns, the hints go away; tap again.

1. Make sure that the WiFi network is available.
2. Make sure that the saved network name and password are correct.
3. If the values are wrong, run `mise run deprovision`, then use the captive portal to save new values and run `mise run provision` again.

`mise run provision` requires the legal agreement and a credential-free backup.
Read [INSTALL.md](../INSTALL.md) before you provision again.

## Time synchronization does not finish

The board synchronizes time with `pool.ntp.org` after it connects to WiFi. A
provisioned board repeats rounds of ten two-second attempts until the time
arrives, and the serial log shows `Time sync timed out; trying again` after
each failed round. Spotify starts only after the sync. Until then the library
grid shows `Loading your library...`.

1. Make sure that the WiFi connection works.
2. Make sure that the network can reach `pool.ntp.org`.
3. Restart the board.
4. Read the serial log if the problem continues.

## Spotify authorization does not finish

`mise run provision` needs your own Spotify Client ID. Do not enter a client
secret. Read [EULA.md](../EULA.md) and [PRIVACY.md](../PRIVACY.md) before you
enter `I AGREE`.

Make sure that the Spotify application contains the shown Redirect URI exactly.
By default, it is `http://127.0.0.1:43821/callback`.

If the browser does not open, open the URL that the provisioning command shows.
The command waits five minutes for Spotify to redirect to the host computer.

If port 43821 is unavailable, set `BOP_OAUTH_PORT` to an unused port. Add the
matching `http://127.0.0.1:<port>/callback` URI to the Spotify application.
Then run `mise run provision` again.

## The display says to start Spotify

Bop has no active Spotify player to control. Start Spotify playback on any
device that uses the authorized account. Then wait for Bop to poll Spotify.

Bop polls every 10 seconds while playback is active. It polls every 60 seconds
while playback is paused or idle. A newly active player can take up to 60
seconds to appear.

A paused player can still appear in Bop after Spotify returns playback state.
If no playback appears, make sure that WiFi and authorization work. Then read
the serial log.

## The library grid shows no pictures

The grid shows a message for a parent when it has nothing to show.

- `Follow artists or save albums in Spotify to show them here.`: the account
  follows no artist and has no saved album. Follow an artist or save an album
  in the Spotify app.
- `The library could not be loaded.`: Spotify refused or failed the request.
  Read the serial log.
- `The albums could not be loaded.`: the albums of the opened artist failed,
  and no stored list exists yet. Tap the arrow, then open the artist again.
- `Loading albums...` that stays: the artist has no stored list yet, and WiFi
  is down. Bop stores every followed artist's list in the background soon
  after it starts, so this happens only on a new artist.
- `This artist has no albums.`: the artist has only singles, compilations, or
  appearances, which Bop does not list.

Kid mode needs the `user-library-read` and `user-follow-read` permissions. A
board provisioned before kid mode has a refresh token without them. The
library then fails, and the serial log shows `Library request failed` with the
HTTP status. Run `mise run provision` again and approve the new permissions.

A change in the library appears after Bop reads it again: when the grid opens,
at most every half hour, or within three hours. A new album of a followed
artist appears within a week. Restart Bop to see a change at once.

## A cover tap shows a muted speaker

Bop found no Spotify device to play on. Bop is a remote and plays no sound.
Open Spotify on a speaker, phone, or tablet of the same account, or turn on a
Spotify Connect speaker. Then tap the cover again.

## The playing album shows no pause mark

The mark shows on the cover of an album that plays as a whole: an album
started from the grid, or started as an album in the Spotify app. A track that
plays from a playlist, a search, or a radio has no album context. Bop then
compares the album of the track itself, which Spotify can report as another
version of the same album, so the mark can be missing. A tap on the cover then
starts the album from its first track.

## Other music plays after an album ends

Spotify Autoplay continues with similar music after an album. The Web API
cannot turn it off. Turn off **Autoplay** in the Spotify settings of the
playing device.

## Spotify rate limiting delays playback updates

Spotify can return a rate limit. Bop waits for a positive numeric delay from
Spotify. It waits for 60 seconds when Spotify sends no valid delay.

Bop stops polling during the cooldown. It rejects new normal playback
commands. An affected tap shows a warning. Bop keeps only the newest volume
target and retries it after the cooldown.

Wait for Bop to resume polling. More input does not bypass the cooldown. Read
the serial log if rate limits happen often. It shows
`Spotify rate limit: requests pause for N s`.

A rate limit on the library or on artist lists pauses only those lists, and
the log shows `Spotify rate limit on artist lists: they pause for N s`.
Playback and taps keep working, and stored artists still open. An artist
without a stored list shows `The albums could not be loaded.` until the pause
ends, which Spotify can set to many hours.

## Volume drag does not change the active player

Bop enables volume drag when Spotify returns `device.volume_percent` as an
integer from 0 through 100. Bop ignores `device.supports_volume` and sends the
request when that value is valid.

Drag at least 48 pixels in a mostly vertical direction. The target percentage
must appear on the artwork. If no percentage appears, read the serial log and
confirm that playback state is available.

Spotify can reject the request after Bop shows the target. The serial log then
shows `Volume command failed`. The next playback poll restores the volume that
Spotify reports.

## Album art does not appear

Bop downloads album art only after it receives an active track with an artwork
URL. Make sure that the track title and artist appear first.

1. Make sure that the board is online.
2. Wait at least five seconds for a failed download or decode to retry.
3. Change to another track to request its artwork.
4. Read the serial log if art still does not appear.

The log can show an album-art download, JPEG, decode, or memory error.

## The screen shows a clock or goes dark

This protects the AMOLED panel against burn-in. After 30 seconds without a
touch or a move of the board, a dim clock drifts over a black screen, also
while music plays. After 2 minutes the screen goes dark. Touch the screen, or
pick up or tilt the board, to wake it. The first touch only wakes the screen
and sends no command.

Until the board has synchronized its time, the screensaver stays black.

## The screen does not wake when the board is picked up

The serial log shows `QMI8658 motion sensor at 0x6B` (or `0x6A`) at startup
when the motion sensor works. `Motion sensor is unavailable` means that only a
touch wakes the screen. A move counts when it changes the acceleration by more
than 0.1 g, about a tilt of 6 degrees, so a very slow or small move can stay
below it. Touch the screen instead.

A bump against the table or a hard tap can also count as a move and wake the
screen. This is expected.

## The screensaver clock shows the wrong time

The clock shows UTC unless the firmware was built with your time zone. Set
`CONFIG_BOP_TIMEZONE` in `firmware/sdkconfig.local.defaults`, delete
`firmware/sdkconfig`, and run `mise run flash`, as
[INSTALL.md](../INSTALL.md) describes. A fixed offset such as `<+01>-1` does
not follow summer time; a rule such as `CET-1CEST,M3.5.0,M10.5.0/3` does.

## The microSD card is not used

Bop looks for the card only when it starts. The serial log then shows one of
these lines:

- `SD card log: /sdcard/bop/log.txt`: the card works.
- `No SD card; the log stays on the serial port`: Bop found no card. Switch the
  board off, insert the card fully, and switch it on.
- `SD card has no FAT32 file system`: format the card as FAT32 on a computer.
  Bop never formats a card and does not read exFAT, the usual format of cards
  larger than 32 GB.
- `SD card write failed; the card stays unused until a restart`: the card was
  removed or failed while Bop ran. Restart the board with the card inserted.

Without a card Bop works the same, with the log on the serial port only.

## The display is blank or does not start

Disconnect and reconnect USB power. If the problem continues, enter download
mode and run `mise run flash`.

The flash task takes a factory backup first, and the backup command refuses a
provisioned board. If the board holds credentials and `backups/factory.bin`
does not exist, that task stops. Run `mise run flash -- --force` to flash
without a backup.

CAUTION: `mise run flash -- --force` takes no factory backup. If no valid
backup exists, you cannot restore the board to its shipped state after this
flash.

If flashing does not correct the fault, use the factory-restore procedure only
when you have a valid backup. A restore overwrites all 16 MB of flash. Read
[INSTALL.md](../INSTALL.md) before you restore.

## Read the serial log

1. Connect the board with a USB data cable.
2. Run `mise run monitor`.
3. Reproduce the problem.
4. Press Ctrl+C to stop the monitor.

With a FAT32 microSD card in the board when it starts, Bop also writes the log
to `bop/log.txt` on the card. `log1.txt` to `log9.txt` hold earlier runs. Read
the card in a computer after you switch the board off. The card log keeps
Bop's lines and every warning and error, but not the informational lines of
ESP-IDF. A crash report appears only on the serial port. Read
[The microSD card is not used](#the-microsd-card-is-not-used) when the card
stays empty.

The log can show WiFi connection, time synchronization, Spotify, album-art,
and display messages. Read [SECURITY.md](../SECURITY.md) before you share a
log. Do not share credentials, refresh tokens, WiFi passwords, or flash images.

## Restore the factory image

Use `mise run restore` only with `backups/factory.bin` and its SHA-256 file.
The command refuses an invalid image or an image with Bop credential keys.

1. Remove Bop access from <https://www.spotify.com/account/apps/>.
2. If the Bop firmware starts, run `mise run deprovision` first.
3. Connect the board with a USB data cable.
4. Run `mise run restore`.
5. Type `RESTORE`, followed by the shown MAC address, exactly.

If Bop does not start, do not run `mise run deprovision`. Use the Spotify page to
remove access. Then run `mise run restore` with the valid backup.

CAUTION: A restore overwrites all flash contents. You cannot undo this action.

A backup from before the first Bop flash can restore the shipped board state.
A backup made after deprovisioning can restore Bop with erased credentials.
It cannot restore the shipped firmware.

If a restore stops after writing begins, do not use the board. Run
`mise run restore` again. Read [INSTALL.md](../INSTALL.md) for the complete
factory-restore procedure.

## Related documents

- [README.md](../README.md) has the source-only notice and support levels.
- [INSTALL.md](../INSTALL.md) has installation, removal, and recovery steps.
- [docs/HOW-IT-WORKS.md](HOW-IT-WORKS.md) explains the firmware and `mise` tasks.
- [CONTRIBUTING.md](../CONTRIBUTING.md) explains the change and review process.
- [SECURITY.md](../SECURITY.md) explains credential risks and private reports.
- [PRIVACY.md](../PRIVACY.md) explains data use and deletion.
- [EULA.md](../EULA.md) gives the terms for Bop use.
- [THIRD_PARTY_LICENSES.md](../THIRD_PARTY_LICENSES.md) lists included licenses.

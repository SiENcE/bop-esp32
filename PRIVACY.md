# Bop Privacy Policy

Last updated: November 25, 2026

## Summary

Bop runs on your computer during provisioning and on your ESP32-S3 device after provisioning. Bop has no Bop-operated server.

By using Bop, you agree to the collection and use described in this policy. The [End User License Agreement](EULA.md) also applies.

## Data Bop accesses

During captive-portal setup, Bop asks for your WiFi network name and password.

The USB provisioning command, `mise run provision`, asks for:

- Your Spotify application client ID.
- A Spotify refresh token after you approve Spotify authorization.

While Bop runs, it uses the refresh token to request an access token. It requests your current playback state and can send playback-control requests. This can include a track title, artist names, album artwork, track identifier, playback position, and active-device volume.

For kid mode, Bop reads the artists you follow and the albums you saved, and the albums of an artist that a child opens. It keeps only their identifiers and the address of one picture each. To start an album when no device is active, it reads your list of Spotify devices.

## Where data stays and why Bop uses it

The captive portal receives the WiFi values from your phone through the WPA2-protected Bop setup AP. The page uses local HTTP.

The firmware keeps the submitted values in bounded memory buffers. It does not log the password or return it in an HTTP response.

After Bop verifies the network, it stores the WiFi values in the device NVS partition. It clears the request and decoded password buffers.

The USB provisioning command keeps the Spotify Client ID and refresh token in bounded host buffers. It sends them through a versioned, length-delimited USB frame.

The USB write changes only the Spotify values. Bop keeps the WiFi values from the captive portal.

Bop keeps current playback information, the kid-mode library lists and pictures, and its access token in device memory while it runs. So that the library shows at once after a restart, Bop also stores the identifiers of your followed artists and saved albums, the identifiers of the albums of each followed artist, and their pictures, in a cache partition of the device flash. The cache holds no credential. Bop erases it whenever the device starts without full credentials, for example after `mise run deprovision`.

With a microSD card in the device, Bop also writes its log to the card, and the grid pictures that no longer fit the flash cache. The log names the tracks and episodes that played and, during setup, the WiFi network name. It never holds a password, token, or client ID. Anyone who takes the card can read it. Bop deletes the pictures and the logs of earlier runs from the card whenever the device starts without full credentials. Remove the card before you give the device away, or erase the `bop` folder on it.

Bop uses these values only to connect the device to WiFi, request Spotify playback information, show that information, and send the playback commands that you select. Bop does not sell data, send data to an advertising service, or use a Bop-operated server.

Bop sends the authorization request to Spotify. After authorization, the device sends Spotify API requests. Spotify processes these requests under its own terms and privacy policy. Bop does not send data to another processor.

## Cookies

Bop does not use cookies. Bop does not let third parties place cookies in your browser. Bop does not provide cookie-management controls.

The Spotify authorization page is a Spotify page. Spotify can use its own browser technologies under Spotify's policies.

## Disconnect and deletion

You can remove Bop access from the Spotify connected-apps page: <https://www.spotify.com/account/apps/>.

Then connect the device by USB and run `mise run deprovision`. The command checks the Bop firmware and partition layout. It opens the connected-apps page and requires `REMOVED` after you remove Bop access.

The command shows the USB port and device MAC address. It requires `ERASE`, followed by that MAC address, before it erases data.

The command erases the complete Bop NVS credential partition through USB. It reads the partition in memory after the erase. It does not print or save credentials. It stops if a credential key or data remains. After a successful read-back, it restarts the device in provisioning mode.

Do not give or sell a device before you erase its Bop NVS partition. A person with physical access to the device can read the stored credentials.

## Contact

For a question, correction, deletion request, or other privacy inquiry, open an issue at <https://github.com/markphelps/bop-esp32/issues>. Do not include credentials, tokens, WiFi passwords, or other private data in an issue.

## Changes

The maintainer can update this policy when Bop changes. Read the current copy before you authorize Bop.

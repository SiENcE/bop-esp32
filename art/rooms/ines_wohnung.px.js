// ines_wohnung baked from its map (art/rooms/ines_wohnung.map.js) with its kit (art/kit/ines_wohnung.kit.px.js) and the light
// (art/lib/isokit.js); made by tools/new-room.mjs. More kits: include them below (their pieces show in the Iso tab's lists).
//
// Exports (the atlas takes ines_wohnung_* only): ines_wohnung_bg (320x180) and a sprite for each prop, outlined, pivot bottom-centre.
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/ines_wohnung.map.js")
include("../lib/isokit.js")
include("../kit/ines_wohnung.kit.px.js", { palette: true })

// The view from the balcony (the user's wish, 2026-11-18), painted where the bake leaves the picture empty beyond the balcony's railing:
// the night sky lit from above by the Crown, the roofs of the Ninth stepping down, the flood beyond them, and on its far side the swamp,
// the drowned forest as a dark band, two green lights in it (Lantern's antennas; nobody knows yet). Rain falls through it. PAINTED (2026-11-18)
// on the lines of the approved block, as the look over the railing (art/ui/look_balkon.px.js) shows it close.
const IW_VIEW = (c) => {
  const f = c.frame ?? 0, B = INES_WOHNUNG.BG[f], [W, H] = ISO_MAPS.ines_wohnung.screen, X0 = 360, bay = ISO.bay, ih = ISO.ihash
  const back = (x) => 86 + (x - 160) / 2                                                    // the balcony's back edge (v 0) on the screen
  const crown = (x) => 129 - Math.round(ih(x >> 1, 7) * 3 + Math.sin(x / 5) * 1.5)           // the drowned forest's crowns against the haze
  const roof = (x) => (x < X0 + 22 ? 160 : x < X0 + 41 ? 166 : x < X0 + 58 ? 157 : 163)      // the roofs of the Ninth stepping down
  for (let y = 0; y < H; y++) for (let x = X0; x < W; x++) {
    if (B.k[y * W + x]) continue
    let k
    if (y > back(x)) k = (x * 5 + y * 11) % 47 === 0 ? "P" : y % 7 === 0 ? "e" : "k"            // below the balcony: the street far down
    else if (y >= roof(x)) {
      const top = roof(x)
      k = y === top ? "4" : (x % 6 === 2 && (y - top) % 7 === 3 && ih(x, y) < 0.35) ? (ih(y, x) < 0.6 ? "Q" : "C") : "2"   // a window lit here and there
      if (x === X0 + 49 && y < top && y > top - 9) k = "4"                                  // an antenna
    }
    else if (y >= 138) {                                                                     // the water: dark, the lights lying on it in streaks
      k = (x * 3 + y * 7) % 23 === 0 ? "t" : y % 3 === 0 ? "f" : "e"
      if (y % 3 === 1 && (Math.abs(x - X0 - 20) < 1 || Math.abs(x - X0 - 47) < 1)) k = "ĝ"
      if (y % 3 === 1 && Math.abs(x - X0 - 33) < 1 && (y + f) % 6 < 3) k = "M"
    }
    else if (y >= crown(x)) k = y === crown(x) ? "2" : "k"
    else {                                                                                   // the sky: low clouds, the Crown's glow from above, the haze low over the water
      const glow = Math.max(0, 1 - y / 70), haze = y > 100 ? (y - 100) / 40 : 0
      k = bay(x, y) < glow * 0.55 ? "U" : bay(x, y) < 0.18 + glow * 0.4 + haze ? "u" : "1"
    }
    if (y >= 131 && y <= 132 && (x === X0 + 20 || x === X0 + 47)) k = "Ĝ"                   // two green lights in the swamp
    if ((x * 7 + y * 3 + f * 5) % 61 === 0) k = "6"                                         // rain
    c.px(x, y, k)
  }
}
const INES_WOHNUNG = ISOKIT.bake(ISO_MAPS.ines_wohnung, { id: "ines_wohnung", frames: 12, fps: 10, glows: [IW_VIEW] })

// the measured numbers for the game: tools/build_art.sh picks this line up and writes game/rooms/ines_wohnung.layout.js
console.log("ISO_LAYOUT " + JSON.stringify({ id: "ines_wohnung", ...INES_WOHNUNG.layout }))

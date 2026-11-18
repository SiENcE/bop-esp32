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
// the drowned forest as a dark band, two green lights in it (Lantern's antennas; nobody knows yet). Rain falls through it. BLOCKS.
const IW_VIEW = (c) => {
  const f = c.frame ?? 0, B = INES_WOHNUNG.BG[f], [W, H] = ISO_MAPS.ines_wohnung.screen, X0 = 360
  const back = (x) => 86 + (x - 160) / 2                                                    // the balcony's back edge (v 0) on the screen
  for (let y = 0; y < H; y++) for (let x = X0; x < W; x++) {
    if (B.k[y * W + x]) continue
    let k
    if (y > back(x)) k = (x * 5 + y * 11) % 47 === 0 ? "P" : y % 7 === 0 ? "e" : "k"            // below the balcony: the street far down
    else if (y < 128) k = y < 70 ? "k" : ISO.bay(x, y) < (y - 70) / 70 ? "u" : "1"              // the sky, the city's glow low over the water
    else if (y < 138) k = y < 131 + Math.round(ISO.ihash(x >> 1, 7) * 4) ? "1" : "k"            // the swamp: the drowned forest's crowns
    else if (y < 158) k = (x + y * 3) % 11 === 0 ? "t" : "e"                                     // the water
    else k = x % 4 === 1 && y % 5 === 2 && ISO.ihash(x, y) < 0.25 ? "Q" : ISO.ihash(x >> 4, y >> 3) < 0.5 ? "3" : "2"   // the roofs of the Ninth below, a window lit here and there
    if (y >= 132 && y <= 133 && (x === X0 + 20 || x === X0 + 47)) k = "Ĝ"                       // two green lights in the swamp
    if (y === 142 && (x === X0 + 20 || x === X0 + 47)) k = "ĝ"                                  // and on the water
    if ((x * 7 + y * 3 + f * 5) % 61 === 0) k = "6"                                             // rain
    c.px(x, y, k)
  }
}
const INES_WOHNUNG = ISOKIT.bake(ISO_MAPS.ines_wohnung, { id: "ines_wohnung", frames: 12, fps: 10, glows: [IW_VIEW] })

// the measured numbers for the game: tools/build_art.sh picks this line up and writes game/rooms/ines_wohnung.layout.js
console.log("ISO_LAYOUT " + JSON.stringify({ id: "ines_wohnung", ...INES_WOHNUNG.layout }))

// Kowalski Street baked from its map (art/rooms/kowalski.map.js) with its kit (art/kit/kowalski.kit.px.js)
// and its light (art/lib/isokit.js). PLAN H3. 416 px wide: the room scrolls.
//
// Exports (the atlas takes kowalski_* only):
//   kowalski_bg       416x180, a 12-frame loop at 10 fps: the ad screen's static and its glitch, the Y of
//                     LUCKY STATIC stuttering, rain rings in the puddles, the rain on the Kessel Block's door
//   kowalski_vending, kowalski_cart, kowalski_bins, kowalski_lights   the props, pivot bottom-centre
//                     (the string lights without an outline)
// KOWALSKI.layout has the measured numbers (tools/iso-layout.mjs writes the same for the game).
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/kowalski.map.js")
include("../lib/isokit.js")
include("../kit/kowalski.kit.px.js", { palette: true })

const KOWALSKI = ISOKIT.bake(ISO_MAPS.kowalski, {
  id: "kowalski", frames: 12, fps: 10,
  // the puddles mirror the neon, the screen and the bar's windows
  sheen: { reach: 3.2, map: ISO.MIRROR, keys: (u, v) => KOW.inPuddle(u, v) },
  glows: [glow("m", { r: 5, strength: 0.45 }), glow("vV", { r: 4, strength: 0.3 }), glow("RW", { r: 4, strength: 0.35 }), glow("q", { r: 3, strength: 0.6 })],
})

console.log("ISO_LAYOUT " + JSON.stringify({ id: "kowalski", ...KOWALSKI.layout }))

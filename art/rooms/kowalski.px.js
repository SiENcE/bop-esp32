// Kowalski Street baked from its map (art/rooms/kowalski.map.js) with its kit (art/kit/kowalski.kit.px.js)
// and its light (art/lib/isokit.js). PLAN H3. 416 px wide: the room scrolls.
//
// Exports (the atlas takes kowalski_* only):
//   kowalski_bg       416x180, a 12-frame loop at 10 fps: the ad screen's static and its glitch, the Y of
//                     LUCKY STATIC stuttering (its magenta dips with it), rain rings in the puddles and
//                     splashes on the street, the rain on the Kessel Block's door, steam from Bao's pot and
//                     out of the drain
//   kowalski_vending, kowalski_cart, kowalski_umbrella, kowalski_bins, kowalski_lights   the props, pivot
//                     bottom-centre (the string lights and cables without an outline)
// KOWALSKI.layout has the measured numbers (tools/iso-layout.mjs writes the same for the game).
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/kowalski.map.js")
include("../lib/isokit.js")
include("../kit/kowalski.kit.px.js", { palette: true })

const KW_MAP = ISO_MAPS.kowalski, KW_P = ISOMAP.projector(KW_MAP)
// rain splashing on the street: a few crowns a frame, only on the floor
const kwSplashes = (c) => {
  const f = c.frame ?? 0, r = c.rng(40 + f), [W, H] = KW_MAP.screen
  for (let i = 0; i < 40; i++) {
    const x = Math.floor(r() * W), y = Math.floor(r() * H), [u, v] = KW_P.uvAt(x, y)
    if (u < 0.15 || v < 0.15 || u > 7 || v > 6 || KOW.cellAt(u, v) === ".") continue
    c.px(x, y, "6"); c.px(x - 1, y - 1, "x"); c.px(x + 1, y - 1, "x")
  }
}
// steam from Bao's pot (behind the umbrella it goes out of sight) and out of the drain
const kwSteam = (c) => {
  const f = c.frame ?? 0, [px, py] = KW_P.P(2.95, 2.3, 1.22), [gx, gy] = KW_P.P(4.75, 1.25, 0)
  c.plume(px, py, "HhZ", { every: 3, life: 24, rise: 20, wind: -0.15, size: [2, 4], seed: 3, frame: f })
  c.plume(gx, gy, "hZz", { every: 3, life: 24, rise: 26, wind: -0.3, size: [1, 4], seed: 7, frame: f })
}

const KOWALSKI = ISOKIT.bake(KW_MAP, {
  id: "kowalski", frames: 12, fps: 10,
  // the wet street shines: the puddles mirror the neon, the screen and the bar's windows; the rest takes a sheen
  sheen: { reach: 3.4, map: (u, v) => (KOW.inPuddle(u, v) ? ISO.MIRROR : ISO.SHEEN), keys: (u, v) => KOW.cellAt(u, v) !== "." },
  glows: [kwSplashes, kwSteam, glow("m", { r: 5, strength: 0.45 }), glow("vV", { r: 4, strength: 0.3 }), glow("RW", { r: 4, strength: 0.35 }), glow("q", { r: 3, strength: 0.6 })],
})

console.log("ISO_LAYOUT " + JSON.stringify({ id: "kowalski", ...KOWALSKI.layout }))

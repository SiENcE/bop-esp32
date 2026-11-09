// The alley baked from its map (art/rooms/gasse.map.js) with its kit (art/kit/gasse.kit.px.js) and the light (art/lib/isokit.js).
//
// Exports (the atlas takes gasse_* only): gasse_bg (320x290, it scrolls; 12 frames: the water rippling, the dryers' steam out of the vent) and a
// sprite for each prop standing in the alley, outlined, pivot bottom-centre.
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/gasse.map.js")
include("../lib/isokit.js")
include("../kit/gasse.kit.px.js", { palette: true })

const GS_P = ISOMAP.projector(ISO_MAPS.gasse)
// the dryers' warm, wet air out of the vent, drifting up into the rain
const gsSteam = (c) => {
  const f = c.frame ?? 0, [x, y] = GS_P.P(5.45, 0, 2.42)
  c.plume(x, y, "hZz", { every: 3, life: 24, rise: 22, wind: -0.2, size: [1, 4], seed: 5, frame: f })
}
// Under the balcony: the quay wall going down from the deck's edge, on the near left the cut through the deck, and below both the water
// at GS_WATER (meters, under the deck), mirroring what stands over it: each water pixel takes the picture's pixel as far above the
// waterline as it lies below it, a darker tone of it, the rows rippling sideways; rings where the rain falls in. Only where the bake
// left the picture empty.
const GS_WATER = -0.8
const GS_MIRROR = { ...ISO.MIRROR, K: "L", L: "J", J: "F", F: "E", E: "e", 1: "e", e: "e", f: "e", z: "f", Z: "z", X: "Z", i: "n", I: "i",
  h: "g", H: "h", g: "2", G: "g", a: "e", A: "a", u: "e", U: "u", k: "e" }
const gsWater = (c) => {
  const f = c.frame ?? 0, B = GASSE.BG[f], [W, H] = ISO_MAPS.gasse.screen, [CX, CY] = ISO_MAPS.gasse.at, U = 6, V = 4, D = -GS_WATER * 30
  const r = c.rng(90 + f)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (B.k[y * W + x]) continue
    // the quay wall under the near right edge (u = U), facing the viewer's right
    const vq = U - (x - CX) / 32, hq = (CY + 16 * (U + vq) - y) / 30
    if (vq >= 0 && vq <= V && hq <= 0 && hq >= GS_WATER) { c.px(x, y, hq < GS_WATER + 0.25 ? "E" : (Math.floor(vq * 4) % 3 === 0 ? "2" : "3")); continue }
    // the cut through the deck on the near left (v = V), facing the viewer's left
    const us = (x - CX) / 32 + V, hs = (CY + 16 * (us + V) - y) / 30
    if (us >= 0 && us <= U && hs <= 0 && hs >= GS_WATER) { c.px(x, y, hs < GS_WATER + 0.25 ? "E" : hs > -0.35 ? "2" : "1"); continue }
    // the water: where it meets the wall above it on this column, and the picture mirrored about that line
    const yq = vq >= 0 && vq <= V ? CY + 16 * (U + vq) + D : CY + 16 * (us + V) + D
    if (y < yq) continue
    // first the wall itself, dark, as tall in the water as it stands over it; then what stands on the deck, mirrored about its edge
    const dy = y - yq, sx = Math.round(x + Math.sin((y + f * 2) * 0.7) * (1 + dy / 30))
    if (dy < D) { c.px(x, y, (sx + y + f) % 9 === 0 ? "E" : "1"); continue }
    const my = Math.round(yq - D - (dy - D))
    const k = sx >= 0 && sx < W && my >= 0 ? B.k[my * W + sx] : null
    c.px(x, y, (k && GS_MIRROR[k]) || ((x + y * 3 + f) % 23 === 0 ? "f" : "e"))
  }
  for (let i = 0; i < 14; i++) { const x = Math.floor(r() * W), y = 170 + Math.floor(r() * (H - 170)); if (!B.k[y * W + x]) { c.px(x - 1, y, "4"); c.px(x + 1, y, "4"); c.px(x, y - 1, "3") } }
}
const GASSE = ISOKIT.bake(ISO_MAPS.gasse, { id: "gasse", frames: 12, fps: 10, glows: [gsWater, gsSteam] })

// the measured numbers for the game: tools/build_art.sh picks this line up and writes game/rooms/gasse.layout.js
console.log("ISO_LAYOUT " + JSON.stringify({ id: "gasse", ...GASSE.layout }))

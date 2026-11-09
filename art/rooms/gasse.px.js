// The alley baked from its map (art/rooms/gasse.map.js) with its kit (art/kit/gasse.kit.px.js) and the light (art/lib/isokit.js).
//
// Exports (the atlas takes gasse_* only): gasse_bg (416x236, it scrolls both ways; 12 frames: the water rippling, the dryers' steam out of the vent) and a
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
// Under the balcony: the quay wall going down from the deck's near right edge, and below it the water at GS_WATER (meters, under the
// deck), mirroring what stands over it: first the wall itself, dark, as tall in the water as it stands over it, then the picture's
// pixel as far above the deck's edge as this one lies below the wall's reflection, a darker tone of it, the rows rippling sideways;
// rings where the rain falls in. Only where the bake left the picture empty.
const GS_WATER = -0.8
const GS_MIRROR = { ...ISO.MIRROR, K: "L", L: "J", J: "F", F: "E", E: "e", 1: "e", e: "e", f: "e", z: "f", Z: "z", X: "Z", i: "n", I: "i",
  h: "g", H: "h", g: "2", G: "g", a: "e", A: "a", u: "e", U: "u", k: "e" }
const gsWater = (c) => {
  const f = c.frame ?? 0, B = GASSE.BG[f], [W, H] = ISO_MAPS.gasse.screen, [CX, CY] = ISO_MAPS.gasse.at, [U, V] = ISO_MAPS.gasse.size, D = -GS_WATER * 30
  const r = c.rng(90 + f)
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (B.k[y * W + x]) continue
    // the quay under the near right edge (u = U)
    const vq = U - (x - CX) / 32, right = vq >= 0 && vq <= V, hw = right ? (CY + 16 * (U + vq) - y) / 30 : null
    if (hw !== null && hw <= 0 && hw >= GS_WATER) { c.px(x, y, hw < GS_WATER + 0.2 ? "E" : Math.floor(vq * 4) % 3 === 0 ? "1" : "2"); continue }
    if (hw === null || hw > 0) continue
    const yq = y + hw * 30 - GS_WATER * 30 - D, dy = y - (yq + D)
    const sx = Math.round(x + Math.sin((y + f * 2) * 0.7) * (1 + dy / 30))
    if (dy < D) { c.px(x, y, (sx + y + f) % 9 === 0 ? "E" : "k"); continue }
    const my = Math.round(yq - (dy - D))
    const k = sx >= 0 && sx < W && my >= 0 ? B.k[my * W + sx] : null
    c.px(x, y, (k && GS_MIRROR[k]) || ((x + y * 3 + f) % 23 === 0 ? "f" : "e"))
  }
  for (let i = 0; i < 16; i++) { const x = Math.floor(r() * W), y = 160 + Math.floor(r() * (H - 160)); if (!B.k[y * W + x]) { c.px(x - 1, y, "3"); c.px(x + 1, y, "3"); c.px(x, y - 1, "2") } }
}
const GASSE = ISOKIT.bake(ISO_MAPS.gasse, { id: "gasse", frames: 12, fps: 10, glows: [gsWater, gsSteam] })

// the measured numbers for the game: tools/build_art.sh picks this line up and writes game/rooms/gasse.layout.js
console.log("ISO_LAYOUT " + JSON.stringify({ id: "gasse", ...GASSE.layout }))

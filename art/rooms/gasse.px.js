// The alley baked from its map (art/rooms/gasse.map.js) with its kit (art/kit/gasse.kit.px.js) and the light (art/lib/isokit.js).
//
// Exports (the atlas takes gasse_* only): gasse_bg (416x236, it scrolls both ways; 12 frames: the water rippling, the dryers' steam out of the vent) and a
// sprite for each prop standing in the alley, outlined, pivot bottom-centre; gasse_papierboot (Chapter 2, at the monument).
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/gasse.map.js")
include("../lib/isokit.js")
include("../kit/gasse.kit.px.js", { palette: true })

const GS_P = ISOMAP.projector(ISO_MAPS.gasse)
// the dryers' warm, wet air out of the vent, drifting up into the rain; and steam out of the drain in the deck (the user's wish)
const gsSteam = (c) => {
  const f = c.frame ?? 0, [x, y] = GS_P.P(5.45, 0, 2.42), [gx, gy] = GS_P.P(4.75, 1.75, 0)
  c.plume(x, y, "hZz", { every: 3, life: 24, rise: 22, wind: -0.2, size: [1, 4], seed: 5, frame: f })
  c.plume(gx, gy, "hZz", { every: 2, life: 24, rise: 30, wind: -0.25, size: [2, 5], seed: 9, frame: f })
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
// the wet deck shines: the puddles mirror the lights, the rest of the paving takes a faint sheen
const gsCell = (u, v) => ISO_MAPS.gasse.floor[Math.floor(v / 0.5)]?.[Math.floor(u / 0.5)] ?? "."
const GASSE = ISOKIT.bake(ISO_MAPS.gasse, { id: "gasse", frames: 12, fps: 10, glows: [gsWater, gsSteam],
  sheen: { reach: 3.0, map: (u, v) => (KIT_GASSE.inPuddle(u, v) ? ISO.MIRROR : ISO.SHEEN), keys: (u, v) => gsCell(u, v) !== "." } })

// The ad screen on the left wall: three ads of the Lower Ninth (no Lull: tide mods, buying up the flood debt, an arcade game), each
// for ten frames at 3 fps, a glitch where one changes to the next; drawn flat and laid onto the wall's slope pixel by pixel as the bake
// lays an opening (wall 1: from the screen's left end, h from the foot), so it sits on the opening "ad" (game/kapitel1.js shows it)
{
  const AD = ISO_MAPS.gasse.openings.find((o) => o.id === "ad"), [CX, CY] = ISO_MAPS.gasse.at, BOX = GASSE.layout.openings.ad
  const AW = Math.round((AD.to - AD.from) * 32), AH = Math.round((AD.h[1] - AD.h[0]) * 30), M = Math.floor(AW / 2)
  const T = (r, y, s, k) => TXT.draw(r, M, y, s, k, { font: "hud", align: "center" })
  const ADS = [
    (r) => { r.rect(0, 0, AW, AH, "n"); T(r, 3, "TIDE", "m"); T(r, 9, "MODS", "m")
      r.grid(M - 6, 18, ["..vvvvv.....", ".vvvvvvv..v.", "vvkvvvvvvvv.", ".vvvvvvv..v.", "..vvvvv....."]); T(r, 27, "GILLS", "N"); T(r, 35, "-40%", "Q") },
    (r) => { r.rect(0, 0, AW, AH, "c"); T(r, 4, "FLOOD", "V"); T(r, 10, "DEBT?", "V"); r.hline(4, 18, AW - 8, "C"); T(r, 22, "WE", "Q"); T(r, 28, "BUY IT", "Q"); T(r, 37, "CALL", "v") },
    (r) => { r.rect(0, 0, AW, AH, "O"); T(r, 3, "SUMP", "R"); T(r, 9, "RUNNER", "R")
      r.grid(M - 3, 17, ["..yy..", "..yy..", ".yyyy.", "y.yy.y", "..yy..", ".y..y.", "y....y"]); r.hline(2, 25, AW - 4, "P"); T(r, 29, "3", "W"); T(r, 36, "CHITS", "W") },
  ]
  anim("gasse_ad", { w: BOX[2], h: BOX[3], frames: 30, fps: 3 }, (c) => {
    const f = c.frame ?? 0, ad = Math.floor(f / 10) % 3, R = ISOKIT.raster(AW, AH, (r) => {
      ADS[ad](r)
      if (f % 10 === 0) for (let y = 0; y < AH; y += 3) for (let x = 0; x < AW; x++) if ((x * 7 + y * 13 + f) % 5 === 0) r.px(x, y, "V")      // the change, a glitch
    })
    for (let y = 0; y < BOX[3]; y++) for (let x = 0; x < BOX[2]; x++) {
      const X = BOX[0] + x, Y = BOX[1] + y, v = (CX - X - 0.5) / 32
      if (v < AD.from || v >= AD.to) continue
      const h = (CY + 16 * v - Y - 0.5) / 30
      if (h < AD.h[0] || h >= AD.h[1]) continue
      const k = R(Math.floor((AD.to - v) * 32), Math.floor((h - AD.h[0]) * 30))
      if (k) c.px(x, y, k)
    }
  }, glow("mNvV", { r: 3, strength: 0.3 }))
}

// Chapter 2 (kapitel2-design §9.1; the approved block in art/test/k2_orte_blocks.px.js): a paper boat among the candles at the monument's
// foot, bigger and whiter than the others, folded from a clean sheet, a candle in it like the others; I. written on its side, too small to read (the look says it). Its
// left side takes the candles' warm light, its right turns away; its shadow under it on the wet deck. The game stands it at
// Nagiwa.at.gasse.papierboot (its top left) from Saturday
sprite("gasse_papierboot", { w: 8, h: 6 }, (c) => {
  const K = { W: "#ece2cc", P: "#cfc4ac", p: "#8e8674", i: "#2a2a3a", s: "#0f151f", f: "#eea040", c: "#d8dce8" }
  ;["...W.f..", "..WWPc..", "WWWWWPPp", ".pWiWiP.", "..pppp..", "..ssss.."].forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== ".") c.px(i, j, K[ch]) }))
})

// the measured numbers for the game: tools/build_art.sh picks this line up and writes game/rooms/gasse.layout.js
console.log("ISO_LAYOUT " + JSON.stringify({ id: "gasse", ...GASSE.layout }))

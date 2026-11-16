// Chapter 2: Lantern in his caravan (kapitel2-design §10: in iso, sitting in his wheelchair at his sender, one direction, small
// movements), as a block for approval before he is painted. He replaces the feed figure lantern_feed that stands in for him in
// lantern_versteck now. His look is the portrait's (art/portraits/portraits.px.js, docs/portraits/lantern_x4.png; story §10 "Lanterns
// Aussehen"): the bright green crest in his colour #b0f0a0, the sides shaved, the cracked ocular over his right eye, the headset with
// three antennas with their own lights on his left ear, the poncho of coloured patches with its hood thrown back, a small lit lantern
// on a cable round his neck; dark brown skin. The wheelchair from the feed (a thick wheel, the push handles).
// He looks south-west, at Juno where she stands to talk (the map's spot `talk`, lower left of him), his back to his desk: he has
// turned his chair to her. One direction only, drawn (never the engine's mirror: the ocular sits on his right eye, the antennas on his
// left ear, as in the portrait). Seen from there the near side is his left: the antennas and the near wheel at the lower right, the
// ocular on the eye further off, to the screen's left.
// His size: a man sitting, the crest's top at 1.42 m, the antennas to 1.75 m; at the floor's 30 px a meter (style guide §4).
//   lantern_blocks_sw      the block, pivot bottom-centre (the chair's middle on the floor)
//   lantern_blocks         the sheet: Juno (her real street sprites), the block, his silhouette
//   lantern_blocks_im_raum the caravan (a game shot, build/shots/lv_empty_1x.png: Juno at `talk`) with him at `lantern`, 1x
"use strict"
const PAL = {
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  // skin (lit, base), the crest, the poncho and its patches, the trousers, the boots
  S: "#b07050", s: "#7a4a32", g: "#b0f0a0", u: "#5a4a8a", U: "#433468", m: "#d84aa8", c: "#3a9ab8", o: "#d87a34", G: "#5aa860",
  D: "#454c60", d: "#363c4e", B: "#1c1f28",
  // the ocular (its ring, the lens, its running text), the headset's lights, the lantern
  L: "#3ac070", l: "#d8ffd0", v: "#62def0", M: "#ff4fd3",
}
pal(PAL)
include("../lib/text.js")

const LW = 36, LH = 60, CX = 17, GY = 56
/** a point of him (meters): f forward (toward the lower left), s to his right (the upper left), h up -> the sprite's px */
const LP = (f, s, h) => [CX - 16 * (f + s), GY + 8 * (f - s) - 30 * h]
/** a filled convex shape round the points (their hull) */
function hull(c, pts, k) {
  const P = pts.map(([x, y]) => [x, y]).sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lo = [], up = []
  for (const p of P) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p) }
  for (const p of P.slice().reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p) }
  const H = lo.slice(0, -1).concat(up.slice(0, -1))
  const x0 = Math.floor(Math.min(...H.map((p) => p[0]))), x1 = Math.ceil(Math.max(...H.map((p) => p[0])))
  const y0 = Math.floor(Math.min(...H.map((p) => p[1]))), y1 = Math.ceil(Math.max(...H.map((p) => p[1])))
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    let inside = true
    for (let i = 0; i < H.length; i++) if (cr(H[i], H[(i + 1) % H.length], [x + 0.5, y + 0.5]) < -0.01) { inside = false; break }
    if (inside) c.px(x, y, k)
  }
}
/** a box of him in meters: its corners' hull */
const lbox = (c, f0, s0, h0, df, ds, dh, k) => {
  const pts = []
  for (const f of [f0, f0 + df]) for (const s of [s0, s0 + ds]) for (const h of [h0, h0 + dh]) pts.push(LP(f, s, h))
  hull(c, pts, k)
}
/** a wheel standing in the plane of his facing: centre (f, s, h), radius r */
function wheel(c, f, s, h, r, tyre, rim, hub) {
  const ring = (rr) => { const pts = []; for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(LP(f + rr * Math.cos(t), s, h + rr * Math.sin(t))) } return pts }
  hull(c, ring(r), tyre)
  hull(c, ring(r - 0.05), rim)
  hull(c, ring(r - 0.08), "2")
  const [hx, hy] = LP(f, s, h); c.rect(Math.round(hx) - 1, Math.round(hy) - 1, 2, 2, hub)
}

/** Lantern in his chair, facing SW; b the breath (the head and the shoulders a pixel down), lit which antenna tip is bright */
function lantern(c, b = 0, lit = 0) {
  // the far wheel (his right), the push handles and the backrest behind him
  wheel(c, -0.05, 0.3, 0.3, 0.3, "1", "4", "5")
  lbox(c, -0.27, -0.22, 0.5, 0.04, 0.44, 0.45, "3")
  for (const s of [-0.22, 0.2]) lbox(c, -0.3, s, 0.88, 0.06, 0.03, 0.1, "4")
  // the seat, the front casters, the footrest
  lbox(c, -0.22, -0.22, 0.46, 0.46, 0.44, 0.05, "4")
  for (const s of [-0.2, 0.18]) lbox(c, 0.3, s, 0, 0.05, 0.03, 0.08, "5")
  lbox(c, 0.38, -0.16, 0.06, 0.2, 0.32, 0.03, "5")
  // his legs: the thighs on the seat, the shins down to the boots on the footrest
  lbox(c, -0.05, 0.03, 0.5, 0.45, 0.14, 0.13, "d"); lbox(c, -0.05, -0.17, 0.5, 0.45, 0.14, 0.13, "D")
  lbox(c, 0.36, 0.03, 0.12, 0.1, 0.12, 0.4, "d"); lbox(c, 0.36, -0.16, 0.12, 0.1, 0.12, 0.4, "D")
  lbox(c, 0.38, -0.17, 0.08, 0.17, 0.15, 0.06, "B"); lbox(c, 0.38, 0.02, 0.08, 0.17, 0.15, 0.06, "B")
  // the poncho: from the shoulders out over the arms and down over the lap; its hood thrown back behind the neck; patches
  const sh = 1.05 - b / 30
  hull(c, [LP(-0.15, 0.24, sh), LP(0.08, 0.24, sh), LP(-0.15, -0.24, sh), LP(0.08, -0.24, sh),
    LP(-0.2, 0.32, 0.58), LP(0.24, 0.3, 0.55), LP(-0.2, -0.32, 0.58), LP(0.24, -0.3, 0.55)], "u")
  hull(c, [LP(-0.2, 0.1, sh + 0.02), LP(-0.2, -0.1, sh + 0.02), LP(-0.26, 0.08, sh - 0.12), LP(-0.26, -0.08, sh - 0.12)], "U")
  for (const [f, s, h, df, ds, dh, k] of [[0.1, -0.3, 0.62, 0.12, 0.12, 0.16, "m"], [0.1, 0.12, 0.7, 0.12, 0.14, 0.16, "c"], [0.15, -0.08, 0.58, 0.1, 0.12, 0.1, "o"], [0.08, -0.18, 0.85, 0.08, 0.1, 0.1, "G"]])
    lbox(c, f, s, h, df, ds, dh, k)
  // his hands: the left on the near wheel's rim, the right on his knee
  lbox(c, 0.0, -0.3, 0.55, 0.07, 0.05, 0.06, "S"); lbox(c, 0.3, 0.08, 0.6, 0.07, 0.07, 0.05, "s")
  // the neck, the head (shaved sides, the face toward the lower left), the crest from his brow back to the nape
  const hb = b / 30
  lbox(c, -0.05, -0.05, 1.0 - hb, 0.08, 0.1, 0.1, "s")
  lbox(c, -0.13, -0.11, 1.07 - hb, 0.24, 0.22, 0.28, "s")
  lbox(c, 0.0, -0.11, 1.09 - hb, 0.11, 0.22, 0.24, "S")
  lbox(c, -0.15, -0.03, 1.33 - hb, 0.26, 0.06, 0.16, "g")
  // the face: the ocular over his right eye (the far one, to the screen's left), the left eye, the grin
  const [ox, oy] = LP(0.11, 0.06, 1.24 - hb), [ex, ey] = LP(0.11, -0.05, 1.24 - hb), [mx, my] = LP(0.11, -0.01, 1.14 - hb)
  c.rect(Math.round(ox) - 2, Math.round(oy) - 2, 4, 4, "k"); c.rect(Math.round(ox) - 1, Math.round(oy) - 1, 2, 2, "L"); c.px(Math.round(ox) - 1, Math.round(oy) - 1, "l")
  c.px(Math.round(ex), Math.round(ey), "k"); c.hline(Math.round(mx) - 1, Math.round(my), 3, "k")
  // the headset on his left ear (the near one), its three antennas with their lights, leaning back
  const [hx, hy] = LP(-0.02, -0.12, 1.2 - hb)
  c.rect(Math.round(hx) - 1, Math.round(hy) - 2, 3, 4, "2"); c.px(Math.round(hx), Math.round(hy), "M")
  // the lantern on its cable at his chest
  const [lx, ly] = LP(0.12, 0, 0.92 - hb)
  c.vline(Math.round(lx), Math.round(ly) - 3, 2, "k"); c.rect(Math.round(lx) - 1, Math.round(ly) - 1, 3, 3, "G"); c.px(Math.round(lx), Math.round(ly), "g")
  // the near wheel (his left), over his side
  wheel(c, -0.05, -0.3, 0.3, 0.3, "1", "5", "6")
  lbox(c, 0.0, -0.31, 0.5, 0.07, 0.04, 0.07, "S")                                       // the hand again, on its rim
}

/** the antennas over the headset: thin steel, their lights at the tips (no outline: 1 px stays 1 px) */
function antennas(c, b = 0, lit = 0) {
  const [hx, hy] = LP(-0.02, -0.12, 1.2 - b / 30)
  for (const [i, dx, len, tip] of [[0, -2, 12, "v"], [1, 0, 16, "M"], [2, 2, 11, "g"]]) {
    const x0 = Math.round(hx) + (i - 1), y0 = Math.round(hy) - 3
    c.line(x0, y0, x0 + dx, y0 - len, "5"); c.px(x0 + dx, y0 - len, lit === i ? "l" : tip)
  }
}
anim("lantern_blocks_sw", { w: LW, h: LH, frames: 4, ms: [700, 700, 700, 700], outline: "k", pivot: "bottom" },
  (c) => lantern(c, c.frame === 2 ? 1 : 0),
  layer("antennas", { outline: false }, (c) => antennas(c, c.frame === 2 ? 1 : 0, c.frame % 3)))

sprite("_lb_juno_se", { png: "../../build/art/characters/anims/juno_idle_se.png", area: [0, 0, 27, 50], pivot: "bottom" })
sprite("_lb_juno_ne", { png: "../../build/art/characters/anims/juno_idle_ne.png", area: [0, 0, 27, 50], pivot: "bottom" })
const SW = 200, SH = 110
scene("lantern_blocks", { w: SW, h: SH, bg: "3" }, (c) => {
  const FY = 80
  c.rect(0, FY, SW, SH - FY, "2")
  TXT.draw(c, 22, 4, "JUNO", "6", { font: "hud", align: "center" }); TXT.draw(c, 100, 4, "LANTERN SW", "6", { font: "hud", align: "center" })
  c.stamp("_lb_juno_se", 16, FY); c.stamp("_lb_juno_ne", 42, FY)
  c.vline(62, FY - 52, 52, "P" in PAL ? "P" : "6")
  c.stamp("lantern_blocks_sw", 90, FY + 2)
  c.stamp("lantern_blocks_sw", 140, FY + 2, { swap: Object.fromEntries(Object.keys(PAL).filter((k) => k !== "k").map((k) => [k, "k"])) })
})
sprite("_lb_room", { png: "../../build/shots/lv_empty_1x.png" })
scene("lantern_blocks_im_raum", { w: 320, h: 180, bg: "k" }, (c) => {
  c.stamp("_lb_room", 0, 0)
  c.stamp("lantern_blocks_sw", 235, 145)
})

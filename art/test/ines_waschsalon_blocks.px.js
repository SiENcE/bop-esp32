// Chapter 1, job C: Dr. Ines Calder in SUDS & SPIN, as blocks for approval before she is painted. Replaces mock_ines
// (art/mock/ch1_blocks.px.js), her pose while at:ines=cam23 (game/kapitel1.js): CAM 23 is the laundromat's own iso picture under
// the feed's filter, so there she is at the laundromat's scale (kapitel1-design §10: 47 px; Juno 50, both with the outline).
// Her routine there (game/kapitel1.js): day 2 at A23.washer facing nw, day 3 at A23.dryer6 facing ne (the moment ines_drop). Both
// entries have no path: she stands, she never walks in CAM 23, so one view is enough: the back three-quarter NE (the engine
// mirrors it for NW), idle.
//   ines_waschsalon_blocks           the sheet: Juno (SE, NE), the heights 50 and 47, A (NE, NW), B (NE, NW), silhouettes below
//   ines_waschsalon_blocks_a, _b     NE alone, pivot bottom (for the composites)
//   ines_waschsalon_im_raum          the laundromat (street mode, top) and CAM 23 (the feed, bottom), A left, B right; in each she
//                                    stands at the washer (nw) and at dryer 6 (ne) at once, the game's spots
// Both: the white coat to the knees, lighter than everything, a half-belt across its back and a vent; dark trousers, flat dark shoes;
// dark hair drawn back from the face into the plait (her portrait: it comes out behind the jaw); her colour #f0a0c0 is the plait's tie,
// and the bag is it darkened (in the feed a mid-dark grey like the bag in feed_people.px.js; a lighter bag would go white there).
//   A  the plait down her back, as in ines_feed_back (cam24, cam30, cam31); the bag on a strap over her right shoulder, at her hip
//   B  the plait over her left shoulder to the front, as in ines_feed_bar (CAM 22, a quarter of an hour before); from behind only
//      the gathered hair at the nape and its turn over the shoulder; the bag's strap across her back, the bag at her left hip
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8e9ab0",
  W: "#eef0f2", w: "#c8ced8", q: "#9aa2b0",                  // the coat: lit, the side away from the tubes, seams and folds
  H: "#1c1820", h: "#3a3242",                                // the hair, the plait's strands
  s: "#7a4a34", S: "#a86a48",                                // skin: shade, lit
  d: "#2a3346", D: "#3a4660",                                // the trousers: far leg, near leg
  b: "#4e2c40", B: "#6e3e5a", t: "#2e1a28",                  // the bag (her colour, darkened), its strap
  p: "#f0a0c0",                                              // her colour: the plait's tie
  y: "#eec414", P: "#f0a0c0",
})
include("../lib/text.js")

const IW = 19, IH = 45                                         // the inside; the outline grows it to 21 x 47
/** Ines from behind, facing NE, her feet's centre at (fx, fy) (the body ends on row fy - 1, the outline under it). */
function ines(c, fx, fy, way = "A") {
  const x = fx, T = fy - IH, R = (a, b, w, h, k) => c.rect(a, b, w, h, k), A = way === "A"
  // the legs from under the coat, the near (her right, screen right) lighter; flat shoes
  R(x - 3, T + 33, 3, 9, "d"); R(x + 1, T + 33, 3, 9, "D")
  R(x - 4, T + 42, 4, 3, "1"); R(x + 1, T + 42, 4, 3, "1")
  // the coat: narrow at the shoulders, a little wider at the hem, to the knees
  for (let r = 10; r <= 33; r++) {
    const half = r === 10 ? 4 : 5 + Math.round((r - 11) * 1.4 / 22)
    R(x - half, T + r, half * 2 + 1, 1, "W")
    c.px(x - half, T + r, "w"); if (r > 11) c.px(x - half + 1, T + r, "w")          // the side away from the tubes
  }
  R(x - 3, T + 22, 8, 1, "q"); c.px(x - 3, T + 23, "q"); c.px(x + 4, T + 23, "q")  // the half-belt across the back, its two buttons' shadow
  c.vline(x + 1, T + 26, 8, "q")                                                     // the vent
  R(x - 6, T + 33, 14, 1, "q")                                                       // the hem's shadow
  // the arms hanging, the sleeves to the wrists, the hands
  R(x - 7, T + 12, 2, 16, "w"); R(x + 6, T + 12, 2, 16, "W"); c.vline(x + 7, T + 13, 15, "w")
  c.vline(x - 5, T + 14, 14, "q"); c.vline(x + 5, T + 14, 14, "q")                  // where the arms leave the body
  R(x - 7, T + 28, 2, 3, "s"); R(x + 6, T + 28, 2, 3, "S")
  // the neck, the head from behind and a little to the right: hair all round, the right ear and the jaw's edge lit past it
  R(x - 1, T + 8, 3, 2, "s")
  const hx = x + 1
  R(hx - 3, T, 7, 1, "H"); R(hx - 4, T + 1, 9, 6, "H"); R(hx - 3, T + 7, 7, 1, "H")
  c.px(hx - 1, T + 1, "h"); c.px(hx, T + 1, "h"); c.px(hx + 1, T + 2, "h")          // the shine on the crown
  c.px(hx + 4, T + 4, "S"); c.px(hx + 4, T + 5, "s"); c.px(hx + 3, T + 7, "S")      // the ear, the jaw
  if (A) {
    // the plait from the nape down the middle of the back, tapering, its strands; the tie, a tuft below
    for (let r = 7; r <= 24; r++) {
      const w = r < 18 ? 3 : 2, x0 = hx - 1 - (r > 10 ? 1 : 0) + (r >= 18 ? 1 : 0)
      R(x0, T + r, w, 1, "H"); c.px(x0 + ((r % 3) === 0 ? 0 : w - 1), T + r, "h")
    }
    R(hx - 1, T + 25, 2, 1, "p"); R(hx - 1, T + 26, 2, 2, "H")
    // the bag: its strap from the right shoulder straight down, the bag at the right hip over the arm
    c.vline(x + 4, T + 10, 13, "t"); c.vline(x + 5, T + 10, 1, "t")
    R(x + 4, T + 22, 6, 7, "B"); R(x + 4, T + 22, 6, 2, "b"); R(x + 4, T + 28, 6, 1, "b")
  } else {
    // the hair gathered at the nape, the plait turning over her left shoulder (screen left) to the front
    // (3 px thick, the strands every other pixel; over the shoulder's top it bulges past the outline, then it is gone in front)
    R(hx - 2, T + 7, 4, 2, "H")
    for (let i = 0; i <= 6; i++) { const px0 = hx - 2 - i, py = T + 8 + Math.round(i * 0.5); R(px0, py, 1, 3, "H"); if (i % 2) c.px(px0, py + 1, "h") }
    R(x - 7, T + 10, 3, 3, "H"); c.px(x - 6, T + 11, "h"); c.px(x - 8, T + 11, "H"); c.px(x - 8, T + 12, "H")
    // the strap from the right shoulder across the back to the bag at the left hip
    c.line(x + 4, T + 10, x - 5, T + 25, "t"); c.line(x + 5, T + 10, x - 4, T + 25, "t")
    R(x - 9, T + 24, 6, 7, "B"); R(x - 9, T + 24, 6, 2, "b"); R(x - 9, T + 30, 6, 1, "b")
  }
}

for (const way of ["a", "b"]) sprite(`ines_waschsalon_blocks_${way}`, { w: IW, h: IH, pivot: "bottom", outline: "k" }, (c) => ines(c, 9, IH, way.toUpperCase()))

// ---- the sheet: Juno's real street sprites (the first frames of the built idles), the heights, the two ways, their silhouettes
sprite("_iw_juno_se", { png: "../../build/art/characters/anims/juno_idle_se.png", area: [0, 0, 27, 50], pivot: "bottom" })
sprite("_iw_juno_ne", { png: "../../build/art/characters/anims/juno_idle_ne.png", area: [0, 0, 27, 50], pivot: "bottom" })
const PAL = { k: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, W: 0, w: 0, q: 0, H: 0, h: 0, s: 0, S: 0, d: 0, D: 0, b: 0, B: 0, t: 0, p: 0 }
const SIL = Object.fromEntries(Object.keys(PAL).map((k) => [k, "k"]))
for (const way of ["a", "b"]) sprite(`_iw_sil_${way}`, { base: `ines_waschsalon_blocks_${way}`, swap: SIL })

const SW = 196, SH = 136, FY = 64, SY = 130
scene("ines_waschsalon_blocks", { w: SW, h: SH, bg: "3" }, (c) => {
  c.rect(0, FY, SW, 6, "2"); c.rect(0, 70, SW, 66, "5"); c.rect(0, SY, SW, 6, "4")
  c.stamp("_iw_juno_se", 16, FY); c.stamp("_iw_juno_ne", 42, FY)
  TXT.draw(c, 29, 3, "JUNO", "7", { font: "hud", align: "center" })
  c.vline(57, FY - 50, 50, "y"); c.vline(59, FY - 47, 47, "P")                      // 50 and 47 px
  const col = (way, i) => (way === "a" ? 84 : 148) + i * 26
  for (const way of ["a", "b"]) {
    TXT.draw(c, col(way, 0) + 13, 3, way.toUpperCase(), "7", { font: "hud", align: "center" })
    ;[["NE", false], ["NW", true]].forEach(([lab, flip], i) => {
      TXT.draw(c, col(way, i), 11, lab, "6", { font: "hud", align: "center" })
      c.stamp(`ines_waschsalon_blocks_${way}`, col(way, i), FY, { flip: flip ? "x" : undefined })
      c.stamp(`_iw_sil_${way}`, col(way, i), SY, { flip: flip ? "x" : undefined })
    })
  }
})

// ---- in the room: the game's own shots (build/blocks/ines_waschsalon/, made with tools' shot.mjs: the laundromat at 18:00 on
// Wednesday with Juno moved aside, CAM 23 at 20:30 after she has gone), her blocks at the game's spots: the laundromat's
// washer (123, 125) nw and dryer6 (211, 153) ne; CAM 23 the same moved right by A23.shift = 24
sprite("_iw_room", { png: "../../build/blocks/ines_waschsalon/laundromat_1x.png" })
sprite("_iw_cam23", { png: "../../build/blocks/ines_waschsalon/cam23_1x.png" })
const hexOf = (v) => [1, 3, 5].map((i) => parseInt(v.slice(i, i + 2), 16))
const toHex = (a) => "#" + a.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("")
const COLORS = { k: "#0c0e1a", 1: "#131a2a", W: "#eef0f2", w: "#c8ced8", q: "#9aa2b0", H: "#1c1820", h: "#3a3242", s: "#7a4a34", S: "#a86a48",
  d: "#2a3346", D: "#3a4660", b: "#4e2c40", B: "#6e3e5a", t: "#2e1a28", p: "#f0a0c0" }
// the room's light on an actor (ambient 0.8, the tubes' green from above): about this
const LIT = (v) => toHex(hexOf(v).map((ch, i) => ch * [0.82, 0.9, 0.84][i]))
// the feed: exposure 2.2 (clamped), the brightness (77 r + 150 g + 29 b) / 256, the nearest of the ten phosphor steps (no dither)
const PHOS = ["#030a0a", "#071514", "#0c221f", "#12332d", "#1a483e", "#266252", "#388169", "#55a585", "#8acfae", "#d4f7e2"]
const FEED = (v) => { const [r, g, b] = hexOf(v).map((ch) => Math.min(255, ch * 2.2)); return PHOS[Math.round(((77 * r + 150 * g + 29 * b) / 256) / 255 * 9)] }
const SWAP = (f) => Object.fromEntries(Object.entries(COLORS).map(([k, v]) => [k, f(v)]))
for (const way of ["a", "b"]) {
  sprite(`_iw_lit_${way}`, { base: `ines_waschsalon_blocks_${way}`, swap: SWAP(LIT) })
  sprite(`_iw_feed_${way}`, { base: `ines_waschsalon_blocks_${way}`, swap: SWAP(FEED) })
}
const WASHER = [123, 125], DRYER6 = [211, 153], SHIFT = 24
scene("ines_waschsalon_im_raum", { w: 640, h: 360, bg: "k" }, (c) => {
  ;["a", "b"].forEach((way, i) => {
    const ox = i * 320
    c.stamp("_iw_room", ox, 0)
    c.stamp(`_iw_lit_${way}`, ox + WASHER[0], WASHER[1], { flip: "x" }); c.stamp(`_iw_lit_${way}`, ox + DRYER6[0], DRYER6[1])
    c.stamp("_iw_cam23", ox, 180)
    c.stamp(`_iw_feed_${way}`, ox + WASHER[0] + SHIFT, 180 + WASHER[1], { flip: "x" }); c.stamp(`_iw_feed_${way}`, ox + DRYER6[0] + SHIFT, 180 + DRYER6[1])
    TXT.draw(c, ox + 306, 4, way.toUpperCase(), "W", { font: "hud", outline: "k" })
  })
  c.vline(320, 0, 360, "k"); c.hline(0, 180, 640, "k")
})

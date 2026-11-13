// Dr. Ines Calder in SUDS & SPIN (Chapter 1, job C), at the laundromat's scale: CAM 23 is the laundromat's own iso picture under the
// feed's filter (game/kapitel1.js, her pose while at:ines=cam23). Painted on the lines of the block the user chose, variant A of
// art/test/ines_waschsalon_blocks.px.js (2026-11-13): seen from behind, the white coat to her knees with its half-belt and vent, the
// dark plait down her back to the waist with her colour's tie (#f0a0c0), the bag on a strap from her right shoulder at her right hip;
// dark trousers, flat shoes. 47 px with the outline (Juno 50).
//   ines_wash_ne   facing NE (day 3, at dryer 6): the head turned right, its ear and jaw on the right
//   ines_wash_nw   facing NW (day 2, at the washer): drawn, not mirrored (docs/kapitel1-design.md: what sits on one side is drawn
//                  where the mirror would swap it): the head turns left, the bag stays at her right hip, on the screen's right
// She never walks in CAM 23, so she only stands: two frames, a slow breath (the shoulders and the head a pixel up). Light from the
// upper left as everyone in street mode: the coat's lit side on the left, the shade on the right.
// Every frame 21x47 (19x45 inside the outline k), pivot bottom-centre (column 10, under her feet).
;(() => {

pal({
  k: "#0c0e1a", 1: "#131a2a",                                 // ink, the shoes
  W: "#f4f6f8", w: "#d2d8e0", q: "#a2aab8", Q: "#7c8494",     // the coat: lit, mid, shade and seams, deep folds
  H: "#1c1820", h: "#3a3242", G: "#54485e",                   // the hair, its strands, the shine
  s: "#7a4a34", S: "#a86a48", L: "#c8865e",                   // skin: shade, mid, lit
  d: "#2a3346", D: "#3a4660",                                 // the trousers: far leg, near leg
  b: "#4e2c40", B: "#6e3e5a", t: "#2e1a28", T: "#8e5a76",     // the bag (her colour darkened): shade, body, strap, the flap's lit edge
  p: "#f0a0c0",                                               // her colour: the plait's tie, the bag's clasp
  y: "#8e96a8",                                               // the shoes' glint
})

const IW = 19, IH = 45, X = 9                                  // the inside; the feet's centre column

/** Ines from behind. view "ne" or "nw"; up: the breath (the shoulders and head a pixel higher). */
function ines(c, view, up) {
  const x = X, T = 0, nw = view === "nw", R = (a, b, w, h, k) => c.rect(a, b, w, h, k), P = (a, b, k) => c.px(a, b, k)
  const u = up ? -1 : 0                                         // the breath lifts what is above the belt

  // ---- the legs under the coat: the far leg (her left, screen left) darker, flat shoes with a glint
  R(x - 3, T + 33, 3, 9, "d"); R(x + 1, T + 33, 3, 9, "D")
  P(x + 1, T + 34, "d"); P(x - 1, T + 34, "1")                  // the coat's shadow on the legs
  R(x - 4, T + 42, 4, 3, "1"); R(x + 1, T + 42, 4, 3, "1")
  P(x - 4, T + 42, "y"); P(x + 1, T + 42, "y")

  // ---- the coat: narrow at the shoulders, a little wider at the hem, to the knees; lit on the left
  for (let r = 10; r <= 33; r++) {
    const half = r === 10 ? 4 : 5 + Math.round((r - 11) * 1.4 / 22), y = T + r + (r < 22 ? u : 0)
    R(x - half, y, half * 2 + 1, 1, "w")
    R(x - half, y, half, 1, "W")                                // the lit half
    P(x + half, y, "q"); if (r > 11) P(x + half - 1, y, "q")   // the shaded side
  }
  if (up) R(x - 5, T + 21, 11, 1, "w")                          // the coat's middle stretched by the breath
  // the collar standing round the neck, its shadow under it
  R(x - 3, T + 9 + u, 7, 2, "W"); P(x + 3, T + 9 + u, "w"); P(x + 3, T + 10 + u, "q"); R(x - 2, T + 11 + u, 5, 1, "q")
  // the shoulder seams
  P(x - 4, T + 11 + u, "w"); P(x + 4, T + 11 + u, "q")
  // the half-belt across the back with its two buttons, the vent below, the folds, the hem
  R(x - 3, T + 22, 8, 1, "q"); P(x - 3, T + 23, "q"); P(x + 4, T + 23, "q"); P(x - 2, T + 22, "W"); P(x + 3, T + 22, "w")
  c.vline(x + 1, T + 26, 8, "q"); P(x + 2, T + 26, "Q")
  P(x - 4, T + 27, "q"); P(x - 4, T + 28, "q"); P(x + 4, T + 29, "Q"); P(x + 4, T + 30, "Q")
  R(x - 6, T + 33, 14, 1, "q"); P(x - 6, T + 33, "w")

  // ---- the arms hanging, the sleeves to the wrists; the left one lit, the right one in shade
  R(x - 7, T + 12 + u, 2, 16 - u, "W"); c.vline(x - 7, T + 13 + u, 14, "w")
  R(x + 6, T + 12 + u, 2, 16 - u, "w"); c.vline(x + 7, T + 13 + u, 15, "q")
  c.vline(x - 5, T + 14 + u, 14, "q"); c.vline(x + 5, T + 14 + u, 14, "Q")   // where the arms leave the body
  R(x - 7, T + 27, 2, 1, "q"); R(x + 6, T + 27, 2, 1, "Q")                   // the cuffs
  R(x - 7, T + 28, 2, 3, "S"); P(x - 7, T + 28, "L"); R(x + 6, T + 28, 2, 3, "s")

  // ---- the neck, the head from behind: turned right (ne) or left (nw), hair drawn back all round
  R(x - 1, T + 8 + u, 3, 2, "s"); P(x - 1, T + 8 + u, "S")
  const hx = nw ? x - 1 : x + 1, side = nw ? -1 : 1, hy = T + u
  R(hx - 3, hy, 7, 1, "H"); R(hx - 4, hy + 1, 9, 6, "H"); R(hx - 3, hy + 7, 7, 1, "H")
  // the shine on the crown, from the upper left; strands drawn back toward the nape
  P(hx - 2, hy + 1, "G"); P(hx - 1, hy + 1, "G"); P(hx, hy + 1, "h"); P(hx - 3, hy + 2, "h")
  P(hx - 1, hy + 3, "h"); P(hx + 1, hy + 4, "h"); P(hx - 2, hy + 5, "h"); P(hx, hy + 6, "h")
  // the ear and the jaw's edge, past the hair on the side she turns to
  const ex = hx + 4 * side
  P(ex, hy + 4, nw ? "L" : "S"); P(ex, hy + 5, "s"); P(hx + 3 * side, hy + 7, nw ? "S" : "s")

  // ---- the plait from the nape down the middle of the back, woven (strands left and right in turn), tapering; the tie, a tuft
  for (let r = 7; r <= 24; r++) {
    const w = r < 18 ? 3 : 2, x0 = hx - 1 - (r > 10 ? side : 0) + (r >= 18 ? (nw ? 0 : 1) : 0), y = T + r + (r < 22 ? u : 0)
    R(x0, y, w, 1, "H")
    P(x0 + (r % 2 ? 0 : w - 1), y, "h")
    if (r % 4 === 1) P(x0, y, "G")                              // a lit strand where the weave turns
  }
  R(hx - 1 + (nw ? 0 : 0), T + 25, 2, 1, "p"); R(hx - 1, T + 26, 2, 2, "H"); P(hx - 1, T + 27, "h")

  // ---- the bag: its strap from her right shoulder (the screen's right) straight down, the bag at the right hip over the arm
  c.vline(x + 4, T + 10 + u, 13 - u, "t"); P(x + 5, T + 10 + u, "t")
  R(x + 4, T + 22, 6, 7, "B")
  R(x + 4, T + 22, 6, 3, "b"); R(x + 4, T + 22, 6, 1, "T")     // the flap, its lit top edge
  P(x + 6, T + 24, "p")                                         // the clasp
  R(x + 4, T + 28, 6, 1, "b"); P(x + 9, T + 23, "t"); c.vline(x + 9, T + 25, 3, "b")
}

for (const view of ["ne", "nw"])
  anim(`ines_wash_${view}`, { w: IW, h: IH, frames: 2, ms: [1800, 1400], outline: "k", pivot: "bottom" }, (c) => ines(c, view, c.frame === 1))

})()

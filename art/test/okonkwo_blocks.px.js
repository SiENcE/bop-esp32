// Chapter 1, job B: Herr Okonkwo (kapitel1-design §10: 48 px, a cardigan, reading glasses, #d8b890; he keeps the corner shop in
// Jade Row, still reckons on paper, his family on the beach before the flood) as blocks for approval before he is painted.
// Front three-quarter (SE, mirrored for SW: behind his counter he faces the room) and back three-quarter (NE: cam07 sees his back in his
// door at one), beside Juno for her height; two ways for him.
//   okonkwo_blocks       the sheet: Juno, A (SE, NE), B (SE, NE), and their silhouettes below
//   okonkwo_blocks_A, _B  SE alone, pivot bottom (for the composite behind the counter)
// Both: in his sixties, a little stooped, the cardigan in his colour (#d8b890) buttoned over a dark shirt, its pockets sagging with
// a pencil and his reading glasses' case; grey hair cut short, a grey beard; the reading glasses low on his nose; dark trousers,
// old shoes. His glowing thing (style guide §8a): a clip-on reading light on the glasses' arm, a cyan point at his temple.
//   A  an ordinary man, nothing altered
//   B  an animal mod (story §10c): a tortoise. The shell humps his back under the cardigan, stretched over it; his neck long, grey-green
//      and folded, pushing the head forward; heavy lids. He stays, he carries his house, he is slow, and he does not forget.
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8e9ab0",
  s: "#3e2820", S: "#5e3c2c", r: "#82543a",                 // skin: shade, mid, lit
  e: "#d8b890", E: "#a8885e", Q: "#76603e",                 // the cardigan: lit, shade, deep
  d: "#2c3448", D: "#404a62",                               // the shirt
  w: "#9a9a90", W: "#d8d8cc",                               // grey hair and beard, the glasses' glint
  t: "#7e8c66", T: "#56623e", u: "#3c4430",                 // the tortoise's skin: lit, mid, folds
  h: "#8a7444", H: "#5c4a2a",                               // the shell where it shows: a plate, its seam
  v: "#62def0", y: "#eec414", Y: "#a88a10",
})
include("../lib/text.js")

/** Okonkwo standing, his feet's centre at (fx, fy): view "se" or "ne", way "A" or "B" */
function okonkwo(c, fx, fy, view = "se", way = "A") {
  const x = fx, T = fy - 48, se = view === "se", B = way === "B", R = (a, b, w, h, k) => c.rect(a, b, w, h, k)
  // the legs and the old shoes, a little apart
  R(x - 4, T + 33, 3, 12, "3"); R(x + 1, T + 33, 3, 12, "4"); c.vline(x + 1, T + 33, 12, "5")   // the near leg lighter, so it reads on a dark floor
  R(x - 5, T + 45, 4, 3, "1"); R(x + 1, T + 45, se ? 5 : 4, 3, "1")
  // the cardigan to the hips, wider at the bottom, the shoulders round (stooped); B: the shell under it, a hump at the back
  for (let r = 11; r <= 33; r++) {
    const half = 6 + Math.round((r - 11) * 1.4 / 22)
    let x0 = x - half, x1 = x + half
    if (B && r < 31) x0 -= Math.round(5 * Math.sin(Math.PI * (r - 9) / 22))      // the back is to the left in both views
    R(x0, T + r, x1 - x0 + 1, 1, "e")
    c.px(x0, T + r, "E"); c.px(x0 + 1, T + r, "E")                                   // the side away from the light
    if (r === 33) R(x0, T + r, x1 - x0 + 1, 1, "Q")
  }
  R(x - 5, T + 10, 11, 1, "e")
  if (se) {
    // the front: the shirt in the open collar, the buttons, the sagging pockets with a pencil and the glasses' case
    R(x, T + 11, 3, 5, "d"); c.px(x + 1, T + 11, "D")
    for (let b = 0; b < 4; b++) c.px(x + 1, T + 17 + b * 4, "Q")
    c.vline(x, T + 16, 17, "E")
    R(x - 5, T + 24, 4, 4, "E"); c.vline(x - 4, T + 21, 3, "y"); c.px(x - 4, T + 21, "Y")
    R(x + 3, T + 24, 4, 4, "E"); R(x + 4, T + 23, 2, 2, "Q")
  } else {
    // the back: the seam down the middle, the ribbed hem; B: the shell's edge where the cardigan rides up over it
    c.vline(x - 1, T + 12, 20, "E")
    if (B) { R(x - 5, T + 30, 12, 2, "h"); c.px(x - 2, T + 30, "H"); c.px(x + 3, T + 30, "H"); R(x - 5, T + 32, 12, 1, "H") }
  }
  // the arms hanging, the hands; in SE his right hand holds a pencil
  const ax = [x - 9, x + 7]
  R(ax[0], T + 13, 3, 13, se ? "E" : "e"); R(ax[1], T + 13, 3, 13, se ? "e" : "E")
  R(ax[0], T + 26, 3, 3, "S"); R(ax[1], T + 26, 3, 3, se ? "r" : "S")
  if (se) { c.line(ax[1] + 3, T + 25, ax[1] + 4, T + 29, "y"); c.px(ax[1] + 4, T + 30, "k") }
  // the neck: A short, in the collar; B long, folded and grey-green, the head pushed forward
  const fwd = B ? 3 : 1, hx = x + fwd, hy = T + (B ? 6 : 4)
  if (B) { c.line(hx - 3, hy + 6, hx, hy + 3, "t"); R(hx - 3, hy + 4, 5, 5, "t"); c.line(hx - 3, hy + 5, hx + 1, hy + 4, "u"); c.line(hx - 3, hy + 7, hx + 1, hy + 6, "T") }
  else R(hx - 2, hy + 5, 4, 2, "s")
  // the head
  c.ellipse(hx, hy, 4, 5, se ? "S" : "s")
  if (se) {
    c.ellipse(hx + 1, hy, 2, 4, "r")                                              // the lit side of the face
    if (B) c.hline(hx, hy - 1, 5, "S")                                            // the heavy lids
    R(hx - 1, hy, 6, 1, "k"); c.px(hx + 1, hy, "W"); c.px(hx + 4, hy, "W")       // the reading glasses, low on the nose
    c.px(hx - 3, hy - 1, "v")                                                     // the clip-on light at his temple
    R(hx - 1, hy + 3, 5, 2, "w"); c.px(hx + 1, hy + 3, "s")                       // the grey beard, the mouth
    c.hline(hx - 2, hy - 5, 5, "w"); R(hx - 3, hy - 4, 6, 1, "w"); R(hx - 4, hy - 3, 2, 3, "w")   // short grey hair, round
    c.px(hx - 4, hy, "S")                                                          // the ear
  } else {
    c.ellipse(hx, hy - 1, 4, 4, "w"); c.hline(hx - 2, hy - 5, 4, "W")              // the back of the head, cut short
    c.px(hx - 4, hy, "S"); c.px(hx + 4, hy, "S"); c.px(hx + 4, hy - 1, "v")        // the ears, the light's glow past his temple
    if (B) { c.hline(hx - 2, hy + 3, 5, "T"); c.hline(hx - 2, hy + 4, 5, "u") }    // the folds where the neck comes out
  }
}

/** Juno for her height: the yellow slicker, the hood up, as in the street */
function juno(c, fx, fy) {
  const x = fx, T = fy - 50, R = (a, b, w, h, k) => c.rect(a, b, w, h, k)
  R(x - 4, T + 34, 3, 13, "1"); R(x + 1, T + 34, 3, 13, "2"); R(x - 5, T + 46, 4, 4, "k"); R(x + 1, T + 46, 5, 4, "k")
  R(x - 7, T + 10, 15, 26, "y"); R(x - 7, T + 10, 2, 26, "Y")
  c.ellipse(x, T + 5, 5, 6, "y"); R(x - 1, T + 3, 5, 5, "r"); c.px(x + 1, T + 5, "k"); c.px(x + 3, T + 5, "k")
  R(x + 4, T + 26, 4, 6, "7"); c.line(x - 5, T + 11, x + 5, T + 26, "6")
}

const SHEET_W = 210, SHEET_H = 150
sprite("okonkwo_blocks", { w: SHEET_W, h: SHEET_H }, (c) => {
  c.rect(0, 0, SHEET_W, 76, "3"); c.rect(0, 66, SHEET_W, 10, "2")
  c.rect(0, 76, SHEET_W, 74, "5"); c.rect(0, 140, SHEET_W, 10, "4")
  const at = [[20, "JUNO", ""], [62, "A SE", ""], [94, "A NE", ""], [140, "B SE", "TURTLE"], [176, "B NE", "TURTLE"]]
  for (const [x, a, b] of at) { TXT.draw(c, x, 3, a, "7", { font: "hud", align: "center" }); if (b) TXT.draw(c, x, 10, b, "6", { font: "hud", align: "center" }) }
  const draw = (cc, fy) => {
    okonkwo(cc, 62, fy, "se", "A"); okonkwo(cc, 94, fy, "ne", "A"); okonkwo(cc, 140, fy, "se", "B"); okonkwo(cc, 176, fy, "ne", "B")
  }
  draw(c, 68)
  // the silhouettes: the same figures in ink, to see that each reads as a shape
  const sil = { px: (a, b) => c.px(a, b, "k"), rect: (a, b, w, h) => c.rect(a, b, w, h, "k"), hline: (a, b, w) => c.hline(a, b, w, "k"),
    vline: (a, b, n) => c.vline(a, b, n, "k"), line: (a, b, d, e) => c.line(a, b, d, e, "k"), ellipse: (a, b, rx, ry) => c.ellipse(a, b, rx, ry, "k") }
  draw(sil, 142)
})

for (const way of ["A", "B"]) sprite(`okonkwo_blocks_${way}`, { w: 27, h: 49, pivot: "bottom", outline: "k" }, (c) => okonkwo(c, 13, 48, "se", way))

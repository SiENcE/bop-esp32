// Juno in 2088 from the side, in flat blocks, for the ride D (docs/kapitel0-design.md §5): the game's first side view.
// Not drawn by eye: the rows and depths are measured. ANSUR II (US Army, 2012), the 416 women within 2.5 cm of Juno's
// height, at the game's 30 px per metre; the S of the spine after the figure-drawing books (the ribcage back, the
// lumbar curve in, the pelvis back; head, shoulder, hip and ankle on one plumb line).
//   measured, in rows from the crown of 50:  shoulder 8.7, chest 13.7, waist 19.6, hip joint 23.8, crotch 25.7, knee 36,
//   ankle 48; depths: chest 7.6, waist 6.5, seat 7.1, thigh 6, calf 3.6, neck 3.2, foot 7.6; upper arm 10.3,
//   forearm with hand 13.6.
// The head is the one thing not true to scale: a true one is 7 rows, the style guide says about 10 (§6). So both:
//   A  head 10 rows (style guide), the neck and shoulders down to row 11-12, the body under it squeezed by that much
//   B  head 8 rows, nearly true, the shoulders at row 9-10
// Facing left, as in shots 2 and 4 and on the title: we see her left side, with the implant's point behind the ear.
pal({
  n: "#06080f", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  k: "#0c0e1a", g: "#565e70", G: "#8e96a8", h: "#3d4656", S: "#d79676", s: "#93583f", u: "#1b1f2e", U: "#2c3247",
  c: "#1f88a4", v: "#3ff2ff", H: "#b9c6d8", O: "#6b4630", o: "#4d3122", P: "#8a6242",
  y: "#eec414", Q: "#55a585", q: "#266252", W: "#d4f7e2",
})
include("../lib/text.js")
include("../characters/juno.px.js")

// One column of the body per row: [row in 0..49, back, front], as x from the plumb line, + towards her back.
// Between the rows given it runs straight, so the outline stays a line and has no steps of its own.
const BODY = {
  A: { head: 10, rows: [
    [10, 2, -1], [11, 2, -1],                               // the neck
    [12, 3, -2], [13, 4, -3], [15, 4, -4], [18, 4, -4],     // over the shoulder, the ribcage: back and bust
    [20, 3, -3], [22, 2, -3],                               // under the ribs, the small of the back
    [24, 3, -3], [26, 4, -3], [28, 4, -3],                  // the pelvis, the seat
    [31, 3, -3], [35, 2, -2], [37, 1, -2],                  // the thigh to the knee
    [41, 2, -2], [45, 1, -1], [47, 1, 0], [48, 2, -1], [49, 2, -6],  // the calf, the ankle, heel and toe
  ] },
  B: { head: 8, rows: [
    [8, 2, -1], [9, 2, -1],
    [10, 3, -2], [11, 4, -3], [13, 4, -4], [17, 4, -4],
    [19, 3, -3], [21, 2, -3],
    [24, 3, -3], [26, 4, -3], [28, 4, -3],
    [31, 3, -3], [35, 2, -2], [37, 1, -2],
    [41, 2, -2], [45, 1, -1], [47, 1, 0], [48, 2, -1], [49, 2, -6],
  ] },
}
const interp = (rows, y, i) => {
  for (let r = 1; r < rows.length; r++) if (y <= rows[r][0]) {
    const a = rows[r - 1], b = rows[r], t = (y - a[0]) / Math.max(1, b[0] - a[0])
    return Math.round(a[i] + (b[i] - a[i]) * t)
  }
  return rows[rows.length - 1][i]
}
// the head, an oval deeper than it is wide from the front, with its nose and chin (rows relative to its height h)
const SKULL = {
  10: [[2, -2], [3, -3], [4, -4], [4, -4], [4, -4], [4, -5], [3, -5], [3, -4], [2, -4], [1, -3]],   // crown to chin; nose on rows 5-6
  8: [[2, -2], [3, -3], [3, -3], [3, -3], [3, -4], [3, -4], [2, -3], [1, -2]],
}
function headShape(h, y) { return SKULL[h][y] }
// every row of the figure as x from the plumb line; feet on row 49
function outline(v, yy) {
  const b = BODY[v]
  if (yy < b.head) { const [bk, fr] = headShape(b.head, yy); return [bk, fr - 1] }    // the head's slump: a pixel ahead
  return [interp(b.rows, yy, 1), interp(b.rows, yy, 2)]
}
const silhouette = (c, v, x, y, k) => { for (let yy = 0; yy < 50; yy++) { const [bk, fr] = outline(v, yy); for (let xx = fr; xx <= bk; xx++) c.px(x + xx, y - 49 + yy, k) } }

// The clothed figure, flat: `box` adds what she carries and bends the near arm under it.
function juno2088(c, v, x, y, box) {
  const b = BODY[v], top = y - 49, P = (dx, dy, k, w = 1, h = 1) => c.rect(x + dx, top + dy, w, h, k)
  const sh = b.head + 2
  // the far leg, a step darker and half a stride ahead; the far arm is hidden behind the body
  for (let yy = 26; yy < 50; yy++) { const [bk, fr] = outline(v, yy); for (let xx = fr - 1; xx <= bk - 2; xx++) c.px(x + xx, top + yy, "1") }
  c.rect(x - 7, top + 48, 8, 2, "k")
  // the body: trousers from the hips, jacket above (hip length), the shoes, the neck and head
  for (let yy = b.head; yy < 50; yy++) {
    const [bk, fr] = outline(v, yy)
    const k = yy < sh - 1 ? "G" : yy < 29 ? "g" : yy >= 47 ? "k" : "u"
    for (let xx = fr; xx <= bk; xx++) c.px(x + xx, top + yy, k)
  }
  // the jacket's back in shade, its hem, the collar standing round the neck with its lit lip
  for (let yy = sh; yy < 29; yy++) { const [bk] = outline(v, yy); c.px(x + bk, top + yy, "h") }
  c.rect(x - 4, top + 28, 9, 1, "h")
  P(-2, b.head, "g", 5, 2); P(-2, b.head, "G", 4, 1)
  // the head: skin at the front, the hair (short, black) over the crown and down the back, the ear, the implant's point
  for (let yy = 0; yy < b.head; yy++) {
    const [bk, fr] = outline(v, yy), hairFront = yy < Math.ceil(b.head * 0.25) ? fr : yy < b.head * 0.7 ? 0 : 1
    for (let xx = fr; xx <= bk; xx++) c.px(x + xx, top + yy, xx >= hairFront ? "u" : "S")
  }
  const eye = Math.round(b.head * 0.45), ear = Math.round(b.head * 0.42)
  const [, fe] = outline(v, eye)
  P(fe + 2, eye, "k", 1, 2)                                 // the eye, two pixels tall, looking down at what she holds
  P(0, ear, "S", 2, 2); P(0, ear + 1, "s", 1, 1)            // the ear
  P(2, ear, "v")                                            // the implant: the cyan point behind it
  // the lanyard over the collarbone and down the chest, the badge at its end
  const ly = sh
  c.line(x + 1, top + ly - 1, x - 3, top + ly + 3, "c"); P(-3, ly + 3, "c", 1, 2)
  P(-4, ly + 5, "H", 2, 3)
  if (!box) {
    // the near arm hanging: over the middle of the body, a hair forward, the hand at the crotch
    for (let d = 0; d < 21; d++) { const w = d < 11 ? 3 : 2; c.rect(x - 1, top + sh + d, w, 1, d < 19 ? "G" : "S") }
    c.rect(x - 2, top + sh + 1, 1, 18, "h")
    return
  }
  // the box, held low against her with the arms nearly straight: its side 12 x 8 (40 by 25 cm), the bottom at the hips
  const by = sh + 8, bl = -16
  // what stands out of it: the cactus, the cup, the yellow coat folded, the stick
  P(bl + 2, by - 6, "q", 3, 6); P(bl + 3, by - 7, "Q", 1, 2)
  P(bl + 6, by - 3, "y", 5, 3); P(bl + 6, by - 3, "y", 4, 1)
  P(bl + 7, by - 5, "H", 3, 2)
  P(bl + 11, by - 2, "v", 1, 2)
  P(bl, by, "O", 13, 8); P(bl, by, "P", 13, 1); P(bl, by + 7, "o", 13, 1)
  // the near arm: the shoulder, the upper arm down and a little back (10 rows), the forearm forward under the box
  const ax = 0
  c.rect(x + ax - 1, top + sh, 4, 3, "G")
  for (let d = 0; d < 11; d++) c.rect(x + ax - 1 + Math.round(d * 0.1), top + sh + d, 3, 1, "G")
  c.rect(x + ax - 2, top + sh + 1, 1, 10, "h")
  for (let d = 0; d <= 10; d++) { const fy = top + sh + 10 + Math.round(d * 0.6); c.rect(x + ax - d, fy, 1, 2, "G"); c.px(x + ax - d, fy + 2, "h") }
  P(ax - 13, by + 8, "S", 4, 2)                             // the hand under the box
}

const SHEET_W = 300, SHEET_H = 92, FLOOR = 80
sprite("juno2088_side_blocks", { w: SHEET_W, h: SHEET_H }, (c) => {
  c.rect(0, 0, SHEET_W, SHEET_H, "3"); c.rect(0, FLOOR + 1, SHEET_W, SHEET_H - FLOOR - 1, "2"); c.hline(0, FLOOR + 1, SHEET_W, "4")
  // the door for scale, 2 m
  c.rect(4, FLOOR - 59, 22, 60, "4"); c.hline(4, FLOOR - 59, 22, "5"); c.vline(4, FLOOR - 59, 60, "5")
  // the guides from the measures: crown, shoulder, waist, crotch, knee (true heights)
  for (const [row, label] of [[0, "0"], [9, "9"], [20, "20"], [26, "26"], [36, "36"]]) for (let x = 40; x < 100; x += 2) c.px(x, FLOOR - 49 + row, "5")
  // silhouettes first: is it a body at all?
  silhouette(c, "A", 50, FLOOR, "k")
  silhouette(c, "B", 78, FLOOR, "k")
  // dressed, then with the box
  juno2088(c, "A", 120, FLOOR, false)
  juno2088(c, "B", 144, FLOOR, false)
  juno2088(c, "A", 188, FLOOR, true)
  juno2088(c, "B", 224, FLOOR, true)
  TXT.draw(c, 64, FLOOR + 4, "UMRISS A B", "6", { font: "hud", align: "center" })
  TXT.draw(c, 132, FLOOR + 4, "A B", "6", { font: "hud", align: "center" })
  TXT.draw(c, 205, FLOOR + 4, "A       B", "6", { font: "hud", align: "center" })
  TXT.draw(c, 270, FLOOR + 4, "HEUTE", "6", { font: "hud", align: "center" })
}, stamp("juno_in_idle_se", 270, FLOOR + 1, { frame: 0 }))

// ---------------------------------------------------------------- the ride D as blocks, 320x180 in the bars
const W = 320, H = 180, BAR = 23
const bars = (c) => { c.rect(0, 0, W, BAR, "k"); c.rect(0, H - BAR, W, BAR, "k") }

// D1, painted close and held about 3 s: the box from over its rim, about 700 px per metre, so a 10 cm stick carries the
// label. What moves in it is only the rings' light, bands sweeping up over the things (the things themselves hold still).
sprite("intro_d_blocks_close", { w: W, h: H }, (c) => {
  c.rect(0, 0, W, H, "n")
  for (const y of [40, 96]) c.rect(0, y, W, 14, "2")                                   // a ring going by behind, blurred
  c.rect(0, 92, W, H - 92, "o")                                                        // inside the box, its far wall
  c.rect(0, 88, W, 4, "P")                                                             // the far rim
  c.rect(30, 108, 260, 40, "y"); c.rect(30, 108, 260, 3, "#fff070"); c.rect(30, 128, 260, 2, "#9a7406")  // the coat, folded
  c.rect(44, 60, 34, 52, "q"); c.rect(52, 48, 14, 16, "Q"); c.rect(38, 100, 46, 16, "O")   // the cactus in its pot, left
  c.rect(232, 62, 44, 46, "H"); c.rect(232, 62, 44, 3, "W"); c.rect(276, 72, 8, 20, "H")   // the cup, right
  c.rect(100, 116, 120, 22, "4"); c.rect(100, 116, 120, 2, "5"); c.rect(220, 120, 12, 14, "6")  // the stick, on the coat
  c.rect(108, 120, 100, 14, "H")
  TXT.draw(c, 158, 124, "EVAL-7 // DELETE", "k", { font: "hud", align: "center" })
  c.rect(0, 148, W, 32, "O"); c.rect(0, 148, W, 3, "P")                                 // the near wall of the box
  c.rect(280, 120, 40, 40, "g"); c.rect(274, 138, 20, 12, "S")                          // her sleeve and hand on the rim
  bars(c)
})

// the rings going up past the lift: from the Krone's cold light down to the Ninth's neon (stage 0, 1, 2)
function ride(c, stage) {
  const KEYS = [["5", "#dafcff", "#62def0"], ["4", "#fff4d8", "#62def0"], ["3", "#eea040", "#ff4fd3"]][stage]
  c.rect(0, 0, W, H, stage === 2 ? "1" : "2")
  // the far city in the gap between rings, sliding slowly: a few lights
  for (let i = 0; i < 60; i++) c.px((i * 53) % W, 30 + (i * 37) % 120, stage === 2 ? "#b0602a" : "4")
  // the streaks of what is close: long, thin, upward; the ring's deck with its window band rushing through
  for (let x = 2; x < W; x += 3) { const y0 = (x * 41 + stage * 70) % H, len = 12 + (x * 13) % 34; c.vline(x, y0, len, (x * 7) % 11 === 0 ? KEYS[2] : "3") }
  const ry = [48, 96, 30][stage]
  c.rect(0, ry, W, 34, KEYS[0]); c.rect(0, ry, W, 2, "6")
  for (let x = 4; x < W; x += 9) c.rect(x, ry + 10, 6, 10, (x * 3) % 5 ? KEYS[1] : KEYS[2])
  // the shaft's two rails, the lift's frame and floor; glass, so everything shows through it
  c.rect(82, 0, 5, H, "5"); c.rect(233, 0, 5, H, "5")
  const L = 92, R = 228, T = 58, F = 140
  c.rect(L, T, R - L, 4, "6"); c.rect(L, F, R - L, 6, "6"); c.rect(L, F + 6, R - L, 3, "4")
  c.rect(L, T, 2, F - T, "H"); c.rect(R - 2, T, 2, F - T, "H")
  c.line(L + 18, T + 8, L + 40, F - 10, "6"); c.line(R - 34, T + 8, R - 22, F - 26, "6")     // light on the glass
  for (let x = L + 2; x < R - 2; x++) if ((x & 1) === 0) c.px(x, F - 1, "4")
}
for (const [n, v, stage] of [["a", "A", 0], ["b", "B", 1], ["c", "B", 2]]) {
  sprite("intro_d_blocks_" + n, { w: W, h: H }, (c) => { ride(c, stage); juno2088(c, v, 176, 139, true); bars(c) })
}
sprite("intro_d_blocks", { w: W * 2 + 6, h: H * 2 + 6 }, (c) => {
  c.rect(0, 0, W * 2 + 6, H * 2 + 6, "n")
  ;["close", "a", "b", "c"].forEach((n, i) => c.stamp("intro_d_blocks_" + n, (i % 2) * (W + 6), Math.floor(i / 2) * (H + 6)))
})

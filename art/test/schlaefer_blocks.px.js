// Chapter 1: the man asleep behind the counter of SUDS & SPIN (game/kapitel1.js: the prop `sleeper` in the laundromat at AW.sleeper and
// in CAM 23 at A23.sleeper; "Hinter der Theke schläft ein Mann, seit Jahren."), as blocks for approval before he is painted. He replaces
// mock_sleeper (art/mock/ch1_blocks.px.js). Street mode, 30 px a meter (Juno 50 px): he sits at the map's spot `sleeper` (0.3, 3.05 m),
// between the left back wall and the counter (0.6 to 1.05, 2.75 to 3.3, 1 m high), facing the room (se, toward the counter), on a chair
// tipped back against the wall; the chair is in his figure. A prop, never mirrored, so the Lull patch behind his right ear (the one
// toward us, on the screen's left of his head) stays where it is: an oval pale disc with its rim and stripe, as on everyone (Teo's in
// art/ui/splash.px.js, at this scale as the regular's in art/characters/lucky_people.px.js).
// What shows in the room: the counter (with the register on it) is in front of him and hides everything right of its left edge below its
// top, so his legs, the seat's front and the chair's front legs are never seen; what reads is the chair's back against the wall, his head,
// his shoulders and whatever hangs down on the wall's side. So the two ways differ above the counter:
//   A  an older, thin man in a grey jacket over a dark shirt, bald with a grey fringe; his head fallen onto his right shoulder toward the
//      wall, mouth open; his right arm hanging down beside the chair to the floor, the left hand on his belly; an orange shop chair
//   B  a heavier man in a dark quilted vest over a white undershirt, bare forearms crossed on his belly; a pale green work cap pulled down
//      over his eyes, his head dropped onto his left shoulder, the mouth open under the peak; the same chair
//   schlaefer_blocks_a, _b       each alone, 33x48, pivot bottom (the spot `sleeper` under the chair's back legs)
//   schlaefer_blocks             the sheet: Juno's 50 px bar, A, B, then A and B as the counter leaves them (its outline from
//                                game/rooms/laundromat.layout.js laid over them)
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  // skin (A paler and older, B darker), the open mouth
  S: "#d0967a", s: "#9a6450", N: "#a8705a", n: "#6e4232", o: "#3a1a1c",
  // A: the grey jacket lit, mid, shade; the dark shirt; the grey fringe (a mid grey: pale, it ran into the Lull patch beside it)
  G: "#9aa2b4", g: "#6a7286", h: "#454c60", d: "#262c3c", w: "#86827c",
  // B: the quilted vest lit, mid, its seams; the white undershirt and its shade; the cap and its peak
  V: "#3e6460", v: "#2a4644", e: "#18282a", u: "#e6e2d4", U: "#a8a498", C: "#9ad4a8", c: "#4e8a66",
  // the shop's plastic chair (as its chairs at the window), its steel legs
  P: "#c06a2e", O: "#6e3a1e", t: "#8e96a8",
  // Lull: the patch, its rim, its stripe
  L: "#c8d8e8", l: "#7890a8", "~": "#eef6ff",
  y: "#eec414",
})
include("../lib/text.js")

// the sprite's frame: 33x48, its bottom centre on the spot `sleeper`, (56, 132) on the laundromat's screen; so a point (sx, sy) of the
// room lies at (sx - 40, sy - 83) in it. Measured from the map (P(u, v, h) = [144 + 32u - 32v, 78 + 16u + 16v - 30h]): the wall behind
// him meets the floor at x 6, the chair's back leans on it at 0.9 m (6, 17), its seat's back edge at (11, 34); the counter's left edge
// stands at x 16 from y 31 down, its top edge runs from (14, 26) up to (24, 21) and the register's corner (30, 12): right of that, below
// it, nothing of him is ever seen
const W = 33, H = 48
/** a small hand-placed grid, "." leaves what is under it */
const g = (c, x, y, rows) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== ".") c.px(x + i, y + j, ch) }))

/** the chair tipped back on its back legs: the back panel (across him, along the wall) leaning on the wall, the seat, the legs */
function chair(c) {
  // the back legs, steel, from the seat's back corners to the floor, their feet a little forward of the top (it is tipped)
  c.line(5, 38, 8, 47, "t"); c.line(18, 32, 21, 44, "t")
  // the seat, a plane seen from above and in front, rising a little to its front edge (from x 16 behind the counter), its thickness
  c.poly([5, 37, 18, 31, 31, 36, 18, 42], "P"); c.line(5, 38, 18, 43, "O"); c.line(18, 43, 31, 37, "O")
  // the back panel, across him and leaning back against the wall: its top on the wall at 0.9 m, its bottom on the seat's back edge
  // (its top a little under his shoulders, so that it never reads as a collar: only its corner by his right shoulder shows)
  c.poly([0, 22, 13, 16, 18, 31, 5, 37], "P"); c.line(0, 22, 5, 37, "O")
}

/** the trousers: the thighs along the seat to the knees and the shins down to the floor (behind the counter but for their start) */
function legs(c, wide) {
  c.poly([6, 36, 20, 30, 33, 36, 19, 42], "2"); c.line(6, 36, 20, 30, "3")
  c.rect(26, 37, 3 + wide, 10, "2"); c.rect(21, 40, 3 + wide, 7, "3")
}

/** A: the older thin man, grey jacket, head on his right shoulder, an arm hanging */
function manA(c, o = {}) {
  const u = o.breath ? 1 : 0
  chair(c); legs(c, 0)
  // the torso lying back on the panel: shoulders (his right lower, on the screen's left) to the hips on the seat; the jacket open over
  // the dark shirt
  c.poly([3, 21 - u, 16, 15 - u, 19, 31, 7, 37], "G"); c.line(3, 21 - u, 7, 37, "h"); c.line(4, 21 - u, 8, 37, "g"); c.line(16, 15 - u, 19, 31, "g")
  c.poly([9, 19 - u, 12, 18 - u, 15, 32, 12, 34], "d"); c.line(12, 18 - u, 15, 32, "g")
  // his left hand on his belly
  g(c, 10, 28, ["SSs", "sSs"])
  // his right arm hanging down by the chair, on the wall's side: the sleeve, the hand open beside the back leg
  c.rect(1, 21 - u, 3, 13 + u, "g"); c.vline(1, 21 - u, 13 + u, "h"); g(c, 1, 34, ["SSS", "SSs", "S.s"])
  // the neck; the head fallen onto his right shoulder (to the wall), the face turned up a little to the room, eyes shut, mouth open:
  // bald and lit on top, the grey fringe round the back, his right ear and behind it the Lull patch
  c.rect(6, 18 - u, 4, 3, "s")
  g(c, 0, 9 - u, [
    "..SSSS....",
    ".SSSSSSS..",
    "SSSSSSSSS.",
    "wSSSSSkSSS",
    "wwSSSSSkSS",
    ".l.sSSSSSS",
    "lLLsSSSSoS",
    "lL~wSSSSoS",
    ".lwwSSSSS.",
    "...wwsss..",
  ])
}

/** B: the heavier man, quilted vest over a white undershirt, arms crossed, the cap over his eyes, head on his left shoulder */
function manB(c, o = {}) {
  const u = o.breath ? 1 : 0
  chair(c); legs(c, 1)
  // the torso: broad shoulders, the belly round over the belt; the white undershirt down the middle, the vest's fronts, its quilting
  c.poly([1, 22 - u, 18, 14 - u, 21, 22, 22, 30, 6, 39, 3, 32], "V")
  c.poly([9, 18 - u, 14, 16 - u, 19, 25, 19, 31, 13, 35, 11, 28], "u"); c.line(9, 18 - u, 11, 28, "U")
  c.line(1, 22 - u, 6, 39, "e"); c.line(2, 22 - u, 7, 39, "v")
  for (const y of [26, 31]) c.line(2, y, 9, y - 3, "e")
  // the upper arms at his sides in the vest's armholes, bare; the forearms crossed on his belly, the hands tucked under the elbows
  c.rect(0, 21 - u, 3, 8, "N"); c.vline(0, 21 - u, 8, "n")
  g(c, 2, 28, [
    "NNNNNNNNNNNNNNNn.",
    "nNNNNNNNNNNNNNNNn",
    ".nnnnnnnnnnnnnnn.",
  ])
  // the neck; the head dropped onto his left shoulder (the screen's right), the cap down over his eyes, its peak out over the face,
  // mouth open under it; his right ear and behind it the Lull patch, under the cap's back
  // (the head well over to the screen's right of the neck and a row lower, the cap's crown leaning further: dropped, not upright)
  c.rect(11, 17 - u, 4, 3, "n"); c.px(10, 18 - u, "n")
  g(c, 8, 7 - u, [
    ".......CCCC..",
    "....CCCCCCCC.",
    "...CCCCCCCCCC",
    ".CCCCCCCCCCCC",
    ".lCCCCCCCcccc",
    "lLLnNcccccccc",
    "lL~nNNNNNN...",
    ".lnNNNNNoN...",
    "..nNNNNNoN...",
    "...nNNNNN....",
  ])
}

sprite("schlaefer_blocks_a", { w: W, h: H, outline: "k", pivot: "bottom" }, (c) => manA(c))
sprite("schlaefer_blocks_b", { w: W, h: H, outline: "k", pivot: "bottom" }, (c) => manB(c))

// the counter's outline (game/rooms/laundromat.layout.js, `counter.shape`) in the sprite's frame: the spot `sleeper` is (56, 132) on
// screen, the sprite's bottom centre; with the register on the counter's top
const COUNTER = [70, 95, 74, 97, 79, 96, 80, 100, 94, 108, 92, 112, 92, 140, 75, 149, 69, 149, 56, 142, 56, 114, 54, 109, 64, 104]

const SHEET_W = 232, SHEET_H = 66, FLOOR = 60
sprite("schlaefer_blocks", { w: SHEET_W, h: SHEET_H }, (c) => {
  c.rect(0, 0, SHEET_W, SHEET_H, "3")
  c.rect(0, FLOOR, SHEET_W, SHEET_H - FLOOR, "1")
  c.rect(10, FLOOR - 50, 3, 50, "y"); TXT.draw(c, 3, 2, "JUNO 50", "6", { font: "hud" })
  const at = [[45, "a", "A"], [85, "b", "B"], [135, "a", "A"], [192, "b", "B"]]
  for (const [x, v, label] of at) {
    c.stamp(`schlaefer_blocks_${v}`, x, FLOOR)
    TXT.draw(c, x, 2, label, "6", { font: "hud", align: "center" })
  }
  TXT.draw(c, 163, 10, "BEHIND THE COUNTER", "5", { font: "hud", align: "center" })
  // the counter over the last two, where it stands in front of him (the spot's (56, 132) on the sprite's bottom centre)
  for (const x of [135, 192]) c.poly(COUNTER.map((v, i) => (i % 2 ? v - 132 + FLOOR : v - 56 + x)), "4")
})

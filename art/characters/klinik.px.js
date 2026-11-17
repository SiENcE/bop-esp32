// Chapter 2, Lull-Klinik 9-Ost from the inside (kapitel2-design §3.2, §10): its people in street mode, painted on the lines of the blocks
// the user approved (art/test/klinik_figuren_blocks.px.js, 2026-11-17). Light from the upper left, as everyone in street mode; the
// room's lamps light them at runtime.
//   marit_sit      Marit Holm, the nurse at the intake (dialog-style-guide §6), sitting behind the reception's glass on an office chair,
//                  facing the room (SE): in her forties, an ash-blond bun with a lilac tie, small glasses, the short white coat to the
//                  hips with two pens in its breast pocket and her name tag, lilac scrubs under it (her colour, #c8b0e0); no Lull behind
//                  her ear. 24x39 inside (26x41 with the outline), pivot bottom (the chair's foot); 2 frames, she blinks. A prop in the
//                  room, as the sleeper in the laundromat: so she always lies behind the counter
//   wartende_1-3   the tired on the joined seats, facing the room (SW), Lull behind the ear toward us (the oval pale disc with its
//                  darker rim and brighter stripe, as Teo's), drawn so, never mirrored: an old man in a grey cardigan slumped forward,
//                  his head nodding; a woman in a dock worker's jacket with a reflective band, her head back against the wall, eyes
//                  shut; a young man in a dark hoodie, its strings hanging, elbows on his knees, staring at the floor. 20x44 inside
//                  (22x46), pivot bottom; their hips sit at (12, 26) on the seat. 2 frames each, slow: they breathe, the old man nods
"use strict"
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8e9ab0",
  // the coat's white: lit, mid, shade, the deep fold
  L: "#eef3f8", X: "#d3dce8", h: "#9aa8bc", H: "#6e7a90",
  // her scrubs: light, lilac, its shade; the name tag
  i: "#e0d0f0", u: "#c8b0e0", U: "#8e78a8", n: "#5c4a74",
  // skin: Marit's and the woman's (lit, mid, shade), the old man's, the young man's; the mouth
  F: "#ecb898", S: "#d79676", s: "#93583f", T: "#c08a68", t: "#7a4e3a", W: "#9a6448", w: "#5a3426", o: "#4a2228",
  // hair: ash blond (light, mid, shade), grey, black and its sheen
  A: "#e4d8ac", B: "#c8b88a", b: "#8e8060", G: "#b4b4b4", g: "#76767c", a: "#1e1a22", m: "#3a3440",
  // the cardigan (light, mid, shade, buttons), the jacket's dull teal (light, mid, shade) and its band, the hoodie (light, mid, shade),
  // trousers and shoes
  D: "#8a8e9c", C: "#6e7280", c: "#4a4e5a", K: "#2e3038",
  R: "#6a9a96", J: "#4e7a78", j: "#2e4e50", O: "#b8c8c8",
  N: "#3e3e50", Z: "#2a2a36", z: "#18181f", d: "#1c2232",
  // the office chair
  e: "#2a3040", E: "#3c4458",
})
pal({ P: "#c8d8e8", p: "#7890a8", "~": "#eef6ff" })   // Lull: the disc, its rim, its stripe

;(() => {

const g = (c, x, y, rows) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== ".") c.px(x + i, y + j, ch) }))
/** paints only over what is already one of `keys`, so detail never changes the block's outline */
const on = (c, x, y, k, keys) => { if (keys.includes(c.key(x, y))) c.px(x, y, k) }
/** Lull behind an ear: the oval pale disc, its darker rim, the brighter stripe (Teo's, at this scale) */
const lull = (c, x, y) => g(c, x, y, [".p", "pP", "p~", ".p"])

// ================================================================ Marit, sitting SE behind the glass
function marit(c, f) {
  // the office chair: its back behind her (left), the seat, the stem and the foot with its castors
  c.rect(1, 12, 4, 15, "e"); c.vline(1, 13, 13, "E"); c.hline(2, 12, 2, "E")
  c.rect(3, 26, 14, 3, "e"); c.hline(3, 26, 13, "E")
  c.rect(9, 29, 2, 7, "3"); c.vline(9, 29, 7, "4")
  c.rect(4, 36, 13, 2, "3"); c.hline(4, 36, 12, "4"); c.px(4, 37, "k"); c.px(10, 37, "k"); c.px(16, 37, "k")
  // the scrubs: thighs forward to the right, the shins down; white clogs
  c.poly([6, 25, 15, 24, 21, 28, 20, 31, 8, 30], "u"); c.line(8, 30, 20, 31, "U"); c.line(7, 25, 15, 24, "i")
  c.rect(17, 30, 4, 8, "u"); c.vline(17, 30, 8, "i"); c.vline(20, 31, 7, "U")
  c.rect(16, 37, 6, 2, "X"); c.hline(16, 37, 4, "L"); c.hline(16, 38, 6, "h")
  // the short coat to the hips, open over the scrubs: the far side (left, toward the light) lit, the near side in shade
  c.poly([5, 12, 17, 12, 18, 27, 5, 27], "X")
  c.vline(5, 12, 16, "L"); c.vline(6, 13, 14, "L"); c.vline(17, 13, 14, "h"); c.vline(18, 15, 12, "h")
  c.hline(5, 27, 14, "h")                                                       // the hem's shadow on the scrubs
  // the scrubs' V and front between the coat's edges, the lapels folded back
  c.rect(11, 13, 3, 14, "u"); c.vline(11, 13, 14, "U"); c.px(12, 13, "U"); c.px(12, 14, "U")
  c.line(9, 12, 10, 16, "h"); c.line(15, 12, 14, 16, "h")
  // the breast pocket on her right (the far side) with two pens; her name tag on the left, its photo and her name as two lines
  c.hline(7, 17, 3, "h"); c.vline(7, 18, 3, "h"); c.px(8, 16, "U"); c.px(9, 15, "5"); c.px(9, 16, "5")
  c.rect(14, 16, 3, 2, "n"); c.px(14, 16, "L"); c.hline(15, 16, 2, "u"); c.hline(15, 17, 2, "i")
  c.vline(12, 20, 6, "U")                                                       // a fold down the scrubs
  // the near arm forward on the desk, the sleeve's underside in shade; the hand
  c.poly([16, 14, 19, 14, 22, 22, 19, 23], "X"); c.line(16, 15, 19, 23, "h"); c.line(19, 14, 22, 21, "L")
  c.rect(19, 22, 4, 2, "S"); c.hline(19, 23, 4, "s"); c.px(22, 22, "F")
  // the neck; the head turned to the lower right
  c.rect(10, 10, 3, 2, "s"); c.px(12, 10, "S")
  c.ellipse(11, 6, 4, 5, "B")
  // the bun at the back of her head, its lilac tie; the hair drawn back tight, lit on the crown
  c.ellipse(7, 3, 2, 2, "B"); c.px(6, 2, "A"); c.px(7, 2, "A"); c.px(8, 4, "b"); c.px(7, 5, "b"); c.px(9, 3, "u"); c.px(9, 4, "U")
  c.hline(9, 1, 4, "A"); c.hline(8, 2, 3, "A"); c.px(13, 1, "B")
  // the face: the forehead toward the light, the nose toward the room, a small mouth
  g(c, 9, 3, [
    "BBAABB",
    "BBFFFS",
    "BFFSSS",
    "BSSSSS",
    "BSSSSs",
    "bSSsS.",
    ".sss..",
  ])
  c.hline(8, 1, 1, "b"); c.vline(7, 6, 3, "b"); c.vline(8, 8, 2, "b")         // the hair's shade at the nape
  // the small glasses: the temple, the bridge and the far lens's rim round the eyes; she blinks in frame 1
  const eye = f === 1 ? "s" : "k"
  c.px(11, 6, eye); c.px(13, 6, eye); c.px(10, 6, "7"); c.px(12, 6, "7"); c.px(14, 6, "h"); c.px(13, 5, "h")
}
anim("marit_sit", { w: 24, h: 39, outline: "k", pivot: "bottom", frames: 2, ms: [3400, 160] }, (c) => marit(c, c.frame))

// ================================================================ the waiting, sitting SW on the joined seats
// As Lantern sits in his caravan: the torso from the front, turned a little to the lower left, the thighs a short block forward and
// down to the left, the shins straight down, the feet pointing left; the hips at (12, 26), on the seat.
/** o = { shirt: [light, mid, shade], legs: [mid, shade], skin: [light, mid, shade], hair: [mid, shade], droop, lean, back, elbows,
 *  bald, shut }; `b` the breath (0 or 1): the shoulders and the head a pixel lower, or the old man's head nodding */
function waiting(c, o, b) {
  const L = o.lean ?? 0, [s1, s2, s3] = o.shirt, [l1, l2] = o.legs, [k1, k2, k3] = o.skin
  // the shins straight down from the knees, the far one (right) in shade; the shoes pointing left, their soles
  c.rect(6, 31, 3, 9, l2); c.rect(1, 32, 3, 9, l1); c.vline(1, 32, 9, o.legsLit ?? l1)
  c.rect(5, 40, 5, 3, o.shoe ?? "d"); c.rect(0, 41, 5, 3, o.shoe ?? "d"); c.hline(0, 41, 3, "3"); c.hline(5, 40, 3, "2")
  if (o.soles) { c.hline(0, 43, 5, o.soles); c.hline(5, 42, 5, o.soles) }
  // the thighs: forward and down to the left, from the seat to the knees, lit along the top
  c.poly([6, 24, 17, 24, 17, 28, 10, 33, 1, 33, 1, 30], l1); c.line(9, 33, 17, 27, l2); c.line(1, 30, 6, 25, o.legsLit ?? l1)
  // the torso from the front, leaning forward by L; the far side (left, toward the light) lit, the near side in shade
  const top = 11 + L + b
  c.poly([5 - L, top, 17 - L, top, 17, 26, 6, 26], s2); c.vline(17 - L, top, 26 - top, s3); c.vline(16 - L, top + 1, 25 - top, s3)
  c.line(6 - L, top + 1, 7, 25, s1)
  // the arms: the hands on the thighs, or the forearms on the knees with the hands hanging between them
  if (o.elbows) {
    c.poly([3 - L, top + 1, 6 - L, top + 1, 6, 30, 3, 30], s3); c.line(3 - L, top + 1, 3, 29, s1)
    c.poly([16 - L, top + 1, 19 - L, top + 1, 10, 30, 7, 30], s3)
    c.rect(5, 30, 3, 3, k2); c.px(5, 30, k1); c.hline(5, 32, 3, k3)
  } else {
    c.poly([3 - L, top + 1, 6 - L, top + 1, 7, 26, 4, 26], s3); c.line(3 - L, top + 1, 4, 25, s1)
    c.poly([16 - L, top + 1, 19 - L, top + 1, 19, 25, 16, 25], s3)
    c.rect(4, 26, 3, 2, k2); c.px(4, 26, k1); c.rect(15, 26, 3, 2, k3)
  }
  o.clothes?.(c, top, L)
  // the neck and the head: forward and down (droop, and the old man nods with his breath), or tipped back against the wall
  const nod = o.nods ? b : 0
  const hx = 11 - L - (o.droop ?? 0), hy = top - 6 + (o.droop ?? 0) - (o.back ? 1 : 0) + nod - (o.nods ? 0 : b)
  c.rect(hx - 1, hy + 4, 3, 3, k3)
  c.ellipse(hx, hy, 4, 5, k2)
  c.px(hx - 2, hy - 3, k1); c.hline(hx - 3, hy - 2, 2, k1); c.vline(hx - 4, hy - 1, 2, k1)   // the forehead toward the light
  // the hair over the crown and down the back of the head (right); the old man only a fringe round the back
  const [h1, h2] = o.hair
  if (o.bald) { c.vline(hx + 4, hy - 1, 4, h1); c.vline(hx + 3, hy + 2, 2, h2); c.px(hx + 1, hy - 4, k1); c.px(hx, hy - 4, k1) }
  else {
    c.ellipse(hx + 1, hy - 3, 4, 2, h1); c.vline(hx + 4, hy - 2, 5, h1); c.vline(hx + 3, hy - 2, 3, h1)
    c.hline(hx - 1, hy - 5, 3, h2 === "m" ? "m" : h2)                                         // its sheen
    o.hairMore?.(c, hx, hy)
  }
  // the face turned a little to the lower left: the eyes shut (a line) or open, the nose, the mouth
  const ey = hy + (o.back ? 0 : 1)
  if (o.shut) { c.hline(hx - 3, ey, 2, k3); c.hline(hx, ey, 2, k3) }
  else { c.px(hx - 2, ey, "k"); c.px(hx + 1, ey, "k"); c.px(hx - 3, ey - 1, k3); c.px(hx, ey - 1, k3) }
  c.px(hx - 1, ey + 2, k3)
  c.hline(hx - 2, ey + 3, 2, o.mouth ?? k3)
  o.face?.(c, hx, hy, ey)
  // Lull behind the ear toward us (their left ear, on the screen's right): the ear, then the disc behind it
  c.px(hx + 2, hy + 1, k3)
  lull(c, hx + 3, hy)
}
const WAIT = {
  // the old man: the grey cardigan buttoned over a pale collar, its buttons; the trousers' crease; his nose a little red with age
  1: { shirt: ["D", "C", "c"], legs: ["4", "3"], legsLit: "5", skin: ["F", "T", "t"], hair: ["G", "g"], droop: 2, lean: 3, bald: true,
    shut: true, nods: true,
    clothes: (c, top, L) => {
      g(c, 9 - L, top, ["LhL"]); c.px(10 - L, top + 1, "h")
      for (const y of [top + 3, top + 6, top + 9]) c.px(11 - Math.round(L * (1 - (y - top) / (26 - top))), y, "K")
      c.line(11 - L, top + 2, 11, 25, "c")
    } },
  // the woman: the dock worker's jacket with its reflective band across the chest and the zip; her hair tied back, a tail behind
  2: { shirt: ["R", "J", "j"], legs: ["3", "2"], legsLit: "4", skin: ["F", "S", "s"], hair: ["a", "m"], back: true, shut: true, mouth: "o",
    clothes: (c, top) => {
      c.hline(5, top + 6, 11, "O"); c.hline(5, top + 7, 11, "h"); c.vline(11, top + 1, 25 - top, "j"); c.hline(9, top, 4, "j")
    },
    hairMore: (c, hx, hy) => { c.rect(hx + 5, hy + 1, 2, 4, "a"); c.px(hx + 5, hy + 1, "m") } },
  // the young man: the hoodie's hood bunched at his neck, its strings hanging, its pocket; trainers with white soles
  3: { shirt: ["N", "Z", "z"], legs: ["5", "4"], legsLit: "6", skin: ["W", "s", "w"], hair: ["a", "m"], droop: 1, lean: 4, elbows: true,
    soles: "X",
    clothes: (c, top, L) => {
      c.hline(7 - L, top, 9, "z"); c.hline(8 - L, top + 1, 7, "N")
      c.vline(10 - L, top + 2, 4, "7"); c.vline(13 - L, top + 2, 3, "7"); c.hline(7, 22, 8, "z")
    } },
}
for (const [n, o] of Object.entries(WAIT))
  anim(`wartende_${n}`, { w: 20, h: 44, outline: "k", pivot: "bottom", frames: 2, ms: [2600 + Number(n) * 300, 1900 + Number(n) * 200] }, (c) => waiting(c, o, c.frame))

})()

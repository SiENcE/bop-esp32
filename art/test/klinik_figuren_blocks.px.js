// Chapter 2, the clinic (kapitel2-design §3.2, §10): its people as blocks for the user's choice before anything is painted.
//   Marit Holm, the nurse at the intake (dialog-style-guide §6: the routine one; her colour lilac #c8b0e0, style guide §8): in her
//   forties, ash-blond hair in a tight bun, small glasses; a short white coat to the hips like Ines' but shorter, pale lilac scrubs under
//   it (her one colour), a name tag; no Lull behind her ear (she works nights). In street mode she sits behind the reception's glass on
//   an office chair, facing the room (SE); the counter hides her from the chest down, so the chair and legs are plain.
//   In CAM 21 she comes to her night shift at 19:00 from the left to the door under the camera, so the feed sees her from the front (SE,
//   walking), and twice she looks back over her shoulder (the head turned to the upper left); NE for her back, NW = NE mirrored (nothing
//   one-sided on her from behind). Ines' scale in that picture (13x20 inside): the short coat 9 to the hips, the scrubs 7 below it (Ines'
//   legs are 6 under a long coat), the bun a bright knot on top.
//   The waiting (§10): three tired people sitting on the joined seats along the right wall, facing the room (SW), each with Lull behind the ear
//   that faces us (the oval pale disc with its darker rim and brighter stripe, as Teo's); drawn facing SW, never mirrored:
//     W1 an old man in a grey cardigan, slumped forward, his head down, bald with a grey fringe
//     W2 a woman in a dock worker's jacket, her head back against the wall, eyes shut, hair tied back
//     W3 a young man in a dark hoodie, hood down, elbows on his knees, staring at the floor
//   klinik_figuren_blocks           the sheet: Juno for scale, the nurse (street, sitting SE; feed SE, SE looking back, NE), W1–W3
//   kfb_<name>                      each alone, pivot bottom-centre (for the shots in the game)
"use strict"
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8e9ab0",
  // the coat's white: lit, mid, shade
  L: "#eef3f8", X: "#d3dce8", h: "#9aa8bc",
  // her scrubs: lilac, its shade; the name tag
  u: "#c8b0e0", U: "#8e78a8", n: "#5c4a74",
  // skin: lit, shade (two tones of several); hair: ash blond, its shade; grey; dark
  S: "#d79676", s: "#93583f", T: "#c08a68", t: "#7a4e3a", B: "#c8b88a", b: "#8e8060", G: "#a8a8a8", g: "#6e6e74", a: "#1e1a22",
  // clothes of the waiting: the cardigan grey, the jacket's dull teal, the hoodie, trousers
  C: "#6e7280", c: "#4a4e5a", J: "#4e7a78", j: "#2e4e50", H: "#2a2a36", d: "#1c2232",
  // the chair; Lull's patch: the disc, its rim, its stripe
  e: "#2a3040",
  // phosphor (the feed), as art/characters/feed_people.px.js
  0: "#030a0a", 8: "#8acfae", 9: "#d4f7e2",
})
pal({ P: "#c8d8e8", p: "#7890a8", "~": "#eef6ff" })
pal({ q: "#071514", w: "#0c221f", x: "#12332d", y: "#1a483e", z: "#266252", v: "#388169", V: "#55a585" })
include("../lib/text.js")

const g = (c, x, y, rows) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== ".") c.px(x + i, y + j, ch) }))
/** Lull behind an ear: the oval pale disc, its darker rim, the brighter stripe (Teo's, at this scale) */
const lull = (c, x, y) => g(c, x, y, [".p", "pP", "p~", ".p"])

// ================================================================ the nurse in street mode, sitting SE behind the glass (24x40)
function nurseSit(c) {
  // the office chair: its back behind her (left), the seat, the stem and the foot
  c.rect(1, 12, 4, 15, "e"); c.rect(3, 26, 14, 3, "e"); c.rect(9, 29, 2, 7, "3"); c.rect(4, 36, 13, 2, "3")
  // the scrubs: thighs forward to the right, the shins down, plain white clogs
  c.poly([6, 25, 15, 24, 21, 28, 20, 31, 8, 30], "u"); c.line(8, 30, 20, 31, "U")
  c.rect(17, 30, 4, 8, "u"); c.vline(17, 30, 8, "U"); c.rect(16, 37, 6, 2, "X")
  // the short coat: shoulders to the hips, open over the scrubs, the near side lit
  c.poly([5, 12, 17, 12, 18, 27, 5, 27], "X"); c.vline(5, 12, 16, "h"); c.vline(17, 13, 14, "L"); c.vline(18, 15, 12, "L")
  c.rect(11, 13, 3, 14, "u"); c.vline(11, 13, 14, "U")                         // the scrubs' V and front between the coat's edges
  c.rect(14, 16, 3, 2, "n"); c.hline(14, 16, 3, "u")                           // the name tag
  // the arms forward on the desk (the counter hides them in the room)
  c.poly([16, 14, 19, 14, 22, 22, 19, 23], "X"); c.rect(19, 22, 4, 2, "S")
  // the neck, the head turned to the lower right; the bun at the back; small glasses
  c.rect(10, 10, 3, 2, "s")
  c.ellipse(11, 6, 4, 5, "B"); c.ellipse(7, 3, 2, 2, "B"); c.px(6, 2, "b"); c.px(7, 4, "b")
  g(c, 9, 4, [
    "BBSSSS",
    "BSSSSS",
    "BSkSkS",
    "BSSSSs",
    "bsSSs.",
    ".sss..",
  ])
  c.hline(10, 6, 5, "7"); c.px(12, 6, "k"); c.px(14, 6, "k")                  // the glasses' bridge, the eyes behind them
  c.hline(8, 1, 6, "b"); c.vline(7, 5, 4, "b")
}
sprite("kfb_nurse_sit", { w: 24, h: 39, outline: "k", pivot: "bottom" }, nurseSit)

// ================================================================ the nurse in CAM 21 (13x20, phosphor)
const FW = 13, FH = 20
function nurseFeed(c, o) {
  // legs: the scrubs 7 below the short coat, white clogs 9
  c.rect(4, 14, 2, 4, "V"); c.rect(7, 14, 2, 4, "V"); c.vline(6, 14, 4, "y")
  c.rect(3, 18, 3, 2, "9"); c.rect(7, 18, 3, 2, "9")
  // the short coat 9 to the hips, the arms at its sides
  c.rect(2, 6, 9, 9, "9"); c.vline(2, 6, 9, "8"); c.vline(10, 7, 7, "8"); c.rect(1, 7, 1, 6, "8"); c.rect(11, 7, 1, 6, "8")
  if (!o.back) { c.vline(6, 7, 7, "8"); c.rect(7, 8, 2, 1, "z") }                 // the coat's opening; the name tag
  else c.vline(6, 10, 5, "8")                                                     // the vent at the back
  // the head: from the front the face, the bun showing above; from behind the bun at the crown; looking back: the bun and the cheek
  if (o.back) g(c, 4, 0, [".vVv.", "vzzzv", "zzzzz", "yzzzy", ".yyy."])
  else if (o.lookBack) g(c, 3, 0, ["..vVv", ".vzzz", "zzzz8", "yzz88", ".yy8."])
  else g(c, 4, 0, [".vVv.", "vzzzv", "z888z", "z8x8x", ".888."])
}
for (const [name, o] of [["se", {}], ["se_back", { lookBack: true }], ["ne", { back: true }]])
  sprite(`kfb_nurse_feed_${name}`, { w: FW, h: FH, outline: "q", pivot: "bottom" }, (c) => nurseFeed(c, o))

// ================================================================ the waiting, sitting SW on the joined seats (20x44)
// As Lantern sits in his caravan (art/characters/lantern.px.js): the torso from the front, turned a little to the lower left, the
// thighs a short block forward and down to the left, the shins straight down, the feet pointing left. The hips sit at (12, 26), on the
// seat; the feet stand about a quarter meter in front of it.
/** a tired person sitting facing SW: o = { shirt, shirtD, legs, legsD, skin, skinD, hair, droop (head forward and down), lean
 *  (shoulders forward and down), back (head back against the wall), elbows (forearms on the knees), bald, shut } */
function waiting(c, o) {
  const L = o.lean ?? 0
  // the shins straight down from the knees, the far one (right) in shade; the shoes pointing left
  c.rect(6, 31, 3, 9, o.legsD); c.rect(1, 32, 3, 9, o.legs)
  c.rect(5, 40, 5, 3, "d"); c.rect(0, 41, 5, 3, "d"); c.hline(0, 41, 3, "3")
  // the thighs: forward and down to the left, from the seat to the knees
  c.poly([6, 24, 17, 24, 17, 28, 10, 33, 1, 33, 1, 30], o.legs); c.line(9, 33, 17, 27, o.legsD)
  // the torso from the front, leaning forward by L (the shoulders lower and further left)
  const top = 11 + L
  c.poly([5 - L, top, 17 - L, top, 17, 26, 6, 26], o.shirt); c.vline(17 - L, top, 26 - top, o.shirtD); c.vline(16 - L, top + 1, 25 - top, o.shirtD)
  // the arms: the hands on the thighs, or the forearms on the knees with the hands hanging between them
  if (o.elbows) {
    c.poly([3 - L, top + 1, 6 - L, top + 1, 6, 30, 3, 30], o.shirtD); c.poly([16 - L, top + 1, 19 - L, top + 1, 10, 30, 7, 30], o.shirtD)
    c.rect(5, 30, 3, 3, o.skin)
  } else {
    c.poly([3 - L, top + 1, 6 - L, top + 1, 7, 26, 4, 26], o.shirtD); c.poly([16 - L, top + 1, 19 - L, top + 1, 19, 25, 16, 25], o.shirtD)
    c.rect(4, 26, 3, 2, o.skin); c.rect(15, 26, 3, 2, o.skinD)
  }
  // the neck and the head: forward and down (droop), or tipped back against the wall
  const hx = 11 - L - (o.droop ?? 0), hy = top - 6 + (o.droop ?? 0) - (o.back ? 1 : 0)
  c.rect(hx - 1, hy + 4, 3, 3, o.skinD)
  c.ellipse(hx, hy, 4, 5, o.skin)
  // the face turned a little to the lower left; the hair over the crown and down the back of the head (right)
  if (o.bald) { c.vline(hx + 4, hy - 1, 4, o.hair); c.vline(hx + 3, hy + 2, 2, o.hair); c.px(hx + 1, hy - 4, "S") }
  else { c.ellipse(hx + 1, hy - 3, 4, 2, o.hair); c.vline(hx + 4, hy - 2, 5, o.hair); c.vline(hx + 3, hy - 2, 3, o.hair) }
  const ey = hy + (o.back ? 0 : 1)
  if (o.shut) { c.hline(hx - 3, ey, 2, o.skinD); c.hline(hx, ey, 2, o.skinD) }
  else { c.px(hx - 2, ey, "k"); c.px(hx + 1, ey, "k") }
  c.px(hx - 1, ey + 2, o.skinD)                                                 // the nose
  c.hline(hx - 2, ey + 3 + (o.back ? -0 : 0), 2, o.skinD)                       // the mouth
  // Lull behind the ear toward us (their left ear, on the screen's right)
  lull(c, hx + 3, hy)
}
const WAIT = {
  w1: { shirt: "C", shirtD: "c", legs: "4", legsD: "3", skin: "T", skinD: "t", hair: "G", droop: 2, lean: 3, bald: true, shut: true },
  w2: { shirt: "J", shirtD: "j", legs: "3", legsD: "2", skin: "S", skinD: "s", hair: "a", back: true, shut: true },
  w3: { shirt: "H", shirtD: "1", legs: "5", legsD: "4", skin: "s", skinD: "t", hair: "a", droop: 1, lean: 4, elbows: true },
}
for (const [id, o] of Object.entries(WAIT)) sprite(`kfb_${id}`, { w: 20, h: 44, outline: "k", pivot: "bottom" }, (c) => waiting(c, o))

// ================================================================ the sheet
sprite("_kfb_juno_se", { png: "../../build/art/characters/anims/juno_idle_se.png", area: [0, 0, 27, 50], pivot: "bottom" })
const SW = 260, SH = 120, FY = 72
scene("klinik_figuren_blocks", { w: SW, h: SH, bg: "3" }, (c) => {
  c.rect(0, FY, SW, 48, "4")
  c.stamp("_kfb_juno_se", 18, FY); TXT.draw(c, 18, 3, "JUNO", "7", { font: "hud", align: "center" })
  c.stamp("kfb_nurse_sit", 52, FY); TXT.draw(c, 52, 3, "MARIT", "u", { font: "hud", align: "center" }); TXT.draw(c, 52, 10, "SE", "6", { font: "hud", align: "center" })
  // the feed figures on a phosphor ground, at their own scale
  c.rect(74, 14, 64, 62, "w"); c.rect(74, 60, 64, 16, "x")
  TXT.draw(c, 106, 3, "CAM 21", "V", { font: "hud", align: "center" })
  ;[["se", "SE"], ["se_back", "ZURUECK"], ["ne", "NE"]].forEach(([n, lab], i) => {
    c.stamp(`kfb_nurse_feed_${n}`, 86 + i * 20, 70); TXT.draw(c, 86 + i * 20, 18 + (i % 2) * 6, lab, "8", { font: "hud", align: "center" })
  })
  ;["w1", "w2", "w3"].forEach((id, i) => {
    c.stamp(`kfb_${id}`, 162 + i * 32, FY); TXT.draw(c, 162 + i * 32, 3, id.toUpperCase(), "7", { font: "hud", align: "center" })
  })
  TXT.draw(c, 194, 10, "SW", "6", { font: "hud", align: "center" })
})

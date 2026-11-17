// Chapter 2, the clinic (kapitel2-design §3.2, §10): its people as blocks for the user's choice before anything is painted.
//   Marit Holm, the nurse at the intake (dialog-style-guide §6: the routine one; her colour lilac #c8b0e0, style guide §8): in her
//   forties, ash-blond hair in a tight bun, small glasses; a short white coat to the hips like Ines' but shorter, pale lilac scrubs under
//   it (her one colour), a name tag; no Lull behind her ear (she works nights). In street mode she sits behind the reception's glass on
//   an office chair, facing the room (SE); the counter hides her from the chest down, so the chair and legs are plain.
//   In CAM 21 she comes to her night shift at 19:00 from the left to the door under the camera, so the feed sees her from the front (SE,
//   walking), and twice she looks back over her shoulder (the head turned to the upper left); NE for her back, NW = NE mirrored (nothing
//   one-sided on her from behind). Ines' scale in that picture (13x20 inside): the short coat 9 to the hips, the scrubs 7 below it (Ines'
//   legs are 6 under a long coat), the bun a bright knot on top.
//   The waiting (§10): three tired people on the joined seats along the right wall, facing the room (SW), each with Lull behind the ear
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

// ================================================================ the waiting, sitting SW on the joined seats (22x40)
/** a tired person sitting facing SW: o = { shirt, shirtD, legs, skin, skinD, hair, droop (head forward and down), lean (shoulders
 *  forward), back (head back against the wall), elbows (forearms on the knees), bald } */
function waiting(c, o) {
  // shoes and shins, the thighs from the hip (right, on the seat) forward to the knee (left)
  c.rect(2, 36, 6, 3, "d"); c.rect(4, 30, 3, 6, o.legs); c.vline(6, 30, 6, "d")
  c.poly([5, 28, 14, 23, 18, 27, 7, 32], o.legs)
  // the torso: hips on the seat, the shoulders leaning forward by `lean`
  const L = o.lean ?? 0, top = 12 + (o.back ? -1 : 0)
  c.poly([10 - L, top, 19 - L, top, 19, 27, 11, 27], o.shirt); c.vline(19 - L, top, 27 - top, o.shirtD)
  // the arms: on the thighs, or the forearms on the knees with the hands hanging
  if (o.elbows) { c.poly([9 - L, top + 2, 12 - L, top + 2, 9, 27, 6, 26], o.shirtD); c.rect(4, 26, 3, 2, o.skin) }
  else { c.poly([9 - L, top + 2, 12 - L, top + 2, 11, 24, 8, 24], o.shirtD); c.rect(7, 24, 3, 2, o.skin) }
  // the neck and head: down and forward (droop), or back against the wall
  const hx = 13 - L - (o.droop ?? 0), hy = top - 5 + (o.droop ?? 0) - (o.back ? 1 : 0)
  c.rect(hx, hy + 4, 3, 3, o.skinD)
  c.ellipse(hx + 1, hy, 4, 5, o.skin)
  // the face to the lower left: the eyes shut (a line) or open (dots); the hair over the crown and the back (right)
  if (o.bald) { c.hline(hx + 2, hy - 1, 3, o.hair); c.vline(hx + 5, hy - 2, 4, o.hair); c.px(hx + 4, hy - 4, "S") }
  else { c.ellipse(hx + 2, hy - 2, 4, 3, o.hair); c.vline(hx + 5, hy - 2, 5, o.hair) }
  if (o.shut) c.hline(hx - 2, hy + 1, 2, o.skinD); else { c.px(hx - 2, hy + 1, "k"); c.px(hx, hy + 1, "k") }
  c.px(hx - 3, hy + 2, o.skinD)                                                 // the nose
  // Lull behind the ear toward us (their left ear, at the back of the head on the screen's right)
  lull(c, hx + 4, hy + 1)
}
const WAIT = {
  w1: { shirt: "C", shirtD: "c", legs: "4", skin: "T", skinD: "t", hair: "G", droop: 3, lean: 3, bald: true, shut: true },
  w2: { shirt: "J", shirtD: "j", legs: "3", skin: "S", skinD: "s", hair: "a", back: true, shut: true },
  w3: { shirt: "H", shirtD: "1", legs: "5", skin: "s", skinD: "t", hair: "a", droop: 2, lean: 2, elbows: true },
}
for (const [id, o] of Object.entries(WAIT)) sprite(`kfb_${id}`, { w: 22, h: 39, outline: "k", pivot: "bottom" }, (c) => waiting(c, o))

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

// Chapter 1's four street figures as blocks, for approval before anything is painted (they replace mock_regen,
// mock_imai, mock_prediger and mock_monteur of art/mock/ch1_blocks.px.js; kapitel1-design §7; style guide §4, §6, §8a).
// Flat shapes at the right size and proportion, no shading detail, no dithering. Not built into the game.
//   stadt_people_blocks        the line-up beside Juno, Bao and Motte, and the same as silhouettes
//   stadt_people_blocks_room   each in their place (2x2), the four panels stadt_room_* side by side
//
// The figures are drawn facing SE and flipped for SW, as Bao and Motte are. All of them stay put, so one view each
// is enough, but for the fitter: at work he has his back to us and his hand on the screen (NE), to talk he turns (SE/SW).
//   Regenleserin  38 px sitting on a bucket (she would stand 45). Pale blue plastic cape, a sou'wester; her tech a drop
//                 counter clipped to the bucket in her hand, its cyan light blinks with every drop.
//   Frau Imai     41 px sitting at a small round table, her head propped on her hand. A sage cardigan, her hair up in a
//                 bun, so the ear is bare and the Lull point shows (Lull's own #cfe6ff, #6ab4ff, art/kit/kessel_14.kit.px.js).
//   Prediger      54 px on a crate of 12: 66 in all. Thin, sand coat, wild hair, a thermos held low and one held high; his tech
//                 a home-made counter on a cord round his neck, the days he has been awake (9, 10, 11, as his lines count).
//   Monteur       52 px. Stocky in a long work coat with the wet in its hem, a hard hat; his tech the head lamp. The contract's
//                 number on his back (9-A; the right half is 9-B). His scaffold, as it would stand: drawn in stadt_room_kowalski.
//
// The rooms and the finished figures are read as pictures from scratch, so that this file checks alone and quickly.
// To have them there, after `sh tools/build_art.sh characters mock` and `room kowalski` have been run once:
//   mkdir -p build/art/blocks_stadt_src; copy from build/art/characters/anims juno_idle_se, juno_idle_ne, bao_idle_sw,
//   motte_talk_sw; from build/art/mock dach_bg (anims), lucky_static_bg, drain_market_bg (scenes); from
//   build/art/rooms/kowalski/anims kowalski_bg, _vending, _cart, _bins, _umbrella, _lights.
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8e9ab0",
  // Regenleserin (#a8c8e8): the cape, its shade, the hat; white hair, her skin; the buckets
  B: "#a8c8e8", b: "#7492b8", n: "#4c6488", H: "#e0e4e8", R: "#b27a58", r: "#7a4c38", G: "#8e96a8", g: "#565e70",
  // tech and water
  v: "#62def0", V: "#dafcff",
  // Imai (#c8d8b0): the cardigan, its shade; her hair, its grey; skin; Lull bright and dim; the cup, cold tea
  C: "#c8d8b0", c: "#92a47e", a: "#2c2e38", A: "#6a6e7a", I: "#e4bc9c", i: "#b08a6c", "~": "#cfe6ff", "^": "#6ab4ff",
  W: "#f0f0e0", w: "#b8b8a8", t: "#552b1c",
  // Prediger (#d8c8a0): the coat, its shade, its seams; hair; gaunt skin; the thermoses, their amber caps
  D: "#d8c8a0", d: "#a69670", e: "#6e6244", u: "#8a5a34", p: "#d8b494", q: "#9a7458", T: "#a8b4c4", x: "#6c7888", Q: "#eea040",
  // Monteur (#b0c0b0): the coat, its shade, where it is wet; the hard hat; skin; his belt and the scaffold's boards
  M: "#b0c0b0", m: "#7c8c84", N: "#4e5e5a", Z: "#dce0d4", z: "#a0a89c", S: "#d79676", s: "#93583f", O: "#552b1c", P: "#8a5a34",
  // his sleeping bag, washing, the flame
  E: "#5c5e3c", f: "#3e4030", l: "#7a6a8a", F: "#ffd58a",
})
include("../lib/text.js")

const SRC = "../../build/art/blocks_stadt_src/"

/** rows from (x0a..x1a at ya) to (x0b..x1b at yb), straight sides, lit on the left and in shade on the right */
const taper = (c, ya, x0a, x1a, yb, x0b, x1b, lit, shade, sw = 3) => {
  for (let y = ya; y <= yb; y++) {
    const t = yb === ya ? 0 : (y - ya) / (yb - ya), x0 = Math.round(x0a + (x0b - x0a) * t), x1 = Math.round(x1a + (x1b - x1a) * t)
    for (let x = x0; x <= x1; x++) c.px(x, y, x > x1 - sw ? shade : lit)
  }
}
/** a thick line: t rows of it, one under the other */
const thick = (c, x0, y0, x1, y1, t, k) => { for (let i = 0; i < t; i++) c.line(x0, y0 + i, x1, y1 + i, k) }

// ---------------------------------------------------------------- Die Regenleserin. Every height in px over the floor.
const RW = 37, RH = 38, rn = (h) => RH - 1 - h
const regen = (c) => {
  // the bucket she sits on, upturned
  taper(c, rn(11), 7, 18, rn(0), 8, 17, "G", "g", 7); c.hline(7, rn(1), 11, "g")
  // her boots, under the cape's hem, toward the viewer's right
  c.rect(22, rn(12), 4, 10, "3"); c.rect(22, rn(2), 7, 3, "1"); c.rect(18, rn(12), 4, 9, "2"); c.rect(18, rn(3), 6, 4, "1")
  // the cape: a bell from her bent shoulders to below her knees, the round of her back on the left
  taper(c, rn(29), 12, 18, rn(27), 10, 20, "B", "b")
  taper(c, rn(26), 10, 21, rn(20), 7, 23, "B", "b")
  taper(c, rn(19), 7, 23, rn(11), 5, 26, "B", "b")
  c.vline(14, rn(20), 9, "b")                                 // a fold
  // the far arm out to the bucket under the drip
  thick(c, 20, rn(24), 27, rn(19), 3, "b")
  c.rect(27, rn(20), 2, 2, "R")
  // the bucket in her hand: its handle, the water in it, the drop counter clipped under the rim
  c.line(27, rn(21), 31, rn(25), "g"); c.line(31, rn(25), 35, rn(21), "g")
  taper(c, rn(20), 27, 35, rn(12), 28, 34, "G", "g", 5)
  c.hline(28, rn(20), 7, "n"); c.hline(29, rn(20), 4, "V")
  c.rect(32, rn(18), 3, 2, "1"); c.px(33, rn(18), "v"); c.px(34, rn(18), "v")
  // the head, far forward of her shoulders; the hat's brim long down her back, short over her face
  c.rect(16, rn(32), 8, 6, "R")
  c.px(21, rn(30), "r"); c.px(22, rn(28), "r")                  // her lids down, her mouth
  c.vline(16, rn(31), 3, "H"); c.vline(15, rn(30), 2, "H")      // white hair under the hat
  c.rect(16, rn(37), 8, 4, "n"); c.hline(17, rn(37), 6, "b")    // the crown
  c.hline(12, rn(33), 14, "n"); c.hline(13, rn(32), 12, "n")    // the brim
  c.rect(11, rn(32), 4, 4, "n"); c.px(10, rn(29), "n")          // its flap down her neck
  // the near arm across the cape, a finger to her lips: tasting
  thick(c, 12, rn(23), 21, rn(26), 2, "b"); thick(c, 12, rn(24), 21, rn(27), 1, "B")
  c.rect(22, rn(28), 2, 3, "R"); c.px(24, rn(28), "R")
}
sprite("stadt_regen", { w: RW, h: RH, outline: "k", pivot: "bottom" }, regen)

// ---------------------------------------------------------------- Frau Imai, at her table. In the room this could be
// one sprite (she does not leave it): the table, the chair and she drawn together.
const IW = 43, IH = 41, im = (h) => IH - 1 - h
const imai = (c) => {
  // the chair: its back behind her, the seat, a leg
  c.rect(4, im(30), 2, 31, "4"); c.rect(4, im(15), 14, 2, "5"); c.rect(15, im(13), 2, 14, "3")
  // the skirt on the seat, the shins, the shoes
  c.rect(9, im(19), 14, 5, "2"); c.rect(20, im(14), 4, 13, "3"); c.rect(20, im(1), 6, 2, "1"); c.rect(16, im(1), 4, 2, "1"); c.rect(17, im(10), 2, 9, "2")
  // her cardigan, sunk forward
  taper(c, im(29), 9, 19, im(15), 7, 21, "C", "c")
  c.rect(12, im(30), 7, 1, "c")
  // the small round table, its foot; the cup on its saucer, no steam
  c.rect(29, im(19), 3, 18, "3"); c.ellipse(30, im(1), 6, 1, "3")
  c.ellipse(31, im(23), 11, 4, "5"); c.hline(25, im(26), 12, "6")
  c.hline(31, im(25), 8, "w"); c.rect(32, im(28), 6, 3, "W"); c.vline(37, im(28), 3, "w"); c.hline(33, im(28), 4, "t")
  // the far arm along the table to the cup, the near arm's elbow on it and her hand under her jaw
  thick(c, 18, im(22), 30, im(25), 3, "C"); c.rect(30, im(26), 2, 3, "I")
  thick(c, 18, im(27), 25, im(24), 3, "c"); thick(c, 25, im(24), 22, im(31), 3, "c")
  // the head, a little to one side on the hand: hair up, the bun, the ear bare, the Lull point behind it
  c.rect(14, im(38), 8, 9, "I")
  c.rect(13, im(38), 9, 4, "a"); c.rect(12, im(36), 3, 6, "a"); c.hline(14, im(38), 6, "A")
  c.rect(10, im(40), 5, 4, "a"); c.hline(11, im(40), 3, "A")
  c.vline(15, im(33), 2, "i")                                  // the ear
  c.rect(12, im(33), 2, 2, "~"); c.px(11, im(33), "^"); c.px(12, im(34), "^"); c.px(13, im(31), "^")
  c.hline(18, im(33), 2, "i"); c.px(21, im(33), "i"); c.px(20, im(30), "i")   // her lids down, her mouth
  c.rect(20, im(29), 5, 4, "c"); c.rect(21, im(31), 3, 2, "I") // the sleeve up to the jaw, the hand
}
sprite("stadt_imai", { w: IW, h: IH, outline: "k", pivot: "bottom" }, imai)

// ---------------------------------------------------------------- Der Prediger, on his crate
const PW = 36, PH = 67, pn = (h) => PH - 1 - h
const prediger = (c) => {
  // the crate: a plastic crate turned over, slots in it
  c.rect(9, pn(11), 19, 12, "5"); c.hline(9, pn(11), 19, "6"); for (const x of [12, 17, 22]) c.rect(x, pn(8), 3, 6, "3")
  // thin legs, boots
  c.rect(14, pn(30), 3, 17, "2"); c.rect(20, pn(30), 3, 17, "3"); c.rect(13, pn(13), 5, 2, "1"); c.rect(20, pn(13), 5, 2, "1")
  // the coat: narrow, shoulders to the shins, its opening toward the side he faces
  taper(c, pn(53), 13, 23, pn(25), 12, 24, "D", "d")
  c.vline(21, pn(52), 28, "e")
  // the low arm out, its thermos; the raised arm, its thermos up over his head
  thick(c, 13, pn(52), 6, pn(42), 3, "d"); c.rect(4, pn(42), 3, 3, "p")
  c.rect(3, pn(40), 5, 11, "T"); c.vline(7, pn(40), 11, "x"); c.rect(3, pn(42), 5, 2, "Q")
  thick(c, 23, pn(52), 29, pn(49), 3, "D"); thick(c, 29, pn(49), 31, pn(56), 3, "D"); c.rect(30, pn(58), 3, 2, "p")
  c.rect(29, pn(66), 5, 9, "T"); c.vline(33, pn(66), 9, "x"); c.rect(29, pn(66), 5, 2, "Q")
  // the head: gaunt, the eyes wide open, wild hair standing up
  c.rect(16, pn(55), 3, 2, "q")                                // the neck
  c.rect(14, pn(62), 8, 8, "p"); c.vline(15, pn(58), 3, "q")
  c.rect(14, pn(62), 8, 2, "u"); c.rect(14, pn(62), 2, 5, "u")
  for (const [x, h] of [[14, 64], [16, 65], [18, 63], [20, 65], [22, 63]]) c.vline(x, pn(h), h - 62 + 1, "u")
  c.rect(18, pn(59), 2, 2, "W"); c.px(19, pn(58), "k"); c.px(21, pn(59), "W"); c.px(21, pn(58), "k")  // no lid on either
  c.hline(19, pn(55), 2, "q")
  // his counter on its cord: a dark plate, the number in cyan
  c.line(15, pn(54), 18, pn(49), "e"); c.line(22, pn(54), 19, pn(49), "e")
  c.rect(14, pn(49), 9, 6, "1"); c.rect(15, pn(48), 7, 4, "v"); c.rect(17, pn(47), 3, 2, "1")
}
sprite("stadt_prediger", { w: PW, h: PH, outline: "k", pivot: "bottom" }, prediger)

// ---------------------------------------------------------------- Der Monteur
const MW = 29, MH = 53, mn = (h) => MH - 1 - h
const coat = (c, n) => {
  // boots, legs
  c.rect(7, n(3), 6, 4, "1"); c.rect(15, n(3), 6, 4, "1"); c.rect(8, n(17), 4, 14, "2"); c.rect(15, n(17), 4, 14, "3")
  // the long work coat, wet from the hem up
  taper(c, n(41), 9, 18, n(38), 6, 20, "N", "N", 0)
  taper(c, n(37), 6, 20, n(14), 5, 22, "M", "m")
  c.rect(5, n(20), 18, 7, "N")
  // the belt, a pouch
  c.hline(6, n(28), 16, "O"); c.rect(16, n(27), 4, 5, "P")
}
// facing the street (SE; flipped for SW): to talk
const monteurSE = (c) => {
  coat(c, mn)
  // the arms down, a long screwdriver in the far hand
  c.rect(3, mn(40), 3, 17, "M"); c.rect(3, mn(23), 3, 3, "S")
  c.rect(21, mn(40), 3, 16, "m"); c.rect(21, mn(24), 3, 3, "s"); c.line(23, mn(21), 26, mn(11), "7")
  // the head, the hard hat with its peak toward the face, the lamp over it
  c.rect(9, mn(46), 9, 6, "S"); c.vline(9, mn(45), 4, "s"); c.px(14, mn(44), "k"); c.px(17, mn(44), "k"); c.hline(13, mn(42), 4, "s")
  c.hline(10, mn(51), 7, "Z"); c.rect(9, mn(50), 9, 3, "Z"); c.vline(9, mn(50), 3, "z"); c.hline(8, mn(47), 13, "z")
  c.hline(9, mn(49), 9, "2"); c.rect(16, mn(50), 3, 3, "V"); c.px(19, mn(49), "v")
}
sprite("stadt_monteur_se", { w: MW, h: MH, outline: "k", pivot: "bottom" }, monteurSE)

// from behind, facing the wall (NE): at work, his arm up to the screen, the contract's number on his back
const MNH = 58, mt = (h) => MNH - 1 - h
const monteurNE = (c) => {
  coat(c, mt)
  c.rect(7, mt(38), 13, 7, "m"); TXT.draw(c, 8, mt(37), "9-A", "1", { font: "hud" })
  c.rect(3, mt(40), 3, 17, "m"); c.rect(3, mt(23), 3, 3, "s")
  // the arm up, the tool at the end of it
  thick(c, 19, mt(41), 23, mt(50), 3, "M"); c.rect(23, mt(53), 3, 3, "S"); c.line(25, mt(54), 27, mt(57), "7")
  // the head from behind: the neck, the hat, the lamp's strap
  c.rect(9, mt(46), 9, 5, "s"); c.rect(9, mt(46), 9, 2, "3")
  c.hline(10, mt(51), 7, "Z"); c.rect(9, mt(50), 9, 4, "Z"); c.vline(17, mt(50), 4, "z"); c.hline(8, mt(47), 11, "z"); c.hline(9, mt(49), 9, "2")
  c.px(18, mt(49), "V"); c.px(19, mt(49), "v")                 // the lamp's light past the hat
}
sprite("stadt_monteur_ne", { w: MW, h: MNH, outline: "k", pivot: "bottom" }, monteurNE)

// ---------------------------------------------------------------- the finished figures, for the scale
const REF = { juno_se: ["juno_idle_se", 27], juno_ne: ["juno_idle_ne", 27], bao: ["bao_idle_sw", 31], motte: ["motte_talk_sw", 39] }
for (const [id, [file, w]] of Object.entries(REF)) sprite(`stadt_ref_${id}`, { png: `${SRC}${file}.png`, area: [0, 0, w, 50], pivot: "bottom" })

const WHO = [["JUNO", "50", "stadt_ref_juno_se", 27], ["BAO", "47", "stadt_ref_bao", 31], ["MOTTE", "SITZT", "stadt_ref_motte", 39], ["REGENL.", "38 SITZT", "stadt_regen", 39], ["IMAI", "41 SITZT", "stadt_imai", 45], ["PREDIGER", "54+12", "stadt_prediger", 38], ["MONTEUR", "52 SE", "stadt_monteur_se", 31], ["AN DER", "ARBEIT", "stadt_monteur_ne", 31]]
for (const [, , name] of WHO) sprite(`${name}_sil`, { base: name }, recolor({ "*": "k" }))

scene("stadt_people_blocks", { w: 340, h: 178, bg: "3" }, (c) => {
  c.rect(0, 82, 340, 11, "1"); c.rect(0, 93, 340, 85, "6"); c.rect(0, 168, 340, 10, "5")
  let x = 8
  for (const [label, height, name, w] of WHO) {
    const mid = x + (w >> 1)
    TXT.draw(c, mid, 2, label, "7", { font: "hud", align: "center" }); TXT.draw(c, mid, 9, height, "6", { font: "hud", align: "center" })
    c.stamp(name, mid, 86)
    c.stamp(`${name}_sil`, mid, 172)
    x += w + 6
  }
})

// ---------------------------------------------------------------- in their places
const bgFrom = (name, w = 320) => sprite(`stadt_bg_${name}`, { png: `${SRC}${name}.png`, area: [0, 0, w, 180] })
bgFrom("dach_bg"); bgFrom("lucky_static_bg"); bgFrom("drain_market_bg"); bgFrom("kowalski_bg", 416)

// the roof (the old photo's camera; places: reader [92, 164]). Her drip needs a cause: a length of gutter on a pole, her own
// rig, in front of the parapet; a drop on its way down.
scene("stadt_room_dach", { w: 320, h: 180, bg: "k" }, (c) => {
  c.stamp("stadt_bg_dach_bg", 0, 0)
  c.rect(114, 112, 2, 52, "4"); c.rect(116, 112, 1, 52, "2")                        // the pole
  thick(c, 120, 106, 104, 114, 3, "g"); c.line(120, 106, 104, 114, "G")             // the gutter on it, falling to its spout
  c.px(104, 124, "V"); c.px(104, 125, "v"); c.px(104, 136, "V"); c.px(104, 137, "v")
  c.stamp("stadt_regen", 92, 165)
  c.stamp("stadt_ref_juno_ne", 190, 172)
})
// LUCKY STATIC (the mock; places: imai [110, 134], which stands in front of the mock's low table: covered here)
scene("stadt_room_lucky", { w: 320, h: 180, bg: "k" }, (c) => {
  c.stamp("stadt_bg_lucky_static_bg", 0, 0)
  c.rect(84, 116, 60, 18, "1")
  c.stamp("stadt_imai", 110, 136, { flip: "x" })
  c.stamp("stadt_ref_juno_se", 64, 150)
})
// the Drain Market (the mock; places: preacher [226, 136], on the mock's crate: his own crate stands 10 px lower)
scene("stadt_room_markt", { w: 320, h: 180, bg: "k" }, (c) => {
  c.stamp("stadt_bg_drain_market_bg", 0, 0)
  c.rect(214, 136, 24, 10, "1")
  c.stamp("stadt_prediger", 226, 147, { flip: "x" })
  c.stamp("stadt_ref_juno_se", 170, 156)
})

// Kowalski Street, the room's image at its right end. The scaffold in the map's own projection (art/rooms/kowalski.map.js,
// at [188, 66]) before the screen's left half (the ad runs u 2.2 to 5.6, h 1.1 to 3.35: the half at u 3.9): one bay of 1.8 x 0.7 m,
// a deck at 1.1 m, so that a man on it reaches the screen; a lower deck at 0.35 m with the sleeping bag, dry under the upper one;
// a ladder at the left end; no rail on the street's side, so that he stands in front of everything in it and the game needs
// no layer of the scaffold over him. The washing runs from the top of the scaffold to the wall past the screen: across the half that
// is not his.
const OX = 96, PK = (u, v, h = 0) => [188 + 32 * (u - v) - OX, 66 + 16 * (u + v) - 30 * h]
const U0 = 2.1, U1 = 3.9, V0 = 0.12, V1 = 0.8, DECK = 1.1, LOW = 0.35, TOP = 2.35
const seg = (c, a, b, k, t = 1) => { for (let i = 0; i < t; i++) c.line(a[0] + i, a[1], b[0] + i, b[1], k) }
const deck = (c, h, k, edge) => {
  const a = PK(U0, V0, h), b = PK(U1, V0, h), d = PK(U1, V1, h), e = PK(U0, V1, h)
  c.poly([a[0], a[1], b[0], b[1], d[0], d[1], e[0], e[1]], k)
  seg(c, e, d, edge); c.line(e[0], e[1] + 1, d[0], d[1] + 1, edge); c.line(e[0], e[1], a[0], a[1], edge)
}
const postAt = (c, u, v, k = "5") => seg(c, PK(u, v, 0), PK(u, v, TOP), k, 2)
const scaffold = (c) => {
  // what stands behind him: the two posts by the wall, the rail along the wall, the lower deck, the sleeping bag, the upper deck
  postAt(c, U0, V0); postAt(c, U1, V0)
  seg(c, PK(U0, V0, 2.1), PK(U1, V0, 2.1), "5"); seg(c, PK(U0, V0, 1.6), PK(U1, V0, 1.6), "4")
  seg(c, PK(U0, V0, DECK), PK(U1, V0, 0), "4")
  deck(c, LOW, "3", "4")
  const [bx0, by0] = PK(2.35, 0.6, LOW + 0.08), [bx1, by1] = PK(3.6, 0.6, LOW + 0.08)
  for (let t = 0; t < 7; t++) c.line(bx0, by0 - t, bx1, by1 - t, t < 2 ? "f" : "E")
  c.rect(bx1 - 2, by1 - 7, 4, 6, "1")
  deck(c, DECK, "O", "P")
  // the ladder at the left end
  const l0 = PK(U0, 0.3), l1 = PK(U0, 0.68); seg(c, l0, PK(U0, 0.3, DECK), "6"); seg(c, l1, PK(U0, 0.68, DECK), "6")
  for (let h = 0.15; h < DECK; h += 0.22) seg(c, PK(U0, 0.3, h), PK(U0, 0.68, h), "6")
  // on the deck, his stove at the right end: a box, its flame, a pot
  const [sx, sy] = PK(3.45, 0.45, DECK); c.rect(sx - 4, sy - 3, 9, 4, "7"); c.rect(sx - 3, sy - 11, 7, 5, "g"); c.rect(sx - 2, sy - 6, 5, 3, "Q"); c.hline(sx - 1, sy - 5, 3, "F")
  // the washing line, over to the wall past the screen, what hangs on it
  const a = PK(U1, V0, TOP), b = PK(5.72, 0.02, 2.95)
  seg(c, a, b, "w")
  const hang = (t, w, h, k) => { const x = Math.round(a[0] + (b[0] - a[0]) * t), y = Math.round(a[1] + (b[1] - a[1]) * t); c.rect(x, y + 1, w, h, k) }
  hang(0.12, 6, 9, "W"); hang(0.3, 3, 7, "l"); hang(0.38, 3, 7, "l"); hang(0.56, 8, 10, "z"); hang(0.78, 5, 7, "E")
}
scene("stadt_room_kowalski", { w: 320, h: 180, bg: "k" }, (c) => {
  c.stamp("stadt_bg_kowalski_bg", -OX, 0)
  c.stamp("stadt_prop_lights", 41 - OX, 0)
  c.stamp("stadt_prop_vending", 197 - OX, 25)
  scaffold(c)
  // he stands at the left end of the deck, at work, his back to us: there he hides least of the ad
  const [mx, my] = PK(2.55, 0.42, DECK)
  c.stamp("stadt_monteur_ne", mx, my + 1)
  c.rect(mx + 17, my - 60, 3, 3, "V")                        // his lamp and his tool, on the screen
  // the posts on the street's side, thin, at the ends of the deck
  postAt(c, U0, V1); postAt(c, U1, V1)
  c.stamp("stadt_prop_bins", 339 - OX, 118)
  c.stamp("stadt_ref_bao", 222 - OX, 137)
  c.stamp("stadt_prop_cart", 174 - OX, 99)
  c.stamp("stadt_prop_umbrella", 166 - OX, 51)
  c.stamp("stadt_ref_juno_ne", 271 - OX, 146 + 1)
})
for (const [name, w, h] of [["vending", 42, 77], ["cart", 57, 59], ["bins", 38, 51], ["umbrella", 67, 69], ["lights", 346, 59]])
  sprite(`stadt_prop_${name}`, { png: `${SRC}kowalski_${name}.png`, area: [0, 0, w, h] })

// the four together
scene("stadt_people_blocks_room", { w: 643, h: 363, bg: "6" }, (c) => {
  c.stamp("stadt_room_dach", 0, 0); c.stamp("stadt_room_lucky", 323, 0)
  c.stamp("stadt_room_markt", 0, 183); c.stamp("stadt_room_kowalski", 323, 183)
})

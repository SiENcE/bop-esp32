// BLOCKS for approval, not game art (kapitel1-design §8, §10; style guide §6, §9): the three figures of
// the end in cam31 as flat silhouettes of 3-4 phosphor values, at their true size in the feed (an adult
// of 1.75 m about 24 px, feed_people.px.js; §10's street heights 47 / 50 / 55 px at 30 px/m give Ines 22,
// Lantern 23 and Ashe 26 px with the rim). tools/build_art.sh's characters step does not read this file.
//
// Views: cam31 looks at the platform from over the tracks, so people on it face the camera. Unlike
// the prologue's feed people (from behind), the end needs the front three-quarter (SE, mirrored SW):
//   Ines     front: stand, walk (down the stairs to the edge); back: stand, walk (cam21-cam24, cam30);
//            lying
//   Lantern  front (coming out of the tunnel), back (talking to her from the water, leaving); a bob
//   Ashe     front only: stand, walk, the wave (2 frames); the same with the coat dimmed (stepping out)
// Build: PXL build art/characters/feed_ch1_blocks.px.js --only review_feed_ch1_blocks --out build/art/blocks_cam31 --share 4
include("feed_people.px.js")
pal({
  0: "#030a0a", 1: "#071514", 2: "#0c221f", 3: "#12332d", 4: "#1a483e",
  5: "#266252", 6: "#388169", 7: "#55a585", 8: "#8acfae", 9: "#d4f7e2",
})
ramps("0123456789")

// the walk seen from in front: feed_people's table, the far foot higher on the screen instead of the near one
const bkFeetFront = (H, i) => { const q = fpFeet(H, i), m = (f) => ({ ...f, y: 2 * (H - 2) - f.y }); return { near: m(q.near), far: m(q.far) } }
// a rim of value k round what is drawn so far (keeps what comes after it, the mask, free of a rim)
function bkRim(c, W, H, k) {
  const body = new Set()
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (c.key(x, y)) body.add(x + "," + y)
  for (const p of body) {
    const [x, y] = p.split(",").map(Number)
    for (const [ax, ay] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) if (ax >= 0 && ay >= 0 && ax < W && ay < H && !body.has(ax + "," + ay)) c.px(ax, ay, k)
  }
}

// ================================================================ Dr. Ines Calder, 13x20 inside (15x22)
// The coat 9, brighter than everything; the dark plait the one thing cut into it, over the shoulder in
// front, down the back behind; the bag a dark block in her right hand.
const BI = { W: 13, H: 20 }
const BI_LEGS = { W: BI.W, H: BI.H, near: 7, far: 4, hip: 15, lw: 2, sw: 2, leg: "3", shoe: "2", sep: "1" }
function bkInes(c, o = {}) {
  const b = o.bob ?? 0, sw = o.swing ?? 0, back = o.back
  fpLegs(c, BI_LEGS, o.feet ?? fpStand(BI.H), b)
  c.rect(4, 5 + b, 5, 1, "9"); c.rect(3, 6 + b, 7, 10, "9"); c.rect(9, 6 + b, 1, 10, "8")      // the coat, its side away from the lamp
  c.rect(2, 6 + b, 1, 7, "8"); c.rect(10, 6 + b, 1, 7, "8")                                     // the sleeves
  c.rect(2, 13 + b - sw, 1, 2, "6")                                                             // the free hand
  c.rect(10, 13 + b + sw, 1, 1, "6"); c.rect(10, 14 + b + sw, 3, 4, "3"); c.rect(11, 14 + b + sw, 1, 1, "4")   // the hand on the bag
  if (back) {
    c.rect(4, 0 + b, 5, 5, "3"); c.rect(4, 0 + b, 5, 1, "4")                                    // the hair from behind
    c.rect(6, 5 + b, 1, 8, "2"); c.px(6, 13 + b, "3")                                           // the plait down her back
  } else {
    c.rect(4, 0 + b, 5, 5, "6"); c.rect(4, 0 + b, 5, 2, "2"); c.px(4, 2 + b, "2"); c.px(8, 2 + b, "2")   // the face under the dark hair
    c.rect(8, 3 + b, 1, 3, "2"); c.rect(7, 6 + b, 2, 6, "2")                                    // the plait over her shoulder
    c.rect(6, 9 + b, 1, 7, "8")                                                                  // the coat's opening
  }
}
anim("bk_ines_front", { w: BI.W, h: BI.H, frames: 1, outline: "1", pivot: "bottom" }, (c) => bkInes(c))
anim("bk_ines_back", { w: BI.W, h: BI.H, frames: 1, outline: "1", pivot: "bottom" }, (c) => bkInes(c, { back: true }))
anim("bk_ines_front_walk", { w: BI.W, h: BI.H, frames: 6, fps: 10, outline: "1", pivot: "bottom" }, (c) => {
  const i = c.frame; bkInes(c, { bob: FP_BOB[i], swing: FP_SWING[i], feet: bkFeetFront(BI.H, i) })
})
anim("bk_ines_back_walk", { w: BI.W, h: BI.H, frames: 6, fps: 10, outline: "1", pivot: "bottom" }, (c) => {
  const i = c.frame; bkInes(c, { back: true, bob: FP_BOB[i], swing: FP_SWING[i], feet: fpFeet(BI.H, i) })
})
// where she fell: on her side across the picture, the coat still the brightest thing, the plait and the
// bag thrown away from her. 28x8 inside; the pivot under her hip.
anim("bk_ines_down", { w: 28, h: 8, frames: 1, outline: "1", pivot: "bottom" }, (c) => {
  c.rect(7, 2, 12, 5, "9"); c.rect(7, 6, 12, 1, "8")                                            // the coat
  c.rect(19, 4, 4, 2, "3"); c.rect(23, 4, 1, 3, "2")                                            // the legs, a shoe
  c.rect(3, 3, 4, 3, "6"); c.rect(2, 3, 2, 3, "2")                                              // the head, her hair
  c.rect(0, 6, 5, 1, "2")                                                                       // the plait
  c.rect(9, 0, 5, 2, "8"); c.px(14, 0, "6")                                                     // an arm flung out
  c.rect(25, 5, 3, 3, "3")                                                                      // the bag
})

// ================================================================ Lantern, 21x23 inside (23x25)
// Wide and low, the floats at the waterline, the poncho a mid value (6: the post-effects take a step off,
// and the water is dark enough to carry it), a bundle of antennas over his head with lit tips (his one
// glowing thing, the brightest on him).
const BL = { W: 21, H: 23 }
function bkLantern(c, o = {}) {
  const b = o.bob ?? 0, back = o.back
  c.rect(5, 19, 11, 2, "3")                                                                      // the frame between the floats
  for (const x of [0, 16]) { c.rect(x, 17, 5, 6, "7"); c.rect(x, 17, 5, 1, "8"); c.rect(x, 22, 5, 1, "4") }   // the floats, the waterline
  for (const x of [4, 16]) { c.rect(x, 12 + b, 1, 6, "7"); c.rect(x, 12 + b, 1, 1, "8") }        // the chair's wheels, thin from here
  for (const x of [3, 17]) c.rect(x, 14 + b, 1, 3, "3")                                          // the thruster nozzles
  c.rect(6, 12 + b, 9, 6, "6"); c.rect(5, 15 + b, 11, 3, "6"); c.rect(8, 9 + b, 5, 3, "6")       // the poncho, from the neck out over his knees
  c.rect(13, 12 + b, 2, 6, "5"); c.rect(14, 15 + b, 2, 3, "5")                                   // its side away from the lamp
  c.rect(7, 13 + b, 3, 3, "4"); c.px(12, 16 + b, "8"); c.px(11, 16 + b, "8")                     // the patches
  if (back) {
    c.rect(8, 5 + b, 5, 5, "5"); c.rect(8, 5 + b, 5, 1, "6")                                     // the hood from behind
    c.rect(7, 18, 7, 5, "3"); c.rect(8, 17, 5, 2, "8")                                           // the boat motor on the chair's back
  } else {
    c.rect(8, 5 + b, 5, 5, "5"); c.rect(9, 6 + b, 3, 3, "7")                                     // the hood, the face in it
    c.rect(7, 18, 7, 3, "4"); c.rect(6, 21, 9, 1, "3")                                           // his knees under the poncho, the footplate
  }
  for (const [x, top] of [[11, 0], [13, 2], [15, 1]]) { c.rect(x, top + b, 1, 12 - top, "7"); c.px(x, top + b, "9") }   // the antennas, from behind his shoulder
}
for (const [name, back] of [["bk_lantern_front", false], ["bk_lantern_back", true]]) {
  anim(name, { w: BL.W, h: BL.H, frames: 2, ms: [900, 900], outline: "1", pivot: "bottom" }, (c) => bkLantern(c, { back, bob: c.frame }))
}

// ================================================================ Corvin Ashe, 13x24 inside, 17x26 with the burn
// Tall and narrow, the raincoat long to the calves, 8: it must still read as a white coat through cam31's
// post-effects, which take about a step off everything, and stays a step under Ines's 9. The mask is no
// face but a burn: 9, and past the head's edge an 8, with no dark rim (the camera's own overflow has none).
const BA = { W: 17, H: 26, X: 2, Y: 1 }
const ASHE_LIT = { coat: "8", lit: "8", dark: "7", leg: "3", hand: "7" }
const ASHE_7 = { coat: "7", lit: "8", dark: "6", leg: "3", hand: "6" }                            // for the decision: the coat a step down
const ASHE_DIM = { coat: "3", lit: "4", dark: "2", leg: "2", hand: "3" }                          // in the stairs' shadow: only the mask is there
const BA_LEGS = { W: BA.W, H: BA.H, near: 9, far: 6, hip: 21, lw: 2, sw: 3, sep: "1" }
function bkAsheBody(c, v, o = {}) {
  const b = o.bob ?? 0, sw = o.swing ?? 0, dy = o.dy ?? 0, x = BA.X, y = BA.Y + dy
  fpLegs(c, { ...BA_LEGS, H: BA.H + dy, leg: v.leg, shoe: v.leg === "3" ? "2" : "1" }, o.feet ?? fpStand(BA.H + dy - 1), b)
  c.rect(x + 4, y + 6 + b, 5, 1, v.lit); c.rect(x + 3, y + 7 + b, 7, 15, v.coat)                  // the shoulders, the long coat
  c.rect(x + 3, y + 7 + b, 2, 7, v.lit)                                                           // the side toward the lamp
  c.rect(x + 7, y + 10 + b, 1, 12, v.dark)                                                        // the closure
  c.rect(x + 2, y + 8 + b, 1, 9, v.coat); c.rect(x + 2, y + 17 + b - sw, 1, 2, v.hand)            // the near arm, the hand
  if (!o.wave) { c.rect(x + 10, y + 8 + b, 1, 9, v.dark); c.rect(x + 10, y + 17 + b + sw, 1, 2, v.hand) }
  c.rect(x + 4, y + 1 + b, 5, 5, v.lit)                                                           // the head (the rim follows it, the burn covers it)
}
function bkAsheMask(c, o = {}) {
  const b = o.bob ?? 0, x = BA.X, y = BA.Y + (o.dy ?? 0) + (o.up ?? 0)
  c.rect(x + 3, y + 1 + b, 7, 5, "8"); c.rect(x + 5, y + b, 3, 7, "8")
  c.rect(x + 4, y + 1 + b, 5, 5, "9")
}
const bkAshe = (c, v, o = {}) => { bkAsheBody(c, v, o); bkRim(c, BA.W, BA.H + (o.dy ?? 0), "1"); bkAsheMask(c, o) }
anim("bk_ashe", { w: BA.W, h: BA.H, frames: 1, pivot: "bottom" }, (c) => bkAshe(c, ASHE_LIT))
anim("bk_ashe_7", { w: BA.W, h: BA.H, frames: 1, pivot: "bottom" }, (c) => bkAshe(c, ASHE_7))
anim("bk_ashe_dim", { w: BA.W, h: BA.H, frames: 1, pivot: "bottom" }, (c) => bkAshe(c, ASHE_DIM))
anim("bk_ashe_walk", { w: BA.W, h: BA.H, frames: 6, fps: 10, pivot: "bottom" }, (c) => {
  const i = c.frame; bkAshe(c, ASHE_LIT, { bob: FP_BOB[i], swing: FP_SWING[i], feet: bkFeetFront(BA.H - 1, i) })
})
// the wave: 5 rows taller, the hand up beside the mask, which has lifted a pixel; two frames, out and back
const BAW = 5
anim("bk_ashe_wave", { w: BA.W, h: BA.H + BAW, frames: 2, fps: 3, pivot: "bottom" }, (c) => {
  const x = BA.X, y = BA.Y + BAW, o = c.frame
  bkAsheBody(c, ASHE_LIT, { dy: BAW, wave: true })
  c.rect(x + 10 + o, y - 1, 2, 9, ASHE_LIT.coat); c.rect(x + 10 + o, y - 4, 2, 3, ASHE_LIT.lit)     // the arm, the hand: it has to read at 1x
  bkRim(c, BA.W, BA.H + BAW, "1")
  bkAsheMask(c, { dy: BAW, up: -1 })
})

// ================================================================ the sheet for the user
scene("review_feed_ch1_blocks", { w: 304, h: 114, bg: "2" }, (c) => {
  // three grounds: the water and the deep shadow (2), the dim platform (4), the emergency light's pool (6)
  const STRIP = 34, GROUNDS = ["2", "4", "6"]
  GROUNDS.forEach((k, i) => c.rect(0, 12 + i * STRIP, 304, STRIP, k))
  const X = [10, 30, 46, 60, 74, 88, 110, 134, 158, 186, 206, 226, 246, 270]
  const FIGS = [["kessler_feed", 0], ["bk_ines_front", 0], ["bk_ines_front_walk", 0], ["bk_ines_front_walk", 300], ["bk_ines_back", 0], ["bk_ines_back_walk", 300], ["bk_ines_down", 0],
    ["bk_lantern_front", 0], ["bk_lantern_back", 0], ["bk_ashe", 0], ["bk_ashe_walk", 300], ["bk_ashe_wave", 0], ["bk_ashe_wave", 400], ["bk_ashe_7", 0]]
  GROUNDS.forEach((k, i) => {
    const y = 12 + i * STRIP + STRIP - 3
    FIGS.forEach(([n, t], j) => c.stamp(n, X[j], y, { t }))
    c.stamp("bk_ashe_dim", 290, y)
  })
  for (const [x, s] of [[3, "1.75M"], [24, "INES VORN"], [68, "HINTEN"], [98, "LIEGT"], [122, "LANTERN"], [176, "ASHE"], [196, "GEHT"], [218, "WINKT"], [260, "7?"], [278, "DUNKEL"]]) c.text(x, 3, s, "8")
  // 24 px, the scale's mark beside the scale figure
  for (let i = 0; i < 3; i++) c.rect(1, 12 + i * STRIP + STRIP - 3 - 24, 1, 24, "7")
})

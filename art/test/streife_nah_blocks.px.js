// Block for approval (the user, 2026-11-16: in Jade Row the patrol car was tiny beside Morrow, "da passt doch niemals Morrow rein"):
// Revier 9's flood car at Juno's scale (30 px a metre, as everyone on the lane's near band), in the lane behind Morrow where she stops
// on Saturday and Sunday at 00:30. The same car as the approved way C (art/test/streife_blocks.px.js, painted small in
// art/characters/tide_people.px.js): from the front, high on big wheels, the snorkel beside the windscreen, the push bar, two red
// lights on the roof. In metres: 2.0 wide, the body 0.55 to 1.25 up, the cabin to 1.95, the snorkel to 2.2.
//   streife_nah_blocks    the lane (a game shot without the cars, build/shots/jade_empty_1x.png) with the car where it would stand, 1x
"use strict"
pal({ k: "#0c0e1a", t: "#131a2a", b: "#2f3e5a", B: "#41547a", l: "#8e9ab0", L: "#c8d0e0", w: "#1a2337", r: "#ff2a3c", R: "#7a1a24", y: "#ffd83a" })

const M = 20.4                                 // px a metre: a third under the near band's 30, as it stands further back (the user, 2026-11-16)
const CX = 40, GY = 77                         // the car's middle, its wheels' foot in its own canvas (80x78, pivot bottom)
const X = (m) => Math.round(CX + m * M), Y = (m) => Math.round(GY - m * M)
/** a flat block from (x0, h0) to (x1, h1) in metres */
const blk = (c, x0, h0, x1, h1, k) => c.rect(X(x0), Y(h1), X(x1) - X(x0), Y(h0) - Y(h1), k)

function car(c) {
  // the tyres, big and dark, under the raised body; the shadow between them
  for (const x of [-1.0, 0.62]) blk(c, x, 0, x + 0.38, 0.75, "t")
  blk(c, -0.62, 0.4, 0.62, 0.55, "k")
  // the body, its bonnet lit, the grille, the headlights, the plate
  blk(c, -1.0, 0.55, 1.0, 1.25, "B"); blk(c, -1.0, 1.18, 1.0, 1.25, "l")
  blk(c, -0.25, 0.75, 0.25, 1.05, "w")
  blk(c, -0.92, 0.95, -0.62, 1.1, "L"); blk(c, 0.62, 0.95, 0.92, 1.1, "L")
  blk(c, -0.15, 0.6, 0.15, 0.72, "l")
  // the cabin, the dark windscreen, two heads behind it
  blk(c, -0.75, 1.25, 0.75, 1.95, "b"); blk(c, -0.65, 1.32, 0.65, 1.85, "w")
  blk(c, -0.45, 1.4, -0.25, 1.65, "b"); blk(c, 0.25, 1.4, 0.45, 1.65, "b")
  // the roof's two red lights, the snorkel beside the windscreen
  blk(c, -0.6, 1.95, -0.35, 2.05, "r"); blk(c, 0.35, 1.95, 0.6, 2.05, "R")
  blk(c, 0.8, 1.0, 0.9, 2.2, "l")
  // the push bar on its posts, the wading gauge on them
  blk(c, -1.08, 0.5, 1.08, 0.58, "L")
  for (const x of [-1.08, 1.0]) { blk(c, x, 0.58, x + 0.08, 0.95, "l"); for (let i = 0; i < 4; i++) blk(c, x, 0.6 + i * 0.09, x + 0.08, 0.64 + i * 0.09, "y") }
}

sprite("_sn_room", { png: "../../build/shots/jade_empty_1x.png" })
sprite("_sn_morrow", { png: "../../build/art/characters/anims/morrow_idle_se.png", area: [0, 0, 23, 52], pivot: "bottom" })
anim("streife_nah_block", { w: 80, h: 78, frames: 1, outline: "k", pivot: "bottom" }, car)
// the room, the car where it would stand (a little back down the lane, x 196), and Morrow again in front of it (she stands nearer)
scene("streife_nah_blocks", { w: 320, h: 180, bg: "k" }, (c) => {
  c.stamp("_sn_room", 0, 0)
  c.stamp("streife_nah_block", 196, 128)
  c.stamp("_sn_morrow", 180, 147)
})

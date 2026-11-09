// Chapter 1, job B: Revier 9's patrol car, which waits down Jade Row at 00:30 while Lt. Morrow takes the envelope (CAM 07 only, at the
// lane's scale, seen from the front down the lane; kapitel1-design Â§4). As blocks for approval before it is painted, two ways:
//   A  an old ground car, low and wide: the light bar on its roof with two red lights at its ends, a push bar across its front, two
//      headlights, a dark windscreen with two heads behind it (the user's choice, with corrections, 2026-11-09)
//   B  a tall, narrow riot van: a mesh over the windscreen, a searchlight on the roof instead of a bar, one headlight dead, a shield
//      with the 9 on its nose
//   streife_blocks          the sheet: A and B at 1x and large, side by side
//   streife_block_A, _B     each alone, pivot bottom (for the composite into CAM 07)
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8e9ab0", 8: "#c0c8d8",
  W: "#f0f4ff", c: "#1f88a4", r: "#e83a3a", R: "#ffb0a0", v: "#62def0", V: "#dafcff", y: "#eec414", s: "#7a4a32",
})
const R = (c, a, b, w, h, k) => c.rect(a, b, w, h, k)

/** the old ground car from the front, its wheels' bottom at (x, fy): 27 wide and 16 high, the size of the car parked in the lane
 *  (art/mock/jade_row.px.js) at the same depth; the light bar's two red lights at its ends, the middle of the bar dark (the user's
 *  corrections, 2026-11-09: only two lights, no face in the windscreen, no patch on the wing) */
function carA(c, x, fy) {
  const T = fy - 16
  R(c, x - 11, T + 13, 4, 3, "k"); R(c, x + 7, T + 13, 4, 3, "k")                      // the tyres
  R(c, x - 12, T + 7, 25, 6, "4"); R(c, x - 12, T + 7, 25, 1, "6"); R(c, x - 12, T + 11, 25, 2, "3")   // the body, its bonnet's edge
  R(c, x - 8, T + 2, 17, 5, "3"); R(c, x - 7, T + 3, 15, 4, "1"); R(c, x - 8, T + 2, 17, 1, "5")     // the cabin, the dark windscreen
  R(c, x - 5, T + 4, 3, 3, "2"); R(c, x + 2, T + 4, 3, 3, "2")                         // two heads behind it, in the dark
  R(c, x - 6, T + 1, 13, 1, "5"); R(c, x - 6, T + 0, 3, 2, "r"); R(c, x + 4, T + 0, 3, 2, "r"); c.px(x - 5, T, "R"); c.px(x + 5, T, "R")   // the light bar
  R(c, x - 3, T + 8, 7, 3, "2"); for (let i = -2; i < 4; i += 2) c.vline(x + i, T + 8, 3, "3")      // the grille
  R(c, x - 11, T + 8, 4, 2, "8"); R(c, x - 10, T + 8, 2, 1, "W"); R(c, x + 8, T + 8, 4, 2, "8"); R(c, x + 9, T + 8, 2, 1, "W")   // the headlights
  R(c, x - 13, T + 11, 27, 1, "6"); c.vline(x - 5, T + 9, 3, "6"); c.vline(x + 5, T + 9, 3, "6")    // the push bar
}

/** the riot van from the front, its wheels' bottom at (x, fy), 34 wide and tall */
function carB(c, x, fy) {
  const T = fy - 26
  R(c, x - 15, T + 22, 5, 4, "k"); R(c, x + 10, T + 22, 5, 4, "k")
  R(c, x - 16, T + 4, 32, 19, "4"); R(c, x - 16, T + 4, 32, 1, "6"); R(c, x - 16, T + 20, 32, 3, "3")  // the box of it
  R(c, x - 13, T + 6, 26, 8, "1"); for (let i = -12; i < 13; i += 3) c.vline(x + i, T + 6, 8, "5"); c.hline(x - 13, T + 10, 26, "5")   // the mesh over the windscreen
  R(c, x - 3, T + 0, 6, 4, "5"); R(c, x - 2, T + 1, 4, 2, "V"); R(c, x - 1, T + 1, 2, 1, "W")        // the searchlight on the roof
  R(c, x - 14, T + 15, 4, 3, "8"); R(c, x - 13, T + 16, 2, 1, "W"); R(c, x + 10, T + 15, 4, 3, "2")  // one headlight lit, one dead
  R(c, x - 4, T + 15, 8, 5, "6"); R(c, x - 3, T + 16, 6, 3, "3"); R(c, x - 1, T + 16, 2, 3, "8")      // the shield with the 9 on its nose
  R(c, x - 17, T + 20, 34, 2, "5")                                                     // the bumper
}

// ---------------------------------------------------------------- round 3 (the user, 2026-11-09: higher, not so flat, and something that ties
// it to this city). Three ways, each 27 wide and about 22 high, the two red lights kept:
//   C  the flood car: high on big wheels with room under it, a snorkel up beside the windscreen, a wading gauge painted on the push bar:
//      Revier 9 drives through water when the pumps fail
//   D  Nagi·wa's car: the light bar is a little ad screen (NAGI·WA in cyan) with the two red lights at its ends, the city's ring on the
//      bonnet: the police are paid by the company that owns the city (Morrow takes its money)
//   E  the drone's car: a cage on its roof where a patrol drone sits, its eye lit, between the two red lights: the car carries its own eye
/** the body all three share, taller than A: wheels' bottom at (x, fy), lift raises the body over the wheels */
function tall(c, x, fy, lift = 0) {
  const T = fy - 22
  R(c, x - 12, T + 17 - lift, 5, 5 + lift, "k"); R(c, x + 8, T + 17 - lift, 5, 5 + lift, "k")                 // the tyres
  R(c, x - 12, T + 10 - lift, 25, 8, "4"); R(c, x - 12, T + 10 - lift, 25, 1, "6"); R(c, x - 12, T + 15 - lift, 25, 2, "3")
  R(c, x - 9, T + 4 - lift, 19, 7, "3"); R(c, x - 8, T + 5 - lift, 17, 5, "1"); R(c, x - 9, T + 4 - lift, 19, 1, "5")
  R(c, x - 6, T + 6 - lift, 3, 4, "2"); R(c, x + 3, T + 6 - lift, 3, 4, "2")
  R(c, x - 3, T + 11 - lift, 7, 3, "2"); for (let i = -2; i < 4; i += 2) c.vline(x + i, T + 11 - lift, 3, "3")
  R(c, x - 11, T + 11 - lift, 4, 2, "8"); R(c, x - 10, T + 11 - lift, 2, 1, "W"); R(c, x + 8, T + 11 - lift, 4, 2, "8"); R(c, x + 9, T + 11 - lift, 2, 1, "W")
  return T - lift
}
const reds = (c, x, y) => { R(c, x - 7, y, 3, 2, "r"); R(c, x + 5, y, 3, 2, "r"); c.px(x - 6, y, "R"); c.px(x + 6, y, "R") }
function carC(c, x, fy) {
  const T = tall(c, x, fy, 2)
  R(c, x - 9, T + 3, 19, 1, "5"); reds(c, x, T + 2)
  c.vline(x + 11, T + 1, 12, "6"); c.vline(x + 12, T + 1, 12, "5"); R(c, x + 10, T, 4, 2, "6")                // the snorkel
  R(c, x - 13, T + 16, 27, 1, "6"); for (let i = 0; i < 4; i++) c.px(x - 13, T + 13 + i, i % 2 ? "y" : "6")    // the push bar, the wading gauge
  c.vline(x - 13, T + 12, 5, "6"); for (let i = 0; i < 5; i++) c.px(x - 14, T + 12 + i, i % 2 ? "6" : "y")
  R(c, x - 8, T + 17, 17, 2, "1")                                                                                 // the dark under it
  c.vline(x + 13, T + 12, 5, "6"); for (let i = 0; i < 5; i++) c.px(x + 14, T + 12 + i, i % 2 ? "6" : "y")       // the gauge on the right too (the user's)
}
function carD(c, x, fy) {
  const T = tall(c, x, fy)
  R(c, x - 8, T, 17, 4, "5"); R(c, x - 6, T + 1, 13, 2, "2"); for (let i = -5; i < 6; i += 2) c.px(x + i, T + 1, "v"); c.hline(x - 4, T + 2, 9, "c")   // the ad screen
  R(c, x - 10, T + 1, 2, 2, "r"); R(c, x + 9, T + 1, 2, 2, "r"); c.px(x - 10, T + 1, "R"); c.px(x + 10, T + 1, "R")
  c.rect(x - 2, T + 11, 5, 3, "v"); c.rect(x - 1, T + 12, 3, 1, "2")                                            // the ring on the bonnet
  R(c, x - 13, T + 16, 27, 1, "6")
}
function carE(c, x, fy) {
  const T = tall(c, x, fy)
  R(c, x - 6, T, 13, 4, "1"); c.hline(x - 6, T, 13, "6"); for (let i = -6; i < 7; i += 3) c.vline(x + i, T, 4, "6")   // the cage
  R(c, x - 4, T + 1, 9, 2, "7"); c.px(x, T + 2, "V"); c.px(x - 1, T + 2, "v")                                   // the drone in it, its eye
  R(c, x - 10, T + 2, 3, 2, "r"); R(c, x + 8, T + 2, 3, 2, "r"); c.px(x - 9, T + 2, "R"); c.px(x + 9, T + 2, "R")
  R(c, x - 13, T + 16, 27, 1, "6")
}
sprite("streife_block_C", { w: 30, h: 24, pivot: "bottom", outline: "k" }, (c) => carC(c, 15, 24))
sprite("streife_block_D", { w: 30, h: 24, pivot: "bottom", outline: "k" }, (c) => carD(c, 15, 24))
sprite("streife_block_E", { w: 30, h: 24, pivot: "bottom", outline: "k" }, (c) => carE(c, 15, 24))

sprite("streife_blocks", { w: 200, h: 90 }, (c) => {
  c.rect(0, 0, 200, 90, "2"); c.rect(0, 70, 200, 20, "1")
  carA(c, 50, 72); carB(c, 150, 72)
  // the parked car of the lane at the same depth, for its size (24 by 17)
  c.rect(76, 55, 24, 17, "3")
})
sprite("streife_block_A", { w: 29, h: 16, pivot: "bottom", outline: "k" }, (c) => carA(c, 14, 16))
sprite("streife_block_B", { w: 35, h: 26, pivot: "bottom", outline: "k" }, (c) => carB(c, 17, 26))

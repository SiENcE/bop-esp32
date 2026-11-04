// The intro's ride D as blocks, 320x180 between the bars (docs/kapitel0-design.md §5). Juno is the real thing, her street
// sprite with the box (art/intro/ride.px.js), mirrored to look left as in shots 2 and 4; the rest is flat blocks.
//   intro_d_blocks_close   painted close and held about 3 s: the box from over its rim, about 700 px per metre, so a 10 cm
//                          stick carries its label; only the rings' light moves, bands sweeping up over the things
//   intro_d_blocks_a, b, c the whole lift, from the Krone's cold light down to the Ninth's neon
//   intro_d_blocks         all four on one sheet
pal({
  n: "#06080f", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  k: "#0c0e1a", S: "#d79676", H: "#b9c6d8", W: "#fff4d8", O: "#6b4630", o: "#4d3122", P: "#8a6242", K: "#33211a",
  y: "#eec414", Y: "#fff070", j: "#9a7406", q: "#266252", Q: "#55a585", v: "#62def0",
})
include("../intro/ride.px.js")

const W = 320, H = 180, BAR = 23
const bars = (c) => { c.rect(0, 0, W, BAR, "k"); c.rect(0, H - BAR, W, BAR, "k") }

sprite("intro_d_blocks_close", { w: W, h: H }, (c) => {
  c.rect(0, 0, W, H, "n")
  for (const y of [40, 66]) c.rect(0, y, W, 10, "2")                                    // a ring going by behind, blurred
  c.rect(0, 84, W, H - 84, "K"); c.rect(0, 84, W, 4, "P")                               // inside the box, its far rim
  c.rect(58, 40, 34, 72, "q"); c.rect(66, 30, 12, 16, "Q"); c.rect(50, 100, 50, 30, "O")   // the cactus in its pot, left
  c.rect(228, 56, 48, 74, "H"); c.rect(228, 56, 48, 4, "W"); c.rect(276, 72, 10, 28, "H")  // the cup, right
  // the stick, leaning against the cup: its label is the shot
  c.rect(100, 104, 124, 26, "4"); c.rect(100, 104, 124, 2, "5"); c.rect(224, 110, 10, 14, "6")
  c.rect(108, 110, 104, 14, "H")
  TXT.draw(c, 160, 114, "EVAL-7 // DELETE", "k", { font: "hud", align: "center" })
  c.rect(0, 130, W, 50, "O"); c.rect(0, 130, W, 3, "P")                                 // the near wall of the box
  c.rect(262, 110, 58, 46, "y"); c.rect(262, 110, 58, 3, "Y"); c.rect(262, 110, 3, 46, "j")   // her yellow sleeve
  c.rect(244, 124, 20, 14, "S")                                                         // her hand on the rim
  bars(c)
})

// the rings going up past the lift; stage 0 the Krone, 1 the middle, 2 the Ninth
function ride(c, stage) {
  const KEYS = [["5", "#dafcff", "#62def0"], ["4", "#fff4d8", "#62def0"], ["3", "#eea040", "#ff4fd3"]][stage]
  c.rect(0, 0, W, H, stage === 2 ? "1" : "2")
  for (let i = 0; i < 60; i++) c.px((i * 53) % W, 30 + (i * 37) % 120, stage === 2 ? "#b0602a" : "4")   // the far city, slow
  // what is close: thin streaks upward, and a ring's deck with its band of windows rushing through
  for (let x = 2; x < W; x += 3) { const y0 = (x * 41 + stage * 70) % H, len = 12 + (x * 13) % 34; c.vline(x, y0, len, (x * 7) % 11 === 0 ? KEYS[2] : "3") }
  const ry = [48, 96, 30][stage]
  c.rect(0, ry, W, 34, KEYS[0]); c.rect(0, ry, W, 2, "6")
  for (let x = 4; x < W; x += 9) c.rect(x, ry + 10, 6, 10, (x * 3) % 5 ? KEYS[1] : KEYS[2])
  // the shaft's rails; the lift's frame, its glass; the floor seen a little from above, since she is seen so too
  c.rect(82, 0, 5, H, "5"); c.rect(233, 0, 5, H, "5")
  const L = 92, R = 228, T = 60, F = 130
  c.rect(L, T, R - L, 4, "6")
  c.rect(L, F, R - L, 12, "4"); c.rect(L, F, R - L, 1, "5"); c.rect(L, F + 12, R - L, 4, "6"); c.rect(L, F + 16, R - L, 2, "3")
  c.rect(L, T, 2, F - T + 16, "H"); c.rect(R - 2, T, 2, F - T + 16, "H")
  c.line(L + 18, T + 8, L + 40, F - 10, "6"); c.line(R - 34, T + 8, R - 22, F - 26, "6")     // light on the glass
}
for (const [n, stage] of [["a", 0], ["b", 1], ["c", 2]]) {
  sprite("intro_d_blocks_" + n, { w: W, h: H }, (c) => { ride(c, stage); bars(c) },
    stamp("intro_d_juno", 170, 138, { frame: 0, flip: "x" }))
}
sprite("intro_d_blocks", { w: W * 2 + 6, h: H * 2 + 6 }, (c) => {
  c.rect(0, 0, W * 2 + 6, H * 2 + 6, "n")
  ;["close", "a", "b", "c"].forEach((n, i) => c.stamp("intro_d_blocks_" + n, (i % 2) * (W + 6), Math.floor(i / 2) * (H + 6)))
})

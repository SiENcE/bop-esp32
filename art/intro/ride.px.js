// The intro's ride D (docs/kapitel0-design.md §5): Juno going down in the lift, the one we know from the street. She has
// taken her yellow coat from her chair in the hall (shot 1) and wears it; the hood is down, as indoors. Her sprite is her
// indoor idle with its breath and blink (art/characters/juno.px.js), with the back arm bent forward to hold the box. The
// box is seen flatter than the street's 2:1 (after the note: 2:1 looked too steep on a thing this small): its long side
// nearly square to us, a narrow end on the right. It hides her satchel.
//   intro_d_juno   33x50, facing SE, pivot bottom-centre: mirror it for SW, as the engine does with her
// In the box a cactus, a cup and the data stick.
include("../characters/juno.px.js")
pal({
  k: "#0c0e1a", y: "#eec414", Y: "#fff070", j: "#9a7406", S: "#d79676", s: "#93583f",
  O: "#6b4630", o: "#4d3122", P: "#8a6242", K: "#33211a", q: "#266252", Q: "#55a585", H: "#b9c6d8", W: "#fff4d8", v: "#62def0",
})

// In the frame's own columns and rows: the top's left corner, its two edges, the box's height
const LX = 14, LY = 21, AX = 12, AY = 2, BX = 4, BY = -2, BOXH = 7
const rowOf = (x) => LY + Math.round(((x - LX) * AY) / AX)     // the long front edge, from left to right
sprite("_ride_box", { w: 33, h: 50, outline: "k" }, (c) => {
  // the long side, lit; the narrow end, in shade; a darker line along the bottom
  for (let x = LX; x <= LX + AX; x++) { const y = rowOf(x); c.rect(x, y, 1, BOXH, "P"); c.px(x, y + BOXH, "o") }
  for (let i = 1; i <= BX; i++) {
    const x = LX + AX + i, y = LY + AY + Math.round((i * BY) / BX)
    c.rect(x, y, 1, BOXH, "O"); c.px(x, y + BOXH, "o")
  }
  // the top: the dark inside, the rim round it
  for (let x = LX; x <= LX + AX + BX; x++) {
    const front = x <= LX + AX ? rowOf(x) : Math.round(LY + AY + ((x - LX - AX) * BY) / BX)
    const back = x < LX + BX ? Math.round(LY + ((x - LX) * BY) / BX) : Math.round(LY + BY + ((x - LX - BX) * AY) / AX)
    for (let y = back; y <= front; y++) c.px(x, y, y === back || y === front || x === LX || x === LX + AX + BX ? "P" : "K")
  }
  // what stands in it, leaving her chin free: the cactus on the left, the stick, the cup on the right
  c.rect(18, 15, 2, 6, "q"); c.rect(18, 14, 1, 3, "Q"); c.px(20, 17, "q")
  c.rect(21, 18, 1, 3, "v")
  c.rect(23, 17, 4, 4, "H"); c.rect(23, 17, 4, 1, "W"); c.px(27, 18, "H")
})

const FRAMES = [900, 600, 120, 1100]              // her idle's own timing: arm and box breathe with her
anim("intro_d_juno", { w: 33, h: 50, frames: FRAMES.length, ms: FRAMES, pivot: "bottom" }, (c) => {
  const f = c.frame, dy = f >= 2 ? 1 : 0          // her bob
  c.stamp("juno_in_idle_se", 16.5, 50, { frame: f })
  // what of the satchel would show under the box goes back to coat
  c.rect(20, 29 + dy, 7, 3, "y"); c.rect(20, 32 + dy, 7, 1, "j")
  // the sleeve and the hand that hung down are gone: below the elbow her side is plain coat, its edge a column further in
  for (let y = 23; y <= 29; y++) {
    c.px(7, y + dy, "_"); c.px(8, y + dy, "k"); c.px(9, y + dy, "j"); c.rect(10, y + dy, 2, 1, "y")
  }
  c.stamp("_ride_box", 0, dy)
  // the forearm, forward from the elbow to the box: lit along its top, in shade under it, the cuff at the wrist
  for (let i = 0; i <= 7; i++) {
    const x = 9 + i, y = 22 + Math.round((i * 4) / 7) + dy
    c.px(x, y, "Y"); c.px(x, y + 1, "y"); c.px(x, y + 2, "j")
  }
  c.rect(8, 21 + dy, 2, 3, "y"); c.px(7, 23 + dy, "k"); c.rect(8, 24 + dy, 2, 1, "k")   // the elbow
  c.rect(16, 26 + dy, 1, 3, "j")
  // her hand round the box's lower edge; the far hand under its right corner
  c.rect(17, 26 + dy, 3, 3, "S"); c.px(17, 28 + dy, "s"); c.rect(17, 29 + dy, 3, 1, "k"); c.rect(20, 26 + dy, 1, 3, "k")
  c.rect(28, 28 + dy, 3, 2, "S"); c.px(28, 29 + dy, "s"); c.rect(28, 30 + dy, 3, 1, "k"); c.rect(31, 28 + dy, 1, 2, "k")
})

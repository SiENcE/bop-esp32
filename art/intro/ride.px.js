// The intro's ride D (docs/kapitel0-design.md §5): Juno going down in the lift, the one we know from the street. She has
// taken her yellow coat from her chair in the hall (shot 1) and wears it; the hood is down, as indoors. Her sprite is her
// indoor idle with its breath and blink (art/characters/juno.px.js), and over it the box she carries: 2:1 like everything
// in the street, so it sits on her as the satchel does. The box hides the satchel, and her near hand holds its corner.
//   intro_d_juno   33x50, facing SE, pivot bottom-centre: mirror it for SW, as the engine does with her
// In the box a cactus, a cup and the data stick.
include("../characters/juno.px.js")
pal({
  k: "#0c0e1a", y: "#eec414", j: "#9a7406", S: "#d79676", s: "#93583f",
  O: "#6b4630", o: "#4d3122", P: "#8a6242", K: "#33211a", q: "#266252", Q: "#55a585", H: "#b9c6d8", W: "#fff4d8", v: "#62def0",
})

const A = 5, B = 4, BOXH = 7, CX = 10, TOP = 6     // the box in units along its two floor edges, its height, its back corner
sprite("_ride_box", { w: 24, h: 24, outline: "k" }, (c) => {
  const inside = (x, y, dy) => {
    const dx = (x + 0.5 - CX) / 2, e = y + 0.5 - TOP - dy, u = (dx + e) / 2, v = (e - dx) / 2
    return u >= 0 && u <= A && v >= 0 && v <= B ? [u, v] : null
  }
  // the two faces under the top: lit on the left, in shade on the right, a darker line along the bottom
  for (let dy = BOXH; dy >= 1; dy--) for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++)
    if (inside(x, y, dy)) c.px(x, y, dy === BOXH ? "o" : x + 0.5 < CX + 2 * A - 2 * B ? "P" : "O")
  // the top: its rim and the dark inside
  for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) {
    const p = inside(x, y, 0)
    if (p) c.px(x, y, p[0] < 0.7 || p[0] > A - 0.7 || p[1] < 0.7 || p[1] > B - 0.7 ? "P" : "K")
  }
  // what stands in it, low enough to leave her chin free: the cactus on the left, the stick, the cup on the right
  c.rect(6, 5, 2, 6, "q"); c.rect(6, 4, 1, 3, "Q"); c.px(8, 7, "q")
  c.rect(10, 8, 1, 3, "v")
  c.rect(12, 7, 4, 4, "H"); c.rect(12, 7, 4, 1, "W"); c.px(16, 8, "H")
})

const FRAMES = [900, 600, 120, 1100]              // her idle's own timing: the box breathes with her
anim("intro_d_juno", { w: 33, h: 50, frames: FRAMES.length, ms: FRAMES, pivot: "bottom" }, (c) => {
  const f = c.frame, dy = f >= 2 ? 1 : 0   // her bob
  c.stamp("juno_in_idle_se", 16.5, 50, { frame: f })
  // what of the satchel would show under the box goes back to coat
  c.rect(20, 29 + dy, 7, 3, "y"); c.rect(20, 32 + dy, 7, 1, "j")
  c.stamp("_ride_box", 9, 11 + dy)
  // her far hand under the box's right corner; the near one already holds the left, where her sprite has it
  c.rect(27, 28 + dy, 3, 2, "S"); c.rect(27, 30 + dy, 3, 1, "k"); c.rect(30, 28 + dy, 1, 2, "k"); c.px(27, 29 + dy, "s")
})

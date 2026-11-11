// Juno seen straight down, for the Drain Market (top-down as in Dreamweb; way A, decided 2026-11-11: style guide §4,
// docs/kapitel1-design.md §9). Painted on the lines of the approved blocks (art/test/juno_oben_blocks.px.js, juno_top_a_*):
// every silhouette is theirs, the painting only adds what is on her.
//
//   juno_top_idle_<dir>   4 frames (she stands, looks to one side, back, to the other), the deck's light on the satchel
//   juno_top_walk_<dir>   8 frames x 100 ms, the boots stepping out in front and behind, the arms swinging
//   juno_top_talk_<dir>   2 frames x 200 ms, a nod and a hand
//   <dir>: down, up, right, left. She is drawn once in her own frame (f forward, s to her left) and turned, so the four are
//   one figure and the left is a real one (the satchel stays on her left hip); the light stays where the room's is, above
//   and to the top left, since it is laid on after the turn.
//
// 21x21 frames, the anchor in the middle (10, 10): from above the ground point is under her, not at the frame's foot (the
// build writes the anchor files). About 13 px across the shoulders: the market is drawn at ~40 px a meter, its people a
// little larger than true so they read.
;(() => {

pal({
  k: "#0c0e1a",                                                       // ink
  1: "#131a2a", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a",             // the boots (night steel), the hood's opening
  j: "#9a7406", y: "#eec414", Y: "#fff070", W: "#fff4d8",             // the slicker; a wet glint on the hood
  s: "#93583f", S: "#d79676",                                         // skin
  h: "#1b1f2e",                                                       // her fringe in the hood's opening
  g: "#565e70", G: "#8e96a8",                                         // the satchel, its strap
  c: "#123c4e", v: "#62def0",                                         // the deck's status light, off and on
})

const STEP = [5, 3, 0, -3, -5, -3, 0, 3]          // the left boot forward over the 8 walk frames (a 0.7 m step), the right's minus
const ARM = [-2, -1, 0, 1, 2, 1, 0, -1]           // the left arm: back while the left foot leads
const TURN = { down: (f, s) => [s, f], up: (f, s) => [-s, -f], right: (f, s) => [f, -s], left: (f, s) => [-f, s] }
const C = 10                                      // the frame's middle: the ground under her

/** the pose's numbers: feet, arms, where she looks, a nod, the light on the satchel */
const pose = (kind, i) => {
  if (kind === "walk") return { foot: STEP[i], al: ARM[i], ar: -ARM[i], look: 0, nod: 0, stand: 0, led: true }
  if (kind === "talk") return { foot: 0, al: 0, ar: i === 1 ? 2 : 0, look: 0, nod: i, stand: 1, led: true }
  return { foot: 0, al: 0, ar: 0, look: i === 1 ? 1 : i === 3 ? -1 : 0, nod: 0, stand: 1, led: i !== 2 }
}

/** her parts in her own frame, turned onto the screen: a map "x,y" -> part */
const parts = (dir, P) => {
  const m = new Map(), T = TURN[dir]
  const set = (f, s, p) => { const [x, y] = T(f, s); m.set((C + x) + "," + (C + y), p) }
  const ell = (cf, cs, rf, rs, p) => {
    for (let f = Math.floor(cf - rf - 1); f <= Math.ceil(cf + rf + 1); f++) for (let s = Math.floor(cs - rs - 1); s <= Math.ceil(cs + rs + 1); s++) {
      const a = (f - cf) / (rf + 0.5), b = (s - cs) / (rs + 0.5); if (a * a + b * b <= 1) set(f, s, p)
    }
  }
  ell(P.foot + P.stand, 2, 1.6, 0.9, "boot"); ell(-P.foot + P.stand, -2, 1.6, 0.9, "boot")
  for (let f = -3; f <= 0; f++) for (let s = 5; s <= 8; s++) set(f, s, f === 0 || s === 8 ? "bagRim" : "bag")   // the satchel, its flap's edge
  set(-1, 8, P.led ? "led" : "ledOff")                                                              // the deck inside: its light
  ell(0, 0, 3, 5.4, "body")                                                                         // the shoulders
  ell(P.al, 6, 1.6, 0.8, "sleeve"); ell(P.ar, -6, 1.6, 0.8, "sleeve")
  if (P.al >= 1) set(P.al + 2, 6, "hand")
  if (P.ar >= 1) set(P.ar + 2, -6, "hand")
  for (const [f, s] of [[1, -4], [0, -4], [-1, -3], [-2, -2], [-2, 3], [-3, 4]]) set(f, s, "strap")    // over the right shoulder to the left hip
  const hf = P.nod
  ell(hf - 0.5, 0, 2.6, 3, "hood")
  for (const f of [hf - 3, hf - 2]) set(f, 0, "seam")                                              // the hood's back seam
  for (let s = -1; s <= 1; s++) set(hf + 2, s + P.look, s === 0 ? "face" : "fringe")                 // the opening: her fringe, the nose
  return m
}

/** paint the parts: lit at the figure's edge to the top left, shaded to the bottom right and where the hood throws its shadow
 *  (lower right), the hood's rim darker below and right, a wet glint on its crown; then the ink outline */
const paint = (c, m) => {
  const at = (x, y) => m.get(x + "," + y), empty = (x, y) => !m.has(x + "," + y)
  const HOOD = new Set(["hood", "seam", "face", "fringe"]), hooded = (x, y) => HOOD.has(at(x, y))
  let hx = 99, hy = 99
  for (const [key, p] of m) if (p === "hood") { const [x, y] = key.split(",").map(Number); if (x + y < hx + hy) { hx = x; hy = y } }
  for (const [key, p] of m) {
    const [x, y] = key.split(",").map(Number)
    let k
    if (p === "body" || p === "sleeve") k = hooded(x, y - 1) || hooded(x - 1, y) || hooded(x - 1, y - 1) ? "j"
      : empty(x, y - 1) || empty(x - 1, y) ? "Y" : empty(x, y + 1) || empty(x + 1, y) ? "j" : "y"
    else if (p === "hood") k = x === hx + 1 && y === hy + 1 ? "W" : !hooded(x + 1, y) || !hooded(x, y + 1) ? "y" : "Y"
    else if (p === "seam") k = "y"
    else if (p === "face") k = "S"
    else if (p === "fringe") k = "h"
    else if (p === "hand") k = "S"
    else if (p === "bag") k = "g"
    else if (p === "bagRim") k = "G"
    else if (p === "led") k = "v"
    else if (p === "ledOff") k = "c"
    else if (p === "strap") k = hooded(x, y) ? null : empty(x, y - 1) || empty(x - 1, y) ? "G" : "g"
    else if (p === "boot") k = empty(x, y - 1) || empty(x - 1, y) ? "5" : at(x, y + 1) === "boot" && at(x + 1, y) === "boot" ? "4" : "3"
    if (k) c.px(x, y, k)
  }
  for (const key of m.keys()) {
    const [x, y] = key.split(",").map(Number)
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (empty(x + dx, y + dy)) c.px(x + dx, y + dy, "k")
  }
}

for (const dir of ["down", "up", "right", "left"]) {
  anim(`juno_top_walk_${dir}`, { w: 21, h: 21, frames: 8, ms: 100 }, (c) => paint(c, parts(dir, pose("walk", c.frame))))
  anim(`juno_top_idle_${dir}`, { w: 21, h: 21, frames: 4, ms: [1600, 900, 1400, 900] }, (c) => paint(c, parts(dir, pose("idle", c.frame))))
  anim(`juno_top_talk_${dir}`, { w: 21, h: 21, frames: 2, ms: 200 }, (c) => paint(c, parts(dir, pose("talk", c.frame))))
}

})()

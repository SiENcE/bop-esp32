// Pike from above on the Drain Market, as a BLOCK for the user's approval before he is painted (kapitel2-design §10: until now a figure
// of the crowd, statist_15). The market's way of seeing people (art/characters/markt_people.px.js, way A: straight down, about 40 px a
// metre, 13 px across ordinary shoulders): drawn once in his own frame (f forward, s to his left) and turned for down, up, right, left.
// His look is the one painted for the ride (art/rooms/sumpf.px.js), made over with the heron after the grey heron: a coat like folded
// grey wings with the black at the shoulders, the long white neck forward, the small white head with the long orange-yellow beak, the
// black stripe from the eye into the crest that hangs back over his neck. He holds his punting pole: standing, it leans on his near
// shoulder, its foot in the water beside the raft; punting (for the raft leaving the market), he pushes it back along the raft.
//   pike_top_blocks       his four views standing, then four frames punting (facing right), Juno beside him for size, 4x
//   pike_top_probe        a 320x180 window of the painted market round his raft, him on it, Juno at the edge where she talks to him
"use strict"
pal({ k: "#0c0e1a", g: "#8e96a8", G: "#c0c6d2", d: "#5c6478", b: "#1a2337", w: "#e8ecf2", o: "#f0a830", p: "#74513a", P: "#9c7048", x: "#131a2a" })

const PT = (() => {
  const TURN = { down: (f, s) => [s, f], up: (f, s) => [-s, -f], right: (f, s) => [f, -s], left: (f, s) => [-f, s] }
  /** his parts in his own frame, turned; flat tones (a block), what lies higher drawn last */
  function pike(c, N, dir, { push = 0 } = {}) {
    const T = TURN[dir], parts = []
    const set = (f, s, k, z) => parts.push([f, s, k, z])
    const ell = (cf, cs, rf, rs, k, z) => {
      for (let f = Math.floor(cf - rf - 1); f <= Math.ceil(cf + rf + 1); f++) for (let s = Math.floor(cs - rs - 1); s <= Math.ceil(cs + rs + 1); s++) {
        const a = (f - cf) / (rf + 0.5), b = (s - cs) / (rs + 0.5); if (a * a + b * b <= 1) set(f, s, k, z)
      }
    }
    const line = (f0, s0, f1, s1, k, z) => { const n = Math.max(Math.abs(f1 - f0), Math.abs(s1 - s0), 1); for (let j = 0; j <= n; j++) set(Math.round(f0 + (f1 - f0) * j / n), Math.round(s0 + (s1 - s0) * j / n), k, z) }
    // the pole: standing, from his right hand back past his shoulder; punting, pushed back along the raft and down into the water
    const pf = [3, 1, -1, -3][push] ?? 3
    line(pf + 2, -6, pf - 12, -7, "P", push ? 1 : 4)
    // the boots, long thin legs under him (only the feet show), the coat's tail: the folded wings over his back
    ell(1, 2, 1.4, 0.8, "b", 0); ell(1, -2, 1.4, 0.8, "b", 0)
    ell(-3, 0, 2.6, 3.4, "d", 1)
    // the coat: grey, its shoulders black; the arms, the right one forward to the pole
    ell(0, 0, 3, 5.2, "g", 2); ell(0.5, 4.2, 1.6, 1.2, "b", 2.5); ell(0.5, -4.2, 1.6, 1.2, "b", 2.5)
    ell(1.5, 5.6, 1.4, 0.8, "g", 2); ell(pf + 1, -5.6, 1.4, 0.8, "g", 2)
    // the long white neck forward, its black stroke down the front; the small white head; the beak; the crest hanging back
    ell(2.5, 0, 1.2, 1, "w", 3); set(3, 0, "b", 3.1)
    ell(4.5, 0, 1.3, 1.3, "w", 4)
    line(6, 0, 9, 0, "o", 5)
    line(4, 1, 1, 2, "b", 4.5); set(0, 2, "b", 4.5)
    // light from the top left: a lit seam on the coat's top-left edge once turned
    parts.sort((a, b) => a[3] - b[3])
    const m = new Map()
    for (const [f, s, k] of parts) { const [x, y] = T(f, s); m.set(x + "," + y, k) }
    for (const [key, k] of m) { const [x, y] = key.split(",").map(Number); c.px(N + x, N + y, k === "g" && !m.has(x - 1 + "," + y) ? "G" : k) }
    for (const key of m.keys()) { const [x, y] = key.split(",").map(Number); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!m.has(x + dx + "," + (y + dy))) c.px(N + x + dx, N + y + dy, "k") }
  }
  return { pike }
})()

const PW = 41, PN = 20
for (const dir of ["down", "up", "right", "left"]) {
  anim(`pike_top_block_${dir}`, { w: PW, h: PW, frames: 1 }, (c) => PT.pike(c, PN, dir))
  anim(`pike_top_block_punt_${dir}`, { w: PW, h: PW, frames: 4, ms: [300, 250, 250, 300] }, (c) => PT.pike(c, PN, dir, { push: c.frame }))
}

sprite("_pt_juno", { png: "../../build/art/characters/anims/juno_top_idle_down.png", area: [0, 0, 21, 21] })
scene("pike_top_blocks", { w: 9 * 44 + 4, h: 48, bg: "x" }, (c) => {
  ;["down", "up", "right", "left"].forEach((d, i) => c.stamp(`pike_top_block_${d}`, 4 + i * 44, 4))
  for (let i = 0; i < 4; i++) c.stamp("pike_top_block_punt_right", 4 + (4 + i) * 44, 4, { t: [0, 300, 550, 800][i] })
  c.stamp("_pt_juno", 4 + 8 * 44 + 10, 14)
})
// the market round his raft (sh tools/build_art.sh room drain_market built it): his place is game/places.js drain_market.pike,
// Juno's where she talks to him .pikeTalk
sprite("_pt_bg", { png: "../../build/art/rooms/drain_market/sprites/drain_market_bg.png", area: [960, 368 - 110, 320, 180] })      // the market's right edge
scene("pike_top_probe", { w: 320, h: 180, bg: "x" }, (c) => {
  c.stamp("_pt_bg", 0, 0)
  c.stamp("pike_top_block_down", 1196 - 960 - PN, 110 - PN)
  c.stamp("_pt_juno", 1200 - 960 - 10, 343 - 258 - 10)
})

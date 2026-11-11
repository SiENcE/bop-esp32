// A scale probe for the Drain Market at 4x4 screens (the user, 2026-11-11: A, straight down, but the market bigger against its
// people; maybe 4x4 with the people as big as now). Draft F's floor, stalls and neon shown twice as big (1280x720, about 40 px
// a meter), the people at their own size (Juno A of art/test/juno_oben_blocks.px.js, 13 px; the crowd in A's way, two people
// where F had one, a few walking). The floor is only F scaled up, in 2x2 blocks: this judges the proportion, not the look.
// First build the empty market and scale it:
//   pxl build art/test/juno_oben_blocks.px.js --out build/jtop/b3 --only juno_oben_markt_leer
//   python -c "from PIL import Image; Image.open('build/jtop/b3/scenes/juno_oben_markt_leer.png').resize((1280,720),Image.NEAREST).save('build/jtop/juno_oben_markt_x2.png')"
include("juno_oben_blocks.px.js", { palette: true })

sprite("_jtop_markt_x2", { png: "../../build/jtop/juno_oben_markt_x2.png" })

const J4 = (() => {
  const L = { x0: JOB.LOOP.x0 * 2, y0: JOB.LOOP.y0 * 2 + 4, x1: JOB.LOOP.x1 * 2, y1: JOB.LOOP.y1 * 2 + 4 }
  const across = (L.x1 - L.x0) / 2, down = L.y1 - L.y0
  const legs = [["right", 2, 0, across], ["down", 0, 1, down], ["left", -2, 0, across], ["up", 0, -1, down]]
  const FRAMES = legs.reduce((a, l) => a + l[3], 0)
  const at = (t) => {
    let x = L.x0, y = L.y0
    for (const [dir, dx, dy, n] of legs) { if (t < n) return { x: x + dx * t, y: y + dy * t, dir }; x += dx * n; y += dy * n; t -= n }
    return { x, y, dir: "up" }
  }
  const hs = (a) => ((a * 2654435761) >>> 0) / 4294967296
  const VIEW = { x: (L.x0 + L.x1) / 2 - 160, y: L.y0 - 96 }
  return { FRAMES, at, hs, VIEW }
})()

scene("juno_oben_probe_4x4", { w: 320, h: 180, frames: J4.FRAMES, fps: 10, bg: "k" }, (c) => {
  c.stamp("_jtop_crowd_cap", 4000, 4000)                       // paints F once, offscreen, to learn where its crowd stood
  c.stamp("_jtop_markt_x2", -J4.VIEW.x, -J4.VIEW.y)
  const T = c.frame, people = []
  for (const [x, y, seed] of CROWD_AT) for (const [dx, dy, k] of [[-6, -3, 0], [6, 3, 1]]) {
    const s = seed * 2 + k, h = J4.hs(s), walk = h < 0.18
    let px = x * 2 + dx, dir = ["down", "up", "right", "left"][Math.floor(J4.hs(s + 9) * 4)]
    if (walk) { const ph = (T + Math.floor(h * 400)) % 60; dir = ph < 30 ? "right" : "left"; px += ph < 30 ? ph - 15 : 45 - ph }
    people.push([px - J4.VIEW.x, y * 2 + dy - J4.VIEW.y, dir, walk, s])
  }
  const j = J4.at(T)
  people.push([j.x - J4.VIEW.x, j.y - J4.VIEW.y, j.dir, true, -1])
  for (const [x, y, dir, walk, s] of people.sort((a, b) => a[1] - b[1])) {
    if (x < -12 || y < -12 || x > 332 || y > 192) continue
    if (s < 0) JOB.drawA(c, x, y, dir, "walk", T % 8)
    else JOB.drawA(c, x, y, dir, walk ? "walk" : "idle", walk ? T % 8 : 0, JOB.stranger(s))
  }
})

// The same with Juno as painted (art/characters/juno_top.px.js), its own palette, the anchor in the frame's middle
include("../characters/juno_top.px.js")
scene("juno_top_probe_4x4", { w: 320, h: 180, frames: J4.FRAMES, fps: 10, bg: "k" }, (c) => {
  c.stamp("_jtop_crowd_cap", 4000, 4000)
  c.stamp("_jtop_markt_x2", -J4.VIEW.x, -J4.VIEW.y)
  const T = c.frame, people = []
  for (const [x, y, seed] of CROWD_AT) for (const [dx, dy, k] of [[-6, -3, 0], [6, 3, 1]]) {
    const s = seed * 2 + k, h = J4.hs(s), walk = h < 0.18
    let px = x * 2 + dx, dir = ["down", "up", "right", "left"][Math.floor(J4.hs(s + 9) * 4)]
    if (walk) { const ph = (T + Math.floor(h * 400)) % 60; dir = ph < 30 ? "right" : "left"; px += ph < 30 ? ph - 15 : 45 - ph }
    people.push([px - J4.VIEW.x, y * 2 + dy - J4.VIEW.y, dir, walk, s])
  }
  const j = J4.at(T)
  people.push([j.x - J4.VIEW.x, j.y - J4.VIEW.y, j.dir, true, -1])
  for (const [x, y, dir, walk, s] of people.sort((a, b) => a[1] - b[1])) {
    if (x < -12 || y < -12 || x > 332 || y > 192) continue
    if (s < 0) c.stamp(`juno_top_walk_${dir}`, x - 10, y - 10, { t: (T % 8) * 100 })
    else JOB.drawA(c, x, y, dir, walk ? "walk" : "idle", walk ? T % 8 : 0, JOB.stranger(s))
  }
})

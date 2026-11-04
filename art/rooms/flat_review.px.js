// Review images for the kit-baked flat (not game art).
//   review_flat_kit       the room as the engine draws it: flat_bg, the props at their `at`, sorted back to
//                         front by baseline, a Juno-sized block (1.68 m = 50 px, yellow) at the start spot
//   review_flat_kit_vs    the old flat (art/rooms/flat.px.js, its picture) beside the new one
// Build: PXL build art/rooms/flat_kit_review.px.js --only review_flat_kit --share 3 --out build/review
include("flat.px.js", { palette: true })
include("../characters/juno.px.js")

const RVK = (() => {
  const L = FLAT_KIT.layout, map = FLAT_KIT.map, P = FLAT_KIT.P
  // the engine's order (lib/cutaway/room.js): props by baseline; someone right after the last prop whose
  // front line they stand at or below
  const frontY = (line, x) => {
    const pts = []; for (let i = 0; i < line.length; i += 2) pts.push([line[i], line[i + 1]])
    pts.sort((a, b) => a[0] - b[0])
    if (x <= pts[0][0]) return pts[0][1]
    for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0) }
    return pts[pts.length - 1][1]
  }
  // Juno as a block: 0.36 x 0.26 m, 1.68 m tall, her yellow (lit side, shade side, top)
  const [ju, jv] = map.spots.start
  const juno = (c) => {
    const G = ISOKIT.geometry(map), B = ISOKIT.buffer(320, 180), pen = ISOKIT.makePen(G, B, 0, [ju, jv, 1])
    pen.box(ju - 0.18, jv - 0.13, 0, 0.36, 0.26, 1.68, () => "Y", () => "j", (a, e, o) => (a === 0 ? "Y" : "y"))
    for (let y = 0; y < 180; y++) for (let x = 0; x < 320; x++) { const k = B.k[y * 320 + x]; if (k) c.px(x, y, k) }
  }
  const feet = P(ju, jv)
  function draw(c, who = juno) {
    const t = (c.frame ?? 0) * 100
    const props = Object.entries(FLAT_KIT.props).map(([id, d]) => [id, d, L.props[id]]).sort((a, b) => a[2].baseline - b[2].baseline)
    let after = -1
    props.forEach(([, , l], i) => { if (feet[1] >= frontY(l.front, feet[0])) after = i })
    if (after < 0) who(c)
    props.forEach(([id, d], i) => { c.stamp(d.name, d.at[0], d.at[1], { t }); if (i === after) who(c) })
  }
  // the new Juno (art/characters/juno50.px.js), hood down indoors, at the start spot
  const real = (c) => c.stamp("juno_in_idle_se", feet[0], feet[1], { t: (c.frame ?? 0) * 100 })
  return { draw, real }
})()

scene("review_flat_kit", { w: 320, h: 180, bg: "k", frames: 12, fps: 10 },
  (c) => c.stamp("flat_bg", 0, 0, { t: (c.frame ?? 0) * 100 }),
  (c) => RVK.draw(c),
)

// the room with the new Juno in it
scene("review_flat_kit_juno", { w: 320, h: 180, bg: "k", frames: 12, fps: 10 },
  (c) => c.stamp("flat_bg", 0, 0, { t: (c.frame ?? 0) * 100 }),
  (c) => RVK.draw(c, RVK.real),
)

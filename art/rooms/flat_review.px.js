// Review images for Juno's flat (not game art: the atlas takes flat_* only).
//   review_flat         the room as the game draws it: flat_bg, the props at their `at`, sorted by
//                       baseline, Juno (juno_idle_se) by the deck for scale
//   review_flat_layout  FLAT.layout over the dimmed picture: walk area (cyan), holes (red), spots
//                       (yellow), hotspot rects (cyan corners), prop front lines (magenta)
// Build: PXL build art/rooms/flat_review.px.js --only review_flat --share 3 --out build/review
// (it prints FLAT.layout as JSON: docs/rooms/flat_layout.md is written from it)
include("flat.px.js", { palette: true })
include("../characters/juno.px.js")

console.log("FLAT_LAYOUT " + JSON.stringify(FLAT.layout))

const RV = { JUNO: FLAT.P(30, 19) }
// the engine's order (lib/cutaway/room.js): props by baseline; Juno right after the last prop she
// stands in front of (her feet at or below its front line where she stands)
const frontY = (line, x) => {
  const pts = []; for (let i = 0; i < line.length; i += 2) pts.push([line[i], line[i + 1]])
  pts.sort((a, b) => a[0] - b[0])
  if (x <= pts[0][0]) return pts[0][1]
  for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0) }
  return pts[pts.length - 1][1]
}
function rvProps(c, juno) {
  const L = FLAT.layout, t = (c.frame ?? 0) * 100
  const props = Object.entries(L.props).sort((a, b) => a[1].baseline - b[1].baseline)
  let after = -1
  if (juno) props.forEach(([, d], i) => { if (juno[1] >= frontY(d.front, juno[0])) after = i })
  if (juno && after < 0) c.stamp("juno_idle_se", juno[0], juno[1], { t: 0 })
  props.forEach(([name, d], i) => {
    c.stamp(name, d.at[0], d.at[1], { t })
    if (juno && i === after) c.stamp("juno_idle_se", juno[0], juno[1], { t: 0 })
  })
}

scene("review_flat", { w: 320, h: 180, bg: "k", frames: 12, fps: 10 },
  (c) => c.stamp("flat_bg", 0, 0, { t: (c.frame ?? 0) * 100 }),
  (c) => rvProps(c, RV.JUNO),
)

scene("review_flat_layout", { w: 320, h: 180, bg: "k" },
  (c) => c.stamp("flat_bg", 0, 0),
  (c) => rvProps(c, null),
  layer("dim", { opacity: 0.55 }, (c) => c.rect(0, 0, 320, 180, "k")),
  (c) => {
    const L = FLAT.layout
    const ring = (pts, k) => { for (let i = 0; i < pts.length; i += 2) { const j = (i + 2) % pts.length; c.line(pts[i], pts[i + 1], pts[j], pts[j + 1], k) } }
    L.walk.forEach((w) => ring(w, "v"))
    L.holes.forEach((w) => ring(w, "q"))
    for (const d of Object.values(L.props)) for (let i = 0; i + 3 < d.front.length; i += 2) c.line(d.front[i], d.front[i + 1], d.front[i + 2], d.front[i + 3], "m")
    for (const [x, y, w, h] of Object.values(L.hotspots)) {
      for (const [cx, cy, dx, dy] of [[x, y, 1, 1], [x + w - 1, y, -1, 1], [x, y + h - 1, 1, -1], [x + w - 1, y + h - 1, -1, -1]]) {
        c.hline(Math.min(cx, cx + dx * 2), cy, 3, "C"); c.vline(cx, Math.min(cy, cy + dy * 2), 3, "C")
      }
    }
    for (const q of Object.values(L.polys)) ring(q, "C")
    for (const [x, y] of Object.values(L.spots)) { c.hline(x - 1, y, 3, "Y"); c.vline(x, y - 1, 3, "Y") }
    for (const l of L.lamps) { c.ellipse(l.at[0], l.at[1], 1, 1, "W") }
  },
)

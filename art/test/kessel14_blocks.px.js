// H3, step 1: the 14th floor's landing (kessel_14) two ways, as blocks, for the choice between them.
//   kessel14_iso          the iso landing baked from its map (art/rooms/kessel_14.map.js): floor cells, the
//                         back walls with their openings, Frau Haldane's open door with her room behind it,
//                         the stairwell going down at the right, the props as boxes, Juno (1.68 m) and Motte
//   kessel14_iso_layout   the same, dimmed, with what the bake measures (walk area, holes, front lines, spots)
//   kessel14_side         the same floor as a side view (style guide §4, "other views"): a stage like
//                         mockup B, 30 px a meter both ways, the corridor along the screen, the stairs down
//                         at the right
pal({
  k: "#0c0e1a", n: "#06080f",
  1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  g: "#16231f", G: "#20332c", h: "#2b443a", H: "#3b5a4c", e: "#c8f5d0",   // the tube's green-grey concrete
  c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",
  b: "#1a2a6a", B: "#3a5cd8", L: "#6ab4ff",                                // the TV's blue, the Lull light
  i: "#2a1636", I: "#46204e", M: "#ff4fd3", m: "#a8238a", p: "#ffa8d8",
  O: "#552b1c", P: "#b0602a", Q: "#eea040", R: "#ffd58a",
  y: "#9a7406", Y: "#eec414", Z: "#fff070", W: "#f0f0a0", w: "#b8b890", q: "#ff3a3a",
})
include("../lib/isomap.js")
include("../rooms/kessel_14.map.js")
include("../lib/text.js")

const KB = (() => {
  const map = ISO_MAPS.kessel_14, { P } = ISOMAP.projector(map), [W, H] = map.screen
  /** fill a convex polygon of screen points */
  function poly(c, pts, k) {
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1])
    for (let y = Math.max(0, Math.min(...ys)); y <= Math.min(H - 1, Math.max(...ys)); y++) for (let x = Math.max(0, Math.min(...xs)); x <= Math.min(W - 1, Math.max(...xs)); x++)
      if (inside(pts, x, y)) c.px(x, y, k)
  }
  function inside(pts, x, y) {
    let pos = 0, neg = 0
    for (let i = 0; i < pts.length; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length], d = (x1 - x0) * (y + 0.5 - y0) - (y1 - y0) * (x + 0.5 - x0)
      if (d > 0) pos++; else if (d < 0) neg++
    }
    return !(pos && neg)
  }
  const quad = (c, a, b, d, e, k) => poly(c, [P(...a), P(...b), P(...d), P(...e)], k)
  function box(c, u, v, h, du, dv, dh, top, fu, fv) {
    const u1 = u + du, v1 = v + dv, h1 = h + dh
    quad(c, [u1, v, h], [u1, v1, h], [u1, v1, h1], [u1, v, h1], fu)
    quad(c, [u1, v1, h], [u, v1, h], [u, v1, h1], [u1, v1, h1], fv)
    quad(c, [u, v, h1], [u1, v, h1], [u1, v1, h1], [u, v1, h1], top)
  }
  const wallPt = (w, s, h) => (w.from[1] === w.to[1] ? [w.from[0] + s, w.from[1], h] : [w.from[0], w.from[1] + s, h])
  /** a rectangle on wall w's plane, a..b meters along it, h0..h1 up */
  const onWall = (c, w, a, b, h0, h1, k) => quad(c, wallPt(w, a, h0), wallPt(w, b, h0), wallPt(w, b, h1), wallPt(w, a, h1), k)
  const PROPK = { bin_bags: ["4", "3", "2"], bikes: ["6", "5", "4"], stair_rail: ["6", "5", "5"], armchair: ["I", "i", "i"], tv_old: ["3", "2", "2"] }
  const OPENK = { door_14b: "1", note_war: "w", neon_tube: "e", sign_14: "5" }

  /** the stairwell: the wall going down beside it, the risers and treads from the top step down */
  function stairs(c) {
    const s = map.stairs, [u0, v0] = s.from, [u1, v1] = s.to, n = Math.round((u1 - u0) / s.tread), deep = (n + 2) * s.rise
    quad(c, [u0, v0, -deep], [u1, v0, -deep], [u1, v0, 0], [u0, v0, 0], "1")              // the well's wall, below the floor
    for (let i = 0; i < n; i++) {
      const a = u0 + i * s.tread, top = -(i + 1) * s.rise
      quad(c, [a, v0, top + s.rise], [a, v1, top + s.rise], [a, v1, top], [a, v0, top], "3")     // riser, facing +u
      quad(c, [a, v0, top], [a + s.tread, v0, top], [a + s.tread, v1, top], [a, v1, top], i % 2 ? "4" : "5")
    }
  }

  /** Frau Haldane's room through her open door: drawn after the wall, only inside the opening */
  function behind(c, o) {
    const w = map.walls[o.wall], hole = [P(...wallPt(w, o.from, o.h[0])), P(...wallPt(w, o.to, o.h[0])), P(...wallPt(w, o.to, o.h[1])), P(...wallPt(w, o.from, o.h[1]))]
    const cc = { px: (x, y, k) => { if (inside(hole, x, y)) c.px(x, y, k) } }
    const d = o.open.depth
    poly(cc, hole, "n")
    quad(cc, [o.from - 2, -d, 0], [o.to + 1, -d, 0], [o.to + 1, 0, 0], [o.from - 2, 0, 0], "b")          // her floor in the TV's light
    quad(cc, [o.from - 2, -d, 0], [o.to + 1.5, -d, 0], [o.to + 1.5, -d, 2.6], [o.from - 2, -d, 2.6], "1") // her far wall
    const ps = map.props.filter((p) => p.behind === o.id).sort((a, b) => (a.at[0] + a.foot[0] + a.at[1] + a.foot[1]) - (b.at[0] + b.foot[0] + b.at[1] + b.foot[1]))
    for (const p of ps) { const [t, fu, fv] = PROPK[p.kit]; box(cc, p.at[0], p.at[1], 0, p.foot[0], p.foot[1], p.h, t, fu, fv) }
    // Frau Haldane asleep in the chair, the Lull light at her temple
    const [hu, hv] = map.spots.haldane_sits
    box(cc, hu - 0.2, hv - 0.2, 0.45, 0.4, 0.4, 0.55, "p", "p", "m")
    box(cc, hu - 0.1, hv - 0.1, 1.0, 0.22, 0.22, 0.24, "R", "Q", "P")
    const [lx, ly] = P(...map.lights.find((l) => l.id === "lull").at); c.rect(lx, ly, 2, 2, "L")
  }

  function room(c) {
    c.rect(0, 0, W, H, "n")
    stairs(c)
    map.floor.forEach((row, j) => [...row].forEach((key, i) => {
      if (key === ".") return
      const u = i * map.cell, v = j * map.cell, s = map.cell
      quad(c, [u, v, 0], [u + s, v, 0], [u + s, v + s, 0], [u, v + s, 0], key === "l" ? "h" : (i + j) % 2 ? "G" : "g")
    }))
    map.walls.forEach((w, wi) => {
      const len = Math.hypot(w.to[0] - w.from[0], w.to[1] - w.from[1]), alongU = w.from[1] === w.to[1]
      onWall(c, w, 0, len, 0, w.stub ? 0.18 : w.h, w.stub ? "H" : alongU ? "G" : "h")
      if (!w.stub) onWall(c, w, 0, len, w.h - 0.04, w.h, "H")
      for (const o of map.openings.filter((o) => o.wall === wi)) {
        if (o.open) behind(c, o)
        else onWall(c, w, o.from, o.to, o.h[0], o.h[1], OPENK[o.kit] ?? "6")
      }
    })
    const props = map.props.filter((p) => !p.behind).sort((a, b) => (a.at[0] + a.foot[0] + a.at[1] + a.foot[1]) - (b.at[0] + b.foot[0] + b.at[1] + b.foot[1]))
    for (const p of props) {
      if (p.kit === "stair_rail") {                    // posts and a bar: the steps show through it
        const n = 4
        for (let i = 0; i <= n; i++) box(c, p.at[0] + i * (p.foot[0] - 0.05) / n, p.at[1], 0, 0.05, 0.05, p.h, "6", "5", "5")
        box(c, p.at[0], p.at[1], p.h - 0.05, p.foot[0], 0.06, 0.05, "6", "5", "5")
        continue
      }
      const [t, fu, fv] = PROPK[p.kit] ?? ["6", "5", "4"]; box(c, p.at[0], p.at[1], 0, p.foot[0], p.foot[1], p.h, t, fu, fv)
    }
    // Motte on the stairs (a child, 1.2 m standing: sitting on the second step), her white cap
    const [mu, mv] = map.spots.motte_sits, mh = -2 * map.stairs.rise
    box(c, mu - 0.15, mv - 0.18, mh, 0.3, 0.36, 0.75, "4", "5", "3")
    box(c, mu - 0.12, mv - 0.12, mh + 0.75, 0.24, 0.24, 0.12, "W", "W", "w")
    // Juno, 1.68 m, where she comes out of her door
    const [ju, jv] = map.spots.arrive
    box(c, ju - 0.2, jv - 0.15, 0, 0.4, 0.3, 1.68, "Z", "Y", "y")
  }
  return { map, P, W, H, room }
})()

sprite("kessel14_iso", { w: KB.W, h: KB.H }, (c) => {
  KB.room(c)
  TXT.draw(c, 4, 4, "ISO: KESSEL 14, 5 X 4,5 M", "6", { font: "hud" })
})

sprite("kessel14_iso_layout", { w: KB.W, h: KB.H }, (c) => {
  KB.room(c)
  for (let y = 0; y < KB.H; y++) for (let x = 0; x < KB.W; x++) if ((x + y) % 2) c.px(x, y, "n")
  const L = ISOMAP.layout(KB.map)
  const ring = (pts, k) => { for (let i = 0; i < pts.length; i += 2) { const j = (i + 2) % pts.length; c.line(pts[i], pts[i + 1], pts[j], pts[j + 1], k) } }
  const inside = (pts, x, y) => { let r = false; for (let i = 0, j = pts.length - 2; i < pts.length; j = i, i += 2) { const [xi, yi, xj, yj] = [pts[i], pts[i + 1], pts[j], pts[j + 1]]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) r = !r } return r }
  for (let y = 0; y < KB.H; y++) for (let x = 0; x < KB.W; x++) if ((x + y) % 2 === 0 && L.walk.some((p) => inside(p, x + 0.5, y + 0.5)) && !L.holes.some((p) => inside(p, x + 0.5, y + 0.5))) c.px(x, y, "c")
  L.walk.forEach((p) => ring(p, "v")); L.holes.forEach((p) => ring(p, "q"))
  for (const [id, p] of Object.entries(L.props)) if (!KB.map.props.find((q) => q.id === id).behind) for (let i = 0; i + 3 < p.front.length; i += 2) c.line(p.front[i], p.front[i + 1], p.front[i + 2], p.front[i + 3], "M")
  for (const [k, [x, y]] of Object.entries(L.spots)) {
    c.rect(x - 1, y - 1, 3, 3, "Z")
    const f = L.face[k], d = { ne: [2, -1], nw: [-2, -1], se: [2, 1], sw: [-2, 1] }[f]
    if (d) c.line(x, y, x + d[0] * 2, y + d[1] * 2, "Z")
  }
  for (const l of L.lamps) c.rect(l.at[0] - 1, l.at[1] - 1, 3, 3, "V")
  TXT.draw(c, 4, 4, "LAUFFLÄCHE, LÖCHER, FRONTLINIEN, PUNKTE", "6", { font: "hud" })
})

// The side view: x along the corridor, 30 px a meter; the floor's front edge at y 170, its back (the wall's
// foot) at y 150, so people walk in a 20 px band; the ceiling 2.6 m over the wall's foot.
sprite("kessel14_side", { w: 320, h: 180 }, (c) => {
  const M = 30, FOOT = 150, CEIL = FOOT - 78, m = (x) => Math.round(x * M)
  c.rect(0, 0, 320, 180, "n")
  c.rect(0, CEIL - 12, 320, 12, "1")                                     // the slab over the corridor
  c.rect(0, CEIL, 320, FOOT - CEIL, "G")                                 // the back wall
  c.rect(0, FOOT - 3, 320, 3, "h")                                       // its skirting
  c.rect(0, FOOT, 320, 20, "g")                                          // the floor, the walking band
  c.rect(0, 170, 320, 10, "1")                                           // the slab's cut front
  for (let x = 0; x < 320; x += 32) c.rect(x, FOOT, 1, 20, "G")
  // the tube along the ceiling, and its pool on the floor
  c.rect(m(2.6), CEIL + 2, m(2.2), 2, "e")
  // Juno's door 14B, at the left
  c.rect(m(0.9), FOOT - 62, m(0.9) + 4, 62, "H"); c.rect(m(0.9) + 2, FOOT - 60, m(0.9), 60, "1")
  // the bikes along the wall (two, 1.7 m), the note war beside Frau Haldane's door
  for (const [x, o] of [[2.1, 0], [2.6, 3]]) {
    const bx = m(x), by = FOOT + 2 - o
    for (const wx of [bx + 10, bx + 42]) { c.ellipse(wx, by - 10, 10, 10, "5"); c.ellipse(wx, by - 10, 8, 8, "G") }
    c.line(bx + 10, by - 10, bx + 26, by - 24, "6"); c.line(bx + 26, by - 24, bx + 42, by - 10, "6"); c.line(bx + 20, by - 24, bx + 34, by - 24, "6")
  }
  c.rect(m(4.6), FOOT - 50, 14, 10, "w"); c.rect(m(4.6) + 8, FOOT - 42, 12, 8, "W")
  // Frau Haldane's door 14C, open: her room behind, the TV's blue, her asleep in the armchair
  const hx = m(5.4), hw = m(1.6)
  c.rect(hx - 2, FOOT - 62, hw + 4, 62, "H")
  c.rect(hx, FOOT - 60, hw, 60, "b"); c.rect(hx, FOOT - 60, hw, 40, "1")
  c.rect(hx, FOOT - 60, 6, 60, "2")                                      // the door leaf, swung in
  c.rect(hx + hw - 14, FOOT - 34, 12, 12, "B")                           // the TV, its screen toward her
  c.rect(hx + 10, FOOT - 26, 24, 26, "I"); c.rect(hx + 10, FOOT - 36, 6, 36, "i")   // the armchair, its back
  c.rect(hx + 14, FOOT - 30, 16, 18, "p"); c.rect(hx + 13, FOOT - 38, 8, 8, "Q")      // her, slumped, her head
  c.rect(hx + 13, FOOT - 36, 2, 2, "L")
  // bin bags, the floor sign
  c.ellipse(m(7.6), FOOT - 6, 8, 8, "3"); c.ellipse(m(7.9), FOOT - 4, 6, 6, "4")
  TXT.draw(c, m(8.4), FOOT - 52, "14", "5", { font: "hud" })
  // the stairs at the right: down to the lobby (the floor ends, the steps go down out of the picture),
  // up to 15 over them; a rail; Motte on the second step down
  const sx = m(8.7)
  c.rect(sx, FOOT, 320 - sx, 30, "n")
  for (let i = 0; i < 9; i++) c.rect(sx + i * 9, FOOT + 5 + i * 5, 320 - sx - i * 9, 5, i % 2 ? "4" : "5")
  for (let i = 0; i < 12; i++) c.rect(sx + 8 + i * 9, CEIL - 4 - i * 5, 9, 4, "3")
  c.line(sx, FOOT - 28, 320, FOOT - 28 + Math.round((320 - sx) * 5 / 9), "6"); c.rect(sx, FOOT - 28, 2, 28, "6")
  const mx = sx + 14, my = FOOT + 10
  c.rect(mx, my - 22, 10, 22, "4"); c.rect(mx + 1, my - 28, 9, 6, "R"); c.rect(mx, my - 31, 11, 4, "W")
  // Juno, 1.68 m (50 px), in the band in front of her door
  c.rect(m(1.7), FOOT + 8 - 50, 14, 50, "Y"); c.rect(m(1.7) + 10, FOOT + 8 - 50, 4, 50, "y")
  TXT.draw(c, 4, 4, "SEITE: 30 PX/M, FLUR 10,7 M", "6", { font: "hud" })
})

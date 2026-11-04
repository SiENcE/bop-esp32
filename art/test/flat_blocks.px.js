// H1c, step 1: Juno's flat baked from its map (art/rooms/flat.map.js) as blocks, at the new scale, with
// what the bake measures for the game laid over it (art/lib/isomap.js layout()). Checks the map format,
// the scale and the measuring before any kit is painted.
//   flat_blocks         the room in blocks: floor cells, the back walls' inner faces with their openings,
//                       the near walls as stubs, the props as boxes, Juno (1.68 m) at the start spot
//   flat_blocks_layout  the same, dimmed, with the walk area (cyan), holes (red), the props' front lines
//                       (magenta), the spots (yellow, with their facing)
pal({
  k: "#0c0e1a", n: "#06080f",
  1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",
  i: "#2a1636", I: "#46204e", M: "#ff4fd3", m: "#a8238a",
  O: "#552b1c", P: "#b0602a", Q: "#eea040", R: "#ffd58a",
  y: "#9a7406", Y: "#eec414", Z: "#fff070", q: "#ff3a3a",
})
include("../lib/isomap.js")
include("../rooms/flat.map.js")
include("../lib/text.js")

const FB = (() => {
  const map = ISO_MAPS.flat, { P } = ISOMAP.projector(map), [W, H] = map.screen
  /** fill a convex polygon of screen points */
  function poly(c, pts, k) {
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1])
    for (let y = Math.max(0, Math.min(...ys)); y <= Math.min(H - 1, Math.max(...ys)); y++) for (let x = Math.max(0, Math.min(...xs)); x <= Math.min(W - 1, Math.max(...xs)); x++) {
      let pos = 0, neg = 0
      for (let i = 0; i < pts.length; i++) {
        const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length], d = (x1 - x0) * (y + 0.5 - y0) - (y1 - y0) * (x + 0.5 - x0)
        if (d > 0) pos++; else if (d < 0) neg++
      }
      if (!(pos && neg)) c.px(x, y, k)
    }
  }
  const quad = (c, a, b, d, e, k) => poly(c, [P(...a), P(...b), P(...d), P(...e)], k)
  function box(c, u, v, h, du, dv, dh, top, fu, fv) {
    const u1 = u + du, v1 = v + dv, h1 = h + dh
    quad(c, [u1, v, h], [u1, v1, h], [u1, v1, h1], [u1, v, h1], fu)
    quad(c, [u1, v1, h], [u, v1, h], [u, v1, h1], [u1, v1, h1], fv)
    quad(c, [u, v, h1], [u1, v, h1], [u1, v1, h1], [u, v1, h1], top)
  }
  /** a rectangle on wall w's plane, a..b meters along it, h0..h1 up */
  function onWall(c, w, a, b, h0, h1, k) {
    const alongU = w.from[1] === w.to[1], pt = (s, h) => (alongU ? [w.from[0] + s, w.from[1], h] : [w.from[0], w.from[1] + s, h])
    quad(c, pt(a, h0), pt(b, h0), pt(b, h1), pt(a, h1), k)
  }
  const PROPK = { fridge: ["6", "5", "4"], deck_rig: ["5", "4", "3"], chair: ["4", "3", "2"], cup_tower: ["R", "Q", "P"],
    laundry: ["I", "i", "i"], bed_pallet: ["I", "i", "m"], box_old: ["P", "O", "O"] }
  const OPENK = { window_rain: "C", door_flat: "1", pinboard: "O", led_strip: "R" }

  function room(c) {
    c.rect(0, 0, W, H, "n")
    // the floor, cell by cell
    map.floor.forEach((row, j) => [...row].forEach((key, i) => {
      if (key === ".") return
      const u = i * map.cell, v = j * map.cell, s = map.cell
      quad(c, [u, v, 0], [u + s, v, 0], [u + s, v + s, 0], [u, v + s, 0], key === "w" ? "3" : (i + j) % 2 ? "2" : "1")
    }))
    // the walls: the back walls' inner faces full height, the near ones as a stub over the slab
    map.walls.forEach((w, wi) => {
      const len = Math.hypot(w.to[0] - w.from[0], w.to[1] - w.from[1]), alongU = w.from[1] === w.to[1]
      onWall(c, w, 0, len, 0, w.stub ? 0.18 : w.h, w.stub ? "5" : alongU ? "3" : "4")
      if (!w.stub) onWall(c, w, 0, len, w.h - 0.04, w.h, "5")                         // its top edge
      for (const o of map.openings.filter((o) => o.wall === wi)) onWall(c, w, o.from, o.to, o.h[0], o.h[1], OPENK[o.kit] ?? "6")
    })
    // the props, back to front (by their front corner)
    const props = [...map.props].sort((a, b) => (a.at[0] + a.foot[0] + a.at[1] + a.foot[1]) - (b.at[0] + b.foot[0] + b.at[1] + b.foot[1]))
    for (const p of props) { const [t, fu, fv] = PROPK[p.kit] ?? ["6", "5", "4"]; box(c, p.at[0], p.at[1], 0, p.foot[0], p.foot[1], p.h, t, fu, fv) }
    // Juno, 1.68 m, at the start spot (a block: her hood, her slicker)
    const [ju, jv] = map.spots.start
    box(c, ju - 0.2, jv - 0.15, 0, 0.4, 0.3, 1.68, "Z", "Y", "y")
  }
  return { map, P, W, H, room }
})()

sprite("flat_blocks", { w: FB.W, h: FB.H }, (c) => {
  FB.room(c)
  TXT.draw(c, 4, 4, "16 E/M  30 PX/M  JUNO 50 PX", "6", { font: "hud" })
})

sprite("flat_blocks_layout", { w: FB.W, h: FB.H }, (c) => {
  FB.room(c)
  for (let y = 0; y < FB.H; y++) for (let x = 0; x < FB.W; x++) if ((x + y) % 2) c.px(x, y, "n")      // dim it
  const L = ISOMAP.layout(FB.map)
  const ring = (pts, k) => { for (let i = 0; i < pts.length; i += 2) { const j = (i + 2) % pts.length; c.line(pts[i], pts[i + 1], pts[j], pts[j + 1], k) } }
  // the walk area filled (even-odd over its loops and holes, as the engine tests a point), then its edges
  const inside = (pts, x, y) => { let r = false; for (let i = 0, j = pts.length - 2; i < pts.length; j = i, i += 2) { const [xi, yi, xj, yj] = [pts[i], pts[i + 1], pts[j], pts[j + 1]]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) r = !r } return r }
  for (let y = 0; y < FB.H; y++) for (let x = 0; x < FB.W; x++) if ((x + y) % 2 === 0 && L.walk.some((p) => inside(p, x + 0.5, y + 0.5)) && !L.holes.some((p) => inside(p, x + 0.5, y + 0.5))) c.px(x, y, "c")
  L.walk.forEach((p) => ring(p, "v")); L.holes.forEach((p) => ring(p, "q"))
  for (const p of Object.values(L.props)) for (let i = 0; i + 3 < p.front.length; i += 2) c.line(p.front[i], p.front[i + 1], p.front[i + 2], p.front[i + 3], "M")
  for (const [k, [x, y]] of Object.entries(L.spots)) {
    c.rect(x - 1, y - 1, 3, 3, "Z")
    const f = L.face[k], d = { ne: [2, -1], nw: [-2, -1], se: [2, 1], sw: [-2, 1] }[f]
    if (d) c.line(x, y, x + d[0] * 2, y + d[1] * 2, "Z")
  }
  for (const l of L.lamps) { c.rect(l.at[0] - 1, l.at[1] - 1, 3, 3, "V") }
  TXT.draw(c, 4, 4, "LAUFFLÄCHE, LÖCHER, FRONTLINIEN, PUNKTE: GEMESSEN AUS DER KARTE", "6", { font: "hud" })
})

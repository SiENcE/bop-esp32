// H3: the Kessel Block's lobby (kessel_lobby) baked from its map (art/rooms/kessel_lobby.map.js) as blocks,
// for approval before its kit is painted: floor cells (wet ones darker, the mat), the back walls with their
// openings, the props as boxes, Juno (1.68 m) coming down the stairs; and the measured layout over it.
//   lobby_blocks          the room in blocks
//   lobby_blocks_layout   dimmed, with the walk area (cyan), the props' front lines (magenta), the spots (yellow)
pal({
  k: "#0c0e1a", n: "#06080f",
  1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",
  i: "#2a1636", M: "#ff4fd3", m: "#a8238a",
  O: "#552b1c", P: "#b0602a", Q: "#eea040", R: "#ffd58a", H: "#b9c6d8",
  y: "#9a7406", Y: "#eec414", Z: "#fff070", q: "#ff3a3a",
})
include("../lib/isomap.js")
include("../rooms/kessel_lobby.map.js")
include("../lib/text.js")

const LB = (() => {
  const map = ISO_MAPS.kessel_lobby, { P } = ISOMAP.projector(map), [W, H] = map.screen
  function inside(pts, x, y) {
    let pos = 0, neg = 0
    for (let i = 0; i < pts.length; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length], d = (x1 - x0) * (y + 0.5 - y0) - (y1 - y0) * (x + 0.5 - x0)
      if (d > 0) pos++; else if (d < 0) neg++
    }
    return !(pos && neg)
  }
  function poly(c, pts, k) {
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1])
    for (let y = Math.max(0, Math.min(...ys)); y <= Math.min(H - 1, Math.max(...ys)); y++) for (let x = Math.max(0, Math.min(...xs)); x <= Math.min(W - 1, Math.max(...xs)); x++) if (inside(pts, x, y)) c.px(x, y, k)
  }
  const quad = (c, a, b, d, e, k) => poly(c, [P(...a), P(...b), P(...d), P(...e)], k)
  function box(c, u, v, h, du, dv, dh, top, fu, fv) {
    const u1 = u + du, v1 = v + dv, h1 = h + dh
    quad(c, [u1, v, h], [u1, v1, h], [u1, v1, h1], [u1, v, h1], fu)
    quad(c, [u1, v1, h], [u, v1, h], [u, v1, h1], [u1, v1, h1], fv)
    quad(c, [u, v, h1], [u1, v, h1], [u1, v1, h1], [u, v1, h1], top)
  }
  const wallPt = (w, s, h) => (w.from[1] === w.to[1] ? [w.from[0] + s, w.from[1], h] : [w.from[0], w.from[1] + s, h])
  const onWall = (c, w, a, b, h0, h1, k) => quad(c, wallPt(w, a, h0), wallPt(w, b, h0), wallPt(w, b, h1), wallPt(w, a, h1), k)
  const OPENK = { stair_arch: "1", lift_doors: "6", poster_listens: "C", mailboxes: "5", notice_board: "O", street_door: "m" }
  const PROPK = { wet_sign: ["Z", "Y", "y"], flyers: ["H", "H", "H"] }
  function room(c) {
    c.rect(0, 0, W, H, "n")
    map.floor.forEach((row, j) => [...row].forEach((key, i) => {
      if (key === ".") return
      const u = i * map.cell, v = j * map.cell, s = map.cell
      quad(c, [u, v, 0], [u + s, v, 0], [u + s, v + s, 0], [u, v + s, 0], key === "w" ? "i" : key === "m" ? "O" : (i + j) % 2 ? "3" : "2")
    }))
    map.walls.forEach((w, wi) => {
      const len = Math.hypot(w.to[0] - w.from[0], w.to[1] - w.from[1]), alongU = w.from[1] === w.to[1]
      onWall(c, w, 0, len, 0, w.stub ? 0.18 : w.h, w.stub ? "5" : alongU ? "4" : "3")
      if (!w.stub) onWall(c, w, 0, len, w.h - 0.04, w.h, "5")
      for (const o of map.openings.filter((o) => o.wall === wi)) {
        onWall(c, w, o.from, o.to, o.h[0], o.h[1], OPENK[o.kit] ?? "6")
        if (o.kit === "lift_doors") { const m = (o.from + o.to) / 2; onWall(c, w, m - 0.01, m + 0.01, o.h[0], o.h[1], "4"); onWall(c, w, m - 0.2, m + 0.2, 1.3, 1.55, "R") }
        if (o.kit === "street_door") onWall(c, w, o.from + 0.08, o.to - 0.08, 0.15, o.h[1] - 0.1, "M")
        if (o.kit === "stair_arch") for (let i = 0; i < 6; i++) onWall(c, w, o.from + 0.1, o.to - 0.1, i * 0.3, i * 0.3 + 0.08, "3")
      }
    })
    const props = [...map.props].sort((a, b) => (a.at[0] + a.foot[0] + a.at[1] + a.foot[1]) - (b.at[0] + b.foot[0] + b.at[1] + b.foot[1]))
    for (const p of props) { const [t, fu, fv] = PROPK[p.kit] ?? ["6", "5", "4"]; box(c, p.at[0], p.at[1], 0, p.foot[0], p.foot[1], p.h, t, fu, fv) }
    const [ju, jv] = map.spots.arrive
    box(c, ju - 0.2, jv - 0.15, 0, 0.4, 0.3, 1.68, "Z", "Y", "y")
  }
  return { map, W, H, room }
})()

sprite("lobby_blocks", { w: LB.W, h: LB.H }, (c) => {
  LB.room(c)
  TXT.draw(c, 4, 4, "LOBBY, 5 X 4,5 M, DECKE 2,8 M", "6", { font: "hud" })
})

sprite("lobby_blocks_layout", { w: LB.W, h: LB.H }, (c) => {
  LB.room(c)
  for (let y = 0; y < LB.H; y++) for (let x = 0; x < LB.W; x++) if ((x + y) % 2) c.px(x, y, "n")
  const L = ISOMAP.layout(LB.map)
  const ring = (pts, k) => { for (let i = 0; i < pts.length; i += 2) { const j = (i + 2) % pts.length; c.line(pts[i], pts[i + 1], pts[j], pts[j + 1], k) } }
  L.walk.forEach((p) => ring(p, "v")); L.holes.forEach((p) => ring(p, "q"))
  for (const p of Object.values(L.props)) for (let i = 0; i + 3 < p.front.length; i += 2) c.line(p.front[i], p.front[i + 1], p.front[i + 2], p.front[i + 3], "M")
  for (const [k, [x, y]] of Object.entries(L.spots)) c.rect(x - 1, y - 1, 3, 3, "Z")
  for (const l of L.lamps) c.rect(l.at[0] - 1, l.at[1] - 1, 3, 3, "V")
  TXT.draw(c, 4, 4, "LAUFFLÄCHE, FRONTLINIEN, PUNKTE", "6", { font: "hud" })
})

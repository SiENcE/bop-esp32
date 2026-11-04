// H3: Kowalski Street (kowalski) baked from its map (art/rooms/kowalski.map.js) as blocks, for approval before
// its kit is painted: the street of mockup C at the new scale (416 px wide: it scrolls), the facades with their
// openings, the props as boxes (Bao's cart with its umbrella), Bao and Juno (1.68 m) as blocks, the string
// lights; and the measured layout over it.
//   kowalski_blocks          the street in blocks
//   kowalski_blocks_layout   dimmed, with the walk area (cyan), the props' front lines (magenta), the spots
pal({
  k: "#0c0e1a", n: "#06080f",
  1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",
  i: "#2a1636", M: "#ff4fd3", m: "#a8238a",
  O: "#552b1c", P: "#b0602a", Q: "#eea040", R: "#ffd58a", H: "#b9c6d8",
  y: "#9a7406", Y: "#eec414", Z: "#fff070", q: "#ff3a3a",
})
include("../lib/isomap.js")
include("../rooms/kowalski.map.js")
include("../lib/text.js")

const KW = (() => {
  const map = ISO_MAPS.kowalski, { P } = ISOMAP.projector(map), [W, H] = map.screen
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
  const OPENK = { kessel_street_door: "c", lucky_window: "Q", lucky_door: "O", lucky_sign: "M", ad_screen: "C", alley_gate: "1" }
  const PROPK = { vending: ["6", "C", "c"], bao_cart: ["P", "O", "O"], bins: ["4", "3", "2"] }
  function room(c) {
    c.rect(0, 0, W, H, "n")
    map.floor.forEach((row, j) => [...row].forEach((key, i) => {
      if (key === ".") return
      const u = i * map.cell, v = j * map.cell, s = map.cell
      quad(c, [u, v, 0], [u + s, v, 0], [u + s, v + s, 0], [u, v + s, 0], key === "w" ? "i" : key === "g" ? "1" : key === "s" ? ((i + j) % 2 ? "4" : "3") : "2")
    }))
    map.walls.forEach((w, wi) => {
      const len = Math.hypot(w.to[0] - w.from[0], w.to[1] - w.from[1]), alongU = w.from[1] === w.to[1]
      onWall(c, w, 0, len, 0, w.stub ? 0.18 : w.h, w.stub ? "5" : alongU ? "4" : "3")
      if (!w.stub) onWall(c, w, 0, len, w.h - 0.04, w.h, "5")
      for (const o of map.openings.filter((o) => o.wall === wi)) {
        onWall(c, w, o.from, o.to, o.h[0], o.h[1], OPENK[o.kit] ?? "6")
        if (o.kit === "ad_screen") { onWall(c, w, o.from + 0.1, (o.from + o.to) / 2, o.h[0] + 0.1, o.h[1] - 0.1, "v"); onWall(c, w, (o.from + o.to) / 2 + 0.4, (o.from + o.to) / 2 + 0.9, 2.3, 2.9, "V") }
      }
    })
    const props = [...map.props].sort((a, b) => (a.at[0] + a.foot[0] + a.at[1] + a.foot[1]) - (b.at[0] + b.foot[0] + b.at[1] + b.foot[1]))
    // the upper floors' windows on both facades (the buildings go on up past the picture's top)
    for (const [wi, w] of map.walls.entries()) for (let s = 0.4; s < 6.6; s += 1.1) for (const h of [3.8, 5.0]) if ((s * 7 + h) % 3 > 1) onWall(c, w, s, s + 0.6, h, h + 0.7, (s + h) % 2 > 1 ? "R" : "1")
    // Bao behind his cart, the cart, its umbrella over both; Juno under it, eating
    const [bu, bv] = map.spots.bao
    box(c, bu - 0.2, bv - 0.15, 0, 0.4, 0.3, 1.6, "H", "5", "4")
    for (const p of props) { if (p.kit === "string_lights") continue; const [t, fu, fv] = PROPK[p.kit] ?? ["6", "5", "4"]; box(c, p.at[0], p.at[1], 0, p.foot[0], p.foot[1], p.h, t, fu, fv) }
    const [ju, jv] = map.spots.eat
    box(c, ju - 0.2, jv - 0.15, 0, 0.4, 0.3, 1.68, "Z", "Y", "y")
    const cart = map.props.find((p) => p.id === "cart"), [cu, cv] = [cart.at[0] + cart.foot[0] / 2, cart.at[1] + cart.foot[1] / 2]
    c.line(...P(cu, cv, 0.95), ...P(cu, cv, 2.2), "5")
    for (let a = 0; a < 64; a++) { const t = a / 64 * Math.PI * 2; for (let r = 0; r <= 1.0; r += 0.05) c.px(...P(cu + r * Math.cos(t), cv + r * Math.sin(t), 2.25 - r * 0.25), r > 0.95 ? "m" : "i") }
    // the string lights: two catenaries from facade to facade, their bulbs
    for (const [a, b] of [[[0, 1.6, 3.4], [2.6, 0, 3.5]], [[0, 3.4, 3.3], [4.8, 0, 3.6]]]) for (let t = 0; t <= 1; t += 0.02) {
      const sag = Math.sin(t * Math.PI) * 0.45, q = P(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t - sag)
      c.px(q[0], q[1], Math.round(t * 50) % 6 === 0 ? "R" : "1")
    }
  }
  return { map, W, H, room }
})()

sprite("kowalski_blocks", { w: KW.W, h: KW.H }, (c) => {
  KW.room(c)
  TXT.draw(c, 4, 4, "KOWALSKI, 7 X 6 M, 416 PX BREIT (SCROLLT)", "6", { font: "hud" })
})

sprite("kowalski_blocks_layout", { w: KW.W, h: KW.H }, (c) => {
  KW.room(c)
  for (let y = 0; y < KW.H; y++) for (let x = 0; x < KW.W; x++) if ((x + y) % 2) c.px(x, y, "n")
  const L = ISOMAP.layout(KW.map)
  const ring = (pts, k) => { for (let i = 0; i < pts.length; i += 2) { const j = (i + 2) % pts.length; c.line(pts[i], pts[i + 1], pts[j], pts[j + 1], k) } }
  L.walk.forEach((p) => ring(p, "v")); L.holes.forEach((p) => ring(p, "q"))
  for (const p of Object.values(L.props)) for (let i = 0; i + 3 < p.front.length; i += 2) c.line(p.front[i], p.front[i + 1], p.front[i + 2], p.front[i + 3], "M")
  for (const [k, [x, y]] of Object.entries(L.spots)) c.rect(x - 1, y - 1, 3, 3, "Z")
  for (const l of L.lamps) c.rect(l.at[0] - 1, l.at[1] - 1, 3, 3, "V")
  TXT.draw(c, 4, 4, "LAUFFLÄCHE, FRONTLINIEN, PUNKTE", "6", { font: "hud" })
})

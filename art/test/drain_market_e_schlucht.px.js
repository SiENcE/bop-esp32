// The Drain Market, draft E: the canyon from above. BLOCKS (flat shapes, no texture), rough in light and atmosphere.
// A tall picture (320x432, 2.4 screens; the game would scroll it vertically) looking steeply down and along the drained
// flood channel from a balcony at its near end, 16 m over the bed. The market is built up both walls in five galleries,
// their edges lined with neon; strings of lanterns hang across at many heights; a footbridge at the first gallery's height
// carries the market's own name in magenta neon in a cyan frame; on the bed a river of people between rows of stalls under
// rust tarps, the remaining water a canal down the middle with planks across; a vendors' drone platform hovers over the
// crowd; at the top, far off, the city's underside with a slit of pink smog, birds on the nearest cable.
//
// The projection is a vertical panorama: each row is one pitch angle (A0 at the top, F px per radian), each column a
// lateral offset in proportion to the distance. So the top rows look along the canyon and the bottom rows steeply down,
// verticals lean out as they rise (three-point feel), and every 320x180 window looks like an ordinary camera tilted
// down. The structure is raycast per pixel into a depth buffer; props and people are projected from metres and drawn
// against it. Juno walks the bed on both banks of the canal (and the planks), from the bottom edge to just past the
// bridge: 25 px at the bottom, about 18 under the bridge. Seen from this high, faces along the canyon are slivers, so
// every story thing faces up or toward us: Ratz on a crate by his blanket of junk, the jars on a table, the wok cart, the
// cooler under KIDNEYS ONLY, the preacher's crate by the canal, the stairs up as a flight along the left wall to a door on
// the first gallery, the stairs down as a fenced hole in the bed; Sable's curtain in the face of a channel pier beyond the
// bridge, so walking to her scrolls the sign into view.
// Colours by meaning (style guide §5): amber lanterns and food as the key, magenta for commerce and Sable's lure, cyan
// only for tech (screens, jars, the platform, the sign's frame), red only on the chain of the stairs down. Signs English.
include("../lib/iso.js", { palette: true })
include("../lib/text.js")

const DE = (() => {
  const W = 320, H = 432, F = 340, HC = 16, A0 = -0.21
  const WX = 9, GX = 7, TH = 0.4, CAN = 1.8, DEEP = 0.9, TOP = 27, ZEND = 130
  const LV = [5.5, 10, 14.5, 19, 23.5]
  const R = Math.round, clamp = (v, a, b) => Math.max(a, Math.min(b, v))
  const hash = ISO.ihash, bay = ISO.bay

  // ---- colours (the world palette's hexes, a few of the booth's, the haze)
  const K = {
    k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
    e: "#0f151f", f: "#151d2b", z: "#1c2738", Z: "#253349", X: "#32445f",
    n: "#3e1240", M: "#a8238a", m: "#ff4fd3", N: "#ffc0f2",
    O: "#552b1c", P: "#b0602a", Q: "#eea040", R: "#ffd58a", W: "#fff4d8",
    c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",
    r: "#7e1420", q: "#ff3a3a", j: "#9a7406", y: "#eec414", Y: "#fff070", s: "#93583f", S: "#d79676",
    g: "#565e70", G: "#8e96a8", h: "#7d8ca4", H: "#b9c6d8",
    a: "#2c2026", A: "#4a3026", i: "#2a1636", I: "#46204e", t: "#11303d", T: "#1b495a",
    l: "#28232f", L: "#3a3034", o: "#54423a", p: "#76604c",                  // concrete in warm light (the booth's)
    J: "#22101a", Kc: "#3a1624", B: "#57222f", Fc: "#7a3a40",                 // Sable's curtain (the booth's)
    t1: "#4e2219", t2: "#6e2e1f", t3: "#8c4126",                              // rust tarps
    b1: "#1d3550", b2: "#2c5580",                                             // a blue tarp here and there
    w1: "#33241c", w2: "#54392a", w3: "#7a5638",                              // wood, crates
    rz: "#90d0a0",                                                            // Ratz's collar
    pr: "#d8c8a0", pr2: "#8a7c60",                                            // the preacher's coat (his subtitle colour)
    hz: "#46293f", hz2: "#5a3350",                                            // the market's smoke, near and far
  }
  const rgb = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]
  const hex = (c) => "#" + c.map((v) => clamp(R(v), 0, 255).toString(16).padStart(2, "0")).join("")
  const mixC = new Map()
  const mix = (a, b, f) => { if (f <= 0) return a; const key = a + b + f; let v = mixC.get(key); if (!v) { const p = rgb(a), q = rgb(b); v = hex(p.map((x, i) => x + (q[i] - x) * f)); mixC.set(key, v) } return v }
  /** the smoke between us and a thing, in flat bands by distance (emissive things keep most of their light) */
  const haze = (col, t, glow = false) => {
    const f = t < 17 ? 0 : t < 26 ? 0.14 : t < 36 ? 0.26 : t < 50 ? 0.38 : t < 70 ? 0.5 : t < 95 ? 0.62 : 0.72
    return mix(col, t < 50 ? K.hz : K.hz2, glow ? f * 0.35 : f)
  }

  // ---- the camera
  /** metres (X right, Y up, Z away) to the screen: x, y, px per metre, distance */
  const P = (X, Y, Z) => { const dy = HC - Y, r = Math.hypot(dy, Z), a = Math.atan2(dy, Z); return { x: 160 + F * X / r - 0.5, y: (a - A0) * F - 0.5, s: F / r, r, a } }

  // ---- buffers: colour and depth
  const col = new Array(W * H).fill(K.k), dep = new Float32Array(W * H).fill(1e9)
  const put = (x, y, k, d = 0) => { x = R(x); y = R(y); if (x < 0 || y < 0 || x >= W || y >= H) return; const i = y * W + x; if (d <= dep[i]) { col[i] = k; dep[i] = d } }
  const blend = (x, y, k, f, dmin = 0) => { x = R(x); y = R(y); if (x < 0 || y < 0 || x >= W || y >= H) return; const i = y * W + x; if (dep[i] >= dmin) col[i] = mix(col[i], k, f) }
  const rect = (x, y, w, h, k, d) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(x + i, y + j, typeof k === "function" ? k(i, j) : k, d) }
  /** a polygon in screen space (pixel centres, even-odd), at one depth */
  const fill = (pts, k, d) => {
    const ys = pts.map((p) => p[1]), y0 = Math.max(0, Math.floor(Math.min(...ys))), y1 = Math.min(H - 1, Math.ceil(Math.max(...ys)))
    for (let y = y0; y <= y1; y++) {
      const xs = [], cy = y + 0.5
      for (let i = 0; i < pts.length; i++) { const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length]; if ((ay <= cy) !== (by <= cy)) xs.push(ax + (cy - ay) / (by - ay) * (bx - ax)) }
      xs.sort((p, q) => p - q)
      for (let n = 0; n + 1 < xs.length; n += 2) for (let x = Math.ceil(xs[n] - 0.5); x <= Math.floor(xs[n + 1] - 0.5); x++) put(x, y, typeof k === "function" ? k(x, y) : k, d)
    }
  }
  /** a polygon from metres; its colour hazed by its distance */
  const poly3 = (pts3, k, o = {}) => {
    const pp = pts3.map(([X, Y, Z]) => P(X, Y, Z)), d = pp.reduce((s, p) => s + p.r, 0) / pp.length + (o.bias ?? 0)
    fill(pp.map((p) => [p.x + 0.5, p.y + 0.5]), typeof k === "function" ? k : haze(k, d, o.glow), d)
    return d
  }
  const line = (x0, y0, x1, y1, k, d) => {
    x0 = R(x0); y0 = R(y0); x1 = R(x1); y1 = R(y1)
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1
    let e = dx + dy
    for (let n = 0; n < 2000; n++) { put(x0, y0, k, d); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx } if (e2 <= dx) { e += dx; y0 += sy } }
  }
  /** a box from metres: the face toward us, the side toward the canyon's middle, the top if we are above it (keys or hexes) */
  const box3 = (X0, X1, Y0, Y1, Z0, Z1, top, front, side, o = {}) => {
    const k = (q) => K[q] ?? q
    if (X0 > 0) poly3([[X0, Y0, Z0], [X0, Y0, Z1], [X0, Y1, Z1], [X0, Y1, Z0]], k(side), o)
    if (X1 < 0) poly3([[X1, Y0, Z0], [X1, Y0, Z1], [X1, Y1, Z1], [X1, Y1, Z0]], k(side), o)
    poly3([[X0, Y0, Z0], [X1, Y0, Z0], [X1, Y1, Z0], [X0, Y1, Z0]], k(front), { ...o, bias: (o.bias ?? 0) - 0.3 })
    if (HC > Y1) poly3([[X0, Y1, Z0], [X1, Y1, Z0], [X1, Y1, Z1], [X0, Y1, Z1]], k(top), { ...o, bias: (o.bias ?? 0) - 0.3 })
  }
  const line3 = (a, b, k, o = {}) => { const p = P(...a), q = P(...b), d = (p.r + q.r) / 2 + (o.bias ?? 0); line(p.x, p.y, q.x, q.y, haze(k, d, o.glow), d) }
  /** text into points (the game's fonts), then drawn n px to a pixel */
  const glyphs = (s, font = "nagiwa") => { const pts = []; TXT.draw({ px: (x, y) => pts.push([x, y]) }, 0, 0, s, "x", { font }); return { pts, w: TXT.measure(s, font), h: font === "hud" ? 5 : 7 } }
  const words = (x, y, s, k, d, o = {}) => {
    const g = glyphs(s, o.font), n = o.n ?? 1, x0 = R(x - (o.center ? g.w * n / 2 : 0))
    if (o.under) for (const [px, py] of g.pts) for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [1, -1], [-1, 1]]) rect(x0 + px * n + ox, y + py * n + oy, n, n, o.under, d)
    for (const [px, py] of g.pts) rect(x0 + px * n, y + py * n, n, n, (i, j) => (o.core && i === 0 && j === 0 && n > 1 ? o.core : k), d)
    return g.w * n
  }

  // ---- the structure, raycast
  const STRINGS = [[12.5, 16.6, 1.2], [16, 16.9, 1.4], [19.5, 15.8, 1.1], [28.4, 12.6, 1.2], [29.5, 15.2, 1.3], [31, 8.4, 1.1], [34, 17.5, 1.5], [38, 11.2, 1.2],
    [42, 15, 1.4], [46, 8.6, 1], [50, 19.5, 1.6], [55, 12.4, 1.2], [60, 16.4, 1.4], [66, 9.6, 1], [72, 20.5, 1.6], [79, 13.2, 1.3], [87, 17.6, 1.4], [96, 11, 1.2], [106, 21, 1.6]]
  const EDGE = { "-1": ["m", "Q", "v", "m", "Q"], "1": ["v", "m", "Q", "Q", "m"] }   // each gallery's neon strip along its edge
  const POOLS = [   // light on the bed: [X, Z, radius, ramp] (the ramps: base, weak, strong)
    [-5.4, 19, 3.4, "a A"], [5.2, 14, 2.8, "t T"], [5.2, 18, 2.4, "t T"], [5.2, 22, 2.6, "i I"], [-7.4, 28.2, 3.4, "i I"], [-5.4, 11, 2.2, "t T"],
    [-2.5, 22.4, 1.6, "a A"], [3.7, 10.7, 2.2, "t T"], [3.2, 16, 2.2, "a A"], [-3.4, 14, 2, "a A"], [-5.5, 32, 3, "a A"], [5.5, 30, 3, "i I"], [-5.5, 38, 3, "a A"], [5.5, 36, 3, "a A"]]
  const floorKey = (X, Z, x, y) => {
    let best = null, bv = 0
    for (const [px, pz, r, ramp] of POOLS) { const v = 1 - Math.hypot(X - px, (Z - pz) * 0.8) / r; if (v > bv) { bv = v; best = ramp } }
    // the lantern strings' warmth on the bed under them
    for (const [zs, ys] of STRINGS) if (ys < 18) { const v = 0.32 - Math.abs(Z - zs) / 6; if (v > bv) { bv = v; best = "a A" } }
    if (Z < 25.5 && Math.abs(X) > 3.6 && Math.abs(X) < 6.4) { const v = 0.36 - Math.abs(Math.abs(X) - 5.6) / 5; if (v > bv) { bv = v; best = "a A" } }
    const joint = (Math.abs(X) % 3 < 0.06 || Z % 3 < 0.06) ? 1 : 0
    const base = joint ? K.e : Math.abs(Math.abs(X) - CAN) < 0.18 ? K[4] : K.f
    if (!best) return base
    const [w, s] = best.split(" ").map((q) => K[q])
    return bv > 0.5 ? s : bv > 0.3 ? (bay(x, y) < (bv - 0.3) / 0.2 ? s : w) : bv > 0.12 ? (bay(x, y) < (bv - 0.12) / 0.18 ? w : base) : base
  }
  /** the face of a wall: shops in units along it per gallery, the bare channel under the first gallery */
  const wallKey = (side, Y, Z) => {
    if (Y < LV[0] - TH) {
      // the channel's own concrete behind the bed's stalls: the flood's tide mark, Sable's curtain
      if (Math.abs(Y - 3.6) < 0.08) return K.L
      return Y < 3.6 ? K.l : K[3]
    }
    let li = LV.length - 1; while (li > 0 && Y < LV[li] - TH) li--
    const L = LV[li], yy = Y - L
    if (yy < 0) return K[2]
    const U = 3.4, ui = Math.floor((Z + (side < 0 ? 1.3 : 0)) / U), u = (Z + (side < 0 ? 1.3 : 0)) / U - ui, q = hash(ui * 3 + li * 101, side + 7)
    if (u < 0.07) return K[3]
    if (yy < 2.5 && u > 0.12 && u < 0.93) {
      if (q < 0.3) return yy < 0.9 ? K.Q : yy > 2.2 ? K.P : (Math.floor(u * 8) % 3 ? K.P : K.O)
      if (q < 0.44) return yy > 2.25 ? K.n : (Math.floor(u * 6) % 2 ? K.M : K.I)
      if (q < 0.58) return yy > 0.6 && yy < 1.8 && Math.floor(u * 5) % 2 ? K.v : K.C
      if (q < 0.82) return Math.floor(yy * 5) % 2 ? K[4] : K[3]
      return yy > 1.0 && yy < 1.9 && u > 0.6 && u < 0.85 ? K.O : K[1]
    }
    if (yy > 2.65 && yy < 3.25 && u > 0.1 && u < 0.95) {
      const sk = q < 0.4 ? "m" : q < 0.62 ? "v" : q < 0.86 ? "Q" : null
      if (!sk) return K[2]
      const letter = yy > 2.8 && yy < 3.1 && (u * 11) % 1 < 0.62 && u > 0.18 && u < 0.88
      return letter ? K[sk] : K[{ m: "n", v: "c", Q: "O" }[sk]]
    }
    if (yy > 3.4 && u > 0.2 && u < 0.45 && hash(ui, li + side) < 0.4) return K.O
    return K[2]
  }
  const waterKey = (X, Z, x, y) => {
    // the lanterns' strings and the galleries' neon lie on the water in broken streaks
    for (const [zs] of STRINGS) { const w = 0.18 + Z * 0.012; if (Math.abs(Z - zs - 1.2) < w && hash(R(X * 4), R(Z * 3)) < 0.75) return Math.abs(Z - zs - 1.2) < w * 0.45 ? K.Q : K.P }
    if (Z > 27.5 && Z < 34 && Math.abs(X) < 1.45 && (R(Z * 4) % 2 || hash(R(X * 5), R(Z * 4)) < 0.3)) return Z < 29 || Z > 33 ? K.M : (R(Z * 4) % 4 === 1 ? K.N : K.m)
    if (Z > 34 && Z < 35.2 && Math.abs(X) < 1.5 && R(Z * 5) % 2) return K.v
    if (Math.abs(X) > CAN - 0.35 && hash(R(Z * 2.5), X > 0 ? 1 : 2) < 0.6) return X < 0 ? K.M : K.C
    if (Math.abs(X) < 0.3 && (Z % 4) < 1.6) return K.n
    return (R(Z * 1.5) % 2) ? K.e : K.k
  }
  const cast = (x, y) => {
    const a = A0 + (y + 0.5) / F, l = (x + 0.5 - 160) / F, sa = Math.sin(a), ca = Math.cos(a)
    let best = { t: 1e9, k: K.hz2, glow: false }
    const hit = (t, k, glow = false) => { if (t > 0.2 && t < best.t) best = { t, k, glow } }
    const at = (t) => [t * l, HC - t * sa, t * ca]
    // the bed and the canal
    if (sa > 0) {
      const t = HC / sa, [X, , Z] = at(t)
      if (Math.abs(X) <= WX && Z < ZEND) {
        if (Math.abs(X) >= CAN) hit(t, floorKey(X, Z, x, y))
        else { const tw = (HC + DEEP) / sa, [Xw, , Zw] = at(tw); if (Math.abs(Xw) < CAN) hit(tw, waterKey(Xw, Zw, x, y)); else hit(CAN / Math.abs(l), K[2]) }
      }
    }
    // the walls
    if (Math.abs(l) > 1e-6) { const t = WX / Math.abs(l), [, Y, Z] = at(t); if (Y >= -1 && Y <= TOP && Z < ZEND) hit(t, wallKey(Math.sign(l), Y, Z), Y >= LV[0]) }
    // the galleries: their walkways, their edges with the neon, their rails, their undersides
    LV.forEach((L, li) => {
      if (HC > L && sa > 0) { const t = (HC - L) / sa, [X, , Z] = at(t); if (Math.abs(X) >= GX && Math.abs(X) <= WX && Z < ZEND) hit(t, Math.abs(X) > WX - 0.7 ? K.A : K[3]) }
      if (HC < L - TH && sa < 0) { const t = (HC - L + TH) / sa, [X, , Z] = at(t); if (Math.abs(X) >= GX && Math.abs(X) <= WX && Z < ZEND) hit(t, Math.abs(X) > WX - 0.8 ? K.a : K[1]) }
      if (Math.abs(l) > 1e-6) {
        const t = GX / Math.abs(l), [X, Y, Z] = at(t), sd = Math.sign(l)
        if (Z < ZEND && Y >= L - TH && Y <= L) hit(t, Y > L - 0.27 && Y < L - 0.12 ? K[EDGE[sd][li]] : K[2], Y > L - 0.27 && Y < L - 0.12)
        if (Z < ZEND && Y > L && Y < L + 1.05 && (Y > L + 0.93 || Z % 1.7 < 0.08 || Math.abs(Y - L - 0.5) < 0.035)) hit(t, Y > L + 0.93 ? K[5] : K[3])
      }
    })
    // the city's underside: its deck with a slit of pink smog down the middle, the beams across
    if (sa < 0) {
      const t = (HC - TOP) / sa, [X, , Z] = at(t)
      if (Math.abs(X) <= WX + 4) {
        const half = 3.2 + Math.sin(Z * 0.21) * 0.6 + (Z - 50) * 0.03
        if (Math.abs(X) < half && Z > 50) { const e = Math.abs(X) / half, band = R(Z / 6) % 3; hit(t, e > 0.86 ? K.M : e > 0.6 ? (band ? K.m : K.M) : e > 0.25 ? (band === 1 ? K.N : K.m) : K.N, true) }
        else hit(t, Math.abs(X) % 4 < 0.4 ? K[2] : K.e)
      }
    }
    for (let zb = 48; zb < ZEND; zb += 14) { const t = zb / ca, [X, Y] = at(t); if (Y > TOP - 0.7 && Y < TOP && Math.abs(X) < WX + 4) hit(t, Y < TOP - 0.55 ? K[3] : K[1]) }
    // the far end: the channel goes on into the smoke
    { const t = ZEND / ca, [, Y] = at(t); hit(t, Y > TOP ? K.n : Y > 12 ? K.hz2 : K.hz) }
    return best
  }

  // ---- props and people
  /** a person as blocks, standing at (X, Z) on a floor at Yb; coat, head, an accent; v the share of their height drawn (seen from above they foreshorten) */
  const person = (X, Z, Yb, coat, o = {}) => {
    const p = P(X, Yb, Z), s = p.s, fs = 0.8 + 0.2 * Math.cos(p.a), hpx = Math.max(3, R(s * (o.h ?? 1.7) * fs)), wpx = Math.max(2, R(s * 0.5)), d = p.r - 0.05
    const k = (c) => haze(c, p.r), x0 = R(p.x - wpx / 2), y0 = R(p.y)
    const head = Math.max(1, R(hpx * 0.2)), legs = R(hpx * 0.38)
    if (hpx >= 9) { rect(x0 - 1, y0 - hpx - 1, wpx + 2, hpx + 2, K.k, d + 0.01) }
    rect(x0, y0 - legs, wpx, legs, k(K[1]), d)
    rect(x0, y0 - hpx + head, wpx, hpx - head - legs, k(K[coat] ?? coat), d)
    if (wpx >= 4) rect(x0 + wpx - 1, y0 - hpx + head + 1, 1, hpx - head - legs - 1, k(K[2]), d)
    const hw = Math.max(1, wpx - 2), hx = x0 + R((wpx - hw) / 2)
    rect(hx, y0 - hpx, hw, head, k(o.skin ?? K.s), d); if (head >= 2) rect(hx, y0 - hpx, hw, 1, k(o.hair ?? K.k), d)
    if (o.accent && hpx >= 6) put(hx + hw - 1, y0 - hpx + 1, o.accent, d - 0.01)
    if (o.raise) rect(x0 + wpx, y0 - hpx - R(hpx * 0.15), Math.max(1, R(wpx / 3)), R(hpx * 0.45), k(K[coat] ?? coat), d)
    return { x: p.x, y: p.y, hpx, wpx, s, d }
  }
  /** a lantern on a string: a flat glow, a halo ring round it */
  const lantern = (X, Y, Z) => {
    const p = P(X, Y, Z), r = Math.max(1, p.s * 0.19), d = p.r
    for (let j = -R(r * 2.6); j <= R(r * 2.6); j++) for (let i = -R(r * 2.6); i <= R(r * 2.6); i++) { const e = Math.hypot(i, j * 1.15) / r; if (e > 1 && e < 2.6) blend(p.x + i, p.y + j, K.Q, e < 1.8 ? 0.22 : 0.1, d) }
    for (let j = -R(r * 1.2); j <= R(r * 1.2); j++) for (let i = -R(r); i <= R(r); i++) { const e = Math.hypot(i / r, j / (r * 1.2)); if (e <= 1.05) put(p.x + i, p.y + j, e < 0.45 && r > 1.5 ? K.W : e < 0.8 ? K.R : K.Q, d) }
    if (r >= 2.5) { put(p.x, p.y - R(r * 1.2) - 1, K.k, d); put(p.x, p.y + R(r * 1.2) + 1, K.P, d) }
  }
  const alongs = () => {
    for (const side of [-1, 1]) {
      const pts = []
      for (let z = 8.6; z <= 24.6; z += 0.25) pts.push([side * 6.85, 5.0 - Math.abs(Math.sin((z - 8.6) / 3.2 * Math.PI)) * 0.5, z])
      for (let i = 0; i + 1 < pts.length; i++) line3(pts[i], pts[i + 1], K.k, { bias: 0.05 })
      for (let i = 2; i < pts.length; i += 3) lantern(pts[i][0], pts[i][1] - 0.25, pts[i][2])
    }
  }
  const strings = () => {
    for (const [zs, ys, sag] of STRINGS) {
      const n = 60, pts = []
      for (let i = 0; i <= n; i++) { const u = i / n, X = -GX - 0.1 + u * (2 * GX + 0.2), Y = ys - Math.sin(u * Math.PI) * sag + (u - 0.5) * 0.6; pts.push([X, Y, zs]) }
      for (let i = 0; i < n; i++) line3(pts[i], pts[i + 1], K.k, { bias: 0.05 })
      const step = zs < 30 ? 4 : zs < 60 ? 3 : 2
      for (let i = 2; i < n - 1; i += step) lantern(pts[i][0], pts[i][1] - 0.32, zs)
    }
  }
  /** a stall against a wall on the bed: its back booth, its counter facing the walk, its rust tarp from the wall */
  const stall = (side, Z0, Z1, o = {}) => {
    const xw = side * WX, xc = side * 5.6, xb = side * 6.3, xt = side * 6.4, light = o.light ?? "Q", q = hash(R(Z0 * 7), side + 3)
    poly3([[xb, 0.95, Z0], [xb, 0.95, Z1], [xb, 2.6, Z1], [xb, 2.6, Z0]], K[o.back ?? "P"], { glow: true, bias: 0.3 })   // the goods behind, lit
    poly3([[xc, 0, Z0], [xc, 0, Z1], [xc, 0.95, Z1], [xc, 0.95, Z0]], K[o.counter ?? "O"])                              // the counter's front
    poly3([[xc, 0.95, Z0], [xc, 0.95, Z1], [xb, 0.95, Z1], [xb, 0.95, Z0]], K[light], { glow: true })                   // its top, lit
    const tarp = o.tarp ?? (q < 0.18 ? ["b1", "b2"] : q < 0.6 ? ["t2", "t3"] : ["t1", "t2"])
    for (const z of [Z0 + 0.05, Z1 - 0.05]) line3([xt, 0, z], [xt, 2.9, z], K[4], { bias: -0.2 })                     // its poles (open ends: from above a wall would hide it)
    const tz = (Z1 - Z0) / 3
    for (let n = 0; n < 3; n++) poly3([[xw, 3.5, Z0 + n * tz], [xt, 2.9, Z0 + n * tz], [xt, 2.9, Z0 + (n + 1) * tz], [xw, 3.5, Z0 + (n + 1) * tz]], K[tarp[n % 2]], { bias: -0.3 })
    // the bulbs along the tarp's edge
    for (let z = Z0 + 0.4; z < Z1; z += 0.8) { const p = P(xt, 2.85, z); put(p.x, p.y, haze(K.R, p.r, true), p.r - 0.4) }
  }
  /** a hanging sign out from a gallery: a board facing us, neon letters stacked if it is near enough to read */
  const hang = (side, L, Z, word, k, plate) => {
    const xo = side * GX, xi = side * (GX - 1.6), a = P(Math.min(xo, xi), L - 0.7, Z), b = P(Math.max(xo, xi), L - 0.7 - 0.55 * word.length - 0.3, Z)
    const x0 = R(a.x), x1 = R(b.x), y0 = R(a.y), y1 = R(b.y), d = a.r - 0.2
    rect(x0 - 1, y0 - 1, x1 - x0 + 2, y1 - y0 + 2, K.k, d); rect(x0, y0, x1 - x0, y1 - y0, haze(K[plate], d), d)
    rect(x0, y0, 1, y1 - y0, K[k], d); rect(x1 - 1, y0, 1, y1 - y0, K[k], d)
    const lh = (y1 - y0 - 2) / word.length
    if (lh >= 6 && x1 - x0 >= 5) [...word].forEach((ch, i) => words(R((x0 + x1) / 2), R(y0 + 2 + i * lh + (lh - 5) / 2), ch, K[k], d - 0.01, { font: "hud", center: true }))
    else for (let i = 0; i < word.length; i++) rect(x0 + 1, R(y0 + 1 + i * lh), Math.max(1, x1 - x0 - 2), Math.max(1, R(lh * 0.6)), haze(K[k], d, true), d - 0.01)
  }

  // ---- the scene
  const paint = (c) => {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const h = cast(x, y), i = y * W + x; col[i] = haze(h.k, h.t, h.glow); dep[i] = h.t }

    // hanging signs off the galleries (a forest of them, Hong Kong fashion)
    const WORDS = ["BAR", "RAM", "PAWN", "SIM", "GILLS", "TATTOO", "DOCS", "HOTEL", "CHITS", "MODS", "FIX", "SOUP", "BUY", "SELL", "DATA", "OPEN"]
    let wi = 0
    LV.forEach((L, li) => { for (const side of [-1, 1]) for (let Z = 14 + hash(li, side) * 6; Z < ZEND - 10; Z += 7 + hash(R(Z), li) * 6) {
      if (L < 7 && Z < 38) continue
      const q = hash(R(Z * 3), li + side * 5), k = q < 0.42 ? "m" : q < 0.7 ? "v" : "Q", plate = { m: "n", v: "c", Q: "O" }[k]
      hang(side, L, Z, WORDS[wi++ % WORDS.length], k, plate)
    } })

    // stalls along both walls on the bed, the story's own among them (near), plain ones on into the smoke
    stall(-1, 17.4, 22.2, { light: "R", back: "Q", tarp: ["t2", "t3"] })          // the food stall
    stall(-1, 22.6, 24.6, {})
    stall(1, 11.8, 15.6, { light: "C", back: "c", counter: "3", tarp: ["b1", "b2"] }) // Ratz
    stall(1, 16.2, 19.8, { light: "v", back: "C", counter: "3" })                  // the jars of used implants
    stall(1, 20.4, 24, { light: "M", back: "n" })                                   // the organ trade
    for (const side of [-1, 1]) for (let Z = side < 0 ? 31.4 : 25, n = 0; Z < ZEND - 6; n++) { const len = 3.2 + hash(n, side) * 2.6; stall(side, Z, Z + len, { light: hash(n, side + 9) < 0.25 ? "m" : hash(n, side + 9) < 0.4 ? "v" : "Q", back: hash(n, side + 4) < 0.3 ? "M" : "P" }); Z += len + 0.5 }
    // the plank bridges over the canal
    for (const z of [12.4, 19.4, 31, 41, 53, 67, 84]) poly3([[-CAN - 0.2, 0.02, z], [CAN + 0.2, 0.02, z], [CAN + 0.2, 0.02, z + 1.2], [-CAN - 0.2, 0.02, z + 1.2]], (x, y) => (x % 3 ? haze(K.w2, z + 18) : haze(K.w1, z + 18)))

    // the footbridge at the first gallery's height, the market's name on it
    const BZ = 24.6
    poly3([[-GX, 5.5, BZ], [GX, 5.5, BZ], [GX, 5.5, BZ + 1.6], [-GX, 5.5, BZ + 1.6]], K[3])
    poly3([[-GX, 5.1, BZ], [GX, 5.1, BZ], [GX, 5.5, BZ], [-GX, 5.5, BZ]], K[2], { bias: -0.05 })
    line3([-GX, 5.3, BZ - 0.01], [GX, 5.3, BZ - 0.01], K.v, { glow: true, bias: -0.1 })
    line3([-GX, 6.5, BZ], [GX, 6.5, BZ], K[5], { bias: -0.1 })
    for (let x = -GX; x <= GX; x += 1.4) line3([x, 5.5, BZ], [x, 6.5, BZ], K[4], { bias: -0.1 })
    for (const x of [-5, 5]) line3([x, 5.5, BZ + 0.8], [x, 6.2, BZ + 0.8], K[3])
    {
      const a = P(-5.9, 11.4, BZ + 0.8), b = P(5.9, 6.2, BZ + 0.8), x0 = R(a.x), x1 = R(b.x), y0 = R(a.y), y1 = R(b.y), d = a.r
      // its glow on the smoke round it, flat
      for (let y = y0 - 14; y < y1 + 12; y++) for (let x = x0 - 16; x < x1 + 16; x++) { const e = Math.max((x0 - x) / 16, (x - x1) / 16, (y0 - y) / 14, (y - y1) / 12); if (e > 0 && e < 1) blend(x, y, K.m, e < 0.45 ? 0.2 : 0.1, d + 1) }
      rect(x0 - 2, y0 - 2, x1 - x0 + 4, y1 - y0 + 4, K.k, d); rect(x0, y0, x1 - x0, y1 - y0, K.n, d)
      for (const [o, k] of [[0, "V"], [2, "v"]]) { rect(x0 + o, y0 + o, x1 - x0 - 2 * o, 1, K[k], d); rect(x0 + o, y1 - 1 - o, x1 - x0 - 2 * o, 1, K[k], d); rect(x0 + o, y0 + o, 1, y1 - y0 - 2 * o, K[k], d); rect(x1 - 1 - o, y0 + o, 1, y1 - y0 - 2 * o, K[k], d) }
      const cx = R((x0 + x1) / 2)
      words(cx, y0 + 6, "DRAIN", K.m, d - 0.01, { n: 2, center: true, core: K.N, under: K.M })
      words(cx, y0 + 25, "MARKET", K.m, d - 0.01, { n: 2, center: true, core: K.N, under: K.M })
      words(cx, y1 - 9, "NO QUESTIONS", K.v, d - 0.01, { font: "hud", center: true })
      console.log("SIGN " + JSON.stringify([x0, y0, x1 - x0, y1 - y0]))
    }

    // the drone platform over the crowd beyond the bridge, seen nearly level from up here: a hull with a ring of cyan lights, two rotors
    // on outriggers, a cargo pod hanging under it on a cable, its scan falling on the people in a dithered cone (light falloff)
    {
      const p = P(-2.8, 12.2, 40), s = p.s, hw = R(s * 3.2), hh = Math.max(4, R(s * 0.9)), d = p.r, x0 = R(p.x), y0 = R(p.y)
      const f = P(-2.8, 0, 40)
      for (let y = y0 + hh; y < R(f.y); y++) { const u = (y - y0) / (f.y - y0), w = R(hw * (0.3 + u * 0.8)); for (let x = -w; x <= w; x++) if (bay(x + 400, y) < 0.42 - u * 0.25) blend(x0 + x, y, K.v, 0.4, d + 0.5) }
      line(x0, y0 + hh, x0, y0 + hh + R(s * 1.6), K.k, d - 0.1); rect(x0 - 2, y0 + hh + R(s * 1.6), 5, 4, K[4], d - 0.1); put(x0, y0 + hh + R(s * 1.6) + 1, K.V, d - 0.11)
      for (const sd of [-1, 1]) { const rx = x0 + sd * (hw + 4); line(x0 + sd * hw, y0 + 1, rx, y0 - 1, K[3], d - 0.05); rect(rx - 6, y0 - 3, 13, 2, K[5], d - 0.06); rect(rx - 6, y0 - 3, 13, 1, K[6], d - 0.06); rect(rx - 1, y0 - 2, 3, 3, K[2], d - 0.06) }
      rect(x0 - hw - 1, y0 - 1, 2 * hw + 3, hh + 2, K.k, d); rect(x0 - hw, y0, 2 * hw + 1, hh, K[3], d - 0.01); rect(x0 - hw, y0, 2 * hw + 1, 1, K[5], d - 0.01)
      for (let x = -hw + 1; x < hw; x += 3) put(x0 + x, y0 + hh - 1, K.v, d - 0.02)
      rect(x0 - 3, y0 + 1, 7, Math.max(1, hh - 3), K.c, d - 0.02); put(x0, y0 + 1, K.V, d - 0.03)
    }

    // the crowd: a river on the bed beyond the bridge, thinner near us so the stalls and the story's people keep their space
    const COATS = ["3", "4", "2", "o", "L", "5", "Kc", "w2", "b1", "p", "l", "t1"]
    const ACC = [K.v, K.m, null, null, K.v, null, K.Q, null]
    let n = 0
    for (let Z = 9; Z < ZEND - 8; Z += Z < 28 ? 0.9 : Z < 50 ? 0.36 : 0.24) for (const side of [-1, 1]) {
      const q = hash(n++, 17), X = side * (CAN + 0.35 + q * 3.5)
      if (Z < 28) {
        if (hash(n, 5) < 0.55) continue                                         // the walk area near us: a few people only
        if (Math.abs(X + 3.6) < 1.2 && Math.abs(Z - 14.5) < 2.5) continue       // Juno's place
        if (Math.abs(X + 2.5) < 1.6 && Math.abs(Z - 22.4) < 2.2) continue       // the ring round the preacher
        if (side > 0 && X > 3.0 && Z < 25) continue                             // the stalls' counters stay free on the right
        if (side < 0 && X < -4.4 && Z > 16 && Z < 22) continue                  // and at the food stall
        if (Z < 13 && X > 2) continue                                           // the stairs down
        if (side < 0 && X < -3.2 && Z > 18 && Z < 21.5) continue                // the cart's stools
        if (side < 0 && X < -5 && Z > 26 && Z < 30) continue                    // Sable's curtain
      }
      person(X, Z, 0, COATS[R(hash(n, 3) * 11)], { accent: ACC[R(hash(n, 4) * 7)], skin: hash(n, 6) < 0.5 ? K.s : K.S })
    }
    // people on the planks and in the canal's middle where the planks are
    for (const z of [31, 41, 53, 67]) for (let i = 0; i < 3; i++) person(-1.2 + i * 1.2 + hash(z, i) * 0.4, z + 0.6, 0.02, COATS[(z + i) % 11])
    // people on the galleries, leaning on their rails, and on the bridge
    LV.forEach((L, li) => { for (const side of [-1, 1]) for (let Z = 12 + hash(li, side + 2) * 5; Z < ZEND - 10; Z += 2.2 + hash(R(Z), li + side) * 4) person(side * (GX + 0.4), Z, L, COATS[R(hash(R(Z), li) * 11)], { accent: hash(R(Z), li + 3) < 0.3 ? K.m : null }) })
    for (const x of [-6.2, -5.5, 5.2, 6.1]) person(x, BZ + 0.5, 5.5, COATS[R(hash(x * 10, 1) * 11)])

    // ---- the story's places on the bed, near us
    // the stairs up to the alley: a steel flight along the left wall from the bed to a landing on the first gallery, a lit door in the wall
    {
      const S0 = 10, S1 = 16.4, n = 14
      for (let i = n - 1; i >= 0; i--) {
        const z0 = S0 + (S1 - S0) * i / n, z1 = S0 + (S1 - S0) * (i + 1) / n, y0 = 5.5 * i / n, y1 = 5.5 * (i + 1) / n
        poly3([[-7.4, y0, z0], [-5.6, y0, z0], [-5.6, y1, z0], [-7.4, y1, z0]], K[i % 2 ? 4 : 3])
        poly3([[-7.4, y1, z0], [-5.6, y1, z0], [-5.6, y1, z1], [-7.4, y1, z1]], K[5])
      }
      poly3([[-5.6, 0, S0], [-5.6, 0, S1], [-5.6, 5.5, S1], [-5.6, 0.3, S0]], K[2], { bias: 0.4 })
      line3([-5.5, 1.1, S0], [-5.5, 6.6, S1], K[6]); line3([-5.5, 0, S0], [-5.5, 1.1, S0], K[6]); line3([-5.5, 5.5, S1], [-5.5, 6.6, S1], K[6])
      poly3([[-GX, 5.5, S1], [-5.6, 5.5, S1], [-5.6, 5.5, S1 + 1.6], [-GX, 5.5, S1 + 1.6]], K[4])
      // the door at the top: the way up, the street's cyan in it, an arrow over it
      poly3([[-WX, 5.5, S1], [-WX, 5.5, S1 + 1.4], [-WX, 7.8, S1 + 1.4], [-WX, 7.8, S1]], K.c, { glow: true, bias: -0.1 })
      poly3([[-WX, 5.5, S1 + 0.25], [-WX, 5.5, S1 + 1.15], [-WX, 7.4, S1 + 1.15], [-WX, 7.4, S1 + 0.25]], K.C, { glow: true, bias: -0.15 })
      const ar = P(-WX + 0.05, 8.4, S1 + 0.7)
      words(ar.x - 6, R(ar.y), "UP", K.v, ar.r - 0.3, { font: "hud" }); line(ar.x + 3, ar.y + 4, ar.x + 3, ar.y, K.v, ar.r - 0.3); line(ar.x + 2, ar.y + 1, ar.x + 4, ar.y + 1, K.v, ar.r - 0.3)
    }
    // the stairs down (Chapter 2): an opening in the bed on the right, steps into the dark, a faint cyan far below; a chain with a red tag across
    {
      const X0 = 2.0, X1 = 3.7, Z0 = 9.3, Z1 = 11.2
      poly3([[X0, 0.01, Z0], [X1, 0.01, Z0], [X1, 0.01, Z1], [X0, 0.01, Z1]], K.k)
      for (let i = 0; i < 5; i++) { const z = Z0 + 0.2 + i * 0.36; poly3([[X0 + 0.15, 0.02, z], [X1 - 0.15, 0.02, z], [X1 - 0.15, 0.02, z + 0.2], [X0 + 0.15, 0.02, z + 0.2]], K[i < 3 ? 3 : 2]) }
      { const p = P((X0 + X1) / 2, 0, Z1 - 0.25); rect(R(p.x) - 6, R(p.y) - 2, 12, 2, K.c, p.r - 0.1) }
      for (const [a, b] of [[[X0, 0, Z0], [X1, 0, Z0]], [[X0, 0, Z0], [X0, 0, Z1]], [[X1, 0, Z0], [X1, 0, Z1]]]) line3([a[0], 0.8, a[2]], [b[0], 0.8, b[2]], K[5], { bias: -0.3 })
      for (const [x, z] of [[X0, Z0], [X1, Z0], [X0, Z1], [X1, Z1]]) line3([x, 0, z], [x, 0.8, z], K[4], { bias: -0.3 })
      const a = P(X0, 0.6, Z0), b = P(X1, 0.6, Z0)
      for (let x = R(a.x); x <= R(b.x); x++) { const u = (x - a.x) / (b.x - a.x); put(x, R(a.y + Math.sin(u * Math.PI) * 3), x % 2 ? K[6] : K[4], a.r - 0.5) }
      rect(R((a.x + b.x) / 2) - 3, R(a.y) + 3, 6, 4, K.r, a.r - 0.6); rect(R((a.x + b.x) / 2) - 2, R(a.y) + 4, 4, 1, K.q, a.r - 0.6)
    }
    // Ratz: a blanket of junk on the bed in front of his stall (from up here, what lies on the ground reads best), Ratz on a crate at its
    // near corner facing the walk (a cable rat the size of a small dog: headphones with a cyan light, the patched collar, the tail hanging)
    {
      poly3([[3.2, 0.02, 12.2], [5.7, 0.02, 12.2], [5.7, 0.02, 15.4], [3.2, 0.02, 15.4]], K.b2, { bias: 0.2 })
      poly3([[3.2, 0.02, 12.2], [5.7, 0.02, 12.2], [5.7, 0.02, 12.5], [3.2, 0.02, 12.5]], "#4a78a8", { bias: 0.15 })
      for (let i = 0; i < 22; i++) {
        const X = 3.4 + hash(i, 41) * 2.1, Z = 12.9 + hash(i, 42) * 2.3, q = hash(i, 43), p = P(X, 0.03, Z), w = Math.max(2, R(p.s * (0.2 + hash(i, 44) * 0.2))), h = Math.max(1, R(w * 0.6))
        const k = q < 0.35 ? K.v : q < 0.55 ? K.C : q < 0.75 ? "#3f8a58" : q < 0.9 ? K.G : K.Q
        rect(R(p.x) - 1, R(p.y) - 1, w + 2, h + 2, K.k, p.r - 0.1); rect(R(p.x), R(p.y), w, h, k, p.r - 0.11)
        if (q < 0.35 && w > 3) put(p.x + 1, p.y, K.V, p.r - 0.12)
      }
      for (let i = 0; i < 4; i++) { const a = P(3.4 + hash(i, 51) * 2, 0.03, 13.0 + i * 0.55), b = P(3.4 + hash(i, 52) * 2, 0.03, 13.3 + i * 0.55); line(a.x, a.y, b.x, b.y + 2, K.k, a.r - 0.12) }
      box3(3.3, 4.0, 0, 0.6, 12.25, 12.85, "w3", "w2", "w1")
      const p = P(3.65, 0.6, 12.55), s = p.s, d = p.r - 0.6, w = R(s * 0.7), h = R(s * 0.36), x0 = R(p.x - w / 2) + 2, y0 = R(p.y) - h
      rect(x0 - 1, y0 - 1, w + 2, h + 2, K.k, d); rect(x0, y0, w, h, K[6], d); rect(x0, y0, w, 1, K.G, d); rect(x0, y0 + h - 1, w, 1, K[5], d)   // the body
      rect(x0 - 6, y0 + 1, 7, h - 2, K.k, d); rect(x0 - 5, y0 + 2, 6, h - 4, K[6], d); put(x0 - 6, y0 + 2, K.S, d); put(x0 - 3, y0 + 2, K.k, d)   // the head, the nose, the eye
      rect(x0 - 2, y0 - 3, 4, 4, K.k, d); rect(x0 - 1, y0 - 2, 2, 2, K.S, d)                                       // a round ear
      rect(x0 - 4, y0 - 4, 7, 1, K.k, d); rect(x0 - 4, y0 - 3, 1, 3, K.k, d); put(x0 + 2, y0 - 3, K.v, d)          // the headphones and their light
      rect(x0 + 1, y0, 2, h, K.rz, d)                                                                               // the collar
      for (let i = 0; i < 14; i++) put(x0 + w + (i < 3 ? i : 2) + (i > 9 ? i - 9 : 0), y0 + h - 1 + Math.min(i, 10), K[5], d)   // the tail down the crate
      line3([5.6, 0, 12.3], [5.6, 2.2, 12.3], K[4], { bias: -2 })
      const sg = P(5.6, 2.2, 12.3); words(sg.x - 8, R(sg.y) - 3, "JUNK", K.v, sg.r - 2, { font: "hud", under: K.k })
    }
    // the jars of used implants on a trestle table in front of their stall, seen from above: rows of lids, a cyan glint in each
    {
      box3(3.9, 5.4, 0, 0.9, 16.5, 18.8, "w2", "w1", "w1")
      for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) { const p = P(4.1 + i * 0.36, 0.9, 16.7 + j * 0.42), w = Math.max(2, R(p.s * 0.24)); rect(R(p.x) - 1, R(p.y) - w, w + 2, w + 1, K.k, p.r - 0.3); rect(R(p.x), R(p.y) - w + 1, w, w - 1, hash(i, j + 60) < 0.5 ? K.C : K.c, p.r - 0.31); put(p.x + (j % 2), p.y - w + 1, hash(i, j + 61) < 0.6 ? K.v : K.V, p.r - 0.32) }
      line3([5.3, 0.9, 16.5], [5.3, 2.1, 16.5], K[4], { bias: -0.3 })
      const sg = P(5.3, 2.1, 16.5); words(sg.x - 11, R(sg.y) - 3, "CHROME", K.v, sg.r - 0.4, { font: "hud", under: K.k })
    }
    // KIDNEYS ONLY: a board on poles over the organ stall, facing the walk; a cooler box on the ground in front, its little display
    { const a = P(4.0, 4.6, 20.6), b = P(6.9, 3.2, 20.6), x0 = R(a.x), y0 = R(a.y), x1 = R(b.x) + 6, y1 = R(b.y), d = a.r - 0.8
      rect(x0 - 1, y0 - 1, x1 - x0 + 2, y1 - y0 + 2, K.k, d); rect(x0, y0, x1 - x0, y1 - y0, K.n, d); rect(x0, y0, x1 - x0, 1, K.m, d); rect(x0, y1 - 1, x1 - x0, 1, K.m, d)
      words(R((x0 + x1) / 2) + 1, y0 + 3, "KIDNEYS", K.N, d - 0.01, { font: "hud", center: true }); words(R((x0 + x1) / 2) + 1, y0 + 10, "ONLY", K.m, d - 0.01, { font: "hud", center: true })
      for (const xx of [x0 + 2, x1 - 3]) line(xx, y1, xx, R(P(5.3, 2.4, 20.6).y), K[4], d + 0.01)
      box3(4.2, 5.2, 0, 0.6, 21.0, 21.8, "H", "h", "h"); const q = P(4.5, 0.4, 21.0); rect(R(q.x), R(q.y), 3, 1, K.v, q.r - 0.4) }
    // the food cart in front of its stall: the wok's fire on it, a pot, steam rising and spreading, two stools with two eating; its sign on a pole
    {
      box3(-5.6, -4.0, 0, 1.0, 18.6, 20.8, "1", "P", "O")
      const p = P(-4.8, 1.0, 19.3), fw = Math.max(3, R(p.s * 0.4))
      for (let i = -fw; i <= fw; i++) { const tall = R(2 + hash(i + 9, 77) * fw * 0.9 * (1 - Math.abs(i) / (fw + 1))); for (let j = 0; j < tall; j++) put(p.x + i, p.y - 1 - j, j === tall - 1 ? K.P : j > tall * 0.5 ? K.Q : (i + j) % 2 ? K.R : K.W, p.r - 0.35) }
      rect(R(p.x) - fw - 1, R(p.y) - 1, 2 * fw + 3, 2, K.k, p.r - 0.36); rect(R(p.x) - fw + 1, R(p.y) + 1, 2 * fw - 1, 1, K.k, p.r - 0.36); line(p.x + fw + 1, p.y - 1, p.x + fw + 5, p.y - 3, K[5], p.r - 0.36)
      const q = P(-4.5, 1.0, 20.3); rect(R(q.x) - 3, R(q.y) - 4, 7, 4, K[4], q.r - 0.3); rect(R(q.x) - 3, R(q.y) - 4, 7, 1, K[6], q.r - 0.31)
      for (let i = 0; i < 10; i++) { const st = P(-4.7 - i * 0.18 + Math.sin(i) * 0.3, 1.6 + i * 0.55, 19.5 + i * 0.2), r = 2 + R(i * 0.6); for (let jj = -r; jj <= r; jj++) for (let ii = -r - 1; ii <= r + 1; ii++) if (Math.hypot(ii / (r + 1), jj / r) <= 1) blend(st.x + ii, st.y + jj, i < 4 ? K.H : K.h, i < 4 ? 0.5 : 0.3, st.r - 1) }
      line3([-4.0, 1.0, 18.6], [-4.0, 2.3, 18.6], K[4], { bias: -0.3 })
      const sg = P(-4.0, 2.3, 18.6); words(sg.x - 2, R(sg.y) - 3, "HOT WOK", K.R, sg.r - 0.4, { font: "hud", under: K.k })
      for (const z of [19.1, 20.2]) box3(-3.75, -3.45, 0, 0.45, z, z + 0.3, "4", "3", "2")
      person(-3.6, 19.5, 0.45, "o", { h: 1.25 }); person(-3.6, 20.6, 0.45, "L", { h: 1.25, accent: K.v })
    }
    // Sable's curtain: in the face of one of the channel's piers, so it faces whoever comes down the walk; plum, heavy, the market's
    // magenta leaking past its edge and under its hem (the booth's side of it: art/rooms/sable_booth.px.js)
    {
      box3(-9, -5.9, 0, 5.1, 29.0, 30.8, "3", "l", "3")
      const PZ = 28.98, c0 = P(-8.3, 2.7, PZ), c1 = P(-6.6, 0, PZ)
      rect(R(c0.x) - 1, R(c0.y) - 1, R(c1.x - c0.x) + 2, R(c1.y - c0.y) + 1, K.M, c0.r - 0.4)
      rect(R(c0.x), R(c0.y), R(c1.x - c0.x), R(c1.y - c0.y) - 1, (i) => (i % 3 === 2 ? K.Kc : i % 3 === 1 ? K.B : K.J), c0.r - 0.41)
      rect(R(c1.x) - 1, R(c0.y) + 2, 1, R(c1.y - c0.y) - 3, K.m, c0.r - 0.42); rect(R(c0.x), R(c1.y) - 1, R(c1.x - c0.x), 1, K.m, c0.r - 0.42)
      const t0 = P(-9, 3.6, PZ), t1 = P(-5.9, 3.6, PZ); line(t0.x, t0.y, t1.x, t1.y, K.L, t0.r - 0.4)
    }
    // the preacher of the Wache Kirche on his crate by the canal, his hand raised, his gecko eyes, a placard; nobody stops
    {
      const cz = 22.4, cx = -2.5, a = P(cx - 0.35, 0.6, cz), b = P(cx + 0.35, 0, cz)
      rect(R(a.x), R(a.y), R(b.x - a.x), R(b.y - a.y), K.w2, a.r); rect(R(a.x), R(a.y), R(b.x - a.x), 1, K.w3, a.r)
      const pp = person(cx, cz, 0.6, "pr", { raise: true, skin: K.S })
      put(pp.x - 1, pp.y - pp.hpx + 1, "#c8e050", pp.d - 0.02); put(pp.x + 1, pp.y - pp.hpx + 1, "#c8e050", pp.d - 0.02)
      const pl = P(cx - 0.9, 1.0, cz - 0.2); rect(R(pl.x) - 10, R(pl.y) - 6, 21, 8, K.k, pl.r - 0.4); rect(R(pl.x) - 9, R(pl.y) - 5, 19, 6, K.pr2, pl.r - 0.41)
      words(R(pl.x), R(pl.y) - 4, "WAKE", K.k, pl.r - 0.42, { font: "hud", center: true })
    }
    // Juno for scale, on the left bank by the food stall (a yellow block: hood, slicker, the satchel)
    {
      const p = P(-3.6, 0, 14.5), s = p.s, fs = 0.8 + 0.2 * Math.cos(p.a), h = R(s * 1.68 * fs), w = R(s * 0.5), x0 = R(p.x - w / 2), y0 = R(p.y), d = p.r - 0.3
      rect(x0 - 1, y0 - h - 1, w + 2, h + 2, K.k, d + 0.01)
      rect(x0, y0 - R(h * 0.3), w, R(h * 0.3), K[1], d); rect(x0, y0 - R(h * 0.82), w, R(h * 0.52), K.y, d); rect(x0 + w - 2, y0 - R(h * 0.8), 2, R(h * 0.5), K.j, d)
      rect(x0 + 1, y0 - h, w - 2, R(h * 0.2), K.y, d); rect(x0 + 2, y0 - h + 2, w - 4, R(h * 0.12), K.S, d); rect(x0 + 1, y0 - h, w - 2, 1, K.Y, d)
      rect(x0 - 1, y0 - R(h * 0.48), 3, 4, K.g, d - 0.01)
      console.log("JUNO " + JSON.stringify({ x: R(p.x), y: R(p.y), h, w, s: +s.toFixed(1) }))
    }

    strings()
    alongs()

    // birds on the nearest cable at the top
    {
      const za = 10.5, ya = 16.4, yAt = (xb) => ya + 0.3 - (xb + GX) / (2 * GX) * 0.5
      line3([-GX, yAt(-GX), za], [GX, yAt(GX), za], K.k, { bias: -0.5 })
      for (const xb of [-4.6, -4.1, -3.7, 2.2, 3.1]) { const p = P(xb, yAt(xb), za), d = p.r - 0.6; rect(R(p.x) - 2, R(p.y) - 4, 4, 4, K.k, d); rect(R(p.x) - 1, R(p.y) - 6, 3, 2, K.k, d); put(p.x - 3, p.y - 2, K.k, d); put(p.x + 1, p.y - 5, K[4], d) }
    }

    // light shafts from the slit and the underside's grates, flat lighter bands through the smoke behind the bridge
    for (const [xt, xb, wt, wb, dmin] of [[150, 112, 6, 30, 40], [178, 204, 5, 26, 40], [60, 92, 6, 22, 36]]) {
      for (let y = 0; y < 230; y++) { const u = y / 230, xc = xt + (xb - xt) * u, w = wt + (wb - wt) * u; for (let x = R(xc - w); x <= R(xc + w); x++) blend(x, y, K.N, Math.abs(x - xc) < w * 0.5 ? 0.12 : 0.06, dmin) }
    }

    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, col[y * W + x])
  }
  return { W, H, paint, P }
})()

scene("drain_market_e", { w: DE.W, h: DE.H, bg: "k" }, DE.paint)

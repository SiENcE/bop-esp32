// The arrival at the Drain Market, painted: the drained flood channel seen from the top of the stairs that come down from the alley
// (kapitel1-design §9). A shot of its own: Juno is not in it, it is her view; in the game a camera tilts down it from the canyon to
// the market's bed before the view switches to the top-down market. The user approved its blocks (draft E,
// art/test/drain_market_e_schlucht.px.js, 2026-11-11); this file keeps their projection, every measure and the place of everything,
// and paints over them. The one thing left out: the yellow block that stood for Juno on the bed.
//
//   drain_arrival_bg  320x432, 12 frames at 10 fps. A vertical panorama: each row one pitch angle (A0 at the top, F px per radian),
//                     each column a lateral offset in proportion to the distance, so every 320x180 window looks like an ordinary
//                     camera tilted down. The eye 16 m over the bed at the channel's near end; the walls 18 m apart, five galleries a
//                     side (5.5 m to 23.5 m), the city's underside at 27 m. The structure is raycast per pixel into a depth buffer;
//                     props and people are placed in metres, projected, and drawn against it.
//                     From the top: the underside's deck with its slit of pink smog and light falling through; the galleries' shop
//                     fronts (amber shops, magenta curtains, cyan screens, rolled shutters), their neon edges, rails, hanging signs;
//                     lantern strings and bare power cables across, birds on the nearest; the footbridge with DRAIN MARKET / NO
//                     QUESTIONS (magenta neon in a cyan frame); the drone platform over the crowd; the bed: stalls under rust, faded
//                     green, plum and blue tarps along both walls, the canal with its planks, the crowd; near us the story's places:
//                     the stairs up along the left wall, HOT WOK's cart, the preacher on his crate with his two thermos flasks,
//                     Sable's curtain in a pier, KIDNEYS ONLY with its cooler, the CHROME jars, Ratz on his crate by the JUNK
//                     blanket, the stairs down as a fenced hole with the red chain. The near bed (the bottom window, where the
//                     camera stops) is the busiest part: packed on both banks as a night market is, its people 22-26 px with hoods,
//                     caps, bags, a few umbrellas (some with an LED edge), bowls of food, crates on shoulders, faces turned up to
//                     the lanterns; gaps only where a story thing has to read. Juno is not in the picture (she does not walk it).
// Light (style guide §5, §7): amber is the key (the lanterns, the food), magenta for commerce and Sable's lure, cyan only for tech
// (screens, jars, the platform, the sign's frame, the door up), red only on the chain. The smoke between us and a thing is laid on in
// flat bands by distance (haze); dither only at a light's falloff (the pools on the bed, the lanterns on the walls, the scan cone).
// The bed is wet: lights mirror on it in broken streaks, strongest in the puddles along the canal's lip.
// Moving: lanterns breathing, a few swaying on their strings (their reflections with them), the sign's K and a few hanging signs
// stuttering, the gallery screens scrolling, the wok's fire and steam, the platform's ring and rotors and its scan, the canal's
// glints, the crowd (heads turning, a few stepping in place, the bowls' steam, the preacher's hand), Sable's curtain leaking light,
// smoke drifting.
include("../lib/iso.js", { palette: true })
include("../lib/text.js")

const DA = (() => {
  const W = 320, H = 432, F = 340, HC = 16, A0 = -0.21
  const WX = 9, GX = 7, TH = 0.4, CAN = 1.8, DEEP = 0.9, TOP = 27, ZEND = 130
  const LV = [5.5, 10, 14.5, 19, 23.5]
  const R = Math.round, clamp = (v, a, b) => Math.max(a, Math.min(b, v)), TAU = Math.PI * 2
  const hash = ISO.ihash, bay = ISO.bay

  // ---- colours (the world palette's hexes, the booth's concrete and curtain, the tarps, the haze)
  const K = {
    k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
    e: "#0f151f", f: "#151d2b", z: "#1c2738", Z: "#253349", X: "#32445f",
    n: "#3e1240", M: "#a8238a", m: "#ff4fd3", N: "#ffc0f2",
    O: "#552b1c", P: "#b0602a", Q: "#eea040", R: "#ffd58a", W: "#fff4d8",
    c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",
    r: "#7e1420", q: "#ff3a3a", s: "#93583f", S: "#d79676",
    g: "#565e70", G: "#8e96a8", h: "#7d8ca4", H: "#b9c6d8",
    a: "#2c2026", A: "#4a3026", i: "#2a1636", I: "#46204e", t: "#11303d", T: "#1b495a",
    l: "#28232f", L: "#3a3034", o: "#54423a", p: "#76604c",                  // concrete in warm light (the booth's)
    l2: "#1f1b25", rs: "#3b2622",                                             // the scum under the tide mark; rust run down from a bracket
    J: "#22101a", Kc: "#3a1624", B: "#57222f", Fc: "#7a3a40",                 // Sable's curtain (the booth's)
    t1: "#4e2219", t2: "#6e2e1f", t3: "#8c4126", t4: "#a8583a",               // rust tarps: shade, base, lit, the lit crest
    v1: "#1f2e2a", v2: "#2f4439", v3: "#45604f", v4: "#5f7c66",               // faded green tarps
    u1: "#2a1530", u2: "#41203f", u3: "#5a3053", u4: "#734468",               // plum tarps
    b0: "#15263b", b1: "#1d3550", b2: "#2c5580", b3: "#3e6a96",               // blue tarps
    w1: "#33241c", w2: "#54392a", w3: "#7a5638",                              // wood, crates
    rz: "#90d0a0",                                                            // Ratz's collar
    pr: "#d8c8a0", pr2: "#8a7c60",                                            // the preacher's coat (his subtitle colour)
    hz: "#46293f", hz2: "#5a3350",                                            // the market's smoke, near and far
    hr1: "#3a2a22", hr2: "#6a6670", hr3: "#5a2448",                           // hair: brown, grey, dyed plum
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

  // ---- the loop's clock: everything that moves reads FR (0..11) or PH (0..<1), so the loop closes
  let FR = 0, PH = 0
  const wave = (n, off = 0) => Math.sin(PH * TAU * n + off)   // n whole cycles a loop

  // ---- the camera
  /** metres (X right, Y up, Z away) to the screen: x, y, px per metre, distance */
  const P = (X, Y, Z) => { const dy = HC - Y, r = Math.hypot(dy, Z), a = Math.atan2(dy, Z); return { x: 160 + F * X / r - 0.5, y: (a - A0) * F - 0.5, s: F / r, r, a } }

  // ---- buffers: colour, depth, and what the raycast hit (1 the wet bed, 2 a puddle, 3 the canal, whose mirror is painted in waterKey)
  const col = new Array(W * H).fill(K.k), dep = new Float32Array(W * H).fill(1e9), surf = new Uint8Array(W * H)
  const put = (x, y, k, d = 0) => { x = R(x); y = R(y); if (x < 0 || y < 0 || x >= W || y >= H) return; const i = y * W + x; if (d <= dep[i]) { col[i] = k; dep[i] = d; surf[i] = 0 } }
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
  /** a hanging cable from a to b, sagging by sag metres (a catenary's look is a sine at this size) */
  const cable = (a, b, sag, k, o = {}) => {
    const n = Math.max(6, R(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) * 3)), pts = []
    for (let i = 0; i <= n; i++) { const u = i / n; pts.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - Math.sin(u * Math.PI) * sag, a[2] + (b[2] - a[2]) * u]) }
    for (let i = 0; i < n; i++) line3(pts[i], pts[i + 1], k, o)
    return pts
  }
  /** text into points (the game's fonts), then drawn n px to a pixel */
  const glyphs = (s, font = "nagiwa") => { const pts = []; TXT.draw({ px: (x, y) => pts.push([x, y]) }, 0, 0, s, "x", { font }); return { pts, w: TXT.measure(s, font), h: font === "hud" ? 5 : 7 } }
  /** o.dim: [x0, x1, colour], the glyph columns of a stuttering letter and the colour it drops to */
  const words = (x, y, s, k, d, o = {}) => {
    const g = glyphs(s, o.font), n = o.n ?? 1, x0 = R(x - (o.center ? g.w * n / 2 : 0))
    if (o.under) for (const [px, py] of g.pts) for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [1, -1], [-1, 1]]) rect(x0 + px * n + ox, y + py * n + oy, n, n, o.under, d)
    for (const [px, py] of g.pts) {
      const off = o.dim && px >= o.dim[0] && px < o.dim[1]
      rect(x0 + px * n, y + py * n, n, n, (i, j) => (off ? o.dim[2] : o.core && i === 0 && j === 0 && n > 1 ? o.core : k), d)
    }
    return g.w * n
  }

  // ---- the structure, raycast
  const STRINGS = [[12.5, 16.6, 1.2], [16, 16.9, 1.4], [19.5, 15.8, 1.1], [28.4, 12.6, 1.2], [29.5, 15.2, 1.3], [31, 8.4, 1.1], [34, 17.5, 1.5], [38, 11.2, 1.2],
    [42, 15, 1.4], [46, 8.6, 1], [50, 19.5, 1.6], [55, 12.4, 1.2], [60, 16.4, 1.4], [66, 9.6, 1], [72, 20.5, 1.6], [79, 13.2, 1.3], [87, 17.6, 1.4], [96, 11, 1.2], [106, 21, 1.6]]
  const EDGE = { "-1": ["m", "Q", "v", "m", "Q"], "1": ["v", "m", "Q", "Q", "m"] }   // each gallery's neon strip along its edge
  const EDGE_DIM = { m: "M", Q: "P", v: "C" }
  const POOLS = [   // light on the bed: [X, Z, radius, ramp] (the ramps: base, weak, strong)
    [-5.4, 19, 3.4, "a A"], [5.2, 14, 2.8, "t T"], [5.2, 18, 2.4, "t T"], [5.2, 22, 2.6, "i I"], [-7.4, 28.2, 3.4, "i I"], [-5.4, 11, 2.2, "t T"],
    [-2.5, 22.4, 1.6, "a A"], [3.7, 10.7, 2.2, "t T"], [3.2, 16, 2.2, "a A"], [-3.4, 14, 2, "a A"], [-5.5, 32, 3, "a A"], [5.5, 30, 3, "i I"], [-5.5, 38, 3, "a A"], [5.5, 36, 3, "a A"]]
  /** the puddles along the canal's lip, where the bed runs down to it: a lens per stretch, some stretches dry */
  const puddle = (X, Z) => {
    const ax = Math.abs(X); if (ax < CAN || Z > 70) return false
    const u = Z / 1.6, cell = Math.floor(u), w = hash(cell, X > 0 ? 3 : 4)
    return w < 0.55 && ax < CAN + 0.15 + (0.35 + w * 1.4) * Math.sin((u - cell) * Math.PI)
  }
  const floorKey = (X, Z, x, y) => {
    let best = null, bv = 0
    for (const [px, pz, r, ramp] of POOLS) { const v = 1 - Math.hypot(X - px, (Z - pz) * 0.8) / r; if (v > bv) { bv = v; best = ramp } }
    // the lantern strings' warmth on the bed under them
    for (const [zs, ys] of STRINGS) if (ys < 18) { const v = 0.32 - Math.abs(Z - zs) / 6; if (v > bv) { bv = v; best = "a A" } }
    if (Z < 25.5 && Math.abs(X) > 3.6 && Math.abs(X) < 6.4) { const v = 0.36 - Math.abs(Math.abs(X) - 5.6) / 5; if (v > bv) { bv = v; best = "a A" } }
    const wet = puddle(X, Z)
    // the slabs' joints; a drain grate in the lip every 6 m, where the bed's water goes
    const joint = (Math.abs(X) % 3 < 0.06 || Z % 3 < 0.06) ? 1 : 0
    const grate = Math.abs(Math.abs(X) - CAN - 0.3) < 0.22 && (Z % 6) > 2.6 && (Z % 6) < 3.3 && Z < 40
    const base = grate ? ((R(Z * 10) % 2) ? K.k : K[2]) : joint ? K.e : Math.abs(Math.abs(X) - CAN) < 0.18 ? K[4] : wet ? K.e : K.f
    if (!best) return { k: base, wet }
    let [w, s] = best.split(" ").map((q) => K[q])
    if (wet) { w = mix(w, K.e, 0.35); s = mix(s, K.e, 0.25) }    // standing water is darker than the damp slab, and mirrors more
    const k = bv > 0.5 ? s : bv > 0.3 ? (bay(x, y) < (bv - 0.3) / 0.2 ? s : w) : bv > 0.12 ? (bay(x, y) < (bv - 0.12) / 0.18 ? w : base) : base
    return { k, wet }
  }
  /** the channel's own concrete under the first gallery: formwork joints, the flood's tide marks, what runs down from above */
  const channelKey = (side, Y, Z, x, y) => {
    const below = Y < 3.6
    let k = below ? K.l : K[3]
    if (Y < 3.6 && Y > 3.22) k = K.l2                                   // the scum the last flood left under its line
    if (Math.abs(Y - 2.3) < 0.05 && Z < 60) k = K.l2                    // an older, lower flood
    if (Math.abs(Y - 3.6) < 0.08) return K.L                            // the crust of the tide mark
    if (Z < 45 && ((Z + 0.6) % 2.4 < 0.05 || Math.abs(Y - 1.2) < 0.03)) k = below ? K.l2 : K[2]   // the formwork's joints
    // the gallery's drain spouts every 4.8 m: their water has darkened a streak down the wall, narrowing as it goes
    const sp = Math.floor(Z / 4.8), zs = sp * 4.8 + 1.2 + hash(sp, side + 11) * 2.4, end = 1.2 + hash(sp, side + 12) * 2.2
    if (Y > end && Y < 5.1 && Math.abs(Z - zs) < 0.05 + 0.14 * (Y - end) / (5.1 - end)) k = below ? K.l2 : K[2]
    if (Y > 4.85 && Y < 5.1 && Math.abs(Z - zs) < 0.12) return K[4]     // the spout
    // the gallery's brackets bleed rust under them
    const bz = Math.round(Z / 3.4) * 3.4
    if (Math.abs(Z - bz) < 0.05 && Y > 4.3 && Y < 5.1) k = K.rs
    // the lanterns hung along the gallery's edge (8.6 to 24.6 m) light the wall under them, falling off down it
    if (Z > 8.4 && Z < 24.8 && Y > 2.4 && Y < 5.1) {
      const v = 1 - Math.abs(Y - 4.5) / 2.1
      if (v > 0.55) k = k === K.l2 || k === K.rs ? K.L : K.o
      else if (bay(x, y) < v / 0.55 * 0.7) k = k === K.l2 || k === K.rs ? K.l : K.L
    }
    return k
  }
  /** the face of a wall: shops in units along it per gallery, the bare channel under the first gallery */
  const wallKey = (side, Y, Z, x, y) => {
    if (Y < LV[0] - TH) return channelKey(side, Y, Z, x, y)
    let li = LV.length - 1; while (li > 0 && Y < LV[li] - TH) li--
    const L = LV[li], yy = Y - L
    if (yy < 0) return K[2]
    const U = 3.4, uu = (Z + (side < 0 ? 1.3 : 0)) / U, ui = Math.floor(uu), u = uu - ui, q = hash(ui * 3 + li * 101, side + 7)
    if (u < 0.07) return u < 0.02 ? K[4] : K[3]                         // the pillar between two units, its lit edge
    if (yy < 2.5 && u > 0.12 && u < 0.93) {
      if (q < 0.3) {                                                    // a lit shop: shelves of goods, the lamp's floor
        if (yy < 0.9) return K.Q
        if (yy > 2.2) return K.P
        const shelf = Math.abs(yy - 1.45) < 0.06 || Math.abs(yy - 1.95) < 0.06
        return shelf ? K.O : hash(Math.floor(u * 9), ui + Math.floor(yy * 2)) < 0.4 ? K.O : K.P
      }
      if (q < 0.44) return yy > 2.25 ? K.n : (Math.floor(u * 6) % 2 ? K.M : K.I)   // a curtain drawn, the light through it
      if (q < 0.58) {                                                   // a wall of screens: text scrolling up them, a frame between
        if (yy < 0.6 || yy > 1.8) return K.C
        const sc = Math.floor(u * 3), su = u * 3 - sc
        if (su < 0.1) return K.c
        const row = Math.floor((yy - 0.6) * 9), lit = hash((row + FR) % 12, ui * 5 + sc + li * 31)
        return lit < 0.5 ? (su < 0.75 ? K.v : K.C) : K.C
      }
      if (q < 0.82) {                                                   // a rolled shutter: its slats, its foot, a padlock
        if (yy < 0.08) return K[2]
        if (yy < 0.2 && Math.abs(u - 0.52) < 0.03) return K.G
        if (hash(ui, li + 40) < 0.4 && Math.abs(u - 0.2 - hash(ui, li + 41) * 0.5) < 0.03 && yy < 2.3) return K.rs   // rust from the box above
        return Math.floor(yy * 5) % 2 ? K[4] : K[3]
      }
      return yy > 1.0 && yy < 1.9 && u > 0.6 && u < 0.85 ? K.O : K[1]  // a dark unit, someone's lamp in its window
    }
    if (yy > 2.65 && yy < 3.25 && u > 0.1 && u < 0.95) {               // the units' signs over their fronts
      const sk = q < 0.4 ? "m" : q < 0.62 ? "v" : q < 0.86 ? "Q" : null
      if (!sk) return K[2]
      const letter = yy > 2.8 && yy < 3.1 && (u * 11) % 1 < 0.62 && u > 0.18 && u < 0.88
      const stutter = hash(ui, li * 7 + side) < 0.12 && (FR + ui) % 12 === 5
      return letter && !stutter ? K[sk] : K[{ m: "n", v: "c", Q: "O" }[sk]]
    }
    if (yy > 3.4 && u > 0.2 && u < 0.45 && hash(ui, li + side) < 0.4) return K.O
    // under the next gallery: an AC box dripping, its stain down to the sign
    if (yy > 3.3 && Math.abs(u - 0.7) < 0.08 && hash(ui, li + 60) < 0.3) return yy > 3.7 ? K[4] : K[1]
    return K[2]
  }
  const waterKey = (X, Z) => {
    // the lanterns' strings and the galleries' neon lie on the water in broken streaks; ripples move the breaks through the loop
    // each row of water its own ripple: the light breaks into dashes across it that slide along through the loop
    // (offset by a hash per row, so the dashes never line up into columns; darker water between them)
    const row = R(Z * 9), dir = row % 2 ? 1 : -1
    const rip = Math.sin(X * 7 + hash(row, 9) * TAU + PH * TAU * dir), rip2 = Math.sin(X * 6 + hash(row, 10) * TAU - PH * TAU * dir)
    // a string of lanterns mirrors as a short streak under each lantern (where they hang on it: i = 2, 2 + step, ... of 60),
    // wavering sideways and broken by the ripples; dark water between the streaks
    for (const [zs] of STRINGS) {
      const w = 0.16 + Z * 0.01, dz = Math.abs(Z - zs - 1.2); if (dz >= w) continue
      const step = zs < 30 ? 4 : zs < 60 ? 3 : 2, at = ((X + GX + 0.1) / 0.2367 - 2) / step, off = Math.abs(at - Math.round(at)) * step * 0.2367
      const wob = 0.05 * Math.sin(row * 1.7 + PH * TAU * dir)
      if (Math.abs(off + wob) < 0.07 + Z * 0.002 && Math.sin(row * 2.9 + Math.round(at) * 1.3 + PH * TAU) > -0.35) return dz < w * 0.5 ? K.Q : K.P
    }
    // the sign's magenta: a few short ripples catching it, most rows dark
    if (Z > 27.5 && Z < 34 && Math.abs(X) < 1.45 && row % 3 !== 0) {
      if (rip2 > 0.7 && row % 3 === 1) return Z < 29 || Z > 33 ? K.M : (rip2 > 0.93 ? K.N : K.m)
      if (rip2 > 0.3) return K.n
    }
    if (Z > 34 && Z < 35.2 && Math.abs(X) < 1.5 && R(Z * 5) % 2) return K.v
    if (Math.abs(X) > CAN - 0.35 && Math.sin(Z * 2.5 + (X > 0 ? 1 : 2) + PH * TAU) > -0.2) return X < 0 ? K.M : K.C
    if (Math.abs(X) < 0.3 && (Z + 0.6 * Math.sin(PH * TAU + Z * 0.7)) % 4 < 1.6) return K.n
    return (R(Z * 1.5) % 2) ? K.e : K.k
  }
  const cast = (x, y) => {
    const a = A0 + (y + 0.5) / F, l = (x + 0.5 - 160) / F, sa = Math.sin(a), ca = Math.cos(a)
    let best = { t: 1e9, k: K.hz2, glow: false, sf: 0 }
    const hit = (t, k, glow = false, sf = 0) => { if (t > 0.2 && t < best.t) best = { t, k, glow, sf } }
    const at = (t) => [t * l, HC - t * sa, t * ca]
    // the bed and the canal
    if (sa > 0) {
      const t = HC / sa, [X, , Z] = at(t)
      if (Math.abs(X) <= WX && Z < ZEND) {
        if (Math.abs(X) >= CAN) { const fk = floorKey(X, Z, x, y); hit(t, fk.k, false, fk.wet ? 2 : 1) }
        else { const tw = (HC + DEEP) / sa, [Xw, , Zw] = at(tw); if (Math.abs(Xw) < CAN) hit(tw, waterKey(Xw, Zw), false, 3); else hit(CAN / Math.abs(l), K[2]) }
      }
    }
    // the walls
    if (Math.abs(l) > 1e-6) { const t = WX / Math.abs(l), [, Y, Z] = at(t); if (Y >= -1 && Y <= TOP && Z < ZEND) hit(t, wallKey(Math.sign(l), Y, Z, x, y), Y >= LV[0]) }
    // the galleries: their walkways, their edges with the neon, their rails, their undersides
    LV.forEach((L, li) => {
      if (HC > L && sa > 0) {
        const t = (HC - L) / sa, [X, , Z] = at(t)
        if (Math.abs(X) >= GX && Math.abs(X) <= WX && Z < ZEND) hit(t, Math.abs(X) > WX - 0.7 ? K.A : Z < 50 && Z % 1.5 < 0.05 ? K[2] : K[3])
      }
      if (HC < L - TH && sa < 0) {
        const t = (HC - L + TH) / sa, [X, , Z] = at(t)
        // the undersides: the shops' warm light near the wall, two pipes along it
        if (Math.abs(X) >= GX && Math.abs(X) <= WX && Z < ZEND) hit(t, Math.abs(X) > WX - 0.8 ? K.a : Math.abs(Math.abs(X) - 7.7) < 0.09 ? K[3] : Math.abs(Math.abs(X) - 7.95) < 0.06 ? K[2] : K[1])
      }
      if (Math.abs(l) > 1e-6) {
        const t = GX / Math.abs(l), [X, Y, Z] = at(t), sd = Math.sign(l)
        if (Z < ZEND && Y >= L - TH && Y <= L) {
          const strip = Y > L - 0.27 && Y < L - 0.12
          let ek = K[EDGE[sd][li]]
          // one strip stutters for two frames of the loop
          if (strip && sd > 0 && li === 2 && (FR === 4 || FR === 5) && Z > 30 && Z < 60) ek = K[EDGE_DIM[EDGE[sd][li]]]
          hit(t, strip ? ek : K[2], strip)
        }
        if (Z < ZEND && Y > L && Y < L + 1.05 && (Y > L + 0.93 || Z % 1.7 < 0.08 || Math.abs(Y - L - 0.5) < 0.035)) hit(t, Y > L + 0.93 ? K[5] : K[3])
      }
    })
    // the city's underside: its deck with a slit of pink smog down the middle, the beams across, a few maintenance lamps
    if (sa < 0) {
      const t = (HC - TOP) / sa, [X, , Z] = at(t)
      if (Math.abs(X) <= WX + 4) {
        const half = 3.2 + Math.sin(Z * 0.21) * 0.6 + (Z - 50) * 0.03
        if (Math.abs(X) < half && Z > 50) { const e = Math.abs(X) / half, band = R(Z / 6) % 3; hit(t, e > 0.86 ? K.M : e > 0.6 ? (band ? K.m : K.M) : e > 0.25 ? (band === 1 ? K.N : K.m) : K.N, true) }
        else {
          const lamp = Z < 50 && Math.abs(Math.abs(X) - 5.5) < 0.25 && Z % 9 < 0.4
          hit(t, lamp ? K.Q : Math.abs(X) % 4 < 0.4 ? K[2] : K.e, lamp)
        }
      }
    }
    for (let zb = 48; zb < ZEND; zb += 14) { const t = zb / ca, [X, Y] = at(t); if (Y > TOP - 0.7 && Y < TOP && Math.abs(X) < WX + 4) hit(t, Y < TOP - 0.55 ? K[3] : K[1]) }
    // the far end: the channel goes on into the smoke
    { const t = ZEND / ca, [, Y] = at(t); hit(t, Y > TOP ? K.n : Y > 12 ? K.hz2 : K.hz) }
    return best
  }

  // ---- people
  const COATS = ["3", "4", "2", "o", "L", "5", "Kc", "w2", "b1", "p", "l", "t1", "#3d4a3a", "#4a2a30", "#2a3f4f", "#5a4e44", "#5e6470"]
  const ACC = [K.v, K.m, null, null, K.v, null, K.Q, null]
  const HAIR = [K.k, K.k, K.hr1, K.hr1, K.hr2, K.hr3, K.k]
  // the near crowd's coats: the night colours, and now and then a bright one (a white parka, a magenta jacket, a green one; never yellow)
  const COATS_NEAR = [...COATS, "#7a8090", "#3a4658", "#4e3a48", "#c0c4cc", "M", "#5f7c66", "#8a3a5a"]
  const UMB = ["#1f2430", "#2a3f4f", "#41203f", "#3e5444", "#4a505e", "#5a2a3a"]
  /**
   * A person standing at (X, Z) on a floor at Yb, painted at their size: legs, a coat lit across the shoulders by the lanterns above
   * and shaded down its far side, a head under a hood, a cap or bare hair; some carry a bag. They live on the loop: most turn their
   * head now and then, a few step in place. The near ones (9 px and up) get an ink outline round their silhouette.
   */
  const person = (X, Z, Yb, coat, o = {}) => {
    const id = o.id ?? (R(X * 53) * 131 + R(Z * 29) * 7), q1 = hash(id, 71), q2 = hash(id, 72), q3 = hash(id, 73), q4 = hash(id, 74)
    const p = P(X, Yb, Z), s = p.s, fs = 0.8 + 0.2 * Math.cos(p.a)
    const hpx = Math.max(3, R(s * (o.h ?? 1.7) * fs)), wpx = Math.max(2, R(s * (o.w ?? 0.5))), d = p.r - 0.05
    const kz = (c) => haze(c, p.r)
    const cc = K[coat] ?? coat, x0 = R(p.x - wpx / 2), y0 = R(p.y)
    const ph = (FR + R(q2 * 12)) % 12
    const stepper = !o.still && q1 < 0.16, turner = !o.still && q1 >= 0.16 && q1 < 0.62
    const head = Math.max(1, R(hpx * 0.2)), legs = Math.max(1, R(hpx * 0.38)), body = hpx - head - legs
    const pix = new Map(), dot = (x, y, c) => pix.set(x + "," + y, c), box = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) dot(x + i, y + j, c) }
    // the legs, the lifted foot a row short
    const trou = kz(o.trousers ?? (q3 < 0.6 ? K[1] : q3 < 0.8 ? K.e : K.w1))
    if (wpx >= 3 && legs >= 2) {
      const lw = Math.max(1, Math.floor(wpx / 2)), lift = stepper ? (ph % 6 < 3 ? 0 : 1) : -1
      box(x0, y0 - legs, lw, legs - (lift === 0 ? 1 : 0), trou)
      box(x0 + wpx - lw, y0 - legs, lw, legs - (lift === 1 ? 1 : 0), trou)
      if (wpx > 2 * lw) box(x0 + lw, y0 - legs, wpx - 2 * lw, Math.max(1, R(legs * 0.4)), trou)
      if (hpx >= 14) {                                                                   // the boots
        box(x0, y0 - (lift === 0 ? 2 : 1), lw, 1, kz(K.k))
        box(x0 + wpx - lw, y0 - (lift === 1 ? 2 : 1), lw, 1, kz(K.k))
      }
    } else box(x0, y0 - legs, wpx, legs, trou)
    // the coat: long ones reach down the legs
    const by = y0 - legs - body, long = q4 < 0.3 && legs >= 3 ? R(legs * 0.5) : 0
    box(x0, by, wpx, body + long, kz(cc))
    if (body >= 3) box(x0, by, wpx, 1, kz(mix(cc, K.R, 0.28)))
    if (wpx >= 4 && body >= 3) box(x0 + wpx - 1, by + 1, 1, body - 1 + long, kz(mix(cc, K.k, 0.45)))
    // an open coat shows what is under it
    if (wpx >= 7 && body >= 7 && q3 < 0.35) box(x0 + R(wpx / 2) - 1, by + 1, 2, body - 2 + long, kz(q4 < 0.5 ? K[1] : mix(K.H, K[4], 0.5)))
    if (wpx >= 6 && body >= 6) {
      const arm = R(body * 0.75)
      for (const ax of [x0 + 1, x0 + wpx - 2]) box(ax, by + 2, 1, arm - 1, kz(mix(cc, K.k, 0.3)))
      for (const ax of [x0, x0 + wpx - 1]) dot(ax, by + arm + 1, kz(o.skin ?? (q4 < 0.5 ? K.s : K.S)))
    }
    // a bag on a strap across the chest, hanging at the hip
    if (q3 > 0.72 && wpx >= 4 && body >= 4) {
      for (let j = 0; j < Math.min(wpx, body - 1); j++) dot(x0 + j, by + 1 + j, kz(mix(cc, K.k, 0.6)))
      box(x0 + wpx - 2, by + body - 2, 2, 2, kz(q4 < 0.6 ? K.g : K.w2))
    }
    if (o.raise) { const up = (FR % 6 < 3) ? 0 : 1; box(x0 + wpx, by - R(hpx * 0.15) + up, Math.max(1, R(wpx / 3)), R(hpx * 0.45) - up, kz(cc)); dot(x0 + wpx, by - R(hpx * 0.15) + up - 1, kz(o.skin ?? K.s)) }
    // what a near one carries or does: an umbrella, a bowl of food, a crate on the shoulder, or the head turned up to the lanterns
    const ex = o.extra ?? (hpx >= 12 && !o.still ? hash(id, 75) : 1)
    const act = ex < 0.05 ? "umbrella" : ex < 0.16 && body >= 5 ? "bowl" : ex < 0.25 ? "crate" : ex < 0.36 ? "up" : null
    // the head, turned aside for a few frames
    const turn = turner && act !== "up" && wpx >= 3 && ph >= 3 && ph < 6 ? (q4 < 0.5 ? -1 : 1) : 0
    const hw = Math.max(1, wpx - 2), hx = x0 + R((wpx - hw) / 2) + turn, hy = by - head
    const skin = kz(o.skin ?? (q4 < 0.5 ? K.s : K.S)), hair = kz(o.hair ?? HAIR[R(q3 * 6)]), kind = o.kind ?? (q2 < 0.22 ? "hood" : q2 < 0.36 ? "cap" : "bare")
    // from up here the top of the head shows more than the face, more so the steeper we look
    const top = head >= 2 ? Math.max(1, R(head * (0.25 + 0.35 * Math.sin(p.a)))) : 0
    if (kind === "hood") { box(hx, hy, hw, head, kz(mix(cc, K.k, 0.2))); if (head >= 2 && hw >= 2) box(hx + R(hw / 2 - 0.5) - turn, hy + head - 1, Math.max(1, hw - 2), 1, skin) }
    else if (act === "up" && head >= 3 && hw >= 3) {                                     // the face turned up: it shows whole, lit warm
      box(hx, hy, hw, head, kz(mix(o.skin ?? (q4 < 0.5 ? K.s : K.S), K.R, 0.15))); box(hx, hy, hw, 1, hair)
      dot(hx + (hw >= 5 ? 1 : 0), hy + R(head / 2), kz(K.k)); dot(hx + hw - 1 - (hw >= 5 ? 1 : 0), hy + R(head / 2), kz(K.k))
    }
    else {
      box(hx, hy, hw, head, skin)
      if (top) box(hx, hy, hw, top, kind === "cap" ? kz(q4 < 0.4 ? K.H : q4 < 0.7 ? K[5] : K.w3) : hair)
      else if (head === 1 && hpx < 6) dot(hx, hy, hair)
    }
    // the piece of tech everyone carries: an implant's point, an LED trim at the collar
    if (o.accent && hpx >= 6) dot(hx + (turn < 0 ? 0 : hw - 1), hy + head - 1 + (head < 3 ? 1 : 0), o.accent)
    let steam = null
    if (act === "bowl") {                                                               // held in both hands in front, noodles in broth
      const bx = x0 + R(wpx / 2) - 2, byy = by + R(body * 0.35)
      dot(bx, byy, kz("#c8c0b0")); box(bx + 1, byy, 2, 1, kz("#d89048")); dot(bx + 3, byy, kz("#c8c0b0")); box(bx + 1, byy + 1, 2, 1, kz("#8a8478"))
      dot(bx - 1, byy + 1, skin); dot(bx + 4, byy + 1, skin)
      steam = [bx + 1 + (id % 2), byy - 1]
    } else if (act === "crate") {                                                       // on the shoulder, a hand up to hold it
      const cw = Math.max(4, R(s * 0.5)), ch = Math.max(3, R(s * 0.3)), cx = q4 < 0.5 ? x0 - 2 : x0 + wpx - cw + 2, cy = hy - R(ch / 2)
      box(cx, cy, cw, ch, kz(K.w2)); box(cx, cy, cw, 1, kz(K.w3)); box(cx, cy + R(ch / 2), cw, 1, kz(K.w1)); box(cx + cw - 1, cy + 1, 1, ch - 1, kz(K.w1))
      if (hash(id, 78) < 0.5) box(cx + 1, cy + 1, cw - 2, 1, kz(hash(id, 79) < 0.5 ? "#3f8a58" : K.Q))   // what is in it shows over the edge
    } else if (act === "umbrella") {                                                    // over the head; from up here it hides it
      // a dome seen from above and in front: its crown high in the ellipse, eight panels lit or shaded by which way they face, the
      // edge scalloped between the ribs' tips; some have an LED strip in the edge (dotted, the tips brighter)
      const rx = Math.max(5, R(s * 0.58)), ry = Math.max(4, R(rx * (0.45 + 0.35 * Math.sin(p.a)))), cx = R(p.x), cy = hy + 2 - R(ry * 0.5)
      const uc = UMB[R(hash(id, 76) * (UMB.length - 1))], led = hash(id, 77) < 0.45, crown = [cx - 1, cy - R(ry * 0.35)]
      const inE = (i, j) => { const a = Math.atan2(j / ry, i / rx), sc = 1 - 0.07 * Math.abs(Math.sin(a * 4)); return (i / rx) ** 2 + (j / ry) ** 2 <= sc * sc }
      for (let j = -ry; j <= ry; j++) for (let i = -rx; i <= rx; i++) {
        if (!inE(i, j)) continue
        const rim = !(inE(i + 1, j) && inE(i - 1, j) && inE(i, j + 1) && inE(i, j - 1))
        const ca = Math.atan2(cy + j - crown[1], cx + i - crown[0]), panel = Math.floor((ca + Math.PI) / TAU * 8 + 0.5) % 8
        const lit = [0.1, -0.1, -0.25, 0.05, 0.25, 0.35, 0.3, 0.2][panel]   // the panels facing up and to the left catch the lanterns
        let k = lit > 0.15 ? mix(uc, K.R, lit * 0.7) : lit < 0 ? mix(uc, K.k, -lit * 1.4) : uc
        const rib = Math.abs(((ca + Math.PI) / TAU * 8 + 0.5) % 1 - 0.5) > 0.45
        if (rib) k = mix(uc, K.k, 0.3)
        if (rim) k = led ? (rib ? K.V : (i + j) % 2 ? K.v : K.C) : mix(uc, K.k, 0.45)
        dot(cx + i, cy + j, led && rim ? k : kz(k))
      }
      dot(crown[0], crown[1], kz(K[6]))                                                                  // the ferrule
    }
    if (hpx >= 9) for (const key of pix.keys()) { const [x, y] = key.split(",").map(Number); for (const [ox, oy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!pix.has((x + ox) + "," + (y + oy))) put(x + ox, y + oy, K.k, d + 0.01) }
    for (const [key, c] of pix) { const [x, y] = key.split(",").map(Number); put(x, y, c, d) }
    if (steam) { const t = (FR + id) % 6; if (t < 4) blend(steam[0] + (t > 2 ? 1 : 0), steam[1] - t, K.H, 0.5 - t * 0.1, d - 0.2) }   // the bowl's steam, a wisp rising
    return { x: p.x, y: p.y, hpx, wpx, s, d }
  }

  // ---- lights
  /** every lantern on the strings across, at this frame: a few sway on their cords, all breathe a little */
  const lanternsNow = () => {
    const out = []
    STRINGS.forEach(([zs, ys, sag], si) => {
      const n = 60, step = zs < 30 ? 4 : zs < 60 ? 3 : 2
      for (let i = 2; i < n - 1; i += step) {
        const u = i / n, X = -GX - 0.1 + u * (2 * GX + 0.2), Y = ys - Math.sin(u * Math.PI) * sag + (u - 0.5) * 0.6 - 0.32, id = si * 61 + i
        const sw = hash(id, 9) < 0.22 ? 0.09 * wave(1, hash(id, 10) * TAU) : 0
        out.push({ X: X + sw, Y: Y + Math.abs(sw) * 0.3, Z: zs, id, cord: [X, Y + 0.32] })
      }
    })
    return out
  }
  /** a paper lantern: a halo on the smoke round it, its body with ribs if it is near enough, a core breathing */
  const lantern = (L) => {
    const p = P(L.X, L.Y, L.Z), r = Math.max(1, p.s * 0.19), d = p.r, br = wave(1, hash(L.id, 11) * TAU)
    const halo = 0.2 + br * 0.04
    for (let j = -R(r * 2.6); j <= R(r * 2.6); j++) for (let i = -R(r * 2.6); i <= R(r * 2.6); i++) { const e = Math.hypot(i, j * 1.15) / r; if (e > 1 && e < 2.6) blend(p.x + i, p.y + j, K.Q, e < 1.8 ? halo : halo * 0.45, d) }
    for (let j = -R(r * 1.2); j <= R(r * 1.2); j++) for (let i = -R(r); i <= R(r); i++) {
      const e = Math.hypot(i / r, j / (r * 1.2))
      if (e > 1.05) continue
      const rib = r >= 2.5 && j !== 0 && Math.abs(j) % 2 === 0 && e > 0.3
      put(p.x + i, p.y + j, e < (0.4 + br * 0.08) && r > 1.5 ? K.W : rib ? K.Q : e < 0.8 ? K.R : K.Q, d)
    }
    if (r >= 2.5) { put(p.x, p.y - R(r * 1.2) - 1, K.k, d); put(p.x, p.y + R(r * 1.2) + 1, K.P, d) }
    if (Math.abs(L.X - L.cord[0]) > 0.01) { const c = P(L.cord[0], L.cord[1], L.Z); line(c.x, c.y, p.x, p.y - R(r * 1.2), K.k, d + 0.02) }
  }
  /** a light mirrored on the wet bed or in the canal: its image under the floor, smeared toward us in a broken streak */
  const mirror = (X, Y, Z, k, id, f0 = 0.4) => {
    const below = P(X, -Y, Z), x = R(below.x), y0 = R(below.y), len = clamp(R(below.s * 1.1), 3, 12)
    for (let j = -1; j < len; j++) {
      const y = y0 + j; if (x < 0 || y < 0 || x >= W || y >= H) continue
      const i = y * W + x, sf = surf[i]; if (!sf || sf === 3) continue
      if (Math.sin(y * 1.3 + id * 0.7 + PH * TAU) < -0.75) continue        // a ripple breaks it now and then
      const f = (sf === 2 ? f0 * 1.5 : f0 * 0.45) * (1 - Math.max(0, j) / (len + 1))
      col[i] = mix(col[i], k, clamp(f, 0, 0.8))
    }
  }

  // ---- props
  /** a hanging sign out from a gallery on a bracket: a board facing us, neon letters stacked if it is near enough to read */
  const hang = (side, L, Z, word, k, plate, off) => {
    const xo = side * GX, xi = side * (GX - 1.6), a = P(Math.min(xo, xi), L - 0.7, Z), b = P(Math.max(xo, xi), L - 0.7 - 0.55 * word.length - 0.3, Z)
    const x0 = R(a.x), x1 = R(b.x), y0 = R(a.y), y1 = R(b.y), d = a.r - 0.2
    line3([xo, L - TH, Z], [xi + side * 0.2, L - 0.7, Z], K[1], { bias: -0.15 })
    const lk = off ? K[plate] === K.n ? K.M : K[plate] === K.c ? K.C : K.P : K[k]
    rect(x0 - 1, y0 - 1, x1 - x0 + 2, y1 - y0 + 2, K.k, d); rect(x0, y0, x1 - x0, y1 - y0, haze(K[plate], d), d)
    rect(x0, y0, 1, y1 - y0, lk, d); rect(x1 - 1, y0, 1, y1 - y0, lk, d)
    const lh = (y1 - y0 - 2) / word.length
    if (lh >= 6 && x1 - x0 >= 5) [...word].forEach((ch, i) => words(R((x0 + x1) / 2), R(y0 + 2 + i * lh + (lh - 5) / 2), ch, lk, d - 0.01, { font: "hud", center: true }))
    else for (let i = 0; i < word.length; i++) rect(x0 + 1, R(y0 + 1 + i * lh), Math.max(1, x1 - x0 - 2), Math.max(1, R(lh * 0.6)), haze(lk, d, true), d - 0.01)
  }
  const TARP = { rust: ["t1", "t2", "t3", "t4"], green: ["v1", "v2", "v3", "v4"], plum: ["u1", "u2", "u3", "u4"], blue: ["b0", "b1", "b2", "b3"] }
  /**
   * A tarp from the wall (3.5 m) out to its poles (2.9 m), sagging between the ropes that hold it: the slope that faces us lit by the
   * lanterns, the one that falls away in shade, a crest along each rope, the hem rolled at its edge, a patch where it tore.
   */
  const tarp = (side, Z0, Z1, set) => {
    const xw = side * WX, xt = side * 6.4, ribs = Math.max(1, R((Z1 - Z0) / 1.3)), tone = TARP[set].map((q) => K[q])
    const dz = 0.12 + Z0 * 0.006, nz = Math.max(3, Math.ceil((Z1 - Z0) / dz)), us = [0, 0.3, 0.55, 0.78, 0.92, 1]
    const Yat = (u, z) => 3.5 - 0.6 * u - 0.24 * Math.sin(((z - Z0) / (Z1 - Z0) * ribs % 1) * Math.PI) * (0.35 + 0.65 * u)
    const torn = hash(R(Z0 * 7), side + 21) < 0.35, pz = Z0 + (Z1 - Z0) * (0.2 + 0.5 * hash(R(Z0 * 7), side + 22))
    for (let iz = 0; iz < nz; iz++) {
      const za = Z0 + (Z1 - Z0) * iz / nz, zb = Z0 + (Z1 - Z0) * (iz + 1) / nz, zm = (za + zb) / 2
      const fr = ((zm - Z0) / (Z1 - Z0) * ribs) % 1, slope = Math.cos(fr * Math.PI)    // > 0: the cloth falls away from us
      for (let iu = 0; iu < us.length - 1; iu++) {
        const ua = us[iu], ub = us[iu + 1]
        let k = fr < 0.04 || fr > 0.96 ? tone[3] : fr > 0.82 ? tone[2] : fr > 0.1 && fr < 0.32 ? tone[0] : tone[1]
        if (ua >= 0.92) k = tone[0]                                                       // the rolled hem
        if (torn && ua >= 0.3 && ua < 0.78 && Math.abs(zm - pz) < 0.35) k = side < 0 ? K.w2 : K[4]   // a patch over a tear
        const X = (u) => xw + (xt - xw) * u
        poly3([[X(ua), Yat(ua, za), za], [X(ub), Yat(ub, za), za], [X(ub), Yat(ub, zb), zb], [X(ua), Yat(ua, zb), zb]], k, { bias: -0.3 })
      }
    }
  }
  /** a stall against a wall on the bed: its goods behind, lit, its counter facing the walk, its tarp from the wall, bulbs along it */
  const stall = (side, Z0, Z1, o = {}) => {
    const xc = side * 5.6, xb = side * 6.3, xt = side * 6.4, light = o.light ?? "Q", q = hash(R(Z0 * 7), side + 3)
    poly3([[xb, 0.95, Z0], [xb, 0.95, Z1], [xb, 2.6, Z1], [xb, 2.6, Z0]], mix(K[o.back ?? "P"], K.O, 0.35), { glow: true, bias: 0.3 })
    // the goods: what hangs and stands on the back's shelves, in the stall's light
    for (let z = Z0 + 0.1, n = 0; z < Z1 - 0.2; n++) {
      const w = 0.18 + hash(n, R(Z0 * 3)) * 0.3, top = 1.3 + hash(n, R(Z0 * 3) + 1) * 1.1, gq = hash(n, R(Z0 * 3) + 2)
      const gk = gq < 0.45 ? K[o.back ?? "P"] : gq < 0.65 ? K.R : gq < 0.85 ? K.O : K[light]
      poly3([[xb - side * 0.02, 0.95, z], [xb - side * 0.02, 0.95, z + w], [xb - side * 0.02, top, z + w], [xb - side * 0.02, top, z]], gk, { glow: true, bias: 0.25 })
      z += w + 0.08
    }
    poly3([[xc, 0, Z0], [xc, 0, Z1], [xc, 0.95, Z1], [xc, 0.95, Z0]], K[o.counter ?? "O"])                              // the counter's front
    poly3([[xc, 0.08, Z0], [xc, 0.08, Z1], [xc, 0.16, Z1], [xc, 0.16, Z0]], K[1], { bias: -0.01 })                      // its kick, scuffed dark
    poly3([[xc, 0.95, Z0], [xc, 0.95, Z1], [xb, 0.95, Z1], [xb, 0.95, Z0]], K[light], { glow: true })                   // its top, lit
    if (Z0 < 30) for (let z = Z0 + 0.25, n = 0; z < Z1 - 0.3; n++) {                                                    // what is set out on it
      const gq = hash(n, R(Z0 * 11)), w = 0.15 + gq * 0.25, p = P(side * (5.75 + hash(n, 3) * 0.3), 0.95, z), gw = Math.max(1, R(p.s * w * 0.5)), gh = Math.max(1, R(p.s * w * 0.35))
      rect(R(p.x), R(p.y) - gh, gw, gh, gq < 0.4 ? K.O : gq < 0.7 ? K.w2 : K[2], p.r - 0.32)
      z += w + 0.2 + hash(n, 5) * 0.4
    }
    const set = o.tarp ?? (q < 0.18 ? "blue" : q < 0.42 ? "rust" : q < 0.62 ? "green" : q < 0.78 ? "plum" : "rust")
    for (const z of [Z0 + 0.05, Z1 - 0.05]) line3([xt, 0, z], [xt, 2.9, z], K[4], { bias: -0.2 })                     // its poles
    tarp(side, Z0, Z1, set)
    // the bulbs along the tarp's edge, one now and then failing for a frame
    let bi = 0
    for (let z = Z0 + 0.4; z < Z1; z += 0.8, bi++) {
      const p = P(xt, 2.85, z), out = hash(bi, R(Z0 * 5)) < 0.12 && (FR + bi) % 12 === 7
      put(p.x, p.y, haze(out ? K.P : K.R, p.r, true), p.r - 0.4)
    }
  }
  /** the stalls' lit counters mirrored on the bed in front of them */
  const counterGlints = (side, Z0, Z1, light) => { for (let z = Z0 + 0.3, n = 0; z < Z1; z += 0.5, n++) mirror(side * 5.75, 0.95, z, K[light], R(z * 13), 0.32) }

  // ---- the scene
  const paint = (c) => {
    FR = c.frame ?? 0; PH = FR / 12
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const h = cast(x, y), i = y * W + x; col[i] = haze(h.k, h.t, h.glow); dep[i] = h.t; surf[i] = h.sf }

    // the wet bed and the canal mirror the lanterns over them and the stalls' counters beside them (before anything stands on them)
    const LANTERNS = lanternsNow()
    for (const L of LANTERNS) if (L.Z > 24 && L.Z < 52) mirror(L.X, L.Y, L.Z, K.Q, L.id, 0.4)
    counterGlints(-1, 17.4, 22.2, "R"); counterGlints(-1, 22.6, 24.6, "Q"); counterGlints(1, 11.8, 15.6, "C"); counterGlints(1, 16.2, 19.8, "v"); counterGlints(1, 20.4, 24, "M")

    // hanging signs off the galleries (a forest of them, Hong Kong fashion); every fifth stutters for a frame at its own time
    const WORDS = ["BAR", "RAM", "PAWN", "SIM", "GILLS", "TATTOO", "DOCS", "HOTEL", "CHITS", "MODS", "FIX", "SOUP", "BUY", "SELL", "DATA", "OPEN"]
    let wi = 0
    LV.forEach((L, li) => { for (const side of [-1, 1]) for (let Z = 14 + hash(li, side) * 6; Z < ZEND - 10; Z += 7 + hash(R(Z), li) * 6) {
      if (L < 7 && Z < 38) continue
      const q = hash(R(Z * 3), li + side * 5), k = q < 0.42 ? "m" : q < 0.7 ? "v" : "Q", plate = { m: "n", v: "c", Q: "O" }[k]
      const off = wi % 5 === 2 && (FR + wi * 3) % 12 === 0
      hang(side, L, Z, WORDS[wi++ % WORDS.length], k, plate, off)
    } })

    // stalls along both walls on the bed, the story's own among them (near), plain ones on into the smoke
    stall(-1, 17.4, 22.2, { light: "R", back: "Q", tarp: "rust" })                 // the food stall
    stall(-1, 22.6, 24.6, { tarp: "green" })
    stall(1, 11.8, 15.6, { light: "C", back: "c", counter: "3", tarp: "blue" })    // Ratz
    stall(1, 16.2, 19.8, { light: "v", back: "C", counter: "3", tarp: "rust" })   // the jars of used implants
    stall(1, 20.4, 24, { light: "M", back: "n", tarp: "plum" })                     // the organ trade
    for (const side of [-1, 1]) for (let Z = side < 0 ? 31.4 : 25, n = 0; Z < ZEND - 6; n++) { const len = 3.2 + hash(n, side) * 2.6; stall(side, Z, Z + len, { light: hash(n, side + 9) < 0.25 ? "m" : hash(n, side + 9) < 0.4 ? "v" : "Q", back: hash(n, side + 4) < 0.3 ? "M" : "P" }); Z += len + 0.5 }
    // the plank bridges over the canal: boards across, their gaps, the near ones' ends worn light
    for (const z of [12.4, 19.4, 31, 41, 53, 67, 84]) {
      const nb = 4
      for (let b = 0; b < nb; b++) {
        const za = z + b * 0.3, k = b % 2 ? K.w2 : mix(K.w2, K.w3, 0.4)
        poly3([[-CAN - 0.2, 0.02, za], [CAN + 0.2, 0.02, za], [CAN + 0.2, 0.02, za + 0.26], [-CAN - 0.2, 0.02, za + 0.26]], haze(k, z + 18))
        poly3([[-CAN - 0.2, 0.02, za + 0.26], [CAN + 0.2, 0.02, za + 0.26], [CAN + 0.2, 0.02, za + 0.3], [-CAN - 0.2, 0.02, za + 0.3]], haze(K.w1, z + 18))
      }
    }

    // bare power cables across the canyon, the market's stolen power, and their junction boxes on the galleries' edges
    for (const [z, y0, y1, sag] of [[14.2, 14.3, 13.6, 0.9], [22.5, 19.4, 18.6, 1.3], [36.5, 10.2, 9.6, 0.8], [47.5, 23.9, 23.1, 1.6], [58, 14.9, 14.2, 1.1], [75, 19.3, 18.8, 1.3]]) {
      cable([-GX, y0, z], [GX, y1, z], sag, z < 40 ? K.k : K[1], { bias: 0.1 })
      for (const [sx, yy] of [[-1, y0], [1, y1]]) { const b = P(sx * (GX + 0.05), yy + 0.1, z), w = Math.max(2, R(b.s * 0.35)); rect(R(b.x) - (sx < 0 ? w : 0), R(b.y) - 1, w, w + 1, haze(K[4], b.r), b.r - 0.3); if (w >= 3) put(R(b.x) + (sx < 0 ? -2 : 1), R(b.y), (FR + z) % 6 < 3 ? K.v : K.C, b.r - 0.31) }
    }
    // the feeds down to the stalls: a cable from each near gallery bracket to a tarp's pole
    for (const [sd, z] of [[-1, 18.2], [-1, 23.4], [1, 12.6], [1, 17], [1, 21.2]]) cable([sd * GX, 5.1, z - 0.8], [sd * 6.4, 2.9, z], 0.25, K.k, { bias: -0.35 })

    // the footbridge at the first gallery's height, the market's name on it
    const BZ = 24.6
    poly3([[-GX, 5.5, BZ], [GX, 5.5, BZ], [GX, 5.5, BZ + 1.6], [-GX, 5.5, BZ + 1.6]], (x, y) => (x % 4 === 0 ? haze(K[2], BZ + 13) : haze(K[3], BZ + 13)))
    poly3([[-GX, 5.1, BZ], [GX, 5.1, BZ], [GX, 5.5, BZ], [-GX, 5.5, BZ]], K[2], { bias: -0.05 })
    line3([-GX, 5.3, BZ - 0.01], [GX, 5.3, BZ - 0.01], K.v, { glow: true, bias: -0.1 })
    line3([-GX, 6.5, BZ], [GX, 6.5, BZ], K[5], { bias: -0.1 })
    for (let x = -GX; x <= GX; x += 1.4) line3([x, 5.5, BZ], [x, 6.5, BZ], K[4], { bias: -0.1 })
    for (const x of [-5, 5]) line3([x, 5.5, BZ + 0.8], [x, 6.2, BZ + 0.8], K[3])
    {
      const a = P(-5.9, 11.4, BZ + 0.8), b = P(5.9, 6.2, BZ + 0.8), x0 = R(a.x), x1 = R(b.x), y0 = R(a.y), y1 = R(b.y), d = a.r
      // its glow on the smoke round it, flat
      for (let y = y0 - 14; y < y1 + 12; y++) for (let x = x0 - 16; x < x1 + 16; x++) { const e = Math.max((x0 - x) / 16, (x - x1) / 16, (y0 - y) / 14, (y - y1) / 12); if (e > 0 && e < 1) blend(x, y, K.m, e < 0.45 ? 0.2 : 0.1, d + 1) }
      // the cables it hangs from, up to the third galleries
      for (const [sx, gx] of [[x0 + 8, -GX], [x1 - 8, GX]]) { const g = P(gx, 14.5, BZ + 0.8); line(sx, y0 - 2, g.x, g.y, K.k, d + 0.05) }
      rect(x0 - 2, y0 - 2, x1 - x0 + 4, y1 - y0 + 4, K.k, d); rect(x0, y0, x1 - x0, y1 - y0, K.n, d)
      // the board behind the tubes: its panels' seams, dark
      for (let x = x0 + 30; x < x1 - 4; x += 30) rect(x, y0 + 3, 1, y1 - y0 - 6, "#331038", d)
      for (const [o, k] of [[0, "V"], [2, "v"]]) { rect(x0 + o, y0 + o, x1 - x0 - 2 * o, 1, K[k], d); rect(x0 + o, y1 - 1 - o, x1 - x0 - 2 * o, 1, K[k], d); rect(x0 + o, y0 + o, 1, y1 - y0 - 2 * o, K[k], d); rect(x1 - 1 - o, y0 + o, 1, y1 - y0 - 2 * o, K[k], d) }
      const cx = R((x0 + x1) / 2), kx = TXT.measure("MAR", "nagiwa"), kw = TXT.measure("MARK", "nagiwa")
      // the K of MARKET stutters: dim for one frame, nearly out for the next, then back (the word stays readable)
      const kdim = FR === 7 ? K.M : FR === 8 ? "#6a1a5e" : null
      words(cx, y0 + 6, "DRAIN", K.m, d - 0.01, { n: 2, center: true, core: K.N, under: K.M })
      words(cx, y0 + 25, "MARKET", K.m, d - 0.01, { n: 2, center: true, core: K.N, under: K.M, dim: kdim ? [kx, kw, kdim] : null })
      words(cx, y1 - 9, "NO QUESTIONS", K.v, d - 0.01, { font: "hud", center: true })
      // the sign's magenta on the canal below it is in waterKey; on the bridge's deck in front of it
      for (let x = x0 + 2; x < x1 - 2; x++) blend(x, y1 + 3, K.m, 0.18, d - 1)
    }

    // the drone platform over the crowd beyond the bridge, seen nearly level from up here: a hull with a ring of cyan lights, two rotors
    // on outriggers, a cargo pod hanging under it on a cable, its scan falling on the people in a dithered cone (light falloff) that sweeps
    {
      const p = P(-2.8, 12.2, 40), s = p.s, hw = R(s * 3.2), hh = Math.max(4, R(s * 0.9)), d = p.r, x0 = R(p.x), y0 = R(p.y)
      const f = P(-2.8, 0, 40), sw = R(wave(1) * 3)
      for (let y = y0 + hh; y < R(f.y); y++) { const u = (y - y0) / (f.y - y0), w = R(hw * (0.3 + u * 0.8)); for (let x = -w; x <= w; x++) if (bay(x + 400, y) < 0.42 - u * 0.25) blend(x0 + x + R(sw * u), y, K.v, 0.4, d + 0.5) }
      line(x0, y0 + hh, x0, y0 + hh + R(s * 1.6), K.k, d - 0.1); rect(x0 - 2, y0 + hh + R(s * 1.6), 5, 4, K[4], d - 0.1); rect(x0 - 2, y0 + hh + R(s * 1.6), 5, 1, K[5], d - 0.1)
      put(x0, y0 + hh + R(s * 1.6) + 2, FR % 4 < 2 ? K.V : K.C, d - 0.11)
      for (const sd of [-1, 1]) {
        const rx = x0 + sd * (hw + 4), spin = (FR + (sd > 0 ? 1 : 0)) % 2
        line(x0 + sd * hw, y0 + 1, rx, y0 - 1, K[3], d - 0.05)
        rect(rx - 1, y0 - 2, 3, 3, K[2], d - 0.06); put(rx, y0 - 2, K[5], d - 0.07)
        // the blades as a blur: long one frame, short and faint the next
        if (spin) { rect(rx - 6, y0 - 3, 13, 1, K[6], d - 0.06); rect(rx - 5, y0 - 2, 2, 1, K[5], d - 0.06); rect(rx + 4, y0 - 2, 2, 1, K[5], d - 0.06) }
        else { rect(rx - 4, y0 - 3, 9, 1, K[5], d - 0.06); put(rx - 6, y0 - 3, K[4], d - 0.06); put(rx + 6, y0 - 3, K[4], d - 0.06) }
      }
      rect(x0 - hw - 1, y0 - 1, 2 * hw + 3, hh + 3, K.k, d); rect(x0 - hw, y0, 2 * hw + 1, hh, K[2], d - 0.01); rect(x0 - hw, y0, 2 * hw + 1, 1, K[4], d - 0.01)
      rect(x0 - hw, y0 + hh - 2, 2 * hw + 1, 2, K[1], d - 0.01)                           // the underside, unlit
      // the ring of lights chases round the hull
      for (let x = -hw + 1, n = 0; x < hw; x += 3, n++) put(x0 + x, y0 + hh - 1, (n + FR) % 4 === 0 ? K.V : K.v, d - 0.02)
      rect(x0 - 3, y0 + 1, 7, Math.max(1, hh - 3), K.c, d - 0.02); put(x0, y0 + 1, K.V, d - 0.03); put(x0 - 2 + (FR % 6 < 3 ? 0 : 4), y0 + 2, K.v, d - 0.03)
      put(x0 - hw, y0 + 1, FR % 6 === 0 ? K.V : K.C, d - 0.02); put(x0 + hw, y0 + 1, FR % 6 === 3 ? K.V : K.C, d - 0.02)
    }

    // the crowd beyond the bridge: a river on the bed (its loop starts at 9 m only so its people stay the ones the blocks had)
    let n = 0
    for (let Z = 9; Z < ZEND - 8; Z += Z < 28 ? 0.9 : Z < 50 ? 0.36 : 0.24) for (const side of [-1, 1]) {
      const q = hash(n++, 17), X = side * (CAN + 0.35 + q * 3.5)
      if (Z < 28) continue
      person(X, Z, 0, COATS[R(hash(n, 3) * (COATS.length - 1))], { id: n, accent: ACC[R(hash(n, 4) * 7)], skin: hash(n, 6) < 0.5 ? K.s : K.S })
    }
    // the near bed, from under the picture's bottom edge to the bridge: packed as a night market is, both banks, three abreast every
    // 0.5 m, so it is the busiest part of the picture where the camera stops. Gaps only where a story thing has to read: a person
    // hides what lies up to 1.5 m behind them, so each gap reaches that far in front of its thing.
    const KEEP = [
      [1.5, 4.2, 0, 11.3],          // the stairs down, the red chain on its fence
      [2.9, 9, 11.2, 15.7],         // Ratz on his crate, the JUNK blanket and its sign
      [3.3, 9, 15.6, 19.0],         // the CHROME table
      [3.6, 9, 19.0, 22.0],         // the cooler under KIDNEYS ONLY
      [-9, -3.3, 17.3, 21.4],       // HOT WOK's cart, its stools, the two eating
      [-4.0, -1.4, 19.6, 24.2],     // the preacher on his crate, his flasks, WAKE, a little floor behind him
      [-9, -5.1, 0, 16.6],          // the stairs up: their foot and their edge, all the way up
      [-9, -5, 26, 30],             // Sable's curtain
    ]
    let nn = 0
    for (let Z = 8.4; Z < 28; Z += 0.5) for (const side of [-1, 1]) for (let k = 0; k < 3; k++) {
      const id = 20000 + nn++, X = side * (CAN + 0.3 + (k + 0.05 + hash(id, 17) * 0.9) * 1.17), z = Z + hash(id, 18) * 0.4
      if (KEEP.some(([x0, x1, z0, z1]) => X > x0 && X < x1 && z > z0 && z < z1)) continue
      const bright = hash(id, 19) < 0.1, coat = bright ? COATS_NEAR[COATS.length + 3 + R(hash(id, 3) * 3)] : COATS_NEAR[R(hash(id, 3) * (COATS.length + 2))]
      person(X, z, 0, coat, { id, h: 1.55 + hash(id, 7) * 0.32, w: 0.46 + hash(id, 8) * 0.1, accent: ACC[R(hash(id, 4) * 7)], skin: hash(id, 6) < 0.5 ? K.s : K.S })
    }
    // a few crossing on the near planks: the canal stays the way through
    for (const [z, xs] of [[12.4, [-1.1, 0.9]], [19.4, [-0.4]]]) xs.forEach((x, i) => person(x, z + 0.55, 0.02, COATS_NEAR[R(hash(z * 10, i) * 18)], { id: 30000 + R(z * 10) + i }))
    // people on the planks and in the canal's middle where the planks are
    for (const z of [31, 41, 53, 67]) for (let i = 0; i < 3; i++) person(-1.2 + i * 1.2 + hash(z, i) * 0.4, z + 0.6, 0.02, COATS[(z + i) % 11], { id: z * 7 + i })
    // people on the galleries, leaning on their rails, and on the bridge
    LV.forEach((L, li) => { for (const side of [-1, 1]) for (let Z = 12 + hash(li, side + 2) * 5; Z < ZEND - 10; Z += 2.2 + hash(R(Z), li + side) * 4) person(side * (GX + 0.4), Z, L, COATS[R(hash(R(Z), li) * 11)], { accent: hash(R(Z), li + 3) < 0.3 ? K.m : null }) })
    for (const x of [-6.2, -5.5, 5.2, 6.1]) person(x, BZ + 0.5, 5.5, COATS[R(hash(x * 10, 1) * 11)])

    // ---- the story's places on the bed, near us
    // the stairs up to the alley: a steel flight along the left wall from the bed to a landing on the first gallery, a lit door in the wall
    {
      const S0 = 10, S1 = 16.4, ns = 14
      for (let i = ns - 1; i >= 0; i--) {
        const z0 = S0 + (S1 - S0) * i / ns, z1 = S0 + (S1 - S0) * (i + 1) / ns, y0 = 5.5 * i / ns, y1 = 5.5 * (i + 1) / ns
        poly3([[-7.4, y0, z0], [-5.6, y0, z0], [-5.6, y1, z0], [-7.4, y1, z0]], K[i % 2 ? 4 : 3])
        poly3([[-7.4, y1, z0], [-5.6, y1, z0], [-5.6, y1, z1], [-7.4, y1, z1]], K[5])
        poly3([[-7.4, y1, z0], [-5.6, y1, z0], [-5.6, y1, z0 + 0.06], [-7.4, y1, z0 + 0.06]], K[6], { bias: -0.02 })    // the treads' worn nosing
        poly3([[-6.75, y1, z0 + 0.1], [-6.25, y1, z1 - 0.05], [-6.25, y1, z1 - 0.02], [-6.75, y1, z0 + 0.13]], i % 3 ? K[4] : K.rs, { bias: -0.03 })   // the path worn down the middle
      }
      poly3([[-5.6, 0, S0], [-5.6, 0, S1], [-5.6, 5.5, S1], [-5.6, 0.3, S0]], K[2], { bias: 0.4 })
      // the stringer's bolts, and rust run down from them
      for (let i = 1; i < 7; i++) { const z = S0 + (S1 - S0) * i / 7, y = 5.5 * i / 7 - 0.25; line3([-5.58, y, z], [-5.58, y - 0.5, z], K.rs, { bias: 0.35 }); line3([-5.58, y, z], [-5.58, y, z], K[5], { bias: 0.34 }) }
      line3([-5.5, 1.1, S0], [-5.5, 6.6, S1], K[6]); line3([-5.5, 0, S0], [-5.5, 1.1, S0], K[6]); line3([-5.5, 5.5, S1], [-5.5, 6.6, S1], K[6])
      for (let i = 1; i < 5; i++) { const z = S0 + (S1 - S0) * i / 5, y = 5.5 * i / 5; line3([-5.5, y, z], [-5.5, y + 1.1, z], K[4]) }   // the rail's posts
      poly3([[-GX, 5.5, S1], [-5.6, 5.5, S1], [-5.6, 5.5, S1 + 1.6], [-GX, 5.5, S1 + 1.6]], K[4])
      // the door at the top: the way up, the street's cyan in it, an arrow over it
      poly3([[-WX, 5.5, S1], [-WX, 5.5, S1 + 1.4], [-WX, 7.8, S1 + 1.4], [-WX, 7.8, S1]], K.c, { glow: true, bias: -0.1 })
      poly3([[-WX, 5.5, S1 + 0.25], [-WX, 5.5, S1 + 1.15], [-WX, 7.4, S1 + 1.15], [-WX, 7.4, S1 + 0.25]], K.C, { glow: true, bias: -0.15 })
      const ar = P(-WX + 0.05, 8.4, S1 + 0.7)
      words(ar.x - 6, R(ar.y), "UP", K.v, ar.r - 0.3, { font: "hud" }); line(ar.x + 3, ar.y + 4, ar.x + 3, ar.y, K.v, ar.r - 0.3); line(ar.x + 2, ar.y + 1, ar.x + 4, ar.y + 1, K.v, ar.r - 0.3)
      // the door's cyan spills on the landing in front of it, falling off
      const dl = P(-WX + 0.6, 5.5, S1 + 0.7)
      for (let j = -3; j <= 3; j++) for (let i = 0; i < 10; i++) if (bay(i, j + 8) < 0.5 - i / 20) blend(R(dl.x) + i, R(dl.y) + j, K.C, 0.35, dl.r - 1.5)
    }
    // the stairs down (Chapter 2): an opening in the bed on the right, steps into the dark, a faint cyan far below; a chain with a red tag across
    {
      const X0 = 2.0, X1 = 3.7, Z0 = 9.3, Z1 = 11.2
      poly3([[X0, 0.01, Z0], [X1, 0.01, Z0], [X1, 0.01, Z1], [X0, 0.01, Z1]], K.k)
      for (let i = 0; i < 5; i++) { const z = Z0 + 0.2 + i * 0.36; poly3([[X0 + 0.15, 0.02, z], [X1 - 0.15, 0.02, z], [X1 - 0.15, 0.02, z + 0.2], [X0 + 0.15, 0.02, z + 0.2]], K[i < 3 ? 3 : 2]); poly3([[X0 + 0.15, 0.02, z], [X1 - 0.15, 0.02, z], [X1 - 0.15, 0.02, z + 0.04], [X0 + 0.15, 0.02, z + 0.04]], K[i < 3 ? 4 : 3], { bias: -0.01 }) }
      { const p = P((X0 + X1) / 2, 0, Z1 - 0.25); rect(R(p.x) - 6, R(p.y) - 2, 12, 2, K.c, p.r - 0.1); rect(R(p.x) - 3, R(p.y) - 2, 4, 1, K.C, p.r - 0.11) }
      // the hole's lip: a steel kerb round it
      for (const [a, b] of [[[X0, Z0], [X1, Z0]], [[X0, Z0], [X0, Z1]], [[X1, Z0], [X1, Z1]], [[X0, Z1], [X1, Z1]]]) line3([a[0], 0.03, a[1]], [b[0], 0.03, b[1]], K[5], { bias: -0.05 })
      for (const [a, b] of [[[X0, 0, Z0], [X1, 0, Z0]], [[X0, 0, Z0], [X0, 0, Z1]], [[X1, 0, Z0], [X1, 0, Z1]]]) {
        line3([a[0], 0.8, a[2]], [b[0], 0.8, b[2]], K[5], { bias: -0.3 })
        line3([a[0], 0.4, a[2]], [b[0], 0.4, b[2]], K[4], { bias: -0.3 })
      }
      for (const [x, z] of [[X0, Z0], [X1, Z0], [X0, Z1], [X1, Z1]]) { line3([x, 0, z], [x, 0.8, z], K[4], { bias: -0.3 }); line3([x, 0.8, z], [x, 0.8, z], K[6], { bias: -0.31 }) }
      const a = P(X0, 0.6, Z0), b = P(X1, 0.6, Z0)
      for (let x = R(a.x); x <= R(b.x); x++) { const u = (x - a.x) / (b.x - a.x); put(x, R(a.y + Math.sin(u * Math.PI) * 3), x % 2 ? K[6] : K[4], a.r - 0.5) }
      rect(R((a.x + b.x) / 2) - 4, R(a.y) + 2, 8, 6, K.k, a.r - 0.6); rect(R((a.x + b.x) / 2) - 3, R(a.y) + 3, 6, 4, K.r, a.r - 0.61); rect(R((a.x + b.x) / 2) - 2, R(a.y) + 4, 4, 1, K.q, a.r - 0.62)
    }
    // Ratz: a blanket of junk on the bed in front of his stall (from up here, what lies on the ground reads best), Ratz on a crate at its
    // near corner facing the walk (a cable rat the size of a small dog: headphones with a cyan light, the patched collar, the tail hanging)
    {
      poly3([[3.2, 0.02, 12.2], [5.7, 0.02, 12.2], [5.7, 0.02, 15.4], [3.2, 0.02, 15.4]], K.b2, { bias: 0.2 })
      poly3([[3.2, 0.02, 12.2], [5.7, 0.02, 12.2], [5.7, 0.02, 12.5], [3.2, 0.02, 12.5]], "#4a78a8", { bias: 0.15 })
      // the blanket's folds and its wet dark corner
      for (const z of [13.4, 14.5]) poly3([[3.2, 0.02, z], [5.7, 0.02, z + 0.15], [5.7, 0.02, z + 0.22], [3.2, 0.02, z + 0.07]], K.b1, { bias: 0.18 })
      for (let i = 0; i < 22; i++) {
        const X = 3.4 + hash(i, 41) * 2.1, Z = 12.9 + hash(i, 42) * 2.3, q = hash(i, 43), p = P(X, 0.03, Z), w = Math.max(2, R(p.s * (0.2 + hash(i, 44) * 0.2))), h = Math.max(1, R(w * 0.6))
        const k = q < 0.35 ? K.v : q < 0.55 ? K.C : q < 0.75 ? "#3f8a58" : q < 0.9 ? K.G : K.Q
        rect(R(p.x) - 1, R(p.y) - 1, w + 2, h + 2, K.k, p.r - 0.1); rect(R(p.x), R(p.y), w, h, k, p.r - 0.11)
        if (w >= 3) rect(R(p.x), R(p.y) + h - 1, w, 1, mix(k, K.k, 0.4), p.r - 0.115)          // each piece's shadow side
        if (q < 0.35 && w > 3) put(p.x + 1, p.y, (FR + i) % 6 < 4 ? K.V : K.v, p.r - 0.12)      // a screen still alive in the junk
      }
      for (let i = 0; i < 4; i++) { const a = P(3.4 + hash(i, 51) * 2, 0.03, 13.0 + i * 0.55), b = P(3.4 + hash(i, 52) * 2, 0.03, 13.3 + i * 0.55); line(a.x, a.y, b.x, b.y + 2, K.k, a.r - 0.12) }
      box3(3.3, 4.0, 0, 0.6, 12.25, 12.85, "w3", "w2", "w1")
      { const c0 = P(3.3, 0.3, 12.25), c1 = P(4.0, 0.3, 12.25); line(c0.x + 1, c0.y, c1.x - 1, c1.y, K.w1, c0.r - 0.35) }   // the crate's slat
      const p = P(3.65, 0.6, 12.55), s = p.s, d = p.r - 0.6, w = R(s * 0.7), h = R(s * 0.36), x0 = R(p.x - w / 2) + 2, y0 = R(p.y) - h
      rect(x0 - 1, y0 - 1, w + 2, h + 2, K.k, d); rect(x0, y0, w, h, K[6], d); rect(x0, y0, w, 1, K.G, d); rect(x0, y0 + h - 1, w, 1, K[5], d)   // the body
      const nod = FR >= 8 && FR < 10 ? 1 : 0                                                                         // he nods to what he hears
      rect(x0 - 6, y0 + 1 + nod, 7, h - 2, K.k, d); rect(x0 - 5, y0 + 2 + nod, 6, h - 4, K[6], d); put(x0 - 6, y0 + 2 + nod, K.S, d); put(x0 - 3, y0 + 2 + nod, K.k, d)   // the head, the nose, the eye
      rect(x0 - 2, y0 - 3 + nod, 4, 4, K.k, d); rect(x0 - 1, y0 - 2 + nod, 2, 2, K.S, d)                             // a round ear
      rect(x0 - 4, y0 - 4 + nod, 7, 1, K.k, d); rect(x0 - 4, y0 - 3 + nod, 1, 3, K.k, d); put(x0 + 2, y0 - 3 + nod, FR % 4 < 2 ? K.v : K.C, d)   // the headphones and their light
      rect(x0 + 1, y0, 2, h, K.rz, d)                                                                               // the collar
      const sway = FR % 6 < 3 ? 0 : 1
      for (let i = 0; i < 14; i++) put(x0 + w + (i < 3 ? i : 2) + (i > 9 ? i - 9 + sway : 0), y0 + h - 1 + Math.min(i, 10), K[5], d)   // the tail down the crate
      line3([5.6, 0, 12.3], [5.6, 2.2, 12.3], K[4], { bias: -2 })
      const sg = P(5.6, 2.2, 12.3); words(sg.x - 8, R(sg.y) - 3, "JUNK", K.v, sg.r - 2, { font: "hud", under: K.k })
    }
    // the jars of used implants on a trestle table in front of their stall, seen from above: rows of lids, a cyan glint in each that moves
    {
      box3(3.9, 5.4, 0, 0.9, 16.5, 18.8, "w2", "w1", "w1")
      for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) {
        const p = P(4.1 + i * 0.36, 0.9, 16.7 + j * 0.42), w = Math.max(2, R(p.s * 0.24)), glint = (FR + i * 3 + j * 5) % 12 < 2
        rect(R(p.x) - 1, R(p.y) - w, w + 2, w + 1, K.k, p.r - 0.3); rect(R(p.x), R(p.y) - w + 1, w, w - 1, hash(i, j + 60) < 0.5 ? K.C : K.c, p.r - 0.31)
        put(p.x + (j % 2), p.y - w + 1, glint ? K.W : hash(i, j + 61) < 0.6 ? K.v : K.V, p.r - 0.32)
        if (w >= 4) put(p.x + w - 1, p.y - 1, "#3f8a58", p.r - 0.32)        // something floating in it
      }
      line3([5.3, 0.9, 16.5], [5.3, 2.1, 16.5], K[4], { bias: -0.3 })
      const sg = P(5.3, 2.1, 16.5); words(sg.x - 11, R(sg.y) - 3, "CHROME", K.v, sg.r - 0.4, { font: "hud", under: K.k })
    }
    // KIDNEYS ONLY: a board on poles over the organ stall, facing the walk; a cooler box on the ground in front, its little display
    { const a = P(4.0, 4.6, 20.6), b = P(6.9, 3.2, 20.6), x0 = R(a.x), y0 = R(a.y), x1 = R(b.x) + 6, y1 = R(b.y), d = a.r - 0.8
      for (let y = y0 - 5; y < y1 + 5; y++) for (let x = x0 - 6; x < x1 + 6; x++) { const e = Math.max((x0 - x) / 6, (x - x1) / 6, (y0 - y) / 5, (y - y1) / 5); if (e > 0 && e < 1) blend(x, y, K.m, 0.12, d + 0.5) }
      rect(x0 - 1, y0 - 1, x1 - x0 + 2, y1 - y0 + 2, K.k, d); rect(x0, y0, x1 - x0, y1 - y0, K.n, d); rect(x0, y0, x1 - x0, 1, K.m, d); rect(x0, y1 - 1, x1 - x0, 1, K.m, d)
      words(R((x0 + x1) / 2) + 1, y0 + 3, "KIDNEYS", K.N, d - 0.01, { font: "hud", center: true }); words(R((x0 + x1) / 2) + 1, y0 + 10, "ONLY", K.m, d - 0.01, { font: "hud", center: true })
      for (const xx of [x0 + 2, x1 - 3]) line(xx, y1, xx, R(P(5.3, 2.4, 20.6).y), K[4], d + 0.01)
      box3(4.2, 5.2, 0, 0.6, 21.0, 21.8, "H", "h", "h")
      { const t0 = P(4.2, 0.6, 21.0), t1 = P(5.2, 0.6, 21.0); line(t0.x, t0.y, t1.x, t1.y, K.G, t0.r - 0.45) }   // the lid's seam
      const q = P(4.5, 0.4, 21.0); rect(R(q.x) - 1, R(q.y) - 1, 5, 3, K.k, q.r - 0.4); rect(R(q.x), R(q.y), 3, 1, FR % 12 < 9 ? K.v : K.C, q.r - 0.41)
      put(R(q.x) + 4, R(q.y) + 2, K.c, q.r - 0.41)
      // the ice's melt run out from under it
      const m = P(4.6, 0.01, 20.85); rect(R(m.x) - 2, R(m.y), 6, 1, K.e, m.r - 0.05) }
    // the food cart in front of its stall: the wok's fire on it, a pot, steam rising and spreading, two stools with two eating; its sign on a pole
    {
      box3(-5.6, -4.0, 0, 1.0, 18.6, 20.8, "1", "P", "O")
      { const a = P(-5.6, 0.75, 18.6), b = P(-4.0, 0.75, 18.6); line(a.x, a.y, b.x, b.y, K.O, a.r - 0.35) }    // the cart's front, a seam of grease
      const p = P(-4.8, 1.0, 19.3), fw = Math.max(3, R(p.s * 0.4))
      // the fire licks up under the wok, changing every frame
      for (let i = -fw; i <= fw; i++) { const tall = R(2 + hash(i + 9, 77 + FR) * fw * 0.9 * (1 - Math.abs(i) / (fw + 1))); for (let j = 0; j < tall; j++) put(p.x + i, p.y - 1 - j, j === tall - 1 ? K.P : j > tall * 0.5 ? K.Q : (i + j + FR) % 2 ? K.R : K.W, p.r - 0.35) }
      rect(R(p.x) - fw - 1, R(p.y) - 1, 2 * fw + 3, 2, K.k, p.r - 0.36); rect(R(p.x) - fw + 1, R(p.y) + 1, 2 * fw - 1, 1, K.k, p.r - 0.36)
      rect(R(p.x) - fw, R(p.y) - 1, 2 * fw + 1, 1, K[4], p.r - 0.37)                       // the wok's lit rim
      line(p.x + fw + 1, p.y - 1, p.x + fw + 5, p.y - 3, K[5], p.r - 0.36)
      const q = P(-4.5, 1.0, 20.3); rect(R(q.x) - 3, R(q.y) - 4, 7, 4, K[4], q.r - 0.3); rect(R(q.x) - 3, R(q.y) - 4, 7, 1, K[6], q.r - 0.31)
      // the fire's light on the street in front of the cart
      const fl = P(-4.0, 0, 19.6)
      for (let j = 0; j < 6; j++) for (let i = -6; i <= 8; i++) if (bay(i + 8, j) < 0.45 - Math.hypot(i / 9, j / 6) * 0.45) blend(R(fl.x) + i, R(fl.y) + j, K.Q, 0.3, fl.r - 1)
      // the steam: puffs rising from the wok, growing and thinning, one more born as the last fades, so the loop closes
      const NP = 8
      for (let i = 0; i < NP; i++) {
        const u = (i + PH) / NP, st = P(-4.7 - u * 1.2 + Math.sin(u * 5 + i) * 0.12, 1.4 + u * 5.2, 19.5 + u * 1.6), r = 2 + u * 4.5, f = u < 0.2 ? 0.55 : u < 0.45 ? 0.42 : u < 0.7 ? 0.28 : 0.14
        for (let jj = -R(r); jj <= R(r); jj++) for (let ii = -R(r) - 1; ii <= R(r) + 1; ii++) { const e = Math.hypot(ii / (r + 1), jj / r); if (e <= 1) blend(st.x + ii, st.y + jj, u < 0.35 ? K.H : K.h, e < 0.6 ? f : f * 0.45, st.r - 1) }
      }
      line3([-4.0, 1.0, 18.6], [-4.0, 2.3, 18.6], K[4], { bias: -0.3 })
      const sg = P(-4.0, 2.3, 18.6); words(sg.x - 2, R(sg.y) - 3, "HOT WOK", K.R, sg.r - 0.4, { font: "hud", under: K.k })
      for (const z of [19.1, 20.2]) box3(-3.75, -3.45, 0, 0.45, z, z + 0.3, "4", "3", "2")
      person(-3.6, 19.5, 0.45, "o", { h: 1.25, id: 9001, kind: "bare" }); person(-3.6, 20.6, 0.45, "L", { h: 1.25, accent: K.v, id: 9002, kind: "hood" })
    }
    // Sable's curtain: in the face of one of the channel's piers, so it faces whoever comes down the walk; plum, heavy, the market's
    // magenta leaking past its edge and under its hem, stuttering as the booth's own neon does behind it (art/rooms/sable_booth.px.js)
    {
      box3(-9, -5.9, 0, 5.1, 29.0, 30.8, "3", "l", "3")
      const MAGF = [1, 1, 1, 1, 1, 1, 1, 0.15, 0.55, 1, 1, 1], mag = MAGF[FR]
      const PZ = 28.98, c0 = P(-8.3, 2.7, PZ), c1 = P(-6.6, 0, PZ), lk = mag > 0.9 ? K.m : mag > 0.4 ? K.M : K.n
      // the pier's own marks: the tide line across it, a poster half torn off
      { const t0 = P(-9, 3.6, PZ), t1 = P(-5.9, 3.6, PZ); line(t0.x, t0.y + 1, t1.x, t1.y + 1, K.l2, t0.r - 0.35) }
      { const pp = P(-6.4, 4.3, PZ); rect(R(pp.x) - 1, R(pp.y), 3, 4, "#5a4e44", pp.r - 0.35); rect(R(pp.x) - 1, R(pp.y) + 2, 2, 2, K.M, pp.r - 0.36) }
      rect(R(c0.x) - 1, R(c0.y) - 1, R(c1.x - c0.x) + 2, R(c1.y - c0.y) + 1, mag > 0.4 ? K.M : K.n, c0.r - 0.4)
      rect(R(c0.x), R(c0.y), R(c1.x - c0.x), R(c1.y - c0.y) - 1, (i, j) => (j === 0 ? K.Kc : i % 3 === 2 ? K.Kc : i % 3 === 1 ? K.B : K.J), c0.r - 0.41)
      rect(R(c1.x) - 1, R(c0.y) + 2, 1, R(c1.y - c0.y) - 3, lk, c0.r - 0.42); rect(R(c0.x), R(c1.y) - 1, R(c1.x - c0.x), 1, lk, c0.r - 0.42)
      // the light under the hem spills on the bed in front, falling off
      if (mag > 0.4) for (let j = 0; j < 4; j++) for (let i = -1; i < R(c1.x - c0.x) + 2; i++) if (bay(i + 4, j) < (0.5 - j * 0.12) * mag) blend(R(c0.x) + i, R(c1.y) + j, K.m, 0.3, c0.r - 1)
      const t0 = P(-9, 3.6, PZ), t1 = P(-5.9, 3.6, PZ); line(t0.x, t0.y, t1.x, t1.y, K.L, t0.r - 0.4)
    }
    // the preacher of the Wache Kirche on his crate by the canal: thin, his hand raised, his gecko eyes, a placard, two thermos flasks by
    // the crate (his coffee for the night); nobody stops
    {
      const cz = 22.4, cx = -2.5, a = P(cx - 0.35, 0.6, cz), b = P(cx + 0.35, 0, cz)
      rect(R(a.x) - 1, R(a.y) - 1, R(b.x - a.x) + 2, R(b.y - a.y) + 2, K.k, a.r + 0.01)
      rect(R(a.x), R(a.y), R(b.x - a.x), R(b.y - a.y), K.w2, a.r); rect(R(a.x), R(a.y), R(b.x - a.x), 1, K.w3, a.r); rect(R(a.x), R(a.y) + R((b.y - a.y) / 2), R(b.x - a.x), 1, K.w1, a.r)
      for (const [fx, fz, fk, ck] of [[cx + 0.55, cz - 0.1, K.G, K[1]], [cx + 0.75, cz + 0.05, "#45604f", K[2]]]) {
        const t = P(fx, 0.38, fz), bt = P(fx, 0, fz), fw = Math.max(2, R(t.s * 0.13)), d = t.r - 0.2
        rect(R(t.x) - 1, R(t.y) - 1, fw + 2, R(bt.y - t.y) + 2, K.k, d + 0.01); rect(R(t.x), R(t.y), fw, R(bt.y - t.y), fk, d)
        rect(R(t.x), R(t.y), fw, 1, ck, d - 0.01); put(R(t.x), R(t.y) + 2, mix(fk, K.W, 0.4), d - 0.01)   // the cap, a glint down its side
      }
      const pp = person(cx, cz, 0.6, "pr", { raise: true, skin: K.S, w: 0.4, id: 9003, kind: "bare", hair: K.hr2, still: true })
      put(pp.x - 1, pp.y - pp.hpx + 1, "#c8e050", pp.d - 0.02); put(pp.x + 1, pp.y - pp.hpx + 1, "#c8e050", pp.d - 0.02)
      const pl = P(cx - 0.9, 1.0, cz - 0.2); rect(R(pl.x) - 10, R(pl.y) - 6, 21, 8, K.k, pl.r - 0.4); rect(R(pl.x) - 9, R(pl.y) - 5, 19, 6, K.pr2, pl.r - 0.41)
      words(R(pl.x), R(pl.y) - 4, "WAKE", K.k, pl.r - 0.42, { font: "hud", center: true })
      line(R(pl.x) + 6, R(pl.y) + 2, R(pl.x) + 8, R(pl.y) + 6, K.w1, pl.r - 0.39)                     // its stick
    }

    // the lantern strings across and along the galleries' edges
    for (const [zs, ys, sag] of STRINGS) {
      const nn = 60, pts = []
      for (let i = 0; i <= nn; i++) { const u = i / nn, X = -GX - 0.1 + u * (2 * GX + 0.2), Y = ys - Math.sin(u * Math.PI) * sag + (u - 0.5) * 0.6; pts.push([X, Y, zs]) }
      for (let i = 0; i < nn; i++) line3(pts[i], pts[i + 1], K.k, { bias: 0.05 })
    }
    for (const L of LANTERNS) lantern(L)
    for (const side of [-1, 1]) {
      const pts = []
      for (let z = 8.6; z <= 24.6; z += 0.25) pts.push([side * 6.85, 5.0 - Math.abs(Math.sin((z - 8.6) / 3.2 * Math.PI)) * 0.5, z])
      for (let i = 0; i + 1 < pts.length; i++) line3(pts[i], pts[i + 1], K.k, { bias: 0.05 })
      for (let i = 2; i < pts.length; i += 3) lantern({ X: pts[i][0], Y: pts[i][1] - 0.25, Z: pts[i][2], id: 5000 + side * 100 + i, cord: [pts[i][0], pts[i][1]] })
    }

    // birds on the nearest cable at the top; one of them looks down, then back
    {
      const za = 10.5, ya = 16.4, yAt = (xb) => ya + 0.3 - (xb + GX) / (2 * GX) * 0.5
      line3([-GX, yAt(-GX), za], [GX, yAt(GX), za], K.k, { bias: -0.5 })
      ;[-4.6, -4.1, -3.7, 2.2, 3.1].forEach((xb, bi) => {
        const p = P(xb, yAt(xb), za), d = p.r - 0.6, look = bi === 1 && FR >= 5 && FR < 9 ? 1 : 0
        rect(R(p.x) - 2, R(p.y) - 4, 4, 4, K.k, d); rect(R(p.x) - 1 + look, R(p.y) - 6 + look, 3, 2, K.k, d); put(p.x - 3, p.y - 2, K.k, d); put(p.x + 1 + look, p.y - 5 + look, K[4], d)
      })
    }

    // light shafts from the slit and the underside's grates, flat lighter bands through the smoke behind the bridge
    for (const [xt, xb, wt, wb, dmin] of [[150, 112, 6, 30, 40], [178, 204, 5, 26, 40], [60, 92, 6, 22, 36]]) {
      for (let y = 0; y < 230; y++) { const u = y / 230, xc = xt + (xb - xt) * u, w = wt + (wb - wt) * u; for (let x = R(xc - w); x <= R(xc + w); x++) blend(x, y, K.N, Math.abs(x - xc) < w * 0.5 ? 0.12 : 0.06, dmin) }
    }
    // the smoke of the cooking hanging in the lantern light, in flat wisps drifting a few pixels through the loop
    for (const [cx, cy, hw, hh, dmin, k] of [[120, 150, 70, 5, 30, K.hz2], [220, 172, 60, 4, 28, K.hz2], [90, 205, 50, 4, 22, K.P], [210, 228, 55, 4, 20, K.P], [60, 262, 40, 5, 17, K.hz], [250, 250, 45, 4, 18, K.hz]]) {
      const ox = R(wave(1, cx) * 3)
      for (let y = cy - hh; y <= cy + hh; y++) for (let x = cx - hw; x <= cx + hw; x++) {
        const e = Math.hypot((x - cx - ox) / hw, (y - cy) / hh)
        if (e < 1) blend(x, y, k, e < 0.55 ? 0.1 : 0.05, dmin)
      }
    }

    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, col[y * W + x])
  }
  return { W, H, paint, P }
})()

anim("drain_arrival_bg", { w: DA.W, h: DA.H, frames: 12, fps: 10 }, DA.paint)

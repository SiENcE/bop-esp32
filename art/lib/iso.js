// Glass Sister's isometric kit (style guide §4, §5, §7, §12): the world palette and the helpers every
// street-mode room is drawn with, taken from the approved mockup art/mockups/mock_c_iso.px.js
// (which stays as it is). Include it from a room file with its palette:
//
//   include("../lib/iso.js", { palette: true })     // the world palette + ramps, then your own pal() adds keys
//   const R = ISO.room({ CX: 168, CY: 56 })          // (CX, CY): the back corner at the foot of the walls
//
// Everything lives in the one object ISO (pxl's included files share one scope, so a room keeps
// its own names in a block or prefixed). What it holds:
//
//   ISO.fl, ISO.bay(x, y), ISO.BAY      floor, the 4x4 Bayer threshold (0..1) for light falloff only
//   ISO.ihash(a, b)                     a repeatable hash in 0..1 (a cause's pick, never texture)
//   ISO.lineCells(x0, y0, x1, y1)       the cells of a straight line
//   ISO.flat(c, hf)                     an elevation: x along the wall, e up from the foot (row hf - 1);
//                                       rect, hl, vl, px, text, ell, line, is, all in (x, e)
//   ISO.halo(F, [x, e, w, h], r, map, p) light from a lit rectangle tinting a wall round it, dithered off
//                                       over r px: map = { fromKey: toKey } (only keys in it change)
//   ISO.SHEEN, ISO.MIRROR               wet ground: what dry paving takes from a bright key above it,
//                                       what a puddle mirrors (key of the pixel mirrored -> key)
//   ISO.pen(c, ox, oy)                  a drawing pen in ROOM coordinates over a canvas whose top-left
//                                       is (ox, oy) in the room: props are drawn where they stand in
//                                       the room and land in their own small sprite. Every op goes
//                                       through px (px, rect, hline, vline, line, ellipse, grid, is, key)
//   ISO.measure()                       the same pen, drawing nothing: .box() is the bounding box
//                                       [x, y, w, h] of all it was asked to paint (a prop's sprite size)
//   ISO.rain(n, len, k, seed, W, H, NF) a layer function: rain streaks falling top-left to bottom-right
//
//   ISO.room({ CX, CY }) -> R, the projection of one room (2:1, u along the right wall, v along the
//   left wall, h up; 1 m = 16 units of u or v, 18 px of h):
//     R.P(u, v, h)        -> [x, y] on the screen
//     R.uvAt(x, y, h)     -> [u, v] of a screen point at height h
//     R.ybase(x)          the foot of the back walls in column x
//     R.atR(ux, e)        a flat point of the right wall (ux px from the corner) on the screen
//     R.atL(lx, e)        a flat point of the left wall (lx its screen x) on the screen
//     R.isoBox(c, u0, v0, h0, du, dv, dh, top(u, v), front(a, e), side(b, e))
//                         a box standing on the floor: its top, its +v face (toward the lower left,
//                         parallel to the right wall) and its +u face (toward the lower right,
//                         parallel to the left wall), each painted by a function of its own flat
//                         coordinates (a, b px from the face's left edge, e up from its foot); a
//                         function returning null leaves that pixel
//     R.wallL(name, len, hf, draw(F, c))  defines the part sprite of the left wall's inner face, an
//                         elevation `len` px long (x 0 at its far end, len - 1 at the corner), hf rows
//                         tall, sheared onto the slope; returns (c) => stamps it in place
//     R.wallR(name, len, hf, draw(F, c))  the same for the right wall (x 0 at the corner)
//     R.planeR(c), R.planeL(c, len)       a sheared pen on a wall plane, in the walls' flat coordinates
//                         (x, e): px, rect, hl, vl, line, grid, is. For animated things on a wall
//                         (a window's view) drawn in a prop of their own over the background

const ISO = (() => {
  const fl = Math.floor
  const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
  const bay = (x, y) => (BAY[(y & 3) * 4 + (x & 3)] + 0.5) / 16
  const ihash = (a, b = 0) => { let q = (a * 374761393 + b * 668265263) | 0; q = (q ^ (q >>> 13)) * 1274126177; return ((q ^ (q >>> 16)) >>> 0) / 4294967296 }
  const lineCells = (x0, y0, x1, y1) => {
    const out = [], n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))
    if (n === 0) return [[Math.round(x0), Math.round(y0)]]
    for (let i = 0; i <= n; i++) out.push([Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n)])
    return out
  }

  // Drawing an elevation: e counts up from the foot (row hf - 1).
  const flat = (c, hf) => ({
    rect: (x, e, w, h, k) => c.rect(x, hf - e - h, w, h, k),
    hl: (x, e, w, k) => c.hline(x, hf - 1 - e, w, k),
    vl: (x, e, h, k) => h > 0 && c.vline(x, hf - e - h, h, k),
    px: (x, e, k) => c.px(x, hf - 1 - e, k),
    text: (x, eTop, s, k, o) => c.text(x, hf - 1 - eTop, s, k, o),
    ell: (x, e, rx, ry, k) => c.ellipse(x, hf - 1 - e, rx, ry, k),
    line: (x0, e0, x1, e1, k) => c.line(x0, hf - 1 - e0, x1, hf - 1 - e1, k),
    is: (x, e, k) => c.is(x, hf - 1 - e, k),
  })
  // light from a lit rectangle tinting the wall round it, dithered off over `r` px
  const halo = (F, [x0, e0, w, h], r, map, p = 0.85) => {
    for (let x = x0 - r; x < x0 + w + r; x++) for (let e = Math.max(0, e0 - r); e < e0 + h + r; e++) {
      const dx = Math.max(x0 - x, 0, x - (x0 + w - 1)), de = Math.max(e0 - e, 0, e - (e0 + h - 1)), d = Math.hypot(dx, de)
      if (d === 0 || d > r || bay(x, e) > p * (1 - d / r)) continue
      for (const [from, to] of Object.entries(map)) if (F.is(x, e, from)) { F.px(x, e, to); break }
    }
  }
  // what a wet floor mirrors: bright keys only on the open floor, everything in a puddle
  const SHEEN = { m: "I", N: "I", M: "i", v: "T", V: "T", C: "t", Q: "A", R: "A", W: "A", P: "a" }
  const MIRROR = { m: "M", N: "m", M: "n", n: "i", v: "C", V: "v", C: "c", c: "t", Q: "O", R: "P", W: "Q", P: "O", O: "a",
    q: "r", 6: "4", 5: "3", 4: "2", 3: "2", 2: "1" }

  // A pen in room coordinates. put(x, y, k) paints, get(x, y) reads a key (or null).
  const makePen = (put, get) => {
    const p = {
      px: (x, y, k) => { if (k) put(Math.round(x), Math.round(y), k) },
      rect: (x, y, w, h, k) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) p.px(x + i, y + j, k) },
      hline: (x, y, w, k) => p.rect(x, y, w, 1, k),
      vline: (x, y, h, k) => p.rect(x, y, 1, h, k),
      line: (x0, y0, x1, y1, k) => { for (const [x, y] of lineCells(x0, y0, x1, y1)) p.px(x, y, k) },
      ellipse: (cx, cy, rx, ry, k) => {
        for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++)
          if ((x / (rx + 0.5)) ** 2 + (y / (ry + 0.5)) ** 2 <= 1) p.px(cx + x, cy + y, k)
      },
      // rows of keys, "." skipped; map renames keys (a grid drawn in one colour: { "#": "k" })
      grid: (x, y, rows, map = {}) => rows.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== ".") p.px(x + i, y + j, map[ch] ?? ch) })),
      is: (x, y, keys) => { const k = get(x, y); return !!k && keys.includes(k) },
      key: (x, y) => get(x, y),
    }
    return p
  }
  const pen = (c, ox = 0, oy = 0) => makePen((x, y, k) => c.px(x - ox, y - oy, k), (x, y) => c.key(x - ox, y - oy))
  const measure = () => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    const m = makePen((x, y) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }, () => null)
    m.box = () => [x0, y0, x1 - x0 + 1, y1 - y0 + 1]
    return m
  }

  // rain streaks: diagonal, top-left to bottom-right, looping over NF frames
  const rain = (n, len, k, seed, W, H, NF) => (c) => {
    const f = c.frame ?? 0, r = c.rng(seed)
    for (let i = 0; i < n; i++) {
      const x0 = r() * (W + 60), ph = r(), p = (ph + f / NF) % 1
      const x = Math.round(x0 - p * 52), y = Math.round(-8 - len + p * (H + 16 + len))
      c.line(x, y, x + Math.round(len / 4), y - len, k)
    }
  }

  function room({ CX, CY }) {
    const P = (u, v, h = 0) => [CX + 2 * u - 2 * v, CY + u + v - h]
    const ybase = (x) => CY + (x >= CX ? fl((x - CX) / 2) : fl((CX - x) / 2))
    const uvAt = (x, y, h = 0) => { const d = (x - CX) / 2, s = y - CY + h; return [(s + d) / 2, (s - d) / 2] }
    const atR = (ux, e) => [CX + ux, CY + fl(ux / 2) - e]
    const atL = (lx, e) => [lx, CY + fl((CX - lx) / 2) - e]

    function isoBox(c, u0, v0, h0, du, dv, dh, top, front, side) {
      const x0 = P(u0, v0 + dv)[0], x1 = P(u0 + du, v0)[0], y0 = P(u0, v0, h0 + dh)[1], y1 = P(u0 + du, v0 + dv, h0)[1]
      const V = v0 + dv, U = u0 + du
      for (let y = y0; y <= y1; y++) for (let x = x0; x < x1; x++) {
        const d = (x - CX) / 2, s = y - CY + h0 + dh, tu = (s + d) / 2, tv = (s - d) / 2
        if (tu >= u0 && tu < U && tv >= v0 && tv < V) { const k = top && top(tu - u0, tv - v0); if (k) c.px(x, y, k); continue }
        const fa = x - (CX + 2 * u0 - 2 * V), fe = CY + fl(d) + 2 * V - y - h0
        if (fa >= 0 && fa < 2 * du && fe >= 0 && fe < dh) { const k = front && front(fa, fe); if (k) c.px(x, y, k); continue }
        const sb = x - (CX + 2 * U - 2 * V), se = CY + 2 * U + fl(-d) - y - h0
        if (sb >= 0 && sb < 2 * dv && se >= 0 && se < dh) { const k = side && side(sb, se); if (k) c.px(x, y, k); continue }
        // the top's near edges: on even columns a pixel there lies exactly on tv = V (or tu = U), in
        // neither the top nor a face; it belongs to the top (else what is behind shows through as dots)
        if ((fa >= 0 && fa < 2 * du && fe === dh) || (sb >= 0 && sb < 2 * dv && se === dh)) {
          const k = top && top(Math.min(Math.max(tu - u0, 0), du - 0.25), Math.min(Math.max(tv - v0, 0), dv - 0.25))
          if (k) c.px(x, y, k)
        }
      }
    }

    // the walls' inner faces as elevations, sheared onto the slope (the mockup's _wallL / _wallR)
    function wallL(name, len, hf, draw) {
      sprite(name, { w: len, h: hf + (len >> 1) + 1 }, (c) => { draw(flat(c, hf), c); c.warp((x) => [0, fl((len - x) / 2)]) })
      return (c) => c.stamp(name, CX - len, CY - (hf - 1))
    }
    function wallR(name, len, hf, draw) {
      sprite(name, { w: len, h: hf + (len >> 1) + 1 }, (c) => { draw(flat(c, hf), c); c.warp((x) => [0, fl(x / 2)]) })
      return (c) => c.stamp(name, CX, CY - (hf - 1))
    }
    // a pen on a wall plane in its flat coordinates (c: a canvas or a pen in room coordinates)
    const plane = (c, map) => {
      const F = {
        px: (x, e, k) => { if (k) { const [X, Y] = map(x, e); c.px(X, Y, k) } },
        rect: (x, e, w, h, k) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) F.px(x + i, e + j, k) },
        hl: (x, e, w, k) => F.rect(x, e, w, 1, k),
        vl: (x, e, h, k) => F.rect(x, e, 1, h, k),
        line: (x0, e0, x1, e1, k) => { for (const [x, e] of lineCells(x0, e0, x1, e1)) F.px(x, e, k) },
        grid: (x, eTop, rows, map2 = {}) => rows.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== ".") F.px(x + i, eTop - j, map2[ch] ?? ch) })),
        is: (x, e, keys) => { const [X, Y] = map(x, e); return c.is(X, Y, keys) },
      }
      return F
    }
    const planeR = (c) => plane(c, (x, e) => atR(x, e))
    const planeL = (c, len) => plane(c, (x, e) => atL(CX - len + x, e))

    return { CX, CY, P, ybase, uvAt, atR, atL, isoBox, wallL, wallR, planeR, planeL }
  }

  return { fl, BAY, bay, ihash, lineCells, flat, halo, SHEEN, MIRROR, pen, measure, rain, room }
})()

pal({
  k: "#0c0e1a",                                                                        // ink
  1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",  // night concrete, steel
  e: "#0f151f", f: "#151d2b", z: "#1c2738", Z: "#253349", X: "#32445f",                // wet paving, asphalt
  n: "#3e1240", M: "#a8238a", m: "#ff4fd3", N: "#ffc0f2",                              // magenta neon
  O: "#552b1c", P: "#b0602a", Q: "#eea040", R: "#ffd58a", W: "#fff4d8",                // the bar's warm light
  c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",                              // the screen's cyan
  r: "#7e1420", q: "#ff3a3a",                                                          // drone red
  j: "#9a7406", y: "#eec414", Y: "#fff070",                                            // Juno's slicker
  s: "#93583f", S: "#d79676",                                                          // skin
  g: "#565e70", G: "#8e96a8",                                                          // satchel grey
  u: "#30264c", U: "#4d3f78",                                                          // the cook's umbrella
  h: "#7d8ca4", H: "#b9c6d8",                                                          // steam, white cloth
  a: "#2c2026", A: "#4a3026",                                                          // floor in warm light
  i: "#2a1636", I: "#46204e",                                                          // floor in magenta light
  t: "#11303d", T: "#1b495a",                                                          // floor in cyan light
  w: "#3a4c64", x: "#6c809a",                                                          // the searchlight
})
ramps("k123456", "efzZX", "nMmN", "OPQRW", "cCvV", "rq", "jyY", "sS", "gG", "uU", "hH", "aA", "iI", "tT", "wx")

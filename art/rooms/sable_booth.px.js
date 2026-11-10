// Sable's booth on the Drain Market from inside, painted (kapitel1-design §9: violet and amber, smoke; story §10: the booth stays violet
// and amber so Sable's magenta coat stands out of it). The user approved its blocks on 2026-11-10 (art/mock/sable_booth.px.js, now
// replaced by this file) and chose the front view over iso: a stage seen from the front, so Sable sits facing whoever comes in and the
// price list reads. The block's measures are kept (game/places.js holds the walk area, the spots and the hotspots on them).
//
// One weak vanishing point, VP [160, 79]: the back wall at 26 px a meter (6 m from the eye, the eye 1.8 m over the floor, the
// channel's ceiling at 2.6 m), the strip where Juno walks at about 30, her own scale. Everything that stands in the room is placed in
// meters (P) and projected, so its edges run to the VP.
//
//   sable_booth_bg    320x180, 12 frames: a niche in the drained flood channel's concrete. The back wall hung with violet cloth in folds
//                     from a rail (a burn hole from the pipe, a patch sewn on); the price list on it; the steel shelf of Sable's goods
//                     (old phones, a jar of SIM cards, drives, the radio, boxes); the crates in the right corner under a tarp; the cage
//                     with the wire bird on its chain. The side walls bare concrete with the flood's old tide mark at 1.6 m, the gauge
//                     the channel still has, water stains; the curtain to the market in the left wall, the market's magenta leaking past
//                     it. The low ceiling: its formwork joints, a drainpipe from the street with a leaking joint, a storm grate with the
//                     street's light in it, the stolen power: a cable tapped from the market into a junction box and hung along the
//                     ceiling to the lamp. The lamp's amber falls under its shade, cut off above it; the pipe smoke hangs under the
//                     ceiling and catches it. Moving: the bulb, the curtain's neon stuttering, the LEDs, the bird's eye, the drip, the smoke.
//   sable_booth_desk  96x66, 12 frames, drawn at [112, 76] (anchor top left, baseline 141) over Sable, who sits behind it: the steel desk,
//                     two old CRTs stacked at its left end facing the room (rolling), the laptop at its right with its lid toward us,
//                     the pipe's tobacco tin and ashtray, a card taped to the front: NO REFUNDS.
// Light: the lamp at LAMP, dithered off (the style guide allows dither only for light's falloff); the magenta only near the curtain, the
// cyan only on and right by the screens.
include("../lib/iso.js", { palette: true })
include("../lib/text.js")
pal({
  b: "#1a1226", d: "#6a4a86", D: "#9a5f80", E: "#c98272",                                 // the violet cloth (u U the world's), into the lamp's amber
  l: "#28232f", L: "#3a3034", o: "#54423a", p: "#76604c",                                 // the channel's concrete in warm light
  J: "#22101a", K: "#3a1624", B: "#57222f", F: "#7a3a40",                                 // the curtain, heavy and old
  7: "#33241c", 8: "#54392a", 9: "#7a5638",                                               // wood, cardboard, the rug's worn border
  0: "#20141a", "+": "#33191f", "=": "#4a2328", "*": "#6a3530",                           // the rug
  "%": "#74685a",                                                                         // paper in the shade: the card, the bird's price tag
})

const SB = (() => {
  const W = 320, H = 180, FOC = 156, EYE = 1.8, VX = 160, VY = 79
  const BX0 = 34, BX1 = 286, BTOP = 58, BFOOT = 126, WX = 126 / 26                        // the back wall's rect; the side walls at X = ±WX m
  const LTOP = VY + (BTOP - VY) * 160 / 126, LFOOT = VY + (BFOOT - VY) * 160 / 126         // the side walls at the screen's edges
  /** a point in the room (X across, Hh up from the floor, Z away from the eye, meters) on the screen */
  const P = (X, Hh, Z) => [VX + FOC * X / Z, VY + FOC * (EYE - Hh) / Z]
  const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]
  const dz = (x, y) => (BAYER[y & 3][x & 3] + 0.5) / 16
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
  const hash = (a, b, s = 0) => { let h = (a * 374761393 + b * 668265263 + s * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
  /** a tone of a ramp (keys dark to light) for a light level 0..1: flat steps, dithered only in a band where one meets the next */
  const tone = (ramp, v, x, y, band = 0.3) => {
    const s = clamp(v, 0, 1) * (ramp.length - 1), i = Math.floor(s), t = (s - i - 0.5 + band / 2) / band
    return ramp[clamp(t <= 0 ? i : t >= 1 ? i + 1 : t > dz(x, y) ? i + 1 : i, 0, ramp.length - 1)]
  }
  /** the same, moved by whole steps of the ramp: a fold's face is a step of its own, only the light between them dithers */
  const toneBy = (ramp, v, x, y, by) => ramp[clamp(ramp.indexOf(tone(ramp, v, x, y)) + by, 0, ramp.length - 1)]

  // ---- the lamp: under its shade, the shade cutting the light off above its rim
  const LAMP = { X: 0, H: 2.0, Z: 5.5 }
  const lampLight = (X, Hh, Z, n, reach = 1.25) => {
    const dx = LAMP.X - X, dh = LAMP.H - Hh, dZ = LAMP.Z - Z, d = Math.hypot(dx, dh, dZ) || 1e-3
    const lam = Math.max(0, (n[0] * dx + n[1] * dh + n[2] * dZ) / d)
    const cone = clamp((Math.atan2(dh, Math.hypot(dx, dZ)) - 0.04) / 0.3, 0, 1)
    return lam * (0.06 + 0.94 * cone) / (1 + (d / reach) ** 2)
  }
  // the desk (front at Z 4.53, top 0.76 m, X ±1.3) shades the floor in front of it
  const DESK = { Z: 4.53, H: 0.76, X: 1.3 }
  const floorLight = (X, Z) => {
    let l = lampLight(X, 0, Z, [0, 1, 0])
    if (Z < DESK.Z) {
      const t = (DESK.Z - Z) / (LAMP.Z - Z), h = LAMP.H * t, x = X + (LAMP.X - X) * t
      if (h < DESK.H + 0.02 && Math.abs(x) < DESK.X) l *= 0.12 + clamp((h - DESK.H + 0.08) / 0.1, 0, 1) * 0.88
    }
    return l
  }
  // the market's magenta behind the curtain, leaking past its back edge and under its hem (level 0..1 per frame)
  const MAG = { X: -4.7, H: 0.15, Z: 5.6 }
  const magAt = (X, Hh, Z) => Math.max(0, 1 - Math.hypot(X - MAG.X, (Hh - MAG.H) * 1.6, Z - MAG.Z) / 1.15)

  // ---- a canvas of keys, so later passes (the smoke) can read what is under them
  const buf = () => {
    const a = new Array(W * H).fill("k")
    const o = {
      a,
      px(x, y, k) { x = Math.round(x); y = Math.round(y); if (k && x >= 0 && x < W && y >= 0 && y < H) a[y * W + x] = k },
      get(x, y) { return x >= 0 && x < W && y >= 0 && y < H ? a[y * W + x] : "k" },
      rect(x, y, w, h, k) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) o.px(x + i, y + j, typeof k === "function" ? k(x + i, y + j) : k) },
      hline(x, y, w, k) { o.rect(x, y, w, 1, k) },
      vline(x, y, h, k) { o.rect(x, y, 1, h, k) },
      line(x0, y0, x1, y1, k) {
        x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1)
        const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1
        let e = dx + dy
        for (;;) { o.px(x0, y0, k); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx } if (e2 <= dx) { e += dx; y0 += sy } }
      },
      /** fill a polygon (flat [x, y, ...]) with a key or a function of (x, y) */
      fill(pts, k) {
        const n = pts.length / 2
        let y0 = Infinity, y1 = -Infinity
        for (let i = 0; i < n; i++) { y0 = Math.min(y0, pts[i * 2 + 1]); y1 = Math.max(y1, pts[i * 2 + 1]) }
        for (let y = Math.max(0, Math.floor(y0)); y <= Math.min(H - 1, Math.ceil(y1)); y++) {
          const xs = []
          for (let i = 0; i < n; i++) {
            const ax = pts[i * 2], ay = pts[i * 2 + 1], bx = pts[((i + 1) % n) * 2], by = pts[((i + 1) % n) * 2 + 1]
            if ((ay <= y + 0.5 && by > y + 0.5) || (by <= y + 0.5 && ay > y + 0.5)) xs.push(ax + ((y + 0.5 - ay) / (by - ay)) * (bx - ax))
          }
          xs.sort((p, q) => p - q)
          for (let j = 0; j + 1 < xs.length; j += 2) for (let x = Math.ceil(xs[j] - 0.5); x <= Math.floor(xs[j + 1] - 0.5); x++) {
            if (x < 0 || x >= W) continue
            o.px(x, y, typeof k === "function" ? k(x, y) : k)
          }
        }
      },
      /** a cable hung between room points, sagging (m) in the middle */
      cable(a, b, sag, k, n = 160) {
        let last = null
        for (let i = 0; i <= n; i++) {
          const t = i / n, X = a[0] + (b[0] - a[0]) * t, Hh = a[1] + (b[1] - a[1]) * t - sag * 4 * t * (1 - t), Z = a[2] + (b[2] - a[2]) * t
          const [x, y] = P(X, Hh, Z), r = [Math.round(x), Math.round(y)]
          if (!last || last[0] !== r[0] || last[1] !== r[1]) { o.px(r[0], r[1], typeof k === "function" ? k(X, Hh, Z) : k); last = r }
        }
      },
    }
    return o
  }

  // the side walls' lines: ceiling and floor at x
  const sideCeil = (x) => (x < BX0 ? LTOP + (BTOP - LTOP) * (x / BX0) : BTOP + (LTOP - BTOP) * ((x - BX1) / (W - BX1)))
  const sideFloor = (x) => (x < BX0 ? LFOOT + (BFOOT - LFOOT) * (x / BX0) : BFOOT + (LFOOT - BFOOT) * ((x - BX1) / (W - BX1)))
  // the curtain on the left wall: from x 6 to 28, 2.1 m of the wall's 2.6 (the block's CURTAIN, game/places.js curtainPoly)
  const CUR = [6, 28], curTop = (x) => sideFloor(x) - (sideFloor(x) - sideCeil(x)) * (2.1 / 2.6)
  const CURTAIN = [CUR[0], Math.round(curTop(CUR[0])), CUR[1], Math.round(curTop(CUR[1])), CUR[1], Math.round(sideFloor(CUR[1])), CUR[0], Math.round(sideFloor(CUR[0]))]

  const CLOTH = ["k", "b", "u", "U", "d", "D", "E"]
  const CONC = ["k", "1", "2", "l", "L", "o", "p"]
  const CEIL = ["k", "1", "2", "l", "L"]
  const FLOOR = ["k", "e", "f", "a", "A", "o"]
  const RUG = ["k", "0", "+", "=", "*"]
  const RUG_EDGE = ["k", "7", "8", "9"]
  const RUG_WORN = ["k", "0", "7", "8"]
  const WOOD = ["k", "7", "8", "9"]
  const STEEL = ["k", "1", "2", "3", "4", "5", "6"]
  const CURT = ["k", "J", "K", "B", "F"]
  const MAG_WALL = ["1", "n", "i", "I"]
  const MAG_FLOOR = ["e", "i", "i", "I"]

  // the cloth's folds: widths picked once (it was hung by hand), each fold a crease and two faces
  const FOLDS = []
  for (let x = BX0; x < BX1;) { const w = 8 + Math.floor(hash(x, 7) * 5); FOLDS.push([x, w]); x += w }
  const foldAt = (x) => { for (const [x0, w] of FOLDS) if (x < x0 + w) return [x0, w, (x - x0) / w]; return [BX1, 9, 0] }

  // the drainpipe along the ceiling from the street, 0.15 m under it, 0.06 m thick; it turns up into the ceiling at its far end
  const PIPE = { X: -0.7, H: 2.45, r: 0.06, Z0: 1.2, Z1: 5.6, joint: 3.6 }
  // the storm grate in the ceiling, the street over it
  const GRATE = { X0: 1.3, X1: 2.3, Z0: 3.0, Z1: 3.6 }
  const inGrate = (X, Z, m = 0) => X > GRATE.X0 - m && X < GRATE.X1 + m && Z > GRATE.Z0 - m && Z < GRATE.Z1 + m
  // the rug where customers stand, worn where they stand; the drip from the pipe's joint lands on it
  const RUGR = { X: 1.35, Z0: 3.0, Z1: 4.2 }
  const DRIP = P(PIPE.X, 0, PIPE.joint)

  // the stutter of the market's neon behind the curtain, per frame: on, dim, off
  const MAGF = [1, 1, 1, 1, 1, 1, 1, 0.15, 0.55, 1, 1, 1]

  /** the room without what moves, for a level of the market's light */
  function base(mag) {
    const c = buf()
    // ---- the ceiling: the channel's concrete, its formwork joints running back, the shade's leak over the lamp
    c.fill([0, 0, W, 0, W, LTOP, BX1, BTOP, BX0, BTOP, 0, LTOP], (x, y) => {
      const Z = FOC * (2.6 - EYE) / (VY - y), X = (x - VX) * Z / FOC
      let v = 0.16 + 0.05 * (Z - 3) / 3
      v += 0.32 / (1 + (Math.hypot(X - LAMP.X, Z - LAMP.Z) / 0.45) ** 2)                 // through the shade's top, round its cord
      v += 0.18 * mag * magAt(X, 2.6, Z) * 0.6
      if (Math.abs(Z - 4.5) < 0.03 * Z / 3 || Math.abs(Z - 3.0) < 0.02 * Z / 3) v -= 0.12  // the joints between the channel's sections
      if (Math.abs(Math.abs(X) - 2.3) < 0.012 * Z) v -= 0.1
      if (inGrate(X, Z, 0.28) && !inGrate(X, Z, 0.04)) v -= 0.07 + 0.06 * hash(Math.floor(X * 9), Math.floor(Z * 9), 3)   // damp round the grate
      return tone(CEIL, v, x, y, 0.12)
    })
    // ---- the side walls: bare concrete, the old tide mark at 1.6 m, darker under it where the water stood
    const wall = (x, y, side) => {
      const X = side * WX, Z = FOC * WX / Math.abs(x - VX), Hh = EYE - (y - VY) * Z / FOC
      let v = 0.2 + lampLight(X, Hh, Z, [-side, 0, 0]) * 1.4
      if (Hh < 1.6) v -= 0.07
      if (Math.abs(Hh - 1.6) < 0.025) v += 0.18                                              // the salt the flood left at its line
      else if (Math.abs(Hh - 1.57) < 0.02) v -= 0.08
      if (side > 0 && Hh > 1.62 && (Math.abs(x - 297) < 1 || Math.abs(x - 316) < 1.5) && Hh > 2.6 - (0.5 + hash(x, 1) * 0.4)) v -= 0.12   // water in from the street at the ceiling's joint
      const m = mag * magAt(X, Hh, Z) * (side < 0 ? 1.3 : 0)
      if (m > 0.25 + dz(x, y) * 0.5) return tone(MAG_WALL, m * 0.9 + 0.1, x, y)
      return tone(CONC, v, x, y)
    }
    c.fill([0, LTOP, BX0, BTOP, BX0, BFOOT, 0, LFOOT], (x, y) => wall(x, y, -1))
    c.fill([BX1, BTOP, W, LTOP, W, LFOOT, BX1, BFOOT], (x, y) => wall(x, y, 1))
    // ---- the back wall hung with violet cloth in folds from a rail, its hem a hand over the floor; the concrete under it
    for (let y = BTOP; y < BFOOT; y++) for (let x = BX0; x < BX1; x++) {
      const [x0, w, u] = foldAt(x), hem = 122 + (u < 0.5 ? 0 : 1)
      const X = (x - VX) / 26, Hh = EYE - (y - VY) / 26, li = lampLight(X, Hh, 6, [0, 0, -1], 1.9)
      if (y >= hem) { c.px(x, y, y === BFOOT - 1 ? "k" : tone(CONC, 0.12 + li * 1.1, x, y)); continue }
      const s = x < VX ? 1 : -1                                                           // the face turned to the lamp is the lit one
      let by = u < 0.14 ? -1 : u < 0.55 ? (s < 0 ? 1 : 0) : (s > 0 ? 1 : 0)
      if (y > hem - 2 || y < BTOP + 3) by -= 1                                            // the hem's turn, under the rail
      const v = 0.2 + li * 1.0 + mag * magAt(X, Hh, 6) * 0.5
      c.px(x, y, toneBy(CLOTH, v, x, y, by))
    }
    // the rail, the rings the cloth hangs from, the brackets into the ceiling
    for (let x = BX0; x < BX1; x++) c.px(x, BTOP, tone(STEEL, 0.4 + lampLight((x - VX) / 26, 2.5, 6, [0, -1, -1]) * 2, x, BTOP))
    for (const [x0] of FOLDS) { c.px(x0, BTOP + 1, "4"); c.px(x0 + 1, BTOP + 1, "3") }
    for (const x of [48, 120, 200, 272]) { c.vline(x, BTOP - 2, 2, "3"); c.px(x, BTOP - 3, "2") }
    // a burn hole from the pipe, a patch sewn over an older one
    c.rect(186, 92, 3, 2, "k"); c.px(185, 92, "O"); c.px(189, 93, "O"); c.px(187, 91, "O"); c.px(187, 94, "b")
    c.rect(212, 100, 11, 9, (x, y) => tone(["b", "u", "U", "d"], 0.25 + lampLight((x - VX) / 26, EYE - (y - VY) / 26, 6, [0, 0, -1]) * 1.4, x, y))
    for (let i = 0; i < 11; i += 2) { c.px(212 + i, 100, "D"); c.px(212 + i, 108, "d") }
    for (let j = 1; j < 9; j += 2) { c.px(212, 100 + j, "d"); c.px(222, 100 + j, "d") }

    // ---- the floor: the channel's concrete, its joints running to the VP, the lamp's pool, the desk's shadow in front of it
    for (let y = BFOOT; y < H; y++) for (let x = 0; x < W; x++) {
      if (y < sideFloor(x) - 0.5) continue
      const Z = FOC * EYE / (y - VY), X = (x - VX) * Z / FOC
      const li = floorLight(X, Z)
      let v = 0.15 + li * 1.25 + 0.03 * (Z - 3)
      if (Math.abs(Math.abs(X) - 2.3) < 0.012 * Z || Math.abs(Z - 3.5) < 0.012 * Z || Math.abs(Z - 4.5) < 0.016 * Z) v -= 0.12
      let k
      const inRug = Math.abs(X) < RUGR.X && Z > RUGR.Z0 && Z < RUGR.Z1
      if (inRug) {
        const edge = Math.min(RUGR.X - Math.abs(X), Z - RUGR.Z0, RUGR.Z1 - Z), worn = Math.hypot((X + 0.8) / 0.5, (Z - 3.5) / 0.32)
        let rv = 0.32 + li * 1.6
        if (edge < 0.03) rv -= 0.18
        if (Math.hypot(x - DRIP[0], (y - DRIP[1]) * 2.4) < 2.5) rv -= 0.1                   // damp where the pipe drips on it
        k = edge < 0.13 && edge > 0.03 ? tone(RUG_EDGE, rv, x, y) : worn < 1 - dz(x, y) * 0.35 ? tone(RUG_WORN, rv + 0.05, x, y) : tone(RUG, rv, x, y)
      } else k = tone(FLOOR, v, x, y, 0.15)
      // under the storm grate: damp, the street's light in bars
      if (!inRug && inGrate(X, Z + 0.05, 0.15)) {
        const gap = ((X - GRATE.X0) % 0.2 + 0.2) % 0.2 > 0.07 && inGrate(X, Z + 0.05, -0.02)
        k = tone(["e", "f", "z", "Z"], (gap ? 0.45 : 0.15) + v * 0.4, x, y)
      }
      const m = mag * magAt(X, 0, Z)
      if (m > 0.12 + dz(x, y) * 0.55) k = tone(MAG_FLOOR, m * 1.1, x, y)
      c.px(x, y, k)
    }
    // the rug's fringe at its front edge
    { const [a] = P(-RUGR.X, 0, RUGR.Z0), [b] = P(RUGR.X, 0, RUGR.Z0), y = Math.round(P(0, 0, RUGR.Z0)[1])
      for (let x = Math.round(a) + 1; x < b; x += 2) c.px(x, y + 1, tone(RUG_EDGE, 0.3 + floorLight((x - VX) * RUGR.Z0 / FOC, RUGR.Z0) * 1.5, x, y + 1)) }

    // ---- the curtain to the market: heavy, dark, worn; the market's magenta past its back edge, under its hem, through a tear
    c.fill(CURTAIN, (x, y) => {
      const Z = FOC * WX / (VX - x), Hh = EYE - (y - VY) * Z / FOC, fz = (Z * 10) % 1.1 / 1.1
      let v = 0.36 + lampLight(-WX, Hh, Z, [1, 0, 0]) * 2.2 + (fz < 0.2 ? -0.22 : fz < 0.6 ? 0.06 : -0.04)
      if (y < curTop(x) + 2) v += 0.12                                                    // the heading, gathered on its rod
      return tone(CURT, v, x, y)
    })
    c.line(5, CURTAIN[1] - 1, 29, CURTAIN[3] - 1, "4"); c.px(5, CURTAIN[1] - 1, "5"); c.px(29, CURTAIN[3] - 1, "3")
    const leak = mag > 0.8 ? ["M", "m"] : mag > 0.3 ? ["n", "M"] : ["J", "n"]
    for (let y = CURTAIN[3]; y < CURTAIN[5]; y++) c.px(CUR[1] - 1, y, y % 9 === 0 ? leak[0] : leak[1])
    for (let x = CUR[0]; x < CUR[1]; x++) c.px(x, Math.round(sideFloor(x)) - 1, leak[x % 3 ? 0 : 1])
    for (let y = 98; y < 105; y++) c.px(15 + (y > 101 ? 1 : 0), y, leak[0])              // a tear, worn by hands pushing it aside

    // ---- the tapped power: a cable from the market into a junction box, from there to the lamp and along the rail to the desk
    { const box = [[-WX, 2.48, 5.2], [-WX, 2.48, 5.5], [-WX, 2.24, 5.5], [-WX, 2.24, 5.2]].map((q) => P(...q))
      c.cable([-WX, 2.36, 4.6], [-WX, 2.36, 5.2], 0.02, "k")
      c.fill(box.flat(), (x, y) => (y < box[0][1] + 1.5 ? "4" : "3"))
      c.line(box[0][0], box[0][1], box[3][0], box[3][1], "k"); c.line(box[3][0], box[3][1], box[2][0], box[2][1], "k")
      c.px(Math.round(box[0][0] + 3), Math.round(box[0][1] + 4), "2") }
    const cableKey = (X, Hh, Z) => (lampLight(X, Hh - 0.04, Z, [0, -1, 0]) + lampLight(X, Hh, Z, [0, 0, -1]) > 0.25 ? "L" : "k")
    c.cable([-WX, 2.48, 5.35], [-WX + 0.05, 2.6, 5.28], 0, "k")
    c.cable([-WX + 0.05, 2.6, 5.28], [-3.0, 2.6, 3.4], 0.06, "k")
    c.cable([-3.0, 2.6, 3.4], [PIPE.X - 0.02, PIPE.H - PIPE.r, 3.2], 0.24, cableKey)
    c.cable([PIPE.X, PIPE.H - PIPE.r, 3.2], [0, 2.6, LAMP.Z], 0.2, cableKey)
    for (const x of [16, 24, 30]) c.px(x, Math.round(sideCeil(x)) + 9 + (x > 20 ? 1 : 0), "k")
    c.line(22, 66, 33, 62, "k")
    for (let x = BX0; x < 111; x++) c.px(x, BTOP + 3 + Math.round(2 * Math.sin(Math.PI * ((x - BX0) % 26) / 26)), "k")
    c.vline(111, BTOP + 3, BFOOT - BTOP - 3, "k"); c.px(110, BFOOT - 1, "k"); c.px(109, BFOOT - 1, "k")
    // the hook in the ceiling for the lamp
    c.rect(158, 55, 5, 1, "3")

    // ---- the price list on the cloth, on two wires from the rail: amber letters on a black board
    c.line(201, BTOP + 1, 199, 62, "4"); c.line(265, BTOP + 1, 267, 62, "4")
    c.rect(196, 62, 74, 25, "k"); c.rect(197, 63, 72, 23, "1"); c.hline(197, 63, 72, "2")
    TXT.draw(c, 233, 65, "NAMES 50.", "Q", { font: "hud", align: "center" })
    TXT.draw(c, 233, 72, "ADDRESSES 80.", "Q", { font: "hud", align: "center" })
    TXT.draw(c, 233, 79, "SECRETS: ASK.", "Q", { font: "hud", align: "center" })
    c.px(196, 62, "2"); c.px(269, 62, "2")

    // ---- the steel shelf of goods against the back wall, left: its uprights, four boards, its right side turned to the light
    const shelfLit = (x, y) => lampLight((x - VX) / 26, EYE - (y - VY) / 26, 5.8, [0, 0, -1])
    for (let y = 70; y < 126; y++) for (let x = 44; x < 104; x++) {                       // the cloth behind in the shelf's shadow
      const k = c.get(x, y), i = CLOTH.indexOf(k); if (i > 1) c.px(x, y, CLOTH[i - 1])
    }
    for (const x of [42, 43, 104, 105]) for (let y = 70; y < 128; y++) c.px(x, y, tone(STEEL, 0.28 + shelfLit(x, y) * 2.4 + (x === 43 || x === 105 ? 0.08 : 0), x, y))
    for (let y = 71; y < 127; y++) { c.px(106, y, tone(STEEL, 0.4 + shelfLit(106, y) * 3, 106, y)); c.px(107, y, tone(STEEL, 0.32 + shelfLit(106, y) * 3, 107, y)); c.px(108, y + 1, "2") }
    for (const y of [70, 88, 106, 124]) for (let x = 42; x < 108; x++) {
      c.px(x, y, tone(STEEL, 0.45 + shelfLit(x, y) * 3, x, y)); c.px(x, y + 1, tone(STEEL, 0.22 + shelfLit(x, y) * 1.5, x, y + 1))
    }
    c.px(42, 127, "k"); c.px(105, 127, "k")
    // top: old phones in a row (one still glowing), a jar of SIM cards, drives stacked, a small box
    for (let i = 0; i < 5; i++) {
      const x = 46 + i * 4
      c.rect(x, 80, 3, 8, "3"); c.vline(x + 1, 81, 5, i === 3 ? "c" : "1"); c.px(x, 80, "4")
      if (i === 1) { c.px(x + 1, 82, "4"); c.px(x + 2, 83, "4") }                          // a cracked one
    }
    c.line(59, 87, 59, 88, "k")
    c.rect(68, 77, 9, 11, "k"); c.rect(69, 79, 7, 8, "2")
    for (let y = 82; y < 87; y++) for (let x = 69; x < 76; x++) c.px(x, y, ["Q", "C", "g", "P", "6", "d"][Math.floor(hash(x, y, 4) * 6)])
    c.vline(69, 79, 7, "5"); c.rect(68, 76, 9, 2, "P"); c.hline(68, 76, 9, "Q")
    for (let i = 0; i < 3; i++) { const y = 79 + i * 3; c.rect(80, y, 15, 3, "3"); c.hline(80, y, 15, "5"); c.hline(80, y + 2, 15, "2"); c.rect(82, y + 1, 4, 1, "h") }
    c.rect(97, 81, 7, 7, "8"); c.hline(97, 81, 7, "9"); c.vline(100, 81, 2, "7")
    // middle: the radio (its dial lit, an LED), a coil of cable, a box stencilled HDD
    c.rect(45, 94, 22, 12, "k"); c.rect(46, 95, 20, 10, "3"); c.hline(46, 95, 20, "4")
    for (let y = 97; y < 104; y += 2) for (let x = 47; x < 55; x += 2) c.px(x, y, "1")
    c.rect(57, 97, 8, 3, "Q"); c.hline(57, 99, 8, "P"); c.px(60, 97, "O")
    c.px(58, 102, "5"); c.px(62, 102, "5")
    c.line(64, 94, 70, 90, "4")
    for (let a = 0; a < 64; a++) {
      const t = a / 64 * Math.PI * 2
      c.px(75 + Math.cos(t) * 5, 101 + Math.sin(t) * 4, "k"); c.px(75 + Math.cos(t) * 3, 101 + Math.sin(t) * 2.5, "2")
    }
    c.px(80, 104, "2"); c.px(81, 105, "k")
    c.rect(83, 92, 21, 14, "8"); c.hline(83, 92, 21, "9"); c.hline(83, 105, 21, "7"); c.vline(93, 92, 3, "7")
    TXT.draw(c, 93, 97, "HDD", "7", { font: "hud", align: "center" })
    // bottom: boxes, one stencilled SIM; a flight case with its latches
    c.rect(45, 113, 23, 11, "8"); c.hline(45, 113, 23, "9"); c.vline(56, 113, 2, "7")
    TXT.draw(c, 56, 116, "SIM", "7", { font: "hud", align: "center" })
    c.rect(48, 109, 12, 4, "7"); c.hline(48, 109, 12, "8")
    c.rect(71, 115, 32, 9, "4"); c.hline(71, 115, 32, "5"); c.hline(71, 123, 32, "2"); c.rect(84, 113, 6, 2, "2")
    for (const x of [75, 97]) { c.rect(x, 117, 2, 2, "6"); c.px(x, 118, "3") }
    c.rect(88, 119, 4, 2, "P")

    // ---- the crates in the right corner, what Sable bought: a wooden one, a plastic one on it under a tarp
    const crLit = (x, y) => lampLight((x - VX) / 27, EYE - (y - VY) / 27, 5.75, [0, 0, -1])
    c.fill([234, 104, 238, 105, 238, 128, 234, 126], (x, y) => tone(WOOD, 0.5 + crLit(x, y) * 2, x, y))       // its side, toward the lamp
    c.fill([236, 102, 280, 102, 282, 105, 238, 105], (x, y) => tone(WOOD, 0.55 + crLit(x, y) * 2, x, y))      // its top
    for (let y = 105; y < 128; y++) for (let x = 238; x < 283; x++) {
      const post = x < 241 || x > 279, gap = !post && (y - 105) % 8 === 7
      c.px(x, y, gap ? "7" : tone(WOOD, (post ? 0.32 : 0.42) + crLit(x, y) * 2 - (y > 125 ? 0.15 : 0), x, y))
    }
    TXT.draw(c, 260, 115, "FRAGILE", "7", { font: "hud", align: "center" })
    c.hline(238, 128, 45, "k")
    c.rect(244, 90, 32, 13, (x, y) => tone(STEEL, 0.4 + crLit(x, y) * 2.5 + (y === 90 ? 0.15 : 0) - ((x - 244) % 5 === 4 ? 0.12 : 0), x, y))
    c.rect(249, 93, 6, 2, "1"); c.rect(265, 93, 6, 2, "1"); c.vline(243, 91, 12, "2")
    c.fill([258, 88, 268, 87, 278, 89, 281, 98, 280, 107, 276, 104, 272, 108, 268, 103, 262, 104, 260, 96], (x, y) => {
      const f = ((x * 3 + y) % 11) / 11
      return tone(["k", "Z", "X"], 0.45 + crLit(x, y) * 2 + (f < 0.25 ? -0.25 : 0.05), x, y)
    })

    // ---- the right wall's own things: the channel's gauge, painted when it still carried water; a conduit to a dead sensor
    { const Z = FOC * WX / (305 - VX)
      for (let h = 0; h <= 2.0; h += 0.02) {
        const y = Math.round(P(WX, h, Z)[1])
        c.px(305, y, "5"); c.px(306, y, Math.round(h * 100) % 25 < 2 ? "6" : "4")
        if (Math.round(h * 100) % 50 < 2) c.px(307, y, "6")
      }
      for (const h of [1, 2]) TXT.draw(c, 309, Math.round(P(WX, h, Z)[1]) - 2, String(h), "5", { font: "hud" })
      c.vline(305, Math.round(P(WX, 2.0, Z)[1]) + 1, 3, "O"); c.px(304, Math.round(P(WX, 2.0, Z)[1]), "4") }
    { const Z = FOC * WX / (315 - VX), [, y0] = P(WX, 2.6, Z), [, y1] = P(WX, 0.9, Z)
      c.rect(315, Math.round(y0), 2, Math.round(y1 - y0), (x, y) => (x === 315 ? "3" : "2"))
      for (const h of [2.2, 1.6]) c.rect(314, Math.round(P(WX, h, Z)[1]), 4, 1, "4")
      c.rect(313, Math.round(y1), 6, 5, "2"); c.hline(313, Math.round(y1), 6, "3"); c.px(315, Math.round(y1) + 2, "1") }

    // ---- the drainpipe along the ceiling, tied up with straps, a leaking joint, turning up into the ceiling at its end
    for (let Z = PIPE.Z1; Z >= PIPE.Z0; Z -= 0.004) {
      const [cx, cy] = P(PIPE.X, PIPE.H, Z), r = FOC * PIPE.r / Z * (Math.abs(Z - PIPE.joint) < 0.05 ? 1.2 : 1)
      const strap = [2.0, 3.0, 4.0, 5.0].some((s) => Math.abs(Z - s) < 0.025)
      for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
        const nx = (x + 0.5 - cx) / r, ny = (y + 0.5 - cy) / r, rr = nx * nx + ny * ny
        if (rr > 1) continue
        const li = lampLight(PIPE.X + nx * PIPE.r, PIPE.H - ny * PIPE.r, Z, [nx, -ny, 0], 1.8)
        // its edge ink, the top in the ceiling's dark, the underside catching the lamp in a band
        let k = Math.sqrt(rr) > 1 - 1.2 / Math.max(r, 1.2) ? "k" : ny < -0.35 ? "1" : ny < 0.3 ? "2" : ny < 0.75 ? (li > 0.12 ? "o" : li > 0.05 ? "L" : "4") : "3"
        if (strap && k !== "k") k = "k"
        if (Math.abs(Z - PIPE.joint) < 0.05 && k !== "k") k = ny < 0 ? "3" : "5"
        c.px(x, y, k)
      }
    }
    for (const s of [2.0, 3.0, 4.0, 5.0]) {
      const [cx, cy] = P(PIPE.X, PIPE.H, s), r = FOC * PIPE.r / s, top = VY - FOC * (2.6 - EYE) / s
      c.vline(Math.round(cx), Math.floor(top), Math.max(1, Math.round(cy - r - top)), "3")
    }
    { const [cx, cy] = P(PIPE.X, PIPE.H, PIPE.Z1), top = VY - FOC * (2.6 - EYE) / PIPE.Z1
      c.rect(Math.round(cx) - 1, Math.floor(top), 3, Math.round(cy - top), (x) => (x === Math.round(cx) + 1 ? "3" : "2")) }
    // a rust stain on the ceiling over the leaking joint
    { const [cx] = P(PIPE.X, PIPE.H, PIPE.joint), top = VY - FOC * (2.6 - EYE) / PIPE.joint
      for (let i = -3; i <= 3; i++) if (Math.abs(i) < 3 || hash(i, 5) < 0.5) c.px(Math.round(cx) + i, Math.round(top) + (Math.abs(i) < 2 ? 1 : 0), "7") }

    // ---- the storm grate in the ceiling: its bars, the street's light between them
    for (let y = 30; y < 48; y++) for (let x = 200; x < 290; x++) {
      const Z = FOC * (2.6 - EYE) / (VY - y), X = (x - VX) * Z / FOC
      if (!inGrate(X, Z)) continue
      const frame = !inGrate(X, Z, -0.05), bar = ((X - GRATE.X0) % 0.2) < 0.07, slot = Math.floor((X - GRATE.X0) / 0.2)
      // the street over it: dark, the night sky's glow, in one slot a sign's magenta
      c.px(x, y, frame ? "3" : bar ? "1" : Z > GRATE.Z1 - 0.12 ? "k" : slot === 3 ? "n" : "2")
    }

    // ---- the cage on its chain from the ceiling, in front of the right wall; the wire bird on its perch; its price on a tag
    c.rect(284, 49, 5, 1, "4"); c.px(286, 50, "3")
    for (let y = 51; y < 68; y++) c.px(286, y, ["5", "4", "k"][y % 3])
    for (let y = 52; y < 68; y += 3) c.px(285, y, "3")
    c.rect(285, 67, 3, 2, "5"); c.px(286, 67, "k")
    c.line(272, 73, 286, 69, "5"); c.line(286, 69, 299, 73, "5"); c.line(279, 71, 286, 70, "6")
    for (let x = 272; x < 300; x += 3) { const t = Math.round(73 - (14 - Math.abs(x - 286)) * 4 / 14); c.vline(x, t, 102 - t, x < 286 ? "4" : "5") }
    c.vline(299, 73, 29, "5")
    c.hline(272, 74, 28, "6"); c.hline(272, 83, 28, "5")
    c.rect(276, 93, 9, 9, (x, y) => (x === 276 || x === 284 || y === 93 ? "6" : null)); c.px(285, 97, "G")
    c.hline(274, 92, 23, "O"); c.px(274, 92, "8"); c.px(296, 92, "8")
    c.rect(271, 102, 30, 4, "3"); c.hline(271, 102, 30, "5"); c.hline(271, 105, 30, "k"); c.hline(272, 103, 28, "4")
    c.vline(298, 106, 2, "4"); c.rect(296, 108, 4, 3, "%"); c.px(297, 109, "1"); c.px(298, 109, "1")
    const BIRD = [
      ".........HG...",
      "........G..G..",
      "........G.@.GG",
      ".........G..G.",
      "....GGGGH...G.",
      "GG.G.......G..",
      "..G..G.G..G...",
      "GG.G......G...",
      "....GGGGGG....",
      ".....G..G.....",
    ]
    BIRD.forEach((row, j) => [...row].forEach((ch, i) => { if (ch !== ".") c.px(278 + i, 82 + j, ch === "@" ? "c" : ch) }))

    // ---- the lamp over the desk: its cord from the hook, the shade (amber enamel, dark outside), its rim lit from inside
    c.vline(VX, 56, 8, "k")
    c.rect(158, 63, 5, 1, "4")
    // the shade: a cone of enamel, its outside dark but for the sheen the cloth's light gives it on the right; ink round it
    c.fill([153, 64, 167, 64, 172, 71, 148, 71], (x, y) => {
      const u = (x - 148 - (71 - y) * 5 / 7) / (24 - (71 - y) * 10 / 7)                  // 0..1 across the cone at its row
      return u < 0.12 || u > 0.9 ? "k" : y === 64 ? "P" : u > 0.62 && u < 0.78 ? "P" : "O"
    })
    c.hline(149, 71, 23, "Q"); c.px(148, 71, "k"); c.px(171, 71, "k")
    return c
  }

  const BASES = new Map()
  function room(c) {
    const f = c.frame ?? 0, mag = MAGF[f]
    if (!BASES.has(mag)) BASES.set(mag, base(mag))
    const b = buf(), src = BASES.get(mag).a
    for (let i = 0; i < src.length; i++) b.a[i] = src[i]
    // ---- the bulb, flickering now and then
    const dim = f === 3 || f === 7
    b.hline(151, 71, 19, dim ? "Q" : "R"); b.rect(158, 72, 5, 1, dim ? "R" : "W"); b.px(VX, 73, dim ? "Q" : "R"); b.px(157, 72, "Q"); b.px(163, 72, "Q")
    // ---- the junction box's LED, the radio's, the charging phone; the bird's eye
    { const [ex, ey] = P(-WX, 2.4, 5.36); b.px(Math.round(ex), Math.round(ey), f % 6 < 2 ? "v" : "c") }
    b.px(64, 102, f < 6 ? "v" : "C")
    b.vline(59, 81 + ((f >> 1) % 3) * 0, 5, "c"); b.px(59, 85 - Math.floor(f / 3), "C")
    b.px(288, 84, f === 10 || f === 11 ? "C" : "v")
    // ---- the drip from the pipe's joint: it swells, lets go, falls onto the rug
    { const [jx, jy] = P(PIPE.X, PIPE.H - PIPE.r * 1.2, PIPE.joint), x = Math.round(jx), y = Math.round(jy) + 1
      if (f < 9) { b.px(x, y, f < 5 ? "3" : "h"); if (f >= 6) b.px(x, y + 1, "4") }
      else { const fy = y + [3, 12, 30][f - 9]; b.vline(x, fy, 2 + (f - 9), "h") } }
    // ---- the pipe smoke, hanging under the ceiling in slow layers, catching the lamp's light where it is near
    // smoke takes the lamp's warmth: a step lighter and toward the warm greys
    const LIGHTER = { k: "l", 1: "l", 2: "L", 3: "L", 4: "o", 5: "p", l: "L", L: "o", o: "p", b: "u", u: "U", U: "d", d: "D", D: "E", O: "P", J: "K", e: "l", Q: "R", n: "i", 7: "8" }
    const ph = f / 12 * Math.PI * 2
    const WISPS = [
      { y: 53, a: 2.0, k: 0.045, t: 3.2, x0: 96, x1: 236, p: 0.3 },
      { y: 61, a: 1.5, k: 0.06, t: 2.6, x0: 118, x1: 206, p: 2.1 },
      { y: 44, a: 2.4, k: 0.03, t: 3.4, x0: 76, x1: 244, p: 4.0 },
      { y: 67, a: 1.0, k: 0.08, t: 2.0, x0: 138, x1: 186, p: 1.2 },
    ]
    for (let y = 36; y < 72; y++) for (let x = 64; x < 256; x++) {
      if (x >= 194 && y >= 62) continue                                                   // the price list stays clear
      let d = 0
      for (const w of WISPS) {
        if (x < w.x0 || x > w.x1) continue
        const env = Math.sin(Math.PI * (x - w.x0) / (w.x1 - w.x0))
        const yc = w.y + w.a * (Math.sin(w.k * x + w.p) * Math.cos(ph) + Math.sin(w.k * 1.7 * x + w.p * 2) * Math.sin(ph))
        const th = w.t * (0.7 + 0.3 * Math.sin(w.k * 0.6 * x + ph + w.p))
        d = Math.max(d, (1 - Math.abs(y - yc) / th) * env)
      }
      if (d <= 0) continue
      const near = Math.hypot(x - VX, (y - 68) * 1.6) < 26
      const k = b.get(x, y)
      if (d > 0.5 || d > 0.2 + dz(x, y) * 0.3) {
        let n = LIGHTER[k] ?? k
        if (near && d > 0.5) n = LIGHTER[n] ?? n
        b.px(x, y, n)
      }
    }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, b.a[y * W + x])
  }

  /** Sable's desk with its screens: drawn over Sable, who sits behind it (sprite sable_booth_desk at DESK_AT, baseline DESK_BASE) */
  const DESK_AT = [112, 76], DESK_BASE = 141
  function desk(c) {
    const f = c.frame ?? 0, X = (x) => x - DESK_AT[0], Y = (y) => y - DESK_AT[1]
    const px = (x, y, k) => { if (k) c.px(X(x), Y(y), k) }
    const rect = (x, y, w, h, k) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) px(x + i, y + j, typeof k === "function" ? k(x + i, y + j) : k) }
    const top = (x, y) => lampLight((x - VX) * 4.9 / FOC, 0.76, 4.6 + (116 - y) * 0.15, [0, 1, 0])
    // the top, seen from a little above, in the lamp's light; the screens' cyan on it before them
    for (let y = 112; y < 117; y++) {
      const inset = 116 - y > 2 ? 1 : 0
      for (let x = 116 + inset; x < 204 - inset; x++) {
        // steel, warm where the lamp is on it; the lower screen's cyan on it right before them
        let k = tone(["3", "4", "5", "p"], 0.3 + top(x, y) * 1.2, x, y, 0.2)
        if (y > 112 && x > 121 && x < 146) k = y === 113 ? "C" : "c"
        px(x, y, k)
      }
    }
    rect(116, 117, 88, 1, (x) => tone(STEEL, 0.55 + top(x, 116) * 1.5, x, 117))
    // the front, turned from the lamp: two drawers, the kick plate; the card taped on
    rect(117, 118, 86, 22, (x, y) => (y > 136 ? "2" : "3"))
    for (const [x0, x1] of [[122, 157], [163, 198]]) {
      rect(x0, 121, x1 - x0, 1, "1"); rect(x0, 133, x1 - x0, 1, "4"); rect(x0, 121, 1, 13, "1"); rect(x1 - 1, 121, 1, 13, "4")
      rect(Math.round((x0 + x1) / 2) - 3, 125, 7, 1, "5"); rect(Math.round((x0 + x1) / 2) - 3, 126, 7, 1, "k")
    }
    rect(116, 140, 88, 1, "k"); px(116, 117, "k"); px(203, 117, "k")
    for (let y = 117; y < 140; y++) { px(116, y, "k"); px(203, y, "k") }
    rect(165, 120, 31, 14, "%"); rect(165, 133, 31, 1, "9")
    px(165, 120, "h"); px(166, 120, "h"); px(195, 120, "h"); px(194, 120, "h")                        // the tape
    TXT.draw({ px: (x, y, k) => px(x, y, k) }, 181, 121, "NO", "2", { font: "hud", align: "center" })
    TXT.draw({ px: (x, y, k) => px(x, y, k) }, 181, 127, "REFUNDS", "2", { font: "hud", align: "center" })
    // the old screens stacked at its left end, facing the room: text running on the lower, a camera on the upper; a band rolling down
    const crt = (x, y, w, h, scr) => {
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
        const edge = i === 0 || j === 0 || i === w - 1 || j === h - 1
        // the old casing: its top in the lamp's light, its side away from it darker
        px(x + i, y + j, edge ? "k" : j === 1 ? "h" : i === 1 ? "G" : i > w - 3 ? "2" : "g")
      }
      const sx = x + 3, sy = y + 3, sw = w - 6, sh = h - 7
      for (let j = 0; j < sh; j++) for (let i = 0; i < sw; i++) {
        if ((i === 0 || i === sw - 1) && (j === 0 || j === sh - 1)) { px(sx + i, sy + j, "1"); continue }
        let k = scr(i, j, sw, sh)
        if ((j - f + 24) % 12 < 2) k = { c: "C", C: "v", v: "V", t: "C" }[k] ?? k
        px(sx + i, sy + j, k)
      }
      rect(x + 2, y + h - 3, 3, 1, "1"); px(x + w - 4, y + h - 3, f % 4 < 2 ? "v" : "C")
    }
    crt(120, 95, 28, 18, (i, j) => {
      const row = Math.floor((j + f) / 2), len = 4 + Math.floor(hash(row % 6, 3) * 14)
      return (j + f) % 2 === 0 && i > 0 && i < len ? "v" : "c"
    })
    crt(124, 79, 22, 17, (i, j, w, h) => {
      if (j === 0) return i < 6 || i > 11 ? (i % 2 ? "C" : "v") : "c"
      const door = i > 9 && i < 13 && j > 2, fl = j > h - 4 && Math.abs(i - w / 2) < (j - (h - 4)) * 3 + 2
      const who = (i === 5 || i === 6) && j > 3 && j < h - 1 || (i === 5 && j === 3)
      return who ? "c" : door ? "C" : fl ? "t" : (i + j) % 2 ? "c" : "t"
    })
    // the laptop at its right end, its lid toward us (Sable reads it), a sticker on the lid, the light of its screen at the lid's edge
    rect(176, 99, 22, 13, (x, y) => (x === 176 || x === 197 || y === 99 ? "k" : y === 100 ? "4" : x === 177 ? "3" : "2"))
    rect(177, 98, 20, 1, "c")
    rect(184, 103, 5, 4, "H"); px(185, 104, "k"); px(187, 104, "k"); px(186, 105, "k")
    px(195, 110, f < 8 ? "v" : "c")
    // the pipe's things: its tobacco tin, the ashtray with the ash knocked out of it
    rect(199, 108, 4, 4, "P"); rect(199, 108, 4, 1, "Q"); rect(199, 110, 4, 1, "O")
    rect(152, 111, 7, 2, "4"); rect(153, 110, 5, 1, "g"); px(155, 110, "O"); px(152, 111, "5")
  }
  return { W, H, room, desk, DESK_AT, DESK_BASE, CURTAIN }
})()

anim("sable_booth_bg", { w: SB.W, h: SB.H, frames: 12, fps: 10 }, SB.room)
anim("sable_booth_desk", { w: 96, h: 66, frames: 12, fps: 10 }, SB.desk)

// The look up from the Kessel Block's roof at the Rings (room dach_blick, game/stadt.js), painted on the lines of the block the
// user chose (2026-11-13: "exactly this view", build/shots/k1_dach_blick_1x.png, the block dach_blick_bg, then in art/mock/ch1_blocks.px.js).
// "Da oben ist nicht der Himmel. Da oben ist der Boden von jemand anderem."
//
//   dach_blick_bg   320x180, a still. Straight up along the spine: the Rings as concentric ceilings, each with a hole round the
//                   spine, the nearer the wider (the block's numbers: CX, CY, Q, RINGS, kept exactly). On each underside the steel
//                   plates in bands between radial girders (their left flanks catching the light), seams with a lit lip, here a
//                   darker replaced plate, a vent (some warm with the life above), a hatch, the city's camera domes; the inner rims
//                   lit magenta by the streets of the Ring below, the light falling off over the steel; the lamps round each hole
//                   (amber near, pale further up) where the block put them, each with its pool. Between one Ring and the next the
//                   smog lit from below, and on the far side of a hole the Ring's thickness with its windows. The further up, the
//                   deeper in the haze: the steel goes lilac and soft, until the Crown is only a cold white glow at (160,58). The
//                   spine rises from the bottom middle into it, as the block drew it: its lit left side, its floors closing up as it
//                   goes, its lift of cyan cabins, a collar where it passes each Ring. The parapet's wet edge at 166, under it dark
//                   and calm for the lines (the game draws them over the bottom; its rain is the engine's fx, not painted).
//
// Colours: the world palette (style guide §5) with the smog lit from below of the roof's photo and a lilac haze lit by the Crown.
// Dithering only where light falls off (the rims' magenta, the lamps' pools, the haze, the Crown's glow), never on the steel.
//   PXL build art/rooms/dach_blick.px.js --out build/paint/dach_blick
pal({
  k: "#0c0e1a",
  1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  n: "#3e1240", M: "#a8238a", m: "#ff4fd3", N: "#ffc0f2",
  O: "#552b1c", P: "#b0602a", Q: "#eea040", R: "#ffd58a", W: "#fff4d8",
  c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",
  r: "#7e1420", q: "#ff3a3a",
  b: "#1b1a33", B: "#261d3e", D: "#35214c", G: "#47275a",                          // smog lit from below (the roof's photo)
  a: "#2c2026", A: "#4a3026",                                                       // steel in a lamp's warm light
  h: "#2b2a48", i: "#3b3a62", j: "#55578a", J: "#8a90bc", L: "#a8b8d0", X: "#e8eeff", // the haze, lit by the Crown, and its white
})

const DACH_BLICK = (() => {
  const W = 320, H = 180
  // the block's geometry (the block dach_blick_bg, kept here): the zenith, the ellipses' squash, the Rings' radii
  const CX = 160, CY = 58, Q = 0.62, RINGS = [380, 250, 168, 112, 74, 47, 28, 14], CROWN = RINGS.length - 1, PARAPET = 166
  const GAP = 0.86                                                                   // past this a Ring's outer edge: the smog
  const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5], bay = (x, y) => (BAY[(y & 3) * 4 + (x & 3)] + 0.5) / 16
  const hash = (a, b, s = 0) => { let h = (a * 374761393 + b * 668265263 + s * 2147483647) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
  const ramp = (keys, t, x, y) => { t = Math.max(0, Math.min(keys.length - 1, t)); const f = Math.floor(t); return keys[Math.min(keys.length - 1, f + (bay(x, y) < t - f ? 1 : 0))] }
  const TAU = 2 * Math.PI

  const buf = Array.from({ length: H }, () => Array(W).fill("k"))
  /** what each pixel is: the Ring it shows (-1 none), and what painted it ("steel", "gap", "rim", "lamp", "crown", "spine") */
  const ringOf = Array.from({ length: H }, () => Array(W).fill(-1)), what = Array.from({ length: H }, () => Array(W).fill(""))
  const inside = (x, y) => x >= 0 && x < W && y >= 0 && y < H
  const px = (x, y, k, kind) => { x = Math.round(x); y = Math.round(y); if (!inside(x, y)) return; buf[y][x] = k; if (kind) what[y][x] = kind }
  const polar = (x, y) => { const dx = x - CX, dy = (y - CY) / Q; return [Math.hypot(dx, dy), Math.atan2(dy, dx)] }
  const ringAt = (r) => RINGS.findIndex((R, n) => r <= R && r > (RINGS[n + 1] ?? -1))      // the zenith itself is the Crown's
  // how many screen pixels one unit of radius makes at angle a (the ellipse's squash), and one unit along the circle
  const radial = (a) => Math.hypot(Math.cos(a), Q * Math.sin(a)), tangent = (a) => Math.hypot(Math.sin(a), Q * Math.cos(a))

  // each Ring's steel: the plate, the seams and girders (one darker), their lit flanks and lips, the plates nearest the hole (lit
  // by its lamps). Further up, deeper in the haze: lilac, less contrast
  const STEEL = [
    { base: "1", dark: "k", lit: "2", near: "2" },
    { base: "1", dark: "k", lit: "3", near: "2" },
    { base: "2", dark: "1", lit: "3", near: "3" },
    { base: "2", dark: "1", lit: "4", near: "3" },
    { base: "3", dark: "2", lit: "i", near: "h" },
    { base: "h", dark: "3", lit: "j", near: "i" },
    { base: "i", dark: "h", lit: "j", near: "j" },
  ]
  // light falling on what is there: the streets' magenta from below, a lamp's warmth, the Crown's white (one step each)
  const MAG = { k: "b", 1: "B", 2: "B", 3: "D", 4: "G", 5: "G", h: "D", i: "G", j: "G", b: "B", B: "D" }
  const WARM = { k: "a", 1: "a", 2: "a", 3: "A", 4: "A", h: "A", i: "A", b: "a", B: "A", D: "A", n: "A" }
  const LIFT = { 3: "h", 4: "i", h: "i", i: "j", j: "J", 2: "3", 5: "j", 6: "J", J: "L", G: "j", D: "i" }
  const light = (map, x, y) => { const k = map[buf[y][x]]; if (k) buf[y][x] = k }
  // the smog between one Ring and the next, lit from below: magenta near, lilac haze further up (dark to light)
  const SMOG = (i) => (i <= 1 ? "kbBn" : i === 2 ? "bBnD" : i === 3 ? "bBDG" : i === 4 ? "BDGj" : "hiGj")

  // ---- the undersides: plates, flat, one tone a band, the few that differ (a cause each)
  const RIBS = (i) => 26 + i * 2
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const [r, a] = polar(x, y), i = ringAt(r)
    ringOf[y][x] = i
    if (i < 0) { buf[y][x] = "1"; continue }
    if (i === CROWN) { what[y][x] = "crown"; continue }                               // painted below
    const R0 = RINGS[i], R1 = RINGS[i + 1], span = R0 - R1, u = (r - R1) / span
    if (u > GAP) {                                                                    // the smog: brighter towards the nearer Ring's rim
      const t = (u - GAP) / (1 - GAP)
      buf[y][x] = ramp(SMOG(i), i >= 5 ? 1 + t : 0.6 + t * 2.4, x, y)               // the thin gaps up high: one step, not three; what[y][x] = "gap"; continue
    }
    const S = STEEL[i], band = Math.min(4, Math.floor(u * 5)), ribs = RIBS(i)
    const sf = ((a + Math.PI) * ribs / TAU + 0.5), sector = Math.floor(sf) % ribs, fs = sf - Math.floor(sf)
    let k = band === 0 ? S.near : S.base
    // a few plates differ: replaced (a step darker), a vent (dark slats; warm where someone's heat comes through), a hatch
    const h = hash(i * 97 + band, sector, 5), bandPx = span / 5 * radial(a), fr = (u * 5 - band) * bandPx, wide = TAU * r / ribs * tangent(a)
    const fsPx = fs * wide, interior = fr > 1.5 && fr < bandPx - 1.5 && fsPx > 2 && fsPx < wide - 2
    if (band > 0 && i <= 5 && h < 0.08) k = S.dark
    else if (band > 0 && i <= 3 && h < 0.13 && interior && fs > 0.22 && fs < 0.78) {
      if (Math.floor(fr) % 2 === 0) k = S.dark
      else if (hash(i, sector, band) < 0.4) k = fs > 0.36 && fs < 0.64 && Math.floor(fr) % 4 === 1 ? "O" : "a"   // a warm grille: the life above
    } else if (band > 0 && i <= 3 && h < 0.16 && interior) {
      const ex = Math.min(fr - 2, bandPx - 2 - fr, fsPx - 3, wide - 3 - fsPx)
      if (ex >= 0 && ex < 1) k = S.dark; else if (ex >= 1 && ex < 2 && fr < bandPx / 2) k = S.lit
    }
    buf[y][x] = k; what[y][x] = "steel"
  }

  // the Ring's thickness on the far side of each hole (the top): its wall, a row of windows where it is thick enough
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = ringOf[y][x]; if (i < 1 || i >= CROWN || what[y][x] !== "gap") continue
    const [r, a] = polar(x, y), Rn = RINGS[i], up = Math.max(0, -Math.sin(a)), th = (Rn - RINGS[i + 1]) * (1 - GAP) * 0.8 * up
    const depth = Rn - r; if (depth > th || up < 0.25) continue
    let k = depth < 0.9 ? "2" : i <= 3 ? "3" : "h"
    if (th * Q > 1.6 && depth > 0.9 && depth < th - 0.6 && hash(Math.round(a * Rn / 1.5), i, 3) < 0.3) k = i <= 3 ? (hash(x, i, 8) < 0.5 ? "P" : "Q") : "J"
    buf[y][x] = k; what[y][x] = "face"
  }

  // the seams round each Ring (a dark line, its lip on the hole's side lit) and the girders out from the hole: rasterised so each
  // is one clean pixel line; the girders' left (or upper) flank catches the light
  const onSteel = (x, y, i) => inside(x, y) && ringOf[y][x] === i && what[y][x] === "steel"
  const ellipse = (rr, fn) => { const n = Math.ceil(rr * 8); for (let s = 0; s < n; s++) { const a = s * TAU / n; fn(CX + rr * Math.cos(a), CY + rr * Q * Math.sin(a), a) } }
  for (let i = 0; i < CROWN; i++) {
    const R0 = RINGS[i], R1 = RINGS[i + 1], span = R0 - R1, S = STEEL[i]
    for (let b = 1; b <= 4; b++) {
      if (i === CROWN - 1) break                                                     // the last Ring's plates too small to draw: only its girders
      const rr = R1 + span * b / 5 - 1
      ellipse(rr, (x, y, a) => { x = Math.round(x); y = Math.round(y); if (onSteel(x, y, i)) buf[y][x] = S.dark })
      if (i <= 4) ellipse(rr - 1 / radial(0) , () => {})
      if (i <= 4) { const n = Math.ceil(rr * 8); for (let s = 0; s < n; s++) { const a = s * TAU / n, d = 1 / radial(a), x = Math.round(CX + (rr - d) * Math.cos(a)), y = Math.round(CY + (rr - d) * Q * Math.sin(a)); if (onSteel(x, y, i) && buf[y][x] !== S.dark) buf[y][x] = S.lit } }
    }
    const ribs = RIBS(i), core = i <= 1 ? 2 : 1, flank = i <= 4
    for (let s = 0; s < ribs; s++) {
      if (i === CROWN - 1 && s % 2) continue
      const a = -Math.PI + (s + 0.5) * TAU / ribs, ca = Math.cos(a), sa = Math.sin(a), steep = Math.abs(ca) < Math.abs(Q * sa)
      const [ox, oy] = steep ? [1, 0] : [0, 1]
      for (let rr = R1 + 1; rr < R1 + span * GAP; rr += 0.25) {
        const x = Math.round(CX + rr * ca), y = Math.round(CY + rr * Q * sa)
        for (let o = 0; o < core; o++) if (onSteel(x + ox * o, y + oy * o, i)) buf[y + oy * o][x + ox * o] = S.dark
        if (flank && onSteel(x - ox, y - oy, i) && buf[y - oy][x - ox] !== S.dark) buf[y - oy][x - ox] = S.lit
      }
    }
  }

  // the pipes that ride the girders on the near Rings: every fifth, along its flank, the side to the street lit magenta
  for (const i of [1, 2]) {
    const R0 = RINGS[i], R1 = RINGS[i + 1], span = R0 - R1, ribs = RIBS(i)
    for (let s = 2; s < ribs; s += 5) {
      const a = -Math.PI + (s + 0.5) * TAU / ribs, ca = Math.cos(a), sa = Math.sin(a), steep = Math.abs(ca) < Math.abs(Q * sa)
      const [ox, oy] = steep ? [1, 0] : [0, 1], o = i === 1 ? 3 : 2
      for (let rr = R1 + span * 0.08; rr < R1 + span * 0.8; rr += 0.25) {
        const x = Math.round(CX + rr * ca) + ox * o, y = Math.round(CY + rr * Q * sa) + oy * o
        if (y > 136 && Math.abs(x - CX) < 90) continue                                  // the lines' place stays calm
        if (onSteel(x, y, i)) buf[y][x] = "k"
        if (onSteel(x + ox, y + oy, i)) buf[y + oy][x + ox] = bay(x, y) < 0.5 ? "n" : "B"
      }
    }
  }

  // the magenta of the streets below, on the steel round each hole, falling off away from it; the haze thickening towards the
  // gap before the next Ring (both dithered: light)
  const RIMGLOW = [0.75, 0.75, 0.7, 0.55, 0.4, 0, 0]                                 // the last two: the Crown's light outshines it
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = ringOf[y][x]; if (i < 0 || i >= CROWN || what[y][x] !== "steel") continue
    const [r] = polar(x, y), u = (r - RINGS[i + 1]) / (RINGS[i] - RINGS[i + 1])
    if (u < 0.16 && bay(x, y) < RIMGLOW[i] * (1 - u / 0.16)) light(MAG, x, y)
    if (i === 3 && u > GAP - 0.1 && bay(x, y) < (u - (GAP - 0.1)) / 0.1 * 0.4) buf[y][x] = SMOG(i)[1]
  }

  // the inner rims, lit from below: bright magenta on the nearest, deep magenta, then steel in the haze; under the near ones the
  // brightest light where the street is closest, and drops hanging from the lip
  const RIM = [["m", "M"], ["m", "M"], ["M", "n"], ["M", "n"], ["J", "h"], ["J", "i"], ["L", "j"]]
  for (let i = 0; i < CROWN; i++) {
    const R1 = RINGS[i + 1], [lip, glow] = RIM[i], width = (RINGS[i] - R1) * 0.03
    const n = Math.ceil(R1 * 10)
    for (let s = 0; s < n; s++) {
      const a = s * TAU / n, ca = Math.cos(a), sa = Math.sin(a)
      for (let d = 0.35; d <= Math.max(0.6, width); d += 0.3) {
        const x = Math.round(CX + (R1 + d) * ca), y = Math.round(CY + (R1 + d) * Q * sa)
        if (!inside(x, y) || ringOf[y][x] !== i) continue
        buf[y][x] = i <= 1 && sa > 0.55 && d < 0.7 && bay(x, y) < 0.3 ? "N" : lip; what[y][x] = "rim"
      }
      const d = width + 1 / radial(a), x = Math.round(CX + (R1 + d) * ca), y = Math.round(CY + (R1 + d) * Q * sa)
      if (inside(x, y) && ringOf[y][x] === i && what[y][x] === "steel") buf[y][x] = glow
    }
    // drops on the lip, caught in its light
    if (i >= 1 && i <= 3) for (let s = 0; s < 22; s++) {
      const a = (s + hash(s, i, 2)) * TAU / 22, sa = Math.sin(a); if (sa < 0.2) continue
      const x = Math.round(CX + (R1 - 1) * Math.cos(a)), y = Math.round(CY + (R1 - 1) * Q * sa) + 1
      if (y > 140 && Math.abs(x - CX) < 100) continue
      if (inside(x, y) && hash(s, i, 4) < 0.5 && what[y][x] !== "rim") buf[y][x] = i === 1 ? "N" : "m"
    }
  }

  // the lamps round each hole where the block put them: amber near, each with its warm pool on the steel and a housing over it;
  // pale further up, softened by the haze
  RINGS.slice(0, -1).forEach((R, n) => {
    const rim = RINGS[n + 1], N = 18 + n * 2
    for (let k = 0; k < N; k++) {
      const a = (k + (n % 2) * 0.5) * TAU / N, x = Math.round(CX + (rim + 4) * Math.cos(a)), y = Math.round(CY + (rim + 4) * Q * Math.sin(a))
      if (!inside(x, y)) continue
      if (n < 3) {
        const rx = n < 2 ? 5 : 3, ry = n < 2 ? 3 : 2
        for (let dy = -ry; dy <= ry; dy++) for (let dx = -rx; dx <= rx; dx++) {
          const e = (dx / rx) ** 2 + (dy / ry) ** 2, xx = x + dx, yy = y + dy
          if (e < 1 && inside(xx, yy) && what[yy][xx] === "steel" && bay(xx, yy) < (1 - e) * 0.8) light(WARM, xx, yy)
        }
        if (inside(x, y - 1) && what[y - 1][x] !== "rim") buf[y - 1][x] = STEEL[n].dark
        px(x, y, "R", "lamp"); if (n < 2) { px(x - 1, y, "Q", "lamp"); px(x + 1, y, "Q", "lamp") } else { px(x - 1, y, "P", "lamp"); px(x + 1, y, "P", "lamp") }
        if (n < 2) px(x, y + 1, "P", "lamp")
      } else {
        const core = n === 3 ? "L" : n === 4 ? "L" : "J", halo = n === 3 ? "j" : "i"
        for (const [dx, dy] of [[-1, 0], [1, 0], [0, 1]]) if (inside(x + dx, y + dy) && what[y + dy][x + dx] === "steel" && bay(x + dx, y + dy) < 0.55) buf[y + dy][x + dx] = halo
        px(x, y, core, "lamp")
      }
    }
  })

  // the city's eyes under the near Rings: a few camera domes, their red point lit on two (the system watching, sparingly)
  for (const [x, y, red] of [[34, 34, true], [276, 22, false], [300, 120, false], [62, 112, true], [226, 12, false]]) {
    if (what[y][x] !== "steel") continue
    px(x - 1, y, "k"); px(x, y, "k"); px(x + 1, y, "k"); px(x - 1, y + 1, "3"); px(x, y + 1, red ? "q" : "4"); px(x + 1, y + 1, "2"); px(x, y - 1, "1")
  }

  // the Crown: a cold white glow, falling off into the haze; its light lifting the two Rings under it
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const [r] = polar(x, y), i = ringOf[y][x]
    if (i === CROWN) { buf[y][x] = ramp("ijJLXX", (1 - r / RINGS[CROWN]) * 5.4 + 0.2, x, y); continue }
    // a step lighter in whole: the last Ring before it, and the next one's inner half; only the edge of that light dithered
    if (i < 4 || what[y][x] === "lamp" || what[y][x] === "rim") continue
    const t = r < 35 ? 1 : r < 39 ? (39 - r) / 4 * 0.6 : 0
    if (t >= 1 || bay(x, y) < t) light(LIFT, x, y)
  }
  // its edge: the last hole's rim, pale
  ellipse(RINGS[CROWN] + 0.5, (x, y) => { x = Math.round(x); y = Math.round(y); if (inside(x, y) && ringOf[y][x] === CROWN - 1) buf[y][x] = "J" })

  // ---- the spine (the block's: from the near towers up through every hole, narrowing): its lit left edge and side, its dark right,
  // its floors closing up as it rises, a collar where it passes each Ring, the lift's cyan cabins in their groove
  const SPINE = (y) => { const w = 1 + (y - CY) * 0.2; return [Math.round(CX - w), Math.round(CX + w), w] }
  const floorAt = new Set(); for (let f = 3; CY + f < H; f *= 1.16) floorAt.add(Math.round(CY + 2 + f))
  const collars = RINGS.slice(2, CROWN).map((R) => Math.round(CY + R * Q))        // 162 (under the lines), 127, 104, 87, 75, 66
  for (let y = CY + 2; y < H; y++) {
    const [x0, x1, w] = SPINE(y)
    for (let x = x0; x <= x1; x++) {
      const litSide = x < x0 + w * 0.5
      let k = x === x0 ? "4" : litSide ? "3" : "2"
      if (x === x1 && w > 2) k = "1"
      if (floorAt.has(y) && x > x0 && x < x1) k = litSide ? "2" : "1"
      px(x, y, k, "spine")
    }
    // windows on the lit side between the floors: a few, warm or the screens' cyan
    if (w > 4 && !floorAt.has(y)) for (let x = x0 + 2; x < x0 + w * 0.5; x += 2) { const h = hash(x, y, 11); if (h < 0.05) px(x, y, h < 0.03 ? "P" : "C") }
    // the street's magenta on its lit edge, near the bottom
    if (y > 130 && bay(x0, y) < (y - 130) / 60) px(x0, y, "D")
    if (w >= 3) px(CX, y, floorAt.has(y) ? "k" : "1")                                  // the lift's groove
  }
  for (const y of collars) {
    const [x0, x1] = SPINE(y)
    for (let x = x0 - 1; x <= x1 + 1; x++) { px(x, y, x <= x0 ? "5" : "4", "spine"); px(x, y + 1, "1", "spine") }
    px(x1 + 1, y - 1, y === 104 ? "q" : "v", "spine")                                   // the checkpoints' lights; one red, the system's eye
  }
  // the lift's cabins where the block lit them, the near ones with a bright top and the light in the groove round them
  for (let y = CY + 6, s = 2; y < H; y += s, s += 2) {
    if (y > 92) { px(CX, y - 1, "c"); px(CX, y + 2, "c") }
    px(CX, y, y > 92 ? "V" : "v"); px(CX, y + 1, "v")
  }

  // ---- the parapet's edge where she stands: its wet top catching the glow, then dark and calm for the lines
  for (let x = 0; x < W; x++) {
    px(x, PARAPET, bay(x, PARAPET) < 0.25 ? "4" : "3"); px(x, PARAPET + 1, "2"); px(x, PARAPET + 2, "1")
    for (let y = PARAPET + 3; y < H; y++) px(x, y, "k")
  }
  return { W, H, buf, CX, CY, Q, RINGS, PARAPET, hash }
})()

scene("dach_blick_bg", { w: DACH_BLICK.W, h: DACH_BLICK.H, bg: "k" }, (c) => {
  for (let y = 0; y < DACH_BLICK.H; y++) for (let x = 0; x < DACH_BLICK.W; x++) c.px(x, y, DACH_BLICK.buf[y][x])
})

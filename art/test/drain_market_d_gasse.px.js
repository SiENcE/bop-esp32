// The Drain Market, draft D "the lane" (one of several drafts to compare; not in the game). BLOCKS, 320x180, one screen (a picture in
// one-point perspective doesn't scroll: its vanishing point would slide). Shot like the user's reference photo: at eye height, standing
// in a narrow wet market lane on the channel's bed, the stalls crowding in on both sides right up to the camera and cut by the edges,
// awnings and signs overhead, the lane running away to a bright far end where the city's towers stand beyond the road deck.
//
// Everything stands in metres (X across, h up from the bed, Z away from the eye) and is projected with P. The eye is 1.9 m over the bed,
// so heads sit just under the horizon, as in a photo taken by someone walking. Juno is 50 px tall at Z = 1 (30 px a metre, the style
// guide's scale): the walk band is the near floor, and she can go up to Z ~ 2.6 down the lane, scaled by depth (the engine's `scale`).
//
// The channel's section, left to right: the left bank wall with the old storm culvert (Sable's curtain), the left bank, the canal (the
// water left in the channel, half a metre down, planked over near us), the lane, the stalls on the right; over the lower walls the sloped
// channel walls with shacks on them, and over all of it the road deck 14 m up, its girders and a slit down its middle where the towers'
// light falls in, with the rain.
//
// What the story needs:
//   near left:  Ratz's junk stall on the planks over the canal: striped tarp, WIRES & JUNK, a glowing vending cube cut by the left edge,
//               Ratz on the counter
//   near right: the food stall: wok fire, the steaming pot, trays of fish balls, the cook cut by the right edge, FISH BALLS down a blade
//   left, mid:  a plank bridge over the canal to the culvert in the bank wall, the plum curtain in it, the magenta leaking out (Sable)
//   right, mid: the steel stairs UP (to the alley, where Juno arrives), climbing the right slope into the alley's pale light, EXIT;
//               behind them the chop shop: KIDNEYS ONLY on a light box hung out over the lane, used implants in lit jars
//   middle:     the stairs DOWN (Chapter 2): a railed well in the bed, its gate shut, a red lamp, steam rising out of it;
//               the preacher on his crate by the canal, arms up, everyone walking past him
include("../lib/iso.js", { palette: true })
include("../lib/text.js")
pal({
  J: "#22101a", K: "#3a1624", B: "#57222f", F: "#7a3a40",                 // the plum curtain (sable_booth's)
  7: "#33241c", 8: "#54392a", 9: "#7a5638",                               // wood: planks, crates
  b: "#1d1832",                                                           // the haze under the deck, violet
  d: "#8a7a5e", D: "#d8c8a0",                                             // the preacher's coat (style guide §8: coffee with too much milk)
  l: "#3c4560",                                                           // steam's thin edge in the dark
})

const DMD = (() => {
  const W = 320, H = 180, F = 30, VX = 152, VY = 109, EH = 1.9
  const R = Math.round, bay = ISO.bay, hash = ISO.ihash
  /** a point in the channel on the screen */
  const P = (X, h, Z) => [VX + F * X / Z, VY + F * (EH - h) / Z]
  const PR = (X, h, Z) => P(X, h, Z).map(R)
  const poly = (c, pts, k) => c.poly(pts.flatMap((p) => PR(...p)), k)
  /** what the raycast found at each pixel (floor, water...) and how far: the reflections and the light shaft read them */
  const KIND = new Array(W * H).fill(null), ZB = new Float32Array(W * H).fill(1e9)

  // ---------------------------------------------------------------- the channel's section (metres)
  const LANE_L = -1.6, CANAL_L = -3.8, BANK_L = -5.2, WATER = -0.45, OPEN = 1.3   // the canal is planked over nearer than OPEN
  const LOW_L = 3.0, SLOPE_L = -9.7, WALL_R = 5.6, LOW_R = 2.8, SLOPE_R = 10.2
  const DECK = 14, DECK_END = 9.5, SLIT = [-1.6, 2.6], FAR = 70, GIRDERS = [3.0, 4.6, 6.2, 7.8, 9.4]
  const CULVERT = { Z0: 2.1, Z1: 2.7, top: 2.3 }
  const SHAFT = { X0: -1.6, X1: 2.6, Z0: 3.3, Z1: 9.4 }

  // ---------------------------------------------------------------- light: lamps as points, each with its tones (dark, light)
  const LAMPS = [
    [-2.4, 0.8, 0.7, 1.2, "tT", 1.3],      // the vending cube
    [-2.8, 1.4, 1.05, 1.0, "tT", 1.0],     // Ratz's screens
    [3.8, 1.3, 1.0, 1.5, "aA", 1.4],       // the wok's fire
    [4.0, 2.3, 0.8, 1.3, "aA", 0.9],       // the food stall's bulbs
    [-4.9, 1.0, 2.4, 1.2, "iI", 1.5],      // the curtain's leak
    [-3.8, 6.4, 2.2, 1.9, "tT", 0.6],      // TIDE MODS
    [2.4, 3.6, 1.25, 1.8, "iI", 0.5],      // BUY SELL FORGET
    [3.8, 1.3, 2.6, 1.0, "tT", 1.0],       // the jars
    [0.9, 0.6, 2.65, 0.8, "aA", 0.6],      // the steam out of the well, lit from below
    [8.6, 5.4, 1.8, 0.55, "wx", 1.1],       // the alley's light coming down the stairs
    ...[1.75, 2.8, 4.0, 5.6, 7.6].flatMap((z) => [-1.0, 1.0, 2.8].map((x) => [x, 3.0, z, 0.9, "aA", 0.5])),   // the strings of bulbs
    ...[3.4, 4.6, 6.0, 7.4, 9.2, 11.4].map((z, i) => [i % 2 ? -4.0 : 3.8, 1.3, z, 1.0, ["aA", "iI", "tT"][i % 3], 0.9]),   // the far stalls
  ]
  const lightAt = (X, h, Z) => {
    let best = 0, ramp = null
    for (const [lx, lh, lz, r, rp, s] of LAMPS) { const d = Math.hypot(X - lx, h - lh, (Z - lz) * 1.2), v = s / (1 + (d / r) ** 2); if (v > best) { best = v; ramp = rp } }
    return [best, ramp]
  }
  /** a surface's key in the light where it is: flat steps, dithered only where one falls off into the next */
  const tone = (base, X, h, Z, x, y) => {
    const [v, rp] = lightAt(X, h, Z)
    if (!rp || v < 0.3) return base
    if (v > 0.8) return rp[1]
    if (v > 0.55) return bay(x, y) < (v - 0.55) / 0.25 ? rp[1] : rp[0]
    return bay(x, y) < (v - 0.3) / 0.25 ? rp[0] : base
  }

  // ---------------------------------------------------------------- the sky beyond the channel: the city's glow and its towers
  const TOWERS = [[100, 118, 30, "1"], [114, 128, 8, "2"], [126, 138, 44, "1"], [136, 150, 0, "2"], [148, 157, 22, "3"], [156, 170, 6, "2"],
    [168, 178, 36, "1"], [176, 192, 4, "2"], [190, 204, 40, "1"]]
  const sky = (c) => {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const t = y / VY, q = bay(x, y)
      c.px(x, y, t < 0.3 ? "b" : t < 0.6 ? (q < (t - 0.3) / 0.3 ? "u" : "b") : t < 0.82 ? (q < (t - 0.6) / 0.22 ? "n" : "u") : t < 0.93 ? (q < (t - 0.82) / 0.11 ? "M" : "n") : "M")
    }
    for (const [x0, x1, top, k] of TOWERS) {
      c.rect(x0, top, x1 - x0, VY + 2 - top, k)
      for (let y = top + 3; y < VY; y += 3) for (let x = x0 + 1; x < x1 - 1; x += 2) {
        const q = hash(x * 3 + x0, y * 5 + top)
        if (q < 0.22) c.px(x, y, "Q"); else if (q < 0.3) c.px(x, y, "C"); else if (q < 0.33) c.px(x, y, "M")
      }
    }
    for (let x = 98; x < 206; x++) for (let y = 98; y < VY + 2; y++) { const q = hash(x, y * 3); if (q < 0.28 + (y - 98) * 0.05) c.px(x, y, q < 0.08 ? "W" : q < 0.2 ? "Q" : q < 0.32 ? "m" : "M") }   // the towers' feet: shops and signs
    // Nagi·wa's sleep ad high on the tallest tower, seen through the slit (cyan: the city's screens); its aircraft light (red: the system's eye)
    c.rect(141, 37, 29, 12, "k"); c.rect(142, 38, 27, 10, "C"); c.rect(143, 39, 25, 8, "c")
    TXT.draw(c, 156, 39, "LULL", "V", { font: "nagiwa", align: "center" })
    c.rect(161, 4, 3, 2, "q")
  }

  // ---------------------------------------------------------------- the big surfaces, ray by ray: floor, canal, walls, slopes, deck
  const surfaces = (c) => {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const dx = (x + 0.5 - VX) / F, dy = (y + 0.5 - VY) / F
      let best = 1e9, kind = null
      const hit = (Z, k) => { if (Z > 0.05 && Z < best) { best = Z; kind = k } }
      if (dy > 0) {
        let Z = EH / dy, X = dx * Z
        if (Z < FAR) {
          if (X >= LANE_L && X <= WALL_R) hit(Z, "floor")
          else if (X < LANE_L && X >= BANK_L && Z < OPEN) hit(Z, "deck")
          else if (X <= CANAL_L && X >= BANK_L && Z >= OPEN) hit(Z, "bank")
        }
        Z = (EH - WATER) / dy; X = dx * Z
        if (X > CANAL_L && X < LANE_L && Z >= OPEN && Z < FAR) hit(Z, "water")
      }
      if (dx < 0) {
        let Z = CANAL_L / dx, h = EH - dy * Z
        if (h >= WATER && h < 0 && Z >= OPEN) hit(Z, "canalwall")
        Z = BANK_L / dx; h = EH - dy * Z
        if (h >= 0 && h < LOW_L) hit(Z, "wallL")
        Z = (EH - LOW_L - BANK_L) / (dy - dx)                      // the slope: h - LOW_L = BANK_L - X
        if (Z > 0) { const X = dx * Z; if (X <= BANK_L && X >= SLOPE_L) hit(Z, "slopeL") }
        Z = SLOPE_L / dx; h = EH - dy * Z
        if (h >= LOW_L + BANK_L - SLOPE_L && h < 40) hit(Z, "upL")
      }
      if (dx > 0) {
        let Z = WALL_R / dx, h = EH - dy * Z
        if (h >= 0 && h < LOW_R) hit(Z, "wallR")
        Z = (EH - LOW_R + WALL_R) / (dy + dx)                      // the slope: h - LOW_R = X - WALL_R
        if (Z > 0) { const X = dx * Z; if (X >= WALL_R && X <= SLOPE_R) hit(Z, "slopeR") }
        Z = SLOPE_R / dx; h = EH - dy * Z
        if (h >= LOW_R + SLOPE_R - WALL_R && h < 40) hit(Z, "upR")
      }
      if (dy < 0) {
        const Z = (EH - DECK) / dy, X = dx * Z
        if (Z < DECK_END && !(X > SLIT[0] && X < SLIT[1] && Z > 2.4)) hit(Z, Math.abs(X - SLIT[0]) < 0.15 || Math.abs(X - SLIT[1]) < 0.15 ? "slitEdge" : "under")
        for (const g of GIRDERS) { const h = EH - dy * g, X = dx * g; if (h > 13.1 && h < DECK && X > SLOPE_L && X < SLOPE_R) hit(g, h < 13.25 ? "girderEdge" : "girder") }
      }
      if (!kind) continue
      const Z = best, X = dx * Z, h = EH - dy * Z
      KIND[x + y * W] = kind; ZB[x + y * W] = Z
      c.px(x, y, haze(surfaceKey(kind, X, h, Z, x, y), kind, Z, x, y))
    }
  }
  const surfaceKey = (kind, X, h, Z, x, y) => {
    switch (kind) {
      case "floor": {
        if (X < LANE_L + 0.16) return X < LANE_L + 0.07 && hash(Math.floor(Z * 2.5), 7) > 0.18 ? (Z < 3 ? "v" : "C") : "4"   // the canal's kerb, its LED strip
        if (Math.abs(Z % 3) < 0.012 * Z * Z) return tone("f", X, 0, Z, x, y)                // the expansion joints
        return tone("e", X, 0, Z, x, y)
      }
      case "deck": return (Z * 5) % 1 < 0.14 ? "k" : tone("7", X, 0, Z, x, y)
      case "bank": return tone("1", X, 0, Z, x, y)
      case "water": return hash(R(Z * 9), 3) < 0.25 ? tone("e", X, 0, Z, x, y) : "k"
      case "canalwall": return "1"
      case "wallL": {
        if (Z >= CULVERT.Z0 - 0.08 && Z < CULVERT.Z1 + 0.08 && h < CULVERT.top + 0.12) return Z < CULVERT.Z0 || Z >= CULVERT.Z1 || h >= CULVERT.top ? "4" : "k"
        if (Math.abs(h - 1.6) < 0.06) return "3"                                            // the old tide mark
        return Z % 1.5 < 0.05 ? "1" : tone("2", X, h, Z, x, y)
      }
      case "wallR": return Math.abs(h - 1.6) < 0.06 ? "3" : tone("2", X, h, Z, x, y)
      case "slopeL": case "slopeR": return (h % 1.2) < 0.12 ? "3" : tone("2", X, h, Z, x, y)
      case "upL": case "upR": {
        // the underside of the city's houses: their windows, more of them lit where the deck ends and the sky begins
        const i = Math.floor(Z / 2.2), j = Math.floor(h / 2.6), u = (Z / 2.2) % 1, v = (h / 2.6) % 1
        if (u > 0.25 && u < 0.7 && v > 0.3 && v < 0.75) { const q = hash(i * 7 + (kind === "upL" ? 1 : 2), j * 13); return q < (Z > DECK_END ? 0.45 : 0.22) ? (q < 0.1 ? "C" : "Q") : q < 0.5 ? "O" : "1" }
        return "1"
      }
      case "under": return Math.abs((X + 20) % 2.5) < 0.12 ? "2" : "1"
      case "slitEdge": return "4"
      case "girder": return Math.abs(X - 0.5) < 2.3 ? "3" : "2"
      case "girderEdge": return Math.abs(X - 0.5) < 2.3 ? "5" : "3"
    }
    return "k"
  }

  /** the air between: far surfaces sink into the violet haze, the far floor and water take the glow of the city at the lane's end */
  const HAZE = { k: "b", 1: "b", 2: "u", 3: "u", e: "b", f: "u", 7: "u" }
  const haze = (k, kind, Z, x, y) => {
    if (Z < 6) return k
    const t = Math.min(1, (Z - 6) / 16), wet = kind === "floor" || kind === "water"
    if (wet && Z > 11 && bay(x, y) < t * 0.8) return Math.abs(x - VX - 4) < 10 * t ? "M" : "i"
    return bay(x, y) < t * 0.7 && HAZE[k] ? HAZE[k] : k
  }

  // ---------------------------------------------------------------- the light falling through the slit, with the rain in it
  const LIFT = { k: "b", 1: "b", b: "w", u: "w", 2: "w", e: "w", f: "w", z: "w", n: "I", 3: "x", 4: "x", w: "x" }
  const shaft = (c) => {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (ZB[x + y * W] > 1e8) continue
      const dx = (x + 0.5 - VX) / F, dy = (y + 0.5 - VY) / F, zEnd = Math.min(ZB[x + y * W], 30)
      // the part of the ray inside the shaft's box
      let a = SHAFT.Z0, b = Math.min(SHAFT.Z1, zEnd)
      if (dx !== 0) { const z0 = SHAFT.X0 / dx, z1 = SHAFT.X1 / dx; a = Math.max(a, Math.min(z0, z1)); b = Math.min(b, Math.max(z0, z1)) } else if (SHAFT.X0 > 0 || SHAFT.X1 < 0) continue
      if (dy > 0) b = Math.min(b, EH / dy + 0.01); else if (dy < 0) b = Math.min(b, (EH - DECK) / dy)
      const len = b - a
      if (len <= 0) continue
      const k = c.key(x, y), d = Math.min(1, len / 3.5) * 0.7
      if (bay(x, y) < d && LIFT[k]) c.px(x, y, LIFT[k])
    }
    // rain falls only where the slit lets it in, lit by the shaft
    for (let i = 0; i < 90; i++) {
      const X = SHAFT.X0 + hash(i, 1) * (SHAFT.X1 - SHAFT.X0), Z = SHAFT.Z0 + 0.3 + hash(i, 2) * (SHAFT.Z1 - SHAFT.Z0 - 0.5), h = 0.3 + hash(i, 3) * 12
      const [x, y] = PR(X, h, Z)
      if (x < 0 || y < 0 || x >= W || y >= H || ZB[x + y * W] < Z) continue
      c.px(x, y, "x"); c.px(x + 1, y + 1, "x"); if (Z < 6) c.px(x + 2, y + 2, "w")
    }
  }

  // ---------------------------------------------------------------- signs: data first, so the wet floor can mirror them before they are drawn
  // a sign facing us: X0..X1, h0..h1 at depth Z; board, neon tube round it, the letters, font; `hang` its cables up, `arm` its bracket
  const SIGNS = [
    { id: "tide", X0: -6.0, X1: -1.6, h0: 5.9, h1: 7.0, Z: 2.2, board: "c", tube: "v", ink: "V", text: "TIDE MODS", font: "nagiwa", hang: [-5.6, -2.0], glow: "cyan" },
    { id: "gills", X0: -5.35, X1: -2.25, h0: 5.45, h1: 5.75, Z: 2.2, board: "n", ink: "m", text: "GILLS -40%", font: "hud", glow: "magenta" },
    { id: "forget", X0: 0.3, X1: 4.7, h0: 3.6, h1: 4.3, Z: 1.25, board: "n", tube: "M", ink: "N", text: "BUY SELL FORGET", font: "nagiwa", hang: [0.7, 4.3], glow: "magenta" },
    { id: "kidneys", X0: 2.05, X1: 4.95, h0: 1.95, h1: 3.0, Z: 2.25, board: "V", tube: "v", ink: "c", text: "KIDNEYS\nONLY", font: "hud", arm: 4.95, glow: "cyan" },
    { id: "junk", X0: -4.4, X1: -1.4, h0: 2.0, h1: 2.42, Z: 1.3, board: "c", ink: "v", text: "WIRES & JUNK", font: "hud", glow: "cyan" },
    { id: "exit", X0: 3.35, X1: 4.3, h0: 1.85, h1: 2.25, Z: 1.6, board: "1", ink: "x", text: "EXIT", font: "hud", glow: "cyan" },
    { id: "hotel", X0: 8.6, X1: 9.5, h0: 4.9, h1: 8.5, Z: 1.9, board: "n", tube: "m", ink: "N", text: "HOTEL", vertical: true, glow: "magenta" },
  ]
  // the blade signs further down, sticking out from the stalls on both sides, one behind the other (the reference's stacked signs)
  const BLADES = []
  ;[[3.2, 1, "SIM", "c", "v"], [3.6, -1, "MEDS", "n", "m"], [4.4, 1, "SOUP", "O", "Q"], [5.1, -1, "CHITS", "c", "v"], [5.8, 1, "VAPE", "n", "m"],
    [6.6, -1, "REPAIR", "O", "Q"], [7.5, 1, "TEA", "c", "v"], [8.4, -1, "HOT", "n", "m"], [9.4, 1, "", "O", "Q"], [10.6, -1, "", "c", "v"],
    [12.0, 1, "", "n", "m"], [13.6, -1, "", "O", "Q"], [15.5, 1, "", "c", "v"], [18, -1, "", "n", "m"]]
    .forEach(([Z, side, text, board, ink]) => BLADES.push({ X0: side > 0 ? 2.5 : -3.6, X1: side > 0 ? 3.3 : -2.8, h0: 2.4, h1: 2.4 + Math.max(1.3, text.length * 0.5), Z, board, ink, text, vertical: true, glow: { v: "cyan", m: "magenta", Q: "amber" }[ink] }))
  const MIR = {                    // a light's colours mirrored: on the wet floor (darker) and on the water (as bright as a mirror allows)
    cyan: { floor: ["C", "c"], water: ["v", "C"] }, magenta: { floor: ["M", "n"], water: ["m", "M"] }, amber: { floor: ["P", "O"], water: ["Q", "P"] },
  }
  /** the streaks a light leaves on the wet floor under where its mirror image would be: whole columns, drawn out by the floor's roughness,
   *  each its own length, broken by a dark row now and then; on the canal the same, but bright and wobbling sideways */
  const streak = (c, x0, x1, h0, h1, Z, glow, stretch = 2.4) => {
    const ya = VY + F * (EH + h0) / Z, yb = VY + F * (EH + h1) / Z, m = MIR[glow]
    for (let x = Math.max(0, R(x0)); x <= Math.min(W - 1, R(x1)); x++) {
      const col = hash(x, 77)
      if (col < 0.3) continue
      const len = Math.max(2, (yb - ya) * stretch * (0.4 + col * 0.8)), core = len * 0.4
      for (let y = Math.max(0, R(ya)); y < Math.min(H, ya + len); y++) {
        const kd = KIND[x + y * W]
        if (kd !== "floor" && kd !== "water" && kd !== "deck" && kd !== "bank") continue
        if (ZB[x + y * W] > Z || hash(x, R(y / 3)) < 0.12) continue
        const near = y - ya < core
        if (kd === "water") { const wx = x + (R(y / 2) % 2); if (y % 3) c.px(wx, y, near ? m.water[0] : m.water[1]); continue }
        if (near || hash(x * 5, y) < 0.6) c.px(x, y, near ? m.floor[0] : m.floor[1])
      }
    }
  }
  /** a lit thing's streak, from its place in the channel */
  const streakAt = (X0, X1, h0, h1, Z, glow, stretch) => (c) => { const [x0] = P(X0, 0, Z), [x1] = P(X1, 0, Z); streak(c, x0, x1, h0, h1, Z, glow, stretch) }
  const reflections = (c) => {
    for (const s of [...SIGNS, ...BLADES.filter((b) => b.Z < 6)]) streakAt(s.X0 + 0.05, s.X1 - 0.05, s.h0, s.h1, s.Z, s.glow)(c)
    // the lit things that aren't signs: the curtain's leak, the jars, the wok, the bulbs
    streakAt(-5.2, -4.9, 0.1, 2.2, 2.2, "magenta", 1.3)(c)
    streakAt(3.4, 3.6, 1.0, 2.0, 2.6, "cyan", 1.5)(c)
    for (const [X, Z] of BULBS) if (Z > 3.5) streakAt(X - 0.04, X + 0.04, 2.9, 3.05, Z, "amber", 4)(c)
  }

  const signFace = (c, s) => {
    const [x0, y0] = PR(s.X0, s.h1, s.Z), [x1, y1] = PR(s.X1, s.h0, s.Z), w = x1 - x0, hh = y1 - y0
    for (const X of s.hang ?? []) { const [hx, hy] = PR(X, s.h1, s.Z); c.vline(hx, 0, hy, "k") }
    if (s.arm !== undefined) { const [ax, ay] = PR(s.arm, s.h1 + 0.1, s.Z); c.hline(x0 + 2, ay, ax - x0 - 2, "3"); c.vline(ax, ay, y1 - ay, "3") }
    c.rect(x0 - 1, y0 - 1, w + 2, hh + 2, "k"); c.rect(x0, y0, w, hh, s.board)
    if (s.tube) { c.rect(x0, y0, w, 1, s.tube); c.rect(x0, y1 - 1, w, 1, s.tube); c.rect(x0, y0, 1, hh, s.tube); c.rect(x1 - 1, y0, 1, hh, s.tube) }
    if (!s.text) { if (w >= 3) for (let y = y0 + 2; y < y1 - 2; y += 3) c.hline(x0 + 1, y, Math.max(1, w - 2), s.ink); return }
    const font = s.font, lines = s.text.split("\n").length, th = font === "hud" ? lines * 7 - 2 : lines * 10 - 3
    if (s.vertical) {
      // letters stacked down the blade, the night market's way; too small to read, they are bars
      const n = s.text.length, step = Math.floor((hh - 2) / n)
      if (w < 5 || step < 6) { for (let y = y0 + 2; y < y1 - 2; y += 3) c.hline(x0 + 1, y, Math.max(1, w - 2), s.ink); return }
      ;[...s.text].forEach((ch, i) => TXT.draw(c, x0 + Math.floor(w / 2), y0 + 2 + i * Math.min(7, step), ch, s.ink, { font: "hud", align: "center" }))
      return
    }
    TXT.draw(c, x0 + w / 2, y0 + Math.round((hh - th) / 2), s.text, s.ink, { font, align: "center" })
  }

  // ---------------------------------------------------------------- shapes
  /** a box in the channel: draws the faces the eye sees (the side toward the lane's middle, top or underside, front) */
  const box = (c, X0, X1, h0, h1, Z0, Z1, k) => {
    const kk = typeof k === "string" ? { front: k, side: k, top: k } : k
    if (X1 < 0 && kk.side) poly(c, [[X1, h0, Z0], [X1, h0, Z1], [X1, h1, Z1], [X1, h1, Z0]], kk.side)
    if (X0 > 0 && kk.side) poly(c, [[X0, h0, Z0], [X0, h0, Z1], [X0, h1, Z1], [X0, h1, Z0]], kk.side)
    if (h1 < EH && kk.top) poly(c, [[X0, h1, Z0], [X1, h1, Z0], [X1, h1, Z1], [X0, h1, Z1]], kk.top)
    if (h0 > EH && kk.under) poly(c, [[X0, h0, Z0], [X1, h0, Z0], [X1, h0, Z1], [X0, h0, Z1]], kk.under)
    if (kk.front) poly(c, [[X0, h0, Z0], [X1, h0, Z0], [X1, h1, Z0], [X0, h1, Z0]], kk.front)
  }
  /** a person as blocks: hood or head, coat, legs; seen from behind unless `face`; a rim of the light beside them */
  const figure = (c, X, Z, o = {}) => {
    const h0 = o.h0 ?? 0, tall = o.tall ?? 1.72, s = F / Z, [x, yf] = P(X, h0, Z)
    const hp = tall * s, cx = R(x), foot = R(yf), top = R(yf - hp), w = Math.max(2, R(0.5 * s))
    const head = Math.max(2, R(hp * 0.16)), body = Math.max(2, R(hp * 0.46)), legs = foot - top - head - body
    const coat = o.coat ?? "2", hood = o.hood ?? coat
    if (hp > 14) c.rect(cx - R(w / 2) - 1, top - 1, w + 2, foot - top + 1, "k")
    const hw = Math.max(1, R(w * 0.34))
    c.rect(cx - hw, top, hw * 2, head, hood)
    if (o.face) c.rect(cx - hw + 1, top + R(head * 0.4), Math.max(1, hw * 2 - 2), Math.max(1, R(head * 0.5)), o.face)
    c.rect(cx - R(w / 2), top + head, w, body, coat)
    if (legs > 0) { if (w >= 5) { const lw = R(w * 0.32); c.rect(cx - lw - 1, foot - legs, lw, legs, "1"); c.rect(cx + 1, foot - legs, lw, legs, "1") } else c.rect(cx - 1, foot - legs, 2, legs, "1") }
    if (o.rim) { const rx = o.rimSide > 0 ? cx + R(w / 2) - 1 : cx - R(w / 2); c.rect(rx, top + head, 1, body, o.rim); c.rect(o.rimSide > 0 ? cx + hw - 1 : cx - hw, top, 1, head, o.rim) }
    if (o.brolly) { const r = R(0.55 * s); c.rect(cx - r, top - R(0.25 * s), r * 2, Math.max(1, R(0.12 * s)), o.brolly); c.vline(cx, top - R(0.2 * s), R(0.2 * s), "k") }
  }
  /** flat pale steam: thin layers widening, leaning and thinning out as they climb; the lowest takes the light under it, the top ones
   *  only every other pixel, where the steam is about gone */
  const steam = (c, x, y, rise, lit, seed, lean = 0) => {
    const n = Math.max(4, R(rise / 4))
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), cx = x + lean * rise * t + Math.sin(seed + i * 1.3) * 3 * t, cy = R(y - rise * t)
      const half = 1.5 + t * rise * 0.24 + hash(i, seed) * 2, k = t < 0.2 ? lit : t < 0.55 ? "h" : "l"
      for (let r = 0; r < 3; r++) {
        const w = R(half * (1 - r * 0.25)), yy = cy - r
        for (let xx = R(cx - w); xx <= R(cx + w); xx++) if (t < 0.6 || (xx + yy) % 2 === 0) c.px(xx, yy, r === 0 && t < 0.55 ? k : t < 0.4 ? "h" : "l")
      }
    }
  }

  // ---------------------------------------------------------------- the far part: stalls on both sides, shacks up the slopes, the crowd
  const BULBS = []
  ;[1.75, 2.8, 4.0, 5.6, 7.6].forEach((Z) => { for (let X = -3.4; X <= 3.4; X += Z < 3 ? 0.8 : 1.1) BULBS.push([X, Z]) })
  const LIT = { Q: ["O", "P", "Q"], m: ["n", "M", "m"], v: ["c", "C", "v"] }
  const far = (c) => {
    const items = []
    // the stalls on the right in a row under the slope, their fronts to the lane, lit; on the left bank beyond the canal the same
    for (const [Z0, Z1, glow] of [[3.1, 4.2, "Q"], [4.4, 5.5, "m"], [5.7, 7.2, "v"], [7.4, 9.0, "Q"], [9.2, 11.2, "m"], [11.4, 14, "v"], [14.3, 18, "Q"], [18.4, 24, "m"]]) {
      items.push([Z0, () => {
        const lit = LIT[glow]
        box(c, 3.6, 5.6, 0, 2.3, Z0, Z1, { side: "2", front: "3" })
        poly(c, [[3.6, 0.9, Z0 + 0.1], [3.6, 0.9, Z1 - 0.1], [3.6, 2.0, Z1 - 0.1], [3.6, 2.0, Z0 + 0.1]], lit[0])   // the stall's open front
        poly(c, [[3.6, 1.6, Z0 + 0.1], [3.6, 1.6, Z1 - 0.1], [3.6, 2.0, Z1 - 0.1], [3.6, 2.0, Z0 + 0.1]], lit[1])
        poly(c, [[3.6, 0, Z0], [3.6, 0, Z1], [3.6, 0.9, Z1], [3.6, 0.9, Z0]], "1")                               // the counter
        poly(c, [[3.1, 2.35, Z0], [3.1, 2.35, Z1], [3.6, 2.6, Z1], [3.6, 2.6, Z0]], glow === "Q" ? "P" : lit[1])   // the awning's edge
      }])
    }
    for (const [Z0, Z1, glow] of [[3.0, 4.6, "m"], [4.8, 6.2, "v"], [6.4, 8.3, "Q"], [8.5, 10.6, "v"], [10.8, 13.5, "m"], [13.8, 17, "Q"], [17.4, 24, "v"]]) {
      items.push([Z0, () => {
        const lit = LIT[glow]
        box(c, BANK_L, -4.1, 0, 2.2, Z0, Z1, { side: "2", front: "3" })
        poly(c, [[-4.1, 0.8, Z0 + 0.1], [-4.1, 0.8, Z1 - 0.1], [-4.1, 1.9, Z1 - 0.1], [-4.1, 1.9, Z0 + 0.1]], lit[0])
        poly(c, [[-4.1, 1.5, Z0 + 0.1], [-4.1, 1.5, Z1 - 0.1], [-4.1, 1.9, Z1 - 0.1], [-4.1, 1.9, Z0 + 0.1]], lit[1])
        poly(c, [[-3.6, 2.25, Z0], [-3.6, 2.25, Z1], [-4.1, 2.5, Z1], [-4.1, 2.5, Z0]], glow === "Q" ? "P" : lit[1])
      }])
    }
    // shacks up the slopes in two tiers, their fronts to the lane, a lit window or a strip of neon each, a tin roof's edge
    for (const side of [-1, 1]) for (let Z = 3.4, n = 0; Z < 20; Z += 1.4 + hash(n, side + 5) * 1.1, n++) {
      for (const tier of [0, 1]) {
        const inner = side < 0 ? BANK_L - 0.8 - tier * 1.9 : WALL_R + 0.8 + tier * 1.9, base = side < 0 ? LOW_L + (BANK_L - inner) : LOW_R + (inner - WALL_R)
        const q = hash(n * 3 + tier, side + 9), d = 1.0 + q * 0.6, Zs = Z + tier * 0.6
        if (q < 0.12) continue
        items.push([Zs, () => {
          const X0 = side < 0 ? inner - 1.6 : inner, X1 = side < 0 ? inner : inner + 1.6, k = q < 0.5 ? "Q" : q < 0.7 ? "m" : q < 0.85 ? "v" : "R"
          box(c, X0, X1, base, base + 1.9, Zs, Zs + d, { side: "2", front: "3" })
          const wx = side < 0 ? X1 : X0, za = Zs + d * 0.3, zb = Zs + d * 0.7
          poly(c, [[wx, base + 0.8, za], [wx, base + 0.8, zb], [wx, base + 1.4, zb], [wx, base + 1.4, za]], k)
          poly(c, [[X0 - 0.15, base + 1.9, Zs], [X1 + 0.15, base + 1.9, Zs], [X1 + 0.15, base + 2.1, Zs], [X0 - 0.15, base + 2.1, Zs]], "4")   // the tin roof's edge
        }])
      }
    }
    items.push([3.4, () => {   // the stair up the left slope: flights zigzagging between the tiers, the rail lit
      for (const [Za, Zb, ha, hb] of [[3.4, 5.2, 3.2, 4.6], [5.2, 3.8, 4.6, 6.0]]) {
        const X = (h) => BANK_L - (h - LOW_L) - 0.3, [xa, ya] = PR(X(ha), ha, Za), [xb, yb] = PR(X(hb), hb, Zb)
        c.line(xa, ya, xb, yb, "4"); c.line(xa, ya - 1, xb, yb - 1, "3"); c.line(xa, ya - 4, xb, yb - 4, "P")
      }
    }])
    // the crowd down the lane: hooded backs and faces, a few umbrellas, a rim of the nearest light on the near ones
    for (let i = 0; i < 46; i++) {
      const Z = 3.3 + Math.pow(hash(i, 21), 1.4) * 16, X = -1.3 + hash(i, 22) * 4.6
      const q = hash(i, 23)
      items.push([Z, () => figure(c, X, Z, { coat: q < 0.4 ? "2" : q < 0.7 ? "3" : "4", hood: q < 0.6 ? "2" : "1", face: q > 0.8 ? "s" : null, brolly: q > 0.9 ? "U" : null, rim: Z < 6 ? (X < 1 ? "C" : "P") : null, rimSide: X < 1 ? -1 : 1 })])
    }
    for (const [X, Z] of [[-4.6, 3.8], [-4.5, 6.2], [-4.7, 9.5]]) items.push([Z, () => figure(c, X, Z, { coat: "3", hood: "2", rim: "m", rimSide: 1 })])   // on the far bank
    for (const [X, Z, side] of [[-6.6, 4.1, -1], [6.9, 5.0, 1], [-8.2, 6.6, -1], [8.6, 4.4, 1]]) {
      const h = side < 0 ? LOW_L + (BANK_L - X) : LOW_R + (X - WALL_R)
      items.push([Z, () => figure(c, X, Z, { h0: h, coat: "3", hood: "2", rim: side < 0 ? "Q" : "m", rimSide: -side })])
    }
    // strings of bulbs across the lane, sagging; the nearest ones with a hot core
    for (const Z of [1.75, 2.8, 4.0, 5.6, 7.6]) items.push([Z, () => {
      const [xa, ya] = P(-3.8, 3.3, Z), [xb, yb] = P(3.6, 3.3, Z), sag = 0.45 * F / Z
      for (let x = Math.max(0, R(xa)); x <= Math.min(W - 1, R(xb)); x++) { const t = (x - xa) / (xb - xa); c.px(x, R(ya + (yb - ya) * t + Math.sin(t * Math.PI) * sag), "k") }
      for (const [X, Zb] of BULBS) if (Zb === Z) {
        const [bx] = P(X, 0, Z), t = (bx - xa) / (xb - xa), by = R(ya + (yb - ya) * t + Math.sin(t * Math.PI) * sag) + 1
        if (Z < 3) { c.rect(R(bx), by, 2, 2, "R"); c.px(R(bx), by, "W") } else c.px(R(bx), by, Z < 5 ? "R" : "Q")
      }
    }])
    // cables crossing high up, slack, from slope to slope
    for (const [Z, h, sag] of [[2.2, 7.5, 0.6], [3.1, 8.2, 0.9], [4.3, 6.6, 0.5], [5.9, 9.0, 1.0], [8.2, 7.4, 0.7]]) items.push([Z, () => {
      const [xa, ya] = P(-9, h, Z), [xb, yb] = P(9.2, h - 0.4, Z), sag2 = sag * F / Z
      for (let x = Math.max(0, R(xa)); x <= Math.min(W - 1, R(xb)); x++) { const t = (x - xa) / (xb - xa); c.px(x, R(ya + (yb - ya) * t + Math.sin(t * Math.PI) * sag2), "k") }
    }])
    for (const s of BLADES) items.push([s.Z, () => signFace(c, s)])
    for (const s of SIGNS.filter((s) => s.Z >= 3)) items.push([s.Z, () => signFace(c, s)])
    return items
  }

  // ---------------------------------------------------------------- the middle: the bridge and the curtain, the well, the preacher, the stairs, the chop shop
  const middle = (c) => {
    const items = []
    // Sable's curtain in the old culvert: heavy plum folds, the magenta leaking past its near edge and under its hem
    items.push([CULVERT.Z1, () => {
      const X = BANK_L + 0.02
      for (let Z = CULVERT.Z0 + 0.04; Z < CULVERT.Z1 - 0.04; Z += 0.01) {
        const f = Math.floor((Z - CULVERT.Z0) * 40) % 4, hem = 0.05 + (hash(R(Z * 90), 4) < 0.3 ? 0.08 : 0)
        const [x, yt] = PR(X, CULVERT.top - 0.04, Z), [, yb] = PR(X, hem, Z)
        c.vline(x, yt, yb - yt, ["J", "K", "B", "F"][f])
      }
      const [lx, ly0] = PR(X, CULVERT.top - 0.1, CULVERT.Z0 + 0.04), [, ly1] = PR(X, 0.05, CULVERT.Z0 + 0.04)
      c.vline(lx - 1, ly0 + 3, ly1 - ly0 - 4, "M"); c.vline(lx, ly0 + 1, ly1 - ly0 - 1, "m"); c.vline(lx + 1, ly0 + 4, ly1 - ly0 - 6, "N")                // the gap at its edge
      const [hx0, hy0] = PR(X, 0.02, CULVERT.Z0 + 0.06), [hx1, hy1] = PR(X, 0.02, CULVERT.Z1 - 0.06); c.line(hx0, hy0, hx1, hy1, "m")   // under its hem
    }])
    // the plank bridge over the canal to it, a rope rail each side
    items.push([2.2, () => {
      const Z0 = 2.2, Z1 = 2.58
      poly(c, [[CANAL_L, 0, Z0], [LANE_L, 0, Z0], [LANE_L, -0.12, Z0], [CANAL_L, -0.12, Z0]], "7")
      poly(c, [[CANAL_L - 0.1, 0, Z0], [LANE_L + 0.1, 0, Z0], [LANE_L + 0.1, 0, Z1], [CANAL_L - 0.1, 0, Z1]], "8")
      for (const Z of [2.33, 2.46]) { const [a, ya] = PR(CANAL_L, 0, Z), [b, yb] = PR(LANE_L, 0, Z); c.line(a, ya, b, yb, "7") }
      for (const Z of [Z0, Z1]) {
        const [a, ya] = PR(CANAL_L - 0.05, 0.9, Z), [b, yb] = PR(LANE_L + 0.05, 0.9, Z), [, fa] = PR(CANAL_L - 0.05, 0, Z), [, fb] = PR(LANE_L + 0.05, 0, Z)
        c.line(a, ya + 1, b, yb + 1, "9"); c.vline(a, ya, fa - ya, "8"); c.vline(b, yb, fb - yb, "8")
      }
    }])
    // the preacher of the Waking Church on his crate by the canal: arms up, gecko eyes, a placard; the crowd going past him
    items.push([3.1, () => {
      const X = -1.15, Z = 3.1
      box(c, X - 0.35, X + 0.35, 0, 0.45, Z - 0.2, Z + 0.2, { front: "8", side: "7", top: "9" })
      figure(c, X, Z, { h0: 0.45, tall: 1.68, coat: "d", hood: "d", face: "S", rim: "D", rimSide: 1 })
      const [x, y] = PR(X, 0.45 + 1.68, Z), s = F / Z
      for (const d of [-1, 1]) { c.line(x + d * 3, y + 5, x + d * 7, y - 2, "k"); c.line(x + d * 3, y + 4, x + d * 6, y - 2, "d"); c.px(x + d * 6, y - 3, "S") }   // both arms up
      c.px(x - 1, y + 2, "W"); c.px(x + 1, y + 2, "W")                                                                           // the gecko eyes, wide and pale
      const py = y - 9; c.rect(x + 3, py - 1, 9, 7, "k"); c.rect(x + 4, py, 7, 5, "D"); c.hline(x + 5, py + 1, 5, "1"); c.hline(x + 5, py + 3, 4, "1"); c.vline(x + 6, py + 6, 3, "k")
    }])
    // the stairs down (Chapter 2): a well in the bed, railed on three sides, its gate toward us shut, a red lamp; steam out of it
    items.push([2.4, () => {
      const X0 = 0.3, X1 = 2.0, Z0 = 2.4, Z1 = 2.95
      poly(c, [[X0, 0, Z0], [X1, 0, Z0], [X1, 0, Z1], [X0, 0, Z1]], "k")
      for (let i = 1; i < 5; i++) { const Z = Z0 + i * 0.1; const [a, y] = PR(X0 + 0.1, 0, Z), [b] = PR(X1 - 0.1, 0, Z); c.hline(a, y, b - a, i % 2 ? "2" : "1") }
      const rail = (pts, k) => { for (let i = 0; i + 1 < pts.length; i++) { const [a, ya] = PR(...pts[i]), [b, yb] = PR(...pts[i + 1]); c.line(a, ya, b, yb, k) } }
      rail([[X0, 1.0, Z0], [X0, 1.0, Z1], [X1, 1.0, Z1], [X1, 1.0, Z0]], "5")
      for (const [X, Z] of [[X0, Z1], [X1, Z1]]) { const [x, y] = PR(X, 1.0, Z), [, yf] = PR(X, 0, Z); c.vline(x, y, yf - y, "4") }
      // the gate: chain-link in a steel frame, a padlock, the lamp
      const [gx0, gy0] = PR(X0, 1.0, Z0), [gx1, gy1] = PR(X1, 0, Z0)
      for (let x = gx0; x <= gx1; x++) for (let y = gy0; y <= gy1; y++) if ((x + y) % 3 === 0 || (x - y + 99) % 3 === 0) c.px(x, y, "4")
      c.rect(gx0, gy0, gx1 - gx0 + 1, 1, "5"); c.vline(gx0, gy0, gy1 - gy0 + 1, "5"); c.vline(gx1, gy0, gy1 - gy0 + 1, "5"); c.vline(R((gx0 + gx1) / 2), gy0, gy1 - gy0 + 1, "5")
      c.rect(R((gx0 + gx1) / 2) - 1, gy0 + 6, 3, 3, "6")
      c.rect(gx1 - 1, gy0 - 3, 3, 2, "q"); c.px(gx1, gy0 - 2, "W")
    }])
    // the chop shop: a counter, a glass case of jars on it, shelves of jars behind, all lit cyan from below
    items.push([2.4, () => {
      const Z0 = 2.4, Z1 = 3.05
      box(c, 3.6, 5.6, 0, 2.3, Z0, Z1, { side: "2", front: "3" })
      poly(c, [[3.6, 0.95, Z0 + 0.05], [3.6, 0.95, Z1 - 0.05], [3.6, 2.15, Z1 - 0.05], [3.6, 2.15, Z0 + 0.05]], "c")
      for (let row = 0; row < 3; row++) for (let Z = Z0 + 0.12; Z < Z1 - 0.1; Z += 0.13) {
        const [x, y] = PR(3.6, 1.15 + row * 0.36, Z); c.rect(x - 1, y - 2, 2, 3, "C"); c.px(x - 1, y - 2, hash(R(Z * 50), row) < 0.4 ? "V" : "v"); c.px(x, y, "1")
      }
      poly(c, [[3.6, 0, Z0], [3.6, 0, Z1], [3.6, 0.95, Z1], [3.6, 0.95, Z0]], "1")
      poly(c, [[3.25, 0.95, Z0], [3.6, 0.95, Z0], [3.6, 0.95, Z1], [3.25, 0.95, Z1]], "4")
      poly(c, [[3.3, 0.95, Z0 + 0.1], [3.3, 0.95, Z1 - 0.15], [3.3, 1.35, Z1 - 0.15], [3.3, 1.35, Z0 + 0.1]], "C")      // the glass case
      for (let Z = Z0 + 0.15; Z < Z1 - 0.2; Z += 0.12) { const [x, y] = PR(3.3, 1.1, Z); c.px(x, y, "V"); c.px(x, y - 1, "v") }
      poly(c, [[3.0, 2.35, Z0], [3.0, 2.35, Z1], [3.6, 2.6, Z1], [3.6, 2.6, Z0]], "c")                                  // its awning
    }])
    // the steel stairs up to the alley: an open flight climbing the right slope into the alley's pale light; someone going up
    items.push([1.6, () => {
      const Z0 = 1.6, Z1 = 2.05, X0 = 3.5, n = 17, st = 0.3
      { const [a, ya] = PR(X0, 0, Z1), [b, yb] = PR(X0 + n * st, n * st, Z1); c.line(a, ya, b, yb, "3"); const [ra, rya] = PR(X0, 1.0, Z1), [rb, ryb] = PR(X0 + n * st, n * st + 1.0, Z1); c.line(ra, rya, rb, ryb, "4") }
      for (let i = 0; i < n; i++) {
        const X = X0 + i * st, h = (i + 1) * st, k = h > EH ? tone("2", X, h, 1.8, i, 0) : tone("4", X, h, 1.8, i, 1)
        poly(c, [[X, h, Z0], [X + st, h, Z0], [X + st, h, Z1], [X, h, Z1]], k)
        const [a, y] = PR(X, h, Z0), [b] = PR(X + st, h, Z0); c.hline(a, y, b - a + 1, h > 2.6 ? "x" : "5")                 // the nosing, catching the light
      }
      const [a, ya] = PR(X0, 0, Z0), [b, yb] = PR(X0 + n * st, n * st, Z0)
      poly(c, [[X0, 0, Z0], [X0 + n * st, n * st, Z0], [X0 + n * st, n * st - 0.35, Z0], [X0 + 0.35, 0, Z0]], "4")
      c.line(a, ya, b, yb, "5")
      const [ra, rya] = PR(X0, 1.0, Z0), [rb, ryb] = PR(X0 + n * st, n * st + 1.0, Z0); c.line(ra, rya, rb, ryb, "6"); c.line(ra, rya + 1, rb, ryb + 1, "k")
      for (let i = 0; i <= n; i += 3) { const X = X0 + i * st, [x, yr] = PR(X, i * st + 1.0, Z0), [, yt] = PR(X, i * st, Z0); c.vline(x, yr, yt - yr, "5") }
      figure(c, 6.1, 1.85, { h0: 2.6, coat: "3", hood: "2", rim: "x", rimSide: 1 })
    }])
    items.push([2.7, () => { const [x, y] = PR(1.15, 0.8, 2.7); steam(c, x, y, 34, "R", 2, -0.12) }])     // out of the well, amber from the bulbs
    for (const s of SIGNS.filter((s) => s.Z < 3 && s.Z >= 1.7 && s.id !== "hotel")) items.push([s.Z - 0.01, () => signFace(c, s)])
    return items
  }

  // ---------------------------------------------------------------- near: Ratz's stall on the left, the food stall on the right
  const nearLeft = (c) => {
    // the stall's back: shelves of junk against a board, screens on them
    poly(c, [[-4.2, 0, 0.6], [-4.2, 0, 1.28], [-4.2, 2.5, 1.28], [-4.2, 2.5, 0.6]], "2")
    for (const h of [0.6, 1.2, 1.8]) { const [a, ya] = PR(-4.2, h, 0.6), [b, yb] = PR(-4.2, h, 1.28); c.line(a, ya, b, yb, "4") }
    for (const [h, Z, k] of [[1.25, 1.1, "v"], [1.85, 1.0, "C"], [0.65, 1.15, "C"], [1.25, 0.9, "V"], [1.85, 1.18, "v"]]) poly(c, [[-4.15, h, Z], [-4.15, h, Z + 0.09], [-4.15, h + 0.35, Z + 0.09], [-4.15, h + 0.35, Z]], k)
    // cables hanging in loops from the tarp
    for (const [X, Z, d] of [[-3.2, 1.15, 0.5], [-2.5, 0.95, 0.7], [-2.9, 0.8, 0.4]]) { const [x, y] = PR(X, 2.55, Z), [, y2] = PR(X, 2.55 - d, Z); c.vline(x, y, y2 - y, "k"); c.px(x, y2, "C") }
    // the counter on its planks: lane face, top, junk on it
    box(c, -4.0, -1.9, 0, 1.0, 0.8, 1.28, { side: "3", top: "4", front: "3" })
    poly(c, [[-1.9, 0.85, 0.8], [-1.9, 0.85, 1.28], [-1.9, 0.9, 1.28], [-1.9, 0.9, 0.8]], "v")                          // a strip of LEDs on its edge
    for (const [X0, X1, Z0, Z1, h, k] of [[-3.6, -2.8, 0.86, 1.0, 0.3, "2"], [-3.5, -2.9, 1.1, 1.25, 0.4, "3"], [-2.7, -2.2, 0.84, 0.95, 0.2, "1"]]) box(c, X0, X1, 1.0, 1.0 + h, Z0, Z1, { side: "4", top: "5", front: k })
    box(c, -2.75, -2.15, 1.0, 1.4, 0.96, 1.08, { side: "4", top: "5", front: "3" })                                      // an old monitor, its screen to the lane
    poly(c, [[-2.15, 1.07, 0.98], [-2.15, 1.07, 1.06], [-2.15, 1.33, 1.06], [-2.15, 1.33, 0.98]], "v")
    // Ratz on the counter: a cable rat the size of a small dog, headphones, the patched speaking collar, his cable tail over the edge
    {
      const [x, y] = PR(-2.3, 1.0, 1.15)
      c.rect(x - 7, y - 9, 13, 9, "k"); c.rect(x - 6, y - 8, 11, 8, "g"); c.rect(x - 6, y - 8, 11, 2, "G")      // the body, hunched
      c.rect(x + 3, y - 13, 7, 7, "k"); c.rect(x + 4, y - 12, 5, 5, "G"); c.rect(x + 9, y - 10, 2, 2, "S")       // the head, the pink nose
      c.rect(x + 3, y - 15, 2, 3, "g"); c.rect(x + 7, y - 15, 2, 3, "g")                                          // the ears
      c.hline(x + 3, y - 13, 7, "C"); c.rect(x + 3, y - 12, 1, 3, "v"); c.rect(x + 9, y - 12, 1, 2, "v")           // the headphones
      c.px(x + 7, y - 11, "k")                                                                                     // an eye
      c.hline(x + 2, y - 6, 6, "c"); c.px(x + 4, y - 6, "v")                                                       // the patched collar, its speaker
      c.line(x - 7, y - 2, x - 10, y + 5, "C"); c.line(x - 10, y + 5, x - 8, y + 9, "C")                           // the cable tail over the edge
    }
    // the tarp: striped, seen from under, its valance at the lane edge
    const T = { Xi: -1.95, Xo: -4.8, hi: 3.0, ho: 2.5, Z0: 0.3, Z1: 1.32 }   // high over the lane, draining off to the back
    for (let i = 0; i < 12; i++) {
      const za = T.Z0 + (T.Z1 - T.Z0) * i / 12, zb = T.Z0 + (T.Z1 - T.Z0) * (i + 1) / 12
      poly(c, [[T.Xi, T.hi, za], [T.Xi, T.hi, zb], [T.Xo, T.ho, zb], [T.Xo, T.ho, za]], i % 2 ? "U" : "h")
      poly(c, [[T.Xi, T.hi, za], [T.Xi, T.hi, zb], [T.Xi, T.hi - 0.28, zb], [T.Xi, T.hi - 0.28, za]], i % 2 ? "u" : "G")
    }
    { const [a, ya] = PR(T.Xi, T.hi - 0.28, T.Z0), [b, yb] = PR(T.Xi, T.hi - 0.28, T.Z1); c.line(a, ya, b, yb, "k") }
    for (const Z of [0.8, 1.28]) { const [x, y] = PR(-1.9, T.hi - 0.28, Z), [, yf] = PR(-1.9, 0, Z); c.rect(x - (Z < 1 ? 1 : 0), y, Z < 1 ? 2 : 1, yf - y, "k") }   // its posts
    signFace(c, SIGNS.find((s) => s.id === "junk"))
    { const [x, y] = PR(-3.0, 2.3, 0.95); c.vline(x, y - 8, 8, "k"); c.rect(x - 1, y, 3, 3, "R"); c.px(x, y + 1, "W") }   // a bulb under the tarp
    // the vending cube cut by the left edge: its side to the lane glowing, rows of cans behind the glass
    box(c, -3.2, -2.25, 0, 1.75, 0.45, 0.74, { side: "C", top: "v", front: "C" })
    for (let r = 0; r < 4; r++) { const h = 0.55 + r * 0.28; poly(c, [[-2.25, h, 0.48], [-2.25, h, 0.71], [-2.25, h + 0.12, 0.71], [-2.25, h + 0.12, 0.48]], r % 2 ? "V" : "v") }
    { const [a, ya] = PR(-2.25, 1.75, 0.74), [, yb] = PR(-2.25, 0, 0.74); c.vline(a, ya, yb - ya, "k") }
  }
  const nearRight = (c) => {
    // the cook behind the counter, cut by the right edge, at the wok: white cap, the fire on his face
    figure(c, 4.75, 0.98, { tall: 1.74, coat: "H", hood: "H", face: "S", rim: "Q", rimSide: -1 })
    { const [x, y] = PR(4.75, 1.74, 0.98); c.rect(x - 4, y - 3, 9, 4, "W"); c.rect(x - 3, y + 1, 7, 1, "h"); c.line(x - 7, y + 26, x - 15, y + 30, "S") }   // the cap; an arm out to the wok
    poly(c, [[5.6, 1.6, 0.5], [5.6, 1.6, 1.4], [5.6, 1.7, 1.4], [5.6, 1.7, 0.5]], "P")                                // the shelf behind him
    // the counter: lane face lit by the fire, its top
    box(c, 3.3, 5.6, 0, 1.0, 0.7, 1.42, { side: "O", top: "P", front: "O" })
    poly(c, [[3.3, 0.88, 0.7], [3.3, 0.88, 1.42], [3.3, 0.95, 1.42], [3.3, 0.95, 0.7]], "Q")
    for (const Z of [0.8, 1.0, 1.25]) poly(c, [[3.3, 0.2, Z], [3.3, 0.2, Z + 0.12], [3.3, 0.7, Z + 0.12], [3.3, 0.7, Z]], "9")
    // trays of fish balls near the lane edge, a steaming pot, the wok on its fire
    for (const Z0 of [1.08, 1.24]) { box(c, 3.4, 3.95, 1.0, 1.06, Z0, Z0 + 0.13, { side: "6", top: "5", front: "6" }); for (let i = 0; i < 6; i++) { const [x, y] = PR(3.48 + (i % 3) * 0.17, 1.07, Z0 + 0.04 + Math.floor(i / 3) * 0.06); c.px(x, y, "R"); c.px(x + 1, y, "Q") } }
    box(c, 3.5, 4.3, 1.0, 1.4, 0.74, 0.92, { side: "5", top: "4", front: "5" })
    { const [x, y] = PR(3.9, 1.4, 0.82); c.ellipse(x, y, 7, 2, "h") }
    { const [x, y] = PR(4.15, 1.08, 1.12); c.ellipse(x, y, 7, 2, "k"); c.ellipse(x, y - 1, 6, 1, "2"); c.rect(x - 4, y - 5, 2, 4, "Q"); c.rect(x - 1, y - 7, 3, 6, "R"); c.rect(x + 3, y - 4, 2, 3, "Q"); c.px(x, y - 4, "W"); c.px(x + 1, y - 5, "W") }
    // the awning over the near end, amber underneath, two bulbs
    const A = { Xi: 2.95, Xo: 6.2, hi: 3.0, ho: 2.5, Z0: 0.3, Z1: 0.98 }
    poly(c, [[A.Xi, A.hi, A.Z0], [A.Xi, A.hi, A.Z1], [A.Xo, A.ho, A.Z1], [A.Xo, A.ho, A.Z0]], "O")
    for (const Z of [0.45, 0.62, 0.8]) { const [a, ya] = PR(A.Xi, A.hi, Z), [b, yb] = PR(A.Xo, A.ho, Z); c.line(a, ya, b, yb, "a") }
    poly(c, [[A.Xi, A.hi, A.Z0], [A.Xi, A.hi, A.Z1], [A.Xi, A.hi - 0.2, A.Z1], [A.Xi, A.hi - 0.2, A.Z0]], "P")
    for (const [X, Z] of [[3.7, 0.72], [4.6, 0.9]]) { const [x, y] = PR(X, 2.25, Z), y0 = Math.max(0, y - 6); c.vline(x, y0, y - y0, "k"); c.rect(x - 1, y, 3, 3, "R"); c.px(x, y + 1, "W") }
    // FISH BALLS down a blade at the awning's corner, close to us, the night market's way
    const S = { X0: 2.2, X1: 2.6, h0: 1.35, h1: 3.25, Z: 0.6 }, [x0, y0] = PR(S.X0, S.h1, S.Z), [x1, y1] = PR(S.X1, S.h0, S.Z)
    c.rect(x0 - 1, y0 - 1, x1 - x0 + 2, y1 - y0 + 2, "k"); c.rect(x0, y0, x1 - x0, y1 - y0, "O"); c.rect(x0, y0, 1, y1 - y0, "Q"); c.rect(x1 - 1, y0, 1, y1 - y0, "Q")
    ;[..."FISH BALLS"].forEach((ch, i) => TXT.draw(c, R((x0 + x1) / 2), y0 + 4 + i * 9, ch, "R", { font: "nagiwa", align: "center" }))
    c.hline(x1, y0 + 6, PR(A.Xi, 0, S.Z)[0] - x1 + 4, "k")
  }

  // ---------------------------------------------------------------- Juno for scale: 50 px of yellow slicker, hood up, the satchel
  const juno = (c, x, foot) => {
    const top = foot - 50
    c.rect(x - 9, top - 1, 19, 52, "k")
    c.rect(x - 4, top, 9, 10, "y"); c.rect(x - 3, top + 4, 7, 5, "S"); c.rect(x - 3, top + 4, 7, 1, "1")       // hood, face, fringe
    c.rect(x - 8, top + 10, 17, 22, "y"); c.rect(x + 5, top + 11, 3, 20, "j"); c.rect(x - 8, top + 11, 1, 20, "Y")   // slicker, its shade, its rim
    c.rect(x - 9, top + 22, 5, 7, "g"); c.line(x - 6, top + 22, x + 4, top + 11, "G")                            // satchel and strap
    c.rect(x - 6, top + 32, 5, 15, "1"); c.rect(x + 1, top + 32, 5, 15, "1"); c.rect(x - 7, foot - 3, 6, 3, "k"); c.rect(x + 1, foot - 3, 6, 3, "k")
  }

  // ---------------------------------------------------------------- the steam: flat pale shapes, lit by what is under them
  const steams = (c) => {
    { const [x, y] = PR(4.15, 1.3, 1.12); steam(c, x, y, 26, "R", 5, -0.35) }              // off the wok, under the awning
    { const [x, y] = PR(3.9, 1.45, 0.82); steam(c, x, y, 20, "H", 9, -0.4) }               // off the pot
  }

  const paint = (c) => {
    sky(c)
    surfaces(c)
    reflections(c)
    const items = [...far(c), ...middle(c)].sort((p, q) => q[0] - p[0])
    items.filter((i) => i[0] >= SHAFT.Z0).forEach(([, d]) => d())
    shaft(c)
    items.filter((i) => i[0] < SHAFT.Z0).forEach(([, d]) => d())
    for (const s of SIGNS.filter((s) => (s.Z < 1.7 || s.id === "hotel") && s.id !== "junk")) signFace(c, s)
    steams(c)
    nearLeft(c)
    nearRight(c)
    juno(c, 238, 168)
  }

  // ---------------------------------------------------------------- what the game would need (for later): walk area, where Juno stands
  {
    const fl = (X, Z) => PR(X, 0, Z)
    const walk = [fl(-1.85, 0.8), fl(-1.85, 1.3), fl(LANE_L + 0.2, 1.35), fl(LANE_L + 0.2, 2.25), fl(CANAL_L - 0.9, 2.25), fl(CANAL_L - 0.9, 2.55), fl(LANE_L + 0.2, 2.55),
      fl(LANE_L + 0.2, 2.9), fl(0.2, 2.9), fl(0.2, 2.35), fl(2.1, 2.35), fl(2.1, 2.9), fl(3.2, 2.9), fl(3.4, 1.62), fl(3.2, 1.45), fl(3.2, 0.72), fl(-1.85, 0.72)]
    console.log("DM_D_WALK " + JSON.stringify(walk.flat()) + "  scale far [" + R(VY + F * EH / 2.9) + ", " + (1 / 2.9).toFixed(2) + "] near [" + R(VY + F * EH) + ", 1]")
    console.log("DM_D_SPOTS " + JSON.stringify({ arrive: fl(3.2, 1.8), up: fl(3.2, 1.8), ratz: fl(-1.4, 1.05), food: fl(2.9, 1.1), curtain: fl(-4.5, 2.4), kidneys: fl(3.0, 2.6), preacher: fl(-0.8, 2.8), down: fl(1.15, 2.35) }))
  }
  return { W, H, paint }
})()

scene("drain_market_d", { w: DMD.W, h: DMD.H, bg: "k" }, DMD.paint,
  glow("m", { r: 5, strength: 0.45 }), glow("vV", { r: 4, strength: 0.3 }), glow("RW", { r: 4, strength: 0.35 }), glow("q", { r: 3, strength: 0.6 }), glow("N", { r: 3, strength: 0.3 }))

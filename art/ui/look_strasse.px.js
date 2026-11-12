// The look down from the ledge (the block B of art/mockups/sims_blocks.px.js, the user's go of 2026-11-12): Juno leans out over
// her boots and looks straight down from over LUCKY STATIC onto Kowalski Street, shown as a close-up when she looks at "Die Straße"
// from the ledge (game/stadt.js; game/screens.js draws look_* at their own size, in the interface's frame).
//
//   look_strasse  128x104. The street is the one of art/rooms/kowalski.map.js, read from it (its floor, its doors, its props, its
//                 lights), so the two pictures agree (one place, one picture). From the bottom up: the hem of her slicker and her
//                 boots' toes on the wet ledge; under it the Kessel Block's own facade falling away floor after floor; at its foot
//                 LUCKY STATIC's sign and its warm light far out on the street; on the left the facade with the broken ad screen
//                 rising toward us, the scaffold, the vending machine and the bins at its foot; in the middle Bao's cart under his open
//                 umbrella (Bao under it; from up here one sees the umbrella, his lantern's light and the steam), the string lights
//                 across, puddles, someone going into LUCKY STATIC. The rain falls away from her into the depth.
// How: a straight-down view; every pixel asks which plane it meets first (the ledge, our facade, the ad screen's facade, the street).
// The drop is drawn compressed (as look_shaft's stairwell), so the street keeps a size one can read and the facades still run to it.
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/kowalski.map.js")

{
  const W = 128, H = 104, CX = 64, CY = 46, FOC = 150, R = Math.round, fl = Math.floor
  const MAP = ISO_MAPS.kowalski, CELL = MAP.cell
  // metres: u out from our facade (up in the picture), v along it from the corner (right), h up from the street
  const EYE = 1.5, DROP = 42, SQUASH = 12 / 42, OUT = 1.0, VC = 3.2, LEDGE = 0.6
  const D0 = EYE + DROP * SQUASH
  const dOf = (h) => D0 - h * SQUASH                                                          // depth under the eye of height h
  const P = (u, v, h = 0) => { const d = dOf(h); return [CX + (v - VC) * FOC / d, CY - (u - OUT) * FOC / d] }
  const ih = ISO.ihash, bay = ISO.bay, NF = 32
  const open = (id) => MAP.openings.find((o) => o.id === id), prop = (id) => MAP.props.find((p) => p.id === id)
  const SIGN = open("lucky_sign"), DOOR = open("lucky_door"), ROW = open("west"), AD = open("ad"), ALLEY = open("alley")
  const CART = prop("cart"), SCAF = prop("scaffold"), VEND = prop("vending"), BINS = prop("bins")

  // ---- the light on the street, from the map's lamps (their ground position and reach)
  const LAMP = {
    warm: [[0, 2.75, 4.6, 1.0], [0, 4.45, 3.6, 0.9], [0.12, 5.43, 1.7, 0.8], [2.47, 2.72, 1.9, 0.8]],   // LUCKY STATIC's window and door, the passage's lantern, Bao's
    mag: [[0.2, 3.2, 4.0, 0.8]],                                                               // its sign
    cyan: [[3.9, 0.2, 5.5, 0.9]],                                                              // the ad screen, broken, still on (on the other facade)
  }
  const reach = (list, u, v) => Math.max(0, ...list.map(([lu, lv, r, p]) => p * (1 - Math.hypot(u - lu, v - lv) / r)))

  // ---- the street's floor: the map's cells where it has them, sidewalk and asphalt past them
  const cellAt = (u, v) => MAP.floor[fl(v / CELL)]?.[fl(u / CELL)] ?? (u < 1 || v < 1 ? "s" : "a")
  function ground(u, v, x, y) {
    const cell = cellAt(u, v)
    let k = cell === "s" ? ((fl(u / CELL) + fl(v / CELL)) % 2 ? "Z" : "z") : cell === "g" ? ((fl(u * 10) + fl(v * 10)) % 2 ? "k" : "3") : "f"
    if (cell === "s" && cellAt(u + 0.12, v) !== "s") k = "4"                                   // the kerb
    const w = reach(LAMP.warm, u, v), m = reach(LAMP.mag, u, v), c = reach(LAMP.cyan, u, v), b = bay(x, y)
    const wet = cell === "w" ? 1.5 : 1
    if (w * wet > b * 0.7 + 0.12) k = w * wet > 0.6 ? "Q" : w * wet > 0.38 ? "P" : "A"
    else if (c * wet > b * 0.8 + 0.18) k = c * wet > 0.55 ? "C" : c * wet > 0.38 ? "T" : "t"
    else if (m * wet > b + 0.12) k = m * wet > 0.5 ? "I" : "i"
    else if (cell === "w") k = b < 0.3 ? "Z" : "e"
    return k
  }

  // ---- our own facade (u = 0) at v, h: storeys of 3 m, its windows, the columns between the bays (they all run to the street)
  function ours(v, h) {
    const fade = (keys) => keys[Math.max(0, Math.min(keys.length - 1, fl((DROP - h) / 9)))]
    if (h < 3.2) return v > SIGN.from && v < SIGN.to ? "m" : v > ROW.from && v < ROW.to ? "k" : "2"
    const fy = h % 3, wx = (v + 30) % 3.6
    if (fy < 0.3) return fade(["4", "3", "2", "2", "1"])
    if (wx < 0.25) return fade(["4", "4", "3", "3", "2"])
    if (wx > 1.0 && wx < 2.6 && fy > 0.9 && fy < 2.4) {
      const n = ih(fl((v + 30) / 3.6), fl(h / 3))
      return n > 0.8 ? fade(["Q", "Q", "P", "P", "O"]) : n > 0.7 ? fade(["C", "C", "c", "c", "c"]) : fade(["2", "1", "1", "k", "k"])
    }
    return fade(["3", "3", "2", "2", "1"])
  }

  // ---- the facade over the corner (v = 0) at u, h: the ad screen at its foot, broken in bands, the alley's gate, storeys above
  function theirs(u, h, f) {
    if (u > AD.from && u < AD.to && h > AD.h[0] && h < AD.h[1]) return ((fl(u * 4) + (f >> 3)) % 5 === 0) ? "k" : (fl(u * 9) % 3 ? "C" : "v")
    if (u > ALLEY.from && u < ALLEY.to && h < ALLEY.h[1]) return "k"
    if (h < 3.4) return "2"
    const fy = h % 3, wx = (u + 30) % 3.2
    if (fy < 0.3 || wx < 0.3) return "4"
    if (wx > 0.9 && wx < 2.3 && fy > 0.8 && fy < 2.2) { const n = ih(fl((u + 30) / 3.2), fl(h / 3) + 50); return n > 0.75 ? "Q" : n > 0.62 ? "c" : "1" }
    return "3"
  }

  function ledge(u, v, x, y) {
    if (u > LEDGE - 0.04) return "5"                                                          // its front edge, worn
    return Math.hypot(v - VC - 0.55, (u - 0.32) * 2) < 0.2 ? (bay(x, y) < 0.5 ? "I" : "i") : bay(x, y) < 0.25 ? "Z" : "X"
  }

  // ---- what a pixel sees: every plane it crosses, the nearest wins
  function see(x, y, f) {
    const sx = x + 0.5 - CX, sy = y + 0.5 - CY, hits = []
    { const u = OUT - sy * EYE / FOC; if (u <= LEDGE && u >= -0.5) hits.push([EYE, () => ledge(u, VC + sx * EYE / FOC, x, y)]) }
    if (sy > 0) { const d = OUT * FOC / sy, v = VC + sx * d / FOC; if (d > EYE && d < D0 && v >= 0) hits.push([d, () => ours(v, (D0 - d) / SQUASH)]) }
    if (sx < 0) { const d = VC * FOC / -sx, u = OUT - sy * d / FOC; if (d > EYE && d < D0 && u >= 0) hits.push([d, () => theirs(u, (D0 - d) / SQUASH, f)]) }
    { const u = OUT - sy * D0 / FOC, v = VC + sx * D0 / FOC; if (u >= 0 && v >= 0) hits.push([D0, () => ground(u, v, x, y)]) }
    hits.sort((p, q) => p[0] - q[0])
    return hits.length ? hits[0][1]() : "k"
  }

  // ---- things standing on the street, from above: a box's top at its height, a round thing
  const top = (c, u0, v0, du, dv, h, key, edge) => {
    const [x0, y1] = P(u0, v0, h), [x1, y0] = P(u0 + du, v0 + dv, h)
    for (let y = R(y0); y < R(y1); y++) for (let x = R(x0); x < R(x1); x++) c.px(x, y, edge && (y === R(y0) || x === R(x0) || y === R(y1) - 1 || x === R(x1) - 1) ? edge : key)
  }
  const dot = (c, u, v, h, r, key) => { const [x, y] = P(u, v, h), rp = r * FOC / dOf(h); for (let j = -5; j <= 5; j++) for (let i = -5; i <= 5; i++) if (Math.hypot(i, j) <= rp) c.px(R(x) + i, R(y) + j, key) }

  anim("look_strasse", { w: W, h: H, frames: NF, fps: 10 }, (c) => {
    const f = c.frame ?? 0
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, see(x, y, f))
    const [au, av] = CART.at, [fu, fv] = CART.foot
    // the sign over LUCKY STATIC's window, from above: its top, lit
    top(c, 0, SIGN.from, 0.35, SIGN.to - SIGN.from, 3.05, "M", null); for (let v = SIGN.from + 0.2; v < SIGN.to; v += 0.45) { const [x, y] = P(0.2, v, 3.05); c.px(R(x), R(y), "N") }
    // at the other facade's foot: the vending machine (its light on its front), the scaffold's boards and the fitter's stove, the bins
    top(c, VEND.at[0], VEND.at[1], VEND.foot[0], VEND.foot[1], VEND.h, "5", "k"); { const [x, y] = P(VEND.at[0] + 0.35, VEND.at[1] + VEND.foot[1], VEND.h); c.px(R(x), R(y), "V") }
    top(c, SCAF.at[0], SCAF.at[1], SCAF.foot[0], SCAF.foot[1], 2.35, "P", "k")
    for (let u = SCAF.at[0] + 0.3; u < SCAF.at[0] + SCAF.foot[0]; u += 0.3) { const [x0, y] = P(u, SCAF.at[1], 2.35), [x1] = P(u, SCAF.at[1] + SCAF.foot[1], 2.35); for (let x = R(x0); x < R(x1); x++) c.px(x, R(y), "O") }
    { const [x, y] = P(3.45, 0.44, 2.4); c.px(R(x), R(y), f % 6 < 3 ? "Q" : "R") }
    top(c, BINS.at[0], BINS.at[1], BINS.foot[0], BINS.foot[1], BINS.h, "3", "k")
    // Bao's cart under his umbrella, seen from above: its shadow, the umbrella's panels round its knob, the steam from under its edge
    top(c, au - 0.05, av - 0.05, fu + 0.1, fv + 0.1, 0.1, "k", null)
    {
      const cu = au + fu / 2, cv = av + fv / 2, [ux, uy] = P(cu, cv, 2.4), rp = 1.05 * FOC / dOf(2.4)
      for (let j = -12; j <= 12; j++) for (let i = -12; i <= 12; i++) {
        const r = Math.hypot(i, j); if (r > rp) continue
        const panel = fl(((Math.atan2(j, i) + Math.PI) / (Math.PI * 2)) * 8 + 0.5) % 2
        c.px(R(ux) + i, R(uy) + j, r > rp - 1 ? "k" : r < 1.2 ? "U" : panel ? "U" : "u")
      }
      for (let i = 0; i < 5; i++) {                                                                                     // the steam
        const t = ((f + i * 6) % NF) / NF, sx = R(ux + rp * 0.7 + t * 6 + Math.sin(t * 9 + i) * 1.5), sy = R(uy - rp * 0.4 - t * 5)
        if (bay(sx, sy) < 0.9 - t * 0.6) c.px(sx, sy, t < 0.4 ? "H" : "h")
      }
    }
    // the string lights across the street, high over it, sagging
    for (const [[u0, v0], [u1, v1]] of [[[0.1, 1.4], [4.2, 0.1]], [[0.1, 4.6], [6.4, 0.1]]]) {
      for (let t = 0; t <= 1; t += 0.01) {
        const [x, y] = P(u0 + (u1 - u0) * t, v0 + (v1 - v0) * t, 3.5 - Math.sin(t * Math.PI) * 0.5)
        c.px(R(x), R(y), (fl(t * 100) % 9 === 0) ? ((fl(t * 100) + f) % 4 ? "R" : "Q") : "k")
      }
    }
    // people under umbrellas: one going into LUCKY STATIC, one past the bins
    const walk = (u0, v0, u1, v1, k, s) => { const t = (f / NF + s) % 1, u = u0 + (u1 - u0) * t, v = v0 + (v1 - v0) * t; dot(c, u, v, 1.9, 0.4, k); const [x, y] = P(u, v, 1.9); c.px(R(x) - 1, R(y) - 1, k === "m" ? "N" : "H") }
    walk(3.2, 6.8, 0.7, DOOR.from + 0.4, "g", 0.1)
    walk(6.5, 1.4, 4.6, 1.2, "m", 0.6)
    // the rain, falling away from her: each drop on its own line from the middle, its streak shorter the deeper it is
    for (let i = 0; i < 46; i++) {
      const a = ih(i, 1) * Math.PI * 2, rho = 0.3 + ih(i, 2) * 1.8
      const d = 1.6 + (((ih(i, 3) * NF + f) % NF) / NF) * 10
      const r0 = rho * FOC / d, r1 = rho * FOC / (d + 0.6)
      const x0 = CX + Math.cos(a) * r0, y0 = CY + Math.sin(a) * r0, x1 = CX + Math.cos(a) * r1, y1 = CY + Math.sin(a) * r1
      const k = d < 4 ? "x" : d < 7 ? "5" : "4", n = Math.max(1, R(Math.hypot(x1 - x0, y1 - y0)))
      for (let s = 0; s <= n; s++) c.px(R(x0 + (x1 - x0) * s / n), R(y0 + (y1 - y0) * s / n), k)
    }
    // her toes over the edge, the slicker's hem at the bottom
    for (const bx of [40, 74]) {
      for (let y = 72; y < H; y++) for (let x = bx - 1; x < bx + 15; x++) {
        const e = Math.hypot((x + 0.5 - bx - 7) / 8, (y - 82) / 10)
        if (y < 82 && e > 1 || y >= 82 && (x < bx || x > bx + 13)) continue
        const sole = y < 82 ? e > 0.84 : x === bx || x === bx + 13
        c.px(x, y, sole ? "4" : y < 82 && e > 0.72 ? "k" : y < 78 && x < bx + 9 ? "3" : "2")
      }
      c.px(bx + 5, 75, "5"); c.hline(bx + 3, 82, 8, "1")
    }
    for (let x = 26; x < 102; x++) {
      const t = 93 + R(2 * Math.sin(x * 0.23)) + (x < 36 || x > 92 ? 3 : 0), fold = Math.sin(x * 0.55) + Math.sin(x * 0.21)
      for (let y = t; y < H; y++) c.px(x, y, y === t ? "Y" : fold < -0.9 ? "j" : fold < -0.3 && bay(x, y) < 0.5 ? "j" : "y")
    }
  })
}

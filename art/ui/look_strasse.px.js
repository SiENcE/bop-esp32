// The look down from the ledge (the block B of art/mockups/sims_blocks.px.js, the user's go of 2026-11-12): Juno leans out over
// her boots and looks straight down 42 m onto Kowalski Street, shown as a close-up when she looks at "Die Straße" from the ledge
// (game/stadt.js; game/screens.js draws look_* at their own size, in the interface's frame).
//
//   look_strasse  128x104. From the bottom up: the hem of her slicker and her boots' toes on the wet ledge, its edge; under it
//                 the Kessel Block's own facade falling away, floor after floor, to LUCKY STATIC's awning and its warm light on
//                 the pavement right below; the street, wet, the magenta from across lying in it, people under umbrellas, a car
//                 going by; the facade across, its lowest storeys rising toward us. The rain falls away from her into the
//                 depth, the streaks shortening toward the street.
// How: a straight-down view through a long lens. Every pixel asks what it sees, nearest first (the ledge, the near facade, the
// street, the far facade), each a plane at a known depth; depth only darkens, the lit things keep their colour.
include("../lib/iso.js", { palette: true })

{
  const W = 128, H = 104, CX = 64, CY = 44, FOC = 60, R = Math.round, fl = Math.floor
  const EYE = 1.5, DROP = 42, OUT = 1.2, LEDGE = 0.6, ACROSS = 13                 // m: eye over the ledge, ledge over the street, eye out from the wall (she leans)
  const DEPTH = EYE + DROP
  const ih = ISO.ihash, bay = ISO.bay
  // a point (X along the street, Z out from our wall) at depth d under the eye, on the screen
  const P = (X, Z, d) => [CX + X * FOC / d, CY - (Z - OUT) * FOC / d]
  const NF = 32

  // ---- what a pixel sees: every plane it crosses, the nearest wins
  const AWN = DEPTH - 2.8, SIGNX = -8
  function see(x, y, f) {
    const sx = x + 0.5 - CX, sy = y + 0.5 - CY, hits = []
    const at = (d) => [sx * d / FOC, OUT - sy * d / FOC]                                        // X and Z where the ray is at depth d
    { const [X, Z] = at(EYE); if (Z <= LEDGE) hits.push([EYE, () => ledge(X, Z, x, y)]) }     // the ledge's top, under her feet
    if (sy > 0) { const d = OUT * FOC / sy; if (d < DEPTH) hits.push([d, () => near(sx * d / FOC, d - EYE, x, y, f)]) }   // our own facade
    { const [X, Z] = at(AWN); if (Z >= 0 && Z < 2.1 && Math.abs(X - 0.6) < 2.6) hits.push([AWN, () => (fl((X + 10) / 0.5) % 2 ? "P" : "Q")]) }   // LUCKY STATIC's awning
    if (sx < 0) { const d = SIGNX * FOC / sx, Z = OUT - sy * d / FOC, h = DEPTH - d                // the sign hanging out across the street
      if (Z > ACROSS - 1.6 && Z < ACROSS && h > 4 && h < 11) hits.push([d, () => ((f >> 2) % 7 === 0 && h > 8) || h % 1.4 < 0.25 || Z < ACROSS - 1.45 ? "M" : "m"]) }
    { const [X, Z] = at(DEPTH); if (Z >= 0 && Z <= ACROSS) hits.push([DEPTH, () => street(X, Z, x, y, f)]) }
    if (sy < 0) { const d = (ACROSS - OUT) * FOC / -sy; hits.push([d, () => across(sx * d / FOC, DEPTH - d, x, y, f)]) }
    hits.sort((p, q) => p[0] - q[0])
    return hits.length ? hits[0][1]() : "k"
  }

  function ledge(X, Z, x, y) {
    if (Z > LEDGE - 0.03) return "5"                                                          // its front edge, worn
    const pool = Math.hypot(X + 0.25, (Z - 0.3) * 2) < 0.18
    return pool ? (bay(x, y) < 0.5 ? "I" : "i") : bay(x, y) < 0.25 ? "Z" : "X"                // wet, the neon above in a puddle
  }

  // the Kessel Block below us: m metres under the ledge
  function near(X, m, x, y, f) {
    const h = DROP - m                                                                        // height over the street
    const fade = (keys) => keys[Math.max(0, Math.min(keys.length - 1, fl(m / 9)))]
    if (h < 2.6) return Math.abs(X - 0.6) < 2.1 ? "R" : "2"                                   // LUCKY STATIC's window under its awning
    const fy = m % 3, wx = ((X + 30) % 3.6)
    if (fy < 0.25) return fade(["4", "3", "2", "2", "1"])                                      // a slab's edge
    if (wx < 0.22) return fade(["4", "4", "3", "3", "2"])                                      // a column between the bays: they all run to the street
    if (wx > 1.0 && wx < 2.6 && fy > 0.6 && fy < 2.1) {                                      // a window, lit or not
      const n = ih(fl((X + 30) / 3.6), fl(m / 3))
      if (n > 0.8) return fade(["Q", "Q", "P", "P", "O"])
      if (n > 0.68) return fade(["C", "C", "c", "c", "c"])
      return fade(["2", "1", "1", "k", "k"])
    }
    return fade(["3", "3", "2", "2", "1"])
  }

  // the street at the foot: our pavement with LUCKY STATIC's light on it, the road, the far pavement
  function street(X, Z, x, y, f) {
    const warm = Math.max(0, 1 - Math.hypot((X - 0.6) / 4.2, Z / 3.2))                      // LUCKY STATIC's light, out through its window
    const mag = Math.max(0, 1 - Math.hypot((X + 7) / 4, (Z - ACROSS) / 6))                    // the sign across, in the wet
    let k
    if (Z < 2.4 || Z > ACROSS - 2.2) k = (fl(X / 1.2) + fl(Z / 1.2)) % 2 ? "Z" : "z"           // the pavements' slabs
    else k = Math.abs(Z - ACROSS / 2) < 0.12 && ((X + 40) % 3) < 1.5 ? "5" : "f"             // the road, its middle line
    if (Z > 2.3 && Z < 2.5 || Z > ACROSS - 2.3 && Z < ACROSS - 2.1) k = "4"                  // the kerbs
    if (warm > bay(x, y) * 0.9 + 0.08) k = warm > 0.55 ? "Q" : warm > 0.3 ? "P" : "A"
    else if (mag > bay(x, y) + 0.05) k = mag > 0.5 ? "I" : "i"
    return k
  }

  // the facade across, h m over the street: a noodle bar's lit front, windows over it, a sign hanging out
  function across(X, h, x, y, f) {
    const far = h > 12 ? 0 : 1
    if (h < 3.0) return Math.abs(X + 2) < 3 ? (h > 2.4 ? "P" : "Q") : "2"
    const fy = h % 3, wx = (X + 40) % 3.2
    if (fy < 0.2) return "3"
    if (wx < 0.3) return far ? "4" : "3"                                                       // its columns, running down to the street
    if (wx > 0.9 && wx < 2.3 && fy > 0.8 && fy < 2.2) { const n = ih(fl((X + 40) / 3.2), fl(h / 3) + 50); return n > 0.7 ? "Q" : n > 0.55 ? "c" : "1" }
    return far ? "3" : "2"
  }

  // ---- the people under umbrellas and the car: X, Z, along X per frame (metres)
  const PEOPLE = [[-6, 1.2, 0.08, "U"], [3.5, 1.6, -0.06, "g"], [8, 11.5, 0.05, "u"], [-2, 11.8, -0.07, "h"], [12, 0.9, -0.05, "m"]]
  const umbrella = (c, X, Z, k) => {
    const [x, y] = P(X, Z, DEPTH - 1.9)
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) if (i * i + j * j <= 1) c.px(R(x) + i, R(y) + j, i + j < 0 ? (k === "m" ? "N" : "H") : k)
  }

  anim("look_strasse", { w: W, h: H, frames: NF, fps: 10 }, (c) => {
    const f = c.frame ?? 0
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, see(x, y, f))
    // the car on the far lane, its lights on the wet road ahead of it
    {
      const X = -22 + (f * 1.4), Z = 8.4
      const [x0, y0] = P(X - 2.2, Z + 0.9, DEPTH - 1.4), [x1, y1] = P(X + 2.2, Z - 0.9, DEPTH - 1.4)
      for (let i = 1; i < 14; i++) { const [lx, ly] = P(X + 2.2 + i * 0.5, Z, DEPTH); for (let j = -1; j <= 1; j++) if (bay(R(lx), R(ly) + j) < 0.75 - i * 0.05) c.px(R(lx), R(ly) + j, i < 5 ? "R" : "P") }
      c.rect(R(x0), R(y0), R(x1 - x0), R(y1 - y0), "k"); c.rect(R(x0) + 1, R(y0) + 1, R(x1 - x0) - 2, R(y1 - y0) - 2, "4")
      c.rect(R(x0) + 4, R(y0) + 1, 4, R(y1 - y0) - 2, "5")                                    // its roof
      c.px(R(x1) - 1, R(y0) + 1, "W"); c.px(R(x1) - 1, R(y1) - 2, "W")
    }
    for (const [X, Z, v, k] of PEOPLE) umbrella(c, ((X + v * f + 20) % 40 + 40) % 40 - 20, Z, k)
    // the rain, falling away from her: each drop on its own line from the middle, its streak shorter the deeper it is
    for (let i = 0; i < 46; i++) {
      const a = ih(i, 1) * Math.PI * 2, rho = 0.4 + ih(i, 2) * 2.2
      const d = 1.6 + (((ih(i, 3) * NF + f) % NF) / NF) * 18
      const r0 = rho * FOC / d, r1 = rho * FOC / (d + 0.9)
      const x0 = CX + Math.cos(a) * r0, y0 = CY + Math.sin(a) * r0 - OUT * 0, x1 = CX + Math.cos(a) * r1, y1 = CY + Math.sin(a) * r1
      const k = d < 5 ? "x" : d < 10 ? "5" : "4"
      const n = Math.max(1, R(Math.hypot(x1 - x0, y1 - y0)))
      for (let s = 0; s <= n; s++) c.px(R(x0 + (x1 - x0) * s / n), R(y0 + (y1 - y0) * s / n), k)
    }
    // her toes over the edge, the slicker's hem at the bottom
    for (const bx of [40, 74]) {
      for (let y = 70; y < H; y++) for (let x = bx - 1; x < bx + 15; x++) {
        const e = Math.hypot((x + 0.5 - bx - 7) / 8, (y - 80) / 10)
        if (y < 80 && e > 1 || y >= 80 && (x < bx || x > bx + 13)) continue
        const sole = y < 80 ? e > 0.84 : x === bx || x === bx + 13
        c.px(x, y, sole ? "4" : y < 80 && e > 0.72 ? "k" : y < 76 && x < bx + 9 ? "3" : "2")
      }
      c.px(bx + 5, 73, "5"); c.hline(bx + 3, 80, 8, "1")                                                  // the toe cap's shine, its seam
    }
    for (let x = 26; x < 102; x++) {                                                                       // the slicker's hem, its folds
      const top = 92 + R(2 * Math.sin(x * 0.23)) + (x < 36 || x > 92 ? 3 : 0), fold = Math.sin(x * 0.55) + Math.sin(x * 0.21)
      for (let y = top; y < H; y++) c.px(x, y, y === top ? "Y" : fold < -0.9 ? "j" : fold < -0.3 && bay(x, y) < 0.5 ? "j" : "y")
    }
  })
}

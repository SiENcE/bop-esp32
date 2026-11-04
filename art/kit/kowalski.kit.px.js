// The kit pieces Kowalski Street needs (art/rooms/kowalski.map.js), at the new scale (style guide §4: 16 units
// per meter of floor, 30 px per meter of height): registered with ISOKIT (art/lib/isokit.js), drawn in room
// meters, lit by the bake. Include after art/lib/iso.js (palette), art/lib/isomap.js, art/lib/isokit.js.
// The look is mockup C's (art/mockups/mock_c_iso.px.js), at the new scale and from the map.
//
//   floor    s  the sidewalk's slabs (joints, a cracked one, the kerb's lit edge)
//            a  wet asphalt (tar-sealed cracks, a manhole cover, the kerb's dark face, the cable to Bao's cart)
//            w  puddles (the bake's sheen mirrors the neon in them; rain rings)      g  the drain grate
//   walls    facade_right  the ad building: concrete panels, the cornice, upper floors (lit, dark, a TV),
//                          an AC unit, the downpipe, the screen's feed cable and its junction box, a tag
//            facade_left   the Kessel Block: tiles to the cornice, its windows, washing on a line, an AC
//                          unit and its rust, the electrical box the cart's cable is stolen from, torn
//                          posters, the downpipe; the buzzer panel and the camera by the street door
//   openings kessel_street_door (the lobby's glass door from outside: its cold light, the yellow sign),
//            lucky_window (the bar: lamps, bottles, the counter, two regulars' backs, the TV, OPEN, steam on
//            the glass), lucky_door (open: the light pouring out under a noren), lucky_sign (LUCKY STATIC in
//            tubes, the Y stuttering), ad_screen (HALCYON, SLEEP BETTER, a sleeping face; the other half
//            broken: static, cracks from an impact), alley_gate (a lattice gate chained shut, DRAIN MKT, the
//            steps down into the dark, a lamp far below)
//   props    vending (a noodle machine with a mood: its little face), bao_cart (the cart, its counter, the
//            pot, the umbrella, the lantern), bins (a wheelie bin, the lid held up by a bag), string_lights
// The city's text is English art (style guide §8a); Juno says what it means in German. Keys "!k" are never
// lit (screens, signs, lamps, the views through glass). Small organic things are hand grids.
include("../lib/text.js")

const KOW = (() => {
  const fl = Math.floor, ih = ISO.ihash, bay = ISO.bay, near = (x, c, w = 1 / 64) => Math.abs(x - c) < w
  const MAP = ISO_MAPS.kowalski
  const cellAt = (u, v) => MAP.floor[fl(v / MAP.cell)]?.[fl(u / MAP.cell)] ?? "."
  // a picture for a wall piece: drawn once per frame, y down, the piece's top-left at (l, t) of its pad (px)
  const pic = (o, name, [l, b, r, t], draw) => {
    o.memo[name] ??= ISOKIT.raster(o.aw + l + r, o.ah + b + t, (c) => draw(c, l, t), -l, -b)
    return o.memo[name](o.a, o.e)
  }
  // distance from a point to a polyline (meters)
  const toLine = (u, v, pts) => {
    let d = Infinity
    for (let i = 0; i + 1 < pts.length; i++) {
      const [a, b] = pts[i], [c, e] = pts[i + 1], du = c - a, dv = e - b, t = Math.max(0, Math.min(1, ((u - a) * du + (v - b) * dv) / (du * du + dv * dv)))
      d = Math.min(d, Math.hypot(u - a - t * du, v - b - t * dv))
    }
    return d
  }

  // ---------------------------------------------------------------- floors
  // the cable Bao's cart runs on, stolen from the electrical box on the Kessel Block, across the sidewalk
  const CABLE = [[0.04, 5.35], [0.5, 4.9], [0.95, 4.1], [1.35, 3.35], [1.8, 2.8], [2.2, 2.55]]
  const cable = (u, v) => { const d = toLine(u, v, CABLE); return d < 0.022 ? "k" : d < 0.04 && v < CABLE[0][1] && (u + v) % 0.3 < 0.2 ? "1" : null }
  // the sidewalk: 0.5 m slabs, two ages of them; one cracked across, one sunken with water in it
  ISOKIT.floor("s", (u, v) => {
    const k = cable(u, v); if (k) return k
    // the kerb's top edge where the street begins (toward the viewer): catches the light
    if ((cellAt(u + 0.07, v) === "a" || cellAt(u + 0.07, v) === "w") && cellAt(u, v) === "s") return "X"
    if ((cellAt(u, v + 0.07) === "a" || cellAt(u, v + 0.07) === "w") && cellAt(u, v) === "s") return "X"
    if (near(u % 0.5, 0, 1 / 40) || near(v % 0.5, 0, 1 / 40)) return "e"
    const i = fl(u / 0.5), j = fl(v / 0.5)
    if (i === 9 && j === 0 && near((u % 0.5) - (v % 0.5) * 0.8, 0.12, 1 / 50)) return "e"      // the cracked one
    if (i === 1 && j === 9 && Math.hypot((u % 0.5) - 0.25, (v % 0.5) - 0.27) < 0.15) return "e" // sunken, a pool
    return ih(i, j * 7) < 0.15 ? "Z" : "z"
  })
  // asphalt: wet, dark; the kerb's face drops into it; cracks sealed with tar; a manhole cover
  const CRACKS = [[[2.4, 4.4], [2.9, 4.2], [3.3, 4.5], [3.9, 4.4]], [[5.2, 1.6], [5.4, 2.1], [5.3, 2.6], [5.6, 3.2]], [[1.4, 5.2], [1.9, 5.5]]]
  const asphalt = (u, v, o) => {
    const k = cable(u, v); if (k) return k
    if (cellAt(u - 0.11, v) === "s" || cellAt(u, v - 0.11) === "s") return "e"               // the kerb's face
    const m = Math.hypot(u - 4.7, v - 3.9)
    if (m < 0.34) return m > 0.3 ? "e" : near((u - v) % 0.12, 0, 0.012) || near((u + v) % 0.12, 0, 0.012) ? "z" : "Z"
    for (const c of CRACKS) if (toLine(u, v, c) < 0.02) return "e"
    return "f"
  }
  ISOKIT.floor("a", asphalt)
  // puddles where the asphalt sags: dark water, the bake's sheen puts the neon in it; rain rings by frame
  const PUDDLES = [[4.35, 1.75, 0.55, 0.42], [1.55, 3.7, 0.5, 0.42], [1.95, 3.15, 0.3, 0.22]]
  const inPuddle = (u, v) => PUDDLES.some(([pu, pv, ru, rv]) => Math.hypot((u - pu) / ru, (v - pv) / rv) < 1)
  const RINGS = [[4.2, 1.7, 0], [4.6, 1.9, 5], [1.4, 3.6, 3], [1.75, 3.85, 8], [2.0, 3.15, 10]]
  ISOKIT.floor("w", (u, v, o) => {
    if (!inPuddle(u, v)) return asphalt(u, v, o)
    for (const [ru, rv, t0] of RINGS) {
      const t = (o.f - t0 + 12) % 12
      if (t < 4 && near(Math.hypot(u - ru, (v - rv) * 1.0), 0.04 + t * 0.045, 0.012)) return "Z"
    }
    return "e"
  })
  // the drain: a steel frame, bars across a dark pit
  ISOKIT.floor("g", (u, v) => {
    const lu = u - 6.0, lv = v - 2.0
    if (lu < 0.05 || lu > 0.45 || lv < 0.05 || lv > 0.45) return lu < 0.03 || lu > 0.47 || lv < 0.03 || lv > 0.47 ? "f" : "4"
    return near(lu % 0.08, 0.04, 0.016) ? "3" : "k"
  })

  // ---------------------------------------------------------------- walls
  // window kinds: amber (someone home, the curtain drawn), tv (a screen's light), dark (a reflection)
  const windowPx = (lit, a, e, aw, ah) => {
    if (a === 0 || a === aw - 1 || e === 0 || e === ah - 1) return "1"
    if (lit === "amber") return a === fl(aw / 2) ? "!O" : (e % 3 === 0 ? "!O" : "!P")
    if (lit === "tv") return a > 3 && a < aw - 4 && e > 4 && e < ah - 6 ? (e % 4 === 1 ? "!v" : "!C") : "!c"
    if (lit === "low") return e < ah / 2 ? "!O" : "k"
    return a === fl(aw / 2) ? "1" : (a + e) % 9 === 0 && a < aw / 2 ? "3" : "k"
  }
  // a run of windows: [s, h0, kind]; each w x h meters, its sill and lintel
  const windows = (list, w, wh) => (s, h) => {
    for (const [s0, h0, kind, ac] of list) {
      if (s >= s0 - 0.04 && s < s0 + w + 0.04 && h >= h0 - 0.08 && h < h0 - 0.03) return h < h0 - 0.06 ? "2" : "5"      // the sill
      if (s >= s0 && s < s0 + w && h >= h0 && h < h0 + wh) return windowPx(kind, fl((s - s0) * 32), fl((h - h0) * 30), Math.round(w * 32), Math.round(wh * 30))
      // an AC unit under the window, the rust its drip has run down the wall
      if (ac && s >= s0 + 0.1 && s < s0 + 0.5 && h >= h0 - 0.42 && h < h0 - 0.12) {
        const a = fl((s - s0 - 0.1) * 32), e = fl((h - h0 + 0.42) * 30)
        return e === 8 ? "5" : e === 0 || a === 0 || a === 12 ? "2" : e % 2 ? "4" : "3"
      }
      if (ac && near(s, s0 + 0.42, 0.02) && h < h0 - 0.42 && h > h0 - 1.2 + 0.2 * Math.sin(s * 40)) return "O"
    }
    return null
  }

  // the ad building (right): concrete panels, the cornice over the ground storey, the upper floors
  const RIGHT_WINDOWS = windows([[0.45, 3.55, "dark"], [1.55, 3.55, "amber", true], [2.65, 3.55, "dark"], [3.75, 3.55, "tv"],
    [4.85, 3.55, "dark", true], [5.95, 3.55, "amber"], [3.75, 5.05, "dark"], [4.85, 5.05, "amber"], [5.95, 5.05, "dark"]], 0.6, 0.8)
  const TAG = ["..MM.....M..mm", ".M..M...MM.m..", ".M.....M.M.m..", "..MM..M..M..mm", "....M.MMMM....m", ".MMM.......mm."]
  ISOKIT.wall("facade_right", (s, h, o) => {
    if (h < 0.08) return "1"
    // the downpipe in the corner, its brackets
    if (s < 0.2) { const a = o.a; if (a >= 2 && a <= 4) return near(h % 0.9, 0.5, 0.03) ? "1" : a === 3 ? "5" : a === 2 ? "4" : "2" }
    // the screen's feed: a junction box over the vending machine, its cables up into the housing
    if (s >= 1.72 && s < 2.06 && h >= 2.02 && h < 2.34) return near(h, 2.32, 0.02) ? "5" : s < 1.75 || s > 2.03 || h < 2.05 ? "2" : near(s, 1.89, 0.02) ? "2" : "4"
    if ((near(h - 2.2, (s - 2.06) * 0.9, 0.025) || near(h - 2.12, (s - 2.06) * 0.6, 0.025)) && s > 2.06 && s < 2.24) return "k"
    if (near(s, 1.89, 0.02) && h >= 2.34 && h < 2.75) return "k"
    const k = RIGHT_WINDOWS(s, h); if (k) return k
    // the cornice over the ground storey
    if (h >= 2.75 && h < 2.97) return h > 2.93 ? "5" : h < 2.78 ? "1" : "4"
    if (h >= 2.97) {
      if (near(h % 1.5, 0.05, 0.02)) return "3"                                     // each floor's slab edge
      return near(s % 1.1, 0.25, 0.02) ? "1" : "2"
    }
    // the ground storey: panels and their joints, grime run down from the cornice
    if (near(s % 1.4, 0, 0.02) || near(h, 1.4, 0.02)) return "1"
    const g = ih(fl(s * 32), 21)
    if (g < 0.35 && h > 2.75 - 0.25 - g * 2) return "1"
    // a tag over the bins
    if (s >= 5.25 && s < 5.75 && h >= 1.1 && h < 1.32) {
      const row = TAG[fl((1.32 - h) * 30 * 6 / 7)], ch = row?.[fl((s - 5.25) * 32 * 14 / 16)]
      if (ch && ch !== ".") return ch
    }
    return "2"
  })

  // the Kessel Block (left): its old tiles to the cornice, its windows, the washing, the electrical box
  const LEFT_WINDOWS = windows([[0.35, 3.85, "dark"], [1.15, 3.85, "low"], [2.0, 3.85, "dark", true], [2.85, 3.85, "amber"],
    [3.7, 3.85, "dark"], [4.55, 3.85, "tv"], [5.4, 3.85, "dark", true], [3.7, 5.0, "amber"], [4.55, 5.0, "dark"], [5.4, 5.0, "low"]], 0.5, 0.7)
  // washing on a line between two windows: a shirt, socks, a towel (s, width, drop, key)
  const WASH = [[4.15, 0.22, 0.32, "H"], [4.42, 0.06, 0.12, "q"], [4.5, 0.06, 0.12, "q"], [4.62, 0.26, 0.4, "C"], [4.95, 0.18, 0.26, "U"]]
  ISOKIT.wall("facade_left", (s, h, o) => {
    if (h < 0.08) return "1"
    if (s > 5.86) { const a = o.a; if (a >= 1 && a <= 3) return near(h % 0.9, 0.5, 0.03) ? "1" : a === 2 ? "5" : a === 1 ? "4" : "2" }   // the downpipe
    // the line of washing, sagging
    const sag = 3.62 - 0.08 * Math.sin(((s - 4.05) / 1.1) * Math.PI)
    if (s > 4.05 && s < 5.15) {
      if (near(h, sag, 0.017)) return "4"
      for (const [s0, w, d, k] of WASH) if (s >= s0 && s < s0 + w && h < sag && h > sag - d) return near(h, sag - d + 0.02, 0.02) || s < s0 + 0.02 ? (k === "H" ? "h" : k === "C" ? "c" : k === "U" ? "u" : "r") : k
    }
    const k = LEFT_WINDOWS(s, h); if (k) return k
    if (h >= 3.15 && h < 3.36) return h > 3.32 ? "5" : h < 3.18 ? "1" : "4"            // the cornice
    if (h >= 3.36) return near(h % 1.15, 0.1, 0.02) ? "3" : "2"
    // the electrical box the cart's cable comes out of: its door, the red lamp, the cable down to the floor
    if (s >= 5.2 && s < 5.6 && h >= 0.85 && h < 1.6) {
      if (h > 1.56) return "5"
      if (s < 5.23 || s > 5.57 || h < 0.88) return "2"
      if (near(s, 5.32, 0.02) && near(h, 1.45, 0.025)) return "!q"
      return near(s, 5.4, 0.015) ? "3" : "4"
    }
    if (near(s, 5.35, 0.022) && h < 0.85) return "k"
    // torn posters by it: Halcyon's cyan, a gig's magenta over it, both torn
    if (s >= 5.62 && s < 5.84 && h >= 0.75 && h < 1.4) {
      const torn = h > 1.3 - 0.06 * Math.sin(s * 70) || (s > 5.74 && h < 0.95)
      if (torn) return h > 1.36 ? "3" : "2"
      if (s > 5.7 && h < 1.2) return near(h % 0.08, 0, 0.015) ? "N" : "M"
      return near(h % 0.1, 0.05, 0.015) ? "v" : "C"
    }
    // the buzzer panel by the street door (two columns of buttons), the camera over the door
    if (s >= 1.26 && s < 1.42 && h >= 1.05 && h < 1.55) return s < 1.28 || s > 1.4 || h < 1.07 || h > 1.53 ? "2" : near((h - 1.05) % 0.07, 0.035, 0.015) && !near(s, 1.34, 0.02) ? "6" : "4"
    if (s >= 1.28 && s < 1.56 && h >= 2.4 && h < 2.55) return near(s, 1.31, 0.02) && near(h, 2.47, 0.02) ? "!q" : h > 2.52 ? "5" : s > 1.51 ? "2" : "4"
    if (near(s, 1.42, 0.02) && h >= 2.55 && h < 2.8) return "3"
    // the ground storey: old square tiles, grimy, some gone
    if (near(s % 0.25, 0, 0.016) || near(h % 0.25, 0, 0.017)) return "2"
    const i = fl(s / 0.25), j = fl(h / 0.25)
    if (ih(i * 3, j * 11) < 0.05) return "1"
    return j > 9 && ih(i, 77) < 0.5 ? "2" : "3"
  })

  // ---------------------------------------------------------------- the Kessel Block's street door
  ISOKIT.opening("kessel_street_door", {
    pad: [0.08, 0, 0.08, 0.06],
    paint(s, h, o) {
      return pic(o, "door", [3, 0, 3, 2], (c, X, Y) => {
        const { aw, ah, f } = o
        // the frame; the transom over the glass, KESSEL stencilled on it
        c.rect(X - 3, Y - 2, aw + 6, ah + 2, "2"); c.rect(X - 2, Y - 1, aw + 4, ah + 1, "4"); c.vline(X - 2, Y - 1, ah + 1, "5")
        c.rect(X + 1, Y + 1, aw - 2, 9, "3"); c.hline(X + 1, Y + 1, aw - 2, "5"); c.hline(X + 1, Y + 9, aw - 2, "2")
        TXT.draw(c, X + fl(aw / 2), Y + 3, "KESSEL", "H", { font: "hud", align: "center" })
        // the glass: the lobby's cold light inside, its tiles, the yellow wet-floor sign by the door
        const gx = X + 2, gy = Y + 12, gw = aw - 4, gh = ah - 17
        c.rect(gx, gy, gw, gh, "!w")
        c.rect(gx, gy, gw, 8, "!z"); c.rect(gx, gy + 8, gw, 2, "!Z")
        for (let y = gy + gh - 14; y < gy + gh; y++) for (let x = gx; x < gx + gw; x++) if ((x + 2 * y) % 9 === 0) c.px(x, y, "!Z")
        c.grid(gx + gw - 8, gy + gh - 8, ["..y..", ".yYy.", ".yjy.", "yYYYy", "y...y", "j...j"], { y: "!y", Y: "!Y", j: "!j" })
        c.rect(gx + 2, gy + 12, 4, gh - 26, "!x")                                 // the ceiling lamp's sheen on the glass
        // the rain running down the glass
        for (let i = 0; i < 5; i++) {
          const x = gx + 2 + ((i * 7) % (gw - 3)), y0 = (i * 11 + f * 3) % (gh + 8) - 4
          for (let y = Math.max(0, y0); y < Math.min(gh, y0 + 3); y++) c.px(x, gy + y, "!H")
        }
        c.rect(X + 1, Y + ah - 34, aw - 2, 2, "5"); c.hline(X + 1, Y + ah - 34, aw - 2, "6")   // the push bar
        c.rect(X, Y + ah - 5, aw, 5, "3"); c.hline(X, Y + ah - 5, aw, "5")                     // the kick plate
      })
    },
  })

  // ---------------------------------------------------------------- LUCKY STATIC
  ISOKIT.opening("lucky_window", {
    pad: [0.06, 0.12, 0.06, 0.06],
    halo: [{ color: "#ffb860", reach: 0.45, power: 1.0 }],
    paint(s, h, o) {
      return pic(o, "win", [2, 4, 2, 2], (c, X, Y) => {
        const { aw, ah } = o
        c.rect(X - 2, Y - 2, aw + 4, ah + 6, "1")
        c.rect(X - 2, Y + ah, aw + 4, 2, "5"); c.hline(X - 2, Y + ah + 2, aw + 4, "4")     // the sill
        // the bar inside: the ceiling dark, the back wall warm
        c.rect(X, Y, aw, ah, "!P"); c.rect(X, Y, aw, 7, "!O")
        // the shelves of bottles behind the counter
        for (const sy of [17, 26]) {
          c.hline(X, Y + sy, aw, "!O")
          for (let x = X + 2; x < X + aw - 2; x += 3) if (ih(x, sy) < 0.75) {
            const k = ["!C", "!q", "!R", "!H", "!Q", "!M"][fl(ih(x * 3, sy) * 6)]
            c.vline(x, Y + sy - 4, 4, k); c.px(x, Y + sy - 5, k === "!H" ? "!h" : "!O")
          }
        }
        // the lamps over the counter
        for (const lx of [10, 30, 50]) { c.vline(X + lx, Y, 7, "!O"); c.rect(X + lx - 2, Y + 7, 5, 2, "!R"); c.hline(X + lx - 1, Y + 9, 3, "!W") }
        // the TV high in the corner, the news on it
        c.rect(X + aw - 15, Y + 8, 13, 9, "!k"); c.rect(X + aw - 14, Y + 9, 11, 7, "!C"); c.hline(X + aw - 13, Y + 14, 9, "!v"); c.rect(X + aw - 12, Y + 10, 4, 3, "!V")
        // the counter, two regulars' backs on their stools
        c.rect(X, Y + 36, aw, 3, "!Q"); c.hline(X, Y + 36, aw, "!R"); c.rect(X, Y + 39, aw, ah - 39, "!O")
        for (const [x, w] of [[19, 9], [39, 8]]) {
          c.ellipse(X + x, Y + 27, 3, 3, "!a"); c.rect(X + x - (w >> 1), Y + 31, w, 9, "!a"); c.rect(X + x - (w >> 1) + 1, Y + 30, w - 2, 1, "!a")
          c.vline(X + x, Y + 40, ah - 40, "!a"); c.hline(X + x - 2, Y + 40, 5, "!A")
        }
        // the mullion; OPEN in the corner
        c.vline(X + 33, Y, ah, "1")
        c.rect(X + 2, Y + ah - 12, 27, 10, "!n"); TXT.draw(c, X + 4, Y + ah - 10, "OPEN", "!m")
        // steam on the glass from the kitchen: the lower part paler, two drops run clear through it
        for (let y = Y + ah - 16; y < Y + ah; y++) for (let x = X; x < X + aw; x++) {
          if (x === X + 33 || x === X + 12 || x === X + 47) continue
          if (bay(x, y) < (y - (Y + ah - 16)) / 20) { const k = c.key(x, y); const up = { "!O": "!P", "!P": "!Q", "!a": "!A", "!A": "!P" }[k]; if (up) c.px(x, y, up) }
        }
      })
    },
  })
  ISOKIT.opening("lucky_door", {
    pad: [0.06, 0, 0.06, 0.08],
    halo: [{ color: "#ffb860", reach: 0.55, power: 1.2 }],
    pass: (s, h, w, hh) => s > 0.06 && s < w - 0.06 && h < hh - 0.05,
    paint(s, h, o) {
      return pic(o, "door", [2, 0, 2, 2], (c, X, Y) => {
        const { aw, ah } = o
        c.rect(X - 2, Y - 2, aw + 4, ah + 2, "1"); c.hline(X - 2, Y - 2, aw + 4, "4")
        // the light pouring out, brightest in the middle; the step
        c.rect(X, Y, aw, ah, "!R"); c.rect(X + 4, Y + 4, aw - 8, ah - 4, "!W")
        c.rect(X, Y + ah - 3, aw, 3, "!Q"); c.hline(X, Y + ah - 3, aw, "!P")
        // the noren: four strips with a white disc on each
        const sw = fl(aw / 4)
        for (let i = 0; i < 4; i++) {
          const x0 = X + i * sw, n = 22 + (i % 2)
          c.rect(x0, Y, sw - 1, n, i % 2 ? "!M" : "!m"); c.vline(x0 + sw - 2, Y, n, "!n")
          c.ellipse(x0 + fl(sw / 2) - 1, Y + 14, 2, 2, "!N")
        }
        c.rect(X - 1, Y, aw + 2, 2, "4")
      })
    },
  })
  ISOKIT.opening("lucky_sign", {
    pad: 0.04,
    halo: [{ color: "#ff4fd3", reach: 0.6, power: 1.3 }],
    paint(s, h, o) {
      return pic(o, "sign", [1, 1, 1, 1], (c, X, Y) => {
        const { aw, ah, f } = o
        c.rect(X - 1, Y - 1, aw + 2, ah + 2, "k"); c.rect(X, Y, aw, ah, "n")
        c.rect(X + 2, Y + 2, aw - 4, ah - 4, "!M"); c.rect(X + 3, Y + 3, aw - 6, ah - 6, "n")                 // the tube round it
        const label = "LUCKY STATIC", w = TXT.measure(label), x0 = X + fl((aw - w) / 2), y0 = Y + fl((ah - 7) / 2)
        TXT.draw(c, x0, y0, label, "!m")
        // the Y's tube stutters
        if (f === 3 || f === 4 || f === 10) { const yx = x0 + 4 * 6; for (let y = y0; y < y0 + 7; y++) for (let x = yx; x < yx + 5; x++) if (c.key(x, y) === "!m") c.px(x, y, "!M") }
        for (const bx of [X + 10, X + aw - 11]) c.rect(bx, Y - 1, 2, 1, "4")
      })
    },
  })

  // ---------------------------------------------------------------- the big ad screen, half broken
  const SCREEN_IMPACT = [0.78, 0.62]                   // where something hit it, in the screen's own fractions
  ISOKIT.opening("ad_screen", {
    pad: 0.12,
    halo: [{ color: "#62def0", reach: 0.8, power: 1.4 }],
    paint(s, h, o) {
      return pic(o, "ad", [4, 4, 4, 4], (c, X, Y) => {
        const { aw, ah, f } = o
        // the housing
        c.rect(X - 4, Y - 4, aw + 8, ah + 8, "k"); c.rect(X - 3, Y - 3, aw + 6, ah + 6, "4")
        c.hline(X - 3, Y + ah + 2, aw + 6, "5"); c.vline(X - 3, Y - 3, ah + 6, "5"); c.rect(X - 1, Y - 1, aw + 2, ah + 2, "k")
        const half = fl(aw * 0.52)
        // the advert: HALCYON, a sleeping face, SLEEP BETTER
        c.rect(X, Y, half + 4, ah, "!C"); c.rect(X, Y, half + 4, 12, "!c")
        TXT.draw(c, X + 4, Y + 3, "HALCYON", "!V")
        // a woman asleep, her cheek on a pillow, smiling: the pillow, her hair, her face, eyes shut
        const fx = X + fl(half / 2) + 1, fy = Y + 33
        c.rect(X + 3, fy + 6, half - 4, 12, "!H"); c.hline(X + 3, fy + 6, half - 4, "!V"); c.hline(X + 3, fy + 17, half - 4, "!h")
        c.ellipse(fx, fy - 1, 12, 12, "!c"); c.rect(fx - 12, fy, 25, 10, "!c")               // her hair, down onto the pillow
        c.ellipse(fx, fy + 1, 9, 10, "!V"); c.ellipse(fx + 4, fy + 3, 4, 7, "!v")              // her face, its shade
        c.rect(fx - 9, fy - 10, 19, 4, "!c"); c.px(fx - 2, fy - 6, "!c"); c.px(fx + 3, fy - 6, "!c")   // the fringe
        for (const ex of [fx - 4, fx + 4]) { c.px(ex - 2, fy, "!C"); c.hline(ex - 1, fy + 1, 3, "!c"); c.px(ex + 2, fy, "!C") }   // shut, content
        c.px(fx - 6, fy + 4, "!C"); c.px(fx + 6, fy + 4, "!C")                                 // blush
        c.hline(fx - 1, fy + 6, 3, "!c"); c.px(fx - 2, fy + 5, "!c"); c.px(fx + 2, fy + 5, "!c") // the smile
        c.rect(X, Y + ah - 11, half + 4, 11, "!c")
        TXT.draw(c, X + 3, Y + ah - 8, "SLEEP BETTER", "!V", { font: "hud" })
        // a glitch: a slice of the advert slid sideways, another each frame
        const g0 = [20, 41, 28, 50, 33, 14][f % 6], sh = 2 + (f % 3)
        for (let y = Y + g0; y < Y + g0 + 2; y++) for (let x = X + half; x >= X + sh; x--) { const k = c.key(x - sh, y); if (k) c.px(x, y, k) }
        // the broken half: static, a bright band rolling through it, cracks from the impact
        const tear = (y) => X + half + fl(2.5 * Math.sin(y * 0.55 + 1)) + (y % 9 === 4 ? 3 : 0) - (y % 13 === 2 ? 4 : 0)
        for (let y = Y; y < Y + ah; y++) for (let x = X; x < X + aw; x++) {
          const tx = tear(y)
          if (x < tx - 3) continue
          const n = ih(x * 7 + f * 131, y * 13 + f * 17)
          if (x < tx) { if (n < 0.45) c.px(x, y, n < 0.2 ? "!6" : "!k"); continue }
          let k = n < 0.3 ? "!k" : n < 0.55 ? "!2" : n < 0.75 ? "!4" : n < 0.88 ? "!c" : n < 0.96 ? "!6" : "!v"
          if ((y - Y + f * 6) % ah < 2) k = n < 0.4 ? "!6" : "!V"
          c.px(x, y, k)
        }
        const ix = X + fl(aw * SCREEN_IMPACT[0]), iy = Y + fl(ah * SCREEN_IMPACT[1])
        for (const [ex, ey] of [[X + half + 6, Y + ah - 1], [X + aw - 1, Y + 20], [X + aw - 8, Y + ah - 1], [X + half + 12, Y], [X + half, Y + ah - 20], [X + aw - 1, Y + ah - 10], [X + aw - 20, Y]]) {
          c.line(ix, iy, ex, ey, "!V"); c.line(ix, iy + 1, ex, ey + 1, "!k")
        }
        for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) c.px(ix + dx, iy + dy, "!V")
        // a dead column of pixels
        c.vline(X + half + 22, Y, ah, "!k")
      })
    },
  })

  // ---------------------------------------------------------------- the alley to the Drain Market: shut tonight
  ISOKIT.opening("alley_gate", {
    pad: [0.06, 0, 0.06, 0.1],
    paint(s, h, o) {
      return pic(o, "alley", [2, 0, 2, 3], (c, X, Y) => {
        const { aw, ah } = o
        c.rect(X - 2, Y - 3, aw + 4, ah + 3, "1"); c.rect(X, Y, aw, ah, "k")
        // the steps going down into the dark, a lamp far down at the bottom
        for (let i = 0; i < 9; i++) { const y = Y + ah - 4 - i * 6; c.hline(X + 2 + i, y, aw - 4 - i * 2, i < 3 ? "2" : "1"); c.hline(X + 2 + i, y + 1, aw - 4 - i * 2, "e") }
        const lx = X + fl(aw / 2), ly = Y + 26
        for (let y = ly - 7; y < ly + 8; y++) for (let x = lx - 7; x < lx + 8; x++) { const d = Math.hypot(x - lx, (y - ly) * 1.3); if (d < 7 && bay(x, y) < 0.7 * (1 - d / 7)) c.px(x, y, "!O") }
        c.rect(lx - 1, ly, 3, 2, "!Q"); c.px(lx, ly, "!R")
        // the lattice gate pulled across and chained: its rails, the crossing bars
        const g0 = Y + ah - 64
        c.rect(X, g0, aw, 3, "4"); c.hline(X, g0, aw, "5"); c.rect(X, Y + ah - 3, aw, 3, "3")
        for (let y = g0 + 3; y < Y + ah - 3; y++) for (let x = X; x < X + aw; x++) {
          const p = (x - X + (y - g0)) % 8, q = (x - X - (y - g0) + 800) % 8
          if (p === 0 || q === 0) c.px(x, y, "4")
          if ((x - X) % 8 === 4) c.px(x, y, "3")
        }
        // the chain and the padlock in the middle
        const cx = X + fl(aw / 2), cy = Y + ah - 34
        c.line(cx - 7, cy - 3, cx + 6, cy + 2, "G"); c.line(cx - 7, cy - 2, cx + 6, cy + 3, "g")
        c.rect(cx - 2, cy + 2, 5, 5, "G"); c.hline(cx - 2, cy + 6, 5, "g"); c.px(cx, cy + 4, "1"); c.rect(cx - 1, cy, 3, 2, "g")
        // DRAIN MKT on an enamel plate on the gate's top rail, an arrow down
        const px0 = X, py0 = g0 - 22
        c.rect(px0, py0, aw, 20, "c"); c.rect(px0 + 1, py0 + 1, aw - 2, 18, "C")
        TXT.draw(c, px0 + 2, py0 + 2, "DRAIN", "V")
        TXT.draw(c, px0 + 2, py0 + 11, "MKT", "V")
        const ax = px0 + 25; c.vline(ax, py0 + 11, 5, "V"); c.hline(ax - 2, py0 + 14, 5, "V"); c.hline(ax - 1, py0 + 15, 3, "V")
      })
    },
  })

  // ---------------------------------------------------------------- props
  // the noodle machine: cups behind glass, one row sold out, the dispenser flap; over the buttons its little
  // display with a face, tired (the city's machines have moods); it opens its eyes now and then
  const CUPS = ["Q", "m", "H", "q", "C", "R"]
  ISOKIT.prop("vending", {
    frames: 12,
    glows: [glow("vV", { r: 3, strength: 0.3 })],
    draw(pen, p, f) {
      const [u0, v0] = p.at, du = p.foot[0], dv = p.foot[1], H = p.h
      const front = (a, e, o) => {
        const aw = o.aw
        if (a === 0 || a === aw - 1) return "1"
        if (e < 2) return "1"
        if (e >= 4 && e <= 8 && a >= 4 && a <= aw - 6) return e === 8 ? "2" : "k"                        // the flap
        if (e < 12) return e === 11 ? "4" : "3"
        // the header: its face on a dark screen, tired (eyes half shut, a flat mouth); on two frames it looks up
        if (e >= ISOKIT_H(H) - 14 && e < ISOKIT_H(H) - 4) {
          if (a < 2 || a > aw - 3) return "4"
          const ty = ISOKIT_H(H) - 5 - e, mid = fl(aw / 2), awake = f === 6 || f === 7
          const eye = (a >= mid - 6 && a <= mid - 3) || (a >= mid + 2 && a <= mid + 5)
          if (eye && (awake ? ty >= 2 && ty <= 4 : ty === 4)) return awake && ty === 2 ? "!v" : "!V"
          if (eye && !awake && ty === 3) return "!C"
          if (ty === 7 && a >= mid - 2 && a <= mid + 2) return "!v"
          return ty === 0 || ty === 9 ? "!C" : "!c"
        }
        if (e >= ISOKIT_H(H) - 4) return e === ISOKIT_H(H) - 1 ? "5" : "4"
        // the buttons' column: the display with its face, the coin slot, the card reader
        if (a >= aw - 6) {
          if (a === aw - 6) return "2"
          if (e >= 32 && e <= 36) return e === 32 || e === 36 || a === aw - 5 || a === aw - 2 ? "2" : e === 34 && a === aw - 4 ? "!q" : "!c"   // the price, red: sold out
          if (e >= 22 && e <= 29) return (e - 22) % 3 === 2 ? "3" : a === aw - 4 ? "6" : "5"
          if (e === 17 || e === 18) return a === aw - 4 ? "k" : "4"
          if (e === 14) return a === aw - 3 ? "!v" : "4"
          return "4"
        }
        // the cups behind the glass: four rows; the second sold out (a red light under each slot)
        if (a >= 2 && e >= 13 && e <= 39) {
          const row = fl((e - 13) / 7), re = (e - 13) % 7, col = fl((a - 2) / 4), ra = (a - 2) % 4
          if (re === 0) return "!5"
          if (row === 1) return re === 1 && ra === 1 ? "!q" : "!1"
          if (ra === 3) return "!2"
          if (re >= 4 && re <= 5) return "!" + CUPS[(col + row * 2) % CUPS.length]
          if (re >= 1 && re <= 3) return re === 3 ? "!h" : "!H"
          return "!2"
        }
        return "3"
      }
      const side = (a, e, o) => {
        if (e < 2) return "1"
        if (e >= ISOKIT_H(H) - 4) return e === ISOKIT_H(H) - 1 ? "5" : "4"
        if (e >= 4 && e <= 10 && a >= 4 && a <= o.aw - 4 && e % 2 === 0) return "1"                  // its vents
        if (a >= 6 && a <= 12 && e >= 24 && e <= 31) return e === 24 || e === 31 ? "h" : e >= 27 && e <= 28 && a > 7 && a < 11 ? "q" : "H"   // a sticker
        return a === 0 ? "4" : "3"
      }
      pen.box(u0, v0, 0, du, dv, H, (lu, lv) => (lu > du - 0.05 || lv > dv - 0.05 ? "5" : "4"), side, front)
    },
  })
  const ISOKIT_H = (h) => Math.round(h * 30)

  // a wheelie bin: ribbed, the lid held up by a bag stuffed in under it
  ISOKIT.prop("bins", {
    draw(pen, p) {
      const [u0, v0] = p.at, du = p.foot[0], dv = p.foot[1], H = p.h
      const body = (a, e, o) => {
        if (e < 3 && (a < 4 || a > o.aw - 5)) return "k"                                                   // the wheels
        if (e >= o.ah - 3) return e === o.ah - 1 ? "4" : "3"
        if (a % 5 === 2) return "1"
        if (e >= 14 && e <= 17 && a >= 6 && a <= 10) return e === 14 || e === 17 ? "c" : "C"              // the city's sticker
        return "2"
      }
      pen.box(u0, v0, 0, du, dv, H, null, (a, e, o) => (e >= o.ah - 3 ? (e === o.ah - 1 ? "3" : "2") : a % 5 === 2 ? "1" : "2"), body)
      // the bag stuffed in under the lid, bulging out over the rim; the lid on it, lifted
      { const [x, y] = pen.P(u0 + du * 0.5, v0 + dv, H)
        pen.at(u0 + du * 0.5, v0 + dv, H + 0.05, "v")
        pen.grid(x - 7, y - 5, ["....3.3........", "....333..4.....", "..44344444445..", ".444444454444..", "4444445444444.", "1444444444441."]) }
      pen.box(u0 - 0.02, v0 - 0.02, H + 0.12, du + 0.04, dv + 0.04, 0.04, (lu, lv) => (lv > dv - 0.04 ? "6" : "5"), () => "4", () => "5")
    },
  })

  // Bao's cart: a magenta front with his name and a bowl painted on it, wheels, the counter with the pot,
  // bowls and the chopsticks (its umbrella is bao_umbrella: the pole, the canopy, a paper lantern off its
  // rim on the street side, the rain dripping off it)
  const CART_FRONT = {}
  ISOKIT.prop("bao_cart", {
    frames: 12,
    solid: (p) => [[p.at[0], p.at[1], 0, p.foot[0], p.foot[1], p.h]],
    draw(pen, p, f) {
      const [u0, v0] = p.at, du = p.foot[0], dv = p.foot[1], H = p.h
      // painted on the front: BAO, a bowl with steam and chopsticks
      const FRONT = (aw, ah) => (CART_FRONT[aw + "x" + ah] ??= ISOKIT.raster(aw, ah, (c) => {
        TXT.draw(c, 5, 9, "BAO", "Q", { font: "hud" })
        c.grid(19, 9, ["..h.h...P", "...h.h.P.", "HHHHHHHH.", ".HhhhhH..", "..HHHH..."])
      }))
      const front = (a, e, o) => {
        const aw = o.aw, ah = o.ah
        if (e >= ah - 2) return e === ah - 1 ? "R" : "P"                                             // the counter's wooden lip
        const art = FRONT(aw, ah)(a, e); if (art) return art
        const w = [[6, 3], [aw - 7, 3]].find(([wx, we]) => Math.hypot(a - wx, e - we) < 3.6)          // wheels
        if (w) { const d = Math.hypot(a - w[0], e - w[1]); return d < 1.2 ? "5" : d < 2.4 ? "1" : "k" }
        if (e < 5) return "O"
        if (a <= 1 || a >= aw - 2 || e <= 6 || e >= ah - 4) return "n"
        return "M"
      }
      const side = (a, e, o) => {
        if (e >= o.ah - 2) return e === o.ah - 1 ? "R" : "P"
        if (e < 5) return "O"
        if (a >= 4 && a <= 8 && e >= 9 && e <= 20) return a === 4 || e === 20 ? "h" : "H"            // a towel on its hook
        return e % 5 === 0 ? "O" : "P"
      }
      pen.box(u0, v0, 0, du, dv, H, (lu, lv) => (lu > du - 0.06 || lv > dv - 0.06 ? "6" : "5"), side, front)
      // on the counter: the stockpot, the bowls stacked, the chopsticks in their cup
      const top = (u, v, h) => { pen.at(u, v, h, "up"); return pen.P(u, v, h) }
      { const [x, y] = top(u0 + 0.75, v0 + 0.3, H); pen.ellipse(x, y, 7, 3, "3"); pen.rect(x - 7, y - 8, 15, 8, "4"); pen.vline(x - 7, y - 8, 8, "5"); pen.vline(x + 7, y - 8, 8, "3")
        pen.ellipse(x, y - 8, 7, 3, "5"); pen.ellipse(x, y - 8, 6, 2, "3"); pen.hline(x - 3, y - 9, 6, "R"); pen.px(x + 2, y - 8, "W") }
      { const [x, y] = top(u0 + 0.25, v0 + 0.42, H + 0.02); pen.ellipse(x, y, 3, 1, "H"); pen.hline(x - 2, y, 5, "h"); pen.ellipse(x, y - 2, 3, 1, "H"); pen.hline(x - 2, y - 2, 5, "h") }
      { const [x, y] = top(u0 + 0.12, v0 + 0.15, H); pen.rect(x - 1, y - 4, 3, 4, "O"); pen.line(x - 1, y - 9, x, y - 4, "P"); pen.line(x + 1, y - 9, x + 1, y - 4, "R") }
    },
  })
  // the umbrella over Bao's cart, a prop of its own, so the engine can draw it see-through over whoever it
  // hides (the map's seeThrough)
  ISOKIT.prop("bao_umbrella", {
    frames: 12,
    solid: () => [],
    footprint: () => [],
    draw(pen, p, f) {
      const cart = MAP.props.find((q) => q.id === p.over), [u0, v0] = cart.at, H = cart.h
      // the umbrella: its pole, eight panels round the apex, those facing the upper left a tone lighter, one torn
      const cu = u0 + 0.3, cv = v0 + 0.15, CH = p.h
      { const [ax, ay] = pen.P(cu, cv, H), [tx, ty] = pen.P(cu, cv, CH); pen.at(cu, cv, 1.5, "v"); pen.vline(ax, ty, ay - ty, "4"); pen.vline(ax + 1, ty, ay - ty, "2") }
      const [cx, cy] = pen.P(cu, cv, CH), RX = 32, RY = 16, AP = 6
      for (let y = cy - RY - AP; y <= cy + RY + 1; y++) for (let x = cx - RX - 1; x <= cx + RX + 1; x++) {
        const dx = (x - cx) / RX, dy = (y - cy) / RY, rr = dx * dx + dy * dy
        if (rr > 1) continue
        const lift = AP * (1 - Math.sqrt(rr)), yy = (y + lift - cy) / RY
        if (dx * dx + yy * yy > 1.02) continue
        const an = Math.atan2(yy, dx), seg = ((fl((an + Math.PI) / (Math.PI / 4)) % 8) + 8) % 8
        const edge = Math.abs(((an + Math.PI) % (Math.PI / 4)) - Math.PI / 8) > Math.PI / 8 - 0.07
        let k = seg >= 1 && seg <= 3 ? "U" : "u"
        if (edge) k = "k"
        if (rr > 0.88) k = dy > 0 ? "k" : "U"
        if (seg === 6 && rr > 0.35 && rr < 0.7 && ih(x, y) < 0.6) k = "k"
        // the canopy's point in the room: over the cart, at its height (the light sees it there)
        pen.at(cu + (dx * 0.6), cv - (dx * 0.6), CH - 0.2 * rr, "up")
        pen.px(x, y - fl(lift), k)
      }
      pen.px(cx, cy - AP - 1, "6")
      // the paper lantern off the rim on the street side, warm
      // (hung on the rim's front left, the map's lantern light where it hangs; a cord of 3 px)
      { const lx = cx - fl(RX * 0.55), rim = cy + fl(RY * Math.sqrt(1 - 0.55 * 0.55)), ly = rim + 4
        pen.at(cu - 0.03, cv + 0.57, 2.2, "v"); pen.vline(lx, rim + 1, 3, "4")
        pen.at(cu - 0.03, cv + 0.57, 1.95, "v"); pen.rect(lx - 2, ly, 5, 7, "!Q"); pen.vline(lx, ly + 1, 5, "!R"); pen.px(lx, ly + 3, "!W"); pen.hline(lx - 2, ly, 5, "!O"); pen.hline(lx - 2, ly + 6, 5, "!O") }
      // drips off the rim, falling a frame at a time
      for (let i = 0; i < 5; i++) {
        const t = (f + i * 5) % 12, dx = [-28, -12, 4, 17, 29][i], ry = cy + fl(Math.sqrt(Math.max(0, 1 - (dx / RX) ** 2)) * RY)
        pen.at(cu, cv + 0.9, 1.0, "v"); pen.px(cx + dx, ry + 2 + t * 3, "6")
      }
    },
  })
  // string lights across the street, from facade to facade: two cables sagging, bulbs amber and magenta by
  // turns, one dead, one blinking
  ISOKIT.prop("string_lights", {
    frames: 12,
    outline: false,
    solid: () => [],
    footprint: () => [],
    draw(pen, p, f) {
      const RUNS = [[[0, 1.6, 3.45], [2.6, 0, 3.55]], [[0, 3.4, 3.35], [4.8, 0, 3.6]]]
      RUNS.forEach(([a, b], r) => {
        let last = null, n = 0
        for (let t = 0; t <= 1.0001; t += 0.004) {
          const sag = Math.sin(t * Math.PI) * 0.45, q = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t - sag]
          const [x, y] = pen.P(...q)
          if (last && last[0] === x && last[1] === y) continue
          last = [x, y]; n++
          pen.at(...q, "up")
          if (n % 9 === 4) {
            const i = fl(n / 9), dead = r === 1 && i === 5, blink = r === 0 && i === 3 && f % 4 < 2
            const k = dead ? "2" : blink ? "O" : i % 2 ? "!m" : "!R"
            pen.px(x, y + 1, k); pen.px(x, y + 2, dead || blink ? "1" : k === "!m" ? "!M" : "!Q")
          }
          pen.px(x, y, "1")
        }
      })
    },
  })
  return { inPuddle, PUDDLES }
})()

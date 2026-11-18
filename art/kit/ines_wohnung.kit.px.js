// The kit pieces ines_wohnung needs (art/rooms/ines_wohnung.map.js), made by tools/new-room.mjs. BLOCKS for the user's approval
// (kapitel2-design §3.3 W5–W7, §9.2): plain shapes for Ines' flat after the Quiet emptied it, to be painted on their lines once approved.
// No lamp burns: the street's light comes in through the window, cold, and a little of the landing's under the door. Registered with
// ISOKIT (art/lib/isokit.js has the calls), drawn in room meters, lit by the bake; keys of the world palette (art/lib/iso.js) and the few
// below. A kit's names are global in a bake: keep this one's prefixed.
//
//   floor    m  laminate boards along the window's wall; where the computer stood by the left wall the boards are paler (a clean
//            square in the dust), the cable's mark across it; papers dropped on the floor where they emptied the shelves
//   walls    iw_wall  pale plaster over a skirting, paler squares where her posters hung, the pins' holes
//   openings iw_window (the street: the block across with its windows, a Lull screen's cyan, rain), iw_door (the door to the landing,
//            its lock broken out), iw_socket (the socket by the clean square, the computer's cables cut off short)
//   props    iw_fridge (old, white, the freezer compartment on top; the napkin under a magnet on its door), iw_counter (a short counter,
//            an espresso machine of chrome on it, a cup), iw_shelves (real wood, empty, one cup left), iw_bed (a low platform bed of oak,
//            the mattress bare, the bedding pulled off onto the floor), iw_armchair (cognac leather, worn), iw_arclamp (a designer's arc
//            lamp over the armchair, off), iw_officechair (an ergonomic chair before the clean square), iw_plant (a big plant in a glazed
//            pot, its leaves hanging: nobody waters it), iw_box (a cardboard box tipped over, empty)
// "Both mixed" (the user's choice, 2026-11-18): a plain flat in the Ninth, and a few good things in it that say she had money; the rug.
pal({ "ĝ": "#3e5a3a", "Ĝ": "#5f7d4a", "ŵ": "#8a8678" })

const KIT_INES_WOHNUNG = (() => {
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w, fl = Math.floor, ih = ISO.ihash
  Object.assign(ISOKIT.TINT.cold, { "ĝ": ["ĝ", "Ĝ"], "Ĝ": ["Ĝ", "Ĝ"] })

  // ---------------------------------------------------------------- floor and walls
  const PAPERS = [[1.6, 1.1, 0.4], [1.85, 1.35, 1.1], [1.3, 2.6, 0.2], [2.5, 2.3, 0.8], [0.9, 2.95, 1.4]]
  ISOKIT.floor("m", (u, v) => {
    for (const [pu, pv, r] of PAPERS) {                                                  // papers, A4, turned every way
      const du = u - pu, dv = v - pv, a = Math.cos(r) * du + Math.sin(r) * dv, b = -Math.sin(r) * du + Math.cos(r) * dv
      if (Math.abs(a) < 0.1 && Math.abs(b) < 0.14) return Math.abs(a) > 0.085 || Math.abs(b) > 0.125 ? "h" : "H"
    }
    if (u > 2.6 && u < 4.4 && v > 1.85 && v < 3.35) {                                   // the rug: deep red, a border, a pattern
      const b = u < 2.68 || u > 4.32 || v < 1.93 || v > 3.27
      return b ? "I" : (fl(u * 8) + fl(v * 8)) % 3 === 0 ? "n" : "i"
    }
    const clean = u < 0.62 && v > 0.95 && v < 1.75                                       // where the computer stood
    if (clean && near(v, 1.3, 0.012) && u < 0.5) return "1"                             // the cable's mark
    if (near(v * 5, Math.round(v * 5), 1 / 16)) return "e"                               // the boards' joints
    if (near((u + fl(v * 5) * 0.37) % 1.2, 0, 1 / 40)) return "e"
    return clean ? (u > 0.58 || v < 0.99 || v > 1.71 ? "Z" : "X") : "z"
  })
  // the balcony: grey tiles, wet, a drain in the corner, a puddle mirroring the sky's glow
  ISOKIT.floor("b", (u, v) => {
    if (Math.hypot(u - 7.6, v - 2.1) < 0.06) return "1"
    if (Math.hypot((u - 7.1) / 1.6, v - 1.0) < 0.22) return "Z"
    return near(u * 3, Math.round(u * 3), 1 / 20) || near(v * 3, Math.round(v * 3), 1 / 20) ? "e" : "f"
  })
  ISOKIT.wall("iw_wall", (s, h, o) => {
    if (h < 0.08) return h >= 0.055 ? "4" : "1"
    const right = o.wall && o.wall.from[1] === o.wall.to[1]
    // the posters gone: paler squares, a pin hole in each corner
    for (const [s0, s1, h0, h1] of right ? [[0.95, 1.55, 1.35, 2.15], [1.65, 1.95, 1.55, 1.95]] : [[0.4, 1.0, 1.3, 2.0], [2.15, 2.6, 1.5, 2.1]]) {
      if (s >= s0 && s < s1 && h >= h0 && h < h1) return (near(s, s0 + 0.03, 0.01) || near(s, s1 - 0.03, 0.01)) && (near(h, h0 + 0.03, 0.01) || near(h, h1 - 0.03, 0.01)) ? "2" : "4"
    }
    return "3"
  })

  // ---------------------------------------------------------------- openings
  ISOKIT.opening("iw_window", {
    pad: [0.08, 0.12, 0.08, 0.06],
    pass: () => true,
    paint(s, h, o) {
      const { a, e, aw, ah, f } = o
      if (e < 0) return e >= -2 && a >= -3 && a < aw + 3 ? (e === -1 ? "5" : "4") : null    // the sill
      if (a < -1 || a > aw || e > ah) return null
      if (a < 0 || a >= aw || e >= ah || a === fl(aw / 2)) return "4"
      for (const [x, y0] of [[6, 5], [21, 17]]) if (a === x && e === ah - ((y0 + f * 3) % ah)) return "!h"   // rain running down
      // the block across the street: its windows, a few lit; a Lull screen on it, cyan
      if (a > aw * 0.55 && e > ah * 0.55 && e < ah * 0.8) return a > aw * 0.6 && a < aw * 0.92 && e > ah * 0.58 && e < ah * 0.77 ? "!v" : "!C"
      const col = fl(a / 4), row = fl(e / 5)
      if (a % 4 && e % 5 > 1 && ih(col + 9, row) < 0.25) return ih(row, col + 9) < 0.6 ? "!Q" : "!R"
      return e < ah * 0.25 ? "!2" : "!1"
    },
  })
  ISOKIT.opening("iw_door", {
    pad: [0.08, 0, 0.08, 0.08],
    pass: (s, h) => h < 0.025,
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a < 0 || a >= aw || e >= ah) {
        if (a < -2 || a > aw + 1 || e > ah + 1) return null
        if (a >= aw && e > ah * 0.42 && e < ah * 0.55) return (a + e) % 2 ? "P" : "O"     // the frame splintered at the lock
        return a === -2 || a === aw + 1 || e === ah + 1 ? "4" : "5"
      }
      if (e === 0) return "!Q"                                                          // the landing's light under it
      if (a === 0 || a === aw - 1 || e === ah - 1) return "a"
      if (a >= aw - 5 && a <= aw - 2 && e >= fl(ah * 0.45) && e <= fl(ah * 0.45) + 5) return (a + e) % 2 ? "O" : "1"   // the lock broken out
      return "A"
    },
  })
  ISOKIT.opening("iw_socket", {
    pad: [0, 0.22, 0, 0],
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a < 0 || a >= aw || e < 0 || e >= ah) {
        if (e < 0 && e > -6 && (a === 1 || a === aw - 2)) return "1"                     // two cables cut short, hanging
        return null
      }
      return a === 0 || e === 0 || a === aw - 1 || e === ah - 1 ? "4" : "h"
    },
  })

  // ---------------------------------------------------------------- props
  ISOKIT.prop("iw_fridge", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      const front = (a, e, o) => {
        if (e <= 1) return "3"
        if (e === fl(o.ah * 0.7)) return "4"                                              // the freezer compartment's gap
        if (a >= 3 && a <= 6 && e >= fl(o.ah * 0.48) && e <= fl(o.ah * 0.6)) return a === 4 && e === fl(o.ah * 0.6) ? "Q" : "W"   // the napkin under its magnet
        if (a === o.aw - 3 && ((e > o.ah * 0.3 && e < o.ah * 0.6) || (e > o.ah * 0.75 && e < o.ah * 0.9))) return "6"   // the handles
        return "H"
      }
      pen.box(u, v, 0, du, dv, H, () => "H", (a, e) => (e <= 1 ? "3" : "h"), front)
    },
  })
  ISOKIT.prop("iw_shelves", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      pen.box(u, v, 0, 0.03, dv, H, () => "A", () => "a", () => "A")
      pen.box(u + du - 0.03, v, 0, 0.03, dv, H, () => "A", () => "a", () => "A")
      for (let i = 0; i < 5; i++) pen.box(u + 0.03, v, 0.06 + i * 0.44, du - 0.06, dv, 0.03, () => "A", () => "a", () => "O")
      pen.box(u + du * 0.7, v + 0.08, 0.95, 0.08, 0.08, 0.1, () => "h", () => "G", () => "H")   // one cup left
    },
  })
  ISOKIT.prop("iw_counter", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      pen.box(u, v, 0, du, dv, H - 0.04, () => "4", () => "3", (a) => (a % 14 === 0 ? "2" : "4"))   // two cupboard doors
      pen.box(u, v, H - 0.04, du, dv, 0.04, () => "G", () => "g", () => "g")                  // the worktop, pale stone
      pen.box(u + 0.1, v + 0.08, H, 0.32, 0.28, 0.38, () => "H", () => "G", (a, e, o) => (e > o.ah * 0.5 && a > 2 && a < o.aw - 3 ? "1" : "H"))   // the espresso machine, chrome
      pen.box(u + 0.55, v + 0.2, H, 0.08, 0.08, 0.09, () => "h", () => "G", () => "H")       // a cup
    },
  })
  ISOKIT.prop("iw_bed", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      pen.box(u - 0.05, v - 0.05, 0, du + 0.1, dv + 0.1, 0.14, () => "A", () => "a", () => "A")   // the platform, oak
      pen.box(u, v, 0.14, du, dv, 0.18, (lu, lv) => (near(lv % 0.25, 0, 0.012) ? "h" : "G"), () => "g", () => "g")   // the mattress, bare
      pen.box(u + 0.05, v + dv + 0.08, 0, du * 0.35, 0.4, 0.12, (lu, lv) => (fl(lu * 9 + lv * 5) % 3 ? "H" : "h"), () => "h", () => "h")   // the bedding, pulled off onto the floor
    },
  })
  ISOKIT.prop("iw_armchair", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      pen.box(u, v, 0, du, dv, 0.08, () => "1", () => "1", () => "1")
      pen.box(u + 0.05, v + 0.05, 0.08, du - 0.1, dv - 0.1, 0.32, (lu) => (lu > du * 0.6 ? "P" : "O"), () => "O", () => "P")   // the seat, cognac leather, worn pale
      pen.box(u + du - 0.18, v + 0.05, 0.4, 0.13, dv - 0.1, 0.45, () => "P", () => "O", () => "P")   // the back
      for (const b of [0.05, dv - 0.17]) pen.box(u + 0.05, v + b, 0.4, du - 0.2, 0.12, 0.18, () => "P", () => "O", () => "O")   // the arms
    },
  })
  ISOKIT.prop("iw_arclamp", {
    footprint: () => [],
    outline: false,
    draw(pen, p) {
      const [u, v] = p.at
      pen.box(u, v, 0, 0.14, 0.14, 0.04, () => "1", () => "1", () => "1")                    // the marble foot
      pen.box(u + 0.06, v + 0.06, 0.04, 0.02, 0.02, 1.85, () => "G", () => "g", () => "G")    // the pole
      for (let t = 0; t <= 1; t += 0.04) {                                                  // the arc out over the armchair
        const q = [u + 0.07 - t * 0.5, v + 0.07 + t * 0.2, 1.9 + Math.sin(t * Math.PI) * 0.25 - t * 0.35], [x, y] = pen.P(...q)
        pen.at(q[0], q[1], q[2], null); pen.px(x, y, "G")
      }
      const [x, y] = pen.P(u - 0.43, v + 0.27, 1.5)
      pen.at(u - 0.43, v + 0.27, 1.5, null)
      pen.grid(x - 3, y - 1, ["..GG..", ".GHHG.", "gggggg"])                                // the shade, off
      pen.at(null)
    },
  })
  ISOKIT.prop("iw_officechair", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, cu = u + du / 2, cv = v + dv / 2
      for (let i = 0; i < 5; i++) { const t = i / 5 * Math.PI * 2; pen.box(cu + Math.cos(t) * 0.18 - 0.02, cv + Math.sin(t) * 0.18 - 0.02, 0, 0.04, 0.04, 0.06, () => "1", () => "1", () => "1") }
      pen.box(cu - 0.03, cv - 0.03, 0.06, 0.06, 0.06, 0.38, () => "4", () => "3", () => "4")   // the column
      pen.box(u + 0.03, v + 0.03, 0.44, du - 0.06, dv - 0.06, 0.08, () => "2", () => "1", () => "2")   // the seat, black mesh
      pen.box(u + du - 0.08, v + 0.05, 0.52, 0.05, dv - 0.1, 0.5, () => "2", () => "1", (a, e) => ((a + e) % 2 ? "2" : "1"))   // the back
    },
  })
  ISOKIT.prop("iw_plant", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      pen.box(u + 0.04, v + 0.04, 0, du - 0.08, dv - 0.08, 0.38, () => "1", () => "c", () => "C")   // a glazed pot
      const [x, y] = pen.P(u + du / 2, v + dv / 2, 0.38)
      pen.at(u + du / 2, v + dv / 2, 0.7, null)
      for (const [dx, dy] of [[0, 0], [-5, 4], [5, 3]]) pen.grid(x - 6 + dx, y - 12 + dy, [
        "....ĝ.......",
        "...ĝĜ..ĝ....",
        "..ĝ.Ĝ.ĝĜ....",
        ".ĝ..ĜĝĜ..O..",
        "ĝ...ĜĜ..O.O.",
        "....ĝĜ.O....",
        "...ĝ.ĜO.....",
        "..O..Ĝ......",
        ".O...ĝ......",
        "O....ĝ......",
        ".....ĝ......",
        ".....ĝ......",
      ])
      pen.at(null)
    },
  })
  // a railing along u or v (its foot's long side): posts every 40 cm, a top rail, a bar near the floor
  ISOKIT.prop("iw_railing", {
    footprint: () => [],
    solid: () => [],
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h, along = du > dv, L = along ? du : dv
      for (let t = 0; t <= L + 0.001; t += 0.4) pen.box(along ? u + Math.min(t, L - 0.04) : u, along ? v : v + Math.min(t, L - 0.04), 0, 0.04, 0.04, H, () => "5", () => "3", () => "4")
      pen.box(u, v, H - 0.05, along ? L : 0.05, along ? 0.05 : L, 0.05, () => "6", () => "4", () => "5")
      pen.box(u, v, 0.12, along ? L : 0.04, along ? 0.04 : L, 0.03, () => "4", () => "3", () => "3")
    },
  })
  // a folding chair on the balcony, its seat dark with the rain
  ISOKIT.prop("iw_deckchair", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      for (const [a, b] of [[0, 0], [du - 0.04, 0], [0, dv - 0.04], [du - 0.04, dv - 0.04]]) pen.box(u + a, v + b, 0, 0.03, 0.03, 0.42, () => "5", () => "4", () => "5")
      pen.box(u, v, 0.42, du, dv, 0.03, () => "w", () => "4", () => "4")
      pen.box(u, v, 0.45, 0.04, dv, 0.38, () => "w", () => "4", () => "x")
    },
  })
  // two pots of herbs against the railing, one gone to seed
  ISOKIT.prop("iw_herbs", {
    draw(pen, p) {
      const [u, v] = p.at
      for (const [du, k] of [[0, "Ĝ"], [0.27, "ĝ"]]) {
        pen.box(u + du, v, 0, 0.22, 0.22, 0.18, () => "1", () => "O", () => "P")
        pen.box(u + du + 0.03, v + 0.03, 0.18, 0.16, 0.16, 0.16, () => k, () => k, () => "ĝ")
      }
    },
  })
  ISOKIT.prop("iw_box", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      pen.box(u, v, 0, du, dv, H, (lu, lv) => (lu < 0.03 || lv < 0.03 || lu > du - 0.03 || lv > dv - 0.03 ? "P" : "1"), () => "O", () => "P")   // open, empty
      pen.box(u + du, v, 0, 0.02, dv, H * 0.7, () => "P", () => "O", () => "O")             // a flap fallen open
    },
  })

  return {}
})()

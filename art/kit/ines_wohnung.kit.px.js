// The kit pieces ines_wohnung needs (art/rooms/ines_wohnung.map.js): Ines' flat after the Quiet emptied it (kapitel2-design §3.3 W5–W7,
// §9.2). PAINTED (2026-11-18) on the lines of the blocks the user approved that day ("both mixed": a plain flat in the Ninth, and a few
// good things in it that say she had money); every piece keeps its size and place, the paint adds what has a cause. No lamp burns: the
// street's light comes in through the window, cold, and a little of the landing's under the door. Registered with ISOKIT
// (art/lib/isokit.js has the calls), drawn in room meters, lit by the bake; keys of the world palette (art/lib/iso.js) and the few
// below. A kit's names are global in a bake: keep this one's prefixed.
//
//   floor    m  laminate boards along the window's wall, each board its own shade; papers dropped where they emptied the shelves, their
//            lines of print; the rug (deep red, its border, its pattern); a pot's ring by the plant; the boots' wet way from the door
//            b  the balcony's grey tiles, wet: a drain in the corner, a puddle mirroring the sky's glow, moss in the joints by the wall
//   walls    iw_wall  pale plaster over a skirting, paler squares where her posters hung with the pins' holes, a picture hook left in
//            the wall, the light switch by the door, a hairline crack over the door, damp coming in at the balcony's corner
//   openings iw_window (the street: the block across with its windows, a Lull screen's cyan, rain; the curtain rail's empty hooks),
//            iw_door (the door to the landing, its veneer, its lock broken out), iw_socket (the socket by the clean square, the
//            computer's cables cut off short)
//   props    iw_fridge (old, white, yellowed, rust at its foot; the freezer on top; the napkin under a magnet on its door), iw_counter
//            (two cupboards, a worktop of pale stone, an espresso machine of chrome, a cup), iw_shelves (real wood, empty, the dust's
//            outlines of what stood there, one cup left), iw_bed (a low platform bed of oak, the mattress bare with its quilting, the
//            bedding pulled off onto the floor), iw_armchair (a wingback in cognac leather, creased, worn pale on the arms), iw_arclamp (a designer's
//            arc lamp over the armchair, off), iw_desk (her work table by the left wall, the user's
//            wish 2026-11-18: an oak top on steel legs, a pedestal of drawers pulled open; on the top the clean squares in the dust where
//            the computer and its screens stood), iw_officechair (an ergonomic chair before the desk, its mesh), iw_plant (a big
//            plant in a glazed pot, its leaves hanging, two fallen and yellow), iw_box (a cardboard box tipped over, its tape torn)
//            iw_railing, iw_deckchair (its wooden slats dark with rain), iw_herbs (two pots: one gone to seed, white flowers)
pal({ "ĝ": "#3e5a3a", "Ĝ": "#5f7d4a", "ŵ": "#8a8678" })

const KIT_INES_WOHNUNG = (() => {
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w, fl = Math.floor, ih = ISO.ihash
  Object.assign(ISOKIT.TINT.cold, { "ĝ": ["ĝ", "Ĝ"], "Ĝ": ["Ĝ", "Ĝ"] })

  // ---------------------------------------------------------------- floor and walls
  const PAPERS = [[1.6, 1.1, 0.4], [1.85, 1.35, 1.1], [1.3, 2.6, 0.2], [2.5, 2.3, 0.8], [0.9, 2.95, 1.4]]
  ISOKIT.floor("m", (u, v) => {
    for (const [pu, pv, r] of PAPERS) {                                                  // papers, A4, turned every way, their print
      const du = u - pu, dv = v - pv, a = Math.cos(r) * du + Math.sin(r) * dv, b = -Math.sin(r) * du + Math.cos(r) * dv
      if (Math.abs(a) < 0.1 && Math.abs(b) < 0.14) {
        if (Math.abs(a) > 0.085 || Math.abs(b) > 0.125) return "h"
        return Math.abs(a) < 0.065 && b > -0.1 && near((b + 1) % 0.04, 0, 0.007) ? "h" : "H"
      }
    }
    if (u > 2.6 && u < 4.4 && v > 1.85 && v < 3.35) {                                   // the rug: deep red, a border, a pattern of lozenges
      if (u < 2.68 || u > 4.32 || v < 1.93 || v > 3.27) return near(u, 2.64, 0.012) || near(u, 4.36, 0.012) || near(v, 1.89, 0.012) || near(v, 3.31, 0.012) ? "n" : "I"
      const lu = ((u - 2.68) * 6) % 1, lv = ((v - 1.93) * 6) % 1, d = Math.abs(lu - 0.5) + Math.abs(lv - 0.5)
      return d < 0.12 ? "I" : near(d, 0.32, 0.05) ? "n" : "i"
    }
    if (Math.hypot(u - 6.05, v - 0.62) < 0.25 && Math.hypot(u - 6.05, v - 0.62) > 0.21) return "f"   // the pot's ring, from years of watering
    // the boots' wet way from the door, drying out into the room
    for (let i = 0; i < 4; i++) if (Math.hypot(u - (0.55 + i * 0.32), (v - (3.85 - i * 0.18 + (i % 2) * 0.08)) * 1.6) < 0.05) return "e"
    if (near(v * 5, Math.round(v * 5), 1 / 16)) return "e"                               // the boards' long joints
    const row = fl(v * 5), off = row * 0.37
    if (near((u + off) % 1.2, 0, 1 / 40)) return "e"                                     // their ends
    // each board its own shade; the grain a long thin streak along it now and then
    const board = fl((u + off) / 1.2), tone = ih(board, row)
    if (near((v * 5) % 1, 0.3 + tone * 0.4, 0.03) && ih(fl(u * 6), row) < 0.4) return "f"
    return tone < 0.3 ? "Z" : "z"
  })
  // the balcony: grey tiles, wet, a drain in the corner, a puddle mirroring the sky's glow, moss in the joints by the wall
  ISOKIT.floor("b", (u, v) => {
    const dr = Math.hypot(u - 7.6, v - 2.1)
    if (dr < 0.06) return near(u, 7.6, 0.015) || near(v, 2.1, 0.015) ? "4" : "1"         // the drain's grate
    if (Math.hypot((u - 7.1) / 1.6, v - 1.0) < 0.22) return Math.hypot((u - 7.1) / 1.6, v - 1.0) < 0.12 ? "u" : "Z"   // the puddle, the sky's violet in it
    const joint = near(u * 3, Math.round(u * 3), 1 / 20) || near(v * 3, Math.round(v * 3), 1 / 20)
    if (joint) return u < 6.75 && ih(fl(u * 30), fl(v * 30)) < 0.6 ? "ĝ" : "e"            // moss by the house wall
    return ih(fl(u * 3), fl(v * 3)) < 0.25 ? "z" : "f"
  })
  ISOKIT.wall("iw_wall", (s, h, o) => {
    if (h < 0.08) return h >= 0.055 ? "4" : "1"
    const right = o.wall && o.wall.from[1] === o.wall.to[1]
    // the posters gone: paler squares, a pin hole in each corner
    for (const [s0, s1, h0, h1] of right ? [[0.95, 1.55, 1.35, 2.15], [1.65, 1.95, 1.55, 1.95]] : [[0.4, 1.0, 1.3, 2.0], [2.15, 2.6, 1.5, 2.1]]) {
      if (s >= s0 && s < s1 && h >= h0 && h < h1) return (near(s, s0 + 0.03, 0.01) || near(s, s1 - 0.03, 0.01)) && (near(h, h0 + 0.03, 0.01) || near(h, h1 - 0.03, 0.01)) ? "2" : "4"
    }
    if (right) {
      if (near(s, 4.2, 0.012) && near(h, 1.9, 0.02)) return "1"                         // a picture hook, its picture gone
      if (s > 6.1 && h > 1.6 && ih(fl(s * 24), fl(h * 24)) < (s - 6.1) * 1.2 * (h - 1.6)) return "2"   // damp at the balcony's corner
    } else {
      if (s > 4.38 && s < 4.48 && h > 1.0 && h < 1.14) return near(s, 4.43, 0.012) && near(h, 1.07, 0.03) ? "2" : "5"   // the light switch
      if (h > 2.05 && h < 2.5 && near(s, 3.85 + (h - 2.05) * 0.4 + 0.03 * Math.sin(h * 30), 1 / 60)) return "2"   // a hairline crack over the door
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
      if (e >= ah + 1) return e === ah + 1 && a >= -2 && a <= aw + 1 ? (a % 6 === 2 ? "6" : "4") : null   // the curtain rail, its empty hooks
      if (a < -1 || a > aw || e > ah) return null
      if (a < 0 || a >= aw || e >= ah || a === fl(aw / 2)) return a === fl(aw / 2) && e > 0 && e < ah - 1 ? "5" : "4"
      for (const [x, y0] of [[6, 5], [21, 17], [13, 9]]) if (a === x && e === ah - ((y0 + f * 3) % ah)) return "!h"   // rain running down
      if (e < 3 && (a * 5 + e) % 4 === 0) return "!2"                                   // condensation at the glass's foot
      // the block across the street: its windows, a few lit; a Lull screen on it, cyan
      if (a > aw * 0.55 && e > ah * 0.55 && e < ah * 0.8) return a > aw * 0.6 && a < aw * 0.92 && e > ah * 0.58 && e < ah * 0.77 ? (f % 6 === 0 && e === fl(ah * 0.66) ? "!V" : "!v") : "!C"
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
      const le = fl(ah * 0.45)
      if (a >= aw - 5 && a <= aw - 2 && e >= le && e <= le + 5) return (a + e) % 2 ? "O" : "1"   // the lock broken out
      if (a >= aw - 7 && a <= aw - 4 && e === le + 7) return "G"                         // the lever, hanging
      if (a === fl(aw / 2) && e === fl(ah * 0.78)) return "1"                            // the peephole
      if (e < 9) return e === 8 ? "5" : "4"                                              // the kick plate
      return Math.sin(a * 1.7 + Math.sin(e * 0.11 + a) * 1.4) > 0.82 ? "O" : "A"         // the veneer's grain
    },
  })
  ISOKIT.opening("iw_socket", {
    pad: [0, 0.22, 0, 0],
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a < 0 || a >= aw || e < 0 || e >= ah) {
        if (e < 0 && e > -6 && (a === 1 || a === aw - 2)) return e === -5 ? "6" : "1"   // two cables cut short, hanging, their copper
        return null
      }
      return a === 0 || e === 0 || a === aw - 1 || e === ah - 1 ? "4" : (a === 1 || a === aw - 2) && e === fl(ah / 2) ? "1" : "h"
    },
  })

  // ---------------------------------------------------------------- props
  ISOKIT.prop("iw_fridge", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      const front = (a, e, o) => {
        if (e <= 1) return "3"
        if (e < 5) return a % 2 ? "2" : "4"                                               // the vent's grille at its foot
        if (e === fl(o.ah * 0.7)) return "4"                                              // the freezer compartment's gap
        if (a >= 3 && a <= 6 && e >= fl(o.ah * 0.48) && e <= fl(o.ah * 0.6)) return a === 4 && e === fl(o.ah * 0.6) ? "Q" : (e - fl(o.ah * 0.48)) % 3 === 1 && a > 3 ? "h" : "W"   // the napkin, written on, under its magnet
        if (a === 8 && e === fl(o.ah * 0.66)) return "q"                                  // another magnet, nothing under it
        if (a === o.aw - 3 && ((e > o.ah * 0.3 && e < o.ah * 0.6) || (e > o.ah * 0.75 && e < o.ah * 0.9))) return "6"   // the handles
        if (e < 8 && ih(a, e) < 0.3) return "P"                                           // rust at its foot
        return a === 1 ? "W" : "H"                                                        // old white, yellowed; its edge catches the light
      }
      pen.box(u, v, 0, du, dv, H, () => "H", (a, e) => (e <= 1 ? "3" : e < 8 && ih(a + 40, e) < 0.25 ? "P" : "h"), front)
    },
  })
  ISOKIT.prop("iw_shelves", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      const grain = (a, e) => (Math.sin(e * 0.9 + a * 0.2) > 0.85 ? "O" : "A")
      pen.box(u, v, 0, du, 0.02, H, () => "A", () => "O", () => "O")                        // the back panel
      pen.box(u, v, 0, 0.03, dv, H, () => "A", grain, grain)
      // the boards: on each the dust's outline of what stood there
      for (let i = 0; i < 5; i++) pen.box(u + 0.03, v + 0.02, 0.06 + i * 0.44, du - 0.06, dv - 0.02, 0.03,
        (lu, lv) => (lv < dv - 0.04 && ((i % 2 === 0 && lu > 0.05 && lu < 0.4 && lv > 0.05) || (i === 3 && lu > 0.45 && lu < 0.55)) ? (near(lu, 0.05, 0.015) || near(lu, 0.4, 0.015) ? "a" : "O") : "A"),
        () => "a", () => "O")
      // what the Quiet left (they took the computers and the papers): a few books leaning, a stack lying flat, a box, a vase, one cup
      const SPINES = ["q", "C", "P", "G", "M", "4", "Q"]
      for (let b = 0; b < 5; b++) pen.box(u + 0.42 + b * 0.035, v + 0.06, 0.09, 0.03, 0.2, 0.26 - (b % 3) * 0.03, () => "h", () => "1", () => SPINES[b])   // books on the lowest board
      for (let b = 0; b < 3; b++) pen.box(u + 0.06, v + 0.06, 0.53 + b * 0.04, 0.3 - b * 0.03, 0.22, 0.04, () => SPINES[b + 3], () => "W", () => SPINES[b + 3])   // a stack lying flat
      pen.box(u + 0.38, v + 0.08, 0.97, 0.2, 0.18, 0.14, () => "G", () => "g", (a, e) => (e === 6 && a > 2 && a < 8 ? "h" : "G"))   // a box with a label
      pen.box(u + 0.1, v + 0.1, 1.41, 0.08, 0.08, 0.2, () => "1", () => "t", () => "T")      // a vase, empty
      pen.box(u + du * 0.7, v + 0.08, 0.95, 0.08, 0.08, 0.1, () => "h", () => "G", (a, e) => (e === 3 && a > 1 ? "q" : "H"))   // one cup left, a red band on it
      pen.box(u + du - 0.03, v, 0, 0.03, dv, H, () => "A", grain, grain)                    // the right side last, so it covers the boards' ends
    },
  })
  ISOKIT.prop("iw_counter", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      pen.box(u, v, 0, du, dv, H - 0.04, () => "4", () => "3", (a, e, o) => (a % 14 === 0 ? "2" : e < 3 ? "2" : (a % 14 === 11 && e > o.ah - 8 && e < o.ah - 4) ? "6" : "4"))   // two cupboard doors, their handles
      pen.box(u, v, H - 0.04, du, dv, 0.04, (lu, lv) => (ih(fl(lu * 40), fl(lv * 40)) < 0.15 ? "h" : "G"), () => "g", () => "g")   // the worktop, pale stone
      // the espresso machine, chrome: its body, the dark window of its gauges, the group head with the portafilter, the drip tray
      pen.box(u + 0.1, v + 0.08, H, 0.32, 0.28, 0.38, () => "H", (a, e) => (a === 1 ? "H" : "G"), (a, e, o) => {
        if (e > o.ah * 0.62 && a > 2 && a < o.aw - 3) return a === 4 && e === fl(o.ah * 0.75) ? "Q" : "1"
        if (e > o.ah * 0.3 && e < o.ah * 0.42 && a > 3 && a < o.aw - 4) return "4"
        if (e < 3) return "g"
        return a < 2 ? "W" : "H"
      })
      pen.box(u + 0.2, v + 0.36, H + 0.14, 0.12, 0.08, 0.03, () => "1", () => "1", () => "2")   // the portafilter's handle
      pen.box(u + 0.55, v + 0.2, H, 0.08, 0.08, 0.09, () => "1", () => "G", () => "H")       // a cup, cold coffee in it
    },
  })
  ISOKIT.prop("iw_bed", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      const oak = (a, e) => (Math.sin(a * 0.7 + e * 2.1) > 0.8 ? "O" : "A")
      pen.box(u - 0.05, v - 0.05, 0, du + 0.1, dv + 0.1, 0.14, () => "A", oak, oak)    // the platform, oak
      pen.box(u, v, 0.14, du, dv, 0.18,
        (lu, lv) => (near(lv % 0.25, 0, 0.012) || near(lu % 0.25, 0, 0.012) ? "h" : near(lu % 0.25, 0.125, 0.015) && near(lv % 0.25, 0.125, 0.015) ? "g" : "G"),   // the mattress, bare, its quilting and buttons
        (a, e) => (e === 0 || e % 4 === 2 ? "g" : "h"), (a, e) => (e === 0 || e % 4 === 2 ? "g" : "h"))
      // the bedding pulled off onto the floor: a duvet in a heap, its folds, a pillow
      pen.box(u + 0.05, v + dv + 0.08, 0, du * 0.35, 0.4, 0.12, (lu, lv) => (Math.sin(lu * 22 + lv * 9) > 0.6 ? "h" : "H"), (a, e) => (e > 2 && Math.sin(a * 0.9) > 0.5 ? "h" : "H"), () => "h")
      pen.box(u + 0.08 + du * 0.35, v + dv + 0.12, 0, 0.32, 0.22, 0.09, () => "H", () => "h", () => "h")   // the pillow
    },
  })
  ISOKIT.prop("iw_desk", {
    // her work table: drawn from its parts, back to front (the far legs, the pedestal, the top, the near legs)
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h, T = 0.035
      const oak = (a, e) => (Math.sin(a * 0.6 + e * 2.3) > 0.85 ? "O" : "A")
      const leg = (lu, lv) => pen.box(u + lu, v + lv, 0, 0.04, 0.04, H - T, () => "5", () => "4", () => "5")
      leg(0.03, 0.03); leg(du - 0.08, 0.03)
      // the pedestal at the near end, its three drawers, the top one pulled open and empty
      const pv = v + dv - 0.34
      pen.box(u + 0.04, pv, 0, du - 0.1, 0.3, H - T - 0.02, () => "3", (a, e, o) => (e % fl(o.ah / 3) === 0 ? "2" : a === fl(o.aw / 2) && e % fl(o.ah / 3) === fl(o.ah / 6) ? "6" : "3"),
        (a, e, o) => (e % fl(o.ah / 3) === 0 ? "2" : "3"))
      pen.box(u + 0.06, pv + 0.3, H - T - 0.2, du - 0.14, 0.16, 0.14, () => "1", () => "2", () => "3")   // the drawer pulled out, nothing in it
      // the top: oak, dust on it but where the computer and two screens stood, the cable's way to the back edge
      pen.box(u, v, H - T, du, dv, T, (lu, lv) => {
        const box = (u0, v0, u1, v1) => lu > u0 && lu < u1 && lv > v0 && lv < v1
        const edge = (u0, v0, u1, v1) => box(u0, v0, u1, v1) && !box(u0 + 0.02, v0 + 0.02, u1 - 0.02, v1 - 0.02)
        if (edge(0.06, 0.06, 0.3, 0.36) || edge(0.06, 0.4, 0.3, 0.7) || edge(0.36, 0.12, 0.5, 0.64)) return "O"   // the outlines in the dust
        if (box(0.06, 0.06, 0.3, 0.36) || box(0.06, 0.4, 0.3, 0.7) || box(0.36, 0.12, 0.5, 0.64)) return "A"      // two screens, the keyboard
        if (near(lv, 0.38, 0.012) && lu < 0.12) return "1"                                     // the cable's mark to the back
        return ih(fl(lu * 60), fl(lv * 60)) < 0.4 ? "A" : "ŵ"                                   // the dust, the oak through it
      }, oak, oak)
      leg(0.03, dv - 0.08); leg(du - 0.08, dv - 0.08)
    },
  })
  ISOKIT.prop("iw_armchair", {
    // a wingback armchair in cognac leather (the user's model, 2026-11-18): its back to the window, facing into the room; four dark legs,
    // the seat's cushion worn pale where she sat, the tall back with its wings standing forward at the top, rolled arms under them.
    // Drawn back to front: the far parts first, the near ones over them
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h, A = 0.13                             // A: an arm's (and a wing's) width
      const crease = (a, e) => (Math.sin(a * 1.3 + e * 0.8) > 0.9 ? "O" : null)
      for (const [lu, lv] of [[0.06, 0.06], [du - 0.1, 0.06], [0.06, dv - 0.1], [du - 0.1, dv - 0.1]]) pen.box(u + lu, v + lv, 0, 0.04, 0.04, 0.1, () => "1", () => "k", () => "1")
      // the back, tall, the light on its front, its buttons
      pen.box(u + 0.03, v + 0.03, 0.1, du - 0.06, 0.15, H - 0.1, (lu) => (lu < 0.05 || lu > du - 0.11 ? "R" : "Q"), (a, e) => crease(a, e) ?? "O",
        (a, e, o) => (e > o.ah * 0.45 && (a + e * 2) % 9 === 0 && a > 3 && a < o.aw - 3 ? "O" : crease(a, e) ?? "P"))
      // the far arm and wing (west), the seat, then the near arm and wing (east)
      const side = (lu) => {
        pen.box(u + lu, v + 0.12, 0.1, A, dv - 0.15, 0.48, (x, y) => (y > dv - 0.24 ? "R" : "Q"), (a, e) => crease(a, e) ?? "O", () => "P")   // the arm, rolled, its front worn pale
        pen.box(u + lu, v + 0.12, 0.58, A, 0.2, H - 0.68, () => "Q", (a, e) => crease(a, e) ?? "O", () => "P")                            // the wing over it
      }
      side(0.03)
      pen.box(u + 0.03 + A, v + 0.16, 0.1, du - 0.06 - 2 * A, dv - 0.19, 0.3,
        (lu, lv) => (Math.hypot(lu - (du - 0.06 - 2 * A) / 2, lv - (dv - 0.19) * 0.55) < 0.1 ? "R" : near(lv, dv - 0.2, 0.025) ? "P" : "Q"),   // the cushion, worn where she sat
        (a, e) => crease(a, e) ?? "O", (a, e) => (e === 3 ? "O" : "P"))
      side(du - 0.03 - A)
    },
  })
  ISOKIT.prop("iw_arclamp", {
    footprint: () => [],
    outline: false,
    draw(pen, p) {
      const [u, v] = p.at
      pen.box(u, v, 0, 0.14, 0.14, 0.04, () => "H", () => "h", () => "G")                    // the marble foot, white with its veins
      pen.box(u + 0.06, v + 0.06, 0.04, 0.02, 0.02, 1.85, () => "G", () => "g", () => "G")    // the pole, brushed steel
      for (let t = 0; t <= 1; t += 0.04) {                                                  // the arc out over the armchair
        const q = [u + 0.07 - t * 0.5, v + 0.07 + t * 0.2, 1.9 + Math.sin(t * Math.PI) * 0.25 - t * 0.35], [x, y] = pen.P(...q)
        pen.at(q[0], q[1], q[2], null); pen.px(x, y, "G")
      }
      const [x, y] = pen.P(u - 0.43, v + 0.27, 1.5)
      pen.at(u - 0.43, v + 0.27, 1.5, null)
      pen.grid(x - 3, y - 1, ["..GG..", ".GHHG.", "gg12gg"])                                // the shade, off, its bulb dark
      pen.at(null)
    },
  })
  ISOKIT.prop("iw_officechair", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, cu = u + du / 2, cv = v + dv / 2
      for (let i = 0; i < 5; i++) { const t = i / 5 * Math.PI * 2; pen.box(cu + Math.cos(t) * 0.18 - 0.02, cv + Math.sin(t) * 0.18 - 0.02, 0, 0.04, 0.04, 0.06, () => "1", () => "1", () => "1") }
      pen.box(cu - 0.03, cv - 0.03, 0.06, 0.06, 0.06, 0.38, () => "5", () => "3", () => "4")   // the column
      pen.box(u + 0.03, v + 0.03, 0.44, du - 0.06, dv - 0.06, 0.08, () => "2", () => "1", () => "2")   // the seat, black
      pen.box(u + du - 0.08, v + 0.05, 0.52, 0.05, dv - 0.1, 0.5, () => "2", () => "1", (a, e, o) => (e === o.ah - 1 || a === 0 || a === o.aw - 1 ? "3" : (a + e) % 2 ? "2" : "1"))   // the back, mesh in its frame
    },
  })
  ISOKIT.prop("iw_plant", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      pen.box(u + 0.04, v + 0.04, 0, du - 0.08, dv - 0.08, 0.38, (lu, lv) => (Math.hypot(lu - (du - 0.08) / 2, lv - (dv - 0.08) / 2) < 0.1 ? "1" : "c"), (a, e) => (e === 0 ? "1" : a % 5 === 1 ? "T" : "c"), (a, e) => (e === 0 ? "1" : "C"))   // a glazed pot, dry earth in it
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
      // two leaves fallen beside the pot, yellow at their edges
      const [fx, fy] = pen.P(u + du + 0.05, v + 0.15, 0)
      pen.at(u + du + 0.05, v + 0.15, 0, null); pen.grid(fx, fy - 1, ["jy.", ".yj"]); pen.grid(fx - 9, fy + 3, [".jy", "yj."])
      pen.at(null)
    },
  })
  // a railing along u or v (its foot's long side): posts every 40 cm, a top rail, a bar near the floor; wet, a drop on the rail now and then
  ISOKIT.prop("iw_railing", {
    footprint: () => [],
    solid: () => [],
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h, along = du > dv, L = along ? du : dv
      for (let t = 0; t <= L + 0.001; t += 0.4) pen.box(along ? u + Math.min(t, L - 0.04) : u, along ? v : v + Math.min(t, L - 0.04), 0, 0.04, 0.04, H, () => "5", () => "3", () => "4")
      pen.box(u, v, H - 0.05, along ? L : 0.05, along ? 0.05 : L, 0.05, (lu, lv) => (ih(fl((lu + lv) * 20), 7) < 0.12 ? "H" : "6"), () => "4", () => "5")
      pen.box(u, v, 0.12, along ? L : 0.04, along ? 0.04 : L, 0.03, () => "4", () => "3", () => "3")
    },
  })
  // a folding chair on the balcony, its wooden slats dark with the rain
  ISOKIT.prop("iw_deckchair", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      for (const [a, b] of [[0, 0], [du - 0.04, 0], [0, dv - 0.04], [du - 0.04, dv - 0.04]]) pen.box(u + a, v + b, 0, 0.03, 0.03, 0.42, () => "5", () => "4", () => "5")
      pen.box(u, v, 0.42, du, dv, 0.03, (lu) => (near(lu % 0.1, 0, 0.012) ? "1" : "a"), () => "4", () => "4")
      pen.box(u, v, 0.45, 0.04, dv, 0.38, () => "a", () => "4", (a, e) => (e % 3 === 0 ? "1" : "a"))
    },
  })
  // two pots of herbs against the railing: the basil gone to seed, white flowers on it; the other one still green
  ISOKIT.prop("iw_herbs", {
    draw(pen, p) {
      const [u, v] = p.at
      for (const [du, k, seed] of [[0, "Ĝ", true], [0.27, "ĝ", false]]) {
        pen.box(u + du, v, 0, 0.22, 0.22, 0.18, () => "1", (a, e) => (e === 0 ? "1" : "O"), (a, e, o) => (e === o.ah - 1 ? "Q" : "P"))
        pen.box(u + du + 0.03, v + 0.03, 0.18, 0.16, 0.16, 0.16, (lu, lv) => (seed && ih(fl(lu * 40), fl(lv * 40)) < 0.2 ? "H" : k), (a, e) => (seed && e > 3 && (a + e) % 4 === 0 ? "H" : k), () => "ĝ")
      }
    },
  })
  ISOKIT.prop("iw_box", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      pen.box(u, v, 0, du, dv, H, (lu, lv) => (lu < 0.03 || lv < 0.03 || lu > du - 0.03 || lv > dv - 0.03 ? "P" : "1"), (a, e) => (e === 0 ? "O" : "O"),
        (a, e, o) => (near(e, o.ah - 3, 1) && a > 3 && a < o.aw * 0.6 ? "h" : e > o.ah * 0.3 && e < o.ah * 0.5 && a > o.aw * 0.55 && a < o.aw * 0.8 ? "1" : "P"))   // open, empty; its tape torn, a printed arrow
      pen.box(u + du, v, 0, 0.02, dv, H * 0.7, () => "P", () => "O", () => "O")             // a flap fallen open
    },
  })

  return {}
})()

// The kit pieces klinik needs (art/rooms/klinik.map.js), made by tools/new-room.mjs. BLOCKS for the user's approval (kapitel2-design
// §3.2, §9.2): plain shapes in the clinic's cold white and Lull's pale cyan, to be painted on their lines once approved. Registered with
// ISOKIT (art/lib/isokit.js has the calls), drawn in room meters, lit by the bake; keys of the world palette (art/lib/iso.js). A kit's
// names are global in a bake: keep this one's prefixed.
//
//   floor    p  pale vinyl tiles, 50 cm, a joint between them
//   walls    klinik_wall  white wipe-clean panels to 1.2 m, pale paint above, a steel skirting
//   openings kl_ring (Nagi·wa's ring), kl_screen (SLEEP BETTER), kl_cabin (the cabin's opening), kl_door (the glass door to the street),
//            kl_walllamp (the tube on the wall behind the reception)
//   props    kl_reception (the counter with its glass), kl_seats (a row of four joined seats, their backs to the wall), kl_scanner (the
//            scanner chair under its hood), kl_tube (a tube hanging over the room)
// Keys "!k" are never lit.

const KIT_KLINIK = (() => {
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w

  ISOKIT.floor("p", (u, v) => (near(u, Math.round(u * 2) / 2) || near(v, Math.round(v * 2) / 2) ? "5" : "6"))
  ISOKIT.wall("klinik_wall", (s, h) => (h < 0.08 ? (h >= 0.055 ? "4" : "2") : h < 1.2 ? (near(h, 1.18, 0.02) ? "G" : near(s, Math.round(s), 0.012) ? "6" : "G") : "6"))

  // Nagi·wa's ring: a pale ring on the wall, lit from inside
  ISOKIT.opening("kl_ring", {
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a < 0 || a >= aw || e < 0 || e >= ah) return null
      const d = Math.hypot(a + 0.5 - aw / 2, (e + 0.5 - ah / 2) * 1.0) / (Math.min(aw, ah) / 2)
      return d > 0.62 && d < 0.95 ? "!V" : d < 0.62 ? null : null
    },
  })
  // SLEEP BETTER on a flat screen: Lull's pale cyan, the words set later in the font (a block: two bars)
  ISOKIT.opening("kl_screen", {
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a < 0 || a >= aw || e < 0 || e >= ah) return null
      if (a === 0 || a === aw - 1 || e === 0 || e === ah - 1) return "2"
      if ((e === ah - 5 || e === ah - 6) && a > 3 && a < aw - 4) return "!V"
      if ((e === ah - 9 || e === ah - 10) && a > 6 && a < aw - 7) return "!V"
      if (e < 5 && a > aw / 2 - 4 && a < aw / 2 + 4 && Math.hypot(a - aw / 2, e - 2) < 4) return "!v"
      return "!c"
    },
  })
  // the cabin inside: darker panels, so the doorway reads as a room of its own
  ISOKIT.wall("kl_cabin_wall", (s, h) => (h < 0.08 ? "2" : h < 1.2 ? "4" : "5"))
  // the cabin: an open doorway with a steel frame; the scanner chair stands inside
  ISOKIT.opening("kl_cabin", {
    pad: [0.08, 0, 0.08, 0.08],
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a >= 0 && a < aw && e < ah) return null
      return a === -1 || a === aw || e === ah ? "4" : "5"
    },
  })
  // the glass door to the street: a steel frame, the street's dark through the glass, a bar across
  ISOKIT.opening("kl_door", {
    pad: [0.06, 0, 0.06, 0.06],
    pass: (s, h) => true,
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a < 0 || a >= aw || e >= ah) return a === -1 || a === aw || e === ah ? "4" : "5"
      if (a === Math.floor(aw / 2)) return "4"
      if (e === Math.floor(ah * 0.45)) return "5"
      return (a + e) % 11 === 0 ? "!w" : "!1"
    },
  })

  // the wall lamp behind the reception: a tube in a white housing along the wall over the nurse
  ISOKIT.opening("kl_walllamp", {
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a < 0 || a >= aw || e < 0 || e >= ah) return null
      if (e === ah - 1 || a === 0 || a === aw - 1) return "H"
      return e === 0 ? "!H" : "!V"
    },
  })
  // a tube hanging over the room on two wires, in its steel tray (one of the laundromat's, cold)
  ISOKIT.prop("kl_tube", {
    outline: false, footprint: () => [], solid: () => [],
    draw(pen, p) {
      const [u0, v0] = p.at, [du] = p.foot
      const [x0, y0] = pen.P(u0, v0, p.h), [x1, y1] = pen.P(u0 + du, v0, p.h)
      pen.at(u0, v0, p.h + 0.1, null)
      pen.vline(x0 + 3, y0 - 30, 28, "k"); pen.vline(x1 - 3, y1 - 30, 28, "k")
      pen.line(x0, y0 - 2, x1, y1 - 2, "2"); pen.line(x0, y0 - 1, x1, y1 - 1, "4")
      for (let x = 0; x <= x1 - x0; x++) { pen.px(x0 + x, y0 + Math.floor(x / 2), "!V"); pen.px(x0 + x, y0 + 1 + Math.floor(x / 2), "!H") }
      pen.at(null)
    },
  })
  // the reception: a counter along the left wall, the glass on it up to 1.9 m (only its frame and a few glints, so she shows through),
  // the slot at its foot
  ISOKIT.prop("kl_reception", {
    solid: (p) => [[p.at[0], p.at[1], 0, p.foot[0], p.foot[1], 0.8]],
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, D = 0.8
      pen.box(u, v, 0, du, dv, D - 0.04, () => "G", (a, e, o) => (e === o.ah - 1 ? "h" : "4"), (a, e, o) => (e === o.ah - 1 ? "h" : "5"))
      pen.box(u - 0.03, v - 0.03, D - 0.04, du + 0.06, dv + 0.06, 0.04, () => "H", () => "6", () => "6")
      const gu = u + du * 0.55, top = p.h
      pen.box(gu, v, D, 0.03, dv, top - D, () => "H", (a, e, o) => {
        if (a <= 0 || a >= o.aw - 1 || e >= o.ah - 1) return "h"
        if (e < 2 && a > o.aw * 0.4 && a < o.aw * 0.6) return "2"
        // two glints slanting across the pane, and a faint sheen along its top: glass, not a rail
        const t = a - Math.round(e * 0.6)
        if (e > o.ah * 0.45 && (t === Math.round(o.aw * 0.18) || t === Math.round(o.aw * 0.18) + 1 || t === Math.round(o.aw * 0.26))) return "!V"
        if (e > o.ah * 0.3 && t === Math.round(o.aw * 0.62)) return "!V"
        if (e >= o.ah - 3 && (a + e) % 2 === 0) return "!H"
        return null
      }, () => "h")
    },
  })
  // four seats joined on one steel beam, their backs to the wall, so people sit facing the room
  ISOKIT.prop("kl_seats", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, n = 4, w = du / n
      pen.box(u + 0.05, v + 0.1, 0, du - 0.1, 0.06, 0.38, () => "3", () => "2", () => "3")
      for (let i = 0; i < n; i++) {
        const su = u + i * w + 0.03
        pen.box(su, v + 0.05, 0.38, w - 0.06, dv - 0.05, 0.06, () => "x", () => "w", () => "w")
        pen.box(su, v, 0.44, w - 0.06, 0.07, p.h - 0.44, () => "x", () => "w", () => "x")
      }
    },
  })
  // the scanner chair: a reclined white seat, the hood over the head end, a pale cyan ring in it
  ISOKIT.prop("kl_scanner", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      pen.box(u + du * 0.3, v + dv * 0.3, 0, du * 0.4, dv * 0.4, 0.4, () => "4", () => "3", () => "4")
      pen.box(u, v, 0.4, du, dv, 0.15, () => "H", () => "G", () => "G")
      pen.box(u, v, 0.55, du, 0.15, 0.4, () => "H", () => "G", () => "G")
      pen.box(u + 0.05, v - 0.05, 0.95, du - 0.1, 0.35, 0.3, () => "G", (a, e, o) => (e > 2 && e < o.ah - 3 && a > 2 && a < o.aw - 3 ? "!v" : "h"), () => "h")
    },
  })

  return {}
})()

// The kit pieces klinik needs (art/rooms/klinik.map.js), made by tools/new-room.mjs, painted on the lines of the blocks the user approved
// (2026-11-17, kapitel2-design §3.2, §9.2): Lull-Klinik 9-Ost at night, Nagi·wa's clean, cold white, Lull's pale cyan as the one colour,
// and the wet street only in the glass door and the footprints on the floor. Registered with ISOKIT (art/lib/isokit.js has the calls),
// drawn in room meters, lit by the bake; keys of the world palette (art/lib/iso.js). A kit's names are global in a bake: keep this one's
// prefixed.
//
//   floor    p  pale vinyl tiles, 50 cm, a joint between them; the mat inside the door, wet footprints from it to the reception
//   walls    klinik_wall  white wipe-clean panels to 1.2 m with Lull's pale cyan line along their top, pale paint above, a steel skirting;
//            kl_cabin_wall the cabin's darker panels
//   openings kl_ring (Nagi·wa's ring, lit), kl_screen (the Lull ad: SLEEP BETTER, LULL IS FREE, the patch), kl_cabin (the cabin's
//            doorway, its curtain half drawn), kl_door (the glass door to the street, 24H on it, Pho Pump's light across the lane in
//            its glass), kl_walllamp (the tube on the wall behind the reception)
//   props    kl_reception (the counter: Nagi·wa's ring on its front, the glass with its slot, her monitor and forms behind it, the Lull
//            leaflets before it), kl_seats (four joined seats on one steel beam, their backs to the wall), kl_scanner (the scanner chair
//            with its paper sheet under the hood and its ring), kl_tube (a tube hanging over the room)
// Keys "!k" are never lit.
include("../lib/text.js")

const KIT_KLINIK = (() => {
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w, fl = Math.floor, ih = ISO.ihash
  /** a raster's key, drawn unlit (a screen, a lamp, what is seen through glass) */
  const lit = (k) => (k ? "!" + k : null)

  // ---------------------------------------------------------------- the floor
  // wet footprints from the door to the reception, left foot and right foot, fading as the rain dries off them
  const STEPS = []
  for (let i = 0; i < 8; i++) {
    const t = i / 7, u = 0.55 + t * 1.0, v = 3.35 - t * 1.85, side = i % 2 ? 0.07 : -0.07
    STEPS.push([u + side * 0.7, v + side * 0.7, i])
  }
  ISOKIT.floor("p", (u, v) => {
    // the mat inside the door: dark, its edge, wet in the middle
    if (u < 0.85 && v > 3.0 && v < 3.9) return u > 0.8 || v < 3.05 || v > 3.85 ? "4" : ih(fl(u * 20), fl(v * 20)) < 0.3 ? "2" : "3"
    for (const [su, sv, i] of STEPS) if (Math.hypot((u - su) * 1.6, v - sv) < 0.06 && i < 6) return i < 3 ? "4" : "5"
    return near(u, Math.round(u * 2) / 2) || near(v, Math.round(v * 2) / 2) ? "5" : "6"
  })
  // ---------------------------------------------------------------- the walls
  ISOKIT.wall("klinik_wall", (s, h) => {
    if (h < 0.08) return h >= 0.055 ? "4" : "2"                                  // the steel skirting
    if (h < 1.2) return near(h, 1.18, 0.012) ? "C" : near(s, Math.round(s), 0.012) ? "6" : "G"   // the panels, Lull's line on top
    return "6"
  })
  ISOKIT.wall("kl_cabin_wall", (s, h) => (h < 0.08 ? "2" : h < 1.2 ? (near(h, 1.18, 0.012) ? "C" : "4") : "5"))

  // ---------------------------------------------------------------- what is on the walls
  // Nagi·wa's ring: a band of light, brighter on its upper rim, its own halo on the wall round it
  ISOKIT.opening("kl_ring", {
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a < 0 || a >= aw || e < 0 || e >= ah) return null
      const dx = a + 0.5 - aw / 2, dy = e + 0.5 - ah / 2, d = Math.hypot(dx, dy) / (Math.min(aw, ah) / 2)
      if (d > 0.64 && d < 0.94) return dy > 0 && d < 0.86 ? "!V" : "!v"
      if ((d >= 0.94 && d < 1.05) || (d > 0.52 && d <= 0.64)) return (a + e) % 2 ? "!C" : null
      return null
    },
  })
  // the Lull ad on a flat screen: the patch (the oval pale disc, its rim, its stripe) and SLEEP BETTER, LULL IS FREE under it
  // (its lines are set for a screen 0.95 m tall: lower, LULL IS FREE runs into BETTER)
  ISOKIT.opening("kl_screen", {
    paint(s, h, o) {
      o.memo.screen ??= ISOKIT.raster(o.aw, o.ah, (c) => {
        const W = o.aw, H = o.ah
        c.rect(0, 0, W, H, "c"); for (let y = 0; y < H; y++) if (y % 3 === 0) c.hline(1, y, W - 2, "t")   // its glow, a little uneven
        c.rect(0, 0, W, 1, "2"); c.rect(0, H - 1, W, 1, "2"); c.vline(0, 0, H, "2"); c.vline(W - 1, 0, H, "2")
        c.ellipse(8, 10, 4, 6, "C"); c.ellipse(8, 10, 3, 5, "V"); c.vline(7, 6, 9, "W"); c.vline(8, 7, 2, "v")   // the patch
        TXT.draw(c, 16, 3, "SLEEP", "V", { font: "nagiwa" })
        TXT.draw(c, 16, 12, "BETTER", "V", { font: "nagiwa" })
        TXT.draw(c, fl(W / 2), H - 7, "LULL IS FREE", "v", { font: "hud", align: "center" })
      }, 0, 0)
      return lit(o.memo.screen(o.a, o.e))
    },
  })
  // the cabin's doorway: a steel frame, a pale curtain half drawn on its rail over the left of it
  ISOKIT.opening("kl_cabin", {
    pad: [0.08, 0, 0.08, 0.08],
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a >= 0 && a < aw && e < ah) {
        if (e >= ah - 2) return "4"                                              // the rail
        if (a < aw * 0.32 + (e < 6 ? (6 - e) * 0.5 : 0)) return a % 3 === 0 ? "h" : a % 3 === 1 ? "H" : "G"   // the curtain's folds
        return null
      }
      return a === -1 || a === aw || e === ah ? "4" : "5"
    },
  })
  // the glass door: its steel frame, the leaves' split and push bars, 24H in cyan on the glass; through it the wet lane at night and
  // Pho Pump's warm light across it in a smear on the left leaf, a neon's magenta on the right
  ISOKIT.opening("kl_door", {
    pad: [0.06, 0, 0.06, 0.06],
    pass: (s, h) => true,
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a < 0 || a >= aw || e >= ah) return a === -1 || a === aw || e === ah ? "4" : "5"
      o.memo.door ??= ISOKIT.raster(aw, ah, (c) => {
        const W = aw, H = ah, mid = fl(W / 2), bar = fl(H * 0.5)
        c.rect(0, 0, W, H, "1")
        c.rect(0, H - 6, W, 6, "e"); for (let x = 0; x < W; x += 3) c.px(x + (x % 2), H - 3, "f")    // the wet lane beyond, a puddle's glint
        c.rect(2, fl(H * 0.42), 4, 5, "O"); c.rect(3, fl(H * 0.43), 2, 3, "P"); c.px(3, fl(H * 0.42) + 1, "Q")   // Pho Pump's light
        c.vline(W - 4, fl(H * 0.3), 6, "M"); c.vline(W - 3, fl(H * 0.32), 4, "n")                           // a neon across the lane
        for (let i = 0; i < 4; i++) c.px(1 + i * 2, 4 + i, "w")                                            // the rain's streaks on the glass
        TXT.draw(c, fl(mid / 2) + 1, 3, "24H", "v", { font: "hud", align: "center" })
        c.vline(mid, 0, H, "4"); c.vline(mid - 1, 0, H, "5")
        c.hline(2, bar, mid - 4, "G"); c.hline(mid + 2, bar, W - mid - 4, "G")                           // the push bars
      }, 0, 0)
      const k = o.memo.door(a, e)
      return k === "4" || k === "5" || k === "G" ? k : lit(k)
    },
  })
  // the wall lamp behind the reception: a tube in a white housing, its light spilling down from under it
  ISOKIT.opening("kl_walllamp", {
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a < 0 || a >= aw || e < 0 || e >= ah) return null
      if (a === 0 || a === aw - 1) return "h"
      if (e === ah - 1) return "H"
      return e === 0 ? "!H" : "!V"
    },
  })

  // ---------------------------------------------------------------- what stands in the room
  // a tube under the ceiling on two short holders, in its steel tray
  ISOKIT.prop("kl_tube", {
    outline: false, footprint: () => [], solid: () => [],
    draw(pen, p) {
      const [u0, v0] = p.at, [du] = p.foot
      const [x0, y0] = pen.P(u0, v0, p.h), [x1, y1] = pen.P(u0 + du, v0, p.h)
      pen.at(u0, v0, p.h + 0.1, null)
      pen.vline(x0 + 3, y0 - 5, 3, "k"); pen.vline(x1 - 3, y1 - 5, 3, "k")
      pen.line(x0, y0 - 2, x1, y1 - 2, "2"); pen.line(x0, y0 - 1, x1, y1 - 1, "4")
      for (let x = 0; x <= x1 - x0; x++) { pen.px(x0 + x, y0 + fl(x / 2), "!V"); pen.px(x0 + x, y0 + 1 + fl(x / 2), x < 2 || x > x1 - x0 - 2 ? "!h" : "!H") }
      pen.at(null)
    },
  })
  // the reception: a counter along the left wall, wipe-clean white with Nagi·wa's ring on its front and a steel kick plate; the glass on
  // it (its frame, its slot, a few glints, so she shows through); behind the glass her monitor, its back to us, and a stack of forms;
  // before it on the counter a stand of Lull leaflets with the patch on them
  ISOKIT.prop("kl_reception", {
    solid: (p) => [[p.at[0], p.at[1], 0, p.foot[0], p.foot[1], 0.8]],
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, D = 0.8
      const front = (a, e, o) => {
        if (e < 3) return e === 2 ? "5" : "4"                                    // the kick plate
        if (e === o.ah - 1) return "h"
        const cx = o.aw / 2, cy = o.ah * 0.58, d = Math.hypot(a + 0.5 - cx, (e + 0.5 - cy) * 1.3)
        if (d > 2.6 && d < 4.2) return "!v"                                      // Nagi·wa's ring
        return a % 14 === 0 ? "6" : "G"
      }
      pen.box(u, v, 0, du, dv, D - 0.04, () => "G", front, (a, e, o) => (e < 3 ? "4" : e === o.ah - 1 ? "h" : "6"))
      pen.box(u - 0.03, v - 0.03, D - 0.04, du + 0.06, dv + 0.06, 0.04, (lu) => (lu > du * 0.55 + 0.03 ? "H" : "G"), () => "h", () => "h")
      // behind the glass: her monitor (its back), a stack of forms
      pen.box(u + 0.04, v + 0.75, D, 0.16, 0.42, 0.04, () => "4", () => "3", () => "3")
      pen.box(u + 0.08, v + 0.82, D + 0.04, 0.06, 0.3, 0.3, () => "3", (a, e, o) => (e === o.ah - 1 || a === o.aw - 1 ? "!c" : "2"), () => "3")
      pen.box(u + 0.08, v + 1.55, D, 0.2, 0.3, 0.05, (lu, lv) => ((lu * 40 + lv * 10) % 3 < 1 ? "G" : "H"), () => "h", () => "h")
      // the glass
      const gu = u + du * 0.55, top = p.h
      pen.box(gu, v, D, 0.03, dv, top - D, () => "H", (a, e, o) => {
        if (a <= 0 || a >= o.aw - 1 || e >= o.ah - 1) return "h"
        if (e < 2 && a > o.aw * 0.4 && a < o.aw * 0.6) return "2"               // the slot
        // two short glints high on the pane, the lamp's reflection, and a faint sheen along its top: glass, not a rail
        const t = a - Math.round(e * 0.6)
        if (e > o.ah * 0.62 && e < o.ah * 0.86 && (t === Math.round(o.aw * 0.12) || t === Math.round(o.aw * 0.15))) return "!V"
        if (e > o.ah * 0.55 && e < o.ah * 0.72 && t === Math.round(o.aw * 0.6)) return "!H"
        if (e >= o.ah - 3 && (a + e) % 2 === 0) return "!H"
        return null
      }, () => "h")
      // the leaflet stand before the glass: a wire rack, the leaflets white with the patch's pale disc
      pen.box(gu + 0.06, v + 0.2, D, 0.1, 0.3, 0.16, () => "W", (a, e) => (e > 1 && a % 4 === 1 ? "v" : "H"), () => "4")
    },
  })
  // four seats joined on one steel beam, their backs to the wall, so people sit facing the room: pale blue-grey plastic, the backs' top
  // edges lit, the beam on two pairs of legs
  ISOKIT.prop("kl_seats", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, n = 4, w = du / n
      for (const lu of [0.12, du - 0.18]) pen.box(u + lu, v + 0.12, 0, 0.06, dv - 0.2, 0.36, () => "4", () => "3", () => "4")
      pen.box(u + 0.05, v + 0.1, 0.32, du - 0.1, 0.06, 0.06, () => "4", () => "2", () => "3")
      for (let i = 0; i < n; i++) {
        const su = u + i * w + 0.03
        pen.box(su, v + 0.05, 0.38, w - 0.06, dv - 0.05, 0.06, (lu, lv) => (lv > dv - 0.16 ? "x" : "G"), () => "w", (a, e, o) => (e === o.ah - 1 ? "x" : "w"))
        pen.box(su, v, 0.44, w - 0.06, 0.07, p.h - 0.44, () => "G", () => "w", (a, e, o) => (e >= o.ah - 2 ? "G" : e < 3 ? "w" : "x"))
      }
    },
  })
  // the scanner chair: the pedestal, the reclined white seat with a strip of paper sheet down it, the hood over the head end and the
  // ring of light in it, its cable up the wall
  ISOKIT.prop("kl_scanner", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      pen.box(u + du * 0.3, v + dv * 0.3, 0, du * 0.4, dv * 0.4, 0.4, () => "4", () => "3", () => "4")
      pen.box(u, v, 0.4, du, dv, 0.15, (lu) => (Math.abs(lu - du / 2) < 0.16 ? "W" : "H"), () => "G", () => "G")
      pen.box(u, v, 0.55, du, 0.15, 0.4, (lu) => (Math.abs(lu - du / 2) < 0.16 ? "W" : "H"), () => "G", () => "G")
      pen.box(u + 0.05, v - 0.05, 0.95, du - 0.1, 0.35, 0.3, () => "G", (a, e, o) => {
        const cx = o.aw / 2, cy = o.ah / 2, d = Math.hypot(a + 0.5 - cx, (e + 0.5 - cy) * 1.4)
        if (d < 3) return "!V"
        if (d < 5) return "!v"
        return e === o.ah - 1 ? "H" : "h"
      }, () => "h")
      const [cx, cy] = pen.P(u + du / 2, v - 0.05, 1.25)
      pen.at(u + du / 2, v - 0.1, 1.3, null); pen.line(cx, cy, cx + 2, cy - 12, "2"); pen.at(null)   // its cable
    },
  })

  return {}
})()

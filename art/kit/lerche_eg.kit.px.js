// The kit pieces lerche_eg needs (art/rooms/lerche_eg.map.js), made by tools/new-room.mjs. BLOCKS for the user's approval (2026-11-18):
// the Wohnblock Lerche's hall on the ground floor, the same house as the landing upstairs (its floor, walls and lift come from
// art/kit/lerche_flur.kit.px.js; the flight up, the notice board and the flyers from the Kessel's lobby kit: what is alike is reused). Registered with ISOKIT (art/lib/isokit.js has the calls), drawn
// in room meters, lit by the bake; keys of the world palette (art/lib/iso.js). A kit's names are global in a bake: keep this one's prefixed.
//
//   floor    x  the hall's old terrazzo, wet footprints from the street door in the south-east corner toward the stairs
//   openings le_door (a street door of wood and wired glass; not used while the door is a gap in the near wall), le_mailboxes (twelve, one with its name taped over)
//   props    le_pram (a pram parked by the stairs: 4C's child), le_bike (a bicycle chained to a pipe)

const KIT_LERCHE_EG = (() => {
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w, fl = Math.floor, ih = ISO.ihash

  ISOKIT.floor("x", (u, v) => {
    // wet footprints from the street door (in the south-east corner, u 7.3 to 8.2) toward the stairs
    for (let i = 0; i < 9; i++) {
      const t = i / 8, fu = 7.6 - t * 3.4, fv = 2.6 - t * 0.5 + (i % 2 ? 0.07 : -0.07)
      if (Math.hypot(u - fu, (v - fv) * 1.6) < 0.06) return i < 4 ? "2" : "3"
    }
    if (u > 7.25 && u < 8.25 && v > 2.45) return ih(fl(u * 20), fl(v * 20)) < 0.35 ? "e" : "f"   // the wet patch inside the door
    return ih(fl(u * 30), fl(v * 30)) < 0.08 ? "Z" : near(u % 1, 0, 1 / 40) || near(v % 1, 0, 1 / 40) ? "f" : "z"   // terrazzo, its brass strips
  })

  ISOKIT.opening("le_door", {
    pad: [0.08, 0, 0.08, 0.08],
    pass: (s, h, w, hh) => s > 0.12 && s < w - 0.12 && h > 0.9 && h < hh - 0.12,
    frames: 12,
    paint(s, h, o) {
      const { a, e, aw, ah, f } = o
      if (a < 0 || a >= aw || e >= ah) {
        if (a < -2 || a > aw + 1 || e > ah + 1) return null
        return a === -2 || a === aw + 1 || e === ah + 1 ? "3" : "4"
      }
      if (a < 3 || a >= aw - 3 || e < 27 || e >= ah - 3) return e < 27 && e > 2 && a > 3 && a < aw - 4 && (a + e) % 9 === 0 ? "a" : "A"   // wood, a panel below
      // wired glass: Weg_1's neon behind it, blurred; the wire's grid; rain
      const gx = a - 3, gy = ah - 3 - e
      if (gx % 5 === 0 || gy % 5 === 0) return "!4"
      if ((gx * 7 + fl(gy / 3) * 3 + f * 2) % 13 === 0) return "!h"
      const glow = Math.hypot((gx - 6) / 6, (gy - 12) / 9)
      return glow < 0.6 ? "!m" : glow < 1.1 ? "!M" : gy > 20 ? "!c" : "!n"
    },
  })
  ISOKIT.opening("le_mailboxes", {
    pad: 0.03,
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a < 0 || a >= aw || e < 0 || e >= ah) return a >= -1 && a <= aw && e >= -1 && e <= ah ? "3" : null
      const cols = 4, rows = 3, bw = aw / cols, bh = ah / rows, i = fl(a / bw), j = fl(e / bh), x = a - i * bw, y = e - j * bh
      if (x < 1 || y < 1) return "3"
      if (y > bh - 4 && y < bh - 2 && x > 2 && x < bw - 3) return "1"                       // the slot
      if (y < 4 && x > 1 && x < 5) return i === 1 && j === 2 ? "!q" : "H"                   // the name label (4B's taped over in red)
      return "5"
    },
  })
  ISOKIT.prop("le_pram", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      // four big wheels, the tub on its frame, the hood up at the far end, the handle bar at the near end
      for (const [a, b] of [[0, 0.04], [du - 0.04, 0.04], [0, dv - 0.24], [du - 0.04, dv - 0.24]]) pen.box(u + a, v + b, 0, 0.04, 0.2, 0.22, () => "1", () => "2", () => "1")
      pen.box(u + 0.04, v + 0.02, 0.22, du - 0.08, dv - 0.2, 0.3, (lu, lv) => (lv < 0.06 || lv > dv - 0.26 ? "U" : "u"), () => "u", () => "U")
      pen.box(u + 0.04, v + 0.02, 0.52, du - 0.08, 0.22, 0.26, () => "U", () => "u", () => "U")          // the hood
      pen.box(u + 0.1, v + dv - 0.2, 0.52, 0.03, 0.03, 0.4, () => "5", () => "4", () => "5")              // the handle's arms
      pen.box(u + du - 0.13, v + dv - 0.2, 0.52, 0.03, 0.03, 0.4, () => "5", () => "4", () => "5")
      pen.box(u + 0.1, v + dv - 0.2, 0.9, du - 0.2, 0.04, 0.04, () => "6", () => "5", () => "6")         // the bar
    },
  })
  // a bicycle chained to the pipe on the wall: two wheels, its frame, the chain
  ISOKIT.prop("le_bike", {
    draw(pen, p) {
      const [u, v] = p.at, [du] = p.foot
      for (const cu of [u + 0.3, u + du - 0.3]) {
        const [x, y] = pen.P(cu, v + 0.1, 0.33); pen.at(cu, v + 0.1, 0.33, "u")

        for (let t = 0; t < 6.3; t += 0.25) pen.px(Math.round(x + Math.cos(t) * 9), Math.round(y + Math.sin(t) * 10), "4")
      }
      const [a, ay] = pen.P(u + 0.3, v + 0.1, 0.33), [b, by] = pen.P(u + du - 0.3, v + 0.1, 0.33), [c, cy] = pen.P(u + du * 0.45, v + 0.1, 0.75)
      pen.at(u + du / 2, v + 0.1, 0.5, "u"); pen.line(a, ay, c, cy, "U"); pen.line(c, cy, b, by, "U"); pen.line(a, ay, b, by, "u")
      pen.line(b, by, b - 2, by - 14, "u"); pen.hline(b - 5, by - 14, 6, "4")
      pen.at(null)
    },
  })
  return {}
})()

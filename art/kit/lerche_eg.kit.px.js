// The kit pieces lerche_eg needs (art/rooms/lerche_eg.map.js), made by tools/new-room.mjs. BLOCKS for the user's approval (2026-11-18):
// the Wohnblock Lerche's hall on the ground floor, the same house as the landing upstairs (its floor, walls and lift come from
// art/kit/lerche_flur.kit.px.js; the flight up, the notice board and the flyers from the Kessel's lobby kit: what is alike is reused). Registered with ISOKIT (art/lib/isokit.js has the calls), drawn
// in room meters, lit by the bake; keys of the world palette (art/lib/iso.js). A kit's names are global in a bake: keep this one's prefixed.
//
//   floor    x  the hall's old terrazzo, wet footprints from the street door in the south-east corner toward the stairs
//   openings le_door (a street door of wood and wired glass; not used while the door is a gap in the near wall), le_mailboxes (twelve, one with its name taped over)
//   props    le_pram (a pram parked by the stairs: 4C's child), le_arcade (a SUMP RUNNER cabinet, playable)

const KIT_LERCHE_EG = (() => {
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w, fl = Math.floor, ih = ISO.ihash

  ISOKIT.floor("x", (u, v) => {
    // wet footprints from the street door (in the south-east corner, u 7.3 to 8.2) toward the stairs
    for (let i = 0; i < 9; i++) {
      const t = i / 8, fu = 7.6 - t * 3.0, fv = 3.6 - t * 0.9 + (i % 2 ? 0.07 : -0.07)
      if (Math.hypot(u - fu, (v - fv) * 1.6) < 0.06) return i < 4 ? "2" : "3"
    }
    if (u > 7.25 && u < 8.25 && v > 3.45) return ih(fl(u * 20), fl(v * 20)) < 0.35 ? "e" : "f"   // the wet patch inside the door
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
  // a SUMP RUNNER cabinet (the arcade game of Jade Row and the alley's ad; the user's wish: Juno can play it), its back to the north wall:
  // a dark body with magenta stripes down its sides, the lit marquee on top, the screen toward the room with the little diver on it, the
  // control panel with its stick and two buttons, the coin door's lit slot; its screen runs through its attract loop
  ISOKIT.prop("le_arcade", {
    frames: 12,
    draw(pen, p, f) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      const side = (a, e, o) => (a < 2 || a > o.aw - 3 ? "M" : "1")
      const front = (a, e, o) => {
        if (e > o.ah - 7) return e > o.ah - 2 ? "1" : "!m"
        if (e > o.ah * 0.48 && e < o.ah - 9 && a > 2 && a < o.aw - 3) {
          const sx = a - 3, sy = o.ah - 10 - e
          if (sy === 6 && sx > 3 && sx < 6) return "!y"
          if (sy > 12 && (sx + f) % 5 === 0) return "!c"
          return f % 6 === 5 && sy < 3 ? "!V" : "!v"
        }
        return a < 2 || a > o.aw - 3 ? "M" : "1"
      }
      pen.box(u, v, 0, du, dv - 0.2, H, () => "2", side, front)
      pen.box(u, v + dv - 0.2, 0.85, du, 0.2, 0.08, (lu, lv) => (Math.hypot(lu - du * 0.3, lv - 0.1) < 0.04 ? "1" : Math.hypot(lu - du * 0.65, lv - 0.1) < 0.035 ? "!q" : Math.hypot(lu - du * 0.8, lv - 0.1) < 0.035 ? "!y" : "3"), () => "2", () => "3")
      pen.box(u + 0.05, v + dv - 0.2, 0, du - 0.1, 0.2, 0.85, () => "2", () => "1", (a, e, o) => (e === o.ah - 2 && a > 3 && a < o.aw - 4 ? "!Q" : "1"))
    },
  })
  return {}
})()

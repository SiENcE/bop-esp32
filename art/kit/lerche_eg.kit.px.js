// The kit pieces lerche_eg needs (art/rooms/lerche_eg.map.js), made by tools/new-room.mjs. BLOCKS for the user's approval (2026-11-18):
// the Wohnblock Lerche's hall on the ground floor, the same house as the landing upstairs (its floor, walls and lift come from
// art/kit/lerche_flur.kit.px.js, the flight up from the Kessel's lobby kit). Registered with ISOKIT (art/lib/isokit.js has the calls), drawn
// in room meters, lit by the bake; keys of the world palette (art/lib/iso.js). A kit's names are global in a bake: keep this one's prefixed.
//
//   floor    x  the hall's old terrazzo, wet footprints from the street door in
//   openings le_door (the street door: wood and wired glass, Weg_1's neon blurred behind it, the keypad's glow beside it outside),
//            le_mailboxes (twelve, one with its name taped over), le_board (the house rules and a lost cat)
//   props    le_pram (a pram parked under the mailboxes: 4C's child), le_flyers (Lull flyers on the floor)

const KIT_LERCHE_EG = (() => {
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w, fl = Math.floor, ih = ISO.ihash

  ISOKIT.floor("x", (u, v) => {
    // wet footprints from the door (on the left wall, v 0.9 to 1.9) into the room
    for (let i = 0; i < 7; i++) {
      const t = i / 6, fu = 0.3 + t * 2.4, fv = 1.4 - t * 0.6 + (i % 2 ? 0.08 : -0.08)
      if (Math.hypot((u - fu) * 1.6, v - fv) < 0.06) return i < 3 ? "2" : "3"
    }
    if (u < 0.5 && v > 0.95 && v < 1.85) return ih(fl(u * 20), fl(v * 20)) < 0.35 ? "e" : "f"   // the wet patch inside the door
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
  ISOKIT.opening("le_board", {
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a < 0 || a >= aw || e < 0 || e >= ah) return null
      if (a === 0 || e === 0 || a === aw - 1 || e === ah - 1) return "O"
      if (a > 2 && a < aw * 0.55 && e > 3 && e < ah - 3) return e % 3 === 0 ? "h" : "H"     // the house rules
      if (a > aw * 0.6 && a < aw - 2 && e > ah * 0.4 && e < ah - 3) return Math.hypot(a - aw * 0.78, e - ah * 0.7) < 2.5 ? "1" : "W"   // a lost cat
      return "P"
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
  ISOKIT.prop("le_flyers", {
    footprint: () => [],
    solid: () => [],
    outline: false,
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      pen.box(u, v, 0, du, dv, 0.01, (lu, lv) => (ih(fl(lu * 14), fl(lv * 14)) < 0.45 ? (ih(fl(lv * 14), fl(lu * 14)) < 0.3 ? "C" : "H") : null), () => null, () => null)
    },
  })

  return {}
})()

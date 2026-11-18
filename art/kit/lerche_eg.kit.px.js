// The kit pieces lerche_eg needs (art/rooms/lerche_eg.map.js): the Wohnblock Lerche's hall on the ground floor, the same house as the
// landing upstairs (its floor, walls and lift come from art/kit/lerche_flur.kit.px.js; the flight up, the notice board and the flyers
// from the Kessel's lobby kit: what is alike is reused). PAINTED (2026-11-18) on the lines of the blocks the user approved that day.
// Registered with ISOKIT (art/lib/isokit.js has the calls), drawn in room meters, lit by the bake; keys of the world palette
// (art/lib/iso.js). A kit's names are global in a bake: keep this one's prefixed.
//
//   floor    x  the hall's old terrazzo: chips of stone in the grey, brass strips in a metre grid, a crack across two fields, wet
//            footprints from the street door in the south-east corner toward the stairs, the wet patch inside the door
//   openings le_door (a street door of wood and wired glass; not used while the door is a gap in the near wall), le_mailboxes (twelve
//            dented boxes with their name labels, 4B's taped over in red, one door hanging open with flyers stuffed in it)
//   props    le_pram (a pram parked by the stairs: 4C's child; a blanket over the side), le_arcade (a SUMP RUNNER cabinet, playable:
//            game/sump_runner.js; its screen runs the game's attract loop, the water rising through the pipes, the cable climbing)

const KIT_LERCHE_EG = (() => {
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w, fl = Math.floor, ih = ISO.ihash

  ISOKIT.floor("x", (u, v) => {
    // wet footprints from the street door (in the south-east corner, u 7.3 to 8.2) toward the stairs, drying as they go
    for (let i = 0; i < 9; i++) {
      const t = i / 8, fu = 7.6 - t * 3.0, fv = 3.6 - t * 0.9 + (i % 2 ? 0.07 : -0.07)
      const d = Math.hypot(u - fu, (v - fv) * 1.6)
      if (d < 0.06) return i < 4 ? "2" : "3"
      if (i < 3 && d < 0.075 && near(Math.atan2(v - fv, u - fu), 2.6, 0.5)) return "e"         // the heel's wet edge
    }
    if (u > 7.25 && u < 8.25 && v > 3.45) {
      if (Math.hypot(u - 7.8, (v - 3.9) * 1.4) < 0.18) return ih(fl(u * 30), fl(v * 30)) < 0.2 ? "!I" : "e"   // the puddle: Weg_1's light in it
      return ih(fl(u * 20), fl(v * 20)) < 0.35 ? "e" : "f"                                 // the wet patch inside the door
    }
    if (near(u % 1, 0, 1 / 40) || near(v % 1, 0, 1 / 40)) return near(u % 1, 0, 1 / 80) || near(v % 1, 0, 1 / 80) ? "O" : "f"   // brass strips, dull with dirt
    // a crack across two fields, mended once with something darker
    const cu = 2.3 + (v - 1.8) * 0.8 + 0.06 * Math.sin(v * 13)
    if (v > 1.8 && v < 3.4 && near(u, cu, 1 / 50)) return "f"
    // the stone chips in the grey: a few pale, a few dark, a rare red one, scattered as the pour left them
    const q = ih(fl(u * 24), fl(v * 24))
    if (q < 0.05) return "Z"
    if (q < 0.08) return "X"
    if (q < 0.095) return "f"
    if (q < 0.1) return "a"
    return "z"
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
  // twelve mailboxes in a steel block, four by three: each with its slot, its lock and its name label; 4B's taped over in red (the
  // agency's tape, as on its door), one door at the bottom hanging open, the flyers that came stuffed in it
  ISOKIT.opening("le_mailboxes", {
    pad: 0.03,
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a < -1 || a > aw || e < -1 || e > ah) return null
      o.memo.box ??= ISOKIT.raster(aw + 2, ah + 2, (c) => {
        const W = aw + 2, H = ah + 2, cols = 4, rows = 3, bw = aw / cols, bh = ah / rows
        c.rect(0, 0, W, H, "3"); c.hline(0, 0, W, "4")
        for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
          const x0 = 1 + fl(i * bw), x1 = 1 + fl((i + 1) * bw) - 1, y0 = 1 + fl(j * bh), y1 = 1 + fl((j + 1) * bh) - 1, w = x1 - x0, hh = y1 - y0
          const open = i === 2 && j === 2
          c.rect(x0 + 1, y0 + 1, w - 1, hh - 1, open ? "1" : "5"); c.hline(x0 + 1, y0 + 1, w - 1, open ? "2" : "6")
          if (open) { c.rect(x0 + 2, y0 + 3, w - 3, hh - 4, "H"); c.hline(x0 + 2, y0 + 4, w - 4, "y"); continue }   // the flyers in it
          c.hline(x0 + 2, y0 + 3, w - 3, "1")                                                // the slot
          const red = i === 1 && j === 2
          c.rect(x0 + 2, y0 + hh - 4, Math.min(5, w - 3), 2, red ? "q" : "H")               // the name label (4B's taped over)
          if (red) c.px(x0 + 2 + Math.min(5, w - 3), y0 + hh - 4, "q")
          c.px(x1 - 2, y0 + fl(hh / 2) + 1, "G")                                             // the lock
          if (ih(i, j) < 0.3) c.px(x0 + 2 + fl(ih(j, i) * (w - 4)), y0 + fl(hh / 2), "4")   // a dent
        }
      }, 1, 1)
      return o.memo.box(a + 1, e + 1)
    },
  })
  ISOKIT.prop("le_pram", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      // four big wheels with their tyres and hubs, the tub on its frame, the hood up at the far end, a knitted blanket hung over the
      // near side, the handle bar at the near end with its foam worn through
      for (const [a, b] of [[0, 0.04], [du - 0.04, 0.04], [0, dv - 0.24], [du - 0.04, dv - 0.24]])
        pen.box(u + a, v + b, 0, 0.04, 0.2, 0.22, () => "1", () => "2", (x, e, o) => (Math.hypot(x - o.aw / 2, e - o.ah / 2) < 1.2 ? "6" : x === 0 || x === o.aw - 1 || e === 0 || e === o.ah - 1 ? "1" : "3"))
      pen.box(u + 0.02, v + 0.06, 0.2, du - 0.04, dv - 0.3, 0.03, () => "5", () => "4", () => "4")          // the frame under the tub
      pen.box(u + 0.04, v + 0.02, 0.22, du - 0.08, dv - 0.2, 0.3,
        (lu, lv) => (lv < 0.06 || lv > dv - 0.26 ? "U" : "u"),
        (a, e, o) => (e > o.ah - 3 ? "U" : a > 2 && a < o.aw - 3 && e > 2 && (a + fl(e / 2)) % 4 === 0 ? "y" : e > 3 ? "Y" : "j"),   // the blanket over the side
        () => "U")
      pen.box(u + 0.04, v + 0.02, 0.52, du - 0.08, 0.22, 0.26, (lu, lv) => (near(lv, 0.11, 0.02) ? "u" : "U"), () => "u", (a, e, o) => (e % 4 === 0 ? "u" : "U"))   // the hood, its ribs
      pen.box(u + 0.1, v + dv - 0.2, 0.52, 0.03, 0.03, 0.4, () => "5", () => "4", () => "5")              // the handle's arms
      pen.box(u + du - 0.13, v + dv - 0.2, 0.52, 0.03, 0.03, 0.4, () => "5", () => "4", () => "5")
      pen.box(u + 0.1, v + dv - 0.2, 0.9, du - 0.2, 0.04, 0.04, () => "2", (a) => (a > 2 && a < 6 ? "5" : "2"), () => "2")   // the bar's foam, worn
    },
  })
  // a SUMP RUNNER cabinet, its back to the north wall: a dark body with magenta stripes down its sides, the lit marquee on top with the
  // game's little rat, the screen toward the room running the attract loop (pipes, the cable climbing, the water rising, over again),
  // the control panel with its stick and two buttons, the coin door with its lit slot (stuck: it plays for free)
  ISOKIT.prop("le_arcade", {
    frames: 12,
    draw(pen, p, f) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      const side = (a, e, o) => (a < 2 || a > o.aw - 3 ? (e > o.ah * 0.5 && a === 1 ? "m" : "M") : e > o.ah - 3 ? "2" : "1")
      // the attract loop on the screen (sx, sy from its bottom left): the pipes' runs in teal, the cable in yellow up to where it has got,
      // the water's blue rising with the frames, the rat at the cable's head; the marquee's neon above
      // a house's pipes, top row first (no symmetry: it must never read as a sign), and the cable's way up them from the bottom, in order
      const PIPES = ["..#...#", "..###.#", "....###", ".####..", ".#...#.", ".###.#.", "...###."]
      const WAY = [[3, 0], [3, 1], [2, 1], [1, 1], [1, 2], [1, 3], [2, 3], [3, 3], [4, 3], [4, 4], [4, 5], [3, 5], [2, 5], [2, 6]]
      const front = (a, e, o) => {
        const top = o.ah - 1 - e
        if (top < 6) {                                                                     // the marquee
          if (top === 0 || top === 5) return "M"
          if (a < 2 || a > o.aw - 3) return "M"
          if (top >= 2 && top <= 3 && a >= 4 && a <= o.aw - 5) return (a + top) % 3 === 0 ? "!N" : "!m"
          return "!n"
        }
        if (top < 8) return "1"
        if (e > o.ah * 0.55 && a > 2 && a < o.aw - 3) {                                   // the screen, over the control panel
          const base = fl(o.ah * 0.55) + 1, sx = a - 3, sy = e - base, sw = o.aw - 6, sh = Math.max(1, o.ah - 9 - base)
          if (sy < 0 || sx >= sw) return "1"
          const water = fl((f % 12) * 0.45)
          if (sy < water) return sy === water - 1 ? "!v" : "!c"
          const px = fl(sx * 7 / sw), py = Math.min(6, fl(sy * 7 / sh))
          const pipe = PIPES[6 - py]?.[px] === "#"
          const k = WAY.findIndex(([wx, wy]) => wx === px && wy === py), head = Math.min(WAY.length - 1, f + 1)
          if (k >= 0 && k <= head) return k === head ? "!H" : "!y"                          // the cable, the rat at its head
          return pipe ? "!C" : "!1"
        }
        if (e > o.ah * 0.55 - 1) return "1"
        // below the screen: the control panel's lip is the box in front; the coin door with its slot and lock
        if (e > 6 && e < 14 && a > o.aw / 2 - 3 && a < o.aw / 2 + 2) return e === 12 && a >= o.aw / 2 - 1 && a <= o.aw / 2 ? "!Q" : "2"
        return a < 2 || a > o.aw - 3 ? "M" : "1"
      }
      pen.box(u, v, 0, du, dv - 0.2, H, () => "2", side, front)
      // the control panel: the stick's ball, two buttons, worn pale where hands rest
      pen.box(u, v + dv - 0.2, 0.85, du, 0.2, 0.08, (lu, lv) => (Math.hypot(lu - du * 0.3, lv - 0.1) < 0.04 ? "q" : Math.hypot(lu - du * 0.65, lv - 0.1) < 0.035 ? "!q" : Math.hypot(lu - du * 0.8, lv - 0.1) < 0.035 ? "!y" : lv > 0.15 ? "4" : "3"), () => "2", () => "M")
      pen.box(u + 0.05, v + dv - 0.2, 0, du - 0.1, 0.2, 0.85, () => "2", () => "1", (a, e, o) => {
        // the coin door: its outline, the lit slot (stuck), the lock under it
        const m = fl(o.aw / 2)
        if (a >= m - 3 && a <= m + 2 && e >= o.ah - 12 && e <= o.ah - 3) {
          if (a === m - 3 || a === m + 2 || e === o.ah - 12 || e === o.ah - 3) return "3"
          if (e === o.ah - 5 && a >= m - 1 && a <= m) return "!Q"
          if (e === o.ah - 9 && a === m) return "G"
          return "2"
        }
        return e < 3 ? "2" : a === 1 || a === o.aw - 2 ? "M" : "1"
      })
    },
  })
  return {}
})()

// The kit pieces lantern_versteck needs (art/rooms/lantern_versteck.map.js), made by tools/new-room.mjs: placeholders to paint over (read the style guide
// and the pxl skill first). Registered with ISOKIT (art/lib/isokit.js has the calls), drawn in room meters, lit by the
// bake; keys of the world palette (art/lib/iso.js). A kit's names are global in a bake: keep this one's prefixed.
//
//   floor    p  plain screed, a joint every meter
//   walls    lantern_versteck_wall  plain paint over a dark skirting
//   props    lv_kitchen, lv_rack, lv_schwelle  the caravan's kitchen, the rack of senders, a door's sill (blocks)
//            lv_magazines, lv_crt, lv_boombox      old magazines, a monitor on a crate of VHS tapes, a boombox (the nineties' junk)
//            lv_fridge              his fridge (plain: not Juno's with its kettle and Teo's photo)
//   opening  lv_window, lv_poster   the bigger window onto the swamp; his neon poster against Lull (its ticker: art/rooms/lantern_versteck.px.js)
//   (the floor and the walls carry the dirt and the litter)

const KIT_LANTERN_VERSTECK = (() => {
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w

  // ---------------------------------------------------------------- the caravan's mess (the user's wish, 2026-11-16: more chaotic and dirty,
  // old magazines and nineties junk lying about). The floor: grime in patches, and what lies on it painted into it (nothing to step
  // round, and nothing drawn over Juno's feet): papers and magazines, a pizza box, cans, a cable, a VHS tape, cassettes
  const H2 = (a, b) => { const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return x - Math.floor(x) }
  const LITTER = [
    // [u, v, du, dv, edge key, fill key]: flat things, a rim and a face
    [1.4, 0.8, 0.28, 0.2, "h", "H"], [1.62, 0.92, 0.22, 0.18, "x", "h"],                    // papers, a magazine open
    [2.3, 1.55, 0.36, 0.36, "O", "P"],                                                      // the pizza box
    [3.1, 1.95, 0.2, 0.12, "k", "1"], [3.12, 1.97, 0.06, 0.04, "H", "H"],                   // a VHS tape, its label
    [1.9, 2.05, 0.12, 0.08, "k", "4"], [2.05, 2.12, 0.12, 0.08, "k", "w"],                  // cassettes
    [4.0, 1.25, 0.3, 0.22, "M", "N"], [4.05, 1.3, 0.12, 0.08, "v", "v"],                    // a magazine, its glossy cover
  ]
  const CANS = [[2.75, 1.1], [2.82, 1.18], [1.15, 2.2], [3.7, 2.15], [4.5, 1.05]]
  ISOKIT.floor("p", (u, v) => {
    for (const [lu, lv, du, dv, rim, fill] of LITTER) if (u >= lu && u < lu + du && v >= lv && v < lv + dv) return (u - lu < 0.03 || v - lv < 0.03 || lu + du - u < 0.03 || lv + dv - v < 0.03) ? rim : fill
    for (const [cu, cv] of CANS) { const d = Math.hypot(u - cu, (v - cv) * 1.4); if (d < 0.05) return d < 0.025 ? "6" : "g" }
    if (Math.abs(v - (1.35 + 0.18 * Math.sin(u * 3.1))) < 0.012 && u > 2.6 && u < 4.6) return "k"           // a cable across the floor
    const stain = Math.sin(u * 4.3 + 1.2) * Math.sin(v * 5.1 + 0.4) + Math.sin(u * 9.7 - v * 3.3) * 0.4
    if (stain > 0.72) return "e"                                                                          // grime in patches
    if (H2(Math.floor(u * 32), Math.floor(v * 32)) > 0.985) return "f"                                    // crumbs, grit
    return near(u, Math.round(u)) || near(v, Math.round(v)) ? "e" : "z"
  })
  // the walls: grime low down where feet and the chair have rubbed, water stains running down from the ceiling's seams
  ISOKIT.wall("lantern_versteck_wall", (s, h) => {
    if (h < 0.08) return h >= 0.055 ? "4" : "1"
    if (h < 0.35 && H2(Math.floor(s * 24), Math.floor(h * 24)) > 0.55) return "2"
    const seam = s % 1.3, run = 0.25 + 0.5 * H2(Math.floor(s / 1.3), 7)
    if (seam > 0.08 && seam < 0.12 && h > 2.0 - run) return "2"
    return "3"
  })
  // the window: bigger, a pane onto the swamp at night (the user's wish: one must see the swamp, a little green): trunks with moss, the
  // mist, one of his lanterns, the black water; rain on the glass, a crack, grime in the corners
  ISOKIT.opening("lv_window", {
    pad: [0.08, 0.08, 0.08, 0.08],
    pass: (s, h, w, hh) => s > 0.06 && s < w - 0.06 && h > 0.06 && h < hh - 0.06,
    halo: [{ color: "#55a585", reach: 0.5, power: 0.8, rect: [0, 0, 1.2, 0.9] }],
    paint(s, h, o) {
      const { a, e, aw, ah, f } = o
      if (e >= -3 && e <= -1 && a >= -3 && a < aw + 3) return e === -1 ? "6" : "4"                  // the sill
      if (a < -2 || a >= aw + 2 || e < -3 || e > ah + 1) return null
      if (a < 0 || a >= aw || e >= ah || e < 0) return a === -2 || a === aw + 1 || e === ah + 1 ? "4" : "5"   // the frame
      if (a < 2 || a >= aw - 2 || e < 2 || e >= ah - 2) return "4"                                   // the rubber seal
      if (a === Math.floor(aw / 2)) return "4"                                                        // the frame between its two panes
      for (const [dx, dy] of [[5, 6], [14, 11], [23, 4], [31, 9], [9, 15], [27, 14]]) if (a === dx && e === ah - dy) return "!h"
      const dropY = (7 + f * 3) % ah; if (a === 18 && e === ah - dropY) return "!H"                // a drop running down
      if (Math.abs((a - 3) - (ah - e) * 0.9) < 0.6 && a < 14 && e > ah - 12) return "6"               // a crack in the left pane
      if ((a < 6 && e < 6 && a + e < 7) || (a > aw - 7 && e > ah - 7 && (aw - a) + (ah - e) < 8)) return (a + e) % 2 ? "2" : "1"   // grime
      // the view: water low, mist above it, trunks with moss, a lantern
      const wl = Math.round(ah * 0.28)
      if (e < wl) return (a * 3 + e * 7) % 11 === 0 ? "7" : "0"
      for (const [tx, tw] of [[6, 4], [19, 6], [aw - 9, 5]]) if (a >= tx && a < tx + tw) return (a === tx + tw - 1 ? "7" : (e % 5 === 0 && a === tx + 1 ? "8" : "k"))
      const lx = Math.round(aw * 0.72), ly = Math.round(ah * 0.62)
      if (Math.abs(a - lx) + Math.abs(e - ly) < 2) return "!9"
      if (Math.abs(a - lx) + Math.abs(e - ly) < 4) return "8"
      if (e < wl + 4) return (a + e) % 2 ? "7" : "0"                                                  // the mist on the water
      return e > ah * 0.75 ? "0" : (a + e * 2) % 9 === 0 ? "7" : "0"
    },
  })
  // on the wall over the bed: his own poster against Lull, colourful and lit (the user's wish, 2026-11-16): a deep purple ground glowing
  // magenta round its words, a neon frame in magenta and cyan that stutters now and then, WAKE UP in magenta neon, a small lantern in
  // his green; along its foot a dark band where an LED ticker runs (lantern_versteck_ticker, a sprite of its own laid over it: the
  // room's picture has only twelve frames)
  ISOKIT.opening("lv_poster", {
    pad: 0.05,
    paint(s, h, o) {
      const { aw, ah, f } = o
      o.memo.poster ??= ISOKIT.raster(aw + 2, ah + 2, (c) => {
        const W = aw + 2, Hh = ah + 2
        c.rect(0, 0, W, Hh, "u"); c.rect(1, 1, W - 2, Math.round(Hh * 0.45), "U")                        // the ground, lighter above
        for (let y = 2; y < Hh - 10; y++) for (let x = 2; x < W - 2; x++) if ((x + y) % 3 === 0 && Math.abs(x - W * 0.4) < W * 0.3 && y < Hh * 0.6) c.px(x, y, "n")   // the glow round the words
        TXT.draw(c, 4, 3, "WAKE", "!m", { font: "hud" })
        TXT.draw(c, 8, 10, "UP!", "!m", { font: "hud" })
        const lx = W - 9, ly = 5                                                                          // a small lantern in his green
        c.hline(lx + 1, ly, 3, "!7"); c.rect(lx, ly + 1, 5, 6, "!8"); c.rect(lx + 1, ly + 2, 3, 4, "!9"); c.hline(lx, ly + 7, 5, "!7")
        c.rect(1, Hh - 10, W - 2, 8, "k")                                                                 // the ticker's band
      }, -1, -1)
      const W = aw + 2, Hh = ah + 2, x = o.a + 1, y = Hh - 1 - (o.e + 1)
      const edge = x === 0 || y === 0 || x === W - 1 || y === Hh - 1
      if (edge) return (f % 12 === 7 || f % 12 === 8) && (x + y) % 3 === 0 ? "M" : (x + y) % 6 < 3 ? "!m" : "!v"   // the neon frame, stuttering
      return o.memo.poster(o.a, o.e)
    },
  })
  // a stack of old magazines: a faded cover on top, their edges in many dull colours
  ISOKIT.prop("lv_magazines", {
    draw(p, m) {
      const [u0, v0] = m.at, [du, dv] = m.foot, H = m.h
      p.box(u0, v0, 0, du, dv, H,
        (lu, lv) => (lu < 0.03 || lv < 0.03 ? "h" : lu > du * 0.45 && lu < du * 0.8 && lv > dv * 0.2 && lv < dv * 0.5 ? "T" : "I"),   // a faded cover
        (a, e) => ["h", "A", "x", "G", "P", "w"][e % 6],
        (a, e) => ["x", "A", "h", "w", "P", "G"][e % 6])
    },
  })
  // a monitor on a crate of VHS tapes: a dark casing, a thin frame, its picture glowing (a camera's view in his green and cyan, scanlines)
  ISOKIT.prop("lv_crt", {
    draw(p, m) {
      const [u0, v0] = m.at, [du, dv] = m.foot, H = m.h, C = H * 0.4
      p.box(u0, v0, 0, du, dv, C,
        () => "O",
        (a, e) => (e % 4 === 3 ? "O" : a % 5 === 4 ? "k" : e % 4 === 1 && a % 5 === 2 ? "H" : "1"),
        (a, e) => (e % 4 === 3 ? "O" : a % 5 === 4 ? "k" : e % 4 === 1 && a % 5 === 2 ? "H" : "1"))
      p.box(u0 + 0.02, v0 + 0.02, C, du - 0.04, dv - 0.04, H - C,
        () => "1",
        (a, e, o) => (a === o.aw - 1 ? "3" : e % 3 === 0 && a > 2 && a < o.aw - 3 ? "k" : "2"),            // its side: vents
        (a, e, o) => {
          if (a < 1 || a >= o.aw - 1 || e >= o.ah - 1) return "3"                                           // the frame
          if (e < 2) return a === o.aw - 3 ? "!v" : "2"                                                     // the chin, its power light
          if (e % 2 === 0) return (a + p.f) % 9 === 0 ? "!V" : "!c"                                         // the picture: scanlines
          return (a * 3 + e * 5 + p.f) % 13 === 0 ? "!8" : a > o.aw * 0.4 && a < o.aw * 0.7 && e > o.ah * 0.3 ? "!7" : "!0"
        })
    },
  })
  // a boombox: two speakers, the cassette deck between them, the handle
  ISOKIT.prop("lv_boombox", {
    draw(p, m) {
      const [u0, v0] = m.at, [du, dv] = m.foot, H = m.h
      p.box(u0, v0, 0, du, dv, H,
        () => "g",
        (a, e, o) => (a === o.aw - 1 ? "G" : "g"),
        (a, e, o) => {
          const cx1 = Math.round(o.aw * 0.22), cx2 = Math.round(o.aw * 0.78), cy = Math.round(o.ah * 0.45), r = Math.max(2, Math.round(o.ah * 0.3))
          for (const cx of [cx1, cx2]) { const d = Math.hypot(a - cx, e - cy); if (d < r) return d < 1 ? "4" : d < r - 1 ? "1" : "k" }
          if (a > cx1 + r && a < cx2 - r && e > 2 && e < o.ah - 3) return e === o.ah - 4 ? "v" : "4"
          return e === o.ah - 1 ? "G" : "g"
        })
      const [hx, hy] = p.P(u0 + du / 2, v0 + dv / 2, H)
      p.at(u0 + du / 2, v0 + dv / 2, H, null)
      p.hline(hx - 5, hy - 3, 11, "G"); p.vline(hx - 5, hy - 3, 3, "G"); p.vline(hx + 5, hy - 3, 3, "G")
    },
  })
  // BLOCKS for the caravan (the user's layout, 2026-11-16): the kitchen along the side wall, a sink and a hotplate on its top, cupboard
  // doors below; the rack of his senders, shelves of boxes with their small lights (blinking)
  ISOKIT.prop("lv_kitchen", {
    draw(p, m) {
      const [u0, v0] = m.at, [du, dv] = m.foot, H = m.h
      p.box(u0, v0, 0, du, dv, H,
        (lu, lv) => (lu > 0.12 && lu < 0.45 && lv > 0.1 && lv < 0.42 ? "2" : lu > 0.6 && lu < du - 0.1 && lv > 0.12 && lv < 0.42 ? "1" : "6"),
        (a, e, o) => (e <= 1 ? "2" : a === o.aw - 1 ? "5" : "4"),
        (a, e) => (e <= 1 ? "2" : e >= 25 ? "5" : a % 12 === 0 ? "3" : e === 20 && a % 12 >= 5 && a % 12 <= 6 ? "6" : "4"))
    },
  })
  // a door hinted at in a cut wall: its sill, a metal strip in the floor with a thin lit line where the door runs
  ISOKIT.prop("lv_schwelle", {
    draw(p, m) {
      const [u0, v0] = m.at, [du, dv] = m.foot, H = m.h
      p.box(u0, v0, 0, du, dv, H,
        (lu, lv) => ((du > dv ? lv : lu) > (du > dv ? dv : du) * 0.4 && (du > dv ? lv : lu) < (du > dv ? dv : du) * 0.6 ? "!v" : "5"),
        () => "3", () => "3")
    },
  })
  // his fridge, old and lived with (the user's wish, 2026-11-16: no kettle, no handle, but with character): a chrome strip across its
  // doors with the maker's plate, magnets, a note held by one, stickers (a square of his station's green, a Lull patch crossed out),
  // a dent, rust where the floor is wet; on its side a cable hanging from the back
  ISOKIT.prop("lv_fridge", {
    draw(p, m) {
      const [u0, v0] = m.at, [du, dv] = m.foot, H = m.h
      p.box(u0, v0, 0, du, dv, H,
        () => "5",
        (a, e, o) => (e <= 1 ? "2" : a === o.aw - 1 ? "5" : a === 3 && e > o.ah * 0.4 && e < o.ah - 4 ? "k" : a === 3 && e <= o.ah * 0.4 && e > o.ah * 0.4 - 6 ? "1" : "4"),
        (a, e, o) => {
          const gap = Math.round(o.ah * 0.68)
          if (e <= 1) return "2"
          if (e === gap) return "3"                                                                       // the gap between its doors
          if (e === gap + 2 || e === gap + 3) return e === gap + 3 ? "6" : "x"                             // the chrome strip
          if (e === gap + 2 && a >= 5 && a <= 9) return "h"
          if (e >= gap + 1 && e <= gap + 4 && a >= 5 && a <= 9) return e === gap + 3 ? "H" : "h"           // the maker's plate on it
          if (e >= 2 && e <= 4 && (a * 7) % 5 === 1) return "O"                                             // rust
          if (Math.abs(a - 11) + Math.abs(e - (gap - 9)) * 1.5 < 2.2) return "4"                           // a dent
          if (a >= 2 && a <= 6 && e >= o.ah - 11 && e <= o.ah - 6) return e === o.ah - 6 ? "x" : e % 2 ? "H" : "h"   // a note
          if (a === 4 && e === o.ah - 5) return "q"                                                         // the magnet holding it
          if (a >= 9 && a <= 12 && e >= o.ah - 10 && e <= o.ah - 7) return "!8"                             // his station's green sticker
          if (Math.abs(a - 6) * 0.8 + Math.abs(e - (gap - 4)) * 1.4 < 2.6) return Math.abs(a - 6 - (e - gap + 4)) < 1 ? "M" : "V"   // a Lull patch, crossed out
          for (const [mx, me, k] of [[11, gap - 3, "m"], [3, gap - 14, "v"], [12, gap - 16, "P"], [8, 8, "T"]]) if (a === mx && e === me) return k   // magnets
          return a === 0 ? "6" : "5"
        })
    },
  })
  ISOKIT.prop("lv_rack", {
    draw(p, m) {
      const [u0, v0] = m.at, [du, dv] = m.foot, H = m.h
      p.box(u0, v0, 0, du, dv, H,
        () => "4",
        (a, e, o) => (a === o.aw - 1 ? "4" : "2"),
        (a, e) => (e % 9 === 0 ? "4" : e % 9 === 4 && a % 4 === 2 ? ((p.f + a + e) % 5 === 0 ? "!c" : "!v") : e % 9 === 6 && a % 6 === 1 ? "5" : "1"))
    },
  })

  return {}
})()

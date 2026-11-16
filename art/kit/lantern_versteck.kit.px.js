// The kit pieces lantern_versteck needs (art/rooms/lantern_versteck.map.js): registered with ISOKIT (art/lib/isokit.js has the calls),
// drawn in room meters, lit by the bake; keys of the world palette (art/lib/iso.js) and the few of its own below. A kit's names are
// global in a bake: keep this one's prefixed.
//
//   floor    p  an old camper's lino in small checks, worn by his wheelchair's tracks; the dirt and the litter on it
//   walls    lantern_versteck_wall  a camper's panelling: dark below a belt rail, lighter above, the seams with their screws, the roof's
//                                   trim; water running down from the roof, grime low down; his cable along the top to the rack
//   props    lv_bed      his bunk: a box base with drawers, a thin mattress, an army blanket, his headphones
//            lv_kitchen  the van's kitchen: cupboards (one door gone), a sink full of dishes, a two-ring hob with a pot, a bare bulb
//            lv_desk     his monitors and his sender: an open desk a wheelchair goes under, screens with cameras nobody knows any more,
//                        a microphone on its arm, a mixer, his storm lantern
//            lv_rack     the rack of senders: a power supply, the output stage's valves, the exciter showing 87.6, VU meters, a patch
//                        panel, a modem; the feeds going up to the antennas on the roof
//            lv_fridge   his fridge (not Juno's with its kettle and Teo's photo)
//            lv_magazines, lv_crt, lv_boombox      old magazines, a monitor on a crate of VHS tapes, a boombox (the nineties' junk)
//            lv_schwelle a door's sill, the doors only hinted at in the cut walls
//   opening  lv_window, lv_poster   the bigger window onto the swamp; his neon poster against Lull (its ticker: art/rooms/lantern_versteck.px.js)

// his screens' green on what it falls on, and his army blanket's olive
pal({ E: "#0e221d", F: "#163628", J: "#245038", b: "#24281a", B: "#3a4026", d: "#59603a" })

const KIT_LANTERN_VERSTECK = (() => {
  const fl = Math.floor, ih = ISO.ihash
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w

  // the screens' light: his phosphor green over the floor, the desk and whoever sits at it (a family of its own, as in the laundromat)
  ISOKIT.TINT.green = {
    e: ["e", "E"], f: ["f", "E"], z: ["z", "E"], Z: ["Z", "E"], X: ["X", "F"],
    1: ["1", "E"], 2: ["2", "E"], 3: ["3", "F"], 4: ["4", "F"], 5: ["5", "J"], 6: ["6", "J"],
    g: ["g", "J"], G: ["J", "8"], h: ["8", "9"], H: ["9", "9"], a: ["a", "E"], A: ["A", "F"], O: ["O", "O"], P: ["P", "P"],
    u: ["u", "E"], U: ["U", "J"], b: ["b", "B"], B: ["B", "d"], E: ["E", "F"], F: ["F", "J"], J: ["J", "8"],
  }
  Object.assign(ISOKIT.SHADE, { E: "e", F: "E", J: "F", b: "e", B: "b", d: "B" })

  // ---------------------------------------------------------------- the floor
  // an old camper's lino in 25 cm checks; the caravan's mess (the user's wish, 2026-11-16: chaotic and dirty, old magazines and
  // nineties junk lying about) painted into it (nothing to step round, and nothing drawn over Juno's feet): papers and magazines, a
  // pizza box, cans, a cable, a VHS tape, cassettes; grime in patches. His wheelchair has worn its ways into the lino: from the desk
  // along the kitchen to the bed, and the arcs where he turns at his desk
  const LITTER = [
    // [u, v, du, dv, edge key, fill key]: flat things, a rim and a face
    [1.4, 0.8, 0.28, 0.2, "h", "H"], [1.62, 0.92, 0.22, 0.18, "x", "h"],                    // papers, a magazine open
    [1.25, 1.4, 0.36, 0.36, "O", "P"],                                                      // the pizza box
    [3.1, 1.95, 0.2, 0.12, "k", "1"], [3.12, 1.97, 0.06, 0.04, "H", "H"],                   // a VHS tape, its label
    [1.9, 2.05, 0.12, 0.08, "k", "4"], [2.05, 2.12, 0.12, 0.08, "k", "w"],                  // cassettes
    [4.0, 1.25, 0.3, 0.22, "M", "N"], [4.05, 1.3, 0.12, 0.08, "v", "v"],                    // a magazine, its glossy cover
  ]
  const CANS = [[2.75, 1.1], [2.82, 1.18], [1.15, 2.2], [3.7, 2.15], [4.5, 1.05]]
  // the wheels' tracks: a straight run at each wheel (v of its line, u from, u to), the turning arcs round his place
  const TRACKS = [[0.72, 1.15, 3.35], [1.22, 1.15, 3.35]]
  const SEAT = [3.6, 0.97]
  ISOKIT.floor("p", (u, v) => {
    for (const [lu, lv, du, dv, rim, fill] of LITTER) if (u >= lu && u < lu + du && v >= lv && v < lv + dv) return (u - lu < 0.03 || v - lv < 0.03 || lu + du - u < 0.03 || lv + dv - v < 0.03) ? rim : fill
    for (const [cu, cv] of CANS) { const d = Math.hypot(u - cu, (v - cv) * 1.4); if (d < 0.05) return d < 0.025 ? "6" : "g" }
    if (Math.abs(v - (1.35 + 0.18 * Math.sin(u * 3.1))) < 0.012 && u > 2.6 && u < 4.6) return "k"           // a cable across the floor
    const stain = Math.sin(u * 4.3 + 1.2) * Math.sin(v * 5.1 + 0.4) + Math.sin(u * 9.7 - v * 3.3) * 0.4
    if (stain > 0.86) return "e"                                                                          // grime in patches
    if (ih(fl(u * 32), fl(v * 32)) > 0.985) return "f"                                                    // crumbs, grit
    // worn bare where the wheels go: the pattern rubbed off, a dull streak
    for (const [tv, a0, a1] of TRACKS) if (u > a0 && u < a1 && Math.abs(v - tv) < 0.035) return ih(fl(u * 20), 3) < 0.2 ? "z" : "X"
    const r = Math.hypot(u - SEAT[0], v - SEAT[1])
    if ((near(r, 0.3, 0.03) || near(r, 0.5, 0.025)) && v > SEAT[1] - 0.1 && u < SEAT[0] + 0.2) return "X"
    // the lino: checks, a darker line where its sheets meet every meter
    if (near(u, Math.round(u), 1 / 64) && u > 0.1) return "f"
    return (fl(u * 4) + fl(v * 4)) % 2 ? "Z" : "z"
  })

  // ---------------------------------------------------------------- the walls
  // a camper's panelling: dark laminate under a belt rail at 90 cm, lighter above, a seam every 60 cm with a screw at each end; the
  // roof's aluminium trim along the top. Water runs down from the roof's seams (the van leaks), grime low down where the chair has
  // rubbed. Along the top of the long wall his feed cable runs in clips from the window's end to the rack (the antennas on the roof)
  const PANEL = 0.6, BELT = 0.9
  ISOKIT.wall("lantern_versteck_wall", (s, h, o) => {
    if (h < 0.08) return h >= 0.055 ? "4" : "1"                                                           // the skirting
    if (h >= 1.93) return "4"                                                                             // the roof's trim
    if (h >= 1.9) return "1"                                                                              // its shadow
    const long = o.wall && o.wall.from[1] === 0 && o.wall.to[1] === 0
    if (long && s > 2.3) {                                                                                // his cable, sagging between clips
      const t = ((s - 2.3) % 0.4) / 0.4, ch = 1.84 - 0.035 * Math.sin(Math.PI * t)
      if (Math.abs(h - ch) < 0.018) return t < 0.06 || t > 0.94 ? "5" : "k"
    }
    if (near(h, BELT, 1 / 60)) return "4"                                                                 // the belt rail, lit on top
    if (near(h, BELT + 1 / 30, 1 / 60)) return "5"
    const seam = near(s % PANEL, 0, 1 / 40) && s > 0.05
    if (seam && (near(h, 0.16, 1 / 40) || near(h, 0.78, 1 / 40) || near(h, 1.05, 1 / 40) || near(h, 1.78, 1 / 40))) return "5"   // screws
    if (h < BELT) {
      if (seam) return "1"
      if (h < 0.35 && ih(fl(s * 24), fl(h * 24)) > 0.55) return "1"                                     // grime where the chair rubs
      return "2"
    }
    if (seam) return "2"
    const run = 0.25 + 0.55 * ih(fl(s / 1.3), 7), sm = s % 1.3                                            // water from the roof's seams
    if (sm > 0.08 && sm < 0.12 && h > 1.9 - run) return "2"
    if (sm > 0.06 && sm < 0.14 && h > 1.86 && h < 1.9) return "2"
    return "3"
  })

  // ---------------------------------------------------------------- the window, the poster
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

  // ---------------------------------------------------------------- the nineties' junk
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

  // ---------------------------------------------------------------- his bunk
  // a box base of plywood with two drawers under a thin mattress; the army blanket thrown back, the pillow at the head by the corner,
  // big headphones and a paperback on it
  ISOKIT.prop("lv_bed", {
    solid: (m) => [[m.at[0], m.at[1], 0, m.foot[0], m.foot[1], 0.42]],
    draw(p, m) {
      const [u0, v0] = m.at, [du, dv] = m.foot, BH = 0.28, MT = 0.12, H1 = BH + MT
      // the base: its face toward the room (+u) with two drawers, finger holes; the foot end (+v)
      p.box(u0, v0, 0, du, dv, BH, () => "a",
        (a, e, o) => {
          if (e === o.ah - 1) return "A"
          if (e <= 1) return "1"                                                                          // the kick, dark
          const w = fl(o.aw / 2), i = a % w
          if (i === 0 || i === w - 1 || e === 2 || e === o.ah - 2) return "a"                            // the drawers' gaps
          if (e === o.ah - 4 && Math.abs(i - w / 2) < 2) return "1"                                      // the finger holes
          return (a * 7 + e) % 23 === 0 ? "a" : "O"
        },
        (a, e, o) => (e === o.ah - 1 ? "A" : e <= 1 ? "1" : a === 0 ? "A" : "O"))
      // the mattress, grey and flattened
      p.box(u0 + 0.02, v0 + 0.02, BH, du - 0.04, dv - 0.04, MT,
        (lu, lv) => (lu > du - 0.09 || lv > dv - 0.09 ? "5" : "4"),
        (a, e, o) => (e === o.ah - 1 ? "5" : e === 1 ? "3" : "4"), (a, e, o) => (e === o.ah - 1 ? "5" : "4"))
      // the pillow at the head
      p.box(u0 + 0.12, v0 + 0.08, H1, 0.68, 0.34, 0.08,
        (lu, lv) => (lu < 0.04 || lv < 0.04 ? "h" : Math.abs(lv - 0.17 - 0.04 * Math.sin(lu * 11)) < 0.025 ? "h" : "H"),
        () => "h", (a, e) => (e === 0 ? "g" : "h"))
      // the army blanket thrown back toward the foot, its ridges lit on one side, a darker stripe across its end
      const RIDGES = [[0.6, 0.07, 0.4, 0.05, 0.85], [0.95, 0.08, 2.0, 0.0, 0.9], [1.3, 0.06, 3.3, 0.1, 0.8], [1.55, 0.07, 1.0, 0.0, 0.9]]
      const fold = (u, v) => {
        for (const [vr, amp, ph, ua, ub] of RIDGES) {
          if (u < ua || u > ub) continue
          const s = v - (vr + amp * Math.sin(u * 7 + ph))
          if (s > -0.035 && s < 0.025) return "d"
          if (s >= 0.025 && s < 0.08) return "b"
        }
        return near(v, 1.68, 0.03) ? "b" : "B"
      }
      const BL0 = 0.48, BL1 = 1.85
      p.box(u0 + 0.02, v0 + BL0, H1, du - 0.02, BL1 - BL0, 0.05,
        (lu, lv) => {
          const e0 = 0.06 * Math.sin(lu * 6.5), e1 = 0.06 * Math.sin(lu * 5 + 1)
          if (lv < e0 + 0.02 || lv > BL1 - BL0 - 0.04 + e1) return null
          return fold(lu, lv + BL0)
        },
        (a, e) => (e >= 1 - fl(4 + 3 * Math.sin(a * 0.45)) + 4 ? (a % 7 === 3 ? "b" : "B") : null),   // hanging over the side
        () => null)
      p.box(u0 + du - 0.01, v0 + BL0 + 0.15, 0.12, 0.01, BL1 - BL0 - 0.35, H1 - 0.12 + 0.05, null,
        (a, e) => (e > 2 + 2 * Math.sin(a * 0.5) ? (a % 6 === 2 ? "b" : "B") : null), null)
      // the headphones on the pillow's edge, their cable trailing, a paperback open face down on the blanket
      const [hx, hy] = p.P(u0 + 0.62, v0 + 0.52, H1 + 0.05)
      p.at(u0 + 0.62, v0 + 0.52, H1 + 0.06, "up")
      p.grid(hx - 4, hy - 4, [".kkkk..", "k1..1k.", "k....k.", "33..33.", "22..22."])
      p.line(hx + 1, hy, hx + 4, hy + 4, "k"); p.line(hx + 4, hy + 4, hx + 9, hy + 5, "k")
      const [bx, by] = p.P(u0 + 0.4, v0 + 1.25, H1 + 0.07)
      p.at(u0 + 0.4, v0 + 1.25, H1 + 0.08, "up")
      p.grid(bx - 4, by - 2, ["..hhO...", "hhhOhhh.", "OOOOOOOO", ".OOkOO.."])
      p.at(null)
    },
  })

  // ---------------------------------------------------------------- the kitchen
  // the van's kitchen along the side wall: a laminate carcass, drawers under the worktop, the left cupboard shut, the right one's door
  // gone (inside: a water jug, tins, a pan); on top a steel sink full of dishes with its tap, a two-ring gas hob with a dented pot, a
  // jar of instant noodles' forks; over it a bare bulb on its cord from the roof (the kitchen's warm light)
  ISOKIT.prop("lv_kitchen", {
    solid: (m) => [[m.at[0], m.at[1], 0, m.foot[0], m.foot[1], m.h]],
    draw(p, m) {
      const [u0, v0] = m.at, [du, dv] = m.foot, H = m.h
      const SINK = [0.08, 0.1, 0.4, 0.34], HOB = [0.56, 0.1, 0.38, 0.34]
      const inR = ([a, b, w, h], lu, lv) => lu >= a && lu < a + w && lv >= b && lv < b + h
      p.box(u0, v0, 0, du, dv, H,
        (lu, lv) => {
          if (lv > dv - 0.04) return "5"                                                                 // the worktop's front edge
          if (inR(SINK, lu, lv)) {
            const [a, b, w, h] = SINK
            if (lu < a + 0.03 || lv < b + 0.03 || lu > a + w - 0.03 || lv > b + h - 0.03) return "5"    // its rim
            if (Math.hypot(lu - (a + w / 2), lv - (b + h / 2)) < 0.03) return "1"                       // the drain
            return lv < b + 0.08 ? "2" : "3"
          }
          if (inR(HOB, lu, lv)) {
            const [a, b, w, h] = HOB
            if (lu < a + 0.02 || lv < b + 0.02 || lu > a + w - 0.02 || lv > b + h - 0.02) return "3"
            for (const [cu, cv] of [[a + 0.1, b + 0.17], [a + 0.28, b + 0.17]]) {
              const d = Math.hypot(lu - cu, lv - cv); if (near(d, 0.06, 0.012) || d < 0.015) return "4"   // the burners
            }
            return "1"
          }
          return ((lu * 31) % 1 < 0.08) ? "3" : "4"                                                     // the laminate, its grain
        },
        (a, e, o) => (e >= o.ah - 2 ? "5" : e <= 1 ? "1" : a === o.aw - 1 ? "3" : "2"),
        (a, e, o) => {
          const W = o.aw, mid = fl(W / 2)
          if (e >= o.ah - 2) return e === o.ah - 1 ? "6" : "5"                                           // the worktop's edge
          if (e <= 1) return "1"                                                                          // the kick
          if (e >= o.ah - 7) {                                                                            // the drawers
            if (e === o.ah - 7 || a === 0 || a === mid || a === W - 1) return "2"
            if (e === o.ah - 5 && (Math.abs(a - mid / 2) < 2 || Math.abs(a - mid - mid / 2) < 2)) return "6"   // their handles
            return "4"
          }
          if (a > mid) {                                                                                  // the cupboard whose door is gone
            if (a === mid + 1 || a === W - 1 || e === 2 || e === o.ah - 8) return "3"
            const x = a - mid - 2, y = e - 3
            if (y === 7) return "3"                                                                       // its shelf
            if (y >= 0 && y < 7 && x >= 1 && x <= 4) return y === 6 ? "H" : x === 1 ? "h" : "x"         // a water jug
            if (y >= 0 && y < 4 && x >= 6 && x <= 8) return y === 3 ? "6" : x === 7 ? "P" : "O"          // tins
            if (y >= 8 && y < 11 && x >= 2 && x <= 9) return y === 10 ? "4" : "1"                        // a pan
            if (y > 7 && x >= 11 && x <= 12) return "P"                                                   // a bag of rice
            return "1"
          }
          if (a === 0 || a === mid || e === 2 || e === o.ah - 8) return "2"                              // the shut door
          if (a === mid - 2 && e > o.ah - 14 && e < o.ah - 10) return "6"                                // its handle
          if (a <= 2 && e < 6) return "3"                                                                 // a scuff
          return "4"
        })
      // the tap over the sink
      const [tx, ty] = p.P(u0 + 0.28, v0 + 0.06, H)
      p.at(u0 + 0.28, v0 + 0.06, H + 0.1, null)
      p.grid(tx - 2, ty - 7, [".555.", "5...5", "5...5", "....5", "....4", "...44", "..444"])
      // dishes in the sink: plates on edge, a mug
      const [sx, sy] = p.P(u0 + 0.28, v0 + 0.28, H)
      p.at(u0 + 0.28, v0 + 0.28, H + 0.03, "up")
      p.grid(sx - 5, sy - 5, ["...hh....", "..hHh.hh.", ".hHHhhHHh", "hHHh.hHh.", ".hh..PPh.", "....chc..", "....cc..."])
      // the pot on the left burner, dented, its lid askew
      const [px, py] = p.P(u0 + 0.66, v0 + 0.27, H)
      p.at(u0 + 0.66, v0 + 0.27, H + 0.08, null)
      p.grid(px - 5, py - 7, ["...444....", ".4555554..", "45666665.4", ".4444444..", "4555556654", "4555655554", "45555555k.", ".4444444..", "..k.k.k..."])
      // the bare bulb on its cord from the roof
      const [lx, ly] = p.P(u0 + 0.5, v0 + 0.3, 1.72), [lx0, ly0] = p.P(u0 + 0.5, v0 + 0.3, 1.98)
      p.at(u0 + 0.5, v0 + 0.3, 1.85, null)
      p.vline(lx0, ly0, ly - ly0 - 1, "k")
      p.grid(lx - 1, ly - 2, [".1.", "1R1", "RWR", ".R."], { R: "!R", W: "!W" })
      p.at(null)
    },
  })

  // ---------------------------------------------------------------- his desk and his sender
  // an old office desk with nothing under its middle, so his chair goes under: a car battery and its inverter under the left end,
  // cables; on top a riser with his screens: an old CRT with a camera's view (scanlines, a timestamp), a wide screen with four
  // cameras nobody knows any more, a narrow one scrolling the board; over them on the wall his sender's waveform; a microphone on
  // its arm swung toward his place, a little mixer with its faders, the keyboard, a mug, and his storm lantern at the right end
  const DESK_NF = 12
  ISOKIT.prop("lv_desk", {
    frames: DESK_NF,
    solid: (m) => [[m.at[0], m.at[1], 0.72, m.foot[0], m.foot[1], 0.05], [m.at[0] + 0.05, m.at[1] + 0.1, 0, 0.3, 0.3, 0.3], [m.at[0], m.at[1], 0.77, m.foot[0], 0.32, 0.5]],
    footprint: (m) => [[m.at[0], m.at[1] + 0.5, 0.06, 0.06], [m.at[0] + m.foot[0] - 0.06, m.at[1] + 0.5, 0.06, 0.06], [m.at[0] + 0.05, m.at[1] + 0.1, 0.3, 0.3]],
    glows: [glow("vV89", { r: 3, strength: 0.3 }), glow("QR", { r: 4, strength: 0.35 })],
    draw(p, m, f) {
      const [u0, v0] = m.at, [du, dv] = m.foot, D = 0.72, T = 0.05, TOP = D + T
      // under the desk: the modesty panel at the back, the battery and the inverter with its LED, cables
      p.box(u0 + 0.04, v0 + 0.03, 0.15, du - 0.08, 0.02, 0.52, () => "2", () => "1", () => "1")
      p.box(u0 + 0.05, v0 + 0.1, 0, 0.3, 0.3, 0.2, (lu, lv) => (Math.hypot(lu - 0.06, lv - 0.08) < 0.03 ? "q" : Math.hypot(lu - 0.22, lv - 0.08) < 0.03 ? "4" : "1"),
        (a, e, o) => (e === o.ah - 1 ? "2" : "1"), (a, e, o) => (e === o.ah - 1 ? "2" : e === 3 && a > 2 && a < o.aw - 3 ? "3" : "1"))
      p.box(u0 + 0.06, v0 + 0.14, 0.2, 0.26, 0.2, 0.1, () => "3", (a) => (a % 2 ? "2" : "3"),
        (a, e, o) => (e === 2 && a === 3 ? (f % 6 < 5 ? "!8" : "!0") : e === 2 && a === 5 ? "!Q" : e === o.ah - 1 ? "4" : "2"))
      const sag = (a, b, k, n = 12) => {                 // a cable from a to b (room meters), sagging
        const [x0, y0] = p.P(...a), [x1, y1] = p.P(...b), pts = []
        for (let i = 0; i <= n; i++) { const t = i / n; pts.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + k * 4 * t * (1 - t)]) }
        p.at((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, null)
        for (let i = 0; i < n; i++) p.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], "k")
        p.at(null)
      }
      sag([u0 + 0.35, v0 + 0.3, 0.2], [u0 + 0.6, v0 + 0.1, 0.7], 6)
      sag([u0 + 0.3, v0 + 0.4, 0.05], [u0 + du - 0.1, v0 + 0.1, 0.7], 10)
      sag([u0 + 1.0, v0 + 0.08, 0.7], [u0 + du - 0.05, v0 + 0.05, 0.3], 4)
      // the legs, then the top (a chipped edge)
      for (const [lu, lv] of [[0.02, 0.02], [du - 0.06, 0.02], [0.02, dv - 0.06], [du - 0.06, dv - 0.06]])
        p.box(u0 + lu, v0 + lv, 0, 0.04, 0.04, D, () => "4", () => "3", () => "2")
      p.box(u0, v0, D, du, dv, T, (lu, lv) => (lv > dv - 0.04 ? "5" : "4"), (a, e) => (e === 0 ? "2" : "3"),
        (a, e) => (e === 1 ? (a > 30 && a < 34 ? "3" : "5") : "3"))
      // the riser at the back, the screens on it
      const RH = 0.08
      p.box(u0 + 0.02, v0 + 0.02, TOP, du - 0.04, 0.3, RH, () => "3", () => "2", (a, e) => (e === 1 ? "4" : "2"))
      const R = TOP + RH
      // the waveform on the wall over the screens: his sender's level, running
      p.box(u0 + 0.5, v0, 1.28, 0.42, 0.03, 0.2, () => "2", () => "1",
        (a, e, o) => {
          if (a === 0 || a === o.aw - 1 || e === 0 || e === o.ah - 1) return "1"
          const mid = fl(o.ah / 2), amp = Math.round((o.ah / 2 - 1.5) * Math.abs(Math.sin((a + f * 2) * 0.9) * Math.sin((a + f) * 0.31)))
          if (Math.abs(e - mid) <= amp) return Math.abs(e - mid) === amp ? "!Q" : "!P"
          return e === mid ? "!O" : "!k"
        })
      // the CRT at the left: a grey case, a camera's view in phosphor green, its timestamp, a roll bar
      p.box(u0 + 0.06, v0 + 0.03, R, 0.4, 0.3, 0.36, (lu, lv) => (lu > 0.36 || lv > 0.26 ? "5" : "4"),
        (a, e, o) => (e === o.ah - 1 ? "5" : a > 1 && a < o.aw - 2 && e > 5 && e < 9 && a % 2 === 0 ? "2" : "3"),
        (a, e, o) => {
          const W = o.aw, H = o.ah
          if (a === 0 || a === W - 1 || e === 0 || e === H - 1) return "4"
          if (a === 1 || a === W - 2 || e === 1 || e === H - 2) return "2"
          const roll = ((e + f) % 12 + 12) % 12 === 0
          if (e === H - 3) return a % 3 === 0 ? "!8" : "!7"                                             // the timestamp
          if (a >= 4 && a <= 5 && e >= 3 && e <= 6) return e === 6 ? "!9" : "!8"                        // a figure in a doorway
          if (a >= 3 && a <= 6 && e >= 3 && e <= 8 && (a === 3 || a === 6 || e === 8)) return "!7"     // the doorway
          if (e === 2) return "!7"
          return roll ? "!7" : "!0"
        })
      // the wide screen: four cameras nobody knows any more, one gone to snow
      p.box(u0 + 0.62, v0 + 0.14, R, 0.2, 0.12, 0.02, () => "4", () => "2", () => "3")
      p.box(u0 + 0.7, v0 + 0.17, R, 0.04, 0.04, 0.1, () => "4", () => "2", () => "3")
      p.box(u0 + 0.46, v0 + 0.2, R + 0.08, 0.52, 0.03, 0.42, () => "2", () => "1",
        (a, e, o) => {
          const W = o.aw, H = o.ah
          if (a === 0 || a === W - 1 || e === 0 || e === H - 1) return "1"
          const mx = fl(W / 2), my = fl(H / 2)
          if (a === mx || e === my) return "!0"
          const qx = a < mx ? 0 : 1, qy = e < my ? 0 : 1, x = a - (qx ? mx + 1 : 1), y = e - (qy ? my + 1 : 1)
          const q = qx + qy * 2
          if (q === 1) return ih(a + f * 7, e * 3 + f) < 0.5 ? "!7" : "!0"                              // snow
          if (y === (qy ? H - my - 3 : my - 2) && x < 4) return "!8"                                    // the camera's number
          if (q === 0) return y < 3 ? "!0" : x % 5 === 2 ? "!7" : y === 3 ? "!8" : "!0"                 // a stairwell's rails
          if (q === 2) return y === 2 && ((x + f) % 9 < 2) ? "!9" : y < 2 ? "!7" : "!0"                 // a corridor, a light passing
          return x > 3 && x < 7 && y > 0 && y < 4 ? "!8" : y === 0 ? "!7" : "!0"                        // a door in a yard
        })
      // the narrow screen at the right: the board scrolling
      p.box(u0 + 1.02, v0 + 0.1, R, 0.2, 0.18, 0.4, () => "2", () => "1",
        (a, e, o) => {
          if (a === 0 || a === o.aw - 1 || e === 0 || e === o.ah - 1) return "1"
          const row = e + f
          if (row % 2 === 0) { const n = 1 + fl(ih(fl(row / 2) % 7, 5) * (o.aw - 3)); return a > 0 && a <= n ? (row % 8 === 0 ? "!9" : "!8") : "!0" }
          return "!0"
        })
      // the little mixer: four faders, the knobs over them, its level LEDs
      p.box(u0 + 0.08, v0 + 0.36, TOP, 0.34, 0.2, 0.04,
        (lu, lv) => {
          const i = fl((lu - 0.03) / 0.075)
          if (lu < 0.03 || lu > 0.31 || lv < 0.02 || lv > 0.18) return "2"
          const cu = 0.065 + i * 0.075
          if (lv < 0.06) return near(lu, cu, 0.015) ? "5" : "1"
          if (near(lu, cu, 0.008)) return Math.abs(lv - (0.1 + 0.03 * ((i * 3 + 1) % 3))) < 0.015 ? "H" : "k"
          return "1"
        }, () => "1", (a) => (a % 4 === 1 ? ((a + f) % 7 === 0 ? "!q" : "!8") : "2"))
      // the keyboard
      p.box(u0 + 0.52, v0 + 0.38, TOP, 0.44, 0.18, 0.03, (lu, lv) => {
        if (lu < 0.02 || lu > 0.42 || lv < 0.02 || lv > 0.16) return "2"
        if (fl(lu * 32) % 2 === 1 && fl(lv / 0.05) !== 2) return "2"
        return "4"
      }, () => "2", (a) => (a % 4 === 1 ? "3" : "2"))
      // a mug, a tea bag's string over its rim
      const [mx, my] = p.P(u0 + 1.08, v0 + 0.48, TOP)
      p.at(u0 + 1.08, v0 + 0.48, TOP + 0.06, null)
      p.grid(mx - 2, my - 5, [".hhh.", "hHHHh", "hHHHhh", "hHHHh.h", "hHHHhh", ".hhh."])
      p.px(mx, my - 6, "R")
      // his storm lantern at the right end: a wire cage, amber glass, the flame in it flickering
      const [lx, ly] = p.P(u0 + 1.28, v0 + 0.4, TOP)
      p.at(u0 + 1.28, v0 + 0.4, TOP + 0.12, null)
      const fk = f % 4 === 1 ? "!R" : "!W"
      p.grid(lx - 3, ly - 12, ["..444..", ".4...4.", "...4...", "..666..", ".6PQP6.", ".4QRQ4.", ".6Q@Q6.", ".4QRQ4.", ".6PQP6.", "..666..", ".44444.", "4555554", ".44444."],
        { P: "!P", Q: "!Q", R: "!R", "@": fk })
      // the microphone on its arm, clamped at the back right, swung over toward his place
      const c0 = p.P(u0 + 1.3, v0 + 0.06, R + 0.05), c1 = p.P(u0 + 1.18, v0 + 0.15, 1.32), c2 = p.P(u0 + 0.86, v0 + 0.5, 1.12)
      p.at(u0 + 1.0, v0 + 0.35, 1.25, null)
      p.line(c0[0], c0[1], c1[0], c1[1], "k"); p.line(c1[0], c1[1], c2[0], c2[1], "k")
      p.line(c0[0] + 1, c0[1], c1[0] + 1, c1[1], "3")
      p.px(c1[0], c1[1], "5")
      p.grid(c2[0] - 2, c2[1] - 2, [".kkk.", "k151k", "k151k", "k111k", "k111k", ".kkk.", "..k.."])
      p.grid(c2[0] - 6, c2[1] - 1, [".kk.", "k..k", "k..k", "k..k", ".kk."])
      p.at(null)
    },
  })

  // ---------------------------------------------------------------- the rack of senders
  // a steel rack of what he has built and found, stacked: at the foot a heavy power supply, over it the output stage with its valves
  // glowing behind a grille (the part Pike sent Juno for, from an old flood warning mast), the exciter showing his frequency 87.6 in
  // amber, two VU meters whose needles swing, a patch panel with its cords looping out, a modem's lights; the feeds go up from its top
  // to the antennas on the roof
  const RACK_NF = 12
  ISOKIT.prop("lv_rack", {
    frames: RACK_NF,
    glows: [glow("QR", { r: 3, strength: 0.35 })],
    draw(p, m, f) {
      const [u0, v0] = m.at, [du, dv] = m.foot, H = m.h
      const FREQ = ISOKIT.raster(13, 5, (c) => TXT.draw(c, 0, 0, "87.6", "x", { font: "hud" }))
      p.box(u0, v0, 0, du, dv, H,
        (lu, lv) => (lu < 0.03 || lv < 0.03 || lu > du - 0.03 || lv > dv - 0.03 ? "4" : (fl(lu * 30) + fl(lv * 30)) % 2 ? "1" : "2"),
        (a, e, o) => (a === o.aw - 1 || e === o.ah - 1 ? "4" : e % 6 === 3 && a > 1 && a < o.aw - 2 ? "1" : "3"),   // its side: vents
        (a, e, o) => {
          const W = o.aw, Hh = o.ah
          if (a === 0 || a === W - 1 || e === Hh - 1) return "4"                                         // the rails
          if (e <= 1) return "1"
          if (e <= 10) {                                                                                 // the power supply
            if (e === 10 || e === 2) return "2"
            if (a === 3 && (e === 6 || e === 7)) return e === 7 ? "6" : "5"                              // its switch
            if (a === W - 4 && e === 7) return "!q"
            return a > 5 && a < W - 2 && e % 2 === 0 ? "1" : "3"
          }
          if (e <= 18) {                                                                                 // the output stage
            if (e === 18 || e === 11) return "2"
            const valve = [3, 7, 11].find((x) => a === x || a === x + 1)
            if (valve !== undefined && e >= 13 && e <= 16) return e === 13 ? "!O" : e === 16 ? "!P" : (f + valve) % 5 === 0 && e === 14 ? "!R" : "!Q"
            return (a + e) % 2 ? "1" : "2"                                                              // the grille
          }
          if (e <= 25) {                                                                                 // the exciter: 87.6
            if (e === 25 || e === 19) return "2"
            if (a >= 1 && a < W - 1 && e >= 20 && e <= 24) { const k = FREQ(a - 1, e - 20); return k ? "!R" : "!O" }
            return "3"
          }
          if (e <= 32) {                                                                                 // the VU meter, its needle swinging
            if (e === 32 || e === 26 || a <= 1 || a >= W - 2) return "2"
            if (e === 27) return "3"
            const sw = Math.sin(f * 0.9) * 0.5 + Math.sin(f * 2.1) * 0.25, cx = (W - 1) / 2
            if (Math.abs(a - (cx + sw * (cx - 3) * ((e - 27) / 4))) < 0.6) return "k"
            if (e === 31) return a % 2 ? "!Q" : a > W - 5 ? "!q" : "!R"                                 // the scale, red at its end
            return "!R"
          }
          if (e <= 40) {                                                                                 // the patch panel, cords looping out
            if (e === 40 || e === 33) return "2"
            if ((e === 38 || e === 35) && a % 2 === 1) return "k"
            if (a === 4 && e < 38 && e > 33) return "C"
            if (a === 9 && e < 36) return "M"
            return "3"
          }
          if (e <= 46) {                                                                                 // a modem, its lights
            if (e === 46 || e === 41) return "2"
            if (e === 43 && a % 2 === 0 && a > 1 && a < W - 2) return (f + a) % 5 === 0 ? "!V" : (f + a) % 3 ? "!v" : "!c"
            return "1"
          }
          return e % 2 ? "2" : "1"                                                                       // empty slots
        })
      // the feeds up from its top to the roof
      for (const [cu, cv, dx] of [[0.12, 0.12, 0], [0.24, 0.2, 1], [0.36, 0.1, -1]]) {
        const [x0, y0] = p.P(u0 + cu, v0 + cv, H), [x1, y1] = p.P(u0 + cu, v0 + cv, 2.0)
        p.at(u0 + cu, v0 + cv, (H + 2) / 2, null)
        p.vline(x0 + dx, y1, y0 - y1, "k")
        p.at(null)
      }
    },
  })

  // ---------------------------------------------------------------- a door's sill, his fridge
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

  return {}
})()

// The kit pieces LUCKY STATIC needs (art/rooms/lucky_static.map.js), at the street scale (style guide §4: 16 units per meter of
// floor, 30 px per meter of height): registered with ISOKIT (art/lib/isokit.js), drawn in room meters, lit by the bake. Include
// after art/lib/iso.js (palette), art/lib/isomap.js, art/lib/isokit.js. A bar of the Lower Ninth, magenta and amber (style guide
// §5: nightlife is magenta, food and people amber): old tiles, a wooden counter worn pale where the arms lie, the bottles in front
// of a mirror, Nagi·wa's news, Mei's slate with the tabs, the noodle kitchen steaming. The city's text is English art (§8a).
//
//   floors   t  old 25 cm tiles in a checker, the grout, one gone, a crack, worn pale where people stand at the counter
//            b  duckboards behind the counter
//   walls    ls_wall  tongue-and-groove boards to the rail, the old striped paper above
//            ls_glass  the street window as a cut near wall (its glass in the section)
//   openings ls_hood (the kitchen's hood, its lamp, grease), ls_bottles (two shelves before a mirror), ls_tv (NAGI·WA's news:
//            凪輪 and its ticker), ls_slate (TABS: four rows of tallies, Juno's the long one), ls_wc (the toilet's door),
//            ls_poster (KARA/OKE NITE, on a wall where the machine is out of order)
//   props    ls_range (two stock pots steaming, the flames under them), ls_counter (the brass foot rail; on it the lucky cat
//            whose arm sticks, two glasses where the regulars sit), ls_stool, ls_karaoke (OUT OF ORDER taped on its screen,
//            the marquee stuttering, the microphone on its hook), ls_lamps (three shades over the counter), ls_mat, ls_sill
// Keys "!k" are never lit (screens, the marquee, the bulbs, flames). Small things are hand grids; the rest boxes and lines.
include("../lib/text.js")
include("../lib/kanji.js")

const KIT_LUCKY_STATIC = (() => {
  const fl = Math.floor, ih = ISO.ihash, NF = 12
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w

  // ---------------------------------------------------------------- floors
  // old tiles, 25 cm, a checker of two blues; the grout; one tile gone to the screed, a crack across another; pale where
  // everyone stands at the counter and in the way from the door
  ISOKIT.floor("t", (u, v) => {
    const T = 0.25, iu = fl(u / T), iv = fl(v / T), lu = u - iu * T, lv = v - iv * T
    if (lu < 0.022 || lv < 0.022) return "e"
    if (iu === 9 && iv === 13) return "1"                                  // a tile gone, the screed under it
    if (ih(iu + 3, iv + 11) > 0.95 && near(lu, lv, 0.014)) return "e"    // a crack, corner to corner
    const worn = (v > 1.75 && v < 2.5 && u > 1.5 && u < 4.4) || (u < 1.0 && v > 2.4)
    return (iu + iv) % 2 === 0 ? (worn ? "Z" : "z") : (worn ? "X" : "Z")
  })
  // behind the counter: duckboards along it, their gaps
  ISOKIT.floor("b", (u, v) => ((v % 0.125) < 0.03 ? "e" : near((u + (fl(v / 0.125) % 2) * 0.6) % 1.2, 0, 1 / 40) ? "e" : "f"))

  // ---------------------------------------------------------------- walls
  // boards to the rail at 1.0 m (their grooves, the kick of shoes at the bottom), the rail, the old striped paper above
  ISOKIT.wall("ls_wall", (s, h) => {
    if (h < 0.06) return "1"
    if (h < 1.0) {
      if (near(s % 0.14, 0, 1 / 64)) return "a"
      if (h < 0.16 && ih(fl(s * 32), fl(h * 30)) < 0.18) return "a"     // scuffed by shoes
      return "O"
    }
    if (h < 1.06) return h > 1.035 ? "Q" : "P"
    return near(s % 0.36, 0.18, 0.05) ? "3" : "2"
  })
  // the window in the cut: its frame on both sides, the glass between, lit by the sign outside, a mullion every 1.15 m
  ISOKIT.wall("ls_glass", { face: () => "3", stubTop: (s, d) => (d < 0.05 || d > 0.2 || near(s % 1.15, 0, 0.04) ? "5" : d < 0.1 ? "!N" : "!m") })

  // ---------------------------------------------------------------- openings
  // the kitchen's hood: brushed steel, a lip with its lamp under it, grease run down from the seam
  ISOKIT.opening("ls_hood", {
    paint(s, h, o) {
      o.memo.hood ??= ISOKIT.raster(o.aw, o.ah, (c) => {
        const W = o.aw, H = o.ah
        c.rect(3, 0, W - 6, H - 5, "5"); for (let x = 5; x < W - 5; x += 3) c.vline(x, 1, H - 8, "4")
        c.rect(0, H - 6, W, 6, "5"); c.hline(0, H - 6, W, "6"); c.hline(0, H - 1, W, "3"); c.hline(2, H - 3, W - 4, "!W")
        c.vline(fl(W / 2), 0, H - 6, "3"); c.vline(fl(W / 2) + 1, 3, 4, "O"); c.px(fl(W / 2) + 1, 7, "O")   // the seam, the grease
      }, 0, 0)
      return o.memo.hood(o.a, o.e)
    },
  })
  // two shelves of bottles before a mirror: amber whisky, magenta liqueur, cyan gin, dark wine, clear; a glint on each
  const BOTTLE = [["P", "Q"], ["M", "m"], ["C", "v"], ["O", "P"], ["5", "6"], ["P", "R"]]
  ISOKIT.opening("ls_bottles", {
    paint(s, h, o) {
      o.memo.bottles ??= ISOKIT.raster(o.aw, o.ah, (c) => {
        const W = o.aw, H = o.ah, mid = fl(H / 2)
        c.rect(0, 0, W, H, "1"); for (let x = -H; x < W; x += 9) c.line(x, H - 1, x + H, 0, "2")   // the mirror, its sheen
        for (const y of [mid - 1, H - 2]) { c.hline(0, y, W, "6"); c.hline(0, y + 1, W, "4") }
        for (const [base, row] of [[mid - 2, 0], [H - 3, 1]]) {
          for (let x = 1, i = 0; x < W - 3; i++) {
            const [b, g] = BOTTLE[fl(ih(i + row * 17, 5) * BOTTLE.length)], tall = 6 + fl(ih(i, row + 3) * 4), wide = ih(i, 9 + row) < 0.3 ? 3 : 2
            c.rect(x, base - tall + 3, wide, tall - 3, b); c.vline(x + (wide > 2 ? 1 : 0), base - tall, 3, b); c.px(x, base - tall + 4, g)
            x += wide + 1 + (ih(i, row) < 0.2 ? 1 : 0)
          }
        }
      }, 0, 0)
      return o.memo.bottles(o.a, o.e)
    },
  })
  // the TV over the bottles: NAGI·WA's news, its two characters, and the ticker running under them
  ISOKIT.opening("ls_tv", {
    paint(s, h, o) {
      o.memo.tv ??= ISOKIT.raster(o.aw, o.ah, (c) => {
        const W = o.aw, H = o.ah
        c.rect(0, 0, W, H, "1"); c.rect(1, 1, W - 2, H - 2, "!c")
        KANJI.draw(c, fl(W / 2) - 14, 1, "!v")
        c.hline(1, H - 4, W - 2, "!C"); for (let x = 1; x < W - 1; x++) if ((x + o.f * 2) % 5 < 3) c.px(x, H - 3, "!V")
        c.px(W - 3, 2, o.f % 6 < 3 ? "!V" : "!c")
      }, 0, 0)
      return o.memo.tv(o.a, o.e)
    },
  })
  // Mei's slate: TABS over four rows, a scrawled name and its tallies, fives struck through; the third row Juno's, the long one
  ISOKIT.opening("ls_slate", {
    paint(s, h, o) {
      o.memo.slate ??= ISOKIT.raster(o.aw, o.ah, (c) => {
        const W = o.aw, H = o.ah
        c.rect(0, 0, W, H, "P"); c.rect(1, 1, W - 2, H - 2, "1"); c.hline(1, H - 2, W - 2, "O")
        TXT.draw(c, fl(W / 2), 2, "TABS", "H", { font: "hud", align: "center" })
        ;[7, 3, 13, 5].forEach((n, r) => {
          const y = 9 + r * 5
          c.line(3, y + 2, 4, y, "h"); c.line(4, y, 6, y + 3, "h"); c.px(7, y + 1, "h")                        // the name, scrawled
          for (let i = 0; i < n; i++) {
            const x = 10 + fl(i / 5) * 10 + (i % 5) * 2
            if (i % 5 === 4) c.line(x - 9, y + 3, x - 1, y, "H"); else c.vline(x, y, 4, "H")
          }
        })
      }, 0, 0)
      return o.memo.slate(o.a, o.e)
    },
  })
  // the toilet's door: its plate, the handle, the bottom kicked
  ISOKIT.opening("ls_wc", {
    paint(s, h, o) {
      o.memo.wc ??= ISOKIT.raster(o.aw, o.ah, (c) => {
        const W = o.aw, H = o.ah
        c.rect(0, 0, W, H, "4"); c.vline(0, 0, H, "5"); c.vline(W - 1, 0, H, "3"); c.hline(0, 0, W, "5")
        c.rect(fl(W / 2) - 5, 14, 10, 7, "H"); TXT.draw(c, fl(W / 2), 15, "WC", "1", { font: "hud", align: "center" })
        c.rect(W - 5, fl(H / 2), 2, 2, "G"); for (let x = 2; x < W - 2; x += 3) c.px(x, H - 2 - (x % 2), "3")
      }, 0, 0)
      return o.memo.wc(o.a, o.e)
    },
  })
  // the poster by the door: KARAOKE NITE, a microphone, its tape; a wall away the machine is out of order
  ISOKIT.opening("ls_poster", {
    paint(s, h, o) {
      o.memo.poster ??= ISOKIT.raster(o.aw, o.ah, (c) => {
        const W = o.aw, H = o.ah
        c.rect(0, 0, W, H, "n"); c.rect(1, 1, W - 2, H - 2, "i")
        TXT.draw(c, fl(W / 2), 2, "KARA", "m", { font: "hud", align: "center" }); TXT.draw(c, fl(W / 2), 8, "OKE", "m", { font: "hud", align: "center" })
        c.grid(fl(W / 2) - 2, 14, [".MM.", "MmmM", ".MM.", ".PP.", ".PP."])
        TXT.draw(c, fl(W / 2), H - 7, "NITE", "Q", { font: "hud", align: "center" })
        c.rect(0, 0, 3, 2, "G"); c.rect(W - 3, 0, 3, 2, "G")
      }, 0, 0)
      return o.memo.poster(o.a, o.e)
    },
  })

  // ---------------------------------------------------------------- props
  // the noodle kitchen: a steel range, two stock pots on it (one lidded), their flames, the steam going up into the hood
  ISOKIT.prop("ls_range", {
    frames: NF,
    glows: [glow("Q", { r: 2, strength: 0.4 })],
    draw(pen, p, f) {
      const [u0, v0] = p.at, [du, dv] = p.foot, H = p.h
      pen.box(u0, v0, 0, du, dv, H, (lu, lv) => (lu < 0.03 || lv > dv - 0.03 ? "5" : "4"),
        (a, e, o) => (e < 2 ? "1" : e > o.ah - 3 ? "5" : a === 0 ? "4" : "3"),
        (a, e, o) => {
          if (e < 2) return "1"
          if (e > o.ah - 4) return e === o.ah - 4 ? "2" : "5"
          if (e === o.ah - 6 && a % 6 === 3) return "G"                                   // the knobs
          if (e >= 4 && e <= o.ah - 9 && a >= 3 && a <= o.aw - 4) return e === o.ah - 9 || a === 3 || a === o.aw - 4 ? "4" : "2"   // the oven door
          return "3"
        })
      for (const [k, lid] of [[0.12, false], [0.62, true]]) {
        const pu = u0 + k, pv = v0 + 0.12
        // the flame under the pot
        const [fx, fy] = pen.P(pu + 0.16, pv + 0.16, H)
        pen.at(pu + 0.16, pv + 0.16, H, "up")
        for (let i = -3; i <= 3; i++) pen.px(fx + i, fy, (i + f) % 3 === 0 ? "!R" : "!Q")
        pen.at(null)
        pen.box(pu, pv, H + 0.02, 0.32, 0.32, 0.26, (lu, lv) => (lid ? (near(lu, 0.16, 0.04) && near(lv, 0.16, 0.04) ? "4" : "6") : lu < 0.03 || lv < 0.03 || lu > 0.29 || lv > 0.29 ? "G" : "O"),
          (a, e, o) => (e === o.ah - 1 ? "G" : a === o.aw - 1 ? "4" : "5"), (a, e, o) => (e === o.ah - 1 ? "G" : a === 0 ? "6" : a % 4 === 1 ? "5" : "6"))
        // the steam: three wisps rising from the pot, each a loop of the 12 frames
        const [sx, sy] = pen.P(pu + 0.16, pv + 0.16, H + 0.3)
        pen.at(pu + 0.16, pv + 0.16, H + 0.6, null)
        for (let w = 0; w < 3; w++) {
          const t = ((f + w * 4) % NF) / NF, y = sy - 2 - fl(t * 16), x = sx - 3 + w * 3 + fl(Math.sin((t + w) * 6.3) * 1.5)
          if (t < 0.85) { pen.px(x, y, t < 0.5 ? "H" : "h"); if (t < 0.6) pen.px(x, y - 1, "h") }
        }
        pen.at(null)
      }
    },
  })
  // the counter: tongue-and-groove boards, a kick plate, the brass foot rail on its brackets; the top dark and lacquered, worn pale
  // where the arms lie; on it the lucky cat at the left end, its arm sticking now and then (the bar's name), and two glasses where
  // the regulars sit
  const CAT = [
    ["...W.W..", "..WWWWW.", "..WkWkW.", "..WWQWW.", ".mmmmmm.", "..WWWWW.", "..WQQWW.", "..WWWWW.", "..WWWWW."],
    ["....W.W.", "W..WWWWW", "WW.WkWkW", ".W.WWQWW", ".Wmmmmmm", "..WWWWW.", "..WQQWW.", "..WWWWW.", "..WWWWW."],
  ]
  ISOKIT.prop("ls_counter", {
    frames: NF,
    draw(pen, p, f) {
      const [u0, v0] = p.at, [du, dv] = p.foot, H = p.h, T = 0.06
      const boards = (a, e, o) => {
        if (e < 3) return e === 2 ? "P" : "a"                                               // the kick plate
        if (e >= o.ah - 1) return "P"
        return a % 3 === 0 ? "a" : "O"
      }
      pen.box(u0, v0 + 0.06, 0, du, dv - 0.06, H - T, () => "O", boards, boards)
      // the top, overhanging a little: lacquer, its lit front edge, the pale track where arms lie
      pen.box(u0 - 0.05, v0, H - T, du + 0.1, dv + 0.08, T,
        (lu, lv) => (lv > dv + 0.04 ? "Q" : lv > dv - 0.12 && lv < dv - 0.02 ? "P" : "O"), (a, e) => (e === 0 ? "a" : "P"), (a, e) => (e === 0 ? "a" : "P"))
      // the foot rail along the front at 0.2 m, on its brackets
      for (let k = 0.2; k < du; k += 0.8) pen.box(u0 + k, v0 + dv, 0.18, 0.04, 0.1, 0.04, () => "P", () => "O", () => "O")
      pen.box(u0 + 0.05, v0 + dv + 0.1, 0.18, du - 0.1, 0.04, 0.04, () => "R", () => "P", () => "Q")
      // the lucky cat at the left end, waving; its arm sticks on frames 5 to 7
      const [cx, cy] = pen.P(u0 + 0.12, v0 + 0.22, H)
      pen.at(u0 + 0.12, v0 + 0.22, H + 0.15, "v")
      const wave = f < 5 ? f % 2 : f < 8 ? 1 : f % 2
      pen.grid(cx - 4, cy - 9, CAT[wave])
      pen.at(null)
      // two glasses where the regulars sit: his full, hers half
      for (const [gu, full] of [[2.36, true], [3.0, false]]) {
        const [gx, gy] = pen.P(u0 + gu, v0 + dv - 0.12, H)
        pen.at(u0 + gu, v0 + dv - 0.12, H + 0.1, "v")
        pen.grid(gx - 1, gy - 5, full ? ["HHH", "RQR", "QQQ", "QQQ", "HHH"] : ["H.H", "H.H", "RQR", "QQQ", "HHH"])
        pen.at(null)
      }
    },
  })
  // a stool: the post, its foot ring, the round seat in magenta vinyl (its corners cut off), a highlight on it
  ISOKIT.prop("ls_stool", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      pen.box(u + du / 2 - 0.03, v + dv / 2 - 0.03, 0, 0.06, 0.06, H - 0.07, () => "6", () => "4", () => "6")
      pen.box(u + 0.04, v + 0.04, 0.22, du - 0.08, dv - 0.08, 0.02, () => "5", () => "4", () => "5")
      const cut = (lu, lv) => Math.hypot(lu - du / 2, lv - dv / 2) > du / 2 + 0.02
      pen.box(u, v, H - 0.07, du, dv, 0.07, (lu, lv) => (cut(lu, lv) ? null : near(lu, du * 0.35, 0.04) && near(lv, dv * 0.35, 0.04) ? "m" : "M"),
        (a, e, o) => (a < 1 || a > o.aw - 2 ? null : "n"), (a, e, o) => (a < 1 || a > o.aw - 2 ? null : "n"))
    },
  })
  // the karaoke machine: its marquee stuttering magenta, the screen dead with OUT OF ORDER taped over it, the buttons, the speaker,
  // the coin slot's amber; the microphone on its hook at the side, the song book on top
  ISOKIT.prop("ls_karaoke", {
    frames: NF,
    glows: [glow("m", { r: 4, strength: 0.4 })],
    draw(pen, p, f) {
      const [u0, v0] = p.at, [du, dv] = p.foot, H = p.h
      const lit = f % 7 !== 3
      const front = (a, e, o) => {
        const W = o.aw, top = o.ah
        if (a === 0 || a === W - 1) return "3"
        if (e >= top - 5) return e === top - 1 ? "3" : lit && a > 1 && a < W - 2 ? ((a + f) % 4 === 0 ? "!N" : "!m") : "n"
        if (e >= top - 22 && e < top - 7) {                                                 // the screen, the paper taped over it
          const se = top - 8 - e, sa = a - 2
          if (sa < 0 || sa > W - 5 || se > 13) return "1"
          if (se >= 3 && se <= 10 && sa >= 1 && sa <= W - 6) {
            if (se === 3 || se === 10) return "h"
            // the paper's two words, as marks (too small for letters at this size; Juno reads them)
            const row = se >= 4 && se <= 5 ? 6 : se >= 7 && se <= 8 ? 5 : 0
            return row && sa >= 2 && sa < 2 + row * 2 && (sa + se) % 2 === 0 ? "1" : "H"
          }
          return "!c"
        }
        if (e >= top - 28 && e < top - 23) return e === top - 26 && a % 4 === 2 ? (a % 8 === 2 ? "!v" : "!Q") : "4"
        if (e >= 6 && e < top - 30) return (a + e) % 2 === 0 ? "1" : "3"                        // the speaker
        if (e === 4 && a === fl(W / 2)) return "!Q"                                          // the coin slot
        return e < 3 ? "1" : "3"
      }
      pen.box(u0, v0, 0, du, dv, H, (lu) => (lu > du - 0.05 ? "4" : "3"), front, (a, e, o) => (e > o.ah - 6 ? "3" : a === o.aw - 1 ? "4" : "2"))
      // the microphone on its hook on the side, its cord looping down
      const [mx, my] = pen.P(u0 + 0.3, v0 + dv, 1.1)
      pen.at(u0 + 0.3, v0 + dv, 1.1, "v")
      pen.grid(mx - 1, my - 4, [".55.", "5665", ".44.", ".4..", ".4.."]); pen.line(mx, my + 1, mx - 2, my + 9, "k"); pen.line(mx - 2, my + 9, mx + 1, my + 13, "k")
      pen.at(null)
      // the song book on top, its pages swollen
      pen.box(u0 + 0.12, v0 + 0.15, H, 0.3, 0.22, 0.05, () => "M", () => "H", () => "n")
    },
  })
  // three shades hanging over the counter, their bulbs, the cords up into the dark
  ISOKIT.prop("ls_lamps", {
    outline: false, footprint: () => [], solid: () => [],
    draw(pen, p) {
      const [u0, v0] = p.at, [du] = p.foot
      for (let i = 0; i < 3; i++) {
        const u = u0 + (du / 2) * i, [x, y] = pen.P(u, v0, p.h)
        pen.at(u, v0, p.h + 0.2, null)
        pen.vline(x, y - 30, 25, "k")
        pen.grid(x - 5, y - 5, ["....kk....", "...kOOk...", "..kOPPOk..", ".kOPPQPOk.", "kOPPQQPPOk", "kkkkkkkkkk"])
        pen.hline(x - 2, y + 1, 4, "!W"); pen.hline(x - 1, y + 2, 2, "!R")
        pen.at(null)
      }
    },
  })
  // the mat inside the street door, ribbed rubber; the steel sill in the door's gap
  ISOKIT.prop("ls_mat", { footprint: () => [], draw(pen, p) { const [u, v] = p.at, [du, dv] = p.foot; pen.box(u, v, 0, du, dv, p.h, (lu, lv) => (lu < 0.04 || lu > du - 0.04 || lv < 0.04 || lv > dv - 0.04 ? "3" : fl(lu * 20) % 2 ? "2" : "1"), () => "2", () => "2") } })
  ISOKIT.prop("ls_sill", { footprint: () => [], draw(pen, p) { const [u, v] = p.at, [du, dv] = p.foot; pen.box(u, v, 0, du, dv, p.h, (lu) => (fl(lu * 24) % 2 ? "6" : "5"), () => "4", () => "4") } })

  return {}
})()

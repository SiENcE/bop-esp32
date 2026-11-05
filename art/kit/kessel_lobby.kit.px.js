// The kit pieces the Kessel Block's lobby needs (art/rooms/kessel_lobby.map.js), at the new scale (style guide
// §4): registered with ISOKIT (art/lib/isokit.js), drawn in room meters, lit by the bake. Include after
// art/lib/iso.js (palette), art/lib/isomap.js, art/lib/isokit.js.
//
//   floor    t  the old tiles (steel blue, a cracked one, one missing)    w  the same, wet: the rain walked
//            in from the door, footprints, a puddle (the bake's sheen mirrors the door's magenta in it)
//            m  the doormat
//   walls    lobby_steel  riveted steel panels to the dado, painted plaster above, the conduit under the
//            ceiling, rust run down from a rivet
//   openings poster_listens (Halcyon's ad: a sleeping face, SLEPT WELL? HALCYON LISTENS.), mailboxes (Juno's with the
//            rent notice), notice_board (flyers, a lost cat), street_door (glass, the street's magenta and
//            the rain beyond it, the push bar)
//   props    stairs_up (the flight up to the first floor along the right wall), wet_sign (a yellow A-frame, a
//            slipping figure), flyers (heaped under the mailboxes)
// The lift's doors are the whole block's: art/kit/kessel_lift.kit.px.js.
// The city's text is English art (style guide §8a); Juno says what it means in German.
include("../lib/text.js")

const KLOBBY = (() => {
  const fl = Math.floor, ih = ISO.ihash, near = (x, c, w = 1 / 64) => Math.abs(x - c) < w

  // ---------------------------------------------------------------- floors
  // tiles a third of a meter, grouted; one cracked across, one missing (the screed under it)
  const tile = (u, v) => {
    const q = 1 / 3, i = fl(u / q), j = fl(v / q)
    if (near(u % q, 0, 1 / 48) || near(v % q, 0, 1 / 48)) return "1"
    if (i === 9 && j === 6) return "e"                                          // the missing one
    if (i === 6 && j === 3 && near((u % q) - (v % q) * 0.6, 0.08, 1 / 50)) return "1"   // the cracked one
    return (i + j) % 2 ? "3" : "2"
  }
  ISOKIT.floor("t", tile)
  // wet: darker, shining in streaks; footprints in from the door; a puddle where the floor sags
  ISOKIT.floor("w", (u, v) => {
    const k = tile(u, v)
    if (k === "1" || k === "e") return k
    if (Math.hypot((u - 0.9) / 0.7, (v - 3.4) / 0.45) < 1) return "e"            // the puddle
    for (let s = 0; s < 6; s++) {                                               // footprints, door to stairs
      const fu = 0.7 + s * 0.45, fv = 3.3 - s * 0.32 + (s % 2) * 0.12
      if (Math.hypot((u - fu) / 0.06, (v - fv) / 0.1) < 1) return "1"
    }
    return k === "3" ? "z" : "f"
  })
  ISOKIT.floor("m", (u, v) => (near(u % 0.12, 0, 1 / 60) ? "O" : v > 3.85 || v < 2.7 ? "O" : "A"))

  // ---------------------------------------------------------------- walls
  ISOKIT.wall("lobby_steel", (s, h, o) => {
    if (h < 0.07) return "1"
    if (h > 2.55 && h < 2.62) return h > 2.6 ? "5" : "4"                        // the conduit's tray
    if (h < 1.25) {
      // riveted steel panels, 0.8 m each: their seams, a rivet row under the dado's lip
      if (near(h, 1.24, 1 / 60)) return "5"
      if (near(s % 0.8, 0, 1 / 60)) return "2"
      if (near(h, 1.15, 1 / 60) && near(s % 0.2, 0.1, 1 / 60)) return "6"
      if (near(h, 0.12, 1 / 60) && near(s % 0.2, 0.1, 1 / 60)) return "6"
      // rust run down from one rivet
      if (o.wall && o.wall.from[1] === o.wall.to[1] && near(s, 4.7, 1 / 50) && h < 1.15 && h > 0.6 - 0.2 * Math.sin(s * 20)) return "O"
      return "4"
    }
    // painted plaster: damp blooms under the ceiling
    const damp = Math.hypot((s - 1.6) / 0.6, (2.8 - h) / 0.35)
    if (damp < 1 && near(damp, 0.95, 0.04)) return "2"
    return "3"
  })

  // ---------------------------------------------------------------- Halcyon's poster
  ISOKIT.opening("poster_listens", {
    pad: 0.03,
    paint(s, h, o) {
      const { aw, ah } = o
      o.memo.poster ??= ISOKIT.raster(aw + 2, ah + 2, (c) => {
        const W = aw + 2, H = ah + 2
        c.rect(0, 0, W, H, "c"); c.rect(1, 1, W - 2, H - 2, "C")
        // a woman asleep, smiling, her cheek on a pillow; the ring logo over her
        c.rect(3, 4, W - 6, 15, "c")
        c.rect(6, 12, W - 12, 6, "H")                                                // the pillow
        c.ellipse(fl(W / 2), 11, 6, 5, "S"); c.rect(fl(W / 2) - 7, 6, 14, 3, "4")      // her face, her hair
        c.hline(fl(W / 2) - 4, 11, 3, "s"); c.hline(fl(W / 2) + 2, 11, 3, "s")        // the shut eyes
        c.hline(fl(W / 2) - 1, 14, 3, "s")                                           // the smile
        c.ellipse(W - 8, 7, 2, 2, "V"); c.ellipse(W - 8, 7, 1, 1, "C")               // the ring
        TXT.draw(c, 2, 22, "SLEPT WELL?", "V", { font: "hud" })
        TXT.draw(c, 2, 30, "HALCYON", "V", { font: "hud" })
        TXT.draw(c, W - 34, 37, "LISTENS.", "v", { font: "hud" })   // to the right: the flight hides its lower left corner
        c.rect(W - 6, H - 5, 4, 4, "c")                                              // a corner torn off
      }, -1, -1)
      return o.memo.poster(o.a, o.e)
    },
  })

  // ---------------------------------------------------------------- the mailboxes: Juno's with the notice
  ISOKIT.opening("mailboxes", {
    pad: 0.03,
    paint(s, h, o) {
      const { aw, ah } = o
      o.memo.boxes ??= ISOKIT.raster(aw + 2, ah + 2, (c) => {
        const W = aw + 2, H = ah + 2, cols = 5, rows = 5, bw = fl(W / cols), bh = fl(H / rows)
        c.rect(0, 0, W, H, "3")
        for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
          const x = i * bw + 1, y = j * bh + 1
          c.rect(x, y, bw - 1, bh - 1, "5"); c.hline(x, y, bw - 1, "6")
          c.hline(x + 2, y + 2, bw - 5, "1")                                         // the slot
          c.rect(x + 1, y + bh - 3, 3, 1, "H")                                       // the name label
          if (i === 3 && j === 1) { c.rect(x, y, bw - 1, bh - 1, "2"); c.vline(x, y, bh - 1, "6") }   // one hanging open
          if (i === 0 && j === 3) { c.rect(x + 2, y + 1, bw - 4, 2, "m"); c.rect(x + 3, y, 3, 1, "Q") } // stuffed with flyers
        }
        // 14B: the rent notice sticking out of the slot, its red edge
        const x = 1 * bw + 1, y = 2 * bh + 1
        c.rect(x + 1, y - 1, bw - 3, 4, "H"); c.hline(x + 1, y - 1, bw - 3, "q")
      }, -1, -1)
      return o.memo.boxes(o.a, o.e)
    },
  })

  // ---------------------------------------------------------------- the notice board
  ISOKIT.opening("notice_board", {
    pad: 0.03,
    paint(s, h, o) {
      const { aw, ah } = o
      o.memo.board ??= ISOKIT.raster(aw + 2, ah + 2, (c) => {
        const W = aw + 2, H = ah + 2
        c.rect(0, 0, W, H, "A"); c.rect(1, 1, W - 2, H - 2, "O")
        c.rect(2, 2, 6, 8, "H"); c.hline(3, 4, 4, "h"); c.hline(3, 6, 3, "h")           // a flyer
        c.rect(9, 3, 6, 6, "Q"); c.hline(10, 5, 4, "P")                                   // a yellow one
        // a lost cat: its photo, the tear-off tabs
        c.rect(3, 11, 10, 9, "H"); c.rect(5, 12, 5, 4, "1"); c.px(5, 12, "H"); c.px(9, 12, "H")
        for (let x = 3; x < 13; x += 2) c.vline(x, 18, 2, "h")
        for (const [x, y] of [[4, 2], [11, 3], [7, 11]]) c.px(x, y, "q")                    // pins
      }, -1, -1)
      return o.memo.board(o.a, o.e)
    },
  })

  // ---------------------------------------------------------------- the street door: glass, the street
  ISOKIT.opening("street_door", {
    pad: [0.08, 0, 0.08, 0.08],
    pass: (s, h, w, hh) => s > 0.08 && s < w - 0.08 && h > 0.15 && h < hh - 0.1,
    frames: 12,
    paint(s, h, o) {
      const { a, e, aw, ah, f } = o
      if (a < 0 || a >= aw || e >= ah) {
        if (a < -2 || a > aw + 1 || e > ah + 1) return null
        return a === -2 || a === aw + 1 || e === ah + 1 ? "4" : "5"
      }
      // the steel frame round the glass, the push bar, the kick plate
      if (a < 3 || a >= aw - 3 || e < 5 || e >= ah - 3) return e < 5 ? (e === 4 ? "5" : "4") : a === 0 || a === aw - 1 ? "6" : "5"
      if (e >= 30 && e <= 31) return e === 31 ? "6" : "4"
      // the glass: the street's magenta blurred behind it, the rain running down it
      const gx = a - 3, gy = ah - 3 - e
      const rain = (gx * 7 + fl(gy / 3) * 3 + f * 2) % 11 === 0 && ih(gx, fl(gy / 4)) < 0.5
      if (rain) return "!h"
      const glow = Math.hypot((gx - 10) / 9, (gy - 18) / 11)
      if (glow < 0.5) return f % 6 === 5 ? "!M" : "!m"
      if (glow < 0.9) return "!M"
      if (glow < 1.4) return "!n"
      return gy > 40 ? "!i" : "!u"
    },
  })

  // ---------------------------------------------------------------- props
  // the flight up: it rises along the right wall towards the back and ends where the landing's stairs begin on every floor
  // above (u 2.5, art/rooms/kessel_14.map.js). Concrete steps with a steel nosing and a worn stripe, a plain side, a rail
  // on the open side; drawn from the top down, each step in front of the one above it
  ISOKIT.prop("stairs_up", {
    footprint: (p) => [[p.at[0], p.at[1], p.foot[0], p.foot[1]]],
    draw(pen, p) {
      const [u0, v0] = p.at, L = p.foot[0], W = p.foot[1], H = p.h, n = p.steps, tread = L / n, rise = H / n
      for (let i = 0; i < n; i++) {
        const u = u0 + i * tread, h = H - i * rise
        pen.box(u, v0, 0, tread, W, h,
          (lu, lv) => (lu > tread - 0.05 ? "5" : near(lv, W * 0.62, 0.06) ? "2" : "3"),                 // the nosing, the worn path
          (a, e, o) => (e >= o.ah - 2 ? "4" : "2"),                                                      // the riser
          (a, e, o) => (e >= o.ah - 1 ? "4" : near((h - e / 30) % 0.8, 0, 1 / 40) ? "1" : "2"))          // the side, its panel seams
        // the rail on the open side: a post every third step, the handrail stepping with them
        // (near the top the floor above takes over: the rail must not stand out over the wall)
        if (h + 0.82 > 2.75) continue
        if (i % 3 === 0) pen.box(u + tread * 0.4, v0 + W - 0.03, h, 0.04, 0.04, 0.82, () => "6", () => "4", () => "5")
        pen.box(u, v0 + W - 0.04, h + 0.82, tread, 0.06, 0.05, () => "G", () => "5", () => "6")
      }
    },
  })
  // the wet-floor sign: a yellow A-frame, a figure slipping on it (no words)
  const SLIP = ["..k..", ".kk..", "..kkk", ".k.k.", "k...k", "kkkkk"]
  ISOKIT.prop("wet_sign", {
    draw(pen, p) {
      const [u0, v0] = p.at, du = p.foot[0], dv = p.foot[1], H = p.h
      const face = ISOKIT.first(ISOKIT.grid(SLIP, 2, 13), (a, e, o) => (e >= o.ah - 2 ? "j" : a === 0 || a === o.aw - 1 ? "j" : "y"))
      pen.box(u0, v0, 0, du, dv, H, () => "Y", (a, e, o) => (e >= o.ah - 2 ? "j" : "y"), face)
    },
  })
  // the flyers that fell from the stuffed box and every other: a drift of paper under the mailboxes
  ISOKIT.prop("flyers", {
    draw(pen, p) {
      const [u0, v0] = p.at, du = p.foot[0], dv = p.foot[1]
      const SHEETS = [[0.05, 0.05, 0.16, 0.12, "H"], [0.18, 0.2, 0.14, 0.11, "h"], [0.02, 0.32, 0.15, 0.1, "H"], [0.2, 0.42, 0.13, 0.1, "Q"], [0.1, 0.5, 0.12, 0.08, "h"]]
      pen.top(u0, v0, u0 + du, v0 + dv, 0.01, (lu, lv) => {
        for (const [a, b, w, d, k] of SHEETS) if (lu >= a && lu < a + w && lv >= b && lv < b + d) return k === "H" && near(lv, b + d / 2, 1 / 40) ? "h" : k
        return null
      })
    },
  })
  return {}
})()

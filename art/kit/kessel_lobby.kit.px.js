// The kit pieces the Kessel Block's lobby needs (art/rooms/kessel_lobby.map.js), at the new scale (style guide
// §4): registered with ISOKIT (art/lib/isokit.js), drawn in room meters, lit by the bake. Include after
// art/lib/iso.js (palette), art/lib/isomap.js, art/lib/isokit.js.
//
//   floor    t  the old tiles (steel blue, a cracked one, one missing)    w  the same, wet: the rain walked
//            in from the door, footprints, a puddle (the bake's sheen mirrors the door's magenta in it)
//            m  the doormat
//   walls    lobby_steel  riveted steel panels to the dado, painted plaster above, the conduit under the
//            ceiling, rust run down from a rivet
//   openings poster_listens (Nagi·wa's ad: a sleeping face, SLEPT WELL? NAGI·WA LISTENS.), mailboxes (Juno's with the
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

  // ---------------------------------------------------------------- Nagi·wa's poster
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
        TXT.draw(c, 2, 30, "NAGI·WA", "V", { font: "hud" })
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
      }
      // the rail on the open side: its posts, then one straight handrail over them, from the top of the flight to its foot,
      // pixel by pixel so that it stays a clean line
      const railH = (u) => H - ((u - u0) / L) * H + 0.82, V = v0 + W - 0.03
      for (let i = 0; i < n; i += 3) { const u = u0 + (i + 0.4) * tread; pen.box(u, V, H - i * rise, 0.04, 0.04, railH(u) - (H - i * rise), () => "6", () => "4", () => "5") }
      { const u = u0 + (n - 0.6) * tread; pen.box(u, V, rise, 0.04, 0.04, railH(u) - rise, () => "6", () => "4", () => "5") }
      const uA = u0 + 0.02, uB = u0 + L - 0.6 * tread, [, yA] = pen.P(uA, V, railH(uA)), [, yB] = pen.P(uB, V, railH(uB))
      for (let y = yA; y <= yB; y++) {
        const u = uA + ((y - yA) / Math.max(1, yB - yA)) * (uB - uA), [x] = pen.P(u, V, railH(u))
        pen.at(u, V, railH(u), "up"); pen.px(x, y, "G"); pen.px(x, y + 1, "5"); pen.px(x + 1, y + 1, "G"); pen.px(x + 1, y + 2, "5")
      }
    },
  })
  // the flight up with a turn (the user's decision of 10.11.2026: the straight flight's foot lay in the room's far corner): from the
  // floor it comes up along the right stub wall towards the back (-v), `lower` meters long, to a landing in the corner (`landing`:
  // its size), and from there on along the right back wall towards the back (-u) to the top at u0, where the landing's stairs begin
  // on every floor above (u 3.5, art/rooms/kessel_14.map.js). `at`/`foot` are the upper flight's; `steps` count both flights and
  // the landing's rise. Drawn from the top down, each step in front of the one above it
  ISOKIT.prop("stairs_up_turn", {
    footprint: (p) => [[p.at[0], p.at[1], p.foot[0], p.foot[1]], [p.at[0] + p.foot[0], p.at[1], p.landing[0], p.landing[1]],
      [p.at[0] + p.foot[0], p.at[1] + p.landing[1], p.landing[0], p.lower]],
    draw(pen, p) {
      const [u0, v0] = p.at, L = p.foot[0], W = p.foot[1], H = p.h, n = p.steps, rise = H / n
      const n1 = Math.round(n / 2), n2 = n - n1 - 1, t1 = L / n1, u1 = u0 + L, [LW, LD] = p.landing, HL = H - n1 * rise, v1 = v0 + LD, t2 = p.lower / n2
      const nosing = (lu, lv, t, across) => (lu > t - 0.05 ? "5" : near(lv, across, 0.06) ? "2" : "3")
      const seams = (h) => (a, e, o) => (e >= o.ah - 1 ? "4" : near((h - e / 30) % 0.8, 0, 1 / 40) ? "1" : "2")
      const riser = (a, e, o) => (e >= o.ah - 2 ? "4" : "2")
      // the upper flight, along the back wall: its risers face +u
      for (let i = 0; i < n1; i++) {
        const u = u0 + i * t1, h = H - i * rise
        pen.box(u, v0, 0, t1, W, h, (lu, lv) => nosing(lu, lv, t1, W * 0.62), riser, seams(h))
      }
      // the landing in the corner: its edge to the lower flight lit, the worn path turning on it
      pen.box(u1, v0, 0, LW, LD, HL, (lu, lv) => (lv > LD - 0.05 ? "5" : Math.hypot(lu - 0.25, lv - LD * 0.62) < 0.08 ? "2" : "3"), seams(HL), riser)
      // the lower flight, along the stub wall: its risers face +v
      for (let j = 0; j < n2; j++) {
        const v = v1 + j * t2, h = HL - (j + 1) * rise
        pen.box(u1, v, 0, LW, t2, h, (lu, lv) => nosing(lv, lu, t2, LW * 0.38), seams(h), riser)
      }
      // the rails on the open sides, posts and one straight handrail each, pixel by pixel so that it stays a clean line
      const post = (u, v, z, top) => pen.box(u, v, z, 0.04, 0.04, top - z, () => "6", () => "4", () => "5")
      const line = (A, B) => {
        const [, yA] = pen.P(...A), [, yB] = pen.P(...B)
        for (let y = yA; y <= yB; y++) {
          const k = (y - yA) / Math.max(1, yB - yA), q = [A[0] + k * (B[0] - A[0]), A[1] + k * (B[1] - A[1]), A[2] + k * (B[2] - A[2])], [x] = pen.P(...q)
          pen.at(q[0], q[1], q[2], "up"); pen.px(x, y, "G"); pen.px(x, y + 1, "5"); pen.px(x + 1, y + 1, "G"); pen.px(x + 1, y + 2, "5")
        }
      }
      const V = v0 + W - 0.03, rail1 = (u) => H - ((u - u0) / L) * (H - HL) + 0.82
      for (let i = 0; i < n1; i += 3) { const u = u0 + (i + 0.4) * t1; post(u, V, H - i * rise, rail1(u)) }
      post(u1 - 0.04, V, HL, HL + 0.82)
      line([u0 + 0.02, V, rail1(u0 + 0.02)], [u1 - 0.02, V, HL + 0.82])
      const U = u1 + 0.01, rail2 = (v) => HL - ((v - v1) / p.lower) * HL + 0.82
      post(U, v1 - 0.04, HL, HL + 0.82)
      for (let j = 2; j < n2; j += 3) { const v = v1 + (j + 0.4) * t2; post(U, v, HL - (j + 1) * rise, rail2(v)) }
      { const v = v1 + (n2 - 0.6) * t2; post(U, v, rise, rail2(v)) }
      line([U, v1 - 0.02, HL + 0.82], [U, v1 + p.lower - 0.6 * t2, rail2(v1 + p.lower - 0.6 * t2)])
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

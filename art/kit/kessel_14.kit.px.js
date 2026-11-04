// The kit pieces the 14th floor's landing needs (art/rooms/kessel_14.map.js), at the new scale (style guide
// §4: 16 units per meter of floor, 30 px per meter of height): registered with ISOKIT (art/lib/isokit.js),
// drawn in room meters, lit by the bake. Include after art/lib/iso.js (palette), art/lib/isomap.js,
// art/lib/isokit.js. The light here is the tube's: a green-grey family of its own (ISOKIT.TINT.green).
//
//   floor    c  concrete screed in slabs (joints, a crack, an oil drip under the bikes, gum)
//            l  lino laid in front of the doors, worn through to the concrete where everyone steps
//            carpet  Frau Haldane's (behind her door)
//   walls    concrete_green  the block's paint to the dado, bare shuttered concrete above (tie holes),
//            the cable tray under the ceiling, a spray tag by the stairs
//            wallpaper  Frau Haldane's (stripes, a framed picture)
//   openings door_14b (Juno's: steel, three locks, the plate, her own little camera over it), door_14c
//            (open: the frame, the plate beside it), note_war (two notes, no words: a scrawl and "??",
//            the answer with its arrow), neon_tube (its left end dying), sign_14 (stencilled)
//   stairs   stairs_concrete (treads with a steel nosing and a worn amber stripe; the dado follows the flight)
//   props    bin_bags, bikes, stair_rail, armchair (Frau Haldane asleep in it, the Lull light at her temple)
// Keys "!k" are never lit. Small organic things are hand grids; the rest boxes and lines.
include("../lib/text.js")

pal({
  b: "#16201f", B: "#1e2d29", d: "#2a3f37", D: "#3d5849", E: "#5f7f68", F: "#d4f7dc",   // concrete and paint in the tube's light
  p: "#b0588a", o: "#6e3060",                                                         // Frau Haldane's robe
})
ramps("bBdDEF", "op")

const K14 = (() => {
  const fl = Math.floor, ih = ISO.ihash, near = (x, c, w = 1 / 64) => Math.abs(x - c) < w
  // the tube's light, a step or two along the green family
  Object.assign(ISOKIT.TINT, { green: {
    1: ["b", "B"], 2: ["B", "d"], 3: ["d", "D"], 4: ["D", "D"], 5: ["D", "E"], 6: ["E", "E"],
    e: ["b", "B"], f: ["B", "d"], z: ["d", "D"], Z: ["D", "E"], X: ["E", "E"],
    b: ["B", "d"], B: ["d", "D"], d: ["D", "E"], D: ["E", "E"],
    g: ["g", "D"], G: ["G", "E"], h: ["h", "E"], H: ["H", "F"],
    a: ["a", "B"], A: ["A", "d"], O: ["O", "A"], c: ["c", "d"], C: ["C", "E"], u: ["u", "B"], U: ["U", "D"],
  } })
  Object.assign(ISOKIT.SHADE, { b: "1", B: "b", d: "B", D: "d", E: "D", p: "o", o: "i" })

  // ---------------------------------------------------------------- floors
  // screed poured in 1.5 m slabs: the joints, a crack across one, an oil drip under the bikes, gum
  const screed = (u, v) => {
    if (near(u % 1.5, 0, 1 / 40) || near(v % 1.5, 0, 1 / 40)) return "e"
    const cu = 2.1 + 0.25 * Math.sin(v * 5)                      // the crack, wandering across the middle slab
    if (v > 1.7 && v < 3.0 && near(u, cu + (v - 1.7) * 0.4, 1 / 45)) return "e"
    if (Math.hypot((u - 0.55) / 1.4, v - 3.45) < 0.16) return "f"            // oil, under the bikes
    if (ih(fl(u * 8), fl(v * 8)) < 0.01) return "Z"                         // gum, trodden flat
    return "z"
  }
  ISOKIT.floor("c", screed)
  // lino in front of the doors: a pattern of small squares, worn to the concrete where the feet go; the
  // threshold strip at Frau Haldane's door
  ISOKIT.floor("l", (u, v) => {
    if (v < 0.06 && u > 0.7 && u < 1.6) return "5"
    const wear = v < 1.2 ? Math.hypot((u - 1.15) / 0.5, (v - 0.35) / 0.45) : Math.hypot((u - 0.5) / 0.55, (v - 1.85) / 0.4)
    if (wear < 0.8 && ih(fl(u * 20), fl(v * 20)) < 1.1 - wear) return screed(u, v)
    if (near(u % 0.25, 0, 1 / 50) || near(v % 0.25, 0, 1 / 50)) return "a"
    return "A"
  })
  ISOKIT.floor("carpet", (u, v) => (near((u + v + 10) % 0.5, 0, 1 / 40) || near((u - v + 10) % 0.5, 0, 1 / 40) ? "O" : "a"))

  // ---------------------------------------------------------------- walls
  // the block's walls: the green paint to the dado (scuffed, a bike's tyre marks), bare shuttered concrete
  // above with the tie holes in their grid, the cable tray under the ceiling; by the stairs a spray tag
  const TAG = ["..mm...m..", ".m..m.mm..", ".m....m.m.", "..mm..m..m", "....m.m..m", ".mmm..m...", "........mm"]
  ISOKIT.wall("concrete_green", (s, h, o) => {
    const right = o.wall && o.wall.from[1] === o.wall.to[1]
    if (h < 0.06) return "1"                                                  // the skirting, black with dirt
    if (h > 2.24 && h < 2.32) return h > 2.29 ? "5" : "4"                    // the cable tray's lip
    if (h >= 2.32) return near(h, 2.36, 0.012) ? "1" : "2"                    // the cables in it, the slab's shadow
    if (h < 1.15) {
      if (near(h, 1.14, 1 / 50)) return "D"                                   // the dado's painted edge
      if (!right && s > 2.7 && s < 4.4 && h > 0.16 && h < 0.55 && near(h, 0.3 + 0.1 * Math.sin((s - 2.7) * 4), 0.015)) return "b"   // tyre marks
      if (ih(fl(s * 30), fl(h * 30)) < 0.004) return "D"                      // chips
      return "B"
    }
    // shuttered concrete: the boards' joints, the tie holes in a grid
    if (near(h, 1.75, 1 / 60) || near(s % 1.2, 0, 1 / 60)) return "1"
    if (near(s % 0.6, 0.3, 1 / 40) && (near(h, 1.45, 1 / 40) || near(h, 2.05, 1 / 40))) return "1"
    if (right && s > 3.35 && s < 3.7 && h > 1.25 && h < 1.5) {                 // the tag, by the stairs
      const k = TAG[fl((1.5 - h) * 28)]?.[fl((s - 3.35) * 28)]
      if (k === "m") return "M"
    }
    return "2"
  })
  ISOKIT.wall("wallpaper", (s, h) => {
    if (h < 0.08) return "O"
    if (s > 1.2 && s < 1.6 && h > 1.25 && h < 1.6) return s < 1.23 || s > 1.57 || h < 1.28 || h > 1.57 ? "P" : "c"   // a framed picture: the sea
    return fl(s * 8) % 2 ? "u" : "U"
  })

  // ---------------------------------------------------------------- doors
  ISOKIT.opening("door_14b", {
    pad: [0.08, 0, 0.08, 0.36],
    paint(s, h, o) {
      const { a, e, aw, ah, f } = o
      // over the door: her own little camera on the wall, watching the landing (its LED alive)
      if (e > ah + 2) {
        const cx = fl(aw / 2), ce = ah + 8
        if (e >= ce - 1 && e <= ce + 1 && a >= cx - 2 && a <= cx + 2) return a === cx - 2 && e === ce ? (f % 4 ? "!v" : "!c") : e === ce + 1 ? "5" : "4"
        if (e >= ce + 2 && e <= ce + 3 && a === cx + 1) return "1"
        return null
      }
      if (a < 0 || a >= aw || e >= ah) {
        if (a < -2 || a > aw + 1 || e > ah + 1) return null
        return a === -2 || a === aw + 1 || e === ah + 1 ? "4" : "5"
      }
      if (e === 0) return "!x"                                                 // the flat's light under the door
      o.memo.door ??= ISOKIT.raster(aw, ah, (c) => {
        const Y = (e) => ah - 1 - e
        c.rect(0, 0, aw, ah, "4")
        c.vline(0, 0, ah, "5"); c.hline(0, 0, aw, "5"); c.vline(aw - 1, 0, ah, "3")
        c.rect(3, Y(12), aw - 6, 10, "3"); c.hline(3, Y(12), aw - 6, "2")       // the kick plate, dented
        c.px(8, Y(6), "2"); c.px(9, Y(7), "2"); c.px(17, Y(5), "2")
        // the lever, three locks one over another (she added two), the peephole, the plate
        c.rect(3, Y(31), 2, 3, "g"); c.hline(3, Y(30), 5, "G"); c.hline(3, Y(29), 5, "g")
        for (const e0 of [26, 36, 42]) { c.rect(3, Y(e0), 3, 2, "g"); c.px(4, Y(e0 - 1), "1") }
        c.px(aw - 15, Y(50), "k"); c.px(aw - 16, Y(50), "6"); c.px(aw - 14, Y(50), "6")
        c.rect(aw - 19, Y(57), 11, 6, "6"); c.hline(aw - 19, Y(52), 11, "5")
        c.hline(aw - 17, Y(55), 2, "2"); c.hline(aw - 14, Y(55), 3, "2"); c.hline(aw - 10, Y(55), 2, "2")
        // a sticker: an eye, someone's joke (or hers)
        c.rect(aw - 8, Y(40), 4, 3, "H"); c.px(aw - 7, Y(39), "1"); c.px(aw - 6, Y(39), "1")
      }, 0, 0)
      return o.memo.door(a, e)
    },
  })
  // Frau Haldane's door stands open: only its frame here (the room shows inside it), its plate beside it
  ISOKIT.opening("door_14c", {
    pad: [0.08, 0, 0.42, 0.08],
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a >= aw + 4 && a <= aw + 12 && e >= 36 && e <= 41) {
        o.memo.plate ??= ISOKIT.raster(9, 6, (c) => { c.rect(0, 0, 9, 6, "6"); c.hline(0, 5, 9, "5"); c.hline(1, 2, 2, "2"); c.hline(4, 2, 2, "2"); c.hline(7, 2, 1, "2") }, 0, 0)
        return o.memo.plate(a - aw - 4, e - 36)
      }
      if (a >= aw + 5 && a <= aw + 6 && e >= 26 && e <= 28) return e === 28 ? "!q" : "4"   // the bell, its button
      if (a < 0 || a >= aw || e >= ah) {
        if (a < -2 || a > aw + 1 || e > ah + 1) return null
        return a === -2 || a === aw + 1 || e === ah + 1 ? "4" : "5"
      }
      return null
    },
  })

  // ---------------------------------------------------------------- the note war, the tube, the sign
  // 14C's note (big, angry, underlined twice, "??") and 14A's answer taped onto its corner with an arrow;
  // under them the corner of an older one. No words: the game reads them out when Juno looks.
  ISOKIT.opening("note_war", {
    pad: 0.04,
    paint(s, h, o) {
      o.memo.notes ??= ISOKIT.raster(o.aw + 2, o.ah + 2, (c) => {
        c.rect(14, 12, 9, 7, "5")                                              // an older one, torn
        c.rect(1, 1, 14, 11, "H"); c.hline(1, 11, 14, "h")                      // 14C's
        for (const [y, w] of [[3, 9], [5, 11], [7, 6]]) for (let x = 2; x < 2 + w; x++) c.px(x, y + (x % 3 === 0 ? 1 : 0), "1")
        c.grid(11, 2, ["11.11", "..1.1", ".1.1.", ".....", ".1.1."])              // ??
        c.hline(2, 9, 11, "1"); c.hline(3, 10, 9, "1")                          // underlined twice
        c.rect(7, 1, 3, 1, "G"); c.rect(1, 0, 2, 2, "G")                        // tape
        c.rect(10, 9, 11, 8, "R"); c.hline(10, 16, 11, "Q")                     // 14A's answer, on the corner
        c.line(11, 12, 15, 10, "1"); c.px(14, 10, "1"); c.px(15, 11, "1")      // the arrow at the question
        for (const [y, w] of [[12, 4], [14, 8]]) for (let x = 16 - (y === 14 ? 5 : 0); x < 16 - (y === 14 ? 5 : 0) + w; x++) c.px(x, y, "1")
        c.rect(19, 8, 2, 2, "G")
      }, -1, -1)
      return o.memo.notes(o.a, o.e)
    },
  })
  // the tube in its housing under the tray: its left end dying (dim on the frames its light stutters)
  ISOKIT.opening("neon_tube", {
    pad: [0.02, 0.03, 0.02, 0.03],
    halo: [{ color: "#c8f5d0", reach: 0.5, power: 1.4 }],
    paint(s, h, o) {
      const { a, e, aw, ah, f } = o
      if (a < -1 || a > aw) return null
      if (e < 0 || e >= ah) return e < 0 ? "4" : "5"                             // the housing
      if (a <= 1 || a >= aw - 2) return "!6"                                     // the end caps
      if (a < 24 && [3, 4, 9].includes(f)) return a < 8 ? "!D" : "!E"
      if (a < 6) return "!E"                                                     // blackened at its end
      return "!F"
    },
  })
  // the floor's number, stencilled on the wall by the stairs, an arrow down
  const DIG = {
    1: ["..##", ".###", "..##", "..##", "..##", "..##", ".####"],
    4: ["##.##", "##.##", "##.##", "#####", "...##", "...##", "...##"],
  }
  ISOKIT.opening("sign_14", {
    paint(s, h, o) {
      o.memo.sign ??= ISOKIT.raster(o.aw, o.ah, (c) => {
        c.grid(1, 1, DIG[1], { "#": "6" }); c.grid(7, 1, DIG[4], { "#": "6" })
        c.grid(5, 9, ["#.#", ".#."], { "#": "5" })
      }, 0, 0)
      return o.memo.sign(o.a, o.e)
    },
  })

  // ---------------------------------------------------------------- the stairs
  ISOKIT.stairs("stairs_concrete", {
    tread: (lu, lv, i) => (lu < 0.035 ? "5" : lu < 0.08 ? (lv > 0.15 && lv < 0.85 && (lv * 10) % 1 < 0.75 ? "j" : "z") : lv > 0.3 && lv < 0.7 ? "Z" : "z"),
    riser: (a, e) => (e >= 4 ? "2" : "1"),
    // the dado's paint follows the flight down
    well: (s, h) => (h < -s * 0.6 + 1.14 - 2.2 ? "B" : near(h, -s * 0.6 + 1.14 - 2.2, 0.02) ? "D" : "2"),
  })

  // ---------------------------------------------------------------- props
  // three bags of rubbish against the near wall, one split: a noodle cup, a takeaway box
  ISOKIT.prop("bin_bags", {
    // bin bags are lumps, not balls: each a hand grid, its neck twisted and tied with the two ears of the
    // knot up, slumped wider at the foot, the black plastic's shine in short creases
    draw(pen, p) {
      const [u0, v0] = p.at
      const BAG_TALL = [
        ".....3...3......",
        ".....33.33......",
        "......333.......",
        "......232.......",
        ".....22322......",
        "....2222252.....",
        "...222222522....",
        "..22222225222...",
        ".2222222522222..",
        ".22222252222252.",
        "222222522222522.",
        "2222252222252222",
        "2222522222522221",
        "2222222225222221",
        "2222222222222221",
        "1222222222222211",
        "1122222222222111",
        ".11111111111111.",
      ]
      const BAG_LOW = [
        ".......3..3.......",
        ".......3333.......",
        "........33........",
        "......223222......",
        "....2222222252....",
        "..222252222225222.",
        ".22225222222252222",
        "222252222222522222",
        "222222222225222221",
        "222222222222222221",
        "122222222222222211",
        ".11111111111111111",
      ]
      const BAG_TORN = [
        "....3.3......",
        "....333......",
        "...22322.....",
        "..2225222....",
        ".22252222....",
        "2225222.H22..",
        "222222.hHh21.",
        "222222.hh.221",
        "1222221...21.",
        ".1111111111..",
      ]
      const put = (u, v, h, rows) => {
        const [x, y] = pen.P(u, v, 0)
        pen.at(u, v, h, "v")
        pen.grid(x - fl(rows[0].length / 2), y - rows.length + 1, rows)
      }
      put(u0 + 0.25, v0 + 0.2, 0.6, BAG_TALL)
      put(u0 + 0.7, v0 + 0.3, 0.35, BAG_TORN)
      put(u0 + 0.4, v0 + 0.55, 0.4, BAG_LOW)
      // what spilled from the torn one: a noodle cup on its side, a takeaway box
      const [x, y] = pen.P(u0 + 0.85, v0 + 0.55, 0)
      pen.at(u0 + 0.85, v0 + 0.55, 0.05, "up")
      pen.grid(x - 3, y - 2, ["HHh.hh", "Hhh.hQ"])
    },
  })
  // two bikes leaning on the wall, one behind the other: their wheels, the frames, a lock through both
  ISOKIT.prop("bikes", {
    solid: (p) => [[p.at[0], p.at[1], 0, p.foot[0], p.foot[1], 0.7]],
    draw(pen, p) {
      const [u0, v0] = p.at
      const bike = (u, vb, frame, light) => {
        const R = 0.31, vf = vb + 1.0, P = (v, h) => pen.P(u, v, h)
        const ring = (vc, k, r) => { for (let t = 0; t < 72; t++) { const th = t / 72 * Math.PI * 2, v = vc + r * Math.cos(th), h = R + r * Math.sin(th); pen.at(u, v, h, "u"); const [x, y] = P(v, h); pen.px(x, y, k) } }
        for (const vc of [vb, vf]) { ring(vc, "k", R); ring(vc, "1", R - 0.025); ring(vc, "4", R - 0.06); pen.at(u, vc, R, "u"); const [x, y] = P(vc, R); pen.px(x, y, "5") }
        const line = (a, b, k) => { pen.at(u, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, "u"); const [x0, y0] = P(...a), [x1, y1] = P(...b); pen.line(x0, y0, x1, y1, k) }
        const BB = [vb + 0.45, 0.3], SEAT = [vb + 0.3, 0.85], HEAD = [vf - 0.22, 0.8], HB = [vf - 0.27, 1.0]
        line([vb, R], BB, frame); line([vb, R], SEAT, frame); line(BB, SEAT, frame); line(BB, HEAD, frame); line(SEAT, HEAD, light); line(HEAD, [vf, R], frame)
        line(HEAD, HB, "5"); line([SEAT[0] - 0.03, SEAT[1]], [SEAT[0] + 0.03, SEAT[1] + 0.12], "5")
        pen.at(u, SEAT[0], 0.98, "up"); { const [x, y] = P(SEAT[0], 0.98); pen.hline(x - 3, y, 6, "1"); pen.hline(x - 2, y - 1, 4, "2") }
        // the bars, across toward us
        pen.at(u + 0.2, HB[0], HB[1], "up"); { const [x0, y0] = pen.P(u - 0.2, HB[0], HB[1]), [x1, y1] = pen.P(u + 0.22, HB[0], HB[1]); pen.line(x0, y0, x1, y1, "6"); pen.px(x1, y1, "1"); pen.px(x1 - 1, y1, "1") }
      }
      bike(u0 + 0.12, v0 + 0.08, "c", "C")
      bike(u0 + 0.32, v0 + 0.45, "O", "P")
      // the chain lock through both front wheels and the pipe
      const [x, y] = pen.P(u0 + 0.25, v0 + 1.32, 0.25); pen.at(u0 + 0.25, v0 + 1.32, 0.25, "u")
      pen.line(x - 4, y - 1, x + 5, y + 3, "g"); pen.rect(x + 4, y + 2, 2, 3, "G")
    },
  })
  // the rail along the stairwell's open side: posts, the handrail, the newel at the top step
  ISOKIT.prop("stair_rail", {
    solid: (p) => [[p.at[0], p.at[1], p.h - 0.06, p.foot[0], p.foot[1], 0.06]],
    footprint: (p) => [[p.at[0], p.at[1], 0.06, p.foot[1]]],
    draw(pen, p) {
      const [u0, v0] = p.at, L = p.foot[0], H = p.h
      const post = (u, w, k) => pen.box(u, v0, 0, w, 0.05, H - 0.04, () => "6", () => k, () => "5")
      post(u0, 0.07, "4")
      for (let u = u0 + 0.5; u < u0 + L; u += 0.5) post(u, 0.04, "4")
      pen.box(u0, v0 - 0.01, H - 0.05, L + 0.3, 0.07, 0.06, () => "G", () => "5", () => "6")
      pen.box(u0, v0 - 0.01, 0.1, L + 0.3, 0.05, 0.03, () => "5", () => "4", () => "4")
    },
  })
  // Frau Haldane asleep in front of her TV (deeper in the room, out of sight: only its light), seen from
  // behind: the armchair's back toward the door, over it her grey hair in curlers, fallen a little to one
  // side, the Lull light's blue at her temple; her arm hanging over the armrest, a slipper fallen off
  ISOKIT.prop("armchair", {
    frames: 12,
    draw(pen, p, f) {
      const [u0, v0] = p.at, du = p.foot[0], dv = p.foot[1], back = v0 + dv - 0.16
      pen.box(u0, v0, 0, du, dv - 0.16, 0.42, () => "u", () => "u", () => "u")                       // the seat
      // her head, drawn before the back, which hides it below the ears; greys that stay grey in the TV's
      // light (no glow), the curlers in a row of bumps on top
      const [hx, hy] = pen.P(u0 + du * 0.58, back - 0.1, 1.0)
      pen.at(u0 + du * 0.58, back - 0.1, 1.02, "up")
      pen.grid(hx - 3, hy - 3, [".G.G.G.", "GgGgGgG", "gGgGgGg", "1ggggg1", ".1ggg1s", "..111.."])
      pen.box(u0, back, 0, du, 0.16, 0.92, () => "U", () => "u", () => "u")                         // the back
      pen.box(u0, back, 0.92, 0.14, 0.16, 0.14, () => "U", () => "u", () => "u")                     // the wings
      pen.box(u0 + du - 0.14, back, 0.92, 0.14, 0.16, 0.14, () => "U", () => "u", () => "u")
      pen.box(u0 + du - 0.12, v0, 0, 0.12, dv - 0.16, 0.6, () => "U", () => "u", () => "u")          // the near arm
      // her arm over it, the hand hanging down its side
      const [ax, ay] = pen.P(u0 + du, v0 + dv * 0.45, 0.62)
      pen.at(u0 + du, v0 + dv * 0.45, 0.55, "u")
      pen.grid(ax - 2, ay - 1, ["ppp", ".pS", "..S", "..S"])
      // the slipper, fallen off
      const [sx, sy] = pen.P(u0 + du + 0.18, v0 + dv * 0.3, 0)
      pen.at(u0 + du + 0.18, v0 + dv * 0.3, 0.03, "up")
      pen.grid(sx - 2, sy - 1, ["NNM", ".MM"])
      pen.px(hx + 3, hy + 1, f % 6 < 3 ? "!C" : "!c")                                                // the Lull light
    },
  })
  return {}
})()

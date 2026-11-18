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
//   props    emergency_key (the lift's, on the wall), corner_cam (Nagi·wa's, on its arm, its red eye; `face: "v"` looks out of a right-hand wall), bin_bags, stair_rail, armchair (Frau Haldane asleep in it, seen from the side, her curlers, the Lull patch behind her ear),
//            armchair_empty (the same chair, the same place, nobody in it: while she walks in CAM 14)
// Keys "!k" are never lit. Small organic things are hand grids; the rest boxes and lines.
include("../lib/text.js")

pal({
  b: "#16201f", B: "#1e2d29", d: "#2a3f37", D: "#3d5849", E: "#5f7f68", F: "#d4f7dc",   // concrete and paint in the tube's light
  p: "#a84c80", o: "#642c50",                                                         // Frau Haldane's robe: her pink (art/characters/haldane.px.js's P, q)
  7: "#7aa8c8", 8: "#b8688c", 9: "#d8cca8",                                           // her curlers (blue, pink, cream), as hers there
  "~": "#cfe6ff", "^": "#6ab4ff",                                                     // Lull's point, bright and dim
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
  // NINTH LIVE in neon (approved as a block on 10.11.2026, painted): a dark steel board screwed to the wall, its rim catching the
  // light; the letters bent tube, a pale core in a coloured glow, NINTH in magenta, LIVE in cyan under it with the red dot of a live
  // feed that blinks; the H of NINTH stutters on the frame its light drops out (the map's lamp "ninth", off: [5])
  ISOKIT.opening("neon_ninth", {
    pad: 0.03,
    halo: [{ color: "#ff4fd3", reach: 0.45, power: 1.2 }],
    paint(s, h, o) {
      const { aw, ah, f } = o, W = aw + 2, H = ah + 2, mid = Math.floor(W / 2)
      o.memo.ninth ??= ISOKIT.raster(W, H, (c) => {
        c.rect(0, 0, W, H, "2"); c.hline(1, 0, W - 2, "4"); c.rect(1, 1, W - 2, H - 2, "1")
        for (const [x, y] of [[1, 1], [W - 2, 1], [1, H - 2], [W - 2, H - 2]]) c.px(x, y, "5")             // its screws
        // the glow the tubes throw on the board behind them, dithered off
        for (let y = 2; y < H - 2; y++) for (let x = 2; x < W - 2; x++) if ((x + y) % 2 === 0) c.px(x, y, y < 9 ? "n" : "c")
        TXT.draw(c, mid, 2, "NINTH", "!N", { font: "hud", align: "center", outline: "!M" })
        TXT.draw(c, mid + 3, 10, "LIVE", "!V", { font: "hud", align: "center", outline: "!C" })
        const dx = mid - TXT.measure("LIVE", "hud") / 2 + 3 - 5
        c.rect(dx, 11, 3, 3, "!r"); c.px(dx + 1, 12, "!q")                                            // the live dot
      }, -1, -1)
      const k = o.memo.ninth(o.a, o.e)
      if (!k) return k
      // the H stutters: its tube dark on the frame its light drops out
      const hx = mid + TXT.measure("NINTH", "hud") / 2 - TXT.measure("H", "hud") - 1, a = o.a + 1, y = H - 1 - (o.e + 1)
      if (f === 5 && y <= 8 && a >= hx - 1 && a <= hx + TXT.measure("H", "hud") + 1 && (k === "!N" || k === "!M")) return k === "!N" ? "M" : "n"
      // the dot blinks: dark on the loop's last three frames
      if (f >= 9 && (k === "!r" || k === "!q")) return "r"
      return k
    },
  })
  // the sign's cable, taped down the wall to a socket near the floor
  ISOKIT.opening("neon_cable", {
    paint(s, h, o) {
      const { a, e, aw } = o
      if (e < 4) return a >= 0 && a < aw ? (e === 3 ? "5" : e === 0 ? "2" : "4") : null                    // the socket
      if (a === 1) return e % 9 === 4 ? "6" : "k"                                                        // the cable, its tape
      return null
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
  // the rail along the stairwell's open side and back to the wall at its far end (posts, the handrail, a
  // kick bar); its top section by the first step is broken off, only a stub post left (`stub`: where)
  ISOKIT.prop("stair_rail", {
    solid: (p) => [[p.at[0], p.at[1], p.h - 0.06, p.foot[0], p.foot[1], 0.06]],
    footprint: (p) => (p.along === "v" ? [[p.at[0], p.at[1], 0.06, p.foot[1]]] : [[p.at[0], p.at[1], 0.06, p.foot[1]], [p.at[0] + p.foot[0] - 0.06, 0, 0.06, p.at[1]]]),
    draw(pen, p) {
      // along: "v" (the Wohnblock Lerche's landing): the same rail run along v at u = at[0], over a well whose deep end is a wall, so no return
      if (p.along === "v") {
        const [U, va] = p.at, L = p.foot[1], H = p.h, vb = va + L
        const postV = (v, w) => pen.box(U, v, 0, 0.05, w, H - 0.04, () => "6", () => "5", () => "4")
        postV(va, 0.06)
        for (let v = va + 0.5; v < vb - 0.1; v += 0.5) postV(v, 0.04)
        postV(vb - 0.06, 0.06)
        pen.box(U - 0.01, va, H - 0.05, 0.07, L, 0.06, () => "G", () => "6", () => "5")
        pen.box(U, va, 0.1, 0.05, L, 0.03, () => "5", () => "4", () => "4")
        return
      }
      const [u0, v0] = p.at, L = p.foot[0], H = p.h, u1 = u0 + L
      const postU = (u, w) => pen.box(u, v0, 0, w, 0.05, H - 0.04, () => "6", () => "4", () => "5")
      // the return to the wall at the far end (behind the front run, so drawn first)
      for (const v of [0.05, v0 / 2]) pen.box(u1 - 0.05, v, 0, 0.05, 0.05, H - 0.04, () => "6", () => "4", () => "5")
      pen.box(u1 - 0.06, 0, H - 0.05, 0.07, v0 + 0.06, 0.06, () => "G", () => "5", () => "6")
      pen.box(u1 - 0.05, 0, 0.1, 0.05, v0 + 0.05, 0.03, () => "5", () => "4", () => "4")
      // the front run
      postU(u0, 0.06)
      for (let u = u0 + 0.5; u < u1 - 0.1; u += 0.5) postU(u, 0.04)
      postU(u1 - 0.06, 0.06)
      pen.box(u0, v0 - 0.01, H - 0.05, L, 0.07, 0.06, () => "G", () => "5", () => "6")
      pen.box(u0, v0 - 0.01, 0.1, L, 0.05, 0.03, () => "5", () => "4", () => "4")
      // the stub of the broken top section, its bent end, the bolts of its plate
      if (p.stub != null) {
        pen.box(p.stub, v0, 0, 0.06, 0.05, 0.32, () => "5", () => "4", () => "5")
        const [x, y] = pen.P(p.stub + 0.06, v0 + 0.05, 0.32); pen.at(p.stub + 0.06, v0 + 0.05, 0.34, "up")
        pen.px(x - 1, y - 1, "6"); pen.px(x, y - 2, "5")
        pen.box(p.stub - 0.03, v0 - 0.02, 0, 0.12, 0.09, 0.01, () => "4", () => "3", () => "3")
      }
    },
  })
  // a bench someone carried up and left by the stairs: three worn slats on a steel frame, a tag scratched
  // into the front slat, gum under it
  ISOKIT.prop("bench", {
    solid: (p) => [[p.at[0], p.at[1], p.h - 0.06, p.foot[0], p.foot[1], 0.06]],
    footprint: (p) => [[p.at[0] + 0.05, p.at[1] + 0.05, 0.06, p.foot[1] - 0.1], [p.at[0] + p.foot[0] - 0.11, p.at[1] + 0.05, 0.06, p.foot[1] - 0.1]],
    draw(pen, p) {
      const [u0, v0] = p.at, L = p.foot[0], D = p.foot[1], H = p.h
      // the legs: a steel U at each end, a stretcher between them
      for (const u of [u0 + 0.05, u0 + L - 0.11]) {
        pen.box(u, v0 + 0.05, 0, 0.06, 0.05, H - 0.06, () => "5", () => "4", () => "5")
        pen.box(u, v0 + D - 0.1, 0, 0.06, 0.05, H - 0.06, () => "5", () => "4", () => "5")
      }
      pen.box(u0 + 0.05, v0 + D / 2 - 0.02, 0.12, L - 0.1, 0.04, 0.04, () => "4", () => "3", () => "3")
      // the slats, their gaps; the front one scratched
      for (let i = 0; i < 3; i++) {
        const v = v0 + i * (D / 3), front = i === 2
        pen.box(u0, v + 0.01, H - 0.06, L, D / 3 - 0.03, 0.06, (lu) => (front && lu > 0.4 && lu < 0.62 && fl(lu * 60) % 3 === 0 ? "O" : "P"), () => "O", () => (front ? "O" : "A"))
      }
    },
  })
  // Frau Haldane asleep in front of her TV (deeper in the room, out of sight: only its light), seen from
  // behind: the armchair's back toward the door, over it her grey hair in curlers, fallen a little to one
  // side, the Lull point's blue behind her ear; her arm hanging over the armrest, a slipper fallen off
  // Nagi·wa's camera up in the corner: an arm from the ceiling's edge, the housing along the wall, its lens at the end towards the
  // landing, the red eye blinking on its side; `dark: true` the same camera with its eye out (Chapter 2's third evening: the Quiet is in
  // the house, kapitel2-design §4)
  ISOKIT.prop("corner_cam", {
    frames: 12,
    footprint: () => [],
    draw(pen, p, f) {
      const [u0, v0] = p.at, L = p.foot[0], W = p.foot[1], H = p.h, h0 = H - 0.34
      pen.box(u0 + 0.04, v0 + 0.04, h0 + 0.16, 0.1, 0.1, H - h0 - 0.16, () => "6", () => "4", () => "5")   // the arm
      // the lens on the face it looks out of: +u (toward the lower right), or +v (`face: "v"`, out of a right-hand wall)
      const lens = (/** @type {number} */ a, /** @type {number} */ e, /** @type {any} */ o) => (a >= 2 && a < o.aw - 1 && e >= 1 && e < o.ah - 1 ? (a === 3 && e === 2 ? "!v" : "k") : "4")
      const eye = p.dark ? "5" : f % 6 < 2 ? "!q" : "!r"
      const side = (/** @type {number} */ a, /** @type {number} */ e, /** @type {any} */ o) => (a === o.aw - 4 && e === 2 ? eye : e === 0 ? "3" : e >= o.ah - 1 ? "6" : "5")
      if (p.face === "v") pen.box(u0, v0, h0, L, W, 0.17, () => "G", side, lens)
      else pen.box(u0, v0, h0, L, W, 0.17, () => "G", lens, side)
    },
  })
  // the lift's emergency key on the wall: a steel clip with its screw, an amber grip worn pale at the top, a long rod with
  // the tube's light down its left side and its shadow on the wall, the hook at its foot
  ISOKIT.prop("emergency_key", {
    footprint: () => [],
    draw(pen, p) {
      const [hx, hy] = pen.P(p.at[0], p.at[1], p.h)
      pen.at(p.at[0], p.at[1], p.h, "up")
      const rod = Array(33).fill("....64b")
      pen.grid(hx - 3, hy, [
        "..4664.", "..4G64.", "..kkkkb",
        "..RQQPb", "..QQQPb", "..QQPPb", "..QPPOb", "..kkkkb",
        ...rod,
        "6...64b", "64..64b", ".64.64b", "..644b.", "...bb..",
      ])
    },
  })
  // its back against the lift's shaft (-u), she faces +u toward her TV, out of sight right of the door: through the door
  // one sees her from the side, her head against the back, the Lull patch behind her ear
  /** the armchair alone: the back, its wings, the far arm, the seat; the near arm after (it stands in front of her) */
  const chair = (pen, p) => {
    const [u0, v0] = p.at, du = p.foot[0], dv = p.foot[1], B = 0.16, A = 0.12, sit = u0 + B
    pen.box(u0, v0, 0, B, dv, 0.92, () => "U", () => "u", () => "u")                                // the back
    pen.box(u0, v0, 0.92, B, 0.14, 0.14, () => "U", () => "u", () => "u")                           // the wings
    pen.box(u0, v0 + dv - 0.14, 0.92, B, 0.14, 0.14, () => "U", () => "u", () => "u")
    pen.box(sit, v0, 0, du - B, A, 0.6, () => "U", () => "u", () => "u")                            // the far arm
    pen.box(sit, v0 + A, 0, du - B, dv - 2 * A, 0.42, () => "u", () => "u", () => "u")             // the seat
  }
  const nearArm = (pen, p) => {
    const [u0, v0] = p.at, du = p.foot[0], dv = p.foot[1], B = 0.16, A = 0.12
    pen.box(u0 + B, v0 + dv - A, 0, du - B, A, 0.6, () => "U", () => "u", () => "u")
  }
  ISOKIT.prop("armchair", {
    frames: 12,
    draw(pen, p, f) {
      const [u0, v0] = p.at, du = p.foot[0], dv = p.foot[1], B = 0.16, A = 0.12, sit = u0 + B
      chair(pen, p)
      const hu = sit + 0.06, hv = v0 + dv / 2 + 0.04
      const [hx, hy] = pen.P(hu, hv, 1.0)
      pen.box(u0 + du - 0.02, v0 + A + 0.08, 0.06, 0.1, dv - 2 * A - 0.16, 0.42, () => "o", () => "o", () => "o")   // the shins
      nearArm(pen, p)
      // her in the pink robe, from the side and filling the chair (the user's sketch of 10.11.2026): a round body
      // against the back, the lap rising over the near arm and going on to the right (+u), the near arm hanging
      // over the armrest, the hand down its side
      pen.at(sit + 0.12, v0 + dv, 0.7, "v")
      pen.grid(hx - 6, hy + 3, [
        ".....oopppppo.....",
        "...oopppppppppo...",
        "..ooppppppppppppo.",
        ".opppoppppppppppo.",
        ".opppopppppppppppo",
        ".opppopppppppppppo",
        ".opppopppppppppppo",
        ".opppopppppppppppo",
        ".opppoooppppppppo.",
        ".opppooopppppppppo",
        ".opppooopppppppppp",
        ".opppoooopppppppppp",
        "..ppo...oooppppppo",
        "..ppo.....oooooooo",
        "..ppo.............",
        "...SS.............",
        "...SS.............",
        "...S..............",
        "...S..............",
      ])
      // her head against the back, fallen a little toward us: the curlers on top (blue, pink, cream) under the grey net, the
      // face to the right (+u), eyes shut; greys that stay grey in the TV's light (no glow)
      pen.at(hu, hv, 1.02, "up")
      pen.grid(hx - 3, hy - 4, [".7.8.9.", "77g88g9", "gGgGsSS", "gggsS1S", "gg1sSSs", ".g1sSs.", "..1ss.."])
      // the Lull patch behind her ear: an oval pale disc with its rim (as Teo's), bright on the beat, dim between
      const lull = f % 6 < 3
      pen.grid(hx - 3, hy - 2, [".^.", lull ? "^~^" : "^^^", lull ? "^~^" : "^^^", ".^."], { "~": "!~", "^": "!^" })   // the oval disc, 3x4, its stripe lit on the beat
      // the slipper, fallen off
      const [sx, sy] = pen.P(u0 + du + 0.12, v0 + dv * 0.4, 0)
      pen.at(u0 + du + 0.12, v0 + dv * 0.4, 0.03, "up")
      pen.grid(sx - 2, sy - 1, ["NNM", ".MM"])
    },
  })
  // the same armchair with nobody in it (the same footprint and place in the map): while she walks in CAM 14 (02:30 to 02:45 on
  // days 2 and 3) she must not sit in it too. Only the seat's cushion still pressed down where she sat
  ISOKIT.prop("armchair_empty", {
    draw(pen, p) {
      const [u0, v0] = p.at, du = p.foot[0], dv = p.foot[1], B = 0.16, A = 0.12, sit = u0 + B
      chair(pen, p)
      // the cushion's hollow, a shade on the seat's top
      const [cx, cy] = pen.P(sit + (du - B) / 2, v0 + dv / 2, 0.42)
      pen.at(sit + (du - B) / 2, v0 + dv / 2, 0.42, "up")
      pen.grid(cx - 3, cy - 1, [".iii.", "iiiii", ".ii.."])
      nearArm(pen, p)
    },
  })
  return {}
})()

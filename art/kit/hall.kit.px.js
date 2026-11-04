// The kit of the observation hall (art/rooms/hall.map.js), Halcyon Tower, 2088. Registered with ISOKIT
// (art/lib/isokit.js); include after art/lib/iso.js (palette), art/lib/isomap.js, art/lib/isokit.js.
//   floor   c  carpet tiles, 0.5 m, laid in turns; a floor box under each desk where its cables go down
//           a  the aisle along the screen wall: smooth, darker
//   walls   screen_wall  screens from the dado to under the ceiling, 0.8 x 0.5 m in black bezels; each shows a
//           feed in the phosphor (someone from above on a pavement, a road with people walking, a corridor, a
//           crowd, no signal), scanlines, some moving; under the ceiling the cable tray and the dome cameras
//           that watch the watchers (their red lights)
//           hall_panel   the near walls' stubs
//   props   desk  a slab on two side panels, a cable tray under it, three monitors with their feeds, the
//           keyboard; a stool, and on it a watcher in Halcyon's grey from behind: shoulders, the collar, the
//           arms forward to the keys (typing), the head with its hair (cut, colour and skin vary by desk), the
//           cable from the desk into the nape and the implant's point. Juno's (the map's `juno: true`): her
//           short black hair, the cactus and the cup on her desk, her yellow coat over the stool
// Screens are "!" keys: they are the light and are never lit themselves.
pal({ 0: "#0c221f", 7: "#266252", 8: "#55a585", 9: "#8acfae", L: "#d4f7e2",     // the phosphor
  d: "#4a2e22", D: "#6e4632" })                                                // darker skin, lit

const HALLKIT = (() => {
  const fl = Math.floor, ih = ISO.ihash, NF = 12
  // the screens' light: a step or two along a green family
  Object.assign(ISOKIT.TINT, { green: {
    e: ["e", "0"], f: ["0", "0"], z: ["0", "7"], Z: ["7", "7"], X: ["7", "8"],
    1: ["1", "0"], 2: ["0", "0"], 3: ["0", "7"], 4: ["7", "7"], 5: ["7", "8"], 6: ["8", "9"],
    g: ["7", "8"], G: ["8", "9"], h: ["8", "9"], H: ["9", "L"], s: ["s", "S"], d: ["d", "D"], O: ["O", "P"],
    0: ["0", "7"], 7: ["7", "8"], y: ["y", "Y"], j: ["j", "y"],
  } })
  Object.assign(ISOKIT.SHADE, { d: "O", D: "d", L: "9", 9: "8", 8: "7" })

  // ---------------------------------------------------------------- floors
  ISOKIT.floor("c", (u, v) => {
    const i = fl(u / 0.5), j = fl(v / 0.5), lu = u - i * 0.5, lv = v - j * 0.5
    if (lu < 1 / 40 || lv < 1 / 40) return "1"
    // laid in turns: the pile runs one way on one tile, the other way on the next
    const across = (i + j) % 2 ? lu : lv
    return fl(across * 40) % 3 === 0 ? "1" : "2"
  })
  ISOKIT.floor("a", (u, v) => (v % 1 < 1 / 40 ? "1" : u % 2 < 1 / 30 ? "1" : "3"))

  // ---------------------------------------------------------------- the feeds
  // one cell's picture at (x, y) in 0..1 (y up), its kind and seed from the cell, f the frame; keys of the
  // phosphor from dark to bright: 0 7 8 9 L
  const KINDS = ["walker", "walker", "street", "corridor", "crowd", "walker", "street", "nosignal"]
  function feed(kind, seed, x, y, f) {
    const t = f / NF
    if (kind === "walker") {
      // someone seen from above on a dark pavement, their shadow; a kerb's line
      const px = 0.3 + 0.4 * ih(seed, 1) + t * 0.2 * (ih(seed, 2) - 0.5), py = 0.35 + 0.3 * ih(seed, 3)
      const d = Math.hypot((x - px) / 0.07, (y - py) / 0.12)
      if (d < 1) return d < 0.5 ? "L" : "9"
      if (Math.hypot((x - px - 0.05) / 0.08, (y - py + 0.12) / 0.06) < 1) return "0"
      return Math.abs(y - 0.15 - 0.1 * ih(seed, 4)) < 0.04 ? "8" : "7"
    }
    if (kind === "street") {
      // a road across the picture, its two pavements, two people walking
      const d = y - (0.35 + 0.3 * ih(seed, 1))
      if (Math.abs(d) < 0.12) return "0"
      if (Math.abs(d) < 0.24) {
        for (let k = 0; k < 2; k++) {
          const px = (ih(seed, 10 + k) + t * (k ? 0.25 : -0.25) + 1) % 1, side = k ? 0.18 : -0.18
          if (Math.abs(x - px) < 0.05 && Math.abs(d - side) < 0.05) return "L"
        }
        return "8"
      }
      return "7"
    }
    if (kind === "corridor") {
      // a corridor away from the camera: the floor narrowing, a lit door at the end, someone in it
      const w = 0.12 + (1 - y) * 0.4
      if (y < 0.7 && Math.abs(x - 0.5) < w) {
        if (y > 0.42 && Math.abs(x - 0.5) < 0.08) return "9"
        if (Math.abs(x - 0.5 - 0.1 * Math.sin(t * Math.PI * 2)) < 0.04 && y > 0.2 && y < 0.45) return "L"
        return "7"
      }
      return "0"
    }
    if (kind === "crowd") {
      const k = fl(x * 6) * 7 + fl(y * 3) * 3
      return ih(seed + k, 5) < 0.4 && (x * 6 % 1) < 0.45 && (y * 3 % 1) < 0.5 ? "9" : "7"
    }
    // no signal: a bar in the middle, the rest dark
    return Math.abs(y - 0.5) < 0.12 && Math.abs(x - 0.5) < 0.3 ? (fl(t * 4) % 2 ? "8" : "9") : "0"
  }
  const DIM = { L: "9", 9: "8", 8: "7", 7: "0", 0: "0" }

  // ---------------------------------------------------------------- the screen walls
  ISOKIT.wall("screen_wall", (s, h, o) => {
    if (h < 0.06) return "1"                                                    // the skirting
    if (h < 0.42) return h > 0.38 ? "4" : near(s % 1.6, 0.8, 0.02) ? "1" : "2"  // the dado's panels
    if (h < 0.45) return "k"
    if (h > 3.7) {
      // under the ceiling: the cable tray, the dome cameras every 3.2 m with their red light
      if (h < 3.78) return "3"
      const dome = Math.hypot((s % 3.2 - 1.6) / 0.12, (h - 3.86) / 0.08)
      if (dome < 1) return dome < 0.4 && h < 3.86 ? "!q" : h < 3.86 ? "1" : "2"
      return h < 3.82 ? "1" : "2"
    }
    if (h > 3.65) return "k"
    const cs = s / 0.8, ch = (h - 0.45) / 0.5, i = fl(cs), j = fl(ch)
    if (cs - i < 0.05 || ch - j < 0.08) return "k"                              // the bezels
    const side = o.wall.from[1] === o.wall.to[1] ? 0 : 1, seed = ih(i * 31 + j * 7, side + 3) * 1e6 | 0
    const kind = KINDS[fl(ih(seed, 4) * KINDS.length)]
    const x = (cs - i - 0.05) / 0.95, y = (ch - j - 0.08) / 0.92
    // a still picture on most screens; some move (their frame), one in a few cuts to another camera
    const moving = ih(seed, 6) < 0.55, f = moving ? (o.f ?? 0) : 0
    let k = feed(kind, seed, side ? 1 - x : x, y, f)
    if ((o.e ?? 0) % 3 === 2) k = DIM[k]                                        // scanlines
    return "!" + k
  })
  const near = (x, c, w) => Math.abs(x - c) < w
  ISOKIT.wall("hall_panel", (s, h) => (h < 0.06 ? "1" : "2"))

  // ---------------------------------------------------------------- the desks and their watchers
  const HAIR = [["k", "1"], ["k", "1"], ["O", "A"], ["h", "H"], ["1", "2"], ["O", "P"]]   // black, brown, grey, dark brown
  ISOKIT.prop("desk", {
    frames: NF,
    solid: (m) => [[m.at[0], m.at[1], 0.7, m.foot[0], 0.65, 0.05], [m.at[0] + 0.38, m.at[1] + 0.78, 0, 0.44, 0.4, 1.35]],
    footprint: (m) => [[m.at[0], m.at[1], 0.06, 0.65], [m.at[0] + 1.14, m.at[1], 0.06, 0.65], [m.at[0] + 0.38, m.at[1] + 0.78, 0.44, 0.4]],
    draw(p, m, f) {
      const [u0, v0] = m.at, cu = u0 + 0.6, seed = ih(u0 * 10 | 0, v0 * 10 | 0) * 1e6 | 0, juno = !!m.juno
      // the desk: a slab with a lit front edge on two side panels; the cable tray under it; the floor box
      p.box(u0 + 0.4, v0 + 0.1, 0, 0.3, 0.2, 0.04, () => "4", () => "3", () => "3")
      p.box(u0, v0, 0, 0.05, 0.65, 0.7, () => "3", () => "2", (a, e, o) => (e === o.ah - 1 ? "3" : "2"))
      p.box(u0 + 1.15, v0, 0, 0.05, 0.65, 0.7, () => "3", () => "2", (a, e, o) => (e === o.ah - 1 ? "3" : "2"))
      p.box(u0 + 0.05, v0 + 0.05, 0.55, 1.1, 0.12, 0.08, () => "2", () => "1", () => "1")
      p.box(u0, v0, 0.7, 1.2, 0.65, 0.04, (lu, lv) => (lv > 0.6 ? "5" : "4"), () => "3", () => "4")
      // three monitors on stands at the back of the desk, their feeds toward the watcher (+v)
      for (const [n, du] of [[0, 0.04], [1, 0.42], [2, 0.8]]) {
        p.box(u0 + du + 0.15, v0 + 0.12, 0.74, 0.06, 0.06, 0.12, () => "3", () => "2", () => "2")
        const kind = KINDS[fl(ih(seed, n) * KINDS.length)]
        p.box(u0 + du, v0 + 0.08, 0.86, 0.36, 0.05, 0.3, () => "3", () => "2", (a, e, o) => {
          if (a === 0 || e === 0 || a === o.aw - 1 || e === o.ah - 1) return "1"
          let k = feed(kind, seed + n, (a - 1) / (o.aw - 2), (e - 1) / (o.ah - 2), ih(seed, n + 9) < 0.5 ? f : 0)
          if (e % 2) k = DIM[k]
          return "!" + k
        })
      }
      // the keyboard; Juno's cactus in its pot and her cup
      p.box(cu - 0.22, v0 + 0.34, 0.74, 0.44, 0.15, 0.02, (lu) => (fl(lu * 30) % 2 ? "2" : "3"), () => "1", () => "1")
      if (juno) {
        // on the desk's far end from her, where nothing hides them (the left end is behind her head)
        p.box(u0 + 1.02, v0 + 0.3, 0.74, 0.11, 0.11, 0.08, () => "O", () => "O", () => "P")     // the pot
        p.box(u0 + 1.05, v0 + 0.33, 0.82, 0.05, 0.05, 0.14, () => "8", () => "7", () => "8")    // the cactus
        p.box(u0 + 0.84, v0 + 0.46, 0.74, 0.08, 0.08, 0.1, () => "1", () => "h", () => "H")     // the cup
      } else if (ih(seed, 40) < 0.4) {
        p.box(u0 + 0.95 + ih(seed, 41) * 0.1, v0 + 0.4, 0.74, 0.07, 0.07, 0.09, () => "1", () => "h", () => "H")
      }
      // the stool
      p.box(cu - 0.03, v0 + 0.95, 0, 0.06, 0.06, 0.42, () => "2", () => "1", () => "1")
      p.box(cu - 0.18, v0 + 0.82, 0.42, 0.36, 0.34, 0.05, () => "3", () => "2", () => "2")
      if (juno) {
        // her yellow coat over the stool, hanging down behind her
        p.box(cu - 0.16, v0 + 1.12, 0.1, 0.32, 0.05, 0.34, () => "Y", () => "j", (a, e, o) => {
          if (e === 0 && (a * 7) % 3 === 0) return null                                         // the hem, uneven
          if (e > o.ah - 3) return "Y"                                                           // draped over the seat
          if (a % 3 === 1 && e < o.ah - 3) return "j"                                            // its folds
          return a === o.aw - 1 ? "j" : "y"
        })
        p.box(cu - 0.17, v0 + 0.84, 0.44, 0.34, 0.3, 0.02, () => "y", () => "j", () => "y")       // over the seat
      }
      // the watcher, seated, back to us; typing: the hands move on the keys
      const hair = juno ? ["k", "1"] : HAIR[fl(ih(seed, 50) * HAIR.length)], skin = juno ? "S" : ih(seed, 51) < 0.4 ? "d" : "s"
      const bun = !juno && ih(seed, 52) < 0.25, bald = !juno && !bun && ih(seed, 53) < 0.15
      p.box(cu - 0.17, v0 + 0.84, 0.47, 0.34, 0.26, 0.18, () => "g", () => "4", () => "g")       // the hips
      p.box(cu - 0.2, v0 + 0.86, 0.65, 0.4, 0.22, 0.42, () => "G", () => "g", (a, e, o) => {      // the back
        if (e > o.ah - 3) return a < 2 || a > o.aw - 3 ? "G" : "g"                                // the shoulders' edge
        if (Math.abs(a - o.aw / 2) < 0.6 && e > 2) return "4"                                   // the seam down the back
        return "g"
      })
      p.box(cu - 0.06, v0 + 0.92, 1.05, 0.12, 0.08, 0.04, () => "G", () => "g", () => "G")        // the collar
      const tap = (k) => (ih(seed + k, f) < 0.35 ? 1 : 0)
      p.box(cu - 0.25, v0 + 0.6, 0.82 + tap(1) * 0.03, 0.07, 0.3, 0.1, () => "G", () => "4", () => "g")   // the arms
      p.box(cu + 0.18, v0 + 0.6, 0.82 + tap(2) * 0.03, 0.07, 0.3, 0.1, () => "G", () => "4", () => "g")
      p.box(cu - 0.05, v0 + 0.93, 1.09, 0.1, 0.07, 0.05, () => skin, () => skin, () => skin)        // the nape
      // the head: rounded (its corner pixels left out), the hair over the back of it
      const round = (a, e, o) => (a === 0 || a === o.aw - 1) && (e === 0 || e === o.ah - 1)
      const nod = !juno && ih(seed, 60) < 0.2 && f >= 6 && f < 9 ? -0.02 : 0
      p.box(cu - 0.1, v0 + 0.86, 1.14 + nod, 0.2, 0.19, 0.22,
        () => (bald ? skin : hair[1]),
        (a, e, o) => (round(a, e, o) ? null : bald ? skin : e < 2 && !bun ? skin : a === 1 ? hair[0] : hair[1]),     // its side, the ear below the hair
        (a, e, o) => (round(a, e, o) ? null : bald ? (e === o.ah - 2 ? hair[0] : skin) : e === 0 ? skin : hair[a % 3 === 1 ? 0 : 1]))
      if (bun) p.box(cu - 0.05, v0 + 1.0, 1.32 + nod, 0.1, 0.08, 0.08, () => hair[1], () => hair[0], () => hair[1])
      // the cable from the desk's edge into the nape, the implant's point
      const [x0, y0] = p.P(cu + 0.2, v0 + 0.62, 0.74), [x1, y1] = p.P(cu + 0.03, v0 + 1.0, 1.1)
      p.line(x0, y0, x1, y1, "1"); p.line(x0 + 1, y0, x1 + 1, y1, "k")
      p.px(x1, y1, "!v")
    },
  })
  return { feed, KINDS }
})()

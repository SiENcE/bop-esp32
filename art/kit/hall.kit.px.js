// The kit of the observation hall (art/rooms/hall.map.js): BLOCKS for now, the shapes and the light to approve
// before the painting. Registered with ISOKIT (art/lib/isokit.js); include after art/lib/iso.js (palette),
// art/lib/isomap.js, art/lib/isokit.js.
//   floor   c  carpet tiles, a 0.5 m grid      a  the aisle along the screen wall
//   walls   screen_wall  screens from the dado to under the ceiling in a grid of 0.8 x 0.5 m, their pictures
//           phosphor green (never lit: they are the light), a few changing as the loop runs
//           hall_panel   the near walls' stubs
//   props   desk  a desk with three monitors facing the right wall, a chair, a watcher seated in Halcyon's grey
//           with their back to us, the cable from the desk into the neck, the implant's point of light
pal({ 0: "#0c221f", 7: "#266252", 8: "#55a585", 9: "#8acfae", L: "#d4f7e2" })   // the phosphor screens

const HALLKIT = (() => {
  const fl = Math.floor, ih = ISO.ihash
  // the screens' light: a step or two along a green family
  Object.assign(ISOKIT.TINT, { green: {
    e: ["e", "0"], f: ["0", "0"], z: ["0", "7"], Z: ["7", "7"], X: ["7", "8"],
    1: ["1", "0"], 2: ["0", "0"], 3: ["0", "7"], 4: ["7", "7"], 5: ["7", "8"], 6: ["8", "9"],
    g: ["7", "8"], G: ["8", "9"], h: ["8", "9"], H: ["9", "L"], s: ["s", "S"], 0: ["0", "7"], 7: ["7", "8"],
  } })

  ISOKIT.floor("c", (u, v) => (u % 0.5 < 1 / 32 || v % 0.5 < 1 / 32 ? "1" : "2"))
  ISOKIT.floor("a", (u, v) => (v % 0.5 < 1 / 32 ? "1" : "3"))

  // the screens: cells 0.8 x 0.5 m between h 0.45 and 3.65; a few change picture on some frames
  ISOKIT.wall("screen_wall", (s, h, o) => {
    if (h < 0.06) return "1"
    if (h < 0.45) return h > 0.4 ? "4" : "2"
    if (h > 3.65) return h < 3.72 ? "3" : "1"
    const cs = s / 0.8, ch = (h - 0.45) / 0.5, i = fl(cs), j = fl(ch)
    if (cs - i < 0.05 || ch - j < 0.08) return "k"
    const id = i * 31 + j * 7 + (o.wall.from[1] === o.wall.to[1] ? 0 : 500)
    const q = ih(id, ih(id, 3) < 0.15 ? fl((o.f ?? 0) / 3) : 0)
    // a picture: a street seen from above, in bands of the phosphor (blocks for now)
    const y = ch - j, x = cs - i
    const k = q < 0.12 ? "L" : q < 0.5 ? "9" : q < 0.85 ? "8" : "7"
    if (y < 0.3 && k !== "L") return "!7"
    return x > 0.3 && x < 0.38 && y > 0.4 && y < 0.8 && k !== "L" ? "!L" : `!${k}`
  })
  ISOKIT.wall("hall_panel", (s, h) => (h < 0.06 ? "1" : "2"))

  ISOKIT.prop("desk", {
    solid: (m) => [[m.at[0], m.at[1], 0.7, m.foot[0], 0.65, 0.05], [m.at[0] + 0.38, m.at[1] + 0.78, 0, 0.44, 0.4, 1.35]],
    footprint: (m) => [[m.at[0], m.at[1], 0.06, 0.65], [m.at[0] + 1.14, m.at[1], 0.06, 0.65], [m.at[0] + 0.38, m.at[1] + 0.78, 0.44, 0.4]],
    draw(p, m) {
      const [u0, v0] = m.at, cu = u0 + 0.6
      // the desk: a slab on two side panels, open under it
      p.box(u0, v0, 0, 0.05, 0.65, 0.7, () => "3", () => "2", () => "2")
      p.box(u0 + 1.15, v0, 0, 0.05, 0.65, 0.7, () => "3", () => "2", () => "2")
      p.box(u0, v0, 0.7, 1.2, 0.65, 0.04, () => "4", () => "3", () => "3")
      // three monitors on the far side, their pictures toward the watcher (+v): green, unlit; the keyboard
      for (const du of [0.05, 0.42, 0.79]) {
        p.box(u0 + du + 0.15, v0 + 0.12, 0.74, 0.06, 0.06, 0.12, () => "3", () => "2", () => "2")
        p.box(u0 + du, v0 + 0.08, 0.86, 0.36, 0.05, 0.3, () => "3", () => "2", (a, e, o) => (a === 0 || e === 0 || a === o.aw - 1 || e === o.ah - 1 ? "1" : "!9"))
      }
      p.box(cu - 0.22, v0 + 0.32, 0.74, 0.44, 0.16, 0.02, () => "2", () => "1", () => "1")
      // the stool, the watcher seated on it, back to us: the hips, the torso, the shoulders, the arms forward
      // to the keys, the neck, the head; Halcyon grey
      p.box(cu - 0.18, v0 + 0.85, 0, 0.06, 0.06, 0.42, () => "2", () => "1", () => "1")
      p.box(cu - 0.2, v0 + 0.8, 0.42, 0.4, 0.36, 0.06, () => "3", () => "2", () => "2")
      p.box(cu - 0.19, v0 + 0.84, 0.48, 0.38, 0.26, 0.2, () => "g", () => "4", () => "g")      // the hips
      p.box(cu - 0.21, v0 + 0.86, 0.68, 0.42, 0.22, 0.4, () => "G", () => "4", () => "g")     // the torso, its back
      p.box(cu - 0.24, v0 + 0.62, 0.86, 0.07, 0.3, 0.12, () => "G", () => "4", () => "g")    // the arms to the keys
      p.box(cu + 0.17, v0 + 0.62, 0.86, 0.07, 0.3, 0.12, () => "G", () => "4", () => "g")
      p.box(cu - 0.06, v0 + 0.9, 1.08, 0.12, 0.12, 0.06, () => "s", () => "O", () => "s")      // the neck
      p.box(cu - 0.1, v0 + 0.86, 1.14, 0.2, 0.2, 0.2, () => "1", () => "k", () => "1")       // the head, the hair
      // the cable from the desk's edge into the neck, the implant's point
      const [x0, y0] = p.P(cu + 0.18, v0 + 0.62, 0.74), [x1, y1] = p.P(cu + 0.04, v0 + 1.02, 1.1)
      p.line(x0, y0, x1, y1, "1")
      p.px(x1, y1, "!v")
    },
  })
  return {}
})()

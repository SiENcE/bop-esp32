// The kit pieces LUCKY STATIC needs (art/rooms/lucky_static.map.js), as BLOCKS for now: plain boxes and flat colours to judge
// the room's layout and its scale before anything is painted (the style guide and the pxl skill come first when it is).
// Registered with ISOKIT (art/lib/isokit.js), drawn in room meters, lit by the bake; keys of the world palette (art/lib/iso.js).
// Keys "!k" are never lit (screens, neon, the hood's lamp).
//
//   floors   t  old tiles, b  boards behind the counter
//   walls    ls_wall  dark plaster over a wainscot
//   openings ls_hood (the kitchen's hood, its lamp), ls_bottles (shelves of bottles), ls_tv (Nagi·wa's news, 凪輪),
//            ls_slate (Mei's slate with the tallies), ls_wc (the toilet's door)
//   props    ls_range (the noodle kitchen: a range, two pots), ls_counter, ls_stool, ls_karaoke (OUT OF ORDER),
//            ls_table, ls_chair
include("../lib/text.js")
include("../lib/kanji.js")

const KIT_LUCKY_STATIC = (() => {
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w

  // ---------------------------------------------------------------- floors and walls
  ISOKIT.floor("t", (u, v) => (near(u % 0.5, 0) || near(v % 0.5, 0) ? "e" : (Math.floor(u * 2) + Math.floor(v * 2)) % 2 ? "z" : "Z"))
  ISOKIT.floor("b", (u, v) => (near(v % 0.25, 0, 1 / 64) ? "e" : "f"))
  ISOKIT.wall("ls_wall", (s, h) => (h < 0.06 ? "1" : h < 1.0 ? (near(h, 0.98, 0.02) ? "5" : "3") : "2"))

  // ---------------------------------------------------------------- openings
  ISOKIT.opening("ls_hood", { paint: (s, h, o) => (h < 0.08 ? (s > 0.2 && s < o.w - 0.2 ? "!R" : "5") : "4") })
  ISOKIT.opening("ls_bottles", {
    paint(s, h) {
      if (near(h, 0, 0.03) || near(h, 0.4, 0.03)) return "5"                                     // two shelves
      const row = h < 0.4 ? 0 : 1, i = Math.floor(s / 0.12), x = s - i * 0.12
      if (x > 0.07) return "1"
      const top = (row ? 0.4 : 0) + 0.24 + ((i * 7 + row * 3) % 4) * 0.025
      if (h > top) return "1"
      return ["!M", "!Q", "!C", "!P", "!m", "!v"][(i * 5 + row) % 6]
    },
  })
  ISOKIT.opening("ls_tv", {
    paint(s, h, o) {
      if (s < 0.04 || s > o.w - 0.04 || h < 0.04 || h > o.h - 0.04) return "4"
      o.memo.tv ??= ISOKIT.raster(o.aw, o.ah, (c) => { c.rect(0, 0, o.aw, o.ah, "c"); KANJI.draw(c, Math.floor(o.aw / 2) - 14, 2, "v"); c.hline(3, o.ah - 4, o.aw - 6, "C") }, 0, 0)
      return "!" + (o.memo.tv(o.a, o.e) ?? "c")
    },
  })
  ISOKIT.opening("ls_slate", {
    paint(s, h, o) {
      if (s < 0.04 || s > o.w - 0.04 || h < 0.04 || h > o.h - 0.04) return "O"
      const row = Math.floor((o.h - h) / 0.17), x = s - 0.1
      if (row < 5 && x > 0 && ((x % 0.06) < 0.015) && ((o.h - h) % 0.17) > 0.04 && x < 0.15 + ((row * 37) % 5) * 0.12 + (row === 2 ? 0.5 : 0)) return "H"
      return "1"
    },
  })
  ISOKIT.opening("ls_wc", { paint: (s, h, o) => (s < 0.05 || s > o.w - 0.05 || h > o.h - 0.05 ? "5" : near(s, o.w - 0.15, 0.03) && near(h, 1.0, 0.03) ? "G" : "4") })

  // ---------------------------------------------------------------- props
  ISOKIT.prop("ls_range", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      pen.box(u, v, 0, du, dv, p.h, () => "5", () => "3", () => "4")
      for (const k of [0.25, 0.8]) pen.box(u + k, v + 0.15, p.h, 0.32, 0.32, 0.26, () => "g", () => "5", () => "6")
    },
  })
  ISOKIT.prop("ls_counter", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      pen.box(u, v + 0.05, 0, du, dv - 0.05, p.h - 0.05, () => "O", () => "O", () => "O")
      pen.box(u - 0.05, v, p.h - 0.05, du + 0.1, dv + 0.06, 0.05, () => "P", () => "O", () => "P")
    },
  })
  ISOKIT.prop("ls_stool", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      pen.box(u + du / 2 - 0.03, v + dv / 2 - 0.03, 0, 0.06, 0.06, p.h - 0.06, () => "5", () => "4", () => "5")
      pen.box(u, v, p.h - 0.06, du, dv, 0.06, () => "M", () => "n", () => "n")
    },
  })
  ISOKIT.prop("ls_karaoke", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      pen.box(u, v, 0, du, dv, p.h, () => "3", (a, e, o) => (e > o.ah * 0.55 && e < o.ah * 0.85 && a > 2 && a < o.aw - 2 ? "!n" : "4"),
        (a, e, o) => (e > o.ah * 0.5 && e < o.ah * 0.85 && a > 2 && a < o.aw - 2 ? (e > o.ah * 0.64 && e < o.ah * 0.72 ? "!m" : "!n") : "3"))
    },
  })
  ISOKIT.prop("ls_table", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      pen.box(u + du / 2 - 0.04, v + dv / 2 - 0.04, 0, 0.08, 0.08, p.h - 0.04, () => "4", () => "3", () => "4")
      pen.box(u, v, p.h - 0.04, du, dv, 0.04, () => "5", () => "4", () => "4")
      pen.box(u + 0.25, v + 0.3, p.h, 0.12, 0.12, 0.1, () => "H", () => "h", () => "h")                       // her glass of tea
    },
  })
  ISOKIT.prop("ls_chair", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      pen.box(u, v, 0, du, dv, 0.45, () => "4", () => "3", () => "3")
      pen.box(u, v, 0.45, 0.06, dv, p.h - 0.45, () => "4", () => "3", () => "3")
    },
  })

  return {}
})()

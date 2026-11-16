// The kit pieces lantern_versteck needs (art/rooms/lantern_versteck.map.js), made by tools/new-room.mjs: placeholders to paint over (read the style guide
// and the pxl skill first). Registered with ISOKIT (art/lib/isokit.js has the calls), drawn in room meters, lit by the
// bake; keys of the world palette (art/lib/iso.js). A kit's names are global in a bake: keep this one's prefixed.
//
//   floor    p  plain screed, a joint every meter
//   walls    lantern_versteck_wall  plain paint over a dark skirting
//   props    lv_kitchen, lv_rack    the caravan's kitchen and the rack of senders (blocks)

const KIT_LANTERN_VERSTECK = (() => {
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w

  ISOKIT.floor("p", (u, v) => (near(u, Math.round(u)) || near(v, Math.round(v)) ? "e" : "z"))
  ISOKIT.wall("lantern_versteck_wall", (s, h) => (h < 0.08 ? (h >= 0.055 ? "4" : "1") : "3"))
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

// The kit pieces ines_wohnung needs (art/rooms/ines_wohnung.map.js), made by tools/new-room.mjs: placeholders to paint over (read the style guide
// and the pxl skill first). Registered with ISOKIT (art/lib/isokit.js has the calls), drawn in room meters, lit by the
// bake; keys of the world palette (art/lib/iso.js). A kit's names are global in a bake: keep this one's prefixed.
//
//   floor    p  plain screed, a joint every meter
//   walls    ines_wohnung_wall  plain paint over a dark skirting

const KIT_INES_WOHNUNG = (() => {
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w

  ISOKIT.floor("p", (u, v) => (near(u, Math.round(u)) || near(v, Math.round(v)) ? "e" : "z"))
  ISOKIT.wall("ines_wohnung_wall", (s, h) => (h < 0.08 ? (h >= 0.055 ? "4" : "1") : "3"))

  return {}
})()

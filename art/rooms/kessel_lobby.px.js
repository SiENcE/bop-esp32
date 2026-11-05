// The Kessel Block's lobby baked from its map (art/rooms/kessel_lobby.map.js) with its kit
// (art/kit/kessel_lobby.kit.px.js) and its light (art/lib/isokit.js). PLAN H3.
//
// Exports (the atlas takes kessel_lobby_* only):
//   kessel_lobby_bg      320x180, a 12-frame loop at 10 fps: the rain on the street door's glass and the
//                        street's magenta stuttering in it and in the puddle, the lift's amber blinking
//   kessel_lobby_sign, kessel_lobby_flyers   the props, outlined, pivot bottom-centre
// KESSEL_LOBBY.layout has the measured numbers (tools/iso-layout.mjs writes the same for the game).
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/kessel_lobby.map.js")
include("../lib/isokit.js")
include("../kit/kessel_lobby.kit.px.js", { palette: true })
include("../kit/kessel_lift.kit.px.js")

const KESSEL_LOBBY = ISOKIT.bake(ISO_MAPS.kessel_lobby, {
  id: "kessel_lobby", frames: 12, fps: 10,
  // the wet tiles mirror the door's glass (the street's magenta) and the poster's cyan
  sheen: { reach: 2.4, map: ISO.MIRROR, keys: (u, v) => ISO_MAPS.kessel_lobby.floor[Math.floor(v / 0.5)]?.[Math.floor(u / 0.5)] === "w" },
  glows: [glow("m", { r: 5, strength: 0.45 }), glow("vV", { r: 3, strength: 0.3 }), glow("Q", { r: 3, strength: 0.35 })],
})

console.log("ISO_LAYOUT " + JSON.stringify({ id: "kessel_lobby", ...KESSEL_LOBBY.layout }))

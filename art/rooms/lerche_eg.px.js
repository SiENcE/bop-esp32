// lerche_eg baked from its map (art/rooms/lerche_eg.map.js) with its kit (art/kit/lerche_eg.kit.px.js) and the light
// (art/lib/isokit.js); made by tools/new-room.mjs. More kits: include them below (their pieces show in the Iso tab's lists).
//
// Exports (the atlas takes lerche_eg_* only): lerche_eg_bg (320x180) and a sprite for each prop, outlined, pivot bottom-centre.
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/lerche_eg.map.js")
include("../lib/isokit.js")
include("../kit/kessel_lobby.kit.px.js", { palette: true })
include("../kit/lerche_flur.kit.px.js", { palette: true })
include("../kit/kessel_14.kit.px.js", { palette: true })
include("../kit/klinik.kit.px.js")
include("../kit/lerche_eg.kit.px.js")

const LERCHE_EG = ISOKIT.bake(ISO_MAPS.lerche_eg, { id: "lerche_eg", frames: 12, fps: 10 })

// the measured numbers for the game: tools/build_art.sh picks this line up and writes game/rooms/lerche_eg.layout.js
console.log("ISO_LAYOUT " + JSON.stringify({ id: "lerche_eg", ...LERCHE_EG.layout }))

// sumpf baked from its map (art/rooms/sumpf.map.js) with its kit (art/kit/sumpf.kit.px.js) and the light
// (art/lib/isokit.js); made by tools/new-room.mjs. More kits: include them below (their pieces show in the Iso tab's lists).
//
// Exports (the atlas takes sumpf_* only): sumpf_bg (320x180) and a sprite for each prop, outlined, pivot bottom-centre.
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/sumpf.map.js")
include("../lib/isokit.js")
include("../kit/sumpf.kit.px.js")
include("../rooms/gasse.map.js")      // the alley kit's cables read its lamps
include("../kit/gasse.kit.px.js", { palette: true })

const SUMPF = ISOKIT.bake(ISO_MAPS.sumpf, { id: "sumpf", frames: 12, fps: 10 })

// the measured numbers for the game: tools/build_art.sh picks this line up and writes game/rooms/sumpf.layout.js
console.log("ISO_LAYOUT " + JSON.stringify({ id: "sumpf", ...SUMPF.layout }))

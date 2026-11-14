// lerche_flur baked from its map (art/rooms/lerche_flur.map.js) with its kit (art/kit/lerche_flur.kit.px.js) and the light
// (art/lib/isokit.js); made by tools/new-room.mjs. More kits: include them below (their pieces show in the Iso tab's lists).
//
// Exports (the atlas takes lerche_flur_* only): lerche_flur_bg (320x180) and a sprite for each prop, outlined, pivot bottom-centre.
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/lerche_flur.map.js")
include("../lib/isokit.js")
include("../kit/lerche_flur.kit.px.js")
include("../kit/kessel_14.kit.px.js", { palette: true })


const LERCHE_FLUR = ISOKIT.bake(ISO_MAPS.lerche_flur, { id: "lerche_flur", frames: 12, fps: 10 })

// the measured numbers for the game: tools/build_art.sh picks this line up and writes game/rooms/lerche_flur.layout.js
console.log("ISO_LAYOUT " + JSON.stringify({ id: "lerche_flur", ...LERCHE_FLUR.layout }))

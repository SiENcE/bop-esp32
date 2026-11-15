// lantern_versteck baked from its map (art/rooms/lantern_versteck.map.js) with its kit (art/kit/lantern_versteck.kit.px.js) and the light
// (art/lib/isokit.js); made by tools/new-room.mjs. More kits: include them below (their pieces show in the Iso tab's lists).
//
// Exports (the atlas takes lantern_versteck_* only): lantern_versteck_bg (320x180) and a sprite for each prop, outlined, pivot bottom-centre.
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/lantern_versteck.map.js")
include("../lib/isokit.js")
include("../kit/lantern_versteck.kit.px.js")
include("../kit/flat.kit.px.js", { palette: true })

const LANTERN_VERSTECK = ISOKIT.bake(ISO_MAPS.lantern_versteck, { id: "lantern_versteck", frames: 12, fps: 10 })

// the measured numbers for the game: tools/build_art.sh picks this line up and writes game/rooms/lantern_versteck.layout.js
console.log("ISO_LAYOUT " + JSON.stringify({ id: "lantern_versteck", ...LANTERN_VERSTECK.layout }))

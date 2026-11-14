// ines_wohnung baked from its map (art/rooms/ines_wohnung.map.js) with its kit (art/kit/ines_wohnung.kit.px.js) and the light
// (art/lib/isokit.js); made by tools/new-room.mjs. More kits: include them below (their pieces show in the Iso tab's lists).
//
// Exports (the atlas takes ines_wohnung_* only): ines_wohnung_bg (320x180) and a sprite for each prop, outlined, pivot bottom-centre.
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/ines_wohnung.map.js")
include("../lib/isokit.js")
include("../kit/ines_wohnung.kit.px.js")
include("../kit/flat.kit.px.js", { palette: true })

const INES_WOHNUNG = ISOKIT.bake(ISO_MAPS.ines_wohnung, { id: "ines_wohnung", frames: 12, fps: 10 })

// the measured numbers for the game: tools/build_art.sh picks this line up and writes game/rooms/ines_wohnung.layout.js
console.log("ISO_LAYOUT " + JSON.stringify({ id: "ines_wohnung", ...INES_WOHNUNG.layout }))

// LUCKY STATIC baked from its map (art/rooms/lucky_static.map.js) with its kit (art/kit/lucky_static.kit.px.js, blocks for now)
// and the light (art/lib/isokit.js).
//
// Exports (the atlas takes lucky_static_* only): lucky_static_bg (320x180) and a sprite for each prop, outlined, pivot bottom-centre.
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/lucky_static.map.js")
include("../lib/isokit.js")
include("../kit/lucky_static.kit.px.js")

const LUCKY_STATIC = ISOKIT.bake(ISO_MAPS.lucky_static, { id: "lucky_static", frames: 12, fps: 10 })

// the measured numbers for the game: tools/build_art.sh picks this line up and writes game/rooms/lucky_static.layout.js
console.log("ISO_LAYOUT " + JSON.stringify({ id: "lucky_static", ...LUCKY_STATIC.layout }))

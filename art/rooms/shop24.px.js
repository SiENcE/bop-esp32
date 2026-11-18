// shop24 baked from its map (art/rooms/shop24.map.js) with its kit (art/kit/shop24.kit.px.js) and the light
// (art/lib/isokit.js); made by tools/new-room.mjs. More kits: include them below (their pieces show in the Iso tab's lists).
//
// Exports (the atlas takes shop24_* only): shop24_bg (320x180) and a sprite for each prop, outlined, pivot bottom-centre.
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/shop24.map.js")
include("../lib/isokit.js")
include("../kit/shop24.kit.px.js")

const SHOP24 = ISOKIT.bake(ISO_MAPS.shop24, { id: "shop24", frames: 12, fps: 10 })

// the measured numbers for the game: tools/build_art.sh picks this line up and writes game/rooms/shop24.layout.js
console.log("ISO_LAYOUT " + JSON.stringify({ id: "shop24", ...SHOP24.layout }))

// klinik baked from its map (art/rooms/klinik.map.js) with its kit (art/kit/klinik.kit.px.js) and the light
// (art/lib/isokit.js); made by tools/new-room.mjs. More kits: include them below (their pieces show in the Iso tab's lists).
//
// Exports (the atlas takes klinik_* only): klinik_bg (320x180) and a sprite for each prop, outlined, pivot bottom-centre.
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/klinik.map.js")
include("../lib/isokit.js")
include("../kit/klinik.kit.px.js")

const KLINIK = ISOKIT.bake(ISO_MAPS.klinik, { id: "klinik", frames: 12, fps: 10 })

// the measured numbers for the game: tools/build_art.sh picks this line up and writes game/rooms/klinik.layout.js
console.log("ISO_LAYOUT " + JSON.stringify({ id: "klinik", ...KLINIK.layout }))

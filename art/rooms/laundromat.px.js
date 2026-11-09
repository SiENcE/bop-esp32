// SUDS & SPIN baked from its map (art/rooms/laundromat.map.js) with its kit (art/kit/laundromat.kit.px.js) and the light
// (art/lib/isokit.js).
//
// Exports (the atlas takes laundromat_* only): laundromat_bg (320x180) and a sprite for each prop, outlined, pivot bottom-centre.
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/laundromat.map.js")
include("../lib/isokit.js")
include("../kit/laundromat.kit.px.js", { palette: true })

const LAUNDROMAT = ISOKIT.bake(ISO_MAPS.laundromat, { id: "laundromat", frames: 12, fps: 10 })

// the measured numbers for the game: tools/build_art.sh picks this line up and writes game/rooms/laundromat.layout.js
console.log("ISO_LAYOUT " + JSON.stringify({ id: "laundromat", ...LAUNDROMAT.layout }))

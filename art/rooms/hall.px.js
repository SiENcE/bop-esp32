// The observation hall (the intro's shot 1) baked from its map (art/rooms/hall.map.js) with its kit
// (art/kit/hall.kit.px.js) and its light (art/lib/isokit.js). Blocks for now.
//   hall_bg       576x416, a 12-frame loop: a few of the screens change picture
//   hall_d<r><c>  the desks with their watchers (props, outlined, pivot bottom-centre)
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/hall.map.js")
include("../lib/isokit.js")
include("../kit/hall.kit.px.js", { palette: true })

const HALL = ISOKIT.bake(ISO_MAPS.hall, { id: "hall", frames: 12, fps: 10, glows: [glow("L9", { r: 2, strength: 0.2 })] })

console.log("ISO_LAYOUT " + JSON.stringify({ id: "hall", ...HALL.layout }))

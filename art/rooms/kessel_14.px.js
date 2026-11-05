// The 14th floor's landing baked from its map (art/rooms/kessel_14.map.js) with its kit
// (art/kit/kessel_14.kit.px.js) and its light (art/lib/isokit.js). PLAN H3.
//
// Exports (the atlas takes kessel_14_* only):
//   kessel_14_bg      320x180, a 12-frame loop at 10 fps: the tube's dying end, Frau Haldane's TV and her
//                     Lull light (baked in: she and her armchair are seen through her open door), the LEDs
//   kessel_14_bags, kessel_14_rail   the props, outlined, pivot bottom-centre
// KESSEL_14.layout has the measured numbers (walk area, front lines, spots, lamps; tools/iso-layout.mjs
// writes the same for the game).
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/kessel_14.map.js")
include("../lib/isokit.js")
include("../kit/kessel_14.kit.px.js", { palette: true })
include("../kit/kessel_lift.kit.px.js")

const KESSEL_14 = ISOKIT.bake(ISO_MAPS.kessel_14, {
  id: "kessel_14", frames: 12, fps: 10,
  glows: [glow("F", { r: 4, strength: 0.4 }), glow("vV", { r: 3, strength: 0.35 })],
})

console.log("ISO_LAYOUT " + JSON.stringify({ id: "kessel_14", ...KESSEL_14.layout }))

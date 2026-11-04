// Juno's flat baked from its map (art/rooms/flat.map.js) with the kit (art/kit/flat.kit.px.js) and the
// light (art/lib/isokit.js): PLAN H1c step 2, the proof that the light carries over a kit. At the new
// scale (style guide §4); it replaces art/rooms/flat.px.js once Juno is drawn at it.
//
// Exports (the atlas takes flat_* only):
//   flat_bg        320x180, a 12-frame loop at 10 fps: rain and the neon outside the window (its pool on
//                  the floor stutters with it), the strip's dead diode, the intercom's LED, the door's LED
//   flat_deck      the desk, the rig and the screens (12 frames)
//   flat_fridge, flat_chair, flat_noodles, flat_laundry (12 frames: in the neon), flat_bed, flat_box
// Each prop is drawn where it stands, outlined, pivot bottom-centre; FLAT_KIT.props[id].at is where the
// engine places it, .box its sprite on the screen; FLAT_KIT.layout the measured numbers (walk area, front
// lines, spots, lamps; tools/iso-layout.mjs writes the same for the game).
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/flat.map.js")
include("../lib/isokit.js")
include("../kit/flat.kit.px.js", { palette: true })

const FLAT_KIT = ISOKIT.bake(ISO_MAPS.flat, {
  // (no sheen: the window's mirror image on the vinyl would land below the picture's edge, the strip's
  // too far out to show)
  id: "flat", frames: 12, fps: 10,
  glows: [glow("m", { r: 5, strength: 0.45 }), glow("vV", { r: 4, strength: 0.3 }), glow("RW", { r: 4, strength: 0.35 })],
})

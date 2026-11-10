// Juno's flat baked from its map (art/rooms/flat.map.js) with the kit (art/kit/flat.kit.px.js) and the
// light (art/lib/isokit.js): PLAN H1c step 2, the proof that the light carries over a kit. At the new
// scale (style guide §4); it replaces art/rooms/flat.px.js once Juno is drawn at it.
//
// Exports (the atlas takes flat_* only):
//   flat_bg        320x180, a 12-frame loop at 10 fps: rain and the neon outside the window (its pool on
//                  the floor stutters with it), the strip's dead diode, the intercom's LED, the door's LED
//   flat_deck      the desk, the rig and the screens (12 frames)
//   flat_fridge, flat_chair, flat_noodles, flat_laundry (12 frames: in the neon), flat_bed, flat_box
//   flat_door_gap, flat_door_leaf   the door standing open (Teo's visit), placed at the door's opening [13, 78], anchor [0, 0]:
//                  the landing seen through it, and the leaf swung into the room on its hinges at the front jamb
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

// the measured numbers for the game: tools/build_art.sh picks this line up and writes game/rooms/flat.layout.js
// (tools/iso-layout.mjs); the props carry where their sprite stands (at) and its box
console.log("ISO_LAYOUT " + JSON.stringify({ id: "flat", ...FLAT_KIT.layout }))

// ---- the door standing open (Teo's visit, game/kapitel1_leben.js; approved as the block mock_flat_door_open, 10.11.2026). Both
// sprites sit at the opening's corner [13, 78]; a pixel a across the door from its front jamb (x 14) is in column 1 + a. Shut, that
// column's foot is at 77 - a·15/29; the leaf swung 90° into the room on its hinges at the front jamb keeps its column and drops it:
// its foot is at 77 + a·15/29. It shows the face the room sees when it is shut (FLAT_DOOR_FACE, the kit's), a step darker: it
// faces away from the strip light now
{
  const { aw, ah } = FLAT_DOOR_SIZE
  const shut = (a) => 77 - Math.round((a * 15) / 29), open = (a) => 77 + Math.round((a * 15) / 29)
  // through the gap: the landing (art/rooms/kessel_14.map.js), its green concrete across the way, the tube's light along its top,
  // its worn floor coming up to the steel sill
  anim("flat_door_gap", { w: 32, h: 94, frames: 1, fps: 1 }, (c) => {
    for (let a = 0; a < aw; a++) {
      const x = 1 + a, foot = shut(a), top = foot - ah + 1
      c.rect(x, top, 1, ah, "#1e2d29")
      c.rect(x, top, 1, 3, "#121c1a")
      c.rect(x, top + 5, 1, 2, "#3d5849")
      c.rect(x, foot - 13, 1, 12, "#2a3f37")
      c.px(x, foot - 13, "#1c2738")
      c.px(x, foot, "4")
      if (a < 2) c.rect(x, top, 1, ah, "3")                                       // the jamb's reveal
    }
  })
  const DARK = { 6: "5", 5: "4", 4: "3", 3: "2", 2: "1", G: "g", g: "3" }
  const face = ISOKIT.raster(aw, ah, (r) => FLAT_DOOR_FACE(r, aw, ah))
  anim("flat_door_leaf", { w: 32, h: 94, frames: 1, fps: 1 }, (c) => {
    for (let a = 0; a < aw; a++) {
      const x = 1 + a, foot = open(a)
      for (let e = 0; e < ah; e++) { const k = face(a, e); if (k) c.px(x, foot - e, DARK[k] ?? k) }
      c.px(x, foot - ah, "4")                                                      // its top edge, lit from above
      if (a === aw - 6 || a === aw - 5) c.px(x, foot - 38, "q")                    // the deadbolt's LED, armed
    }
    for (let e = 0; e <= ah; e++) c.px(1 + aw, open(aw) - e, "4")                  // its free edge, the steel's thickness
  })
}

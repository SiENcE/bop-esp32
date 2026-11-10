// The 14th floor of the Kessel Block as a map (art/lib/isomap.js has the format): the landing outside
// Juno's flat. Every length in meters. Juno's door 14B in the left back wall, the note war beside it; in the right
// one the lift (out of order, at the same place as in the lobby: art/rooms/kessel_lobby.map.js),
// the lift's emergency hook in the corner left of it, and right beside the lift Frau Haldane's door 14C, open, her armchair just
// inside in the TV's blue light (her flat lies behind the right wall, next to the lift's shaft; Juno's behind the left one: the
// user's decision of 10.11.2026, the two can't share a wall); further along the right wall the sign "14", a camera high over the
// stairwell, and the stairs down to the lobby along it, with Motte on his bench in front of them. Along the left wall in front, where
// nobody lives, the bin bags and a neon sign for NINTH LIVE. The landing is 6 m along the
// right wall (one more than the flat: it scrolls a little), the picture moved up so its front stays on the screen (352 wide).
"use strict";

ISO_MAPS.kessel_14 = {
  size: [6.0, 4.5], cell: 0.5, at: [152, 74], screen: [352, 180], margin: 0.2,
  // "c" concrete, "l" lino worn through to it in front of the doors, "." the stairwell
  floor: [
    "cccllcc...cc",
    "cccllcc...cc",
    "cccccccccccc",
    "llcccccccccc",
    "llcccccccccc",
    "cccccccccccc",
    "cccccccccccc",
    "cccccccccccc",
    "cccccccccccc",
  ],
  walls: [
    { from: [0, 0], to: [6.0, 0], h: 2.6, kit: "concrete_green" },        // 0: the right back wall (the lift, 14C)
    { from: [0, 0], to: [0, 4.5], h: 2.6, kit: "concrete_green" },        // 1: the left back wall (14B's)
    { from: [0, 4.5], to: [6.0, 4.5], h: 2.6, kit: "concrete_green", stub: true },
    { from: [6.0, 0], to: [6.0, 4.5], h: 2.6, kit: "concrete_green", stub: true },
  ],
  openings: [
    // open: the door stands open and the room behind it shows (the props that say `behind`)
    { id: "lift", wall: 0, from: 0.3, to: 1.4, h: [0, 2.1], kit: "lift_doors" },
    { id: "door_haldane", wall: 0, from: 1.6, to: 2.5, h: [0, 2.05], kit: "door_14c", open: { depth: 2.2, side: 2.2, floor: "carpet", wall: "wallpaper" } },
    { id: "tube", wall: 0, from: 0.3, to: 3.0, h: [2.42, 2.48], kit: "neon_tube" },
    { id: "floor_sign", wall: 0, from: 3.6, to: 4.1, h: [1.55, 1.95], kit: "sign_14" },
    { id: "door_juno", wall: 1, from: 1.4, to: 2.3, h: [0, 2.05], kit: "door_14b" },
    { id: "notes", wall: 1, from: 0.45, to: 1.15, h: [1.05, 1.65], kit: "note_war" },
    // NINTH LIVE in neon over the bags (the user's wish of 10.11.2026), its cable down to a socket by the floor
    { id: "neon_ninth", wall: 1, from: 2.75, to: 4.15, h: [1.35, 1.9], kit: "neon_ninth" },
    { id: "neon_cable", wall: 1, from: 4.0, to: 4.14, h: [0.25, 1.32], kit: "neon_cable" },
  ],
  // the corner right of the stairwell: the picture's bottom edge cuts it off from the rest of the floor
  // and the floor in front of the bench round Motte's feet (a notch is left where they stand: an actor
  // stands on walkable floor), so nobody squeezes past him
  nowalk: [[5.0, 0, 1.0, 1.2], [3.55, 1.6, 1.55, 0.22], [3.55, 1.82, 0.7, 0.4], [4.38, 1.82, 0.72, 0.4]],
  // the stairs go down along +u from the top step at u 3.5 (they run on under the floor past the well)
  stairs: { id: "stairs", kit: "stairs_concrete", from: [3.5, 0], to: [5.0, 1.0], down: "+u", rise: 0.18, tread: 0.3 },
  props: [
    // Nagi·wa's camera high on the right wall over the stairwell, looking across the landing at the doors: from there it sees the
    // floor as the picture does (CAM 14 is this picture under the feed's filter, game/stadt.js)
    { id: "corner_cam", kit: "corner_cam", at: [5.0, 0.03], foot: [0.2, 0.42], h: 2.35, face: "v", block: false },
    // the lift's emergency key, a long hook, on the wall in the corner left of its doors; a prop of its own, since Juno takes it
    { id: "haken", kit: "emergency_key", at: [0.05, 0.03], foot: [0.2, 0.05], h: 2.3, block: false },
    // the bin bags against the left wall in front, under the neon, waiting for Tuesday
    { id: "bags", kit: "bin_bags", at: [0.08, 3.1], foot: [0.95, 0.65], h: 0.55 },
    // the rail: along the well's open side and back to the wall at its far end; a bench in front of it,
    // where Motte waits
    { id: "rail", kit: "stair_rail", at: [3.5, 1.0], foot: [1.5, 0.06], h: 0.95 },
    { id: "bench", kit: "bench", at: [3.65, 1.2], foot: [1.2, 0.42], h: 0.45 },
    // behind Frau Haldane's open door: her armchair with its back to the lift's shaft, so one sees her from the side
    // through the door (her TV is in front of her, right of the door, out of sight: only its light)
    { id: "armchair", kit: "armchair", at: [1.66, -0.95], foot: [0.7, 0.65], h: 1.06, behind: "door_haldane" },
  ],
  spots: {
    arrive: [0.6, 1.85, "se"], door_juno: [0.4, 1.85, "nw"], notes: [0.45, 1.1, "nw"], haldane: [2.05, 0.6, "ne"], lift: [0.85, 0.95, "ne"], haken: [0.3, 1.0, "ne"],
    motte: [3.2, 1.95, "se"], stairs: [3.2, 0.35, "se"],
    motte_feet: [4.3, 1.86, "sw"], haldane_sits: [1.88, -0.58, "se", 0.4],
  },
  // `bake` is read by the bake only (art/lib/isokit.js): the tube lights along its length and stutters with
  // its dying end; the TV and the Lull light are in Frau Haldane's room (zone: they reach the landing only
  // through her door); a cold light comes up the stairwell from the floor below
  lights: [
    { id: "tube", at: [1.6, 0.1, 2.45], r: 200, power: 1.1, color: "#c8f5d0", flicker: 0.15,
      bake: { line: [[0.32, 0.05, 2.42], [2.98, 0.05, 2.42]], reach: 4.6, power: 1.5, floor: 1.4, wrap: 0.6, off: [3, 4, 9] } },
    { id: "tv", zone: "door_haldane", at: [3.1, -0.6, 0.78], r: 60, power: 0.9, color: "#5a8cff", flicker: 0.2,
      bake: { reach: 2.8, power: 1.8, wrap: 0.4, off: [2, 7] } },
    { id: "lull", zone: "door_haldane", at: [1.81, -0.53, 1.0], r: 10, power: 0.6, color: "#6ab4ff",
      bake: { reach: 0.3, power: 1.2 } },
    { id: "ninth", at: [0.08, 3.45, 1.62], r: 60, power: 0.8, color: "#ff4fd3", flicker: 0.08,
      bake: { reach: 1.4, power: 1.6, wrap: 0.5, off: [5] } },
    { id: "below", at: [4.8, 0.5, -0.8], r: 50, power: 0.5, color: "#7a88b8",
      bake: { reach: 1.5, power: 1.4, wrap: 0.3 } },
  ],
};

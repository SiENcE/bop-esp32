// The 14th floor of the Kessel Block as a map (art/lib/isomap.js has the format): the landing outside
// Juno's flat. Every length in meters. Juno's door 14B in the left back wall, the note war beside it;
// Frau Haldane's door 14C in the right one, open, her armchair just inside in the TV's blue light; the
// stairs down to the lobby along the right wall (the well is kept near the back: the front of the floor
// falls off the screen), with Motte on them; bikes along the left wall, bin bags in the right corner.
"use strict";

ISO_MAPS.kessel_14 = {
  size: [5.0, 4.5], cell: 0.5, at: [152, 86], screen: [320, 180], margin: 0.2,
  // "c" concrete, "l" lino worn through to it in front of the doors, "." the stairwell
  floor: [
    "clllc...cc",
    "clllc...cc",
    "cccccccccc",
    "llcccccccc",
    "llcccccccc",
    "cccccccccc",
    "cccccccccc",
    "cccccccccc",
    "cccccccccc",
  ],
  walls: [
    { from: [0, 0], to: [5.0, 0], h: 2.6, kit: "concrete_green" },        // 0: the right back wall (14C's)
    { from: [0, 0], to: [0, 4.5], h: 2.6, kit: "concrete_green" },        // 1: the left back wall (14B's)
    { from: [0, 4.5], to: [5.0, 4.5], h: 2.6, kit: "concrete_green", stub: true },
    { from: [5.0, 0], to: [5.0, 4.5], h: 2.6, kit: "concrete_green", stub: true },
  ],
  openings: [
    // open: the door stands open and the room behind it shows (the props that say `behind`)
    { id: "door_haldane", wall: 0, from: 0.7, to: 1.6, h: [0, 2.05], kit: "door_14c", open: { depth: 2.0, floor: "carpet", wall: "wallpaper" } },
    { id: "tube", wall: 0, from: 0.3, to: 3.0, h: [2.42, 2.48], kit: "neon_tube" },
    { id: "floor_sign", wall: 0, from: 2.6, to: 3.1, h: [1.55, 1.95], kit: "sign_14" },
    { id: "door_juno", wall: 1, from: 1.4, to: 2.3, h: [0, 2.05], kit: "door_14b" },
    { id: "notes", wall: 1, from: 0.45, to: 1.15, h: [1.05, 1.65], kit: "note_war" },
  ],
  // the corner right of the stairwell: the picture's bottom edge cuts it off from the rest of the floor
  nowalk: [[4.0, 0, 1.0, 1.2]],
  // the stairs go down along +u from the top step at u 2.5 (they run on under the floor past the well)
  stairs: { id: "stairs", kit: "stairs_concrete", from: [2.5, 0], to: [4.0, 1.0], down: "+u", rise: 0.18, tread: 0.3 },
  props: [
    { id: "bags", kit: "bin_bags", at: [4.3, 0], foot: [0.7, 0.6], h: 0.6 },
    { id: "bikes", kit: "bikes", at: [0, 2.75], foot: [0.45, 1.6], h: 1.0 },
    { id: "rail", kit: "stair_rail", at: [2.5, 1.0], foot: [1.5, 0.06], h: 0.95 },
    // behind Frau Haldane's open door: her armchair, turned to the TV (behind the wall right of the door,
    // out of sight, its light on her)
    { id: "armchair", kit: "armchair", at: [0.25, -0.75], foot: [0.65, 0.55], h: 0.95, behind: "door_haldane" },
  ],
  spots: {
    arrive: [0.6, 1.85, "se"], door_juno: [0.4, 1.85, "nw"], notes: [0.45, 0.8, "nw"], haldane: [1.15, 0.45, "ne"],
    motte: [2.25, 0.85, "ne"], stairs: [2.25, 0.45, "ne"], bikes: [0.7, 3.4, "nw"], bags: [3.95, 1.4, "ne"],
    motte_sits: [2.95, 0.5, "sw", -0.36], haldane_sits: [0.55, -0.47, "se", 0.4],
  },
  // `bake` is read by the bake only (art/lib/isokit.js): the tube lights along its length and stutters with
  // its dying end; the TV and the Lull light are in Frau Haldane's room (zone: they reach the landing only
  // through her door); a cold light comes up the stairwell from the floor below
  lights: [
    { id: "tube", at: [1.6, 0.1, 2.45], r: 140, power: 1.1, color: "#c8f5d0", flicker: 0.15,
      bake: { line: [[0.32, 0.05, 2.42], [2.98, 0.05, 2.42]], reach: 4.6, power: 1.5, floor: 1.4, wrap: 0.6, off: [3, 4, 9] } },
    { id: "tv", zone: "door_haldane", at: [2.2, -0.9, 0.8], r: 60, power: 0.9, color: "#5a8cff", flicker: 0.2,
      bake: { reach: 2.8, power: 1.8, wrap: 0.4, off: [2, 7] } },
    { id: "lull", zone: "door_haldane", at: [0.45, -0.45, 1.1], r: 10, power: 0.6, color: "#6ab4ff",
      bake: { reach: 0.3, power: 1.2 } },
    { id: "below", at: [3.8, 0.5, -0.8], r: 50, power: 0.5, color: "#7a88b8",
      bake: { reach: 1.5, power: 1.4, wrap: 0.3 } },
  ],
};

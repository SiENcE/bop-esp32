// lerche_flur: the 4th floor's landing in the Wohnblock Lerche, where Ines lived (docs/kapitel2-design.md §3.3, §9.2), as a map (art/lib/isomap.js
// has the format), made by tools/new-room.mjs. Every length in meters. BLOCKS for the user's approval (its own kit, art/kit/lerche_flur.kit.px.js;
// the stairs, the tube are the Kessel Block's pieces). Laid out as the user drew it in the city plan (2026-11-18): 4 x 3 m, Ines' flat east
// of it; seen as CAM 25 sees it, from the south-west corner looking north-east, so u runs south along the east wall and v west along the
// north wall. In the north-east corner the stairs down (along the east wall, going south), over the stairs in the hall below; on the east
// wall 4B (Ines' door) and the meters; on the north wall 4A (a doormat before it), 4C (shoes before it) and, further north-west, the lift,
// over the hall's lift (art/rooms/lerche_eg.map.js). 4B's seal is a variant of the bake (art/rooms/lerche_flur.px.js).
"use strict";

ISO_MAPS.lerche_flur = {
  size: [3, 4], cell: 0.5, at: [176, 82], screen: [320, 200], margin: 0.2,
  // "q" linoleum, "." no floor: the stairwell (rows: v, 50 cm each; columns: u)
  floor: [
    "...qqq",
    "...qqq",
    "qqqqqq",
    "qqqqqq",
    "qqqqqq",
    "qqqqqq",
    "qqqqqq",
    "qqqqqq",
  ],
  walls: [
    { from: [0, 0], to: [3, 0], h: 2.6, kit: "lf_wall" },        // 0: the east wall, running south (the stairs, 4B, the meters)
    { from: [0, 0], to: [0, 4], h: 2.6, kit: "lf_wall" },        // 1: the north wall, running west (4A, 4C, the lift)
    { from: [0, 4], to: [3, 4], h: 2.6, kit: "lf_wall", stub: true },
    { from: [3, 0], to: [3, 4], h: 2.6, kit: "lf_wall", stub: true },
  ],
  openings: [
    { id: "door_4b", wall: 0, from: 1.6, to: 2.45, h: [0, 2.05], kit: "lf_door", sealed: true },
    { id: "meters", wall: 0, from: 2.55, to: 2.95, h: [1.0, 1.9], kit: "lf_meters" },
    { id: "door_4a", wall: 1, from: 1.05, to: 1.8, h: [0, 2.05], kit: "lf_door", lit: true },
    { id: "door_4c", wall: 1, from: 1.85, to: 2.55, h: [0, 2.05], kit: "lf_door", lit: true },
    { id: "lift", wall: 1, from: 2.6, to: 3.3, h: [0, 2.05], kit: "lf_lift", floor: 4 },
    { id: "tube", wall: 1, from: 1.0, to: 3.3, h: [2.42, 2.48], kit: "neon_tube" },
  ],
  stairs: { id: "stairs", kit: "stairs_concrete", from: [0, 0], to: [1.5, 1.0], down: "+u", rise: 0.18, tread: 0.3 },
  props: [
    // the railing round the stairwell: along its west side and its south end
    { id: "rail", kit: "lf_railing", at: [0, 1.0], foot: [1.5, 0.05], h: 0.95, block: false },
    { id: "rail_end", kit: "lf_railing", at: [1.5, 0], foot: [0.05, 1.05], h: 0.95, block: false },
    { id: "shoes", kit: "lf_shoes", at: [0.1, 2.25], foot: [0.3, 0.26], h: 0.1, block: false },
    { id: "mat", kit: "lf_mat", at: [0.05, 1.08], foot: [0.4, 0.7], h: 0.02, block: false },
  ],
  spots: {
    arrive: [0.35, 1.35, "se"], stairs: [0.35, 1.25, "ne"],
    door_4a: [0.65, 1.45, "nw"], door_4c: [0.65, 2.2, "nw"], lift: [0.6, 2.95, "nw"], door_4b: [2.05, 0.6, "ne"], meters: [2.75, 0.6, "ne"],
  },
  lights: [
    { id: "tube", at: [0.1, 2.15, 2.45], r: 200, power: 1.0, color: "#e8f0b0", flicker: 0.1,
      bake: { line: [[0.05, 1.02, 2.42], [0.05, 3.28, 2.42]], reach: 4.2, power: 1.4, floor: 1.3, wrap: 0.6, off: [5, 6] } },
  ],
};

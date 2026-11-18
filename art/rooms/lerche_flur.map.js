// lerche_flur: the 4th floor's landing in the Wohnblock Lerche, where Ines lived (docs/kapitel2-design.md §3.3, §9.2), as a map (art/lib/isomap.js
// has the format), made by tools/new-room.mjs. Every length in meters. BLOCKS for the user's approval (its own kit, art/kit/lerche_flur.kit.px.js;
// the stairs, their rail and the tube are the Kessel Block's pieces). Laid out as the user drew it in the city plan and on the picture
// (2026-11-18): 4 x 3 m, Ines' flat east of it; seen as CAM 25 sees it, from the south-west corner looking north-east, so u runs south along
// the east wall and v west along the north wall. Along the north wall the well with the stairs down, as on the Kessel's 14th floor: its top
// step at its west end, going down east to the corner, over the upper flight of the hall's stairs (art/rooms/lerche_eg.map.js, the Kessel
// lobby's flight), its rail along its south side; further west on the north wall the lift, over the hall's lift; on the east wall 4B
// (Ines' door) and the meters. 4B's seal is a variant of the bake (art/rooms/lerche_flur.px.js).
"use strict";

ISO_MAPS.lerche_flur = {
  size: [3, 4], cell: 0.5, at: [176, 82], screen: [320, 200], margin: 0.2,
  // "q" linoleum, "." no floor: the stairwell (rows: v, 50 cm each; columns: u)
  floor: [
    "..qqqq",
    "..qqqq",
    "..qqqq",
    "qqqqqq",
    "qqqqqq",
    "qqqqqq",
    "qqqqqq",
    "qqqqqq",
  ],
  walls: [
    { from: [0, 0], to: [3, 0], h: 2.6, kit: "lf_wall", marks: { stain: [0.55, 0.8], hands: [1.38, 1.6] } },   // 0: the east wall, running south (4B, the meters)
    { from: [0, 0], to: [0, 4], h: 2.6, kit: "lf_wall", marks: { crack: 2.15, ghost: [1.65, 1.4, 0.36, 0.46] } },   // 1: the north wall, running west (the stairwell, the lift)
    { from: [0, 4], to: [3, 4], h: 2.6, kit: "lf_wall", stub: true },
    { from: [3, 0], to: [3, 4], h: 2.6, kit: "lf_wall", stub: true },
  ],
  openings: [
    { id: "door_4b", wall: 0, from: 1.6, to: 2.45, h: [0, 2.05], kit: "lf_door", sealed: true, label: "4B" },
    { id: "meters", wall: 0, from: 2.55, to: 2.95, h: [1.0, 1.9], kit: "lf_meters" },
    { id: "lift", wall: 1, from: 2.6, to: 3.3, h: [0, 2.05], kit: "lf_lift", floor: 4 },
    { id: "tube", wall: 1, from: 1.6, to: 3.4, h: [2.42, 2.48], kit: "neon_tube" },
  ],
  stairs: { id: "stairs", kit: "stairs_concrete", from: [0, 0], to: [1.0, 1.5], down: "-v", rise: 0.18, tread: 0.3 },
  props: [
    // the Kessel's rail, run along the well's south side
    { id: "rail", kit: "stair_rail", along: "v", at: [1.0, 0], foot: [0.06, 1.5], h: 0.95 },
  ],
  spots: {
    arrive: [0.5, 1.8, "sw"], stairs: [0.5, 1.75, "ne"],
    lift: [0.6, 2.95, "nw"], door_4b: [2.05, 0.6, "ne"], meters: [2.75, 0.6, "ne"],
  },
  lights: [
    { id: "tube", at: [0.1, 2.5, 2.45], r: 200, power: 1.0, color: "#e8f0b0", flicker: 0.1,
      bake: { line: [[0.05, 1.62, 2.42], [0.05, 3.38, 2.42]], reach: 4.2, power: 1.4, floor: 1.3, wrap: 0.6, off: [5, 6] } },
  ],
};

// lerche_flur: the 4th floor's landing in the Wohnblock Lerche, where Ines lived (docs/kapitel2-design.md §3.3, §9.2), as a map (art/lib/isomap.js
// has the format), made by tools/new-room.mjs. Every length in meters. BLOCKS: pieces of the Kessel Block's 14th floor
// (art/kit/kessel_14.kit.px.js) stand in until its own kit is approved and painted (§14): the stairs down at the back,
// three doors (4A and 4B on the right wall, 4C on the left), the camera in the corner that is CAM 25.
"use strict";

ISO_MAPS.lerche_flur = {
  size: [5, 3], cell: 0.5, at: [128, 86], screen: [320, 180], margin: 0.2,
  // "c" screed (the 14th floor's), "." no floor: the stairwell
  floor: [
    "ccccccc...",
    "ccccccc...",
    "cccccccccc",
    "cccccccccc",
    "cccccccccc",
    "cccccccccc",
  ],
  walls: [
    { from: [0, 0], to: [5, 0], h: 2.6, kit: "concrete_green" },        // 0: the right back wall (4A, 4B)
    { from: [0, 0], to: [0, 3], h: 2.6, kit: "concrete_green" },        // 1: the left back wall (4C)
    { from: [0, 3], to: [5, 3], h: 2.6, kit: "concrete_green", stub: true },
    { from: [5, 0], to: [5, 3], h: 2.6, kit: "concrete_green", stub: true },
  ],
  openings: [
    { id: "door_4a", wall: 0, from: 0.3, to: 1.2, h: [0, 2.05], kit: "door_14b" },
    { id: "door_4b", wall: 0, from: 1.8, to: 2.7, h: [0, 2.05], kit: "door_14b" },
    { id: "door_4c", wall: 1, from: 1.2, to: 2.1, h: [0, 2.05], kit: "door_14b" },
    { id: "tube", wall: 0, from: 0.3, to: 3.2, h: [2.42, 2.48], kit: "neon_tube" },
  ],
  stairs: { id: "stairs", kit: "stairs_concrete", from: [3.5, 0], to: [5.0, 1.0], down: "+u", rise: 0.18, tread: 0.3 },
  props: [
    { id: "cam", kit: "corner_cam", at: [3.25, 0.03], foot: [0.2, 0.42], h: 2.35, face: "v", block: false },
    { id: "rail", kit: "stair_rail", at: [3.5, 1.0], foot: [1.5, 0.06], h: 0.95 },
  ],
  spots: {
    arrive: [3.1, 0.6, "sw"], stairs: [3.1, 0.45, "ne"],
    door_4a: [0.75, 0.6, "ne"], door_4b: [2.25, 0.6, "ne"], door_4c: [0.6, 1.65, "nw"],
  },
  lights: [
    { id: "tube", at: [1.7, 0.1, 2.45], r: 200, power: 1.0, color: "#e8f0b0", flicker: 0.1,
      bake: { line: [[0.32, 0.05, 2.42], [3.18, 0.05, 2.42]], reach: 4.2, power: 1.4, floor: 1.3, wrap: 0.6, off: [5, 6] } },
  ],
};

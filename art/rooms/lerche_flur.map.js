// lerche_flur: the 4th floor's landing in the Wohnblock Lerche, where Ines lived (docs/kapitel2-design.md §3.3, §9.2), as a map (art/lib/isomap.js
// has the format), made by tools/new-room.mjs. Every length in meters. BLOCKS for the user's approval (its own kit, art/kit/lerche_flur.kit.px.js;
// the stairs, their rail, the tube and the camera are the Kessel Block's pieces): on the right wall 4A (a doormat before it) and 4B, then the
// stairs down with a window over them; on the left wall the meters' cabinet and 4C with shoes before it; the camera over the doors is CAM 25. 4B's seal is a variant of the bake (art/rooms/lerche_flur.px.js).
"use strict";

ISO_MAPS.lerche_flur = {
  size: [5, 3], cell: 0.5, at: [128, 86], screen: [320, 180], margin: 0.2,
  // "q" linoleum, "." no floor: the stairwell
  floor: [
    "qqqqqqq...",
    "qqqqqqq...",
    "qqqqqqqqqq",
    "qqqqqqqqqq",
    "qqqqqqqqqq",
    "qqqqqqqqqq",
  ],
  walls: [
    { from: [0, 0], to: [5, 0], h: 2.6, kit: "lf_wall" },        // 0: the right back wall (4A, 4B, the stairs' window)
    { from: [0, 0], to: [0, 3], h: 2.6, kit: "lf_wall" },        // 1: the left back wall (the meters, 4C)
    { from: [0, 3], to: [5, 3], h: 2.6, kit: "lf_wall", stub: true },
    { from: [5, 0], to: [5, 3], h: 2.6, kit: "lf_wall", stub: true },
  ],
  openings: [
    { id: "door_4a", wall: 0, from: 0.25, to: 1.05, h: [0, 2.05], kit: "lf_door", lit: true },
    { id: "door_4b", wall: 0, from: 2.25, to: 3.15, h: [0, 2.05], kit: "lf_door", sealed: true },
    { id: "door_4c", wall: 1, from: 1.2, to: 2.1, h: [0, 2.05], kit: "lf_door", lit: true },
    { id: "lift", wall: 0, from: 1.25, to: 1.95, h: [0, 2.05], kit: "lf_lift", floor: 4 },
    { id: "meters", wall: 1, from: 0.25, to: 0.85, h: [1.0, 1.9], kit: "lf_meters" },
    { id: "window", wall: 0, from: 3.85, to: 4.7, h: [1.0, 1.95], kit: "lf_window" },
    { id: "tube", wall: 0, from: 0.3, to: 3.2, h: [2.42, 2.48], kit: "neon_tube" },
  ],
  stairs: { id: "stairs", kit: "stairs_concrete", from: [3.5, 0], to: [5.0, 1.0], down: "+u", rise: 0.18, tread: 0.3 },
  props: [
    { id: "cam", kit: "corner_cam", at: [2.0, 0.03], foot: [0.2, 0.42], h: 2.35, face: "v", block: false },
    { id: "rail", kit: "stair_rail", at: [3.5, 1.0], foot: [1.5, 0.06], h: 0.95 },
    { id: "shoes", kit: "lf_shoes", at: [0.06, 2.2], foot: [0.3, 0.26], h: 0.1, block: false },
    { id: "mat", kit: "lf_mat", at: [0.3, 0.05], foot: [0.7, 0.4], h: 0.02, block: false },
  ],
  spots: {
    arrive: [3.1, 0.6, "sw"], stairs: [3.1, 0.45, "ne"],
    lift: [1.6, 0.55, "ne"], door_4a: [0.65, 0.6, "ne"], door_4b: [2.7, 0.6, "ne"], door_4c: [0.6, 1.65, "nw"],
  },
  lights: [
    { id: "tube", at: [1.7, 0.1, 2.45], r: 200, power: 1.0, color: "#e8f0b0", flicker: 0.1,
      bake: { line: [[0.32, 0.05, 2.42], [3.18, 0.05, 2.42]], reach: 4.2, power: 1.4, floor: 1.3, wrap: 0.6, off: [5, 6] } },
  ],
};

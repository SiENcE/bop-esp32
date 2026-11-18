// ines_wohnung: Ines' flat, 4B in the Wohnblock Lerche, emptied (docs/kapitel2-design.md §3.3 W5–W7, §9.2), as a map (art/lib/isomap.js has the
// format), made by tools/new-room.mjs. Every length in meters. BLOCKS for the user's approval (its own kit, art/kit/ines_wohnung.kit.px.js):
// the fridge in the back corner with the napkin and the freezer, the empty shelves beside it, the bare mattress under the window, a plant
// nobody waters at its foot; by the left wall the clean square where the computer stood, its cables cut at the socket, a chair facing it;
// papers on the floor, a box tipped over; the door to the landing at the near end of the left wall.
"use strict";

ISO_MAPS.ines_wohnung = {
  size: [4, 4], cell: 0.5, at: [128, 92], screen: [320, 180], margin: 0.2,
  // "m" laminate
  floor: [
    "mmmmmmmm",
    "mmmmmmmm",
    "mmmmmmmm",
    "mmmmmmmm",
    "mmmmmmmm",
    "mmmmmmmm",
    "mmmmmmmm",
    "mmmmmmmm",
  ],
  walls: [
    { from: [0, 0], to: [4, 0], h: 2.6, kit: "iw_wall" },          // 0: the right back wall (the shelves, the window)
    { from: [0, 0], to: [0, 4], h: 2.6, kit: "iw_wall" },          // 1: the left back wall (the socket, the door)
    { from: [0, 4], to: [4, 4], h: 2.6, kit: "iw_wall", stub: true },
    { from: [4, 0], to: [4, 4], h: 2.6, kit: "iw_wall", stub: true },
  ],
  openings: [
    { id: "window", wall: 0, from: 2.3, to: 3.4, h: [0.9, 2.3], kit: "iw_window" },
    { id: "door", wall: 1, from: 2.8, to: 3.7, h: [0, 2.05], kit: "iw_door" },
    { id: "socket", wall: 1, from: 1.22, to: 1.34, h: [0.3, 0.42], kit: "iw_socket" },
  ],
  props: [
    { id: "fridge", kit: "iw_fridge", at: [0, 0], foot: [0.6, 0.6], h: 1.75 },
    { id: "shelves", kit: "iw_shelves", at: [0.85, 0], foot: [1.1, 0.32], h: 1.9 },
    { id: "bed", kit: "iw_mattress", at: [2.1, 0.12], foot: [1.8, 0.9], h: 0.18 },
    { id: "plant", kit: "iw_plant", at: [3.55, 1.25], foot: [0.3, 0.3], h: 0.7 },
    { id: "chair", kit: "iw_chair", at: [0.85, 1.15], foot: [0.4, 0.4], h: 0.9 },
    { id: "box", kit: "iw_box", at: [1.9, 2.15], foot: [0.5, 0.4], h: 0.35 },
  ],
  spots: {
    arrive: [0.5, 3.25, "se"], door: [0.4, 3.25, "nw"], fridge: [0.35, 0.95, "ne"], chair: [1.5, 1.9, "nw"],
    bed: [2.8, 1.45, "ne"], window: [2.85, 1.3, "ne"], shelves: [1.4, 0.7, "ne"], plant: [3.0, 1.6, "se"], box: [2.15, 2.95, "ne"],
  },
  lights: [
    { id: "street", at: [2.85, 0, 1.6], r: 90, power: 0.9, color: "#9ab0ff", flicker: 0.05,
      bake: { through: "window", from: [2.85, -2.6, 6.4], reach: 3.6, power: 2.4 } },
    { id: "hall", at: [0.02, 3.25, 0.02], r: 20, power: 0.5, color: "#c8d070",
      bake: { through: "door", from: [-1.6, 3.25, 0.04], reach: 0.8, power: 1.3, wrap: 0 } },
  ],
};

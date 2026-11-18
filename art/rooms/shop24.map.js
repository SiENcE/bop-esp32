// shop24: the 24-hour shop on Fischermann Street (Chapter 2, the user's wish, 2026-11-18: Juno can go in; a side quest is planned there), as a
// map (art/lib/isomap.js has the format), made by tools/new-room.mjs. Every length in meters. BLOCKS (to be painted later): seen from the
// south-east, so its north wall is the glass front onto the street (u east), its west wall the drink fridges. Two rows of shelves, the counter
// with the register by the door, cold tubes over it all; in the window the 24H sign seen from behind.
"use strict";

ISO_MAPS.shop24 = {
  size: [5, 4], cell: 0.5, at: [144, 86], screen: [320, 180], margin: 0.2,
  // "s" the shop's pale tiles
  floor: [
    "ssssssssss",
    "ssssssssss",
    "ssssssssss",
    "ssssssssss",
    "ssssssssss",
    "ssssssssss",
    "ssssssssss",
    "ssssssssss",
  ],
  walls: [
    { from: [0, 0], to: [5, 0], h: 2.6, kit: "sh_wall" },          // 0: the north wall, the glass front onto the street
    { from: [0, 0], to: [0, 4], h: 2.6, kit: "sh_wall" },          // 1: the west wall, the fridges
    { from: [0, 4], to: [5, 4], h: 2.6, kit: "sh_wall", stub: true },
    { from: [5, 0], to: [5, 4], h: 2.6, kit: "sh_wall", stub: true },
  ],
  openings: [
    { id: "window", wall: 0, from: 0.3, to: 1.9, h: [0.5, 2.3], kit: "sh_window", sign: true },
    { id: "door", wall: 0, from: 2.1, to: 2.9, h: [0, 2.2], kit: "sh_window", door: true },
    { id: "window2", wall: 0, from: 3.1, to: 4.7, h: [0.5, 2.3], kit: "sh_window" },
    { id: "fridges", wall: 1, from: 0.3, to: 3.3, h: [0, 2.0], kit: "sh_fridges" },
  ],
  props: [
    { id: "counter", kit: "sh_counter", at: [3.9, 0.6], foot: [0.6, 1.4], h: 1.0 },   // from the front into the shop, the cashier behind it to the east
    { id: "shelf_a", kit: "sh_shelf", at: [1.1, 1.7], foot: [2.0, 0.45], h: 1.5 },
    { id: "shelf_b", kit: "sh_shelf", at: [1.1, 2.9], foot: [2.0, 0.45], h: 1.5 },
  ],
  spots: {
    arrive: [2.5, 0.65, "se"], door: [2.5, 0.55, "ne"], counter: [3.55, 1.4, "se"], fridges: [0.65, 1.6, "nw"],
    shelves: [2.3, 2.45, "nw"],
  },
  lights: [
    { id: "tubes", at: [2.5, 2.0, 2.55], r: 200, power: 1.1, color: "#d8f0ff", flicker: 0.04,
      bake: { line: [[1.0, 1.5, 2.55], [4.0, 1.5, 2.55]], reach: 4.5, power: 1.6, floor: 1.3, wrap: 0.6 } },
    { id: "fridges", at: [0.1, 1.8, 1.0], r: 60, power: 0.7, color: "#62def0",
      bake: { line: [[0.05, 0.4, 1.0], [0.05, 3.2, 1.0]], reach: 1.2, power: 1.4 } },
  ],
};

// Juno's flat as a map (art/lib/isomap.js has the format; docs/ideas/iso-tiles.md): Kessel Block, 14th
// floor. Every length in meters. The same room as art/rooms/flat.px.js, at the new scale (style guide §4:
// 30 px per meter of height): the deck along the right wall with the window beyond it, the bed along the
// left wall with the pinboard over it, the fridge in the corner, the door near the front of the left wall.
"use strict";

ISO_MAPS.flat = {
  size: [5.0, 4.5], cell: 0.5, at: [152, 86], screen: [320, 180], margin: 0.2,
  // vinyl in 1 m strips; "v" vinyl, "w" a worn patch in front of the deck
  floor: [
    "vvvvvvvvvv",
    "vvvvvvvvvv",
    "vvwwwvvvvv",
    "vvwwwvvvvv",
    "vvvvvvvvvv",
    "vvvvvvvvvv",
    "vvvvvvvvvv",
    "vvvvvvvvvv",
    "vvvvvvvvvv",
  ],
  walls: [
    { from: [0, 0], to: [5.0, 0], h: 2.6, kit: "plaster_blue" },          // 0: the right back wall (the deck's)
    { from: [0, 0], to: [0, 4.5], h: 2.6, kit: "plaster_grey" },          // 1: the left back wall (the bed's)
    { from: [0, 4.5], to: [5.0, 4.5], h: 2.6, kit: "plaster_grey", stub: true },   // the near walls, cut
    { from: [5.0, 0], to: [5.0, 4.5], h: 2.6, kit: "plaster_blue", stub: true },
  ],
  openings: [
    { id: "window", wall: 0, from: 3.3, to: 4.6, h: [0.9, 2.4], kit: "window_rain" },
    { id: "door", wall: 1, from: 3.4, to: 4.3, h: [0, 2.05], kit: "door_flat" },
    { id: "pinboard", wall: 1, from: 1.5, to: 2.8, h: [1.2, 2.1], kit: "pinboard" },
    { id: "band", wall: 1, from: 1.0, to: 3.3, h: [2.3, 2.36], kit: "led_strip" },
  ],
  props: [
    { id: "fridge", kit: "fridge", at: [0, 0], foot: [0.6, 0.6], h: 1.8 },
    { id: "deck", kit: "deck_rig", at: [0.8, 0], foot: [1.8, 0.7], h: 1.35 },
    { id: "chair", kit: "chair", at: [2.1, 0.95], foot: [0.45, 0.45], h: 0.95 },
    { id: "noodles", kit: "cup_tower", at: [2.8, 0.05], foot: [0.4, 0.4], h: 1.0 },
    { id: "laundry", kit: "laundry", at: [3.5, 0.05], foot: [0.8, 0.5], h: 0.35 },
    { id: "bed", kit: "bed_pallet", at: [0, 1.3], foot: [1.0, 2.0], h: 0.45 },
    { id: "box", kit: "box_old", at: [1.15, 2.75], foot: [0.5, 0.45], h: 0.4 },
  ],
  spots: {
    start: [1.7, 1.15, "ne"], deck: [1.7, 1.15, "ne"], fridge: [0.35, 0.95, "ne"], bed: [1.3, 2.1, "nw"],
    box: [1.4, 3.45, "nw"], window: [4.0, 0.9, "ne"], laundry: [3.9, 0.8, "ne"], noodles: [3.0, 0.75, "ne"],
    pinboard: [1.3, 2.0, "nw"], door: [0.4, 3.85, "nw"], arrive: [0.5, 3.85, "se"],
  },
  lights: [
    { id: "band", at: [0.05, 2.1, 2.3], r: 150, power: 1.3, color: "#ffd58a", flicker: 0.02 },
    { id: "deck", at: [1.7, 0.2, 1.2], r: 64, power: 1.0, color: "#62def0", flicker: 0.08 },
    { id: "neon", at: [3.9, 0, 1.7], r: 72, power: 0.9, color: "#ff4fd3", flicker: 0.12 },
  ],
};

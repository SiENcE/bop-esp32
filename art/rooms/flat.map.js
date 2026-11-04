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
    // the small things on the walls: the tapped line up behind the rig, the sockets, the rent calendar,
    // the intercom and the light switch by the door, the vent under the ceiling
    { id: "tap", wall: 0, from: 0.92, to: 1.04, h: [0.75, 2.58], kit: "conduit" },
    { id: "socket_desk", wall: 0, from: 1.55, to: 1.68, h: [0.22, 0.34], kit: "socket", plug: true },
    { id: "socket_bed", wall: 1, from: 1.08, to: 1.21, h: [0.5, 0.62], kit: "socket", up: 1.8, down: 0.12, plug: true },
    { id: "calendar", wall: 1, from: 2.86, to: 3.12, h: [1.02, 1.44], kit: "calendar" },
    { id: "intercom", wall: 1, from: 3.17, to: 3.31, h: [0.9, 1.46], kit: "intercom" },
    { id: "vent", wall: 0, from: 2.8, to: 3.12, h: [2.14, 2.42], kit: "vent" },
  ],
  props: [
    { id: "fridge", kit: "fridge", at: [0, 0], foot: [0.6, 0.6], h: 1.8 },
    { id: "deck", kit: "deck_rig", at: [0.8, 0], foot: [1.8, 0.7], h: 1.6 },
    { id: "chair", kit: "chair", at: [2.1, 0.95], foot: [0.45, 0.45], h: 0.95 },
    { id: "noodles", kit: "cup_tower", at: [2.8, 0.05], foot: [0.4, 0.4], h: 0.85 },
    { id: "laundry", kit: "laundry", at: [3.5, 0.05], foot: [0.8, 0.5], h: 0.35 },
    { id: "bed", kit: "bed_pallet", at: [0, 1.3], foot: [1.0, 2.0], h: 0.45 },
    { id: "box", kit: "box_old", at: [1.15, 2.75], foot: [0.5, 0.45], h: 0.4 },
  ],
  spots: {
    start: [1.7, 1.15, "ne"], deck: [1.7, 1.15, "ne"], fridge: [0.35, 0.95, "ne"], bed: [1.3, 2.1, "nw"],
    box: [1.4, 3.45, "nw"], window: [4.0, 0.9, "ne"], laundry: [3.9, 0.8, "ne"], noodles: [3.0, 0.75, "ne"],
    pinboard: [1.3, 2.0, "nw"], door: [0.4, 3.85, "nw"], arrive: [0.5, 3.85, "se"],
  },
  // `bake` is read by the bake only (art/lib/isokit.js): the strip lights along its length, the screens
  // shine forward, the neon comes in through the window from the sign across the street (so its pool on
  // the floor has the window's shape), the hallway's light through the gap under the door
  lights: [
    { id: "band", at: [0.05, 2.1, 2.3], r: 150, power: 1.3, color: "#ffd58a", flicker: 0.02,
      bake: { line: [[0.06, 1.0, 2.3], [0.06, 3.3, 2.3]], reach: 4.0, power: 1.6, floor: 1.6, wrap: 0.9 } },
    { id: "deck", at: [1.6, 0.25, 1.1], r: 64, power: 1.0, color: "#62def0", flicker: 0.08,
      bake: { at: [1.6, 0.3, 1.55], reach: 3.2, power: 2.3, floor: 1.2, dir: [0, 1, -0.6], wrap: 0.5 } },
    { id: "neon", at: [3.9, 0, 1.7], r: 72, power: 0.9, color: "#ff4fd3", flicker: 0.12,
      bake: { through: "window", from: [3.4, -2.6, 7.4], reach: 3.2, power: 2.5, off: [7, 8, 10] } },
    { id: "hall", at: [0.02, 3.85, 0.02], r: 20, power: 0.5, color: "#8e96a8",
      bake: { through: "door", from: [-1.6, 3.85, 0.04], reach: 0.8, power: 1.3, wrap: 0 } },
  ],
};

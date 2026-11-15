// lantern_versteck: Lantern's hide, a half-drowned shop at the end of the cable (docs/kapitel2-design.md §3.5 L5, §9.2), as a map
// (art/lib/isomap.js has the format), made by tools/new-room.mjs. Every length in meters. BLOCKS: pieces of Juno's flat (art/kit/flat.kit.px.js)
// stand in until its look is approved (§9.2 plans a stage seen from the front, as Sable's booth, with Lantern facing Juno): the desk with its
// screens for his sender, the shop's window, the door out to the raft. Lantern himself is his feed figure for now (§10).
"use strict";

ISO_MAPS.lantern_versteck = {
  size: [4, 4], cell: 0.5, at: [128, 92], screen: [320, 180], margin: 0.2,
  // "v" vinyl (Juno's flat's, for now)
  floor: [
    "vvvvvvvv",
    "vvvvvvvv",
    "vvvvvvvv",
    "vvvvvvvv",
    "vvvvvvvv",
    "vvvvvvvv",
    "vvvvvvvv",
    "vvvvvvvv",
  ],
  walls: [
    { from: [0, 0], to: [4, 0], h: 2.6, kit: "plaster_blue" },          // 0: the right back wall (the sender)
    { from: [0, 0], to: [0, 4], h: 2.6, kit: "plaster_grey" },          // 1: the left back wall (the way out to the raft)
    { from: [0, 4], to: [4, 4], h: 2.6, kit: "plaster_grey", stub: true },
    { from: [4, 0], to: [4, 4], h: 2.6, kit: "plaster_blue", stub: true },
  ],
  openings: [
    { id: "window", wall: 0, from: 2.9, to: 3.8, h: [0.9, 2.4], kit: "window_rain" },
    { id: "door", wall: 1, from: 2.8, to: 3.7, h: [0, 2.05], kit: "door_flat" },
  ],
  props: [
    { id: "sender", kit: "deck_rig", at: [0.6, 0], foot: [1.8, 0.7], h: 1.6 },
  ],
  spots: {
    arrive: [0.6, 3.25, "se"], door: [0.4, 3.25, "nw"], lantern: [1.5, 1.15, "se"], talk: [1.7, 2.3, "nw"],
  },
  lights: [
    { id: "screens", at: [1.5, 0.4, 1.2], r: 90, power: 0.9, color: "#7cff9a", flicker: 0.08, bake: { reach: 3.2, power: 1.6, floor: 1.4 } },
    { id: "lantern", at: [1.5, 1.15, 1.3], r: 40, power: 0.6, color: "#ffc860", flicker: 0.15, bake: { reach: 1.2, power: 1.2 } },
  ],
};

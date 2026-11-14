// ines_wohnung: Ines' flat, 4B in the Wohnblock Lerche, emptied (docs/kapitel2-design.md §3.3 W5–W7, §9.2), as a map (art/lib/isomap.js has the
// format), made by tools/new-room.mjs. Every length in meters. BLOCKS: pieces of Juno's flat (art/kit/flat.kit.px.js) stand in until its own
// kit is approved and painted (§14): the fridge with the napkin and the freezer, the mattress, a chair in front of where the computer stood,
// the window with the street's light, the door to the landing.
"use strict";

ISO_MAPS.ines_wohnung = {
  size: [4, 4], cell: 0.5, at: [128, 92], screen: [320, 180], margin: 0.2,
  // "v" vinyl (Juno's flat's)
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
    { from: [0, 0], to: [4, 0], h: 2.6, kit: "plaster_grey" },          // 0: the right back wall (the window)
    { from: [0, 0], to: [0, 4], h: 2.6, kit: "plaster_grey" },          // 1: the left back wall (the door)
    { from: [0, 4], to: [4, 4], h: 2.6, kit: "plaster_grey", stub: true },
    { from: [4, 0], to: [4, 4], h: 2.6, kit: "plaster_grey", stub: true },
  ],
  openings: [
    { id: "window", wall: 0, from: 2.2, to: 3.4, h: [0.9, 2.4], kit: "window_rain" },
    { id: "door", wall: 1, from: 2.8, to: 3.7, h: [0, 2.05], kit: "door_flat" },
  ],
  props: [
    { id: "fridge", kit: "fridge", at: [0, 0], foot: [0.6, 0.6], h: 1.8 },
    { id: "chair", kit: "chair", at: [1.3, 0.25], foot: [0.45, 0.45], h: 0.95 },
    { id: "bed", kit: "bed_pallet", at: [2.9, 1.4], foot: [1.0, 2.0], h: 0.45 },
  ],
  spots: {
    arrive: [0.5, 3.25, "se"], door: [0.4, 3.25, "nw"], fridge: [0.35, 0.95, "ne"], chair: [1.5, 1.0, "ne"],
    bed: [2.6, 2.4, "ne"], window: [2.8, 0.8, "ne"],
  },
  lights: [
    { id: "street", at: [2.8, 0, 1.7], r: 90, power: 0.9, color: "#9ab0ff", flicker: 0.05,
      bake: { through: "window", from: [2.8, -2.6, 6.4], reach: 3.6, power: 2.4 } },
    { id: "hall", at: [0.02, 3.25, 0.02], r: 20, power: 0.5, color: "#c8d070",
      bake: { through: "door", from: [-1.6, 3.25, 0.04], reach: 0.8, power: 1.3, wrap: 0 } },
  ],
};

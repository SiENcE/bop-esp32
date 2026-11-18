// ines_wohnung: Ines' flat, 4B in the Wohnblock Lerche, emptied (docs/kapitel2-design.md §3.3 W5–W7, §9.2), as a map (art/lib/isomap.js has the
// format), made by tools/new-room.mjs. Every length in meters. BLOCKS for the user's approval (its own kit, art/kit/ines_wohnung.kit.px.js),
// "both mixed" (the user's choice, 2026-11-18): a plain flat in the Ninth, and a few good things that say she had money. Bigger than a screen
// (432x270, it scrolls), with a balcony Juno can step out on (the user's wish, 2026-11-18): from there, over the roofs, the water and the
// swamp beyond (painted where the bake leaves the picture empty, art/rooms/ines_wohnung.px.js).
//   On the right back wall: in the corner the fridge (the napkin, the freezer) and a short counter with an espresso machine, a shelf of real
//   wood, empty; the first window with a low platform bed under it, its bedding pulled off onto the floor; the second window, a leather
//   armchair before it with an arc lamp, a big plant nobody waters. A good rug in the middle. By the left wall the clean square where the
//   computer stood (now her desk, the clean squares on its top), its cables cut at the socket, the ergonomic chair before it; papers, a box tipped over; the door at the near end.
//   On the right, through the glass door in the cut partition, the balcony: wet tiles, a railing round it, a folding chair, two pots of herbs.
"use strict";

ISO_MAPS.ines_wohnung = {
  size: [8, 4.5], cell: 0.5, at: [160, 86], screen: [432, 270], margin: 0.2,
  // "m" laminate (the rug is in it), "b" the balcony's wet tiles, "." no floor
  floor: [
    "mmmmmmmmmmmmmbbb",
    "mmmmmmmmmmmmmbbb",
    "mmmmmmmmmmmmmbbb",
    "mmmmmmmmmmmmmbbb",
    "mmmmmmmmmmmmmbbb",
    "mmmmmmmmmmmmm...",
    "mmmmmmmmmmmmm...",
    "mmmmmmmmmmmmm...",
    "mmmmmmmmmmmmm...",
  ],
  walls: [
    { from: [0, 0], to: [6.5, 0], h: 2.6, kit: "iw_wall", end: "flush" },   // 0: the right back wall (kitchen, shelf, the windows); it ends where the balcony begins
    { from: [0, 0], to: [0, 4.5], h: 2.6, kit: "iw_wall" },          // 1: the left back wall (the socket, the door)
    { from: [0, 4.5], to: [6.5, 4.5], h: 2.6, kit: "iw_wall", stub: true },
    { from: [6.5, 2.5], to: [6.5, 4.5], h: 2.6, kit: "iw_wall", stub: true },
    // the partition to the balcony, cut: the glass door's gap between v 1.15 and 2.05
    { from: [6.5, 0], to: [6.5, 1.15], h: 2.6, kit: "iw_wall", stub: true },
    { from: [6.5, 2.05], to: [6.5, 2.5], h: 2.6, kit: "iw_wall", stub: true },
  ],
  openings: [
    { id: "window", wall: 0, from: 2.55, to: 3.55, h: [0.9, 2.3], kit: "iw_window" },
    { id: "window2", wall: 0, from: 4.6, to: 5.6, h: [0.9, 2.3], kit: "iw_window" },
    { id: "door", wall: 1, from: 3.4, to: 4.3, h: [0, 2.05], kit: "iw_door" },
    { id: "socket", wall: 1, from: 1.22, to: 1.34, h: [0.3, 0.42], kit: "iw_socket" },
  ],
  props: [
    { id: "fridge", kit: "iw_fridge", at: [0, 0], foot: [0.6, 0.6], h: 1.75 },
    { id: "counter", kit: "iw_counter", at: [0.6, 0], foot: [0.9, 0.6], h: 0.9 },
    { id: "shelves", kit: "iw_shelves", at: [1.65, 0], foot: [0.65, 0.32], h: 1.9 },
    { id: "bed", kit: "iw_bed", at: [2.45, 0.1], foot: [1.6, 1.0], h: 0.32 },
    { id: "armchair", kit: "iw_armchair", at: [4.75, 0.9], foot: [0.65, 0.6], h: 1.0 },   // a wingback (the user's model, 2026-11-18)
    { id: "lamp", kit: "iw_arclamp", at: [5.55, 1.15], foot: [0.14, 0.14], h: 1.9, block: false },
    { id: "plant", kit: "iw_plant", at: [5.9, 0.1], foot: [0.4, 0.4], h: 1.0 },
    { id: "desk", kit: "iw_desk", at: [0.04, 0.95], foot: [0.6, 0.85], h: 0.75 },   // her work table (the user's wish, 2026-11-18), the computer gone from it
    { id: "chair", kit: "iw_officechair", at: [0.75, 1.15], foot: [0.45, 0.45], h: 1.05 },
    { id: "box", kit: "iw_box", at: [1.3, 3.0], foot: [0.5, 0.4], h: 0.35 },
    // the balcony: the railing round it (along its back edge, its right end, its near edge: it blocks, so Juno keeps off it and the floor's
    // edge), a folding chair, two pots of herbs
    { id: "rail_back", kit: "iw_railing", at: [6.55, 0], foot: [1.45, 0.05], h: 1.0 },
    { id: "rail_end", kit: "iw_railing", at: [7.95, 0], foot: [0.05, 2.5], h: 1.0 },
    { id: "rail_near", kit: "iw_railing", at: [6.55, 2.45], foot: [1.45, 0.05], h: 1.0 },
    { id: "deckchair", kit: "iw_deckchair", at: [7.3, 1.5], foot: [0.5, 0.55], h: 0.8 },
    { id: "herbs", kit: "iw_herbs", at: [6.6, 0.25], foot: [0.5, 0.25], h: 0.4 },   // a little out from under the railing (the user)
  ],
  spots: {
    arrive: [0.5, 3.85, "se"], door: [0.4, 3.85, "nw"], fridge: [1.0, 0.9, "nw"], counter: [1.05, 0.95, "ne"], chair: [1.5, 1.9, "nw"],
    shelves: [1.95, 0.75, "ne"], bed: [3.25, 1.55, "ne"], window: [3.05, 1.5, "ne"], window2: [5.1, 1.9, "ne"], armchair: [4.4, 1.9, "se"],
    plant: [6.0, 0.95, "ne"], box: [1.7, 3.6, "ne"], balcony_door: [6.1, 1.6, "se"], balcony: [7.0, 0.85, "ne"], view: [7.4, 0.7, "ne"],
  },
  lights: [
    { id: "street", at: [3.05, 0, 1.6], r: 90, power: 0.9, color: "#9ab0ff", flicker: 0.05,
      bake: { through: "window", from: [3.05, -2.6, 6.4], reach: 3.6, power: 2.4 } },
    { id: "street2", at: [5.1, 0, 1.6], r: 90, power: 0.8, color: "#9ab0ff", flicker: 0.05,
      bake: { through: "window2", from: [5.1, -2.6, 6.4], reach: 3.4, power: 2.2 } },
    // the night over the balcony: the city's glow from above, cold
    { id: "sky", at: [7.2, 1.2, 3.0], r: 120, power: 0.8, color: "#8aa0d8",
      bake: { reach: 3.0, power: 1.6, floor: 1.4, wrap: 0.5 } },
    { id: "hall", at: [0.02, 3.85, 0.02], r: 20, power: 0.5, color: "#c8d070",
      bake: { through: "door", from: [-1.6, 3.85, 0.04], reach: 0.8, power: 1.3, wrap: 0 } },
  ],
};

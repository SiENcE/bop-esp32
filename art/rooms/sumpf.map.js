// sumpf: the drowned streets of the old city under the Drain Market (docs/kapitel2-design.md §3.5 L4, §9.2), as a map (art/lib/isomap.js has
// the format), made by tools/new-room.mjs. Every length in meters. BLOCKS: pieces of the alley (art/kit/gasse.kit.px.js) stand in until its
// own kit is approved and painted (§14): a jetty along the left wall from the stairs down at the front to where it ends in the water at the
// back, Lantern's cable on the wall, everything else black water ("." no floor), and the raft on its rope out of reach beyond the jetty's end.
"use strict";

ISO_MAPS.sumpf = {
  size: [2.5, 5], cell: 0.5, at: [196, 78], screen: [320, 180], margin: 0.2,
  // "p" the jetty's boards (the alley's paving, for now), "." water
  floor: [
    ".....",
    ".....",
    ".....",
    "ppp..",
    "ppp..",
    "ppp..",
    "ppp..",
    "ppp..",
    "ppp..",
    "ppp..",
  ],
  walls: [
    { from: [0, 0], to: [2.5, 0], h: 2.6, kit: "gs_wall" },      // 0: the right back wall: a house front, drowned to the first floor
    { from: [0, 0], to: [0, 5], h: 2.6, kit: "gs_wall" },        // 1: the left back wall: the cable along it, the stairs up at the front
    { from: [0, 5], to: [2.5, 5], h: 2.6, kit: "gs_wall", stub: true },
    { from: [2.5, 0], to: [2.5, 5], h: 2.6, kit: "gs_wall", stub: true },
  ],
  openings: [
    { id: "stairs", wall: 1, from: 3.4, to: 4.7, h: [0, 2.2], kit: "gs_market" },
  ],
  props: [
    { id: "cable", kit: "gs_cables", at: [0.05, 1.6], foot: [0.1, 0.1], h: 2.4, block: false },
    { id: "raft", kit: "gs_crates", at: [1.5, 0.25], foot: [0.8, 0.8], h: 0.35, block: false },
  ],
  spots: {
    arrive: [0.7, 4.2, "ne"], stairs: [0.4, 4.05, "nw"], cable: [0.45, 1.9, "nw"], end: [0.75, 1.75, "ne"],
  },
  lights: [
    { id: "cable", at: [0.3, 1.6, 1.4], r: 60, power: 0.7, color: "#7cff9a", flicker: 0.1, bake: { reach: 2.0, power: 1.4, floor: 1.2 } },
    { id: "market", at: [1.2, 3.8, 2.4], r: 90, power: 0.5, color: "#ff4fd3", flicker: 0.05, bake: { reach: 3.5, power: 1.0, floor: 1.0 } },
  ],
};

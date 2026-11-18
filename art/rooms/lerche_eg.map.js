// lerche_eg: the Wohnblock Lerche's hall on the ground floor (Chapter 2), as a map (art/lib/isomap.js has the format), made by tools/new-room.mjs.
// Every length in meters. BLOCKS for the user's approval (2026-11-18): the same house as the 4th floor's landing (art/rooms/lerche_flur.map.js),
// laid under it: the lift at the same place of the right back wall (u 1.25 to 1.95), the flight up ending at u 3.5 where the landing's stairs
// begin on every floor, turning on a landing in the corner and coming down along the right stub wall; on the right wall the mailboxes and the
// notice board, on the left wall the street door to Weg_1 (its keypad and doorbell camera outside: CAM 24), a pram parked beside it.
"use strict";

ISO_MAPS.lerche_eg = {
  size: [5, 3], cell: 0.5, at: [128, 86], screen: [320, 180], margin: 0.2,
  // "x" terrazzo, wet from the door
  floor: [
    "xxxxxxxxxx",
    "xxxxxxxxxx",
    "xxxxxxxxxx",
    "xxxxxxxxxx",
    "xxxxxxxxxx",
    "xxxxxxxxxx",
  ],
  walls: [
    { from: [0, 0], to: [5, 0], h: 2.6, kit: "lf_wall" },        // 0: the right back wall (mailboxes, board, lift, stairs)
    { from: [0, 0], to: [0, 3], h: 2.6, kit: "lf_wall" },        // 1: the left back wall (the street door)
    { from: [0, 3], to: [5, 3], h: 2.6, kit: "lf_wall", stub: true },
    { from: [5, 0], to: [5, 3], h: 2.6, kit: "lf_wall", stub: true },
  ],
  openings: [
    { id: "mailboxes", wall: 0, from: 0.2, to: 1.1, h: [0.9, 1.7], kit: "le_mailboxes" },
    { id: "board", wall: 0, from: 2.1, to: 2.75, h: [1.0, 1.6], kit: "le_board" },
    { id: "lift", wall: 0, from: 1.25, to: 1.95, h: [0, 2.05], kit: "lf_lift", floor: 0 },
    { id: "door", wall: 1, from: 0.9, to: 1.9, h: [0, 2.2], kit: "le_door" },
  ],
  props: [
    { id: "stairs", kit: "stairs_up_turn", at: [3.5, 0], foot: [0.85, 0.95], landing: [0.65, 0.95], lower: 1.3, h: 2.6, steps: 16 },
    { id: "pram", kit: "le_pram", at: [0.08, 2.15], foot: [0.45, 0.7], h: 0.75 },
    { id: "flyers", kit: "le_flyers", at: [0.4, 0.08], foot: [0.8, 0.4], h: 0.01, block: false },
  ],
  spots: {
    arrive: [0.55, 1.4, "se"], door: [0.45, 1.4, "nw"], mailboxes: [0.65, 0.6, "ne"], board: [2.45, 0.6, "ne"],
    lift: [1.6, 0.55, "ne"], stairs: [4.65, 2.6, "ne"], pram: [0.75, 2.5, "nw"],
  },
  lights: [
    { id: "bulb", at: [2.4, 1.4, 2.5], r: 200, power: 1.0, color: "#e8e0a0", flicker: 0.06,
      bake: { reach: 3.8, power: 1.5, floor: 1.3, wrap: 0.6 } },
    { id: "street", at: [0.02, 1.4, 1.4], r: 90, power: 0.8, color: "#ff4fd3", flicker: 0.12,
      bake: { through: "door", from: [-2.2, 1.4, 2.4], reach: 3.0, power: 2.2, off: [5, 6] } },
  ],
};

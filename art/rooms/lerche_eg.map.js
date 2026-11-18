// lerche_eg: the Wohnblock Lerche's hall on the ground floor (Chapter 2), as a map (art/lib/isomap.js has the format), made by tools/new-room.mjs.
// Every length in meters. BLOCKS for the user's approval (2026-11-18), laid out as the user drew it in the city plan: the whole house, 8.5 x 3 m,
// seen from the south-east corner looking north-west (u east along the north wall, v south along the west wall). In the north wall, under the
// 4th floor's landing (art/rooms/lerche_flur.map.js): the lift further north-west, the flight up in the north-east of the landing's part,
// coming up from the south and turning on a landing at the top; east of it, under Ines' flat, the mailboxes, the notice board, a bicycle
// chained to the pipe, the pram; the street door in the south-east corner, a gap in the near wall onto Weg_1 (its keypad and doorbell camera
// outside: CAM 24), Weg_1's neon falling in.
"use strict";

ISO_MAPS.lerche_eg = {
  size: [8.5, 3], cell: 0.5, at: [112, 84], screen: [400, 272], margin: 0.2,
  // "x" terrazzo, wet from the door
  floor: [
    "xxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxx",
  ],
  walls: [
    { from: [0, 0], to: [8.5, 0], h: 2.6, kit: "lf_wall" },        // 0: the north wall (the lift, the stairs, the mailboxes, the board)
    { from: [0, 0], to: [0, 3], h: 2.6, kit: "lf_wall" },          // 1: the west wall
    // the south wall toward Weg_1, cut: the street door's gap in the south-east corner
    { from: [0, 3], to: [7.3, 3], h: 2.6, kit: "lf_wall", stub: true },
    { from: [8.2, 3], to: [8.5, 3], h: 2.6, kit: "lf_wall", stub: true },
    { from: [8.5, 0], to: [8.5, 3], h: 2.6, kit: "lf_wall", stub: true },
  ],
  openings: [
    { id: "lift", wall: 0, from: 0.75, to: 1.45, h: [0, 2.05], kit: "lf_lift", floor: 0 },
    { id: "mailboxes", wall: 0, from: 5.0, to: 6.1, h: [0.9, 1.7], kit: "le_mailboxes" },
    { id: "board", wall: 0, from: 6.3, to: 6.9, h: [1.0, 1.6], kit: "le_board" },
  ],
  props: [
    { id: "stairs", kit: "stairs_up_turn", at: [2.9, 0], foot: [0.6, 0.95], landing: [0.6, 0.95], lower: 1.2, h: 2.6, steps: 16 },
    { id: "bike", kit: "le_bike", at: [7.1, 0.05], foot: [1.2, 0.2], h: 0.8 },
    { id: "pram", kit: "le_pram", at: [4.6, 0.6], foot: [0.45, 0.7], h: 0.75 },
    { id: "flyers", kit: "le_flyers", at: [5.1, 0.08], foot: [0.9, 0.4], h: 0.01, block: false },
  ],
  spots: {
    arrive: [7.75, 2.55, "nw"], door: [7.75, 2.75, "se"], mailboxes: [5.55, 0.65, "ne"], board: [6.6, 0.65, "ne"],
    lift: [1.1, 0.55, "ne"], stairs: [3.8, 2.5, "ne"], pram: [4.85, 1.75, "ne"], bike: [7.7, 0.75, "ne"],
  },
  lights: [
    { id: "bulb", at: [2.2, 1.4, 2.5], r: 200, power: 1.0, color: "#e8e0a0", flicker: 0.06,
      bake: { reach: 3.6, power: 1.5, floor: 1.3, wrap: 0.6 } },
    { id: "bulb2", at: [6.2, 1.4, 2.5], r: 160, power: 0.8, color: "#e8e0a0", flicker: 0.2,
      bake: { reach: 3.0, power: 1.3, floor: 1.3, wrap: 0.6, off: [3, 4, 9] } },
    { id: "street", at: [7.75, 3.3, 1.4], r: 90, power: 0.8, color: "#ff4fd3", flicker: 0.12,
      bake: { reach: 2.6, power: 2.0, floor: 1.4 } },
  ],
};

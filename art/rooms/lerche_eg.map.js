// lerche_eg: the Wohnblock Lerche's hall on the ground floor (Chapter 2), as a map (art/lib/isomap.js has the format), made by tools/new-room.mjs.
// Every length in meters. BLOCKS for the user's approval (2026-11-18), laid out as the user drew it in the city plan: the whole house, 8.5 x 4 m
// (a metre deeper to the south than first drawn, the user's wish, so the flight doesn't end against the near wall),
// seen from the south-east corner looking north-west (u east along the north wall, v south along the west wall). In the north wall, under the
// 4th floor's landing (art/rooms/lerche_flur.map.js): the lift further north-west, the flight up in the north-east of the landing's part,
// coming up from the south and turning on a landing at the top; east of it, under Ines' flat, the mailboxes, the notice board, a bicycle
// chained to the pipe, the pram; the street door in the south-east corner, a gap in the near wall onto Weg_1 (its keypad and doorbell camera
// outside: CAM 24), Weg_1's neon falling in.
"use strict";

ISO_MAPS.lerche_eg = {
  size: [8.5, 4], cell: 0.5, at: [144, 84], screen: [432, 292], margin: 0.2,
  // "x" terrazzo, wet from the door
  floor: [
    "xxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxx",
    "xxxxxxxxxxxxxxxxx",
  ],
  walls: [
    { from: [0, 0], to: [8.5, 0], h: 2.6, kit: "lf_wall" },        // 0: the north wall (the lift, the stairs, the mailboxes, the board)
    { from: [0, 0], to: [0, 4], h: 2.6, kit: "lf_wall" },          // 1: the west wall (Lull's screen)
    // the south wall toward Weg_1, cut: the street door's gap in the south-east corner
    { from: [0, 4], to: [7.3, 4], h: 2.6, kit: "lf_wall", stub: true },
    { from: [8.2, 4], to: [8.5, 4], h: 2.6, kit: "lf_wall", stub: true },
    { from: [8.5, 0], to: [8.5, 4], h: 2.6, kit: "lf_wall", stub: true },
  ],
  openings: [
    { id: "lift", wall: 0, from: 0.75, to: 1.45, h: [0, 2.05], kit: "lf_lift", floor: 0 },
    { id: "mailboxes", wall: 0, from: 5.3, to: 6.4, h: [0.9, 1.7], kit: "le_mailboxes" },
    { id: "board", wall: 0, from: 6.55, to: 7.05, h: [1.0, 1.7], kit: "notice_board" },
    { id: "neon", wall: 0, from: 5.4, to: 6.8, h: [1.95, 2.5], kit: "neon_ninth" },
    { id: "screen", wall: 1, from: 1.4, to: 3.2, h: [1.2, 2.05], kit: "kl_screen" },
  ],
  props: [
    // the Kessel lobby's flight, as it stands there (art/rooms/kessel_lobby.map.js): its upper flight under the landing's well upstairs
    { id: "stairs", kit: "stairs_up_turn", at: [2.53, 0], foot: [1.5, 0.95], landing: [1.0, 0.95], lower: 1.5, h: 2.6, steps: 14 },
    { id: "arcade", kit: "le_arcade", at: [7.45, 0.05], foot: [0.65, 0.6], h: 1.75 },
    { id: "pram", kit: "le_pram", at: [5.75, 0.9], foot: [0.45, 0.7], h: 0.75 },
    { id: "flyers", kit: "flyers", at: [5.4, 0.08], foot: [0.4, 0.6], h: 0.05, block: false },
  ],
  spots: {
    arrive: [7.75, 3.55, "nw"], door: [7.75, 3.75, "se"], mailboxes: [5.85, 0.6, "ne"], board: [6.8, 0.65, "ne"],
    lift: [1.1, 0.55, "ne"], stairs: [4.55, 2.75, "ne"], pram: [6.0, 2.0, "ne"], arcade: [7.75, 1.05, "ne"], screen: [0.6, 2.3, "nw"],
  },
  lights: [
    { id: "bulb", at: [2.2, 1.4, 2.5], r: 200, power: 1.0, color: "#e8e0a0", flicker: 0.06,
      bake: { reach: 3.6, power: 1.5, floor: 1.3, wrap: 0.6 } },
    { id: "bulb2", at: [6.2, 1.4, 2.5], r: 160, power: 0.8, color: "#e8e0a0", flicker: 0.2,
      bake: { reach: 3.0, power: 1.3, floor: 1.3, wrap: 0.6, off: [3, 4, 9] } },
    { id: "street", at: [7.75, 4.3, 1.4], r: 90, power: 0.8, color: "#ff4fd3", flicker: 0.12,
      bake: { reach: 2.6, power: 2.0, floor: 1.4 } },
  ],
};

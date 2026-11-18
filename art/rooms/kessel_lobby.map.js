// The Kessel Block's lobby as a map (art/lib/isomap.js has the format): the ground floor, where the stairs
// come down and the street door lets the rain in. Every length in meters. Laid over the floors above it: the lift
// (out of order) at the same place of the right back wall as upstairs, the flight along that wall ending at u 3.5, where the
// landing's stairs begin (art/rooms/kessel_14.map.js), Nagi·wa's poster over the flight; 6 m along that wall, as the landing,
// and the picture moved up as the landing's, and taller (it scrolls down to the stairs' foot); the flight turns on a landing in the
// corner and comes down into the room along the right stub wall (the user's decision of 10.11.2026);
// in the left back wall the mailboxes, the notice board and the street door, glass, the magenta of the
// street beyond it; the floor wet from the door in.
"use strict";

ISO_MAPS.kessel_lobby = {
  size: [6.0, 4.5], cell: 0.5, at: [152, 74], screen: [352, 216], margin: 0.2,
  // "t" the old tiles, "w" wet tiles (the rain walked in), "m" the doormat
  floor: [
    "tttttttttttt",
    "tttttttttttt",
    "tttttttttttt",
    "tttttttttttt",
    "wwtttttttttt",
    "mmwwtttttttt",
    "mmwwwttttttt",
    "mmwwtttttttt",
    "wwwttttttttt",
  ],
  walls: [
    { from: [0, 0], to: [6.0, 0], h: 2.8, kit: "lobby_steel" },          // 0: the right back wall (lift, stairs, poster)
    { from: [0, 0], to: [0, 4.5], h: 2.8, kit: "lobby_steel" },          // 1: the left back wall (mailboxes, the street door)
    { from: [0, 4.5], to: [6.0, 4.5], h: 2.8, kit: "lobby_steel", stub: true },
    { from: [6.0, 0], to: [6.0, 4.5], h: 2.8, kit: "lobby_steel", stub: true },
  ],
  openings: [
    { id: "lift", wall: 0, from: 0.3, to: 1.4, h: [0, 2.1], kit: "lift_doors" },
    { id: "poster", wall: 0, from: 4.53, to: 5.98, h: [1.42, 2.77], kit: "poster_listens" },
    { id: "mailboxes", wall: 1, from: 0.35, to: 1.95, h: [0.75, 1.9], kit: "mailboxes" },
    { id: "board", wall: 1, from: 2.1, to: 2.6, h: [1.0, 1.7], kit: "notice_board" },
    { id: "door", wall: 1, from: 2.8, to: 3.9, h: [0, 2.3], kit: "street_door" },
  ],
  props: [
    // the flight up: from the floor along the right stub wall up to a landing in the corner, then along the back wall to u 3.5
    { id: "stairs", kit: "stairs_up_turn", at: [3.5, 0], foot: [1.5, 0.95], landing: [1.0, 0.95], lower: 1.5, h: 2.6, steps: 14 },
    // a wet-floor sign someone set by the door and forgot, a heap of flyers under the mailboxes
    { id: "sign", kit: "wet_sign", at: [1.15, 2.6], foot: [0.3, 0.2], h: 0.6 },
    { id: "flyers", kit: "flyers", at: [0.05, 0.85], foot: [0.4, 0.6], h: 0.05, block: false },
  ],
  // the stairs' landing and lower flight (the kit's footprint, which the walk area doesn't know): nobody walks over the steps
  nowalk: [[4.8, 0, 1.2, 2.65]],
  spots: {
    arrive: [5.45, 2.75, "sw"], stairs: [5.45, 2.7, "ne"], lift: [0.85, 0.55, "ne"], poster: [4.6, 1.3, "ne"],
    mailboxes: [0.55, 1.2, "nw"], board: [0.55, 2.35, "nw"], door: [0.45, 3.35, "nw"], street: [0.6, 3.35, "se"],
    sign: [1.6, 2.7, "nw"],
  },
  // `bake` is read by the bake only (art/lib/isokit.js): the cold ceiling panel; the street's magenta coming in
  // through the door's glass (its pool on the wet floor has the glass's shape); the lift's amber lamp
  lights: [
    { id: "ceiling", at: [2.9, 1.9, 2.7], r: 200, power: 1.0, color: "#a8c0e8", flicker: 0.05,
      bake: { at: [2.9, 1.9, 2.75], reach: 4.4, power: 1.7, floor: 1.3, wrap: 0.6 } },
    { id: "street", at: [0.02, 3.35, 1.4], r: 90, power: 0.9, color: "#ff4fd3", flicker: 0.12,
      bake: { through: "door", from: [-2.2, 3.35, 2.4], reach: 3.6, power: 2.6, off: [5, 6] } },
    { id: "lift_lamp", at: [0.85, 0.05, 2.3], r: 16, power: 0.6, color: "#eea040",
      bake: { reach: 0.6, power: 1.4 } },
  ],
};

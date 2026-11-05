// The Kessel Block's lobby as a map (art/lib/isomap.js has the format): the ground floor, where the stairs
// come down and the street door lets the rain in. Every length in meters. Laid over the floors above it: the lift
// (out of order) at the same place of the right back wall as upstairs, the flight along that wall ending at u 2.5, where the
// landing's stairs begin (art/rooms/kessel_14.map.js), Halcyon's poster over the flight;
// in the left back wall the mailboxes, the notice board and the street door, glass, the magenta of the
// street beyond it; the floor wet from the door in.
"use strict";

ISO_MAPS.kessel_lobby = {
  size: [5.0, 4.5], cell: 0.5, at: [152, 86], screen: [320, 180], margin: 0.2,
  // "t" the old tiles, "w" wet tiles (the rain walked in), "m" the doormat
  floor: [
    "tttttttttt",
    "tttttttttt",
    "tttttttttt",
    "tttttttttt",
    "wwtttttttt",
    "mmwwtttttt",
    "mmwwwttttt",
    "mmwwtttttt",
    "wwwttttttt",
  ],
  walls: [
    { from: [0, 0], to: [5.0, 0], h: 2.8, kit: "lobby_steel" },          // 0: the right back wall (lift, stairs, poster)
    { from: [0, 0], to: [0, 4.5], h: 2.8, kit: "lobby_steel" },          // 1: the left back wall (mailboxes, the street door)
    { from: [0, 4.5], to: [5.0, 4.5], h: 2.8, kit: "lobby_steel", stub: true },
    { from: [5.0, 0], to: [5.0, 4.5], h: 2.8, kit: "lobby_steel", stub: true },
  ],
  openings: [
    { id: "lift", wall: 0, from: 0.3, to: 1.4, h: [0, 2.1], kit: "lift_doors" },
    { id: "poster", wall: 0, from: 3.53, to: 4.98, h: [1.42, 2.77], kit: "poster_listens" },
    { id: "mailboxes", wall: 1, from: 0.35, to: 1.95, h: [0.75, 1.9], kit: "mailboxes" },
    { id: "board", wall: 1, from: 2.1, to: 2.6, h: [1.0, 1.7], kit: "notice_board" },
    { id: "door", wall: 1, from: 2.8, to: 3.9, h: [0, 2.3], kit: "street_door" },
  ],
  props: [
    // the flight up, from the front of the room to u 2.5
    { id: "stairs", kit: "stairs_up", at: [2.5, 0], foot: [2.5, 0.95], h: 2.6, steps: 14 },
    // a wet-floor sign someone set by the door and forgot, a heap of flyers under the mailboxes
    { id: "sign", kit: "wet_sign", at: [1.15, 2.6], foot: [0.3, 0.2], h: 0.6 },
    { id: "flyers", kit: "flyers", at: [0.05, 0.85], foot: [0.4, 0.6], h: 0.05, block: false },
  ],
  spots: {
    arrive: [3.5, 1.3, "sw"], stairs: [3.7, 1.25, "nw"], lift: [0.85, 0.55, "ne"], poster: [4.05, 1.25, "ne"],
    mailboxes: [0.55, 1.2, "nw"], board: [0.55, 2.35, "nw"], door: [0.45, 3.35, "nw"], street: [0.6, 3.35, "se"],
    sign: [1.6, 2.7, "nw"],
  },
  // `bake` is read by the bake only (art/lib/isokit.js): the cold ceiling panel; the street's magenta coming in
  // through the door's glass (its pool on the wet floor has the glass's shape); the lift's amber lamp
  lights: [
    { id: "ceiling", at: [2.4, 1.9, 2.7], r: 200, power: 1.0, color: "#a8c0e8", flicker: 0.05,
      bake: { at: [2.4, 1.9, 2.75], reach: 4.4, power: 1.7, floor: 1.3, wrap: 0.6 } },
    { id: "street", at: [0.02, 3.35, 1.4], r: 90, power: 0.9, color: "#ff4fd3", flicker: 0.12,
      bake: { through: "door", from: [-2.2, 3.35, 2.4], reach: 3.6, power: 2.6, off: [5, 6] } },
    { id: "lift_lamp", at: [0.85, 0.05, 2.3], r: 16, power: 0.6, color: "#eea040",
      bake: { reach: 0.6, power: 1.4 } },
  ],
};

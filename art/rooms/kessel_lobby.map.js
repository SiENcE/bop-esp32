// The Kessel Block's lobby as a map (art/lib/isomap.js has the format): the ground floor, where the stairs
// come down and the street door lets the rain in. Every length in meters. In the right back wall the arch
// to the stairwell (its first steps up seen through it), the lift (out of order) and Halcyon's poster;
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
    { from: [0, 0], to: [5.0, 0], h: 2.8, kit: "lobby_steel" },          // 0: the right back wall (stairs, lift, poster)
    { from: [0, 0], to: [0, 4.5], h: 2.8, kit: "lobby_steel" },          // 1: the left back wall (mailboxes, the street door)
    { from: [0, 4.5], to: [5.0, 4.5], h: 2.8, kit: "lobby_steel", stub: true },
    { from: [5.0, 0], to: [5.0, 4.5], h: 2.8, kit: "lobby_steel", stub: true },
  ],
  openings: [
    { id: "stairwell", wall: 0, from: 0.3, to: 1.35, h: [0, 2.2], kit: "stair_arch" },
    { id: "lift", wall: 0, from: 1.9, to: 3.1, h: [0, 2.1], kit: "lift_doors" },
    { id: "poster", wall: 0, from: 3.55, to: 4.6, h: [0.85, 2.05], kit: "poster_listens" },
    { id: "mailboxes", wall: 1, from: 0.35, to: 1.95, h: [0.75, 1.9], kit: "mailboxes" },
    { id: "board", wall: 1, from: 2.1, to: 2.6, h: [1.0, 1.7], kit: "notice_board" },
    { id: "door", wall: 1, from: 2.8, to: 3.9, h: [0, 2.3], kit: "street_door" },
  ],
  props: [
    // a wet-floor sign someone set by the door and forgot, a heap of flyers under the mailboxes
    { id: "sign", kit: "wet_sign", at: [1.15, 2.6], foot: [0.3, 0.2], h: 0.6 },
    { id: "flyers", kit: "flyers", at: [0.1, 0.7], foot: [0.5, 0.7], h: 0.05, block: false },
  ],
  spots: {
    arrive: [0.85, 0.65, "se"], stairs: [0.85, 0.45, "ne"], lift: [2.5, 0.55, "ne"], poster: [4.05, 0.6, "ne"],
    mailboxes: [0.55, 1.2, "nw"], board: [0.55, 2.35, "nw"], door: [0.45, 3.35, "nw"], street: [0.6, 3.35, "se"],
    sign: [1.6, 2.7, "nw"],
  },
  lights: [
    { id: "ceiling", at: [2.4, 1.9, 2.7], r: 170, power: 1.0, color: "#a8c0e8", flicker: 0.05 },
    { id: "street", at: [0.02, 3.35, 1.4], r: 90, power: 0.9, color: "#ff4fd3", flicker: 0.12 },
    { id: "lift_lamp", at: [2.5, 0.05, 2.3], r: 16, power: 0.6, color: "#eea040" },
  ],
};

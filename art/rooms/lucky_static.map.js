// LUCKY STATIC from inside as a map (art/lib/isomap.js has the format). Every length in meters. The same bar as seen from Kowalski
// Street through its window (art/rooms/kowalski.map.js): the street is the near left wall (the user's decision, 2026-11-09: so it is
// right from outside), its door at the bottom left, a gap in the cut wall with the street's light, its big window along the rest of
// that wall, shown in the cut as glass, the sign's magenta falling in across the floor; Frau Imai at her table just inside it (her
// table and chair are in her own figure), looking out. Along the right back wall the counter, Mei behind it, the bottles, Nagi·wa's
// news on the TV over them and her slate with the tabs; at its left end the noodle kitchen under its hood. On the left back wall the
// karaoke machine that is OUT OF ORDER (somebody sings on it every evening) and the door to the toilet.
"use strict";

ISO_MAPS.lucky_static = {
  size: [5, 4], cell: 0.5, at: [144, 80], screen: [320, 180], margin: 0.2,
  // "t" the old tiles, "b" the boards behind the counter
  floor: [
    "bbbbbbbbbb",
    "bbbbbbbbbb",
    "tttttttttt",
    "tttttttttt",
    "tttttttttt",
    "tttttttttt",
    "tttttttttt",
    "tttttttttt",
  ],
  walls: [
    { from: [0, 0], to: [5, 0], h: 2.6, kit: "ls_wall" },                 // 0: the right back wall (kitchen, bottles, TV, slate)
    { from: [0, 0], to: [0, 4], h: 2.6, kit: "ls_wall" },                 // 1: the left back wall (karaoke, the toilet)
    // the street wall, near and cut: the door's gap at its left end, a post, the window, a post
    { from: [0.95, 4], to: [1.15, 4], h: 2.6, kit: "ls_wall", stub: true },
    { from: [1.15, 4], to: [4.6, 4], h: 2.6, kit: "ls_glass", stub: true },
    { from: [4.6, 4], to: [5, 4], h: 2.6, kit: "ls_wall", stub: true },
    { from: [5, 0], to: [5, 4], h: 2.6, kit: "ls_wall", stub: true },
  ],
  openings: [
    { id: "hood", wall: 0, from: 0.1, to: 1.2, h: [1.6, 2.2], kit: "ls_hood" },
    { id: "bottles", wall: 0, from: 1.5, to: 3.7, h: [1.0, 1.75], kit: "ls_bottles" },
    { id: "tv", wall: 0, from: 2.1, to: 3.2, h: [1.84, 2.45], kit: "ls_tv" },
    { id: "slate", wall: 0, from: 3.75, to: 4.95, h: [1.1, 2.0], kit: "ls_slate" },
    { id: "wc", wall: 1, from: 2.3, to: 3.05, h: [0, 2.0], kit: "ls_wc" },
    { id: "poster", wall: 1, from: 3.2, to: 3.85, h: [1.05, 1.95], kit: "ls_poster" },
  ],
  props: [
    // the noodle kitchen: a range with its pots behind the counter's left end, under the hood
    { id: "range", kit: "ls_range", at: [0.1, 0.08], foot: [1.1, 0.58], h: 0.9 },
    // the counter, low enough that Mei shows behind it; the way behind it at its right end
    { id: "counter", kit: "ls_counter", at: [1.4, 0.75], foot: [3.2, 0.5], h: 1.05 },
    // the free stools (game/places.js draws them after the counter: they stand in front of it); the regulars further right bring
    // their own in their figures
    { id: "stool1", kit: "ls_stool", at: [1.65, 1.42], foot: [0.32, 0.32], h: 0.72 },
    { id: "stool2", kit: "ls_stool", at: [2.3, 1.42], foot: [0.32, 0.32], h: 0.72 },
    { id: "stool3", kit: "ls_stool", at: [2.95, 1.42], foot: [0.32, 0.32], h: 0.72 },
    // the karaoke machine against the left wall, OUT OF ORDER on its screen
    { id: "karaoke", kit: "ls_karaoke", at: [0.05, 1.3], foot: [0.55, 0.65], h: 1.75 },
    // the mat inside the street door
    { id: "mat", kit: "ls_mat", at: [0.1, 3.4], foot: [0.8, 0.5], h: 0.02, block: false },
    // the steel sill in the door's gap
    { id: "sill", kit: "ls_sill", at: [0.04, 3.92], foot: [0.9, 0.08], h: 0.02, block: false },
    // three shades hanging over the counter (game/places.js draws them after the counter)
    { id: "lamps", kit: "ls_lamps", at: [1.8, 1.0], foot: [2.4, 0.06], h: 2.15, block: false },
  ],
  spots: {
    arrive: [0.5, 3.45, "ne"], door: [0.45, 3.8, "sw"],
    bar: [2.78, 1.95, "ne"], mei: [2.78, 0.4, "sw"],
    stammA: [3.76, 1.58, "ne"], stammB: [4.41, 1.58, "ne"], regulars: [3.6, 2.1, "ne"],
    imai: [2.1, 3.35, "sw"], imaiTalk: [1.2, 3.62, "se"],
    karaoke: [0.85, 1.7, "nw"],
  },
  lights: [
    // three warm lamps hanging over the counter
    { id: "bar", at: [3.0, 1.0, 2.2], r: 160, power: 1.1, color: "#ffc070", flicker: 0.04,
      bake: { line: [[1.8, 1.0, 2.2], [4.2, 1.0, 2.2]], reach: 2.8, power: 1.5, wrap: 0.5 } },
    // the kitchen's light under the hood
    { id: "kitchen", at: [0.65, 0.35, 1.55], r: 60, power: 0.8, color: "#ffb060", bake: { reach: 1.4, power: 1.2 } },
    // Nagi·wa's news, cyan
    { id: "tv", at: [2.65, 0.1, 2.1], r: 60, power: 0.7, color: "#62def0", flicker: 0.25, bake: { reach: 1.6, power: 1.3, off: [3, 8] } },
    // the bar's own sign outside, magenta, in through the window
    { id: "street", at: [2.9, 4.6, 1.8], r: 140, power: 0.9, color: "#ff4fd3", bake: { reach: 2.8, power: 1.6, wrap: 0.3 } },
    // and the street's cyan in through the open door
    { id: "door", at: [0.45, 4.5, 1.2], r: 60, power: 0.7, color: "#62def0", bake: { reach: 1.5, power: 1.6, wrap: 0.3 } },
  ],
};

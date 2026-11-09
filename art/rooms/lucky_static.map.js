// LUCKY STATIC from inside as a map (art/lib/isomap.js has the format). Every length in meters. The same bar as seen from
// Kowalski Street through its window (art/rooms/kowalski.map.js): the street is the near left wall, its door at the left end and
// its big window beside it, so through the glass one sees what is here, the bottles on the wall across the room and the backs of
// the people on the stools. Along the right back wall the counter, Mei behind it, the bottles, Nagi·wa's news on the TV over them
// and her slate with the tabs; at its left end the noodle kitchen under its hood. On the left back wall the karaoke machine that is
// OUT OF ORDER (somebody sings on it every evening), the door to the toilet behind it; Frau Imai's table in front of it. The street's
// neon falls in through the window across the floor.
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
    // the street wall, near: the door's gap at its left end, then the window (it shows only as its light)
    { from: [1.2, 4], to: [5, 4], h: 2.6, kit: "ls_wall", stub: true },
    { from: [5, 0], to: [5, 4], h: 2.6, kit: "ls_wall", stub: true },
  ],
  openings: [
    { id: "hood", wall: 0, from: 0.1, to: 1.2, h: [1.6, 2.2], kit: "ls_hood" },
    { id: "bottles", wall: 0, from: 1.5, to: 3.7, h: [1.0, 1.75], kit: "ls_bottles" },
    { id: "tv", wall: 0, from: 2.2, to: 3.1, h: [1.85, 2.35], kit: "ls_tv" },
    { id: "slate", wall: 0, from: 3.85, to: 4.9, h: [1.1, 1.95], kit: "ls_slate" },
    { id: "wc", wall: 1, from: 0.7, to: 1.25, h: [0, 2.0], kit: "ls_wc" },          // the toilet, back by the kitchen
  ],
  props: [
    // the noodle kitchen: a range with its pots behind the counter's left end, under the hood
    { id: "range", kit: "ls_range", at: [0.1, 0.08], foot: [1.1, 0.58], h: 0.9 },
    // the counter, low enough that Mei shows behind it; the way behind it at its right end
    { id: "counter", kit: "ls_counter", at: [1.4, 0.75], foot: [3.2, 0.5], h: 1.05 },
    // the stools; the two regulars sit on the right-hand ones (you walk through those: they stand where the regulars are)
    { id: "stool1", kit: "ls_stool", at: [1.65, 1.42], foot: [0.32, 0.32], h: 0.72 },
    { id: "stool2", kit: "ls_stool", at: [2.3, 1.42], foot: [0.32, 0.32], h: 0.72 },
    { id: "stool3", kit: "ls_stool", at: [2.95, 1.42], foot: [0.32, 0.32], h: 0.72 },
    { id: "stool4", kit: "ls_stool", at: [3.6, 1.42], foot: [0.32, 0.32], h: 0.72, block: false },
    { id: "stool5", kit: "ls_stool", at: [4.25, 1.42], foot: [0.32, 0.32], h: 0.72, block: false },
    // the karaoke machine against the left wall, OUT OF ORDER on its screen
    { id: "karaoke", kit: "ls_karaoke", at: [0.05, 1.3], foot: [0.55, 0.65], h: 1.75 },
    // Frau Imai's table by the left wall, her chair (where she sits) and the one across, for whoever comes
    { id: "table", kit: "ls_table", at: [0.65, 2.45], foot: [0.6, 0.6], h: 0.74 },
    { id: "chair_imai", kit: "ls_chair", at: [0.15, 2.55], foot: [0.4, 0.4], h: 0.9, block: false },
    { id: "chair", kit: "ls_chair", at: [1.35, 2.55], foot: [0.4, 0.4], h: 0.9 },
  ],
  spots: {
    arrive: [0.7, 3.55, "ne"], door: [0.55, 3.8, "sw"],
    bar: [2.78, 1.95, "ne"], mei: [2.78, 0.4, "sw"],
    stammA: [3.76, 1.58, "ne"], stammB: [4.41, 1.58, "ne"], regulars: [3.6, 2.1, "ne"],
    imai: [0.35, 2.75, "se"], imaiTalk: [1.2, 3.3, "nw"],
    karaoke: [0.85, 1.7, "nw"], wc: [0.4, 0.98, "nw"],
  },
  lights: [
    // three warm lamps hanging over the counter
    { id: "bar", at: [3.0, 1.0, 2.2], r: 160, power: 1.1, color: "#ffc070", flicker: 0.04,
      bake: { line: [[1.8, 1.0, 2.2], [4.2, 1.0, 2.2]], reach: 2.8, power: 1.5, wrap: 0.5 } },
    // the kitchen's light under the hood
    { id: "kitchen", at: [0.65, 0.35, 1.55], r: 60, power: 0.8, color: "#ffb060", bake: { reach: 1.4, power: 1.2 } },
    // Nagi·wa's news, cyan
    { id: "tv", at: [2.65, 0.1, 2.1], r: 60, power: 0.7, color: "#62def0", flicker: 0.25, bake: { reach: 1.6, power: 1.3, off: [3, 8] } },
    // the street's neon through the window (the sign outside is magenta)
    { id: "street", at: [3.0, 4.5, 1.4], r: 140, power: 0.9, color: "#ff4fd3", bake: { reach: 2.6, power: 1.4, wrap: 0.3 } },
    // and in through the open door at the left end: the street's cyan, so the way out shows
    { id: "door", at: [0.6, 4.4, 1.0], r: 60, power: 0.7, color: "#62def0", bake: { reach: 1.3, power: 1.4, wrap: 0.3 } },
  ],
};

// lantern_versteck: Lantern's caravan from the inside, his home and his sender (docs/kapitel2-design.md §3.5 L5, §9.2; the user's layout,
// 2026-11-16), as a map (art/lib/isomap.js has the format). Every length in meters: 5 m from the cab to the back (10 tiles), 2.5 m across
// (5 tiles). BLOCKS until its look is approved: pieces of Juno's flat (art/kit/flat.kit.px.js) and two of its own (the kitchen, the rack).
//   wall 0, the long side (u)      at the front his monitors and his deck, the rack of senders; the kitchen with its window out; the fridge
//   wall 1, the front (v)          the door to the cab: shut, nobody goes there
//   the back (u = 5, a stub)       the bed across the van
//   the near side (v = 2.5, stub)  the sliding door out to the pontoon (a zone: a gap in a cut wall)
"use strict";

ISO_MAPS.lantern_versteck = {
  size: [5, 2.5], cell: 0.5, at: [150, 70], screen: [320, 180], margin: 0.2,
  // "p" plain floor (its own kit, for now)
  floor: [
    "pppppppppp",
    "pppppppppp",
    "pppppppppp",
    "pppppppppp",
    "pppppppppp",
  ],
  walls: [
    { from: [0, 0], to: [5, 0], h: 2.0, kit: "lantern_versteck_wall" },              // 0: the long side wall
    { from: [0, 0], to: [0, 2.5], h: 2.0, kit: "lantern_versteck_wall" },            // 1: the front wall, the cab behind it
    { from: [0, 2.5], to: [5, 2.5], h: 2.0, kit: "lantern_versteck_wall", stub: true },
    { from: [5, 0], to: [5, 2.5], h: 2.0, kit: "lantern_versteck_wall", stub: true },
  ],
  openings: [
    { id: "kabine", wall: 1, from: 0.8, to: 1.6, h: [0, 1.85], kit: "door_flat" },
    { id: "window", wall: 0, from: 2.5, to: 3.2, h: [1.0, 1.6], kit: "window_rain" },
    { id: "leds", wall: 0, from: 0.2, to: 1.9, h: [1.65, 1.75], kit: "led_strip" },
  ],
  props: [
    { id: "sender", kit: "deck_rig", at: [0.25, 0], foot: [1.5, 0.6], h: 1.5 },
    { id: "rack", kit: "lv_rack", at: [1.8, 0], foot: [0.5, 0.45], h: 1.7 },
    { id: "kueche", kit: "lv_kitchen", at: [2.4, 0], foot: [1.0, 0.55], h: 0.9 },
    { id: "fridge", kit: "fridge", at: [3.45, 0], foot: [0.5, 0.5], h: 1.4 },
    { id: "bett", kit: "bed_pallet", at: [4.0, 0.1], foot: [0.95, 1.9], h: 0.45 },
  ],
  zones: [
    { id: "door", at: [2.2, 2.3], foot: [0.9, 0.2], h: 1.9 },
  ],
  spots: {
    arrive: [2.65, 1.85, "nw"], door: [2.65, 2.05, "se"], lantern: [1.05, 0.95, "ne"], talk: [1.45, 1.75, "nw"],
  },
  lights: [
    { id: "screens", at: [1.0, 0.3, 1.2], r: 80, power: 0.9, color: "#7cff9a", flicker: 0.08, bake: { reach: 3.0, power: 1.5, floor: 1.4 } },
    { id: "lantern", at: [1.05, 0.95, 1.3], r: 40, power: 0.6, color: "#ffc860", flicker: 0.15, bake: { reach: 1.2, power: 1.2 } },
    { id: "kitchen", at: [2.9, 0.3, 1.7], r: 50, power: 0.5, color: "#ffd58a", bake: { reach: 1.6, power: 0.9 } },
  ],
};

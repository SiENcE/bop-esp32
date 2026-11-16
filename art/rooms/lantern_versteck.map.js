// lantern_versteck: Lantern's caravan from the inside, his home and his sender (docs/kapitel2-design.md §3.5 L5, §9.2; the user's layout,
// 2026-11-16), as a map (art/lib/isomap.js has the format). Every length in meters: 5 m from the cab to the back (10 tiles), 2.5 m across
// (5 tiles). Painted on the approved blocks (the user's layout, 2026-11-16): its own pieces (art/kit/lantern_versteck.kit.px.js), the LED strip
// from Juno's flat (art/kit/flat.kit.px.js).
//   wall 1, the back (v)           the bed against it, over it his neon poster against Lull
//   wall 0, the long side (u)      from the back: the kitchen with its window out, the fridge; then his monitors and his deck, the rack of senders
//   the front (u = 5, a stub)      the door to the cab, only hinted at (a zone): shut, nobody goes there
//   the near side (v = 2.5, stub)  the sliding door out to the pontoon in the middle, hinted at (a zone: a gap in a cut wall)
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
    { from: [0, 0], to: [0, 2.5], h: 2.0, kit: "lantern_versteck_wall" },            // 1: the back wall, the bed against it
    { from: [0, 2.5], to: [5, 2.5], h: 2.0, kit: "lantern_versteck_wall", stub: true },
    { from: [5, 0], to: [5, 2.5], h: 2.0, kit: "lantern_versteck_wall", stub: true },
  ],
  openings: [
    { id: "plakat", wall: 1, from: 0.45, to: 1.95, h: [0.85, 1.8], kit: "lv_poster" },
    { id: "window", wall: 0, from: 1.15, to: 2.25, h: [0.95, 1.8], kit: "lv_window" },
    { id: "leds", wall: 0, from: 2.9, to: 4.3, h: [1.65, 1.75], kit: "led_strip" },
  ],
  props: [
    { id: "bett", kit: "lv_bed", at: [0.05, 0.3], foot: [0.95, 1.9], h: 0.45 },
    { id: "kueche", kit: "lv_kitchen", at: [1.2, 0], foot: [1.0, 0.55], h: 0.9 },
    { id: "fridge", kit: "lv_fridge", at: [2.25, 0], foot: [0.5, 0.5], h: 1.4 },
    { id: "sender", kit: "lv_desk", at: [2.9, 0], foot: [1.4, 0.6], h: 1.5 },
    { id: "rack", kit: "lv_rack", at: [4.4, 0], foot: [0.5, 0.45], h: 1.7 },
    // the nineties' junk: magazines stacked by the bed, a monitor on a crate of VHS tapes at the front
    { id: "zeitschriften", kit: "lv_magazines", at: [1.08, 1.85], foot: [0.3, 0.24], h: 0.22 },
    { id: "fernseher", kit: "lv_crt", at: [4.3, 1.75], foot: [0.5, 0.45], h: 0.8 },
    // the two doors in the cut walls, hinted at by their sills (one walks over them)
    { id: "schwelle", kit: "lv_schwelle", at: [2.0, 2.3], foot: [0.9, 0.2], h: 0.04, block: false },
    { id: "kabinenschwelle", kit: "lv_schwelle", at: [4.8, 0.7], foot: [0.2, 0.9], h: 0.04, block: false },
  ],
  zones: [
    { id: "door", at: [2.0, 2.3], foot: [0.9, 0.2], h: 1.9 },
    { id: "kabine", at: [4.8, 0.7], foot: [0.2, 0.9], h: 1.9 },
  ],
  spots: {
    arrive: [2.45, 1.85, "ne"], door: [2.45, 2.05, "se"], lantern: [3.6, 0.95, "ne"], talk: [3.2, 1.75, "ne"],
  },
  lights: [
    { id: "screens", at: [3.6, 0.3, 1.2], r: 80, power: 0.9, color: "#7cff9a", flicker: 0.08, bake: { reach: 3.0, power: 1.5, floor: 1.4 } },
    { id: "lantern", at: [3.6, 0.95, 1.3], r: 40, power: 0.6, color: "#ffc860", flicker: 0.15, bake: { reach: 1.2, power: 1.2, at: [4.18, 0.45, 0.95] } },   // in the bake: his storm lantern on the desk
    { id: "kitchen", at: [1.7, 0.3, 1.7], r: 50, power: 0.5, color: "#ffd58a", bake: { reach: 1.6, power: 0.9 } },
  ],
};

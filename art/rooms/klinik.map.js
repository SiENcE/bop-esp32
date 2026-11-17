// klinik: Lull-Klinik 9-Ost from the inside, the clinic CAM 21 sees from its porch (docs/kapitel2-design.md §3.2, §9.2), as a map
// (art/lib/isomap.js has the format), made by tools/new-room.mjs. Every length in meters. BLOCKS (art/kit/klinik.kit.px.js) for the
// user's approval. Along the left back wall the reception: a counter with glass on it, the nurse sitting behind it facing the room (SE);
// the glass door to the street at the near end of that wall. Along the right back wall the row of joined seats where the tired wait
// (facing the room, SW) under the SLEEP BETTER screen, Nagi·wa's ring beside it, and at its far end the cabin with the scanner chair.
// Two cold tubes over it all.
"use strict";

ISO_MAPS.klinik = {
  size: [6, 4], cell: 0.5, at: [128, 80], screen: [320, 180], margin: 0.2,
  // "p" the pale vinyl tiles
  floor: [
    "pppppppppppp",
    "pppppppppppp",
    "pppppppppppp",
    "pppppppppppp",
    "pppppppppppp",
    "pppppppppppp",
    "pppppppppppp",
    "pppppppppppp",
  ],
  walls: [
    { from: [0, 0], to: [6, 0], h: 2.8, kit: "klinik_wall" },        // 0: the right back wall (the seats, the screen, the cabin)
    { from: [0, 0], to: [0, 4], h: 2.8, kit: "klinik_wall" },        // 1: the left back wall (the reception, the door)
    { from: [0, 4], to: [6, 4], h: 2.8, kit: "klinik_wall", stub: true },
    { from: [6, 0], to: [6, 4], h: 2.8, kit: "klinik_wall", stub: true },
  ],
  openings: [
    { id: "ring", wall: 0, from: 0.35, to: 1.05, h: [1.55, 2.35], kit: "kl_ring" },
    { id: "screen", wall: 0, from: 1.45, to: 3.15, h: [1.35, 2.3], kit: "kl_screen" },
    { id: "cabin", wall: 0, from: 3.65, to: 4.85, h: [0, 2.2], kit: "kl_cabin", open: { depth: 1.2, side: 0, h: 2.2, floor: "p", wall: "kl_cabin_wall" } },
    { id: "door", wall: 1, from: 3.0, to: 3.85, h: [0, 2.1], kit: "kl_door" },
  ],
  // behind the counter is the nurse's
  nowalk: [[0, 0, 0.75, 2.7]],
  props: [
    { id: "reception", kit: "kl_reception", at: [0.75, 0.35], foot: [0.45, 2.2], h: 1.75 },
    { id: "seats", kit: "kl_seats", at: [1.3, 0.05], foot: [2.2, 0.5], h: 0.85 },
    { id: "scanner", kit: "kl_scanner", at: [3.85, -1.0], foot: [0.7, 0.85], h: 1.25, behind: "cabin" },
    { id: "tubes", kit: "lm_tubes", at: [1.0, 1.9], foot: [4.0, 0.06], h: 2.6, block: false },
  ],
  spots: {
    arrive: [0.55, 3.45, "se"], door: [0.35, 3.45, "nw"],
    nurse: [0.35, 1.45, "se"], reception: [1.6, 1.45, "nw"],
    wait1: [1.58, 0.35, "sw"], wait2: [2.13, 0.35, "sw"], wait3: [2.68, 0.35, "sw"], wait4: [3.23, 0.35, "sw"],
    cabin: [4.25, 0.4, "ne"],
  },
  lights: [
    { id: "tube1", at: [1.8, 1.93, 2.6], r: 150, power: 1.0, color: "#e8f4ff", flicker: 0.02, bake: { family: "cold", line: [[1.2, 1.93, 2.6], [2.6, 1.93, 2.6]], reach: 3.6, power: 1.5, wrap: 0.5 } },
    { id: "tube2", at: [4.0, 1.93, 2.6], r: 150, power: 1.0, color: "#e8f4ff", flicker: 0.02, bake: { family: "cold", line: [[3.6, 1.93, 2.6], [4.8, 1.93, 2.6]], reach: 3.6, power: 1.5, wrap: 0.5 } },
    { id: "screen", at: [2.3, 0.1, 1.8], r: 60, power: 0.6, color: "#62def0", bake: { family: "cyan", reach: 1.6, power: 1.0 } },
    { id: "cabin", at: [4.25, -0.6, 2.0], r: 40, power: 0.6, color: "#dafcff", zone: "cabin", bake: { family: "cold", reach: 2.0, power: 1.2 } },
  ],
};

// SUDS & SPIN, the laundromat off the alley, as a map (art/lib/isomap.js has the format). Every length in meters. One room, two
// views (kapitel0-design §3, "Ein Ort, ein Bild"): Juno walks in it, and CAM 23 shows this same picture under the feed's filter.
// The alley is the near left wall, as from outside (as LUCKY STATIC's street): the door a gap at its left end with a mat and a sill, the
// window along the rest of it, shown in the cut as glass. Along the right back wall the eight dryers in a row, dryer 6 dead under
// its note, the sign NO SNEAKERS IN THE DRYER over them (and trainers going round behind the doors of 2, 3 and 7); on the left back
// wall three washers and, by the door, the counter with the man asleep behind it (his chair is in his figure). Two tubes with a
// green cast (kapitel1-design §9); CAM 23 hangs as a cheap dome over the aisle in front of dryers 5 and 6. The user's decisions
// of 2026-11-09. Painted (art/kit/laundromat.kit.px.js) after the user approved the blocks.
"use strict";

ISO_MAPS.laundromat = {
  size: [5, 4], cell: 0.5, at: [144, 78], screen: [320, 180], margin: 0.2,
  // "l" the old linoleum
  floor: [
    "llllllllll",
    "llllllllll",
    "llllllllll",
    "llllllllll",
    "llllllllll",
    "llllllllll",
    "llllllllll",
    "llllllllll",
  ],
  walls: [
    { from: [0, 0], to: [5, 0], h: 2.6, kit: "lm_wall" },                 // 0: the right back wall (the dryers, the sign)
    { from: [0, 0], to: [0, 4], h: 2.6, kit: "lm_wall" },                 // 1: the left back wall (the washers, the counter)
    // the alley's wall, near and cut: the door's gap at its left end, a post, the window, a post
    { from: [0.95, 4], to: [1.15, 4], h: 2.6, kit: "lm_wall", stub: true },
    { from: [1.15, 4], to: [4.6, 4], h: 2.6, kit: "lm_glass", stub: true },
    { from: [4.6, 4], to: [5, 4], h: 2.6, kit: "lm_wall", stub: true },
    { from: [5, 0], to: [5, 4], h: 2.6, kit: "lm_wall", stub: true },
  ],
  openings: [
    { id: "sign", wall: 0, from: 1.2, to: 3.7, h: [1.45, 1.94], kit: "lm_sign" },
    // the notices over the washers (a lost sock among them), the clock over the counter
    { id: "board", wall: 1, from: 0.95, to: 1.75, h: [1.3, 1.82], kit: "lm_board" },
    { id: "clock", wall: 1, from: 2.85, to: 3.35, h: [1.85, 2.3], kit: "lm_clock" },
  ],
  // behind the counter is the sleeper's (his chair is in his figure): nobody walks there
  nowalk: [[0, 2.7, 0.65, 0.7]],
  props: [
    // the dryers, 60 cm each, numbered from the back corner; the dryer kit reads its number from the id
    { id: "dryer1", kit: "lm_dryer", at: [0.1, 0.05], foot: [0.6, 0.75], h: 1.15 },
    { id: "dryer2", kit: "lm_dryer", at: [0.7, 0.05], foot: [0.6, 0.75], h: 1.15 },
    { id: "dryer3", kit: "lm_dryer", at: [1.3, 0.05], foot: [0.6, 0.75], h: 1.15 },
    { id: "dryer4", kit: "lm_dryer", at: [1.9, 0.05], foot: [0.6, 0.75], h: 1.15 },
    { id: "dryer5", kit: "lm_dryer", at: [2.5, 0.05], foot: [0.6, 0.75], h: 1.15 },
    { id: "dryer6", kit: "lm_dryer", at: [3.1, 0.05], foot: [0.6, 0.75], h: 1.15 },
    { id: "dryer7", kit: "lm_dryer", at: [3.7, 0.05], foot: [0.6, 0.75], h: 1.15 },
    { id: "dryer8", kit: "lm_dryer", at: [4.3, 0.05], foot: [0.6, 0.75], h: 1.15 },
    // three washers against the left back wall, their doors to the room
    { id: "washer1", kit: "lm_washer", at: [0.05, 0.9], foot: [0.65, 0.6], h: 0.9 },
    { id: "washer2", kit: "lm_washer", at: [0.05, 1.5], foot: [0.65, 0.6], h: 0.9 },
    { id: "washer3", kit: "lm_washer", at: [0.05, 2.1], foot: [0.65, 0.6], h: 0.9 },
    // the counter by the door, a step out from the wall: the man sleeps between it and the wall; the way in from the door
    // passes its end
    { id: "counter", kit: "lm_counter", at: [0.6, 2.75], foot: [0.45, 0.55], h: 1.0 },
    // two plastic chairs and a folding table at the window, a basket by the washers
    { id: "chair1", kit: "lm_chair", at: [2.5, 3.4], foot: [0.4, 0.4], h: 0.8 },
    { id: "chair2", kit: "lm_chair", at: [3.1, 3.4], foot: [0.4, 0.4], h: 0.8 },
    { id: "table", kit: "lm_table", at: [3.8, 3.2], foot: [0.6, 0.6], h: 0.72 },
    { id: "basket", kit: "lm_basket", at: [0.85, 1.25], foot: [0.45, 0.35], h: 0.35 },
    // the mat inside the door, the steel sill in its gap
    { id: "mat", kit: "lm_mat", at: [0.1, 3.45], foot: [0.8, 0.45], h: 0.02, block: false },
    { id: "sill", kit: "lm_sill", at: [0.04, 3.92], foot: [0.9, 0.08], h: 0.02, block: false },
    // the two tubes over the aisle, and CAM 23's dome on its cable (left out of its own picture)
    { id: "tubes", kit: "lm_tubes", at: [1.0, 1.6], foot: [3.2, 0.06], h: 2.45, block: false },
    { id: "cam", kit: "lm_cam", at: [3.3, 1.3], foot: [0.16, 0.16], h: 2.2, block: false },
  ],
  spots: {
    arrive: [0.75, 3.65, "ne"], door: [0.5, 3.85, "sw"],
    dryer6: [3.4, 1.3, "ne"], counter: [1.35, 3.0, "nw"], washer: [1.15, 1.8, "nw"],
    sleeper: [0.3, 3.05, "se"],
  },
  lights: [
    // the two tubes, white with the green cast of old phosphor
    { id: "tube1", at: [1.6, 1.63, 2.45], r: 150, power: 1.0, color: "#d0f0d8", flicker: 0.03, bake: { family: "green", line: [[1.1, 1.63, 2.45], [2.1, 1.63, 2.45]], reach: 3.2, power: 1.6, wrap: 0.5 } },
    { id: "tube2", at: [3.6, 1.63, 2.45], r: 150, power: 0.8, color: "#c0e8c8", flicker: 0.12, bake: { family: "green", line: [[3.1, 1.63, 2.45], [4.1, 1.63, 2.45]], reach: 3.2, power: 1.4, wrap: 0.5 } },
    // the alley's light in through the window and the door
    { id: "alley", at: [3.0, 4.6, 1.6], r: 100, power: 0.6, color: "#62def0", bake: { reach: 2.2, power: 1.2, wrap: 0.3 } },
  ],
};

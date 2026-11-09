// The alley behind the gate in Kowalski Street, as a map (art/lib/isomap.js has the format). Every length in meters. A deck over the
// water, as the Lower Ninth stands over the drowned city: a long deck between the buildings on the left and the water on the right,
// running on toward us out of the picture. Its near right edge is a balcony, a railing all along it, the quay wall and the water below,
// the alley mirrored in it (drawn in art/rooms/gasse.px.js; the user's wishes and drawings, 2026-11-09). The picture is wider and
// taller than the screen and scrolls with Juno. It lies behind Kowalski Street's right facade (the gate there, wall 0 of
// art/rooms/kowalski.map.js): the way in from the street is a passage through the building in the left back wall, at the picture's
// left edge, the street's cyan at its far end. The right back wall is
// SUDS & SPIN's front, the same wall the laundromat shows from inside as its near left one (art/rooms/laundromat.map.js: its u is this
// one's minus 0.6): the door at its left end under a lamp, the long window, the sign, the dryers' vent puffing steam, a flat's window
// above. On the left back wall a niche where somebody lives (a mattress, a pot) and the way down to the Drain Market under its sign
// (kapitel1-design §9: nothing to walk over; the handrails as the user drew them). In the middle an old statue from before the flood,
// candles at its foot, a light from above on it. Dark (the user's wish): a few bright neon lights and cones of light, the rest night.
// Blocks for now (art/kit/gasse.kit.px.js): to be judged before anything is painted.
"use strict";

ISO_MAPS.gasse = {
  size: [6, 9], cell: 0.5, at: [224, 60], screen: [416, 236], margin: 0.2,
  // "p" the alley's old paving, "w" puddles, "g" a drain
  floor: [
    "pppppppppppp",
    "ppppppwwpppp",
    "ppppppwwpppp",
    "pppwpppppgpp",
    "ppwwpppppppp",
    "pppppppppwwp",
    "pppppppppwpp",
    "pppppppppppp",
    "ppppwwpppppp",
    "pppppppppppp",
    "ppppppppwwpp",
    "pppppppppwpp",
    "pppppppppppp",
    "ppwwpppppppp",
    "pppwpppppppp",
    "pppppppppppp",
    "pppppppppppp",
    "pppppppppppp",
  ],
  walls: [
    { from: [0, 0], to: [6, 0], h: 6, kit: "gs_facade" },                // 0: the right back wall, SUDS & SPIN's front
    { from: [0, 0], to: [0, 9], h: 6, kit: "gs_wall" },                  // 1: the left back wall (the niche, the way down, the passage)
    // (the near right side has no wall: the balcony's railing, the water below; the near left one is beyond the picture)
  ],
  openings: [
    // SUDS & SPIN: the door, the window, the sign, the dryers' vent; a flat's window above
    { id: "laundromat", wall: 0, from: 0.6, to: 1.55, h: [0, 2.1], kit: "gs_lm_door" },
    { id: "laundromat_window", wall: 0, from: 1.75, to: 5.2, h: [0.55, 2.2], kit: "gs_lm_window" },
    { id: "laundromat_sign", wall: 0, from: 1.9, to: 4.9, h: [2.35, 2.8], kit: "gs_lm_sign" },
    { id: "vent", wall: 0, from: 5.3, to: 5.6, h: [2.3, 2.55], kit: "gs_vent" },
    { id: "flat_window", wall: 0, from: 4.2, to: 5.0, h: [3.4, 4.3], kit: "gs_flat_window" },
    { id: "door_lamp", wall: 0, from: 0.95, to: 1.2, h: [2.2, 2.32], kit: "gs_lamp" },
    // the niche, a recess somebody lives in (its mattress and pot stand in it)
    { id: "niche", wall: 1, from: 0.35, to: 1.35, h: [0, 1.7], kit: "gs_niche", open: { depth: 0.9, side: 0, h: 1.7, floor: "n", wall: "gs_niche_wall" } },
    // the way down to the Drain Market and its sign
    { id: "market", wall: 1, from: 1.85, to: 3.25, h: [0, 2.2], kit: "gs_market" },
    { id: "market_sign", wall: 1, from: 1.75, to: 3.35, h: [2.35, 2.75], kit: "gs_market_sign" },
    // the passage through the building to Kowalski Street
    { id: "kowalski", wall: 1, from: 5.0, to: 5.95, h: [0, 2.2], kit: "gs_passage" },
  ],
  // the deck runs on beyond the picture's left edge: nobody walks out of it
  nowalk: [[0, 6.5, 0.5, 2.5], [0.5, 7.0, 0.5, 2.0], [1.0, 7.5, 0.5, 1.5], [1.5, 8.0, 0.5, 1.0]],
  props: [
    // in the niche (baked into the picture through it)
    { id: "mattress", kit: "gs_mattress", behind: "niche", at: [-0.82, 0.42], foot: [0.72, 0.86], h: 0.14, block: false },
    { id: "pot", kit: "gs_pot", behind: "niche", at: [-0.3, 1.1], foot: [0.18, 0.18], h: 0.16, block: false },
    // at the facade's right end, under the vent: the bins, a stack of crates
    { id: "bins", kit: "gs_bins", at: [4.0, 0.08], foot: [1.0, 0.6], h: 1.0 },
    { id: "crates", kit: "gs_crates", at: [5.15, 0.1], foot: [0.55, 0.55], h: 0.7 },
    // in the middle, the statue on its plinth, candles at its foot
    { id: "statue", kit: "gs_statue", at: [2.6, 3.3], foot: [0.7, 0.7], h: 2.3 },
    // the balcony's railing along the near right edge, over the water
    { id: "railing", kit: "gs_railing", at: [5.86, 0.12], foot: [0.1, 8.88], h: 1.0 },
    // the cable bundles across the alley, high over everyone
    { id: "cables", kit: "gs_cables", at: [0.05, 0.05], foot: [0.1, 0.1], h: 3.0, block: false },
  ],
  spots: {
    arrive: [0.55, 5.5, "se"], kowalski: [0.4, 5.5, "nw"],
    laundromat: [1.1, 0.45, "ne"], market: [0.45, 2.55, "nw"], niche: [0.5, 0.85, "nw"], statue: [2.95, 4.35, "ne"],
    water: [5.55, 3.2, "se"],
  },
  lights: [
    // the laundromat's green, dim through its window
    { id: "laundromat", at: [3.3, 0.15, 1.4], r: 80, power: 0.5, color: "#c0e8c8", flicker: 0.08, bake: { family: "green", line: [[1.9, 0.15, 1.4], [5.0, 0.15, 1.4]], reach: 1.6, power: 1.2, floor: 1.2 } },
    // the lamp over the laundromat's door: a cone down on its step
    { id: "door_lamp", at: [1.08, 0.25, 2.3], r: 50, power: 0.7, color: "#dafcff", flicker: 0.05, bake: { reach: 2.6, power: 1.5, floor: 1.6, dir: [0, 0.3, -1], wrap: 0.2 } },
    // the market's glow coming up the stairs, and its sign
    { id: "market", at: [0.25, 2.55, 0.3], r: 70, power: 0.7, color: "#ff4fd3", flicker: 0.1, bake: { reach: 1.6, power: 1.8, floor: 1.4 } },
    // the light on the statue from above (a lamp somebody hung on the cables for it), and the candles at its foot
    { id: "statue", at: [2.95, 3.65, 3.2], r: 60, power: 0.8, color: "#ffd58a", flicker: 0.04, bake: { reach: 3.5, power: 1.8, floor: 1.6, dir: [0, 0, -1], wrap: 0.3 } },
    { id: "candles", at: [2.95, 4.1, 0.15], r: 26, power: 0.5, color: "#ffb860", flicker: 0.25, bake: { reach: 0.6, power: 1.6 } },
    // the street's cyan at the passage's far end
    { id: "street", at: [0.15, 5.5, 1.4], r: 50, power: 0.4, color: "#62def0", bake: { reach: 0.9, power: 1.4, floor: 1.3 } },
  ],
};

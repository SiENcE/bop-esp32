// The alley behind the gate in Kowalski Street, as a map (art/lib/isomap.js has the format). Every length in meters. A back alley
// shut in by the buildings round it, the rain coming down into it. It lies behind Kowalski Street's right facade (the gate there, wall
// 0 of art/rooms/kowalski.map.js), so the street is on its near left side: the gate a gap in the near left wall, as LUCKY STATIC's and
// the laundromat's street sides are. Its far end, the right back wall, is SUDS & SPIN's front, the same wall the laundromat shows from
// inside as its near left one (art/rooms/laundromat.map.js: its u is this one's minus 0.6): the door at its left end, the long window,
// the sign over them, the dryers' vent puffing steam, a lit window of a flat above with its AC dripping. On the left back wall a niche
// where somebody lives (a mattress, a pot) and the way down to the Drain Market: an opening with the stairs going down, DRAIN MARKET
// over it (kapitel1-design §9, decided 2026-11-09: nothing to walk over; the handrails as the user drew them). Cable bundles across,
// dripping; bins and crates under the vent; puddles. The alley is a deck over the water, as the Lower Ninth stands over the drowned
// city: its near right side is a balcony, a railing at the edge (the user's wish, 2026-11-09), and below it the quay wall and the
// water with the alley's lights mirrored in it (drawn in art/rooms/gasse.px.js); the picture is taller than the screen and scrolls
// down with Juno. On the near left the cut through the deck, the water under it too. Blocks for now (art/kit/gasse.kit.px.js): to
// be judged before anything is painted.
"use strict";

ISO_MAPS.gasse = {
  size: [6, 4], cell: 0.5, at: [128, 60], screen: [320, 290], margin: 0.2,
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
  ],
  walls: [
    { from: [0, 0], to: [6, 0], h: 6, kit: "gs_facade" },                // 0: the right back wall, SUDS & SPIN's front
    { from: [0, 0], to: [0, 4], h: 6, kit: "gs_wall" },                  // 1: the left back wall (the niche, the way down)
    // the near left wall, cut: the gate to Kowalski Street a gap at its left end
    { from: [1.3, 4], to: [6, 4], h: 6, kit: "gs_wall", stub: true },
    // (the near right side has no wall: the balcony's railing, the water below)
  ],
  openings: [
    // SUDS & SPIN: the door, the window, the sign, the dryers' vent; a flat's lit window above and its AC
    { id: "laundromat", wall: 0, from: 0.6, to: 1.55, h: [0, 2.1], kit: "gs_lm_door" },
    { id: "laundromat_window", wall: 0, from: 1.75, to: 5.2, h: [0.55, 2.2], kit: "gs_lm_window" },
    { id: "laundromat_sign", wall: 0, from: 1.9, to: 4.9, h: [2.35, 2.8], kit: "gs_lm_sign" },
    { id: "vent", wall: 0, from: 5.3, to: 5.6, h: [2.3, 2.55], kit: "gs_vent" },
    { id: "flat_window", wall: 0, from: 4.2, to: 5.0, h: [3.4, 4.3], kit: "gs_flat_window" },
    { id: "ac", wall: 0, from: 4.3, to: 4.9, h: [3.0, 3.3], kit: "gs_ac" },
    // the niche, a recess somebody lives in (its mattress and pot stand in it)
    { id: "niche", wall: 1, from: 0.35, to: 1.35, h: [0, 1.7], kit: "gs_niche", open: { depth: 0.9, side: 0, h: 1.7, floor: "n", wall: "gs_niche_wall" } },
    // the way down to the Drain Market and its sign
    { id: "market", wall: 1, from: 1.85, to: 3.25, h: [0, 2.2], kit: "gs_market" },
    { id: "market_sign", wall: 1, from: 1.75, to: 3.35, h: [2.35, 2.75], kit: "gs_market_sign" },
  ],
  props: [
    // in the niche (baked into the picture through it)
    { id: "mattress", kit: "gs_mattress", behind: "niche", at: [-0.82, 0.42], foot: [0.72, 0.86], h: 0.14, block: false },
    { id: "pot", kit: "gs_pot", behind: "niche", at: [-0.3, 1.1], foot: [0.18, 0.18], h: 0.16, block: false },
    // at the facade's right end, under the vent: the bins, a stack of crates
    { id: "bins", kit: "gs_bins", at: [4.0, 0.08], foot: [1.0, 0.6], h: 1.0 },
    { id: "crates", kit: "gs_crates", at: [5.15, 0.1], foot: [0.55, 0.55], h: 0.7 },
    // the balcony's railing along the near right edge, over the water
    { id: "railing", kit: "gs_railing", at: [5.86, 0.12], foot: [0.1, 3.86], h: 1.0 },
    // the cable bundles across the alley, high over everyone
    { id: "cables", kit: "gs_cables", at: [0.05, 0.05], foot: [0.1, 0.1], h: 3.0, block: false },
  ],
  spots: {
    arrive: [0.8, 3.45, "ne"], kowalski: [0.75, 3.85, "sw"],
    laundromat: [1.1, 0.45, "ne"], market: [0.45, 2.55, "nw"], niche: [0.5, 0.85, "nw"], water: [5.55, 2.3, "se"],
  },
  lights: [
    // the laundromat's green through its window and door
    { id: "laundromat", at: [3.3, 0.15, 1.4], r: 120, power: 0.8, color: "#c0e8c8", flicker: 0.08, bake: { family: "green", line: [[1.9, 0.15, 1.4], [5.0, 0.15, 1.4]], reach: 2.6, power: 1.6, floor: 1.4 } },
    // the market's glow coming up the stairs
    { id: "market", at: [0.25, 2.55, 0.3], r: 80, power: 0.7, color: "#ff4fd3", flicker: 0.1, bake: { reach: 1.8, power: 1.6, floor: 1.4 } },
    // the flat's window above, warm
    { id: "flat", at: [4.6, 0.15, 3.8], r: 40, power: 0.4, color: "#ffb860", bake: { reach: 1.2, power: 1.4 } },
    // the street's cyan in through the gate
    { id: "street", at: [0.8, 4.6, 1.8], r: 90, power: 0.5, color: "#62def0", bake: { reach: 2.0, power: 1.2, floor: 1.3 } },
  ],
};

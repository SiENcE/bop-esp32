// Kowalski Street as a map (art/lib/isomap.js has the format): the street outside the Kessel Block, as in
// mockup C at the new scale, so it is wider than the screen (416 px: it scrolls). Every length in meters.
// Two facades meet at the back corner. On the left one the Kessel Block's street door, then LUCKY STATIC
// (its window, its door, its neon over them; enterable in Chapter 1). On the right one the vending machine,
// the big broken ad screen (the prologue's end: JUNO.), the alley down to the Drain Market at the far end
// (closed tonight). In front Bao's cart under its umbrella; string lights across; puddles.
"use strict";

ISO_MAPS.kowalski = {
  size: [7.0, 6.0], cell: 0.5, at: [188, 66], screen: [416, 180], margin: 0.2,
  // "s" the sidewalk's slabs along the facades, "a" the street's asphalt, "w" puddles, "g" the drain grate
  floor: [
    "ssssssssssssss",
    "ssssssssssssss",
    "ssssaaaaaaaaaa",
    "ssaaaaawwaaaaa",
    "ssaaaaawwaaaga",
    "ssaawaaaaaaaaa",
    "ssawwaaaaaaaaa",
    "ssaaaaaaaaaaaa",
    "ssaaaaaaaaaaaa",
    "ssaaaaaaaaaaaa",
    "ssaaaaaaaaaaaa",
    "ssaaaaaaaaaaaa",
  ],
  walls: [
    { from: [0, 0], to: [7.0, 0], h: 6.0, kit: "facade_right" },        // 0: the right facade (ad screen)
    { from: [0, 0], to: [0, 6.0], h: 6.0, kit: "facade_left" },         // 1: the left facade (LUCKY STATIC)
  ],
  // the screen's and the sign's tops are kept under the picture's top edge (the room scrolls only sideways)
  openings: [
    { id: "kessel_door", wall: 1, from: 0.2, to: 1.2, h: [0, 2.3], kit: "kessel_street_door" },
    { id: "lucky_window", wall: 1, from: 1.7, to: 3.8, h: [0.4, 2.2], kit: "lucky_window" },
    { id: "lucky_door", wall: 1, from: 4.0, to: 4.9, h: [0, 2.2], kit: "lucky_door" },
    { id: "lucky_sign", wall: 1, from: 1.6, to: 4.8, h: [2.35, 3.05], kit: "lucky_sign" },
    { id: "ad", wall: 0, from: 2.2, to: 5.6, h: [1.1, 3.35], kit: "ad_screen" },
    { id: "alley", wall: 0, from: 6.0, to: 7.0, h: [0, 3.0], kit: "alley_gate" },
  ],
  props: [
    { id: "vending", kit: "vending", at: [0.9, 0.05], foot: [0.7, 0.55], h: 1.85 },
    { id: "cart", kit: "bao_cart", at: [2.2, 2.0], foot: [1.1, 0.6], h: 0.95 },
    { id: "bins", kit: "bins", at: [5.3, 0.05], foot: [0.6, 0.45], h: 0.9 },
    // the cart's umbrella (2.4 m) over the cart: people always draw in front of it (else it would hide whoever
    // stands at the Kessel Block's door or the vending machine)
    { id: "umbrella", kit: "bao_umbrella", over: "cart", at: [2.2, 2.0], foot: [1.1, 0.6], h: 2.4, block: false, back: true },
    // the string lights across the street, high over everyone (block: false: they stand on nothing)
    { id: "lights", kit: "string_lights", at: [0.05, 0.05], foot: [0.1, 0.1], h: 3.5, block: false },
  ],
  spots: {
    arrive: [0.6, 0.75, "se"], kessel_door: [0.4, 0.7, "nw"], vending: [1.25, 0.85, "ne"], ad: [3.8, 1.2, "ne"],
    alley: [6.0, 0.9, "ne"], lucky: [0.6, 2.8, "nw"], lucky_door: [0.5, 4.45, "nw"], bins: [5.6, 0.85, "ne"],
    bao: [1.85, 2.3, "se"], eat: [2.75, 2.95, "ne"],
    steam: [2.95, 2.3, null, 1.22],    // over Bao's pot (the steam's fx rises from it)
  },
  lights: [
    { id: "lucky", at: [0.05, 2.7, 1.4], r: 110, power: 1.0, color: "#ffb860", flicker: 0.05 },
    { id: "sign", at: [0.1, 3.1, 2.9], r: 90, power: 0.9, color: "#ff4fd3", flicker: 0.1 },
    // the screen's cyan: full in the bake, gentler on people in the game (Juno stays yellow)
    { id: "ad", at: [3.9, 0.2, 2.6], r: 150, power: 0.55, color: "#62def0", flicker: 0.2, bake: { power: 1.1 } },
    { id: "vending", at: [1.25, 0.65, 1.2], r: 50, power: 0.8, color: "#dafcff", flicker: 0.05 },
    { id: "lantern", at: [2.47, 2.72, 1.95], r: 50, power: 0.8, color: "#ffd58a", flicker: 0.1 },
  ],
};

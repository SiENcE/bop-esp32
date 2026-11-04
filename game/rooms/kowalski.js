// Halcyon: Kowalski Street (kapitel0-design §6.2 steps 16-17, §7.1), the street outside the Kessel Block, baked
// from its map (art/rooms/kowalski.map.js); 416 px wide, it scrolls. The Kessel Block's door back in, LUCKY
// STATIC (the bar, enterable in Chapter 1), Bao's cart under its umbrella, the noodle machine, the big broken
// ad screen (the prologue ends there: JUNO.), the alley down to the Drain Market (shut tonight), the bins.
"use strict";

(function () {
  const AW = Halcyon.at.kowalski, AL = Halcyon.at.kessel_lobby;

  Cutaway.room("kowalski", {
    name: "Kowalski-Straße", background: "kowalski_bg", size: [416, 180],
    ambience: ["city_far", "neon_buzz", { sfx: "feed_rain", gain: 0.6 }], music: { theme: "juno", intensity: 0.4 },
    walk: AW.walk, holes: AW.holes, props: AW.props,
    // the map's lamps: the bar's warm light, its sign's magenta, the screen's cyan, the machine, the lantern
    light: { ambient: 0.8, color: "#d4dcf4", lamps: AW.lamps.map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
    // the rain in two layers (far and dim, near and bright), the light hanging in it, glints, drops
    // (the steam and the splashes are in the picture)
    fx: [
      { kind: "rain", rect: [0, 0, 416, 180], count: 70, color: "#41547a", speed: 140, slant: 0.3, length: 3 },
      { kind: "rain", rect: [0, 0, 416, 180], count: 55, color: "#6c809a", speed: 210, slant: 0.3, length: 5 },
      { kind: "haze", poly: AW.hazeDoor, color: "#ffd58a", alpha: 0.1, fade: 0.4 },
      { kind: "haze", poly: AW.hazeAd, color: "#62def0", alpha: 0.07, fade: 0.4, lamp: "ad" },
      { kind: "sparkle", points: AW.glints, every: 2600, color: "#dafcff" },
      ...AW.drips.map((/** @type {number[]} */ [x, y, to], /** @type {number} */ i) => ({ kind: "drip", at: [x, y], to, every: 1300 + i * 470, color: "#6c809a" })),
    ],
    hotspots: {
      kessel_door: { name: "Haustür", rect: AW.kessel_doorRect, walkTo: AW.kessel_door, face: "nw",
        look: "Der Kessel-Block. Vierzehn Stockwerke, und ganz oben wohn ich.",
        use: [{ goto: "kessel_lobby", at: AL.street, face: "se" }] },
      lucky: { name: "LUCKY STATIC", rect: AW.lucky_windowRect, walkTo: AW.lucky, face: "nw",
        look: ["Das LUCKY STATIC. Mei lässt mich anschreiben, wenn Bao nicht da ist.", "Drinnen sitzen die üblichen zwei. Die sitzen da seit der Flut."] },
      lucky_door: { name: "Eingang", rect: AW.lucky_doorRect, walkTo: AW.lucky_door, face: "nw",
        look: "Es riecht nach Brühe und nach altem Bier.",
        use: "Nicht heute. Heute will ich Bao." },
      lucky_sign: { name: "Leuchtschrift", rect: AW.lucky_signRect, walkTo: AW.lucky, face: "nw",
        look: "LUCKY STATIC. Das Y flackert, seit ich hier wohne. Mei sagt, das ist das Glück." },
      vending: { name: "Nudelautomat", poly: AW.vendingPoly, walkTo: AW.vending, face: "ne",
        look: ["Der Nudelautomat. Er hat ein Gesicht. Heute ist es müde.", "Die zweite Reihe ist ausverkauft. Seit Wochen."],
        use: "Er nimmt keine Chits von mir. Wir hatten einen Streit." },
      ad: { name: "Werbebildschirm", rect: AW.adRect, walkTo: AW.ad, face: "ne",
        look: ["HALCYON. SLEEP BETTER.", "Die Hälfte vom Bildschirm ist kaputt. Die bessere Hälfte."] },
      alley: { name: "Gasse", rect: AW.alleyRect, walkTo: AW.alley, face: "ne",
        look: "Da runter geht's zum Drain-Markt. Das Gitter ist zu.",
        use: "Nicht heute Nacht." },
      bins: { name: "Mülltonne", poly: AW.binsPoly, walkTo: AW.bins, face: "ne",
        look: "Die Tonne ist so voll, dass der Deckel auf einem Sack steht." },
      cart: { name: "Baos Garküche", poly: AW.cartPoly, walkTo: AW.eat, face: "nw",
        look: ["Baos Garküche. Der Topf dampft.", "Bao ist gleich wieder da. Bao ist immer gleich wieder da."],
        use: [{ end: "Ende des Testabschnitts. Bao kommt als Nächstes (H3)." }] },
    },
    enter: [{ once: ["Draußen. Regen, Neon und Brühe. Die Kowalski-Straße."] }],
  });
})();

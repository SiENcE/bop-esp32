// lantern_versteck: Lantern's hide, a half-drowned shop at the end of the cable (docs/kapitel2-design.md §3.5 L5, §9.2), on blocks: its picture,
// walk area, props and lamps come from the bake (game/rooms/lantern_versteck.layout.js, Nagiwa.at.lantern_versteck). Lantern and his talk:
// game/kapitel2_lantern.js.
"use strict";

(function () {
  const A = Nagiwa.at.lantern_versteck;
  Cutaway.room("lantern_versteck", {
    name: "Lanterns Versteck", background: "lantern_versteck_bg",
    walk: A.walk, holes: A.holes, props: A.props,
    light: { ambient: 0.6, lamps: A.lamps.map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
    ambience: ["deck_fans", "kanal_wasser"], music: { theme: "juno", intensity: 0.15 },
    hotspots: {
      door: { name: "Zum Floß", poly: A.doorPoly, walkTo: A.door, face: "nw", look: "Draußen liegt das Floß am Seil.",
        use: [{ goto: "sumpf", at: Nagiwa.at.sumpf.end, face: "sw" }] },
      sender: { name: "Sender", poly: A.senderPoly, walkTo: A.talk, face: "ne",
        look: ["Da laufen Bildschirme mit Kameras, die keiner mehr kennt.", "Mittendrin steht ein Kasten mit Antennen. Das ist der Sender."] },
      window: { name: "Fenster", poly: A.windowPoly, walkTo: A.talk, face: "ne",
        look: "Vor der Scheibe steht das Wasser. Drinnen ist es trocken, irgendwie." },
    },
  });
})();

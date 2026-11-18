// shop24: the 24-hour shop on Fischermann Street (the user's wish, 2026-11-18), on blocks for now (art/rooms/shop24.map.js; painted later): its
// picture, walk area, props and lamps come from the bake (game/rooms/shop24.layout.js, Nagiwa.at.shop24). Juno can go in from Chapter 2 on;
// a side quest is planned here (nobody behind the counter yet). The way in is the shop's door on the street (game/rooms/weg1.js).
"use strict";

(function () {
  const A = Nagiwa.at.shop24, AW = Nagiwa.at.weg1;
  Cutaway.room("shop24", {
    name: "24h-Laden", background: "shop24_bg",
    walk: A.walk, holes: A.holes, props: A.props,
    light: { ambient: 0.9, lamps: A.lamps.map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
    ambience: ["fridge_hum", "neon_buzz"], music: { theme: "juno", intensity: 0.2 },
    hotspots: {
      door: { name: "Zur Fischermann Street", poly: A.doorPoly, walkTo: A.door, face: "ne", look: "Draußen ist die Fischermann Street.",
        use: [{ sfx: "door_open" }, { goto: "weg1", at: AW.shop, face: "down" }] },
      window: { name: "Schaufenster", poly: A.windowPoly, walkTo: A.door, face: "ne", look: "Im Fenster steht 24H, von innen verkehrt herum." },
      fridges: { name: "Kühlschränke", poly: A.fridgesPoly, walkTo: A.fridges, face: "nw", look: "Kühlschränke voller Dosen. Das Licht ist das kälteste im ganzen Neunten." },
      counter: { name: "Kasse", poly: A.counterPoly, walkTo: A.counter, face: "se", look: ["Hinter der Kasse ist keiner.", "Rund um die Uhr offen heißt hier nicht, dass jemand da ist."] },
      shelves: { name: "Regale", poly: A.shelf_aPoly, walkTo: A.shelves, face: "nw", look: "Nudeln, Batterien, Lull-Pflaster im Zehnerpack. Alles, was man nachts braucht." },
      shelves_b: { name: "Regale", poly: A.shelf_bPoly, walkTo: A.shelves, face: "nw", look: "Nudeln, Batterien, Lull-Pflaster im Zehnerpack. Alles, was man nachts braucht." },
    },
  });
})();

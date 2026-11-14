// ines_wohnung: Ines' flat, 4B (docs/kapitel2-design.md §3.3 W5–W7, §9.2), on blocks: its picture, walk area, props and lamps come from the bake
// (game/rooms/ines_wohnung.layout.js, Nagiwa.at.ines_wohnung). What she left (the napkin, the file in the freezer): game/kapitel2_lerche.js.
"use strict";

(function () {
  const A = Nagiwa.at.ines_wohnung;
  Cutaway.room("ines_wohnung", {
    name: "Ines' Wohnung", background: "ines_wohnung_bg",
    walk: A.walk, holes: A.holes, props: A.props,
    light: { ambient: 0.7, lamps: A.lamps.map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
    ambience: ["fridge_hum", "city_far"], music: { theme: "juno", intensity: 0.15 },
    hotspots: {
      door: { name: "Tür", poly: A.doorPoly, walkTo: A.door, face: "nw", look: "Das Schloss ist aufgebrochen, von denen, nicht von mir.",
        use: [{ goto: "lerche_flur", at: Nagiwa.at.lerche_flur.door_4b, face: "sw" }] },
      window: { name: "Fenster", poly: A.windowPoly, walkTo: A.window, face: "ne", look: ["Draußen ist das Licht der Straße.", "Das ist das Einzige, was sie ihr nicht mitnehmen konnten."] },
      bed: { name: "Matratze", poly: A.bedPoly, walkTo: A.bed, face: "se", look: ["Eine Matratze auf dem Boden, ohne Bettzeug.", "Mehr hat sie zum Schlafen nicht gebraucht. Vielleicht hat sie auch kaum geschlafen."] },
      chair: { name: "Stuhl", poly: A.chairPoly, walkTo: A.chair, face: "ne", look: ["Ein Stuhl vor nichts.", "Davor ist ein heller Fleck auf dem Boden. Da stand der Rechner, und den haben sie mitgenommen."] },
      fridge: { name: "Kühlschrank", poly: A.fridgePoly, walkTo: A.fridge, face: "ne", look: ["Der Kühlschrank brummt noch. Den wollten sie nicht.", "Oben hängt ein Zettel unter einem Magneten."] },
    },
  });
})();

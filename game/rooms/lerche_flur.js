// lerche_flur: the 4th floor's landing in the Wohnblock Lerche (docs/kapitel2-design.md §3.3 W4, §9.2), on its own blocks for the user's approval: its picture, walk area,
// props and lamps come from the bake (game/rooms/lerche_flur.layout.js, Nagiwa.at.lerche_flur). The way in is the gate at the end of Jade Row
// (game/kapitel2_lerche.js); what its doors do is there too.
"use strict";

(function () {
  const A = Nagiwa.at.lerche_flur;
  Cutaway.room("lerche_flur", {
    name: "Wohnblock Lerche, 4. Stock", background: "lerche_flur_bg",
    walk: A.walk, holes: A.holes, props: A.props,
    light: { ambient: 0.8, lamps: A.lamps.map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
    ambience: ["neon_buzz", "fridge_hum"], music: { theme: "juno", intensity: 0.25 },
    hotspots: {
      stairs: { name: "Treppe", poly: A.railPoly, walkTo: A.stairs, face: "ne", look: "Die Treppe geht runter auf die Straße, zurück zur Jade Row." },
      door_4a: { name: "4A", poly: A.door_4aPoly, walkTo: A.door_4a, face: "ne", look: "Auf 4A steht kein Name, nur ein Aufkleber von Nagi·wa: SLEEP BETTER.", use: "Da wohnt jemand anderes." },
      door_4c: { name: "4C", poly: A.door_4cPoly, walkTo: A.door_4c, face: "nw", look: "Vor 4C stehen Schuhe. Wer da wohnt, ist zu Hause.", use: "Da wohnt jemand anderes." },
      door_4b: { name: "4B", poly: A.door_4bPoly, walkTo: A.door_4b, face: "ne", look: "Das ist 4B." },
      meters: { name: "Zählerkasten", poly: A.metersPoly, walkTo: A.door_4c, face: "nw", look: "Das sind die Stromzähler vom ganzen Stock. Einer davon steht still." },
      window: { name: "Fenster", poly: A.windowPoly, walkTo: A.stairs, face: "ne", look: "Draußen regnet es auf die Querstraße. Gegenüber sind ein paar Fenster hell." },
      tube: { name: "Neonröhre", poly: A.tubePoly, walkTo: A.door_4b, face: "ne", look: "Das Licht ist gelb und ein bisschen grün. Wie überall, wo keiner zuständig ist." },
      cam: { name: "Kamera", poly: A.camPoly, walkTo: A.stairs, face: "ne", look: "Die Kamera in der Ecke ist CAM 25. Mit dem Code von unten komm ich da auch rein." },
    },
  });
})();

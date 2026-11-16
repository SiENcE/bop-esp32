// lantern_versteck: Lantern's caravan from the inside, his home and his sender (docs/kapitel2-design.md §3.5 L5, §9.2; the user's layout,
// 2026-11-16), on blocks: its picture, walk area, props and lamps come from the bake (game/rooms/lantern_versteck.layout.js,
// Nagiwa.at.lantern_versteck). The bed at the back against the left wall, a Lull poster over it with darts in it; along the long side wall the kitchen with
// its window and the fridge, then his monitors and deck and the rack of senders; the door to the cab at the front, only hinted at (shut:
// nobody goes there); the sliding door out to the pontoon in the middle of the near side.
// Lantern and his talk: game/kapitel2_lantern.js.
"use strict";

(function () {
  const A = Nagiwa.at.lantern_versteck;
  Cutaway.room("lantern_versteck", {
    name: "Lanterns Wohnwagen", background: "lantern_versteck_bg",
    walk: A.walk, holes: A.holes, props: A.props,
    light: { ambient: 0.6, lamps: A.lamps.map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
    ambience: ["deck_fans", "sumpf_regen"], music: { theme: "sumpf", intensity: 0.3 },
    hotspots: {
      door: { name: "Schiebetür", poly: A.doorPoly, walkTo: A.door, face: "se", look: "Draußen schaukeln die Pontons, und Pike wartet auf seinem Floß.",
        use: [{ goto: "sumpf", at: Nagiwa.at.sumpf.juno, face: "se" }] },
      sender: { name: "Monitore", poly: A.senderPoly, walkTo: A.talk, face: "ne",
        look: ["Da laufen Bildschirme mit Kameras, die keiner mehr kennt.", "Davor sein Deck. Das Gehäuse hat er selbst gebaut, man sieht die Schrauben."] },
      rack: { name: "Sender", poly: A.rackPoly, walkTo: A.talk, face: "ne",
        look: ["Ein Regal voller Kästen mit kleinen Lichtern. Das ist der Sender.", "Ein Kabel geht nach draußen, ins Wasser, zurück in die Stadt."] },
      kueche: { name: "Küche", poly: A.kuechePoly, walkTo: A.arrive, face: "ne",
        look: ["Eine Kochplatte, ein Spülbecken, ein Topf mit etwas, das mal Suppe war.", "Er kocht für einen. Er kocht nicht oft."] },
      window: { name: "Fenster", poly: A.windowPoly, walkTo: A.arrive, face: "ne",
        look: "Draußen stehen Bäume im Wasser, und seine Laternen hängen in den Ästen. Drinnen ist es trocken, irgendwie." },
      fridge: { name: "Kühlschrank", poly: A.fridgePoly, walkTo: A.arrive, face: "ne",
        look: ["Ein alter Kühlschrank voller Aufkleber. Einer ist ein Lull-Pflaster, durchgestrichen.", "Er brummt, also lebt er."] },
      bett: { name: "Bett", poly: A.bettPoly, walkTo: A.arrive, face: "nw",
        look: ["Eine Matratze quer im Heck, eine Decke darüber.", "Daneben eine Rampe aus Brettern, für den Stuhl."] },
      plakat: { name: "Plakat", poly: A.plakatPoly, walkTo: A.arrive, face: "nw",
        look: ["Ein Plakat für Lull: SLEEP BETTER. Jemand hat ein Kreuz über das Gesicht gesprüht.", "Drei Wurfpfeile stecken drin. Einer genau im Pflaster."] },
      kabine: { name: "Fahrerkabine", poly: A.kabinePoly, walkTo: A.talk, face: "se",
        look: "Die Tür nach vorn zur Fahrerkabine ist zu.", use: ["Die Tür ist zu. Und das ist sein Wagen, nicht meiner."] },
    },
  });
})();

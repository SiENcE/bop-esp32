// ines_wohnung: Ines' flat, 4B (docs/kapitel2-design.md §3.3 W5–W7, §9.2): its picture, walk area, props and lamps come from the bake
// (game/rooms/ines_wohnung.layout.js, Nagiwa.at.ines_wohnung). What she left (the napkin, the file in the freezer): game/kapitel2_lerche.js.
"use strict";

(function () {
  const A = Nagiwa.at.ines_wohnung;
  Cutaway.room("ines_wohnung", {
    name: "Ines' Wohnung", background: "ines_wohnung_bg", size: /** @type {[number, number]} */ ([432, 270]),
    walk: A.walk, holes: A.holes, props: A.props,
    light: { ambient: 0.7, lamps: A.lamps.map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
    ambience: ["fridge_hum", "city_far"], music: { theme: "juno", intensity: 0.15 },
    hotspots: {
      door: { name: "Tür", poly: A.doorPoly, walkTo: A.door, face: "nw", look: "Das Schloss ist aufgebrochen, von denen, nicht von mir.",
        use: [{ goto: "lerche_flur", at: Nagiwa.at.lerche_flur.door_4b, face: "sw" }] },
      window: { name: "Fenster", poly: A.windowPoly, walkTo: A.window, face: "ne", look: ["Draußen ist das Licht der Straße.", "Das ist das Einzige, was sie ihr nicht mitnehmen konnten."] },
      bed: { name: "Bett", poly: A.bedPoly, walkTo: A.bed, face: "ne", look: ["Ein gutes Bett aus Eiche. Das Bettzeug liegt daneben auf dem Boden.", "Die haben unter der Matratze nachgesehen."] },
      armchair: { name: "Sessel", poly: A.armchairPoly, walkTo: A.armchair, face: "ne", look: ["Ein Ledersessel, abgewetzt an den Lehnen. Darüber eine Lampe, die mehr gekostet hat als meine Miete.", "Hier hat sie gelesen. Papier, nicht Bildschirm."] },
      counter: { name: "Küchenzeile", poly: A.counterPoly, walkTo: A.counter, face: "ne", look: ["Eine Espressomaschine aus Chrom, in einer Wohnung im Neunten.", "Sie hatte Geld. Sie hat nur nichts gezeigt, was man sieht."] },
      chair: { name: "Stuhl", poly: A.chairPoly, walkTo: A.chair, face: "nw", look: ["Ein guter Stuhl vor einem leeren Tisch.", "Die Kabel an der Steckdose sind abgeschnitten. Die hatten es eilig."] },
      desk: { name: "Schreibtisch", poly: A.deskPoly, walkTo: A.chair, face: "nw", look: ["Ihr Schreibtisch. Im Staub sind saubere Rechtecke: der Rechner, zwei Bildschirme, die Tastatur.", "Den Rechner haben sie mitgenommen. Die Schublade steht offen, und drin ist nichts mehr."] },
      window2: { name: "Fenster", poly: A.window2Poly, walkTo: A.window2, face: "ne", look: "Draußen ist das Licht der Straße, kalt und blau." },
      view: { name: "Geländer", poly: A.rail_backPoly, walkTo: A.view, face: "ne", z: 1,
        look: ["Von hier sieht man über die Dächer bis aufs Wasser.", { zoom: "look_balkon" }, "Dahinter ist der Sumpf. Da brennen zwei grüne Lichter, wo eigentlich keiner wohnt.", { zoom: false }] },
      deckchair: { name: "Klappstuhl", poly: A.deckchairPoly, walkTo: A.balcony, face: "se", look: "Ein Klappstuhl, nass vom Regen. Hier hat sie gesessen und rausgeschaut." },
      herbs: { name: "Kräuter", poly: A.herbsPoly, walkTo: A.balcony, face: "ne", look: "Zwei Töpfe mit Kräutern. Der Basilikum ist schon in die Blüte gegangen." },
      shelves: { name: "Regal", poly: A.shelvesPoly, walkTo: A.shelves, face: "ne", look: ["Ein Regal aus echtem Holz, leer. Nur eine Tasse haben sie stehen lassen.", "Was hier stand, ist jetzt in einer Kiste von Civic Rest."] },
      plant: { name: "Pflanze", poly: A.plantPoly, walkTo: A.plant, face: "se", look: "Eine große Pflanze in einem teuren Topf. Sie lässt die Blätter hängen, die gießt keiner mehr." },
      box: { name: "Karton", poly: A.boxPoly, walkTo: A.box, face: "ne", look: "Ein Karton, umgekippt und leer. Den haben sie dagelassen." },
      fridge: { name: "Kühlschrank", poly: A.fridgePoly, walkTo: A.fridge, face: "ne", look: ["Der Kühlschrank brummt noch. Den wollten sie nicht.", "Oben hängt ein Zettel unter einem Magneten."] },
    },
  });
})();

// weg1: Weg_1, the street the user drew in the city plan (2026-11-18), seen straight down as the Drain Market is (art/rooms/weg1.px.js, on
// its approved blocks for now): from the gate at the end of Jade Row north, then west past the Wohnblock Lerche (its door where the arm
// turns: the keypad, CAM 24's doorbell lens) to the stairs down to the Old Fish Market, shut for now (the user: maybe later, with a side
// quest). Juno is seen from above here (game/cast.js). Its people (the homeless man, Lull's sheep, the cleaning robot) are in the picture
// until they are painted as figures; their looks are here. What its doors do is in game/kapitel2_lerche.js.
"use strict";

(function () {
  const A = Nagiwa.at.weg1, AJ = Nagiwa.at.jade_row;
  Cutaway.room("weg1", {
    name: "Weg_1", background: "weg1_bg", size: /** @type {[number, number]} */ (A.size), walk: A.walk, holes: A.holes,
    light: { ambient: 1 },
    fx: [
      { kind: "rain", rect: [0, 0, A.size[0], A.size[1]], count: 160, color: "#41547a", speed: 160, slant: 0.15, length: 3 },
      { kind: "rain", rect: [0, 0, A.size[0], A.size[1]], count: 40, color: "#8e9ab0", speed: 240, slant: 0.15, length: 5 },
    ],
    ambience: ["city_far", "neon_buzz", { sfx: "feed_rain", gain: 0.6 }], music: { theme: "juno", intensity: 0.35 },
    hotspots: {
      gate: { name: "Zur Jade Row", rect: A.gateRect, walkTo: A.gate, face: "down", look: "Durch das Tor geht's zurück in die Jade Row.",
        use: [{ goto: "jade_row", at: AJ.far, face: "sw" }] },
      fish: { name: "Treppe zum Fischmarkt", rect: A.fishRect, walkTo: A.fish, face: "left", look: "Die Treppe geht runter zum alten Fischmarkt.",
        use: ["Da unten ist nur der alte Fischmarkt. Da hab ich nichts verloren."] },
      homeless: { name: "Obdachloser", rect: A.homelessRect, walkTo: A.homelessTalk, face: "down",
        look: ["Er schläft auf Pappe, unterm Rand vom Laden. Neben ihm ein Einkaufswagen voller alter Bildschirme.", "Einer davon zeigt noch Rauschen. Er hat ihn angelassen, wie ein Feuer."] },
      sheep: { name: "Lull-Schaf", poly: A.sheepPoly, walkTo: A.sheepTalk, face: "right",
        look: ["Ein Mann im Schafskostüm von Lull. Er steht und schläft.", "Seine Flyer liegen um ihn rum im Regen. SLEEP IS FREE."] },
      robot: { name: "Putzroboter", poly: A.robotPoly, walkTo: A.robotTalk, face: "left",
        look: ["Ein Putzroboter fährt in der Pfütze im Kreis und piept.", "Er will die Pfütze wegputzen. Es regnet."] },
      noodles: { name: "Nudelbar", rect: A.noodlesRect, walkTo: A.noodles, face: "down", look: "Die Nudelbar hat noch auf. Riecht nach Brühe und nassem Karton." },
      trash: { name: "Müll", poly: A.trashPoly, walkTo: A.trash, face: "up", look: "Müllsäcke vor dem Wohnblock. Die holt hier keiner." },
      steam: { name: "Gully", poly: A.steamPoly, walkTo: A.steam, face: "right", look: "Aus dem Gully dampft es. Darunter läuft irgendwas Warmes." },
      lerche: { name: "Wohnblock Lerche", rect: A.lercheRect, walkTo: A.lerche, face: "up",
        look: ["Die Haustür vom Wohnblock Lerche. Neben der Klingel sitzt das Zahlenfeld.", "Und die Linse, durch die ich in CAM 24 schaue."] },
    },
  });
})();

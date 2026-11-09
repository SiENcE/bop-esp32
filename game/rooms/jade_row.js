// Nagiwa: Jade Row, the lane left of Kowalski Street, on blocks (art/mock/jade_row.px.js): the view down its length. Okonkwo's corner shop stands in it, and
// across the lane the machine whose small camera sees into his window: job B of Chapter 1 plays here. Open from Chapter 1 on.
"use strict";

(function () {
  const AJ = Nagiwa.at.jade_row, AW = Nagiwa.at.kowalski;
  const kowalski = Cutaway.room.get("kowalski");
  // on the street's left end the passage through the building (the street's map: the opening and spot "west")
  kowalski.hotspots.west = { name: "Jade Row", rect: AW.westRect, walkTo: AW.west, face: "nw",
    look: "Da durch geht's in die Jade Row. Licht und Suppe bis in die Nacht.",
    use: [{ if: "day=1", then: ["Nicht heute. Heute will ich Bao."], else: [{ goto: "jade_row", at: AJ.arrive, face: "nw" }] }] };

  Cutaway.room("jade_row", { name: "Jade Row", background: "jade_row_bg", walk: AJ.walk,
    // the lane's life, none of it a state: the steam at its end; in front of Juno the heads along the edge
    props: [
      { id: "steam", image: "jade_steam", at: [108, 40], anchor: [0, 0], baseline: 1 },
      { id: "crowd", image: "jade_crowd", at: [0, 148], anchor: [0, 0], baseline: 300 },
      // the car parked facing us down the lane (art/mock/jade_row.px.js, JADE_CAR); gone while Revier 9's patrol car waits there in
      // CAM 07 at 00:30 (game/auftrag_tide.js), the user's wish
      { id: "car", image: "jade_car", at: [156, 86], anchor: [0, 0], baseline: 107, if: { not: ["day>1", "day<4", "time>=00:30", "time<00:45", "!off_tide"] } },
    ],
    fx: [
      { kind: "rain", rect: [0, 0, 320, 180], count: 60, color: "#41547a", speed: 140, slant: 0.3, length: 3 },
      { kind: "rain", rect: [0, 0, 320, 180], count: 45, color: "#6c809a", speed: 210, slant: 0.3, length: 5 },
    ],
    ambience: ["city_far", "neon_buzz", { sfx: "feed_rain", gain: 0.6 }], music: { theme: "juno", intensity: 0.4 },
    hotspots: {
      // the arch in the near right-hand wall: the passage back to Kowalski Street
      back: { name: "Zur Kowalski-Straße", rect: AJ.backRect, walkTo: AJ.back, face: "se", look: "Der Durchgang zur Kowalski-Straße. Da hinten das Blau vom Werbeschirm.",
        use: [{ goto: "kowalski", at: AW.west, face: "se" }] },
      window: { name: "Okonkwos Laden", rect: AJ.windowRect, walkTo: AJ.shop, face: "nw", look: ["Reis, Batterien, Zigaretten. Okonkwo hinter der Theke, mit der Lesebrille.", "Er grüßt mich jeden Abend. Ich hab nie gefragt, warum."] },
      sign: { name: "OKONKWO", rect: AJ.signRect, walkTo: AJ.shop, face: "nw", look: "OKONKWO. Die einzigen Buchstaben hier, die ich lesen kann, ohne zu raten." },
      machine: { name: "Automat", rect: AJ.machineRect, walkTo: AJ.machine, face: "nw", z: 1, look: "SMILE FOR A COUPON. Ein Automat, der Leute fotografiert. Und die bedanken sich." },
      soup: { name: "Suppenküche", rect: AJ.soupRect, walkTo: AJ.soup, face: "ne", look: "HOT SOUP. Bao sagt, die salzen zu wenig. Bao sagt das über alle." },
      parlour: { name: "MAHJONG", rect: AJ.parlourRect, walkTo: AJ.parlour, face: "nw", look: "Mahjong. Von hier hört man nur die Steine." },
      pharmacy: { name: "Apotheke", rect: AJ.pharmacyRect, walkTo: AJ.pharmacy, face: "ne", look: "Eine Apotheke. Vorn Tee, hinten alles andere." },
      signs: { name: "Schilder", rect: AJ.signsRect, walkTo: AJ.pharmacy, face: "ne", look: "Die Zeichen kann hier kaum noch einer lesen. Sie leuchten trotzdem." },
      gate: { name: "Das Tor", rect: AJ.gateRect, walkTo: AJ.far, face: "ne", look: "JADE ROW. Das Tor ist älter als die Flut. Das meiste hier ist das." },
      balcony: { name: "Balkon", rect: AJ.balconyRect, walkTo: AJ.shop, face: "nw", look: "Über Okonkwo raucht einer und sieht runter. Dasselbe wie ich, nur billiger." },
      night: { name: "NACHTMARKT", rect: AJ.nightRect, walkTo: AJ.pharmacy, face: "ne", look: "Nachtmarkt. Sagt Mei. Einen Markt gibt's hier schon lange nicht mehr. Die Nacht schon." },
      arcade: { name: "Spielautomaten", rect: AJ.arcadeRect, walkTo: AJ.parlour, face: "nw", look: "SUMP RUNNER, als Automat. Der da spielt, seit ich hier wohne. Motte wär längst weiter." },
      car: { name: "Der Wagen", rect: AJ.carRect, if: { not: ["day>1", "day<4", "time>=00:30", "time<00:45", "!off_tide"] }, walkTo: AJ.far, face: "ne", look: "Ein Wagen mit laufendem Motor und Licht an. Hier hält nur, wer wartet." },
      screen: { name: "Der große Schirm", rect: AJ.screenRect, walkTo: AJ.far, face: "ne", look: "LULL. FREE. Zwei Wochen gratis. Danach kostet's." },
    },
  });
})();

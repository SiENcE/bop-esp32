// Nagiwa: Jade Row, the lane left of Kowalski Street, painted (art/rooms/jade_row.px.js, on the lines of its approved blocks, now
// art/old/jade_row_blocks.px.js): the view down its length. Okonkwo's corner shop stands in it, and
// across the lane the machine whose small camera sees into his window: job B of Chapter 1 plays here. Open from Chapter 1 on.
"use strict";

(function () {
  const AJ = Nagiwa.at.jade_row, AW = Nagiwa.at.kowalski, P = Nagiwa.parts.jade_row;
  const kowalski = Cutaway.room.get("kowalski");
  // on the street's left end the passage through the building (the street's map: the opening and spot "west")
  kowalski.hotspots.west = { name: "Jade Row", poly: AW.westPoly, walkTo: AW.west, face: "nw",
    look: "Da durch geht's in die Jade Row. Da gibt's Licht und Suppe bis in die Nacht.",
    use: [{ if: "day=1", then: ["Heute nicht. Heute will ich zu Bao."], else: [{ goto: "jade_row", at: AJ.arrive, face: "nw" }] }] };

  Cutaway.room("jade_row", { name: "Jade Row", background: "jade_row_bg", walk: AJ.walk,
    // the lane's life, none of it a state: what moves in the painting (the screen, NIGHT MARKET, a lantern, the smoker's smoke, the
    // arcade, the machine's LED, the soup, the gate: each its own rect of the picture, behind everyone); the steam at its end; in
    // front of Juno the heads along the edge
    props: [
      ...P.parts.map((/** @type {any} */ p) => ({ id: p.name.slice("jade_row_".length), image: p.name, at: p.at, anchor: [0, 0], baseline: 0 })),
      { id: "steam", image: "jade_row_steam", at: [108, 40], anchor: [0, 0], baseline: 1 },
      { id: "crowd", image: "jade_row_crowd", at: [0, 148], anchor: [0, 0], baseline: 300 },
      // the car parked facing us down the lane (art/mock/jade_row.px.js, JADE_CAR); gone while Revier 9's patrol car waits there in
      // CAM 07 at 00:30 (game/auftrag_tide.js), the user's wish
      { id: "car", image: "jade_row_car", at: [156, 86], anchor: [0, 0], baseline: 107, if: { not: ["day>1", "day<4", "time>=00:30", "time<00:45", "!off_tide"] } },
    ],
    fx: [
      { kind: "rain", rect: [0, 0, 320, 180], count: 60, color: "#41547a", speed: 140, slant: 0.3, length: 3 },
      { kind: "rain", rect: [0, 0, 320, 180], count: 45, color: "#6c809a", speed: 210, slant: 0.3, length: 5 },
    ],
    // the painting's lamps as the runtime light: Juno takes on the shop's warm light, the machine's cyan, the neon's magenta
    light: { ambient: 0.85, lamps: P.lamps.map((/** @type {any} */ [x, y, color, r], /** @type {number} */ i) => ({ id: `lamp${i}`, at: [x, y], r, color, power: 1 })) },
    ambience: ["city_far", "neon_buzz", { sfx: "feed_rain", gain: 0.6 }], music: { theme: "juno", intensity: 0.4 },
    hotspots: {
      // the arch in the near right-hand wall: the passage back to Kowalski Street
      back: { name: "Zur Kowalski-Straße", poly: AJ.backPoly, walkTo: AJ.back, face: "se", look: "Der Durchgang führt zur Kowalski-Straße. Da hinten leuchtet das Blau vom Werbeschirm.",
        use: [{ goto: "kowalski", at: AW.west, face: "se" }] },
      window: { name: "Okonkwos Laden", poly: AJ.windowPoly, walkTo: AJ.shop, face: "nw", look: ["Okonkwo verkauft Reis, Batterien und Zigaretten.", "Er steht mit der Lesebrille hinter der Theke.", "Er grüßt mich jeden Abend. Ich hab nie gefragt, warum."] },
      sign: { name: "OKONKWO", poly: AJ.signPoly, walkTo: AJ.shop, face: "nw", z: 1, look: "Da steht OKONKWO. Das sind die einzigen Buchstaben hier, die ich ohne Raten lesen kann." },
      machine: { name: "Automat", rect: AJ.machineRect, walkTo: AJ.machine, face: "nw", z: 1, look: "SMILE FOR A COUPON. Der Automat fotografiert Leute, und die bedanken sich." },
      soup: { name: "Suppenküche", poly: AJ.soupPoly, walkTo: AJ.soup, face: "ne", look: "HOT SOUP. Bao sagt, die salzen zu wenig. Bao sagt das über alle." },
      parlour: { name: "MAHJONG", poly: AJ.parlourPoly, walkTo: AJ.parlour, face: "nw", look: "Da drin spielen sie Mahjong. Von hier hört man nur die Steine." },
      pharmacy: { name: "Apotheke", poly: AJ.pharmacyPoly, walkTo: AJ.pharmacy, face: "ne", look: "In der Apotheke gibt's vorn Tee und hinten alles andere." },
      signs: { name: "Schilder", rect: AJ.signsRect, walkTo: AJ.pharmacy, face: "ne", look: "Die Zeichen kann hier kaum noch einer lesen. Sie leuchten trotzdem." },
      gate: { name: "Das Tor", rect: AJ.gateRect, walkTo: AJ.far, face: "ne", look: "JADE ROW. Das Tor ist älter als die Flut. Das meiste hier ist das." },
      balcony: { name: "Balkon", poly: AJ.balconyPoly, walkTo: AJ.shop, face: "nw", look: "Über Okonkwo raucht einer und sieht runter. Er macht dasselbe wie ich, nur billiger." },
      night: { name: "NACHTMARKT", poly: AJ.nightPoly, walkTo: AJ.pharmacy, face: "ne", look: "Das heißt Nachtmarkt, sagt Mei. Einen Markt gibt's lange nicht mehr, die Nacht schon." },
      arcade: { name: "Spielautomaten", rect: AJ.arcadeRect, walkTo: AJ.parlour, face: "nw", look: ["SUMP RUNNER gibt's hier als Automat. Der da spielt, seit ich hier wohne.", "Motte wär längst weiter."] },
      car: { name: "Der Wagen", rect: AJ.carRect, if: { not: ["day>1", "day<4", "time>=00:30", "time<00:45", "!off_tide"] }, walkTo: AJ.far, face: "ne", look: "Der Wagen hat den Motor laufen und das Licht an. Hier hält nur, wer wartet." },
      screen: { name: "Der große Schirm", rect: AJ.screenRect, walkTo: AJ.far, face: "ne", look: "LULL. FREE. Zwei Wochen ist es gratis, danach kostet's." },
    },
  });
})();

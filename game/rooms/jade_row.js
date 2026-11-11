// Nagiwa: Jade Row, the lane left of Kowalski Street, painted (art/rooms/jade_row.px.js, on the lines of its approved blocks, now
// art/old/jade_row_blocks.px.js): the view down its length. Okonkwo's corner shop stands in it, and
// across the lane the machine whose small camera sees into his window: job B of Chapter 1 plays here. Open from Chapter 1 on.
"use strict";

(function () {
  const AJ = Nagiwa.at.jade_row, AW = Nagiwa.at.kowalski, P = Nagiwa.parts.jade_row;
  const SHOP_LOOK = ["Okonkwo verkauft Reis, Batterien und Zigaretten.", "Er steht mit der Lesebrille hinter der Theke.", "Er grüßt mich jeden Abend. Ich hab nie gefragt, warum."];
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
    // the atmosphere the user chose (2026-11-11, docs/rooms/jade_row_stimmung_vergleich.png, f; the mist through the picture and the
    // lights' halos are painted, art/rooms/jade_row.px.js): rain in three layers, fine and far, mid, a few long near streaks; a cyan
    // haze round the big screen; the picture's edges darker (post: vignette)
    fx: [
      { kind: "rain", rect: [0, 0, 320, 180], count: 110, color: "#2f3e5a", speed: 120, slant: 0.3, length: 2 },
      { kind: "rain", rect: [0, 0, 320, 180], count: 80, color: "#41547a", speed: 190, slant: 0.3, length: 4 },
      { kind: "rain", rect: [0, 0, 320, 180], count: 28, color: "#8e9ab0", speed: 300, slant: 0.32, length: 8 },
      { kind: "haze", poly: [96, 0, 224, 0, 224, 112, 96, 112], color: "#62def0", alpha: 0.07, fade: 0.5 },
      // the mist drifting (the user's wish, 2026-11-11: it must move): two bands sliding past each other down the lane, kept off the
      // walls beside it (clipped to the lane's opening), and one over the ground
      { kind: "mist", image: "jade_row_mist_far_a", poly: [118, 26, 202, 26, 218, 118, 102, 118], at: [0, 34], drift: [-4, 0], alpha: 0.2, bob: 2 },
      { kind: "mist", image: "jade_row_mist_far_b", poly: [118, 26, 202, 26, 218, 118, 102, 118], at: [0, 58], drift: [2.5, 0], alpha: 0.16, bob: 3 },
      { kind: "mist", image: "jade_row_mist_near", poly: [102, 118, 218, 118, 320, 168, 320, 180, 0, 180, 0, 168], at: [0, 128], drift: [-6, 0], alpha: 0.18, bob: 2 },
    ],
    post: [{ vignette: 0.4 }],
    // the painting's lamps as the runtime light: Juno takes on the shop's warm light, the machine's cyan, the neon's magenta; and every
    // paper lantern, big or small, a lamp of its own that flickers in its own time and glows (the user's wish, 2026-11-11)
    light: { ambient: 0.8, lamps: [
      ...P.lamps.map((/** @type {any} */ [x, y, color, r], /** @type {number} */ i) => ({ id: `lamp${i}`, at: [x, y], r, color, power: 1 })),
      ...P.lanterns.map((/** @type {any} */ [x, y, r], /** @type {number} */ i) => ({ id: `lantern${i}`, at: [x, y], r: Math.max(16, r * 3), color: "#ffd58a", power: 0.9,
        flicker: 0.14, rate: 6 + (i % 4), glow: { r: Math.max(4, Math.round(r * 1.4)), strength: 0.35 } })),
    ] },
    ambience: ["city_far", "neon_buzz", { sfx: "feed_rain", gain: 0.6 }], music: { theme: "juno", intensity: 0.4 },
    hotspots: {
      // the arch in the near right-hand wall: the passage back to Kowalski Street
      back: { name: "Zur Kowalski-Straße", poly: AJ.backPoly, walkTo: AJ.back, face: "se", look: "Der Durchgang führt zur Kowalski-Straße. Da hinten leuchtet das Blau vom Werbeschirm.",
        use: [{ goto: "kowalski", at: AW.west, face: "se" }] },
      // (the two windows either side of his door, the near one its own hotspot with the same look)
      window_near: { name: "Okonkwos Laden", poly: AJ.windowNearPoly, walkTo: AJ.shop, face: "nw", look: SHOP_LOOK },
      window: { name: "Okonkwos Laden", poly: AJ.windowPoly, walkTo: AJ.shop, face: "nw", look: SHOP_LOOK },
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

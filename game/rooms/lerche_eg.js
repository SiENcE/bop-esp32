// lerche_eg: a new room baked from its map (art/rooms/lerche_eg.map.js), made by tools/new-room.mjs: its picture, walk area, props and lamps
// come from the bake (game/rooms/lerche_eg.layout.js, Nagiwa.at.lerche_eg). Its looks; no way in yet.
"use strict";

(function () {
  const A = Nagiwa.at.lerche_eg;
  Cutaway.room("lerche_eg", {
    name: "Wohnblock Lerche", background: "lerche_eg_bg", size: /** @type {[number, number]} */ ([432, 292]),
    walk: A.walk, holes: A.holes, props: A.props,
    light: { ambient: 0.8, lamps: A.lamps.map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
    hotspots: {
      lift: { name: "Aufzug", poly: A.liftPoly, walkTo: A.lift, face: "ne", look: "Der Aufzug hier fährt. In diesem Haus funktioniert noch was." },
      stairs: { name: "Treppe", poly: A.stairsPoly, walkTo: A.stairs, face: "ne", look: "Vier Stockwerke. Im Kessel wären es vierzehn." },
      mailboxes: { name: "Briefkästen", poly: A.mailboxesPoly, walkTo: A.mailboxes, face: "ne", look: ["Zwölf Briefkästen. Über dem von 4B klebt ein rotes Band.", "Ihre Post kriegt jetzt jemand anderes."] },
      board: { name: "Aushang", poly: A.boardPoly, walkTo: A.board, face: "ne", look: "Am Brett hängen die Hausordnung und ein Zettel, den keiner mehr liest." },
      neon: { name: "NINTH LIVE", poly: A.neonPoly, walkTo: A.mailboxes, face: "ne", look: "NINTH LIVE leuchtet sogar hier im Hausflur. Die sind überall, wo jemand wartet." },
      screen: { name: "Bildschirm", poly: A.screenPoly, walkTo: A.screen, face: "nw", look: "SLEEP BETTER. LULL IS FREE. Sogar im Hausflur sagen sie mir, dass ich schlafen soll." },
      arcade: { name: "SUMP RUNNER", poly: A.arcadePoly, walkTo: A.arcade, face: "ne", look: ["Ein SUMP-RUNNER-Automat, im Hausflur.", "Den hat einer aus der Jade Row hergeschleppt, oder er stand schon immer hier.", "Der Münzschlitz klemmt. Er läuft umsonst."],
        // the game, on a screen of its own (game/sump_runner.js)
        use: [{ sfx: "type" }, { goto: "sump_runner", transition: "dissolve" }] },
      pram: { name: "Kinderwagen", poly: A.pramPoly, walkTo: A.pram, face: "ne", look: "Ein Kinderwagen. Der gehört zu den kleinen Schuhen oben vor der Tür." },
    },
  });
})();

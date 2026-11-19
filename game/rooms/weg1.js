// weg1: Fischermann Street (the user's name; Weg_1 in the city plan, where the user drew it on 2026-11-18), seen straight down as the Drain Market is (art/rooms/weg1.px.js, painted
// on its approved blocks, 2026-11-19): from the gate at the end of Jade Row north, then west past the Wohnblock Lerche (its door where the arm
// turns: the keypad, CAM 24's doorbell lens) to the stairs down to the Old Fish Market, shut for now (the user: maybe later, with a side
// quest). Juno is seen from above here (game/cast.js). Its people (the homeless man, Lull's sheep, the cleaning robot) are sprites of
// their own over the picture, painted; their looks are here. What its doors do is in game/kapitel2_lerche.js.
"use strict";

(function () {
  const A = Nagiwa.at.weg1, AJ = Nagiwa.at.jade_row, P = Nagiwa.parts.weg1;
  Cutaway.room("weg1", {
    name: "Fischermann Street", background: "weg1_bg", size: /** @type {[number, number]} */ (A.size), walk: A.walk, holes: A.holes,
    // the painting's street lamps as the runtime light: Juno takes on the shops' and the signs' colours (art/rooms/weg1.px.js)
    light: { ambient: 0.85, lamps: P.lamps.map((/** @type {any} */ [x, y, color, r], /** @type {number} */ i) => ({ id: `lamp${i}`, at: [x, y], r, color, power: 1 })) },
    // what hangs over the people: the cables and their lanterns, the strings of bulbs, the awnings, the blade signs
    // (and over it the steam from the gully, 24H's failing H, the shut shop's tube, the noodle bar's blade sign stuttering)
    foreground: [{ image: "weg1_over", at: [0, 0] }, ...P.parts.filter((/** @type {any} */ p) => p.layer === "over").map((/** @type {any} */ p) => ({ image: p.name, at: p.at }))],
    // the people and the robot apart from the picture, so they can come and go (on blocks: art/rooms/weg1.px.js). The night after the
    // clip went to the shop's chain (shop24_gone, game/kapitel2_laden.js) the homeless man is gone, his cardboard left; after it was sold
    // through Sable another man stands in the costume; the robot goes round its puddle until Juno resets it, then round the street
    props: [
      // what moves in the picture (art/rooms/weg1.px.js): the roof signs stuttering, MAHJONG's bulbs, Lull's projection, the water running
      // west, the kitchen's exhaust, the machine's flicker; under everyone
      ...P.parts.filter((/** @type {any} */ p) => p.layer === "under").map((/** @type {any} */ p) => ({ id: p.name, image: p.name, at: p.at, anchor: [0, 0], baseline: 0 })),
      { id: "homeless", image: "weg1_homeless", at: A.homelessAt, anchor: [0, 0], baseline: A.homelessAt[1] + 23, if: "!shop24_gone" },
      { id: "sheep", image: "weg1_sheep", at: A.sheepAt, anchor: [0, 0], baseline: A.sheepAt[1] + 27, if: { not: ["shop24_gone", "ledger_shop24=sold"] } },
      { id: "sheep2", image: "weg1_sheep2", at: A.sheepAt, anchor: [0, 0], baseline: A.sheepAt[1] + 27, if: ["shop24_gone", "ledger_shop24=sold"] },
    ],
    extras: [
      { costume: { idle: "weg1_robot", walk: "weg1_robot" }, at: A.robotRing[0], path: A.robotRing.slice(1), speed: [14, 14], lit: false, turns: false, notice: 0, give: 0, side: 0, if: "!link_cam26" },
      { costume: { idle: "weg1_robot", walk: "weg1_robot" }, at: A.robotRounds[0], path: A.robotRounds.slice(1), speed: [16, 16], pause: 900, lit: false, turns: false, notice: 0, give: 0, if: "link_cam26" },
      ...A.queue.map((/** @type {any} */ [x, y, nn, dir]) => ({ costume: { idle: Nagiwa.top(`statist_${nn}_idle`) }, at: [x, y], facing: dir, turns: false, if: "time>=19:00" })),
      ...A.walkers.map((/** @type {any} */ w) => ({ costume: { idle: Nagiwa.top(`statist_${w.look}_idle`), walk: Nagiwa.top(`statist_${w.look}_walk`) },
        at: w.at, path: w.path, loop: "back", speed: [30, 30], pause: w.pause })),
    ],
    fx: [
      { kind: "rain", rect: [0, 0, A.size[0], A.size[1]], count: 160, color: "#41547a", speed: 160, slant: 0.15, length: 3 },
      { kind: "rain", rect: [0, 0, A.size[0], A.size[1]], count: 40, color: "#8e9ab0", speed: 240, slant: 0.15, length: 5 },
    ],
    ambience: ["city_far", "neon_buzz", { sfx: "feed_rain", gain: 0.6 }], music: { theme: "juno", intensity: 0.35 },
    hotspots: {
      gate: { name: "Zur Jade Row", rect: A.gateRect, walkTo: A.gate, face: "down", look: "Durch das Tor geht's zurück in die Jade Row.",
        use: [{ goto: "jade_row", at: AJ.far, face: "sw" }] },
      fish: { name: "Treppe zum Fischmarkt", rect: A.fishRect, walkTo: A.fish, face: "left", look: "Die Treppe geht runter zum alten Fischmarkt. Davor ist ein Gitter.",
        use: ["Das Gitter ist zu, mit einem Vorhängeschloss.", "Unten hör ich Wasser, ein Aggregat und Stimmen.", "Da unten ist jemand. Um die Zeit."] },
      homeless: { name: "Obdachloser", rect: A.homelessRect, walkTo: A.homelessTalk, face: "down", if: "!shop24_gone",
        look: ["Er schläft auf Pappe, unterm Rand vom Laden. Neben ihm ein Einkaufswagen voller alter Bildschirme.", "Einer davon zeigt noch Rauschen. Er hat ihn angelassen, wie ein Feuer.",
          "Manchmal ist auf dem Rauschen kurz ein Bild. Ein Flur.", "Das ist CAM 25. Wo hat er die her?"] },
      cardboard: { name: "Pappe", rect: A.homelessRect, walkTo: A.homelessTalk, face: "down", if: "shop24_gone",
        look: ["Da liegt nur noch seine Pappe. Der Wagen mit den Bildschirmen ist weg.", "Die Kette hat den Gehweg räumen lassen."] },
      // (what talking to them does is the side thread's: game/kapitel2_laden.js)
      sheep: { name: "Lull-Schaf", poly: A.sheepPoly, walkTo: A.sheepTalk, face: "right", if: { not: ["shop24_gone", "ledger_shop24=sold"] },
        look: ["Ein Mann im Schafskostüm von Lull. Er steht und schläft.", "Seine Flyer liegen um ihn rum im Regen. SLEEP IS FREE.",
          "Er murmelt im Schlaf: „Eine Frau in Weiß. Am Bahnsteig. Sie geht zur Treppe.“", "Der auch."] },
      sheep2: { name: "Lull-Schaf", poly: A.sheepPoly, walkTo: A.sheepTalk, face: "right", if: ["shop24_gone", "ledger_shop24=sold"],
        look: ["Ein anderer Mann im Schafskostüm. Den Kopf trägt er unterm Arm.", "Der ist wach. Der schläft im Dienst bestimmt nicht."] },
      robot: { name: "Putzroboter", poly: A.robotPoly, walkTo: A.robotTalk, face: "left", if: "!link_cam26",
        look: ["Ein Putzroboter fährt in der Pfütze im Kreis und piept.", "Er will die Pfütze wegputzen. Es regnet."] },
      noodles: { name: "Nudelbar", rect: A.noodlesRect, walkTo: A.noodles, face: "down", look: "Die Nudelbar hat noch auf. Riecht nach Brühe und nassem Karton.",
        // the cook says what the day brought (kapitel2-design §7): only words, no flag
        use: [{ if: "time<19:00", then: ["Die Nudelbar macht erst um sieben auf."],
          else: [{ if: "day=5", then: [{ say: "koch", text: "Tote in der alten Metro. Und keiner will was gesehen haben." }] },
            { if: "day=6", then: [{ say: "koch", text: "Jetzt soll's ein Rollstuhl gewesen sein. Gestern war's noch keiner." }] },
            { if: "day=7", then: [{ say: "koch", text: "Die in Weiß waren gestern im Lerche. Vierter Stock, sagt meine Schwester." }] }] }] },
      trash: { name: "Müll", poly: A.trashPoly, walkTo: A.trash, face: "up", look: "Müllsäcke vor dem Wohnblock. Die holt hier keiner." },
      steam: { name: "Gully", poly: A.steamPoly, walkTo: A.steam, face: "right", look: "Aus dem Gully dampft es. Darunter läuft irgendwas Warmes." },
      // the 24-hour shop (the user's wish, 2026-11-18): Juno can go in from Chapter 2 on; a side quest is planned there
      shop: { name: "24h-Laden", rect: A.shopRect, walkTo: A.shop, face: "down", look: ["Ein 24h-Laden. Das Licht fällt bis auf die Straße.", "Drinnen sieht man Regale, aber keinen Menschen."],
        use: [{ if: "day>4", then: [{ sfx: "door_open" }, { goto: "shop24", at: Nagiwa.at.shop24.arrive, face: "se" }], else: ["Heute nicht."] }] },
      lerche: { name: "Wohnblock Lerche", rect: A.lercheRect, walkTo: A.lerche, face: "up",
        look: ["Die Haustür vom Wohnblock Lerche. Neben der Klingel sitzt das Zahlenfeld.", "Und die Linse, durch die ich in CAM 24 schaue."] },
    },
  });
  Cutaway.actor("koch", { name: "Der Koch", color: "#eea040", voice: { pitch: 46, range: 5, wave: "square", syllable: 75, speed: 1.1 } });

  // the delivery drone flies over everyone and waits for nobody: not an extra (those keep to the floor and wait for the way to clear) but
  // drawn after the room, over all of it, back and forth along its line with a rest at each end
  Cutaway.events.on("scene.drawn", (/** @type {CanvasRenderingContext2D} */ ctx) => {
    if (Cutaway.scene.room?.id !== "weg1") return;
    const [[x0, y0], [x1, y1]] = [A.drone.at, A.drone.path[0]], go = Math.hypot(x1 - x0, y1 - y0) / A.drone.speed * 1000, rest = A.drone.rest;
    const t = Cutaway.clock.time % (2 * (go + rest)), leg = t < go + rest ? t : t - go - rest, k = Math.min(1, leg / go), there = t >= go + rest;
    const f = there ? 1 - k : k;
    Cutaway.assets.draw(ctx, "weg1_drone", Math.round(x0 + (x1 - x0) * f), Math.round(y0 + (y1 - y0) * f), { t: Cutaway.clock.time });
  });
})();

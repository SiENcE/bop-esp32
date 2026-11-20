// Nagiwa: Chapter 2's side thread "Wer passt auf den Laden auf?" (kapitel2-design §6.5, the user's choice 2026-11-18), on blocks. The man in
// Lull's sheep costume on Fischermann Street is the 24-hour shop's night clerk; asleep on his feet on a Lull patch, nobody is behind the
// register, every night goods go missing and come off his wage. Juno resets the cleaning robot circling in its puddle with her pocket
// deck; it drives home to its dock in the shop, and through the dock the shop's camera, CAM 26, is hers. Its archive shows the homeless
// man taking what expires tomorrow. She shows the clip to the clerk, montages an empty loop over it, or sells it to Sable for the chain:
// the same choice she makes every evening, small. A thread of its own (off_shop24), checked alone with the others shut; it begins on any
// evening of the chapter and ends in it (nothing is kept).
//   link_cam26          the robot reset: CAM 26 on her map, linked (code_cam26 with it: the code is the dock's, nothing to type)
//   cache_clip_shop24   the archive's night in her CACHE; mont_clip_shop24: the empty loop laid over it (game/deck.js, MONTIEREN)
//   ledger_shop24       shown | cut | sold: what she did with it (the Kassenbuch's line; sold pays 60)
//   shop24_gone         the night after it went to the chain (shown, sold): the homeless man is gone, after a sale the clerk too
// The street's people, the robot and the shop's things are drawn and placed in game/rooms/weg1.js and game/rooms/shop24.js; this file
// gives them their words and what they do.
"use strict";

(function () {
  const AW = Nagiwa.at.weg1, AS = Nagiwa.at.shop24, A26 = Nagiwa.at.cam26;
  const SH = (/** @type {string} */ text) => ({ say: "schaf", text }), SH2 = (/** @type {string} */ text) => ({ say: "schaf2", text });
  Cutaway.actor("schaf", { name: "Das Schaf", color: "#d8dce8", voice: { pitch: 50, range: 3, wave: "triangle", syllable: 95, speed: 0.85 } });
  Cutaway.actor("schaf2", { name: "Das andere Schaf", color: "#c0c8d8", voice: { pitch: 44, range: 4, wave: "square", syllable: 75, speed: 1.1 } });
  Nagiwa.people.obdachloser = { name: "DER MANN MIT DEM WAGEN", known: "cache_clip_shop24", label: "Mann mit Einkaufswagen", speaker: "Der Mann mit dem Wagen" };
  Nagiwa.ledger.shop24 = { to: "24H-LADEN", what: { shown: "gezeigt", cut: "montiert", sold: "verkauft" }, chits: { sold: 60 } };

  // ---- the robot (S2): reset with the pocket deck, it finds its way home, and its dock is the way into the shop's net
  Cutaway.room.get("weg1").hotspots.robot.use = [{ if: "off_shop24", then: ["Er fährt im Kreis und piept. Das ist nicht mein Problem."],
    else: ["An seinem Bauch ist eine Wartungsbuchse.", { sfx: "type" }, "Ich steck das Taschen-Deck dran. Seine Karte ist kaputt, er weiß nicht mehr, wo er wohnt.",
      "Ich setz sie zurück.", { set: "code_cam26" }, { set: "link_cam26" }, { sfx: "link" }, "Er piept zweimal und fährt rüber in den 24h-Laden, an seine Ladestation.",
      "Und über die Station bin ich im Netz vom Laden. CAM 26, die Kamera über der Kasse."] }];
  Nagiwa.cams.cam26 = { id: "26", place: "24H-LADEN, FISCHERMANN STREET", owner: "PRIVAT", map: [176, 86], if: "link_cam26" };

  // ---- CAM 26 (S3): the shop under the feed's filter, and its archive of last night
  Nagiwa.cache.clip_shop24 = { kind: "clip", name: "CAM 26, 02:30", about: "Der 24h-Laden, letzte Nacht. Der Mann mit dem Wagen nimmt ein Sandwich und eine Dose. Draußen schläft das Schaf." };
  Nagiwa.clips.clip_shop24 = { cam: "cam26", hour: 2, from: 28, to: 33, moments: [[28, 30, "Leer"], [30, 31.5, "Der Mann"], [31.5, 33, "Leer"]],
    people: [["obdachloser", 30, 31.5]],
    // an empty stretch of the same night over him (kapitel0-design §2.4): a fake, as Nagi·wa's, only smaller; never needed
    montage: { moment: 1, if: ["!ledger_shop24", "!off_shop24"], then: ["Ich nehm anderthalb Minuten leeren Laden aus derselben Nacht und leg sie über ihn.",
      "Jetzt kommt um halb drei keiner. Die Uhr läuft durch, nichts springt.", { evi: "besorgt" }, { say: "evi", text: "Jetzt ist er weg. Aber er war doch da." },
      "Das ist eine Fälschung. Wie die von Nagi·wa, nur kleiner."] } };
  Nagiwa.camRoom("cam26", { background: undefined, color: Nagiwa.PHOSPHOR[0], post: [{ exposure: A26.exposure }, ...Nagiwa.FEED_POST],
    props: [{ id: "room", image: "shop24_bg", at: [0, 0], anchor: [0, 0], baseline: -1000 }, ...AS.props.filter((/** @type {any} */ p) => p.id !== "cam")],
    hotspots: {
      counter: { name: "Kasse", poly: AS.counterPoly, look: ["Die Kasse, und keiner dahinter.", "Draußen steht das Schaf. Von hier sieht man nur seinen Schatten auf dem Glas."] },
      fridges: { name: "Kühlschränke", poly: AS.fridgesPoly, look: "Die Kühlschränke. Was da nachts fehlt, sieht die Kamera." },
      rewind: { name: "Archiv", z: 5, if: ["!cache_clip_shop24", "!off_shop24"],
        use: [{ rewind: "02:30", date: "today" }, "Das Archiv vom Laden geht eine Nacht zurück. Halb drei.", "Draußen steht das Schaf und schläft.",
          "Der Mann mit dem Einkaufswagen kommt rein. Er nimmt ein Sandwich aus dem Kühlschrank und eine Dose.",
          "Auf dem Sandwich klebt ein Etikett. Morgen abgelaufen.", "Er schaut einmal in die Kamera. Dann geht er.", { cache: "clip_shop24" },
          "Er nimmt nur, was morgen sowieso im Müll landet. Die Kasse zählt es trotzdem.", { live: true }] },
    } });

  // ---- the clerk (S1, S4): what he tells, and what Juno does with the clip
  const TELLS = [SH("Kauf was, oder lass mich schlafen."), SH("Hier. Schlaf ist umsonst. Steht da drauf."), "Er drückt mir einen Flyer in die Hand.",
    "Ist der Laden da drüben deiner?", SH("Ich mach die Nacht. Und das hier. Zwei Jobs, und schlafen tu ich trotzdem."),
    SH("Jede Nacht fehlt was. Ein Sandwich, eine Dose. Die Kasse zieht's mir ab."), SH("Die Kamera hat alles gesehen. Aber die Kamera gehört der Kette, nicht mir.")];
  Cutaway.room.get("weg1").hotspots.sheep.use = [
    { if: "off_shop24", then: [SH("Kauf was, oder lass mich schlafen."), "Er schläft schon wieder."],
      else: [{ if: "ledger_shop24=shown", then: [SH("Die Kasse stimmt wieder. Danke, Glasserin."), "Und der Mann mit dem Wagen?", SH("Das macht jetzt die Kette. Ich hab's nicht gewollt.")],
        else: [{ if: "ledger_shop24=cut", then: [SH("Ich hab mir einen Wecker gestellt. Hilft nichts."), SH("Im Schlaf bin ich wohl ein Dieb.")],
          else: [{ if: "ledger_shop24=sold", then: [SH("Die Kette hat mir was geschickt. Ein Video, wie ich schlafe."), SH("Morgen steht hier ein anderer.")],
            else: [{ if: "cache_clip_shop24", then: [SH("Du schon wieder."), { dialog: "shop24_wahl" }],
              else: [...TELLS, { if: "!link_cam26", then: ["Die Kamera über der Kasse. Mal sehen, an welchem Netz die hängt."], else: ["Die hab ich schon. CAM 26."] }] }] }] }] }] }];
  Cutaway.room.get("weg1").hotspots.sheep2.use = [SH2("Flyer? Schlaf ist umsonst."), "Wo ist der andere?", SH2("Der hat im Dienst geschlafen. Sagt die Kette.")];
  Cutaway.dialog("shop24_wahl", { main: { choices: [
    { text: "„Ich weiß jetzt, wer dir die Sachen klaut.“", if: "!mont_clip_shop24", goto: "end", then: [
      "Ich zeig ihm den Clip. Den Mann mit dem Wagen, um halb drei, das Sandwich und die Dose.", SH("Der von gegenüber? Der nimmt doch nur, was eh weggeht."),
      SH("Ich muss das der Kette schicken. Sonst zahl ich weiter."), { ledger: "shop24", value: "shown" }, "Er tippt schon. Gegenüber schläft der Mann und weiß noch nichts."] },
    { text: "„Ich hab mir die Kamera angesehen. Da war keiner.“", if: "mont_clip_shop24", goto: "end", then: [
      "Ich zeig ihm die Schleife. Der Laden, leer, die ganze Nacht.", SH("Keiner? Aber es fehlt doch was."), SH("Dann bin ich's wohl selber. Im Schlaf."),
      { ledger: "shop24", value: "cut" }, "Er glaubt es. Das ist das Schlimmste daran."] },
    { text: "Nichts sagen.", silent: true, goto: "end", then: [SH("Dann lass mich schlafen.")] },
  ] } });
  // shown or sold, the chain clears the sidewalk overnight; sold, it sends another man in the costume
  for (const d of [6, 7]) (Nagiwa.nights[d].passes ??= []).push({ if: { or: ["ledger_shop24=shown", "ledger_shop24=sold"] }, then: [{ set: "shop24_gone" }] });

  // (Sable buys it for the chain, S4: in her dialog, game/auftrag_varga.js)

  // ---- in the shop: the camera, the dock, the bin (Okonkwo's tins after the robbery: only a look)
  Object.assign(Cutaway.room.get("shop24").hotspots, {
    cam: { name: "Kamera", poly: AS.camPoly, walkTo: AS.counter, face: "se", look: ["Eine Kamera über der Kasse. Die sieht alles, was hier fehlt.", "Die gehört der Kette, sagt das Schaf."] },
    dock: { name: "Ladestation", poly: AS.dockPoly, walkTo: AS.dock, face: "nw",
      look: [{ if: "link_cam26", then: ["Die Ladestation vom Putzroboter. Er war kurz da und ist schon wieder draußen."],
        else: ["Eine Ladestation, leer. Draußen fährt ein Putzroboter im Kreis. Der wohnt bestimmt hier."] }] },
    bin: { name: "Dosen", poly: AS.binPoly, walkTo: AS.bin, face: "nw",
      look: [{ if: "k1b=sold", then: ["Ein Korb voller Dosen, billig.", "Das sind Okonkwos Dosen. Da steht noch sein Preis drunter."],
        else: ["Ein Korb voller Dosen, billig. Was keiner wollte, kommt hier rein."] }] },
  });
})();

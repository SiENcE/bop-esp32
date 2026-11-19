// Nagiwa: Chapter 2's thread of Frau Haldane's son (kapitel2-design §6.2, story §9), on blocks. Najo writes to his mother every Sunday
// from the Fifth, where he works, and since the 14th of October he hasn't (Chapter 1 begins it: on Thursday she tells Juno). Sunday is
// the day of letters: from Sunday on she sits awake at her open door and asks Juno to look whether he is all right. Juno has no camera
// in the Fifth; Sable sells a look into the archive of his hostel (150 chits, or Kessler's ring as Shine). CAM 51 shows what happened:
// on the 14th at nine he reads her letter on his bunk and lies down with his patch; on Monday morning he doesn't get up, and at half
// past six two in white carry him out. Juno tells her the truth, or montages a morning of the 9th over it with today's time (the
// second fake she makes herself, with the 24-hour shop's; never needed), or says she found nothing. A thread of its own (off_haldane),
// checked alone with the others shut; it begins and ends in this chapter (nothing is kept).
//   haldane_ask        she asked Juno to look (where he lives: the hostel 5-Süd)
//   ledger_sable_cam51 paid | ring: what the archive's look cost (link_cam51, code_cam51 with it)
//   cache_clip_najo    the archive's morning in her CACHE; mont_clip_najo: another morning laid over it (game/deck.js, MONTIEREN)
//   haldane            truth | fake | nothing: what Juno told her (the Kassenbuch's line, ledger_haldane)
"use strict";

(function () {
  const A51 = Nagiwa.at.cam51, H = (/** @type {string} */ text) => ({ say: "haldane", text });
  Nagiwa.people.najo = { name: "NAJO", known: "cache_clip_najo" };   // (short: the timeline writes it before his bar)
  Nagiwa.ledger.haldane = { to: "FRAU HALDANE", what: { truth: "Najo, die Wahrheit", fake: "Najo, ein montierter Morgen", nothing: "nichts gefunden" } };
  Nagiwa.ledger.sable_cam51 = { to: "SABLE", what: { paid: "CAM 51, ein Blick ins Archiv", ring: "Kesslers Ring, für CAM 51" }, chits: { paid: -150 } };

  // ---- CAM 51 (H3): only its archive, never live (Sable sells a look into it, not the camera): it opens on its newest recording, last
  // night at three (his bunk stripped, the others asleep); PUFFER goes back a month, in three pictures (a view: only what is shown)
  Nagiwa.cams.cam51 = { id: "51", place: "WOHNHEIM 5-SÜD, SCHLAFSAAL C", owner: "NAGI·WA WOHNEN", map: [64, 86], if: "link_cam51" };
  Cutaway.state.view("cam51_at");
  const frame = (/** @type {string} */ id) => ({ id: `arch_${id}`, image: `cam51_${id}`, at: [0, 0], anchor: [0, 0], baseline: -999, if: `cam51_at=${id}` });
  Nagiwa.cache.clip_najo = { kind: "clip", name: "CAM 51, MO 06:28", about: "Wohnheim 5-Süd, 15. Oktober. Najo Haldane wacht nicht auf. Zwei in Weiß tragen ihn hinaus." };
  Nagiwa.clips.clip_najo = { cam: "cam51", hour: 6, from: 28, to: 33, moments: [[28, 30, "Er schläft"], [30, 33, "Zwei in Weiß"]], people: [["najo", 28, 33]],
    // another morning of his over the one he was carried out (kapitel2-design §6.2): a fake, as Nagi·wa's; never needed
    montage: { moment: 1, shows: "ZUR SCHICHT", keeps: true, if: ["!haldane", "!off_haldane"], then: [
      "Im Archiv ist ein Morgen vom neunten Oktober. Da steht er auf und geht zur Schicht.", "Den leg ich über halb sieben und setz die Zeit von heute drauf.",
      { evi: "besorgt" }, { say: "evi", text: "Jetzt geht er zur Arbeit. Aber er schläft doch." }, "Das ist eine Fälschung. Seine Mutter wird sie glauben."] } };
  Nagiwa.camRoom("cam51", { background: "cam51_bg", mic: { at: A51.mic, clear: 40, lost: 150 },
    archive: { flag: "cam51_at", newest: "03:00", stamps: { brief: "2091-10-14 21:02", morgen: "2091-10-15 06:00", traeger: "2091-10-15 06:31" } },
    props: [frame("brief"), frame("morgen"), frame("traeger")],
    hotspots: {
      bunk: { name: "Koje 12", poly: A51.bunkPoly, look: [{ if: "cache_clip_najo", then: ["Koje 12, oben. Da hat Najo geschlafen. Letzte Nacht lag da nur noch die Matratze."],
        else: ["Die neueste Aufnahme ist von letzter Nacht. Eine Koje ohne Decke, die Matratze abgezogen."] }] },
      rows: { name: "Kojen", poly: A51.rowsPoly, look: ["Kojen, eine neben der anderen, zwei übereinander.", "Hinter jedem Ohr leuchtet ein blasser Punkt. Alle hier nehmen Lull."] },
      rewind: { name: "Archiv", z: 5, if: ["!cache_clip_najo", "!off_haldane"], use: [
        "Das Archiv geht einen Monat zurück. Ich such Koje 12.",
        { set: "cam51_at", value: "brief" }, "Sonntag, der vierzehnte Oktober, neun Uhr abends.",
        "Er sitzt auf seiner Koje und liest einen Brief. Auf Papier. Das ist ihrer.", "Dann klebt er sich das Pflaster hinters Ohr und legt sich hin.",
        { set: "cam51_at", value: "morgen" }, "Montag, sechs Uhr. Das Licht geht an, alle stehen auf.", "Er nicht.",
        { set: "cam51_at", value: "traeger" }, "Halb sieben. Zwei in Weiß tragen ihn raus, ganz vorsichtig und freundlich.",
        "Ruhe-Erschöpfung. Seit vier Wochen.", { cache: "clip_najo" }, { unset: "cam51_at" },
        "Und sie wartet jeden Sonntag auf seinen Brief."] },
    } });

  // ---- Sable (H2): a look into the archive, for chits or a clip. Her dialog (game/auftrag_varga.js) shows four in Chapter 2 at most:
  // while Juno asks for the hostel, this option stands where "what else do you sell" stands
  const sable = /** @type {any} */ (Cutaway.dialog.get("sable")), other = sable.main.findIndex((/** @type {any} */ c) => c.text === "„Was verkaufst du sonst?“");
  sable.main[other].if = { or: ["!haldane_ask", "link_cam51", "off_haldane"] };
  sable.main.splice(other, 0, { text: "„Hast du was im Fünften? Das Wohnheim 5-Süd.“", if: ["haldane_ask", "!link_cam51", "!off_haldane"], goto: "cam51",
    then: [{ say: "sable", text: "5-Süd. Nagi·was Wohnheim, Schlafsaal C hat eine Kamera." }, { say: "sable", text: "Live nicht. Ins Archiv lass ich dich." },
      { say: "sable", text: "Hundertfünfzig. Oder einen Clip, roh. Was Echtes." }] });
  sable.cam51 = [
    { text: "„Hier sind hundertfünfzig.“", if: "chits>=150", goto: "end", then: [{ ledger: "sable_cam51", value: "paid" }, { set: "code_cam51" }, { set: "link_cam51" },
      { say: "sable", text: "Nett." }, "CAM 51 steht jetzt auf dem Deck. Nur das Archiv, einen Monat zurück."] },
    { text: "„Nimm Kesslers Ring.“", if: { or: [["cache_clip_kessler_ring", "!anon_clip_kessler_ring"], "cache_clip_kessler_cut"] }, goto: "end",
      then: [{ ledger: "sable_cam51", value: "ring" }, { set: "code_cam51" }, { set: "link_cam51" }, { say: "sable", text: "Den Ring will immer noch einer sehen. Nett." },
        "Jetzt zieht Kessler seinen Ring noch mal ab. Für jemand, den ich nicht kenne.", "CAM 51 steht auf dem Deck. Nur das Archiv."] },
    { text: "„Zu teuer.“", goto: "main", then: [{ say: "sable", text: "Das Archiv wartet." }] },
  ];

  // ---- at her door (H1, H4): from Sunday on she is awake and waits; she asks, and hears what Juno tells her
  const door = Cutaway.room.get("kessel_14").hotspots.haldane, talk = door.talk, look = door.look;
  const ASK = [
    { if: "day=6", then: [H("Juno. Heute ist Sonntag."), H("Sonntags schlaf ich nicht. Sonntags kommt sein Brief.")],
      else: [H("Juno. Ich hab nicht geschlafen."), H("Gestern war Sonntag, und es kam wieder kein Brief.")] },
    "Seit wann schreibt er nicht mehr?", H("Seit vier Sonntagen. Najo hat noch nie einen Sonntag vergessen."),
    H("Du kennst dich doch mit Kameras aus. Kannst du sehen, ob es ihm gut geht?"), H("Er wohnt im Wohnheim 5-Süd, im Fünften. Er hat da Arbeit."),
    { set: "haldane_ask" }, "Ich schau nach.", "Im Fünften hab ich keine Kamera. Aber Sable verkauft alles."];
  Cutaway.dialog("haldane_wahl", { main: { choices: [
    { text: "„Er schläft. Sie haben ihn auf eine Station gebracht.“", goto: "end", then: [{ set: "haldane", value: "truth" }, { ledger: "haldane", value: "truth" },
      H("Auf eine Station?"), "Am fünfzehnten Oktober ist er nicht mehr aufgewacht. Zwei in Weiß haben ihn geholt.", "Sie sagt lange nichts.",
      H("Dann schlaf ich auch. Dann bin ich näher bei ihm."), "Sie meint es genau so."] },
    { text: "„Hier. Das ist von heute früh.“", if: "mont_clip_najo", goto: "end", then: [{ set: "haldane", value: "fake" }, { ledger: "haldane", value: "fake" },
      "Ich zeig ihr den Clip. Sechs Uhr, Najo steht auf und geht zur Schicht.", H("Er sieht müde aus. Er sah immer müde aus."),
      H("Dann hat er bloß keine Zeit zum Schreiben."), "Ja. Bloß keine Zeit."] },
    { text: "„Ich hab nichts gefunden.“", goto: "end", then: [{ set: "haldane", value: "nothing" }, { ledger: "haldane", value: "nothing" },
      H("Nichts?"), H("Dann warte ich eben weiter.")] },
    { text: "„Noch nicht.“", silent: true, goto: "end", then: [H("Ich bleib wach. Bis du was weißt.")] },
  ] } });
  door.talk = [{ if: ["day>5", "!off_haldane"], then: [
    { if: "haldane=truth", then: ["Sie schläft in ihrem Sessel, mitten am Abend. Das Licht hinter ihrem Ohr blinkt wieder."],
      else: [{ if: "haldane=fake", then: [H("Er geht jeden Morgen zur Arbeit. Hast du ja gesehen."), H("Jetzt kann ich schlafen.")],
        else: [{ if: "haldane=nothing", then: [H("Ich warte noch. Vielleicht kommt nächsten Sonntag was.")],
          else: [{ if: "cache_clip_najo", then: [H("Hast du ihn gesehen?"), { dialog: "haldane_wahl" }],
            else: [{ if: "haldane_ask", then: [H("Hast du ihn gesehen?"), "Noch nicht. Ich schau noch.", H("Ich bleib wach. Bis du was weißt.")],
              else: ASK }] }] }] }] }],
    else: talk }];
  door.look = [{ if: ["day>5", "!off_haldane"], then: [
    { if: "haldane=truth", then: ["Sie schläft in ihrem Sessel. Ich hab ihr gesagt, wo er ist."],
      else: [{ if: "haldane=fake", then: ["Sie sitzt in ihrer Tür und lächelt. Sie glaubt, ihr Sohn geht zur Arbeit."],
        else: ["Frau Haldane sitzt wach in ihrer Tür und schaut zur Treppe.", "Das Pflaster hinter ihrem Ohr ist dunkel. Sie wartet auf seinen Brief."] }] }],
    else: look }];
})();

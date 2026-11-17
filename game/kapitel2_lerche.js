// Nagiwa: Chapter 2, Ines' flat (docs/kapitel2-design.md §3.3, W1–W7), on blocks. A break-in in street mode, guided by the feeds:
//   code_lerche   the house door's code, seen in CAM 24 when a neighbour comes home at half past seven (W1)
//   know_flat     which door is hers: the two from Civic Rest at 4B on Sunday at eight (CAM 25, W3), or the seal on it afterwards (W4)
//   evi_knows     Juno has found the file in the freezer, and EVI has learned what she is (W6, W7)
//   (cache_note_serviette, cache_note_civic_rest: what she takes with her)
// From Sunday 21:00 the flat is open (the Quiet broke the lock and sealed it): a time, no flag. The clinic (§3.2) is the other way to
// know_flat (game/kapitel2_klinik.js). [PLATZHALTER] the house door's code; the neighbour and the two in white
// are figures from other feeds; the rooms are blocks (§14)
"use strict";

(function () {
const A24 = Nagiwa.at.cam24, A25 = Nagiwa.at.cam25, AL = Nagiwa.at.lerche_flur, AJ = Nagiwa.at.jade_row, AW = Nagiwa.at.ines_wohnung;
const OPEN = { or: ["day=7", ["day=6", "time>=21:00"]] };          // after the Quiet has emptied 4B

// ---- CAM 24 at half past seven: a neighbour comes home and taps the code right beside the doorbell's lens (W1). Each evening a moment of
// its own (the first time the scene is written, after that it is played again); missed, the buffer has it
Cutaway.actor("nachbar", { name: "Nachbar", color: "#8acfae",
  costume: { idle: "commuter_b_feed", walk: "commuter_b_feed_walk", talk: "commuter_b_feed" }, speed: [14, 10],
  look: "Ein Nachbar mit Kapuze. Er kommt jeden Abend um dieselbe Zeit heim.", talk: "Er hört mich nicht. Er tippt nur." });
Cutaway.routine("nachbar", [
  { day: [5, 6, 7], from: "19:30", to: "19:45", room: "cam24", at: A24.street, path: [A24.street, A24.gate], once: true },
]);
// (off_main shuts the flat for the solver's run of the way to Lantern, as Chapter 1's threads shut the main thread)
Cutaway.moment("nachbar_sat", { room: "cam24", day: 5, from: "19:30", to: "19:45", if: ["!code_lerche", "!off_main"], play: [
  "Da kommt einer heim. Er bleibt an der Haustür stehen.",
  "Das Zahlenfeld ist direkt neben der Linse. Ich seh jede Taste.",
  "Vier, sieben, eins, neun.",
  { set: "code_lerche" },
  "Danke, Nachbar.",
] });
Cutaway.moment("nachbar_sun", { room: "cam24", day: 6, from: "19:30", to: "19:45", if: ["!code_lerche", "!off_main"], play: [{ replay: "nachbar_sat" }] });
Cutaway.moment("nachbar_mon", { room: "cam24", day: 7, from: "19:30", to: "19:45", if: ["!code_lerche", "!off_main"], play: [{ replay: "nachbar_sat" }] });
const cam24 = Cutaway.room.get("cam24");
cam24.hotspots.rewind = { name: "Puffer", rect: Nagiwa.osd.rewind, z: 5,
  if: [{ or: [["day=5", "moment:nachbar_sat"], ["day=6", "moment:nachbar_sun"], ["day=7", "moment:nachbar_mon"]] }, "!code_lerche", "!off_main"],
  use: ["Ich spul den Puffer zurück auf halb acht.", { replay: "nachbar_sat" }] };

// ---- the gate at the end of Jade Row leads west now, into the clinic's quarter (W2): to the clinic (game/kapitel2_klinik.js) or to Lerche.
// (off_klinik shuts the clinic for the solver's run with the stick: an early know_flat there doubled its states past what a run can hold;
// the main run checks it)
const gate = Cutaway.room.get("jade_row").hotspots.gate;
gate.use = [{ if: "day>4", then: [{ dialog: "k2_tor" }], else: ["Dahinter ist nur noch mehr Neunter. Da will ich heute nicht hin."] }];
Cutaway.dialog("k2_tor", { main: { choices: [
  { text: "„Zur Klinik.“", silent: true, if: ["!off_main", "!off_klinik"], goto: "end", then: [{ goto: "klinik", at: Nagiwa.at.klinik.arrive, face: "se" }] },
  { text: "„Zum Wohnblock Lerche.“", silent: true, if: "!off_main", goto: "end", then: [
    { if: "!code_lerche", then: ["Die Haustür hat ein Zahlenfeld. Den Code hab ich nicht."],
      else: [{ if: ["day=6", "time>=20:00", "time<21:00"], then: ["Da oben sind Stimmen. Ich warte."],
        else: [{ goto: "lerche_flur", at: AL.arrive, face: "sw" }] }] }] },
  { text: "„Zurück.“", silent: true, goto: "end", then: [] },
] } });
// back down the stairs and out at the gate
Cutaway.room.get("lerche_flur").hotspots.stairs.use = [{ goto: "jade_row", at: AJ.far, face: "sw" }];

// ---- 4B (W4): which door, and when it opens
Cutaway.room.get("lerche_flur").hotspots.door_4b.use = [{ if: OPEN,
  then: [{ if: "!know_flat", then: ["An der Tür klebt ein Siegel: CIVIC REST, SEALED.", "Das war heute. Das ist ihre.", { set: "know_flat" }] },
    { if: "!visited:ines_wohnung", then: ["Unter dem Siegel ist das Schloss aufgebrochen.", "Ich reiß es ab."] },
    { goto: "ines_wohnung", at: AW.arrive, face: "se" }],
  else: [{ if: "know_flat", then: ["Abgeschlossen. Ich bin keine Einbrecherin. Jedenfalls nicht so eine."],
    else: ["Hier wohnen zwölf Leute, und an keiner Tür steht Calder."] }] }];

// ---- CAM 25: the landing from its corner, linked with CAM 24 (the same house). On Sunday at eight two in white raincoats open 4B and carry it
// out, the computer too, until nine; then they seal it (W3)
Nagiwa.cams.cam25 = { id: "25", place: "WOHNBLOCK LERCHE, 4. STOCK", owner: "PRIVAT", map: [176, 38], if: "day>4" };
for (const id of ["quiet_a", "quiet_b"]) {
  Cutaway.actor(id, { name: "In Weiß", color: "#f0f0f0", speed: [6, 3],
    costume: { idle: "ashe_feed", walk: "ashe_feed_walk", talk: "ashe_feed" },
    look: ["Ein weißer Regenmantel. Wo das Gesicht sein müsste, brennt mir das Bild durch.", "Wie bei dem in der Metro."],
    talk: ["Die Markierung rutscht ab. Da ist nichts, woran sie hängen bleibt."] });
}
Cutaway.routine("quiet_a", [{ day: 6, from: "20:00", to: "21:00", room: "cam25", at: A25.door_4b, face: "ne" }]);
Cutaway.routine("quiet_b", [{ day: 6, from: "20:00", to: "21:00", room: "cam25", at: A25.door_4b2, face: "ne" }]);
Cutaway.moment("quiet_flat", { room: "cam25", day: 6, from: "20:00", to: "21:00", if: "!off_main", play: [
  "Zwei in weißen Regenmänteln, auf ihrem Flur.",
  "Wie der in der Metro.",
  "Sie gehen zu 4B. Einen Schlüssel brauchen sie nicht.",
  { set: "know_flat" },
  "Das ist ihre Wohnung.",
  "Sie tragen Kisten raus. Den Rechner auch.",
  "Um neun kleben sie was über die Tür. Dann sind sie weg.",
] });
const LR = Nagiwa.at.lerche_flur;
Nagiwa.camRoom("cam25", { background: undefined, color: Nagiwa.PHOSPHOR[0], mic: { at: A25.mic, clear: 40, lost: 150 },
  post: [{ exposure: A25.exposure }, ...Nagiwa.FEED_POST],
  props: [
    { id: "room", image: "lerche_flur_bg", at: [A25.shift, 0], anchor: [0, 0], baseline: -1000 },
    ...LR.props.filter((/** @type {any} */ p) => p.id !== "cam"),
  ],
  hotspots: {
    door_4b: { name: "4B", poly: A25.doorPoly, look: [{ if: OPEN, then: ["Über 4B klebt ein Siegel. Von hier oben ist es nur ein heller Streifen."], else: ["Das ist ihre Tür, 4B. Oder eine von denen."] }] },
  } });

// ---- in 4B (W5, W6, W7): the napkin under the magnet, the file in the freezer, and what EVI learns from it
Nagiwa.cache.note_serviette = { kind: "note", name: "SERVIETTE, PHO PUMP", about: "In Ines' Schrift: 6.11. 22:35 – 41. Darunter weitere Daten mit Zahlen." };
Nagiwa.cache.note_civic_rest = { kind: "note", name: "AKTE CIVIC REST", about: "AUTO-EVAL eingestellt, 2087-10. Ersatz: Programm Civic Rest. Trainingsdaten: Beobachterin 0412, J. REYES." };
const SERVIETTE = [
  "Unter dem Magneten hängt eine Serviette von Pho Pump.",
  "Das ist die, auf die sie am Mittwoch geschrieben hat. Mit der Hand drüber.",
  "Da steht: 6.11., 22:35, und dann 41. Darunter noch mehr Daten mit Zahlen.",
  "Der sechste, halb elf. Da war ich bei Yuen's.",
  "Was die Zahl heißt, weiß ich nicht.",
  { cache: "note_serviette" },
];
// EVI learns what she is (story §7): the scene as the design has it, in whole sentences; she says du, she is someone (dialog-design §2)
const AKTE = [
  "Im Gefrierfach liegt ein Gefrierbeutel. Da ist Papier drin.",
  "Kalt hält Papier. Und die suchen Rechner, keine Akten.",
  "Das ist eine Akte aus Civic Rest. Da steht: AUTO-EVAL eingestellt, 2087-10. Ersatz: Programm Civic Rest.",
  "Darunter die Trainingsdaten: Beobachterin 0412, J. REYES.",
  "Ich fotografier das mit dem Taschen-Deck.",
  { cache: "note_civic_rest" },
  { evi: "verwirrt" },
  { say: "evi", text: "Da steht AUTO-EVAL. Das bin ich, oder?" },
  "Ja. Das bist du.",
  { say: "evi", text: "Und da steht dein Name. Bei den Trainingsdaten." },
  "Ich hab sie dir beigebracht. Alle Klammern. Jahrelang.",
  { evi: "besorgt" },
  { say: "evi", text: "Dann hab ich dich nicht ersetzt." },
  { say: "evi", text: "Ich hab nie jemanden ersetzt." },
  "Nein.",
  { say: "evi", text: "Wer dann?" },
  { set: "evi_knows" },
];
const fridge = Cutaway.room.get("ines_wohnung").hotspots.fridge;
fridge.use = [{ dialog: "k2_kuehlschrank" }];
Cutaway.dialog("k2_kuehlschrank", { main: { choices: [
  { text: "Die Serviette ansehen.", silent: true, if: "!cache_note_serviette", goto: "end", then: SERVIETTE },
  { text: "Das Gefrierfach aufmachen.", silent: true, if: "!evi_knows", goto: "end", then: AKTE },
  { text: "Nichts.", silent: true, goto: "end", then: [{ if: ["cache_note_serviette", "evi_knows"], then: ["Mehr hat sie hier nicht für mich gelassen."] }] },
] } });
})();

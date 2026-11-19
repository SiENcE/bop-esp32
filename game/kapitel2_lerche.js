// Nagiwa: Chapter 2, Ines' flat (docs/kapitel2-design.md §3.3, W1–W7), on blocks. A break-in in street mode, guided by the feeds:
//   code_lerche   the house door's code, seen in CAM 24 when a neighbour comes home at half past seven (W1)
//   know_flat     which door is hers: Civic Rest's notice on 4B from Saturday (at the door, or zoomed in CAM 25), the two from Civic Rest at
//                 4B on Sunday at eight (CAM 25, W3), or the seal on it afterwards (W4)
//   evi_knows     Juno has found the file in the freezer, and EVI has learned what she is (W6, W7)
//   (cache_note_serviette, cache_note_civic_rest: what she takes with her)
// From Sunday 21:00 the flat is open (the Quiet broke the lock and sealed it): a time, no flag. The clinic (§3.2) says the house and the
// floor (game/kapitel2_klinik.js), the notice on 4B the door and the time. [PLATZHALTER] the house door's code. The neighbour is his own
// feed figure, the two in white the Quiet's painted man B carrying her things (2026-11-19)
"use strict";

(function () {
const A24 = Nagiwa.at.cam24, A25 = Nagiwa.at.cam25, AL = Nagiwa.at.lerche_flur, AJ = Nagiwa.at.jade_row, AW = Nagiwa.at.ines_wohnung;
const OPEN = { or: ["day=7", ["day=6", "time>=21:00"]] };          // after the Quiet has emptied 4B

// ---- CAM 24 at half past seven: a neighbour comes home and taps the code right beside the doorbell's lens (W1). Each evening a moment of
// its own (the first time the scene is written, after that it is played again); missed, the buffer has it
Cutaway.actor("nachbar", { name: "Nachbar", color: "#8acfae",
  costume: { idle: "nachbar_feed", walk: "nachbar_feed_walk", talk: "nachbar_feed" }, speed: [14, 10],
  look: "Ein älterer Nachbar mit Mütze und einer Tüte vom 24h-Laden. Er kommt jeden Abend um dieselbe Zeit heim.", talk: "Er hört mich nicht. Er tippt nur." });
Cutaway.routine("nachbar", [
  { day: [5, 6, 7], from: "19:30", to: "19:45", room: "cam24", at: A24.street, path: [A24.street, A24.gate], once: true },
]);
// (off_main shuts the flat for the solver's run of the way to Lantern, as Chapter 1's threads shut the main thread; off_flat shuts the flat
// alone, for the run with the stick, which takes it as done: the stick doesn't touch it)
Cutaway.moment("nachbar_sat", { room: "cam24", day: 5, from: "19:30", to: "19:45", if: ["!code_lerche", "!off_main", "!off_flat"], play: [
  "Da kommt einer heim. Er bleibt an der Haustür stehen.",
  "Das Zahlenfeld ist direkt neben der Linse. Ich seh jede Taste.",
  "Vier, sieben, eins, neun.",
  { set: "code_lerche" },
  "Danke, Nachbar.",
] });
Cutaway.moment("nachbar_sun", { room: "cam24", day: 6, from: "19:30", to: "19:45", if: ["!code_lerche", "!off_main", "!off_flat"], play: [{ replay: "nachbar_sat" }] });
Cutaway.moment("nachbar_mon", { room: "cam24", day: 7, from: "19:30", to: "19:45", if: ["!code_lerche", "!off_main", "!off_flat"], play: [{ replay: "nachbar_sat" }] });
const cam24 = Cutaway.room.get("cam24");
cam24.hotspots.rewind = { name: "Puffer", rect: Nagiwa.osd.rewind, z: 5,
  if: [{ or: [["day=5", "moment:nachbar_sat"], ["day=6", "moment:nachbar_sun"], ["day=7", "moment:nachbar_mon"]] }, "!code_lerche", "!off_main", "!off_flat"],
  // the buffer rewound to half past seven (game/puffer.js): he comes home again and taps the code
  use: [{ rewind: "19:30" }, { walk: "nachbar", to: A24.gate, free: true }, { replay: "nachbar_sat" }, { live: true }] };

// ---- the way there, as the user drew it in the city plan (2026-11-18): the gate at the end of Jade Row opens onto Weg_1 (the room weg1,
// seen from above), and there the Wohnblock Lerche's door has the keypad (W1's code); inside, the hall (lerche_eg) with the stairs and the
// lift up to the 4th floor's landing (lerche_flur). The clinic lies elsewhere: off the alley's walkway (game/kapitel2_klinik.js).
// (off_main and off_flat shut the house for the solver's runs that take the flat as done)
const AE = Nagiwa.at.lerche_eg, AG1 = Nagiwa.at.weg1;
const gate = Cutaway.room.get("jade_row").hotspots.gate;
gate.use = [{ if: "day>4", then: [{ goto: "weg1", at: AG1.gate, face: "up" }], else: ["Dahinter ist nur noch mehr Neunter. Da will ich heute nicht hin."] }];
Cutaway.room.get("weg1").hotspots.lerche.use = [{ if: ["!off_main", "!off_flat"],
  then: [{ if: "!code_lerche", then: ["Die Haustür hat ein Zahlenfeld. Den Code hab ich nicht."],
    else: [{ sfx: "type" }, "Vier, sieben, eins, neun.", { sfx: "door_open" }, { goto: "lerche_eg", at: AE.arrive, face: "nw" }] }],
  else: ["Da will ich heute nicht rein."] }];
const hall = Cutaway.room.get("lerche_eg").hotspots, landing = Cutaway.room.get("lerche_flur").hotspots;
hall.door = { name: "Haustür", poly: AE.doorPoly, walkTo: AE.door, face: "se", look: "Draußen ist die Fischermann Street. Das Neon kommt durch die Tür.",
  use: [{ sfx: "door_shut" }, { goto: "weg1", at: AG1.lerche, face: "down" }] };
// up and down: four floors by the stairs (steps and the floors counting by) or by the lift (it runs, unlike the Kessel's); on Sunday from
// eight to nine there are voices upstairs, and Juno waits
const VOICES = ["day=6", "time>=20:00", "time<21:00"];
const floorBy = (/** @type {string} */ sfx, /** @type {number} */ n, /** @type {number} */ ms) => [{ sfx }, { caption: String(n), at: "c", ms }];
const UP = (/** @type {string} */ sfx, /** @type {string} */ to) => [{ if: VOICES, then: ["Da oben sind Stimmen. Ich warte."],
  else: [{ fade: "out", ms: 300 }, ...floorBy(sfx, 1, 300), ...floorBy(sfx, 2, 300), ...floorBy(sfx, 3, 300), ...floorBy(sfx, 4, 500),
    { goto: "lerche_flur", at: Nagiwa.at.lerche_flur[to], face: to === "lift" ? "se" : "sw" }, { fade: "in", ms: 300 }] }];
const DOWN = (/** @type {string} */ sfx, /** @type {string} */ to) => [{ fade: "out", ms: 300 }, ...floorBy(sfx, 3, 260), ...floorBy(sfx, 2, 260), ...floorBy(sfx, 1, 260),
  { goto: "lerche_eg", at: AE[to], face: to === "lift" ? "sw" : "sw" }, { fade: "in", ms: 300 }];
hall.stairs.use = UP("steps_metal", "arrive");
hall.lift.use = [{ sfx: "motor" }, ...UP("motor", "lift")];
landing.stairs.use = DOWN("steps_metal", "stairs");
landing.lift.use = [{ sfx: "motor" }, ...DOWN("motor", "lift")];
// the seal across 4B once they have gone (the landing baked again with it, art/rooms/lerche_flur.px.js: only what differs, laid over it)
const SEAL = { id: "seal", image: "lerche_flur_seal", at: Nagiwa.layouts.lerche_flur.sealAt, anchor: [0, 0], baseline: 0.5, if: OPEN };
Cutaway.room.get("lerche_flur").props.push(SEAL);

// ---- 4B (W4): which door, and when it opens. From Saturday until they come, Civic Rest's notice is taped on it (the user, 2026-11-19: Marit
// in the clinic says the house and the floor, the notice the door and the time; EVI keeps the time): read at the door, or through CAM 25
const NOTICE_TIME = ["day>4", { not: OPEN }];
const NOTICE = { id: "notice", image: "lerche_flur_notice", at: Nagiwa.layouts.lerche_flur.noticeAt, anchor: [0, 0], baseline: 0.5, if: NOTICE_TIME };
Cutaway.room.get("lerche_flur").props.push(NOTICE);
const NOTICE_READ = [
  "Räumung, Wohnung 4B. Sonntag, acht Uhr. Zutritt verboten.",
  "Civic Rest räumt die Wohnungen der Toten. Das ist ihre.",
  { set: "know_flat" },
  { evi: "besorgt" },
  { say: "evi", text: "Sonntag, zwanzig Uhr. Das merk ich mir." },
];
Cutaway.room.get("lerche_flur").hotspots.door_4b.use = [{ if: OPEN,
  then: [{ if: "!know_flat", then: ["An der Tür klebt ein Siegel: CIVIC REST, SEALED.", "Das war heute. Das ist ihre.", { set: "know_flat" }] },
    { if: "!visited:ines_wohnung", then: ["Unter dem Siegel ist das Schloss aufgebrochen.", "Ich reiß es ab."] },
    { goto: "ines_wohnung", at: AW.arrive, face: "se" }],
  else: [{ if: "!know_flat", then: ["An der Tür klebt ein Zettel von Civic Rest.", ...NOTICE_READ] },
    "Abgeschlossen. Ich bin keine Einbrecherin. Jedenfalls nicht so eine."] }];

// ---- CAM 25: the landing from its corner, linked with CAM 24 (the same house). On Sunday at eight two in white raincoats open 4B and carry it
// out, the computer too, until nine; then they seal it (W3)
Nagiwa.cams.cam25 = { id: "25", place: "WOHNBLOCK LERCHE, 4. STOCK", owner: "PRIVAT", map: [176, 38], if: "day>4" };
// (the Quiet's man B, painted, carrying her things out: a box, her computer; the user's choice, 2026-11-19)
for (const [id, front] of [["quiet_a", "quiet_b_box_se"], ["quiet_b", "quiet_b_tower_se"]]) {
  Cutaway.actor(id, { name: "In Weiß", color: "#f0f0f0", speed: [6, 3], lit: false,
    costume: { idle: { se: front, ne: "quiet_b_box_ne" } },
    look: ["Ein weißer Regenmantel. Wo das Gesicht sein müsste, brennt mir das Bild durch.", "Wie bei dem in der Metro."],
    talk: ["Die Markierung rutscht ab. Da ist nichts, woran sie hängen bleibt."] });
}
Cutaway.routine("quiet_a", [{ day: 6, from: "20:00", to: "21:00", room: "cam25", at: A25.door_4b, face: "ne" }]);
Cutaway.routine("quiet_b", [{ day: 6, from: "20:00", to: "21:00", room: "cam25", at: A25.door_4b2, face: "sw" }]);
Cutaway.moment("quiet_flat", { room: "cam25", day: 6, from: "20:00", to: "21:00", if: ["!off_main", "!off_flat"], play: [
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
    { ...SEAL, at: [SEAL.at[0] + A25.shift, SEAL.at[1]] },
    { ...NOTICE, at: [NOTICE.at[0] + A25.shift, NOTICE.at[1]] },
  ],
  hotspots: {
    door_4b: { name: "4B", poly: A25.doorPoly,
      look: [{ if: OPEN, then: ["Über 4B klebt ein Siegel. Von hier oben ist es nur ein heller Streifen."],
        else: [{ if: "day>4", then: ["Der vierte Stock. An 4B klebt ein Zettel."], else: ["Der vierte Stock. Welche Tür ihre ist, sehe ich von hier nicht."] }] }],
      // the zoom onto the notice (art/ui/zooms.px.js): what it says, and the door is hers
      use: [{ if: NOTICE_TIME, then: [{ zoom: "zoom_raeumung" }, "Ein Zettel von Civic Rest.", ...NOTICE_READ, { zoom: false }],
        else: [{ if: OPEN, then: ["Das Siegel. Da waren sie schon."], else: ["Von hier sehe ich nur die Tür."] }] }] },
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

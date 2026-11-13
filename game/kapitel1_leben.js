// Nagiwa: the life around Chapter 1's jobs (docs/kapitel1-design.md §7): Teo's visit on Wednesday at 18:30, Motte's lessons, Bao, the stuttering ad screen.
// Teo comes by on Wednesday evening with soup from Bao. The visit can't be missed: at 18:30 there is a knock wherever Juno is waiting,
// she opens the door, Teo comes in, they talk, he goes, the door shuts, and afterwards she is back where she was. A scene without choices,
// so it costs the solver nothing but its moment;
// what Juno learns there (Teo is on Lull) other talks read from `moment:teo_visit`.
"use strict";

(function () {
const AF = Nagiwa.at.flat;
const T = (/** @type {string} */ text) => ({ say: "teo", text });
/** his costume; with "_bowl" Bao's broth in his hands, seen from the front (the bowl only shows in SE) @param {string} bowl */
const TEO = (bowl) => Object.fromEntries(["idle", "walk", "talk"].map((k) => [k, { se: `teo${bowl}_${k}_se`, ne: `teo_${k}_ne`, nw: `teo_${k}_nw` }]));
// he carries the broth in until he hands it over: only a look, so a view flag (no state for the solver)
Cutaway.state.view("teo_bowl");

Cutaway.actor("teo", { name: "Teo", color: "#ffa040",
  // drawn SE, NE and NW (art/characters/teo.px.js): the Lull patch is behind his left ear, so NW is drawn, not the mirror of NE
  costume: TEO(""), poses: [{ if: "teo_bowl", ...TEO("_bowl") }], voice: { pitch: 52, range: 5, wave: "triangle", syllable: 70, speed: 1.15 },
  look: ["Teo trägt die orange Weste und den Gehörschutz um den Hals.", "Am Hals leuchten seine Kiemen, wie bei allen aus der Pumpenhalle.", "Hinter seinem Ohr klebt das Lull-Pflaster, und es blinkt."],
  talk: [T("Iss, Ju.")] });

// never watched: it happens as its window ends, wherever Juno is (the window begins with the evening, so 18:30 is the only new stop of
// the clock). The knock, Juno to her door, the door open (a prop shown for the scene), Teo in from the hallway, the talk, Teo out, the
// door shut, and back where she was ({ remember_place } and { return_place }: a camera, or the deck with its window open).
// Plain steps, so the editor's Schedule tab opens the scene as blocks and writes it back here.
Cutaway.moment("teo_visit", { room: "deck", day: 2, from: "18:00", to: "18:30", if: "~never", unseen: [
  { remember_place: true },
  "Es klopft. Um die Zeit klopft nur einer.",
  { goto: "flat", at: AF.deck, face: "ne" },
  { sfx: "knock" },
  { say: "teo", text: "Ju! Mach auf, die Brühe wird kalt." },
  { walk: AF.doorSide },
  { face: "nw" },
  { open: "flat/door_gap" },
  { open: "flat/door_leaf", sfx: "door_open", ms: 400 },
  { set: "teo_bowl" },
  { place: "teo", room: "flat", at: AF.doorway, face: "se" },
  { walk: "teo", to: AF.visitTeo, free: true, wait: false },
  { walk: "juno", to: AF.visitJuno },
  { face: "nw" },
  { face: "teo", to: "se" },
  { say: "teo", text: "Von Bao. Er sagt, du hast seit Dienstag nichts gegessen. Er zählt mit." },
  { unset: "teo_bowl" },
  "Er zählt falsch.",
  { say: "teo", text: "Er zählt nie falsch. Nur zu deinen Gunsten." },
  "Hinter seinem Ohr klebt ein blasses Pflaster, und es blinkt.",
  "Seit wann?",
  { say: "teo", text: "Seit es gratis ist." },
  { say: "teo", text: "Vier Stunden Lull, und ich bin wie neu." },
  "Du hast Doppelschichten.",
  { say: "teo", text: "Deswegen ja. Vier Stunden, Ju. Fühlt sich an wie zehn." },
  { say: "teo", text: "Und du? Immer noch die Kameras?" },
  "Immer noch.",
  { say: "teo", text: "Du redest noch immer, als hätten sie dich gefeuert, weil du schlecht warst." },
  "...",
  { say: "teo", text: "Iss. Ich muss los, meine Schicht fängt um acht an." },
  { say: "teo", text: "Schlaf du auch mal, Ju." },
  { walk: "teo", to: AF.doorway, free: true },
  { place: "teo", room: null },
  { close: "flat/door_leaf", sfx: "door_shut" },
  { close: "flat/door_gap" },
  "Er ist weg. Die Brühe ist noch warm.",
  { evi: "froh" },
  { say: "evi", text: "Sein Licht hinterm Ohr blinkt. Ist das schön?" },
  "Weiß ich nicht.",
  { return_place: true },
] });

// ---- Motte's lessons (if Juno was kind to him in the prologue): one an evening, three in all. After the second he builds her a tap out of
// his old handheld (a second way to job B's machine, the same item as Ratz's); after the third he is her student, which Chapter 3 asks.
//   moth_lesson   0 to 3     moth_today   a lesson this evening (forgotten overnight)     moth_student   all three
// A thread of its own (off_motte); what it shares with job B is the tap (got_tap), which only saves job B a purchase.
const M = (/** @type {string} */ text) => ({ say: "motte", text });
const LESSON = [
  [M("Das ist ein Auge an der Wand."), "Ein Auge, das nichts vergisst. Was es sieht, liegt irgendwo. Im Puffer, im Archiv. Für immer.", M("Ich auch?"), "Du auch. Mit Mütze.", M("Gut.")],
  ["Die meisten stehen drauf. Auf dem Gehäuse, auf der Speisekarte, auf einem Zettel. Leute sind faul.", M("Und wenn nicht?"), "Dann zapft man sie mit einem Abzweiger an.",
    { if: ["!got_tap", "!off_tide"], then: [M("So einen?"), "Er schraubt zwei Kabel aus seinem Tideboy und eine Klemme vom Geländer.", M("Der Akku war eh hin."), { give: "abzweiger" }, { set: "got_tap" }, "Der ist besser als der von Ratz. Sag's ihm nicht."],
      else: [M("Bau ich dir mal einen. Aus dem Tideboy.")] }],
  [M("Warum glasst du nie unser Haus?"), "Weil man dann weiß, was die Nachbarn nachts machen.", "Und das kriegt man nicht mehr weg.", M("Ich weiß schon, was Frau Haldane nachts macht."), "Siehst du.", { set: "moth_student" }, M("Jetzt bin ich Glasser."), "Jetzt weißt du Bescheid. Das ist schlimmer."],
];
const QUESTION = ["„Was ist eine Kamera?“", "„Wie findet man einen Code?“", "„Warum glasst man den eigenen Block nicht?“"];
// (the lessons are told apart by numbers: a plain = compares text)
Cutaway.dialog("motte_lektion", { main: {
  enter: [M("Zeigst du mir heute was?")],
  choices: [
    ...[0, 1, 2].map((n) => ({ text: QUESTION[n], if: [`moth_lesson>=${n}`, `moth_lesson<${n + 1}`], goto: "end", then: [...(n ? [] : ["Ich zeig dir eine Sache pro Abend. Heute: Was ist eine Kamera?"]), ...LESSON[n], { set: "moth_lesson", value: n + 1 }, { set: "moth_today" }] })),
    { text: "„Heute nicht.“", goto: "end", then: [M("Morgen dann.")] },
  ] } });
for (const night of [3, 4]) (Nagiwa.nights[night].passes ??= []).push({ unset: "moth_today" });

// ---- NETZ in Chapter 1 (kapitel1-design §7): every evening a new page; EVI reads the headline to Juno once an evening and gets it
// wrong (she reads data well and people badly); on the Glasser board on Thursday the post "Mein Vater wacht nicht auf", on Friday its end.
// Which evening EVI has read is a view (netz_read: the day), so it costs the solver nothing.
Cutaway.state.view("netz_read");
const L_KOW = "L., Kowalski-Straße";
Nagiwa.netz.push(
  { kind: "sub", slot: 1, page: "huelle", if: "day=2", text: "Hüllenabgabe ab Dezember angepasst. Nagi·wa dankt für Ihr Verständnis." },
  { kind: "board", slot: 2, page: "abzweiger", if: "day=2", text: "Suche Abzweiger, zahle bar. Bitte nicht Ratz.", by: "anonym" },
  { kind: "head", slot: 0, page: "ruhe", if: "day=3", text: "Ruhe-Erschöpfung: kein Grund zur Sorge, sagen Nagi·was Ärzte." },
  { kind: "sub", slot: 1, page: "lull", if: "day=3", text: "Die Lull-Kliniken im Neunten haben jetzt auch nachts offen." },
  { kind: "board", slot: 2, page: "vater", if: "day=3", text: "Wer weiß was über Ruhe-Erschöpfung? Mein Vater wacht nicht auf.", by: L_KOW },
  { kind: "head", slot: 0, if: "day=4", text: "Das Wetter für den Neunten: Tropfen aus dem Vierten. Später trocken." },
  { kind: "sub", slot: 1, if: "day=4", text: "Nagi·wa wünscht dem Neunten eine ruhige Nacht." },
  { kind: "board", slot: 2, page: "vater", if: "day=4", text: "Mein Vater ist weg. Zwei in Weiß haben ihn abgeholt. Sie waren sehr freundlich.", by: L_KOW });
const READ = (/** @type {number} */ day, /** @type {any[]} */ said) => ({ if: [`day=${day}`, `netz_read<${day}`], then: [{ set: "netz_read", value: day }, ...said] });
(Nagiwa.appOpen.netz ??= []).push(
  READ(2, [{ evi: "neugierig" }, { say: "evi", text: "Kriminalität auf Rekordtief. Heißt das, die Verbrecher schlafen?" }, "Die meisten."]),
  READ(3, [{ evi: "froh" }, { say: "evi", text: "Kein Grund zur Sorge! Dann sorgt sich jetzt keiner mehr?" }, "Das ist der Plan."]),
  READ(4, [{ evi: "froh" }, { say: "evi", text: "Später trocken! Ich hab nachgesehen: Das gab es hier noch nie." }, "Ich weiß."]));

// ---- Bao in Chapter 1 (kapitel1-design §7, dialog-style-guide §8): he remembers Tuesday, he sees that something is on Juno's mind,
// and on Friday he says less. Read from the day and from how she paid on Tuesday (bao_paid, kept from the prologue); nothing new is set.
const B = (/** @type {string} */ text) => ({ say: "bao", text });
const street = Cutaway.room.get("kowalski").hotspots;
const BAO = [
  { if: "day=2", then: [{ if: "bao_paid", then: [B("Juno! Bar, am Dienstag. Mein Alter glaubt es immer noch nicht.")], else: [B("Juno! Steht noch an, von Dienstag. Eilt nicht.")] },
    B("Wie immer?"), "Wie immer.", "Sie ist heiß und salzig.", B("Du guckst, als hättest du was gesehen."), "Ich guck immer so.", B("Eben.")] },
  { if: "day=3", then: [B("Lou fragt, ob du krank bist. Du isst so schnell."), "Ich hab zu tun.", B("Zu tun hat man. Essen muss man.")] },
  { if: "day=4", then: [B("Brühe."), "Danke.", "...", B("Heute ist es still. Iss langsam.")] },
];
for (const id of ["bao", "cart"]) {
  const h = street[id], verb = id === "bao" ? "talk" : "use", before = h[verb];
  h[verb] = [{ if: "day>1", then: BAO, else: before }];
}
// the ad screen stutters as Juno passes (the repair man noticed it too): on Thursday a second of CAM 03, Kessler under the awning,
// two nights old; on Friday only the eye, and Juno can't say whether it was on the screen or in her own eye. A look: it costs nothing.
const adLook = street.ad.look;
street.ad.look = [{ if: "day=3", then: ["NAGI·WA. SLEEP BETTER.", "Eben hat er gestottert, und eine Sekunde lang war da CAM 03 mit Kessler unterm Vordach.", "Das Bild war von Dienstag. Das war mein Bild."] },
  { if: "day=4", then: ["Er stottert. Und eine Sekunde lang ist da nur das Auge.", "Auf dem Schirm? Oder bei mir?"] },
  { if: "day<3", then: adLook }];
})();

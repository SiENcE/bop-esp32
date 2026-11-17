// Nagiwa: Chapter 2, Lull-Klinik 9-Ost (docs/kapitel2-design.md §3.2, K1–K3). Never needed: a second way to know_flat, and who Ines was.
//   K1  CAM 21 from Saturday: at seven Ines no longer comes out; Marit comes to her night shift instead and looks back twice (a routine:
//       no state, between 19:00 and 19:30, where waiting stops anyway)
//   K2  the clinic from the inside (the room klinik, through the gate at the end of Jade Row): the intake from seven; Juno gives a false
//       name, Marit offers Lull and wants to look behind her ear, Juno pulls her hood up. No scan, no item, nothing of Chapter 3
//   K3  Juno asks about Dr. Calder: the protocols nobody ordered, her locker emptied, and the flat, by the day → know_flat
// Marit sits behind the glass as a prop (game/rooms/klinik.js); her voice is an actor without a figure, its lines over her head. Her card:
// dialog-style-guide §6 (the routine one: the form's sentences in Sie, and when it is about Ines the form breaks and she says du).
"use strict";

(function () {
const AK = Nagiwa.at.klinik, A21 = Nagiwa.at.cam21, AJ = Nagiwa.at.jade_row;
const SHIFT = "time>=19:00";                                 // her night shift (the game's day runs on past midnight)

// ---- K1: CAM 21 at seven, Marit comes from the left to the door under the camera and stands there looking back, twice
Cutaway.actor("marit_feed", { name: "Pflegerin", color: "#c8b0e0", speed: [14, 10],
  costume: { idle: { se: "marit_feed_look", ne: "marit_feed_back" }, walk: { se: "marit_feed_front_walk", ne: "marit_feed_back_walk" },
    talk: { se: "marit_feed_look", ne: "marit_feed_back" } },
  look: ["Eine im kurzen Kittel. Um sieben kam sonst Ines raus.", "Die kommt zur Nachtschicht. Und sie sieht sich um. Zweimal."],
  talk: ["Sie hört mich nicht. Sie schaut nur, ob ihr einer folgt."] });
Cutaway.routine("marit_feed", [
  { day: [5, 6, 7], from: "19:00", to: "19:30", room: "cam21", at: A21.gone, path: [A21.gone, A21.walkOff, A21.door], once: true, face: "se" },
]);

// ---- K2, K3: the clinic
Cutaway.actor("marit", { name: "Marit", color: "#c8b0e0", voice: { pitch: 60, range: 3, wave: "triangle", syllable: 72, speed: 1.1 },
  lineBox: { x: AK.maritLine[0], y: AK.maritLine[1], w: 150, align: "center" } });
const M = (/** @type {string} */ text) => ({ say: "marit", text });
const INTAKE = [
  M("Name. Und wie viele Stunden schlafen Sie?"),
  "Ada Novak. Drei. Manchmal vier.",
  M("Das sagen hier alle."),
  M("Wir können Ihnen Lull geben."),
  "Was kostet das?",
  M("Es kostet nichts. Das fragen alle zuerst."),
  M("Ich schau nur kurz hinters Ohr. Ob da schon was sitzt."),
  "Nicht hinters Ohr.",
  "Ich zieh die Kapuze hoch.",
  "Nicht heute.",
  M("Kommen Sie wieder, wenn Sie nicht schlafen können."),
];
const CALDER = [
  M("Dr. Calder ist nicht mehr bei uns."),
  "Sie sieht zur Tür. Dann beugt sie sich ans Glas.",
  M("Sie hat nachts Protokolle geschrieben. Die hat keiner bestellt."),
  M("Nie übers Netz der Klinik. Alles auf Papier."),
  { if: "day=5", then: [M("Heute früh waren welche in Weiß da. Die haben ihren Spind ausgeräumt."),
    M("Morgen um acht räumen sie auch ihre Wohnung. Lerche, vierter Stock, 4B.")] },
  { if: "day=6", then: [M("Gestern früh waren welche in Weiß da. Die haben ihren Spind ausgeräumt."),
    { if: "time<20:00", then: [M("Heute um acht räumen sie auch ihre Wohnung. Lerche, vierter Stock, 4B.")],
      else: [{ if: "time<21:00", then: [M("Gerade räumen sie ihre Wohnung aus. Lerche, vierter Stock, 4B.")],
        else: [M("Heute Abend haben sie ihre Wohnung ausgeräumt. Lerche, vierter Stock, 4B.")] }] }] },
  { if: "day=7", then: [M("Am Samstag waren welche in Weiß da. Die haben ihren Spind ausgeräumt."),
    M("Gestern haben sie ihre Wohnung ausgeräumt. Lerche, vierter Stock, 4B.")] },
  { set: "know_flat" },
  M("Wenn du sie gekannt hast, geh nicht hin, solange die da sind."),
  "Sie setzt sich wieder gerade hin.",
  M("Der Nächste, bitte."),
];
Nagiwa.talkTree("k2_marit", [
  ["„Ich kann nicht schlafen.“", INTAKE],
  ["„Ich suche Dr. Calder.“", CALDER],
], "„Schon gut.“");

const klinik = Cutaway.room.get("klinik");
Object.assign(klinik, { name: "Lull-Klinik 9-Ost", ambience: ["neon_buzz"] });
Object.assign(klinik.hotspots, {
  door: { name: "Tür", poly: AK.doorPoly, walkTo: AK.door, face: "nw", look: "Draußen regnet es. Hier drin riecht es nach Desinfektion.",
    use: [{ goto: "jade_row", at: AJ.far, face: "sw" }] },
  // before seven nobody sits behind the glass; from seven Marit (the same shape: the counter and its glass, she is behind it)
  aufnahme: { name: "Aufnahme", poly: AK.receptionPoly, walkTo: AK.reception, face: "nw", if: "time<19:00",
    look: "Hinter dem Glas ist keiner. Auf dem Schalter steht: NACHTAUFNAHME AB SIEBEN.",
    use: ["Nachtaufnahme ab sieben. Also warten. Wie alle hier."] },
  pflegerin: { name: "Pflegerin", poly: AK.receptionPoly, walkTo: AK.reception, face: "nw", if: SHIFT,
    look: ["Auf ihrem Schild steht M. HOLM.", "Hinter ihrem Ohr sitzt kein Lull. Die muss ja wach bleiben."],
    use: [{ dialog: "k2_marit" }] },
  wartende: { name: "Wartende", poly: AK.seatsPoly, walkTo: AK.reception, face: "ne",
    look: ["Alle hier sehen aus wie Teo nach der Schicht.", "Hinter jedem Ohr der blasse Punkt. Die warten auf mehr davon."],
    use: ["Die schlafen fast im Sitzen. Ich lass sie."] },
  schirm: { name: "Schirm", poly: AK.screenPoly, walkTo: AK.reception, face: "ne",
    look: ["SLEEP BETTER. LULL IS FREE.", "Es kostet nichts. Also zahlt irgendwer."] },
  ring: { name: "Nagi·was Ring", poly: AK.ringPoly, walkTo: AK.reception, face: "ne", look: "Nagi·was Ring. Hier drin gehört alles Nagi·wa." },
  kabine: { name: "Kabine", poly: AK.cabinPoly, walkTo: AK.cabin, face: "ne",
    look: ["Ein Liegestuhl unter einer Haube mit einem Lichtring.", "Da drin kriegt man sein Lull."],
    use: ["Da leg ich mich nicht hin."] },
});
})();

// Nagiwa: the end of Chapter 2 (docs/kapitel2-design.md §8), on blocks. Monday from 01:00: Lantern sends Ines' protocols, Juno lays them
// beside her own recordings, and Teo doesn't wake up. One chain on which nothing branches, as Chapter 1's end:
//   end_beat2    sent (the protocols are out, Juno at her deck) > found (the match: the rest goes on by itself)
// So the times in it may lie between the ticks. The last check is PRÜFEN (game/pruefen.js): the protocols as a timeline over her CACHE's
// clips, one picked (a view), then the spike where it matches; Kessler's ring is the match everyone has, more clips find more.
"use strict";

(function () {
const AF = Nagiwa.at.flat;

// ---- 01:00: wherever Juno is, every screen Lantern reaches tears off, the big one on Kowalski Street too. Never watched: it
// happens as its window ends (the clock stood at 00:45 until everything was ready, game/kapitel2.js). Then his broadcast fills the
// screen (the user's wish, 2026-11-20): the Lower Ninth asleep tonight, camera after camera, his ticker under it (game/kapitel2_sendung.js);
// the waits are timed so that the ticker has run through by the last shot's end
Cutaway.i18n.declare("feed display", ["THEY DON'T SLEEP."]);
Cutaway.moment("protokolle", { room: "deck", day: 7, from: "00:45", to: "01:00", if: "~never", unseen: [
  { set: "end_beat2", value: "sent" },
  { sfx: "glitch" },
  "Alle Schirme sind auf einmal grün. Auch der große auf der Kowalski.",
  { fade: "out", ms: 600 },
  { unset: "deck_app" },
  { goto: "sendung_23", transition: false },
  { sfx: "glitch" },
  { fade: "in", ms: 300 },
  { caption: "THEY DON'T SLEEP.", at: "c", color: "#7cff9a", ms: 3200 },
  { wait: 6000 },
  { sfx: "glitch" },
  { goto: "sendung_15", transition: false },
  { wait: 10000 },
  { sfx: "glitch" },
  { goto: "sendung_lucky", transition: false },
  { wait: 10000 },
  { sfx: "glitch" },
  { fade: "out", ms: 1200 },
  { goto: "k2_protokolle", at: AF.deck, face: "ne", transition: false },
  { fade: "in", ms: 1200 },
  "Das sind unsere Kameras. Von heute Nacht.",
  { evi: "besorgt" },
  { say: "evi", text: "Er hat sie alle auf einmal genommen." },
  "Lantern. Er sendet.",
  "Ihre Protokolle liegen im NETZ, offen für alle. Tabellen, Nacht für Nacht.",
  // (decision 2: given to Lantern, the clip goes out with them, too early, kapitel2-design §3.6)
  { if: "e2=lantern", then: ["Meine Aufnahme läuft mit. Ines auf der Treppe, bis er hochsieht.",
    { if: "forgery_proven", then: ["Und daneben die Fälschung, mit der Minute, die fehlt."] }, "Zu früh. Einem Mörder glaubt keiner. Auch nicht mit Beweis."] },
  "Das Brett lacht über den Mörder mit den Tabellen.",
] });

// ---- the last check: Ines' protocols over the clips in Juno's CACHE (§8). Only clips count, and an anonymised one keeps its stamp
const RING = ["Kesslers Ring. Dienstag, 22:35.", "Da ist eine Spitze. Einundvierzig Schläfer zur selben Sekunde.",
  { if: "cache_note_serviette", then: ["Das ist die Zahl auf ihrer Serviette."] }];
const MORROW = ["Morrows Umschlag, halb eins.", "Da ist auch eine Spitze. Die haben Morrow zugesehen, genau wie ich."];
const TRAEGER = ["Die weißen Träger. Donnerstag, halb zwölf.", "Dreiunddreißig Schläfer, genau da, wo ich gefilmt hab."];
Cutaway.i18n.declare("deck", ["PROTOKOLLE", "INES CALDER // REM, LOWER NINTH", "DI 6.11.", "MI 7.11.", "DO 8.11.",
  "DI 22:31-22:37", "DI 22:34", "00:30-00:31", "DO 23:30-23:34", "FR 23:00-23:04"]);
Nagiwa.checks.protokolle = { kind: "data", title: "PROTOKOLLE", label: "INES CALDER // REM, LOWER NINTH", if: "end_beat2=sent", done: "end_beat2=found",
  nights: ["DI 6.11.", "MI 7.11.", "DO 8.11."], from: 21, to: 27,
  spikes: [{ night: 0, at: "22:35", n: 41 }, { night: 1, at: "23:10", n: 9 }, { night: 1, at: "00:30", n: 17 }, { night: 2, at: "23:30", n: 33 }, { night: 2, at: "00:30", n: 19 }],
  rows: [
    { clip: "clip_kessler_ring", stamp: "DI 22:31-22:37", matches: { 0: RING } },
    { clip: "clip_kessler_cut", stamp: "DI 22:34", matches: { 0: RING } },
    { clip: "clip_morrow_bribe", stamp: "00:30-00:31", matches: { 2: MORROW, 4: MORROW } },
    { clip: "clip_traeger", stamp: "DO 23:30-23:34", matches: { 3: TRAEGER } },
    { clip: "clip_ines_death", stamp: "FR 23:00-23:04", matches: {}, wrong: ["In der alten Metro hat keiner zugesehen. Nur ich."] },
    { clip: "clip_forgery", stamp: "FR 23:00-23:04", matches: {}, wrong: ["Die Fälschung gab es da noch gar nicht."] },
  ],
  none: ["Erst brauch ich einen Clip daneben."],
  wrong: ["Da passt die Zeit nicht."],
  found: [{ set: "end_beat2", value: "found" }, { replay: "k2_ende" }] };

// what follows the match, whichever clip it was: written once, here, where the Schedule tab edits it (never reached by the clock itself: the
// scene ends the chapter at 03:15)
Cutaway.moment("k2_ende", { room: "k2_protokolle", day: 7, from: "03:30", to: "03:45", if: "~never", unseen: [], play: [
  { wait: 900 },
  { unset: "deck_app" }, { unset: "pruef_pick" },
  "Die haben zugesehen. Als ich zugesehen hab.",
  { say: "evi", text: "Wer?" },
  "Alle, die schlafen.",
  { say: "evi", text: "Dann haben die dich ersetzt. Nicht ich." },
  "Meine Nachbarn.",
  { wait: 1500 },
  { time: "03:00" },
  "Durch die Wand hör ich, wie das halbe Haus Luft holt. Alle zur selben Zeit.",
  { wait: 1500 },
  { time: "03:15" },
  { notify: "becken3" },
  { wait: 1200 },
  "Das ist nicht Nagi·wa. Das ist Tinte.",
  { fade: "out", ms: 2000 },
  { end: "Kapitel 3: Lull (kommt später)" },
] });

// her flat at night, only the deck's screens lit (the look of Chapter 1's end); one thing to click: the deck, which opens the check
Cutaway.room("k2_protokolle", { name: "Junos Wohnung", background: "flat_bg", props: AF.props, buttons: false, eviCorner: true, checkScreen: true, post: [{ deck_only: true }],
  walk: [[AF.deck[0] - 1, AF.deck[1] - 1, AF.deck[0] + 1, AF.deck[1] - 1, AF.deck[0] + 1, AF.deck[1] + 1, AF.deck[0] - 1, AF.deck[1] + 1]],
  light: { ambient: 0.38, color: "#8a9cff", lamps: AF.lamps.map((/** @type {any} */ { bake, ...lamp }) => lamp) },
  ambience: ["deck_fans"], music: { stop: true },
  hotspots: {
    protokolle: { name: "Die Protokolle", poly: AF.deckPoly, if: ["end_beat2=sent", "!deck_app"],
      look: "Ines' Protokolle: REM-Spitzen, Nacht für Nacht, auf die Sekunde.",
      use: ["Ich leg die Protokolle neben meine Aufnahmen.", { set: "deck_app", value: "pruef_protokolle" }, { sfx: "type" }] },
    ...Nagiwa.checkHotspots("protokolle", { close: true }),
  } });

// 03:15: a contact Juno doesn't know. [PLATZHALTER] its name (§14: BECKEN 3 or TINTE)
Object.assign(Nagiwa.contacts, { becken3: { name: "BECKEN 3", color: "#7ad0c8", status: "online", if: "end_beat2=found", unread: "!read_becken3" } });
Cutaway.state.view("read_becken3");
Nagiwa.threads.becken3 = [
  { from: "becken3", if: "end_beat2=found", at: "03:15", text: "Dein Bruder schläft im Becken-Raum. Er hört nicht. Komm." },
];
})();

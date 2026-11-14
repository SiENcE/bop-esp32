// Nagiwa: the end of Chapter 2 (docs/kapitel2-design.md §8), on blocks. Monday from 01:00: Lantern sends Ines' protocols, Juno lays them
// beside her own recordings, and Teo doesn't wake up. One chain on which nothing branches, as Chapter 1's end:
//   end_beat2    sent (the protocols are out, Juno at her deck) > found (the match: the rest goes on by itself)
// So the times in it may lie between the ticks. [PLATZHALTER] the last check is a single click on the deck for now; the real one is the
// clip editor's PRÜFEN (step 2, with the forgery): the protocols as a timeline against her CACHE, Kessler's ring the match everyone has.
"use strict";

(function () {
const AF = Nagiwa.at.flat;

// ---- 01:00: wherever Juno is, every screen Lantern reaches tears off, the big one on Kowalski Street too. Never watched: it
// happens as its window ends (the clock stood at 00:45 until everything was ready, game/kapitel2.js)
Cutaway.i18n.declare("feed display", ["THEY DON'T SLEEP. THEY WORK."]);
Cutaway.moment("protokolle", { room: "deck", day: 7, from: "00:45", to: "01:00", if: "~never", unseen: [
  { set: "end_beat2", value: "sent" },
  { sfx: "glitch" },
  "Alle Schirme sind auf einmal grün. Auch der große auf der Kowalski.",
  { caption: "THEY DON'T SLEEP. THEY WORK.", at: "c", color: "#7cff9a", ms: 3200 },
  "Lantern. Er sendet.",
  { fade: "out", ms: 1200 },
  { goto: "k2_protokolle", at: AF.deck, face: "ne", transition: false },
  { fade: "in", ms: 1200 },
  "Ihre Protokolle liegen im NETZ, offen für alle. Tabellen, Nacht für Nacht.",
  "Das Brett lacht über den Mörder mit den Tabellen.",
] });

// her flat at night, only the deck's screens lit (the look of Chapter 1's end); one thing to click: the deck
Cutaway.room("k2_protokolle", { name: "Junos Wohnung", background: "flat_bg", props: AF.props, buttons: false, eviCorner: true, post: [{ deck_only: true }],
  walk: [[AF.deck[0] - 1, AF.deck[1] - 1, AF.deck[0] + 1, AF.deck[1] - 1, AF.deck[0] + 1, AF.deck[1] + 1, AF.deck[0] - 1, AF.deck[1] + 1]],
  light: { ambient: 0.38, color: "#8a9cff", lamps: AF.lamps.map((/** @type {any} */ { bake, ...lamp }) => lamp) },
  ambience: ["deck_fans"], music: { stop: true },
  hotspots: {
    protokolle: { name: "Die Protokolle", poly: AF.deckPoly, if: "end_beat2=sent",
      look: "Ines' Protokolle: REM-Spitzen, Nacht für Nacht, auf die Sekunde.",
      use: [
        "[MOCK] Hier leg ich die Protokolle neben meine Aufnahmen. Das Prüfen kommt noch.",
        "Kesslers Ring. Dienstag, 22:35.",
        "Da ist eine Spitze. Einundvierzig Schläfer zur selben Sekunde.",
        { set: "end_beat2", value: "found" },
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
      ] },
  } });

// 03:15: a contact Juno doesn't know. [PLATZHALTER] its name (§14: BECKEN 3 or TINTE)
Object.assign(Nagiwa.contacts, { becken3: { name: "BECKEN 3", color: "#7ad0c8", status: "online", if: "end_beat2=found", unread: "!read_becken3" } });
Cutaway.state.view("read_becken3");
Nagiwa.threads.becken3 = [
  { from: "becken3", if: "end_beat2=found", at: "03:15", text: "Dein Bruder schläft im Becken-Raum. Er hört nicht. Komm." },
];
})();

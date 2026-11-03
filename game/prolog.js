// Halcyon: the prologue "Nachtschicht", steps 0–11 (docs/kapitel0-design.md §6): the H2 vertical slice.
// Juno's flat and her deck; Kessler leaves the pump authority at 22:00 (cam03), phones, walks to Yuen's
// and gives Varga his wedding ring at 22:35 (cam04). Juno tags, listens, links cam04 with the code she
// zooms in on, records the ring (or takes it from the buffer), and answers Frau Kessler (choice P1).
"use strict";

(function () {
// ---- what the cache and the Kassenbuch know
Object.assign(Halcyon.cache, {
  note_kessler_photo: { kind: "note", name: "FOTO KESSLER", about: "Kessler mit hellem Schal. „Den hab ich ihm gestrickt.“" },
  clip_kessler_ring: { kind: "clip", name: "KESSLER, RING, 22:35", about: "Kessler zieht den Ehering ab und gibt ihn einem Mann im grauen Mantel." },
  note_kessler_debt: { kind: "note", name: "KESSLER SCHULDET VARGA", about: "Kessler schuldet Gus Varga Geld. Frist: Freitag." },
});
Object.assign(Halcyon.ledger, {
  kessler: { to: "M. KESSLER", what: { full: "die Wahrheit", cut: "ein Ehebruch", nothing: "nichts" }, chits: { full: 200, cut: 300 } },
  sable_kessler: { to: "SABLE", what: { sold: "Kesslers Schulden" }, chits: { sold: 120 } },
});

// ---- game time: a game day runs from 18:00; the prologue's night starts at 21:30
Cutaway.time.configure({
  start: "18:00", end: "04:00",
  // where the button for waiting is (play.mjs clicks it): on the deck and in every feed
  waitPoint: () => Cutaway.scene.room?.deck ? { x: 33, y: 170 } : Cutaway.scene.room?.feed ? { x: 253, y: 18 } : null,
});

// ---- routines (where everyone is when)
const A3 = Halcyon.at.cam03, A4 = Halcyon.at.cam04;
Cutaway.routine("kessler", [
  // out of the door, then under the canopy's far end with his phone (far from the camera's mic)
  { day: 1, from: "22:00", to: "22:15", room: "cam03", at: A3.door, path: [A3.door, A3.awningFar] },
  { day: 1, from: "22:30", to: "04:00", room: "cam04", at: A4.seatKessler, face: "left" },     // facing Varga
]);
Cutaway.routine("varga", [{ day: 1, from: "22:30", to: "22:50", room: "cam04", at: A4.seatVarga }]);
Cutaway.routine("yuen", [{ from: "18:00", to: "04:00", room: "cam04", at: A4.cook }]);
// the crowd leaving at 22:00: out of the door, along the street to the far exit or down to the right
const exits = [A3.exitRight, A3.exitFar, A3.exitRight, A3.exitFar];
["commuter_a", "commuter_b", "commuter_c", "commuter_d"].forEach((id, i) => {
  Cutaway.routine(id, [{ day: 1, from: "22:00", to: "22:15", room: "cam03", at: [A3.door[0] + (i - 1.5) * 8, A3.door[1] + 6 + i * 4], path: [A3.door, A3.vendingSpot, exits[i]] }]);
});

// ---- moments: Kessler's call (once Juno has tagged him), the ring at Yuen's
Cutaway.moment("kessler_call", {
  room: "cam03", day: 1, from: "22:00", to: "22:15", if: "tag_kessler",
  play: [
    { say: "kessler", text: "Ja ... ja, ich bring's mit. Alles. Halb elf, bei Yuen's." },
    "Zu weit weg. Komm schon, stell dich unter.",
    { walk: "kessler", to: A3.awning, free: true },
    { say: "kessler", text: "Ja, ich bring's mit. Alles. Halb elf, bei Yuen's." },
    { set: "heard_yuens" },
    "Yuen's. Der Imbiss an der Ecke. Da hängt 'ne Kamera. Hab ich bloß nicht.",
  ],
  unseen: [{ set: "call_missed" }],
});
Cutaway.moment("kessler_ring", {
  room: "cam04", day: 1, from: "22:30", to: "22:50",
  play: [
    { say: "varga", text: "Das ist nicht alles, Kessler." },
    { say: "kessler", text: "Mehr hab ich nicht." },
    { zoom: "zoom_ring" },
    "Er zieht den Ring ab.",
    { if: "rec_on", then: [{ cache: "clip_kessler_ring" }, "Und ich hab's."],
      else: ["Mist. REC war aus. Der Puffer hat es noch."] },
    { zoom: false },
    { say: "varga", text: "Bis Freitag, Kessler. Sonst holen wir uns mehr als einen Ring." },
    { set: "saw_varga" }, { cache: "note_kessler_debt" },
    "Gus Varga. Kein Liebhaber. Ein Kredithai.",
  ],
});

// ---- messages (opened on the deck)
Cutaway.dialog("mail_kessler", {
  main: {
    enter: [{ once: [
      { narrate: "„Mein Mann kommt seit Wochen spät. Er sagt, Überstunden. Ich will Beweise. Pumpenverwaltung Ost, er geht um 22 Uhr.“" },
      { narrate: "„Und er isst nur noch Automatennudeln, Nummer 7, als hätte er kein Zuhause. Das Foto: den Schal hab ich ihm gestrickt. M. Kessler“" },
    ] }],
    choices: [
      { text: "Ihr den ganzen Clip schicken.", if: ["cache_clip_kessler_ring", "!p1"], silent: true, goto: "end",
        then: [{ set: "p1", value: "full" }, { ledger: "kessler", value: "full" }, { narrate: "Gesendet: der ganze Clip. Die Schulden, der Ring, Varga." },
          { narrate: "„Schulden. Er hat mir nie was gesagt.“ 200 Chits eingegangen." }, "Die Wahrheit. Für zweihundert."] },
      { text: "Nur den Ring schicken.", if: ["cache_clip_kessler_ring", "!p1"], silent: true, goto: "end",
        then: [{ set: "p1", value: "cut" }, { ledger: "kessler", value: "cut" }, { narrate: "Gesendet: zwölf Sekunden. Ein Mann zieht seinen Ehering ab." },
          { narrate: "„Ich wusste es.“ 300 Chits eingegangen. 100 davon Bonus." }, "Sie hat bekommen, was sie bestellt hat."] },
      { text: "„Nichts gefunden.“ schreiben.", if: ["cache_clip_kessler_ring", "!p1"], silent: true, goto: "end",
        then: [{ set: "p1", value: "nothing" }, { ledger: "kessler", value: "nothing" }, { narrate: "Gesendet: „Nichts gefunden. Kein Honorar.“" }, "Soll er's ihr selbst sagen."] },
      { text: "Ihre Nachricht noch mal lesen.", silent: true,
        then: [{ narrate: "„Pumpenverwaltung Ost, er geht um 22 Uhr. Nummer 7. Den Schal hab ich ihm gestrickt.“" }] },
      { text: "Später.", silent: true, goto: "end", if: "!p1" },
      { text: "Schließen.", silent: true, goto: "end", if: "p1" },
    ],
  },
});
Cutaway.dialog("mail_sable", {
  main: {
    enter: [{ once: [{ narrate: "„Ruhige Nacht? Ich kaufe alles, was atmet. S.“" }] }],
    choices: [
      { text: "Kesslers Schulden an Sable verkaufen.", if: ["cache_note_kessler_debt", "!ledger_sable_kessler"], silent: true, goto: "end",
        then: [{ ledger: "sable_kessler", value: "sold" }, { narrate: "„Kessler, Pumpenverwaltung, Schulden bei Varga. Nett. 120.“" }, "Jeder Verkauf landet im Kassenbuch. Jeder."] },
      { text: "Nichts für dich heute.", silent: true, goto: "end" },
    ],
  },
});

// ---- the flat (H2: placeholder geometry until art/rooms/flat.px.js's layout is in)
const AF = Halcyon.at.flat;
Cutaway.room("flat", {
  // PLACEHOLDER: the test street stands in for the flat's picture until art/rooms/flat.px.js exists
  name: "Junos Wohnung", background: Cutaway.assets.get("flat_bg") ? "flat_bg" : "street_bg",
  walk: [[20, 140, 150, 75, 300, 150, 300, 178, 20, 178]],
  hotspots: {
    deck: { name: "Deck", rect: [120, 70, 60, 40], walkTo: AF.deck, face: "ne",
      look: "Mein Deck. Drei Bildschirme, die nicht zusammenpassen, und ein Feed, der nie schläft.", use: [{ goto: "deck" }] },
    fridge: { name: "Kühlschrank", rect: [220, 70, 24, 40], walkTo: AF.fridge, face: "ne",
      look: "Der Kühlschrank.", use: [{ set: "fridge_empty" }, "Licht. Sonst nichts."] },
    box_old: { name: "Karton", rect: [196, 128, 26, 18], walkTo: AF.box, face: "se",
      look: ["Ein Karton von damals.", "Mein Halcyon-Ausweis. CIVIC MONITOR, J. REYES. UNGÜLTIG.", "Und der Kaktus. Vertrocknet. Wie alles aus der Zeit."] },
    window: { name: "Fenster", rect: [240, 40, 40, 50], walkTo: AF.window, face: "ne",
      look: "Regen. Und gegenüber der große Bildschirm. HALCYON: SLEEP BETTER. Ich schlafe schlecht, danke." },
    pinboard: { name: "Pinnwand", rect: [80, 50, 40, 30], walkTo: AF.pinboard, face: "ne",
      look: "Fotos, Fäden, Zettel. Leute, die ich kenne, ohne dass sie mich kennen." },
    door: { name: "Tür", rect: [30, 70, 24, 56], walkTo: AF.door, face: "nw",
      look: "Die Tür zum Flur.",
      use: [{ if: "!p1", then: ["Erst der Auftrag. Dann Essen."],
        else: [{ if: "!fridge_empty", then: ["Hunger. Mal sehen, was der Kühlschrank sagt."],
          else: ["Bao hat immer was.", { end: "Ende des Testabschnitts. Weiter geht es im Flur (H3)." }] }] }] },
  },
  enter: [{ once: ["Halb zehn. Frau Kesslers Mann hat um zehn Schichtende.", "Erst mal ans Deck."] }],
});

// ---- the act
Cutaway.act("prolog", {
  title: "Prolog", name: "Nachtschicht", room: "flat", actor: "juno",
  start: [
    { time: "21:30", day: 1 }, { set: "chits", value: 0 },
    { place: "juno", room: "flat", at: AF.start, face: "ne" },
    { set: "code_cam03" }, { set: "link_cam03" }, { cache: "note_kessler_photo" },
  ],
});
})();

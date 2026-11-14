// Nagiwa: the prologue "Nachtschicht", steps 0–11 (docs/kapitel0-design.md §6): the H2 vertical slice.
// Juno's flat and her deck; Kessler leaves the pump authority at 22:00 (cam03), phones, walks to Yuen's
// and gives Varga his wedding ring at 22:35 (cam04). Juno tags, listens, links cam04 with the code she
// zooms in on, records the ring (or takes it from the buffer), and answers Frau Kessler (choice P1).
"use strict";

(function () {
// ---- what the cache and the Kassenbuch know
Object.assign(Nagiwa.cache, {
  note_kessler_photo: { kind: "note", name: "FOTO KESSLER", about: "Kessler mit hellem Schal. „Den hab ich ihm gestrickt.“" },
  clip_kessler_ring: { kind: "clip", name: "KESSLER, RING, 22:35", about: "Kessler zieht den Ehering ab und gibt ihn einem Mann im grauen Mantel." },
  clip_kessler_cut: { kind: "clip", name: "KESSLER, RING (12 S)", about: "Zwölf Sekunden: ein Mann zieht seinen Ehering ab. Was davor war und danach, ist weg." },
  note_kessler_debt: { kind: "note", name: "KESSLER SCHULDET VARGA", about: "Kessler schuldet Gus Varga Geld. Frist: Freitag." },
});
Object.assign(Nagiwa.ledger, {
  kessler: { to: "M. KESSLER", what: { full: "die Wahrheit", cut: "ein Ehebruch", nothing: "nichts" }, chits: { full: 200, cut: 300 } },
  sable_kessler: { to: "SABLE", what: { sold: "Kesslers Schulden" }, chits: { sold: 120 } },
});

// ---- game time: a game day runs from 18:00; the prologue's night starts at 21:30
Cutaway.time.configure({
  start: "18:00", end: "04:00",
  // where the button for waiting is (play.mjs clicks it): on the deck and in every feed
  waitPoint: () => Cutaway.scene.room?.deck ? { x: 256, y: 5 } : Cutaway.scene.room?.feed ? { x: 253, y: 18 } : null,
});

// ---- routines (where everyone is when)
const A3 = Nagiwa.at.cam03, A4 = Nagiwa.at.cam04;
Cutaway.routine("kessler", [
  // out of the door, past the noodle machine as every evening, then under the canopy's far end with his phone (far from the
  // camera's mic)
  { day: 1, from: "22:00", to: "22:15", room: "cam03", at: A3.door, path: [A3.door, A3.vendingSpot, A3.awningFar] },
  { day: 1, from: "22:30", to: "04:00", room: "cam04", at: A4.seatKessler, face: "left" },     // facing Varga
]);
Cutaway.routine("varga", [{ day: 1, from: "22:30", to: "22:50", room: "cam04", at: A4.seatVarga }]);
Cutaway.routine("yuen", [{ from: "18:00", to: "04:00", room: "cam04", at: A4.cookBust }]);
// the crowd leaving at 22:00: out of the door, along the street to the far exit or down to the right
const exits = [A3.exitRight, A3.exitFar, A3.exitRight, A3.exitFar];
["commuter_a", "commuter_b", "commuter_c", "commuter_d"].forEach((id, i) => {
  Cutaway.routine(id, [{ day: 1, from: "22:00", to: "22:15", room: "cam03", at: [A3.door[0] + (i - 1.5) * 8, A3.door[1] + 6 + i * 4], path: [A3.door, A3.vendingSpot, exits[i]] }]);
});

// ---- moments: Kessler's call (once Juno has tagged him), the ring at Yuen's
// 22:00 on cam03: the shift ends, the crowd comes out; Juno says what to look for (once)
Cutaway.moment("shift_end", {
  room: "cam03", day: 1, from: "22:00", to: "22:15",
  play: ["Es ist zehn, die Schicht ist aus. Da kommen sie.", "Einer davon ist Kessler. Auf Frau Kesslers Foto trägt er einen hellen Schal.", "Den markier ich. Einmal draufzeigen reicht."],
});
Cutaway.moment("kessler_call", {
  room: "cam03", day: 1, from: "22:00", to: "22:15", if: "tag_kessler",
  play: [
    { say: "kessler", text: "Ja ... ja, ich bring's mit. Alles. Halb elf, bei Yuen's." },
    "Er ist zu weit weg. Komm schon, stell dich unter.",
    { walk: "kessler", to: A3.awning, free: true },
    { say: "kessler", text: "Ja, ich bring's mit. Alles. Halb elf, bei Yuen's." },
    { set: "heard_yuens" },
    "Yuen's ist der Imbiss an der Ecke. Da hängt 'ne Kamera, aber die hab ich nicht.",
  ],
  unseen: [{ if: "day=1", then: [{ set: "call_missed" }, "Mist. Kessler ist weg. Aber die Kamera hat alles im Puffer."] }],   // (not when a later act begins)
});
// the handover at Yuen's: whether Juno has it is decided at its end, so REC can be pressed any time
// while it plays (game/screens.js lets the REC button take clicks during a scene)
Cutaway.moment("kessler_ring", {
  room: "cam04", day: 1, from: "22:30", to: "22:50",
  play: [
    { if: "!rec_on", then: ["Da sitzt er, und ihm gegenüber sitzt einer im grauen Mantel. REC, schnell."] },
    { say: "varga", text: "Das ist nicht alles, Kessler." },
    { say: "kessler", text: "Mehr hab ich nicht. Ehrlich." },
    { say: "varga", text: "Dann gib mir, was du hast." },
    { zoom: "zoom_ring" },
    "Er zieht den Ring ab.",
    "Und schiebt ihn rüber.",
    { zoom: false },
    { say: "varga", text: "Bis Freitag, Kessler. Sonst holen wir uns mehr als einen Ring." },
    { if: "rec_on", then: [{ cache: "clip_kessler_ring" }, "Ich hab's. Es ist alles drauf."],
      else: ["Mist. REC war aus. Der Puffer hat es noch."] },
    { set: "saw_varga" }, { cache: "note_kessler_debt" },
    "Das ist Gus Varga. Er ist kein Liebhaber, er ist ein Kredithai.",
  ],
});

// ---- the clip editor (step 9, docs/kapitel0-design.md §2.4): the ring clip runs 22:31-22:37; cutting keeps
// the ring alone (12 seconds that look like a man taking off his ring for someone else); EVI asks if that is
// allowed, and how Juno answers moves evi_trust (answering at all is being open with her)
Nagiwa.clips.clip_kessler_ring = {
  cam: "cam04", from: 31, to: 37.2, thumb: "zoom_ring",
  moments: [[31, 32.4, "SETZT SICH"], [32.4, 34.6, "REDEN"], [34.6, 34.8, "RING"], [34.8, 37.2, "BIS FREITAG"]],
  people: [["kessler", 31, 37.2], ["varga", 31.1, 37.2]],
  cut: { moment: 2, gives: "clip_kessler_cut", if: "day=1", then: [{ evi: "neugierig" },
    { say: "evi", text: "Wenn man das Ende weglässt, ist es eine andere Geschichte. Ist das erlaubt?" }, { dialog: "evi_cut" }] },
};
Nagiwa.clips.clip_kessler_cut = { cam: "cam04", from: 34.6, to: 34.8, thumb: "zoom_ring", moments: [[34.6, 34.8, "RING"]], people: [["kessler", 34.6, 34.8], ["varga", 34.6, 34.8]] };
Cutaway.dialog("evi_cut", {
  main: {
    choices: [
      { text: "„Ist es.“", goto: "end", then: [{ inc: "evi_trust", by: 1 }, { evi: "froh" }, { say: "evi", text: "Okay. Ich merk mir das." }] },
      { text: "„Nein.“", goto: "end", then: [{ inc: "evi_trust", by: 1 }, { evi: "verwirrt" }, { say: "evi", text: "Aber du hast es gemacht. Menschen sind schwer." }] },
      { text: "Nichts sagen.", silent: true, goto: "end", then: [{ evi: "besorgt" }, { say: "evi", text: "... Okay." }] },
    ],
  },
});

// ---- the old photo on the deck (game/deck.js): what Juno says looking at it (a click shows it whole)
Nagiwa.photo.look = ["Teo und ich, auf dem Dach vom Kessel-Block. Er hatte nie Angst vor der Höhe. Ich schon.",
  { say: "evi", text: "Ihr seid sehr klein darauf." }];

// ---- the deck (game/deck.js, EVI: game/evi.js). Step 0a: the first time tonight it boots, EVI wakes up
// and points at the chat (docs/kapitel0-design.md §6.2)
Nagiwa.deckEnter = [{ unset: "rec_on" }, { if: "day=1", then: [{ once: [
  { deck_boot: true }, { evi: "froh" },
  { say: "evi", text: "Guten Abend, Juno! Eine neue Nachricht. Null Abendessen." },
  "Danke, EVI.",
  { evi_point: "chat" },
] }], else: [{ if: "!read_wren", then: [
  { deck_boot: true }, { evi: "neugierig" },
  { say: "evi", text: "Guten Abend, Juno! Eine neue Nachricht. Sie hat keinen Absender, da steht nur WREN." },
  { evi_point: "chat" },
] }] }];

// ---- the chat (game/deck.js): who writes to Juno tonight, what they wrote, what she can answer
// (contacts that appear later come last, so the rows stay put)
Object.assign(Nagiwa.contacts, {
  kessler: { name: "M. KESSLER", color: "#eea040", status: "online",
    // the dot: her first message, and in Chapter 1 the new one (a view: reading it changes nothing else)
    unread: { or: ["!read_kessler", ["day>1", "!read_kessler_again"]] },
    open: [{ set: "read_kessler" }, { set: "read_kessler_again" }, { if: "day=1", then: [{ once: ["Überstunden. Klar.", { evi: "neugierig" }, { say: "evi", text: "Pumpenverwaltung Ost! Da hab ich eine Kamera für dich." }, { evi_point: "glas" }] }] }] },
  teo: { name: "TEO", color: "#ffa040", status: "schläft", unread: "~never" },
  nagiwa: { name: "NAGI·WA SERVICE", color: "#62def0", status: "Werbung", unread: "~never" },
  sable: { name: "SABLE", color: "#ff4fd3", status: "abwesend", if: "p1", unread: ["day=1", "cache_note_kessler_debt", "!ledger_sable_kessler"] },
  // (Teo and Nagi·wa's spam are old news: no dot)
});
Object.assign(Nagiwa.threads, {
  kessler: [
    { from: "kessler", at: "21:12", text: "Mein Mann kommt seit Wochen spät. Er sagt, Überstunden. Ich will Beweise." },
    { from: "kessler", at: "21:12", text: "Pumpenverwaltung Ost, er geht um 22 Uhr." },
    { from: "kessler", at: "21:13", photo: "FOTO KESSLER", text: "Den Schal hab ich ihm gestrickt." },
    { from: "kessler", at: "21:14", text: "Und er isst nur noch Automatennudeln, Nummer 7, als hätte er kein Zuhause. M. Kessler" },
    { from: "juno", if: "p1=full", clip: "KESSLER, RING, 22:35", text: "Der ganze Clip. Die Schulden, der Ring, Varga." },
    { from: "kessler", if: "p1=full", text: "Schulden. Er hat mir nie was gesagt." },
    { from: "kessler", if: "p1=full", text: "200 Chits überwiesen." },
    { from: "juno", if: "p1=cut", clip: "KESSLER, RING (12 S)", text: "Zwölf Sekunden. Ein Mann zieht seinen Ehering ab." },
    { from: "kessler", if: "p1=cut", text: "Ich wusste es." },
    { from: "kessler", if: "p1=cut", text: "300 Chits überwiesen. 100 davon Bonus." },
    { from: "juno", if: "p1=nothing", text: "Nichts gefunden. Kein Honorar." },
  ],
  teo: [
    { from: "teo", at: "gestern", text: "Bin heut früh im Bett. Schlaf du auch mal, Ju." },
  ],
  nagiwa: [
    { from: "nagiwa", at: "20:00", text: "LULL: NOW FREE. Vier Stunden Schlaf wie zehn, jetzt gratis im ganzen Neunten." },
    { from: "nagiwa", at: "20:00", text: "Ihre Hüllenabgabe wurde angepasst." },
  ],
  sable: [
    { from: "sable", if: "p1", text: "Ruhige Nacht? Ich kaufe alles, was atmet. S." },
    { from: "juno", if: "ledger_sable_kessler", text: "Kessler, Pumpenverwaltung. Schulden bei Gus Varga, Frist Freitag." },
    { from: "sable", if: "ledger_sable_kessler", text: "Nett. 120." },
  ],
});
// P1: what Frau Kessler gets (docs/kapitel0-design.md §6.3); and Sable's offer
Object.assign(Nagiwa.replies, {
  kessler: [
    { id: "full", text: "Den ganzen Clip schicken.", if: ["cache_clip_kessler_ring", "!p1"],
      use: [{ set: "p1", value: "full" }, { ledger: "kessler", value: "full" }, "Das war die Wahrheit, für zweihundert Chits.",
        { evi: "verwirrt" }, { say: "evi", text: "Sie schreibt nichts mehr. Ist sie jetzt froh?" }, { notify: "sable" }] },
    { id: "cut", text: "Nur den Ring schicken.", if: ["cache_clip_kessler_cut", "!p1"],                 // the cut clip (the editor)
      use: [{ set: "p1", value: "cut" }, { ledger: "kessler", value: "cut" }, "Sie hat bekommen, was sie bestellt hat.",
        { evi: "besorgt" }, { say: "evi", text: "Sie hat ‚Ich wusste es‘ geschrieben. Sie hat es nicht gewusst, oder?" }, { notify: "sable" }] },
    { id: "nothing", text: "„Nichts gefunden.“", if: ["cache_clip_kessler_ring", "!p1"],
      use: [{ set: "p1", value: "nothing" }, { ledger: "kessler", value: "nothing" }, "Soll er's ihr selbst sagen.",
        { evi: "verwirrt" }, { say: "evi", text: "Wir haben nichts geschickt. Ist das nett oder feige? Ich weiß das nie." }, { notify: "sable" }] },
  ],
  sable: [
    { id: "sold", text: "Kesslers Schulden verkaufen.", if: ["day=1", "cache_note_kessler_debt", "!ledger_sable_kessler"],
      use: [{ ledger: "sable_kessler", value: "sold" }, "Jeder Verkauf landet im Kassenbuch. Jeder.",
        { evi: "froh" }, { say: "evi", text: "Ich schreib alles auf. Du hast gesagt, ich soll." }] },
  ],
});

// ---- the flat (art/rooms/flat.px.js; geometry: docs/rooms/flat_layout.md). Hotspots in this order: the
// last match wins, so the big shapes come first
const AF = Nagiwa.at.flat;
// Bao's broth to go (step 16): Juno eats it at home, and then the bed takes her into Chapter 1
Cutaway.item("suppe", { name: "Baos Brühe", icon: "inv_suppe", look: "Baos Brühe zum Mitnehmen, mit Deckel. Sie ist noch warm." });
const EAT_HOME = [{ walk: AF.deck }, { face: "ne" }, "Baos Brühe ist noch warm. Fast.", "...", "Sie ist zu salzig, und genau so muss sie sein.", { remove: "suppe" }, { set: "soup_eaten" },
  { evi: "froh" }, { say: "evi", text: "Du hast doch was mitgebracht. Eins Abendessen!" }, "Und jetzt ins Bett."];
const PROLOGUE_SLEEP = ["Genug für heute.", { say: "evi", text: "Gute Nacht, Juno." }, { fade: "out", ms: 900 }, { act: "next" }];
// the evening's card for Chapter 1's first evening, once, after the chapter's own card (a view: it costs the solver nothing)
Cutaway.state.view("evening_shown");
Cutaway.room("flat", {
  name: "Junos Wohnung", background: "flat_bg",
  ambience: ["rain_glass", "city_far", "neon_buzz", "fridge_hum"], music: { theme: "juno", intensity: 0.4 },
  walk: AF.walk, holes: AF.holes,
  // the door standing open (Teo's visit: { open: "flat/door_gap" } and "flat/door_leaf", for the scene only): the landing seen through
  // the gap, on the wall behind everyone, and the leaf swung in to the left over the gap's front half (who stands below its front line
  // is in front of it; who stands in the gap is behind it, but in front of the gap)
  props: [...AF.props,
    { id: "door_gap", image: "flat_door_gap", at: AF.doorOpen, anchor: [0, 0], baseline: 0, hidden: true },
    { id: "door_leaf", image: "flat_door_leaf", at: AF.doorOpen, anchor: [0, 0], baseline: 170, front: AF.doorLeafFront, hidden: true }],
  // the lamps of the map (the same that baked the art's light): they tint Juno where she stands
  light: { ambient: 0.38, color: "#8a9cff", lamps: AF.lamps.map((/** @type {any} */ { bake, ...lamp }) => lamp) },
  hotspots: {
    bed: { name: "Bett", poly: AF.bedPoly, walkTo: AF.bed, face: "nw",
      look: "Meine Matratze liegt auf einer Palette. Schlafen kann ich später. Oder nie.",
      // the prologue's night ends when Juno has eaten and goes to bed: sleeping goes on into Chapter 1, with its card and then the new evening's
      use: [{ if: "day>1", then: Nagiwa.sleep, else: [{ if: "soup_eaten", then: PROLOGUE_SLEEP, else: ["Schlafen kann ich später. Oder nie."] }] }] },
    fridge: { name: "Kühlschrank", poly: AF.fridgePoly, walkTo: AF.fridge, face: "ne",
      look: "Der Kühlschrank. Er brummt, als hätte er was zu sagen.", use: [{ set: "fridge_empty" }, "Drin ist Licht, sonst nichts."] },
    deck: { name: "Deck", poly: AF.deckPoly, walkTo: AF.deck, face: "ne",
      look: ["Das ist mein Deck. Keiner der drei Bildschirme passt zum anderen.", "Und der Feed darauf schläft nie."],
      use: [{ goto: "deck" }] },
    window: { name: "Fenster", poly: AF.windowPoly, walkTo: AF.window, face: "ne",
      look: ["Es regnet. Gegenüber ist das Hotel, und dahinter hängt der große Bildschirm.", "NAGI·WA: SLEEP BETTER. Ich schlafe schlecht, danke."] },
    door: { name: "Tür", poly: AF.doorPoly, walkTo: AF.door, face: "nw",
      look: "Die Tür geht raus auf den Flur.",
      use: [{ if: "!p1", then: ["Erst kommt der Auftrag, dann das Essen."],
        else: [{ if: "!fridge_empty", then: ["Ich hab Hunger. Mal sehen, was der Kühlschrank sagt."],
          else: [{ goto: "kessel_14", at: Nagiwa.at.kessel_14.arrive, face: "se" }] }] }] },
    laundry: { name: "Wäsche", poly: AF.laundryPoly, walkTo: AF.laundry, face: "ne",
      look: "Ob die Wäsche sauber ist, weiß inzwischen niemand mehr." },
    noodles: { name: "Nudelbecher", poly: AF.noodlesPoly, walkTo: AF.noodles, face: "ne",
      look: "Da steht ein Turm aus leeren Nudelbechern. Das ist mein einziges Bauwerk." },
    pinboard: { name: "Pinnwand", poly: AF.pinboardPoly, walkTo: AF.pinboard, face: "nw",
      look: ["An der Pinnwand hängen Fotos, Fäden und Zettel.", "Das sind Leute, die ich kenne, ohne dass sie mich kennen."] },
    box_old: { name: "Karton", poly: AF.boxPoly, walkTo: AF.box, face: "nw",
      look: ["Das ist ein Karton von damals.", "Da ist mein Nagi·wa-Ausweis drin: CIVIC MONITOR, J. REYES. UNGÜLTIG.", "Und der Kaktus ist vertrocknet, wie alles aus der Zeit."] },
  },
  enter: [{ unset: "deck_app" },
    { if: ["day=1", "has:suppe"], then: EAT_HOME },
    { if: ["day=2", "evening_shown<2"], then: [{ set: "evening_shown", value: 2 }, { evening_card: true }] },
    { if: "day=1", then: [
      { if: "p1", then: [{ once: [{ say: "evi", text: "Bringst du mir was mit?" }, "Du isst nicht.", { say: "evi", text: "Ich weiß. Bringst du mir was mit?" }] }] },
      { once: ["Es ist halb zehn. Frau Kesslers Mann hat um zehn Schichtende.", "Ich setz mich erst mal ans Deck."] }],
    else: [{ once: [{ if: "day<5", then: ["Heute ist Mittwoch. Bis Freitag brauch ich neunhundert Chits."] }] }] }],
});

// ---- the act
// NETZ on the prologue's evening (and Chapter 1's first: the record low is still the headline on Wednesday)
Nagiwa.netz.push(
  { kind: "head", slot: 0, page: "rekordtief", if: "day<3", text: "Kriminalität im Neunten auf Rekordtief." },
  { kind: "sub", slot: 1, if: "day=1", text: "Pumpenhalle 3: Wartung planmäßig. Nagi·wa dankt den Nachtschichten." },
  { kind: "board", slot: 2, page: "automat", if: "day=1", text: "Der Nudelautomat Ecke Kowalski frisst Chits. Schon wieder.", by: "K." },
  { kind: "ad", slot: 3, page: "lull", label: "LULL // SLEEP BETTER", text: "Vier Stunden wie zehn. Jetzt gratis." },
  { kind: "live", slot: 4, page: "ninthlive", label: "NINTH LIVE // TONIGHT" });

Cutaway.act("prolog", {
  title: "Prolog", name: "Nachtschicht", room: "flat", actor: "juno",
  start: [
    { time: "21:30", day: 1 }, { set: "chits", value: 0 }, { give: "evi_bag", to: "juno" },
    { place: "juno", room: "flat", at: AF.start, face: "ne" },
    { set: "code_cam03" }, { set: "link_cam03" }, { cache: "note_kessler_photo" },
  ],
});
})();

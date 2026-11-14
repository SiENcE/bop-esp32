// Nagiwa: Chapter 2 "Aufnahme" (docs/kapitel2-design.md), on blocks: the frame so far. Three evenings on game days 5 to 7
// (Saturday 10 to Monday 12 November), the way home at the start, Teo's last visit awake on Monday, the clock that stops on
// Monday at 00:45 until everything is ready, decision 2 as far as it is built. The end: game/kapitel2_ende.js.
//   e2              Entscheidung 2: sable | vesper | morrow | lantern | kept (so far built: vesper, kept)
//   (Ines' stick, the key to her wallet, without which Lantern can't send: Juno has it (stick_ines, kept from Chapter 1), it lies in
//   dryer 6 again (stick_dryer), or Lantern has it, which needs no flag of its own: game/kapitel2_stick.js)
// (what Chapter 1 hands on: `keep` of the act, kapitel2-design §2.1)
"use strict";

(function () {
const AF = Nagiwa.at.flat, AK = Nagiwa.at.kessel_14, AJ = Nagiwa.at.jade_row, AG = Nagiwa.at.gasse;

// Saturday's evening has no card of its own: the chapter's card is it (as in Chapter 1)
Object.assign(Nagiwa.nights, {
  6: { date: "Sonntag, 11. November", evening: "Abend 2" },
  7: { date: "Montag, 12. November", evening: "Abend 3", last: true },
});

// ---- the clock: on Monday it stops at 00:45 until everything is ready (kapitel2-design §3.7): Lantern has the stick, and decision 2
// has fallen (the deck asks itself, with what can be done at the deck). Ines' flat (evi_knows) joins it when it is built.
const [STILL_THE_KEY] = Cutaway.i18n.declare("waiting", ["Ich hab noch ihren Schlüssel. Ohne den ist alles umsonst."]);
Nagiwa.holds.push((/** @type {number} */ to) => {
  const S = Cutaway.state;
  if (Cutaway.time.now.day !== 7 || S.flag("end_beat2") || !(to > Cutaway.time.parse("00:45"))) return null;
  if (S.flag("stick_ines") || S.flag("stick_dryer")) return STILL_THE_KEY;
  return S.flag("e2") ? null : { dialog: "k2_clip" };
});
// the bed opens at 01:00 on Saturday and Sunday: the clock stops there (Monday has no bed, the end comes at 01:00)
Cutaway.moment("one_sat", { room: "deck", day: 5, from: "00:45", to: "01:00", if: "~never", unseen: [] });
Cutaway.moment("one_sun", { room: "deck", day: 6, from: "00:45", to: "01:00", if: "~never", unseen: [] });

// ---- decision 2 (kapitel2-design §3.6), as far as it is built: Vesper in the chat (always there for it, also with off_vesper),
// and keeping it, which the deck asks on Monday at 00:45. Sable, Morrow and Lantern come with the main thread.
// [PLATZHALTER] the price (§14: Sable 3000, Vesper 5000) and the viewers the morning after
const CLIP_LINE = "Die Aufnahme aus CAM 31 senden.";
const SOLD_VESPER = [{ set: "e2", value: "vesper" }, { ledger: "vesper_ines", value: "sold" },
  "Fünftausend. Für das, was ich nicht verhindert hab.", { evi: "besorgt" }, { say: "evi", text: "Ist das jetzt gut?" }, "Nein."];
const KEEP = [{ set: "e2", value: "kept" }, { ledger: "cam31", value: "kept" }, "Der bleibt bei mir. Da weiß keiner was davon.", "Ich auch nicht, wenn ich ehrlich bin."];
Object.assign(Nagiwa.ledger, {
  vesper_ines: { to: "VESPER", what: { sold: "Ines Calder, CAM 31" }, chits: { sold: 5000 } },
  cam31: { to: "CAM 31", what: { kept: "behalten" } },
});
Nagiwa.replies.vesper.push({ id: "ines", text: CLIP_LINE, if: ["day>4", "cache_clip_ines_death", "!e2"], use: SOLD_VESPER });
Nagiwa.threads.vesper.push(
  { from: "vesper", if: "day>4", at: "18:05", text: "Man spricht von einer Aufnahme aus der alten Metro. Ich zahle, was sie wert ist." },
  { from: "juno", if: "e2=vesper", clip: Nagiwa.cache.clip_ines_death.name },
  { from: "vesper", if: "e2=vesper", text: "Das ist das Echteste, was ich je gesehen habe. 5000." },
);
// Monday, 00:45: the deck asks, if nothing has been decided (at most four answers)
Cutaway.dialog("k2_clip", { main: {
  enter: ["Es ist Viertel vor eins. Und der Clip ist immer noch nur bei mir.", "Was mach ich damit?"],
  choices: [
    { text: "„An Vesper verkaufen.“", silent: true, if: "cache_clip_ines_death", goto: "end", then: SOLD_VESPER },
    { text: "„Behalten.“", silent: true, goto: "end", then: KEEP },
    { text: "„Noch nicht.“", silent: true, goto: "end", then: ["Noch nicht. Noch ist Zeit."] },
  ] } });

// ---- Saturday, 18:00: Juno comes home (kapitel2-design §2.1). She couldn't stand it in the flat and walked through the Ninth, the
// night and the day, until it was evening again: a short sequence without words. [PLATZHALTER] its shots are the city's rooms for
// now, until the abstract shots are approved as blocks (neon, the crowd, the yellow coat now near, now lost, then her door)
Cutaway.sequence("k2_heimweg", {
  steps: [
    { shot: "neon" },
    { music: { stop: true, fade: 0.5 } },
    { fade: 1, ms: 0 },
    { place: "juno", room: "kowalski", at: Nagiwa.at.kowalski.fromGasse, face: "nw" },
    { goto: "kowalski", transition: false },
    { letterbox: true, ms: 0 },
    { camera: [96, 0], ms: 0 },
    { fade: 0, ms: 1200 },
    { camera: [0, 0], ms: 4000 },
    { shot: "gewuehl" },
    { place: "juno", room: "jade_row", at: AJ.far, face: "ne" },
    { goto: "jade_row", transition: "dissolve" },
    { wait: 3000 },
    { place: "juno", room: "gasse", at: AG.statue, face: "ne" },
    { goto: "gasse", transition: "dissolve" },
    { camera: [96, 56], ms: 0 },
    { camera: [60, 30], ms: 3500 },
    { shot: "tuer" },
    { place: "juno", room: "kessel_14", at: AK.door_juno, face: "nw" },
    { goto: "kessel_14", transition: "dissolve" },
    { wait: 800 },
    "Ich bin gelaufen. Irgendwann war wieder Abend.",
    { fade: 1, ms: 900 },
  ],
  after: [{ place: "juno", room: "kessel_14", at: AK.door_juno, face: "nw" }],
});
// home, and EVI does something ordinary: the fixed scene, word for word (dialog-style-guide §8, story §10b)
// (only once the act's start has put her into the flat: its `been_to` comes after the clock is set)
Cutaway.moment("heimkehr", { room: "flat", day: 5, from: "18:00", to: "18:15", if: "visited:flat", play: [
  { sequence: "k2_heimweg", restore: false },
  { letterbox: false, ms: 0 },
  { goto: "flat", at: AF.doorSide, face: "se", transition: false },
  { fade: 0, ms: 900 },
  { music: { theme: "juno", intensity: 0.2, fade: 2 } },
  { say: "evi", text: "Willkommen zurück, Juno." },
  "...",
  { say: "evi", text: "Soll ich den Monitor heller machen?" },
  "Ja.",
  { say: "evi", text: "Er ist heller." },
  "Danke.",
  { say: "evi", text: "Gern." },
] });

// ---- Monday, 18:30: Teo's last visit awake (kapitel2-design §7), on blocks. A knock wherever Juno is waiting, as on Wednesday; then
// up on to the roof, where for the first time someone sits beside her. A scene without choices: it costs the solver its moment only.
// He has a long hook from the pump hall: if the ladder still hangs up there, he pulls it down. [PLATZHALTER] his poses with the hook and
// sitting from behind (§10) are still to be drawn; the lines are the design's proposals
const T = (/** @type {string} */ text) => ({ say: "teo", text });
// while he sits beside her, the place's own memories keep quiet (only a look: no state for the solver)
Cutaway.state.view("teo_up");
const seat = Cutaway.room.get("dach_sitzen");
seat.enter = [{ if: "!teo_up", then: seat.enter }];
Cutaway.moment("teo_monday", { room: "deck", day: 7, from: "18:00", to: "18:30", if: "~never", unseen: [
  { remember_place: true },
  "Es klopft. Wie am Mittwoch.",
  { goto: "flat", at: AF.deck, face: "ne" },
  { sfx: "knock" },
  T("Ju! Ich bin's."),
  { walk: AF.doorSide },
  { face: "nw" },
  { open: "flat/door_gap" },
  { open: "flat/door_leaf", sfx: "door_open", ms: 400 },
  { place: "teo", room: "flat", at: AF.doorway, face: "se" },
  { walk: "teo", to: AF.visitTeo, free: true, wait: false },
  { walk: "juno", to: AF.visitJuno },
  { face: "nw" },
  { face: "teo", to: "se" },
  "Er sieht müder aus als am Mittwoch. Und das Pflaster blinkt.",
  { if: "k1b=sold", then: [T("Von Bao. Bao hat einen Verband. Gekocht hat er trotzdem.")], else: [T("Von Bao. Er sagt, du siehst aus, als hättest du seit Freitag nichts gegessen.")] },
  { if: "rent=teo", then: ["Die Miete. Danke.", T("Hab gesagt, sag nichts.")] },
  T("Gehen wir rauf, Ju? Wie früher."),
  "Mit was willst du an die Leiter?",
  T("Mit dem hier. Der ist aus der Pumpenhalle. Da hängt keiner dran."),
  { fade: "out", ms: 700 },
  { place: "teo", room: null },
  { close: "flat/door_leaf" },
  { close: "flat/door_gap" },
  { set: "window_open" },
  { if: "ladder_down", then: [T("Die hängt ja schon unten. Du warst ohne mich oben?"), "Einmal."],
    else: [{ set: "ladder_down" }, "Er holt die Leiter mit einer Hand runter. Wie früher."] },
  { set: "teo_up" },
  { goto: "dach_sitzen", transition: false },
  { fade: "in", ms: 900 },
  "Neben mir sitzt jemand. Zum ersten Mal seit Jahren.",
  T("Tinte sagt, ich zuck im Schlaf. Wie die anderen."),
  "Wer ist Tinte?",
  T("Die Krake im Filterbecken. Die ist älter als ich und zählt alles."),
  T("Wenn ich schlaf, ist alles still. Keine Pumpen. Keine Schulden."),
  "...",
  "Er ist an meiner Schulter eingeschlafen. Wie damals.",
  { wait: 1500 },
  T("Ich muss zur Schicht."),
  T("Schlaf du auch mal, Ju."),
  { fade: "out", ms: 700 },
  { unset: "teo_up" },
  { goto: "flat", at: AF.deck, face: "ne", transition: false },
  { fade: "in", ms: 700 },
  "Er ist weg. Die Leiter hängt jetzt unten.",
  { return_place: true },
] });

// ---- the hints (EVI): Chapter 2's own, only while it is played (game/hints.js has the prologue's and Chapter 1's)
// (waiting has no name a hint could give: on Monday the way on is waiting, then the end's click on the protocols)
const HOME = ["door", "door_juno", "stairs", "kessel_door", "deck", "back"];       // the way back to the deck
const CLIP_WAYS = ["reply_vesper_ines", "contact_vesper", "app_chat"];
Cutaway.hints([
  { if: ["day=7", "end_beat2=sent"], about: ["protokolle"],
    text: ["Du hast doch Clips mit Uhrzeit.", "Leg die Protokolle neben deine Aufnahmen.", "Nimm Kesslers Ring. Dienstag, 22:35."] },
  // the stick (game/kapitel2_stick.js): while Juno has it, Lantern can't send
  { if: "stick_ines", about: ["dryer6"],
    text: ["Du hast noch ihren Schlüssel. Der aus der Metro sucht ihn bestimmt.", "Sie hat ihn in den Trockner gelegt. Dort sucht er ihn.", "Leg ihn in Trockner sechs zurück. Um halb eins holt er ihn."] },
  { if: ["day=7", "time>=00:45", "!e2"], about: ["wait", ...CLIP_WAYS, ...HOME],
    text: ["Was machst du mit dem Clip?", "Vesper zahlt am meisten. Er ist im CHAT.", "Du kannst ihn auch behalten. Drück WARTEN, dann fragt das Deck."] },
  { if: ["day=7", "time>=00:45", "e2"], about: ["wait", "protokolle", ...HOME],
    text: ["Gleich ist es eins. Ich weiß nicht, was dann ist.", "Warten geht am Deck und in jedem Feed.", "Drück WARTEN."] },
  { if: ["day=7", "time<00:45"], about: ["wait", "protokolle", ...CLIP_WAYS, ...HOME],
    text: ["Heute Nacht passiert was. Ich weiß nur nicht, was.", "Bis Viertel vor eins musst du wissen, was mit dem Clip passiert.", "Warte bis Viertel vor eins. Oder antworte Vesper im CHAT."] },
  { if: "day<7", about: ["bed", "wait", "close", ...CLIP_WAYS, ...HOME],
    text: ["Was machst du mit dem Clip?", "Vesper will ihn. Er ist im CHAT. Oder du behältst ihn noch.", "Warte bis eins und geh ins Bett. Dann ist der nächste Abend."] },
], { act: "kapitel2" });

// ---- the act. It begins from a clean state, whichever way: what Chapter 1 hands on comes along in `keep` (kapitel2-design §2.1),
// and from the title screen it stands on the plain way through Chapter 1 (WREN told, the stick put back, the rent paid, no jobs)
const KEPT_LEDGER = Object.keys(Nagiwa.ledger).filter((id) => !["vesper_ines", "cam31"].includes(id)).map((id) => `ledger_${id}`);
Cutaway.act("kapitel2", {
  title: "Kapitel 2", name: "Aufnahme", room: "flat", actor: "juno", fresh: true,
  keep: ["e1", "stick_ines", "k1a", "k1b", "imai_told", "moth_student", "rent", "chits", "evi_trust", ...KEPT_LEDGER,
    "cache_clip_ines_death", "cache_clip_kessler_ring", "cache_clip_kessler_cut", "cache_clip_morrow_bribe", "cache_clip_traeger",
    "anon_clip_kessler_ring", "anon_clip_morrow_bribe", "anon_clip_traeger",
    "got_ausweis", "got_haken", "window_open", "ladder_down", "link_cam14", "link_cam15", "link_cam07v"],
  // left behind on purpose (the tools check it, sh tools/handoff.sh): what Chapter 1 needed only for itself, or what follows from the rest
  leave: ["know_meeting", "end_beat", "kessler_gone", "imai_step", "traeger"],
  start: [
    { time: "18:00", day: 5 }, { give: "evi_bag", to: "juno" },
    // (the Kassenbuch's entries pay as they are written: the money as it stands at the end of that way comes after them)
    { if: "!e1", then: [{ set: "e1", value: "sold" }, { set: "rent", value: "paid" },
      { ledger: "kessler", value: "full" }, { ledger: "wren_advance", value: "paid" }, { ledger: "wren", value: "sold" }, { ledger: "wren_live", value: "paid" }, { ledger: "ines", value: "dead" },
      { set: "chits", value: 1550 }, { set: "cache_clip_kessler_ring" }, { set: "cache_clip_ines_death" }] },
    // what Frau Kessler got on Tuesday: the prologue's answer, which the flat's door, the chat and Sable's contact read, is the Kassenbuch's
    // line kept from it (the same values), so it needs no flag of its own across the chapter line
    ...["full", "cut", "nothing"].map((v) => ({ if: `ledger_kessler=${v}`, then: [{ set: "p1", value: v }] })),
    // what she has in her bag (a stick left in the dryer Lantern took on Friday night, kapitel2-design §3.1)
    { if: "got_ausweis", then: [{ give: "ausweis" }] }, { if: "got_haken", then: [{ give: "haken" }] },
    { if: "stick_ines", then: [{ give: "stick" }] },
    { place: "juno", room: "flat", at: AF.doorSide, face: "se" },
    // Juno's old access, Ines' way and CAM 04, whose code she has known since Tuesday
    ...["cam03", "cam04", "cam07", "cam18", "cam21", "cam22", "cam23", "cam24", "cam30"].flatMap((c) => [{ set: `code_${c}` }, { set: `link_${c}` }]),
    { cache: "note_kessler_photo" }, { cache: "note_obs_handbook" },
    { set: "know_ines" }, { set: "saw_varga" }, { set: "read_kessler" },
    { set: "fridge_empty" }, { set: "rent_notice" }, { set: "moth_met" }, { set: "bao_soup" },
    { been_to: ["flat", "deck", "kessel_14", "kessel_lobby", "kowalski", "gasse", "laundromat", "sims", "dach", "dach_blick", "dach_sitzen", "lucky_static", "jade_row", "okonkwo_shop", "drain_market", "sable_booth", "cam15", "signal_lost", "flat_danach", "cam03", "cam04", "cam07", "cam07v", "cam14", "cam18", "cam21", "cam22", "cam23", "cam24", "cam30", "cam31"] },
    { solo: true },
  ],
});
})();

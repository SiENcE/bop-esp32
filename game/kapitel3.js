// Nagiwa: Chapter 3 "Lull" (docs/kapitel3-design.md): the frame, step H6.1 of docs/PLAN.md. Two evenings on game days 8 and 9
// (Tuesday 13 and Wednesday 14 November); Teo already lies on the station. What there is so far: the act with what Chapter 2 hands on
// (§2.1), the start (the card, the line on black, CIVIC REST in the CHAT, EVI), the bed on Tuesday from 01:00, and on Wednesday night
// a stand-in for the end that is still to come (the dream, decision 3, the raid and the fire: H6.5 to H6.7).
// No flag of its own yet.
"use strict";

(function () {
const AF = Nagiwa.at.flat;

// Tuesday has no card of its own (the chapter's card is it); Wednesday is the last evening: nobody sleeps through it (the raid comes then)
Object.assign(Nagiwa.nights, {
  9: { date: "Mittwoch, 14. November", evening: "Abend 2", last: true, passes: [] },
});
// the bed opens at 01:00 on Tuesday: the clock stops there
Cutaway.moment("one_tue", { room: "deck", day: 8, from: "00:45", to: "01:00", if: "~never", unseen: [] });

// ---- Tuesday, 18:00 (§2.1): what happened in the night, on black; then the deck, Civic Rest's message, and EVI does something
// ordinary that lands differently (dialog-style-guide §8)
Cutaway.moment("k3_anfang", { room: "flat", day: 8, from: "18:00", to: "18:15", if: "visited:flat", play: [
  { fade: "out", ms: 0 },
  { letterbox: false, ms: 0 },
  "Um vier stand ich am Tor vom Flutwerk. Keiner hat aufgemacht.",
  { wait: 900 },
  { goto: "flat", at: AF.deck, face: "ne", transition: false },
  { fade: "in", ms: 1200 },
  { notify: "civic_rest" },
  { wait: 900 },
  { say: "evi", text: "Teos Status hat sich seit gestern nicht geändert." },
  "Ich weiß.",
  { say: "evi", text: "Soll ich dir Bescheid sagen, wenn er sich ändert?" },
  "...",
  "Ja.",
] });

// CIVIC REST: Nagi·wa's voice, always kind, always formal, saying nothing (dialog-style-guide §6); no answer goes through
Object.assign(Nagiwa.contacts, { civic_rest: { name: "CIVIC REST", color: "#e8f0ff", status: "online", if: "day>7", unread: "!read_civic_rest",
  open: [{ if: "!read_civic_rest", then: [{ set: "read_civic_rest" }, "Station 5-Mitte. Ruhe-Erschöpfung.", "Und antworten kann man nicht. Da steht NICHT ZUSTELLBAR."] }] } });
Cutaway.state.view("read_civic_rest");
Nagiwa.threads.civic_rest = [
  { from: "civic_rest", if: "day>7", at: "05:40", text: "Ihr Angehöriger TEO REYES wurde heute um 05:40 wegen Ruhe-Erschöpfung in die Obhut von Civic Rest übernommen." },
  { from: "civic_rest", if: "day>7", at: "05:40", text: "Station 5-Mitte. Besuche sind derzeit nicht vorgesehen. Wir benachrichtigen Sie." },
  { from: "civic_rest", if: "day>7", text: "NICHT ZUSTELLBAR" },
];

// ---- Wednesday night: a stand-in for what comes (the second dream night, decision 3, the raid and the fire, H6.6 and H6.7). Never
// watched: it happens as its window ends, as Chapter 2's end does
Cutaway.moment("k3_platzhalter", { room: "deck", day: 9, from: "00:45", to: "01:00", if: "~never", unseen: [
  "Die warten, bis ich schlafe.",
  { fade: "out", ms: 1500 },
  { end: "Kapitel 3: Lull (wird gebaut)" },
] });

// ---- hints (EVI's), so far only the clock: every state on the way needs one
const HOME = ["door", "door_juno", "stairs", "kessel_door", "deck", "back"];       // the way back to the deck
Cutaway.hints([
  { if: ["day=8", "time>=01:00"], about: ["bed", "close", ...HOME],
    text: ["Es ist spät. Du hast seit gestern nicht geschlafen.", "Das Bett ist ab eins offen.", "Geh ins Bett."] },
  { if: "day=8", about: ["wait", "bed", "close", ...HOME],
    text: ["Teo liegt auf der Station. Besuchen darf man nicht.", "Heute Nacht passiert hier nichts mehr.", "Warte bis eins und geh ins Bett."] },
  { if: "day=9",                                   // only the clock is left: no `about` (the solver's waits have no id)
    text: ["Die in Weiß sind jetzt im Haus.", "Heute Nacht passiert etwas.", "Warte bis Mitternacht."] },
], { act: "kapitel3" });

// ---- the act. It begins from a clean state, whichever way: what Chapter 2 hands on comes along in `keep` (§2.1), and from the title
// screen it stands on the plain way through Chapter 2 (its main click path: the clip sold to Vesper) and through Chapter 1 before it
const CLIPS = Object.keys(Nagiwa.cache).filter((id) => id.startsWith("clip_"));
Cutaway.act("kapitel3", {
  title: "Kapitel 3", name: "Lull", room: "flat", actor: "juno", fresh: true,
  // what this chapter reads, what only passes through for Chapter 4 (forgery_proven, k1b), and the Kassenbuch with the clips
  keep: ["e2", "lantern_found", "led_quiet", "moth_student", "teo_talk", "evi_trust", "chits", "forgery_proven", "k1b",
    ...Object.keys(Nagiwa.ledger).map((id) => `ledger_${id}`), ...CLIPS.map((id) => `cache_${id}`),
    "anon_clip_kessler_ring", "anon_clip_morrow_bribe", "anon_clip_traeger",          // the clips the editor can anonymise (only while Vesper buys)
    "got_ausweis", "got_haken"],
  // left behind on purpose (sh tools/handoff.sh): Tinte opens CAM 33 to everyone here, and the flight is a chain that needs neither
  leave: ["link_cam33", "window_open", "ladder_down"],
  start: [
    { time: "18:00", day: 8 }, { give: "evi_bag", to: "juno" },
    // (the Kassenbuch's entries pay as they are written: the money as it stands at the end of that way comes after them)
    { if: "!e2", then: [{ set: "e2", value: "vesper" }, { set: "teo_talk", value: "papa" },
      { ledger: "kessler", value: "full" }, { ledger: "wren_advance", value: "paid" }, { ledger: "wren", value: "sold" }, { ledger: "wren_live", value: "paid" }, { ledger: "ines", value: "dead" },
      { ledger: "vesper_ines", value: "sold" },
      { set: "chits", value: 6550 }, { set: "cache_clip_kessler_ring" }, { set: "cache_clip_ines_death" }] },
    // the prologue's answer, which the flat's door, the chat and Sable's contact read, from the Kassenbuch's line (as Chapter 2's start):
    // without it the door holds her in the flat ("Erst kommt der Auftrag")
    ...["full", "cut", "nothing"].map((v) => ({ if: `ledger_kessler=${v}`, then: [{ set: "p1", value: v }] })),
    { if: "got_ausweis", then: [{ give: "ausweis" }] }, { if: "got_haken", then: [{ give: "haken" }] },
    { place: "juno", room: "flat", at: AF.deck, face: "ne" },
    // Juno's old access and the codes she has had since Chapter 1 and 2
    ...["cam03", "cam04", "cam07", "cam18", "cam21", "cam22", "cam23", "cam24", "cam25", "cam30"].flatMap((c) => [{ set: `code_${c}` }, { set: `link_${c}` }]),
    { cache: "note_kessler_photo" }, { cache: "note_obs_handbook" },
    { set: "know_ines" }, { set: "saw_varga" }, { set: "read_kessler" },
    { set: "fridge_empty" }, { set: "rent_notice" }, { set: "moth_met" }, { set: "bao_soup" },
    // the rooms she knows: nobody asks whether she has been there, and each would double its states
    { been_to: ["flat", "deck", "kessel_14", "kessel_lobby", "kowalski", "gasse", "laundromat", "sims", "dach", "dach_blick", "dach_sitzen", "lucky_static", "jade_row", "okonkwo_shop", "drain_market", "sable_booth", "cam15", "signal_lost", "flat_danach", "cam03", "cam04", "cam07", "cam07v", "cam14", "cam18", "cam21", "cam22", "cam23", "cam24", "cam25", "cam30", "cam31", "sumpf", "sumpf_fahrt", "lantern_versteck", "drain_arrival", "weg1", "lerche_eg", "shop24", "lerche_flur", "klinik", "sump_runner", "cam26", "funk", "k2_protokolle"] },
    { solo: true },
  ],
});
})();

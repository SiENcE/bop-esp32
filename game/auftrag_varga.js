// Nagiwa: job A of Chapter 1, "Der verschwundene Schuldner" (docs/kapitel1-design.md §3). Varga wants Kessler found.
// Kessler has gone under, but he can't leave his noodles: at 22:15 someone with a hood draws number 7 on cam03, at 22:30 he crawls
// into capsule 23 of the Morpheus (cam15, its code from Sable). Then K1a: sell him, lie, or warn him on his capsule's screen.
//   varga_step    1: Juno has recognised him and knows about the Morpheus (nothing asks whether she took the job: finding him is enough)
//   k1a           sold | lied | warned
//   kessler_gone  he no longer comes: warned at once, sold from the next evening (Varga's people have been; on Friday that is Chapter 2)
// A thread of its own (off_varga, CLAUDE.md, checks); what it shares with the others is only money.
"use strict";

(function () {
const A3 = Nagiwa.at.cam03, A15 = Nagiwa.at.cam15;
/** Kessler with the hood up (art/characters/feed_people.px.js): each facing drawn, so the engine never mirrors his light @param {string} p */
const HOOD = (p) => ({ se: `${p}se`, sw: `${p}sw`, ne: `${p}ne`, nw: `${p}nw` });

// ---- who he is now: a person of his own, so the prologue's Kessler keeps his scarf
const RECOGNISED = [{ zoom: "zoom_vending_n7" }, "Er zieht die Sieben, Huhn scharf.", "Er trägt jetzt eine Kapuze statt dem Schal. Aber die Nudeln kann er nicht lassen.", { zoom: false },
  "An seinem Finger ist ein heller Streifen. Da war mal ein Ring.", { tag: "kessler2" }, { set: "varga_step", value: 1 }, "Ich hab dich, Herr Kessler.",
  "Er geht nicht heim. Er geht zum Morpheus, dem Kapselhotel. Das ist jetzt auf der Karte."];
const CAPSULE = ["Er kriecht in eine Kapsel. Die Nummer ...", "Dreiundzwanzig.", { cache: "note_kessler_hideout" }, "Die Kapsel ist achtzig Zentimeter hoch, und da wohnt er jetzt."];
Nagiwa.people.kessler2 = { name: "KESSLER", known: "varga_step", label: "Jemand mit Kapuze", speaker: "Kessler" };
Cutaway.actor("kessler2", { name: "Jemand mit Kapuze", color: "#b8c890",
  costume: { idle: HOOD("kessler_hood_feed_"), walk: HOOD("kessler_hood_feed_walk_"), talk: HOOD("kessler_hood_feed_") }, speed: [14, 10], voice: { pitch: 50, wave: "square", syllable: 80 },
  look: [{ if: "at:kessler2=cam15", then: ["Er sieht sich nicht um. Er weiß, wo er hinwill."],
    else: [{ if: "varga_step", then: ["Das ist Kessler. Ohne den Schal sieht er kleiner aus."], else: ["Da kommt einer mit Kapuze, allein, jetzt, wo alle weg sind. Er will zum Automaten."] }] }],
  talk: [{ if: "at:kessler2=cam15", then: [{ if: "cache_note_kessler_hideout", then: ["Er ist in Kapsel 23. Das weiß ich schon."], else: CAPSULE }],
    else: [{ if: "varga_step", then: ["Den hab ich."], else: RECOGNISED }] }] });
Cutaway.routine("kessler2", [
  { day: [2, 3, 4], from: "22:15", to: "22:30", if: ["!off_varga", "!kessler_gone"], room: "cam03", at: A3.exitFar, path: [A3.exitFar, A3.vendingSpot, A3.exitRight] },
  { day: [2, 3, 4], from: "22:30", to: "22:45", if: ["!off_varga", "!kessler_gone"], room: "cam15", at: A15.door, path: [A15.door, A15.spot], once: true },   // in at the door, along the wall to 23, and he stays
]);

// ---- cam03: he has stopped coming to work; the machine is the one thing he still comes for
const cam03 = Cutaway.room.get("cam03").hotspots;
const vendingUse = cam03.vending.use, officeLook = cam03.office.look;
cam03.vending.use = [{ if: ["at:kessler2=cam03", "!varga_step"], then: RECOGNISED, else: vendingUse }];
cam03.office.look = [{ if: "day>1", then: ["Das ist die Pumpenverwaltung. Kessler kommt hier nicht mehr hin."], else: [officeLook] }];
const streetVending = Cutaway.room.get("kowalski").hotspots.vending;
streetVending.look = [...streetVending.look, { if: "day>1", then: ["Da war die Nummer 7 drin."] }];

// ---- cam15, the Morpheus. Its own net: no sticker, no factory code. Whoever sells access has it.
Nagiwa.cams.cam15 = { id: "15", place: "KAPSELHOTEL MORPHEUS", owner: "MORPHEUS, PRIVAT", map: [8, 62], if: { or: [["day>4", "link_cam15"], ["day<5", "varga_step"]] },
  tryIt: ["Das Morpheus hat ein eigenes Netz, ohne Aufkleber und ohne Werkscode.", "Zugänge verkauft Sable."],
  linked: ["Sables Code geht."] };
Nagiwa.cache.note_kessler_hideout = { kind: "note", name: "KESSLER, KAPSEL 23", about: "Kapselhotel Morpheus, Kapsel 23. Er kommt um halb elf, ohne Schal." };
Nagiwa.camRoom("cam15", { background: "cam15_bg", mic: { at: A15.mic, clear: 40, lost: 150 }, hotspots: {
  capsules: { name: "Kapseln", poly: A15.capsulesPoly, look: ["Da sind zwei Reihen Kapseln. Hier schläft, wer nicht gefunden werden will.", "Oder wer sich nichts anderes leisten kann."] },
  kapsel23: { name: "Kapsel 23", poly: A15.c23Poly, if: "cache_note_kessler_hideout",
    look: [{ if: "kessler_gone", then: [{ if: "k1a=sold", then: ["Kapsel 23 steht offen. Auf dem Boden liegt eine zerbrochene Brille."], else: ["Kapsel 23 ist leer. Auf dem Bildschirm steht noch meine Zeile."] }], else: ["Das ist Kapsel 23.", "Jede Kapsel hat einen Bildschirm, und das Hotel schreibt drauf, wann man raus muss."] }],
    use: [{ if: "!k1a", then: ["Das Hotelnetz kann auf jeden Bildschirm schreiben. Ich jetzt auch.", { dialog: "k1a_warn" }], else: ["Das ist erledigt."] }] },
  rewind: { name: "Puffer", z: 5, if: ["time>=22:45", "!cache_note_kessler_hideout", "!kessler_gone"], use: [{ rewind: "22:30" }, { walk: "kessler2", to: A15.spot, free: true }, ...CAPSULE, { live: true }] },   // (the buffer rewound: game/puffer.js)
} });
Cutaway.dialog("k1a_warn", { main: { choices: [
  { text: "„Varga sucht dich. Geh.“ schreiben.", silent: true, goto: "end", then: [{ set: "k1a", value: "warned" }, { ledger: "kessler_warn", value: "warned" }, { set: "kessler_gone" },
    "Jetzt steht eine Zeile zwanzig Zentimeter über seinem Gesicht.", { evi: "verwirrt" }, { say: "evi", text: "Er kennt seine Kapsel doch. Warum schreibst du ihm?" }, "Weiß ich nicht."] },
  { text: "Noch nicht.", silent: true, goto: "end" },
] } });

// ---- Sable sells CAM 15's code (her booth and her talk: game/sable.js)

// ---- the chat: what Varga wrote, what Juno can send (the place she found is her only way in: nothing to accept first)
Object.assign(Nagiwa.contacts, { varga: { name: "G. VARGA", color: "#a0a0b8", status: "online", if: ["day>1", "day<5", "!off_varga"], unread: "!read_varga",
  open: [{ if: "!read_varga", then: [{ set: "read_varga" }, "Den Rest kriegt er von Kessler nicht. Also soll ich ihn suchen."] }] } });
Cutaway.state.view("read_varga");
Nagiwa.threads.varga = [
  { from: "varga", at: "18:05", text: "Du warst bei Yuen's. Ich hab dich nicht gesehen, aber ich weiß, wie das läuft." },
  { from: "varga", at: "18:05", text: "Kessler ist weg. Finde ihn. 400." },
  { from: "varga", if: "ledger_sable_kessler=sold", at: "18:06", text: "Sable sagt, du bist gut." },
  { from: "varga", if: ["day=4", "!k1a"], at: "18:00", text: "Freitag ist heute." },
  { from: "juno", if: "k1a=sold", text: "Kapselhotel Morpheus. Kapsel 23." },
  { from: "varga", if: "k1a=sold", text: "Gut. 400." },
  { from: "juno", if: "k1a=lied", text: "Pfandhaus am Fischmarkt. Hinterzimmer." },
  { from: "varga", if: "k1a=lied", text: "200 jetzt. Den Rest, wenn ich ihn hab." },
];
Nagiwa.replies.varga = [
  { id: "sold", text: "Kapsel 23 senden.", if: ["cache_note_kessler_hideout", "!k1a"],
    use: [{ set: "k1a", value: "sold" }, { ledger: "varga", value: "sold" }, "Das sind vierhundert Chits für eine Zahl.", { evi: "froh" }, { say: "evi", text: "Er ist gefunden! Freut sich Frau Kessler jetzt?" }] },
  { id: "lied", text: "Einen falschen Ort senden.", if: ["cache_note_kessler_hideout", "!k1a"],
    use: [{ set: "k1a", value: "lied" }, { ledger: "varga", value: "lied" }, "Das Geld will er wiederhaben. Das Problem hab ich dann später.", { evi: "verwirrt" }, { say: "evi", text: "Da ist er aber nicht. Hast du dich vertippt?" }, "Nein."] },
];
Object.assign(Nagiwa.ledger, {
  varga: { to: "G. VARGA", what: { sold: "Kessler, Kapsel 23", lied: "ein falscher Ort (geliehen)" }, chits: { sold: 400, lied: 200 } },
  kessler_warn: { to: "KESSLER", what: { warned: "gewarnt" } },
});

// sold: Varga's people come the night after (the next evening's capsule stands open)
const TAKEN = { if: "k1a=sold", then: [{ set: "kessler_gone" }] };
(Nagiwa.nights[3].passes ??= []).push(TAKEN);
Nagiwa.nights[4].passes.unshift(TAKEN);
})();

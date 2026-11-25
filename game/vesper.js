// Nagiwa: Vesper (docs/kapitel1-design.md §7, story §9 "Elendstourismus"), a buyer for NINTH LIVE, who from Thursday pays twice what Sable
// pays for every raw clip; what Juno sells him runs in the Crown as entertainment, and overnight the Kassenbuch learns how many watched it.
// Anonymising in the clip editor (from Chapter 1) blurs every face in Juno's copy, and Vesper doesn't take it: "Ohne Gesichter ist es kein Leben."
//   ledger_vesper_<clip>   sold, then seen (overnight: the viewers are in)     anon_<cache id>   the clip's faces are blurred, for good
// A thread of its own (off_vesper): what it reads of the others is only whether their clip is in the CACHE (Morrow's envelope from job B,
// the white carriers); nothing of theirs reads it. Optional, never needed.
"use strict";

(function () {
const SOLD = (/** @type {string} */ id) => `ledger_vesper_${id}`;

// the clips Vesper buys, each with what Juno says when it goes, and what the Kassenbuch knows the morning after
/** @type {[string, string, string, string, number, string, string, any[]][]} */
const CLIPS = [
  ["ring", "clip_kessler_ring", "Kesslers Ring senden.", "Kesslers Ring", 240, "31.200", "Ring",
    ["Das sind zweihundertvierzig für einen Mann, der seinen Ring hergibt.", { evi: "neugierig" }, { say: "evi", text: "Wer guckt sich das an?" }, "Die oben, beim Abendessen."]],
  ["morrow", "clip_morrow_bribe", "Morrows Umschlag senden.", "Morrows Umschlag", 300, "88.400", "Morrow",
    ["Das sind dreihundert. Und Morrow weiß nicht mal, dass sie oben läuft.", { evi: "neugierig" }, { say: "evi", text: "Ist sie jetzt berühmt?" }, "So ähnlich."]],
  ["traeger", "clip_traeger", "Die weißen Träger senden.", "Die weißen Träger", 400, "412.000", "Träger",
    ["Das sind vierhundert.", "...", { evi: "besorgt" }, { say: "evi", text: "Das Mädchen weiß das nicht, oder?" }, "Nein."]],
];
const THANKS = { ring: "Wie er den Ring abzieht! Und dieser Blick. 240.", morrow: "Eine Polizistin, die nimmt! Oben glaubt uns das keiner. 300.",
  traeger: "Das Mädchen in der Tür. Ich musste kurz rausgehen. 400." };

Object.assign(Nagiwa.contacts, { vesper: { name: "VESPER", color: "#d0c0f8", status: "online", if: { or: [["day>2", "day<5", "!off_vesper"], "day>4"] }, unread: ["!read_vesper", "day<8"],
  open: [{ if: "!read_vesper", then: [{ set: "read_vesper" }, "Das ist NINTH LIVE. Die zeigen uns da oben im Abendprogramm.",
    { evi: "froh" }, { say: "evi", text: "Ich kann Gesichter wegmachen! Im Clip-Editor." }, "Dann kauft er's nicht.", { evi: "verwirrt" }, { say: "evi", text: "Oh." }] }] } });
Cutaway.state.view("read_vesper");
Nagiwa.threads.vesper = [
  { from: "vesper", at: "18:10", text: "Guten Abend. Ich höre, Sie haben ein Auge für das Echte." },
  { from: "vesper", at: "18:10", text: "Ich zahle das Doppelte von Sable. Für jeden rohen Clip." },
  { from: "vesper", at: "18:11", text: "Nur roh, bitte. Ohne Gesichter ist es kein Leben." },
  ...CLIPS.flatMap(([id, clip]) => [{ from: "juno", if: SOLD(id), clip: Nagiwa.cache[clip].name }, { from: "vesper", if: SOLD(id), text: THANKS[/** @type {keyof typeof THANKS} */ (id)] }]),
  ...CLIPS.map(([id, , , what, , viewers]) => ({ from: "vesper", if: `${SOLD(id)}=seen`, at: "18:00", text: `${what}: ${viewers} Zuschauer gestern Nacht. Die Krone dankt Ihnen.` })),
];
Nagiwa.replies.vesper = CLIPS.map(([id, clip, text, , , , , said]) => ({ id, text, if: ["day<5", `cache_${clip}`, `!anon_${clip}`, `!${SOLD(id)}`],
  use: [{ ledger: `vesper_${id}`, value: "sold" }, ...said] }));
for (const [id, , , what, pay, viewers, short] of CLIPS) {
  // the morning after, the line says who watched (short, to fit the book's line)
  Nagiwa.ledger[`vesper_${id}`] = { to: "VESPER", what: { sold: `${what}, roh`, seen: `${short}, ${viewers} sahen zu` }, chits: { sold: pay, seen: pay } };
  // the viewers come in overnight (only Thursday's sales: the chapter ends on Friday night)
  (Nagiwa.nights[4].passes ??= []).push({ if: `${SOLD(id)}=sold`, then: [{ set: SOLD(id), value: "seen" }] });
}

// ---- anonymising (kapitel0-design §2.4): the tool wakes in Chapter 1, and only while Vesper's thread is open, so that the main thread's
// states don't double with every clip. Every clip Vesper would buy can be blurred; then he won't.
const ANON = { if: ["day>1", "day<8", "!off_vesper"], then: ["Die Gesichter sind weg. Jetzt sind es nur noch Leute.", { evi: "froh" }, { say: "evi", text: "Jetzt erkennt sie keiner!" }] };
Nagiwa.clips.clip_kessler_ring.anon = ANON;
Object.assign(Nagiwa.people, { morrow: { name: "MORROW" }, tide_boy: { name: "TIDEWATER" }, traeger_weiss: { name: "IN WEISS" }, traeger_kind: { name: "MÄDCHEN" } });
Nagiwa.clips.clip_morrow_bribe = { cam: "cam07", hour: 0, from: 30, to: 31.5, anon: ANON,
  moments: [[30, 30.6, "WAGEN"], [30.6, 31.1, "UMSCHLAG"], [31.1, 31.5, "FREITAG"]], people: [["morrow", 30.2, 31.5], ["tide_boy", 30, 31.2]] };
Nagiwa.clips.clip_traeger = { where: "KOWALSKI-STRASSE", hour: 23, from: 30, to: 34, anon: ANON,
  moments: [[30, 31, "WAGEN"], [31, 33, "TRAGEN"], [33, 34, "ROLLOS"]], people: [["traeger_weiss", 30.5, 33.5], ["traeger_kind", 30, 34]] };
})();

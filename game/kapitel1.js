// Halcyon: Chapter 1 "Glass" (docs/kapitel1-design.md). So far its frame only, with no art: three evenings on
// game days 2 to 4 (Wednesday to Friday), sleeping, WREN's money, the rent and the end. What the chain will set
// (know_meeting, the link to cam31), two replies marked [MOCK] set for now.
//   e1                    Entscheidung 1: sold | refused
//   rent                  paid | teo (Teo paid it)
//   know_meeting          Juno knows where and when Ines meets someone
//   bed_closed            on Friday there is no sleeping
// (the flags from the prologue the chapter carries over: `keep` of the act)
"use strict";

(function () {
const AF = Halcyon.at.flat;

Halcyon.nights = {
  3: { date: "Donnerstag, 8. November", evening: "Abend 2" },
  4: { date: "Freitag, 9. November", evening: "Abend 3" },
};

// ---- the clock: it stops at 22:45 on Friday until cam31 is linked, and at 22:55 until Juno is watching it
const [NOT_YET, WATCH_IT] = Cutaway.i18n.declare("waiting", ["Erst muss ich da reinkommen.", "Gleich. Ich muss auf CAM 31 sein."]);
Cutaway.time.hold((/** @type {number} */ to) => {
  if (Cutaway.time.now.day !== 4) return null;
  if (to > Cutaway.time.parse("22:45") && !Cutaway.state.flag("link_cam31")) return NOT_YET;
  return to > Cutaway.time.parse("22:55") ? WATCH_IT : null;
});

// ---- Friday's times. These moments are never watched: each happens as its window ends, wherever Juno is. The
// window is the 15-minute tick before it, so the clock stops there too and Juno sees it coming
const AT = (/** @type {string} */ id, /** @type {string} */ from, /** @type {string} */ to, /** @type {any[]} */ unseen) =>
  Cutaway.moment(id, { room: "deck", day: 4, from, to, if: "~never", unseen });

AT("wren_deadline", "21:45", "22:00", [{ if: "!e1", then: [{ set: "e1", value: "refused" }, { ledger: "wren", value: "refused" }, { notify: "wren" }] }]);
AT("rent_due", "22:15", "22:30", [{
  if: "chits>=900",
  then: [{ inc: "chits", by: -900 }, { set: "rent", value: "paid" }, "Die Miete ist abgebucht. Neunhundert Chits."],
  else: [{ set: "chits", value: 0 }, { set: "rent", value: "teo" }, { notify: "teo" }, "Das Konto ist leer. Und die Miete ist trotzdem bezahlt.", "Teo."],
}]);
AT("friday_stop", "22:30", "22:45", []);

// ---- the end, a placeholder for the scene (kapitel1-design §8)
Halcyon.cams.cam31 = { id: "31", place: "ALTE METRO, LINIE 31", owner: "UNBEKANNT", map: [120, 96], if: "know_meeting" };
Cutaway.moment("ines_meeting", {
  room: "cam31", day: 4, from: "22:55", to: "23:30",
  play: [
    "[MOCK] 22:55. Hier spielt die Szene aus dem Design: Ines, Lantern, Ashe.",
    { if: "e1=sold", then: [{ ledger: "wren_live", value: "paid" }, "Zahlung erfolgt. Danke für die Live-Übertragung."] },
    { fade: "out", ms: 900 },
    { end: "Hier endet Kapitel 1. Kapitel 2 kommt später." },
  ],
});

// ---- WREN and the rest of the chat
Object.assign(Halcyon.ledger, {
  wren_advance: { to: "WREN", what: { paid: "der Vorschuss", back: "der Vorschuss, zurückgeschickt" }, chits: { paid: 250 } },
  wren: { to: "WREN", what: { sold: "Ines Calder, Metro 31, Fr 23:00", sold_back: "Ines Calder, Metro 31, Fr 23:00", refused: "nichts geliefert" }, chits: { sold: 1250, sold_back: 1500 } },
  wren_live: { to: "WREN", what: { paid: "die Live-Übertragung" }, chits: { paid: 750 } },
});
Object.assign(Halcyon.contacts, {
  wren: { name: "WREN", color: "#d0d8f0", status: "online", if: "day>1", unread: "!read_wren",
    open: [{ if: "!read_wren", then: [{ set: "read_wren" }, "Wer bezahlt im Voraus? Niemand bezahlt im Voraus."] }] },
});
// who has been read only shows as a dot: no state for the solver (conventions: view flags)
Cutaway.state.view("read_wren", "read_kessler_again");
Halcyon.threads.wren = [
  { from: "wren", at: "18:02", text: "Dr. Ines Calder, Lull-Klinik 9-Ost. Wir wollen wissen, wen sie trifft und wo. 1500, davon 250 jetzt. Diskretion." },
  { from: "wren", at: "18:02", photo: "FOTO INES CALDER", text: "250 Chits überwiesen." },
  { from: "juno", if: "ledger_wren_advance=back", text: "Die 250 zurück. Von Leuten ohne Namen nehm ich nichts." },
  { from: "wren", if: "ledger_wren_advance=back", text: "Wie Sie wollen. Das Angebot bleibt." },
  { from: "wren", if: "day=4", at: "18:00", text: "Bis 22 Uhr. Wo und wann." },
  { from: "juno", if: "e1=sold", text: "Alte Metro, Linie 31. Freitag, 23:00." },
  { from: "wren", if: "e1=sold", text: "Danke. Und schauen Sie heute Nacht zu. Für die Live-Übertragung zahlen wir 750 extra." },
  { from: "wren", if: "e1=refused", text: "Schade. Es gibt andere Glasser." },
];
Halcyon.replies.wren = [
  { id: "back", text: "Die 250 zurückschicken.", if: ["ledger_wren_advance=paid", "!e1", "chits>=250"],
    use: [{ inc: "chits", by: -250 }, { ledger: "wren_advance", value: "back" }, "Soll keiner sagen, ich wär billig."] },
  { id: "send", text: "Den Ort senden.", if: ["know_meeting", "!e1"],
    use: [{ set: "e1", value: "sold" }, { if: "ledger_wren_advance=back", then: [{ ledger: "wren", value: "sold_back" }], else: [{ ledger: "wren", value: "sold" }] },
      "Ein Satz. Mehr war's nicht.", { evi: "froh" }, { say: "evi", text: "Geld! Wir können die Miete zahlen!" }] },
  { id: "refuse", text: "Nichts senden.", if: ["know_meeting", "!e1"],
    use: [{ set: "e1", value: "refused" }, { ledger: "wren", value: "refused" }, "Die müssen sich jemand anderen suchen.",
      { evi: "verwirrt" }, { say: "evi", text: "Das war viel Geld. Warum ist das gut?" }] },
  // the mock's stand-ins for chain C (kapitel1-design §6), gone once it is built
  { id: "mock_know", text: "[MOCK] Treffpunkt kennen", if: "!know_meeting", use: [{ set: "know_meeting" }, "[MOCK] Stick und Ticket gefunden."] },
  { id: "mock_link", text: "[MOCK] CAM 31 verbinden", if: ["know_meeting", "!link_cam31"], use: [{ set: "code_cam31" }, { set: "link_cam31" }, "[MOCK] Das alte Protokoll. Das kann nur noch mein Kopf."] },
];
// Frau Kessler picks up the prologue (kapitel1-design §7); Teo, if the rent wasn't there
Halcyon.threads.kessler.push(
  { from: "kessler", if: ["day>1", "p1=full"], at: "18:10", text: "Er ist nicht heimgekommen. Schulden, haben Sie geschrieben. Wo ist er?" },
  { from: "kessler", if: ["day>1", "p1=cut"], at: "18:10", text: "Er ist nicht heimgekommen. Zu ihr, nehme ich an." },
  { from: "kessler", if: ["day>1", "p1=nothing"], at: "18:10", text: "Er ist nicht heimgekommen. Sie haben wirklich nichts gefunden?" },
);
Halcyon.threads.teo.push(
  { from: "teo", if: "rent=teo", at: "22:30", text: "Hab gehört, die Miete. Ich hab Schichten gemacht. Schon überwiesen. Sag nichts." },
);

Halcyon.camRoom("cam31", { background: undefined, color: "#071514", mic: { at: [160, 90], clear: 40, lost: 150 }, hotspots: {} });

// ---- the act. It begins from a clean state, whichever way: what the prologue leaves comes along in `keep`,
// and from the title screen it stands on the plain way through (the whole clip to Frau Kessler)
Cutaway.act("kapitel1", {
  title: "Kapitel 1", name: "Glass", room: "flat", actor: "juno", fresh: true,
  keep: ["p1", "chits", "ledger_kessler", "ledger_sable_kessler", "moth_kind", "moth_brushed", "bao_paid", "evi_trust",
    "cache_clip_kessler_ring", "cache_clip_kessler_cut", "cache_note_kessler_debt"],
  start: [
    { time: "18:00", day: 2 },
    { place: "juno", room: "flat", at: AF.start, face: "ne" },
    { if: "!p1", then: [{ set: "p1", value: "full" }, { set: "chits", value: 0 }, { ledger: "kessler", value: "full" }, { cache: "clip_kessler_ring" }, { cache: "note_kessler_debt" }] },
    { set: "code_cam03" }, { set: "link_cam03" }, { cache: "note_kessler_photo" },
    { set: "code_cam04" }, { set: "link_cam04" }, { set: "heard_yuens" }, { set: "saw_varga" }, { set: "read_kessler" },
    { set: "fridge_empty" }, { set: "rent_notice" }, { set: "moth_met" }, { set: "ate_bao" },
    { been_to: ["flat", "deck", "kessel_14", "kessel_lobby", "kowalski", "cam03", "cam04", "cam31"] },
    { ledger: "wren_advance", value: "paid" },
  ],
});
})();

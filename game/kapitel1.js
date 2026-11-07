// Halcyon: Chapter 1 "Glass" (docs/kapitel1-design.md), a playable mock on flat blocks (art/mock/). Three evenings on
// game days 2 to 4 (Wednesday to Friday), sleeping, job C (following Ines to the meeting), WREN's money, the rent. The end
// in cam31: game/kapitel1_ende.js.
//   e1                    Entscheidung 1: sold | refused
//   rent                  paid | teo (Teo paid it)
//   tag_ines              the person Juno follows
//   stick_ines            she holds the stick from dryer 6, the key to Ines' wallet; she can still put it back until the meeting
//   know_meeting          Juno knows where and when Ines meets someone (the tide board in cam30, story §10b)
//   bed_closed            on Friday there is no sleeping
// (the flags from the prologue the chapter carries over: `keep` of the act)
"use strict";

(function () {
const AF = Halcyon.at.flat;

Halcyon.nights = {
  3: { date: "Donnerstag, 8. November", evening: "Abend 2" },
  // Friday: Ines goes neither to the bar nor to the laundromat, her home is open (Sable or Motte will have given the code by then),
  // and how Juno spent Thursday only counts through what she knows and has
  4: { date: "Freitag, 9. November", evening: "Abend 3", passes: [
    ...["tag_ines", "code_cam22", "link_cam22", "code_cam23", "link_cam23",
      "~moment.ines_drop", "~moment.ines_tide", "~moment.traeger"].map((f) => ({ unset: f })),
    { set: "code_cam24" }, { set: "link_cam24" },
  ] },
};

// ---- the clock: on Friday it stops at 22:45, until Juno is watching on cam31 (everything is on the 15-minute ticks: any
// other time would come once for each way of having got there)
const [NOT_YET, WATCH_IT] = Cutaway.i18n.declare("waiting", ["Erst muss ich da reinkommen.", "Es ist so weit. Ich muss auf CAM 31 sein."]);
Cutaway.time.hold((/** @type {number} */ to) => {
  if (Cutaway.time.now.day !== 4) return null;
  if (Cutaway.state.test("moment:ines_meeting")) return Cutaway.state.flag("end_beat") === "after" ? WATCH_IT : null;     // the scene moves the clock itself
  return to > Cutaway.time.parse("22:45") ? (Cutaway.state.flag("link_cam31") ? WATCH_IT : NOT_YET) : null;
});

// ---- Friday's times. These moments are never watched: each happens as its window ends, wherever Juno is. The
// window is the 15-minute tick before it, so the clock stops there too and Juno sees it coming
const AT = (/** @type {string} */ id, /** @type {number} */ day, /** @type {string} */ from, /** @type {string} */ to, /** @type {any[]} */ unseen) =>
  Cutaway.moment(id, { room: "deck", day, from, to, if: "~never", unseen });

// the bed opens at 01:00: the clock stops there
AT("one_wed", 2, "00:45", "01:00", []);
AT("one_thu", 3, "00:45", "01:00", []);
AT("wren_deadline", 4, "21:45", "22:00", [{ if: "!e1", then: [{ set: "e1", value: "refused" }, { ledger: "wren", value: "refused" }, { notify: "wren" }] }]);
AT("rent_due", 4, "22:15", "22:30", [{
  if: "chits>=900",
  then: [{ inc: "chits", by: -900 }, { set: "rent", value: "paid" }, "Die Miete ist abgebucht. Neunhundert Chits."],
  else: [{ set: "chits", value: 0 }, { set: "rent", value: "teo" }, { notify: "teo" }, "Das Konto ist leer. Und die Miete ist trotzdem bezahlt.", "Teo."],
}]);
AT("friday_stop", 4, "22:30", "22:45", []);

Halcyon.cams.cam21 = { id: "21", place: "LULL-KLINIK 9-OST", owner: "HALCYON", map: [8, 38], if: "day>1" };
Halcyon.cams.cam22 = { id: "22", place: "PHO PUMP", owner: "PRIVAT", map: [64, 38], if: ["day>1", "day<4", "!off_main"] };
Halcyon.cams.cam23 = { id: "23", place: "SUDS & SPIN", owner: "PRIVAT", map: [120, 38], if: ["day>1", "day<4", "!off_main"],
  tryIt: ["Eine billige Kamera. Der Werkscode: 0000.", { set: "code_cam23" }, { set: "link_cam23" }, { sfx: "link" }, "Natürlich."] };
Halcyon.cams.cam24 = { id: "24", place: "WOHNBLOCK LERCHE", owner: "PRIVAT", map: [176, 14], if: "day=4" };      // (the code will come from Sable or Motte's second lesson, kapitel1-design C4)
Halcyon.cams.cam30 = { id: "30", place: "SUMPF-ABGANG", owner: "HALCYON", map: [176, 62], if: { or: [["day>1", "!off_main"], "day=4"] } };
Halcyon.cams.cam31 = { id: "31", place: "ALTE METRO, LINIE 31", owner: "UNBEKANNT", map: [120, 86], if: "know_meeting",
  // the old protocol is in Juno's head, and it wants a beat: the eye in the noise when she has it (kapitel1-design C7)
  tryIt: ["Kein Code findet die. Das Ding ist älter als Halcyon.", "Aber sie wartet auf was. Das alte Protokoll will einen Takt.", { dialog: "cam31_takt" }] };
// The old protocol's handshake, the same beat behind every sleeper's ear: long, short, short, long (story §10b). Each choice goes on to
// the next beat without saying whether it was right; the end says. Nothing has to be found first: whoever knows it can give it at once.
const STEPS = ["ein", "zwei", "drei", "vier"], BEAT = [0, 1, 1, 0];      // 0 long, 1 short: the choices' order
const OPEN = ["Das kann nur noch mein Kopf.", { sfx: "static" }, { stinger: "witness" }, { set: "code_cam31" }, { set: "link_cam31" }, "...", "Verbunden."];
const SHUT = ["Rauschen. Das war's nicht."];
const beat = (/** @type {number} */ n, /** @type {boolean} */ right) => [0, 1].map((c) => {
  const good = right && c === BEAT[n], text = c ? "Kurz." : "Lang.";
  return n === 3 ? { text, silent: true, goto: "end", then: good ? OPEN : SHUT } : { text, silent: true, goto: `${STEPS[n + 1]}_${good ? "ok" : "no"}`, then: [{ sfx: "tag" }] };
});
/** @type {Record<string, any>} */
const takt = { main: [...beat(0, true), { text: "Noch nicht.", silent: true, goto: "end", then: ["Noch nicht."] }] };
for (let n = 1; n < 4; n++) { takt[`${STEPS[n]}_ok`] = beat(n, true); takt[`${STEPS[n]}_no`] = beat(n, false); }
Cutaway.dialog("cam31_takt", takt);

// ---- the people of job C (art/characters/feed_people.px.js)
const A21 = Halcyon.at.cam21, A22 = Halcyon.at.cam22, A23 = Halcyon.at.cam23, A24 = Halcyon.at.cam24, A30 = Halcyon.at.cam30, A31 = Halcyon.at.cam31;
Halcyon.people.ines = { name: "INES CALDER", known: "know_ines", label: "Frau im Kittel", speaker: "Ines" };
Cutaway.actor("ines", { name: "Frau im Kittel", color: "#f0a0c0",
  costume: { idle: { se: "ines_feed_front", ne: "ines_feed_back" }, walk: { se: "ines_feed_front_walk", ne: "ines_feed_back_walk" }, talk: { se: "ines_feed_front", ne: "ines_feed_back" } }, speed: [14, 10], voice: { pitch: 66, wave: "triangle", syllable: 70 },
  poses: [{ if: "ines_down", idle: "ines_feed_down", walk: "ines_feed_down", talk: "ines_feed_down" },
    { if: "ines_gives", idle: "ines_feed_give", talk: "ines_feed_give" }],
  // what she does shows when Juno looks at her: a moment "seen or not" would double every state after it
  look: [{ if: "at:ines=cam31", then: ["Sie wartet. Sie sieht nur zum Tunnel."] }, { if: "at:ines=cam22", then: [{ if: "day=2", then: ["Sie schreibt was auf eine Serviette. Und legt die Hand drüber."], else: ["Dieselbe Suppe. Aber sie schaut dauernd zur Tür."] }],
    else: [{ if: ["at:ines=cam30", "day=3"], then: ["Sie sieht auf die Tafel. Dann auf die Uhr."], else: ["Ein Kittel, heller als alles. Dunkler Zopf."] }] }],
  talk: [{ if: "end_beat", then: ["Ines. Nicht die Treppe."], else: [{ if: { or: ["tag_ines", "day=4", "off_main"] }, then: ["Die kenn ich."], else: [{ tag: "ines" }, "Dr. Ines Calder. Das ist sie, vom Foto."] }] }] });
Halcyon.people.lantern = { name: "ROLLSTUHL", label: "Jemand im Rollstuhl", speaker: "Jemand im Rollstuhl" };
Cutaway.actor("lantern", { name: "Jemand im Rollstuhl", color: "#b0f0a0",
  costume: { idle: "lantern_feed", walk: "lantern_feed", talk: "lantern_feed" }, speed: [14, 10], voice: { pitch: 46, wave: "square", syllable: 85 },
  look: ["Geflickter Poncho, Schwimmer am Rollstuhl, ein Bündel Antennen."],
  talk: ["Wer bist du?"] });
Cutaway.routine("ines", [
  { day: [2, 3, 4], from: "19:00", to: "19:15", room: "cam21", at: A21.door, path: [A21.door, A21.walkOff] },
  { day: [2, 3], from: "19:15", to: "20:00", room: "cam22", at: A22.seat },
  { day: 2, from: "20:00", to: "20:30", room: "cam23", at: A23.counter },
  { day: 3, from: "20:00", to: "20:15", room: "cam23", at: A23.dryer6 },
  { day: 3, from: "20:15", to: "20:30", room: "cam30", at: A30.board, face: "ne", path: [A30.top, A30.board] },
  { day: [2, 3], from: "20:30", to: "21:00", room: "cam24", at: A24.off, path: [A24.off, A24.door] },
  { day: 4, from: "22:15", to: "22:30", room: "cam24", at: A24.door, path: [A24.door, A24.off] },
  { day: 4, from: "22:30", to: "22:45", room: "cam30", at: A30.top, path: [A30.top, A30.water] },
  { day: 4, from: "22:55", to: "23:30", room: "cam31", at: A31.top, face: "se" },
]);
Cutaway.routine("lantern", [
  { day: 4, from: "23:00", to: "23:02", room: "cam31", at: A31.tunnel, face: "sw" },
]);
// the queue at the clinic, before Ines comes out; one of them is on the protocol without knowing it
["commuter_a", "commuter_b", "commuter_c", "commuter_d"].forEach((id, i) => {
  Cutaway.time.routines.get(id).push({ day: [2, 3, 4], from: "18:00", to: "19:00", room: "cam21", at: A21.queue[i], face: "ne" });
});
// On Friday Juno knows her whatever she did: `tag_ines` is forgotten overnight to keep the states few, so the implant's mark is only the look (no state)
Cutaway.i18n.declare("feed display", ["INES CALDER"]);
Halcyon.links = [{ actor: "commuter_c", if: ["day<4", "at:commuter_c=cam21"] },
  { actor: "ines", if: ["day=4", "!tag_ines"], label: "INES CALDER", color: "implant" }];

// ---- the moments of job C
const DROP = ["Keine Wäsche. Was macht sie hier ohne Wäsche?", "Sie legt was in Trockner 6. In den kaputten.", "Und weg. Aber nicht nach Hause.", "Die Richtung geht's nur noch zum Sumpf-Abgang."];
Cutaway.moment("ines_drop", { room: "cam23", day: 3, from: "20:00", to: "20:15", play: DROP });
// Why she goes to the stairs on Thursday: she has to know when the way down can be walked. Juno reads the same board and adds it up (story §10b)
const TIDE_READ = ["Nicht nach Hause. Was will die hier?", "Der Abgang ist seit der Flut zu. Unten ist nur noch die alte Metro.", "Sie liest die Pegeltafel. Und sieht auf die Uhr.",
  "Freitag, 23:00: Niedrigwasser. Dann kommt man zu Fuß runter.", "Wer will da runter? Keiner will da runter.", "Außer man trifft da wen. Wo keiner hinsieht.", { set: "know_meeting" }];
const SIGN_READ = [{ set: "know_meeting" }, "LINE 31, CLOSED. Die alte Metro. Was will die da unten?", "Um elf ist Niedrigwasser. Da trifft sie wen."];
Cutaway.moment("ines_tide", { room: "cam30", day: 3, from: "20:15", to: "20:30", if: "!know_meeting", play: TIDE_READ });
Cutaway.moment("ines_sign", { room: "cam30", day: 4, from: "22:30", to: "22:45", if: "!know_meeting",
  play: ["Da ist sie. Mit einer Tasche. Sie geht die Treppe runter, ins Wasser.", ...SIGN_READ] });

// ---- WREN and the rest of the chat
// the handbook (story §10a): in the cache from the first evening; it has the word C7 needs
Halcyon.cache.note_obs_handbook = { kind: "note", name: "BEOBACHTER-HANDBUCH", about: "Halcyon, Zivile Beobachtung. Hinter dem Ohr. Protokoll OBS-4. Die Wach-Ebene hält Sie bei Bewusstsein. Handshake: siehe Anlage C. Die Anlage fehlt." };

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
  { id: "back", text: "Die 250 zurückschicken.", if: ["day=4", "ledger_wren_advance=paid", "!e1", "chits>=250"],
    use: [{ inc: "chits", by: -250 }, { ledger: "wren_advance", value: "back" }, "Soll keiner sagen, ich wär billig."] },
  { id: "send", text: "Den Ort senden.", if: ["day=4", "know_meeting", "!e1"],
    use: [{ set: "e1", value: "sold" }, { if: "ledger_wren_advance=back", then: [{ ledger: "wren", value: "sold_back" }], else: [{ ledger: "wren", value: "sold" }] },
      "Ein Satz. Mehr war's nicht.", { evi: "froh" }, { say: "evi", text: "Geld! Wir können die Miete zahlen!" }] },
  { id: "refuse", text: "Nichts senden.", if: ["day=4", "know_meeting", "!e1"],
    use: [{ set: "e1", value: "refused" }, { ledger: "wren", value: "refused" }, "Die müssen sich jemand anderen suchen.",
      { evi: "verwirrt" }, { say: "evi", text: "Das war viel Geld. Warum ist das gut?" }] },
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

// the cameras, on blocks (the buffers: what Juno missed tonight, kapitel0-design §3)
const MIC = { clear: 40, lost: 150 };
Halcyon.camRoom("cam21", { background: "cam21_bg", mic: { at: A21.mic, ...MIC }, hotspots: {
  menu: { name: "Speisekarte", rect: A21.menu, look: "Die Speisekarte von Pho Pump, im Fenster gegenüber.",
    use: [{ if: { or: ["link_cam22", "off_main"] }, then: ["PHO-2291. Hab ich."], else: ["Zoom. Suppe, Suppe, Suppe. Und ganz unten: GÄSTE-WLAN PHO-2291.", { set: "code_cam22" }, { set: "link_cam22" }, { sfx: "link" }, "Danke für die Einladung. CAM 22 läuft."] }] },
  clinic: { name: "Klinik", rect: A21.clinic, look: "Lull-Klinik 9-Ost. Weiß und still. Sie haben die Codes nie geändert." },
} });
Halcyon.camRoom("cam22", { background: "cam22_bg", mic: { at: A22.mic, ...MIC }, hotspots: { bar: { name: "Theke", rect: A22.bar, look: "Pho Pump. Suppe für alle, die nach Pumpe riechen." } } });
Halcyon.camRoom("cam23", { background: "cam23_bg", mic: { at: A23.mic, ...MIC }, hotspots: {
  dryers: { name: "Trockner", rect: A23.dryers, look: "Acht Trockner. Die Sechs ist tot, mit Zettel. Da sieht keiner rein." },
  desk: { name: "Theke", rect: A23.desk, look: "Die Theke. Ein Mann schläft dahinter, seit Jahren." },
  // a look back may repeat: no flag of its own
  rewind: { name: "Puffer", z: 5, if: ["day=3", "moment:ines_drop", "!seen:ines_drop"], use: ["Puffer. Zurück auf 20:05.", ...DROP] },
} });
Halcyon.camRoom("cam24", { background: "cam24_bg", mic: { at: A24.mic, ...MIC }, hotspots: { entrance: { name: "Haustür", rect: A24.entrance, look: "Wohnblock Lerche. Da wohnt sie." } } });
Halcyon.camRoom("cam30", { background: "cam30_bg", mic: { at: A30.mic, ...MIC }, hotspots: {
  sign: { name: "Schild", rect: A30.sign, look: "LINE 31, CLOSED. Seit der Flut, schätze ich." },
  tide: { name: "Pegeltafel", rect: A30.tide, look: "Die Pegeltafel. Freitag, 23:00: Niedrigwasser." },
  rewind: { name: "Puffer", z: 5, if: { or: [["day=3", "moment:ines_tide", "!know_meeting"], ["day=4", "moment:ines_sign", "!know_meeting"]] },
    use: [{ if: "day=3", then: ["Puffer. Zurück auf Viertel nach acht.", ...TIDE_READ], else: ["Puffer. Da, die Treppe runter.", ...SIGN_READ] }] },
} });

// ---- the alley and the laundromat, in street mode
const AG = Halcyon.at.gasse, AW = Halcyon.at.laundromat;
Cutaway.room("gasse", { name: "Die Gasse", background: "gasse_bg", walk: AG.walk,
  ambience: ["city_far", { sfx: "feed_rain", gain: 0.6 }], music: { theme: "juno", intensity: 0.3 },
  hotspots: {
    kowalski: { name: "Zur Kowalski-Straße", rect: AG.kowalskiRect, walkTo: AG.kowalski, face: "sw", use: [{ goto: "kowalski", at: Halcyon.at.kowalski.fromGasse, face: "nw" }] },
    laundromat: { name: "SUDS & SPIN", rect: AG.laundromatRect, walkTo: AG.laundromat, face: "ne", look: "Der Waschsalon. Ein Viertel weiter, der Gasse nach.",
      use: [{ goto: "laundromat", at: AW.arrive, face: "se" }] },
    market: { name: "Zum Drain-Markt", rect: AG.marketRect, walkTo: AG.market, face: "se", look: "Da runter ist der Drain-Markt.", use: "[MOCK] Den bau ich erst noch." },
    niche: { name: "Nische", rect: AG.nicheRect, walkTo: AG.niche, face: "ne", look: "Eine Nische mit einer Matratze und einem Topf. Hier wohnt jemand." },
    cables: { name: "Kabel", rect: AG.cablesRect, walkTo: AG.niche, face: "ne", look: "Kabel, armdick. Alle tropfen. Keiner weiß mehr, wohin sie gehen." },
  } });
const AT_DRYER = ["!off_main", { or: [["day=3", "time>=20:00"], "day=4"] }];     // it lies there from when she has left it (the clock stands while Juno walks); Lantern only hears of it at the meeting
Cutaway.room("laundromat", { name: "SUDS & SPIN", background: "laundromat_bg", walk: AW.walk,
  ambience: ["fridge_hum", "neon_buzz"], music: { theme: "juno", intensity: 0.3 },
  hotspots: {
    door: { name: "Tür", rect: AW.doorRect, walkTo: AW.door, face: "sw", use: [{ goto: "gasse", at: AG.laundromat, face: "sw" }] },
    dryers: { name: "Trockner", rect: AW.dryersRect, walkTo: AW.dryer6, face: "ne", look: "Acht Trockner. Drei Paar Turnschuhe drin, trotz des Schilds." },
    dryer6: { name: "Trockner 6", rect: AW.dryer6Rect, walkTo: AW.dryer6, face: "ne", z: 1, look: "Trockner 6. OUT OF ORDER, und das schon länger.",
      use: [{ if: AT_DRYER, then: [{ if: "stick_ines", then: ["Hier lag er."], else: ["Da liegt was drin. Ein Datenstick.", "Ein Schlüssel drauf. Sonst nichts. Wozu, weiß ich nicht."] }, { dialog: "stick" }],
        else: ["Kalt und leer."] }] },
    counter: { name: "Theke", rect: AW.counterRect, walkTo: AW.counter, face: "ne", look: "Die Theke. Ein Mann schläft dahinter, seit Jahren.", use: ["Nichts für mich."] },
  } });
Cutaway.item("stick", { name: "Ines' Stick", icon: "inv_stick", look: "Ein Datenstick. Ein Schlüssel drauf, sonst nichts. Wozu, weiß ich nicht." });
Cutaway.dialog("stick", { main: { choices: [
  { text: "Zurücklegen.", silent: true, goto: "end", then: [{ if: "stick_ines", then: [{ unset: "stick_ines" }, { remove: "stick" }] }, "Soll sie ihren Plan haben. Ich schau nur zu."] },
  { text: "Behalten.", silent: true, goto: "end", then: [{ if: "!stick_ines", then: [{ set: "stick_ines" }, { give: "stick" }] }, "Wer weiß, wofür der gut ist. Jemand wird ihn vermissen."] },
] } });

// ---- the act. It begins from a clean state, whichever way: what the prologue leaves comes along in `keep`,
// and from the title screen it stands on the plain way through (the whole clip to Frau Kessler)
Cutaway.act("kapitel1", {
  title: "Kapitel 1", name: "Glass", room: "flat", actor: "juno", fresh: true,
  keep: ["p1", "chits", "ledger_kessler", "ledger_sable_kessler", "moth_kind", "moth_brushed", "bao_paid", "evi_trust",
    "cache_clip_kessler_ring", "cache_clip_kessler_cut", "cache_note_kessler_debt", "got_ausweis", "got_haken"],
  start: [
    { time: "18:00", day: 2 }, { give: "evi_bag", to: "juno" },
    { if: "got_ausweis", then: [{ give: "ausweis" }] }, { if: "got_haken", then: [{ give: "haken" }] },     // what she took in the prologue
    { place: "juno", room: "flat", at: AF.start, face: "ne" },
    { if: "!p1", then: [{ set: "p1", value: "full" }, { set: "chits", value: 0 }, { ledger: "kessler", value: "full" }, { cache: "clip_kessler_ring" }, { cache: "note_kessler_debt" }] },
    { set: "code_cam03" }, { set: "link_cam03" }, { cache: "note_kessler_photo" }, { cache: "note_obs_handbook" },
    { set: "code_cam21" }, { set: "link_cam21" }, { set: "code_cam30" }, { set: "link_cam30" }, { set: "code_cam18" }, { set: "link_cam18" }, { set: "code_cam07" }, { set: "link_cam07" },   // Juno's old access
    { set: "know_ines" }, { set: "saw_varga" }, { set: "read_kessler" },
    { set: "fridge_empty" }, { set: "rent_notice" }, { set: "moth_met" }, { set: "ate_bao" },
    { been_to: ["flat", "deck", "kessel_14", "kessel_lobby", "kowalski", "gasse", "laundromat", "sims", "dach", "dach_blick", "dach_sitzen", "lucky_static", "jade_row", "okonkwo_shop", "drain_market", "sable_booth", "cam15", "signal_lost", "flat_danach", "cam03", "cam07", "cam07v", "cam14", "cam18", "cam21", "cam22", "cam23", "cam24", "cam30", "cam31"] },
    { ledger: "wren_advance", value: "paid" }, { set: "imai_step", value: 0 }, { solo: true },
  ],
});
})();

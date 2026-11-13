// Nagiwa: Chapter 1 "Glass" (docs/kapitel1-design.md), a playable mock on flat blocks (art/mock/). Three evenings on
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
const AF = Nagiwa.at.flat;

Nagiwa.nights = {
  2: { date: "Mittwoch, 7. November", evening: "Abend 1" },
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
// window is the 15-minute tick before it, so the clock stops there too and Juno sees it coming. Each is written out (room "deck" and
// if "~never" alike), so the editor's Schedule tab changes each one's times and steps on its own

// the bed opens at 01:00: the clock stops there
Cutaway.moment("one_wed", { room: "deck", day: 2, from: "00:45", to: "01:00", if: "~never", unseen: [] });
Cutaway.moment("one_thu", { room: "deck", day: 3, from: "00:45", to: "01:00", if: "~never", unseen: [] });
Cutaway.moment("wren_deadline", { room: "deck", day: 4, from: "21:45", to: "22:00", if: "~never", unseen: [
  { if: "!e1", then: [{ set: "e1", value: "refused" }, { ledger: "wren", value: "refused" }, { notify: "wren" }] },
] });
Cutaway.moment("rent_due", { room: "deck", day: 4, from: "22:15", to: "22:30", if: "~never", unseen: [
  { if: "chits>=900",
    then: [{ inc: "chits", by: -900 }, { set: "rent", value: "paid" }, "Neunhundert Chits sind weg. Die Miete ist abgebucht."],
    else: [{ set: "chits", value: 0 }, { set: "rent", value: "teo" }, { notify: "teo" }, "Das Konto ist leer. Und die Miete ist trotzdem bezahlt.", "Teo."] },
] });
Cutaway.moment("friday_stop", { room: "deck", day: 4, from: "22:30", to: "22:45", if: "~never", unseen: [] });

Nagiwa.cams.cam21 = { id: "21", place: "LULL-KLINIK 9-OST", owner: "NAGI·WA", map: [8, 38], if: "day>1" };
Nagiwa.cams.cam22 = { id: "22", place: "PHO PUMP", owner: "PRIVAT", map: [64, 38], if: ["day>1", "day<4", "!off_main"] };
Nagiwa.cams.cam23 = { id: "23", place: "SUDS & SPIN", owner: "PRIVAT", map: [120, 38], if: ["day>1", "day<4", "!off_main"],
  tryIt: ["Das ist eine billige Kamera, und ihr Werkscode ist 0000.", { set: "code_cam23" }, { set: "link_cam23" }, { sfx: "link" }, "Natürlich."] };
Nagiwa.cams.cam24 = { id: "24", place: "WOHNBLOCK LERCHE", owner: "PRIVAT", map: [176, 14], if: "day=4" };      // (the code will come from Sable or Motte's second lesson, kapitel1-design C4)
Nagiwa.cams.cam30 = { id: "30", place: "SUMPF-ABGANG", owner: "NAGI·WA", map: [176, 62], if: { or: [["day>1", "!off_main"], "day=4"] } };
Nagiwa.cams.cam31 = { id: "31", place: "ALTE METRO, LINIE 31", owner: "UNBEKANNT", map: [120, 86], if: "know_meeting",
  // the old protocol is in Juno's head, and it wants a beat: the eye in the noise when she has it (kapitel1-design C7)
  tryIt: ["Kein Code findet die. Das Ding ist älter als Nagi·wa.", "Aber sie wartet auf was. Das alte Protokoll will einen Takt.", { dialog: "cam31_takt" }] };
// The old protocol's handshake, the same beat behind every sleeper's ear: long, short, short, long (story §10b). Each choice goes on to
// the next beat without saying whether it was right; the end says. Nothing has to be found first: whoever knows it can give it at once.
const STEPS = ["ein", "zwei", "drei", "vier"], BEAT = [0, 1, 1, 0];      // 0 long, 1 short: the choices' order
const OPEN = ["Das kann nur noch mein Kopf.", { sfx: "static" }, { stinger: "witness" }, { set: "code_cam31" }, { set: "link_cam31" }, "...", "Sie ist verbunden."];
const SHUT = ["Da ist nur Rauschen. Das war's nicht."];
const beat = (/** @type {number} */ n, /** @type {boolean} */ right) => [0, 1].map((c) => {
  const good = right && c === BEAT[n], text = c ? "Kurz." : "Lang.";
  return n === 3 ? { text, silent: true, goto: "end", then: good ? OPEN : SHUT } : { text, silent: true, goto: `${STEPS[n + 1]}_${good ? "ok" : "no"}`, then: [{ sfx: "tag" }] };
});
/** @type {Record<string, any>} */
const takt = { main: [...beat(0, true), { text: "Noch nicht.", silent: true, goto: "end", then: ["Noch nicht."] }] };
for (let n = 1; n < 4; n++) { takt[`${STEPS[n]}_ok`] = beat(n, true); takt[`${STEPS[n]}_no`] = beat(n, false); }
Cutaway.dialog("cam31_takt", takt);

// ---- the people of job C (art/characters/feed_people.px.js)
const A21 = Nagiwa.at.cam21, A22 = Nagiwa.at.cam22, A23 = Nagiwa.at.cam23, A24 = Nagiwa.at.cam24, A30 = Nagiwa.at.cam30, A31 = Nagiwa.at.cam31;
Nagiwa.people.ines = { name: "INES CALDER", known: "know_ines", label: "Frau im Kittel", speaker: "Ines" };
Cutaway.actor("ines", { name: "Frau im Kittel", color: "#f0a0c0",
  costume: { idle: { se: "ines_feed_front", ne: "ines_feed_back" }, walk: { se: "ines_feed_front_walk", ne: "ines_feed_back_walk" }, talk: { se: "ines_feed_front", ne: "ines_feed_back" } }, speed: [14, 10], voice: { pitch: 66, wave: "triangle", syllable: 70 },
  poses: [{ if: "at:ines=cam23", idle: "mock_ines", walk: "mock_ines", talk: "mock_ines" },     // CAM 23 is the laundromat itself: she is at its scale there
    { if: "at:ines=cam22", idle: "ines_feed_bar", walk: "ines_feed_bar", talk: "ines_feed_bar" },   // CAM 22 is near: her upper body over the counter
    { if: "ines_down", idle: "ines_feed_down", walk: "ines_feed_down", talk: "ines_feed_down" },
    { if: "ines_gives", idle: "ines_feed_give", talk: "ines_feed_give" }],
  // what she does shows when Juno looks at her: a moment "seen or not" would double every state after it
  look: [{ if: "at:ines=cam31", then: ["Sie wartet. Sie sieht nur zum Tunnel."] }, { if: "at:ines=cam22", then: [{ if: "day=2", then: ["Sie schreibt was auf eine Serviette. Und legt die Hand drüber."], else: ["Sie isst dieselbe Suppe, aber sie schaut dauernd zur Tür."] }],
    else: [{ if: ["at:ines=cam30", "day=3"], then: ["Sie sieht auf die Tafel und dann auf die Uhr."], else: ["Sie trägt einen Kittel, heller als alles, und einen dunklen Zopf."] }] }],
  talk: [{ if: "end_beat", then: ["Ines. Nicht die Treppe."], else: [{ if: { or: ["tag_ines", "day=4", "off_main"] }, then: ["Die kenn ich."], else: [{ tag: "ines" }, "Das ist Dr. Ines Calder, die vom Foto."] }] }] });
Nagiwa.people.lantern = { name: "ROLLSTUHL", label: "Jemand im Rollstuhl", speaker: "Jemand im Rollstuhl" };
Cutaway.actor("lantern", { name: "Jemand im Rollstuhl", color: "#b0f0a0",
  costume: { idle: "lantern_feed", walk: "lantern_feed", talk: "lantern_feed" }, speed: [14, 10], voice: { pitch: 46, wave: "square", syllable: 85 },
  look: ["Er trägt einen geflickten Poncho, und an seinem Rollstuhl hängen Schwimmer und Antennen."],
  talk: ["Wer bist du?"] });
Cutaway.routine("ines", [
  { day: [2, 3, 4], from: "19:00", to: "19:15", room: "cam21", at: A21.door, path: [A21.door, A21.walkOff, A21.gone], once: true },   // out of the picture, once
  { day: [2, 3], from: "19:15", to: "20:00", room: "cam22", at: A22.seat },
  { day: 2, from: "20:00", to: "20:30", room: "cam23", at: A23.washer, face: "nw" },
  { day: 3, from: "20:00", to: "20:15", room: "cam23", at: A23.dryer6, face: "ne" },
  { day: 3, from: "20:15", to: "20:30", room: "cam30", at: A30.thuIn, face: "ne", path: [A30.thuIn, A30.board], once: true },   // to the board, and she stays
  { day: [2, 3], from: "20:30", to: "21:00", room: "cam24", at: A24.away, path: [A24.away, A24.street, A24.gate, A24.out], once: true },   // home, in at the door
  { day: 4, from: "22:15", to: "22:30", room: "cam24", at: A24.out, path: [A24.out, A24.gate, A24.street, A24.away], once: true },   // out with her bag
  { day: 4, from: "22:30", to: "22:45", room: "cam30", at: A30.friIn, path: [A30.friIn, A30.turn, A30.top, A30.water, A30.gone], once: true },   // down into the old station
  { day: 4, from: "22:55", to: "23:30", room: "cam31", at: A31.top, face: "se" },
]);
Cutaway.routine("lantern", [
  { day: 4, from: "23:00", to: "23:02", room: "cam31", at: A31.tunnel, face: "sw" },
]);
// the queue at the clinic, before Ines comes out, facing the door under the camera; one of them is on the protocol without knowing it
["commuter_a", "commuter_b", "commuter_c", "commuter_d"].forEach((id, i) => {
  Cutaway.time.routines.get(id).push({ day: [2, 3, 4], from: "18:00", to: "19:00", room: "cam21", at: A21.queue[i], face: "se" });
});
// On Friday Juno knows her whatever she did: `tag_ines` is forgotten overnight to keep the states few, so the implant's mark is only the look (no state)
Cutaway.i18n.declare("feed display", ["INES CALDER"]);
Nagiwa.links = [{ actor: "commuter_c", if: ["day<4", "at:commuter_c=cam21"] },
  { actor: "ines", if: ["day=4", "!tag_ines"], label: "INES CALDER", color: "implant" }];

// ---- the moments of job C
// (the camera's buffer plays each of them again: { replay } in the rewind hotspots below, so the lines are written once, here)
Cutaway.moment("ines_drop", { room: "cam23", day: 3, from: "20:00", to: "20:15", play: [
  "Sie hat keine Wäsche dabei. Was macht sie hier ohne Wäsche?",
  "Sie legt was in Trockner 6. In den kaputten.",
  "Und jetzt ist sie weg, aber nicht nach Hause.",
  "Die Richtung geht's nur noch zum Sumpf-Abgang.",
] });
// Why she goes to the stairs on Thursday: she has to know when the way down can be walked. Juno reads the same board and adds it up (story §10b)
Cutaway.moment("ines_tide", { room: "cam30", day: 3, from: "20:15", to: "20:30", if: "!know_meeting", play: [
  "Sie geht nicht nach Hause. Was will die hier?",
  "Der Abgang ist seit der Flut zu. Unten ist nur noch die alte Metro.",
  "Sie liest die Pegeltafel und sieht auf die Uhr.",
  "Freitag, 23:00: Niedrigwasser. Dann kommt man zu Fuß runter.",
  "Wer will da runter? Keiner will da runter.",
  "Außer man trifft da wen. Wo keiner hinsieht.",
  { set: "know_meeting" },
] });
// (the buffer's replay leaves out the first line: { replay: "ines_sign", from: 1 })
Cutaway.moment("ines_sign", { room: "cam30", day: 4, from: "22:30", to: "22:45", if: "!know_meeting", play: [
  "Da ist sie, mit einer Tasche. Sie geht die Treppe runter, ins Wasser.",
  { set: "know_meeting" },
  "LINE 31, CLOSED. Das ist die alte Metro. Was will die da unten?",
  "Um elf ist Niedrigwasser. Da trifft sie wen.",
] });

// ---- WREN and the rest of the chat
// the handbook (story §10a): in the cache from the first evening; it has the word C7 needs
Nagiwa.cache.note_obs_handbook = { kind: "note", name: "BEOBACHTER-HANDBUCH", about: "Nagi·wa, Zivile Beobachtung. Hinter dem Ohr. Protokoll OBS-4. Die Wach-Ebene hält Sie bei Bewusstsein. Handshake: siehe Anlage C. Die Anlage fehlt." };

Object.assign(Nagiwa.ledger, {
  wren_advance: { to: "WREN", what: { paid: "der Vorschuss", back: "der Vorschuss, zurückgeschickt" }, chits: { paid: 250 } },
  wren: { to: "WREN", what: { sold: "Ines Calder, Metro 31, Fr 23:00", sold_back: "Ines Calder, Metro 31, Fr 23:00", refused: "nichts geliefert" }, chits: { sold: 1250, sold_back: 1500 } },
  wren_live: { to: "WREN", what: { paid: "die Live-Übertragung" }, chits: { paid: 750 } },
});
Object.assign(Nagiwa.contacts, {
  wren: { name: "WREN", color: "#d0d8f0", status: "online", if: "day>1", unread: "!read_wren",
    open: [{ if: "!read_wren", then: [{ set: "read_wren" }, "Wer bezahlt im Voraus? Niemand bezahlt im Voraus."] }] },
});
// who has been read only shows as a dot: no state for the solver (conventions: view flags)
Cutaway.state.view("read_wren", "read_kessler_again");
Nagiwa.threads.wren = [
  { from: "wren", at: "18:02", text: "Dr. Ines Calder, Lull-Klinik 9-Ost. Wir wollen wissen, wen sie trifft und wo. 1500, davon 250 jetzt. Diskretion." },
  { from: "wren", at: "18:02", photo: "FOTO INES CALDER", text: "250 Chits überwiesen." },
  { from: "juno", if: "ledger_wren_advance=back", text: "Die 250 zurück. Von Leuten ohne Namen nehm ich nichts." },
  { from: "wren", if: "ledger_wren_advance=back", text: "Wie Sie wollen. Das Angebot bleibt." },
  { from: "wren", if: "day=4", at: "18:00", text: "Bis 22 Uhr. Wo und wann." },
  { from: "juno", if: "e1=sold", text: "Alte Metro, Linie 31. Freitag, 23:00." },
  { from: "wren", if: "e1=sold", text: "Danke. Und schauen Sie heute Nacht zu. Für die Live-Übertragung zahlen wir 750 extra." },
  { from: "wren", if: "e1=refused", text: "Schade. Es gibt andere Glasser." },
];
Nagiwa.replies.wren = [
  { id: "back", text: "Die 250 zurückschicken.", if: ["day=4", "ledger_wren_advance=paid", "!e1", "chits>=250"],
    use: [{ inc: "chits", by: -250 }, { ledger: "wren_advance", value: "back" }, "Soll keiner sagen, ich wär billig."] },
  { id: "send", text: "Den Ort senden.", if: ["day=4", "know_meeting", "!e1"],
    use: [{ set: "e1", value: "sold" }, { if: "ledger_wren_advance=back", then: [{ ledger: "wren", value: "sold_back" }], else: [{ ledger: "wren", value: "sold" }] },
      "Das war ein Satz. Mehr war's nicht.", { evi: "froh" }, { say: "evi", text: "Geld! Wir können die Miete zahlen!" }] },
  { id: "refuse", text: "Nichts senden.", if: ["day=4", "know_meeting", "!e1"],
    use: [{ set: "e1", value: "refused" }, { ledger: "wren", value: "refused" }, "Die müssen sich jemand anderen suchen.",
      { evi: "verwirrt" }, { say: "evi", text: "Das war viel Geld. Warum ist das gut?" }] },
];
// Frau Kessler picks up the prologue (kapitel1-design §7); Teo, if the rent wasn't there
Nagiwa.threads.kessler.push(
  { from: "kessler", if: ["day>1", "p1=full"], at: "18:10", text: "Er ist nicht heimgekommen. Schulden, haben Sie geschrieben. Wo ist er?" },
  { from: "kessler", if: ["day>1", "p1=cut"], at: "18:10", text: "Er ist nicht heimgekommen. Zu ihr, nehme ich an." },
  { from: "kessler", if: ["day>1", "p1=nothing"], at: "18:10", text: "Er ist nicht heimgekommen. Sie haben wirklich nichts gefunden?" },
);
Nagiwa.threads.teo.push(
  { from: "teo", if: "rent=teo", at: "22:30", text: "Hab gehört, die Miete. Ich hab Schichten gemacht. Schon überwiesen. Sag nichts." },
);

// the cameras, on blocks (the buffers: what Juno missed tonight, kapitel0-design §3)
const MIC = { clear: 40, lost: 150 };
Nagiwa.camRoom("cam21", { background: "cam21_bg", mic: { at: A21.mic, ...MIC }, hotspots: {
  menu: { name: "Speisekarte", rect: A21.menu, look: "Die Speisekarte von Pho Pump hängt im Fenster gegenüber.",
    use: [{ if: { or: ["link_cam22", "off_main"] }, then: ["PHO-2291, das hab ich schon."], else: ["Da steht Suppe, Suppe, Suppe. Und ganz unten steht GÄSTE-WLAN PHO-2291.", { set: "code_cam22" }, { set: "link_cam22" }, { sfx: "link" }, "Danke für die Einladung. CAM 22 läuft."] }] },
  clinic: { name: "Klinik", poly: A21.clinicPoly, look: "Die Lull-Klinik 9-Ost ist weiß und still. Sie haben die Codes nie geändert." },
} });
Nagiwa.camRoom("cam22", { background: "cam22_bg", mic: { at: A22.mic, ...MIC }, hotspots: { bar: { name: "Theke", poly: A22.barPoly, look: "Pho Pump macht Suppe für alle, die nach Pumpe riechen." } } });
// CAM 23 is the laundromat's own picture under the feed's filter, as CAM 14 is the floor's: its bake and props moved right by
// A23.shift, the camera left out of its own picture, the man asleep behind his counter
Nagiwa.camRoom("cam23", { background: undefined, color: Nagiwa.PHOSPHOR[0], mic: { at: A23.mic, ...MIC },
  post: [{ exposure: A23.exposure }, ...Nagiwa.FEED_POST],
  props: [
    { id: "room", image: "laundromat_bg", at: [A23.shift, 0], anchor: [0, 0], baseline: -1000 },
    ...Nagiwa.at.laundromat.props.filter((/** @type {any} */ p) => p.id !== "cam").map((/** @type {any} */ p) => ({ ...p, at: [p.at[0] + A23.shift, p.at[1]],
      ...(p.front ? { front: p.front.map((/** @type {number} */ v, /** @type {number} */ i) => (i % 2 ? v : v + A23.shift)) } : {}) })),
    { id: "sleeper", image: "mock_sleeper", at: A23.sleeper },
  ],
  hotspots: {
  dryers: { name: "Trockner", poly: A23.dryersPoly, look: "Da sind acht Trockner, und die Sechs ist tot, mit Zettel dran. Da sieht keiner rein." },
  desk: { name: "Theke", poly: A23.deskPoly, look: "Hinter der Theke schläft ein Mann, seit Jahren." },
  // a look back may repeat: no flag of its own
  rewind: { name: "Puffer", z: 5, if: ["day=3", "moment:ines_drop", "!seen:ines_drop"], use: ["Ich spul den Puffer zurück auf 20:05.", { replay: "ines_drop" }] },
} });
Nagiwa.camRoom("cam24", { background: "cam24_bg", mic: { at: A24.mic, ...MIC }, hotspots: { entrance: { name: "Haustür", poly: A24.doorPoly, look: "Das ist der Wohnblock Lerche. Da wohnt sie." } } });
Nagiwa.camRoom("cam30", { background: "cam30_bg", mic: { at: A30.mic, ...MIC }, hotspots: {
  sign: { name: "Schild", poly: A30.signPoly, look: "LINE 31, CLOSED. Das ist sie seit der Flut, schätze ich." },
  tide: { name: "Pegeltafel", poly: A30.tidePoly, look: "Auf der Pegeltafel steht: Freitag, 23:00, Niedrigwasser." },
  rewind: { name: "Puffer", z: 5, if: { or: [["day=3", "moment:ines_tide", "!know_meeting"], ["day=4", "moment:ines_sign", "!know_meeting"]] },
    use: [{ if: "day=3", then: ["Ich spul den Puffer zurück auf Viertel nach acht.", { replay: "ines_tide" }],
      else: ["Im Puffer ist es. Da, die Treppe runter.", { replay: "ines_sign", from: 1 }] }] },
} });

// ---- the alley and the laundromat, in street mode: both baked from their maps (art/rooms/gasse.map.js, laundromat.map.js)
const AG = Nagiwa.at.gasse, AW = Nagiwa.at.laundromat;
Cutaway.room("gasse", { name: "Die Gasse", background: "gasse_bg", size: /** @type {[number, number]} */ ([416, 236]), walk: AG.walk, holes: AG.holes,
  props: [...AG.props, { id: "ad", image: "gasse_ad", at: AG.adAt, anchor: [0, 0], baseline: 0 }],
  light: { ambient: 0.5, lamps: AG.lamps.map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
  // the rain coming down into the alley, as in Kowalski Street (the steam out of the dryers' vent is in the picture)
  // and the two cones of light hanging in it
  fx: [{ kind: "rain", rect: [0, 0, 416, 236], count: 80, color: "#41547a", speed: 140, slant: 0.3, length: 3 },
    { kind: "rain", rect: [0, 0, 416, 236], count: 60, color: "#6c809a", speed: 210, slant: 0.3, length: 5 },
    { kind: "haze", poly: AG.hazeDoor, color: "#dafcff", alpha: 0.14, fade: 0.3 },
    { kind: "haze", poly: AG.hazeStatue, color: "#ffd58a", alpha: 0.16, fade: 0.3 }],
  ambience: ["city_far", { sfx: "feed_rain", gain: 0.6 }], music: { theme: "juno", intensity: 0.3 },
  hotspots: {
    kowalski: { name: "Zur Kowalski-Straße", poly: AG.kowalskiPoly, walkTo: AG.kowalski, face: "nw", use: [{ goto: "kowalski", at: Nagiwa.at.kowalski.fromGasse, face: "nw" }] },
    laundromat: { name: "SUDS & SPIN", poly: AG.laundromatPoly, walkTo: AG.laundromat, face: "ne", look: "Der Waschsalon ist ein Viertel weiter, immer der Gasse nach.",
      use: [{ goto: "laundromat", at: AW.arrive, face: "se" }] },
    market: { name: "Zum Drain-Markt", poly: AG.marketPoly, walkTo: AG.market, face: "nw", look: "Da runter ist der Drain-Markt.", use: "[MOCK] Den bau ich erst noch." },
    statue: { name: "Denkmal", poly: AG.statuePoly, walkTo: AG.statue, face: "ne",
      look: ["Das Flutdenkmal ist eine Frau, die bis an die Knie im Wasser steht.", "Sie hält ein kleines Boot in den Händen.", "Die Stange daneben zeigt, wie hoch es stand, weit über ihrem Kopf.",
        "Unten stehen die Namen, und der Sockel ist zu klein für alle.", "Und jeden Abend setzt jemand Papierboote mit Kerzen davor."] },
    // the padlocks on the railing (the user's wish: clickable, Juno or EVI say something)
    locks: { name: "Schlösser", rect: AG.locksRect, walkTo: AG.water, face: "se", z: 1,
      look: ["Am Geländer hängen Schlösser, und auf jedem stehen zwei Namen in Edding."],
      use: ["Die Schlüssel liegen da unten. Bei der alten Stadt.", { evi: "verwirrt" }, { say: "evi", text: "Dann kriegt die keiner mehr auf. Ist das der Plan?" }, "Das ist der Plan."] },
    ad: { name: "Werbung", poly: AG.adPoly, walkTo: AG.ad, face: "nw", look: ["Die Werbung zeigt Kiemen, Schulden und ein Spiel.", "Alle drei Sekunden kommt was anderes, das ich nicht brauche."] },
    niche: { name: "Nische", poly: AG.nichePoly, walkTo: AG.niche, face: "nw", look: "In der Nische liegen eine Matratze und ein Topf. Hier wohnt jemand." },
    // the balcony over the water (the user's wish): only to look at
    water: { name: "Wasser", poly: AG.waterPoly, walkTo: AG.water, face: "se",
      look: ["Das Wasser spiegelt das Grün vom Waschsalon, als wär's was Schönes.", "Irgendwo da unten liegt die alte Stadt."] },
    cables: { name: "Kabel", poly: AG.cablesPoly, walkTo: AG.niche, face: "nw", look: "Die Kabel sind armdick, und alle tropfen. Keiner weiß mehr, wohin sie gehen." },
  } });
const AT_DRYER = ["!off_main", { or: [["day=3", "time>=20:00"], "day=4"] }];     // it lies there from when she has left it (the clock stands while Juno walks); Lantern only hears of it at the meeting
// baked from its map (art/rooms/laundromat.map.js); the man asleep behind the counter is a figure of his own on his own chair, and
// the same props make CAM 23 (one place, one picture)
const SLEEPER = { id: "sleeper", image: "mock_sleeper", at: AW.sleeper };
Cutaway.room("laundromat", { name: "SUDS & SPIN", background: "laundromat_bg", walk: AW.walk, holes: AW.holes, props: [...AW.props, SLEEPER],
  light: { ambient: 0.8, lamps: AW.lamps.map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
  ambience: ["fridge_hum", "neon_buzz"], music: { theme: "juno", intensity: 0.3 },
  hotspots: {
    door: { name: "Tür", poly: AW.doorPoly, walkTo: AW.door, face: "sw", use: [{ goto: "gasse", at: AG.laundromat, face: "sw" }] },
    dryers: { name: "Trockner", poly: AW.dryersPoly, walkTo: AW.dryer6, face: "ne", look: "In den acht Trocknern drehen sich drei Paar Turnschuhe, trotz des Schilds." },
    dryer6: { name: "Trockner 6", poly: AW.dryer6Poly, walkTo: AW.dryer6, face: "ne", z: 1, look: "Auf Trockner 6 steht OUT OF ORDER, und das schon länger.",
      use: [{ if: AT_DRYER, then: [{ if: "stick_ines", then: ["Hier lag er."], else: ["Da liegt was drin, ein Datenstick.", "Auf dem Stick ist ein Schlüssel und sonst nichts. Wozu, weiß ich nicht."] }, { dialog: "stick" }],
        else: ["Er ist kalt und leer."] }] },
    counter: { name: "Theke", poly: AW.counterPoly, walkTo: AW.counter, face: "ne", look: "Hinter der Theke schläft ein Mann, seit Jahren.", use: ["Das ist nichts für mich."] },
  } });
Cutaway.item("stick", { name: "Ines' Stick", icon: "inv_stick", look: "Auf dem Datenstick ist ein Schlüssel und sonst nichts. Wozu, weiß ich nicht." });
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
    { if: "!p1", then: [{ set: "moth_kind" }, { set: "p1", value: "full" }, { set: "chits", value: 0 }, { ledger: "kessler", value: "full" }, { cache: "clip_kessler_ring" }, { cache: "note_kessler_debt" }] },
    { set: "code_cam03" }, { set: "link_cam03" }, { cache: "note_kessler_photo" }, { cache: "note_obs_handbook" },
    { set: "code_cam21" }, { set: "link_cam21" }, { set: "code_cam30" }, { set: "link_cam30" }, { set: "code_cam18" }, { set: "link_cam18" }, { set: "code_cam07" }, { set: "link_cam07" },   // Juno's old access
    { set: "know_ines" }, { set: "saw_varga" }, { set: "read_kessler" },
    { set: "fridge_empty" }, { set: "rent_notice" }, { set: "moth_met" }, { set: "bao_soup" },
    { been_to: ["flat", "deck", "kessel_14", "kessel_lobby", "kowalski", "gasse", "laundromat", "sims", "dach", "dach_blick", "dach_sitzen", "lucky_static", "jade_row", "okonkwo_shop", "drain_market", "sable_booth", "cam15", "signal_lost", "flat_danach", "cam03", "cam07", "cam07v", "cam14", "cam18", "cam21", "cam22", "cam23", "cam24", "cam30", "cam31"] },
    { ledger: "wren_advance", value: "paid" }, { set: "imai_step", value: 0 }, { solo: true },
  ],
});
})();

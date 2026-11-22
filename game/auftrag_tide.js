// Nagiwa: job B of Chapter 1, "Der Eckladen" (docs/kapitel1-design.md §4). TIDE wants the code of Okonkwo's safe in Jade Row.
// From above (cam07) his back hides the keypad when he opens it at 01:00; the machine across the lane sees it at hip height, once it is tapped
// (a tap from Ratz on the Drain Market). Then K1b: sell the code, sell a false one, or warn him in his shop. Lt. Morrow takes an envelope at 00:30.
//   got_tap   Juno has bought the tap (the item `abzweiger` until it is used on the machine)
//   k1b       sold | lied | warned
// (and code_cam07v, link_cam07v, cache_note_safe_code, cache_clip_morrow_bribe)
// A thread of its own (off_tide, CLAUDE.md, checks); what it shares with the others is only money.
// The design's three positions of cam07 are dropped in the mock: since the shop stands in Jade Row, cam07 has one view down the lane.
"use strict";

(function () {
const AJ = Nagiwa.at.jade_row, A7 = Nagiwa.at.cam07, AV = Nagiwa.at.cam07v, AO = Nagiwa.at.okonkwo_shop, AM = Nagiwa.at.drain_market;
const O = (/** @type {string} */ text) => ({ say: "okonkwo", text });
const RZ = (/** @type {string} */ text) => ({ say: "ratz", text });
const OPEN = "time<01:00";      // the shop is open from the evening until one, every evening
// Okonkwo's figure (art/characters/okonkwo.px.js): behind his counter he faces the room whichever way the engine turns him; in CAM 07 his back
const every = (/** @type {string} */ anim) => ({ se: anim, sw: anim, ne: anim, nw: anim });
const IDLE = every("okonkwo_idle_sw"), TALK = every("okonkwo_talk_sw"), BACK = every("okonkwo_idle_ne");

// ---- the chat: TIDE's message, what Juno can send (the code she has is her only way in: nothing to accept first)
Object.assign(Nagiwa.contacts, { tide: { name: "TIDE", color: "#7ab0c0", status: "online", if: ["day>1", "day<5", "!off_tide"], unread: "!read_tide",
  open: [{ if: "!read_tide", then: [{ set: "read_tide" }, "Es geht um Okonkwo. Der grüßt mich jeden Abend."] }] } });
Cutaway.state.view("read_tide");
Nagiwa.threads.tide = [
  { from: "tide", at: "18:15", text: "Okonkwo, Jade Row. Wir wollen den Tresorcode. 500. Keine Fragen." },
  { from: "juno", if: "k1b=sold", text: "4-1-7-0-9." },
  { from: "tide", if: "k1b=sold", text: "500. Gut." },
  { from: "juno", if: "k1b=lied", text: "3-8-2-0-6." },
  { from: "tide", if: "k1b=lied", text: "250 jetzt. Den Rest, wenn er aufgeht." },
];
Nagiwa.replies.tide = [
  { id: "sold", text: "Den Code senden.", if: ["cache_note_safe_code", "!k1b"],
    use: [{ set: "k1b", value: "sold" }, { ledger: "tide", value: "sold" }, "Fünf Zahlen bringen fünfhundert Chits.", { evi: "froh" }, { say: "evi", text: "Ein Tresor! Was ist da drin?" }, "Nicht meins."] },
  { id: "lied", text: "Einen falschen Code senden.", if: ["cache_note_safe_code", "!k1b"],
    use: [{ set: "k1b", value: "lied" }, { ledger: "tide", value: "lied" }, "Das merken die erst, wenn sie davorstehen.", { evi: "verwirrt" }, { say: "evi", text: "Der stimmt aber nicht. Ich hab mitgelesen." }, "Eben."] },
];
Object.assign(Nagiwa.ledger, {
  tide: { to: "TIDE", what: { sold: "Okonkwos Tresor", lied: "ein falscher Code" }, chits: { sold: 500, lied: 250 } },
  okonkwo: { to: "OKONKWO", what: { warned: "gewarnt. Eine Stange Reis" } },
});
Nagiwa.cache.note_safe_code = { kind: "note", name: "OKONKWOS TRESOR", about: "Jade Row, unter der Theke. Um eins macht er auf. 4-1-7-0-9." };
Nagiwa.cache.clip_morrow_bribe = { kind: "clip", name: "MORROWS UMSCHLAG", about: "Jade Row, 00:30. Lt. Morrow nimmt einen Umschlag von einem Tidewater-Jungen. „Freitag fährt keiner die Kowalski.“" };

// ---- CAM 07, Nagi·wa's camera over the lane (Juno's old access): from above Okonkwo's back hides the keypad
Nagiwa.cams.cam07 = { id: "07", place: "JADE ROW", owner: "NAGI·WA", map: [64, 62], if: { or: [["day>1", "day<5", "!off_tide"], "day>4"] } };
Nagiwa.cams.cam07v = { id: "07V", place: "JADE ROW, AUTOMAT", owner: "SMILE FOR A COUPON", map: [8, 86], if: ["link_cam07v", "!off_tide"] };
Cutaway.actor("okonkwo_feed", { name: "Okonkwo", color: "#d8b890",
  costume: { idle: BACK, walk: BACK, talk: BACK },
  look: ["Okonkwo hat den Laden zu und tippt an der Kasse."],
  talk: ["Er macht den Tresor über die Kasse auf.", "Das kleine Display zeigt zum Fenster. Von hier oben seh ich nur einen Strich.", "Das ist der falsche Winkel. Ich brauch was auf Augenhöhe."] });
// the night's other business: a patrol car stops in front of the shop, a Tidewater boy hands Lt. Morrow an envelope
// (Morrow, the boy and the patrol car painted in art/characters/tide_people.px.js; they face the lane whichever way the engine turns them)
for (const [id, name, color, idle, talk, pitch] of /** @type {[string, string, string, string, string, number][]} */ ([
  ["morrow", "Lt. Morrow", "#a8b8d0", "morrow_idle_se", "morrow_talk_se", 50], ["tide_boy", "Tidewater-Junge", "#7ab0c0", "tideboy_idle_se", "tideboy_talk_se", 64],
  ["streife", "Streifenwagen", "#a8b8d0", "streife_idle", "streife_idle", 40]]))
  Cutaway.actor(id, { name, color, costume: { idle: every(idle), walk: every(idle), talk: every(talk) }, voice: { pitch, range: 3, wave: "triangle", syllable: 80 },
    look: id === "tide_boy" ? ["Er hat Kiemen am Hals, und an ihnen leuchten die Markierungen wie kleine Lampen.", "Das ist einer von den Tidewater Boys."]
      : id === "morrow" ? ["Das ist Lieutenant Morrow vom Revier 9.", "Sie trägt einen Trenchcoat und sieht müde aus."] : ["Das ist ein Wagen vom Revier 9, und sein Motor läuft.", { evi: "froh" }, { say: "evi", text: "Der hat einen Schnorchel! Fährt er damit durchs Wasser, wenn die Pumpen ausfallen?" }],
    talk: [{ if: "day>4", then: [{ dialog: "morrow_k2" }], else: [{ dialog: "morrow_bribe" }] }] });     // (Chapter 2: decision 2, game/kapitel2.js)
const BRIBE = [{ say: "tide_boy", text: "Wie abgemacht." }, { say: "morrow", text: "Das ist für die ruhige Woche. Freitag fährt keiner die Kowalski." }, "Das ist Morrow. Sie verkauft den Freitag für einen Umschlag."];
Cutaway.dialog("morrow_bribe", { main: { choices: [
  { text: "Aufnehmen.", silent: true, if: "!cache_clip_morrow_bribe", goto: "end", then: [...BRIBE, { cache: "clip_morrow_bribe" }, "Ich hab's. Das ist mehr wert als der Umschlag."] },
  { text: "Nur zuhören.", silent: true, goto: "end", then: BRIBE },
] } });
Cutaway.routine("okonkwo_feed", [{ day: [2, 3], from: "01:00", to: "01:15", if: "!off_tide", room: "cam07", at: A7.okonkwo }]);
// in Chapter 2 her round stops in Jade Row itself on Saturday and Sunday, and Juno can go to her with the clip (kapitel2-design §3.6: the
// main thread's, not this job's)
Cutaway.routine("morrow", [{ day: [2, 3], from: "00:30", to: "00:45", if: "!off_tide", room: "cam07", at: A7.morrow, face: "se" },
  { day: [5, 6], from: "00:30", to: "00:45", if: "!off_main", room: "jade_row", at: AJ.morrow, face: "sw" }]);
Cutaway.routine("tide_boy", [{ day: [2, 3], from: "00:30", to: "00:45", if: "!off_tide", room: "cam07", at: A7.boy, face: "se" }]);
Cutaway.routine("streife", [{ day: [2, 3], from: "00:30", to: "00:45", if: "!off_tide", room: "cam07", at: A7.car }]);
// CAM 07 is Jade Row's own picture under the feed's filter (one place, one picture), moved right by A7.shift; its steam and the heads
// along the bottom edge as in the lane
Nagiwa.camRoom("cam07", { background: undefined, color: Nagiwa.PHOSPHOR[0], mic: { at: A7.mic, clear: 40, lost: 150 },
  post: [{ exposure: A7.exposure }, ...Nagiwa.FEED_POST],
  props: [
    { id: "lane", image: "jade_row_bg", at: [A7.shift, 0], anchor: [0, 0], baseline: -1000 },
    ...Cutaway.room.get("jade_row").props.filter((/** @type {any} */ p) => !p.hidden).map((/** @type {any} */ p) => ({ ...p, at: [p.at[0] + A7.shift, p.at[1]] })),
  ],
  hotspots: {
  shop: { name: "Okonkwos Laden", poly: A7.windowPoly, look: ["Durch das Fenster von Okonkwos Laden seh ich nicht viel.", "Den Tresor seh ich sowieso nicht, der ist unter der Theke."] },
  machine: { name: "Automat", rect: A7.machineRect, look: "Auf dem Automaten gegenüber steht SMILE FOR A COUPON. Der sieht ihm genau ins Fenster." },
} });

// ---- CAM 07V, the machine's own camera, once tapped: hip height, straight into the shop
const READ = [{ zoom: "zoom_keypad" }, "Auf dem Kundendisplay soll der Preis stehen. Da steht aber jede Taste.", "Vier. Eins. Sieben. Null. Neun.", "Er tippt, wie man eine Nummer tippt, die man seit Jahren kennt.", { zoom: false }, { cache: "note_safe_code" }, "Tut mir leid, Herr Okonkwo."];
Cutaway.actor("okonkwo_v", { name: "Okonkwo", color: "#d8b890",
  costume: { idle: IDLE, walk: IDLE, talk: TALK },
  look: ["Okonkwo steht mit der Lesebrille an der Theke. Der Tresor ist unter ihm."],
  talk: ["Er verkauft Batterien. Den Tresor macht er erst auf, wenn er um eins zu hat."] });
Cutaway.actor("okonkwo_safe", { name: "Okonkwo", color: "#d8b890",
  costume: { idle: IDLE, walk: IDLE, talk: TALK },
  look: ["Okonkwo steht an der Kasse. Von hier sehe ich alles, was er tippt."],
  talk: [{ if: "k1b=warned", then: ["Er tippt einen neuen Code. Gut so."], else: [{ if: "cache_note_safe_code", then: ["Den Code hab ich."], else: READ }] }] });
Cutaway.routine("okonkwo_v", [{ day: [2, 3, 4], from: "18:00", to: "01:00", if: "!off_tide", room: "cam07v", at: AV.okonkwo }]);
Cutaway.routine("okonkwo_safe", [{ day: [2, 3], from: "01:00", to: "01:15", if: "!off_tide", room: "cam07v", at: AV.okonkwo }]);
// CAM 07V is the shop's own picture under the feed's filter (one place, one picture): Okonkwo behind his counter as in the shop
Nagiwa.camRoom("cam07v", { background: undefined, color: Nagiwa.PHOSPHOR[0], mic: { at: AV.mic, clear: 40, lost: 150 },
  post: [{ exposure: AV.exposure }, ...Nagiwa.FEED_POST],
  props: [{ id: "shop", image: "okonkwo_shop_bg", at: [0, 0], anchor: [0, 0], baseline: -1000 }, ...AO.props], hotspots: {
  safe: { name: "Kasse", poly: AV.safePoly, z: 1, look: ["Der Tresor unter der Theke hängt an der Kasse.", "Und ihr Kundendisplay zeigt genau zu mir."] },
  shelves: { name: "Regale", rect: AV.shelvesRect, look: "Da stehen Reis, Batterien und Zigaretten, und ein Foto, das ich von hier nicht erkenne." },
  rewind: { name: "Puffer", z: 5, if: ["day<4", "time>=01:15", "!cache_note_safe_code", "!k1b"], use: [{ rewind: "01:00" }, ...READ, { live: true }] },   // (the buffer rewound: game/puffer.js)
} });

// ---- the machine in Jade Row: the tap goes into its service hatch, round the back, once the drone has passed (Juno waits for it herself:
// nothing hangs on timing, CLAUDE.md)
Cutaway.item("abzweiger", { name: "Abzweiger", icon: "inv_tap", look: "Den Abzweiger hab ich von Ratz. Er klemmt sich an alles, was ein Kabel hat." });
Cutaway.item("reis", { name: "Reis", icon: "inv_reis", look: "Die Stange Reis und die Batterien hat mir Okonkwo gegeben." });
const jade = Cutaway.room.get("jade_row");
jade.props.push({ id: "drone", image: "drone_hover", at: AJ.droneFrom, hidden: true, baseline: 2 });
const TAP = [
  "Hinten am Automaten ist die Wartungsklappe. Da sieht keiner hin.",
  { move: "drone", to: AJ.droneFrom, ms: 1 }, { show: "drone" }, { move: "drone", to: AJ.droneStop, ms: 1600 },
  "Außer der Drohne. Solange die guckt, mach ich nichts.", { move: "drone", to: AJ.droneTo, ms: 1400 }, { hide: "drone" },
  "Jetzt.", { remove: "abzweiger" }, { set: "code_cam07v" }, { set: "link_cam07v" }, { sfx: "link" }, "Er ist angezapft. Die Automatenkamera ist jetzt auf dem Deck, CAM 07V.",
];
Object.assign(jade.hotspots.machine, {
  use: [{ if: "link_cam07v", then: ["Der hängt jetzt an meinem Deck. Er weiß es nicht."],
    else: ["Hinten ist eine Wartungsklappe. Ohne Abzweiger komm ich da nicht ran."] }],
  with: { abzweiger: [{ if: "!link_cam07v", then: TAP, else: ["Der hängt schon dran."] }] } });
jade.hotspots.door = { name: "Okonkwos Laden", poly: AJ.doorPoly, walkTo: AJ.shop, face: "nw",
  look: [{ if: OPEN, then: ["Der Laden hat offen, wie jeden Abend."], else: ["Der Laden ist zu. Okonkwo macht um eins dicht."] }],
  use: [{ if: OPEN, then: [{ goto: "okonkwo_shop", at: AO.arrive, face: "ne" }], else: ["Der Laden ist zu. Okonkwo macht um eins dicht."] }] };

// ---- the shop: Okonkwo, who greets her every evening; warning him is telling him
Cutaway.actor("okonkwo", { name: "Okonkwo", color: "#d8b890", room: "okonkwo_shop", at: AO.okonkwo, facing: "sw", walkTo: AO.front, face: "ne",
  costume: { idle: IDLE, walk: IDLE, talk: TALK }, voice: { pitch: 46, range: 3, wave: "triangle", syllable: 90, speed: 0.85 },
  look: ["Das ist Okonkwo mit seiner Strickjacke und der Lesebrille. Er rechnet noch auf Papier.", "Unter der Jacke wölbt sich sein Panzer. Den hat er schon, solange ich ihn kenne."],
  talk: [{ if: ["day>4", "k1b=warned"], then: [O("Juno! Komm rein, komm rein."), O("Für dich ist hier immer offen.")], else: [O("Juno. Guten Abend.")] }, { dialog: "okonkwo" }] });
Nagiwa.talkTree("okonkwo", [
  ["„Na, wie läuft der Laden?“", [
    { if: "day=2", then: [O("Batterien gehen. Reis geht. Zigaretten gehen immer."), "Und du?", O("Ich gehe um eins.")] },
    { if: "day=3", then: [O("Draußen steht ein Wagen und wartet. Der wartet nicht auf mich.")] },
    { if: "day=4", then: [O("Heute ist es ruhig. Zu ruhig für einen Freitag.")] },
    // Chapter 2 (kapitel2-design §5): after a false code the boys stood at his door on Friday night; warned, he has a new one
    { if: "day>4", then: [{ if: "k1b=lied", then: [O("Freitagnacht waren welche an meiner Tür. Mit einem Zettel in der Hand."), O("Der Zettel hat nicht gestimmt. Dann sind sie gegangen.")],
      else: [{ if: "k1b=warned", then: [O("Neuer Code. Neuer Riegel. Ich schlaf wieder.")], else: [O("Batterien gehen. Reis geht. Wie immer.")] }] }] },
  ]],
  ["„Wer ist auf dem Foto da?“", [O("Meine Familie. Am Strand, vor dem Wasser."), "Hier unten war ein Strand?", O("Da, wo jetzt der Drain-Markt ist. Wir hatten Handtücher.")]],
  ["„Pass auf. Die Tidewater Boys wollen an deinen Tresor.“", [{ set: "k1b", value: "warned" }, { ledger: "okonkwo", value: "warned" }, O("..."), O("Woher weißt du das?"), "Die haben mich nach dem Code gefragt.",
    O("Und du kommst zu mir."), O("Ich mach heute Nacht einen neuen."), O("Hier hast du eine Stange Reis. Und Batterien."), { give: "reis" }, O("Ich vergesse das nicht."),
    { evi: "verwirrt" }, { say: "evi", text: "Fünfhundert. Gegen Reis?" }, "Gegen Reis."], undefined, ["!k1b", "!off_tide"]],
]);
Cutaway.room("okonkwo_shop", { name: "Okonkwos Laden", background: "okonkwo_shop_bg", walk: AO.walk, props: AO.props,
  ambience: ["fridge_hum"], music: { theme: "juno", intensity: 0.3 },
  hotspots: {
    door: { name: "Tür", poly: AO.doorPoly, walkTo: AO.door, face: "sw", use: [{ goto: "jade_row", at: AJ.shop, face: "se" }] },
    shelves: { name: "Regale", rect: AO.shelvesRect, walkTo: AO.shelves, face: "ne", look: "Reis, Batterien und Zigaretten stehen in Reihen, alles mit Preis, alles auf Papier." },
    counter: { name: "Theke", rect: AO.counterRect, walkTo: AO.front, face: "ne", look: [{ if: "k1b=sold", then: ["Unter der Theke ist der Tresor, und den Code hab ich verkauft. Er grüßt mich trotzdem."], else: ["Unter der Theke ist der Tresor. Ob er weiß, dass ich's weiß? Nein."] }] },
    photo: { name: "Foto", rect: AO.photoRect, walkTo: AO.front, face: "ne", look: "Eine Familie steht am Strand, und hinter ihnen ist die alte Stadt noch trocken." },
  } });

// ---- Ratz on the Drain Market: a cable rat from the old flood programme, his collar mixes up a word now and then
// (seen straight down on his crate behind the junk, art/characters/markt_people.px.js; Juno talks to him from before his stall)
Cutaway.actor("ratz", { name: "Ratz", color: "#90d0a0", room: "drain_market", at: AM.ratz, facing: "down", walkTo: AM.ratzTalk, face: "up",
  costume: { idle: Nagiwa.top("ratz_top_idle"), walk: Nagiwa.top("ratz_top_idle"), talk: Nagiwa.top("ratz_top_talk") }, voice: { pitch: 72, range: 6, wave: "square", syllable: 55, speed: 1.3 },
  look: ["Das ist Ratz, eine Kabelratte, so groß wie ein kleiner Hund. Sein Parka wird ihm nie passen.",
    "Sein Schwanz endet in einem alten Stecker. Der Kragen leuchtet, wenn er redet, und er redet viel."],
  talk: [RZ("Kundschaft! Kauf was, oder kauf was anderes."), { dialog: "ratz" }] });
Nagiwa.talkTree("ratz", [
  ["„Was verkaufst du da alles?“", [RZ("Alles, was nicht festgeschraubt ist. Und Schraubenzieher.")], [
    ["„Hast du einen Abzweiger? Ich muss an ein Kabel.“", [RZ("Sechzig Chits. Freundschaftspreis."), RZ("Feindschaftspreis wär achtzig. Wir sind Freunde?")], [
      ["„Hier sind sechzig.“", [{ inc: "chits", by: -60 }, { give: "abzweiger" }, { set: "got_tap" }, RZ("Freunde. Ich hab's gewusst."), RZ("Der klemmt an allem, was ein Kabel hat. Auch an Kabeln.")], undefined, ["chits>=60", "!got_tap"]],
      ["„Das ist zu teuer.“", [RZ("Dann sind wir Feinde. Achtzig.")]],
    ], ["!got_tap", "!off_tide"]],
    ["„Was ist das da, mit den Drähten?“", [RZ("Das ist ein Ding. Ich weiß nicht, was es macht, darum ist es teuer.")]],
  ]],
  ["„Woher hast du den Kragen?“", [RZ("Vom Flutprogramm. Das ist ein Sprechkragen, Modell zwei."), "Und Modell eins?", RZ("Hat gebissen."), "Wer?", RZ("Der Kragen.")]],
  ["„Und du? Suchst du auch was?“", [RZ("Hast du Ratten gesehen? In den Rohren, unter der Krone. Große."), "Nur dich.", RZ("Dann sag's keinem. Die zählen auf mich.")]],
]);
})();

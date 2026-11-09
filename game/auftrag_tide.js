// Nagiwa: job B of Chapter 1, "Der Eckladen" (docs/kapitel1-design.md §4), on blocks. TIDE wants the code of Okonkwo's safe in Jade Row.
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

// ---- the chat: TIDE's message, what Juno can send (the code she has is her only way in: nothing to accept first)
Object.assign(Nagiwa.contacts, { tide: { name: "TIDE", color: "#7ab0c0", status: "online", if: ["day>1", "!off_tide"], unread: "!read_tide",
  open: [{ if: "!read_tide", then: [{ set: "read_tide" }, "Okonkwo. Der grüßt mich jeden Abend."] }] } });
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
    use: [{ set: "k1b", value: "sold" }, { ledger: "tide", value: "sold" }, "Fünf Zahlen. Fünfhundert Chits.", { evi: "froh" }, { say: "evi", text: "Ein Tresor! Was ist da drin?" }, "Nicht meins."] },
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
Nagiwa.cams.cam07 = { id: "07", place: "JADE ROW", owner: "NAGI·WA", map: [64, 62], if: ["day>1", "!off_tide"] };
Nagiwa.cams.cam07v = { id: "07V", place: "JADE ROW, AUTOMAT", owner: "SMILE FOR A COUPON", map: [8, 86], if: ["link_cam07v", "!off_tide"] };
Cutaway.actor("okonkwo_feed", { name: "Okonkwo", color: "#d8b890",
  costume: { idle: "mock_okonkwo_back", walk: "mock_okonkwo_back", talk: "mock_okonkwo_back" },
  look: ["Okonkwo. Laden zu, und er tippt an der Kasse."],
  talk: ["Er macht den Tresor auf. Über die Kasse.", "Das kleine Display zeigt zum Fenster. Von hier oben seh ich nur einen Strich.", "Falscher Winkel. Ich brauch was auf Augenhöhe."] });
// the night's other business: a patrol car stops in front of the shop, a Tidewater boy hands Lt. Morrow an envelope
for (const [id, name, color, image, pitch] of /** @type {[string, string, string, string, number][]} */ ([
  ["morrow", "Lt. Morrow", "#a8b8d0", "mock_morrow", 50], ["tide_boy", "Tidewater-Junge", "#7ab0c0", "mock_tide", 64], ["streife", "Streifenwagen", "#a8b8d0", "mock_car_feed", 40]]))
  Cutaway.actor(id, { name, color, costume: { idle: image, walk: image, talk: image }, voice: { pitch, range: 3, wave: "triangle", syllable: 80 },
    look: id === "tide_boy" ? ["Kiemen, und am Hals die Markierung, hell wie eine Lampe. Ein Tidewater."] : id === "morrow" ? ["Lieutenant Morrow. Revier 9. Trenchcoat, müde."] : ["Revier 9. Der Motor läuft."],
    talk: [{ dialog: "morrow_bribe" }] });
const BRIBE = [{ say: "tide_boy", text: "Wie abgemacht." }, { say: "morrow", text: "Das ist für die ruhige Woche. Freitag fährt keiner die Kowalski." }, "Morrow. Für einen Umschlag."];
Cutaway.dialog("morrow_bribe", { main: { choices: [
  { text: "Aufnehmen.", silent: true, if: "!cache_clip_morrow_bribe", goto: "end", then: [...BRIBE, { cache: "clip_morrow_bribe" }, "Hab ich. Das ist mehr wert als der Umschlag."] },
  { text: "Nur zuhören.", silent: true, goto: "end", then: BRIBE },
] } });
Cutaway.routine("okonkwo_feed", [{ day: [2, 3], from: "01:00", to: "01:15", if: "!off_tide", room: "cam07", at: A7.okonkwo }]);
Cutaway.routine("morrow", [{ day: [2, 3], from: "00:30", to: "00:45", if: "!off_tide", room: "cam07", at: A7.morrow, face: "se" }]);
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
  shop: { name: "Okonkwos Laden", rect: A7.windowRect, look: ["Okonkwos Laden von oben. Ich seh die Theke, und ihn, wenn er da ist.", "Den Tresor nicht. Der ist unter der Theke."] },
  machine: { name: "Automat", rect: A7.machineRect, look: "Der Automat gegenüber. SMILE FOR A COUPON. Der sieht ihm genau ins Fenster." },
} });

// ---- CAM 07V, the machine's own camera, once tapped: hip height, straight into the shop
const READ = [{ zoom: "zoom_keypad" }, "Das Kundendisplay. Da soll der Preis stehen. Da steht jede Taste.", "Vier. Eins. Sieben. Null. Neun.", "Er tippt, wie man eine Nummer tippt, die man seit Jahren kennt.", { zoom: false }, { cache: "note_safe_code" }, "Tut mir leid, Herr Okonkwo."];
Cutaway.actor("okonkwo_v", { name: "Okonkwo", color: "#d8b890",
  costume: { idle: "mock_okonkwo_bust", walk: "mock_okonkwo_bust", talk: "mock_okonkwo_bust" },
  look: ["Okonkwo an der Theke, mit der Lesebrille. Der Tresor ist unter ihm."],
  talk: ["Er verkauft Batterien. Den Tresor macht er erst auf, wenn er zu hat. Um eins."] });
Cutaway.actor("okonkwo_safe", { name: "Okonkwo", color: "#d8b890",
  costume: { idle: "mock_okonkwo_bust", walk: "mock_okonkwo_bust", talk: "mock_okonkwo_bust" },
  look: ["Okonkwo an der Kasse. Von hier sehe ich alles, was er tippt."],
  talk: [{ if: "k1b=warned", then: ["Er tippt einen neuen Code. Gut so."], else: [{ if: "cache_note_safe_code", then: ["Den Code hab ich."], else: READ }] }] });
Cutaway.routine("okonkwo_v", [{ day: [2, 3, 4], from: "18:00", to: "01:00", if: "!off_tide", room: "cam07v", at: AV.okonkwo }]);
Cutaway.routine("okonkwo_safe", [{ day: [2, 3], from: "01:00", to: "01:15", if: "!off_tide", room: "cam07v", at: AV.okonkwo }]);
// CAM 07V is the shop's own picture under the feed's filter (one place, one picture): Okonkwo behind his counter as in the shop
Nagiwa.camRoom("cam07v", { background: undefined, color: Nagiwa.PHOSPHOR[0], mic: { at: AV.mic, clear: 40, lost: 150 },
  post: [{ exposure: AV.exposure }, ...Nagiwa.FEED_POST],
  props: [{ id: "shop", image: "okonkwo_shop_bg", at: [0, 0], anchor: [0, 0], baseline: -1000 }], hotspots: {
  safe: { name: "Kasse", rect: AV.safeRect, look: ["Die Kasse. Der Tresor unter der Theke hängt an ihr.", "Und ihr Kundendisplay zeigt genau zu mir."] },
  shelves: { name: "Regale", rect: AV.shelvesRect, look: "Reis, Batterien, Zigaretten. Und ein Foto, das ich von hier nicht erkenne." },
  rewind: { name: "Puffer", z: 5, if: ["day<4", "time>=01:15", "!cache_note_safe_code", "!k1b"], use: ["Puffer. Zurück auf eins.", ...READ] },
} });

// ---- the machine in Jade Row: the tap goes into its service hatch, round the back, once the drone has passed (Juno waits for it herself:
// nothing hangs on timing, CLAUDE.md)
Cutaway.item("abzweiger", { name: "Abzweiger", icon: "inv_tap", look: "Ein Abzweiger von Ratz. Klemmt sich an alles, was ein Kabel hat." });
Cutaway.item("reis", { name: "Reis", icon: "inv_reis", look: "Eine Stange Reis und Batterien. Von Okonkwo." });
const jade = Cutaway.room.get("jade_row");
jade.props.push({ id: "drone", image: "drone_hover", at: [-30, 60], hidden: true, baseline: 2 });
const TAP = [
  "Hinten am Automaten ist die Wartungsklappe. Da sieht keiner hin.",
  { move: "drone", to: [-30, 60], ms: 1 }, { show: "drone" }, { move: "drone", to: [200, 64], ms: 1600 },
  "Außer der Drohne. Nicht, solange die guckt.", { move: "drone", to: [360, 58], ms: 1400 }, { hide: "drone" },
  "Jetzt.", { remove: "abzweiger" }, { set: "code_cam07v" }, { set: "link_cam07v" }, { sfx: "link" }, "Angezapft. Die Automatenkamera ist auf dem Deck: CAM 07V.",
];
Object.assign(jade.hotspots.machine, {
  use: [{ if: "link_cam07v", then: ["Der hängt jetzt an meinem Deck. Er weiß es nicht."],
    else: ["Hinten ist eine Wartungsklappe. Ohne Abzweiger komm ich da nicht ran."] }],
  with: { abzweiger: [{ if: "!link_cam07v", then: TAP, else: ["Der hängt schon dran."] }] } });
jade.hotspots.door = { name: "Okonkwos Laden", rect: AJ.doorRect, walkTo: AJ.shop, face: "nw",
  look: [{ if: OPEN, then: ["Offen. Wie jeden Abend."], else: ["Zu. Okonkwo macht um eins dicht."] }],
  use: [{ if: OPEN, then: [{ goto: "okonkwo_shop", at: AO.arrive, face: "ne" }], else: ["Zu. Okonkwo macht um eins dicht."] }] };

// ---- the shop: Okonkwo, who greets her every evening; warning him is telling him
Cutaway.actor("okonkwo", { name: "Okonkwo", color: "#d8b890", room: "okonkwo_shop", at: AO.okonkwo, facing: "sw", walkTo: AO.front, face: "ne",
  costume: { idle: "mock_okonkwo_bust", walk: "mock_okonkwo_bust", talk: "mock_okonkwo_bust" }, voice: { pitch: 46, range: 3, wave: "triangle", syllable: 90, speed: 0.85 },
  look: ["Okonkwo. Strickjacke, Lesebrille. Er rechnet noch auf Papier."],
  talk: [O("Juno. Guten Abend."), { dialog: "okonkwo" }] });
Nagiwa.talkTree("okonkwo", [
  ["„Wie läuft's?“", [
    { if: "day=2", then: [O("Batterien gehen. Reis geht. Zigaretten gehen immer."), "Und du?", O("Ich gehe um eins.")] },
    { if: "day=3", then: [O("Draußen steht ein Wagen und wartet. Der wartet nicht auf mich.")] },
    { if: "day=4", then: [O("Heute ist es ruhig. Zu ruhig für einen Freitag.")] },
  ]],
  ["„Das Foto da?“", [O("Meine Familie. Am Strand, vor dem Wasser."), "Hier unten war ein Strand?", O("Da, wo jetzt der Drain-Markt ist. Wir hatten Handtücher.")]],
  ["„Die Tidewater Boys wollen deinen Tresor.“", [{ set: "k1b", value: "warned" }, { ledger: "okonkwo", value: "warned" }, O("..."), O("Woher weißt du das?"), "Die haben mich gefragt. Nach dem Code.",
    O("Und du kommst zu mir."), O("Ich mach heute Nacht einen neuen."), O("Hier. Eine Stange Reis. Und Batterien."), { give: "reis" }, O("Ich vergesse das nicht."),
    { evi: "verwirrt" }, { say: "evi", text: "Fünfhundert. Gegen Reis?" }, "Gegen Reis."], undefined, ["!k1b", "!off_tide"]],
]);
Cutaway.room("okonkwo_shop", { name: "Okonkwos Laden", background: "okonkwo_shop_bg", walk: AO.walk,
  ambience: ["fridge_hum"], music: { theme: "juno", intensity: 0.3 },
  hotspots: {
    door: { name: "Tür", rect: AO.doorRect, walkTo: AO.door, face: "sw", use: [{ goto: "jade_row", at: AJ.shop, face: "se" }] },
    shelves: { name: "Regale", rect: AO.shelvesRect, walkTo: AO.shelves, face: "ne", look: "Reis, Batterien, Zigaretten. Alles in Reihen, alles mit Preis, alles auf Papier." },
    counter: { name: "Theke", rect: AO.counterRect, walkTo: AO.front, face: "ne", look: [{ if: "k1b=sold", then: ["Unter der Theke der Tresor. Den Code hab ich verkauft. Er grüßt mich trotzdem."], else: ["Die Theke. Unter ihr der Tresor. Er weiß, dass ich's weiß? Nein."] }] },
    photo: { name: "Foto", rect: AO.photoRect, walkTo: AO.front, face: "ne", look: "Eine Familie am Strand. Hinter ihnen die alte Stadt, noch trocken." },
  } });

// ---- Ratz on the Drain Market: a cable rat from the old flood programme, his collar mixes up a word now and then
Cutaway.actor("ratz", { name: "Ratz", color: "#90d0a0", room: "drain_market", at: AM.ratz, facing: "sw", walkTo: AM.ratzTalk, face: "ne",
  costume: { idle: "mock_ratz", walk: "mock_ratz", talk: "mock_ratz" }, voice: { pitch: 72, range: 6, wave: "square", syllable: 55, speed: 1.3 },
  look: ["Ratz. Eine Kabelratte, so groß wie ein kleiner Hund, in einem Parka, der ihm nie passen wird.", "Der Kragen leuchtet, wenn er redet. Er redet viel."],
  talk: [RZ("Kundschaft! Kauf was, oder kauf was anderes."), { dialog: "ratz" }] });
Nagiwa.talkTree("ratz", [
  ["„Was hast du da?“", [RZ("Alles, was nicht festgeschraubt ist. Und Schraubenzieher.")], [
    ["„Einen Abzweiger. Hast du einen?“", [RZ("Sechzig Chits. Freundschaftspreis."), RZ("Feindschaftspreis wär achtzig. Wir sind Freunde?")], [
      ["„Sechzig. Hier.“", [{ inc: "chits", by: -60 }, { give: "abzweiger" }, { set: "got_tap" }, RZ("Freunde. Ich hab's gewusst."), RZ("Klemmt an alles, was ein Kabel hat. Auch an Kabel.")], undefined, ["chits>=60", "!got_tap"]],
      ["„Zu teuer.“", [RZ("Dann sind wir Feinde. Achtzig.")]],
    ], ["!got_tap", "!off_tide"]],
    ["„Was ist das da, mit den Drähten?“", [RZ("Ein Ding. Ich weiß nicht, was es macht. Darum ist es teuer.")]],
  ]],
  ["„Woher hast du den Kragen?“", [RZ("Flutprogramm. Sprechkragen, Modell zwei."), "Und Modell eins?", RZ("Hat gebissen."), "Wer?", RZ("Der Kragen.")]],
  ["„Was willst du wissen?“", [RZ("Hast du Ratten gesehen? In den Rohren, unter der Krone. Große."), "Nur dich.", RZ("Dann sag's keinem. Die zählen auf mich.")]],
]);
Cutaway.room.get("drain_market").hotspots.stalls.look = "Elektroschrott, sortiert nach nichts. Davor steht Ratz.";
})();

// Nagiwa: Chapter 2, finding Lantern (docs/kapitel2-design.md §3.5, L1–L5), on blocks. On Sunday at ten the big screen on Kowalski Street
// tears for ten seconds of Lantern's green; the half repair saw that it came by cable, from below; the cable runs into the Drain Market's
// canal and along it to the raft DATA 1C/GB, which lies out on the water at its rope. The hook pulls it to the edge, and on it stands Pike,
// Lantern's helper (the heron): he takes Juno along once she brings him the output stage Lantern needs, which only Ratz has and won't sell
// him; Ratz gives it to Juno for a copy of her old pass. Pike poles her out to the drowned forest, where Lantern lives in a caravan on
// pontoons. Juno can give him the stick there. (The user's decision, 2026-11-16: before, Ratz opened the chain on the stairs for the pass.)
//   know_cable     the half repair told her where the screen's words came from (from Sunday 22:00)
//   pike_met       she has pulled Pike's raft to the edge and knows what he wants
//   ledger_ratz    Ratz has his copy of her pass, and she has the output stage (the item endstufe) until she gives it to Pike
//   lantern_found  found | ally: she has found his hide; ally once she has brought him the stick (then they say du)
// The way is checked on its own (off_lantern shuts it in the other runs: the half repair doesn't know, the screen doesn't tear), since its
// steps would multiply every state of the chapter: tools/check.sh, the run "lantern" (Juno with the stick, the flat and the forgery done).
// Lantern's and Pike's voices: dialog-style-guide §6 (drafts). [PLATZHALTER] Pike is a figure of the market's crowd, the output stage has
// the tap's icon, the raft doesn't leave the market visibly, the caravan inside is the old shop's iso block, Lantern in it is his feed
// figure (the ride and the arrival are painted: art/rooms/sumpf.px.js); the words on the screen are a caption over the stutter until the street's picture shows
// them (§13, 4)
"use strict";

(function () {
const AV = Nagiwa.at.lantern_versteck, AM = Nagiwa.at.drain_market;
const L = (/** @type {string} */ text) => ({ say: "lantern_k2", text });
const R = (/** @type {string} */ text) => ({ say: "reparatur", text });
const RZ = (/** @type {string} */ text) => ({ say: "ratz", text });
const P = (/** @type {string} */ text) => ({ say: "pike", text });
const HIJACK_AFTER = { or: ["day=7", ["day=6", "time>=22:00"]] };     // Lantern's ten seconds have been

// ---- L1, Sunday 22:00: the big screen tears in the middle of SLEEP BETTER. Seen from the street; whoever isn't there reads it on Monday
// (the board, below). Forgotten overnight (game/kapitel2.js), so seen or not doesn't double Monday
Cutaway.i18n.declare("feed display", ["I DIDN'T KILL HER. – LANTERN"]);
Cutaway.moment("hijack", { room: "kowalski", day: 6, from: "22:00", to: "22:15", if: "!off_lantern", unseen: [], play: [
  { camera: [80, 0], ms: 1200 },
  { show: "ad_fx" }, { play: "ad_fx", anim: "kowalski_ad_stutter", loop: true, wait: false }, { sfx: "glitch" },
  { caption: "I DIDN'T KILL HER. – LANTERN", at: "c", color: "#7cff9a", ms: 3200 },
  { hide: "ad_fx" }, { sfx: "static", gain: 0.4 },
  "Zehn Sekunden. Dann war wieder SLEEP BETTER.",
  "Lantern. Er lebt, und er sendet.",
  { camera: "follow" },
] });

// ---- L2: the half repair, on his scaffold every evening of this chapter too. From Sunday ten he knows where the screen's words came from
Cutaway.time.routines.get("reparatur").push({ day: [5, 6, 7], from: "18:00", to: "04:00", room: "kowalski", face: "ne" });
const repair = /** @type {any} */ (Cutaway.actors.get("reparatur")).def;
repair.talk = [{ if: "day<5", then: repair.talk, else: [
  { if: "know_cable", then: [R("Das Kabel geht in den Gully. Weiter unten bin ich nicht zuständig.")],
    else: [{ if: [HIJACK_AFTER, "!off_lantern"], then: [
      R("Hast du's gesehen? Zehn Sekunden grün, mitten in SLEEP BETTER."),
      "Wo kam das her?",
      R("Das kam nicht über Funk. Das kam übers Kabel. Von unten."),
      R("Da, das neue Kabel hinterm Schirm. Das geht in den Gully."),
      R("Rechts. Nicht mein Vertrag."),
      "Von unten. Der Gully geht in den Kanal, und der Kanal geht unter dem Markt durch.",
      { set: "know_cable" },
    ], else: [{ if: "day=5", then: [R("Samstag. Da wird nicht geschraubt, da wird nur geguckt."), "Und was siehst du?", R("Die linke Hälfte. Die läuft.")],
      else: [R("Die Rechte macht heute, was sie will. Die Linke läuft."), "Und morgen?", R("Morgen ist Montag. Da läuft gar nichts.")] }] }] },
] }];

// ---- the stairs under the Drain Market stay shut: the cable doesn't go down there
const down = Cutaway.room.get("drain_market").hotspots.down;
down.use = [{ if: ["day>4", "know_cable"], then: ["Die Kette ist zu. Und das Kabel geht hier nicht runter.", "Es läuft an der Kanalmauer entlang, nach rechts."],
  else: down.use }];

// ---- L3: the raft DATA 1C/GB lies out on the canal at its rope. The hook pulls it to the edge, and Pike, on it, says what he wants
Cutaway.actor("pike", { name: "Pike", color: "#a8b4c8", walkTo: AM.pikeTalk, face: "down",
  costume: { idle: Nagiwa.top("statist_15_idle"), walk: Nagiwa.top("statist_15_idle"), talk: Nagiwa.top("statist_15_idle") },
  voice: { pitch: 58, range: 4, wave: "triangle", syllable: 95, speed: 0.85 },
  look: ["Ein langer Mann mit dünnen Beinen, er steht im Regen wie andere im Trockenen.", "Der Hals ist zu lang, das Gesicht läuft spitz zu. Ein Reiher-Mod."],
  talk: [{ if: "pike_met", then: [{ dialog: "pike" }], else: [
    { if: "know_cable", then: ["Das Kabel geht zu deinem Floß!", P("Ich verkauf Daten. Keine Fahrten."), "Er ist zu weit draußen. Ich müsste das Floß ranholen."],
      else: [P("Gigabyte gegen Chits."), "Danke. Ich hab selber welche."] }] }] });
Cutaway.routine("pike", [{ day: [5, 6, 7], from: "18:00", to: "04:00", room: "drain_market", at: AM.pike, face: "down" }]);
const market = Cutaway.room.get("drain_market").hotspots;
market.datenfloss = { name: "DATA 1C/GB", rect: AM.datenflossRect, walkTo: AM.pikeTalk, face: "down",
  look: [{ if: "know_cable", then: ["Das Kabel kommt an der Kanalmauer entlang und geht auf das Floß DATA 1C/GB.", "Das Floß liegt draußen an seinem Seil."],
    else: ["Auf dem Floß DATA 1C/GB verkauft einer Daten. Es liegt draußen an seinem Seil."] }],
  use: [{ if: "pike_met", then: [{ dialog: "pike" }], else: [{ if: "know_cable", then: ["Zu weit. Mit der Hand komm ich da nicht ran."], else: ["Ich brauch keine Daten. Ich hab selber welche."] }] }],
  with: { haken: [{ if: "pike_met", then: ["Das Floß liegt schon am Rand."], else: [{ if: "know_cable", then: [
    "Ich hak den Notschlüssel ins Seil und zieh. Das Floß kommt, ganz langsam.", "Teo hätte das mit einer Hand gemacht.",
    P("..."), P("Wer zieht, will was."),
    "Das Kabel geht zu deinem Floß, und dann geht es weiter.", "Ich muss zu dem, der am anderen Ende sitzt.",
    P("Ich verkauf Daten. Keine Fahrten."),
    P("..."),
    P("Ratz hat eine Endstufe. Aus einem Flutwarnmast. Mir gibt er sie nicht."),
    "Warum nicht?",
    P("Ratz sagt, ich hätte ihn fressen wollen."), P("Ein Reflex. Mehr war das nicht."),
    P("Bring mir die Endstufe, dann nehm ich dich mit."),
    { set: "pike_met" },
  ], else: ["Warum sollte ich das Floß ranholen? Ich will keine Daten."] }] }] } };

// ---- L4: the ride out to the drowned forest, seen from the side (game/rooms/sumpf.js), Juno standing on the raft. The first ride is the
// one the output stage pays for: Pike sounds Juno out, whether she is for the sender or against it; her answers are choices without a
// flag (what he thinks of her changes nothing the solver sees). Every later ride ("Fährst du mich raus?") is short; which is which comes
// from the choice, so it costs no flag
const AF = Nagiwa.at.sumpf_fahrt, AH = Nagiwa.at.sumpf;
const RIDE_OUT = ["Ich steig auf. Er stakt das Floß nach rechts, aus dem Markt hinaus.", { goto: "sumpf_fahrt", at: AF.juno, face: "se" }];
const RIDE_FIRST = [...RIDE_OUT,
  P("Stell dich in die Mitte."), { wait: 1500 },
  { dialog: "pike_fahrt" },
  "Über uns hören die Ringe auf. Da ist Himmel. Und Bäume, mitten in der Stadt.",
  P("Da vorn hängen seine Lichter."),
  { goto: "sumpf", at: AH.juno, face: "se" },
];
const RIDE_AGAIN = [...RIDE_OUT, P("Mitte."), "Ich weiß.", { wait: 3000 }, { goto: "sumpf", at: AH.juno, face: "se" }];
Cutaway.dialog("pike_fahrt", {
  main: { enter: [P("Was willst du von ihm?")], choices: [
    { text: "„Ich hab gesehen, was mit ihr passiert ist.“", goto: "sonst", then: [P("Gesehen. Wo?"), "Auf einer Kamera. Ich schau viel auf Kameras.",
      P("Eine Glasserin also. Die verkaufen, was sie sehen."), "Das hier nicht."] },
    { text: "„Ich hab was, das ihm gehört.“", if: "stick_ines", goto: "sonst", then: [P("Dann gib's mir. Ich bring's ihm."), "Nein. Ihm selbst.", P("..."), P("Gut.")] },
    { text: "„Das sag ich ihm selbst.“", goto: "sonst", then: [P("Mhm. Ich stake trotzdem.")] },
  ] },
  sonst: { enter: [P("Und was machst du sonst? Ohne Grund kauft hier keiner bei Ratz.")], choices: [
    { text: "„Ich seh mir Kameras an und verkauf, was ich seh.“", goto: "hoeren", then: [P("Ehrlich. Das ist selten auf dem Kanal.")] },
    { text: "„Nichts Besonderes. Ich wohn im Kessel-Block.“", goto: "hoeren", then: [P("Da wohnen viele. Die meisten schlafen.")] },
  ] },
  hoeren: { enter: [P("Hörst du ihn manchmal? Den Sender.")], choices: [
    { text: "„Ich weiß, was er auf den Schirm geschrieben hat.“", goto: "end", then: [P("Zehn Sekunden."), "Länger glaubt einem eh keiner.", P("..."), P("Das sagt er auch.")] },
    { text: "„Die Nachrichten sagen, er hat sie umgebracht.“", goto: "end", then: ["Seine Stange bleibt im Wasser stehen.", P("Sagen sie."),
      "Ich hab gesehen, dass er's nicht war.", P("..."), P("Dann sag ihm das. Das hört er nicht oft.")] },
    { text: "„Nein. Ich hör Kameras, kein Radio.“", goto: "end", then: [P("Kameras lügen auch."), "Die nicht. Die Leute, die sie schneiden."] },
  ] },
});
// Pike on his raft, once Juno knows what he wants. A plain dialogue, not a talkTree: the ride ends the talk (a talkTree's topic would
// come back to its choices, after the ride, in the swamp)
const PAID = [{ remove: "endstufe" }, P("Die mit den Kühlrippen. Gut."), ...RIDE_FIRST];
Cutaway.dialog("pike", { main: [
  { text: "„Hier. Die Endstufe.“", if: "has:endstufe", goto: "end", then: PAID },
  { text: "„Fährst du mich raus?“", if: ["ledger_ratz", "!has:endstufe"], goto: "end", then: [P("Steig auf."), ...RIDE_AGAIN] },
  { text: "„Was ist mit Ratz?“", then: [P("Ratz sagt, ich hätte ihn fressen wollen."), P("Ich frühstücke nie.")] },
  { text: "Später.", silent: true, goto: "end" },
] });
// the output stage handed to him straight from the bag works as well as saying so (what the hint says: give it to Pike)
const pikeDef = /** @type {any} */ (Cutaway.actors.get("pike")).def;
pikeDef.with = { endstufe: ["Hier. Die Endstufe.", ...PAID], haken: market.datenfloss.with.haken };
market.datenfloss.with.endstufe = pikeDef.with.endstufe;

// ---- L3b: Ratz has the output stage, and he gives it to Juno (never to the heron) for a copy of her old pass: his colony, the flaps in the
// pipes under the Crown. Asked only once Pike has said what he wants (knowledge she lacks before)
Object.assign(Nagiwa.ledger, { ratz: { to: "RATZ", what: { copy: "eine Kopie meines alten Ausweises" } } });
Cutaway.item("endstufe", { name: "Endstufe", icon: "inv_tap", look: "Die Endstufe aus einem Flutwarnmast. Sie hat Kühlrippen und ist schwerer, als sie aussieht." });
const ratz = /** @type {any} */ (Cutaway.actors.get("ratz")).def;
ratz.talk = [RZ("Kundschaft! Kauf was, oder kauf was anderes."), { if: ["day>4", "pike_met", "!ledger_ratz"], then: [{ dialog: "ratz_endstufe" }], else: [{ dialog: "ratz" }] }];
Nagiwa.talkTree("ratz_endstufe", [
  ["„Hast du eine Endstufe? Aus einem Flutwarnmast.“", [RZ("Die gute, mit Kühlrippen. Hab ich."), RZ("Wer will das wissen? Der Reiher?"), "Ich will das wissen.",
    RZ("Der Reiher kriegt nichts von mir. Der hat mich am Schwanz gehabt. Kopfüber, über dem Kanal!"), "Er sagt, das war ein Reflex.",
    RZ("Ein Schnabel macht nichts von allein."), RZ("Für dich kostet sie was anderes. Eine Karte von drinnen, mit Chip. Nur kurz.")], [
    ["„Hier. Mein alter Ausweis.“", [
      "Er hält ihn an seinen Kragen, und der Kragen piept.",
      RZ("Kopie. Mit der gehen auch die Klappen in den Rohren unter der Krone auf."),
      RZ("Zu meiner Kolonie. Die zählen auf mich."),
      { ledger: "ratz", value: "copy" }, { give: "endstufe" },
      { if: "window_open", then: ["Das zweite Mal, dass das Ding was aufmacht."], else: ["Das erste Mal, dass das Ding was aufmacht."] },
      RZ("Und sag dem Reiher nicht, von wem."),
    ], undefined, ["has:ausweis", "!ledger_ratz"]],
    ["„Den hab ich nicht dabei.“", ["Der liegt noch im Karton unter meinem Bett.", RZ("Dann hol ihn. Ich lauf nicht weg. Ich wohn hier.")], undefined, ["!has:ausweis", "!ledger_ratz"]],
  ], "!ledger_ratz"],
  ["„Wohin geht das Kabel am Kanal?“", [RZ("Raus. Wo keiner wohnt, der Miete zahlt."), RZ("Da draußen wachsen Bäume. Bäume! Wer braucht Bäume?")]],
]);

// ---- the pass and the hook are where they always were, also for whoever never went up on the roof in Chapter 1, and Juno can take them any
// time (what she finds she can take at once). Only the solver's runs that shut this way (off_lantern) shut them too, as Chapter 1's runs
// shut them with the roof (off_roof): taken any time, each would double every state of those runs
const flat = Cutaway.room.get("flat").hotspots, floor14 = Cutaway.room.get("kessel_14").hotspots;
flat.box_old.use = [{ if: ["day>4", "!got_ausweis", "!off_lantern"],
  then: ["Da ist der Ausweis: CIVIC MONITOR, J. REYES. UNGÜLTIG.", "Er ist flach und hart. Den steck ich ein.", { give: "ausweis" }, { set: "got_ausweis" }],
  else: flat.box_old.use }];
floor14.haken.if = ["!got_haken", { or: ["!off_roof", ["day>4", "!off_lantern"]] }];

// ---- L5: the caravan on pontoons at the cable's end. The first time Lantern is there, and doesn't want her to be
const hide = Cutaway.room.get("sumpf").hotspots;
hide.wohnwagen.use = [{ if: "lantern_found", then: [{ goto: "lantern_versteck", at: AV.arrive, face: "se" }], else: [
  { goto: "lantern_versteck", at: AV.arrive, face: "se" },
  { set: "lantern_found", value: "found" },
  L("Bleiben Sie da stehen."),
  L("Wer sind Sie? Nein. Sagen Sie's nicht."),
  L("Wie sind Sie ... Der Reiher. Natürlich der Reiher."),
  "Er wollte eine Endstufe. Die hab ich ihm besorgt.",
  L("Dann hat er sie also doch."),
  L("Wenn Sie mich hören wollen: siebenundachtzig sechs, nachts. Kommen müssen Sie dafür nicht."),
  L("Was wollen Sie?"),
  { dialog: "lantern" },
] }];
hide.floss.use = [P("Zurück?"), "Zurück.", { goto: "drain_market", at: AM.pikeTalk, face: "down" }];

// Lantern in person (his figure in the feed for now). He says Sie until she has brought him the stick. The hand-over: said in his talk, or
// the stick given to him from the bag
const HANDOVER = [
  { unset: "stick_ines" }, { if: "has:stick", then: [{ remove: "stick" }] }, { set: "lantern_found", value: "ally" },
  L("Ohne den sind ihre Tabellen nur Rauschen."),
  L("Montag. Um eins. Bis dahin stehen die Sender."),
  L("Und ... danke. Du hast ihn mir gebracht. Das vergess ich nicht."),
  "Ich heiß ...",
  L("Sag's nicht. Ich will's nicht wissen müssen."),
];
Cutaway.actor("lantern_k2", { name: "Lantern", color: "#b0f0a0", room: "lantern_versteck", at: AV.lantern, facing: "se", walkTo: AV.talk, face: "nw",
  costume: { idle: "lantern_feed", walk: "lantern_feed", talk: "lantern_feed" }, voice: { pitch: 46, wave: "square", syllable: 85 },
  look: ["Ein grüner Iro, ein Okular über einem Auge, ein Headset mit drei Antennen.", "Um den Hals hängt eine kleine Laterne am Kabel. Sie brennt."],
  talk: [{ if: "lantern_found=ally", then: [L("Du schon wieder. Pass auf, wer dir nachgeht.")], else: [L("Sie schon wieder.")] }, { dialog: "lantern" }],
  with: { stick: ["Hier. Der gehört Ihnen.", ...HANDOVER] } });
Nagiwa.talkTree("lantern", [
  ["„Ich hab gesehen, was passiert ist.“", [
    L("Was heißt gesehen?"),
    "CAM 31. Ich hab zugesehen, die ganze Zeit.",
    { if: "lantern_found=ally", then: [L("Dann weißt du, dass ich ...")], else: [L("Dann wissen Sie, dass ich ...")] },
    L("Ich war schon weg. Ich hab nicht mal ..."),
    { if: "lantern_found=ally", then: ["Du konntest ihn nicht sehen. Er stand hinter der Treppe."], else: ["Sie konnten ihn nicht sehen. Er stand hinter der Treppe."] },
    L("..."),
    L("Und jetzt zeigen sie überall, dass ich's war."),
    { if: "forgery_proven", then: ["Die haben eine Minute rausgeschnitten. Das kann ich zeigen.", L("Zeigen. Wem denn? Die glauben, was auf dem Schirm ist.")],
      else: ["Das ist nicht das, was ich gesehen hab."] },
  ]],
  ["„Ich hab ihren Schlüssel.“", [
    L("..."),
    L("Sie hat gesagt, sonst weiß es keiner."),
    "Sie konnte mich nicht sehen. Ich war an der Kamera, und ich hab gehört, wo er liegt.",
    L("Und dann haben Sie ihn geholt. Vor mir."),
    "Ja.",
  ], [
    ["„Hier. Der gehört Ihnen.“", HANDOVER, undefined, "stick_ines"],
    ["„Noch nicht.“", [L("Dann gehen Sie. Und lassen Sie sich nicht folgen.")], undefined, "stick_ines"],
  ], "stick_ines"],
  ["„Was ist das hier?“", [
    L("Der Wagen hat mal Urlaub gemacht. Jetzt sendet er."),
    L("Hier ist Lantern. Wer das hier sieht, ist noch wach."),
    L("Das sag ich immer am Anfang. Zehn Sekunden. Länger glaubt einem eh keiner."),
  ]],
], "Ich geh wieder.");

// ---- the board on Monday: who saw the screen (NETZ, game/netz.js)
Object.assign(Nagiwa.netzPages, {
  schirm: { title: "DER GROSSE SCHIRM", label: "Wer hat gestern den großen Schirm gesehen?", up: "brett", posts: [
    { by: "anonym", text: "Wer hat gestern den großen Schirm auf der Kowalski gesehen?" },
    { by: "K.", text: "Zehn Sekunden grün. Dann wieder SLEEP BETTER." },
    { by: "anonym", text: "Das war der Mörder. Stand in den Nachrichten." },
    { by: "Bao", text: "Ein Mörder, der sich entschuldigt. Das hab ich auch noch nicht gehabt." }] },
});
Nagiwa.netzPages.brett.rows?.push({ page: "schirm", if: "day>6" });
Nagiwa.netz.push({ kind: "board", slot: 2, page: "schirm", if: "day=7", text: "Wer hat gestern den großen Schirm gesehen?", by: "anonym" });
})();

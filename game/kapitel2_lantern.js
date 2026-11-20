// Nagiwa: Chapter 2, finding Lantern (docs/kapitel2-design.md §3.5, L1–L5), on blocks. On Sunday at ten Lantern's ten seconds break into
// every channel, and EVI records them (game/kapitel2_rauschen.js); under the noise Juno finds trees in water and green lights, the swamp
// (know_sumpf). EVI sends her to Ratz, who knows every way out under the city and sends her on to Pike, the heron on the raft DATA 1C/GB,
// who poles out there when nobody looks (know_pike; the user's decision, 2026-11-20, instead of the cable the half repair knew about). The
// raft lies out on the water at its rope: the hook pulls it to the edge, and Juno has to ask Pike until he gives in (if she lets go first,
// he pushes off again); then he wants the output stage Lantern needs, which only Ratz has and won't sell him; Ratz gives it to Juno for a
// copy of her old pass. Pike poles her out to the drowned forest, where Lantern lives in a caravan on pontoons. Juno can give him the stick.
//   know_pike      Ratz has told her that Pike poles out where the trees stand in water
//   pike_met       Pike has given in and said what he wants
//   ledger_ratz    Ratz has his copy of her pass, and she has the output stage (the item endstufe) until she gives it to Pike
//   lantern_found  found | out | ally: she has found his hide (they say du from the first word, the user's decision 2026-11-16); out
//                  when she came at him too fast the first time and he threw her out (the door shut: "Auf Sendung", game/kapitel2_funk.js,
//                  brings her back in as found); ally once she has brought him the stick or her recording
// The way is checked on its own (off_lantern shuts it in the other runs: EVI records nothing on Sunday), since its
// steps would multiply every state of the chapter: tools/check.sh, the run "lantern" (Juno with the stick, the flat and the forgery done).
// Lantern's and Pike's voices: dialog-style-guide §6. All of it is painted: Pike from above on the market (art/characters/markt_people.px.js),
// the raft gliding out through the tunnel, the ride and the arrival (art/rooms/sumpf.px.js), the caravan inside and Lantern in it; his ten
// seconds come over the radio and as EVI's recording, not on the street's screen (the user, 2026-11-19 and 2026-11-20)
"use strict";

(function () {
const AV = Nagiwa.at.lantern_versteck, AM = Nagiwa.at.drain_market;
const L = (/** @type {string} */ text) => ({ say: "lantern_k2", text });
const R = (/** @type {string} */ text) => ({ say: "reparatur", text });
const RZ = (/** @type {string} */ text) => ({ say: "ratz", text });
const P = (/** @type {string} */ text) => ({ say: "pike", text });
const HIJACK_AFTER = { or: ["day=7", ["day=6", "time>=22:00"]] };     // Lantern's ten seconds have been

// ---- L1, Sunday 22:00: for ten seconds a voice breaks into every station in the Ninth (the user, 2026-11-19: over the radio, not the big
// screen): through the noise only "... Nagi·wa ... lügt ...", and nobody can say yet who it was or what he means. Heard live only on the
// deck's RADIO (a look: game/radio.js), not in the street (the user, the same day: under Nagi·wa's own screen it felt wrong); otherwise
// people talk about it: the half repair, the stations on Monday, the board in NETZ

// ---- the half repair, on his scaffold every evening of this chapter too, his radio beside him. From Sunday ten he talks about the voice in
// it, and knows no more than anyone (only talk: no flag)
Cutaway.time.routines.get("reparatur").push({ day: [5, 6, 7], from: "18:00", to: "04:00", room: "kowalski", face: "ne" });
const repair = /** @type {any} */ (Cutaway.actors.get("reparatur")).def;
repair.talk = [{ if: "day<5", then: repair.talk, else: [
  { if: [HIJACK_AFTER, "!off_lantern"], then: [
    { if: "day=6", then: [R("Hast du's gehört? Vorhin, mitten im Lied. Rauschen, und dann sagt einer: Nagi·wa lügt.")],
      else: [R("Hast du's gehört? Gestern um zehn, mitten im Lied. Rauschen, und dann sagt einer: Nagi·wa lügt.")] },
    "Wo kam das her?",
    R("Frag mich was Leichteres. Ich mach Schirme, keine Sender."),
  ], else: [{ if: "day=5", then: [R("Samstag. Da wird nicht geschraubt, da wird nur geguckt."), "Und was siehst du?", R("Die linke Hälfte. Die läuft.")],
    else: [R("Die Rechte macht heute, was sie will. Die Linke läuft."), "Und morgen?", R("Morgen ist Montag. Da läuft gar nichts.")] }] },
] }];

// ---- L3: the raft DATA 1C/GB lies out on the canal at its rope. Once Ratz has named Pike, the hook pulls it to the edge, and Juno asks him
// until he gives in and says what he wants
Cutaway.actor("pike", { name: "Pike", color: "#e0a048",      // his beak's orange-yellow, muted beside Juno's yellow (the user, 2026-11-16)
  walkTo: AM.pikeTalk, face: "down",
  // from above (art/characters/markt_people.px.js); he only ever moves with his raft, punting, as fast as Juno on the market
  costume: { idle: Nagiwa.top("pike_top_idle"), walk: Nagiwa.top("pike_top_punt"), talk: Nagiwa.top("pike_top_talk") }, speed: [40, 40],
  voice: { pitch: 58, range: 4, wave: "triangle", syllable: 95, speed: 0.85 },
  look: ["Ein langer Mann mit dünnen Beinen.", "Der Hals ist zu lang, das Gesicht läuft spitz zu. Ein Reiher-Mod."],
  talk: [{ if: "pike_met", then: [{ dialog: "pike" }], else: [
    { if: "know_pike", then: ["He! Bist du Pike? Ratz sagt, du kennst dich in den Sümpfen aus!", P("Ich verkauf Daten. Keine Fahrten."),
      "Er ist zu weit draußen. Ich müsste das Floß ranholen."],
      else: [P("Gigabyte gegen Chits."), "Danke. Ich hab selber welche."] }] }] });
Cutaway.routine("pike", [{ day: [5, 6, 7], from: "18:00", to: "04:00", room: "drain_market", at: AM.pike, face: "down" }]);
const market = Cutaway.room.get("drain_market").hotspots;
market.datenfloss = { name: "DATA 1C/GB", rect: AM.datenflossRect, walkTo: AM.pikeTalk, face: "down",
  look: [{ if: "know_pike", then: ["Pikes Floß. Ratz sagt, er stakt da raus, wo die Bäume im Wasser stehen.", "Es liegt draußen an seinem Seil."],
    // (Pike is on it from Saturday only: in Chapter 1 it lies there empty, nothing to give away yet)
    else: [{ if: "day<5", then: ["Das Floß DATA 1C/GB liegt draußen an seinem Seil. Keiner drauf, aber die Bildschirme laufen."],
      else: ["Auf dem Floß DATA 1C/GB verkauft einer Daten. Es liegt draußen an seinem Seil."] }] }],
  use: [{ if: "pike_met", then: [{ dialog: "pike" }], else: [{ if: "know_pike", then: ["Zu weit. Mit der Hand komm ich da nicht ran."], else: ["Ich brauch keine Daten. Ich hab selber welche."] }] }],
  with: { haken: [{ if: "pike_met", then: ["Das Floß liegt schon am Rand."], else: [{ if: "know_pike", then: [
    "Ich hak den Notschlüssel ins Seil und zieh. Das Floß kommt, ganz langsam.", "Teo hätte das mit einer Hand gemacht.",
    P("..."), P("Wer zieht, will was."),
    "Hallo. Bist du Pike?",
    P("Kommt drauf an, wer fragt."),
    "Ich bin Juno. Ratz hat gesagt, ich soll mit dir reden.",
    P("Ratz schickt keinen. Ratz verkauft nur."),
    { dialog: "pike_frage" },
  ], else: ["Warum sollte ich das Floß ranholen? Ich will keine Daten."] }] }] } };

// asking him until he gives in (the user's wish, 2026-11-20: Juno doesn't let go): he holds the raft at the edge as long as she asks; when she
// lets go before, he pushes off again, so the raft at the edge is no state of its own. A plain dialogue, so that giving in can end it
const PUSH_OFF = ["Er stößt sich mit der Stange vom Rand ab. Das Floß treibt wieder raus."];
Cutaway.dialog("pike_frage", {
  main: { choices: [
    { text: "„Sag mal, du fährst doch öfter raus in die Sümpfe?“", then: ["Sagt zumindest Ratz.", P("Ratz sagt viel. Ratz ist eine Ratte."),
      "Und, stimmt's?", P("Ich verkauf Daten. Pro Gigabyte.")] },
    { text: "„In Lanterns Sendung hab ich Bäume im Wasser gesehen.“", goto: "bild", then: [P("Bäume gibt's viele."),
      "Hier unten nicht. Hier unten gibt's Beton und Kanäle.", P("...")] },
    { text: "„Die Stimme im Radio am Sonntag, hast du die auch gehört?“", then: ["Er sagt, Nagi·wa lügt. Ich glaub, er hat recht.",
      P("Hab ich nicht gehört. Ich hör Daten."), "Aber du hast eine Antenne auf dem Floß.", P("Für Daten.")] },
    { text: "„Schon gut. Dann eben nicht.“", silent: true, goto: "end", then: ["Schon gut. Dann eben nicht.", ...PUSH_OFF] },
  ] },
  bild: { choices: [
    { text: "„Kann es sein, dass Lantern da draußen in den Sümpfen lebt?“", goto: "woher", then: [
      "Zwischen den Bäumen hingen kleine grüne Lichter. Wie Laternen.", "Seine Stange bleibt im Wasser stehen.", P("..."), P("Wo hast du das her?")] },
    { text: "„Hast du ihn da draußen schon mal gesehen?“", then: [P("Da draußen sieht man nicht viel. Nebel, Wasser, Bäume."),
      P("Und was da drin schwimmt, will man lieber nicht sehen.")] },
    { text: "Was anderes.", silent: true, goto: "main" },
  ] },
  woher: { choices: [
    { text: "„Das war in seiner Sendung, unter dem Rauschen versteckt.“", goto: "end", then: [
      P("Unter dem Rauschen."),
      "Ich hab das Rauschen vom Anfang über das vom Ende gelegt.", "Darunter war seine eigene Kamera. Ganz blass.",
      P("Das hab ich ihm gesagt. Nicht so nah an den Lampen."),
      P("..."),
      P("Wer so was findet, findet ihn auch ohne mich. Dann lieber mit mir."),
      P("Aber ich fahr nicht für nichts."),
      P("Ratz hat eine Endstufe. Aus einem Flutwarnmast. Mir gibt er sie nicht."),
      "Warum gibt er sie dir nicht?",
      P("Ratz sagt, ich hätte ihn fressen wollen."), P("Ein Reflex. Mehr war das nicht."),
      P("Bring mir die Endstufe, dann nehm ich dich mit."),
      { set: "pike_met" },
    ] },
    { text: "„Das hab ich irgendwo gefunden.“", goto: "main", then: [P("Irgendwo."), P("Dann such weiter. Irgendwo.")] },
    { text: "Was anderes.", silent: true, goto: "main" },
  ] },
});

// ---- L4: the ride out to the drowned forest, seen from the side (game/rooms/sumpf.js), Juno standing on the raft. The first ride is the
// one the output stage pays for: Pike sounds Juno out, whether she is for the sender or against it; her answers are choices without a
// flag (what he thinks of her changes nothing the solver sees). Every later ride ("Fährst du mich raus?") is short; which is which comes
// from the choice, so it costs no flag
const AF = Nagiwa.at.sumpf_fahrt, AH = Nagiwa.at.sumpf;
// The way out goes through a tunnel (the user's choice, 2026-11-16): Juno steps onto the raft, Pike pushes off, and raft, Pike and Juno
// glide right together (the raft a prop of the market, both at the market's walking pace: drain_market.flossOut px in its time) in under
// the Ring's last pillar, into the dark; the ride begins in that dark, the portal slides off and for the first time there is sky
const OUT = AM.flossOut, OUT_MS = Math.round(OUT / 40 * 1000);
// Riding out while the Quiet stands before her house (Nagiwa.quietOut, game/kapitel2.js) leads it to him (led_quiet): EVI has said so on the
// way into the alley and at Pike's raft, and says it once more as they push off
const STEP_ON = ["Ich steig auf.", { walk: "juno", to: AM.flossJuno, free: true, face: "right" },
  { if: [...Nagiwa.quietOut, "!led_quiet"], then: [{ set: "led_quiet" }, { evi: "besorgt" }, { say: "evi", text: "Der in Weiß oben. Sieht der, wohin wir fahren?" }] }];
const CAST_OFF = [
  { move: "floss", by: [OUT, 0], ms: OUT_MS, ease: "linear", wait: false },
  { walk: "pike", to: [AM.pike[0] + OUT, AM.pike[1]], free: true, wait: false },
  { walk: "juno", to: [AM.flossJuno[0] + OUT, AM.flossJuno[1]], free: true },
  { fade: "out", ms: 400 },
  { set: "im_tunnel" },                                // no rain in there (a view, game/rooms/sumpf.js)
  { goto: "sumpf_fahrt", at: AF.juno, face: "se", transition: false },
  { fade: "in", ms: 900 },
  P("Kopf runter."),
  { wait: 1800 },                                      // the portal slides off meanwhile (sumpf_fahrt's enter, game/rooms/sumpf.js)
  { unset: "im_tunnel" },
];
const RIDE_FIRST = [...STEP_ON, P("Stell dich in die Mitte."), ...CAST_OFF,
  { dialog: "pike_fahrt" },
  P("Da vorn hängen seine Lichter."),
  { goto: "sumpf", at: AH.juno, face: "se" },
];
const RIDE_AGAIN = [...STEP_ON, P("Mitte."), "Ich weiß.", ...CAST_OFF, { wait: 1500 }, { goto: "sumpf", at: AH.juno, face: "se" }];
Cutaway.dialog("pike_fahrt", {
  main: { enter: [{ wait: 1200 }, P("Du bist die Erste seit Langem, die freiwillig hier rausfährt."), "Und die anderen?", P("Die wollten Daten. Die bleiben am Markt."),
    P("Darf ich dich was fragen?"), "Kostet das was?", P("Bei mir nicht. Ich bin nicht Sable."), P("Was willst du von ihm?")], choices: [
    { text: "„Ich hab gesehen, was mit ihr passiert ist.“", goto: "sonst", then: [P("Gesehen. Wo?"), "Auf einer Kamera. Ich schau viel auf Kameras.",
      P("Eine Glasserin."), { wait: 700 }, P("Die verkaufen, was sie sehen."), "Meistens. Das hier nicht.", P("Warum nicht?"),
      "Weil ich weiß, wie es war. Und die Nachrichten erzählen was anderes.", P("Hm.")] },
    { text: "„Ich hab was, das ihm gehört.“", if: "stick_ines", goto: "sonst", then: [P("Dann gib's mir. Ich bring's ihm."), "Nein. Ihm selbst.", P("..."),
      P("Gut. Das hätte ich auch gesagt.")] },
    { text: "„Das würd ich ihm lieber selbst sagen.“", goto: "sonst", then: [P("Mhm. Ist in Ordnung."), P("Ich stake trotzdem.")] },
  ] },
  sonst: { enter: [P("Und was machst du, wenn du nicht über Kanäle fährst?")], choices: [
    { text: "„Ich seh mir Kameras an und verkauf, was ich seh.“", goto: "hoeren", then: [P("Ehrlich. Das ist selten auf dem Kanal."), "Ehrlich ist billig.",
      P("Nicht hier draußen.")] },
    { text: "„Nichts Besonderes. Ich wohn im Kessel-Block.“", goto: "hoeren", then: [P("Da wohnen viele. Die meisten schlafen."), "Ich nicht.", P("Das merkt man.")] },
  ] },
  hoeren: { enter: [P("Und seine Sendung? Was hältst du davon?")], choices: [
    { text: "„Er sagt, Nagi·wa lügt. Ich glaub ihm das.“", goto: "rat", then: [P("Zehn Sekunden."), "Länger glaubt einem eh keiner.",
      "Er sieht mich an.", P("Das sagt er auch. Fast genauso.")] },
    { text: "„Die Nachrichten sagen, er hat sie umgebracht.“", goto: "rat", then: ["Seine Stange bleibt im Wasser stehen.", P("Sagen sie."),
      "Ich hab gesehen, dass er's nicht war.", P("..."), P("Dann sag ihm das. Aber nicht gleich. Er braucht eine Weile.")] },
    { text: "„Ehrlich gesagt hör ich mir lieber Kameras an als Radio.“", goto: "rat", then: [P("Kameras lügen auch."), "Die nicht. Die Leute, die sie schneiden.",
      P("Das würde ihm gefallen.")] },
  ] },
  // his advice, free, the way he gives everything: once
  rat: { enter: ["Über uns hören die Ringe auf. Da ist Himmel. Und Bäume, mitten in der Stadt.", P("Noch was. Umsonst."), "Ja?",
    P("Geh langsam rein. Er ist lange allein da draußen. Wer zu schnell kommt, kommt nicht weit.")], choices: [
    { text: "„Danke, Pike.“", goto: "end", then: [P("Mhm.")] },
  ] },
});
// Pike on his raft, once Juno knows what he wants. A plain dialogue, not a talkTree: the ride ends the talk (a talkTree's topic would
// come back to its choices, after the ride, in the swamp)
const PAID = [{ remove: "endstufe" }, P("Die mit den Kühlrippen. Gut."), ...RIDE_FIRST];
Cutaway.dialog("pike", { main: { enter: [{ if: [...Nagiwa.quietOut, "!led_quiet"], then: [{ evi: "besorgt" }, { say: "evi", text: "Oben steht der in Weiß. Bis elf." }] }], choices: [
  { text: "„Hier, ich hab deine Endstufe.“", if: "has:endstufe", goto: "end", then: PAID },
  { text: "„Fährst du mich noch mal raus zu ihm?“", if: ["ledger_ratz", "!has:endstufe"], goto: "end", then: [P("Steig auf."), ...RIDE_AGAIN] },
  { text: "„Was ist eigentlich zwischen dir und Ratz?“", then: [P("Ratz sagt, ich hätte ihn fressen wollen."), P("Ich frühstücke nie.")] },
  { text: "Später.", silent: true, goto: "end" },
] } });
// the output stage handed to him straight from the bag works as well as saying so (what the hint says: give it to Pike)
const pikeDef = /** @type {any} */ (Cutaway.actors.get("pike")).def;
pikeDef.with = { endstufe: ["Hier, ich hab deine Endstufe.", ...PAID], haken: market.datenfloss.with.haken };
market.datenfloss.with.endstufe = pikeDef.with.endstufe;

// ---- Ratz knows every way out under the city: asked about the trees in water, he names the heron (know_pike)
const TREES = [
  "Ratz, weißt du, wo hier irgendwo Bäume im Wasser stehen?",
  RZ("Bäume! Wer braucht Bäume?"), "Ich. Ich hab welche gesehen, mit grünen Lichtern dazwischen.",
  RZ("Grüne Lichter, hm. Draußen. Wo die Ringe aufhören und keiner Miete zahlt."),
  RZ("Ich geh da nicht hin. Da schwimmt was."),
  RZ("Frag den Reiher. Pike, auf dem Datenfloß. Der stakt da raus, wenn keiner guckt."),
  { set: "know_pike" },
];

// ---- L3b: Ratz has the output stage, and he gives it to Juno (never to the heron) for a copy of her old pass: his colony, the flaps in the
// pipes under the Crown. Asked only once Pike has said what he wants (knowledge she lacks before)
Object.assign(Nagiwa.ledger, { ratz: { to: "RATZ", what: { copy: "eine Kopie meines alten Ausweises" } } });
Cutaway.item("endstufe", { name: "Endstufe", icon: "inv_endstufe", look: "Die Endstufe aus einem Flutwarnmast. Sie hat Kühlrippen und ist schwerer, als sie aussieht." });
const ratz = /** @type {any} */ (Cutaway.actors.get("ratz")).def;
ratz.talk = [RZ("Kundschaft! Kauf was, oder kauf was anderes."), { if: ["day>4", "know_sumpf", "!know_pike"], then: TREES,
  else: [{ if: ["day>4", "pike_met", "!ledger_ratz"], then: [{ dialog: "ratz_endstufe" }], else: [{ dialog: "ratz" }] }] }];
Nagiwa.talkTree("ratz_endstufe", [
  ["„Hast du eine Endstufe aus einem Flutwarnmast?“", [RZ("Die gute, mit Kühlrippen. Hab ich."), RZ("Wer will das wissen? Der Reiher?"), "Ich will das wissen.",
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
  ["„Was schwimmt da draußen eigentlich?“", [RZ("Was Großes. Mit Zähnen, glaub ich."), RZ("Ich hab nur die Bugwelle gesehen. Die hat mir gereicht.")]],
]);

// ---- the pass and the hook are where they always were, also for whoever never went up on the roof in Chapter 1, and Juno can take them any
// time (what she finds she can take at once). Only the solver's runs that shut this way (off_lantern) shut them too, as Chapter 1's runs
// shut them with the roof (off_roof): taken any time, each would double every state of those runs
const flat = Cutaway.room.get("flat").hotspots, floor14 = Cutaway.room.get("kessel_14").hotspots;
flat.box_old.use = [{ if: ["day>4", "!got_ausweis", "!off_lantern"],
  then: ["Da ist der Ausweis: CIVIC MONITOR, J. REYES. UNGÜLTIG.", "Er ist flach und hart. Den steck ich ein.", { give: "ausweis" }, { set: "got_ausweis" }],
  else: flat.box_old.use }];
floor14.haken.if = ["!got_haken", { or: ["!off_roof", ["day>4", "!off_lantern"]] }];

// ---- L5: the caravan on pontoons among the trees. The first time Lantern is there, and doesn't want her to be
const hide = Cutaway.room.get("sumpf").hotspots;
hide.wohnwagen.walkTo = AH.door; hide.wohnwagen.face = "ne";
hide.wohnwagen.use = [
  // thrown out: the door stays shut to people (game/kapitel2_funk.js: only the sender gets through)
  { if: "lantern_found=out", then: ["Ich klopf.", { sfx: "knock" }, "Nichts. Nur das Brummen vom Rack."],
    else: [{ if: "lantern_found", then: [{ goto: "lantern_versteck", at: AV.arrive, face: "se" }],
      else: [{ goto: "lantern_versteck", at: AV.arrive, face: "se" }, { dialog: "lantern_erst" }] }] },
];
hide.floss.walkTo = AH.juno; hide.floss.face = "sw";
hide.floss.use = [{ dialog: "pike_sumpf" }];
// the first time: he doesn't want to be found; Juno's tone decides whether he stays (kapitel2-design §3.5, "Die Gespräche im Sumpf")
const TOO_FAST = [
  L("Ich weiß nicht, wovon du redest."), L("Ich bin ein alter Mann mit einem Radio."), "So alt bist du nicht.", L("Raus."),
  L("Und sag Pike, er soll keinen mehr bringen."),
  { set: "lantern_found", value: "out" },
  { goto: "sumpf", at: AH.door, face: "sw" },
  { sfx: "door_shut" },
  "Die Tür ist zu. Das grüne Licht dahinter ist dunkler geworden.",
];
const WARM = [{ set: "lantern_found", value: "found" }];
Cutaway.dialog("lantern_erst", {
  main: { enter: [L("Bleib da stehen."), L("Wer bist du? ... Nein. Sag's nicht."), L("Wie bist du ... Pike. Natürlich Pike."),
    "Er hat mich gebracht. Ich hab ihm die Endstufe besorgt.", L("Dann hat er sie also doch."),
    L("Und woher wusste Pike, dass du zu mir willst?"), "Deine Sendung am Sonntag. Unter dem Rauschen war deine eigene Kamera.",
    L("..."), L("Dann sieht das bald noch jemand anders."), L("Und jetzt stehst du in meinem Wagen. Was willst du?")], choices: [
    { text: "„Erst mal nur reden. Wenn du willst.“", goto: "sitzen", then: [L("Reden."), L("Das sagen alle, bevor sie was wollen."), "Ich will auch was. Aber nicht gleich.",
      L("... Ehrlich wenigstens.")] },
    { text: "„Pike hat erzählt, du bist schon lange allein hier draußen.“", goto: "sitzen", then: [L("Pike redet zu viel. Für seine Verhältnisse."), "Er hat drei Sätze gesagt.", L("Eben.")] },
    { text: "„Ich weiß, dass du's nicht warst. Ich hab alles gesehen.“", goto: "end", then: ["Er zuckt. Seine Hand geht ans Rad.", ...TOO_FAST] },
    { text: "„Ich hab den Schlüssel von Ines.“", if: "stick_ines", goto: "end", then: ["Bei ihrem Namen wird sein Gesicht ganz still.", ...TOO_FAST] },
  ] },
  sitzen: { enter: [L("Setz dich. Da, auf die Kiste. Nicht aufs Bett, das ist meins."), "Er dreht die Laterne an seinem Hals ein wenig heller."], choices: [
    { text: "„Was machst du hier draußen mit dem ganzen Zeug?“", goto: "warum", then: [L("Der Wagen hat mal Urlaub gemacht. Jetzt sendet er."), L("Siebenundachtzig sechs. Nachts."),
      L("Hier ist Lantern. Wer das hier hört, ist noch wach. Das sag ich immer am Anfang.")] },
    { text: "„Wie lange bist du schon hier draußen?“", goto: "warum", then: [L("Seit dem Unfall. Pumpenhalle drei. Danach ..."),
      L("Hier draußen fragt keiner, wie man Treppen steigt."), "Und wie steigt man Treppen?", L("Treppen sind ein Argument. Ich hab Düsen.")] },
    { text: "„Warum zeigen sie dich überall in den Nachrichten?“", goto: "end", then: ["Er sieht mich lange an. Dann nicht mehr.", ...TOO_FAST] },
  ] },
  warum: { enter: [L("Und jetzt du. Warum bist du wirklich hier?")], choices: [
    { text: "„Ich hab in der Metro zugesehen. Auf einer Kamera.“", goto: "end", then: ["Die ganze Zeit, bis zum Schluss.", "Er sagt lange nichts.", L("Dann weißt du, dass ich ..."),
      "Dass du schon weg warst. Ja.", L("..."), L("Das hat noch keiner zu mir gesagt."), ...WARM, { dialog: "lantern" }] },
    { text: "„Ich hab was, das ihr gehört hat.“", if: "stick_ines", goto: "end", then: ["Ihren Schlüssel. Den aus dem Trockner.", L("..."), L("Sie hat gesagt, sonst weiß es keiner."),
      "Sie konnte mich nicht sehen. Ich war an der Kamera.", L("Dann zeig ihn mir. Langsam."), ...WARM, { dialog: "lantern" }] },
  ] },
});
// Pike, tied up at the walk: back to the market, what to do when Lantern is shut, his trap
Cutaway.dialog("pike_sumpf", { main: { enter: [P("Mhm?")], choices: [
  { text: "„Er hat mich rausgeworfen.“", if: "lantern_found=out", then: [P("Zu schnell?"), "Zu schnell.", P("Wenn er zu ist, redet er nicht mit Leuten. Nur mit dem Sender."),
    "Und wie red ich mit dem Sender?", P("Mit was, das sendet. Hier draußen liegt allerhand rum.")] },
  { text: "„Was ist das für eine Reuse da hinten in den Wurzeln?“", if: "!reuse_frei", then: [P("Die hängt da drüben in den Wurzeln. Hinter dem Wagen."), P("Da geh ich nicht hin."),
    P("Nicht mit dem, was da unten schwimmt.")] },
  { text: "„Fährst du mich zurück zum Markt?“", silent: true, goto: "end", then: ["Fährst du mich zurück zum Markt?", P("Zurück?"), "Zurück.", { goto: "drain_market", at: AM.pikeTalk, face: "down" }] },
  { text: "„Nichts. Ich schau mich nur ein bisschen um.“", silent: true, goto: "end" },
] } });
// Lantern in person. He and Juno say du from the first word. The hand-over: said in his talk, or the stick given to him from the bag
const HANDOVER = [
  { unset: "stick_ines" }, { if: "has:stick", then: [{ remove: "stick" }] }, { set: "lantern_found", value: "ally" },
  L("Ohne den sind ihre Tabellen nur Rauschen."),
  L("Montag. Um eins. Bis dahin stehen die Sender."),
  L("Und ... danke. Du hast ihn mir gebracht. Das vergess ich nicht."),
  "Ich heiß ...",
  L("Sag's nicht. Ich will's nicht wissen müssen."),
];
// her recording given to him (decision 2): he sends it on Monday with the protocols, too early; with it he is her ally
const GIVE_CLIP = [{ set: "e2", value: "lantern" }, { ledger: "lantern_ines", value: "given" },
  L("Montag. Um eins. Mit ihren Tabellen."),
  { if: "forgery_proven", then: ["Und die Fälschung. Mit der Minute, die fehlt.", L("Die auch. Dann sieht jeder beide.")] },
  { if: "lantern_found=ally", then: [L("Pass auf dich auf. Bald fragen die, wer das gefilmt hat.")],
    else: [{ set: "lantern_found", value: "ally" }, L("Dann ... hängst du jetzt mit drin. Ob du willst oder nicht."), "Ich hab nicht gefragt.",
      L("Keiner fragt. Man hängt einfach dran.")] },
];
// He sits turned to Juno where she stands to talk (south-west), one view only, drawn: never the engine's mirror (art/characters/lantern.px.js)
Cutaway.actor("lantern_k2", { name: "Lantern", color: "#b0f0a0", room: "lantern_versteck", at: AV.lantern, facing: "sw", walkTo: AV.talk, face: "ne",
  costume: { idle: { sw: "lantern_sit_sw" }, talk: { sw: "lantern_talk_sw" } }, voice: { pitch: 46, wave: "square", syllable: 85 },
  look: ["Ein grüner Iro, ein Okular über einem Auge, ein Headset mit drei Antennen.", "Um den Hals hängt eine kleine Laterne am Kabel. Sie brennt."],
  talk: [{ if: "lantern_found=ally", then: [L("Du schon wieder. Pass auf, wer dir nachgeht.")], else: [L("Da bist du ja wieder.")] }, { dialog: "lantern" }],
  with: { stick: ["Hier. Der gehört dir.", ...HANDOVER] } });
Nagiwa.talkTree("lantern", [
  ["„Ich hab gesehen, was in der Metro passiert ist.“", [
    L("Was heißt gesehen?"),
    "CAM 31. Ich hab zugesehen, die ganze Zeit.",
    L("Dann weißt du, dass ich ..."),
    L("Ich war schon weg. Ich hab nicht mal ..."),
    "Du konntest ihn nicht sehen. Er stand hinter der Treppe.",
    L("..."),
    L("Und jetzt zeigen sie überall, dass ich's war."),
    { if: "forgery_proven", then: ["Die haben eine Minute rausgeschnitten. Das kann ich zeigen.", L("Zeigen. Wem denn? Die glauben, was auf dem Schirm ist.")],
      else: ["Das ist nicht das, was ich gesehen hab."] },
  ]],
  // one place for two topics (the user's choice, 2026-11-16): her key while she has it, then her recording (decision 2, kapitel2-design §3.6)
  { either: [
    ["„Ich hab ihren Schlüssel noch. Den aus dem Trockner.“", [
      L("..."),
      L("Sie hat gesagt, sonst weiß es keiner."),
      "Sie konnte mich nicht sehen. Ich war an der Kamera, und ich hab gehört, wo er liegt.",
      L("Und dann hast du ihn geholt. Vor mir."),
      "Ja.",
    ], [
      ["„Hier. Der gehört dir.“", HANDOVER, undefined, "stick_ines"],
      ["„Noch nicht.“", [L("Dann geh. Und lass dich nicht verfolgen.")], undefined, "stick_ines"],
    ], "stick_ines"],
    ["„Ich hab eine Aufnahme aus der Metro.“", [
      "Von CAM 31. Ines auf der Treppe, bis er hochsieht.",
      L("..."),
      L("Und die willst du senden lassen. Von mir."),
      "Bevor sie einer kauft, der sie verschwinden lässt.",
    ], [
      ["„Nimm sie. Schick sie mit ihren Protokollen raus.“", GIVE_CLIP, undefined, "!e2"],
      ["„Noch nicht.“", [L("Dann behalt sie. Aber nicht zu lange.")], undefined, "!e2"],
    ], ["!stick_ines", "!e2", "cache_clip_ines_death", "!off_main"]],
  ] },
  ["„Was machst du hier draußen eigentlich?“", [
    L("Der Wagen hat mal Urlaub gemacht. Jetzt sendet er."),
    L("Hier ist Lantern. Wer das hier hört, ist noch wach."),
    L("Das sag ich immer am Anfang. Zehn Sekunden. Länger glaubt einem eh keiner."),
  ]],
], "Ich geh wieder.");

// ---- the board on Monday: who heard the radio (NETZ, game/netz.js)
Object.assign(Nagiwa.netzPages, {
  rauschen: { title: "DAS RAUSCHEN", label: "Wer hat gestern um zehn Radio gehört?", up: "brett", posts: [
    { by: "anonym", text: "Wer hat gestern um zehn Radio gehört? Egal welchen Sender?" },
    { by: "K.", text: "Mitten im Lied nur Rauschen. Dann einer: Nagi·wa lügt. Dann wieder Musik." },
    { by: "anonym", text: "Das war der Mörder aus den Nachrichten. Der mit dem Rollstuhl." },
    { by: "Bao", text: "Ein Mörder, der Nagi·wa einen Lügner nennt. Das hab ich auch noch nicht gehabt." }] },
});
Nagiwa.netzPages.brett.rows?.push({ page: "rauschen", if: "day>6" });
Nagiwa.netz.push({ kind: "board", slot: 2, page: "rauschen", if: "day=7", text: "Wer hat gestern um zehn Radio gehört?", by: "anonym" });
})();

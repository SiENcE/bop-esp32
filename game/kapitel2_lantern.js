// Nagiwa: Chapter 2, finding Lantern (docs/kapitel2-design.md §3.5, L1–L5), on blocks. On Sunday at ten the big screen on Kowalski Street
// tears for ten seconds of Lantern's green; the half repair saw that it came by cable, from below; the cable runs down the stairs under the
// Drain Market, whose chain has a new lock of Nagi·wa's that Ratz opens for a copy of Juno's old pass; at the jetty's end the hook pulls the
// raft over, and at the cable's end Lantern sits in his hide. Juno can give him the stick there.
//   know_cable     the half repair told her where the screen's words came from (from Sunday 22:00)
//   stairs_open    Ratz has opened the lock (and the Kassenbuch has his copy of her pass: ledger_ratz)
//   lantern_found  found | ally: she has found his hide; ally once she has brought him the stick (then they say du)
// The way is checked on its own (off_lantern shuts it in the other runs: the half repair doesn't know, the screen doesn't tear), since its
// steps would multiply every state of the chapter: tools/check.sh, the run "lantern" (Juno with the stick, the flat and the forgery done).
// Lantern's voice: dialog-style-guide §6 (a draft). [PLATZHALTER] Lantern in his hide is his feed figure; the rooms are blocks; the words on
// the screen are a caption over the stutter until the street's picture shows them (§13, 4)
"use strict";

(function () {
const AK = Nagiwa.at.kowalski, AS = Nagiwa.at.sumpf, AV = Nagiwa.at.lantern_versteck, AM = Nagiwa.at.drain_market;
const L = (/** @type {string} */ text) => ({ say: "lantern_k2", text });
const R = (/** @type {string} */ text) => ({ say: "reparatur", text });
const RZ = (/** @type {string} */ text) => ({ say: "ratz", text });
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
      "Von unten. Unter dem Markt geht eine Treppe noch tiefer.",
      { set: "know_cable" },
    ], else: [{ if: "day=5", then: [R("Samstag. Da wird nicht geschraubt, da wird nur geguckt."), "Und was siehst du?", R("Die linke Hälfte. Die läuft.")],
      else: [R("Die Rechte macht heute, was sie will. Die Linke läuft."), "Und morgen?", R("Morgen ist Montag. Da läuft gar nichts.")] }] }] },
] }];

// ---- L3: the stairs under the Drain Market, the cable along their rail, the chain with Nagi·wa's lock
const down = Cutaway.room.get("drain_market").hotspots.down;
down.look = [{ if: ["day>4", "know_cable"], then: ["An ihrem Geländer läuft ein neues Kabel nach unten.", "Davor hängt die Kette, und das Schloss daran blinkt rot."], else: [].concat(down.look) }];
down.use = [{ if: "day<5", then: down.use, else: [
  { if: "stairs_open", then: [{ goto: "sumpf", at: AS.arrive, face: "ne" }],
    else: [{ if: "know_cable", then: ["Am Geländer läuft das Kabel nach unten. Das ist seins.", "Aber die Kette hat ein neues Schloss von Nagi·wa. Das will eine Karte."],
      else: ["Die Kette ist zu. Und ich will da nicht runter."] }] },
] }];

// ---- L3b: Ratz knows the lock, and he opens it for a copy of Juno's old pass (his colony: the flaps in the pipes under the Crown)
Object.assign(Nagiwa.ledger, { ratz: { to: "RATZ", what: { copy: "eine Kopie meines alten Ausweises" } } });
const ratz = /** @type {any} */ (Cutaway.actors.get("ratz")).def;
ratz.talk = [RZ("Kundschaft! Kauf was, oder kauf was anderes."), { if: ["day>4", "know_cable", "!stairs_open"], then: [{ dialog: "ratz_schloss" }], else: [{ dialog: "ratz" }] }];
Nagiwa.talkTree("ratz_schloss", [
  ["„Kriegst du das Schloss an der Treppe auf?“", [RZ("Das rote? Das ist ein Nagi·wa-Schloss. Neu."), RZ("Die mögen alte Karten. Hast du eine alte Karte?"), "Vielleicht.",
    RZ("Eine von drinnen, mit Chip. Nur kurz. Ich mach mir eine Kopie.")], [
    ["„Hier. Mein alter Ausweis.“", [
      "Er hält ihn an seinen Kragen, und der Kragen piept.",
      RZ("Kopie. Mit der gehen auch die Klappen in den Rohren unter der Krone auf."),
      RZ("Zu meiner Kolonie. Die zählen auf mich."),
      "Und das Schloss?",
      RZ("Ist offen. Für Leute mit Karte war es das immer."),
      { set: "stairs_open" }, { ledger: "ratz", value: "copy" },
      { if: "window_open", then: ["Das zweite Mal, dass das Ding was aufmacht."], else: ["Das erste Mal, dass das Ding was aufmacht."] },
      RZ("Unten ist nass. Das Floß hängt weit draußen am Seil. Nimm was Langes mit."),
      { if: "!has:haken", then: ["Was Langes. Der Notschlüssel vom Aufzug ist lang."] },
    ], undefined, ["has:ausweis", "!stairs_open"]],
    ["„Den hab ich nicht dabei.“", ["Der liegt noch im Karton unter meinem Bett.", RZ("Dann hol ihn. Ich lauf nicht weg. Ich wohn hier.")], undefined, "!has:ausweis"],
  ], "!stairs_open"],
  ["„Was willst du da unten?“", [RZ("Ich? Nichts. Unten ist nass."), RZ("Aber in den Rohren über dem Wasser, da wohnen Ratten. Große."), "Deine Kolonie.", RZ("Sag's keinem.")]],
]);

// ---- the pass and the hook are where they always were, also for whoever never went up on the roof in Chapter 1 (the roof's thread shut).
// Juno takes each once she knows what for: the pass once she has stood at the lock that wants a card, the hook once Ratz has told her the
// raft hangs far out (knowledge she lacks before; and taken any time, each would double every state of the chapter)
const flat = Cutaway.room.get("flat").hotspots, floor14 = Cutaway.room.get("kessel_14").hotspots;
flat.box_old.use = [{ if: ["day>4", "!got_ausweis"], then: [{ if: "know_cable",
  then: ["Da ist der Ausweis: CIVIC MONITOR, J. REYES. UNGÜLTIG.", "Das Schloss will eine Karte. Den steck ich ein.", { give: "ausweis" }, { set: "got_ausweis" }],
  else: ["Da ist mein alter Ausweis drin.", "Wozu? Der macht nichts mehr auf."] }],
  else: flat.box_old.use }];
floor14.haken.if = ["!got_haken", { or: ["!off_roof", "day>4"] }];
floor14.haken.use = [{ if: ["day>4", "!stairs_open"], then: ["Der Notschlüssel vom Aufzug. Der Aufzug fährt eh nicht.", "Wozu sollte ich den mitnehmen?"],
  else: floor14.haken.use }];

// ---- L4: the jetty ends in the water; the raft on its rope is too far, and the hook pulls it over. Once Juno has been over, she pulls
// herself along the rope. The first time Lantern is there, and doesn't want her to be
const raft = Cutaway.room.get("sumpf").hotspots.raft;
const MEET = [
  { goto: "lantern_versteck", at: AV.arrive, face: "se" },
  { set: "lantern_found", value: "found" },
  L("Bleiben Sie da stehen."),
  L("Wer sind Sie? Nein. Sagen Sie's nicht."),
  L("Wie haben Sie ... Das Kabel. Natürlich das Kabel."),
  "Der Monteur oben hat's gesehen.",
  L("Funk hört jeder. Ein Kabel hört nur, wer dran hängt."),
  L("Was wollen Sie?"),
  { dialog: "lantern" },
];
raft.use = [{ if: "lantern_found", then: ["Ich zieh mich am Seil rüber.", { goto: "lantern_versteck", at: AV.arrive, face: "se" }],
  else: ["Zu weit. Mit der Hand komm ich da nicht ran."] }];
raft.with = { haken: [{ if: "lantern_found", then: raft.use, else: [
  "Ich hak den Notschlüssel ins Seil und zieh. Das Floß kommt, ganz langsam.", "Teo hätte das mit einer Hand gemacht.", ...MEET] }] };

// ---- L5: Lantern in his hide, in person (his figure in the feed for now). He says Sie until she has brought him the stick
Cutaway.actor("lantern_k2", { name: "Lantern", color: "#b0f0a0", room: "lantern_versteck", at: AV.lantern, facing: "se", walkTo: AV.talk, face: "nw",
  costume: { idle: "lantern_feed", walk: "lantern_feed", talk: "lantern_feed" }, voice: { pitch: 46, wave: "square", syllable: 85 },
  look: ["Ein grüner Iro, ein Okular über einem Auge, ein Headset mit drei Antennen.", "Um den Hals hängt eine kleine Laterne am Kabel. Sie brennt."],
  talk: [{ if: "lantern_found=ally", then: [L("Du schon wieder. Pass auf, wer dir nachgeht.")], else: [L("Sie schon wieder.")] }, { dialog: "lantern" }] });
Nagiwa.talkTree("lantern", [
  ["„Ich hab gesehen, was passiert ist.“", [
    L("Was heißt gesehen?"),
    "CAM 31. Ich hab zugesehen, die ganze Zeit.",
    L("Dann wissen Sie, dass ich ..."),
    L("Ich war schon weg. Ich hab nicht mal ..."),
    "Sie konnten ihn nicht sehen. Er stand hinter der Treppe.",
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
    ["„Hier. Der gehört Ihnen.“", [
      { unset: "stick_ines" }, { if: "has:stick", then: [{ remove: "stick" }] }, { set: "lantern_found", value: "ally" },
      L("Ohne den sind ihre Tabellen nur Rauschen."),
      L("Montag. Um eins. Bis dahin stehen die Sender."),
      L("Und ... danke. Du hast ihn mir gebracht. Das vergess ich nicht."),
      "Ich heiß ...",
      L("Sag's nicht. Ich will's nicht wissen müssen."),
    ]],
    ["„Noch nicht.“", [L("Dann gehen Sie. Und lassen Sie sich nicht folgen.")]],
  ], "stick_ines"],
  ["„Was ist das hier?“", [
    L("Das war mal ein Laden. Jetzt ist es ein Sender."),
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

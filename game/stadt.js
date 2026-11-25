// Nagiwa: the city in Chapter 1 (docs/kapitel1-design.md, "Die Stadt"), painted. So far the
// way up on to the Kessel Block's roof, the Rain Reader there and the first look at the Rings from below.
// What Juno finds, she can take when she finds it: nothing here waits for an earlier click (CLAUDE.md, conventions). So each thing has its own flag.
//   got_ausweis, got_haken   Juno has taken the ID, the lift's key (from the prologue on: Chapter 1 keeps them)
//   window_open, ladder_down   the way up to the roof
//   traeger     the white carriers, Thursday night: watched | filmed | girl
//   imai_step   the woman who remembers: 0, 1 she has told it, 2 Juno found the street and the night, 3 she told her (imai_told: truth | dream)
//   link_cam14, news_who, news_stack   the newspaper war: she has glassed her own block; she has seen who it is; she has seen the stack
// Each story here is a thread of its own, independent of the others: together they would multiply each other's states beyond what
// the solver can walk, so tools/solve-act.mjs checks them one at a time, the others shut with off_<thread> (CLAUDE.md, checks).
"use strict";

(function () {
const AF = Nagiwa.at.flat, AK = Nagiwa.at.kessel_14, AS = Nagiwa.at.sims, AD = Nagiwa.at.dach;
/** A costume entry for someone who stays put: one animation whichever way the engine turns them. @param {string} anim */
const every = (anim) => ({ se: anim, sw: anim, ne: anim, nw: anim });
const flat = Cutaway.room.get("flat").hotspots, floor14 = Cutaway.room.get("kessel_14").hotspots;

// ---- the window of the flat: it sticks, and only something flat gets at the latch
Cutaway.item("ausweis", { name: "Nagi·wa-Ausweis", icon: "inv_ausweis", look: "CIVIC MONITOR, J. REYES. UNGÜLTIG. Er ist flach und hart." });
Cutaway.item("haken", { name: "Notschlüssel", icon: "inv_haken", look: "Der Notschlüssel vom Aufzug ist ein langer Haken." });
flat.box_old.look = ["Das ist ein Karton von damals.", { if: "!got_ausweis", then: ["Da ist mein Nagi·wa-Ausweis drin: CIVIC MONITOR, J. REYES. UNGÜLTIG."] }, "Und der Kaktus ist vertrocknet, wie alles aus der Zeit."];
flat.box_old.use = [{ if: ["!got_ausweis", "!off_roof"], then: ["Da ist der Ausweis: CIVIC MONITOR, J. REYES. UNGÜLTIG.", "Er ist flach und hart. Den steck ich ein.", { give: "ausweis" }, { set: "got_ausweis" }],
  else: ["Mehr brauch ich aus dem Karton nicht."] }];
flat.window.use = [{ if: "window_open", then: [{ goto: "sims", at: AS.window, face: "se" }],
  else: ["Es klemmt, der Riegel sitzt im Rahmen. Da kommt man nur mit was Flachem ran."] }];
flat.window.with = { ausweis: [{ if: "!window_open", then: ["Ich schieb den Ausweis in den Spalt und hebel ihn hoch. Noch mal.", "Klick.", "Das ist das erste Mal, dass das Ding was aufmacht.", { set: "window_open" }, { goto: "sims", at: AS.window, face: "se" }],
  else: ["Das Fenster ist offen."] }] };
flat.window.look = [...flat.window.look, "Rechts draußen geht die Leiter aufs Dach. Da oben war ich zuletzt mit Teo."];

// ---- the lift never runs; its emergency key hangs on the wall beside the doors all the same, as a thing of its own (art/rooms/kessel_14.map.js)
floor14.haken = { name: "Notschlüssel", poly: AK.hakenPoly, walkTo: AK.haken, face: "ne", z: 1, if: ["!got_haken", "!off_roof"],
  look: ["Der Notschlüssel vom Aufzug ist ein langer Haken.", "Er hängt da, falls der Aufzug mal fährt."],
  use: ["Der Notschlüssel ist lang genug für alles.", "Um stecken zu bleiben, müsste der Aufzug erst mal fahren. Den nehm ich mit.", { hide: "haken" }, { give: "haken" }, { set: "got_haken" }] };
const room14 = Cutaway.room.get("kessel_14");
room14.enter = [{ if: "got_haken", then: [{ hide: "haken" }] }, ...(room14.enter ?? [])];

// ---- the ledge outside the window: Juno is afraid of heights (the old photo on the deck). Painted as a stage (art/rooms/sims.px.js,
// kapitel1-design "Der Sims im Bild"): what moves in it (KESSEL's L, the drone's light, the transformer's lamp, the AC's drip) is each
// its own rect of the picture, behind everyone; its lamps are the runtime light, so Juno takes on the neon's magenta
const SP = Nagiwa.parts.sims;
Cutaway.room("sims", { name: "Der Sims", background: "sims_bg", walk: AS.walk,
  props: [
    ...SP.parts.map((/** @type {any} */ p) => ({ id: p.name.slice("sims_".length), image: p.name, at: p.at, anchor: [0, 0], baseline: 0 })),
    { id: "ladder", image: SP.ladder.name, at: SP.ladder.at, anchor: [0, 0], baseline: 0, if: "ladder_down" },   // pulled down with the hook
  ],
  light: { ambient: 0.9, lamps: SP.lamps.map((/** @type {any} */ [x, y, color, r, power], /** @type {number} */ i) => ({ id: `lamp${i}`, at: [x, y], r, color, power })) },
  ambience: ["city_far", "neon_buzz", { sfx: "feed_rain", gain: 0.8 }], music: { theme: "juno", intensity: 0.2 },
  fx: [
    { kind: "rain", rect: [0, 0, 320, 180], count: 70, color: "#2f3e5a", speed: 130, slant: 0.2, length: 3 },
    { kind: "rain", rect: [0, 0, 320, 180], count: 30, color: "#617aa0", speed: 220, slant: 0.22, length: 6 },
  ],
  hotspots: {
    window: { name: "Mein Fenster", rect: AS.windowRect, walkTo: AS.window, face: "nw", look: "Mein Fenster. Von außen sieht meine Wohnung fast nett aus.",
      use: [{ goto: "flat", at: AF.window, face: "sw" }] },
    below: { name: "Die Straße", rect: AS.belowRect, walkTo: AS.window, face: "se", look: ["Es sind vierzehn Stockwerke. Nicht runterschauen.", { zoom: "look_strasse" }, "Ich hab runtergeschaut.",
      "Da unten ist LUCKY STATIC. Von hier oben ist es nur noch ein Licht.", { zoom: false }] },
    sign: { name: "KESSEL", rect: AS.signRect, walkTo: AS.sign, face: "ne", look: ["Beide E sind tot. Von der Straße liest man K SS L.", "Wenn das L auch noch ausgeht, wohne ich im K SS."] },
    drone: { name: "Lieferdrohne", poly: AS.dronePoly, walkTo: AS.drone, face: "nw", look: ["Da hängt eine Lieferdrohne in den Kabeln, und ihr Licht blinkt noch.", "Auf das Paket wartet bestimmt jemand. Wahrscheinlich schon seit Wochen."] },
    ac: { name: "Klimabox", rect: AS.acRect, walkTo: AS.ac, face: "ne", look: "Die Klimabox gehört zu keiner Wohnung mehr. Sie tropft trotzdem." },
    garden: { name: "Garten", poly: AS.gardenPoly, walkTo: AS.garden, face: "ne",
      look: ["Jemand hat hier oben einen Garten angelegt. Ich war das nicht.", "Die Erde ist feucht, und die welken Blätter sind abgezupft.", "Sogar der Kaktus blüht, dabei regnet es hier jeden Tag."],
      use: "Ich gieß da nichts, bevor ich weiß, wem der Garten gehört." },
    jt: { name: "J+T", rect: AS.jtRect, walkTo: AS.jt, face: "ne", look: ["J plus T. Das hab ich mit vierzehn in den Beton gekratzt.", "Das Plus hat Teo gemacht. Er war sechs und hat darauf bestanden."] },
    ladder: { name: "Leiter", rect: AS.ladderRect, walkTo: AS.ladder, face: "ne",
      look: [{ if: "ladder_down", then: ["Die Leiter hängt jetzt da, wo sie hingehört."], else: ["Die Leiter aufs Dach hängt zwei Meter zu hoch.", "Teo kam da früher mit irgendwas Langem ran."] }],
      use: [{ if: "!ladder_down", then: ["Sie hängt zwei Meter zu hoch. Teo kam da mit irgendwas Langem ran, ich nicht.", "Ohne was mit Haken wird das nichts."],
        else: ["Nicht runterschauen.", { goto: "dach", at: AD.hatch, face: "ne" }] }],
      // the hook stays in the bag: Chapter 2 needs it again for the raft (the user's decision, 2026-11-14)
      with: { haken: [{ if: "ladder_down", then: ["Die hängt schon unten."], else: ["Der Haken greift, und ich zieh.", "Sie kommt runter, mit allem Rost der letzten zwanzig Jahre.",
        "Den Haken behalt ich. Wer weiß.", { set: "ladder_down" }, "Nicht runterschauen.", { goto: "dach", at: AD.hatch, face: "ne" }] }] } },
    // the section pulled down (the prop sims_ladder): from there on the ladder reaches the ledge
    ladder_low: { name: "Leiter", rect: AS.ladderLowRect, walkTo: AS.ladder, face: "ne", if: "ladder_down", look: "Die Leiter hängt jetzt da, wo sie hingehört.",
      use: ["Nicht runterschauen.", { goto: "dach", at: AD.hatch, face: "ne" }] },
  } });

// ---- the roof. Above it, where other people have a sky, the underside of the next Ring
Cutaway.actor("regenleserin", { name: "Regenleserin", color: "#a8c8e8", room: "dach", at: AD.reader, facing: "sw", walkTo: AD.readerTalk, face: "sw",
  // the same view for every facing, as Bao: she stays on her bucket
  costume: { idle: every("regen_idle_sw"), walk: every("regen_idle_sw"), talk: every("regen_talk_sw") }, voice: { pitch: 58, range: 4, wave: "triangle", syllable: 90, speed: 0.8 },
  look: ["Eine alte Frau sitzt auf einem Eimer und hält einen zweiten unter das Tropfen.", "Sie kostet das Wasser so sicher, wie andere die Zeitung lesen.",
    "Sie nimmt dafür nicht die Zunge, sondern ihre Barteln.", "Das ist ein billiger Umbau, noch aus der Flut."],
  talk: [{ dialog: "regenleserin" }] });   // game/regenleserin.js
Cutaway.room("dach", { name: "Das Dach", background: "dach_bg", walk: AD.walk,
  ambience: ["city_far", { sfx: "feed_rain", gain: 0.5 }], music: { theme: "juno", intensity: 0.2 },
  hotspots: {
    hatch: { name: "Leiter nach unten", rect: AD.hatchRect, walkTo: AD.hatch, face: "sw", look: "Runter ist die Leiter schlimmer als rauf.", use: [{ goto: "sims", at: AS.ladder, face: "sw" }] },
    rings: { name: "Die Ringe", rect: AD.ringsRect, walkTo: AD.edge, face: "ne", look: "Da oben ist nicht der Himmel. Da oben ist der Boden von jemand anderem.", use: [{ goto: "dach_blick" }] },
    screen: { name: "Der große Schirm", rect: AD.screenRect, walkTo: AD.edge, face: "ne", look: ["NAGI·WA. SLEEP BETTER.", "Früher stand da RISE ABOVE. Das hier ist wenigstens ehrlicher."] },
    noodles: { name: "NOODLES", rect: AD.noodlesRect, walkTo: AD.edge, face: "ne", look: "Da steht N, D, L, E, S. Zwei Buchstaben haben's nicht geschafft." },
    drone: { name: "Drohne", rect: AD.droneRect, walkTo: AD.edge, face: "ne", look: ["Da hängt eine Kameradrohne. Die hingen damals schon hier oben rum.", "Uns hat das nie gestört."] },
    place: { name: "Unser Platz", rect: AD.placeRect, walkTo: AD.edge, face: "ne", look: ["Da haben wir gesessen, ich mit vierzehn und Teo mit sechs.", "Wir hatten eine Schale Nudeln für zwei."], use: [{ goto: "dach_sitzen" }] },
  } });

// sitting where they sat, the old photo's picture twenty years on
Cutaway.room("dach_sitzen", { name: "Unser Platz", background: "dach_heute", observe: true, lines: "bottom", buttons: false,
  // on Monday evening Teo sits at her right, his head on her shoulder (Chapter 2, game/kapitel2.js: the view teo_up)
  props: [{ id: "teo", image: "dach_teo", at: Nagiwa.at.dach_sitzen.teo, anchor: [0, 0], baseline: 999, if: "teo_up" }],
  ambience: ["city_far", { sfx: "feed_rain", gain: 0.5 }], music: { theme: "memory", fade: 2 },
  hotspots: { back: { name: "Aufstehen", rect: [0, 0, 320, 180], exit: { to: "dach", at: AD.edge, face: "sw" } } },
  enter: ["Er ist hier eingeschlafen. An meiner Schulter.", "Ich hab mich eine Stunde nicht bewegt. Vor Angst, und damit er weiterschläft.", "Heute schläft er besser. Sagt er."] });

// ---- the newspaper war: 14C asks who steals her paper, 14A says nobody reads it. To know, Juno would have to glass her own
// block, which she would never do. It is 14C herself, asleep, on Lull: she doesn't know, and every face in the stack is marked
// with four corners, the way an observer marks one (story §6: the sleepers mark what looks wrong). Nobody explains it.
const AC = Nagiwa.at.cam14;
const notesLook = floor14.notes.look;
floor14.notes.look = [{ if: ["news_who", "news_stack"], then: [...notesLook, "Und drunter steht von mir: ES IST NIEMAND. 14B."], else: notesLook }];
floor14.notes.use = [{ if: "day>1", then: ["Wer klaut die? Seit Wochen geht das so.", "Über mir hängt Nagi·was Kamera. Ich müsste nur reinschauen."], else: ["Auf dem vierzehnten ist Krieg."] }];
floor14.corner_cam.use = [{ if: ["day>1", "day<5", "!link_cam14", "!off_zeitung"], then: ["Mein alter Zugang geht auch hier.", "Den eigenen Block glasst man nicht. Das sag ich Motte auch.", { dialog: "zeitung_cam" }],
  else: [{ if: "link_cam14", then: ["Ich bin schon drauf. Schöner wird's nicht."], else: ["Den eigenen Block glasst man nicht."] }] }];
Cutaway.dialog("zeitung_cam", { main: { choices: [
  { text: "„Nur dieses eine Mal.“", goto: "end", then: [{ set: "code_cam14" }, { set: "link_cam14" }, { sfx: "link" }, "Das sagen alle. CAM 14 ist auf dem Deck."] },
  { text: "„Nein. Das lass ich.“", goto: "end", then: ["Soll die Zeitung halt weg sein."] },
] } });
Nagiwa.cams.cam14 = { id: "14", place: "KESSEL-BLOCK, 14. STOCK", owner: "NAGI·WA", map: [8, 14], if: "link_cam14" };
Cutaway.actor("haldane_feed", { name: "Jemand im Morgenmantel", color: "#ffa8d8",
  // asleep on her feet (art/characters/haldane.px.js): SE, NE and NW drawn, so the patch stays behind the ear it belongs to
  costume: { idle: { se: "haldane_idle_se", ne: "haldane_idle_ne", nw: "haldane_idle_nw" }, walk: { se: "haldane_walk_se", ne: "haldane_walk_ne", nw: "haldane_walk_nw" },
    talk: { se: "haldane_idle_se", ne: "haldane_idle_ne", nw: "haldane_idle_nw" } }, speed: [8, 4],
  look: ["Da geht jemand im Morgenmantel, sehr langsam.", "Die Hände hängen einfach runter."],
  talk: [{ if: "!news_who", then: ["Es ist halb drei, und sie trägt einen Morgenmantel. Sie geht langsam, die Augen ...", "Die Augen sind zu.", "Das ist Frau Haldane aus 14C. Sie holt sich die Zeitung, ihre eigene und die von 14A.", "Und der Zettel ist ihr eigener: WER KLAUT MEINE ZEITUNG.", { set: "news_who" }, { evi: "verwirrt" }, { say: "evi", text: "Sie schläft. Darf man das?" }],
    else: ["Das ist Frau Haldane. Sie schläft und holt die Zeitung. Die markier ich nicht."] }] });
Cutaway.routine("haldane_feed", [{ day: [2, 3], from: "02:30", to: "02:45", room: "cam14", at: AC.door, path: [AC.door, AC.mat, AC.door] }]);
// CAM 14 is the floor's own picture (the user's wish, 2026-11-09): its bake and props under the feed's filter, moved by AC.shift so
// its right edge is the feed's. The camera itself is left out of its own picture; the hook only while it hangs
const K14 = Nagiwa.at.kessel_14, SH = AC.shift;
const shiftX = (/** @type {number[]} */ xs) => xs.map((v, i) => (i % 2 ? v : v + SH));
Nagiwa.camRoom("cam14", { background: undefined, color: Nagiwa.PHOSPHOR[0], mic: { at: AC.mic, clear: 40, lost: 150 },
  post: [{ exposure: AC.exposure }, ...Nagiwa.FEED_POST],
  props: [
    { id: "floor14", image: "kessel_14_bg", at: [SH, 0], anchor: [0, 0], baseline: -1000 },
    ...K14.props.filter((/** @type {any} */ p) => p.id !== "corner_cam" && p.id !== "corner_cam_dark").map((/** @type {any} */ p) => ({ ...p, at: [p.at[0] + SH, p.at[1]],
      ...(p.front ? { front: shiftX(p.front) } : {}), ...(p.id === "haken" ? { if: "!got_haken" } : {}) })),
    // the morning's bundle before the mat, left of the rail's post (where the post hid half of it)
    { id: "papers", image: "haldane_papers", at: [AC.mat[0] - 12, AC.mat[1] + 2], if: "time<02:45" },
    // while she walks out here her armchair stands empty: she is never in two places at once
    { id: "chair_empty", image: "kessel_14_chair_empty", at: AC.chairEmpty, anchor: [0, 0], baseline: -999, if: "at:haldane_feed=cam14" },
  ],
  hotspots: {
  doors: { name: "Tür", poly: AC.doorPoly, look: ["Das ist der Flur von oben, genau wie ich ihn in Erinnerung hab.", "Den hab ich ja mal beobachtet, von Berufs wegen."] },
} });
const haldaneUse = floor14.haldane.use;
// the point behind a sleeper's ear: the beat cam31 waits for (and nobody says why)
const PUNKT = ["Der Punkt hinter ihrem Ohr blinkt immer gleich.", "Woher kenn ich das?"];
floor14.haldane.use = [{ if: ["day>1", "day<5", "!news_stack", "!off_zeitung"], then: ["Die Tür steht offen. Sie schläft wirklich.", "Hinter dem Sessel liegt ein Stapel Zeitungen, so hoch wie Motte.", { zoom: "look_zeitung" }, "Auf jeder Seite sind Gesichter angestrichen.", "Nein, nicht angestrichen. Um jedes Gesicht sind vier kleine Ecken.", "So markier ich.", { zoom: false }, { set: "news_stack" }, { cache: "note_haldane_marks" }, ...PUNKT,
    { evi: "besorgt" }, { say: "evi", text: "Warum macht sie das?" }, "Ich weiß es nicht, und sie weiß es auch nicht."],
  else: [{ if: "day>1", then: PUNKT, else: [haldaneUse] }] }];
// a click does a hotspot's first action, and her door's is talking: from Wednesday on that is the newspaper war's
const haldaneTalk = floor14.haldane.talk;
floor14.haldane.talk = [{ if: "day>1", then: floor14.haldane.use, else: [haldaneTalk] }];

// ---- Frau Haldane awake (kapitel1-design §7): on Thursday evening she is free until her shift at seven and sits up in her chair. Her son
// writes every Sunday from the Fifth, where he works, and for three Sundays he hasn't (the side story of her son's letters begins, story §9;
// the Fifth is where the Rain Reader tastes saline). Nothing is a flag: it may be heard again.
const H = (/** @type {string} */ text) => ({ say: "haldane", text });
const AWAKE = "day=3", BEFORE_SHIFT = "time<19:00";
Cutaway.actor("haldane", { name: "Frau Haldane", color: "#ffa8d8", voice: { pitch: 62, range: 3, wave: "triangle", syllable: 90, speed: 0.85 } });
floor14.haldane.talk = [{ if: [AWAKE, BEFORE_SHIFT], then: [
  H("Juno! Ich bin wach, stell dir vor. Bis sieben hab ich frei."), H("Hast du Post für mich? Nein. Du doch nicht."), "Wartest du auf was?",
  H("Mein Junge schreibt jeden Sonntag. Aus dem Fünften, er hat da Arbeit."), H("Seit drei Sonntagen nichts."), "Vielleicht hat er viel zu tun.",
  H("Das sag ich mir auch. Jeden Abend, bevor ich mein Licht anmach."), H("Dann schlaf ich, und morgens ist es nicht mehr so schlimm."), "..."],
  else: floor14.haldane.talk }];
floor14.haldane.look = [{ if: [AWAKE, BEFORE_SHIFT], then: ["Frau Haldane sitzt wach im Sessel und trinkt Tee. Das seh ich selten.", "Das Licht hinter ihrem Ohr ist aus, für zwei Stunden."], else: floor14.haldane.look }];
Nagiwa.cache.note_haldane_marks = { kind: "note", name: "FRAU HALDANES ZEITUNGEN", about: "Ein Stapel hinter ihrem Sessel. Jedes Gesicht darin: vier Ecken. Wie meine." };

// ---- the woman who remembers (story §9): a Lull user is sure she saw a murder in a street she has never been to, from above, as
// if she hung on a lamp post. The street exists, and the night: she saw the camera's feed in her sleep. Juno is the only one who can
// tell her, and has the choice: the truth, which frightens her, or a lie that lets her sleep. She is the UNKNOWN LINK in the clinic's queue.
const AI = Nagiwa.at.lucky_static, A18 = Nagiwa.at.cam18;
Object.assign(Nagiwa.contacts, { imai: { name: "R. IMAI", color: "#c8d8b0", status: "schläft", if: ["day>1", "day<5", "!off_imai"], unread: "!read_imai",
  open: [{ if: "!read_imai", then: [{ set: "read_imai" }, "Sie hat einen Mord gesehen, in einer Straße, in der sie nie war.", "Und sie nimmt Lull. Natürlich nimmt sie Lull."] }] } });
Cutaway.state.view("read_imai");
Nagiwa.threads.imai = [
  { from: "imai", at: "18:20", text: "Sie finden Leute, habe ich gehört. Ich habe einen Mord gesehen. In einer Straße, in der ich nie war." },
  { from: "imai", at: "18:21", text: "Mein Arzt sagt, das kommt vom Schlaf. Ich will wissen, ob ich verrückt bin. Ich sitze abends im LUCKY STATIC." },
];
Nagiwa.ledger.imai = { to: "R. IMAI", what: { truth: "die Wahrheit", dream: "ein Traum" } };
Cutaway.actor("imai", { name: "Frau Imai", color: "#c8d8b0", room: "lucky_static", at: AI.imai, facing: "sw", walkTo: AI.imaiTalk, face: "se",
  costume: { idle: every("imai_idle_sw"), walk: every("imai_idle_sw"), talk: every("imai_talk_sw") }, voice: { pitch: 60, range: 4, wave: "triangle", syllable: 85, speed: 0.9 },
  look: ["Sie sitzt vor einem Tee, der längst kalt ist. Hinter ihrem Ohr leuchtet der blasse Punkt.", "Sie hat drei Finger an jeder Hand, und alle sind viel zu lang.", "Sie hat es mit nichts eilig.", "Die kenn ich. Die stand in der Schlange vor der Klinik."],
  talk: [
    { if: ["imai_step=0", "!off_imai"], then: [
      "Die kenn ich. Die stand in der Schlange vor der Klinik.", "Hinter ihrem Ohr leuchtet der blasse Punkt.", { say: "imai", text: "Sie sind die Glasserin? Danke, dass Sie gekommen sind." }, { say: "imai", text: "Mir glaubt keiner. Ich glaube es ja selbst nicht." },
      { say: "imai", text: "Da ist eine Treppe, und auf den Stufen ist ein großer Fisch. Es regnet von links." }, { say: "imai", text: "Ein Mann fällt die Treppe hinunter, und ein anderer geht einfach weg." },
      "Und wann war das?", { say: "imai", text: "Das war vor einer Woche, im Schlaf. Ich schlafe von drei bis sieben." }, { say: "imai", text: "Ich nehme vier Stunden Lull, wie alle hier." },
      { set: "imai_step", value: 1 }, "Eine Treppe mit einem Fisch darauf. Das ist CAM 18 am alten Fischmarkt.", "Das könnte ihre Treppe sein, und zu der Kamera hab ich noch Zugang."] },
    { if: "imai_step=1", then: [{ say: "imai", text: "Haben Sie die Treppe gefunden? Die mit dem großen Fisch auf den Stufen?" }] },
    { if: "imai_step=2", then: [{ say: "imai", text: "Und, was ist? Bin ich verrückt?" }, { dialog: "imai_wahl" }] },
    { if: "imai_told=truth", then: [{ say: "imai", text: "Ich hab heute nicht geschlafen. Ich trau mich nicht." }] },
    { if: "imai_told=dream", then: [{ say: "imai", text: "Ich schlafe wieder gut. Danke. Sie glauben gar nicht, wie gut." }] },
  ] });
Cutaway.dialog("imai_wahl", { main: { choices: [
  { text: "„Sie sind nicht verrückt.“", goto: "end", then: [{ set: "imai_step", value: 3 }, { set: "imai_told", value: "truth" }, { ledger: "imai", value: "truth" }, "Die Treppe gibt es, und den Mann gibt es auch.", "Es war am neunundzwanzigsten Oktober um drei Uhr zwölf.",
    { say: "imai", text: "Da hab ich geschlafen." }, "Ich weiß.", { say: "imai", text: "Und wie soll ich das gesehen haben?" }, "Das weiß ich nicht.", { say: "imai", text: "Dann will ich heute Nacht nicht schlafen." }] },
  { text: "„Das war nur ein Traum.“", goto: "end", then: [{ set: "imai_step", value: 3 }, { set: "imai_told", value: "dream" }, { ledger: "imai", value: "dream" }, "Ich hab nachgesehen. Da gibt es keine Treppe und keinen Fisch.",
    { say: "imai", text: "Gott sei Dank. Ich dachte schon ..." }, "Schlafen Sie gut, Frau Imai.", { evi: "verwirrt" }, { say: "evi", text: "Die Treppe gibt es aber. Ich hab sie gesehen." }, "Ich weiß."] },
] } });
Nagiwa.cams.cam18 = { id: "18", place: "ALTER FISCHMARKT", owner: "NAGI·WA", map: [120, 14], if: { or: ["day>4", "imai_step>=1"] } };
Nagiwa.cache.note_imai_street = { kind: "note", name: "FRAU IMAIS TREPPE", about: "CAM 18, 29.10., 03:12. Es ist passiert. Sie schlief. Sie hat es von hier oben gesehen." };
// the rain from the left: the camera hangs crooked
Nagiwa.camRoom("cam18", { background: "cam18_bg", mic: { at: A18.mic, clear: 40, lost: 150 },
  fx: [{ kind: "rain", rect: [0, 0, 320, 180], count: 45, color: "#8acfae", speed: 170, slant: 0.45, length: 4 }], hotspots: {
  fish: { name: "Fisch", poly: A18.fishPoly, z: 1, look: ["Jemand hat einen Fisch auf die Stufen gemalt. FISH steht drunter, falls jemand fragt.", "Von unten sieht man nur Striche auf den Stufen. Den Fisch sieht man nur von hier oben."] },
  stairs: { name: "Treppe", poly: A18.stairsPoly, look: ["Das ist die Treppe zum alten Fischmarkt.", "Der Regen kommt von links, weil die Kamera schief hängt."] },
  rewind: { name: "Archiv", z: 5, if: "imai_step=1",
    use: ["Ältere Nächte liegen im Nagi·wa-Archiv. Mein alter Zugang reicht gerade noch.", "Ich such den neunundzwanzigsten Oktober.", { rewind: "03:12", date: "2091-10-29" }, "Um drei Uhr zwölf ist es so weit. Einer fällt die Treppe runter, und einer geht weg.",
      "Sie hat es genau von hier oben gesehen, so, wie sie gesagt hat.", "Und den ganzen Fisch sieht man nur von hier oben.", "Um die Zeit lag sie im Bett und schlief.", "Wie sieht jemand im Schlaf, was meine Kamera sieht?", { cache: "note_imai_street" }, { set: "imai_step", value: 2 }, { live: true }] },
} });
Cutaway.room("lucky_static", { name: "LUCKY STATIC", background: "lucky_static_bg", walk: AI.walk, holes: AI.holes, props: AI.props,
  light: { ambient: 0.82, lamps: AI.lamps.map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
  ambience: ["neon_buzz", "fridge_hum"], music: { theme: "juno", intensity: 0.4 },
  hotspots: {
    door: { name: "Tür", poly: AI.doorPoly, walkTo: AI.door, face: "sw", use: [{ goto: "kowalski", at: Nagiwa.at.kowalski.lucky_door, face: "se" }] },
    bar: { name: "Theke", poly: AI.barPoly, walkTo: AI.bar, face: "ne", look: "Meis Theke. Wer hier anschreiben lässt, weiß, was er tut." },
    karaoke: { name: "Karaoke", poly: AI.karaokePoly, walkTo: AI.karaoke, face: "nw", look: "Da steht OUT OF ORDER. Trotzdem singt hier jeden Abend jemand." },
  } });
Cutaway.room.get("kowalski").hotspots.lucky_door.use = [{ if: "day=1", then: ["Heute nicht. Heute will ich zu Bao."], else: [{ goto: "lucky_static", at: AI.arrive, face: "ne" }] }];

// ---- the white carriers (kapitel1-design): Thursday night a white van stops on Kowalski Street, two kind people carry a sleeper out
// of the house opposite and his daughter stands in the door. What happens to Sinkers, long before it happens to Teo. Time only moves when
// Juno waits: at 23:30 she hears it from wherever she is, and it waits for her in the street.
Cutaway.moment("traeger_ruf", { room: "deck", day: 3, from: "23:15", to: "23:30", if: "~never",
  unseen: [{ if: "!off_traeger", then: ["Von unten hör ich einen Wagen, der nicht hupt. So was gibt's im Neunten nicht."] }] });
// only voices: they are seen in the close-up look_traeger (art/ui/look_traeger.px.js), never in the street (the user's decision, 2026-11-13)
for (const [id, name, pitch] of /** @type {[string, string, number][]} */ ([["traeger_weiss", "Jemand in Weiß", 56], ["traeger_kind", "Das Mädchen", 74]]))
  Cutaway.actor(id, { name, color: "#a8b8d0", voice: { pitch, range: 4, wave: "triangle", syllable: 80 } });
Cutaway.moment("traeger", { room: "kowalski", day: 3, from: "23:30", to: "00:45", if: "!off_traeger",
  play: ["Vor dem Haus gegenüber steht ein weißer Wagen ohne Schild.", { zoom: "look_traeger" }, "Zwei Leute in Weiß, sehr freundlich, tragen jemanden raus, und der schläft.",
    { say: "traeger_weiss", text: "Ruhe-Erschöpfung." }, { say: "traeger_weiss", text: "Er hat es jetzt gut." }, "Oben gehen die Rollos runter, eins nach dem anderen.", { zoom: false }, { dialog: "traeger_wahl" }] });
Nagiwa.cache.clip_traeger = { kind: "clip", name: "DIE WEISSEN TRÄGER", about: "Kowalski-Straße, Do 23:30. Ein Sinker, zwei in Weiß, ein Mädchen in der Tür." };
Cutaway.dialog("traeger_wahl", { main: { choices: [
  { text: "Zusehen.", silent: true, goto: "end", then: ["Ich schau zu. Das kann ich.", "Die Türen gehen zu. Der Wagen fährt, und er hupt immer noch nicht."] },
  { text: "Filmen.", silent: true, goto: "end", then: [{ cache: "clip_traeger" }, "Das Taschen-Deck reicht dafür. Es gibt Leute, die zahlen für so was.", { evi: "besorgt" }, { say: "evi", text: "Das Mädchen ist mit im Bild." }, "Ich weiß."] },
  { text: "Zu dem Mädchen gehen.", silent: true, goto: "end", then: ["Ich geh rüber. Was sagt man da?", { say: "traeger_kind", text: "Geht es ihm gut? Die sagen, es geht ihm gut." }, "Ich weiß es nicht.", { say: "traeger_kind", text: "Er wacht einfach nicht auf." }, "Ich bleib, bis der Wagen weg ist. Mehr hab ich nicht."] },
] } });

// ---- the half repair: he lives on the scaffold at the big screen and repairs its left half; the right half is another contract
// (at work he has his back to the street whichever way he is turned, so 9-A reads; to talk he turns round, se or sw, towards Juno)
Cutaway.actor("reparatur", { name: "Der Monteur", color: "#b0c0b0", at: Nagiwa.at.kowalski.reparatur, facing: "ne", walkTo: Nagiwa.at.kowalski.scaffold, face: "ne",
  costume: { idle: every("monteur_idle_ne"), walk: every("monteur_idle_ne"), talk: { se: "monteur_talk_se", sw: "monteur_talk_sw", ne: "monteur_talk_se", nw: "monteur_talk_sw" } }, voice: { pitch: 48, range: 4, wave: "square", syllable: 80 },
  look: ["Ein Mann auf einem Gerüst, mit Kocher, Wäscheleine und Schlafsack. Er wohnt da.", "Er schraubt an der linken Hälfte. Nur an der linken.", "Er hat Pfoten wie ein Maulwurf und die Augen fast zu. Die Lampe sieht für ihn."],
  talk: [
    { if: "day=2", then: [{ say: "reparatur", text: "Links ist mein Vertrag. Rechts ist Vertrag 9-B. Der Kollege kommt seit 2087." }, "Und wenn links fertig ist?", { say: "reparatur", text: "Fertig? Junge Frau, dann bin ich arbeitslos." }] },
    { if: "day=3", then: [{ say: "reparatur", text: "Der stottert nur, wenn du vorbeigehst. Ist dir das schon aufgefallen?" }, "Woran liegt das?", { say: "reparatur", text: "Das weiß ich nicht. Das ist die rechte Hälfte." }] },
    { if: "day=4", then: [{ say: "reparatur", text: "Heute läuft sie gut, die Linke. Heute Abend ist was mit der Stadt." }, "Was denn?", { say: "reparatur", text: "Keine Ahnung. Ist nicht mein Vertrag." }] },
  ] });
// (no `at`: a routine's place must be walkable floor, and he stands up on his deck, where the actor starts)
Cutaway.routine("reparatur", [{ day: [2, 3, 4], from: "18:00", to: "04:00", room: "kowalski", face: "ne" }]);

// ---- the Drain Market seen straight down (kapitel1-design §9): the alley's way down, the preacher of the Waking Church (awake nine
// days on Wednesday: from above his counter isn't seen, the days come from what he says), the stairs further down (Chapter 2)
const AM = Nagiwa.at.drain_market;
Cutaway.actor("prediger", { name: "Der Prediger", color: "#d8c8a0", room: "drain_market", at: AM.preacher, facing: "down", walkTo: AM.preacherTalk, face: "up",
  costume: { idle: Nagiwa.top("prediger_top_idle"), walk: Nagiwa.top("prediger_top_idle"), talk: Nagiwa.top("prediger_top_talk") },
  voice: { pitch: 54, range: 8, wave: "sawtooth", syllable: 60, speed: 1.3 },
  look: ["Ein dürrer Mann steht auf einer Kiste, mit einer Thermoskanne in jeder Hand.", "Er predigt für die Wache Kirche.", "Er blinzelt nicht. Ich hab gezählt.", "Er hat keine Lider mehr. Die Zunge macht das."],
  talk: [
    { if: "day=2", then: [{ say: "prediger", text: "Neun Tage! Neun Tage wach, und ich sehe klarer als ihr alle! Kaffee?" }, "Was ist da drin?", { say: "prediger", text: "Alles, was nicht schläft." }] },
    { if: "day=3", then: [{ say: "prediger", text: "Zehn Tage. Sie sagen, wer schläft, sieht nichts. Falsch! Wer schläft, sieht was anderes!" }, "Woher willst du das wissen?", { say: "prediger", text: "Ich weiß es nicht. Ich glaube es. Das ist billiger. Kaffee?" }] },
    { if: "day=4", then: [{ say: "prediger", text: "Elf Tage. Da hinten steht jemand, und der kichert." }, "Da steht niemand.", { say: "prediger", text: "Das sagt er auch." }] },
  ] });
// every hotspot here is a stall, a counter, a flight of stairs or a curtain seen from above: a box, so a rect is its shape
Cutaway.room("drain_market", { name: "Drain-Markt", background: "drain_market_bg", size: AM.size, walk: AM.walk, holes: AM.holes,
  props: AM.props, foreground: AM.foreground, extras: AM.extras, light: { ambient: 0.85, lamps: AM.lamps },
  // as loud as a real market, each sound at its place (game/sounds.js): the crowd's murmur in three places with their own swells, the
  // wok's oil, the canal, the roofs' ACs, the pillar's hum; the only music is the old song on HOT WOK's radio, through its small speaker
  // (game/music.js); the one-shots from the stalls: game/markt_klang.js
  ambience: ["city_far",
    ...AM.sounds.murmur.map((/** @type {[number, number]} */ at, /** @type {number} */ i) => ({ sfx: `markt_stimmen_${"abc"[i]}`, at, reach: 560, near: 180 })),
    { sfx: "wok_zischen", at: AM.sounds.wok, reach: 220, near: 40 },
    ...AM.sounds.canal.map((/** @type {[number, number]} */ at) => ({ sfx: "kanal_wasser", at, reach: 320, near: 80 })),
    ...AM.sounds.roofs.map((/** @type {[number, number]} */ at) => ({ sfx: "dach_luefter", at, reach: 280, near: 90 })),
    { sfx: "pfeiler_brummen", at: AM.sounds.pillar, reach: 240, near: 50 },
    // the other tunes, each at its place (the user's wish, 2026-11-11): PACHINKO on the roof, the busker by the middle bridge,
    // the rafts' radios on two of the city's stations
    { sfx: "pachinko_jingle", at: AM.sounds.pachinko, reach: 260, near: 50 }, { sfx: "pachinko_kugeln", at: AM.sounds.pachinko, reach: 200, near: 40 },
    { sfx: "strassenmusik", at: AM.sounds.busker, reach: 300, near: 50 },
    { sfx: "radio_nudelfloss", at: AM.sounds.noodleRaft, reach: 240, near: 40 }, { sfx: "radio_datenfloss", at: AM.sounds.dataRaft, reach: 240, near: 40 }],
  music: { theme: "wokradio", speaker: 1, at: AM.sounds.radio, reach: 380, near: 60 },
  hotspots: {
    up: { name: "Zur Gasse", rect: AM.upRect, walkTo: AM.up, face: "up", use: [{ goto: "gasse", at: Nagiwa.at.gasse.market, face: "se" }] },
    kidneys: { name: "Stand", rect: AM.kidneysRect, walkTo: AM.kidneys, face: "up", look: "KIDNEYS ONLY. Der Mann dahinter sieht gesund aus. Das ist das Unheimliche." },
    jars: { name: "Implantate", rect: AM.jarsRect, walkTo: AM.jars, face: "up", look: "In den Gläsern liegen gebrauchte Implantate. Eins davon sieht aus wie meins." },
    stalls: { name: "Elektroschrott", rect: AM.ratzRect, walkTo: AM.ratzTalk, face: "up", look: "Da liegt Elektroschrott, nach nichts sortiert. Dahinter sitzt Ratz." },
    wok: { name: "Garküche", rect: AM.wokRect, walkTo: AM.wok, face: "left", look: "Bei HOT WOK zischt das Öl. Das Radio daneben spielt ein Lied, das älter ist als ich." },
    down: { name: "Treppe hinab", rect: AM.downRect, walkTo: AM.down, face: "down",
      look: "Da geht eine Treppe noch tiefer hinunter. Davor hängt eine Kette, und das Schloss daran blinkt rot.", use: ["Die Kette ist zu, und das Schloss sieht neu aus."] },
  } });
// The market's music is the wok's radio, a thing at its place, heard through its speaker. A room changing the theme only gets it at the
// next bar, while the speaker is off at once: the radio's song played on clean and loud for a moment in Sable's booth, the alley, on
// the raft. So going in or out of the market (not from the arrival, whose tune is made to end on the market), the music stops in a
// short fade, and the next room's starts at once
Cutaway.events.on("room.leave", (/** @type {{id?: string, to: string}} */ e) => {
  if (e.id && e.id !== e.to && e.id !== "drain_arrival" && (e.id === "drain_market" || e.to === "drain_market")) Cutaway.events.emit("music", { stop: true, fade: 0.5 });
});
// the arrival (kapitel1-design §9, decided 2026-11-11): every time Juno takes the stairs down from the alley, first the view from the
// top of them: the market's bustle two and a half seconds, then the camera tilting slowly down to the crowd on the canal; then the
// market from above. Later visits: one click skips it. The first time, Juno and EVI talk once the camera has come to rest (a click
// takes each line on); whether they have is a view flag (it changes what is said, never what happens)
Cutaway.state.view("markt_gesehen");
// Its music is the arrival's own (game/music.js markt_ankunft: it opens out as the camera comes to rest); the market's murmur sits at
// the picture's foot, so it rises as the camera tilts down (an observe room is heard from the middle of the view). Leaving it, the
// picture fades slowly to black and the market comes up out of it (game/transitions.js, leave: "fade")
Cutaway.room("drain_arrival", { name: "Drain-Markt", background: "drain_arrival_bg", size: [320, 432], observe: true, lines: "bottom", buttons: false, leave: "fade",
  ambience: ["city_far", { sfx: "markt_stimmen_a", at: [110, 420], reach: 330, near: 70 }, { sfx: "markt_stimmen_b", at: [220, 420], reach: 330, near: 70 }],
  music: { theme: "markt_ankunft" } });
// (both begin with the arrival's music at once, the alley's crossfading out: it is there as the view comes up, not at the next bar)
Cutaway.sequence("drain_arrival", {
  steps: [
    { music: { stop: true, fade: 0.6 } }, { music: { theme: "markt_ankunft", fade: 0.6 } },
    { goto: "drain_arrival" },
    { camera: [0, 0], ms: 0 },
    { wait: 2500 },
    { camera: [0, 252], ms: 9000, ease: "inOut" },
    { shot: "markt" },
  ],
});
Cutaway.sequence("drain_arrival_first", {
  steps: [
    { set: "markt_gesehen" },
    { music: { stop: true, fade: 0.6 } }, { music: { theme: "markt_ankunft", fade: 0.6 } },
    { goto: "drain_arrival" },
    { camera: [0, 0], ms: 0 },
    { wait: 2500 },
    { camera: [0, 252], ms: 9000, ease: "inOut" },
    // a shot mark before each line: a click takes one line on, not the whole talk
    { shot: "l1" }, "Jedes Mal ist der Markt heller, als ich ihn in Erinnerung habe.",
    { shot: "l2" }, { say: "evi", text: "Finden wir hier, was wir brauchen?" },
    { shot: "l3" }, "Hier unten findet man fast alles. Man muss nur wissen, wen man fragt.",
    { shot: "l4" }, { say: "evi", text: "Und wen fragen wir zuerst?" },
    { shot: "l5" }, "Zuerst niemanden. Zuerst schauen wir uns um.",
    { shot: "markt" },
  ],
  after: [{ set: "markt_gesehen" }],
});
// the market itself after the shot (a goto inside a sequence is only a shot: Juno would stay in the alley). The sequence leaves the
// scene on its last shot (restore: false), so the goto leaves from the view down: it fades out and the market fades in (leave: "fade")
Cutaway.room.get("gasse").hotspots.market.use = [{ if: "markt_gesehen", then: [{ sequence: "drain_arrival", restore: false }], else: [{ sequence: "drain_arrival_first", restore: false }] },
  { goto: "drain_market", at: AM.arrive, face: "down" }];

// the big look upwards (a shot of its own: the block for what will be painted as large as the intro's)
Cutaway.room("dach_blick", { name: "Die Ringe", background: "dach_blick_bg", observe: true, lines: "bottom", buttons: false,
  ambience: ["city_far", { sfx: "feed_rain", gain: 0.5 }], music: { theme: "juno", intensity: 0.2 },
  fx: [{ kind: "rain", rect: [0, 0, 320, 180], count: 30, color: "#a8b8d0", speed: 90, slant: 0, length: 3 }],
  hotspots: { back: { name: "Zurück", rect: [0, 0, 320, 180], exit: { to: "dach", at: AD.edge, face: "sw" } } },
  enter: ["Über mir hängen acht Ringe. Der helle Punkt da oben ist die Krone.", "Alles, was hier tropft, war schon mal bei jemandem im Glas."] });
})();

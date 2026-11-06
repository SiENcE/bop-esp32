// Halcyon: the city in Chapter 1 (docs/kapitel1-design.md, "Die Stadt"), on flat blocks (art/mock/). So far the
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
const AF = Halcyon.at.flat, AK = Halcyon.at.kessel_14, AS = Halcyon.at.sims, AD = Halcyon.at.dach;
/** A costume entry for someone who stays put: one animation whichever way the engine turns them. @param {string} anim */
const every = (anim) => ({ se: anim, sw: anim, ne: anim, nw: anim });
const flat = Cutaway.room.get("flat").hotspots, floor14 = Cutaway.room.get("kessel_14").hotspots;

// ---- the window of the flat: it sticks, and only something flat gets at the latch
Cutaway.item("ausweis", { name: "Halcyon-Ausweis", icon: "inv_ausweis", look: "CIVIC MONITOR, J. REYES. UNGÜLTIG. Flach und hart." });
Cutaway.item("haken", { name: "Notschlüssel", icon: "inv_haken", look: "Der Notschlüssel vom Aufzug. Ein langer Haken." });
flat.box_old.look = ["Ein Karton von damals.", { if: "!got_ausweis", then: ["Mein Halcyon-Ausweis. CIVIC MONITOR, J. REYES. UNGÜLTIG."] }, "Und der Kaktus. Vertrocknet. Wie alles aus der Zeit."];
flat.box_old.use = [{ if: ["!got_ausweis", "!off_roof"], then: ["Der Ausweis. CIVIC MONITOR, J. REYES. UNGÜLTIG.", "Flach und hart. Den steck ich ein.", { give: "ausweis" }, { set: "got_ausweis" }],
  else: ["Der Karton von damals. Mehr brauch ich daraus nicht."] }];
flat.window.use = [{ if: "window_open", then: [{ goto: "sims", at: AS.window, face: "se" }],
  else: ["Klemmt. Der Riegel sitzt im Rahmen. Da kommt man nur mit was Flachem ran."] }];
flat.window.with = { ausweis: [{ if: "!window_open", then: ["Der Ausweis in den Spalt. Hoch. Noch mal.", "Klick.", "Das erste Mal, dass das Ding was aufmacht.", { set: "window_open" }, { goto: "sims", at: AS.window, face: "se" }],
  else: ["Das Fenster ist offen."] }] };
flat.window.look = [...flat.window.look, "Rechts draußen geht die Leiter aufs Dach. Da oben war ich zuletzt mit Teo."];

// ---- the lift never runs; its emergency key hangs on the wall beside the doors all the same, as a thing of its own (art/rooms/kessel_14.map.js)
floor14.haken = { name: "Notschlüssel", rect: AK.hakenRect, walkTo: AK.haken, face: "ne", z: 1, if: ["!got_haken", "!off_roof"],
  look: "Der Notschlüssel vom Aufzug. Ein langer Haken. Hängt da, falls der Aufzug mal fährt.",
  use: ["Der Notschlüssel. Lang genug für alles.", "Stecken bleiben müsste er erst mal fahren. Den nehm ich mit.", { hide: "haken" }, { give: "haken" }, { set: "got_haken" }] };
const room14 = Cutaway.room.get("kessel_14");
room14.enter = [{ if: "got_haken", then: [{ hide: "haken" }] }, ...(room14.enter ?? [])];

// ---- the ledge outside the window: Juno is afraid of heights (the old photo on the deck)
Cutaway.room("sims", { name: "Der Sims", background: "sims_bg", walk: AS.walk,
  ambience: ["city_far", { sfx: "feed_rain", gain: 0.8 }], music: { theme: "juno", intensity: 0.2 },
  fx: [{ kind: "rain", rect: [0, 0, 320, 180], count: 40, color: "#41547a", speed: 150, slant: 0.1, length: 4 }],
  hotspots: {
    window: { name: "Mein Fenster", rect: AS.windowRect, walkTo: AS.window, face: "nw", look: "Mein Fenster. Von außen sieht meine Wohnung fast nett aus.",
      use: [{ goto: "flat", at: AF.window, face: "sw" }] },
    below: { name: "Die Straße", rect: AS.belowRect, walkTo: AS.window, face: "se", look: ["Vierzehn Stockwerke. Nicht runterschauen.", "Ich hab runtergeschaut."] },
    ladder: { name: "Leiter", rect: AS.ladderRect, walkTo: AS.ladder, face: "ne",
      look: [{ if: "ladder_down", then: ["Die Leiter. Sie hängt jetzt da, wo sie hingehört."], else: ["Die Leiter aufs Dach. Sie hängt zwei Meter zu hoch.", "Teo kam da früher mit irgendwas Langem ran."] }],
      use: [{ if: "!ladder_down", then: ["Zwei Meter zu hoch. Teo kam da mit irgendwas Langem ran. Ich nicht.", "Nicht heute. Nicht ohne was mit Haken."],
        else: ["Nicht runterschauen.", { goto: "dach", at: AD.hatch, face: "ne" }] }],
      with: { haken: ["Der Haken greift. Ziehen.", "Sie kommt runter, mit allem Rost der letzten zwanzig Jahre.", { remove: "haken" }, { set: "ladder_down" }, "Nicht runterschauen.", { goto: "dach", at: AD.hatch, face: "ne" }] } },
  } });

// ---- the roof. Above it, where other people have a sky, the underside of the next Ring
Cutaway.actor("regenleserin", { name: "Regenleserin", color: "#a8c8e8", room: "dach", at: AD.reader, facing: "sw",
  // the same view for every facing, as Bao: she stays on her bucket
  costume: { idle: every("regen_idle_sw"), walk: every("regen_idle_sw"), talk: every("regen_talk_sw") }, voice: { pitch: 58, range: 4, wave: "triangle", syllable: 90, speed: 0.8 },
  look: ["Eine alte Frau auf einem Eimer. Sie hält einen zweiten Eimer unter das Tropfen und kostet.", "So sicher, wie andere die Zeitung lesen.", "Nicht mit der Zunge. Mit den Barteln. Billiger Umbau, noch aus der Flut."],
  talk: [{ say: "regenleserin", text: "Setz dich nicht auf den Eimer. Der ist besetzt." }, { dialog: "regenleserin" }] });   // game/regenleserin.js
Cutaway.room("dach", { name: "Das Dach", background: "dach_bg", walk: AD.walk,
  ambience: ["city_far", { sfx: "feed_rain", gain: 0.5 }], music: { theme: "juno", intensity: 0.2 },
  hotspots: {
    hatch: { name: "Leiter nach unten", rect: AD.hatchRect, walkTo: AD.hatch, face: "sw", look: "Die Leiter. Runter ist schlimmer als rauf.", use: [{ goto: "sims", at: AS.ladder, face: "sw" }] },
    rings: { name: "Die Ringe", rect: AD.ringsRect, walkTo: AD.edge, face: "ne", look: "Da oben ist nicht der Himmel. Da oben ist der Boden von jemand anderem.", use: [{ goto: "dach_blick" }] },
    screen: { name: "Der große Schirm", rect: AD.screenRect, walkTo: AD.edge, face: "ne", look: ["HALCYON. SLEEP BETTER.", "Früher stand da RISE ABOVE. Das hier ist wenigstens ehrlicher."] },
    noodles: { name: "NOODLES", rect: AD.noodlesRect, walkTo: AD.edge, face: "ne", look: "N, D, L, E, S. Zwei Buchstaben haben's nicht geschafft." },
    drone: { name: "Drohne", rect: AD.droneRect, walkTo: AD.edge, face: "ne", look: "Eine Kameradrohne. Die hingen damals schon hier oben rum. Uns hat das nie gestört." },
    place: { name: "Unser Platz", rect: AD.placeRect, walkTo: AD.edge, face: "ne", look: "Da haben wir gesessen. Ich vierzehn, Teo sechs. Eine Schale Nudeln für zwei.", use: [{ goto: "dach_sitzen" }] },
  } });

// sitting where they sat, the old photo's picture twenty years on
Cutaway.room("dach_sitzen", { name: "Unser Platz", background: "dach_heute", observe: true, lines: "bottom", buttons: false,
  ambience: ["city_far", { sfx: "feed_rain", gain: 0.5 }], music: { theme: "memory", fade: 2 },
  hotspots: { back: { name: "Aufstehen", rect: [0, 0, 320, 180], exit: { to: "dach", at: AD.edge, face: "sw" } } },
  enter: ["Er ist hier eingeschlafen. An meiner Schulter.", "Ich hab mich eine Stunde nicht bewegt. Vor Angst, und damit er weiterschläft.", "Heute schläft er besser. Sagt er."] });

// ---- the newspaper war: 14C asks who steals her paper, 14A says nobody reads it. To know, Juno would have to glass her own
// block, which she would never do. It is 14C herself, asleep, on Lull: she doesn't know, and every face in the stack is marked
// with four corners, the way an observer marks one (story §6: the sleepers mark what looks wrong). Nobody explains it.
const AC = Halcyon.at.cam14;
const notesLook = floor14.notes.look;
floor14.notes.look = [{ if: ["news_who", "news_stack"], then: [...notesLook, "Und drunter, von mir: ES IST NIEMAND. 14B."], else: notesLook }];
floor14.notes.use = [{ if: "day>1", then: ["Wer klaut die? Seit Wochen geht das so.", "Über mir hängt Halcyons Kamera. Ich müsste nur reinschauen."], else: ["Krieg auf dem vierzehnten."] }];
floor14.corner_cam.use = [{ if: ["day>1", "!link_cam14", "!off_zeitung"], then: ["Mein alter Zugang geht auch hier.", "Den eigenen Block glasst man nicht. Das sag ich Motte auch.", { dialog: "zeitung_cam" }],
  else: [{ if: "link_cam14", then: ["Bin schon drauf. Schöner wird's nicht."], else: ["Den eigenen Block glasst man nicht."] }] }];
Cutaway.dialog("zeitung_cam", { main: { choices: [
  { text: "„Nur dieses eine Mal.“", goto: "end", then: [{ set: "code_cam14" }, { set: "link_cam14" }, { sfx: "link" }, "Das sagen alle. CAM 14 ist auf dem Deck."] },
  { text: "„Nein.“", goto: "end", then: ["Soll die Zeitung halt weg sein."] },
] } });
Halcyon.cams.cam14 = { id: "14", place: "KESSEL-BLOCK, 14. STOCK", owner: "HALCYON", map: [8, 14], if: "link_cam14" };
Cutaway.actor("haldane_feed", { name: "Jemand im Morgenmantel", color: "#ffa8d8",
  costume: { idle: "commuter_d_feed", walk: "commuter_d_feed_walk", talk: "commuter_d_feed" }, speed: [6, 3],
  look: ["Jemand im Morgenmantel. Sehr langsam.", "Die Hände hängen einfach runter."],
  talk: [{ if: "!news_who", then: ["Halb drei. Morgenmantel. Die geht langsam, die Augen ...", "Die Augen sind zu.", "Frau Haldane. Aus 14C. Sie holt sich die Zeitung, ihre eigene und die von 14A.", "Ihr eigener Zettel. WER KLAUT MEINE ZEITUNG.", { set: "news_who" }, { evi: "verwirrt" }, { say: "evi", text: "Sie schläft. Darf man das?" }],
    else: ["Frau Haldane. Sie schläft und holt die Zeitung. Die markier ich nicht."] }] });
Cutaway.routine("haldane_feed", [{ day: [2, 3], from: "02:30", to: "02:45", room: "cam14", at: AC.door, path: [AC.door, AC.mat, AC.door] }]);
Halcyon.camRoom("cam14", { background: "cam14_bg", mic: { at: AC.mic, clear: 40, lost: 150 }, hotspots: {
  doors: { name: "Türen", rect: AC.doorsRect, look: ["Der Flur von oben. Genau wie ich's in Erinnerung hab.", "Den hab ich ja mal beobachtet, von Berufs wegen."] },
} });
const haldaneUse = floor14.haldane.use;
// the point behind a sleeper's ear: the beat cam31 waits for (and nobody says why)
const PUNKT = ["Der Punkt hinter ihrem Ohr. Immer gleich.", "Woher kenn ich das?"];
floor14.haldane.use = [{ if: ["day>1", "!news_stack", "!off_zeitung"], then: ["Die Tür steht offen. Sie schläft wirklich.", "Hinter dem Sessel. Ein Stapel Zeitungen, so hoch wie Motte.", { zoom: "look_zeitung" }, "Jede Seite. Gesichter, angestrichen.", "Nicht angestrichen. Vier Ecken. Um jedes Gesicht vier kleine Ecken.", "So markier ich.", { zoom: false }, { set: "news_stack" }, { cache: "note_haldane_marks" }, ...PUNKT,
    { evi: "besorgt" }, { say: "evi", text: "Warum macht sie das?" }, "Weiß ich nicht. Sie auch nicht."],
  else: [{ if: "day>1", then: PUNKT, else: [haldaneUse] }] }];
Halcyon.cache.note_haldane_marks = { kind: "note", name: "FRAU HALDANES ZEITUNGEN", about: "Ein Stapel hinter ihrem Sessel. Jedes Gesicht darin: vier Ecken. Wie meine." };

// ---- the woman who remembers (story §9): a Lull user is sure she saw a murder in a street she has never been to, from above, as
// if she hung on a lamp post. The street exists, and the night: she saw the camera's feed in her sleep. Juno is the only one who can
// tell her, and has the choice: the truth, which frightens her, or a lie that lets her sleep. She is the UNKNOWN LINK in the clinic's queue.
const AI = Halcyon.at.lucky_static, A18 = Halcyon.at.cam18;
Object.assign(Halcyon.contacts, { imai: { name: "R. IMAI", color: "#c8d8b0", status: "schläft", if: ["day>1", "!off_imai"], unread: "!read_imai",
  open: [{ if: "!read_imai", then: [{ set: "read_imai" }, "Ein Mord, in einer Straße, in der sie nie war. Lull-Nutzerin. Natürlich."] }] } });
Cutaway.state.view("read_imai");
Halcyon.threads.imai = [
  { from: "imai", at: "18:20", text: "Sie finden Leute, habe ich gehört. Ich habe einen Mord gesehen. In einer Straße, in der ich nie war." },
  { from: "imai", at: "18:21", text: "Mein Arzt sagt, das kommt vom Schlaf. Ich will wissen, ob ich verrückt bin. Ich sitze abends im LUCKY STATIC." },
];
Halcyon.ledger.imai = { to: "R. IMAI", what: { truth: "die Wahrheit", dream: "ein Traum" } };
Cutaway.actor("imai", { name: "Frau Imai", color: "#c8d8b0", room: "lucky_static", at: AI.imai, facing: "sw",
  costume: { idle: every("imai_idle_sw"), walk: every("imai_idle_sw"), talk: every("imai_talk_sw") }, voice: { pitch: 60, range: 4, wave: "triangle", syllable: 85, speed: 0.9 },
  look: ["Eine Frau vor einem Tee, der kalt ist. Hinter dem Ohr der blasse Punkt.", "Drei Finger an jeder Hand, viel zu lang. Sie hat es mit nichts eilig.", "Die kenn ich. Aus der Schlange vor der Klinik."],
  talk: [
    { if: ["imai_step=0", "!off_imai"], then: [
      "Die kenn ich. Aus der Schlange vor der Klinik.", "Hinter dem Ohr der blasse Punkt.", { say: "imai", text: "Sie sind die Glasserin. Danke. Keiner glaubt mir, nicht mal ich." },
      { say: "imai", text: "Eine Treppe. Über der Treppe ein Schild mit einem Fisch. Regen von links." }, { say: "imai", text: "Ein Mann fällt, und einer geht weg." },
      { say: "imai", text: "Das Komische: Ich hab von oben draufgeschaut. Als würde ich an einer Laterne hängen." },
      "Und das war wann?", { say: "imai", text: "Vor einer Woche, im Schlaf. Ich schlafe von drei bis sieben. Vier Stunden Lull, wie alle." },
      { set: "imai_step", value: 1 }, "Ein Fisch über einer Treppe. CAM 18, am alten Fischmarkt.", "Das könnte sie sein. Da hab ich noch Zugang."] },
    { if: "imai_step=1", then: [{ say: "imai", text: "Eine Treppe. Ein Schild mit einem Fisch. Regen von links. Haben Sie sie gefunden?" }] },
    { if: "imai_step=2", then: [{ say: "imai", text: "Und? Bin ich verrückt?" }, { dialog: "imai_wahl" }] },
    { if: "imai_told=truth", then: [{ say: "imai", text: "Ich hab heute nicht geschlafen. Ich trau mich nicht." }] },
    { if: "imai_told=dream", then: [{ say: "imai", text: "Ich schlafe wieder gut. Danke. Sie glauben gar nicht, wie gut." }] },
  ] });
Cutaway.dialog("imai_wahl", { main: { choices: [
  { text: "„Sie sind nicht verrückt.“", goto: "end", then: [{ set: "imai_step", value: 3 }, { set: "imai_told", value: "truth" }, { ledger: "imai", value: "truth" }, "Die Treppe gibt's. Den Mann auch. Neunundzwanzigster Oktober, drei Uhr zwölf.",
    { say: "imai", text: "Da hab ich geschlafen." }, "Ich weiß.", { say: "imai", text: "Und wie soll ich das gesehen haben?" }, "Weiß ich nicht.", { say: "imai", text: "Dann will ich heute Nacht nicht schlafen." }] },
  { text: "„Das war ein Traum.“", goto: "end", then: [{ set: "imai_step", value: 3 }, { set: "imai_told", value: "dream" }, { ledger: "imai", value: "dream" }, "Keine Treppe, kein Fisch. Ich hab nachgesehen.",
    { say: "imai", text: "Gott sei Dank. Ich dachte schon ..." }, "Schlafen Sie gut, Frau Imai.", { evi: "verwirrt" }, { say: "evi", text: "Die Treppe gibt es aber. Ich hab sie gesehen." }, "Ich weiß."] },
] } });
Halcyon.cams.cam18 = { id: "18", place: "ALTER FISCHMARKT", owner: "HALCYON", map: [120, 14], if: "imai_step>=1" };
Halcyon.cache.note_imai_street = { kind: "note", name: "FRAU IMAIS TREPPE", about: "CAM 18, 29.10., 03:12. Es ist passiert. Sie schlief. Sie hat es von hier oben gesehen." };
Halcyon.camRoom("cam18", { background: "cam18_bg", mic: { at: A18.mic, clear: 40, lost: 150 }, hotspots: {
  sign: { name: "Schild", rect: A18.sign, look: "Ein Fisch. FISH steht drunter, für den Fall, dass jemand fragt." },
  stairs: { name: "Treppe", rect: A18.stairs, look: "Die Treppe zum alten Fischmarkt. Regen von links: Die Kamera hängt schief." },
  rewind: { name: "Archiv", z: 5, if: "imai_step=1",
    use: ["Ältere Nächte liegen im Halcyon-Archiv. Mein alter Zugang reicht gerade noch.", "Neunundzwanzigster Oktober. Vor und zurück.", "03:12. Da. Einer fällt die Treppe runter, und einer geht weg.",
      "Genau von hier oben. Genau, wie sie gesagt hat.", "Um die Zeit lag sie im Bett und schlief.", "Wie sieht jemand im Schlaf, was meine Kamera sieht?", { cache: "note_imai_street" }, { set: "imai_step", value: 2 }] },
} });
Cutaway.room("lucky_static", { name: "LUCKY STATIC", background: "lucky_static_bg", walk: AI.walk,
  ambience: ["neon_buzz", "fridge_hum"], music: { theme: "juno", intensity: 0.4 },
  hotspots: {
    door: { name: "Tür", rect: AI.doorRect, walkTo: AI.door, face: "sw", use: [{ goto: "kowalski", at: Halcyon.at.kowalski.lucky_door, face: "se" }] },
    bar: { name: "Theke", rect: AI.barRect, walkTo: AI.bar, face: "ne", look: "Meis Theke. Wer hier anschreiben lässt, weiß, was er tut." },
    karaoke: { name: "Karaoke", rect: AI.karaokeRect, walkTo: AI.bar, face: "ne", look: "OUT OF ORDER. Trotzdem singt hier jeden Abend jemand." },
  } });
Cutaway.room.get("kowalski").hotspots.lucky_door.use = [{ if: "day=1", then: ["Nicht heute. Heute will ich Bao."], else: [{ goto: "lucky_static", at: AI.arrive, face: "ne" }] }];

// ---- the white carriers (kapitel1-design): Thursday night a white van stops on Kowalski Street, two kind people carry a sleeper out
// of the house opposite and his daughter stands in the door. What happens to Sinkers, long before it happens to Teo. Time only moves when
// Juno waits: at 23:30 she hears it from wherever she is, and it waits for her in the street.
Cutaway.moment("traeger_ruf", { room: "deck", day: 3, from: "23:15", to: "23:30", if: "~never",
  unseen: [{ if: "!off_traeger", then: ["Von unten: ein Wagen, der nicht hupt. So was gibt's im Neunten nicht."] }] });
for (const [id, name, pitch] of /** @type {[string, string, number][]} */ ([["traeger_weiss", "Jemand in Weiß", 56], ["traeger_kind", "Das Mädchen", 74]]))
  Cutaway.actor(id, { name, color: "#a8b8d0", costume: { idle: "mock_imai", walk: "mock_imai", talk: "mock_imai" }, voice: { pitch, range: 4, wave: "triangle", syllable: 80 } });
Cutaway.moment("traeger", { room: "kowalski", day: 3, from: "23:30", to: "00:45", if: "!off_traeger",
  play: ["Ein Wagen vor dem Haus gegenüber. Weiß, ohne Schild.", { zoom: "look_traeger" }, "Zwei in Weiß. Freundlich. Sie tragen jemanden raus, und der schläft.",
    { say: "traeger_weiss", text: "Ruhe-Erschöpfung." }, { say: "traeger_weiss", text: "Er hat es jetzt gut." }, "Oben gehen die Rollos runter. Einer nach dem anderen.", { zoom: false }, { dialog: "traeger_wahl" }] });
Halcyon.cache.clip_traeger = { kind: "clip", name: "DIE WEISSEN TRÄGER", about: "Kowalski-Straße, Do 23:30. Ein Sinker, zwei in Weiß, ein Mädchen in der Tür." };
Cutaway.dialog("traeger_wahl", { main: { choices: [
  { text: "Zusehen.", silent: true, goto: "end", then: [{ set: "traeger", value: "watched" }, "Ich schau zu. Das kann ich.", "Die Türen gehen zu. Der Wagen fährt, und er hupt immer noch nicht."] },
  { text: "Filmen.", silent: true, goto: "end", then: [{ set: "traeger", value: "filmed" }, { cache: "clip_traeger" }, "Das Taschen-Deck reicht dafür. Es gibt Leute, die zahlen für so was.", { evi: "besorgt" }, { say: "evi", text: "Das Mädchen ist mit im Bild." }, "Ich weiß."] },
  { text: "Zu dem Mädchen gehen.", silent: true, goto: "end", then: [{ set: "traeger", value: "girl" }, "Ich geh rüber. Was sagt man da?", { say: "traeger_kind", text: "Geht es ihm gut? Die sagen, es geht ihm gut." }, "Ich weiß es nicht.", { say: "traeger_kind", text: "Er wacht einfach nicht auf." }, "Ich bleib, bis der Wagen weg ist. Mehr hab ich nicht."] },
] } });

// ---- the half repair: he lives on the scaffold at the big screen and repairs its left half; the right half is another contract
// (at work he has his back to the street whichever way he is turned, so 9-A reads; to talk he turns round, se or sw, towards Juno)
Cutaway.actor("reparatur", { name: "Der Monteur", color: "#b0c0b0", at: Halcyon.at.kowalski.reparatur, facing: "ne", walkTo: Halcyon.at.kowalski.scaffold, face: "ne",
  costume: { idle: every("monteur_idle_ne"), walk: every("monteur_idle_ne"), talk: { se: "monteur_talk_se", sw: "monteur_talk_sw", ne: "monteur_talk_se", nw: "monteur_talk_sw" } }, voice: { pitch: 48, range: 4, wave: "square", syllable: 80 },
  look: ["Ein Mann auf einem Gerüst, mit Kocher, Wäscheleine und Schlafsack. Er wohnt da.", "Er schraubt an der linken Hälfte. Nur an der linken.", "Pfoten wie ein Maulwurf, die Augen fast zu. Die Lampe sieht für ihn."],
  talk: [
    { if: "day=2", then: [{ say: "reparatur", text: "Links ist mein Vertrag. Rechts ist Vertrag 9-B. Der Kollege kommt seit 2087." }, "Und wenn links fertig ist?", { say: "reparatur", text: "Fertig? Junge Frau. Dann bin ich arbeitslos." }] },
    { if: "day=3", then: [{ say: "reparatur", text: "Der stottert nur, wenn du vorbeigehst. Ist dir das schon aufgefallen?" }, "Woran liegt das?", { say: "reparatur", text: "Weiß ich nicht. Das ist die rechte Hälfte." }] },
    { if: "day=4", then: [{ say: "reparatur", text: "Heute läuft sie gut, die Linke. Heute Abend ist was mit der Stadt." }, "Was denn?", { say: "reparatur", text: "Keine Ahnung. Ist nicht mein Vertrag." }] },
  ] });
// (no `at`: a routine's place must be walkable floor, and he stands up on his deck, where the actor starts)
Cutaway.routine("reparatur", [{ day: [2, 3, 4], from: "18:00", to: "04:00", room: "kowalski", face: "ne" }]);

// ---- the Drain Market, as far as it stands: the alley's way down, the preacher of the Waking Church (awake nine days on Wednesday)
const AM = Halcyon.at.drain_market;
Cutaway.actor("prediger", { name: "Der Prediger", color: "#d8c8a0", room: "drain_market", at: AM.preacher, facing: "sw",
  // his counter shows the days he has been awake: 9 on Wednesday, 10, 11 (the _sw sets are flipped with the digits kept the right way round)
  costume: { idle: every("prediger_idle_9_sw"), walk: every("prediger_idle_9_sw"), talk: every("prediger_talk_9_sw") },
  poses: [{ if: "day=3", idle: every("prediger_idle_10_sw"), walk: every("prediger_idle_10_sw"), talk: every("prediger_talk_10_sw") },
    { if: "day=4", idle: every("prediger_idle_11_sw"), walk: every("prediger_idle_11_sw"), talk: every("prediger_talk_11_sw") }],
  voice: { pitch: 54, range: 8, wave: "sawtooth", syllable: 60, speed: 1.3 },
  look: ["Ein dürrer Mann auf einer Kiste, eine Thermoskanne in jeder Hand. Die Wache Kirche.", "Er blinzelt nicht. Ich hab gezählt.", "Keine Lider mehr. Die Zunge macht das."],
  talk: [
    { if: "day=2", then: [{ say: "prediger", text: "Neun Tage! Neun Tage wach, und ich sehe klarer als ihr alle! Kaffee?" }, "Was ist da drin?", { say: "prediger", text: "Alles, was nicht schläft." }] },
    { if: "day=3", then: [{ say: "prediger", text: "Zehn Tage. Sie sagen, wer schläft, sieht nichts. Falsch! Wer schläft, sieht was anderes!" }, "Woher willst du das wissen?", { say: "prediger", text: "Ich weiß es nicht. Ich glaube es. Das ist billiger. Kaffee?" }] },
    { if: "day=4", then: [{ say: "prediger", text: "Elf Tage. Da hinten steht jemand, und der kichert." }, "Da steht niemand.", { say: "prediger", text: "Das sagt er auch." }] },
  ] });
Cutaway.room("drain_market", { name: "Drain-Markt", background: "drain_market_bg", walk: AM.walk,
  ambience: ["city_far", "neon_buzz"], music: { theme: "juno", intensity: 0.4 },
  hotspots: {
    up: { name: "Zur Gasse", rect: AM.upRect, walkTo: AM.up, face: "sw", use: [{ goto: "gasse", at: Halcyon.at.gasse.market, face: "ne" }] },
    kidneys: { name: "Stand", rect: AM.kidneysRect, walkTo: AM.stalls, face: "ne", look: "KIDNEYS ONLY. Der Mann dahinter sieht gesund aus. Das ist das Unheimliche." },
    jars: { name: "Implantate", rect: AM.jarsRect, walkTo: AM.stalls, face: "ne", look: "Gebrauchte Implantate, in Gläsern. Eins davon sieht aus wie meins." },
    stalls: { name: "Stände", rect: AM.stallsRect, walkTo: AM.stalls, face: "ne", look: "[MOCK] Hier kommen noch Ratz und Sables Vorhang." },
  } });
Cutaway.room.get("gasse").hotspots.market.use = [{ goto: "drain_market", at: AM.arrive, face: "se" }];

// the big look upwards (a shot of its own: the block for what will be painted as large as the intro's)
Cutaway.room("dach_blick", { name: "Die Ringe", background: "dach_blick_b_bg", observe: true, lines: "bottom", buttons: false,
  ambience: ["city_far", { sfx: "feed_rain", gain: 0.5 }], music: { theme: "juno", intensity: 0.2 },
  fx: [{ kind: "rain", rect: [0, 0, 320, 180], count: 30, color: "#a8b8d0", speed: 90, slant: 0, length: 3 }],
  hotspots: { back: { name: "Zurück", rect: [0, 0, 320, 180], exit: { to: "dach", at: AD.edge, face: "sw" } } },
  enter: ["Acht Ringe über mir. Der helle Punkt da oben ist die Krone.", "Alles, was hier tropft, war schon mal bei jemandem im Glas."] });
})();

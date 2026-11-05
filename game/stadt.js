// Halcyon: the city in Chapter 1 (docs/kapitel1-design.md, "Die Stadt"), on flat blocks (art/mock/). So far the
// way up on to the Kessel Block's roof, the Rain Reader there and the first look at the Rings from below.
//   roof_step   how far the way up is: 0, 1 the old ID from the box, 2 the window open (the ledge), 3 the lift's
//               emergency key, a long hook, 4 the ladder down (one number, not four flags: it only goes one way)
//   news_step   the newspaper war: 0, 1 Juno wants to know who it is, 2 she has glassed her own block, 3 she has seen who, 4 the stack
// Each story here is a thread of its own, independent of the others: together they would multiply each other's states beyond what
// the solver can walk, so tools/solve-act.mjs checks them one at a time, the others shut with off_<thread> (CLAUDE.md, checks).
"use strict";

(function () {
const AF = Halcyon.at.flat, AK = Halcyon.at.kessel_14, AS = Halcyon.at.sims, AD = Halcyon.at.dach;
const flat = Cutaway.room.get("flat").hotspots, floor14 = Cutaway.room.get("kessel_14").hotspots;

// ---- the window of the flat: it sticks, and only something flat gets at the latch
flat.box_old.use = [{ if: ["roof_step=0", "!off_roof"], then: ["Der Ausweis. CIVIC MONITOR, J. REYES. UNGÜLTIG.", "Flach und hart. Den steck ich ein.", { set: "roof_step", value: 1 }],
  else: ["Der Karton von damals. Mehr brauch ich daraus nicht."] }];
flat.window.use = [{ if: "day=1", then: ["Das Fenster klemmt. Schon immer."],
  else: [{ if: "roof_step>=2", then: [{ goto: "sims", at: AS.window, face: "se" }],
    else: [{ if: "roof_step=1", then: ["Der Ausweis in den Spalt. Hoch. Noch mal.", "Klick.", "Das erste Mal, dass das Ding was aufmacht.", { set: "roof_step", value: 2 }, { goto: "sims", at: AS.window, face: "se" }],
      else: ["Klemmt. Der Riegel sitzt im Rahmen. Da kommt man nur mit was Flachem ran."] }] }] }];
flat.window.look = [{ if: "day=1", then: [flat.window.look], else: [flat.window.look, "Rechts draußen geht die Leiter aufs Dach. Da oben war ich zuletzt mit Teo."] }];

// ---- the lift never runs; its emergency key hangs over the door all the same
const liftLook = floor14.lift.look, liftUse = floor14.lift.use;
floor14.lift.look = [{ if: "day=1", then: [liftLook], else: [liftLook, "Über der Tür hängt der Notschlüssel. Ein langer Haken, für den Fall, dass er stecken bleibt."] }];
floor14.lift.use = [{ if: "roof_step=2", then: ["Der Notschlüssel. Lang genug für alles.", "Stecken bleiben müsste er erst mal fahren. Den nehm ich mit.", { set: "roof_step", value: 3 }], else: [liftUse] }];

// ---- the ledge outside the window: Juno is afraid of heights (the old photo on the deck)
Cutaway.room("sims", { name: "Der Sims", background: "sims_bg", walk: AS.walk,
  ambience: ["city_far", { sfx: "feed_rain", gain: 0.8 }], music: { theme: "juno", intensity: 0.2 },
  fx: [{ kind: "rain", rect: [0, 0, 320, 180], count: 40, color: "#41547a", speed: 150, slant: 0.1, length: 4 }],
  hotspots: {
    window: { name: "Mein Fenster", rect: AS.windowRect, walkTo: AS.window, face: "nw", look: "Mein Fenster. Von außen sieht meine Wohnung fast nett aus.",
      use: [{ goto: "flat", at: AF.window, face: "sw" }] },
    below: { name: "Die Straße", rect: AS.belowRect, walkTo: AS.window, face: "se", look: ["Vierzehn Stockwerke. Nicht runterschauen.", "Ich hab runtergeschaut."] },
    ladder: { name: "Leiter", rect: AS.ladderRect, walkTo: AS.ladder, face: "ne",
      look: [{ if: "roof_step>=4", then: ["Die Leiter. Sie hängt jetzt da, wo sie hingehört."], else: ["Die Leiter aufs Dach. Sie hängt zwei Meter zu hoch.", "Teo kam da früher mit irgendwas Langem ran."] }],
      use: [{ if: "roof_step<3", then: ["Zwei Meter zu hoch. Teo kam da mit irgendwas Langem ran. Ich nicht.", "Nicht heute. Nicht ohne was mit Haken."],
        else: [{ if: "roof_step=3", then: ["Der Haken greift. Ziehen.", "Sie kommt runter wie ein Tier, das geweckt wurde.", { set: "roof_step", value: 4 }] },
          "Nicht runterschauen.", { goto: "dach", at: AD.hatch, face: "ne" }] }] },
  } });

// ---- the roof. Above it, where other people have a sky, the underside of the next Ring
Cutaway.actor("regenleserin", { name: "Regenleserin", color: "#a8c8e8", room: "dach", at: AD.reader, facing: "sw",
  costume: { idle: "mock_regen", walk: "mock_regen", talk: "mock_regen" }, voice: { pitch: 58, range: 4, wave: "triangle", syllable: 90, speed: 0.8 },
  look: ["Eine alte Frau auf einem Eimer. Sie hält einen zweiten Eimer unter das Tropfen und kostet.", "So sicher, wie andere die Zeitung lesen."],
  talk: [
    { if: "day=2", then: [{ say: "regenleserin", text: "Der Vierte. Die gießen ihre Orchideen." }, "Das schmeckt man?", { say: "regenleserin", text: "Dünger, Kind. Teurer als deine Miete." }] },
    { if: "day=3", then: [{ say: "regenleserin", text: "Der Sechste. Champagner, verdünnt. Jemand feiert, dass ein anderer schläft." }, "Sagt das der Regen?", { say: "regenleserin", text: "Alles kommt runter. Früher oder später." }] },
    { if: "day=4", then: [{ say: "regenleserin", text: "Heute schmeckt's nach gar nichts." }, "Ist das gut?", { say: "regenleserin", text: "Das hatte ich noch nie." }] },
  ] });
Cutaway.room("dach", { name: "Das Dach", background: "dach_bg", walk: AD.walk,
  ambience: ["city_far", { sfx: "feed_rain", gain: 0.5 }], music: { theme: "juno", intensity: 0.2 },
  fx: [{ kind: "rain", rect: [0, 22, 320, 158], count: 60, color: "#617aa0", speed: 170, slant: 0.25, length: 3 }],
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
  fx: [{ kind: "rain", rect: [0, 22, 320, 158], count: 60, color: "#617aa0", speed: 170, slant: 0.25, length: 3 }],
  hotspots: { back: { name: "Aufstehen", rect: [0, 0, 320, 180], exit: { to: "dach", at: AD.edge, face: "sw" } } },
  enter: ["Er ist hier eingeschlafen. An meiner Schulter.", "Ich hab mich eine Stunde nicht bewegt. Vor Angst, und damit er weiterschläft.", "Heute schläft er besser. Sagt er."] });

// ---- the newspaper war: 14C asks who steals her paper, 14A says nobody reads it. To know, Juno would have to glass her own
// block, which she would never do. It is 14C herself, asleep, on Lull: she doesn't know, and every face in the stack is marked
// with four corners, the way an observer marks one (story §6: the sleepers mark what looks wrong). Nobody explains it.
const AC = Halcyon.at.cam14;
const notesLook = floor14.notes.look;
floor14.notes.look = [{ if: "news_step>=4", then: [...notesLook, "Und drunter, von mir: ES IST NIEMAND. 14B."], else: notesLook }];
floor14.notes.use = [{ if: ["day>1", "news_step=0", "!off_zeitung"], then: ["Seit Wochen geht das so. Jetzt will ich's wissen. Wer klaut die?", "Über mir hängt Halcyons Kamera. Ich müsste nur reinschauen.", { set: "news_step", value: 1 }],
  else: ["Krieg auf dem vierzehnten."] }];
floor14.corner_cam.use = [{ if: "news_step=1", then: ["Mein alter Zugang geht auch hier. Den eigenen Block glasst man nicht. Das sag ich Motte auch.", { dialog: "zeitung_cam" }],
  else: [{ if: "news_step>=2", then: ["Bin schon drauf. Schöner wird's nicht."], else: ["Den eigenen Block glasst man nicht."] }] }];
Cutaway.dialog("zeitung_cam", { main: { choices: [
  { text: "Nur dieses eine Mal.", goto: "end", then: [{ set: "code_cam14" }, { set: "link_cam14" }, { sfx: "link" }, { set: "news_step", value: 2 }, "Das sagen alle. CAM 14 ist auf dem Deck."] },
  { text: "Nein.", goto: "end", then: ["Nein. Soll die Zeitung halt weg sein."] },
] } });
Halcyon.cams.cam14 = { id: "14", place: "KESSEL-BLOCK, 14. STOCK", owner: "HALCYON", map: [30, 24], if: "news_step>=2" };
Cutaway.actor("haldane_feed", { name: "Jemand im Morgenmantel", color: "#ffa8d8",
  costume: { idle: "commuter_d_feed", walk: "commuter_d_feed_walk", talk: "commuter_d_feed" }, speed: [6, 3],
  look: [{ if: "news_step=2", then: ["Halb drei. Morgenmantel. Die geht langsam, die Augen ...", "Die Augen sind zu.", "Frau Haldane. Aus 14C. Sie holt sich die Zeitung, ihre eigene und die von 14A.", "Ihr eigener Zettel. WER KLAUT MEINE ZEITUNG.", { set: "news_step", value: 3 }, { evi: "verwirrt" }, { say: "evi", text: "Sie schläft. Darf man das?" }],
    else: ["Frau Haldane. Sie schläft und holt die Zeitung."] }],
  talk: "Die markier ich nicht." });
Cutaway.routine("haldane_feed", [{ day: [2, 3], from: "02:30", to: "02:45", room: "cam14", at: AC.door, path: [AC.door, AC.mat, AC.door] }]);
Halcyon.camRoom("cam14", { background: "cam14_bg", mic: { at: AC.mic, clear: 40, lost: 150 }, hotspots: {
  doors: { name: "Türen", rect: AC.doorsRect, look: "Der Flur von oben. Genau wie ich's in Erinnerung hab. Ich hab den ja mal beobachtet, von Berufs wegen." },
} });
const haldaneUse = floor14.haldane.use;
floor14.haldane.use = [{ if: "news_step=3", then: ["Die Tür steht offen. Sie schläft wirklich.", "Hinter dem Sessel. Ein Stapel, so hoch wie Motte.", { zoom: "look_zeitung" }, "Jede Seite. Gesichter, angestrichen.", "Nicht angestrichen. Vier Ecken. Um jedes Gesicht vier kleine Ecken.", "So markier ich.", { zoom: false }, { set: "news_step", value: 4 }, { cache: "note_haldane_marks" },
    { evi: "besorgt" }, { say: "evi", text: "Warum macht sie das?" }, "Weiß ich nicht. Sie auch nicht.", "Ich schreib was auf den Zettel. Mehr kann ich nicht tun."],
  else: [haldaneUse] }];
Halcyon.cache.note_haldane_marks = { kind: "note", name: "FRAU HALDANES ZEITUNGEN", about: "Sie klaut sie im Schlaf. Jedes Gesicht darin: vier Ecken. Wie meine." };

// the big look upwards (a shot of its own: the block for what will be painted as large as the intro's)
Cutaway.room("dach_blick", { name: "Die Ringe", background: "dach_blick_b_bg", observe: true, lines: "bottom", buttons: false,
  ambience: ["city_far", { sfx: "feed_rain", gain: 0.5 }], music: { theme: "juno", intensity: 0.2 },
  fx: [{ kind: "rain", rect: [0, 0, 320, 180], count: 30, color: "#a8b8d0", speed: 90, slant: 0, length: 3 }],
  hotspots: { back: { name: "Zurück", rect: [0, 0, 320, 180], exit: { to: "dach", at: AD.edge, face: "sw" } } },
  enter: ["Acht Ringe über mir. Der helle Punkt da oben ist die Krone.", "Alles, was hier tropft, war schon mal bei jemandem im Glas."] });
})();

// Halcyon: the city in Chapter 1 (docs/kapitel1-design.md, "Die Stadt"), on flat blocks (art/mock/). So far the
// way up on to the Kessel Block's roof, the Rain Reader there and the first look at the Rings from below.
//   roof_step   how far the way up is: 0, 1 the old ID from the box, 2 the window open (the ledge), 3 the lift's
//               emergency key, a long hook, 4 the ladder down (one number, not four flags: it only goes one way)
"use strict";

(function () {
const AF = Halcyon.at.flat, AK = Halcyon.at.kessel_14, AS = Halcyon.at.sims, AD = Halcyon.at.dach;
const flat = Cutaway.room.get("flat").hotspots, floor14 = Cutaway.room.get("kessel_14").hotspots;

// ---- the window of the flat: it sticks, and only something flat gets at the latch
flat.box_old.use = [{ if: "roof_step=0", then: ["Der Ausweis. CIVIC MONITOR, J. REYES. UNGÜLTIG.", "Flach und hart. Den steck ich ein.", { set: "roof_step", value: 1 }],
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

// the big look upwards (a shot of its own: the block for what will be painted as large as the intro's)
Cutaway.room("dach_blick", { name: "Die Ringe", background: "dach_blick_b_bg", observe: true, lines: "bottom", buttons: false,
  ambience: ["city_far", { sfx: "feed_rain", gain: 0.5 }], music: { theme: "juno", intensity: 0.2 },
  fx: [{ kind: "rain", rect: [0, 0, 320, 180], count: 30, color: "#a8b8d0", speed: 90, slant: 0, length: 3 }],
  hotspots: { back: { name: "Zurück", rect: [0, 0, 320, 180], exit: { to: "dach", at: AD.edge, face: "sw" } } },
  enter: ["Acht Ringe über mir. Der helle Punkt da oben ist die Krone.", "Alles, was hier tropft, war schon mal bei jemandem im Glas."] });
})();

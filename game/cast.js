// Halcyon: the people (docs/story.md §4, docs/kapitel0-design.md §8). Subtitle colours follow the style
// guide's colour meanings: red only for threats, cyan only for technology.
"use strict";

(function () {
Cutaway.actor("juno", {
  name: "Juno", color: "#fff070",
  room: "flat", at: Halcyon.at.flat.start, facing: "ne",
  // isometric: front three-quarter (se) and back three-quarter (ne), mirrored for sw and nw (art/characters/juno.px.js)
  costume: {
    idle: { se: "juno_idle_se", ne: "juno_idle_ne" },
    walk: { se: "juno_walk_se", ne: "juno_walk_ne" },
    talk: { se: "juno_talk_se", ne: "juno_talk_ne" },
  },
  // indoors the hood is down (style guide §6)
  poses: [{ if: "at:juno=flat",
    idle: { se: "juno_in_idle_se", ne: "juno_in_idle_ne" }, walk: { se: "juno_in_walk_se", ne: "juno_in_walk_ne" },
    talk: { se: "juno_in_talk_se", ne: "juno_in_talk_ne" } }],
  speed: [20, 10],                                        // 2:1 along the iso lines; the walk's stride (8 px a step) doesn't skate
  voice: { pitch: 62, wave: "triangle", syllable: 70 },
});

// Motte, 12, a courier kid in the Kessel Block: on the bench by the stairs of the 14th floor, bent over his
// handheld (art/characters/motte.px.js: drawn facing SE, mirrored for SW, the way he faces the landing)
Cutaway.actor("motte", {
  name: "Motte", color: "#f0f0a0",
  room: "kessel_14", at: Halcyon.at.kessel_14.motte_feet, facing: "sw",
  // the same pose for every facing (the engine turns him toward Juno when she talks to him: he stays on the bench)
  costume: {
    idle: { se: "motte_sit_sw", sw: "motte_sit_sw", ne: "motte_sit_sw", nw: "motte_sit_sw" },
    walk: { se: "motte_sit_sw", sw: "motte_sit_sw", ne: "motte_sit_sw", nw: "motte_sit_sw" },
    talk: { se: "motte_talk_sw", sw: "motte_talk_sw", ne: "motte_talk_sw", nw: "motte_talk_sw" },
  },
  voice: { pitch: 76, range: 6, wave: "triangle", syllable: 58, speed: 1.2 },
  look: ["Motte. Zwölf, Kurier, und immer da, wo ich gerade hinwill.", "Die Mütze ist ihm drei Nummern zu groß. Er würde sie nie hergeben."],
  talk: [{ face: "se" }, { if: "!moth_met", then: [{ dialog: "motte" }],
    else: [{ if: "moth_kind", then: [{ say: "motte", text: "Morgen zeigst du's mir. Versprochen ist versprochen." }],
      else: [{ if: "moth_brushed", then: [{ say: "motte", text: "Ich bin nicht müde." }],
        else: [{ say: "motte", text: "Reparaturen. Klar." }] }] }] }],
});

// ---- people in the feeds (only ever seen through cameras in the prologue)
// a stranger in the crowd ("Pendler") until Juno tags him; then "Kessler" (Halcyon.names)
Halcyon.people.kessler = { name: "KESSLER", known: "tag_kessler", label: "Pendler", speaker: "Kessler" };
Cutaway.actor("kessler", {
  name: "Pendler", color: "#b8c890",
  costume: { idle: "kessler_feed", walk: "kessler_feed_walk", talk: "kessler_feed_phone" },
  poses: [{ if: "at:kessler=cam04", idle: "kessler_feed_sit", talk: "kessler_feed_sit", walk: "kessler_feed_walk" }],
  speed: [14, 10], voice: { pitch: 50, wave: "square", syllable: 80 },
  look: ["Kleiner Mann, großer Mantel.", { if: "!tag_kessler", then: ["Ein heller Schal. Selbst gestrickt, so wie der aussieht."], else: ["Kessler. Der Schal, den sie ihm gestrickt hat."] }],
  talk: [{ if: "tag_kessler", then: ["Den hab ich schon."], else: [{ tag: "kessler" }, "Heller Schal. Hab dich, Herr Kessler."] }],
});

Halcyon.people.varga = { name: "VARGA", known: "saw_varga", label: "Mann im grauen Mantel", speaker: "Varga" };
Cutaway.actor("varga", {
  name: "Mann im grauen Mantel", color: "#a0a0b8",
  costume: { idle: "varga_feed", walk: "varga_feed_walk", talk: "varga_feed" },
  poses: [{ if: "at:varga=cam04", idle: "varga_feed_sit", talk: "varga_feed_sit" }],
  voice: { pitch: 38, wave: "sawtooth", syllable: 95 },
  look: ["Breit. Grauer Mantel. Im Phosphor ist er fast schwarz, bis auf die Uhr.", { if: "saw_varga", then: ["Gus Varga. Geld gegen Zeit. Er verleiht beides nicht gern."] }],
  talk: [{ if: "tag_varga", then: ["Markiert."], else: [{ tag: "varga" }, "Dich merk ich mir."] }],
});

// the crowd that leaves the pump authority at 22:00: none of them is Kessler
const COMMUTERS = {
  commuter_a: ["Ein Schirm. Darunter: jemand, der nach Hause will.", "Kein Schal. Nicht er."],
  commuter_b: ["Kapuze. Zu groß für Kessler.", "Kein Schal. Nicht er."],
  commuter_c: ["Langer Mantel. Ein Schal, aber dunkel, fast schwarz im Feed.", "Dunkler Schal. Ihrer war hell gestrickt. Nicht er."],
  commuter_d: ["Eine Frau mit Tasche. Sie hat es eilig.", "Nicht er."],
};
for (const [id, [look, wrong]] of Object.entries(COMMUTERS)) {
  Cutaway.actor(id, {
    name: "Pendler", color: "#8acfae",
    costume: { idle: `${id}_feed`, walk: `${id}_feed_walk`, talk: `${id}_feed` },
    look, talk: wrong,
  });
}

Cutaway.actor("yuen", {
  name: "Koch", color: "#e8c890",
  costume: { idle: "yuen_cook_feed", walk: "yuen_cook_feed", talk: "yuen_cook_feed" },
  look: "Der Koch von Yuen's. Er hat schon alles gesehen und nichts davon erzählt.", talk: "Nicht wichtig.",
});
})();

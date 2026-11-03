// Halcyon: start-up. Loaded last (see index.html).
// Phase H0 (docs/PLAN.md): a smoke test. One test street (art/test/street.px.js, the iso mockup without
// its interface) and Juno walking in it with a single sprite. Replaced by the prologue in H2/H3.
"use strict";

(function () {
  Cutaway.actor("juno", {
    name: "Juno", color: "#fff070",
    room: "test_street", at: [190, 140], facing: "ne",
    // isometric: front three-quarter (se) and back three-quarter (ne), mirrored by the engine for sw and nw
    // (art/characters/juno.px.js, H1)
    costume: {
      idle: { se: "juno_idle_se", ne: "juno_idle_ne" },
      walk: { se: "juno_walk_se", ne: "juno_walk_ne" },
      talk: { se: "juno_talk_se", ne: "juno_talk_ne" },
    },
    speed: [16, 8],                                       // 2:1 along the iso lines; the walk's stride (6 px across a step) doesn't skate
  });

  Cutaway.room("test_street", {
    name: "Kowalski-Straße",
    background: "street_bg",
    // the floor in front of the two walls (their feet run 2:1 down from the corner at (150, 50))
    walk: [[14, 128, 150, 60, 316, 143, 316, 178, 4, 178]],
    holes: [
      [104, 122, 146, 122, 150, 152, 108, 152],           // the noodle cart and the cook
      [158, 68, 196, 72, 196, 84, 160, 82],               // the vending machine
    ],
    hotspots: {
      screen: { name: "Kaputter Werbebildschirm", rect: [192, 10, 106, 82], walkTo: [222, 128],
        look: ["Halcyon verkauft Schlaf. Und das Ding da verkauft ihn schlecht.", "Das Auge im Rauschen ... sieht es mich an?"] },
      bar: { name: "LUCKY STATIC", rect: [8, 30, 92, 72], walkTo: [70, 130],
        look: "Die Nudeln sind schlecht. Die Musik ist schlechter. Ich bin trotzdem jeden Abend hier." },
      cart: { name: "Baos Garküche", rect: [104, 92, 46, 56], walkTo: [130, 160],
        look: "Bao. Der einzige Mensch im Neunten, der mich anschreiben lässt." },
      vending: { name: "Automat", rect: [160, 28, 32, 52], walkTo: [176, 96],
        look: "OUT OF ORDER. Wie alles hier." },
    },
    enter: [{ once: ["Ein Test. Die Straße steht, ich kann gehen. Der Rest kommt noch."] }],
  });

  Cutaway.start({
    width: 320, height: 180, id: "halcyon", version: 1, language: "de", languages: ["de"],
    actor: "juno", party: ["juno"], room: "test_street", dev: true,
  });
})();

// Halcyon: start-up. Loaded last (see index.html). The prologue (game/prolog.js) is the first act.
"use strict";

(function () {
  Halcyon.buildDeck();                                   // the deck room, once the chapters have filled it
  Halcyon.declareTexts();                                // the game's own lists, for validate and the Texts tab
  Cutaway.inventory.setCorner("bottom");                 // style guide §8: the bag in the bottom right
  Cutaway.start({
    width: 320, height: 180, id: "halcyon", version: 1, language: "de", languages: ["de"],
    actor: "juno", party: ["juno"], dev: true, title: Halcyon.title,
    // the intro (game/intro.js): by itself on the first start only, then from the menu; the splash comes after it
    intro: "intro",
    // browsers allow sound only after a click: on black, only when the intro is about to play, or it would be silent
    gate: { introOnly: true, prompt: "Klicken zum Starten" },
  });
})();

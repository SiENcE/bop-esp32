// Halcyon: start-up. Loaded last (see index.html). The prologue (game/prolog.js) is the first act.
"use strict";

(function () {
  Cutaway.inventory.setCorner("bottom");                 // style guide §8: the bag in the bottom right
  Cutaway.start({
    width: 320, height: 180, id: "halcyon", version: 1, language: "de", languages: ["de"],
    actor: "juno", party: ["juno"], dev: true,
  });
})();

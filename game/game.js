// Nagiwa: start-up. Loaded last (see index.html). The prologue (game/prolog.js) is the first act.
"use strict";

(function () {
  Nagiwa.buildDeck();                                   // the deck room, once the chapters have filled it
  Nagiwa.buildCamStrip();                               // every camera's strip of the others
  Nagiwa.declareTexts();                                // the game's own lists, for validate and the Texts tab
  Cutaway.inventory.setCorner("bottom");                 // style guide §8: the bag in the bottom right
  // A save holds every actor's position. Version 2: the Kessel Block's 14th floor was laid out again (10.11.2026) and the
  // bench moved a meter on, so Motte in an older save would sit beside it; he goes back to where the map puts him now.
  // Version 3: the Drain Market is seen from above (11.11.2026), 1280x720 instead of a stage from the side: Ratz and the preacher
  // go to their crates, and Juno, if she was saved there, to the foot of the stairs.
  Cutaway.save.configure({
    migrate: (d, from) => {
      const m = d.actors?.motte;
      if (from < 2 && m?.room === "kessel_14") [m.x, m.y] = Nagiwa.at.kessel_14.motte_feet;
      if (from < 3) {
        const AM = Nagiwa.at.drain_market;
        for (const [id, at, facing] of [["ratz", AM.ratz, "down"], ["prediger", AM.preacher, "down"], ["juno", AM.arrive, "down"]]) {
          const a = d.actors?.[id];
          if (a?.room === "drain_market") { [a.x, a.y] = at; a.facing = facing; }
        }
      }
      return d;
    },
  });
  // the Kassenbuch on the deck (game/deck.js, BUCH) reads every entry's flag in code: tell the tools (validate, handoff)
  Cutaway.state.readBy("the deck's BUCH", Object.keys(Nagiwa.ledger).map((id) => `ledger_${id}`));
  Cutaway.start({
    width: 320, height: 180, id: "glass-sister", version: 3, language: "de", languages: ["de"],
    actor: "juno", party: ["juno"], dev: true, title: Nagiwa.title,
    // the intro (game/intro.js): by itself on the first start only, then from the menu; the splash comes after it
    intro: "intro",
    // browsers allow sound only after a click: on black, only when the intro is about to play, or it would be silent
    gate: { introOnly: true, prompt: "Klicken zum Starten" },
  });
})();

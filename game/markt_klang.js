// The Drain Market's one-shots (kapitel1-design §9: as loud as a real market): now and then, each from its place, haggling at an
// open stall, a cleaver at NOODLE, DUMPLING or EEL, the wok tossed at HOT WOK, and every 40 to 60 seconds the loudspeaker on the
// pillar (the sounds: game/sounds.js; their places: game/rooms/drain_market.layout.js). They come by chance, only while the market
// is shown and sound runs: nothing is saved, nothing waits for them, the tools never hear them.
"use strict";

(function () {
  const S = Nagiwa.at.drain_market.sounds;
  const pick = (/** @type {any[]} */ list) => list[Math.floor(Math.random() * list.length)];
  const between = (/** @type {number} */ a, /** @type {number} */ b) => a + Math.random() * (b - a);
  /** @type {{every: [number, number], next: number, play: () => [string, [number, number], number]}[]} what plays, how often (ms), from where, how far it carries */
  const kinds = [
    { every: [2500, 6000], play: () => [pick(["feilschen_1", "feilschen_2", "feilschen_3", "feilschen_4"]), pick(S.haggle), 260] },
    { every: [6000, 12000], play: () => [pick(["hackbeil_1", "hackbeil_1", "hackbeil_3"]), pick(S.cleaver), 280] },
    { every: [7000, 15000], play: () => ["wok_schwenk", S.wok, 240] },
    { every: [40000, 60000], play: () => ["durchsage", S.pillar, 1600] },
  ].map((/** @type {any} */ k) => ({ ...k, next: between(k.every[0], k.every[1]) }));
  Cutaway.ui.addLayer({
    z: 0,
    update(/** @type {number} */ dt) {
      if (Cutaway.scene.room?.id !== "drain_market" || !Cutaway.audio.ctx) return;
      for (const k of kinds) {
        if ((k.next -= dt) > 0) continue;
        k.next = between(k.every[0], k.every[1]);
        const [name, at, reach] = k.play();
        Cutaway.sfx.play(name, { at, reach });
      }
    },
  });
})();

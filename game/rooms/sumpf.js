// The swamps (docs/kapitel2-design.md §3.5 L4, L5; decided 2026-11-16), painted (art/rooms/sumpf.px.js): two stages seen from the side,
// where Juno stands on Pike's raft as her own figure (her walk area is a strip of its deck, so she doesn't go anywhere):
//   sumpf_fahrt  the ride out of the Drain Market to the drowned forest: the planes scroll past the raft at their own speeds, the talk
//                runs at the top (what is said: game/kapitel2_lantern.js)
//   sumpf        the arrival: the raft tied up at the walk of planks, Lantern's caravan on its pontoons, his green lanterns in the trees;
//                a click on the caravan takes Juno in (lantern_versteck, an iso room), one on the raft back to the market
// The swamp's sounds: the water and the insects as loops, and by chance a frog, a drop, a bird far off (heard only while a swamp shows;
// nothing is saved, nothing waits for them). Its melody: the theme "sumpf" (game/music.js).
"use strict";

(function () {
  const F = Nagiwa.at.sumpf_fahrt, A = Nagiwa.at.sumpf;
  const RAIN = { kind: "rain", rect: [0, 0, 320, 180], count: 60, color: "#41547a", speed: 130, slant: 0.25, length: 4 };
  Cutaway.room("sumpf_fahrt", {
    name: "Auf dem Kanal", background: "sumpf_fahrt_bg", buttons: false, lines: "top", label: true, walk: F.walk,
    light: { ambient: 0.62, color: "#b8c8d8" },
    props: [
      { id: "far", image: "sumpf_fahrt_far", at: F.far, anchor: [0, 0], baseline: 1, scroll: -24 },
      { id: "mid", image: "sumpf_fahrt_mid", at: [0, 0], anchor: [0, 0], baseline: 2, scroll: -48 },
      { id: "weed", image: "sumpf_fahrt_weed", at: F.weed, anchor: [0, 0], baseline: 3, scroll: -48 },
      { id: "floss", image: "sumpf_fahrt_floss", at: F.floss, anchor: [0, 0], baseline: 4 },
      { id: "near", image: "sumpf_fahrt_near", at: [0, 0], anchor: [0, 0], baseline: 999, scroll: -96 },
    ],
    fx: [RAIN],
    ambience: ["sumpf_wasser", "sumpf_grillen"], music: { theme: "sumpf", intensity: 0.5 },
    hotspots: {},
  });
  Cutaway.room("sumpf", {
    name: "Bei Lantern", background: "sumpf_bg", lines: "top", label: true, walk: A.walk,
    light: { ambient: 0.66, color: "#dcd8c8", lamps: [{ at: [222, 120], r: 90, power: 0.5, color: "#9ad8a4" }] },
    props: [{ id: "floss", image: "sumpf_floss", at: A.floss, anchor: [0, 0], baseline: 4 }],
    fx: [{ ...RAIN, count: 40 }],
    ambience: ["sumpf_wasser", "sumpf_grillen"], music: { theme: "sumpf", intensity: 0.4 },
    hotspots: {
      wohnwagen: { name: "Wohnwagen", poly: A.wohnwagenPoly,
        look: ["Ein alter Camper auf Pontons, bis aufs Dach vollgepackt: Solarpaneele, eine Tonne, Pflanzen, Antennen.", "Hinter der offenen Tür brennt grünes Licht. Das Kabel geht hinein."] },
      floss: { name: "Pikes Floß", poly: A.flossPoly,
        look: ["Pike steht auf seinem Floß, auf die Stange gestützt, und schaut ins Wasser.", "In den Bäumen hängen kleine grüne Laternen. Seine Lichter."] },
    },
  });

  const pick = (/** @type {string[]} */ list) => list[Math.floor(Math.random() * list.length)];
  const between = (/** @type {number} */ a, /** @type {number} */ b) => a + Math.random() * (b - a);
  const kinds = [
    { every: [2500, 7000], play: () => pick(["frosch", "frosch", "frosch_tief"]) },
    { every: [3000, 8000], play: () => "tropfen" },
    { every: [20000, 40000], play: () => "vogel_fern" },
  ].map((k) => ({ ...k, next: between(k.every[0], k.every[1]) }));
  Cutaway.ui.addLayer({
    z: 0,
    update(/** @type {number} */ dt) {
      const id = Cutaway.scene.room?.id;
      if ((id !== "sumpf" && id !== "sumpf_fahrt") || !Cutaway.audio.ctx) return;
      for (const k of kinds) {
        if ((k.next -= dt) > 0) continue;
        k.next = between(k.every[0], k.every[1]);
        Cutaway.sfx.play(k.play());
      }
    },
  });
})();

// The swamps (docs/kapitel2-design.md §3.5 L4, L5; decided 2026-11-16), painted (art/rooms/sumpf.px.js): two stages seen from the side,
// where Juno stands on Pike's raft as her own figure (her walk area is a strip of its deck, so she doesn't go anywhere):
//   sumpf_fahrt  the ride out of the Drain Market to the drowned forest: the planes scroll past the raft at their own speeds, the talk
//                runs at the top (what is said: game/kapitel2_lantern.js)
//   sumpf        the arrival: the raft tied up at the walk of planks, Lantern's caravan on its pontoons, his green lanterns in the trees;
//                a click on the caravan takes Juno in (lantern_versteck, an iso room), one on the raft back to the market
// The swamp is not a calm place (the user's wish, 2026-11-16: dangerous and uncomfortable, never still): heavy rain in three layers, mist
// drifting over the water, something under the surface that passes now and then (only its wake, rings and bubbles), Lantern's lanterns
// wavering. Its sounds: the rain, the water and the insects as loops, and by chance a frog, a drop, bubbles, a splash, wood creaking,
// a rumble far off, once in a while a bird (heard only while a swamp shows; nothing is saved, nothing waits for them). Its melody: the
// theme "sumpf" (game/music.js), with a layer of dread under it.
"use strict";

(function () {
  const F = Nagiwa.at.sumpf_fahrt, A = Nagiwa.at.sumpf;
  // in the tunnel at the ride's start it doesn't rain and no mist lies on the water (a view: only what shows; game/kapitel2_lantern.js)
  Cutaway.state.view("im_tunnel");
  const OPEN = "!im_tunnel";
  const RAIN = [
    { kind: "rain", rect: [0, 0, 320, 180], count: 130, color: "#2f3e5a", speed: 140, slant: 0.28, length: 2, if: OPEN },
    { kind: "rain", rect: [0, 0, 320, 180], count: 110, color: "#41547a", speed: 210, slant: 0.28, length: 5, if: OPEN },
    { kind: "rain", rect: [0, 0, 320, 180], count: 36, color: "#8e9ab0", speed: 320, slant: 0.3, length: 9, if: OPEN },
  ];
  const WIDE_RAIN = RAIN.map((r) => ({ ...r, rect: [0, 0, 640, 180], count: r.count * 2 }));         // the arrival is twice as wide
  const SOUND = ["sumpf_regen", "sumpf_wasser", "sumpf_grillen"];
  Cutaway.room("sumpf_fahrt", {
    name: "Auf dem Kanal", background: "sumpf_fahrt_bg", buttons: false, lines: "top", label: true, walk: F.walk,
    light: { ambient: 0.62, color: "#b8c8d8" },
    props: [
      { id: "far", image: "sumpf_fahrt_far", at: F.far, anchor: [0, 0], baseline: 1, scroll: -24 },
      { id: "mid", image: "sumpf_fahrt_mid", at: [0, 0], anchor: [0, 0], baseline: 2, scroll: -48 },
      { id: "weed", image: "sumpf_fahrt_weed", at: F.weed, anchor: [0, 0], baseline: 3, scroll: -48 },
      { id: "wesen", image: "sumpf_wesen", at: [0, 158], anchor: [0, 0], baseline: 3 },
      { id: "floss", image: "sumpf_fahrt_floss", at: F.floss, anchor: [0, 0], baseline: 4 },
      { id: "near", image: "sumpf_fahrt_near", at: [0, 0], anchor: [0, 0], baseline: 999, scroll: -96 },
      // the ride begins in the tunnel under the Ring's last pillar: in front of everything, slid off to the left as the raft comes out
      // (game/kapitel2_lantern.js); every ride begins there, so it stands at its start whenever the room is entered
      { id: "tunnel", image: "sumpf_fahrt_tunnel", at: [0, 0], anchor: [0, 0], baseline: 1000 },
    ],
    fx: [...RAIN,
      { kind: "mist", image: "sumpf_nebel_a", rect: [0, 96, 320, 60], at: [0, 100], drift: [-16, 0], alpha: 0.16, bob: 2, if: OPEN },
      { kind: "mist", image: "sumpf_nebel_b", rect: [0, 120, 320, 60], at: [0, 134], drift: [-26, 0], alpha: 0.12, bob: 3, if: OPEN }],
    ambience: SOUND, music: { theme: "sumpf", intensity: 0.65 },
    // out of the tunnel: slowly at first, while Pike says to keep the head down, then the portal slides away and there is sky
    enter: [{ move: "tunnel", to: [-480, 0], ms: 5000, ease: "in", wait: false }],
    hotspots: {},
  });
  Cutaway.room("sumpf", {
    name: "Bei Lantern", background: "sumpf_bg", size: [640, 180], lines: "top", label: true, walk: A.walk,
    light: { ambient: 0.66, color: "#dcd8c8", lamps: [{ at: [222, 120], r: 90, power: 0.5, color: "#9ad8a4", flicker: 0.12, rate: 3 },
      { id: "screen", at: A.screen, r: 40, power: 0.4, color: "#9ad8a4", flicker: 0.1, rate: 4 },
      // his lanterns: each wavers in its own time, a pool and a halo of its own
      ...A.lanterns.map((/** @type {[number, number]} */ at, /** @type {number} */ i) => ({ id: `lantern${i}`, at, r: 22, power: 0.8, color: "#9ad8a4",
        flicker: 0.4, rate: 3 + (i % 4), add: true, glow: { r: 7, strength: 0.45 } }))] },
    // (it is 640 wide and scrolls: the thing under the water passes on both halves; the parts that change, "Auf Sendung",
    // game/kapitel2_funk.js: the door shut while he has thrown her out, Pike's trap until it is freed, the radio until it is taken)
    props: [{ id: "wesen", image: "sumpf_wesen", at: [0, 146], anchor: [0, 0], baseline: 3 }, { id: "wesen2", image: "sumpf_wesen", at: [320, 150], anchor: [0, 0], baseline: 3 },
      { id: "floss", image: "sumpf_floss", at: A.floss, anchor: [0, 0], baseline: 4 },
      { id: "tuer_zu", image: "sumpf_tuer_zu", at: A.tuerZu, anchor: [0, 0], baseline: 5, if: "lantern_found=out" },
      { id: "reuse_bild", image: "sumpf_reuse", at: A.reuseAt, anchor: [0, 0], baseline: 5, if: "!reuse_frei" },
      { id: "funk_bild", image: "sumpf_funk", at: A.funkAt, anchor: [0, 0], baseline: 5, if: "!got_funk" }],
    fx: [...WIDE_RAIN,
      { kind: "mist", image: "sumpf_nebel_a", rect: [0, 100, 640, 60], at: [0, 108], drift: [-5, 0], alpha: 0.17, bob: 2 },
      { kind: "mist", image: "sumpf_nebel_b", rect: [0, 126, 640, 54], at: [0, 138], drift: [4, 0], alpha: 0.13, bob: 3 }],
    ambience: SOUND, music: { theme: "sumpf", intensity: 0.65 },
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
    { every: [6000, 14000], play: () => "blubbern" },
    { every: [9000, 18000], play: () => "knarzen" },
    { every: [12000, 25000], play: () => "platsch" },
    { every: [25000, 45000], play: () => "grollen" },
    { every: [20000, 40000], play: () => "vogel_fern" },
  ].map((k) => ({ ...k, next: between(k.every[0], k.every[1]) }));
  Cutaway.ui.addLayer({
    z: 0,
    update(/** @type {number} */ dt) {
      const id = Cutaway.scene.room?.id;
      if ((id !== "sumpf" && id !== "sumpf_fahrt" && id !== "funk") || !Cutaway.audio.ctx) return;
      for (const k of kinds) {
        if ((k.next -= dt) > 0) continue;
        k.next = between(k.every[0], k.every[1]);
        Cutaway.sfx.play(k.play());
      }
    },
  });
})();

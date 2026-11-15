// sumpf: the drowned streets of the old city under the Drain Market (docs/kapitel2-design.md §3.5 L4, §9.2), on blocks: its picture, walk area,
// props and lamps come from the bake (game/rooms/sumpf.layout.js, Nagiwa.at.sumpf). A jetty from the stairs down to where it ends in the water,
// Lantern's cable along the wall, the raft on its rope beyond. What Juno does here (the hook, the raft): game/kapitel2_lantern.js.
"use strict";

(function () {
  const A = Nagiwa.at.sumpf;
  Cutaway.room("sumpf", {
    name: "Die Sümpfe", background: "sumpf_bg",
    walk: A.walk, holes: A.holes, props: A.props,
    light: { ambient: 0.55, lamps: A.lamps.map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
    ambience: ["kanal_wasser", "city_far"], music: { theme: "juno", intensity: 0.2 },
    hotspots: {
      stairs: { name: "Treppe hinauf", poly: A.stairsPoly, walkTo: A.stairs, face: "nw", look: "Die Treppe geht hinauf zum Markt. Von hier unten hört man ihn nur noch.",
        use: [{ goto: "drain_market", at: Nagiwa.at.drain_market.down, face: "up" }] },
      cable: { name: "Kabel", poly: A.cableLine, walkTo: A.cable, face: "nw",
        look: ["Das neue Kabel läuft an der Wand entlang, über dem Wasser.", "Es leuchtet grün, so grün wie die Schrift auf dem Schirm."] },
      raft: { name: "Floß", poly: A.raftPoly, walkTo: A.end, face: "ne",
        look: ["Drüben treibt ein Floß an einem Seil.", "Hier unten stand mal eine ganze Straße. Jetzt stehen die Häuser bis zum ersten Stock im Wasser."] },
    },
  });
})();

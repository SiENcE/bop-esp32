// sumpf: the drowned forest at the edge, where Pike's raft ties up at Lantern's caravan on pontoons (docs/kapitel2-design.md §3.5 L5, §9.2),
// on blocks: its picture, walk area, props and lamps come from the bake (game/rooms/sumpf.layout.js, Nagiwa.at.sumpf). [PLATZHALTER] the
// picture is still the old jetty's (a jetty, the cable along a wall, a raft beyond): the "stairs" are where Pike's raft lies, the raft beyond
// is the caravan. What Juno does here (the caravan's door, the raft back): game/kapitel2_lantern.js.
"use strict";

(function () {
  const A = Nagiwa.at.sumpf;
  Cutaway.room("sumpf", {
    name: "Die Sümpfe", background: "sumpf_bg",
    walk: A.walk, holes: A.holes, props: A.props,
    light: { ambient: 0.55, lamps: A.lamps.map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
    ambience: ["kanal_wasser", "city_far"], music: { theme: "juno", intensity: 0.2 },
    hotspots: {
      floss: { name: "Pikes Floß", poly: A.stairsPoly, walkTo: A.stairs, face: "nw",
        look: ["Pike wartet auf seinem Floß. Er steht ganz still und schaut ins Wasser.", "Vom Markt hört man hier nichts mehr."] },
      cable: { name: "Kabel", poly: A.cableLine, walkTo: A.cable, face: "nw",
        look: ["Das Kabel kommt über das Wasser und endet am Wohnwagen.", "Es leuchtet grün, so grün wie die Schrift auf dem Schirm."] },
      wohnwagen: { name: "Wohnwagen", poly: A.raftPoly, walkTo: A.end, face: "ne",
        look: ["Ein Wohnwagen auf Pontons, voller Antennen. Hinter einem Fenster brennt grünes Licht.", "Hier stand mal eine ganze Straße. Jetzt stehen Bäume zwischen den Häusern, bis zum ersten Stock im Wasser."] },
    },
  });
})();

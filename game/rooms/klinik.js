// Lull-Klinik 9-Ost from the inside (kapitel2-design §3.2, §9.2), baked from its map (art/rooms/klinik.map.js): its picture, walk area,
// props and lamps come from the bake (game/rooms/klinik.layout.js, Nagiwa.at.klinik). Marit sits behind the reception's glass as a prop,
// as the sleeper in the laundromat (art/characters/klinik.px.js), so she always lies behind the counter; the waiting on their seats. No
// hotspots and no way in yet.
"use strict";

(function () {
  const A = Nagiwa.at.klinik;
  Cutaway.room("klinik", {
    name: "Lull-Klinik 9-Ost", background: "klinik_bg",
    walk: A.walk, holes: A.holes,
    props: [...A.props, { id: "marit", image: "marit_sit", at: A.nurse }, ...A.waiting],
    light: { ambient: 0.8, lamps: A.lamps.map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
    hotspots: {},
  });
})();

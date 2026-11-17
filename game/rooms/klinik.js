// klinik: a new room baked from its map (art/rooms/klinik.map.js), made by tools/new-room.mjs: its picture, walk area, props and lamps
// come from the bake (game/rooms/klinik.layout.js, Nagiwa.at.klinik). No hotspots and no way in yet.
"use strict";

(function () {
  const A = Nagiwa.at.klinik;
  Cutaway.room("klinik", {
    name: "Neuer Raum", background: "klinik_bg",
    walk: A.walk, holes: A.holes, props: A.props,
    light: { ambient: 0.8, lamps: A.lamps.map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
    hotspots: {},
  });
})();

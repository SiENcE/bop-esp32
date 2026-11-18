// lerche_eg: a new room baked from its map (art/rooms/lerche_eg.map.js), made by tools/new-room.mjs: its picture, walk area, props and lamps
// come from the bake (game/rooms/lerche_eg.layout.js, Nagiwa.at.lerche_eg). No hotspots and no way in yet.
"use strict";

(function () {
  const A = Nagiwa.at.lerche_eg;
  Cutaway.room("lerche_eg", {
    name: "Wohnblock Lerche", background: "lerche_eg_bg", size: /** @type {[number, number]} */ ([400, 272]),
    walk: A.walk, holes: A.holes, props: A.props,
    light: { ambient: 0.8, lamps: A.lamps.map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
    hotspots: {},
  });
})();

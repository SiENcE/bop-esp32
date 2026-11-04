// Halcyon: the intro's observation hall (shots 1, 3, 4 of docs/kapitel0-design.md §5; game/intro.js plays them),
// baked from its map (art/rooms/hall.map.js). At the street's scale, bigger than the screen: the camera moves
// over it. Its hum and the keys are the only sounds besides the music.
"use strict";

(function () {
  const AH = Halcyon.at.hall;
  Cutaway.room("intro_hall", {
    name: "Beobachtungshalle", background: "hall_bg", size: [576, 416], props: AH.props,
    ambience: [{ sfx: "deck_fans", gain: 0.8 }, { sfx: "fridge_hum", gain: 0.4 }],
  });
})();

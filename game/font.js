// Nagiwa: the main font (docs/style-guide.md §8a). A 5x7 terminal face, square and hard-cornered, with
// the frames' motif: where a letter closes round a corner, the top left and the bottom right are cut at
// 45° (O C G Q S 0 6 8 9 ...), every other corner stays square. Capitals and digits are 7 rows; lowercase
// has a 5-row x-height and 2-row descenders; the umlauts' dots sit two rows above the capitals (as in the
// engine's font). It is the default font: lines, menus, cards, labels and the deck all use it.
// Also the HUD font ("hud", 3x5 capitals) for the camera display and readouts.
// The glyphs are in game/glyphs.js (shared with the art). Loaded right after it, before the other game
// files (it must be the default before anything measures text).
"use strict";

(function () {
  const G = NAGIWA_GLYPHS.nagiwa;
  Cutaway.font.define("nagiwa", { lineHeight: 10, glyphs: G }, true);

  const HUD_GLYPHS = NAGIWA_GLYPHS.hud;
  Cutaway.font.define("hud", { lineHeight: 7, glyphs: HUD_GLYPHS });
  Cutaway.ui.skin({ font: "nagiwa", lineWidth: 200 });
})();

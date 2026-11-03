// Halcyon: the title screen (docs/style-guide.md §8a "Title screen"): rain over the Kowalski street at
// night, the broken HALCYON screen with the eye in its static (art/ui/title_bg.px.js), the logo glitching
// (art/ui/logo.px.js), the menu in the chamfered frame (game/skin.js). Juno's theme with the drums in.
"use strict";

Cutaway.room("title", {
  name: "Halcyon", background: "title_bg",
  ambience: ["rain", "city_far", { sfx: "neon_buzz", gain: 1.5 }],
  music: { theme: "juno", intensity: 0.6 },
});

Halcyon.title = {
  room: "title", logo: "title_logo", name: "Halcyon",
  tagline: "JACK IN",                          // the city's tech speaks English (story §10)
  footer: "Arbeitstitel · v0.1",
};

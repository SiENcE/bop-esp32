// Glass Sister: the screens before the game (docs/style-guide.md §8a "Title screen").
//   the title screen   (title.splash) the siblings through cracked glass, Juno awake and Teo asleep, GLASS
//                      SISTER (art/ui/splash.px.js), rain on Juno's side, the engine's prompt; on start-up only
//   the menu screen    rain over the Kowalski street at night, the broken HALCYON screen with the eye in
//                      its static (art/ui/title_bg.px.js), a small flat logo (art/ui/logo.px.js), the menu
//                      in the chamfered frame (game/skin.js); Juno's theme with the drums in
"use strict";

Cutaway.room("splash", {
  name: "Glass Sister", background: "splash_bg",
  // rain on Juno's side of the glass only (right of the crack, over the picture); Teo's side stays dry
  fx: [{ kind: "rain", rect: [165, 0, 155, 116], count: 18, color: "#41547a", speed: 170, slant: 0.18, length: 4 }],
  ambience: ["rain", { sfx: "city_far", gain: 0.6 }],
});

Cutaway.room("title", {
  name: "Glass Sister", background: "title_bg",
  ambience: ["rain", "city_far", { sfx: "neon_buzz", gain: 1.5 }],
  music: { theme: "juno", intensity: 0.6 },
});

Halcyon.title = {
  room: "title", logo: "title_logo", name: "Glass Sister",
  splash: { room: "splash" },
  tagline: "JACK IN",                          // the city's tech speaks English (story §10)
  footer: "v0.1",
};

// Glass Sister: the screens before the game (docs/style-guide.md §8a "Title screen").
//   the title screen   (title.splash) the siblings through cracked glass, Juno awake and Teo asleep, GLASS
//                      SISTER (art/ui/splash.px.js), rain on Juno's side, the engine's prompt; on start-up only
//   the menu screen    Kowalski Street seen whole, as a still (art/ui/title_bg.px.js: the game's street
//                      baked tall with its props and a patrol drone, its searchlight on the street, brought
//                      down to the screen), rain over it; a small flat logo (art/ui/logo.px.js), the menu
//                      in the chamfered frame (game/skin.js); Juno's theme
"use strict";

Cutaway.room("splash", {
  name: "Glass Sister", background: "splash_bg",
  // rain on Juno's side of the glass only (right of the crack, over the picture); Teo's side stays dry
  fx: [{ kind: "rain", rect: [165, 0, 155, 116], count: 18, color: "#41547a", speed: 170, slant: 0.18, length: 4 }],
  ambience: ["rain", { sfx: "city_far", gain: 0.6 }],
});

Cutaway.room("title", {
  name: "Glass Sister", background: "title_bg",
  // the street's rain at the smaller picture's scale: far and dim, near and bright
  fx: [
    { kind: "rain", rect: [0, 0, 320, 180], count: 60, color: "#41547a", speed: 120, slant: 0.3, length: 3 },
    { kind: "rain", rect: [0, 0, 320, 180], count: 40, color: "#6c809a", speed: 170, slant: 0.3, length: 4 },
  ],
  ambience: ["rain", "city_far", { sfx: "neon_buzz", gain: 1.5 }],
  music: { theme: "juno", intensity: 0.6 },
});

Halcyon.title = {
  room: "title", logo: "title_logo", name: "Glass Sister",
  splash: { room: "splash" },
  tagline: "JACK IN",                          // the city's tech speaks English (story §10)
  footer: "v0.1",
};

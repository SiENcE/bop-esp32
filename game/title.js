// Glass Sister: the screens before the game (docs/style-guide.md §8a "Title screen").
//   the title screen   (title.splash) the siblings through cracked glass, Juno awake and Teo asleep, GLASS
//                      SISTER (art/ui/splash.px.js), rain on Juno's side, the engine's prompt; on start-up only
//   the menu screen    Kowalski Street itself (game/rooms/kowalski.js: its picture, props, light, rain), a
//                      patrol drone hovering over it with its searchlight on the street, the camera
//                      panning slowly along the whole street and back; a small flat logo
//                      (art/ui/logo.px.js), the menu in the chamfered frame (game/skin.js); Juno's theme
"use strict";

Cutaway.room("splash", {
  name: "Glass Sister", background: "splash_bg",
  // rain on Juno's side of the glass only (right of the crack, over the picture); Teo's side stays dry
  fx: [{ kind: "rain", rect: [165, 0, 155, 116], count: 18, color: "#41547a", speed: 170, slant: 0.18, length: 4 }],
  ambience: ["rain", { sfx: "city_far", gain: 0.6 }],
});

{
  const AW = Halcyon.at.kowalski, L = /** @type {any} */ (Halcyon.kowalskiLook);
  Cutaway.room("title", {
    name: "Glass Sister", ...L,
    props: [...L.props, { id: "drone", image: "drone_hover", at: AW.drone, baseline: 999 }],
    // the drone's searchlight: its beam in the rain, its pool on the street (a lamp the art hasn't got)
    light: { ...L.light, lamps: [...L.light.lamps, { id: "search", at: AW.searchPool, r: 30, power: 1.35, color: "#dafcff", flicker: 0.04, add: true }] },
    fx: [...L.fx, { kind: "haze", poly: AW.searchBeam, color: "#dafcff", alpha: 0.2, fade: 0.5 }],
    ambience: ["rain", "city_far", { sfx: "neon_buzz", gain: 1.5 }],
    music: { theme: "juno", intensity: 0.6 },
  });
}

Halcyon.title = {
  room: "title", logo: "title_logo", name: "Glass Sister",
  // along the whole street (416 px) and back, slowly
  view: [0, 0], pan: { to: [96, 0], ms: 16000 },
  splash: { room: "splash" },
  tagline: "JACK IN",                          // the city's tech speaks English (story §10)
  footer: "v0.1",
};

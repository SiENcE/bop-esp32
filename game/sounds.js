// Nagiwa: the sounds (docs/style-guide.md §8a "Sounds"): synthesised with the engine (Cutaway.sfx,
// no files), electric, cold and small. No cartoon sounds: hum, data chirps, keys, a modem's handshake,
// relays, static, rain on glass. Where they play:
//   the implant and the feeds   tag (nagiwa.js), rec (rooms/cams.js, screens.js), zoom (nagiwa.js),
//                               cache (nagiwa.js), link (rooms/deck.js)
//   room changes                jack_in, jack_out, static, glitch (here, by the kind in transitions.js)
//   the deck                    mail, boot, type (the cards' letters: skin.js), evi (the hint button, here)
//   ambience (rooms' loops)     rain_glass, city_far, neon_buzz, fridge_hum, deck_fans, feed_hiss, feed_rain
// Hear them all at once: node tools/render-sounds.mjs (writes build/sounds/).
"use strict";

(function () {
  /** The game's sounds by name, in the order they are defined (tools/render-sounds.mjs plays them). @type {string[]} */
  Nagiwa.sounds = [];
  /** @param {string} name @param {any} def */
  const S = (name, def) => { Nagiwa.sounds.push(name); Cutaway.sfx.define(name, def); };

  // ---------------------------------------------------------------- the stairs of the Kessel Block
  // two feet on a steel flight: a dull step and the landing's ring
  S("steps_metal", { tone: [{ wave: "sine", from: 120, to: 70, ms: 45, gain: 0.3 }, { wave: "sine", from: 105, to: 62, ms: 45, gain: 0.24, at: 110 }, { wave: "triangle", from: 880, ms: 40, gain: 0.015, at: 8 }],
    noise: { filter: "lowpass", from: 500, ms: 30, gain: 0.08 } });
  // the flat's steel door: three knocks of a fist; its three locks and the heavy leaf; shut, and the latch
  S("knock", { tone: [0, 230, 430].map((at) => ({ wave: "sine", from: 140, to: 75, ms: 70, gain: 0.32, at })),
    noise: [0, 230, 430].map((at) => ({ filter: "lowpass", from: 420, ms: 40, gain: 0.14, at })) });
  S("door_open", { tone: [{ wave: "square", from: 1800, ms: 12, gain: 0.05 }, { wave: "square", from: 1500, ms: 12, gain: 0.05, at: 90 },
    { wave: "square", from: 1650, ms: 12, gain: 0.05, at: 180 }, { wave: "sawtooth", from: 95, to: 70, ms: 380, attack: 60, gain: 0.03, at: 260 }],
    noise: [{ filter: "bandpass", from: 3000, q: 3, ms: 15, gain: 0.1 }, { filter: "bandpass", from: 2600, q: 3, ms: 15, gain: 0.1, at: 90 },
      { filter: "bandpass", from: 2800, q: 3, ms: 15, gain: 0.1, at: 180 }, { filter: "lowpass", from: 300, ms: 400, attack: 80, gain: 0.06, at: 260 }] });
  S("door_shut", { tone: [{ wave: "sine", from: 90, to: 50, ms: 160, gain: 0.34 }, { wave: "square", from: 1400, ms: 14, gain: 0.05, at: 170 }],
    noise: [{ filter: "lowpass", from: 500, ms: 90, gain: 0.2 }, { filter: "bandpass", from: 2800, q: 3, ms: 15, gain: 0.1, at: 170 }] });

  // ---------------------------------------------------------------- the implant and the feeds
  // the overlay locks on: two quick high pips and a tick of static
  S("tag", { tone: [{ wave: "sine", from: 1760, ms: 40, gain: 0.16 }, { wave: "sine", from: 2349, ms: 70, gain: 0.14, at: 55 }],
    noise: { filter: "highpass", from: 6000, ms: 20, gain: 0.06 } });
  // a relay clicks, then the camera's beep
  S("rec", { tone: [{ wave: "sine", from: 140, to: 60, ms: 30, gain: 0.3 }, { wave: "square", from: 1000, ms: 80, gain: 0.07, at: 35 }],
    noise: { filter: "bandpass", from: 2500, q: 2, ms: 15, gain: 0.15 } });
  // the lens's servo whirs
  S("zoom", { tone: { wave: "sawtooth", from: 170, to: 330, ms: 260, attack: 30, gain: 0.035, vibrato: [38, 30] },
    noise: { filter: "bandpass", from: 900, to: 1500, q: 2, ms: 260, attack: 30, gain: 0.05 } });
  // stored: three rising data blips
  S("cache", { tone: [{ wave: "triangle", from: 1318, ms: 45, gain: 0.13 }, { wave: "triangle", from: 1568, ms: 45, gain: 0.13, at: 55 },
    { wave: "triangle", from: 2093, ms: 90, gain: 0.12, at: 110 }], noise: { filter: "highpass", from: 7000, ms: 15, gain: 0.05 } });
  // a camera links: an old modem's handshake, cut short, and a clean tone when it holds
  S("link", { tone: [{ wave: "square", from: 1200, ms: 110, gain: 0.04 }, { wave: "square", from: 2100, ms: 110, gain: 0.04, at: 120 },
    { wave: "square", from: 980, ms: 60, gain: 0.04, at: 430 }, { wave: "square", from: 1650, ms: 60, gain: 0.04, at: 495 },
    { wave: "sine", from: 1400, ms: 160, gain: 0.1, at: 600 }],
    noise: [{ filter: "bandpass", from: 2400, to: 1700, q: 6, ms: 190, gain: 0.12, at: 240 }, { filter: "highpass", from: 4000, ms: 60, gain: 0.05, at: 560 }] });

  // ---------------------------------------------------------------- room changes
  S("jack_in", { tone: [{ wave: "sine", from: 70, to: 1300, ms: 380, attack: 40, gain: 0.11 }, { wave: "square", from: 2400, ms: 30, gain: 0.04, at: 360 }],
    noise: { filter: "highpass", from: 2500, to: 8000, ms: 380, attack: 220, gain: 0.08 } });
  S("jack_out", { tone: { wave: "sine", from: 1300, to: 55, ms: 300, gain: 0.11 },
    noise: { filter: "lowpass", from: 6000, to: 250, ms: 260, gain: 0.1 } });
  S("static", { noise: [{ filter: "bandpass", from: 3000, q: 0.7, ms: 260, gain: 0.16 }, { filter: "highpass", from: 5000, ms: 120, gain: 0.08, at: 120 }] });
  // the end in cam31: a body on wet concrete, through an old microphone; Lantern's motor starting up and going
  S("body_fall", { noise: { filter: "lowpass", from: 260, ms: 140, gain: 0.3 }, tone: { wave: "sine", from: 80, to: 44, ms: 170, gain: 0.3 } });
  S("motor", { tone: { wave: "sawtooth", from: 55, to: 130, ms: 1400, gain: 0.05 }, noise: { filter: "bandpass", from: 400, q: 1.5, ms: 1500, gain: 0.05 } });
  S("glitch", { noise: [{ filter: "bandpass", from: 1800, q: 3, ms: 30, gain: 0.16 }, { filter: "bandpass", from: 600, q: 3, ms: 40, gain: 0.16, at: 60 },
    { filter: "bandpass", from: 2600, q: 4, ms: 25, gain: 0.12, at: 170 }], tone: { wave: "square", from: 3200, to: 200, ms: 50, gain: 0.03, at: 110 } });

  // ---------------------------------------------------------------- the deck
  // a message: two soft glass notes
  S("mail", { tone: [{ wave: "sine", from: "E6", ms: 140, gain: 0.11 }, { wave: "sine", from: "A6", ms: 260, gain: 0.09, at: 110 },
    { wave: "triangle", from: "A5", ms: 260, gain: 0.04, at: 110 }] });
  // the deck wakes: a rising hum, two pips
  S("boot", { tone: [{ wave: "sine", from: 110, to: 440, ms: 320, attack: 80, gain: 0.08 }, { wave: "square", from: 1760, ms: 30, gain: 0.035, at: 330 },
    { wave: "square", from: 2093, ms: 40, gain: 0.035, at: 375 }], noise: { filter: "lowpass", from: 400, ms: 300, gain: 0.05 } });
  // a key on Juno's keyboard (a card typing itself on)
  S("type", { noise: { filter: "bandpass", from: 2600, q: 1.5, ms: 18, gain: 0.08 }, tone: { wave: "square", from: 190, ms: 12, gain: 0.02 } });
  // EVI: a small round chirp, up and a little down
  S("evi", { tone: [{ wave: "triangle", from: 880, to: 1320, ms: 60, gain: 0.13 }, { wave: "triangle", from: 1320, to: 1046, ms: 90, gain: 0.12, at: 70 }] });

  // ---------------------------------------------------------------- ambience (loops)
  S("rain_glass", { loop: { noise: { filter: "lowpass", freq: 3200, q: 0.5 }, gain: 0.045, crackle: 0.25 } });     // on the window, drops tapping
  S("city_far", { loop: { noise: { filter: "lowpass", freq: 260, q: 0.3 }, gain: 0.06, wobble: [0.05, 0.4] } });     // traffic far below, the pumps
  S("neon_buzz", { loop: { tone: { wave: "sawtooth", freq: 100 }, gain: 0.006, wobble: [0.3, 0.3] } });            // the sign outside
  S("fridge_hum", { loop: { tone: { wave: "sine", freq: 50 }, gain: 0.03 } });
  S("deck_fans", { loop: { noise: { filter: "bandpass", freq: 900, q: 0.8 }, gain: 0.02, wobble: [0.07, 0.2] } });
  S("feed_hiss", { loop: { noise: { filter: "highpass", freq: 5500, q: 0.3 }, gain: 0.018 } });                     // the camera's mic
  S("feed_rain", { loop: { noise: { filter: "lowpass", freq: 1800, q: 0.4 }, gain: 0.04, crackle: 0.15 } });         // rain, through it

  // ---------------------------------------------------------------- when they play
  // a room change: by its kind (transitions.js); only where the change is shown (not in the tools)
  Cutaway.events.on("room.leave", (/** @type {{id?: string, to: string}} */ e) => {
    if (!Cutaway.fx.active || Cutaway.script.fast || !e.id || e.id === e.to) return;
    const k = Nagiwa.transitionKind({ from: e.id, to: e.to });
    Cutaway.events.emit("sfx", { sfx: k === "jack" ? (Nagiwa.isScreen(e.to) ? "jack_in" : "jack_out") : k });
  });
  // EVI answers the hint button
  Cutaway.events.on("hint", () => Cutaway.events.emit("sfx", { sfx: "evi" }));
})();

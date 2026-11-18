// Nagiwa: the sounds (docs/style-guide.md §8a "Sounds"): synthesised with the engine (Cutaway.sfx,
// no files), electric, cold and small. No cartoon sounds: hum, data chirps, keys, a modem's handshake,
// relays, static, rain on glass. Where they play:
//   the implant and the feeds   tag (nagiwa.js), rec (rooms/cams.js, screens.js), zoom (nagiwa.js),
//                               cache (nagiwa.js), link (rooms/deck.js)
//   room changes                jack_in, jack_out, static, glitch (here, by the kind in transitions.js)
//   the deck                    mail, boot, type (the cards' letters: skin.js), evi (the hint button, here)
//   ambience (rooms' loops)     rain_glass, city_far, neon_buzz, fridge_hum, deck_fans, feed_hiss, feed_rain
//   the Drain Market            its loops at their places (the crowd, the wok, the canal, the roofs' ACs, the pillar) and
//                               one-shots from its stalls (haggling, cleavers, the wok tossed, the loudspeaker)
//   the swamps                  the rain, the water and the insects as loops; frogs, drops, bubbles, creaking wood, a splash, a rumble
//                               and a bird far off by chance (rooms/sumpf.js)
//   SUMP RUNNER                 the cabinet's square bleeps: start, a step, the cable reeled in, a wall, a spark, the light on, drowned
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

  // ---------------------------------------------------------------- the Drain Market (kapitel1-design §9: as loud as a real market)
  // Its loops play at their places in the room (ambience with at and reach, game/markt_klang.js), several of the crowd's murmur
  // at once with different swells, so it never pulses in step; the one-shots come at random from their stalls.
  S("markt_stimmen_a", { loop: { noise: { filter: "bandpass", freq: 620, q: 0.9 }, gain: 0.07, wobble: [0.31, 0.45] } });    // the crowd's murmur
  S("markt_stimmen_b", { loop: { noise: { filter: "bandpass", freq: 840, q: 1.1 }, gain: 0.06, wobble: [0.47, 0.5] } });
  S("markt_stimmen_c", { loop: { noise: { filter: "bandpass", freq: 480, q: 0.8 }, gain: 0.07, wobble: [0.23, 0.4] } });
  S("wok_zischen", { loop: { noise: { filter: "highpass", freq: 2600, q: 0.6 }, gain: 0.05, wobble: [0.9, 0.3], crackle: 0.35 } });   // oil spitting
  S("kanal_wasser", { loop: { noise: { filter: "lowpass", freq: 520, q: 0.7 }, gain: 0.05, wobble: [0.09, 0.55] } });    // the canal lapping
  // ---------------------------------------------------------------- the swamps (game/rooms/sumpf.js): the water at the raft, the insects
  // in the trees; now and then a frog, a deeper one, a drop from the moss, once in a while a bird far off
  S("sumpf_wasser", { loop: { noise: { filter: "lowpass", freq: 640, q: 0.9 }, gain: 0.045, wobble: [0.18, 0.6] } });
  S("sumpf_grillen", { loop: { noise: { filter: "bandpass", freq: 5200, q: 7 }, gain: 0.012, wobble: [6.5, 0.7] } });
  S("frosch", { tone: [0, 140].map((at) => ({ wave: "square", from: 190, to: 150, ms: 70, gain: 0.04, at })),
    noise: [0, 140].map((at) => ({ filter: "bandpass", from: 700, q: 6, ms: 60, gain: 0.05, at })) });
  S("frosch_tief", { tone: [{ wave: "triangle", from: 92, to: 70, ms: 260, attack: 30, gain: 0.12 }], noise: [{ filter: "lowpass", from: 300, ms: 220, gain: 0.05 }] });
  S("tropfen", { tone: [{ wave: "sine", from: 1500, to: 900, ms: 60, gain: 0.05 }, { wave: "sine", from: 700, to: 500, ms: 120, gain: 0.025, at: 40 }] });
  // what makes it uneasy: the rain on leaves and water, bubbles rising, wood creaking, something heavy in the water, a rumble far off
  S("sumpf_regen", { loop: { noise: { filter: "highpass", freq: 2400, q: 0.4 }, gain: 0.05, crackle: 0.35 } });
  S("blubbern", { tone: [0, 90, 170].map((at, i) => ({ wave: "sine", from: 380 + i * 60, to: 900 + i * 80, ms: 45, gain: 0.04, at })) });
  S("knarzen", { tone: [{ wave: "sawtooth", from: 190, to: 140, ms: 520, attack: 120, gain: 0.018 }], noise: [{ filter: "bandpass", from: 820, to: 640, q: 9, ms: 520, attack: 120, gain: 0.05 }] });
  S("platsch", { noise: [{ filter: "bandpass", from: 1300, to: 380, q: 1.2, ms: 320, gain: 0.16 }], tone: [{ wave: "sine", from: 320, to: 110, ms: 140, gain: 0.06 }] });
  S("grollen", { noise: [{ filter: "lowpass", from: 140, to: 90, ms: 2600, attack: 500, gain: 0.3 }], tone: [{ wave: "sine", from: 46, to: 34, ms: 2200, attack: 400, gain: 0.12 }] });
  S("vogel_fern", { tone: [{ wave: "sawtooth", from: 620, to: 430, ms: 260, attack: 20, gain: 0.025 }],
    noise: [{ filter: "bandpass", from: 1300, to: 900, q: 5, ms: 260, gain: 0.05 }] });
  S("dach_luefter", { loop: { noise: { filter: "bandpass", freq: 210, q: 2.2 }, tone: { wave: "triangle", freq: 61 }, gain: 0.03, wobble: [0.6, 0.15] } });   // the ACs on the roofs
  S("pfeiler_brummen", { loop: { tone: { wave: "sine", freq: 55 }, gain: 0.04 } });                                       // the city's pillar
  // the market's other tunes (tunes at a place: a theme of game/music.js with a player of its own, beside the wok's radio):
  // PACHINKO's jingle and its balls rattling, the busker's erhu, the noodle raft's radio on NAGI·WA EASY, the data raft's
  // boombox on NINTH FM (Juno's theme)
  S("pachinko_jingle", { loop: { theme: "pachinko", speaker: 0.8, gain: 2.4 } });
  S("pachinko_kugeln", { loop: { noise: { filter: "bandpass", freq: 3600, q: 1.4 }, gain: 0.015, crackle: 0.5 } });
  S("strassenmusik", { loop: { theme: "strassenmusik", speaker: 0.15, gain: 0.9 } });
  S("radio_nudelfloss", { loop: { theme: "easy", speaker: 1, intensity: 0.5, gain: 0.7 } });
  S("radio_datenfloss", { loop: { theme: "juno", speaker: 1, intensity: 0.7, gain: 0.7 } });
  /** gibberish from far off, a voice as tones: n syllables round a pitch, a contour (up for a question, down for a price) @param {number} seed @param {number} base Hz @param {number} n @param {number} bend */
  const babble = (seed, base, n, bend) => {
    let r = seed;
    const rnd = () => { r = (r * 1103515245 + 12345) & 0x7fffffff; return r / 0x7fffffff; };
    const tone = [], noise = [];
    let at = 0;
    for (let i = 0; i < n; i++) {
      const ms = 60 + Math.round(rnd() * 70), f = base * (1 + bend * i / n) * (0.92 + rnd() * 0.16);
      tone.push({ wave: "sawtooth", from: Math.round(f), to: Math.round(f * (0.94 + rnd() * 0.1)), ms, attack: 10, gain: 0.05, at });
      if (rnd() < 0.5) noise.push({ filter: "bandpass", from: 3200 + Math.round(rnd() * 1800), q: 2, ms: 25, gain: 0.05, at });
      at += ms + Math.round(rnd() * 40) + (rnd() < 0.15 ? 120 : 0);
    }
    return { tone, noise: [...noise, { filter: "bandpass", from: 900, q: 1.2, ms: at, gain: 0.02 }] };
  };
  // haggling at the stalls: a price called out (falling), a question (rising), a laugh, an offer turned down
  S("feilschen_1", babble(11, 190, 7, -0.25));
  S("feilschen_2", babble(23, 240, 5, 0.35));
  S("feilschen_3", babble(37, 150, 9, -0.1));
  S("feilschen_4", { tone: [0, 140, 260, 370].map((at, i) => ({ wave: "sawtooth", from: 300 - i * 18, to: 260 - i * 18, ms: 90, attack: 8, gain: 0.05, at })),
    noise: { filter: "bandpass", from: 1100, q: 1, ms: 480, gain: 0.02 } });                                            // a laugh
  // a cleaver on a block: a dull chop with its click (one, or two, three in a row)
  const chop = (at) => ({ wave: "sine", from: 180, to: 70, ms: 70, gain: 0.32, at });
  const click = (at) => ({ filter: "bandpass", from: 2400, q: 3, ms: 18, gain: 0.14, at });
  S("hackbeil_1", { tone: [chop(0)], noise: [click(0), { filter: "lowpass", from: 800, ms: 50, gain: 0.1 }] });
  S("hackbeil_3", { tone: [chop(0), chop(260), chop(520)], noise: [click(0), click(260), click(520)] });
  // the wok tossed: a whoosh of steam and a rattle of the pan on the ring
  S("wok_schwenk", { noise: [{ filter: "bandpass", from: 900, to: 3800, q: 1, ms: 420, attack: 60, gain: 0.12 }, { filter: "highpass", from: 5000, ms: 300, gain: 0.05, at: 80 }],
    tone: [{ wave: "triangle", from: 420, to: 380, ms: 60, gain: 0.05, at: 380 }, { wave: "triangle", from: 410, to: 370, ms: 60, gain: 0.04, at: 470 }] });
  // the market's loudspeaker on the pillar: a two-tone chime, then a voice through a horn (Nagi·wa's notices, nobody listens)
  S("durchsage", { tone: [{ wave: "sine", from: "E5", ms: 420, gain: 0.12 }, { wave: "sine", from: "C5", ms: 620, gain: 0.12, at: 380 },
    ...babble(5, 210, 14, -0.05).tone.map((t) => ({ ...t, wave: /** @type {OscillatorType} */ ("square"), gain: 0.03, at: t.at + 1150 }))],
    noise: { filter: "bandpass", from: 1400, q: 3, ms: 2600, gain: 0.03, at: 1100 } });

  // ---------------------------------------------------------------- SUMP RUNNER's cabinet (game/sump_runner.js): an old arcade's square bleeps
  S("sr_start", { tone: [{ wave: "square", from: "C5", ms: 70, gain: 0.05 }, { wave: "square", from: "E5", ms: 70, gain: 0.05, at: 80 },
    { wave: "square", from: "G5", ms: 70, gain: 0.05, at: 160 }, { wave: "square", from: "C6", ms: 140, gain: 0.05, at: 240 }] });
  S("sr_step", { tone: { wave: "square", from: 330, to: 440, ms: 35, gain: 0.04 } });
  S("sr_reel", { tone: { wave: "square", from: 440, to: 300, ms: 45, gain: 0.04 } });
  S("sr_block", { tone: { wave: "square", from: 110, ms: 60, gain: 0.05 } });
  S("sr_spark", { tone: [{ wave: "square", from: "A5", ms: 40, gain: 0.04 }, { wave: "square", from: "E6", ms: 70, gain: 0.04, at: 45 }] });
  S("sr_light", { tone: [{ wave: "square", from: "G5", ms: 90, gain: 0.05 }, { wave: "square", from: "C6", ms: 90, gain: 0.05, at: 100 },
    { wave: "square", from: "E6", ms: 90, gain: 0.05, at: 200 }, { wave: "triangle", from: "G6", ms: 320, gain: 0.07, at: 300 }] });
  S("sr_drown", { tone: { wave: "square", from: 520, to: 70, ms: 620, gain: 0.05 }, noise: { filter: "lowpass", from: 900, to: 200, ms: 500, gain: 0.08, at: 120 } });

  // ---------------------------------------------------------------- when they play
  // a room change: by its kind (transitions.js); only where the change is shown (not in the tools)
  Cutaway.events.on("room.leave", (/** @type {{id?: string, to: string}} */ e) => {
    if (!Cutaway.fx.active || Cutaway.script.fast || !e.id || e.id === e.to) return;
    const k = Nagiwa.transitionKind({ from: e.id, to: e.to });
    if (k === "fade") return;                                       // a quiet fade: the music and the market carry it
    Cutaway.events.emit("sfx", { sfx: k === "jack" ? (Nagiwa.isScreen(e.to) ? "jack_in" : "jack_out") : k });
  });
  // EVI answers the hint button
  Cutaway.events.on("hint", () => Cutaway.events.emit("sfx", { sfx: "evi" }));
})();

// Nagiwa: the music (docs/style-guide.md §8a "Music", docs/kapitel0-design.md §9), synthesised with the
// engine (Cutaway.synth, Cutaway.score): dark synth in the line of Vangelis's Blade Runner and the SNES
// Shadowrun. Two themes at the same tempo and in the same key, so going into a camera and back stays in time:
//   juno   Juno's theme, D minor (Aeolian), 72 bpm: an electric piano carries the tune, a CS-80-like pad
//          holds the chords, the bass beats like a heart (two beats, a rest). With the intensity come a
//          cold arpeggio with echoes (layer "arp"), a sparse drum machine with a gated snare ("drums"),
//          and a CS-80 brass voice over it all ("lead"). On the deck it plays through the wall (speaker).
//   glass  the feeds: the theme steps back; a low drone on D, a glass bell now and then, the rain and
//          the camera's hiss (ambience) do the rest. With the intensity a slow pulse comes in ("pulse").
//   opening the intro's float over the sea (below, after memory). descent: the ride down in the lift, after it.
//   easy, rooftop: two of the radio's stations (game/radio.js); the third, NINTH FM, plays Juno's theme.
//   glassgirl: NINTH FM's pop song about a Glasser, the karaoke machine's in LUCKY STATIC (game/karaoke.js).
//   wokradio: the old song on the radio at HOT WOK in the Drain Market, heard at its place through a small speaker;
//   markt_ankunft: the view down into the market from the stairs as one arrives, its pentatonic, ending on the market whole.
//   pachinko, strassenmusik: two of the market's other tunes at their places (a machine's jingle, a busker's erhu).
//   sumpf: the swamps, the ride on Pike's raft and Lantern's lights (game/rooms/sumpf.js): calm and mystical, a flute over a soft pad.
// Stingers: "clue" (a moment caught), "witness" (the screen says JUNO.: everything else stops for it).
// Listen: node lib/cutaway/tools/render-music.mjs index.html --out build/music/juno.wav --steps '[...]'
"use strict";

(function () {
  const I = Cutaway.synth.define;
  // ---------------------------------------------------------------- instruments
  I("epiano", { type: "fm", ratio: 1, index: 1.2, indexDecay: 0.6, amp: { a: 0.004, d: 1.6, s: 0.2, r: 0.9 }, gain: 0.15, reverb: 0.45, delay: 0.22, pan: -0.1 });
  I("cs80pad", { type: "sub", wave: "saw", voices: 3, detune: 14, filter: { cutoff: 600, env: 1300, a: 0.7, decay: 1.6, sustain: 0.5, q: 2 },
    amp: { a: 0.9, d: 1, s: 0.8, r: 2.2 }, vibrato: { rate: 4.5, depth: 8, delay: 0.8 }, gain: 0.065, reverb: 0.6, delay: 0.12 });
  I("cs80brass", { type: "sub", wave: "saw", voices: 2, detune: 10, filter: { cutoff: 900, env: 2600, a: 0.25, decay: 0.8, sustain: 0.55, q: 3 },
    amp: { a: 0.15, d: 0.4, s: 0.85, r: 1.2 }, vibrato: { rate: 5, depth: 14, delay: 0.5 }, gain: 0.085, reverb: 0.55, delay: 0.3, pan: 0.1 });
  I("heart", { type: "sub", wave: "sine", filter: { cutoff: 220, q: 1 }, amp: { a: 0.005, d: 0.24, s: 0, r: 0.1 }, gain: 0.42 });
  I("arp", { type: "sub", wave: "pulse", pulseWidth: 0.25, filter: { cutoff: 1400, env: 1200, decay: 0.12, q: 4 },
    amp: { a: 0.002, d: 0.15, s: 0.1, r: 0.1 }, gain: 0.055, delay: 0.5, reverb: 0.3, pan: 0.2 });
  I("kick", { type: "drum", kind: "kick", decay: 0.45, gain: 0.6 });
  I("snare", { type: "drum", kind: "snare", gate: 0.35, gain: 0.28, reverb: 0.35 });
  I("hat", { type: "drum", kind: "hat", gain: 0.09, pan: 0.3 });
  I("drone", { type: "sub", wave: "saw", voices: 2, detune: 6, filter: { cutoff: 220, q: 1 }, amp: { a: 2, d: 1, s: 1, r: 3 }, gain: 0.08, reverb: 0.5 });
  I("glassbell", { type: "fm", ratio: 3.5, index: 1.5, indexDecay: 1.2, amp: { a: 0.002, d: 2, s: 0, r: 1.5 }, gain: 0.06, reverb: 0.7, delay: 0.4 });
  I("pulse", { type: "sub", wave: "triangle", filter: { cutoff: 500, env: 400, decay: 0.1 }, amp: { a: 0.003, d: 0.2, s: 0, r: 0.1 }, gain: 0.18 });

  // ---------------------------------------------------------------- patterns (16 steps a bar)
  const bars = (/** @type {string[]} */ ...b) => b.join(" | ");
  const hold = (/** @type {string} */ c) => `${c} - - - - - - - - - - - - - - -`;
  const half = (/** @type {string} */ a, /** @type {string} */ b) => `${a} - - - - - - - ${b} - - - - - - -`;
  /** the heart: two beats on the root, then a rest @param {string} n */
  const beat = (n) => `${n} . ${n} . . . . . . . . . . . . .`;
  /** a cold arpeggio over four notes @param {string[]} n */
  const arp = (n) => `${n[0]} ${n[1]} ${n[2]} ${n[3]} ${n[2]} ${n[1]} ${n[0]} ${n[1]} ${n[2]} ${n[3]} ${n[2]} ${n[3]} ${n[2]} ${n[1]} ${n[2]} ${n[1]}`;
  const Dm7 = "D3+F3+A3+C4", Bbmaj7 = "Bb2+D3+F3+A3", Gm9 = "G2+Bb2+F3+A3", Asus = "A2+D3+E3+A3", A7 = "A2+C#3+G3+E4", Cmaj = "C3+E3+G3+B3";
  const DRUMS = { kick: "x . . . . . . . . . x . . . . .", snare: ". . . . . . . . X . . . . . . .", hat: ". . x . . . x . . . x . . . x ." };

  Cutaway.score.theme("juno", {
    tempo: 72, key: "D",
    tracks: {
      theme: { inst: "epiano" }, pad: { inst: "cs80pad" }, heart: { inst: "heart" },
      arp: { inst: "arp", layer: "arp" }, kick: { inst: "kick", layer: "drums" }, snare: { inst: "snare", layer: "drums" },
      hat: { inst: "hat", layer: "drums" }, lead: { inst: "cs80brass", layer: "lead" },
    },
    layers: { arp: [0.25, 0.45], drums: [0.45, 0.65], lead: [0.7, 0.9] },
    start: "intro",
    sections: {
      intro: { bars: 2, next: "a", tracks: { pad: bars(hold(Dm7), hold(Bbmaj7)), heart: bars(beat("D2"), beat("Bb1")) } },
      a: { bars: 4, next: "b", tracks: {
        ...DRUMS,
        theme: bars("A4 - - - . . F4 . E4 - D4 - . . . .", "F4 - - - . . D4 . C4 - D4 - - - . .", "Bb4 - - - . . A4 . G4 - F4 - . . D4 .", "E4 - - - - - - - C#4 - - - - - - ."),
        pad: bars(hold(Dm7), hold(Bbmaj7), hold(Gm9), half(Asus, A7)),
        heart: bars(beat("D2"), beat("Bb1"), beat("G1"), beat("A1")),
        arp: bars(arp(["D4", "F4", "A4", "C5"]), arp(["Bb3", "D4", "F4", "A4"]), arp(["G3", "Bb3", "D4", "A4"]), arp(["A3", "C#4", "E4", "A4"])),
        lead: bars(hold("D5"), half("F5", "E5"), half("D5", "Bb4"), hold("A4")),
      } },
      b: { bars: 4, next: "a", exits: [2, 4], tracks: {
        ...DRUMS,
        theme: bars("D5 - - - . . C5 . Bb4 - A4 - . . . .", "G4 - - - . . E4 . C4 - E4 - G4 - . .", "F4 - - - . . E4 . D4 - A3 - . . . .", "C#4 - - - - - - - E4 - - - G4 - - -"),
        pad: bars(hold(Bbmaj7), hold(Cmaj), hold(Dm7), hold(A7)),
        heart: bars(beat("Bb1"), beat("C2"), beat("D2"), beat("A1")),
        arp: bars(arp(["Bb3", "D4", "F4", "A4"]), arp(["C4", "E4", "G4", "B4"]), arp(["D4", "F4", "A4", "C5"]), arp(["A3", "C#4", "E4", "G4"])),
        lead: bars(half("F5", "D5"), half("E5", "G5"), half("F5", "A5"), hold("E5")),
      } },
    },
  });

  Cutaway.score.theme("glass", {
    tempo: 72, key: "D",
    tracks: { drone: { inst: "drone" }, bell: { inst: "glassbell" }, pulse: { inst: "pulse", layer: "pulse" } },
    layers: { pulse: [0.4, 0.7] },
    sections: {
      a: { bars: 4, tracks: {
        drone: bars(hold("D2+A2"), hold("D2+A2"), hold("D2+Bb2"), hold("D2+A2")),
        bell: bars("A5 . . . . . . . . . . . . . . .", ". . . . . . . . . . . . . . . .", ". . . . . . . . F5 . . . . . . .", ". . . . . . . . . . . . E5 . . ."),
        pulse: bars("D2 . . . D2 . . . D2 . . . D2 . . .", "D2 . . . D2 . . . D2 . . . D2 . . .", "D2 . . . D2 . . . D2 . . . D2 . . .", "D2 . . . D2 . . . D2 . . . C2 . C#2 ."),
      } },
    },
  });

  // ---------------------------------------------------------------- the swamps: the ride on Pike's raft and Lantern's lights
  // Mystical and calm (the user's wish, 2026-11-16): D Dorian at 56 bpm, a low drone on D, a soft pad drifting through Dsus2, F over C,
  // G over D and A minor, a breathy flute that sings a little and stops again, a bell now and then like a lantern seen through the trees.
  I("sumpf_pad", { type: "sub", wave: "triangle", voices: 3, detune: 9, filter: { cutoff: 520, q: 1 }, amp: { a: 2.2, d: 1, s: 0.9, r: 3.5 }, gain: 0.05, reverb: 0.8 });
  I("sumpf_flute", { type: "sub", wave: "sine", amp: { a: 0.35, d: 0.6, s: 0.75, r: 1.6 }, vibrato: { rate: 4.8, depth: 11, delay: 0.5, rise: 0.8 },
    bend: { from: -40, time: 0.2 }, gain: 0.07, reverb: 0.75, delay: 0.35, pan: -0.1 });
  Cutaway.score.theme("sumpf", {
    tempo: 56, key: "D",
    tracks: { drone: { inst: "drone" }, pad: { inst: "sumpf_pad" }, flute: { inst: "sumpf_flute" }, bell: { inst: "glassbell" } },
    sections: {
      a: { bars: 4, next: "b", tracks: {
        drone: bars(hold("D2+A2"), hold("D2+A2"), hold("D2+G2"), hold("D2+A2")),
        pad: bars(hold("D3+A3+E4"), hold("C3+F3+A3+E4"), hold("D3+G3+B3"), hold("C3+E3+A3")),
        flute: bars(". . . . A4 - - - - - - - E5 - D5 -", "C5 - - - - - - - . . . . . . . .", "B4 - - - D5 - - - A4 - - - - - - -", ". . . . . . . . . . . . . . . ."),
        bell: bars(". . . . . . . . . . . . . . . .", ". . . . . . . . . . . . B5 . . .", ". . . . . . . . . . . . . . . .", ". . . . . . . . E6 . . . . . . ."),
      } },
      b: { bars: 4, next: "a", tracks: {
        drone: bars(hold("D2+A2"), hold("D2+A2"), hold("D2+G2"), hold("D2+A2")),
        pad: bars(hold("D3+A3+E4"), hold("Bb2+F3+A3+D4"), hold("C3+G3+E4"), hold("D3+A3+E4")),
        flute: bars(". . . . . . . . . . . . . . . .", "F5 - - - E5 - - - D5 - - - - - - -", ". . . . . . . . C5 - B4 - A4 - - -", "- - - - - - - - . . . . . . . ."),
        bell: bars(". . . . . . . . A5 . . . . . . .", ". . . . . . . . . . . . . . . .", ". . . . . . . . . . . . . . . .", ". . . . . . . . . . . . D6 . . ."),
      } },
    },
  });

  // ---------------------------------------------------------------- memory: the old photo on the deck
  // Juno and Teo as children on the roof (art/ui/deck_wallpaper.px.js). In the line of Vangelis's Blade
  // Runner, our own tune: a pedal D under everything; wide CS-80 brass swelling up over seconds; a lead
  // that scoops up into every note from below (the ribbon) with a vibrato that comes late and deepens;
  // far thunder falling into a long hall; crystal bells; a soft Rhodes breaking the chords. The Dorian
  // sixth (B) keeps it between sad and warm. 56 bpm, the same key as Juno's theme.
  I("br_brass", { type: "sub", wave: "saw", voices: 4, detune: 22, filter: { cutoff: 380, env: 1500, a: 1.8, decay: 2.5, sustain: 0.55, q: 2.2 },
    amp: { a: 1.4, d: 2, s: 0.85, r: 5 }, bend: { from: -25, time: 1.2 }, vibrato: { rate: 3.2, depth: 7, delay: 1.5, rise: 2 }, gain: 0.055, reverb: 0.2, hall: 0.75 });
  I("br_ribbon", { type: "sub", wave: "saw", voices: 2, detune: 9, filter: { cutoff: 600, env: 2200, a: 0.7, decay: 1.6, sustain: 0.65, q: 3 },
    amp: { a: 0.35, d: 0.9, s: 0.9, r: 3 }, bend: { from: -180, time: 0.32 }, vibrato: { rate: 4.6, depth: 26, delay: 0.7, rise: 1.6 },
    gain: 0.07, reverb: 0.15, hall: 0.8, delay: 0.32, pan: 0.1 });
  I("br_bells", { type: "fm", ratio: 3.51, index: 2.2, indexDecay: 1.8, amp: { a: 0.002, d: 3.5, s: 0, r: 3 }, gain: 0.045, hall: 0.9, delay: 0.45, pan: -0.25 });
  I("br_rhodes", { type: "fm", ratio: 1, index: 0.7, indexDecay: 1.1, amp: { a: 0.008, d: 2.8, s: 0.12, r: 2 }, bend: { from: -8, time: 0.05 },
    vibrato: { rate: 5.2, depth: 5, delay: 0.1, rise: 0.6 }, gain: 0.1, reverb: 0.3, hall: 0.5, delay: 0.25, pan: -0.12 });
  I("br_pedal", { type: "sub", wave: "sine", filter: { cutoff: 160, q: 0.7 }, amp: { a: 2.5, d: 2, s: 1, r: 5 }, gain: 0.32, hall: 0.15 });
  I("br_thunder", { type: "drum", kind: "tom", tune: 0.32, decay: 2.2, gain: 0.5, hall: 1 });
  /** slow broken chords: eighths over four notes @param {string[]} n */
  const slow = (n) => `${n[0]} . ${n[1]} . ${n[2]} . ${n[3]} . ${n[2]} . ${n[1]} . ${n[2]} . ${n[3]} .`;
  const empty = ". . . . . . . . . . . . . . . .";
  const mDm9 = "D3+A3+E4+F4", Dadd9 = "D3+A3+E4+F4+B4", BbM7 = "Bb2+D3+F3+A3+E4", Gm9D = "D3+G3+Bb3+F4+A4", A7sus = "A2+D3+E3+G3", mA7 = "A2+C#3+E3+G3",
    FC = "C3+F3+A3+E4", Cadd9 = "C3+G3+D4+E4", Bbmaj9 = "Bb2+F3+A3+C4+D4";
  Cutaway.score.theme("memory", {
    tempo: 56, key: "D",
    tracks: { brass: { inst: "br_brass" }, lead: { inst: "br_ribbon" }, bells: { inst: "br_bells" }, rhodes: { inst: "br_rhodes" },
      pedal: { inst: "br_pedal" }, thunder: { inst: "br_thunder" } },
    start: "intro",
    sections: {
      // two bars of swelling brass and a bell; the lead's pickup in the second bar leads into the tune
      intro: { bars: 2, next: "a", tracks: {
        brass: bars(hold(mDm9), hold(Dadd9)),
        pedal: bars(hold("D1"), hold("D1")),
        thunder: bars("x . . . . . . . . . . . . . . .", empty),
        bells: bars(". . . . . . . . A6 . . . . . . .", ". . . . E6 . . . . . . . . . . ."),
        lead: bars(empty, ". . . . . . . . D4 - - - E4 - F4 -"),
      } },
      a: { bars: 4, next: "b", tracks: {
        brass: bars(hold(mDm9), hold(BbM7), hold(Gm9D), half(A7sus, mA7)),
        pedal: bars(hold("D1"), hold("D1"), hold("D1"), hold("A0")),
        lead: bars("A4 - - - - - - - - - - - D5 - - -", "F5 - - - - - - - E5 - - - - - D5 -", "D5 - - - - - - - C5 - - - Bb4 - - -", "A4 - - - - - - - - - - - - - - -"),
        bells: bars(empty, ". . . . . . . . . . . . A6 . . .", empty, ". . . . . . . . C#6 . . . E6 . . ."),
        thunder: bars("x . . . . . . . . . . . . . . .", empty, empty, empty),
      } },
      b: { bars: 4, next: "a", exits: [2, 4], tracks: {
        brass: bars(hold(FC), hold(Cadd9), hold(Bbmaj9), half(A7sus, mA7)),
        pedal: bars(hold("F1"), hold("C1"), hold("Bb0"), hold("A0")),
        rhodes: bars(slow(["C4", "F4", "A4", "E5"]), slow(["C4", "G4", "D5", "E5"]), slow(["Bb3", "F4", "A4", "D5"]), slow(["A3", "D4", "E4", "G4"])),
        lead: bars("C5 - - - - - E5 - G5 - - - - - - -", "G5 - - - - - - - F5 - - - E5 - - -", "D5 - - - - - - - - - - - F5 - - -", "E5 - - - - - - - - - - - - - - -"),
        bells: bars(empty, empty, ". . . . . . . . . . . . . . . .", ". . . . . . . . . . . . B5 . . ."),
        thunder: bars(empty, ". . . . . . . . x . . . . . . .", empty, empty),
      } },
    },
  });

  // ---------------------------------------------------------------- opening: the intro's float over the sea
  // The neo-noir opening (game/intro.js), with the memory theme's instruments but its own tune: a pedal D under
  // everything the whole way (the city never lets go), wide brass swells over it, far thunder, bells like lights
  // on the water; the ribbon lead comes in once Nagi·wa is near, falling slowly from D to A. 56 bpm, D.
  const oDsus = "D3+A3+D4+E4", oDm = "D3+A3+C4+F4", oBb = "Bb2+F3+A3+D4", oC = "C3+G3+D4+E4", oGmD = "D3+G3+Bb3+D4", oAsus = "A2+D3+E3+G3";
  Cutaway.score.theme("opening", {
    tempo: 56, key: "D",
    tracks: { brass: { inst: "br_brass" }, lead: { inst: "br_ribbon" }, bells: { inst: "br_bells" }, pedal: { inst: "br_pedal" }, thunder: { inst: "br_thunder" } },
    start: "intro",
    sections: {
      intro: { bars: 3, next: "a", tracks: {
        brass: bars(hold(oDsus), hold(oDm), hold(oDsus)),
        pedal: bars(hold("D1"), hold("D1"), hold("D1")),
        thunder: bars("x . . . . . . . . . . . . . . .", empty, ". . . . . . . . x . . . . . . ."),
        bells: bars(". . . . . . . . A6 . . . . . . .", ". . . . . . . . . . . . E6 . . .", ". . . . D6 . . . . . . . . . . ."),
      } },
      a: { bars: 4, next: "a", tracks: {
        brass: bars(hold(oBb), hold(oC), hold(oGmD), hold(oAsus)),
        pedal: bars(hold("D1"), hold("D1"), hold("D1"), hold("D1")),
        lead: bars("D5 - - - - - - - - - - - A4 - - -", "C5 - - - - - - - - - - - - - - -", "Bb4 - - - - - - - A4 - - - G4 - - -", "A4 - - - - - - - - - - - - - - -"),
        bells: bars(empty, ". . . . . . . . . . . . E6 . . .", empty, ". . . . . . . . A6 . . . . . . ."),
        thunder: bars("x . . . . . . . . . . . . . . .", empty, empty, empty),
      } },
    },
  });

  // ---------------------------------------------------------------- descent: the intro's ride down, no words, no sounds
  // The opening's instruments, slow against the rings rushing by. The ribbon falls from F5 to D4 over three bars with
  // one small lift on the way, and the chord under its end stays open (D with E against the lead's D): she has arrived
  // somewhere, and nothing is resolved. Then only the brass and the pedal, until the cut. 56 bpm, D.
  Cutaway.score.theme("descent", {
    tempo: 56, key: "D",
    tracks: { brass: { inst: "br_brass" }, lead: { inst: "br_ribbon" }, bells: { inst: "br_bells" }, pedal: { inst: "br_pedal" } },
    start: "ride",
    sections: {
      ride: { bars: 3, next: "tail", tracks: {
        brass: bars(half(oDm, oBb), half("G2+D3+Bb3+F4", oAsus), hold(oDsus)),
        pedal: bars(hold("D1"), hold("D1"), hold("D1")),
        lead: bars("F5 - - - - - - - E5 - - - - - D5 -", "A4 - - - - - - - Bb4 - - - A4 - G4 -", "F4 - - - - - E4 - D4 - - - - - - -"),
        bells: bars(". . . . . . . . A6 . . . . . . .", ". . . . . . . . . . . . E6 . . .", ". . . . . . . . D6 . . . . . . ."),
      } },
      tail: { bars: 2, next: "tail", tracks: { brass: bars(hold(oDsus), hold(oDsus)), pedal: bars(hold("D1"), hold("D1")) } },
    },
  });

  // ---------------------------------------------------------------- the radio's stations (game/radio.js), heard through its speaker
  // NAGI·WA EASY: the company's own station, music to wait to. Smooth and bright and about nothing: F major, a soft
  // electric piano on the off-beats, a vibraphone tune that goes up and comes back, a round bass, a shaker. 88 bpm.
  I("vibes", { type: "fm", ratio: 4, index: 0.55, indexDecay: 1.4, amp: { a: 0.003, d: 1.3, s: 0.08, r: 0.9 }, gain: 0.075, reverb: 0.45, delay: 0.18, pan: 0.15 });
  I("softbass", { type: "sub", wave: "sine", filter: { cutoff: 380, q: 0.8 }, amp: { a: 0.01, d: 0.45, s: 0.45, r: 0.2 }, gain: 0.3 });
  I("shaker", { type: "drum", kind: "hat", gain: 0.045, pan: -0.25 });
  const eF = "F3+A3+C4+E4", eD = "D3+F3+A3+C4", eG = "G3+Bb3+D4+F4", eC = "E3+G3+Bb3+C4", eBb = "Bb2+D3+F3+A3", eA = "A2+C#3+E3+G3";
  /** the piano on two and four @param {string} c */
  const comp = (c) => `. . . . ${c} - . . . . . . ${c} - . .`;
  const SHAKE = ". . x . . . x . . . x . . . x x";
  Cutaway.score.theme("easy", {
    tempo: 88, key: "F",
    tracks: { keys: { inst: "epiano" }, vibes: { inst: "vibes" }, bass: { inst: "softbass" }, shaker: { inst: "shaker" } },
    sections: {
      a: { bars: 4, next: "b", tracks: {
        keys: bars(comp(eF), comp(eD), comp(eG), comp(eC)),
        bass: bars("F2 - - - . . C2 - F2 - - - . . A2 -", "D2 - - - . . A2 - D2 - - - . . F2 -", "G2 - - - . . D2 - G2 - - - . . Bb2 -", "C2 - - - . . G2 - C2 - - - E2 - G2 -"),
        vibes: bars("A4 - - - C5 - - - E5 - D5 - C5 - - -", "D5 - - - A4 - - - F4 - - - - - - -", "G4 - - - Bb4 - - - D5 - C5 - Bb4 - - -", "A4 - - - - - - - G4 - - - - - - -"),
        shaker: bars(SHAKE, SHAKE, SHAKE, SHAKE),
      } },
      b: { bars: 4, next: "a", tracks: {
        keys: bars(comp(eBb), comp(eA), comp(eD), comp(eC)),
        bass: bars("Bb1 - - - . . F2 - Bb1 - - - . . D2 -", "A1 - - - . . E2 - A1 - - - . . C#2 -", "D2 - - - . . A2 - D2 - - - . . C2 -", "C2 - - - . . G2 - C2 - - - . . . ."),
        vibes: bars("D5 - - - F5 - - - E5 - D5 - C5 - - -", "C#5 - - - - - - - A4 - - - - - - -", "F5 - - - E5 - - - D5 - C5 - A4 - - -", "G4 - - - - - - - - - - - . . . ."),
        shaker: bars(SHAKE, SHAKE, SHAKE, SHAKE),
      } },
    },
  });

  // KESSEL ROOFTOP: somebody in the block plays records late at night. Slow and warm and a little worn: D Dorian, the
  // Rhodes breaking jazz chords, a lazy beat (the snare late in the bar), a walking bass, and the needle's crackle. 70 bpm.
  I("lofikick", { type: "drum", kind: "kick", decay: 0.35, gain: 0.42 });
  I("lofisnare", { type: "drum", kind: "snare", gate: 0.2, gain: 0.16, reverb: 0.25 });
  I("crackle", { type: "drum", kind: "hat", gain: 0.018, pan: 0.1 });
  I("lofibass", { type: "sub", wave: "triangle", filter: { cutoff: 300, q: 1 }, amp: { a: 0.01, d: 0.5, s: 0.4, r: 0.25 }, gain: 0.28 });
  const LOFI = { kick: "x . . . . . . x . . x . . . . .", snare: ". . . . . . . . . X . . . . . .", crackle: "x . . x . . . . . x . x . . . x" };
  Cutaway.score.theme("rooftop", {
    tempo: 70, key: "D",
    tracks: { rhodes: { inst: "br_rhodes" }, bass: { inst: "lofibass" }, kick: { inst: "lofikick" }, snare: { inst: "lofisnare" }, crackle: { inst: "crackle" } },
    sections: {
      a: { bars: 4, tracks: {
        ...LOFI,
        rhodes: bars(slow(["E3", "G3", "D4", "F#4"]), slow(["A2", "G3", "C#4", "F#4"]), slow(["D3", "F#3", "C#4", "E4"]), slow(["B2", "A3", "D4", "F#4"])),
        bass: bars("E2 - - - . . B2 - G2 - - - . . . .", "A1 - - - . . E2 - G2 - - - . . . .", "D2 - - - . . A2 - F#2 - - - . . . .", "B1 - - - . . F#2 - A2 - - - . . . ."),
      } },
    },
  });

  // GLASS GIRL: NINTH FM's song about a Glasser, the karaoke machine's in LUCKY STATIC (game/karaoke.js). A small pop song: E minor,
  // the four chords everybody knows (Em C G D), a straight beat, a bass in eighths, a pad; a bright lead plays the tune the words go
  // to, two bars a line: the verse four lines, the chorus two, then round again. 104 bpm.
  I("glasslead", { type: "sub", wave: "pulse", pulseWidth: 0.35, filter: { cutoff: 1800, env: 1400, decay: 0.18, q: 2 },
    amp: { a: 0.008, d: 0.25, s: 0.55, r: 0.18 }, vibrato: { rate: 5.5, depth: 6, delay: 0.25 }, gain: 0.075, reverb: 0.35, delay: 0.22, pan: 0.05 });
  I("popbass", { type: "sub", wave: "saw", filter: { cutoff: 420, env: 500, decay: 0.12, q: 2 }, amp: { a: 0.004, d: 0.2, s: 0.35, r: 0.1 }, gain: 0.16 });
  const gEm = "E3+G3+B3", gC = "C3+E3+G3", gG = "G2+B2+D3", gD = "D3+F#3+A3";
  /** the bass in eighths on a root @param {string} n */
  const eighths = (n) => `${n} . ${n} . ${n} . ${n} . ${n} . ${n} . ${n} . ${n} .`;
  const POP = { kick: "x . . . x . . . x . . . x . . .", snare: ". . . . X . . . . . . . X . . .", hat: ". . x . . . x . . . x . . . x ." };
  const popDrums = (/** @type {number} */ n) => Object.fromEntries(Object.entries(POP).map(([k, p]) => [k, bars(...Array(n).fill(p))]));
  Cutaway.score.theme("glassgirl", {
    tempo: 104, key: "E",
    tracks: { lead: { inst: "glasslead" }, pad: { inst: "cs80pad" }, bass: { inst: "popbass" }, kick: { inst: "kick" }, snare: { inst: "snare" }, hat: { inst: "hat" } },
    sections: {
      // "Sie sitzt im Dunkeln, zehn Schirme im Raum, / die ganze Stadt ist ihr offener Traum. / Sie sieht dich im Regen, sie sieht dich im Licht, / nur sich selber sieht sie nicht."
      verse: { bars: 8, next: "chorus", tracks: {
        lead: bars(
          ". E4 - E4 G4 - G4 A4 - G4 - E4 - D4 - .", "E4 - G4 - B4 - A4 - G4 - - - . . . .",
          ". E4 - E4 G4 - G4 A4 - G4 - E4 - D4 - .", "C4 - E4 - G4 - E4 - D4 - - - . . . .",
          ". D4 - D4 G4 - G4 B4 - A4 - G4 - D4 - .", "D4 - G4 - B4 - D5 - B4 - - - . . . .",
          ". A4 - A4 B4 - A4 F#4 - D4 - - - . . .", "F#4 - - - A4 - - - D4 - - - . . . ."),
        pad: bars(hold(gEm), hold(gEm), hold(gC), hold(gC), hold(gG), hold(gG), hold(gD), hold(gD)),
        bass: bars(eighths("E2"), eighths("E2"), eighths("C2"), eighths("C2"), eighths("G1"), eighths("G1"), eighths("D2"), eighths("D2")),
        ...popDrums(8),
      } },
      // "Glass Girl, Glass Girl, wer schaut dir zu? / Die ganze Stadt schläft, nur nicht du."
      chorus: { bars: 4, next: "verse", tracks: {
        lead: bars("B4 - - G4 B4 - - G4 A4 - G4 - E4 - - .", "G4 - A4 - B4 - - - . . . . . . . .",
          "D5 - B4 - A4 - G4 - A4 - B4 - D5 - - .", "B4 - - - A4 - - - G4 - - - - - - ."),
        pad: bars(hold(gEm), hold(gC), hold(gG), hold(gD)),
        bass: bars(eighths("E2"), eighths("C2"), eighths("G1"), eighths("D2")),
        ...popDrums(4),
      } },
    },
  });

  // WOK RADIO: the radio on HOT WOK's counter in the Drain Market (kapitel1-design §9: the market has no music of its own, only this,
  // heard at its place). An old pop song off a worn tape, a little crooked: A minor pentatonic, a bowed lead like an erhu with a wide
  // vibrato, a cheap organ on the off-beats, a plucked bass, a rhythm box; everything sways a few cents (the tape), and the lead lands
  // a hair sharp on its long notes. 96 bpm. The room plays it through a small speaker (speaker: 1).
  I("erhu", { type: "sub", wave: "saw", voices: 2, detune: 22, filter: { cutoff: 1500, env: 900, a: 0.08, decay: 0.5, sustain: 0.6, q: 3 },
    amp: { a: 0.06, d: 0.3, s: 0.75, r: 0.25 }, vibrato: { rate: 6.2, depth: 28, delay: 0.18, rise: 0.3 }, bend: { from: -60, time: 0.12 }, gain: 0.07, reverb: 0.3, pan: -0.05 });
  I("cheaporgan", { type: "sub", wave: "square", voices: 2, detune: 18, filter: { cutoff: 1100, q: 1 }, amp: { a: 0.005, d: 0.12, s: 0.3, r: 0.08 },
    vibrato: { rate: 0.7, depth: 12 }, gain: 0.035, pan: 0.15 });
  I("pluckbass", { type: "pluck", gain: 0.3, decay: 0.985, bright: 0.35 });
  I("rimshot", { type: "drum", kind: "snare", gate: 0.08, gain: 0.12 });
  I("boxkick", { type: "drum", kind: "kick", decay: 0.25, gain: 0.4 });
  const WOKBEAT = { kick: "x . . x . . x . x . . x . . x .", rim: ". . . . x . . . . . . . x . . x", shaker: "x x . x x x . x x x . x x x . x" }
  const wokBeat = (/** @type {number} */ n) => ({ kick: bars(...Array(n).fill(WOKBEAT.kick)), rim: bars(...Array(n).fill(WOKBEAT.rim)), shaker: bars(...Array(n).fill(WOKBEAT.shaker)) });
  const offs = (/** @type {string} */ c) => `. . ${c} . . . ${c} . . . ${c} . . . ${c} .`;
  Cutaway.score.theme("wokradio", {
    tempo: 96, key: "A",
    tracks: { lead: { inst: "erhu" }, organ: { inst: "cheaporgan" }, bass: { inst: "pluckbass" }, kick: { inst: "boxkick" }, rim: { inst: "rimshot" }, shaker: { inst: "shaker" } },
    sections: {
      a: { bars: 8, next: "b", tracks: {
        lead: bars("A4 - - - C5 - D5 - E5 - - - - - . .", "G5 - E5 - D5 - C5 - D5 - - - - - . .", "E5 - - - G5 - A5 - G5 - E5 - D5 - - -", "E5 - - - - - - - - - - - . . . .",
          "A4 - - - C5 - D5 - E5 - - - G5 - . .", "A5 - G5 - E5 - D5 - C5 - - - D5 - . .", "E5 - D5 - C5 - A4 - G4 - - - A4 - - -", "A4 - - - - - - - - - - - . . . ."),
        organ: bars(offs("A3+C4+E4"), offs("G3+C4+E4"), offs("C4+E4+G4"), offs("E3+G3+B3"), offs("A3+C4+E4"), offs("F3+A3+C4"), offs("G3+B3+D4"), offs("A3+C4+E4")),
        bass: bars("A2 . . A2 . . E2 . A2 . . A2 . . G2 .", "G2 . . G2 . . D2 . G2 . . G2 . . A2 .", "C3 . . C3 . . G2 . C3 . . C3 . . D3 .", "E2 . . E2 . . B2 . E2 . . E2 . . G2 .",
          "A2 . . A2 . . E2 . A2 . . A2 . . G2 .", "F2 . . F2 . . C3 . F2 . . F2 . . E2 .", "G2 . . G2 . . D2 . G2 . . G2 . . E2 .", "A2 . . A2 . . E2 . A2 . . . . . . ."),
        ...wokBeat(8),
      } },
      b: { bars: 4, next: "a", tracks: {
        lead: bars("C5 - - - D5 - E5 - G5 - - - A5 - - -", "G5 - E5 - D5 - E5 - - - - - . . . .", "D5 - - - E5 - G5 - E5 - D5 - C5 - - -", "D5 - - - - - - - . . . . . . . ."),
        organ: bars(offs("F3+A3+C4"), offs("C4+E4+G4"), offs("D3+F3+A3"), offs("E3+G#3+B3")),
        bass: bars("F2 . . F2 . . C3 . F2 . . F2 . . E2 .", "C3 . . C3 . . G2 . C3 . . C3 . . B2 .", "D2 . . D2 . . A2 . D2 . . D2 . . F2 .", "E2 . . E2 . . B2 . E2 . . G#2 . E2 . . ."),
        ...wokBeat(4),
      } },
    },
  });

  // THE MARKET'S ARRIVAL: Juno at the top of the stairs from the alley, the view down into the channel (the room drain_arrival,
  // kapitel1-design §9): two and a half seconds still, then the camera tilting down for nine. Four bars at 84 bpm are those eleven
  // and a half seconds: a low pedal on A and a wide pad under it all, glass bells like the neon coming on; from the second bar the
  // erhu of the wok's radio falls through the market's pentatonic, and as the camera comes to rest the chord opens out wide over a
  // deep boom (the market below, all of it). Then a quiet bar that holds while Juno and EVI talk, the first time. The market's
  // murmur rises under it as the camera comes down (the room's ambience, placed at the picture's foot); in the market the wok's radio
  // takes over at its place.
  const TIE = "- - - - - - - - - - - - - - - -";                      // the note before held on through a whole bar
  Cutaway.score.theme("markt_ankunft", {
    tempo: 84, key: "A",
    tracks: { pad: { inst: "br_brass" }, wide: { inst: "cs80pad" }, lead: { inst: "erhu" }, bells: { inst: "br_bells" }, pedal: { inst: "br_pedal" }, boom: { inst: "br_thunder" } },
    start: "reveal",
    sections: {
      // the still view: only the pedal and the bells; the tilt: the pad comes in under the erhu; the rest: everything opens out
      reveal: { bars: 4, next: "rest", tracks: {
        pedal: bars(hold("A1"), TIE, TIE, TIE),
        pad: bars(empty, hold("F2+C3+A3"), hold("G2+D3+B3"), hold("A2+E3+A3+C4+E4")),
        wide: bars(empty, empty, ". . . . . . . . G3+D4 - - - - - - -", hold("A3+C4+E4+G4+B4")),
        lead: bars(empty, "E5 - - - - - - - D5 - - - C5 - - -", "D5 - - - - - - - E5 - - - G5 - - -", "A5 - - - - - - - - - - - - - - -"),
        bells: bars(". . . . . . . . E6 . . . . . . .", ". . . . A6 . . . . . . . . . E6 .", ". . . . . . . . G6 . . . . . . .", "A6 . . . . . . . E6 . . . C7 . . ."),
        boom: bars(empty, empty, empty, "x . . . . . . . . . . . . . . ."),
      } },
      // then quiet, while Juno and EVI talk (the first time)
      rest: { bars: 2, next: "rest", tracks: {
        pedal: bars(hold("A1"), TIE),
        wide: bars(hold("A3+C4+E4"), hold("F3+A3+C4")),
        bells: bars(". . . . . . . . E6 . . . . . . .", empty),
      } },
    },
  });

  // THE MARKET'S OTHER TUNES, each at its place in the Drain Market (game/stadt.js: sound loops with a theme, beside the wok's radio;
  // the user's wish, 2026-11-11). PACHINKO on the roof: a machine's jingle, bright and cheap, round and round in C, a square arpeggio
  // climbing and a bell on the win, 144 bpm, two bars. THE BUSKER by the middle bridge: an erhu alone over a plucked drone, slow and
  // sad in E minor pentatonic, 66 bpm, eight bars with breaths in them. (The rafts play the radio's stations: game/stadt.js.)
  Cutaway.score.theme("pachinko", {
    tempo: 144, key: "C",
    tracks: { arp: { inst: "arp" }, bell: { inst: "glassbell" } },
    sections: { a: { bars: 2, tracks: {
      arp: bars("C5 E5 G5 C6 E5 G5 C6 E6 G5 C6 E6 G6 E6 C6 G5 E5", "D5 F5 A5 D6 F5 A5 D6 F6 G5 B5 D6 G6 D6 B5 G5 D5"),
      bell: bars("C7 . . . . . . . . . . . . . . .", ". . . . . . . . G6 . . . C7 . . ."),
    } } },
  });
  Cutaway.score.theme("strassenmusik", {
    tempo: 66, key: "E",
    tracks: { lead: { inst: "erhu" }, drone: { inst: "pluckbass" } },
    sections: { a: { bars: 8, tracks: {
      lead: bars("E5 - - - - - G5 - A5 - - - B5 - - -", "A5 - - - G5 - E5 - - - - - . . . .", "D5 - - - E5 - G5 - E5 - D5 - B4 - - -", "E5 - - - - - - - - - - - . . . .",
        "B5 - - - D6 - B5 - A5 - - - G5 - - -", "A5 - G5 - E5 - - - D5 - - - . . . .", "E5 - - - G5 - A5 - G5 - E5 - D5 - B4 -", "E5 - - - - - - - - - - - - - . ."),
      drone: bars("E2 . . . . . . . B2 . . . . . . .", "E2 . . . . . . . B2 . . . . . . .", "D2 . . . . . . . A2 . . . . . . .", "E2 . . . . . . . B2 . . . . . . .",
        "G2 . . . . . . . D3 . . . . . . .", "A2 . . . . . . . E2 . . . . . . .", "D2 . . . . . . . A2 . . . . . . .", "E2 . . . . . . . B2 . . . E2 . . ."),
    } } },
  });

  Cutaway.score.stinger("clue", { inst: "glassbell", notes: "D6 A6 D7 - - -", key: "D" });
  Cutaway.score.stinger("witness", { inst: "cs80brass", notes: "D3+Eb3+A3 - - - - - - - - - - - - - - -", key: "D", stepsPerNote: 1 });
})();

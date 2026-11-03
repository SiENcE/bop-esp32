// Halcyon: the music (docs/style-guide.md §8a "Music", docs/kapitel0-design.md §9), synthesised with the
// engine (Cutaway.synth, Cutaway.score): dark synth in the line of Vangelis's Blade Runner and the SNES
// Shadowrun. Two themes at the same tempo and in the same key, so going into a camera and back stays in time:
//   juno   Juno's theme, D minor (Aeolian), 72 bpm: an electric piano carries the tune, a CS-80-like pad
//          holds the chords, the bass beats like a heart (two beats, a rest). With the intensity come a
//          cold arpeggio with echoes (layer "arp"), a sparse drum machine with a gated snare ("drums"),
//          and a CS-80 brass voice over it all ("lead"). On the deck it plays through the wall (speaker).
//   glas   the feeds: the theme steps back; a low drone on D, a glass bell now and then, the rain and
//          the camera's hiss (ambience) do the rest. With the intensity a slow pulse comes in ("pulse").
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

  Cutaway.score.theme("glas", {
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

  Cutaway.score.stinger("clue", { inst: "glassbell", notes: "D6 A6 D7 - - -", key: "D" });
  Cutaway.score.stinger("witness", { inst: "cs80brass", notes: "D3+Eb3+A3 - - - - - - - - - - - - - - -", key: "D", stepsPerNote: 1 });
})();

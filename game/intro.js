// Halcyon: the intro "Die letzte Schicht" (docs/kapitel0-design.md §5; storyboard art/test/intro_blocks.px.js).
// The sequence and what its shots share. The shots the game draws itself (the camera really moves through them)
// are rooms with `float: "<shot>"`: their files register a drawer in Halcyon.intro.shots (game/intro_sea.js: the
// float over the sea, A1 and A2; game/intro_tower.js: the tower and in through its window, C; game/intro_desk.js:
// what moves in shot 2), drawn over the
// room each frame; the action { float: [from, to], ms, ease } moves the camera through the shot (its progress
// Halcyon.intro.p, 0..1). The opening has no sounds, the music alone.
"use strict";

(function () {
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  Halcyon.intro = {
    /** The camera's progress through its shot, 0..1 (a tween moves it; a skip sets it at once). */
    p: 0,
    /** @type {Record<string, (ctx: CanvasRenderingContext2D, p: number, t: number) => void>} each shot's drawer */
    shots: {},
    /** The 4x4 Bayer threshold at a pixel, 0..1 (dithering for light falling off). @param {number} x @param {number} y */
    bay: (x, y) => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16,
    /** A hash of two integers, 0..1. @param {number} i @param {number} s */
    rnd(i, s) {
      let h = (i * 374761393 + s * 668265263) | 0;
      h = Math.imul(h ^ (h >>> 13), 1274126177);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
    },
    /** A rectangle of one colour. @param {CanvasRenderingContext2D} ctx @param {string} k @param {number} x @param {number} y @param {number} [w] @param {number} [h] */
    px(ctx, k, x, y, w = 1, h = 1) { ctx.fillStyle = k; ctx.fillRect(x, y, w, h); },
  };

  // { float: [from, to], ms, ease }: the camera moves through the shot (wait: false goes on at once)
  Cutaway.script.action("float", (s) => {
    const [from, to] = Array.isArray(s.float) ? s.float : [Halcyon.intro.p, Number(s.float)];
    Halcyon.intro.p = from;
    const done = Cutaway.tween.to({ key: "float", ms: s.ms, ease: s.ease ?? "linear", step: (k) => { Halcyon.intro.p = from + (to - from) * k; } });
    return s.wait === false ? undefined : done;
  });

  Cutaway.events.on("frame.screen", (/** @type {CanvasRenderingContext2D} */ ctx) => {
    const r = Cutaway.scene.room, shot = r?.float && Halcyon.intro.shots[r.float];
    if (shot) shot(ctx, Halcyon.intro.p, Cutaway.clock.time);
  });

  // The sequence: before the title on the first start, then from the title menu (game/game.js). For now the
  // opening (the float, the tower) only, to its own music (game/music.js: "opening").
  Cutaway.sequence("intro", {
    steps: [
      { shot: "a1" },
      { music: { stop: true, fade: 0.5 } },
      { fade: 1, ms: 0 },
      { goto: "intro_a1", transition: false },
      { letterbox: true, ms: 0 },
      { music: { theme: "opening", fade: 2 } },
      { float: [0, 1], ms: 16000, wait: false },
      { fade: 0, ms: 3000 },
      { wait: 2500 },
      { caption: "HALCYON, 2088", at: "bl", type: true, ms: 4000 },
      { wait: 5500 },
      { shot: "a2" },
      { goto: "intro_a2", transition: "dissolve" },
      { float: [0, 1], ms: 16000 },
      { shot: "c" },
      { goto: "intro_c", transition: "dissolve" },
      { float: [0, 1], ms: 10000, ease: "inOut" },
      // 1: the hall, the camera drifting down over the rows of desks towards the front
      { shot: "hall" },
      { goto: "intro_hall", transition: "dissolve" },
      { camera: [100, 20], ms: 0 },
      { caption: "2088-04-30  05:45", at: "bl", ms: 4000, wait: false },
      { camera: [20, 180], ms: 9000, ease: "inOut" },              // to the front row, Juno's desk (d31)
      { wait: 1000 },
      // 2: Juno at her desk, close: a man stops in her feed, she marks him
      { shot: "desk" },
      { goto: "intro_desk", transition: "dissolve" },
      { float: [0, 1], ms: 9000, wait: false },
      { wait: 5600 }, { sfx: "tag" },
      { wait: 3200 },
      // 3: the announcement over the hall; they go on working
      { shot: "announce" },
      { goto: "intro_hall", transition: "dissolve" },
      { camera: [100, 60], ms: 0 },
      { caption: "Ab morgen übernimmt die automatische Auswertung. Halcyon dankt Ihnen für Ihren Dienst.", at: "c", color: "#62def0", ms: 6500 },
      // 4: the screens go out, back to front, the camera going with them to Juno; hers is the last, close; her face
      // in the dead glass. Nothing to hear
      { shot: "out" },
      { music: { stop: true, fade: 3 } },
      { goto: "intro_hall_out", transition: false },
      { camera: [100, 60], ms: 0 },
      { camera: [20, 180], ms: 13000, ease: "inOut", wait: false },
      { float: [0, 1], ms: 13000 },
      { goto: "intro_desk_last", transition: false },
      { wait: 1800 },
      { sfx: "jack_out" },
      { goto: "intro_desk_dark", transition: false },
      { float: [0, 1], ms: 350 },
      { wait: 3500 },
      { fade: "out", ms: 1500 },
      { music: { stop: true, fade: 1.5 } },
    ],
  });
})();

// Halcyon: the intro "Die letzte Schicht" (docs/kapitel0-design.md §5; storyboard art/test/intro_blocks.px.js).
// The opening is one slow float, low over the lit sea to the tower (shots A1, A2). The game draws it in
// perspective, so the camera can really move: a camera CAM_H metres over the water looks along +Z, its horizon
// at the shot's `hz`; the lights on the water sit on a grid of 10 m cells (a cell's hash says whether it has a
// cluster of huts or rafts and how lit), the pumps' stacks stand at (X, Z), the drones hover at (X, Z, Y). The
// painted parts are in art/intro/float.px.js (the skies, Halcyon, the flames, the drone). A room says which
// shot it is (`float: "a1"`); the action { float: [from, to], ms } moves the camera through the shot's travel.
"use strict";

(function () {
  const W = 320, F = 160, CAM_H = 20, CELL = 10, NEAR = 16, FAR = 720;
  const C = {
    water: "#0f151f", ember: "#552b1c", amber: "#b0602a", warm: "#ffd58a", white: "#fff4d8", cold: "#617aa0", pink: "#ff4fd3",
    hot: "#eea040", steel: "#1a2337", steel2: "#232f47", steelLit: "#2f3e5a", beam: "#2f3e5a", beam2: "#41547a", pod: "#b9c6d8",
  };
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  const bay = (/** @type {number} */ x, /** @type {number} */ y) => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
  /** A hash of two integers, 0..1. @param {number} i @param {number} s */
  function rnd(i, s) {
    let h = (i * 374761393 + s * 668265263) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  /**
   * A shot of the float.
   * @typedef {{hz: number, sky: string, seed: number, travel: number, drift: number, lit: number,
   *   stacks: [number, number, number][], city?: boolean, drones?: [number, number, number, number][], pods?: [number, number, number][]}} FloatShot
   * stacks: [X, Z, height] in metres; drones: [X, Z, Y, the beam's sweep phase]; pods: [y, speed px/s, length]
   */
  /** @type {Record<string, FloatShot>} */
  const SHOTS = {
    a1: { hz: 62, sky: "intro_sky_a1", seed: 1, travel: 110, drift: 12, lit: 0.62,
      stacks: [[-150, 380, 40], [-70, 230, 44], [95, 290, 42], [125, 150, 40], [-95, 110, 46], [40, 470, 40], [230, 520, 38], [-30, 560, 40], [20, 200, 42]] },
    a2: { hz: 100, sky: "intro_sky_a2", seed: 2, travel: 90, drift: -8, lit: 0.55, city: true,
      stacks: [[-34, 70, 40], [40, 100, 42], [-110, 230, 40], [130, 270, 38], [-60, 420, 40], [80, 480, 38]],
      drones: [[-120, 330, 60, 0], [150, 420, 70, 2]], pods: [[34, 9, 6], [52, -6, 5]] },
  };

  /** The float's progress through its shot, 0..1 (a tween moves it; a skip sets it at once). */
  Halcyon.intro = { p: 0 };

  // { float: [from, to], ms, ease }: the camera moves through the shot (wait: false goes on at once)
  Cutaway.script.action("float", (s) => {
    const [from, to] = Array.isArray(s.float) ? s.float : [Halcyon.intro.p, Number(s.float)];
    Halcyon.intro.p = from;
    const done = Cutaway.tween.to({ key: "float", ms: s.ms, ease: s.ease ?? "linear", step: (k) => { Halcyon.intro.p = from + (to - from) * k; } });
    return s.wait === false ? undefined : done;
  });

  for (const id of Object.keys(SHOTS))
    Cutaway.room(`intro_${id}`, { name: "Intro", color: "#06080f", float: id, ambience: [{ sfx: "city_far", gain: 0.7 }] });

  /** @param {CanvasRenderingContext2D} ctx @param {string} k @param {number} x @param {number} y @param {number} [w] @param {number} [h] */
  function px(ctx, k, x, y, w = 1, h = 1) { ctx.fillStyle = k; ctx.fillRect(x, y, w, h); }

  /**
   * Draw a shot of the float at its progress.
   * @param {CanvasRenderingContext2D} ctx @param {FloatShot} s @param {number} p @param {number} t the clock (ms)
   */
  function draw(ctx, s, p, t) {
    const camZ = p * s.travel, camX = p * s.drift, hz = s.hz;
    /** Screen x, y of a world point, and its distance. @param {number} X @param {number} Z @param {number} [Y] */
    const proj = (X, Z, Y = 0) => { const z = Z - camZ; return [Math.round(160 + ((X - camX) * F) / z), Math.round(hz + ((CAM_H - Y) * F) / z), z]; };
    Cutaway.assets.draw(ctx, s.sky, 0, 0, { anchor: [0, 0] });
    if (s.city) Cutaway.assets.draw(ctx, "intro_halcyon", 160, hz, { t });
    for (const [y, v, len] of s.pods ?? []) {                                   // transit pods crossing the sky
      const x = Math.round((((t / 1000) * v) % (W + 40) + (W + 40)) % (W + 40)) - 20;
      px(ctx, C.pod, x, y, len); px(ctx, C.white, v > 0 ? x + len - 1 : x, y);
    }
    // the lights on the water: rows of cells from far to near; the farther, the fewer (they come out of the haze)
    const first = Math.ceil((camZ + NEAR) / CELL), last = Math.floor((camZ + FAR) / CELL);
    for (let row = last; row >= first; row--) {
      const Z0 = row * CELL, z = Z0 - camZ, span = Math.ceil(((z * 1.15) * W) / 2 / F / CELL) + 2, c0 = Math.floor(camX / CELL);
      const chance = Math.min(0.75, s.lit * Math.pow(140 / z, 0.4));
      for (let col = c0 - span; col <= c0 + span; col++) {
        const id = row * 7919 + col;
        if (rnd(id, s.seed) > chance) continue;
        const n = (1 + Math.floor(rnd(id, s.seed + 3) * 5)) * (z < 90 ? 3 : 1);   // near, a cell holds a few huts
        for (let j = 0; j < n; j++) {
          const X = col * CELL + rnd(id * 8 + j, s.seed + 4) * CELL, Z = Z0 + rnd(id * 8 + j, s.seed + 5) * CELL;
          const [x, y, zz] = proj(X, Z, rnd(id * 8 + j, s.seed + 6) * 4);
          if (zz < NEAR || x < -1 || x >= W || y <= hz || y >= 180) continue;
          const k0 = rnd(id * 8 + j, s.seed + 7);
          // a few lights go off and on, slowly
          if (k0 > 0.9 && rnd(id * 8 + j + Math.floor(t / 900), s.seed + 8) < 0.3) continue;
          const k = k0 < 0.7 ? C.warm : k0 < 0.84 ? C.white : k0 < 0.95 ? C.cold : C.pink;
          px(ctx, zz > 260 && k0 < 0.6 ? C.ember : zz > 140 && k0 < 0.35 ? C.amber : k, x, y, zz < 45 ? 2 : 1);
          if (zz < 110 && k0 < 0.6) px(ctx, C.ember, x, y + 1, 1, zz < 50 ? 2 : 1);   // its glint on the water
        }
      }
    }
    // the drones: their beams sweeping the water, then themselves
    for (const [X, Z, Y, ph] of s.drones ?? []) {
      const sweep = Math.sin(t / 1700 + ph) * 30, [dx, dy, dz] = proj(X + Math.sin(t / 2300 + ph) * 3, Z, Y);
      const [gx, gy] = proj(X + sweep, Z - 30), spread = Math.max(3, Math.round((24 * F) / (Z - 30 - camZ)));
      // the cone: light in the wet air, brightest along its middle, falling off to its edges (dithered)
      for (let y = dy + 3; y <= gy; y++) {
        const k = (y - dy) / Math.max(1, gy - dy), cx = dx + (gx - dx) * k, hw = 0.5 + spread * k;
        for (let x = Math.floor(cx - hw); x <= Math.ceil(cx + hw); x++) {
          const edge = 1 - Math.abs(x - cx) / (hw + 0.5);
          if (bay(x, y) < edge * (0.3 + 0.3 * k)) px(ctx, edge > 0.7 ? C.beam2 : C.beam, x, y);
        }
      }
      for (let x = -spread - 2; x <= spread + 2; x++) {                          // the pool it lights
        const yy = gy + Math.round(Math.sqrt(Math.max(0, 1 - (x / (spread + 2)) ** 2)) * 1.5);
        if (bay(gx + x, yy) < 0.6) px(ctx, Math.abs(x) < spread / 2 ? C.cold : C.beam2, gx + x, yy);
      }
      if (dz > 0) Cutaway.assets.draw(ctx, "intro_drone", dx, dy + 3, { t: t + ph * 300 });
    }
    // the stacks, far ones first: a column lit by its own flame from above, its rings; its flame on top and
    // the flame's streak on the water under it
    const order = s.stacks.slice().sort((a, b) => b[1] - a[1]);
    for (const [X, Z, top] of order) {
      const [x, y0, z] = proj(X, Z), [, y1] = proj(X, Z, top);
      if (z < 6) continue;
      const w = Math.max(2, Math.round((4 * F) / z)), l = x - (w >> 1);
      if (l > W || l + w < 0) continue;
      const reflect = Math.min(180 - y0, Math.round((y0 - y1) * 0.35));
      for (let y = 0; y < reflect; y++) for (let xx = 0; xx < Math.max(1, w >> 1); xx++)
        if (bay(l + (w >> 2) + xx, y0 + y) < 0.5 * (1 - y / reflect)) px(ctx, y < reflect / 3 ? C.amber : C.ember, l + (w >> 2) + xx, y0 + y);
      px(ctx, C.steel, l, y1, w, y0 - y1);
      px(ctx, C.steelLit, l, y1, 1, y0 - y1);
      px(ctx, "#131a2a", l + w - 1, y1, 1, y0 - y1);
      const band = Math.max(3, Math.round((4 * F) / z));
      for (let y = y1 + band; y < y0; y += band) px(ctx, C.steel2, l, y, w);
      const lit = Math.min(y0 - y1, Math.round(w * 1.5));                     // the flame's light down the column
      for (let y = 0; y < lit; y++) for (let xx = 0; xx < w; xx++) if (bay(l + xx, y1 + y) < 0.55 * (1 - y / lit)) px(ctx, C.ember, l + xx, y1 + y);
      px(ctx, C.steelLit, l - 1, y1, w + 2, 1);
      const size = Math.max(1, Math.min(5, Math.round(700 / z)));
      Cutaway.assets.draw(ctx, `intro_flame_${size}`, x, y1, { t: t + X * 37, scale: z < 40 ? 2 : 1 });
    }
  }

  Cutaway.events.on("frame.screen", (/** @type {CanvasRenderingContext2D} */ ctx) => {
    const r = Cutaway.scene.room;
    if (!r || !r.float || !SHOTS[r.float]) return;
    draw(ctx, SHOTS[r.float], Halcyon.intro.p, Cutaway.clock.time);
  });

  // The sequence: before the title on the first start, then from the title menu (game/game.js). For now the
  // opening float only.
  Cutaway.sequence("intro", {
    steps: [
      { shot: "a1" },
      { music: { stop: true, fade: 0.5 } },
      { fade: 1, ms: 0 },
      { goto: "intro_a1", transition: false },
      { letterbox: true, ms: 0 },
      { float: [0, 1], ms: 16000, wait: false },
      { fade: 0, ms: 3000 },
      { wait: 2500 },
      { caption: "HALCYON, 2088", at: "bl", type: true, ms: 4000 },
      { wait: 5500 },
      { shot: "a2" },
      { goto: "intro_a2", transition: "dissolve" },
      { float: [0, 1], ms: 16000 },
      { fade: "out", ms: 1500 },
    ],
  });
})();

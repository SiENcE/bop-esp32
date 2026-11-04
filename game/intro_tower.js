// Halcyon: the intro's shot C (docs/kapitel0-design.md §5; game/intro.js plays it): Halcyon Tower close, at
// 05:45; one floor's windows glow phosphor green (the observation hall), and the camera flies at one of them and in
// through it. Drawn here in perspective, in metres, so every edge stays a whole pixel as it grows: the facade is a
// plane D metres in front of the camera, the target window's middle at (0, 0); the camera starts D0 away and
// below the hall's floor and ends a metre from the glass, where the hall behind it (its wall of screens, the
// watchers at their desks against them) fills the screen.
"use strict";

(function () {
  const F = 160, D0 = 150, D1 = 0.9, LOW = -16;
  const C = {
    sky: "#06080f", facade: "#1a2337", slab: "#232f47", edge: "#2f3e5a", dark: "#131a2a", dim: "#2f3e5a", lit: "#617aa0",
    ink: "#0c0e1a", green: "#55a585", greenDim: "#266252", greenPale: "#8acfae", greenWhite: "#d4f7e2",
    cyan: "#1f88a4", cyanLit: "#62def0", red: "#ff3a3a", redDim: "#7e1420", deck: "#232f47",
  };
  const { bay, rnd, px } = Halcyon.intro;
  // the tower: 60 m wide, from the Krone's deck (Y -70) to its roof (Y 44); windows every 4 m across and up,
  // 2.8 x 2.2 m; the hall's floor at Y 0, its windows taller
  const TX = 30, TB = -70, TT = 44, STEP = 4, WW = 1.4, WH = 1.1, HALL_H = 1.5;

  Cutaway.room("intro_c", { name: "Intro", color: C.sky, float: "c" });

  Halcyon.intro.shots.c = (ctx, p, t) => {
    // the distance shrinks at a steady rate of zoom (geometric), so the push-in neither crawls nor leaps at the end
    const D = D0 * Math.pow(D1 / D0, p), camY = (LOW * (D - D1)) / (D0 - D1), k = F / D;   // a straight line to the window
    const sx = (/** @type {number} */ X) => 160 + X * k, sy = (/** @type {number} */ Y) => 90 - (Y - camY) * k;
    /**
     * A world rectangle `d` metres behind the facade (0: on it), clipped to a screen box (default: the screen).
     * @param {number} d @param {number} X0 @param {number} Y0 @param {number} X1 @param {number} Y1 @param {string} col @param {number[]} [clip]
     */
    const rectAt = (d, X0, Y0, X1, Y1, col, clip = [0, 0, 320, 180]) => {
      const kd = F / (D + d), ax = (/** @type {number} */ X) => 160 + X * kd, ay = (/** @type {number} */ Y) => 90 - (Y - camY) * kd;
      const l = Math.max(clip[0], Math.round(ax(X0))), r = Math.min(clip[0] + clip[2], Math.round(ax(X1)));
      const tp = Math.max(clip[1], Math.round(ay(Y1))), b = Math.min(clip[1] + clip[3], Math.round(ay(Y0)));
      if (r > l && b > tp) px(ctx, col, l, tp, r - l, b - tp);
      return [l, tp, Math.max(0, r - l), Math.max(0, b - tp)];
    };
    const rect = (/** @type {number} */ X0, /** @type {number} */ Y0, /** @type {number} */ X1, /** @type {number} */ Y1, /** @type {string} */ col, /** @type {number[]} */ clip) =>
      rectAt(0, X0, Y0, X1, Y1, col, clip);
    Cutaway.assets.draw(ctx, "intro_sky_a1", 0, 0, { anchor: [0, 0] });
    // the Krone's deck under the tower, its row of cyan lights
    rect(-400, TB - 4, 400, TB, C.deck);
    for (let X = -396; X < 400; X += 6) rect(X, TB - 2, X + 1.2, TB - 1.2, (X / 6) % 3 ? C.cyan : C.cyanLit);
    // the mast and the ring logo over the roof, its red light
    rect(-0.6, TT, 0.6, TT + 18, C.slab);
    rect(-5, TT + 18, 5, TT + 21, C.cyan); rect(-3, TT + 18.8, 3, TT + 20.2, C.ink);
    rect(-0.6, TT + 22, 0.6, TT + 23.2, Math.floor(t / 400) % 3 === 0 ? C.red : C.redDim);
    // the facade, its lit edge, the floors' slabs
    rect(-TX, TB, TX, TT, C.facade);
    rect(-TX, TB, -TX + 0.6, TT, C.edge);
    const jMin = Math.ceil((TB + 2) / STEP), jMax = Math.floor((TT - 2) / STEP);
    for (let j = jMin; j <= jMax + 1; j++) rect(-TX, j * STEP - 2.2, TX, j * STEP - 1.9, C.slab);
    // the hall's light on the facade round its windows, falling off (dithered)
    const hy0 = Math.round(sy(HALL_H + 1.2)), hy1 = Math.round(sy(-HALL_H - 1.2));
    const hl = Math.max(0, Math.round(sx(-TX))), hr = Math.min(320, Math.round(sx(TX)));
    for (let y = Math.max(0, hy0); y < Math.min(180, hy1); y++) {
      const d = Math.abs(y - sy(0)) / Math.max(1, (hy1 - hy0) / 2);
      for (let x = hl; x < hr; x++) if (bay(x, y) < (1 - d) * 0.3) px(ctx, C.greenDim, x, y);
    }
    // the windows: dark at this hour, a few lit; the hall's green
    for (let j = jMin; j <= jMax; j++) for (let i = -7; i <= 7; i++) {
      const X = i * STEP, Y = j * STEP, hall = j === 0, hh = hall ? HALL_H : WH;
      const box = rect(X - WW, Y - hh, X + WW, Y + hh, hall ? C.green : C.dark);
      if (box[2] <= 0 || box[3] <= 0) continue;
      if (!hall) {
        const q = rnd(i * 97 + j, 5);
        if (q < 0.12) rect(X - WW, Y - hh, X + WW, Y + hh, q < 0.03 ? C.lit : C.dim);
        continue;
      }
      if (box[2] < 6) { rect(X - WW, Y + hh * 0.3, X + WW, Y + hh, C.greenPale); continue; }
      inside(box, X);
    }

    /**
     * The hall behind one of its windows, in depth (so it slides behind the glass as the camera nears): the wall
     * of screens at the back, bright, in a grid; a far row of desks and watchers, a near row; all in world places,
     * so the rows run on from window to window. Clipped to the window's box.
     * @param {number[]} box @param {number} X
     */
    function inside(box, X) {
      const BACK = 12, L = X - 40, R = X + 40;
      rectAt(BACK, L, -4, R, 8, C.greenPale, box);
      for (let g = Math.floor(L / 0.8) * 0.8; g < R; g += 0.8) {
        rectAt(BACK, g, -4, g + 0.08, 8, C.greenDim, box);
        for (let h = -3.2; h < 8; h += 0.8) {
          const q = rnd(Math.round(g * 10) * 31 + Math.round(h * 10), 17);
          if (q < 0.12) rectAt(BACK, g + 0.08, h + 0.08, g + 0.8, h + 0.8, q < 0.05 ? C.greenWhite : C.green, box);
        }
      }
      for (let h = -3.2; h < 8; h += 0.8) rectAt(BACK, L, h, R, h + 0.08, C.greenDim, box);
      for (const d of [7, 3]) {                                               // the rows of desks, far then near
        for (let w = Math.floor(L / 1.3) * 1.3 + 0.65; w < R; w += 1.3) {
          const hx = w + (rnd(Math.round(w * 10) + d, 9) - 0.5) * 0.3;
          watcher(d, hx, box);
        }
        rectAt(d - 0.4, L, -3, R, -0.72, C.ink, box);                          // the desks
        rectAt(d - 0.4, L, -0.74, R, -0.68, C.greenDim, box);                  // their edge, lit by the screens
      }
    }

    /**
     * A watcher from behind, black against the screens: a round head, the neck, shoulders sloping out, down to the
     * desk; drawn row by row at its depth's scale, so the head stays round as it grows.
     * @param {number} d @param {number} hx @param {number[]} box
     */
    function watcher(d, hx, box) {
      const u = F / (D + d), cx = 160 + hx * u, top = 90 - (0.14 - camY) * u, bottom = 90 - (-0.72 - camY) * u;
      const r = 0.13 * u, [bl, bt, bw, bh] = box;
      for (let y = Math.max(bt, Math.round(top)); y < Math.min(bt + bh, Math.round(bottom)); y++) {
        const m = (y - top) / u;                                                // metres below the crown
        let half;
        if (m < 0.26) half = Math.sqrt(Math.max(0, r * r - (m * u - r) ** 2));  // the head
        else if (m < 0.32) half = 0.07 * u;                                     // the neck
        else half = Math.min(0.3, 0.1 + (m - 0.32) * 1.6) * u;                   // the shoulders into the chair's round back
        const l = Math.max(bl, Math.round(cx - half)), rr = Math.min(bl + bw, Math.round(cx + half));
        if (rr > l) px(ctx, C.ink, l, y, rr - l, 1);
      }
    }
  };
})();

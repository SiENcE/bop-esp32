// Halcyon: the intro's float over the sea (shots A1, A2 of docs/kapitel0-design.md §5; game/intro.js plays them).
// A camera CAM_H metres over the water looks along +Z, its horizon at the shot's `hz`, and floats along a dark
// channel (no lights within LANE metres of the middle). The lights on the water sit on a grid of 10 m cells (a
// cell's hash says whether it has huts or rafts and how lit); the city's camera masts stand at (X, Z); the drones
// hover at (X, Z, Y); Halcyon stands at its own Z on the water and grows as the camera nears it (drawn here, ring
// by ring, so it stays crisp at any size). The painted parts: art/intro/float.px.js (the skies, the masts' heads,
// the drone).
"use strict";

(function () {
  const W = 320, F = 160, CAM_H = 20, CELL = 10, NEAR = 16, FAR = 720, LANE = 16;
  const C = {
    ember: "#552b1c", amber: "#b0602a", hot: "#eea040", warm: "#ffd58a", white: "#fff4d8", cold: "#617aa0", pink: "#ff4fd3",
    magenta: "#a8238a", cyan: "#1f88a4", cyanLit: "#62def0", haze: "#2c2026", red: "#ff3a3a", redDim: "#7e1420",
    ink: "#131a2a", steel: "#1a2337", steel2: "#232f47", steelLit: "#2f3e5a", beam: "#2f3e5a", beam2: "#41547a", pod: "#b9c6d8",
    green: "#55a585", greenDim: "#266252",
  };
  const { bay, rnd, px } = Halcyon.intro;

  /**
   * A shot of the float.
   * @typedef {{hz: number, sky: string, seed: number, travel: number, lit: number, masts: [number, number, number][],
   *   city?: number, drones?: [number, number, number, number][], pods?: [number, number, number][]}} FloatShot
   * masts: [X, Z, height] in metres; city: Halcyon's Z; drones: [X, Z, Y, the beam's sweep phase];
   * pods: [y, speed px/s, length]
   */
  /** @type {Record<string, FloatShot>} */
  const SHOTS = {
    // A1: the masts all far at first, small among the lights; only as they near does one see what they are
    a1: { hz: 62, sky: "intro_sky_a1", seed: 1, travel: 130, lit: 0.62,
      masts: [[-58, 210, 36], [50, 250, 34], [95, 310, 34], [-150, 380, 34], [40, 470, 34], [230, 520, 30], [-90, 560, 34]] },
    a2: { hz: 100, sky: "intro_sky_a2", seed: 2, travel: 90, lit: 0.55, city: 470,
      masts: [[-38, 70, 34], [44, 100, 36], [-110, 230, 34], [130, 270, 32], [-60, 400, 34], [80, 440, 32]],
      drones: [[-120, 330, 60, 0], [150, 400, 70, 2]], pods: [[34, 9, 6], [52, -6, 5]] },
  };
  // Halcyon's size: at Z the city's scale is CITY_K / Z (1 = 9 rings of 7 px, the lowest 256 px wide)
  const CITY_K = 323;

  // the float's rooms: no sounds of their own, the music alone
  for (const [id, shot] of Object.entries(SHOTS)) {
    Cutaway.room(`intro_${id}`, { name: "Intro", color: "#06080f", float: id });
    Halcyon.intro.shots[id] = (ctx, p, t) => draw(ctx, shot, p, t);
  }

  /**
   * Halcyon from the sea at scale k, standing on the water at (cx, y0): 9 rings, the Lower Ninth widest at the
   * bottom; each ring its ledge in shadow, its underside lit by the ring below, its facade with two rows of
   * windows (amber homes, magenta ads low down, cyan in the Krone; each window a place on the ring, so it stays
   * where it is as the city grows); the tower through them with the hall's green band, its mast, the ring logo,
   * a red light blinking; the lowest rings fading into the haze.
   * @param {CanvasRenderingContext2D} ctx @param {number} cx @param {number} y0 @param {number} k @param {number} t
   */
  function city(ctx, cx, y0, k, t) {
    const RING = 7 * k;
    for (let r = 0; r < 9; r++) {
      const half = (128 - 12 * r) * k, l = Math.round(cx - half), w = Math.round(cx + half) - l;
      const top = Math.round(y0 - (r + 1) * RING), bot = Math.round(y0 - r * RING), h = bot - top;
      const row = (/** @type {number} */ a) => top + Math.round((a * h) / 7);
      px(ctx, C.steel, l, top, w, h);
      px(ctx, C.ink, l, top, w, Math.max(1, row(1) - top));
      px(ctx, r < 4 ? C.haze : C.steel2, l, row(1), w, Math.max(1, row(2) - row(1)));
      // the windows: one every 3 units along the ring, in two rows
      const ww = Math.max(1, Math.round(k)), n = Math.floor((128 - 12 * r) / 3);
      for (const [a, b] of [[3, 4], [5, 6]]) {
        const y = row(a), wh = Math.max(1, row(b) - y);
        for (let i = -n; i < n; i++) {
          const q = rnd(i * 31 + a, r + 11);
          if (q > (r < 6 ? 0.45 : 0.32)) continue;
          const col = r >= 7 ? (q < 0.15 ? C.cyanLit : C.cyan) : r < 3 && q < 0.07 ? (q < 0.03 ? C.pink : C.magenta) : q < 0.1 ? C.hot : r < 3 ? C.ember : C.amber;
          px(ctx, col, Math.round(cx + (i * 3 + 1) * k), y, ww, wh);
        }
      }
    }
    // the tower above the rings: its spine, the hall's band, the mast, the logo, the red light
    const ringsTop = y0 - 9 * RING, tw = Math.max(4, Math.round(10 * k)), tl = Math.round(cx - tw / 2), th = Math.round(18 * k);
    const tt = Math.round(ringsTop - th);
    px(ctx, C.steel, tl, tt, tw, Math.round(ringsTop) - tt + 2); px(ctx, C.steelLit, tl, tt, 1, Math.round(ringsTop) - tt + 2);
    for (let y = tt + Math.round(3 * k); y < ringsTop; y += Math.max(2, Math.round(3 * k))) px(ctx, (y >> 1) % 3 ? C.steel2 : C.ember, tl + 2, y, tw - 4, 1);
    const band = tt + Math.round(8 * k);
    px(ctx, C.green, tl, band, tw, Math.max(1, Math.round(2 * k))); px(ctx, C.greenDim, tl + 1, band, tw - 2, 1);
    const mh = Math.round(9 * k), mx = Math.round(cx);
    px(ctx, C.steel2, mx, tt - mh, 1, mh);
    const ly = tt - mh - Math.max(1, Math.round(2 * k)), lw = Math.max(2, Math.round(4 * k));
    px(ctx, C.cyan, mx - lw, ly - 1, lw * 2 + 1, 3); px(ctx, C.ink, mx - lw + 2, ly, lw * 2 - 3, 1);
    px(ctx, Math.floor(t / 400) % 3 === 0 ? C.red : C.redDim, mx, ly - 3);
    // the haze in front of the lowest rings
    const hz = Math.round(14 * k), L = Math.round(cx - 128 * k), R = Math.round(cx + 128 * k);
    for (let y = Math.round(y0) - hz; y < y0; y++) for (let x = L; x < R; x++)
      if (bay(x, y) < (y - y0 + hz) / (hz * 1.6)) px(ctx, C.haze, x, y);
  }

  /**
   * Draw a shot of the float at its progress.
   * @param {CanvasRenderingContext2D} ctx @param {FloatShot} s @param {number} p @param {number} t the clock (ms)
   */
  function draw(ctx, s, p, t) {
    const camZ = p * s.travel, hz = s.hz;
    /** Screen x, y of a world point, and its distance. @param {number} X @param {number} Z @param {number} [Y] */
    const proj = (X, Z, Y = 0) => { const z = Z - camZ; return [Math.round(160 + (X * F) / z), Math.round(hz + ((CAM_H - Y) * F) / z), z]; };
    Cutaway.assets.draw(ctx, s.sky, 0, 0, { anchor: [0, 0] });
    for (const [y, v, len] of s.pods ?? []) {                                   // transit pods crossing the sky
      const x = Math.round((((t / 1000) * v) % (W + 40) + (W + 40)) % (W + 40)) - 20;
      px(ctx, C.pod, x, y, len); px(ctx, C.white, v > 0 ? x + len - 1 : x, y);
    }
    // the lights on the water: rows of cells from far to near (Halcyon among them at its Z); the farther,
    // the fewer (they come out of the haze); none in the channel the camera floats along
    let cityDrawn = !s.city;
    const first = Math.ceil((camZ + NEAR) / CELL), last = Math.floor((camZ + FAR) / CELL);
    for (let row = last; row >= first; row--) {
      const Z0 = row * CELL, z = Z0 - camZ, span = Math.ceil(((z * 1.15) * W) / 2 / F / CELL) + 2;
      if (!cityDrawn && s.city && Z0 < s.city) {
        const cz = s.city - camZ, [, cy] = proj(0, s.city);
        city(ctx, 160, cy, CITY_K / cz, t);
        cityDrawn = true;
      }
      const chance = Math.min(0.75, s.lit * Math.pow(140 / z, 0.4));
      for (let col = -span; col <= span; col++) {
        const id = row * 7919 + col;
        if (rnd(id, s.seed) > chance) continue;
        const n = (1 + Math.floor(rnd(id, s.seed + 3) * 5)) * (z < 90 ? 3 : 1);   // near, a cell holds a few huts
        for (let j = 0; j < n; j++) {
          const X = col * CELL + rnd(id * 8 + j, s.seed + 4) * CELL, Z = Z0 + rnd(id * 8 + j, s.seed + 5) * CELL;
          if (Math.abs(X) < LANE + rnd(Math.floor(Z / 6) * 2 + (X > 0 ? 1 : 0), 77) * 10) continue;   // the channel's ragged banks
          const [x, y, zz] = proj(X, Z, rnd(id * 8 + j, s.seed + 6) * 4);
          if (zz < NEAR || x < -1 || x >= W || y <= hz || y >= 180) continue;
          const k0 = rnd(id * 8 + j, s.seed + 7);
          if (k0 > 0.9 && rnd(id * 8 + j + Math.floor(t / 900), s.seed + 8) < 0.3) continue;   // a few go off and on
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
    // the camera masts, far ones first: a slim column with its rungs, a red light half-way up, the head with
    // its cameras on top; the red lights' streaks on the water under them
    const order = s.masts.slice().sort((a, b) => b[1] - a[1]);
    for (const [X, Z, top] of order) {
      const [x, y0, z] = proj(X, Z), [, y1] = proj(X, Z, top), [, ym] = proj(X, Z, top / 2);
      if (z < 6) continue;
      const w = Math.max(1, Math.round((1.6 * F) / z)), l = x - (w >> 1);
      if (l > W + 20 || l + w < -20) continue;
      const on = Math.floor((t + X * 53) / 450) % 4 === 0, size = Math.max(1, Math.min(5, Math.round(560 / z)));
      const reflect = Math.min(180 - y0, Math.round((y0 - y1) * 0.3));
      for (let y = 1; y < reflect; y += 2) if (bay(x, y0 + y) < 0.7 * (1 - y / reflect)) px(ctx, on ? C.redDim : C.ember, x, y0 + y);
      px(ctx, C.steel, l, y1, w, y0 - y1);
      if (w > 1) px(ctx, C.steelLit, l, y1, 1, y0 - y1);
      const band = Math.max(3, Math.round((3 * F) / z));
      if (w > 1) for (let y = y1 + band; y < y0; y += band) px(ctx, C.steel2, l, y, w);
      px(ctx, on ? C.red : C.redDim, x, ym);
      Cutaway.assets.draw(ctx, `intro_mast_${size}`, x, y1 + 1, { t: t + X * 37, scale: z < 40 ? 2 : 1 });
    }
  }
})();

// Halcyon: the intro's shot 6 (docs/kapitel0-design.md §5; game/intro.js plays it): today, close on the deck. The picture
// is art/intro/today.px.js; what moves is drawn here: the feed's people under their umbrellas and its rain, a slow roll
// of the tube, the cursor following one of them, her hand on the mouse going with the cursor, the boards' lights, the fan.
"use strict";

(function () {
  const { px, rnd } = Halcyon.intro;
  const SX = 70, SY = 44, SW = 120, SH = 66;
  const PH = { dark: "#12332d", walker: "#8acfae", dim: "#55a585", bright: "#d4f7e2" };
  // the passers-by: [x at t = 0, px a second (their sign is their way), the row of their feet on the pavement]
  const PEOPLE = [[10, 6, 44], [90, -7, 38], [50, 5, 41], [110, -5, 43]];
  // her hand and the mouse's rest, in the screen's pixels
  const MX = 214, MY = 138;

  Cutaway.room("intro_today", { name: "Junos Wohnung", background: "intro_today_bg", float: "today",
    ambience: [{ sfx: "deck_fans", gain: 0.7 }] });

  /** Someone in the feed under an umbrella, feet at (x, y) in the picture. */
  function person(/** @type {CanvasRenderingContext2D} */ ctx, /** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ step) {
    px(ctx, PH.dark, SX + x - 2, SY + y, 6, 1);
    px(ctx, PH.dim, SX + x - 3, SY + y - 12, 8, 1); px(ctx, PH.dim, SX + x - 2, SY + y - 13, 6, 1);   // the umbrella
    px(ctx, PH.walker, SX + x, SY + y - 11, 2, 3);
    px(ctx, PH.walker, SX + x - 1, SY + y - 8, 4, 5);
    px(ctx, PH.walker, SX + x - (step ? 1 : 0), SY + y - 3, 1, 3);
    px(ctx, PH.walker, SX + x + (step ? 2 : 1), SY + y - 3, 1, 3);
  }

  /** Her hand on the mouse, in the yellow sleeve, which comes in from the corner. */
  function hand(/** @type {CanvasRenderingContext2D} */ ctx, /** @type {number} */ dx, /** @type {number} */ dy) {
    const x = MX + dx, y = MY + dy;
    // the mouse under it
    px(ctx, "#0c0e1a", x - 7, y - 3, 16, 13); px(ctx, "#3d4656", x - 6, y - 2, 14, 11); px(ctx, "#565e70", x - 6, y - 2, 14, 2); px(ctx, "#2f3e5a", x - 6, y + 3, 5, 1);
    // three fingers forward over its back, the back of the hand, the thumb along its side; the phosphor's light on the edge
    for (const [fy, n] of [[0, 9], [3, 10], [6, 9]]) { px(ctx, "#d79676", x - n + 6, y + fy, n, 2); px(ctx, "#93583f", x - n + 6, y + fy + 2, n, 1); }
    px(ctx, "#d79676", x + 6, y - 2, 12, 11); px(ctx, "#a9c29c", x + 6, y - 2, 12, 1); px(ctx, "#93583f", x + 6, y + 8, 12, 1);
    px(ctx, "#d79676", x + 4, y + 9, 8, 2); px(ctx, "#93583f", x + 4, y + 11, 8, 1);
    // the sleeve: a broad band to the screen's edge, widening, lit along its top, its cuff turned back
    for (let i = 0; x + 18 + i < 330; i++) {
      const top = y - 5 - Math.floor(i * 0.16), bottom = y + 13 + Math.floor(i * 0.26);
      px(ctx, "#eec414", x + 18 + i, top, 1, bottom - top);
      px(ctx, "#fff070", x + 18 + i, top, 1, 2);
      px(ctx, "#9a7406", x + 18 + i, bottom - 2, 1, 2);
    }
    px(ctx, "#fff070", x + 18, y - 5, 5, 18); px(ctx, "#9a7406", x + 23, y - 6, 1, 20); px(ctx, "#0c0e1a", x + 17, y - 5, 1, 18);
    for (const [a, b] of [[44, 3], [66, 8]]) for (let i = 0; i < 14; i++) px(ctx, "#9a7406", x + 18 + a + i, y + b + Math.floor(i * 0.3));
  }

  Halcyon.intro.shots.today = (ctx, p, t) => {
    const s = t / 1000, step = Math.floor(t / 280) % 2;
    ctx.save();
    ctx.beginPath(); ctx.rect(SX, SY, SW, SH); ctx.clip();
    const positions = PEOPLE.map(([x0, v]) => (((x0 + s * v) % (SW + 16)) + SW + 16) % (SW + 16) - 8);
    PEOPLE.forEach(([, , y], i) => person(ctx, Math.round(positions[i]), y, step));
    // the rain in the feed, diagonal as everywhere in the city
    for (let n = 0; n < 40; n++) {
      const period = SH + 8, off = rnd(n, 3) * period, y = ((off + s * 90) % period) - 4;
      const x = (rnd(n, 4) * SW + (y * 0.5)) % SW;
      for (let i = 0; i < 3; i++) px(ctx, PH.dim, SX + Math.round(x + i * 0.5), SY + Math.round(y + i));
    }
    // the cursor goes after the first of them, a little behind, as a hand does
    const cx = Math.round(positions[0] + Math.sin(s * 0.8) * 3), cy = PEOPLE[0][2] - 16;
    px(ctx, PH.bright, SX + cx, SY + cy, 1, 6); px(ctx, PH.bright, SX + cx + 1, SY + cy + 1, 1, 4); px(ctx, PH.bright, SX + cx + 2, SY + cy + 2, 1, 2);
    // the scanlines, and the tube's slow roll down the picture
    ctx.globalAlpha = 0.28;
    for (let y = 0; y < SH; y += 2) px(ctx, "#030a0a", SX, SY + y, SW, 1);
    ctx.globalAlpha = 0.12;
    px(ctx, PH.bright, SX, SY + Math.floor((s * 16) % (SH + 10)) - 5, SW, 5);
    ctx.globalAlpha = 1;
    ctx.restore();
    // the boards' lights, each at its own pace; the fan
    for (let n = 0; n < 7; n++) if (rnd(n + Math.floor((t + n * 170) / (260 + n * 90)), 9) < 0.6) px(ctx, n === 3 ? "#eea040" : "#62def0", 228 + n * 7, 66 + (n % 2) * 26, 1, 1);
    px(ctx, Math.floor(t / 90) % 2 ? "#41547a" : "#232f47", 293, 63, 4, 12); px(ctx, Math.floor(t / 90) % 2 ? "#232f47" : "#41547a", 289, 67, 12, 4);
    // her hand follows the cursor's small movements
    hand(ctx, Math.round(Math.sin(s * 0.8) * 2 + (positions[0] - 40) * 0.05), Math.round(Math.cos(s * 0.6)));
  };
})();

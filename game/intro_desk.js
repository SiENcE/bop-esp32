// Halcyon: the intro's shot 2 (docs/kapitel0-design.md §5; game/intro.js plays it): Juno at her desk, close. The
// picture is art/intro/desk.px.js; what moves is drawn here, driven by the shot's progress: people walking through
// the feed, a man who walks in and stops; then her yellow brackets close on him, the implant's point and the line
// over her cheek light, her hand presses. Everything in the feed is clipped to the monitor's picture.
"use strict";

(function () {
  const { px } = Halcyon.intro;
  const SX = 35, SY = 35, SW = 174, SH = 86;
  const PH = { walker: "#8acfae", dark: "#12332d", man: "#d4f7e2" };
  const YELLOW = "#ffd83a", CYAN = "#3ff2ff", SKIN = "#d79676", SKIN_LIT = "#a9c29c";
  // the passers-by: [x at t = 0, px a second (their sign is their way), the row of their feet on the pavement]
  const PEOPLE = [[20, 9, 54], [150, -11, 49], [90, 7, 46], [40, -8, 57], [130, 13, 52]];
  const STOP = 0.42, LOCK = 0.62;                                     // when the man stops, when she has him
  const MAN_X = 92, MAN_Y = 52;

  Cutaway.room("intro_desk", { name: "Beobachtungshalle", background: "intro_desk_bg", float: "desk",
    ambience: [{ sfx: "deck_fans", gain: 0.8 }, { sfx: "fridge_hum", gain: 0.4 }] });

  /** A small figure in the feed, feet at (x, y) in the picture: a head, a body, legs that step, a shadow. */
  function figure(/** @type {CanvasRenderingContext2D} */ ctx, /** @type {number} */ x, /** @type {number} */ y, /** @type {string} */ k, /** @type {number} */ step) {
    px(ctx, PH.dark, SX + x - 1, SY + y, 5, 1);
    px(ctx, k, SX + x, SY + y - 12, 2, 3);
    px(ctx, k, SX + x - 1, SY + y - 9, 4, 6);
    px(ctx, k, SX + x - (step ? 1 : 0), SY + y - 3, 1, 3);
    px(ctx, k, SX + x + (step ? 2 : 1), SY + y - 3, 1, 3);
  }

  /** Corner brackets round a box in the picture. */
  function brackets(/** @type {CanvasRenderingContext2D} */ ctx, /** @type {number} */ l, /** @type {number} */ t, /** @type {number} */ r, /** @type {number} */ b) {
    const n = 3, X0 = SX + l, Y0 = SY + t, X1 = SX + r, Y1 = SY + b;
    for (const [x, y, dx, dy] of [[X0, Y0, 1, 1], [X1, Y0, -1, 1], [X0, Y1, 1, -1], [X1, Y1, -1, -1]]) {
      px(ctx, YELLOW, dx > 0 ? x : x - n + 1, y, n, 1);
      px(ctx, YELLOW, x, dy > 0 ? y : y - n + 1, 1, n);
    }
  }

  Halcyon.intro.shots.desk = (ctx, p, t) => {
    ctx.save();
    ctx.beginPath(); ctx.rect(SX, SY, SW, SH); ctx.clip();
    const s = t / 1000, step = Math.floor(t / 220) % 2;
    for (const [x0, v, y] of PEOPLE) {
      const x = (((x0 + s * v) % (SW + 20)) + SW + 20) % (SW + 20) - 10;
      figure(ctx, Math.round(x), y, PH.walker, step);
    }
    // the man walks in from the left and stops; the others go on round him
    const walk = Math.min(1, p / STOP), mx = Math.round(-8 + (MAN_X + 8) * walk);
    figure(ctx, mx, MAN_Y, PH.man, walk < 1 ? step : 0);
    // her brackets: wide when she starts to mark him, closing on him by the lock
    if (p > LOCK - 0.1) {
      const k = Math.min(1, (p - (LOCK - 0.1)) / 0.1), far = Math.round(14 * (1 - k));
      brackets(ctx, MAN_X - 3 - far, MAN_Y - 14 - far, MAN_X + 5 + far, MAN_Y + 2 + far);
    }
    ctx.restore();
    // her hand on the keys, in the monitor's light; it presses as she locks on him
    const press = p > LOCK - 0.02 && p < LOCK + 0.03 ? 1 : 0;
    px(ctx, SKIN, 158, 141 + press, 10, 8); px(ctx, SKIN_LIT, 158, 141 + press, 10, 2); px(ctx, SKIN_LIT, 158, 141 + press, 2, 8);
    px(ctx, SKIN, 150, 143 + press, 8, 2); px(ctx, SKIN, 150, 146 + press, 8, 2);
    // the implant answers: the point behind her ear and the line over her cheek light as she tags, then settle
    if (p > LOCK - 0.1) {
      const hot = p < LOCK + 0.12 || Math.floor(t / 300) % 4 !== 0;
      if (hot) {
        px(ctx, CYAN, 265, 89, 2, 2);
        ctx.fillStyle = CYAN;
        for (let i = 0; i <= 18; i++) ctx.fillRect(246 - i, 86 - Math.round((i * 3) / 18), 1, 1);
      }
    }
  };
})();

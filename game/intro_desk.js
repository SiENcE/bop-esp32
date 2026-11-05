// Halcyon: the intro's shot 2 (docs/kapitel0-design.md §5; game/intro.js plays it): Juno at her desk, close. The
// picture is art/intro/desk.px.js; what moves is drawn here, driven by the shot's progress: people walking through
// the feed, a man who walks in and stops; then her brackets close on him (the implant's cyan, as always), the implant's point behind her ear
// lights, her hand presses. Everything in the feed is clipped to the monitor's picture. Shot 4's end is here too: the
// hall dark round her, her monitor the last one on (intro_desk_last), then out with a CRT's collapse (intro_desk_dark),
// her face in the dead glass.
"use strict";

(function () {
  const { px } = Halcyon.intro;
  const SX = 35, SY = 35, SW = 174, SH = 86;
  const PH = { walker: "#8acfae", dark: "#12332d", man: "#d4f7e2" };
  const CYAN = "#3ff2ff", SKIN = "#d79676", SKIN_LIT = "#a9c29c";
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
      px(ctx, CYAN, dx > 0 ? x : x - n + 1, y, n, 1);
      px(ctx, CYAN, x, dy > 0 ? y : y - n + 1, 1, n);
    }
  }

  /** Her hand on the keys; press: a pixel down. @param {CanvasRenderingContext2D} ctx @param {number} press @param {string} skin @param {string} lit */
  function hand(ctx, press, skin, lit) {
    // the back of the hand, narrowing from the wrist; three fingers curving down onto the keys; the thumb under it
    px(ctx, skin, 160, 142 + press, 10, 6); px(ctx, skin, 158, 143 + press, 2, 5);
    px(ctx, lit, 160, 142 + press, 10, 1); px(ctx, lit, 158, 143 + press, 2, 1);
    for (const [y, n] of [[143, 5], [145, 6], [147, 5]]) px(ctx, skin, 158 - n, y + press, n, 1);
    px(ctx, skin, 161, 148 + press, 5, 2);
  }

  /** The feed, its people and the man; his brackets once she has begun to mark him. */
  function desk(/** @type {CanvasRenderingContext2D} */ ctx, /** @type {number} */ p, /** @type {number} */ t) {
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
    hand(ctx, p > LOCK - 0.02 && p < LOCK + 0.03 ? 1 : 0, SKIN, SKIN_LIT);
    // the implant answers: the point behind her ear lights as she tags, then settles
    if (p > LOCK - 0.1 && (p < LOCK + 0.12 || Math.floor(t / 300) % 4 !== 0)) px(ctx, CYAN, 265, 89, 2, 2);
  }
  Halcyon.intro.shots.desk = desk;
  // the hall out round her: the same picture on her monitor, nothing new happens in it any more
  Halcyon.intro.shots.desk_last = (ctx, p, t) => desk(ctx, 1, t);
  // her monitor goes out as a CRT does: the picture folds into a bright line that narrows to nothing
  Halcyon.intro.shots.desk_dark = (ctx, p) => {
    hand(ctx, 0, "#552b1c", "#93583f");
    if (p >= 1) return;
    px(ctx, "#030a0a", SX, SY, SW, SH);
    const w = Math.round(SW * (1 - p)), h = p < 0.4 ? 3 : 1;
    px(ctx, "#d4f7e2", SX + Math.round((SW - w) / 2), SY + Math.round(SH / 2) - (h >> 1), w, h);
  };
  Cutaway.room("intro_desk_last", { name: "Beobachtungshalle", background: "intro_desk_last", float: "desk_last" });
  Cutaway.room("intro_desk_dark", { name: "Beobachtungshalle", background: "intro_desk_dark", float: "desk_dark" });
})();

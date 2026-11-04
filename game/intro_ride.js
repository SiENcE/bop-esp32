// Halcyon: the intro's ride D (docs/kapitel0-design.md §5; game/intro.js plays it): Juno going down the Transitachse in
// a glass lift. Everything outside the glass is drawn here, in rectangles on a shared scroll `s` (px of descent), so it
// stays crisp and the close-up and the whole lift are one journey: the decks of the rings rush up past, from the Krone's
// cold light through the middle's to the Ninth's amber and magenta. Painted over it (art/intro/ride.px.js): the box close
// (intro_d_close, and intro_d_close_lit where a deck's windows throw their light on it), then the lift and Juno.
"use strict";

(function () {
  const { px, rnd } = Halcyon.intro;
  const W = 320, H = 180;
  const SPEED = 360, CLOSE_MS = 3200, LIFT_MS = 7500;                  // px a second; as long as game/intro.js plays them
  const CLOSE_PX = (CLOSE_MS / 1000) * SPEED, TOTAL = CLOSE_PX + (LIFT_MS / 1000) * SPEED;
  const SPACING = 260, DECK = 62;                                     // from deck to deck, a deck's height
  const STAGES = [
    { gap: "#1a2337", far: "#2f3e5a", body: "#2f3e5a", lip: "#617aa0", under: "#1a2337", streak: ["#41547a", "#62def0"], win: ["#dafcff", "#62def0", "#b9c6d8", "#232f47"] },
    { gap: "#131a2a", far: "#2f3e5a", body: "#232f47", lip: "#41547a", under: "#131a2a", streak: ["#2f3e5a", "#fff4d8"], win: ["#fff4d8", "#62def0", "#ffd58a", "#1a2337"] },
    { gap: "#0c0e1a", far: "#b0602a", body: "#1a2337", lip: "#2f3e5a", under: "#0c0e1a", streak: ["#232f47", "#ff4fd3"], win: ["#eea040", "#ffd58a", "#ff4fd3", "#131a2a"] },
  ];
  /** The look at a point of the ride. @param {number} s */
  const stageAt = (s) => STAGES[s < TOTAL * 0.36 ? 0 : s < TOTAL * 0.7 ? 1 : 2];
  const mod = (/** @type {number} */ a, /** @type {number} */ n) => ((a % n) + n) % n;

  /** One deck going by, its top at row y. @param {CanvasRenderingContext2D} ctx @param {number} i @param {number} y */
  function deck(ctx, i, y) {
    const k = stageAt(i * SPACING);
    px(ctx, k.body, 0, y, W, DECK);
    px(ctx, k.lip, 0, y, W, 2);
    px(ctx, k.under, 0, y + DECK - 10, W, 10);
    // its band of windows; which are lit and how, by the deck
    for (let c = 0, x = 3; x < W; c++, x += 9) {
      const q = rnd(c * 7 + 1, i + 11);
      px(ctx, k.win[q < 0.55 ? 0 : q < 0.72 ? 1 : q < 0.84 ? 2 : 3], x, y + 16, 6, 18);
    }
    // the Krone's clean strip of cyan; further down, signs along the decks, without words
    if (k === STAGES[0]) px(ctx, "#62def0", 0, y + 42, W, 2);
    else for (let n = 0; n < 2; n++) {
      const sx = Math.floor(rnd(n + 3, i + 5) * 260), sw = 30 + Math.floor(rnd(n + 7, i + 5) * 60);
      px(ctx, k === STAGES[1] ? "#b9c6d8" : "#a8238a", sx, y + 40, sw, 8);
      px(ctx, k === STAGES[1] ? "#fff4d8" : "#ff4fd3", sx + 2, y + 42, sw - 4, 4);
    }
    // the lamps under it
    for (let x = 12 + (i % 4) * 8; x < W; x += 44) px(ctx, k.win[0], x, y + DECK - 3, 8, 1);
  }

  /** What is outside the glass at a point of the ride. @param {CanvasRenderingContext2D} ctx @param {number} s */
  function outside(ctx, s) {
    // the air between the decks, each gap in the tone of the deck above it
    const first = Math.floor(s / SPACING) - 1;
    for (let i = first; i * SPACING - s < H; i++) px(ctx, stageAt(i * SPACING).gap, 0, i * SPACING - s, W, SPACING);
    // the far city through the gaps, sliding slowly
    for (let n = 0; n < 70; n++) {
      const y = mod(rnd(n, 21) * 900 - s * 0.12, 900) - 200;
      if (y < 0 || y >= H) continue;
      px(ctx, stageAt(s + y).far, Math.floor(rnd(n, 22) * W), Math.round(y));
    }
    // the decks, then what passes closest: thin streaks, longer and faster than anything
    for (let i = first; i * SPACING - s < H; i++) deck(ctx, i, Math.round(i * SPACING - s));
    const k = stageAt(s);
    for (let n = 0; n < 34; n++) {
      const period = 300 + rnd(n, 31) * 400, len = 14 + Math.floor(rnd(n, 32) * 30);
      const y = mod(rnd(n, 33) * period - s * 1.6, period) - len;
      if (y < H) px(ctx, k.streak[rnd(n, 34) < 0.16 ? 1 : 0], Math.floor(rnd(n, 35) * W), Math.round(y), 1, len);
    }
  }

  /** The shaft's two rails, their brackets rushing up with the rest. @param {CanvasRenderingContext2D} ctx @param {number} s */
  function rails(ctx, s) {
    for (const x of [82, 233]) {
      px(ctx, "#2f3e5a", x, 0, 5, H);
      px(ctx, "#41547a", x, 0, 1, H);
      for (let y = -Math.floor(mod(s, 48)); y < H; y += 48) px(ctx, "#617aa0", x - 1, y, 7, 3);
    }
  }

  Cutaway.room("intro_d_close", { name: "Transitachse", color: "#06080f", float: "d_close" });
  Cutaway.room("intro_d", { name: "Transitachse", color: "#06080f", float: "d" });

  Halcyon.intro.shots.d_close = (ctx, p) => {
    const s = p * CLOSE_PX;
    outside(ctx, s);
    Cutaway.assets.draw(ctx, "intro_d_close", 0, 0, { anchor: [0, 0] });
    // where a deck's windows are level with the box, their light lies on it
    for (let i = Math.floor(s / SPACING) - 1; i * SPACING - s < H; i++) {
      ctx.save();
      ctx.beginPath(); ctx.rect(0, Math.round(i * SPACING - s) + 12, W, 26); ctx.clip();
      Cutaway.assets.draw(ctx, "intro_d_close_lit", 0, 0, { anchor: [0, 0] });
      ctx.restore();
    }
  };

  Halcyon.intro.shots.d = (ctx, p, t) => {
    const s = CLOSE_PX + p * (TOTAL - CLOSE_PX);
    outside(ctx, s);
    rails(ctx, s);
    Cutaway.assets.draw(ctx, "intro_d_lift", 0, 0, { anchor: [0, 0] });
    Cutaway.assets.draw(ctx, "intro_d_juno", 170, 138, { t, flip: true });   // she looks left, as in shots 2 and 4
  };
})();

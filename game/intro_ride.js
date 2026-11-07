// Nagiwa: the intro's ride D (docs/kapitel0-design.md §5; game/intro.js plays it): Juno going down the Transitachse in
// a glass lift. Everything outside the glass is drawn here, in rectangles on a shared scroll `s` (px of descent), so it
// stays crisp and the close-up and the whole lift are one journey: the decks of the rings rush up past, from the Krone's
// cold light through the middle's to the Ninth's amber and magenta. Painted over it (art/intro/ride.px.js): the box close
// (intro_d_close, and intro_d_close_lit where a deck's windows throw their light on it), then the lift and Juno; and the
// screens selling sleep, the signs, the decks' shadows and lamps (intro_d_ad_*, _blade_*, _shadow, _cone_*).
"use strict";

(function () {
  const { px, rnd } = Nagiwa.intro;
  const W = 320, H = 180;
  const SPEED = 360, CLOSE_MS = 3200, LIFT_MS = 11000;                  // px a second; as long as game/intro.js plays them
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

  const AD = { draw: (/** @type {CanvasRenderingContext2D} */ ctx, /** @type {string} */ n, /** @type {number} */ x, /** @type {number} */ y) => Cutaway.assets.draw(ctx, n, Math.round(x), Math.round(y), { anchor: [0, 0] }) };
  // what hangs between the decks, by how far down: further down the city sells sleep harder, and has more neon
  const ADS = [["intro_d_ad_sleep"], ["intro_d_ad_hours", "intro_d_ad_free", "intro_d_ad_sleep"], ["intro_d_ad_free", "intro_d_ad_face", "intro_d_ad_hours"]];
  const BLADES = [["intro_d_blade_rest"], ["intro_d_blade_rest", "intro_d_blade_noodles"], ["intro_d_blade_hotel", "intro_d_blade_noodles", "intro_d_blade_bar"]];
  const CONES = ["intro_d_cone_c", "intro_d_cone_c", "intro_d_cone_a"];
  const TOWER = ["#232f47", "#1a2337", "#131a2a"];
  const stageNo = (/** @type {number} */ s) => (s < TOTAL * 0.36 ? 0 : s < TOTAL * 0.7 ? 1 : 2);

  /** One deck going by, its top at row y. @param {CanvasRenderingContext2D} ctx @param {number} i @param {number} y */
  function deck(ctx, i, y) {
    const k = stageAt(i * SPACING), no = stageNo(i * SPACING);
    px(ctx, k.body, 0, y, W, DECK);
    px(ctx, k.lip, 0, y, W, 2);
    px(ctx, k.under, 0, y + DECK - 10, W, 10);
    for (let c = 0, x = 3; x < W; c++, x += 9) {
      const q = rnd(c * 7 + 1, i + 11), col = k.win[q < 0.55 ? 0 : q < 0.72 ? 1 : q < 0.84 ? 2 : 3];
      px(ctx, col, x, y + 14, 6, 18);
      if (q < 0.84) { px(ctx, k.under, x + 3, y + 14, 1, 18); px(ctx, k.under, x, y + 22, 6, 1); }     // the window's bars
    }
    // the Krone's clean strip of cyan; further down, neon along the decks: a dark tube, the lit one in it, its core
    if (no === 0) { px(ctx, "#1f88a4", 0, y + 40, W, 4); px(ctx, "#dafcff", 0, y + 41, W, 2); }
    else for (let n = 0; n < 3; n++) {
      const sx = Math.floor(rnd(n + 3, i + 5) * 280) - 10, sw = 26 + Math.floor(rnd(n + 7, i + 5) * 70), magenta = no === 2 ? n !== 1 : n === 2;
      px(ctx, magenta ? "#3e1240" : "#123c4e", sx - 1, y + 37, sw + 2, 10);
      px(ctx, magenta ? "#a8238a" : "#1f88a4", sx, y + 39, sw, 6);
      px(ctx, magenta ? "#ffc0f2" : "#dafcff", sx + 1, y + 41, sw - 2, 2);
    }
    for (let x = 12 + (i % 4) * 8; x < W; x += 44) px(ctx, k.win[0], x, y + DECK - 3, 8, 1);       // the lamps under it
  }

  /** What is outside the glass at a point of the ride. @param {CanvasRenderingContext2D} ctx @param {number} s */
  function outside(ctx, s) {
    // the air between the decks, each gap in the tone of the deck above it
    const first = Math.floor(s / SPACING) - 1;
    for (let i = first; i * SPACING - s < H; i++) px(ctx, stageAt(i * SPACING).gap, 0, i * SPACING - s, W, SPACING);
    // the far city through the gaps, sliding slowly
    for (let n = 0; n < 90; n++) {
      const y = mod(rnd(n, 21) * 900 - s * 0.12, 900) - 200;
      if (y < 0 || y >= H) continue;
      px(ctx, stageAt(s + y).far, Math.floor(rnd(n, 22) * W), Math.round(y));
    }
    // nearer, the buildings that stand between the rings, sliding at half the speed: dark, a lit edge, some windows, their
    // signs standing out; they make the depth the decks rush past in front of
    for (let n = 0; n < 9; n++) {
      const period = 700, y0 = mod(rnd(n, 41) * period - s * 0.5, period) - 240, x = Math.floor(rnd(n, 42) * 300) - 20, w = 24 + Math.floor(rnd(n, 43) * 34);
      if (y0 > H) continue;
      const no = stageNo(s + y0 + 100);
      px(ctx, TOWER[no], x, y0, w, 240); px(ctx, stageAt(s + y0).lip, x, y0, 1, 240);
      for (let r = 0; r < 12; r++) for (let c = 0; c < Math.floor(w / 7); c++) if (rnd(n * 13 + c, r + 44) < 0.34) px(ctx, stageAt(s + y0).win[(c + r) % 3], x + 4 + c * 7, y0 + 8 + r * 19, 3, 5);
      AD.draw(ctx, BLADES[no][n % BLADES[no].length], x + w - 2, y0 + 30);
    }
    // the screens selling sleep, hanging in the gaps: more of them further down, some behind the lift
    for (let i = first; i * SPACING - s < H; i++) {
      const no = stageNo(i * SPACING), count = no + 1;
      for (let n = 0; n < count; n++) {
        const set = ADS[no], x = (Math.floor(rnd(n + 1, i + 61) * 110) + (n % 2 ? 0 : 188) + 320) % 320 - 16;
        AD.draw(ctx, set[Math.floor(rnd(n + 9, i + 61) * set.length)], x, i * SPACING - s + DECK + 34 + Math.floor(rnd(n + 3, i + 67) * 50));
      }
    }
    // the decks, each throwing its shadow and its lamps' light on what is under it
    for (let i = first; i * SPACING - s < H; i++) {
      const y = Math.round(i * SPACING - s), no = stageNo(i * SPACING);
      AD.draw(ctx, "intro_d_shadow", 0, y + DECK);
      for (let x = 12 + (i % 4) * 8; x < W; x += 44) AD.draw(ctx, no === 2 && (x + i) % 3 === 0 ? "intro_d_cone_m" : CONES[no], x - 18, y + DECK);
      deck(ctx, i, y);
    }
    // what passes closest: thin streaks, longer and faster than anything
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

  Nagiwa.intro.shots.d_close = (ctx, p) => {
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

  Nagiwa.intro.shots.d = (ctx, p, t) => {
    const s = CLOSE_PX + p * (TOTAL - CLOSE_PX);
    outside(ctx, s);
    rails(ctx, s);
    // the glass takes the edge off what is behind it, so that she stays what you look at
    ctx.globalAlpha = 0.34; px(ctx, "#06080f", 92, 60, 136, 70); ctx.globalAlpha = 1;
    Cutaway.assets.draw(ctx, "intro_d_lift", 0, 0, { anchor: [0, 0] });
    // the light of a deck's windows crosses the floor as it goes by, in the deck's own colour; never her (style guide §7)
    for (let i = Math.floor(s / SPACING) - 1; i * SPACING - s < H; i++) {
      const y = i * SPACING - s;
      if (y > 40 && y < 150) { ctx.globalAlpha = 0.35 * (1 - Math.abs(y - 95) / 55); px(ctx, stageAt(i * SPACING).win[0], 95, 131, 130, 11); ctx.globalAlpha = 1; }
    }
    Cutaway.assets.draw(ctx, "intro_d_juno", 170, 138, { t, flip: true });   // she looks left, as in shots 2 and 4
  };
})();

// Nagiwa: how the picture changes between rooms (docs/style-guide.md §8a "Transitions"), drawn instead
// of the engine's plain fade (Cutaway.fx.setTransition). Three kinds, by what the rooms are:
//   street to street        a glitch scan: rows go dark from the top down, a cyan line at the edge,
//                           the rows beside it slipping sideways (and back up when the new room comes)
//   street to a screen      the screen jacks in: the picture folds into a bright line, the line opens on
//   (the deck, a camera)    the new picture through snow; leaving a screen folds it the same way
//   screen to screen        static: the picture drowns in snow and the next one comes up out of it
// A "screen" is the deck (`deck: true`) or a camera's room (`feed`).
"use strict";

(function () {
  const C = { night: "#06080f", cyan: "#62def0", cyanPale: "#dafcff", magenta: "#ff4fd3" };

  /** @param {string | undefined} id */
  const screen = (id) => { const r = id ? Cutaway.room.get(id) : null; return !!(r && (r.deck || r.feed)); };
  /** @param {{from: string | undefined, to: string}} t @returns {"glitch" | "jack" | "static"} */
  const kind = (t) => (screen(t.from) && screen(t.to) ? "static" : screen(t.from) || screen(t.to) ? "jack" : "glitch");
  const LENGTHS = { glitch: { out: 240, in: 280 }, jack: { out: 260, in: 420 }, static: { out: 150, in: 260 } };

  /** A repeatable number in 0..1. @param {number} a @param {number} b */
  function hash(a, b) { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }

  // ---------------------------------------------------------------- snow
  /** @type {HTMLCanvasElement | null} */
  let snowCanvas = null;
  /** Snow over the whole picture, each pixel there with the chance `amount` (new every frame). @param {CanvasRenderingContext2D} ctx */
  function snow(ctx, /** @type {number} */ amount, /** @type {number} */ seed) {
    const W = Cutaway.display.width, H = Cutaway.display.height;
    if (!snowCanvas) { snowCanvas = document.createElement("canvas"); snowCanvas.width = W; snowCanvas.height = H; }
    const g = /** @type {CanvasRenderingContext2D} */ (snowCanvas.getContext("2d")), img = g.createImageData(W, H), d = img.data;
    for (let i = 0, p = 0; p < W * H; p++, i += 4) {
      if (hash(p, seed) >= amount) continue;
      const v = 40 + Math.floor(hash(seed, p) * 200);
      d[i] = v * 0.85; d[i + 1] = v; d[i + 2] = v; d[i + 3] = 255;           // a cold grey, a touch of cyan
    }
    g.putImageData(img, 0, 0);
    ctx.drawImage(snowCanvas, 0, 0);
  }

  // ---------------------------------------------------------------- the three kinds
  /** Rows go dark from the top; the edge is a cyan line with rows slipping beside it. @param {CanvasRenderingContext2D} ctx @param {TransitionInfo} t */
  function glitch(ctx, t) {
    const W = Cutaway.display.width, H = Cutaway.display.height, edge = t.level * 1.3 - 0.15, seed = Math.floor(t.ms / 40);
    for (let y = 0; y < H; y++) {
      const v = y / H + hash(y, 7) * 0.15;                               // the edge is ragged, the same each time
      if (v < edge) { ctx.fillStyle = C.night; ctx.fillRect(0, y, W, 1); continue; }
      if (v < edge + 0.025) { ctx.fillStyle = hash(y, seed) < 0.15 ? C.magenta : C.cyan; ctx.fillRect(0, y, W, 1); continue; }
      if (v < edge + 0.09 && hash(y, seed) < 0.5) {                       // the rows beside the edge slip sideways
        const dx = (hash(seed, y) < 0.5 ? -1 : 1) * (2 + Math.floor(hash(y, seed + 1) * 6));
        ctx.drawImage(ctx.canvas, 0, y, W, 1, dx, y, W, 1);
      }
    }
  }

  /** @type {HTMLCanvasElement | null} */
  let frameCopy = null;
  /** The picture folds into a line (and opens out of one), with snow on it. @param {CanvasRenderingContext2D} ctx @param {TransitionInfo} t */
  function jack(ctx, t) {
    const W = Cutaway.display.width, H = Cutaway.display.height;
    if (!frameCopy) { frameCopy = document.createElement("canvas"); frameCopy.width = W; frameCopy.height = H; }
    const g = /** @type {CanvasRenderingContext2D} */ (frameCopy.getContext("2d"));
    g.clearRect(0, 0, W, H); g.drawImage(ctx.canvas, 0, 0);
    const open = 1 - t.level, h = Math.max(1, Math.round(H * open * open)), y = Math.round((H - h) / 2);
    ctx.fillStyle = C.night; ctx.fillRect(0, 0, W, H);
    if (open > 0.06) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(frameCopy, 0, 0, W, H, 0, y, W, h);
      ctx.save(); ctx.beginPath(); ctx.rect(0, y, W, h); ctx.clip();
      snow(ctx, Math.min(0.9, t.level * 1.1), Math.floor(t.ms / 33)); ctx.restore();
    }
    // the bright line where it folds: wide while thin, then only the picture's top and bottom edge
    const w = open > 0.06 ? W : Math.round(W * (open / 0.06));
    ctx.fillStyle = C.cyanPale; ctx.fillRect(Math.round((W - w) / 2), y, w, 1);
    if (h > 2) { ctx.fillStyle = C.cyan; ctx.fillRect(0, y + h - 1, W, 1); }
  }

  /** The picture drowns in snow, the next comes up out of it. @param {CanvasRenderingContext2D} ctx @param {TransitionInfo} t */
  function staticNoise(ctx, t) {
    snow(ctx, Math.min(1, t.level * 1.15), Math.floor(t.ms / 33));
    const W = Cutaway.display.width, H = Cutaway.display.height, seed = Math.floor(t.ms / 60);
    ctx.fillStyle = `rgba(98, 222, 240, ${(0.25 * t.level).toFixed(3)})`;          // a rolling bar, the camera losing sync
    ctx.fillRect(0, Math.floor(hash(seed, 3) * H), W, 3);
  }

  // the sounds play by the same kinds (game/sounds.js)
  Nagiwa.transitionKind = kind;
  Nagiwa.isScreen = screen;

  Cutaway.fx.setTransition({
    draw: (ctx, t) => { const k = kind(t); if (k === "jack") jack(ctx, t); else if (k === "static") staticNoise(ctx, t); else glitch(ctx, t); },
    ms: (t) => LENGTHS[kind(t)],
  });
})();

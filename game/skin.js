// Nagiwa: the look of the engine's own interface (docs/style-guide.md §8 and §8a): the menu's frames, its
// heading plate and buttons, the full-screen cards (act titles, the end), the pointer, the satchel and
// the buttons beside it (their art: art/ui/hud.px.js). The frames and cards are drawn here, no art:
// chamfered corners, cyan lines on night steel, scanlines, small data readouts in the
// 3x5 HUD font (game/font.js), cards that type themselves on with a block cursor and glitch now and then.
"use strict";

(function () {
  const C = {
    ink: "#0c0e1a", night: "#06080f", steel1: "#131a2a", steel2: "#1a2337", steel3: "#232f47", steel5: "#41547a", steel6: "#617aa0",
    cyanDeep: "#123c4e", cyanDark: "#1f88a4", cyan: "#62def0", cyanPale: "#dafcff",
    magentaDark: "#a8238a", magenta: "#ff4fd3",
  };

  const hud = () => Cutaway.font.get("hud");                // game/font.js
  /** @param {CanvasRenderingContext2D} ctx @param {string} s @param {number} x @param {number} y @param {string} color @param {"left"|"center"|"right"} [align] */
  function readout(ctx, s, x, y, color, align = "left") { hud().draw(ctx, s.toUpperCase(), x, y, { color, align }); }
  // the frames' and cards' small readouts: the city's tech, English in every language, but through i18n
  // like every text (Nagiwa.t, declared for validate and the Texts tab)
  const [SYS, NET, NINTH, SEQ] = Cutaway.i18n.declare("frames and cards", ["NINTH//SYS", "NAGI·WA.NET", "LOWER NINTH", "SEQ {n}"]);

  // ---------------------------------------------------------------- shapes
  /** A box with two corners cut at 45° (top left, bottom right): its rows, each [left, right] (inclusive).
   * @param {number} w @param {number} h @param {number} cut */
  function rows(w, h, cut) {
    const out = [];
    for (let i = 0; i < h; i++) out.push([Math.max(0, cut - i), w - 1 - Math.max(0, cut - (h - 1 - i))]);
    return out;
  }

  /** Fill and outline a chamfered box. @param {CanvasRenderingContext2D} ctx */
  function chamfer(ctx, /** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ w, /** @type {number} */ h,
    /** @type {number} */ cut, /** @type {string | null} */ fill, /** @type {string} */ line, /** @type {string} */ bright) {
    const r = rows(w, h, cut);
    if (fill) { ctx.fillStyle = fill; r.forEach(([a, b], i) => ctx.fillRect(x + a, y + i, b - a + 1, 1)); }
    ctx.fillStyle = line;
    ctx.fillRect(x + r[0][0], y, r[0][1] - r[0][0] + 1, 1);
    ctx.fillRect(x + r[h - 1][0], y + h - 1, r[h - 1][1] - r[h - 1][0] + 1, 1);
    r.forEach(([a, b], i) => { ctx.fillRect(x + a, y + i, 1, 1); ctx.fillRect(x + b, y + i, 1, 1); });
    // the cuts and the lines next to them in the bright colour: where the light catches the edge
    ctx.fillStyle = bright;
    for (let i = 0; i < cut; i++) { ctx.fillRect(x + cut - i, y + i, 1, 1); ctx.fillRect(x + w - 1 - (cut - i), y + h - 1 - i, 1, 1); }
    const run = Math.min(24, Math.floor(w / 4));
    ctx.fillRect(x + cut, y, run, 1);
    ctx.fillRect(x + w - cut - run, y + h - 1, run, 1);
  }

  /** Faint scanlines over a box. @param {CanvasRenderingContext2D} ctx */
  function scanlines(ctx, /** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ w, /** @type {number} */ h, alpha = 0.035) {
    ctx.fillStyle = `rgba(98, 222, 240, ${alpha})`;
    for (let i = y + 1; i < y + h; i += 2) ctx.fillRect(x, i, w, 1);
  }

  // ---------------------------------------------------------------- the menu's frames
  /** @type {NonNullable<NonNullable<Parameters<typeof Cutaway.ui.skin>[0]["frame"]>["draw"]>} */
  function frame(ctx, x, y, w, h, o) {
    if (o.kind === "plate") {                            // the heading: a slanted tab across the top edge
      for (let i = 0; i < h; i++) {
        const s = Math.floor((h - 1 - i) / 2);
        ctx.fillStyle = i === 0 ? C.cyan : i === h - 1 ? C.cyanDark : C.cyanDeep;
        ctx.fillRect(x + s, y + i, w - 2 * s, 1);
      }
      return;
    }
    if (o.kind === "button" || o.small) {
      chamfer(ctx, x, y, w, h, 3, o.hover ? C.cyanDeep : "rgba(10, 14, 26, 0.9)", o.hover ? C.cyan : C.cyanDark, o.hover ? C.cyanPale : C.cyan);
      return;
    }
    // a page (or a card's frame): night steel, scanlines, cyan edges, a label in the line
    if (o.shadow !== false) { ctx.fillStyle = "rgba(0, 0, 0, 0.45)"; rows(w, h, 6).forEach(([a, b], i) => ctx.fillRect(x + a + 2, y + i + 2, b - a + 1, 1)); }
    chamfer(ctx, x, y, w, h, 6, o.fill ?? "rgba(9, 13, 24, 0.94)", C.cyanDark, C.cyan);
    scanlines(ctx, x + 1, y + 1, w - 2, h - 2);
    for (let i = 0; i < 3; i++) { ctx.fillStyle = C.steel5; ctx.fillRect(x + 4 + i * 3, y + h - 3, 2, 1); }
    const label = Nagiwa.t(SYS), lw = hud().measure(label) + 4, lx = x + w - 10 - lw;
    ctx.fillStyle = o.fill ?? C.night;
    ctx.fillRect(lx, y + h - 1, lw, 1);
    readout(ctx, label, lx + 2, y + h - 3, C.steel6);
  }

  // ---------------------------------------------------------------- the cards
  const TYPE_FROM = 250, MS_PER_CHAR = 38;
  /** the letters a card has typed so far (a key sound every other one: game/sounds.js "type") */
  let typedSeen = 0, lastCardMs = 0;

  /** Is the card in a glitch now? Two short bursts every few seconds, the same every time (screenshots repeat). @param {number} ms */
  function glitching(ms) { return ms < 320 || (ms % 2900 < 70) || (ms % 2900 > 160 && ms % 2900 < 200); }

  /** Draw text with a split of magenta and cyan beside it while glitching. */
  function glitchText(/** @type {CanvasRenderingContext2D} */ ctx, /** @type {(dx: number, color: string) => void} */ draw, /** @type {boolean} */ on, /** @type {string} */ color) {
    if (on) { ctx.globalAlpha = 0.7; draw(-1, C.magenta); draw(1, C.cyan); ctx.globalAlpha = 1; }
    draw(0, color);
  }

  /** @type {NonNullable<Parameters<typeof Cutaway.ui.skin>[0]["card"]>["draw"]} */
  function card(ctx, c) {
    const W = Cutaway.display.width, H = Cutaway.display.height, f = Cutaway.ui.font(), ms = c.ms, g = glitching(ms);
    ctx.fillStyle = C.night;
    ctx.fillRect(0, 0, W, H);
    scanlines(ctx, 0, 0, W, H, 0.025);
    const roll = Math.floor(ms / 14) % (H + 20) - 10;             // a slow bright band rolling down, like an old monitor
    ctx.fillStyle = "rgba(98, 222, 240, 0.035)";
    ctx.fillRect(0, roll, W, 6);

    // corner brackets and readouts
    ctx.fillStyle = C.cyanDark;
    for (const [bx, by, sx, sy] of [[8, 8, 1, 1], [W - 9, 8, -1, 1], [8, H - 9, 1, -1], [W - 9, H - 9, -1, -1]]) {
      ctx.fillRect(Math.min(bx, bx + sx * 11), by, 12, 1);
      ctx.fillRect(bx, Math.min(by, by + sy * 7), 1, 8);
    }
    readout(ctx, Nagiwa.t(NET), 14, 12, C.steel5);
    readout(ctx, Nagiwa.t(NINTH), W - 14, 12, C.steel5, "right");
    readout(ctx, Nagiwa.t(SEQ, { n: String(Math.floor(ms / 40) % 10000).padStart(4, "0") }), 14, H - 16, C.steel5);
    ctx.fillStyle = C.magenta;
    ctx.fillRect(W - 14, H - 16, 3, 5);

    // the text types itself on: the heading first, then the lines, a block cursor after the last letter
    let budget = Math.max(0, Math.floor((ms - TYPE_FROM) / MS_PER_CHAR));
    const letters = Math.min(budget, (c.title ? c.title.length + 3 : 0) + c.lines.join("").length);
    if (ms < lastCardMs) typedSeen = 0;                                  // a new card
    lastCardMs = ms;
    if (letters > typedSeen) { if (Math.floor(letters / 2) > Math.floor(typedSeen / 2)) Cutaway.events.emit("sfx", { sfx: "type" }); typedSeen = letters; }
    const take = (/** @type {string} */ s) => { const n = Math.min(s.length, budget); budget -= n; return s.slice(0, n); };
    const head = c.title ? `// ${c.title}` : "", big = !c.buttons.length && c.lines.length === 1 && f.measure(c.lines[0]) * 2 < W - 60;
    const lineH = big ? f.lineHeight * 2 : f.lineHeight;
    const total = (head ? 10 : 0) + c.lines.length * lineH;
    const top = c.buttons.length ? c.titleY : Math.round(H / 2 - total / 2);
    let cursor = null;
    if (head) {
      const shown = take(head);
      readout(ctx, shown, W / 2, top, C.cyan, "center");
      if (shown.length < head.length || !c.lines.length) cursor = { x: Math.round(W / 2 + hud().measure(shown) / 2) + 1, y: top, h: 5 };
    }
    let y = head ? top + 10 : top;
    for (const line of c.lines) {
      const shown = take(line);
      if (!shown) break;
      if (big) {
        const w = f.measure(line) * 2, x = Math.round(W / 2 - w / 2);
        glitchText(ctx, (dx, color) => {
          ctx.save(); ctx.translate(x + dx, y); ctx.scale(2, 2);
          f.draw(ctx, shown, 0, 0, { color }); ctx.restore();
        }, g, C.cyanPale);
        cursor = { x: x + f.measure(shown) * 2 + 2, y, h: 12 };
      } else {
        const x = Math.round(W / 2 - f.measure(line) / 2);
        glitchText(ctx, (dx, color) => f.draw(ctx, shown, x + dx, y, { color }), g, C.cyanPale);
        cursor = { x: x + f.measure(shown) + 1, y, h: 7 };
      }
      y += lineH;
    }
    const typed = budget > 0;
    if (cursor && (!typed || Math.floor(ms / 450) % 2 === 0)) { ctx.fillStyle = C.cyan; ctx.fillRect(cursor.x, cursor.y, big ? 4 : 2, cursor.h); }

    // a glitch: two bands of the picture slip sideways for a moment
    if (g) {
      const seed = Math.floor(ms / 60);
      for (let k = 0; k < 2; k++) {
        const by = (seed * 37 + k * 71) % (H - 8), bh = 2 + ((seed + k) % 4), dx = ((seed + k) % 2 ? 1 : -1) * (2 + (seed % 3));
        ctx.drawImage(ctx.canvas, 0, by, W, bh, dx, by, W, bh);
      }
    }

    // the buttons, where the menu takes their clicks; else a prompt once the text is there
    c.buttons.forEach((b, i) => {
      const by = c.buttonsY + i * c.buttonRow, w = f.measure(b) + 14, on = i === c.hover;
      frame(ctx, Math.round(W / 2 - w / 2), by - 3, w, 13, { kind: "button", hover: on });
      f.draw(ctx, b, W / 2, by, { align: "center", color: on ? C.cyanPale : C.cyan });
    });
    if (!c.buttons.length && typed && Math.floor(ms / 600) % 2 === 0) readout(ctx, ">>", W - 22, H - 16, C.cyan);
  }

  // ---------------------------------------------------------------- the dialogue's choices
  // A panel along the bottom: night steel, scanlines, a cyan top edge that catches the light at its left,
  // a magenta tick; each choice numbered in the HUD font ([1] ... the keys pick them too); the one under
  // the pointer on a cyan band with a marker, in pale cyan; the others in the speaker's colour.
  /** @type {NonNullable<Parameters<typeof Cutaway.ui.skin>[0]["choices"]>["draw"]} */
  function choices(ctx, c) {
    const f = Cutaway.ui.font(), top = c.y - 2;
    ctx.fillStyle = "rgba(9, 13, 24, 0.92)";
    ctx.fillRect(0, top, c.w, c.h + 2);
    scanlines(ctx, 0, top + 1, c.w, c.h + 1);
    ctx.fillStyle = C.cyanDark; ctx.fillRect(0, top, c.w, 1);
    ctx.fillStyle = C.cyan; ctx.fillRect(0, top, 40, 1);
    ctx.fillStyle = C.magenta; ctx.fillRect(c.w - 14, top - 1, 8, 2);
    c.texts.forEach((t, i) => {
      const y = c.textY + i * c.line, on = i === c.hover;
      if (on) {
        ctx.fillStyle = "rgba(98, 222, 240, 0.14)"; ctx.fillRect(2, y - 2, c.w - 4, c.line);
        ctx.fillStyle = C.cyan; ctx.fillRect(2, y - 2, 1, c.line);
      }
      readout(ctx, `[${i + 1}]`, 6, y + 1, on ? C.cyanPale : C.cyanDark);
      f.draw(ctx, t, 22, y, { color: on ? C.cyanPale : c.color, outline: C.ink });
    });
  }

  // the pointer, the satchel and the buttons beside it: art/ui/hud.px.js (assets/ui.js)
  Cutaway.inventory.setSprite("ui_satchel");
  Cutaway.ui.skin({
    cursor: "ui_cursor", cursorHot: "ui_cursor_hot", cursorAnchor: [5, 5],
    buttons: { hint: "ui_evi", menu: "ui_menu", hotspots: "ui_eye" },
    outline: C.ink, accent: C.cyan, labelColor: C.cyanPale, panel: "rgba(9, 13, 24, 0.86)",
    label: { font: "hud", format: (t) => `[ ${t.toUpperCase()} ]` },
    choices: { draw: choices },
    frame: { outline: C.ink, light: C.cyan, face: C.cyanDeep, dark: C.cyanDark, fill: "rgba(9, 13, 24, 0.94)", plate: C.cyanDeep,
      hover: "rgba(98, 222, 240, 0.12)", draw: frame },
    card: { draw: card },
  });
})();

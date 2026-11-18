// Nagiwa: SUMP RUNNER, the arcade cabinet in the Wohnblock Lerche's hall (the user's wish and choices, 2026-11-18). It is Motte's game on
// his Tideboy (game/motte.js: "Du bist eine Kabelratte. Du ziehst Kabel durch die Rohre, und oben geht das Licht an."): a house in
// section, its pipes on a grid; the cable rat crawls one cell a move and pulls the cable behind her. She can't cross her own cable, only
// reel it in by stepping back onto it; with every move the water rises a little from below. At the lamp on top the light goes on, and in
// the next house the water comes faster. Sparks in the side pipes are worth points and cost moves.
// In turns, never timing: a click is a move (on the grid: one step towards it), and the same moves lie on the panel's arrows (a
// controller later) and on the arrow keys. A screen of its own, as Lantern's radio (the room sump_runner): the cabinet's screen fills the
// picture. Free (its coin slot is stuck) and without a flag: flavour the solver walks through and finds nothing new in; Juno's best run
// is a view (sump_best), on the high-score table under MOTTE. Painted on the blocks the user approved (2026-11-18): the cabinet and the
// game's pieces are art/ui/sump_runner.px.js (in assets/ui.js), put together here; its words are the game's (i18n).
"use strict";

(function () {
  const A = Nagiwa.at.sump_runner, [GX, GY, CELL, COLS, ROWS] = A.grid;
  Cutaway.state.view("sump_best");

  /** the table on the cabinet (Juno's best goes in where it belongs) */
  const TABLE = [["MOTTE", 6400], ["LIL", 3800], ["BAO", 2100], ["K9", 900]];
  const JUNO = "JUNO";
  Cutaway.i18n.declare("sump runner", ["PRESS START", "GAME OVER", "LIGHTS ON", "DROWNED", "LEVEL", "SCORE", "HI-SCORE", "START",
    "EXIT", JUNO]);
  // no new best: the first; a new best: by the place it takes on the table (1 to 5: past Motte, behind him, past Bao, past K9, last)
  const LINES = Cutaway.i18n.declare("sump runner", ["Motte hätte gelacht.", "Ich hab Motte geschlagen. Das glaubt er mir nie.",
    "Platz zwei hinter Motte. Das erzähl ich ihm nicht.", "Platz drei. Das wird Bao nicht gefallen.", "Platz vier. Wenigstens bin ich vor K9.",
    "Ganz unten, sogar hinter K9. Motte hätte gelacht."]);

  /** a small random of its own, so a house is the same each time it is tried again @param {number} seed */
  const rng = (seed) => () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const id = (/** @type {number} */ x, /** @type {number} */ y) => y * COLS + x;
  const DIRS = /** @type {Record<string, [number, number]>} */ ({ left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] });

  /**
   * The game, kept out of the state on purpose (it is flavour): the house (its pipes as joins between cells, the lamp, the sparks), the
   * rat's cable (the cells she has crossed, the last one where she is), the moves made in this house, how fast the water rises (moves a
   * row), the level, the score, the lives, the way the rat faces (0 right, 1 left, 2 up, 3 down: ui_sr_rat's frames by two), and the
   * phase it is in: title, play, lit, drowned, over.
   */
  const G = {
    phase: "title", level: 1, score: 0, lives: 3, moves: 0, per: 3, since: 0, best: false, game: 0, face: 2,
    /** @type {Set<string>} */ pipes: new Set(), lamp: [0, 0], /** @type {number[][]} */ sparks: [], /** @type {number[][]} */ cable: [],
  };
  Nagiwa.sumpRunner = G;   // for the tools and a look in the console
  const joined = (/** @type {number} */ a, /** @type {number} */ b) => G.pipes.has(a < b ? `${a}-${b}` : `${b}-${a}`);
  const join = (/** @type {number} */ a, /** @type {number} */ b) => G.pipes.add(a < b ? `${a}-${b}` : `${b}-${a}`);
  const START = [Math.floor(COLS / 2), ROWS - 1];

  /** the water's top in rows from the grid's top (ROWS: none yet); a cell is under water once the top has reached its own top */
  const surface = () => ROWS - G.moves / G.per;
  const flooded = (/** @type {number} */ y) => y >= ROWS - Math.floor(G.moves / G.per);

  /** the shortest way through the pipes from the start to the lamp (cells), or null */
  function shortest() {
    const from = id(START[0], START[1]), to = id(G.lamp[0], G.lamp[1]), prev = new Map([[from, -1]]), queue = [from];
    while (queue.length) {
      const c = /** @type {number} */ (queue.shift());
      if (c === to) break;
      const x = c % COLS, y = Math.floor(c / COLS);
      for (const [dx, dy] of Object.values(DIRS)) {
        const nx = x + dx, ny = y + dy, n = id(nx, ny);
        if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS || prev.has(n) || !joined(c, n)) continue;
        prev.set(n, c); queue.push(n);
      }
    }
    if (!prev.has(to)) return null;
    const way = [];
    for (let c = to; c !== -1; c = /** @type {number} */ (prev.get(c))) way.unshift(c);
    return way;
  }

  /** A house for the level: pipes as a random tree over every cell, a few joins more so there are choices, the lamp on top; then the
   * water as fast as the shortest way allows, with less to spare in every house (three moves a row more at first, one from the fifth on:
   * a single step wrong never drowns her) */
  function build() {
    const r = rng(G.level * 7919 + G.game * 104729);
    G.pipes = new Set();
    const seen = new Set([id(START[0], START[1])]), stack = [START.slice()];
    while (stack.length) {
      const [x, y] = stack[stack.length - 1];
      const next = Object.values(DIRS).map(([dx, dy]) => [x + dx, y + dy]).filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < COLS && ny < ROWS && !seen.has(id(nx, ny)));
      if (!next.length) { stack.pop(); continue; }
      const [nx, ny] = next[Math.floor(r() * next.length)];
      join(id(x, y), id(nx, ny)); seen.add(id(nx, ny)); stack.push([nx, ny]);
    }
    for (let i = 0; i < 10; i++) {
      const x = Math.floor(r() * (COLS - 1)), y = Math.floor(r() * (ROWS - 1));
      join(id(x, y), r() < 0.5 ? id(x + 1, y) : id(x, y + 1));
    }
    G.lamp = [Math.floor(r() * COLS), 0];
    const way = /** @type {number[]} */ (shortest());
    // the slowest water that still lets the shortest way through, then a little faster each house
    let per = 1;
    for (;; per++) if (way.every((c, i) => Math.floor(c / COLS) < ROWS - Math.floor(i / per) || i === way.length - 1)) break;
    G.per = per + Math.max(1, 3 - Math.floor((G.level - 1) / 2));
    const off = [...Array(COLS * ROWS).keys()].filter((c) => !way.includes(c));
    G.sparks = [];
    for (let i = 0; i < 3 && off.length; i++) { const c = off.splice(Math.floor(r() * off.length), 1)[0]; G.sparks.push([c % COLS, Math.floor(c / COLS)]); }
    restart();
  }
  /** the house again from its start: the cable reeled in, the water down */
  function restart() { G.cable = [START.slice()]; G.moves = 0; G.face = 2; G.phase = "play"; G.since = Cutaway.clock.time; }

  /** @param {string} sfx */
  const bleep = (sfx) => Cutaway.events.emit("sfx", { sfx });

  /** one move: a step on into a joined pipe, or back onto the cable (it is reeled in); the cable itself can't be crossed
   * @param {number} dx @param {number} dy @returns {string | null} what came of it ("light", "drown"), or null */
  function move(dx, dy) {
    const [x, y] = G.cable[G.cable.length - 1], nx = x + dx, ny = y + dy;
    G.face = dx > 0 ? 0 : dx < 0 ? 1 : dy < 0 ? 2 : 3;
    if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS || !joined(id(x, y), id(nx, ny))) { bleep("sr_block"); return null; }
    const back = G.cable[G.cable.length - 2];
    if (back && back[0] === nx && back[1] === ny) { G.cable.pop(); bleep("sr_reel"); }
    else if (G.cable.some(([cx, cy]) => cx === nx && cy === ny)) { bleep("sr_block"); return null; }
    else { G.cable.push([nx, ny]); bleep("sr_step"); }
    G.moves++;
    const k = G.sparks.findIndex(([sx, sy]) => sx === nx && sy === ny);
    if (k >= 0) { G.sparks.splice(k, 1); G.score += 50; bleep("sr_spark"); }
    if (nx === G.lamp[0] && ny === G.lamp[1]) {
      G.score += 100 + 25 * G.level + 10 * (ROWS - Math.floor(G.moves / G.per));
      G.phase = "lit"; G.since = Cutaway.clock.time; bleep("sr_light");
      return "light";
    }
    if (flooded(ny)) {
      G.lives--; G.phase = G.lives > 0 ? "drowned" : "over"; G.since = Cutaway.clock.time; bleep("sr_drown");
      return "drown";
    }
    return null;
  }

  /** a new game: three lives, the first house */
  function begin() { Object.assign(G, { level: 1, score: 0, lives: 3, best: false, game: G.game + 1 }); bleep("sr_start"); build(); }
  /** on from a pause (the light on, drowned): the next house, the same one again, or the table */
  function onward() {
    if (G.phase === "lit") { G.level++; build(); }
    else if (G.phase === "drowned") restart();
  }

  /** what Juno says at the end of a game: a new best is kept (a view), and she says the place it takes on the table */
  async function over(/** @type {any} */ ctx) {
    const best = Number(Cutaway.state.flag("sump_best") ?? 0);
    if (G.score <= best || G.score === 0) return Cutaway.script.exec([LINES[0]], ctx);
    G.best = true;
    await Cutaway.script.exec([{ set: "sump_best", value: G.score }], ctx);
    const place = 1 + TABLE.filter(([, s]) => s >= G.score).length;
    return Cutaway.script.exec([LINES[place]], ctx);
  }

  // { sump: "left" | "right" | "up" | "down" | "grid" | "start" } plays: an arrow or a click on the grid (one step towards the cell clicked:
  // the larger way first) is a move; START begins a game, or goes on after a pause. { sump: "title" }: what the cabinet shows as Juno
  // steps up to it, its table and PRESS START
  Cutaway.script.action("sump", async (s, ctx) => {
    // the Node tools (instant, no screen) play none of it: the game lives outside the state, and the solver's states must not differ by it
    if (Cutaway.tween.instant) return;
    const what = String(s.sump);
    if (what === "title") { G.phase = "title"; G.pipes = new Set(); return; }
    if (what === "start" || G.phase === "title" || G.phase === "over") {
      if (what === "start" || what === "grid") begin();
      return;
    }
    if (G.phase !== "play") { onward(); return; }
    let d = DIRS[what];
    if (what === "grid") {
      const [x, y] = G.cable[G.cable.length - 1], cx = Math.floor((Cutaway.input.x - GX) / CELL) - x, cy = Math.floor((Cutaway.input.y - GY) / CELL) - y;
      if (!cx && !cy) return;
      d = Math.abs(cy) >= Math.abs(cx) ? [0, Math.sign(cy)] : [Math.sign(cx), 0];
    }
    if (d && move(d[0], d[1]) === "drown" && G.phase === "over") await over(ctx);
  });

  // ---- the room: the cabinet close, its control panel's buttons (each a rect: they are)
  const A_EG = Nagiwa.at.lerche_eg;
  Cutaway.room("sump_runner", { name: "SUMP RUNNER", color: "#07060d", buttons: false, observe: true, lines: "top",
    enter: [{ sump: "title" }],
    hotspots: {
      grid: { name: "Rohre", rect: [GX, GY, CELL * COLS, CELL * ROWS], use: [{ sump: "grid" }], look: "Die Rohre eines Hauses, von der Seite. Unten steigt das Wasser." },
      left: { name: "Links", rect: A.left, use: [{ sump: "left" }] },
      up: { name: "Hoch", rect: A.up, use: [{ sump: "up" }] },
      down: { name: "Runter", rect: A.down, use: [{ sump: "down" }] },
      right: { name: "Rechts", rect: A.right, use: [{ sump: "right" }] },
      start: { name: "Start", rect: A.start, use: [{ sump: "start" }] },
      quit: { name: "Aufhören", rect: A.quit, use: [{ goto: "lerche_eg", at: A_EG.arcade, face: "ne", transition: "dissolve" }] },
    } });
  // the keyboard: the arrows (or WASD) move, Enter or Space is START, while the cabinet is open and nothing is being said
  /** @type {Record<string, string>} */
  const KEYS = { ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right", ArrowUp: "up", KeyW: "up", ArrowDown: "down", KeyS: "down", Enter: "start", Space: "start" };
  Cutaway.events.on("key", (/** @type {{code: string}} */ e) => {
    if (Cutaway.scene.room?.id !== "sump_runner" || !KEYS[e.code]) return;
    Cutaway.script.run([{ sump: KEYS[e.code] }]);
  });

  // ---- the picture, painted (art/ui/sump_runner.px.js, on the lines of the approved blocks): the cabinet, then on its screen the
  // house and its pipes, the lamp, the sparks, the cable, the rat, the water, the side field; the game's words drawn over it all
  const C = { neon: "#ff4fd3", pale: "#ffc0f2", cable: "#eea040", cableDark: "#552b1c", water: "#1d3f8a", lamp: "#ffd58a", dim: "#617aa0",
    text: "#dafcff", juno: "#ffd83a", bubble: "#4f7fe0" };
  const sprite = (/** @type {CanvasRenderingContext2D} */ ctx, /** @type {string} */ name, /** @type {number} */ x, /** @type {number} */ y, /** @type {any} */ o = {}) => {
    if (Cutaway.assets.has(name)) Cutaway.assets.draw(ctx, name, x, y, { anchor: [0, 0], frame: 0, ...o });
  };
  /** the pipe's joins at a cell (1 up, 2 right, 4 down, 8 left): the frame of ui_sr_pipe @param {number} x @param {number} y */
  const joins = (x, y) => {
    const c = id(x, y);
    return (y > 0 && joined(c, id(x, y - 1)) ? 1 : 0) | (x < COLS - 1 && joined(c, id(x + 1, y)) ? 2 : 0)
      | (y < ROWS - 1 && joined(c, id(x, y + 1)) ? 4 : 0) | (x > 0 && joined(c, id(x - 1, y)) ? 8 : 0);
  };
  Cutaway.events.on("frame.screen", (/** @type {CanvasRenderingContext2D} */ ctx) => {
    if (Cutaway.scene.room?.id !== "sump_runner") return;
    const t = Nagiwa.t, hud = Cutaway.font.get("hud"), now = Cutaway.clock.time;
    if ((G.phase === "lit" || G.phase === "drowned") && now - G.since > 1600) onward();   // a pause goes on by itself after a while too
    sprite(ctx, "ui_sr_cabinet", 0, 0, { frame: undefined, t: now });
    const [SX, SY, SW, SH] = A.screen;
    sprite(ctx, "ui_sr_house", GX, GY);
    const mid = (/** @type {number} */ c) => [GX + (c % COLS) * CELL + CELL / 2, GY + Math.floor(c / COLS) * CELL + CELL / 2];
    if (G.phase === "title" || !G.pipes.size) {
      // the table and PRESS START over the empty house
      hud.draw(ctx, t("HI-SCORE"), GX + 54, GY + 14, { color: C.neon, align: "center" });
      const best = Number(Cutaway.state.flag("sump_best") ?? 0);
      const rows = [...TABLE, ...(best ? [[JUNO, best]] : [])].sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 5);
      rows.forEach(([n, s], i) => {
        const c = n === JUNO ? C.juno : C.text;
        hud.draw(ctx, `${i + 1}. ${n === JUNO ? t(JUNO) : n}`, GX + 14, GY + 30 + i * 11, { color: c });
        hud.draw(ctx, String(s), GX + 96, GY + 30 + i * 11, { color: c, align: "right" });
      });
      if (Math.floor(now / 500) % 2) hud.draw(ctx, t("PRESS START"), GX + 54, GY + 98, { color: C.lamp, align: "center" });
    } else {
      // the pipes cell by cell, the sparks, the lamp, the cable from the start to the rat, the rat, then the water over all of it
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) { const m = joins(x, y); if (m) sprite(ctx, "ui_sr_pipe", GX + x * CELL, GY + y * CELL, { frame: m }); }
      for (const [x, y] of G.sparks) sprite(ctx, "ui_sr_spark", GX + x * CELL + 1, GY + y * CELL + 1, { frame: (Math.floor(now / 120) + x) % 4 });
      const [lx, ly] = mid(id(G.lamp[0], G.lamp[1]));
      sprite(ctx, "ui_sr_lamp", lx - 10, ly - 12, { frame: G.phase === "lit" ? 1 + (Math.floor(now / 140) % 3) : 0 });
      for (let i = 1; i < G.cable.length; i++) {
        const [ax, ay] = mid(id(G.cable[i - 1][0], G.cable[i - 1][1])), [bx, by] = mid(id(G.cable[i][0], G.cable[i][1]));
        const x = Math.min(ax, bx) - 1, y = Math.min(ay, by) - 1, w = Math.abs(ax - bx) + 2, h = Math.abs(ay - by) + 2;
        ctx.fillStyle = C.cableDark; ctx.fillRect(x + 1, y + 1, w, h);
        ctx.fillStyle = C.cable; ctx.fillRect(x, y, w, h);
      }
      const [rx, ry] = G.cable[G.cable.length - 1];
      sprite(ctx, "ui_sr_rat", GX + rx * CELL, GY + ry * CELL, { frame: G.face * 2 + (G.moves % 2) });
      const top = Math.round(GY + Math.max(0, surface()) * CELL), bottom = GY + ROWS * CELL;
      if (top < bottom) {
        ctx.globalAlpha = 0.72; ctx.fillStyle = C.water; ctx.fillRect(GX, top, CELL * COLS, bottom - top); ctx.globalAlpha = 1;
        const f = Math.floor(now / 160) % 4;
        for (let x = 0; x < CELL * COLS; x += 12) sprite(ctx, "ui_sr_wave", GX + x, top - 2, { frame: f });
        // a few bubbles rising from the drowned pipes
        ctx.fillStyle = C.bubble;
        for (let i = 0; i < 6; i++) {
          const bx = GX + 8 + ((i * 37) % (CELL * COLS - 16)), span = bottom - top - 3;
          if (span > 4) ctx.fillRect(bx, bottom - 2 - ((Math.floor(now / 90) + i * 11) % span), 1, 1);
        }
      }
      const say = G.phase === "lit" ? "LIGHTS ON" : G.phase === "drowned" ? "DROWNED" : G.phase === "over" ? "GAME OVER" : null;
      if (say) {
        sprite(ctx, "ui_sr_plate", GX + 12, GY + 51, { frame: say === "LIGHTS ON" ? 1 : 0 });
        hud.draw(ctx, t(say), GX + 54, GY + 56, { color: say === "LIGHTS ON" ? C.lamp : C.neon, align: "center" });
      }
    }
    // the side field: the level, the score, the lives, the house whose windows light up level by level
    const [PX, PY] = A.side;
    hud.draw(ctx, t("LEVEL"), PX, PY, { color: C.dim }); hud.draw(ctx, String(G.phase === "title" ? 0 : G.level), PX + 96, PY, { color: C.text, align: "right" });
    hud.draw(ctx, t("SCORE"), PX, PY + 12, { color: C.dim }); hud.draw(ctx, String(G.score), PX + 96, PY + 12, { color: C.text, align: "right" });
    for (let i = 0; i < 3; i++) {
      if (i >= (G.phase === "title" ? 3 : G.lives)) ctx.globalAlpha = 0.25;
      sprite(ctx, "ui_sr_rat", PX - 1 + i * 13, PY + 20, { frame: 0 }); ctx.globalAlpha = 1;
    }
    sprite(ctx, "ui_sr_tower", PX + 18, PY + 32);
    for (let w = 0; w < 12; w++) {
      const on = G.phase !== "title" && w < G.level - 1 + (G.phase === "lit" ? 1 : 0);
      sprite(ctx, "ui_sr_window", PX + 26 + (w % 3) * 16, PY + 52 + Math.floor(w / 3) * 15, { frame: on ? 1 : 0 });
    }
    // the tube: faint scan lines and the hall's light caught on the glass
    ctx.globalAlpha = 0.22; ctx.fillStyle = "#000";
    for (let y = SY + 1; y < SY + SH; y += 2) ctx.fillRect(SX, y, SW, 1);
    ctx.globalAlpha = 0.35; sprite(ctx, "ui_sr_glare", SX, SY); ctx.globalAlpha = 1;
    // the panel's words over its painted keys
    hud.draw(ctx, t("START"), A.start[0] + A.start[2] / 2, A.start[1] + 4, { color: C.pale, align: "center" });
    hud.draw(ctx, t("EXIT"), A.quit[0] + A.quit[2] / 2, A.quit[1] + 4, { color: C.text, align: "center" });
  });
})();

// Nagiwa: SUMP RUNNER, the arcade cabinet in the Wohnblock Lerche's hall (the user's wish and choices, 2026-11-18). It is Motte's game on
// his Tideboy (game/motte.js: "Du bist eine Kabelratte. Du ziehst Kabel durch die Rohre, und oben geht das Licht an."): a house in
// section, its pipes on a grid; the cable rat crawls one cell a move and pulls the cable behind her. She can't cross her own cable, only
// reel it in by stepping back onto it; with every move the water rises a little from below. At the lamp on top the light goes on, and in
// the next house the water comes faster. Sparks in the side pipes are worth points and cost moves.
// In turns, never timing: a click is a move (on the grid: one step towards it), and the same moves lie on the panel's arrows (a
// controller later) and on the arrow keys. A screen of its own, as Lantern's radio (the room sump_runner): the cabinet's screen fills the
// picture. Free (its coin slot is stuck) and without a flag: flavour the solver walks through and finds nothing new in; Juno's best run
// is a view (sump_best), on the high-score table under MOTTE. ON BLOCKS for the user's approval: drawn in code here, painted later.
"use strict";

(function () {
  const A = Nagiwa.at.sump_runner, [GX, GY, CELL, COLS, ROWS] = A.grid;
  Cutaway.state.view("sump_best");

  /** the table on the cabinet (Juno's best goes in where it belongs) */
  const TABLE = [["MOTTE", 6400], ["LIL", 3800], ["BAO", 2100], ["K9", 900]];
  const JUNO = "JUNO";
  Cutaway.i18n.declare("sump runner", ["SUMP RUNNER", "PRESS START", "GAME OVER", "LIGHTS ON", "DROWNED", "LEVEL", "SCORE", "HI-SCORE", "START",
    "EXIT", JUNO]);
  const LINES = Cutaway.i18n.declare("sump runner", ["Motte hätte gelacht.", "Platz zwei hinter Motte. Das erzähl ich ihm nicht.",
    "Ich hab Motte geschlagen. Das glaubt er mir nie."]);

  /** a small random of its own, so a house is the same each time it is tried again @param {number} seed */
  const rng = (seed) => () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const id = (/** @type {number} */ x, /** @type {number} */ y) => y * COLS + x;
  const DIRS = /** @type {Record<string, [number, number]>} */ ({ left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] });

  /**
   * The game, kept out of the state on purpose (it is flavour): the house (its pipes as joins between cells, the lamp, the sparks), the
   * rat's cable (the cells she has crossed, the last one where she is), the moves made in this house, how fast the water rises (moves a
   * row), the level, the score, the lives, and the phase it is in: title, play, lit, drowned, over.
   */
  const G = {
    phase: "title", level: 1, score: 0, lives: 3, moves: 0, per: 3, since: 0, best: false, game: 0,
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
  function restart() { G.cable = [START.slice()]; G.moves = 0; G.phase = "play"; G.since = Cutaway.clock.time; }

  /** @param {string} sfx */
  const bleep = (sfx) => Cutaway.events.emit("sfx", { sfx });

  /** one move: a step on into a joined pipe, or back onto the cable (it is reeled in); the cable itself can't be crossed
   * @param {number} dx @param {number} dy @returns {string | null} what came of it ("light", "drown"), or null */
  function move(dx, dy) {
    const [x, y] = G.cable[G.cable.length - 1], nx = x + dx, ny = y + dy;
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

  /** what Juno says at the end of a game: a new best is kept (a view), and it is measured against Motte's */
  async function over(/** @type {any} */ ctx) {
    const best = Number(Cutaway.state.flag("sump_best") ?? 0);
    if (G.score <= best || G.score === 0) return Cutaway.script.exec([LINES[0]], ctx);
    G.best = true;
    await Cutaway.script.exec([{ set: "sump_best", value: G.score }], ctx);
    return Cutaway.script.exec([G.score > TABLE[0][1] ? LINES[2] : LINES[1]], ctx);
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

  // ---- the picture, on blocks: the cabinet's dark body with its magenta stripes, the marquee, the screen and on it the game, the panel
  const C = { body: "#0d0b16", stripe: "#a8238a", neon: "#ff4fd3", bezel: "#232638", glass: "#04050a", pipe: "#2a6f86", pipeLit: "#62def0",
    cable: "#ffcf4a", rat: "#c8c8d8", water: "#1d3f8a", waterTop: "#4f7fe0", lamp: "#ffe27a", dim: "#41547a", text: "#d8e6ff", spark: "#ff8a3d" };
  /** @param {CanvasRenderingContext2D} ctx @param {number[]} r @param {string} c */
  const box = (ctx, [x, y, w, h], c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  Cutaway.events.on("frame.screen", (/** @type {CanvasRenderingContext2D} */ ctx) => {
    if (Cutaway.scene.room?.id !== "sump_runner") return;
    const t = Nagiwa.t, hud = Cutaway.font.get("hud"), big = Cutaway.font.get("nagiwa"), now = Cutaway.clock.time;
    if ((G.phase === "lit" || G.phase === "drowned") && now - G.since > 1600) onward();   // a pause goes on by itself after a while too
    // the body and its stripes
    box(ctx, [0, 0, 320, 180], C.body);
    for (const x of [10, 16, 302, 308]) box(ctx, [x, 0, 3, 180], C.stripe);
    // the marquee
    box(ctx, A.marquee, "#2a0f2a"); box(ctx, [A.marquee[0], A.marquee[1] + A.marquee[3] - 1, A.marquee[2], 1], C.stripe);
    big.draw(ctx, t("SUMP RUNNER"), 160, 5, { color: C.neon, align: "center" });
    // the screen in its bezel
    const [SX, SY, SW, SH] = A.screen;
    box(ctx, [SX - 4, SY - 3, SW + 8, SH + 6], C.bezel); box(ctx, A.screen, C.glass);
    // the house's pipes: a join between two cells is a pipe between their middles
    const mid = (/** @type {number} */ c) => [GX + (c % COLS) * CELL + CELL / 2, GY + Math.floor(c / COLS) * CELL + CELL / 2];
    ctx.fillStyle = G.phase === "title" ? C.dim : C.pipe;
    for (const k of G.pipes) {
      const [a, b] = k.split("-").map(Number), [ax, ay] = mid(a), [bx, by] = mid(b);
      ctx.fillRect(Math.min(ax, bx) - 2, Math.min(ay, by) - 2, Math.abs(ax - bx) + 4, Math.abs(ay - by) + 4);
    }
    if (G.phase === "title" || !G.pipes.size) {
      // the table and PRESS START
      hud.draw(ctx, t("HI-SCORE"), GX + 54, GY + 14, { color: C.neon, align: "center" });
      const best = Number(Cutaway.state.flag("sump_best") ?? 0);
      const rows = [...TABLE, ...(best ? [[JUNO, best]] : [])].sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 5);
      rows.forEach(([n, s], i) => {
        const c = n === JUNO ? C.cable : C.text;
        hud.draw(ctx, `${i + 1}. ${n === JUNO ? t(JUNO) : n}`, GX + 14, GY + 30 + i * 11, { color: c });
        hud.draw(ctx, String(s), GX + 96, GY + 30 + i * 11, { color: c, align: "right" });
      });
      if (Math.floor(now / 500) % 2) hud.draw(ctx, t("PRESS START"), GX + 54, GY + 98, { color: C.lamp, align: "center" });
    } else {
      // the lamp, the sparks, the cable from the start to the rat, the rat, then the water over all of it
      const [lx, ly] = mid(id(G.lamp[0], G.lamp[1])), lit = G.phase === "lit";
      box(ctx, [lx - 4, ly - 5, 9, 8], lit ? C.lamp : "#5a5030"); box(ctx, [lx - 2, ly + 3, 5, 2], C.dim);
      if (lit) { ctx.fillStyle = C.lamp; for (const [dx, dy] of [[-7, -1], [7, -1], [0, -9], [-6, -7], [6, -7]]) ctx.fillRect(lx + dx, ly + dy, 1, 1); }
      for (const [x, y] of G.sparks) { const [px, py] = mid(id(x, y)); box(ctx, [px - 1, py - 1, 3, 3], Math.floor(now / 250) % 2 ? C.spark : C.lamp); }
      ctx.fillStyle = C.cable;
      for (let i = 1; i < G.cable.length; i++) {
        const [ax, ay] = mid(id(G.cable[i - 1][0], G.cable[i - 1][1])), [bx, by] = mid(id(G.cable[i][0], G.cable[i][1]));
        ctx.fillRect(Math.min(ax, bx), Math.min(ay, by), Math.abs(ax - bx) + 1, Math.abs(ay - by) + 1);
      }
      const [rx, ry] = G.cable[G.cable.length - 1], [px, py] = mid(id(rx, ry));
      box(ctx, [px - 3, py - 2, 6, 4], C.rat); box(ctx, [px + 2, py - 3, 2, 2], C.rat); box(ctx, [px + 3, py - 1, 1, 1], "#ff4f6a");   // the rat, her ear, her eye
      const top = GY + Math.max(0, surface()) * CELL;
      if (top < GY + ROWS * CELL) {
        ctx.globalAlpha = 0.75; box(ctx, [GX, Math.round(top), CELL * COLS, GY + ROWS * CELL - Math.round(top)], C.water); ctx.globalAlpha = 1;
        for (let x = 0; x < CELL * COLS; x += 2) if ((x + Math.floor(now / 200)) % 6 < 4) box(ctx, [GX + x, Math.round(top), 2, 1], C.waterTop);
      }
      const say = G.phase === "lit" ? "LIGHTS ON" : G.phase === "drowned" ? "DROWNED" : G.phase === "over" ? "GAME OVER" : null;
      if (say) { box(ctx, [GX + 14, GY + 52, 80, 14], C.glass); hud.draw(ctx, t(say), GX + 54, GY + 56, { color: say === "LIGHTS ON" ? C.lamp : C.neon, align: "center" }); }
    }
    // the side panel: the level, the score, the lives, the house whose windows light up level by level
    const [PX, PY] = A.side;
    hud.draw(ctx, t("LEVEL"), PX, PY, { color: C.dim }); hud.draw(ctx, String(G.phase === "title" ? 0 : G.level), PX + 96, PY, { color: C.text, align: "right" });
    hud.draw(ctx, t("SCORE"), PX, PY + 12, { color: C.dim }); hud.draw(ctx, String(G.score), PX + 96, PY + 12, { color: C.text, align: "right" });
    for (let i = 0; i < 3; i++) { const c = i < (G.phase === "title" ? 3 : G.lives) ? C.rat : "#2a2c3a"; box(ctx, [PX + i * 12, PY + 26, 7, 4], c); box(ctx, [PX + i * 12 + 6, PY + 25, 2, 2], c); }
    box(ctx, [PX + 20, PY + 46, 56, 66], "#14172a"); box(ctx, [PX + 18, PY + 44, 60, 3], "#1f2338");
    for (let w = 0; w < 12; w++) {
      const on = G.phase !== "title" && w < G.level - 1 + (G.phase === "lit" ? 1 : 0);
      box(ctx, [PX + 26 + (w % 3) * 16, PY + 52 + Math.floor(w / 3) * 15, 10, 9], on ? C.lamp : "#22263a");
    }
    // the control panel: the four arrows, START, EXIT
    box(ctx, [40, 154, 240, 26], "#15121f"); box(ctx, [40, 154, 240, 1], C.stripe);
    /** @param {number[]} r @param {string} c */
    const key = (r, c) => { box(ctx, r, "#262238"); box(ctx, [r[0], r[1] + r[3] - 2, r[2], 2], "#0a0912"); ctx.fillStyle = c; return r; };
    const tri = (/** @type {number[]} */ [x, y, w, h], /** @type {string} */ dir) => {
      const cx = x + Math.floor(w / 2), cy = y + Math.floor((h - 2) / 2);
      for (let i = 0; i < 4; i++) {
        if (dir === "up") ctx.fillRect(cx - i, cy - 2 + i, i * 2 + 1, 1);
        if (dir === "down") ctx.fillRect(cx - i, cy + 2 - i, i * 2 + 1, 1);
        if (dir === "left") ctx.fillRect(cx - 2 + i, cy - i, 1, i * 2 + 1);
        if (dir === "right") ctx.fillRect(cx + 2 - i, cy - i, 1, i * 2 + 1);
      }
    };
    for (const d of ["left", "up", "down", "right"]) tri(key(A[d], C.pipeLit), d);
    key(A.start, C.neon); hud.draw(ctx, t("START"), A.start[0] + A.start[2] / 2, A.start[1] + 4, { color: C.neon, align: "center" });
    key(A.quit, C.text); hud.draw(ctx, t("EXIT"), A.quit[0] + A.quit[2] / 2, A.quit[1] + 4, { color: C.text, align: "center" });
  });
})();

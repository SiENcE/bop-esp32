// The editor's Iso tab (the studio loads it: studio.json "editor"): a street-mode room's map
// (art/rooms/<id>.map.js, art/lib/isomap.js) edited over the game's picture of it. The map's parts are drawn
// over the room: the floor's cells by key, the walls, the openings, the props' boxes, the spots and the lamps,
// and the walk area the map gives (as the bake will measure it). Drag a prop, an opening along its wall, a spot
// or a lamp; paint the floor's cells with a kit key; change any of them in the inspector. Save writes the map
// file back, changing only the values touched (its comments and layout stay); Bake builds the room (the task
// "art: room" with its id: art, layout, picks) and loads the new art; walk areas and spots come with Reload.
// "Where from?" (the tool, or Alt+click) names the part of the map and the kit piece that painted a pixel
// of the baked picture (the bake's picks, build/art/rooms/<id>.pick.json) and opens either at its line.
// Only the map's literal values are edited here; a part the map computes in code (the intro hall's desks)
// shows, but is edited in the file.
"use strict";

(function () {
  const E = Cutaway.editor, el = E.el, button = E.button;
  const SNAP = 0.05, COL = { floor: "#3df27a", wall: "#9a8cff", opening: "#3ae8ff", prop: "#ffa03a", spot: "#ffe14a", light: "#fff27a", walk: "#3df27a", sel: "#ff5ad8" };

  // ---------------------------------------------------------------- a JS literal with its places in the text
  // The map files are JavaScript: objects, arrays, strings, numbers, comments, now and then code (a computed
  // list). This reads the literal parts with where each value stands, so a change replaces just that value.

  /**
   * @typedef {{t: "obj" | "arr" | "str" | "num" | "lit" | "code", s: number, e: number, v?: any,
   *   props?: {key: string | null, node: Lit}[], items?: Lit[]}} Lit
   */

  /** @param {string} src @param {number} i */
  function skip(src, i) {
    for (;;) {
      while (i < src.length && /\s/.test(src[i])) i++;
      if (src.startsWith("//", i)) { const n = src.indexOf("\n", i); i = n < 0 ? src.length : n + 1; continue; }
      if (src.startsWith("/*", i)) { const n = src.indexOf("*/", i + 2); i = n < 0 ? src.length : n + 2; continue; }
      return i;
    }
  }
  /** The end of a string starting at i (its quote). @param {string} src @param {number} i */
  function strEnd(src, i) {
    const q = src[i];
    for (let j = i + 1; j < src.length; j++) { if (src[j] === "\\") j++; else if (src[j] === q) return j + 1; }
    return src.length;
  }
  /** An expression that isn't a literal: to the next , ] } at its own depth. @param {string} src @param {number} i */
  function exprEnd(src, i) {
    let d = 0;
    while (i < src.length) {
      const c = src[i];
      if (c === '"' || c === "'" || c === "`") { i = strEnd(src, i); continue; }
      if (src.startsWith("//", i) || src.startsWith("/*", i)) { i = skip(src, i); continue; }
      if (c === "(" || c === "[" || c === "{") d++;
      else if (c === ")" || c === "]" || c === "}") { if (d === 0) return i; d--; }
      else if (c === "," && d === 0) return i;
      i++;
    }
    return i;
  }
  /** @param {string} src @param {number} i @returns {Lit} */
  function value(src, i) {
    i = skip(src, i);
    const start = i, c = src[i];
    /** @type {Lit} */
    let n;
    if (c === "{") {
      n = { t: "obj", s: start, e: 0, props: [] };
      i = skip(src, i + 1);
      while (src[i] !== "}" && i < src.length) {
        if (src.startsWith("...", i)) { const e = exprEnd(src, i); /** @type {any} */ (n.props).push({ key: null, node: { t: "code", s: i, e } }); i = e; }
        else {
          let key;
          if (src[i] === '"' || src[i] === "'") { const e = strEnd(src, i); key = src.slice(i + 1, e - 1); i = e; }
          else { const m = /^[A-Za-z_$][\w$]*/.exec(src.slice(i)); if (!m) return { t: "code", s: start, e: exprEnd(src, start) }; key = m[0]; i += key.length; }
          i = skip(src, i);
          if (src[i] !== ":") return { t: "code", s: start, e: exprEnd(src, start) };
          const v = value(src, i + 1);
          /** @type {any} */ (n.props).push({ key, node: v });
          i = v.e;
        }
        i = skip(src, i);
        if (src[i] === ",") i = skip(src, i + 1);
      }
      n.e = i + 1;
    } else if (c === "[") {
      n = { t: "arr", s: start, e: 0, items: [] };
      i = skip(src, i + 1);
      while (src[i] !== "]" && i < src.length) {
        const v = value(src, i);
        /** @type {any} */ (n.items).push(v);
        i = skip(src, v.e);
        if (src[i] === ",") i = skip(src, i + 1);
      }
      n.e = i + 1;
    } else if (c === '"' || c === "'" || (c === "`" && !src.slice(i, strEnd(src, i)).includes("${"))) {
      const e = strEnd(src, i);
      n = { t: "str", s: start, e, v: src.slice(i + 1, e - 1) };
    } else if (/[-\d.]/.test(c)) {
      const m = /^-?\d*\.?\d+(?:e[+-]?\d+)?/i.exec(src.slice(i));
      n = m ? { t: "num", s: start, e: i + m[0].length, v: Number(m[0]) } : { t: "code", s: start, e: exprEnd(src, start) };
    } else {
      const m = /^(true|false|null|undefined)\b/.exec(src.slice(i));
      n = m ? { t: "lit", s: start, e: i + m[0].length } : { t: "code", s: start, e: exprEnd(src, start) };
    }
    // a literal followed by more (a call on a list, a sum): the whole is code
    const after = skip(src, n.e);
    if (n.t !== "code" && after < src.length && !",]});".includes(src[after])) return { t: "code", s: start, e: exprEnd(src, start) };
    return n;
  }
  /** A key's node in an object node. @param {Lit | undefined} o @param {string} key */
  const field = (o, key) => o?.props?.find((p) => p.key === key)?.node;
  /** The line (1-based) a place in the text is on. @param {string} src @param {number} at */
  const lineOf = (src, at) => src.slice(0, at).split("\n").length;
  /** A number as the maps write them. @param {number} x */
  const num = (x) => String(Math.round(x * 100) / 100);
  const snap = (/** @type {number} */ x) => Math.round(x / SNAP) * SNAP;

  // ---------------------------------------------------------------- the room's map, its kit, its picks

  /** @type {any} */ let ISOMAP = null;
  /** @type {{type: string, name: string, file: string, line: number}[]} */ let kitIndex = [];
  /** @type {string[]} */ let maps = [];
  /**
   * The map being edited: its file, its text and its literal tree, the value it evaluates to.
   * @type {{id: string, path: string, src: string, saved: string, root: Lit, map: any, undo: string[], redo: string[]} | null}
   */
  let cur = null;
  /** @type {{w: number, h: number, picks: any[], who: Int16Array} | null} */ let picks = null;
  let tool = "select", floorKey = "", loading = false;
  /** @type {Set<string>} the kit files the room's bake includes (art/rooms/<id>.px.js): only their pieces can be baked there */
  let kitsHere = new Set();
  /** @type {{kind: string, i: number} | null} the selected part: a prop, opening, spot (i: its name's index), light, wall */
  let sel = null;
  /** @type {string} what "Where from?" found last */
  let origin = "";
  /** @type {{id: string, kit: string, map: string, kitAt: {file: string, line: number} | null, mapLine: number} | null} */
  let originAt = null;

  async function boot() {
    if (ISOMAP || loading || !E.studio.available) return;
    loading = true;
    try {
      ISOMAP = new Function(`${await E.studio.read("art/lib/isomap.js")}\n;return ISOMAP;`)();
      maps = (await E.studio.list("art/rooms")).filter((f) => f.name.endsWith(".map.js")).map((f) => f.name.replace(/\.map\.js$/, ""));
      kitIndex = [];
      for (const f of (await E.studio.list("art/kit")).filter((x) => x.name.endsWith(".js"))) {
        const file = `art/kit/${f.name}`, text = await E.studio.read(file);
        for (const m of text.matchAll(/ISOKIT\.(floor|wall|opening|prop|stairs)\(\s*(["'`])([^"'`]+)\2/g)) kitIndex.push({ type: m[1], name: m[3], file, line: lineOf(text, /** @type {number} */ (m.index)) });
      }
    } catch (e) { E.setStatus(`iso: ${/** @type {any} */ (e).message}`); }
    loading = false;
    const here = Cutaway.scene.room?.id;
    if (here && maps.includes(here)) await open(here); else E.refresh();
  }

  /** Read a map's text into the editor. @param {string} id */
  async function open(id) {
    const path = `art/rooms/${id}.map.js`;
    try {
      const src = await E.studio.read(path);
      cur = { id, path, src, saved: src, root: rootOf(src, id), map: evalMap(src, id), undo: [], redo: [] };
      kitsHere = new Set();
      try { for (const m of (await E.studio.read(`art/rooms/${id}.px.js`)).matchAll(/include\(\s*["'`]\.\.\/kit\/([^"'`]+)["'`]/g)) kitsHere.add(`art/kit/${m[1]}`); } catch { /* no bake file */ }
      sel = null; origin = ""; originAt = null; picks = null;
      loadPicks();
    } catch (e) { E.setStatus(`iso: ${/** @type {any} */ (e).message}`); cur = null; }
    E.refresh();
  }
  /** @param {string} src @param {string} id */
  function rootOf(src, id) {
    const m = new RegExp(`ISO_MAPS\\.${id}\\s*=`).exec(src);
    if (!m) throw new Error(`no "ISO_MAPS.${id} =" in the map`);
    return value(src, m.index + m[0].length);
  }
  /** The map as saved last (what the bake built, if it ran since), read once per saved text. */
  let savedOf = "", savedVal = /** @type {any} */ (null);
  const savedMap = () => { if (cur && savedOf !== cur.saved) { savedOf = cur.saved; try { savedVal = evalMap(cur.saved, cur.id); } catch { savedVal = null; } } return savedVal; };
  /** @param {string} src @param {string} id */
  const evalMap = (src, id) => new Function("ISO_MAPS", `${src}\n;return ISO_MAPS[${JSON.stringify(id)}];`)({});

  async function loadPicks() {
    if (!cur) return;
    try {
      const d = JSON.parse(await E.studio.read(`build/art/rooms/${cur.id}.pick.json`));
      const who = new Int16Array(d.w * d.h);
      for (let k = 0, i = 0; k < d.runs.length; k += 2) { who.fill(d.runs[k], i, i + d.runs[k + 1]); i += d.runs[k + 1]; }
      picks = { w: d.w, h: d.h, picks: d.picks, who };
    } catch { picks = null; }
  }

  /** Change the text (one step of undo) and read it again. @param {string} src */
  function change(src) {
    if (!cur || src === cur.src) return;
    let map;
    try { map = evalMap(src, cur.id); } catch (e) { E.setStatus(`iso: the change broke the map (${/** @type {any} */ (e).message})`); return; }
    cur.undo.push(cur.src); cur.redo = [];
    cur.src = src; cur.root = rootOf(src, cur.id); cur.map = map;
    E.refresh();
  }
  /** Replace a node's text. @param {Lit} n @param {string} text */
  const put = (n, text) => cur && change(cur.src.slice(0, n.s) + text + cur.src.slice(n.e));
  /** Set a key of an object node (added before its closing brace if it has none). @param {Lit} o @param {string} key @param {string} text */
  function setKey(o, key, text) {
    if (!cur) return;
    const f = field(o, key);
    if (f) { put(f, text); return; }
    const last = o.props?.[o.props.length - 1]?.node, at = last ? last.e : o.s + 1;
    change(cur.src.slice(0, at) + `${last ? ", " : " "}${key}: ${text}` + cur.src.slice(at));
  }
  /** Add an item at the end of an array node, on a line of its own like the one before. @param {Lit} a @param {string} text */
  function addItem(a, text) {
    if (!cur || !a.items) return;
    const last = a.items[a.items.length - 1];
    if (!last) { put(a, `[${text}]`); return; }
    const lineStart = cur.src.lastIndexOf("\n", last.s) + 1, indent = /^\s*/.exec(cur.src.slice(lineStart))?.[0] ?? "    ";
    change(cur.src.slice(0, last.e) + `,\n${indent}${text}` + cur.src.slice(last.e));
  }
  /** Take an item out of an array node (with its comma). @param {Lit} a @param {number} k */
  function removeItem(a, k) {
    if (!cur || !a.items?.[k]) return;
    const it = a.items[k], prev = a.items[k - 1], next = a.items[k + 1];
    if (prev) change(cur.src.slice(0, prev.e) + cur.src.slice(it.e));
    else if (next) change(cur.src.slice(0, it.s) + cur.src.slice(next.s));
    else put(a, "[]");
  }

  /** A list's node and the item of one part (by its index in the map's value), or null when the map computes it. @param {string} list @param {number} i */
  function itemNode(list, i) {
    const a = field(cur?.root, list);
    if (!a || a.t !== "arr" || !a.items) return null;
    return { a, n: a.items[i]?.t === "obj" ? a.items[i] : null };
  }

  // ---------------------------------------------------------------- geometry over the picture

  const P = (/** @type {number} */ u, /** @type {number} */ v, h = 0) => ISOMAP.projector(cur?.map).P(u, v, h);
  const uvAt = (/** @type {number} */ x, /** @type {number} */ y) => ISOMAP.projector(cur?.map).uvAt(x, y);
  /** The points around a set (a box's outline on the screen). @param {number[][]} pts */
  function hull(pts) {
    const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cross = (/** @type {number[]} */ o, /** @type {number[]} */ a, /** @type {number[]} */ b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    /** @type {number[][]} */ const lo = [], hi = [];
    for (const q of p) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (const q of p.slice().reverse()) { while (hi.length >= 2 && cross(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop(); hi.push(q); }
    return lo.slice(0, -1).concat(hi.slice(0, -1));
  }
  /** @param {number[][]} poly @param {number} x @param {number} y */
  function inside(poly, x, y) {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  }
  /** A prop's box on the screen. @param {any} p */
  const propHull = (p) => {
    const [u, v] = p.at, [du, dv] = p.foot, pts = [];
    for (const h of [0, p.h ?? 0]) for (const [a, b] of [[u, v], [u + du, v], [u + du, v + dv], [u, v + dv]]) pts.push(P(a, b, h));
    return hull(pts);
  };
  /** An opening's rect on its wall, on the screen. @param {any} o */
  function openingQuad(o) {
    const w = cur?.map.walls[o.wall], alongU = w.from[1] === w.to[1], base = alongU ? w.from[0] : w.from[1], plane = alongU ? w.from[1] : w.from[0];
    const at = (/** @type {number} */ s, /** @type {number} */ h) => (alongU ? P(base + s, plane, h) : P(plane, base + s, h));
    return [at(o.from, o.h[0]), at(o.to, o.h[0]), at(o.to, o.h[1]), at(o.from, o.h[1])];
  }
  /** A wall's face on the screen. @param {any} w */
  const wallQuad = (w) => [P(w.from[0], w.from[1]), P(w.to[0], w.to[1]), P(w.to[0], w.to[1], w.stub ? 0.17 : w.h), P(w.from[0], w.from[1], w.stub ? 0.17 : w.h)];
  const spotNames = () => Object.keys(cur?.map.spots ?? {});

  /** What is under a point of the room (room pixels): the smallest first. @param {number} x @param {number} y */
  function hit(x, y) {
    if (!cur) return null;
    const m = cur.map;
    const names = spotNames();
    for (let i = 0; i < names.length; i++) { const s = m.spots[names[i]], [px, py] = P(s[0], s[1], s[3] ?? 0); if (Math.abs(px - x) <= 4 && Math.abs(py - y) <= 4) return { kind: "spot", i }; }
    for (let i = 0; i < (m.lights ?? []).length; i++) { const l = m.lights[i], [px, py] = P(l.at[0], l.at[1], l.at[2] ?? 0); if (Math.hypot(px - x, py - y) <= 5) return { kind: "light", i }; }
    // the props: the one in front first (the larger u + v at its far corner)
    const props = (m.props ?? []).map((p, i) => ({ p, i })).filter(({ p }) => !p.behind).sort((a, b) => (b.p.at[0] + b.p.foot[0] + b.p.at[1] + b.p.foot[1]) - (a.p.at[0] + a.p.foot[0] + a.p.at[1] + a.p.foot[1]));
    for (const { p, i } of props) if (inside(propHull(p), x, y)) return { kind: "prop", i };
    for (let i = 0; i < (m.openings ?? []).length; i++) if (inside(openingQuad(m.openings[i]), x, y)) return { kind: "opening", i };
    for (let i = 0; i < m.walls.length; i++) if (inside(wallQuad(m.walls[i]), x, y)) return { kind: "wall", i };
    return null;
  }

  // ---------------------------------------------------------------- drawing over the picture

  /** @param {CanvasRenderingContext2D} ctx */
  function render(ctx) {
    if (!cur || !ISOMAP) return;
    const m = cur.map;
    /** @param {number[][]} pts @param {string} color @param {boolean} [fill] @param {boolean} [hot] */
    const poly = (pts, color, fill, hot) => {
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x + 0.5, y + 0.5) : ctx.moveTo(x + 0.5, y + 0.5))); ctx.closePath();
      if (fill) { ctx.globalAlpha = 0.18; ctx.fillStyle = color; ctx.fill(); ctx.globalAlpha = 1; }
      ctx.strokeStyle = hot ? COL.sel : color; ctx.lineWidth = hot ? 1.5 : 1; ctx.stroke();
    };
    const is = (/** @type {string} */ kind, /** @type {number} */ i) => !!sel && sel.kind === kind && sel.i === i;
    // the walk area as the bake will measure it
    try {
      const lay = ISOMAP.layout(m);
      ctx.setLineDash([2, 2]);
      for (const loop of lay.walk) { const pts = []; for (let k = 0; k < loop.length; k += 2) pts.push([loop[k], loop[k + 1]]); poly(pts, COL.walk); }
      ctx.setLineDash([]);
    } catch { /* a map half changed */ }
    if (tool === "floor") {
      // the cells by key, each key its own tint
      const keys = [...new Set(m.floor.join("").replace(/\./g, ""))];
      m.floor.forEach((/** @type {string} */ row, /** @type {number} */ j) => [...row].forEach((k, i) => {
        if (k === ".") return;
        const u = i * m.cell, v = j * m.cell, hue = (keys.indexOf(k) * 67) % 360;
        poly([P(u, v), P(u + m.cell, v), P(u + m.cell, v + m.cell), P(u, v + m.cell)], `hsl(${hue} 80% 60%)`, true);
      }));
    }
    m.walls.forEach((/** @type {any} */ w, /** @type {number} */ i) => poly(wallQuad(w), COL.wall, false, is("wall", i)));
    (m.openings ?? []).forEach((/** @type {any} */ o, /** @type {number} */ i) => poly(openingQuad(o), COL.opening, true, is("opening", i)));
    // a prop moved since the bake: its sprite where it will stand (the bake draws it anew there), over its old place
    const baked = /** @type {any} */ (window).Nagiwa?.layouts?.[cur.id]?.props ?? {}, was = savedMap();
    for (const p of m.props ?? []) {
      const b = baked[p.id], o = was?.props?.find((/** @type {any} */ q) => q.id === p.id);
      if (!b?.sprite || !o || (o.at[0] === p.at[0] && o.at[1] === p.at[1])) continue;
      const [x0, y0] = P(o.at[0], o.at[1]), [x1, y1] = P(p.at[0], p.at[1]);
      Cutaway.assets.draw(ctx, b.sprite, b.at[0] + x1 - x0, b.at[1] + y1 - y0, { alpha: 0.85, frame: 0 });
    }
    (m.props ?? []).forEach((/** @type {any} */ p, /** @type {number} */ i) => { if (!p.behind) poly(propHull(p), COL.prop, false, is("prop", i)); });
    spotNames().forEach((n, i) => {
      const s = m.spots[n], [x, y] = P(s[0], s[1], s[3] ?? 0);
      ctx.strokeStyle = is("spot", i) ? COL.sel : COL.spot; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x - 3, y + 0.5); ctx.lineTo(x + 4, y + 0.5); ctx.moveTo(x + 0.5, y - 3); ctx.lineTo(x + 0.5, y + 4); ctx.stroke();
    });
    (m.lights ?? []).forEach((/** @type {any} */ l, /** @type {number} */ i) => {
      const [x, y] = P(l.at[0], l.at[1], l.at[2] ?? 0);
      ctx.strokeStyle = is("light", i) ? COL.sel : COL.light; ctx.beginPath(); ctx.arc(x + 0.5, y + 0.5, 3, 0, Math.PI * 2); ctx.stroke();
    });
  }

  // ---------------------------------------------------------------- the pointer

  /** @type {{kind: string, i: number, uv: number[], orig: any, moved: boolean} | null} */
  let dragging = null;

  /** @param {{x: number, y: number}} p @param {"down" | "move" | "up"} phase @param {PointerEvent} e */
  function drag(p, phase, e) {
    if (!cur || !ISOMAP) return false;
    const m = cur.map;
    if (phase === "down") {
      if (e.button !== 0) return false;
      if (tool === "where" || e.altKey) { whereFrom(Math.floor(p.x), Math.floor(p.y)); return true; }
      if (tool === "floor") { paintCell(p); dragging = { kind: "floor", i: 0, uv: [], orig: null, moved: true }; return true; }
      sel = hit(p.x, p.y);
      E.refresh();
      if (!sel || sel.kind === "wall") return true;
      const it = partOf(sel);
      dragging = { kind: sel.kind, i: sel.i, uv: uvAt(p.x, p.y), orig: JSON.parse(JSON.stringify(it)), moved: false };
      return true;
    }
    if (!dragging) return true;
    if (phase === "move") {
      if (dragging.kind === "floor") { paintCell(p); return true; }
      const [u, v] = uvAt(p.x, p.y), du = snap(u - dragging.uv[0]), dv = snap(v - dragging.uv[1]), o = dragging.orig, it = partOf(dragging);
      if (!du && !dv && !dragging.moved) return true;
      dragging.moved = true;
      if (dragging.kind === "prop") it.at = [snap(o.at[0] + du), snap(o.at[1] + dv)];
      if (dragging.kind === "light") it.at = [snap(o.at[0] + du), snap(o.at[1] + dv), o.at[2]];
      if (dragging.kind === "spot") m.spots[spotNames()[dragging.i]] = [snap(o[0] + du), snap(o[1] + dv), ...o.slice(2)];
      if (dragging.kind === "opening") {
        const w = m.walls[o.wall], d = w.from[1] === w.to[1] ? du : dv;
        it.from = Math.round((o.from + d) * 100) / 100; it.to = Math.round((o.to + d) * 100) / 100;
      }
      return true;
    }
    // up: what was dragged goes into the text, one step of undo
    const d = dragging;
    dragging = null;
    if (d.kind === "floor" || !d.moved) return true;
    const it = d.kind === "spot" ? m.spots[spotNames()[d.i]] : partOf(d);
    commit(d.kind, d.i, it);
    return true;
  }

  /** The value of a part in the map. @param {{kind: string, i: number}} s */
  function partOf(s) {
    const m = cur?.map;
    return s.kind === "prop" ? m.props[s.i] : s.kind === "opening" ? m.openings[s.i] : s.kind === "light" ? m.lights[s.i] : s.kind === "wall" ? m.walls[s.i] : m.spots[spotNames()[s.i]];
  }

  /** Write a dragged part's new place into the text. @param {string} kind @param {number} i @param {any} it */
  function commit(kind, i, it) {
    if (!cur) return;
    if (kind === "spot") {
      const spots = field(cur.root, "spots"), n = field(spots, spotNames()[i]);
      if (n?.t === "arr") put(n, `[${it.map((/** @type {any} */ x) => (typeof x === "number" ? num(x) : JSON.stringify(x))).join(", ")}]`);
      else E.setStatus("iso: this spot is computed in the map's code: change it in the file");
      return;
    }
    const list = kind === "prop" ? "props" : kind === "opening" ? "openings" : "lights", node = itemNode(list, i)?.n;
    if (!node) { E.setStatus(`iso: this ${kind} is computed in the map's code: change it in the file`); cur.map = evalMap(cur.src, cur.id); return; }
    if (kind === "opening") {
      // both ends in one change (one step of undo): the later one first, so the earlier place stays where it is
      const f = field(node, "from"), t = field(node, "to");
      if (!f || !t) return;
      const [a, b] = f.s < t.s ? [[f, it.from], [t, it.to]] : [[t, it.to], [f, it.from]];
      change(cur.src.slice(0, a[0].s) + num(a[1]) + cur.src.slice(a[0].e, b[0].s) + num(b[1]) + cur.src.slice(b[0].e));
      return;
    }
    const at = field(node, "at");
    if (at) put(at, `[${it.at.map((/** @type {number} */ x) => num(x)).join(", ")}]`);
  }

  /** Paint the floor cell under a point with the key picked. @param {{x: number, y: number}} p */
  function paintCell(p) {
    if (!cur || !floorKey) return;
    const m = cur.map, [u, v] = uvAt(p.x, p.y), i = Math.floor(u / m.cell), j = Math.floor(v / m.cell);
    const rows = field(cur.root, "floor");
    if (!rows?.items?.[j] || rows.items[j].t !== "str" || i < 0 || i >= m.floor[j].length || m.floor[j][i] === floorKey) return;
    const row = m.floor[j], next = row.slice(0, i) + floorKey + row.slice(i + 1);
    put(rows.items[j], JSON.stringify(next));
  }

  // ---------------------------------------------------------------- where a pixel comes from

  /** Name the part and the kit piece that painted a pixel of the baked picture. @param {number} x @param {number} y */
  function whereFrom(x, y) {
    if (!cur) return;
    if (!picks) { origin = "No picks for this room yet: Bake it once (the bake writes which part painted each pixel)."; originAt = null; E.refresh(); return; }
    const k = picks.who[y * picks.w + x], el = picks.picks[k];
    if (!el) { origin = `(${x}, ${y}): nothing of the map (the background fill)`; originAt = null; E.refresh(); return; }
    const type = el.kind === "behind" ? "opening" : el.kind;
    const kit = kitIndex.find((q) => q.type === type && q.name === el.kit) ?? null;
    // the part's line in the map
    let mapLine = 0, what = "";
    const root = cur.root;
    if (el.kind === "floor") {
      const [u, v] = uvAt(x + 0.5, y + 0.5), j = Math.floor(v / cur.map.cell), i = Math.floor(u / cur.map.cell);
      const row = field(root, "floor")?.items?.[j];
      if (row) mapLine = lineOf(cur.src, row.s);
      what = `the floor, key "${el.key}" (cell ${i}, ${j})`;
    } else if (el.kind === "wall") {
      const n = field(root, "walls")?.items?.[el.i]; if (n) mapLine = lineOf(cur.src, n.s);
      what = `wall ${el.i}`; sel = { kind: "wall", i: el.i };
    } else if (el.kind === "opening" || el.kind === "behind" || el.kind === "prop") {
      const list = el.kind === "prop" ? "props" : "openings", i = (cur.map[list] ?? []).findIndex((/** @type {any} */ q) => q.id === el.id);
      const n = i >= 0 ? field(root, list)?.items?.[i] : null; if (n) mapLine = lineOf(cur.src, n.s);
      what = `${el.kind === "behind" ? "the room behind opening" : el.kind} "${el.id}"`; if (i >= 0) sel = { kind: el.kind === "prop" ? "prop" : "opening", i };
    } else if (el.kind === "stairs") { const n = field(root, "stairs"); if (n) mapLine = lineOf(cur.src, n.s); what = `the stairs "${el.id}"`; }
    origin = `(${x}, ${y}): ${what}, kit piece ${type} "${el.kit}"`;
    originAt = { id: el.id ?? "", kit: el.kit, map: cur.path, kitAt: kit ? { file: kit.file, line: kit.line } : null, mapLine };
    E.refresh();
  }

  // ---------------------------------------------------------------- the inspector

  const st = { width: "54px" };
  /** A number field. @param {string} label @param {number} v @param {(x: number) => void} set */
  const numField = (label, v, set) => el("label", { style: { marginRight: "6px" } }, [`${label} `, el("input", { value: num(v), style: st,
    onchange: (/** @type {any} */ e) => { const x = Number(e.target.value); if (Number.isFinite(x)) set(x); } })]);
  /** The kit pieces of a kind this room's bake has (its included kits; all when it names none). @param {string} type */
  const piecesHere = (type) => kitIndex.filter((q) => q.type === type && (!kitsHere.size || kitsHere.has(q.file)));
  /** The kit pieces of a kind, as a select. @param {string} type @param {string} v @param {(x: string) => void} set */
  const kitSelect = (type, v, set) => el("select", { onchange: (/** @type {any} */ e) => set(e.target.value) },
    [...new Set([v, ...piecesHere(type).map((q) => q.name)])].map((n) => el("option", { value: n, textContent: n, selected: n === v })));

  function build(/** @type {HTMLElement} */ box) {
    if (!E.studio.available) { box.append(el("div", { className: "cw-dim" }, ["The Iso tab works with the studio (node lib/cutaway/tools/studio.mjs): it reads and writes the room's map."])); return; }
    if (!ISOMAP) { box.append(el("div", { className: "cw-dim" }, [loading ? "reading the maps and kits ..." : "..."])); boot(); return; }
    box.append(el("div", { style: { margin: "4px 0" } }, ["map ", el("select", { onchange: async (/** @type {any} */ e) => { const id = e.target.value; if (!id) return; if (Cutaway.room.ids().includes(id)) await E.openRoom(id); await open(id); } },
      [el("option", { value: "", textContent: "(a room's map)" }), ...maps.map((id) => el("option", { value: id, textContent: id, selected: id === cur?.id }))])]));
    if (!cur) { box.append(el("div", { className: "cw-dim" }, ["This room has no map (art/rooms/<id>.map.js). Pick one above."])); return; }
    const dirty = cur.src !== cur.saved;
    box.append(el("div", { style: { margin: "4px 0" } }, [
      button(`Save${dirty ? " *" : ""}`, () => { save(); }, `write ${cur.path} (only the values changed)`),
      button("Bake", () => { bake(); }, 'build the room\'s art from the map (the task "art: room") and load it'),
      button("Reload game", () => location.reload(), "the walk area, spots and props' places come into the game with a reload (after Bake)")]));
    box.append(el("div", { style: { margin: "4px 0" } }, [["select", "Move"], ["floor", "Floor"], ["where", "Where from?"]].map(([t, label]) =>
      button(tool === t ? `● ${label}` : label, () => { tool = t; E.refresh(); }, t === "select" ? "pick and drag props, openings, spots, lamps" : t === "floor" ? "paint the floor's cells with a kit key" : "which part of the map and which kit piece painted a pixel (also Alt+click)"))));
    if (tool === "floor") {
      const keys = [...new Set([...piecesHere("floor").map((q) => q.name), ...cur.map.floor.join("").replace(/\./g, "")]), "."];
      box.append(el("div", { className: "cw-sec" }, [el("div", { className: "cw-dim" }, ["the key to paint (kit floors; \".\" no floor):"]),
        el("div", {}, keys.map((k) => button(floorKey === k ? `● ${k}` : k, () => { floorKey = k; E.refresh(); }, kitIndex.find((q) => q.type === "floor" && q.name === k)?.file ?? (k === "." ? "no floor" : "")))) ]));
    }
    if (origin) {
      box.append(el("div", { className: "cw-sec" }, [el("div", {}, [origin]),
        ...(originAt?.kitAt ? [el("div", { style: { cursor: "pointer", color: "#7ad8ff" }, title: "open the kit piece in the pxl source view", onclick: () => { const k = /** @type {any} */ (originAt).kitAt; E.modules.art?.openSource(k.file, k.line); } }, [`kit: ${originAt.kitAt.file}:${originAt.kitAt.line}`])] : []),
        ...(originAt?.mapLine ? [el("div", { style: { cursor: "pointer", color: "#7ad8ff" }, title: "open the map at this part", onclick: () => { const o = /** @type {any} */ (originAt); E.modules.art?.openSource(o.map, o.mapLine); } }, [`map: ${originAt.map}:${originAt.mapLine}`])] : [])]));
    }
    if (sel) box.append(details());
    else box.append(el("div", { className: "cw-dim" }, ["Click a part over the picture: a prop (orange), an opening (cyan), a spot (yellow), a lamp, a wall. Drag to move it (0.05 m steps)."]));
    box.append(el("div", { className: "cw-dim", style: { marginTop: "6px" } }, [`${(cur.map.props ?? []).length} props · ${(cur.map.openings ?? []).length} openings · ${spotNames().length} spots · ${(cur.map.lights ?? []).length} lamps; the dashed green line is the walk area the map gives`]));
  }

  /** The selected part's fields. */
  function details() {
    const s = /** @type {{kind: string, i: number}} */ (sel), it = partOf(s), sec = el("div", { className: "cw-sec" });
    if (!it) return sec;
    const list = s.kind === "prop" ? "props" : s.kind === "opening" ? "openings" : s.kind === "light" ? "lights" : s.kind === "wall" ? "walls" : "";
    const node = list ? itemNode(list, s.i)?.n : field(field(cur?.root, "spots"), spotNames()[s.i]);
    const computed = !node;
    const title = s.kind === "spot" ? `spot "${spotNames()[s.i]}"` : `${s.kind} ${it.id ? `"${it.id}"` : s.i}`;
    sec.append(el("div", { style: { fontWeight: "bold" } }, [title]));
    if (computed) { sec.append(el("div", { className: "cw-dim" }, ["computed in the map's code: change it in the file"])); return sec; }
    const n = /** @type {Lit} */ (node), set = (/** @type {string} */ key, /** @type {string} */ text) => setKey(n, key, text);
    const pair = (/** @type {number[]} */ a) => `[${a.map((x) => num(x)).join(", ")}]`;
    if (s.kind === "prop") {
      sec.append(el("div", {}, ["kit ", kitSelect("prop", it.kit, (k) => set("kit", JSON.stringify(k)))]),
        el("div", {}, [numField("u", it.at[0], (x) => set("at", pair([x, it.at[1]]))), numField("v", it.at[1], (x) => set("at", pair([it.at[0], x])))]),
        el("div", {}, [numField("du", it.foot[0], (x) => set("foot", pair([x, it.foot[1]]))), numField("dv", it.foot[1], (x) => set("foot", pair([it.foot[0], x]))), numField("h", it.h ?? 0, (x) => set("h", num(x)))]),
        el("label", {}, [el("input", { type: "checkbox", checked: it.block !== false, onchange: (/** @type {any} */ e) => set("block", e.target.checked ? "true" : "false") }), " blocks the way"]),
        el("div", { style: { marginTop: "4px" } }, [
          button("Duplicate", () => { const a = itemNode("props", s.i)?.a; if (a && cur) { addItem(a, cur.src.slice(n.s, n.e).replace(/id:\s*"([^"]+)"/, (m0, id) => `id: "${id}_2"`)); sel = { kind: "prop", i: cur.map.props.length - 1 }; } }, "a copy at the end of the props (its id with _2)"),
          button("Delete", () => { const a = itemNode("props", s.i)?.a; if (a) { removeItem(a, s.i); sel = null; } }, "take it out of the map")]));
    } else if (s.kind === "opening") {
      sec.append(el("div", {}, [`on wall ${it.wall} · kit `, kitSelect("opening", it.kit, (k) => set("kit", JSON.stringify(k)))]),
        el("div", {}, [numField("from", it.from, (x) => set("from", num(x))), numField("to", it.to, (x) => set("to", num(x)))]),
        el("div", {}, [numField("h0", it.h[0], (x) => set("h", pair([x, it.h[1]]))), numField("h1", it.h[1], (x) => set("h", pair([it.h[0], x])))]));
    } else if (s.kind === "spot") {
      const name = spotNames()[s.i], v = cur?.map.spots[name];
      const w = (/** @type {number} */ k, /** @type {any} */ x) => { const a = v.slice(); a[k] = x; put(n, `[${a.map((/** @type {any} */ y) => (typeof y === "number" ? num(y) : JSON.stringify(y))).join(", ")}]`); };
      sec.append(el("div", {}, [numField("u", v[0], (x) => w(0, x)), numField("v", v[1], (x) => w(1, x)), numField("h", v[3] ?? 0, (x) => w(3, x))]),
        el("div", {}, ["face ", el("select", { onchange: (/** @type {any} */ e) => w(2, e.target.value) }, ["n", "ne", "e", "se", "s", "sw", "w", "nw"].map((f) => el("option", { value: f, textContent: f, selected: f === v[2] })))]));
    } else if (s.kind === "light") {
      sec.append(el("div", {}, [numField("u", it.at[0], (x) => set("at", pair([x, it.at[1], it.at[2]]))), numField("v", it.at[1], (x) => set("at", pair([it.at[0], x, it.at[2]]))), numField("h", it.at[2] ?? 0, (x) => set("at", pair([it.at[0], it.at[1], x])))]),
        el("div", {}, [numField("power", it.power ?? 1, (x) => set("power", num(x))), numField("r", it.r ?? 0, (x) => set("r", num(x)))]),
        el("div", { className: "cw-dim" }, ["the game's light; the baked light is its \"bake\" (in the file)"]));
    } else if (s.kind === "wall") {
      sec.append(el("div", {}, ["kit ", kitSelect("wall", it.kit, (k) => set("kit", JSON.stringify(k))), " ", numField("h", it.h, (x) => set("h", num(x)))]));
    }
    // its line in the map
    if (cur) { const at = lineOf(cur.src, n.s), path = cur.path; sec.append(el("div", { style: { cursor: "pointer", color: "#7ad8ff", marginTop: "4px" }, onclick: () => { E.modules.art?.openSource(path, at); } }, [`map: ${path}:${at}`])); }
    return sec;
  }

  async function save() {
    if (!cur) return;
    E.setStatus(await E.saveFile(cur.path, cur.src));
    cur.saved = cur.src;
    E.refresh();
  }

  async function bake() {
    if (!cur) return;
    if (cur.src !== cur.saved) await save();
    const id = cur.id, r = await E.runTask("art: room", { room: id });
    if (r.code !== 0) return;
    await E.modules.art?.reloadArt().catch((/** @type {any} */ e) => E.setStatus(String(e.message)));
    await loadPicks();
    E.setStatus(`${id} baked: the art is in; the walk area, spots and props' places come with Reload game`);
    E.refresh();
  }

  /** Arrows nudge the selected part along the floor's axes (right/left: u, down/up: v; Shift: 0.25 m). @param {KeyboardEvent} e */
  function key(e) {
    if (!cur || !sel || sel.kind === "wall") return false;
    const d = /** @type {Record<string, number[]>} */ ({ ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] })[e.key];
    if (!d) return false;
    const k = e.shiftKey ? 0.25 : SNAP, du = d[0] * k, dv = d[1] * k, it = partOf(sel);
    if (sel.kind === "spot") commit("spot", sel.i, [snap(it[0] + du), snap(it[1] + dv), ...it.slice(2)]);
    else if (sel.kind === "opening") { const w = cur.map.walls[it.wall], s = w.from[1] === w.to[1] ? du : dv; commit("opening", sel.i, { from: it.from + s, to: it.to + s }); }
    else commit(sel.kind, sel.i, { at: [snap(it.at[0] + du), snap(it.at[1] + dv), ...(sel.kind === "light" ? [it.at[2]] : [])] });
    return true;
  }

  E.tab({ id: "iso", label: "Iso", build, render, drag, key,
    save: () => save(),
    undo: () => { if (cur?.undo.length) { cur.redo.push(cur.src); const s = /** @type {string} */ (cur.undo.pop()); cur.src = s; cur.root = rootOf(s, cur.id); cur.map = evalMap(s, cur.id); E.refresh(); } },
    redo: () => { if (cur?.redo.length) { cur.undo.push(cur.src); const s = /** @type {string} */ (cur.redo.pop()); cur.src = s; cur.root = rootOf(s, cur.id); cur.map = evalMap(s, cur.id); E.refresh(); } },
    selectNone: () => { sel = null; origin = ""; E.refresh(); },
    onRoom: () => { const id = Cutaway.scene.room?.id; if (ISOMAP && id && maps.includes(id) && id !== cur?.id && (!cur || cur.src === cur.saved)) open(id); },
    get unsaved() { return cur && cur.src !== cur.saved ? 1 : 0; } });
  E.modules.iso = { open, whereFrom, hit, get map() { return cur?.map; }, get src() { return cur?.src; }, get selected() { return sel; }, select(/** @type {any} */ s) { sel = s; E.refresh(); }, commit, paintCell, setTool(/** @type {string} */ t, /** @type {string} */ k) { tool = t; if (k !== undefined) floorKey = k; E.refresh(); }, get origin() { return origin; }, get originAt() { return originAt; }, boot, value, field };
})();

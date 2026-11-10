// The editor's Iso-Editor tab (the studio loads it: studio.json "editor"): a street-mode room's map
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
  const SNAP = 0.05, COL = { stairs: "#ff8a3a", nowalk: "#ff4a5a", floor: "#3df27a", wall: "#9a8cff", opening: "#3ae8ff", prop: "#ffa03a", spot: "#ffe14a", light: "#fff27a", walk: "#3df27a", sel: "#ff5ad8", hover: "#ffffff", tool: "#d8d0f0" };

  // ---------------------------------------------------------------- icons
  // 12x12 pixel icons, each in the colour its part has over the picture (so the buttons are the legend too):
  // "#" the colour, "+" lighter, "o" darker; drawn twice as large, sharp
  const ICONS = /** @type {Record<string, string[]>} */ ({
    move: ["#...........", "##..........", "#+#.........", "#++#........", "#+++#.......", "#++++#......", "#+++++#.....", "#++++++#....", "#++####.....", "#+#.#+#.....", "##...#+#....", ".....###...."],
    add: ["............", ".....##.....", ".....##.....", ".....##.....", ".....##.....", ".##########.", ".##########.", ".....##.....", ".....##.....", ".....##.....", ".....##.....", "............"],
    floor: ["............", "............", ".....##.....", "...++##oo...", ".##++##oo##.", "#oo##oo##++#", ".##oo##++##.", "...##++##...", ".....##.....", "............", "............", "............"],
    where: ["..####......", ".#++++#.....", "#++..++#....", "#+....+#....", "#+....+#....", "#++..++#....", ".#++++#.....", "..####oo....", "......ooo...", ".......ooo..", "........ooo.", ".........oo."],
    prop: [".....++.....", "...++++++...", ".++++++++++.", "++++++++++++", "oo++++++++##", "oooo++++####", "oooooo######", "oooooo######", "oooooo######", "oooooo######", "..oooo####..", "....oo##...."],
    wall: ["++..........", "##++........", "####++......", "######++....", "########++..", "##########++", "############", "############", "oo##########", "..oooo######", "....oooo####", "......oooooo"],
    opening: ["..########..", "..#oooooo#..", "..#oooooo#..", "..#oooooo#..", "..#oooooo#..", "..#oooooo#..", "..#oooo++#..", "..#oooooo#..", "..#oooooo#..", "..#oooooo#..", "..#oooooo#..", "############"],
    spot: [".....##.....", ".....##.....", ".....##.....", "............", ".....++.....", "###.++++.###", "###.++++.###", ".....++.....", "............", ".....##.....", ".....##.....", ".....##....."],
    light: [".....##.....", ".#...##...#.", "..#......#..", "....++++....", "...++++++...", "##.++++++.##", "...++++++...", "....++++....", "..#......#..", ".#...##...#.", ".....##.....", "............"],
    stairs: ["++..........", "##..........", "##++........", "####........", "####++......", "######......", "######++....", "########....", "########++..", "##########..", "##########++", "############"],
    nowalk: ["############", "##........##", "#.#......#.#", "#..#....#..#", "#...#..#...#", "#....##....#", "#....##....#", "#...#..#...#", "#..#....#..#", "#.#......#.#", "##........##", "############"],
    walk: ["............", "............", ".....##.....", "...#....#...", ".#........#.", "#..........#", ".#........#.", "...#....#...", ".....##.....", "............", "............", "............"],
    label: ["....####....", "...##++##...", "..##+..+##..", "..#+....+#..", ".##+....+##.", ".#++++++++#.", ".#++++++++#.", "##+......+##", "#++......++#", "#+........+#", "#+........+#", "............"],
  });
  /** @type {Map<string, string>} */ const iconUrls = new Map();
  /** An icon as a picture (a data URL, made once). @param {string} name @param {string} color */
  function iconUrl(name, color) {
    const k = `${name}${color}`;
    if (!iconUrls.has(k)) {
      const c = document.createElement("canvas"), g = /** @type {CanvasRenderingContext2D} */ (c.getContext("2d")), rows = ICONS[name] ?? ICONS.add;
      c.width = c.height = 12;
      const [r, gr, b] = [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16)), mix = (/** @type {number} */ t, /** @type {number} */ to) => `rgb(${[r, gr, b].map((x) => Math.round(x + (to - x) * t)).join(",")})`;
      const tone = /** @type {Record<string, string>} */ ({ "#": color, "+": mix(0.5, 255), o: mix(0.45, 0) });
      rows.forEach((row, y) => [...row].forEach((ch, x) => { if (tone[ch]) { g.fillStyle = tone[ch]; g.fillRect(x, y, 1, 1); } }));
      iconUrls.set(k, c.toDataURL());
    }
    return /** @type {string} */ (iconUrls.get(k));
  }
  /** @param {string} name @param {string} color @param {number} [size] */
  const icon = (name, color, size = 24) => el("img", { src: iconUrl(name, color), alt: "", style: { width: `${size}px`, height: `${size}px`, imageRendering: "pixelated", display: "block", flex: "none" } });
  /** A button with an icon (and a label), lit while it is on. @param {string} name @param {string} color @param {string} label @param {boolean} on @param {() => void} fn @param {string} title */
  const iconButton = (name, color, label, on, fn, title) => el("button", { title, onclick: fn,
    style: { display: "inline-flex", alignItems: "center", gap: "5px", padding: label ? "2px 8px 2px 3px" : "2px 3px", margin: "1px 2px 1px 0", verticalAlign: "middle",
      ...(on ? { background: "#3a2f55", borderColor: "#ffe14a", color: "#ffe14a" } : {}) } }, [icon(name, color), ...(label ? [label] : [])]);

  /** What shows over the picture (kept); a part that doesn't show can't be picked there either */
  const LAYERS = /** @type {[string, string, string, string][]} */ ([["walk", "walk", COL.walk, "the walk area, as the bake will measure it"], ["walls", "wall", COL.wall, "walls"], ["openings", "opening", COL.opening, "openings: doors, windows, posters"],
    ["props", "prop", COL.prop, "props"], ["stairs", "stairs", COL.stairs, "the stairs"], ["nowalk", "nowalk", COL.nowalk, "no-walk rects"], ["spots", "spot", COL.spot, "spots"], ["lights", "light", COL.light, "lamps"], ["labels", "label", COL.tool, "every part's name over the picture (the one under the pointer and the one picked always have theirs)"]]);
  /** @type {Record<string, boolean>} */
  const show = { walk: true, walls: true, openings: true, props: true, stairs: true, nowalk: true, spots: true, lights: true, labels: false };
  try { Object.assign(show, JSON.parse(localStorage.getItem("glass-sister.iso.show") ?? "{}")); } catch { /* none kept */ }
  const keepShow = () => { try { localStorage.setItem("glass-sister.iso.show", JSON.stringify(show)); } catch { /* private mode */ } };
  /** a part's kind, its layer */
  const LAYER_OF = /** @type {Record<string, string>} */ ({ prop: "props", opening: "openings", wall: "walls", spot: "spots", light: "lights", stairs: "stairs", nowalk: "nowalk" });
  /** the Add tool's kinds: [kind, icon, key, what a click or a drag does] */
  const KINDS = /** @type {[string, string, string][]} */ ([["prop", "prop", "a prop: click on the floor"], ["opening", "opening", "an opening: click on a wall (low: a door, higher: a window)"], ["spot", "spot", "a spot: click where people stand"],
    ["light", "light", "a lamp: click on the floor (2.2 m up)"], ["wall", "wall", "a wall: drag along the floor (it keeps to u or v, as high as the room's walls)"],
    ["stairs", "stairs", "the stairs: drag their rect on the floor, from the top step along +u (one flight a room)"], ["nowalk", "nowalk", "a no-walk rect: drag it on the floor (drawn, not walked)"]]);
  const TOOLS = /** @type {[string, string, string, string][]} */ ([["select", "move", "Move", "V: pick and drag props, openings, spots, lamps, walls; click again on the same place for the part under it"],
    ["add", "add", "Add", "A: place a new part with a click (or a drag: walls, stairs, no-walk); 1 to 7 pick what"], ["floor", "floor", "Floor", "F: paint the floor's cells with a kit key"],
    ["where", "where", "Where from?", "W: which part of the map and which kit piece painted a pixel (also Alt+click)"]]);

  // ---------------------------------------------------------------- a JS literal with its places in the text
  // The map files are JavaScript: objects, arrays, strings, numbers, comments, now and then code (a computed
  // list). This reads the literal parts with where each value stands, so a change replaces just that value.

  /**
   * @typedef {{t: "obj" | "arr" | "str" | "num" | "lit" | "code", s: number, e: number, v?: any,
   *   props?: {key: string | null, ks?: number, node: Lit}[], items?: Lit[]}} Lit
   *   (a prop's ks: where its key begins)
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
          const ks = i;
          if (src[i] === '"' || src[i] === "'") { const e = strEnd(src, i); key = src.slice(i + 1, e - 1); i = e; }
          else { const m = /^[A-Za-z_$][\w$]*/.exec(src.slice(i)); if (!m) return { t: "code", s: start, e: exprEnd(src, start) }; key = m[0]; i += key.length; }
          i = skip(src, i);
          if (src[i] !== ":") return { t: "code", s: start, e: exprEnd(src, start) };
          const v = value(src, i + 1);
          /** @type {any} */ (n.props).push({ key, ks, node: v });
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
   * The map being edited: its file, its text (the editor's one, E.files, which the source editor shares) and its literal
   * tree, the value it evaluates to; the text as on the disk (what the bake built); `broken`: why the text, changed in the
   * source editor, isn't a map now (nothing is changed here until it is again).
   * @type {{id: string, path: string, src: string, saved: string, root: Lit, map: any, undo: string[], redo: string[], broken: string} | null}
   */
  let cur = null;
  /** the map's text is changed here (its own change, heard back from E.files) */
  let mine = false;
  /** @type {{w: number, h: number, picks: any[], who: Int16Array} | null} */ let picks = null;
  let tool = "select", floorKey = "", loading = false;
  /** what the Add tool places (a prop, an opening on a wall, a spot, a lamp, a wall, the stairs, a no-walk rect) and with which kit piece */
  let addKind = "prop", addKit = "";
  /** @type {{kind: string, a: number[], b: number[]} | null} a wall, the stairs or a no-walk rect being drawn (floor meters) */
  let adding = null;
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
    // a room made before the reload: go there and open its map
    let pending = null;
    try { pending = sessionStorage.getItem("glass-sister.iso.open"); sessionStorage.removeItem("glass-sister.iso.open"); } catch { /* none kept */ }
    if (pending && maps.includes(pending)) { if (Cutaway.room.ids().includes(pending)) await E.openRoom(pending); E.show("iso"); await open(pending); return; }
    const here = Cutaway.scene.room?.id;
    if (here && maps.includes(here)) await open(here); else E.refresh();
  }

  /** Read a map's text into the editor. @param {string} id */
  async function open(id) {
    const path = `art/rooms/${id}.map.js`;
    try {
      const src = await E.files.read(path), saved = E.files.unsaved(path) ? await E.studio.read(path) : src;
      cur = { id, path, src, saved, root: rootOf(src, id), map: evalMap(src, id), undo: [], redo: [], broken: "" };
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
    if (cur.broken) { E.setStatus(`iso: the map's text isn't a map now (${cur.broken}): mend it in the source editor first`); return; }
    let map;
    try { map = evalMap(src, cur.id); } catch (e) { E.setStatus(`iso: the change broke the map (${/** @type {any} */ (e).message})`); return; }
    cur.undo.push(cur.src); cur.redo = [];
    setText(src);
    cur.root = rootOf(src, cur.id); cur.map = map;
    E.refresh();
  }
  /** The map's text into E.files (the source editor shows it). @param {string} src */
  function setText(src) {
    if (!cur) return;
    mine = true;
    try { E.files.set(cur.path, src); } finally { mine = false; }
    cur.src = src;
  }
  /** Undo or redo: the text from one stack, the one now onto the other. @param {string[]} from @param {string[]} to */
  function step(from, to) {
    if (!cur || !from.length || cur.broken) return;
    to.push(cur.src);
    const s = /** @type {string} */ (from.pop());
    setText(s);
    cur.root = rootOf(s, cur.id); cur.map = evalMap(s, cur.id);
    E.refresh();
  }
  // the map's text changed elsewhere (the source editor, read again from the disk) or saved: the tab follows; its undo was
  // made on the text before, so it goes
  E.files.on((path, why) => {
    if (mine || !cur || path !== cur.path) return;
    const t = E.files.text(path) ?? cur.src;
    if (why === "saved" || why === "reload") cur.saved = t;
    if (t !== cur.src) {
      cur.src = t; cur.undo = []; cur.redo = [];
      try { cur.root = rootOf(t, cur.id); cur.map = evalMap(t, cur.id); cur.broken = ""; } catch (e) { cur.broken = String(/** @type {any} */ (e).message); }
    }
    E.refresh();
  });
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

  /** Several values replaced in one change (one step of undo). @param {[Lit, string][]} edits */
  function putAll(edits) {
    if (!cur) return;
    let src = cur.src;
    for (const [n, text] of edits.slice().sort((a, b) => b[0].s - a[0].s)) src = src.slice(0, n.s) + text + src.slice(n.e);
    change(src);
  }
  /** Changes that are one step of undo together (each reads the text the one before left). @param {() => void} fn */
  function batch(fn) {
    if (!cur) return;
    const n = cur.undo.length;
    fn();
    if (cur.undo.length > n + 1) cur.undo.length = n + 1;
  }
  /** A list of numbers as the maps write it. @param {number[]} a */
  const nums = (a) => `[${a.map((x) => num(x)).join(", ")}]`;

  /** Take a key out of an object node (with its comma). @param {Lit} o @param {string} key */
  function removeKey(o, key) {
    if (!cur || !o.props) return;
    const k = o.props.findIndex((p) => p.key === key), it = o.props[k], prev = o.props[k - 1], next = o.props[k + 1];
    if (!it || it.ks === undefined) return;
    if (prev) change(cur.src.slice(0, prev.node.e) + cur.src.slice(it.node.e));
    else if (next && next.ks !== undefined) change(cur.src.slice(0, it.ks) + cur.src.slice(next.ks));
    else put(o, "{}");
  }

  /** An id not yet taken in a list (base, base2, base3 ...). @param {any[]} list @param {string} base */
  function freeId(list, base) {
    const taken = new Set((list ?? []).map((q) => (typeof q === "string" ? q : q?.id)));
    if (!taken.has(base)) return base;
    for (let n = 2; ; n++) if (!taken.has(`${base}${n}`)) return `${base}${n}`;
  }

  /** Add a part to one of the map's lists (the list made when the map has none). @param {string} list @param {string} text */
  function addTo(list, text) {
    if (!cur) return false;
    const a = field(cur.root, list);
    if (a && a.t !== "arr") { E.setStatus(`iso: the map computes its ${list} in code: add it in the file`); return false; }
    if (a) addItem(a, text); else setKey(cur.root, list, `[${text}]`);
    return true;
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
  /** A rect on the floor (meters), on the screen. @param {number} u0 @param {number} v0 @param {number} u1 @param {number} v1 */
  const floorQuad = (u0, v0, u1, v1) => [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)];
  /** The stairs' rect on the floor: from its top step to its end. @param {any} st */
  const stairsQuad = (st) => floorQuad(Math.min(st.from[0], st.to[0]), Math.min(st.from[1], st.to[1]), Math.max(st.from[0], st.to[0]), Math.max(st.from[1], st.to[1]));
  /** A no-walk rect [u0, v0, du, dv] on the screen. @param {number[]} r */
  const nowalkQuad = (r) => floorQuad(r[0], r[1], r[0] + r[2], r[1] + r[3]);
  /** Is a wall along u (v the same at both ends)? @param {any} w */
  const alongU = (w) => w.from[1] === w.to[1];

  /**
   * Everything under a point of the room (room pixels) that shows, the smallest first: spots, lamps, the props
   * (the one in front first), openings, the stairs, no-walk rects, walls. @param {number} x @param {number} y
   */
  function hitAll(x, y) {
    /** @type {{kind: string, i: number}[]} */ const out = [];
    if (!cur) return out;
    const m = cur.map;
    const names = spotNames();
    if (show.spots) for (let i = 0; i < names.length; i++) { const s = m.spots[names[i]], [px, py] = P(s[0], s[1], s[3] ?? 0); if (Math.abs(px - x) <= 4 && Math.abs(py - y) <= 4) out.push({ kind: "spot", i }); }
    if (show.lights) for (let i = 0; i < (m.lights ?? []).length; i++) { const l = m.lights[i], [px, py] = P(l.at[0], l.at[1], l.at[2] ?? 0); if (Math.hypot(px - x, py - y) <= 5) out.push({ kind: "light", i }); }
    // the props: the one in front first (the larger u + v at its far corner)
    const props = (m.props ?? []).map((p, i) => ({ p, i })).filter(({ p }) => !p.behind).sort((a, b) => (b.p.at[0] + b.p.foot[0] + b.p.at[1] + b.p.foot[1]) - (a.p.at[0] + a.p.foot[0] + a.p.at[1] + a.p.foot[1]));
    if (show.props) for (const { p, i } of props) if (inside(propHull(p), x, y)) out.push({ kind: "prop", i });
    if (show.openings) for (let i = 0; i < (m.openings ?? []).length; i++) if (inside(openingQuad(m.openings[i]), x, y)) out.push({ kind: "opening", i });
    if (show.stairs && m.stairs && inside(stairsQuad(m.stairs), x, y)) out.push({ kind: "stairs", i: 0 });
    if (show.nowalk) for (let i = 0; i < (m.nowalk ?? []).length; i++) if (inside(nowalkQuad(m.nowalk[i]), x, y)) out.push({ kind: "nowalk", i });
    if (show.walls) for (let i = 0; i < m.walls.length; i++) if (inside(wallQuad(m.walls[i]), x, y)) out.push({ kind: "wall", i });
    return out;
  }
  /** What a click there picks: the smallest part that shows. @param {number} x @param {number} y */
  const hit = (x, y) => hitAll(x, y)[0] ?? null;
  const same = (/** @type {{kind: string, i: number} | null} */ a, /** @type {{kind: string, i: number} | null} */ b) => !!a && !!b && a.kind === b.kind && a.i === b.i;

  /** A part's outline on the screen (a spot's and a lamp's: a small box round it). @param {{kind: string, i: number}} s */
  function shapeOf(s) {
    const m = cur?.map, it = partOf(s);
    if (!m || !it) return null;
    const box = (/** @type {number[]} */ [x, y], r = 4) => [[x - r, y - r], [x + r, y - r], [x + r, y + r], [x - r, y + r]];
    return s.kind === "prop" ? propHull(it) : s.kind === "opening" ? openingQuad(it) : s.kind === "wall" ? wallQuad(it) : s.kind === "stairs" ? stairsQuad(it)
      : s.kind === "nowalk" ? nowalkQuad(it) : s.kind === "spot" ? box(P(it[0], it[1], it[3] ?? 0)) : box(P(it.at[0], it.at[1], it.at[2] ?? 0), 5);
  }
  /** A part's name as the inspector and the labels say it. @param {{kind: string, i: number}} s */
  function nameOf(s) {
    const it = partOf(s);
    if (!it) return "";
    return s.kind === "spot" ? spotNames()[s.i] : s.kind === "wall" ? `wall ${s.i}` : s.kind === "nowalk" ? `no-walk ${s.i}` : it.id ?? `${s.kind} ${s.i}`;
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
    if (show.walk) try {
      const lay = ISOMAP.layout(m);
      ctx.setLineDash([2, 2]);
      for (const loop of lay.walk) { const pts = []; for (let k = 0; k < loop.length; k += 2) pts.push([loop[k], loop[k + 1]]); poly(pts, COL.walk); }
      ctx.setLineDash([]);
    } catch { /* a map half changed */ }
    const cellQuad = (/** @type {number} */ i, /** @type {number} */ j) => floorQuad(i * m.cell, j * m.cell, (i + 1) * m.cell, (j + 1) * m.cell);
    if (tool === "floor") {
      // the cells by key, each key its own tint
      const keys = [...new Set(m.floor.join("").replace(/\./g, ""))];
      m.floor.forEach((/** @type {string} */ row, /** @type {number} */ j) => [...row].forEach((k, i) => {
        if (k === ".") return;
        poly(cellQuad(i, j), `hsl(${(keys.indexOf(k) * 67) % 360} 80% 60%)`, true);
      }));
    }
    if (show.walls) m.walls.forEach((/** @type {any} */ w, /** @type {number} */ i) => poly(wallQuad(w), COL.wall, false, is("wall", i)));
    // a selected wall's ends: drag one to make the wall longer or shorter
    if (sel?.kind === "wall" && m.walls[sel.i]) for (const end of [m.walls[sel.i].from, m.walls[sel.i].to]) { const [x, y] = P(end[0], end[1]); ctx.fillStyle = COL.sel; ctx.fillRect(x - 2, y - 2, 5, 5); }
    if (m.stairs && show.stairs) {
      const st = m.stairs, q = stairsQuad(st);
      ctx.setLineDash([3, 2]); poly(q, COL.stairs, true, is("stairs", 0)); ctx.setLineDash([]);
      // its steps, a line at every tread along u
      ctx.strokeStyle = COL.stairs; ctx.globalAlpha = 0.6;
      for (let a = Math.min(st.from[0], st.to[0]) + (st.tread || 0.3); a < Math.max(st.from[0], st.to[0]); a += st.tread || 0.3) {
        const [x0, y0] = P(a, Math.min(st.from[1], st.to[1])), [x1, y1] = P(a, Math.max(st.from[1], st.to[1]));
        ctx.beginPath(); ctx.moveTo(x0 + 0.5, y0 + 0.5); ctx.lineTo(x1 + 0.5, y1 + 0.5); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    if (show.nowalk) (m.nowalk ?? []).forEach((/** @type {number[]} */ r, /** @type {number} */ i) => {
      const q = nowalkQuad(r);
      poly(q, COL.nowalk, true, is("nowalk", i));
      ctx.beginPath(); ctx.moveTo(q[0][0] + 0.5, q[0][1] + 0.5); ctx.lineTo(q[2][0] + 0.5, q[2][1] + 0.5); ctx.moveTo(q[1][0] + 0.5, q[1][1] + 0.5); ctx.lineTo(q[3][0] + 0.5, q[3][1] + 0.5); ctx.stroke();
    });
    if (adding) {
      const [u0, v0] = adding.a, [u1, v1] = adding.b;
      ctx.setLineDash([2, 2]);
      if (adding.kind === "wall") { const w = wallOf(adding.a, adding.b); poly(wallQuad({ ...w, h: wallHeight() }), COL.sel); }
      else poly(floorQuad(Math.min(u0, u1), Math.min(v0, v1), Math.max(u0, u1), Math.max(v0, v1)), COL.sel);
      ctx.setLineDash([]);
    }
    if (show.openings) (m.openings ?? []).forEach((/** @type {any} */ o, /** @type {number} */ i) => poly(openingQuad(o), COL.opening, true, is("opening", i)));
    // a prop moved since the bake: its sprite where it will stand (the bake draws it anew there), over its old place
    const baked = /** @type {any} */ (window).Nagiwa?.layouts?.[cur.id]?.props ?? {}, was = savedMap();
    for (const p of m.props ?? []) {
      const b = baked[p.id], o = was?.props?.find((/** @type {any} */ q) => q.id === p.id);
      if (!b?.sprite || !o || (o.at[0] === p.at[0] && o.at[1] === p.at[1])) continue;
      const [x0, y0] = P(o.at[0], o.at[1]), [x1, y1] = P(p.at[0], p.at[1]);
      Cutaway.assets.draw(ctx, b.sprite, b.at[0] + x1 - x0, b.at[1] + y1 - y0, { alpha: 0.85, frame: 0 });
    }
    if (show.props) (m.props ?? []).forEach((/** @type {any} */ p, /** @type {number} */ i) => { if (!p.behind) poly(propHull(p), COL.prop, false, is("prop", i)); });
    /** @param {number} x @param {number} y @param {string} color */
    const cross = (x, y, color) => { ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 3, y + 0.5); ctx.lineTo(x + 4, y + 0.5); ctx.moveTo(x + 0.5, y - 3); ctx.lineTo(x + 0.5, y + 4); ctx.stroke(); };
    /** @param {number} x @param {number} y @param {string} color */
    const ring = (x, y, color) => { ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x + 0.5, y + 0.5, 3, 0, Math.PI * 2); ctx.stroke(); };
    if (show.spots) spotNames().forEach((n, i) => { const s = m.spots[n], [x, y] = P(s[0], s[1], s[3] ?? 0); cross(x, y, is("spot", i) ? COL.sel : COL.spot); });
    if (show.lights) (m.lights ?? []).forEach((/** @type {any} */ l, /** @type {number} */ i) => { const [x, y] = P(l.at[0], l.at[1], l.at[2] ?? 0); ring(x, y, is("light", i) ? COL.sel : COL.light); });
    // under the pointer: what a click takes (Move), where a new part goes (Add), the cell it paints (Floor)
    if (hov && !dragging && !same(hov, sel)) { const q = shapeOf(hov); if (q) poly(q, COL.hover); }
    if (hoverUV && !dragging && !adding) {
      const [u, v] = hoverUV.map(snap);
      ctx.globalAlpha = 0.7;
      if (tool === "floor") { const i = Math.floor(hoverUV[0] / m.cell), j = Math.floor(hoverUV[1] / m.cell); if (m.floor[j]?.[i] !== undefined && i >= 0) poly(cellQuad(i, j), COL.hover); }
      else if (tool === "add" && addKind === "prop") { const a = [snap(u - 0.25), snap(v - 0.25)]; poly(propHull({ at: a, foot: [0.5, 0.5], h: 1 }), COL.prop); }
      else if (tool === "add" && addKind === "spot") { const [x, y] = P(u, v); cross(x, y, COL.spot); }
      else if (tool === "add" && addKind === "light") { const [x, y] = P(u, v, 2.2); ring(x, y, COL.light); ctx.setLineDash([1, 2]); ctx.beginPath(); ctx.moveTo(x + 0.5, y + 3.5); ctx.lineTo(x + 0.5, P(u, v)[1] + 0.5); ctx.stroke(); ctx.setLineDash([]); }
      else if (tool === "add" && addKind === "opening" && hovWall >= 0) poly(wallQuad(m.walls[hovWall]), COL.opening);
      ctx.globalAlpha = 1;
    }
    // the names: of the part picked and the one under the pointer, of all with Labels on
    let font = null;
    try { font = Cutaway.font.get("hud"); } catch { /* the game's small font isn't there: no labels */ }
    if (font) {
      /** @type {{kind: string, i: number}[]} */
      const named = [];
      if (show.labels) for (const [kind, n] of [["wall", m.walls.length], ["opening", (m.openings ?? []).length], ["prop", (m.props ?? []).length], ["nowalk", (m.nowalk ?? []).length], ["spot", spotNames().length], ["light", (m.lights ?? []).length]]) {
        if (show[LAYER_OF[/** @type {string} */ (kind)]]) for (let i = 0; i < /** @type {number} */ (n); i++) if (kind !== "prop" || !m.props[i].behind) named.push({ kind: /** @type {string} */ (kind), i });
      }
      if (show.labels && m.stairs && show.stairs) named.push({ kind: "stairs", i: 0 });
      for (const s of [sel, hov]) if (s && !named.some((q) => same(q, s))) named.push(s);
      for (const s of named) {
        const q = shapeOf(s);
        if (!q) continue;
        const text = nameOf(s).toUpperCase(), top = Math.min(...q.map((p) => p[1])), xs = q.map((p) => p[0]), cx = Math.round((Math.min(...xs) + Math.max(...xs)) / 2);
        font.draw(ctx, text, cx, Math.max(1, top - 8), { align: "center", color: same(s, sel) ? COL.sel : same(s, hov) ? COL.hover : COL[s.kind] ?? COL.tool, outline: "#000" });
      }
    }
  }

  // ---------------------------------------------------------------- the pointer

  /** @type {{kind: string, i: number, uv: number[], orig: any, moved: boolean, end?: number, cycle?: {kind: string, i: number} | null} | null} */
  let dragging = null;
  /** @type {{kind: string, i: number} | null} what a click would pick (Move) */
  let hov = null;
  /** @type {number[] | null} the floor point under the pointer (meters) */
  let hoverUV = null;
  /** the wall an opening would go on (Add, opening) */
  let hovWall = -1;

  /** The pointer over the picture: what a click would take, and where it is, in the status bar. @param {{x: number, y: number} | null} p */
  function hover(p) {
    if (!cur || !ISOMAP || !p) { hov = null; hoverUV = null; hovWall = -1; E.setCursor(null); return; }
    const m = cur.map;
    hoverUV = uvAt(p.x, p.y);
    hov = tool === "select" ? hit(p.x, p.y) : null;
    hovWall = tool === "add" && addKind === "opening" ? m.walls.findIndex((/** @type {any} */ w) => !w.stub && inside(wallQuad(w), p.x, p.y)) : -1;
    const [u, v] = hoverUV, i = Math.floor(u / m.cell), j = Math.floor(v / m.cell), k = i >= 0 ? m.floor[j]?.[i] : undefined;
    E.setCursor(`x ${Math.floor(p.x)} y ${Math.floor(p.y)} · u ${num(snap(u))} v ${num(snap(v))}${k !== undefined ? ` · cell ${i},${j} "${k}"` : ""}${hov ? ` · ${hov.kind} ${nameOf(hov)}` : ""}`);
  }

  /** @param {{x: number, y: number}} p @param {"down" | "move" | "up"} phase @param {PointerEvent} e */
  function drag(p, phase, e) {
    if (!cur || !ISOMAP) return false;
    const m = cur.map;
    if (phase === "down") {
      if (e.button !== 0) return false;
      if (tool === "where" || e.altKey) { whereFrom(Math.floor(p.x), Math.floor(p.y)); return true; }
      if (tool === "add" && (addKind === "wall" || addKind === "stairs" || addKind === "nowalk")) { const uv = uvAt(p.x, p.y).map(snap); adding = { kind: addKind, a: uv, b: uv }; return true; }
      if (tool === "add") { place(p); return true; }
      // a selected wall's end, grabbed: the wall gets longer or shorter
      if (sel?.kind === "wall" && m.walls[sel.i]) {
        const w = m.walls[sel.i], end = [w.from, w.to].findIndex((q) => { const [x, y] = P(q[0], q[1]); return Math.abs(x - p.x) <= 3 && Math.abs(y - p.y) <= 3; });
        if (end >= 0) { dragging = { kind: "wallEnd", i: sel.i, end, uv: uvAt(p.x, p.y), orig: JSON.parse(JSON.stringify(w)), moved: false }; return true; }
      }
      if (tool === "floor") { paintCell(p); dragging = { kind: "floor", i: 0, uv: [], orig: null, moved: true }; return true; }
      // a click on the part picked keeps it (to drag it); let go without moving: the next part under the pointer
      const all = hitAll(p.x, p.y), k = all.findIndex((q) => same(q, sel)), cycle = k >= 0 && all.length > 1 ? all[(k + 1) % all.length] : null;
      if (k < 0) sel = all[0] ?? null;
      E.refresh();
      if (!sel) return true;
      const it = partOf(sel);
      dragging = { kind: sel.kind, i: sel.i, uv: uvAt(p.x, p.y), orig: JSON.parse(JSON.stringify(it)), moved: false, cycle };
      return true;
    }
    if (adding) {
      adding.b = uvAt(p.x, p.y).map(snap);
      if (phase === "up") { const a = adding; adding = null; drawn(a); }
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
      if (dragging.kind === "wall" || dragging.kind === "stairs") { it.from = [snap(o.from[0] + du), snap(o.from[1] + dv)]; it.to = [snap(o.to[0] + du), snap(o.to[1] + dv)]; }
      if (dragging.kind === "wallEnd") {
        // along its own line only: a wall stays on its u or v
        const k = dragging.end ? "to" : "from", q = o[k], w = m.walls[dragging.i];
        w[k] = alongU(o) ? [snap(q[0] + du), q[1]] : [q[0], snap(q[1] + dv)];
      }
      if (dragging.kind === "nowalk") m.nowalk[dragging.i] = [snap(o[0] + du), snap(o[1] + dv), o[2], o[3]];
      return true;
    }
    // up: what was dragged goes into the text, one step of undo
    const d = dragging;
    dragging = null;
    if (d.kind === "floor") return true;
    if (!d.moved) { if (d.cycle) { sel = d.cycle; hov = null; E.refresh(); } return true; }
    const it = d.kind === "spot" ? m.spots[spotNames()[d.i]] : d.kind === "wallEnd" ? m.walls[d.i] : partOf(d);
    commit(d.kind === "wallEnd" ? "wall" : d.kind, d.i, it);
    return true;
  }

  /** The value of a part in the map. @param {{kind: string, i: number}} s */
  function partOf(s) {
    const m = cur?.map;
    // a part undone or deleted since it was picked: nothing (the selection lets go)
    return s.kind === "prop" ? m?.props?.[s.i] : s.kind === "opening" ? m?.openings?.[s.i] : s.kind === "light" ? m?.lights?.[s.i] : s.kind === "wall" ? m?.walls?.[s.i]
      : s.kind === "stairs" ? m?.stairs : s.kind === "nowalk" ? m?.nowalk?.[s.i] : m?.spots?.[spotNames()[s.i]];
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
    if (kind === "stairs") {
      const n = field(cur.root, "stairs"), f = field(n, "from"), t = field(n, "to");
      if (f && t) putAll([[f, nums(it.from)], [t, nums(it.to)]]); else E.setStatus("iso: the stairs are computed in the map's code: change them in the file");
      return;
    }
    if (kind === "nowalk") {
      const a = field(cur.root, "nowalk"), n = a?.items?.[i];
      if (n?.t === "arr") put(n, nums(it)); else E.setStatus("iso: this rect is computed in the map's code: change it in the file");
      return;
    }
    if (kind === "wall") {
      const n = itemNode("walls", i)?.n, f = field(n, "from"), t = field(n, "to");
      if (f && t) putAll([[f, nums(it.from)], [t, nums(it.to)]]); else { E.setStatus("iso: this wall is computed in the map's code: change it in the file"); cur.map = evalMap(cur.src, cur.id); }
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
    if (!E.studio.available) { box.append(el("div", { className: "cw-dim" }, ["The Iso-Editor works with the studio (node lib/cutaway/tools/studio.mjs): it reads and writes the room's map."])); return; }
    if (!ISOMAP) { box.append(el("div", { className: "cw-dim" }, [loading ? "reading the maps and kits ..." : "..."])); boot(); return; }
    box.append(el("div", { style: { margin: "4px 0" } }, ["map ", el("select", { onchange: async (/** @type {any} */ e) => { const id = e.target.value; if (!id) return; if (Cutaway.room.ids().includes(id)) await E.openRoom(id); await open(id); } },
      [el("option", { value: "", textContent: "(a room's map)" }), ...maps.map((id) => el("option", { value: id, textContent: id, selected: id === cur?.id }))]),
      " ", button(making ? "● New map" : "New map", () => { making = !making; E.refresh(); }, "make a new room: its map, its bake file, its own kit, the room in the game (the task \"room: new\")")]));
    if (making) box.append(newMapBox());
    if (made) box.append(el("div", { className: "cw-sec" }, [`${made} is made. `, button("Reload game", () => location.reload(), "the game loads the new room (its map opens here)")]));
    if (!cur) { box.append(el("div", { className: "cw-dim" }, ["This room has no map (art/rooms/<id>.map.js). Pick one above."])); return; }
    const dirty = E.files.unsaved(cur.path);
    box.append(el("div", { style: { margin: "4px 0" } }, [
      button(`Save${dirty ? " *" : ""}`, () => { save(); }, `write ${cur.path} (only the values changed)`),
      button("Bake", () => { bake(); }, 'build the room\'s art from the map (the task "art: room") and load it'),
      button("Reload game", () => location.reload(), "the walk area, spots and props' places come into the game with a reload (after Bake)")]));
    // the tools, then what shows over the picture (the icons in the colours the parts have there)
    box.append(el("div", { style: { margin: "6px 0 2px" } }, TOOLS.map(([t, ic, label, title]) => iconButton(ic, COL.tool, label, tool === t, () => { tool = t; E.refresh(); }, title))));
    box.append(el("div", { style: { margin: "2px 0 4px", display: "flex", alignItems: "center", flexWrap: "wrap" } }, [el("span", { className: "cw-dim", style: { marginRight: "4px" } }, ["show"]),
      ...LAYERS.map(([k, ic, color, title]) => { const b = iconButton(ic, color, "", show[k], () => { show[k] = !show[k]; keepShow(); if (sel && !show[LAYER_OF[sel.kind]]) sel = null; E.refresh(); }, `${title} (${show[k] ? "shown" : "hidden"}: click)`);
        if (!show[k]) b.style.opacity = "0.35"; b.style.background = show[k] ? "" : "transparent"; return b; })]));
    if (tool === "add") {
      const pieces = ["prop", "opening", "wall", "stairs"].includes(addKind) ? piecesHere(addKind).map((q) => q.name) : [];
      if (pieces.length && !pieces.includes(addKit)) addKit = pieces[0];
      box.append(el("div", { className: "cw-sec" }, [
        el("div", {}, KINDS.map(([k, ic, title], n) => iconButton(ic, COL[k], k === "light" ? "lamp" : k === "nowalk" ? "no-walk" : k, addKind === k, () => { addKind = k; E.refresh(); }, `${n + 1}: ${title}`))),
        ...(pieces.length ? [el("div", { style: { marginTop: "4px" } }, ["kit ", el("select", { onchange: (/** @type {any} */ e) => { addKit = e.target.value; } }, pieces.map((n) => el("option", { value: n, textContent: n, selected: n === addKit })))])] : []),
        el("div", { className: "cw-dim" }, [KINDS.find(([k]) => k === addKind)?.[2] ?? ""])]));
    }
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
    else box.append(roomBox());
    box.append(el("div", { className: "cw-dim", style: { marginTop: "6px" } }, [`${(cur.map.props ?? []).length} props · ${(cur.map.openings ?? []).length} openings · ${spotNames().length} spots · ${(cur.map.lights ?? []).length} lamps; the dashed green line is the walk area the map gives`]));
  }

  /** The selected part's fields. */
  function details() {
    const s = /** @type {{kind: string, i: number}} */ (sel), it = partOf(s), sec = el("div", { className: "cw-sec" });
    if (!it) { sel = null; return roomBox(); }
    const list = s.kind === "prop" ? "props" : s.kind === "opening" ? "openings" : s.kind === "light" ? "lights" : s.kind === "wall" ? "walls" : "";
    const node = list ? itemNode(list, s.i)?.n : s.kind === "stairs" ? field(cur?.root, "stairs") : s.kind === "nowalk" ? field(cur?.root, "nowalk")?.items?.[s.i] : field(field(cur?.root, "spots"), spotNames()[s.i]);
    const computed = !node;
    const title = s.kind === "spot" ? `spot "${spotNames()[s.i]}"` : s.kind === "nowalk" ? `no-walk rect ${s.i}` : s.kind === "stairs" ? `stairs "${it.id ?? ""}"` : `${s.kind} ${it.id ? `"${it.id}"` : s.i}`;
    sec.append(el("div", { style: { fontWeight: "bold", display: "flex", alignItems: "center", gap: "6px" } }, [icon(KINDS.find(([k]) => k === s.kind)?.[1] ?? "prop", COL[s.kind] ?? COL.tool, 18), title]));
    if (computed) { sec.append(el("div", { className: "cw-dim" }, ["computed in the map's code: change it in the file"])); return sec; }
    const n = /** @type {Lit} */ (node), set = (/** @type {string} */ key, /** @type {string} */ text) => setKey(n, key, text);
    const pair = (/** @type {number[]} */ a) => `[${a.map((x) => num(x)).join(", ")}]`;
    if (s.kind === "prop") {
      sec.append(el("div", {}, ["kit ", kitSelect("prop", it.kit, (k) => set("kit", JSON.stringify(k)))]),
        el("div", {}, [numField("u", it.at[0], (x) => set("at", pair([x, it.at[1]]))), numField("v", it.at[1], (x) => set("at", pair([it.at[0], x])))]),
        el("div", {}, [numField("du", it.foot[0], (x) => set("foot", pair([x, it.foot[1]]))), numField("dv", it.foot[1], (x) => set("foot", pair([it.foot[0], x]))), numField("h", it.h ?? 0, (x) => set("h", num(x)))]),
        el("label", {}, [el("input", { type: "checkbox", checked: it.block !== false, onchange: (/** @type {any} */ e) => set("block", e.target.checked ? "true" : "false") }), " blocks the way"]),
        el("div", { style: { marginTop: "4px" } }, [
          button("Duplicate", duplicate, "Ctrl+D: a copy a little to the front, picked (its id made free)"), button("Delete", deleteSel, "Del: take it out of the map")]));
      sec.append(idField(n, it.id));
    } else if (s.kind === "opening") {
      sec.append(el("div", {}, [`on wall ${it.wall} · kit `, kitSelect("opening", it.kit, (k) => set("kit", JSON.stringify(k)))]),
        el("div", {}, [numField("from", it.from, (x) => set("from", num(x))), numField("to", it.to, (x) => set("to", num(x)))]),
        el("div", {}, [numField("h0", it.h[0], (x) => set("h", pair([x, it.h[1]]))), numField("h1", it.h[1], (x) => set("h", pair([it.h[0], x])))]),
        el("div", {}, [button("Duplicate", duplicate, "Ctrl+D: a copy beside it on the same wall, picked"), button("Delete", deleteSel, "Del: take it out of the map")]), idField(n, it.id));
    } else if (s.kind === "spot") {
      const name = spotNames()[s.i], v = cur?.map.spots[name];
      const w = (/** @type {number} */ k, /** @type {any} */ x) => { const a = v.slice(); a[k] = x; put(n, `[${a.map((/** @type {any} */ y) => (typeof y === "number" ? num(y) : JSON.stringify(y))).join(", ")}]`); };
      sec.append(el("div", {}, [numField("u", v[0], (x) => w(0, x)), numField("v", v[1], (x) => w(1, x)), numField("h", v[3] ?? 0, (x) => w(3, x))]),
        el("div", {}, ["face ", el("select", { onchange: (/** @type {any} */ e) => w(2, e.target.value) }, ["n", "ne", "e", "se", "s", "sw", "w", "nw"].map((f) => el("option", { value: f, textContent: f, selected: f === v[2] })))]),
        el("div", { className: "cw-dim" }, ["the game names its spots (Nagiwa.at.<room>.<spot>): rename one in the file and in the game together"]),
        button("Delete", deleteSel, "Del: take it out of the map (the game may still name it)"));
    } else if (s.kind === "light") {
      sec.append(el("div", {}, [numField("u", it.at[0], (x) => set("at", pair([x, it.at[1], it.at[2]]))), numField("v", it.at[1], (x) => set("at", pair([it.at[0], x, it.at[2]]))), numField("h", it.at[2] ?? 0, (x) => set("at", pair([it.at[0], it.at[1], x])))]),
        el("div", {}, [numField("power", it.power ?? 1, (x) => set("power", num(x))), numField("r", it.r ?? 0, (x) => set("r", num(x)))]),
        el("div", { className: "cw-dim" }, ["the game's light; the baked light is its \"bake\" (in the file)"]),
        el("div", {}, [button("Duplicate", duplicate, "Ctrl+D: a copy a little to the front, picked"), button("Delete", deleteSel, "Del: take it out of the map")]), idField(n, it.id));
    } else if (s.kind === "wall") {
      const ends = (/** @type {number[]} */ f, /** @type {number[]} */ t) => putAll([[/** @type {Lit} */ (field(n, "from")), nums(f)], [/** @type {Lit} */ (field(n, "to")), nums(t)]]);
      sec.append(el("div", {}, ["kit ", kitSelect("wall", it.kit, (k) => set("kit", JSON.stringify(k))), " ", numField("h", it.h, (x) => set("h", num(x)))]),
        el("div", {}, [numField("from u", it.from[0], (x) => ends([x, it.from[1]], alongU(it) ? it.to : [x, it.to[1]])), numField("v", it.from[1], (x) => ends([it.from[0], x], alongU(it) ? [it.to[0], x] : it.to))]),
        el("div", {}, [numField("to u", it.to[0], (x) => ends(alongU(it) ? it.from : [x, it.from[1]], [x, it.to[1]])), numField("v", it.to[1], (x) => ends(alongU(it) ? [it.from[0], x] : it.from, [it.to[0], x]))]),
        el("div", { className: "cw-dim" }, [`along ${alongU(it) ? "u" : "v"}, ${num(Math.abs(alongU(it) ? it.to[0] - it.from[0] : it.to[1] - it.from[1]))} m; its inner face toward +${alongU(it) ? "v" : "u"}; ${(cur?.map.openings ?? []).filter((/** @type {any} */ o) => o.wall === s.i).length} openings in it`]),
        el("label", {}, [el("input", { type: "checkbox", checked: !!it.stub, onchange: (/** @type {any} */ e) => (e.target.checked ? set("stub", "true") : removeKey(n, "stub")) }), " a near wall cut to a stub"]),
        el("div", { style: { marginTop: "4px" } }, [button("Delete", deleteSel, "Del: take it out (its openings with it; the walls after it move up a place)")]));
    } else if (s.kind === "stairs") {
      const ends = (/** @type {number[]} */ f, /** @type {number[]} */ t) => putAll([[/** @type {Lit} */ (field(n, "from")), nums(f)], [/** @type {Lit} */ (field(n, "to")), nums(t)]]);
      sec.append(idField(n, it.id), el("div", {}, ["kit ", kitSelect("stairs", it.kit, (k) => set("kit", JSON.stringify(k)))]),
        el("div", {}, [numField("from u", it.from[0], (x) => ends([x, it.from[1]], it.to)), numField("v", it.from[1], (x) => ends([it.from[0], x], it.to))]),
        el("div", {}, [numField("to u", it.to[0], (x) => ends(it.from, [x, it.to[1]])), numField("v", it.to[1], (x) => ends(it.from, [it.to[0], x]))]),
        el("div", {}, [numField("rise", it.rise ?? 0.18, (x) => set("rise", num(x))), numField("tread", it.tread ?? 0.3, (x) => set("tread", num(x))), "down ", el("select", { onchange: (/** @type {any} */ e) => set("down", JSON.stringify(e.target.value)) }, ["+u"].map((d) => el("option", { value: d, textContent: d, selected: d === it.down })))]),
        el("div", { className: "cw-dim" }, ["a flight down through a hole in the floor, from the top step at from u along +u"]),
        ...(piecesHere("stairs").some((q) => q.name === it.kit) ? [] : [el("div", { style: { color: "#ffd27a" } }, [`the room's bake includes no stairs kit "${it.kit}": they are drawn plain (include a kit with ISOKIT.stairs in art/rooms/${cur?.id}.px.js)`])]),
        el("div", { style: { marginTop: "4px" } }, [button("Cut the floor", cutFloor, "make the floor's cells under the stairs a hole (\".\")"), button("Delete", deleteSel, "Del: take the stairs out (the hole in the floor stays)")]));
    } else if (s.kind === "nowalk") {
      const r = /** @type {number[]} */ (it), w = (/** @type {number} */ k, /** @type {number} */ x) => { const a = r.slice(); a[k] = x; put(n, nums(a)); };
      sec.append(el("div", {}, [numField("u", r[0], (x) => w(0, x)), numField("v", r[1], (x) => w(1, x))]), el("div", {}, [numField("du", r[2], (x) => w(2, x)), numField("dv", r[3], (x) => w(3, x))]),
        el("div", { className: "cw-dim" }, ["floor that is drawn but not walked (a corner the screen's edge cuts off)"]),
        el("div", {}, [button("Duplicate", duplicate, "Ctrl+D: a copy a little to the front, picked"), button("Delete", deleteSel, "Del: take it out of the map")]));
    }
    // the keys the form doesn't show, each to change, and the ones the format knows to add
    const KNOWN = /** @type {Record<string, string[]>} */ ({ prop: ["id", "kit", "at", "foot", "h", "block"], opening: ["id", "wall", "from", "to", "h", "kit"], light: ["id", "at", "power", "r"],
      wall: ["from", "to", "h", "kit", "stub"], stairs: ["id", "kit", "from", "to", "rise", "tread", "down"] });
    const OFFER = /** @type {Record<string, [string, string][]>} */ ({ prop: [["seeThrough", "true"], ["standOn", "true"], ["behind", '""']], opening: [["open", '{ depth: 1.5, floor: "", wall: "" }']],
      light: [["color", '"#ffd8a0"'], ["flicker", "0.1"], ["bake", "{ reach: 2, power: 1 }"]], wall: [], stairs: [] });
    if (KNOWN[s.kind] && n.t === "obj") sec.append(moreKeys(n, KNOWN[s.kind], OFFER[s.kind] ?? []));
    // its line in the map
    if (cur) { const at = lineOf(cur.src, n.s), path = cur.path; sec.append(el("div", { style: { cursor: "pointer", color: "#7ad8ff", marginTop: "4px" }, onclick: () => { E.modules.art?.openSource(path, at); } }, [`map: ${path}:${at}`])); }
    return sec;
  }

  /** The height new walls get: that of the room's walls. */
  const wallHeight = () => Math.max(0, ...(cur?.map.walls ?? []).filter((/** @type {any} */ w) => !w.stub).map((/** @type {any} */ w) => w.h)) || 2.8;
  /** A wall from a drag: along the axis it went further on, from its lower end. @param {number[]} a @param {number[]} b */
  function wallOf(a, b) {
    const onU = Math.abs(b[0] - a[0]) >= Math.abs(b[1] - a[1]);
    return onU ? { from: [Math.min(a[0], b[0]), a[1]], to: [Math.max(a[0], b[0]), a[1]] } : { from: [a[0], Math.min(a[1], b[1])], to: [a[0], Math.max(a[1], b[1])] };
  }

  /** A wall, the stairs or a no-walk rect drawn with the Add tool. @param {{kind: string, a: number[], b: number[]}} d */
  function drawn(d) {
    if (!cur) return;
    const m = cur.map, [u0, v0] = [Math.min(d.a[0], d.b[0]), Math.min(d.a[1], d.b[1])], [u1, v1] = [Math.max(d.a[0], d.b[0]), Math.max(d.a[1], d.b[1])];
    if (d.kind === "wall") {
      const w = wallOf(d.a, d.b);
      if (w.from[0] === w.to[0] && w.from[1] === w.to[1]) return;
      if (addTo("walls", `{ from: ${nums(w.from)}, to: ${nums(w.to)}, h: ${num(wallHeight())}, kit: ${JSON.stringify(addKit)} }`)) sel = { kind: "wall", i: cur.map.walls.length - 1 };
    } else if (d.kind === "stairs") {
      if (m.stairs) { E.setStatus("iso: the map has its flight of stairs already (one a room): move or change it"); return; }
      if (u1 - u0 < 0.3 || v1 - v0 < 0.3) return;
      setKey(cur.root, "stairs", `{ id: "stairs", kit: ${JSON.stringify(addKit)}, from: ${nums([u0, v0])}, to: ${nums([u1, v1])}, down: "+u", rise: 0.18, tread: 0.3 }`);
      sel = { kind: "stairs", i: 0 };
      E.setStatus("iso: the stairs go down through a hole in the floor: Cut the floor makes it");
    } else if (d.kind === "nowalk") {
      if (u1 - u0 < SNAP || v1 - v0 < SNAP) return;
      if (addTo("nowalk", nums([u0, v0, u1 - u0, v1 - v0]))) sel = { kind: "nowalk", i: cur.map.nowalk.length - 1 };
    }
    E.refresh();
  }

  /** The list a kind of part is in. */
  const LIST = /** @type {Record<string, string>} */ ({ prop: "props", opening: "openings", light: "lights", wall: "walls", nowalk: "nowalk" });

  /** Take the part picked out of the map (Del, the inspector's Delete). */
  function deleteSel() {
    if (!cur || !sel) return;
    const s = sel;
    if (s.kind === "wall") { deleteWall(s.i); return; }
    if (s.kind === "spot") { const o = field(cur.root, "spots"); if (o?.t !== "obj") { E.setStatus("iso: the spots are computed in the map's code: change them in the file"); return; } removeKey(o, spotNames()[s.i]); }
    else if (s.kind === "stairs") removeKey(cur.root, "stairs");
    else { const a = field(cur.root, LIST[s.kind]); if (a?.t !== "arr" || !a.items?.[s.i]) { E.setStatus(`iso: this ${s.kind} is computed in the map's code: change it in the file`); return; } removeItem(a, s.i); }
    sel = null; hov = null;
    E.refresh();
  }

  /** A copy of the part picked, picked (Ctrl+D): a little to the front, an opening beside it on its wall; its id made free. */
  function duplicate() {
    if (!cur || !sel || !LIST[sel.kind] || sel.kind === "wall") return;
    const s = sel, list = LIST[s.kind], a = field(cur.root, list), n = a?.items?.[s.i];
    if (a?.t !== "arr" || !n) { E.setStatus(`iso: this ${s.kind} is computed in the map's code: copy it in the file`); return; }
    const it = partOf(s), src = cur.src.slice(n.s, n.e), id = it.id ? freeId(cur.map[list], String(it.id).replace(/_?\d+$/, "") || "part") : "";
    batch(() => {
      addItem(/** @type {Lit} */ (a), id ? src.replace(/id:\s*(["'`])[^"'`]*\1/, `id: "${id}"`) : src);
      const k = (cur?.map[list] ?? []).length - 1;
      if (s.kind === "prop" || s.kind === "light") commit(s.kind, k, { at: [snap(it.at[0] + 0.25), snap(it.at[1] + 0.25), ...(s.kind === "light" ? [it.at[2]] : [])] });
      else if (s.kind === "opening") commit("opening", k, { from: it.to + 0.1, to: it.to + 0.1 + (it.to - it.from) });
      else if (s.kind === "nowalk") commit("nowalk", k, [snap(it[0] + 0.25), snap(it[1] + 0.25), it[2], it[3]]);
      sel = { kind: s.kind, i: k };
    });
    E.refresh();
  }

  /** Delete a wall: the openings in it go too, the walls after it move up a place (their openings' numbers follow). @param {number} i */
  function deleteWall(i) {
    if (!cur) return;
    const own = (cur.map.openings ?? []).filter((/** @type {any} */ o) => o.wall === i).map((/** @type {any} */ o) => o.id);
    if (own.length && !confirm(`Wall ${i} has ${own.join(", ")} in it: delete them with it?`)) return;
    batch(() => {
      // its openings, from the last (each removal reads the text again)
      for (let k = (cur?.map.openings ?? []).length - 1; k >= 0; k--) if (cur?.map.openings[k].wall === i) { const a = field(cur?.root, "openings"); if (a) removeItem(a, k); }
      // the openings in the walls after it: one wall lower
      const later = (cur?.map.openings ?? []).map((/** @type {any} */ o, /** @type {number} */ k) => ({ o, k })).filter(({ o }) => o.wall > i);
      putAll(later.map(({ o, k }) => /** @type {[Lit, string]} */ ([/** @type {Lit} */ (field(field(cur?.root, "openings")?.items?.[k], "wall")), String(o.wall - 1)])).filter(([n]) => n));
      const a = field(cur?.root, "walls");
      if (a) removeItem(a, i);
    });
    sel = null;
    E.refresh();
  }

  /** The floor's cells under the stairs made a hole ("."), as the stairs need. */
  function cutFloor() {
    if (!cur?.map.stairs) return;
    const m = cur.map, st = m.stairs, rows = field(cur.root, "floor");
    if (!rows?.items) return;
    const [u0, u1] = [Math.min(st.from[0], st.to[0]), Math.max(st.from[0], st.to[0])], [v0, v1] = [Math.min(st.from[1], st.to[1]), Math.max(st.from[1], st.to[1])];
    /** @type {[Lit, string][]} */
    const edits = [];
    m.floor.forEach((/** @type {string} */ row, /** @type {number} */ j) => {
      const next = [...row].map((k, i) => ((i + 0.5) * m.cell > u0 && (i + 0.5) * m.cell < u1 && (j + 0.5) * m.cell > v0 && (j + 0.5) * m.cell < v1 ? "." : k)).join("");
      const n = /** @type {Lit[]} */ (rows.items)[j];
      if (next !== row && n?.t === "str") edits.push([n, JSON.stringify(next)]);
    });
    if (edits.length) putAll(edits); else E.setStatus("iso: the floor under the stairs is open already");
  }

  /** The room's size changed: the floor's rows made to fit (new cells "." no floor, cells outside cut). @param {number} U @param {number} V */
  function resize(U, V) {
    if (!cur) return;
    const m = cur.map, rows = field(cur.root, "floor"), size = field(cur.root, "size");
    if (!rows?.items || !size) { E.setStatus("iso: the map's floor or size is computed in code: change them in the file"); return; }
    const nu = Math.round(U / m.cell), nv = Math.round(V / m.cell);
    const next = Array.from({ length: nv }, (_, j) => (m.floor[j] ?? "").slice(0, nu).padEnd(nu, "."));
    const first = rows.items[0], lineStart = first ? cur.src.lastIndexOf("\n", first.s) + 1 : rows.s;
    const indent = first ? /^\s*/.exec(cur.src.slice(lineStart))?.[0] ?? "    " : "    ", close = indent.slice(2);
    putAll([[size, nums([U, V])], [rows, `[\n${next.map((r) => `${indent}${JSON.stringify(r)},`).join("\n")}\n${close}]`]]);
  }

  /** The map's cells made another size: each new cell takes the key under its middle, the size stays (a whole number of cells). @param {number} c */
  function recell(c) {
    if (!cur) return;
    const m = cur.map, rows = field(cur.root, "floor"), cn = field(cur.root, "cell");
    if (!rows?.items || !cn) { E.setStatus("iso: the map's floor or cell is computed in code: change them in the file"); return; }
    const whole = (/** @type {number} */ x) => Math.abs(x / c - Math.round(x / c)) < 1e-6;
    if (!(c >= 0.1 && c <= 2) || !whole(m.size[0]) || !whole(m.size[1])) { E.setStatus(`iso: a cell of ${c} m doesn't fit the room (${m.size.join(" x ")} m): U and V must be whole numbers of cells`); return; }
    const nu = Math.round(m.size[0] / c), nv = Math.round(m.size[1] / c);
    const next = Array.from({ length: nv }, (_, j) => Array.from({ length: nu }, (_, i) => m.floor[Math.floor(((j + 0.5) * c) / m.cell)]?.[Math.floor(((i + 0.5) * c) / m.cell)] ?? ".").join(""));
    const first = rows.items[0], lineStart = first ? cur.src.lastIndexOf("\n", first.s) + 1 : rows.s;
    const indent = first ? /^\s*/.exec(cur.src.slice(lineStart))?.[0] ?? "    " : "    ", close = indent.slice(2);
    putAll([[cn, num(c)], [rows, `[\n${next.map((r) => `${indent}${JSON.stringify(r)},`).join("\n")}\n${close}]`]]);
    E.setStatus(`iso: cells of ${num(c)} m, ${nu} x ${nv}; each took the key under its middle`);
  }

  /** the form for a new map is open */
  let making = false;
  /** The form for a new room: its id and size; the task "room: new" makes it (tools/new-room.mjs), a reload loads it. */
  function newMapBox() {
    const id = /** @type {HTMLInputElement} */ (el("input", { placeholder: "id (small letters, _)", style: { width: "150px" } }));
    const u = /** @type {HTMLInputElement} */ (el("input", { value: "5", style: { width: "44px" } })), v = /** @type {HTMLInputElement} */ (el("input", { value: "4.5", style: { width: "44px" } }));
    const make = async () => {
      const name = id.value.trim(), U = Number(u.value), V = Number(v.value);
      if (!/^[a-z][a-z0-9_]*$/.test(name)) { E.setStatus("iso: a room's id is small letters, digits and _, a letter first"); return; }
      if (maps.includes(name) || Cutaway.room.ids().includes(name)) { E.setStatus(`iso: ${name} is taken`); return; }
      if (!(U >= 1 && V >= 1 && U <= 40 && V <= 40)) { E.setStatus("iso: U and V are meters, 1 to 40"); return; }
      const r = await E.runTask("room: new", { room: name, u: num(U), v: num(V) });
      if (r.code !== 0) return;
      // after the reload (index.html loads the new room now): open its map
      try { sessionStorage.setItem("glass-sister.iso.open", name); } catch { /* none kept: pick it by hand */ }
      making = false;
      made = name;
      E.setStatus(`${name}: made and baked; Reload game loads it (index.html, game/places.js, game/rooms/${name}.js)`);
      E.refresh();
    };
    return el("div", { className: "cw-sec" }, [
      el("div", {}, ["id ", id, " U ", u, " V ", v, " m"]),
      el("div", { style: { marginTop: "4px" } }, [button("Make", () => { make(); }, "write the map, its bake file and its kit, bake it, add the room to the game")]),
      el("div", { className: "cw-dim" }, [`A floor of plain "p" cells, two back walls and two front stubs, a spot (arrive) and a lamp; its own kit art/kit/<id>.kit.px.js with that floor and wall to paint. Then Reload game: the map opens here. Undo it with node tools/new-room.mjs --remove <id>.`])]);
  }
  /** @type {string} the room made last (until the reload) */
  let made = "";

  /** The keys of a part the form doesn't show, each to change, take away or add (any key the format knows). @param {Lit} n @param {string[]} known @param {[string, string][]} offer keys to add, with a value to begin with */
  function moreKeys(n, known, offer) {
    const box = el("div", { style: { marginTop: "6px" } }, [el("div", { className: "cw-dim" }, ["more (as written in the map):"])]);
    for (const pr of n.props ?? []) {
      if (!pr.key || known.includes(pr.key)) continue;
      const vn = pr.node, key = pr.key;
      box.append(el("div", { style: { display: "flex", gap: "4px", alignItems: "center", margin: "2px 0" } }, [
        el("span", { style: { minWidth: "70px" } }, [key]),
        el("input", { value: cur?.src.slice(vn.s, vn.e) ?? "", style: { flex: "1", font: "11px Consolas, monospace" }, title: vn.t === "code" ? "computed: as code" : "a value as JavaScript",
          onchange: (/** @type {any} */ e) => put(vn, e.target.value) }),
        button("x", () => { removeKey(n, key); }, `take ${key} away`)]));
    }
    const k = /** @type {HTMLInputElement} */ (el("input", { placeholder: "key", style: { width: "70px" } }));
    const v = /** @type {HTMLInputElement} */ (el("input", { placeholder: "value", style: { width: "110px" } }));
    box.append(el("div", { style: { margin: "2px 0" } }, [k, v, button("+", () => { if (/^[A-Za-z_]\w*$/.test(k.value.trim()) && v.value.trim()) setKey(n, k.value.trim(), v.value.trim()); }, "add a key")]));
    const free = offer.filter(([key]) => !field(n, key));
    if (free.length) box.append(el("div", {}, [el("span", { className: "cw-dim" }, ["add: "]), ...free.map(([key, val]) => button(key, () => setKey(n, key, val), `${key}: ${val}`))]));
    return box;
  }

  /** The room's own values (nothing picked): its size, where it sits on the screen, the picture's size, the walls' margin. */
  function roomBox() {
    const m = cur?.map, root = cur?.root, sec = el("div", { className: "cw-sec" }, [el("div", { style: { fontWeight: "bold" } }, [`room ${cur?.id}`])]);
    if (!m || !root) return sec;
    /** @param {string} key @param {number[]} v */
    const pairSet = (key, v) => { const f = field(root, key); if (f) put(f, nums(v)); else setKey(root, key, nums(v)); };
    sec.append(
      el("div", {}, [numField("U", m.size[0], (x) => resize(x, m.size[1])), numField("V", m.size[1], (x) => resize(m.size[0], x)), numField("cell", m.cell, (x) => recell(x)), el("span", { className: "cw-dim" }, [" m"])]),
      el("div", {}, [numField("at x", m.at[0], (x) => pairSet("at", [x, m.at[1]])), numField("y", m.at[1], (x) => pairSet("at", [m.at[0], x])), el("span", { className: "cw-dim" }, [" the back corner on the screen"])]),
      el("div", {}, [numField("screen w", m.screen[0], (x) => pairSet("screen", [x, m.screen[1]])), numField("h", m.screen[1], (x) => pairSet("screen", [m.screen[0], x]))]),
      el("div", {}, [numField("margin", m.margin ?? 0.2, (x) => setKey(root, "margin", num(x))), el("span", { className: "cw-dim" }, [" how far feet keep from walls and props"])]),
      el("div", { className: "cw-dim", style: { marginTop: "4px" } }, ["Click a part over the picture (white: what a click takes; again on the same place: the part under it) or pick it on the left; drag to move it (0.05 m steps). The buttons after \"show\" hide a kind: then it can't be picked either."]),
      moreKeys(root, ["size", "cell", "floor", "at", "screen", "walls", "openings", "props", "stairs", "nowalk", "spots", "lights", "margin"], []));
    return sec;
  }

  /** A part's id, to rename it. @param {Lit} n @param {string} id */
  const idField = (n, id) => el("div", {}, ["id ", el("input", { value: id ?? "", style: { width: "120px" },
    onchange: (/** @type {any} */ e) => { const v = String(e.target.value).trim(); if (/^[A-Za-z_]\w*$/.test(v)) setKey(n, "id", JSON.stringify(v)); else E.setStatus("iso: an id is letters, digits and _"); } })]);

  /** The Add tool's click: a new part where it is, picked at once. @param {{x: number, y: number}} p */
  function place(p) {
    if (!cur) return;
    const m = cur.map, [u0, v0] = uvAt(p.x, p.y), u = snap(u0), v = snap(v0);
    if (addKind === "prop") {
      const id = freeId(m.props, addKit || "prop");
      if (addTo("props", `{ id: "${id}", kit: ${JSON.stringify(addKit)}, at: [${num(snap(u - 0.25))}, ${num(snap(v - 0.25))}], foot: [0.5, 0.5], h: 1 }`)) sel = { kind: "prop", i: cur.map.props.length - 1 };
    } else if (addKind === "light") {
      const id = freeId(m.lights, "lamp");
      if (addTo("lights", `{ id: "${id}", at: [${num(u)}, ${num(v)}, 2.2], r: 60, power: 1, color: "#ffd8a0" }`)) sel = { kind: "light", i: cur.map.lights.length - 1 };
    } else if (addKind === "spot") {
      const name = (prompt("the spot's name (the game calls it so: Nagiwa.at.<room>.<name>)", freeId(spotNames(), "spot")) ?? "").trim();
      if (!/^[A-Za-z_]\w*$/.test(name)) return;
      const o = field(cur.root, "spots");
      if (o && o.t !== "obj") { E.setStatus("iso: the map computes its spots in code: add it in the file"); return; }
      if (o) setKey(o, name, `[${num(u)}, ${num(v)}, "sw"]`); else setKey(cur.root, "spots", `{ ${name}: [${num(u)}, ${num(v)}, "sw"] }`);
      sel = { kind: "spot", i: spotNames().indexOf(name) };
    } else if (addKind === "opening") {
      // only the walls count here (a prop standing before one doesn't take the click)
      const wi = m.walls.findIndex((/** @type {any} */ w) => !w.stub && inside(wallQuad(w), p.x, p.y)), h = { i: wi };
      if (wi < 0) { E.setStatus("iso: an opening goes on a wall: click on one"); return; }
      const w = m.walls[h.i], alongU = w.from[1] === w.to[1], plane = alongU ? w.from[1] : w.from[0], base = alongU ? w.from[0] : w.from[1];
      const [CX, CY] = m.at, a = (p.x - CX) / (2 * ISOMAP.UPM);
      // the wall's own coordinate under the pointer, and the height there
      const along = alongU ? a + plane : plane - a, s0 = along - base, hh = (CY + (along + plane) * ISOMAP.UPM - p.y) / ISOMAP.VPM;
      const from = snap(s0 - 0.5), hs = hh < 0.8 ? [0, 2.1] : [snap(hh - 0.5), snap(hh + 0.5)], id = freeId(m.openings, addKit || "opening");
      if (addTo("openings", `{ id: "${id}", wall: ${h.i}, from: ${num(from)}, to: ${num(from + 1)}, h: [${num(hs[0])}, ${num(hs[1])}], kit: ${JSON.stringify(addKit)} }`)) sel = { kind: "opening", i: cur.map.openings.length - 1 };
    }
    E.refresh();
  }

  /** Write the map (only while the disk still says what was read: else the editor asks). */
  async function save() {
    if (!cur) return;
    const path = cur.path;
    E.setStatus(await E.files.save(path) ? `saved ${path}` : E.files.unsaved(path) ? `${path}: not saved` : `${path}: nothing to save`);
    E.refresh();
  }

  async function bake() {
    if (!cur) return;
    if (E.files.unsaved(cur.path)) await save();
    if (E.files.unsaved(cur.path)) return;                    // not saved: the bake would build what the disk has
    const id = cur.id, r = await E.runTask("art: room", { room: id });
    if (r.code !== 0) return;
    await E.modules.art?.reloadArt().catch((/** @type {any} */ e) => E.setStatus(String(e.message)));
    await loadPicks();
    E.setStatus(`${id} baked: the art is in; the walk area, spots and props' places come with Reload game`);
    E.refresh();
  }

  /**
   * The keys: V Move, A Add (1 to 7 what), F Floor, W Where from?; Ctrl+D a copy; the arrows nudge the part picked along
   * the floor's axes (right/left: u, down/up: v; Shift: 0.25 m). Del goes to the tab's del. @param {KeyboardEvent} e
   */
  function key(e) {
    if (!cur) return false;
    if (e.ctrlKey || e.metaKey) { if (e.code === "KeyD" && sel) { duplicate(); return true; } return false; }
    if (e.altKey) return false;
    const t = /** @type {Record<string, string>} */ ({ KeyV: "select", KeyM: "select", KeyA: "add", KeyF: "floor", KeyW: "where" })[e.code];
    if (t) { tool = t; hov = null; E.refresh(); return true; }
    if (tool === "add" && /^Digit[1-7]$/.test(e.code)) { addKind = KINDS[Number(e.code.slice(5)) - 1][0]; E.refresh(); return true; }
    if (!sel) return false;
    const d = /** @type {Record<string, number[]>} */ ({ ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] })[e.key];
    if (!d) return false;
    const k = e.shiftKey ? 0.25 : SNAP, du = d[0] * k, dv = d[1] * k, it = partOf(sel);
    if (sel.kind === "spot") commit("spot", sel.i, [snap(it[0] + du), snap(it[1] + dv), ...it.slice(2)]);
    else if (sel.kind === "opening") { const w = cur.map.walls[it.wall], s = w.from[1] === w.to[1] ? du : dv; commit("opening", sel.i, { from: it.from + s, to: it.to + s }); }
    else if (sel.kind === "wall" || sel.kind === "stairs") commit(sel.kind, sel.i, { from: [snap(it.from[0] + du), snap(it.from[1] + dv)], to: [snap(it.to[0] + du), snap(it.to[1] + dv)] });
    else if (sel.kind === "nowalk") commit("nowalk", sel.i, [snap(it[0] + du), snap(it[1] + dv), it[2], it[3]]);
    else commit(sel.kind, sel.i, { at: [snap(it.at[0] + du), snap(it.at[1] + dv), ...(sel.kind === "light" ? [it.at[2]] : [])] });
    return true;
  }

  /** The left panel: every part of the map by kind, to pick one that is hard to click (under another, hidden). @param {HTMLElement} box */
  function browse(box) {
    if (!cur) return;
    const m = cur.map;
    /** @type {any[]} */
    const items = [];
    /** @param {string} kind @param {string} group @param {string[]} labels */
    const add = (kind, group, labels) => labels.forEach((label, i) => items.push({ key: `${kind}:${i}`, label, group, color: COL[kind], dim: !show[LAYER_OF[kind]] }));
    add("wall", "walls", m.walls.map((/** @type {any} */ w, /** @type {number} */ i) => `${i} ${w.kit}${w.stub ? " (stub)" : ""}`));
    add("opening", "openings", (m.openings ?? []).map((/** @type {any} */ o) => `${o.id} · wall ${o.wall}`));
    add("prop", "props", (m.props ?? []).map((/** @type {any} */ p) => `${p.id}${p.behind ? " (behind)" : ""}`));
    if (m.stairs) add("stairs", "stairs", [m.stairs.id ?? "stairs"]);
    add("nowalk", "no-walk", (m.nowalk ?? []).map((/** @type {number[]} */ r, /** @type {number} */ i) => `${i} [${r.map(num).join(", ")}]`));
    add("spot", "spots", spotNames());
    add("light", "lamps", (m.lights ?? []).map((/** @type {any} */ l, /** @type {number} */ i) => l.id ?? String(i)));
    box.append(E.fold("left.iso", `MAP ${cur.id.toUpperCase()}`, () => [E.list({ id: "iso.parts", items, filter: items.length > 15, foldOver: 12, selected: sel ? `${sel.kind}:${sel.i}` : undefined,
      pick: (/** @type {string} */ k) => { const [kind, i] = k.split(":"); if (!show[LAYER_OF[kind]]) { show[LAYER_OF[kind]] = true; keepShow(); } sel = { kind, i: Number(i) }; if (tool !== "select") tool = "select"; E.refresh(); } })], { note: String(items.length) }));
  }

  E.tab({ id: "iso", label: "Iso-Editor", build, render, drag, hover, key, browse, del: () => deleteSel(),
    save: () => save(),
    undo: () => { if (cur) step(cur.undo, cur.redo); },
    redo: () => { if (cur) step(cur.redo, cur.undo); },
    selectNone: () => { sel = null; origin = ""; E.refresh(); },
    onRoom: () => { const id = Cutaway.scene.room?.id; if (ISOMAP && id && maps.includes(id) && id !== cur?.id && (!cur || !E.files.unsaved(cur.path))) open(id); },
    get unsaved() { return cur && E.files.unsaved(cur.path) ? 1 : 0; } });
  // the Room tab of a baked room: its shapes come from the bake's layout, so a change there is undone or stays stale
  E.roomNote((id) => (maps.includes(id) ? `Baked from its map (art/rooms/${id}.map.js): the walk area, the props' places and the openings' rects come from game/rooms/${id}.layout.js, which the bake writes. Change them in the Iso tab and bake; shapes saved here (rooms/${id}.geo.js) would stay over every later bake.` : null));
  boot();
  // its guide inside the editor's Help (F1 here opens it): how to use the tab in the editor guide
  // (docs/editor-iso.md), the maps' format in the reference (docs/iso-maps.md), read through the studio
  E.studio.read("docs/editor-iso.md").then((md) => E.modules.help?.addBook({ id: "iso", title: "Iso-Editor", file: "docs/editor-iso.md", md }, { iso: "intro" }, { into: "editor" }))
    .catch(() => { /* no guide: the tab works without it */ });
  E.studio.read("docs/iso-maps.md").then((md) => E.modules.help?.addBook({ id: "isomaps", title: "Iso-Karten", file: "docs/iso-maps.md", md }, {}, { into: "reference" }))
    .catch(() => { /* no format page */ });
  E.modules.iso = { open, whereFrom, hit, hitAll, get map() { return cur?.map; }, get src() { return cur?.src; }, get selected() { return sel; }, select(/** @type {any} */ s) { sel = s; E.refresh(); }, commit, paintCell, setTool(/** @type {string} */ t, /** @type {string} */ k) { tool = t; if (k !== undefined) floorKey = k; E.refresh(); }, get origin() { return origin; }, get originAt() { return originAt; }, boot, value, field, place, removeKey, drawn, deleteWall, cutFloor, resize, recell, newMapBox,
    setAdd(/** @type {string} */ k, /** @type {string} */ kit) { addKind = k; if (kit !== undefined) addKit = kit; tool = "add"; E.refresh(); } };
})();

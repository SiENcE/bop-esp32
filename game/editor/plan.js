// The editor's Plan tab (the studio loads it: studio.json "editor"): the city's plan (docs/plan/stadtplan.js) arranged and edited,
// level by level, drawn by docs/plan/plan.js as the plan's page draws it. The plan is its own: nothing here reads or changes the
// game or its maps, and the game never reads the plan. The one bridge is a double click on a room, which opens its room of the
// game here (in the Iso-Editor when it has a map, else in the Room tab).
//   pick      a click (on the picked level); Ctrl+click takes one in or out; a frame dragged on the ground picks all whose
//             middle lies in it (not the water; Shift adds them); Ctrl+A all on the level; Esc none. The left panel lists them
//   move      drag one of the picked, or anywhere in the box round them: all of them go (the water only with Shift, when it is
//             the one picked); the arrows nudge them (Shift: ten units)
//   view      the wheel zooms; the right or middle button, or Space held, drags the view; a double click on the ground fits it
//   size      a rect's corner handle sizes it, its walls, doors and camera with it; a shape's points drag one by one (Alt+click
//             on an edge adds one, on a point takes it)
//   turn      as in a vector editor: the round arrow beside the picked's top right corner turns all the picked together round the
//             middle of their box (in steps of 15°, free with Shift), with their walls, doors and cameras; [ and ] by 15°
//             (Shift 90°; AltGr+8 and AltGr+9 on a German keyboard)
//   doors     the picked one's doors are squares: drag one, click it and Del takes it out; the inspector names them, adds one and
//             links each to a door of another place (both ways): the plan's arrows run between linked doors
//   cameras   a room's camera (where its picture is seen from) drags by its dot and turns by its arrow; a feed's camera the same
//   new       the inspector's kinds put one in the middle of the view; Ctrl+D doubles the picked; Del takes them out
// Save writes the file back, only the values changed (its comments and layout stay); Ctrl+Z undoes, Ctrl+Y does again.
"use strict";

(function () {
  const E = Cutaway.editor, el = E.el, button = E.button, L = E.modules.literal;
  const PATH = "docs/plan/stadtplan.js", DRAW = "docs/plan/plan.js";
  const KINDS = ["street", "building", "place", "room", "cam", "view", "note", "free", "water"];
  const STATUSES = ["gemalt", "block", "geplant", "vorschlag", "idee"];
  const SEL = "#ffe14a";

  /** @type {any} */ let PD = null;                 // docs/plan/plan.js
  /** @type {any} */ let plan = null;               // the plan as the tab holds it now
  let level = "strasse", sel = "", selDoor = "", broken = "", loading = false;
  /** @type {Set<string>} every picked item's id (sel, the one the inspector shows, among them) */
  const many = new Set();
  /** @type {string[]} */ let undoStack = [], redoStack = [];
  let saved = "";                                    // the plan as the file holds it (JSON), to tell what is unsaved
  const zoom = { x: 20, y: 20, k: 0.6 };
  let fitted = false, space = false;

  // ---------------------------------------------------------------- loading
  async function boot() {
    if (PD || loading || !E.studio.available) return;
    loading = true;
    try {
      PD = new Function(`${await E.studio.read(DRAW)}\n;return PlanDraw;`)();
      await load();
    } catch (e) { broken = /** @type {any} */ (e).message; E.setStatus(`plan: ${broken}`); }
    loading = false;
    E.refresh(); draw();
  }
  /** the plan as a file's text says it @param {string} text */
  const parse = (text) => new Function(`${text}\n;return STADTPLAN;`)();
  async function load() {
    const text = await E.files.read(PATH);
    plan = parse(text); saved = JSON.stringify(plan); undoStack = []; redoStack = [];
    if (!plan.levels.some((/** @type {any} */ l) => l.id === level)) level = plan.levels[0].id;
    pickNone();
  }

  // ---------------------------------------------------------------- the plan's items and what is picked
  const items = () => /** @type {any[]} */ (plan?.items ?? []);
  const byId = (/** @type {string} */ id) => items().find((i) => i.id === id) ?? null;
  const picked = () => byId(sel);
  const chosen = () => items().filter((i) => many.has(i.id));
  const onLevel = (/** @type {any} */ it) => (it.level ?? "strasse") === level || it.kind === "water";
  function pickNone() { sel = ""; many.clear(); selDoor = ""; }
  /** pick one: "only" it, "add" it to the picked, "toggle" it in or out @param {string} id @param {"only" | "add" | "toggle"} how */
  function pick(id, how = "only") {
    if (id !== sel) selDoor = "";
    if (how === "only") { many.clear(); many.add(id); sel = id; }
    else if (how === "add") { many.add(id); sel = id; }
    else if (many.has(id)) { many.delete(id); sel = sel === id ? [...many].at(-1) ?? "" : sel; }
    else { many.add(id); sel = id; }
  }
  /** keep only what is still there (after an undo) */
  function prune() { const ids = new Set(items().map((i) => i.id)); for (const id of [...many]) if (!ids.has(id)) many.delete(id); if (!ids.has(sel)) sel = [...many].at(-1) ?? ""; if (!picked()?.doors?.[selDoor]) selDoor = ""; }
  /** a change: what was before goes on the undo stack */
  function change(/** @type {() => void} */ fn) { undoStack.push(JSON.stringify(plan)); redoStack = []; fn(); prune(); E.refresh(); draw(); }
  function step(/** @type {string[]} */ from, /** @type {string[]} */ to) {
    const s = from.pop(); if (!s) { E.setStatus(from === undoStack ? "nothing to undo" : "nothing to do again"); return; }
    to.push(JSON.stringify(plan)); plan = JSON.parse(s);
    prune(); E.refresh(); draw();
  }
  const round = (/** @type {number} */ v) => Math.round(v * 2) / 2;
  /** every point an item carries, changed by fn: its shape, its label, its walls, its doors, its camera @param {any} it @param {(p: number[]) => number[]} fn */
  function mapPoints(it, fn) {
    if (it.rect) { const [x, y, w, h] = it.rect, a = fn([x, y]), b = fn([x + w, y + h]); it.rect = [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(b[0] - a[0]), Math.abs(b[1] - a[1])]; }
    if (it.poly) { const out = []; for (let i = 0; i < it.poly.length; i += 2) out.push(...fn([it.poly[i], it.poly[i + 1]])); it.poly = out; }
    if (it.at) it.at = fn(it.at);
    if (it.label) it.label = fn(it.label);
    if (it.walls) it.walls = it.walls.map((/** @type {any} */ w) => ({ ...w, from: fn(w.from), to: fn(w.to) }));
    if (it.doors) it.doors = Object.fromEntries(Object.entries(it.doors).map(([k, d]) => [k, { .../** @type {any} */ (d), at: fn(/** @type {any} */ (d).at) }]));
    if (it.camera?.at) it.camera = { ...it.camera, at: fn(it.camera.at) };
  }
  /** move an item by dx, dy, everything it carries with it */
  const moveBy = (/** @type {any} */ it, /** @type {number} */ dx, /** @type {number} */ dy) => mapPoints(it, (p) => [round(p[0] + dx), round(p[1] + dy)]);
  /** a free id: base, else base_2, base_3 ... @param {string} base */
  const freeId = (base) => { if (!byId(base)) return base; let n = 2; while (byId(`${base}_${n}`)) n++; return `${base}_${n}`; };

  // ---------------------------------------------------------------- doors: each { at, to: "<id>/<door>" }
  const doorsOf = (/** @type {any} */ it) => /** @type {[string, any][]} */ (Object.entries(it?.doors ?? {}));
  /** every door of the plan as "<id>/<door>", with the place it belongs to */
  const allDoors = () => items().flatMap((i) => doorsOf(i).map(([k]) => ({ ref: `${i.id}/${k}`, it: i, k })));
  /** link a door to another (and that one back, when it leads nowhere or to this one), or unlink it (and its partner) @param {any} it @param {string} k @param {string} ref */
  function linkDoor(it, k, ref) {
    const me = `${it.id}/${k}`, d = it.doors[k], was = d.to;
    // the one it led to before lets go of it
    if (was && was !== ref) { const t = PD.doorOf(plan, was); if (t && t[1].to === me) delete t[1].to; }
    if (!ref) { delete d.to; return; }
    d.to = ref;
    const t = PD.doorOf(plan, ref);
    if (t && !t[1].to) t[1].to = me;
  }
  /** a door renamed: what leads to it and the accept list go with it @param {any} it @param {string} k @param {string} name */
  function renameDoor(it, k, name) {
    if (!name || name === k || it.doors[name]) return;
    const from = `${it.id}/${k}`, to = `${it.id}/${name}`;
    it.doors = Object.fromEntries(Object.entries(it.doors).map(([a, d]) => [a === k ? name : a, d]));
    for (const i of items()) for (const [, d] of doorsOf(i)) if (d.to === from) d.to = to;
    if (plan.accept?.[from]) { plan.accept[to] = plan.accept[from]; delete plan.accept[from]; }
    if (selDoor === k) selDoor = name;
  }
  /** a door taken out: what led to it leads nowhere now @param {any} it @param {string} k */
  function deleteDoor(it, k) {
    change(() => {
      const ref = `${it.id}/${k}`;
      for (const i of items()) for (const [, d] of doorsOf(i)) if (d.to === ref) delete d.to;
      const d = { ...it.doors }; delete d[k];
      if (Object.keys(d).length) it.doors = d; else delete it.doors;
      if (plan.accept?.[ref]) delete plan.accept[ref];
      if (selDoor === k) selDoor = "";
    });
  }
  function addDoor(/** @type {any} */ it) {
    const c = PD.centre(it) ?? it.at;
    let n = 1; while (it.doors?.[`door_${n}`]) n++;
    const k = `door_${n}`;
    change(() => { it.doors = { ...(it.doors ?? {}), [k]: { at: [round(c[0]), round(c[1])] } }; selDoor = k; });
  }

  // ---------------------------------------------------------------- cameras: a room's { at, dir } and a feed's (kind cam, view)
  /** an item's camera: where it is and where it looks, and how to set them @param {any} it */
  function camOf(it) {
    if (it?.camera?.at) return { at: it.camera.at, dir: it.camera.dir ?? 0, set: (/** @type {any} */ v) => { it.camera = { ...it.camera, ...v }; } };
    if (it && (it.kind === "cam" || it.kind === "view") && it.at) return { at: it.at, dir: it.dir ?? 0, set: (/** @type {any} */ v) => { if (v.at) it.at = v.at; if (v.dir !== undefined) it.dir = v.dir; } };
    return null;
  }
  /** the tip of a camera's arrow, where it turns @param {any} it */
  function camTip(it) { const c = camOf(it); if (!c) return null; const a = c.dir * Math.PI / 180, r = 46 / Math.max(zoom.k, 0.4); return [c.at[0] + Math.cos(a) * r, c.at[1] + Math.sin(a) * r]; }
  const norm = (/** @type {number} */ x) => ((Math.round(x) % 360) + 360) % 360;

  // ---------------------------------------------------------------- new, double, delete
  function addNew(/** @type {string} */ kind) {
    const r = box.getBoundingClientRect(), cx = round((r.width / 2 - zoom.x) / zoom.k), cy = round((r.height / 2 - zoom.y) / zoom.k);
    let n = 1; while (byId(`${kind}_${n}`)) n++;
    const id = `${kind}_${n}`, base = { id, kind, name: { street: "Straße", building: "Haus", place: "Ort", room: "Raum", cam: `CAM ${n}`, view: "Blick", note: "Notiz", free: "frei", water: "Wasser" }[kind] ?? kind, ...(level !== "strasse" ? { level } : {}) };
    /** @type {any} */
    const it = kind === "cam" || kind === "view" ? { ...base, at: [cx, cy], dir: 0, status: "idee" }
      : kind === "note" ? { ...base, name: "Offen", at: [cx, cy], note: "…" }
      : kind === "place" ? { ...base, at: [cx, cy], status: "idee" }
      : kind === "free" || kind === "water" ? { ...base, rect: [cx - 60, cy - 40, 120, 80] }
      : kind === "room" ? { ...base, rect: [cx - 75, cy - 60, 150, 120], status: "idee", camera: { at: [cx + 110, cy + 95], dir: 225 } }
      : { ...base, rect: [cx - 50, cy - 30, 100, 60], status: "idee" };
    change(() => { plan.items.push(it); pick(id); });
  }
  /** the picked doubled, a little aside, their doors leading where they led; the copies are picked then */
  function duplicate() {
    const list = chosen(); if (!list.length) return;
    change(() => {
      const ids = [];
      for (const it of list) { const copy = JSON.parse(JSON.stringify(it)); copy.id = freeId(it.id); moveBy(copy, 20, 20); for (const [, d] of doorsOf(copy)) delete d.to; plan.items.push(copy); ids.push(copy.id); }
      many.clear(); for (const id of ids) many.add(id); sel = ids.at(-1) ?? "";
    });
  }
  function deleteSel() {
    const it0 = picked();
    if (selDoor && it0?.doors?.[selDoor]) { deleteDoor(it0, selDoor); return; }
    const list = chosen(); if (!list.length) return;
    change(() => {
      const gone = new Set(list.map((i) => i.id));
      for (const i of items()) for (const [, d] of doorsOf(i)) if (d.to && gone.has(String(d.to).split("/")[0])) delete d.to;
      plan.items = plan.items.filter((/** @type {any} */ i) => !gone.has(i.id)); pickNone();
    });
  }

  // ---------------------------------------------------------------- turning, as in a vector editor
  /** the box round everything picked, no margin @returns {number[] | null} */
  function selBox() {
    if (!many.size) return null;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const it of chosen()) {
      const pts = PD.points(it) ?? (it.at ? [[it.at[0] - 12, it.at[1] - 12], [it.at[0] + 12, it.at[1] + 12]] : []);
      for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    }
    return isFinite(x0) ? [x0, y0, x1, y1] : null;
  }
  /** the box round several picked, a little out from them: drag anywhere in it to move them all */
  function pickedBox() { if (many.size < 2) return null; const b = selBox(); if (!b) return null; const m = 8 / zoom.k; return [b[0] - m, b[1] - m, b[2] + m, b[3] + m]; }
  /** where the turning mark is: beside the box's top right corner, a little out */
  function turnMark() { const b = selBox(); if (!b) return null; const m = 18 / zoom.k; return [b[2] + m, b[1] - m]; }
  /** an item turned by deg round c, made from what it was (a turn dragged back and forth stays exact): a rect stays a rect by quarter
   *  turns, a shape of four points between them; a camera's dir turns with it @param {any} o @param {number[]} c @param {number} deg */
  function turned(o, c, deg) {
    const it = JSON.parse(JSON.stringify(o)), a = deg * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
    const R = (/** @type {number[]} */ p) => [round(c[0] + (p[0] - c[0]) * ca - (p[1] - c[1]) * sa), round(c[1] + (p[0] - c[0]) * sa + (p[1] - c[1]) * ca)];
    if (it.rect && norm(deg) % 90 !== 0) { const [x, y, w, h] = it.rect; it.poly = [x, y, x + w, y, x + w, y + h, x, y + h]; delete it.rect; }
    mapPoints(it, R);
    if (it.kind === "cam" || it.kind === "view") it.dir = norm((it.dir ?? 0) + deg);
    if (it.camera && !it.camera.top) it.camera = { ...it.camera, dir: norm((it.camera.dir ?? 0) + deg) };
    return it;
  }
  function turnStart() {
    const b = selBox(); if (!b) return null;
    return { c: [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2], orig: chosen().map((i) => ({ idx: plan.items.indexOf(i), it: JSON.parse(JSON.stringify(i)) })) };
  }
  function turnTo(/** @type {any} */ t, /** @type {number} */ deg) { for (const { idx, it } of t.orig) plan.items[idx] = turned(it, t.c, deg); }
  /** an item sized from its rect r0 to r1, everything it carries scaled with it @param {any} o @param {number[]} r1 */
  function sized(o, r1) {
    const it = JSON.parse(JSON.stringify(o)), [x0, y0, w0, h0] = o.rect, [x1, y1, w1, h1] = r1;
    mapPoints(it, (p) => [round(x1 + (p[0] - x0) * w1 / (w0 || 1)), round(y1 + (p[1] - y0) * h1 / (h0 || 1))]);
    it.rect = r1;
    return it;
  }

  // ---------------------------------------------------------------- the view
  const canvas = /** @type {HTMLCanvasElement} */ (el("canvas", { style: { width: "100%", height: "100%", display: "block", cursor: "default" } }));
  const box = el("div", { style: { width: "100%", height: "100%", background: "#0b0e18", position: "relative" } }, [canvas]);
  const toPlan = (/** @type {number} */ cx, /** @type {number} */ cy) => [(cx - zoom.x) / zoom.k, (cy - zoom.y) / zoom.k];
  function fit() {
    if (!plan) return;
    const r = box.getBoundingClientRect(); if (!r.width) return;
    const [W, H] = plan.size;
    zoom.k = Math.min(r.width / (W + 40), r.height / (H + 40));
    zoom.x = (r.width - W * zoom.k) / 2; zoom.y = (r.height - H * zoom.k) / 2;
    fitted = true; draw();
  }
  /** @type {any} */ let press = null;
  function draw() {
    const r = box.getBoundingClientRect(), dpr = devicePixelRatio || 1;
    if (!r.width) return;
    if (canvas.width !== Math.round(r.width * dpr) || canvas.height !== Math.round(r.height * dpr)) { canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr); }
    const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = "#06080f"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (!PD || !plan) { ctx.fillStyle = "#8a96b0"; ctx.font = "14px sans-serif"; ctx.fillText(broken ? `plan: ${broken}` : E.studio.available ? "loading the plan …" : "the Plan tab needs the studio (node lib/cutaway/tools/studio.mjs)", 20, 30); return; }
    ctx.setTransform(dpr * zoom.k, 0, 0, dpr * zoom.k, dpr * zoom.x, dpr * zoom.y);
    try { PD.drawMap(ctx, plan, level); } catch (e) { broken = /** @type {any} */ (e).message; }
    const lw = 1 / zoom.k, hs = 5 * lw;
    for (const it of chosen()) {
      ctx.strokeStyle = SEL; ctx.lineWidth = (it.id === sel ? 2.5 : 1.8) * lw; ctx.setLineDash([6 * lw, 4 * lw]);
      const pts = PD.points(it);
      if (pts) { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.stroke(); }
      else if (it.at) { ctx.beginPath(); ctx.arc(it.at[0], it.at[1], 12, 0, Math.PI * 2); ctx.stroke(); }
      ctx.setLineDash([]);
    }
    const bx = pickedBox();
    if (bx) { ctx.fillStyle = "rgba(255,225,74,0.05)"; ctx.fillRect(bx[0], bx[1], bx[2] - bx[0], bx[3] - bx[1]); ctx.strokeStyle = SEL; ctx.lineWidth = lw; ctx.setLineDash([2 * lw, 4 * lw]); ctx.strokeRect(bx[0], bx[1], bx[2] - bx[0], bx[3] - bx[1]); ctx.setLineDash([]); }
    const it = picked();
    if (it && many.size === 1) {
      ctx.fillStyle = SEL;
      if (it.rect) { const [x, y, w, h] = it.rect; ctx.fillRect(x + w - hs, y + h - hs, hs * 2, hs * 2); }
      if (it.poly) for (let i = 0; i < it.poly.length; i += 2) ctx.fillRect(it.poly[i] - hs, it.poly[i + 1] - hs, hs * 2, hs * 2);
      // its doors: squares (the picked one yellow), linked green, else orange
      for (const [k, d] of doorsOf(it)) {
        const s = hs * 1.4, linked = !!(d.to && PD.doorOf(plan, d.to));
        ctx.fillStyle = k === selDoor ? SEL : linked ? "#7fe0a0" : "#eea040"; ctx.fillRect(d.at[0] - s, d.at[1] - s, s * 2, s * 2);
        ctx.strokeStyle = "#06080f"; ctx.lineWidth = lw; ctx.strokeRect(d.at[0] - s, d.at[1] - s, s * 2, s * 2);
      }
      // its camera: the dot to drag, the arrow's tip to turn
      const cam = camOf(it), tip = camTip(it);
      if (cam && tip) {
        ctx.strokeStyle = SEL; ctx.lineWidth = 1.5 * lw; ctx.beginPath(); ctx.moveTo(cam.at[0], cam.at[1]); ctx.lineTo(tip[0], tip[1]); ctx.stroke();
        ctx.fillStyle = SEL; ctx.beginPath(); ctx.arc(tip[0], tip[1], hs * 1.2, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cam.at[0], cam.at[1], hs, 0, Math.PI * 2); ctx.strokeStyle = SEL; ctx.lineWidth = 2 * lw; ctx.stroke();
      }
    }
    // the turning mark beside the picked's top right corner: a round arrow
    const tm = turnMark();
    if (tm && !(press?.frame)) {
      const r = 9 * lw, turning = press?.g?.what === "rotate";
      ctx.fillStyle = turning ? SEL : "#1c1729"; ctx.beginPath(); ctx.arc(tm[0], tm[1], r, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = turning ? "#1c1729" : SEL; ctx.lineWidth = 1.5 * lw; ctx.stroke();
      ctx.beginPath(); ctx.arc(tm[0], tm[1], r * 0.55, -0.35 * Math.PI, 1.25 * Math.PI); ctx.stroke();
      const ex = tm[0] + Math.cos(-0.35 * Math.PI) * r * 0.55, ey = tm[1] + Math.sin(-0.35 * Math.PI) * r * 0.55;
      ctx.beginPath(); ctx.moveTo(ex + 3.2 * lw, ey - 0.6 * lw); ctx.lineTo(ex - 0.4 * lw, ey - 2.8 * lw); ctx.lineTo(ex - 0.6 * lw, ey + 1.8 * lw); ctx.closePath(); ctx.fillStyle = turning ? "#1c1729" : SEL; ctx.fill();
      if (turning && press.turn) {
        const [cx, cy] = press.turn.c;
        ctx.strokeStyle = SEL; ctx.lineWidth = lw; ctx.setLineDash([3 * lw, 3 * lw]); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(press.at[0], press.at[1]); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = SEL; ctx.fillRect(cx - 2 * lw, cy - 2 * lw, 4 * lw, 4 * lw);
        ctx.font = `bold ${13 * lw}px sans-serif`; ctx.fillText(`${press.deg}°`, press.at[0] + 12 * lw, press.at[1] - 8 * lw);
      }
    }
    if (press?.frame && press.moved) {
      const [x0, y0] = press.frame, [x1, y1] = press.to;
      ctx.fillStyle = "rgba(255,225,74,0.08)"; ctx.fillRect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
      ctx.strokeStyle = SEL; ctx.lineWidth = lw; ctx.setLineDash([4 * lw, 3 * lw]); ctx.strokeRect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0)); ctx.setLineDash([]);
    }
  }

  /** what a press at a plan point grabs: the turning mark, the picked one's camera, doors, corner and points, then a place @param {number} x @param {number} y */
  function grab(x, y) {
    const it = picked(), near = (/** @type {number[]} */ p, r = 9) => Math.hypot(p[0] - x, p[1] - y) < r / zoom.k;
    const tm = turnMark(); if (tm && near(tm, 11)) return { what: "rotate", it: it ?? chosen()[0] };
    if (it && many.size === 1) {
      const tip = camTip(it); if (tip && near(tip)) return { what: "camturn", it };
      const cam = camOf(it); if (cam && it.camera && near(cam.at, 7)) return { what: "cammove", it };
      for (const [k, d] of doorsOf(it)) if (near(d.at)) return { what: "door", it, key: k };
      if (it.rect && near([it.rect[0] + it.rect[2], it.rect[1] + it.rect[3]])) return { what: "size", it };
      if (it.poly) for (let i = 0; i < it.poly.length; i += 2) if (near([it.poly[i], it.poly[i + 1]])) return { what: "point", it, i };
    }
    const hit = PD.itemAt(plan, level, x, y);
    const bx = pickedBox(), inBox = bx && x >= bx[0] && x <= bx[2] && y >= bx[1] && y <= bx[3];
    if (inBox && (!hit || many.has(hit.id) || hit.kind === "water")) return { what: "move", it: many.has(hit?.id) ? hit : picked() ?? chosen()[0], group: true };
    return hit ? { what: "move", it: hit } : null;
  }
  /** everything on this level whose middle lies in a frame (not the water) @param {number[]} a @param {number[]} b */
  function inFrame(a, b) {
    const [x0, x1] = [Math.min(a[0], b[0]), Math.max(a[0], b[0])], [y0, y1] = [Math.min(a[1], b[1]), Math.max(a[1], b[1])];
    return items().filter((i) => onLevel(i) && i.kind !== "water").filter((i) => { const c = PD.centre(i); return c && c[0] >= x0 && c[0] <= x1 && c[1] >= y0 && c[1] <= y1; });
  }
  canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  canvas.addEventListener("pointerdown", (/** @type {PointerEvent} */ e) => {
    if (!PD || !plan) return;
    const r = canvas.getBoundingClientRect(), [x, y] = toPlan(e.clientX - r.left, e.clientY - r.top);
    try { canvas.setPointerCapture(e.pointerId); } catch { /* a pointer the browser doesn't hold (a test's) */ }
    if (e.button !== 0 || space) { press = { pan: true, x0: e.clientX, y0: e.clientY, zx: zoom.x, zy: zoom.y, moved: false }; canvas.style.cursor = "grabbing"; return; }
    const g = grab(x, y), before = JSON.stringify(plan);
    if (g && e.altKey && g.it.poly) {
      const it = g.it;
      if (g.what === "point" && it.poly.length > 6) { change(() => { it.poly.splice(g.i, 2); }); return; }
      let best = -1, bd = Infinity;
      for (let i = 0; i < it.poly.length; i += 2) {
        const j = (i + 2) % it.poly.length, ax = it.poly[i], ay = it.poly[i + 1], bx = it.poly[j], by = it.poly[j + 1];
        const t = Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2 || 1))), d = Math.hypot(ax + t * (bx - ax) - x, ay + t * (by - ay) - y);
        if (d < bd) { bd = d; best = i; }
      }
      if (best >= 0) change(() => { it.poly.splice(best + 2, 0, round(x), round(y)); });
      return;
    }
    if (g && !g.group && g.what === "move" && (e.ctrlKey || e.metaKey)) { pick(g.it.id, "toggle"); E.refresh(); draw(); return; }
    if (g?.group && (e.ctrlKey || e.metaKey || e.shiftKey)) { const hit = PD.itemAt(plan, level, x, y); if (hit && hit.kind !== "water") { pick(hit.id, e.shiftKey ? "add" : "toggle"); E.refresh(); draw(); return; } }
    if (!g) { press = { frame: [x, y], to: [x, y], add: e.shiftKey, x0: e.clientX, y0: e.clientY, moved: false }; return; }
    if (g.what === "rotate") { press = { g, x0: e.clientX, y0: e.clientY, moved: false, before, turn: turnStart(), at: [x, y], deg: 0 }; press.a0 = Math.atan2(y - press.turn.c[1], x - press.turn.c[0]); draw(); return; }
    if (g.it.kind === "water" && g.what === "move" && !g.group && !e.shiftKey && !many.has(g.it.id)) { pick(g.it.id); E.refresh(); draw(); return; }
    if (g.what === "door") selDoor = g.key; else if (g.what === "move") selDoor = "";
    if (g.what === "move" && !g.group && !many.has(g.it.id)) pick(g.it.id, e.shiftKey ? "add" : "only");
    else if (g.what === "move" && !g.group) sel = g.it.id;
    E.refresh();
    press = { g, x0: e.clientX, y0: e.clientY, px: x, py: y, moved: false, before, orig: JSON.parse(JSON.stringify(g.it)) };
    draw();
  });
  canvas.addEventListener("pointermove", (/** @type {PointerEvent} */ e) => {
    const r = canvas.getBoundingClientRect(), [x, y] = toPlan(e.clientX - r.left, e.clientY - r.top);
    if (!press) {
      const g = PD && plan && !space ? grab(x, y) : null;
      canvas.style.cursor = space ? "grab" : !g ? "crosshair" : g.what === "rotate" ? "grab" : g.what === "size" ? "nwse-resize" : g.what === "move" || g.what === "door" || g.what === "cammove" ? "move" : "pointer";
      return;
    }
    if (Math.abs(e.clientX - press.x0) + Math.abs(e.clientY - press.y0) > 3) press.moved = true;
    if (!press.moved) return;
    if (press.pan) { zoom.x = press.zx + e.clientX - press.x0; zoom.y = press.zy + e.clientY - press.y0; draw(); return; }
    if (press.frame) { press.to = [x, y]; draw(); return; }
    const g = press.g, it = g.it;
    if (g.what === "move") { for (const c of chosen()) if (c.kind !== "water" || e.shiftKey || many.size === 1) moveBy(c, x - press.px, y - press.py); press.px = x; press.py = y; }
    else if (g.what === "size") { const [x0, y0] = press.orig.rect, n = sized(press.orig, [x0, y0, Math.max(8, round(x - x0)), Math.max(8, round(y - y0))]); Object.keys(it).forEach((k) => delete it[k]); Object.assign(it, n); }
    else if (g.what === "point") { it.poly[g.i] = round(x); it.poly[g.i + 1] = round(y); }
    else if (g.what === "door") it.doors = { ...it.doors, [g.key]: { ...it.doors[g.key], at: [round(x), round(y)] } };
    else if (g.what === "cammove") it.camera = { ...it.camera, at: [round(x), round(y)] };
    else if (g.what === "camturn") { const c = camOf(it), a = Math.atan2(y - c.at[1], x - c.at[0]) * 180 / Math.PI; c.set({ dir: norm(e.shiftKey ? a : Math.round(a / 15) * 15) }); }
    else if (g.what === "rotate") {
      const raw = (Math.atan2(y - press.turn.c[1], x - press.turn.c[0]) - press.a0) * 180 / Math.PI, d = ((raw % 360) + 540) % 360 - 180;
      press.deg = e.shiftKey ? Math.round(d) : Math.round(d / 15) * 15; press.at = [x, y];
      turnTo(press.turn, press.deg);
    }
    draw();
  });
  canvas.addEventListener("pointerup", () => {
    if (!press) return;
    if (press.frame) {
      if (press.moved) {
        const hit = inFrame(press.frame, press.to);
        if (!press.add) many.clear();
        for (const it of hit) many.add(it.id);
        sel = hit.at(-1)?.id ?? (press.add ? sel : ""); selDoor = "";
        E.setStatus(`${many.size} picked`);
      } else if (!press.add) pickNone();
      E.refresh();
    } else if (press.g && press.moved) { undoStack.push(press.before); redoStack = []; E.refresh(); }
    press = null; canvas.style.cursor = space ? "grab" : "default"; draw();
  });
  // a double click on a room opens its room of the game: in the Iso-Editor when it has a map, else in the Room tab
  canvas.addEventListener("dblclick", async (/** @type {MouseEvent} */ e) => {
    const r = canvas.getBoundingClientRect(), [x, y] = toPlan(e.clientX - r.left, e.clientY - r.top), hit = PD?.itemAt(plan, level, x, y);
    const room = String(hit?.room ?? "").split(",")[0].trim();
    if (!room || !Cutaway.room.ids().includes(room)) { if (!hit) fit(); else E.setStatus(room ? `plan: the game has no room ${room}` : "plan: this place names no room of the game (its field room)"); return; }
    await E.openRoom(room);
    let map = true;
    try { await E.studio.read(`art/rooms/${room}.map.js`); } catch { map = false; }
    if (map && E.modules.iso) { await E.modules.iso.open(room); E.show("iso"); } else E.show("room");
  });
  canvas.addEventListener("wheel", (/** @type {WheelEvent} */ e) => {
    e.preventDefault(); e.stopPropagation();
    const r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top, f = Math.exp(-e.deltaY * 0.0015);
    zoom.x = mx - (mx - zoom.x) * f; zoom.y = my - (my - zoom.y) * f; zoom.k *= f; draw();
  }, { passive: false });
  window.addEventListener("keydown", (e) => { if (e.code === "Space" && box.isConnected && !/INPUT|TEXTAREA|SELECT/.test(/** @type {any} */ (e.target)?.tagName ?? "")) { if (!space) { space = true; canvas.style.cursor = "grab"; } e.preventDefault(); } }, true);
  window.addEventListener("keyup", (e) => { if (e.code === "Space" && space) { space = false; canvas.style.cursor = "default"; } }, true);
  new ResizeObserver(() => draw()).observe(box);
  const view = { el: box, shown() { boot(); if (PD && plan) requestAnimationFrame(() => (fitted ? draw() : fit())); }, selectNone() { pickNone(); E.refresh(); draw(); } };

  /** @param {KeyboardEvent} e */
  function key(e) {
    if (!plan) return false;
    if ((e.ctrlKey || e.metaKey) && E.letter(e) === "d") { duplicate(); return true; }
    if ((e.ctrlKey || e.metaKey) && E.letter(e) === "a") { many.clear(); for (const i of items().filter((x) => onLevel(x) && x.kind !== "water")) many.add(i.id); sel = [...many].at(-1) ?? ""; selDoor = ""; E.setStatus(`${many.size} picked`); E.refresh(); draw(); return true; }
    // (Ctrl+Z and Ctrl+Y: the editor hands them to the tab's undo and redo)
    // [ and ]: typed as they are (a German keyboard types them with AltGr, which comes as Ctrl and Alt), or the keys where they sit
    const altGr = e.ctrlKey && e.altKey;
    if (many.size && (!(e.ctrlKey || e.metaKey) || altGr) && (e.key === "[" || e.key === "]" || (!altGr && (e.code === "BracketLeft" || e.code === "BracketRight")))) {
      const right = e.key === "]" || (e.key !== "[" && e.code === "BracketRight"), t = turnStart();
      if (t) change(() => turnTo(t, (right ? 1 : -1) * (e.shiftKey ? 90 : 15)));
      return true;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) return false;
    if (e.key === "Escape" && (many.size || selDoor)) { if (selDoor) selDoor = ""; else pickNone(); E.refresh(); draw(); return true; }
    const d = /** @type {Record<string, number[]>} */ ({ ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] })[e.key];
    if (!d) return false;
    const k = e.shiftKey ? 10 : 1, it = picked();
    if (it && selDoor && it.doors?.[selDoor]) { change(() => { const dd = it.doors[selDoor]; it.doors = { ...it.doors, [selDoor]: { ...dd, at: [round(dd.at[0] + d[0] * k), round(dd.at[1] + d[1] * k)] } }; }); return true; }
    if (many.size) { change(() => { for (const c of chosen()) moveBy(c, d[0] * k, d[1] * k); }); return true; }
    return false;
  }

  // ---------------------------------------------------------------- saving
  /** a changed text with the line ends its file had (a file written with CRLF keeps them on the lines put in) @param {string} was @param {string} text */
  const sameEnds = (was, text) => (was.includes("\r\n") ? text.replace(/\r?\n/g, "\r\n") : text);
  const rootOf = (/** @type {string} */ text) => { const i = text.indexOf("var STADTPLAN"); return i < 0 ? null : L.value(text, text.indexOf("=", i) + 1); };
  /** the file's text with the plan as the tab holds it: the items list patched (what is unchanged stays as written), the accept list */
  function textNow() {
    let text = /** @type {string} */ (E.files.text(PATH));
    const root = rootOf(text), arr = root && L.field(root, "items");
    if (!arr) throw new Error("no items list in the file");
    const r = L.replaceList(text, arr, L.valueOf(text, arr), plan.items, (/** @type {string} */ t) => { const o = rootOf(t); return o && L.field(o, "items"); });
    if ("why" in r) throw new Error(r.why);
    text = r.text;
    const root2 = /** @type {any} */ (rootOf(text)), acc = L.field(root2, "accept");
    if (acc && JSON.stringify(L.valueOf(text, acc)) !== JSON.stringify(plan.accept ?? {})) {
      const body = Object.entries(plan.accept ?? {}).map(([k, v]) => `    ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join("\n");
      text = L.put(text, acc, body ? `{\n${body}\n  }` : "{}");
    }
    return sameEnds(/** @type {string} */ (E.files.text(PATH)), text);
  }
  async function save() {
    if (!plan) return;
    try {
      E.files.set(PATH, textNow());
      E.setStatus(await E.files.save(PATH) ? `saved ${PATH}` : `${PATH}: nothing to save`);
      saved = JSON.stringify(plan);
    } catch (e) { E.setStatus(`${PATH}: not saved: ${/** @type {any} */ (e).message}`); }
    E.refresh();
  }
  E.files.on((path, why) => { if (path === PATH && why === "reload" && JSON.stringify(plan) === saved) load().then(() => { E.refresh(); draw(); }); });

  // ---------------------------------------------------------------- the inspector
  const row = (/** @type {string} */ label, /** @type {Node} */ input) => el("div", { style: { display: "flex", gap: "6px", alignItems: "center", margin: "3px 0" } }, [el("span", { className: "cw-dim", style: { width: "64px", flex: "none" } }, [label]), input]);
  /** a text field of the picked item; empty takes the key out @param {any} it @param {string} k @param {boolean} [num] */
  function textField(it, k, num = false) {
    return el("input", { value: it[k] ?? "", style: { flex: "1", minWidth: "0" },
      onchange: (/** @type {any} */ e) => change(() => {
        const v = e.target.value.trim();
        if (k === "id") {
          if (!v || v === it.id || byId(v)) return;
          for (const i of items()) for (const [, d] of doorsOf(i)) if (String(d.to ?? "").startsWith(`${it.id}/`)) d.to = `${v}/${String(d.to).slice(it.id.length + 1)}`;
          many.delete(it.id); many.add(v); if (sel === it.id) sel = v; it.id = v; return;
        }
        if (v === "") delete it[k]; else it[k] = num ? Number(v) : v;
      }) });
  }
  /** a choice for the picked (or, given a list, for all of them) @param {any[]} list @param {string} k @param {string[]} opts @param {string} none */
  function choice(list, k, opts, none) {
    const same = list.every((i) => (i[k] ?? "") === (list[0][k] ?? ""));
    return el("select", { style: { flex: "1" }, onchange: (/** @type {any} */ e) => change(() => { for (const it of list) { if (e.target.value === "") delete it[k]; else it[k] = e.target.value; } }) },
      [...(same ? [] : [el("option", { value: "", selected: true, disabled: true }, ["(mixed)"])]), el("option", { value: "" }, [none]), ...opts.map((o) => el("option", { value: o, selected: same && (list[0][k] ?? "") === o }, [o]))]);
  }
  /** the room of the game a double click opens: typed, or picked from the game's rooms @param {any} it */
  function roomField(it) {
    const input = textField(it, "room");
    input.setAttribute("list", "plan-rooms");
    return el("span", { style: { display: "flex", flex: "1", minWidth: "0" } }, [input, el("datalist", { id: "plan-rooms" }, Cutaway.room.ids().sort().map((r) => el("option", { value: r })))]);
  }
  /** the picked one's doors: each named, linked to a door of another place (both ways), taken out; a new one @param {any} it */
  function doorsBox(it) {
    const others = allDoors().filter((d) => d.it !== it);
    const rows = doorsOf(it).map(([k, d]) => {
      const name = el("input", { value: k, style: { width: "86px" }, title: "the door's name (what leads to it goes with it)", onchange: (/** @type {any} */ e) => change(() => renameDoor(it, k, e.target.value.trim())) });
      const to = el("select", { style: { flex: "1", minWidth: "0" }, title: "the door it leads to (and that one back to it)", onchange: (/** @type {any} */ e) => change(() => linkDoor(it, k, e.target.value)) },
        [el("option", { value: "" }, ["— leads nowhere"]), ...others.map((o) => el("option", { value: o.ref, selected: d.to === o.ref }, [`${o.it.name} · ${o.k}`])),
          ...(d.to && !PD.doorOf(plan, d.to) ? [el("option", { value: d.to, selected: true }, [`${d.to} (gone)`])] : [])]);
      const linked = !!(d.to && PD.doorOf(plan, d.to));
      return el("div", { style: { display: "flex", gap: "4px", alignItems: "center", margin: "2px 0", ...(k === selDoor ? { outline: `1px solid ${SEL}` } : {}) }, onclick: () => { if (selDoor !== k) { selDoor = k; draw(); } } }, [
        el("span", { style: { width: "10px", height: "10px", flex: "none", background: k === selDoor ? SEL : linked ? "#7fe0a0" : "#eea040" } }), name, "→", to,
        button("×", () => deleteDoor(it, k), "take this door out (Del when it is picked)")]);
    });
    return el("div", { style: { margin: "6px 0" } }, [
      el("div", { className: "cw-dim" }, [`doors (${rows.length}): drag a square; linked green, else orange`]), ...rows,
      el("div", {}, [button("Add door", () => addDoor(it), "a new door in the middle; drag it where it belongs, then link it")])]);
  }
  /** the picked one's camera: where its picture is seen from @param {any} it */
  function cameraBox(it) {
    if (it.kind === "cam" || it.kind === "view") return row("looks", el("input", { type: "number", step: 15, value: it.dir ?? 0, style: { width: "70px" }, onchange: (/** @type {any} */ e) => change(() => { it.dir = norm(Number(e.target.value)); }) }));
    const c = it.camera;
    const kindSel = el("select", { onchange: (/** @type {any} */ e) => change(() => {
      const v = e.target.value, m = PD.centre(it) ?? [0, 0];
      if (v === "none") delete it.camera; else if (v === "top") it.camera = { top: true }; else it.camera = { at: c?.at ?? [round(m[0] + 60), round(m[1] + 60)], dir: c?.dir ?? 225 };
    }) }, [["none", "no camera"], ["at", "from a place"], ["top", "from above"]].map(([v, t]) => el("option", { value: v, selected: (c ? (c.top ? "top" : "at") : "none") === v }, [t])));
    return row("camera", el("span", { style: { display: "flex", gap: "4px", alignItems: "center", flex: "1" } }, [kindSel,
      ...(c?.at ? [el("input", { type: "number", step: 15, value: c.dir ?? 0, title: "where it looks (0 east, 90 south)", style: { width: "60px" }, onchange: (/** @type {any} */ e) => change(() => { it.camera = { ...it.camera, dir: norm(Number(e.target.value)) }; }) }), "°"] : [])]));
  }

  function build(/** @type {HTMLElement} */ panel) {
    if (!E.studio.available) { panel.append(el("div", { className: "cw-sec cw-dim" }, ["The Plan tab needs the studio: node lib/cutaway/tools/studio.mjs"])); return; }
    if (!plan) { panel.append(el("div", { className: "cw-sec cw-dim" }, [broken ? `plan: ${broken}` : "loading …"])); boot(); return; }
    const dirty = JSON.stringify(plan) !== saved;
    panel.append(el("div", { className: "cw-sec" }, [
      el("div", { style: { fontWeight: "bold" } }, [`${PATH}${dirty ? "  ●" : ""}`]),
      el("div", { className: "cw-dim" }, ["The plan is its own: what changes here changes neither the game nor its maps."]),
      el("div", { style: { margin: "4px 0" } }, [button("Save", save, "write the plan back (only what changed)"), button("Fit", fit, "the whole plan in view (or a double click on the ground)"),
        button("Pictures", () => E.runTask("plan: pictures"), "write docs/plan/stadtplan_<level>.png (the task in studio.json)")])]));
    panel.append(el("div", { className: "cw-sec" }, [el("div", { className: "cw-dim" }, ["Level"]),
      el("div", {}, plan.levels.map((/** @type {any} */ l) => el("button", { onclick: () => { level = l.id; for (const it of chosen()) if (!onLevel(it)) many.delete(it.id); prune(); E.refresh(); draw(); },
        style: l.id === level ? { background: "#3a2f55", borderColor: SEL, color: SEL } : {} }, [l.name])))]));
    const kindSel = /** @type {HTMLSelectElement} */ (el("select", {}, KINDS.map((k) => el("option", { value: k }, [k]))));
    panel.append(el("div", { className: "cw-sec" }, [el("div", { className: "cw-dim" }, ["New on this level, in the middle of the view"]),
      el("div", { style: { display: "flex", gap: "4px" } }, [kindSel, button("Add", () => addNew(kindSel.value), "a new item of that kind")])]));
    const list = chosen(), it = picked();
    if (list.length > 1) {
      panel.append(el("div", { className: "cw-sec" }, [
        el("div", { style: { fontWeight: "bold", color: SEL } }, [`${list.length} picked`]),
        el("div", { className: "cw-dim", style: { margin: "2px 0 4px" } }, ["Drag one of them, or anywhere in the box round them, or the arrows: they all go. The round arrow turns them. Ctrl+click takes one in or out, Esc none."]),
        row("level", choice(list, "level", plan.levels.map((/** @type {any} */ l) => l.id), "strasse")),
        row("status", choice(list, "status", STATUSES, "—")),
        el("div", { style: { maxHeight: "160px", overflow: "auto", margin: "4px 0" } }, list.map((i) => el("div", { style: { cursor: "pointer", color: i.id === sel ? SEL : "" }, onclick: () => { sel = i.id; E.refresh(); draw(); } }, [`${i.name ?? i.id}  `, el("span", { className: "cw-dim" }, [i.kind])]))),
        el("div", {}, [button("Double", duplicate, "Ctrl+D"), button("Delete", deleteSel, "Del"), button("Only this one", () => { if (sel) pick(sel); E.refresh(); draw(); }, "keep only the one in yellow")])]));
    } else if (it) {
      const fields = [
        row("id", textField(it, "id")), row("name", textField(it, "name")),
        row("kind", choice([it], "kind", KINDS, "—")), row("level", choice([it], "level", plan.levels.map((/** @type {any} */ l) => l.id), "strasse")),
        row("status", choice([it], "status", STATUSES, "—")), row("game room", roomField(it)), row("chapter", textField(it, "chapter", true)),
        cameraBox(it),
      ];
      if (it.kind === "room") fields.push(row("outdoor", el("input", { type: "checkbox", checked: !!it.outdoor, onchange: (/** @type {any} */ e) => change(() => { if (e.target.checked) it.outdoor = true; else delete it.outdoor; }) })));
      if (it.kind !== "cam" && it.kind !== "note") fields.push(doorsBox(it));
      if (it.walls?.length) fields.push(el("div", { className: "cw-dim" }, [`walls: ${it.walls.length} (they move, turn and size with it) `, button("Take them out", () => change(() => { delete it.walls; }), "the room drawn by its outline alone")]));
      fields.push(el("div", { className: "cw-dim", style: { marginTop: "4px" } }, ["note"]),
        el("textarea", { value: it.note ?? "", rows: 5, style: { width: "100%", boxSizing: "border-box" }, onchange: (/** @type {any} */ e) => change(() => { const v = e.target.value.trim(); if (v) it.note = v; else delete it.note; }) }));
      if (it.label) fields.push(el("div", {}, [button("Name in the middle", () => change(() => { delete it.label; }), "the name back in the middle of its shape")]));
      fields.push(el("div", { style: { marginTop: "4px" } }, [button("Double", duplicate, "Ctrl+D"), button("Delete", deleteSel, "Del")]));
      panel.append(el("div", { className: "cw-sec" }, [el("div", { style: { fontWeight: "bold", color: SEL } }, [it.name ?? it.id]), ...fields]));
    } else panel.append(el("div", { className: "cw-sec cw-dim" }, ["Click a place to pick it, or drag a frame on the ground round several; drag them, a corner, a shape's points, a door, a camera; the round arrow beside them (or [ and ]) turns them round their middle. The right button (or Space) moves the view. A double click on a room opens it in the game's editor."]));
    const probs = PD ? PD.problems(plan) : [];
    panel.append(el("div", { className: "cw-sec" }, [E.fold("plan.problems", "doesn't fit", () => probs.length ? probs.map((/** @type {any} */ p) => el("div", { style: { margin: "3px 0" } }, [
      el("span", { style: { cursor: p.at ? "pointer" : "default", color: p.level === level ? "#ff8a8a" : "" }, title: "show it",
        onclick: () => { if (!p.at) return; if (p.level) level = p.level; const r = box.getBoundingClientRect(); zoom.x = r.width / 2 - p.at[0] * zoom.k; zoom.y = r.height / 2 - p.at[1] * zoom.k; E.refresh(); draw(); } }, [`${p.n}. ${p.text}`]),
      ...(p.way ? [" ", button("on purpose", () => {
        const why = prompt(`Why do the doors of ${p.way} lie apart? (a passage, a flight of stairs)`, "");
        if (why) change(() => { plan.accept = { ...(plan.accept ?? {}), [p.way]: why }; });
      }, "these doors lie apart on purpose: drawn dashed, not counted (the plan's accept list)")] : [])])) : [el("div", { className: "cw-dim" }, ["everything fits"])], { note: String(probs.length) })]));
  }

  function browse(/** @type {HTMLElement} */ boxEl) {
    if (!plan) return;
    const list = items().filter(onLevel).map((i) => ({ key: i.id, label: `${many.has(i.id) && many.size > 1 ? "● " : ""}${i.name ?? i.id}${i.room ? `  · ${i.room}` : ""}`, group: i.kind }));
    boxEl.append(E.fold("left.plan", `PLAN · ${(plan.levels.find((/** @type {any} */ l) => l.id === level)?.name ?? level).toUpperCase()}`, () => [E.list({ id: "plan.items", items: list, filter: list.length > 15, foldOver: 12, selected: sel || undefined,
      pick: (/** @type {string} */ k) => { pick(k); const it = picked(), c = it && PD.centre(it), r = box.getBoundingClientRect(); if (c) { zoom.x = r.width / 2 - c[0] * zoom.k; zoom.y = r.height / 2 - c[1] * zoom.k; } E.refresh(); draw(); } })], { note: String(list.length) }));
  }

  E.tab({ id: "plan", label: "Plan", build, browse, view: () => view, key, save: () => save(), del: () => deleteSel(),
    undo: () => step(undoStack, redoStack), redo: () => step(redoStack, undoStack),
    selectNone: () => { pickNone(); E.refresh(); draw(); },
    get unsaved() { return plan && JSON.stringify(plan) !== saved ? 1 : 0; } });
  E.modules.plan = { get plan() { return plan; }, get picked() { return [...many]; }, get door() { return selDoor; }, get level() { return level; }, set level(v) { level = v; E.refresh(); draw(); },
    select(/** @type {string} */ id) { pick(id); E.refresh(); draw(); }, save, textNow, boot, fit,
    /** a plan point on the screen (tests) @param {number[]} p */
    toScreen(p) { const r = canvas.getBoundingClientRect(); return [r.left + zoom.x + p[0] * zoom.k, r.top + zoom.y + p[1] * zoom.k]; },
    turnMark, camTip };
})();

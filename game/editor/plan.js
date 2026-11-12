// The editor's Plan tab (the studio loads it: studio.json "editor"): the city's plan (docs/plan/stadtplan.js) arranged and
// edited, level by level, drawn by docs/plan/plan.js as the plan's page draws it: the rooms Juno walks from their iso maps, the
// cameras, the ways between the rooms, what doesn't fit. The ways come from the running game itself (every hotspot's exit and
// goto between the rooms Juno walks), so they are always the game's own.
//   pick      a click (on the picked level); Ctrl+click takes one in or out; a frame dragged on the ground picks all whose
//             middle lies in it (not the water; Shift adds them); Ctrl+A all on the level; Esc none. The left panel lists them
//   move      drag one of the picked, or anywhere in the box round them: all of them go (the water only with Shift, when it
//             is the one picked); the arrows nudge them (Shift: ten units)
//   view      the wheel zooms; the right or middle button, or Space held, drags the view; a double click on the ground fits it
//   shape     a rect's corner handle sizes it, a shape's points drag one by one (Alt+click on an edge adds one, on a point takes it)
//   turn      the handle at the end of a camera's or a room's arrow turns it ([ and ] by 15°, Shift by 90°: all the picked)
//   new       the inspector's kinds put one in the middle of the view; Ctrl+D doubles the picked; Del takes them out
// Save writes the file back, only the values changed (its comments and layout stay); Ctrl+Z undoes, Ctrl+Y does again.
"use strict";

(function () {
  const E = Cutaway.editor, el = E.el, button = E.button, L = E.modules.literal;
  const PATH = "docs/plan/stadtplan.js", DRAW = "docs/plan/plan.js";
  const KINDS = ["street", "building", "place", "room", "cam", "view", "note", "free", "water"];
  const STATUSES = ["gemalt", "block", "geplant", "vorschlag", "idee"];
  const SEL = "#ffe14a";

  /** @type {any} */ let PD = null;                 // docs/plan/plan.js, made with the maps and the game's ways
  /** @type {any} */ let lib = null;                // { ISOMAP, ISO_MAPS, drawSrc }
  /** @type {any} */ let plan = null;               // the plan as the tab holds it now
  let level = "strasse", sel = "", broken = "", loading = false;
  /** @type {Set<string>} every picked item's id (sel, the one the inspector shows, among them) */
  const many = new Set();
  /** @type {string[]} */ let undoStack = [], redoStack = [];
  let saved = "";                                    // the plan as the file holds it (JSON), to tell what is unsaved
  const zoom = { x: 20, y: 20, k: 0.6 };
  let fitted = false, space = false;

  // ---------------------------------------------------------------- loading
  async function boot() {
    if (lib || loading || !E.studio.available) return;
    loading = true;
    try {
      const iso = new Function(`${await E.studio.read("art/lib/isomap.js")}\n;return { ISOMAP, ISO_MAPS };`)();
      for (const f of (await E.studio.list("art/rooms")).filter((x) => x.name.endsWith(".map.js")))
        new Function("ISO_MAPS", await E.studio.read(`art/rooms/${f.name}`))(iso.ISO_MAPS);
      lib = { ...iso, drawSrc: await E.studio.read(DRAW) };
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
    remake();
  }
  /** the ways between the rooms Juno walks, from the game's own rooms (as tools/stadtplan-links.mjs reads them) */
  function gameWays() {
    const C = Cutaway, walked = new Set(C.room.ids().filter((id) => { const r = /** @type {any} */ (C.room.get(id)); return r.walk && !r.observe && !r.feed; }));
    const placeOf = (/** @type {any} */ h) => {
      if (h.walkTo) return h.walkTo.slice(0, 2);
      if (h.rect) return [h.rect[0] + h.rect[2] / 2, h.rect[1] + h.rect[3] / 2];
      if (h.poly) { let x = 0, y = 0; for (let i = 0; i < h.poly.length; i += 2) { x += h.poly[i]; y += h.poly[i + 1]; } return [x / (h.poly.length / 2), y / (h.poly.length / 2)]; }
      return null;
    };
    /** @param {any} s @param {any[]} out */
    const gotos = (s, out) => {
      if (Array.isArray(s)) { for (const x of s) gotos(x, out); return out; }
      if (!s || typeof s !== "object") return out;
      if (typeof s.goto === "string") out.push({ to: s.goto, at: s.at ?? null });
      for (const [k, v] of Object.entries(s)) if (k !== "if" && v && typeof v === "object") gotos(v, out);
      return out;
    };
    const links = [], seen = new Set();
    for (const id of walked) {
      const r = /** @type {any} */ (C.room.get(id));
      for (const [hid, h] of Object.entries(/** @type {Record<string, any>} */ (r.hotspots ?? {}))) {
        const at = placeOf(h), name = typeof h.name === "string" ? h.name : hid, add = (/** @type {string} */ to, /** @type {any} */ toAt) => {
          const k = `${id}/${hid}/${to}`; if (seen.has(k) || to === id || !walked.has(to)) return; seen.add(k);
          links.push({ from: id, hotspot: hid, name, at, to, toAt });
        };
        if (h.exit) add(h.exit.to, h.exit.at ?? null);
        for (const g of gotos([h.use, h.look, h.talk, Object.values(h.with ?? {})], [])) add(g.to, g.at);
      }
    }
    return { links, rooms: [...walked].sort() };
  }
  function remake() {
    const w = gameWays();
    PD = new Function("ISOMAP", "ISO_MAPS", "STADTPLAN_LINKS", "STADTPLAN_ROOMS", `${lib.drawSrc}\n;return PlanDraw;`)(lib.ISOMAP, lib.ISO_MAPS, w.links, w.rooms);
  }

  // ---------------------------------------------------------------- the plan's items and what is picked
  const items = () => /** @type {any[]} */ (plan?.items ?? []);
  const picked = () => items().find((i) => i.id === sel) ?? null;
  const chosen = () => items().filter((i) => many.has(i.id));
  const onLevel = (/** @type {any} */ it) => (it.level ?? "strasse") === level || it.kind === "water";
  function pickNone() { sel = ""; many.clear(); }
  /** pick one: "only" it, "add" it to the picked, "toggle" it in or out @param {string} id @param {"only" | "add" | "toggle"} how */
  function pick(id, how = "only") {
    if (how === "only") { many.clear(); many.add(id); sel = id; }
    else if (how === "add") { many.add(id); sel = id; }
    else if (many.has(id)) { many.delete(id); sel = sel === id ? [...many].at(-1) ?? "" : sel; }
    else { many.add(id); sel = id; }
  }
  /** keep only what is still there (after an undo) */
  function prune() { const ids = new Set(items().map((i) => i.id)); for (const id of [...many]) if (!ids.has(id)) many.delete(id); if (!ids.has(sel)) sel = [...many].at(-1) ?? ""; }
  /** a change: what was before goes on the undo stack */
  function change(/** @type {() => void} */ fn) { undoStack.push(JSON.stringify(plan)); redoStack = []; fn(); prune(); E.refresh(); draw(); }
  function step(/** @type {string[]} */ from, /** @type {string[]} */ to) {
    const s = from.pop(); if (!s) { E.setStatus(from === undoStack ? "nothing to undo" : "nothing to do again"); return; }
    to.push(JSON.stringify(plan)); plan = JSON.parse(s);
    prune(); E.refresh(); draw();
  }
  const round = (/** @type {number} */ v) => Math.round(v * 2) / 2;
  /** move an item by dx, dy: its shape, its label, its doors, its camera */
  function moveBy(/** @type {any} */ it, /** @type {number} */ dx, /** @type {number} */ dy) {
    if (it.rect) it.rect = [round(it.rect[0] + dx), round(it.rect[1] + dy), it.rect[2], it.rect[3]];
    if (it.poly) it.poly = it.poly.map((/** @type {number} */ v, /** @type {number} */ i) => round(v + (i % 2 ? dy : dx)));
    if (it.at) it.at = [round(it.at[0] + dx), round(it.at[1] + dy)];
    if (it.label) it.label = [round(it.label[0] + dx), round(it.label[1] + dy)];
    if (it.view?.at) it.view = { ...it.view, at: [round(it.view.at[0] + dx), round(it.view.at[1] + dy)] };
    if (it.doors) it.doors = Object.fromEntries(Object.entries(it.doors).map(([k, p]) => [k, [round(/** @type {any} */ (p)[0] + dx), round(/** @type {any} */ (p)[1] + dy)]]));
  }
  /** the angle an item turns by: a camera's or a view's dir, a room's rot, a painted room's camera */
  const angleKey = (/** @type {any} */ it) => (it.kind === "cam" || it.kind === "view" ? "dir" : it.iso || it.topdown ? "rot" : it.view && !it.view.top ? "view" : null);
  const angleOf = (/** @type {any} */ it) => { const k = angleKey(it); return k === "view" ? it.view.dir ?? 0 : k ? it[k] ?? 0 : 0; };
  function setAngle(/** @type {any} */ it, /** @type {number} */ a) {
    a = ((Math.round(a) % 360) + 360) % 360;
    const k = angleKey(it); if (!k) return;
    if (k === "view") it.view = { ...it.view, dir: a }; else it[k] = a;
  }
  /** where an item's turning handle is: at the end of its arrow from its anchor */
  function turnHandle(/** @type {any} */ it) {
    const k = angleKey(it); if (!k) return null;
    const o = k === "view" ? it.view.at : it.at, a = angleOf(it) * Math.PI / 180, r = 46 / Math.max(zoom.k, 0.4);
    return { o, p: [o[0] + Math.cos(a) * r, o[1] + Math.sin(a) * r] };
  }
  /** a free id: base, else base_2, base_3 ... @param {string} base */
  const freeId = (base) => { if (!items().some((i) => i.id === base)) return base; let n = 2; while (items().some((i) => i.id === `${base}_${n}`)) n++; return `${base}_${n}`; };
  /** a new item of a kind, in the middle of the view, on this level */
  function addNew(/** @type {string} */ kind) {
    const r = box.getBoundingClientRect(), cx = round((r.width / 2 - zoom.x) / zoom.k), cy = round((r.height / 2 - zoom.y) / zoom.k);
    let n = 1; while (items().some((i) => i.id === `${kind}_${n}`)) n++;
    const id = `${kind}_${n}`, base = { id, kind, name: { street: "Straße", building: "Haus", place: "Ort", room: "Raum", cam: `CAM ${n}`, view: "Blick", note: "Notiz", free: "frei", water: "Wasser" }[kind] ?? kind, ...(level !== "strasse" ? { level } : {}) };
    /** @type {any} */
    const it = kind === "cam" || kind === "view" ? { ...base, at: [cx, cy], dir: 0, status: "idee" }
      : kind === "note" ? { ...base, name: "Offen", at: [cx, cy], note: "…" }
      : kind === "place" ? { ...base, at: [cx, cy], status: "idee" }
      : kind === "free" || kind === "water" ? { ...base, rect: [cx - 60, cy - 40, 120, 80] }
      : { ...base, rect: [cx - 50, cy - 30, 100, 60], status: "idee" };
    change(() => { plan.items.push(it); pick(id); });
  }
  /** the picked doubled, a little aside; the copies are picked then */
  function duplicate() {
    const list = chosen(); if (!list.length) return;
    change(() => {
      const ids = [];
      for (const it of list) { const copy = JSON.parse(JSON.stringify(it)); copy.id = freeId(it.id); moveBy(copy, 20, 20); plan.items.push(copy); ids.push(copy.id); }
      many.clear(); for (const id of ids) many.add(id); sel = ids.at(-1) ?? "";
    });
  }
  function deleteSel() {
    const list = chosen(); if (!list.length) return;
    change(() => { plan.items = plan.items.filter((/** @type {any} */ i) => !list.includes(i)); pickNone(); });
  }

  // ---------------------------------------------------------------- the view
  const canvas = /** @type {HTMLCanvasElement} */ (el("canvas", { style: { width: "100%", height: "100%", display: "block", cursor: "default" } }));
  const box = el("div", { style: { width: "100%", height: "100%", background: "#0b0e18", position: "relative" } }, [canvas]);
  /** the plan's point under a canvas point (CSS px) @param {number} cx @param {number} cy */
  const toPlan = (cx, cy) => [(cx - zoom.x) / zoom.k, (cy - zoom.y) / zoom.k];
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
    // the picked ones: their outlines; the one the inspector shows its handles too
    for (const it of chosen()) {
      ctx.strokeStyle = SEL; ctx.lineWidth = (it.id === sel ? 2.5 : 1.8) * lw; ctx.setLineDash([6 * lw, 4 * lw]);
      const pts = PD.points(it, plan.scale);
      if (pts) { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.stroke(); }
      else if (it.at) { ctx.beginPath(); ctx.arc(it.at[0], it.at[1], 12, 0, Math.PI * 2); ctx.stroke(); }
      ctx.setLineDash([]);
    }
    const bx = pickedBox();
    if (bx) { ctx.fillStyle = "rgba(255,225,74,0.05)"; ctx.fillRect(bx[0], bx[1], bx[2] - bx[0], bx[3] - bx[1]); ctx.strokeStyle = SEL; ctx.lineWidth = lw; ctx.setLineDash([2 * lw, 4 * lw]); ctx.strokeRect(bx[0], bx[1], bx[2] - bx[0], bx[3] - bx[1]); ctx.setLineDash([]); }
    const it = picked();
    if (it && many.size === 1) {
      ctx.fillStyle = SEL;
      if (it.rect && !it.iso && !it.topdown) { const [x, y, w, h] = it.rect; ctx.fillRect(x + w - hs, y + h - hs, hs * 2, hs * 2); }
      if (it.poly) for (let i = 0; i < it.poly.length; i += 2) ctx.fillRect(it.poly[i] - hs, it.poly[i + 1] - hs, hs * 2, hs * 2);
      const t = turnHandle(it);
      if (t) { ctx.strokeStyle = SEL; ctx.lineWidth = 1.5 * lw; ctx.beginPath(); ctx.moveTo(t.o[0], t.o[1]); ctx.lineTo(t.p[0], t.p[1]); ctx.stroke(); ctx.beginPath(); ctx.arc(t.p[0], t.p[1], hs * 1.2, 0, Math.PI * 2); ctx.fill(); }
    }
    // the frame being dragged
    if (press?.frame && press.moved) {
      const [x0, y0] = press.frame, [x1, y1] = press.to;
      ctx.fillStyle = "rgba(255,225,74,0.08)"; ctx.fillRect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
      ctx.strokeStyle = SEL; ctx.lineWidth = lw; ctx.setLineDash([4 * lw, 3 * lw]); ctx.strokeRect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0)); ctx.setLineDash([]);
    }
  }

  /** what a press at a plan point grabs: a handle of the picked one first (when it is the only one), then an item @param {number} x @param {number} y */
  function grab(x, y) {
    const it = picked(), near = (/** @type {number[]} */ p) => Math.hypot(p[0] - x, p[1] - y) < 9 / zoom.k;
    if (it && many.size === 1) {
      const t = turnHandle(it); if (t && near(t.p)) return { what: "turn", it };
      if (it.rect && !it.iso && !it.topdown && near([it.rect[0] + it.rect[2], it.rect[1] + it.rect[3]])) return { what: "size", it };
      if (it.poly) for (let i = 0; i < it.poly.length; i += 2) if (near([it.poly[i], it.poly[i + 1]])) return { what: "point", it, i };
    }
    const hit = PD.itemAt(plan, level, x, y);
    // in the box round several picked: a picked one, or the ground (or the water) between them, moves them all
    const bx = pickedBox(), inBox = bx && x >= bx[0] && x <= bx[2] && y >= bx[1] && y <= bx[3];
    if (inBox && (!hit || many.has(hit.id) || hit.kind === "water")) return { what: "move", it: many.has(hit?.id) ? hit : picked() ?? chosen()[0], group: true };
    return hit ? { what: "move", it: hit } : null;
  }
  /** the box round everything picked (several of them), a little out from them: drag anywhere in it to move them all */
  function pickedBox() {
    if (many.size < 2) return null;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const it of chosen()) {
      const pts = PD.points(it, plan.scale) ?? (it.at ? [[it.at[0] - 12, it.at[1] - 12], [it.at[0] + 12, it.at[1] + 12]] : []);
      for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    }
    const m = 8 / zoom.k;
    return isFinite(x0) ? [x0 - m, y0 - m, x1 + m, y1 + m] : null;
  }
  /** everything on this level whose middle lies in a frame (not the water) @param {number[]} a @param {number[]} b */
  function inFrame(a, b) {
    const [x0, x1] = [Math.min(a[0], b[0]), Math.max(a[0], b[0])], [y0, y1] = [Math.min(a[1], b[1]), Math.max(a[1], b[1])];
    return items().filter((i) => onLevel(i) && i.kind !== "water").filter((i) => { const c = PD.centre(i, plan.scale); return c && c[0] >= x0 && c[0] <= x1 && c[1] >= y0 && c[1] <= y1; });
  }
  canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  canvas.addEventListener("pointerdown", (/** @type {PointerEvent} */ e) => {
    if (!PD || !plan) return;
    const r = canvas.getBoundingClientRect(), [x, y] = toPlan(e.clientX - r.left, e.clientY - r.top);
    canvas.setPointerCapture(e.pointerId);
    // the view: the right or middle button, or Space held
    if (e.button !== 0 || space) { press = { pan: true, x0: e.clientX, y0: e.clientY, zx: zoom.x, zy: zoom.y, moved: false }; canvas.style.cursor = "grabbing"; return; }
    const g = grab(x, y);
    // Alt on a shape: a point taken out, or one put into the edge under the pointer
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
    // Ctrl+click: one in or out of the picked
    if (g && !g.group && (e.ctrlKey || e.metaKey)) { pick(g.it.id, "toggle"); E.refresh(); draw(); return; }
    if (g?.group && (e.ctrlKey || e.metaKey || e.shiftKey)) { const hit = PD.itemAt(plan, level, x, y); if (hit && hit.kind !== "water") { pick(hit.id, e.shiftKey ? "add" : "toggle"); E.refresh(); draw(); return; } }
    if (!g) { press = { frame: [x, y], to: [x, y], add: e.shiftKey, x0: e.clientX, y0: e.clientY, moved: false }; return; }
    // the water is picked by a click, moved only with Shift (it is under everything)
    if (g.it.kind === "water" && g.what === "move" && !g.group && !e.shiftKey && !many.has(g.it.id)) { pick(g.it.id); E.refresh(); draw(); return; }
    if (g.what === "move" && !g.group && !many.has(g.it.id)) pick(g.it.id, e.shiftKey ? "add" : "only");
    else if (g.what === "move" && !g.group) sel = g.it.id;
    E.refresh();
    press = { g, x0: e.clientX, y0: e.clientY, px: x, py: y, moved: false, before: JSON.stringify(plan) };
    draw();
  });
  canvas.addEventListener("pointermove", (/** @type {PointerEvent} */ e) => {
    const r = canvas.getBoundingClientRect(), [x, y] = toPlan(e.clientX - r.left, e.clientY - r.top);
    if (!press) { const g = PD && plan && !space ? grab(x, y) : null; canvas.style.cursor = space ? "grab" : !g ? "crosshair" : g.what === "move" ? "move" : "pointer"; return; }
    if (Math.abs(e.clientX - press.x0) + Math.abs(e.clientY - press.y0) > 3) press.moved = true;
    if (!press.moved) return;
    if (press.pan) { zoom.x = press.zx + e.clientX - press.x0; zoom.y = press.zy + e.clientY - press.y0; draw(); return; }
    if (press.frame) { press.to = [x, y]; draw(); return; }
    const g = press.g, it = g.it;
    if (g.what === "move") { for (const c of chosen()) if (c.kind !== "water" || e.shiftKey || many.size === 1) moveBy(c, x - press.px, y - press.py); press.px = x; press.py = y; }
    else if (g.what === "size") it.rect = [it.rect[0], it.rect[1], Math.max(8, round(x - it.rect[0])), Math.max(8, round(y - it.rect[1]))];
    else if (g.what === "point") { it.poly[g.i] = round(x); it.poly[g.i + 1] = round(y); }
    else if (g.what === "turn") { const t = turnHandle(it), a = Math.atan2(y - t.o[1], x - t.o[0]) * 180 / Math.PI; setAngle(it, e.shiftKey ? a : Math.round(a / 15) * 15); }
    draw();
  });
  canvas.addEventListener("pointerup", () => {
    if (!press) return;
    if (press.frame) {
      if (press.moved) {
        const hit = inFrame(press.frame, press.to);
        if (!press.add) many.clear();
        for (const it of hit) many.add(it.id);
        sel = hit.at(-1)?.id ?? (press.add ? sel : "");
        E.setStatus(`${many.size} picked`);
      } else if (!press.add) pickNone();
      E.refresh();
    } else if (press.g && press.moved) { undoStack.push(press.before); redoStack = []; E.refresh(); }
    press = null; canvas.style.cursor = space ? "grab" : "default"; draw();
  });
  canvas.addEventListener("dblclick", (/** @type {MouseEvent} */ e) => {
    const r = canvas.getBoundingClientRect(), [x, y] = toPlan(e.clientX - r.left, e.clientY - r.top), hit = PD?.itemAt(plan, level, x, y);
    const room = String(hit?.room ?? "").split(",")[0];
    if (room && Cutaway.room.ids().includes(room)) { E.openRoom(room); E.show("room"); } else fit();
  });
  canvas.addEventListener("wheel", (/** @type {WheelEvent} */ e) => {
    e.preventDefault(); e.stopPropagation();
    const r = canvas.getBoundingClientRect(), mx = e.clientX - r.left, my = e.clientY - r.top, f = Math.exp(-e.deltaY * 0.0015);
    zoom.x = mx - (mx - zoom.x) * f; zoom.y = my - (my - zoom.y) * f; zoom.k *= f; draw();
  }, { passive: false });
  // Space held: the left button drags the view
  window.addEventListener("keydown", (e) => { if (e.code === "Space" && box.isConnected && !/INPUT|TEXTAREA|SELECT/.test(/** @type {any} */ (e.target)?.tagName ?? "")) { if (!space) { space = true; canvas.style.cursor = "grab"; } e.preventDefault(); } }, true);
  window.addEventListener("keyup", (e) => { if (e.code === "Space" && space) { space = false; canvas.style.cursor = "default"; } }, true);
  new ResizeObserver(() => draw()).observe(box);
  const view = { el: box, shown() { boot(); if (PD && plan) { remake(); requestAnimationFrame(() => (fitted ? draw() : fit())); } }, selectNone() { pickNone(); E.refresh(); draw(); } };

  /** @param {KeyboardEvent} e */
  function key(e) {
    if (!plan) return false;
    if ((e.ctrlKey || e.metaKey) && E.letter(e) === "d") { duplicate(); return true; }
    if ((e.ctrlKey || e.metaKey) && E.letter(e) === "a") { many.clear(); for (const i of items().filter((x) => onLevel(x) && x.kind !== "water")) many.add(i.id); sel = [...many].at(-1) ?? ""; E.setStatus(`${many.size} picked`); E.refresh(); draw(); return true; }
    // (Ctrl+Z and Ctrl+Y: the editor hands them to the tab's undo and redo)
    if (e.ctrlKey || e.metaKey || e.altKey) return false;
    if (e.key === "Escape" && many.size) { pickNone(); E.refresh(); draw(); return true; }
    const list = chosen();
    if (list.length && (e.key === "[" || e.key === "]")) { change(() => { for (const it of list) setAngle(it, angleOf(it) + (e.key === "]" ? 1 : -1) * (e.shiftKey ? 90 : 15)); }); return true; }
    const d = /** @type {Record<string, number[]>} */ ({ ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] })[e.key];
    if (list.length && d) { const k = e.shiftKey ? 10 : 1; change(() => { for (const it of list) moveBy(it, d[0] * k, d[1] * k); }); return true; }
    return false;
  }

  // ---------------------------------------------------------------- saving
  /** the file's root object node in a text @param {string} text */
  const rootOf = (text) => { const i = text.indexOf("var STADTPLAN"); return i < 0 ? null : L.value(text, text.indexOf("=", i) + 1); };
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
      const ind = "    ", body = Object.entries(plan.accept ?? {}).map(([k, v]) => `${ind}${JSON.stringify(k)}: ${JSON.stringify(v)},`).join("\n");
      text = L.put(text, acc, body ? `{\n${body}\n  }` : "{}");
    }
    return text;
  }
  async function save() {
    if (!plan) return;
    try {
      const text = textNow();
      E.files.set(PATH, text);
      E.setStatus(await E.files.save(PATH) ? `saved ${PATH}` : `${PATH}: nothing to save`);
      saved = JSON.stringify(plan);
    } catch (e) { E.setStatus(`${PATH}: not saved: ${/** @type {any} */ (e).message}`); }
    E.refresh();
  }
  // the file changed on the disk (or another tab): read again, if nothing here is unsaved
  E.files.on((path, why) => { if (path === PATH && why === "reload" && JSON.stringify(plan) === saved) load().then(() => { E.refresh(); draw(); }); });

  // ---------------------------------------------------------------- the inspector
  const row = (/** @type {string} */ label, /** @type {Node} */ input) => el("div", { style: { display: "flex", gap: "6px", alignItems: "center", margin: "3px 0" } }, [el("span", { className: "cw-dim", style: { width: "64px", flex: "none" } }, [label]), input]);
  /** a text field of the picked item; empty takes the key out @param {any} it @param {string} k @param {boolean} [num] */
  function textField(it, k, num = false) {
    return el("input", { value: it[k] ?? "", style: { flex: "1", minWidth: "0" },
      onchange: (/** @type {any} */ e) => change(() => { const v = e.target.value.trim(); if (k === "id") { if (v && v !== it.id && !items().some((i) => i.id === v)) { many.delete(it.id); many.add(v); if (sel === it.id) sel = v; it.id = v; } return; } if (v === "") delete it[k]; else it[k] = num ? Number(v) : v; }) });
  }
  /** a choice for the picked (or, given a list, for all of them) @param {any[]} list @param {string} k @param {string[]} opts @param {string} none */
  function choice(list, k, opts, none) {
    const same = list.every((i) => (i[k] ?? "") === (list[0][k] ?? ""));
    return el("select", { style: { flex: "1" }, onchange: (/** @type {any} */ e) => change(() => { for (const it of list) { if (e.target.value === "") delete it[k]; else it[k] = e.target.value; } }) },
      [...(same ? [] : [el("option", { value: "", selected: true, disabled: true }, ["(mixed)"])]), el("option", { value: "" }, [none]), ...opts.map((o) => el("option", { value: o, selected: same && (list[0][k] ?? "") === o }, [o]))]);
  }

  function build(/** @type {HTMLElement} */ panel) {
    if (!E.studio.available) { panel.append(el("div", { className: "cw-sec cw-dim" }, ["The Plan tab needs the studio: node lib/cutaway/tools/studio.mjs"])); return; }
    if (!plan) { panel.append(el("div", { className: "cw-sec cw-dim" }, [broken ? `plan: ${broken}` : "loading …"])); boot(); return; }
    const dirty = JSON.stringify(plan) !== saved;
    panel.append(el("div", { className: "cw-sec" }, [
      el("div", { style: { fontWeight: "bold" } }, [`${PATH}${dirty ? "  ●" : ""}`]),
      el("div", { style: { margin: "4px 0" } }, [button("Save", save, "write the plan back (only what changed)"), button("Fit", fit, "the whole plan in view (or a double click on the ground)"),
        button("Ways again", () => { remake(); draw(); E.refresh(); }, "read the ways between the rooms from the game again"),
        button("Pictures", () => E.runTask("plan: pictures"), "write docs/plan/stadtplan_<level>.png (the task in studio.json)")])]));
    // the levels
    panel.append(el("div", { className: "cw-sec" }, [el("div", { className: "cw-dim" }, ["Level"]),
      el("div", {}, plan.levels.map((/** @type {any} */ l) => el("button", { onclick: () => { level = l.id; for (const it of chosen()) if (!onLevel(it)) many.delete(it.id); prune(); E.refresh(); draw(); },
        style: l.id === level ? { background: "#3a2f55", borderColor: SEL, color: SEL } : {} }, [l.name])))]));
    // new
    const kindSel = /** @type {HTMLSelectElement} */ (el("select", {}, KINDS.map((k) => el("option", { value: k }, [k]))));
    panel.append(el("div", { className: "cw-sec" }, [el("div", { className: "cw-dim" }, ["New on this level, in the middle of the view"]),
      el("div", { style: { display: "flex", gap: "4px" } }, [kindSel, button("Add", () => addNew(kindSel.value), "a new item of that kind")])]));
    // the picked
    const list = chosen(), it = picked();
    if (list.length > 1) {
      panel.append(el("div", { className: "cw-sec" }, [
        el("div", { style: { fontWeight: "bold", color: SEL } }, [`${list.length} picked`]),
        el("div", { className: "cw-dim", style: { margin: "2px 0 4px" } }, ["Drag one of them, or anywhere in the box round them, or the arrows: they all go. Ctrl+click takes one in or out, Esc none."]),
        row("level", choice(list, "level", plan.levels.map((/** @type {any} */ l) => l.id), "strasse")),
        row("status", choice(list, "status", STATUSES, "—")),
        el("div", { style: { maxHeight: "160px", overflow: "auto", margin: "4px 0" } }, list.map((i) => el("div", { style: { cursor: "pointer", color: i.id === sel ? SEL : "" }, onclick: () => { sel = i.id; E.refresh(); draw(); } }, [`${i.name ?? i.id}  `, el("span", { className: "cw-dim" }, [i.kind])]))),
        el("div", {}, [button("Double", duplicate, "Ctrl+D"), button("Delete", deleteSel, "Del"), button("Only this one", () => { if (sel) pick(sel); E.refresh(); draw(); }, "keep only the one in yellow")])]));
    } else if (it) {
      const fields = [
        row("id", textField(it, "id")), row("name", textField(it, "name")),
        row("kind", choice([it], "kind", KINDS, "—")), row("level", choice([it], "level", plan.levels.map((/** @type {any} */ l) => l.id), "strasse")),
        row("status", choice([it], "status", STATUSES, "—")), row("room", textField(it, "room")), row("chapter", textField(it, "chapter", true)),
      ];
      if (it.iso !== undefined) fields.push(row("iso map", choice([it], "iso", Object.keys(lib.ISO_MAPS).sort(), "—")));
      if (angleKey(it)) fields.push(row(angleKey(it) === "view" ? "camera" : angleKey(it), el("input", { type: "number", step: 15, value: angleOf(it), style: { width: "70px" },
        onchange: (/** @type {any} */ e) => change(() => setAngle(it, Number(e.target.value))) })));
      if (it.kind === "room") fields.push(row("outdoor", el("input", { type: "checkbox", checked: !!it.outdoor, onchange: (/** @type {any} */ e) => change(() => { if (e.target.checked) it.outdoor = true; else delete it.outdoor; }) })));
      fields.push(el("div", { className: "cw-dim", style: { marginTop: "4px" } }, ["note"]),
        el("textarea", { value: it.note ?? "", rows: 5, style: { width: "100%", boxSizing: "border-box" }, onchange: (/** @type {any} */ e) => change(() => { const v = e.target.value.trim(); if (v) it.note = v; else delete it.note; }) }));
      if (it.label) fields.push(el("div", {}, [button("Name in the middle", () => change(() => { delete it.label; }), "the name back in the middle of its shape")]));
      fields.push(el("div", { style: { marginTop: "4px" } }, [button("Double", duplicate, "Ctrl+D"), button("Delete", deleteSel, "Del")]));
      panel.append(el("div", { className: "cw-sec" }, [el("div", { style: { fontWeight: "bold", color: SEL } }, [it.name ?? it.id]), ...fields]));
    } else panel.append(el("div", { className: "cw-sec cw-dim" }, ["Click a place to pick it, or drag a frame on the ground round several; drag them, a corner or a shape's points; [ and ] turn. The right button (or Space) moves the view. A double click opens a room."]));
    // what doesn't fit
    const probs = PD ? PD.problems(plan) : [];
    panel.append(el("div", { className: "cw-sec" }, [E.fold("plan.problems", "doesn't fit", () => probs.length ? probs.map((/** @type {any} */ p) => {
      const way = /** @type {any} */ (PD.ways(plan)).find((/** @type {any} */ w) => p.pair && [w.from, w.to].sort().join("/") === p.pair && w.d > 3);
      return el("div", { style: { margin: "3px 0" } }, [
        el("span", { style: { cursor: p.at ? "pointer" : "default", color: p.level === level ? "#ff8a8a" : "" }, title: "show it",
          onclick: () => { if (!p.at) return; if (p.level) level = p.level; const r = box.getBoundingClientRect(); zoom.x = r.width / 2 - p.at[0] * zoom.k; zoom.y = r.height / 2 - p.at[1] * zoom.k; E.refresh(); draw(); } }, [`${p.n}. ${p.text}`]),
        ...(way ? [" ", button("on purpose", () => {
          const why = prompt(`Why do ${way.from}/${way.hotspot} and where Juno arrives lie apart? (a passage, a flight of stairs)`, "");
          if (why) change(() => { plan.accept = { ...(plan.accept ?? {}), [`${way.from}/${way.hotspot}`]: why }; });
        }, "these ends lie apart on purpose: drawn dashed, not counted (the plan's accept list)")] : [])]);
    }) : [el("div", { className: "cw-dim" }, ["everything fits"])], { note: String(probs.length) })]));
  }

  /** the left panel: everything on this level by kind */
  function browse(/** @type {HTMLElement} */ boxEl) {
    if (!plan) return;
    const list = items().filter(onLevel).map((i) => ({ key: i.id, label: `${many.has(i.id) && many.size > 1 ? "● " : ""}${i.name ?? i.id}${i.room ? `  · ${i.room}` : ""}`, group: i.kind }));
    boxEl.append(E.fold("left.plan", `PLAN · ${(plan.levels.find((/** @type {any} */ l) => l.id === level)?.name ?? level).toUpperCase()}`, () => [E.list({ id: "plan.items", items: list, filter: list.length > 15, foldOver: 12, selected: sel || undefined,
      pick: (/** @type {string} */ k) => { pick(k); const it = picked(), c = it && PD.centre(it, plan.scale), r = box.getBoundingClientRect(); if (c) { zoom.x = r.width / 2 - c[0] * zoom.k; zoom.y = r.height / 2 - c[1] * zoom.k; } E.refresh(); draw(); } })], { note: String(list.length) }));
  }

  E.tab({ id: "plan", label: "Plan", build, browse, view: () => view, key, save: () => save(), del: () => deleteSel(),
    undo: () => step(undoStack, redoStack), redo: () => step(redoStack, undoStack),
    selectNone: () => { pickNone(); E.refresh(); draw(); },
    get unsaved() { return plan && JSON.stringify(plan) !== saved ? 1 : 0; } });
  E.modules.plan = { get plan() { return plan; }, get picked() { return [...many]; }, get level() { return level; }, set level(v) { level = v; E.refresh(); draw(); },
    select(/** @type {string} */ id) { pick(id); E.refresh(); draw(); }, save, textNow, boot, fit };
})();

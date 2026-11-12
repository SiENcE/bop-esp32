// Draws the city's plan (docs/plan/stadtplan.js, its format described there) onto a canvas, one level at a time with the street
// faint under the others: the water, the streets, the buildings, the rooms with their walls, doors and cameras, the feeds' cameras,
// the ways between the doors as arrows (green where a door and the one it leads to meet, amber or red where they don't, dashed
// where they lie apart on purpose, ↑ and ↓ to another level), and what doesn't fit, listed and numbered on the map. The plan is
// its own: this reads nothing of the game or its maps. Used by docs/plan/index.html and by the studio's Plan tab (game/editor/plan.js).
"use strict";

var PlanDraw = (function () {
  const STATUS = {
    gemalt: { color: "#7fe0a0", label: "gemalt, im Spiel" },
    block: { color: "#eea040", label: "im Spiel, auf Blöcken" },
    geplant: { color: "#8fa0c8", label: "geplant (Docs), nicht gebaut" },
    vorschlag: { color: "#ff4fd3", label: "Vorschlag: Lage nicht entschieden" },
    idee: { color: "#b0a0d8", label: "Idee" },
  };
  const C = { bg: "#0b0e18", grid: "#141a2a", water: "#0e2a3c", waterEdge: "#1f5e74", street: "#262c42", building: "#1c1f33", room: "#232a44",
    text: "#dfe6f0", dim: "#8a96b0", free: "#4a5470", note: "#ffd58a", cyan: "#62def0", view: "#ffd58a", door: "#ffffff",
    ok: "#7fe0a0", near: "#eea040", bad: "#ff5a5a" };
  const FONT = "Segoe UI, Arial, sans-serif";

  // ---------------------------------------------------------------- geometry
  const levelOf = (it) => it.level ?? "strasse";
  function points(it) {
    if (it.poly) { const p = []; for (let i = 0; i < it.poly.length; i += 2) p.push([it.poly[i], it.poly[i + 1]]); return p; }
    if (it.rect) { const [x, y, w, h] = it.rect; return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; }
    return null;
  }
  function centre(it) {
    const p = points(it);
    if (!p) return it.at ?? null;
    let x = 0, y = 0; for (const q of p) { x += q[0]; y += q[1]; } return [x / p.length, y / p.length];
  }
  const inPoly = (p, x, y) => { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) if ((p[i][1] > y) !== (p[j][1] > y) && x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0]) c = !c; return c; };
  /** a door "<id>/<door>" → [item, door, its name] @param {any} plan @param {string} ref */
  function doorOf(plan, ref) {
    const [id, k] = String(ref ?? "").split("/"), it = plan.items.find((i) => i.id === id);
    return it?.doors?.[k] ? [it, it.doors[k], k] : null;
  }

  /** the ways: every door that leads to another, with its two ends and how well they meet */
  function ways(plan) {
    const S = plan.scale, out = [];
    for (const A of plan.items) for (const [k, d] of Object.entries(A.doors ?? {})) {
      if (!d.to) continue;
      const t = doorOf(plan, d.to);
      if (!t) { out.push({ A, door: k, a: d.at, broken: d.to }); continue; }
      const [B, bd, bk] = t, dist = Math.hypot(d.at[0] - bd.at[0], d.at[1] - bd.at[1]) / S;
      out.push({ A, B, door: k, toDoor: bk, a: d.at, b: bd.at, d: dist, across: levelOf(A) !== levelOf(B), accepted: plan.accept?.[`${A.id}/${k}`] ?? null });
    }
    return out;
  }

  /** what doesn't fit, numbered */
  function problems(plan) {
    const S = plan.scale, list = [];
    for (const w of ways(plan)) {
      if (w.broken) { list.push({ text: `Die Tür ${w.A.name}/${w.door} führt zu ${w.broken}, die es nicht gibt.`, at: w.a, level: levelOf(w.A) }); continue; }
      if (w.d <= 3 || w.accepted) continue;
      const pair = [`${w.A.id}/${w.door}`, `${w.B.id}/${w.toDoor}`].sort().join("|");
      if (list.some((p) => p.pair === pair)) continue;
      list.push({ text: w.across ? `Übereinander passt nicht: ${w.A.name}/${w.door} und ${w.B.name}/${w.toDoor} liegen ${w.d.toFixed(1)} m auseinander.`
        : `${w.A.name}/${w.door} → ${w.B.name}/${w.toDoor}: die Türen liegen ${w.d.toFixed(1)} m auseinander.`, at: w.a, level: levelOf(w.A), pair, way: `${w.A.id}/${w.door}` });
    }
    // rooms on one level that lie in each other
    const rooms = plan.items.filter((i) => i.kind === "room" && points(i));
    for (let i = 0; i < rooms.length; i++) for (let j = i + 1; j < rooms.length; j++) {
      const A = rooms[i], B = rooms[j];
      if (levelOf(A) !== levelOf(B) || A.within === B.id || B.within === A.id) continue;
      const pa = points(A), pb = points(B), xs = pa.map((p) => p[0]), ys = pa.map((p) => p[1]);
      let n = 0, sx = 0, sy = 0;
      for (let x = Math.min(...xs); x <= Math.max(...xs); x += 2) for (let y = Math.min(...ys); y <= Math.max(...ys); y += 2)
        if (inPoly(pa, x, y) && inPoly(pb, x, y)) { n++; sx += x; sy += y; }
      const m2 = n * 4 / (S * S);
      if (m2 >= 1) list.push({ text: `${A.name} und ${B.name} liegen ineinander (${m2.toFixed(1)} m²).`, at: [sx / n, sy / n], level: levelOf(A) });
    }
    // a room up in a building must have a building under it, not the street
    const z = Object.fromEntries(plan.levels.map((l) => [l.id, l.z]));
    const ground = plan.items.filter((i) => (z[levelOf(i)] ?? 0) === 0 && ((i.kind === "room" && !i.outdoor) || i.kind === "building") && points(i));
    for (const A of rooms.filter((i) => (z[levelOf(i)] ?? 0) > 0 && !i.outdoor)) {
      const pa = points(A), xs = pa.map((p) => p[0]), ys = pa.map((p) => p[1]);
      let n = 0, out = 0, sx = 0, sy = 0;
      for (let x = Math.min(...xs); x <= Math.max(...xs); x += 3) for (let y = Math.min(...ys); y <= Math.max(...ys); y += 3) {
        if (!inPoly(pa, x, y)) continue;
        n++;
        if (!ground.some((g) => inPoly(points(g), x, y))) { out++; sx += x; sy += y; }
      }
      if (n && out / n > 0.2) list.push({ text: `${A.name} liegt zu ${Math.round(out / n * 100)} % über keinem Haus der Straße (über der Straße oder dem Nichts).`, at: [sx / out, sy / out], level: levelOf(A) });
    }
    list.forEach((p, i) => (p.n = i + 1));
    return list;
  }

  // ---------------------------------------------------------------- drawing
  function path(ctx, pts) { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); }
  function wrap(ctx, text, width) {
    const words = String(text).split(" "), lines = []; let line = "";
    for (const w of words) { const t = line ? line + " " + w : w; if (ctx.measureText(t).width > width && line) { lines.push(line); line = w; } else line = t; }
    if (line) lines.push(line);
    return lines;
  }
  function label(ctx, text, x, y, { size = 14, color = C.text, bold = false, align = "center", shadow = true } = {}) {
    ctx.font = `${bold ? "600 " : ""}${size}px ${FONT}`; ctx.textAlign = align; ctx.textBaseline = "middle";
    if (shadow) { ctx.lineWidth = 4; ctx.strokeStyle = "rgba(5,8,15,0.85)"; ctx.strokeText(text, x, y); }
    ctx.fillStyle = color; ctx.fillText(text, x, y);
  }
  function arrow(ctx, a, b, color, width = 2) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    if (L < 4) { ctx.beginPath(); ctx.arc(b[0], b[1], 3, 0, Math.PI * 2); ctx.fill(); return; }
    const ux = dx / L, uy = dy / L;
    ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.lineTo(b[0] - ux * 9 - uy * 4.5, b[1] - uy * 9 + ux * 4.5); ctx.lineTo(b[0] - ux * 9 + uy * 4.5, b[1] - uy * 9 - ux * 4.5); ctx.closePath(); ctx.fill();
  }
  function cone(ctx, x, y, dir, r, fill, stroke) {
    const a = dir * Math.PI / 180;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r, a - 0.42, a + 0.42); ctx.closePath();
    ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke();
  }
  /** a room's or a view's camera: a cone from where its picture is seen, or a ring for one from above */
  function camera(ctx, it) {
    const cam = it.camera ?? (it.kind === "view" ? { at: it.at, dir: it.dir ?? 0 } : null);
    if (!cam) return;
    if (cam.top) { const [x, y] = centre(it) ?? [0, 0]; ctx.strokeStyle = C.view; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y + 22, 9, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = C.view; ctx.beginPath(); ctx.arc(x, y + 22, 3, 0, Math.PI * 2); ctx.fill(); label(ctx, "von oben", x + 14, y + 22, { size: 10, color: C.view, align: "left" }); return; }
    if (!cam.at) return;
    cone(ctx, cam.at[0], cam.at[1], cam.dir ?? 0, 34, "rgba(255,213,138,0.14)", "rgba(255,213,138,0.6)");
    ctx.fillStyle = C.view; ctx.beginPath(); ctx.arc(cam.at[0], cam.at[1], 4, 0, Math.PI * 2); ctx.fill();
    if (it.kind === "view") label(ctx, it.name, cam.at[0] + 8, cam.at[1] + 12, { size: 11, color: C.view, align: "left" });
  }

  function drawLevel(ctx, plan, level, full) {
    const items = plan.items.filter((i) => levelOf(i) === level && i.kind !== "water");
    const st = (it) => STATUS[it.status] ?? { color: C.dim };
    ctx.globalAlpha = full ? 1 : 0.22;
    for (const it of items.filter((i) => i.kind === "free" && points(i))) {
      if (!full) continue;
      path(ctx, points(it)); ctx.setLineDash([6, 6]); ctx.strokeStyle = C.free; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
      const [x, y] = centre(it); label(ctx, "frei", x, y, { size: 16, color: C.free, shadow: false });
    }
    for (const it of items.filter((i) => ["street", "building", "place", "room"].includes(i.kind) && points(i))) {
      path(ctx, points(it));
      ctx.fillStyle = it.kind === "street" ? C.street : it.kind === "building" ? C.building : it.kind === "room" ? C.room : "rgba(40,30,60,0.6)"; ctx.fill();
      ctx.strokeStyle = st(it).color;
      if (it.walls?.length) { ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]); }
      else { ctx.lineWidth = it.kind === "room" ? 3 : 2; ctx.stroke(); }
      for (const w of it.walls ?? []) { ctx.strokeStyle = st(it).color; ctx.lineWidth = w.stub ? 2 : 4; ctx.beginPath(); ctx.moveTo(...w.from); ctx.lineTo(...w.to); ctx.stroke(); }
    }
    ctx.globalAlpha = 1;
    if (!full) return;
    for (const it of items) camera(ctx, it);
    // names
    for (const it of items.filter((i) => ["street", "building", "place", "room"].includes(i.kind) && points(i))) {
      const [x, y] = it.label ?? centre(it), vertical = it.rect && it.rect[3] > it.rect[2] * 1.6 && it.kind !== "building";
      ctx.save(); ctx.translate(x, y); if (vertical) ctx.rotate(-Math.PI / 2);
      label(ctx, it.name, 0, 0, { size: it.kind === "room" ? 14 : 13, bold: it.kind !== "place" });
      if (it.room) label(ctx, it.room.split(",")[0], 0, 14, { size: 10, color: C.dim });
      ctx.restore();
    }
    for (const it of items.filter((i) => (i.kind === "place" || i.kind === "building") && i.at && !points(i))) {
      const [x, y] = it.at; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fillStyle = st(it).color; ctx.fill();
      label(ctx, it.name, x + 10, y, { size: 12, align: "left" });
    }
    // the doors: small squares, their names above them
    for (const it of items) for (const [k, d] of Object.entries(it.doors ?? {})) {
      ctx.fillStyle = C.door; ctx.fillRect(d.at[0] - 3, d.at[1] - 3, 6, 6); ctx.strokeStyle = "#06080f"; ctx.lineWidth = 1; ctx.strokeRect(d.at[0] - 3, d.at[1] - 3, 6, 6);
      label(ctx, k, d.at[0], d.at[1] - 9, { size: 9, color: "#c8d4e8" });
    }
    for (const it of items.filter((i) => i.kind === "cam")) {
      const [x, y] = it.at;
      cone(ctx, x, y, it.dir ?? 0, 38, "rgba(98,222,240,0.16)", "rgba(98,222,240,0.5)");
      ctx.fillStyle = C.cyan; ctx.fillRect(x - 4, y - 4, 8, 8); ctx.strokeStyle = st(it).color; ctx.lineWidth = 2; ctx.strokeRect(x - 5, y - 5, 10, 10);
      label(ctx, it.name, x, y - 14, { size: 12, bold: true, color: C.cyan });
    }
  }

  function drawWays(ctx, plan, level) {
    const names = Object.fromEntries(plan.levels.map((l) => [l.id, l.name])), z = Object.fromEntries(plan.levels.map((l) => [l.id, l.z]));
    for (const w of ways(plan)) {
      if (w.broken) continue;
      if (levelOf(w.A) !== level && levelOf(w.B) !== level) continue;
      const color = w.accepted ? C.dim : w.d <= 1.5 ? C.ok : w.d <= 3 ? C.near : C.bad;
      if (!w.across) { if (levelOf(w.A) === level) { ctx.setLineDash(w.accepted ? [5, 4] : []); arrow(ctx, w.a, w.b, color, 2); ctx.setLineDash([]); } continue; }
      // to another level: a mark where it leaves on this one
      const here = levelOf(w.A) === level ? w.a : w.b, other = levelOf(w.A) === level ? w.B : w.A, up = z[levelOf(other)] > z[level];
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(here[0], here[1], 7, 0, Math.PI * 2); ctx.fill();
      label(ctx, up ? "↑" : "↓", here[0], here[1], { size: 12, bold: true, color: "#0b0e18", shadow: false });
      if (levelOf(w.A) === level) label(ctx, `${w.door} ${up ? "↑" : "↓"} ${names[levelOf(other)]}`, here[0] + 11, here[1] + 1, { size: 10, color, align: "left" });
    }
  }

  function drawMap(ctx, plan, level) {
    const [W, H] = plan.size;
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 100) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 100) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    for (const it of plan.items.filter((i) => i.kind === "water" && points(i))) {
      ctx.globalAlpha = level === "strasse" ? 1 : 0.45;
      path(ctx, points(it)); ctx.fillStyle = C.water; ctx.fill(); ctx.strokeStyle = C.waterEdge; ctx.lineWidth = 2; ctx.stroke();
      ctx.globalAlpha = 1;
      if (level === "strasse") { const [x, y] = it.label ?? centre(it); label(ctx, it.name, x, y, { size: 18, color: "#4fa8c8", bold: true }); }
    }
    if (level !== "strasse") drawLevel(ctx, plan, "strasse", false);
    drawLevel(ctx, plan, level, true);
    drawWays(ctx, plan, level);
    for (const p of problems(plan)) {
      if (!p.at || p.level !== level) continue;
      ctx.fillStyle = C.bad; ctx.beginPath(); ctx.arc(p.at[0] - 12, p.at[1] - 12, 9, 0, Math.PI * 2); ctx.fill();
      label(ctx, String(p.n), p.at[0] - 12, p.at[1] - 12, { size: 11, bold: true, color: "#fff", shadow: false });
    }
    for (const it of plan.items.filter((i) => i.kind === "note" && levelOf(i) === level)) {
      const [x, y] = it.at; ctx.font = `13px ${FONT}`;
      const lines = wrap(ctx, it.note, 520), h = 20 + lines.length * 17;
      ctx.fillStyle = "rgba(40,32,12,0.92)"; ctx.fillRect(x, y - 14, 540, h); ctx.strokeStyle = C.note; ctx.lineWidth = 1.5; ctx.strokeRect(x, y - 14, 540, h);
      label(ctx, it.name + ":", x + 10, y, { size: 13, bold: true, color: C.note, align: "left", shadow: false });
      lines.forEach((l, i) => label(ctx, l, x + 10, y + 17 * (i + 1), { size: 13, color: "#f0e0c0", align: "left", shadow: false }));
    }
    label(ctx, "N ↑", W - 30, 24, { size: 16, bold: true, color: C.dim });
  }

  const SIDE = 400;
  function drawSide(ctx, plan, level, x0, H) {
    ctx.fillStyle = "#10142a"; ctx.fillRect(x0, 0, SIDE, H);
    const L = plan.levels.find((l) => l.id === level), X = x0 + 20;
    let y = 30;
    label(ctx, plan.title, X, y, { size: 20, bold: true, align: "left" }); y += 30;
    label(ctx, "Ebene: " + L.name, X, y, { size: 18, bold: true, color: C.cyan, align: "left" }); y += 20;
    label(ctx, L.note ?? "", X, y, { size: 12, color: C.dim, align: "left" }); y += 18;
    label(ctx, "Räume ungefähr in Metern, alles dazwischen nicht maßstäblich", X, y, { size: 12, color: C.dim, align: "left" }); y += 26;
    for (const l of plan.levels) {
      const here = l.id === level;
      ctx.fillStyle = here ? "#2a3550" : "#181d33"; ctx.fillRect(X, y - 10, 160, 20);
      if (here) { ctx.strokeStyle = C.cyan; ctx.lineWidth = 2; ctx.strokeRect(X, y - 10, 160, 20); }
      label(ctx, l.name, X + 8, y, { size: 12, bold: here, align: "left", shadow: false }); y += 22;
    }
    y += 10;
    label(ctx, "Stand", X, y, { size: 14, bold: true, align: "left" }); y += 20;
    for (const s of Object.values(STATUS)) { ctx.strokeStyle = s.color; ctx.lineWidth = 3; ctx.strokeRect(X + 2, y - 6, 22, 12); label(ctx, s.label, X + 34, y, { size: 12, align: "left" }); y += 19; }
    y += 6; label(ctx, "Kameras, Türen und Wege", X, y, { size: 14, bold: true, align: "left" }); y += 22;
    cone(ctx, X + 6, y, 0, 22, "rgba(98,222,240,0.16)", "rgba(98,222,240,0.5)"); ctx.fillStyle = C.cyan; ctx.fillRect(X + 2, y - 4, 8, 8);
    label(ctx, "Kamera eines Feeds", X + 34, y, { size: 12, align: "left" }); y += 22;
    cone(ctx, X + 6, y, 0, 22, "rgba(255,213,138,0.14)", "rgba(255,213,138,0.6)"); ctx.fillStyle = C.view; ctx.beginPath(); ctx.arc(X + 6, y, 4, 0, Math.PI * 2); ctx.fill();
    label(ctx, "von wo das Bild eines Raums schaut", X + 34, y, { size: 12, align: "left" }); y += 22;
    ctx.fillStyle = C.door; ctx.fillRect(X + 9, y - 3, 6, 6); label(ctx, "Tür", X + 34, y, { size: 12, align: "left" }); y += 19;
    for (const [c, t, d] of [[C.ok, "zur Tür, zu der sie führt: sie treffen sich"], [C.near, "bis 3 m auseinander"], [C.bad, "weiter auseinander: passt nicht"], [C.dim, "mit Absicht weiter (Torweg, Treppe)", true]]) {
      ctx.setLineDash(d ? [5, 4] : []); arrow(ctx, [X, y], [X + 24, y], c, 2); ctx.setLineDash([]); label(ctx, t, X + 34, y, { size: 12, align: "left" }); y += 19;
    }
    ctx.fillStyle = C.ok; ctx.beginPath(); ctx.arc(X + 10, y, 7, 0, Math.PI * 2); ctx.fill(); label(ctx, "↑", X + 10, y, { size: 12, bold: true, color: "#0b0e18", shadow: false });
    label(ctx, "eine Tür in eine andere Ebene", X + 34, y, { size: 12, align: "left" }); y += 30;
    const probs = problems(plan);
    label(ctx, `Passt nicht zusammen (${probs.length})`, X, y, { size: 14, bold: true, color: C.bad, align: "left" }); y += 20;
    ctx.font = `12px ${FONT}`;
    for (const p of probs) {
      const lines = wrap(ctx, p.text, SIDE - 70), here = p.level === level;
      if (y + lines.length * 15 > H - 10) { label(ctx, "…", X, y, { size: 12, align: "left" }); break; }
      ctx.fillStyle = here ? C.bad : "#5a3040"; ctx.beginPath(); ctx.arc(X + 8, y, 8, 0, Math.PI * 2); ctx.fill();
      label(ctx, String(p.n), X + 8, y, { size: 10, bold: true, color: "#fff", shadow: false });
      lines.forEach((l, i) => label(ctx, l, X + 24, y + i * 15, { size: 12, color: here ? C.text : C.dim, align: "left", shadow: false }));
      y += lines.length * 15 + 6;
    }
  }

  /** The whole sheet of one level: the plan at `scale`, the side to its right. */
  function draw(canvas, plan, { level = "strasse", scale = 1 } = {}) {
    const [W, H] = plan.size;
    canvas.width = Math.round((W + SIDE) * scale); canvas.height = Math.round(H * scale);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    drawMap(ctx, plan, level);
    drawSide(ctx, plan, level, W, H);
  }

  /** the item under a plan point on a level (for a tooltip, or to pick) */
  function itemAt(plan, level, x, y) {
    const order = ["cam", "view", "note", "room", "place", "building", "street", "free", "water"];
    for (const k of order) for (const it of plan.items.filter((i) => i.kind === k && (levelOf(i) === level || i.kind === "water")).reverse()) {
      const p = points(it);
      if (!p) { if (it.at && Math.hypot(it.at[0] - x, it.at[1] - y) < 12) return it; continue; }
      if (inPoly(p, x, y)) return it;
    }
    return null;
  }

  return { draw, drawMap, itemAt, problems, ways, points, centre, levelOf, doorOf, STATUS, C };
})();

// Draws the city's plan (docs/plan/stadtplan.js, its format described there) onto a canvas, one level at a time with the others
// faint under it: the water, the streets, the buildings; the rooms Juno walks, the iso ones from their maps (art/rooms/<id>.map.js:
// floor, walls, openings, the stairs) with the camera their picture is seen from, the painted ones with theirs; the feeds' cameras
// with the way they look; the ways between the rooms (docs/plan/uebergaenge.js, from the game) as arrows from the hotspot to where
// Juno arrives, green where the two ends meet, amber or red where they don't; ways to another level as ↑ and ↓. What doesn't fit
// (ends apart, rooms overlapping, stairs not over each other, rooms missing from the plan) is listed and numbered on the map.
// Needs art/lib/isomap.js and the maps loaded (ISOMAP, ISO_MAPS). Used by docs/plan/index.html; the studio's plan tab will use it too.
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
    text: "#dfe6f0", dim: "#8a96b0", free: "#4a5470", note: "#ffd58a", cyan: "#62def0", view: "#ffd58a", open: "#ffffff",
    ok: "#7fe0a0", near: "#eea040", bad: "#ff5a5a", lift: "#62def0" };
  const FONT = "Segoe UI, Arial, sans-serif";
  const D2R = Math.PI / 180, e = (a) => [Math.cos(a * D2R), Math.sin(a * D2R)];

  // ---------------------------------------------------------------- geometry
  const levelOf = (it) => it.level ?? "strasse";
  const isoMap = (it) => (it.iso && typeof ISO_MAPS !== "undefined" ? ISO_MAPS[it.iso] : null);
  /** a room's own frame: meters (u along rot, v 90° on) to plan units */
  function frame(it, S) {
    const [ax, ay] = it.at, a = e(it.rot ?? 0), b = e((it.rot ?? 0) + 90);
    return (u, v) => [ax + S * (u * a[0] + v * b[0]), ay + S * (u * a[1] + v * b[1])];
  }
  function points(it, S) {
    const m = isoMap(it);
    if (m) { const P = frame(it, S), [U, V] = m.size; return [P(0, 0), P(U, 0), P(U, V), P(0, V)]; }
    if (it.topdown) { const P = frame(it, S), W = it.topdown.size[0] / it.topdown.ppm, H = it.topdown.size[1] / it.topdown.ppm; return [P(0, 0), P(W, 0), P(W, H), P(0, H)]; }
    if (it.poly) { const p = []; for (let i = 0; i < it.poly.length; i += 2) p.push([it.poly[i], it.poly[i + 1]]); return p; }
    if (it.rect) { const [x, y, w, h] = it.rect; return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; }
    return null;
  }
  function centre(it, S) {
    if (it.at && !isoMap(it) && !it.topdown) return it.at;
    const p = points(it, S); let x = 0, y = 0; for (const q of p) { x += q[0]; y += q[1]; } return [x / p.length, y / p.length];
  }
  const inPoly = (p, x, y) => { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) if ((p[i][1] > y) !== (p[j][1] > y) && x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0]) c = !c; return c; };
  /** a screen point of a room (room pixels) on the plan; a painted room has its doors by hotspot, else its middle */
  function roomPoint(it, xy, hotspot, S) {
    const m = isoMap(it);
    if (m && xy) { const [u, v] = ISOMAP.projector(m).uvAt(xy[0], xy[1]); return frame(it, S)(u, v); }
    if (it.topdown && xy) return frame(it, S)(xy[0] / it.topdown.ppm, xy[1] / it.topdown.ppm);
    if (hotspot && it.doors?.[hotspot]) return it.doors[hotspot];
    return centre(it, S);
  }

  /** which plan item a game room is drawn as */
  function roomItems(plan) {
    const by = {};
    for (const it of plan.items) if (it.kind === "room") for (const r of String(it.room ?? "").split(",").map((s) => s.trim()).filter(Boolean)) by[r] ??= it;
    by.flat_danach ??= by.flat;                                       // the flat after the end of Chapter 1 is the flat
    return by;
  }

  /** the ways, each with its two ends on the plan and how well they meet */
  function ways(plan) {
    const S = plan.scale, by = roomItems(plan), links = typeof STADTPLAN_LINKS === "undefined" ? [] : STADTPLAN_LINKS;
    const out = [];
    for (const l of links) {
      const A = by[l.from], B = by[l.to];
      if (!A || !B) continue;
      const a = roomPoint(A, l.at, l.hotspot, S);
      // where Juno arrives: the goto's place in the target; in a painted room the door of the way back
      const back = links.find((k) => k.from === l.to && k.to === l.from);
      const b = (isoMap(B) || B.topdown) && l.toAt ? roomPoint(B, l.toAt, null, S) : roomPoint(B, back?.at ?? null, back?.hotspot ?? null, S);
      const d = Math.hypot(a[0] - b[0], a[1] - b[1]) / S;
      out.push({ ...l, A, B, a, b, d, across: levelOf(A) !== levelOf(B), accepted: plan.accept?.[`${l.from}/${l.hotspot}`] ?? null });
    }
    return out;
  }

  /** what doesn't fit, numbered */
  function problems(plan) {
    const S = plan.scale, list = [], by = roomItems(plan);
    for (const w of ways(plan)) {
      if (w.d <= 3 || w.accepted) continue;
      const pair = [w.from, w.to].sort().join("/");
      if (list.some((p) => p.pair === pair)) continue;
      const what = w.across ? `Übereinander passt nicht: ${w.name} (${w.from}) und die Ankunft in ${w.to} liegen ${w.d.toFixed(1)} m auseinander.`
        : `${w.name} (${w.from} → ${w.to}): Tür und Ankunft liegen ${w.d.toFixed(1)} m auseinander.`;
      list.push({ text: what, at: w.a, level: levelOf(w.A), pair });
    }
    // rooms on one level that lie in each other
    const rooms = plan.items.filter((i) => i.kind === "room");
    for (let i = 0; i < rooms.length; i++) for (let j = i + 1; j < rooms.length; j++) {
      const A = rooms[i], B = rooms[j];
      if (levelOf(A) !== levelOf(B) || A.within === B.id || B.within === A.id) continue;
      const pa = points(A, S), pb = points(B, S);
      const xs = pa.map((p) => p[0]), ys = pa.map((p) => p[1]);
      let n = 0, sx = 0, sy = 0;
      for (let x = Math.min(...xs); x <= Math.max(...xs); x += 2) for (let y = Math.min(...ys); y <= Math.max(...ys); y += 2)
        if (inPoly(pa, x, y) && inPoly(pb, x, y)) { n++; sx += x; sy += y; }
      const m2 = n * 4 / (S * S);
      if (m2 >= 1) list.push({ text: `${A.name} und ${B.name} liegen ineinander (${m2.toFixed(1)} m²).`, at: [sx / n, sy / n], level: levelOf(A) });
    }
    // a room up in a building must have a building under it, not the street
    const z = Object.fromEntries(plan.levels.map((l) => [l.id, l.z]));
    const ground = plan.items.filter((i) => (z[levelOf(i)] ?? 0) === 0 && ((i.kind === "room" && !i.outdoor) || i.kind === "building"));
    for (const A of rooms.filter((i) => (z[levelOf(i)] ?? 0) > 0 && !i.outdoor)) {
      const pa = points(A, S), xs = pa.map((p) => p[0]), ys = pa.map((p) => p[1]);
      let n = 0, out = 0, sx = 0, sy = 0;
      for (let x = Math.min(...xs); x <= Math.max(...xs); x += 3) for (let y = Math.min(...ys); y <= Math.max(...ys); y += 3) {
        if (!inPoly(pa, x, y)) continue;
        n++;
        if (!ground.some((g) => inPoly(points(g, S), x, y))) { out++; sx += x; sy += y; }
      }
      if (n && out / n > 0.2) list.push({ text: `${A.name} liegt zu ${Math.round(out / n * 100)} % über keinem Haus der Straße (über der Straße oder dem Nichts).`, at: [sx / out, sy / out], level: levelOf(A) });
    }
    const rooms0 = typeof STADTPLAN_ROOMS === "undefined" ? [] : STADTPLAN_ROOMS;
    for (const r of rooms0) if (!by[r]) list.push({ text: `Der Raum ${r} fehlt im Plan.`, at: null, level: null });
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
    const a = dir * D2R;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r, a - 0.42, a + 0.42); ctx.closePath();
    ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke();
  }

  /** an iso room from its map: floor, walls, openings, stairs, and the camera its picture is seen from */
  function drawIso(ctx, it, S, full) {
    const m = isoMap(it), P = frame(it, S), [U, V] = m.size, st = STATUS[it.status] ?? { color: C.dim };
    path(ctx, [P(0, 0), P(U, 0), P(U, V), P(0, V)]); ctx.fillStyle = C.room; ctx.fill();
    ctx.strokeStyle = st.color; ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]);
    for (const w of m.walls ?? []) {
      const a = P(...w.from), b = P(...w.to);
      ctx.strokeStyle = st.color; ctx.lineWidth = w.stub ? 2 : 4; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke();
    }
    for (const o of m.openings ?? []) {
      const w = m.walls[o.wall]; if (!w) continue;
      const du = w.to[0] - w.from[0], dv = w.to[1] - w.from[1], L = Math.hypot(du, dv);
      const at = (s) => P(w.from[0] + du / L * s, w.from[1] + dv / L * s);
      const low = (o.h?.[0] ?? 0) < 0.2, a = at(o.from), b = at(o.to);
      if (!low && !/window|fenster/i.test(o.id ?? "")) continue;            // signs and lights up the wall are no ways
      ctx.strokeStyle = o.id === "lift" ? C.lift : low ? C.open : "#8ab4d6"; ctx.lineWidth = low ? 5 : 3;
      ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke();
      if (full && low) label(ctx, o.id, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 9, { size: 10, color: o.id === "lift" ? C.lift : "#c8d4e8" });
    }
    if (m.stairs) {
      const s = m.stairs, a = P(...s.from), b = P(...s.to);
      ctx.strokeStyle = C.lift; ctx.lineWidth = 1.5; ctx.setLineDash([2, 2]);
      path(ctx, [a, P(s.to[0], s.from[1]), b, P(s.from[0], s.to[1])]); ctx.stroke(); ctx.setLineDash([]);
      if (full) label(ctx, "Treppe", (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, { size: 10, color: C.lift });
    }
    if (full) {
      // the picture's camera: out in front of the near corner, looking at the back corner
      const r = it.rot ?? 0, dir = r + 225, [fx, fy] = P(U + 1.6, V + 1.6);
      cone(ctx, fx, fy, dir, 34, "rgba(255,213,138,0.14)", "rgba(255,213,138,0.6)");
      ctx.fillStyle = C.view; ctx.beginPath(); ctx.arc(fx, fy, 4, 0, Math.PI * 2); ctx.fill();
    }
  }

  function drawLevel(ctx, plan, level, full) {
    const S = plan.scale, items = plan.items.filter((i) => levelOf(i) === level && i.kind !== "water");
    const st = (it) => STATUS[it.status] ?? { color: C.dim };
    ctx.globalAlpha = full ? 1 : 0.22;
    for (const it of items.filter((i) => i.kind === "free")) {
      if (!full) continue;
      path(ctx, points(it, S)); ctx.setLineDash([6, 6]); ctx.strokeStyle = C.free; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
      const [x, y] = centre(it, S); label(ctx, "frei", x, y, { size: 16, color: C.free, shadow: false });
    }
    for (const it of items.filter((i) => ["street", "building", "place"].includes(i.kind) && points(i, S))) {
      path(ctx, points(it, S)); ctx.fillStyle = it.kind === "street" ? C.street : it.kind === "building" ? C.building : "rgba(40,30,60,0.6)"; ctx.fill();
      ctx.strokeStyle = st(it).color; ctx.lineWidth = 2; ctx.stroke();
    }
    for (const it of items.filter((i) => i.kind === "room")) {
      if (isoMap(it)) { drawIso(ctx, it, S, full); continue; }
      path(ctx, points(it, S)); ctx.fillStyle = C.room; ctx.fill(); ctx.strokeStyle = st(it).color; ctx.lineWidth = 3; ctx.stroke();
      if (it.topdown && full) {
        // the picture's own top edge, so its turn shows
        const P = frame(it, S), W = it.topdown.size[0] / it.topdown.ppm;
        ctx.strokeStyle = C.view; ctx.lineWidth = 2; ctx.setLineDash([10, 4]); ctx.beginPath(); ctx.moveTo(...P(0, 0)); ctx.lineTo(...P(W, 0)); ctx.stroke(); ctx.setLineDash([]);
        const [mx, my] = P(W / 2, 0); label(ctx, "oberer Bildrand", mx, my + 12, { size: 10, color: C.view });
      }
    }
    ctx.globalAlpha = 1;
    if (!full) return;
    // the painted rooms' cameras, and views of their own
    for (const it of items.filter((i) => (i.kind === "room" && i.view) || i.kind === "view")) {
      if (it.view?.top) { const [x, y] = centre(it, S); ctx.strokeStyle = C.view; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y + 22, 9, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = C.view; ctx.beginPath(); ctx.arc(x, y + 22, 3, 0, Math.PI * 2); ctx.fill(); label(ctx, "von oben", x + 14, y + 22, { size: 10, color: C.view, align: "left" }); continue; }
      const [x, y] = it.view?.at ?? it.at, dir = it.view?.dir ?? it.dir ?? 0;
      cone(ctx, x, y, dir, 34, "rgba(255,213,138,0.14)", "rgba(255,213,138,0.6)");
      ctx.fillStyle = C.view; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
      if (it.kind === "view") label(ctx, it.name, x + 8, y + 12, { size: 11, color: C.view, align: "left" });
    }
    // names
    for (const it of items.filter((i) => ["street", "building", "place", "room"].includes(i.kind) && points(i, S))) {
      const [x, y] = it.label ?? centre(it, S), vertical = it.rect && it.rect[3] > it.rect[2] * 1.6 && it.kind !== "building";
      ctx.save(); ctx.translate(x, y); if (vertical) ctx.rotate(-Math.PI / 2);
      label(ctx, it.name, 0, 0, { size: it.kind === "room" ? 14 : 13, bold: it.kind !== "place" });
      if (it.room) label(ctx, it.room.split(",")[0], 0, 14, { size: 10, color: C.dim });
      ctx.restore();
    }
    for (const it of items.filter((i) => (i.kind === "place" || i.kind === "building") && i.at && !i.rect && !i.poly)) {
      const [x, y] = it.at; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fillStyle = st(it).color; ctx.fill();
      label(ctx, it.name, x + 10, y, { size: 12, align: "left" });
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
      if (levelOf(w.A) !== level && levelOf(w.B) !== level) continue;
      const color = w.accepted ? C.dim : w.d <= 1.5 ? C.ok : w.d <= 3 ? C.near : C.bad;
      if (!w.across) { if (levelOf(w.A) === level) { ctx.setLineDash(w.accepted ? [5, 4] : []); arrow(ctx, w.a, w.b, color, 2); ctx.setLineDash([]); } continue; }
      // to another level: a mark where it leaves on this one
      const here = levelOf(w.A) === level ? w.a : w.b, other = levelOf(w.A) === level ? w.B : w.A;
      const up = z[levelOf(other)] > z[level];
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(here[0], here[1], 7, 0, Math.PI * 2); ctx.fill();
      label(ctx, up ? "↑" : "↓", here[0], here[1], { size: 12, bold: true, color: "#0b0e18", shadow: false });
      if (levelOf(w.A) === level) label(ctx, `${w.name} ${up ? "↑" : "↓"} ${names[levelOf(other)]}`, here[0] + 11, here[1] + 1, { size: 10, color, align: "left" });
    }
  }

  function drawMap(ctx, plan, level) {
    const [W, H] = plan.size, S = plan.scale;
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 100) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 100) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    // the water is the same on every level (fainter away from the street)
    for (const it of plan.items.filter((i) => i.kind === "water")) {
      ctx.globalAlpha = level === "strasse" ? 1 : 0.45;
      path(ctx, points(it, S)); ctx.fillStyle = C.water; ctx.fill(); ctx.strokeStyle = C.waterEdge; ctx.lineWidth = 2; ctx.stroke();
      ctx.globalAlpha = 1;
      if (level === "strasse") { const [x, y] = it.label ?? centre(it, S); label(ctx, it.name, x, y, { size: 18, color: "#4fa8c8", bold: true }); }
    }
    // the street faint under the other levels, so they have their bearings
    if (level !== "strasse") drawLevel(ctx, plan, "strasse", false);
    drawLevel(ctx, plan, level, true);
    drawWays(ctx, plan, level);
    // what doesn't fit, numbered where it is
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
    label(ctx, "Räume in Metern, alles dazwischen nicht maßstäblich", X, y, { size: 12, color: C.dim, align: "left" }); y += 26;
    // the levels, as a cut
    for (const l of plan.levels) {
      const here = l.id === level;
      ctx.fillStyle = here ? "#2a3550" : "#181d33"; ctx.fillRect(X, y - 10, 160, 20);
      if (here) { ctx.strokeStyle = C.cyan; ctx.lineWidth = 2; ctx.strokeRect(X, y - 10, 160, 20); }
      label(ctx, l.name, X + 8, y, { size: 12, bold: here, align: "left", shadow: false }); y += 22;
    }
    y += 10;
    label(ctx, "Stand", X, y, { size: 14, bold: true, align: "left" }); y += 20;
    for (const s of Object.values(STATUS)) { ctx.strokeStyle = s.color; ctx.lineWidth = 3; ctx.strokeRect(X + 2, y - 6, 22, 12); label(ctx, s.label, X + 34, y, { size: 12, align: "left" }); y += 19; }
    y += 6; label(ctx, "Kameras und Wege", X, y, { size: 14, bold: true, align: "left" }); y += 22;
    cone(ctx, X + 6, y, 0, 22, "rgba(98,222,240,0.16)", "rgba(98,222,240,0.5)"); ctx.fillStyle = C.cyan; ctx.fillRect(X + 2, y - 4, 8, 8);
    label(ctx, "Kamera eines Feeds", X + 34, y, { size: 12, align: "left" }); y += 22;
    cone(ctx, X + 6, y, 0, 22, "rgba(255,213,138,0.14)", "rgba(255,213,138,0.6)"); ctx.fillStyle = C.view; ctx.beginPath(); ctx.arc(X + 6, y, 4, 0, Math.PI * 2); ctx.fill();
    label(ctx, "von wo das Bild eines Raums schaut", X + 34, y, { size: 12, align: "left" }); y += 22;
    for (const [c, t, d] of [[C.ok, "Übergang: Tür und Ankunft treffen sich"], [C.near, "bis 3 m auseinander"], [C.bad, "weiter auseinander: passt nicht"], [C.dim, "mit Absicht weiter (Torweg, Treppe)", true]]) {
      ctx.setLineDash(d ? [5, 4] : []); arrow(ctx, [X, y], [X + 24, y], c, 2); ctx.setLineDash([]); label(ctx, t, X + 34, y, { size: 12, align: "left" }); y += 19;
    }
    ctx.fillStyle = C.ok; ctx.beginPath(); ctx.arc(X + 10, y, 7, 0, Math.PI * 2); ctx.fill(); label(ctx, "↑", X + 10, y, { size: 12, bold: true, color: "#0b0e18", shadow: false });
    label(ctx, "Übergang in eine andere Ebene", X + 34, y, { size: 12, align: "left" }); y += 19;
    ctx.strokeStyle = C.open; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(X, y); ctx.lineTo(X + 24, y); ctx.stroke(); label(ctx, "Tür, Öffnung (Iso-Karte)", X + 34, y, { size: 12, align: "left" }); y += 19;
    ctx.strokeStyle = C.lift; ctx.beginPath(); ctx.moveTo(X, y); ctx.lineTo(X + 24, y); ctx.stroke(); label(ctx, "Aufzug, Treppe", X + 34, y, { size: 12, align: "left" }); y += 30;
    // what doesn't fit
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

  /** the item under a plan point on a level (for a tooltip) */
  function itemAt(plan, level, x, y) {
    const S = plan.scale, order = ["cam", "view", "note", "room", "place", "building", "street", "free", "water"];
    for (const k of order) for (const it of plan.items.filter((i) => i.kind === k && (levelOf(i) === level || i.kind === "water")).reverse()) {
      const anchor = it.kind === "cam" || it.kind === "view" || (it.at && !it.rect && !it.poly && !isoMap(it) && !it.topdown) ? it.at : null;
      if (anchor) { if (Math.hypot(anchor[0] - x, anchor[1] - y) < 12) return it; continue; }
      const p = points(it, S); if (p && inPoly(p, x, y)) return it;
    }
    return null;
  }

  return { draw, itemAt, problems, ways, STATUS };
})();

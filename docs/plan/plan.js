// Draws a plan (docs/plan/stadtplan.js, the format is described there) onto a canvas: the water, the streets, the buildings
// and places by their level and status, the cameras with the way they look, the free places, the open notes, a legend and the
// rings as a cut. Used by docs/plan/index.html; the studio's plan tab will use it too.
"use strict";

var PlanDraw = (function () {
  /** what the status says, as a colour */
  const STATUS = {
    gemalt: { color: "#7fe0a0", label: "gemalt, im Spiel" },
    block: { color: "#eea040", label: "im Spiel, auf Blöcken" },
    geplant: { color: "#8fa0c8", label: "geplant (Docs), nicht gebaut" },
    vorschlag: { color: "#ff4fd3", label: "Vorschlag: Lage nicht entschieden" },
    idee: { color: "#b0a0d8", label: "Idee" },
  };
  const C = { bg: "#0b0e18", grid: "#141a2a", water: "#0e2a3c", waterEdge: "#1f5e74", street: "#262c42", streetEdge: "#3a4466",
    building: "#1c1f33", text: "#dfe6f0", dim: "#8a96b0", free: "#4a5470", note: "#ffd58a", cyan: "#62def0" };
  const FONT = "Segoe UI, Arial, sans-serif";

  /** the item's outline as points */
  function points(it) {
    if (it.poly) { const p = []; for (let i = 0; i < it.poly.length; i += 2) p.push([it.poly[i], it.poly[i + 1]]); return p; }
    if (it.rect) { const [x, y, w, h] = it.rect; return [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; }
    return null;
  }
  function centre(it) {
    if (it.at) return it.at;
    const p = points(it);
    if (it.rect) return [it.rect[0] + it.rect[2] / 2, it.rect[1] + it.rect[3] / 2];
    let x = 0, y = 0; for (const q of p) { x += q[0]; y += q[1]; } return [x / p.length, y / p.length];
  }
  function path(ctx, pts) { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); }
  /** dashes by level: below the street dashed, two below dotted, above long dashes */
  const dash = (level) => (level === -1 ? [8, 5] : level === -2 ? [2, 4] : level === 1 ? [14, 4] : []);

  function wrap(ctx, text, width) {
    const words = String(text).split(" "), lines = [];
    let line = "";
    for (const w of words) { const t = line ? line + " " + w : w; if (ctx.measureText(t).width > width && line) { lines.push(line); line = w; } else line = t; }
    if (line) lines.push(line);
    return lines;
  }
  function label(ctx, text, x, y, { size = 14, color = C.text, bold = false, align = "center", shadow = true } = {}) {
    ctx.font = `${bold ? "600 " : ""}${size}px ${FONT}`; ctx.textAlign = align; ctx.textBaseline = "middle";
    if (shadow) { ctx.lineWidth = 4; ctx.strokeStyle = "rgba(5,8,15,0.85)"; ctx.strokeText(text, x, y); }
    ctx.fillStyle = color; ctx.fillText(text, x, y);
  }

  /** the plan itself, in plan units (scale the context before) */
  function drawMap(ctx, plan) {
    const [W, H] = plan.size;
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 100) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y <= H; y += 100) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    const items = plan.items, of = (k) => items.filter((i) => i.kind === k);
    // the water, the free places, the streets
    for (const it of of("water")) {
      path(ctx, points(it)); ctx.fillStyle = C.water; ctx.fill(); ctx.strokeStyle = C.waterEdge; ctx.lineWidth = 2; ctx.stroke();
      const [x, y] = centre(it);
      const [lx, ly] = it.label ?? [x, y];
      label(ctx, it.name, lx, ly, { size: 18, color: "#4fa8c8", bold: true });
    }
    for (const it of of("free")) {
      path(ctx, points(it)); ctx.setLineDash([6, 6]); ctx.strokeStyle = C.free; ctx.lineWidth = 2; ctx.stroke(); ctx.setLineDash([]);
      const [x, y] = centre(it); label(ctx, "frei", x, y, { size: 16, color: C.free, shadow: false });
    }
    const outline = (it, fill) => {
      const p = points(it); if (!p) return;
      const st = STATUS[it.status] ?? { color: C.dim };
      path(ctx, p); if (fill) { ctx.fillStyle = fill; ctx.globalAlpha = it.level < 0 ? 0.55 : 1; ctx.fill(); ctx.globalAlpha = 1; }
      ctx.setLineDash(dash(it.level ?? 0)); ctx.strokeStyle = st.color; ctx.lineWidth = it.level ? 2.5 : 2; ctx.stroke(); ctx.setLineDash([]);
    };
    for (const it of of("street")) outline(it, C.street);
    // what lies below, under the streets (drawn first, so the streets' level shows over it only by its dashes)
    for (const it of items.filter((i) => (i.kind === "place" || i.kind === "building") && (i.level ?? 0) < 0 && !i.at)) outline(it, i => 0);
    for (const it of items.filter((i) => (i.kind === "building" || i.kind === "place") && (i.level ?? 0) >= 0 && !i.at)) outline(it, it.kind === "building" ? C.building : "rgba(40,30,60,0.6)");
    for (const it of items.filter((i) => (i.kind === "place" || i.kind === "building") && (i.level ?? 0) < 0 && !i.at)) outline(it, null);
    // names: streets along their length, the rest in their middle
    for (const it of items.filter((i) => ["street", "building", "place"].includes(i.kind) && !i.at)) {
      const [x, y] = it.label ?? centre(it), st = STATUS[it.status];
      const vertical = it.rect && it.rect[3] > it.rect[2] * 1.6 && it.kind === "street";
      const tag = (it.level ?? 0) < 0 ? `  (${it.level === -1 ? "−1" : "−2"})` : it.level === 1 ? "  (Dach)" : "";
      ctx.save(); ctx.translate(x, y + ((it.level ?? 0) < 0 ? 0 : 0)); if (vertical) ctx.rotate(-Math.PI / 2);
      label(ctx, it.name + tag, 0, 0, { size: it.kind === "street" ? 15 : 14, bold: it.kind !== "place", color: (it.level ?? 0) < 0 ? st?.color ?? C.text : C.text });
      if (it.room) label(ctx, it.room.split(",")[0] + (it.room.includes(",") ? " …" : ""), 0, 15, { size: 11, color: C.dim });
      ctx.restore();
    }
    // small places
    for (const it of items.filter((i) => (i.kind === "place" || i.kind === "building") && i.at)) {
      const [x, y] = it.at, st = STATUS[it.status] ?? { color: C.dim };
      ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fillStyle = st.color; ctx.fill();
      ctx.strokeStyle = C.bg; ctx.lineWidth = 2; ctx.stroke();
      label(ctx, it.name + ((it.level ?? 0) < 0 ? "  (−1)" : ""), x + 10, y, { size: 12, align: "left" });
    }
    // the cameras: a cone the way they look, a dot, the name
    for (const it of of("cam")) {
      const [x, y] = it.at, st = STATUS[it.status] ?? { color: C.dim }, a = (it.dir ?? 0) * Math.PI / 180;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, 38, a - 0.42, a + 0.42); ctx.closePath();
      ctx.fillStyle = "rgba(98,222,240,0.16)"; ctx.fill(); ctx.strokeStyle = "rgba(98,222,240,0.5)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = C.cyan; ctx.fillRect(x - 4, y - 4, 8, 8); ctx.strokeStyle = st.color; ctx.lineWidth = 2; ctx.strokeRect(x - 5, y - 5, 10, 10);
      label(ctx, it.name, x, y - 14, { size: 12, bold: true, color: C.cyan });
    }
    // the open notes
    for (const it of of("note")) {
      const [x, y] = it.at;
      ctx.font = `13px ${FONT}`;
      const lines = wrap(ctx, it.note, 520), h = 20 + lines.length * 17;
      ctx.fillStyle = "rgba(40,32,12,0.92)"; ctx.fillRect(x, y - 14, 540, h); ctx.strokeStyle = C.note; ctx.lineWidth = 1.5; ctx.strokeRect(x, y - 14, 540, h);
      label(ctx, it.name + ":", x + 10, y, { size: 13, bold: true, color: C.note, align: "left", shadow: false });
      lines.forEach((l, i) => label(ctx, l, x + 10, y + 17 * (i + 1), { size: 13, color: "#f0e0c0", align: "left", shadow: false }));
    }
    // north
    label(ctx, "N ↑", W - 30, 24, { size: 16, bold: true, color: C.dim });
  }

  /** the side: the title, the legend, the rings as a cut */
  function drawSide(ctx, plan, x0, H) {
    ctx.fillStyle = "#10142a"; ctx.fillRect(x0, 0, 340, H);
    let y = 34;
    label(ctx, plan.title, x0 + 20, y, { size: 22, bold: true, align: "left" }); y += 24;
    label(ctx, "Lageplan, nicht maßstäblich", x0 + 20, y, { size: 13, color: C.dim, align: "left" }); y += 36;
    label(ctx, "Stand", x0 + 20, y, { size: 15, bold: true, align: "left" }); y += 24;
    for (const s of Object.values(STATUS)) { ctx.strokeStyle = s.color; ctx.lineWidth = 3; ctx.strokeRect(x0 + 22, y - 7, 26, 14); label(ctx, s.label, x0 + 60, y, { size: 13, align: "left" }); y += 24; }
    y += 10; label(ctx, "Ebene", x0 + 20, y, { size: 15, bold: true, align: "left" }); y += 24;
    for (const [lv, t] of [[1, "darüber (Dächer)"], [0, "die Straßen des Neunten"], [-1, "darunter (Drain-Markt)"], [-2, "noch tiefer (Sümpfe, Metro)"]]) {
      ctx.setLineDash(dash(lv)); ctx.strokeStyle = C.text; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x0 + 22, y); ctx.lineTo(x0 + 50, y); ctx.stroke(); ctx.setLineDash([]);
      label(ctx, t, x0 + 60, y, { size: 13, align: "left" }); y += 24;
    }
    y += 10; label(ctx, "Kamera", x0 + 20, y, { size: 15, bold: true, align: "left" }); y += 26;
    ctx.beginPath(); ctx.moveTo(x0 + 26, y); ctx.arc(x0 + 26, y, 26, -0.42, 0.42); ctx.closePath(); ctx.fillStyle = "rgba(98,222,240,0.16)"; ctx.fill();
    ctx.fillStyle = C.cyan; ctx.fillRect(x0 + 22, y - 4, 8, 8);
    label(ctx, "wohin sie schaut", x0 + 60, y, { size: 13, align: "left" }); y += 30;
    ctx.setLineDash([6, 6]); ctx.strokeStyle = C.free; ctx.lineWidth = 2; ctx.strokeRect(x0 + 22, y - 8, 28, 16); ctx.setLineDash([]);
    label(ctx, "frei für Neues", x0 + 60, y, { size: 13, align: "left" }); y += 44;
    // the rings, a cut from the crown down to the sea
    label(ctx, "Die Ringe (Schnitt)", x0 + 20, y, { size: 15, bold: true, align: "left" }); y += 18;
    const RINGS = [["Krone", "Nagi·wa Tower, Civic Rest, Ruhekern"], ["1.–4. Ring", ""], ["5. Ring (Mitte)", "Transitachse, Schlafstation"], ["6.–8. Ring", ""],
      ["Neunter Ring", "hier: dieser Plan"], ["Drain-Markt", "unter der Stadt"], ["Sümpfe, Metro", "die alte Stadt"], ["Meer, Pumpen", "Pumpenhalle 3"]];
    RINGS.forEach(([n, t], i) => {
      const yy = y + i * 34, w = 110 + i * 24, here = i === 4;
      ctx.fillStyle = here ? "#2a3550" : i > 4 ? "#0e2a3c" : "#1a2036"; ctx.fillRect(x0 + 170 - w / 2, yy, w, 28);
      if (here) { ctx.strokeStyle = C.cyan; ctx.lineWidth = 2; ctx.strokeRect(x0 + 170 - w / 2, yy, w, 28); }
      label(ctx, n, x0 + 170, yy + 9, { size: 12, bold: true, shadow: false });
      if (t) label(ctx, t, x0 + 170, yy + 21, { size: 10, color: C.dim, shadow: false });
    });
  }

  /** The whole sheet: the plan at `scale`, the side to its right. */
  function draw(canvas, plan, scale = 1) {
    const [W, H] = plan.size;
    canvas.width = Math.round((W + 340) * scale); canvas.height = Math.round(H * scale);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    drawMap(ctx, plan);
    drawSide(ctx, plan, W, H);
  }

  /** the item under a plan point (for a tooltip) */
  function itemAt(plan, x, y) {
    const inPoly = (p) => { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) { if ((p[i][1] > y) !== (p[j][1] > y) && x < (p[j][0] - p[i][0]) * (y - p[i][1]) / (p[j][1] - p[i][1]) + p[i][0]) c = !c; } return c; };
    const order = ["cam", "note", "place", "building", "street", "free", "water"];
    for (const k of order) for (const it of plan.items.filter((i) => i.kind === k).reverse()) {
      if (it.at && Math.hypot(it.at[0] - x, it.at[1] - y) < 12) return it;
      const p = points(it); if (p && inPoly(p)) return it;
    }
    return null;
  }

  return { draw, itemAt, STATUS };
})();

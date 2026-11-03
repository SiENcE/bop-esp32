// Halcyon: what the deck and the feeds draw over their rooms (docs/style-guide.md §8–9,
// docs/kapitel0-design.md §2–3). The rooms hold the hotspots (so the solver sees every click); this
// layer only draws: the deck's screen, the feeds' display (OSD), the implant's overlay and the zoom window.
// A room says what it is: `deck: true`, or `feed: "cam03"` (a key of Halcyon.cams).
"use strict";

(function () {
  const W = 320, H = 180;
  const C = {
    ink: "#0c0e1a", steel: "#131a2a", steel2: "#1a2337", steel3: "#2f3e5a", steelText: "#617aa0",
    cyan: "#62def0", cyanDark: "#1f88a4", cyanPale: "#dafcff", yellow: "#fff070", amber: "#eea040", magenta: "#ff4fd3",
    phosphor: "#8acfae", phosphorBright: "#d4f7e2", phosphorDim: "#388169", red: "#ff2a3c", implant: "#3ff2ff", juno: "#ffd83a",
  };
  const S = () => Cutaway.state;
  const font = () => Cutaway.ui.font();
  /** @param {CanvasRenderingContext2D} ctx @param {string} text @param {number} x @param {number} y @param {string} color @param {"left" | "center" | "right"} [align] */
  function text(ctx, text, x, y, color, align = "left") { font().draw(ctx, text, x, y, { color, outline: C.ink, align }); }
  /** Corner brackets round a box. @param {CanvasRenderingContext2D} ctx @param {number[]} b @param {string} color @param {number} [len] */
  function brackets(ctx, [x, y, w, h], color, len = 3) {
    ctx.fillStyle = color;
    const x2 = x + w, y2 = y + h;
    for (const [cx, cy, dx, dy] of [[x - 1, y - 1, 1, 1], [x2, y - 1, -1, 1], [x - 1, y2, 1, -1], [x2, y2, -1, -1]]) {
      ctx.fillRect(dx > 0 ? cx : cx - len + 1, cy, len, 1);
      ctx.fillRect(cx, dy > 0 ? cy : cy - len + 1, 1, len);
    }
  }
  const blink = () => Math.floor(Cutaway.clock.time / 500) % 2 === 0;

  // ------------------------------------------------------------------ the feeds
  /** @param {CanvasRenderingContext2D} ctx @param {string} id */
  function feed(ctx, id) {
    const cam = Halcyon.cams[id];
    // the implant's overlay: tagged people in cyan, with what Juno knows about them
    for (const b of Cutaway.scene.boxes()) {
      if (!b.actor || !S().flag(`tag_${b.actor}`)) continue;
      brackets(ctx, b.box, C.implant);
      const p = Halcyon.people[b.actor], name = p && p.known && S().flag(p.known) ? p.name : "UNBEKANNT";
      // beside the head; near the top (under the display's lines) beside the feet instead
      text(ctx, name, b.box[0] + b.box[2] + 3, b.box[1] < 34 ? b.box[1] + b.box[3] - 6 : b.box[1] - 2, C.implant);
    }
    // the camera's display: who, where, whose (phosphor), the link (implant cyan)
    if (cam) {
      text(ctx, `CAM ${cam.id} // ${cam.place}`, 4, 3, C.phosphorBright);
      text(ctx, cam.owner, 4, 12, C.phosphor);
      text(ctx, "LINK: J.REYES IMPLANTAT", 4, 21, C.implant);
    }
    text(ctx, Halcyon.stamp(), W - 4, 3, C.phosphorBright, "right");
    if (S().flag("rec_on") && blink()) { ctx.fillStyle = C.red; ctx.fillRect(W - 80, 4, 3, 3); }
    // the cameras Juno has linked: a column on the left, under the display's lines (a click switches:
    // hotspots `thumb_<cam>`; the rects are Halcyon.osd's)
    const O = Halcyon.osd;
    Object.keys(Halcyon.cams).forEach((c, i) => {
      if (!S().flag(`link_${c}`)) return;
      const [x, y, w, h] = O.thumb(i), live = c === id;
      ctx.fillStyle = live ? C.phosphorDim : C.ink; ctx.fillRect(x, y, w, h);
      text(ctx, `CAM ${Halcyon.cams[c].id}`, x + w / 2, y + 2, live ? C.phosphorBright : C.phosphor, "center");
    });
    // the buttons under the time: buffer (only when it holds something Juno needs), REC, wait, deck
    const buttons = /** @type {[string, number[], boolean][]} */ ([["REC", O.rec, !!S().flag("rec_on")], ["VOR", O.wait, false], ["DECK", O.back, false]]);
    if (Cutaway.scene.hotspots().some((h) => h.id === "rewind")) buttons.unshift(["PUFFER", O.rewind, false]);
    for (const [label, [x, y, w, h], on] of buttons) {
      ctx.fillStyle = on ? C.red : C.ink; ctx.fillRect(x, y, w, h);
      text(ctx, label, x + w / 2, y + 2, on ? C.phosphorBright : C.implant, "center");
    }
    const n = Object.keys(Halcyon.cache).filter((k) => S().flag(`cache_${k}`)).length;
    text(ctx, `CACHE ${n}/8`, 4, 30, C.implant);
  }

  // ------------------------------------------------------------------ the zoom window
  /** @param {CanvasRenderingContext2D} ctx */
  function zoom(ctx) {
    if (!Halcyon.zoom) return;
    const a = Cutaway.assets.get(Halcyon.zoom);
    if (!a) return;
    const f = a.frames[0], w = f.w * 2, h = f.h * 2, x = Math.round((W - w) / 2), y = 34;
    ctx.fillStyle = C.ink; ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
    ctx.imageSmoothingEnabled = false;
    ctx.save(); ctx.translate(x, y); ctx.scale(2, 2);
    Cutaway.assets.draw(ctx, Halcyon.zoom, 0, 0, { anchor: [0, 0], t: Cutaway.clock.time });
    ctx.restore();
    brackets(ctx, [x - 2, y - 2, w + 4, h + 4], C.implant, 6);
    text(ctx, "ZOOM x3", x, y + h + 5, C.implant);
  }

  // ------------------------------------------------------------------ the deck
  /** @param {CanvasRenderingContext2D} ctx */
  function deck(ctx) {
    const D = Halcyon.deckLayout;
    ctx.fillStyle = C.steel; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = C.steel2; ctx.fillRect(0, 0, W, 14); ctx.fillRect(D.map[0], D.map[1], D.map[2], D.map[3]);
    text(ctx, "DECK // J.REYES", 4, 3, C.cyan);
    text(ctx, `${Halcyon.stamp()}   ${S().flag("chits") ?? 0} CHITS`, W - 4, 3, C.cyanPale, "right");
    // the map of the quarter: streets as lines, cameras as points
    ctx.fillStyle = C.steel3;
    for (const [x, y, w, h] of D.streets) ctx.fillRect(x, y, w, h);
    text(ctx, "NETZKARTE", D.map[0] + 3, D.map[1] + 3, C.steelText);
    for (const [id, cam] of Object.entries(Halcyon.cams)) {
      if (!S().test(cam.if)) continue;
      const [x, y] = cam.map, linked = !!S().flag(`link_${id}`), code = !!S().flag(`code_${id}`);
      ctx.fillStyle = linked ? C.cyan : code ? C.cyanDark : C.steel3;
      ctx.fillRect(x - 2, y - 2, 5, 5);
      text(ctx, `CAM ${cam.id}`, x + 5, y - 3, linked ? C.cyanPale : C.steelText);
      if (!linked) text(ctx, code ? "CODE BEKANNT" : "KEIN ZUGANG", x + 5, y + 5, code ? C.cyan : C.steelText);
    }
    // messages: the rows the room's hotspots `mail_<id>` sit on
    text(ctx, "NACHRICHTEN", D.side, 20, C.steelText);
    D.mails.forEach((/** @type {{id: string, if?: any, from: string, subject: string}} */ m, /** @type {number} */ i) => {
      if (!S().test(m.if)) return;
      const y = 30 + i * 12, unread = !S().flag(`read_${m.id}`);
      ctx.fillStyle = C.steel2; ctx.fillRect(D.side - 2, y - 2, W - D.side - 2, 11);
      text(ctx, `${unread ? "NEU " : ""}${m.from}: ${m.subject}`, D.side, y, unread ? C.cyanPale : C.cyan);
    });
    // the cache
    text(ctx, "CACHE", D.side, 84, C.steelText);
    Object.entries(Halcyon.cache).filter(([k]) => S().flag(`cache_${k}`)).forEach(([, c], i) => {
      text(ctx, `${c.kind === "clip" ? "CLIP" : "NOTIZ"}  ${c.name}`, D.side, 94 + i * 10, c.kind === "clip" ? C.cyanPale : C.cyan);
    });
    // the Kassenbuch: its last lines
    text(ctx, "KASSENBUCH", D.side, 134, C.steelText);
    Object.entries(Halcyon.ledger).filter(([k]) => S().flag(`ledger_${k}`)).slice(-3).forEach(([k, e], i) => {
      const v = String(S().flag(`ledger_${k}`)), pay = e.chits?.[v] ?? 0;
      text(ctx, `${e.to}: ${e.what[v] ?? v}${pay ? `  +${pay}` : ""}`, D.side, 144 + i * 10, C.amber);
    });
    // the buttons (hotspots wait and close)
    for (const [label, [x, y, w, h]] of /** @type {[string, number[]][]} */ ([["WARTEN", D.buttons.wait], ["ZURÜCK", D.buttons.close]])) {
      ctx.fillStyle = C.steel3; ctx.fillRect(x, y, w, h);
      text(ctx, label, x + w / 2, y + 1, C.cyanPale, "center");
    }
  }

  // REC can be pressed while a scene in a feed plays (a moment is a script: clicks would only skip its
  // lines): a modal layer takes the click on the REC button then. Otherwise the room's `rec` hotspot does.
  Cutaway.ui.addLayer({
    z: 60, modal: true,
    click(/** @type {{x: number, y: number, button: number}} */ p) {
      if (!Cutaway.scene.room?.feed || !Cutaway.script.busy || p.button !== 0) return false;
      const [x, y, w, h] = Halcyon.osd.rec;
      if (p.x < x || p.x >= x + w || p.y < y || p.y >= y + h) return false;
      if (S().flag("rec_on")) S().unset("rec_on"); else S().set("rec_on");
      Cutaway.events.emit("sfx", { sfx: "rec" });
      return true;
    },
  });

  // Drawn after the room and its post-effects, before the interface (lines, hover labels, dialogue
  // choices stay on top): the engine's "frame.ui" moment.
  Cutaway.events.on("frame.ui", (/** @type {CanvasRenderingContext2D} */ ctx) => {
    const r = Cutaway.scene.room;
    if (!r || Cutaway.scene.backdrop) return;
    if (r.deck) deck(ctx);
    else if (r.feed) feed(ctx, r.feed);
    zoom(ctx);
  });
})();

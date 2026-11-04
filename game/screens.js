// Halcyon: what the deck and the feeds draw over their rooms (docs/style-guide.md §8–9,
// docs/kapitel0-design.md §2–3). The rooms hold the hotspots (so the solver sees every click); this
// layer only draws: the feeds' display (OSD), the implant's overlay and the zoom window (the deck is
// game/deck.js). A room says what it is: `feed: "cam03"` (a key of Halcyon.cams).
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
  /** The display's and the header's small capitals (the HUD font, game/font.js). Same arguments as text(). */
  function small(/** @type {CanvasRenderingContext2D} */ ctx, /** @type {string} */ t, /** @type {number} */ x, /** @type {number} */ y,
    /** @type {string} */ color, /** @type {"left" | "center" | "right"} */ align = "left") {
    Cutaway.font.get("hud").draw(ctx, t.toUpperCase(), x, y, { color, outline: C.ink, align });
  }
  /** Corner brackets round a box. @param {CanvasRenderingContext2D} ctx @param {number[]} b @param {string} color @param {number} [len] */
  function brackets(ctx, [x, y, w, h], color, len = 3) {
    ctx.fillStyle = color;
    const x2 = x + w, y2 = y + h;
    for (const [cx, cy, dx, dy] of [[x - 1, y - 1, 1, 1], [x2, y - 1, -1, 1], [x - 1, y2, 1, -1], [x2, y2, -1, -1]]) {
      ctx.fillRect(dx > 0 ? cx : cx - len + 1, cy, len, 1);
      ctx.fillRect(cx, dy > 0 ? cy : cy - len + 1, 1, len);
    }
  }
  const t = Halcyon.t;
  // the texts this layer draws (Halcyon.t translates them; declared for validate and the Texts tab)
  Cutaway.i18n.declare("feed display", ["UNBEKANNT", "CAM {id} // {place}", "CAM {id}", "LINK: J.REYES IMPLANTAT",
    "PUFFER", "REC", "VOR", "DECK", "CACHE {n}/8", "ZOOM x3"]);
  const blink = () => Math.floor(Cutaway.clock.time / 500) % 2 === 0;

  // ------------------------------------------------------------------ the feeds
  /** @param {CanvasRenderingContext2D} ctx @param {string} id */
  function feed(ctx, id) {
    const cam = Halcyon.cams[id];
    // the implant's overlay: tagged people in cyan, with what Juno knows about them
    for (const b of Cutaway.scene.boxes()) {
      if (!b.actor || !S().flag(`tag_${b.actor}`)) continue;
      brackets(ctx, b.box, C.implant);
      const p = Halcyon.people[b.actor], name = t(p && p.known && S().flag(p.known) ? p.name : "UNBEKANNT");
      // beside the head; near the top (under the display's lines) beside the feet instead
      small(ctx, name, b.box[0] + b.box[2] + 3, b.box[1] < 34 ? b.box[1] + b.box[3] - 6 : b.box[1] - 2, C.implant);
    }
    // the camera's display: who, where, whose (phosphor), the link (implant cyan)
    if (cam) {
      small(ctx, t("CAM {id} // {place}", { id: cam.id, place: t(cam.place) }), 4, 4, C.phosphorBright);
      small(ctx, t(cam.owner), 4, 12, C.phosphor);
      small(ctx, t("LINK: J.REYES IMPLANTAT"), 4, 20, C.implant);
    }
    small(ctx, Halcyon.stamp(), W - 4, 4, C.phosphorBright, "right");
    if (S().flag("rec_on") && blink()) { ctx.fillStyle = C.red; ctx.fillRect(W - 80, 4, 3, 3); }
    // the cameras Juno has linked: a column on the left, under the display's lines (a click switches:
    // hotspots `thumb_<cam>`; the rects are Halcyon.osd's)
    const O = Halcyon.osd;
    Object.keys(Halcyon.cams).forEach((c, i) => {
      if (!S().flag(`link_${c}`)) return;
      const [x, y, w, h] = O.thumb(i), live = c === id;
      ctx.fillStyle = live ? C.phosphorDim : C.ink; ctx.fillRect(x, y, w, h);
      small(ctx, t("CAM {id}", { id: Halcyon.cams[c].id }), x + w / 2, y + 3, live ? C.phosphorBright : C.phosphor, "center");
    });
    // the buttons under the time: buffer (only when it holds something Juno needs), REC, wait, deck
    const buttons = /** @type {[string, number[], boolean][]} */ ([["REC", O.rec, !!S().flag("rec_on")], ["VOR", O.wait, false], ["DECK", O.back, false]]);
    if (Cutaway.scene.hotspots().some((h) => h.id === "rewind")) buttons.unshift(["PUFFER", O.rewind, false]);
    for (const [label, [x, y, w, h], on] of buttons) {
      ctx.fillStyle = on ? C.red : C.ink; ctx.fillRect(x, y, w, h);
      small(ctx, t(label), x + w / 2, y + 3, on ? C.phosphorBright : C.implant, "center");
    }
    const n = Object.keys(Halcyon.cache).filter((k) => S().flag(`cache_${k}`)).length;
    small(ctx, t("CACHE {n}/8", { n }), 4, 28, C.implant);
  }

  // ------------------------------------------------------------------ the zoom window
  /** @param {CanvasRenderingContext2D} ctx */
  function zoom(ctx) {
    if (!Halcyon.zoom) return;
    const a = Cutaway.assets.get(Halcyon.zoom);
    if (!a) return;
    // street mode's close-ups (look_*, art/ui/looks.px.js): at their own size, in the interface's frame
    if (Halcyon.zoom.startsWith("look_")) {
      const f = a.frames[0], x = Math.round((W - f.w) / 2), y = Math.max(6, Math.round((150 - f.h) / 2));
      ctx.fillStyle = C.ink; ctx.fillRect(x - 3, y - 3, f.w + 6, f.h + 6);
      ctx.fillStyle = C.cyanDark; ctx.fillRect(x - 2, y - 2, f.w + 4, 1); ctx.fillRect(x - 2, y + f.h + 1, f.w + 4, 1);
      ctx.fillRect(x - 2, y - 2, 1, f.h + 4); ctx.fillRect(x + f.w + 1, y - 2, 1, f.h + 4);
      Cutaway.assets.draw(ctx, Halcyon.zoom, x, y, { anchor: [0, 0], t: Cutaway.clock.time });
      brackets(ctx, [x - 2, y - 2, f.w + 4, f.h + 4], C.cyan, 6);
      return;
    }
    const f = a.frames[0], w = f.w * 2, h = f.h * 2, x = Math.round((W - w) / 2), y = 34;
    ctx.fillStyle = C.ink; ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
    ctx.imageSmoothingEnabled = false;
    ctx.save(); ctx.translate(x, y); ctx.scale(2, 2);
    Cutaway.assets.draw(ctx, Halcyon.zoom, 0, 0, { anchor: [0, 0], t: Cutaway.clock.time });
    ctx.restore();
    brackets(ctx, [x - 2, y - 2, w + 4, h + 4], C.implant, 6);
    small(ctx, t("ZOOM x3"), x, y + h + 5, C.implant);
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

  // Drawn after the room and its post-effects, under the fade (room changes cover the deck and the
  // display too: game/transitions.js), before the interface (lines, hover labels, choices stay on top):
  // the engine's "frame.screen" moment.
  Cutaway.events.on("frame.screen", (/** @type {CanvasRenderingContext2D} */ ctx) => {
    const r = Cutaway.scene.room;
    if (!r || Cutaway.scene.backdrop) return;
    if (r.feed) feed(ctx, r.feed);
    zoom(ctx);
  });
})();

// Nagiwa: a camera's buffer played back (the user, 2026-11-19: rewinding is seen, and what was buffered really plays). In a script:
//   { rewind: "22:05" }   the picture rewinds to that time on the same game day: tracking bands run up through it, the display's time
//                         runs back with ◀◀ beside it; then everyone stands where their routines had them at that time in this room
//                         (Cutaway.time.routines), and the display says PUFFER and that time while the buffered scene plays
//   { live: true }        fast forward, back to the live picture: the time and the routines' places as they are now
// Between the two the scene is plain steps (the moment's own { replay }, or lines and walks), so the Schedule tab edits it where it is.
// Nothing here is state: positions and the shown time are looks (the solver runs the steps in fast mode, where nothing waits).
"use strict";

(function () {
  const W = 320, H = 180, REW = 1400, FF = 600;
  const C = { ink: "#0c0e1a", phosphor: "#8acfae", bright: "#d4f7e2", dim: "#388169", implant: "#3ff2ff" };
  /** @type {{at: number, now: number, phase: "rew" | "play" | "ff", t0: number} | null} */
  let buf = null;
  /** what the buffer is doing now, for the display (game/screens.js asks Nagiwa.stamp) */
  Nagiwa.buffer = () => buf;

  // the display's time: while rewinding it runs back from now to the buffer's time, then stays there (and runs on with the scene)
  const live = Nagiwa.stamp;
  /** @param {number} m minutes of the game day */
  const stampAt = (m) => {
    const n = Cutaway.time.now, [y, mo, d] = Nagiwa.day1, date = new Date(Date.UTC(y, mo - 1, d + n.day - 1 + (m >= 1440 ? 1 : 0)));
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")} ${Cutaway.time.format(m)}`;
  };
  const shown = () => {
    if (!buf) return null;
    const k = Math.min(1, (Cutaway.clock.time - buf.t0) / (buf.phase === "ff" ? FF : REW));
    if (buf.phase === "rew") return buf.now - (buf.now - buf.at) * k * k;
    if (buf.phase === "ff") return buf.at + (buf.now - buf.at) * k;
    return buf.at + Math.floor((Cutaway.clock.time - buf.t0) / 1000) / 60;
  };
  Nagiwa.stamp = function () { const m = shown(); return m === null ? live() : stampAt(Math.floor(m)); };

  /** everyone whose routine had them in this room at that time stands there; who wasn't there is gone (a look: places aren't state) */
  function placeAt(/** @type {string} */ room, /** @type {number} */ m) {
    const day = Cutaway.time.now.day, P = Cutaway.time.parse;
    for (const [id, list] of Cutaway.time.routines) {
      const a = Cutaway.actors.get(id);
      if (!a) continue;
      const e = list.find((x) => (x.day === undefined || (Array.isArray(x.day) ? x.day.includes(day) : x.day === day)) && P(x.from) <= m && m < P(x.to) && Cutaway.state.test(x.if));
      if (e && e.room === room) { const at = e.once && e.path?.length ? e.path[0] : e.at ?? e.path?.[0]; a.place(room, at ? at[0] : a.x, at ? at[1] : a.y, e.face); }
      else if (a.room === room) a.place(null, a.x, a.y);
    }
  }

  Cutaway.script.action("rewind", async (s) => {
    const room = Cutaway.scene.room?.id, at = Cutaway.time.parse(String(s.rewind)), now = Cutaway.time.now.minutes;
    if (!room || !Number.isFinite(at)) return;
    buf = { at, now, phase: "rew", t0: Cutaway.clock.time };
    Cutaway.events.emit("sfx", { sfx: "rewind" });
    await Cutaway.script.sleep(REW);
    placeAt(room, at);
    buf = { at, now, phase: "play", t0: Cutaway.clock.time };
  });
  Cutaway.script.action("live", async () => {
    if (!buf) return;
    buf = { ...buf, now: Cutaway.time.now.minutes, phase: "ff", t0: Cutaway.clock.time };
    Cutaway.events.emit("sfx", { sfx: "forward" });
    await Cutaway.script.sleep(FF);
    buf = null;
    Cutaway.time.reset(); Cutaway.time.apply();
  });
  // leaving the camera ends the playback (a script cut short, a click on DECK)
  Cutaway.events.on("room.entered", () => { if (buf) { buf = null; Cutaway.time.reset(); Cutaway.time.apply(); } });

  Cutaway.i18n.declare("feed display", ["PUFFER"]);
  /** two triangles side by side, pointing left (back) or right (on) */
  function arrows(/** @type {CanvasRenderingContext2D} */ ctx, x, y, back, color) {
    ctx.fillStyle = color;
    for (let k = 0; k < 2; k++) for (let i = 0; i < 4; i++) {
      const cx = x + k * 5 + (back ? i : 3 - i);
      ctx.fillRect(cx, y + 3 - i, 1, i * 2 + 1);
    }
  }
  // over the picture, under the display (this file is loaded before game/screens.js): the tape's tracking bands while it spools, a
  // thin one now and then while the buffer plays; ◀◀, PUFFER or ▶▶ before the time
  Cutaway.events.on("frame.screen", (/** @type {CanvasRenderingContext2D} */ ctx) => {
    const r = Cutaway.scene.room;
    if (!buf || !r || !r.feed || Cutaway.scene.backdrop) return;
    const el = Cutaway.clock.time - buf.t0, spool = buf.phase !== "play";
    const bands = spool ? [0, 61, 127] : el % 2600 < 180 ? [0] : [];
    for (const [i, o] of bands.entries()) {
      const y0 = Math.floor((((buf.phase === "ff" ? el * 0.32 : -el * 0.32) + o + 400 * i) % H + H) % H), h = Math.min(H - y0, spool ? 8 + (i % 2) * 5 : 3);
      // the band's picture slips sideways (the tape's tracking), darker; bright streaks of noise run through it
      const shift = (spool ? 6 : 3) * ((Math.floor(el / 60) + i) % 2 ? 1 : -1);
      ctx.drawImage(ctx.canvas, 0, y0, W, h, shift, y0, W, h);
      ctx.fillStyle = C.ink; ctx.globalAlpha = 0.35; ctx.fillRect(0, y0, W, h); ctx.globalAlpha = 1;
      for (let y = y0; y < y0 + h; y++) {
        let x = (y * 37 + Math.floor(el / 40) * 53) % 29
        while (x < W) { const len = 4 + ((x * 7 + y * 3) % 17); ctx.fillStyle = (x + y) % 5 ? C.phosphor : C.bright; ctx.globalAlpha = 0.55; ctx.fillRect(x, y, len, 1); x += len + 9 + ((x * 11 + y) % 23) }
        ctx.globalAlpha = 1;
      }
    }
    // the label left of the time (top right): its width from the font
    const hud = Cutaway.font.get("hud"), stampW = hud.measure(Nagiwa.stamp().toUpperCase()), x = W - 8 - stampW;
    if (spool) arrows(ctx, x - 11, 4, buf.phase === "rew", Math.floor(el / 200) % 2 ? C.bright : C.implant);
    else hud.draw(ctx, Nagiwa.t("PUFFER"), x, 4, { color: C.implant, outline: C.ink, align: "right" });
  });
})();

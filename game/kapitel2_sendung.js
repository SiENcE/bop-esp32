// Nagiwa: Lantern's broadcast at 01:00 on Monday (docs/kapitel2-design.md §8): every screen he reaches shows the Lower Ninth asleep,
// tonight, and his ticker runs under the picture. Played by the moment `protokolle` (game/kapitel2_ende.js) as plain steps: a goto to
// each shot, a wait, a glitch. Each shot is a room of its own that borrows a camera's picture without Juno's display (it is Lantern's
// picture, not hers: no buttons, no strip, no link), with nothing to click; `broadcast` names the shot, and this file draws the rest.
// Only cameras that are live tonight: CAM 14 has gone dark by Monday (game/kapitel2_quiet.js), CAM 51 is only ever an archive.
"use strict";

(function () {
const W = 320, H = 180, GREEN = "#7cff9a", INK = "#0c0e1a", BRIGHT = "#d4f7e2";
const t = Nagiwa.t;
// his voice as written (dialog-style-guide, Lantern: no names, "senden", she is "sie"); one line, the +++ between his sentences
const TICKER = "HIER IST LANTERN. WER DAS SIEHT, IST NOCH WACH. +++ SIE HAT GEMESSEN, WIE DIE HIER UNTEN SCHLAFEN. NACHT FÜR NACHT. +++ " +
  "SIE SCHLAFEN NICHT. +++ IHRE TABELLEN LIEGEN IM NETZ. FÜR ALLE. +++ SIE HAT GESAGT, SONST WEISS ES KEINER.";
Cutaway.i18n.declare("broadcast", [TICKER, "LANTERN", "LIVE", "LUCKY STATIC"]);
/** how fast the ticker runs, px a second: the moment's waits are timed so that it has run through by the last shot's end */
const SPEED = 50;

/** A shot: the camera room's picture (its background, props, light and post-effects), nothing to click.
 * @param {string} id @param {string} from the room whose picture it borrows @param {string} label @param {Record<string, any>} [o] */
function shot(id, from, label, o = {}) {
  const r = /** @type {any} */ (Cutaway.room.get(from));
  Cutaway.room(id, { name: label, background: r.background, color: r.color, props: r.props, light: r.light, post: r.post ?? Nagiwa.FEED_POST,
    observe: true, buttons: false, broadcast: label, ambience: ["feed_hiss"], music: { stop: true, fade: 200 }, hotspots: {}, ...o });
}
const cam = (/** @type {string} */ c) => t("CAM {id} // {place}", { id: Nagiwa.cams[c].id, place: t(Nagiwa.cams[c].place) });
shot("sendung_23", "cam23", cam("cam23"));
shot("sendung_15", "cam15", cam("cam15"));
// LUCKY STATIC's own camera over the counter: the bar's picture under the feed's filter (one place, one picture), closed, and the
// regular who sleeps on his arms still on his stool (in front of the counter, whose baseline lies below his feet: as a prop he needs his own)
const AI = Nagiwa.at.lucky_static;
shot("sendung_lucky", "lucky_static", "LUCKY STATIC", {
  props: [...AI.props, { id: "stamm_a", image: "stamm_a_idle_ne", at: AI.stammA, baseline: 176 }],
  post: [{ exposure: 1.5 }, ...Nagiwa.FEED_POST] });

// the ticker starts when the first shot comes, and runs on across the cuts
let since = 0, on = false;
Cutaway.events.on("room.entered", () => {
  const now = !!(/** @type {any} */ (Cutaway.scene.room)?.broadcast);
  if (now && !on) since = Cutaway.clock.time;
  on = now;
});

/** @param {CanvasRenderingContext2D} ctx @param {string} s @param {number} x @param {number} y @param {string} color @param {"left" | "center" | "right"} [align] */
const small = (ctx, s, x, y, color, align = "left") => Cutaway.font.get("hud").draw(ctx, s.toUpperCase(), x, y, { color, outline: INK, align });
Cutaway.events.on("frame.screen", (/** @type {CanvasRenderingContext2D} */ ctx) => {
  const r = /** @type {any} */ (Cutaway.scene.room);
  if (!r?.broadcast || Cutaway.scene.backdrop) return;
  // the camera's name and the time, as its own display would show them; LIVE with a dot that beats
  small(ctx, t(r.broadcast), 4, 4, BRIGHT);
  const stamp = Nagiwa.stamp(), f = Cutaway.font.get("hud");
  small(ctx, stamp, W - 4, 4, BRIGHT, "right");
  const lx = W - 8 - f.measure(stamp.toUpperCase());
  small(ctx, t("LIVE"), lx, 4, GREEN, "right");
  if (Math.floor(Cutaway.clock.time / 600) % 2 === 0) { ctx.fillStyle = GREEN; ctx.fillRect(lx - f.measure(t("LIVE").toUpperCase()) - 6, 5, 3, 3); }
  // the band: his name fixed on the left, the ticker running past it
  const by = H - 16, font = Cutaway.ui.font(), name = t("LANTERN"), nw = Cutaway.font.get("hud").measure(name.toUpperCase()) + 8;
  ctx.fillStyle = "rgba(12, 14, 26, 0.88)"; ctx.fillRect(0, by, W, 16);
  ctx.fillStyle = GREEN; ctx.fillRect(0, by, W, 1); ctx.fillRect(0, by + 1, nw, 15);
  Cutaway.font.get("hud").draw(ctx, name.toUpperCase(), nw / 2, by + 6, { color: INK, align: "center" });
  const x = Math.round(W - (Cutaway.clock.time - since) / 1000 * SPEED);
  ctx.save(); ctx.beginPath(); ctx.rect(nw + 2, by + 1, W - nw - 2, 15); ctx.clip();
  font.draw(ctx, t(TICKER), x, by + 5, { color: GREEN, outline: INK });
  ctx.restore();
});
})();

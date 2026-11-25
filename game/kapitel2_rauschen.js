// Nagiwa: Lantern's ten seconds on Sunday at ten as a clip (the user's decision, 2026-11-20; docs/kapitel2-design.md §3.5, L1–L2). They
// break into every channel; on the deck EVI records them wherever Juno is, noise and all, and the clip lies in her CACHE (cache_clip_lantern).
// Noise before it, noise after it, and between them "... Nagi·wa ... lügt ...". Only Juno can take it apart afterwards: PRÜFEN lays the
// noise from the start over the noise from the end (game/pruefen.js, kind "layers"). Alone each is noise; laid over, the noise cancels and
// leaves, very faint, what his own camera saw while he sent: trees standing in water and small green lights (the swamp's painting,
// art/rooms/sumpf.px.js, sumpf_bg). A click on a light: EVI says "Lantern?", and sends Juno to Ratz (know_sumpf, game/kapitel2_lantern.js).
//   cache_clip_lantern  EVI has recorded it (Sunday from 22:00; not in the runs that shut the way to Lantern, off_lantern)
//   know_sumpf          Juno has found the swamp under the noise
"use strict";

(function () {
const t = Nagiwa.t;
const E = (/** @type {string} */ text) => ({ say: "evi", text });

// ---- Sunday 22:00: watched at the deck, she sees it break in; anywhere else EVI says so from the bag. Either way it is in the CACHE
Cutaway.moment("lantern_rauschen", { room: "deck", day: 6, from: "22:00", to: "22:15", if: "!off_lantern",
  play: [{ sfx: "glitch" }, "Auf einmal rauscht alles. Jedes Fenster.", "Dann grüne Schrift: ... Nagi·wa ... lügt ...", "Und wieder Rauschen.",
    { evi: "froh" }, E("Hab ich! Alles aufgenommen, mit dem Rauschen."), { cache: "clip_lantern" }],
  unseen: [{ evi: "neugierig" }, E("Juno! Eben hat auf dem Deck alles gerauscht, auf allen Kanälen. Ich hab's aufgenommen."), { cache: "clip_lantern" }] });

Nagiwa.cache.clip_lantern = { kind: "clip", name: "RAUSCHEN, SO 22:00", about: "Zehn Sekunden, die in jeden Kanal eingebrochen sind. Rauschen, Nagi·wa lügt, Rauschen.",
  open: [{ if: ["day<8", "!know_sumpf", "!off_lantern"], then: [{ evi: "neugierig" }, E("Am Anfang rauscht es und am Ende auch. Genau gleich lang. Das ist komisch.")] }] };

// ---- the picture: the swamp his camera saw, from the painting's left part (the trees and his lanterns, not the caravan)
const CROP = [0, 20, 168, 96];
/** @type {Float32Array | null} the swamp's brightness, 0..1, around its own mean */
let swamp = null;
function hidden() {
  if (swamp || !Cutaway.assets.has("sumpf_bg")) return swamp;
  const c = document.createElement("canvas"); c.width = CROP[2]; c.height = CROP[3];
  const g = /** @type {CanvasRenderingContext2D} */ (c.getContext("2d"));
  Cutaway.assets.draw(g, "sumpf_bg", -CROP[0], -CROP[1], { anchor: [0, 0], t: 0 });
  const d = g.getImageData(0, 0, CROP[2], CROP[3]).data, out = new Float32Array(CROP[2] * CROP[3]);
  let sum = 0;
  for (let i = 0; i < out.length; i++) { out[i] = (0.25 * d[i * 4] + 0.6 * d[i * 4 + 1] + 0.15 * d[i * 4 + 2]) / 255; sum += out[i]; }
  const mean = sum / out.length;
  for (let i = 0; i < out.length; i++) out[i] -= mean;
  return (swamp = out);
}
const hash = (/** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ f) => ((Math.imul(x * 73856093 ^ y * 19349663 ^ f * 83492791, 2654435761) >>> 0) % 10007) / 10007 * 2 - 1;
const RAMP = Nagiwa.PHOSPHOR.map((h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)));
/** @type {Map<string, ImageData>} */
const buffers = new Map();
/** What a piece shows: 0 the noise at the start, 1 at the end, 2 both laid over (the noise cancels, the swamp is left, faint); "text"
 * the ten seconds between, green on black. @param {CanvasRenderingContext2D} ctx @param {0 | 1 | 2 | "text"} which */
function picture(ctx, which, /** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ w, /** @type {number} */ h) {
  if (which === "text") {
    ctx.fillStyle = Nagiwa.PHOSPHOR[0]; ctx.fillRect(x, y, w, h);
    Cutaway.ui.font().draw(ctx, t("... Nagi·wa ... lügt ..."), x + w / 2, y + h / 2 - 4, { color: "#7cff9a", outline: Nagiwa.PHOSPHOR[0], align: "center" });
    return;
  }
  const s = hidden(), f = Math.floor(Cutaway.clock.time / 70), key = `${w}x${h}`;
  let img = buffers.get(key);
  if (!img) { img = ctx.createImageData(w, h); buffers.set(key, img); }
  const d = img.data;
  for (let j = 0; j < h; j++) {
    const tear = hash(0, j, f >> 2) > 0.86 ? 0.25 : 0;                    // a torn line now and then, as noise has
    for (let i = 0; i < w; i++) {
      const sx = Math.floor(i * CROP[2] / w), sy = Math.floor(j * CROP[3] / h), under = s ? s[sy * CROP[2] + sx] : 0;
      const n = hash(i, j, f), rest = hash(i + 101, j + 37, f) * 0.2;
      // his carrier is the same noise turned over at the end: start + end cancel, and what is under both is all that stays
      let v = which === 2 ? 0.4 + under * 1.05 + rest : 0.5 + (which === 0 ? n : -n) * 0.46 + under * 0.07 + tear;
      v = Math.max(0, Math.min(0.999, v));
      const [r, g, b] = RAMP[Math.floor(v * RAMP.length)], k = (j * w + i) * 4;
      d[k] = r; d[k + 1] = g; d[k + 2] = b; d[k + 3] = 255;
    }
  }
  ctx.putImageData(img, x, y);
}
Cutaway.i18n.declare("deck", ["... Nagi·wa ... lügt ...", "RAUSCHEN", "ANFANG", "ENDE"]);

// ---- in the clip editor: ten seconds of one hour, noise, the words, noise. Nobody in it Juno could name
Nagiwa.clips.clip_lantern = { where: "ALLE KANÄLE", hour: 22, from: 0, to: 0.17, check: "rauschen",
  picture: (ctx, x, y, w, h) => picture(ctx, Math.floor(Cutaway.clock.time / 1600) % 3 === 1 ? "text" : Math.floor(Cutaway.clock.time / 1600) % 3 === 0 ? 0 : 1, x, y, w, h),
  moments: [[0, 0.04, "RAUSCHEN"], [0.04, 0.13, "NAGI·WA LÜGT"], [0.13, 0.17, "RAUSCHEN"]], people: [] };
Cutaway.i18n.declare("deck", ["ALLE KANÄLE", "NAGI·WA LÜGT"]);

// ---- PRÜFEN: the noise from the start over the noise from the end. The lights are his lanterns in the painting (Nagiwa.at.sumpf.lanterns,
// those inside the crop, in the picture's own pixels)
const SPOTS = Nagiwa.at.sumpf.lanterns.filter(([lx, ly]) => lx >= CROP[0] + 6 && lx < CROP[0] + CROP[2] - 6 && ly >= CROP[1] + 6 && ly < CROP[1] + CROP[3] - 6)
  .map(([lx, ly]) => [lx - CROP[0], ly - CROP[1]]);
Nagiwa.checks.rauschen = { kind: "layers", title: "RAUSCHEN", if: ["cache_clip_lantern", "day<8"], done: "know_sumpf", clip: "clip_lantern",
  lanes: ["ANFANG", "ENDE"], name: "Grünes Licht", spots: SPOTS, picture,
  alone: ["Nur Rauschen. Aber es rauscht gleichmäßig. Zu gleichmäßig."],
  laid: ["Ich leg das Rauschen vom Anfang über das vom Ende.", "Es hebt sich auf. Darunter ist ein Bild, ganz blass.", { evi: "neugierig" }, E("Da ist was! Siehst du die hellen Punkte?")],
  miss: ["Dunkle Streifen, senkrecht. Stämme vielleicht."],
  found: [
    "Lichter. Kleine grüne Lichter, in Bäumen.", "Und die Bäume stehen im Wasser.",
    { evi: "froh" }, E("Grüne Laternen. Lantern?"),
    "Das hat er nicht gewollt. Seine eigene Kamera, ganz unten im Rauschen.",
    "Aber wo gibt's hier unten Bäume?",
    E("Nirgends. Draußen vielleicht, wo die Ringe aufhören."),
    E("Frag Ratz. Ratz kennt jeden Weg, der unter der Stadt rausgeht."),
    { set: "know_sumpf" },
  ],
  again: ["Bäume im Wasser und grüne Lichter. Das ist draußen, wo die Ringe aufhören."] };
})();

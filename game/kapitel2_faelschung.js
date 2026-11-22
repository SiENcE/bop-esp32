// Nagiwa: Chapter 2, the forgery (docs/kapitel2-design.md §3.4). On Sunday at six Nagi·wa's news show a clip from CAM 31 in which a
// man in a wheelchair kills Ines, "ein Mann, der sich LANTERN nennt" (Nagi·wa doesn't know he runs a pirate station: the user, 2026-11-19). EVI finds it as the evening begins and puts it into the CACHE,
// so it costs no state of its own; PRÜFEN (game/pruefen.js) lays it beside Juno's own recording:
//   cache_clip_forgery   from Sunday 18:00, for everyone
//   forgery_cuts         the places found so far, in their order: 1 the time stamp, 2 the rain. A view: how far Juno has got doesn't matter
//                        to the story, only the end of it, and as state it multiplied every state from Sunday by four
//   forgery_proven       all three, and the note "Die Fälschung, zerschnitten" (handed on: Morrow in Chapter 4; Sable, Morrow and Lantern in
//                        decision 2, §3.6, when those are built)
// From Sunday Juno knows his name, since the news say it; before, he is the one from the metro (game/kapitel2_stick.js).
// The pictures are CAM 31's painted picture and its feed figures, put together in code (a dark wheelchair where Ashe stands, the loop in the
// rain): the user found that enough, 2026-11-19, so it stays reused rather than painted again
"use strict";

(function () {
const A31 = Nagiwa.at.cam31, G = () => Nagiwa.deckDraw;

Nagiwa.cache.clip_forgery = { kind: "clip", name: "NAGI·WA NEWS, CAM 31", about: "Nagi·was Clip aus der alten Metro: Der Rollstuhl steht vor ihr, dann liegt sie da. Ohne Ton." };
Nagiwa.cache.note_forgery = { kind: "note", name: "DIE FÄLSCHUNG, ZERSCHNITTEN", about: "23:01:58 springt auf 23:03:10. Der Regen läuft in einer Schleife. Wo das Bild durchbrennen müsste, ist es dunkel." };
Nagiwa.people.lantern_news = { name: "LANTERN" };

// ---- the pictures: the platform's edge in CAM 31, who stands where under each of the check's marks, in the feed's phosphor
// the part of CAM 31's picture both clips show under each mark (art/cams/cam31.px.js: 320x180): the platform's edge, then closer on the two
const CUT = [[80, 63], [80, 63], [80, 63], [58, 40]];
const OFF = [A31.lantern[0] + 16, A31.lantern[1] - 7];  // where he is as he drives off towards the tunnel
const OUT = [A31.asheMeet[0] + 3, A31.asheMeet[1] + 11]; // where the other one has stepped out of the stairs' shadow
/** under each mark, each picture (0 the forgery, 1 hers): [sprite, place, dark] */
/** @type {[string, number[], boolean?][][][]} */
const SHOTS = [
  [[["ines_feed_give", A31.edge], ["lantern_feed_l", A31.lantern]], [["ines_feed_give", A31.edge], ["lantern_feed_l", A31.lantern]]],
  [[["ines_feed_front", A31.edge], ["lantern_feed_l", A31.lantern]], [["ines_feed_front", A31.edge], ["lantern_feed_drive_r", OFF]]],
  [[["ines_feed_front", A31.edge], ["lantern_feed_l", A31.lantern]], [["ines_feed_back", A31.edge], ["ashe_feed_dim", OUT]]],
  [[["ines_feed_back", A31.meet], ["lantern_feed_r", A31.asheMeet, true]], [["ines_feed_back", A31.meet], ["ashe_feed", A31.asheMeet]]],
];
/** the time stamp each picture shows under each mark (the forgery's jumps at the cut, and runs a minute and twelve seconds ahead after it) */
const STAMPS = [["23:01:30", "23:01:30"], ["23:01:58", "23:01:58"], ["23:03:42", "23:02:30"], ["23:04:15", "23:03:03"]];
/** @type {Map<string, HTMLCanvasElement>} */
const made = new Map();
/** the still part of a picture, once: CAM 31's picture cut out, the figures on it, everything brought to the phosphor's ten values
 * @param {0 | 1} side @param {number} mark @param {number} w @param {number} h */
function still(side, mark, w, h) {
  const key = `${side}:${mark}:${w}x${h}`;
  if (made.has(key)) return /** @type {HTMLCanvasElement} */ (made.get(key));
  const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
  const g = /** @type {CanvasRenderingContext2D} */ (cv.getContext("2d")); g.imageSmoothingEnabled = false;
  const ox = CUT[mark][0] + Math.round((112 - w) / 2), oy = CUT[mark][1];
  if (Cutaway.assets.has("cam31_bg")) Cutaway.assets.draw(g, "cam31_bg", -ox, -oy, { anchor: [0, 0], frame: 0 });
  for (const [name, [x, y], dark] of SHOTS[mark][side]) {
    if (!Cutaway.assets.has(name)) continue;
    if (!dark) { Cutaway.assets.draw(g, name, x - ox, y - oy, { frame: 0 }); continue; }
    // the wheelchair where the white coat should be: dark, nothing outshines it
    const t = document.createElement("canvas"); t.width = w; t.height = h;
    const tg = /** @type {CanvasRenderingContext2D} */ (t.getContext("2d")); tg.imageSmoothingEnabled = false;
    Cutaway.assets.draw(tg, name, x - ox, y - oy, { frame: 0 });
    tg.globalCompositeOperation = "source-atop"; tg.fillStyle = "rgba(0, 0, 0, 0.45)"; tg.fillRect(0, 0, w, h);
    g.drawImage(t, 0, 0);
  }
  const img = g.getImageData(0, 0, w, h), d = img.data, P = Nagiwa.PHOSPHOR.map((c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)));
  for (let i = 0; i < d.length; i += 4) {
    const l = (0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]) / 255, [r, gg, b] = P[Math.min(9, Math.floor(l * 10))];
    d[i] = r; d[i + 1] = gg; d[i + 2] = b; d[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  made.set(key, cv);
  return cv;
}
/** A picture of the check: the still, the rain over it (in the forgery under the third mark a loop: the same drops again and again), the
 * mask burning white over his head in hers, the time stamp (not in the clip editor, which has its own WANN). @param {CanvasRenderingContext2D} ctx
 * @param {0 | 1} side @param {number} mark @param {number} x @param {number} y @param {number} w @param {number} h @param {boolean} [bare] */
function picture(ctx, side, mark, x, y, w, h, bare = false) {
  ctx.drawImage(still(side, mark, w, h), x, y);
  const loop = side === 0 && mark === 2, now = loop ? Cutaway.clock.time % 640 : Cutaway.clock.time;
  ctx.fillStyle = "#55a585";
  for (let i = 0; i < 26; i++) {
    const sx = (Math.imul(i + 7 * side, 2654435761) >>> 0) % w, fall = 0.09 + ((i * 37) % 11) / 200;
    const sy = Math.floor(((Math.imul(i + 3, 40503) >>> 0) % h + now * fall) % h);
    ctx.fillRect(x + sx, y + sy, 1, 3);
  }
  if (side === 1 && mark === 3) {                              // the mask outshines the camera
    const [ax, ay] = [A31.asheMeet[0] - CUT[mark][0] - Math.round((112 - w) / 2), A31.asheMeet[1] - CUT[mark][1] - 24];
    ctx.fillStyle = "#8acfae"; ctx.beginPath(); ctx.arc(x + ax, y + ay, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#d4f7e2"; ctx.beginPath(); ctx.arc(x + ax, y + ay, 5, 0, Math.PI * 2); ctx.fill();
  }
  if (bare) return;
  // the forgery's stamp jumps at the cut
  const stamp = side === 0 && mark === 1 && Math.floor(Cutaway.clock.time / 700) % 2 ? "23:03:10" : STAMPS[mark][side];
  G().small(ctx, stamp, x + w - 2, y + 2, "#d4f7e2", "right");
}

// ---- both clips in the clip editor (hers opens there now too: until Chapter 2 nothing could be done with it)
// Her whisper (where the key lies) can be cut out of it before she gives it away (kapitel2-design §3.1, decision 2): a cut that takes a
// moment out (drop) and makes the clip without it, clip_ines_cut; once decision 2 has fallen there is nothing left to cut for
Nagiwa.clips.clip_ines_death = { cam: "cam31", hour: 23, from: 0.5, to: 4, check: "faelschung",
  picture: (ctx, x, y, w, h) => picture(ctx, 1, 0, x, y, w, h, true),
  moments: [[0.5, 1.6, "ÜBERGABE"], [1.6, 1.97, "FLÜSTERN"], [1.97, 2.4, "WEG"], [2.4, 3.05, "SCHATTEN"], [3.05, 4, "STURZ"]],
  people: [["ines", 0.5, 3.1], ["lantern", 0.5, 2.1], ["ashe", 2.3, 4]],
  cut: { moment: 1, drop: true, gives: "clip_ines_cut", if: ["!e2", "!off_main", "!off_lantern"], then: ["Ich schneid das Flüstern raus. Dann weiß keiner von der Sechs.",
    { evi: "neugierig" }, { say: "evi", text: "Aber du weißt es noch. Und ich auch." }] } };
// (its CACHE entry: game/kapitel2.js, which reads its name first)
Nagiwa.clips.clip_ines_cut = { cam: "cam31", hour: 23, from: 0.5, to: 4,
  picture: (ctx, x, y, w, h) => picture(ctx, 1, 0, x, y, w, h, true),
  moments: [[0.5, 1.6, "ÜBERGABE"], [1.97, 2.4, "WEG"], [2.4, 3.05, "SCHATTEN"], [3.05, 4, "STURZ"]],
  people: [["ines", 0.5, 3.1], ["lantern", 0.5, 2.1], ["ashe", 2.3, 4]] };
Nagiwa.clips.clip_forgery = { cam: "cam31", hour: 23, from: 0.5, to: 4, check: "faelschung",
  picture: (ctx, x, y, w, h) => picture(ctx, 0, 0, x, y, w, h, true),
  moments: [[0.5, 1.97, "TREFFEN"], [1.97, 4, "TAT"]],
  people: [["ines", 0.5, 3.1], ["lantern_news", 0.5, 4]] };

// ---- PRÜFEN: the forgery beside her own, three places in their order (§3.4)
Cutaway.state.view("forgery_cuts");
Cutaway.i18n.declare("deck", ["FÄLSCHUNG", "NEWS", "PUFFER", "ZEITSTEMPEL", "REGEN", "LICHT", "01:30", "01:58", "02:30", "03:03"]);
Nagiwa.checks.faelschung = { kind: "clips", title: "FÄLSCHUNG", if: ["cache_clip_forgery", "cache_clip_ines_death"], done: "forgery_proven",
  a: "clip_forgery", b: "clip_ines_death", lanes: ["NEWS", "PUFFER"], picture, counter: "forgery_cuts",
  marks: [{ at: 1.5, label: "01:30" }, { at: 1.97, label: "01:58" }, { at: 2.5, label: "02:30" }, { at: 3.05, label: "03:03" }],
  finds: [
    { id: "zeit", mark: 1, side: 0, rect: [64, 0, 48, 10], name: "ZEITSTEMPEL", says: [
      "Bei 23:01:58 springt die Uhr in den Nachrichten auf 23:03:10.",
      "Da fehlt mehr als eine Minute. Genau die, in der er wegfährt."] },
    { id: "regen", mark: 2, side: 0, rect: [0, 10, 112, 58], name: "REGEN", says: [
      "Der Regen ruckelt. Dieselben Tropfen fallen immer wieder an dieselbe Stelle.",
      "Die Lücke haben sie mit einer Schleife geflickt."] },
    { id: "licht", mark: 3, side: 0, rect: [26, 26, 26, 26], name: "LICHT", says: [
      "Bei mir brennt da das Bild weiß durch, wo sein Gesicht sein müsste.",
      "Bei denen steht da ein dunkler Rollstuhl, und nichts leuchtet."] },
  ],
  early: ["Da ist was anders. Aber ich geh der Reihe nach, sonst übersehe ich was."],
  again: ["Das hab ich schon."],
  miss: ["Da find ich nichts, was ich zeigen kann."],
  last: [{ set: "forgery_proven" }, { cache: "note_forgery" },
    { evi: "neugierig" }, { say: "evi", text: "Drei Stellen. Das sind keine Fehler mehr, oder?" },
    "Nein. Das hat jemand so gemacht.",
    "Lantern war schon weg. Das kann ich zeigen."] };

// ---- Sunday, 18:00: as the evening begins, EVI has found the news. Juno always wakes in her flat, so everyone sees it and it costs nothing;
// it plays once the evening's card is gone (Nagiwa.nights[6].wake), and as its window ends it only makes sure the clip is there
Cutaway.moment("faelschung", { room: "flat", day: 6, from: "18:00", to: "18:15", if: "~never", play: [
  { evi: "besorgt" },
  { say: "evi", text: "Juno? In den Nachrichten ist die alte Metro." },
  { say: "evi", text: "Sie zeigen einen Clip aus CAM 31. Ich hab ihn dir in den CACHE gelegt." },
  { cache: "clip_forgery" },
  "Den seh ich mir am Deck an.",
], unseen: [{ cache: "clip_forgery" }] });
Nagiwa.nights[6].wake = [{ replay: "faelschung" }];
// what Juno sees in it and what EVI tells of the news, the first time she opens it in the clip editor (the user's wish, 2026-11-18: not
// before she has looked); whether it was said is a view, as EVI reading the headline: it changes nothing a click does
Cutaway.state.view("forgery_seen");
Nagiwa.cache.clip_forgery.open = [{ if: "!forgery_seen", then: [{ set: "forgery_seen" },
  "Ein Rollstuhl steht vor ihr, und dann liegt sie da. Es ist kein Ton dabei.",
  { evi: "besorgt" },
  { say: "evi", text: "Sie sagen, er heißt Lantern." },
  { say: "evi", text: "Und dass er sie getötet hat." },
  { if: "e1=sold", then: ["Das ist mein Bild. Die haben mein Bild genommen."], else: ["Das ist nicht mein Bild. Dann war noch jemand an CAM 31."] },
  "Lantern war schon weg, als es passiert ist. Ich hab's doch gesehen.",
  { evi: "verwirrt" },
  { say: "evi", text: "Dann ist der Clip falsch?" },
  "Das müssen wir erst beweisen können."] }];

// ---- the news, every evening: NETZ (here), the TV in LUCKY STATIC (game/lucky_static.js) and the radio (game/radio.js) (§7)
Object.assign(Nagiwa.netzPages, {
  metro: { title: "TOTE IN DER ALTEN METRO", label: "Tote in der alten Metro", up: "nagiwa", by: "Nagi·wa Sicherheit", text: [
    "In der alten Metro, Linie 31, ist in der Nacht zum Samstag eine Frau tot aufgefunden worden.",
    "Revier 9 ermittelt. Für die Bürger des Neunten besteht keine Gefahr.",
    "Nagi·wa dankt Ihnen für Ihre Ruhe."] },
  faelschung: { title: "NEUE BILDER AUS DER ALTEN METRO", label: "Neue Bilder aus der alten Metro", up: "nagiwa", by: "Nagi·wa Sicherheit", text: [
    "Revier 9 veröffentlicht Bilder aus der alten Metro, Linie 31.",
    "Sie zeigen, wie ein Mann im Rollstuhl die Ärztin Dr. Ines Calder tötet.",
    "Der Mann nennt sich LANTERN.",
    "Revier 9 bittet um Ihre Mithilfe. Ihre Hinweise werden vertraulich behandelt."] },
  fahndung: { title: "FAHNDUNG: LANTERN", label: "Fahndung nach LANTERN", up: "nagiwa", by: "Nagi·wa Sicherheit", text: [
    "Revier 9 sucht einen Mann, der sich LANTERN nennt.",
    "Er gilt als gefährlich. Bitte sprechen Sie ihn nicht an.",
    "Hinweise nimmt Revier 9 jederzeit entgegen. Nagi·wa dankt Ihnen für Ihre Mithilfe."] },
  linie31: { title: "WAS WAR IN LINIE 31?", label: "Was war gestern in Linie 31?", up: "brett", posts: [
    { by: "anonym", text: "Was war gestern in Linie 31? Da hängt jetzt Band von Revier 9." },
    { by: "K.", text: "Da fährt seit Jahren nichts mehr. Wer geht da runter?" },
    { by: "anonym", text: "Eine Ärztin, sagen sie. Von der Klinik." },
    { by: "K.", text: "Was will eine Ärztin in der alten Metro?" }] },
});
Nagiwa.netzPages.nagiwa.rows?.push({ page: "metro", if: "day>4" }, { page: "faelschung", if: "day>5" }, { page: "fahndung", if: "day>6" });
Nagiwa.netzPages.brett.rows?.push({ page: "linie31", if: "day>4" });
Nagiwa.netzPages.vater.posts?.push({ by: "L., Kowalski-Straße", text: "Sie sagen, er ist jetzt auf einer Station. Besuchen darf man nicht.", if: "day>4" });
Nagiwa.netz.push(
  { kind: "head", slot: 0, page: "metro", if: "day=5", text: "Tote in der alten Metro. Revier 9 ermittelt." },
  { kind: "board", slot: 2, page: "linie31", if: "day=5", text: "Was war gestern in Linie 31?", by: "anonym" },
  { kind: "head", slot: 0, page: "faelschung", if: "day=6", text: "Neue Bilder aus der alten Metro: Es war ein Mann, der sich LANTERN nennt." },
  { kind: "board", slot: 2, page: "vater", if: "day=6", text: "Sie sagen, er ist jetzt auf einer Station. Besuchen darf man nicht.", by: "L., Kowalski-Straße" },
  { kind: "head", slot: 0, page: "fahndung", if: "day=7", text: "Fahndung nach LANTERN. Hinweise an Revier 9." },
  { kind: "sub", slot: 1, page: "faelschung", if: "day=7", text: "Die Bilder aus der alten Metro." });
// EVI reads the headline once an evening (a view, as in Chapter 1: game/kapitel1_leben.js); on Sunday she has told Juno already
(Nagiwa.appOpen.netz ??= []).push(
  { if: ["day=5", "netz_read<5"], then: [{ set: "netz_read", value: 5 }, { evi: "neugierig" }, { say: "evi", text: "Da steht nicht, wer die Frau war." }, "Ich weiß, wer sie war. Ungefähr."] },
  { if: ["day=7", "netz_read<7"], then: [{ set: "netz_read", value: 7 }, { evi: "besorgt" }, { say: "evi", text: "Jetzt suchen sie ihn überall. Auch auf meinem Bildschirm." }, "Ich weiß."] });
})();

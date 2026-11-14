// Nagiwa: the end of Chapter 1 (docs/kapitel1-design.md §8). Juno watches Ines die in cam31 and everything she tries
// fails where the player can see it. One straight chain, so the solver gains a handful of states:
//   end_beat     unknown (the overlay says ???) > threat (the player's hands are free, and nothing helps) > kill > look > after (her flat)
//   ines_down    Ines lies on the platform
//   cache_clip_ines_death   Juno has it, whether she pressed REC or not: the buffer holds it
// The clock leaves its 15-minute ticks here, which is safe only because nothing branches on these times (kapitel1.js: the hold).
// The threat runs in real time, but nothing needs that: the clock's next step (the VOR button, the solver's wait) goes on as well.
"use strict";

(function () {
const A = Nagiwa.at.cam31, AF = Nagiwa.at.flat;

// Story §10: every drastic scene comes in two versions, the same story with a different picture
Cutaway.settings.define("violence", { page: "content", pageLabel: "Inhalt", label: "Gewalt",
  options: [["bars", "mit Balken"], ["shown", "gezeigt"]], default: "bars" });

// ---- the people. Ashe has no face in the feed: the mask outshines the camera
Nagiwa.people.ashe = { name: "???" };
Cutaway.actor("ashe", { name: "???", color: "#ff7a6a", speed: [5, 2.5], voice: { pitch: 50, wave: "sine", syllable: 90 },
  costume: { idle: "ashe_feed", walk: "ashe_feed_walk", talk: "ashe_feed" },
  poses: [{ if: "end_beat=look", idle: "ashe_feed_look", walk: "ashe_feed_look", talk: "ashe_feed_look" },
    // in the stairs' shadow only the mask is there, until he steps out of it (see the threat below)
    { if: "!ashe_lit", idle: "ashe_feed_dim", walk: "ashe_feed_dim_walk", talk: "ashe_feed_dim" }],
  look: ["Er hat kein Gesicht. Da, wo eins sein müsste, brennt mir das Bild durch."],
  talk: ["Die Markierung rutscht ab. Da ist nichts, woran sie hängen bleibt."] });
Cutaway.routine("ashe", [{ day: 4, from: "23:02", to: "23:30", room: "cam31", at: A.shadow, face: "se" }]);
// only how he looks while he walks, and only a real clock walks him: no state for the solver
Cutaway.state.view("ashe_lit");
const SHADOW_ENDS = 74;   // where the lamp's light begins on his way (art/cams/cam31.px.js: the stairs' long cheek hides it from the lamp up to here, and hides him from Ines and Lantern)

Nagiwa.cache.clip_ines_death = { kind: "clip", name: "CAM 31, 23:03", about: "Die alte Metro. Alles, bis er hochsieht." };
Object.assign(Nagiwa.ledger, { ines: { to: "Ines Calder", what: { dead: "tot" } } });
Nagiwa.threads.wren.push({ from: "wren", if: "ledger_wren_live", at: "23:05", text: "Zahlung erfolgt. Danke für die Live-Übertragung." });

// ---- the overlay tries to mark him (game/screens.js draws Nagiwa.links)
Nagiwa.links.push(
  { actor: "ashe", if: "end_beat=unknown", label: "???", color: "implant" },
  { actor: "ashe", if: { or: ["end_beat=threat", "end_beat=kill"] }, label: "BEDROHUNG", color: "red" },
);

// ---- the picture: older than every other camera's, and it tears. What the scene does to it isn't state: it is only the look of a script
const fx = { tear: 0, bars: 0 };
const hash = (/** @type {number} */ a, /** @type {number} */ b) => { let h = Math.imul(a, 374761393) + Math.imul(b, 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const moving = () => Cutaway.settings.values.motion !== false;
Cutaway.events.on("room.enter", () => { fx.tear = 0; fx.bars = 0; Nagiwa.feedFails = {}; });

// the old tube's flicker, before the phosphor ramp, so it stays on the ramp
Cutaway.post.add("old_tube", (/** @type {any} */ px, /** @type {any} */ o, /** @type {number} */ t) => {
  const r = hash(Math.floor(t / 110), 7), k = moving() && r > 0.86 ? 1 - Number(o.old_tube) * (r - 0.86) / 0.14 : 1;
  if (k < 1) for (let i = 0; i < px.data.length; i += 4) { px.data[i] *= k; px.data[i + 1] *= k; px.data[i + 2] *= k; }
});
// rows torn sideways, and the black bars closing over the picture (under the display: its clock runs on)
Cutaway.post.add("cam31_break", (/** @type {any} */ px, /** @type {any} */ _o, /** @type {number} */ t) => {
  const { data, w, h } = px;
  if (fx.tear > 0 && moving()) {
    const f = Math.floor(t / 60), row = new Uint8ClampedArray(w * 4);
    for (let y = 0; y < h; y++) {
      if (hash(Math.floor(y / 3), f) > fx.tear * 0.75) continue;
      const by = Math.round((hash(Math.floor(y / 3) + 91, f) - 0.5) * 70 * fx.tear), at = y * w * 4;
      row.set(data.subarray(at, at + w * 4));
      for (let x = 0; x < w; x++) for (let c = 0; c < 4; c++) data[at + x * 4 + c] = row[((x - by + w * 2) % w) * 4 + c];
    }
  }
  const b = Math.round(fx.bars * h / 2);
  if (b > 0) for (let y = 0; y < h; y++) if (y < b || y >= h - b) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4; data[i] = 3; data[i + 1] = 10; data[i + 2] = 10; }
});
// the display twitches with the picture
Nagiwa.feedJitter = () => (fx.tear > 0.3 && moving() ? Math.round((hash(Math.floor(Cutaway.clock.time / 60), 3) - 0.5) * 6) : 0);

// { cam31_fx: { tear: 1 }, ms: 600 } moves the picture's break there and waits
Cutaway.script.action("cam31_fx", (s) => {
  const from = { ...fx }, to = s.cam31_fx;
  return Cutaway.tween.to({ key: "cam31_fx", ms: s.ms, step: (/** @type {number} */ k) => { for (const n of Object.keys(to)) /** @type {any} */ (fx)[n] = /** @type {any} */ (from)[n] + (to[n] - /** @type {any} */ (from)[n]) * k; } });
});
// { osd_fail: "try_chat", text: "NICHT ZUGESTELLT" } the button says so from now on (only the look: not saved)
Nagiwa.feedFails = {};
Cutaway.script.action("osd_fail", (s) => { Nagiwa.feedFails[s.osd_fail] = s.text; });
Cutaway.i18n.declare("feed display", ["KEIN ZUGRIFF", "NICHT ZUGESTELLT", "KEIN LAUTSPRECHER", "WIRD BEARBEITET", "STEUERN", "CHAT: INES", "LAUTSPRECHER", "REVIER 9", "SIGNAL LOST", "???", "BEDROHUNG"]);

// ---- 22:55 to 23:02: she comes, he comes, and then someone else
Cutaway.moment("ines_meeting", { room: "cam31", day: 4, from: "22:45", to: "23:30", play: [
  { tag: "ines" },
  { time: "22:55" },
  { walk: "ines", to: A.stairs, free: true },
  { walk: "ines", to: A.edge, face: "se", free: true },
  { if: "e1=refused", then: ["Ines. Geh nach Hause.", { sfx: "static", gain: 0.4 }, { narrate: "NICHT ZUGESTELLT" }], else: ["Da ist sie, pünktlich."] },
  { time: "23:00" },
  { walk: "lantern", to: A.lantern, face: "nw", free: true },
  { say: "ines", text: "Es ist alles drauf. Die Protokolle passen auf die Sekunde." },
  { say: "lantern", text: "Wenn das stimmt ..." },
  { say: "ines", text: "Es stimmt. Sie schlafen nicht. Sie arbeiten." },
  { set: "ines_gives" },
  "Sie gibt ihm was, eine Wallet.",
  { unset: "ines_gives" },
  // the key is never said aloud: the mic hangs beside her, the man in the shadow is too far off to hear a whisper, and WREN's live feed is picture only (story §10b)
  { say: "lantern", text: "Und der Schlüssel ...?" },
  "Sie beugt sich runter. Sie flüstert.",
  { say: "ines", text: "SUDS & SPIN. Trockner sechs, der kaputte." },
  { say: "ines", text: "Sonst weiß es keiner." },
  "Doch. Ich.",
  { if: "stick_ines", then: ["Und er liegt in meiner Tasche."] },
  // he has what he came for and goes, and sees nothing: what waits stands behind the stairs' cheek. So he is never the man who left her to it
  { sfx: "motor" }, { walk: "lantern", to: A.tunnel, free: true },
  { cam31_fx: { tear: 0.3 }, ms: 120 }, { time: "23:02" }, { cam31_fx: { tear: 0 }, ms: 150 },
  { wait: 1400 },
  { set: "end_beat", value: "unknown" }, { sfx: "tag" },
  "Wer ist das?",
  { wait: 900 },
  { set: "end_beat", value: "threat" }, { sfx: "glitch", gain: 0.5 }, { music: { intensity: 0.7 } },
  "Sie sieht ihn nicht.",
] });

// ---- what Juno tries: all of it answers, and none of it helps
const TRIES = /** @type {[string, string, string, string, any[]][]} */ ([
  ["try_steuern", "Steuern", "STEUERN", "KEIN ZUGRIFF", ["Kein Licht. Keine Tür. Hier gibt's nichts zu steuern."]],
  ["try_chat", "Ines anschreiben", "CHAT: INES", "NICHT ZUGESTELLT", ["Nicht die Treppe. Nicht die Treppe."]],
  ["try_speaker", "Lautsprecher", "LAUTSPRECHER", "KEIN LAUTSPRECHER", ["Das Ding ist älter als ich. Es kann nur gucken."]],
  ["try_revier", "Revier 9", "REVIER 9", "WIRD BEARBEITET", ["Revier 9. Ein Mord, jetzt gleich, alte Metro, Linie 31.", { narrate: "Ihre Meldung wird bearbeitet." }]],
]);
/** @type {Record<string, any>} */
const tries = {};
TRIES.forEach(([id, name, osd, fail, lines], i) => {
  tries[id] = { name, osd, rect: [A.tries[0], A.tries[1] + i * 12, A.tries[2], 10], z: 5, if: "end_beat=threat",
    use: [{ sfx: "static", gain: 0.4 }, { osd_fail: id, text: fail }, ...lines] };
});

const O = Nagiwa.osd;
Nagiwa.camRoom("cam31", { background: "cam31_bg", mic: { at: A.mic, clear: 60, lost: 150 },
  post: [{ noise: 0.08 }, { old_tube: 0.3 }, { palette: Nagiwa.PHOSPHOR, dither: 0.6 }, { scanlines: 2, amount: 0.14 }, { roll: { speed: 24, height: 9, amount: 0.14 } }, { vignette: 0.28 }, { cam31_break: true }],
  rec: ["moment:ines_meeting", "!ines_down"], strip: "!moment:ines_meeting",
  hotspots: { ...tries,
    wait: { name: "Vorspulen", rect: O.wait, z: 5, use: [{ if: "end_beat=threat", then: ["Das läuft auch ohne mich.", { time: "next" }], else: [{ forward: true }] }] },
    back: { name: "Deck", rect: O.back, z: 5, if: "!end_beat", exit: { to: "deck" } },
    stay: { name: "Deck", rect: O.back, z: 5, if: "end_beat=threat", use: ["Ich bleib. Ich bleib dran."] },
  } });

// ---- the threat runs by itself: she looks after him, then turns for the stairs, slowly, and he steps out in front of her, and Juno gets quieter.
// Only a real clock: the tools have the wait above, and the moment after it brings them to their places either way
const LINES = Cutaway.i18n.declare("waiting", ["Er wartet.", "Nein. Nicht die Treppe.", "Ines."]);
const LINE_AT = [6000, 13000, 19000], THREAT_MS = 22000, INES_GOES = 12000, ASHE_STEPS = 15000;
/** @type {number | null} */
let since = null;
let said = 0, moved = 0;
Cutaway.clock.onUpdate(() => {
  if (Cutaway.tween.instant || Cutaway.scene.room?.id !== "cam31" || Cutaway.state.flag("end_beat") !== "threat") { since = null; return; }
  if (Cutaway.menu.isOpen) return;
  if (since === null) {
    since = Cutaway.clock.time; said = 0; moved = 0;
  }
  const ashe = Cutaway.actors.get("ashe"), passed = Cutaway.clock.time - since;
  if (moved === 0 && passed >= INES_GOES) {
    const ines = Cutaway.actors.get("ines");
    ines.speed = [7, 3.5]; ines.walkTo(A.meet[0], A.meet[1], false, true); ines.ambient = true; moved = 1;
  }
  if (moved === 1 && passed >= ASHE_STEPS) {
    ashe.speed = [12, 6]; ashe.walkTo(A.asheMeet[0], A.asheMeet[1], false, true); ashe.ambient = true; moved = 2;
  }
  if (!Cutaway.state.flag("ashe_lit") && ashe.x >= SHADOW_ENDS) Cutaway.state.set("ashe_lit");
  if (Cutaway.script.busy) return;
  const t = passed;
  if (t >= THREAT_MS) Cutaway.script.run([{ time: "next" }], { path: "cam31.threat" });
  else if (said < LINES.length && t >= LINE_AT[said]) Cutaway.script.run([LINES[said++]], { path: "cam31.lines" });
});

// ---- 23:03: he stands in her way. The quarrel is hers alone: he has no line in this chapter, all he says here is the look into the camera (dialog-style-guide). The clicks
// stop answering, and Juno says nothing more
// The blow has two variants (CLAUDE.md): black bars, the default, or shown; both written out in the step, so the Schedule tab edits them
Cutaway.moment("ines_death", { room: "cam31", day: 4, from: "23:03", to: "23:30", if: "end_beat=threat", play: [
  { set: "end_beat", value: "kill" }, { music: { stop: true, fade: 300 } },
  { set: "ashe_lit" },
  { walk: "ashe", to: A.asheMeet, face: "se", free: true, wait: false },
  { walk: "ines", to: A.meet, face: "nw", free: true },
  { say: "ines", text: "Sie sind nicht von der Klinik." },
  { wait: 1200 },
  { say: "ines", text: "Zu spät. Er hat alles." },
  { wait: 1200 },
  { say: "ines", text: "Lassen Sie mich vorbei." },
  { wait: 800 },
  { if: "setting:violence=shown",
    then: [{ cam31_fx: { tear: 0.9 }, ms: 200 }, { sfx: "static" }, { sfx: "body_fall" }, { set: "ines_down" }, { wait: 300 }, { cam31_fx: { tear: 0 }, ms: 800 }, { wait: 900 }],
    else: [{ cam31_fx: { bars: 1 }, ms: 700 }, { sfx: "static" }, { wait: 500 }, { sfx: "body_fall" }, { set: "ines_down" }, { wait: 1600 }, { cam31_fx: { bars: 0 }, ms: 900 }] },
  { set: "cache_clip_ines_death" },
  { time: "23:04" },
  { wait: 1500 },
  { set: "end_beat", value: "look" },
  { wait: 3600 },
  { sfx: "glitch" }, { cam31_fx: { tear: 1 }, ms: 900 },
  { goto: "signal_lost", transition: false },
  { wait: 5000 },
  { time: "23:05" },
  { if: "e1=sold", then: [{ ledger: "wren_live", value: "paid" }, { ledger: "ines", value: "dead" }, { notify: "wren" }, { wait: 4000 }] },
  { wait: 3000 },
  { fade: "out", ms: 1400 },
  { set: "end_beat", value: "after" }, { evi: "besorgt" }, { letterbox: true, ms: 0 },
  { goto: "flat_danach", at: AF.deck, face: "ne", transition: false },
  { fade: "in", ms: 1400 },
  // nothing to click: it goes on by itself, after a long nothing
  { wait: 3000 },
  { if: "!rec_on", then: ["Ich hab nicht mal REC gedrückt. Der Puffer hält alles."] },
  "Ich hab's. Ich hab alles.",
  { wait: 1200 },
  { say: "evi", text: "Er hat sie ausgeschaltet. Juno. Er hat sie ausgeschaltet." },
  { wait: 1500 },
  { fade: "out", ms: 2000 },
  { letterbox: false, ms: 0 },
  { act: "next" },
] });

// no music, only the fans; the pointer stays and nothing answers
Cutaway.room("signal_lost", { name: "CAM 31", observe: true, feed: "cam31", lost: true, lines: "bottom", rec: "~never", strip: "~never",
  post: [{ noise: 0.12 }, { palette: Nagiwa.PHOSPHOR, dither: 0.6 }, { scanlines: 2, amount: 0.14 }],
  ambience: ["deck_fans"], music: { stop: true, fade: 200 }, hotspots: {} });

// her flat, with nothing to click (a room of its own: the flat's hotspots stay as they are). So that it shows: black bars as in a film, and the lamp is
// out, only the deck's screens still light the room and her; EVI in her corner, worried. The pointer stays: the lines go on with a click
const MONITOR = [205, 88], GLOW_NEAR = 45, GLOW_FAR = 150, DARK = 0.3;
Cutaway.post.add("deck_only", (/** @type {any} */ px) => {
  const { data, w, h } = px;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const d = Math.hypot(x - MONITOR[0], (y - MONITOR[1]) * 1.3), g = Math.max(0, Math.min(1, (GLOW_FAR - d) / (GLOW_FAR - GLOW_NEAR))), k = DARK + (1 - DARK) * g * g, i = (y * w + x) * 4;
    data[i] *= k; data[i + 1] *= k; data[i + 2] *= k;
  }
});
const [dx, dy] = AF.deck;
Cutaway.room("flat_danach", { name: "Junos Wohnung", background: "flat_bg", props: AF.props, buttons: false, eviCorner: true, post: [{ deck_only: true }],
  walk: [[dx - 1, dy - 1, dx + 1, dy - 1, dx + 1, dy + 1, dx - 1, dy + 1]],
  light: { ambient: 0.38, color: "#8a9cff", lamps: AF.lamps.map((/** @type {any} */ { bake, ...lamp }) => lamp) },
  ambience: ["deck_fans"], music: { stop: true }, hotspots: {} });
})();

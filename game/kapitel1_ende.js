// Halcyon: the end of Chapter 1 (docs/kapitel1-design.md §8), on blocks. Juno watches Ines die in cam31 and everything she tries
// fails where the player can see it. One straight chain, so the solver gains a handful of states:
//   end_beat     unknown (the overlay says ???) > threat (the player's hands are free, and nothing helps) > kill > wave > after (her flat)
//   ines_down    Ines lies on the platform
//   cache_clip_ines_death   Juno has it, whether she pressed REC or not: the buffer holds it
// The clock leaves its 15-minute ticks here, which is safe only because nothing branches on these times (kapitel1.js: the hold).
// The threat runs in real time, but nothing needs that: the clock's next step (the VOR button, the solver's wait) goes on as well.
"use strict";

(function () {
const A = Halcyon.at.cam31, AF = Halcyon.at.flat;

// Story §10: every drastic scene comes in two versions, the same story with a different picture
Cutaway.settings.define("violence", { page: "content", pageLabel: "Inhalt", label: "Gewalt",
  options: [["bars", "mit Balken"], ["shown", "gezeigt"]], default: "bars" });

// ---- the people. Ashe has no face in the feed: the mask outshines the camera
Halcyon.people.ashe = { name: "???" };
Cutaway.actor("ashe", { name: "???", color: "#ff7a6a", speed: [5, 2.5], voice: { pitch: 50, wave: "sine", syllable: 90 },
  costume: { idle: "mock_ashe", walk: "mock_ashe", talk: "mock_ashe" },
  poses: [{ if: "end_beat=wave", idle: "mock_ashe_wave", walk: "mock_ashe_wave", talk: "mock_ashe_wave" }],
  look: ["Kein Gesicht. Da, wo eins sein müsste, brennt mir das Bild durch."],
  talk: ["Die Markierung rutscht ab. Da ist nichts, woran sie hängen bleibt."] });
Cutaway.routine("ashe", [{ day: 4, from: "23:02", to: "23:30", room: "cam31", at: A.stairs, face: "se" }]);

Halcyon.cache.clip_ines_death = { kind: "clip", name: "CAM 31, 23:03", about: "Die alte Metro. Alles, bis er winkt." };
Object.assign(Halcyon.ledger, { ines: { to: "Ines Calder", what: { dead: "tot" } } });
Halcyon.threads.wren.push({ from: "wren", if: "ledger_wren_live", at: "23:05", text: "Zahlung erfolgt. Danke für die Live-Übertragung." });

// ---- the overlay tries to mark him (game/screens.js draws Halcyon.links)
Halcyon.links.push(
  { actor: "ashe", if: "end_beat=unknown", label: "???", color: "implant" },
  { actor: "ashe", if: { or: ["end_beat=threat", "end_beat=kill"] }, label: "BEDROHUNG", color: "red" },
);

// ---- the picture: older than every other camera's, and it tears. What the scene does to it isn't state: it is only the look of a script
const fx = { tear: 0, bars: 0 };
const hash = (/** @type {number} */ a, /** @type {number} */ b) => { let h = Math.imul(a, 374761393) + Math.imul(b, 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const moving = () => Cutaway.settings.values.motion !== false;
Cutaway.events.on("room.enter", () => { fx.tear = 0; fx.bars = 0; Halcyon.feedFails = {}; });

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
Halcyon.feedJitter = () => (fx.tear > 0.3 && moving() ? Math.round((hash(Math.floor(Cutaway.clock.time / 60), 3) - 0.5) * 6) : 0);

// { cam31_fx: { tear: 1 }, ms: 600 } moves the picture's break there and waits
Cutaway.script.action("cam31_fx", (s) => {
  const from = { ...fx }, to = s.cam31_fx;
  return Cutaway.tween.to({ key: "cam31_fx", ms: s.ms, step: (/** @type {number} */ k) => { for (const n of Object.keys(to)) /** @type {any} */ (fx)[n] = /** @type {any} */ (from)[n] + (to[n] - /** @type {any} */ (from)[n]) * k; } });
});
// { osd_fail: "try_chat", text: "NICHT ZUGESTELLT" } the button says so from now on (only the look: not saved)
Halcyon.feedFails = {};
Cutaway.script.action("osd_fail", (s) => { Halcyon.feedFails[s.osd_fail] = s.text; });
Cutaway.i18n.declare("feed display", ["KEIN ZUGRIFF", "NICHT ZUGESTELLT", "KEIN LAUTSPRECHER", "WIRD BEARBEITET", "STEUERN", "CHAT: INES", "LAUTSPRECHER", "REVIER 9", "SIGNAL LOST", "???", "BEDROHUNG"]);

// ---- 22:55 to 23:02: she comes, he comes, and then someone else
Cutaway.moment("ines_meeting", { room: "cam31", day: 4, from: "22:45", to: "23:30", play: [
  { tag: "ines" },
  { time: "22:55" },
  { walk: "ines", to: A.edge, face: "se", free: true },
  { if: "e1=refused", then: ["Ines. Geh nach Hause.", { sfx: "static", gain: 0.4 }, { narrate: "NICHT ZUGESTELLT" }], else: ["Da ist sie. Pünktlich."] },
  { time: "23:00" },
  { walk: "lantern", to: A.lantern, face: "sw", free: true },
  { say: "ines", text: "Es ist alles drauf. Die Protokolle passen auf die Sekunde." },
  { say: "lantern", text: "Wenn das stimmt ..." },
  { say: "ines", text: "Es stimmt. Sie schlafen nicht. Sie arbeiten." },
  "Sie gibt ihm was. Eine Wallet.",
  { if: "stick_ines", then: [{ say: "lantern", text: "Der Schlüssel war nicht da." }, "Sie rührt sich nicht."] },
  { time: "23:02" },
  { set: "end_beat", value: "unknown" }, { sfx: "tag" },
  "Wer ist das?",
  { wait: 900 },
  { set: "end_beat", value: "threat" }, { sfx: "glitch", gain: 0.5 }, { music: { intensity: 0.7 } },
  "Dreh dich um.",
] });

// ---- what Juno tries: all of it answers, and none of it helps
const TRIES = /** @type {[string, string, string, string, any[]][]} */ ([
  ["try_steuern", "Steuern", "STEUERN", "KEIN ZUGRIFF", ["Kein Licht. Keine Tür. Hier gibt's nichts zu steuern."]],
  ["try_chat", "Ines anschreiben", "CHAT: INES", "NICHT ZUGESTELLT", ["Dreh dich um. Dreh dich um."]],
  ["try_speaker", "Lautsprecher", "LAUTSPRECHER", "KEIN LAUTSPRECHER", ["Das Ding ist älter als ich. Es kann nur gucken."]],
  ["try_revier", "Revier 9", "REVIER 9", "WIRD BEARBEITET", ["Revier 9. Ein Mord, jetzt gleich, alte Metro, Linie 31.", { narrate: "Ihre Meldung wird bearbeitet." }]],
]);
/** @type {Record<string, any>} */
const tries = {};
TRIES.forEach(([id, name, osd, fail, lines], i) => {
  tries[id] = { name, osd, rect: [A.tries[0], A.tries[1] + i * 12, A.tries[2], 10], z: 5, if: "end_beat=threat",
    use: [{ sfx: "static", gain: 0.4 }, { osd_fail: id, text: fail }, ...lines] };
});

const O = Halcyon.osd;
Halcyon.camRoom("cam31", { background: "cam31_bg", mic: { at: A.mic, clear: 40, lost: 150 },
  post: [{ noise: 0.08 }, { old_tube: 0.3 }, { palette: Halcyon.PHOSPHOR, dither: 0.6 }, { scanlines: 2, amount: 0.14 }, { roll: { speed: 24, height: 9, amount: 0.14 } }, { vignette: 0.28 }, { cam31_break: true }],
  rec: ["moment:ines_meeting", "!ines_down"], strip: "!moment:ines_meeting",
  hotspots: { ...tries,
    wait: { name: "Vorspulen", rect: O.wait, z: 5, use: [{ if: "end_beat=threat", then: ["Das läuft auch ohne mich.", { time: "next" }], else: [{ forward: true }] }] },
    back: { name: "Deck", rect: O.back, z: 5, if: "!end_beat", exit: { to: "deck" } },
    stay: { name: "Deck", rect: O.back, z: 5, if: "end_beat=threat", use: ["Ich bleib. Ich bleib dran."] },
  } });

// ---- the threat runs by itself: he walks, slowly, and Juno gets quieter. Only a real clock: the tools have the wait above
const LINES = Cutaway.i18n.declare("waiting", ["Dreh dich um.", "Dreh dich um.", "Ines."]);
const LINE_AT = [9000, 16000, 22000], THREAT_MS = 25000;
/** @type {number | null} */
let since = null;
let said = 0;
Cutaway.clock.onUpdate(() => {
  if (Cutaway.tween.instant || Cutaway.scene.room?.id !== "cam31" || Cutaway.state.flag("end_beat") !== "threat") { since = null; return; }
  if (Cutaway.menu.isOpen) return;
  if (since === null) {
    since = Cutaway.clock.time; said = 0;
    const ashe = Cutaway.actors.get("ashe");
    ashe.walkTo(A.behind[0], A.behind[1], false, true);
    ashe.ambient = true;
  }
  if (Cutaway.script.busy) return;
  const t = Cutaway.clock.time - since;
  if (t >= THREAT_MS) Cutaway.script.run([{ time: "next" }], { path: "cam31.threat" });
  else if (said < LINES.length && t >= LINE_AT[said]) Cutaway.script.run([LINES[said++]], { path: "cam31.lines" });
});

// ---- 23:03: the rest happens to her; the clicks stop answering, and Juno says nothing more
const BARS = [{ cam31_fx: { bars: 1 }, ms: 700 }, { sfx: "static" }, { wait: 500 }, { sfx: "body_fall" }, { set: "ines_down" }, { wait: 1600 }, { cam31_fx: { bars: 0 }, ms: 900 }];
const SHOWN = [{ cam31_fx: { tear: 0.9 }, ms: 200 }, { sfx: "static" }, { sfx: "body_fall" }, { set: "ines_down" }, { wait: 300 }, { cam31_fx: { tear: 0 }, ms: 800 }, { wait: 900 }];
Cutaway.moment("ines_death", { room: "cam31", day: 4, from: "23:03", to: "23:30", if: "end_beat=threat", play: [
  { set: "end_beat", value: "kill" }, { music: { stop: true, fade: 300 } },
  { sfx: "motor" }, { walk: "lantern", to: A.tunnel, run: true, free: true, wait: false },
  { wait: 1800 },
  { cam31_fx: { tear: 0.7 }, ms: 150 }, { place: "ashe", at: A.behind, face: "se" }, { cam31_fx: { tear: 0 }, ms: 400 },
  { wait: 800 },
  { if: "setting:violence=shown", then: SHOWN, else: BARS },
  { set: "cache_clip_ines_death" },
  { time: "23:04" },
  { wait: 1500 },
  { set: "end_beat", value: "wave" },
  { wait: 3600 },
  { sfx: "glitch" }, { cam31_fx: { tear: 1 }, ms: 900 },
  { goto: "signal_lost", transition: false },
  { wait: 5000 },
  { time: "23:05" },
  { if: "e1=sold", then: [{ ledger: "wren_live", value: "paid" }, { ledger: "ines", value: "dead" }, { notify: "wren" }, { wait: 4000 }] },
  { wait: 3000 },
  { fade: "out", ms: 1400 },
  { set: "end_beat", value: "after" },
  { goto: "flat_danach", at: AF.deck, face: "ne", transition: false },
  { fade: "in", ms: 1400 },
] });

// no music, only the fans; the pointer stays and nothing answers
Cutaway.room("signal_lost", { name: "CAM 31", observe: true, feed: "cam31", lost: true, lines: "bottom", rec: "~never", strip: "~never",
  post: [{ noise: 0.12 }, { palette: Halcyon.PHOSPHOR, dither: 0.6 }, { scanlines: 2, amount: 0.14 }],
  ambience: ["deck_fans"], music: { stop: true, fade: 200 }, hotspots: {} });

// her flat, where only she herself can be clicked (a room of its own: the flat's hotspots stay as they are)
const [dx, dy] = AF.deck;
Cutaway.room("flat_danach", { name: "Junos Wohnung", background: "flat_bg", props: AF.props, buttons: false, eviCorner: true,
  walk: [[dx - 1, dy - 1, dx + 1, dy - 1, dx + 1, dy + 1, dx - 1, dy + 1]],
  light: { ambient: 0.38, color: "#8a9cff", lamps: AF.lamps.map((/** @type {any} */ { bake, ...lamp }) => lamp) },
  ambience: ["deck_fans"], music: { stop: true },
  hotspots: { self: { name: "Juno", rect: [dx - 12, dy - 56, 24, 58], use: [
    { if: "!rec_on", then: ["Ich hab nicht mal REC gedrückt. Der Puffer hält alles."] },
    "Ich hab's. Ich hab alles.",
    { wait: 1200 },
    { evi: "besorgt" }, { say: "evi", text: "Er hat sie ausgeschaltet. Juno. Er hat sie ausgeschaltet." },
    { wait: 1500 },
    { fade: "out", ms: 2000 },
    { end: "Kapitel 2: Aufnahme (kommt später)" },
  ] } } });
})();

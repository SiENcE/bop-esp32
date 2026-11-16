// Nagiwa: Chapter 2, "Auf Sendung" (docs/kapitel2-design.md §3.5, the user's wish 2026-11-16), on the way to Lantern. If Juno came at him
// too fast the first time, he threw her out and shut the door (lantern_found=out, game/kapitel2_lantern.js); with people he doesn't talk
// then, only with the sender. Behind the caravan (the arrival scrolls to the right) lie an old radio in a half-sunk boat, without power,
// and Pike's fish trap caught in the roots; freed with the hook, Pike gives her a battery for it. With the battery the radio works, and at
// Lantern's mast she tunes it: the channel (87.6 is his) and the wave (it must match the one on the mast's screen), then TX, and she
// speaks on his frequency. Calm and honest, he answers and opens the door (lantern_found=found).
//   reuse_frei    Pike's trap freed (he gave her the battery)
//   got_funk      she has taken the radio from the boat
//   funk_ch       the radio's channel while it is open, 1..5 (84.2, 85.9, 87.6, 89.1, 91.3); funk_welle its wave, 1..4 (a sine, a saw, a
//                 square, pulses); both set when it is switched on and gone when it is put away, so they only count while it is open (from 1:
//                 a flag at 0 counts as unset)
// All of it is the way to Lantern's own (checked in its run; off_lantern shuts the way in the others). [PLATZHALTER] the items' icons are
// the tap's, as the output stage's
"use strict";

(function () {
const A = Nagiwa.at.sumpf, F = Nagiwa.at.funk;
const L = (/** @type {string} */ text) => ({ say: "lantern_k2", text });
const P = (/** @type {string} */ text) => ({ say: "pike", text });
const R = (/** @type {string} */ text) => ({ say: "funk_stimme", text });
// the voices on the other channels: technology, so cyan
Cutaway.actor("funk_stimme", { name: "Funk", color: "#62def0", voice: { pitch: 58, range: 4, wave: "square", syllable: 70 } });

// ---- the things: the radio without power, the battery, the radio working
const POWER = [{ remove: "funkgeraet" }, { remove: "akku" }, { give: "funk" }, { sfx: "type" },
  "Der Akku passt, wenn man drückt. Es rauscht. Es lebt."];
Cutaway.item("funkgeraet", { name: "Funkgerät", icon: "inv_tap", look: ["Ein altes Funkgerät aus dem Boot. PUMP HALL 3 steht drauf.", "Kein Strom drin."],
  combine: { akku: POWER } });
Cutaway.item("akku", { name: "Akku", icon: "inv_tap", look: "Ein Akku aus Pikes Batteriebank. Schwer, und noch warm." });
Cutaway.item("funk", { name: "Funkgerät", icon: "inv_tap", look: ["Das Funkgerät aus dem Boot, mit Pikes Akku.", "Es rauscht leise. Am besten geht's am Mast."] });

// ---- the swamp behind the caravan: the trap in the roots, the mast with its screen, the boat
const hide = Cutaway.room.get("sumpf").hotspots;
const OPEN_RADIO = [{ set: "funk_ch", value: 1 }, { set: "funk_welle", value: 1 }, { sfx: "type" }, { goto: "funk", transition: "dissolve" }];
Object.assign(hide, {
  reuse: { name: "Reuse", poly: A.reusePoly, walkTo: A.reuse, face: "se", if: "!reuse_frei",
    look: ["Eine Reuse, in den Wurzeln verhakt. Die orange Boje ist Pikes.", "Um die Wurzeln herum ist das Wasser unruhig."],
    use: ["Mit der Hand komm ich da nicht ran.", "Und ich will auch nicht ins Wasser. Nicht da."],
    with: { haken: ["Ich hak die Reuse mit dem Haken los.", "Am anderen Ende zieht was. Dann lässt es los.", { sfx: "platsch" }, { set: "reuse_frei" },
      P("Du hast meine Reuse."), P("Danke."), P("Nimm den hier. Ein Akku aus meiner Bank. Wofür auch immer."), { give: "akku" }] } },
  antennenmast: { name: "Lanterns Funkturm", poly: A.mastPoly, walkTo: A.mast, face: "ne",
    look: ["Sein Funkturm, ein Gittermast auf einem Betonklotz im Wasser. Oben sitzen die Antennen im Kreis.", "Das Kabel kommt vom Dach des Wagens. Unten am Kasten läuft seine Welle."],
    use: ["Auf dem kleinen Schirm läuft seine Welle.", "Zacken, wie eine Säge. Die sendet er gerade."],
    with: { funk: OPEN_RADIO, funkgeraet: ["Ohne Strom sendet das nichts."] } },
  boot: { name: "Boot", poly: A.bootPoly, walkTo: A.boot, face: "se",
    look: ["Ein altes Ruderboot. Das Heck ist abgesoffen, der Bug ragt noch raus.", { if: "got_funk", then: ["Auf der Bank liegt nichts mehr."], else: ["Auf der vorderen Bank liegt was Eckiges."] }],
    use: [{ if: "got_funk", then: ["Nur noch Wasser im Heck."], else: ["Auf der Bank liegt ein altes Funkgerät.", "Kein Strom drin. Ich nehm's mit.",
      { set: "got_funk" }, { give: "funkgeraet" }] }] },
});
// the radio switched on at the caravan works too: his sender is right there
hide.wohnwagen.with = { ...(hide.wohnwagen.with ?? {}), funk: OPEN_RADIO };

// ---- the radio close: CH and WAVE with their arrows, TX, the power switch that puts it away (the display: drawn below)
const CH = ["84.2", "85.9", "87.6", "89.1", "91.3"], LANTERN_CH = 3, HIS_WAVE = 2;
/** what is on a channel as Juno turns to it (a line each; on his, his loop) */
const ON = [
  [R("Sleep better. Wake up new. Lull, von Nagi·wa.")],
  [R("... und das war die zweite Stunde, Leute, bleibt dran, gleich kommt ...")],
  [L("Hier ist Lantern. Wer das hier hört, ist noch wach.")],
  [R("Pumpe neun: Nennlast. Pegel Ring drei: steigend.")],
  ["Nur Rauschen."],
];
/** a knob turned by one, round its n settings (1..n): one step per setting, chained with else so only the one it stands on turns */
const tune = (/** @type {string} */ flag, /** @type {number} */ n, /** @type {number} */ by) => [[...Array(n).keys()].reduceRight((/** @type {any} */ rest, i) => {
  const to = ((i + by + n) % n) + 1;
  return { if: `${flag}=${i + 1}`, then: [{ set: flag, value: to }, { sfx: "type" }, ...(flag === "funk_ch" ? ON[to - 1] : [])], ...(rest ? { else: [rest] } : {}) };
}, null)];
const CLOSE = [{ unset: "funk_ch" }, { unset: "funk_welle" }, { goto: "sumpf", at: A.mast, face: "ne", transition: "dissolve" }];
// (a screen of its own, as the deck: nobody walks in it, observe)
Cutaway.room("funk", { name: "Funkgerät", background: "sumpf_funk_bg", buttons: false, observe: true, lines: "top", music: { theme: "sumpf", intensity: 0.4 },
  ambience: ["sumpf_regen", "sumpf_wasser"],
  hotspots: {
    ch_links: { name: "CH zurück", rect: F.chL, use: tune("funk_ch", 5, -1) },
    ch_rechts: { name: "CH vor", rect: F.chR, use: tune("funk_ch", 5, 1) },
    welle_links: { name: "WAVE zurück", rect: F.waveL, use: tune("funk_welle", 4, -1) },
    welle_rechts: { name: "WAVE vor", rect: F.waveR, use: tune("funk_welle", 4, 1) },
    tx: { name: "TX", rect: F.tx, use: [{ sfx: "type" },
      { if: `funk_ch=${LANTERN_CH}`, else: ["Auf dem Kanal hört er mich nicht. Da sendet er nicht."],
        then: [{ if: `funk_welle=${HIS_WAVE}`, else: ["Rauschen. Er hört mich nicht.", "Meine Welle sieht anders aus als seine auf dem Schirm."],
          then: [{ if: "lantern_found=out", then: [{ dialog: "lantern_funk" }],
            else: [{ if: "lantern_found", then: [L("Du stehst doch vor meiner Tür. Klopf einfach.")], else: ["Er sendet nur. Ich weiß ja noch gar nicht, wo er sitzt."] }] }] }] }] },
    pwr: { name: "Ausschalten", rect: F.pwr, use: [{ sfx: "type" }, ...CLOSE] },
  } });
// on air he is calm and wholly there (dialog-style-guide, Lantern's card); calm and honest gets through, pushing gets the static
const STATIC = [{ sfx: "glitch" }, "Es rauscht. Er hat abgeschaltet."];
const DOOR_OPEN = [L("..."), L("Die Tür ist offen."), { set: "lantern_found", value: "found" }, { sfx: "door_open" }, ...CLOSE,
  "Drüben geht die Tür auf. Das grüne Licht ist wieder da."];
Cutaway.dialog("lantern_funk", {
  main: { enter: [L("Hier ist Lantern. Wer das hier hört, ist noch wach."), L("Da ist jemand auf meiner Welle. Wer spricht da?")], choices: [
    { text: "„Ich bin noch wach.“", goto: "sagen", then: [L("..."), L("Dann bist du auf Sendung. Sag, was du sagen willst.")] },
    { text: "„Ich bin's. Die von vorhin.“", goto: "end", then: [L("Hier draußen gibt's kein vorhin."), ...STATIC] },
    { text: "„Mach die Tür auf. Ich will nur reden.“", goto: "end", then: STATIC },
  ] },
  sagen: [
    { text: "„Ich war zu schnell. Das tut mir leid. Ich hab dich in der Metro gesehen, und du warst weg, bevor er kam.“", goto: "end", then: DOOR_OPEN },
    { text: "„Pike sagt, du redest nur mit dem Sender. Also red ich mit dem Sender.“", goto: "end", then: [L("Pike redet zu viel."), L("... Aber er hat recht."), ...DOOR_OPEN] },
    { text: "„Mach auf, oder ich geh zu Morrow.“", goto: "end", then: STATIC },
  ],
});

// ---- the display: the channel and the wave as set, in the radio's green (drawn over the room, under the interface)
Cutaway.i18n.declare("radio display", ["CH {f}"]);
/** a wave's height at x (0..1 of its width): 0 a sine, 1 a saw, 2 a square, 3 pulses */
const WAVE = [(t) => Math.sin(t * Math.PI * 2 * 3), (t) => ((t * 4) % 1) * 2 - 1, (t) => (Math.sin(t * Math.PI * 2 * 3) >= 0 ? 1 : -1), (t) => ((t * 5) % 1 < 0.15 ? 1 : -0.6)];
Cutaway.events.on("frame.screen", (/** @type {CanvasRenderingContext2D} */ ctx) => {
  if (Cutaway.scene.room?.id !== "funk") return;
  const S = Cutaway.state, ch = Math.max(0, Number(S.flag("funk_ch") ?? 1) - 1), w = Math.max(0, Number(S.flag("funk_welle") ?? 1) - 1), [x, y, sw, sh] = F.screen;
  ctx.fillStyle = "#1c3a24"; ctx.fillRect(x, y, sw, sh);
  Cutaway.font.get("hud").draw(ctx, Nagiwa.t("CH {f}", { f: CH[ch] ?? "" }), x + 4, y + 3, { color: "#b0f0a0" });
  const drift = (Cutaway.clock.time / 900) % 1, mid = y + 26, amp = 8;
  ctx.fillStyle = "#7cff9a";
  let prev = null;
  for (let i = 0; i < sw - 8; i++) {                                                     // joined up, so a saw's or a square's jumps are lines too
    const yy = Math.round(mid - WAVE[w]((i / (sw - 8) + drift) % 1) * amp), a = prev ?? yy;
    ctx.fillRect(x + 4 + i, Math.min(a, yy), 1, Math.abs(a - yy) + 1); prev = yy;
  }
  // static over a channel that only hisses
  if (ch === 4) { ctx.fillStyle = "#3c6a3a"; for (let i = 0; i < 60; i++) ctx.fillRect(x + 2 + ((i * 37 + Math.floor(Cutaway.clock.time / 80) * 13) % (sw - 4)), y + 14 + ((i * 17) % (sh - 16)), 1, 1); }
});
})();

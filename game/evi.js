// Nagiwa: EVI, the AI on Juno's deck (docs/kapitel0-design.md §2.2; story §4, §6: Nagi·wa's discarded
// AUTO-EVAL prototype). For the player she is first of all the cute AI in the deck's corner: curious, kind,
// good with data, hopeless at reading people. She explains the deck in her own voice (no tutorial boxes),
// reports messages and gives the hints (she is the hint button: in the satchel, on the deck in her corner).
//   the actor "evi"          a voice only: her lines show in their own place (lineBox), bottom right beside
//                            her corner and the satchel, in her mint, short
//   { evi: "froh" }          her face from now until the script ends (froh, neugierig, verwirrt, besorgt,
//                            muede, glitch; the deck draws it: game/deck.js)
//   { evi_point: "chat" }    she points at an app: its icon pulses until it is opened
//   { deck_boot: true }      the deck boots (lines scroll, a glitch, EVI wakes); a second, once a night
//   { notify: "sable" }      a message card slides in at the top right, over every mode: the contact and its
//                            newest line (a click opens the chat on the deck)
// Faces, pointing, the boot and the cards are only what the screen shows: none of it is saved state.
"use strict";

(function () {
  Nagiwa.evi = { face: /** @type {string | null} */ (null), point: /** @type {string | null} */ (null), boot: -1,
    /** @type {{who: string, since: number} | null} */ card: null };

  Cutaway.actor("evi", {
    name: "EVI", color: "#8ef5d8",
    voice: { pitch: 84, range: 7, wave: "sine", syllable: 52, speed: 1.15 },
    // right-aligned, the line's end mark and its panel reach 12 px past x: 262 keeps them clear of her
    // head by the satchel (x 276, drawn while she talks: below) and of her corner on the deck (x 290)
    lineBox: { x: 262, y: 177, w: 196, align: "right" },
  });
  Cutaway.hints.configure({ by: "evi" });

  // On touch, looking is a long press, and nobody finds that by themselves: EVI says so after the first taps, and again now and then
  // for as long as nobody has done it. On this device, not in the save: it is about the fingers, not the story.
  const [HOLD_FIRST, HOLD_AGAIN] = Cutaway.i18n.declare("evi", ["Psst. Finger drauf und halten: Dann schaut Juno genauer hin.", "Du hältst nie den Finger drauf. Dabei hat Juno zu allem was zu sagen. Leider."]);
  const HOLD_KEY = "glass-sister.heldOnce";
  let held = false, taps = 0, /** @type {string | null} */ due = null;
  try { held = localStorage.getItem(HOLD_KEY) === "1"; } catch { /* private mode: she may say it again */ }
  const playing = () => !!Cutaway.scene?.room && !Cutaway.scene.backdrop && !!Cutaway.scene.active && !Cutaway.acts?.titleOpen;
  Cutaway.events.on("pointer.click", (/** @type {any} */ p) => {
    if (!p.touch || held || !playing()) return;
    if (p.button === 2) { held = true; due = null; try { localStorage.setItem(HOLD_KEY, "1"); } catch { /* as above */ } return; }
    taps++;
    if (taps === 3) due = HOLD_FIRST; else if (taps === 40 || taps === 120) due = HOLD_AGAIN;
  });
  Cutaway.clock.onUpdate(() => {
    if (!due || !playing() || Cutaway.script.busy || Cutaway.ui.line || Cutaway.dialogs?.choices || Cutaway.menu?.card || Cutaway.menu?.rows || Cutaway.sequence?.playing?.()) return;
    const text = due; due = null;
    Cutaway.script.run([{ say: "evi", text }], { path: "evi.hold" });
  });

  Cutaway.script.action("evi", (s) => { Nagiwa.evi.face = s.evi ? String(s.evi) : null; });
  Cutaway.script.action("evi_point", (s) => { Nagiwa.evi.point = s.evi_point ? String(s.evi_point) : null; });
  Cutaway.script.action("deck_boot", async (s, ctx) => {
    if (Cutaway.script.fast) return;
    Nagiwa.evi.boot = Cutaway.clock.time;
    Cutaway.events.emit("sfx", { sfx: "boot" });
    await Cutaway.script.exec([{ wait: 1300 }], ctx);
    Nagiwa.evi.boot = -1;
  });
  // EVI goes along on the pocket deck in Juno's bag: always in it, of no use to anybody (story §10b)
Cutaway.item("evi_bag", { name: "EVI", icon: "ui_evi", fixed: true,
  look: [{ say: "evi", text: "Hallo! Ich bin in der Tasche. Benutzen kann man mich nicht. Nur fragen." }] });

Cutaway.script.action("notify", (s) => {
    if (Cutaway.script.fast) return;
    Nagiwa.evi.card = { who: String(s.notify), since: Cutaway.clock.time };
    Cutaway.events.emit("sfx", { sfx: "mail" });
  });
  // her face lasts as long as the script that set it
  Cutaway.events.on("script.busy", (/** @type {boolean} */ busy) => { if (!busy) Nagiwa.evi.face = null; });
  Cutaway.events.on("room.enter", () => { Nagiwa.evi.boot = -1; });

  // ---------------------------------------------------------------- the message card (every mode)
  const CARD = { x: 192, y: 15, w: 124, h: 25, ms: 5200 };
  const cardRect = () => [CARD.x, CARD.y, CARD.w, CARD.h];
  const cardOn = () => !!Nagiwa.evi.card && Cutaway.clock.time - Nagiwa.evi.card.since < CARD.ms;
  Cutaway.i18n.declare("message card", ["{time}"]);

  /** @param {CanvasRenderingContext2D} ctx */
  function card(ctx) {
    if (!cardOn()) return;
    const c = /** @type {{who: string, since: number}} */ (Nagiwa.evi.card), contact = Nagiwa.contacts[c.who];
    if (!contact) return;
    const msgs = (Nagiwa.threads[c.who] ?? []).filter((m) => Cutaway.state.test(m.if)), last = msgs[msgs.length - 1];
    const age = Cutaway.clock.time - c.since, slide = Math.min(1, age / 220), out = Math.max(0, (age - (CARD.ms - 300)) / 300);
    const x = Math.round(CARD.x + (1 - slide) * 130 + out * 130), y = CARD.y, { w, h } = CARD;
    const hud = Cutaway.font.get("hud"), f = Cutaway.ui.font(), t = Nagiwa.t;
    // a chamfered card (the skin's), its sender in their colour, the first line
    ctx.fillStyle = "#090d18";
    for (let r = 0; r < h; r++) { const a = Math.max(0, 4 - r), b = w - 1 - Math.max(0, 4 - (h - 1 - r)); ctx.fillRect(x + a, y + r, b - a + 1, 1); }
    ctx.fillStyle = "#1f88a4"; ctx.fillRect(x + 4, y, w - 4, 1); ctx.fillRect(x, y + h - 1, w - 4, 1); ctx.fillRect(x, y + 4, 1, h - 5); ctx.fillRect(x + w - 1, y, 1, h - 4);
    ctx.fillStyle = "#62def0"; ctx.fillRect(x + 4, y, 12, 1);
    ctx.fillStyle = "#ff4fd3"; ctx.fillRect(x + w - 2, y + 4, 2, 6);
    ctx.fillStyle = "#dafcff"; ctx.fillRect(x + 4, y + 4, 9, 7); ctx.fillStyle = "#131a2a"; ctx.fillRect(x + 5, y + 5, 7, 5);
    ctx.fillStyle = "#dafcff"; for (const [a, b] of [[5, 5], [11, 5], [6, 6], [10, 6], [7, 7], [9, 7], [8, 8]]) ctx.fillRect(x + a, y + b, 1, 1);
    hud.draw(ctx, t(contact.name).toUpperCase(), x + 17, y + 5, { color: contact.color });
    hud.draw(ctx, Cutaway.time.now.text, x + w - 6, y + 5, { color: "#617aa0", align: "right" });
    if (last?.text) {
      let s = t(last.text);
      while (s.length > 1 && f.measure(s + "…") > w - 10) s = s.slice(0, -1);
      f.draw(ctx, s === t(last.text) ? s : s + "…", x + 5, y + 14, { color: "#dafcff", outline: "#0c0e1a" });
    }
  }

  Cutaway.ui.addLayer({
    z: 58, modal: true,
    click(/** @type {{x: number, y: number}} */ p) {
      if (!cardOn()) return false;
      const [x, y, w, h] = cardRect();
      if (p.x < x || p.y < y || p.x >= x + w || p.y >= y + h) return false;
      const who = /** @type {any} */ (Nagiwa.evi.card).who;
      Nagiwa.evi.card = null;
      // on the deck the card opens the chat on that thread; elsewhere it just goes away
      if (Cutaway.scene.room?.deck && !Cutaway.script.busy) Cutaway.script.run([{ set: "deck_app", value: `chat_${who}` }]);
      return true;
    },
    render: card,
  });

  // ---------------------------------------------------------------- her place outside the deck
  // The engine hides the satchel and the hint button while a script runs, which is when she talks; so
  // in street and feed mode she stays in sight there while her line shows: the satchel, and her head
  // out of its pocket where the hint button sits (as the engine places it), bobbing as she talks.
  Cutaway.ui.addLayer({
    z: 44, modal: true,
    render(/** @type {CanvasRenderingContext2D} */ ctx) {
      // a room without the satchel can still have her in its corner, small, with the face she has now, all the time she is there
      if (Cutaway.scene.room?.eviCorner) { Cutaway.assets.draw(ctx, `evi_${Nagiwa.evi.face ?? "froh"}`, 290, 132, { anchor: [0, 0], t: Cutaway.clock.time }); return; }
      if (Cutaway.ui.line?.actor !== "evi" || !Cutaway.script.busy) return;
      if (Cutaway.scene.room?.buttons === false) return;
      const bag = Cutaway.inventory.bagCentre(), y = Cutaway.inventory.corner === "bottom" ? Cutaway.display.height - 16 : 5;
      const bob = Math.floor(Cutaway.clock.time / 180) % 2;
      Cutaway.assets.draw(ctx, "ui_satchel", bag.x - 8, bag.y - 7, { anchor: [0, 0], t: Cutaway.clock.time });
      Cutaway.assets.draw(ctx, "ui_evi", bag.x - 32, y - bob, { anchor: [0, 0], t: Cutaway.clock.time });
    },
  });
})();

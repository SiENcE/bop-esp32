// Halcyon: the game's own actions and helpers on top of Cutaway.js (docs/kapitel0-design.md §2–4).
// Everything that matters to the story is a flag, so saves and the solver see it:
//   chits            Juno's money (a number)
//   tag_<who>        a person she has tagged in a feed
//   code_<cam>       she knows a camera's access code; link_<cam>: it is linked
//   cache_<id>       a clip or note in her cache (the deck's inventory)
//   ledger_<id>      an entry in the Kassenbuch (its value picks the text in Halcyon.ledger)
//   rec_on           the REC button of the feeds is pressed
"use strict";

/** @type {any} */
const Halcyon = (/** @type {any} */ (window)).Halcyon = {
  /** The cache's entries: what each clip or note is (the deck shows them). */
  cache: /** @type {Record<string, {kind: "clip" | "note", name: string, about: string}>} */ ({}),
  /** The Kassenbuch's entries: per flag value, the line it shows. */
  ledger: /** @type {Record<string, {to: string, what: Record<string, string>, chits?: Record<string, number>}>} */ ({}),
  /** Cameras: what the feeds show in their display (OSD) and on the deck's map. */
  cams: /** @type {Record<string, {id: string, place: string, owner: string, map: [number, number], if?: any}>} */ ({}),
  /** Named people in the feeds: the name their tag shows once known (flag `known`), else "UNBEKANNT"; until
   * then their hover label and subtitles say `label` (a stranger), after it `speaker`. */
  people: /** @type {Record<string, {name: string, known?: string, label?: string, speaker?: string}>} */ ({}),
  /** The date of game day 1. */
  day1: [2091, 11, 6],
};

// ---- texts. Every text on screen goes through i18n (Cutaway.i18n.t): the data's texts by the engine,
// the ones this game draws itself through Halcyon.t. Those are declared (Cutaway.i18n.declare) where they
// are drawn, so validate and the editor's Texts tab see them; the lists below by Halcyon.declareTexts.
// Only text painted into the art is not (signs and ads stay English in every language anyway).

/**
 * A text through i18n, its {name} parts filled in after the translation: Halcyon.t("CACHE {n}/8", { n: 2 }).
 * Parts that are texts themselves are translated by the caller.
 * @param {string} text @param {Record<string, string | number>} [vars] @returns {string}
 */
Halcyon.t = function (text, vars) {
  let s = Cutaway.i18n.t(text);
  for (const [k, v] of Object.entries(vars ?? {})) s = s.split(`{${k}}`).join(String(v));
  return s;
};

/** Declare the texts of the game's own lists (cache, Kassenbuch, cameras, people), once all of them are loaded (game.js). */
Halcyon.declareTexts = function () {
  const d = Cutaway.i18n.declare;
  d("cache", Object.values(Halcyon.cache).flatMap((c) => [c.name, c.about]));
  d("Kassenbuch", Object.values(Halcyon.ledger).flatMap((e) => [e.to, ...Object.values(e.what)]));
  d("cameras", Object.values(Halcyon.cams).flatMap((c) => [c.place, c.owner]));
  d("chat", Object.values(Halcyon.contacts ?? {}).map((c) => c.status));
  d("chat", Object.values(Halcyon.threads ?? {}).flatMap((list) => list.flatMap((m) => [m.text, m.photo, m.clip, m.at].filter((x) => typeof x === "string"))));
  d("evenings", Object.values(Halcyon.nights ?? {}).flatMap((n) => [n.date, n.evening]));
  d("people", Object.values(Halcyon.people).flatMap((p) => [p.name, p.label, p.speaker].filter((t) => typeof t === "string")));
};

/** The date and time as the camera's display shows it: "2091-11-06 22:15". */
Halcyon.stamp = function () {
  const n = Cutaway.time.now, [y, m, d] = Halcyon.day1, date = new Date(Date.UTC(y, m - 1, d + n.day - 1 + (n.minutes >= 1440 ? 1 : 0)));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")} ${n.text}`;
};

// { tag: "kessler" } tags a person in a feed (at most three at once; the newest pushes out the oldest)
// (a moment that waits for a tag, `if: "tag_kessler"`, plays right after it)
Cutaway.script.action("tag", async (s) => {
  const who = String(s.tag), tagged = Object.keys(Halcyon.people).filter((p) => Cutaway.state.flag(`tag_${p}`));
  if (Cutaway.state.flag(`tag_${who}`)) return;
  if (tagged.length >= 3) Cutaway.state.unset(`tag_${tagged[0]}`);
  Cutaway.state.set(`tag_${who}`);
  Cutaway.events.emit("sfx", { sfx: "tag" });
  await Cutaway.time.check();
}, { sets: (s) => [`tag_${s.tag}`] });

// { been_to: ["flat", ...] } rooms Juno knows already, when a chapter begins (nobody asks; each one left open would double the solver's states)
Cutaway.script.action("been_to", (s) => { for (const room of s.been_to) Cutaway.state.visit(room); });

// { zoom: "zoom_ring" } opens the zoom window over the feed; { zoom: false } closes it (the window is the
// feed layer's; nothing here waits, so the lines that follow are read while it shows). A street close-up
// ({ zoom: "look_shaft" }) covers the speaker, so while it shows the room's lines go to the bottom bar.
/** @type {{room: any, lines: any} | null} */
let lookLines = null;
Cutaway.script.action("zoom", (s) => {
  Halcyon.zoom = s.zoom ? String(s.zoom) : null;
  if (lookLines) { lookLines.room.lines = lookLines.lines; lookLines = null; }
  const room = Cutaway.scene.room;
  if (Halcyon.zoom?.startsWith("look_") && room) { lookLines = { room, lines: room.lines }; room.lines = "bottom"; }
  if (s.zoom && !Cutaway.script.fast) Cutaway.events.emit("sfx", { sfx: "zoom" });
});

// { cache: "clip_kessler_ring" } puts a clip or a note into the cache
Cutaway.script.action("cache", (s) => {
  Cutaway.state.set(`cache_${s.cache}`); Cutaway.events.emit("sfx", { sfx: "cache" });
  if (String(s.cache).startsWith("clip_") && !Cutaway.script.fast) Cutaway.events.emit("stinger", "clue");   // a moment caught
},
  { sets: (s) => [`cache_${s.cache}`] });

// { ledger: "kessler", value: "full" } writes an entry into the Kassenbuch and pays what it pays
Cutaway.script.action("ledger", (s) => {
  const id = String(s.ledger), v = String(s.value ?? "yes"), e = Halcyon.ledger[id];
  Cutaway.state.set(`ledger_${id}`, v);
  const pay = e?.chits?.[v] ?? 0;
  if (pay) Cutaway.state.inc("chits", pay);
}, { sets: (s) => [`ledger_${s.ledger}`, "chits"] });

// The zoom window closes with the room, and when the script that opened it is done.
Cutaway.events.on("room.enter", () => { Halcyon.zoom = null; });
Cutaway.events.on("script.busy", (busy) => { if (!busy) Halcyon.zoom = null; });

// People are strangers until Juno knows them: their hover label and subtitles follow what she knows.
Halcyon.names = function () {
  for (const [id, p] of Object.entries(Halcyon.people)) {
    const a = Cutaway.actors.get(id);
    if (a && p.label && p.speaker) a.name = p.known && Cutaway.state.flag(p.known) ? p.speaker : p.label;
  }
};
Cutaway.events.on("state.changed", Halcyon.names);
Cutaway.events.on("room.enter", Halcyon.names);

// { forward: true } fast-forwards to the next change in the feeds (anyone's routine, a moment), showing the
// new time big in the picture while it jumps; when nothing more happens tonight, Juno says so
const [NOTHING_TONIGHT] = Cutaway.i18n.declare("waiting", ["Heute Nacht passiert hier nichts mehr."]);
Cutaway.script.action("forward", async (s, ctx) => {
  const held = Cutaway.time.holding();                                     // a chapter may stop the clock, and says why
  if (held) return Cutaway.script.exec([held], ctx);
  const n = Cutaway.time.next();
  if (n === null) return Cutaway.script.exec([NOTHING_TONIGHT], ctx);      // a line: the engine translates it
  await Cutaway.script.exec([{ caption: Cutaway.time.format(n), at: "c", ms: 900, wait: false }, { time: "next" }], ctx);
});

// Nagiwa: the game's own actions and helpers on top of Cutaway.js (docs/kapitel0-design.md §2–4).
// Everything that matters to the story is a flag, so saves and the solver see it:
//   chits            Juno's money (a number)
//   tag_<who>        a person she has tagged in a feed
//   code_<cam>       she knows a camera's access code; link_<cam>: it is linked
//   cache_<id>       a clip or note in her cache (the deck's inventory)
//   ledger_<id>      an entry in the Kassenbuch (its value picks the text in Nagiwa.ledger)
//   rec_on           the REC button of the feeds is pressed
"use strict";

/** @type {any} */
const Nagiwa = (/** @type {any} */ (window)).Nagiwa = {
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
// the ones this game draws itself through Nagiwa.t. Those are declared (Cutaway.i18n.declare) where they
// are drawn, so validate and the editor's Texts tab see them; the lists below by Nagiwa.declareTexts.
// Only text painted into the art is not (signs and ads stay English in every language anyway).

/**
 * A text through i18n, its {name} parts filled in after the translation: Nagiwa.t("CACHE {n}/8", { n: 2 }).
 * Parts that are texts themselves are translated by the caller.
 * @param {string} text @param {Record<string, string | number>} [vars] @returns {string}
 */
Nagiwa.t = function (text, vars) {
  let s = Cutaway.i18n.t(text);
  for (const [k, v] of Object.entries(vars ?? {})) s = s.split(`{${k}}`).join(String(v));
  return s;
};

/** Declare the texts of the game's own lists (cache, Kassenbuch, cameras, people), once all of them are loaded (game.js). */
Nagiwa.declareTexts = function () {
  const d = Cutaway.i18n.declare;
  d("cache", Object.values(Nagiwa.cache).flatMap((c) => [c.name, c.about]));
  d("Kassenbuch", Object.values(Nagiwa.ledger).flatMap((e) => [e.to, ...Object.values(e.what)]));
  d("cameras", Object.values(Nagiwa.cams).flatMap((c) => [c.place, c.owner]));
  d("chat", Object.values(Nagiwa.contacts ?? {}).map((c) => c.status));
  d("chat", Object.values(Nagiwa.threads ?? {}).flatMap((list) => list.flatMap((m) => [m.text, m.photo, m.clip, m.at].filter((x) => typeof x === "string"))));
  d("evenings", Object.values(Nagiwa.nights ?? {}).flatMap((n) => [n.date, n.evening]));
  d("NETZ", (Nagiwa.netz ?? []).flatMap((n) => [n.text, n.by].filter((t) => typeof t === "string")));
  d("netz", [...Object.values(Nagiwa.netzPages ?? {}).flatMap((p) => [p.title, p.label, p.by, ...(p.text ?? []), ...(p.posts ?? []).flatMap((q) => [q.by, q.text])]),
    ...(Nagiwa.netzSearch ?? []).flatMap((s) => [s.term, s.none])].filter((x) => typeof x === "string"));
  d("people", Object.values(Nagiwa.people).flatMap((p) => [p.name, p.label, p.speaker].filter((t) => typeof t === "string")));
};

/** The beat of a Lull point, and of the old protocol's handshake: long, short, short, long, then a pause. @param {number} ms */
Nagiwa.lullBeat = function (ms) {
  const t = ms % 3600;
  return t < 800 || (t >= 1100 && t < 1350) || (t >= 1650 && t < 1900) || (t >= 2200 && t < 3000);
};

/**
 * A figure's four views seen straight down (the Drain Market: art/characters/juno_top.px.js, markt_people.px.js), as a costume
 * entry: each drawn once and turned, so its left is its own, not a mirror. @param {string} name e.g. "ratz_top_idle"
 */
Nagiwa.top = function (name) {
  return { down: `${name}_down`, up: `${name}_up`, right: `${name}_right`, left: `${name}_left` };
};

/** The date and time as the camera's display shows it: "2091-11-06 22:15". */
Nagiwa.stamp = function () {
  const n = Cutaway.time.now, [y, m, d] = Nagiwa.day1, date = new Date(Date.UTC(y, m - 1, d + n.day - 1 + (n.minutes >= 1440 ? 1 : 0)));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")} ${n.text}`;
};

// { tag: "kessler" } tags a person in a feed (at most three at once; the newest pushes out the oldest)
// (a moment that waits for a tag, `if: "tag_kessler"`, plays right after it)
Cutaway.script.action("tag", async (s) => {
  const who = String(s.tag), tagged = Object.keys(Nagiwa.people).filter((p) => Cutaway.state.flag(`tag_${p}`));
  if (Cutaway.state.flag(`tag_${who}`)) return;
  if (tagged.length >= 3) Cutaway.state.unset(`tag_${tagged[0]}`);
  Cutaway.state.set(`tag_${who}`);
  Cutaway.events.emit("sfx", { sfx: "tag" });
  await Cutaway.time.check();
}, { sets: (s) => [`tag_${s.tag}`] });

// { solo: true } says which threads tools/solve-act.mjs can shut, one flag each (--set off_roof); in the game they stay open
Cutaway.script.action("solo", () => {}, { sets: () => ["off_main", "off_roof", "off_zeitung", "off_imai", "off_traeger", "off_varga", "off_tide", "off_motte", "off_vesper", "off_lantern", "off_dryer"] });

// { been_to: ["flat", ...] } rooms Juno knows already, when a chapter begins (nobody asks; each one left open would double the solver's states)
Cutaway.script.action("been_to", (s) => { for (const room of s.been_to) Cutaway.state.visit(room); });

// { replay: "ines_drop", from: 1 } plays a moment's scene again from its step `from` (a camera's buffer, rewound): its lines are
// written once, in the moment, where the editor's Schedule tab edits them
Cutaway.script.action("replay", (s, ctx) => {
  const play = Cutaway.time.moments.get(String(s.replay))?.play;
  if (!play) throw new Error(`replay: no moment "${s.replay}" with a play`);
  return Cutaway.script.exec((Array.isArray(play) ? play : [play]).slice(Number(s.from) || 0), ctx);
});

// { remember_place: true } ... { return_place: true }: a scene somewhere else (a knock at the flat's door) takes Juno back where she was:
// a camera, or the deck with its window open. Held only for the script under way (a save in its middle is the game before it).
/** @type {{room: string | undefined, app: any} | null} */
let placeBefore = null;
Cutaway.script.action("remember_place", () => { placeBefore = { room: Cutaway.scene.room?.id, app: Cutaway.state.flag("deck_app") }; });
Cutaway.script.action("return_place", (s, ctx) => {
  const p = placeBefore;
  placeBefore = null;
  if (!p) return;
  const back = [...(p.room && p.room !== Cutaway.scene.room?.id ? [{ goto: p.room }] : []), ...(p.app ? [{ set: "deck_app", value: p.app }] : [])];
  return Cutaway.script.exec(back, ctx);
});

// { zoom: "zoom_ring" } opens the zoom window over the feed; { zoom: false } closes it (the window is the
// feed layer's; nothing here waits, so the lines that follow are read while it shows). A street close-up
// ({ zoom: "look_shaft" }) covers the speaker, so while it shows the room's lines go to the bottom bar.
/** @type {{room: any, lines: any} | null} */
let lookLines = null;
Cutaway.script.action("zoom", (s) => {
  Nagiwa.zoom = s.zoom ? String(s.zoom) : null;
  if (lookLines) { lookLines.room.lines = lookLines.lines; lookLines = null; }
  const room = Cutaway.scene.room;
  if (Nagiwa.zoom?.startsWith("look_") && room) { lookLines = { room, lines: room.lines }; room.lines = "bottom"; }
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
  const id = String(s.ledger), v = String(s.value ?? "yes"), e = Nagiwa.ledger[id];
  Cutaway.state.set(`ledger_${id}`, v);
  const pay = e?.chits?.[v] ?? 0;
  if (pay) Cutaway.state.inc("chits", pay);
}, { sets: (s) => [`ledger_${s.ledger}`, "chits"] });

// The zoom window closes with the room, and when the script that opened it is done.
Cutaway.events.on("room.enter", () => { Nagiwa.zoom = null; });
Cutaway.events.on("script.busy", (busy) => { if (!busy) Nagiwa.zoom = null; });

// People are strangers until Juno knows them: their hover label and subtitles follow what she knows.
Nagiwa.names = function () {
  for (const [id, p] of Object.entries(Nagiwa.people)) {
    const a = Cutaway.actors.get(id);
    if (a && p.label && p.speaker) a.name = p.known && Cutaway.state.flag(p.known) ? p.speaker : p.label;
  }
};
Cutaway.events.on("state.changed", Nagiwa.names);
Cutaway.events.on("room.enter", Nagiwa.names);

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

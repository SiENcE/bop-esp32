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
  day1: [2091, 11, 3],
};

/** The date and time as the camera's display shows it: "2091-11-03 22:15". */
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

// { zoom: "zoom_ring" } opens the zoom window over the feed; { zoom: false } closes it (the window is the
// feed layer's; nothing here waits, so the lines that follow are read while it shows)
Cutaway.script.action("zoom", (s) => {
  Halcyon.zoom = s.zoom ? String(s.zoom) : null;
  if (s.zoom && !Cutaway.script.fast) Cutaway.events.emit("sfx", { sfx: "zoom" });
});

// { cache: "clip_kessler_ring" } puts a clip or a note into the cache
Cutaway.script.action("cache", (s) => { Cutaway.state.set(`cache_${s.cache}`); Cutaway.events.emit("sfx", { sfx: "cache" }); },
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
Cutaway.script.action("forward", async (s, ctx) => {
  const n = Cutaway.time.next();
  if (n === null) return Cutaway.script.exec(["Heute Nacht passiert hier nichts mehr."], ctx);
  await Cutaway.script.exec([{ caption: Cutaway.time.format(n), at: "c", ms: 900, wait: false }, { time: "next" }], ctx);
});

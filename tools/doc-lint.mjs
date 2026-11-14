// Check the docs against the game, so a doc can't quietly say what the game no longer does (the skill story-sync):
//   node tools/doc-lint.mjs            the report: names in backticks the game doesn't know, flag values it never sets, wrong weekdays
//   node tools/doc-lint.mjs --flags    also writes docs/flags.md, the register of every flag (never edit it by hand)
//   node tools/doc-lint.mjs --all      also lists the names only planned
// A name in backticks (`stick_ines`, `k1b=lied`, `cam31`) must be one the game has: a flag, room, actor, item, dialogue, act,
// sequence, moment, hotspot, sprite, camera, CACHE or Kassenbuch entry. A doc whose head says "Nichts davon ist gebaut" is a plan:
// its new names count as planned, and so do they where another doc names them, and so does a name on a line that says it is for later
// ("geplant", "später", "Kap. 4"). Code with spaces, capitals, a path or a placeholder
// (`<id>`) is no name, and an unknown single word without a digit or an underscore is let be (it is often a word of the data's format). A weekday beside a date must be that date's (the year 2091 unless it says another).
// Exit code 1 on errors (an unknown value, a wrong weekday); unknown names are warnings.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadGame, boot } from "../lib/cutaway/tools/lib/game.mjs";
import { validate } from "../lib/cutaway/tools/lib/validate.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const g = loadGame(path.join(root, "index.html"));
await boot(g, { instant: true });
const C = g.C, N = /** @type {any} */ (g.ctx).Nagiwa;
const v = /** @type {any} */ (validate(C, { languages: g.options?.languages, demo: g.options?.demo, title: g.options?.title, intro: g.options?.intro, gate: g.options?.gate }));

/** A Set, Map, array or object as a list of its entries' names. @param {any} x @returns {string[]} */
// (duck-typed: Maps and Sets made in the game's vm are not this realm's, instanceof misses them)
const isMap = (/** @type {any} */ x) => typeof x?.get === "function" && typeof x?.keys === "function", isSet = (/** @type {any} */ x) => typeof x?.has === "function" && typeof x?.add === "function" && !isMap(x);
const names = (x) => !x ? [] : isMap(x) ? [...x.keys()] : isSet(x) || Array.isArray(x) ? [...x].map(String) : Object.keys(x);
/** What a Map or object holds for a key, as a list. @param {any} x @param {string} k @returns {string[] | null} */
const listOf = (x, k) => { const e = !x ? undefined : isMap(x) ? x.get(k) : x[k]; return e == null ? null : isSet(e) || Array.isArray(e) ? [...e].map(String) : [String(e)]; };

// ---- what the game knows
const flagsSet = new Set(names(v.flags?.set)), flagsTested = new Set(names(v.flags?.tested));
const flags = new Set([...flagsSet, ...flagsTested].filter((f) => !f.startsWith("~")));
const known = new Set(flags);
const add = (/** @type {string[]} */ l, pre = "") => l.forEach((x) => known.add(pre + x));
add(C.room.ids()); add(C.item.ids()); add(C.dialog.ids()); add(C.act.ids()); add(C.sequence?.ids?.() ?? []);
add(C.actors.all().map((/** @type {any} */ a) => a.id));
add(names(C.time?.moments));
for (const id of C.room.ids()) { const r = C.room.get(id); add(Object.keys(r?.hotspots ?? {})); add((r?.props ?? []).map((/** @type {any} */ p) => p.id).filter(Boolean)); }
add(C.assets?.names?.() ?? []); add(C.sfx?.names?.() ?? []); add(C.score?.ids?.() ?? []); add(C.synth?.names?.() ?? []); add(C.script?.names?.() ?? []);
add(names(N?.cams)); add(names(N?.cache)); add(names(N?.cache), "cache_"); add(names(N?.ledger)); add(names(N?.ledger), "ledger_");
add(names(N?.contacts)); add(names(N?.threads));
const paths = readdirSync(path.join(root, "tools", "paths")).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5));
add(paths); add(paths.map((p) => p.replace(/^[a-z0-9]+_/, "")));   // the click paths, also by their part after the act
add(["i18n"]);
/** the values a flag is set to (when the validator says), else null @param {string} f */
const valuesOf = (f) => listOf(v.flags?.values, f);

// ---- the docs
const docsDir = path.join(root, "docs");
const files = readdirSync(docsDir).filter((f) => f.endsWith(".md") && f !== "ideen.md" && f !== "flags.md").sort();
/** @type {{file: string, line: number, text: string}[]} */
const errors = [], warnings = [], planned = [];
/** @type {Set<string>} */
const plannedNames = new Set();
const WD = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"], WD2 = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const MONTHS = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
const dayIndex = (/** @type {string} */ w) => (WD.indexOf(w) >= 0 ? WD.indexOf(w) : WD2.indexOf(w));
const weekday = (/** @type {number} */ y, /** @type {number} */ m, /** @type {number} */ d) => new Date(Date.UTC(y, m - 1, d)).getUTCDay();
const W = `(${WD.join("|")}|${WD2.join("|")})`;

/** The inline code spans of a line (not in fenced blocks). @param {string} s */
const spans = (s) => [...s.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
/** A span as a name and maybe a value, or null when it is no name. @param {string} t */
function nameOf(t) {
  if (/[\s/<>{}()A-Z"'·]/.test(t) || /\.[a-z]{1,4}$/.test(t)) return null;
  if (/^[0-9a-f]{7,40}$/.test(t)) return null;   // a commit
  const m = /^!?([a-z][a-z0-9_]*)(?:(=|>=|<=|>|<)([^=<>]+))?$/.exec(t);
  return m ? { name: m[1], op: m[2] ?? "", value: m[3] ?? "" } : null;
}

const read = files.map((f) => ({ f, lines: readFileSync(path.join(docsDir, f), "utf8").split(/\r?\n/) }));
const isPlan = (/** @type {string[]} */ lines) => lines.slice(0, 8).some((l) => /Nichts davon ist gebaut/.test(l));
for (const { lines } of read) if (isPlan(lines)) for (const l of lines) for (const t of spans(l)) { const n = nameOf(t); if (n && !known.has(n.name)) plannedNames.add(n.name); }

for (const { f, lines } of read) {
  let fenced = false;
  lines.forEach((l, i) => {
    if (/^\s*```/.test(l)) { fenced = !fenced; return; }
    if (fenced) return;
    const at = { file: f, line: i + 1 };
    for (const t of spans(l)) {
      const n = nameOf(t);
      if (!n) continue;
      // a single word without a digit or an underscore is as often a word of the data's format (`once`, `extras`) as a name: left alone
      if (!known.has(n.name) && !/[_0-9]/.test(n.name)) continue;
      if (!known.has(n.name)) {
        // a line that says the name is for later ("geplant", "später", "Kap. 4") names it as planned
        const later = plannedNames.has(n.name) || /geplant|später|Kap\. [2-9]/.test(l);
        (later ? planned : warnings).push({ ...at, text: `\`${t}\`: ${later ? "geplant" : "kennt das Spiel nicht"}` });
        continue;
      }
      if (n.op === "=" && flags.has(n.name) && !/^\d+$/.test(n.value)) {
        const vals = valuesOf(n.name);
        if (vals && !vals.includes("…") && !vals.includes("number") && !vals.includes(n.value))
          errors.push({ ...at, text: `\`${t}\`: "${n.name}" wird nie auf "${n.value}" gesetzt (${vals.join(", ")})` });
      }
    }
    // a weekday beside a date: "Mi, 7.11.", "Dienstag, 2091-11-06", "Sonntag, 14. Oktober", "Samstag 10. bis Montag 12. November"
    /** @param {string} w @param {number} y @param {number} m @param {number} d @param {string} what */
    const check = (w, y, m, d, what) => {
      if (m < 1 || m > 12 || d < 1 || d > 31) return;
      const want = weekday(y, m, d);
      if (dayIndex(w) !== want) errors.push({ ...at, text: `"${what}": der ${d}.${m}.${y} ist ein ${WD[want]}` });
    };
    for (const m of l.matchAll(new RegExp(`\\b${W}\\.?,? (\\d{1,2})\\.(\\d{1,2})\\.(\\d{4})?`, "g"))) check(m[1], Number(m[4] ?? 2091), Number(m[3]), Number(m[2]), m[0]);
    for (const m of l.matchAll(new RegExp(`\\b${W},? (\\d{4})-(\\d{2})-(\\d{2})`, "g"))) check(m[1], Number(m[2]), Number(m[3]), Number(m[4]), m[0]);
    for (const m of l.matchAll(new RegExp(`\\b${W},? (?:der |den )?(\\d{1,2})\\. (?:bis ${W} (\\d{1,2})\\. )?(${MONTHS.join("|")})(?: (\\d{4}))?`, "g"))) {
      const mon = MONTHS.indexOf(m[5]) + 1, y = Number(m[6] ?? 2091);
      check(m[1], y, mon, Number(m[2]), m[0]);
      if (m[3]) check(m[3], y, mon, Number(m[4]), m[0]);
    }
  });
}

const show = (/** @type {string} */ head, /** @type {typeof errors} */ list) => {
  if (!list.length) return;
  console.log(head);
  for (const x of list) console.log(`  docs/${x.file}:${x.line}  ${x.text}`);
};
show("FEHLER", errors);
show("unbekannt", warnings);
if (args.includes("--all")) show("geplant", planned);
console.log(`${files.length} Dokumente: ${errors.length} Fehler, ${warnings.length} unbekannte Namen, ${planned.length} geplante Namen` +
  (v.flags?.values ? "" : " (Werte nicht geprüft: der Validator nennt sie nicht)"));

// ---- the register of flags
if (args.includes("--flags")) {
  const keptBy = new Map();
  for (const id of C.act.ids()) for (const f of C.act.get(id)?.keep ?? []) { if (!keptBy.has(f)) keptBy.set(f, []); keptBy.get(f).push(id); }
  const cell = (/** @type {string[] | null} */ l, n = 3) => (!l || !l.length ? "" : l.slice(0, n).map((s) => `\`${s}\``).join(", ") + (l.length > n ? `, … (${l.length})` : "")).replace(/\|/g, "\\|");
  const rows = [...flags].sort().map((f) => `| \`${f}\` | ${cell(valuesOf(f), 8)} | ${cell(listOf(v.flags?.setAt, f))} | ${cell(listOf(v.flags?.testedAt, f))} | ${(keptBy.get(f) ?? []).join(", ")} |`);
  const out = ["# Flags (erzeugt)", "",
    "Erzeugt von `node tools/doc-lint.mjs --flags` aus den Daten des Spiels; nie von Hand ändern. Jedes Flag mit seinen Werten,",
    "wo es gesetzt und wo es abgefragt wird (die ersten drei Stellen) und welcher Akt es übernimmt (`keep`). Die Bedeutung steht im",
    "Kopf der Datei, die es setzt (`game/nagiwa.js` nennt die Muster).", "",
    "| Flag | Werte | gesetzt | abgefragt | übernommen von |", "|---|---|---|---|---|", ...rows, ""];
  writeFileSync(path.join(docsDir, "flags.md"), out.join("\n"));
  console.log(`docs/flags.md: ${rows.length} Flags`);
}
process.exitCode = errors.length ? 1 : 0;

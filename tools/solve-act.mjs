// Solve one act alone, from its start (the whole game would multiply every act by what the ones before leave):
//   node tools/solve-act.mjs kapitel1 [--full] [--max N] [--set flag,flag] [--from graph files] [--workers N] [--json path.json]
// --set: flags for its start: one kept from the act before (with its value: k1a=lied), or off_<thread> to shut a side story (CLAUDE.md, checks);
// --from: the runs of the act before (build/graph/<act>_<run>.js, comma between them; sh tools/graph.sh makes them): the act begun from
// every way they end, as it keeps them, and searched from all at once (the engine's C15); with --full each start must be won;
// --workers: threads that search, default one less than the cores, at most 12.
import { writeFileSync } from "node:fs";
import { availableParallelism } from "node:os";
import { makeSolver, loadFor, describe } from "../lib/cutaway/tools/lib/solver.mjs";
import { startsFor } from "../lib/cutaway/tools/lib/starts.mjs";

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const act = args.find((a, i) => !a.startsWith("--") && !["--max", "--set", "--from", "--workers", "--json"].includes(args[i - 1]));
if (!act) { console.error("usage: node tools/solve-act.mjs <act> [--full] [--max N] [--set flag] [--json out.json]"); process.exit(2); }
const kept = opt("--set");

// alone: going on to the next act ends the search there, as a demo ends after its last act
const setup = { page: "index.html", options: { act, demo: { acts: [act] } }, start: kept ? kept.split(",").map((f) => {
  // flag, or flag=value (an answer kept from the act before: k1a=lied)
  const [k, v] = f.split("=");
  return v === undefined ? { set: k } : { set: k, value: Number.isNaN(Number(v)) ? v : Number(v) };
}) : [] };
const from = opt("--from");
const starts = from ? await startsFor("index.html", act, from.split(",")) : undefined;
if (starts) console.log(`${starts.length} starts from the runs before (${starts.reduce((n, s) => n + s.n, 0)} end states)`);
const solver = await makeSolver(loadFor(setup), { workers: Number(opt("--workers", String(Math.min(12, availableParallelism() - 1)))), setup, starts: starts?.map((s) => s.flags) });
const t0 = Date.now();
let shown = 0;
const progress = (text) => { if (Date.now() - shown > 30000) { shown = Date.now(); process.stderr.write(`  ... ${text}\n`); } };
const r = await solver.search({ full: args.includes("--full"), maxStates: Number(opt("--max", "1000000")), progress });
console.log(`${r.states} states in ${Date.now() - t0} ms${r.complete ? "" : " (stopped at the limit)"}`);
if (!r.solved) { console.log("UNSOLVABLE: no way to the end found"); process.exitCode = 1; }
else {
  console.log(`solved in ${r.path.length} moves:`);
  r.path.forEach((m, i) => console.log(`  ${String(i + 1).padStart(2)}. ${describe(m)}`));
  const out = opt("--json");
  if (out) { writeFileSync(out, JSON.stringify(r.path, null, 1)); console.log("wrote " + out); }
}
if (args.includes("--full")) {
  if (r.starts) {
    const bad = r.starts.map((s, i) => ({ ...s, i })).filter((s) => !s.solved || s.softlocks || s.hints);
    console.log(`starts: ${r.starts.length}, ${bad.length ? `${bad.length} with a problem` : "every one can be won"}`);
    for (const s of bad.slice(0, 10)) console.log(`  start ${s.i} ${JSON.stringify(s.flags)}: ${s.solved ? "can be won" : "CAN'T BE WON"}, ${s.softlocks} soft-locks, ${s.hints} states without a fitting hint`);
  }
  if (!r.complete) { console.log("soft-lock check incomplete: raise --max"); process.exitCode = 1; }   // nothing is proved then
  else if (r.softlocks.length) {
    console.log(`SOFT-LOCKS: ${r.softlocks.length} states can't reach the end. Shortest ways into one:`);
    for (const p of r.softlocks.slice(0, 5)) console.log("  " + p.map(describe).join(" > "));
    process.exitCode = 1;
  } else console.log("no soft-locks");
  if (r.hints) {
    if (r.hints.problems.length) {
      process.exitCode = 1;
      console.log(`HINTS: ${r.hints.problems.length} states without a fitting hint, by kind:`);
      /** @type {Map<string, any[]>} */
      const kinds = new Map();
      for (const p of r.hints.problems) { const k = `hint ${p.hint}: ${p.problem}`; if (!kinds.has(k)) kinds.set(k, []); kinds.get(k).push(p); }
      for (const [k, l] of kinds) console.log(`  ${l.length}x ${k}\n     after: ${l[0].path.slice(-6).map(describe).join(" > ") || "(the start)"}`);
    } else console.log("hints: every state on the way has one");
  }
}

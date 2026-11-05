// Solve one act alone, from its start (the whole game would multiply every act by what the ones before leave):
//   node tools/solve-act.mjs kapitel1 [--full] [--max N] [--set flag,flag] [--workers N] [--json path.json]
// --set: flags for its start: one kept from the act before, or off_<thread> to shut a side story (CLAUDE.md, checks);
// --workers: threads that search, default one less than the cores, at most 12.
import { writeFileSync } from "node:fs";
import { availableParallelism } from "node:os";
import { makeSolver, loadFor, describe } from "../lib/cutaway/tools/lib/solver.mjs";

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const act = args.find((a, i) => !a.startsWith("--") && !["--max", "--set", "--workers", "--json"].includes(args[i - 1]));
if (!act) { console.error("usage: node tools/solve-act.mjs <act> [--full] [--max N] [--set flag] [--json out.json]"); process.exit(2); }
const kept = opt("--set");

// alone: going on to the next act ends the search there, as a demo ends after its last act
const setup = { page: "index.html", options: { act, demo: { acts: [act] } }, start: kept ? kept.split(",").map((f) => ({ set: f })) : [] };
const solver = await makeSolver(loadFor(setup), { workers: Number(opt("--workers", String(Math.min(12, availableParallelism() - 1)))), setup });
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
  if (!r.complete) console.log("soft-lock check incomplete: raise --max");
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

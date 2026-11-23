// Run a check only if something it reads has changed; else say what it said the last time it passed.
//   node tools/cached.mjs [--fresh] <command> [args...]      e.g. node tools/cached.mjs node tools/solve-act.mjs kapitel2 --full --set off_roof
// The long checks (the solver's runs, an hour for Chapter 2's main way; the click paths) read only the game as index.html loads it,
// the engine's tools and the files named on their command line. Their result is kept under a hash of all of that and the command
// (build/check-cache/), and only when it passed (exit 0): a failure runs again, as a run stopped halfway. So after a change to the docs,
// the editor, the art's sources or a tool the game doesn't load, check.sh answers its long runs at once; after a change to the
// game every run is made again (the solver can't tell which part of the game a run touches).
// --fresh: run it anyway (and keep the new result).
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let args = process.argv.slice(2);
const fresh = args[0] === "--fresh";
if (fresh) args = args.slice(1);
if (!args.length) { console.error("usage: node tools/cached.mjs [--fresh] <command> [args...]"); process.exit(2); }

/** every file under a folder @param {string} dir @returns {string[]} */
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
/** what the run writes (graph.mjs --out): no input, but the run is needed again when it is missing */
const written = args.includes("--out") ? path.resolve(root, args[args.indexOf("--out") + 1]) : null;
/** the files a check reads: the page and its scripts (no fetch: that is all the game loads), the engine's tools, this repo's
 * tools a check runs (solve-act.mjs and what it imports), and every argument that names a file (a click path, the graph data of
 * the runs an act starts from), but what it writes */
function inputs() {
  const page = path.join(root, "index.html");
  const scripts = [...readFileSync(page, "utf8").matchAll(/<script src="([^"]+)"/g)].map((m) => path.join(root, m[1]));
  const tools = walk(path.join(root, "lib/cutaway/tools")).filter((f) => /\.(mjs|js)$/.test(f));
  const named = args.map((a) => path.resolve(root, a)).filter((f) => f !== written && existsSync(f) && statSync(f).isFile());
  return [...new Set([page, ...scripts, ...tools, ...named])].sort();
}
const h = createHash("sha1").update(JSON.stringify(args));
for (const f of inputs()) h.update(path.relative(root, f).replace(/\\/g, "/") + "\0").update(existsSync(f) ? readFileSync(f) : "missing").update("\0");
const key = h.digest("hex").slice(0, 20);
const dir = path.join(root, "build/check-cache"), file = path.join(dir, key + ".txt");

if (!fresh && existsSync(file) && (!written || existsSync(written))) {
  // the note first: the checks read a run's last line ("all passed")
  console.log(`(from the cache: nothing it reads has changed since it passed, ${statSync(file).mtime.toISOString().slice(0, 16).replace("T", " ")})`);
  process.stdout.write(readFileSync(file, "utf8"));
  process.exit(0);
}
// run it, its output passed on as it comes (and kept)
const out = [];
const p = spawn(args[0], args.slice(1), { cwd: root, stdio: ["inherit", "pipe", "pipe"] });
p.stdout.on("data", (d) => { out.push(d); process.stdout.write(d); });
p.stderr.on("data", (d) => { out.push(d); process.stderr.write(d); });
p.on("close", (code) => {   // close, not exit: after the last of its output
  if (code === 0) { mkdirSync(dir, { recursive: true }); writeFileSync(file, Buffer.concat(out)); }
  process.exit(code ?? 1);
});

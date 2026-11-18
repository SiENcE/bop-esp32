// Run a shell script of tools/ from anywhere, as the studio's tasks do (studio.json): node tools/sh.mjs tools/build_art.sh room flat
// On Windows the studio starts its tasks from cmd.exe, where "sh" is not on the PATH unless Git Bash put it there (the user found
// "art: room" failing so, 2026-11-18). This finds Git for Windows' sh (its bin\sh.exe sets up the PATH its tools need): from git on the
// PATH, else where Git is usually installed; anywhere else "sh" itself. Exit code and output are the script's.
import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

function findSh() {
  if (process.platform !== "win32") return "sh";
  const tries = [];
  const where = spawnSync("where", ["git"], { encoding: "utf8", shell: true });
  for (const line of (where.stdout ?? "").split(/\r?\n/).filter(Boolean)) {
    // ...\Git\cmd\git.exe or ...\Git\mingw64\bin\git.exe: the install's root is above them
    let dir = path.dirname(line);
    for (let i = 0; i < 3; i++, dir = path.dirname(dir)) tries.push(path.join(dir, "bin", "sh.exe"));
  }
  for (const root of [process.env.ProgramFiles, process.env["ProgramFiles(x86)"], process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, "Programs")])
    if (root) tries.push(path.join(root, "Git", "bin", "sh.exe"));
  return tries.find((p) => existsSync(p)) ?? "sh";
}

const args = process.argv.slice(2);
if (!args.length) { console.error("usage: node tools/sh.mjs <script.sh> [args...]"); process.exit(2); }
const sh = findSh();
const p = spawn(sh, args, { stdio: "inherit", cwd: process.cwd() });
p.on("error", (e) => { console.error(`sh not found (${sh}): ${e.message}. Install Git for Windows, or run the script from Git Bash.`); process.exit(1); });
p.on("exit", (code) => process.exit(code ?? 1));

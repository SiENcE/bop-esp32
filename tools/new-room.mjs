// A new street-mode room, made from a template and baked (docs/editor-iso.md, "Ein neuer Raum"):
//   node tools/new-room.mjs <id> [U] [V]
//       art/rooms/<id>.map.js    the map: a floor U x V meters (default 5 x 4.5) of the kit's plain key "p", two back walls
//                                and two front stubs, one spot (arrive) and one lamp
//       art/rooms/<id>.px.js     its bake file, including the room's own kit
//       art/kit/<id>.kit.px.js   the room's own kit: a plain floor "p" and a plain wall "<id>_wall", to be painted
//       then the bake (sh tools/build_art.sh room <id>: the picture, game/rooms/<id>.layout.js), and only if it built:
//       game/rooms/<id>.js       the room in the game (its picture, walk area, props, lamps; no hotspots, no way in yet)
//       game/places.js           its places from the layout (Nagiwa.at.<id>)
//       index.html               its art, its layout and its room loaded
//   node tools/new-room.mjs --remove <id>
//       takes all of that out again (only a room this tool made: its map says so)
// The editor's Iso tab runs it as the studio's task "room: new" (its button New map).
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const MARK = "made by tools/new-room.mjs";
const args = process.argv.slice(2);
const fail = (/** @type {string} */ msg) => { console.error(msg); process.exit(1); };
const files = (/** @type {string} */ id) => ({
  map: `art/rooms/${id}.map.js`, px: `art/rooms/${id}.px.js`, kit: `art/kit/${id}.kit.px.js`, room: `game/rooms/${id}.js`,
  layout: `game/rooms/${id}.layout.js`, atlas: `assets/room_${id}.js`,
});
const tags = (/** @type {string} */ id) => ({ atlas: `<script src="assets/room_${id}.js"></script>`, layout: `<script src="game/rooms/${id}.layout.js"></script>`, room: `<script src="game/rooms/${id}.js"></script>` });
const read = (/** @type {string} */ f) => readFileSync(f, "utf8");
/** Keep a file's line endings: the text is written with \n, the file may have \r\n. @param {string} f @param {string} text */
const write = (f, text) => writeFileSync(f, existsSync(f) && read(f).includes("\r\n") ? text.replace(/\r?\n/g, "\r\n") : text);
const placesLine = (/** @type {string} */ id) => `  ${id}: fromLayout(Nagiwa.layouts.${id}),`;

if (args[0] === "--remove") {
  const id = args[1] ?? "", f = files(id);
  if (!existsSync(f.map) || !read(f.map).includes(MARK)) fail(`${f.map}: not a room this tool made; nothing removed`);
  for (const p of Object.values(f)) rmSync(p, { force: true });
  rmSync(`build/art/rooms/${id}`, { recursive: true, force: true });
  for (const p of [`build/art/rooms/${id}.log`, `build/art/rooms/${id}.pick.json`]) rmSync(p, { force: true });
  const t = tags(id);
  write("index.html", read("index.html").split(/\r?\n/).filter((l) => !Object.values(t).includes(l.trim())).join("\n"));
  write("game/places.js", read("game/places.js").split(/\r?\n/).filter((l, i, all) => l !== placesLine(id) && !(all[i + 1] === placesLine(id) && l.startsWith("  // ") && l.includes(`art/rooms/${id}.map.js`))).join("\n"));
  console.log(`${id}: removed (its map, bake file, kit, room, layout, art; its lines in index.html and game/places.js)`);
  process.exit(0);
}

const [id, Us = "5", Vs = "4.5"] = args;
if (!/^[a-z][a-z0-9_]*$/.test(id ?? "")) fail("usage: node tools/new-room.mjs <id> [U] [V]   (id: small letters, digits, _; U and V in meters)");
const U = Number(Us), V = Number(Vs), cell = 0.5;
if (!(U >= 1 && V >= 1 && U <= 40 && V <= 40) || Math.abs(U / cell - Math.round(U / cell)) > 1e-6 || Math.abs(V / cell - Math.round(V / cell)) > 1e-6) fail(`U and V: meters from 1 to 40, in steps of ${cell}`);
const f = files(id);
const taken = Object.values(f).filter((p) => existsSync(p));
if (taken.length) fail(`${id} is taken: ${taken.join(", ")}`);
if (new RegExp(`Cutaway\\.room\\(\\s*["'\`]${id}["'\`]`).test(execFileSync("git", ["grep", "-h", "Cutaway.room(", "--", "game"], { encoding: "utf8" }))) fail(`${id}: the game has a room of that name already`);

const n = (/** @type {number} */ x) => String(Math.round(x * 100) / 100);
// the back corner where a room of the flat's size has it (152, 86), moved so the room stays in the middle
const at = [Math.round(160 + (V - U) * 16), 86];
const nu = Math.round(U / cell), nv = Math.round(V / cell);
const CONST = `KIT_${id.toUpperCase()}`;

write(f.map, `// ${id}: a new room as a map (art/lib/isomap.js has the format), ${MARK}. Every length in meters.
// Edit it in the editor's Iso tab (docs/editor-iso.md) and bake it there, or here and with sh tools/build_art.sh room ${id}.
"use strict";

ISO_MAPS.${id} = {
  size: [${n(U)}, ${n(V)}], cell: ${cell}, at: [${at.join(", ")}], screen: [320, 180], margin: 0.2,
  // "p" the room's plain floor (art/kit/${id}.kit.px.js), "." no floor
  floor: [
${Array.from({ length: nv }, () => `    "${"p".repeat(nu)}",`).join("\n")}
  ],
  walls: [
    { from: [0, 0], to: [${n(U)}, 0], h: 2.6, kit: "${id}_wall" },        // 0: the right back wall
    { from: [0, 0], to: [0, ${n(V)}], h: 2.6, kit: "${id}_wall" },        // 1: the left back wall
    { from: [0, ${n(V)}], to: [${n(U)}, ${n(V)}], h: 2.6, kit: "${id}_wall", stub: true },
    { from: [${n(U)}, 0], to: [${n(U)}, ${n(V)}], h: 2.6, kit: "${id}_wall", stub: true },
  ],
  openings: [],
  props: [],
  spots: {
    arrive: [${n(U / 2)}, ${n(V / 2)}, "sw"],
  },
  lights: [
    { id: "lamp", at: [${n(U / 2)}, ${n(V / 2)}, 2.4], r: 120, power: 1, color: "#ffd8a0", bake: { reach: ${n(Math.max(U, V))}, power: 1.2 } },
  ],
};
`);

write(f.px, `// ${id} baked from its map (art/rooms/${id}.map.js) with its kit (art/kit/${id}.kit.px.js) and the light
// (art/lib/isokit.js); ${MARK}. More kits: include them below (their pieces show in the Iso tab's lists).
//
// Exports (the atlas takes ${id}_* only): ${id}_bg (320x180) and a sprite for each prop, outlined, pivot bottom-centre.
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/${id}.map.js")
include("../lib/isokit.js")
include("../kit/${id}.kit.px.js")

const ${id.toUpperCase()} = ISOKIT.bake(ISO_MAPS.${id}, { id: "${id}", frames: 12, fps: 10 })

// the measured numbers for the game: tools/build_art.sh picks this line up and writes game/rooms/${id}.layout.js
console.log("ISO_LAYOUT " + JSON.stringify({ id: "${id}", ...${id.toUpperCase()}.layout }))
`);

write(f.kit, `// The kit pieces ${id} needs (art/rooms/${id}.map.js), ${MARK}: placeholders to paint over (read the style guide
// and the pxl skill first). Registered with ISOKIT (art/lib/isokit.js has the calls), drawn in room meters, lit by the
// bake; keys of the world palette (art/lib/iso.js). A kit's names are global in a bake: keep this one's prefixed.
//
//   floor    p  plain screed, a joint every meter
//   walls    ${id}_wall  plain paint over a dark skirting

const ${CONST} = (() => {
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w

  ISOKIT.floor("p", (u, v) => (near(u, Math.round(u)) || near(v, Math.round(v)) ? "e" : "z"))
  ISOKIT.wall("${id}_wall", (s, h) => (h < 0.08 ? (h >= 0.055 ? "4" : "1") : "3"))

  return {}
})()
`);

console.log(`${id}: wrote ${f.map}, ${f.px}, ${f.kit}; baking ...`);
try {
  execFileSync("sh", ["tools/build_art.sh", "room", id], { stdio: "inherit" });
} catch {
  fail(`${id}: the bake failed; the map, bake file and kit stay (fix them and build with sh tools/build_art.sh room ${id}, or take them out with --remove ${id})`);
}
if (!existsSync(f.layout) || !existsSync(f.atlas)) fail(`${id}: the bake wrote no layout or no art`);

write(f.room, `// ${id}: a new room baked from its map (art/rooms/${id}.map.js), ${MARK}: its picture, walk area, props and lamps
// come from the bake (game/rooms/${id}.layout.js, Nagiwa.at.${id}). No hotspots and no way in yet.
"use strict";

(function () {
  const A = Nagiwa.at.${id};
  Cutaway.room("${id}", {
    name: "Neuer Raum", background: "${id}_bg",
    walk: A.walk, holes: A.holes, props: A.props,
    light: { ambient: 0.8, lamps: A.lamps.map((/** @type {any} */ { bake, zone, ...lamp }) => lamp) },
    hotspots: {},
  });
})();
`);

// its places, after the last room measured from a layout
const places = read("game/places.js").split(/\r?\n/);
const last = places.reduce((k, l, i) => (/^  \w+: fromLayout\(Nagiwa\.layouts\.\w+\),$/.test(l) ? i : k), -1);
if (last < 0) fail("game/places.js: no room from a layout to put this one after");
places.splice(last + 1, 0, `  // ${id} (art/rooms/${id}.map.js, game/rooms/${id}.layout.js)`, placesLine(id));
write("game/places.js", places.join("\n"));

// index.html: the art after the last room's art, the layout after the last layout, the room after the last room file
const html = read("index.html").split(/\r?\n/), t = tags(id);
/** @param {RegExp} re @param {string} line */
const after = (re, line) => { const k = html.reduce((j, l, i) => (re.test(l.trim()) ? i : j), -1); if (k < 0) fail(`index.html: nothing like ${re} to put ${line} after`); html.splice(k + 1, 0, line); };
after(/^<script src="assets\/room_\w+\.js"><\/script>$/, t.atlas);
after(/^<script src="game\/rooms\/\w+\.layout\.js"><\/script>$/, t.layout);
after(/^<script src="game\/rooms\/\w+\.js"><\/script>$/, t.room);
write("index.html", html.join("\n"));
console.log(`${id}: made. The game loads it after a reload (index.html, game/places.js, ${f.room}); paint its kit (${f.kit}), give it its ways in and its hotspots.`);

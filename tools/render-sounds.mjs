// Render the game's sounds (game/sounds.js) offline in headless Chrome, to listen to them without playing:
//   node tools/render-sounds.mjs [--only tag,rec] [--out build/sounds]
// Writes <out>/<name>.wav for each, and <out>/all.wav: every one in turn with half a second between, its
// start times printed. Loops (ambience) can't be rendered by the engine: they come out as 3 s of their
// noise and tone, without the crackle and the wobble (an approximation; hear them in the game).
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { launch } from "../lib/cutaway/tools/lib/chrome.mjs";

const args = process.argv.slice(2);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d; };
const out = opt("--out", "build/sounds"), only = opt("--only", "");
mkdirSync(out, { recursive: true });

const chrome = await launch();
try {
  await chrome.open(pathToFileURL(resolve("index.html")).href + "?manual&nointro");
  const r = await chrome.ev(`(async () => {
    const only = ${JSON.stringify(only)}.split(",").filter(Boolean);
    const names = Nagiwa.sounds.filter((n) => !only.length || only.includes(n));
    const parts = (d) => [].concat(d.tone ?? [], d.noise ?? []);
    const len = (d) => Math.max(...parts(d).map((p) => (p.at ?? 0) + (p.ms ?? 300))) / 1000 + 0.15;
    const rate = 44100, done = [];
    for (const n of names) {
      let d = Cutaway.sfx.get(n), name = n, loop = false;
      if (d.loop) {                          // a loop as a 3 s one-shot of its noise and tone
        const l = d.loop, g = l.gain ?? 0.1;
        d = { noise: l.noise ? { filter: l.noise.filter, from: l.noise.freq, q: l.noise.q, ms: 3000, attack: 300, gain: g * 4 } : undefined,
          tone: l.tone ? { wave: l.tone.wave, from: l.tone.freq, ms: 3000, attack: 300, gain: g * 4 } : undefined };
        name = "_preview_" + n; loop = true;
        Cutaway.sfx.define(name, d);
      }
      const buf = await Cutaway.sfx.render(name, len(d));
      done.push({ n, loop, buf });
    }
    const gap = Math.round(rate * 0.5), total = done.reduce((s, x) => s + x.buf.length + gap, 0);
    const all = new AudioBuffer({ length: total, numberOfChannels: 2, sampleRate: rate });
    let at = 0;
    const marks = [], files = {}, b64 = (bytes) => { let s = ""; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s); };
    let peak = 0;
    for (const x of done) {
      for (let c = 0; c < 2; c++) { const src = x.buf.getChannelData(Math.min(c, x.buf.numberOfChannels - 1)); all.getChannelData(c).set(src, at); for (const v of src) peak = Math.max(peak, Math.abs(v)); }
      marks.push([x.n, at / rate, x.buf.length / rate, x.loop]);
      files[x.n] = b64(Cutaway.music.wav(x.buf));
      at += x.buf.length + gap;
    }
    return { marks, files, all: b64(Cutaway.music.wav(all)), peak };
  })()`);
  for (const [n, data] of Object.entries(r.files)) writeFileSync(join(out, `${n}.wav`), Buffer.from(data, "base64"));
  writeFileSync(join(out, "all.wav"), Buffer.from(r.all, "base64"));
  for (const [n, t, l, loop] of r.marks) console.log(`${t.toFixed(2).padStart(7)} s  ${n}${loop ? " (loop, approximated)" : ""}  ${(l * 1000).toFixed(0)} ms`);
  console.log(`peak ${r.peak.toFixed(3)}; wrote ${r.marks.length} sounds and all.wav to ${out}`);
  for (const e of chrome.errors) console.error(e);
  process.exitCode = chrome.errors.length || r.peak > 1 ? 1 : 0;
} finally {
  await chrome.close();
}

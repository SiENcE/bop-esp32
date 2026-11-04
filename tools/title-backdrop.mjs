// The menu screen's backdrop, brought down to the screen: art/ui/title_bg.px.js bakes Kowalski Street whole on a
// taller picture (title_tall, 416x234, 12 frames); this writes title_bg (320x180, the same frames) beside it, in
// pxl's anim format, for the atlas. Each pixel of the smaller picture is the average of the area it covers,
// snapped back to the nearest colour of the frame itself (so it stays in the palette; no blur, no new tones).
//   node tools/title-backdrop.mjs [dir]       (default build/art/title/anims)
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { decode, encode } from "../lib/cutaway/tools/lib/png.mjs";

const dir = process.argv[2] ?? "build/art/title/anims";
const src = JSON.parse(readFileSync(path.join(dir, "title_tall.json"), "utf8"));
const sheet = decode(readFileSync(path.join(dir, src.meta.image)));
const frames = Object.values(src.frames), OW = 320, OH = 180;
const out = new Uint8Array(OW * frames.length * OH * 4);

frames.forEach((fr, n) => {
  const { x: fx, y: fy, w: W, h: H } = fr.frame, sx = W / OW, sy = H / OH;
  const at = (x, y) => ((fy + y) * sheet.width + fx + x) * 4;
  // the frame's own colours, to snap to
  const pal = new Map();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = at(x, y); pal.set((sheet.data[i] << 16) | (sheet.data[i + 1] << 8) | sheet.data[i + 2], [sheet.data[i], sheet.data[i + 1], sheet.data[i + 2]]); }
  const colours = [...pal.values()], snapped = new Map();
  const snap = (r, g, b) => {
    const key = (r << 16) | (g << 8) | b;
    let best = snapped.get(key);
    if (!best) {
      let d = Infinity;
      for (const c of colours) { const e = (c[0] - r) ** 2 + (c[1] - g) ** 2 + (c[2] - b) ** 2; if (e < d) { d = e; best = c; } }
      snapped.set(key, best);
    }
    return best;
  };
  for (let y = 0; y < OH; y++) for (let x = 0; x < OW; x++) {
    const x0 = x * sx, x1 = x0 + sx, y0 = y * sy, y1 = y0 + sy;
    let r = 0, g = 0, b = 0, wsum = 0;
    for (let j = Math.floor(y0); j < Math.min(H, Math.ceil(y1)); j++) {
      const wy = Math.min(y1, j + 1) - Math.max(y0, j);
      for (let i = Math.floor(x0); i < Math.min(W, Math.ceil(x1)); i++) {
        const w = (Math.min(x1, i + 1) - Math.max(x0, i)) * wy, k = at(i, j);
        r += sheet.data[k] * w; g += sheet.data[k + 1] * w; b += sheet.data[k + 2] * w; wsum += w;
      }
    }
    const c = snap(Math.round(r / wsum), Math.round(g / wsum), Math.round(b / wsum)), o = (y * OW * frames.length + n * OW + x) * 4;
    out[o] = c[0]; out[o + 1] = c[1]; out[o + 2] = c[2]; out[o + 3] = 255;
  }
});

const json = { frames: {}, meta: { ...src.meta, image: "title_bg.png", size: { w: OW * frames.length, h: OH }, frameTags: [{ name: "title_bg", from: 0, to: frames.length - 1, direction: "forward" }] } };
frames.forEach((fr, n) => {
  json.frames[`title_bg_${n}`] = { frame: { x: n * OW, y: 0, w: OW, h: OH }, rotated: false, trimmed: false,
    spriteSourceSize: { x: 0, y: 0, w: OW, h: OH }, sourceSize: { w: OW, h: OH }, duration: fr.duration ?? 100, pivot: { x: 0, y: 0 } };
});
writeFileSync(path.join(dir, "title_bg.png"), encode({ width: OW * frames.length, height: OH, data: out }));
writeFileSync(path.join(dir, "title_bg.json"), JSON.stringify(json, null, 1));
console.log(`title_bg: ${frames.length} frames ${OW}x${OH} from title_tall ${frames[0].frame.w}x${frames[0].frame.h}`);

// The menu screen's backdrop (style guide §8a "Title screen"): Kowalski Street seen whole, as a still. The
// street's map and kit (art/rooms/kowalski.map.js, art/kit/kowalski.kit.px.js) baked as the game bakes it, but
// on a taller picture (more facade above, more street below: 416x234, the floor carried on toward the
// viewer) with its props and a patrol drone hovering before the ad screen (art/characters/drone.px.js); then
// tools/title-backdrop.mjs brings each frame down to the screen, 320x180 (a 13:10 reduction, the colours kept
// to the picture's own), so the whole street shows on one screen.
//   title_tall    416x234, a 12-frame loop at 10 fps (the screen's static, the stuttering Y, rain rings,
//                  splashes, steam): the source; title_bg is written from it
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/kowalski.map.js")
{
  // the same street, the picture 27 px taller above and below, the floor three rows longer toward us
  const M = ISO_MAPS.kowalski, last = M.floor[M.floor.length - 1]
  ISO_MAPS.kowalski = { ...M, at: [M.at[0], M.at[1] + 27], screen: [416, 234], size: [M.size[0], M.size[1] + 1.5],
    floor: [...M.floor, last, last, last], walls: M.walls.map((w) => (w.from[0] === w.to[0] ? { ...w, to: [0, M.size[1] + 1.5] } : w)) }
}
include("../lib/isokit.js")
include("../kit/kowalski.kit.px.js", { palette: true })
include("../characters/drone.px.js")

const TB_MAP = ISO_MAPS.kowalski, TB_P = ISOMAP.projector(TB_MAP)
const TB = ISOKIT.bake(TB_MAP, {
  id: "_tb", frames: 12, fps: 10,
  sheen: { reach: 3.4, map: (u, v) => (KOW.inPuddle(u, v) ? ISO.MIRROR : ISO.SHEEN), keys: (u, v) => KOW.cellAt(u, v) !== "." },
  glows: [
    (c) => { const f = c.frame ?? 0, r = c.rng(40 + f); for (let i = 0; i < 50; i++) { const x = Math.floor(r() * 416), y = Math.floor(r() * 234), [u, v] = TB_P.uvAt(x, y); if (u < 0.15 || v < 0.15 || u > 7 || v > 7.5) continue; c.px(x, y, "6"); c.px(x - 1, y - 1, "x"); c.px(x + 1, y - 1, "x") } },
    (c) => { const f = c.frame ?? 0, [px, py] = TB_P.P(2.95, 2.3, 1.22), [gx, gy] = TB_P.P(4.75, 1.25, 0)
      c.plume(px, py, "HhZ", { every: 3, life: 24, rise: 20, wind: -0.15, size: [2, 4], seed: 3, frame: f })
      c.plume(gx, gy, "hZz", { every: 3, life: 24, rise: 26, wind: -0.3, size: [1, 4], seed: 7, frame: f }) },
    glow("m", { r: 5, strength: 0.45 }), glow("vV", { r: 4, strength: 0.3 }), glow("RW", { r: 4, strength: 0.35 }), glow("q", { r: 3, strength: 0.6 }),
  ],
})
// the drone before the screen, high over the sidewalk; its searchlight's beam down to the street (light
// falloff: dithered), its pool there
const TB_DRONE = TB_P.P(5.6, 2.2, 3.0), TB_POOL = TB_P.P(4.9, 3.0, 0)
anim("title_tall", { w: 416, h: 234, frames: 12, fps: 10 }, (c) => {
  const t = (c.frame ?? 0) * 100
  c.stamp("_tb_bg", 0, 0, { t })
  // the searchlight: a cone from the lens widening to its pool, lightening what it falls on a step along the
  // cold light's table (dithered, denser toward the street), the pool two steps at its heart
  const [dx, dy] = TB_DRONE, [lx, ly] = TB_POOL, T = ISOKIT.TINT.cold
  const lit = (x, y, step) => { const k = c.key(x, y), to = k && T[k]?.[step]; if (to) c.px(x, y, to) }
  for (let y = dy + 4; y <= ly + 8; y++) for (let x = Math.min(dx, lx) - 30; x <= Math.max(dx, lx) + 30; x++) {
    const pool = Math.hypot((x - lx) / 22, (y - ly) / 8)
    if (pool < 1) { const p = 1 - pool; if (ISO.bay(x, y) < 0.45 + p) { lit(x, y, 1); if (p > 0.4 && ISO.bay(x + 2, y + 1) < p) lit(x, y, 1) } continue }
    const k = (y - dy) / (ly - dy); if (k > 1) continue
    const cx = dx + (lx - dx) * k, half = 2 + 20 * k
    if (Math.abs(x - cx) > half) continue
    if (ISO.bay(x, y) < 0.15 + 0.35 * k) lit(x, y, ISO.bay(x + 1, y + 2) < 0.3 ? 1 : 0)
    // the rain caught in the beam: short streaks, falling a frame at a time
    if ((x * 7 + Math.floor((y - (c.frame ?? 0) * 4) / 4) * 13) % 37 === 0 && (y + x) % 4 < 3) c.px(x, y, "H")
  }
  for (const id of ["lights", "vending", "scaffold", "cart", "umbrella", "bins"]) { const p = TB.props[id]; if (p) c.stamp(p.name, p.at[0], p.at[1], { t }) }
  c.stamp("drone_hover", dx, dy + 6, { t })
})

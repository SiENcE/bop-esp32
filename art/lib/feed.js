// Feed mode's shared art: the hijacked cameras (style guide §9 and §12), taken from the approved
// mockup art/mockups/mock_e_cctv.px.js. A camera file includes this, describes its place as a
// blockout (boxes and cylinders in meters, lights, materials), sets a camera, and bakes the view:
//
//   include("../lib/feed.js")
//   pal(PHOSPHOR); ramps(PH)
//   const CAM = makeCam({ pos: [0, 6, 0], yaw: 10, pitch: 45, F: 190, w: 320, h: 180, k: 0.14 })
//   const WORLD = feedWorld({ prims: [block(...), cyl(...)], lights: [...], materials: {...} })
//   scene("cam03_bg", { w: 320, h: 180, bg: "0" }, (c) => paintFeed(c, bakeFeed(CAM, WORLD)))
//
// World axes: x right, y up, z away (at yaw 0); the ground is the plane y = 0 (material "floor"
// unless the world says otherwise). What this bakes is the CLEAN phosphor picture: the light, the
// wet ground's reflections, the lens's barrel bend and a little edge falloff, quantized onto the ten
// phosphor steps with an ordered dither. Scanlines, noise, the rolling band, the vignette and rain
// streaks are drawn live by the engine (room `post`), the implant overlay and the OSD by the game;
// reviewFx() below only imitates them for review images.

// ================================================================ the phosphor ramp
const PHOSPHOR = {
  0: "#030a0a", 1: "#071514", 2: "#0c221f", 3: "#12332d", 4: "#1a483e",     // teal-black ...
  5: "#266252", 6: "#388169", 7: "#55a585", 8: "#8acfae", 9: "#d4f7e2",     // ... to pale green
}
const PH = "0123456789"

// ================================================================ small maths
const D2R = Math.PI / 180
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s]
const norm = (a) => mul(a, 1 / Math.hypot(a[0], a[1], a[2]))
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
// a stable hash in [0, 1)
const ih = (a, b = 0, s = 0) => { let h = (a * 374761393 + b * 668265263 + s * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }

// ================================================================ the camera and its lens
// yaw turns right (toward +x), pitch looks down, F is the focal length in px. k bends the lens
// (barrel); s zooms back in so the middle of each side edge stays at the edge.
function makeCam({ pos, yaw, pitch, F, w, h, k = 0 }) {
  const ya = yaw * D2R, p = pitch * D2R
  const f = [Math.sin(ya) * Math.cos(p), -Math.sin(p), Math.cos(ya) * Math.cos(p)]
  const r = [Math.cos(ya), 0, -Math.sin(ya)]
  return { pos, f, r, u: cross(f, r), F, w, h, cx: w / 2, cy: h / 2, k, s: 1 / (1 + k) }
}
// screen pixel -> ray direction (undoing the lens)
function rayDir(cam, x, y) {
  const nx = (x - cam.cx) / cam.cx, ny = (y - cam.cy) / cam.cx, rd = Math.hypot(nx, ny)
  const g = rd > 0 ? cam.s * (1 + cam.k * rd * rd) : cam.s
  const ux = nx * g * cam.cx / cam.F, uy = ny * g * cam.cx / cam.F
  return norm(add(add(cam.f, mul(cam.r, ux)), mul(cam.u, -uy)))
}
// world point -> screen pixel (through the lens): [x, y, depth]
function project(cam, P) {
  const d = sub(P, cam.pos), zc = dot(d, cam.f)
  const ux = cam.F * dot(d, cam.r) / zc / cam.cx, uy = -cam.F * dot(d, cam.u) / zc / cam.cx
  const ru = Math.hypot(ux, uy)
  let rd = ru / cam.s
  for (let i = 0; i < 8; i++) { const fn = cam.s * rd * (1 + cam.k * rd * rd) - ru, df = cam.s * (1 + 3 * cam.k * rd * rd); rd -= fn / df }
  const g = ru > 0 ? rd / ru : 1 / cam.s
  return [cam.cx + ux * g * cam.cx, cam.cy + uy * g * cam.cx, zc]
}
// the same, in whole pixels
const at = (cam, P) => { const p = project(cam, P); return [Math.round(p[0]), Math.round(p[1]), p[2]] }
// px per meter at a world point (across), for sizing what is placed there
const ppm = (cam, P) => { const a = project(cam, P), b = project(cam, add(P, [1, 0, 0])); return Math.hypot(b[0] - a[0], b[1] - a[1]) }
// how tall a standing person of h meters is on screen with the feet at P (px); /24 is Cutaway's
// scale for the feed figures (24 px tall at scale 1)
const personPx = (cam, P, h = 1.75) => { const a = project(cam, P), b = project(cam, add(P, [0, h, 0])); return Math.hypot(b[0] - a[0], b[1] - a[1]) }
// the screen's bounding rect [x, y, w, h] of world points
function rectOf(cam, pts, pad = 0) {
  const p = pts.map((P) => project(cam, P))
  const x0 = Math.floor(Math.min(...p.map((q) => q[0]))) - pad, y0 = Math.floor(Math.min(...p.map((q) => q[1]))) - pad
  const x1 = Math.ceil(Math.max(...p.map((q) => q[0]))) + pad, y1 = Math.ceil(Math.max(...p.map((q) => q[1]))) + pad
  return [x0, y0, x1 - x0, y1 - y0]
}
// the 8 corners of a box [a, b]
const boxCorners = (a, b) => [0, 1, 2, 3, 4, 5, 6, 7].map((i) => [i & 1 ? b[0] : a[0], i & 2 ? b[1] : a[1], i & 4 ? b[2] : a[2]])

// ================================================================ the blockout
// block(): a box from corner a to corner b; a vertical cylinder (a post, a stool, a pot) at x, z.
// Options: shadow: false (casts no shadow), hit: false (lights only, never seen), anything else is
// handed to the material as hit.prim.
const block = (a, b, m, o = {}) => ({ kind: "box", a, b, m, ...o })
const cyl = (x, z, r, y0, y1, m, o = {}) => ({ kind: "cyl", c: [x, z], r, y0, y1, m, ...o })

function hitBox(o, d, b) {
  let t0 = -Infinity, t1 = Infinity, ax = 0, sg = 0
  for (let i = 0; i < 3; i++) {
    if (Math.abs(d[i]) < 1e-9) { if (o[i] < b.a[i] || o[i] > b.b[i]) return null; continue }
    let ta = (b.a[i] - o[i]) / d[i], tb = (b.b[i] - o[i]) / d[i], s = -1
    if (ta > tb) { const q = ta; ta = tb; tb = q; s = 1 }
    if (ta > t0) { t0 = ta; ax = i; sg = s }
    if (tb < t1) t1 = tb
    if (t0 > t1) return null
  }
  if (t0 < 1e-4) return null
  const n = [0, 0, 0]; n[ax] = sg
  return { t: t0, n }
}
function hitCyl(o, d, c) {
  let best = null
  const ox = o[0] - c.c[0], oz = o[2] - c.c[1]
  const A = d[0] * d[0] + d[2] * d[2]
  if (A > 1e-12) {
    const B = 2 * (ox * d[0] + oz * d[2]), C = ox * ox + oz * oz - c.r * c.r, disc = B * B - 4 * A * C
    if (disc >= 0) {
      const t = (-B - Math.sqrt(disc)) / (2 * A), y = o[1] + d[1] * t
      if (t > 1e-4 && y >= c.y0 && y <= c.y1) best = { t, n: norm([ox + d[0] * t, 0, oz + d[2] * t]) }
    }
  }
  if (Math.abs(d[1]) > 1e-9) {
    for (const [yy, ny] of [[c.y1, 1], [c.y0, -1]]) {
      const t = (yy - o[1]) / d[1]
      if (t <= 1e-4 || (best && t >= best.t)) continue
      const px = ox + d[0] * t, pz = oz + d[2] * t
      if (px * px + pz * pz <= c.r * c.r && Math.sign(-d[1]) === ny) best = { t, n: [0, ny, 0] }
    }
  }
  return best
}
const hitPrim = (o, d, p) => p.kind === "cyl" ? hitCyl(o, d, p) : hitBox(o, d, p)

// A world: { prims, lights, materials, ambient, ground, sky, rain }.
//  prims     block()/cyl() list
//  lights    { p: [x, y, z], I, R, shadow?, dir?, cone?, soft?, haze? }: a point light falling off
//            over R meters; with dir and cone (degrees) a spot; haze > 0 marches the spot's beam
//            through the rain; shadow: true casts shadow rays (the blockout's prims)
//  materials { name: (P, n, f, hit) => ({ a, e, wet?, gloss? }) | { a, e } | number }:
//            a is albedo (lit by the lights), e glow (added as is); wet 0..1 on an upward face
//            makes a mirror (puddles), gloss a dull sheen (default 0.18 where wet is given)
//  ambient   the night's fill (0.13 in the mockup)
//  ground    the material of the plane y = 0, or null for none
//  sky       what a ray that hits nothing sees
//  rain      0..1: ripples in the puddles
function feedWorld(o) {
  const W = { prims: [], lights: [], materials: {}, ambient: 0.13, ground: "floor", sky: 0.03, rain: 1, ...o }
  for (const L of W.lights) if (L.dir) { L.dir = norm(L.dir); L.cosOut = Math.cos((L.cone ?? 30) * D2R); L.cosIn = Math.cos(((L.cone ?? 30) - (L.soft ?? 6)) * D2R) }
  return W
}

function traceRay(W, o, d, tMax = Infinity) {
  let best = null
  if (W.ground && d[1] < 0) { const t = -o[1] / d[1]; if (t > 1e-4 && t < tMax) best = { t, n: [0, 1, 0], m: W.ground, prim: null } }
  for (const p of W.prims) {
    if (p.hit === false) continue
    const h = hitPrim(o, d, p)
    if (h && h.t < tMax && (!best || h.t < best.t)) { h.m = p.m; h.prim = p; best = h }
  }
  if (best) best.p = add(o, mul(d, best.t))
  return best
}
// is the segment from P to the light blocked?
function blocked(W, P, L) {
  const d = sub(L.p, P), dist = Math.hypot(d[0], d[1], d[2]), u = mul(d, 1 / dist)
  for (const p of W.prims) {
    if (p.shadow === false || p.hit === false) continue
    const h = hitPrim(P, u, p)
    if (h && h.t < dist - 0.05) return true
  }
  return false
}
function spotFactor(L, P) {
  if (!L.dir) return 1
  const d = sub(P, L.p), cs = dot(d, L.dir) / Math.hypot(d[0], d[1], d[2])
  return clamp((cs - L.cosOut) / (L.cosIn - L.cosOut), 0, 1)
}
function lightAt(W, P, n) {
  let s = W.ambient * (n[1] > 0 ? 1 : 0.75)
  const Q = add(P, mul(n, 0.02))
  for (const L of W.lights) {
    const d = sub(L.p, P), dist = Math.hypot(d[0], d[1], d[2])
    const ndl = Math.max(0, dot(n, d) / dist)
    const sp = spotFactor(L, P)
    if (sp <= 0) continue
    let v = L.I * sp * (0.25 + 0.75 * ndl) * (ndl > 0 ? 1 : 0.3) / (1 + (dist / L.R) ** 2)
    if (v > 0.004 && L.shadow && blocked(W, Q, L)) v *= L.shadowKeep ?? 0.12
    s += v
  }
  return s
}
function materialOf(W, hit, f) {
  const m = W.materials[hit.m]
  if (m === undefined) return { a: 0.2, e: 0 }
  if (typeof m === "number") return { a: m, e: 0 }
  if (typeof m === "function") return m(hit.p, hit.n, f, hit)
  return m
}
function shadeHit(W, hit, f, mat = materialOf(W, hit, f)) {
  return (mat.a ?? 0) * lightAt(W, hit.p, hit.n) * 1.6 + (mat.e ?? 0)
}

// The light coming back along a ray from o: the surface, its reflection if wet (a puddle mirrors
// what glows), and through glass: a material with see > 0 lets that much of what lies behind through.
function along(W, o, d, f, depth = 0) {
  const hit = traceRay(W, o, d)
  if (!hit) return { v: W.sky, hit }
  const mat = materialOf(W, hit, f)
  let v = shadeHit(W, hit, f, mat)
  if (mat.see > 0 && depth < 3) {
    const back = along(W, add(hit.p, mul(d, 0.01)), d, f, depth + 1).v
    v = v * (1 - mat.see) + back * mat.see
  } else if (mat.wet !== undefined && hit.n[1] > 0.5 && depth < 2) {
    const [px, , pz] = hit.p, wet = mat.wet
    const k = (mat.gloss ?? 0.18) + 0.62 * wet
    const rip = W.rain * (vnoise(px * 7, pz * 7 + f * 0.9) - 0.5) * (0.04 + 0.05 * (1 - wet))
    const rd = norm([d[0] + rip, -d[1], d[2] + rip])
    const rv = along(W, add(hit.p, [0, 0.01, 0]), rd, f, 2).v
    v = v * (1 - 0.35 * wet) + k * rv
  }
  return { v, hit }
}
// the light reaching the lens along one ray, plus the beams of hazy spots
function radiance(cam, W, d, f = 0) {
  const { v: v0, hit } = along(W, cam.pos, d, f)
  let v = v0
  // beams: spots with haze, marched through the rain
  const tMax = Math.min(hit ? hit.t : 40, 40)
  for (const L of W.lights) {
    if (!L.haze || !L.dir) continue
    let beam = 0
    const N = 24
    for (let i = 0; i < N; i++) {
      const t = tMax * (i + 0.5) / N, P = add(cam.pos, mul(d, t))
      const q = sub(P, L.p), dist = Math.hypot(q[0], q[1], q[2]), cs = dot(q, L.dir) / dist
      if (cs > L.cosOut) beam += tMax / N * clamp((cs - L.cosOut) / (L.cosIn - L.cosOut), 0, 1) / (1 + (dist / (L.R * 0.7)) ** 2)
    }
    v += beam * L.haze
  }
  return v
}

// ================================================================ the phosphor quantize
// radiance -> a step 0..9, an ordered dither between neighbours. exposure > 1 brightens (the
// production feeds sit one or two steps above the mockup).
function tone(v, x, y, exposure = 1, gamma = 0.85) {
  const q = Math.pow(clamp(v * exposure, 0, 1.4), gamma) * 8.2, i = Math.floor(q), fr = clamp((q - i - 0.5) * 2.2 + 0.5, 0, 1)
  return clamp(i + (fr > bayer(x, y) ? 1 : 0), 0, 9)
}

// The view, baked: { img: rows of steps (Int8Array), depth: rows of distances (Float32Array) }.
// edge: how much darker the corners are from the lens (light falloff, not the engine's vignette).
// Kept per camera and frame, so several scenes of one file share one render.
const _BAKED = new Map()
function bakeFeed(cam, W, { f = 0, exposure = 1, gamma = 0.85, edge = 0.12, key = "" } = {}) {
  const id = key + "|" + f
  if (key && _BAKED.has(id)) return _BAKED.get(id)
  const img = [], depth = []
  for (let y = 0; y < cam.h; y++) {
    const row = new Int8Array(cam.w), drow = new Float32Array(cam.w)
    for (let x = 0; x < cam.w; x++) {
      const d = rayDir(cam, x + 0.5, y + 0.5)
      const hit = traceRay(W, cam.pos, d)
      drow[x] = hit ? hit.t : Infinity
      const nx = (x + 0.5 - cam.cx) / cam.cx, ny = (y + 0.5 - cam.cy) / cam.cx
      const fall = 1 - edge * clamp((nx * nx + ny * ny * 2.4) / 2, 0, 1)
      row[x] = tone(radiance(cam, W, d, f) * fall, x, y, exposure, gamma)
    }
    img.push(row); depth.push(drow)
  }
  const out = { img, depth }
  if (key) _BAKED.set(id, out)
  return out
}
// the baked picture onto the canvas
function paintFeed(c, baked) {
  const { img } = baked
  for (let y = 0; y < img.length; y++) for (let x = 0; x < img[y].length; x++) c.px(x, y, PH[img[y][x]])
}

// ================================================================ hand drawing on top
// one phosphor step up or down
const step = (k, n) => PH[clamp(PH.indexOf(k) + n, 0, 9)]
// a pixel only where nothing nearer than the world point stands (dist: the point's distance from
// the lens); for hand-drawn details that something in the blockout may cover
function pxBehind(c, baked, cam, P, key, dx = 0, dy = 0) {
  const [x, y] = at(cam, P), X = x + dx, Y = y + dy
  if (X < 0 || Y < 0 || X >= cam.w || Y >= cam.h) return
  const dist = Math.hypot(...sub(P, cam.pos))
  if (baked.depth[Y][X] + 0.15 < dist) return
  c.px(X, Y, key)
}
// a line between two world points, drawn in steps along the projection
function line3(c, cam, A, B, key, n = 24) {
  let prev = null
  for (let i = 0; i <= n; i++) {
    const q = at(cam, add(mul(A, 1 - i / n), mul(B, i / n)))
    if (prev) c.line(prev[0], prev[1], q[0], q[1], key)
    prev = q
  }
}

// ================================================================ geometry for the game (layout notes)
// A walkable area on the ground: a world polygon [[x, z], ...] at height y, its edges sampled every
// seg meters, projected, clipped to the screen, simplified (tol px), as Cutaway's flat [x, y, ...].
function groundPoly(cam, pts, { y = 0, seg = 0.2, tol = 0.8 } = {}) {
  let poly = []
  for (let i = 0; i < pts.length; i++) {
    const [ax, az] = pts[i], [bx, bz] = pts[(i + 1) % pts.length], n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / seg))
    for (let j = 0; j < n; j++) { const t = j / n, p = project(cam, [ax + (bx - ax) * t, y, az + (bz - az) * t]); poly.push([p[0], p[1]]) }
  }
  // clip to the screen (Sutherland-Hodgman)
  const edges = [[(p) => p[0] >= 0, (a, b) => [0, a[1] + (b[1] - a[1]) * (0 - a[0]) / (b[0] - a[0])]],
    [(p) => p[0] <= cam.w, (a, b) => [cam.w, a[1] + (b[1] - a[1]) * (cam.w - a[0]) / (b[0] - a[0])]],
    [(p) => p[1] >= 0, (a, b) => [a[0] + (b[0] - a[0]) * (0 - a[1]) / (b[1] - a[1]), 0]],
    [(p) => p[1] <= cam.h, (a, b) => [a[0] + (b[0] - a[0]) * (cam.h - a[1]) / (b[1] - a[1]), cam.h]]]
  for (const [inside, cut] of edges) {
    const out = []
    for (let i = 0; i < poly.length; i++) {
      const a = poly[(i + poly.length - 1) % poly.length], b = poly[i]
      if (inside(b)) { if (!inside(a)) out.push(cut(a, b)); out.push(b) } else if (inside(a)) out.push(cut(a, b))
    }
    poly = out
  }
  // simplify (Douglas-Peucker on the closed ring), round, drop repeats
  const dp = (pts) => {
    if (pts.length < 3) return pts
    const [a, b] = [pts[0], pts[pts.length - 1]], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-9
    let worst = 0, wi = 0
    for (let i = 1; i < pts.length - 1; i++) { const d = Math.abs((b[0] - a[0]) * (a[1] - pts[i][1]) - (a[0] - pts[i][0]) * (b[1] - a[1])) / L; if (d > worst) { worst = d; wi = i } }
    return worst > tol ? [...dp(pts.slice(0, wi + 1)).slice(0, -1), ...dp(pts.slice(wi))] : [a, b]
  }
  let far = 0
  for (let i = 1; i < poly.length; i++) if (Math.hypot(poly[i][0] - poly[0][0], poly[i][1] - poly[0][1]) > Math.hypot(poly[far][0] - poly[0][0], poly[far][1] - poly[0][1])) far = i
  const ring = [...dp(poly.slice(0, far + 1)).slice(0, -1), ...dp([...poly.slice(far), poly[0]]).slice(0, -1)]
  const flat = []
  for (const [x, yy] of ring) { const X = Math.round(x), Y = Math.round(yy); if (flat.length && flat[flat.length - 2] === X && flat[flat.length - 1] === Y) continue; flat.push(X, Y) }
  return flat
}
// a spot on the ground, in whole pixels
const spotAt = (cam, P) => { const p = project(cam, P); return [Math.round(p[0]), Math.round(p[1])] }
// Cutaway's depth scale between two ground points (feet), s relative to a 24 px figure
function depthScale(cam, Pfar, Pnear, h = 1.75) {
  const f = project(cam, Pfar), n = project(cam, Pnear), r2 = (v) => Math.round(v * 100) / 100
  return { far: [Math.round(f[1]), r2(personPx(cam, Pfar, h) / 24)], near: [Math.round(n[1]), r2(personPx(cam, Pnear, h) / 24)] }
}
// the ground point seen at a screen pixel (for the frame's own edges)
function groundAt(cam, x, y, h = 0) {
  const d = rayDir(cam, x, y)
  if (d[1] >= 0) return null
  const t = (h - cam.pos[1]) / d[1]
  return add(cam.pos, mul(d, t))
}

// ================================================================ for review images only
// An imitation of the engine's post-effects (scanlines every 2nd row, grain, the vignette, a rolling
// band), on the phosphor steps, so a review is judged as the player sees it. Never in a shipped _bg.
function reviewFx(c, w, h, { f = 3, scan = 2, noise = 0.05, vignette = 0.35, band = 0.35 } = {}) {
  const bandY = Math.floor(h * band)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const k = c.key(x, y); if (!k || PH.indexOf(k) < 0) continue
    let n = 0
    if (scan && y % scan === scan - 1 && PH.indexOf(k) >= 3) n -= 1
    const r = ih(x, y, f + 31)
    if (r < noise) n += 1; else if (r > 1 - noise) n -= 1
    const dx = (x - (w - 1) / 2) / ((w - 1) / 2), dy = (y - (h - 1) / 2) / ((h - 1) / 2), vg = vignette * Math.min(1, (dx * dx + dy * dy) / 2)
    if (vg > 0.15) n -= 1; if (vg > 0.3) n -= 1
    if (Math.abs(y - bandY) < 4 && PH.indexOf(k) >= 2 && ih(x, y, 77) < 0.5) n += 1
    if (n) c.px(x, y, step(k, n))
  }
}
// a stand-in figure (review only): a dark capsule of a person h px tall, feet at x, y
function standIn(c, x, y, h) {
  const w = Math.max(3, Math.round(h * 0.3)), head = Math.max(2, Math.round(h * 0.18))
  for (let j = 0; j < h; j++) {
    const yy = y - j, t = j / h
    let half = t > 1 - head / h ? Math.round(head / 2) : t > 0.45 ? Math.round(w / 2) : Math.max(1, Math.round(w / 2.6))
    for (let i = -half; i <= half; i++) c.px(x + i, yy, (i === -half || i === half) ? "1" : t > 0.82 ? "6" : "4")
  }
}
// the layout over a review picture (keys C c Y R must be in the file's palette): the walk area's
// outline (C), holes (R), spots (Y), hotspot rects (c corners), the mic and its clear/lost rings (Y dots)
function drawLayout(c, L) {
  const ring = (flat, k) => { for (let i = 0; i < flat.length; i += 2) { const j = (i + 2) % flat.length; c.line(flat[i], flat[i + 1], flat[j], flat[j + 1], k) } }
  for (const p of L.walk) ring(p, "C")
  for (const p of L.holes ?? []) ring(p, "R")
  for (const [x, y, w, h] of Object.values(L.hotspots ?? {})) {
    const x1 = x + w - 1, y1 = y + h - 1
    for (const [ax, ay, sx, sy] of [[x, y, 1, 1], [x1, y, -1, 1], [x, y1, 1, -1], [x1, y1, -1, -1]]) { c.hline(sx > 0 ? ax : ax - 2, ay, 3, "c"); c.vline(ax, sy > 0 ? ay : ay - 2, 3, "c") }
  }
  if (L.mic) {
    const [mx, my] = L.mic.at
    for (const r of [L.mic.clear, L.mic.lost]) for (let a = 0; a < 360; a += r > 80 ? 2 : 5) c.px(Math.round(mx + r * Math.cos(a * D2R)), Math.round(my + r * Math.sin(a * D2R)), "Y")
    c.rect(mx - 1, my - 1, 3, 3, "Y")
  }
  for (const [name, [x, y]] of Object.entries(L.spots ?? {})) {
    c.px(x, y, "Y"); c.px(x - 1, y, "Y"); c.px(x + 1, y, "Y"); c.px(x, y - 1, "Y"); c.px(x, y + 1, "Y")
    c.text(Math.min(x + 3, 318 - name.length * 4), Math.max(1, y - 7), name.toUpperCase(), "9")
  }
}

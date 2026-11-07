// Style mockup E: the hacked CCTV feed. 320x180, 16 frames at 10 fps.
// The game is seen through the city's surveillance cameras, hijacked by Juno's implant. This is
// CAM 07, bolted to a building corner over Kowalski St, looking steeply down (about 40-45 degrees)
// through a cheap wide lens (barrel bend at the edges). The picture is a phosphor duotone (teal-black
// to pale green); colour exists only as the implant's overlay: Juno outlined in yellow, what she can
// use bracketed in cyan, the drone tagged red. The camera's own OSD (ID, timestamp, REC) is phosphor.
//
// How it is made: the street is a tiny ray tracer over boxes and the ground plane (light from the
// sign, the bar door, the ad screen, the vending machine, the cart lamp and the drone's spot; wet
// puddles reflect what glows; the drone's beam is marched through the rain), quantized to the ramp
// with an ordered dither. People and small props are hand grids placed by projecting their feet.
// Then the feed: rain streaks toward the nadir, scanlines, noise, a rolling interference band,
// vignette, bloom; then the implant's overlay and the camera OSD, crisp on top.
pal({
  0: "#030a0a", 1: "#071514", 2: "#0c221f", 3: "#12332d", 4: "#1a483e",     // phosphor, dark to light
  5: "#266252", 6: "#388169", 7: "#55a585", 8: "#8acfae", 9: "#d4f7e2",
  Y: "#ffd83a", y: "#a67f10",                                                 // implant: Juno
  C: "#3ff2ff", c: "#1a8fa0",                                                 // implant: interactive
  R: "#ff2a3c", r: "#9a1020",                                                 // implant: threat
})
ramps("0123456789", "yY", "cC", "rR")
include("../../.claude/skills/claude-pxl/lib/ui/font5x7.px.js")

const W = 320, H = 180, FRAMES = 16
const CLEAN = false                 // true: the street alone, without the feed's artefacts and overlays (to check it)
const PH = "0123456789"
const D2R = Math.PI / 180
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s]
const norm = (a) => mul(a, 1 / Math.hypot(a[0], a[1], a[2]))
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const ih = (a, b = 0, s = 0) => { let h = (a * 374761393 + b * 668265263 + s * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }

// ================================================================ the camera
// k bends the lens (barrel), s zooms back in so the middle of each edge stays at the edge.
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
// world point -> screen pixel (through the lens), [x, y, depth]
function project(cam, P) {
  const d = sub(P, cam.pos), zc = dot(d, cam.f)
  const ux = cam.F * dot(d, cam.r) / zc / cam.cx, uy = -cam.F * dot(d, cam.u) / zc / cam.cx
  const ru = Math.hypot(ux, uy)
  let rd = ru / cam.s
  for (let i = 0; i < 8; i++) { const fn = cam.s * rd * (1 + cam.k * rd * rd) - ru, df = cam.s * (1 + 3 * cam.k * rd * rd); rd -= fn / df }
  const g = ru > 0 ? rd / ru : 1 / cam.s
  return [cam.cx + ux * g * cam.cx, cam.cy + uy * g * cam.cx, zc]
}
// px a meter at a world point, for sizing what is placed there
const ppm = (cam, P) => { const a = project(cam, P), b = project(cam, add(P, [1, 0, 0])); return Math.hypot(b[0] - a[0], b[1] - a[1]) }

const CAM = makeCam({ pos: [0.5, 10.5, 0], yaw: -4, pitch: 43, F: 196, w: W, h: H, k: 0.14 })

// ================================================================ the street, in meters
// x along the street (right), y up, z away from the camera. The far facade stands at z = FZ.
const FZ = 10.5
const STAIR = [-9.9, -8.1, FZ - 2.05, FZ + 3]   // the stair down to the ring below: x0, x1, from the kerb under the building
const TREAD = 0.28, RISE = 0.17
const VEND = [-6.7, -5.2]            // the vending machine
const DOOR = [-3.9, -2.9]            // the bar door
const WIN = [-2.6, -0.4]             // the bar window
const SIGN = [-4.7, 0.3, 2.4, 3.15] // the LUCKY STATIC sign box: x0, x1, y0, y1
const SCREEN = [1.4, 8.2, 2.7, 5.6]  // the ad screen: x0, x1, y0, y1
const CART = [-2.5, 0, FZ - 3.7, -1.1, 0.95, FZ - 2.9]
const VENT = [6.0, 6.1]                 // the steam vent's grate, middle
const DRONE = [4.6, 3.6, 7.4]        // the drone
const SPOT = [3.5, 0, 8.6]           // where its searchlight points
const JUNO = [1.5, 0, 7.3]           // Juno's feet

const BOXES = [
  { a: [-40, 0, FZ], b: [40, 16, FZ + 8], m: "wall" },
  { a: [-40, 0, FZ - 2.3], b: [40, 0.16, FZ], m: "kerb" },                 // the far sidewalk
  { a: [VEND[0], 0.16, FZ - 0.9], b: [VEND[1], 2.2, FZ], m: "vend" },
  { a: [SIGN[0], SIGN[2], FZ - 0.18], b: [SIGN[1], SIGN[3], FZ], m: "sign" },
  { a: [SCREEN[0] - 0.15, SCREEN[2] - 0.15, FZ - 0.25], b: [SCREEN[1] + 0.15, SCREEN[3] + 0.15, FZ], m: "screen" },
  { a: [CART[0], CART[1], CART[2]], b: [CART[3], CART[4], CART[5]], m: "cart" },
  { a: [-6.1, 3.5, FZ - 0.6], b: [-5.3, 3.95, FZ], m: "ac" },               // AC units under the windows
  { a: [-3.4, 3.5, FZ - 0.6], b: [-2.6, 3.95, FZ], m: "ac" },
  { a: [-12.6, 4.2, FZ - 0.6], b: [-11.8, 4.7, FZ], m: "ac" },
  { a: [9.2, 0.16, FZ - 0.5], b: [10.2, 1.0, FZ], m: "crate" },
]

const LIGHTS = [
  { p: [-2.2, 2.75, FZ - 0.5], I: 0.9, R: 2.6 },          // the sign
  { p: [-3.4, 1.1, FZ - 0.4], I: 0.75, R: 2.4 },          // the door
  { p: [-1.5, 1.4, FZ - 0.4], I: 0.45, R: 2.4 },          // the window
  { p: [4.8, 4.1, FZ - 1.2], I: 1.0, R: 5.0 },            // the ad screen
  { p: [-5.95, 1.3, FZ - 1.2], I: 0.55, R: 1.8 },         // the vending machine
  { p: [-9.0, 1.6, FZ - 0.6], I: 1.7, R: 1.8 },           // a caged bulb over the stair's mouth
  { p: [-1.8, 1.7, FZ - 3.3], I: 0.6, R: 1.8 },          // the lamp under the cook's umbrella
]
const SPOT_DIR = norm(sub(SPOT, DRONE)), SPOT_COS = Math.cos(15 * D2R), SPOT_IN = Math.cos(11 * D2R)

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
  return { t: t0, n, m: b.m }
}
const inStair = (P) => P[0] > STAIR[0] && P[0] < STAIR[1] && P[2] > STAIR[2] && P[2] < FZ
const stepTop = (z) => 0.16 - RISE * (1 + Math.floor((z - STAIR[2]) / TREAD))       // descending away, under the building
function stairwell(P0, d, t0) {
  let P = P0.slice(), prev = P0.slice()
  for (let i = 0; i < 400; i++) {
    prev = P; P = add(P, mul(d, 0.015))
    const t = t0 + i * 0.015
    if (P[0] <= STAIR[0]) return { t, p: P, n: [1, 0, 0], m: "pit" }
    if (P[0] >= STAIR[1]) return { t, p: P, n: [-1, 0, 0], m: "pit" }
    if (P[2] >= STAIR[3]) return { t, p: P, n: [0, 0, -1], m: "pit" }
    const h = stepTop(P[2])
    if (P[1] <= h) return stepTop(prev[2]) === h ? { t, p: P, n: [0, 1, 0], m: "tread" } : { t, p: P, n: [0, 0, -1], m: "riser" }
  }
  return { t: t0 + i * 0.015, p: P, n: [0, 1, 0], m: "pit" }
}
function traceRay(o, d) {
  let best = null
  if (d[1] < 0) { const t = -o[1] / d[1]; best = { t, n: [0, 1, 0], m: "floor" } }
  for (const b of BOXES) { const h = hitBox(o, d, b); if (h && (!best || h.t < best.t)) best = h }
  if (best) best.p = add(o, mul(d, best.t))
  if (best && best.m === "kerb" && best.n[1] > 0 && inStair(best.p)) return stairwell(best.p, d, best.t)
  return best
}

// ---------------------------------------------------------------- the ad screen's picture
// 72 x 32 texels: left, the advert (a sleeper's smiling face); right, static and one huge eye
// staring into the lens. Cracked from an impact top middle; rows tear differently every frame.
const TW = 72, TH = 32
function screenTex(u, v, f) {
  let ix = Math.floor(u * TW), iy = Math.floor(v * TH)
  if (ix <= 0 || iy <= 0 || ix >= TW - 1 || iy >= TH - 1) return 0.04                  // bezel
  const tear = ih(iy, f, 3)
  const burst = f % 8 === 6                                                            // twice a loop it tears hard
  if (tear < (burst ? 0.45 : 0.1)) ix += Math.floor((ih(iy, f, 4) - 0.5) * (burst ? 14 : 6))   // torn rows
  // cracks: three jagged lines from the impact at (38, 6)
  for (const [ang, len] of [[2.2, 26], [0.5, 30], [1.4, 14], [3.3, 12]]) {
    const dx = ix - 38, dy = iy - 6, along = dx * Math.cos(ang) + dy * Math.sin(ang)
    const across = -dx * Math.sin(ang) + dy * Math.cos(ang) + Math.sin(along * 1.3) * 0.9
    if (along > 0 && along < len && Math.abs(across) < 0.55) return 0.03
  }
  if (Math.hypot(ix - 38, iy - 6) < 1.8) return 0.02
  if (ix > 4 && ix < 13 && iy > 25) return 0.03                                           // a dead block
  const edge = 33 + Math.floor(ih(iy >> 1, f, 5) * 7)                                    // where the advert gives out
  if (ix < edge) {
    // the advert: a pale wash, a face sleeping with a smile
    const fx = ix - 16, fy = iy - 13
    let e = 0.42 + iy * 0.006
    const head = (fx * fx) / 90 + (fy * fy) / 110
    if (head < 1) {
      e = 0.82
      if (fy < -6 + Math.abs(fx) * 0.25) e = 0.25                                      // hair
      if ((Math.abs(fx + 4) < 2.5 || Math.abs(fx - 4) < 2.5) && Math.abs(fy + 0.5 - Math.abs(fx % 4) * 0) < 0.6 && fy > -1.5 && fy < 0.5) e = 0.15  // closed eyes
      if (fy > 3 && fy < 5 && Math.abs(fx) < 4 && Math.abs(fy - 3 - (fx * fx) / 10) < 0.8) e = 0.2      // the smile
    }
    if (iy >= 24 && iy <= 30) e = 0.78                                                   // the caption band
    if (ih(ix, iy, f) < 0.05) e += 0.3
    return e
  }
  // static, in horizontal smears
  let e = 0.15 + ih(ix >> 1, iy, f + 7) * 0.5 * (0.6 + 0.4 * ih(iy, f, 9))
  // the eye: an almond, the iris, a pupil, a glint
  const ex = ix - 54, ey = iy - 15
  const lid = 10 * (1 - (ex * ex) / 300)
  if (Math.abs(ey) < lid) {
    const ri = Math.hypot(ex, ey * 1.05)
    e = 0.95
    if (ri < 7.5) e = 0.55 + 0.15 * Math.sin(Math.atan2(ey, ex) * 7)
    if (ri < 6.5 && ri > 5.5) e = 0.35
    if (ri < 3.4) e = 0.01
    if (Math.hypot(ex + 2, ey + 2) < 1.2) e = 1.25
    if (ih(iy, f, 11) < 0.05) e = 0.2 + ih(ix, iy, f) * 0.6                             // static through it
  } else if (Math.abs(ey) < lid + 1.2 && lid > -1) e = 0.06                             // lash line
  return e
}

// ---------------------------------------------------------------- materials: albedo a, glow e
function material(m, P, n, f) {
  const [x, y, z] = P
  if (m === "floor") {
    let a = 0.2 + 0.07 * fbm(x * 1.7, z * 1.7, 3)
    if (Math.abs(z - 4.6) < 0.06 && (Math.floor(x * 0.7) & 1)) a = 0.36                  // a worn lane dash
    const vx = x - VENT[0], vz = z - VENT[1]
    if (Math.abs(vx) < 0.55 && Math.abs(vz) < 0.38) a = (Math.floor((vx + 0.55) * 9) & 1) ? 0.05 : 0.38   // the grate
    if (Math.hypot(x + 5.4, z - 5.9) < 0.45) a = Math.hypot(x + 5.4, z - 5.9) > 0.38 ? 0.4 : 0.26          // a manhole
    return { a, e: 0 }
  }
  if (m === "kerb") return { a: n[1] > 0 ? 0.3 + 0.06 * ((Math.floor(x * 1.1) + Math.floor(z * 1.1)) & 1) : 0.42, e: 0 }
  if (m === "tread") return { a: 0.32 + (((z - STAIR[2]) % TREAD) < 0.05 ? 0.25 : 0), e: 0 }   // a worn nosing on each
  if (m === "riser") return { a: 0.16, e: 0 }
  if (m === "pit") return { a: 0.13, e: 0 }
  if (m === "ac" || m === "crate") return { a: n[1] > 0 ? 0.42 : 0.3, e: 0 }
  if (m === "cart") {
    if (n[1] > 0) return { a: 0.45, e: 0 }
    return { a: 0.3 + ((Math.floor(y * 8) & 1) ? 0.08 : 0), e: 0 }
  }
  if (m === "sign") {
    if (n[2] >= 0) return { a: 0.1, e: 0 }
    const edge = Math.min(x - SIGN[0], SIGN[1] - x, (y - SIGN[2]) * 1.6, (SIGN[3] - y) * 1.6)
    return { a: 0.1, e: edge < 0.06 ? 0.45 : 0.08 }                                    // a dark board, its rim catching the letters' light
  }
  if (m === "screen") {
    if (n[2] >= 0 || x < SCREEN[0] || x > SCREEN[1] || y < SCREEN[2] || y > SCREEN[3]) return { a: 0.2, e: 0 }
    return { a: 0, e: screenTex((x - SCREEN[0]) / (SCREEN[1] - SCREEN[0]), (SCREEN[3] - y) / (SCREEN[3] - SCREEN[2]), f) }
  }
  if (m === "vend") {
    if (n[2] < 0) {
      const u = (x - VEND[0]) / (VEND[1] - VEND[0]), v = (y - 0.16) / 2.04
      if (v > 0.3 && v < 0.94 && u > 0.07 && u < 0.7) {
        const row = Math.floor((v - 0.3) / 0.16), rr = ((v - 0.3) / 0.16) % 1
        if (u > 0.39 && row < 2) return { a: 0.12, e: (row === 1 && u > 0.45 && u < 0.64 && rr > 0.2 && rr < 0.7) ? 0.55 : 0 }  // dead, OUT OF ORDER
        if (rr < 0.18) return { a: 0, e: 0.3 }                                            // a shelf
        return { a: 0, e: (Math.floor(u * 14) & 1) ? 0.95 : 0.6 }                        // cans in a row
      }
      if (v > 0.06 && v < 0.2 && u > 0.1 && u < 0.66) return { a: 0.04, e: 0 }            // the tray
      if (u > 0.76 && u < 0.92 && v > 0.5 && v < 0.75) return { a: 0, e: 0.75 }            // the pay panel
      return { a: 0.28, e: 0 }
    }
    return { a: n[1] > 0 ? 0.35 : 0.2, e: 0 }
  }
  if (m === "wall") {
    if (n[1] > 0) return { a: 0.3, e: 0 }
    let a = 0.3 * (0.75 + 0.45 * vnoise(x * 5, y * 0.35)) * (0.85 + 0.15 * vnoise(x * 0.8, y * 0.8))
    if (y < 0.5) a *= 0.7                                                                // grime at the foot
    if (Math.abs(((x + 40) % 2.6) - 0.02) < 0.04 || Math.abs((y % 3.2) - 0.02) < 0.05) a *= 0.45   // panel seams
    if (Math.abs(x + 8.05) < 0.07 || Math.abs(x - 9.1) < 0.06) a = 0.5                   // drain pipes
    if (Math.abs(y - 6.2) < 0.05 && x < 0.8) a = 0.48                                     // a conduit
    // the stair's mouth: dark under a lintel, a lit sign over it
    if (x > STAIR[0] && x < STAIR[1] && y < 2.2) return { a: 0.02, e: 0 }
    if (x > STAIR[0] - 0.12 && x < STAIR[1] + 0.12 && y < 2.32) return { a: 0.5, e: 0 }
    if (x > STAIR[0] + 0.1 && x < STAIR[1] - 0.1 && y > 2.4 && y < 2.8) return { a: 0, e: 0.75 }
    // the bar: door, window
    if (x > DOOR[0] && x < DOOR[1] && y < 2.15) {
      if (y > 1.45 && (Math.floor((x - DOOR[0]) * 10) % 3 === 0)) return { a: 0, e: 0.2 } // noren slits
      if (y > 1.45) return { a: 0.35, e: 0.25 }
      return { a: 0, e: 0.95 - 0.1 * (y > 1.0 && Math.abs(x + 3.25) < 0.18 ? 6 : 0) }     // someone in the doorway
    }
    if (Math.abs(x - (DOOR[0] - 0.08)) < 0.08 && y < 2.25 || Math.abs(x - (DOOR[1] + 0.08)) < 0.08 && y < 2.25 || (x > DOOR[0] && x < DOOR[1] && y < 2.3)) return { a: 0.45, e: 0 }
    if (x > WIN[0] && x < WIN[1] && y > 0.85 && y < 2.15) {
      let e = 0.5 + (y - 0.85) * 0.18                                                    // steamed glass
      for (const [hx, hy] of [[-1.9, 1.35], [-1.1, 1.3]]) {                              // two customers' backs
        if ((x - hx) ** 2 / 0.06 + (y - hy - 0.25) ** 2 / 0.03 < 1 || ((x - hx) ** 2 / 0.18 + (y - hy + 0.25) ** 2 / 0.25 < 1 && y < hy)) e = 0.1
      }
      if (Math.abs(x - (WIN[0] + WIN[1]) / 2) < 0.03) e = 0.1
      return { a: 0, e }
    }
    if (x > WIN[0] - 0.08 && x < WIN[1] + 0.08 && y > 0.78 && y < 2.22) return { a: 0.45, e: 0 }
    // under the ad screen, a rolled-down shutter
    if (x > 2.4 && x < 7.0 && y < 2.3) return { a: (Math.floor(y * 9) & 1) ? 0.34 : 0.22, e: 0 }
    // flats over the bar: windows, one lit behind a blind, one with a box fan
    if (y > 4.1 && y < 5.4 && x < 0.6) {
      const wi = Math.floor((x + 40) / 2.6), wx = (x + 40) % 2.6
      if (wx > 0.6 && wx < 2.0) {
        if (wi === 13) return { a: 0, e: (Math.floor(y * 9) & 1) ? 0.55 : 0.4 }
        if (wi === 14 && Math.hypot(wx - 1.3, y - 4.75) < 0.35) return { a: 0.35, e: 0 }
        return { a: 0.06, e: 0 }
      }
      if (wx > 0.5 && wx < 2.1 && y < 4.25) return { a: 0.5, e: 0 }                      // sills
    }
    return { a, e: 0 }
  }
  return { a: 0.2, e: 0 }
}

const AMBIENT = 0.13
function lightAt(P, n) {
  let s = AMBIENT * (n[1] > 0 ? 1 : 0.75)
  for (const L of LIGHTS) {
    const d = sub(L.p, P), dist = Math.hypot(d[0], d[1], d[2])
    const ndl = Math.max(0, dot(n, d) / dist)
    s += L.I * (0.25 + 0.75 * ndl) * (ndl > 0 ? 1 : 0.3) / (1 + (dist / L.R) ** 2)
  }
  const d = sub(P, DRONE), dist = Math.hypot(d[0], d[1], d[2]), cs = dot(d, SPOT_DIR) / dist
  if (cs > SPOT_COS) s += 0.8 * clamp((cs - SPOT_COS) / (SPOT_IN - SPOT_COS), 0, 1) * Math.max(0, -dot(n, d) / dist + 0.2)
  return s
}
function shadeHit(hit, f) {
  const { a, e } = material(hit.m, hit.p, hit.n, f)
  return a * lightAt(hit.p, hit.n) * 1.6 + e
}
// puddles: where the ground lies lower; a mirror there, a dull sheen on the wet rest
const puddle = (x, z) => clamp((fbm(x * 0.55 + 3, z * 0.9 + 7, 3) - 0.5) * 9, 0, 1)

function radiance(cam, x, y, f) {
  const d = rayDir(cam, x, y), hit = traceRay(cam.pos, d)
  if (!hit) return 0.03
  let v = shadeHit(hit, f)
  if (hit.m === "floor" || (hit.m === "kerb" && hit.n[1] > 0)) {
    const [px, , pz] = hit.p
    const wet = hit.m === "floor" ? puddle(px, pz) : puddle(px, pz) * 0.6
    const k = 0.18 + 0.62 * wet
    const rip = (vnoise(px * 7, pz * 7 + f * 0.9) - 0.5) * (0.04 + 0.05 * (1 - wet))
    const rd = norm([d[0] + rip, -d[1], d[2] + rip])
    const rh = traceRay(add(hit.p, [0, 0.01, 0]), rd)
    const rv = rh ? shadeHit(rh, f) : 0.03
    v = v * (1 - 0.35 * wet) + k * rv
  }
  // the drone's beam, marched through the rain
  const tMax = Math.min(hit.t, 30)
  let beam = 0
  for (let i = 0; i < 28; i++) {
    const t = 4 + (tMax - 4) * (i + 0.5) / 28, P = add(cam.pos, mul(d, t))
    const q = sub(P, DRONE), dist = Math.hypot(q[0], q[1], q[2]), cs = dot(q, SPOT_DIR) / dist
    if (cs > SPOT_COS) beam += (tMax - 4) / 28 * clamp((cs - SPOT_COS) / (SPOT_IN - SPOT_COS), 0, 1) / (1 + dist * 0.25)
  }
  return v + beam * 0.75
}

const tone = (v, x, y) => {
  const q = Math.pow(clamp(v, 0, 1.4), 0.85) * 8.2, i = Math.floor(q), fr = clamp((q - i - 0.5) * 2.2 + 0.5, 0, 1)
  return clamp(i + (fr > bayer(x, y) ? 1 : 0), 0, 9)
}

// the feed, frame by frame (a 2D array of ramp indices), kept
const FEED = new Map()
function feed(f) {
  if (FEED.has(f)) return FEED.get(f)
  const img = []
  for (let y = 0; y < H; y++) { const row = new Int8Array(W); for (let x = 0; x < W; x++) row[x] = tone(radiance(CAM, x + 0.5, y + 0.5, f), x, y); img.push(row) }
  FEED.set(f, img)
  return img
}
// the other cameras, for the thumbnails
const THUMB_W = 36, THUMB_H = 20
const THUMB_CAMS = {
  6: makeCam({ pos: [-14, 6.5, 6], yaw: 72, pitch: 28, F: 30, w: THUMB_W, h: THUMB_H, k: 0.2 }),
  7: makeCam({ pos: [0.5, 10.5, 0], yaw: -4, pitch: 43, F: 25, w: THUMB_W, h: THUMB_H, k: 0.14 }),
  8: makeCam({ pos: [15, 6.5, 4], yaw: -62, pitch: 26, F: 22, w: THUMB_W, h: THUMB_H, k: 0.2 }),
}
const THUMBS = {}
function thumb(n) {
  if (THUMBS[n]) return THUMBS[n]
  const cam = THUMB_CAMS[n], img = []
  for (let y = 0; y < THUMB_H; y++) { const row = []; for (let x = 0; x < THUMB_W; x++) row.push(tone(radiance(cam, x + 0.5, y + 0.5, 0) * 0.85, x, y)); img.push(row) }
  return (THUMBS[n] = img)
}

// ================================================================ people and props, hand drawn
// Juno from above and behind, facing the screen: hood up, slicker, the satchel on her right hip.
const JUNO_GRID = [
  "......5665....",
  ".....578875...",
  "....56888875..",
  "....67888887..",
  "....67888886..",
  "....56788865..",
  "...4567777654.",
  "..356777777653",
  "..4537777776540",
  "..45637777765..",
  "...456377776...",
  "...4567377765..",
  "...45677374443.",
  "..456777744554.",
  "..45667775443..",
  "..3455666654...",
  "...3445554.....",
  "....2211122....",
  "....221.122....",
  "....221.122....",
  "....221.122....",
  "....211.112....",
  "...1110.1111...",
  "...0000.0000...",
]
// the cook, side on, stirring the pot on his right; an old man in an apron
const COOK_GRID = [
  "...6776...",
  "..677887..",
  "..999999..",
  "..478878..",
  "..367886..",
  "...4665...",
  "..345665..",
  ".3456666655",
  ".346777788",
  ".3468888...",
  ".3468998...",
  ".3468998...",
  ".3468998...",
  ".3458887...",
  "..34443....",
  "..33.33....",
  "..33.33....",
  "..22.22....",
  ".222.222...",
]
const gridMask = (grid) => (i, j) => j >= 0 && j < grid.length && i >= 0 && i < grid[j].length && grid[j][i] !== "."
// a figure, with a dark rim so it holds against the lit ground
function drawGrid(c, grid, x, y) {
  const m = gridMask(grid)
  for (let j = -1; j <= grid.length; j++) for (let i = -1; i <= 16; i++)
    if (!m(i, j) && (m(i - 1, j) || m(i + 1, j) || m(i, j - 1) || m(i, j + 1))) c.px(x + i, y + j, "1")
  grid.forEach((row, j) => { for (let i = 0; i < row.length; i++) if (row[i] !== ".") c.px(x + i, y + j, row[i]) })
}

// where things land on the screen
const at = (P) => project(CAM, P).map((v, i) => i < 2 ? Math.round(v) : v)
const JUNO_AT = (() => { const [x, y] = at(JUNO); return [x - 7, y - JUNO_GRID.length + 1] })()
const COOK_AT = (() => { const [x, y] = at([CART[0] - 0.3, 0, CART[2] + 0.15]); return [x - 5, y - COOK_GRID.length + 1] })()

function umbrella(c) {
  const [ux, uy] = at([(CART[0] + CART[3]) / 2 - 0.1, 2.0, CART[5] + 0.25])
  const [bx, by] = at([(CART[0] + CART[3]) / 2 - 0.1, CART[4], CART[5] - 0.1])
  c.line(bx, by, ux, uy, "5"); c.line(bx + 1, by, ux + 1, uy, "3")                        // the pole
  const rx = 19, ry = 10
  for (let y = -ry; y <= ry + 1; y++) for (let x = -rx; x <= rx; x++) {
    const d = (x * x) / (rx * rx) + (y * y) / (ry * ry)
    if (d > 1) continue
    const ang = Math.atan2(y / ry, x / rx), seg = Math.floor(((ang + Math.PI) / (2 * Math.PI)) * 8 + 0.5) % 8
    const rib = Math.abs(((ang + Math.PI) / (2 * Math.PI)) * 8 + 0.5 - Math.floor(((ang + Math.PI) / (2 * Math.PI)) * 8 + 0.5) - 0.5) > 0.44
    if (seg === 2 && d > 0.45 && d < 0.95 && ih(x, y, 2) < 0.55) continue           // torn panel
    let k = (seg & 1) ? 4 : 5
    if (y < -2) k += 1                                                                  // the far half catches the sign
    if (d > 0.82) k -= 1                                                                // the rim
    if (rib) k = 6
    if (d < 0.03) k = 8
    c.px(ux + x, uy + y, String(k))
  }
  // a scalloped rim, sagging between ribs
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * 2 * Math.PI - Math.PI + Math.PI / 8
    c.px(ux + Math.round(Math.cos(a) * (rx + 1)), uy + Math.round(Math.sin(a) * (ry + 1)), "3")
  }
}
// the stairwell's railing: along its street side and its top end, posts every meter
function railing(c) {
  const [x0, x1, z0, z1] = STAIR, Hr = 0.95
  const runs = [[[x0, z0], [x0, FZ]], [[x1, z0], [x1, FZ]]]
  for (const [[ax, az], [bx, bz]] of runs) {
    const a = at([ax, 0.16 + Hr, az]), b = at([bx, 0.16 + Hr, bz])
    c.line(a[0], a[1] + 1, b[0], b[1] + 1, "1"); c.line(a[0], a[1], b[0], b[1], "7")
    const n = 2
    for (let i = 0; i <= n; i++) {
      const t = i / n, P = [ax + (bx - ax) * t, 0.16, az + (bz - az) * t]
      const f = at(P), h = at([P[0], 0.16 + Hr, P[2]])
      c.line(f[0], f[1], h[0], h[1], "5")
    }
  }
}
function pot(c) {
  const [x, y] = at([(CART[0] + CART[3]) / 2 + 0.15, CART[4], (CART[2] + CART[5]) / 2])
  c.ellipse(x, y, 4, 2, "3"); c.ellipse(x, y - 1, 3, 1, "7"); c.px(x - 1, y - 1, "8")
  c.rect(x - 9, y - 1, 3, 2, "6"); c.px(x - 8, y - 2, "7")                             // bowls
}
function trash(c) {
  for (const [wx, wz, s] of [[-11.0, FZ - 0.35, 0], [-10.7, FZ - 0.75, 1], [-11.8, FZ - 0.4, 2], [8.5, FZ - 0.4, 3]]) {
    const [x, y] = at([wx, 0.16, wz])
    c.ellipse(x, y - 2, 4, 3, "2"); c.ellipse(x - 1, y - 3, 3, 2, "3"); c.px(x - 2, y - 4, "5"); c.px(x - 1, y - 5, "4")
    if (s === 1) { c.px(x + 2, y - 4, "4"); c.px(x + 3, y - 5, "3") }                     // the knot
  }
}
// the drone from above: four rotors blurred into rings, a pod, the searchlight's lens under it
function drone(c, f) {
  const [x, y] = at(DRONE), Y = y + ((f % 8 < 4) ? 0 : 1)
  c.line(x - 8, Y - 4, x + 8, Y + 4, "1"); c.line(x - 8, Y + 4, x + 8, Y - 4, "1")       // arms
  c.line(x - 8, Y - 5, x + 8, Y + 3, "5"); c.line(x - 8, Y + 3, x + 8, Y - 5, "5")
  for (const [dx, dy] of [[-9, -4], [9, -4], [-9, 4], [9, 4]]) {
    c.ellipse(x + dx, Y + dy, 4, 2, "2")
    for (let a = 0; a < 16; a++) {
      const ang = a / 16 * Math.PI * 2, px = Math.round(x + dx + Math.cos(ang) * 4.5), py = Math.round(Y + dy + Math.sin(ang) * 2.2)
      if ((a + f) % 4) c.px(px, py, (a + f) & 1 ? "7" : "6")                             // rotor blur
    }
    c.px(x + dx, Y + dy, "8")
  }
  c.ellipse(x, Y, 5, 4, "1"); c.ellipse(x, Y - 1, 4, 3, "5"); c.hline(x - 3, Y - 3, 6, "7"); c.hline(x - 2, Y - 4, 3, "8")
  c.hline(x - 3, Y + 1, 7, "3"); c.px(x, Y + 2, "9"); c.px(x - 1, Y + 2, "9"); c.px(x + 1, Y + 2, "8")
}

// ================================================================ the feed's own artefacts
// rain: short streaks pointing at the nadir (straight down, far below the frame), falling toward it
const NADIR = (() => { const d = [0, -1, 0], zc = dot(d, CAM.f), uy = -CAM.F * dot(d, CAM.u) / zc; return [CAM.cx + CAM.F * dot(d, CAM.r) / zc, CAM.cy + uy] })()
function rain(c, f) {
  for (let i = 0; i < 230; i++) {
    const x0 = ih(i, 1) * (W + 40) - 20, y0 = ih(i, 2) * (H + 60) - 60, ph = Math.floor(ih(i, 3) * FRAMES)
    const dx = NADIR[0] - x0, dy = NADIR[1] - y0, dl = Math.hypot(dx, dy), ux = dx / dl, uy = dy / dl
    const tt = ((f + ph) % FRAMES) / FRAMES, sp = 70 + ih(i, 4) * 40
    const x = x0 + ux * tt * sp, y = y0 + uy * tt * sp, len = 3 + Math.floor(ih(i, 5) * 4)
    const key = ih(i, 6) < 0.3 ? "7" : "6"
    for (let s = 0; s < len; s++) {
      const px = Math.round(x + ux * s), py = Math.round(y + uy * s)
      if (px >= 0 && px < W && py >= 0 && py < H) { const k = c.key(px, py); if (k && PH.indexOf(k) < +key) c.px(px, py, s === len - 1 ? String(+key + 1) : key) }
    }
  }
  // splashes in the puddles: a pixel and its ring, two frames each
  for (let i = 0; i < 40; i++) {
    const wx = -10 + ih(i, 7) * 22, wz = 4.5 + ih(i, 8) * 6, ph = Math.floor(ih(i, 9) * FRAMES), age = (f + ph) % FRAMES
    if (age > 1 || puddle(wx, wz) < 0.4) continue
    const [x, y] = at([wx, 0, wz])
    if (age === 0) c.px(x, y, "8")
    else { c.px(x - 1, y, "7"); c.px(x + 1, y, "7"); c.px(x, y - 1, "6") }
  }
}
function steam(c, f) {
  const [vx, vy] = at([VENT[0], 0, VENT[1]])
  c.plume(vx, vy, "765", { every: 2, life: 16, rise: 26, wind: 0.5, size: [2, 6], seed: 1, frame: f })
  const [px, py] = at([(CART[0] + CART[3]) / 2 + 0.15, CART[4], (CART[2] + CART[5]) / 2])
  c.plume(px, py - 2, "876", { every: 2, life: 12, rise: 14, wind: 0.3, size: [1, 3], thin: "shrink", seed: 2, frame: f })
}
// cables slung across the street, between the facade and our corner, dark against the wet ground
function cables(c) {
  for (const [a, b, sag] of [[[-11, 6.4, FZ], [3, 8.0, 2.2], 1.3], [[2, 6.8, FZ], [12, 7.8, 3.0], 0.9]]) {
    let prev = null
    for (let i = 0; i <= 40; i++) {
      const t = i / 40, P = add(mul(a, 1 - t), mul(b, t)); P[1] -= sag * 4 * t * (1 - t)
      const q = at(P)
      if (prev) c.line(prev[0], prev[1], q[0], q[1], "1")
      prev = q
    }
  }
}
const step = (k, n) => PH[clamp(PH.indexOf(k) + n, 0, 9)]
// scanlines, noise, the rolling interference band, vignette: on the phosphor only
function feedFx(c, f) {
  const band = Math.floor((f / FRAMES) * (H + 30)) - 14 + 156                    // rolls down, wraps
  for (let y = 0; y < H; y++) {
    const by = ((y - band) % (H + 30) + (H + 30)) % (H + 30)
    const inBand = by < 14                                                       // a bright crest, a smear, a dark trough
    const shift = inBand && by < 11 ? Math.floor((ih(y, f, 21) - 0.25) * 6) : (ih(y, f, 22) < 0.02 ? 1 : 0)
    const row = []
    for (let x = 0; x < W; x++) row.push(c.key(clamp(x - shift, 0, W - 1), y))
    for (let x = 0; x < W; x++) {
      let k = row[x]; if (!k || PH.indexOf(k) < 0) continue
      let n = 0
      if (y & 1) n -= 1                                                            // scanline
      if (inBand) n += by < 2 ? 3 : by < 11 ? 1 : -1
      const r = ih(x, y, f + 31)
      if (r < 0.035) n += 1; else if (r > 0.975) n -= 1                           // noise
      const vx = (x - 160) / 160, vy = (y - 90) / 120, vg = vx * vx * vx * vx + vy * vy * vy * vy
      if (vg > 0.35) n -= 1; if (vg > 0.75) n -= 1                                 // the lens's dark corners
      if (n || shift) c.px(x, y, step(k, n))
    }
  }
}

// ================================================================ the implant's overlay and the OSD
const brackets = (c, x0, y0, x1, y1, k, arm = 3) => {
  c.hline(x0, y0, arm, k); c.vline(x0, y0, arm, k); c.hline(x1 - arm + 1, y0, arm, k); c.vline(x1, y0, arm, k)
  c.hline(x0, y1, arm, k); c.vline(x0, y1 - arm + 1, arm, k); c.hline(x1 - arm + 1, y1, arm, k); c.vline(x1, y1 - arm + 1, arm, k)
}
const label = (c, x, y, s, k, bg = "0") => { const w = s.length * 4 + 3; c.rect(x, y, w, 9, bg); c.rect(x, y, 1, 9, k); c.text(x + 3, y + 2, s, k) ; return w }
const boxOf = (pts) => { const p = pts.map((P) => at(P)); return [Math.min(...p.map((q) => q[0])), Math.min(...p.map((q) => q[1])), Math.max(...p.map((q) => q[0])), Math.max(...p.map((q) => q[1]))] }
const darken = (c, x0, y0, w, h, n) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) { const k = c.key(x, y); if (k && PH.indexOf(k) >= 0) c.px(x, y, step(k, -n)) } }

function overlay(c, f) {
  // Juno: a yellow outline round her, and her tag
  const m = gridMask(JUNO_GRID), [jx, jy] = JUNO_AT
  for (let j = -1; j <= JUNO_GRID.length; j++) for (let i = -1; i <= 15; i++) {
    if (m(i, j)) continue
    if (m(i - 1, j) || m(i + 1, j) || m(i, j - 1) || m(i, j + 1)) c.px(jx + i, jy + j, "Y")
  }
  c.line(jx + 14, jy - 1, jx + 18, jy - 5, "y"); c.hline(jx + 18, jy - 5, 3, "y")
  label(c, jx + 21, jy - 9, "J.REYES", "Y")
  // the drone: tagged red, its searchlight's reach dotted on the ground
  const [dx, dy] = at(DRONE)
  brackets(c, dx - 15, dy - 9, dx + 15, dy + 9, "R", 4)
  c.px(dx, dy + 2, "R"); c.px(dx - 1, dy + 2, "R")                                // its sensor eye, marked
  label(c, dx - 15, dy - 20, "PATROL DRONE", "R")
  c.text(dx + 18, dy - 1, "HOSTILE", "r")
  for (let i = 0; i < 40; i++) {
    if ((i + (f >> 1)) % 3 === 2) continue
    const a = (i / 40) * Math.PI * 2, P = [SPOT[0] + Math.cos(a) * 2.25, 0, SPOT[2] + Math.sin(a) * 1.85]
    const [x, y] = at(P); c.px(x, y, "r")
  }
  // what can be used: brackets in cyan
  const cb = (box, pad = 2) => brackets(c, box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad, "c")
  cb(boxOf([[VEND[0], 2.05, FZ - 0.85], [VEND[1], 0.16, FZ - 0.85], [VEND[1], 2.05, FZ]]))
  cb(boxOf([[DOOR[0], 2.2, FZ], [DOOR[1], 0, FZ]]))
  const cart = boxOf([[CART[0], 0, CART[2]], [CART[3], 0, CART[2]], [CART[0], 2.0, CART[5] + 0.25]])
  cb([Math.min(cart[0], COOK_AT[0]), cart[1] - 6, cart[2] + 4, Math.max(cart[3], COOK_AT[1] + COOK_GRID.length)], 1)
  const al = boxOf([[STAIR[0], 0.16, STAIR[2]], [STAIR[1], 0.16, STAIR[2]], [STAIR[0], 2.8, FZ], [STAIR[1], 2.8, FZ]])
  cb(al, 1)
  const qx = al[0] + 1, qy = al[3] + 4
  label(c, qx, qy, "EXIT: RING 8", "c")
  c.vline(qx + 54, qy + 1, 5, "C"); c.hline(qx + 53, qy + 5, 3, "C"); c.px(qx + 54, qy + 6, "C")   // a down arrow
  // the hovered thing: the ad screen, bracketed bright, its name, the cursor on the eye
  const sb = boxOf([[SCREEN[0], SCREEN[3], FZ - 0.25], [SCREEN[1], SCREEN[3], FZ - 0.25], [SCREEN[0], SCREEN[2], FZ - 0.25], [SCREEN[1], SCREEN[2], FZ - 0.25]])
  brackets(c, sb[0] - 3, sb[1] - 3, sb[2] + 3, sb[3] + 3, "C", 6)
  const lx = sb[0] - 3, ly = sb[3] + 5
  c.vline(lx, sb[3] + 3, 3, "C")
  label(c, lx, ly, "BROKEN AD SCREEN", "C")
  const [ex, ey] = at([SCREEN[0] + (SCREEN[1] - SCREEN[0]) * 0.75, SCREEN[3] - (SCREEN[3] - SCREEN[2]) * 0.47, FZ - 0.25])
  for (const [ax, ay] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) { for (let s = 3; s <= 6; s++) c.px(ex + ax * s, ey + ay * s, "C") }
  c.px(ex, ey, "C")
  for (const [ax, ay] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) c.px(ex + ax * 2, ey + ay * 2, "c")
}

function osd(c, f) {
  // corner crop marks
  for (const [x, y, sx, sy] of [[3, 3, 1, 1], [316, 3, -1, 1], [3, 176, 1, -1], [316, 176, -1, -1]]) {
    c.hline(sx > 0 ? x : x - 5, y, 6, "8"); c.vline(x, sy > 0 ? y : y - 5, 6, "8")
  }
  const sh = { shadow: "0" }
  c.text(8, 7, "CAM 07 // LOWER NINTH / KOWALSKI ST", "9", sh)
  c.text(8, 14, "NAGI WA CIVIC SURVEILLANCE  ", "7", sh); c.px(25, 16, "7")      // pxl's 3x5 letters have no middle dot: set by hand
  c.text(8, 21, "LINK: J.REYES IMPLANT  OVERRIDE", "c", sh)
  c.text(312, 7, "2091-11-03 23:51:07", "9", { align: "r", shadow: "0" })
  if (f < FRAMES / 2) { c.circ(290, 16, 2, "9"); c.px(289, 15, "8") }
  c.text(312, 14, "REC", "9", { align: "r", shadow: "0" })
  c.text(312, 21, "F2.0 WIDE  IR OFF", "7", { align: "r", shadow: "0" })
  // the subtitle: what Juno's mic hears
  const line = "It... said my name."
  darken(c, 128, 159, 122, 13, 4)
  c.text(133, 163, "JUNO>", "Y")
  c.text(155, 162, line, "9", { font: "5x7", shadow: "0" })
  // camera thumbnails: switching cameras is changing rooms
  const TX = [6, 46, 86]
  ;[6, 7, 8].forEach((n, i) => {
    const x0 = TX[i], y0 = 157, img = thumb(n), live = n === 7
    c.rect(x0 - 1, y0 - 8, THUMB_W + 2, THUMB_H + 9, "0")
    img.forEach((row, y) => row.forEach((k, x) => c.px(x0 + x, y0 + y, String(clamp(live ? k : k - 1, 0, 9)))))
    c.rect(x0 - 1, y0 - 1, THUMB_W + 2, 1, live ? "9" : "4"); c.rect(x0 - 1, y0 + THUMB_H, THUMB_W + 2, 1, live ? "9" : "4")
    c.rect(x0 - 1, y0 - 1, 1, THUMB_H + 2, live ? "9" : "4"); c.rect(x0 + THUMB_W, y0 - 1, 1, THUMB_H + 2, live ? "9" : "4")
    c.text(x0, y0 - 7, "CAM 0" + n, live ? "9" : "6")
    if (live) { c.rect(x0 + THUMB_W - 18, y0 + THUMB_H - 7, 18, 7, "0"); c.text(x0 + THUMB_W - 16, y0 + THUMB_H - 6, "LIVE", "C") }
  })
  // the implant's cache: what Juno carries
  const cx = 262, cy = 152
  c.rect(cx - 2, cy - 2, 56, 26, "0")
  c.text(cx, cy, "CACHE", "C")
  c.text(cx + 52, cy, "3/8", "c", { align: "r" })
  for (let i = 0; i < 4; i++) {
    const x = cx + i * 13, y = cy + 8
    c.rect(x, y, 11, 11, "1"); brackets(c, x, y, x + 10, y + 10, i < 3 ? "c" : "1", 2)
  }
  // a wrench, a data shard, a noodle ticket
  c.line(cx + 3, cy + 16, cx + 7, cy + 12, "8"); c.px(cx + 7, cy + 11, "8"); c.px(cx + 8, cy + 12, "8"); c.px(cx + 3, cy + 17, "6")
  c.rect(cx + 17, cy + 11, 3, 5, "C"); c.px(cx + 18, cy + 16, "c"); c.px(cx + 18, cy + 10, "9")
  c.rect(cx + 29, cy + 11, 5, 5, "7"); c.hline(cx + 30, cy + 13, 3, "4"); c.px(cx + 29, cy + 11, "1")
}

// ================================================================ the scene
const SIGN_BOX = (() => { const b = boxOf([[SIGN[0], SIGN[3], FZ - 0.2], [SIGN[1], SIGN[2], FZ - 0.2]]); return [b[0] - 2, b[1] - 2, b[2] - b[0] + 4, b[3] - b[1] + 4] })()
anim("_clock", { w: 1, h: 1, frames: FRAMES, fps: 10 }, () => {})
scene("mock_e_cctv", { w: W, h: H, bg: "0" },
  layer("clock", stamp("_clock", -4, -4)),
  (c) => { const img = feed(c.frame); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, PH[img[y][x]]) },
  railing,
  cables,
  trash,
  (c) => drawGrid(c, COOK_GRID, COOK_AT[0], COOK_AT[1]),
  pot,
  umbrella,
  (c) => drawGrid(c, JUNO_GRID, JUNO_AT[0], JUNO_AT[1]),
  (c) => drone(c, c.frame),
  (c) => steam(c, c.frame),
  (c) => CLEAN || rain(c, c.frame),
  (c) => CLEAN || feedFx(c, c.frame),
  glow("9", { r: 4, strength: 0.35, ramp: 1 }),
  (c) => {   // the sign and the advert's words: lit text on the facade, too bright for the scanlines
    const [sx, sy] = at([(SIGN[0] + SIGN[1]) / 2, (SIGN[2] + SIGN[3]) / 2, FZ - 0.2])
    c.text(sx, sy - 3, "LUCKY STATIC", (i) => (i === 7 && c.frame % 5 === 2) ? "6" : "9", { align: "c", font: "5x7" })
    const [ax, ay] = at([SCREEN[0] + 1.6, SCREEN[2] + 0.42, FZ - 0.26])
    if (ih(c.frame, 0, 41) > 0.15) c.text(ax, ay - 2, "SLEEP BETTER", "2", { align: "c" })
    const [hx, hy] = at([SCREEN[0] + 1.6, SCREEN[3] - 0.32, FZ - 0.26])
    c.text(hx, hy - 2, "NAGI WA", "2", { align: "c" }); c.px(hx + 4, hy, "2")      // the middle dot by hand
  },
glow("9", { r: 5, ramp: 2, keep: "9", where: SIGN_BOX }),
  (c) => CLEAN || overlay(c, c.frame),
  (c) => CLEAN || osd(c, c.frame),
)

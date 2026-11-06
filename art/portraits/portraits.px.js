// Marketing portraits, a style test: tall panels with a tight bust, a bold ink line, flat cel shading.
// Not part of the game; tools/build_art.sh does not read this folder.
//
// How a figure is made, so that the next one is cheap:
//   portrait("name", PANELS.x, (p) => { ... }) gets a painter over the panel, 80x100.
//   p.part(path, tone)        a body part: a flat shape, part of the figure, so the outline goes round it
//   part.tone(path, tone)     a plane of colour inside the part (a shadow, a shine), cut off at its edge
//   part.form(ramp, { r })    the part as a rounded form under the one light, in five tones (only Ashe so far: the user rejected it on the others)
//   part.plane(path, n)       a plane turned from the light (-n) or to it (+n): n steps along the ramp, so the form still shows through
//                             (eye sockets, under the cheekbone, under the lip, a shadow cast by a brim)
//   part.fold(path, w)        a fold in cloth: a dark side and a lit side along the path, thinning out at its ends; no line
//   part.edge(dx, dy, tone)   what lies within (dx, dy) of the part's edge on that side: with (+,+) the
//                             shadow side's crescent for the one light, upper left; (-,-) the lit rim
//   part.cast(path, dx, dy, tone)   the shadow a shape throws on the part; paint it before the shape
//   part.within(path, tone)   a part lying on this one and cut off by it (a face in a hood)
//   part.ink(tone)            the part's own contour, inside it
//   part.sep(tone)            a line where the part lies over the figure painted before it (a head on a collar)
//   p.line(path, tone)        a clean 1 px line, without L-corners
//   p.grid(x, y, rows, map)   small organic things (eyes, mouths) are hand grids, never shapes
//   p.outline()               the ink round the whole figure: 1 px, and 2 on the side away from the light
// A path is a string of points, "x,y x,y", rounded by corner cutting; "x,y!" keeps that point a corner.
// Everything is lit from the upper left. The order of a figure: the body, the head, the face, the outline,
// then what has no ink (Ashe's burn).

include("../lib/text.js")

const PW = 80, PH = 100

const INK = "#0c0e1a"
const SKIN = { lit: "#f2c6a6", base: "#d79676", dim: "#93583f", deep: "#5c3024" }
const YELLOW = { shine: "#fffbc8", lit: "#fff070", base: "#eec414", dim: "#a87c08", deep: "#5e3c0c" }
const HAIR = { base: "#1b1f2e", lit: "#3a4468" }
const GREY = { lit: "#b4bccc", base: "#8e96a8", dim: "#565e70", deep: "#2f3e5a" }
const CYAN = { deep: "#123c4e", dim: "#1f88a4", base: "#62def0", lit: "#dafcff" }
const SAND = { lit: "#f0e4c0", base: "#d8c8a0", dim: "#a69670", deep: "#6e6244" }
const GECKO = { lit: "#d4c682", base: "#a89a5e", dim: "#6e6236", deep: "#3e3820" }
const AMBER = { lit: "#ffd58a", base: "#eea040", dim: "#b0602a", deep: "#552b1c" }
const CREST = { lit: "#e8843c", base: "#b8582c", deep: "#6c3018" }
const STEEL = { lit: "#dfe6ee", base: "#a8b4c4", dim: "#6c7888", deep: "#3a4454" }
const WHITE = { lit: "#ffffff", base: "#e4e6e4", dim: "#a8aeb8", deep: "#5e6478" }
const RED = { deep: "#7e1420", base: "#c01e2a", lit: "#ff3a3a" }

// The panels: `top` over `ground`, running into it through stripes that thin out; the same rows for everyone.
const PANELS = {
  juno: { top: "#3e1240", ground: "#131a2a" },
  prediger: { top: "#c8761e", ground: "#5e2c14" },
  ashe: { top: RED.base, ground: RED.deep },
  teo: { top: "#27496e", ground: "#0c1626" },
  evi: { top: "#1f7ea4", ground: "#0f3048" },
  motte: { top: "#7558d0", ground: "#2c2070" },
  bao: { top: "#f0b868", ground: "#a85c24" },
  haldane: { top: "#4470d8", ground: "#172a68" },
  regenleserin: { top: "#44478a", ground: "#181b3c" },
  imai: { top: "#8a5484", ground: "#37223f" },
  monteur: { top: "#8e6440", ground: "#33221a" },
  kessler: { top: "#8e9a52", ground: "#343a1e" },
  varga: { top: "#2f7c50", ground: "#102e20" },
  sable: { top: "#3a1f6e", ground: "#140c2a" },
  koch: { top: "#46a892", ground: "#1a4c46" },
  ines: { top: "#e48cac", ground: "#7c3a5c" },
  lantern: { top: "#c8208e", ground: "#2e0a48" },
}
const STRIPES = [[0, 15], [16, 4], [21, 3], [25, 3], [30, 2], [34, 2], [39, 1], [44, 1], [50, 1]]

/** An ellipse as a path, turned by `turn` radians. */
const oval = (cx, cy, rx, ry = rx, turn = 0) => {
  const pts = [], ct = Math.cos(turn), st = Math.sin(turn)
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6, ex = rx * Math.cos(a), ey = ry * Math.sin(a)
    pts.push(`${(cx + ex * ct - ey * st).toFixed(1)},${(cy + ex * st + ey * ct).toFixed(1)}`)
  }
  return pts.join(" ")
}
const mix = (a, b, t) => {
  const c = (s, i) => parseInt(s.slice(1 + i * 2, 3 + i * 2), 16)
  return "#" + [0, 1, 2].map((i) => Math.round(c(a, i) * (1 - t) + c(b, i) * t).toString(16).padStart(2, "0")).join("")
}
/** A material's five tones, dark to light. `half` is the light side's last step, close to base: the big step, across the terminator, is from it to dim. */
const ramp5 = (S) => {
  const dim = S.dim ?? mix(S.base, S.deep, 0.5), deep = S.deep ?? mix(dim, INK, 0.5)
  return [deep, dim, mix(S.base, dim, 0.45), S.base, S.lit ?? mix(S.base, "#ffffff", 0.3)]
}
// The one light, upper left and a little in front. What a form's surface gets from it decides its tone; the same thresholds for everyone.
const LIGHT = { x: -0.56, y: -0.66, z: 0.5 }
const FORM_AT = [-0.12, 0.26, 0.44, 0.83]
const parsePath = (s) => s.trim().split(/\s+/).map((t) => {
  const sharp = t.endsWith("!"), [x, y] = t.replace("!", "").split(",").map(Number)
  return { x, y, sharp }
})
/** Corner cutting: a few rounds turn the points into a curve, leaving the marked ones as corners. */
function rounded(P, closed, rounds = 3) {
  for (let r = 0; r < rounds; r++) {
    const Q = [], n = P.length, last = closed ? n : n - 1
    if (!closed) Q.push({ ...P[0], sharp: true })
    for (let i = 0; i < last; i++) {
      const a = P[i], b = P[(i + 1) % n]
      if (a.sharp && (closed || i > 0)) Q.push(a)
      if (!a.sharp) Q.push({ x: a.x * 0.75 + b.x * 0.25, y: a.y * 0.75 + b.y * 0.25 })
      if (!b.sharp) Q.push({ x: a.x * 0.25 + b.x * 0.75, y: a.y * 0.25 + b.y * 0.75 })
    }
    if (!closed) Q.push({ ...P[n - 1], sharp: true })
    P = Q
  }
  return P
}

function painter() {
  const B = new Array(PW * PH).fill(null), FIG = new Uint8Array(PW * PH)
  const at = (x, y) => y * PW + x, inside = (x, y) => x >= 0 && y >= 0 && x < PW && y < PH
  const put = (x, y, t) => { if (t && inside(x, y)) B[at(x, y)] = t }
  const raster = (path) => {
    const Q = rounded(parsePath(path), true), M = new Uint8Array(PW * PH)
    for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) {
      let c = false
      for (let i = 0, j = Q.length - 1; i < Q.length; j = i++) {
        const a = Q[i], b = Q[j]
        if ((a.y > y + 0.5) !== (b.y > y + 0.5) && x + 0.5 < (b.x - a.x) * (y + 0.5 - a.y) / (b.y - a.y) + a.x) c = !c
      }
      if (c) M[at(x, y)] = 1
    }
    return M
  }
  /** Steps a tone along a ramp; a colour that isn't on the ramp (a seam, a stain) stays what it is. */
  const stepped = (R, t, n) => { const i = R ? R.indexOf(t) : -1; return i < 0 ? t : R[Math.max(0, Math.min(R.length - 1, i + n))] }
  const region = (M, R0 = null) => ({
    M,
    R: R0,
    has: (x, y) => inside(x, y) && M[at(x, y)] === 1,
    /**
     * The part as a rounded form under the one light: its edge falls away over `r` px, the upper left catches the light, the lower right turns from it.
     * `tilt` turns the whole form towards the light (+) or from it (-). `pick(x, y, i)` gives a tone from the 0-4 of the ramp, for what changes on the way (bands).
     */
    form(S, { r = 12, tilt = 0, pick = null } = {}) {
      const R = ramp5(S); this.R = R
      const D = new Float32Array(PW * PH).fill(1e6)
      const out = (x, y) => inside(x, y) && !M[at(x, y)]          // the canvas' edge doesn't end a form: parts run on past it
      for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) if (M[at(x, y)]) {
        let d = D[at(x, y)]
        if (out(x - 1, y) || out(x, y - 1) || out(x + 1, y) || out(x, y + 1)) d = 1
        if (x > 0) d = Math.min(d, D[at(x - 1, y)] + 1)
        if (y > 0) d = Math.min(d, D[at(x, y - 1)] + 1)
        if (x > 0 && y > 0) d = Math.min(d, D[at(x - 1, y - 1)] + 1.41)
        if (x + 1 < PW && y > 0) d = Math.min(d, D[at(x + 1, y - 1)] + 1.41)
        D[at(x, y)] = d
      }
      for (let y = PH - 1; y >= 0; y--) for (let x = PW - 1; x >= 0; x--) if (M[at(x, y)]) {
        let d = D[at(x, y)]
        if (x + 1 < PW) d = Math.min(d, D[at(x + 1, y)] + 1)
        if (y + 1 < PH) d = Math.min(d, D[at(x, y + 1)] + 1)
        if (x + 1 < PW && y + 1 < PH) d = Math.min(d, D[at(x + 1, y + 1)] + 1.41)
        if (x > 0 && y + 1 < PH) d = Math.min(d, D[at(x - 1, y + 1)] + 1.41)
        D[at(x, y)] = d
      }
      // the height of a dome over that distance, smoothed so that the middle line of a shape doesn't show as a crease
      let H = new Float32Array(PW * PH)
      for (let i = 0; i < H.length; i++) if (M[i]) { const t = Math.min(1, (D[i] - 0.5) / r), u = 1 - t; H[i] = r * Math.sqrt(Math.max(0, 1 - u * u)) }
      const hAt = (A, x, y, cx, cy) => (inside(x, y) ? (M[at(x, y)] ? A[at(x, y)] : 0) : A[at(cx, cy)])
      for (let pass = 0; pass < 3; pass++) {
        const N = new Float32Array(PW * PH)
        for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) if (M[at(x, y)]) {
          let s = 0
          for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) s += hAt(H, x + i, y + j, x, y)
          N[at(x, y)] = s / 9
        }
        H = N
      }
      const I = new Int8Array(PW * PH).fill(-1)
      for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) if (M[at(x, y)]) {
        const nx = -(hAt(H, x + 1, y, x, y) - hAt(H, x - 1, y, x, y)) / 2, ny = -(hAt(H, x, y + 1, x, y) - hAt(H, x, y - 1, x, y)) / 2, l = Math.hypot(nx, ny, 1)
        const v = (nx * LIGHT.x + ny * LIGHT.y + LIGHT.z) / l + tilt
        I[at(x, y)] = FORM_AT.filter((a) => v > a).length
      }
      // no 1 px islands: a tone alone among others takes the commonest round it
      for (let pass = 0; pass < 2; pass++) for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) if (I[at(x, y)] >= 0) {
        const n = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([a, b]) => inside(x + a, y + b) && I[at(x + a, y + b)] >= 0).map(([a, b]) => I[at(x + a, y + b)])
        if (n.length && !n.includes(I[at(x, y)])) I[at(x, y)] = n.sort((a, b) => n.filter((v) => v === b).length - n.filter((v) => v === a).length)[0]
      }
      for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) if (I[at(x, y)] >= 0) B[at(x, y)] = pick ? pick(x, y, I[at(x, y)]) : R[I[at(x, y)]]
      return this
    },
    /** A plane turned from the light (-) or to it (+): the tones under `path` go that many steps along the ramp, so the form still shows through. */
    plane(path, n) {
      const N = raster(path)
      for (let i = 0; i < N.length; i++) if (N[i] && M[i]) B[i] = stepped(this.R, B[i], n)
      return this
    },
    /**
     * A fold where cloth bends: a ridge along `path`, up to `w` px to each side, thinning out at its ends. The side towards the light takes `up` steps, the other `down`.
     * No line goes with it: the two tones are the fold.
     */
    fold(path, w = 2, { down = 2, up = 1 } = {}) {
      const Q = rounded(parsePath(path), false)
      const len = []; let total = 0
      for (let i = 0; i < Q.length; i++) { if (i) total += Math.hypot(Q[i].x - Q[i - 1].x, Q[i].y - Q[i - 1].y); len.push(total) }
      for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) if (M[at(x, y)]) {
        let best = 1e9, bi = 0
        for (let i = 0; i < Q.length; i++) { const d = (Q[i].x - x - 0.5) ** 2 + (Q[i].y - y - 0.5) ** 2; if (d < best) { best = d; bi = i } }
        const a = Q[Math.max(0, bi - 1)], b = Q[Math.min(Q.length - 1, bi + 1)], tx = b.x - a.x, ty = b.y - a.y, tl = Math.hypot(tx, ty) || 1
        const nx = -ty / tl, ny = tx / tl, side = (x + 0.5 - Q[bi].x) * nx + (y + 0.5 - Q[bi].y) * ny
        const t = total ? len[bi] / total : 0, width = w * Math.pow(Math.sin(Math.PI * t), 0.6)
        if (Math.abs(side) > width || Math.sqrt(best) > width + 0.8) continue
        const towards = side * (nx * LIGHT.x + ny * LIGHT.y) > 0
        B[at(x, y)] = stepped(this.R, B[at(x, y)], towards ? up : -down)
      }
      return this
    },
    /** A plane inside this part. */
    tone(path, t) { const N = raster(path); for (let i = 0; i < N.length; i++) if (N[i] && M[i]) B[i] = t; return this },
    /** The shadow a shape throws on this part; paint it before the shape. */
    cast(path, dx, dy, t) {
      const N = raster(path)
      for (let y = PH - 1; y >= 0; y--) for (let x = PW - 1; x >= 0; x--) if (inside(x - dx, y - dy) && N[at(x - dx, y - dy)] && M[at(x, y)]) B[at(x, y)] = t
      return this
    },
    /** A part lying on this one and cut off by it, with its own planes. */
    within(path, t) { const N = raster(path); for (let i = 0; i < N.length; i++) { N[i] = N[i] && M[i] ? 1 : 0; if (N[i] && t) B[i] = t } return region(N, this.R) },
    /** The side of the part towards (dx, dy): the terminator follows the form and thins out where the form turns. */
    edge(dx, dy, t) {
      const hit = []
      for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) if (M[at(x, y)] && !(inside(x + dx, y + dy) && M[at(x + dx, y + dy)])) hit.push(at(x, y))
      for (const i of hit) B[i] = t
      return this
    },
    ink(t = INK) {
      for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) if (M[at(x, y)]) {
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (inside(x + dx, y + dy) && !M[at(x + dx, y + dy)]) { B[at(x, y)] = t; break }
      }
      return this
    },
    /** A line where this part lies over the figure already painted, just outside it; on the panel's side p.outline() does the same. */
    sep(t = INK) {
      for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) if (!M[at(x, y)] && FIG[at(x, y)]) {
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (inside(x + dx, y + dy) && M[at(x + dx, y + dy)]) { B[at(x, y)] = t; break }
      }
      return this
    },
  })
  const p = {
    put,
    part(path, t) { const M = raster(path); for (let i = 0; i < M.length; i++) if (M[i]) { B[i] = t; FIG[i] = 1 } return region(M) },
    /** A clean line: stepped diagonally, with the elbows of its L-corners taken out. */
    line(path, t, fig = false) {
      const Q = rounded(parsePath(path), false), L = []
      for (let i = 0; i + 1 < Q.length; i++) {
        let x0 = Math.floor(Q[i].x), y0 = Math.floor(Q[i].y)
        const x1 = Math.floor(Q[i + 1].x), y1 = Math.floor(Q[i + 1].y)
        const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1
        let e = dx + dy
        for (;;) {
          const l = L[L.length - 1]
          if (!l || l[0] !== x0 || l[1] !== y0) L.push([x0, y0])
          if (x0 === x1 && y0 === y1) break
          const e2 = 2 * e
          if (e2 >= dy) { e += dy; x0 += sx }
          if (e2 <= dx) { e += dx; y0 += sy }
        }
      }
      for (let i = 1; i + 1 < L.length; i++) {
        const a = L[i - 1], b = L[i + 1]
        if (Math.abs(a[0] - b[0]) === 1 && Math.abs(a[1] - b[1]) === 1) { L.splice(i, 1); i-- }
      }
      for (const [x, y] of L) { put(x, y, t); if (fig && inside(x, y)) FIG[at(x, y)] = 1 }
    },
    grid(x, y, rows, map) {
      rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] !== "." && r[i] !== " ") put(x + i, y + j, map[r[i]]) })
    },
    rect(x, y, w, h, t) { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) put(i, j, t) },
    /** The figure's ink: the line carries more weight on the side away from the light. */
    outline() {
      const O = new Uint8Array(PW * PH)
      for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) if (!FIG[at(x, y)]) {
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (inside(x + dx, y + dy) && FIG[at(x + dx, y + dy)]) { O[at(x, y)] = 1; break }
      }
      for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) if (O[at(x, y)]) {
        B[at(x, y)] = INK
        if (x + 1 < PW && !FIG[at(x + 1, y)] && FIG[at(x - 1, y)]) B[at(x + 1, y)] = INK
      }
    },
    panel(P) {
      for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) B[at(x, y)] = P.ground
      for (const [y0, h] of STRIPES) p.rect(0, y0, PW, h, P.top)
    },
    /** The series' frame: an ink edge with the skin's two 45-degree cuts, top left and bottom right. */
    frame() {
      const CUT = 6
      for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) {
        const cut = x + y < CUT || (PW - 1 - x) + (PH - 1 - y) < CUT
        if (cut || x === 0 || y === 0 || x === PW - 1 || y === PH - 1 || x + y === CUT || (PW - 1 - x) + (PH - 1 - y) === CUT) B[at(x, y)] = INK
      }
    },
    emit(c) { for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) c.px(x, y, B[at(x, y)]) },
    emitSet(c) { for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) if (B[at(x, y)]) c.px(x, y, B[at(x, y)]) },
  }
  return p
}

/** Fingers wrapped round something, one above the other: rounded bars with their tips towards `tip` (1 right, -1 left), ink round them and a shadow between. */
function fingers(p, x, y, lens, S, tip = 1) {
  const X = (j) => (tip > 0 ? x + j : x - j)
  lens.forEach((len, i) => {
    const y0 = y + i * 3
    for (let j = 0; j < len; j++) { p.put(X(j), y0, INK); p.put(X(j), y0 + 1, S.base); p.put(X(j), y0 + 2, S.base); p.put(X(j), y0 + 3, INK) }
    p.put(X(0), y0 + 2, S.dim); p.put(X(1), y0 + 2, S.dim)
    p.put(X(len - 1), y0 + 1, S.lit ?? S.base); p.put(X(len - 2), y0 + 2, S.dim)
    p.put(X(len), y0 + 1, INK); p.put(X(len), y0 + 2, INK)
  })
}

/** The Lull patch, always as on Teo in the title picture: an oval disc, pale, a darker rim, a brighter stripe. Round its middle at (x, y). */
function lullPatch(p, x, y, big) {
  const rows = big
    ? ["..ggg..", ".gRRRg.", "gRccRRg", "gRccRRg", "gRccRRg", "gRccRRg", ".gRRRg.", "..ggg.."]
    : [".g.", "gcg", "gRg", ".g."]
  p.grid(x - (big ? 3 : 1), y - (big ? 4 : 2), rows, { g: "#3d6690", R: "#c8e8ff", c: "#dafcff" })
}

const PORTRAITS = []
function portrait(name, panel, draw, picture) {
  PORTRAITS.push(`portrait_${name}`)
  sprite(`portrait_${name}`, { w: PW, h: PH }, (c) => {
    const p = painter()
    p.panel(panel)
    draw(p)
    if (!picture) p.frame()
    p.emit(c)
    if (picture) { c.stamp(picture, 0, 0); const f = painter(); f.frame(); f.emitSet(c) }      // a finished picture lies between the panel and the frame
  })
}

// ---------------------------------------------------------------- Juno Reyes
// The title picture's Juno, in profile: we don't need to see her from the front, it keeps her closed. Set to the right of the panel, since she
// looks left. The cheek's cyan line is that picture's own (style guide §6). Cut out by tools/portrait-title.py.
sprite("_juno_title", { png: "juno_title.png" })
portrait("juno", PANELS.juno, () => {}, "_juno_title")

// ---------------------------------------------------------------- The Preacher
// Square on, his head a little too big for the neck, the flask up beside it.
portrait("prediger", PANELS.prediger, (p) => {
  const S = SAND, G = GECKO, A = AMBER
  // the coat, narrow and hanging, with its collar; folds with a cause: the raised arm pulls it
  const coat = p.part("14,104! 20,90 28,80 38,75 56,75 66,80 76,90 82,104!", S.base)
  coat.edge(6, 3, S.dim)
  coat.tone("62,80 82,94 82,104! 68,104! 66,92", S.dim)
  coat.tone("24,88 30,80 36,78 32,86 26,94", S.lit)
  p.line("24,94 32,92 40,98", S.dim)
  p.line("68,100 62,90", S.deep)
  const neck = p.part("41,58! 53,58! 53,74 50,82 44,82 41,74", G.base)
  neck.edge(3, 0, G.dim)
  p.line("44,64 45,72", G.dim)
  p.line("49,62 50,70", G.dim)
  const collarL = p.part("38,74! 44,82! 40,90! 31,80!", S.lit)
  collarL.ink(S.deep)
  const collarR = p.part("56,74! 50,82! 54,90! 63,80!", S.base)
  collarR.ink(S.deep)
  // the counter on its cord, the days he has been awake
  p.line("43,76 44,84", INK)
  p.line("51,76 50,84", INK)
  p.rect(37, 84, 20, 14, INK)
  p.rect(38, 85, 18, 12, CYAN.deep); p.rect(38, 85, 18, 1, CYAN.dim)
  p.rect(39, 86, 16, 10, "#07202c")
  p.rect(42, 87, 3, 8, CYAN.base); p.put(41, 88, CYAN.base); p.rect(42, 87, 1, 8, CYAN.lit)
  p.rect(49, 87, 3, 8, CYAN.base); p.put(48, 88, CYAN.base); p.rect(49, 87, 1, 8, CYAN.lit)
  // the crest: flaps of skin along the skull, soft, falling back to the side
  const FLAPS = [
    "62,24! 67,12 77,5! 76,15 75,24 68,27!",
    "50,20! 55,10 66,3! 65,13 66,22!",
    "38,20! 42,10 53,3! 53,13 54,22!",
    "26,24! 28,14 39,5! 41,15 40,22!",
  ]
  for (const f of FLAPS) {
    const flap = p.part(f, CREST.base)
    flap.edge(3, 1, CREST.deep)
    flap.edge(-2, -1, CREST.lit)
    flap.ink(INK)
  }
  // the skull, flat and wide; the jaw
  const head = p.part("20,38 24,24 34,16 48,14 62,16 72,24 77,38 74,50 64,60 48,65 34,63 24,54", G.base)
  head.edge(4, 5, G.dim)
  head.edge(1, 2, G.deep)
  head.tone("24,46 30,54 40,58 32,60 25,54", G.lit)
  for (const [x, y] of [[44, 17], [52, 16], [28, 22], [70, 54], [30, 58], [38, 62], [50, 67]]) p.grid(x, y, ["dd", ".d"], { d: G.dim })
  // the eyes: lidless, in a ring of skin, standing out of the skull; most of his head
  const circle = (cx, cy, r) => {
    const pts = []
    for (let i = 0; i < 12; i++) pts.push(`${(cx + r * Math.cos(i * Math.PI / 6)).toFixed(1)},${(cy + r * Math.sin(i * Math.PI / 6)).toFixed(1)}`)
    return pts.join(" ")
  }
  const eye = (cx, cy, r, slit) => {
    const ring = p.part(circle(cx, cy, r + 2), G.base)
    ring.tone(circle(cx + 2, cy + 3, r + 1), G.dim)
    const ball = p.part(circle(cx, cy, r), A.base)
    ball.edge(5, 7, A.dim)
    ball.edge(-5, -6, A.lit)
    ball.ink(A.deep)
    // the slit, notched as a gecko's is, with a dark halo that makes the iris stand
    const sx = cx + slit
    p.rect(sx - 2, cy - r + 3, 5, 2 * r - 5, A.dim)
    p.rect(sx - 1, cy - r + 2, 3, 2 * r - 3, INK)
    for (const dy of [-7, 0, 7]) { p.put(sx - 2, cy + dy, INK); p.put(sx + 2, cy + dy, INK) }
    p.rect(cx - r + 5, cy - r + 5, 4, 3, "#fff4d8")
    p.rect(cx - r + 4, cy - r + 8, 2, 2, A.lit)
  }
  eye(33, 33, 13, 1)
  eye(62, 31, 15, -2)
  // the mouth, too wide, a row of tiny teeth under the eyes
  const mouth = p.part("28,53! 40,57 54,57 70,50! 64,60 50,64 38,63", "#3a1420")
  mouth.ink(INK)
  for (let x = 33; x < 64; x += 3) { const y = x < 40 ? 56 : x < 56 ? 58 : 56 - Math.round((x - 56) / 4); p.put(x, y, "#fff4d8"); p.put(x, y + 1, "#fff4d8") }
  p.grid(44, 50, ["kk..kk", ".k...k"], { k: G.deep })                       // the nostrils, between the eyes
  // the arm up, in its wide sleeve; thin fingers with pads round the flask
  const arm = p.part("0,104! 1,88 5,72 19,72 23,88 23,104!", S.base)
  arm.edge(4, 0, S.dim)
  arm.edge(-1, 0, S.lit)
  p.line("6,84 14,81", S.dim)
  p.line("4,76 11,78 20,76", S.deep)
  const wrist = p.part("8,54! 15,54! 15,74! 8,74!", G.base)
  wrist.edge(2, 0, G.dim)
  const flask = p.part("5,23! 16,23! 16,58! 5,58!", STEEL.base)
  flask.edge(4, 0, STEEL.dim)
  flask.tone("7,25! 9,25! 9,56! 7,56!", STEEL.lit)
  const cap = p.part("4,14! 17,14! 17,25! 4,25!", A.base)
  cap.edge(4, 0, A.dim)
  cap.edge(0, 2, A.dim)
  cap.tone("6,16! 9,16! 9,20! 6,20!", A.lit)
  p.outline()
  // his fingers lie in front of the flask, with an ink of their own: thin, each ending in a gecko's round pad
  const FIN = { g: G.base, d: G.dim, l: G.lit, k: INK, p: G.lit, P: G.base }
  p.grid(2, 42, [
    "...........kkk..",
    "kkkkkkkkkkkpppk.",
    "kggggggggggpppk.",
    "kddddddddddPPPk.",
    "kkkkkkkkkkkkkk..",
    "...........kkk..",
    "kkkkkkkkkkkpppk.",
    "kggggggggggpppk.",
    "kddddddddddPPPk.",
    "kkkkkkkkkkkkkk..",
    "...........kkk..",
    "kkkkkkkkkkkpppk.",
    "kggggggggggpppk.",
    "kddddddddddPPPk.",
    "kkkkkkkkkkkkkk..",
  ], FIN)
})

// ---------------------------------------------------------------- Corvin Ashe
// Dead square on, nothing moves. The one figure with no face.
portrait("ashe", PANELS.ashe, (p) => {
  const C = WHITE, RIM = "#e8707a"
  // broad, square shoulders, a coat somebody irons: the folds it has are the ones it can't help, off the shoulders and across the elbows
  const coat = p.part("-4,104! -4,86 2,76 14,70 28,66 52,66 66,70 78,76 84,86 84,104!", C.base)
  coat.form(C, { r: 17 })
  coat.plane("58,70 84,84 84,104! 68,104! 64,86", -1)
  coat.fold("11,78 15,90 12,104", 2.4)
  coat.fold("69,78 65,90 68,104", 2.4)
  coat.fold("0,92 6,96 10,104", 2)
  coat.fold("80,92 74,96 70,104", 2)
  coat.fold("26,78 30,88 28,100", 1.6)
  coat.fold("54,78 50,88 52,100", 1.6)
  // the shoulder straps and the raglan seams
  p.line("6,78 22,70", C.deep)
  p.line("7,82 22,73", C.deep)
  p.line("74,78 58,70", C.deep)
  p.line("73,82 58,73", C.deep)
  p.line("16,76 10,88 8,104!", C.dim)
  p.line("64,76 70,88 72,104!", C.deep)
  // the front's overlap, the two rows of buttons
  p.line("47,82 47,104!", C.deep)
  p.line("46,82 46,104!", C.lit)
  for (const [x, y] of [[35, 87], [53, 87], [35, 97], [53, 97]]) { p.rect(x, y, 3, 3, C.deep); p.rect(x, y, 2, 2, C.dim) }
  coat.edge(1, 0, RIM)
  // the inside of the collar behind the neck, in shadow, and the dark at the throat; nothing shows but dark
  const back = p.part("16,62! 18,40! 40,34! 62,40! 64,62! 56,80! 24,80!", C.deep)
  back.tone("24,40 56,40 58,62 50,82 30,82 22,62", "#141622")
  // the collar's two flaps, stiff, turned up beside the jaw, opening away from the throat
  const left = p.part("6,76! 12,44! 24,52 30,66 40,84! 22,86!", C.lit)
  left.form(C, { r: 9, tilt: 0.06 })
  left.fold("14,54 18,68 22,80", 1.6, { down: 1 })
  left.ink(INK)
  const right = p.part("74,76! 68,44! 56,52 50,66 40,84! 58,86!", C.base)
  right.form(C, { r: 9, tilt: -0.12 })
  right.fold("66,54 62,68 58,80", 1.6, { down: 1 })
  right.ink(INK)
  // a small red light on the lapel, the only thing about him that blinks
  p.rect(17, 69, 4, 4, C.deep)
  p.rect(18, 70, 2, 2, RED.lit)
  // the head itself is only a shape for the outline; the burn covers it
  p.part("24,26 28,12 40,7 52,12 56,26 54,42 46,52 34,52 26,42", C.lit)
  p.outline()
  // the burn: no ink round it, it goes over the collar and the panel. White, then the bloom, and past the
  // head it smears along the rows, as a sensor does.
  const BLOOM = "#ffc4b4", HALO = "#ffe8e0"
  // the shape: a head's, cranium wide and jaw narrow, but not a clean one, so it doesn't read as an egg
  const half = (y) => {
    const t = (y - 30) / 24
    if (Math.abs(t) > 1) return -1
    const form = Math.pow(1 - Math.pow(Math.abs(t), 2.6), 0.5) * (t > 0 ? 1 - 0.22 * t : 1)
    return Math.round(19 * form)
  }
  // rows of the burn that run on past the shape, left and right; in blocks of a few rows, as a sensor tears
  const SMEAR = { 11: [0, 2], 12: [2, 2], 17: [4, 0], 18: [4, 0], 21: [0, 7], 22: [0, 8], 23: [0, 5], 27: [10, 3], 28: [14, 3], 29: [12, 4], 30: [6, 2], 35: [2, 11], 36: [2, 14], 37: [1, 8], 42: [6, 1], 43: [7, 1], 48: [3, 4] }
  for (let y = 0; y < PH; y++) {
    const h = half(y); if (h < 0) continue
    const [l, r] = SMEAR[y] ?? [0, 0]
    for (let x = 40 - h - 3 - l; x <= 40 + h + 3 + r; x++) p.put(x, y, BLOOM)
    for (let x = 40 - h - 2 - Math.round(l * 0.7); x <= 40 + h + 2 + Math.round(r * 0.7); x++) p.put(x, y, HALO)
    for (let x = 40 - h - Math.round(l * 0.3); x <= 40 + h + Math.round(r * 0.3); x++) p.put(x, y, "#ffffff")
  }
  // two dark slits, level, straight at us: polite, patient
  const SLIT = { k: "#14080e", d: "#8a5a5e" }
  p.grid(24, 27, [
    "ddkkkkkkkkkk.",
    ".kkkkkkkkkkkd",
    "...ddkkkkkkd.",
  ], SLIT)
  p.grid(43, 27, [
    ".kkkkkkkkkkdd",
    "dkkkkkkkkkkk.",
    ".dkkkkkkdd...",
  ], SLIT)
})

// ---------------------------------------------------------------- Teo Reyes
// The title picture's Teo, asleep against the glass, a mirror of Juno's portrait: he looks right, so he sits on the left. Cut out by
// tools/portrait-title.py, from the frame where his Lull patch is brightest.
sprite("_teo_title", { png: "teo_title.png" })
portrait("teo", PANELS.teo, () => {}, "_teo_title")

// ---------------------------------------------------------------- EVI
// The only soft round shape in the series: her deck sprite (art/ui/deck.px.js) at three times the size. Worried and curious at once, one ear drooping.
portrait("evi", PANELS.evi, (p) => {
  const M = { lit: "#d2fff4", base: "#8ef5d8", dim: "#4fc9b0", deep: "#2a7f70" }
  // the ears: thin stems with a light on each
  p.part("19,34! 24,32! 19,14! 15,15!", M.deep)
  p.part("56,32! 61,34! 69,20! 65,18!", M.deep)
  const earL = p.part(oval(15, 11, 7), M.lit)
  earL.edge(2, 3, M.base)
  const earR = p.part(oval(69, 17, 6), M.base)
  earR.edge(2, 3, M.dim)
  p.part("33,88! 47,88! 47,95! 33,95!", M.dim)
  const body = p.part(oval(40, 57, 37, 35), M.base)
  body.edge(6, 7, M.dim)
  body.edge(2, 3, M.deep)
  p.line("11,48 16,36 26,27 38,24", M.lit)
  p.line("12,50 17,38 27,29 36,26", M.lit)
  p.outline()
  p.rect(13, 8, 4, 4, "#ffffff"); p.rect(68, 15, 2, 2, M.lit)         // the ears' lights: one up and bright, the other lower
  // the eyes: the deck's tall ink ovals, the glint up at the side she is looking
  for (const [cx, cy] of [[25, 56], [55, 56]]) {
    const eye = body.within(oval(cx, cy, 9, 11), INK)
    eye.tone(oval(cx - 1, cy + 7, 6, 3), CYAN.deep)
    p.rect(cx - 5, cy - 8, 6, 6, CYAN.lit)
    p.rect(cx + 3, cy + 3, 2, 2, CYAN.base)
  }
  // the brows, up in the middle: she has just asked why
  p.line("11,41 17,38 26,36", INK)
  p.line("11,42 17,39 26,37", INK)
  p.line("69,41 63,38 54,36", INK)
  p.line("69,42 63,39 54,37", INK)
  p.grid(36, 72, [".kkkk.", "k....k", "k....k", ".kkkk."], { k: INK })
  p.grid(36, 73, [".mmmm.", ".mmmm."], { m: M.deep })
  // a blush under each eye, as on the deck when she is pleased
  p.rect(10, 69, 7, 2, "#ffa8d8"); p.rect(63, 69, 7, 2, "#ffa8d8")
})

// ---------------------------------------------------------------- Motte
// A small round face under a cap far too big for it, looking up over the handheld: one lid lower than the other, the corner of the mouth up.
portrait("motte", PANELS.motte, (p) => {
  const J = { lit: "#ffb0d4", base: "#ff6fae", dim: "#b8407a", deep: "#7e2a5a" }
  const S = { lit: "#eab898", base: "#d79676", dim: "#93583f", deep: "#6e3430" }
  const W = { lit: "#fffff0", base: "#f0f0e0", dim: "#c4c4b4", deep: "#8e8e84" }
  const T = { base: "#1f88a4", deep: "#123c4e", lit: "#62def0" }
  // the jacket: a child's narrow shoulders in something bought to last, the sleeves coming in to the grips
  const body = p.part("2,104! 5,86 14,74 26,69 54,69 66,74 75,86 78,104!", J.base)
  body.edge(5, 3, J.dim)
  body.tone("6,88 14,76 26,71 18,80 11,90", J.lit)
  p.line("20,76 16,90", J.deep)
  p.line("60,76 64,90", J.deep)
  const collar = p.part("26,72 40,78 54,72 56,64 24,64", J.dim)
  collar.edge(0, 2, J.deep)
  // the ears, the head: wider than long, the chin small
  for (const [x, y] of [[16, 49], [64, 49]]) { const e = p.part(oval(x, y, 4, 6), S.base); e.edge(2, 2, S.dim) }
  const head = p.part("17,44 22,32 40,28 58,32 63,44 62,58 54,68 40,72 26,68 18,58", S.base)
  head.edge(4, 4, S.dim)
  head.edge(0, 1, "#8fc4bc")                                        // the screen's light under his chin
  head.tone("22,50 24,42 30,38 26,46", S.lit)
  head.sep()
  // the cap, far too big, ringed in stripes, with a ribbed band; it has slid down to his brows
  const cap = p.part("7,40! 5,27 11,15 25,9 44,7 60,9 71,16 76,28 74,40!", W.base)
  cap.edge(5, 2, W.dim)
  for (let y = 0; y < 31; y++) for (let x = 0; x < 80; x++) {
    if (!cap.has(x, y)) continue
    const dx = (x - 40) / 37, row = y - 8 * dx * dx
    if ((row >= 18 && row < 23) || (row >= 10 && row < 13)) p.put(x, y, Math.abs(dx) > 0.8 || dx > 0.55 ? T.deep : T.base)
  }
  cap.edge(1, 1, W.deep)
  for (let x = 4; x < 77; x++) for (let y = 31; y < 41; y++) if (cap.has(x, y)) { const r = x + Math.round((x - 40) * (y - 31) * 0.012); p.put(x, y, r % 4 < 2 ? W.base : r % 4 === 2 ? T.base : W.dim) }
  p.line("6,34 20,31 40,30 60,31 75,34", T.deep)
  // the pompom
  const pom = p.part(oval(32, 8, 7), J.base)
  pom.edge(2, 2, J.dim)
  pom.tone(oval(30, 6, 3), J.lit)
  // the handheld, held low; we see its back, two grips of different colours
  const con = p.part("6,83! 74,83! 74,95! 6,95!", "#2f3e5a")
  con.edge(0, 3, "#1a2337")
  con.tone("6,83! 74,83! 74,85! 6,85!", "#41547a")
  p.rect(30, 87, 20, 3, T.deep); p.rect(31, 88, 18, 1, T.lit)
  const gL = p.part("2,81 18,81 20,94 15,100 6,100 1,94", T.base)
  gL.edge(3, 3, T.deep)
  gL.tone(oval(7, 85, 3), T.lit)
  const gR = p.part("62,81 78,81 79,94 74,100 65,100 60,94", "#eea040")
  gR.edge(3, 3, "#b0602a")
  gR.tone(oval(73, 85, 3), "#ffd58a")
  p.outline()
  // his fingers round the grips
  fingers(p, 9, 83, [8, 9, 9, 8], S)
  fingers(p, 70, 83, [8, 9, 9, 8], S, -1)
  // hair out from under the band
  const H = "#2a1c18"
  p.grid(18, 40, ["hhhhhhh", "hhhhh.h", "hh.h...", "h......"], { h: H })
  p.grid(55, 40, ["hhhhhhh", "h.hhhhh", "...h.hh", "......h"], { h: H })
  // the eyes: big, a child's, set low; the bags are real, the left lid lower
  const E = { k: INK, w: "#f6f4e8", i: "#34221a", I: "#6a4028", g: "#ffffff", d: S.dim, s: S.lit, b: "#b87a60" }
  p.grid(23, 44, [
    "ddddddddddddd",
    "kkkkkkkkkkkkk",
    "dwwwiiiiiwwwk",
    ".wwwiIgiiwww.",
    ".wwwiIiiiwww.",
    "..wwwiiiwww..",
    "...kkkkkkk...",
    "...bbbbbbb...",
  ], E)
  p.grid(44, 41, [
    "...kkkkkkk...",
    ".kkkkkkkkkkk.",
    "kwwwwiiiiwwwk",
    "kwwwwiIgiiwwk",
    ".wwwwiIiiiww.",
    ".wwwwiIiiiww.",
    "..wwwwiiiww..",
    "...kkkkkkk...",
    "...bbbbbbb...",
  ], E)
  // the nose, the mouth going up at one corner, a chipped tooth showing
  p.grid(38, 54, [".d.", "dd.", "ddd"], E)
  p.grid(30, 59, [
    "..............kk",
    ".............kd.",
    "kkk.......kkkk..",
    "..kkkkkkkkwwk...",
    ".......kkkkk....",
  ], E)
})

// ---------------------------------------------------------------- Bao
// Bald, the big glasses, a white beard; the left sleeve pinned up at the shoulder, the ladle up in the other hand. He has just tasted it and is not impressed.
portrait("bao", PANELS.bao, (p) => {
  const C = { lit: "#f4dcaa", base: "#e8c890", dim: "#b0905e", deep: "#7a6040" }
  const A = { base: "#f0f0e0", dim: "#b8b8a8", deep: "#8a8a80" }
  const S = { lit: "#ecbc9c", base: "#c9906c", dim: "#93583f", deep: "#6e3430" }
  const H = { lit: "#ffffff", base: "#e8e8e0", dim: "#a8a8a0" }
  // the body with its one shoulder, the pinned sleeve folded up on the other
  const body = p.part("8,104! 10,86 24,74 58,74 72,82 76,90 74,104!", C.base)
  body.edge(5, 3, C.dim)
  // the apron with its straps
  const apron = body.within("24,104! 26,84 54,84 56,104!", A.base)
  apron.edge(4, 0, A.dim)
  p.line("24,104! 26,84 54,84 56,104!", A.deep)
  p.line("29,84 31,72", A.dim); p.line("51,84 49,72", A.dim)
  p.line("30,84 32,72", A.base); p.line("50,84 48,72", A.base)
  // the fold, the pin: a sleeve with no arm in it, seen to long ago
  const fold = p.part("62,76 73,81 77,90 72,95 64,92", C.lit)
  fold.edge(3, 3, C.dim)
  fold.sep()
  p.rect(68, 83, 2, 2, "#8e96a8"); p.put(68, 83, "#dfe6ee")
  // the arm, up to the side; the ladle held by the end of its handle, its bowl by his head
  const sleeve = p.part("-8,104! -6,94 2,86 14,86 18,94 18,104!", C.base)
  sleeve.edge(4, 0, C.dim)
  const hand = p.part("1,72! 13,72! 13,90! 1,90!", S.base)
  hand.edge(3, 0, S.dim)
  p.line("-1,88 15,88", C.deep)
  // the head: a wide egg; the ears first, the hearing aid on his left
  for (const [x, y] of [[16, 44], [64, 44]]) { const e = p.part(oval(x, y, 4, 7), S.base); e.edge(2, 2, S.dim) }
  const head = p.part("17,38 21,20 31,11 45,10 55,16 61,28 63,44 59,62 49,72 33,72 21,62", S.base)
  head.edge(5, 5, S.dim)
  head.tone("23,28 29,16 37,13 31,22", S.lit)
  head.tone(oval(31, 15, 4, 2), "#ffe6d0")
  // the white beard, up round the jaw from one ear to the other, the moustache on it
  const beard = p.part("17,50 23,56 33,58 45,58 55,56 63,50 61,66 53,76 41,81 31,80 23,74 18,62", H.base)
  beard.edge(4, 4, H.dim)
  beard.sep(S.dim)
  head.tone("17,40! 21,40! 21,52! 17,50!", H.base)
  head.tone("59,40! 63,40! 63,52! 59,52!", H.dim)
  const hearing = p.part("64,38 69,40 69,48 64,50", GREY.base)
  hearing.edge(2, 2, GREY.dim)
  // the ladle comes last, in front of him: the tip of its bowl lies on his forehead
  // a real soup ladle (the user's photo): a thin straight handle running up to the low side of the rim, flaring just where it meets it
  const handle = p.part("6,78! 9,78! 9,34 11,29! 4,29! 6,34", STEEL.base)
  handle.edge(1, 0, STEEL.dim)
  handle.edge(-1, 0, STEEL.lit)
  // the bowl, a half sphere tipped toward his head: its pale back above, below that the polished inside, a mirror of dark and white with a bright rim
  // its rim lies on the 2:1 slope, the one diagonal that stays a clean line at this size
  const TILT = -0.4636
  const back = p.part(oval(13.2, 19.9, 11, 9.7, TILT), STEEL.lit)
  back.tone(oval(17.6, 16.8, 7, 4.4, TILT), STEEL.base)
  back.sep()
  back.tone(oval(7.1, 16.8, 2.2, 1.3, -0.9), "#ffffff")
  back.tone(oval(15.9, 19.9, 10, 4, TILT), STEEL.dim)
  const mouth = p.part(oval(15, 23, 11, 4.8, TILT), STEEL.base)
  mouth.sep()
  mouth.tone(oval(14.1, 20.4, 6, 1.8, TILT), STEEL.deep)
  mouth.tone(oval(18.1, 21.7, 3, 1.4, TILT), "#ffffff")
  mouth.tone(oval(13.2, 27.4, 6.6, 1.3, TILT), STEEL.lit)
  mouth.ink("#ffffff")
  p.outline()
  // the fingers round the handle
  fingers(p, 0, 72, [15, 16, 15, 13], S)
  // the glasses, huge, and behind them his eyes much too big
  const lens = (cx, cy, r) => {
    const l = head.within(oval(cx, cy, r), "#f6f0e4")
    l.edge(2, 3, "#d8cfc0")
    l.ink(INK)
    return l
  }
  lens(29, 40, 11)
  lens(52, 40, 11)
  p.line("39,38 42,37", INK)
  const E = { k: INK, i: "#34221a", g: "#ffffff", d: "#b09888", s: S.dim }
  // the left brow up, the right lid down: tasting, unsentimental
  p.grid(24, 36, ["..kkkkkk..", ".kiiiiiik.", "kiiggiiiik", "kiiggiiiik", ".kiiiiiik.", "..kkkkkk.."], E)
  p.grid(47, 38, ["kkkkkkkkkk", "kiiiiiiiik", "kiiggiiiik", ".kiiiiiik.", "..kkkkkk.."], E)
  // lens glints
  p.line("20,37 23,34", "#ffffff"); p.line("43,37 46,34", "#ffffff")
  // the brows, white and untidy
  p.grid(19, 25, ["...hhhhhhhh...", ".hhhhhhhhhhhh.", "hhhdddddddhhhh"], { h: H.base, d: H.dim })
  p.grid(45, 29, ["hhhhhhhhhhhh..", "dhhhhhhhhhhhhh", "..dddddddddhhh"], { h: H.base, d: H.dim })
  // the nose and the moustache; the mouth just showing
  p.grid(37, 44, ["..sss..", ".sSSSs.", "sSSSSSs", "sSSSSSs", ".sssss."], { s: S.dim, S: S.lit })
  p.grid(27, 51, [
    "......hhhhhhhhhh......",
    "...hhhhhhhhhhhhhhhh...",
    ".hhhhhhhhhhhhhhhhhhhh.",
    "hhhdddddddddddddddhhhh",
    "dd................dddd",
  ], { h: H.lit, d: H.dim })
  p.grid(35, 56, [".mmmmmmmm.", "..MMMMMM.."], { m: S.deep, M: "#a85a50" })
})

// ---------------------------------------------------------------- Frau Haldane
// Fast asleep and pleased about it, her head fallen to one side against the wing of the chair, curlers in, the Lull point behind her ear. The paper has slid
// into her lap: a face on the page with four small corners round it.
portrait("haldane", PANELS.haldane, (p) => {
  const R = { lit: "#ffc8e4", base: "#e888bc", dim: "#b0588a", deep: "#6e3060" }
  const S = { lit: "#fbe2d2", base: "#ecc0ac", dim: "#c08878", deep: "#7c4a48" }
  const G = { lit: "#e6e8ec", base: "#b4bac4", dim: "#7c8494", deep: "#4e5668" }
  const U = { lit: "#a0806a", base: "#7a5e4c", dim: "#553f34", deep: "#3a2a24" }
  // the armchair: a square high back in old brown plush, buttoned, a wing on each side
  const chair = p.part("7,104! 7,24! 13,14! 66,14! 73,24! 73,104!", U.base)
  chair.edge(5, 2, U.dim)
  chair.tone("7,24! 13,14! 66,14! 66,17! 14,17! 10,26! 10,60! 7,60!", U.lit)
  for (const [x, y] of [[59, 26], [66, 44], [66, 62], [59, 58]]) { p.rect(x, y, 2, 2, U.deep); p.put(x, y, U.lit) }
  const robe = p.part("4,104! 8,86 20,74 58,74 72,86 76,104!", R.base)
  robe.edge(6, 3, R.dim)
  robe.tone("8,90 18,78 26,76 18,88 12,96", R.lit)
  const neck = p.part("28,60 48,60 50,80 40,86 30,80", S.dim)
  neck.edge(3, 0, S.deep)
  p.line("32,70 38,74 44,72", S.deep)
  const lapL = p.part("20,74! 32,74 42,88! 32,94!", R.lit)
  lapL.edge(3, 2, R.base); lapL.sep(R.deep)
  const lapR = p.part("58,74! 48,74 42,88! 52,94!", R.base)
  lapR.edge(3, 2, R.dim); lapR.sep(R.deep)
  // the grey hair behind her, curled up tight; the ear; her head fallen over against the wing
  const hair = p.part(oval(38, 34, 25, 22, 0.25), G.base)
  hair.edge(4, 4, G.dim)
  const ear = p.part(oval(57, 46, 4, 6, 0.3), S.base)
  ear.edge(2, 2, S.dim)
  // the face: long, soft, sliding down: a jowl on the low side
  const head = p.part("20,36 30,28 44,28 54,38 56,50 52,60 44,68 32,70 22,66 14,56 15,44", S.base)
  head.edge(4, 4, S.dim)
  head.tone(oval(24, 52, 5, 3), "#f4a8a0")
  head.tone(oval(46, 56, 4, 3), "#eaa090")
  head.sep(G.deep)
  // the wing she leans on, in front of her hair
  const wing = p.part("-2,30! 7,22! 13,30 13,62 8,76 -2,80!", U.lit)
  wing.edge(3, 3, U.base)
  wing.edge(1, 1, U.dim)
  wing.sep()
  // the curlers along the top of her head, each with a pin
  const CURL = [[20, 26, "#a8d4e8"], [30, 18, "#f0b8d0"], [42, 16, "#e4dcc0"], [53, 21, "#a8d4e8"], [60, 31, "#f0b8d0"]]
  for (const [x, y, t] of CURL) {
    const c = p.part(oval(x, y, 6, 5), t)
    c.edge(2, 2, G.dim)
    p.line(`${x - 4},${y - 1} ${x + 3},${y + 1}`, G.deep)
    c.sep(G.deep)
  }
  // the newspaper, slid on to her lap
  const paper = p.part("10,82! 66,76! 72,104! 14,104!", "#eae6d4")
  paper.edge(3, 2, "#b8b4a4")
  p.line("24,84 60,80", "#565e70")
  p.line("24,85 60,81", "#565e70")
  for (let i = 0; i < 4; i++) { p.line(`42,${90 + i * 3} 64,${88 + i * 3}`, "#8e96a8") }
  p.rect(25, 89, 12, 10, "#8e96a8"); p.grid(28, 90, [".kkk.", "kkkkk", ".kkk.", "kkkkk"], { k: "#565e70" })
  for (const [x, y, r] of [[22, 87, ["kkk", "k..", "k.."]], [36, 87, ["kkk", "..k", "..k"]], [22, 97, ["k..", "k..", "kkk"]], [36, 97, ["..k", "..k", "kkk"]]]) p.grid(x, y, r, { k: INK })
  p.outline()
  // her hand on the paper's edge
  fingers(p, 3, 85, [8, 9, 9, 8], S)
  // the Lull point behind her ear, no ink
  lullPatch(p, 63, 44, true)
  // her face: the lids shut and curved down, crow's feet, the brows high and thin; the mouth has fallen a little open, still friendly
  const E = { k: INK, d: S.dim, w: S.deep, m: "#7c3a44", l: S.lit, t: "#f6f0e4" }
  p.grid(18, 42, [
    "ww.......",
    ".wwddddd.",
    "w.kkkkkkk",
    ".kk.k.k.k",
    "...ddddd.",
  ], E)
  p.grid(38, 44, [
    ".......ww",
    ".ddddddw.",
    "kkkkkkk.w",
    "k.k.k.kk.",
    ".ddddd...",
  ], E)
  p.grid(19, 37, ["..wwwwwww", "www......"], E)
  p.grid(38, 39, ["wwwwwww..", "......www"], E)
  p.grid(27, 31, ["ddddddddd", "..ddddd.."], E)
  p.grid(31, 46, ["..dd.", "..dd.", ".ddd.", "dlddd", ".ddd."], E)
  p.grid(25, 57, [
    "d...........d",
    ".ddkkkkkkkdd.",
    "..kkmmmmmmkk.",
    "...kkkkkkkk..",
  ], E)
  p.grid(26, 64, ["..dddddddd.."], E)
  // the lines from the nose to the mouth, the jowl
  p.line("29,50 25,56", S.dim)
  p.line("41,51 42,57", S.dim)
  p.line("20,60 23,66", S.dim)
  p.line("48,58 45,65", S.deep)
})

// ---------------------------------------------------------------- The Rain Reader
// The widest head in the series, flat as a catfish's, under a sou'wester, her milky eyes far apart; she is tasting: the mouth a little open and pleased with
// what it finds, a barbel hanging down into the bucket, the drop counter's light on it.
portrait("regenleserin", PANELS.regenleserin, (p) => {
  const C = { lit: "#d4e6f6", base: "#a8c8e8", dim: "#7492b8", deep: "#4c6488" }
  const F = { lit: "#8ea4aa", base: "#64808c", dim: "#3e5564", deep: "#2a3c4a" }
  const O = { lit: "#ffc088", base: "#ec9a58", dim: "#a85c30" }
  // the rain, behind everything
  for (const [x, y, n] of [[6, 4, 4], [70, 8, 4], [16, 16, 3], [62, 18, 3], [4, 30, 4], [76, 26, 3], [8, 76, 4], [72, 66, 3]]) p.line(`${x},${y} ${x},${y + n}`, "#8a9ac8")
  // the cape, stiff plastic, shining where it folds
  const cape = p.part("2,104! 6,84 16,68 62,68 72,84 76,104!", C.base)
  cape.edge(6, 3, C.dim)
  cape.tone("8,92 14,78 22,72 18,84 12,96", C.lit)
  p.line("34,74 30,104!", C.dim)
  p.line("41,76 41,104!", C.lit)
  for (const [x, y] of [[24, 86], [36, 94]]) { p.put(x, y, "#ffffff"); p.put(x, y + 1, C.dim) }
  // the bucket's inside, behind the barbel that hangs into it
  const inside = p.part(oval(62, 83, 17, 5), "#1c2230")
  inside.tone(oval(62, 85, 13, 3), CYAN.deep)
  // the head: flat and wide, the jaw a shallow curve
  const head = p.part("3,44 10,33 40,29 70,33 77,44 74,56 62,67 40,71 18,67 6,56", F.base)
  head.edge(4, 4, F.dim)
  head.tone("10,57 24,62 40,63 56,62 70,57 60,68 40,72 20,68", F.lit)   // her pale belly, under the mouth
  for (const [x, y, r] of [[28, 38, 2], [54, 37, 2], [36, 44, 1], [64, 53, 1], [15, 53, 1], [46, 43, 1]]) head.tone(oval(x, y, r + 1, r), F.dim)
  head.sep()
  // the sou'wester: a low crown, the brim wide and sloping down, longer at the sides
  const crown = p.part("24,30! 26,18 34,11 46,11 54,18 56,30!", C.dim)
  crown.edge(5, 2, C.deep)
  crown.tone("29,26 30,18 36,14 34,20", C.base)
  p.line("34,11 32,28", C.deep)
  p.line("46,11 48,28", C.deep)
  const brim = p.part("-2,52! 1,36 12,28 40,24 68,28 79,36 82,52! 74,44 60,37 40,35 20,37 6,44", C.base)
  brim.edge(1, 3, C.dim)
  brim.tone("4,38 16,30 32,27 18,32 8,40", C.lit)
  brim.sep()
  for (let x = 8; x < 74; x += 6) { const y = 33 - Math.round(Math.max(0, 20 - Math.abs(x - 40)) / 4); p.put(x, y, C.deep) }
  // the barbels: thick at the corners of her mouth, long; the left down past the panel, the right over and into the bucket
  const barbel = (path) => { const b = p.part(path, O.base); b.edge(2, 1, O.dim); b.edge(-1, -1, O.lit); b.sep(); return b }
  barbel("12,51 5,55 1,66 2,80 7,96 11,104! 15,104! 11,92 7,80 7,68 10,61 15,57")
  barbel("68,51 75,55 79,63 79,72 73,79 67,82 66,90 69,90 70,85 76,82 83,74 83,60 79,52 70,48")
  barbel("26,66 23,72 23,84 26,84 27,74 30,68")
  barbel("54,66 57,72 57,84 54,84 53,74 50,68")
  // the bucket's front, over that barbel's end; a handle; the counter's light
  const bucket = p.part("45,84 62,88 79,84 77,104! 47,104!", GREY.base)
  bucket.edge(5, 0, GREY.dim)
  p.line("45,84 62,88 79,84", GREY.lit)
  p.outline()
  p.rect(53, 92, 11, 7, INK); p.rect(54, 93, 9, 5, "#07202c"); p.rect(55, 94, 2, 3, CYAN.lit); p.rect(58, 94, 2, 3, CYAN.base); p.rect(61, 94, 1, 3, CYAN.base)
  // a drop off each side of the brim
  p.rect(2, 53, 1, 2, "#d4e6f6"); p.rect(77, 53, 1, 2, "#d4e6f6")
  // the eyes: far out on the sides of the head, milky all through, lids low with pleasure; the folds of eighty-two years under them
  const E = { k: INK, w: "#f0f0e0", W: "#c4c4b0", i: "#a8a890", d: F.dim, f: F.lit, l: F.lit }
  const eye = [
    "..llllll..",
    ".kkkkkkkk.",
    "kwwwwwwwwk",
    "kwwWiiWwwk",
    "kwwWiiWwwk",
    ".kwwwwwwk.",
    "..kkkkkk..",
    ".dddddddd.",
    "...dddd...",
  ]
  p.grid(9, 41, eye, E)
  p.grid(61, 41, eye, E)
  // the nostrils, set wide; the mouth from side to side and up at the ends, open on the side she is tasting with, a drop on the lip
  p.grid(33, 47, ["kk..........kk"], E)
  const lips = head.within("46,57 58,57 67,52 64,60 54,63 46,60", "#6c3040")
  lips.tone("50,60 58,59 60,62 52,63", "#e888a8")
  p.line("13,51 20,55 40,58 58,57 67,51", INK)
  p.line("46,60 54,63 64,60 67,51", INK)
  p.line("20,61 40,63", F.dim)
  p.grid(38, 52, ["c", "C", "C"], { c: "#ffffff", C: "#a8c8e8" })
})

// ---------------------------------------------------------------- Frau Imai
// Her head has gone over on to her hand and will stay there: three fingers much too long up her cheek, the sloth's dark stripe back from a heavy eye, the small
// smile a sloth can't help. Moss in the bun; the cup with the other three claws round it has been cold for hours.
portrait("imai", PANELS.imai, (p) => {
  const C = { lit: "#e2eeca", base: "#c8d8b0", dim: "#92a47e", deep: "#667858" }
  const S = { lit: "#ecdcc4", base: "#d8c2aa", dim: "#a68c78", deep: "#6e5a50" }
  const H = { base: "#2c2e38", lit: "#6a6e7a" }
  const M = { dark: "#34482a", base: "#55703a", lit: "#8aa852" }
  // the cardigan
  const body = p.part("-2,104! 2,86 14,72 46,72 62,80 74,92 76,104!", C.base)
  body.edge(5, 3, C.dim)
  body.tone("4,88 12,76 20,74 14,84 8,94", C.lit)
  p.line("30,76 28,104!", C.deep)
  for (const [x, y] of [[33, 84], [32, 93]]) { p.rect(x, y, 2, 2, C.deep) }
  const neck = p.part("22,62 42,62 42,76 32,80 22,76", S.dim)
  neck.edge(2, 0, S.deep)
  // the bun on top, the hair, moss growing in both
  const bun = p.part(oval(22, 12, 11, 10), H.base)
  bun.edge(-2, -2, H.lit)
  bun.tone(oval(20, 8, 5, 3), M.base)
  bun.tone(oval(25, 14, 4, 3), M.dark)
  bun.tone(oval(19, 7, 2, 1), M.lit)
  const hair = p.part(oval(38, 40, 25, 25, 0.25), H.base)
  hair.edge(-2, -2, H.lit)
  hair.tone(oval(50, 20, 6, 3, 0.4), M.base)
  hair.tone(oval(52, 19, 3, 1, 0.4), M.lit)
  hair.tone(oval(16, 34, 3, 5), M.dark)
  hair.tone(oval(15, 33, 1, 2), M.lit)
  hair.sep()
  // the ear with the Lull point behind it
  const ear = p.part(oval(16, 50, 4, 6), S.base)
  ear.edge(2, 2, S.dim)
  // the face: broad and flat, tipped over
  const face = p.part("18,48 24,34 38,28 54,32 60,44 60,56 52,68 38,73 26,68 19,60", S.base)
  face.edge(3, 3, S.dim)
  face.tone(oval(28, 58, 5, 3), S.lit)
  // the sloth's stripes: from the outer corner of each eye, tapering back and down
  const MARK = "#5a4438"
  face.tone("24,46! 28,48 25,51 21,54 18,55! 20,50", MARK)
  face.tone("55,46! 52,48 54,51 58,54 61,55! 59,50", MARK)
  face.sep(S.dim)
  // a heavy shawl pulled round her, the moss's colour, hiding her hands
  const shawl = p.part("-4,104! -2,88 10,78 24,76 34,84 48,80 66,86 78,96 80,104!", M.base)
  shawl.edge(4, 3, M.dark)
  shawl.tone("-2,92 8,80 20,78 12,86 2,96", M.lit)
  for (const l of ["14,84 22,92 26,104!", "34,84 36,94 34,104!", "50,84 54,92 60,104!", "68,90 66,96 70,104!"]) p.line(l, M.dark)
  p.outline()
  // the Lull patch, no ink
  lullPatch(p, 21, 56, false)
  // the eyes: heavy lids most of the way down, but she is in there, looking at something a long way off; a crease over each, a thin brow
  const E = { k: INK, s: S.dim, l: S.lit, w: "#f4f0e2", i: "#2a1a12", I: "#6a4630", g: "#ffffff", b: H.base }
  for (const [x, y] of [[26, 37], [44, 37]]) p.grid(x, y, ["..bbbbbb..", ".b......b."], E)
  p.grid(25, 41, [
    "..ssssss...",
    ".kkkkkkkk..",
    "kwwiiiiwwk.",
    ".wwiIgiww..",
    "..kkkkkk...",
    "...ssss....",
  ], E)
  p.grid(43, 41, [
    "...ssssss..",
    "..kkkkkkkk.",
    ".kwwiiiiwwk",
    "..wwiIgiww.",
    "...kkkkkk..",
    "....ssss...",
  ], E)
  // the flat nose and the small smile
  p.grid(36, 52, ["s...s", "kk.kk"], E)
  p.grid(30, 58, ["k.............k", ".kk.........kk.", "...kkkkkkkkk..."], E)
})

// ---------------------------------------------------------------- The Fitter
// Nothing above the snout but a hard hat and the lamp that does his seeing; a big soft pink nose, a few whiskers, the small patient mouth under it. Rain has wet
// the shoulders of his coat. The paws are absurdly small and hold the screwdriver with great care.
portrait("monteur", PANELS.monteur, (p) => {
  const C = { lit: "#ccdccc", base: "#b0c0b0", dim: "#7c8c80", deep: "#4c5c54" }
  const P = { lit: "#3e3840", base: "#221e26", deep: "#121018" }
  const K = { lit: "#ffc8c0", base: "#f09a98", dim: "#b86468", deep: "#6e3040" }
  const H = { lit: "#fff8e8", base: "#e8e0c8", dim: "#a8a088", deep: "#6a6450" }
  // the long coat, dark where the wet has got into it
  const coat = p.part("0,104! 3,84 16,70 62,70 76,84 80,104!", C.base)
  coat.edge(6, 2, C.dim)
  coat.tone("0,88 4,80 16,70 34,70 26,78 12,84 6,92", C.dim)
  coat.tone("46,70 62,70 76,82 80,92 70,86 58,78", C.deep)
  for (const [x, y, n] of [[10, 90, 4], [22, 80, 3], [70, 92, 4], [60, 82, 5]]) p.line(`${x},${y} ${x},${y + n}`, C.deep)
  p.line("40,84 40,104!", C.deep)
  for (const y of [90, 98]) p.rect(42, y, 2, 2, C.dim)
  // the head: a pelt, all one with the collar; it comes down over the coat in tufts
  const pelt = p.part("14,58 18,34 26,24 54,24 62,34 66,58 64,70 60,78 56,74 52,80 46,75 40,82 34,75 28,80 24,74 20,78 16,70", P.base)
  pelt.edge(-3, -1, P.lit)
  pelt.sep()
  for (const [x, y] of [[22, 54], [26, 66], [58, 56], [54, 68], [18, 44], [62, 44]]) { p.grid(x, y, ["l.", ".l", ".l"], { l: P.lit }) }
  // the mouth under the snout, small, a mole's two teeth, patient
  // the snout: long, pink, wet, pointing down at us, the first thing that arrives
  const snout = p.part("30,42 40,38 50,42 54,50 52,57 46,61 40,62 34,61 28,57 26,50", K.base)
  snout.edge(3, 3, K.dim)
  snout.tone(oval(33, 47, 3, 2, -0.3), K.lit)
  snout.sep()
  // the hard hat, low; the lamp on it
  const hat = p.part("15,30! 16,18 24,8 40,5 56,8 64,18 65,30!", H.base)
  hat.edge(5, 1, H.dim)
  hat.tone("20,24 22,14 30,9 26,16", H.lit)
  p.line("40,5 40,22", H.dim)
  const brim = p.part("8,36! 12,29 40,27 68,29 72,36! 40,37", H.base)
  brim.edge(0, 2, H.dim)
  brim.sep()
  p.outline()
  // the lamp: all his eyes. White, a steel ring, and a ring of light with no ink
  const ring = p.part(oval(40, 30, 11), STEEL.dim)
  ring.ink(INK)
  ring.edge(-2, -2, STEEL.lit)
  const lamp = ring.within(oval(40, 30, 8), "#ffffff")
  lamp.edge(1, 1, "#cfe6ff")
  p.line("24,30 29,30", "#fffbe8")
  p.line("51,30 57,30", "#fffbe8")
  p.line("32,20 29,16", "#fffbe8")
  p.line("48,20 51,16", "#fffbe8")
  p.line("32,41 30,44", "#fffbe8")
  p.line("48,41 50,44", "#fffbe8")
  // the nostrils; the whiskers; the mouth small and straight, a job's worth of patience
  p.grid(35, 53, ["kk.....kk", ".kk...kk."], { k: K.deep })
  p.line("40,57 40,61", K.dim)
  // the mouth under it: small, two teeth, a job's worth of patience
  p.grid(32, 63, ["l..............l", ".lllllllllllll.", ".....wwww......"], { l: "#8e8894", w: "#f0ecdc" })
  for (const l of ["24,56 15,53", "23,60 14,61", "56,56 66,53", "57,60 67,61"]) p.line(l, "#b8b4a8")
  // the paws: small, pink, a long claw on each finger, one round the screwdriver held up
  const paw = { base: K.base, dim: K.dim, lit: K.lit }
  const sd = { k: INK, s: STEEL.lit, S: STEEL.dim, a: "#e8884c", A: "#a0502c" }
  p.grid(11, 58, [
    "..kkkk..",
    "..kssk..",
    "..kSSk..",
    "..kSSk..",
    "..kSSk..",
    "..kSSk..",
    "..kSSk..",
    "..kSSk..",
    ".kkkkkk.",
    "kaaaaAAk",
    "kaaaaAAk",
    "kaaaaAAk",
    "kaaaaAAk",
    "kaaaaAAk",
    "kaaaaAAk",
    "kaaaaAAk",
    "kaaaaAAk",
    "kaaaaAAk",
    "kaaaaAAk",
    ".kkkkkk.",
  ], sd)
  fingers(p, 7, 74, [9, 10, 9], paw)
  for (const [x, y] of [[17, 75], [18, 78], [17, 81]]) p.grid(x, y, ["kkk", "wwk", "kk."], { k: INK, w: "#e8e0c8" })
  p.rect(9, 84, 7, 1, C.deep)
  p.rect(72, 89, 4, 8, K.base); p.rect(72, 95, 4, 2, K.dim); p.rect(72, 88, 4, 1, INK); p.rect(72, 97, 4, 1, INK)     // the wrist
  p.rect(75, 84, 4, 15, C.base); p.rect(75, 94, 4, 5, C.dim); p.rect(75, 84, 4, 1, INK); p.rect(75, 84, 1, 15, INK)  // the sleeve it comes out of
  p.line("68,76 76,83", C.deep)
  fingers(p, 72, 88, [6, 7, 6], paw, -1)
  for (const [x, y] of [[64, 89], [63, 92], [64, 95]]) p.grid(x, y, [".kk", "kww"], { k: INK, w: "#e8e0c8" })
})

// ---------------------------------------------------------------- Herr Kessler
// A small head in a very big coat, the eggshell top and the ears out at the sides; the eyes all white, sideways, at something behind us. A scarf somebody knitted
// him by hand, which is how anyone would know him, and he doesn't know that.
portrait("kessler", PANELS.kessler, (p) => {
  const C = { lit: "#5e6a7e", base: "#454f62", dim: "#2f3748", deep: "#1c2230" }
  const S = { lit: "#f0e4c4", base: "#dcc8a0", dim: "#a89670", deep: "#6a5c44" }
  const K = { lit: "#fffcea", base: "#efe8cc", dim: "#c4bc9e", deep: "#8e8870" }
  const G = { lit: "#d4d8dc", base: "#a0a6ae", dim: "#6c727c" }
  // the coat: it wears him; the shoulders stand a long way out past him, the collar up behind
  const coat = p.part("-4,104! -4,82 4,68 18,60 62,60 76,68 84,82 84,104!", C.base)
  coat.edge(7, 3, C.dim)
  coat.tone("-4,84 4,70 16,63 10,74 2,88", C.lit)
  p.line("40,72 40,104!", C.deep)
  p.line("16,70 8,104!", C.deep)
  p.line("64,70 72,104!", C.deep)
  p.rect(28, 94, 3, 3, C.lit); p.rect(49, 94, 3, 3, C.deep)
  const collarL = p.part("14,64! 18,44! 28,52 30,66 24,78!", C.dim)
  collarL.edge(-2, -2, C.base)
  const collarR = p.part("66,64! 62,44! 52,52 50,66 56,78!", C.deep)
  collarR.edge(-2, -2, C.dim)
  // the ears, stuck out; the head: a tall narrow egg, wider at the top
  for (const [x, y, t, ix] of [[24, 33, S.base, 1], [56, 33, S.base, -1]]) {
    const e = p.part(`${x - 5},${y - 5} ${x},${y - 7} ${x + 5},${y - 3} ${x + 4},${y + 5} ${x},${y + 6} ${x - 4},${y + 2}`, t)
    e.edge(2, 2, S.dim)
    e.tone(oval(x + ix, y, 1, 3), S.deep)
  }
  const head = p.part("27,28 30,12 40,6 50,12 53,28 52,44 47,56 40,60 33,56 28,44", S.base)
  head.edge(3, 2, S.dim)
  head.tone(oval(36, 12, 4, 3), "#fffaf0")
  head.tone("30,24 32,14 38,9 34,16", S.lit)
  // the grey at the sides, all that is left
  const tuftL = p.part("23,24 28,16 33,20 30,30 26,34", G.base)
  tuftL.edge(1, 2, G.dim)
  const tuftR = p.part("57,24 52,16 47,20 50,30 54,34", G.dim)
  // the forehead's worry
  p.line("33,18 47,18", S.dim)
  p.line("35,21 45,21", S.dim)
  head.sep()
  // the scarf: pale, hand-knitted, knotted anyhow up to his chin, an end hanging; every row its own
  const scarf = p.part("20,62 28,52 40,56 52,52 60,62 58,74 40,80 22,74", K.base)
  scarf.edge(4, 3, K.dim)
  scarf.sep()
  for (let y = 54; y < 80; y += 2) for (let x = 18; x < 62; x += 2) if (scarf.has(x + (y % 4 ? 0 : 1), y)) p.put(x + (y % 4 ? 0 : 1), y, K.dim)
  p.line("22,66 40,72 58,66", K.deep)
  const tail = p.part("24,72! 40,75! 42,95! 25,97!", K.base)
  tail.edge(3, 0, K.dim)
  tail.sep()
  for (let y = 76; y < 96; y += 2) for (let x = 24 + (y % 4 ? 0 : 1); x < 42; x += 2) if (tail.has(x, y)) p.put(x, y, K.dim)
  tail.tone("24,84! 42,84! 42,87! 24,87!", K.deep)                         // the one row she ran out of wool
  for (let x = 26; x < 42; x += 3) p.rect(x, 97, 1, 3, K.base)
  // a badge of the pump authority, its small light
  p.rect(52, 84, 10, 7, INK); p.rect(53, 85, 8, 5, "#8e96a8"); p.rect(54, 86, 2, 2, CYAN.base); p.rect(57, 87, 3, 1, "#565e70")
  p.outline()
  // the eyes: too much white, the pupils small and hard over to one side
  const E = { k: INK, w: "#ffffff", W: "#dcdce8", i: "#20242e", d: S.dim }
  p.grid(29, 27, [
    "..kkkkkk.",
    ".kwwwwwwk",
    "kiiwwwwwk",
    "kiiwwwwwk",
    ".kWWWWWk.",
    "..kkkkk..",
  ], E)
  p.grid(41, 27, [
    ".kkkkkk..",
    "kwwwwwwk.",
    "iiiwwwwwk",
    "iiiwwwwwk",
    ".kWWWWWk.",
    "..kkkkk..",
  ], E)
  // the brows, up and together
  p.grid(29, 23, ["......kkk", "...kkkk..", "kkkk....."], { k: "#6c727c" })
  p.grid(43, 23, ["kkk......", "..kkkk...", ".....kkkk"], { k: "#6c727c" })
  // the long nose, the mouth pressed shut and not holding
  p.grid(38, 35, ["dd", "dd", "dd", "ddd", ".dd"], E)
  p.grid(33, 44, [
    "..kk..kk..kk...",
    "kk..kk..kk..kk.",
  ], E)
  // and one drop running down
  p.grid(48, 17, [".c.", "ccc", "cwc", ".c."], { c: "#a8d8f0", w: "#ffffff" })
})

// ---------------------------------------------------------------- Gus Varga
// The widest man here and the quietest: a block of a head under a felt hat, the eyes small and level in the shadow of its brim, a mouth that has nothing against
// you. He is looking at the watch's time without looking at it.
portrait("varga", PANELS.varga, (p) => {
  const C = { lit: "#c8c8d8", base: "#a0a0b8", dim: "#6c6c86", deep: "#3e3e56" }
  const S = { lit: "#f0c8b4", base: "#cf9c88", dim: "#96645a", deep: "#5e3c3c" }
  const H = { lit: "#5c5c74", base: "#3a3a4e", dim: "#24242f", deep: "#14141c" }
  const coat = p.part("-6,104! -6,82 2,70 18,64 62,64 78,70 86,82 86,104!", C.base)
  coat.edge(7, 3, C.dim)
  coat.tone("-6,84 2,72 16,66 10,76 0,90", C.lit)
  p.line("40,74 40,104!", C.deep)
  // the neck: as wide as the head; the collar up round it, stiff
  const neck = p.part("18,62 62,62 60,78 40,84 20,78", S.dim)
  neck.edge(4, 2, S.deep)
  const colL = p.part("4,74! 12,50! 22,58 28,74 38,88! 24,90!", C.base)
  colL.edge(4, 3, C.dim); colL.edge(-2, -2, C.lit); colL.ink(INK)
  const colR = p.part("76,74! 68,50! 58,58 52,74 42,88! 56,90!", C.dim)
  colR.edge(4, 3, C.deep); colR.ink(INK)
  // the head: a block, the jaw wider than the temples
  const head = p.part("20,30 60,30 63,44 66,60 58,72 40,75 22,72 14,60 17,44", S.base)
  head.edge(5, 4, S.dim)
  head.tone("16,58 22,48 24,62 30,70 22,70", S.lit)
  head.tone("14,28! 66,28! 64,41 40,43 16,41", S.dim)                // the hat's shadow, down to his eyes
  head.sep()
  // the felt hat: a soft crown with a pinch, a band, the brim turned down in front
  const crown = p.part("20,28! 21,14 28,6 40,9 52,6 59,14 60,28!", H.base)
  crown.edge(5, 2, H.dim)
  crown.tone("25,24 26,13 30,9 29,17", H.lit)
  p.line("40,9 38,16 42,20", H.deep)
  crown.tone("18,23! 62,23! 62,28! 18,28!", H.deep)
  const brim = p.part("4,33! 12,28 40,26 68,28 76,33! 66,37 40,36 14,37", H.base)
  brim.edge(0, 2, H.dim)
  brim.tone("8,32 16,29 36,27 16,31", H.lit)
  brim.sep()
  // his forearm across the front, the cuff back, the watch
  const arm = p.part("86,84! 86,102! 48,100 38,94 38,84 48,82", C.dim)
  arm.edge(0, 4, C.deep)
  arm.tone("86,84! 52,83 54,85 86,86!", C.base)
  arm.sep()
  const cuff = p.part("40,82! 50,81! 52,100! 42,99!", "#e4e6ee")
  cuff.edge(2, 0, "#a8aeb8")
  cuff.sep()
  const wrist = p.part("20,84! 42,82! 42,98! 22,100!", S.base)
  wrist.edge(0, 3, S.dim)
  wrist.sep()
  const band = p.part("26,82! 37,81! 38,100! 27,101!", STEEL.dim)
  band.edge(2, 0, STEEL.deep)
  band.sep()
  const dial = p.part(oval(32, 85, 9, 4), "#ffffff")
  dial.tone(oval(31, 84.5, 7, 2.8), STEEL.lit)
  dial.ink(STEEL.deep)
  dial.sep()
  dial.within(oval(32, 85, 6, 2.4), "#0c2a3a")
  p.line("32,85 36,85", CYAN.lit)
  p.line("32,85 30,84", CYAN.base)
  p.rect(25, 89, 15, 1, STEEL.deep)                                        // the case's near side
  p.outline()
  // its one bright glint, no ink
  p.rect(26, 81, 1, 4, "#ffffff"); p.rect(24, 82, 5, 1, "#ffffff")
  // the eyes: small, even, half closed, whites showing only just; heavy brows that don't move
  const E = { k: "#1c0e10", w: "#f0e8dc", i: "#1a0e0a", d: S.deep, g: "#ffffff" }
  p.grid(22, 40, [
    "dddddddddddd",
    "kkkkkkkkkkkk",
    ".kwwiiigww..",
    "..kkkkkkk...",
  ], E)
  p.grid(46, 40, [
    "dddddddddddd",
    "kkkkkkkkkkkk",
    "..wwiiigwk..",
    "...kkkkkkk..",
  ], E)
  // the nose, broad; the mouth: long and level, a very small allowance at one corner
  const F = { d: S.deep, m: S.dim, l: S.lit }
  p.grid(34, 46, ["..l....", "..lm...", ".lmmm..", "dlmmmmd", "ddddddd"], F)
  p.grid(27, 61, ["ddddddddddddddddddddddddd.", "...mmmmmmmmmmmmmmmmmmmm.d"], F)
  // a thin moustache, as straight as a total
  p.grid(30, 57, ["gggggggggggggggggg", ".ggggggggggggggggg"], { g: "#4e4048" })
})

// ---------------------------------------------------------------- Sable
// A long shaved skull in three-quarters, a long neck out of a coat collar like a funnel, the long pipe going off to one side; one brow up, a smile with a price on
// it. A jeweller's lens on a thin arm before the near eye: whatever you bring gets looked at. Sable is nobody's he or she (story §10).
portrait("sable", PANELS.sable, (p) => {
  const M = { lit: "#ffc0f2", base: "#ff4fd3", dim: "#a8238a", deep: "#3e1240" }
  const S = { lit: "#b67e66", base: "#845442", dim: "#57332c", deep: "#311c1e" }
  const AM = { lit: "#ffd58a", base: "#eea040", dim: "#b0602a", deep: "#552b1c" }
  // the smoke first, behind everything, no ink
  p.line("12,54 8,44 13,34 7,24 12,14", "#8a7aa8")
  p.line("14,52 11,44 16,33 11,24", "#5e4e80")
  // the coat, its shoulders high and narrow, magenta to the floor
  const coat = p.part("6,104! 8,88 18,72 62,72 74,88 76,104!", M.base)
  coat.edge(6, 3, M.dim)
  coat.tone("10,90 18,76 26,74 20,84 14,96", M.lit)
  p.line("41,88 41,104!", M.deep)
  p.line("24,90 20,104!", M.dim)
  // the collar's back, dark inside; the long neck coming up out of it
  p.part("22,88! 25,56! 66,54! 68,88!", M.deep)
  const neck = p.part("36,50 56,48 57,88 35,88", S.dim)
  neck.edge(3, 0, S.deep)
  neck.tone("36,62 41,64 42,86 36,86", S.base)
  // the skull: long, going back to the right; the jaw narrow, a high cheekbone
  const ear = p.part(oval(62, 34, 4, 6), S.base)
  ear.edge(2, 2, S.dim)
  const head = p.part("25,28 27,15 37,7 52,6 62,12 67,24 66,36 60,46 50,56 38,61 30,58 26,50 25,40", S.base)
  head.edge(5, 2, S.dim)
  head.edge(1, 0, M.dim)                                        // the coat's colour on the far side of the skull
  head.tone("29,26 31,15 38,9 45,8 37,14 33,24", S.lit)
  head.tone(oval(38, 11, 4, 2), "#dcaa90")
  head.tone("42,48 56,40 52,50 44,55", S.dim)                   // under the cheekbone
  head.tone("38,45 54,41 44,47", S.lit)                         // the cheekbone
  head.sep()
  // the nose goes out past the far cheek, in three quarters
  const nose = p.part("33,32 28,41 24,45 27,48 36,47", S.base)
  nose.edge(0, 1, S.dim)
  // the rings up the ear; three cyan studs along the skull
  p.grid(62, 27, ["ww.", "..w", "ww.", "..w", "ww."], { w: "#dfe6ee" })
  for (const [x, y] of [[62, 17], [58, 13], [54, 10]]) { p.put(x, y, CYAN.base); p.put(x + 1, y, CYAN.lit) }
  // the collar: a funnel standing away from the neck
  const colL = p.part("12,88! 22,56! 33,68 40,94!", M.base)
  colL.edge(-2, -2, M.lit); colL.edge(3, 3, M.dim); colL.ink(INK)
  const colR = p.part("70,88! 66,52! 54,68 45,94!", M.dim)
  colR.edge(-2, -2, M.base); colR.edge(3, 3, M.deep); colR.ink(INK)
  // the pipe's bowl, down at the end of its long stem
  const bowl = p.part("5,58! 20,58! 20,66 16,71 9,71 5,66", AM.dim)
  bowl.edge(3, 3, AM.deep)
  bowl.edge(-1, 0, AM.base)
  p.outline()
  p.rect(5, 55, 15, 4, INK)
  p.rect(6, 55, 13, 3, AM.base); p.rect(9, 55, 7, 2, "#fff4d8")   // the ember, its glow on the rim
  p.line("31,52 25,56 19,62", INK)
  p.line("31,53 25,57 19,63", AM.lit)
  p.line("31,54 25,58 19,64", INK)
  // the far eye: long and narrow, the lid low, magenta on it; the near one comes later, in the lens
  const E = { k: INK, w: "#f4e8e0", i: "#c07838", I: AM.lit, p: "#1c0e14", d: S.deep, m: M.dim }
  p.grid(28, 27, [
    "..kkkkkkk.",
    ".kmmmmmmmk",
    "kkkkkkkkkk",
    ".kwwiippwk",
    "...kkkkkk.",
  ], E)
  // the brows, thin as a signature; the far one level, the near one well up
  p.grid(27, 23, ["kkkkkkkkk.", ".........k"], { k: "#1c0e14" })
  p.grid(41, 15, ["...kkkkkkkkk.", ".kkk.......kk", "kk..........."], { k: "#1c0e14" })
  // the mouth: dark lips, the corner away from the pipe going up
  p.grid(30, 47, [
    ".................kk",
    "...............kk..",
    ".mmmmmmmmmmmmmkk...",
    "kkkkkkkkkkkkkkk....",
    ".mmmmmmmmmmmmm.....",
    "..mmmmmmmmm........",
  ], { k: INK, m: "#c02a98" })
  p.line("37,34 33,40 31,45", S.dim)
  p.grid(28, 46, ["kkk"], { k: S.deep })
  // the jeweller's lens on a thin arm from behind the ear; what it looks through is much too big
  p.line("59,25 62,22 63,28", "#dfe6ee")
  const ring = p.part(oval(50, 30, 11), STEEL.dim)
  ring.ink(INK)
  ring.edge(-2, -2, STEEL.lit)
  const glass = ring.within(oval(50, 30, 8), "#2a6a7a")
  glass.edge(2, 2, CYAN.deep)
  p.grid(44, 26, [
    "..kkkkkkkk..",
    ".kkkkkkkkkk.",
    "kwwiiiiiiwwk",
    "kwwiiIpiiwwk",
    "kwwiipppiwwk",
    ".kkwwiiwwkk.",
    "...kkkkkk...",
  ], E)
  p.line("44,25 47,22", CYAN.lit)
})

// ---------------------------------------------------------------- The Cook
// A long grey horse of a face under a folded paper cap; lids at half mast and bags you could carry shopping in, one brow cut in two. The cleaver rests on his
// shoulder because that's where it goes.
portrait("koch", PANELS.koch, (p) => {
  const W = { lit: "#ffffff", base: "#e8e8e0", dim: "#b4b4ac", deep: "#74746c" }
  const S = { lit: "#e0c8a4", base: "#c4a47c", dim: "#8a6e50", deep: "#523c2c" }
  const T = { base: "#39424f", dim: "#232a34" }
  // the shirt, the thin shoulders, the apron's bib and its straps; the marks are decades of broth
  const body = p.part("10,104! 12,84 24,74 58,74 70,84 72,104!", T.base)
  body.edge(5, 2, T.dim)
  const neck = p.part("30,62 50,62 52,78 40,84 28,78", S.dim)
  neck.edge(3, 0, S.deep)
  p.line("35,68 38,80", S.deep)
  const bib = p.part("22,104! 25,86! 55,86! 58,104!", W.base)
  bib.edge(4, 0, W.dim)
  bib.tone(oval(32, 94, 3, 2), "#c8b48c")
  bib.tone(oval(46, 99, 4, 2), "#c8b48c")
  bib.tone(oval(51, 90, 2, 1), "#c8b48c")
  bib.sep()
  p.line("28,86 30,74", W.dim); p.line("52,86 50,74", W.dim)
  p.line("27,86 29,74", W.base); p.line("53,86 51,74", W.base)
  // the ear with the order set in it, its small light; the long head
  const ear = p.part(oval(60, 42, 4, 6), S.base)
  ear.edge(2, 2, S.dim)
  const earL = p.part(oval(20, 42, 4, 6), S.base)
  earL.edge(2, 2, S.dim)
  const head = p.part("22,30 58,30 60,44 56,58 50,72 40,77 30,72 24,58 20,44", S.base)
  head.edge(4, 3, S.dim)
  head.tone("24,32 28,32 26,50 24,44", S.lit)
  head.tone("24,56 28,50 30,60 36,72 30,70", S.dim)             // the hollow of the cheek
  head.tone("56,50 52,50 50,62 46,72 52,68", S.deep)
  // grey stubble round the jaw
  for (let y = 56; y < 77; y += 2) for (let x = 22 + (y % 4 ? 0 : 1); x < 60; x += 2) if (head.has(x, y) && (y > 66 || x < 28 || x > 50)) p.put(x, y, S.dim)
  head.sep()
  p.rect(62, 41, 2, 2, CYAN.base); p.put(62, 41, CYAN.lit)
  // the paper cap: a folded boat, tipped forward
  const cap = p.part("17,35! 19,12! 40,19! 61,10! 63,35! 40,31!", W.base)
  cap.edge(5, 1, W.dim)
  cap.tone("19,12! 40,19! 40,24! 20,18!", W.lit)
  p.line("18,27 40,23 62,26", W.dim)
  p.line("40,19 40,31", W.dim)
  cap.sep()
  // the cleaver, on his shoulder: a big square of steel, the blade's edge bright, a nick out of it
  const sleeve = p.part("4,104! 6,92 9,86 18,87 22,104!", T.base)
  sleeve.edge(3, 0, T.dim)
  sleeve.sep()
  const handleC = p.part("13,66! 18,66! 19,88! 14,88!", "#5a3a28")
  handleC.edge(2, 0, "#341f14")
  const blade = p.part("2,28! 22,24! 23,66! 3,68!", STEEL.base)
  blade.edge(4, 0, STEEL.dim)
  blade.tone("2,28! 22,24! 22,27! 2,31!", STEEL.lit)
  blade.tone("6,36! 9,36! 9,60! 6,60!", STEEL.lit)
  p.rect(16, 30, 3, 3, INK); p.put(16, 30, STEEL.deep)
  p.grid(0, 28, ["kkk", "kk.", "k.."], { k: PANELS.koch.top })
  p.outline()
  fingers(p, 11, 73, [8, 9, 9, 8], S)
  p.grid(9, 73, [".kk.", "kddk", "kddk", "kddk", "kddk", "kddk", "kddk", "kddk", "kddk", "kddk", "kddk", "kddk", ".kk."], { k: INK, d: S.dim })   // the heel of the hand, the thumb behind
  // the eyes: dead level, half shut, looking at a point about a metre behind you; the bags
  const E = { k: INK, w: "#ece4d4", i: "#2a1c14", d: S.dim, D: S.deep, l: S.lit }
  p.grid(26, 40, [
    "lllllllllll",
    "kkkkkkkkkkk",
    ".wwiiiiww..",
    ".kkkkkkkkk.",
    ".ddddddddd.",
    "..DDDDDDD..",
    "...ddddd...",
  ], E)
  p.grid(43, 40, [
    "lllllllllll",
    "kkkkkkkkkkk",
    "..wwiiiiww.",
    ".kkkkkkkkk.",
    ".ddddddddd.",
    "..DDDDDDD..",
    "...ddddd...",
  ], E)
  // the brows, grey, level; the right one cut in two
  p.grid(26, 35, ["gggggggggg.", "ggggggggggg"], { g: "#74746c" })
  p.grid(44, 35, ["gggg..ggggg", "gggg..ggggg"], { g: "#74746c" })
  p.line("48,33 49,38", S.deep)
  // the nose: long, a bend in it from a long time ago
  p.grid(37, 42, ["..dd.", "..dd.", ".dd..", ".dd..", ".ddd.", ".dddd", "dlldd", "ddDDd"], E)
  // the mouth, no expression at all, a very slight drop at one end
  p.grid(31, 62, ["kkkkkkkkkkkkkkkkk.", ".................k"], { k: S.deep })
  p.grid(34, 64, ["dddddddd"], E)
})

// ---------------------------------------------------------------- Dr. Ines Calder
// An oval face, soft, tipped a little, the plait forward over the shoulder; the first in the series who is looking at you with interest. She knows something and
// doesn't mind that you can see it: brows easy, one corner of the mouth just starting. The small lit wallet held up like a thing she might show you.
portrait("ines", PANELS.ines, (p) => {
  const W = { lit: "#ffffff", base: "#ecf0f0", dim: "#b8c0cc", deep: "#7c8698" }
  const S = { lit: "#e4ae8a", base: "#c4865e", dim: "#90583c", deep: "#5e3626" }
  const H = { base: "#1e1a24", lit: "#4a4258", deep: "#100e16" }
  const coat = p.part("-2,104! 2,86 16,72 64,72 78,86 82,104!", W.base)
  coat.edge(6, 3, W.dim)
  coat.tone("4,90 14,76 22,74 14,86 8,96", W.lit)
  const blouse = p.part("30,70 50,70 52,104! 28,104!", "#5e6a8a")
  blouse.edge(3, 0, "#3e4866")
  const neck = p.part("32,58 49,58 50,76 41,84 31,76", S.dim)
  neck.edge(3, 0, S.deep)
  neck.tone("33,62 37,66 38,78 33,74", S.base)
  // the lapels and the badge on its cord
  const lapL = p.part("16,72! 32,70 38,104! 22,104!", W.lit)
  lapL.edge(4, 0, W.base); lapL.sep(W.deep)
  const lapR = p.part("64,72! 48,70 44,104! 60,104!", W.base)
  lapR.edge(4, 0, W.dim); lapR.sep(W.deep)
  // the hair behind, drawn back, a soft mass round the head
  const hair = p.part(oval(41, 36, 25, 28, 0.05), H.base)
  hair.edge(-2, -2, H.lit)
  // where the plait comes out from behind the neck: the jaw lies over it, the first link in front of it joins it to the shoulder
  const root = p.part(oval(27, 66, 5, 6, 0.3), H.base)
  root.edge(-2, -2, H.lit)
  root.sep(H.deep)
  // the small ear with its stud; the face
  const ear = p.part(oval(62, 42, 3, 5), S.base)
  ear.edge(1, 2, S.dim)
  const head = p.part("20,36 24,20 34,12 48,12 58,20 62,34 60,48 54,60 44,68 36,67 27,60 21,48", S.base)
  head.edge(4, 3, S.dim)
  head.tone("24,42 27,26 34,18 30,30", S.lit)
  head.tone(oval(27, 49, 5, 3), "#d8906e")
  head.tone(oval(53, 49, 4, 3), "#b87452")
  head.sep(H.deep)
  // the hair's parting: it falls to both sides from the crown and back behind the ears
  const front = head.within("18,6! 62,6! 62,34 58,24 46,16 40,14 32,18 24,28 20,38", H.base)
  front.edge(2, 3, H.deep)
  p.line("41,13 28,26", H.lit)
  p.line("43,13 54,22", H.lit)
  // the plait over her shoulder, forward, down to the bottom of the picture
  const links = [[20, 66], [18, 73], [19, 80], [17, 87], [18, 94]]
  for (const [x, y] of links) {
    const l = p.part(oval(x, y, 6, 5, 0.5), H.base)
    l.edge(-2, -2, H.lit)
    l.sep(H.deep)
  }
  const tie = p.part("13,98! 22,98! 22,101! 13,101!", "#f0a0c0")
  tie.sep()
  p.outline()
  p.put(62, 47, CYAN.lit)
  // the hand holding up the wallet, its light
  const wallet = p.part("55,80! 71,78! 72,95! 56,97!", "#1a2337")
  wallet.tone("55,80! 71,78! 71,80! 55,82!", "#41547a")
  wallet.ink(INK)
  p.rect(58, 83, 11, 4, "#07202c")
  p.rect(59, 84, 6, 1, CYAN.base); p.rect(59, 85, 3, 1, CYAN.dim)
  p.rect(66, 88, 3, 3, CYAN.base); p.put(66, 88, CYAN.lit)
  // four fingers from below over its lower edge, running up it; the light stays free above them
  for (let i = 0; i < 4; i++) {
    const x = 56 + i * 3, top = 92 + (i === 0 || i === 3 ? 1 : 0)
    p.rect(x, top - 1, 4, 1, INK); p.rect(x, top, 1, 100 - top, INK); p.rect(x + 3, top, 1, 100 - top, INK)
    p.rect(x + 1, top, 2, 100 - top, S.base); p.rect(x + 2, top + 1, 1, 100 - top, S.dim); p.put(x + 1, top, S.lit ?? S.base)
  }
  // the eyes: large, almond, at ease, looking right at you; lashes on the upper lid
  const E = { k: INK, w: "#f6f0e8", i: "#3a2214", I: "#6a4028", g: "#ffffff", d: S.dim, l: S.lit }
  p.grid(24, 37, [
    "...kkkkkkk..",
    ".kkkkkkkkkk.",
    "kkwwiiiiwwkk",
    ".wwwiIgiwww.",
    "..wwiIiiww..",
    "...ddddd....",
  ], E)
  p.grid(44, 37, [
    "..kkkkkkk...",
    ".kkkkkkkkkk.",
    "kkwwiiiiwwkk",
    ".wwwiIgiwww.",
    "..wwiIiiww..",
    "....ddddd...",
  ], E)
  // the brows: long and easy, the right one a touch higher: she has noticed
  p.grid(23, 31, ["...kkkkkkkk.", "kkkk.......k"], { k: H.base })
  p.grid(44, 29, [".kkkkkkk....", "k.......kkkk"], { k: H.base })
  // the nose, small and straight, from its shadow side
  p.grid(40, 45, ["..d", "..d", "..d", "l.d", "ddd"], E)
  // the mouth: soft, rose; one corner has started something
  p.grid(33, 54, [
    "................kk",
    "..............kk..",
    "kkkkkkkkkkkkkk....",
    ".rrrrrrrrrrrr.....",
    "...rrrrrrr........",
  ], { k: "#5e2632", r: "#b85a68" })
})

// ---------------------------------------------------------------- Lantern
// Turned away and looking back at us over his shoulder, out of a hood he made himself: lean, red stubble, a sharp nose and one eye gone narrow; deciding whether you are the
// problem. The antennas stand up behind him, their tips lit. At the bottom the tyre of his chair and the hand on it, ready to go.
portrait("lantern", PANELS.lantern, (p) => {
  const S = { lit: "#b57f5e", base: "#83503a", dim: "#5a3426", deep: "#2e1a18" }
  const G = { lit: "#eaffdc", base: "#b0f0a0", dim: "#58c070", deep: "#1f6a48" }     // his own colour, in his hair and his lens
  const V = { lit: "#7f63c8", base: "#54418a", dim: "#3a2a64", deep: "#241a40" }     // the poncho
  const SHAVED = "#3e281f"
  // the antennas, from the headset, each with its own light: he hears everything
  const AER = [[62, 38, 74, 7, "#ff4fd3"], [64, 40, 70, 19, "#62def0"], [60, 36, 64, 4, G.lit]]
  for (const [x0, y0, x1, y1] of AER) { p.line(`${x0},${y0} ${x1},${y1}`, INK, true); p.line(`${x0 + 1},${y0} ${x1 + 1},${y1}`, GREY.base, true) }
  // the poncho, patched in whatever colours there were
  const pon = p.part("-6,104! -4,88 8,76 24,70 56,70 72,76 84,88 86,104!", V.base)
  pon.edge(6, 2, V.dim)
  pon.tone("-4,90 6,78 20,72 12,82 2,92", V.lit)
  const patch = (path, t, d) => { const q = pon.within(path, t); q.edge(2, 2, d); q.ink(d); return q }
  patch("4,84! 20,80! 22,96! 6,99!", "#ff4fd3", "#a8238a")
  patch("56,78! 72,82! 72,96! 54,94!", "#1f88a4", "#123c4e")
  patch("24,92! 36,90! 36,102! 24,102!", "#e8843c", "#8e4a22")
  patch("46,92! 54,92! 54,102! 46,102!", G.dim, G.deep)
  for (let x = 5; x < 20; x += 3) p.put(x, 85 - Math.round((x - 4) / 4), "#ffc0f2")   // stitches
  for (let y = 80; y < 94; y += 3) p.put(73, y, "#dafcff")
  // the hood, thrown back in a soft heap
  const hood = p.part("12,78 13,66 24,59 56,59 67,66 68,78 40,84", V.dim)
  hood.edge(4, 3, V.deep)
  hood.tone("13,70 22,62 30,62 20,70", V.base)
  for (const l of ["18,72 28,78", "62,70 52,78"]) p.line(l, V.deep)
  // the neck, a cable for a collar
  const neck = p.part("30,62 50,62 50,76 40,80 30,76", S.dim)
  neck.edge(3, 0, S.deep)
  // the head, narrow, the sides shaved
  const head = p.part("23,42 24,28 31,20 49,20 56,28 57,42 55,54 48,65 40,68 32,65 25,54", S.base)
  head.edge(4, 2, S.dim)
  head.tone("26,30 32,22 38,21 30,28", S.lit)
  head.tone("20,16! 32,16! 30,28 26,36 21,38", SHAVED)
  head.tone("48,16! 60,16! 60,38 54,36 50,28", SHAVED)
  // the ear, with its rings
  const ear = p.part(oval(22, 45, 3, 5), S.base)
  ear.edge(1, 1, S.dim)
  // the crest: dyed, stiff, leaning; the loudest thing in the room
  const crest = p.part("32,30 29,20 25,12 31,14 30,5 36,11 38,1 43,10 48,3 48,13 54,9 51,21 48,30 40,26", G.base)
  crest.edge(3, 2, G.dim)
  crest.edge(1, 1, G.deep)
  crest.tone("31,18 35,12 38,8 37,18 33,24", G.lit)
  // the headset's cup, lit in magenta
  const cup = p.part(oval(59, 44, 6, 8), "#1a2337")
  cup.edge(2, 2, "#0c0e1a")
  cup.ink("#41547a")
  p.outline()
  // what has its own light, without ink
  for (const [, , x, y, t] of AER) { p.rect(x - 1, y - 1, 4, 4, "#14162a"); p.rect(x, y, 2, 2, t) }
  p.rect(57, 42, 3, 4, "#ff4fd3"); p.put(57, 42, "#ffc0f2")
  p.put(20, 48, "#dfe6ee"); p.put(20, 45, "#dfe6ee"); p.put(20, 42, "#62def0")      // the rings in his ear
  // the collar's cable and the little lantern on it: the name
  p.rect(30, 73, 20, 2, INK); p.rect(31, 73, 18, 1, "#41547a")
  p.grid(36, 75, [
    "..kkkk..",
    ".kbbbbk.",
    "kbGGGGbk",
    "kbGWWGbk",
    "kbGWWGbk",
    "kbGGGGbk",
    ".kbbbbk.",
    "..kkkk..",
  ], { k: INK, b: "#617aa0", G: G.base, W: G.lit })
  // the stubbled sides: a few strokes, a line of circuit inked on the temple and the cheek, cyan
  p.line("54,30 55,36 52,40", "#62def0"); p.put(52, 41, "#dafcff"); p.put(55, 29, "#dafcff")
  p.line("52,50 54,54 51,57", "#1f88a4")
  // the lens over his right eye, on a strap: bright, cracked, with something scrolling in it
  p.line("24,36 34,31", INK)
  const rim = p.part(oval(32, 42, 9.5), "#41547a")
  rim.edge(2, 2, "#1a2337")
  rim.edge(-1, -1, "#a8b4c4")
  rim.ink(INK)
  const lens = rim.within(oval(32, 42, 7), G.deep)
  lens.tone("24,34! 36,34! 30,40 25,44", G.dim)
  for (const [x, y, n] of [[28, 39, 7], [27, 42, 9], [28, 45, 5]]) p.rect(x, y, n, 1, G.lit)
  p.grid(26, 36, ["V.", "VV", ".V"], { V: "#ffffff" })
  p.line("36,36 33,41 37,47", INK)
  // the other eye: narrowed, sizing you up, the brow high, a bar through it
  p.grid(44, 39, [
    "kkkkkkkk.",
    ".wwggkww.",
    ".wwgkkw..",
    "..kkkkk..",
    "...dddd..",
  ], { k: INK, w: "#f0ece0", g: G.dim, d: S.dim })
  p.grid(43, 34, ["......kkk", "...kkkk..", "kkkk....."], { k: "#1a100e" })
  p.rect(52, 33, 1, 3, "#dfe6ee")
  // the nose; a crooked smirk with a steel tooth; a dyed tuft under the lip
  p.grid(40, 46, ["..s", "..s", ".ss", "dss", "ddd"], { s: S.dim, d: S.deep })
  p.grid(31, 56, [
    "k.............k",
    ".kkkkkkkkkkkkk.",
    "...wwTwwwwkk...",
    "....kkkkkk.....",
  ], { k: "#1a0c0a", w: "#f0ece0", T: "#a8b4c4" })
  p.grid(37, 62, [".GG.", "GGGG", ".GG."], { G: G.dim })
})

// With the name under the picture: the portraits for the index and for telling them apart; the plain sprites stay for marketing.
const NAMES = {
  juno: "Juno Reyes", teo: "Teo Reyes", evi: "EVI", motte: "Motte", bao: "Bao", haldane: "Frau Haldane",
  regenleserin: "Die Regenleserin", imai: "Frau Imai", prediger: "Der Prediger", monteur: "Der Monteur", kessler: "Herr Kessler", varga: "Gus Varga",
  sable: "Sable", koch: "Der Koch\nvon Yuen's", ines: "Dr. Ines Calder", lantern: "Lantern", ashe: "Corvin Ashe",
}
const nameLines = (id) => NAMES[id].split("\n").length
const nameH = (lines) => 3 + lines * 10
const named = (c, id, x, y) => {
  c.stamp(`portrait_${id}`, x, y)
  TXT.draw(c, x + Math.floor(PW / 2), y + PH + 3, NAMES[id], "#dce4ee", { font: "halcyon", align: "center" })
}
for (const id of Object.keys(NAMES)) scene(`named_${id}`, { w: PW, h: PH + nameH(nameLines(id)), bg: INK }, (c) => named(c, id, 0, 0))

// The index: everyone, in rows; the ones held back from marketing stand at the end (docs/portraits/README.md).
const INDEX = ["teo", "juno", "evi", "motte", "bao", "haldane", "regenleserin", "imai", "prediger", "monteur", "kessler", "varga", "sable", "koch", "ines", "lantern", "ashe"]
const COLS = 6, GAP = 4
scene("review_figuren_index", { w: COLS * PW + (COLS - 1) * GAP + 2 * GAP, h: Math.ceil(INDEX.length / COLS) * (PH + nameH(2) + GAP) + GAP, bg: INK },
  (c) => INDEX.forEach((id, i) => named(c, id, GAP + (i % COLS) * (PW + GAP), GAP + Math.floor(i / COLS) * (PH + nameH(2) + GAP))))

// The title screen (style guide §8a "Title screen"), shown before the menu screen (game/title.js,
// title.splash): "Wach und Schlaf", awake and asleep. The two siblings face each other through a pane of
// glass with a crack running down between them. One idea, two figures, few colours.
//   - Teo, on the left, facing right, ASLEEP: eyes shut, at peace, his head tipped against the glass. Short
//     dark hair, the Lull sleep patch behind his ear glowing pale blue (he will be a Sinker), the gill slits
//     of his tide mod faint on his neck, ear defenders round his neck, his orange work vest. His half is
//     Lull's cold pale light: quiet, dry, still.
//   - Juno, on the right, facing left, AWAKE: eyes open on him through the crack, worried, tender, tired.
//     The yellow slicker with the hood up, short black hair at the hood's edge, the cyan implant line along
//     her left cheekbone. Her half is the city at night: dark, wet, a magenta neon rim from behind.
//   - the crack between them: a jagged bright line with ink beside it, a few short branches; the glass's
//     light falls on both profiles, cold sleep on one side of it and the warm wet night on the other;
//     neither figure touches it, the ground shows between their shoulders and the glass
//   - under it the title block (art/ui/letters.px.js, the same on the menu screen) on a night-dark ground;
//     the rain is the room's (fx, Juno's side only), the prompt (y 164-171) the engine's
//
//   splash_bg   320x180, an animation, about 6 s a loop: the Lull patch breathes slowly; Juno's implant
//               flickers now and then; once a loop a short glitch (the title splits into magenta and cyan,
//               a few rows of the picture slip)
include("letters.px.js")

pal({
  k: "#0c0e1a", n: "#06080f", N: "#0a0e18",
  V: "#dafcff", v: "#62def0", m: "#ff4fd3", q: "#ff3a3a",
  // Teo's side: the night in Lull's cold light
  1: "#060d15", 2: "#0a1722", 3: "#0e2231", 4: "#123c4e",
  b: "#c8e8ff", B: "#7aa8d8", C: "#3d6690",
  // Teo: skin in cold light (lit, lit mid | shadow, deep), hair, vest, shirt, ear defenders
  I: "#c99a8c", i: "#93665c", A: "#583841", a: "#2c1d29",
  h: "#0e121c", H: "#1c2434", w: "#33445e",
  o: "#ffb070", O: "#c07838", P: "#8e5628", p: "#5e3018",
  g: "#141a28", G: "#252e42", e: "#2f3e5a", E: "#4f6584",
  // Juno's side: the city at night, magenta neon
  5: "#0a0e18", 6: "#10172a", 8: "#24122e", z: "#3e1240", M: "#a8238a",
  // Juno: skin (the glass's rim, lit, mid | shadow, deep), lips, eye, hair, the slicker
  u: "#f2c6a6", s: "#d79676", S: "#93583f", t: "#5c3024", T: "#2e161a", L: "#b45c52",
  W: "#e6d6cc", r: "#2a1610",
  x: "#141220", X: "#2a2438",
  y: "#fff070", Y: "#eec414", j: "#9a7406", J: "#4a3406",
})

{
  const W = 320, H = 180, PIC = 116, CRACK = 160
  const TB = titleBlock(), TBX = Math.round((W - TB.w) / 2), TBY = 120
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
  const bay = (x, y) => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16
  const lerpT = (tab, v) => {
    if (v <= tab[0][0]) return tab[0][1]
    for (let i = 1; i < tab.length; i++) if (v <= tab[i][0]) { const [v0, u0] = tab[i - 1], [v1, u1] = tab[i]; return u0 + (u1 - u0) * (v - v0) / (v1 - v0) }
    return tab[tab.length - 1][1]
  }
  const inPoly = (pts, x, y) => {
    let c = false
    for (let i = 0, j = pts.length - 2; i < pts.length; j = i, i += 2) {
      const xi = pts[i], yi = pts[i + 1], xj = pts[j], yj = pts[j + 1]
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c
    }
    return c
  }
  const norm3 = (x, y, z) => { const l = Math.hypot(x, y, z); return [x / l, y / l, z / l] }
  /**
   * A mask as a rounded volume: inside(x, y) over the box; returns light(x, y, L) = the surface's facing
   * toward L (-1..1) and dist(x, y), the distance to the mask's edge. R: how far in the form turns.
   */
  function dome(inside, x0, y0, x1, y1, R) {
    const w = x1 - x0 + 1, h = y1 - y0 + 1, D = new Float32Array(w * h)
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) D[y * w + x] = inside(x + x0, y + y0) ? 1e9 : 0
    const at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : D[y * w + x])
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (D[y * w + x]) D[y * w + x] = Math.min(D[y * w + x], at(x - 1, y) + 1, at(x, y - 1) + 1, at(x - 1, y - 1) + 1.414, at(x + 1, y - 1) + 1.414)
    for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) if (D[y * w + x]) D[y * w + x] = Math.min(D[y * w + x], at(x + 1, y) + 1, at(x, y + 1) + 1, at(x + 1, y + 1) + 1.414, at(x - 1, y + 1) + 1.414)
    const ht = (x, y) => { const d = Math.min(at(x - x0, y - y0), R) / R; return R * Math.sqrt(1 - (1 - d) ** 2) }
    return {
      dist: (x, y) => at(x - x0, y - y0),
      light: (x, y, L) => {
        const gx = (ht(x + 1, y) - ht(x - 1, y)) / 2, gy = (ht(x, y + 1) - ht(x, y - 1)) / 2
        const [nx, ny, nz] = norm3(-gx, -gy, 1)
        return nx * L[0] + ny * L[1] + nz * L[2]
      },
      normal: (x, y) => { const gx = (ht(x + 1, y) - ht(x - 1, y)) / 2, gy = (ht(x, y + 1) - ht(x, y - 1)) / 2; return norm3(-gx, -gy, 1) },
    }
  }

  // the crack's x by y (straight runs with kinks), and its branches
  const CRACK_PATH = [[0, 1], [14, 3], [22, -1], [40, 2], [47, 0], [63, 3], [70, -2], [86, 1], [95, -1], [116, 2]]
  const CRACK_BRANCHES = [[[162, 16], [166, 12], [171, 10]], [[159, 46], [155, 52]], [[163, 70], [168, 76], [169, 81]], [[160, 96], [156, 103]]]
  const SHARDS = [[164, 4, ["VB.", "BBB", ".BC", "..C"]], [153, 101, ["..V", ".VB", "VBB", "BC.", "C.."]]]
  const crackX = (y) => CRACK + Math.round(lerpT(CRACK_PATH, y))

  // Teo: his face's front line (y -> x from TF), before the lean; the lean tips everything above his chin
  // toward the glass. TEO_LIT: how far back from the front line the light reaches, by y (brow, cheekbone, jaw)
  const TF = 140
  const TEO_FRONT = [[28, -5], [31, -2], [34, -1], [38, 0], [42, 0], [44, 1], [46, 1], [48, -1], [50, 0], [53, 2], [56, 4], [58, 6], [59, 7], [60, 7], [61, 5], [62, 2], [63, 1], [65, 1], [66, 2], [67, 2], [68, 1], [69, 0], [70, 1], [72, 1], [73, 0], [75, -2], [77, -1], [79, 0], [81, 0], [83, -1], [85, -3], [86, -6], [87, -11]]
  const TEO_PLANE = [[28, -5], [34, -1], [44, 1], [56, 1], [70, 0], [80, 0], [84, -2], [87, -8]]   // the face's plane, without nose and lips
  const TEO_LIT = [[28, 9], [36, 10], [44, 12], [50, 11], [56, 15], [60, 17], [64, 15], [68, 12], [72, 13], [78, 14], [84, 11], [87, 7]]
  const teoShift = (y) => Math.max(0, Math.round((88 - y) * 0.14))
  // Neither figure runs on to the crack. Teo's vest ends on a straight slant, flaring toward the picture's foot as
  // Juno's coat does (y -> its last column); the ground shows between it and the glass.
  // Its top corner is rounded off.
  const VEST_CORNER = { 96: 137, 97: 139, 98: 140 }
  const vestFront = (y) => VEST_CORNER[y] ?? 140 + Math.round((y - 96) * 0.35)
  // Juno: her face's front line (y -> distance left of JF); the slicker's outline (hood and shoulders) and
  // the hem of the hood round her face
  const JF = 176
  const JUNO_FRONT = [[30, -4], [34, -2], [38, -1], [42, 0], [44, 1], [46, 1], [48, -1], [50, 0], [53, 2], [56, 4], [58, 5], [59, 5], [60, 4], [61, 2], [62, 1], [64, 1], [65, 2], [66, 2], [67, 1], [68, 0], [69, 1], [70, 1], [71, 0], [73, -2], [75, -1], [78, 0], [80, -1], [82, -3], [83, -6], [84, -10]]
  const JUNO_PLANE = [[30, -4], [38, -1], [44, 1], [56, 1], [70, 0], [78, 0], [82, -3], [84, -10]]
  const JUNO_LIT = [[30, 9], [44, 10], [50, 10], [56, 13], [60, 14], [64, 12], [70, 10], [76, 11], [84, 7]]
  const SLICKER = [-9, 34, -7, 28, -1, 21, 8, 14, 21, 9, 31, 7, 45, 11, 57, 20, 66, 33, 72, 50, 71, 62, 68, 72, 64, 80, 65, 86, 69, 100, 76, 117, -40, 117, -40, 100,
    -14, 96, -6, 92, 1, 90, 11, 85, 17, 77, 20, 67, 21, 57, 20, 48, 15, 41, 7, 37, 1, 35].map((v, i) => (i % 2 ? v : v + JF))
  const HEM = [[34, -2], [35, 1], [37, 7], [41, 15], [48, 20], [57, 21], [67, 20], [77, 17], [85, 11], [90, 1], [92, -6], [96, -14]]
  const DRAPE = [[4, 93], [20, 95], [36, 93], [50, 89], [59, 84], [64, 80]]   // where the hood's drape lies on the shoulders (x from JF -> y)
  // and her coat's front (y -> its first column), straight down from her shoulder and flaring toward the foot
  const COAT_FRONT = { 89: 182, 90: 182, 91: 179, 92: 178, 93: 177, 94: 176, 95: 176, 96: 175, 97: 175, 98: 175, 99: 175, 100: 175, 101: 175, 102: 175, 103: 175, 104: 174, 105: 174, 106: 173, 107: 173, 108: 172, 109: 171, 110: 171, 111: 170, 112: 169, 113: 168, 114: 167, 115: 166 }

  function paint(c, o = {}) {
    const B = new Array(W * H).fill(null), FIG = new Uint8Array(W * H)
    const put = (x, y, k) => { if (k && x >= 0 && y >= 0 && x < W && y < H) B[y * W + x] = k }
    const fput = (x, y, k) => { if (k && x >= 0 && y >= 0 && x < W && y < H) { B[y * W + x] = k; FIG[y * W + x] = 1 } }
    const fill = (x0, y0, x1, y1, f) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) fput(x, y, f(x, y)) }
    const line = (x0, y0, x1, y1, k, p = put) => {
      const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1
      let err = dx + dy
      for (;;) { p(x0, y0, k); if (x0 === x1 && y0 === y1) break; const e2 = 2 * err; if (e2 >= dy) { err += dy; x0 += sx } if (e2 <= dx) { err += dx; y0 += sy } }
    }
    const grid = (x, y, rows, p = fput) => rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] !== ".") p(x + i, y + j, r[i]) })

    // ---- the grounds -------------------------------------------------------------------------------
    for (let y = 0; y < PIC; y++) for (let x = 0; x < W; x++) {
      if (x < crackX(y)) {                                  // Teo: a pale halo round his head, the rest night
        const t = 1 - Math.hypot((x - 118) / 1.2, y - 50) / 110
        const l = Math.floor(t * 4.2 + (bay(x, y) - 0.5) * 0.9)
        put(x, y, l >= 3 ? "4" : l === 2 ? "3" : l === 1 ? "2" : "1")
      } else put(x, y, y % 4 === 3 ? "6" : "5")              // Juno: the city behind her
    }
    // the city out of focus behind Juno: a tall neon sign, far windows
    for (let y = 4; y < 74; y++) for (let x = 284; x < 316; x++) {
      const inner = x >= 293 && x <= 306 && y >= 8 && y <= 68, edge = x >= 291 && x <= 308 && y >= 6 && y <= 70
      if (inner) put(x, y, (y - 8) % 9 < 6 && x > 294 && x < 305 ? ((y - 8) % 9 < 1 || (y - 8) % 9 > 4 || x < 296 || x > 303 ? "z" : "M") : "8")
      else if (edge) put(x, y, "8")
    }
    for (const [x, y, k] of [[264, 10, "4"], [268, 10, "C"], [264, 16, "4"], [196, 6, "4"], [200, 6, "C"], [312, 88, "z"]]) { put(x, y, k); put(x + 1, y, k); put(x, y + 1, k); put(x + 1, y + 1, k) }

    // ---- Teo ---------------------------------------------------------------------------------------
    {
      const LT = norm3(0.75, -0.45, 0.5)                  // the glass's light, from his front and above
      const front = (y) => TF + lerpT(TEO_FRONT, y)
      const skull = (X, y) => ((X - (TF - 28)) / 31) ** 2 + ((y - 50) / 33) ** 2 <= 1 && (X > TF - 36 || y < 66)
      const hash = (a, b = 0) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
      const crown = (X, y) => Math.atan2(y - 20, X - (TF - 34))       // the hair grows out from the crown
      // the hair's outline, on the screen, about (122, 50): over the back and top a full round dome (a
      // superellipse, so the back of the head bulges out before it turns), narrower toward the forehead,
      // rounding in to the nape below; a few tufts break it
      const hairE = (X, y) => {
        const dx = X + teoShift(y) - 122, dy = y - 50, n = dx < 0 && dy < 0 ? 3.2 : 2
        return Math.abs(dx / (dx < 0 ? 40.5 : 29.5)) ** n + Math.abs(dy / 38) ** n <= 1 + (hash(Math.floor(crown(X, y) * 9)) > 0.6 ? 0.04 : 0)
      }
      const chinLine = (X) => 87 - (TF - 10 - X) * (15 / 24)
      const face = (X, y) => y >= 28 && X <= front(y) && X >= TF - 36 && y <= chinLine(X)
      const ear = (X, y) => ((X - (TF - 30)) / 5) ** 2 + ((y - 54) / 9) ** 2 <= 1
      const FRINGE = [0, 1, 2, 1, 0, 1, 2, 3, 2, 1, 0, 1, 2, 1, 0, 0]
      const hairBottom = (X) => X > TF - 14 ? 29 + FRINGE[Math.max(0, Math.round(X - TF + 14)) & 15] * 0.6 : X > TF - 22 ? 27 + (TF - 14 - X) * 2.4 : X > TF - 25 ? 48 : X > TF - 35 ? 45 : 56 + (TF - 35 - X) * 0.9
      const hair = (X, y) => hairE(X, y) && y < hairBottom(X)
      // the ear defenders round his neck: the far cup behind his throat, the neck, the band going back round
      // his neck, the near cup low in front of his throat with the far one's rim showing over it
      const cup = (cx, cy, near) => fill(cx - 7, cy - 8, cx + 7, cy + 8, (x, y) => {
        const dd = ((x - cx) / 5) ** 2 + ((y - cy) / 6.5) ** 2
        if (dd > 1) return null
        if (dd > 0.5) return (x - cx) * 0.8 - (y - cy) > 2 ? "E" : "e"           // the shell, its lit rim toward the glass
        return near ? ((x - cx) - (y - cy) > 1 ? "e" : "G") : "g"                 // the cushion
      })
      cup(TF - 8, 96, false)
      const NECK = [TF - 44, 62, TF - 30, 70, TF - 14, 84, TF - 13, 100, TF - 56, 100, TF - 52, 90, TF - 48, 84, TF - 46, 76, TF - 46, 68]
      fill(TF - 54, 64, TF - 8, 100, (x, y) => {
        if (!inPoly(NECK, x, y)) return null
        return x > TF - 16 ? "I" : x > TF - 30 ? "i" : x > TF - 42 ? "A" : "a"
      })
      // the body, upright: the shoulders in the vest (a rounded form lit from the glass), the shirt's collar
      const bodyTop = (x) => x < 96 ? 86 + ((96 - x) / 44) ** 2 * 20 : x < 128 ? 86 + (x - 96) * 0.28 : 95 + ((x - 128) / 40) ** 2 * 8
      const body = (x, y) => x <= crackX(y) - 3 && y >= bodyTop(x)
      const vest = dome(body, 30, 80, 158, PIC + 6, 12)
      fill(30, 80, 158, PIC - 1, (x, y) => {
        if (!body(x, y) || x > vestFront(y)) return null
        if (x > 90 && x < 130 && y < bodyTop(x) + 3) return y < bodyTop(x) + 1 ? "g" : "G"   // the shirt's collar
        if (Math.abs(x - 124 - (y - 98) * 0.1) < 0.6 && y > 90) return "p"                 // the vest's zip
        if (Math.abs(x - 139 + (y - 99) * 0.4) < 0.6 && y >= 99 && y <= 107) return "P"    // a crease, as on Juno's coat
        const top = vest.dist(x, y) < 2.5 && y < 104, side = x < 48 + (y - 96) * 0.6, lit = top && x > 70
        if (y >= 108 && y <= 109) return side ? "C" : lit || x > 128 ? "b" : "B"         // the reflective stripe
        return side ? "p" : lit ? "o" : "O"
      })
      line(TF - 47, 87, TF - 33, 89, "g", fput); line(TF - 47, 86, TF - 33, 88, "e", fput)       // the band
      cup(TF - 11, 99, true)

      // the head (X = the column before the lean)
      const hairV = dome((x, y) => hair(x - teoShift(y), y), 70, 6, 158, 80, 6)
      fill(70, 8, 158, 90, (x, y) => {
        const X = x - teoShift(y)
        if (hair(X, y)) {
          const l = hairV.light(x, y, LT), [nx, ny] = hairV.normal(x, y)
          if (hairV.dist(x, y) < 1.5 && (ny < -0.5 || nx < -0.5) && l < 0.62) return "C"   // Lull's light round his head
          const a = Math.floor(crown(X, y) * 16), r = Math.hypot(y - 20, X - TF + 34)
          const strand = hash(a, Math.floor(r / 5 + hash(a, 9) * 5)) < 0.4                  // short strands, out from the crown
          return l > 0.62 ? (strand ? "w" : "H") : l > 0.3 ? (strand ? "H" : "h") : strand && l > 0 ? "H" : "h"
        }
        if (ear(X, y)) {
          const inner = ((X - (TF - 30)) / 3) ** 2 + ((y - 55) / 6.5) ** 2 <= 1
          return inner ? (X > TF - 31 ? "A" : "a") : X > TF - 28 ? "I" : "i"
        }
        if (!skull(X, y) && !face(X, y)) return null
        const d = front(y) - X, dp = TF + lerpT(TEO_PLANE, y) - X, lit = lerpT(TEO_LIT, y)
        if (y > chinLine(X) - 1.5 && X < TF - 6) return "a"           // the jaw's shadow on the neck
        if (y > chinLine(X) - 3 && X < TF - 10) return "A"
        if (X < TF - 36) return "A"
        if (d < 1 && y > 30 && !(y >= 62 && y <= 64) && !(y >= 68 && y <= 69) && y < 85) return "b"   // the glass's light along the profile
        if (((d - 8) / 6.5) ** 2 + ((y - 50) / 4.2) ** 2 <= 1) return ((d - 7.5) / 4.5) ** 2 + ((y - 50.5) / 1.8) ** 2 <= 1 ? "I" : "i"   // the socket, the closed lid lit
        if (dp < lit) return "I"
        if (dp < lit + 9) return "i"
        return "A"
      })
      const at = (d, y, k) => fput(Math.round(front(y)) - d + teoShift(y), y, k)
      // the closed eye: the lid's curve and its lashes, the crease above; the brow, relaxed
      for (const [d, y] of [[3, 51], [4, 52], [5, 52], [6, 52], [7, 53], [8, 53], [9, 52], [10, 52], [11, 52], [12, 53]]) at(d, y, "a")
      for (const [d, y] of [[5, 48], [6, 48], [7, 48], [8, 48], [9, 49], [10, 49]]) at(d, y, "i")
      for (const [d, y] of [[1, 44], [2, 44], [3, 44], [4, 44], [5, 44], [6, 44], [7, 45], [8, 45], [9, 45], [10, 46], [2, 45], [3, 45], [4, 45], [5, 45]]) at(d, y, "h")
      for (const [d, y] of [[11, 46], [12, 47]]) at(d, y, "A")
      // the nose's wing, the nostril, the mouth at rest
      for (const [d, y] of [[5, 59], [6, 60], [6, 61], [5, 62]]) at(d, y, "i")
      for (const [d, y] of [[3, 61], [4, 61]]) at(d, y, "a")
      for (const [d, y] of [[1, 69], [2, 69], [3, 69], [4, 69], [5, 70], [6, 70]]) at(d, y, "A")
      // the gill slits of his tide mod, faint, on the side of his neck, glowing with his breath
      const gl = (o.lull ?? 1) ? "B" : "C"
      for (const [gx, gy] of [[TF - 42, 70], [TF - 41, 75], [TF - 40, 80]]) { line(gx, gy, gx + 7, gy + 2, "C", fput); line(gx + 2, gy + 1, gx + 4, gy + 1, gl, fput) }
      // the Lull patch behind his ear, breathing
      const lv = o.lull ?? 1, px = TF - 41, py = 57
      const P = { 0: ["C", "B", "B"], 1: ["B", "b", "b"], 2: ["b", "V", "V"] }[lv]
      grid(px - 3 + teoShift(py), py - 5, [
        "..ggg..",
        ".gRRRg.",
        "gR1cRRg",
        "gR1cRRg",
        "gR1cRRg",
        "gR12RRg",
        ".gRRRg.",
        "..ggg..",
      ].map((r) => r.replace(/g/g, lv === 2 ? "C" : "a").replace(/R/g, P[0]).replace(/1/g, P[1]).replace(/c/g, P[2]).replace(/2/g, P[0])))
    }

    // ---- Juno --------------------------------------------------------------------------------------
    {
      const LJ = norm3(-0.75, -0.45, 0.5)                 // the glass's light, from her front and above
      const front = (y) => JF - lerpT(JUNO_FRONT, y)
      const hem = (y) => JF + lerpT(HEM, y)
      const onDrape = (x, y) => x > JF + 3 && x < JF + 80 && Math.abs(y - lerpT(DRAPE, x - JF)) <= 0.6
      const coat = (x, y) => x > crackX(y) + 2 && inPoly(SLICKER, x, y)
      // the hood and the shoulders shade as two forms: the hood's drape is an edge for both
      const sl = dome((x, y) => coat(x, y) && !onDrape(x, y), 160, 4, 319, PIC + 8, 11)
      const out = dome(coat, 160, 4, 319, PIC + 8, 3)
      fill(160, 4, 319, PIC - 1, (x, y) => {
        if (!coat(x, y) || x < (COAT_FRONT[y] ?? 0)) return null
        const dist = out.dist(x, y), [nx] = out.normal(x, y), l = sl.light(x, y, LJ)
        if (y > 34 && y < 92 && x - hem(y) < 2 && x - hem(y) >= 0) return "y"        // the hem round her face, lit
        if (onDrape(x, y)) return "J"                                                  // the drape's crease
        if (nx > 0.3 && dist < 2.5 && x > JF + 30) return dist < 1.5 ? "m" : "M"     // the neon behind her
        if (Math.abs(x - hem(y) - 11 - Math.max(0, 48 - y) * 0.25) < 0.6 && y > 18 && y < 84) return "j"   // the side panel's seam
        if (Math.abs(x - (JF - 2) - (y - 96) * 0.35) < 0.6 && y > 94) return "j"   // the placket
        return l > 0.66 ? "y" : l > 0.25 ? "Y" : l > -0.25 ? "j" : "J"
      })
      // the face inside the hood's hem: the fringe, a lock at the edge, the skin lit from the glass
      const face = (x, y) => y >= 34 && y <= 92 && x > crackX(y) + 2 && x >= Math.floor(front(y)) && x < hem(y)
      const FRINGE = [3, 5, 6, 4, 2, 4, 7, 6, 3, 5, 7, 5, 2, 4, 6, 4, 3]
      fill(160, 30, 200, 96, (x, y) => {
        if (!face(x, y)) return null
        const d = x - front(y)
        if (y > 84 - (x - JF) * 0.5 || y > 86) return x > hem(y) - 3 ? "J" : "T"       // the neck in the hood's shadow
        if (y < 37 + (FRINGE[(x - JF + 4) & 15] ?? 0) * 0.8) return y < 37 ? "x" : (x + y) % 5 ? "x" : "X"   // the fringe under the brim
        if (x > hem(y) - 3 && y < 64 - (hem(y) - x) * 4) return "x"                       // hair at the hood's edge
        if (x >= hem(y) - 2) return "t"                                                // the hood's shadow
        if (d < 1 && y > 41 && y < 82 && !(y >= 62 && y <= 64) && !(y >= 67 && y <= 68)) return "u"   // the glass's light along her profile
        const dp = x - (JF - lerpT(JUNO_PLANE, y)), lit = lerpT(JUNO_LIT, y)
        if (dp < lit) return "s"
        if (dp < lit + 7 - Math.max(0, y - 70) * 0.3) return "S"
        return "t"
      })
      const fx = (y) => Math.round(front(y))
      // her eye, open, the iris at its front (she looks the way she faces); a tired lid, a worried brow
      grid(fx(50) + 3, 48, [
        ".ttt....",
        "rrrrrrt.",
        "rVrWWS..",
        ".rrWS...",
        "..SSS...",
        "....S...",
      ])
      grid(fx(44) + 2, 42, [
        "xx......",
        "xxxx....",
        "..XXxx..",
        "......XX",
      ])
      // the nose's wing, the nostril, the mouth
      grid(fx(59) + 4, 59, ["S.", ".S", ".S", "S."])
      grid(fx(61) + 2, 61, ["tt"])
      grid(fx(68) + 1, 68, ["tttt.", "LLLtt"])
      // the implant line along her left cheekbone
      const imp = o.implant ?? "v", ix = JF + 6
      grid(ix, 55, [
        `.......${imp}${imp === "v" ? "V" : imp}`,
        `....${imp}${imp}${imp}..`,
        `${imp}${imp}${imp}${imp}.....`,
      ])
      // the drawstring hanging from the hem under her chin
      line(JF + 6, 89, JF + 4, 100, "j", fput); fput(JF + 4, 101, "V"); fput(JF + 4, 102, "j")
    }

    // ---- the outline where a figure meets the ground ---------------------------------------------------
    for (let y = 0; y < PIC; y++) for (let x = 0; x < W; x++) {
      if (FIG[y * W + x]) continue
      if ((x > 0 && FIG[y * W + x - 1]) || (x < W - 1 && FIG[y * W + x + 1]) || (y > 0 && FIG[(y - 1) * W + x]) || FIG[(y + 1) * W + x]) put(x, y, "k")
    }

    // ---- the crack -------------------------------------------------------------------------------
    for (let y = 0; y < PIC; y++) {
      const x = crackX(y), nx = crackX(y + 1)
      for (let i = Math.min(x, nx); i <= Math.max(x, nx); i++) { put(i, y, "V"); put(i + 1, y, "k") }
      put(x - 1, y, "B")
      if (!FIG[y * W + x - 2] && bay(x, y) < 0.5) put(x - 2, y, "C")             // its light, on the quiet side
    }
    for (const br of CRACK_BRANCHES) for (let i = 1; i < br.length; i++) {
      const [x0, y0] = br[i - 1], [x1, y1] = br[i]
      line(x0, y0, x1, y1, i === 1 ? "b" : "B"); line(x0, y0 + 1, x1, y1 + 1, "k")
    }
    for (const [x, y, rows] of SHARDS) grid(x, y, rows, put)                      // slivers of glass by the crack
    // drops on her side of the glass
    for (const [x, y] of [[258, 38], [272, 64], [190, 4], [300, 82], [266, 100]]) { put(x, y - 2, "6"); put(x, y - 1, "C"); put(x, y, "b"); put(x, y + 1, "C") }

    // ---- the rows that slip, the ground, the title ----------------------------------------------------
    for (const [row, rows, dx] of o.slips ?? []) {
      for (let y = row; y < row + rows; y++) {
        const ln = B.slice(y * W, y * W + W)
        for (let x = 0; x < W; x++) B[y * W + x] = ln[x - dx] ?? ln[x]
      }
    }
    for (let y = PIC; y < H; y++) for (let x = 0; x < W; x++) put(x, y, y % 4 === 3 ? "N" : "n")
    for (let x = 0; x < W; x++) put(x, PIC, "k")
    TB.draw(put, TBX, TBY, o)
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, B[y * W + x])
  }

  // lull: the patch's glow (0 dim, 1, 2 bright; the gills breathe with it); implant: her line's colour
  // while it flickers; split, slips: the glitch (the title's split in px; [first row, rows, shift])
  const FRAMES = [
    [700, { lull: 0 }], [600, { lull: 1 }], [900, { lull: 2 }], [600, { lull: 1 }], [700, { lull: 0 }],
    [60, { lull: 0, implant: "C" }], [80, { lull: 0, implant: "V" }], [50, { lull: 0, implant: "C" }],
    [600, { lull: 1 }], [900, { lull: 2 }],
    [70, { lull: 2, split: 2, slips: [[38, 4, 3]] }], [60, { lull: 2, split: 1, slips: [[76, 3, -2]] }],
    [600, { lull: 1 }],
  ]
  anim("splash_bg", { w: W, h: H, frames: FRAMES.length, ms: FRAMES.map(([ms]) => ms) }, (c) => paint(c, FRAMES[c.frame][1]))
}

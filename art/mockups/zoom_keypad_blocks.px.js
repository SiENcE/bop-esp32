// Chapter 1, job B (game/auftrag_tide.js, READ): the zoom through CAM 07V, the tapped machine across Jade Row, onto the customer display
// of Okonkwo's register at one in the night. It should show the price; it shows every key he types: 4-1-7-0-9, his safe's code.
// Blocks for approval before the zoom is painted into art/ui/zooms.px.js beside zoom_ring, zoom_vending_n7 and zoom_sticker_cam04:
// the same size (96x56, shown at 2x in the zoom window: game/screens.js), the phosphor ramp 0-9 only, a 1 px frame in 0, what lies
// behind the subject in the zoom's 3x3 blocks. The register as painted (art/rooms/okonkwo_shop.px.js, okonkwo_shop_counter): a grey
// body, its keys toward him, the customer display on a stalk toward the window, a VFD (cyan segments, the brightest thing).
//   A  the display alone, filling the zoom: the housing, the glass, a small TOTAL where the price should be, and the code in large
//      seven-segment digits (the unlit segments faint behind, as a VFD shows them), a cursor blinking after the 9
//   B  the display on its stalk, smaller, on the right; under it the register's back, and from the left (he stands left of the
//      register in CAM 07V) Okonkwo's forearm in the cardigan's sleeve (his colour, light), the ribbed cuff, his hand (darker) over
//      the keys behind the top edge; the index finger lifts and goes down on a key while the cursor blinks
//   zoom_keypad_blocks       the sheet: A and B as drawn (RAW), and each with every key a step up and a scanline every second row
//                            (what the feed's post-effects would make of it if the zoom were drawn under them; it is not: screens.js draws the zoom after them)
//   zoom_keypad_a, _b        each alone, 96x56, 2 frames (the cursor; B the finger too)
//   zoom_keypad_room_a, _b   each in the game: over CAM 07V at 01:00 (a game screenshot), in the zoom window as screens.js draws it, at 2x
pal({
  0: "#030a0a", 1: "#071514", 2: "#0c221f", 3: "#12332d", 4: "#1a483e",
  5: "#266252", 6: "#388169", 7: "#55a585", 8: "#8acfae", 9: "#d4f7e2",
  k: "#0c0e1a", h: "#a8b8d0", g: "#617aa0", c: "#3ff2ff",
})
include("../lib/text.js")

const ZW = 96, ZH = 56
const zh = (x, y, s = 0) => { let h = (x * 374761393 + y * 668265263 + s * 1442695041) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }

/** a small key buffer: the zoom is drawn into it, then put on a canvas as it is (RAW) or as the feed's post would show it */
function zbuf() {
  const k = new Array(ZW * ZH).fill("1")
  const B = {
    k,
    px: (x, y, key) => { if (x >= 0 && y >= 0 && x < ZW && y < ZH) k[y * ZW + x] = key },
    rect: (x, y, w, h, key) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) B.px(x + i, y + j, typeof key === "function" ? key(x + i, y + j) : key) },
    ell: (cx, cy, rx, ry, key) => { for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) { const a = (x + 0.5 - cx) / rx, b = (y + 0.5 - cy) / ry; if (a * a + b * b <= 1) B.px(x, y, typeof key === "function" ? key(x, y) : key) } },
    poly: (pts, key) => {
      const N = pts.length / 2, ys = pts.filter((_, i) => i % 2), xs = pts.filter((_, i) => i % 2 === 0)
      for (let y = Math.floor(Math.min(...ys)); y <= Math.max(...ys); y++) for (let x = Math.floor(Math.min(...xs)); x <= Math.max(...xs); x++) {
        let inside = false
        for (let i = 0, j = N - 1; i < N; j = i++) {
          const xi = pts[2 * i], yi = pts[2 * i + 1], xj = pts[2 * j], yj = pts[2 * j + 1]
          if ((yi > y + 0.5) !== (yj > y + 0.5) && x + 0.5 < (xj - xi) * (y + 0.5 - yi) / (yj - yi) + xi) inside = !inside
        }
        if (inside) B.px(x, y, typeof key === "function" ? key(x, y) : key)
      }
    },
  }
  return B
}
/** the city's and the shop's light behind, out of focus, in 3x3 blocks (as the painted zooms' bokeh) */
function bokeh(B, seed, density, keys, base, from = 0, to = ZH) {
  for (let by = Math.floor(from / 3); by * 3 < to; by++) for (let bx = 0; bx * 3 < ZW; bx++) {
    const k = zh(bx, by, seed) < density ? keys[Math.floor(zh(bx, by, seed + 7) * keys.length)] : base
    B.rect(bx * 3, by * 3, 3, 3, k)
  }
}

// ---- seven-segment digits: a b c d e f g as on any display; a digit w wide, h high, segments t thick
const SEGS = { 0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg", "-": "g" }
function digit(B, x, y, ch, w, h, t, on, off) {
  const m = Math.floor((h - t) / 2), lit = SEGS[ch] ?? ""
  const seg = {
    a: [x + t, y, w - 2 * t, t], d: [x + t, y + h - t, w - 2 * t, t], g: [x + t, y + m, w - 2 * t, t],
    f: [x, y + t, t, m - t], b: [x + w - t, y + t, t, m - t], e: [x, y + m + t, t, h - m - 2 * t], c: [x + w - t, y + m + t, t, h - m - 2 * t],
  }
  for (const [s, r] of Object.entries(seg)) if (ch !== "-" || s === "g") { if (lit.includes(s)) B.rect(...r, on); else if (off && ch !== "-") B.rect(...r, off) }
}
/** the code across, centred on cx: digits w wide, dashes narrower; returns where the line ends (for the cursor) */
function code(B, cx, y, w, h, t, on, off, gap = 2) {
  const s = "4-1-7-0-9", dw = Math.max(3, w - 3), width = 5 * w + 4 * dw + 8 * gap
  let x = Math.round(cx - width / 2)
  for (const ch of s) { if (ch === "-") { digit(B, x - t, y, "-", dw + 2 * t, h, t, on, null); x += dw + gap } else { digit(B, x, y, ch, w, h, t, on, off); x += w + gap } }
  return x
}

// ================================================================ A: the display alone
function drawA(f) {
  const B = zbuf()
  bokeh(B, 31, 0.06, "334", "2")                                                     // the shop behind, the bulb's warm wall
  // the housing: a moulded box, its top catching the bulb, its underside dark; the stalk under it
  B.rect(42, 48, 12, 8, (x) => (x < 44 ? "4" : x > 51 ? "2" : "3"))
  B.rect(3, 5, 90, 44, (x, y) => (y < 7 ? "5" : y > 45 ? "2" : x < 5 ? "4" : x > 90 ? "2" : "3"))
  B.rect(7, 9, 82, 36, "0")                                                          // the bezel's inner lip
  B.rect(8, 10, 80, 34, "1")                                                         // the glass, dark
  // the glare of the shop's bulb across the glass, upper left
  B.poly([8, 10, 26, 10, 14, 22, 8, 26], (x, y) => ((x + y) % 2 ? "2" : "1"))
  // where the price should be: a small TOTAL in the corner, dim
  TXT_B(B, 11, 13, "TOTAL", "5")
  // the code, large; the unlit segments a faint ghost; the cursor after it
  const end = code(B, 45, 21, 7, 15, 2, "9", "2")
  if (f === 0) B.rect(end + 1, 34, 5, 2, "9")
  // the glow round the lit segments (one step under them, where the glass is dark)
  halo(B, 10, 12, 76, 30, "9", "1", "3")
  // a screw at each end of the housing
  B.px(5, 26, "2"); B.px(90, 26, "4")
  return B
}

// ================================================================ B: on its stalk, his hand at the keys
// In CAM 07V Okonkwo stands left of the register (game/auftrag_tide.js, Nagiwa.at.cam07v: him at the counter's middle, the register at
// x 200-228), so his left hand reaches across from the left; the display is framed right of it.
function drawB(f) {
  const B = zbuf()
  bokeh(B, 52, 0.09, "3345", "2", 0, 39)                                             // the shelves behind, the bulb's pool
  hand(B, f)
  // the register's back: a grey box across the bottom, nearer than his hand (the fingertips go behind it); its top edge lit
  B.rect(0, 39, ZW, 17, (x, y) => (y < 40 ? "5" : "4"))
  B.rect(0, 53, ZW, 3, "3")
  for (let i = 0; i < 6; i++) B.rect(62 + i * 4, 46, 2, 5, "3")
  B.rect(8, 47, 20, 2, "2")
  // the stalk, from the register's top up to the display
  B.rect(64, 25, 6, 14, (x) => (x < 66 ? "5" : x > 68 ? "3" : "4"))
  // the display: the housing, the glass, the code in smaller segments, the cursor
  B.rect(36, 3, 57, 24, (x, y) => (y < 5 ? "5" : y > 24 ? "2" : x < 38 ? "4" : x > 90 ? "2" : "3"))
  B.rect(39, 6, 51, 18, "0"); B.rect(40, 7, 49, 16, "1")
  B.poly([40, 7, 50, 7, 43, 13, 40, 15], (x, y) => ((x + y) % 2 ? "2" : "1"))
  const end = code(B, 63, 10, 5, 9, 1, "9", "2", 1)
  if (f === 0) B.rect(end, 19, 3, 1, "9")                                         // an underscore, not a decimal point
  halo(B, 40, 7, 49, 16, "9", "1", "3")
  return B
}

/** Okonkwo's left hand from the upper left, palm down over the keys (as the finger in zoom_vending_n7: round forms lit from the
 *  upper left, each with a 1 px edge where it lies over something further back). The forearm in the cardigan's sleeve (his colour,
 *  light: 5-8), the ribbed cuff, the back of the hand and the curled fingers' knuckles (his skin, darker: 4-7), the thumb tucked in;
 *  the index finger raised (f 0), then down on its key behind the register's top edge (f 1). */
function hand(B, f) {
  const id = new Int16Array(ZW * ZH).fill(-1), ink = [], L = [-0.5, -0.62, 0.6].map((v, _, a) => v / Math.hypot(...a))
  const shade = (ramp, n) => ramp[Math.min(ramp.length - 1, Math.floor((0.12 + 0.88 * Math.max(0, n[0] * L[0] + n[1] * L[1] + n[2] * L[2])) * ramp.length))]
  let n = 0
  const put = (x, y, k, i) => { if (x >= 0 && y >= 0 && x < ZW && y < ZH) { B.k[y * ZW + x] = k; id[y * ZW + x] = i } }
  const tube = (ax, ay, bx, by, r, ramp, o = {}) => {
    const i = n++, dx = bx - ax, dy = by - ay, ll = dx * dx + dy * dy
    for (let y = Math.floor(Math.min(ay, by) - r); y <= Math.max(ay, by) + r; y++) for (let x = Math.floor(Math.min(ax, bx) - r); x <= Math.max(ax, bx) + r; x++) {
      const px = x + 0.5, py = y + 0.5, t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / ll)), qx = ax + dx * t, qy = ay + dy * t, d = Math.hypot(px - qx, py - qy)
      if (d > r) continue
      const u = d / r, k = shade(ramp, d > 0 ? [(px - qx) / d * u, (py - qy) / d * u, Math.sqrt(1 - u * u)] : [0, 0, 1])
      put(x, y, o.rib ? (o.rib(x, y) ? String(Math.max(0, Number(k) - 1)) : k) : k, i)
    }
  }
  const ball = (cx, cy, rx, ry, ramp) => {
    const i = n++
    for (let y = Math.floor(cy - ry); y <= cy + ry; y++) for (let x = Math.floor(cx - rx); x <= cx + rx; x++) {
      const nx = (x + 0.5 - cx) / rx, ny = (y + 0.5 - cy) / ry, d2 = nx * nx + ny * ny
      if (d2 <= 1) put(x, y, shade(ramp, [nx * 0.8, ny * 0.8, Math.sqrt(1 - d2)]), i)
    }
  }
  const CARDIGAN = "45678", SKIN = "4567"
  // he stands left of the register and reaches across to it: the forearm comes in from the left, seen from the side
  tube(-8, 13, 12, 21, 7, CARDIGAN)                                             // the sleeve
  tube(11, 20, 17, 23, 6.5, CARDIGAN, { rib: (x) => x % 2 === 0 })              // the cuff's ribbing, along the arm
  ball(25, 26, 9.5, 6, SKIN)                                                    // the back of the hand
  // the curled fingers, their tips down on the keys behind the register's top edge
  tube(33, 29, 35, 42, 3.6, SKIN)
  tube(22, 31, 29, 36, 2.3, SKIN)                                               // the thumb, under it, toward us
  // the index finger, nearest: lifted, then down on its key
  if (f === 0) tube(30, 27, 35, 23, 2.3, SKIN); else tube(30, 29, 36, 42, 2.3, SKIN)
  // the edges: a shape's pixel touching something drawn before it (or the room behind)
  const out = B.k.slice()
  for (let y = 0; y < ZH; y++) for (let x = 0; x < ZW; x++) {
    const i = id[y * ZW + x]
    if (i < 0) continue
    for (const [ax, ay] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      if (ax < 0 || ay < 0 || ax >= ZW || ay >= ZH) continue
      if (id[ay * ZW + ax] < i) { out[y * ZW + x] = i < 2 ? "3" : "2"; break }
    }
  }
  B.k.splice(0, B.k.length, ...out)
  if (f === 0) { B.px(35, 21, "8"); B.px(36, 22, "7") }                       // the nail catching the bulb
}

// the hud font's letters into a buffer (the display's own print: English, the city's tech)
function TXT_B(B, x, y, s, key) { const c = { px: (px, py, k) => B.px(px, py, k) }; TXT.draw(c, x, y, s, key, { font: "hud" }) }
// a soft glow: dark glass pixels touching a lit segment go a step up
function halo(B, x0, y0, w, h, lit, dark, glow) {
  const src = B.k.slice()
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) {
    if (src[y * ZW + x] !== dark) continue
    if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => src[(y + dy) * ZW + x + dx] === lit)) B.k[y * ZW + x] = glow
  }
}

/** the buffer onto a canvas at (ox, oy), scale s; post: every key a step up (about the feed's exposure, 1.3 to 1.5, on this ramp) and every second row a step down */
function put(c, B, ox, oy, o = {}) {
  const s = o.scale ?? 1
  for (let y = 0; y < ZH; y++) for (let x = 0; x < ZW; x++) {
    let k = Number(B.k[y * ZW + x])
    if (o.post) { k = Math.min(9, k + 1); if (y % 2 === 1 && (x + (y >> 1)) % 2 === 0) k = Math.max(0, k - 1) }
    c.rect(ox + x * s, oy + y * s, s, s, String(k))
  }
  c.rect(ox, oy, ZW * s, s, "0"); c.rect(ox, oy + (ZH - 1) * s, ZW * s, s, "0"); c.rect(ox, oy, s, ZH * s, "0"); c.rect(ox + (ZW - 1) * s, oy, s, ZH * s, "0")
}

anim("zoom_keypad_a", { w: ZW, h: ZH, frames: 2, ms: [500, 400] }, (c) => put(c, drawA(c.frame), 0, 0))
anim("zoom_keypad_b", { w: ZW, h: ZH, frames: 2, ms: [500, 400] }, (c) => put(c, drawB(c.frame), 0, 0))

// ---- the sheet: A and B as drawn, and each through a feed's exposure and scanlines
scene("zoom_keypad_blocks", { w: 216, h: 160, bg: "k" }, (c) => {
  const X = [8, 112], Y = [16, 92]
  TXT.draw(c, X[0], 3, "A  DISPLAY ALONE", "h", { font: "hud" })
  TXT.draw(c, X[1], 3, "B  STALK, HAND AT THE KEYS", "h", { font: "hud" })
  TXT.draw(c, X[0], Y[0] - 7 + 66, "", "g", { font: "hud" })
  put(c, drawA(0), X[0], Y[0]); put(c, drawB(1), X[1], Y[0])
  TXT.draw(c, X[0], Y[1] - 9, "IF UNDER THE FEED POST", "g", { font: "hud" })
  put(c, drawA(0), X[0], Y[1], { post: true }); put(c, drawB(1), X[1], Y[1], { post: true })
})

// ---- in the game: the zoom window over CAM 07V at 01:00 (a game screenshot of the feed, from tools/paths/kapitel1_tide_sold.json), drawn as game/screens.js draws it: the ink round it,
// the block at 2x at x = (320 - 192) / 2, y = 34, the implant's corner brackets and ZOOM x3 under it
function bracketsAt(c, x, y, w, h, key, len) {
  const x2 = x + w, y2 = y + h
  for (const [cx, cy, dx, dy] of [[x - 1, y - 1, 1, 1], [x2, y - 1, -1, 1], [x - 1, y2, 1, -1], [x2, y2, -1, -1]]) {
    c.rect(dx > 0 ? cx : cx - len + 1, cy, len, 1, key); c.rect(cx, dy > 0 ? cy : cy - len + 1, 1, len, key)
  }
}
for (const [v, draw] of [["a", drawA], ["b", drawB]]) {
  sprite(`zoom_keypad_room_${v}`, { png: "../../build/blocks/zoom_keypad/game_zoom_0100_1x.png" }, (c) => {
    c.rect(61, 31, 198, 118, "k")
    put(c, draw(0), 64, 34, { scale: 2 })
    bracketsAt(c, 62, 32, 196, 116, "c", 6)
    TXT.draw(c, 64, 151, "ZOOM x3", "c", { font: "hud" })
  })
}

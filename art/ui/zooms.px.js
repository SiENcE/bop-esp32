// Feed mode's zoom windows (style guide §9 "Zoom", kapitel0-design §3 and §6.2): what a camera's
// digital zoom shows of a target, 96x56 each, the phosphor ramp only (keys 0-9, the mockup's hex),
// a 1 px frame in 0. Crisper and more detailed than the feed around it: the subject is drawn at the
// zoom's pixel; what lies behind it (the city's lights) comes through in the blocks of the zoom's
// lower resolution (3x3), with the rain streaking over it.
//
//   zoom_sticker_cam04    cam03 looking across the bridge at cam04's housing on its mast: the
//                         maintenance sticker HCS-04 / K7-731, bright on dark (the prologue's step 5)
//   zoom_vending_n7       the noodle machine's buttons 6 7 8, a finger pressing 7 (chicken and chilli)
//   zoom_kessler_face     Kessler from above in the rain, the knitted scarf the brightest thing
//   zoom_ring             cam04's table: Kessler pulls his wedding ring off, Varga's hand waits, palm
//                         up, the watch at his wrist; 3 frames, the ring the brightest cluster
//   zoom_ring_hand_pale   Kessler's hand without the ring: the pale band where it was (Chapter 1)
//   zoom_keypad           through CAM 07V onto Okonkwo's customer display at one in the night: a small
//                         TOTAL where the price should be, and every key he typed, 41709, in the game's font as
//                         the display's dot matrix (the unlit dots faint behind), the cursor after the 9; still (Chapter 1, job B)
//
// How it is drawn: each picture is a small 2D buffer painted back to front; tubes (fingers, the mast)
// and ellipsoids (palms, a head) are shaded as round forms lit from the upper left, flat shapes take
// their key, and every shape gets a 1 px edge where it lies over something further back.

pal({
  0: "#030a0a", 1: "#071514", 2: "#0c221f", 3: "#12332d", 4: "#1a483e",
  5: "#266252", 6: "#388169", 7: "#55a585", 8: "#8acfae", 9: "#d4f7e2",
})
ramps("0123456789")
include("../lib/text.js")

{
  const ZW = 96, ZH = 56
  const LV = (() => { const v = [-0.5, -0.62, 0.6], l = Math.hypot(...v); return v.map((a) => a / l) })()
  const zhash = (x, y, s = 0) => { let h = (x * 374761393 + y * 668265263 + s * 1442695041) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
  const up = (k, n = 1) => String(Math.max(0, Math.min(9, Number(k) + n)))

  // ---------------------------------------------------------------- the buffer
  function zbuf() {
    const S = { k: new Array(ZW * ZH).fill("1"), id: new Int32Array(ZW * ZH).fill(-1), edges: [], n: 0 }
    const inb = (x, y) => x >= 0 && y >= 0 && x < ZW && y < ZH
    S.bg = (x, y, k) => { if (inb(x, y)) { S.k[y * ZW + x] = k; S.id[y * ZW + x] = -1 } }
    S.dab = (x, y, k) => { if (inb(x, y)) S.k[y * ZW + x] = k }       // repaint a pixel, keeping its shape
    S.get = (x, y) => (inb(x, y) ? S.k[y * ZW + x] : "0")
    S.idAt = (x, y) => (inb(x, y) ? S.id[y * ZW + x] : -2)
    S.put = (x, y, k, id) => { if (inb(x, y)) { S.k[y * ZW + x] = k; S.id[y * ZW + x] = id } }
    // a new shape: its id, its edge key (null: no edge)
    S.shape = (edge = "2") => { S.edges[S.n] = edge; return S.n++ }
    const shadeKey = (ramp, n) => {
      const lam = Math.max(0, n[0] * LV[0] + n[1] * LV[1] + n[2] * LV[2])
      const t = 0.12 + 0.88 * lam
      return ramp[Math.min(ramp.length - 1, Math.floor(t * ramp.length))]
    }
    // a round tube from a to b, radius r (a finger, a pole)
    S.tube = (ax, ay, bx, by, r, ramp, edge = "2", o = {}) => {
      const id = S.shape(edge), dx = bx - ax, dy = by - ay, ll = dx * dx + dy * dy || 1
      const x0 = Math.floor(Math.min(ax, bx) - r - 1), x1 = Math.ceil(Math.max(ax, bx) + r + 1)
      const y0 = Math.floor(Math.min(ay, by) - r - 1), y1 = Math.ceil(Math.max(ay, by) + r + 1)
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        const px = x + 0.5, py = y + 0.5, t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / ll))
        const qx = ax + dx * t, qy = ay + dy * t, d = Math.hypot(px - qx, py - qy)
        if (d > r) continue
        const u = d / r, n = d > 0 ? [(px - qx) / d * u, (py - qy) / d * u, Math.sqrt(1 - u * u)] : [0, 0, 1]
        S.put(x, y, o.flat ?? shadeKey(ramp, n), id)
      }
      return id
    }
    // an ellipsoid seen from the front (a palm, a head, a knuckle)
    S.ball = (cx, cy, rx, ry, ramp, edge = "2", o = {}) => {
      const id = S.shape(edge)
      for (let y = Math.floor(cy - ry - 1); y <= cy + ry + 1; y++) for (let x = Math.floor(cx - rx - 1); x <= cx + rx + 1; x++) {
        const nx = (x + 0.5 - cx) / rx, ny = (y + 0.5 - cy) / ry, d2 = nx * nx + ny * ny
        if (d2 > 1) continue
        if (o.clip && !o.clip(x, y)) continue
        S.put(x, y, o.flat ?? shadeKey(ramp, [nx * (o.round ?? 1), ny * (o.round ?? 1), Math.sqrt(1 - d2)]), id)
      }
      return id
    }
    // a flat polygon: key, or (x, y) => key
    S.poly = (pts, key, edge = "2") => {
      const id = S.shape(edge), ys = pts.filter((_, i) => i % 2).map(Math.floor), xs = pts.filter((_, i) => i % 2 === 0)
      const N = pts.length / 2
      for (let y = Math.min(...ys); y <= Math.max(...ys) + 1; y++) for (let x = Math.floor(Math.min(...xs)); x <= Math.max(...xs) + 1; x++) {
        const px = x + 0.5, py = y + 0.5
        let inside = false
        for (let i = 0, j = N - 1; i < N; j = i++) {
          const xi = pts[2 * i], yi = pts[2 * i + 1], xj = pts[2 * j], yj = pts[2 * j + 1]
          if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) inside = !inside
        }
        if (inside) S.put(x, y, typeof key === "function" ? key(x, y) : key, id)
      }
      return id
    }
    S.rect = (x, y, w, h, key, edge = "2") => S.poly([x, y, x + w, y, x + w, y + h, x, y + h], key, edge)
    // a hand-drawn grid ("." skips), as one shape
    S.grid = (x0, y0, rows, edge = null) => {
      const id = S.shape(edge)
      rows.trim().split("\n").forEach((row, y) => [...row.trim()].forEach((k, x) => { if (k !== ".") S.put(x0 + x, y0 + y, k, id) }))
      return id
    }
    // the edges: a shape's pixel touching (4-way) anything drawn before it, or the backdrop
    S.ink = () => {
      const out = S.k.slice()
      for (let y = 0; y < ZH; y++) for (let x = 0; x < ZW; x++) {
        const id = S.id[y * ZW + x]
        if (id < 0 || S.edges[id] == null) continue
        for (const [ax, ay] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
          const o = S.idAt(ax, ay)
          if (o !== -2 && o < id) { out[y * ZW + x] = S.edges[id]; break }
        }
      }
      S.k = out
    }
    S.flush = (c) => {
      for (let y = 0; y < ZH; y++) for (let x = 0; x < ZW; x++) c.px(x, y, S.k[y * ZW + x])
      c.rect(0, 0, ZW, 1, "0"); c.rect(0, ZH - 1, ZW, 1, "0"); c.rect(0, 0, 1, ZH, "0"); c.rect(ZW - 1, 0, 1, ZH, "0")
    }
    return S
  }

  // the city behind, out of focus, in the zoom's 3x3 blocks: lit windows and signs as soft squares
  function bokeh(S, seed, { from = 0, to = ZH, density = 0.05, keys = "2233", base = "1" } = {}) {
    for (let by = Math.floor(from / 3); by * 3 < to; by++) for (let bx = 0; bx * 3 < ZW; bx++) {
      const h = zhash(bx, by, seed), k = h < density ? keys[Math.floor(zhash(bx, by, seed + 7) * keys.length)] : base
      for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) S.bg(bx * 3 + x, by * 3 + y, k)
    }
  }
  // rain: short streaks falling toward the bottom, a little to the left; over everything
  function rain(S, seed, phase, key = "4", n = 40) {
    for (let i = 0; i < n; i++) {
      const x0 = Math.floor(zhash(i, 1, seed) * (ZW + 10)), y0 = Math.floor((zhash(i, 2, seed) * ZH + phase * 9) % (ZH + 6)) - 3
      const len = 2 + Math.floor(zhash(i, 3, seed) * 3)
      for (let j = 0; j < len; j++) {
        const x = x0 - Math.floor((y0 + j) / 4), y = y0 + j
        if (x < 0 || y < 0 || x >= ZW || y >= ZH) continue
        S.k[y * ZW + x] = up(S.k[y * ZW + x], j === len - 1 ? 2 : 1)
      }
    }
  }

  // ================================================================ zoom_sticker_cam04
  // Across the bridge, cam04 on its mast under a street lamp: the housing seen from its side, the
  // lens hood to the left, a sun shield on top beaded with rain; on the housing's flank the
  // maintenance sticker, a dark label with a printed border, one corner peeling.
  anim("zoom_sticker_cam04", { w: ZW, h: ZH, frames: 2, ms: [300, 300] }, (c) => {
    const S = zbuf()
    bokeh(S, 4, { density: 0.08 })
    // the lamp's glow above, top right (out of the picture), lighting the shield
    for (let y = 0; y < 12; y++) for (let x = 60; x < ZW; x++) {
      const d = Math.hypot((x - 92) / 1.6, y + 4)
      if (d < 10) S.bg(x, y, d < 6 ? "4" : "3")
    }
    S.tube(83, -2, 83, 60, 4, "23456")                                  // the mast
    S.rect(77, 18, 12, 9, (x, y) => (y < 20 ? "5" : y > 24 ? "3" : "4"))  // its clamp
    S.rect(58, 20, 20, 4, (x, y) => (y === 20 ? "5" : "3"))               // the arm
    S.tube(59, 26, 74, 34, 0.9, "234", null)                             // the cable, sagging
    S.tube(74, 34, 79, 27, 0.9, "234", null)
    // the housing: its flank (4), a darker belly, the sun shield over it, the hood at the front
    S.poly([10, 13, 60, 13, 61, 33, 12, 35], (x, y) => (y > 31 ? "3" : "4"))
    S.poly([6, 9, 62, 8, 63, 13, 6, 14], (x, y) => (y < 10 ? "7" : y < 12 ? "6" : "5"))
    S.poly([3, 12, 13, 12, 14, 36, 5, 37], (x, y) => (x < 6 ? "3" : y < 15 ? "5" : "4"))
    S.ball(8, 24, 2.5, 8, "1123", "1")                                   // the glass, in the hood
    S.rect(57, 15, 2, 2, "7", null)                                      // the status lamp
    // the sticker
    S.rect(19, 15, 31, 15, "1", "6")
    S.ink()
    S.bg(49, 15, "5"); S.bg(48, 15, "6"); S.bg(49, 16, "6")               // the peeling corner
    S.bg(19, 15, "1")
    // rain beading on the shield, a drop hanging off the hood
    for (const [x, y] of [[12, 9], [20, 10], [29, 9], [37, 10], [46, 9], [55, 10]]) S.bg(x, y, "8")
    S.bg(5, 38 + c.frame * 2, "6"); S.bg(5, 37 + c.frame * 2, "4")
    rain(S, 11, c.frame, "4", 34)
    S.flush(c)
    c.text(22, 17, "HCS-04", "9")
    c.text(22, 24, "K7-731", "9")
  })

  // ================================================================ zoom_vending_n7
  // The machine's front: the bottom of its display window (cups on a shelf), the price strip, the
  // buttons 6, 7, 8, each backlit with its number and a picture; a finger presses 7 (a chicken leg
  // and a chilli). Frame 1: pressed, the button lights.
  anim("zoom_vending_n7", { w: ZW, h: ZH, frames: 2, ms: [700, 500] }, (c) => {
    const S = zbuf(), pressed = c.frame === 1
    // the panel, brushed steel with scuffs round the buttons
    for (let y = 0; y < ZH; y++) for (let x = 0; x < ZW; x++) S.bg(x, y, zhash(x >> 2, y, 3) < 0.15 ? "4" : "3")
    // the display window: a shelf of cups, lit from inside
    S.rect(0, 0, ZW, 11, (x, y) => (y > 8 ? "5" : "4"), "2")
    for (let i = 0; i < 6; i++) S.poly([3 + i * 16, 8, 13 + i * 16, 8, 12 + i * 16, 1, 4 + i * 16, 1], (x, y) => (y < 3 ? "7" : x - i * 16 < 7 ? "6" : "5"), "3")
    // the buttons: x of the left edge
    const B = [[-14, "6"], [25, "7"], [64, "8"]]
    for (const [bx, n] of B) {
      const lit = n === "7" && pressed
      S.rect(bx - 2, 15, 35, 31, "2", "1")                                // the bezel
      S.rect(bx, 17 + (n === "7" && pressed ? 1 : 0), 31, 27, (x, y) => (y < 19 + (lit ? 1 : 0) ? (lit ? "7" : "6") : lit ? "6" : "5"), "3")
    }
    S.ink()
    // pictures: 6 a bowl (cropped), 8 a fish (cropped), 7 a chicken leg and a chilli (printed icons)
    const oy = pressed ? 1 : 0
    S.grid(2, 30 + oy, `
      3333333333333
      .377777777663
      ..37777776633
      ...33366333..`)
    S.grid(72, 28, `
      ...33333.....3
      ..3777776...36
      .377377776336.
      .3777777777763
      ..3666666663.6
      ...33333333..3`)
    S.grid(30, 29 + oy, `
      ..3333.......
      .377773......
      37777773.....
      377777773....
      3677777773...
      36677777763..
      .3666777763..
      ..33366663...
      ......3883...
      .......3883.3
      ........38838
      ........38883
      .........3883
      .........33..`)
    S.grid(45, 21 + oy, `
      ...33..
      ..363..
      .36663.
      .37763.
      .37763.
      .37763.
      .37763.
      ..3763.
      ..37763
      ...3763
      ...3763
      ....373
      .....33`)
    // the hand: a fist from the lower right, the knuckles of the curled fingers, the index finger
    // out to the button's lower corner, the thumb tucked under it
    S.ball(82, 55, 14, 10, "4567", "2", { round: 0.8 })
    for (const [x, y] of [[71, 48], [77, 45], [84, 44], [91, 45]]) S.ball(x, y, 3.4, 3, "4567", "2", { round: 0.8 })
    S.tube(72, 54, 61, 50, 2.6, "4567", "2")                             // the thumb
    S.tube(70, 47, 54, 41 + oy, 2.6, "4567", "2")                        // the index finger
    S.ball(53, 40 + oy, 2.4, 2.4, "4567", "2")
    S.ink()
    S.bg(52, 39 + oy, "7"); S.bg(53, 39 + oy, "7"); S.bg(52, 40 + oy, "6")   // the nail
    S.bg(62, 44 + oy, "4"); S.bg(62, 45 + oy, "4")                           // the joint's crease
    S.flush(c)
    c.text(27, 18 + oy, "7", "9", { scale: 2 })
    c.text(66, 18, "8", "8", { scale: 2 })
    c.text(4, 18, "6", "8", { scale: 2 })
    c.text(2, 12, "380", "6"); c.text(41, 12, "420", "7"); c.text(80, 12, "450", "6")
  })

  // ================================================================ Kessler, close
  // Seen from above and a little in front (three-quarter, facing down-right), head bowed: the
  // balding crown wet under the rain, grey hair round the back and over the ear, brows, eyes cast
  // down, a sagging cheek; round his neck the knitted scarf (ribbed, 8 and 9), its knot and one end
  // over the coat. The rain falls past him.
  function kesslerHead(S, f) {
    // coat shoulders, collar up
    S.poly([0, 56, 4, 40, 22, 34, 74, 34, 92, 42, 96, 56], (x, y) => (y < 44 ? "3" : "2"), "1")
    S.poly([20, 38, 30, 30, 66, 30, 76, 38, 70, 46, 26, 46], "3", "1")
    // the scarf: a thick band, ribs of 9 and 8, folds in 7
    S.poly([22, 36, 30, 31, 66, 31, 76, 36, 72, 45, 26, 45], (x, y) => {
      const fold = (y === 38 || y === 42) && (x % 9 > 2)
      return fold ? "7" : (x + (y >> 2)) % 3 === 0 ? "8" : "9"
    }, "6")
    // the knot and the end hanging down the coat
    S.poly([48, 40, 60, 40, 62, 56, 47, 56], (x, y) => (y % 4 === 1 ? "7" : x % 3 === 0 ? "8" : "9"), "6")
    S.ball(54, 41, 7, 4, "789", "6")
    // the head: the skull's ellipse, lit from above; the face toward the lower right
    S.ball(44, 19, 17, 16, "4567", "1", { round: 0.7 })
    S.ball(55, 27, 10, 8, "456", null, { round: 0.5 })                    // the jowls, heavier on the near side
    S.ink()
    // hair: a grey fringe round the back and side of the head, combed strands over the crown
    for (let y = 6; y < 36; y++) for (let x = 26; x < 50; x++) {
      const nx = (x + 0.5 - 44) / 17, ny = (y + 0.5 - 19) / 16, d2 = nx * nx + ny * ny
      if (d2 > 0.93 || nx > -0.1 || d2 < 0.42 - ny * 0.25) continue
      S.bg(x, y, (x * 2 + y) % 5 === 0 ? "3" : (x * 2 + y) % 5 === 2 ? "5" : "4")
    }
    for (const [x0, y0] of [[33, 9], [36, 6], [40, 5]]) for (let i = 0; i < 9; i++) S.bg(x0 + i, y0 + Math.floor(i / 3), "4")
    S.grid(31, 20, `
      .44.
      4554
      4534
      4534
      .454
      ..4.`)                                                              // the ear
    // the face, bowed: heavy brows, the lids down in their sockets, the nose, the mouth pulled down
    S.grid(41, 16, `
      ..2222222....22222......
      .2444444422.24444442....
      ..44444444...4444444....
      ..4222224.....42224.....
      ...44444.......444......
      ..........44............
      ...........46...........
      ...........466..........
      ..........34666.........
      .........3346663........
      ..........33333.........
      ...4..............4.....
      ....4.............4.....
      .....4..222222...4......
      ......4.........4.......
      .......444444444........
      ....3333333333333.......`)
    // rain on the scalp: a few beads catching the light
    for (const [x, y] of [[44, 5], [50, 7], [38, 12], [54, 11], [47, 12]]) S.bg(x, y, "8")
    S.bg(56 + f, 13 + f * 2, "7")
  }
  anim("zoom_kessler_face", { w: ZW, h: ZH, frames: 2, ms: [250, 250] }, (c) => {
    const S = zbuf()
    bokeh(S, 9, { density: 0.07, keys: "233" })
    kesslerHead(S, c.frame)
    rain(S, 5, c.frame, "4", 40)
    S.flush(c)
  })

  // ================================================================ hands
  // A finger lying flat, seen from above: a horizontal band w rows thick, lit on its upper edge, the
  // tip rounded, two joint creases; dir 1 points right, -1 left. Returns its shape id.
  function finger(S, x0, y0, len, w = 5, dir = 1, o = {}) {
    const bands = w === 5 ? "66554" : w === 4 ? "6554" : "654"
    const id = S.shape("2")
    for (let i = 0; i < len; i++) for (let j = 0; j < w; j++) {
      const tip = len - 1 - i
      if (tip === 0 && (j === 0 || j === w - 1)) continue
      if (tip === 1 && w === 5 && (j === 0 || j === w - 1) && o.round !== false) continue
      S.put(x0 + dir * i, y0 + j, bands[j], id)
    }
    for (const t of [Math.round(len * 0.42), Math.round(len * 0.72)]) for (let j = 1; j < w - 1; j++) S.put(x0 + dir * t, y0 + j, j === 1 ? "5" : "4", id)
    if (o.nail) { S.put(x0 + dir * (len - 3), y0 + 1, "7", id); S.put(x0 + dir * (len - 2), y0 + 1, "7", id); S.put(x0 + dir * (len - 3), y0 + 2, "6", id) }
    return id
  }
  // Kessler's ringed hand, back up, from the left, the fingers lying toward Varga: index, middle,
  // ring, the little finger curled under. Returns the ring finger's row (its top).
  function kesslerHand(S, o = {}) {
    const dx = o.dx ?? 0, dy = o.dy ?? 0
    S.poly([-2, 9 + dy, 13 + dx, 11 + dy, 14 + dx, 39 + dy, -2, 41 + dy], (x, y) => (y < 16 + dy ? "3" : "2"), "1")   // the coat sleeve
    S.poly([12 + dx, 12 + dy, 16 + dx, 12 + dy, 16 + dx, 38 + dy, 12 + dx, 38 + dy], "5", "2")                        // the shirt cuff
    S.poly([16 + dx, 15 + dy, 22 + dx, 12 + dy, 30 + dx, 12 + dy, 33 + dx, 15 + dy, 33 + dx, 32 + dy, 29 + dx, 36 + dy, 21 + dx, 37 + dy, 16 + dx, 34 + dy],
      (x, y) => (y < 18 + dy ? "6" : y < 30 + dy ? "5" : "4"), "2")                                                 // the back of the hand
    S.ink()
    for (const [x, y] of [[20, 19], [23, 21], [21, 26], [24, 28], [22, 32]]) S.dab(x + dx, y + dy, "6")             // tendons, catching the light
    S.poly([30 + dx, 30 + dy, 36 + dx, 30 + dy, 37 + dx, 33 + dy, 31 + dx, 35 + dy], (x, y) => (y < 32 + dy ? "5" : "4"), "2")   // the little finger, curled
    finger(S, 32 + dx, 14 + dy, 17, 5, 1, { nail: true })                                                           // index
    finger(S, 32 + dx, 19 + dy, 19, 5, 1, { nail: true })                                                           // middle
    finger(S, 32 + dx, 24 + dy, 17, 5, 1, { nail: true })                                                           // ring
    S.poly([18 + dx, 9 + dy, 28 + dx, 7 + dy, 33 + dx, 9 + dy, 33 + dx, 12 + dy, 22 + dx, 14 + dy], (x, y) => (y < 10 + dy ? "6" : "5"), "2")  // the thumb
    S.ink()
    for (const x of [31, 32]) for (const y of [15, 20, 25]) S.dab(x + dx, y + dy, "7")                                // the knuckles
    if (o.pale) for (let y = 25; y <= 27; y++) for (const x of [35, 36]) S.dab(x + dx, y + dy, up(S.get(x + dx, y + dy), 2))   // where the ring was
    return 24 + dy
  }
  // the ring on the finger: a band across it, the brightest pixels in the picture
  function ringOn(S, x, y) {
    S.grid(x, y - 1, `
      88
      99
      99
      98
      98
      99
      88`)
  }
  // the ring off, held up: a small loop, the table through it
  function ringOff(S, x, y) {
    S.grid(x - 1, y - 2, `
      .99.
      9..9
      9..8
      9..8
      .88.`)
  }
  // his other hand, from the top: the thumb down over his fingers onto the ring's top, the index's
  // tip from under the ring finger, the other fingers curled
  function pinchIndex(S, x, y) { finger(S, x - 1, y + 5, 4, 3, 1) }                                                 // the index's tip under
  function pinchHand(S, x, y) {
    S.poly([36, -2, 60, -2, 59, 3, 37, 3], "2", "1")
    S.poly([37, 3, 59, 3, 58, 6, 38, 6], "5", "2")
    S.poly([38, 6, 58, 6, 57, 12, 52, 15, 42, 15, 38, 11], (px, py) => (py < 9 ? "6" : "5"), "2")
    for (const bx of [49, 54]) S.poly([bx, 12, bx + 4, 12, bx + 4, 16, bx, 17], "5", "2")                          // curled fingers
    const id = S.shape("2")                                                                                          // the thumb, down
    for (let yy = 12; yy < y; yy++) for (let i = 0; i < 4; i++) {
      const tx = Math.round(42 + (x - 1 - 42) * (yy - 12) / Math.max(1, y - 12))
      if (yy === y - 1 && (i === 0 || i === 3)) continue
      S.put(tx + i, yy, "6554"[i], id)
    }
    S.ink()
    S.dab(x, y - 3, "7"); S.dab(x + 1, y - 3, "7")                                                                     // its nail
  }
  // Varga's right hand, palm up, from the right, open toward Kessler; the watch at the wrist
  function vargaHand(S) {
    S.poly([93, 16, 98, 15, 98, 56, 92, 56], "2", "1")                                                               // his dark sleeve
    S.poly([89, 18, 93, 17, 93, 52, 89, 52], "3", "1")                                                               // the shirt cuff
    S.rect(85, 19, 4, 31, "2", "1")                                                                                   // the watch strap
    S.ball(87, 34, 3.5, 4, "567", "2", { round: 0.6 })                                                               // the watch face (7 at most)
    S.poly([72, 22, 79, 19, 85, 21, 86, 44, 81, 47, 75, 46, 72, 41], (x, y) => (x < 76 ? "5" : y < 33 ? "7" : "6"), "2")              // the palm, lit
    finger(S, 72, 21, 12, 5, -1)                                                                                     // index
    finger(S, 72, 26, 13, 5, -1)                                                                                     // middle
    finger(S, 72, 31, 12, 5, -1)                                                                                     // ring
    finger(S, 73, 36, 9, 4, -1)                                                                                      // little
    S.poly([74, 21, 78, 12, 82, 12, 83, 20], (x, y) => (x < 79 ? "6" : "5"), "2")                                     // the thumb, up
    S.ink()
    for (const [x, y] of [[77, 27], [78, 28], [79, 29], [79, 30], [77, 37], [78, 38], [80, 39]]) S.dab(x, y, "5")      // the palm's lines
    S.dab(86, 33, "8")                                                                                                 // the glass's glint
  }
  // the diner table: formica, a stripe of the window's neon across it, a coffee ring
  function table(S, seed) {
    for (let y = 0; y < ZH; y++) for (let x = 0; x < ZW; x++) {
      const band = Math.abs((x * 0.35 + y) - 44) < 4
      const fleck = zhash(x, y, seed) < 0.05
      S.bg(x, y, band ? (fleck ? "4" : "5") : fleck ? "4" : "3")
    }
    for (let a = 0; a < 40; a++) {                                                                  // the coffee ring
      const t = a / 40 * Math.PI * 2, x = Math.round(14 + 8 * Math.cos(t)), y = Math.round(44 + 5 * Math.sin(t))
      if (a % 7 !== 3) S.bg(x, y, "2")
    }
  }

  // the ring: on the finger behind the knuckle, halfway down it, then off past the tip
  const RING_X = [35, 40, 52]
  anim("zoom_ring", { w: ZW, h: ZH, frames: 3, ms: [800, 500, 1100] }, (c) => {
    const S = zbuf(), f = c.frame
    table(S, 21)
    vargaHand(S)
    const rx = RING_X[f]
    const ry = kesslerHand(S, { pale: f === 2 })
    pinchIndex(S, rx, ry)
    if (f < 2) ringOn(S, rx, ry)
    pinchHand(S, rx, f < 2 ? ry - 1 : ry - 1)
    if (f === 2) ringOff(S, rx, ry + 2)
    S.ink()
    S.flush(c)
  })

  anim("zoom_ring_hand_pale", { w: ZW, h: ZH, frames: 1 }, (c) => {
    const S = zbuf()
    table(S, 33)
    kesslerHand(S, { pale: true, dx: 22, dy: 4 })
    S.flush(c)
  })

  // ================================================================ zoom_keypad
  // Painted on the lines of the approved block A (art/mockups/zoom_keypad_blocks.px.js, drawA): the display's housing fills the
  // zoom above its stalk, the shop behind it out of focus. The moulded housing lit from the upper left (the bulb): its top lip,
  // a bevel down into the recess, two screws, a dim power lamp; the dark glass with the bulb's glare across its upper left; the
  // small TOTAL where the price should be; the code in the game's own digits as a glowing dot matrix (the unlit dots a ghost behind,
  // a glow where the lit ones light the glass), the cursor after the 9; no dashes: at twice the size they would not fit. Still.
  /** the display's pixels as keys (row by row, ZW x ZH); the review sheet reads them too */
  function zoomKeypadKeys() {
    const S = zbuf(), G = 8, GY = 10, GW = 80, GH = 34                       // the glass
    const role = new Array(ZW * ZH).fill("")                                 // what each glass pixel shows
    const set = (x, y, k, r) => { S.bg(x, y, k); if (r) role[y * ZW + x] = r }
    const roleAt = (x, y) => (x >= 0 && y >= 0 && x < ZW && y < ZH ? role[y * ZW + x] : "")
    bokeh(S, 31, { density: 0.06, keys: "334", base: "2" })                 // the shop behind, the bulb's warm wall

    // the stalk: a round post lit from the left, in the housing's shadow at the top, a swivel joint
    for (let y = 48; y < ZH; y++) for (let x = 42; x < 54; x++) {
      let k = x === 42 ? "3" : x < 45 ? "4" : x === 45 ? "4" : x < 52 ? "3" : "2"
      if (y === 48) k = "1"
      else if (y === 51) k = x < 52 ? "2" : "1"
      else if (y === 52) k = x < 45 ? "5" : x < 52 ? "4" : "2"
      if (x === 44 && y > 52 && y % 2) k = "5"
      set(x, y, k)
    }

    // the housing: x 3-92, y 5-48, its outer corners rounded off
    for (let y = 5; y <= 48; y++) for (let x = 3; x <= 92; x++) {
      if ((x === 3 || x === 92) && (y === 5 || y === 48)) continue
      let k = "3"
      if (y === 5) k = x < 52 ? "6" : "5"                                    // the top lip catches the bulb, fading right
      else if (y === 6) k = x < 12 ? "6" : "5"
      else if (y >= 47) k = y === 48 ? "1" : "2"                              // the underside
      else if (x === 3) k = "5"
      else if (x === 4) k = "4"
      else if (x >= 91) k = x === 92 ? "1" : "2"
      else if (y === 46) k = "2"
      else if (zhash(x >> 1, y, 77) < 0.04) k = "4"                         // scuffs on the moulding
      set(x, y, k)
    }
    // the bevel down into the recess: its top and left walls in shadow, its bottom and right lit
    for (let x = 6; x <= 89; x++) { set(x, 8, "2"); set(x, 45, x < 9 ? "3" : "4") }
    for (let y = 8; y <= 45; y++) { set(6, y, "2"); set(89, y, y < 11 ? "3" : "4") }
    set(6, 45, "3"); set(89, 8, "2")
    // the bezel's inner lip, the glass
    for (let y = 9; y <= 44; y++) for (let x = 7; x <= 88; x++) set(x, y, "0")
    for (let y = GY; y < GY + GH; y++) for (let x = G; x < G + GW; x++) set(x, y, "1", "glass")
    // the screws at the ends, their slots; the power lamp under the glass at the right
    set(5, 25, "2"); set(5, 26, "1"); set(5, 27, "4")
    set(90, 25, "2"); set(90, 26, "2"); set(90, 27, "5")
    set(85, 46, "6"); set(86, 46, "5"); set(85, 47, "3")

    // the bulb's glare across the glass's upper left (the block's quad, its edge at x + y = 36), brightest in the corner,
    // a thin second streak beside it (the shop window's edge), and the bulb itself, a hard little spot
    for (let y = GY; y < GY + GH; y++) for (let x = G; x < G + GW; x++) {
      const d = (x - G) + (y - GY), dither = (x + y) % 2
      let k = null
      if (x + y < 36 && y < 26) k = d < 4 ? "3" : d < 8 ? (dither ? "3" : "2") : d < 14 ? "2" : dither ? "2" : "1"
      else if (x + y === 40 && y < 29) k = "2"
      if (k) set(x, y, k, "glare")
    }
    set(9, 11, "4"); set(10, 11, "4"); set(9, 12, "3")

    // the text in the game's own fonts (art/lib/text.js), so every glyph keeps its size, baseline and spacing: TOTAL in the
    // hud's capitals, dim, where the price should be; the code in nagiwa's 5x7 digits drawn twice the size, as the display's
    // dot matrix: every cell of a glyph a dim dot (the unlit pixels a ghost), the lit ones 2x2 at full brightness
    TXT.draw({ px: (x, y) => set(x, y, "5", "text") }, 11, 13, "TOTAL", "5", { font: "hud" })
    const CODE = "41709_", SC = 2, Y = 21
    let x = 48 - Math.floor(TXT.measure(CODE, "nagiwa") * SC / 2)
    for (const ch of CODE) {
      const g = NAGIWA_GLYPHS.nagiwa[ch], rows = Array.isArray(g) ? g : g.rows
      rows.forEach((r, ry) => [...r].forEach((p, rx) => {
        const px = x + rx * SC, py = Y + ry * SC
        if (p === "#") { for (let j = 0; j < SC; j++) for (let i = 0; i < SC; i++) set(px + i, py + j, "9", "lit") }
        else set(px, py, roleAt(px, py) === "glare" ? "3" : "2", "ghost")      // the ghost dot, a step brighter under the glare
      }))
      x += (rows[0].length + 1) * SC
    }

    // the glow: glass touching a lit segment goes up to 3 (a step more under the glare)
    const src = S.k.slice(), lit = (x, y) => roleAt(x, y) === "lit"
    for (let y = GY; y < GY + GH; y++) for (let x = G; x < G + GW; x++) {
      const r = roleAt(x, y)
      if (r !== "glass" && r !== "glare") continue
      const k = Number(src[y * ZW + x])
      if (lit(x - 1, y) || lit(x + 1, y) || lit(x, y - 1) || lit(x, y + 1)) S.bg(x, y, String(Math.max(k + 1, 3)))
    }
    return S
  }
  anim("zoom_keypad", { w: ZW, h: ZH, frames: 1 }, (c) => zoomKeypadKeys().flush(c))
  // for the review sheet (art/ui/zoom_keypad_review.px.js): the painted keys, frame included
  var ZOOM_KEYPAD_KEYS = () => {
    const S = zoomKeypadKeys(), k = S.k.slice()
    for (let y = 0; y < ZH; y++) for (let x = 0; x < ZW; x++) if (x === 0 || y === 0 || x === ZW - 1 || y === ZH - 1) k[y * ZW + x] = "0"
    return { w: ZW, h: ZH, k }
  }
}

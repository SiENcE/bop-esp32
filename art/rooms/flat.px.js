// Juno's flat, Kessel Block, 14th floor, night, rain (docs/kapitel0-design.md §7.1 `flat`, §6.2
// steps 0 and 12). Street mode, a cutaway iso room (style guide §4): the left and the right back wall
// meet in the corner, the front walls are cut to a 5 px stub along the floor's front edges (the
// floor slab's section under them), the rest of the picture is the dark round the cut.
// Key hue: screen cyan from her deck, dim; a warm LED strip high on the left wall; magenta from the neon sign outside
// the window, the edge of the big ad screen across the street in cyan.
//
// What's where (u along the right wall, v along the left wall, 16 units a meter, 18 px of height):
//   right wall: the deck (desk, the rig, three mismatched monitors, a chair pulled out), the noodle
//               cup tower, the laundry pile under the window, the window
//   left wall:  the fridge in the corner, the LED strip over the bed, the bed (mattress on a pallet) with the
//               pinboard over it, the old box by its foot, the door to the hallway near the front
//
// Exports (the atlas takes flat_* only):
//   flat_bg        320x180, a 12-frame loop at 10 fps: rain and the neon outside the window
//   flat_deck      the desk, the rig and the monitors (12 frames: screens)
//   flat_chair, flat_fridge, flat_bed, flat_box, flat_noodles, flat_laundry
// Every prop is drawn where it stands in the room (ISO.pen) into its own sprite, pivot bottom-centre;
// FLAT.layout (the end of this file) holds what the game needs, measured from the same numbers:
// docs/rooms/flat_layout.md.
include("../lib/iso.js", { palette: true })

pal({ 0: "#0c221f", 7: "#266252", 8: "#55a585", 9: "#8acfae" })   // the phosphor feed on the CRT
ramps("0789")

const FLAT = (() => {
  const W = 320, H = 180, NF = 12
  const CX = 166, CY = 62           // the back corner at the foot of the walls
  const U = 76, V = 76              // the right wall 4.75 m long, the left one 4.75 m
  const HW = 52                     // wall height in px (2.9 m)
  const T = 4                       // wall thickness in units (25 cm)
  const R = ISO.room({ CX, CY })
  const { P } = R
  const fl = Math.floor, bay = ISO.bay, ihash = ISO.ihash

  // ---------------------------------------------------------------- what stands where (u0, v0, du, dv)
  const FOOT = {
    fridge: [0, 0, 9, 9],
    deck: [12, 0, 28, 11],
    chair: [36, 14, 6, 6],
    noodles: [41, 1, 7, 7],
    laundry: [52, 0, 10, 7],
    bed: [0, 20, 15, 32],
    box: [17, 42, 8, 8],
  }
  const BAND = { x0: 46, x1: 116, e: 44 }   // the LED strip on the left wall, flat px (over the bed: v 53..18), its height
  const WIN = { x0: 100, x1: 144, e0: 16, e1: 40, mull: 121 }   // the window in the right wall, flat px
  const DOOR = { x0: 8, x1: 36, h: 38 }                         // the door in the left wall, flat px (screen x - 14)
  const PIN = { x0: 62, x1: 98, e0: 21, e1: 40 }                // the pinboard over the bed, flat px
  const LX0 = CX - 2 * V                                        // the left wall's flat x 0 on the screen

  // ---------------------------------------------------------------- light on the floor
  // the neon sign outside: a point high up across the street; a floor point is lit when the line
  // from it to the sign passes through the window's glass (so the pool is the window's own shape,
  // laid on the floor, its mullion a dark bar)
  const NEON = [60, -40, 130]
  function windowLight(u, v) {
    if (v <= 0) return 0
    const t = v / (v - NEON[1])
    const uc = u + t * (NEON[0] - u), hc = t * NEON[2], x = 2 * uc
    if (x < WIN.x0 || x >= WIN.x1 || hc < WIN.e0 || hc >= WIN.e1) return 0
    if (Math.abs(x - WIN.mull - 0.5) < 1.2) return 0
    return Math.max(0, 0.9 - v / 30)
  }
  const deckLight = (u, v) => (v < 10 ? 0 : Math.max(0, 1.15 - Math.hypot((u - 27) * 0.7, v - 6) / 20))
  // the strip's warm light on the floor along the left wall, fading away from it and past its ends
  const bandLight = (u, v) => { const v0 = (152 - BAND.x1) / 2, v1 = (152 - BAND.x0) / 2, out = Math.max(0, v0 - v, v - v1); return Math.max(0, 0.95 - u / 24 - out / 8) }
  const inFoot = ([u0, v0, du, dv], u, v, m = 0) => u >= u0 - m && u < u0 + du + m && v >= v0 - m && v < v0 + dv + m

  function floorKey(x, y) {
    const [u, v] = R.uvAt(x, y)
    if (u < 0 || v < 0 || u >= U || v >= V) return null
    // vinyl sheet laid in 1 m strips along u: a seam every 16 units of v; a strip's butt joint
    const seam = (v % 16 < 0.5 && v > 1) || (Math.abs(u - (fl(v / 16) % 2 ? 40 : 24)) < 0.3)
    // the hallway's light under the door
    if (u < 0.75 && v >= 62 && v < 74) return "x"
    // under the desk: dark
    if (inFoot(FOOT.deck, u, v)) return "e"
    // light: the strongest source here wins; dithered only where it falls off
    // where two pools meet, the stronger wins, the border between them dithered
    const L = [[bandLight(u, v), "a", "A"], [deckLight(u, v), "t", "T"], [windowLight(u, v), "i", "I"]]
      .map((q, i) => [q[0] > 0 ? q[0] + 0.3 * (bay(x + 2 * i + 1, y + i) - 0.5) : 0, q[1], q[2], q[0]])
      .sort((p, q) => q[0] - p[0])[0]
    L[0] = L[3]
    const b = bay(x, y)
    let k = "z"
    if (L[0] * 1.7 > 1 + b) k = L[2]
    else if (L[0] * 1.7 > b) k = L[1]
    if (seam) k = { z: "f", a: "f", A: "a", t: "f", T: "t", i: "f", I: "i" }[k]
    // contact shadows round what stands on the floor; the chair's wheels scuffed the vinyl
    for (const [name, f] of Object.entries(FOOT)) {
      if (name === "lamp") continue
      if (inFoot(f, u, v, 1.5) && !inFoot(f, u, v)) return { z: "f", f: "e", a: "f", A: "a", t: "f", T: "t", i: "f", I: "i" }[k]
    }
    const dc = Math.hypot(u - 30, v - 15)
    if (Math.abs(dc - 7) < 0.35 && v > 12 && u < 37 && (k === "t" || k === "z")) return k === "t" ? "T" : "Z"
    return k
  }

  // ---------------------------------------------------------------- the walls (elevations, sheared)
  const darkenTop = (F, len) => {                       // the light from the lamps and screens dies out up the wall
    for (let x = 0; x < len; x++) for (let e = 38; e < HW; e++)
      if (bay(x, e) < (e - 38) / 16) { if (F.is(x, e, "3")) F.px(x, e, "2"); else if (F.is(x, e, "2")) F.px(x, e, "1") }
  }
  const leftWall = R.wallL("_flat_wallL", 2 * V, HW, (F) => {
    const len = 2 * V
    F.rect(0, 0, len, HW, "3")
    // the LED strip's warm light down the wall over the bed, the screens' cyan in the corner
    ISO.halo(F, [BAND.x0, BAND.e - 1, BAND.x1 - BAND.x0, 2], 26, { 3: "a" }, 0.75)
    ISO.halo(F, [BAND.x0, BAND.e - 1, BAND.x1 - BAND.x0, 2], 7, { a: "A", 3: "A" }, 0.6)
    ISO.halo(F, [len - 2, 12, 2, 18], 14, { 3: "c" }, 0.45)
    darkenTop(F, len)
    // the LED strip: an aluminium rail, the lit band under it, its brightest diodes
    F.hl(BAND.x0 - 1, BAND.e + 1, BAND.x1 - BAND.x0 + 2, "4")
    F.hl(BAND.x0, BAND.e, BAND.x1 - BAND.x0, "R")
    for (let x = BAND.x0 + 2; x < BAND.x1; x += 5) F.px(x, BAND.e, "W")
    // skirting board
    F.rect(0, 0, len, 2, "2"); F.hl(0, 2, len, "4")
    // the door: frame, steel leaf, a lighter edge on the lit side, handle, deadbolt with its LED,
    // peephole, the flat number
    const { x0, x1, h } = DOOR
    F.rect(x0 - 2, 0, x1 - x0 + 4, h + 2, "4"); F.hl(x0 - 2, h + 1, x1 - x0 + 4, "5")
    F.rect(x0, 0, x1 - x0, h, "5"); F.rect(x0 + 1, 0, x1 - x0 - 2, h - 1, "4")
    F.rect(x0 + 4, 4, x1 - x0 - 8, 13, "3"); F.rect(x0 + 4, 21, x1 - x0 - 8, 13, "3")   // two pressed panels
    F.hl(x0 + 4, 17, x1 - x0 - 8, "5"); F.hl(x0 + 4, 34, x1 - x0 - 8, "5")
    F.vl(x1 - 1, 0, h, "6")
    F.rect(x1 - 6, 17, 3, 1, "G"); F.px(x1 - 6, 16, "6")                                // handle
    F.rect(x1 - 6, 21, 3, 4, "2"); F.px(x1 - 5, 23, "q"); F.px(x1 - 5, 22, "1")        // lock panel, red LED
    F.px(x0 + 14, 29, "k"); F.px(x0 + 14, 30, "6")                                    // peephole
    F.rect(x0 + 11, 34, 7, 3, "6"); F.text(x0 + 12, 36, "14", "2")                      // 14 (the floor) on a plate
    // light switch beside the door, its wire up the wall
    F.rect(x1 + 5, 19, 2, 3, "5"); F.px(x1 + 5, 21, "6"); F.vl(x1 + 6, 22, HW - 22, "2")
    // a calendar by the door: one day ringed in red (the rent)
    F.rect(x1 + 12, 22, 9, 11, "h"); F.hl(x1 + 12, 32, 9, "5")
    for (let r = 0; r < 4; r++) for (let q = 0; q < 4; q++) F.px(x1 + 13 + q * 2, 23 + r * 2, "5")
    F.px(x1 + 17, 27, "q"); F.px(x1 + 18, 26, "q"); F.px(x1 + 18, 28, "q"); F.px(x1 + 19, 27, "q")
    // the pinboard over the bed: cork, a frame, photos of people she watches, cards, red strings
    {
      const { x0, x1, e0, e1 } = PIN
      F.rect(x0 - 1, e0 - 1, x1 - x0 + 2, e1 - e0 + 2, "A"); F.rect(x0, e0, x1 - x0, e1 - e0, "O")
      F.hl(x0 - 1, e1, x1 - x0 + 2, "P")                                        // the frame's top, in the lamp's light
      const photo = (x, e, face) => {           // a print, 5x6, a head and shoulders on it
        F.rect(x, e, 5, 6, "H"); F.rect(x + 1, e + 1, 3, 4, face ? "4" : "5")
        if (face) { F.px(x + 2, e + 3, "S"); F.px(x + 2, e + 4, "s"); F.hl(x + 1, e + 1, 3, "2") }
      }
      const pins = []
      const add = (x, e, kind) => { if (kind === "card") { F.rect(x, e, 6, 4, "H"); F.hl(x + 1, e + 2, 4, "h"); F.hl(x + 1, e + 1, 3, "h") } else photo(x, e, kind === "face"); pins.push([x + 2, e + (kind === "card" ? 3 : 5)]) }
      add(x0 + 2, e0 + 11, "face"); add(x0 + 10, e0 + 13, "face"); add(x0 + 19, e0 + 10, "card")
      add(x0 + 27, e0 + 12, "face"); add(x0 + 4, e0 + 2, "card"); add(x0 + 14, e0 + 3, "face"); add(x0 + 25, e0 + 2, "photo")
      // a printed street map in the middle, a camera's position marked on it
      F.rect(x0 + 13, e0 + 10, 5, 2, "6"); F.px(x0 + 15, e0 + 11, "C")
      for (const [a, b] of [[0, 1], [1, 3], [3, 2], [1, 5], [5, 6], [4, 5], [2, 6]]) F.line(pins[a][0], pins[a][1], pins[b][0], pins[b][1], "r")
      for (const [x, e] of pins) F.px(x, e, "q")
    }
    // a socket by the bed's head, the phone charger's cable down to the floor
    F.rect(124, 5, 3, 3, "5"); F.px(125, 6, "2"); F.vl(126, 1, 4, "1")
  })
  const rightWall = R.wallR("_flat_wallR", 2 * U, HW, (F) => {
    const len = 2 * U
    F.rect(0, 0, len, HW, "2")
    // the window throws the neon and the ad screen's light on the wall round it; the screens light the wall behind them
    ISO.halo(F, [WIN.x1 - 10, WIN.e0, 10, WIN.e1 - WIN.e0], 8, { 2: "c" }, 0.75)
    ISO.halo(F, [WIN.x0, WIN.e0, WIN.x1 - WIN.x0, WIN.e1 - WIN.e0], 9, { 2: "n" }, 0.8)
    ISO.halo(F, [36, 14, 42, 16], 12, { 2: "c" }, 0.85)
    ISO.halo(F, [40, 16, 34, 12], 4, { c: "C" }, 0.35)
    darkenTop(F, len)
    F.rect(0, 0, len, 2, "1"); F.hl(0, 2, len, "3")                    // skirting
    F.rect(24, 0, 56, 11, "1")                                          // behind and under the desk: dark
    // the tapped line: a fat cable from behind the desk up the wall into a hole under the ceiling, clipped every 9 px
    F.vl(30, 12, HW - 14, "1"); F.vl(31, 12, HW - 14, "k"); for (let e = 16; e < HW - 3; e += 9) F.hl(29, e, 4, "4")
    F.rect(28, HW - 4, 6, 3, "1"); F.hl(28, HW - 2, 6, "4")
    // the socket under the desk, a power strip's plugs in it
    F.rect(20, 4, 4, 4, "4"); F.px(21, 5, "2"); F.px(22, 6, "2")
    // the window: frame, sill, the glass (the view outside is painted per frame), the mullion
    F.rect(WIN.x0 - 2, WIN.e0 - 2, WIN.x1 - WIN.x0 + 4, WIN.e1 - WIN.e0 + 4, "4")
    F.hl(WIN.x0 - 2, WIN.e1 + 1, WIN.x1 - WIN.x0 + 4, "3")
    F.rect(WIN.x0, WIN.e0, WIN.x1 - WIN.x0, WIN.e1 - WIN.e0, "1")
    F.rect(WIN.x0 - 4, WIN.e0 - 3, WIN.x1 - WIN.x0 + 8, 2, "5"); F.hl(WIN.x0 - 4, WIN.e0 - 2, WIN.x1 - WIN.x0 + 8, "6")
    F.vl(WIN.mull, WIN.e0, WIN.e1 - WIN.e0, "4"); F.vl(WIN.mull + 1, WIN.e0, WIN.e1 - WIN.e0, "3")
    // the window leaks: damp streaks run down from the sill's ends
    for (const [x, n] of [[WIN.x0 - 3, 7], [WIN.x0 - 1, 4], [WIN.x1 + 2, 9], [WIN.x1 + 1, 5], [WIN.x1 - 1, 3]]) F.vl(x, WIN.e0 - 3 - n, n, "1")
  })

  // the walls' solid parts: the cut tops, the cut ends, the front stubs over the floor slab's section
  const SLAB = 9, STUB = 5
  function shell(c) {
    // left wall (u -T..0) and right wall (v -T..0), their tops cut at HW; the inner faces are the elevations
    R.isoBox(c, -T, -T, -SLAB, T, V + 2 * T, HW + SLAB, (u, v) => (u > T - 1 ? "5" : "4"),
      (a, e) => (e < SLAB ? "1" : e === SLAB ? "4" : "2"), (b, e) => (b < 2 * T ? (e < SLAB ? "1" : "2") : null))
    R.isoBox(c, -T, -T, -SLAB, U + 2 * T, T, HW + SLAB, (u, v) => (v > T - 1 ? "5" : "4"),
      (a, e) => (a >= 2 * (U + T) ? (e < SLAB ? "1" : "3") : null), (b, e) => (e < SLAB ? "1" : e === SLAB ? "4" : "2"))
    // the front stubs: what's left of the front walls, 5 px over the floor, the slab under them
    R.isoBox(c, 0, V, -SLAB, U + T, T, SLAB + STUB, (u, v) => (v < 1 ? "5" : "4"),
      (a, e) => (e < SLAB ? (e === SLAB - 1 ? "2" : "1") : "3"), (b, e) => (e < SLAB ? "1" : "2"))
    R.isoBox(c, U, 0, -SLAB, T, V, SLAB + STUB, (u, v) => (u < 1 ? "5" : "4"),
      (a, e) => (e < SLAB ? "1" : "3"), (b, e) => (e < SLAB ? (e === SLAB - 1 ? "2" : "1") : "2"))
  }

  sprite("_flat_room", { w: W, h: H }, (c) => {
    c.rect(0, 0, W, H, "k")
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const k = floorKey(x, y); if (k) c.px(x, y, k) }
    leftWall(c); rightWall(c)
    shell(c)
  })

  // ---------------------------------------------------------------- the view through the window, per frame
  // drawn in screen space (it is far away: it doesn't lie on the wall), clipped to the glass
  const inGlass = (X, Y) => {
    const x = X - CX; if (x < WIN.x0 || x >= WIN.x1 || x === WIN.mull || x === WIN.mull + 1) return false
    const e = CY + fl(x / 2) - Y; return e >= WIN.e0 && e < WIN.e1
  }
  const GX = CX + WIN.x0, GY = CY + fl(WIN.x0 / 2) - WIN.e1 + 1        // the glass's top-left on the screen
  const AD = GX + 31                                                  // the ad screen's left edge across the street
  const GLYPH = Object.fromEntries(Object.entries({                   // 3x5 letters of the sign
    H: ["#.#", "#.#", "###", "#.#", "#.#"], O: ["###", "#.#", "#.#", "#.#", "###"], T: ["###", ".#.", ".#.", ".#.", ".#."],
    E: ["###", "#..", "##.", "#..", "###"], L: ["#..", "#..", "#..", "#..", "###"],
  }).map(([ch, rows]) => [ch, rows.flatMap((r, y) => [...r].flatMap((q, x) => (q === "#" ? [[x, y]] : [])))]))
  function view(c) {
    const f = c.frame ?? 0
    for (let Y = GY; Y < GY + 48; Y++) for (let X = GX; X < GX + 44; X++) {
      if (!inGlass(X, Y)) continue
      let k = "1"
      // the block across the street: dark, a few lit windows (people up late)
      if (Y > GY + 26) k = "k"
      if (Y > GY + 26 && X < AD - 3 && (X - GX) % 7 < 3 && (Y - GY) % 6 < 2 && ihash(X >> 3, Y >> 2) < 0.45) k = ihash(X, 3) < 0.5 ? "P" : "O"
      // the ad screen's edge: its frame, then the picture (part of a sleeping face, an eye), scanlines
      if (X === AD - 1 || X === AD - 2) k = "4"
      if (X >= AD) {
        const dx = X - AD, dy = Y - GY
        k = dy % 2 ? "C" : "c"
        if (Math.abs((dx - 9) ** 2 / 30 + (dy - 20) ** 2 / 6 - 1) < 0.35) k = "v"           // the closed eyelid's line
        if (dy > 21 && dy < 24 && dx > 4 && dx < 14 && dx % 3 === 0) k = "C"                  // lashes
        if (dy < 8 && dx > 3 && (dy === 3 || dy === 5) && (dx + dy) % 4 !== 0) k = "V"        // the end of a word of the ad
      }
      c.px(X, Y, k)
    }
    // the neon sign hung on the block across: HOTEL down a dark box; the T stutters now and then
    const NX = GX + 6, NY = GY - 4, OFF = f === 7 || f === 8 || f === 10
    for (let Y = NY; Y < NY + 31; Y++) for (let X = NX - 2; X < NX + 5; X++) if (inGlass(X, Y)) c.px(X, Y, X === NX - 2 || X === NX + 4 ? "M" : "n")
    "HOTEL".split("").forEach((ch, i) => {
      // each letter drawn on a scratch grid first, so only what falls on the glass is kept
      for (const [gx, gy] of GLYPH[ch]) {
        const X = NX + gx, Y = NY + 1 + i * 6 + gy
        if (inGlass(X, Y)) c.px(X, Y, ch === "T" && OFF ? "M" : "m")
      }
    })
    // rain outside: falling top-right to bottom-left (as in the street mockup), lit cyan before the ad
    for (let i = 0; i < 26; i++) {
      const x0 = ihash(i, 1) * 64, ph = ihash(i, 2), p = (ph + (2 * f) / NF) % 1
      const X = Math.round(GX + x0 - p * 14), Y = Math.round(GY - 6 + p * 56), len = 3 + (i % 2)
      for (const [x, y] of ISO.lineCells(X, Y, X + 1, Y - len)) if (inGlass(x, y)) c.px(x, y, x >= AD ? "v" : "6")
    }
    // drops on the glass, and two running down it
    for (const [dx, dy] of [[3, 30], [17, 12], [26, 34], [38, 22], [12, 38], [33, 9], [41, 39]]) if (inGlass(GX + dx, GY + dy)) c.px(GX + dx, GY + dy, GX + dx >= AD ? "V" : "h")
    for (const [dx, d0, sp] of [[9, 4, 2], [36, 18, 3]]) {
      const y = GY + ((d0 + f * sp) % 40), x = GX + dx
      if (inGlass(x, y)) c.px(x, y, x >= AD ? "V" : "H")
      if (inGlass(x, y - 1)) c.px(x, y - 1, x >= AD ? "v" : "h")
    }
  }

  anim("flat_bg", { w: W, h: H, frames: NF, fps: 10 },
    (c) => c.stamp("_flat_room", 0, 0),
    view,
    glow("m", { r: 5, strength: 0.45 }),
    glow("vV", { r: 4, strength: 0.3 }),
  )

  // ---------------------------------------------------------------- props
  // a prop: drawn by draw(pen, frame) in room coordinates; measured over all its frames, then painted
  // into a sprite of that box, outlined in ink, pivot bottom-centre
  const PROPS = {}
  function prop(name, draw, { frames = 1, foot, glows = [] } = {}) {
    const m = ISO.measure()
    for (let f = 0; f < frames; f++) draw(m, f)
    const [bx, by, bw, bh] = m.box()
    const paint = (c) => draw(ISO.pen(c, bx, by), c.frame ?? 0)
    const opts = { w: bw, h: bh, outline: "k", pivot: "bottom" }
    if (frames > 1) anim(name, { ...opts, frames, fps: 10 }, paint, ...glows)
    else sprite(name, opts, paint, ...glows)
    // the outline grows the sprite by 1 px all round; the engine anchors it bottom-centre
    const x0 = bx - 1, y0 = by - 1, w = bw + 2, h = bh + 2
    PROPS[name] = { box: [x0, y0, w, h], at: [x0 + fl(w / 2), y0 + h], foot }
  }

  // the fridge, in the corner: old, enamel gone grey, a photo of Teo under a magnet, rust along its
  // foot, a takeaway menu; the kettle on top
  prop("flat_fridge", (p) => {
    const [u0, v0, du, dv] = FOOT.fridge, h = 26
    R.isoBox(p, u0, v0, 0, du, dv, h, (u, v) => (u > du - 1 || v > dv - 1 ? "6" : "5"),
      (a, e) => {
        if (e === 0) return "3"
        if (e === 1 && (a * 7) % 5 < 2) return "O"                         // rust at the foot
        if (e === 18) return "4"                                           // the freezer door's gap
        if (a === 15 && ((e > 10 && e < 16) || (e > 19 && e < 23))) return "H"   // handles
        if (a === 16 && ((e > 10 && e < 16) || (e > 19 && e < 23))) return "4"
        if (a >= 3 && a <= 5 && e >= 11 && e <= 13) return a === 4 && e === 12 ? "Q" : "P"   // Teo in his orange vest
        if (a === 4 && e === 14) return "q"                                 // the magnet
        if (a >= 7 && a <= 9 && e >= 7 && e <= 11) return e === 11 ? "M" : (e % 2 ? "5" : "H")   // a takeaway menu
        if (a === 0) return "h"
        return e > 18 ? "6" : (e > 2 ? "6" : "5")
      },
      (b, e) => (e === 0 ? "2" : e === 18 ? "3" : b === 0 ? "5" : "4"))
    // the kettle
    const [hx, hy] = P(3, 5, h)
    p.grid(hx - 2, hy - 5, [
      ".55..",
      "5665.",
      "45654",
      "4554.",
      ".44.."])
  }, { foot: FOOT.fridge })

  // the deck: a steel desk against the right wall; on it the rig (her own build, an open frame),
  // a wide flat screen with the post-it, an old CRT showing a camera feed in phosphor green, a small
  // portrait screen scrolling a log; keyboard; cables everywhere; a battery box under the desk
  function deck(p, f) {
    const [u0, v0, du, dv] = FOOT.deck
    // under the desk: the battery box, its LED; the power strip; cables to the floor
    R.isoBox(p, 31, 1, 0, 6, 6, 6, () => "3", (a, e) => (e === 4 && a === 2 ? (f % 6 < 5 ? "8" : "0") : e === 5 ? "4" : "2"), (b) => (b === 0 ? "3" : "1"))
    R.isoBox(p, 16, 4, 0, 8, 2, 1, () => "4", (a) => (a % 4 === 1 ? "v" : "2"), () => "2")
    for (const [a, b, sag] of [[14, 22, 6], [19, 28, 4], [24, 30, 7]]) {
      const [x0, y0] = P(a, dv, 11), [x1, y1] = P(b, dv, 11)
      const pts = []
      for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + sag * 4 * t * (1 - t)]) }
      for (let i = 0; i < 12; i++) p.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], "1")
    }
    // legs (the two at the front), then the top
    R.isoBox(p, u0, v0 + dv - 1, 0, 1, 1, 11, () => "4", () => "2", () => "3")
    R.isoBox(p, u0 + du - 1, v0 + dv - 1, 0, 1, 1, 11, () => "4", () => "2", () => "3")
    // a cable hangs from the rig over the front edge, down to the power strip
    const [cx0, cy0] = P(15, dv, 12), [cx1, cy1] = P(18, 6, 1)
    p.line(cx0, cy0, cx0 - 1, cy0 + 5, "k"); p.line(cx0 - 1, cy0 + 5, cx1, cy1, "k")
    R.isoBox(p, u0, v0, 11, du, dv, 2, (u, v) => (v > dv - 1 ? "5" : v < 6 && u > 4 && u < 26 ? "T" : "4"), (a, e) => (e === 1 ? "4" : "2"), () => "3")
    const H0 = 13
    // the rig: an open steel frame, boards inside, cyan and green LEDs, a fan
    R.isoBox(p, 12, 1, H0, 4, 8, 10, (u, v) => (u < 1 || u > 3 || v < 1 || v > 7 ? "5" : "1"),
      (a, e) => {
        if (a === 0 || a === 7 || e === 0 || e === 9) return "4"
        if (e === 7 && a > 0 && a < 7) return a % 2 ? "v" : (a + f) % 5 === 0 ? "8" : "c"
        if (e === 4 && a > 0 && a < 7) return "0"
        return e % 3 === 1 ? "2" : "1"
      },
      (b, e) => {
        if (b === 0 || b === 15 || e === 0 || e === 9) return "4"
        if (Math.hypot(b - 8, e - 5) < 3.2) return Math.hypot(b - 8, e - 5) < 1 ? "4" : (b + e + f) % 3 === 0 ? "3" : "2"
        return "3"
      })
    // the wide screen: a message open (Frau Kessler's), the photo attached
    R.isoBox(p, 20, 2, H0, 2, 1, 2, () => "2", () => "1", () => "1")
    R.isoBox(p, 16, 2, H0 + 2, 10, 1, 12, () => "2",
      (a, e) => {
        if (a === 0 || a === 19 || e === 0 || e === 11) return "1"
        if (e === 10) return a < 8 ? "v" : "C"
        if (a >= 12 && a <= 17 && e >= 3 && e <= 8) return a === 12 || a === 17 || e === 3 || e === 8 ? "C" : (e === 5 && a > 13 && a < 16 ? "8" : "c")
        if (e % 2 === 0 && e < 9 && a > 1 && a < 11 && a < 11 - ((e * 3) % 5)) return "C"
        if (e === 2 && a === 9 && f % 6 < 3) return "V"
        return "c"
      }, () => "1")
    // the CRT: a grey case, the feed in phosphor green (a street, a figure, a scrolling roll bar), REC
    R.isoBox(p, 29, 1, H0, 6, 5, 13, (u, v) => (u > 5 || v > 4 ? "G" : "g"),
      (a, e) => {
        if (a === 0 || a === 11 || e === 0 || e === 12) return "g"
        if (a === 1 || a === 10 || e === 1 || e === 11) return "4"
        const roll = (e + f) % 12 === 0
        if (e === 10 && a === 2) return f % 4 < 2 ? "q" : "0"
        if (e === 2) return a % 3 === 0 ? "8" : "7"
        if (a === 6 && e >= 4 && e <= 7) return e === 7 ? "9" : "8"            // someone under an awning
        if (e === 8 && a > 2) return roll ? "8" : "7"
        if (e < 4 && a > 6) return "7"
        return roll ? "7" : "0"
      },
      (b, e) => (e === 0 ? "4" : b > 1 && b < 9 && e > 6 && e < 11 && b % 2 === 0 ? "3" : "g"))
    // the small screen on a wall arm over the CRT: a log scrolling up
    R.isoBox(p, 33, 0, H0 + 19, 1, 1, 2, () => "4", () => "2", () => "2")
    R.isoBox(p, 30, 1, H0 + 18, 7, 1, 9, () => "2",
      (a, e) => {
        if (a === 0 || a === 13 || e === 0 || e === 8) return "1"
        const row = e + fl(f / 2)
        if (row % 2 === 0) return a > 1 && a < 4 + ((row * 3) % 7) ? (row % 6 === 0 ? "v" : "C") : "c"
        return "c"
      }, () => "1")
    // the keyboard, a few keys lit
    R.isoBox(p, 17, 6, H0, 9, 3, 1, (u, v) => (((fl(u) + fl(v * 2)) % 3 === 0) ? "4" : (u > 6 && u < 7 && v > 1 ? "C" : "3")), () => "2", () => "2")
    // an empty noodle cup with its fork, on the desk
    const [nx, ny] = P(37, 8, H0)
    p.grid(nx - 2, ny - 4, [".G...", "HHHH.", "hMMh.", ".hh.."])
    // the post-it, stuck to the wide screen's top edge: ESSEN!!, underlined, its corner curling
    const [sx, sy] = P(16, 3, H0 + 14)
    p.grid(sx - 3, sy - 6, POSTIT)
  }
  const POSTIT = (() => {
    const G = {
      E: ["###", "#..", "##.", "#..", "###"], S: ["###", "#..", "###", "..#", "###"],
      N: ["#..#", "##.#", "#.##", "#..#", "#..#"], "!": ["#.#", "#.#", "#.#", "...", "#.#"],
    }
    const word = ["E", "S", "S", "E", "N", "!"]
    const text = [0, 1, 2, 3, 4].map((r) => word.map((ch) => G[ch][r]).join(".").replace(/#/g, "k").replace(/\./g, "y"))
    const w = text[0].length + 2
    return ["y".repeat(w), ...text.map((r) => "y" + r + "y"), "y" + "k".repeat(19) + "y".repeat(w - 20), "y".repeat(w - 2) + "j."]
  })()
  prop("flat_deck", deck, { frames: NF, foot: FOOT.deck, glows: [glow("vV8", { r: 3, strength: 0.3 })] })

  // her chair, pulled out and turned away from the desk: five-star foot, the post, seat and back
  prop("flat_chair", (p) => {
    const [cx, cy] = P(39, 17)
    for (const [dx, dy] of [[-4, 0], [4, 0], [-2, 2], [3, 2], [0, -2]]) { p.line(cx, cy, cx + dx, cy + dy, "2"); p.px(cx + dx, cy + dy + 1, "k") }
    p.vline(cx, cy - 7, 7, "4"); p.vline(cx + 1, cy - 7, 6, "2")
    R.isoBox(p, 37, 15, 7, 5, 5, 2, (u, v) => (u > 4 || v > 4 ? "4" : "3"), () => "2", () => "1")
    R.isoBox(p, 36, 15, 9, 1.5, 5, 11, (u, v) => "4", () => "2", (b, e) => (e === 10 ? "4" : b === 0 ? "4" : "3"))
  }, { foot: FOOT.chair })

  // the noodle cups: the empties built into a tower, mouth down, 4-3-2-1 (a week of dinners);
  // the last one on the floor beside it
  prop("flat_noodles", (p) => {
    const [x, y] = P(44, 4)
    const CUP = [".hhh.", ".hMh.", "hMMMh", "HHHHH"]
    for (let r = 0; r < 4; r++) for (let i = 0; i < 4 - r; i++) p.grid(x - 10 + i * 5 + Math.round(r * 2.5), y - 4 - r * 4, CUP)
    p.grid(x + 9, y - 1, ["Hh.", "HMh", "Hh."])
  }, { foot: FOOT.noodles })

  // the laundry under the window: a heap she means to take down to the machines (a hoodie, jeans,
  // a grey tee, socks), out of the window's light
  prop("flat_laundry", (p) => {
    // drawn from the heap's left foot: the tee thrown on last, on top; the hoodie; the jeans, one leg
    // out along the floor; a sock
    const [x, y] = P(52, 7)
    p.grid(x - 1, y - 8, [
      "..........uUUUu..............",
      "......uuUUUUUUUUu............",
      "....uuUUuuuuuuUUUu.......44..",
      "..uuUUuuu2uuuuuuuUu.....4554.",
      ".uuUUuuuuuuuuu2uuuu2...455554",
      "hHHuuuuuu2uuuuuu555544455554.",
      "hHHHhuu2uuuuu4555555544555544",
      ".hHHHhh2uuuu24455555445555554G",
      "..hhhhh22224444444444444444.Gg",
      "...............44444444...gg..",
    ])
  }, { foot: FOOT.laundry })

  // the bed: a mattress on a wooden pallet, the pillow at the corner end, the blanket thrown back in
  // a heap, slipping over the edge
  prop("flat_bed", (p) => {
    const [u0, v0, du, dv] = FOOT.bed
    R.isoBox(p, u0, v0, 0, du, dv, 3, (u, v) => "O",
      (a, e) => (e === 1 ? (a % 10 < 2 ? "O" : "k") : e === 2 ? "A" : "O"),
      (b, e) => (e === 1 ? (b % 21 < 3 ? "O" : "k") : e === 2 ? "A" : "O"))
    // the blanket's folds: thrown back toward the foot, it bunched in waves across the bed; each
    // ridge lit on its side toward the lamp (the head end), its shadow on the side toward the foot
    const RIDGES = [[11, 1.2, 0.0, 1, 13], [15.5, 1.5, 1.7, 0, 14], [20, 1.0, 3.1, 2, 12], [24, 1.3, 0.8, 0, 14]]
    const fold = (u, v) => {
      for (const [v0r, amp, ph, ua, ub] of RIDGES) {
        if (u < ua || u > ub) continue
        const s = v - (v0r + amp * Math.sin(u * 0.45 + ph))
        if (s > -0.6 && s < 0.4) return "U"
        if (s >= 0.4 && s < 1.4) return "2"
      }
      return "u"
    }
    R.isoBox(p, u0, v0, 3, du, dv, 4,
      (u, v) => {
        if (v < 6 && u > 2 && u < 12) return v < 1 || u < 3 || u > 11 ? "h" : "H"     // pillow
        if (v > 9 + 1.5 * Math.sin(u * 1.1) && v < 27 + 1.5 * Math.sin(u * 0.9)) return fold(u, v)   // blanket
        return u > du - 2 ? "6" : "5"                                                // the bare mattress
      },
      (a, e) => (e === 3 ? "5" : "4"),
      (b, e) => {
        // the blanket slips over the side, from b 8 to 34 (its v 26 down to 13)
        if (b > 9 && b < 34 && e > 0 + (b % 7 === 0 ? 1 : 0)) return b % 6 === 0 ? "2" : "u"
        return e === 3 ? "6" : "4"
      })
  }, { foot: FOOT.bed })

  // the old box: cardboard, its flaps open; her Halcyon badge on its grey lanyard hangs out over the
  // front; the dried cactus's top shows over the rim
  prop("flat_box", (p) => {
    const [u0, v0, du, dv] = FOOT.box, h = 8
    // open: its rim, the inner faces of its far walls, the dark bottom with old papers on it
    R.isoBox(p, u0, v0, 0, du, dv, h, (u, v) => (u < 0.75 || v < 0.75 || u > du - 0.75 || v > dv - 0.75 ? "P"
      : u < 2.5 || v < 2.5 ? "O" : (Math.abs(u - v + 1) < 0.6 && u > 3) || (Math.abs(u - 5) < 0.4 && v > 3) ? "h" : "a"),
      (a, e) => (e === h - 1 ? "P" : a === 0 ? "P" : "A"),
      (b, e) => (e === h - 1 ? "A" : e === 3 && b > 3 && b < 13 ? "O" : "O"))
    // flaps: one folded out to the left, one up at the back
    const [fx, fy] = P(u0, v0 + dv, h)
    p.line(fx - 1, fy - 1, fx - 4, fy - 3, "P"); p.line(fx - 1, fy, fx - 4, fy - 2, "A")
    const [bx, by] = P(u0 + 2, v0, h)
    p.rect(bx - 2, by - 3, 6, 3, "A"); p.hline(bx - 2, by - 3, 6, "P")
    // the cactus in its pot, dried brown
    const [kx, ky] = P(u0 + 3, v0 + 3, h - 2)
    p.grid(kx - 2, ky - 7, ["..s..", "s.s..", "sss.s", "..sss", "..s..", ".PPP.", ".OPO."])
    // the lanyard over the front rim, the badge hanging from it
    const [lx, ly] = P(u0 + 4, v0 + dv, h)
    p.line(lx - 2, ly - 1, lx - 1, ly + 3, "g"); p.line(lx - 1, ly - 1, lx, ly + 3, "G")
    p.grid(lx - 2, ly + 4, ["GHHG", "HCCH", "HhhH", "GHHG"])
  }, { foot: FOOT.box })


  // ---------------------------------------------------------------- the layout for the game (docs/rooms/flat_layout.md)
  const pt = (u, v, h = 0) => P(u, v, h)
  const poly = (list) => list.flatMap(([u, v]) => pt(u, v))
  // the V of the footprint's front edges, each edge carried on 10 units past its corner: beyond a
  // line's ends the engine takes the end's y, so without them someone standing just left of the desk
  // (u < 12, in front of it) would sort behind it
  const frontOf = ([u0, v0, du, dv]) => [...pt(u0 - 10, v0 + dv), ...pt(u0, v0 + dv), ...pt(u0 + du, v0 + dv), ...pt(u0 + du, v0), ...pt(u0 + du, v0 - 10)]
  // the silhouette of a box standing on its footprint, h px tall (a hotspot that follows the slope)
  const boxPoly = ([u0, v0, du, dv], h) => [pt(u0, v0, h), pt(u0 + du, v0, h), pt(u0 + du, v0), pt(u0 + du, v0 + dv), pt(u0, v0 + dv), pt(u0, v0 + dv, h)].flat()
  const rectOfFlat = (pts) => {                              // the screen rect round a wall feature's corners
    const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1])
    const x0 = Math.min(...xs), y0 = Math.min(...ys)
    return [x0, y0, Math.max(...xs) - x0 + 1, Math.max(...ys) - y0 + 1]
  }
  const layout = {
    room: { CX, CY, U, V, HW },
    // the walkable floor, in (u, v), notched round what stands against the walls
    walk: [poly([[3, 13], [34, 13], [34, 22], [45, 22], [45, 11], [73, 11], [73, 42], [42, 73], [3, 73], [3, 54],
      [27, 54], [27, 40], [17, 40], [17, 18], [3, 18]])],
    holes: [],
    props: {},
    spots: {
      start: pt(27, 17), deck: pt(27, 17), fridge: pt(6, 15), bed: pt(19, 33), box: pt(29, 46), window: pt(63, 15),
      laundry: pt(56, 14), noodles: pt(47, 13), pinboard: pt(19, 29), door: pt(5, 67), arrive: pt(6, 66),
    },
    face: { start: "ne", deck: "ne", fridge: "ne", bed: "nw", box: "nw", window: "ne", laundry: "ne", noodles: "ne", pinboard: "nw", door: "nw", arrive: "se" },
    hotspots: {
      window: rectOfFlat([R.atR(WIN.x0 - 4, WIN.e0 - 3), R.atR(WIN.x1 + 3, WIN.e0 - 3), R.atR(WIN.x0 - 2, WIN.e1 + 1), R.atR(WIN.x1 + 1, WIN.e1 + 1)]),
      pinboard: rectOfFlat([R.atL(LX0 + PIN.x0 - 1, PIN.e0 - 1), R.atL(LX0 + PIN.x1, PIN.e0 - 1), R.atL(LX0 + PIN.x0 - 1, PIN.e1), R.atL(LX0 + PIN.x1, PIN.e1)]),
      door: rectOfFlat([R.atL(LX0 + DOOR.x0 - 2, 0), R.atL(LX0 + DOOR.x1 + 1, 0), R.atL(LX0 + DOOR.x0 - 2, DOOR.h + 1), R.atL(LX0 + DOOR.x1 + 1, DOOR.h + 1)]),
    },
    lamps: [
      { id: "band", at: pt(1, 26, BAND.e), r: 80, power: 1.05, color: "#ffd58a", flicker: 0.02 },
      { id: "band2", at: pt(1, 46, BAND.e), r: 70, power: 1.0, color: "#ffd58a", flicker: 0.02 },
      { id: "deck", at: pt(27, 3, 22), r: 64, power: 1, color: "#62def0", flicker: 0.08 },
      { id: "neon", at: pt(61, 0, 28), r: 72, power: 0.9, color: "#ff4fd3", flicker: 0.12 },
    ],
  }
  for (const [name, d] of Object.entries(PROPS)) {
    layout.props[name] = { at: d.at, front: frontOf(d.foot), baseline: pt(d.foot[0] + d.foot[2], d.foot[1] + d.foot[3])[1], box: d.box }
  }
  const hs = (prop) => PROPS[prop].box
  Object.assign(layout.hotspots, { deck: hs("flat_deck"), fridge: hs("flat_fridge"), bed: hs("flat_bed"), box_old: hs("flat_box"),
    laundry: hs("flat_laundry"), noodles: hs("flat_noodles") })
  layout.polys = { bed: boxPoly(FOOT.bed, 9), fridge: boxPoly(FOOT.fridge, 31), deck: boxPoly(FOOT.deck, 40) }
  return { layout, P, R, PROPS, FOOT }
})()

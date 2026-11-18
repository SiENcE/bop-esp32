// SUMP RUNNER, the arcade cabinet in the Wohnblock Lerche's hall, seen close (game/sump_runner.js draws the game with these):
// PAINTED (2026-11-18) on the lines of the blocks the user approved the same day (docs/rooms/sump_runner_blocks_*), every part where
// the blocks had it (game/places.js sump_runner: the marquee, the screen, the grid, the side field, the panel's buttons).
// The colours keep their meanings (style guide §5): the cabinet magenta (the city's neon), the pipes and the panel's arrows cyan (tech),
// the cable and the lamp amber (the light that goes on in a home), never yellow (Juno's alone: only her name on the table is).
//
//   ui_sr_cabinet  320x180, 4 frames: the cabinet's front filling the picture. Its sides with the magenta stripes, chipped, and the
//                  water rising on their decals; the marquee backlit, SUMP RUNNER in the city's font with drips under it and a rat at
//                  each end, one letter flickering; the bezel with its screws and the dark glass; the control panel with its speaker
//                  grille, the four cyan arrow keys, START in magenta, EXIT in steel (their words are the game's, drawn over them)
//   ui_sr_house    108x120: the house in section behind the pipes, a floor a row, bricks and slabs, damp low down
//   ui_sr_pipe     12x12, 16 frames: one cell's pipe, the frame its joins (1 up, 2 right, 4 down, 8 left); a flange where it meets the
//                  next cell's, a joint box where it turns or branches, a cap where it ends
//   ui_sr_rat      12x12, 8 frames: the cable rat with her headlamp, two steps each facing right, left, up, down
//   ui_sr_lamp     20x20, 4 frames: the lamp on top in its cage, dark, then lit three ways (it flickers on)
//   ui_sr_spark    9x9, 4 frames: a spark in a side pipe, white-hot and amber
//   ui_sr_tower    60x80: the house on the side field, its roof with a tank and an antenna; its windows are ui_sr_window
//   ui_sr_window   10x9, 2 frames: a window dark, and lit
//   ui_sr_plate    84x16, 2 frames: the plate for LIGHTS ON (amber), DROWNED and GAME OVER (magenta); the words are the game's
//   ui_sr_wave     12x3, 4 frames: the water's top, tiled along it
//   ui_sr_glare    232x126: the glass's reflection, drawn faint over the game
pal({
  k: "#05040a", 1: "#0d0b16", 2: "#15121f", 3: "#211b2e", 4: "#2e2640", 5: "#41547a", 6: "#617aa0", 7: "#8aa2c4",
  n: "#2a0f2a", N: "#3e1240", M: "#a8238a", m: "#ff4fd3", P: "#ffc0f2",          // magenta: the cabinet's neon
  c: "#0e2a36", C: "#2a6f86", v: "#62def0", V: "#dafcff",                        // cyan: the pipes, the keys
  O: "#552b1c", Q: "#eea040", R: "#ffd58a", H: "#fffbf0",                        // amber: the cable, the lamp, a lit window
  b: "#0b1e44", B: "#1d3f8a", w: "#4f7fe0",                                      // the water
  g: "#565e70", G: "#8e96a8", L: "#c8d0dc",                                      // steel; the rat's fur
  i: "#f0a0c0", I: "#a85878",                                                    // her ears, nose and tail
  s: "#04050a", t: "#0a0e1a",                                                    // the glass
  e: "#0f1220", E: "#141a2b", f: "#1c2336",                                      // the house's bricks and slabs
})
include("../lib/text.js")

{
  const BAY = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]
  const bay = (x, y) => (BAY[y & 3][x & 3] + 0.5) / 16
  const hash = (x, y) => { let h = Math.imul(x * 374761393 + y * 668265263, 1274126177); h ^= h >>> 13; return ((Math.imul(h, 1103515245) >>> 0) % 1000) / 1000 }
  // where the blocks put things (game/places.js sump_runner)
  const MARQ = [40, 2, 240, 16], SCR = [44, 24, 232, 126]
  const KEYS = { left: [90, 160, 20, 14], up: [112, 160, 20, 14], down: [134, 160, 20, 14], right: [156, 160, 20, 14] }
  const START = [194, 160, 36, 14], EXIT = [238, 160, 40, 14]

  /** a key on the panel: its body, the lit face, a highlight along the top, the shadow under it */
  const key = (c, [x, y, w, h], dark, face, hi) => {
    c.rect(x, y, w, h, dark); c.rect(x + 1, y + 1, w - 2, h - 4, face); c.hline(x + 1, y + 1, w - 2, hi)
    c.hline(x, y + h - 2, w, "k"); c.hline(x, y + h - 1, w, "k"); c.px(x, y, "k"); c.px(x + w - 1, y, "k")
  }
  /** an arrow on a key, as the blocks drew it */
  const arrow = (c, [x, y, w, h], dir, k) => {
    const cx = x + Math.floor(w / 2), cy = y + Math.floor((h - 2) / 2)
    for (let i = 0; i < 4; i++) {
      if (dir === "up") c.hline(cx - i, cy - 2 + i, i * 2 + 1, k)
      if (dir === "down") c.hline(cx - i, cy + 2 - i, i * 2 + 1, k)
      if (dir === "left") c.vline(cx - 2 + i, cy - i, i * 2 + 1, k)
      if (dir === "right") c.vline(cx + 2 - i, cy - i, i * 2 + 1, k)
    }
  }
  /** a screw head */
  const screw = (c, x, y) => { c.px(x, y, "5"); c.px(x + 1, y, "4"); c.px(x, y + 1, "4"); c.px(x + 1, y + 1, "2") }

  anim("ui_sr_cabinet", { w: 320, h: 180, ms: [2400, 80, 700, 80] }, (c) => {
    const f = c.frame ?? 0
    // ---- the body: dark, a gloss down each side where the light from the hall falls on it
    for (let y = 0; y < 180; y++) for (let x = 0; x < 320; x++) {
      const side = x < 40 ? x : x >= 281 ? 319 - x : 99
      let k = "1"
      if (side < 40) k = side < 3 ? "k" : side > 30 ? "2" : bay(x, y) < 0.12 ? "2" : "1"
      c.px(x, y, k)
    }
    // the T-molding along the outer edges, magenta with its shine
    for (const x of [3, 316]) { c.vline(x, 0, 180, "N"); c.vline(x + (x < 100 ? 1 : -1), 0, 180, "n") }
    // the decals on the sides: water rising from below in bands, then the two magenta stripes over it, chipped where hands and
    // knees have rubbed
    for (const [x0, x1] of [[6, 38], [283, 314]]) {
      for (let y = 118; y < 180; y++) for (let x = x0; x <= x1; x++) {
        const wave = 118 + Math.round(Math.sin((x + y * 0.3) / 3.2) * 2)
        if (y < wave) continue
        const band = (y - 118) % 14
        c.px(x, y, y === wave ? "w" : band === 0 ? "B" : bay(x, y) < 0.3 ? "b" : "1")
      }
    }
    for (const x of [10, 16, 302, 308]) for (let y = 0; y < 180; y++) for (let dx = 0; dx < 3; dx++) {
      const chip = hash(x + dx, y >> 1) < 0.035 || (y > 150 && hash(x + dx, y) < 0.12)
      c.px(x + dx, y, chip ? "N" : dx === 0 ? "m" : "M")
    }
    // ---- the marquee: a chrome frame, the plate lit from behind (brightest in the middle), its bottom rule
    const [mx, my, mw, mh] = MARQ
    c.rect(mx - 1, my - 1, mw + 2, mh + 3, "4"); c.hline(mx - 1, my - 1, mw + 2, "6")
    for (let y = my; y < my + mh; y++) for (let x = mx; x < mx + mw; x++) {
      const d = Math.hypot((x - 160) / 120, (y - my - mh / 2) / 10)
      c.px(x, y, d < 0.55 && bay(x, y) < 0.7 - d ? "N" : "n")
    }
    c.hline(mx, my + mh - 1, mw, "M"); c.hline(mx, my + mh, mw, "k")
    // the name in the city's font, outlined, drips running off the letters' feet; a letter of RUNNER flickers
    const NAME = "SUMP RUNNER", tw = TXT.measure(NAME, "nagiwa"), tx = 160 - Math.floor(tw / 2)
    TXT.draw(c, tx, 5, NAME, "m", { font: "nagiwa", outline: "k" })
    if (f === 1 || f === 3) {
      const ox = tx + TXT.measure("SUMP R", "nagiwa") + 1
      TXT.draw(c, ox, 5, "U", "M", { font: "nagiwa" })
    }
    for (const [dx, len] of [[3, 2], [14, 3], [27, 1], [40, 2], [58, 3], [71, 1], [83, 2]]) {
      const x = tx + dx; if (x >= tx + tw) continue
      c.vline(x, 13, len, "M"); c.px(x, 13 + len, "m")
    }
    // a rat at each end of the plate, facing the name, her headlamp lit
    for (const [x0, dir] of [[52, 1], [262, -1]]) {
      const P = ["..GGGG.i", ".GLLLLGG", "GGGGGGGk", "i.g..g.."]
      P.forEach((row, y) => [...row].forEach((k, x) => { if (k !== ".") c.px(dir > 0 ? x0 + x : x0 + 7 - x, 7 + y, k) }))
      c.px(dir > 0 ? x0 + 6 : x0 + 1, 6, "v")
    }
    // ---- the bezel round the screen: the plastic, its bevel, a screw in each corner, the black lip on the glass
    const [sx, sy, sw, sh] = SCR
    c.rect(sx - 4, sy - 3, sw + 8, sh + 6, "3"); c.hline(sx - 4, sy - 3, sw + 8, "4"); c.hline(sx - 4, sy + sh + 2, sw + 8, "2")
    c.vline(sx - 4, sy - 3, sh + 6, "4"); c.vline(sx + sw + 3, sy - 3, sh + 6, "2")
    for (const [x, y] of [[sx - 3, sy - 2], [sx + sw + 1, sy - 2], [sx - 3, sy + sh], [sx + sw + 1, sy + sh]]) screw(c, x, y)
    c.rect(sx - 1, sy - 1, sw + 2, sh + 2, "k")
    // the glass: black, a faint glow where the tube lights it, darker in its round corners
    for (let y = sy; y < sy + sh; y++) for (let x = sx; x < sx + sw; x++) {
      const d = Math.hypot((x - sx - sw / 2) / (sw / 2), (y - sy - sh / 2) / (sh / 2))
      c.px(x, y, d < 0.8 && bay(x, y) < (0.8 - d) * 0.6 ? "t" : "s")
    }
    for (const [cx, cy, dx, dy] of [[sx, sy, 1, 1], [sx + sw - 1, sy, -1, 1], [sx, sy + sh - 1, 1, -1], [sx + sw - 1, sy + sh - 1, -1, -1]])
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3 - i; j++) c.px(cx + dx * i, cy + dy * j, "k")
    // ---- the control panel: its magenta edge, the dark top with a speaker grille and the water printed low on it, the keys
    c.rect(40, 154, 240, 26, "2"); c.hline(40, 154, 240, "M"); c.hline(40, 155, 240, "N"); c.hline(40, 156, 240, "k")
    for (let y = 172; y < 180; y++) for (let x = 41; x < 279; x++) {
      const top = 174 + Math.round(Math.sin(x / 5) * 1.2)
      if (y >= top) c.px(x, y, y === top ? "B" : bay(x, y) < 0.35 ? "b" : "2")
    }
    for (let y = 161; y < 171; y += 2) for (let x = 50; x < 80; x += 2) if (Math.hypot(x - 64.5, (y - 165.5) * 1.6) < 15) c.px(x, y, "k")
    screw(c, 44, 159); screw(c, 274, 159); screw(c, 44, 170); screw(c, 274, 170)
    for (const [d, r] of Object.entries(KEYS)) { key(c, r, "c", "C", "v"); arrow(c, r, d, "V") }
    key(c, START, "n", "M", "m"); key(c, EXIT, "3", "4", "5")
  })

  // ---- the house in section behind the pipes: every row a floor, bricks, a slab at its foot, damp creeping up the lowest floors
  anim("ui_sr_house", { w: 108, h: 120, frames: 1, fps: 1 }, (c) => {
    for (let y = 0; y < 120; y++) for (let x = 0; x < 108; x++) {
      const ry = y % 12, row = Math.floor(y / 12), brick = (x + (Math.floor(ry / 3) % 2) * 3) % 6 === 0 || ry % 3 === 0
      let k = brick ? "E" : "e"
      if (ry === 11) k = "f"
      if (row >= 7 && bay(x, y) < (row - 6) * 0.12 + (ry > 8 ? 0.1 : 0)) k = "b"
      if (x === 0 || x === 107) k = "f"
      c.px(x, y, k)
    }
    c.hline(0, 0, 108, "f")
  })

  // ---- a cell's pipe by its joins (1 up, 2 right, 4 down, 8 left)
  anim("ui_sr_pipe", { w: 12, h: 12, frames: 16, fps: 1 }, (c) => {
    const m = c.frame ?? 0, up = m & 1, rt = m & 2, dn = m & 4, lf = m & 8
    // the dark edge round every arm, then the arm: lit along its top or left, shaded along the other side
    if (up) c.rect(3, 0, 6, 7, "k"); if (dn) c.rect(3, 5, 6, 7, "k"); if (lf) c.rect(0, 3, 7, 6, "k"); if (rt) c.rect(5, 3, 7, 6, "k")
    const vert = (y0, y1) => { for (let y = y0; y < y1; y++) { c.px(4, y, "v"); c.px(5, y, "C"); c.px(6, y, "C"); c.px(7, y, "c") } }
    const horz = (x0, x1) => { for (let x = x0; x < x1; x++) { c.px(x, 4, "v"); c.px(x, 5, "C"); c.px(x, 6, "C"); c.px(x, 7, "c") } }
    if (up) vert(0, 6); if (dn) vert(6, 12); if (lf) horz(0, 6); if (rt) horz(6, 12)
    // a seam where the arm meets the next cell's (only on the right and the lower edge, so two cells make one)
    if (dn) c.hline(4, 11, 4, "c"); if (rt) c.vline(11, 4, 4, "c")
    const arms = [up, rt, dn, lf].filter(Boolean).length
    if (arms === 2 && m !== 5 && m !== 10) {
      // an elbow: the bend filled round, lit on the outside
      c.rect(4, 4, 4, 4, "C"); if (up || lf) c.px(4, 4, up && lf ? "c" : "v"); c.px(7, 7, dn && rt ? "v" : "c")
    } else if (arms !== 2) {
      // a joint box where it branches, a cap where it ends
      c.rect(3, 3, 6, 6, "k"); c.rect(4, 4, 4, 4, arms === 1 ? "6" : "C"); c.hline(4, 4, 4, arms === 1 ? "7" : "v"); c.vline(4, 4, 4, arms === 1 ? "7" : "v")
      c.px(7, 7, "c"); if (arms > 2) c.px(6, 6, "V")
    }
  })

  // ---- the cable rat, drawn facing right, turned for the other ways (she has nothing on one side only, so left is her mirror)
  const RAT = [
    ["............", "............", "............", "........i...", "....GGGGGv..", "..GGLLLLLGG.", ".GLLLLLLLLkG", ".GGGGGGGGGGi", "i.g.g...g.g.", ".i..........", "............", "............"],
    ["............", "............", "............", "........i...", "....GGGGGv..", "..GGLLLLLGG.", ".GLLLLLLLLkG", ".GGGGGGGGGGi", ".g.g...g.g..", "i...........", "............", "............"],
  ]
  anim("ui_sr_rat", { w: 12, h: 12, frames: 8, fps: 1 }, (c) => {
    const n = c.frame ?? 0, face = n >> 1, P = RAT[n & 1]
    for (let y = 0; y < 12; y++) for (let x = 0; x < 12; x++) {
      const k = P[y][x]; if (k === ".") continue
      const [px, py] = face === 0 ? [x, y] : face === 1 ? [11 - x, y] : face === 2 ? [y, 11 - x] : [11 - y, x]
      c.px(px, py, k)
    }
  })

  // ---- the lamp at the top: its bracket, the socket, the bulb in a wire cage; then lit, the rays turning as it flickers on
  anim("ui_sr_lamp", { w: 20, h: 20, frames: 4, fps: 1 }, (c) => {
    const f = c.frame ?? 0, lit = f > 0
    if (lit) for (let y = 0; y < 20; y++) for (let x = 0; x < 20; x++) {
      const d = Math.hypot(x - 9.5, y - 11)
      if (d > 4 && d < 9 && bay(x, y) < (9 - d) / 9 * 0.55) c.px(x, y, "O")
    }
    c.rect(9, 0, 2, 5, "5"); c.rect(7, 5, 6, 2, "6"); c.hline(7, 5, 6, "7")
    c.ellipse(10, 11, 3, 4, lit ? "R" : "3"); c.ellipse(10, 11, 2, 3, lit ? "H" : "4"); c.px(8, 9, lit ? "H" : "5")
    for (const y of [8, 11, 14]) { c.px(6, y, "g"); c.px(13, y, "g") }
    c.vline(9, 7, 9, "g"); c.hline(7, 15, 6, "g")
    if (lit) {
      const rays = f === 1 ? [[0, -9], [0, 9], [-9, 0], [9, 0]] : f === 2 ? [[-7, -7], [7, -7], [-7, 7], [7, 7]] : [[0, -9], [-9, 0], [9, 0], [-7, 7], [7, 7]]
      for (const [dx, dy] of rays) { c.px(10 + dx, 11 + dy, "Q"); c.px(10 + Math.sign(dx) * (Math.abs(dx) - 1), 11 + Math.sign(dy) * (Math.abs(dy) - 1), "R") }
    }
  })

  // ---- a spark: a white-hot core, its arcs jumping (amber, so it reads on the cyan pipes)
  anim("ui_sr_spark", { w: 9, h: 9, frames: 4, fps: 1 }, (c) => {
    const f = c.frame ?? 0
    const arcs = [[[-3, -2], [-2, -1], [2, 1], [3, 3]], [[3, -3], [2, -1], [-2, 2], [-3, 1]], [[0, -4], [1, -2], [-1, 2], [0, 4]], [[-4, 0], [-2, 1], [2, -1], [4, 0]]][f]
    for (const [dx, dy] of arcs) c.px(4 + dx, 4 + dy, Math.abs(dx) + Math.abs(dy) > 3 ? "Q" : "R")
    c.rect(3, 3, 3, 3, "k"); c.px(4, 3, "R"); c.px(3, 4, "R"); c.px(5, 4, f % 2 ? "R" : "Q"); c.px(4, 5, "Q"); c.px(4, 4, "H")
  })

  // ---- the house on the side field: its body where the blocks had it (2, 14 here), the roof's parapet, a water tank and an antenna
  anim("ui_sr_tower", { w: 60, h: 80, frames: 1, fps: 1 }, (c) => {
    c.rect(2, 14, 56, 66, "2"); c.vline(2, 14, 66, "3"); c.vline(57, 14, 66, "1")
    for (let y = 15; y < 80; y++) for (let x = 3; x < 57; x++) if ((y % 5 === 0 && bay(x, y) < 0.4) || hash(x, y) < 0.02) c.px(x, y, "1")
    c.rect(0, 12, 60, 3, "4"); c.hline(0, 12, 60, "5"); c.hline(0, 14, 60, "1")
    c.rect(36, 4, 12, 7, "3"); c.hline(36, 4, 12, "4"); c.vline(38, 11, 1, "4"); c.vline(45, 11, 1, "4"); c.ellipse(42, 4, 6, 1, "4")
    c.vline(12, 0, 12, "5"); c.hline(9, 3, 7, "5"); c.hline(10, 6, 5, "5"); c.px(12, 0, "m")
  })
  anim("ui_sr_window", { w: 10, h: 9, frames: 2, fps: 1 }, (c) => {
    const lit = (c.frame ?? 0) === 1
    c.rect(0, 0, 10, 9, "1"); c.rect(1, 1, 8, 7, lit ? "Q" : "3")
    if (lit) { c.rect(1, 1, 8, 3, "R"); c.px(2, 2, "H"); c.rect(6, 4, 2, 4, "O") }
    else c.px(2, 2, "4")
    c.vline(5, 1, 7, "1"); c.hline(1, 4, 8, "1")
  })

  // ---- the plate for what happened, its words drawn by the game over it
  anim("ui_sr_plate", { w: 84, h: 16, frames: 2, fps: 1 }, (c) => {
    const amber = (c.frame ?? 0) === 1
    c.rect(0, 0, 84, 16, "k"); c.rect(1, 1, 82, 14, amber ? "O" : "M"); c.rect(2, 2, 80, 12, "s")
    c.hline(2, 2, 80, amber ? "O" : "N")
    for (const x of [1, 82]) for (const y of [1, 14]) c.px(x, y, amber ? "R" : "m")
  })

  // ---- the water's top: a crest that rolls along, a little foam
  anim("ui_sr_wave", { w: 12, h: 3, frames: 4, fps: 1 }, (c) => {
    const f = c.frame ?? 0
    for (let x = 0; x < 12; x++) {
      const p = (x + f * 3) % 12, h = p < 4 ? 0 : p < 7 ? 1 : 2
      for (let y = h; y < 3; y++) c.px(x, y, y === h ? (p === 2 ? "V" : "w") : "B")
    }
  })

  // ---- the glass's reflection: the hall's light caught in the tube's curve, top left
  anim("ui_sr_glare", { w: 232, h: 126, frames: 1, fps: 1 }, (c) => {
    for (let i = 0; i < 46; i++) { const x = 6 + i, y = 4 + Math.round((i * i) / 140); if (bay(x, y) < 0.7) c.px(x, y, "7") }
    for (let i = 0; i < 30; i++) { const x = 6, y = 6 + i; if (bay(x, y) < 0.5) c.px(x, y, "6") }
  })
}

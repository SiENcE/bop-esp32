// The title screen's logo (style guide §8a "Title screen"): the whole left of the title, drawn by the
// engine at the top centre of the screen (320 wide, so x here is x on screen).
//   - four tall panels, the people the story is about, each in their speaker colour with fine stripes and
//     the frames' cut corners: EVI, Juno, Teo, Sable. STAGE 1: silhouettes with each one's mark (EVI's
//     antenna ears, Juno's hood, Teo's ear defenders, Sable's bald head and pipe); the portraits come next.
//   - GLASS SISTER under them: our font's letters (game/font.js) at 3x, only their outline, one flat
//     pale colour (no gradient, no shadow), between two magenta rules
//   - HALCYON · LOWER NINTH · 2091 spaced out under it
//
//   title_logo   an animation: still most of the time, now and then a short glitch (the title splits into
//                magenta and cyan, a panel's rows slip), about 5 s a loop
//
// Built procedurally into a buffer of keys, the frame's glitch over it, then written out.

pal({
  k: "#0c0e1a", K: "#141826",
  V: "#dafcff", v: "#62def0",
  m: "#ff4fd3", M: "#a8238a",
  // the panels: the speaker colour, its stripe, the silhouette's two tones
  a: "#8ef5d8", A: "#74dcc0", b: "#1d4a44", B: "#2c6a60",          // EVI
  j: "#fff070", J: "#e6d65a", d: "#4a4220", D: "#6b6030",          // Juno
  o: "#ffb070", O: "#e89a5c", e: "#4c3020", E: "#6e4630",          // Teo
  s: "#c890ff", S: "#b078ea", f: "#36244e", F: "#4e3670",          // Sable
  r: "#ff7a3a",                                                    // the pipe's ember
})

{
  const W = 320, PW = 47, PH = 92, GAP = 4, PX = 10, PY = 0
  const H = 140

  // ---------------------------------------------------------------- the title's letters
  const GLYPHS = {
    G: ".#### #.... #.... #.### #...# #...# ####.", L: "#.... #.... #.... #.... #.... #.... #####",
    A: ".#### #...# #...# ##### #...# #...# #...#", S: ".#### #.... #.... .###. ....# ....# ####.",
    I: "### .#. .#. .#. .#. .#. ###", T: "##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..",
    E: "##### #.... #.... ####. #.... #.... #####", R: "####. #...# #...# ####. #..#. #...# #...#",
    " ": "... ... ... ... ... ... ...",
  }
  const WORD = "GLASS SISTER", SC = 3, LG = 3, LH = 7 * SC
  const widths = [...WORD].map((ch) => GLYPHS[ch].split(" ")[0].length * SC)
  const MW = widths.reduce((a, w) => a + w, 0) + (WORD.length - 1) * LG
  const fill = new Uint8Array(MW * LH)
  let gx = 0
  ;[...WORD].forEach((ch, i) => {
    const rows = GLYPHS[ch].split(" "), gw = rows[0].length
    const at = (x, y) => x >= 0 && y >= 0 && x < gw && y < 7 && rows[y][x] === "#"
    for (let cy = 0; cy < 7; cy++) for (let cx = 0; cx < gw; cx++) for (let py = 0; py < SC; py++) for (let px = 0; px < SC; px++) {
      let on = at(cx, cy)
      if (!on) for (const [dx, dy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
        if (at(cx + dx, cy) && at(cx, cy + dy) && !at(cx + dx, cy + dy)) {        // the font's 45° cuts
          const u = dx > 0 ? px : SC - 1 - px, w = dy > 0 ? py : SC - 1 - py
          if (u + w >= SC - 1) on = true
        }
      }
      if (on) fill[(cy * SC + py) * MW + gx + cx * SC + px] = 1
    }
    gx += widths[i] + LG
  })
  const filled = (x, y) => x >= 0 && y >= 0 && x < MW && y < LH && fill[y * MW + x] === 1
  // only the outline: a filled pixel with an empty neighbour (4 ways)
  const stroke = (x, y) => filled(x, y) && (!filled(x - 1, y) || !filled(x + 1, y) || !filled(x, y - 1) || !filled(x, y + 1))

  // ---------------------------------------------------------------- the panels
  const PANELS = [
    { bg: "a", stripe: "A", dark: "b", mid: "B", who: "evi" },
    { bg: "j", stripe: "J", dark: "d", mid: "D", who: "juno" },
    { bg: "o", stripe: "O", dark: "e", mid: "E", who: "teo" },
    { bg: "s", stripe: "S", dark: "f", mid: "F", who: "sable" },
  ]
  const CUT = 6

  /** a silhouette (stage 1), in panel coordinates; put(x, y, key) */
  function silhouette(who, put, p) {
    const ell = (cx, cy, rx, ry, k) => { for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1) put(cx + x, cy + y, k) }
    const trap = (y0, y1, w0, w1, k) => { for (let y = y0; y <= y1; y++) { const t = (y - y0) / Math.max(1, y1 - y0), w = Math.round(w0 + (w1 - w0) * t); for (let x = -w; x <= w; x++) put(23 + x, y, k) } }
    if (who === "evi") {                                   // round, big eyes, two antenna ears
      ell(23, 60, 15, 14, p.mid); ell(23, 60, 13, 12, p.dark)
      for (let i = 0; i < 9; i++) { put(13 - Math.floor(i / 2), 46 - i, p.dark); put(33 + Math.floor(i / 2), 46 - i, p.dark) }
      ell(17, 58, 3, 4, p.bg); ell(29, 58, 3, 4, p.bg)
      trap(78, PH - 1, 10, 13, p.dark)
      return
    }
    trap(66, PH - 1, 12, 21, p.dark)                         // shoulders
    trap(58, 66, 4, 6, p.dark)                              // neck
    if (who === "juno") {                                    // the hood, peaked, over the head
      ell(23, 46, 11, 13, p.dark); trap(30, 46, 2, 12, p.dark); ell(24, 50, 7, 9, p.mid)
      trap(60, 70, 13, 19, p.dark)
    } else if (who === "teo") {                              // short hair, ear defenders round the neck
      ell(23, 46, 9, 11, p.dark)
      ell(23, 64, 12, 4, p.mid); ell(23, 64, 9, 2, p.dark)
    } else {                                                 // Sable: bald, long coat collar, the pipe
      ell(23, 45, 9, 11, p.dark); trap(62, 74, 9, 20, p.mid)
      for (let i = 0; i < 7; i++) put(31 + i, 51 + Math.floor(i / 3), p.mid)
      put(38, 52, "r"); put(38, 53, "r")
    }
  }

  function paint(c, o = {}) {
    const B = new Array(W * H).fill(null)
    const put = (x, y, k) => { if (x >= 0 && y >= 0 && x < W && y < H) B[y * W + x] = k }
    PANELS.forEach((p, i) => {
      const x0 = PX + i * (PW + GAP)
      const inside = (x, y) => x >= 0 && y >= 0 && x < PW && y < PH && !(x + y < CUT) && !((PW - 1 - x) + (PH - 1 - y) < CUT)
      const lp = (x, y, k) => { if (inside(x, y)) put(x0 + x, PY + y, k) }
      for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) lp(x, y, y % 3 === 2 ? p.stripe : p.bg)
      silhouette(p.who, lp, p)
      // an ink edge round the panel
      for (let y = -1; y <= PH; y++) for (let x = -1; x <= PW; x++) {
        if (inside(x, y)) continue
        if (inside(x - 1, y) || inside(x + 1, y) || inside(x, y - 1) || inside(x, y + 1)) put(x0 + x, PY + y, "k")
      }
    })
    for (const [panel, row, rows, dx] of o.slips ?? []) {     // a panel's rows slipping sideways
      const x0 = PX + panel * (PW + GAP)
      for (let y = PY + row; y < PY + row + rows; y++) {
        const line = B.slice(y * W + x0 - 2, y * W + x0 + PW + 2)
        for (let x = 0; x < line.length; x++) B[y * W + x0 - 2 + x] = line[x - dx] ?? null
      }
    }

    // the title between its rules, on an ink band so the street behind can't get into the thin letters
    const TX = PX + Math.round(((PW + GAP) * 4 - GAP - MW) / 2), TY = PY + PH + 9, TW = (PW + GAP) * 4 - GAP
    for (let y = TY - 6; y < TY + LH + 16; y++) for (let x = PX; x < PX + TW; x++) put(x, y, "K")
    for (let x = PX; x < PX + TW; x++) { put(x, TY - 5, "m"); put(x, TY + LH + 4, "m") }
    for (let y = 0; y < LH; y++) for (let x = 0; x < MW; x++) if (stroke(x, y)) {
      if (o.split) { put(TX + x - o.split, TY + y, "m"); put(TX + x + o.split, TY + y, "v") }
    }
    for (let y = 0; y < LH; y++) for (let x = 0; x < MW; x++) if (stroke(x, y)) put(TX + x, TY + y, "V")
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (B[y * W + x]) c.px(x, y, B[y * W + x])
    // the place, spaced out
    const place = "HALCYON · LOWER NINTH · 2091", step = 6, pw = place.length * step - 2
    ;[...place].forEach((ch, i) => { if (ch !== " ") c.text(PX + Math.round((TW - pw) / 2) + i * step, TY + LH + 8, ch === "·" ? "." : ch, "v") })
  }

  const FRAMES = [
    [2700, {}],
    [70, { split: 2 }],
    [60, { slips: [[1, 40, 6, 4]], split: 1 }],
    [1700, {}],
    [50, { slips: [[3, 70, 4, -3]] }],
    [800, {}],
  ]
  anim("title_logo", { w: W, h: H, frames: FRAMES.length, ms: FRAMES.map(([ms]) => ms) }, (c) => paint(c, FRAMES[c.frame][1]))
}

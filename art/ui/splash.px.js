// The title screen (style guide §8a "Title screen"), shown before the menu screen (game/title.js,
// title.splash): the people the story is about, the name, the place. Personal, not generic.
//   - four tall panels, each in the speaker colour with fine stripes and the frames' cut corners:
//     EVI, Juno, Teo, Sable. STAGE 1: silhouettes with each one's mark (EVI's antenna ears, Juno's hood,
//     Teo's ear defenders, Sable's bald head and pipe); the portraits come next.
//   - GLASS SISTER under them: our font's letters at 3x, only their outline, one flat pale colour (no
//     gradient, no shadow), between two magenta rules; HALCYON · LOWER NINTH · 2091 spaced out below
//   - a night-dark ground; the rain over it all is the room's (fx), the prompt the engine's
//
//   splash_bg   320x180, an animation: still most of the time, now and then a short glitch (the title
//               splits into magenta and cyan, a panel's rows slip), about 5 s a loop
include("letters.px.js")

pal({
  k: "#0c0e1a", n: "#06080f", N: "#0a0e18",
  V: "#dafcff", v: "#62def0", m: "#ff4fd3",
  a: "#8ef5d8", A: "#74dcc0", b: "#1d4a44", B: "#2c6a60",          // EVI
  j: "#fff070", J: "#e6d65a", d: "#4a4220", D: "#6b6030",          // Juno
  o: "#ffb070", O: "#e89a5c", e: "#4c3020", E: "#6e4630",          // Teo
  s: "#c890ff", S: "#b078ea", f: "#36244e", F: "#4e3670",          // Sable
  r: "#ff7a3a",                                                    // the pipe's ember
})

{
  const W = 320, H = 180, PW = 58, PH = 100, GAP = 5, CUT = 7
  const ROW = 4 * PW + 3 * GAP, PX = Math.round((W - ROW) / 2), PY = 10
  const TB = titleBlock(ROW)
  const PANELS = [
    { bg: "a", stripe: "A", dark: "b", mid: "B", who: "evi" },
    { bg: "j", stripe: "J", dark: "d", mid: "D", who: "juno" },
    { bg: "o", stripe: "O", dark: "e", mid: "E", who: "teo" },
    { bg: "s", stripe: "S", dark: "f", mid: "F", who: "sable" },
  ]

  /** a silhouette (stage 1), drawn on a 47x92 design and scaled into the panel; put(x, y, key) */
  function silhouette(who, put, p) {
    const sx = PW / 47, sy = PH / 92, cxp = (x) => Math.round(x * sx), cyp = (y) => Math.round(y * sy)
    const ell = (cx, cy, rx, ry, k) => {
      const X = cxp(cx), Y = cyp(cy), RX = rx * sx, RY = ry * sy
      for (let y = -Math.ceil(RY); y <= RY; y++) for (let x = -Math.ceil(RX); x <= RX; x++) if ((x * x) / (RX * RX) + (y * y) / (RY * RY) <= 1) put(X + x, Y + y, k)
    }
    const trap = (y0, y1, w0, w1, k) => {
      const Y0 = cyp(y0), Y1 = cyp(y1), mid = cxp(23)
      for (let y = Y0; y <= Y1; y++) { const t = (y - Y0) / Math.max(1, Y1 - Y0), w = Math.round((w0 + (w1 - w0) * t) * sx); for (let x = -w; x <= w; x++) put(mid + x, y, k) }
    }
    if (who === "evi") {
      ell(23, 60, 15, 14, p.mid); ell(23, 60, 13, 12, p.dark)
      for (let i = 0; i < 10; i++) { put(cxp(13) - Math.floor(i / 2), cyp(46) - i, p.dark); put(cxp(33) + Math.floor(i / 2), cyp(46) - i, p.dark) }
      ell(17, 58, 3, 4, p.bg); ell(29, 58, 3, 4, p.bg)
      trap(78, 92, 10, 13, p.dark)
      return
    }
    trap(66, 92, 12, 21, p.dark); trap(58, 66, 4, 6, p.dark)
    if (who === "juno") { ell(23, 46, 11, 13, p.dark); trap(30, 46, 2, 12, p.dark); ell(24, 50, 7, 9, p.mid); trap(60, 70, 13, 19, p.dark) }
    else if (who === "teo") { ell(23, 46, 9, 11, p.dark); ell(23, 64, 12, 4, p.mid); ell(23, 64, 9, 2, p.dark) }
    else {
      ell(23, 45, 9, 11, p.dark); trap(62, 74, 9, 20, p.mid)
      for (let i = 0; i < 8; i++) put(cxp(31) + i, cyp(51) + Math.floor(i / 3), p.mid)
      put(cxp(31) + 8, cyp(51) + 2, "r"); put(cxp(31) + 8, cyp(51) + 3, "r")
    }
  }

  function paint(c, o = {}) {
    const B = new Array(W * H).fill(null)
    const put = (x, y, k) => { if (x >= 0 && y >= 0 && x < W && y < H) B[y * W + x] = k }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) put(x, y, y % 4 === 3 ? "N" : "n")
    PANELS.forEach((p, i) => {
      const x0 = PX + i * (PW + GAP)
      const inside = (x, y) => x >= 0 && y >= 0 && x < PW && y < PH && x + y >= CUT && (PW - 1 - x) + (PH - 1 - y) >= CUT
      const lp = (x, y, k) => { if (inside(x, y)) put(x0 + x, PY + y, k) }
      for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) lp(x, y, y % 3 === 2 ? p.stripe : p.bg)
      silhouette(p.who, lp, p)
      for (let y = -1; y <= PH; y++) for (let x = -1; x <= PW; x++) {
        if (inside(x, y)) continue
        if (inside(x - 1, y) || inside(x + 1, y) || inside(x, y - 1) || inside(x, y + 1)) put(x0 + x, PY + y, "k")
      }
    })
    for (const [panel, row, rows, dx] of o.slips ?? []) {
      const x0 = PX + panel * (PW + GAP)
      for (let y = PY + row; y < PY + row + rows; y++) {
        const line = B.slice(y * W + x0 - 3, y * W + x0 + PW + 3)
        for (let x = 0; x < line.length; x++) B[y * W + x0 - 3 + x] = line[x - dx] ?? "n"
      }
    }
    const BY = PY + PH + 6                                  // the title block (art/ui/letters.px.js), as on the menu screen
    TB.draw(put, PX, BY, o)
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, B[y * W + x])
    TB.place(c, PX, BY)
  }

  const FRAMES = [[2700, {}], [70, { split: 2 }], [60, { slips: [[1, 44, 7, 4]], split: 1 }], [1700, {}], [50, { slips: [[3, 76, 5, -3]] }], [800, {}]]
  anim("splash_bg", { w: W, h: H, frames: FRAMES.length, ms: FRAMES.map(([ms]) => ms) }, (c) => paint(c, FRAMES[c.frame][1]))
}

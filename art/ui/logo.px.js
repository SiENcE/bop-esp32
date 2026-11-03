// The menu screen's logo (style guide §8a "Title screen"): the same title block as on the title screen
// (art/ui/letters.px.js titleBlock: GLASS SISTER as outline letters at 3x between magenta rules,
// HALCYON · LOWER NINTH · 2091 under it), as wide as the title screen's row of panels. On a night-dark
// plate with cut corners, so the rainy street behind can't get into the thin letters.
//
//   title_logo   an animation: still, now and then the letters split into magenta and cyan for a moment
include("letters.px.js")

pal({ k: "#0c0e1a", n: "#06080f", N: "#0a0e18", V: "#dafcff", v: "#62def0", m: "#ff4fd3" })

{
  const ROW = 4 * 58 + 3 * 5                     // the title screen's row of panels (art/ui/splash.px.js)
  const TB = titleBlock(ROW), PAD = 6, CUT = 5
  const W = ROW + 2 * PAD, H = TB.h + 2 * PAD - 2

  function paint(c, o = {}) {
    const B = new Array(W * H).fill(null)
    const put = (x, y, k) => { if (x >= 0 && y >= 0 && x < W && y < H) B[y * W + x] = k }
    const inside = (x, y) => x >= 0 && y >= 0 && x < W && y < H && x + y >= CUT && (W - 1 - x) + (H - 1 - y) >= CUT
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (inside(x, y)) put(x, y, y % 4 === 3 ? "N" : "n")
    TB.draw(put, PAD, PAD - 1, o)
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (B[y * W + x]) c.px(x, y, B[y * W + x])
    TB.place(c, PAD, PAD - 1)
  }
  const FRAMES = [[3200, {}], [70, { split: 1 }], [2200, {}]]
  anim("title_logo", { w: W, h: H, frames: FRAMES.length, ms: FRAMES.map(([ms]) => ms) }, (c) => paint(c, FRAMES[c.frame][1]))
}

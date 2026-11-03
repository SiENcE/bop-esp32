// The menu screen's logo (style guide §8a "Title screen"): small and flat over the rainy street (the
// title screen before it, art/ui/splash.px.js, carries the people and the big name). GLASS SISTER in
// our font's letters at 2x, filled in one pale colour (no gradient, no shadow), an ink outline so the
// street can't get into it, between two magenta rules.
//
//   title_logo   an animation: still, now and then the letters split into magenta and cyan for a moment
include("letters.px.js")

pal({ k: "#0c0e1a", V: "#dafcff", v: "#62def0", m: "#ff4fd3" })

{
  const T = titleLetters("GLASS SISTER", 2, 2), PAD = 4, RULE = 8
  const W = T.w + 2 * (PAD + RULE), H = T.h + 2 * PAD + 6
  const OX = PAD + RULE, OY = PAD + 3

  function paint(c, o = {}) {
    const B = new Array(W * H).fill(null)
    const put = (x, y, k) => { if (x >= 0 && y >= 0 && x < W && y < H) B[y * W + x] = k }
    for (let x = PAD; x < W - PAD; x++) { put(x, OY - 4, "m"); put(x, OY + T.h + 3, "m") }
    if (o.split) for (let y = 0; y < T.h; y++) for (let x = 0; x < T.w; x++) if (T.filled(x, y)) { put(OX + x - o.split, OY + y, "m"); put(OX + x + o.split, OY + y, "v") }
    for (let y = 0; y < T.h; y++) for (let x = 0; x < T.w; x++) if (T.filled(x, y)) put(OX + x, OY + y, "V")
    const ink = B.slice()
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (B[y * W + x]) continue
      for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
        const xx = x + i, yy = y + j
        if (xx >= 0 && yy >= 0 && xx < W && yy < H && B[yy * W + xx]) ink[y * W + x] = "k"
      }
    }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ink[y * W + x]) c.px(x, y, ink[y * W + x])
  }
  const FRAMES = [[3200, {}], [70, { split: 1 }], [2200, {}]]
  anim("title_logo", { w: W, h: H, frames: FRAMES.length, ms: FRAMES.map(([ms]) => ms) }, (c) => paint(c, FRAMES[c.frame][1]))
}

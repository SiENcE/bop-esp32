// The menu screen's logo (style guide §8a "Title screen"): the same title block as on the title screen
// (art/ui/letters.px.js titleBlock: GLASS SISTER as outline letters tagged by the implant's brackets, a
// camera readout under it). No plate behind it, so the street stays whole: a thin ink edge round every
// stroke keeps it readable over the neon.
//
//   title_logo   an animation: still, now and then the letters split into magenta and cyan for a moment
include("letters.px.js")

pal({ k: "#0c0e1a", V: "#dafcff", v: "#62def0", m: "#ff4fd3", q: "#ff3a3a" })

{
  const TB = titleBlock(), W = TB.w + 2, H = TB.h + 2

  function paint(c, o = {}) {
    const B = new Array(W * H).fill(null)
    const put = (x, y, k) => { if (x >= 0 && y >= 0 && x < W && y < H) B[y * W + x] = k }
    TB.draw(put, 1, 1, o)
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

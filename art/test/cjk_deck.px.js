// Test: does the deck (mockup F) work in Simplified Chinese? The chat and the desktop's icons with every
// text in Chinese, at the sizes a CJK pixel font needs: 12 px glyphs (SimSun's 12 px bitmaps, rasterised
// for this test only by tools/cjk-raster.mjs into cjk_glyphs.js; a shipped game would bake an
// OFL pixel font such as Fusion Pixel / Ark Pixel 12 px), Latin and digits still in our fonts.
// Exports zh_deck_chat (the chat), zh_deck_compare (German and Chinese side by side).
include("../mockups/mock_f_deck.px.js", { palette: true })
include("cjk_glyphs.js")

/** Write mixed text: CJK in the 12 px glyphs (their top 2 px above the Latin capitals), the rest in our font. */
const ZH = {
  cjk: (ch) => !!CJK_GLYPHS[ch],
  measure(s, font = "nagiwa") {
    let w = 0
    for (const ch of s) w += ZH.cjk(ch) ? 13 : TXT.measure(ch, font) + 1
    return Math.max(0, w - 1)
  },
  draw(c, x, y, s, k, o = {}) {
    const font = o.font ?? "nagiwa", w = ZH.measure(s, font)
    const pass = (key, ox, oy) => {
      let cx = x + ox - (o.align === "center" ? Math.floor(w / 2) : o.align === "right" ? w : 0)
      for (const ch of s) {
        if (ZH.cjk(ch)) { CJK_GLYPHS[ch].forEach((r, ry) => { for (let rx = 0; rx < 12; rx++) if (r[rx] === "#") c.px(cx + rx, y + oy - 3 + ry, key) }); cx += 13 }
        else { TXT.draw(c, cx, y + oy, ch, key, { font }); cx += TXT.measure(ch, font) + 1 }
      }
    }
    if (o.outline) for (const [dx, dy] of [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]]) pass(o.outline, dx, dy)
    pass(k, 0, 0)
  },
  /** wrap by character (Chinese has no spaces); no line may start with a closing mark */
  wrap(s, w) {
    const out = []; let line = ""
    for (const ch of s) {
      if (ZH.measure(line + ch) > w && line && !"，。！？、；：）」".includes(ch)) { out.push(line); line = ch } else line += ch
    }
    if (line) out.push(line)
    return out
  },
}
const zbutton = (c, x, y, label, on) => {
  const w = ZH.measure(label) + 8
  chamfer(c, x, y, w, 14, 2, on ? "c" : "1", on ? "v" : "C", on ? "V" : "v")
  ZH.draw(c, x + 4, y + 4, label, on ? "V" : "v")
  return w
}

const ZLABEL = { glas: "GLASS", chat: "聊天", cache: "缓存", buch: "账本", konto: "账户", netz: "网络", radio: "电台", muell: "回收站" }
function zhHeader(c) {
  c.rect(0, 0, W, 15, "1"); c.rect(0, 14, W, 1, "3"); c.rect(0, 14, 40, 1, "C")
  hud(c, 4, 5, "DECK // J.REYES", "v")
  let x = W - 3
  x -= zbutton(c, x - (ZH.measure("返回") + 8), 0, "返回") + 3
  x -= zbutton(c, x - (ZH.measure("等待") + 8), 0, "等待") + 6
  for (const [s, k] of [["0 CHITS", "V"], ["2091-11-03", "6"], ["21:30", "V"]]) { hud(c, x, 5, s, k, "right"); x -= TXT.measure(s, "hud") + 7 }
}
/** the icons with Chinese labels: a label is 12 px tall now, so the cells grow (4 rows of 40 px) */
function zhIcons(c, open) {
  APPS.forEach((a, i) => {
    const x = 8 + (i >> 2) * 34, y = 19 + (i & 3) * 38
    if (a === open) { c.rect(x - 3, y - 2, 30, 38, "c"); c.rect(x - 3, y - 2, 1, 38, "v") }
    if (ZLABEL[a] === "GLASS") hud(c, x + 12, y + 27, "GLASS", a === open ? "V" : "6", "center")
    else ZH.draw(c, x + 12, y + 27, ZLABEL[a], a === open ? "V" : "6", { align: "center" })
  })
}
const zhIconStamps = () => APPS.map((a, i) => stamp(`_icon_${a}`, 8 + (i >> 2) * 34, 19 + (i & 3) * 38))

const ZCONTACTS = [
  { name: "凯斯勒太太", status: "在线", dot: "v", fresh: true, ava: "Q", on: true },
  { name: "SABLE", status: "离开", dot: "Q", ava: "M" },
  { name: "TEO", status: "睡觉中", dot: "5", ava: "R" },
  { name: "NAGI·WA 服务", status: "广告", dot: "4", ava: "C" },
]
sprite("zh_deck_chat", { w: W, h: H }, (c) => {
  wallpaper(c); zhHeader(c); zhIcons(c, "chat")
  const X = 76, Y = 19, WW = 240, HH = 135
  win(c, X, Y, WW, HH, "CHAT")
  const cx = X + 3, cw = 82
  ZH.draw(c, cx + 2, Y + 7, "联系人", "6")
  ZCONTACTS.forEach((p, i) => {
    const y = Y + 22 + i * 27
    if (p.on) { c.rect(cx, y - 3, cw, 26, "c"); c.rect(cx, y - 3, 1, 26, "v") }
    c.rect(cx + 3, y, 10, 10, "2"); c.rect(cx + 4, y + 1, 8, 8, p.ava); c.ellipse(cx + 8, y + 4, 2, 2, "1"); c.rect(cx + 5, y + 7, 6, 2, "1")
    if (/^[A-Z ]+$/.test(p.name)) hud(c, cx + 16, y + 1, p.name, p.on ? "V" : "6"); else ZH.draw(c, cx + 16, y + 1, p.name, p.on ? "V" : "6")
    c.rect(cx + 16, y + 15, 3, 3, p.dot)
    ZH.draw(c, cx + 22, y + 14, p.status, p.on ? "v" : "6")
    if (p.fresh) { c.rect(cx + cw - 7, y + 1, 4, 4, "k"); c.rect(cx + cw - 6, y + 2, 2, 2, "M") }
  })
  c.rect(cx + cw + 1, Y + 5, 1, HH - 10, "3")
  const tx = cx + cw + 5, tw = X + WW - 6 - tx
  ZH.draw(c, tx, Y + 7, "凯斯勒太太", "V"); ZH.draw(c, X + WW - 8, Y + 7, "在线", "v", { align: "right" })
  c.rect(tx, Y + 18, tw, 1, "3")
  let y = Y + 22
  const bubble = (lines, time) => {
    const bw = Math.max(...lines.map((l) => ZH.measure(l))) + 8, bh = lines.length * 14 + 4
    c.rect(tx, y, bw, bh, "2"); c.rect(tx, y, 1, bh, "C")
    lines.forEach((l, i) => ZH.draw(c, tx + 4, y + 5 + i * 14, l, "V"))
    hud(c, Math.min(tx + bw + 3, X + WW - 26), y + bh - 6, time, "5")
    y += bh + 3
  }
  bubble(ZH.wrap("我丈夫几个星期以来都很晚才回家。他说是加班。", tw - 28), "21:30")
  c.rect(tx, y, 64, 24, "2"); c.rect(tx, y, 1, 24, "C"); c.rect(tx + 3, y + 3, 22, 18, "4")
  c.ellipse(tx + 14, y + 9, 3, 3, "6"); c.rect(tx + 9, y + 13, 11, 8, "3"); c.rect(tx + 10, y + 12, 9, 2, "V")
  ZH.draw(c, tx + 29, y + 8, "照片", "v")
  y += 27
  bubble(["我要证据。"], "21:31")
  const ry = Y + HH - 31
  c.rect(tx - 2, ry - 3, tw + 4, 1, "3"); c.rect(tx - 2, ry - 3, 20, 1, "v")
  ;["我去看看。", "你出多少钱？"].forEach((s, i) => {
    if (i === 0) c.rect(tx - 2, ry - 1 + i * 14, tw - 44, 14, "c")
    hud(c, tx, ry + 4 + i * 14, `[${i + 1}]`, i === 0 ? "V" : "C"); ZH.draw(c, tx + 14, ry + 3 + i * 14, s, "Y")
  })
  zbutton(c, X + WW - 38, ry + 12, "附件")
  const lines = ZH.wrap("她发了一张照片。照片上最亮的像素是那条围巾。", 200).slice(0, 2)
  lines.forEach((l, i) => ZH.draw(c, 286 - ZH.measure(l), 180 - (lines.length - i) * 13 + 2, l, "h", { outline: "k" }))
}, ...zhIconStamps(), stamp("evi_neugierig", 290, 156))

sprite("zh_deck_compare", { w: W * 2 + 4, h: H }, (c) => c.rect(0, 0, W * 2 + 4, H, "k"),
  stamp("mock_f_deck_chat", 0, 0), stamp("zh_deck_chat", W + 4, 0))

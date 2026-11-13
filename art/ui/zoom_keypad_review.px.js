// Review sheet for zoom_keypad (art/ui/zooms.px.js), never built into the game:
//   zoom_keypad_review   the zoom as painted (RAW, as screens.js draws it: after the feed's post-effects), and beside it as
//                        it would read under them (Nagiwa.FEED_POST: grain, the phosphor ramp dithered, a scanline every
//                        second row 10 % darker), to show the code survives either way
//   zoom_keypad_room     in the game: over CAM 07V at 01:00 (a game screenshot), the zoom window as screens.js draws it, at 2x
include("zooms.px.js")
include("../lib/text.js")
pal({
  0: "#030a0a", 1: "#071514", 2: "#0c221f", 3: "#12332d", 4: "#1a483e",
  5: "#266252", 6: "#388169", 7: "#55a585", 8: "#8acfae", 9: "#d4f7e2",
  k: "#0c0e1a", h: "#a8b8d0", g: "#617aa0", c: "#3ff2ff",
})

const KP_HEX = ["#030a0a", "#071514", "#0c221f", "#12332d", "#1a483e", "#266252", "#388169", "#55a585", "#8acfae", "#d4f7e2"]
const KP_RGB = KP_HEX.map((h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)))
const KP_BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const kpHash = (x, y) => { let h = (x * 374761393 + y * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
/** a key as the feed's post would leave it at (x, y) of the screen: grain, the scanline, then back onto the ramp, dithered */
function kpPost(key, x, y) {
  const n = (kpHash(x, y) * 2 - 1) * 0.035 * 255, line = y % 2 ? 0.9 : 1
  const rgb = KP_RGB[Number(key)].map((v) => v * line + n)
  // the two ramp steps it falls between (along the ramp's green), and where between them
  const g = rgb[1]
  let i = 0
  while (i < 8 && KP_RGB[i + 1][1] < g) i++
  const lo = KP_RGB[i][1], hi = KP_RGB[i + 1][1], t = Math.max(0, Math.min(1, (g - lo) / (hi - lo || 1)))
  const th = 0.5 + (KP_BAYER[(y % 4) * 4 + (x % 4)] / 16 - 0.5) * 0.6
  return String(t > th ? i + 1 : i)
}
function kpPut(c, ox, oy, o = {}) {
  const { w, h, k } = ZOOM_KEYPAD_KEYS(), s = o.scale ?? 1
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const key = o.post ? kpPost(k[y * w + x], ox + x, oy + y) : k[y * w + x]
    c.rect(ox + x * s, oy + y * s, s, s, key)
  }
}

scene("zoom_keypad_review", { w: 216, h: 80, bg: "k" }, (c) => {
  TXT.draw(c, 8, 4, "PAINTED (AS DRAWN)", "h", { font: "hud" })
  TXT.draw(c, 112, 4, "IF UNDER THE FEED POST", "g", { font: "hud" })
  kpPut(c, 8, 14)
  kpPut(c, 112, 14, { post: true })
  TXT.draw(c, 8, 73, "ZOOM_KEYPAD  96X56  ONE FRAME", "g", { font: "hud" })
})

function kpBrackets(c, x, y, w, h, key, len) {
  const x2 = x + w, y2 = y + h
  for (const [cx, cy, dx, dy] of [[x - 1, y - 1, 1, 1], [x2, y - 1, -1, 1], [x - 1, y2, 1, -1], [x2, y2, -1, -1]]) {
    c.rect(dx > 0 ? cx : cx - len + 1, cy, len, 1, key); c.rect(cx, dy > 0 ? cy : cy - len + 1, 1, len, key)
  }
}
// the game screenshot of CAM 07V at 01:00 (tools/paths/kapitel1_tide_sold.json), made for the blocks
sprite("zoom_keypad_room", { png: "../../build/blocks/zoom_keypad/game_zoom_0100_1x.png" }, (c) => {
  c.rect(61, 31, 198, 118, "k")
  kpPut(c, 64, 34, { scale: 2 })
  kpBrackets(c, 62, 32, 196, 116, "c", 6)
  TXT.draw(c, 64, 151, "ZOOM x3", "c", { font: "hud" })
})

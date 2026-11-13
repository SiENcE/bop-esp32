// The close-up look_zeitung (kapitel1-design §7, the newspaper war; game/stadt.js, floor14.haldane.use): one inside page of Frau
// Haldane's stack, the NINTH HERALD, every face on it marked with four little corners in blue ballpoint, Juno's own way of marking
// ("So markier ich"; game/screens.js brackets()). Painted on the lines of the block the user chose, variant B of
// art/mockups/look_zeitung_blocks.px.js (2026-11-13): the same layout, the same type (every letter set with the game's fonts,
// art/lib/text.js), and on it the newsprint: its grain and a fold down the middle, the photos in coarse halftone, the faces lit from
// the photographer's flash with their shade side screened, a tea ring from her cup, the ballpoint a little heavier where the hand
// turned each corner. 170x112, drawn by game/screens.js at its own size in the interface's frame.
pal({
  k: "#0c0e1a",
  P: "#b8bbbe", p: "#a2a6ad", q: "#8d929b", O: "#c6c8c8",                  // newsprint: the page, a fold's shade, a rule, the fold's lit edge
  t: "#5e6470", T: "#262a34",                                               // print: body text grey, headlines and masthead black
  a: "#9da2aa", b: "#7c828e", c: "#5a606c", d: "#3a3f4a", e: "#272b34",     // the photos' greys, light to deep
  f: "#c4c1ba", F: "#a9a69f",                                               // faces in the photos, lit and shade
  u: "#3352e8", U: "#1f34b0", v: "#6f86f0",                                 // the ballpoint: its line, pressed hard, skipping
  g: "#d6d8d6",                                                             // the Lull disc's bright stripe (print)
  o: "#a99e8c", n: "#b3ab9c",                                               // the tea ring: on paper, over print
})
include("../lib/text.js")

const PW = 170, PH = 112
/** a small deterministic hash for the hand's unevenness */
const hsh = (n) => { n = (n ^ 61) ^ (n >>> 16); n = (n + (n << 3)) | 0; n ^= n >>> 4; n = Math.imul(n, 0x27d4eb2d); return ((n ^ (n >>> 15)) >>> 0) / 4294967296 }

/** text scaled k times (the masthead and headlines) */
function big(c, x, y, s, key, k, font = "hud", align = "left") {
  const proxy = { px: (px, py, kk) => c.rect(ox + (px - ox) * k, oy + (py - oy) * k, k, k, kk) }
  const w = TXT.measure(s, font) * k, ox = align === "center" ? Math.round(x - w / 2) : x, oy = y
  TXT.draw(proxy, ox, oy, s, key, { font })
}
/** body text: grey lines with word gaps, the last of a paragraph short */
function lines(c, x, y, w, n, step = 3, seed = 1, key = "t") {
  for (let i = 0; i < n; i++) {
    const end = i === n - 1 ? Math.round(w * (0.35 + hsh(seed * 31 + i) * 0.4)) : w
    for (let cx = 0; cx < end;) {
      const word = 3 + Math.floor(hsh(seed * 977 + i * 53 + cx) * 7)
      c.hline(x + cx, y + i * step, Math.min(word, end - cx), key); cx += word + 1
    }
  }
}

/**
 * The corners Juno marks with (game/screens.js brackets()): round the box [x, y, w, h] an L at each corner, its elbow one px
 * outside the box, arms `len` long; here the box is the head grown by `pad`, so the corners stand clear of hair and chin. Drawn by
 * hand: each arm a px longer or shorter now and then, never under 2. Never clipped to a photo: the pen goes over the print.
 */
function marks4(c, [x, y, w, h], key, len, seed, pad = 1) {
  x -= pad; y -= pad; w += 2 * pad; h += 2 * pad
  const x2 = x + w, y2 = y + h
  ;[[x - 1, y - 1, 1, 1], [x2, y - 1, -1, 1], [x - 1, y2, 1, -1], [x2, y2, -1, -1]].forEach(([cx, cy, dx, dy], i) => {
    const lh = Math.max(2, len + Math.round(hsh(seed * 7 + i) * 2 - 1) * (hsh(seed * 13 + i) < 0.5 ? 1 : 0))
    const lv = Math.max(2, len + Math.round(hsh(seed * 11 + i) * 2 - 1) * (hsh(seed * 17 + i) < 0.5 ? 1 : 0))
    c.rect(dx > 0 ? cx : cx - lh + 1, cy, lh, 1, key)
    c.rect(cx, dy > 0 ? cy : cy - lv + 1, 1, lv, key)
  })
}

/**
 * A person in a newspaper photo, head and shoulders: the head's top-left at (x, y), its size w x h; hair: "short", "long", "bald",
 * "cap", "helmet", "bun"; the shirt's grey. Returns the head's box (hair included) for the corners.
 */
function person(c, x, y, w, h, hair = "short", shirt = "c") {
  const sw = w * 2 + 2, sx = x + Math.floor(w / 2) - Math.floor(sw / 2)
  c.rect(x + Math.floor(w / 2) - 1, y + h, 3, 1, "F")                         // the neck
  c.rect(sx + 1, y + h + 1, sw - 2, 1, shirt); c.rect(sx, y + h + 2, sw, 40, shirt)   // the shoulders (the photo's edge crops them)
  c.rect(x, y, w, h, "f"); c.px(x, y + h - 1, "F"); c.px(x + w - 1, y + h - 1, "F")    // the face, its jaw rounded
  c.rect(x + w - 1, y + 1, 1, h - 2, "F")                                     // the side away from the flash
  const ey = y + Math.floor(h * 0.45)
  c.px(x + Math.floor(w * 0.3), ey, "d"); c.px(x + w - 1 - Math.floor(w * 0.3), ey, "d")   // the eyes, so it reads as a face
  let box = [x, y, w, h]
  if (hair === "short") { c.rect(x, y, w, 2, "e"); c.px(x, y + 2, "e"); c.px(x + w - 1, y + 2, "e") }
  if (hair === "long") { c.rect(x - 1, y - 1, w + 2, 2, "e"); c.rect(x - 1, y + 1, 1, h + 1, "e"); c.rect(x + w, y + 1, 1, h + 1, "e"); box = [x - 1, y - 1, w + 2, h + 1] }
  if (hair === "bald") { c.px(x, y, "b"); c.px(x + w - 1, y, "b") }
  if (hair === "cap") { c.rect(x, y - 1, w, 2, "d"); c.rect(x - 1, y + 1, w + 2, 1, "e"); box = [x - 1, y - 1, w + 2, h + 1] }
  if (hair === "helmet") { c.rect(x - 1, y - 2, w + 2, 3, "a"); c.rect(x - 1, y + 1, w + 2, 1, "b"); box = [x - 1, y - 2, w + 2, h + 2] }
  if (hair === "bun") { c.rect(x, y, w, 2, "e"); c.rect(x + Math.floor(w / 2) - 1, y - 2, 3, 2, "e"); box = [x, y - 2, w, h + 2] }
  return box
}

/** a photo's frame: its ground (a wall, lighter at the top), a thin rule round it */
function photo(c, x, y, w, h, wall = "a", floor = "b") {
  c.rect(x, y, w, h, wall); c.rect(x, y + Math.round(h * 0.62), w, h - Math.round(h * 0.62), floor)
  c.rect(x - 1, y - 1, w + 2, 1, "q"); c.rect(x - 1, y + h, w + 2, 1, "q"); c.rect(x - 1, y, 1, h, "q"); c.rect(x + w, y, 1, h, "q")
}
/**
 * Lull as its ads show it: the oval disc (style guide: as Teo's in the title picture, a pale disc, a darker rim, a brighter stripe),
 * here in the print's greys; big 7x8, small 5x6.
 */
function lullDisc(c, x, y, small = false) {
  const rows = small ? [".ccc.", "cgffc", "cgffc", "cgffc", "cgffc", ".ccc."]
    : ["..ccc..", ".cfffc.", "cfgfffc", "cfgfffc", "cfgfffc", "cfgfffc", ".cfffc.", "..ccc.."]
  rows.forEach((r, j) => [...r].forEach((k, i) => { if (k !== ".") c.px(x + i, y + j, k) }))
}

// ---------------------------------------------------------------------- B: an inside page of columns
const HAIR = ["short", "long", "bald", "cap", "bun", "short", "long", "helmet", "short", "bald", "long", "short"]
function pageB(c, ink = "u") {
  c.rect(0, 0, PW, PH, "P")
  TXT.draw(c, 4, 3, "NINTH HERALD", "T", { font: "hud" })
  TXT.draw(c, PW / 2, 3, "RING NEWS", "t", { font: "hud", align: "center" })
  TXT.draw(c, PW - 4, 3, "PAGE 6", "t", { font: "hud", align: "right" })
  c.hline(3, 10, PW - 6, "T")
  big(c, 4, 13, "NOTICES", "T", 2, "hud")                                        // the section head
  lines(c, 66, 14, PW - 70, 3, 3, 20)
  c.hline(3, 25, PW - 6, "q")
  // four columns of three: a portrait, its name in black, two lines; the last cell an ad
  const CW = 37, GAP = 5, X0 = 4, Y0 = 29, RH = 27
  for (let i = 0; i < 12; i++) {
    const col = i % 4, row = Math.floor(i / 4), x = X0 + col * (CW + GAP), y = Y0 + row * RH
    if (col) c.vline(x - 3, Y0, RH * 3 - 3, "q")
    if (i === 11) {                                                                // the ad: the same smiling model, LULL and its disc
      c.rect(x, y, CW, 24, "T"); c.rect(x + 1, y + 1, CW - 2, 22, "P")
      photo(c, x + 2, y + 2, 15, 20, "a", "a")
      let head; c.clip([x + 2, y + 2, 15, 20], () => { head = person(c, x + 6, y + 6, 6, 8, "long", "b") }); marks4(c, head, ink, 3, 400 + i)
      TXT.draw(c, x + 20, y + 4, "LULL", "T", { font: "hud" }); lullDisc(c, x + 20, y + 12, true); lines(c, x + 27, y + 13, CW - 29, 2, 3, 60 + i)
      continue
    }
    photo(c, x, y, 15, 19, "a", "a")
    let head; c.clip([x, y, 15, 19], () => { head = person(c, x + 4, y + 6, 6, 8, HAIR[i], i % 2 ? "b" : "c") }); marks4(c, head, ink, 3, 400 + i)
    c.hline(x + 18, y + 1, 14 + Math.floor(hsh(i) * 6), "T")                         // the name
    lines(c, x + 18, y + 5, CW - 18, 5, 3, 30 + i)
    lines(c, x, y + 22, CW, 1, 3, 40 + i)
  }
  c.vline(PW - 1, 0, PH, "p"); c.hline(0, PH - 1, PW, "p")
}


// ---------------------------------------------------------------------- the paint over the layout
/** the newsprint itself: a grain of fibres, a fold down the middle (its shade on the right, its lit edge on the left), the corners worn */
function paper(c) {
  for (let y = 0; y < PH; y++) for (let x = 0; x < PW; x++) {
    if (!c.is(x, y, "P")) continue
    const h = hsh(y * 977 + x * 13)
    if (h < 0.035) c.px(x, y, "p"); else if (h > 0.985) c.px(x, y, "O")
  }
  const FX = 85
  for (let y = 0; y < PH; y++) {
    if (c.is(FX, y, "P")) c.px(FX, y, "p")
    if (c.is(FX + 1, y, "P") && (y + (hsh(y) < 0.5 ? 0 : 1)) % 2) c.px(FX + 1, y, "p")
    if (c.is(FX - 1, y, "P")) c.px(FX - 1, y, "O")
  }
  for (const [x, y] of [[0, 0], [1, 0], [0, 1], [PW - 1, 0], [PW - 2, 0], [PW - 1, 1], [0, PH - 1], [PW - 1, PH - 1]]) c.px(x, y, "q")
}
/** halftone over a photo's box: its flat greys broken into the screen's dots, one step lighter or darker in a checker */
function halftone(c, [x, y, w, h]) {
  const UP = { a: "P", b: "a", c: "b" }, DOWN = { a: "b", b: "c", c: "d", F: "b" }             // hair and eyes (d, e) stay as printed
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const px = x + i, py = y + j, cell = (i + j) % 2
    for (const k of Object.keys(DOWN)) if (c.is(px, py, k)) {
      if (k === "F") { if (cell) c.px(px, py, "b"); break }                       // the face's shade side, screened
      if (cell && hsh(px * 31 + py * 7) < 0.5) c.px(px, py, (j / h < 0.35 ? UP : DOWN)[k])
      break
    }
  }
}
/** the ballpoint's corners again, heavier where the hand turned (the elbow) and once in a while skipping */
function pen(c) {
  for (let y = 1; y < PH - 1; y++) for (let x = 1; x < PW - 1; x++) {
    if (!c.is(x, y, "u")) continue
    const h = c.is(x - 1, y, "u") || c.is(x + 1, y, "u"), v = c.is(x, y - 1, "u") || c.is(x, y + 1, "u")
    if (h && v) c.px(x, y, "U")                                                   // the elbow
    else if (hsh(x * 131 + y * 17) < 0.08) c.px(x, y, "v")                        // the ink skipping
  }
}
/** a ring from her cup of tea, light, broken, over the text of the third column */
function teaRing(c, cx, cy, r) {
  for (let a = 0; a < 360; a += 2) {
    const rad = a * Math.PI / 180, x = Math.round(cx + Math.cos(rad) * r), y = Math.round(cy + Math.sin(rad) * r * 0.9)
    if (hsh(a * 7) < 0.18) continue
    if (x < 0 || y < 0 || x >= PW || y >= PH || c.is(x, y, "u") || c.is(x, y, "U")) continue
    c.px(x, y, c.is(x, y, "P") || c.is(x, y, "p") || c.is(x, y, "O") ? "o" : "n")
  }
}

scene("look_zeitung", { w: PW, h: PH, bg: "P" }, (c) => {
  pageB(c)
  // the photos' boxes as pageB lays them out
  const CW = 37, GAP = 5, X0 = 4, Y0 = 29, RH = 27
  for (let i = 0; i < 12; i++) {
    const x = X0 + (i % 4) * (CW + GAP), y = Y0 + Math.floor(i / 4) * RH
    halftone(c, i === 11 ? [x + 2, y + 2, 15, 20] : [x, y, 15, 19])
  }
  paper(c)
  teaRing(c, 112, 84, 9)
  pen(c)
})

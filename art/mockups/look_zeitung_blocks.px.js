// The close-up look_zeitung (kapitel1-design §7, the newspaper war; game/stadt.js, floor14.haldane.use): one page of Frau Haldane's
// stack, the NINTH HERALD, every face on it marked with four little corners in her hand. Juno: "So markier ich." So the corners are
// Juno's own (game/screens.js brackets(): an L at each corner, 1 px wide, just outside the box round the thing), drawn here round each
// head by a ballpoint, a little uneven. Blocks for approval before it is painted: two layouts of the page, the same 170x112 as the mock
// (art/mock/ch1_blocks.px.js) and as game/screens.js draws look_* in the interface's frame. Newsprint is grey, the photos are grey,
// only the ink has a colour, so the corners are what one sees first.
//   look_zeitung_A   a tabloid's front page: the masthead across, a big headline, one big photo of a shift crew (four faces, two
//                    small ones behind), a portrait in the right column, and an ad for Lull with its smiling model (marked too)
//   look_zeitung_B   an inside page of columns: a section head, twelve small portrait photos in a grid, each with its lines of text
//                    (one of them an ad, its face marked as well)
//   look_zeitung_ink one face marked three ways: the blue ballpoint (taken for A and B), a black felt pen, a red pen
//   look_zeitung_blocks         the sheet: A and B side by side at 1x, labelled, the ink below
//   look_zeitung_room_A / _B    each as it shows in the game: over a shot of the 14th floor with the close-up's frame open
//                               (build/blocks/look_zeitung/k14_1x.png, game/screens.js: the frame's inside at 75,19)
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 5: "#41547a", 6: "#617aa0",   // ink, the sheet's ground and its labels
  P: "#b8bbbe", p: "#a2a6ad", q: "#8d929b",                                 // newsprint: the page, a fold's shade, a rule
  t: "#5e6470", T: "#262a34",                                               // print: body text grey, headlines and masthead black
  a: "#9da2aa", b: "#7c828e", c: "#5a606c", d: "#3a3f4a", e: "#272b34",     // the photos' greys, light to deep
  f: "#c4c1ba", F: "#a9a69f",                                               // faces in the photos, lit and shade
  u: "#3352e8", K: "#121218", r: "#c0262e",                                 // the hand's ink: blue ballpoint, black felt, red pen
  g: "#d6d8d6",                                                            // the Lull disc's bright stripe (print)
  W: "#e8ecf2",
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

// ---------------------------------------------------------------------- A: the front page
function pageA(c, ink = "u") {
  c.rect(0, 0, PW, PH, "P")
  big(c, PW / 2, 2, "NINTH HERALD", "T", 2, "nagiwa", "center")                // the masthead
  c.hline(3, 17, PW - 6, "T"); c.hline(3, 25, PW - 6, "T")
  TXT.draw(c, 4, 19, "LOWER NINTH", "t", { font: "hud" })
  TXT.draw(c, PW / 2, 19, "LATE EDITION", "t", { font: "hud", align: "center" })
  TXT.draw(c, PW - 4, 19, "2 CHITS", "t", { font: "hud", align: "right" })
  big(c, PW / 2, 28, "NIGHT SHIFT HEROES", "T", 2, "hud", "center")          // the headline
  // the big photo: a shift crew in front of the pumps, four in the front row, two further back
  const X = 4, Y = 41, Wd = 100, Hd = 54
  photo(c, X, Y, Wd, Hd, "a", "b")
  const marks = []
  c.clip([X, Y, Wd, Hd], () => {
    c.rect(X, Y + 6, Wd, 3, "b"); c.rect(X + 70, Y, 12, 34, "b"); c.rect(X + 8, Y, 6, 34, "b")   // the pumps' pipes behind them
    marks.push([person(c, X + 22, Y + 14, 4, 5, "bald", "d"), 2])
    marks.push([person(c, X + 66, Y + 13, 4, 5, "cap", "d"), 2])
    marks.push([person(c, X + 9, Y + 20, 8, 10, "helmet", "c"), 3])
    marks.push([person(c, X + 33, Y + 18, 8, 11, "short", "c"), 3])
    marks.push([person(c, X + 55, Y + 21, 8, 10, "bun", "b"), 3])
    marks.push([person(c, X + 80, Y + 19, 8, 10, "helmet", "c"), 3])
  })
  marks.forEach(([box, len], i) => marks4(c, box, ink, len, 100 + i))
  lines(c, X, Y + Hd + 3, 70, 1, 3, 7, "q")                                     // the caption
  lines(c, X, Y + Hd + 7, 48, 4, 3, 8); lines(c, X + 52, Y + Hd + 7, 48, 4, 3, 9)   // the story under it
  // the right column: a portrait, its lines
  let head
  const RX = 110, RW = PW - RX - 4
  photo(c, RX, Y, 24, 26, "a", "a")
  c.clip([RX, Y, 24, 26], () => { head = person(c, RX + 8, Y + 7, 8, 10, "short", "c") }); marks4(c, head, ink, 3, 200)
  TXT.draw(c, RX + 27, Y + 1, "RING 5", "T", { font: "hud" })
  lines(c, RX + 27, Y + 9, RW - 27, 6, 3, 10)
  lines(c, RX, Y + 31, RW, 3, 3, 11)
  // the ad: a smiling model holding up the Lull disc, the brand
  const AY = Y + 42
  c.rect(RX, AY, RW, PH - AY - 3, "T"); c.rect(RX + 1, AY + 1, RW - 2, PH - AY - 5, "P")
  c.rect(RX + 2, AY + 2, 24, PH - AY - 7, "a")
  c.clip([RX + 2, AY + 2, 24, PH - AY - 7], () => { head = person(c, RX + 5, AY + 6, 7, 10, "long", "b"); lullDisc(c, RX + 17, AY + 7) })
  marks4(c, head, ink, 3, 300)
  TXT.draw(c, RX + 29, AY + 3, "LULL", "T", { font: "nagiwa" })
  TXT.draw(c, RX + 29, AY + 12, "SLEEP", "t", { font: "hud" }); TXT.draw(c, RX + 29, AY + 18, "EASY", "t", { font: "hud" })
  c.vline(RX - 3, Y, PH - Y - 3, "q")                                            // the column rule
  c.vline(PW - 1, 0, PH, "p"); c.hline(0, PH - 1, PW, "p")                       // the page's edge on the stack
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

scene("look_zeitung_A", { w: PW, h: PH, bg: "P" }, (c) => pageA(c))
scene("look_zeitung_B", { w: PW, h: PH, bg: "P" }, (c) => pageB(c))

// one face marked in the three inks, on a photo's grey
scene("look_zeitung_ink", { w: 3 * 28 + 2 * 4, h: 26, bg: "1" }, (c) => {
  ;["u", "K", "r"].forEach((ink, i) => {
    const x = i * 32
    photo(c, x + 1, 1, 26, 24, "a", "b")
    let head; c.clip([x + 1, 1, 26, 24], () => { head = person(c, x + 10, 8, 8, 10, "short", "c") }); marks4(c, head, ink, 3, 500)
  })
})

// the sheet: A and B side by side at 1x, labelled; the inks below
scene("look_zeitung_blocks", { w: 4 + PW + 10 + PW + 4, h: 14 + PH + 40, bg: "1" }, (c) => {
  const XA = 4, XB = 4 + PW + 10, Y = 14
  TXT.draw(c, XA, 3, "A", "W", { font: "nagiwa" }); TXT.draw(c, XA + 10, 5, "FRONT PAGE", "6", { font: "hud" })
  TXT.draw(c, XB, 3, "B", "W", { font: "nagiwa" }); TXT.draw(c, XB + 10, 5, "INSIDE PAGE", "6", { font: "hud" })
  c.stamp("look_zeitung_A", XA, Y); c.stamp("look_zeitung_B", XB, Y)
  const IY = Y + PH + 8
  TXT.draw(c, XA, IY + 10, "INK", "6", { font: "hud" })
  c.stamp("look_zeitung_ink", XA + 18, IY)
  ;["1", "2", "3"].forEach((n, i) => TXT.draw(c, XA + 18 + i * 32 + 13, IY + 28, n, "6", { font: "hud", align: "center" }))
})

// in the game: the close-up's frame over the 14th floor (a shot of the game, Juno at her door behind the frame, the old mock open), the block where the game draws it
sprite("_room", { png: "../../build/blocks/look_zeitung/k14_1x.png" })
scene("look_zeitung_room_A", { w: 320, h: 180, bg: "k" }, (c) => { c.stamp("_room", 0, 0); c.stamp("look_zeitung_A", 75, 19) })
scene("look_zeitung_room_B", { w: 320, h: 180, bg: "k" }, (c) => { c.stamp("_room", 0, 0); c.stamp("look_zeitung_B", 75, 19) })

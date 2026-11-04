// Mockup F: Juno's deck as a computer (docs/kapitel0-design.md §2, style guide §8 "The deck"). 320x180,
// the game's own fonts (art/lib/text.js: the glyphs of game/font.js), to check what reads and what fits
// before game/deck.js and game/evi.js are built. Four pictures:
//
//   mock_f_deck_desktop   the desktop with nothing open: the old photo as wallpaper (Juno and Teo as kids
//                         on a roof in the rain, dimmed), the eight apps, two files, a notification card
//                         sliding in, EVI in her corner telling Juno about it
//   mock_f_deck_chat      CHAT open: the contacts with their status (Teo "schläft"), Frau Kessler's thread
//                         with the photo, Juno's reply choices, the attachment button
//   mock_f_deck_clip      a clip open in the clip editor: the picture, who/where/when, the timeline with
//                         its moments and the people in it, a cut marked, the tools (later ones locked);
//                         EVI has walked over to the window and explains
//   mock_f_deck_evi       EVI's six faces (froh, neugierig, verwirrt, besorgt, müde, Glitch) and asleep,
//                         at 1x and 3x
//
// Colours: steel 1-6 and screen cyan cCvV (the world palette, style guide §5), magenta only as the tick
// and the "new" dot, amber for the Kassenbuch and warm things, Juno's yellow for her own replies, EVI the
// only soft round shape, in her mint (#8ef5d8). The frames are the skin's (game/skin.js: chamfered
// corners, a slanted heading tab, a magenta tick, scanlines).
pal({
  k: "#0c0e1a", n: "#06080f", w: "#090d18",                                              // ink, night, the window's fill
  1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",   // steel
  c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",                               // screen cyan
  m: "#a8238a", M: "#ff4fd3",                                                            // magenta
  O: "#552b1c", P: "#b0602a", Q: "#eea040", R: "#ffd58a",                               // amber
  y: "#9a7406", Y: "#fff070",                                                            // Juno's yellow (dimmed, hers)
  h: "#8ef5d8", E: "#4fc9b0", e: "#2a7f70", H: "#d2fff4", p: "#ffa8d8",                 // EVI
  o: "#071514", g: "#12332d", G: "#266252", l: "#55a585", L: "#8acfae", Z: "#d4f7e2",   // phosphor (the clip's picture)
  i: "#3ff2ff",                                                                          // the implant's cyan (in the clip)
  s: "#0f1626", t: "#1d2638", u: "#2a3550", x: "#3a2a20", X: "#5a4428",                 // the wallpaper photo, dimmed
})
include("../lib/text.js")
include("../ui/deck_wallpaper.px.js")

const W = 320, H = 180
const T = (c, x, y, s, k, o) => TXT.draw(c, x, y, s, k, o)
const hud = (c, x, y, s, k, align) => TXT.draw(c, x, y, s, k, { font: "hud", align })

// ================================================================ shapes (as game/skin.js draws them)
/** a box with the top-left and bottom-right corners cut at 45°: fill, edge, the light on the cuts */
function chamfer(c, x, y, w, h, cut, fill, line, bright) {
  for (let r = 0; r < h; r++) {
    const a = Math.max(0, cut - r), b = w - 1 - Math.max(0, cut - (h - 1 - r))
    if (fill) c.rect(x + a, y + r, b - a + 1, 1, fill)
    c.px(x + a, y + r, r < cut ? bright : line); c.px(x + b, y + r, r > h - 1 - cut ? bright : line)
  }
  c.rect(x + cut, y, w - cut, 1, line); c.rect(x, y + h - 1, w - cut, 1, line)
  c.rect(x + cut, y, 12, 1, bright)                                  // the light catching the top edge
}
function scanlines(c, x, y, w, h, k) { for (let r = y + 1; r < y + h; r += 2) for (let q = x; q < x + w; q++) if ((q + r) % 3 === 0 && c.key(q, r) === "w") c.px(q, r, k) }

/** an app window: the frame, a slanted cyan tab with its name, the close box, the magenta tick */
function win(c, x, y, w, h, title) {
  chamfer(c, x, y, w, h, 6, "w", "C", "v")
  scanlines(c, x + 1, y + 1, w - 2, h - 2, "1")
  c.rect(x + w - 2, y + 5, 2, 8, "M"); c.rect(x + w - 2, y + 14, 2, 2, "m")
  const tw = TXT.measure(title, "hud") + 12
  for (let r = 0; r < 8; r++) c.rect(x + 8 + (7 - r), y - 3 + r, tw - (7 - r), 1, r === 0 ? "v" : "c")
  hud(c, x + 17, y - 1, title, "V")
  // the close box
  c.rect(x + w - 19, y - 3, 11, 7, "c"); c.rect(x + w - 19, y - 3, 11, 1, "v")
  for (let d = 0; d < 3; d++) { c.px(x + w - 15 + d, y - 1 + d, "V"); c.px(x + w - 13 - d, y - 1 + d, "V") }
  // the readout in the bottom line
  const lw = TXT.measure("NINTH//SYS", "hud") + 4
  c.rect(x + w - 10 - lw, y + h - 1, lw, 1, "n"); hud(c, x + w - 8 - lw, y + h - 3, "NINTH//SYS", "6")
}
/** a small button in the HUD font */
function button(c, x, y, label, on, dim) {
  const w = TXT.measure(label, "hud") + 8
  chamfer(c, x, y, w, 10, 2, on ? "c" : "1", dim ? "3" : on ? "v" : "C", dim ? "4" : on ? "V" : "v")
  hud(c, x + 4, y + 3, label, dim ? "4" : on ? "V" : "v")
  return w
}
/** wrap a text into lines no wider than w */
function wrap(s, w, font = "halcyon") {
  const out = []; let line = ""
  for (const word of s.split(" ")) { const t = line ? line + " " + word : word; if (TXT.measure(t, font) > w && line) { out.push(line); line = word } else line = t }
  if (line) out.push(line)
  return out
}

// ================================================================ the wallpaper: an old photo, dimmed
// Juno and Teo as kids from behind, sitting on a roof's edge in the rain, the city below: the picture is
// art/ui/deck_wallpaper.px.js (deck_wallpaper, already dimmed so everything on it reads).
function wallpaper(c) {
  c.stamp("deck_wallpaper", 0, 0)
}

// ================================================================ the header (10 px)
function header(c, o = {}) {
  c.rect(0, 0, W, 11, "1"); c.rect(0, 10, W, 1, "3"); c.rect(0, 10, 40, 1, "C")
  hud(c, 4, 3, "DECK // J.REYES", "v")
  let x = W - 3
  x -= button(c, x - (TXT.measure("ZURÜCK", "hud") + 8), 0, "ZURÜCK") + 3
  x -= button(c, x - (TXT.measure("WARTEN", "hud") + 8), 0, "WARTEN") + 6
  for (const [s, k] of [["0 CHITS", "V"], ["2091-11-03", "6"], ["21:30", "V"]]) { hud(c, x, 3, s, k, "right"); x -= TXT.measure(s, "hud") + 7 }
  if (o.unread) {                                                     // the envelope and the unread count
    hud(c, x, 3, String(o.unread), "M", "right"); x -= TXT.measure(String(o.unread), "hud") + 2
    c.rect(x - 7, 2, 7, 6, "V"); c.rect(x - 6, 3, 5, 4, "1"); c.px(x - 6, 3, "V"); c.px(x - 2, 3, "V"); c.px(x - 5, 4, "V"); c.px(x - 3, 4, "V"); c.px(x - 4, 5, "V")
  }
}

// ================================================================ the apps' icons (24x24, ink outline)
const APPS = ["glas", "chat", "cache", "buch", "konto", "netz", "radio", "muell"]
const LABEL = { glas: "GLAS", chat: "CHAT", cache: "CACHE", buch: "BUCH", konto: "KONTO", netz: "NETZ", radio: "RADIO", muell: "MÜLL" }
/** where an app's icon sits: two columns of four */
const iconAt = (i) => [8 + (i >> 2) * 34, 16 + (i & 3) * 34]

sprite("_icon_glas", { w: 24, h: 24, outline: "k" }, (c) => {           // a camera on its arm: the feeds
  c.rect(3, 15, 3, 7, "4"); c.rect(1, 20, 7, 3, "5")                    // the wall plate and the arm
  c.line(5, 15, 9, 12, "5"); c.line(5, 16, 9, 13, "4")
  c.rect(6, 4, 14, 9, "5"); c.rect(6, 4, 14, 1, "6"); c.rect(6, 12, 14, 1, "4")
  c.rect(4, 3, 18, 2, "4"); c.rect(4, 3, 18, 1, "6")                    // the hood
  c.ellipse(20, 8, 3, 3, "c"); c.ellipse(20, 8, 2, 2, "C"); c.px(19, 7, "V")
  c.px(9, 7, "v"); c.px(11, 7, "C")
})
sprite("_icon_chat", { w: 24, h: 24, outline: "k" }, (c) => {           // a speech bubble with three dots
  c.rect(2, 3, 20, 13, "5"); c.rect(3, 2, 18, 1, "5"); c.rect(3, 16, 18, 1, "5")
  c.rect(3, 3, 18, 1, "6"); c.rect(2, 15, 20, 1, "4")
  for (const [x, y] of [[5, 17], [5, 18], [6, 18], [5, 19], [4, 20]]) c.px(x, y, "5")
  for (const x of [7, 11, 15]) { c.rect(x, 8, 2, 2, "v"); c.px(x, 8, "V") }
})
sprite("_icon_cache", { w: 24, h: 24, outline: "k" }, (c) => {          // an index card behind a strip of film
  c.rect(6, 2, 15, 12, "6"); c.rect(6, 2, 15, 1, "V")
  for (let y = 5; y < 12; y += 3) c.rect(8, y, 10, 1, "4")
  c.rect(1, 12, 22, 10, "2"); c.rect(1, 12, 22, 1, "4")
  for (let x = 2; x < 22; x += 3) { c.px(x, 13, "5"); c.px(x, 20, "5") }
  c.rect(4, 15, 7, 4, "C"); c.rect(13, 15, 7, 4, "c"); c.px(4, 15, "v")
})
sprite("_icon_buch", { w: 24, h: 24, outline: "k" }, (c) => {           // the Kassenbuch: a ledger in amber
  c.rect(4, 2, 17, 20, "P"); c.rect(4, 2, 17, 1, "Q"); c.rect(4, 2, 3, 20, "O")
  c.rect(20, 3, 2, 18, "R"); for (let y = 4; y < 21; y += 2) c.px(21, y, "Q")
  c.rect(10, 7, 8, 5, "O"); c.rect(11, 8, 6, 3, "Q")                    // the label
  c.rect(9, 15, 9, 1, "O")
})
sprite("_icon_konto", { w: 24, h: 24, outline: "k" }, (c) => {          // a stack of chits
  for (const [y, k, K] of [[16, "4", "5"], [12, "5", "6"], [8, "C", "v"]]) { c.ellipse(12, y + 2, 9, 3, k); c.ellipse(12, y, 9, 3, K) }
  c.ellipse(12, 8, 6, 2, "C"); c.rect(10, 7, 5, 1, "V"); c.px(10, 8, "V"); c.rect(10, 9, 5, 1, "V")   // a C on the top chit
})
sprite("_icon_netz", { w: 24, h: 24, outline: "k" }, (c) => {           // the net: a wire globe
  c.ellipse(12, 12, 10, 10, "c"); c.ellipse(12, 12, 10, 10, "C", true)
  c.ellipse(12, 12, 4, 10, "C", true); c.rect(12, 2, 1, 21, "C")
  c.rect(2, 12, 21, 1, "v"); c.rect(4, 7, 17, 1, "C"); c.rect(4, 17, 17, 1, "C")
  c.px(8, 5, "V"); c.px(7, 6, "V")
})
sprite("_icon_radio", { w: 24, h: 24, outline: "k" }, (c) => {          // a radio with its aerial and the waves
  c.line(16, 2, 19, 8, "6"); c.rect(2, 9, 20, 13, "5"); c.rect(2, 9, 20, 1, "6"); c.rect(2, 21, 20, 1, "4")
  for (let y = 12; y < 20; y += 2) for (let x = 4; x < 12; x += 2) c.px(x, y, "2")
  c.rect(14, 12, 6, 3, "c"); c.px(16, 13, "v"); c.ellipse(17, 18, 2, 2, "4"); c.px(17, 18, "6")
  c.px(5, 4, "M"); c.px(6, 3, "M"); c.px(7, 3, "M"); c.px(4, 6, "m"); c.px(8, 6, "m")
})
sprite("_icon_muell", { w: 24, h: 24, outline: "k" }, (c) => {          // the bin, a letter crumpled in it
  c.rect(6, 3, 12, 2, "6"); c.rect(10, 1, 4, 2, "5")
  c.rect(4, 5, 16, 2, "5"); c.rect(4, 5, 16, 1, "6")
  for (let y = 7; y < 22; y++) { const d = (y - 7) >> 3; c.rect(5 + d, y, 14 - 2 * d, 1, "4") }
  for (const x of [8, 12, 16]) c.rect(x, 9, 1, 11, "3")
  c.rect(11, 2, 1, 1, "V")
})

/** the icons with their labels; `open` is lit, `fresh` get the magenta dot */
function icons(c, open, fresh = []) {
  APPS.forEach((a, i) => {
    const [x, y] = iconAt(i)
    if (a === open) { c.rect(x - 3, y - 2, 30, 34, "c"); c.rect(x - 3, y - 2, 1, 34, "v") }
    hud(c, x + 12, y + 26, LABEL[a], a === open ? "V" : "6", "center")
    if (fresh.includes(a)) { c.rect(x + 20, y - 1, 4, 4, "k"); c.rect(x + 21, y, 2, 2, "M") }
  })
}
const iconStamps = () => APPS.map((a, i) => stamp(`_icon_${a}`, ...iconAt(i)))

// ================================================================ files lying on the desktop
function file(c, x, y, name) {
  c.rect(x, y, 7, 9, "6"); c.rect(x, y, 5, 1, "V"); c.px(x + 5, y, "k"); c.px(x + 6, y, "k"); c.px(x + 6, y + 1, "k"); c.px(x + 5, y + 1, "6")
  for (let r = y + 3; r < y + 8; r += 2) c.rect(x + 1, r, 5, 1, "4")
  hud(c, x + 10, y + 2, name, "6")
}

// ================================================================ EVI (24x24)
// A small round being with big eyes and two aerial ears with glowing tips, on two stubby feet. The body
// is the mirrored half below; the faces are stamped over it (20x10, from [2, 9]).
const EVI_BODY = `
  ...kk.......
  ..kHHk......
  ..kHHk......
  ...kk.......
  ....e.......
  ....e..kkkkk
  .....kkhhhhh
  ....khHHHHHh
  ...khHhhhhhh
  ..khhhhhhhhh
  ..khhhhhhhhh
  .khhhhhhhhhh
  .khhhhhhhhhh
  .khhhhhhhhhh
  .khhhhhhhhhh
  .kEhhhhhhhhh
  .kEhhhhhhhhh
  ..kEhhhhhhhh
  ..kEEhhhhhhh
  ...kEEEEhhhh
  ....kkkEEEEE
  ......kkkkkk
  .....kEEk...
  .....kkkk...`
sprite("_evi_body", { mx: true }, EVI_BODY)
const FACES = {
  froh: [
    "....................",
    "....................",
    ".....kk......kk.....",
    "....k..k....k..k....",
    "....................",
    "....................",
    ".pp.....k..k.....pp.",
    ".........kk.........",
    "....................",
    "...................."],
  neugierig: [
    "....................",
    ".....kk......kk.....",
    "....kkVk....kkVk....",
    "....kkkk....kkkk....",
    "....kkkk....kkkk....",
    "....kkkk....kkkk....",
    ".....kk......kk.....",
    ".........kk.........",
    "........k..k........",
    ".........kk........."],
  verwirrt: [
    "....................",
    "............kkk.....",
    ".....kk.............",
    "....kVkk.....kk.....",
    "....kkkk.....kk.....",
    "....kkkk............",
    ".....kk.............",
    ".........k.k........",
    "........k.k.k.......",
    "...................."],
  besorgt: [
    "......kk....kk......",
    "....kk........kk....",
    "....................",
    ".....kk......kk.....",
    "....kVkk....kVkk....",
    "....kkkk....kkkk....",
    ".....kk......kk.....",
    "....................",
    ".........kk.........",
    "........k..k........"],
  muede: [
    "....................",
    "....................",
    "....................",
    "....eeee....eeee....",
    "....kkkk....kkkk....",
    ".....kk......kk.....",
    "....................",
    "........kkkk........",
    "....................",
    "...................."],
  schlaf: [
    "....................",
    "....................",
    "....................",
    "....................",
    "....k..k....k..k....",
    ".....kk......kk.....",
    ".pp..............pp.",
    ".........kk.........",
    "....................",
    "...................."],
  glitch: [
    "....................",
    "....................",
    "....kkkk....kkkk....",
    "....kVkk....kMkk....",
    "....kkkk....kkkk....",
    "....................",
    "....................",
    "........kkkk........",
    "....................",
    "...................."],
}
const NEUTRAL = [
  "....................", "....................",
  ".....kk......kk.....", "....kVkk....kVkk....", "....kkkk....kkkk....", "....kkkk....kkkk....", ".....kk......kk.....",
  "....................", ".........kk.........", "...................."]
for (const [name, rows] of Object.entries({ ...FACES, neutral: NEUTRAL })) {
  sprite(`evi_${name}`, { w: 24, h: 24 }, stamp("_evi_body", 0, 0), (c) => {
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] !== ".") c.px(2 + x, 9 + y, r[x]) })
    if (name === "glitch") {
      // a band of her slips sideways and splits into magenta and cyan
      const band = []
      for (let y = 11; y < 15; y++) { const row = []; for (let x = 0; x < 24; x++) row.push(c.key(x, y)); band.push(row) }
      band.forEach((row, j) => { for (let x = 0; x < 24; x++) { const k = row[x - 2]; c.px(x, 11 + j, k && k !== "." ? k : "_") } })
      for (let y = 11; y < 15; y++) { c.px(3, y, "M"); c.px(22, y, "v") }
      c.rect(6, 17, 3, 1, "v"); c.rect(16, 7, 2, 1, "M")
    }
    if (name === "muede" || name === "schlaf") { c.rect(5, 5, 2, 1, "e"); c.rect(17, 5, 2, 1, "e") }   // the ears' light low
  })
}

// ================================================================ a line spoken (subtitle style: colour, ink outline)
function say(c, cx, bottom, s, k, maxW = 150) {
  const lines = wrap(s, maxW).slice(0, 2), w = Math.max(...lines.map((l) => TXT.measure(l)))
  const x0 = Math.max(4, Math.min(W - 4 - w, cx - Math.floor(w / 2)))
  lines.forEach((l, i) => T(c, x0 + Math.floor((w - TXT.measure(l)) / 2), bottom - (lines.length - i) * 10, l, k, { outline: "k" }))
}

/** EVI speaks on the deck in the strip under the window, beside her corner, right-aligned to her */
function eviSays(c, s) {
  const lines = wrap(s, 200).slice(0, 2)
  lines.forEach((l, i) => T(c, 286 - TXT.measure(l), 176 - (lines.length - i) * 10 + 1, l, "h", { outline: "k" }))
}

// ================================================================ 1. the desktop, nothing open
sprite("mock_f_deck_desktop", { w: W, h: H }, (c) => {
  wallpaper(c); header(c, { unread: 1 }); icons(c, null, ["chat"])
  file(c, 86, 138, "STEUER_2089_NICHT_ÖFFNEN.TXT"); file(c, 86, 152, "ESSEN!!.TXT")
  // the notification card sliding in at the top right: who (amber: Frau Kessler, a proposal), the first line
  const x = 192, y = 15, w = 124, h = 25
  chamfer(c, x, y, w, h, 4, "w", "C", "v"); c.rect(x + w - 2, y + 4, 2, 6, "M")
  c.rect(x + 4, y + 4, 9, 7, "V"); c.rect(x + 5, y + 5, 7, 5, "1"); c.px(x + 5, y + 5, "V"); c.px(x + 11, y + 5, "V"); c.px(x + 6, y + 6, "V"); c.px(x + 10, y + 6, "V"); c.px(x + 8, y + 7, "V"); c.px(x + 7, y + 7, "V"); c.px(x + 9, y + 7, "V")
  hud(c, x + 17, y + 5, "M. KESSLER", "Q"); hud(c, x + w - 6, y + 5, "21:30", "6", "right")
  T(c, x + 5, y + 14, "Mein Mann kommt seit …", "V")
  eviSays(c, "Neue Nachricht! Von einer Frau Kessler.")
}, ...iconStamps(), stamp("evi_froh", 290, 154))

// ================================================================ 2. CHAT
const CONTACTS = [
  { name: "M. KESSLER", status: "online", dot: "v", fresh: true, ava: "Q", on: true },
  { name: "SABLE", status: "abwesend", dot: "Q", ava: "M" },
  { name: "TEO", status: "schläft", dot: "5", ava: "R", zz: true },
  { name: "HALCYON SERVICE", status: "Werbung", dot: "4", ava: "C" },
]
sprite("mock_f_deck_chat", { w: W, h: H }, (c) => {
  wallpaper(c); header(c, { unread: 1 }); icons(c, "chat")
  const X = 76, Y = 15, WW = 240, HH = 137
  win(c, X, Y, WW, HH, "CHAT")
  // the contacts
  const cx = X + 3, cw = 82
  hud(c, cx + 2, Y + 7, "KONTAKTE", "6")
  CONTACTS.forEach((p, i) => {
    const y = Y + 15 + i * 22
    if (p.on) { c.rect(cx, y - 2, cw, 21, "c"); c.rect(cx, y - 2, 1, 21, "v") }
    c.rect(cx + 3, y, 10, 10, "2"); c.rect(cx + 4, y + 1, 8, 8, p.ava); c.ellipse(cx + 8, y + 4, 2, 2, "1"); c.rect(cx + 5, y + 7, 6, 2, "1")  // the avatar
    hud(c, cx + 16, y + 1, p.name, p.on ? "V" : "6")
    c.rect(cx + 16, y + 10, 3, 3, p.dot)
    T(c, cx + 22, y + 8, p.status, p.zz ? "6" : p.on ? "v" : "6")
    if (p.fresh) { c.rect(cx + cw - 7, y + 1, 4, 4, "k"); c.rect(cx + cw - 6, y + 2, 2, 2, "M") }
    if (p.zz) hud(c, cx + 22 + TXT.measure(p.status) + 3, y + 7, "Z", "5")
  })
  c.rect(cx + cw + 1, Y + 5, 1, HH - 10, "3")
  // the thread
  const tx = cx + cw + 5, tw = X + WW - 6 - tx
  hud(c, tx, Y + 7, "M. KESSLER", "V"); hud(c, X + WW - 8, Y + 7, "ONLINE", "v", "right")
  eviSays(c, "Sie hat ein Foto geschickt. Das hellste Pixel darauf ist der Schal.")
  c.rect(tx, Y + 14, tw, 1, "3")
  let y = Y + 18
  const bubble = (lines, time) => {
    const bw = Math.max(...lines.map((l) => TXT.measure(l))) + 8, bh = lines.length * 10 + 4
    c.rect(tx, y, bw, bh, "2"); c.rect(tx, y, 1, bh, "C")
    lines.forEach((l, i) => T(c, tx + 4, y + 3 + i * 10, l, "V"))
    hud(c, tx + bw + 3, y + bh - 6, time, "5")
    y += bh + 3
  }
  bubble(wrap("Mein Mann kommt seit Wochen spät. Er sagt, Überstunden.", tw - 30), "21:30")
  // the photo: Kessler with the pale scarf she knitted
  c.rect(tx, y, 64, 24, "2"); c.rect(tx, y, 1, 24, "C"); c.rect(tx + 3, y + 3, 22, 18, "4")
  c.ellipse(tx + 14, y + 9, 3, 3, "6"); c.rect(tx + 9, y + 13, 11, 8, "3"); c.rect(tx + 10, y + 12, 9, 2, "V")
  hud(c, tx + 28, y + 5, "FOTO", "v"); hud(c, tx + 28, y + 13, "KESSLER", "6")
  hud(c, tx + 67, y + 18, "21:30", "5")
  y += 27
  bubble(["Ich will Beweise."], "21:31")
  hud(c, tx, y + 1, "GELESEN 21:32", "5")
  // Juno's replies: choices, numbered like the dialogue's
  const ry = Y + HH - 27
  c.rect(tx - 2, ry - 3, tw + 4, 1, "3"); c.rect(tx - 2, ry - 3, 20, 1, "v")
  ;["Ich seh's mir an.", "Was zahlen Sie?"].forEach((s, i) => {
    if (i === 0) c.rect(tx - 2, ry - 1 + i * 10, tw - 44, 10, "c")
    hud(c, tx, ry + 1 + i * 10, `[${i + 1}]`, i === 0 ? "V" : "C"); T(c, tx + 14, ry + i * 10, s, "Y")
  })
  button(c, X + WW - 45, ry + 9, "ANHANG")
}, ...iconStamps(), stamp("evi_neugierig", 290, 154))

// ================================================================ 3. the clip editor
const PERSON = (c, x, y, k, kh) => { c.ellipse(x, y - 9, 2, 2, kh); c.rect(x - 3, y - 7, 7, 7, k); c.rect(x - 2, y - 7, 5, 1, kh) }
sprite("mock_f_deck_clip", { w: W, h: H }, (c) => {
  wallpaper(c); header(c); icons(c, "cache")
  const X = 76, Y = 15, WW = 240, HH = 137
  win(c, X, Y, WW, HH, "CACHE // KESSLER, RING, 22:35")
  // the clip's picture: CAM 04 at Yuen's, Kessler and Varga at the table, the ring between them
  const px = X + 6, py = Y + 8, pw = 96, ph = 54
  c.rect(px - 1, py - 1, pw + 2, ph + 2, "k"); c.rect(px, py, pw, ph, "g")
  c.rect(px, py, pw, 14, "o"); c.rect(px + 60, py + 2, 30, 10, "G")        // the wall, the window's glow
  c.rect(px + 18, py + 30, 60, 6, "l"); c.rect(px + 18, py + 36, 60, 2, "G")  // the table
  PERSON(c, px + 30, py + 32, "G", "L"); PERSON(c, px + 66, py + 32, "o", "G")
  c.px(px + 48, py + 31, "Z"); c.px(px + 49, py + 31, "Z")                  // the ring
  for (let y = py; y < py + ph; y += 2) for (let x = px; x < px + pw; x += 3) if (c.key(x, y) === "g") c.px(x, y, "o")
  // the implant's brackets and tags
  const br = (x, y, w, h) => { for (const [a, b, dx, dy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x, y + h, 1, -1], [x + w, y + h, -1, -1]]) { c.rect(Math.min(a, a + dx * 2), b, 3, 1, "i"); c.rect(a, Math.min(b, b + dy * 2), 1, 3, "i") } }
  br(px + 25, py + 19, 10, 15); hud(c, px + 22, py + 13, "KESSLER", "i")
  br(px + 61, py + 19, 10, 15); hud(c, px + 60, py + 41, "VARGA", "i")
  hud(c, px + 2, py + 2, "CAM 04", "Z"); hud(c, px + pw - 2, py + 2, "22:35:08", "Z", "right")
  // who, where, when
  const mx = px + pw + 7
  const meta = [["WO", "CAM 04 // IMBISS YUEN"], ["WANN", "22:31-22:37"], ["LÄNGE", "6:12 MIN"], ["WER", "KESSLER, VARGA"]]
  meta.forEach(([k, v], i) => { hud(c, mx, py + 1 + i * 15, k, "6"); hud(c, mx, py + 8 + i * 15, v, "V") })
  // the timeline: the minutes, the moments, the people; the cut marked, the playhead at the ring
  const lx = X + 8, lw = WW - 16, ly = py + ph + 8, t0 = 31, t1 = 37.2
  const at = (m) => Math.round(lx + (m - t0) / (t1 - t0) * lw)
  c.rect(lx, ly + 6, lw, 1, "4")
  for (let m = 31; m <= 37; m++) { c.rect(at(m), ly + 4, 1, 3, "5"); hud(c, at(m), ly - 1, `22:${m}`, "5", m === 31 ? "left" : m === 37 ? "right" : "center") }
  const moments = [[31, 32.4, "SETZT SICH", "3"], [32.4, 34.6, "REDEN", "3"], [34.6, 35.4, "RING", "C"], [35.4, 37.2, "BIS FREITAG", "3"]]
  for (const [a, b, s, k] of moments) { c.rect(at(a) + 1, ly + 9, at(b) - at(a) - 1, 9, k); hud(c, at(a) + 3, ly + 11, s, k === "C" ? "V" : "6") }
  const rows = [["KESSLER", 31, 37.2], ["VARGA", 31.1, 37.2]]
  rows.forEach(([s, a, b], i) => { const y = ly + 21 + i * 8; hud(c, lx, y, s, "6"); c.rect(at(a + 1.15), y + 1, at(b) - at(a + 1.15), 3, "4"); c.rect(at(34.6), y + 1, at(35.4) - at(34.6), 3, "v") })
  // the cut: brackets round the ring, its length
  for (const m of [34.6, 35.4]) { c.rect(at(m), ly + 7, 1, 31, "v"); c.rect(m === 34.6 ? at(m) : at(m) - 2, ly + 7, 3, 1, "v"); c.rect(m === 34.6 ? at(m) : at(m) - 2, ly + 37, 3, 1, "v") }
  hud(c, Math.round((at(34.6) + at(35.4)) / 2), ly + 40, "SCHNITT 0:48", "v", "center")
  c.rect(at(35.0), ly + 2, 1, 36, "Y")                                       // the playhead
  // the tools: cut now; the others come later (locked)
  let bx = X + 8; const by = Y + HH - 16
  bx += button(c, bx, by, "SCHNEIDEN", true) + 4
  for (const s of ["ANONYMISIEREN", "PRÜFEN", "MONTIEREN"]) bx += button(c, bx, by, s, false, true) + 4
  eviSays(c, "Schneiden heißt: nur das Stück behalten. Der Rest ist dann weg.")
}, ...iconStamps(), stamp("evi_besorgt", 290, 154))

// ================================================================ 4. EVI's faces
const SHEET = [["neutral", "neutral"], ["froh", "froh"], ["neugierig", "neugierig"], ["verwirrt", "verwirrt"], ["besorgt", "besorgt"], ["muede", "müde"], ["glitch", "Glitch"], ["schlaf", "schläft"]]
const SIX = [["froh", "froh"], ["neugierig", "neugierig"], ["verwirrt", "verwirrt"], ["besorgt", "besorgt"], ["muede", "müde"], ["glitch", "Glitch"]]
sprite("mock_f_deck_evi", { w: W, h: H }, (c) => {
  c.rect(0, 0, W, H, "2"); header(c)
  hud(c, 8, 17, "EVI // EVAL-7 // 24 PX: DIE SECHS GESICHTER, NEUTRAL UND SCHLAF", "v")
  SHEET.forEach(([, label], i) => hud(c, 12 + i * 38 + 12, 56, label, "6", "center"))
  hud(c, 12 + 7 * 38 + 25, 30, "Z", "h"); hud(c, 12 + 7 * 38 + 29, 25, "Z", "h")
  // the six faces at 2x, painted from the same rows (the body mirrored, the face over it)
  const body = EVI_BODY.trim().split(/\s+/).map((r) => r + [...r].reverse().join(""))
  SIX.forEach(([f, label], i) => {
    const face = FACES[f], ox = 9 + i * 52, oy = 72
    const at = (x, y) => { const fk = face[y - 9]?.[x - 2]; return fk && fk !== "." ? fk : body[y]?.[x] ?? "." }
    for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) {
      let k = at(x, y)
      if (f === "glitch" && y >= 11 && y < 15) k = x === 3 ? "M" : x === 22 ? "v" : at(x - 2, y)   // the band slips
      if (f === "muede" && y === 5 && [5, 6, 17, 18].includes(x)) k = "e"                          // the ears' light low
      if (k !== ".") c.rect(ox + x * 2, oy + y * 2, 2, 2, k)
    }
    T(c, ox + 24, oy + 52, label, "h", { align: "center" })
  })
  hud(c, 8, 146, "IDLE: BLINZELN, OHREN WACKELN. NACH LANGER RUHE SCHLÄFT SIE EIN (ZZZ).", "6")
  hud(c, 8, 155, "AUF DEM DESKTOP UNTEN RECHTS; ZUM ZEIGEN LÄUFT SIE ZUM FENSTER.", "6")
  hud(c, 8, 164, "IHRE ZEILEN: MINZE #8EF5D8, IM STREIFEN UNTER DEM FENSTER NEBEN IHR.", "6")
}, ...SHEET.map(([f], i) => stamp(`evi_${f}`, 12 + i * 38, 28)))

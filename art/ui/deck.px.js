// The deck's own sprites (docs/kapitel0-design.md §2, mockup F: docs/mockups/mock_f_deck_*; style guide §8
// "The deck"): the apps' icons and EVI. The wallpaper is art/ui/deck_wallpaper.px.js.
//   deck_icon_<app>   24x24, ink outline: glas (a camera on its arm), chat (a speech bubble), cache (an index
//                     card behind a strip of film), buch (the Kassenbuch, a ledger in amber), konto (a stack of
//                     chits), netz (a wire globe), radio (a radio with its aerial), muell (the bin)
//   evi_<face>        EVI, 24x24: neutral, froh, neugierig, verwirrt, besorgt, muede, glitch, schlaf (asleep)
//   evi_idle          her idle: blinks now and then, her ears' lights twitch (a loop)
//   evi_hover         when the pointer is on her: she looks up, her ears perk up, her lights brighten
// Taken from the approved mockup (art/mockups/mock_f_deck.px.js), the same grids.
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

// ================================================================ the apps' icons
sprite("deck_icon_glas", { w: 24, h: 24, outline: "k" }, (c) => {           // a camera on its arm: the feeds
  c.rect(3, 15, 3, 7, "4"); c.rect(1, 20, 7, 3, "5")                    // the wall plate and the arm
  c.line(5, 15, 9, 12, "5"); c.line(5, 16, 9, 13, "4")
  c.rect(6, 4, 14, 9, "5"); c.rect(6, 4, 14, 1, "6"); c.rect(6, 12, 14, 1, "4")
  c.rect(4, 3, 18, 2, "4"); c.rect(4, 3, 18, 1, "6")                    // the hood
  c.ellipse(20, 8, 3, 3, "c"); c.ellipse(20, 8, 2, 2, "C"); c.px(19, 7, "V")
  c.px(9, 7, "v"); c.px(11, 7, "C")
})
sprite("deck_icon_chat", { w: 24, h: 24, outline: "k" }, (c) => {           // a speech bubble with three dots
  c.rect(2, 3, 20, 13, "5"); c.rect(3, 2, 18, 1, "5"); c.rect(3, 16, 18, 1, "5")
  c.rect(3, 3, 18, 1, "6"); c.rect(2, 15, 20, 1, "4")
  for (const [x, y] of [[5, 17], [5, 18], [6, 18], [5, 19], [4, 20]]) c.px(x, y, "5")
  for (const x of [7, 11, 15]) { c.rect(x, 8, 2, 2, "v"); c.px(x, 8, "V") }
})
sprite("deck_icon_cache", { w: 24, h: 24, outline: "k" }, (c) => {          // an index card behind a strip of film
  c.rect(6, 2, 15, 12, "6"); c.rect(6, 2, 15, 1, "V")
  for (let y = 5; y < 12; y += 3) c.rect(8, y, 10, 1, "4")
  c.rect(1, 12, 22, 10, "2"); c.rect(1, 12, 22, 1, "4")
  for (let x = 2; x < 22; x += 3) { c.px(x, 13, "5"); c.px(x, 20, "5") }
  c.rect(4, 15, 7, 4, "C"); c.rect(13, 15, 7, 4, "c"); c.px(4, 15, "v")
})
sprite("deck_icon_buch", { w: 24, h: 24, outline: "k" }, (c) => {           // the Kassenbuch: a ledger in amber
  c.rect(4, 2, 17, 20, "P"); c.rect(4, 2, 17, 1, "Q"); c.rect(4, 2, 3, 20, "O")
  c.rect(20, 3, 2, 18, "R"); for (let y = 4; y < 21; y += 2) c.px(21, y, "Q")
  c.rect(10, 7, 8, 5, "O"); c.rect(11, 8, 6, 3, "Q")                    // the label
  c.rect(9, 15, 9, 1, "O")
})
sprite("deck_icon_konto", { w: 24, h: 24, outline: "k" }, (c) => {          // a stack of chits
  for (const [y, k, K] of [[16, "4", "5"], [12, "5", "6"], [8, "C", "v"]]) { c.ellipse(12, y + 2, 9, 3, k); c.ellipse(12, y, 9, 3, K) }
  c.ellipse(12, 8, 6, 2, "C"); c.rect(10, 7, 5, 1, "V"); c.px(10, 8, "V"); c.rect(10, 9, 5, 1, "V")   // a C on the top chit
})
sprite("deck_icon_netz", { w: 24, h: 24, outline: "k" }, (c) => {           // the net: a wire globe
  c.ellipse(12, 12, 10, 10, "c"); c.ellipse(12, 12, 10, 10, "C", true)
  c.ellipse(12, 12, 4, 10, "C", true); c.rect(12, 2, 1, 21, "C")
  c.rect(2, 12, 21, 1, "v"); c.rect(4, 7, 17, 1, "C"); c.rect(4, 17, 17, 1, "C")
  c.px(8, 5, "V"); c.px(7, 6, "V")
})
sprite("deck_icon_radio", { w: 24, h: 24, outline: "k" }, (c) => {          // a radio with its aerial and the waves
  c.line(16, 2, 19, 8, "6"); c.rect(2, 9, 20, 13, "5"); c.rect(2, 9, 20, 1, "6"); c.rect(2, 21, 20, 1, "4")
  for (let y = 12; y < 20; y += 2) for (let x = 4; x < 12; x += 2) c.px(x, y, "2")
  c.rect(14, 12, 6, 3, "c"); c.px(16, 13, "v"); c.ellipse(17, 18, 2, 2, "4"); c.px(17, 18, "6")
  c.px(5, 4, "M"); c.px(6, 3, "M"); c.px(7, 3, "M"); c.px(4, 6, "m"); c.px(8, 6, "m")
})
sprite("deck_icon_muell", { w: 24, h: 24, outline: "k" }, (c) => {          // the bin, a letter crumpled in it
  c.rect(6, 3, 12, 2, "6"); c.rect(10, 1, 4, 2, "5")
  c.rect(4, 5, 16, 2, "5"); c.rect(4, 5, 16, 1, "6")
  for (let y = 7; y < 22; y++) { const d = (y - 7) >> 3; c.rect(5 + d, y, 14 - 2 * d, 1, "4") }
  for (const x of [8, 12, 16]) c.rect(x, 9, 1, 11, "3")
  c.rect(11, 2, 1, 1, "V")
})

// ================================================================ EVI
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
  ....kkEEEEEE
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


// her idle: open eyes most of the time, a blink, then the ears' lights flick (dim, bright)
const EVI_FACE_AT = (rows) => (c) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] !== ".") c.px(2 + x, 9 + y, r[x]) })
const EVI_BLINK = [
  "....................", "....................", "....................", "....................",
  "....kkkk....kkkk....", "....................", "....................", "....................",
  ".........kk.........", "...................."]
anim("evi_idle", { w: 24, h: 24, ms: [2600, 130, 1400, 160, 160] },
  frame(stamp("_evi_body", 0, 0), EVI_FACE_AT(NEUTRAL)),
  frame(stamp("_evi_body", 0, 0), EVI_FACE_AT(EVI_BLINK)),
  frame(stamp("_evi_body", 0, 0), EVI_FACE_AT(NEUTRAL)),
  frame(stamp("_evi_body", 0, 0), EVI_FACE_AT(NEUTRAL), (c) => { c.rect(3, 1, 2, 2, "h"); c.rect(19, 1, 2, 2, "h") }),
  frame(stamp("_evi_body", 0, 0), EVI_FACE_AT(NEUTRAL)))
// hovered: she bobs up a pixel, curious eyes, the ears' tips bright
anim("evi_hover", { w: 24, h: 25, ms: [180, 180] },
  frame(stamp("_evi_body", 0, 0), EVI_FACE_AT(FACES.neugierig), (c) => { c.rect(3, 1, 2, 2, "V"); c.rect(19, 1, 2, 2, "V") }),
  frame(stamp("_evi_body", 0, 1), (c) => FACES.neugierig.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] !== ".") c.px(2 + x, 10 + y, r[x]) }), (c) => { c.rect(3, 2, 2, 2, "h"); c.rect(19, 2, 2, 2, "h") }))

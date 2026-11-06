// The interface's own sprites (style guide §8 and §8a): what the engine draws over every room, in the
// Halcyon look instead of its built-in icons.
//
//   ui_cursor        the pointer: a pale cyan arrow with an ink outline, its tip at [5, 5]
//   ui_cursor_hot    over a hotspot: four corner brackets round the tip and a dot on it, pulsing (the
//                    implant's overlay), the same tip
//   ui_satchel       Juno's grey satchel (her sprite's greys), a magenta sticker, a cyan status light on
//                    the buckle that blinks
//   ui_evi           the hint button: EVI peeking out of a pocket, blinking now and then
//   ui_menu          the menu button (touch): a small terminal with three lines
//   ui_eye           the show-hotspots button (touch): an eye in scan brackets
//
// All hand grids (pxl SKILL: small shapes are grids). Both cursors have their point at [5, 5]
// (game/skin.js: cursorAnchor): the arrow is drawn there with its ink, the brackets (9x9, centre [4, 4])
// get their ink from `outline`, which grows them 1 px.

pal({
  k: "#0c0e1a",                                    // ink
  V: "#dafcff", v: "#62def0", C: "#1f88a4",        // screen cyan, pale to dark
  G: "#8e96a8", g: "#565e70", d: "#3a4050",        // the satchel's greys (art/characters/juno.px.js) and its shadow
  M: "#ff4fd3",                                    // magenta: the sticker
  h: "#8ef5d8", E: "#4fc9b0", p: "#ffa8d8",        // EVI: mint, its shade, her blush
})

// ---------------------------------------------------------------- the cursors
sprite("ui_cursor", `
  .............
  .............
  .............
  .............
  .............
  .....k.......
  .....kk......
  .....kVk.....
  .....kVVk....
  .....kVVVk...
  .....kVVVvk..
  .....kVVVVvk.
  .....kVVVkkkk
  .....kVkVvk..
  .....kk.kVk..
  ........kk...`)

anim("ui_cursor_hot", { w: 9, h: 9, outline: "k", ms: [320, 320] },
  frame(grid(0, 0, `
    VVV...VVV
    V.......V
    V.......V
    .........
    ....v....
    .........
    V.......V
    V.......V
    VVV...VVV`)),
  frame(grid(0, 0, `
    .........
    .VV...VV.
    .V.....V.
    .........
    ....V....
    .........
    .V.....V.
    .VV...VV.
    .........`)))

// ---------------------------------------------------------------- the satchel (16x14, as the engine's)
anim("ui_satchel", { w: 16, h: 14, ms: [1700, 300] },
  grid(0, 0, `
    ...kkkkkkkkkk...
    ..kgk......kgk..
    ..kgk......kgk..
    kkkkkkkkkkkkkkkk
    kGGGGGGGGGGGGGGk
    kGMMGGGGGGGGGGGk
    kgGGGGGGGGGGGGgk
    kggGGGGGGGGGGggk
    kdkkkkkvvkkkkkdk
    kddddddkkddddddk
    kggggggggggggggk
    kggggggggggggggk
    kdggggggggggggdk
    .kkkkkkkkkkkkkk.`),
  frame(),
  frame(grid(7, 8, "CC")))

// ---------------------------------------------------------------- EVI, the hint button (12x11)
anim("ui_evi", { w: 12, h: 11, ms: [2600, 140, 420, 120] },
  grid(0, 0, `
    .kk......kk.
    .kVk....kVk.
    ..kkhhhhkk..
    .khhhhhhhhk.
    khhkVhhkVhhk
    khhkkhhkkhhk
    kphhhkkhhhpk
    .kEhhhhhhEk.
    kkkkkkkkkkkk
    kGGGGGGGGGGk
    kggggggggggk`),
  frame(), frame(grid(2, 4, "hhhhhhhh")), frame(), frame(grid(2, 4, "hhhhhhhh")))

// ---------------------------------------------------------------- the touch buttons (12x11)
sprite("ui_menu", `
  ..kkkkkkkkkk
  .kvvvvvvvvvk
  kvkkkkkkkkvk
  kvkVVVVVVkvk
  kvkkkkkkkkvk
  kvkVVVVkkkvk
  kvkkkkkkkkvk
  kvkVVVVVkkvk
  kvkkkkkkkkvk
  kvvvvvvvvvk.
  kkkkkkkkkk..`)

sprite("ui_eye", { outline: "k" }, `
  VVV....VVV
  V........V
  V..kkkk..V
  ..kVVVVk..
  .kVVkkVVk.
  .kVVkkVVk.
  ..kVVVVk..
  V..kkkk..V
  V........V
  VVV....VVV`)

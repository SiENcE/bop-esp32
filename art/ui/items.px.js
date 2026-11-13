// The bag's items (style guide §8: icons "about 20x14" in the bar that slides up from the satchel): 18x13 hand
// grids, and the ink outline round them makes 20x15. Painted on the lines of the blocks the user chose
// (art/test/inventar_blocks.px.js, 2026-11-13: A for all but the hook, which is B). Light from the upper left;
// the colours keep their meanings (§5): cyan only on tech, magenta for Nagi·wa, amber for food and warmth,
// red only where the system says no (the void bar, the hook's warning band). Never yellow (Juno's alone).
//
//   inv_ausweis  the Nagi·wa card: magenta band with the ring, the photo, two lines, the red void bar
//   inv_haken    the lift's emergency key: a thin slanted rod, a ring for a grip, a red band, the end a crook
//   inv_stick    Ines' data stick: a key ring, her pink sticker, a cyan light, the plug
//   inv_tap      Ratz's tap: the box with its light and grille, two cables, a crocodile clip on each
//   inv_reis     Okonkwo's rice: a roll in kraft paper tied twice, a tear with rice in it, two batteries
//   inv_suppe    Bao's broth: the white bowl with its domed lid and knob, the amber band, a twist of steam
//
// One frame each (anims, as the engine's item icons are), no pivot: the bar draws them by their top left.
// The review sheets are in items_review.px.js.
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8aa2c4",
  L: "#c8d0dc", G: "#8e96a8", g: "#565e70", d: "#3a4050",                       // steel, light to dark (the satchel's greys)
  W: "#e8eef6", w: "#aab6c8", x: "#78849a",                                      // the card's cold white
  B: "#f0eee2", b: "#c0bcac", D: "#7e7a70", H: "#fffbf0",                        // the bowl's white, its shine
  n: "#3e1240", M: "#a8238a", m: "#ff4fd3", N: "#ffc0f2",                        // magenta: Nagi·wa
  O: "#552b1c", P: "#b0602a", Q: "#eea040", R: "#ffd58a",                        // amber
  T: "#c89a64", U: "#a07448", u: "#6e4a2e", e: "#e8c890", E: "#b0905e",          // kraft paper; the string
  c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",                        // screen cyan: tech
  r: "#7e1420", q: "#ff3a3a",                                                    // red: the system says no
  s: "#93583f", S: "#d79676", i: "#f0a0c0", I: "#a85878", j: "#ffd8e8",          // skin; Ines' pink
})

const INV_ICON = (name, rows) => anim(name, { w: 18, h: 13, frames: 1, fps: 1, outline: "k" }, grid(0, 0, rows))

// ---------------------------------------------------------------- the ID card
INV_ICON("inv_ausweis", `
  ..................
  .mmNmmmmmmmmmmmmm.
  mMNMNMMNNNNMNNMMMn
  mMMNMMMMMMMMMMMMMn
  WWWWWWWWWWWWWWWWWw
  W62226W5555W555WWw
  W22222WWWWWWWWWWWw
  W2SSs2W66666W666Ww
  W6SSs6WWWWWWWWWWWw
  W65s56WqqqqqqqqqWw
  W75554WrrrrrrrrrWw
  .wwwwwwwwwwwwwwxx.
  ..................`)

// ---------------------------------------------------------------- the lift's emergency key
INV_ICON("inv_haken", `
  ..................
  ..................
  ................L.
  ...............LgG
  .............LLg.G
  ...........LLgg..g
  .........LLgg...g.
  .......qqgg.......
  .LLG.LLrr.........
  L...Ggg...........
  L...g.............
  G...g.............
  .Ggg..............`)

// ---------------------------------------------------------------- Ines' data stick
INV_ICON("inv_stick", `
  ..................
  ..................
  ..................
  ..................
  ....6666666666....
  .LGG5jiii444v3LLLL
  .G.g5iiIi44443GdGd
  .Ggg5iIii44443GdGd
  ....5iiiI44443gggg
  ....3333333333....
  ..................
  ..................
  ..................`)

// ---------------------------------------------------------------- the tap (Abzweiger)
INV_ICON("inv_tap", `
  ..................
  .............LLLL.
  ............CgGgGg
  ..........CC.GGGG.
  6666665.CC........
  56v5443C..........
  5444443...........
  5434343...........
  5444443g..........
  3333333.gg..LLLL..
  ..........ggdGgGg.
  ............GGGG..
  ..................`)

// ---------------------------------------------------------------- Okonkwo's rice and batteries
INV_ICON("inv_reis", `
  ..................
  ..................
  ..TTTeTTTTeT......
  T.TTTeTTuTeT.U....
  TTUUUeuWWueUUU....
  UuuuuEuwWuEuuu....
  u.uuuEuuuuEu.u....
  ..OOOEOOOOEO.L..L.
  ............LGgLGg
  ............vCcLGg
  ............LGgvCc
  ............LGgLGg
  ............dggdgg`)

// ---------------------------------------------------------------- Bao's broth to go
INV_ICON("inv_suppe", `
  ........L.........
  .........G........
  ........G.........
  ........Bb........
  ......BHBBbb......
  ....BBHBBBBBbb....
  ..BBBBBBBBBBBbbb..
  .bBBbbbbbbbbbbbDD.
  ..QRQQQQQQQQQQPP..
  ..BBBBBBBBBBbbbD..
  ...BBBBBBBbbbbD...
  ....bbbbbbbbDD....
  ......DDDDDD......`)

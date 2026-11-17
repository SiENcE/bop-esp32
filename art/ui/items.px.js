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
// Chapter 2 (the blocks the user chose, art/test/inventar_k2_blocks.px.js, 2026-11-17: the radio B, the battery A, the output stage A):
//   inv_funkgeraet  the old radio from the boat, no power: straight on, rubber corners, a handle, the aerial at its side, the amber TX
//                   key, the screen dark
//   inv_funk        the same radio with Pike's battery in it: the screen lit green with his zigzag wave, a cyan light on
//   inv_akku        a battery from Pike's bank: a block with its poles (the red plus), a cyan charge bar
//   inv_endstufe    the output stage from a flood warning mast: a module with its cooling fins on top, a socket at its side, an amber band
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
  r: "#7e1420", q: "#ff3a3a",                                                    // red: the system says no (and a battery's plus pole)
  h: "#0e1a16", f: "#2a5a42", F: "#8acfae",                                      // the radio's screen: dark glass, lit, its wave
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

// ---------------------------------------------------------------- Chapter 2: the radio from the boat, without power and with it
const RADIO = `
  ..................
  ....gGGGGGGg......
  ....g......g...L..
  .22222222222222G2.
  .24444444444444G2.
  .23RQ3hhhhhdhh3G2.
  .23QP3hhhhdhhh3g2.
  .2333333333333332.
  .23663G3G33G3G332.
  .23663g3g33g3g332.
  .2333333333333332.
  .2222222222222222.
  ..................`
INV_ICON("inv_funkgeraet", RADIO)
// powered: the screen lit with his zigzag wave, a cyan light by the key
INV_ICON("inv_funk", `
  ..................
  ....gGGGGGGg......
  ....g......g...L..
  .22222222222222G2.
  .24444444444444G2.
  .23RQ3fFfffFff3G2.
  .23QP3FfFfFfFf3g2.
  .2v33333333333332.
  .23663G3G33G3G332.
  .23663g3g33g3g332.
  .2333333333333332.
  .2222222222222222.
  ..................`)

// ---------------------------------------------------------------- Pike's battery
INV_ICON("inv_akku", `
  ..................
  ..................
  ....q.......d.....
  ...rqr.....ddd....
  ..GLLLLLLLLLLLLG..
  ..LLLLLLLLLLLLLG..
  ..g44444444444Gg..
  ..g4CCCCvv4444Gg..
  ..g4cccccc4444Gg..
  ..g44444444444Gg..
  ..g44444444444Gg..
  ..gggggggggggggg..
  ..................`)

// ---------------------------------------------------------------- the output stage from the flood warning mast
INV_ICON("inv_endstufe", `
  ..................
  ..L.L.L.L.L.L.L...
  ..G.G.G.G.G.G.G...
  ..G.G.G.G.G.G.G...
  .GGGGGGGGGGGGGGG..
  .L66666666666664..
  .L6QRQRQRQ666664..
  .L66666666666v64GL
  .L66666666666664gG
  .L6555555666666gG.
  .L66666666666664..
  .444444444444444..
  ..................`)

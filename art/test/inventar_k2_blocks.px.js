// Chapter 2's things in the bag, which still wear the tap's icon (inv_tap), painted as icons two ways each for the user's choice
// before they go into art/ui/items.px.js: 18x13 and the ink outline round them, 20x15 as the bar draws them (style guide §8), as the
// Chapter 1 set (art/test/inventar_blocks.px.js). Light from the upper left; the colours keep their meanings (§5): cyan only on tech,
// amber for the radio's TX key (as on the radio close, art/rooms/sumpf.px.js), red only for a battery's plus pole. Never yellow.
//   funkgeraet  the old radio from the boat, no power (game/kapitel2_funk.js): its dark plastic, the amber TX key, the dark screen
//               A in three quarters, the aerial up at its top right (as the radio close)
//               B straight on, rubber corners, a carrying handle, the aerial at its side
//   funk        the same radio with Pike's battery in it: its screen lit green with the wave, a cyan light on (so it reads at a glance)
//   akku        a battery out of Pike's bank on the raft, heavy and still warm
//               A a block with its two poles (red plus, dark minus), a cyan charge bar
//               B three cells taped together, two leads out of them with clips
//   endstufe    the output stage out of a flood warning mast (game/kapitel2_lantern.js: "die mit den Kühlrippen")
//               A a module with its cooling fins on top, a socket at its side, an amber band
//               B a heat sink from the side, deep fins all along it, a round coax socket, the mast's hazard stripes
//   inventar_k2_blocks   the sheet: the four in a row, A over B (funk follows its radio), beside two of Chapter 1's for the look
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8aa2c4",
  L: "#c8d0dc", G: "#8e96a8", g: "#565e70", d: "#3a4050",                       // steel, light to dark (the satchel's greys)
  O: "#552b1c", P: "#b0602a", Q: "#eea040", R: "#ffd58a",                        // amber: the TX key, the hazard band
  c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",                        // screen cyan: tech
  h: "#0e1a16", f: "#2a5a42", F: "#8acfae",                                      // the radio's screen: dark glass, lit, its wave
  r: "#7e1420", q: "#ff3a3a",                                                    // a battery's plus pole
  t: "#4a4a40", T: "#6e6c5c",                                                    // gaffer tape
})
include("../lib/text.js")

const ICON = (/** @type {string} */ name, /** @type {string} */ rows) => sprite(name, { w: 18, h: 13, outline: "k" }, grid(0, 0, rows))

// ---------------------------------------------------------------- the radio, no power
const RADIO_A = `
  ..................
  .............L....
  .............G....
  .............G....
  .4444444444444G44.
  .4333333333333332.
  .43QQQ3hhhhhhh332.
  .43PPP3hhhhhhh332.
  .4333333333333332.
  .4363633G333G3332.
  .4363632g232g2332.
  .4333333333333332.
  ..22222222222222..`
const RADIO_B = `
  ..................
  ....gGGGGGGg......
  ....g......g...L..
  .11111111111111G1.
  .12222222222222G1.
  .12QQ2hhhhhhhh2G1.
  .12PP2hhhhhhhh2g1.
  .1222222222222221.
  .12662G2G22G2G221.
  .12662g2g22g2g221.
  .1222222222222221.
  .1111111111111111.
  ..................`
ICON("inv_funkgeraet_a", RADIO_A)
ICON("inv_funkgeraet_b", RADIO_B)
// powered: the screen lit with the wave (the zigzag, his) and a cyan light by the key
const lit = (/** @type {string} */ rows, /** @type {number[]} */ screenRows, /** @type {string[]} */ wave, /** @type {[number, number]} */ led) => {
  const r = rows.split("\n").map((l) => l.trim()).filter((l) => l.length)
  screenRows.forEach((y, j) => { r[y] = r[y].replace(/h+/, (m) => wave[j].slice(0, m.length).padEnd(m.length, "f")) })
  r[led[1]] = r[led[1]].slice(0, led[0]) + "v" + r[led[1]].slice(led[0] + 1)
  return r.join("\n")
}
ICON("inv_funk_a", lit(RADIO_A, [6, 7], ["fFfffFfffF", "FfFfFfFfFf"], [4, 8]))
ICON("inv_funk_b", lit(RADIO_B, [5, 6], ["fFfffFfffF", "FfFfFfFfFf"], [3, 7]))

// ---------------------------------------------------------------- the battery
ICON("inv_akku_a", `
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
ICON("inv_akku_b", `
  ..................
  ..LGg.LGg.LGg.....
  ..666.666.666.....
  ..5v4.5v4.5v4.....
  ..TTTTTTTTTTTq....
  ..ttttttttttr.qq..
  ..5v4.5v4.5v.....q
  ..TTTTTTTTTTTd....
  ..ttttttttttt.dd..
  ..544.544.544....d
  ..544.544.544.....
  ..333.333.333.....
  ..................`)

// ---------------------------------------------------------------- the output stage
ICON("inv_endstufe_a", `
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
ICON("inv_endstufe_b", `
  ..................
  .LLLLLLLLLLLLLLL..
  .L5L5L5L5L5L5L5g..
  .L5L5L5L5L5L5L5g..
  .L5L5L5L5L5L5L5g..
  .GGGGGGGGGGGGGGg..
  .QOQOQOQOQOQOQOg..
  .666666666666v6g..
  .6666GGG666666dg..
  .666GgdgG66666dgG.
  .6666GGG666666dgL.
  .gggggggggggggggg.
  ..................`)

// ---- the sheet: A over B, beside Chapter 1's stick and tap (built art) for the look
sprite("_ik_stick", { png: "../../build/art/ui/anims/inv_stick.png" })
sprite("_ik_tap", { png: "../../build/art/ui/anims/inv_tap.png" })
const COLS = [["FUNKGERÄT", "funkgeraet"], ["MIT AKKU", "funk"], ["AKKU", "akku"], ["ENDSTUFE", "endstufe"]]
scene("inventar_k2_blocks", { w: 212, h: 76, bg: "2" }, (c) => {
  COLS.forEach(([label, id], i) => {
    const x = 14 + i * 50
    TXT.draw(c, x + 10, 4, label, "6", { font: "hud", align: "center" })
    c.stamp(`inv_${id}_a`, x, 14); c.stamp(`inv_${id}_b`, x, 38)
  })
  TXT.draw(c, 4, 60, "A OBEN, B UNTEN. ZUM VERGLEICH:", "5", { font: "hud" })
  c.stamp("_ik_stick", 140, 56); c.stamp("_ik_tap", 170, 56)
})

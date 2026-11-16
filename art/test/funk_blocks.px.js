// Block for approval ("Auf Sendung", kapitel2-design §3.5): the old radio from the boat seen close, over the swamp dimmed, for the small
// game at it. Juno sets the channel (five; 87.6 is Lantern's) and the wave (four shapes) until her wave matches the one on the screen at
// his mast, then presses TX and speaks. Only clicks: each knob has an arrow either side; no time, no dragging. Its printing is the
// city's tech, English: CH, WAVE, TX. The display shows the channel and the wave as set; the game draws both (they change), the block
// shows one setting.
//   funk_blocks    320x180: the radio in the middle of the dimmed swamp, its parts as flat shapes
"use strict"
include("../lib/text.js")
pal({ k: "#0c0e1a", n: "#06080f", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8e9ab0",
  d: "#1c3a24", L: "#b0f0a0", y: "#7cff9a", o: "#e08840", O: "#a0561e" })

sprite("_fb_shot", { png: "../../build/shots/sumpf_1x.png" })
scene("funk_blocks", { w: 320, h: 180, bg: "k" }, (c) => {
  c.stamp("_fb_shot", 0, 0)
  for (let y = 0; y < 180; y++) for (let x = 0; x < 320; x++) if ((x + y) % 2 === 0) c.px(x, y, "n")      // the swamp dimmed behind
  // the radio's body: dark plastic, scuffed, an aerial, the mic grille
  const X = 70, Y = 34, W = 180, H = 112
  c.rect(X, Y, W, H, "2"); c.rect(X + 2, Y + 2, W - 4, H - 4, "3"); c.hline(X + 2, Y + 2, W - 4, "4")
  c.rect(X + W - 22, Y - 26, 4, 28, "5"); c.rect(X + W - 23, Y - 28, 6, 3, "6")
  for (let i = 0; i < 6; i++) c.hline(X + 12, Y + 66 + i * 5, 40, "1")
  // the display: the channel, the wave as set; its frame
  c.rect(X + 64, Y + 12, 104, 44, "k"); c.rect(X + 66, Y + 14, 100, 40, "d")
  TXT.draw(c, X + 70, Y + 17, "CH 87.6", "L", { font: "hud" })
  for (let x = 0; x < 92; x++) c.px(X + 70 + x, Y + 40 + Math.round(Math.sin(x * 0.35) * 6), "y")
  // the knobs: CH and WAVE, each with an arrow either side; TX, amber
  for (const [kx, label] of [[X + 70, "CH"], [X + 122, "WAVE"]]) {
    c.rect(kx - 2, Y + 70, 40, 22, "2"); c.rect(kx + 12, Y + 72, 12, 12, "5"); c.rect(kx + 14, Y + 74, 8, 8, "6")
    c.rect(kx, Y + 76, 6, 6, "4"); c.px(kx + 2, Y + 79, "7"); c.rect(kx + 30, Y + 76, 6, 6, "4"); c.px(kx + 33, Y + 79, "7")
    TXT.draw(c, kx + 8, Y + 86, label, "6", { font: "hud" })
  }
  c.rect(X + 12, Y + 14, 40, 22, "O"); c.rect(X + 14, Y + 16, 36, 18, "o"); TXT.draw(c, X + 25, Y + 21, "TX", "k", { font: "hud" })
})

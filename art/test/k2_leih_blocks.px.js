// Chapter 2's borrowed figures (kapitel2-design §10, §14): blocks for the user's approval before anything is painted. Each stands beside the
// painted figure it grows from, at that figure's size; flat tones, an ink edge, nothing shaded yet.
//   1  Teo on the roof on Monday (dach_sitzen, the picture `dach_heute`): grown up, from behind, sitting on the parapet at Juno's right as the
//      boy did in the old photo, his head tipped on to her shoulder (he falls asleep there). His painted look (art/characters/teo.px.js):
//      the full round back of his head, messy black hair, the ear defenders' band behind his neck, the gills on his neck glowing, the Lull
//      patch behind his LEFT ear (the oval disc, the user's rule), the orange work vest with its reflective stripe over the navy shirt.
//   2  Teo with the hook from the pump hall (the flat, Monday 18:30: "Mit dem hier."): his SE view holding a long steel boat hook upright
//      in his near hand, taller than him (2.2 m), its hook and spike at the top
//   3  the two of the Quiet at 4B in CAM 25 (W3, Sunday 20:00): their man B (art/characters/quiet.px.js) with a cardboard box held before
//      him (SE, NE), and one with Ines' computer, a tower case (SE): they carry her flat out
//   4  the neighbour in CAM 24 (W1, 19:30, taps the code): a feed figure of his own instead of CAM 03's commuter, beside that commuter for
//      the size. A: an older man in a flat cap and a long coat, a 24-hour shop's bag in his hand (the shop down his street); B: the same
//      under a dark umbrella
//   k2lb            the sheet with all four
//   k2lb_dach       Teo and Juno on the roof in the picture itself (1x and 3x in the shots)
"use strict"
include("../characters/teo.px.js")
include("../characters/quiet.px.js")
include("../characters/feed_people.px.js")
include("../ui/deck_wallpaper.px.js")
include("../lib/text.js")
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8e9ab0", 8: "#b9c6d8",
  // Teo: hair, nape, the vest and its shade, the stripe, the shirt, the band, the patch and its rim, the gills
  h: "#151a28", H: "#273048", s: "#93665c", O: "#ffa040", P: "#c07838", r: "#b8cce0", e: "#2f3e5a", g: "#4e5c78", L: "#dafcff", l: "#62def0", v: "#62def0",
  // the hook's steel; the box's cardboard and tape; the tower case
  m: "#8e96a8", M: "#c8d0dc", b: "#9c7048", B: "#c49a68", t: "#d8c8a0", c: "#22283a", C: "#3a4458",
  // the feed's phosphor (the neighbour): dark to light
  p: "#0e2a20", q: "#1e5a3e", Q: "#3e8a5e", w: "#8ae0a8", W: "#d8ffe6",
})

const g = (c, x, y, rows) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== ".") c.px(x + i, y + j, ch) }))

// ================================================================ 1  Teo from behind, sitting, his head on her shoulder
const TEO_BACK = [
  ".......kkkkkkk...............",
  ".....kkhhhhhhhkk.............",
  "....khhhhhHhhhhhk............",
  "...khhhhhhhhhHhhhk...........",
  "..khhhhhhhhhhhhhhk...........",
  "..khhhhhhhhhhhhhhhk..........",
  ".kLLhhhhhhhhhhhhhhk..........",
  ".klLLhhhhhhhhhhhhhk..........",
  ".kllLshhhhhhhhhhhk...........",
  "..klsssshhhhhhhhhk...........",
  "...ksssvsshhhhhssk...........",
  "....kssvssssssssskkk.........",
  "....kgggggggggggggggkk.......",
  "...keeeOOOOOOOOOOOOOOOkk.....",
  "..keeeOOOOOOOOOOOOOOOOOOk....",
  ".keeeOOOOOOOOOOOOOOOOOOOOk...",
  ".keeOOOOOOOOOOOOOOOOOOOOOPk..",
  "keeeOOOOOOOOOOOOOOOOOOOOOPek.",
  "keeeOOOOOOOOOOOOOOOOOOOOOPek.",
  "keeeOOOOOOOOOOOOOOOOOOOOOPeek",
  "keeerrrrrrrrrrrrrrrrrrrrrreek",
  "keeerrrrrrrrrrrrrrrrrrrrrreek",
  "keeeOOOOOOOOOOOOOOOOOOOOOPeek",
  "keeeOOOOOOOOOOOOOOOOOOOOOPeek",
  "keeeOOOOOOOOOOOOOOOOOOOOOPeek",
  "keeeOOOOOOOOOOOOOOOOOOOOOPeek",
  "keeeOOOOOOOOOOOOOOOOOOOOOPeek",
  "keeePPPPPPPPPPPPPPPPPPPPPPeek",
  "keeeeeeeeeeeeeeeeeeeeeeeeeeek",
  "keeeeeeeeeeeeeeeeeeeeeeeeeeek",
  "kkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
]
const teoBack = (c, x, y) => g(c, x, y, TEO_BACK)
// on the roof: dach_heute with Juno (art/ui/deck_wallpaper.px.js: JUNO_NOW at 197 - 105 = 92, 101), Teo at her right, the parapet's top at 136
scene("k2lb_dach", { w: 320, h: 180, bg: "k" }, stamp("dach_heute", 0, 0), (c) => teoBack(c, 109, 106))

// ================================================================ 2  Teo with the hook (his SE view, the hook in his near hand)
const HOOK = (c, x, y) => {
  // the pole: from the floor beside his boot up past his head, steel, its grip taped where his near hand holds it
  c.rect(x, y + 4, 2, 66, "k"); c.vline(x, y + 4, 66, "m"); c.vline(x + 1, y + 4, 66, "7")
  c.rect(x - 1, y + 34, 4, 6, "k"); c.rect(x, y + 35, 2, 4, "g")
  c.rect(x + 1, y + 36, 3, 3, "k"); c.rect(x + 2, y + 37, 2, 1, "s")                     // his hand round it
  // the head: the spike straight up, the hook curling back down off it
  g(c, x - 1, y - 6, ["..kk.....", "..kMk....", "..kMk....", "..kMkkk..", "..kMMMMk.", "..kMk.kMk", "..kMk..kk", "..kMk...."])
}
scene("k2lb_haken", { w: 40, h: 80, bg: "3" }, stamp("teo_idle_se", 20, 77), (c) => HOOK(c, 9, 7))

// ================================================================ 3  the Quiet with what they carry out
const BOX = (c, x, y, w, h) => { c.rect(x - 1, y - 1, w + 2, h + 2, "k"); c.rect(x, y, w, h, "b"); c.rect(x, y, w, 2, "B"); c.vline(x + (w >> 1), y, h, "t") }
const TOWER = (c, x, y) => { c.rect(x - 1, y - 1, 10, 17, "k"); c.rect(x, y, 8, 15, "C"); c.rect(x, y, 2, 15, "c"); c.px(x + 5, y + 3, "v"); c.hline(x + 3, y + 6, 4, "c") }
const ARMS_SE = (c, x, y) => { c.rect(x - 7, y, 4, 9, "k"); c.rect(x + 5, y, 4, 9, "k"); c.rect(x - 6, y + 1, 2, 7, "8"); c.rect(x + 6, y + 1, 2, 7, "8") }
scene("k2lb_quiet", { w: 110, h: 64, bg: "3" },
  stamp("quiet_b_idle_se", 14, 60), (c) => { ARMS_SE(c, 13, 22); BOX(c, 5, 25, 17, 12); c.rect(6, 31, 3, 3, "8"); c.rect(18, 31, 3, 3, "8") },
  stamp("quiet_b_idle_ne", 48, 60), (c) => { BOX(c, 37, 24, 3, 12); BOX(c, 56, 24, 3, 12) },
  stamp("quiet_b_idle_se", 84, 60), (c) => { ARMS_SE(c, 83, 22); TOWER(c, 80, 22); c.rect(77, 30, 3, 3, "8"); c.rect(88, 30, 3, 3, "8") })

// ================================================================ 4  the neighbour in CAM 24 (phosphor, the feed's size)
const NEIGHBOUR_A = [
  "...kkkk...",
  "..kQQQQk..",
  ".kQQQQQQk.",
  "..kwwwwk..",
  "..kwqwwk..",
  "..kqqqqk..",
  ".kqqqqqqk.",
  "kqqqqqqqqk",
  "kqqqqqqqqk",
  "kqqqqqqqqk",
  "kqqqqqqqqkk",
  "kqqqqqqqqkWk",
  "kqqqqqqqqkWWk",
  "kqqqqqqqqkWWk",
  "kqqqqqqqqkWWk",
  ".kqqqqqqk.kk.",
  ".kpk.kpk.....",
  ".kpk.kpk.....",
  ".kpk.kpk.....",
  ".kppk.kppk...",
  ".kkkk.kkkk...",
]
const UMBRELLA = ["....kkkkkkkk....", "..kkppppppppkk..", ".kppppppppppppk.", "kpppppppppppppppk", "kkkkkkkkkkkkkkkkk", "........k......."]
scene("k2lb_nachbar", { w: 60, h: 34, bg: "p" },
  stamp("commuter_b_feed", 8, 30),
  (c) => g(c, 20, 9, NEIGHBOUR_A),
  (c) => { g(c, 36, 9, NEIGHBOUR_A.map((r, j) => (j < 3 ? r.replace(/Q/g, "q") : r))); g(c, 31, 2, UMBRELLA); c.vline(39, 8, 3, "k") })

// ================================================================ the sheet
scene("k2lb", { w: 332, h: 290, bg: "2" },
  (c) => { for (const [x, y, t] of [[6, 2, "1 TEO AUF DEM DACH"], [6, 196, "2 TEO MIT HAKEN"], [66, 196, "3 QUIET: KISTE, RECHNER"], [200, 196, "4 NACHBAR CAM 24: ALT, A, B"]]) TXT.draw(c, x, y, t, "7", { font: "hud" }) },
  stamp("k2lb_dach", 6, 10), stamp("k2lb_haken", 6, 206), stamp("k2lb_quiet", 60, 214), stamp("k2lb_nachbar", 200, 222))

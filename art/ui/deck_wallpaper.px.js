// The deck's desktop wallpaper (docs/kapitel0-design.md §2.1, style guide §8 "The deck"): an old photo,
// Juno (14, already in the yellow slicker, hood up) and her little brother Teo (6), in 2074, from behind
// and a little above, sitting on the parapet of a flat roof in the Lower Ninth at night, in the rain,
// looking out over Nagi·wa. Over them the underside of the ring above (the Ninth never sees the sky), its
// rim lamps and the drip that is the Ninth's rain; ahead the towers, the big NAGI·WA screen of 2074
// ("RISE ABOVE", the sun the Ninth never sees), amber windows, a magenta NOODLES sign, the flooded streets'
// glow coming up through the smog. Teo leans his head on her shoulder, her arm round him; on the ledge
// beside him the noodle cup they shared, still steaming. A camera drone hovers by, watching them (its red eye).
//
// Exports two 320x180 anims, 24 frames at 100 ms (a 2.4 s seamless loop; frame 0 is the approved still).
// The kids stay still; around them: rain falling over everything down to the parapet, the cup's steam rising and curling,
// rings where the rain hits the canal, its reflections breaking up, the taxi's light trembling, the hood's
// reflection trembling in the puddle, the drone drifting and blinking, the NOODLES sign humming (its glow
// breathing, the D stuttering), the NAGI·WA screen's band rolling down and the sun's glow breathing, the
// spine's lifts climbing and its beacons, two lanes of far traffic in the smog, windows going on and off.
//   deck_photo       the photo at full strength (to judge the picture)
//   deck_wallpaper   the photo as the deck shows it: every colour taken down to a dark, faded tone (an old
//                    print), a vignette from the lens, the fold the print has from years in a box; nothing
//                    brighter than steel 5 #41547a but the dimmed hood, a few amber windows, the sign.
//                    The mockup (art/mockups/mock_f_deck.px.js) stamps it into stills: frame 0.
//   dach_bg, dach_heute   the same roof twenty years on, the same loop (built into assets/mock.js for now): the
//                    rooms dach and dach_sitzen, whose rain is this one, so they carry no rain fx of their own. It
//                    ends at the parapet's top: the parapet and the tar before it have no rain and no puddles.
//                    The Rain Reader's own length of gutter on a pole stands before the parapet (story §10c), its
//                    drip falling where her bucket is (her actor stands at game/places.js, dach.reader).
//                    dach_heute looks further right, over more city: the left tower and her place are out of the picture.
//
// Palette keys: the world palette (style guide §5: k, steel 1-6, wet e f z Z X, magenta n M m N, warm
// O P Q R W, cyan c C v V, red r q, Juno's j y Y, skin s S) plus the smog lit from below (A B D G);
// the dimmed print's own keys: steel a b d g h i l, magenta o p, amber t u, yellow w x U, cyan H I, red L K.
// Included by art/mockups/mock_f_deck.px.js; its helpers live in the block below (one shared JS scope).
include("../lib/kanji.js")
pal({
  k: "#0c0e1a",
  1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  e: "#0f151f", f: "#151d2b", z: "#1c2738", Z: "#253349", X: "#32445f",
  n: "#3e1240", M: "#a8238a", m: "#ff4fd3", N: "#ffc0f2",
  O: "#552b1c", P: "#b0602a", Q: "#eea040", R: "#ffd58a", W: "#fff4d8",
  c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",
  r: "#7e1420", q: "#ff3a3a",
  j: "#9a7406", y: "#eec414", Y: "#fff070",
  s: "#93583f", S: "#d79676",
  A: "#1b1a33", B: "#261d3e", D: "#35214c", G: "#47275a",                               // smog, lit from below
  T: "#36201a", F: "#a85a2c",                                                            // Teo's hoodie: its shade, its lit side
  // the dimmed print
  a: "#0a0d17", b: "#0f1524", d: "#141c2e", g: "#1a2337", h: "#232f47", i: "#2f3e5a", l: "#41547a",
  o: "#26102c", p: "#4e1848", t: "#33211a", u: "#6a4220", w: "#5c4608", x: "#9a7406", U: "#b08c18",
  H: "#0f2834", I: "#17414f", L: "#4a1420", K: "#2a0e16",
})

{
  const W = 320, H = 180, SEAT = 136                     // SEAT: the parapet's top, where they sit
  // dach_sitzen looks further right than the rest (kapitel1-design, "Die Stadt"): from x 105, past the left tower and the Rain Reader's place, over a city that goes on to WIDE
  const WIDE = 425, SIT_FROM = 105
  const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
  const bay = (x, y) => (BAY[(y & 3) * 4 + (x & 3)] + 0.5) / 16
  const hash = (a, b) => { let h = (a * 374761393 + b * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
  const SMOG = "1ABDG"                                    // the air, dark under the ring to lit above the streets
  const rim = (x) => 21 + Math.round(((x - 215) / 160) ** 2 * 7)   // the ring's rim, curving away to the left
  const tone = (ramp, t, x, y) => { t = Math.max(0, Math.min(ramp.length - 1, t)); const b = Math.floor(t), f = t - b; return ramp[Math.min(ramp.length - 1, b + (bay(x, y) < f ? 1 : 0))] }

  // ---------------------------------------------------------------- the pen
  // The photo is painted into a buffer of this file's own keys, then put on the canvas: deck_photo as it
  // is, deck_wallpaper through the dimming. (Painting on pxl's canvas and reading it back with c.key()
  // answers in the palette of whichever file includes this one, so the mockup's copy came out different.)
  // Its grid() draws a hand grid with an ink outline round it, as a stamped sprite with outline: "k" does.
  const GLYPHS = { H: "101101111101101", A: "010101111101101", L: "100100100100111", C: "011100100100011", Y: "101101010010010",
    O: "111101101101111", N: "110101101101101", D: "110101101101110", E: "111100110100111", S: "011100010001110",
    B: "110101110101110", T: "111010010010010", R: "110101110101101", P: "110101110100100",
    G: "011100101101011", I: "111010010010111", W: "101101111111101" }
  const pen = (w = W) => {
    const buf = Array.from({ length: H }, () => new Array(w).fill("1"))
    const p = {
      buf, w,
      px(x, y, k) { x = Math.round(x); y = Math.round(y); if (k && x >= 0 && y >= 0 && x < w && y < H) buf[y][x] = k },
      rect(x, y, w, h, k) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) p.px(x + i, y + j, k) },
      key(x, y) { x = Math.round(x); y = Math.round(y); return x >= 0 && y >= 0 && x < w && y < H ? buf[y][x] : undefined },
      text(x, y, str, k) { [...str].forEach((ch, n) => { const g = GLYPHS[ch]; if (g) for (let i = 0; i < 15; i++) if (g[i] === "1") p.px(x + n * 4 + (i % 3), y + Math.floor(i / 3), k) }) },
      grid(str, x, y) {
        const rows = str.split("\n").map((r) => r.trim()).filter((r) => r), on = (i, j) => rows[j] && rows[j][i] && rows[j][i] !== "."
        for (let j = -1; j <= rows.length; j++) for (let i = -1; i <= Math.max(...rows.map((r) => r.length)); i++) {
          if (on(i, j)) p.px(x + 1 + i, y + 1 + j, rows[j][i])
          else if (on(i - 1, j) || on(i + 1, j) || on(i, j - 1) || on(i, j + 1)) p.px(x + 1 + i, y + 1 + j, "k")
        }
      },
    }
    return p
  }

  // ---------------------------------------------------------------- the kids (hand grids, ink outline)
  // Juno: the hood with its seam, the hood's edge shading the shoulders, the slicker spread on the ledge.
  // Lit from the screen up left and the glow ahead: a rim on the top and left, the side by Teo in shade.
  const JUNO = `
    ........YYYYY............
    ......YYYyyyyy...........
    .....YYyyyyjyyyy.........
    ....YYyyyyyjyyyyj........
    ....Yyyyyyyjyyyyyj.......
    ...YYyyyyyyjyyyyyj.......
    ...Yyyyyyyyjyyyyyjj......
    ...Yyyyyyyyjyyyyyjj......
    ...Yyyyyyyyjyyyyyjj......
    ...yyyyyyyyjyyyyyjj......
    ...yyyyyyyyjyyyyyjj......
    ...jyyyyyyyyyyyyjjj......
    ....jyyyyyyyyyyjjj.......
    ...YjjjyyyyyyyjjjjY......
    ..YYyyjjjjjjjjjjjyyY.....
    .YYyyyyyyyyyyyyyyyyyj....
    .Yyyyyyyyyyyyyyyyyyyyj...
    Yyyyyyyyyyyyyyyyyyyyyyj..
    Yyyyyyyyyyyyyyyyyyyyyyj..
    yyyyyyyyyyyjyyyyyyyyyyjj.
    yyyyyyyyyyyjyyyyyyyyyyjj.
    yyyyyjyyyyyjyyyyyjyyyyjj.
    yyyyyjyyyyyjyyyyyjyyyyjjj
    yyyyjyyyyyyjyyyyyjyyyyjjj
    yyyyjyyyyyyjyyyyyyjyyyjjj
    yyyjyyyyyyyjyyyyyyjyyjjjj
    yyyjyyyyyyyjyyyyyyyjyjjjj
    yyjyyyyyyyyjyyyyyyyjjjjjj
    jyjyyyyyyyyjyyyyyyyyjjjjj
    jjyyyyyyyyyjyyyyyyyyjjjjj
    jjjjjjjjjjjjjjjjjjjjjjjjj`
  // Juno today: 31, taller and wider than the girl above, the same hood with its seam, the satchel's strap across her back and
  // the bag at her hip, sitting a little to the left of where she sat, with the room for him beside her empty.
  const JUNO_NOW = `
    .........YYYYYY...........
    .......YYYyyyyyyy.........
    ......YYyyyyjyyyyyj.......
    .....YYyyyyyjyyyyyjj......
    .....Yyyyyyyjyyyyyyj......
    ....YYyyyyyyjyyyyyyjj.....
    ....Yyyyyyyyjyyyyyyjj.....
    ....Yyyyyyyyjyyyyyyjj.....
    ....Yyyyyyyyjyyyyyyjj.....
    ....yyyyyyyyjyyyyyyjj.....
    ....yyyyyyyyjyyyyyyjj.....
    ....jyyyyyyyyyyyyyjjj.....
    .....jyyyyyyyyyyyjjj......
    ....YjjjyyyyyyyyjjjjY.....
    ..YYYyyjjjjjjjjjjjyyyYY...
    .YYyyyyyyyyyyyyyyyyyyyjjj.
    .Yy3yyyyyyyyyyyyyyyyyyyjj.
    YYyy3yyyyyyyyyyyyyyyyyyyjj
    Yyyyy3yyyyyyyyyyyyyyyyyyjj
    Yyyyyy3yyyyyjyyyyyyyyyyyjj
    Yyyyyyy3yyyyjyyyyyyyyyyyjj
    yyyyyyyy3yyyjyyyyyyyyyyyjj
    yyyyyjyyy3yyjyyyyyyyjyyyjj
    yyyyyjyyyy3yjyyyyyyyjyyyjj
    yyyyjyyyyyy3jyyyyyyyjyyyjj
    yyyyjyyyyyyj3yyyyyyyyjyyjj
    yyyjyyyyyyyjy3yyyyyyyjyyjj
    yyyjyyyyyyyjyy3yyyyyyjyjjj
    yyjyyyyyyyyjyyy3yyyyyyjjjj
    yyjyyyyyyyyjyyyy3k66665jjj
    jyjyyyyyyyyjyyyyyk555554jj
    jyyyyyyyyyyjyyyyyk544444jj
    jjyyyyyyyyyjyyyyyk544444jj
    jjyyyyyyyyyjyyyyyk544444jj
    jjjjjjjjjjjjjjjjjk444444jj`
  // Teo: tousled hair lit on top, his right ear, the nape, his hoodie's hood bunched at the neck (rust, the
  // orange he will wear at the pumps), the blinker kids wear so they're found (cyan). His head tipped onto
  // her shoulder.
  const TEO = `
    ...1222221.........
    ..122454221........
    .11234554221.......
    111222332221M......
    111122222112M......
    1111112111111M.....
    111111111111s......
    111111111111ss.....
    .1111111111n.......
    ..111111111n.......
    ...11111111........
    ....11sssFFFF......
    .....sFFFFFFFOO....
    ....FFFFOOOOOOOO...
    ...FFOOOOOOOOOOOO..
    ..FOOOOOOOOOOOOOOT.
    .FOOOOOOOOOOOOOOOTT
    .FOOOOOOOOOOOOOOOTT
    .OOOOOOOOTOOOOOOOTT
    .OOOOOOOOTOOOOOOTT.
    .OOOOvOOOTOOOOOOOTT
    .OOOOOOOTOOOOOOOOTT
    .TOOOOOOTOOOOOOOOTT
    .TOOOOOTOOOOOOOOTTT
    .TTOOOOTOOOOOOOTTTT
    .TTTTTTTTTTTTTTTTTT`
  // her right arm round him, over his shoulders, the hand cupping the far one
  const ARM = `
    yYYYYYYYYYYYY....
    yyyyyyyyyyyyyYY..
    jyyyyyyyyyyyyyySS
    .jjjjjjjjjjjjjSSs
    ..............sS.`
  // the noodle cup on the ledge, the chopsticks in it
  const CUP = `
    ......P
    .....P.
    ..P.P..
    ...P...
    WWWWWW.
    6WWWW6.
    MMmMMM.
    6WWWW6.
    .6666..`
  // the camera drone, looking at them: its red eye
  const CAM = `
    .2444443
    q3555554
    .2333332
    ....22..
    .....2..`

  // ---------------------------------------------------------------- the photo
  // Seen from high up: the horizon above the kids' heads, the far towers standing in the lit smog, the
  // city below in three bands of roofs, a canal street running away from the roof to the horizon, its
  // water glowing behind the two of them.
  const HZ = 80, VX = 226                                // the horizon, where the canal vanishes
  const bankL = (y) => VX - (y - HZ) * 0.7, bankR = (y) => VX + (y - HZ) * 0.95
  const CANAL0 = HZ + 7                                  // where a far block hides the canal's end
  const inCanal = (x, y) => y > CANAL0 && x >= bankL(y) && x <= bankR(y)
  // the smog: dark under the ring, lit from the streets toward the horizon, most over the canal
  const smog = (x, y) => Math.min(1, Math.max(0, (y - 22) / (HZ - 22)) ** 1.5 * 0.92 + 0.16 * Math.exp(-(((x - VX) / 50) ** 2)) * Math.max(0, Math.min(1, (y - 40) / 40)))
  /** a band of blocks along the ground: [x0, x1, top] from a seed, between tops t0..t1 */
  const blocks = (seed, t0, t1, w0, w1) => { const out = []; for (let x = -6, i = 0; x < WIDE + 6; i++) { const w = w0 + Math.floor(hash(seed, i) * (w1 - w0)); out.push([x, x + w, t0 + Math.floor(hash(i, seed) * (t1 - t0))]); x += w } return out }

  // The loop: 24 frames of 100 ms. Everything that moves is a function of the frame f alone, and every
  // period divides 24 (or moves 24 px, or a whole wrap, per loop), so frame 23 runs on into frame 0.
  const FRAMES = 24, TAU = Math.PI * 2
  const wave = (f, period, phase = 0) => Math.sin(TAU * (f / period + phase))
  const during = (f, on, off) => (on <= off ? f >= on && f < off : f >= on || f < off)      // a window of the loop, wrapping
  const FAR3 = blocks(3, 62, 76, 6, 13)
  const farTop = (x) => (FAR3.find(([a, b]) => x >= a && x < b) ?? [0, 0, 999])[2]

  // today: the same roof twenty years on (kapitel1-design, "Die Stadt"): the screen says something else, the sign has lost two
  // letters, the city has more screens in it, and who sits on the ledge is `sitting` (false: nobody)
  function paint(c, f, today = false, sitting = false) {
    const lit = { k: "1", 1: "2", 2: "3", 3: "4", 4: "5", 5: "6", A: "B", B: "D", D: "G", G: "4", e: "f", f: "z", z: "Z", Z: "X", c: "C", C: "v", v: "V", n: "M", M: "m", m: "N", O: "P", P: "Q", Q: "R" }
    const air = (x, y) => tone(SMOG, smog(x, y) * 4, x, y), nearR = c.w - 22                // the near tower on the right stands at the picture's edge

    for (let y = 0; y < SEAT; y++) for (let x = 0; x < c.w; x++) c.px(x, y, air(x, y))
    // far traffic: two lanes of lights in the smog, one coming, one going, 1 px a frame; the towers drawn
    // after them hide them, so they are only seen gliding through the gaps
    for (const [y, dir, offs, k] of [[67, -1, [0, 9], "R"], [71, 1, [5, 17], "r"]]) for (const o of offs) for (let n = -1; n < 14; n++) {
      const x = 96 + ((o + dir * f) % 24 + 24) % 24 + n * 24
      if (x >= 96 && x < nearR) { c.px(x, y, k); if (k === "R") c.px(x + 1, y, "O") }
    }
    // the far towers, standing in the smog: a shade darker than the air, their feet lost in it
    const far = [[96, 106, 44], [164, 174, 50], [198, 208, 56], [210, 222, 40], [222, 230, 62], [244, 254, 54], [256, 270, 42], [270, 278, 58], [6, 18, 48], [60, 72, 52],
      ...(sitting ? [[286, 298, 48], [302, 310, 60], [318, 332, 38], [336, 344, 56], [376, 386, 46], [392, 402, 62]] : [])]
    for (const [x0, x1, top] of [...FAR3, ...far]) for (let y = top; y < HZ + 4; y++) for (let x = x0; x < x1; x++)
      c.px(x, y, tone(SMOG, smog(x, y) * 4 - 1.2 + Math.max(0, y - HZ + 10) * 0.05, x, y))
    for (const [x0, x1, top] of far) for (let y = top + 3; y < HZ - 2; y += 3) for (let x = x0 + 1; x < x1 - 1; x += 2) if (hash(x * 7, y) < 0.06) c.px(x, y, "O")
    // windows on the left going on and off over the evening (each once a loop), one tube failing
    for (const [x, y, on, off] of [[9, 57, 4, 16], [14, 66, 10, 22], [64, 58, 18, 6], [68, 70, 0, 12], [30, farTop(30) + 4, 14, 2], [46, farTop(46) + 3, 7, 19]])
      if (during(f, on, off)) c.px(x, y, "P")
    if ("111111101101111111111001"[f] === "1") c.px(11, 75, "Q")
    // the transit axis, the city's spine going up into the ring: its lifts climbing, 1 px a frame, and its
    // beacons in their own rhythms (the red one twice a loop, the cyan one once, slowly)
    for (let y = 0; y < HZ + 2; y++) for (let x = 180; x < 194; x++) c.px(x, y, tone(SMOG, smog(x, y) * 4 - (x < 182 ? 0.7 : 1.5), x, y))
    for (let y = 26; y < HZ; y += 5) c.px(187, y, "c")
    for (let n = -2; n < 3; n++) { const y = 74 - f + 24 * n; if (y >= 26 && y <= 76) { c.px(187, y, "v"); c.px(187, y + 1, "v") } }
    { const r = f % 12; if (r < 3) c.px(181, 30, "q"); else if (r === 3) c.px(181, 30, "r") }
    { const k = during(f, 14, 20) ? "v" : f === 13 || f === 20 ? "C" : null; if (k) c.px(192, 50, k) }

    // the NAGI·WA tower and its screen: the sun rising over the water, the city's promise in 2074
    c.rect(104, 28, 64, HZ + 10 - 28, "2"); c.rect(164, 28, 4, HZ + 10 - 28, "1"); c.rect(104, 28, 60, 1, "3")
    for (let y = 68; y < HZ + 10; y += 3) for (let x = 106; x < 163; x += 3) if (hash(x, y * 3) < 0.08) c.px(x, y, hash(y, x) < 0.7 ? "P" : "c")
    if (during(f, 6, 17)) c.px(118, 71, "P"); if (during(f, 15, 3)) c.px(148, 74, "P")
    // the screen: a brighter band rolling down it (one pass a loop), the sun's glow breathing, the sea's
    // lines shimmering (their gaps drift 1 px every 2 frames)
    c.rect(110, 33, 50, 31, "1")
    for (let y = 35; y < 62; y++) for (let x = 112; x < 158; x++) c.px(x, y, y < 50 ? ((x + y) % 4 ? "c" : "C") : (y & 1 ? "c" : "C"))
    { const rb = 35 + Math.floor(f * 27 / FRAMES); for (let x = 112; x < 158; x++) { c.px(x, rb, "C"); if (rb > 35 && x % 2) c.px(x, rb - 1, "C") } }
    // the city's name: in 2074 its two characters (the original mark), today NAGI·WA (pxl's own letters have no middle dot: it is set by hand)
    if (today) { c.text(122, 37, "NAGI", "V"); c.px(138, 39, "V"); c.text(140, 37, "WA", "V") } else KANJI.draw(c, 121, 33, "V")
    if (today) { c.text(125, 44, "SLEEP", "V"); c.text(123, 50, "BETTER", "V") }
    const glow = 0.5 + 0.5 * wave(f, FRAMES)
    if (!today) for (let y = 43; y < 55; y++) for (let x = 123; x < 148; x++) {
      const d = (x - 135) ** 2 + (y - 55) ** 2
      if (d <= 81) c.px(x, y, d <= 33 + glow * 8 ? "V" : "v")
      else if (d <= 90 + glow * 30 && bay(x, y) < 0.3 + glow * 0.4) c.px(x, y, "C")
    }
    for (const [y, a, b] of [[55, 118, 152], [57, 123, 147], [59, 128, 142]]) for (let x = a; x < b; x++) c.px(x, y, (x + y + Math.floor(f / 2)) % 6 ? "v" : "C")
    for (let y = 26; y < 70; y++) for (let x = 100; x < 172; x++) {   // its light on the tower round it
      const d = Math.max(110 - x, x - 159, 33 - y, y - 63)
      if (d > 0 && d < 5 && c.key(x, y) === "2" && bay(x, y) < 0.7 - d * 0.15) c.px(x, y, "c")
    }

    // the city below: three bands of roofs, far to near, each darker, its streets lit at its foot;
    // the canal cuts through them
    const bands = [[11, HZ - 1, HZ + 6, 5, 11, "A", "D"], [12, HZ + 6, HZ + 16, 7, 16, "2", "B"], [13, HZ + 16, HZ + 30, 9, 20, "1", "2"]]
    for (const [seed, t0, t1, w0, w1, body, foot] of bands) {
      for (const [x0, x1, top] of blocks(seed, t0, t1, w0, w1)) {
        for (let y = top; y < SEAT; y++) for (let x = x0; x < x1; x++) if (!inCanal(x, y)) c.px(x, y, y > top + 7 && bay(x, y) < (y - top - 7) / 6 ? foot : body)
        for (let x = x0 + 1; x < x1 - 1; x++) if (!inCanal(x, top)) c.px(x, top, lit[body] ?? body)     // the roof's edge
        for (let y = top + 2; y < top + 9; y += 3) for (let x = x0 + 1; x < x1 - 1; x += 2) if (!inCanal(x, y) && hash(x, y * 11) < (body === "1" ? 0.09 : 0.06)) c.px(x, y, hash(y, x * 5) < 0.75 ? "P" : "Q")
        if (hash(seed, x0) < 0.3 && !inCanal(x0 + 3, top - 2)) { c.rect(x0 + 2, top - 3, 3, 3, body); c.px(x0 + 3, top - 4, body) }  // a water tank, a vent
      }
    }

    // the canal street: the house fronts down both sides (their windows, the signs hung over the water),
    // the water between them dark but for the smog at its far end, the signs' streaks and the rain's rings
    for (let y = CANAL0 + 1; y < SEAT; y++) {
      const l = bankL(y), r = bankR(y)
      for (let x = Math.ceil(l); x < r; x++) c.px(x, y, tone("1AB", 2.2 - ((y - CANAL0) / (SEAT - CANAL0)) ** 0.7 * 2.2, 0, y))
      for (let x = Math.ceil(l); x < r; x++) if (hash(x >> 2, y * 3) < 0.05) c.px(x, y, lit[c.key(x, y)])    // the water's slow swell
      c.px(Math.round(l), y, "3"); c.px(Math.round(r), y, "2")                                              // the quays' wet edges
    }
    // rings where the rain hits: one new each frame, widening for 4 frames and gone
    for (let i = 0; i < FRAMES; i++) {
      const a = (f - i + FRAMES) % FRAMES; if (a > 3) continue
      const y = CANAL0 + 3 + Math.floor(hash(i, 41) * (SEAT - CANAL0 - 4)), x = Math.round(bankL(y) + 2 + hash(i, 42) * (bankR(y) - bankL(y) - 4))
      if (a === 0) c.px(x, y, lit[c.key(x, y)]); else for (const dx of [-a, a]) c.px(x + dx, y, a < 3 ? lit[c.key(x + dx, y)] : c.key(x + dx, y) === "1" ? "A" : c.key(x + dx, y))
    }
    const shimmer = Math.floor(f / 3) * 101                                                                     // the reflections break up anew every 3 frames
    for (let x = Math.floor(bankL(HZ + 21)) + 2; x < bankR(HZ + 21); x += 5)                                  // the bridge's lamps in the water
      for (let y = HZ + 25; y < HZ + 25 + 16; y++) if (hash(x, y + shimmer) < 0.8 - (y - HZ - 25) * 0.04) c.px(x, y, y < HZ + 31 ? "P" : "O")
    // the fronts stand on the banks: verticals stay vertical, their roofs and floors run to the vanishing
    // point; the left ones lit by the water, the right ones in shade
    for (const [x0, x1, side] of [[Math.floor(bankL(SEAT)), VX, -0.7], [VX, Math.ceil(bankR(SEAT)), 0.95]]) for (let x = x0; x <= x1; x++) {
      const yb = HZ + (x - VX) / side, h = (yb - HZ) * 0.45, top = Math.round(yb - h), left = side < 0
      if (yb <= CANAL0 + 1) continue
      for (let y = top; y < Math.min(SEAT, Math.round(yb)); y++) c.px(x, y, left ? "2" : "1")
      c.px(x, top, left ? "3" : "2")                                                                        // the roof's edge
      const sp = Math.max(2, Math.round((yb - HZ) / 6))
      if (x % sp === 0) for (const f of [0.2, 0.4, 0.6, 0.8]) { const y = Math.round(yb - h * f); if (y < SEAT && hash(x, Math.round(f * 10)) < 0.55) c.px(x, y, hash(f * 10, x) < (left ? 0.6 : 0.3) ? "Q" : "P") }
    }
    const signs = [[0.14, 0, "m", "M"], [0.18, 1, "Q", "P"], [0.24, 1, "m", "M"], [0.27, 0, "v", "C"], [0.34, 1, "m", "M"], [0.4, 0, "m", "M"], [0.46, 1, "Q", "P"], [0.52, 0, "Q", "P"], [0.58, 1, "v", "C"], [0.7, 1, "m", "M"], [0.82, 1, "Q", "P"], [0.93, 0, "m", "M"]]
    for (const [t, right, k, kd] of signs) {
      const y = Math.round(HZ + t * 56), s = Math.max(1, Math.round(t * 4)), x = Math.round(right ? bankR(y) - 1 : bankL(y) - s + 1)
      c.rect(x, y - s * 2, s, s * 2, k); c.rect(x, y - s * 2, s, 1, kd)
      for (let d = 2; d < s * 6 + 3; d++) if (y + d < SEAT && hash(x, y + d + shimmer) < 0.75 - d / (s * 10 + 4)) c.rect(x, y + d, s, 1, d < s * 3 ? kd : "n")   // its streak in the water
    }
    // a footbridge over the canal, its lamps; a water taxi waiting in it, its lamp's light trembling on the
    // water, its wake running back from it
    { const y = HZ + 21; for (let x = Math.floor(bankL(y)) - 1; x <= bankR(y) + 1; x++) { c.px(x, y, "2"); c.px(x, y + 1, "k"); c.px(x, y + 3, "A") } for (let x = Math.floor(bankL(y)) + 2; x < bankR(y); x += 5) c.px(x, y - 1, "R") }
    { const x = 229, y = 95; c.rect(x, y, 4, 1, "k"); c.px(x + 1, y - 1, "2"); c.px(x + 1, y + 1, "R"); c.px(x + 1, y + 2, f % 6 < 3 ? "P" : "O"); if (f % 4 < 2) c.px(x + 2, y + 3, "O")
      for (let d = 1; d < 6; d++) if ((d + Math.floor(f / 3)) % 3) { c.px(x - d, y + 1 + d, "D"); c.px(x + 3 + d, y + 1 + d, "D") } }

    // the near tower on the left, its balconies, the NOODLES sign and its light on the wall
    c.rect(76, 0, 28, SEAT, "1"); c.rect(76, 0, 2, SEAT, "2")
    for (let y = 30; y < SEAT; y += 9) { c.rect(78, y, 18, 1, "2"); c.rect(78, y + 1, 18, 1, "k") }
    for (const [x, y] of [[81, 33], [86, 60], [80, 87], [85, 114]]) { c.rect(x, y, 3, 2, "P"); c.px(x, y, "Q") }
    // the sign hums: its glow on the wall breathes once a loop, and the D's tube stutters (dark for a
    // frame, back, dark for two), the glow dipping with it
    const stutter = f === 9 || f === 11 || f === 12
    const breath = (0.9 + 0.1 * wave(f, FRAMES)) * (stutter ? 0.8 : 1)
    for (let y = 40; y < 112; y++) for (let x = 90; x < 104; x++) {
      const d = Math.max(96 - x, 50 - y, y - 104)
      if (d > 0 && d < 6 && "12k".includes(c.key(x, y)) && bay(x, y) < (0.75 - d * 0.13) * breath) c.px(x, y, "n")
    }
    c.rect(96, 49, 9, 57, "n"); c.rect(96, 49, 9, 1, "M"); c.rect(96, 105, 9, 1, "M"); c.rect(104, 49, 1, 57, "k")
    "NOODLES".split("").forEach((ch, i) => c.text(99, 52 + i * 7, ch, today && (i === 1 || i === 2) ? "n" : i === 3 && stutter ? "M" : "m"))
    // further on, only in the wider look from the ledge: a block with a sign of its own, selling what the screen sells, the city's own English
    if (sitting) {
      c.rect(346, 44, 26, SEAT - 44, "1"); c.rect(346, 44, 2, SEAT - 44, "2"); c.rect(346, 44, 26, 1, "3")
      for (let y = 52; y < SEAT; y += 7) for (let x = 349; x < 358; x += 2) if (hash(x * 3, y) < 0.22) c.px(x, y, hash(y, x) < 0.75 ? "P" : "Q")
      for (let y = 46; y < 92; y++) for (let x = 352; x < 372; x++) {
        const d = Math.max(360 - x, 56 - y, y - 86)
        if (d > 0 && d < 5 && c.key(x, y) === "1" && bay(x, y) < 0.6 - d * 0.12) c.px(x, y, "n")
      }
      c.rect(360, 56, 9, 30, "n"); c.rect(360, 56, 9, 1, "M"); c.rect(360, 85, 9, 1, "M"); c.rect(368, 56, 1, 30, "k")
      "REST".split("").forEach((ch, i) => c.text(363, 59 + i * 6, ch, f % 12 === 7 && i === 2 ? "M" : "m"))
    }
    // the near tower on the right: homes, their warm windows
    c.rect(nearR, 0, 22, SEAT, "1"); c.rect(nearR, 0, 1, SEAT, "2")
    for (const [x, y] of [[5, 52], [13, 66], [5, 94], [15, 108]]) { c.rect(nearR + x, y, 3, 3, "P"); c.px(nearR + x, y, "Q"); c.px(nearR + x + 1, y, "Q") }

    // the underside of the ring above: panels, ribs running to the rim, the lamps, the rim lit from below
    for (let x = 0; x < c.w; x++) {
      const r = rim(x)
      for (let y = 0; y < r; y++) c.px(x, y, y > r - 6 ? "2" : "1")
      c.px(x, r - 1, "3"); c.px(x, r, "n"); if (x % 2) c.px(x, r + 1, "n")
    }
    for (const y of [6, 12, 16]) for (let x = 0; x < c.w; x++) if (y < rim(x) - 2) c.px(x, y, "2")
    for (let x0 = -80; x0 < c.w + 80; x0 += 46) for (let y = 0; y < 40; y++) {      // ribs, toward the city's middle
      const x = Math.round(x0 + (215 - x0) * (y / 120)); if (y < rim(x) - 1) c.px(x, y, "k")
    }
    for (let x = 9; x < c.w; x += 22) { const r = rim(x); c.px(x, r - 1, "R"); c.px(x, r - 2, "4") }

    // the roof: the parapet (its wet top catching the glow, rain runs down its face), the tar before it
    c.rect(0, SEAT, c.w, 1, "4"); c.rect(0, SEAT + 1, c.w, 2, "3"); c.rect(0, SEAT + 3, c.w, 1, "2")
    c.rect(0, SEAT + 4, c.w, 9, "2"); c.rect(0, SEAT + 12, c.w, 1, "1")
    for (let x = 18; x < c.w; x += 26) c.rect(x, SEAT + 4, 1, 9, "1")
    for (let x = 3; x < c.w; x += 5) if (hash(x, 5) < 0.4) c.rect(x, SEAT + 4, 1, 2 + Math.floor(hash(x, 6) * 5), "1")
    for (let y = SEAT + 13; y < H; y++) for (let x = 0; x < c.w; x++) c.px(x, y, y < SEAT + 15 ? "k" : "e")
    c.rect(0, SEAT + 15, c.w, 1, "1")                         // the cable along the parapet's foot

    // today: more screens than there were, selling sleep (pale blue and magenta, as on the ride down), a
    // brighter line rolling down each once a loop, each in its own place in the loop
    if (today) for (const [x, y, w, h, k, l, phase] of [[8, 88, 14, 8, "c", "v", 0], [44, 96, 10, 6, "M", "m", 9], [266, 88, 14, 9, "c", "v", 15], [238, 104, 12, 7, "M", "m", 4], [28, 112, 12, 7, "c", "C", 20]]) {
      c.rect(x, y, w, h, k); c.rect(x + 1, y + 1, w - 2, 1, l); c.rect(x + 2, y + 3, w - 5, 1, l)
      const line = (f + phase) % FRAMES * h / FRAMES | 0
      for (let i = 0; i < w; i++) c.px(x + i, y + line, lit[c.key(x + i, y + line)])
    }

    // rain over everything from the ring's rim down to the parapet's top, but the two of them: thin streaks slanting down to the
    // right, a step lighter than what they fall in front of (so brightest before the lights), 7.5 px a
    // frame: each drop falls the picture's height once a loop
    for (let i = 0, drops = sitting ? 197 : 150; i < drops; i++) {
      const y0 = (Math.floor(hash(i, 12) * H) + Math.floor(7.5 * f)) % H, x0 = Math.floor(hash(i, 11) * (c.w + 45)) - 45
      for (let d = 0; d < 3; d++) { const y = y0 + d, x = x0 + Math.floor(y / 4); if (y > rim(x) + 1 && y < SEAT) { const k = c.key(x, y); if (lit[k]) c.px(x, y, lit[k]) } }
    }

    // the two of them on the ledge (still), the cup beside Teo, its steam rising and curling (half a px a
    // frame, 12 px a loop, fading as it goes), the camera drone hovering by the tower, its eye blinking
    if (today) {
      // the ladder's top over the parapet, the way Juno came up: it comes from outside the wall, so it ends at the parapet's top
      c.rect(10, 116, 2, SEAT - 116, "5"); c.rect(24, 116, 2, SEAT - 116, "5"); for (let y = 120; y < SEAT; y += 6) c.rect(10, y, 16, 1, "4")
      // the Rain Reader's gutter: a length of old channel on a pole before the parapet, falling to a spout over her
      // bucket (x 78, its rim at y 141), a drip off it twice a loop. Where she isn't drawn (dach_sitzen shows no one at
      // the bucket) it falls on to the tar, the one wet spot there.
      {
        c.rect(66, 111, 1, 52, "5"); c.rect(67, 111, 1, 52, "3"); c.rect(64, 162, 6, 1, "4"); c.rect(64, 163, 6, 1, "k")
        for (const y of [120, 137, 150]) c.px(66, y, "4")                                  // rust through the paint, where it was clamped
        const gy = (x) => 105 + Math.round((x - 58) * 0.48)
        for (let x = 58; x <= 79; x++) {
          const y = gy(x)
          c.px(x, y - 1, "k"); c.px(x, y, "6"); c.px(x, y + 1, x % 7 === 3 ? "O" : "4"); c.px(x, y + 2, x % 7 === 3 ? "O" : "3"); c.px(x, y + 3, "k")
        }
        c.rect(57, gy(58), 1, 3, "5")                                                       // the closed end
        c.rect(64, gy(66) + 3, 5, 1, "2"); c.px(69, gy(66) + 2, "3")                         // the clamp on the pole
        c.rect(80, gy(79) + 1, 1, 3, "4"); c.px(79, gy(79) + 4, "3"); c.px(80, gy(79) + 4, "k")  // the spout
        const t = f % 12, y0 = gy(79) + 5, end = sitting ? 164 : 141, dy = Math.round(t * t * 0.55)
        if (y0 + dy < end) { c.px(79, y0 + dy, "V"); if (t > 1) c.px(79, y0 + dy - 1, "v") }
        else if (sitting && y0 + dy < end + 30) { c.px(78, 164, "C"); c.px(80, 164, "C") }
        else if (t === 0) c.px(79, y0, "v")
      }
      // Juno, grown up, alone where the two of them sat
      if (sitting) c.grid(JUNO_NOW, 197, 101)
      // today's new screens further on
      if (sitting) for (const [x, y, w, h, k, l, phase] of [[312, 92, 14, 8, "M", "m", 5], [334, 104, 10, 6, "c", "v", 13], [388, 90, 12, 8, "c", "v", 19]]) {
        c.rect(x, y, w, h, k); c.rect(x + 1, y + 1, w - 2, 1, l); c.rect(x + 2, y + 3, w - 5, 1, l)
        const line = (f + phase) % FRAMES * h / FRAMES | 0
        for (let i = 0; i < w; i++) c.px(x + i, y + line, lit[c.key(x + i, y + line)])
      }
    } else {
    c.grid(JUNO, 197, 105)
    c.grid(TEO, 213, 110)
    c.grid(ARM, 214, 122)
    c.grid(CUP, 236, 127)
    }
    if (!today) for (let j = 0; j < 6; j++) {
      const h = (f * 0.5 + j * 2) % 12, y = Math.round(127 - h), x = 240 + Math.round(Math.sin(h * 0.6 + 1) * 1.2 + h * 0.08)
      if (h < 10) { c.px(x, y, h < 6 ? "5" : "4"); if (h < 7) c.px(x, y - 1, "4") }
    }
    { const dx = Math.round(1.5 * wave(f, FRAMES)), dy = Math.round(0.7 * wave(f, 12, 0.25)); c.grid(CAM, nearR - 9 + dx, 104 + dy); c.px(nearR - 8 + dx, 106 + dy, f % 12 < 2 ? "q" : "r") }

    // puddles in the tar: they mirror what stands above the parapet's foot (the ledge, the two of them, the
    // glow), a step darker; the rain's ripples drift through them and the hood's reflection trembles
    const below = { k: "e", 1: "e", 2: "1", 3: "2", 4: "3", 5: "4", 6: "5", A: "1", B: "A", D: "B", G: "D", y: "j", Y: "y", j: "O", e: "e", f: "e" }
    const drift = Math.floor(f / 4)
    if (!today) for (const [cx, cy, rx, ry] of [[226, 165, 34, 4], [128, 171, 22, 3], [290, 174, 18, 2]])
      for (let y = cy - ry; y <= cy + ry; y++) for (let x = cx - rx; x <= cx + rx; x++) if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 < 1) {
        const k = c.key(x + Math.round(0.7 * wave(f, 12, y * 0.27)), 2 * (SEAT + 13) - y - 14)
        c.px(x, y, Math.abs(y - cy) === ry || (y + drift) % 3 === 0 ? "f" : below[k] ?? "z")
      }
  }
  // the roof today (art/mock: they go into assets/mock.js with the blocks until they are painted)
  const today = (c, sitting) => { const p = pen(sitting ? WIDE : W), from = sitting ? SIT_FROM : 0; paint(p, c.frame, true, sitting); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, p.buf[y][x + from]) }
  anim("dach_bg", { w: W, h: H, frames: FRAMES, fps: 10 }, (c) => today(c, false))
  anim("dach_heute", { w: W, h: H, frames: FRAMES, fps: 10 }, (c) => today(c, true))
  const PHOTOS = []
  const photo = (f) => (PHOTOS[f] ??= (() => { const p = pen(); paint(p, f); return p.buf })())
  anim("deck_photo", { w: W, h: H, frames: FRAMES, fps: 10 }, (c) => { const P = photo(c.frame); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, P[y][x]) })

  // ---------------------------------------------------------------- the photo as the deck shows it
  const DIM = { k: "a", 1: "a", 2: "b", 3: "d", 4: "g", 5: "h", 6: "i", e: "a", f: "b", z: "b", Z: "d", X: "g",
    n: "o", M: "p", m: "p", N: "p", O: "t", P: "t", Q: "u", R: "u", F: "u", W: "i", c: "H", C: "I", v: "I", V: "i",
    r: "K", q: "L", j: "w", y: "x", Y: "U", s: "t", S: "t", T: "b", A: "b", B: "d", D: "g", G: "h" }
  const DARKER = { l: "i", i: "h", h: "g", g: "d", d: "b", b: "a", a: "a", U: "x", x: "w", w: "t", u: "t", t: "b", p: "o", o: "b", I: "H", H: "b", L: "o", K: "b" }
  const LIGHTER = { a: "b", b: "d", d: "g", g: "h", h: "i", i: "i", o: "p", t: "u", H: "I" }
  anim("deck_wallpaper", { w: W, h: H, frames: FRAMES, fps: 10 }, (c) => {
    const out = photo(c.frame).map((row) => row.map((k) => DIM[k] ?? "a"))
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let k = out[y][x]
      const r = ((x - 200) / 230) ** 2 + ((y - 100) / 150) ** 2   // the lens's vignette, darkest at the corners
      if (r > 0.55 + bay(x, y) * 0.25) k = DARKER[k]
      if (r > 0.95 + bay(x, y) * 0.25) k = DARKER[k]
      out[y][x] = k
    }
    // the fold the print has from years in a box: a crease where the emulsion cracked, a step lighter
    for (let y = 0; y < H; y++) {
      const x = 157 + Math.round(Math.sin(y / 23) * 1.5)
      if (hash(y, 31) > 0.5) out[y][x] = LIGHTER[out[y][x]] ?? out[y][x]
    }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, out[y][x])
  })
}

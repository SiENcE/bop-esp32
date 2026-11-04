// The deck's desktop wallpaper (docs/kapitel0-design.md §2.1, style guide §8 "The deck"): an old photo,
// Juno (about 10, already in the yellow slicker, hood up) and her little brother Teo (about 6) from behind
// and a little above, sitting on the parapet of a flat roof in the Lower Ninth at night, in the rain,
// looking out over Halcyon. Over them the underside of the ring above (the Ninth never sees the sky), its
// rim lamps and the drip that is the Ninth's rain; ahead the towers, the big HALCYON screen of 2070
// ("RISE ABOVE", the sun the Ninth never sees), amber windows, a magenta NOODLES sign, the flooded streets'
// glow coming up through the smog. Teo leans his head on her shoulder, her arm round him; on the ledge
// beside him the noodle cup they shared, still steaming. A roof camera watches them (its red eye).
//
// Exports two 320x180 sprites:
//   deck_photo       the photo at full strength (to judge the picture)
//   deck_wallpaper   the photo as the deck shows it: every colour taken down to a dark, faded tone (an old
//                    print), a vignette from the lens, the fold the print has from years in a box; nothing
//                    brighter than steel 5 #41547a but the dimmed hood, a few amber windows, the sign
//
// Palette keys: the world palette (style guide §5: k, steel 1-6, wet e f z Z X, magenta n M m N, warm
// O P Q R W, cyan c C v V, red r q, Juno's j y Y, skin s S) plus the smog lit from below (A B D G);
// the dimmed print's own keys: steel a b d g h i l, magenta o p, amber t u, yellow w x U, cyan H I, red L.
// Included by art/mockups/mock_f_deck.px.js; its helpers live in the block below (one shared JS scope).
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
  H: "#0f2834", I: "#17414f", L: "#4a1420",
})

{
  const W = 320, H = 180, SEAT = 136                     // SEAT: the parapet's top, where they sit
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
    O: "111101101101111", N: "110101101101101", D: "110101101101110", E: "111100110100111", S: "011100010001110" }
  const pen = () => {
    const buf = Array.from({ length: H }, () => new Array(W).fill("1"))
    const p = {
      buf,
      px(x, y, k) { x = Math.round(x); y = Math.round(y); if (k && x >= 0 && y >= 0 && x < W && y < H) buf[y][x] = k },
      rect(x, y, w, h, k) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) p.px(x + i, y + j, k) },
      key(x, y) { x = Math.round(x); y = Math.round(y); return x >= 0 && y >= 0 && x < W && y < H ? buf[y][x] : undefined },
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
  // the roof camera on its bracket, looking at them: its red eye
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
  const blocks = (seed, t0, t1, w0, w1) => { const out = []; for (let x = -6, i = 0; x < W + 6; i++) { const w = w0 + Math.floor(hash(seed, i) * (w1 - w0)); out.push([x, x + w, t0 + Math.floor(hash(i, seed) * (t1 - t0))]); x += w } return out }

  function paint(c) {
    const lit = { k: "1", 1: "2", 2: "3", 3: "4", 4: "5", 5: "6", A: "B", B: "D", D: "G", G: "4", e: "f", f: "z", z: "Z", Z: "X", c: "C", n: "M", O: "P" }
    const air = (x, y) => tone(SMOG, smog(x, y) * 4, x, y)

    for (let y = 0; y < SEAT; y++) for (let x = 0; x < W; x++) c.px(x, y, air(x, y))
    // the far towers, standing in the smog: a shade darker than the air, their feet lost in it
    const far = [[96, 106, 44], [164, 174, 50], [198, 208, 56], [210, 222, 40], [222, 230, 62], [244, 254, 54], [256, 270, 42], [270, 278, 58], [6, 18, 48], [60, 72, 52]]
    for (const [x0, x1, top] of [...blocks(3, 62, 76, 6, 13), ...far]) for (let y = top; y < HZ + 4; y++) for (let x = x0; x < x1; x++)
      c.px(x, y, tone(SMOG, smog(x, y) * 4 - 1.2 + Math.max(0, y - HZ + 10) * 0.05, x, y))
    for (const [x0, x1, top] of far) for (let y = top + 3; y < HZ - 2; y += 3) for (let x = x0 + 1; x < x1 - 1; x += 2) if (hash(x * 7, y) < 0.06) c.px(x, y, "O")
    // the transit axis, the city's spine going up into the ring: its lifts' lights
    for (let y = 0; y < HZ + 2; y++) for (let x = 180; x < 194; x++) c.px(x, y, tone(SMOG, smog(x, y) * 4 - (x < 182 ? 0.7 : 1.5), x, y))
    for (let y = 26; y < HZ; y += 5) c.px(187, y, "c"); c.px(187, 46, "v"); c.px(187, 47, "v")

    // the HALCYON tower and its screen: the sun rising over the water, the city's promise in 2070
    c.rect(104, 28, 64, HZ + 10 - 28, "2"); c.rect(164, 28, 4, HZ + 10 - 28, "1"); c.rect(104, 28, 60, 1, "3")
    for (let y = 68; y < HZ + 10; y += 3) for (let x = 106; x < 163; x += 3) if (hash(x, y * 3) < 0.08) c.px(x, y, hash(y, x) < 0.7 ? "P" : "c")
    c.rect(110, 33, 50, 31, "1")
    for (let y = 35; y < 62; y++) for (let x = 112; x < 158; x++) c.px(x, y, y < 50 ? ((x + y) % 4 ? "c" : "C") : (y & 1 ? "c" : "C"))
    c.text(122, 37, "HALCYON", "V")
    for (let y = 45; y < 55; y++) for (let x = 125; x < 146; x++) { const d = (x - 135) ** 2 + (y - 55) ** 2; if (d <= 81) c.px(x, y, d <= 36 ? "V" : "v") }
    for (const [y, a, b] of [[55, 118, 152], [57, 123, 147], [59, 128, 142]]) c.rect(a, y, b - a, 1, "v")
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
      for (let x = Math.ceil(l); x < r; x++) if (hash(x >> 2, y * 3) < 0.09) c.px(x, y, lit[c.key(x, y)])    // ripples, where the rain hits
      c.px(Math.round(l), y, "3"); c.px(Math.round(r), y, "2")                                              // the quays' wet edges
    }
    for (let x = Math.floor(bankL(HZ + 21)) + 2; x < bankR(HZ + 21); x += 5)                                  // the bridge's lamps in the water
      for (let y = HZ + 25; y < HZ + 25 + 16; y++) if (hash(x, y) < 0.8 - (y - HZ - 25) * 0.04) c.px(x, y, y < HZ + 31 ? "P" : "O")
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
      for (let d = 2; d < s * 6 + 3; d++) if (y + d < SEAT && hash(x, y + d) < 0.75 - d / (s * 10 + 4)) c.rect(x, y + d, s, 1, d < s * 3 ? kd : "n")   // its streak in the water
    }
    // a footbridge over the canal, its lamps; a water taxi coming up it, its lamp and its wake
    { const y = HZ + 21; for (let x = Math.floor(bankL(y)) - 1; x <= bankR(y) + 1; x++) { c.px(x, y, "2"); c.px(x, y + 1, "k"); c.px(x, y + 3, "A") } for (let x = Math.floor(bankL(y)) + 2; x < bankR(y); x += 5) c.px(x, y - 1, "R") }
    { const x = 229, y = 95; c.rect(x, y, 4, 1, "k"); c.px(x + 1, y - 1, "2"); c.px(x + 1, y + 1, "R"); for (let d = 1; d < 6; d++) { c.px(x - d, y + 1 + d, "D"); c.px(x + 3 + d, y + 1 + d, "D") } }

    // the near tower on the left, its balconies, the NOODLES sign and its light on the wall
    c.rect(76, 0, 28, SEAT, "1"); c.rect(76, 0, 2, SEAT, "2")
    for (let y = 30; y < SEAT; y += 9) { c.rect(78, y, 18, 1, "2"); c.rect(78, y + 1, 18, 1, "k") }
    for (const [x, y] of [[81, 33], [86, 60], [80, 87], [85, 114]]) { c.rect(x, y, 3, 2, "P"); c.px(x, y, "Q") }
    for (let y = 40; y < 112; y++) for (let x = 90; x < 104; x++) {
      const d = Math.max(96 - x, 50 - y, y - 104)
      if (d > 0 && d < 6 && "12k".includes(c.key(x, y)) && bay(x, y) < 0.75 - d * 0.13) c.px(x, y, "n")
    }
    c.rect(96, 49, 9, 57, "n"); c.rect(96, 49, 9, 1, "M"); c.rect(96, 105, 9, 1, "M"); c.rect(104, 49, 1, 57, "k")
    "NOODLES".split("").forEach((ch, i) => c.text(99, 52 + i * 7, ch, "m"))
    // the near tower on the right: homes, their warm windows
    c.rect(298, 0, 22, SEAT, "1"); c.rect(298, 0, 1, SEAT, "2")
    for (const [x, y] of [[303, 52], [311, 66], [303, 94], [313, 108]]) { c.rect(x, y, 3, 3, "P"); c.px(x, y, "Q"); c.px(x + 1, y, "Q") }

    // the underside of the ring above: panels, ribs running to the rim, the lamps, the rim lit from below
    for (let x = 0; x < W; x++) {
      const r = rim(x)
      for (let y = 0; y < r; y++) c.px(x, y, y > r - 6 ? "2" : "1")
      c.px(x, r - 1, "3"); c.px(x, r, "n"); if (x % 2) c.px(x, r + 1, "n")
    }
    for (const y of [6, 12, 16]) for (let x = 0; x < W; x++) if (y < rim(x) - 2) c.px(x, y, "2")
    for (let x0 = -80; x0 < W + 80; x0 += 46) for (let y = 0; y < 40; y++) {      // ribs, toward the city's middle
      const x = Math.round(x0 + (215 - x0) * (y / 120)); if (y < rim(x) - 1) c.px(x, y, "k")
    }
    for (let x = 9; x < W; x += 22) { const r = rim(x); c.px(x, r - 1, "R"); c.px(x, r - 2, "4") }

    // rain, lit by what it falls in front of
    for (let i = 0; i < 220; i++) {
      const x = Math.floor(hash(i, 11) * W), y = rim(x) + 3 + Math.floor(hash(i, 12) * (SEAT - rim(x) - 6))
      for (let d = 0; d < 3; d++) { const k = c.key(x + (d >> 1), y + d); if (lit[k]) c.px(x + (d >> 1), y + d, lit[k]) }
    }

    // the roof: the parapet (its wet top catching the glow, rain runs down its face), the tar before it
    c.rect(0, SEAT, W, 1, "4"); c.rect(0, SEAT + 1, W, 2, "3"); c.rect(0, SEAT + 3, W, 1, "2")
    c.rect(0, SEAT + 4, W, 9, "2"); c.rect(0, SEAT + 12, W, 1, "1")
    for (let x = 18; x < W; x += 26) c.rect(x, SEAT + 4, 1, 9, "1")
    for (let x = 3; x < W; x += 5) if (hash(x, 5) < 0.4) c.rect(x, SEAT + 4, 1, 2 + Math.floor(hash(x, 6) * 5), "1")
    for (let y = SEAT + 13; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, y < SEAT + 15 ? "k" : "e")
    c.rect(0, SEAT + 15, W, 1, "1")                         // the cable along the parapet's foot
    for (let i = 0; i < 30; i++) { const x = Math.floor(hash(i, 21) * W), y = 152 + Math.floor(hash(i, 22) * 26); if (c.key(x, y) === "e") c.px(x, y, "f") }   // splashes

    // the two of them on the ledge, the cup beside Teo, its steam, the camera on its bracket
    c.grid(JUNO, 197, 105)
    c.grid(TEO, 213, 110)
    c.grid(ARM, 214, 122)
    c.grid(CUP, 236, 127)
    for (const [x, y] of [[240, 126], [241, 125], [241, 124], [240, 123], [239, 122], [240, 120], [241, 119]]) c.px(x, y, "5")
    c.grid(CAM, 289, 104)

    // puddles in the tar: they mirror what stands above the parapet's foot (the ledge, the two of them, the
    // glow), a step darker, broken by the rain's ripples
    const below = { k: "e", 1: "e", 2: "1", 3: "2", 4: "3", 5: "4", 6: "5", A: "1", B: "A", D: "B", G: "D", y: "j", Y: "y", j: "O", e: "e", f: "e" }
    for (const [cx, cy, rx, ry] of [[226, 165, 34, 4], [128, 171, 22, 3], [290, 174, 18, 2]])
      for (let y = cy - ry; y <= cy + ry; y++) for (let x = cx - rx; x <= cx + rx; x++) if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 < 1) {
        const k = c.key(x + (y % 3 === 0 ? 1 : 0), 2 * (SEAT + 13) - y - 14)
        c.px(x, y, Math.abs(y - cy) === ry || y % 3 === 0 ? "f" : below[k] ?? "z")
      }
  }
  const PHOTO = (() => { const p = pen(); paint(p); return p.buf })()
  sprite("deck_photo", { w: W, h: H }, (c) => { for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, PHOTO[y][x]) })

  // ---------------------------------------------------------------- the photo as the deck shows it
  const DIM = { k: "a", 1: "a", 2: "b", 3: "d", 4: "g", 5: "h", 6: "i", e: "a", f: "b", z: "b", Z: "d", X: "g",
    n: "o", M: "p", m: "p", N: "p", O: "t", P: "t", Q: "u", R: "u", F: "u", W: "i", c: "H", C: "I", v: "I", V: "i",
    r: "L", q: "L", j: "w", y: "x", Y: "U", s: "t", S: "t", T: "b", A: "b", B: "d", D: "g", G: "h" }
  const DARKER = { l: "i", i: "h", h: "g", g: "d", d: "b", b: "a", a: "a", U: "x", x: "w", w: "t", u: "t", t: "b", p: "o", o: "b", I: "H", H: "b", L: "o" }
  const LIGHTER = { a: "b", b: "d", d: "g", g: "h", h: "i", i: "i", o: "p", t: "u", H: "I" }
  sprite("deck_wallpaper", { w: W, h: H }, (c) => {
    const out = PHOTO.map((row) => row.map((k) => DIM[k] ?? "a"))
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

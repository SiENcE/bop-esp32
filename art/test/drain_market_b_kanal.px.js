// The Drain Market, draft B "the channel" (one of three drafts to compare; not in the game). BLOCKS, 320x180: flat keys, clear shapes,
// no texture. One vanishing point, looking along the drained flood channel: its two sloped concrete walls running away, stalls on the
// bed against both walls and shacks on decks up the slopes in two more tiers, tarps, strings of bulbs, cables and signs crossing
// overhead one behind the other, a bridge with neon in the distance, the crowd filling the bed and thinning into the distance.
//
// Everything stands in metres (X across, Y up from the bed, Z away from the eye) and is projected with P, so its edges run to the
// vanishing point. The eye is 2.6 m over the bed, so the crowd's heads sit just under the horizon and the floor shows between them.
// Juno is 50 px tall at Z = 5 (30 px a metre, the style guide's scale): that is the walk band at the bottom.
//
// What the story needs, all in the near part (Z 4 to 11), where nothing of the crowd stands in front of it:
//   left:  the stairs up to the alley, their foot in the near corner (EXIT), climbing the left slope away from us; Ratz's junk
//          stall under them; the stall with used implants in jars
//   middle: the stairs down (Chapter 2): a railed well in the bed left of the walk band, its gate facing us, chained, CLOSED;
//          further in the preacher on his crate, a ring of empty floor round him; the gutter down the middle holds water
//   right: the food stall (wok fire, steam, stools) at the near edge; Sable's curtain in a concrete buttress facing us;
//          the stall under KIDNEYS ONLY
include("../lib/iso.js", { palette: true })
include("../lib/text.js")
pal({
  b: "#26324e", B: "#364872",                       // blue tarp
  d: "#4e2a20", D: "#7a4128",                       // rust tarp
  l: "#1f3a2c", L: "#3a6a4a",                       // green tarp, the exit sign
  J: "#22101a", K: "#3a1624", F: "#57222f",         // the heavy plum curtain to Sable's booth
  7: "#33241c", 8: "#54392a",                       // crates, wood
  "!": "#9c8f70", "?": "#d8c8a0",                   // the preacher's coat (style guide §6: coffee with too much milk)
})

const DMB = (() => {
  const W = 320, H = 180, VX = 160, VY = 80, FOC = 150, EYE = 2.6
  const HB = 4.6, TOP = 7, ZN = 3.4, ZF = 46       // the bed's half width, the slopes' height (45 degrees), nearest and farthest depth
  const R = Math.round, hash = ISO.ihash
  const P = (X, Y, Z) => [VX + FOC * X / Z, VY + FOC * (EYE - Y) / Z]
  const S = (Z) => FOC / Z                          // px a metre at depth Z
  const poly = (c, pts, k) => c.poly(pts.flatMap((p) => P(...p)).map(R), k)
  const zf = (c, X0, X1, Y0, Y1, Z, k) => poly(c, [[X0, Y0, Z], [X1, Y0, Z], [X1, Y1, Z], [X0, Y1, Z]], k)
  const xf = (c, X, Y0, Y1, Z0, Z1, k) => poly(c, [[X, Y0, Z0], [X, Y0, Z1], [X, Y1, Z1], [X, Y1, Z0]], k)
  const yf = (c, Y, X0, X1, Z0, Z1, k) => poly(c, [[X0, Y, Z0], [X1, Y, Z0], [X1, Y, Z1], [X0, Y, Z1]], k)
  const ln = (c, a, b, k) => { const p = P(...a).map(R), q = P(...b).map(R); c.line(p[0], p[1], q[0], q[1], k) }
  const lr = (s, a, b) => s < 0 ? [-b, -a] : [a, b]   // a span a..b metres out from the middle, on side s
  /** a box: the faces the eye sees, the near one last */
  const box = (c, X0, X1, Y0, Y1, Z0, Z1, kf, ks, kt) => {
    if (X1 < 0) xf(c, X1, Y0, Y1, Z0, Z1, ks)
    if (X0 > 0) xf(c, X0, Y0, Y1, Z0, Z1, ks)
    if (Y1 < EYE) yf(c, Y1, X0, X1, Z0, Z1, kt ?? ks)
    if (Y0 > EYE) yf(c, Y0, X0, X1, Z0, Z1, kt ?? ks)
    zf(c, X0, X1, Y0, Y1, Z0, kf)
  }
  /** a board facing us with its text, if the text fits; else lines standing for it */
  const board = (c, X0, X1, Y0, Y1, Z, kb, kt, text, vertical) => {
    zf(c, X0, X1, Y0, Y1, Z, "k")
    const [x0, y1] = P(X0, Y0, Z).map(R), [x1, y0] = P(X1, Y1, Z).map(R)
    c.rect(x0 + 1, y0 + 1, x1 - x0 - 2, y1 - y0 - 2, kb)
    if (!text) return
    const s = vertical ? [...text].join("\n") : text, w = TXT.measure(s, "hud"), h = s.split("\n").length * 7 - 2
    if (w <= x1 - x0 - 3 && h <= y1 - y0 - 3) TXT.draw(c, R((x0 + x1) / 2), R((y0 + y1) / 2 - h / 2), s, kt, { font: "hud", align: "center" })
    else if (x1 - x0 > 4 && y1 - y0 > 3) for (let y = y0 + 2; y < y1 - 1; y += vertical ? 3 : 2) c.hline(x0 + 2, y, x1 - x0 - 4, kt)
  }
  /** a person as a block (jade_row's), standing on Y at (X, Z); h scales the height */
  const person = (c, X, Z, coat, skin, o = {}) => {
    const s = S(Z) / 30 * (o.h ?? 1), [x, foot] = P(X, o.y ?? 0, Z)
    const Rr = (a, b, w, h, k) => c.rect(R(x + a * s), R(foot + b * s), Math.max(1, R(w * s)), Math.max(1, R(h * s)), k)
    if (o.seated) { Rr(-4, -14, 9, 4, "1"); Rr(2, -14, 3, 14, "1"); Rr(-5, -36, 11, 22, coat); Rr(-3, -44, 7, 8, skin); Rr(-3, -44, 7, 3, "1"); return }
    Rr(-3, -21, 3, 21, "1"); Rr(1, -21, 3, 21, "1"); Rr(-5, -42, 11, 22, coat); Rr(3, -41, 2, 20, o.shade ?? "2")
    Rr(-3, -50, 7, 8, skin); Rr(-3, -50, 7, o.hood ? 8 : 3, o.hood ?? "1")
    if (o.hood) Rr(-1, -47, 4, 4, skin)
    if (o.bag) { Rr(-6, -30, 3, 7, o.bag); Rr(-4, -42, 1, 12, o.bag) }
    if (o.arms) { Rr(-7, -62, 2, 22, coat); Rr(6, -62, 2, 22, coat) }
  }
  /** a string of bulbs (or a cable) across the channel at depth Z, sagging */
  const string = (c, Z, Ya, Yb, sag, bulb, every = 0.7) => {
    const Xa = -(HB + Ya), Xb = HB + Yb, n = 40
    let prev = null
    for (let i = 0; i <= n; i++) {
      const t = i / n, X = Xa + (Xb - Xa) * t, Y = Ya + (Yb - Ya) * t - Math.sin(t * Math.PI) * sag, p = P(X, Y, Z).map(R)
      if (prev) c.line(prev[0], prev[1], p[0], p[1], "k")
      prev = p
    }
    if (!bulb) return
    const sz = Math.max(1, R(0.13 * S(Z)))
    for (let X = Xa + every / 2; X < Xb; X += every) {
      const t = (X - Xa) / (Xb - Xa), Y = Ya + (Yb - Ya) * t - Math.sin(t * Math.PI) * sag - 0.12, [x, y] = P(X, Y, Z).map(R)
      c.rect(x, y, sz, sz, bulb)
    }
  }

  // ------------------------------------------------------------ the background: the city above, the far end, the slopes, the bed, the stairs up, the tiers
  const PIT = { X0: -2.8, X1: -1.25, Z0: 5.0, Z1: 6.6 }
  const STAIR = { Z0: 4.4, run: 0.34, rise: 0.25, n: 28, w: 1.3 }
  const tierStalls = (side, tier) => {
    // segments along Z for the decks' shacks; the left tier 2 begins where the stairs have reached the top
    const out = [], start = tier === 2 ? (side < 0 ? 15.8 : 6.4) : (side < 0 ? 4.6 : 4.8)
    let Z = start, i = 0
    while (Z < 40) {
      const len = 1.7 + hash(i * 7 + tier, side + 5) * 1.6
      if (!(side < 0 && Z < 15.8)) out.push([Z, Z + len, i])                          // over the stairs the slope stays bare
      Z += len + 0.25 + hash(i, tier * 3 + side) * 0.5; i++
    }
    return out
  }
  const SHOP = ["Q", "P", "Q", "M", "C", "R", "P", "n"]
  const TIER_SIGNS = ["SIM", "PAWN", "FIX", "KOPI", "BAO", "TIDE", "DEBT", "GILLS", "02-04", "SOUP", "CHIP", "VAPE"]
  const shack = (c, side, tier, Z0, Z1, i) => {
    const Yd = tier === 2 ? 2.5 : 4.8, Xd0 = tier === 2 ? HB : 7.0, Xs0 = tier === 2 ? 5.2 : 7.6, Xs1 = HB + Yd, Yt = Yd + (tier === 2 ? 2.0 : 1.9)
    const [a, b] = lr(side, Xs0, Xs1)
    // the deck under it and its posts
    const [da, db] = lr(side, Xd0, Xs1)
    if (Yd > EYE) yf(c, Yd, da, db, Z0 - 0.2, Z1 + 0.2, "2")
    ln(c, [side * (Xd0 + 0.1), Yd, Z0], [side * (Xd0 + 0.1), Yd - 2.3, Z0], "k")
    // the shack: its inner face open and lit, a strip light along its top
    box(c, a, b, Yd, Yt, Z0, Z1, "3", "4", "5")
    const X = side < 0 ? b : a, k = SHOP[(i * 3 + tier + (side > 0 ? 1 : 0)) % SHOP.length]
    xf(c, X, Yd + 0.35, Yt - 0.45, Z0 + 0.25, Z1 - 0.25, k)
    xf(c, X, Yd + 0.35, Yd + 0.75, Z0 + 0.25, Z1 - 0.25, "2")                          // its counter
    xf(c, X, Yt - 0.42, Yt - 0.34, Z0 + 0.1, Z1 - 0.1, "W")                            // the tube
    xf(c, X, Yt, Yt + 0.12, Z0, Z1, tier === 2 ? "B" : "D")                             // its roof's edge
    // the deck's rail
    ln(c, [side * Xd0, Yd + 1.0, Z0 - 0.2], [side * Xd0, Yd + 1.0, Z1 + 0.2], "6")
    // a vertical sign sticking out towards us at its near end
    if (hash(i, tier + side * 2) < 0.75) {
      const [sa, sb] = lr(side, Xd0 - 0.2, Xd0 + 0.45), kb = ["n", "O", "c", "k"][i % 4], kt = { n: "m", O: "Q", c: "v", k: "W" }[kb]
      board(c, sa, sb, Yd + 0.4, Yt + 0.5, Z0 + 0.05, kb, kt, TIER_SIGNS[(i + tier * 5 + (side > 0 ? 3 : 0)) % TIER_SIGNS.length], true)
    }
  }
  const back = (c) => {
    c.rect(0, 0, W, H, "k")
    // the city's buildings at street level beyond the channel's edges, up to the next ring's underside
    for (const s of [-1, 1]) {
      xf(c, s * 13, TOP, 24, 6, ZF, "2")
      for (let Z = 6.5; Z < ZF - 2; Z += 2.4) for (let Y = 8.4; Y < 23; Y += 2.3) {
        const q = hash(R(Z * 10) + s * 7, R(Y * 10)), k = q < 0.12 ? "Q" : q < 0.2 ? "C" : q < 0.25 ? "M" : q < 0.32 ? "P" : "1"
        xf(c, s * 13, Y, Y + 1.1, Z, Z + 1.2, k)
      }
      yf(c, TOP, s < 0 ? -13 : HB + TOP, s < 0 ? -(HB + TOP) : 13, ZN, ZF, "3")            // the street along the edge
    }
    // the far end: more city across, the channel going on into a culvert, dark
    zf(c, -13, 13, TOP, 24, ZF, "2")
    for (let X = -12; X < 12; X += 2.2) for (let Y = 8.4; Y < 23; Y += 2.3) { const q = hash(R(X * 10), R(Y * 10)); if (q < 0.35) zf(c, X, X + 1.2, Y, Y + 1.1, ZF, q < 0.15 ? "Q" : q < 0.25 ? "M" : "C") }
    poly(c, [[-HB, 0, ZF], [HB, 0, ZF], [HB + TOP, TOP, ZF], [-(HB + TOP), TOP, ZF]], "2")
    zf(c, -3.4, 3.4, 0, 3.6, ZF, "k"); zf(c, -3.0, 3.0, 0, 0.6, ZF, "n")
    // the next ring's underside, a lamp here and there
    c.rect(0, 0, W, 6, "1"); for (let x = 8; x < W; x += 37) c.rect(x + R(hash(x) * 20), 3, 2, 1, hash(x, 2) < 0.5 ? "Q" : "c")
    // the slopes: stained dark under the old tide mark, the mark, plain concrete over it
    for (const s of [-1, 1]) {
      poly(c, [[s * HB, 0, ZN], [s * HB, 0, ZF], [s * (HB + TOP), TOP, ZF], [s * (HB + TOP), TOP, ZN]], "3")
      poly(c, [[s * HB, 0, ZN], [s * HB, 0, ZF], [s * (HB + 1.9), 1.9, ZF], [s * (HB + 1.9), 1.9, ZN]], "2")
      ln(c, [s * (HB + 1.95), 1.95, ZN], [s * (HB + 1.95), 1.95, ZF], "4")
      ln(c, [s * (HB + TOP), TOP, ZN], [s * (HB + TOP), TOP, ZF], "5")                   // the edge, and its railing
      ln(c, [s * (HB + TOP), TOP + 1.0, ZN], [s * (HB + TOP), TOP + 1.0, ZF], "4")
      for (let Z = 4; Z < ZF; Z += 1.6) ln(c, [s * (HB + TOP), TOP, Z], [s * (HB + TOP), TOP + 1.0, Z], "4")
    }
    // the bed: concrete, the low-flow gutter down the middle
    yf(c, 0, -HB, HB, ZN, ZF, "f")
    yf(c, 0, -0.4, 0.4, ZN, ZF, "e"); ln(c, [-0.4, 0, ZN], [-0.4, 0, ZF], "z"); ln(c, [0.4, 0, ZN], [0.4, 0, ZF], "z")
    // water in it, the lights overhead and the signs smeared in it as short strokes
    for (let i = 0; i < 70; i++) {
      const Z = ZN + 0.3 + Math.pow(hash(i, 41), 1.4) * 26, X = -0.3 + hash(i, 42) * 0.5, [x, y] = P(X, 0, Z).map(R), len = Math.max(1, R(0.25 * S(Z)))
      c.hline(x, y, len, ["m", "Q", "R", "m", "v", "M", "P"][i % 7])
    }
    // puddles on the bed, holding the near signs' colours
    for (const [X0, X1, Z0, Z1, k0, k1] of [[0.6, 1.9, 4.3, 5.2, "e", "M"], [-1.0, -0.5, 6.4, 7.6, "e", "Q"], [1.0, 2.2, 6.8, 7.5, "e", "m"], [-2.6, -1.6, 10.8, 11.6, "e", "v"]]) {
      yf(c, 0, X0, X1, Z0, Z1, k0)
      for (let j = 0; j < 4; j++) { const Z = Z0 + (Z1 - Z0) * (0.2 + 0.2 * j), [x, y] = P(X0 + (X1 - X0) * (0.25 + 0.12 * j), 0, Z).map(R); c.hline(x, y, Math.max(2, R(0.4 * S(Z))), j % 2 ? k1 : "Z") }
    }
    // light on the bed: amber under the stalls' bulbs, cyan at Ratz and the jars, magenta at the curtain and the kidneys
    const pool = (s, Z0, Z1, k0, k1) => { const [a, b] = lr(s, 1.6, 3.1), [e, f] = lr(s, 2.3, 3.1); yf(c, 0, a, b, Z0, Z1, k0); yf(c, 0, e, f, Z0 + 0.15, Z1 - 0.15, k1) }
    pool(1, 4.0, 6.8, "a", "A"); pool(-1, 6.2, 8.3, "t", "T"); pool(-1, 8.4, 10.3, "t", "T"); pool(1, 7.0, 8.7, "i", "I"); pool(1, 8.7, 10.7, "i", "I")
    for (const [s, Z0, Z1] of STALLS) pool(s, Z0, Z1, "a", "A")
    yf(c, 0, -1.9, 0.1, 7.6, 9.0, "a")                                                     // round the preacher's crate, from his lamp
    // the stairs up to the alley, climbing the left slope away from us (step by step, the far ones first)
    const { Z0, run, rise, n, w } = STAIR
    for (let i = n - 1; i >= 0; i--) {
      const Y0 = i * rise, Y1 = Y0 + rise, Za = Z0 + i * run, Zb = Za + run, Xo = -(HB + Y1), Xi = -(HB + Y1 - w)
      xf(c, Xi, Math.max(0, Y1 - w), Y1, Za, Zb, "4")
      if (Y1 < EYE) yf(c, Y1, Xo, Xi, Za, Zb, "6")
      zf(c, Xo, Xi, Y0, Y1, Za, i % 2 ? "5" : "6")
      ln(c, [Xo, Y0, Za], [Xi, Y0, Za], "3")
      ln(c, [Xi, Y1, Za], [Xi, Y1, Zb], "k")
    }
    const top = Z0 + n * run
    ln(c, [-(HB - w) - 0.05, 1.0, Z0], [-(HB + TOP - w) - 0.05, TOP + 1.0, top], "6")       // the handrail and its posts
    for (let i = 0; i <= n; i += 4) { const Y = i * rise, X = -(HB + Y - w) - 0.05; ln(c, [X, Y, Z0 + i * run], [X, Y + 1.0, Z0 + i * run], "6") }
    // at the top the opening into the alley, the market's magenta spilling up into it
    zf(c, -(HB + TOP + 0.3), -(HB + TOP - w - 0.3), TOP, TOP + 2.6, top + 0.4, "2"); zf(c, -(HB + TOP), -(HB + TOP - w), TOP, TOP + 2.2, top + 0.4, "n"); zf(c, -(HB + TOP) + 0.2, -(HB + TOP - w) - 0.2, TOP, TOP + 1.6, top + 0.41, "M")
    zf(c, -(HB + TOP + 0.3), -(HB + TOP - w - 0.3), TOP + 2.6, TOP + 2.75, top + 0.39, "m")
    // the tiers up the slopes: the higher first, near ones last
    for (const tier of [3, 2]) for (const s of [-1, 1]) for (const [a, b, i] of tierStalls(s, tier).reverse()) shack(c, s, tier, a, b, i)
    // the water gauge painted on the left slope by the stairs: the channel still measures its flood
    for (let Y = 0.2; Y < 1.9; Y += 0.3) ln(c, [-(HB + Y), Y, 3.5], [-(HB + Y), Y, 4.0], Y > 1.5 ? "q" : "6")
  }

  // ------------------------------------------------------------ the stalls on the bed: [side, Z0, Z1, kind]
  const STALLS = []
  for (const s of [-1, 1]) { let Z = s < 0 ? 10.4 : 11.2, i = 0; while (Z < 40) { const len = 1.6 + hash(i, s + 9) * 1.2; STALLS.push([s, Z, Z + len, i]); Z += len + 0.3; i++ } }
  const TARPS = [["b", "B"], ["d", "D"], ["l", "L"], ["u", "U"], ["5", "6"], ["d", "D"], ["b", "B"]]
  const SIGNS = [["2", "Q", "01-15", "KOPI"], ["n", "m", "01-16", "CHARGE\n5 CHITS"], ["O", "R", "01-17", "SATAY"], ["k", "W", "01-18", "BATTS"], ["c", "v", "01-19", "SIMS"],
    ["2", "Q", "01-20", "LAKSA"], ["n", "m", "01-21", "MODS"], ["O", "R", "01-22", "PHO"], ["k", "W", "01-23", "CASH"], ["c", "v", "01-24", "FIX"]]
  /** a stall against the wall on side s: its back shelf of goods, the seller, the counter, the awning, its sign */
  const stall = (c, s, Z0, Z1, o) => {
    const sh = lr(s, 4.0, HB), co = lr(s, 3.1, 3.6), aw = [s * HB, s * 2.75], k = o.tarp ?? TARPS[o.i % TARPS.length]
    box(c, sh[0], sh[1], 0, 2.2, Z0, Z1, "3", "4", "5")
    const Xs = s < 0 ? sh[1] : sh[0]
    for (let Z = Z0 + 0.2; Z < Z1 - 0.3; Z += 0.45) for (const Y of [0.95, 1.5]) xf(c, Xs, Y, Y + 0.35, Z, Z + 0.3, o.goods?.[R(Z * 7 + Y * 3) % o.goods.length] ?? ["5", "P", "6", "g", "O", "U"][R(Z * 7 + Y * 3) % 6])
    if (o.seller !== false) person(c, s * 3.85, (Z0 + Z1) / 2, o.seller ?? ["4", "O", "3", "u"][o.i % 4], ["s", "S", "O"][o.i % 3])
    box(c, co[0], co[1], 0, 0.95, Z0, Z1, "2", "4", "5")
    xf(c, s < 0 ? co[1] : co[0], 0.85, 0.95, Z0, Z1, "6")                                   // the counter's lip in the light
    if (o.top) o.top(c)
    poly(c, [[aw[0], 2.55, Z0], [aw[0], 2.55, Z1], [aw[1], 2.2, Z1], [aw[1], 2.2, Z0]], k[0])  // the awning's top
    xf(c, aw[1], 1.98, 2.2, Z0, Z1, k[1])                                                 // its valance towards the middle
    for (let Z = Z0 + 0.3; Z < Z1; Z += 0.9) { const [x, y] = P(aw[1], 1.95, Z).map(R); c.rect(x, y, Math.max(1, R(0.12 * S(Z))), Math.max(1, R(0.14 * S(Z))), "R") }  // bare bulbs
    if (o.hang) for (let Z = Z0 + 0.5; Z < Z1 - 0.2; Z += 0.8) { const [x, y] = P(aw[1] - s * 0.05, 1.95, Z).map(R), sz = Math.max(1, R(0.2 * S(Z))); c.rect(x - 1, y, sz, sz + 2, o.hang[R(Z * 3) % o.hang.length]) }
    if (o.sign) { const [a, b] = lr(s, 2.35, 4.4); board(c, a, b, o.sign.y0 ?? 2.3, o.sign.y1 ?? 3.05, Z0 - 0.02, o.sign.kb, o.sign.kt, o.sign.text) }
  }

  // ------------------------------------------------------------ the things in front, far to near
  const items = []
  // the far bridge across the channel, its neon, the lanterns under it; a thinner one farther off
  items.push([33, (c) => { box(c, -14, 14, 7.0, 7.7, 33, 34, "3", "2", "2"); for (let X = -10; X < 10; X += 2.7) person(c, X, 33, "3", "s", { y: 7.7, h: 0.9 }) }])
  items.push([22, (c) => {
    box(c, -14, 14, 7.0, 8.3, 22, 23.5, "4", "3", "2"); zf(c, -14, 14, 8.3, 9.2, 21.99, "3")
    for (let X = -12; X < 12; X += 1.6) { const [x, y] = P(X, 6.6, 22).map(R); c.vline(x, y - 3, 3, "k"); c.rect(x - 1, y, 3, 3, hash(R(X * 5)) < 0.3 ? "m" : "Q") }
    board(c, -3.8, 3.8, 9.3, 10.6, 21.98, "n", "m", "DRAIN MARKET")
  }])
  // the strings of bulbs, cables and a magenta strip crossing overhead
  for (const [Z, Ya, Yb, sag, bulb, every] of [[30, 6.0, 5.6, 0.4, "Q", 0.9], [26, 5.5, 6.0, 0.5, "R", 0.9], [18, 5.6, 5.2, 0.6, "m", 0.8], [15.5, 6.2, 6.0, 0.5, "R", 0.8],
    [12.6, 5.2, 5.5, 0.7, "Q", 0.7], [9.6, 5.8, 5.4, 0.8, "R", 0.7], [7.0, 5.1, 5.6, 0.7, "m", 0.6], [5.0, 5.4, 5.0, 0.9, "R", 0.6]]) items.push([Z, (c) => string(c, Z, Ya, Yb, sag, bulb, every)])
  for (const [Z, Ya, Yb, sag] of [[24, 6.5, 6.2, 0.3], [13.8, 6.6, 6.1, 0.4], [8.3, 6.0, 6.6, 0.5], [6.1, 6.4, 6.0, 0.6]]) items.push([Z, (c) => string(c, Z, Ya, Yb, sag, null)])
  items.push([19.5, (c) => { string(c, 19.5, 6.4, 6.4, 0.2, null); const [x0, y] = P(-3, 6.2, 19.5).map(R), [x1] = P(3, 6.2, 19.5).map(R); c.rect(x0, y, x1 - x0, 2, "M"); c.hline(x0, y, x1 - x0, "m") }])
  // neon hanging from the cables over the channel, one behind the other: the market's lure (magenta), screens (cyan), food (amber)
  for (const [Z, X0, X1, Y0, Y1, kb, kt, text] of [[27, -2.2, 0.6, 4.6, 5.3, "n", "m", "CASH ONLY"], [20.5, 0.4, 3.4, 4.3, 5.0, "c", "v", "FLOOD DEBT? WE BUY"],
    [16.5, -3.2, -0.6, 4.4, 5.1, "O", "R", "NOODLES 24H"], [13.2, 0.6, 2.9, 4.5, 5.3, "n", "m", "LIVE GILLS"], [10.6, -2.4, -0.6, 4.7, 5.5, "c", "v", "SIMS"]])
    items.push([Z, (c) => {
      for (const X of [X0 + 0.2, X1 - 0.2]) ln(c, [X, Y1, Z], [X, Y1 + 0.9, Z], "k")
      board(c, X0, X1, Y0, Y1, Z, kb, kt, text)
      zf(c, X0, X1, Y0 - 0.08, Y0 - 0.02, Z, kt)                                                                      // a tube under it
    }])
  // bare neon tubes on the tier decks' rails, crossing the far channel
  for (const [Z, Y, k] of [[24.5, 5.4, "m"], [17.2, 5.9, "v"], [11.8, 6.3, "m"]]) items.push([Z, (c) => { const [a, y] = P(-3.6, Y, Z).map(R), [b] = P(3.6, Y, Z).map(R); c.hline(a, y, b - a, k); c.hline(a, y + 1, b - a, k === "m" ? "M" : "C") }])
  // a long blue tarp slung over the middle, under it two fans and two tubes
  items.push([9.0, (c) => {
    poly(c, [[-3.4, 4.5, 9.0], [2.8, 4.2, 9.0], [2.8, 4.0, 12.2], [-3.4, 4.3, 12.2]], "b"); ln(c, [-3.4, 4.5, 9.0], [2.8, 4.2, 9.0], "B")
    for (const [X, Z] of [[-1.6, 10.0], [1.2, 11.0]]) { const [x, y] = P(X, 3.6, Z).map(R), [, y0] = P(X, 4.3, Z).map(R), r = R(0.7 * S(Z)); c.vline(x, y0, y - y0, "k"); c.hline(x - r, y, 2 * r + 1, "5"); c.rect(x - 1, y - 1, 3, 2, "k") }
    for (const [X0, X1, Z] of [[-2.8, -1.4, 9.3], [0.2, 1.6, 9.5]]) { const [a, y] = P(X0, 3.9, Z).map(R), [b] = P(X1, 3.9, Z).map(R); c.hline(a, y, b - a, "W"); c.px(a - 1, y, "h"); c.px(b, y, "h") }
  }])
  // the stalls far down the channel (generic: numbered boards, tarps, bulbs, goods)
  for (const [s, Z0, Z1, i] of STALLS) items.push([Z0, (c) => {
    const [kb, kt, num, word] = SIGNS[(i * 2 + (s > 0 ? 1 : 0)) % SIGNS.length]
    stall(c, s, Z0, Z1, { i: i + (s > 0 ? 2 : 0), sign: { kb, kt, text: Z0 < 14 ? `${num}\n${word}` : word, y1: word.includes("\n") && Z0 < 14 ? 3.4 : 3.05 }, hang: hash(i, s) < 0.4 ? ["P", "U", "g"] : null })
  }])
  // the crowd: people on the bed, denser where the floor is narrow on screen; clear in front of everything the story needs
  const crowd = []
  for (let i = 0; i < 900 && crowd.length < 125; i++) {
    const Z = 7.0 + 30 * Math.pow(hash(i, 11), 0.8), X = -2.85 + 5.7 * hash(i, 12)
    if (Z < 11.6 && (X < -2.0 || X > 2.0)) continue                                        // the near stalls, the curtain, the stairs' foot
    if (Math.hypot(X + 0.9, (Z - 8.25) * 0.7) < 1.6) continue                             // nobody near the preacher
    if (Z < 9.5 && hash(i, 13) < 0.6) continue                                               // the near floor stays thin
    if (crowd.some(([x, z]) => Math.abs(x - X) < 0.42 && Math.abs(z - Z) < 0.45)) continue
    crowd.push([X, Z, i])
  }
  const COATS = ["3", "4", "4", "2", "5", "g", "u", "3", "4", "O", "U", "2", "5", "M", "P", "H"]
  for (const [X, Z, i] of crowd) items.push([Z, (c) => {
    const k = COATS[i % COATS.length], skin = ["s", "S", "O", "s"][i % 4]
    person(c, X, Z, k, skin, { h: 0.92 + hash(i, 14) * 0.14, hood: hash(i, 15) < 0.2 ? "2" : null, bag: hash(i, 16) < 0.15 ? "8" : null })
  }])
  // people on the tier decks
  for (const [s, tier, Z, k] of [[1, 2, 7.6, "4"], [1, 2, 11.5, "u"], [-1, 2, 17.5, "3"], [1, 3, 9.2, "5"], [-1, 3, 7.6, "4"], [1, 2, 20, "O"]])
    items.push([Z - 0.01, (c) => person(c, s * (tier === 2 ? 4.95 : 7.3), Z, k, "s", { y: tier === 2 ? 2.5 : 4.8 })])

  // ---- what the story needs, near
  // RIGHT, the food stall at the near edge: wok fire, steam, stools at its counter, a fan under the rust tarp over it
  items.push([4.0, (c) => {
    poly(c, [[1.4, 4.0, 4.2], [5.4, 3.2, 4.2], [5.4, 3.2, 7.0], [1.4, 4.0, 7.0]], "d"); ln(c, [1.4, 4.0, 4.2], [1.4, 4.0, 7.0], "D")
    { const [x, y] = P(3.2, 3.3, 5.6).map(R), [, y0] = P(3.2, 3.8, 5.6).map(R); c.vline(x, y0, y - y0, "k"); c.hline(x - 13, y, 27, "5"); c.rect(x - 1, y - 1, 3, 3, "k") }
    { const [a, y] = P(1.8, 3.6, 4.6).map(R), [b] = P(3.2, 3.8, 4.6).map(R); c.hline(a, y, b - a, "W") }
    stall(c, 1, 4.0, 6.4, { i: 0, tarp: ["O", "P"], seller: "H", goods: ["Q", "P", "h", "O"], sign: { kb: "O", kt: "R", text: "01-07\nWOK HEI", y0: 2.35, y1: 3.15 },
      top: (c) => {
        // the wok on its fire, the flames licking up round its rim
        const [x, y] = P(3.3, 0.95, 5.3).map(R)
        c.rect(x - 8, y - 3, 16, 3, "k"); c.rect(x - 7, y - 6, 14, 3, "O"); c.rect(x - 6, y - 8, 12, 3, "Q"); c.rect(x - 4, y - 10, 8, 3, "R"); c.rect(x - 2, y - 11, 4, 2, "W")
        c.rect(x - 9, y - 9, 18, 3, "k"); c.rect(x - 8, y - 8, 16, 1, "3")                                                      // the wok's rim, black
        c.px(x - 9, y - 11, "Q"); c.px(x + 8, y - 12, "R"); c.px(x + 9, y - 10, "Q")                                            // sparks
        const [x2, y2] = P(3.3, 0.95, 6.2).map(R); c.rect(x2 - 4, y2 - 5, 8, 5, "6"); c.rect(x2 - 3, y2 - 4, 6, 1, "4")       // a stock pot
        for (let j = 0; j < 5; j++) for (let xx = -3 - j; xx <= 3 + j; xx++) if ((xx + j) % 2 === 0) c.px(x2 + xx - j, y2 - 9 - j * 5, "h")
      } })
    // the steam: up from the wok under the awning, out past its valance and on up into the dark, see-through (every other pixel)
    for (let j = 0; j < 16; j++) {
      const [x0, y0] = P(3.3, 0.95, 5.3).map(R), cx = x0 - j * 1.6 + R(Math.sin(j * 0.9) * 2), cy = y0 - 14 - j * 6, rw = 4 + j * 0.7, rh = 3 + j * 0.3
      for (let yy = -rh; yy <= rh; yy++) for (let xx = -rw; xx <= rw; xx++) if ((xx / rw) ** 2 + (yy / rh) ** 2 <= 1 && (R(cx + xx) + R(cy + yy)) % 2 === 0) c.px(R(cx + xx), R(cy + yy), j < 5 ? "W" : j < 10 ? "H" : "h")
    }
    for (const Z of [4.6, 5.4]) box(c, 2.45, 2.8, 0, 0.42, Z, Z + 0.35, "U", "u", "U")                               // plastic stools
    person(c, 2.62, 5.6, "g", "s", { seated: true })
  }])
  // RIGHT, Sable's curtain in a concrete buttress that stands far out of the wall facing us (further in than the food stall, so that
  // doesn't hide it), magenta leaking past it and under its hem
  items.push([7.2, (c) => {
    box(c, 2.0, HB + 0.2, 0, 2.6, 7.2, 8.6, "3", "4", "4")
    ln(c, [2.0, 1.9, 7.2], [HB + 0.2, 1.9, 7.2], "4")
    zf(c, 2.15, 3.6, 0, 2.2, 7.19, "M"); zf(c, 2.25, 3.5, 0.08, 2.2, 7.18, "K")
    for (let X = 2.4; X < 3.45; X += 0.25) zf(c, X, X + 0.08, 0.08, 2.15, 7.17, "J")
    zf(c, 2.15, 2.25, 0.1, 1.7, 7.17, "m"); zf(c, 2.25, 3.5, 0, 0.08, 7.17, "m")
    const [x, y] = P(2.85, 2.35, 7.16).map(R); c.rect(x - 1, y, 3, 2, "R")                                         // one bare bulb over it
  }])
  // RIGHT, the organ trade: white cool boxes, a seller in white, the magenta KIDNEYS ONLY high so it reads over the crowd
  items.push([8.8, (c) => {
    stall(c, 1, 8.8, 10.6, { i: 3, tarp: ["5", "6"], seller: "H", goods: ["h", "H", "6"], top: (c) => { box(c, 3.15, 3.5, 0.95, 1.3, 9.2, 9.7, "H", "h", "H"); box(c, 3.15, 3.5, 0.95, 1.3, 10.0, 10.4, "H", "h", "H") } })
    ln(c, [3.4, 3.3, 8.79], [3.4, 2.55, 8.79], "k")
    board(c, 2.25, 4.5, 2.75, 3.85, 8.78, "n", "m", "KIDNEYS\nONLY")
  }])
  // MIDDLE LEFT, the stairs down (Chapter 2): a railed well in the bed, its far wall and the first steps showing in the dark, a dim
  // red lamp down there; its gate faces us, chained, the padlock red (a locked door), CLOSED on it
  items.push([PIT.Z0, (c) => {
    const { X0, X1, Z0, Z1 } = PIT, D = 2.4
    // inside, far to near: the far wall (its top shows over the near rim), the left wall, a red lamp's light at the bottom
    yf(c, 0, X0, X1, Z0, Z1, "k")
    zf(c, X0, X1, -D, 0, Z1, "1"); zf(c, X0 + 0.3, X1 - 0.3, -D, -0.55, Z1 - 0.01, "k"); zf(c, X0 + 0.3, X1 - 0.3, -0.62, -0.55, Z1 - 0.01, "r")
    xf(c, X0, -D, 0, Z0, Z1, "2"); for (let j = 1; j < 9; j++) ln(c, [X0, -0.25 * j, Z1 - 0.2 * j], [X0, -0.25 * j - 0.25, Z1 - 0.2 * j], "4")   // the steps' line on the side wall
    zf(c, X0 + 0.05, X1 - 0.05, -0.1, 0, Z1 - 0.02, "n")
    TXT.draw(c, R(P((X0 + X1) / 2, 0, Z1)[0]), R(P(0, -0.12, Z1)[1]), "SUMP 2", "r", { font: "hud", align: "center" })
    // the near rim hides the bottom: the bed in front of the well is drawn again
    yf(c, 0, X0 - 0.05, X1 + 0.05, ZN, Z0, "f")
    // the rails on the far and the two long sides
    ln(c, [X0, 1.0, Z1], [X1, 1.0, Z1], "6"); for (const X of [X0, (X0 + X1) / 2, X1]) ln(c, [X, 0, Z1], [X, 1.0, Z1], "5")
    for (const X of [X0, X1]) { ln(c, [X, 1.0, Z0], [X, 1.0, Z1], "6"); for (const Z of [Z0, (Z0 + Z1) / 2, Z1]) ln(c, [X, 0, Z], [X, 1.0, Z], "5") }
    // the gate across the near side, facing us: its frame, bars, the chain across, the red padlock, the sign
    zf(c, X0, X1, 0.96, 1.04, Z0, "6"); zf(c, X0, X1, 0.02, 0.08, Z0, "5")
    for (let X = X0; X <= X1 + 0.01; X += 0.22) zf(c, X, X + 0.04, 0, 1.0, Z0, "5")
    ln(c, [X0 + 0.1, 0.3, Z0 - 0.02], [X1 - 0.1, 0.22, Z0 - 0.02], "g"); ln(c, [X0 + 0.1, 0.31, Z0 - 0.02], [X1 - 0.1, 0.23, Z0 - 0.02], "4")
    const [px, py] = P((X0 + X1) / 2 + 0.05, 0.3, Z0 - 0.03).map(R); c.rect(px - 2, py - 1, 5, 6, "k"); c.rect(px - 1, py, 3, 4, "r"); c.px(px, py + 1, "q")
    board(c, X0 + 0.15, X1 - 0.15, 0.55, 0.88, Z0 - 0.04, "6", "k", "CLOSED")
  }])
  // LEFT, the EXIT sign on its post at the foot of the stairs up (green, as exits are), lit
  items.push([STAIR.Z0 - 0.02, (c) => { ln(c, [-3.35, 0, STAIR.Z0 - 0.02], [-3.35, 1.7, STAIR.Z0 - 0.02], "5"); board(c, -4.35, -3.3, 1.7, 2.2, STAIR.Z0 - 0.03, "L", "W", "EXIT") }])
  // LEFT, Ratz's junk stall: old screens, a cable bundle, Ratz on the counter's near end, sitting up, his headphones cyan
  items.push([6.4, (c) => {
    stall(c, -1, 6.4, 8.2, { i: 1, tarp: ["b", "B"], seller: false, goods: ["5", "c", "g", "6", "C"], sign: { kb: "c", kt: "v", text: "01-12\nPARTS" }, hang: ["k", "g", "5"],
      top: (c) => {
        box(c, -3.55, -3.15, 0.95, 1.4, 7.3, 7.8, "2", "3", "4"); xf(c, -3.15, 1.02, 1.33, 7.35, 7.75, "C")         // a CRT, lit
        box(c, -3.6, -3.2, 1.4, 1.75, 7.4, 7.8, "2", "3", "4"); xf(c, -3.2, 1.45, 1.7, 7.45, 7.75, "v")
        box(c, -3.55, -3.15, 0.95, 1.15, 7.85, 8.1, "g", "5", "6")
        // Ratz: a cable rat as big as a small dog (about 0.6 m sitting up), seen from the side, his snout to the walk band;
        // grey-green fur, a pale belly, the patched speech collar, cyan headphones, the long tail hanging down the counter
        const [x, y] = P(-3.3, 0.95, 6.75).map(R)
        c.rect(x - 7, y - 11, 11, 11, "k"); c.rect(x - 6, y - 10, 9, 10, "G"); c.rect(x - 1, y - 8, 3, 8, "H"); c.rect(x - 6, y - 2, 4, 2, "g")
        c.rect(x - 2, y - 18, 10, 8, "k"); c.rect(x - 1, y - 17, 7, 6, "G"); c.rect(x + 5, y - 14, 3, 3, "G"); c.px(x + 8, y - 13, "S")   // head, snout, nose
        c.px(x + 3, y - 15, "k"); c.px(x + 3, y - 16, "V")                                                                          // the eye
        c.rect(x - 2, y - 21, 3, 4, "k"); c.rect(x - 1, y - 20, 1, 2, "S"); c.rect(x + 2, y - 22, 3, 4, "k"); c.rect(x + 3, y - 21, 1, 2, "S")   // ears
        c.hline(x - 2, y - 19, 7, "v"); c.rect(x - 2, y - 17, 2, 4, "v")                                                       // headphones
        c.rect(x - 2, y - 11, 8, 2, "O"); c.px(x + 2, y - 11, "Q")                                                              // the speech collar, its LED
        c.line(x - 7, y - 1, x - 10, y + 3, "6"); c.line(x - 10, y + 3, x - 9, y + 11, "6")                                     // tail
      } })
  }])
  // LEFT, used implants in jars: a lit glass case facing us at the stall's near end, more jars on the counter
  items.push([8.4, (c) => {
    stall(c, -1, 8.4, 10.2, { i: 4, tarp: ["u", "U"], seller: "3", goods: ["c", "C", "6"], sign: { kb: "k", kt: "v", text: "USED\nIMPLANTS", y0: 3.5, y1: 4.5 },
      top: (c) => { for (let Z = 8.7; Z < 10.0; Z += 0.35) { const [x, y] = P(-3.35, 0.95, Z).map(R); c.rect(x - 1, y - 4, 3, 4, "c"); c.px(x, y - 3, "v") } } })
    zf(c, -HB, -3.1, 0.05, 0.98, 8.38, "k"); zf(c, -4.45, -3.2, 0.12, 0.9, 8.37, "c")
    for (let X = -4.3; X < -3.3; X += 0.28) for (const Y of [0.2, 0.55]) { const [x, y] = P(X, Y + 0.28, 8.36).map(R); c.rect(x, y, 3, 4, "C"); c.px(x + 1, y + 1, "v"); c.px(x + 1, y + 2, "S") }
  }])
  // MIDDLE, the preacher of the Wache Kirche on his crate, his placard up, a thermos of coffee at his feet; nobody listens
  items.push([8.0, (c) => {
    box(c, -1.25, -0.55, 0, 0.5, 8.0, 8.5, "8", "7", "8")
    const [x, y] = P(-0.6, 0.5, 8.0).map(R); c.rect(x + 1, y - 6, 3, 6, "C")
    person(c, -0.9, 8.25, "?", "S", { y: 0.5, arms: true, shade: "!" })
    board(c, -1.8, 0.0, 2.35, 2.95, 8.24, "h", "k", "WAKE UP")
    const [lx, ly] = P(-0.9, 3.3, 8.25).map(R), [, l0] = P(-0.9, 4.4, 8.25).map(R); c.vline(lx, l0, ly - l0, "k"); c.rect(lx - 1, ly, 3, 2, "R")
  }])
  // Juno, for scale: 50 px in the walk band
  items.push([5.0, (c) => person(c, 0.9, 5.0, "y", "S", { hood: "y", shade: "j", bag: "g" })])

  const front = (c) => items.sort((p, q) => q[0] - p[0]).forEach(([, draw]) => draw(c))

  // where the story's things are on the screen (for the report): their hotspot boxes [x0, y0, x1, y1]
  const bx = (pts) => { const q = pts.map((p) => P(...p).map(R)); return [Math.min(...q.map((p) => p[0])), Math.min(...q.map((p) => p[1])), Math.max(...q.map((p) => p[0])), Math.max(...q.map((p) => p[1]))] }
  console.log("DM_B " + JSON.stringify({
    walk: bx([[-2.9, 0, 4.0], [2.2, 0, 4.0], [-2.9, 0, 6.6], [2.2, 0, 6.6]]), juno: bx([[0.9, 0, 5], [0.9, 1.68, 5]]),
    stairsUp: bx([[-3.3, 0, 4.4], [-(HB + TOP), TOP + 2.2, 13.9]]), stairsDown: bx([[PIT.X0, 0, PIT.Z0], [PIT.X1, 1.04, PIT.Z0]]),
    ratz: bx([[-3.1, 0, 6.4], [-HB, 2.2, 8.2]]), jars: bx([[-3.1, 0, 8.4], [-HB, 1.0, 8.4]]), food: bx([[2.75, 0, 4.0], [HB, 2.5, 6.6]]),
    curtain: bx([[3.2, 0, 7.1], [4.45, 2.15, 7.1]]), kidneys: bx([[2.25, 2.75, 8.8], [4.5, 3.85, 8.8]]), preacher: bx([[-1.8, 0, 8.25], [0, 2.95, 8.25]]),
  }))
  return { W, H, back, front }
})()

scene("drain_market_b", { w: DMB.W, h: DMB.H, bg: "k" }, DMB.back, DMB.front,
  glow("RW", { r: 3, strength: 0.35 }), glow("m", { r: 4, strength: 0.4 }), glow("v", { r: 3, strength: 0.3 }), glow("Q", { r: 3, strength: 0.25 }))

// Drain Market, draft C (one of three drafts for the user to compare): the black market in the drained flood channel in
// street mode's 2:1 iso, at the game's scale (style guide §4: 16 units of u or v a meter, 30 px a meter of height). Blocks only,
// no painted detail: enough to judge the layout, the density and what stays readable in a crowd.
//
//   drain_market_c   640x360 (scrolls both ways). The channel's bed runs along u (top left to bottom right) and leaves the
//                    picture at both ends. v crosses it: the far wall's slope at v -2..0 (rising 3.6 m), the bed v 0..7.4,
//                    the near wall cut to a low stub past the water. Across the bed, from the far wall: the stall row (v 0..1.75, its
//                    awnings and signs), aisle A (the walking aisle, v 1.75..3.3), the middle strip (tables, the preacher,
//                    the stairs down; low, v 3.3..4.9), aisle B (v 4.9..6.1), the floor sellers along the near stub. Shacks on
//                    stilts on the slope over the stall row; above the rim the Ninth's street with its railing. The stairs up
//                    to the alley come straight down the slope into aisle A; Sable's curtain hangs in an old outfall's headwall
//                    in the far slope (u 11..12.9, inside the picture). Past the bed's near edge the low-flow channel holds still
//                    water (v 7.4..9.4, 0.4 m down) with the lights smeared in it; the near wall is cut to a stub beyond it.
//                    Juno (yellow, 1.68 m) stands in aisle A at the stairs' foot for scale.
// In iso anything high covers what stands up to ~2 m behind it, so the tarps hang only where they cover no story thing, and the
// crowd keeps out of each story thing's screen column in front of it (aisle A's near side only, the gate's front kept clear).
// Light as flat pools (warm / magenta / cyan floor keys) and a glow on the neon; the tarps and the steam are see-through (checkerboard).
include("../lib/iso.js", { palette: true })
include("../lib/text.js")
pal({
  J: "#22101a", K: "#3a1624", F: "#57222f", p: "#7a3a40",            // Sable's curtain, heavy and old
  7: "#33241c", 8: "#54392a", 9: "#7a5638",                          // wood, crates, cardboard
  d: "#3e3430", D: "#56483e", E: "#74624f",                          // brown cloth
  l: "#28322e", L: "#3a4a40", o: "#566a5a",                          // olive cloth
  b: "#2a2638", B: "#3d3752", 0: "#58507a",                          // dark violet cloth
  "!": "#9c8f70", "?": "#d8c8a0",                                    // the preacher (style guide §6: coffee with too much milk)
  "=": "#1c3352", "*": "#2a4f7c",                                    // blue tarp
  "+": "#245a4c", "~": "#3a8670",                                    // green plastic stools
  "@": "#bdb6a6", "^": "#5e3a2a", "<": "#b98a6a",                    // formica white; darker and paler skin
})

const DMC = (() => {
  const W = 640, H = 360, CX = 224, CY = 97
  const P = (u, v, h = 0) => [CX + 32 * (u - v), CY + 16 * (u + v) - 30 * h]
  const RIM = 3.6, RUN = 2, BED = 7.4, WET = 9.4, WH = -0.4     // the low-flow channel along the near side: v 7.4..9.4, its water 0.4 m down
  const slopeH = (v) => (v >= 0 ? 0 : Math.min(RIM, (-v * RIM) / RUN))
  const hash = ISO.ihash

  // ---- filling shapes: a convex polygon by the centres of its pixels (chk: every other pixel, see-through)
  function inside(pts, x, y) {
    let pos = 0, neg = 0
    for (let i = 0; i < pts.length; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length], d = (x1 - x0) * (y + 0.5 - y0) - (y1 - y0) * (x + 0.5 - x0)
      if (d > 0) pos++; else if (d < 0) neg++
    }
    return !(pos && neg)
  }
  function poly(c, pts, k, chk) {
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1])
    for (let y = Math.max(0, Math.floor(Math.min(...ys))); y <= Math.min(H - 1, Math.ceil(Math.max(...ys))); y++)
      for (let x = Math.max(0, Math.floor(Math.min(...xs))); x <= Math.min(W - 1, Math.ceil(Math.max(...xs))); x++)
        if ((!chk || (x + y) % 2 === 0) && inside(pts, x, y)) c.px(x, y, k)
  }
  const quad = (c, a, b, d, e, k, chk) => poly(c, [P(...a), P(...b), P(...d), P(...e)], k, chk)
  // a box standing at (u, v, h): m = [top, +v face (lower left), +u face (lower right)]
  function box(c, u, v, h, du, dv, dh, m, chk) {
    const u1 = u + du, v1 = v + dv, h1 = h + dh
    if (m[2]) quad(c, [u1, v, h], [u1, v1, h], [u1, v1, h1], [u1, v, h1], m[2], chk)
    if (m[1]) quad(c, [u, v1, h], [u1, v1, h], [u1, v1, h1], [u, v1, h1], m[1], chk)
    if (m[0]) quad(c, [u, v, h1], [u1, v, h1], [u1, v1, h1], [u, v1, h1], m[0], chk)
  }
  const line3 = (c, a, b, k) => c.line(...P(...a).map(Math.round), ...P(...b).map(Math.round), k)
  // a flat floor pool: an ellipse in (u, v), two flat rings
  function pool(c, u, v, ru, rv, inner, outer) {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const d = (x - CX) / 32, s = (y - CY) / 16, pu = (s + d) / 2, pv = (s - d) / 2
      if (pv < 0 || pv > BED) continue
      const r = ((pu - u) / ru) ** 2 + ((pv - v) / rv) ** 2
      if (r < 0.45) c.px(x, y, inner); else if (r < 1) c.px(x, y, outer)
    }
  }
  // text on a face along u (normal +v): sheared down to the right, 1 px down every 2 px across
  function signV(c, u0, u1, v, h0, h1, board, lines, k) {
    quad(c, [u0, v, h0], [u1, v, h0], [u1, v, h1], [u0, v, h1], board)
    const [x0, y0] = P(u0, v, h1), wpx = 32 * (u1 - u0), n = lines.length, th = n * 5 + (n - 1) * 2, hpx = 30 * (h1 - h0)
    const top = Math.round(y0 + (hpx - th) / 2)
    lines.forEach((s, i) => {
      const tw = TXT.measure(s, "hud"), ox = Math.round(x0 + (wpx - tw) / 2)
      const sh = { px: (x, y, kk) => c.px(x, y + Math.floor((x - Math.round(x0)) / 2), kk) }
      TXT.draw(sh, ox, top + i * 7, s, k, { font: "hud" })
    })
  }

  // ---- what stands: entities with an iso footprint, drawn back to front by a topological order
  const ents = []
  const E = (u0, v0, du, dv, h0, dh, draw) => ents.push({ u0, v0, u1: u0 + du, v1: v0 + dv, h0, h1: h0 + dh, draw })
  function bbox(e) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9
    for (const u of [e.u0, e.u1]) for (const v of [e.v0, e.v1]) for (const h of [e.h0, e.h1]) {
      const [x, y] = P(u, v, h); x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y)
    }
    return [x0, y0, x1, y1]
  }
  function order() {
    const bb = ents.map(bbox), pre = ents.map(() => [])
    for (let i = 0; i < ents.length; i++) for (let j = i + 1; j < ents.length; j++) {
      const A = bb[i], B = bb[j]
      if (A[2] <= B[0] + 0.5 || B[2] <= A[0] + 0.5 || A[3] <= B[1] || B[3] <= A[1]) continue
      const a = ents[i], b = ents[j], e = 1e-6
      let aFirst
      if (a.u1 <= b.u0 + e || a.v1 <= b.v0 + e) aFirst = true
      else if (b.u1 <= a.u0 + e || b.v1 <= a.v0 + e) aFirst = false
      else aFirst = a.h0 !== b.h0 ? a.h0 < b.h0 : a.u0 + a.v0 < b.u0 + b.v0
      if (aFirst) pre[j].push(i); else pre[i].push(j)
    }
    const out = [], seen = ents.map(() => 0)
    const visit = (i) => { if (seen[i]) return; seen[i] = 1; for (const p of pre[i]) visit(p); out.push(ents[i]) }
    ents.forEach((_, i) => visit(i))
    return out
  }

  // ---- people as blocks: legs, a coat, a head (its face on the side they look to)
  const COATS = {
    grey: ["5", "4", "3"], steel: ["6", "5", "4"], brown: ["E", "D", "d"], olive: ["o", "L", "l"], violet: ["0", "B", "b"],
    dark: ["3", "2", "1"], white: ["@", "H", "h"], magenta: ["m", "M", "n"], cyanv: ["v", "C", "c"], umber: ["9", "8", "7"],
    plum: ["p", "F", "K"], sat: ["G", "g", "4"],
  }
  const SKINS = [["S", "s"], ["s", "^"], ["<", "s"], ["S", "<"]]
  function person(c, u, v, o) {
    const h0 = o.h0 ?? 0, tall = o.tall ?? 1.72, seat = o.seated ? 0.45 : 0
    const coat = COATS[o.coat ?? "grey"], skin = SKINS[o.skin ?? 0], hair = o.hair ?? "k"
    const legs = o.legs ?? ["2", "1", "k"]
    const legTop = o.seated ? 0.45 : 0.42 * tall, torsoTop = o.seated ? 0.45 + 0.58 * tall - 0.45 * 1.0 : 0.82 * tall
    const headTop = o.seated ? torsoTop + 0.25 : tall
    if (!o.seated) box(c, u - 0.13, v - 0.09, h0, 0.26, 0.18, legTop, legs)
    else box(c, u - 0.14, v - 0.12, h0, 0.28, 0.24, seat, ["+", "~", "+"])              // the stool under them
    const cl = o.long ? 0.25 * tall : 0                                                    // a long coat comes down over the legs
    box(c, u - 0.18, v - 0.13, h0 + legTop - cl, 0.36, 0.26, torsoTop - legTop + cl, coat)
    if (o.bag) box(c, u + 0.12, v - 0.02, h0 + legTop - 0.05, 0.12, 0.16, 0.24, COATS[o.bag])
    const f = o.face ?? "sw", away = f === "ne" || f === "nw"
    const fv = away ? hair : f === "sw" ? skin[0] : hair, fu = away ? hair : f === "se" ? skin[1] : hair
    box(c, u - 0.1, v - 0.09, h0 + torsoTop + 0.02, 0.2, 0.18, headTop - torsoTop - 0.02, [o.hat ?? hair, fv, fu])
    if (o.hood) box(c, u - 0.11, v - 0.1, h0 + headTop - 0.06, 0.22, 0.2, 0.09, [o.hood[0], o.hood[1], o.hood[2]])
  }
  const P_FOOT = [0.36, 0.26]
  const who = (u, v, o) => E(u - 0.18, v - 0.13, P_FOOT[0], P_FOOT[1], o.h0 ?? 0, (o.tall ?? 1.72) + 0.05, (c) => person(c, u, v, o))

  // ---- a stall against the far wall: back shelf, vendor, counter, awning, the numbered board, a tube
  function stall(s) {
    const { u0, du } = s, u1 = u0 + du
    E(u0, 0, du, 1.75, 0, 2.95, (c) => {
      box(c, u0 + 0.05, 0.02, 0, du - 0.1, 0.35, 2.15, s.shelf ?? ["4", "3", "2"])
      // goods on the shelf: three rows of small blocks, their colours picked by the stall
      for (let row = 0; row < 3; row++) for (let i = 0; i < Math.floor(du * 3); i++) {
        const g = s.goods[Math.floor(hash(i + 7 * row, u0 * 10) * s.goods.length)], ua = u0 + 0.12 + i * 0.32
        if (ua + 0.22 > u1 - 0.05 || hash(i, row + u0 * 3) < 0.18) continue
        box(c, ua, 0.37, 0.75 + row * 0.45, 0.22, 0.06, 0.28, [g, g, g])
      }
      if (s.vendor) person(c, u0 + du / 2, 0.62, s.vendor)
      box(c, u0 + 0.05, 0.95, 0, du - 0.1, 0.48, 0.9, s.counter ?? ["5", "3", "2"])
      if (s.top) s.top(c)
      // the awning, sloping down to the aisle, and its valance
      quad(c, [u0 - 0.05, -0.05, 2.95], [u1 + 0.05, -0.05, 2.95], [u1 + 0.05, 1.75, 2.5], [u0 - 0.05, 1.75, 2.5], s.tarp[0])
      quad(c, [u0 - 0.05, 1.75, 2.5], [u1 + 0.05, 1.75, 2.5], [u1 + 0.05, 1.75, 2.36], [u0 - 0.05, 1.75, 2.36], s.tarp[1])
      quad(c, [u1 + 0.05, -0.05, 2.95], [u1 + 0.05, 1.75, 2.5], [u1 + 0.05, 1.75, 2.36], [u1 + 0.05, -0.05, 2.81], s.tarp[2])
      for (const uu of [u0, u1 - 0.06]) box(c, uu, 1.62, 0, 0.06, 0.06, 2.4, ["5", "4", "3"])
      // the tube under the awning's edge
      line3(c, [u0 + 0.25, 1.6, 2.32], [u1 - 0.25, 1.6, 2.32], s.tube ?? "V")
      if (s.sign) signV(c, u0 + 0.1, u1 - 0.1, 1.8, 2.5, 2.96, s.sign[0], s.sign[2], s.sign[1])
    })
  }

  // ---- the place's contents
  const FAR = [
    { u0: -4.1, du: 2.0, tarp: ["*", "=", "="], goods: ["v", "C", "6", "5"], tube: "V", vendor: { coat: "dark", face: "sw", skin: 2 },
      sign: ["c", "v", ["#01-01", "SIM 2 CHITS"]], counter: ["6", "4", "3"], light: "cyan",
      top: (c) => { for (let i = 0; i < 4; i++) box(c, -3.85 + i * 0.45, 1.05, 0.9, 0.3, 0.2, 0.04, ["v", "C", "c"]) } },
    // Ratz's junk stall: cables, boards, old screens; Ratz himself sits on the counter's left end
    { u0: -1.9, du: 2.1, tarp: ["u", "U", "u"], goods: ["6", "5", "C", "9", "4"], vendor: null,
      sign: ["O", "R", ["#01-03", "JUNK + PARTS"]], counter: ["4", "3", "2"], light: "warm", tube: "R",
      top: (c) => {
        box(c, -0.6, 1.0, 0.9, 0.5, 0.35, 0.3, ["5", "c", "3"]); box(c, -0.55, 1.3, 0.95, 0.4, 0.02, 0.2, [null, "C", null])   // an old screen
        box(c, -0.05, 1.05, 0.9, 0.18, 0.3, 0.06, ["9", "8", "7"])
        // Ratz: a cable rat as big as a small dog, sitting up, headphones
        const ru = -1.45, rv = 1.0
        box(c, ru, rv, 0.9, 0.4, 0.34, 0.36, ["E", "D", "d"])                                                              // the body, sitting up
        box(c, ru + 0.1, rv + 0.34, 0.95, 0.2, 0.02, 0.24, [null, "<", null])                                               // the pale belly
        box(c, ru + 0.06, rv + 0.1, 1.26, 0.28, 0.26, 0.24, ["E", "D", "d"])                                               // the head
        box(c, ru + 0.12, rv + 0.36, 1.3, 0.16, 0.14, 0.12, ["D", "E", "d"]); box(c, ru + 0.17, rv + 0.5, 1.33, 0.06, 0.02, 0.05, [null, "S", null])   // snout, nose
        box(c, ru + 0.04, rv + 0.12, 1.5, 0.08, 0.06, 0.12, ["S", "S", "d"]); box(c, ru + 0.3, rv + 0.12, 1.5, 0.08, 0.06, 0.12, ["S", "S", "d"])      // ears
        box(c, ru + 0.02, rv + 0.2, 1.32, 0.05, 0.1, 0.12, ["v", "C", "v"]); box(c, ru + 0.33, rv + 0.2, 1.32, 0.05, 0.1, 0.12, ["v", "C", "v"])     // headphones
        line3(c, [ru + 0.05, rv + 0.25, 1.52], [ru + 0.37, rv + 0.25, 1.52], "v")
        box(c, ru + 0.08, rv + 0.36, 1.42, 0.04, 0.01, 0.04, [null, "k", null]); box(c, ru + 0.26, rv + 0.36, 1.42, 0.04, 0.01, 0.04, [null, "k", null])   // eyes
        box(c, ru + 0.06, rv + 0.3, 1.2, 0.3, 0.06, 0.06, ["O", "O", "O"])                                                 // the patched speech collar
        line3(c, [ru + 0.4, rv + 0.2, 0.92], [ru + 0.7, rv + 0.46, 0.9], "S"); line3(c, [ru + 0.7, rv + 0.46, 0.9], [ru + 0.75, rv + 0.48, 0.45], "S")  // the tail
      } },
    // used implants in glass jars, rows of them on the counter
    { u0: 0.3, du: 2.0, tarp: ["*", "=", "="], goods: ["T", "C", "6"], vendor: { coat: "violet", face: "sw", skin: 1, tall: 1.65 },
      sign: ["c", "V", ["#01-05", "USED CHROME"]], counter: ["4", "3", "2"], light: "cyan",
      top: (c) => { for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) { const u = 0.45 + i * 0.29, v = 1.02 + r * 0.22
        box(c, u, v, 0.9, 0.14, 0.12, 0.2, ["V", "T", "t"]); box(c, u + 0.04, v + 0.1, 0.95, 0.06, 0.02, 0.07, [null, i % 2 ? "m" : "C", null]) } } },
    // the organ stall: coolers, a magenta board
    { u0: 2.4, du: 1.8, tarp: ["b", "n", "b"], goods: ["@", "H", "6"], vendor: { coat: "white", face: "sw", skin: 3, tall: 1.8, hair: "1" },
      sign: ["n", "m", ["#01-07", "KIDNEYS ONLY"]], counter: ["@", "h", "5"], light: "magenta", tube: "N",
      top: (c) => { box(c, 2.55, 1.0, 0.9, 0.55, 0.38, 0.32, ["@", "H", "h"]); box(c, 3.25, 1.0, 0.9, 0.55, 0.38, 0.32, ["@", "H", "h"]); box(c, 2.6, 1.37, 1.0, 0.4, 0.02, 0.06, [null, "C", null]) } },
    // the food stall: a wok on its fire, the steam goes up through the awning's slot (drawn in the overlay)
    { u0: 7.0, du: 2.6, tarp: ["P", "O", "O"], goods: ["Q", "9", "@", "8"], vendor: { coat: "white", face: "se", skin: 1, tall: 1.66 },
      sign: ["O", "R", ["#01-11", "WOK HEI"]], counter: ["6", "4", "3"], light: "warm", tube: "R",
      top: (c) => {
        box(c, 7.25, 1.05, 0.9, 0.7, 0.36, 0.12, ["3", "2", "1"])
        box(c, 7.3, 1.12, 0.92, 0.6, 0.3, 0.1, ["Q", "P", "O"])                                                         // the burner's flame
        for (let i = 0; i < 7; i++) { const [x, y] = P(7.4 + i * 0.07, 1.4, 1.12).map(Math.round); c.vline(x, y - 1 - (i % 3), 2 + (i % 3), i % 2 ? "Q" : "R") }
        box(c, 7.35, 1.1, 1.02, 0.42, 0.28, 0.08, ["1", "k", "k"])
        for (let i = 0; i < 4; i++) box(c, 8.15 + i * 0.32, 1.08, 0.9, 0.24, 0.24, 0.1, ["@", "H", "h"])
      } },
    { u0: 16.5, du: 1.6, tarp: ["O", "7", "7"], goods: ["@", "9", "Q"], vendor: { coat: "brown", face: "sw", skin: 0, tall: 1.6 },
      sign: ["7", "R", ["#01-13", "KOPI"]], counter: ["5", "3", "2"], light: "warm", tube: "R",
      top: (c) => { box(c, 16.65, 1.0, 0.9, 0.3, 0.3, 0.38, ["6", "5", "4"]); for (let i = 0; i < 3; i++) box(c, 17.15 + i * 0.25, 1.15, 0.9, 0.12, 0.12, 0.1, ["@", "H", "h"]) } },
    { u0: 9.7, du: 1.25, tarp: ["*", "=", "="], goods: ["C", "v", "5"], vendor: null,
      sign: ["c", "v", ["CHARGE", "5 CHITS"]], counter: ["5", "3", "2"], light: "cyan",
      top: (c) => { for (let i = 0; i < 3; i++) { box(c, 9.85 + i * 0.32, 1.1, 0.9, 0.2, 0.12, 0.26, ["4", "3", "2"]); box(c, 9.88 + i * 0.32, 1.22, 1.08, 0.12, 0.01, 0.04, [null, i % 3 ? "v" : "q", null]) } } },
    { u0: 14.4, du: 2.0, tarp: ["u", "U", "u"], goods: ["v", "C", "o"], vendor: { coat: "olive", face: "sw", skin: 2 },
      sign: ["c", "v", ["#01-19", "TIDE MODS"]], counter: ["4", "3", "2"], light: "cyan" },
  ]
  FAR.forEach(stall)

  // shacks on stilts on the slope, over the stall row's awnings, each with a neon sign on its roof
  const SHACK_SIGNS = [["n", "m", "PAWN"], ["c", "v", "REPAIR"], ["O", "R", "SOUP"], ["n", "m", "GILLS"], ["c", "v", "BATTS"], ["n", "m", "24H"], ["O", "R", "BAO"]]
  const SHACKS = [[-4.4, 1.6, "2"], [-2.4, 1.9, "R"], [-0.2, 1.7, "v"], [1.8, 1.9, "R"], [6.3, 2.1, "m"], [8.7, 1.6, "R"], [14.5, 1.8, "R"], [16.5, 1.7, "m"]]
  for (const [u0, du, win] of SHACKS) E(u0, -1.75, du, 1.3, 1.9, 1.45, (c) => {
    for (const uu of [u0 + 0.1, u0 + du - 0.15]) box(c, uu, -0.55, slopeH(-0.5), 0.06, 0.06, 1.9 - slopeH(-0.5), ["4", "3", "2"])
    box(c, u0, -1.75, 1.9, du, 1.3, 1.25, ["3", "4", "2"])
    quad(c, [u0 - 0.1, -1.8, 3.25], [u0 + du + 0.1, -1.8, 3.25], [u0 + du + 0.1, -0.35, 3.15], [u0 - 0.1, -0.35, 3.15], "5")
    if (win !== "2") quad(c, [u0 + 0.3, -0.45, 2.55], [u0 + 0.9, -0.45, 2.55], [u0 + 0.9, -0.45, 2.95], [u0 + 0.3, -0.45, 2.95], win)
    // a neon sign standing on the roof's front edge
    const sg = SHACK_SIGNS[Math.round(u0 * 10 + 100) % SHACK_SIGNS.length]
    for (const uu of [u0 + 0.3, u0 + du - 0.3]) line3(c, [uu, -0.4, 3.15], [uu, -0.4, 3.3], "3")
    signV(c, u0 + 0.15, u0 + du - 0.15, -0.38, 3.3, 3.75, sg[0], [sg[2]], sg[1])
    line3(c, [u0 + 0.15, -0.37, 3.29], [u0 + du - 0.15, -0.37, 3.29], sg[1])
  })

  // the stairs up to the alley: straight down the slope into aisle A, a landing at the foot
  const ST = { u0: 4.5, du: 1.2 }
  E(ST.u0, -2.05, ST.du, 2.45, 0, RIM, (c) => {
    const n = 12
    for (let i = 0; i < n; i++) {
      const v = -2.05 + (i * 2.2) / n, h = RIM - ((i + 1) * RIM) / n
      box(c, ST.u0, v, h, ST.du, 2.2 / n, RIM / n, ["6", "5", "4"])
    }
    box(c, ST.u0 - 0.1, 0.15, 0, ST.du + 0.2, 0.25, 0.06, ["5", "4", "3"])
    for (const uu of [ST.u0 - 0.04, ST.u0 + ST.du]) {
      line3(c, [uu, -2.05, RIM + 1.0], [uu, 0.3, 1.0], "6")
      for (let i = 0; i <= 4; i++) { const v = -2.05 + i * 0.585, h = slopeH(v); line3(c, [uu, v, h], [uu, v, h + 1.0], "5") }
    }
  })

  // Sable's booth: an old outfall's concrete headwall in the slope, the curtain hung in its mouth
  E(11.0, -0.9, 1.85, 0.9, 0, 2.7, (c) => {
    box(c, 11.0, -0.9, 0, 1.85, 0.9, 2.7, ["4", "3", "2"])
    quad(c, [11.3, 0, 0], [12.55, 0, 0], [12.55, 0, 2.05], [11.3, 0, 2.05], "J")
    for (let i = 0; i < 6; i++) { const u = 11.35 + i * 0.2; quad(c, [u, 0, 0.02], [u + 0.1, 0, 0.02], [u + 0.1, 0, 1.98], [u, 0, 1.98], i % 2 ? "K" : "F") }
    // the booth's own magenta leaking out past the curtain's edges and under its hem
    quad(c, [11.3, 0, 0], [11.36, 0, 0], [11.36, 0, 2.0], [11.3, 0, 2.0], "m")
    quad(c, [12.49, 0, 0], [12.55, 0, 0], [12.55, 0, 2.0], [12.49, 0, 2.0], "M")
    quad(c, [11.3, 0, 0], [12.55, 0, 0], [12.55, 0, 0.06], [11.3, 0, 0.06], "m")
    box(c, 11.85, 0.02, 2.2, 0.15, 0.08, 0.15, ["Q", "R", "P"])                            // a bulb over it
  })

  // the middle strip: the stairs down (Chapter 2, chained shut), the preacher, tables under the fans
  const PIT = { u0: -0.9, v0: 3.45, du: 1.5, dv: 1.3 }
  E(PIT.u0 - 0.06, PIT.v0 - 0.06, PIT.du + 0.12, PIT.dv + 0.12, 0, 1.05, (c) => {
    const { u0, v0, du, dv } = PIT
    quad(c, [u0, v0, 0], [u0 + du, v0, 0], [u0 + du, v0 + dv, 0], [u0, v0 + dv, 0], "k")
    for (let i = 1; i < 6; i++) { const u = u0 + 0.15 + i * 0.22; quad(c, [u, v0 + 0.15, 0], [u + 0.07, v0 + 0.15, 0], [u + 0.07, v0 + dv - 0.15, 0], [u, v0 + dv - 0.15, 0], i < 3 ? "2" : "1") }
    for (const [a, b] of [[[u0, v0], [u0 + du, v0]], [[u0, v0], [u0, v0 + dv]], [[u0 + du, v0], [u0 + du, v0 + dv]]]) {
      line3(c, [...a, 1.0], [...b, 1.0], "6"); line3(c, [...a, 0], [...a, 1.0], "5"); line3(c, [...b, 0], [...b, 1.0], "5")
    }
    // the gate across the near side: chained, a red tag on the lock (a locked door: the one red)
    for (let i = 0; i <= 6; i++) { const u = u0 + (i * du) / 6; line3(c, [u, v0 + dv, 0], [u, v0 + dv, 1.0], "5") }
    line3(c, [u0, v0 + dv, 1.0], [u0 + du, v0 + dv, 1.0], "6"); line3(c, [u0, v0 + dv, 0.5], [u0 + du, v0 + dv, 0.5], "4")
    line3(c, [u0 + 0.3, v0 + dv, 0.75], [u0 + du - 0.3, v0 + dv, 0.55], "G")
    box(c, u0 + 0.7, v0 + dv, 0.5, 0.1, 0.04, 0.12, ["q", "q", "r"])
    signV(c, u0 + 0.15, u0 + du - 0.15, v0 + dv + 0.01, 0.62, 0.95, "5", ["SUMP 2"], "1")
  })
  // the preacher of the Wache Kirche on his crate, a placard on a pole; the crowd goes past
  E(1.75, 3.55, 0.6, 0.5, 0, 2.6, (c) => {
    box(c, 1.75, 3.55, 0, 0.6, 0.5, 0.45, ["9", "8", "7"])
    person(c, 2.05, 3.8, { h0: 0.45, coat: "pre", tall: 1.7, face: "sw", skin: 2, long: true, hair: "6" })
    box(c, 2.2, 3.7, 0.45 + 1.15, 0.08, 0.08, 0.7, ["?", "!", "!"])                                  // the raised arm
    line3(c, [1.8, 3.62, 0.45], [1.8, 3.62, 2.55], "8")
    signV(c, 1.45, 2.15, 3.64, 2.15, 2.55, "?", ["STAY", "AWAKE"], "1")
  })
  COATS.pre = ["?", "!", "9"]

  const TABLES = [[4.9, 3.75], [7.3, 3.75], [9.9, 3.75]]
  const SEATS = [
    [[5.3, 3.45, "sw", "olive", 0], [5.3, 4.95, "ne", "grey", 1], [5.75, 4.2, "nw", "brown", 2]],
    [[7.5, 3.45, "sw", "dark", 3], [7.5, 4.95, "ne", "violet", 0], [6.95, 4.2, "se", "umber", 1], [8.15, 4.2, "nw", "steel", 2]],
    [[10.1, 3.45, "sw", "brown", 1], [10.75, 4.2, "nw", "grey", 0]],
  ]
  TABLES.forEach(([u, v], i) => {
    E(u, v, 0.85, 0.85, 0, 0.74, (c) => { box(c, u + 0.38, v + 0.38, 0, 0.1, 0.1, 0.7, ["4", "3", "2"]); box(c, u, v, 0.7, 0.85, 0.85, 0.04, ["@", "h", "h"])
      box(c, u + 0.2, v + 0.25, 0.74, 0.18, 0.18, 0.06, ["@", "H", "h"]); box(c, u + 0.5, v + 0.45, 0.74, 0.16, 0.16, 0.05, ["Q", "P", "O"]) })
    for (const [su, sv, f, coat, skin] of SEATS[i]) who(su, sv, { seated: true, face: f, coat, skin, tall: 1.7 })
  })
  for (const [su, sv] of [[4.6, 4.95], [8.2, 3.45], [9.6, 4.95], [5.95, 3.5]]) E(su - 0.14, sv - 0.12, 0.28, 0.24, 0, 0.45, (c) => box(c, su - 0.14, sv - 0.12, 0, 0.28, 0.24, 0.45, ["+", "~", "+"]))
  // poles with a fan and a bulb, carrying the tarps and the strings of lights
  const POLES = [[3.9, 4.0], [6.6, 4.4], [9.1, 4.4], [11.6, 4.0], [-1.6, 4.4]]
  for (const [pu, pv] of POLES) E(pu, pv, 0.08, 0.08, 0, 3.0, (c) => box(c, pu, pv, 0, 0.08, 0.08, 3.0, ["5", "4", "3"]))
  // a skewer cart at the strip's right end (amber), and stacks of crates along it
  E(12.1, 3.5, 1.2, 0.7, 0, 1.3, (c) => {
    box(c, 12.1, 3.5, 0.15, 1.2, 0.7, 0.8, ["6", "P", "O"]); box(c, 12.2, 3.6, 0.95, 1.0, 0.4, 0.06, ["Q", "P", "O"])
    for (let i = 0; i < 6; i++) box(c, 12.25 + i * 0.16, 3.65, 1.01, 0.04, 0.3, 0.03, ["R", "Q", "Q"])
    box(c, 12.6, 3.75, 1.1, 0.1, 0.1, 0.2, ["W", "R", "Q"])
  })
  for (const [u, v, n] of [[-3.6, 3.6, 3], [-2.6, 3.9, 2], [11.0, 4.4, 2], [14.0, 3.6, 3], [15.0, 4.0, 2]])
    for (let i = 0; i < n; i++) E(u, v, 0.55, 0.45, i * 0.35, 0.35, (c) => box(c, u, v, i * 0.35, 0.55, 0.45, 0.35, ["9", "8", "7"]))

  // the floor sellers along the near stub: blankets of goods, low crates, a radio table
  const MATS = [[-5.5, 6.2, 1.6, ["5", "v", "9"]], [-3.2, 6.25, 1.4, ["@", "8", "G"]], [-0.6, 6.2, 1.8, ["C", "5", "Q"]], [2.4, 6.3, 1.3, ["9", "o", "@"]], [4.7, 6.2, 1.6, ["6", "v", "m"]]]
  for (const [u, v, du, g] of MATS) {
    E(u, v, du, 0.95, 0, 0.02, (c) => quad(c, [u, v, 0], [u + du, v, 0], [u + du, v + 0.95, 0], [u, v + 0.95, 0], u > 0 ? "*" : "="))
    for (let i = 0; i < Math.floor(du / 0.32); i++) { const gu = u + 0.08 + i * 0.32, gv = v + 0.15 + (i % 2) * 0.35, k = g[i % g.length]
      E(gu, gv, 0.22, 0.22, 0.02, 0.12, (c) => box(c, gu, gv, 0.02, 0.22, 0.22, 0.12, [k, k, "2"])) }
  }
  for (const [u, v] of [[-1.5, 6.25], [1.5, 6.4], [3.9, 6.3], [6.6, 6.2], [7.2, 6.5]]) E(u, v, 0.5, 0.45, 0, 0.4, (c) => box(c, u, v, 0, 0.5, 0.45, 0.4, ["9", "8", "7"]))

  // the crowd: aisle A (v 1.75..3.3), aisle B (v 4.9..6.1), sellers squatting by their mats, the street over the rim
  const CROWD = [
    // aisle A, far left
    [-4.6, 2.0, "grey", "se", 0, 1.74], [-3.4, 2.7, "brown", "nw", 1, 1.7], [-5.9, 2.6, "olive", "se", 3, 1.7], [-5.3, 1.9, "violet", "ne", 2, 1.66],
    // aisle A in front of Ratz, the jars and the kidneys: only on its near side (v >= 2.8), so the counters stay clear
    [-2.6, 3.1, "dark", "se", 3, 1.68], [0.0, 3.0, "steel", "nw", 0, 1.8, { bag: "umber" }], [3.6, 3.15, "magenta", "sw", 0, 1.66],
    // the food stall: one customer at its counter's left end, one waiting; charging, the far right
    [9.25, 2.05, "olive", "ne", 1, 1.75], [9.3, 2.9, "brown", "se", 0, 1.68], [10.4, 2.0, "grey", "ne", 2, 1.82, { hat: "@" }],
    [11.3, 2.85, "steel", "sw", 1, 1.7], [15.2, 2.4, "olive", "ne", 1, 1.72], [16.0, 2.9, "violet", "se", 0, 1.78], [17.0, 2.0, "dark", "ne", 2, 1.76],
    [18.2, 2.6, "umber", "nw", 3, 1.7], [-7.2, 2.2, "brown", "se", 1, 1.72],
    // aisle B, clear in front of the stairs down's gate (u about -0.7 .. 1.9)
    [-6.0, 5.1, "grey", "se", 1, 1.72], [-5.0, 5.3, "brown", "se", 2, 1.72], [-3.9, 5.6, "dark", "nw", 0, 1.68], [-2.4, 5.2, "steel", "se", 1, 1.76],
    [2.6, 5.7, "umber", "nw", 2, 1.64], [3.4, 5.15, "violet", "se", 1, 1.74], [4.4, 5.6, "grey", "ne", 3, 1.7], [5.4, 5.2, "dark", "ne", 0, 1.7],
    [6.4, 5.6, "brown", "se", 3, 1.72], [7.4, 5.25, "olive", "nw", 1, 1.76], [8.3, 5.65, "plum", "se", 0, 1.64], [9.4, 5.2, "grey", "se", 2, 1.7],
    [10.6, 5.6, "sat", "sw", 0, 1.66], [11.5, 5.2, "cyanv", "ne", 1, 1.7], [12.4, 5.5, "dark", "nw", 1, 1.78], [13.5, 5.2, "brown", "se", 2, 1.7],
    [14.6, 5.6, "steel", "nw", 0, 1.74], [15.7, 5.2, "olive", "se", 3, 1.7], [16.8, 5.55, "grey", "ne", 1, 1.72], [17.8, 5.15, "violet", "se", 2, 1.68],
    // in the middle strip by the cart and the crates
    [13.6, 3.55, "umber", "nw", 3, 1.7], [-4.9, 4.3, "grey", "ne", 2, 1.7],
  ]
  for (const [u, v, coat, face, skin, tall, more] of CROWD) who(u, v, { coat, face, skin, tall, ...(more ?? {}) })
  // the sellers sitting by their mats, facing the aisle
  for (const [u, v, coat, skin] of [[-4.8, 6.95, "brown", 1], [-2.3, 7.0, "olive", 2], [0.6, 6.95, "dark", 0], [3.2, 7.05, "umber", 3], [5.6, 6.95, "grey", 1]])
    who(u, v, { seated: true, coat, skin, face: "ne", tall: 1.6 })
  // the street over the rim: the railing's people looking down, someone passing
  for (const [u, v, coat, face, skin] of [[8.9, -2.6, "dark", "sw", 1], [10.8, -3.4, "grey", "se", 2], [12.0, -2.6, "olive", "sw", 0], [7.6, -3.6, "steel", "se", 3]])
    who(u, v, { h0: RIM, coat, face, skin, tall: 1.72 })

  // Juno at the foot of the stairs, in aisle A (sketch only: for scale)
  const JUNO = [5.35, 2.35]
  who(JUNO[0], JUNO[1], { coat: "juno", legs: ["1", "k", "k"], face: "se", skin: 0, tall: 1.68, long: true, bag: "sat", hair: "y", hood: ["Y", "y", "j"] })
  COATS.juno = ["Y", "y", "j"]

  // ---- the ground: the bed, the far slope and the street above, the near stub
  function ground(c) {
    c.rect(0, 0, W, H, "k")
    const U0 = -14, U1 = 26
    quad(c, [U0, 0, 0], [U1, 0, 0], [U1, BED, 0], [U0, BED, 0], "2")
    for (let u = -12; u < 26; u += 3) line3(c, [u, 0, 0], [u, BED, 0], "1")                          // the bed's joints
    // the low-flow channel: still water, the market's lights smeared in it (stretched along u, as the water runs)
    quad(c, [U0, BED, WH], [U1, BED, WH], [U1, WET, WH], [U0, WET, WH], "e")
    for (let i = 0; i < 520; i++) {
      const u = U0 + hash(i, 51) * (U1 - U0), v = BED + 0.15 + hash(i, 52) * (WET - BED - 0.3), near = FAR.find((f) => u > f.u0 - v + 1 && u < f.u0 + f.du - v + 3)
      const k = near ? { cyan: ["v", "C"], magenta: ["m", "M"], warm: ["Q", "P"] }[near.light][i % 2] : hash(i, 53) < 0.5 ? "Z" : "z"
      const [x, y] = P(u, v, WH).map(Math.round), len = 2 + Math.floor(hash(i, 54) * 6)
      for (let j = 0; j < len; j++) c.px(x + j, y + (j >> 1), k)
    }
    quad(c, [U0, BED, 0], [U1, BED, 0], [U1, BED, WH], [U0, BED, WH], "3")                             // the bed's edge over the water
    line3(c, [U0, BED, 0], [U1, BED, 0], "5")
    line3(c, [U0, 3.7, 0], [U1, 3.7, 0], "1")
    // the far slope: stained below the old tide mark, paler above it; panel joints
    quad(c, [U0, 0, 0], [U1, 0, 0], [U1, -0.9, 1.62], [U0, -0.9, 1.62], "3")
    quad(c, [U0, -0.9, 1.62], [U1, -0.9, 1.62], [U1, -RUN, RIM], [U0, -RUN, RIM], "4")
    line3(c, [U0, -0.9, 1.62], [U1, -0.9, 1.62], "2")
    for (let u = -12; u < 26; u += 4) line3(c, [u, 0, 0], [u, -RUN, RIM], "2")
    // the coping and the street beyond it, its railing, a facade
    quad(c, [U0, -RUN, RIM], [U1, -RUN, RIM], [U1, -RUN - 0.3, RIM], [U0, -RUN - 0.3, RIM], "5")
    quad(c, [U0, -RUN - 0.3, RIM], [U1, -RUN - 0.3, RIM], [U1, -7, RIM], [U0, -7, RIM], "f")
    for (let u = -10; u < 26; u += 2) quad(c, [u, -3.2, RIM], [u + 1, -3.2, RIM], [u + 1, -3.8, RIM], [u, -3.8, RIM], "z")
    box(c, U0, -9, RIM, U1 - U0, 2, 6, ["3", "3", "2"])
    for (let u = -8; u < 24; u += 1.4) quad(c, [u, -7, RIM + 0.5], [u + 0.7, -7, RIM + 0.5], [u + 0.7, -7, RIM + 2.0], [u, -7, RIM + 0.5 + 1.5], hash(u * 7) > 0.55 ? "R" : hash(u * 3) > 0.8 ? "C" : "1")
  }
  function railing(c) {
    for (let u = -12; u < 26; u += 1) line3(c, [u, -2.15, RIM], [u, -2.15, RIM + 1.0], "5")
    line3(c, [-12, -2.15, RIM + 1.0], [26, -2.15, RIM + 1.0], "6")
    // the gap in the railing for the stairs, and the market's sign beside it on two posts
    signV(c, 6.0, 8.6, -2.2, RIM + 0.5, RIM + 1.05, "n", ["DRAIN MARKET"], "m")
    for (const u of [6.05, 8.5]) line3(c, [u, -2.2, RIM], [u, -2.2, RIM + 0.5], "4")
  }
  function pools(c) {
    for (const s of FAR) {
      const k = s.light === "cyan" ? ["T", "t"] : s.light === "magenta" ? ["I", "i"] : ["A", "a"]
      pool(c, s.u0 + s.du / 2, 2.0, s.du * 0.6, 0.9, ...k)
    }
    pool(c, 11.9, 0.9, 1.0, 1.0, "I", "i")                                 // Sable's curtain
    pool(c, 5.1, 1.0, 1.1, 1.2, "i", "i")                                   // the sign's magenta down the stairs
    pool(c, 7.4, 4.1, 2.6, 1.1, "A", "a")                                   // the tables under their bulbs
    pool(c, 12.7, 3.9, 1.0, 0.8, "A", "a")
    pool(c, 0, 4.0, 1.4, 1.0, "2", "2")
  }
  // what hangs over everything: tarps over the tables (see-through), strings of lights, cables from the dark, fans, steam
  function overhead(c) {
    for (const [u0, u1, k] of [[8.4, 10.2, "*"], [10.3, 11.8, "u"], [-6.2, -3.4, "u"], [14.6, 17.0, "*"]]) quad(c, [u0, 4.0, 2.4], [u1, 4.0, 2.4], [u1, 4.9, 2.3], [u0, 4.9, 2.3], k, true)
    // fans under the tarps
    for (const [pu, pv] of POLES.slice(0, 4)) { const [x, y] = P(pu + 0.04, pv + 0.04, 2.6).map(Math.round)
      c.line(x - 9, y - 1, x + 9, y + 1, "4"); c.line(x - 4, y + 3, x + 4, y - 3, "4"); c.rect(x - 1, y - 1, 3, 2, "6") }
    // strings of lights from the stall row's awnings to the poles, over aisle A
    const strings = [[[-3.0, 1.75, 2.5], [-1.6, 4.4, 2.9]], [[-1.0, 1.75, 2.5], [-1.6, 4.4, 2.9]], [[1.3, 1.75, 2.5], [3.9, 4.0, 2.9]],
      [[9.6, 1.75, 2.5], [9.1, 4.4, 2.9]], [[11.4, 1.75, 2.5], [11.6, 4.0, 2.9]],
      [[-1.6, 4.4, 2.9], [3.9, 4.0, 2.9]], [[6.6, 4.4, 2.9], [9.1, 4.4, 2.9]], [[9.1, 4.4, 2.9], [11.6, 4.0, 2.9]], [[11.6, 4.0, 2.9], [16, 4.2, 2.9]]]
    strings.forEach(([a, b], si) => { for (let t = 0, n = 0; t <= 1; t += 0.01, n++) {
      const sag = Math.sin(t * Math.PI) * 0.35, q = P(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t - sag).map(Math.round)
      c.px(q[0], q[1], n % 9 === 0 ? ["R", "m", "R", "v"][(n / 9 + si) % 4] : "1") } })
    // cables and bare bulbs coming down out of the dark over the aisles
    for (const [u, v, h, k] of [[-2.2, 2.6, 2.3, "R"], [2.0, 2.5, 2.2, "R"], [5.0, 3.1, 2.4, "R"], [8.0, 2.6, 2.2, "R"], [12.9, 2.6, 2.3, "W"], [0.4, 5.6, 2.4, "R"], [4.4, 5.6, 2.5, "R"], [-4.0, 5.4, 2.4, "R"]]) {
      const [x, y] = P(u, v, h).map(Math.round); c.vline(x, 0, Math.max(0, y), "1"); c.rect(x - 1, y, 3, 2, k); c.px(x, y + 2, "W")
    }
    // the wok's steam through the slot in the awning, see-through
    for (const i of [0, 1, 2, 7, 8, 9, 10, 11]) { const [x, y] = P(7.6 + Math.sin(i * 1.3) * 0.12, 1.25, 1.25 + i * 0.25).map(Math.round), r = 3 + (i >> 1)
      for (let yy = -r; yy <= r; yy++) for (let xx = -r - 2; xx <= r + 2; xx++) if ((xx / (r + 2.5)) ** 2 + (yy / (r * 0.7 + 0.5)) ** 2 <= 1 && (x + xx + y + yy) % 2 === 0) c.px(x + xx, y + yy, i < 3 ? "W" : i < 9 ? "H" : "h") }
    // the near stub: the cut edge of the near wall, low
    quad(c, [-14, WET, WH], [26, WET, WH], [26, WET, 0.18], [-14, WET, 0.18], "3")
    quad(c, [-14, WET, 0.18], [26, WET, 0.18], [26, WET + 0.3, 0.18], [-14, WET + 0.3, 0.18], "5")
  }

  function draw(c) {
    ground(c); pools(c); railing(c)
    for (const e of order()) e.draw(c)
    overhead(c)
  }
  return { W, H, P, draw, JUNO }
})()

scene("drain_market_c", { w: DMC.W, h: DMC.H, bg: "k" }, (c) => DMC.draw(c),
  glow("RW", { r: 3, strength: 0.35 }), glow("m", { r: 4, strength: 0.4 }), glow("v", { r: 3, strength: 0.3 }), glow("Q", { r: 3, strength: 0.3 }))

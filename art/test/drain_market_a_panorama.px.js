// The Drain Market, draft A of three: a wide panorama from the side, BLOCKS (not painted), 960x180, three screens the game would
// scroll with Juno. A stage seen across the drained flood channel, layered in depth:
//   the city's underside as the sky (beams, a pipe, a road deck crossing, neon and screens hung from it, cables, strings of bulbs, fans);
//   the channel's far wall, sloped, with the old tide mark, and a second tier of shacks built up on it (a plank walkway, ladders);
//   the main row of stalls facing us on the channel's bed; the walk band in front of it (y 140..178) with the low-flow gutter;
//   the crowd at every depth, and its nearest heads and shoulders along the bottom edge, kept out of the story's places.
// Left to right: the stairs up to the alley, the food stall, the preacher on his crate, used chrome in jars, KIDNEYS ONLY, Ratz's
// parts and junk, the stairs down (shut with a chain), Sable's curtain at the far end. Juno stands in the band for scale.
// Flat world palette (style guide §5): amber low and smoky as the key, magenta neon, cyan only on screens and tech, red only on the
// chain's sign. Signs are English (no glyphs: those belong to Jade Row alone).
include("../lib/iso.js", { palette: true })
include("../lib/text.js")
pal({
  J: "#22101a", K: "#3a1624", B: "#57222f", F: "#7a3a40",                 // Sable's curtain, heavy and old (as in the booth)
  7: "#33241c", 8: "#54392a", 9: "#7a5638",                               // wood, crates, cardboard
  d: "#3b3330", D: "#3a4030", E: "#3a2a3a", l: "#2a2f36", L: "#4a4038", o: "#5e4c3e",   // muted coats
  b: "#1d3550", p: "#2c5580",                                             // blue tarps
  "+": "#90d0a0",                                                         // Ratz's collar (his signature, story §4)
  "0": "#211a20",                                                         // smoke under the deck
  "=": "#28232f", "*": "#3a3034",                                         // the channel's concrete in the market's warm haze
})

const DM = (() => {
  const W = 960, H = 180, G = 140, TIDE = 92          // G: the stalls' foot, the back edge of the walk band; TIDE: the flood's old mark
  const R = Math.round
  const text = (c, x, y, s, k) => TXT.draw(c, x, y, s, k, { font: "hud", align: "center" })
  const HASH = [".#.#.", "#####", ".#.#.", "#####", ".#.#."]
  /** a stall number "#01-23": the hud font's hash reads as an H at 1x, so the hash is drawn 5 wide */
  const num = (c, x, y, s, k) => {
    if (!s.startsWith("#")) return text(c, x, y, s, k)
    const rest = s.slice(1), w = 6 + TXT.measure(rest, "hud"), x0 = x - Math.floor(w / 2)
    HASH.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === "#") c.px(x0 + i, y + j, k) }))
    TXT.draw(c, x0 + 6, y, rest, k, { font: "hud" })
  }
  const numW = (s) => s.startsWith("#") ? 6 + TXT.measure(s.slice(1), "hud") : TXT.measure(s, "hud")
  /** a sagging line from a to b; every `every` px a bulb (amber) */
  const sag = (c, x0, y0, x1, y1, s, k, every = 0, bulb = "Q") => {
    for (let x = x0; x <= x1; x++) {
      const t = (x - x0) / (x1 - x0 || 1), y = R(y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * s)
      c.px(x, y, k)
      if (every && (x - x0) % every === every >> 1) { c.px(x, y + 1, bulb); c.px(x, y + 2, bulb === "Q" ? "R" : bulb) }
    }
  }

  // ---------------------------------------------------------------- people as blocks (50 px = 1.68 m), outlined in ink
  /** f: 1 right, -1 left, 0 back to us, 2 facing us. o: h, coat, leg, skin, hair, long, hat, acc ([key, where]), sit, stool, walk, arm */
  const person = (c, x, foot, o = {}) => {
    const s = (o.h ?? 50) / 50, f = o.f ?? 0, coat = o.coat ?? "3", leg = o.leg ?? "1", skin = o.skin ?? "s", hair = o.hair ?? "1"
    const parts = [], P = (a, b, w, h, k) => parts.push([a, b, w, h, k])
    let top
    if (o.sit) {
      P(-4, -14, 9, 2, o.stool ?? "U"); P(-3, -12, 2, 12, o.stool ?? "U"); P(2, -12, 2, 12, o.stool ?? "U")
      P(f < 0 ? -9 : -2, -18, 11, 4, leg); P(f < 0 ? -9 : 6, -15, 3, 15, leg)
      P(-5, -37, 10, 20, coat); top = -37
    } else {
      if (o.walk) { P(-6, -22, 3, 22, leg); P(3, -22, 3, 22, leg) } else { P(-4, -22, 3, 22, leg); P(1, -22, 3, 22, leg) }
      P(-5, -42, 11, o.long ? 32 : 21, coat); top = -42
    }
    const hy = top - 8
    if (f === 0) P(-3, hy, 7, 8, hair)
    else if (f === 2) { P(-3, hy, 7, 8, skin); P(-3, hy, 7, 3, hair) }
    else { P(-3, hy, 7, 8, skin); P(f > 0 ? -3 : 1, hy, 3, 6, hair); P(-3, hy, 7, 2, hair) }
    if (o.hood) P(-4, hy - 1, 9, f === 2 ? 3 : 9, o.hood)
    if (o.hat) P(-5, hy - 1, 11, 2, o.hat)
    if (o.arm) P(o.arm[0], o.arm[1], 3, o.arm[2], coat), P(o.arm[0], o.arm[1] - 3, 3, 3, skin)
    const accent = o.acc && (o.acc[1] === "bag" ? [f < 0 ? 5 : -8, top + 14, 4, 7] : o.acc[1] === "scarf" ? [-4, top, 9, 3] : o.acc[1] === "visor" ? [f < 0 ? -3 : -1, hy + 3, 5, 1] : o.acc[1] === "cap" ? [-4, hy - 1, 9, 3] : [-5, top + 8, 11, 2])
    const X = (a) => R(x + a * s), Y = (b) => R(foot + b * s), Wd = (w) => Math.max(1, R(w * s)), Hd = (h) => Math.max(1, R(h * s))
    for (const [a, b, w, h] of parts) c.rect(X(a) - 1, Y(b) - 1, Wd(w) + 2, Hd(h) + 2, "k")
    for (const [a, b, w, h, k] of parts) c.rect(X(a), Y(b), Wd(w), Hd(h), k)
    if (accent) c.rect(X(accent[0]), Y(accent[1]), Wd(accent[2]), Hd(accent[3]), o.acc[0])
  }
  /** a near head and shoulders, cut by the picture's bottom edge; its rim lit by what it faces */
  const near = (c, x, o = {}) => {
    const y = o.y ?? 160, k = o.k ?? "k"
    c.rect(x - 15, y + 12, 30, 20, k); c.rect(x - 13, y + 10, 26, 3, k); c.ellipse(x, y + 4, 7, 8, k)
    if (o.hat) c.rect(x - 9, y - 4, 18, 3, k)
    if (o.rim) { c.hline(x - 4, y - 4 + (o.hat ? -1 : 0), 8, o.rim); c.hline(x - 12, y + 10, 6, o.rim) }
  }
  const juno = (c, x, foot) => {
    // Juno, 50 px, facing right: boots, black cargo trousers, the yellow slicker with its hood up, the grey satchel
    const P = (a, b, w, h, k) => c.rect(x + a, foot + b, w, h, k)
    P(-6, -51, 14, 52, "k")
    P(-5, -50, 12, 50, "k")
    P(-4, -4, 4, 4, "k"); P(1, -4, 5, 4, "k"); P(-4, -20, 3, 16, "1"); P(1, -20, 3, 16, "1")
    P(-5, -42, 12, 24, "y"); P(-5, -42, 2, 24, "j"); P(-5, -50, 10, 9, "y"); P(-5, -50, 3, 9, "j"); P(2, -47, 3, 5, "S"); P(5, -45, 1, 2, "S")
    P(6, -38, 1, 14, "j"); P(-8, -26, 5, 7, "k"); P(-7, -25, 3, 5, "g"); c.line(x - 5, foot - 26, x + 4, foot - 41, "g")
  }

  // ---------------------------------------------------------------- the back: the city's underside, the far wall, the second tier
  const back = (c) => {
    c.rect(0, 0, W, H, "1")
    // the far wall: sloped concrete in the market's haze; under the old tide mark (1.6 m over the bed, as in Sable's booth) stained; form joints
    c.rect(0, 18, W, G - 18, "*"); c.rect(0, TIDE, W, G - TIDE, "=")
    for (let x = 0; x < W; x += 48) c.vline(x, 18, G - 18, "1")
    for (const y of [56, 76, 118]) c.hline(0, y, W, "1")
    c.hline(0, TIDE, W, "4"); for (let x = 3; x < W; x += 7) c.vline(x, TIDE + 1, 2 + (x * 7 % 5), "1")
    // the underside of the city: a slab, its beams, a main running along it
    c.rect(0, 0, W, 18, "1"); c.rect(0, 16, W, 2, "k")
    for (let x = 20; x < W; x += 96) { c.rect(x, 0, 10, 24, "2"); c.vline(x, 0, 24, "3"); c.hline(x, 24, 10, "k") }
    c.rect(0, 9, W, 4, "3"); c.hline(0, 9, W, "4")
    // smoke hanging under the deck, catching the bulbs
    for (let x = 0; x < W; x += 2) { const t = Math.sin(x * 0.021) * 3 + Math.sin(x * 0.07) * 1.5; c.vline(x, 18, R(6 + t), "0") }
  }
  /** a shack on the second tier: corrugated sheet, a window, a door, a small sign */
  const shack = (c, x, w, o = {}) => {
    const y0 = 30, y1 = 63
    c.rect(x - 1, y0 - 3, w + 2, y1 - y0 + 3, "k"); c.rect(x, y0, w, y1 - y0, o.wall ?? "3")
    for (let i = x + 3; i < x + w; i += 4) c.vline(i, y0, y1 - y0, o.wall === "4" ? "3" : "2")
    c.rect(x - 3, y0 - 3, w + 6, 3, o.roof ?? "4"); c.hline(x - 3, y0 - 1, w + 6, "2")
    if (o.win) { c.rect(x + 4, y0 + 12, 12, 9, "k"); c.rect(x + 5, y0 + 13, 10, 7, o.win) }
    if (o.door) { c.rect(x + w - 12, y0 + 12, 8, y1 - y0 - 12, "k"); if (o.door !== true) c.rect(x + w - 11, y0 + 13, 6, y1 - y0 - 13, o.door) }
    if (o.sign) { const tw = numW(o.sign) + 4; c.rect(x + R(w / 2 - tw / 2) - 1, y0 + 1, tw + 2, 9, "k"); c.rect(x + R(w / 2 - tw / 2), y0 + 2, tw, 7, o.board ?? "6"); num(c, x + R(w / 2), y0 + 3, o.sign, o.ink ?? "1") }
  }
  const tier = (c) => {
    // the walkway of planks along the slope, its rail, the shacks on it
    shack(c, 118, 54, { sign: "#02-02 REPAIR", board: "h", win: "Q", door: true })
    shack(c, 180, 40, { wall: "4", win: "P" })
    // washing on a line between two shacks
    sag(c, 268, 34, 306, 34, 4, "k"); for (const [x, k] of [[272, "h"], [280, "U"], [288, "o"], [297, "H"]]) c.rect(x, 37 + (x % 3), 5, 9, k)
    shack(c, 222, 44, { sign: "ROOMS 10", board: "n", ink: "m", win: "Q", door: "O" })
    shack(c, 362, 50, { sign: "#02-09 SIM", board: "c", ink: "V", win: "C", door: true })
    shack(c, 420, 30, { wall: "4", win: "Q" })
    shack(c, 470, 60, { sign: "#02-11 TEA", board: "O", ink: "R", win: "Q", door: "P" })
    // a water tank on stilts, a dish
    c.rect(540, 30, 20, 22, "k"); c.rect(541, 31, 18, 20, "5"); c.hline(541, 36, 18, "4"); c.hline(541, 44, 18, "4"); c.rect(543, 51, 2, 12, "k"); c.rect(555, 51, 2, 12, "k")
    c.ellipse(574, 40, 7, 9, "k"); c.ellipse(574, 40, 5, 7, "6"); c.line(574, 40, 580, 50, "k")
    shack(c, 588, 52, { sign: "#02-15 DOCS", board: "h", win: "C", door: true })
    shack(c, 650, 38, { wall: "4", win: "P", roof: "p" })
    shack(c, 700, 64, { sign: "#02-19 DENTIST", board: "O", ink: "R", win: "Q", door: "O" })
    shack(c, 820, 48, { wall: "4", roof: "b", win: "Q" })
    // tarps slung over the walkway, blue and violet, sagging
    for (const [x0, x1, k] of [[170, 230, "b"], [306, 360, "u"], [408, 470, "p"], [628, 700, "U"], [770, 830, "b"]]) {
      for (let x = x0; x <= x1; x++) { const t = (x - x0) / (x1 - x0), y = R(24 + Math.sin(t * Math.PI) * 5); c.vline(x, y, 3, k); c.px(x, y + 3, "k") }
    }
    // the walkway and its rail
    c.rect(110, 63, 812, 4, "4"); c.hline(110, 63, 812, "5"); c.hline(110, 67, 812, "k")
    c.hline(110, 53, 812, "5"); for (let x = 110; x < 922; x += 12) c.vline(x, 53, 10, "k")
    // ladders down to the bed: by the preacher's open spot, by the stairs down
    for (const [x, y1] of [[340, G], [796, G]]) { c.vline(x, 54, y1 - 54, "5"); c.vline(x + 7, 54, y1 - 54, "5"); for (let y = 58; y < y1; y += 6) c.hline(x, y, 8, "4") }
    // people up there, smaller (further back)
    for (const [x, f, coat, k] of [[178, 1, "d", "s"], [204, -1, "E", "S"], [312, 2, "D", "s"], [330, -1, "4", "s"], [426, 0, "l", "s"], [456, 1, "o", "S"], [534, -1, "E", "s"], [646, 1, "L", "s"], [680, 0, "d", "S"], [772, -1, "D", "s"], [858, 1, "4", "s"]])
      person(c, x, 63, { h: 34, f, coat, skin: k, hair: "1" })
  }

  // ---------------------------------------------------------------- the stairs up to the alley (arrive), the stairs down, Sable's niche
  const stairsUp = (c) => {
    // the way out at the top: the alley's night through a gap in the deck, rain only out there
    c.rect(0, 0, 40, 30, "e"); c.rect(0, 0, 40, 4, "Z")
    for (let i = 0; i < 9; i++) { const x = (i * 11) % 38, y = 5 + (i * 7) % 20; c.line(x, y, x + 2, y + 4, "5") }
    c.rect(0, 28, 44, 3, "4")
    // the flight running down the far wall to the bed, its side profile
    for (let i = 0; i < 18; i++) {
      const x = 6 + i * 6, y = 32 + i * 6
      c.rect(x, y, 6, G - y, "3"); c.hline(x, y, 6, "5"); c.vline(x, y, 6, "4")
    }
    c.rect(0, 31, 6, G - 31, "3")
    // its rail, a bare bulb on it
    c.line(2, 18, 112, 128, "6"); for (let i = 0; i < 18; i += 3) c.vline(8 + i * 6, 22 + i * 6, 12, "5")
    c.rect(60, 76, 3, 3, "k"); c.px(61, 77, "R")
    // under the flight: crates and a man selling smokes off a crate
    for (const [x, y, w, h] of [[56, 126, 16, 14], [60, 114, 12, 12]]) { c.rect(x, y, w, h, "k"); c.rect(x + 1, y + 1, w - 2, h - 2, "8"); c.hline(x + 1, y + 1, w - 2, "9") }
  }
  const stairsDown = (c) => {
    // a concrete head over a flight going down into the dark (to the sumps; Chapter 2), shut with a chain and a sign
    const x0 = 716, x1 = 792
    c.rect(x0, 80, x1 - x0, G - 80, "4"); c.rect(x0, 80, x1 - x0, 3, "5")
    c.rect(x0 + 8, 92, x1 - x0 - 16, G - 92, "e"); c.ellipse(R((x0 + x1) / 2), 92, R((x1 - x0) / 2) - 8, 8, "e")
    // the first treads, then nothing; the walls of the flight running away and down
    for (const [i, k] of [[0, "3"], [1, "2"], [2, "1"]]) c.rect(x0 + 12 + i * 5, G - 3 - i * 6, x1 - x0 - 24 - i * 10, 2, k)
    c.line(x0 + 8, 100, x0 + 26, 120, "1"); c.line(x1 - 9, 100, x1 - 27, 120, "1")
    c.rect(R((x0 + x1) / 2) - 1, 104, 3, 2, "c")                                          // a cold work light far down
    text(c, R((x0 + x1) / 2), 84, "SUMP ACCESS", "6")
    // the chain between two posts, its sign hanging in the middle
    for (const x of [x0 + 2, x1 - 5]) { c.rect(x - 1, 112, 5, G - 112, "k"); c.rect(x, 113, 3, G - 113, "5") }
    for (let x = x0 + 5; x < x1 - 5; x += 2) { const t = (x - x0 - 5) / (x1 - x0 - 10); c.px(x, R(116 + Math.sin(t * Math.PI) * 6), "6") }
    const cx = R((x0 + x1) / 2); c.rect(cx - 15, 119, 30, 10, "k"); c.rect(cx - 14, 120, 28, 8, "r"); text(c, cx, 121, "CLOSED", "q")
  }
  const sable = (c) => {
    // the far end: a concrete pier with a niche, the heavy curtain to Sable's booth, the booth's magenta leaking past it
    c.rect(842, 40, 118, G - 40, "3"); c.rect(842, TIDE, 118, G - TIDE, "2"); c.hline(842, 40, 118, "4"); c.hline(842, TIDE, 118, "5"); for (let x = 845; x < 960; x += 6) c.vline(x, TIDE + 1, 2 + (x % 4), "1")
    c.rect(856, 74, 64, G - 74, "k")
    c.rect(857, 75, 62, G - 75, "i"); c.vline(857, 75, G - 75, "m"); c.vline(918, 75, G - 75, "M")
    for (let x = 859; x < 917; x++) { const f = ((x - 859) % 9); c.vline(x, 76, G - 78, f < 2 ? "J" : f < 5 ? "K" : f < 7 ? "B" : f < 8 ? "F" : "K") }
    c.hline(857, G - 2, 62, "m"); c.hline(857, 75, 62, "4")
    // a caged bulb over it, the only warm thing at this end
    c.vline(888, 46, 18, "k"); c.rect(885, 64, 7, 6, "k"); c.rect(886, 65, 5, 4, "Q"); c.px(888, 66, "W")
    // the channel goes on into the dark past the pier: a storm drain's round mouth
    c.ellipse(944, 104, 13, 20, "k"); c.ellipse(944, 104, 10, 17, "e"); for (let x = 934; x < 956; x += 4) c.vline(x, 88, 33, "4")
  }

  // ---------------------------------------------------------------- the floor: the channel's bed, wet, the gutter, the stalls' light on it
  const floor = (c) => {
    c.rect(0, G, W, H - G, "z"); c.rect(0, G, W, 3, "Z")
    for (let x = 0; x < W; x += 64) c.line(x, G + 3, x - 20, 172, "f")
    c.rect(0, 172, W, 6, "e"); c.hline(0, 174, W, "f"); for (let x = 0; x < W; x += 5) c.px(x, 175, x % 15 ? "c" : "C")
    c.hline(0, 178, W, "f"); c.hline(0, 179, W, "z")
  }
  const pool = (c, x0, x1, kind) => {
    const [o, i] = { warm: ["a", "A"], mag: ["i", "I"], cyan: ["t", "T"] }[kind], cx = R((x0 + x1) / 2), rx = R((x1 - x0) / 2)
    c.ellipse(cx, G + 2, rx + 6, 16, o); c.ellipse(cx, G + 2, rx - 4, 9, i)
  }

  // ---------------------------------------------------------------- the main row: stalls facing us
  /** a stall: posts, its back, an awning, the numbered signboard over it, a tube or bulbs, a counter; goods by `fill` */
  const stall = (c, s) => {
    const { x, w } = s, lit = { warm: ["a", "A", "R"], mag: ["i", "I", "N"], cyan: ["t", "T", "V"] }[s.light ?? "warm"]
    c.rect(x, 70, w, G - 70, "k"); c.rect(x + 2, 76, w - 4, G - 76, lit[0]); c.rect(x + 2, 80, w - 4, 14, lit[1])
    c.rect(x, 64, 3, G - 64, "4"); c.rect(x + w - 3, 64, 3, G - 64, "4")
    // the awning, its front edge, its shadow line
    c.rect(x - 3, 68, w + 6, 8, s.aw ?? "u"); c.hline(x - 3, 75, w + 6, "k"); for (let i = x; i < x + w + 3; i += 8) c.rect(i, 68, 4, 7, s.aw2 ?? s.aw ?? "u")
    // the tube under it
    c.hline(x + 5, 77, w - 10, lit[2]); c.hline(x + 5, 78, w - 10, "k")
    // the board: number over name
    const bw = Math.max(TXT.measure(s.name, "hud"), numW(s.no ?? "")) + 6, sx = x + (s.signX ?? R(w / 2))
    const by = s.no ? 51 : 57
    c.rect(sx - R(bw / 2) - 1, by - 1, bw + 2, 68 - by + 1, "k"); c.rect(sx - R(bw / 2), by, bw, 67 - by, s.board ?? "h")
    if (s.no) num(c, sx, by + 2, s.no, s.dim ?? s.ink ?? "1")
    text(c, sx, 60, s.name, s.ink ?? "1")
    s.fill?.(c, x, w)
    // the counter
    c.rect(x, 112, w, G - 112, "k"); c.rect(x + 1, 113, w - 2, G - 113, s.counter ?? "4"); c.hline(x + 1, 113, w - 2, s.top ?? "6")
    s.front?.(c, x, w)
  }
  const shelf = (c, x, y, w) => { c.hline(x, y, w, "5"); c.hline(x, y + 1, w, "k") }
  const STALLS = [
    { x: 112, w: 110, no: "#01-03", name: "WOK & KOPI", signX: 76, board: "O", ink: "R", dim: "Q", aw: "P", aw2: "O", light: "warm", counter: "6", top: "h",
      fill: (c, x) => {
        // the menu on the back wall, roast birds on a rail, bowls, the cook in his white cap
        c.rect(x + 56, 80, 46, 22, "k"); c.rect(x + 57, 81, 44, 20, "1"); text(c, x + 79, 82, "NOODLE 4", "R"); text(c, x + 79, 89, "KOPI 1", "R"); text(c, x + 79, 96, "BUN 2", "Q")
        c.hline(x + 6, 82, 40, "k"); for (let i = 0; i < 4; i++) { c.rect(x + 9 + i * 10, 83, 6, 10, "k"); c.rect(x + 10 + i * 10, 84, 4, 8, "P"); c.px(x + 11 + i * 10, 85, "Q") }
        person(c, x + 42, 120, { h: 50, f: -1, coat: "h", skin: "S", hair: "1", hat: "H" })
      },
      front: (c, x) => {
        // the wok on its burner, the fire under it, a stockpot; bowls stacked
        c.rect(x + 6, 103, 28, 6, "k"); c.rect(x + 9, 108, 22, 3, "k"); c.rect(x + 7, 104, 26, 4, "1"); c.rect(x + 10, 108, 20, 2, "1"); c.hline(x + 7, 104, 26, "4")
        c.rect(x + 12, 113, 16, 4, "Q"); c.rect(x + 15, 113, 10, 2, "W"); c.rect(x + 14, 117, 12, 2, "P")
        c.rect(x + 66, 102, 16, 11, "k"); c.rect(x + 67, 103, 14, 10, "5"); c.hline(x + 67, 103, 14, "6")
        for (let i = 0; i < 3; i++) { c.rect(x + 90, 108 - i * 3, 10, 3, "k"); c.rect(x + 91, 109 - i * 3, 8, 1, "H") }
      } },
    { x: 226, w: 68, no: "#01-05", name: "CHARGE 5 CHITS", board: "c", ink: "V", dim: "v", aw: "l", light: "cyan",
      fill: (c, x, w) => {
        // the wall of phones charging, a ladder of cables, a woman minding them
        for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) { c.rect(x + 6 + i * 6, 84 + r * 8, 4, 6, "k"); c.rect(x + 7 + i * 6, 85 + r * 8, 2, 4, (i + r) % 3 ? "C" : "v") }
        person(c, x + 52, 124, { h: 48, f: -1, coat: "E", skin: "s", hair: "1" })
      },
      front: (c, x) => { for (let i = 0; i < 6; i++) c.vline(x + 8 + i * 9, 113, 8 + (i % 3) * 3, "k") } },
    { x: 352, w: 76, no: "#01-12", name: "USED CHROME", board: "h", ink: "1", dim: "4", aw: "b", aw2: "p", light: "cyan",
      fill: (c, x, w) => {
        // jars on three shelves: glass, the fluid, an implant floating in each
        for (const [r, y] of [[0, 92], [1, 103]]) {
          shelf(c, x + 4, y, w - 8)
          for (let i = 0; i < 9; i++) { const jx = x + 7 + i * 7 + r * 3; if (jx > x + w - 10) break; c.rect(jx, y - 9, 6, 9, "k"); c.rect(jx + 1, y - 8, 4, 8, (i + r) % 3 ? "c" : "t"); c.hline(jx + 1, y - 9, 4, "h"); c.px(jx + 2, y - 5, (i * 3 + r) % 4 ? "v" : "m"); c.px(jx + 3, y - 4, "V") }
        }
        person(c, x + 62, 124, { h: 52, f: -1, coat: "l", skin: "S", hair: "4", acc: ["v", "visor"] })
      },
      front: (c, x) => {
        // the best of them on the counter, bigger
        for (let i = 0; i < 4; i++) { const jx = x + 6 + i * 11; c.rect(jx, 100, 9, 13, "k"); c.rect(jx + 1, 101, 7, 12, "c"); c.hline(jx + 1, 100, 7, "H"); c.rect(jx + 3, 105, 3, 3, i % 2 ? "v" : "C"); c.px(jx + 4, 104, "V") }
      } },
    { x: 432, w: 70, name: "KIDNEYS ONLY", board: "n", ink: "m", aw: "E", light: "mag", counter: "6", top: "H",
      fill: (c, x, w) => {
        // a plastic strip curtain to the back room, a man in a rubber apron
        for (let i = x + 6; i < x + w - 6; i += 3) c.vline(i, 80, 32, i % 2 ? "h" : "g")
        person(c, x + 22, 124, { h: 54, f: 2, coat: "h", skin: "s", hair: "1", acc: ["H", "belt"] })
      },
      front: (c, x) => {
        // the white coolers, one open on the counter
        for (const [dx, y, w] of [[34, 100, 16], [52, 104, 14], [36, 92, 12]]) { c.rect(x + dx, y, w, 113 - y, "k"); c.rect(x + dx + 1, y + 1, w - 2, 112 - y - 1, "H"); c.hline(x + dx + 1, y + 2, w - 2, "h") }
        c.rect(x + 4, 118, 22, 10, "k"); c.rect(x + 5, 119, 20, 8, "H")
      } },
    { x: 506, w: 56, no: "#01-17", name: "TIDE MODS", board: "1", ink: "v", dim: "C", aw: "u", aw2: "U", light: "cyan",
      fill: (c, x, w) => {
        // a tank with a gill set floating in it, a poster of a neck with gills
        c.rect(x + 6, 82, 22, 28, "k"); c.rect(x + 7, 83, 20, 26, "C"); c.rect(x + 7, 83, 20, 4, "c"); c.rect(x + 13, 92, 8, 6, "v")
        c.rect(x + 34, 82, 16, 22, "k"); c.rect(x + 35, 83, 14, 20, "6"); c.rect(x + 39, 87, 6, 12, "S"); for (let i = 0; i < 3; i++) c.hline(x + 40, 91 + i * 2, 4, "s")
      } },
    { x: 566, w: 54, no: "#01-20", name: "BATTERIES", board: "h", ink: "1", dim: "4", aw: "b", aw2: "p", light: "warm",
      fill: (c, x, w) => {
        for (const y of [90, 101]) { shelf(c, x + 4, y, w - 8); for (let i = 0; i < 8; i++) c.rect(x + 6 + i * 6, y - 6, 4, 6, ["P", "5", "Q", "6", "O"][i % 5]) }
        for (let i = 0; i < 3; i++) { c.vline(x + 12 + i * 16, 76, 6, "k"); c.px(x + 12 + i * 16, 82, "R") }
        person(c, x + 40, 124, { h: 48, f: 2, coat: "L", skin: "S", hair: "1" })
      } },
    { x: 624, w: 88, no: "#01-23", name: "PARTS & JUNK", board: "c", ink: "V", dim: "v", aw: "l", aw2: "2", light: "cyan", counter: "8", top: "9",
      fill: (c, x, w) => {
        // old screens stacked to the awning, cable hanks hanging, a radio
        for (const [dx, y, sw, sh, k] of [[6, 82, 18, 14, "C"], [26, 80, 14, 12, "c"], [6, 96, 16, 14, "c"], [24, 94, 18, 16, "v"], [62, 82, 20, 16, "C"]]) { c.rect(x + dx, y, sw, sh, "k"); c.rect(x + dx + 1, y + 1, sw - 2, sh - 2, "3"); c.rect(x + dx + 3, y + 3, sw - 6, sh - 6, k) }
        for (let i = 0; i < 4; i++) c.ellipse(x + 48 + i * 4, 88 + (i % 2) * 6, 3, 6, "k")
      },
      front: (c, x) => {
        // junk heaped on the counter; Ratz sits on it, in his much too big parka, headphones on, his collar glowing; his tail a cable
        for (let i = 0; i < 9; i++) { const k = ["5", "6", "g", "4", "C", "3"][i % 6], hh = 3 + (i * 5) % 6; c.rect(x + 4 + i * 5, 113 - hh, 5, hh, "k"); c.rect(x + 5 + i * 5, 114 - hh, 3, hh - 1, k) }
        const rx = x + 62
        c.rect(rx - 1, 97, 15, 17, "k"); c.rect(rx, 101, 13, 12, "D"); c.rect(rx + 2, 97, 9, 7, "5"); c.rect(rx + 9, 100, 4, 3, "6"); c.px(rx + 4, 99, "k")
        c.rect(rx + 1, 95, 2, 4, "6"); c.rect(rx + 8, 95, 2, 4, "6"); c.rect(rx + 2, 96, 9, 1, "k"); c.rect(rx + 1, 98, 2, 3, "M"); c.rect(rx + 9, 98, 2, 3, "M")
        c.hline(rx + 1, 104, 11, "+")
        c.line(rx + 13, 112, rx + 18, 122, "k"); c.line(rx + 18, 122, rx + 14, 130, "k"); c.rect(rx + 13, 130, 3, 2, "v")
      } },
    { x: 796, w: 44, no: "#01-27", name: "PAWN", board: "O", ink: "R", dim: "Q", aw: "E", light: "warm",
      fill: (c, x, w) => { for (let i = x + 4; i < x + w - 4; i += 4) c.vline(i, 80, 32, "5"); c.rect(x + 14, 96, 14, 8, "k"); c.rect(x + 15, 97, 12, 6, "Q") } },
  ]
  const preacher = (c) => {
    // an open spot by the ladder: the preacher of the Waking Church on a crate, a cup of coffee raised, his cardboard sign propped on it
    const x = 318
    c.rect(302, 122, 32, G - 122, "k"); c.rect(303, 123, 30, G - 123, "8"); c.hline(303, 123, 30, "9"); c.hline(303, 131, 30, "7")
    person(c, x, 122, { h: 54, f: 2, coat: "h", skin: "S", hair: "4", long: true, arm: [6, -56, 14] })
    c.rect(x + 7, 122 - 63, 4, 4, "k"); c.rect(x + 8, 122 - 62, 2, 2, "W")                        // the cup
    c.rect(300, 126, 36, 11, "k"); c.rect(301, 127, 34, 9, "9"); text(c, 318, 129, "NO LULL", "1")
    // his leaflets on the floor, nobody picks one up
    for (const [dx, dy] of [[-22, 6], [-12, 10], [24, 8], [34, 13]]) c.rect(x + dx, G + dy, 4, 2, "H")
  }

  // ---------------------------------------------------------------- what hangs in front: the road deck crossing, signs, screens, cables, bulbs, fans, steam
  const overhead = (c) => {
    // a road deck crossing the channel overhead, seen end on: its box, a magenta strip under it
    c.rect(440, 0, 124, 30, "2"); c.rect(440, 26, 124, 4, "3"); c.hline(440, 30, 124, "k"); c.hline(444, 31, 116, "M"); c.hline(444, 32, 116, "n")
    for (const y of [6, 14, 22]) c.hline(440, y, 124, "3"); for (let x = 446; x < 564; x += 12) c.vline(x, 2, 24, "1")
    // cables everywhere: from the beams, sagging, some dropping to the stalls
    for (let x = 20; x < W - 96; x += 96) { sag(c, x + 5, 23, x + 101, 23, 5, "k"); sag(c, x + 5, 21, x + 101, 21, 2 + (x % 4), "k") }
    for (const x of [108, 224, 296, 350, 430, 504, 564, 622, 714, 794]) c.vline(x, 30, 34, "k")
    // strings of bulbs, amber, across the whole length
    for (let x = 0; x < W - 40; x += 120) sag(c, x, 41, x + 120, 41, 7, "k", 9)
    // the market's name over the stairs' foot
    c.vline(46, 17, 8, "k"); c.vline(104, 17, 8, "k"); c.rect(40, 25, 70, 11, "k"); c.rect(41, 26, 68, 9, "n"); text(c, 75, 28, "DRAIN MARKET", "m")
    // a Lull screen hung over the preacher: the city's offer, right over his sermon
    c.vline(300, 17, 9, "k"); c.vline(336, 17, 9, "k"); c.rect(292, 26, 52, 22, "k"); c.rect(293, 27, 50, 20, "c"); text(c, 318, 30, "LULL", "V"); text(c, 318, 38, "SLEEP FREE", "v")
    // more neon hung off the deck: a hand, an arrow to the curtain, a bar's name
    c.vline(658, 17, 10, "k"); c.rect(640, 27, 40, 10, "k"); c.rect(641, 28, 38, 8, "n"); text(c, 660, 29, "OPEN 24", "m")
    c.vline(888, 17, 12, "k"); c.rect(862, 29, 52, 9, "k"); c.rect(863, 30, 50, 7, "n"); text(c, 888, 31, "NO CAMERAS", "M")
    // ceiling fans on rods
    for (const x of [166, 400, 600, 740]) { c.vline(x, 18, 22, "k"); c.rect(x - 2, 40, 5, 3, "4"); c.hline(x - 11, 41, 23, "k"); c.hline(x - 10, 42, 21, "3") }
    // the wok's steam rising to the deck, widening
    for (let i = 0; i < 7; i++) { const y = 98 - i * 9, cx = 132 + R(Math.sin(i * 0.8) * 3) - i * 3, rx = 3 + i, k = i < 3 ? "H" : i < 5 ? "h" : "5"; c.ellipse(cx, y, rx, 4, k) }
      }

  // ---------------------------------------------------------------- the crowd
  const tables = (c) => {
    // folding tables with plastic stools in front of the food stall, at its sides so the counter stays clear
    for (const [x, w] of [[84, 20], [204, 26]]) { c.rect(x, 128, w, 3, "k"); c.hline(x + 1, 128, w - 2, "6"); c.vline(x + 2, 131, 17, "k"); c.vline(x + w - 3, 131, 17, "k") }
    for (const [x, y] of [[96, 130], [217, 130]]) { c.rect(x, y - 4, 5, 4, "k"); c.rect(x + 1, y - 3, 3, 3, "H") }
  }
  const CROWD = [
    // [x, foot, options]: seated at the tables, customers at the stalls' sides, people walking the band at every depth
    [78, 148, { sit: true, f: 1, coat: "d", skin: "s", hair: "1", h: 50 }], [110, 148, { sit: true, f: -1, coat: "D", skin: "S", hair: "1", h: 50 }],
    [200, 148, { sit: true, f: 1, coat: "o", skin: "s", hair: "4", h: 50 }], [234, 148, { sit: true, f: -1, coat: "E", skin: "s", hair: "1", h: 48, acc: ["m", "scarf"] }],
    [36, 146, { f: 1, coat: "l", skin: "s", h: 50 }], [56, 147, { f: 2, coat: "d", skin: "S", h: 52, hat: "1" }],
    [252, 147, { f: 0, coat: "4", h: 52, acc: ["g", "bag"] }], [278, 146, { f: 1, coat: "L", skin: "S", h: 46 }],
    [346, 147, { f: -1, coat: "d", skin: "s", h: 50, walk: true }], [432, 158, { f: 1, coat: "l", skin: "S", h: 54, walk: true, acc: ["v", "visor"] }],
    [420, 147, { f: 0, coat: "D", h: 50 }], [502, 160, { f: -1, coat: "E", skin: "s", h: 52, walk: true }],
    [512, 147, { f: 1, coat: "o", skin: "s", h: 50 }], [528, 147, { f: 0, coat: "3", h: 54, hood: "2" }], [548, 158, { f: -1, coat: "4", skin: "S", h: 50, walk: true }],
    [572, 147, { f: 2, coat: "d", skin: "s", h: 48 }], [604, 160, { f: 1, coat: "D", skin: "s", h: 56, walk: true, acc: ["M", "bag"] }],
    [616, 148, { f: 0, coat: "l", h: 50 }], [716, 148, { f: -1, coat: "L", skin: "S", h: 48, acc: ["g", "bag"] }],
    [808, 147, { f: 1, coat: "E", skin: "s", h: 52 }], [828, 148, { f: 0, coat: "d", h: 50, hood: "3" }],
    [470, 166, { f: 1, coat: "3", skin: "s", h: 52, walk: true }], [664, 166, { f: -1, coat: "d", skin: "S", h: 50, walk: true, hat: "4" }],
    [842, 162, { f: 1, coat: "o", skin: "s", h: 54, walk: true }], [924, 150, { f: -1, coat: "l", skin: "s", h: 50, acc: ["c", "visor"] }],
    [946, 152, { f: 0, coat: "D", h: 52 }], [286, 165, { f: 0, coat: "E", h: 52, walk: true }], [394, 168, { f: -1, coat: "L", skin: "s", h: 54, walk: true }],
    [242, 156, { f: 1, coat: "D", skin: "s", h: 52, walk: true }], [518, 152, { f: 0, coat: "d", h: 50, walk: true }], [540, 170, { f: 1, coat: "E", skin: "S", h: 54, walk: true, hat: "1" }],
    [586, 154, { f: -1, coat: "4", skin: "s", h: 48, walk: true }], [640, 150, { f: 1, coat: "o", skin: "s", h: 50, acc: ["H", "cap"] }], [778, 170, { f: -1, coat: "l", skin: "S", h: 52, walk: true }],
    [820, 156, { f: -1, coat: "L", skin: "s", h: 50, walk: true }], [600, 170, { f: 1, coat: "d", skin: "S", h: 54, walk: true, acc: ["m", "scarf"] }], [14, 160, { f: 1, coat: "E", skin: "s", h: 52, walk: true }],
    [40, 62, { f: 1, coat: "o", skin: "s", h: 46 }], [75, 98, { f: -1, coat: "d", skin: "S", h: 46, acc: ["H", "cap"] }],
  ]
  const NEAR = [[20, { rim: "a" }], [62, { hat: true, rim: "A" }], [270, { rim: "a", y: 164 }], [296, { y: 166 }], [530, { rim: "t", y: 165 }], [558, { rim: "t" }], [596, { hat: true }], [770, { rim: "I", y: 164 }], [930, { y: 166 }], [952, { rim: "i" }]]

  const paint = (c) => {
    back(c); tier(c); stairsUp(c); stairsDown(c); sable(c)
    floor(c)
    pool(c, 112, 222, "warm"); pool(c, 226, 294, "cyan"); pool(c, 352, 428, "cyan"); pool(c, 432, 502, "mag"); pool(c, 624, 712, "cyan"); pool(c, 856, 920, "mag"); pool(c, 566, 620, "warm")
    for (const s of STALLS) stall(c, s)
    preacher(c); overhead(c); tables(c)
    // everyone in the band by depth, Juno among them (for scale; not part of the room)
    const all = CROWD.map(([x, f, o]) => [f, () => person(c, x, f, o)])
    all.push([164, () => juno(c, 196, 164)])
    all.sort((a, b) => a[0] - b[0]).forEach(([, d]) => d())
    for (const [x, o] of NEAR) near(c, x, o)
  }
  return { W, H, paint }
})()

scene("drain_market_a", { w: DM.W, h: DM.H, bg: "k" }, DM.paint,
  glow("m", { r: 4, strength: 0.4 }), glow("vV", { r: 3, strength: 0.25 }), glow("RW", { r: 4, strength: 0.35 }), glow("q", { r: 3, strength: 0.5 }))

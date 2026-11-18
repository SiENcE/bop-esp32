// Fischermann Street (the user's name for it; Weg_1 in the city plan, drawn by the user on 2026-11-18): from the gate at the end of Jade Row north, then west past the Wohnblock
// Lerche (the whole north side, its door where the arm turns) to the stairs down to the Old Fish Market. Seen straight down as the Drain
// Market is, at its size (about 40 px a metre, Juno 13 px across, art/characters/juno_top.px.js). On its approved BLOCKS for now (the user
// approved them 2026-11-18; the review sheets with their numbered labels: art/test/weg1_blocks.px.js), to be painted on their lines.
//   weg1_bg   960x540, 3x3 screens: the roofs, the wet street, the neon over the south sidewalk, the cables with their lanterns, the
//             noodle bar, the homeless man with his cart of screens, Lull's sheep asleep on his feet, the cleaning robot in its puddle,
//             the steam, the rubbish, Lerche's door with its canopy and keypad, the 24-hour shop's awning and light (Juno can go in),
//             the gate's roof at the arm's foot
// W1.walk(x, y) says where Juno can stand (game/places.js takes its shapes from W1's numbers, printed as WEG1_LAYOUT).
include("../lib/iso.js", { palette: true })
include("../lib/text.js")
pal({ o: "#2e2019", p: "#4e3526" })

const W1 = (() => {
  const W = 960, H = 540, fl = Math.floor, ih = ISO.ihash, bay = ISO.bay
  // the street: the north facade at y 120, the south one at y 290 (sidewalks 40 px, the road between); the arm south to the gate between
  // x 790 and 930; the stairs down to the fish market at the west end
  const NF = 120, SF = 290, AX0 = 790, AX1 = 930
  const inStreet = (x, y) => (x >= 60 && x < AX1 && y >= NF && y < SF) || (x >= AX0 && x < AX1 && y >= SF && y < 505)
  const inStairs = (x, y) => x < 60 && y >= NF + 20 && y < SF - 20
  const walk = (x, y) => (inStreet(x, y) || inStairs(x, y)) && !OCC.some(([x0, y0, x1, y1]) => x >= x0 && x < x1 && y >= y0 && y < y1)
  // what stands in the way (blocks from above)
  const OCC = [[300, 128, 340, 150], [600, 258, 650, 288], [505, 258, 548, 286], [800, 300, 822, 330], [884, 410, 926, 440]]

  const ground = (c) => {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let k
      if (inStairs(x, y)) k = fl(x / 6) % 2 ? "5" : "4"                                     // steps down to the west
      else if (inStreet(x, y)) {
        const side = (y < NF + 40 || y >= SF - 40) && x < AX0 + 2                           // the sidewalks
        k = side ? (fl(x / 20) % 2 === fl(y / 20) % 2 ? "Z" : "z") : "f"
        if (!side && y > 200 && y < 210 && fl(x / 30) % 2) k = "X"                           // the road's line
      } else k = "2"                                                                          // roofs
      c.px(x, y, k)
    }
    // puddles mirroring the neon (blobs, their colour the sign's above)
    for (const [x, y, rx, ry, k] of [[180, 200, 26, 9, "i"], [430, 230, 18, 7, "t"], [690, 180, 30, 10, "i"], [860, 380, 16, 22, "t"], [250, 268, 14, 5, "a"]])
      c.ellipse(x, y, rx, ry, k)
    // roofs: parapets, AC units, a water tank, the lift's engine house on Lerche, skylights, antennas
    const roof = (x0, y0, x1, y1) => { c.rect(x0, y0, x1 - x0, y1 - y0, "2"); c.rect(x0, y0, x1 - x0, 3, "3"); c.rect(x0, y1 - 3, x1 - x0, 3, "3"); c.rect(x0, y0, 3, y1 - y0, "3"); c.rect(x1 - 3, y0, 3, y1 - y0, "3") }
    roof(60, 0, 790, NF); roof(790, 0, W, NF); roof(0, 0, 60, NF - 20)                       // the north side is all the Wohnblock Lerche (the user's plan)
    roof(0, SF - 20, 60, H); roof(60, SF, 400, H); roof(400, SF, AX0, H); roof(AX1, NF, W, H)
    for (const [x, y] of [[250, 30], [330, 70], [610, 40], [470, 300 + 80], [200, 400], [960 - 20, 200]]) { c.rect(x, y, 22, 16, "4"); c.rect(x + 3, y + 3, 16, 10, "3") }   // AC units
    c.ellipse(860, 50, 22, 22, "4"); c.ellipse(860, 50, 18, 18, "3")                          // a water tank on the house east of the arm
    c.rect(110, 20, 50, 40, "4"); c.rect(113, 23, 44, 34, "5")                                // Lerche's lift engine house, over the lift in the north-west
    c.rect(400, 14, 40, 30, "4"); c.rect(403, 17, 34, 24, "3")                                // the stairwell's roof hatch
    for (const [x, y] of [[520, 60], [640, 330], [300, 460]]) { c.rect(x, y, 26, 18, "O"); c.rect(x + 2, y + 2, 22, 14, "Q") }   // skylights, lit
    c.line(560, 70, 590, 30, "5"); c.line(575, 70, 575, 22, "5")                              // antennas
  }

  const things = (c) => {
    const box = (x, y, w, h, k, edge = "k") => { c.rect(x - 1, y - 1, w + 2, h + 2, edge); c.rect(x, y, w, h, k) }
    const glow = (x, y, r, k, below = 1e9) => { for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) { const d = Math.hypot(i, j) / r; if (d < 1 && y + j < below && bay(x + i, y + j) < (1 - d) * 0.6) c.px(x + i, y + j, k) } }   // (below: not past a facade)
    // neon signs sticking out of the facades over the sidewalks: from above only their top edge, the light pool under them
    for (const [x, y, len, k, pool, side] of [[160, SF, 34, "m", "M", -1], [380, SF, 30, "v", "C", -1], [240, SF, 30, "Q", "P", -1], [AX0, 420, 26, "v", "C", 0]]) {
      if (side === 0) { glow(x + 30, 430, 26, pool); box(x, 418, len, 4, k) }
      else { glow(x + 2, y + side * 30, 28, pool); box(x, side > 0 ? y : y - len, 4, len, k) }
    }
    // cables across the street with lanterns hanging from them
    for (const x of [210, 520, 760]) { c.line(x, NF, x + 30, SF, "1"); for (let t = 0.2; t < 1; t += 0.3) { const lx = Math.round(x + 30 * t), ly = Math.round(NF + (SF - NF) * t); glow(lx, ly, 8, "P"); box(lx - 2, ly - 2, 4, 4, "R") } }
    // the noodle bar's awning on the south side (amber), the shut shop's shutter beside it with a tag
    box(150, SF - 22, 120, 20, "P"); for (let x = 152; x < 268; x += 8) c.rect(x, SF - 21, 4, 18, "Q")
    box(420, SF - 8, 160, 6, "4")
    // the 24-hour shop on the south side (the user's wish, 2026-11-18: Juno can go in; a side quest there later): its white light
    // spilling far over the sidewalk and into the road, the awning over its glass front with 24H on it, the door's gap in the middle
    glow(720, SF - 26, 44, "C", SF - 3); glow(720, SF - 14, 26, "V", SF - 3)
    box(662, SF - 16, 116, 14, "H"); c.rect(662, SF - 3, 116, 2, "V"); c.rect(712, SF - 3, 16, 3, "c")
    TXT.draw(c, 720, SF - 13, "24H", "C", { font: "hud", align: "center" })
    // Lerche's door in the house's south-east corner (the user's plan): a canopy over it, the keypad and the doorbell camera beside it
    // (CAM 24), the doormat
    box(735, NF, 50, 14, "5"); box(728, NF + 2, 4, 6, "C"); c.px(729, NF + 4, "q")
    // the steam vent in the road
    c.ellipse(370, 215, 9, 9, "k"); c.ellipse(370, 215, 7, 7, "3"); glow(366, 208, 14, "H")
    // trash: bags by the north facade, a dumpster on the south side, cardboard
    for (const [x, y] of [[302, 130], [314, 136], [326, 128], [332, 140]]) { c.ellipse(x, y, 7, 6, "k"); c.ellipse(x, y, 6, 5, "1") }
    box(600, 260, 48, 26, "3"); c.rect(602, 262, 44, 3, "4")
    // the homeless man under the shut shop's edge on his cardboard, his shopping cart full of old screens (one still shows static)
    box(505, 262, 26, 22, "O"); box(510, 266, 14, 16, "u"); c.ellipse(517, 266, 4, 4, "s")
    box(533, 264, 15, 20, "4"); for (const [x, y] of [[535, 266], [541, 266], [535, 274], [541, 274]]) box(x, y, 4, 5, "1"); c.rect(541, 274, 4, 5, "h")
    // something to laugh at: (A) Lull's mascot, a man in a big sheep costume, asleep on his feet, his flyers on the ground round him
    c.ellipse(680, 205, 13, 12, "k"); c.ellipse(680, 205, 12, 11, "H"); c.ellipse(680, 196, 6, 5, "1"); c.px(674, 192, "H"); c.px(686, 192, "H")
    for (const [x, y] of [[660, 222], [697, 214], [671, 228], [704, 199], [652, 202]]) box(x, y, 5, 4, "C")
    // (B) a street-cleaning robot stuck in the puddle, turning in circles, beeping
    c.ellipse(180, 200, 7, 7, "k"); c.ellipse(180, 200, 6, 6, "y"); c.px(180, 196, "q");
    for (let a = 0; a < 6.2; a += 0.35) c.px(Math.round(180 + Math.cos(a) * 13), Math.round(200 + Math.sin(a) * 6), "Z")
    // a scooter by the noodle bar, a vending machine in the arm, the gate to Jade Row at the arm's foot (its roof from above, the Lull
    // screen's back over it)
    box(276, 268, 22, 9, "U"); box(800, 300, 22, 30, "C"); c.rect(803, 303, 16, 10, "v")
    box(AX0 - 6, 505, AX1 - AX0 + 12, 35, "o"); c.rect(AX0 - 4, 507, AX1 - AX0 + 8, 6, "p"); box(AX0 + 30, 520, 80, 10, "1")
    box(884, 410, 42, 30, "1")                                                                // a stack of crates by the back door
  }
  return { W, H, NF, SF, AX0, AX1, OCC, ground, things, walk }
})()

scene("weg1_bg", { w: W1.W, h: W1.H, bg: "k" }, (c) => { W1.ground(c); W1.things(c) })
console.log("WEG1_LAYOUT " + JSON.stringify({ size: [W1.W, W1.H], NF: W1.NF, SF: W1.SF, AX: [W1.AX0, W1.AX1], occ: W1.OCC }))

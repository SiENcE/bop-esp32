// Weg_1 from above (the user's wish, 2026-11-18): the street from the Jade Row's gate to the Wohnblock Lerche and on to the Old Fish
// Market, seen straight down as the Drain Market is, at its size (about 40 px a metre, Juno 13 px across, art/characters/juno_top.px.js).
// BLOCKS of the layout for the user's approval before anything is painted: the roofs as flat dark tones, the street wet, the neon as bars
// sticking out of the facades with their pools of light on the ground, the people as blocks from above. 960x540, 3x3 screens.
//
//   weg1_blocks        the street with its places numbered (the list is in the message to the user and in the design)
//   weg1_blocks_lauf   the same with where Juno can walk (cyan dots) and the 3x3 screens as a grid
// Labels are German: this is a review sheet, never in the game.
include("../lib/iso.js", { palette: true })
include("../lib/text.js")
pal({ o: "#2e2019", p: "#4e3526" })
include("../characters/juno_top.px.js")

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
    roof(60, 0, 330, NF); roof(330, 0, 600, NF); roof(600, 0, 780, NF); roof(780, 0, W, NF); roof(0, 0, 60, NF - 20)
    roof(0, SF - 20, 60, H); roof(60, SF, 400, H); roof(400, SF, AX0, H); roof(AX1, NF, W, H)
    for (const [x, y] of [[90, 30], [130, 70], [690, 40], [470, 300 + 80], [200, 400], [960 - 20, 200]]) { c.rect(x, y, 22, 16, "4"); c.rect(x + 3, y + 3, 16, 10, "3") }   // AC units
    c.ellipse(230, 50, 22, 22, "4"); c.ellipse(230, 50, 18, 18, "3")                          // a water tank
    c.rect(500, 20, 50, 40, "4"); c.rect(503, 23, 44, 34, "5")                                // Lerche's lift engine house
    for (const [x, y] of [[380, 30], [640, 330], [300, 460]]) { c.rect(x, y, 26, 18, "O"); c.rect(x + 2, y + 2, 22, 14, "Q") }   // skylights, lit
    c.line(560, 70, 590, 30, "5"); c.line(575, 70, 575, 22, "5")                              // antennas
  }

  const things = (c) => {
    const box = (x, y, w, h, k, edge = "k") => { c.rect(x - 1, y - 1, w + 2, h + 2, edge); c.rect(x, y, w, h, k) }
    const glow = (x, y, r, k) => { for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) { const d = Math.hypot(i, j) / r; if (d < 1 && bay(x + i, y + j) < (1 - d) * 0.6) c.px(x + i, y + j, k) } }
    // neon signs sticking out of the facades over the sidewalks: from above only their top edge, the light pool under them
    for (const [x, y, len, k, pool, side] of [[160, NF, 34, "m", "M", 1], [650, NF, 30, "v", "C", 1], [240, SF, 30, "Q", "P", -1], [700, SF, 26, "m", "M", -1], [AX0, 420, 26, "v", "C", 0]]) {
      if (side === 0) { glow(x + 30, 430, 26, pool); box(x, 418, len, 4, k) }
      else { glow(x + 2, y + side * 30, 28, pool); box(x, side > 0 ? y : y - len, 4, len, k) }
    }
    // cables across the street with lanterns hanging from them
    for (const x of [210, 520, 760]) { c.line(x, NF, x + 30, SF, "1"); for (let t = 0.2; t < 1; t += 0.3) { const lx = Math.round(x + 30 * t), ly = Math.round(NF + (SF - NF) * t); glow(lx, ly, 8, "P"); box(lx - 2, ly - 2, 4, 4, "R") } }
    // the noodle bar's awning on the south side (amber), the shut shop's shutter beside it with a tag
    box(150, SF - 22, 120, 20, "P"); for (let x = 152; x < 268; x += 8) c.rect(x, SF - 21, 4, 18, "Q")
    box(420, SF - 8, 160, 6, "4")
    // Lerche's door: a canopy over it, the keypad and the doorbell camera beside it (CAM 24), the doormat
    box(430, NF, 60, 14, "5"); box(492, NF + 2, 4, 6, "C"); c.px(493, NF + 4, "q")
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
  const name = (c, x, y, t, k = "W") => TXT.draw(c, x, y, t, k, { font: "hud", align: "center" })
  const labels = (c) => {
    name(c, 30, 205, "1", "W"); name(c, 30, 90, "TREPPE ZUM", "6"); name(c, 30, 98, "FISCHMARKT", "6")
    name(c, 465, 60, "2 WOHNBLOCK LERCHE", "W"); name(c, 465, 68, "TÜR + CAM 24", "6")
    name(c, 210, 300, "3 NUDELBAR", "W"); name(c, 527, 300, "4 OBDACHLOSER", "W"); name(c, 680, 236, "5 LULL-SCHAF", "W"); name(c, 180, 216, "6 PUTZROBOTER", "W")
    name(c, 370, 236, "7 DAMPF", "6"); name(c, 316, 160, "8 MÜLL", "6"); name(c, 860, 528, "9 TOR ZUR JADE ROW", "W"); name(c, 175, 112, "NEON", "m"); name(c, 665, 112, "NEON", "v")
  }

  const scene0 = (c) => { ground(c); things(c); labels(c); c.stamp("juno_top_idle_up", 850, 470) }
  const lauf = (c) => {
    scene0(c)
    for (let y = 0; y < H; y += 6) for (let x = 0; x < W; x += 6) if (walk(x, y)) c.px(x, y, "v")
    for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) { c.rect(i * 320, j * 180, 320, 1, "N"); c.rect(i * 320, j * 180, 1, 180, "N"); TXT.draw(c, i * 320 + 4, j * 180 + 4, `BILD ${j * 3 + i + 1}`, "N", { font: "hud" }) }
  }
  return { W, H, scene0, lauf }
})()

scene("weg1_blocks", { w: W1.W, h: W1.H, bg: "k" }, W1.scene0)
scene("weg1_blocks_lauf", { w: W1.W, h: W1.H, bg: "k" }, W1.lauf)

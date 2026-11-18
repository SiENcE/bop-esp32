// Fischermann Street (the user's name for it; Weg_1 in the city plan, drawn by the user on 2026-11-18): from the gate at the end of Jade Row north, then west past the Wohnblock
// Lerche (the whole north side, its door where the arm turns) to the stairs down to the Old Fish Market. Seen straight down as the Drain
// Market is, at its size (about 40 px a metre, Juno 13 px across, art/characters/juno_top.px.js). On its approved BLOCKS for now (the user
// approved them 2026-11-18; the review sheets with their numbered labels: art/test/weg1_blocks.px.js), to be painted on their lines.
//   weg1_bg   960x540, 3x3 screens: the roofs, the wet street, the neon over the south sidewalk, the cables with their lanterns, the
//             noodle bar, the homeless man with his cart of screens, Lull's sheep asleep on his feet, the cleaning robot in its puddle,
//             the steam, the rubbish, Lerche's door with its canopy and keypad, the 24-hour shop's awning and light (Juno can go in),
//             the gate's roof at the arm's foot. The people and the robot are sprites of their own now, so they can come and go
//             (the side thread "Wer passt auf den Laden auf?", design §6.5, and the street's life, §7; BLOCKS 2026-11-18): the cardboard
//             and the flyers stay in the picture
//   weg1_homeless  45x24, 6 frames: the homeless man asleep on his cardboard (the cardboard is the picture's), his cart of old screens:
//                  one shows static, and for a beat CAM 25's landing (its phosphor green, the door a bright dot)
//   weg1_sheep     30x30, 4 frames: Lull's sheep asleep on his feet, breathing, his head nodding
//   weg1_sheep2    30x30, 2 frames: another man in the costume, awake, the sheep's head under his arm, his own head bare, a flyer held out
//   weg1_robot     15x15, 4 frames: the cleaning robot, steel, its cyan light going round (not yellow: that is Juno's)
//   weg1_drone     21x21, 4 frames: a delivery drone from above, its four rotors a blur, an amber parcel under it, its light blinking
// W1.walk(x, y) says where Juno can stand (game/places.js takes its shapes from W1's numbers, printed as WEG1_LAYOUT).
include("../lib/iso.js", { palette: true })
include("../lib/text.js")
pal({ o: "#2e2019", p: "#4e3526", J: "#22382a", F: "#3e6a4a", K: "#b8f0a0" })                      // (J F K: the feed's phosphor green, CAM 25 on a screen in the cart)

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
    // (he and his cart are weg1_homeless: when he is gone the cardboard is left)
    box(505, 262, 26, 22, "O"); c.line(507, 270, 528, 268, "o"); c.line(509, 278, 526, 280, "o")
    // something to laugh at: (A) Lull's mascot, a man in a big sheep costume, asleep on his feet, his flyers on the ground round him
    // (he is weg1_sheep, the other man weg1_sheep2)
    for (const [x, y] of [[660, 222], [697, 214], [671, 228], [704, 199], [652, 202]]) box(x, y, 5, 4, "C")
    // (B) a street-cleaning robot stuck in the puddle, turning in circles, beeping
    // (it is weg1_robot, an extra going round the puddle; its tracks stay)
    for (let a = 0; a < 6.2; a += 0.35) c.px(Math.round(180 + Math.cos(a) * 13), Math.round(200 + Math.sin(a) * 6), "Z")
    // a scooter by the noodle bar, a vending machine in the arm, the gate to Jade Row at the arm's foot (its roof from above, the Lull
    // screen's back over it)
    box(276, 268, 22, 9, "U"); box(800, 300, 22, 30, "C"); c.rect(803, 303, 16, 10, "v")
    box(AX0 - 6, 505, AX1 - AX0 + 12, 35, "o"); c.rect(AX0 - 4, 507, AX1 - AX0 + 8, 6, "p"); box(AX0 + 30, 520, 80, 10, "1")
    box(884, 410, 42, 30, "1")                                                                // a stack of crates by the back door
    // the grating over the stairs down to the fish market, shut (the user: maybe later): its bars from above, a post every metre, a padlock
    c.rect(56, NF + 18, 4, SF - NF - 36, "k"); c.rect(57, NF + 19, 2, SF - NF - 38, "5")
    for (let y = NF + 20; y < SF - 20; y += 40) { c.rect(55, y, 6, 4, "k"); c.rect(56, y + 1, 4, 2, "6") }
    c.rect(54, 203, 3, 4, "G"); c.px(55, 204, "4")
  }
  return { W, H, NF, SF, AX0, AX1, OCC, ground, things, walk }
})()

{
  const ih = ISO.ihash, bay = ISO.bay
  const blob = (c, x, y, rx, ry, k) => { c.ellipse(x, y, rx + 1, ry + 1, "k"); c.ellipse(x, y, rx, ry, k) }
  anim("weg1_homeless", { w: 45, h: 24, ms: [500, 500, 500, 500, 500, 260] }, (c) => {
    const f = c.frame ?? 0
    // he lies on his side under a blanket, his head to the west, his knees drawn up
    c.rect(5, 4, 17, 17, "k"); c.rect(6, 5, 15, 15, "u"); c.rect(7, 6, 13, 3, f === 2 ? "U" : "u")
    for (let y = 7; y < 19; y += 3) c.hline(8, y, 11, "o")
    blob(c, 13, 5, 3, 3, "s"); c.px(12, 4, "1"); c.px(14, 4, "1")
    // the cart, its handle to him, the old screens in it
    c.rect(28, 2, 17, 22, "k"); c.rect(29, 3, 15, 20, "4"); c.hline(27, 1, 19, "5")
    for (const [x, y] of [[31, 5], [37, 5], [31, 13], [37, 13]]) { c.rect(x, y, 5, 6, "k"); c.rect(x, y, 4, 5, "1") }
    if (f === 5) { c.rect(37, 13, 4, 5, "J"); c.hline(37, 16, 4, "F"); c.px(39, 14, "K") }       // CAM 25's landing, for a beat
    else for (let y = 13; y < 18; y++) for (let x = 37; x < 41; x++) c.px(x, y, ih(x + f * 7, y) < 0.45 ? "6" : "3")   // static
  })
  const sheep = (c, f, awake) => {
    blob(c, 15, 16, awake ? 12 : 12 + (f % 2), 11, "H")                                         // the woolly body
    for (let y = 6; y < 27; y++) for (let x = 4; x < 27; x++) if (c.key(x, y) === "H" && bay(x, y) < 0.18) c.px(x, y, "G")
    if (!awake) {
      const ny = f === 3 ? 8 : 7
      blob(c, 15, ny, 6, 5, "1"); c.px(9, ny - 4, "H"); c.px(21, ny - 4, "H"); c.px(10, ny - 3, "H"); c.px(20, ny - 3, "H")   // the sheep's head, its ears
      c.px(13, ny + 2, "3"); c.px(17, ny + 2, "3")                                                 // its button eyes, shut
    } else {
      blob(c, 15, 8, 4, 4, "o"); c.px(14, 6, "p")                                                 // his own head, bare: dark hair
      blob(c, 26, 18, 4, 4, "H"); c.ellipse(27, 18, 2, 2, "1")                                    // the sheep's head under his arm
      const fx = f ? 0 : 2; c.rect(fx, 21, 6, 5, "k"); c.rect(fx + 1, 22, 4, 3, "C")              // a flyer held out
    }
  }
  anim("weg1_sheep", { w: 30, h: 30, ms: [900, 900, 900, 500] }, (c) => sheep(c, c.frame ?? 0, false))
  anim("weg1_sheep2", { w: 30, h: 30, ms: [700, 700] }, (c) => sheep(c, c.frame ?? 0, true))
  anim("weg1_robot", { w: 15, h: 15, frames: 4, fps: 6 }, (c) => {
    const f = c.frame ?? 0
    blob(c, 7, 7, 6, 6, "5"); c.ellipse(7, 7, 4, 4, "6"); c.ellipse(6, 6, 1, 1, "H")
    const [lx, ly] = [[7, 2], [12, 7], [7, 12], [2, 7]][f]; c.px(lx, ly, "V"); c.px(7, 7, "v")   // its light going round
  })
  anim("weg1_drone", { w: 21, h: 21, frames: 4, fps: 12 }, (c) => {
    const f = c.frame ?? 0
    for (const [x, y] of [[4, 4], [16, 4], [4, 16], [16, 16]]) {                               // the rotors, a pale blur with an ink edge
      c.ellipse(x, y, 4, 4, "k"); c.ellipse(x, y, 3, 3, f % 2 ? "6" : "5"); c.px(x + (f % 2 ? 2 : -2), y + (f < 2 ? -2 : 2), "H")
    }
    c.line(5, 5, 15, 15, "k"); c.line(15, 5, 5, 15, "k"); c.line(6, 5, 15, 14, "G"); c.line(14, 5, 5, 14, "G")   // the arms
    for (const [x, y] of [[4, 4], [16, 4], [4, 16], [16, 16]]) c.px(x, y, "G")                // the hubs
    c.rect(7, 7, 7, 7, "k"); c.rect(8, 8, 5, 5, "P"); c.hline(8, 10, 5, "O"); c.vline(10, 8, 5, "O")   // the parcel, tied
    if (f === 0) c.px(10, 6, "v")                                                               // its light
  })
}

scene("weg1_bg", { w: W1.W, h: W1.H, bg: "k" }, (c) => { W1.ground(c); W1.things(c) })
console.log("WEG1_LAYOUT " + JSON.stringify({ size: [W1.W, W1.H], NF: W1.NF, SF: W1.SF, AX: [W1.AX0, W1.AX1], occ: W1.OCC }))

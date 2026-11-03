// Review sheet for the feed people and the zooms (not game art).
//   feed_lineup: every figure and pose at 1x on the phosphor backdrop (row by row), and at the
//                bottom cam03's 22:00 crowd on a wet phosphor street: Kessler among the commuters,
//                the decoy (commuter_c) beside him.
//   feed_zooms:  the zoom windows, side by side.
// Build: PXL build art/characters/feed_people_review.px.js --out build/review --no-preview
// then docs/characters/feed_people_x4.png is the lineup at 4x over the zooms at 2x (see the command
// at the end of this file).
include("feed_people.px.js")
include("../ui/zooms.px.js")
pal({
  0: "#030a0a", 1: "#071514", 2: "#0c221f", 3: "#12332d", 4: "#1a483e",
  5: "#266252", 6: "#388169", 7: "#55a585", 8: "#8acfae", 9: "#d4f7e2",
})

const RV_W = 300, RV_STEP = 21
const rvLabel = (c, x, y, s) => c.text(x, y, s, "6")

scene("feed_lineup", { w: RV_W, h: 300, bg: "1", frames: 1 }, (c) => {
  for (let y = 0; y < 252; y++) for (let x = 0; x < RV_W; x++) c.px(x, y, y % 2 ? "1" : "2")
  const row = (y, label, items) => {
    rvLabel(c, 3, y - 31, label)
    items.forEach(([name, t], i) => c.stamp(name, 14 + i * RV_STEP, y, { t }))
  }
  const walk = (n) => [0, 1, 2, 3, 4, 5].map((i) => [n, i * 100])
  row(36, "KESSLER  IDLE / WALK / PHONE / UMBRELLA / SIT", [
    ["kessler_feed", 0], ["kessler_feed", 1600], ...walk("kessler_feed_walk"),
    ["kessler_feed_phone", 0], ["kessler_feed_phone", 900], ["kessler_feed_umbrella", 0], ["kessler_feed_sit", 0], ["kessler_feed_sit", 1500]])
  row(72, "VARGA  IDLE / WALK / SIT", [["varga_feed", 0], ["varga_feed", 2000], ...walk("varga_feed_walk"),
    ["varga_feed_sit", 0], ["varga_feed_sit", 1300]])
  row(104, "COMMUTER A  UMBRELLA", [["commuter_a_feed", 0], ...walk("commuter_a_feed_walk")])
  row(136, "COMMUTER B  HOOD", [["commuter_b_feed", 0], ["commuter_b_feed", 1200], ...walk("commuter_b_feed_walk")])
  row(171, "COMMUTER C  LONG COAT, THE DECOY", [["commuter_c_feed", 0], ["commuter_c_feed", 1500], ...walk("commuter_c_feed_walk")])
  row(203, "COMMUTER D  BAG", [["commuter_d_feed", 0], ["commuter_d_feed", 1300], ...walk("commuter_d_feed_walk")])
  row(238, "YUEN'S COOK", [0, 150, 300, 450].map((t) => ["yuen_cook_feed", t]))

  // cam03 at 22:00: a wet street in the phosphor (paving 2-3, puddles holding the office's light)
  for (let y = 254; y < 300; y++) for (let x = 0; x < RV_W; x++) {
    const tile = ((Math.floor(x / 12) + Math.floor((y - 254) / 6)) & 1) ? "3" : "2"
    const puddle = ((x - 60) ** 2 / 400 + (y - 290) ** 2 / 9 < 1) || ((x - 200) ** 2 / 600 + (y - 282) ** 2 / 12 < 1)
    c.px(x, y, puddle ? (y % 3 ? "4" : "5") : (y % 2 && tile === "3" ? "2" : tile))
  }
  rvLabel(c, 3, 256, "CAM03 22:00, 1X: WHICH ONE IS KESSLER?")
  const crowd = [["commuter_b_feed_walk", 30, 290, 0], ["commuter_a_feed_walk", 62, 294, 300], ["commuter_c_feed", 96, 292, 0],
    ["kessler_feed", 124, 294, 0], ["commuter_d_feed_walk", 152, 291, 200], ["commuter_c_feed_walk", 186, 296, 400],
    ["kessler_feed_umbrella", 220, 294, 0], ["commuter_a_feed", 252, 290, 0], ["varga_feed", 280, 295, 0]]
  for (const [n, x, y, t] of crowd) c.stamp(n, x, y, { t, ...(x > 200 && n !== "varga_feed" ? { flip: "x" } : {}) })
})

scene("feed_zooms", { w: 5 * 98 + 2, h: 64, bg: "1", frames: 1 }, (c) => {
  for (let y = 0; y < 64; y++) for (let x = 0; x < c.w; x++) c.px(x, y, y % 2 ? "1" : "2")
  const zs = [["zoom_sticker_cam04", 0], ["zoom_vending_n7", 0], ["zoom_kessler_face", 0], ["zoom_ring", 0], ["zoom_ring_hand_pale", 0]]
  zs.forEach(([n, t], i) => c.stamp(n, 2 + i * 98, 6, { t }))
})

// Compose (PIL, nearest neighbour), from the project root: the lineup at 4x, the zooms below it at 2x
//   python -c "from PIL import Image as I
//   a=I.open('build/review/scenes/feed_lineup.png').convert('RGB'); b=I.open('build/review/scenes/feed_zooms.png').convert('RGB')
//   A=a.resize((a.width*4,a.height*4),0); z=[b.crop((2+i*98,6,98+i*98,62)).resize((192,112),0) for i in range(5)]
//   o=I.new('RGB',(A.width,A.height+128),'#030a0a'); o.paste(A,(0,0))
//   [o.paste(im,(8+i*198,A.height+8)) for i,im in enumerate(z)]; o.save('docs/characters/feed_people_x4.png')"

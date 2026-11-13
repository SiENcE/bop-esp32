// Chapter 1, job A: Herr Kessler with a hood, as the feeds show him, in blocks for approval before he is painted. He replaces
// mock_kessler_hood (art/mock/ch1_blocks.px.js): since the meeting at Yuen's he hides, and the hood instead of his scarf is how one
// knows him (game/auftrag_varga.js: cam03 at the vending machine from 22:15, cam15 in at the door at 22:30 and along the wall to 23).
// A feed figure as in art/characters/feed_people.px.js: the phosphor ramp only, about 24 px, pivot bottom-centre, the rim 1, 3-4 values
// inside and one accent, the brightest value on him. His build as there: a small man, round shoulders, the head pushed forward; the coat
// 4, trousers 3, shoes 2, head and hands 6. Three kinds of hood:
//   A  a grey hoodie under his office coat, its hood up: the light hood (8) on the dark coat (4) is the tell, a pale strip of the hoodie
//      in the coat's opening in front
//   B  a cheap rain cape over everything, its hood drawn tight: a wet plastic cone to the knees (5), glints of rain down it (8)
//   C  a padded jacket with its hood pulled low over the eyes: dark and bulky (3), a light lining round the hood's opening (7-8),
//      the hands in the pockets
// The game needs him both ways (the engine picks the view by the way he walks: down the screen se/sw, up it ne/nw). cam03 walks his
// path round and round: down from the far exit to the machine and on to the right (in front), back up to the far exit (from behind);
// he never stands at the machine with his back to us, he passes it (and stops wherever he is while Juno's lines run). In cam15 the
// door is 6 px below 23's ladder, so he walks in from behind (nw) the whole way and stays so. Each variant is drawn both ways, idle.
// commuter_b (a hood too, a short jacket) is beside them: Kessler's hood must not be his.
//   kessler_hood_blocks         the sheet, in the feed's ramp: A B C behind and in front, each beside the old Kessler with his scarf, commuter_b;
//                               their silhouettes below
//   kh_<a|b|c>_<back|front>     each alone, pivot bottom (the feet)
//   kessler_hood_im_raum        cam03 at the machine and cam15 at the door and at 23's ladder (game screenshots, 22:15 and 22:30)
pal({
  0: "#030a0a", 1: "#071514", 2: "#0c221f", 3: "#12332d", 4: "#1a483e",
  5: "#266252", 6: "#388169", 7: "#55a585", 8: "#8acfae", 9: "#d4f7e2",
})
ramps("0123456789")
include("../lib/text.js")

/** a grid of values, "." left out */
const g = (c, x, y, rows) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== ".") c.px(x + i, y + j, ch) }))
/** standing legs: the far one at fx, the near one at nx, 3 wide, from the hip to two rows of shoe */
const legs = (c, fx, nx, hip, H, leg = "3") => { for (const x of [fx, nx]) { c.rect(x, hip, 3, H - 2 - hip, leg); c.rect(x, H - 2, 3, 2, "2") } }

// ---------------------------------------------------------------- A: the hoodie under the office coat
sprite("kh_a_back", { w: 11, h: 22, outline: "1", pivot: "bottom" }, (c) => {
  legs(c, 2, 6, 17, 22)
  g(c, 0, 0, [
    "....7887...",
    "...788888..",
    "...7888888.",
    "...6788888.",
    "...6778887.",
    "..46677776.",
    ".444666644.",
    ".424466424.",
    ".424444424.",
    ".424444424.",
    ".424444424.",
    ".424444424.",
    ".424444424.",
    ".424444424.",
    ".424444424.",
    ".444444444.",
    "..4444444..",
  ])
  c.rect(1, 13, 1, 2, "6"); c.rect(9, 13, 1, 2, "6")          // the hands
})
sprite("kh_a_front", { w: 11, h: 22, outline: "1", pivot: "bottom" }, (c) => {
  legs(c, 2, 6, 17, 22)
  g(c, 0, 0, [
    "...7887....",
    "..788887...",
    "..8655568..",
    "..8535358..",
    "..8655558..",
    "..7855587..",
    ".446777644.",
    ".424787424.",
    ".424787424.",
    ".424777424.",
    ".424777424.",
    ".424767424.",
    ".424767424.",
    ".424444424.",
    ".424444424.",
    ".444444444.",
    "..4444444..",
  ])
  c.rect(1, 13, 1, 2, "6"); c.rect(9, 13, 1, 2, "6")
})

// ---------------------------------------------------------------- B: the rain cape
/** the cape's cone from the hood down to below the knees; o.front: the snaps down its front */
function cape(c, o) {
  legs(c, 4, 8, 17, 22)
  for (let r = 6; r <= 17; r++) {
    const half = 4 + Math.round((r - 6) * 3 / 11), x0 = 7 - half
    c.rect(x0, r, half * 2 + 1, 1, "5"); c.px(x0, r, "4"); c.px(x0 + 1, r, "4")
  }
  c.hline(1, 17, 13, "4")                                          // the hem, a step darker where it curls
  for (const [x, y, n] of [[10, 7, 6], [5, 9, 5], [12, 12, 4], [8, 13, 3]]) c.vline(x, y, n, "7")   // rain running down the plastic
  c.px(10, 8, "8"); c.px(5, 10, "8"); c.px(12, 13, "8")
  if (o.front) for (let y = 8; y <= 15; y += 2) c.px(7, y, "6")
}
sprite("kh_b_back", { w: 15, h: 22, outline: "1", pivot: "bottom" }, (c) => {
  cape(c, {})
  g(c, 4, 0, [
    "...56..",
    "..5667.",
    ".556678",
    ".456677",
    ".455677",
    "4455666",
    "4445556",
  ])
})
sprite("kh_b_front", { w: 15, h: 22, outline: "1", pivot: "bottom" }, (c) => {
  cape(c, { front: true })
  g(c, 4, 0, [
    "..65...",
    ".7665..",
    "8622265",
    "7255526",
    "7535356",
    "6655566",
    "4466655",
  ])
})

// ---------------------------------------------------------------- C: the padded jacket, the hood pulled low
sprite("kh_c_back", { w: 13, h: 22, outline: "1", pivot: "bottom" }, (c) => {
  legs(c, 3, 7, 17, 22)
  g(c, 0, 1, [
    ".....44444...",
    "....4444447..",
    "...44444447..",
    "...34444478..",
    "...33444478..",
    ".3333444333..",
    "33343444443..",
    "3443344444433",
    "3443333333433",
    "3443444444433",
    "3443444444433",
    "3443333333433",
    "3443444444433",
    "3443444444433",
    "3333333333333",
    ".33333333333.",
  ])
})
sprite("kh_c_front", { w: 13, h: 22, outline: "1", pivot: "bottom" }, (c) => {
  legs(c, 3, 7, 17, 22)        // the hood pushed forward to screen right, as the old Kessler's head (he faces se)
  g(c, 0, 1, [
    ".....44444...",
    "....4444444..",
    "....4444444..",
    "....7888887..",
    "....7255527..",
    ".33374555473.",
    "..33447774333",
    "3344445443443",
    "3343335333443",
    "3344445443443",
    "3344345433443",
    "3343335333443",
    "3343335333443",
    "3344445433443",
    "3333335333333",
    ".33333333333.",
  ])
})

// ---------------------------------------------------------------- for comparison: the old Kessler and the hooded commuter, as built
sprite("kh_old", { png: "../../build/art/cams/anims/kessler_feed.png", area: [0, 0, 13, 23], pivot: "bottom" })
sprite("kh_commuter_b", { png: "../../build/art/cams/anims/commuter_b_feed.png", area: [0, 0, 13, 23], pivot: "bottom" })

// ---------------------------------------------------------------- the sheet
// three panels, each the old Kessler beside the hood from behind and in front; the hooded commuter at the end
const PANELS = [["A", "HOODIE", "kh_a"], ["B", "RAIN CAPE", "kh_b"], ["C", "PADDED", "kh_c"]]
const PW = 92, FOOT = 46, SIL = 88
scene("kessler_hood_blocks", { w: 3 * PW + 34, h: 94, bg: "3" }, (c) => {
  c.rect(0, FOOT + 6, 3 * PW + 34, 94 - FOOT - 6, "6"); c.rect(0, FOOT, 3 * PW + 34, 6, "2"); c.hline(0, FOOT, 3 * PW + 34, "4")
  const col = (x, name, label) => {
    TXT.draw(c, x, 11, label, "5", { font: "hud", align: "center" })
    c.stamp(name, x, FOOT)
    c.stamp(name, x, SIL, { swap: { 1: "0", 2: "0", 3: "0", 4: "0", 5: "0", 6: "0", 7: "0", 8: "0", 9: "0" } })
  }
  PANELS.forEach(([id, what, n], i) => {
    const x0 = i * PW
    if (i) c.vline(x0, 2, FOOT - 2, "2")
    TXT.draw(c, x0 + PW / 2, 2, id + " " + what, "8", { font: "hud", align: "center" })
    col(x0 + 16, "kh_old", "OLD"); col(x0 + 46, n + "_back", "BACK"); col(x0 + 76, n + "_front", "FRONT")
  })
  c.vline(3 * PW, 2, FOOT - 2, "2")
  TXT.draw(c, 3 * PW + 17, 2, "CB", "6", { font: "hud", align: "center" })
  col(3 * PW + 17, "kh_commuter_b", "HOOD")
})

// ---------------------------------------------------------------- in the room: the labels' frame
// The game's own picture goes into each window (build/blocks/kessler_hood/compose.py pastes the 1x buffers of
// game screenshots, Kessler (kessler2) wearing the blocks at his places, in the view the game gives him there: cam03 22:15 at
// the machine (85,84, in front, come down from the far exit) and on his way back up to it (250,76, from behind), cam15 22:30 at
// the door (258,126) and at 23's ladder (125,120), both from behind).
const IR = { x: 22, y: 11, w: 96, h: 64, gap: 2 }
const IR_COLS = ["CAM03 MACHINE", "CAM03 WAY UP", "CAM15 DOOR", "CAM15 LADDER"], IR_ROWS = ["OLD", "A", "B", "C"]
scene("kessler_hood_im_raum", { w: IR.x + 4 * (IR.w + IR.gap), h: IR.y + 4 * (IR.h + IR.gap), bg: "1" }, (c) => {
  IR_COLS.forEach((t, i) => TXT.draw(c, IR.x + i * (IR.w + IR.gap) + IR.w / 2, 2, t, "7", { font: "hud", align: "center" }))
  IR_ROWS.forEach((t, j) => {
    const y = IR.y + j * (IR.h + IR.gap)
    TXT.draw(c, IR.x / 2, y + IR.h / 2 - 3, t, j ? "8" : "6", { font: "hud", align: "center" })
    for (let i = 0; i < 4; i++) c.rect(IR.x + i * (IR.w + IR.gap), y, IR.w, IR.h, "0")
  })
})

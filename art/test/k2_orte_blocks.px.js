// Chapter 2, what comes after Chapter 1 and the small echoes (kapitel2-design §5, §9.1, §14): the changes to finished pictures as blocks for
// the user's choice, each drawn over the place as the game shows it on Saturday at 20:00 (build/blocks/orte/<place>_1x.png, the game's
// own screenshots, the interface with them). Plain shapes in the places' own colours; painted once approved.
//   jade_row     after K1b sold: planks nailed across Okonkwo's windows and door. After K1b warned: WHO TALKED? sprayed on the dark
//                facade on the right, in the Tidewater Boys' teal (their tide mods glow so), dripping
//   cam07v       after K1b sold: the machine's camera looks at the planks from across the lane; between them the shop is dark, the shelves
//                half empty
//   kessel_14    after K1b lied: GLASSER LIES sprayed across Juno's door, in the same teal, along the wall's slope
//   kowalski     after K1b sold, Saturday and Sunday: Bao's cart and umbrella are gone (no art: the street without them)
//   cam03        someone else at the machine where Kessler stood, pulling number 7 (Kessler buys his noodles elsewhere now): one of the
//                feed's commuters, no new figure
//   cam22        Saturday: Ines' place at the counter empty, and the cook has put a bowl there anyway, steaming
//   cam30        the police tape across the way down to the old station, in the camera's own perspective (art/cams/cam30.px.js,
//                cam30_tape), and the sign's words fixed along its edge
//   gasse        a paper boat at the monument among the candles, I. written on its side (too small to read: the look says it)
//   k2_orte_<place>   each place 320x180
"use strict"
pal({
  k: "#0c0e1a",
  // wood (light, mid, dark), the nails; the Tidewater teal (bright, mid)
  W: "#c89a60", w: "#9a7040", d: "#5a3e26", n: "#a8a8b0", T: "#3ad0b0", t: "#1e8a78",
  // paper
  P: "#e8e4d8", p: "#a8a498",
  // phosphor (the feeds)
  0: "#030a0a", 1: "#071514", 2: "#0c221f", 3: "#12332d", 4: "#1a483e", 5: "#266252", 6: "#388169", 7: "#55a585", 8: "#8acfae", 9: "#d4f7e2",
})
include("../lib/text.js")

const BG = (id) => sprite(`_bg_${id}`, { png: `../../build/blocks/orte/${id}_1x.png`, area: [0, 0, 320, 180] })
for (const id of ["jade_row", "cam07v", "kessel_14", "kowalski", "cam03", "cam22", "cam30", "gasse"]) BG(id)

/** a plank from (x0, y0) to (x1, y1), 3 px thick, its top edge lit, a nail at each end */
function plank(c, x0, y0, x1, y1) {
  c.line(x0, y0, x1, y1, "W"); c.line(x0, y0 + 1, x1, y1 + 1, "w"); c.line(x0, y0 + 2, x1, y1 + 2, "d")
  c.px(x0 + 2, y0 + 1, "n"); c.px(x1 - 2, y1 + 1, "n")
}
/** sprayed words, with a drip under some letters */
function spray(c, x, y, text, drips) {
  TXT.draw(c, x, y, text, "T", { font: "hud" })
  for (const dx of drips) { c.vline(x + dx, y + 5, 2 + (dx % 3), "t") }
}
/** text along an iso wall facing SE (it rises to the right, one up for two across), in a sprite of its own */
function sheared(id, lines, k, drips) {
  const W = 40, H = 34
  sprite(id, { w: W, h: H }, (c) => {
    lines.forEach((s, i) => TXT.draw(c, 0, 20 + i * 7, s, k, { font: "hud" }))
    const buf = []
    for (let j = 20; j < H; j++) for (let i = 0; i < W; i++) if (c.key(i, j) === k) buf.push([i, j])
    for (const [i, j] of buf) c.px(i, j, "_")
    for (const [i, j] of buf) c.px(i, j - 20 + 20 - Math.floor(i / 2), k)
    for (const i of drips) c.vline(i, 26 - Math.floor(i / 2), 2 + (i % 3), "t")
  })
}
sheared("_k2o_glasser", ["GLASSER", "LIES"], "T", [2, 9, 18])
scene("k2_orte_jade_row", { w: 320, h: 180 }, (c) => {
  c.stamp("_bg_jade_row", 0, 0)
  // the windows dark behind the planks (nobody lit them since), then raw new planks across the left window, the door and the shelves' window
  for (const [x, y, w, h] of [[0, 90, 36, 58], [37, 87, 22, 48], [60, 86, 34, 52]]) for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if ((i + j) % 3) c.px(x + i, y + j, "k")
  plank(c, 2, 96, 34, 108); plank(c, 2, 120, 34, 110); plank(c, 2, 136, 34, 140)
  plank(c, 38, 92, 58, 98); plank(c, 38, 112, 58, 108); plank(c, 38, 126, 58, 130)
  plank(c, 60, 92, 93, 100); plank(c, 60, 112, 93, 106); plank(c, 60, 128, 93, 132)
  // WHO TALKED? on the dark facade on the right
  spray(c, 284, 106, "WHO", [1, 9]); spray(c, 282, 114, "TALKED?", [4, 13, 22])
})
scene("k2_orte_cam07v", { w: 320, h: 180 }, (c) => {
  c.stamp("_bg_cam07v", 0, 0)
  // the shop dark behind the planks: every second pixel of it in the dark, the shelves half empty
  for (let y = 26; y < 150; y++) for (let x = 80; x < 320; x++) if ((x + y) % 2 === 0) c.px(x, y, "1")
  for (const [x, y, w] of [[106, 38, 30], [150, 52, 40], [118, 70, 26], [176, 70, 30]]) c.rect(x, y, w, 5, "1")
  // the planks across the window, near the camera: lit by the machine's own light
  for (const [y0, y1] of [[30, 44], [70, 62], [104, 112]]) {
    c.line(78, y0, 320, y1, "6"); c.line(78, y0 + 1, 320, y1 + 1, "6"); c.line(78, y0 + 2, 320, y1 + 2, "5"); c.line(78, y0 + 3, 320, y1 + 3, "3")
    c.line(78, y0 + 4, 320, y1 + 4, "3")
  }
})
scene("k2_orte_kessel_14", { w: 320, h: 180 }, (c) => {
  c.stamp("_bg_kessel_14", 0, 0)
  // GLASSER LIES across her door, along the wall's slope
  c.stamp("_k2o_glasser", 79, 37)
})
scene("k2_orte_kowalski", { w: 320, h: 180 }, (c) => { c.stamp("_bg_kowalski", 0, 0) })   // (shot without the cart, see the game's shot)
sprite("_k2o_someone", { png: "../../build/art/characters/anims/commuter_d_feed.png", area: [0, 0, 13, 22] })
scene("k2_orte_cam03", { w: 320, h: 180 }, (c) => {
  c.stamp("_bg_cam03", 0, 0)
  c.stamp("_k2o_someone", 85 - 6, 84 - 22)                                     // at the machine where Kessler stood
})
scene("k2_orte_cam22", { w: 320, h: 180 }, (c) => {
  c.stamp("_bg_cam22", 0, 0)
  // her place empty; a bowl on the counter before it, steaming
  c.rect(154, 104, 12, 3, "8"); c.hline(155, 107, 10, "6"); c.hline(156, 103, 8, "9")
  for (const [x, y] of [[157, 99], [158, 97], [161, 98], [162, 96], [160, 94]]) c.px(x, y, "7")
})
sprite("_k2o_tape", { png: "../../build/art/cams/scenes/cam30_tape.png", area: [0, 0, 320, 180] })
scene("k2_orte_cam30", { w: 320, h: 180 }, (c) => {
  c.stamp("_bg_cam30", 0, 0)
  c.stamp("_k2o_tape", 0, 0)                                                     // the tape from the camera's own art (art/cams/cam30.px.js)
})
scene("k2_orte_gasse", { w: 320, h: 180 }, (c) => {
  c.stamp("_bg_gasse", 0, 0)
  // the paper boat among the candles at the monument's foot, I. on its side
  ;["...P....", "..PPP...", "PPPPPPPP", ".pPPPPp.", "..pppp.."].forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== ".") c.px(198 + i, 117 + j, ch) }))
  c.px(201, 120, "k"); c.px(203, 120, "k")
})

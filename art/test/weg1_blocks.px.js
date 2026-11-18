// Weg_1 from above: the review sheets of its BLOCKS (approved by the user, 2026-11-18), the room's picture (art/rooms/weg1.px.js) with
// its places numbered, Juno at her size by the gate, and with where she can walk and the 3x3 screens.
//   weg1_blocks        the street with its places numbered
//   weg1_blocks_lauf   the same with where Juno can walk (cyan dots) and the 3x3 screens as a grid
// Labels are German: this is a review sheet, never in the game.
include("../rooms/weg1.px.js", { palette: true })
include("../characters/juno_top.px.js")

const W1S = (() => {
  const { W, H } = W1
  const name = (c, x, y, t, k = "W") => TXT.draw(c, x, y, t, k, { font: "hud", align: "center" })
  const labels = (c) => {
    name(c, 30, 205, "1", "W"); name(c, 30, 90, "TREPPE ZUM", "6"); name(c, 30, 98, "FISCHMARKT", "6")
    name(c, 300, 60, "2 WOHNBLOCK LERCHE", "W"); name(c, 760, 100, "TÜR + CAM 24", "6"); name(c, 135, 66, "AUFZUG", "6"); name(c, 420, 50, "TREPPE", "6")
    name(c, 210, 300, "3 NUDELBAR", "W"); name(c, 527, 300, "4 OBDACHLOSER", "W"); name(c, 680, 236, "5 LULL-SCHAF", "W"); name(c, 180, 216, "6 PUTZROBOTER", "W")
    name(c, 370, 236, "7 DAMPF", "6"); name(c, 316, 160, "8 MÜLL", "6"); name(c, 860, 528, "9 TOR ZUR JADE ROW", "W"); name(c, 175, 300, "NEON", "m"); name(c, 395, 300, "NEON", "v")
  }

  const scene0 = (c) => { W1.ground(c); W1.things(c); labels(c); c.stamp("juno_top_idle_up", 850, 470) }
  const lauf = (c) => {
    scene0(c)
    for (let y = 0; y < H; y += 6) for (let x = 0; x < W; x += 6) if (W1.walk(x, y)) c.px(x, y, "v")
    for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) { c.rect(i * 320, j * 180, 320, 1, "N"); c.rect(i * 320, j * 180, 1, 180, "N"); TXT.draw(c, i * 320 + 4, j * 180 + 4, `BILD ${j * 3 + i + 1}`, "N", { font: "hud" }) }
  }
  return { W, H, scene0, lauf }
})()

scene("weg1_blocks", { w: W1S.W, h: W1S.H, bg: "k" }, W1S.scene0)
scene("weg1_blocks_lauf", { w: W1S.W, h: W1S.H, bg: "k" }, W1S.lauf)

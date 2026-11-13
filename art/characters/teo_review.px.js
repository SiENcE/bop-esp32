// Review sheet for Teo (not game art): each view on a row, the approved block A at the left (from a scratch build of
// art/test/teo_blocks.px.js into build/paint/teo/blocks), then the idle, the patch dim between the beats, the blink, the talk
// and the walk's eight frames.
// Build: first
//   PXL build art/test/teo_blocks.px.js --out build/paint/teo/blocks
//   PXL build art/characters/teo_review.px.js --out build/paint/teo/review --no-preview
// then docs/characters/teo_x4.png is build/paint/teo/review/scenes/teo_review.png at 4x (nearest neighbour).
include("teo.px.js")
include("../lib/text.js")
pal({ k: "#0c0e1a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0", 7: "#8e9ab0" })

for (const b of ["se", "ne", "nwp", "bowl"]) sprite(`_blk_${b}`, { png: `../../build/paint/teo/blocks/sprites/teo_blocks_a_${b}.png`, pivot: "bottom" })

const ROWS = [["SE", "teo", "se", "se"], ["NE", "teo", "ne", "ne"], ["NW", "teo", "nw", "nwp"], ["BOWL", "teo_bowl", "se", "bowl"]]
const COLS = [["BLOCK"], ["IDLE", "idle", 0], ["DIM", "idle", 900], ["BLINK", "idle", 2000], ["TALK", "talk", 200],
  ...Array.from({ length: 8 }, (_, i) => [i ? String(i) : "WALK 0", "walk", i * 100])]
const CW = 27, RH = 60, TOP = 12, W = 8 + COLS.length * CW, H = TOP + ROWS.length * RH

scene("teo_review", { w: W, h: H, bg: "3" }, (c) => {
  COLS.forEach(([lab], i) => TXT.draw(c, 8 + i * CW + 12, 3, lab, "7", { font: "hud", align: "center" }))
  ROWS.forEach(([lab, pre, view, blk], r) => {
    const fy = TOP + r * RH + 54
    c.rect(0, fy, W, 2, "2")
    TXT.draw(c, 1, fy - 56 + 2, lab, "6", { font: "hud" })
    COLS.forEach(([, what, t], i) => {
      const x = 8 + i * CW + 12
      if (!what) c.stamp(`_blk_${blk}`, x, fy, { flip: blk === "nwp" ? "x" : undefined })
      else c.stamp(`${pre}_${what}_${view}`, x, fy, { t })
    })
  })
  c.vline(8 + CW - 1, TOP, H - TOP, "4")
})

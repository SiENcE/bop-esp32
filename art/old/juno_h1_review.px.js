// SUPERSEDED (H1c, 2026-11-04): the old scale (18 px per meter of height). Kept for reference; not built.
// Review sheet for Juno (not game art): every view and a few walk frames side by side, on a scrap
// of the night street (wet paving #1c2738 / #253349, 2:1 tiles) and on a phosphor feed backdrop.
// Build: PXL build art/characters/juno_review.px.js --only lineup --share 4 --out build/review
include("juno_h1.px.js")

pal({
  k: "#0c0e1a", e: "#0f151f", f: "#151d2b", z: "#1c2738", Z: "#253349", X: "#32445f",   // the street
  w: "#617aa0",                                                                       // labels
  a: "#071514", b: "#0c221f", d: "#55a585",                                           // the feed
})

const LW = 212, LH = 170, STEP = 25
const tileKey = (x, y) => {                       // 2:1 floor tiles, 32x16 diamonds
  const u = Math.floor((y + x / 2) / 16), v = Math.floor((y - x / 2) / 16)
  return (u + v) & 1 ? "z" : "Z"
}

scene("lineup", { w: LW, h: LH, bg: "e", frames: 1 }, (c) => {
  for (let y = 0; y < 126; y++) for (let x = 0; x < LW; x++) c.px(x, y, tileKey(x, y))
  for (let y = 128; y < LH; y++) for (let x = 0; x < LW; x++) c.px(x, y, y % 2 ? "a" : "b")
  const row = (y, label, items) => {
    c.text(3, y - 38, label, "w")
    items.forEach(([name, t, flip], i) => c.stamp(name, 18 + i * STEP, y, { t, ...(flip ? { flip: "x" } : {}) }))
  }
  row(39, "IDLE SE SW NE NW  TALK", [
    ["juno_idle_se", 0], ["juno_idle_se", 0, true], ["juno_idle_ne", 0], ["juno_idle_ne", 0, true],
    ["juno_talk_se", 200], ["juno_talk_ne", 200]])
  row(81, "WALK SE", [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ["juno_walk_se", i * 100]))
  row(123, "WALK NE", [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ["juno_walk_ne", i * 100]))
  c.text(3, 131, "FEED", "d")
  const feed = [["juno_feed", 0], ["juno_feed", 1400], ...[0, 1, 2, 3, 4, 5].map((i) => ["juno_feed_walk", i * 100])]
  feed.forEach(([name, t], i) => c.stamp(name, 18 + i * STEP, LH - 4, { t }))
})

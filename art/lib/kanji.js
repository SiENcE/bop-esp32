// The city's name in its two characters, 凪輪 (nagi, the dead calm at sea; wa, the ring), drawn by hand at 13x12 each with a gap
// of 2: on signs and screens the city is NAGI·WA, and now and then only these (style guide §8). Include it in any pxl art:
//
//   include("../lib/kanji.js")
//   KANJI.draw(c, x, y, "V")          // 28x12 from its top left; KANJI.draw(c, x, y, "V", 2) twice as large
//   KANJI.W, KANJI.H                  // its size at scale 1
const KANJI = {
  // 凪: the wind's frame (几) and stop (止) inside it
  NAGI: [
    "..########...",
    "..#......#...",
    "..#......#...",
    "..#...#..#...",
    "..#...#..#...",
    "..#...##.#...",
    "..#.#.#..#...",
    "..#.#.#..#...",
    "..#.#.#..#...",
    "..#.####.#...",
    ".#.......#..#",
    "#........###.",
  ],
  // 輪: the cart (車) beside the gathering under a roof (侖)
  WA: ["#####.", "..#...", "#####.", "#.#.#.", "#####.", "#.#.#.", "#####.", "..#...", "#####.", "..#...", "..#...", "..#..."].map((car, i) =>
    car + ["...#...", "..#.#..", ".#...#.", "#.....#", "..###..", ".......", ".#####.", ".#.#.#.", "#######", ".#.#.#.", ".#.#.#.", "#..#.##"][i]),
  W: 28, H: 12,
  /** @param {any} c a pxl canvas @param {number} x @param {number} y @param {string} key @param {number} [s] the scale */
  draw(c, x, y, key, s = 1) {
    const one = (rows, ox) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch === "#") c.rect(x + (ox + i) * s, y + j * s, s, s, key) }))
    one(KANJI.NAGI, 0); one(KANJI.WA, 15)
  },
}

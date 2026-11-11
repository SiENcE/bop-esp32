// Chapter 1: Sable (story §4: the fence on the Drain Market, nonbinary, charming, honest about being dishonest; a long magenta coat, a
// shaved head, a burning pipe; the speaker's colour #ff4fd3) as blocks for approval before being painted. Sable sits behind the desk in
// the booth (art/rooms/sable_booth.px.js), seen from the front: only the head, the shoulders and the forearms on the desk show over it, so
// those carry the figure; the rest is drawn for the silhouette. Seated about 40 px (an adult of 1.75 m at the back wall's 26 px a meter
// would stand 46). Every person carries a piece of tech that glows (style guide §8a); three ways to give Sable one:
//   A  a cyan lens implanted over the left eye, a thin ring round it
//   B  the coat's high collar lined with a strip of LEDs, cyan, running
//   C  a line of small lights under the skin from the temple over the shaved skull, a circuit, pale cyan
//   sable_blocks        the sheet: Juno's 50 px bar, A, B, C, and A with the desk's top edge where it cuts the figure (row 22)
//   sable_blocks_a/b/c  each pose alone, 21x40, pivot bottom (the feet on the floor behind the desk)
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a",
  n: "#3e1240", M: "#a8238a", m: "#ff4fd3", N: "#ffc0f2",                       // the coat
  s: "#6e4232", S: "#a8705a", T: "#c89078",                                      // skin, the shaved head's light
  O: "#552b1c", P: "#b0602a", Q: "#eea040", R: "#ffd58a", h: "#7d8ca4",          // the pipe, its ember, the smoke
  c: "#123c4e", v: "#62def0", V: "#dafcff", y: "#eec414",
})

const SW = 21, SH = 40
/** Sable seated, from the front; o.tech "A" | "B" | "C" */
const sable = (c, o) => {
  const g = (x, y, rows) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== ".") c.px(x + i, y + j, ch) }))
  // below the desk: the coat's skirts over the knees, the legs, the boots
  c.rect(3, 22, 15, 9, "M"); c.rect(3, 22, 2, 9, "n"); c.rect(16, 22, 2, 9, "n"); c.rect(10, 22, 1, 9, "n")
  c.rect(5, 31, 4, 7, "2"); c.rect(12, 31, 4, 7, "2"); c.rect(4, 38, 5, 2, "1"); c.rect(12, 38, 5, 2, "1")
  // the coat: shoulders, the open front with the dark shirt, the lapels catching the light
  g(1, 10, [
    "....nMMM.MMMn....",
    "..nMMmMM.MMmMMn..",
    ".nMMmMMM1MMMmMMn.",
    "nMMmMMMM1MMMMmMMn",
    "nMMmMMMm1mMMMmMMn",
    "nMMMMMMm1mMMMMMMn",
    "nMMMMMMm1mMMMMMMn",
    "nMMMMMMm1mMMMMMMn",
    "nMMMMMMM1MMMMMMMn",
    "nMMMMMMM1MMMMMMMn",
    "nMMMMMMM1MMMMMMMn",
    "nMMMMMMMMMMMMMMMn",
  ])
  // the high collar round the neck
  g(6, 8, ["nM...Mn", "nMM.MMn"])
  // the forearms on the desk, coming toward us, the hands folded in front
  g(3, 18, [".MM.........MM.", "MMMM.......MMMM", "MMMMSSsSSsSMMMM", ".MMSSSSSSSSSMM."])
  // the head: shaved, the light from above on the skull, eyes half shut, the pipe in the right corner of the mouth
  g(6, 0, [
    "..TTTTT..",
    ".TTSSSTT.",
    "SSSSSSSSS",
    "SSSSSSSSS",
    "SSkSSSkSs",
    "SSSSSSSSs",
    ".SSSsSSs.",
    "..SskSs..",
    "...sss...",
  ])
  c.rect(9, 9, 3, 1, "s")
  // the pipe: the stem from the mouth to the bowl beside the chin, the ember in it
  c.px(12, 7, "O"); c.px(13, 7, "O"); c.rect(14, 5, 3, 4, "O"); c.px(14, 5, "P"); c.rect(15, 5, 1, 1, "Q"); c.px(16, 4, "h"); c.px(17, 2, "h")
  // the tech
  if (o.tech === "A") { c.px(7, 4, "v"); c.px(6, 4, "c"); c.px(8, 4, "c"); c.px(7, 3, "c"); c.px(7, 5, "c") }
  if (o.tech === "B") for (const [x, y] of [[6, 8], [7, 9], [12, 8], [11, 9], [6, 9], [12, 9]]) c.px(x, y, (x + y) % 2 ? "v" : "c")
  if (o.tech === "C") for (const [x, y] of [[13, 4], [14, 3], [14, 2], [13, 1], [12, 0], [10, 0]]) c.px(x, y, (x + y) % 3 ? "v" : "V")
}

for (const t of ["a", "b", "c"]) sprite(`sable_blocks_${t}`, { w: SW, h: SH, outline: "k", pivot: "bottom" }, (c) => sable(c, { tech: t.toUpperCase() }))

scene("sable_blocks", { w: 132, h: 60, bg: "3" }, (c) => {
  c.rect(4, 6, 2, 50, "y")                                       // Juno, 50 px
  c.hline(0, 56, 132, "1")
  for (const [i, t] of [["0", "a"], ["1", "b"], ["2", "c"], ["3", "a"]].map(([i, t]) => [Number(i), t])) {
    c.stamp(`sable_blocks_${t}`, 24 + i * 29, 56)
    if (i === 3) { c.rect(10 + i * 29, 38, 29, 18, "4"); c.hline(10 + i * 29, 38, 29, "5") }   // the desk's top edge at row 22
  }
})

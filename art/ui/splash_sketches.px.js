// Three block sketches for the title screen (not game art): which composition is iconic? Flat shapes only,
// the title block where it would go. Pick one, then it gets painted.
//   sketch_glass    1 "Through the Glass": Juno's face large behind a rain-wet pane, her implant glowing
//   sketch_siblings 2 "Awake and asleep": Juno awake (yellow) and Teo asleep (Lull light), a crack between
//   sketch_watcher  3 "The watcher": Juno small from behind before a huge wall of feeds, the eye in its middle
include("letters.px.js")

pal({
  k: "#0c0e1a", n: "#06080f", N: "#0a0e18", g: "#141a26", G: "#232f47", h: "#41547a",
  V: "#dafcff", v: "#62def0", c: "#1f88a4", C: "#123c4e", m: "#ff4fd3", M: "#a8238a", q: "#ff3a3a",
  y: "#fff070", Y: "#eec414", j: "#9a7406", s: "#d79676", S: "#93583f", t: "#2a2015",
  b: "#c8e8ff", B: "#7aa8d8", w: "#ffc0f2", o: "#ffb070",
})

{
  const W = 320, H = 180
  const sketch = (name, draw) => sprite(name, { w: W, h: H }, (c) => {
    const B = new Array(W * H).fill("n")
    const put = (x, y, k) => { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < W && y < H) B[y * W + x] = k }
    const rect = (x, y, w, h, k) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(x + i, y + j, k) }
    const ell = (cx, cy, rx, ry, k) => { for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1) put(cx + x, cy + y, k) }
    for (let y = 0; y < H; y++) if (y % 4 === 3) for (let x = 0; x < W; x++) put(x, y, "N")
    draw({ put, rect, ell, B })
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, B[y * W + x])
  })
  const TB = titleBlock()

  // 1: a face behind wet glass; the pane's frame, rain running down it, the eye reflected faintly
  sketch("sketch_glass", ({ put, rect, ell }) => {
    ell(110, 104, 66, 80, "j"); ell(110, 100, 60, 74, "Y")                 // the hood
    ell(112, 108, 40, 50, "S"); ell(116, 110, 36, 46, "s")                // the face
    rect(92, 98, 12, 4, "k"); rect(124, 98, 12, 4, "k")                   // eyes
    for (let i = 0; i < 26; i++) put(132 + i, 116 + Math.floor(i / 3), "v")   // the implant line on the cheek
    for (let i = 0; i < 26; i++) put(132 + i, 117 + Math.floor(i / 3), "c")
    for (let x = -30; x <= 30; x++) { const l = Math.round(14 * Math.sqrt(1 - (x / 31) ** 2)); put(230 + x, 60 - l, "w"); put(230 + x, 60 + l, "w") }  // the eye in the glass
    ell(230, 60, 7, 7, "w")
    for (let i = 0; i < 70; i++) { const x = (i * 53) % 320, y0 = (i * 37) % 160; for (let j = 0; j < 8; j++) put(x, y0 + j, j < 2 ? "V" : "h") }   // rain on the pane
    rect(0, 0, 320, 4, "g"); rect(0, 176, 320, 4, "g"); rect(196, 0, 4, 180, "g")   // the window's frame
  })

  // 2: two faces turned to each other, a crack of glass between: awake and asleep
  sketch("sketch_siblings", ({ put, rect, ell, B }) => {
    for (let y = 0; y < 120; y++) for (let x = 0; x < 160; x++) if (y % 4 !== 3) put(x, y, "t")
    for (let y = 0; y < 120; y++) for (let x = 160; x < 320; x++) if (y % 4 !== 3) put(x, y, "C")
    ell(96, 74, 40, 50, "Y"); ell(100, 78, 26, 34, "s")                   // Juno, hood up, facing right
    rect(108, 70, 8, 3, "k"); for (let i = 0; i < 14; i++) put(110 + i, 86 + Math.floor(i / 3), "v")
    ell(226, 78, 26, 34, "B"); ell(230, 60, 26, 16, "G")                  // Teo, facing left, eyes shut
    rect(206, 72, 8, 1, "k"); ell(250, 70, 3, 3, "b")                     // the Lull patch, glowing
    for (let y = 0; y < 120; y++) put(160 + Math.round(4 * Math.sin(y / 7)), y, "V")   // the crack
    for (let y = 0; y < 120; y++) put(161 + Math.round(4 * Math.sin(y / 7)), y, "k")
  })

  // 3: the wall of feeds, Juno small from behind
  sketch("sketch_watcher", ({ put, rect, ell }) => {
    for (let r = 0; r < 4; r++) for (let col = 0; col < 8; col++) {
      const x = 16 + col * 37, y = 6 + r * 27
      rect(x, y, 34, 24, "g"); rect(x + 1, y + 1, 32, 22, (r + col) % 3 ? "C" : "G")
      ell(x + 17, y + 14, 4, 5, (r * 5 + col) % 4 ? "c" : "h")
    }
    rect(127, 33, 70, 51, "k"); rect(128, 34, 68, 49, "g")               // the big middle feed: the eye
    for (let x = -28; x <= 28; x++) { const l = Math.round(13 * Math.sqrt(1 - (x / 29) ** 2)); put(162 + x, 58 - l, "w"); put(162 + x, 58 + l, "w") }
    ell(162, 58, 6, 6, "w")
    ell(162, 150, 14, 18, "Y"); rect(146, 150, 33, 30, "Y"); ell(162, 140, 9, 9, "j")   // Juno from behind, hood up
  })
}

// the title block where it would go, as a separate overlay for the shots
{
  const TB = titleBlock()
  sprite("sketch_title", { w: TB.w + 2, h: TB.h + 2 }, (c) => {
    const B = new Array((TB.w + 2) * (TB.h + 2)).fill(null)
    TB.draw((x, y, k) => { if (x >= 0 && y >= 0 && x < TB.w + 2 && y < TB.h + 2) B[y * (TB.w + 2) + x] = k }, 1, 1)
    for (let y = 0; y < TB.h + 2; y++) for (let x = 0; x < TB.w + 2; x++) if (B[y * (TB.w + 2) + x]) c.px(x, y, B[y * (TB.w + 2) + x])
  })
  scene("sketches", { w: 330 * 3, h: 180, bg: "k" },
    stamp("sketch_glass", 0, 0), stamp("sketch_title", 210 - 105, 132),
    stamp("sketch_siblings", 330, 0), stamp("sketch_title", 330 + 55, 128),
    stamp("sketch_watcher", 660, 0), stamp("sketch_title", 660 + 55, 4))
}

// The title screen (style guide §8a "Title screen"), shown before the menu screen (game/title.js,
// title.splash): the people the story is about, seen the way Juno sees people: through the Glass.
//   - a wall of camera feeds: Juno large on the left; beside her a 2x2 grid of smaller feeds, EVI, Teo,
//     Sable, and a fourth that shows only static with an eye in it (the Witness, a hint). Each feed is
//     dark with scan rows, its person glowing in their speaker colour like phosphor, the implant's
//     brackets round the face, a small label (J.REYES, EVI.SYS, T.REYES, SABLE, CAM ??), the frames' cut
//     corners. STAGE 1: the people are silhouettes with each one's mark (EVI's antenna ears, Juno's hood,
//     Teo's ear defenders, Sable's bald head and pipe); the portraits come next.
//   - under it the title block (art/ui/letters.px.js, the same on the menu screen): GLASS SISTER as
//     outline letters tagged by the implant's brackets, a camera readout under it
//   - a night-dark ground; the rain over it all is the room's (fx), the prompt the engine's
//
//   splash_bg   320x180, an animation: the static moves; now and then a short glitch (the title splits
//               into magenta and cyan, a feed's rows slip), about 5 s a loop
include("letters.px.js")

pal({
  k: "#0c0e1a", n: "#06080f", N: "#0a0e18",
  V: "#dafcff", v: "#62def0", m: "#ff4fd3", q: "#ff3a3a",
  a: "#0d2420", A: "#0a1c19", b: "#8ef5d8", B: "#4fb8a2",          // EVI: ground, scan row, figure, its shade
  j: "#26220c", J: "#1e1a09", d: "#fff070", D: "#b8aa3a",          // Juno
  o: "#28180c", O: "#20130a", e: "#ffb070", E: "#b87a48",          // Teo
  s: "#1c1230", S: "#160e26", f: "#c890ff", F: "#8a5cc0",          // Sable
  r: "#ff7a3a",                                                    // the pipe's ember
  1: "#141a26", 2: "#2a3244", 3: "#4a566e", 4: "#7a88a0",          // static
  w: "#ffc0f2",                                                    // the eye in it
})

{
  const W = 320, H = 180, CUT = 5
  const hash = (x, y, s = 0) => { let h = (x * 374761393 + y * 668265263 + s * 1442695041) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
  const TILES = [
    { x: 42, y: 8, w: 92, h: 100, who: "juno", bg: "j", scan: "J", fig: "d", mid: "D", label: "J.REYES" },
    { x: 138, y: 8, w: 68, h: 48, who: "evi", bg: "a", scan: "A", fig: "b", mid: "B", label: "EVI.SYS" },
    { x: 210, y: 8, w: 68, h: 48, who: "teo", bg: "o", scan: "O", fig: "e", mid: "E", label: "T.REYES" },
    { x: 138, y: 60, w: 68, h: 48, who: "sable", bg: "s", scan: "S", fig: "f", mid: "F", label: "SABLE" },
    { x: 210, y: 60, w: 68, h: 48, who: "static", label: "CAM ??" },
  ]
  const TB = titleBlock(), TBX = Math.round((W - TB.w) / 2), TBY = 117

  /** a silhouette (stage 1), drawn on a 47x92 design, scaled uniformly to the feed and centred; returns the face's box */
  function silhouette(t, put) {
    const sc = (t.h / 92) * (t.h > 60 ? 1 : 1.25), ox = t.w / 2 - 23 * sc, oy = t.h - 92 * sc
    const X = (x) => Math.round(ox + x * sc), Y = (y) => Math.round(oy + y * sc)
    const ell = (cx, cy, rx, ry, k) => {
      const RX = rx * sc, RY = ry * sc
      for (let y = -Math.ceil(RY); y <= RY; y++) for (let x = -Math.ceil(RX); x <= RX; x++) if ((x * x) / (RX * RX) + (y * y) / (RY * RY) <= 1) put(X(cx) + x, Y(cy) + y, k)
    }
    const trap = (y0, y1, w0, w1, k) => {
      for (let y = Y(y0); y <= Y(y1); y++) { const u = (y - Y(y0)) / Math.max(1, Y(y1) - Y(y0)), w = Math.round((w0 + (w1 - w0) * u) * sc); for (let x = -w; x <= w; x++) put(X(23) + x, y, k) }
    }
    if (t.who === "evi") {
      ell(23, 60, 15, 14, t.mid); ell(23, 60, 13, 12, t.fig)
      for (let i = 0; i < Math.round(10 * sc); i++) { put(X(13) - Math.floor(i / 2), Y(46) - i, t.fig); put(X(33) + Math.floor(i / 2), Y(46) - i, t.fig) }
      ell(17, 58, 3, 4, t.bg); ell(29, 58, 3, 4, t.bg)
      trap(78, 92, 10, 13, t.mid)
      return [X(8), Y(44), X(38) - X(8), Y(75) - Y(44)]
    }
    trap(66, 92, 12, 21, t.mid); trap(58, 66, 4, 6, t.mid)
    if (t.who === "juno") { ell(23, 46, 11, 13, t.fig); trap(30, 46, 2, 12, t.fig); ell(24, 50, 7, 9, t.mid); trap(60, 70, 13, 19, t.fig) }
    else if (t.who === "teo") { ell(23, 46, 9, 11, t.fig); ell(23, 64, 12, 4, t.fig); ell(23, 64, 9, 2, t.mid) }
    else {
      ell(23, 45, 9, 11, t.fig); trap(62, 74, 9, 20, t.fig)
      for (let i = 0; i < Math.round(8 * sc); i++) put(X(31) + i, Y(51) + Math.floor(i / 3), t.mid)
      put(X(31) + Math.round(8 * sc), Y(53), "r")
    }
    return [X(11), Y(32), X(36) - X(11), Y(60) - Y(32)]
  }

  function paint(c, o = {}) {
    const B = new Array(W * H).fill(null)
    const put = (x, y, k) => { if (x >= 0 && y >= 0 && x < W && y < H) B[y * W + x] = k }
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) put(x, y, y % 4 === 3 ? "N" : "n")
    for (const t of TILES) {
      const inside = (x, y) => x >= 0 && y >= 0 && x < t.w && y < t.h && x + y >= CUT && (t.w - 1 - x) + (t.h - 1 - y) >= CUT
      const lp = (x, y, k) => { if (inside(x, y)) put(t.x + x, t.y + y, k) }
      if (t.who === "static") {                           // static, and an eye in it, half there
        for (let y = 0; y < t.h; y++) for (let x = 0; x < t.w; x++) {
          const r = hash(x, y, o.seed ?? 0)
          lp(x, y, y % 2 ? "1" : r < 0.5 ? "1" : r < 0.8 ? "2" : r < 0.95 ? "3" : "4")
        }
        const cx = t.w / 2, cy = t.h / 2 + 2
        for (let x = -16; x <= 16; x++) {
          const lid = Math.round(8 * Math.sqrt(1 - (x / 16.5) ** 2))
          for (const y of [cy - lid, cy + lid]) if (hash(x, y, (o.seed ?? 0) + 7) < 0.7) lp(Math.round(cx + x), Math.round(y), "w")
        }
        for (let y = -5; y <= 5; y++) for (let x = -5; x <= 5; x++) {
          const d = Math.hypot(x, y)
          if (d <= 5 && d > 3.6 && hash(x, y, (o.seed ?? 0) + 3) < 0.75) lp(Math.round(cx + x), Math.round(cy + y), "w")
          if (d <= 1.6) lp(Math.round(cx + x), Math.round(cy + y), "w")
        }
      } else {
        for (let y = 0; y < t.h; y++) for (let x = 0; x < t.w; x++) lp(x, y, y % 2 ? t.scan : t.bg)
        const [fx, fy, fw, fh] = silhouette(t, lp)
        const arm = t.h > 60 ? 5 : 3                        // the implant tags the face
        for (let i = 0; i < arm; i++) {
          lp(fx + i, fy, "v"); lp(fx, fy + i, "v"); lp(fx + fw - i, fy, "v"); lp(fx + fw, fy + i, "v")
          lp(fx + i, fy + fh, "v"); lp(fx, fy + fh - i, "v"); lp(fx + fw - i, fy + fh, "v"); lp(fx + fw, fy + fh - i, "v")
        }
      }
      hudText((x, y, k) => lp(x, y, k), 5, 3, t.label, t.who === "static" ? "V" : t.fig)
      if (t.who === "juno") for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) lp(t.w - 8 + i, 4 + j, "q")   // she is live
      for (let y = -1; y <= t.h; y++) for (let x = -1; x <= t.w; x++) {
        if (inside(x, y)) continue
        if (inside(x - 1, y) || inside(x + 1, y) || inside(x, y - 1) || inside(x, y + 1)) put(t.x + x, t.y + y, "k")
      }
    }
    for (const [i, row, rows, dx] of o.slips ?? []) {      // a feed's rows slipping sideways
      const t = TILES[i]
      for (let y = t.y + row; y < t.y + row + rows; y++) {
        const line = B.slice(y * W + t.x - 3, y * W + t.x + t.w + 3)
        for (let x = 0; x < line.length; x++) B[y * W + t.x - 3 + x] = line[x - dx] ?? "n"
      }
    }
    TB.draw(put, TBX, TBY, o)
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, B[y * W + x])
  }

  const FRAMES = [[700, { seed: 1 }], [700, { seed: 2 }], [700, { seed: 3 }], [70, { seed: 4, split: 2 }], [60, { seed: 5, slips: [[0, 40, 6, 4]], split: 1 }],
    [700, { seed: 6 }], [700, { seed: 7 }], [50, { seed: 8, slips: [[2, 20, 5, -3]] }], [700, { seed: 9 }]]
  anim("splash_bg", { w: W, h: H, frames: FRAMES.length, ms: FRAMES.map(([ms]) => ms) }, (c) => paint(c, FRAMES[c.frame][1]))
}

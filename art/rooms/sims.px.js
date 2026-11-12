// The ledge outside Juno's window, painted (kapitel1-design "Der Sims im Bild"; the user chose the stage A of
// docs/rooms/sims_blocks_vergleich_x3.png on 2026-11-12, with the neon letters A2 between the window and the ladder,
// art/mockups/sims_blocks.px.js). The facade seen straight on from the air over Kowalski Street, 30 px to the metre both ways;
// game/places.js (sims) takes its walk line, spots and hotspots from the measures here (the constants below).
//
//   sims_bg      320x180, the still picture with every part's frame 0 painted in. Left to right along the ledge: a delivery drone
//                caught in the cables, its parcel hanging under it (a small quest later, kapitel1-design); Juno's window, the lower
//                sash pushed up, the flat dim behind it (the deck's cyan, the lamp's amber); the block's name in neon on a steel frame
//                over her head, KESSEL, both E dead, the transformer under it; the AC box dripping on the ledge; the fire ladder, its
//                drop section folded up 4.1 m over the ledge (her hands reach 2.1 m); J+T scratched beside it, Juno and Teo long ago.
//                The wall goes on past the picture's edge, and in its last strip a garden someone looks after: a cactus in flower, herbs
//                in a fruit crate, ivy from a hanging can, a bean up a string, a blue drum under the broken downpipe. Under the ledge the drop: the
//                13th floor's window heads, and the light of Kowalski Street and LUCKY STATIC coming up from 42 m below.
//   sims_<part>  small anims, each opaque over its own rect (the background's pixels with the moving thing on them), laid over the
//                background under everyone (the PARTS line; tools/build_art.sh writes game/rooms/sims.parts.js): the neon (an L that
//                stutters, a dead E that tries once), the drone's light, the transformer's lamp, the AC's drip, the water from the pipe.
// How: every frame is painted into a buffer of palette keys, the whole picture each time, so a part cut out of it always matches the
// background. Light is value: the facade's concrete takes the neon's magenta, the window's light or the street's glow where they
// reach it, dithered only where the light falls off (style guide §4).
include("../lib/iso.js", { palette: true })
include("../lib/text.js")
pal({
  d: "#64265e",                                   // concrete in the neon's full light
  o: "#5a3c24", p: "#8a6238", K: "#c8b48c",       // the parcel's cardboard, its tape and label
  l: "#1d3a2c", L: "#36633e", F: "#6a9a4c",       // leaves (the rain garden)
  b: "#1c3866", B: "#3464a8",                     // blue plastic (the rain drum)
})

const SIMS = (() => {
  const W = 320, H = 180, R = Math.round, fl = Math.floor, clamp = (v, a, b) => Math.max(a, Math.min(b, v))
  const BAY = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]], dz = (x, y) => (BAY[y & 3][x & 3] + 0.5) / 16
  const hash = (a, b, s = 0) => { let h = (a * 374761393 + b * 668265263 + s * 2147483647) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
  const tone = (ramp, v, x, y) => ramp[clamp(fl(clamp(v, 0, 1) * (ramp.length - 1) + dz(x, y)), 0, ramp.length - 1)]

  // ---------------------------------------------------------------- the measures (game/places.js reads them as numbers)
  const L = 150, BACK = 146                                               // the ledge's front edge, its back (the wall's foot)
  const WIN = { x0: 38, x1: 82, y0: 76, y1: 127 }                         // the window's frame: 1.3 m wide, 0.9 to 2.4 m over the ledge
  const SIGN = { x0: 98, y0: 28, w: 24, letters: "KESSEL", dead: [1, 4], top: 32, bottom: 76, rail: [26, 80] }
  const TRAFO = { x: 182, y: 90, w: 15, h: 17 }
  const AC = { x: 210, y: 104, w: 26, h: 17 }
  const LAD = { x: 258, w: 18, low: L - 123, down: L - 30 }               // its lowest rung 4.1 m up; pulled down, 1 m up
  const JT = { x: 279, y: 106 }                                           // J+T, at Juno's height at fourteen
  const DRONE = { x: 6, y: 56 }

  // ---------------------------------------------------------------- the light
  const NEON = [170, 52]
  const neon = (x, y) => Math.max(0, 1 - Math.hypot((x - NEON[0]) / 150, (y - NEON[1]) / 92))
  const winLight = (x, y) => Math.max(0, 1 - Math.hypot((x - 60) / 34, (y - 112) / 26))
  const below = (y) => clamp((y - 150) / 34, 0, 1)
  const NIGHT = ["1", "2", "3", "4", "5"], MAG = ["2", "i", "I", "d"], WARM = ["2", "a", "A", "O"]

  // ---------------------------------------------------------------- one frame into the buffer
  const KB = new Array(W * H)
  const px = (x, y, k) => { x = R(x); y = R(y); if (x >= 0 && y >= 0 && x < W && y < H && k) KB[y * W + x] = k }
  const rect = (x, y, w, h, k) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) px(x + i, y + j, k) }
  const hline = (x, y, w, k) => rect(x, y, w, 1, k), vline = (x, y, h, k) => rect(x, y, 1, h, k)
  const line = (x0, y0, x1, y1, k, brush = 0) => {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1)
    for (let i = 0; i <= n; i++) { const x = R(x0 + (x1 - x0) * i / n), y = R(y0 + (y1 - y0) * i / n); for (let a = -brush; a <= brush; a++) for (let b = -brush; b <= brush; b++) px(x + a, y + b, k) }
  }
  const grid = (x, y, rows, map = {}) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== ".") px(x + i, y + j, map[ch] ?? ch) }))

  // the cables along the wall: clipped every so often, sagging between, one of them pulled down by the drone
  const cableY = (x, base, span, sag) => base + sag * Math.sin((((x % span) + span) % span) / span * Math.PI)
  const CABLE1 = (x) => x < 44 ? 62 + 12 * Math.sin(clamp(x + 6, 0, 50) / 50 * Math.PI) * (x < 20 ? (x + 6) / 26 : 1) : cableY(x - 44, 62, 62, 4)
  const CABLE2 = (x) => cableY(x + 20, 67, 54, 3)

  // ---------------------------------------------------------------- the garden in the wall's last strip (the user's choice of 2026-11-12,
  // the rain garden of three, docs/rooms/sims_ecke_vergleich_x3.png, with a cactus): someone looks after it; who is still open
  function garden(F) {
    const pX = 313, dx = 305, dw = 15, dt = 124, foot = BACK + 2
    // the downpipe, broken off; what it gives goes into a drum
    for (let y = 0; y < 92; y++) { px(pX - 1, y, "k"); px(pX, y, "6"); px(pX + 1, y, "5"); px(pX + 2, y, "4"); px(pX + 3, y, "3"); px(pX + 4, y, "k") }
    for (const y of [18, 50, 82]) { rect(pX - 1, y, 6, 2, "3"); px(pX - 1, y, "k") }
    px(pX, 92, "5"); px(pX + 1, 93, "4"); px(pX + 2, 92, "k"); px(pX + 3, 91, "k")
    rect(pX + 4, 104, 3, 2, "3"); px(pX + 6, 104, "k")                                                                    // the clip the lower length left
    for (let y = 93; y < dt; y++) { const s = ((y - F * 3) % 6 + 6) % 6; px(pX + 1, y, s < 3 ? "V" : "H"); px(pX + 2, y, s === 4 ? "H" : "h") }
    for (let y = dt; y < foot; y++) for (let x = dx; x < dx + dw; x++) {
      const i = x - dx
      px(x, y, i === 0 || i === dw - 1 ? "k" : i < 4 ? "B" : i > dw - 4 ? "u" : "b")
    }
    for (const y of [dt + 7, dt + 16]) { hline(dx + 1, y, dw - 2, "u"); hline(dx + 1, y - 1, dw - 2, "B") }
    hline(dx, dt, dw, "B"); hline(dx + 1, dt + 1, dw - 2, "c"); for (let x = dx + 2; x < dx + dw - 2; x += 3) px(x + (F >> 2) % 3, dt + 1, "T")
    for (const s of [-1, 1]) px(pX + 1 + s * (1 + (F % 3 === 0 ? 1 : 0)), dt - 1, "H")                                     // the splash
    for (let y = dt + 2; y < BACK; y++) if (((y - F * 2) % 6 + 6) % 6 < 2) px(dx + 3, y, "T")                              // it runs over
    // a fruit crate for a bed, the soil in it, herbs in rows, a label stick
    const cx = 289, cw = 14, ct = 138
    rect(cx, ct, cw, foot - ct, "k"); for (let y = ct + 1; y < foot; y++) hline(cx + 1, y, cw - 2, (y - ct) % 4 === 0 ? "O" : "P")
    vline(cx + 1, ct + 1, foot - ct - 1, "O"); vline(cx + cw - 2, ct + 1, foot - ct - 1, "O"); hline(cx + 1, ct + 1, cw - 2, "a")
    for (const [bx, r] of [[cx + 3, 6], [cx + 7, 8], [cx + 11, 6]]) for (let j = -r - 2; j <= 0; j++) for (let i = -3; i <= 3; i++) {
      const q = Math.hypot(i / 3.2, (j + r / 2) / (r * 0.8)); if (q > 1 || hash(bx + i, j, 6) < 0.2 + q * 0.4) continue
      px(bx + i, ct + j, hash(bx + i, j, 7) > 0.72 ? "F" : hash(bx + i, j, 8) > 0.35 ? "L" : "l")
    }
    vline(cx + 12, ct - 4, 4, "K"); px(cx + 12, ct - 4, "H")
    // the cactus in a clay pot: a column, two arms, its spines, one pale flower on top
    const kx = 281, kt = 141
    rect(kx, kt, 7, foot - kt, "O"); hline(kx - 1, kt, 9, "P"); hline(kx - 1, kt + 1, 9, "O"); vline(kx + 1, kt + 2, foot - kt - 2, "P")
    const col = (x0, y0, y1) => { for (let y = y0; y < y1; y++) { px(x0, y, "L"); px(x0 + 1, y, "F"); px(x0 + 2, y, "L"); px(x0 + 3, y, "l"); if ((y - y0) % 3 === 1) { px(x0 - 1, y, "H"); px(x0 + 4, y + 1, "h") } } px(x0 + 1, y0 - 1, "L"); px(x0 + 2, y0 - 1, "l") }
    col(kx + 2, 120, kt)
    rect(kx - 1, 131, 3, 2, "L"); col(kx - 2, 125, 131)                                                                    // the left arm
    rect(kx + 6, 134, 3, 2, "l"); col(kx + 7, 129, 134)                                                                    // the right arm
    grid(kx + 2, 116, [".NN.", "NmmN", ".NN."])
    // a can hanging from a hook in the wall, ivy trailing from it
    const hx = 297, hy = 98
    px(hx + 2, hy - 6, "k"); line(hx + 2, hy - 5, hx, hy, "3"); line(hx + 2, hy - 5, hx + 5, hy, "3")
    rect(hx, hy, 6, 5, "g"); vline(hx, hy, 5, "G"); hline(hx, hy, 6, "k")
    for (const [sx, len] of [[hx, 16], [hx + 3, 11], [hx + 5, 19]]) for (let j = 0; j < len; j++) {
      const x = sx + R(Math.sin((j + sx) * 0.55)); px(x, hy + 2 + j, j % 3 === 0 ? "F" : "L"); if (j % 4 === 1) px(x + (j % 8 < 4 ? 1 : -1), hy + 2 + j, "l")
    }
    // a string from the crate up to the pipe's lowest clip, a bean climbing it
    line(cx + 6, ct - 3, pX - 1, 83, "K")
    for (let t = 0.08; t < 1; t += 0.07) {
      const x = R(cx + 6 + (pX - 1 - cx - 6) * t), y = R(ct - 3 + (83 - ct + 3) * t), side = R(t * 14) % 2 ? 1 : -1
      px(x + side, y, "L"); px(x + side * 2, y, t < 0.8 ? "F" : "L"); px(x + side, y + 1, "l")
    }
  }

  function paint(F, down = false) {
    KB.fill("1")
    // ---- the facade: concrete panels, the slab band of the storey above, stains where the water runs
    for (let y = 0; y < BACK; y++) for (let x = 0; x < W; x++) {
      let v = 0.42
      const joint = (x - 14) % 48 === 0 && !(x >= WIN.x0 && x < WIN.x1 && y >= WIN.y0 && y < WIN.y1)
      if (joint) v -= 0.3; else if ((x - 15) % 48 === 0) v += 0.08                                  // a joint, its lit lip
      if (y >= 57 && y < 61) v += y === 57 ? 0.3 : 0.12                                               // the slab band
      if (y === 61) v -= 0.25
      // where water runs from the band and the ladder's bolts: streaks, darker, on and off down the wall
      const streak = hash(x, 0, 7) > 0.86 && y > 61 && hash(x, fl(y / 9), 8) > 0.35
      if (streak) v -= 0.12
      if (y > BACK - 10) v -= (y - BACK + 10) * 0.018                                                // the splash zone over the ledge
      const n = neon(x, y), w = winLight(x, y)
      let k
      if (n * 1.7 > dz(x, y) + 0.15) k = tone(MAG, v * 0.4 + n * 0.85, x, y)
      else if (w > dz(x, y) + 0.2) k = tone(WARM, v * 0.5 + w * 0.5, x, y)
      else k = tone(NIGHT, v * 0.62, x, y)
      px(x, y, k)
    }

    // ---- the cables (behind everything bolted on); their clips
    for (let x = 0; x < W; x++) { px(x, CABLE1(x), "k"); px(x, CABLE2(x), "k"); if (x > 44 && (x - 44) % 62 === 0) rect(x - 1, 61, 3, 2, "4") }

    // ---- Juno's window: the frame, the upper sash with the lower one pushed up behind it, the flat dim behind the opening
    rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0, "k")
    rect(WIN.x0 + 1, WIN.y0 + 1, WIN.x1 - WIN.x0 - 2, WIN.y1 - WIN.y0 - 2, "4")
    hline(WIN.x0 + 1, WIN.y0 + 1, WIN.x1 - WIN.x0 - 2, "5"); vline(WIN.x0 + 1, WIN.y0 + 1, WIN.y1 - WIN.y0 - 2, "5")
    const IN = { x0: WIN.x0 + 3, x1: WIN.x1 - 3, y0: WIN.y0 + 3, y1: WIN.y1 - 6 }
    for (let y = IN.y0; y < IN.y1; y++) for (let x = IN.x0; x < IN.x1; x++) {
      if (y < 100) {                                                                                 // the sashes' glass, two layers: the neon in it
        const refl = Math.abs((x - IN.x0) - (y - IN.y0) * 0.7 - 6) < 3 || Math.abs((x - IN.x0) - (y - IN.y0) * 0.7 - 20) < 1.5
        px(x, y, refl ? (y < 88 ? "I" : "i") : tone(["k", "1", "2"], 0.3 + (y - IN.y0) / 40, x, y))
      } else {                                                                                       // open: the room, the deck's glow on the left, the lamp on the right
        const cy = Math.max(0, 1 - Math.hypot((x - IN.x0 - 5) / 18, (y - 114) / 12)), am = Math.max(0, 1 - Math.hypot((x - IN.x1 + 8) / 10, (y - 108) / 8))
        px(x, y, am > 0.25 + dz(x, y) * 0.3 ? "a" : cy > 0.5 ? "c" : cy > 0.3 + dz(x, y) * 0.15 ? "t" : y > 117 ? "1" : "k")
      }
    }
    for (let y = IN.y0; y < 100; y++) { px(IN.x0, y, "3"); px(IN.x1 - 1, y, "3") }
    rect(IN.x0, 98, IN.x1 - IN.x0, 3, "4"); hline(IN.x0, 98, IN.x1 - IN.x0, "5"); hline(IN.x0, 100, IN.x1 - IN.x0, "k")   // the sashes' bottom rails
    grid(IN.x1 - 12, 101, ["...PPP...", "..PPPPP..", ".PPPPPPP.", "QQQQQQQQQ", "...RWR..."])                   // the lamp's shade, inside, its bulb
    rect(IN.x0 + 1, 112, 7, 4, "C"); hline(IN.x0 + 1, 112, 7, "v")                                   // the deck's screen, far in
    for (let y = 101; y < IN.y1; y++) px(IN.x0 + 1 + (y % 3 === 0 ? 1 : 0), y, "u")                  // the curtain's edge
    // the sill outside: concrete, a step out, its drip
    rect(WIN.x0 - 2, WIN.y1 - 4, WIN.x1 - WIN.x0 + 4, 2, "5"); rect(WIN.x0 - 2, WIN.y1 - 2, WIN.x1 - WIN.x0 + 4, 2, "3"); hline(WIN.x0 - 2, WIN.y1, WIN.x1 - WIN.x0 + 4, "k")

    // ---- KESSEL: channel letters on a steel frame over Juno's head, both E dead
    const [rT, rB] = SIGN.rail, sx1 = SIGN.x0 + SIGN.letters.length * SIGN.w
    for (const fx of [SIGN.x0 + 2, SIGN.x0 + 72, sx1 - 4]) { rect(fx, rT - 4, 2, rB - rT + 10, "2"); px(fx, rT - 4, "4"); rect(fx - 1, rB + 4, 4, 2, "k") }   // struts to the wall
    rect(SIGN.x0 - 2, rT, sx1 - SIGN.x0 + 4, 2, "4"); hline(SIGN.x0 - 2, rT, sx1 - SIGN.x0 + 4, "5")
    rect(SIGN.x0 - 2, rB, sx1 - SIGN.x0 + 4, 2, "3"); hline(SIGN.x0 - 2, rB + 2, sx1 - SIGN.x0 + 4, "k")
    // the conduit from the transformer up to the frame
    vline(TRAFO.x + 7, rB + 2, TRAFO.y - rB - 2, "k"); vline(TRAFO.x + 8, rB + 2, TRAFO.y - rB - 2, "3")
    const STROKES = {
      K: [[[0, 0], [0, 38]], [[1, 21], [14, 0]], [[5, 15], [14, 38]]],
      E: [[[14, 0], [0, 0], [0, 38], [14, 38]], [[0, 19], [11, 19]]],
      S: [[[14, 3], [11, 0], [3, 0], [0, 3], [0, 16], [3, 19], [11, 19], [14, 22], [14, 35], [11, 38], [3, 38], [0, 35]]],
      L: [[[0, 0], [0, 38], [14, 38]]],
    }
    // which letters burn this frame: the L stutters (frames 14, 15 off, 17 dim), the second E tries once (frame 20)
    const lit = (i) => SIGN.dead.includes(i) ? (i === 4 && F === 20 ? "try" : "dead") : (i === 5 && (F === 14 || F === 15)) ? "dead" : (i === 5 && F === 17) ? "dim" : "on"
    SIGN.letters.split("").forEach((ch, i) => {
      const x = SIGN.x0 + i * SIGN.w, s = lit(i)
      rect(x + 1, SIGN.top - 3, SIGN.w - 3, SIGN.bottom - SIGN.top + 6, "k"); rect(x + 2, SIGN.top - 2, SIGN.w - 5, SIGN.bottom - SIGN.top + 4, "1")   // the letter's can
      vline(x + 2, SIGN.top - 2, SIGN.bottom - SIGN.top + 4, "2")
      const [edge, core] = s === "on" ? ["m", "N"] : s === "dim" ? ["M", "m"] : s === "try" ? ["M", "I"] : ["n", "i"]
      for (const poly of STROKES[ch]) for (let p = 1; p < poly.length; p++) line(x + 5 + poly[p - 1][0], SIGN.top + poly[p - 1][1], x + 5 + poly[p][0], SIGN.top + poly[p][1], edge, 1)
      for (const poly of STROKES[ch]) for (let p = 1; p < poly.length; p++) line(x + 5 + poly[p - 1][0], SIGN.top + poly[p - 1][1], x + 5 + poly[p][0], SIGN.top + poly[p][1], core, 0)
      if (s !== "dead") for (let yy = SIGN.top - 2; yy < SIGN.bottom + 2; yy++) for (let xx = x + 3; xx < x + SIGN.w - 3; xx++) {
        const here = KB[yy * W + xx]; if (here !== "1" && here !== "2") continue
        let d = 9; for (let b = -2; b <= 2; b++) for (let a = -2; a <= 2; a++) { const q = KB[(yy + b) * W + xx + a]; if (q === edge) d = Math.min(d, Math.max(Math.abs(a), Math.abs(b))) }
        if (d === 1) KB[yy * W + xx] = s === "on" ? "M" : "n"; else if (d === 2 && s === "on") KB[yy * W + xx] = dz(xx, yy) < 0.5 ? "M" : "n"
      }
      if (s === "dead") { const g = i * 7 % 30 + 4; px(x + 5, SIGN.top + g, "1"); px(x + 5, SIGN.top + g + 1, "k") }   // a cracked tube
      rect(x + 9, SIGN.bottom + 3, 3, 1, "3")                                                         // its electrode box under it
    })
    // the transformer: a grey box, its vents, its amber lamp (blinks)
    rect(TRAFO.x, TRAFO.y, TRAFO.w, TRAFO.h, "k"); rect(TRAFO.x + 1, TRAFO.y + 1, TRAFO.w - 2, TRAFO.h - 2, "4"); hline(TRAFO.x + 1, TRAFO.y + 1, TRAFO.w - 2, "5")
    for (let y = TRAFO.y + 6; y < TRAFO.y + TRAFO.h - 2; y += 2) hline(TRAFO.x + 3, y, TRAFO.w - 6, "2")
    px(TRAFO.x + 3, TRAFO.y + 3, F % 12 < 6 ? "Q" : "O"); px(TRAFO.x + 11, TRAFO.y + 3, "K")

    // ---- the AC box: its grille, the fan behind it, the rust under it, its drip on the ledge
    rect(AC.x, AC.y, AC.w, AC.h, "k"); rect(AC.x + 1, AC.y + 1, AC.w - 2, AC.h - 2, "5"); hline(AC.x + 1, AC.y + 1, AC.w - 2, "6")
    for (let j = 0; j < 11; j++) for (let i = 0; i < 11; i++) { const r = Math.hypot(i - 5, j - 5); if (r < 5.6) px(AC.x + 4 + i, AC.y + 4 + j, r < 1.5 ? "4" : (i + j) % 2 ? "2" : "3") }
    for (let y = AC.y + 4; y < AC.y + AC.h - 2; y += 2) hline(AC.x + 17, y, 6, "3")
    for (let y = AC.y + AC.h; y < BACK; y++) if (hash(1, y, 9) > 0.25) px(AC.x + 4 + (y > 132 ? 1 : 0), y, y < 130 ? "O" : "a")   // the rust run
    const drop = (F * 2) % 24                                                                       // the drip: one drop a frame-loop, then its ring
    if (drop < 22) px(AC.x + 4, AC.y + AC.h + 1 + drop, "6")

    // ---- the fire ladder: its fixed run off the top, the drop section folded up, the latch; bolt plates and their rust
    // pulled down (ladder_down, the prop sims_ladder): the drop section slides down to 1 m over the ledge, its foot there
    const foot = down ? LAD.down : LAD.low
    for (const rx of [LAD.x, LAD.x + LAD.w - 2]) { rect(rx, 0, 2, foot + 1, "5"); vline(rx, 0, foot + 1, "6") }
    for (let y = foot; y > 0; y -= 9) hline(LAD.x + 2, y, LAD.w - 4, "5")
    if (down) for (let y = LAD.low; y < foot; y += 4) { px(LAD.x - 1, y, "O"); px(LAD.x + LAD.w, y + 2, "O") }   // the rust it brought down
    rect(LAD.x - 2, foot + 1, LAD.w + 4, 2, "4"); hline(LAD.x - 2, foot + 3, LAD.w + 4, "k")          // the section's foot
    if (!down) { rect(LAD.x + 7, LAD.low + 3, 4, 3, "3"); px(LAD.x + 8, LAD.low + 6, "O") }         // the latch, where a hook would pull
    for (const by of [8, 44]) for (const bx of [LAD.x - 3, LAD.x + LAD.w + 1]) { rect(bx, by, 2, 2, "k"); for (let y = by + 2; y < by + 16; y++) if (hash(bx, y, 5) > 0.3) px(bx, y, "O") }
    // J+T, scratched (the concrete under the grime is lighter)
    grid(JT.x, JT.y, [
      "..#.....###",
      "..#..#...#.",
      "..#.###..#.",
      "#.#..#...#.",
      ".#.......#.",
    ], { "#": "5" })

    // ---- the drone in the cables: tilted, a rotor broken, its light still on (blinks), its parcel hanging under it
    {
      const X = DRONE.x, Y = DRONE.y
      line(X + 4, Y + 6, X + 11, Y + 6, "g", 0); line(X + 4, Y + 7, X + 11, Y + 7, "k")              // the left arm
      line(X + 20, Y + 5, X + 27, Y + 4, "g"); line(X + 20, Y + 6, X + 27, Y + 5, "k")                 // the right arm, a little higher (it hangs crooked)
      // the rotors in their guards, seen edge-on from a little below: the right one whole, the left one's guard broken, its blade hanging
      grid(X + 22, Y + 1, ["kkkkkkkkkkk", "khhhhHhhhhk", ".kkkkgkkkk.", ".....k....."])
      grid(X - 2, Y + 3, ["kkkkk.....", "khhhkk....", ".kkkgk....", "...hk.....", "..h.......", ".h........"])
      rect(X + 10, Y + 2, 12, 8, "k"); rect(X + 11, Y + 3, 10, 6, "g"); hline(X + 11, Y + 3, 10, "H")   // the body
      hline(X + 11, Y + 6, 10, "M"); px(X + 20, Y + 4, "v")                                             // the courier's stripe, the light
      line(X + 6, CABLE1(X + 6) - 1, X + 24, Y + 2, "k")                                               // the cable it caught on
      rect(X + 14, Y + 10, 4, 1, "k"); vline(X + 16, Y + 11, 6, "k")                                   // the claw, the strap
      rect(X + 10, Y + 17, 13, 10, "k"); rect(X + 11, Y + 18, 11, 8, "p"); rect(X + 11, Y + 24, 11, 2, "o")   // the parcel
      vline(X + 16, Y + 18, 8, "K"); rect(X + 18, Y + 19, 3, 2, "K"); px(X + 19, Y + 21, "o")         // its tape, its label
    }

    // ---- the ledge: its wet top (the neon and the window in it), its face lit from below, the drip edge, a chipped bit
    for (let y = BACK; y < L; y++) for (let x = 0; x < W; x++) {
      const n = neon(x, 30 + (L - y) * 4), w = winLight(x, 116)
      let k = tone(["z", "Z", "X"], 0.45 + (y - BACK) * 0.08, x, y)
      const under = x >= SIGN.x0 && x < sx1 && ((x - SIGN.x0) % SIGN.w) > 4 && ((x - SIGN.x0) % SIGN.w) < 20
      if (under && !SIGN.dead.includes(fl((x - SIGN.x0) / SIGN.w)) && dz(x, y) < 0.7) k = y === BACK + 1 ? "M" : "I"   // the letters mirrored
      else if (n > dz(x, y) + 0.3) k = "i"
      else if (w > dz(x, y)) k = "a"
      px(x, y, k)
    }
    hline(0, BACK, W, "4")
    for (const [x, w] of [[AC.x + 1, 9], [24, 7]]) for (let i = 0; i < w; i++) px(x + i, BACK + 2, i % 2 ? "I" : "i")   // puddles
    if (drop >= 22) { px(AC.x + 3, BACK + 1, "6"); px(AC.x + 5, BACK + 1, "6") }                      // the drop lands
    for (let y = L; y < L + 7; y++) for (let x = 0; x < W; x++) px(x, y, y === L ? "5" : y === L + 6 ? (dz(x, y) < 0.5 ? "i" : "3") : y < L + 3 ? "4" : "3")
    hline(0, L + 7, W, "k")
    rect(132, L, 6, 3, "2"); px(133, L + 1, "O"); px(135, L + 2, "O")                                // a chip out of the edge, the rebar's rust
    garden(F)

    // ---- the drop: the shadow under the ledge, the 13th floor's window heads, the street's light coming up
    for (let y = L + 8; y < H; y++) for (let x = 0; x < W; x++) {
      const g = clamp((y - 164) / 18, 0, 1) * 0.85
      let k = y < L + 11 ? "k" : dz(x, y) < g ? (dz(x, y) < g * 0.3 ? "I" : "i") : (x - 14) % 48 === 0 ? "1" : "2"
      if (y >= 174 && x >= WIN.x0 && x < WIN.x1) k = y === 174 ? "3" : "1"
      if (y >= 174 && x >= 150 && x < 194) k = y === 174 ? "3" : y > 177 && dz(x, y) < 0.4 ? "P" : "O"            // someone's home down there
      px(x, y, k)
    }
    return KB.slice()
  }

  const FRAMES = 24, cache = new Map()
  const frame = (f, down = false) => { f = ((f % FRAMES) + FRAMES) % FRAMES; const key = f + (down ? "d" : ""); if (!cache.has(key)) cache.set(key, paint(f, down)); return cache.get(key) }
  // the ladder pulled down, a prop over the picture while ladder_down: its rect of the picture painted with the section down
  const LADDER = { x: LAD.x - 3, y: 0, w: LAD.w + 6, h: LAD.down + 5 }
  const PARTS = [
    { name: "neon", x: SIGN.x0 + SIGN.w * 4, y: SIGN.top - 3, w: SIGN.w * 2, h: SIGN.bottom - SIGN.top + 6, frames: FRAMES },
    { name: "drone", x: DRONE.x + 19, y: DRONE.y + 3, w: 3, h: 3, frames: 12 },
    { name: "trafo", x: TRAFO.x + 2, y: TRAFO.y + 2, w: 3, h: 3, frames: 12 },
    { name: "water", x: 306, y: 91, w: 12, h: BACK - 91, frames: 12 },
    { name: "drip", x: AC.x + 2, y: AC.y + AC.h, w: 5, h: BACK - AC.y - AC.h + 3, frames: 12 },
  ]
  // lamps for the runtime light (x, y, colour, radius, power): the neon over the ledge, held low so Juno stays yellow under it (style
  // guide §7), the window's lamp as the warm key where she climbs out, the deck's cyan, the street's glow from below
  const LAMPS = [[170, 52, "#ff4fd3", 120, 0.3], [66, 110, "#eea040", 64, 0.9], [48, 112, "#62def0", 30, 0.5], [150, 190, "#ff4fd3", 70, 0.35]]
  console.log("PARTS " + JSON.stringify({ room: "sims", size: [W, H],
    ladder: { name: "sims_ladder", at: [LAD.x - 3, 0] },
    parts: PARTS.map((p) => ({ name: "sims_" + p.name, at: [p.x, p.y], size: [p.w, p.h], frames: p.frames, fps: 10, layer: "under" })), lamps: LAMPS }))
  const blit = (c, buf, x0, y0, w, h) => { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) c.px(x, y, buf[(y0 + y) * W + x0 + x]) }
  return { W, H, PARTS, LADDER, frame, blit }
})()

scene("sims_bg", { w: SIMS.W, h: SIMS.H, bg: "k" }, (c) => SIMS.blit(c, SIMS.frame(0), 0, 0, SIMS.W, SIMS.H))
sprite("sims_ladder", { w: SIMS.LADDER.w, h: SIMS.LADDER.h }, (c) => SIMS.blit(c, SIMS.frame(0, true), SIMS.LADDER.x, SIMS.LADDER.y, SIMS.LADDER.w, SIMS.LADDER.h))
for (const P of SIMS.PARTS) anim("sims_" + P.name, { w: P.w, h: P.h, frames: P.frames, fps: 10 }, (c) => SIMS.blit(c, SIMS.frame(c.frame ?? 0), P.x, P.y, P.w, P.h))

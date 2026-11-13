// Painting studies for the big look up from the Kessel Block's roof to the Rings (room dach_blick, game/stadt.js; the
// approved composition is variant B of the mock, dach_blick_b_bg in art/mock/ch1_blocks.px.js). "Da oben ist nicht der
// Himmel. Da oben ist der Boden von jemand anderem." Every study keeps B's geometry exactly: the nearest Ring's underside
// overhead, its hole low on the left and through it the next Rings' holes, each smaller and further towards the spine on the
// right, the Crown's white point at the top; the city and its smog along the bottom, the parapet's edge at 150 and the
// bottom 30 px calm for the subtitles. They differ in how the painting goes on from there:
//   A  night steel: the mock's colours refined. Steel panels and ribs, the near rims magenta where the street's neon
//      catches them, amber lamps round the near holes, whiter further up, the Crown cold white.
//   B  haze: the same, with the smog between the Rings: each Ring further up sinks deeper into a haze lit from below,
//      the upper ones fade into it, the Crown a soft glow; the lamps blur, the city's smog rises higher.
//   C  the underside: A's colours, but the near underside shows how it is built and how it leaks: box girders running
//      to the hole, cross beams, pipes and cable bundles hanging in sags, work lamps, and drips at the pipes' low
//      points catching the light; the holes' inner faces lit with windows (each Ring is a city's floor).
// The palette is the world palette (style guide §5) with the smog lit from below of the roof's photo
// (art/ui/deck_wallpaper.px.js: A B D G), so it sits with the painted roof (dach, dach_sitzen).
// Not built into the game.
//   PXL build art/mockups/dach_blick_studie.px.js --out build/blocks/dach_blick
pal({
  k: "#0c0e1a",
  1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  e: "#0f151f",
  n: "#3e1240", M: "#a8238a", m: "#ff4fd3", N: "#ffc0f2",
  O: "#552b1c", P: "#b0602a", Q: "#eea040", R: "#ffd58a", W: "#fff4d8",
  c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",
  r: "#7e1420", q: "#ff3a3a",
  y: "#eec414",
  A: "#1b1a33", B: "#261d3e", D: "#35214c", G: "#47275a",          // smog, lit from below (the roof's photo)
  J: "#433f68", K: "#5f6290", L: "#9aa2c8",                         // B only: the haze, lit, a lilac steel brightening towards the Crown
  u: "#a8b8d0",                                                     // the room's rain fx (the previews "im Spiel" only)
})
include("../lib/text.js")

{
  const W = 320, H = 180
  // B's geometry, as in the mock: the zenith's point (VX, VY), the ellipses' squash, the horizon, the holes' radii
  const VX = 226, VY = 26, Q = 0.5, HZ = 132, RINGS = [620, 300, 190, 122, 78, 50, 30, 16], CROWN = RINGS.length - 1
  const AT = RINGS.map((R) => [VX - R * 0.42, VY + R * 0.34])
  const PARAPET = 150
  const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5], bay = (x, y) => (BAY[(y & 3) * 4 + (x & 3)] + 0.5) / 16
  const hash = (a, b) => { let h = (a * 374761393 + b * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
  const ramp = (keys, t, x, y) => { t = Math.max(0, Math.min(keys.length - 1, t)); const b = Math.floor(t); return keys[Math.min(keys.length - 1, b + (bay(x, y) < t - b ? 1 : 0))] }
  const dist = (n, x, y) => Math.hypot(x - AT[n][0], (y - AT[n][1]) / Q)
  /** which Ring's underside a pixel shows: inside hole n (and not n+1) is Ring n */
  const ringAt = (x, y) => { for (let n = CROWN; n > 0; n--) if (dist(n, x, y) < RINGS[n]) return n; return 0 }
  // the direction from a hole's middle towards the zenith (unsquashed): the far side of a hole, where its inner face shows
  const UP = AT.map(([ax, ay]) => { const dx = VX - ax, dy = (VY - ay) / Q, l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l] })
  const STEEL = "k1234"

  /** @param {"A" | "B" | "C"} V @returns {string[][]} */
  function study(V) {
    const buf = Array.from({ length: H }, () => Array(W).fill("k"))
    const px = (x, y, k) => { x = Math.round(x); y = Math.round(y); if (x >= 0 && x < W && y >= 0 && y < H) buf[y][x] = k }
    const get = (x, y) => buf[Math.max(0, Math.min(H - 1, y))][Math.max(0, Math.min(W - 1, x))]
    const haze = V === "B"
    /** B: how deep in the haze a Ring hangs (0 none), and the haze's own tone there: brighter towards the Crown */
    const hazeW = (i) => haze ? Math.min(0.9, Math.max(0, i - 1) * 0.18) : 0
    // the haze is one ladder, the steel's dark end going over into a lilac lit from below and the Crown's cold light: a Ring
    // deep in it keeps its ribs and seams but with less and less contrast, lifted towards the haze's own tone there
    const LADDER = "k123JKLV", glow = (x, y) => Math.exp(-dist(CROWN, x, y) / 70)
    const hazeLevel = (x, y) => 3.4 + glow(x, y) * 3.4
    const lift = (t, i, x, y) => { const w = hazeW(i); return ramp(LADDER, t * 0.95 * (1 - w) + hazeLevel(x, y) * w, x, y) }
    const hazeKey = (x, y) => ramp(LADDER, hazeLevel(x, y), x, y)
    const veil = (k, i, x, y) => (haze && bay(x, y) < hazeW(i) ? hazeKey(x, y) : k)

    // ---- the undersides
    for (let y = 0; y < HZ; y++) for (let x = 0; x < W; x++) {
      const i = ringAt(x, y)
      if (i === CROWN) {                                                                     // the Crown: cold white
        const r = dist(i, x, y)
        px(x, y, haze ? (r < 5 ? "V" : ramp(LADDER, 7 - (r - 5) / 5, x, y)) : r < 3 ? "V" : r < 6 ? "6" : r < 10 ? "5" : ramp("45", 1.6 - (r - 10) / 4, x, y)); continue
      }
      const R0 = RINGS[i], R1 = RINGS[i + 1], rIn = dist(i + 1, x, y), u = (rIn - R1) / (R0 - R1)  // u: 0 at this Ring's own hole
      const a = Math.atan2((y - AT[i + 1][1]) / Q, x - AT[i + 1][0])
      const ribs = 30 + i * 2, rib = Math.abs(((a + Math.PI) * ribs / (2 * Math.PI)) % 1 - 0.5) < (i === 0 ? 0.035 : 0.05)
      const step = Math.max(5, (R0 - R1) / 5), seam = Math.floor(rIn / step) !== Math.floor((rIn + 1.6) / step)
      // dark overhead, a step lighter further up (the air between), lit near its hole where the lamps hang: each Ring's steel is
      // one solid tone, its ribs and seams one darker; only the lamps' light near the hole is dithered (style guide §4: dither
      // only for light falloff, never on a material)
      let t = [1, 1, 2, 2, 2, 3, 3][i] + Math.max(0, 0.22 - u) * 6
      if (rib || seam) t -= 1
      let k = haze && hazeW(i) > 0 ? lift(t, i, x, y) : ramp(STEEL, t, x, y)
      // the near Rings' undersides take the street's neon close to their rims (magenta, dithered in)
      if (i < 3 && u < 0.16 && bay(x, y) < (0.16 - u) / 0.16 * (i === 0 ? 0.55 : 0.4)) k = i === 0 ? "n" : (bay(x + 1, y) < 0.5 ? "n" : "D")
      // the hole's inner face, on its far side (towards the zenith): the Ring's thickness, its edge-city's windows
      px(x, y, k)
    }
    // the inner faces of the holes (a Ring is thick: its edge shows inside the hole, on the side away from us)
    for (let n = 2; n < CROWN; n++) {
      const T = (V === "C" ? 15 : 9) * (RINGS[n] / 190) ** 0.75
      for (let y = 0; y < HZ; y++) for (let x = 0; x < W; x++) {
        const d = dist(n, x, y); if (d >= RINGS[n] || ringAt(x, y) !== n) continue
        const dx = (x - AT[n][0]) / d, dy = ((y - AT[n][1]) / Q) / d, f = dx * UP[n][0] + dy * UP[n][1]
        const depth = RINGS[n] - d, th = T * Math.max(0, f) * Q
        if (depth > th) continue
        let k = depth < 1 ? "2" : n < 5 ? "3" : "4"
        // windows along the edge (rows of them, only where it is thick enough to read)
        if (th > 2.5 && depth > 1 && depth < th - 1 && Math.floor(depth) % 2 === 1) { const ang = Math.round(Math.atan2(dy, dx) * RINGS[n] / 3); if (hash(ang, n * 7 + Math.floor(depth)) < (V === "C" ? 0.2 : 0.16)) k = n < 4 ? "P" : "Q" }
        px(x, y, veil(k, n - 1, x, y))
      }
    }
    // the rims, lit from below: magenta on the near ones, steel further up
    for (let n = 1; n < CROWN; n++) {
      const R = RINGS[n], [ax, ay] = AT[n], steps = Math.ceil(R * 7)
      for (let s = 0; s < steps; s++) {
        const a = s * 2 * Math.PI / steps, x = Math.round(ax + (R + 0.5) * Math.cos(a)), y = Math.round(ay + (R + 0.5) * Q * Math.sin(a))
        if (y < 0 || y >= HZ || x < 0 || x >= W) continue
        const k = n === 1 ? "M" : n === 2 ? "M" : n === 3 ? "5" : n < 6 ? "5" : "6"
        px(x, y, haze && n > 2 && bay(x, y) < hazeW(n - 1) * 0.8 ? hazeKey(x, y) : k)
        if (n <= 2) { const x2 = Math.round(ax + (R + 1.5) * Math.cos(a)), y2 = Math.round(ay + (R + 1.5) * Q * Math.sin(a)); if (y2 < HZ && get(x2, y2) !== "M") px(x2, y2, n === 1 ? "n" : "n") }
      }
    }
    // lamps round the holes: amber near, whiter further up
    for (let n = 2; n < CROWN; n++) {
      const R = RINGS[n], N = [0, 0, 24, 22, 16, 12, 9][n], near = n < 4
      for (let s = 0; s < N; s++) {
        const a = (s + (n % 2) * 0.5) * 2 * Math.PI / N, x = Math.round(AT[n][0] + (R + 3) * Math.cos(a)), y = Math.round(AT[n][1] + (R + 3) * Q * Math.sin(a))
        if (x < 1 || x >= W - 1 || y < 1 || y >= HZ - 1) continue
        const k = near ? "R" : n < 5 ? "W" : "6"
        if (haze) {                                                                           // a blur of light in the haze
          if (bay(x, y) < hazeW(n - 1) * 0.6 && n > 3) continue
          for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) if (bay(x + dx, y + dy) < 0.6) px(x + dx, y + dy, near ? "P" : "G")
          px(x, y, k)
        } else {
          if (near) { px(x - 1, y, "O"); px(x + 1, y, "O") }
          px(x, y, k)
        }
      }
    }
    // the near rim's own lamps (Ring 0, round hole 1), big and few, like the photo's under the ring above
    for (let s = 0; s < 40; s++) {
      const a = s * 2 * Math.PI / 40, x = Math.round(AT[1][0] + (RINGS[1] + 4) * Math.cos(a)), y = Math.round(AT[1][1] + (RINGS[1] + 4) * Q * Math.sin(a))
      if (x < 1 || x >= W - 1 || y < 1 || y >= HZ - 1) continue
      px(x, y, "R"); px(x, y - 1, "4"); if (!haze) { px(x - 1, y, "O"); px(x + 1, y, "O") } else { px(x - 1, y, "P"); px(x + 1, y, "P"); px(x, y + 1, "O") }
    }

    // ---- C: how the near underside is built and how it leaks
    if (V === "C") {
      // box girders on the two nearest Rings seen (1 in the top corners, 2 the wide field), from each one's hole outwards (towards
      // us), widening as they come nearer: the web dark, the lower flange lit by the city's light on one side
      for (const i of [1, 2]) {
        const [hx, hy] = AT[i + 1], Rh = RINGS[i + 1], G = i === 1 ? 22 : 16
        for (let g = 0; g < G; g++) {
          const ang = (g + 0.5) * 2 * Math.PI / G, ca = Math.cos(ang), sa = Math.sin(ang)
          for (let r = Rh + 1; r < Rh + 260; r += 0.4) {
            const x = hx + r * ca, y = hy + r * Q * sa; if (y < -10 || y > HZ + 10 || x < -30 || x > W + 30) break
            const w = (i === 1 ? 1.6 : 1) + (r - Rh) / 34, nx = -sa, ny = ca * Q, lw = Math.hypot(nx, ny), ux = nx / lw, uy = ny / lw
            for (let o = -w; o <= w; o += 0.4) {
              const gx = Math.round(x + ux * o), gy = Math.round(y + uy * o); if (gy >= HZ || gy < 0 || gx < 0 || gx >= W || ringAt(gx, gy) !== i) continue
              buf[gy][gx] = o > w - 1 ? "4" : o < -w + 0.8 ? "k" : Math.abs(o) < 0.5 ? "3" : "1"
            }
          }
        }
        // cross beams between them, round the hole
        for (const r of i === 1 ? [Rh + 22, Rh + 60, Rh + 108] : [Rh + 16, Rh + 40]) for (let s = 0; s < 2400; s++) {
          const a = s * 2 * Math.PI / 2400, x = Math.round(hx + r * Math.cos(a)), y = Math.round(hy + r * Q * Math.sin(a))
          if (y < 0 || y >= HZ || x < 0 || x >= W || ringAt(x, y) !== i) continue
          const th = 1 + Math.floor((r - Rh) / 40)
          for (let d = 0; d <= th; d++) { const yy = y + d; if (yy < HZ && ringAt(x, yy) === i && buf[yy][x] !== "4") buf[yy][x] = d === th ? "3" : "k" }
        }
      }
      // pipes hung under the Ring overhead (the wide field), round its hole: between their hangers they sag towards us,
      // which from below is outwards, away from the zenith; dark, the side facing down catching the street's magenta
      const [cx, cy] = AT[3], R3 = RINGS[3], lows = []
      const arcPipe = (r, a0, a1, span, s, thick) => {
        const da = 0.0015
        for (let a = a0; a <= a1; a += da) {
          const f = (((a - a0) / span) % 1 + 1) % 1, rr = r + s * 4 * f * (1 - f), ca = Math.cos(a), sa = Math.sin(a)
          const x = cx + rr * ca, y = cy + rr * Q * sa
          if (y < -4 || y > HZ - 34 || x < -4 || x > W + 4 || ringAt(Math.round(x), Math.round(y)) !== 2) continue
          // across the pipe = radially (outward on screen is "down" towards us): the top dark, the bottom lit
          const ox = ca, oy = sa * Q, ol = Math.hypot(ox, oy) || 1
          for (let o = 0; o < thick; o++) px(x + ox / ol * o, y + oy / ol * o, o === thick - 1 ? (bay(Math.round(x), Math.round(y)) < 0.3 ? "M" : "n") : o === 0 ? "k" : "3")
          if (Math.abs(f - 0.5) < da / span * 0.51) lows.push([x + ox / ol * thick, y + oy / ol * thick])
          if (f < da / span * 1.01) for (let o = 1; o < 7; o++) px(x - ox / ol * o, y - oy / ol * o, "k")      // the hanger, up into the steel
        }
      }
      arcPipe(R3 + 9, -Math.PI * 1.1, 0.3, 0.2, 4, 3)
      arcPipe(R3 + 26, -Math.PI * 1.15, 0.35, 0.24, 7, 3)
      arcPipe(R3 + 50, -Math.PI * 1.2, 0.4, 0.18, 9, 4)
      // a bundle of cables let down across the hole's near edge, top left: three lines, each sagging a little more
      const sag = (x0, y0, x1, y1, s, x) => { const t = (x - x0) / (x1 - x0); return y0 + (y1 - y0) * t + s * 4 * t * (1 - t) }
      for (const [dy, s] of [[0, 22], [2, 25], [3, 29]]) for (let x = 0; x < 132; x++) {
        const y = Math.round(sag(-6, 18 + dy, 134, 2 + dy, s, x)); if (y < 0 || y >= HZ - 34) continue
        px(x, y, "k"); if (dy === 3) px(x, y + 1, bay(x, y) < 0.5 ? "n" : "1")
        if (dy === 3 && x === 64) lows.push([x, y + 1])
      }
      // the drips: where a pipe hangs lowest the water gathers, a bright bead and one falling under it
      lows.forEach(([x, y], n) => { if (y < 1 || y > HZ - 36 || x < 1 || x > W - 2 || n % 2) return; px(x, y + 1, n % 4 ? "R" : "N"); px(x, y + 4, "6"); px(x, y + 8, "5") })
      // work lamps under the nearest Ring: a warm pool on the steel round each
      for (const [x, y] of [[14, 22], [300, 26], [252, 4]]) {
        const i = ringAt(x, y); if (i > 0) continue
        for (let dy = -3; dy <= 3; dy++) for (let dx = -6; dx <= 6; dx++) if ((dx / 6) ** 2 + (dy / 3) ** 2 < 1 && bay(x + dx, y + dy) < 0.3 && ringAt(x + dx, y + dy) === i && buf[y + dy]?.[x + dx] !== "k") px(x + dx, y + dy, "O")
        px(x, y, "W"); px(x - 1, y, "Q"); px(x + 1, y, "Q")
      }
    }

    // ---- the spine: far off, straight up through every hole, narrowing as it rises; its lifts of light
    for (let y = VY + 3; y < HZ + 6; y++) {
      const w = 2 + (y - VY) * 0.035, x0 = Math.round(VX - w), x1 = Math.round(VX + w)
      for (let x = x0; x <= x1; x++) px(x, y, veil(x === x0 ? "4" : x < VX ? "3" : "2", Math.max(0, 6 - (y - VY) / 18), x, y))
    }
    for (let y = VY + 8, s = 3; y < HZ; y += s, s = Math.min(9, s + 1)) px(VX, y, haze && y < 60 ? "C" : "v")
    // where it passes each Ring: a collar (the checkpoints), its light red, sparingly (the system's eye)
    for (const [y, red] of [[44, false], [70, true], [104, false]]) { const w = 3 + (y - VY) * 0.035; for (let x = Math.round(VX - w - 1); x <= Math.round(VX + w + 1); x++) px(x, y, "4"); px(VX + Math.round(w) + 1, y - 1, red ? "q" : "v") }

    // ---- the smog over the city, lit from below, rising higher in the haze
    const s0 = haze ? HZ - 40 : HZ - 22
    for (let y = s0; y < PARAPET; y++) for (let x = 0; x < W; x++) {
      const t = (y - s0) / (HZ + 8 - s0)
      if (y < HZ) { if (bay(x, y) < t * 0.9) px(x, y, ramp("1ABD", t * 3.2, x, y)) }
      else px(x, y, ramp("BDG", 1 + (y - HZ) / 10 + (haze ? 0.5 : 0), x, y))
    }
    // a back row in the smog: many thin towers, a shade lighter than the front ones, few windows
    for (let x = -4, n = 0; x < W; n++) {
      const tw = 5 + Math.floor(hash(n, 3) * 10), top = HZ - 12 + Math.floor(hash(n, 5) * 14)
      for (let y = top; y < PARAPET; y++) for (let xx = x; xx < x + tw; xx++) px(xx, y, haze && bay(xx, y) < 0.45 ? "B" : xx === x ? "B" : "A")
      for (let y = top + 2; y < PARAPET - 2; y += 3) for (let xx = x + 1; xx < x + tw - 1; xx += 2) if (hash(xx * 7 + n, y) < 0.06) px(xx, y, haze ? "O" : "P")
      x += tw + (hash(n, 9) < 0.3 ? 2 : 0)
    }
    // the smog in front of them, thicker and brighter towards the street's light below
    for (let y = HZ; y < PARAPET; y++) for (let x = 0; x < W; x++) if (bay(x, y) < (y - HZ) / 22 * (haze ? 0.9 : 0.7)) px(x, y, ramp("BDG", (y - HZ) / 7 + (haze ? 0.4 : 0), x, y))
    // the front towers (the mock's), dark against it: setbacks at the top, a mast on some, rows of windows (amber: people)
    const towers = [[6, 22, 112, 6], [40, 16, 118, 0], [70, 30, 104, 8], [116, 14, 116, 0], [150, 26, 110, 5], [190, 14, 120, 0], [250, 24, 108, 7], [290, 26, 116, 4]]
    for (const [tx, tw, top, set] of towers) {
      const crown = set ? top + 6 : top                                            // the setback: the top storeys narrower
      for (let y = top; y < PARAPET; y++) {
        const x0 = y < crown ? tx + set : tx, x1 = y < crown ? tx + tw - set : tx + tw
        for (let x = x0; x < x1; x++) {
          const fade = haze ? Math.max(0, (PARAPET - y) / (PARAPET - top)) * 0.3 : 0
          px(x, y, bay(x, y) < fade ? "A" : x === x0 ? "2" : y === top || y === crown ? "2" : "1")
        }
      }
      for (let y = crown + 3; y < PARAPET - 2; y += 3) for (let x = tx + 2; x < tx + tw - 2; x += 2) { const h = hash(x * 3 + tx, y); if (h < 0.11) px(x, y, h < 0.03 ? "R" : h < 0.08 ? "Q" : "P") }
      if (set > 5) for (let y = top - 7; y < top; y++) px(tx + Math.floor(tw / 2), y, "2")
    }
    // the city's signs on them: solid, lit, their light spilling a little on the wall beside
    const sign = (x, y, w, h, lit, dim, glow) => {
      for (let yy = y - 1; yy <= y + h; yy++) for (let xx = x - 2; xx < x + w + 2; xx++) if (bay(xx, yy) < 0.35) px(xx, yy, glow)
      for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) px(xx, yy, (w > h ? (xx - x) % 3 === 2 : (yy - y) % 3 === 2) ? dim : lit)
    }
    sign(76, 112, 3, 14, "m", "M", "n"); sign(254, 116, 12, 4, "v", "C", "c"); sign(154, 124, 9, 3, "m", "M", "n"); sign(18, 122, 10, 3, "v", "C", "c"); sign(296, 124, 3, 9, "m", "M", "n")
    // the parapet's edge, where she stands: its wet top catching the glow, then dark and calm for the lines
    for (let x = 0; x < W; x++) { px(x, PARAPET, "4"); px(x, PARAPET + 1, "3"); px(x, PARAPET + 2, "2"); for (let y = PARAPET + 3; y < H; y++) px(x, y, y < PARAPET + 5 ? "1" : "k") }
    return buf
  }

  const memo = {}
  const blit = (c, V, ox = 0, oy = 0) => { const b = (memo[V] ??= study(V)); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(ox + x, oy + y, b[y][x]) }
  // the room's rain fx (game/stadt.js: 30 drops, 3 px, straight down) and a subtitle where the game sets it (lines: "bottom")
  const inGame = (c, ox = 0, oy = 0) => {
    for (let n = 0; n < 30; n++) { const x = Math.floor(hash(n, 91) * W), y = Math.floor(hash(n, 17) * (PARAPET - 4)); for (let d = 0; d < 3; d++) c.px(ox + x, oy + y + d, "u") }
    TXT.draw(c, ox + 160, oy + 154, "Über mir hängen acht Ringe. Der helle\nPunkt da oben ist die Krone.", "y", { font: "nagiwa", outline: "k", align: "center" })
  }

  for (const V of ["A", "B", "C"]) {
    scene(`dach_blick_studie_${V}`, { w: W, h: H, bg: "k" }, (c) => blit(c, V))
    scene(`dach_blick_studie_${V}_im_spiel`, { w: W, h: H, bg: "k" }, (c) => { blit(c, V); inGame(c) })
  }
  // the sheet: the three side by side, each labelled
  const GAP = 8, TOPM = 14
  const NAMES = { A: "A  NIGHT STEEL", B: "B  HAZE", C: "C  UNDERSIDE" }
  scene("dach_blick_studien", { w: 3 * W + 4 * GAP, h: H + TOPM + GAP, bg: "e" }, (c) => {
    ;["A", "B", "C"].forEach((V, n) => { const ox = GAP + n * (W + GAP); blit(c, V, ox, TOPM); TXT.draw(c, ox, 4, NAMES[V], "6", { font: "hud" }) })
  })
  scene("dach_blick_studien_im_spiel", { w: 3 * W + 4 * GAP, h: H + TOPM + GAP, bg: "e" }, (c) => {
    ;["A", "B", "C"].forEach((V, n) => { const ox = GAP + n * (W + GAP); blit(c, V, ox, TOPM); inGame(c, ox, TOPM); TXT.draw(c, ox, 4, NAMES[V], "6", { font: "hud" }) })
  })
}

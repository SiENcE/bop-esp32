// The intro's opening float (docs/kapitel0-design.md §5, shots A1 and A2): the painted parts. The game draws the
// float itself in perspective (game/intro.js: the lights on the water, the stacks' columns, the drones' beams, the
// camera moving forward); these are the pieces it lays in.
//   intro_sky_a1      320x180: the night over the sea, low cloud lit from below by the city, the haze glowing on
//                     the horizon (HZ_A1); the dark water under it
//   intro_sky_a2      the same, its horizon lower (the camera looks up at the city: HZ_A2)
//   intro_halcyon     Halcyon in the haze, as seen from the sea: the nine rings stacked, narrower going up, the
//                     tower through them, its ring logo, the hall's green band; the lower rings fade into the haze;
//                     a red light on the mast blinks (12 frames at 10 fps; pivot bottom-centre, on the horizon)
//   intro_flame_1..5  a stack's flame, billowing, five sizes (the game picks one by the stack's width; 12 frames at
//                     10 fps, pivot bottom-centre, on the stack's top), its smoke lit from below
//   intro_drone       a patrol drone far off: 7 px, its red eye blinking (12 frames)
// Colours: the world palette (style guide §5); dithering only for the light's falloff (the haze, the glow).
;(() => {
pal({
  k: "#0c0e1a", n: "#06080f", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  e: "#0f151f", f: "#151d2b",
  a: "#2c2026", A: "#4a3026",                                                 // floor (here: haze) in warm light
  O: "#552b1c", P: "#b0602a", Q: "#eea040", R: "#ffd58a", W: "#fff4d8",       // warm light
  M: "#a8238a", m: "#ff4fd3", c: "#123c4e", C: "#1f88a4", v: "#62def0",
  r: "#7e1420", q: "#ff3a3a", 8: "#266252", 9: "#55a585",                      // red; the hall's phosphor green
})
const W = 320, H = 180, HZ_A1 = 62, HZ_A2 = 100
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]
const bay = (x, y) => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16
const rnd = (i, s) => { let h = (i * 374761393 + s * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }

// the sky: dark at the top; banks of low cloud, their undersides lit warm by the city below; the haze on the
// horizon glowing (dithered: light falling off); the water under it, a faint warm sheen near the horizon
function sky(c, hz) {
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (y >= hz) { const d = y - hz; c.px(x, y, d < 3 && bay(x, y) < 0.5 ? "f" : d < 8 && bay(x, y) < (8 - d) / 16 ? "f" : "e"); continue }
    const up = (hz - y) / hz                                                    // 0 at the horizon, 1 at the top
    let k = up > 0.7 ? "n" : up > 0.35 ? (bay(x, y) < (0.7 - up) / 0.35 ? "k" : "n") : "k"
    // the cloud banks: long, slightly wavy strips; lit from below where they are low
    for (let b = 0; b < 5; b++) {
      const cy = hz * (0.18 + b * 0.16) + Math.sin(x / (37 + b * 9) + b * 2) * 3 + Math.sin(x / 13 + b) * 1.2
      const thick = 3 + b * 1.6
      if (y > cy - thick && y <= cy) {
        const under = cy - y < 1.5, lowB = b >= 3
        k = under ? (lowB ? "3" : "2") : lowB ? "2" : "1"
        if ((x + b * 31) % 97 < 9) k = "1"                                      // gaps in the bank
      }
    }
    // the haze over the horizon: the city's light in the wet air
    const g = hz - y
    // in bands, a dithered row between them: the light thickens towards the horizon
    if (g < 14) {
      const band = g < 2 ? "A" : g < 6 ? "a" : "2", edge = g === 2 || g === 6 || g === 13
      if (!edge || bay(x, y) < 0.5) k = band
    }
    c.px(x, y, k)
  }
  for (let x = 0; x < W; x++) if (bay(x, hz - 1) < 0.35) c.px(x, hz - 1, "A")            // the horizon's line of light
}
sprite("intro_sky_a1", { w: W, h: H }, (c) => sky(c, HZ_A1))
sprite("intro_sky_a2", { w: W, h: H }, (c) => sky(c, HZ_A2))

// Halcyon from the sea: 9 rings, the Lower Ninth widest at the bottom; each ring a facade band with rows of
// windows (amber homes, magenta ads low down, cyan up in the Krone), the ledge above it in shadow, its underside
// lit by the ring below; the tower's spine through all of them, above them its mast and ring logo
const HW = 260, HH = 78, RING = 6
anim("intro_halcyon", { w: HW, h: HH, frames: 12, fps: 10, pivot: "bottom" }, (c) => {
  const cx = HW >> 1, f = c.frame ?? 0
  for (let r = 0; r < 9; r++) {
    const yb = HH - 1 - r * RING, half = 128 - r * 12, top = yb - RING + 1
    for (let y = top; y <= yb; y++) for (let x = cx - half; x < cx + half; x++) {
      const row = y - top
      let k = row === 0 ? "1" : row === 1 ? (r < 4 ? "a" : "3") : "2"          // ledge, the lit underside of the ring above, the facade
      if (row >= 2 && row <= 4 && (x + r) % 2 === 0) {                         // windows in two rows
        const t = rnd(x * 7 + row, r)
        if (t < (r < 6 ? 0.42 : 0.3)) k = r >= 7 ? (t < 0.15 ? "v" : "C") : r < 3 && t < 0.07 ? (t < 0.03 ? "m" : "M") : t < 0.1 ? "Q" : r < 3 ? "O" : "P"
      }
      c.px(x, y, k)
    }
    c.px(cx - half, top, "k"); c.px(cx + half - 1, top, "k")                    // the corners recede
  }
  // the tower: its spine, the hall's band glowing green, the mast and the ring logo, a red light blinking
  const tt = HH - 9 * RING - 18
  c.rect(cx - 5, tt, 10, HH - tt - 9 * RING + 4, "2"); c.rect(cx - 5, tt, 1, HH - tt - 9 * RING + 4, "4")
  for (let y = tt + 2; y < HH - 9 * RING; y += 3) c.hline(cx - 3, y, 6, (y >> 1) % 3 ? "3" : "O")
  c.rect(cx - 5, tt + 9, 10, 2, "9"); c.hline(cx - 4, tt + 9, 8, "8")
  c.vline(cx, tt - 9, 9, "3")
  c.ellipse(cx, tt - 11, 4, 2, "C"); c.ellipse(cx, tt - 11, 2, 1, "1")
  if (f < 4) c.px(cx, tt - 14, "q"); else c.px(cx, tt - 14, "r")
  // the haze in front of the lowest rings: they fade into it
  for (let y = HH - 14; y < HH; y++) for (let x = 0; x < HW; x++) if (c.key(x, y) && bay(x, y) < (y - HH + 14) / 22) c.px(x, y, "a")
}, glow("v", { r: 3, strength: 0.25 }), glow("q", { r: 2, strength: 0.6 }), glow("9", { r: 3, strength: 0.3 }))

// a stack's flame: a teardrop that wavers and licks upward, white at its root, its tongues breaking off;
// smoke above it, its underside lit. s = 1..5 (the stack's width in px, roughly)
function flame(c, s, w, h) {
  const f = c.frame ?? 0, ph = (c.phase ?? 0) * Math.PI * 2, cx = w >> 1, fh = 5 + s * 4, fw = 2 + s * 1.4
  const base = h - 1
  // the smoke: three puffs rising through the loop
  for (let i = 0; i < 3; i++) {
    const p = ((c.phase ?? 0) + i / 3) % 1, py = base - fh - 1 - p * s * 4, pr = 0.5 + s * 0.3 + p * s * 0.4
    const px = cx + Math.round(Math.sin(ph + i) * s * 0.4 + p * s * 0.6)
    c.ellipse(px, Math.round(py), Math.round(pr + 1), Math.round(pr), p < 0.5 ? "3" : "2")
    if (p < 0.6) c.hline(px - Math.round(pr), Math.round(py + pr), Math.round(pr * 2), "a")
  }
  for (let y = 0; y < fh; y++) {
    const t = y / fh, sway = Math.sin(ph + y * 0.5) * t * s * 0.5
    const half = fw * Math.sin(Math.PI * Math.min(1, 0.15 + t * 0.95)) * (1 - t * 0.55) + (rnd(f * 31 + y, s) - 0.5) * t * 2
    for (let x = Math.floor(cx + sway - half); x <= Math.ceil(cx + sway + half); x++) {
      const d = Math.abs(x - cx - sway) / Math.max(0.6, half)
      if (t > 0.6 && rnd(x * 13 + y * 7 + f * 101, s) < (t - 0.6) * 1.6) continue   // tongues breaking off
      c.px(x, base - y, d < 0.25 && t < 0.35 ? "W" : d < 0.5 && t < 0.6 ? "R" : d < 0.75 && t < 0.85 ? "Q" : d < 0.95 ? "P" : "O")
    }
  }
}
const FLAME = [null, [9, 18], [11, 24], [13, 30], [15, 36], [17, 42]]
for (let s = 1; s <= 5; s++) {
  const [w, h] = FLAME[s]
  anim(`intro_flame_${s}`, { w, h, frames: 12, fps: 10, pivot: "bottom" }, (c) => flame(c, s, w, h),
    glow("R", { r: 2 + s, strength: 0.4 }), glow("W", { r: 2 + s, strength: 0.3 }))
}

// a patrol drone, far: its body a short dark bar lit from above, its red eye, the lens under it
anim("intro_drone", { w: 7, h: 4, frames: 12, fps: 10, pivot: "bottom" }, (c) => {
  const f = c.frame ?? 0
  c.hline(0, 0, 2, "4"); c.hline(5, 0, 2, "4")                                   // the rotors
  c.hline(1, 1, 5, "3"); c.hline(2, 2, 3, "2"); c.px(3, 2, f % 6 < 4 ? "q" : "r"); c.px(3, 3, "6")
}, glow("q", { r: 2, strength: 0.6 }))
})()

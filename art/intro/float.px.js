// The intro's opening float (docs/kapitel0-design.md §5, shots A1 and A2): the painted parts. The game draws the
// float itself in perspective (game/intro.js: the lights on the water, the stacks' columns, the drones' beams, the
// camera moving forward); these are the pieces it lays in.
//   intro_sky_a1      320x180: the night over the sea, low cloud lit from below by the city, the haze glowing on
//                     the horizon (HZ_A1); the dark water under it
//   intro_sky_a2      the same, its horizon lower (the camera looks up at the city: HZ_A2)
//   intro_mast_1..5   a camera mast's head (the city's cameras stand in the water): its housings, the lenses, the
//                     red eye blinking; five sizes, the game picks one by distance (12 frames at 10 fps, pivot
//                     bottom-centre, on the column's top). Halcyon itself the game draws (at any size, as it nears)
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

// a camera mast's head (the Glass: the city's cameras stand in the water too): a platform on the column, camera
// housings on it looking out to the sides and at us, their lenses glinting cyan, the one facing us panning
// slowly; a dome on top with the red eye blinking, an antenna. s = 1..5 (the game picks one by distance)
function mastHead(c, s, w, h) {
  const f = c.frame ?? 0, ph = (c.phase ?? 0) * Math.PI * 2, cx = w >> 1, base = h - 1
  const pw = 3 + 2 * s, bw = 2 + (s >> 1), bh = 1 + (s >> 1), L = cx - (pw >> 1), R = L + pw - 1
  // the platform, its rim lit from above
  c.hline(L, base, pw, "2"); if (s > 1) c.hline(L, base - 1, pw, "4")
  const y0 = base - (s > 1 ? 2 : 1)
  // a housing each side on the platform's ends, looking out (its lens on the outer end)
  const box = (x, y, bw2, bh2) => { c.rect(x, y - bh2 + 1, bw2, bh2, "3"); c.hline(x, y - bh2 + 1, bw2, "4") }
  box(L - 1, y0, bw, bh); c.px(L - 1, y0 - (bh >> 1), "C")
  box(R - bw + 2, y0, bw, bh); c.px(R + 1, y0 - (bh >> 1), "C")
  // the middle: a short pole, the housing that looks at us, its lens panning slowly
  const pole = (s >> 1) + 1, my = y0 - pole
  c.vline(cx, my + 1, pole, "3")
  const mw = bw + 1 + (bw & 1 ? 0 : 1), mh = bh + 1, mx = cx - (mw >> 1)
  box(mx, my, mw, mh)
  const lx = cx + Math.round(Math.sin(ph) * ((mw >> 1) - 1)), ly = my - (mh >> 1)
  c.px(lx, ly, "v"); if (s >= 4) c.px(lx, ly + 1, "C")
  // the dome, its red eye, the antenna
  const dy = my - mh
  if (s >= 2) { c.ellipse(cx, dy, Math.max(1, (s + 1) >> 1), 1, "3"); c.px(cx - 1, dy - 1, "4") }
  c.px(cx, dy - (s >= 2 ? 1 : 0), f < 4 ? "q" : "r")
  if (s >= 3) c.vline(cx, dy - 1 - s, s, "3")
}
const MAST = [null, [11, 10], [15, 14], [19, 18], [23, 22], [27, 26]]
for (let s = 1; s <= 5; s++) {
  const [w, h] = MAST[s]
  anim(`intro_mast_${s}`, { w, h, frames: 12, fps: 10, pivot: "bottom" }, (c) => mastHead(c, s, w, h),
    glow("q", { r: 2 + (s >> 1), strength: 0.6 }), glow("v", { r: 2, strength: 0.3 }))
}

// a patrol drone, far: its body a short dark bar lit from above, its red eye, the lens under it
anim("intro_drone", { w: 7, h: 4, frames: 12, fps: 10, pivot: "bottom" }, (c) => {
  const f = c.frame ?? 0
  c.hline(0, 0, 2, "4"); c.hline(5, 0, 2, "4")                                   // the rotors
  c.hline(1, 1, 5, "3"); c.hline(2, 2, 3, "2"); c.px(3, 2, f % 6 < 4 ? "q" : "r"); c.px(3, 3, "6")
}, glow("q", { r: 2, strength: 0.6 }))
})()

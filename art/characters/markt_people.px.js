// The Drain Market's people seen straight down (way A, as Juno from above: art/characters/juno_top.px.js; docs/kapitel1-design.md §9).
// Painted on the lines of the approved blocks (art/test/markt_figuren_blocks.px.js, 2026-11-11): every silhouette is theirs, drawn
// from the same parts at the same sizes; the painting adds the light, the materials and what moves. Every figure is drawn once in its
// own frame (f forward, s to its left) and turned onto the screen for down, up, right and left, so the four are one figure and left is
// a real one; the light (from the top left and above) is laid on after the turn, from each part's own round form, so it stays where
// the room's is. Ink outline #0c0e1a round the whole figure, as the blocks'.
//
//   ratz_top_idle_<dir>          31x31, 6 frames [220, 160, 220, 160, 220, 160]: the nose twitching, the plug swinging, an ear flicking;
//                                the collar dim
//   ratz_top_talk_<dir>          31x31, 4 frames x 150 ms: the collar bright and its light on the parka, the snout opening and shutting
//   prediger_top_idle_<dir>      27x27, 8 frames [900, 700, 900, 700, 100, 220, 100, 900]: he stares (the pupils move, the eyes' catch
//                                lights shimmer), then the tongue goes up over one eye and it shines wet after
//   prediger_top_talk_<dir>      27x27, 2 frames x 200 ms: the flasks raised forward and out, the head jerking forward on the second
//   haendler_top_<n>_idle_<dir>  21x21, 4 frames [600, 500, 700, 1400]: hands working at the counter in front, then a look up;
//                                n = 1 the apron (an LED on its pocket), 2 the cap with a visor (its edge cyan), 3 the hood (a phone's light)
//   haendler_top_<n>_talk_<dir>  21x21, 2 frames x 200 ms: a hand out, a nod
//   statist_<nn>_idle_<dir>      21x21 (23x23 with the umbrella), 4 frames, each look its own durations so a crowd never moves in step:
//                                still, a look to its left, a shrug, a look to its right
//   statist_<nn>_walk_<dir>      21x21 (23x23 with the umbrella), 8 frames x 100 ms, the blocks' step
//                                nn = 01..16, the looks in LOOKS below (a body, a coat, hair or a hood, a thing carried, a glowing thing)
//   pike_top_idle_<dir>          31x31, 8 frames: still as a heron, his neck jerking once toward something that moves
//   pike_top_talk_<dir>          31x31, 2 frames x 200 ms: the beak opening;  pike_top_punt_<dir>  31x31, 4 frames: punting
// <dir>: down, up, right, left. The ground point is in the exact middle of every frame (10,10 / 11,11 / 13,13 / 15,15): the game
// anchors each at its centre. Bigger canvases only where a thing reaches out: Ratz's tail and plug, the preacher's flasks, an umbrella.
// About 13 px across an ordinary pair of shoulders, as Juno: the market is drawn at ~40 px a metre.
// The preacher's counter of days is not shown from above (the user, 2026-11-11): the days come from what he says.
;(() => {

pal({
  k: "#0c0e1a",                                                       // ink
  1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  c: "#123c4e", C: "#1f88a4", v: "#62def0", V: "#dafcff",             // technology
  m: "#a8238a", M: "#ff4fd3",                                         // magenta LEDs
})

const INK = "#0c0e1a"
const TURN = { down: (f, s) => [s, f], up: (f, s) => [-s, -f], right: (f, s) => [f, -s], left: (f, s) => [-f, s] }
const DIRS = ["down", "up", "right", "left"]
const STEP = [5, 3, 0, -3, -5, -3, 0, 3], ARM = [-2, -1, 0, 1, 2, 1, 0, -1]

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
/** a tone between two (for a coat's ramp from the blocks' two tones) */
const mix = (a, b, t) => "#" + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, "0")).join("")

// ---------------------------------------------------------------- the parts, the turn, the light
/** a figure's parts in its own frame, turned: each pixel keeps its part, its height (z: what lies over what) and its form's normal */
const fig = (dir) => {
  const m = new Map(), T = TURN[dir]
  const put = (f, s, p, z, nx = 0, ny = 0, flat = false) => {
    const F = Math.round(f), S = Math.round(s), [x, y] = T(F, S)
    m.set(x + "," + y, { p, z, nx, ny, flat, f: F, s: S, x, y })
  }
  const ell = (cf, cs, rf, rs, p, z) => {
    for (let f = Math.floor(cf - rf - 1); f <= Math.ceil(cf + rf + 1); f++) for (let s = Math.floor(cs - rs - 1); s <= Math.ceil(cs + rs + 1); s++) {
      const a = (f - cf) / (rf + 0.5), b = (s - cs) / (rs + 0.5)
      if (a * a + b * b <= 1) { const [nx, ny] = T(a, b); put(f, s, p, z, nx, ny) }
    }
  }
  const line = (f0, s0, f1, s1, p, z) => {
    const n = Math.max(Math.abs(f1 - f0), Math.abs(s1 - s0), 1)
    for (let j = 0; j <= n; j++) put(f0 + (f1 - f0) * j / n, s0 + (s1 - s0) * j / n, p, z, 0, 0, true)
  }
  const at = (x, y) => m.get(x + "," + y)
  return { m, put, ell, line, at, T }
}
/** how much light a pixel of a round part takes: lit toward the top left, dark toward the bottom right, a soft top */
const lv = (e) => { const nz = Math.sqrt(Math.max(0, 1 - e.nx * e.nx - e.ny * e.ny)); return (-e.nx - e.ny) * 0.62 + nz * 0.22 }
/** a part's tone on its ramp [dark, mid, lit, (bright)]: by its form, a step down where something higher lies to its top left (its shadow) */
const tone = (F, e, ramp, o = {}) => {
  const v = lv(e)
  let i = v > (o.hi ?? 9) && ramp[3] ? 3 : v > (o.lit ?? 0.5) ? 2 : v > (o.dark ?? -0.3) ? 1 : 0
  if (e.flat) i = 1
  const over = [[-1, 0], [0, -1], [-1, -1]].some(([dx, dy]) => { const n = F.at(e.x + dx, e.y + dy); return n && n.z > e.z })
  if (over && !o.noShadow) i = Math.max(0, Math.min(i, 2) - 1)
  return ramp[i]
}
/** lay the figure down on a canvas of half-size N: paint(e) says each pixel's colour (or null: leave it), then the ink outline */
const lay = (c, F, N, paint) => {
  for (const e of F.m.values()) { const k = paint(e); if (k) c.px(N + e.x, N + e.y, k) }
  for (const e of F.m.values()) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!F.at(e.x + dx, e.y + dy)) c.px(N + e.x + dx, N + e.y + dy, INK)
}

// shared materials
const BOOTS = ["#131a2a", "#232f47", "#2f3e5a", "#41547a"]
const SKIN = { warm: ["#93583f", "#b8765a", "#d79676"], dark: ["#5c3426", "#7a4a34", "#9c6a4e"], pale: ["#b0806a", "#d0a088", "#ecc4a8"] }
const coatRamp = ([mid, lit]) => [mix(mid, INK, 0.42), mid, mix(mid, lit, 0.7), lit]
const HAIRLIT = { "#0c0e1a": "#2f3e5a", "#131a2a": "#41547a", "#2e2019": "#74513a", "#4e3526": "#9c7048", "#93583f": "#d79676", "#7d8ca4": "#b9c6d8", "#74513a": "#9c7048" }
// very dark hair is lifted a little so a head never reads as a hole in the ink outline
const hairRamp = (h) => { const L = HAIRLIT[h] ?? "#41547a"; return [mix(h, INK, 0.3), mix(h, L, 0.3), mix(h, L, 0.7), L] }
const hoodRamp = (h) => [mix(h, INK, 0.35), mix(h, "#8e96a8", 0.12), mix(h, "#b9c6d8", 0.3), mix(h, "#e8ecf2", 0.42)]

// ---------------------------------------------------------------- the crowd and the vendors (the blocks' person())
const BODY = { ordinary: [3, 5.4], broad: [3.4, 6.4], thin: [2.6, 4.6], child: [2.2, 3.8] }
/**
 * one of the market's people in its own frame. o: body, coat [mid, lit], hair, hood, skin, carry, glow, apron, cap; the pose:
 * foot (the left boot forward), al / ar (each arm forward), look (-1, 0, 1), up (looking up), nod, shrug, blink (the glow's on)
 */
const person = (c, N, dir, o, P, t) => {
  const F = fig(dir), [rf, rs] = BODY[o.body ?? "ordinary"], stand = P.walk ? 0 : 1, shr = P.shrug ? 0.6 : 0
  F.ell(P.foot + stand, 2 * rs / 5.4, 1.5, 0.9, "boot", 0); F.ell(-P.foot + stand, -2 * rs / 5.4, 1.5, 0.9, "boot", 0)
  if (o.carry === "backpack") F.ell(-rf - 1, 0, 2, rs * 0.6, "pack", 2)
  F.ell(0, 0, rf, rs + shr, "body", 1)
  if (o.apron) F.ell(1, 0, rf - 1, rs - 2, "apron", 1)
  F.ell(P.al, rs + 0.6, 1.5, 0.8, "arm", 1.5); F.ell(P.ar, -rs - 0.6, 1.5, 0.8, "arm", 1.5)
  if (P.al >= 1) F.put(P.al + 2, rs + 0.6, "hand", 1.5)
  if (P.ar >= 1) F.put(P.ar + 2, -rs - 0.6, "hand", 1.5)
  if (o.carry === "bowl") {
    F.ell(rf + 1, 0, 1.2, 1.6, "bowl", 2); F.put(rf + 1, 0, "soup", 2)
    F.put(rf + 2, 1, "hand", 2); F.put(rf + 2, -1, "hand", 2)
  }
  if (o.carry === "crate") for (let f = -3; f <= 2; f++) for (let s = rs - 2; s <= rs + 3; s++) F.put(f, s, "crate", 4)
  const hr = o.body === "child" ? 1.6 : 2.2, hf = P.nod ?? 0
  if (o.hood || o.cap) F.ell(-0.4 + hf, 0, hr + 0.4, hr + 0.4, o.cap ? "cap" : "hood", 3)
  else F.ell(-0.2 + hf, 0, hr, hr, "hair", 3)
  F.put(Math.round(hr) + hf, P.look, "face", 3)
  if (P.up) { F.put(Math.round(hr) + hf, P.look - 1, "face", 3); F.put(Math.round(hr) + hf, P.look + 1, "face", 3) }

  const coat = coatRamp(o.coat), skin = SKIN[o.skin ?? "warm"]
  const glowOn = P.blink !== false
  const paint = (e) => {
    const { p, f, s } = e
    if (p === "boot") {
      if (o.glow === "shoes" && f === Math.round(P.foot + stand + (s > 0 ? 0 : -2 * P.foot)) + 1 && glowOn) return s > 0 ? "#62def0" : "#ff4fd3"
      return tone(F, e, BOOTS, { lit: 0.35 })
    }
    if (p === "body" || p === "arm") {
      // LED trim along the shoulders' front edge: a thin lit seam where the coat turns down
      if (p === "body" && o.glow === "trim" && f === Math.round(rf) - 1 && Math.abs(s) >= 2 && Math.abs(s) <= Math.round(rs) - 1) return glowOn || Math.abs(s) % 2 ? o.trim ?? "#62def0" : "#1f88a4"
      // the phone in the hand at the arm's front, its light
      if (p === "arm" && o.glow === "phone" && s === Math.round(rs + 0.6) && f === Math.round(P.al + 1)) return glowOn ? "#dafcff" : "#62def0"
      return tone(F, e, coat)
    }
    if (p === "apron") {
      if (f === 3 && s === 2) return glowOn ? "#62def0" : "#123c4e"                                      // the pocket's LED
      if (f === 3 && s === 1) return "#565e70"                                                          // the pocket's seam
      return tone(F, e, ["#565e70", "#7a8296", "#a2aabb", "#c8d0dc"], { noShadow: false })
    }
    if (p === "hand") return skin[1]
    if (p === "pack") {
      if (f === Math.round(-rf - 2) && s === 0) return glowOn ? o.led ?? "#62def0" : "#123c4e"           // the bag's LED, on its top flap
      if (f === Math.round(-rf - 1) + 1) return "#232f47"                                               // the flap's edge
      return tone(F, e, ["#232f47", "#41547a", "#617aa0", "#8e9ab0"])
    }
    if (p === "bowl") return tone(F, e, ["#8e96a8", "#b9c6d8", "#e8ecf2"], { lit: 0.3, noShadow: true })
    if (p === "soup") return "#eea040"
    if (p === "crate") {
      // a plastic crate seen into from above: its rim lit on the top and left, its floor in slats
      const edge = f === -3 || f === 2 || s === Math.round(rs - 2) || s === Math.round(rs + 3)
      if (edge) { const lt = !F.at(e.x - 1, e.y) || !F.at(e.x, e.y - 1) || F.at(e.x - 1, e.y)?.p !== "crate" || F.at(e.x, e.y - 1)?.p !== "crate"; return lt ? "#9c7048" : "#74513a" }
      if (f === -1 && s === Math.round(rs)) return o.glow === "crate" && glowOn ? "#62def0" : (f + s) % 2 ? "#4e3526" : "#2e2019"   // a tracker tag on the slats
      return (f % 2 === 0) ? "#4e3526" : "#2e2019"
    }
    if (p === "hair") {
      if (o.glow === "implant" && f === 0 && s === -Math.round(hr) && glowOn) return "#62def0"            // behind the right ear
      return tone(F, e, hairRamp(o.hair), { lit: 0.25, hi: 0.7 })
    }
    if (p === "hood") {
      if (f <= -2 && s === 0) return hoodRamp(o.hood)[0]                                                // the hood's back seam
      if (o.glow === "hoodled" && f === Math.round(hr) - 1 && Math.abs(s) === Math.round(hr)) return glowOn ? "#62def0" : "#1f88a4"
      return tone(F, e, hoodRamp(o.hood), { lit: 0.25, hi: 0.7 })
    }
    if (p === "cap") {
      if (f >= Math.round(hr)) return Math.abs(s) <= 1 && f === Math.round(hr) ? (glowOn ? "#62def0" : "#1f88a4") : "#0c0e1a"   // the visor's edge
      if (f === Math.round(hr) - 1) return "#131a2a"                                                     // the visor under it
      return tone(F, e, ["#1a2337", "#2f3e5a", "#41547a", "#617aa0"], { lit: 0.25, hi: 0.7 })
    }
    if (p === "face") {
      if (o.cap && !P.up) return "#0c0e1a"                                                             // under the visor
      if (o.hood) return o.glow === "phone" && glowOn ? mix(skin[1], "#62def0", 0.45) : P.up ? skin[1] : "#131a2a"
      return P.up ? skin[2] : skin[1]
    }
    return "#ff00ff"
  }
  lay(c, F, N, paint)
  // the bowl's steam: two wisps rising off it toward us, drifting
  if (o.carry === "bowl") {
    const [bx, by] = F.T(rf + 1, 0), d = [[0, 0], [-1, -1], [0, -1], [1, -1]][t % 4]
    c.px(N + bx + d[0], N + by + d[1] - 1, "#b9c6d8")
    if (t % 2 === 0) c.px(N + bx - d[1], N + by + d[0], "#8e96a8")
  }
  if (o.carry === "umbrella") umbrella(c, N, o, t)
}
/** the umbrella over the figure, not turned (it is round): fabric panels in the coat's tones, the ribs, the tip; an LED rim running */
const umbrella = (c, N, o, t) => {
  const r = 9, ramp = coatRamp(o.coat), cx = N, cy = N - 2
  for (let yy = -r; yy <= r; yy++) for (let xx = -r; xx <= r; xx++) {
    const d = Math.hypot(xx, yy)
    if (d > r + 0.5) continue
    const a = Math.atan2(yy, xx), seg = ((a * 16 / Math.PI) | 0) + 32
    let k
    if (d > r - 0.6) k = (seg + t * 2) % 8 < 2 ? "#dafcff" : seg % 2 ? "#62def0" : "#1f88a4"
    else if (xx === 0 || yy === 0 || Math.abs(xx) === Math.abs(yy)) k = d < 2 ? ramp[1] : "#1a2337"
    else {
      // each panel a shallow curve: lit toward the top left, darker toward the bottom right, a band at its outer edge
      const l = -(xx + yy) / (r * 1.41)
      k = l > 0.35 ? ramp[2] : l > -0.3 ? ramp[1] : ramp[0]
      if (d > r - 2 && l > -0.3 && l <= 0.35) k = mix(ramp[1], ramp[0], 0.5)
    }
    c.px(cx + xx, cy + yy, k)
  }
  c.px(cx - 4, cy - 5, ramp[3]); c.px(cx - 5, cy - 4, ramp[2])                                         // the wet shine
  c.px(cx, cy, "#8e96a8"); c.px(cx - 1, cy - 1, "#d0d4da")                                             // the tip
}

const idlePose = (i) => ({ foot: 0, al: 0, ar: 0, look: i === 1 ? 1 : i === 3 ? -1 : 0, shrug: i === 2, blink: i !== 2 })
const walkPose = (i, rf) => ({ walk: true, foot: STEP[i] * rf / 3, al: ARM[i], ar: -ARM[i], look: 0, blink: i % 4 !== 3 })   // a longer step for a longer body

// the crowd's sixteen looks: the blocks' coats and hair, a body, a thing carried, a glowing thing each (never Juno's yellow)
const COATS = [["#232f47", "#2f3e5a"], ["#30264c", "#4d3f78"], ["#552b1c", "#b0602a"], ["#203c36", "#30594b"], ["#3e1240", "#a8238a"],
  ["#4e3526", "#74513a"], ["#2e1220", "#73304a"], ["#41547a", "#617aa0"], ["#7a3e22", "#b0602a"], ["#b9c6d8", "#e8ecf2"]]
const LOOKS = [
  { body: "ordinary", coat: COATS[0], hair: "#0c0e1a", glow: "implant", ms: [1600, 700, 900, 700] },
  { body: "ordinary", coat: COATS[3], hair: "#93583f", skin: "pale", glow: "phone", ms: [1300, 800, 1100, 600] },
  { body: "broad", coat: COATS[5], hair: "#131a2a", skin: "dark", carry: "backpack", glow: "pack", ms: [1900, 600, 800, 800] },
  { body: "thin", coat: COATS[4], hair: "#0c0e1a", glow: "trim", trim: "#62def0", ms: [1500, 900, 700, 900] },
  { body: "child", coat: COATS[7], hair: "#2e2019", glow: "shoes", ms: [1100, 600, 1000, 700] },
  { body: "ordinary", coat: COATS[1], hood: COATS[0][0], carry: "umbrella", glow: "umbrella", ms: [1700, 800, 900, 600] },
  { body: "ordinary", coat: COATS[6], hair: "#4e3526", carry: "bowl", glow: "implant", ms: [1400, 700, 1200, 800] },
  { body: "broad", coat: COATS[8], hair: "#7d8ca4", skin: "pale", carry: "crate", glow: "crate", ms: [2000, 900, 700, 900] },
  { body: "thin", coat: COATS[9], hair: "#131a2a", skin: "dark", glow: "trim", trim: "#ff4fd3", ms: [1200, 700, 900, 1000] },
  { body: "ordinary", coat: COATS[2], hood: COATS[3][0], carry: "backpack", glow: "pack", led: "#ff4fd3", ms: [1800, 600, 1000, 700] },
  { body: "child", coat: COATS[4], hood: COATS[7][0], glow: "phone", ms: [1000, 800, 800, 600] },
  { body: "thin", coat: COATS[3], hood: COATS[1][0], carry: "umbrella", glow: "umbrella", ms: [1600, 900, 800, 800] },
  { body: "broad", coat: COATS[0], hair: "#2e2019", skin: "dark", glow: "phone", ms: [1300, 700, 1300, 700] },
  { body: "ordinary", coat: COATS[8], hair: "#0c0e1a", carry: "crate", glow: "trim", trim: "#62def0", ms: [1700, 600, 900, 900] },
  { body: "ordinary", coat: COATS[5], hood: COATS[6][0], carry: "bowl", glow: "hoodled", ms: [1500, 800, 700, 800] },
  { body: "thin", coat: COATS[1], hair: "#93583f", skin: "pale", carry: "backpack", glow: "pack", led: "#ff4fd3", ms: [1900, 700, 800, 600] },
]
LOOKS.forEach((L, j) => {
  const nn = String(j + 1).padStart(2, "0"), W = L.carry === "umbrella" ? 23 : 21, N = (W - 1) / 2
  for (const dir of DIRS) {
    anim(`statist_${nn}_idle_${dir}`, { w: W, h: W, frames: 4, ms: L.ms }, (c) => person(c, N, dir, L, idlePose(c.frame), c.frame))
    anim(`statist_${nn}_walk_${dir}`, { w: W, h: W, frames: 8, ms: 100 }, (c) => person(c, N, dir, L, walkPose(c.frame, BODY[L.body][0]), c.frame))
  }
})

// the vendors behind their counters (the counter in front of them): the blocks' three, each with its glowing thing
const VEND = [
  { coat: ["#41547a", "#617aa0"], hair: "#131a2a", apron: true },
  { coat: ["#552b1c", "#b0602a"], hair: "#0c0e1a", cap: true, skin: "dark" },
  { coat: ["#203c36", "#30594b"], hood: "#2e1220", glow: "phone", skin: "pale" },
]
// working: one hand, the other, both at the counter; then a look up over it
const VWORK = [{ al: 1, ar: 0 }, { al: 0, ar: 1 }, { al: 1, ar: 1 }, { al: 0, ar: 0, up: true }]
VEND.forEach((V, j) => {
  for (const dir of DIRS) {
    anim(`haendler_top_${j + 1}_idle_${dir}`, { w: 21, h: 21, frames: 4, ms: [600, 500, 700, 1400] },
      (c) => person(c, 10, dir, V, { foot: 0, look: 0, blink: c.frame !== 1, ...VWORK[c.frame] }, c.frame))
    anim(`haendler_top_${j + 1}_talk_${dir}`, { w: 21, h: 21, frames: 2, ms: 200 },
      (c) => person(c, 10, dir, V, { foot: 0, look: 0, al: 0, ar: c.frame === 0 ? 2 : 0, nod: c.frame, up: c.frame === 0 }, c.frame))
  }
})

// ---------------------------------------------------------------- Ratz (#90d0a0) on his crate (the blocks' ratz())
const RZ = {
  parka: ["#485028", "#6a7440", "#7e8a4e", "#94a060"], hood: ["#5a6234", "#7e8a4e", "#94a060", "#aab878"], deep: "#363c1e",
  fur: ["#5e5e66", "#8a8a92", "#a8a8b0"], pink: ["#a06a72", "#c88890", "#e8a8b0"], plug: ["#6c7888", "#9aa0a8", "#d0d4da"],
  phones: "#2a2a30", collar: "#90d0a0", collarOn: "#d8ffe0", spill: "#a6c87a", tail: ["#7a4a52", "#a06a72"],
}
const NOSE = [0, 0, 1, 0, 1, 0], SWING = [0, 1, 2, 1, 0, -1]
const ratz = (c, dir, o) => {
  const F = fig(dir), i = o.idle ?? 0, talk = o.talk !== undefined, open = talk && o.talk % 2 === 0
  const sw = SWING[i % 6]
  F.line(-5, 0, -9, 3 + sw, "tail", 0); F.line(-9, 3 + sw, -12, 2 + sw, "tail", 0)
  F.ell(-13, 2 + sw, 1, 1, "plug", 0); F.put(-14, 2 + sw, "prong", 0)
  F.ell(-1, 0, 5, 5.5, "parka", 1)
  F.ell(-2, 0, 4.2, 4.2, "rim", 2)
  F.ell(-2, 0, 3.4, 3.4, "hood", 3)
  F.ell(-3, 3, 1, 1, "earL", 4); F.ell(-3, -3, 1, 1, "earR", 4)
  const n = NOSE[i % 6]
  F.ell(2 + n, 0, 1.6, 1.4, "fur", 4); F.put(4 + n, 0, "nose", 4)
  if (open) F.put(3 + n, 1, "mouth", 4)
  F.line(0, -3, 0, 3, "collar", 3.5); F.put(0, -4, "phone", 3.5); F.put(0, 4, "phone", 3.5)
  const flick = !talk && i === 3
  const paint = (e) => {
    const { p, f, s } = e
    if (p === "tail") return (Math.abs(f) + Math.abs(s)) % 3 === 0 ? RZ.tail[0] : RZ.tail[1]                // its rings
    if (p === "plug") return tone(F, e, ["#3c3c44", "#6c7888", "#9aa0a8"], { lit: 0.3 })
    if (p === "prong") return "#d0d4da"                                                                  // its pins
    if (p === "parka") {
      if (talk && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => F.at(e.x + a, e.y + b)?.p === "collar")) return RZ.spill
      if (f === -5 && s >= -1 && s <= 0) return RZ.deep                                                 // a patch on its back, stitched
      if (f === -4 && s === -1) return RZ.parka[0]
      if (s === 0 && f >= 2) return RZ.parka[1]                                                          // the zip
      return tone(F, e, RZ.parka)
    }
    if (p === "rim") return lv(e) > 0.3 ? RZ.parka[1] : lv(e) > -0.3 ? RZ.parka[0] : RZ.deep           // where the hood meets the shoulders
    if (p === "hood") {
      if (f >= 1) return RZ.phones                                                                       // the hood's opening, dark round his face
      if (f <= -4 && s === 0) return RZ.hood[0]                                                          // its seam
      return tone(F, e, RZ.hood, { lit: 0.2, hi: 0.7, noShadow: true })
    }
    if (p === "earL" || p === "earR") {
      // through the holes: the outer ear lit, its hollow darker; one flicks (folds back, its hollow gone)
      const ec = { earL: [-3, 3], earR: [-3, -3] }[p], df = f - ec[0], ds = s - ec[1]
      if (flick && p === "earL") return df < 0 ? RZ.pink[0] : RZ.pink[2]
      if (df === 0 && ds === 0) return RZ.pink[0]
      return tone(F, e, RZ.pink, { lit: 0.2, dark: -0.6, noShadow: true })
    }
    if (p === "fur") return f === 1 + n ? RZ.fur[0] : tone(F, e, RZ.fur, { lit: 0.25, noShadow: true })   // grey, darker where it comes out of the hood
    if (p === "nose") return RZ.pink[2]
    if (p === "mouth") return "#2a2a30"
    if (p === "collar") return talk ? (Math.abs(s) === 2 ? "#90d0a0" : RZ.collarOn) : (s === 1 || s === -2 ? "#5a8a68" : RZ.collar)   // patched
    if (p === "phone") return lv(e) >= 0 ? "#3c3c44" : RZ.phones
    return "#ff00ff"
  }
  lay(c, F, 15, paint)
}
for (const dir of DIRS) {
  anim(`ratz_top_idle_${dir}`, { w: 31, h: 31, frames: 6, ms: [220, 160, 220, 160, 220, 160] }, (c) => ratz(c, dir, { idle: c.frame }))
  anim(`ratz_top_talk_${dir}`, { w: 31, h: 31, frames: 4, ms: 150 }, (c) => ratz(c, dir, { talk: c.frame, idle: 0 }))
}

// ---------------------------------------------------------------- the preacher (#d8c8a0), a gecko, on his crate (the blocks' prediger())
const PR = {
  coat: ["#7e7050", "#a69670", "#c8b88e", "#e0d2ac"], skin: ["#4a4426", "#6a6034", "#8a7e48", "#a89a5e"],
  crest: ["#8a4a22", "#d07a34"], flask: ["#6c7888", "#a8b4c4", "#d0d8e4"], eye: ["#b0602a", "#eea040", "#ffd58a", "#fff4d8"],
  tongue: ["#a84e6c", "#e888a8"],
}
const LICK = [0, 0, 0, 0, 1, 2, 1, 0], GAZE = [0, 1, 0, -1, 0, 0, 0, 0]
const prediger = (c, dir, o) => {
  const F = fig(dir), talk = o.talk !== undefined, lick = talk ? 0 : LICK[o.idle], jerk = talk && o.talk === 1 ? 1 : 0
  const out = talk ? 10 : 9, fw = talk ? 2 : 0
  F.line(0, 5, fw, out - 1, "sleeve", 1); F.line(0, -5, fw, -out + 1, "sleeve", 1)
  for (const s of [out, -out]) { F.ell(fw, s, 1.6, 1.6, "flask", 2); F.put(fw, s, "cap", 2) }
  F.ell(0, 0, 3, 5, "coat", 1)
  F.ell(0.5 + jerk, 0, 2.8, 2.8, "head", 3)
  F.line(-3 + jerk, 0, 1 + jerk, 0, "crest", 3.5)
  for (const s of [2.4, -2.4]) F.ell(2.4 + jerk, s, 1.4, 1.4, s > 0 ? "eyeL" : "eyeR", 4)
  if (lick) F.line(4, 0, 4, lick + 1, "tongue", 5)
  if (lick === 2) F.put(3, 3, "tongue", 5)                                                                // the tip up over his left eye
  if (talk && jerk) F.put(3 + jerk, 0, "mouth", 3)
  const gaze = talk ? 0 : GAZE[o.idle], wet = !talk && o.idle === 7
  // the hand: the sleeve's last pixel before the flask
  for (const e of F.m.values()) if (e.p === "sleeve" && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => F.at(e.x + a, e.y + b)?.p === "flask")) e.p = "hand"
  const paint = (e) => {
    const { p, f, s } = e
    if (p === "sleeve") return F.at(e.x, e.y - 1) ? PR.coat[1] : PR.coat[2]
    if (p === "hand") return PR.skin[2]
    if (p === "flask") return tone(F, e, PR.flask, { lit: 0.25, noShadow: true })
    if (p === "cap") return PR.eye[1]
    if (p === "coat") {
      if (f <= -2 && s === 0) return PR.coat[0]                                                         // the back seam
      return tone(F, e, PR.coat, { hi: 0.75 })
    }
    if (p === "head") {
      const k = tone(F, e, PR.skin, { hi: 0.7, noShadow: true })
      return (f * 3 + s * 5) % 4 === 0 && k !== PR.skin[3] ? PR.skin[Math.max(0, PR.skin.indexOf(k) - 1)] : k   // his scales
    }
    if (p === "crest") return (f + jerk) % 2 ? PR.crest[0] : PR.crest[1]                                 // its flaps
    if (p === "eyeL" || p === "eyeR") {
      // lidless, bulging: amber, its catch light to the top left (it shines: his glowing thing), a slit pupil that hardly moves
      // (a rounded 4x4: its middle four hold the pupil, a column of two in the screen, moved by the gaze)
      const d = e.nx + e.ny, mid = Math.abs(e.nx) < 0.4 && Math.abs(e.ny) < 0.4
      if (mid && (gaze > 0 ? e.nx < 0 : gaze < 0 ? e.nx > 0 : e.nx > 0)) return "#552b1c"
      if (d < -0.95) return PR.eye[3]
      if (wet && p === "eyeL" && d < -0.5) return PR.eye[3]
      if (d > 0.6) return PR.eye[0]
      return d < -0.3 ? PR.eye[2] : PR.eye[1]
    }
    if (p === "tongue") return e.f === 3 ? PR.tongue[1] : (Math.abs(s) >= lick + 1 ? PR.tongue[0] : PR.tongue[1])
    if (p === "mouth") return "#3a1a1c"
    return "#ff00ff"
  }
  lay(c, F, 13, paint)
}
for (const dir of DIRS) {
  anim(`prediger_top_idle_${dir}`, { w: 27, h: 27, frames: 8, ms: [900, 700, 900, 700, 100, 220, 100, 900] }, (c) => prediger(c, dir, { idle: c.frame }))
  anim(`prediger_top_talk_${dir}`, { w: 27, h: 27, frames: 2, ms: 200 }, (c) => prediger(c, dir, { talk: c.frame }))
}

// ---------------------------------------------------------------- Pike (Chapter 2), on his raft DATA 1C/GB at the canal
// Painted on the lines of the block the user approved (2026-11-16: art/test/pike_top_blocks.px.js): made over with the heron, as on the
// ride (art/rooms/sumpf.px.js). His coat folded like grey wings, the folds over his back, black at the shoulders; the long white neck
// forward with its black stroke down the front; the small white head, the black streak from the eye into the crest that hangs back over
// his neck; the long orange-yellow beak, paler along its edge. His punting pole, the raft's wood: standing it leans on his right shoulder,
// punting he pushes it back along the raft. Idle: he waits, still as a heron, and now and then his neck jerks toward something that
// moves and comes back (he acts as if nothing had happened); talking: the beak opens. Punting: the pole planted forward, pushed back,
// lifted (4 frames), the walk while the raft leaves the market.
const PK = {
  coat: ["#4a515e", "#6c7484", "#8e96a8", "#b9c0cc"], wing: ["#3a404c", "#565e6c", "#7a8292", "#9aa2b2"],
  black: ["#0c0e1a", "#1a2337", "#2f3e5a", "#41547a"], white: ["#8e96a8", "#c8ced8", "#e6eaf0", "#ffffff"],
  beak: ["#a06818", "#e0a030", "#f0c060"], pole: ["#2e2019", "#4e3526", "#74513a", "#9c7048"],
}
const pike = (c, dir, o = {}) => {
  const F = fig(dir), push = o.push ?? 0, jerk = o.jerk ?? 0, talk = !!o.talk
  const pf = [3, 1, -1, -3][push]
  F.line(pf + 2, -6, pf - 12, -7, "pole", push ? 1 : 4)
  F.ell(1, 2, 1.4, 0.8, "boot", 0); F.ell(1, -2, 1.4, 0.8, "boot", 0)
  F.ell(-3, 0, 2.6, 3.4, "wing", 1)
  F.ell(0, 0, 3, 5.2, "coat", 2); F.ell(0.5, 4.2, 1.6, 1.2, "black", 2.5); F.ell(0.5, -4.2, 1.6, 1.2, "black", 2.5)
  F.ell(1.5, 5.6, 1.4, 0.8, "coat", 2); F.ell(pf + 1, -5.6, 1.4, 0.8, "coat", 2)
  F.ell(2.5, jerk * 0.5, 1.2, 1, "neck", 3); F.put(3, Math.round(jerk * 0.5), "stroke", 3.1)
  F.ell(4.5, jerk, 1.3, 1.3, "head", 4)
  if (talk) { F.line(6, jerk, 9, jerk + 1, "beak", 5); F.line(6, jerk, 9, jerk - 1, "beak", 5) } else F.line(6, jerk, 9, jerk, "beak", 5)
  F.line(4, jerk + 1, 1, 2, "crest", 4.5); F.put(0, 2, "crest", 4.5); F.put(5, jerk + 1, "crest", 4.6)
  const paint = (e) => {
    const { p, f, s } = e
    if (p === "boot") return tone(F, e, BOOTS, { lit: 0.35 })
    if (p === "pole") return (f + s) % 5 === 0 ? PK.pole[1] : PK.pole[2]
    if (p === "wing") return f % 2 === 0 ? tone(F, e, PK.wing) : PK.wing[Math.max(0, PK.wing.indexOf(tone(F, e, PK.wing)) - 1)]   // the folds
    if (p === "coat") return tone(F, e, PK.coat, { hi: 0.75 })
    if (p === "black") return tone(F, e, PK.black, { noShadow: true })
    if (p === "neck" || p === "head") return tone(F, e, PK.white, { hi: 0.6, noShadow: true })
    if (p === "stroke" || p === "crest") return PK.black[1]
    if (p === "beak") return e.f >= 8 ? PK.beak[2] : tone(F, e, PK.beak, { noShadow: true })
    return "#ff00ff"
  }
  lay(c, F, 15, paint)
}
const PIKE_JERK = [0, 0, 0, 0, 1, 0, 0, 0]
for (const dir of DIRS) {
  anim(`pike_top_idle_${dir}`, { w: 31, h: 31, frames: 8, ms: [900, 700, 900, 1200, 160, 260, 900, 700] }, (c) => pike(c, dir, { jerk: PIKE_JERK[c.frame] }))
  anim(`pike_top_talk_${dir}`, { w: 31, h: 31, frames: 2, ms: 200 }, (c) => pike(c, dir, { talk: c.frame === 0 }))
  anim(`pike_top_punt_${dir}`, { w: 31, h: 31, frames: 4, ms: [300, 250, 250, 300] }, (c) => pike(c, dir, { push: c.frame }))
}

})()

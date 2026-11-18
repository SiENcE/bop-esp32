// The kit pieces lerche_flur needs (art/rooms/lerche_flur.map.js), made by tools/new-room.mjs. BLOCKS for the user's approval
// (kapitel2-design §3.3 W4, §9.2): plain shapes in the landing's own colours, to be painted on their lines once approved. An older block
// than the Kessel: yellowish distemper over an olive oil-paint dado, linoleum in two tones, wooden flat doors with their number plates,
// the tube's light yellow with a green cast. Registered with ISOKIT (art/lib/isokit.js has the calls), drawn in room meters, lit by the
// bake; keys of the world palette (art/lib/iso.js) and the few below. A kit's names are global in a bake: keep this one's prefixed.
//
//   floor    q  linoleum, 50 cm tiles in two tones, worn paler on the way from the stairs to the doors
//   walls    lf_wall  olive oil paint to 1.2 m with its dark edge, yellowish distemper above, a dark skirting
//   openings lf_door (a flat's wooden door: frame, leaf, number plate, peephole, handle; op.lit: someone home, light under it;
//            op.sealed: the seal across it, CIVIC REST - SEALED, from Sunday 21:00: drawn only while LF_SEALED is set, for the
//            bake's variant), lf_meters (the electricity meters' cabinet), lf_window (the stairs' window, the street's light),
//            lf_lift (the lift, which runs: the same place on every floor; art/rooms/lerche_eg.map.js has it too)
//   props    lf_shoes (two pairs before 4C, a child's among them), lf_mat (the doormat before 4A), lf_railing (round the stairwell)
pal({ "ä": "#3f3d29", "Ä": "#5a5737", "ë": "#7a7548", "ö": "#2f3a24", "Ö": "#455534" })

/** the seal on 4B: set by art/rooms/lerche_flur.px.js for the bake's variant only */
let LF_SEALED = false

const KIT_LERCHE_FLUR = (() => {
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w, fl = Math.floor
  Object.assign(ISOKIT.TINT.warm, { "ä": ["Ä", "Ä"], "Ä": ["Ä", "ë"], "ë": ["ë", "ë"], "ö": ["ö", "Ö"], "Ö": ["Ö", "Ö"] })
  Object.assign(ISOKIT.SHADE, { "ë": "Ä", "Ä": "ä", "ä": "2", "Ö": "ö", "ö": "1" })

  // ---------------------------------------------------------------- floor and walls
  ISOKIT.floor("q", (u, v) => {
    if (near(u * 2, Math.round(u * 2), 1 / 24) || near(v * 2, Math.round(v * 2), 1 / 24)) return "f"
    const worn = v > 0.15 && v < 0.95 && u < 3.4                                          // the way along the doors
    return (fl(u * 2) + fl(v * 2)) % 2 ? (worn ? "X" : "Z") : (worn ? "Z" : "z")
  })
  ISOKIT.wall("lf_wall", (s, h) => {
    if (h < 0.08) return h >= 0.055 ? "2" : "1"
    if (h < 1.2) return near(h, 1.19, 1 / 50) ? "ö" : "Ö"
    return "ä"
  })

  // ---------------------------------------------------------------- doors
  ISOKIT.opening("lf_door", {
    pad: [0.08, 0, 0.08, 0.08],
    pass: (s, h) => h < 0.025,
    paint(s, h, o) {
      const { a, e, aw, ah } = o, op = o.op ?? {}
      // the seal: a paper strip from frame to frame across the leaf, at the lock's height, the agency's red band on it
      if (op.sealed && LF_SEALED && a >= -2 && a <= aw + 1) {
        const mid = fl(ah * 0.5) + fl((a - aw / 2) * 0.35)
        if (e >= mid - 2 && e <= mid + 2) return e === mid - 2 || e === mid + 2 ? "h" : (a > aw * 0.25 && a < aw * 0.75 && e === mid ? "r" : "H")
      }
      if (a < 0 || a >= aw || e >= ah) {
        if (a < -2 || a > aw + 1 || e > ah + 1) return null
        return a === -2 || a === aw + 1 || e === ah + 1 ? "3" : "4"                     // the frame
      }
      if (e === 0) return op.lit ? "!Q" : "1"                                           // the gap: light under it if someone's home
      if (a === 0 || a === aw - 1 || e === ah - 1) return "a"
      if (a >= 3 && a <= 4 && e >= fl(ah * 0.45) && e <= fl(ah * 0.45) + 1) return "G"  // the handle
      if (a === 4 && e === fl(ah * 0.45) + 4) return "1"                                // the lock
      if (op.sealed && LF_SEALED && a >= 2 && a <= 6 && e >= fl(ah * 0.45) + 2 && e <= fl(ah * 0.45) + 6) return (a + e) % 2 ? "P" : "O"   // broken out
      if (a === fl(aw / 2) && e === fl(ah * 0.78)) return "1"                           // the peephole
      if (a >= fl(aw / 2) - 3 && a <= fl(aw / 2) + 3 && e >= fl(ah * 0.86) && e <= fl(ah * 0.86) + 3) return "H"   // the number plate
      return near(a % 6, 0, 0.5) ? "O" : "A"                                            // the veneer's grain
    },
  })
  // the electricity meters: a grey steel cabinet, a slot of glass over the dials
  ISOKIT.opening("lf_meters", {
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a < 0 || a >= aw || e < 0 || e >= ah) return null
      if (a === 0 || e === 0 || a === aw - 1 || e === ah - 1) return "4"
      if (e > ah * 0.55 && e < ah * 0.75 && a > 2 && a < aw - 3) return a % 5 === 0 ? "3" : "h"
      return a === fl(aw / 2) ? "4" : "5"
    },
  })
  // the stairs' window: a steel frame, the night outside, the windows across the street lit here and there, rain on the glass
  ISOKIT.opening("lf_window", {
    pad: [0.06, 0.1, 0.06, 0.06],
    pass: () => true,
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (e < 0) return e >= -2 && a >= -3 && a < aw + 3 ? (e === -1 ? "5" : "4") : null  // the sill
      if (a < -1 || a > aw || e > ah) return null
      if (a < 0 || a >= aw || e >= ah || a === fl(aw / 2)) return "4"
      if ((a * 7 + e * 3) % 37 === 0) return "!h"                                      // drops
      const col = fl(a / 5), row = fl(e / 6)
      if (a % 5 && e % 6 > 1 && ISO.ihash(col, row) < 0.22) return ISO.ihash(row, col) < 0.5 ? "!Q" : "!C"
      return e < ah * 0.3 ? "!2" : "!1"
    },
  })

  // the lift: it runs (unlike the Kessel's), on every floor at the same place of the right back wall (u 1.25 to 1.95): old brown-painted
  // steel doors, the floor display over them lit amber with the floor's own number (op.floor), the call button lit beside the frame
  ISOKIT.opening("lf_lift", {
    pad: [0.08, 0, 0.16, 0.3],
    paint(s, h, o) {
      const { a, e, aw, ah } = o, mid = fl(aw / 2)
      if (e >= ah + 2) {
        if (e >= ah + 3 && e <= ah + 8 && a >= mid - 4 && a <= mid + 3) {
          if (e === ah + 3 || e === ah + 8 || a === mid - 4 || a === mid + 3) return "4"
          return a >= mid - 1 && a <= mid && e >= ah + 4 && e <= ah + 7 ? "!Q" : "k"   // the floor's number (a block for now)
        }
        return null
      }
      if (a >= aw + 2) return a <= aw + 3 && e >= 30 && e <= 34 ? (a === aw + 2 && e === 32 ? "!Q" : "6") : null
      if (a < 0 || a >= aw || e >= ah) {
        if (a < -2 || a > aw + 1 || e > ah + 1) return null
        return a === -2 || a === aw + 1 || e === ah + 1 ? "3" : "5"
      }
      if (a === mid || a === mid - 1) return a === mid ? "2" : "4"                       // the seam
      if (e < 3) return "3"
      return a % 4 === 1 ? "O" : "A"                                                    // painted steel, brown, its ribs
    },
  })

  // ---------------------------------------------------------------- props
  // a railing along u or v (its foot's long side): posts every 40 cm, the handrail, a bar near the floor (round the stairwell)
  ISOKIT.prop("lf_railing", {
    footprint: () => [],
    solid: () => [],
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h, along = du > dv, L = along ? du : dv
      for (let t = 0; t <= L + 0.001; t += 0.4) pen.box(along ? u + Math.min(t, L - 0.05) : u, along ? v : v + Math.min(t, L - 0.05), 0, 0.05, 0.05, H, () => "6", () => "4", () => "5")
      pen.box(u, v, H - 0.06, along ? L : 0.06, along ? 0.06 : L, 0.06, () => "G", () => "5", () => "6")
      pen.box(u, v, 0.1, along ? L : 0.05, along ? 0.05 : L, 0.03, () => "5", () => "4", () => "4")
    },
  })
  // two pairs of shoes before 4C: a man's boots, a child's trainers
  ISOKIT.prop("lf_shoes", {
    draw(pen, p) {
      const [u, v] = p.at
      for (const [du, dv, k, l, w] of [[0, 0, "1", "2", 0.11], [0, 0.13, "1", "2", 0.11], [0.16, 0.02, "U", "x", 0.08], [0.16, 0.13, "U", "x", 0.08]]) {
        pen.box(u + du, v + dv, 0, 0.26 * (w / 0.11), w, 0.09, () => l, () => k, () => k)
      }
    },
  })
  // the doormat before 4A
  ISOKIT.prop("lf_mat", {
    footprint: () => [],
    solid: () => [],
    outline: false,
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      pen.box(u, v, 0, du, dv, 0.02, (lu, lv) => (lu < 0.04 || lv < 0.04 || lu > du - 0.04 || lv > dv - 0.04 ? "a" : "O"), () => "a", () => "a")
    },
  })

  return {}
})()

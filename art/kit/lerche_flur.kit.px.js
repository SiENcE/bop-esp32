// The kit pieces of the Wohnblock Lerche (art/rooms/lerche_flur.map.js, the 4th floor's landing; its floor, walls and lift serve the
// hall too, art/rooms/lerche_eg.map.js). PAINTED (2026-11-18) on the lines of the blocks the user approved that day: every piece keeps
// its size and place, the paint only adds what has a cause. An older block than the Kessel: yellowish distemper over an olive oil-paint
// dado, linoleum in two tones, wooden flat doors with their number plates, the tube's light yellow with a green cast. Registered with
// ISOKIT (art/lib/isokit.js has the calls), drawn in room meters, lit by the bake; keys of the world palette (art/lib/iso.js) and the few
// below. A kit's names are global in a bake: keep this one's prefixed.
//
//   floor    q  linoleum, 50 cm tiles in two tones with their marbling, worn paler on the way from the stairs to the doors, heel marks
//            on that way, the mop's grey line along the walls, a cigarette burned out on it, a tile lifting by the lift
//   walls    lf_wall  olive oil paint to 1.2 m (its glossy edge, shoes' black marks low down, bags' scrapes and chips at hip height),
//            yellowish distemper above, a dark skirting. A wall in the map says where its own marks are (`marks`): a water stain
//            from the floor above (stain: [s, width]), a crack up from the dado (crack: s), the pale ghost of a notice that hung there
//            (ghost: [s, h, width, height]), a hand's grey on the paint beside a door (hands: [s0, s1])
//   openings lf_door (a flat's wooden door: frame, veneer with its grain, the number plate (op.label), peephole, lever, lock, the kick
//            plate's dents; op.lit: someone home, light under it; op.sealed: the seal across it, CIVIC REST - SEALED, from Sunday
//            21:00: drawn only while LF_SEALED is set, for the bake's variant), lf_meters (the electricity meters' cabinet: two
//            dials behind its glass, the warning sticker, the utility's lead seal), lf_window (the stairs' window, the street's light),
//            lf_lift (the lift, which runs: the same place on every floor; its display shows the floor, op.floor, 0 as G)
include("../lib/text.js")
pal({ "ä": "#3f3d29", "Ä": "#5a5737", "ë": "#7a7548", "ö": "#2f3a24", "Ö": "#455534", "ü": "#2f2b1c" })

/** the seal on 4B: set by art/rooms/lerche_flur.px.js for the bake's variant only */
let LF_SEALED = false

const KIT_LERCHE_FLUR = (() => {
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w, fl = Math.floor, ih = ISO.ihash
  Object.assign(ISOKIT.TINT.warm, { "ä": ["Ä", "Ä"], "Ä": ["Ä", "ë"], "ë": ["ë", "ë"], "ö": ["ö", "Ö"], "Ö": ["Ö", "Ö"], "ü": ["ü", "ä"] })
  Object.assign(ISOKIT.SHADE, { "ë": "Ä", "Ä": "ä", "ä": "ü", "ü": "1", "Ö": "ö", "ö": "1" })

  // ---------------------------------------------------------------- floor
  ISOKIT.floor("q", (u, v) => {
    if (u < 0.05 || v < 0.05) return "f"                                                  // the mop's grey line along the walls
    if (near(u * 2, Math.round(u * 2), 1 / 24) || near(v * 2, Math.round(v * 2), 1 / 24)) {
      if (u > 0.5 && u < 1.0 && near(v, 3.0, 1 / 24)) return "1"                         // the tile by the lift, its edge lifting
      return "f"
    }
    const tu = fl(u * 2), tv = fl(v * 2), dark = (tu + tv) % 2 === 1
    const worn = v > 0.15 && v < 0.95 && u < 3.4                                           // the way along the doors
    const base = dark ? (worn ? "X" : "Z") : (worn ? "Z" : "z")
    if (u > 0.5 && u < 1.0 && v > 3.0 && v < 3.06) return "X"                              // ...its lit lip
    // a cigarette burned out on the way to the stairs: a dark scar, a brown ring
    const burn = Math.hypot((u - 1.32) * 1.3, v - 1.72)
    if (burn < 0.035) return "1"
    if (burn < 0.06) return "a"
    // heel marks on the way: short black arcs where people turn
    if (worn && ih(fl(u * 9), fl(v * 9)) < 0.07 && near(((u * 9) % 1) - ((v * 9) % 1) * 0.4, 0.3, 0.09)) return "f"
    // the lino's marbling: a few streaks of the other tone in each tile, all one way
    const lu = (u * 2) % 1, lv = (v * 2) % 1, k = 0.25 + ih(tu, tv) * 0.5
    if (ih(tv, tu) < 0.5 && lu > 0.12 && lu < 0.85 && near(lu * 0.45 + lv, k + 0.3, 0.025)) return dark ? (worn ? "Z" : "z") : (worn ? "X" : "Z")
    return base
  })

  // ---------------------------------------------------------------- walls
  ISOKIT.wall("lf_wall", (s, h, o) => {
    const m = o.wall?.marks ?? {}
    if (h < 0.08) return h >= 0.055 ? "2" : near(h, 0.02, 0.012) && ih(fl(s * 40), 1) < 0.3 ? "2" : "1"   // the skirting, chipped
    if (h < 1.2) {
      if (near(h, 1.19, 1 / 50)) return "ö"                                                // the dado's painted edge
      if (near(h, 1.165, 1 / 70)) return "Ä"                                               // ...and the gloss just under it
      if (m.hands && s > m.hands[0] && s < m.hands[1] && h > 0.85 && h < 1.15 && ih(fl(s * 30), fl(h * 30)) < 0.45) return "ö"   // hands, beside a door
      if (h < 0.32 && ih(fl(s * 12), fl(h * 24)) < 0.06 && near((h * 24) % 1, 0.5, 0.2)) return "1"       // shoes' black marks
      if (h > 0.75 && h < 1.05 && ih(fl(s * 7), 3) < 0.25 && near(h, 0.8 + ih(fl(s * 7), 4) * 0.2, 0.012)) return "ö"   // a bag's scrape
      if (h > 0.9 && ih(fl(s * 40), fl(h * 40)) < 0.006) return "ë"                       // chips down to the distemper
      return "Ö"
    }
    // the distemper: what the map says happened to this wall
    if (m.stain) {
      const [c, w] = m.stain, d = Math.hypot((s - c) / (w / 2), (2.6 - h) / (0.5 + 0.15 * Math.sin(s * 9)))
      if (d < 1 && d > 0.84) return "ü"                                                    // the tide line where it dried
      if (d < 0.6 && d > 0.52) return "ü"                                                  // ...and the one before it
      if (d < 0.84 && ISO.bay(fl(s * 32), fl(h * 30)) < 0.25) return "ü"                  // the wet's brown, thin
    }
    if (m.crack !== undefined && h < 2.1) {
      const x = m.crack + 0.06 * Math.sin(h * 11) + (h - 1.2) * 0.12
      if (near(s, x, 1 / 64)) return "ü"
      if (h > 1.7 && near(s, x + (h - 1.7) * 0.5, 1 / 64) && h < 1.95) return "ü"         // where it forks
    }
    if (m.ghost) {
      const [gs, gh, gw, gt] = m.ghost
      if (s > gs && s < gs + gw && h > gh && h < gh + gt) {
        if ((near(s, gs + 0.03, 1 / 64) || near(s, gs + gw - 0.03, 1 / 64)) && near(h, gh + gt - 0.03, 1 / 50)) return "1"   // the pins' holes
        return "Ä"
      }
    }
    if (h > 2.48) return "ü"                                                                 // the ceiling's grey edge
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
        if (a === -2 || a === aw + 1 || e === ah + 1) return "3"                            // the frame's outer edge
        return a === -1 && e < ah ? "5" : "4"                                               // ...its lit inner edge on the left
      }
      if (e === 0) return op.lit ? "!Q" : "1"                                               // the gap: light under it if someone's home
      if (op.sealed && LF_SEALED) {
        const le = fl(ah * 0.45)
        if (a >= 2 && a <= 6 && e >= le + 2 && e <= le + 6) return (a + e) % 2 ? "P" : "O"  // the lock broken out, splinters
      }
      o.memo.leaf ??= ISOKIT.raster(aw, ah, (c) => {
        const Y = (e) => ah - 1 - e, le = fl(ah * 0.45)
        // the veneer: its grain runs up the leaf, wandering a little; darker at the edges where hands and dust go
        for (let x = 0; x < aw; x++) for (let y = 0; y < ah; y++) {
          const g = Math.sin(x * 1.7 + Math.sin(y * 0.11 + x) * 1.4)
          c.px(x, Y(y), g > 0.82 ? "O" : "A")
        }
        c.vline(0, 0, ah, "a"); c.vline(aw - 1, 0, ah, "a"); c.hline(0, Y(ah - 1), aw, "a")
        // the kick plate, steel, dented by shoes and prams
        c.rect(2, Y(9), aw - 4, 8, "4"); c.hline(2, Y(9), aw - 4, "5")
        for (const [x, y] of [[5, 4], [6, 5], [aw - 8, 3], [12, 6]]) if (x < aw - 3) c.px(x, Y(y), "3")
        // the hands' grey round the lever, the lever, the lock under it
        for (let x = 1; x < 9; x++) for (let y = le - 5; y < le + 6; y++) if (ISO.ihash(x, y) < 0.35) c.px(x, Y(y), "O")
        c.rect(3, Y(le + 1), 2, 3, "g"); c.hline(3, Y(le + 1), 5, "G"); c.hline(3, Y(le), 5, "g")
        c.px(4, Y(le - 4), "1"); c.px(4, Y(le - 5), "g")
        // the peephole: its brass ring
        const px = fl(aw / 2), py = fl(ah * 0.78)
        c.px(px, Y(py), "1"); c.px(px - 1, Y(py), "j"); c.px(px + 1, Y(py), "j"); c.px(px, Y(py + 1), "j"); c.px(px, Y(py - 1), "j")
        // the number plate: brass, its letters set in the hud's glyphs
        const label = String(op.label ?? ""), w = Math.max(9, TXT.measure(label, "hud") + 4), x0 = fl(aw / 2 - w / 2), y0 = fl(ah * 0.88)
        c.rect(x0, Y(y0 + 6), w, 7, "j"); c.hline(x0, Y(y0 + 6), w, "y"); c.hline(x0, Y(y0), w, "O")
        if (label) TXT.draw(c, fl(aw / 2), Y(y0 + 5), label, "1", { font: "hud", align: "center" })
      }, 0, 0)
      return o.memo.leaf(a, e)
    },
  })
  // the electricity meters: a grey steel cabinet; behind its strip of glass two dials, the utility's lead seal on the catch, a yellow
  // warning sticker
  ISOKIT.opening("lf_meters", {
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (a < 0 || a >= aw || e < 0 || e >= ah) return null
      o.memo.cab ??= ISOKIT.raster(aw, ah, (c) => {
        const Y = (e) => ah - 1 - e
        c.rect(0, 0, aw, ah, "5"); c.vline(0, 0, ah, "6"); c.hline(0, 0, aw, "6"); c.vline(aw - 1, 0, ah, "3"); c.hline(0, Y(0), aw, "3")
        c.vline(fl(aw / 2), 1, ah - 2, "4")                                                // the two doors' seam
        // the glass strip and its dials, one turning slower than the other
        const g0 = fl(ah * 0.58), g1 = fl(ah * 0.76)
        c.rect(2, Y(g1), aw - 4, g1 - g0 + 1, "1")
        const gm = fl((g0 + g1) / 2)
        for (const cx of [4, aw - 5]) { c.rect(cx - 1, Y(gm + 1), 3, 3, "h"); c.px(cx, Y(gm), "1"); c.px(cx, Y(gm + 1), "1") }   // the dials, their needles
        c.hline(2, Y(g1), aw - 4, "2")
        // the catch with its lead seal on a wire, the warning sticker
        c.px(fl(aw / 2) + 1, Y(fl(ah * 0.4)), "6"); c.px(fl(aw / 2) + 2, Y(fl(ah * 0.4) - 2), "G"); c.px(fl(aw / 2) + 2, Y(fl(ah * 0.4) - 1), "4")
        c.rect(2, Y(fl(ah * 0.3)), 4, 4, "y"); c.px(3, Y(fl(ah * 0.3) - 1), "1"); c.px(4, Y(fl(ah * 0.3) - 2), "1")
      }, 0, 0)
      return o.memo.cab(a, e)
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

  // the lift: it runs (unlike the Kessel's), on every floor at the same place: old brown-painted steel doors with their ribs, the paint
  // scraped to the grey steel where hands push and trolleys knock, the floor display over them lit amber with the floor's number
  // (op.floor; the ground floor G), the call button lit beside the frame
  ISOKIT.opening("lf_lift", {
    pad: [0.08, 0, 0.16, 0.3],
    paint(s, h, o) {
      const { a, e, aw, ah } = o, mid = fl(aw / 2), op = o.op ?? {}
      if (e >= ah + 2) {
        if (e >= ah + 3 && e <= ah + 9 && a >= mid - 4 && a <= mid + 3) {
          if (e === ah + 3 || e === ah + 9 || a === mid - 4 || a === mid + 3) return "4"
          o.memo.digit ??= ISOKIT.raster(6, 5, (c) => TXT.draw(c, 3, 0, op.floor ? String(op.floor) : "G", "!Q", { font: "hud", align: "center" }), 0, 0)
          return o.memo.digit(a - (mid - 3), e - (ah + 4)) === "!Q" ? "!Q" : "!O"            // the floor's number on the amber glow
        }
        return null
      }
      if (a >= aw + 2) {
        if (a > aw + 4 || e < 28 || e > 36) return null
        if (a === aw + 2 || a === aw + 4 || e === 28 || e === 36) return "4"              // the call button's plate
        return e === 32 && a === aw + 3 ? "!Q" : "6"
      }
      if (a < 0 || a >= aw || e >= ah) {
        if (a < -2 || a > aw + 1 || e > ah + 1) return null
        return a === -2 || a === aw + 1 || e === ah + 1 ? "3" : "5"
      }
      if (a === mid || a === mid - 1) return a === mid ? "2" : "4"                         // the seam
      if (e < 3) return "3"                                                                // the sill
      // scraped to the steel: at hand height by the seam, low down where trolleys knock
      const dm = Math.abs(a - mid + 0.5)
      if (e > 28 && e < 40 && dm < 4 && ISO.ihash(a, e) < 0.4 - dm * 0.08) return "4"
      if (e < 10 && ISO.ihash(a * 3, e) < 0.12) return "4"
      return a % 4 === 1 ? "O" : "A"                                                      // painted steel, brown, its ribs
    },
  })

  return {}
})()

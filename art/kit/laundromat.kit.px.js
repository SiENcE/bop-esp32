// The kit pieces SUDS & SPIN needs (art/rooms/laundromat.map.js): BLOCKS for now, to judge the room's plan before anything is
// painted (read the style guide and the pxl skill before painting them). Registered with ISOKIT (art/lib/isokit.js), drawn in room
// meters, lit by the bake. Its own light family: the tubes' green cast (kapitel1-design §9), four keys of its own (E F J K).
//
//   floors   l  old linoleum, 50 cm squares
//   walls    lm_wall  tiles to 1.2 m, paint above; lm_glass  the alley's window as a cut near wall
//   openings lm_sign  NO SNEAKERS / IN THE DRYER over the dryers
//   props    lm_dryer (its number from the id; 6 dead under its note, 2, 3 and 7 with trainers going round), lm_washer,
//            lm_counter, lm_chair, lm_table, lm_basket, lm_mat, lm_sill, lm_tubes (two tubes on their wires), lm_cam (CAM 23's dome)
include("../lib/text.js")

pal({ E: "#1b2b28", F: "#2a4239", J: "#4c6e5c", K: "#a8d8b8" })
ramps("EFJK")

const KIT_LAUNDROMAT = (() => {
  const fl = Math.floor, NF = 12
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w

  // the tubes' light: old phosphor, a sick green over everything it reaches
  ISOKIT.TINT.green = {
    e: ["e", "E"], f: ["f", "E"], z: ["E", "F"], Z: ["F", "F"], X: ["F", "J"],
    1: ["1", "E"], 2: ["E", "E"], 3: ["E", "F"], 4: ["F", "F"], 5: ["F", "J"], 6: ["J", "K"],
    g: ["g", "J"], G: ["J", "K"], h: ["h", "K"], H: ["H", "K"], a: ["a", "E"], t: ["t", "F"], u: ["u", "E"], U: ["U", "J"],
    O: ["O", "E"], P: ["P", "P"], E: ["E", "F"], F: ["F", "J"], J: ["J", "K"],
  }
  Object.assign(ISOKIT.SHADE, { E: "f", F: "E", J: "F", K: "J" })

  // ---------------------------------------------------------------- floor and walls
  ISOKIT.floor("l", (u, v) => (near(u % 0.5, 0, 1 / 40) || near(v % 0.5, 0, 1 / 40) ? "e" : (fl(u / 0.5) + fl(v / 0.5)) % 2 ? "z" : "Z"))
  ISOKIT.wall("lm_wall", (s, h) => (h < 0.06 ? "1" : h < 1.2 ? (near(s % 0.2, 0, 1 / 48) || near(h % 0.2, 0, 1 / 40) ? "3" : "4") : "3"))
  ISOKIT.wall("lm_glass", { face: () => "3", stubTop: (s, d) => (d < 0.05 || d > 0.2 || near(s % 1.25, 0, 0.04) ? "5" : d < 0.1 ? "!T" : "!t") })

  // ---------------------------------------------------------------- the sign
  ISOKIT.opening("lm_sign", {
    paint(s, h, o) {
      o.memo.sign ??= ISOKIT.raster(o.aw, o.ah, (c) => {
        const W = o.aw, H = o.ah
        c.rect(0, 0, W, H, "H"); c.hline(0, 0, W, "6"); c.hline(0, H - 1, W, "6")
        TXT.draw(c, fl(W / 2), 1, "NO SNEAKERS", "1", { font: "hud", align: "center" })
        TXT.draw(c, fl(W / 2), 8, "IN THE DRYER", "1", { font: "hud", align: "center" })
      }, 0, 0)
      return o.memo.sign(o.a, o.e)
    },
  })

  // ---------------------------------------------------------------- the machines
  const DIGITS = { 1: [".#", "##", ".#", ".#", ".#"], 2: ["##", ".#", "##", "#.", "##"], 3: ["##", ".#", "##", ".#", "##"], 4: ["#.", "#.", "##", ".#", ".#"],
    5: ["##", "#.", "##", ".#", "##"], 6: ["##", "#.", "##", "##", "##"], 7: ["##", ".#", ".#", ".#", ".#"], 8: ["##", "##", "..", "##", "##"] }
  /** a round door on a face: its rim, its glass, what goes round behind it (a pair of trainers), or a dead one */
  const door = (a, e, o, cx, cy, r, inside) => {
    const d = Math.hypot(a - cx, (e - cy) * 1.1)
    if (d > r) return null
    if (d > r - 1.5) return "6"
    return inside(a - cx, e - cy) ?? "2"
  }
  ISOKIT.prop("lm_dryer", {
    frames: NF,
    draw(pen, p, f) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h, n = Number(p.id.replace(/\D/g, "")), dead = n === 6, shoes = [2, 3, 7].includes(n)
      const ang = (f / NF) * Math.PI * 2 * (n === 3 ? -1 : 1) + n
      const inside = (x, y) => {
        if (dead) return "1"
        if (shoes) { const sx = Math.cos(ang) * 2.5, sy = Math.sin(ang) * 2.5; if (Math.hypot(x - sx, y - sy) < 2.2) return "P"; if (Math.hypot(x + sx, y + sy) < 2.2) return "Q" }
        return "!F"
      }
      pen.box(u, v, 0, du, dv, H, () => "5", () => "4", (a, e, o) => {
        const top = o.ah - 6
        if (e >= top) {                                               // the control strip: the number, a little display
          const g = DIGITS[n], i = a - 3, j = o.ah - 1 - e
          if (g && i >= 0 && i < 2 && j >= 0 && j < 5 && g[j][i] === "#") return dead ? "1" : "H"
          if (a >= o.aw - 6 && a < o.aw - 2 && e >= top + 1 && e < o.ah - 1) return dead ? "2" : "!v"
          return "3"
        }
        if (dead && a >= 3 && a < o.aw - 3 && e >= top - 6 && e < top - 1) return "H"     // OUT OF ORDER, a note taped on
        return door(a, e, o, o.aw / 2, (top - 2) / 2, Math.min(o.aw, top) / 2 - 2, inside) ?? "5"
      })
    },
  })
  ISOKIT.prop("lm_washer", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      pen.box(u, v, 0, du, dv, H, () => "6", (a, e, o) => door(a, e, o, o.aw / 2, o.ah * 0.42, Math.min(o.aw, o.ah) / 2 - 3, () => "!F") ?? (e > o.ah - 4 ? "4" : "5"), () => "4")
    },
  })
  ISOKIT.prop("lm_counter", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      pen.box(u, v, 0, du, dv, H, () => "5", (a, e, o) => (e > o.ah - 3 ? "4" : near(a % 6, 0, 0.6) ? "2" : "3"), () => "3")
    },
  })
  ISOKIT.prop("lm_chair", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot
      pen.box(u + 0.05, v + 0.05, 0, du - 0.1, dv - 0.1, 0.42, () => "U", () => "u", () => "u")
      pen.box(u, v, 0.42, 0.06, dv, 0.38, () => "U", () => "U", () => "u")       // the back, toward the room's back
    },
  })
  ISOKIT.prop("lm_table", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      pen.box(u + du / 2 - 0.03, v + dv / 2 - 0.03, 0, 0.06, 0.06, H - 0.03, () => "4", () => "3", () => "4")
      pen.box(u, v, H - 0.03, du, dv, 0.03, () => "G", () => "g", () => "g")
    },
  })
  ISOKIT.prop("lm_basket", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      pen.box(u, v, 0, du, dv, H, (lu, lv) => (lu < 0.05 || lv < 0.05 || lu > du - 0.05 || lv > dv - 0.05 ? "G" : "h"), (a) => (a % 3 ? "G" : "g"), (a) => (a % 3 ? "G" : "g"))
    },
  })
  ISOKIT.prop("lm_mat", { footprint: () => [], draw(pen, p) { const [u, v] = p.at, [du, dv] = p.foot; pen.box(u, v, 0, du, dv, p.h, (lu, lv) => (lu < 0.04 || lu > du - 0.04 || lv < 0.04 || lv > dv - 0.04 ? "3" : fl(lu * 20) % 2 ? "2" : "1"), () => "2", () => "2") } })
  ISOKIT.prop("lm_sill", { footprint: () => [], draw(pen, p) { const [u, v] = p.at, [du, dv] = p.foot; pen.box(u, v, 0, du, dv, p.h, (lu) => (fl(lu * 24) % 2 ? "6" : "5"), () => "4", () => "4") } })

  // ---------------------------------------------------------------- what hangs over the aisle
  ISOKIT.prop("lm_tubes", {
    outline: false, footprint: () => [], solid: () => [],
    draw(pen, p) {
      const [u0, v0] = p.at, [du] = p.foot
      for (const [a, b] of [[u0 + 0.1, u0 + 1.1], [u0 + du - 1.1, u0 + du - 0.1]]) {
        const [x0, y0] = pen.P(a, v0, p.h), [x1, y1] = pen.P(b, v0, p.h)
        pen.at(a, v0, p.h + 0.1, null)
        pen.vline(x0 + 3, y0 - 30, 29, "k"); pen.vline(x1 - 3, y1 - 30, 29, "k")       // the wires up into the dark
        pen.line(x0, y0, x1, y1, "!K"); pen.line(x0, y0 + 1, x1, y1 + 1, "!J")
        pen.at(null)
      }
    },
  })
  ISOKIT.prop("lm_cam", {
    outline: false, footprint: () => [], solid: () => [],
    draw(pen, p) {
      const [u, v] = p.at, [x, y] = pen.P(u, v, p.h)
      pen.at(u, v, p.h, null)
      pen.vline(x, y - 14, 12, "k")
      pen.grid(x - 3, y - 2, ["..kk..", ".k44k.", "k4554k", "k2222k", ".k2vk.", "..kk.."])
      pen.at(null)
    },
  })

  return {}
})()

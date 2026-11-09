// The kit pieces SUDS & SPIN needs (art/rooms/laundromat.map.js), at the street scale (style guide §4: 16 units per meter of floor,
// 30 px per meter of height): registered with ISOKIT (art/lib/isokit.js), drawn in room meters, lit by the bake. Painted after the
// user approved the blocks (2026-11-09). A laundromat of the Lower Ninth at night: old tubes with the green cast of tired phosphor
// over everything (kapitel1-design §9, a light family of its own, keys E F J L K), enamel and steel, the alley's cyan in the window,
// the plastic chairs' faded orange as the warm key near where Juno walks (style guide §7). Its small stories: trainers going round
// behind the doors of dryers 2, 3 and 7 under the sign that forbids them, dryer 6 dead under its note, washer 3 leaking to the
// drain, a lost sock on the board, the clock stopped, a TV of snow on the counter before the man asleep.
//
//   floors   l  old linoleum, 50 cm squares light and dark; the grout; the drain, washer 3's wet trail to it
//   walls    lm_wall  white tiles to 1.2 m (one cracked, one gone), mint paint above, the damp coming down in the corner
//            lm_glass the alley's window as a cut near wall (its glass in the section)
//   openings lm_sign  NO SNEAKERS / IN THE DRYER; lm_board (the notices: LOST SOCK, a room, a cat); lm_clock (stopped)
//   props    lm_dryer (its number from the id; running, idle or dead; 2, 3 and 7 with trainers going round), lm_washer (washer 2
//            running for Ines, washer 3 leaking, a box of powder on washer 1), lm_counter (the TV of snow, the bell, the jar of
//            coins), lm_chair, lm_table (magazines, a cup), lm_basket, lm_mat, lm_sill, lm_tubes (two tubes on their wires, the
//            second stuttering), lm_cam (CAM 23's dome, its red light)
// Keys "!k" are never lit (the tubes, the displays, the screen of snow, the glass doors' insides).
include("../lib/text.js")

pal({ E: "#1b2b28", F: "#2a4239", J: "#4c6e5c", L: "#7aa48a", K: "#c4ecd0" })
ramps("EFJLK")

const KIT_LAUNDROMAT = (() => {
  const fl = Math.floor, ih = ISO.ihash, NF = 12
  const near = (x, c, w = 1 / 48) => Math.abs(x - c) < w

  // the tubes' light: old phosphor, a sick green over everything it reaches; the chairs' orange keeps warm under it
  ISOKIT.TINT.green = {
    e: ["e", "E"], f: ["E", "E"], z: ["E", "F"], Z: ["F", "F"], X: ["F", "J"],
    1: ["1", "E"], 2: ["E", "F"], 3: ["F", "F"], 4: ["F", "J"], 5: ["J", "J"], 6: ["J", "L"],
    g: ["g", "J"], G: ["J", "L"], h: ["L", "K"], H: ["K", "K"], a: ["a", "E"], t: ["t", "F"], u: ["u", "E"], U: ["U", "J"],
    O: ["O", "O"], P: ["P", "P"], E: ["E", "F"], F: ["F", "J"], J: ["J", "L"], L: ["L", "K"],
  }
  Object.assign(ISOKIT.SHADE, { E: "e", F: "E", J: "F", L: "J", K: "L" })

  // ---------------------------------------------------------------- floor
  // linoleum in 50 cm squares, light and dark, the grout between; the floor's drain before the washers; washer 3 leaks, its water
  // running along the floor to the drain and standing round it (the tube mirrored in it as a pale streak)
  const DRAIN = [1.35, 2.45]
  ISOKIT.floor("l", (u, v) => {
    const du = u - DRAIN[0], dv = v - DRAIN[1]
    if (Math.abs(du) < 0.1 && Math.abs(dv) < 0.1) return Math.abs(du) > 0.08 || Math.abs(dv) > 0.08 ? "2" : fl((du + dv) * 40) % 2 ? "1" : "e"
    const wet = Math.hypot(du * 0.8, dv * 1.4) < 0.24 || (u > 0.7 && u < DRAIN[0] && Math.abs(v - (2.38 + (u - 0.7) * 0.1)) < 0.05 + 0.03 * Math.sin(u * 17))
    if (wet) return near(u - v * 0.5, 0.15, 0.02) ? "X" : "f"
    if (near(u % 0.5, 0, 1 / 40) || near(v % 0.5, 0, 1 / 40)) return "e"
    const dark = (fl(u / 0.5) + fl(v / 0.5)) % 2
    // worn pale in the aisle before the dryers, where everyone stands waiting
    const worn = v > 0.8 && v < 1.5 && ih(fl(u * 24), fl(v * 24)) < 0.12
    return dark ? (worn ? "Z" : "z") : (worn ? "Z" : "X")
  })

  // ---------------------------------------------------------------- walls
  // white tiles to 1.2 m (15 cm, their grout, a bullnose row on top, one cracked, one gone to the plaster), mint paint above; in the
  // corner over the washers the damp comes down from the flat above as a dark stain
  ISOKIT.wall("lm_wall", (s, h, o) => {
    if (h < 0.06) return "2"
    if (h < 1.2) {
      const T = 0.15, is = fl(s / T), jh = fl((h - 0.06) / T)
      if (h > 1.14) return "6"                                                       // the bullnose
      if (near(s % T, 0, 1 / 48) || near((h - 0.06) % T, 0, 1 / 40)) return "3"
      if (ih(is + 7, jh + 3) > 0.985) return "2"                                     // a tile gone, the plaster under it
      if (ih(is + 2, jh + 9) > 0.975 && near((s % T) - (h % T) * 0.7, 0.03, 0.012)) return "3"   // a crack
      return h < 0.3 ? "4" : "5"
    }
    // the damp: down from the ceiling in the corner where the two back walls meet
    const edge = 2.6 - (0.4 - s) * 1.1 - 0.06 * Math.sin(s * 31)
    if (s < 0.4 && h > edge) return h < edge + 0.035 ? "E" : (fl(s * 40) + fl(h * 30)) % 5 ? "F" : "E"     // its tide line, the paint under it blistered
    return "F"
  })
  // the window in the cut: its frame on both sides, the glass between, the alley's cyan in it, a mullion every 1.15 m
  ISOKIT.wall("lm_glass", { face: () => "3", stubTop: (s, d) => (d < 0.05 || d > 0.2 || near(s % 1.15, 0, 0.04) ? "5" : d < 0.1 ? "!T" : "!t") })

  // ---------------------------------------------------------------- openings
  // the sign over the dryers: a white plastic plate, red rule under its words (a rule of the house), screwed at its corners
  ISOKIT.opening("lm_sign", {
    paint(s, h, o) {
      o.memo.sign ??= ISOKIT.raster(o.aw, o.ah, (c) => {
        const W = o.aw, H = o.ah
        c.rect(0, 0, W, H, "H"); c.hline(0, 0, W, "h"); c.hline(0, H - 1, W, "g"); c.vline(0, 0, H, "h"); c.vline(W - 1, 0, H, "g")
        TXT.draw(c, fl(W / 2), 1, "NO SNEAKERS", "1", { font: "hud", align: "center" })
        TXT.draw(c, fl(W / 2), 7, "IN THE DRYER", "1", { font: "hud", align: "center" })
        c.hline(4, H - 2, W - 8, "r")
        for (const x of [1, W - 2]) { c.px(x, 1, "g"); c.px(x, H - 2, "g") }
      }, 0, 0)
      return o.memo.sign(o.a, o.e)
    },
  })
  // the board by the washers: cork, notes pinned on it: LOST SOCK with a drawing of it, a room to let with its torn-off tabs, a cat
  ISOKIT.opening("lm_board", {
    paint(s, h, o) {
      o.memo.board ??= ISOKIT.raster(o.aw, o.ah, (c) => {
        const W = o.aw, H = o.ah
        c.rect(0, 0, W, H, "O"); c.rect(0, 0, W, 1, "a"); c.rect(0, H - 1, W, 1, "a"); c.vline(0, 0, H, "a"); c.vline(W - 1, 0, H, "a")
        // LOST SOCK: the paper, two scrawled lines, the sock drawn under them
        c.rect(2, 2, 9, 11, "H"); c.hline(3, 3, 6, "1"); c.hline(3, 5, 5, "1")
        c.grid(4, 7, ["UU..", "UU..", "UUUU", ".UUU"]); c.px(6, 2, "q")
        // a room to let: its tabs along the bottom, two torn off
        c.rect(13, 3, 8, 9, "h"); c.hline(14, 4, 6, "2"); c.hline(14, 6, 4, "2")
        for (let x = 13; x < 21; x += 2) if (x !== 15 && x !== 19) c.vline(x, 12, 3, "h")
        c.px(17, 3, "v")
        // a cat, a photo
        if (W > 24) { c.rect(23, 5, 6, 6, "H"); c.rect(24, 6, 4, 3, "g"); c.px(25, 6, "1"); c.px(27, 6, "1") }
      }, 0, 0)
      return o.memo.board(o.a, o.e)
    },
  })
  // the clock over the counter, stopped at twenty past four years ago
  ISOKIT.opening("lm_clock", {
    paint(s, h, o) {
      o.memo.clock ??= ISOKIT.raster(o.aw, o.ah, (c) => {
        const W = o.aw, H = o.ah, cx = (W - 1) / 2, cy = (H - 1) / 2, r = Math.min(W, H) / 2
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
          const d = Math.hypot(x - cx, y - cy)
          if (d < r - 1.4) c.px(x, y, "H"); else if (d < r) c.px(x, y, "1")
        }
        for (let i = 0; i < 12; i += 3) c.px(Math.round(cx + Math.cos(i * Math.PI / 6) * (r - 2.2)), Math.round(cy + Math.sin(i * Math.PI / 6) * (r - 2.2)), "g")
        c.line(Math.round(cx), Math.round(cy), Math.round(cx), Math.round(cy) - fl(r * 0.6), "1"); c.line(Math.round(cx), Math.round(cy), Math.round(cx) + 2, Math.round(cy) + 1, "1")
      }, 0, 0)
      return o.memo.clock(o.a, o.e)
    },
  })

  // ---------------------------------------------------------------- the machines
  const DIGITS = { 1: [".#.", "##.", ".#.", ".#.", "###"], 2: ["##.", "..#", ".#.", "#..", "###"], 3: ["##.", "..#", ".#.", "..#", "##."], 4: ["#.#", "#.#", "###", "..#", "..#"],
    5: ["###", "#..", "##.", "..#", "##."], 6: [".##", "#..", "###", "#.#", "###"], 7: ["###", "..#", ".#.", ".#.", ".#."], 8: ["###", "#.#", "###", "#.#", "###"] }
  /** a round door on a face: its chrome rim lit at the top left, its glass, what goes round behind it */
  const door = (a, e, cx, cy, r, inside) => {
    const x = a - cx, y = e - cy, d = Math.hypot(x, y * 1.1)
    if (d > r) return null
    if (d > r - 1.6) return x - y < -r * 0.5 ? "H" : x - y > r * 0.6 ? "4" : "6"
    if (d > r - 2.4) return "2"
    return inside(x, y, r - 2.4) ?? "!1"
  }
  // the dryers: which run, which stand idle (their glass dark), which is dead
  const RUNNING = [1, 2, 3, 5, 7]
  ISOKIT.prop("lm_dryer", {
    frames: NF,
    draw(pen, p, f) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h, n = Number(p.id.replace(/\D/g, "")), dead = n === 6, shoes = [2, 3, 7].includes(n)
      const runs = RUNNING.includes(n), ang = (f / NF) * Math.PI * 2 * (n === 3 ? -1 : 1) + n
      const inside = (x, y, r) => {
        if (dead) return x + y < -r * 0.6 ? "!2" : "!1"
        if (!runs) return Math.abs(x + y + 1) < 0.8 ? "!3" : y > r * 0.5 ? "!2" : "!1"     // empty: the drum's lit lip, its back
        if (shoes) {
          const sx = Math.cos(ang) * 2.4, sy = Math.sin(ang) * 2.4
          if (Math.hypot(x - sx, y - sy) < 2) return Math.hypot(x - sx, y - sy - 1) < 1 ? "!H" : "!P"     // a trainer, its white sole
          if (Math.hypot(x + sx, y + sy) < 2) return Math.hypot(x + sx, y + sy + 1) < 1 ? "!H" : "!Q"
        } else {
          const t = ang * 0.7, cx = Math.cos(t) * 2, cy = Math.sin(t) * 2 - 1                 // somebody's washing tumbling
          if (Math.hypot(x - cx, y - cy) < 2.6) return (fl(x) + n) % 3 ? "!h" : "!U"
        }
        if (y < -r * 0.45) return "!E"                                                     // what has fallen to the bottom
        return Math.abs(x + y + 1) < 0.8 ? "!3" : "!2"
      }
      pen.box(u, v, 0, du, dv, H, (lu, lv) => (lv > dv - 0.04 ? "6" : lu < 0.02 ? "4" : "5"), (a, e, o) => (a === 0 || e < 2 ? "3" : "4"), (a, e, o) => {
        const W = o.aw, top = o.ah - 7
        if (a === 0) return "3"                                                         // the seam to the next
        if (e < 2) return "1"                                                           // the kick
        if (e >= top) {                                                                 // the control strip
          if (e === top) return "3"
          const g = DIGITS[n], i = a - 2, j = o.ah - 2 - e
          if (g && i >= 0 && i < 3 && j >= 0 && j < 5 && g[j][i] === "#") return dead ? "3" : "H"
          if (a >= W - 7 && a < W - 2 && e >= top + 2 && e < o.ah - 2) {                // the display: minutes left
            if (dead || !runs) return "!c"
            return (a + e + (f >> 2)) % 3 ? "!v" : "!C"
          }
          if (a === W - 9 && e >= top + 2 && e < o.ah - 2) return "1"                   // the coin slot
          return "2"
        }
        if (dead && a >= 3 && a < W - 3 && e >= top - 8 && e < top - 1) {             // the note, OUT OF ORDER, taped over the door's top
          if (e === top - 2 && (a === 3 || a === W - 4)) return "h"
          return (e === top - 4 || e === top - 6) && a > 4 && a < W - 5 && (a + e) % 3 ? "1" : "H"
        }
        if (e === 3 && a > 3 && a < W - 4) return "3"                                   // the lint drawer
        return door(a, e, W / 2, (top + 2) / 2 + 1, Math.min(W, top) / 2 - 1.5, inside) ?? "5"
      })
    },
  })
  // the washers: their doors to the room, the panel with its dial; washer 2 runs (Ines's, Wednesday), its water and suds slopping;
  // washer 3 leaks from under its door; a box of powder on washer 1
  ISOKIT.prop("lm_washer", {
    frames: NF,
    draw(pen, p, f) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h, n = Number(p.id.replace(/\D/g, ""))
      const inside = (x, y, r) => {
        if (n !== 2) return Math.abs(x + y + 1) < 0.8 ? "!3" : "!1"
        const level = -1 + Math.sin((f / NF) * Math.PI * 4 + x * 0.6) * 1.2
        if (y > level + 1) return Math.abs(x + y + 1) < 0.8 ? "!3" : "!1"
        if (y > level - 0.5) return (fl(x) + f) % 2 ? "!K" : "!L"                         // the suds on the water
        return "!J"
      }
      pen.box(u, v, 0, du, dv, H, (lu, lv) => (lu > du - 0.04 ? "6" : near(lv, dv / 2, 0.01) ? "4" : "5"), (a, e, o) => {
        const W = o.aw, top = o.ah - 6
        if (e < 2) return "1"
        if (a === W - 1) return "3"
        if (e >= top) {
          if (e === top) return "3"
          const [kx, ky] = [5, top + 3]
          if (Math.hypot(a - kx, e - ky) < 1.6) return a < kx ? "H" : "6"               // the dial
          if (a >= W - 7 && a < W - 2 && e >= top + 2 && e < o.ah - 1) return n === 2 ? ((a + f) % 4 ? "!v" : "!C") : "!c"
          return "2"
        }
        if (n === 3 && e === 2 && a > W / 2 - 3 && a < W / 2 + 2) return "!t"           // the leak, a wet line under the door
        return door(a, e, W / 2, (top + 2) / 2, Math.min(W, top) / 2 - 1.5, inside) ?? (a % 7 === 0 ? "4" : "5")
      }, (a, e) => (e < 2 ? "1" : "4"))
      if (n === 1) {                                                                    // the box of powder, SUDZ on it in no letters
        pen.box(u + 0.15, v + 0.2, H, 0.2, 0.14, 0.24, (lu) => (lu > 0.15 ? "R" : "Q"), (a, e) => (e > 3 && e < 6 ? "W" : "P"), () => "O")
      }
    },
  })
  // the counter by the door: chipboard in a wood laminate, kicked at the foot; a cream top; on it a small TV showing snow before
  // the man asleep, the bell for him nobody rings, a jar of coins
  ISOKIT.prop("lm_counter", {
    frames: NF,
    draw(pen, p, f) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h, T = 0.05
      const front = (a, e, o) => (e < 2 ? "1" : e < 4 && ih(a, 5) < 0.4 ? "a" : a % 8 === 0 ? "a" : e === o.ah - 1 ? "P" : "O")
      pen.box(u, v, 0, du, dv, H - T, () => "O", front, front)
      pen.box(u - 0.03, v - 0.03, H - T, du + 0.06, dv + 0.06, T, (lu, lv) => (lu > du + 0.01 || lv > dv + 0.01 ? "H" : "h"), () => "g", () => "g")
      // the TV, its back to the wall, its screen to the room: snow, every frame new
      const tu = u + 0.08, tv = v + 0.12
      pen.box(tu, tv, H, 0.22, 0.24, 0.2, () => "3", (a, e, o) => {
        if (a === 0 || a === o.aw - 1 || e === 0 || e === o.ah - 1) return "2"
        return ih(a * 7 + f, e * 13 + f * 3) < 0.45 ? "!H" : ih(a + f, e) < 0.5 ? "!h" : "!g"
      }, () => "2")
      const [ax, ay] = pen.P(tu + 0.11, tv + 0.12, H + 0.2)
      pen.at(tu + 0.11, tv + 0.12, H + 0.3, null); pen.line(ax, ay, ax - 3, ay - 5, "4"); pen.line(ax, ay, ax + 3, ay - 4, "4"); pen.at(null)   // the aerial
      // the bell and the jar
      const [bx, by] = pen.P(u + 0.35, v + 0.42, H)
      pen.at(u + 0.35, v + 0.42, H + 0.05, "v"); pen.grid(bx - 2, by - 3, [".66.", "6HH6", "4444"]); pen.at(null)
      const [jx, jy] = pen.P(u + 0.3, v + 0.12, H)
      pen.at(u + 0.3, v + 0.12, H + 0.08, "v"); pen.grid(jx - 1, jy - 5, ["hhh", "h.h", "hQh", "QPQ", "hhh"]); pen.at(null)
    },
  })
  // the plastic chairs, faded orange: four thin legs, the seat, the back toward the window (people sit watching the dryers)
  ISOKIT.prop("lm_chair", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, L = 0.03
      for (const [lu, lv] of [[0.04, 0.04], [du - 0.07, 0.04], [0.04, dv - 0.07], [du - 0.07, dv - 0.07]]) pen.box(u + lu, v + lv, 0, L, L, 0.4, () => "4", () => "3", () => "4")
      pen.box(u + 0.02, v + 0.02, 0.4, du - 0.04, dv - 0.04, 0.04, (lu, lv) => (lu < 0.06 && lv < 0.06 ? "Q" : "P"), () => "O", () => "O")
      pen.box(u + 0.02, v + dv - 0.07, 0.44, du - 0.04, 0.05, 0.36, () => "P", () => "O", (a, e, o) => (e > o.ah - 3 ? "P" : a % 5 === 2 && e > 3 && e < o.ah - 4 ? "a" : "O"))
    },
  })
  // the folding table: its steel legs, a top in grey laminate; magazines on it (a magenta cover, Nagi·wa's happiness), a paper cup
  ISOKIT.prop("lm_table", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      for (const [lu, lv] of [[0.05, 0.05], [du - 0.08, 0.05], [0.05, dv - 0.08], [du - 0.08, dv - 0.08]]) pen.box(u + lu, v + lv, 0, 0.03, 0.03, H - 0.03, () => "5", () => "4", () => "5")
      pen.box(u, v, H - 0.03, du, dv, 0.03, (lu, lv) => (lu > du - 0.03 || lv > dv - 0.03 ? "6" : "5"), () => "3", () => "3")
      pen.box(u + 0.1, v + 0.12, H, 0.24, 0.18, 0.02, () => "h", () => "g", () => "g")
      pen.box(u + 0.13, v + 0.15, H + 0.02, 0.22, 0.17, 0.015, (lu, lv) => (lv < 0.05 ? "m" : "M"), () => "n", () => "n")
      pen.box(u + 0.4, v + 0.38, H, 0.07, 0.07, 0.11, () => "1", () => "H", () => "h")
    },
  })
  // a laundry basket, white plastic with its slots, somebody's clothes in it
  ISOKIT.prop("lm_basket", {
    draw(pen, p) {
      const [u, v] = p.at, [du, dv] = p.foot, H = p.h
      const side = (a, e, o) => (e === o.ah - 1 ? "H" : e > 1 && e < o.ah - 2 && a % 3 === 1 ? "g" : "h")
      pen.box(u, v, 0, du, dv, H, (lu, lv) => {
        if (lu < 0.04 || lv < 0.04 || lu > du - 0.04 || lv > dv - 0.04) return "H"
        const k = fl(lu * 9 + lv * 5)
        return k % 3 === 0 ? "U" : k % 3 === 1 ? "P" : "h"
      }, side, side)
    },
  })
  ISOKIT.prop("lm_mat", { footprint: () => [], draw(pen, p) { const [u, v] = p.at, [du, dv] = p.foot; pen.box(u, v, 0, du, dv, p.h, (lu, lv) => (lu < 0.04 || lu > du - 0.04 || lv < 0.04 || lv > dv - 0.04 ? "3" : fl(lu * 20) % 2 ? "2" : "1"), () => "2", () => "2") } })
  ISOKIT.prop("lm_sill", { footprint: () => [], draw(pen, p) { const [u, v] = p.at, [du, dv] = p.foot; pen.box(u, v, 0, du, dv, p.h, (lu) => (fl(lu * 24) % 2 ? "6" : "5"), () => "4", () => "4") } })

  // ---------------------------------------------------------------- what hangs over the aisle
  // two tubes in their steel trays on wires up into the dark; the second stutters now and then, its ends gone dark with age
  ISOKIT.prop("lm_tubes", {
    outline: false, footprint: () => [], solid: () => [], frames: NF,
    draw(pen, p, f) {
      const [u0, v0] = p.at, [du] = p.foot
      ;[[u0 + 0.1, u0 + 1.1, true], [u0 + du - 1.1, u0 + du - 0.1, f !== 4 && f !== 9 && f !== 10]].forEach(([a, b, on], i) => {
        const [x0, y0] = pen.P(a, v0, p.h), [x1, y1] = pen.P(b, v0, p.h)
        pen.at(a, v0, p.h + 0.1, null)
        pen.vline(x0 + 3, y0 - 30, 28, "k"); pen.vline(x1 - 3, y1 - 30, 28, "k")
        pen.line(x0, y0 - 2, x1, y1 - 2, "2"); pen.line(x0, y0 - 1, x1, y1 - 1, "4")             // the tray
        const len = x1 - x0
        for (let x = 0; x <= len; x++) {
          const end = x < 3 || x > len - 3, k = !on ? "!J" : end && i === 1 ? "!L" : "!K"
          pen.px(x0 + x, y0 + fl(x / 2), k)
          pen.px(x0 + x, y0 + 1 + fl(x / 2), on ? "!L" : "!F")
        }
        pen.at(null)
      })
    },
  })
  // CAM 23: a cheap dome on its cable over the aisle, its red light blinking (the system's eye: style guide §5)
  ISOKIT.prop("lm_cam", {
    outline: false, footprint: () => [], solid: () => [], frames: NF,
    draw(pen, p, f) {
      const [u, v] = p.at, [x, y] = pen.P(u, v, p.h)
      pen.at(u, v, p.h, null)
      pen.vline(x, y - 14, 12, "k")
      pen.grid(x - 3, y - 2, ["..kk..", ".k45k.", "k4556k", "k2222k", ".k2ck.", "..kk.."])
      if (f < 6) pen.px(x + 1, y + 2, "!q")
      pen.at(null)
    },
  })

  return {}
})()

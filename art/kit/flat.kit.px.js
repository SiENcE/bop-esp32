// The kit pieces Juno's flat needs (art/rooms/flat.map.js), at the new scale (style guide §4: 16 units per
// meter of floor, 30 px per meter of height): registered with ISOKIT (art/lib/isokit.js), drawn in room
// meters, lit by the bake. Include after art/lib/iso.js (palette), art/lib/isomap.js, art/lib/isokit.js.
// The details are the old flat's (art/rooms/flat.px.js), with the room to show more of each.
//
//   floor    v  vinyl in 1 m strips (seams, butt joints)      w  the same, worn where her chair rolls
//   walls    plaster_blue  the right wall: gloss paint to the dado, whitewash above, damp under the window
//            plaster_grey  the left wall: bare grey plaster, a settling crack over the door, the stain
//                          from the flat upstairs in the corner
//   openings window_rain (the street across: HOTEL neon, the big ad screen, rain, drops running down),
//            door_flat (steel, three locks, the red LED, the hallway's light under it), pinboard (the
//            people she watches, a camera map, red string), led_strip (one dead diode), conduit (the
//            tapped line), socket, calendar (the rent ringed), intercom (and the light switch), vent
//   props    fridge, deck_rig (12 frames: screens), chair, cup_tower, laundry, bed_pallet, box_old
// Keys "!k" are never lit (screens, the view, lamps). Small organic things are hand grids; the rest boxes.
include("../lib/text.js")

pal({ 0: "#0c221f", 7: "#266252", 8: "#55a585", 9: "#8acfae" })   // the phosphor feed on the CRT
ramps("0789")

// the flat's door, its face as the room sees it (the shut door in the wall here, and the leaf standing open in Teo's visit,
// art/rooms/flat.px.js): a y-down drawing aw x ah on an ISOKIT.raster canvas; its deadbolt's LED is drawn by who uses it
const FLAT_DOOR_FACE = (c, aw, ah) => {
  const Y = (e) => ah - 1 - e                                                               // e up -> y down
  c.rect(0, 0, aw, ah, "4")
  c.vline(0, 0, ah, "5"); c.hline(0, 0, aw, "5"); c.vline(aw - 1, 0, ah, "3")
  // two pressed panels: their upper and left inner edges in shadow, the lower lit by the strip
  for (const [e0, e1] of [[6, 26], [33, 56]]) {
    c.rect(4, Y(e1), aw - 8, e1 - e0, "3")
    c.hline(4, Y(e1), aw - 8, "2"); c.vline(4, Y(e1), e1 - e0, "2")
    c.hline(4, Y(e0) - 0, aw - 8, "5")
  }
  // a kick scuff at the foot (shut with full hands)
  c.hline(9, Y(3), 3, "3"); c.px(14, Y(2), "3"); c.hline(16, Y(4), 2, "3")
  // (x 0 is the front jamb, the left on the screen, where the hinges are; the handle, the locks and the chain are at the free edge)
  // the handle: a lever on its rose, the cylinder under it
  c.rect(aw - 6, Y(30), 2, 3, "g"); c.hline(aw - 9, Y(29), 5, "G"); c.hline(aw - 9, Y(28), 5, "g"); c.px(aw - 9, Y(29), "6")
  c.px(aw - 5, Y(25), "1"); c.px(aw - 5, Y(24), "6")
  // the deadbolt's panel (its LED at aw - 6 and aw - 5, e 38), a third bolt above, the chain on its slider
  c.rect(aw - 7, Y(40), 4, 4, "2"); c.hline(aw - 7, Y(41), 4, "5")
  c.rect(aw - 6, Y(47), 3, 2, "g"); c.px(aw - 6, Y(47), "G")
  c.hline(aw - 12, Y(44), 3, "G")
  for (const [x, e] of [[aw - 9, 44], [aw - 8, 43], [aw - 7, 43], [aw - 6, 43], [aw - 5, 43], [aw - 4, 44], [aw - 3, 44], [aw - 2, 45], [aw - 1, 45]]) c.px(x, Y(e), (x % 2) ? "G" : "g")
  // the peephole, the flat's number on its plate
  c.px(14, Y(50), "k"); c.px(13, Y(50), "6"); c.px(15, Y(50), "6"); c.px(14, Y(51), "6")
  c.rect(10, Y(58), 9, 7, "6"); c.hline(10, Y(52), 9, "5")
  TXT.draw(c, 12, Y(57), "14", "2", { font: "hud" })
}

/** the door's face in pixels as the bake measured it (set when it paints the door) */
const FLAT_DOOR_SIZE = { aw: 0, ah: 0 }

const FLATKIT = (() => {
  const fl = Math.floor, ih = ISO.ihash, NF = 12
  const near = (x, c, w = 1 / 64) => Math.abs(x - c) < w

  // ---------------------------------------------------------------- floor
  // vinyl sheet laid in 1 m strips along u: a seam at each whole meter of v, each strip's butt joint
  const vinyl = (u, v) => {
    if (v > 0.1 && near(v, Math.round(v))) return "f"
    if (near(u, fl(v) % 2 ? 3.6 : 2.15)) return "f"
    return "z"
  }
  ISOKIT.floor("v", vinyl)
  // where the chair rolls: its casters' tracks in and out from the desk, the arcs where it swivels
  ISOKIT.floor("w", (u, v) => {
    const k = vinyl(u, v)
    if (k === "f") return k
    const d = Math.hypot(u - 2.3, v - 1.2)
    if ((near(d, 0.26, 0.018) || near(d, 0.36, 0.018)) && v > 1.05) return "Z"
    if ((near(u, 2.08, 0.016) || near(u, 2.5, 0.016)) && v > 1.0 && v < 1.75) return "Z"
    return k
  })

  // ---------------------------------------------------------------- walls
  const skirting = (h) => (h < 0.08 ? (h >= 0.055 ? "4" : "1") : null)
  ISOKIT.wall("plaster_blue", (s, h, o) => {
    const k = skirting(h); if (k) return k
    // gloss paint up to the dado (its edge catching the light), whitewash above
    if (near(h, 1.1, 1 / 60)) return "3"
    if (h < 1.1) {
      // chipped where the chair's back hits it, beside the desk
      if (s > 2.62 && s < 2.75 && h > 0.84 && h < 0.94 && ih(fl(s * 32), fl(h * 30)) < 0.55) return "3"
      return "2"
    }
    return "2"
  })
  // the settling crack from the door's top corner, the tide marks of the leak from upstairs in the corner
  const CRACK = [[3.38, 2.12], [3.3, 2.2], [3.27, 2.3], [3.18, 2.38], [3.14, 2.5], [3.05, 2.58]]
  ISOKIT.wall("plaster_grey", (s, h, o) => {
    const k = skirting(h); if (k) return k
    for (let i = 0; i + 1 < CRACK.length; i++) {
      const [s0, h0] = CRACK[i], [s1, h1] = CRACK[i + 1]
      if (h >= h0 && h < h1) { const t = (h - h0) / (h1 - h0); if (near(s, s0 + (s1 - s0) * t, 1 / 50)) return "2" }
    }
    // the stain: a lobe hanging from the ceiling in the corner, two tide marks
    const r = Math.hypot(s / 0.75, (2.6 - h) / 0.42) + 0.12 * Math.sin(s * 9)
    if (r < 1.0 && near(r, 0.97, 0.035)) return "2"
    if (r < 0.62 && near(r, 0.6, 0.035)) return "2"
    if (r < 0.6) return "2"
    return "3"
  })

  // ---------------------------------------------------------------- the window: the street across
  // view(X, Y): far away, so drawn on the screen (not sheared on the wall), from the opening's top-left
  const SIGN = { x: 7, y: 9 }
  const AD = 27
  function viewOf(memo, f) {
    if (memo.rain) return memo
    // rain outside: 1 px streaks falling top-left to bottom-right, two passes a loop
    memo.rain = new Map()
    for (let i = 0; i < 34; i++) {
      const x0 = ih(i, 11) * 64 - 8, ph = ih(i, 12), p = (ph + (2 * f) / NF) % 1, len = 3 + (i % 3)
      const X = Math.round(x0 + p * 18), Y = Math.round(-8 + p * 80)
      for (let j = 0; j < len; j++) memo.rain.set((X + fl(j / 2)) + "," + (Y + j), j === len - 1 ? 2 : 1)
    }
    return memo
  }
  function view(X, Y, f, memo) {
    let k = "1"
    // the smog over the roofs: the city's magenta glow low down, dark above
    if (Y > 10) k = "n"
    if (Y > 14) k = "2"
    // the block across the street: its roofline with a water tank, its windows (people up late)
    const roof = X > 15 && X < 22 ? 12 : 16
    if (Y >= roof) {
      k = "k"
      if (Y > 18 && X < AD - 2) {
        const wx = (X + 1) % 6, wy = (Y - 19) % 7, cell = ih(fl((X + 1) / 6), fl((Y - 19) / 7))
        if (wx < 3 && wy < 3 && cell < 0.42) k = cell < 0.12 ? (f % 4 < 2 ? "!C" : "!c") : wy === 2 ? "O" : cell < 0.3 ? "P" : "O"
      }
    }
    // the big ad screen across the street: its frame, the sleeping face (the eye closed), SLEEP, a band rolling
    if (X === AD - 1 || X === AD - 2) k = "4"
    if (X >= AD) {
      const dx = X - AD, dy = Y - 6
      k = dy % 2 ? "C" : "c"
      if (((dy - f * 4) % 48 + 48) % 48 < 2) k = "v"
      if (Math.abs((dx - 9) ** 2 / 40 + (dy - 34) ** 2 / 7 - 1) < 0.3 && dy > 33) k = "v"     // the closed eyelid
      if (dy > 36 && dy < 40 && dx > 3 && dx < 16 && dx % 3 === 1 && dy - 36 <= 1 + (dx % 2)) k = "C"   // lashes
      if (dy > 22 && dy < 28 && Math.abs((dx - 9) ** 2 / 60 + (dy - 31) ** 2 / 18 - 1) < 0.2) k = "C"  // the brow
      memo.ad ??= ISOKIT.raster(16, 6, (c) => TXT.draw(c, 0, 0, "SLEEP", "V", { font: "hud" }))
      const t = memo.ad(dx + 6, 5 - (dy - 10))                                                  // "EEP" of SLEEP cut by the window
      if (t) k = "V"
    }
    // the HOTEL sign hung on the block: a dark box, magenta tubes; its T stutters
    const sx = X - SIGN.x, sy = Y - SIGN.y
    if (sx >= -1 && sx <= 5 && sy >= 0 && sy <= 31) {
      k = sx === -1 || sx === 5 || sy === 0 || sy === 31 ? "M" : "n"
      memo.sign ??= ISOKIT.raster(3, 30, (c) => "HOTEL".split("").forEach((ch, i) => TXT.draw(c, 0, i * 6, ch, ch === "T" ? "T" : "m", { font: "hud" })))
      const g = memo.sign(sx - 1, 29 - (sy - 1))
      if (g) k = g === "T" ? (f === 7 || f === 8 || f === 10 ? "M" : "m") : "m"
    }
    if (sy === 10 && sx >= -4 && sx < -1) k = "4"                                                  // its bracket
    // rain: lit cyan before the ad, pale elsewhere
    const r = memo.rain.get(X + "," + Y)
    if (r) k = X >= AD ? "v" : r === 2 ? "h" : "5"
    return k[0] === "!" ? k : "!" + k
  }
  const WIN = { jamb: 4, sill: 2, top: 2, side: 2, transom: 37 }
  const winGlass = (a, e, aw, ah) => {
    const mid = WIN.jamb + fl((aw - WIN.jamb - WIN.side) / 2)
    if (a < WIN.jamb || a >= aw - WIN.side || e < WIN.sill || e >= ah - WIN.top) return 0
    if (a === mid || a === mid + 1 || e === WIN.transom || e === WIN.transom + 1) return 0
    return 1
  }
  const DAMP = [[-3, 6], [-1, 10], [1, 4], [42, 3], [44, 8], [45, 12]]
  // drops on the glass (still) and two running down it
  const DROPS = [[7, 30], [12, 8], [17, 37], [25, 21], [31, 34], [36, 12], [39, 40], [9, 18], [29, 5]]
  ISOKIT.opening("window_rain", {
    pad: [0.15, 0.5, 0.16, 0.1],
    pass: (s, h, w, hh) => winGlass(fl(s * 32), fl(h * 30), Math.round(w * 32), Math.round(hh * 30)) === 1,
    halo: [{ color: "#ff4fd3", reach: 0.42, power: 0.95, rect: [0, 0, 0.75, 1.5] }, { color: "#62def0", reach: 0.4, power: 0.85, rect: [0.75, 0, 1.3, 1.5] }],
    paint(s, h, o) {
      const { a, e, aw, ah, f } = o
      // the sill: sticking out past the frame, its lit edge
      if (e >= -3 && e <= -1 && a >= -5 && a < aw + 5) return e === -1 ? "6" : e === -2 ? "5" : "3"
      // damp streaks run down the wall from the sill's ends
      if (e < -3) { for (const [x, n] of DAMP) if (a === x && e >= -3 - n) return "1"; return null }
      if (a < -2 || a >= aw + 2 || e > ah + 1) return null
      // the frame
      if (a < 0 || a >= aw || e >= ah) return a === -2 || a === aw + 1 || e === ah + 1 ? "4" : "5"
      // inside the frame: the left jamb's reveal (it faces the room), the sill's top, the sash
      if (a < WIN.jamb) return a === WIN.jamb - 1 ? "2" : a < 2 ? "4" : "3"
      if (e < WIN.sill) return e === 0 ? "5" : "4"
      if (!winGlass(a, e, aw, ah)) return a >= aw - WIN.side || e >= ah - WIN.top ? "4" : (e === WIN.transom + 1 || a % 2 === 0 ? "4" : "3")
      // the glass: drops, two running down, then the view
      for (const [dx, dy] of DROPS) if (a === dx && e === ah - dy) return "!h"
      for (const [dx, d0, sp] of [[10, 4, 3], [33, 15, 4]]) {
        const y = (d0 + f * sp) % 44
        if (a === dx && e === ah - y) return "!H"
        if (a === dx && (e === ah - y + 1 || e === ah - y + 2)) return "!h"
      }
      const memo = viewOf(o.memo, f)
      return view(o.x - o.gx, o.y - o.gy, f, memo)
    },
  })

  // ---------------------------------------------------------------- the door
  ISOKIT.opening("door_flat", {
    pad: [0.08, 0, 0.08, 0.08],
    // the hallway's light comes in only under the door
    pass: (s, h) => h < 0.025,
    paint(s, h, o) {
      const { a, e, aw, ah, f } = o
      if (a < 0 || a >= aw || e >= ah) {
        if (a < -2 || a > aw + 1 || e > ah + 1) return null
        return a === -2 || a === aw + 1 || e === ah + 1 ? "4" : "5"                       // the steel frame
      }
      if (e === 0) return "!x"                                                              // the gap: the hallway's light
      o.memo.door ??= ISOKIT.raster(aw, ah, (c) => FLAT_DOOR_FACE(c, aw, ah))
      o.memo.doorSize ??= (FLAT_DOOR_SIZE.aw = aw, FLAT_DOOR_SIZE.ah = ah, true)          // (the open leaf draws the same face)
      // the deadbolt's red LED: armed, a blink at the turn of the loop
      if (a >= aw - 6 && a <= aw - 5 && e === 38) return f === 0 || f === 6 ? "!r" : "!q"
      return o.memo.door(a, e)
    },
  })

  // ---------------------------------------------------------------- the pinboard
  ISOKIT.opening("pinboard", {
    pad: 0.06,
    paint(s, h, o) {
      const { aw, ah } = o
      o.memo.pin ??= ISOKIT.raster(aw + 4, ah + 4, (c) => {
        const W = aw + 4, H = ah + 4
        c.rect(0, 0, W, H, "A"); c.hline(0, 0, W, "P"); c.rect(2, 2, W - 4, H - 4, "O")   // the frame (its top in the strip's light), cork
        c.hline(2, 2, W - 4, "a")                                                          // the frame's shadow on the cork
        const pins = []
        // a print, 7x9: head and shoulders of someone she watches (hair, skin, the jacket's colour)
        const photo = (x, y, hair, jacket, bg = "5") => {
          c.rect(x, y, 7, 9, "H"); c.rect(x + 1, y + 1, 5, 6, bg)
          c.rect(x + 2, y + 2, 3, 3, "S"); c.hline(x + 2, y + 2, 3, hair); c.px(x + 2, y + 3, hair); c.px(x + 4, y + 4, "s")
          c.rect(x + 1, y + 5, 5, 2, jacket); c.px(x + 3, y + 5, "S")
          c.hline(x + 1, y + 7, 5, "h")                                                     // the caption, written on it
          pins.push([x + 3, y])
        }
        // a camera still: a street from above, grainy green (a frame printed off a feed)
        const still = (x, y) => {
          c.rect(x, y, 9, 7, "H"); c.rect(x + 1, y + 1, 7, 5, "0")
          c.line(x + 1, y + 5, x + 7, y + 2, "7"); c.px(x + 4, y + 3, "8"); c.px(x + 4, y + 2, "9"); c.px(x + 6, y + 1, "q")
          pins.push([x + 4, y])
        }
        const card = (x, y) => { c.rect(x, y, 8, 5, "H"); c.hline(x + 1, y + 2, 6, "h"); c.hline(x + 1, y + 3, 4, "h"); c.hline(x + 1, y + 1, 5, "5"); pins.push([x + 4, y]) }
        photo(4, 4, "1", "M")                       // the woman in the magenta coat
        photo(14, 6, "O", "4", "c")                 // a man under a street lamp
        still(23, 3)                                // cam 31's frame
        photo(34, 5, "k", "U")
        card(5, 17); card(29, 19)
        // a printed street map in the middle, the cameras on it, one ringed
        c.rect(15, 17, 11, 9, "h"); c.hline(15, 21, 11, "5"); c.vline(19, 17, 9, "5"); c.line(15, 25, 25, 18, "4")
        for (const [x, y] of [[17, 19], [22, 23], [24, 19]]) c.px(x, y, "C")
        c.px(21, 19, "q"); c.px(23, 19, "q"); c.px(22, 18, "q"); c.px(22, 20, "q")
        pins.push([20, 17])
        c.px(39, 17, "y"); c.rect(38, 17, 4, 4, "y"); c.hline(38, 18, 3, "j"); c.hline(38, 20, 2, "j")   // her own note
        // red string from pin to pin
        for (const [p, q] of [[0, 1], [1, 2], [2, 3], [1, 6], [6, 2], [4, 6], [6, 5], [0, 4]]) c.line(pins[p][0], pins[p][1], pins[q][0], pins[q][1], "r")
        for (const [x, y] of pins) c.px(x, y, "q")
      }, -2, -2)
      return o.memo.pin(o.a, o.e)
    },
  })

  // ---------------------------------------------------------------- the LED strip
  ISOKIT.opening("led_strip", {
    pad: [0.03, 0.04, 0.03, 0.05],
    halo: [{ color: "#ffd58a", reach: 0.9, power: 1.5 }],
    paint(s, h, o) {
      const { a, e, aw, ah, f } = o
      if (a < -1 || a > aw) return null
      if (e >= ah) return e === ah ? "4" : e === ah + 1 ? "5" : null                       // the aluminium rail over it
      if (e < 0) return e === -1 && a >= 0 && a < aw ? "3" : null                          // its lower lip
      // the lit band, its diodes; the cheap end by the door went dim, one diode there flickers
      const dim = a < 9, diode = a % 5 === 2
      if (a === 12 && diode) return [0, 1, 5, 9].includes(f) ? "!Q" : "!W"
      if (diode && e === 0) return dim ? "!R" : "!W"
      return dim ? "!Q" : "!R"
    },
  })

  // ---------------------------------------------------------------- small things on the walls
  // the tapped line: a fat cable from behind the rig up into a hole she cut under the ceiling, clipped
  ISOKIT.opening("conduit", {
    pad: [0.07, 0, 0.07, 0.06],
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (e >= ah - 3) {                                                    // the hole, the filler round it
        const d = Math.hypot(a - 1.5, e - (ah - 1))
        return d < 1.6 ? "k" : d < 2.6 ? "1" : d < 3.6 ? "3" : null
      }
      if (a < 0 || a >= aw) return null
      if ((e % 10) === 4 && a >= 0) return a === 0 || a === aw - 1 ? "4" : "5"   // a clip every 30 cm
      if (e === 23 || e === 24) return a === 1 || a === 2 ? "g" : null       // electrical tape over a splice
      return a === 1 ? "1" : a === 2 ? "k" : null
    },
  })
  // a socket; `up` (meters): a cable from it up the wall (the strip's power), `down` one hanging from its
  // plug (the phone's charger), `plug`: something plugged in
  ISOKIT.opening("socket", {
    pad: [0.04, 0.05, 0.04, 1.8],
    paint(s, h, o) {
      const { a, e, aw, ah } = o, op = o.op
      if (e >= ah + 1) return op.up && a === 2 && e < (op.up * 30) ? (e % 9 === 0 ? "4" : "1") : null
      if (e < 0) return op.down && a === 1 && -e <= op.down * 30 ? "1" : null                  // a plug's cable hanging down
      if (a < 0 || a >= aw) return null
      if (op.plug && a >= 1 && a <= 2 && e >= 1 && e <= 2) return "g"
      if (a === 0 || e === ah - 1) return "6"
      return (a === 1 || a === 2) && e === 2 ? "2" : "5"
    },
  })
  // the calendar by the door: a beach she has never seen (Lower Ninth never sees the sun), the month,
  // the rent ringed in red, the days before it crossed off
  ISOKIT.opening("calendar", {
    pad: [0, 0, 0, 0.1],
    paint(s, h, o) {
      const { aw, ah } = o
      o.memo.cal ??= ISOKIT.raster(aw, ah + 3, (c) => {
        c.px(fl(aw / 2), 0, "6"); c.px(fl(aw / 2) - 1, 1, "4"); c.px(fl(aw / 2) + 1, 1, "4")   // the nail, its string
        const y0 = 2
        c.rect(0, y0, aw, 6, "C"); c.rect(0, y0 + 3, aw, 1, "c"); c.rect(0, y0 + 4, aw, 2, "Q")  // sea, a wave's line, sand
        c.px(aw - 2, y0 + 1, "Q"); c.px(aw - 3, y0 + 1, "R"); c.px(aw - 2, y0, "R")           // the sun
        c.vline(2, y0 + 1, 4, "O"); c.hline(1, y0 + 1, 3, "7"); c.px(3, y0 + 2, "7")           // a palm
        c.rect(0, y0 + 6, aw, ah - 5, "H"); c.hline(0, y0 + 6, aw, "5")
        for (let r = 0; r < 3; r++) for (let q = 0; q < 4; q++) {
          const x = 1 + q * 2, y = y0 + 8 + r * 2, d = r * 4 + q
          c.px(x, y, d < 6 ? "4" : "h")
          if (d < 6) c.px(x, y, "4")
        }
        c.px(5, y0 + 11, "q"); c.px(4, y0 + 12, "q"); c.px(6, y0 + 12, "q"); c.px(5, y0 + 13, "q")   // ringed: the rent
      }, 0, 0)
      return o.memo.cal(o.a, o.e)
    },
  })
  // the building's vent: a grille under the ceiling, a slat bent, the dust it blows streaked down the wall
  ISOKIT.opening("vent", {
    pad: [0, 0.55, 0, 0],
    paint(s, h, o) {
      const { a, e, aw, ah } = o
      if (e < 0) return a >= 2 && a < aw - 2 && ih(a, 3) < 0.6 && -e < 4 + ih(a, 4) * 12 ? "1" : null
      if (a === 0 || a === aw - 1 || e === 0 || e === ah - 1) return e === ah - 1 ? "5" : "4"
      if (e % 2 === 1) return a === 4 && e === 3 ? "2" : "k"                               // between the slats: dark
      return a === 4 && e === 4 ? "k" : e === ah - 2 ? "4" : "3"                           // the slats; one bent
    },
  })
  // the intercom (its LED blinks: the building's net is up) and the light switch under it
  ISOKIT.opening("intercom", {
    paint(s, h, o) {
      const { a, e, aw, ah, f } = o
      if (a < 0 || a >= aw) return null
      if (e >= ah - 6) {
        if (a === 0 || e === ah - 1) return "5"
        if (e === ah - 2 && a === 2) return f % 6 === 0 ? "!c" : "!v"
        if (e === ah - 3 && a >= 1) return "!c"
        return (a + e) % 2 ? "2" : "4"
      }
      if (e < 4) return a === 0 || e === 3 ? "6" : e === 1 && a >= 1 && a <= 2 ? "4" : "5"
      return a === 2 ? "2" : null
    },
  })

  // ---------------------------------------------------------------- props
  // the fridge in the corner: old, its enamel gone grey, Teo's photo under a magnet, a takeaway menu,
  // the smart panel dead but for one pixel, a dent where it is kicked shut, rust at its foot; the kettle
  const TEO = [               // a polaroid: Teo as a boy on the roof, his orange vest
    "HHHHHHH",
    "HccccCH",
    "Hc11ccH",
    "HcSScCH",
    "HcPQPcH",
    "HcPPPcH",
    "HHHHHHH",
    "HHhhHHH",
  ]
  ISOKIT.prop("fridge", {
    draw(p, m) {
      const [u0, v0] = m.at, [du, dv] = m.foot, H = m.h
      const front = ISOKIT.first(
        ISOKIT.grid(TEO, 3, 33), ISOKIT.grid(["q"], 6, 34),
        ISOKIT.grid(["HHHHH", "MMMMM", "HNHHH", "H55HH", "HHHHH", "H555H", "HHHHH", "H55HH", "HHHHH"], 11, 24), ISOKIT.grid(["C"], 13, 25),
        ISOKIT.grid(["44444", "41114", "41@14", "44444"], 3, 50, { "@": "!v" }),
        (a, e, o) => {
          if (e <= 1) return e === 0 ? "2" : a % 3 === 1 ? "1" : "3"                          // the kick plate's vents
          if (e === 2 || e === 38) return "4"                                                // the doors' gaps
          if (a >= 15 && a <= 16 && ((e >= 24 && e <= 34) || (e >= 41 && e <= 48))) return a === 15 ? "H" : "4"   // handles
          if (e >= 3 && e <= 4 && [2, 3, 9, 14].includes(a)) return "O"                      // rust where the mop goes
          if (e === 9 && a >= 5 && a <= 8) return "4"; if (e === 10 && a >= 5 && a <= 8) return "6"   // the dent
          if (a === 0) return "6"
          return "5"
        })
      p.box(u0, v0, 0, du, dv, H,
        (lu, lv) => (lu > du - 0.05 || lv > dv - 0.05 ? "6" : "5"),
        (a, e, o) => (e <= 1 ? "2" : e === 38 ? "3" : a === o.aw - 1 ? "5" : (e > 26 && e < 32 && a > 6 && a < 12 ? (e === 27 || e === 31 ? "5" : "g") : "4")),   // the side: an old energy label
        (a, e, o) => { const k = front(a, e, o); return k === "!v" ? (p.f % 5 === 0 ? "!c" : "!v") : k })
      // the kettle on top, a jar of instant coffee beside it
      const [kx, ky] = p.P(u0 + 0.32, v0 + 0.34, H)
      p.at(u0 + 0.32, v0 + 0.34, H + 0.15, null)
      p.grid(kx - 4, ky - 8, [
        "...44...",
        "..4664..",
        ".466654.",
        "4566665444",
        "45566654.4",
        "4555665..4",
        "44555544.",
        ".444444..",
      ])
      const [jx, jy] = p.P(u0 + 0.12, v0 + 0.14, H)
      p.grid(jx - 1, jy - 5, ["OO", "PO", "QP", "PO", "OO"])
      p.at(null)
    },
  })

  // the deck: a steel desk against the right wall; on it the rig (her own build, an open frame), a wide
  // screen with a message open, an old CRT with a camera's feed in phosphor green, a small
  // portrait screen on a wall arm scrolling a log; the keyboard, a noodle cup; under it the battery box
  // and the power strip, cables
  ISOKIT.prop("deck_rig", {
    frames: NF,
    solid: (m) => [[m.at[0], m.at[1], 0.72, m.foot[0], m.foot[1], 0.05], [m.at[0] + 1.2, m.at[1] + 0.1, 0, 0.35, 0.3, 0.26]],
    footprint: (m) => [[m.at[0], m.at[1] + 0.6, 0.06, 0.06], [m.at[0] + m.foot[0] - 0.06, m.at[1] + 0.6, 0.06, 0.06], [m.at[0] + 1.2, m.at[1] + 0.1, 0.35, 0.3]],
    glows: [glow("vV8", { r: 3, strength: 0.3 })],
    draw(p, m, f) {
      const [u0, v0] = m.at, [du, dv] = m.foot, D = 0.72, T = 0.05, TOP = D + T
      // under the desk: the modesty panel at the back, the battery box with its LED, the power strip, cables
      p.box(u0 + 0.04, v0 + 0.03, 0.12, du - 0.08, 0.02, 0.58, () => "2", () => "1", () => "1")
      p.box(u0 + 1.2, v0 + 0.1, 0, 0.35, 0.3, 0.26, () => "3",
        (a, e, o) => (e === o.ah - 1 ? "3" : a % 3 === 1 && e > 2 && e < 6 ? "1" : "2"),
        (a, e, o) => (e === 5 && a === 2 ? (f % 6 < 5 ? "!8" : "!0") : e === 5 && a === 4 ? "!v" : e === o.ah - 1 ? "4" : e === 0 ? "1" : "2"))
      p.box(u0 + 0.35, v0 + 0.42, 0, 0.36, 0.07, 0.04, (lu) => (fl(lu * 32) % 3 === 1 ? "2" : "4"), () => "2", (a) => (a === 1 ? "!q" : a % 3 === 0 ? "!v" : "2"))
      const sag = (a, b, k, n = 12) => {                 // a cable from a to b (room meters), sagging
        const [x0, y0] = p.P(...a), [x1, y1] = p.P(...b), pts = []
        for (let i = 0; i <= n; i++) { const t = i / n; pts.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + k * 4 * t * (1 - t)]) }
        p.at((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, null)
        for (let i = 0; i < n; i++) p.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], "k")
        p.at(null)
      }
      sag([u0 + 0.4, v0 + 0.45, 0.04], [u0 + 1.25, v0 + 0.3, 0.2], 3)
      sag([u0 + 0.55, v0 + 0.45, 0.04], [u0 + 0.3, v0 + 0.1, 0.7], 8)
      sag([u0 + 0.66, v0 + 0.45, 0.04], [u0 + 1.0, v0 + 0.12, 0.7], 5)
      // legs (the back ones first), then the top
      for (const [lu, lv] of [[0.02, 0.02], [du - 0.06, 0.02], [0.02, dv - 0.06], [du - 0.06, dv - 0.06]])
        p.box(u0 + lu, v0 + lv, 0, 0.04, 0.04, D, () => "4", () => "3", () => "2")
      p.box(u0, v0, D, du, dv, T, (lu, lv) => (lv > dv - 0.04 ? "5" : "4"), (a, e) => (e === 0 ? "2" : "3"), (a, e) => (e === 1 ? "5" : "3"))
      // a cable from the rig over the desk's front edge, down to the power strip
      const [cx0, cy0] = p.P(u0 + 0.2, v0 + dv, TOP), [cx1, cy1] = p.P(u0 + 0.42, v0 + 0.45, 0.04)
      p.at(u0 + 0.25, v0 + dv, 0.4, "v"); p.line(cx0, cy0, cx0 - 1, cy0 + 6, "k"); p.line(cx0 - 1, cy0 + 6, cx1, cy1, "k"); p.at(null)

      // the small portrait screen on its wall arm, over the CRT: a log scrolling up
      p.box(u0 + 1.42, v0, 1.36, 0.04, 0.09, 0.04, () => "4", () => "3", () => "3")
      p.box(u0 + 1.3, v0 + 0.09, 1.18, 0.3, 0.03, 0.42, () => "2", () => "1",
        (a, e, o) => {
          if (a === 0 || a === o.aw - 1 || e === 0 || e === o.ah - 1) return "1"
          const row = e + f
          if (row % 2 === 0) { const n = 2 + fl(ih(fl(row / 2) % 6, 7) * 6); return a > 0 && a <= n ? (row % 8 === 0 ? "!v" : "!C") : "!c" }
          return "!c"
        })
      // the rig: an open steel frame, boards inside, a row of LEDs chasing, a fan turning
      p.box(u0 + 0.03, v0 + 0.05, TOP, 0.3, 0.32, 0.5,
        (lu, lv) => (lu < 0.04 || lu > 0.26 || lv < 0.04 || lv > 0.42 ? "5" : "1"),
        (a, e, o) => {
          if (a === 0 || a === o.aw - 1 || e === 0 || e === o.ah - 1) return a === o.aw - 1 ? "4" : "5"
          const cx = a - o.aw / 2, cy = e - o.ah / 2, d = Math.hypot(cx, cy)
          if (d < 5.2) {
            if (d < 1.2) return "4"
            const ang = Math.atan2(cy, cx) + (f % 3) * (Math.PI * 2 / 9)
            return d > 4.6 ? "4" : (Math.round(ang / (Math.PI * 2 / 3) * 3 + 30) % 3 === 0 ? "3" : "1")
          }
          return e % 4 === 1 ? "2" : "1"
        },
        (a, e, o) => {
          if (a === 0 || a === o.aw - 1 || e === 0 || e === o.ah - 1) return "5"
          if (e === 11 && a > 0 && a < o.aw - 1) return (a + f) % 5 === 0 ? "!8" : a % 2 ? "!v" : "!c"
          if (e === 7 && a > 1 && a < o.aw - 2) return "3"
          if (e >= 2 && e <= 5 && a >= 2 && a <= 6) return e === 5 ? "3" : (a % 2 ? "4" : "2")    // a heatsink
          return e % 3 === 1 ? "2" : "1"
        })
      // the wide screen on its stand: Frau Kessler's message open, the photo attached, the cursor blinking
      p.box(u0 + 0.64, v0 + 0.12, TOP, 0.26, 0.15, 0.02, () => "4", () => "2", () => "3")
      p.box(u0 + 0.75, v0 + 0.14, TOP, 0.04, 0.04, 0.12, () => "4", () => "2", () => "3")
      p.box(u0 + 0.37, v0 + 0.18, TOP + 0.08, 0.8, 0.04, 0.5, () => "2", () => "1",
        (a, e, o) => {
          const W = o.aw, H = o.ah
          if (a === 0 || a === W - 1 || e === 0 || e === H - 1) return "1"
          if (e === H - 2) return a < 4 ? "!v" : "!C"                                       // the window's title bar
          if (a >= W - 9 && a <= W - 3 && e >= 3 && e <= 10) {                               // the photo, attached
            if (a === W - 9 || a === W - 3 || e === 3 || e === 10) return "!C"
            return e >= 5 && e <= 7 && a >= W - 7 && a <= W - 5 ? (e === 7 ? "!8" : "!7") : "!c"
          }
          const line = H - 4 - e
          if (line >= 0 && line % 2 === 0 && line <= 9 && a > 1) {
            const n = [14, 11, 13, 8, 5][line / 2]
            if (a < 2 + n && (a * 7 + line) % 5 !== 0) return "!C"
            if (line === 8 && a === 2 + n + 1) return f % 6 < 3 ? "!V" : "!c"                  // the cursor
          }
          return "!c"
        })
      // the CRT: a grey case, the feed in phosphor green (a street, someone under an awning, a roll bar), REC
      p.box(u0 + 1.28, v0 + 0.04, TOP, 0.46, 0.44, 0.42, (lu, lv) => (lu > 0.42 || lv > 0.4 ? "G" : "g"),
        (a, e, o) => (e === o.ah - 1 ? "G" : a > 2 && a < o.aw - 2 && e > 5 && e < 11 && a % 2 === 0 ? "4" : "g"),
        (a, e, o) => {
          const W = o.aw, H = o.ah
          if (a === 0 || a === W - 1 || e === 0 || e === H - 1) return "g"
          if (a === 1 || a === W - 2 || e === 1 || e === H - 2) return "4"
          if (e === 2 && a >= W - 4) return a === W - 3 ? "!q" : "4"                          // the case's power light
          const roll = ((e + f) % 12 + 12) % 12 === 0
          if (e === H - 3 && a === 2) return f % 4 < 2 ? "!q" : "!0"                          // REC
          if (e === 3) return a % 3 === 0 ? "!8" : "!7"                                       // the timestamp
          if (a === 7 && e >= 5 && e <= 8) return e === 8 ? "!9" : "!8"                       // someone under an awning
          if (e === 9 && a > 3) return roll ? "!9" : "!8"                                     // the awning
          if (e > 9 && a < 5) return "!7"
          return roll ? "!7" : "!0"
        })
      // the keyboard (a few keys backlit), a noodle cup with its fork
      // the keyboard: four rows of keys on a dark tray, the arrows and a few keys backlit
      p.box(u0 + 0.42, v0 + 0.42, TOP, 0.7, 0.24, 0.03, (lu, lv) => {
        const row = fl(lv / 0.06), col = fl(lu / 0.05)
        if (lu < 0.02 || lu > 0.68 || lv < 0.02 || lv > 0.22) return "2"
        if (fl(lu * 32) % 2 === 1 && row !== 3) return "2"
        if (row === 3 && lu > 0.18 && lu < 0.5) return "4"                                   // the space bar
        if ((row === 1 && col === 3) || (row === 2 && col >= 11 && col <= 12)) return "!C"
        return "4"
      }, () => "2", (a) => (a % 4 === 1 ? "3" : "2"))
      // her jack: the cable coiled on the desk, its plug's cyan tip
      const [jx, jy] = p.P(u0 + 0.2, v0 + 0.56, TOP)
      p.at(u0 + 0.2, v0 + 0.56, TOP + 0.02, "up")
      p.grid(jx - 5, jy - 3, ["..kkkk...", ".k1..1k..", "k1....1k.", ".k1..1kkk", "..kkkk..!"], { "!": "!v" })
      p.at(null)
      const [nx, ny] = p.P(u0 + 1.66, v0 + 0.56, TOP)
      p.at(u0 + 1.66, v0 + 0.56, TOP + 0.08, null)
      p.grid(nx - 3, ny - 6, ["..G...", "..G...", "hHHHH.", "hMMMh.", "hMNMh.", ".hhh.."])
      p.at(null)
    },
  })

  // her chair, pulled out and turned from the desk: five-star foot on casters, the post, a seat with a
  // tear (the foam showing), the backrest mended with tape
  ISOKIT.prop("chair", {
    solid: (m) => [[m.at[0], m.at[1], 0.42, m.foot[0], m.foot[1], 0.08], [m.at[0] + 0.03, m.at[1], 0.5, m.foot[0] - 0.06, 0.07, 0.42]],
    draw(p, m) {
      const [u0, v0] = m.at, [du, dv] = m.foot, cu = u0 + du / 2, cv = v0 + dv / 2
      const [cx, cy] = p.P(cu, cv, 0.07)
      p.at(cu, cv, 0.05, "up")
      for (let i = 0; i < 5; i++) {
        const t = (i / 5) * Math.PI * 2 + 0.4, tu = cu + Math.cos(t) * 0.24, tv = cv + Math.sin(t) * 0.24
        const [x, y] = p.P(tu, tv, 0.05)
        p.line(cx, cy, x, y, "3"); p.line(cx, cy + 1, x, y + 1, "2")
        p.rect(x - 1, y + 1, 2, 2, "1")
      }
      p.at(null)
      p.box(cu - 0.025, cv - 0.025, 0.07, 0.05, 0.05, 0.35, () => "5", () => "4", (a) => (a === 0 ? "6" : "5"))
      // the backrest at the back (toward the desk), its cushion toward the room
      p.box(cu - 0.02, v0 + 0.03, 0.4, 0.04, 0.03, 0.2, () => "4", () => "3", () => "4")
      p.box(u0 + 0.03, v0, 0.55, du - 0.06, 0.07, 0.4, (lu) => "4",
        (a, e, o) => (e === o.ah - 1 ? "3" : "2"),
        (a, e, o) => {
          if (e === o.ah - 1 || a === 0 || a === o.aw - 1) return "4"
          if (e >= 7 && e <= 8 && a >= 2 && a <= o.aw - 3) return e === 8 ? "g" : "G"        // gaffer tape over a split
          if (e === 2 || e === o.ah - 3) return "2"
          return "3"
        })
      p.box(u0 + 0.02, v0 + 0.02, 0.42, du - 0.04, dv - 0.04, 0.08,
        (lu, lv) => {
          if (Math.hypot(lu - 0.28, lv - 0.25) < 0.06) return Math.hypot(lu - 0.28, lv - 0.25) < 0.035 ? "H" : "h"   // the tear, the foam
          return lu < 0.03 || lv < 0.03 ? "4" : "3"
        },
        (a, e) => (e === 2 ? "3" : "2"), (a, e) => (e === 2 ? "4" : "2"))
    },
  })

  // the noodle cups: the empties built into a tower, mouth down, 4-3-2-1 (a week and a half of dinners),
  // two of another brand; chopsticks stuck in the top one; the last one on the floor beside it
  const CUP = [".HHHH.", ".hMMh.", "hMNMMh", "hHHHHh", "hHHHHh", "hhhhhh"]
  ISOKIT.prop("cup_tower", {
    footprint: (m) => [[m.at[0] + 0.05, m.at[1] + 0.05, m.foot[0] - 0.1, m.foot[1] - 0.1]],
    draw(p, m) {
      const [u0, v0] = m.at, [du, dv] = m.foot
      const [x, y] = p.P(u0 + du / 2, v0 + dv / 2)
      for (let r = 0; r < 4; r++) for (let i = 0; i < 4 - r; i++) {
        const other = (r === 0 && i === 2) || (r === 2 && i === 0)
        p.at(u0 + du / 2, v0 + dv / 2 + 0.1, 0.1 + r * 0.2, "v")
        p.grid(x - 12 + i * 6 + r * 3, y - 6 - r * 6, CUP, other ? { M: "c", N: "C" } : {})
      }
      p.at(u0 + du / 2, v0 + dv / 2, 0.9, null)
      p.line(x + 1, y - 25, x + 3, y - 31, "P"); p.line(x + 2, y - 25, x + 5, y - 30, "O")
      // the last one, on its side on the floor in front
      const [fx, fy] = p.P(u0 + du - 0.06, v0 + dv - 0.02)
      p.at(u0 + du - 0.06, v0 + dv - 0.02, 0.05, "up")
      p.grid(fx - 3, fy - 4, ["hHHh.", "HMMMh", "HNMMh", "hHHh."])
      p.at(null)
    },
  })

  // the laundry under the window: a heap she means to take down to the machines (the purple hoodie, jeans
  // with a leg out along the floor, a grey tee thrown on last, a sock), in the window's light
  const HEAP = [
    "..............uuUUUu..........................",
    "...........uuUUUUUUUUu........................",
    ".........uuUUUUuuuuUUUu.......................",
    ".......uuUUUuuuu2uuuuUUu.......gGGg...........",
    ".....uuUUuuuuuuuuuu2uuuUu....gGGGGGg..........",
    "....uUUuuuu2uuuuuuuuuuuuu5555gGGgGGGg.........",
    "...uUUuuuuuuu2uuuuuuu455555555gGGGGGGg........",
    "..uUuuuuuu2uuuuuuu2455555555555gggGGGg........",
    ".hHuuuuuuuuuuuuuu244555555445555gggGg5........",
    "hHHHuuuu2uuuuu2uu445555554455555555555........",
    "hHHHHuuuuuuuuuuu24455555445555555555554.......",
    ".hHHHhuu2uuuuuu2444555554455555554455554......",
    "..hhhhh2222uuuu2444445544455555544555554......",
    ".....hhh..22222.4444444444444455555555544.....",
    "..............2..4444444444444444555555544....",
    "............................44444455555554H...",
    "...............................444445555hHHh..",
    "...................................4444hhHh...",
  ]
  ISOKIT.prop("laundry", {
    draw(p, m) {
      const [u0, v0] = m.at, [du, dv] = m.foot
      const [x, y] = p.P(u0, v0 + dv)
      p.at(u0 + du / 2, v0 + dv / 2, 0.2, "up")
      p.grid(x - 1, y - 12, HEAP)
      p.at(null)
    },
  })

  // the bed: a mattress on a wooden pallet, the pillow at the corner end, the blanket thrown back in a heap
  // and slipping over the side, her phone face up on it, its cable to the socket
  ISOKIT.prop("bed_pallet", {
    draw(p, m) {
      const [u0, v0] = m.at, [du, dv] = m.foot, PH = 0.14
      // the pallet: top and bottom boards, the blocks between, dark gaps
      const slats = (a, e, o, blocks) => {
        if (e === o.ah - 1) return "A"
        if (e === 0) return "O"
        const b = blocks.find(([b0, b1]) => a >= b0 && a <= b1)
        return b ? (a === b[0] ? "A" : "O") : "1"
      }
      p.box(u0, v0, 0, du, dv, PH, (lu, lv) => (fl(lu * 32) % 5 === 4 ? "O" : "A"),
        (a, e, o) => slats(a, e, o, [[0, 4], [30, 34], [59, 63]]),
        (a, e, o) => slats(a, e, o, [[0, 3], [14, 17], [28, 31]]))
      // the mattress
      const MT = 0.2, H0 = PH, H1 = PH + MT
      p.box(u0 + 0.03, v0 + 0.03, H0, du - 0.06, dv - 0.06, MT,
        (lu, lv) => (lu > du - 0.1 || lv > dv - 0.1 ? "6" : "5"),
        (a, e, o) => (e === o.ah - 1 ? "6" : e === 3 ? "5" : (a === 40 || a === 41) && e === 2 ? "3" : "4"),
        (a, e, o) => (e === o.ah - 1 ? "6" : e === 3 ? "5" : "4"))
      // the pillow at the head, by the corner
      p.box(u0 + 0.12, v0 + 0.1, H1, 0.72, 0.36, 0.08,
        (lu, lv) => (lu < 0.04 || lv < 0.04 ? "h" : Math.abs(lv - 0.2 - 0.05 * Math.sin(lu * 9)) < 0.025 ? "h" : "H"),
        (a, e) => "h", (a, e) => (e === 0 ? "g" : "h"))
      // the blanket, thrown back toward the foot in waves; each ridge lit on the side toward the strip
      const RIDGES = [[0.62, 0.07, 0.0, 0.08, 0.8], [0.9, 0.09, 1.7, 0.0, 0.88], [1.2, 0.06, 3.1, 0.12, 0.75], [1.45, 0.08, 0.8, 0.0, 0.88]]
      const fold = (u, v) => {
        for (const [vr, amp, ph, ua, ub] of RIDGES) {
          if (u < ua || u > ub) continue
          const s = v - (vr + amp * Math.sin(u * 7 + ph))
          if (s > -0.035 && s < 0.025) return "U"
          if (s >= 0.025 && s < 0.08) return "2"
        }
        return "u"
      }
      const BL0 = 0.5, BL1 = 1.75
      p.box(u0 + 0.03, v0 + BL0, H1, du - 0.02, BL1 - BL0, 0.05,
        (lu, lv) => {
          const e0 = 0.06 * Math.sin(lu * 6.5), e1 = 0.08 * Math.sin(lu * 5 + 1)
          if (lv < e0 + 0.02 || lv > BL1 - BL0 - 0.06 + e1) return null
          // her phone, face up, still on
          if (lu > 0.52 && lu < 0.62 && lv > 0.08 && lv < 0.2) return lu < 0.54 || lv < 0.1 ? "1" : "!c"
          return fold(lu, lv + BL0)
        },
        // over the side: the blanket hangs down toward the pallet, its hem uneven
        (a, e, o) => (e >= 1 - fl(4 + 3 * Math.sin(a * 0.4)) + 4 ? (a % 7 === 3 ? "2" : "u") : null),
        () => null)
      p.box(u0 + du - 0.01, v0 + BL0 + 0.15, 0.1, 0.01, BL1 - BL0 - 0.3, H1 - 0.1 + 0.05, null,
        (a, e, o) => (e > 2 + 2 * Math.sin(a * 0.5) ? (a % 6 === 2 ? "2" : "u") : null), null)
      // the phone's cable to the socket at the bed's head
      // from behind the pillow (the socket on the wall draws its drop) over the mattress to the phone
      const pts = [p.P(u0 + 0.05, 1.16, H1 + 0.01), p.P(u0 + 0.09, 1.42, H1 + 0.01), p.P(u0 + 0.5, v0 + BL0 + 0.1, H1 + 0.05), p.P(u0 + 0.57, v0 + BL0 + 0.14, H1 + 0.05)]
      p.at(0.2, 1.3, H1, "up")
      for (let i = 0; i + 1 < pts.length; i++) p.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], "1")
      p.at(null)
    },
  })

  // the old box: cardboard, its flaps open; her Nagi·wa badge on its lanyard hangs out over the front;
  // the dried cactus shows over the rim, papers under it; a shipping label, THIS WAY UP
  ISOKIT.prop("box_old", {
    draw(p, m) {
      const [u0, v0] = m.at, [du, dv] = m.foot, H = m.h, R = 0.03
      p.box(u0, v0, 0, du, dv, H,
        (lu, lv) => {
          if (lu < R || lv < R || lu > du - R || lv > dv - R) return "P"                       // the rim
          if (lu < 0.1 || lv < 0.1) return "O"                                                // the far walls' inner faces
          if (Math.abs(lu - lv - 0.02) < 0.02 && lu > 0.15) return "h"                        // old papers on the bottom
          if (Math.abs(lu - 0.3) < 0.015 && lv > 0.12) return "H"
          return "a"
        },
        (a, e, o) => (e === o.ah - 1 ? "A" : (a >= 4 && a <= 6 && e >= 7 && e <= 9) ? (e === 8 ? "O" : a === 5 ? "O" : "A") : a === 0 ? "A" : "O"),   // THIS WAY UP
        (a, e, o) => {
          if (e === o.ah - 1) return "P"
          if (a >= 7 && a <= 8) return "R"                                                      // packing tape down its face
          if (a >= 2 && a <= 5 && e >= 3 && e <= 6) return e === 6 ? "H" : e === 4 ? "5" : "H"  // a shipping label
          return a === 0 ? "P" : "A"
        })
      // flaps: one folded out to the left, one standing up at the back
      const [fx, fy] = p.P(u0, v0 + dv, H)
      p.at(u0, v0 + dv, H, "v")
      p.line(fx - 1, fy - 1, fx - 6, fy - 4, "P"); p.line(fx - 1, fy, fx - 6, fy - 3, "A"); p.line(fx - 2, fy, fx - 6, fy - 2, "A")
      const [bx, by] = p.P(u0 + 0.18, v0, H)
      p.at(u0 + 0.18, v0, H + 0.1, "v")
      p.rect(bx - 4, by - 5, 10, 5, "A"); p.hline(bx - 4, by - 5, 10, "P")
      // the cactus in its pot, dried brown
      const [kx, ky] = p.P(u0 + 0.22, v0 + 0.2, H - 0.05)
      p.at(u0 + 0.22, v0 + 0.2, H, "up")
      p.grid(kx - 3, ky - 10, ["...s...", ".s.s...", ".s.s.s.", ".sss.s.", "...sss.", "...s...", "..PPPP.", "..OPPO.", "...OO.."])
      // the lanyard over the front rim, the badge hanging from it: NAGI·WA, a cyan logo, her old photo
      const [lx, ly] = p.P(u0 + 0.3, v0 + dv, H)
      p.at(u0 + 0.3, v0 + dv + 0.02, H - 0.1, "v")
      p.line(lx - 2, ly - 1, lx - 1, ly + 4, "g"); p.line(lx, ly - 1, lx + 1, ly + 4, "G")
      p.grid(lx - 2, ly + 5, ["GHHHG", "HCCsH", "HCCSH", "HhhhH", "GHHHG"])
      p.at(null)
    },
  })

  return { vinyl }
})()

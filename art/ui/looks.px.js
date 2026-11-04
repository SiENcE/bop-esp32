// Street mode's close-ups: what Juno sees when she looks at something closely, shown in a window over the
// room (game/screens.js draws look_* at their own size, in the interface's frame; feed mode's zooms are
// art/ui/zooms.px.js). The world palette (art/lib/iso.js), so they read as the rooms do.
//
//   look_shaft   the stairwell of the Kessel Block from the 14th floor's rail, straight down (the game's
//                first top-down view, style guide §4): Juno's hands on the rail, the flights going round
//                the well floor after floor, each a little turned and darker, a green tube on each landing
//                (one flickering), and at the bottom, tiny, the lobby's tiles and its yellow sign
include("../lib/iso.js", { palette: true })
pal({ b: "#16201f", B: "#1e2d29", d: "#2a3f37", D: "#3d5849", E: "#5f7f68", F: "#d4f7dc" })   // the tubes' green, as the landing's

{
  const W = 128, H = 104, CX = 64, CY = 50
  // the depth is drawn compressed (as through a long lens), so the floors below stay apart as rings
  const FLOORS = 14, EYE = 1.6, STOREY = 0.98, WELL = 1.2, RING = 2.2, F = 40
  const TWIST = 0.07                                 // each floor a little turned: the flights go round
  const DEEP = ["6", "5", "4", "3", "2", "1"]        // a material's key by how far down it is
  const deep = (keys, i) => keys[Math.min(keys.length - 1, Math.floor(i * keys.length / 9))]

  /** where a pixel lies in floor i's own square coordinates (turned by its twist), in meters */
  const local = (x, y, i) => {
    const d = EYE + STOREY * i, a = -i * TWIST, px = (x + 0.5 - CX) * d / F, py = (y + 0.5 - CY) * d / F
    return [px * Math.cos(a) - py * Math.sin(a), px * Math.sin(a) + py * Math.cos(a)]
  }

  function shade(x, y, f) {
    for (let i = 0; i <= FLOORS; i++) {
      const [u, v] = local(x, y, i), r = Math.max(Math.abs(u), Math.abs(v))
      if (i === FLOORS) {
        // the lobby's floor at the bottom: its tiles in the cold light, the wet-floor sign
        if (Math.abs(u + 0.3) < 0.35 && Math.abs(v - 0.2) < 0.35) return "Y"
        return (Math.floor(u / 0.6) + Math.floor(v / 0.6)) % 2 ? "x" : "w"
      }
      if (r < WELL) {
        if (i === 0 && r > WELL - 0.06) return "6"                     // our own rail's inner edge
        continue                                                        // through the well, to the floor below
      }
      if (i === 0) {
        // our own landing round the well: plain concrete, darker toward the edges of the view
        if (r < WELL + 0.12) return Math.floor(((Math.abs(u) > Math.abs(v) ? v : u) + 10) / 0.2) % 2 ? "4" : "3"   // the rail's balusters
        return Math.hypot(x - CX, y - CY) > 70 ? "2" : "3"
      }
      if (r < RING) {
        // which side of the square: two flights and two landings each floor, the order turning
        const side = Math.abs(u) > Math.abs(v) ? (u > 0 ? 0 : 2) : (v > 0 ? 1 : 3), flight = (side + i) % 2 === 0
        if (r < WELL + 0.05) return deep(["G", "6", "5", "4", "3", "2"], i)     // the rail on the well's edge
        if (r < WELL + 0.12 && Math.floor((side % 2 ? u : v) / 0.2) % 2 === 0) return deep(["5", "4", "3", "2", "1"], i)   // balusters
        if (flight) {
          // the steps: their nosings across the flight, a tread and its shadow
          const along = side % 2 ? u : v, step = ((along + 10) / 0.28) % 1
          return step < 0.25 ? deep(["5", "4", "3", "2", "1", "1"], i) : deep(["4", "3", "2", "1", "1", "e"], i)
        }
        // a landing, its tube's green pool (the third floor's flickers)
        const pool = Math.hypot(Math.abs(u) - (RING + WELL) / 2, Math.abs(v) - (RING + WELL) / 2) < 0.38
        if (pool && !(i === 3 && f % 4 === 3)) return deep(["E", "D", "d", "B", "b", "b"], i)
        return deep(["4", "3", "2", "1", "e", "e"], i)
      }
      // outside the ring: on our own floor, the landing round the well; further down, the shaft's walls
      if (i === 0) return r < RING + 0.4 ? "4" : "3"
      return deep(["2", "1", "e", "e", "k"], i)
    }
    return "k"
  }

  anim("look_shaft", { w: W, h: H, frames: 4, ms: [500, 500, 500, 120] }, (c) => {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) c.px(x, y, shade(x, y, c.frame))
    // our rail across the bottom, Juno's hands on it, her yellow sleeves
    c.rect(0, H - 13, W, 4, "5"); c.hline(0, H - 13, W, "G"); c.hline(0, H - 10, W, "3"); c.rect(0, H - 9, W, 9, "2")
    for (const [x, flip] of [[16, false], [94, true]]) {
      const m = (dx) => (flip ? x + 18 - dx : x + dx)
      for (let r = 0; r < 11; r++) for (let dx = Math.max(0, 7 - r); dx < 18 - Math.max(0, r - 6); dx++) c.px(m(dx), H - 11 + r, r < 2 ? "Y" : dx < 5 ? "j" : "y")
      for (let dx = 4; dx < 14; dx++) c.px(m(dx), H - 14, dx % 3 === 0 ? "s" : "S")      // the fingers over the rail
      for (const dx of [5, 8, 11]) c.px(m(dx), H - 15, "S")
    }
  })
}

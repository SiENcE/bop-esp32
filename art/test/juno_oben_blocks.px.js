// Juno from above for the Drain Market (top-down as in Dreamweb, decided 2026-11-11), as BLOCKS for the user to choose a way
// before she is painted. Two ways, each in four directions (down, up, right drawn; left the engine's mirror of right), standing,
// walking (8 frames x 100 ms), talking (2 frames x 200 ms):
//
//   A  straight down, at draft F's scale (about 20 px a meter): the shoulders 13x7, the hood a 7x7 disc with its opening a dark
//      sliver at the front, the boots showing in front and behind as she steps, the satchel at her left hip. Drawn once in her
//      own frame (forward, her left) and turned, so every direction is the same figure: a real left costs nothing.
//   B  steep from above, as Dreamweb's people: 22 px tall, the hood's top large, the face under it (seen from the front), the
//      slicker foreshortened, short legs and the boots. Each view drawn on its own.
//
// Sheets: juno_oben_a_blatt, juno_oben_b_blatt (every pose of every direction); juno_top_<a|b>_<pose>_<dir> the anims (GIFs).
// Probes: juno_oben_probe_a, juno_oben_probe_b, a 320x180 window of draft F as the player sees it, Juno walking a loop by
// Ratz's stall; in B the crowd is drawn the same way (people as blocks in B's view), since the two can't be mixed.
// Colours: only keys the world palette and draft F already have (it is included, so its colours must not change).
include("drain_market_f_oben.px.js", { palette: true })

const JOB = (() => {
  const S8 = [3, 2, 0, -2, -3, -2, 0, 2]          // the left foot's way forward over the 8 walk frames; the right's is minus
  const S8A = [5, 3, 0, -3, -5, -3, 0, 3]         // A: from above a step of 0.7 m is 14 px, so each foot goes 5 px out and back
  const ARM = [-2, -1, 0, 1, 2, 1, 0, -1]          // the left arm: back while the left foot leads
  const JUNO = {
    coat: ["j", "y", "Y"], hood: ["y", "Y"], skin: ["s", "S"], hair: "2", leg: "2", legFar: "1", boot: "1",
    bag: ["g", "G"], strap: "g", seam: "j", eye: "k", open: "2", hooded: true, satchel: true, bootA: "3",
  }
  const COATS = [["1", "2", "3"], ["2", "3", "4"], ["1", "u", "U"], ["k", "n", "M"], ["o", "O", "P"], ["1", "=", "+"], ["O", "<", "P"],
    ["o", "p", "E"], ["3", "4", "5"], ["J", "K", "%"]]
  const HAIRS = ["k", "1", "o", "p", "s", "h", "E"]
  const hs = (a, b) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296 }
  /** a stranger's look: a coat and hair from draft F's crowd, no hood (some), no satchel */
  const stranger = (seed) => {
    const coat = COATS[Math.floor(hs(seed, 1) * COATS.length)], hair = HAIRS[Math.floor(hs(seed, 2) * HAIRS.length)]
    const hooded = hs(seed, 3) < 0.25
    return { ...JUNO, coat, hood: [coat[0], coat[1]], hair, seam: coat[0], leg: hs(seed, 4) < 0.5 ? "1" : "3", hooded, satchel: false, skin: hs(seed, 5) < 0.5 ? ["s", "S"] : ["o", "s"] }
  }

  /** a figure as named parts on a grid of pixels; painted, shaded and outlined at the end */
  const grid = () => {
    const m = new Map()
    const G = {
      m,
      set: (x, y, p) => m.set(x + "," + y, p),
      get: (x, y) => m.get(x + "," + y),
      rect: (x0, y0, x1, y1, p) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) G.set(x, y, p) },
      ell: (cx, cy, rx, ry, p) => {
        for (let y = Math.floor(cy - ry - 1); y <= Math.ceil(cy + ry + 1); y++) for (let x = Math.floor(cx - rx - 1); x <= Math.ceil(cx + rx + 1); x++) {
          const dx = (x - cx) / (rx + 0.5), dy = (y - cy) / (ry + 0.5)
          if (dx * dx + dy * dy <= 1) G.set(x, y, p)
        }
      },
      line: (x0, y0, x1, y1, p) => { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1); for (let i = 0; i <= n; i++) G.set(Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), p) },
    }
    return G
  }
  const BODY = new Set(["body"]), SLEEVE = new Set(["sleeve"]), HOOD = new Set(["hood", "seam"])
  /** paint the parts: light from above and the top left (lit where nothing of the same part is up or left, shaded where nothing
   *  is down or right, and under the hood); then the ink outline round the whole */
  const BODY_A = new Set(["body", "sleeve", "bodyTop"]), BODY_B = new Set(["body", "bodyTop"])
  const paint = (c, G, x0, y0, L, a = false) => {
    const out = new Map()
    const same = (set, x, y) => set.has(G.get(x, y))
    for (const [key, p] of G.m) {
      const [x, y] = key.split(",").map(Number)
      let k
      if (p === "bodyTop") k = L.coat[2]
      else if (p === "body" || p === "sleeve") {
        const set = a ? BODY_A : p === "body" ? BODY_B : SLEEVE
        const under = (dx, dy) => { const q = G.get(x + dx, y + dy); return HOOD.has(q) || q === "head" || q === "face" || q === "open" }
        const empty = (dx, dy) => !G.m.has((x + dx) + "," + (y + dy))
        if (a) k = under(0, -1) || under(-1, 0) || under(-1, -1) ? L.coat[0]                          // A: the hood's shadow to the lower right,
          : empty(0, -1) || empty(-1, 0) ? L.coat[2] : empty(0, 1) || empty(1, 0) ? L.coat[0] : L.coat[1]   // lit only at the figure's edge
        else if (under(0, -1)) k = L.coat[0]
        else if (!same(set, x, y - 1) || !same(set, x - 1, y)) k = L.coat[2]
        else if (!same(set, x, y + 1) || !same(set, x + 1, y)) k = L.coat[0]
        else k = L.coat[1]
      } else if (p === "hood" && a) {
        const rim = (dx, dy) => { const q = G.get(x + dx, y + dy); return !HOOD.has(q) && q !== "face" && q !== "open" }
        k = rim(1, 0) || rim(0, 1) ? L.hood[0] : L.hood[1]
      }
      else if (p === "hood") k = (!same(HOOD, x + 1, y) && G.get(x + 1, y) !== "face") || (!same(HOOD, x, y + 1) && G.get(x, y + 1) !== "face") ? L.hood[0] : L.hood[1]
      else if (p === "seam") k = L.seam
      else if (p === "head") k = G.get(x - 1, y) === undefined || G.get(x, y - 1) === undefined ? ({ k: "3", 1: "4", o: "E", p: "F", s: "S", h: "H", E: "F" }[L.hair] || L.hair) : L.hair
      else if (p === "face") k = L.skin[1]
      else if (p === "faceShade") k = L.skin[0]
      else if (p === "hand") k = L.skin[1]
      else if (p === "eye") k = L.eye
      else if (p === "mouth") k = L.skin[0]
      else if (p === "open") k = L.open
      else if (p === "fringe") k = L.hair === "2" ? "2" : L.hair
      else if (p === "bag") k = G.get(x, y - 1) !== "bag" || G.get(x - 1, y) !== "bag" ? L.bag[1] : L.bag[0]
      else if (p === "strap") k = L.strap
      else if (p === "leg") k = L.leg
      else if (p === "legFar") k = L.legFar
      else if (p === "boot") k = !a ? L.boot : G.get(x, y - 1) !== "boot" || G.get(x - 1, y) !== "boot" ? "5" : L.bootA
      out.set(key, k)
    }
    const ink = new Set()
    for (const key of G.m.keys()) {
      const [x, y] = key.split(",").map(Number)
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!G.m.has((x + dx) + "," + (y + dy))) ink.add((x + dx) + "," + (y + dy))
    }
    for (const key of ink) { const [x, y] = key.split(",").map(Number); c.px(x0 + x, y0 + y, "k") }
    for (const [key, k] of out) { const [x, y] = key.split(",").map(Number); c.px(x0 + x, y0 + y, k) }
  }

  /** the pose's numbers: feet forward, arms, the foot lifted, the body's bob, the head's turn, talking */
  const pose = (kind, i) => {
    if (kind === "walk") return { fl: S8[i], fr: -S8[i], al: ARM[i], ar: -ARM[i], liftL: i === 6 ? 1 : 0, liftR: i === 2 ? 1 : 0, bob: i === 2 || i === 6 ? -1 : 0, look: 0, talk: false }
    if (kind === "talk") return { fl: 0, fr: 0, al: 0, ar: i === 1 ? 2 : 0, liftL: 0, liftR: 0, bob: 0, look: 0, talk: i === 1, nod: i === 1 ? 1 : 0 }
    return { fl: 0, fr: 0, al: 0, ar: 0, liftL: 0, liftR: 0, bob: 0, look: i === 1 ? 1 : i === 3 ? -1 : 0, talk: false }
  }

  // ---------------------------------------------------------------- A: straight down
  // Drawn in her own frame: f forward, s to her left; turned onto the screen by the direction.
  const TURN = { down: (f, s) => [s, f], up: (f, s) => [-s, -f], right: (f, s) => [f, -s], left: (f, s) => [-f, s] }
  const drawA = (c, x, y, dir, kind, i, L = JUNO) => {
    const P = pose(kind, i), T = TURN[dir], G = grid()
    const set = (f, s, p) => { const [dx, dy] = T(f, s); G.set(dx, dy, p) }
    const ell = (cf, cs, rf, rs, p) => {
      for (let f = Math.floor(cf - rf - 1); f <= Math.ceil(cf + rf + 1); f++) for (let s = Math.floor(cs - rs - 1); s <= Math.ceil(cs + rs + 1); s++) {
        const a = (f - cf) / (rf + 0.5), b = (s - cs) / (rs + 0.5); if (a * a + b * b <= 1) set(f, s, p)
      }
    }
    const line = (f0, s0, f1, s1, p) => { const n = Math.max(Math.abs(f1 - f0), Math.abs(s1 - s0), 1); for (let j = 0; j <= n; j++) set(Math.round(f0 + (f1 - f0) * j / n), Math.round(s0 + (s1 - s0) * j / n), p) }
    // the boots: from above they show only in front of and behind the shoulders as she steps; standing, the toes
    const stand = kind === "walk" ? 0 : 1
    const fa = kind === "walk" ? S8A[i] : 0
    ell(fa + stand, 2, 1.6, 0.9, "boot"); ell(-fa + stand, -2, 1.6, 0.9, "boot")                 // (A paints them lighter, steel, to read on the floor)
    if (L.satchel) for (let f = -3; f <= 0; f++) for (let s = 5; s <= 8; s++) set(f, s, "bag")          // the satchel at her left hip
    ell(0, 0, 3, 5.4, "body")                                                                       // the shoulders
    ell(P.al, 6, 1.6, 0.8, "sleeve"); ell(P.ar, -6, 1.6, 0.8, "sleeve")                             // the arms hanging, swinging
    if (P.al >= 1) set(P.al + 2, 6, "hand")
    if (P.ar >= 1) set(P.ar + 2, -6, "hand")
    const hf = P.nod || 0
    if (L.hooded) {
      ell(hf - 0.5, 0, 2.6, 3, "hood")                                                             // a little back: the hood hangs behind her head
      for (let s = -1; s <= 1; s++) set(hf + 2, s + P.look, s === 0 ? "face" : "open")             // the hood's opening, her fringe in it
    } else {
      ell(hf, 0, 2, 2, "head")
    }
    paint(c, G, x, y, L, true)
  }

  // ---------------------------------------------------------------- B: steep from above
  // Screen coordinates, (0, 0) the feet's middle on the ground: 22 px from the hood's top to the soles.
  const drawB = (c, x, y, dir, kind, i, L = JUNO) => {
    const P = pose(kind, i), G = grid(), b = P.bob, nod = P.nod || 0
    const view = dir === "left" ? "right" : dir
    const legs = () => {
      if (view === "right") {
        // far leg first, a row higher; the near leg (her right) over it
        for (const [off, lift, part, dy] of [[P.fl, P.liftL, "legFar", -1], [P.fr, P.liftR, "leg", 0]]) {
          const xc = off, bot = dy - lift
          G.rect(xc - 1, -5 + b, xc + 1, bot - 2, part); G.rect(xc - 1, bot - 1, xc + 2, bot, "boot")
        }
        return
      }
      // down: the leading foot lower (nearer), up: higher; her left leg on the screen's right going down, left going up
      const sideL = view === "down" ? 1 : -1
      for (const [off, lift, side] of [[P.fl, P.liftL, sideL], [P.fr, P.liftR, -sideL]]) {
        const fwd = view === "down" ? off : -off
        const bot = (fwd >= 0 ? 0 : Math.round(fwd * 0.67)) - lift
        const x0 = side > 0 ? 1 : -3
        G.rect(x0, -5 + b, x0 + 2, bot - 2, "leg"); G.rect(x0, bot - 1, x0 + 2, bot, "boot")
      }
    }
    // the slicker from the shoulders (-13) to the hem (-5); from above the shoulders' tops show as a lit band two rows deep
    const body = (half) => { for (let r = -13; r <= -5; r++) { const h = half(r); G.rect(-h, r + b, h, r + b, r <= -12 ? "bodyTop" : "body") } }
    if (view === "down" || view === "up") {
      const lsx = view === "down" ? 1 : -1                                                       // her left on the screen
      legs()
      if (L.satchel) { const bx = lsx > 0 ? 6 : -9; G.rect(bx, -9 + b, bx + 3, -5 + b, "bag") }
      body((r) => r === -13 ? 4 : r <= -8 ? 5 : 6)
      if (L.satchel) G.line(-4 * lsx, -12 + b, 6 * lsx, -8 + b, "strap")
      for (const [arm, side] of [[P.al, lsx], [P.ar, -lsx]]) {
        const ax = side > 0 ? 6 : -7, d = view === "down" ? Math.sign(arm) : -Math.sign(arm)
        const raise = kind === "talk" && arm > 0 ? -3 : 0
        G.rect(ax, -12 + b, ax + 1, -7 + b + Math.min(d, 0) + raise, "sleeve"); G.rect(ax, -6 + b + d + raise, ax + 1, -6 + b + d + raise, "hand")
      }
      const hy = -17 + b + nod, lk = P.look
      if (L.hooded) {
        G.ell(view === "up" ? lk : 0, hy, 4, 4, "hood")
        if (view === "down") {
          G.rect(-2 + lk, hy + 1, 2 + lk, hy + 1, "fringe")
          G.rect(-2 + lk, hy + 2, 2 + lk, hy + 3, "face"); G.rect(-1 + lk, hy + 4, 1 + lk, hy + 4, "face")
          G.set(-1 + lk, hy + 2, "eye"); G.set(1 + lk, hy + 2, "eye"); G.set(lk, hy + 4, P.talk ? "eye" : "mouth")
        } else G.line(lk, hy - 3, lk, hy + 3, "seam")
      } else {
        G.ell(view === "up" ? lk : 0, hy + 1, 3, 3, "head")
        if (view === "down") { G.rect(-2 + lk, hy + 2, 2 + lk, hy + 3, "face"); G.rect(-1 + lk, hy + 4, 1 + lk, hy + 4, "face"); G.set(-1 + lk, hy + 2, "eye"); G.set(1 + lk, hy + 2, "eye"); G.set(lk, hy + 4, P.talk ? "eye" : "mouth") }
      }
    } else {
      // right: seen from the side and above; the satchel on the far hip behind her, the strap over the near shoulder
      legs()
      if (L.satchel) G.rect(-5, -10 + b, -2, -7 + b, "bag")
      body((r) => r <= -8 ? 3 : 4)
      if (L.satchel) G.line(1, -13 + b, 3, -8 + b, "strap")
      const ax = -1 + P.ar, raise = P.talk ? -3 : 0
      G.rect(ax, -12 + b, ax + 1, -7 + b + raise, "sleeve"); G.rect(ax + (P.ar > 0 ? 1 : 0), -6 + b + raise, ax + 1 + (P.ar > 0 ? 1 : 0), -6 + b + raise, "hand")
      const hy = -17 + b + nod + (P.look === 1 ? 1 : 0)
      if (L.hooded) {
        G.ell(0, hy, 4, 4, "hood")
        G.rect(2, hy, 3, hy + 3, "face"); G.set(2, hy, "fringe"); G.set(3, hy, "fringe"); G.set(3, hy + 1, "eye"); G.set(4, hy + 2, "face"); G.set(3, hy + 3, P.talk ? "eye" : "mouth")
        G.line(-2, hy - 3, -3, hy + 3, "seam")
      } else {
        G.ell(0, hy + 1, 3, 3, "head")
        G.rect(2, hy + 1, 3, hy + 3, "face"); G.set(3, hy + 1, "eye"); G.set(4, hy + 2, "face")
      }
    }
    if (dir === "left") { const F = grid(); for (const [key, p] of G.m) { const [gx, gy] = key.split(",").map(Number); F.set(-gx, gy, p) } paint(c, F, x, y, L) }
    else paint(c, G, x, y, L)
  }

  // ---------------------------------------------------------------- the probes: a window of draft F, Juno walking a loop
  // The loop: in front of Ratz's stall, 36 px across and 12 down, 2 px a frame across and 1 down (Dreamweb's people walk slower up and down)
  const JX = DMF.JUNO.x, JY = DMF.JUNO.y
  const LOOP = { x0: JX - 18, y0: JY + 2, x1: JX + 18, y1: JY + 14 }
  const across = (LOOP.x1 - LOOP.x0) / 2, down = LOOP.y1 - LOOP.y0
  const legs = [["right", 2, 0, across], ["down", 0, 1, down], ["left", -2, 0, across], ["up", 0, -1, down]]
  const FRAMES = legs.reduce((a, l) => a + l[3], 0)
  const at = (t) => {
    let x = LOOP.x0, y = LOOP.y0
    for (const [dir, dx, dy, n] of legs) { if (t < n) return { x: x + dx * t, y: y + dy * t, dir }; x += dx * n; y += dy * n; t -= n }
    return { x, y, dir: "up" }
  }
  const VIEW = { x: JX - 160, y: JY - 86 }
  return { drawA, drawB, stranger, FRAMES, at, LOOP, VIEW, JUNO }
})()

// ---------------------------------------------------------------- the anims (GIFs of every pose and direction)
for (const v of ["a", "b"]) {
  const draw = v === "a" ? JOB.drawA : JOB.drawB, w = 23, h = v === "a" ? 23 : 29, ox = 11, oy = v === "a" ? 11 : 26
  for (const dir of ["down", "up", "right"]) {
    anim(`juno_top_${v}_walk_${dir}`, { w, h, frames: 8, ms: 100 }, (c) => draw(c, ox, oy, dir, "walk", c.frame))
    anim(`juno_top_${v}_idle_${dir}`, { w, h, frames: 4, ms: [1400, 700, 1400, 700] }, (c) => draw(c, ox, oy, dir, "idle", c.frame))
    anim(`juno_top_${v}_talk_${dir}`, { w, h, frames: 2, ms: 200 }, (c) => draw(c, ox, oy, dir, "talk", c.frame))
  }
}

// ---------------------------------------------------------------- the sheets: every pose of every direction, on the market's floor
const blatt = (v) => (c) => {
  const draw = v === "a" ? JOB.drawA : JOB.drawB, cw = 22, ch = v === "a" ? 24 : 30, top = 22
  c.rect(0, 0, 320, 200, "1")
  TXT.draw(c, 4, 2, v === "a" ? "A  STRENG VON OBEN (13 PX, WIE ENTWURF F)" : "B  STEIL SCHRÄG VON OBEN (22 PX, WIE DREAMWEB)", "v", { font: "hud" })
  const cols = [["STEHEN", "idle", 0], ["SCHAUT", "idle", 1]].concat([0, 1, 2, 3, 4, 5, 6, 7].map((i) => [i === 0 ? "GANG 1-8" : "", "walk", i])).concat([["REDEN", "talk", 0], ["", "talk", 1]])
  cols.forEach(([lab, , ], j) => { if (lab) TXT.draw(c, 40 + j * cw, j === 1 ? top - 13 : top - 7, lab, "6", { font: "hud" }) })
  const rows = [["UNTEN", "down"], ["OBEN", "up"], ["RECHTS", "right"], ["LINKS", "left"]]
  rows.forEach(([lab, dir], r) => {
    const cy = top + r * ch
    c.rect(0, cy, 320, ch - 1, r & 1 ? "e" : "f")
    TXT.draw(c, 4, cy + (ch >> 1) - 3, lab, "6", { font: "hud" })
    if (dir === "left") TXT.draw(c, 4, cy + (ch >> 1) + 3, "GESPIEGELT", "4", { font: "hud" })
    cols.forEach(([, kind, i], j) => {
      const x = 40 + j * cw + 11, y = v === "a" ? cy + (ch >> 1) : cy + ch - 4
      if (dir === "left" && v === "a") {
        // the engine's mirror of the right view (A could have a real left for nothing: her satchel stays on her left)
        const tmp = new Map(), cc = { px: (px, py, k) => tmp.set(px + "," + py, k) }
        draw(cc, 0, 0, "right", kind, i)
        for (const [key, k] of tmp) { const [px, py] = key.split(",").map(Number); c.px(x - px, y + py, k) }
      } else draw(c, x, y, dir, kind, i)
    })
  })
  const by = top + 4 * ch + 2
  TXT.draw(c, 4, by, v === "a" ? "EIN BILD, GEDREHT: ALLE RICHTUNGEN GLEICH, EIN ECHTES LINKS GRATIS" : "JEDE ANSICHT EIGEN, LINKS IST RECHTS GESPIEGELT (TASCHE WECHSELT)", "5", { font: "hud" })
}
sprite("juno_oben_a_blatt", { w: 320, h: 22 + 4 * 24 + 10 }, blatt("a"))
sprite("juno_oben_b_blatt", { w: 320, h: 22 + 4 * 30 + 10 }, blatt("b"))

// ---------------------------------------------------------------- the probes
// The market painted once with a free strip for the loop (A: F's own crowd; B: the crowd as B's blocks, sorted by their feet),
// then a 320x180 window of it, Juno walking her loop.
const keep = [JOB.LOOP.x0 - 4, JOB.LOOP.y0 - 22, JOB.LOOP.x1 + 4, JOB.LOOP.y1 + 2]
sprite("_jtop_market_a", { w: 640, h: 360 }, (c) => DMF.paint(c, { juno: false, keep }))
sprite("_jtop_market_b", { w: 640, h: 360 }, (c) => DMF.paint(c, {
  juno: false, keep,
  crowd: (c2, list) => {
    const dirs = ["down", "up", "right", "left"]
    for (const [x, y, seed] of list.slice().sort((p, q) => p[1] - q[1])) {
      const h = (seed * 2654435761 >>> 0) / 4294967296
      JOB.drawB(c2, x, y + 6, dirs[Math.floor(h * 4)], h < 0.3 ? "walk" : "idle", Math.floor(h * 97) % 8 % (h < 0.3 ? 8 : 4), JOB.stranger(seed))
    }
  },
}))
for (const v of ["a", "b"]) {
  scene(`juno_oben_probe_${v}`, { w: 320, h: 180, frames: JOB.FRAMES, fps: 10, bg: "k" }, (c) => {
    c.stamp(`_jtop_market_${v}`, -JOB.VIEW.x, -JOB.VIEW.y)
    const p = JOB.at(c.frame), x = p.x - JOB.VIEW.x, y = p.y - JOB.VIEW.y
    if (v === "a") JOB.drawA(c, x, y, p.dir, "walk", c.frame % 8)
    else JOB.drawB(c, x, y + 6, p.dir, "walk", c.frame % 8)
  }, glow("m", { r: 5, strength: 0.45 }), glow("vV", { r: 4, strength: 0.3 }), glow("RW", { r: 4, strength: 0.35 }), glow("q", { r: 3, strength: 0.6 }))
}

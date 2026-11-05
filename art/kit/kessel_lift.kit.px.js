// The Kessel Block's lift, the same on every floor: out of order. Registered with ISOKIT (art/lib/isokit.js), drawn in room
// meters, lit by the bake; include after the room's own kit, which brings art/lib/text.js. The lift only goes up and down, so
// its doors stand at the same place in every floor's map (u 0.3 to 1.4 of the right back wall).
//   openings lift_doors (brushed steel, a dent, a taped sign, the dead floor display, the call button's amber)
// The city's text is English art (style guide §8a); Juno says what it means in German.
const KLIFT = (() => {
  const fl = Math.floor

  // ---------------------------------------------------------------- the lift: out of order
  ISOKIT.opening("lift_doors", {
    pad: [0.08, 0, 0.16, 0.42],
    halo: [{ color: "#eea040", reach: 0.35, power: 1.1, rect: [0.42, 2.2, 0.78, 2.38] }],
    paint(s, h, o) {
      const { a, e, aw, ah, f } = o, mid = fl(aw / 2)
      // over the doors: the floor display, dead but for its dashes, and the lamp blinking amber
      if (e >= ah + 3) {
        if (e >= ah + 4 && e <= ah + 9 && a >= mid - 6 && a <= mid + 5) {
          if (e === ah + 4 || e === ah + 9 || a === mid - 6 || a === mid + 5) return "5"
          return e === ah + 6 && a >= mid - 4 && a <= mid + 3 && a % 2 === 0 ? (f % 6 < 3 ? "!Q" : "!O") : "k"
        }
        return null
      }
      // the call button on the right of the frame, its light amber
      if (a >= aw + 2) {
        if (a >= aw + 2 && a <= aw + 4 && e >= 32 && e <= 38) return a === aw + 3 && e === 35 ? (f % 6 < 3 ? "!Q" : "!R") : "6"
        return null
      }
      if (a < 0 || a >= aw || e >= ah) {
        if (a < -2 || a > aw + 1 || e > ah + 1) return null
        return a === -2 || a === aw + 1 || e === ah + 1 ? "4" : "5"
      }
      o.memo.lift ??= ISOKIT.raster(aw, ah, (c) => {
        c.rect(0, 0, aw, ah, "5")
        for (let x = 1; x < aw; x += 3) c.vline(x, 2, ah - 4, x % 2 ? "6" : "4")   // brushed
        c.vline(mid, 0, ah, "2"); c.vline(mid - 1, 0, ah, "4")                       // the seam
        c.rect(mid + 5, 38, 3, 2, "4"); c.px(mid + 6, 40, "3")                         // a dent, kicked
        // the sign taped across the seam: OUT OF ORDER (the city's text, English)
        const sx = mid - 12, sy = 14
        c.rect(sx, sy, 25, 13, "H"); c.hline(sx, sy + 12, 25, "h")
        c.rect(sx - 1, sy - 1, 4, 2, "G"); c.rect(sx + 22, sy - 1, 4, 2, "G")
        TXT.draw(c, sx + 2, sy + 1, "OUT OF", "1", { font: "hud" }); TXT.draw(c, sx + 2, sy + 7, "ORDER", "1", { font: "hud" })
      }, 0, 0)
      return o.memo.lift(a, e)
    },
  })
  return {}
})()

// Nagi·wa's patrol drone (style guide §5: red is the system's eye), at the new scale: about 0.8 m across, so
// 27 px; seen from a little above, as street mode sees it. It hovers: the body bobs a pixel, the two rotors
// are a blur that flickers, the red eye in its sensor band pulses, its searchlight's lens glows under it (the
// beam itself and its pool on the street are the room's: a haze and an added lamp).
//   drone_hover   27x16 inside the outline, 12 frames at 10 fps, pivot bottom-centre (the lens)
// Drawn from mockup C's drone (art/mockups/mock_c_iso.px.js), a little bigger and with the steel shaded.
;(() => {
pal({
  k: "#0c0e1a", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  r: "#7e1420", q: "#ff3a3a", x: "#6c809a", H: "#b9c6d8", V: "#dafcff",
})
const BOB = [0, 0, -1, -1, -1, 0, 0, 1, 1, 1, 0, 0]

anim("drone_hover", { w: 27, h: 16, frames: 12, fps: 10, outline: "k", pivot: "bottom" }, (c) => {
  const f = c.frame ?? 0, x = 13, y = 9 + BOB[f]
  // the arms out to two rotor rings, the blades a blur (wide and narrow by turns)
  for (const sd of [-1, 1]) {
    c.line(x + sd * 6, y - 1, x + sd * 9, y - 3, "2")
    c.ellipse(x + sd * 10, y - 4, 3, 1, "1")
    c.hline(x + sd * 10 - (f % 2 ? 3 : 2), y - 5, f % 2 ? 7 : 5, f % 2 ? "6" : "5"); c.px(x + sd * 10, y - 5, "H")
  }
  // the body: a flat lens of steel, lit from above
  c.ellipse(x, y, 7, 3, "3"); c.ellipse(x - 1, y - 1, 5, 2, "4"); c.hline(x - 3, y - 3, 5, "5"); c.px(x - 2, y - 3, "6")
  // the sensor band, its red eye turned down-left, pulsing
  const eye = f % 6 < 4 ? "q" : "r"
  c.hline(x - 6, y + 1, 12, "1"); c.px(x - 5, y + 1, "r"); c.px(x - 4, y + 1, eye); c.px(x - 3, y + 1, eye); c.px(x - 2, y + 1, "r")
  // the searchlight's housing under it, its lens bright
  c.hline(x - 2, y + 3, 5, "2"); c.hline(x - 1, y + 4, 3, "x"); c.px(x, y + 4, "V")
}, glow("q", { r: 3, strength: 0.6 }), glow("V", { r: 3, strength: 0.4 }))
})()

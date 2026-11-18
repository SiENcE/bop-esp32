// The look from Ines' balcony (the user's wish, 2026-11-18: "einen Blick übers Wasser und den Sumpf erhaschen"), as a BLOCK for the user's
// approval: what Juno sees when she looks out over the railing, a still with a little rain, as the look down from the ledge
// (art/ui/look_strasse.px.js). Over the roofs of the Ninth stepping down to the flood; the water wide and dark, the city's lights
// lying on it; on the far side the swamp, the drowned forest as a black band, two green lights in it (Lantern's antennas: nobody
// knows yet, the look only says there are lights); above, the Crown's glow in the low clouds. In front, the railing's top and two of
// its posts. 320x180.
include("../lib/iso.js", { palette: true })
pal({ "ĝ": "#3e5a3a", "Ĝ": "#7fd06a" })

scene("ines_balkon_blick_blocks", { w: 320, h: 180, bg: "k" }, (c) => {
  const bay = ISO.bay, ih = ISO.ihash
  // the sky: low clouds lit from above by the Crown, darker toward the horizon, then the city's haze low over the water
  for (let y = 0; y < 82; y++) for (let x = 0; x < 320; x++) {
    const glow = Math.max(0, 1 - Math.hypot((x - 210) / 160, y / 50))
    c.px(x, y, bay(x, y) < glow * 0.8 ? "U" : bay(x, y) < 0.3 + glow * 0.5 ? "u" : y > 64 && bay(x, y) < (y - 64) / 20 ? "u" : "1")
  }
  // the swamp on the far side: the drowned forest, crowns against the haze; two green lights in it
  for (let x = 0; x < 320; x++) {
    const top = 78 - Math.round(ih(x >> 2, 3) * 6 + Math.sin(x / 17) * 2)
    for (let y = top; y < 90; y++) c.px(x, y, y < top + 2 ? "2" : "k")
  }
  for (const [x, y] of [[196, 80], [231, 82]]) { c.px(x, y, "Ĝ"); c.px(x, y - 1, "ĝ"); c.px(x, y + 1, "ĝ") }
  // the water: wide and dark, the lights lying on it in streaks, the two green ones too
  for (let y = 90; y < 128; y++) for (let x = 0; x < 320; x++) c.px(x, y, (x * 3 + y * 7) % 23 === 0 ? "t" : y % 3 === 0 ? "f" : "e")
  for (const [x, k] of [[196, "ĝ"], [231, "ĝ"], [60, "P"], [120, "M"], [280, "C"]]) for (let y = 92; y < 120; y += 3) c.hline(x - 1 + ((y >> 2) % 3), y, 2, k)
  // the roofs of the Ninth stepping down to the water: blocks, a lit window here and there, a water tank, an antenna
  const ROOFS = [[0, 118, 70], [70, 126, 60], [130, 112, 50], [180, 130, 70], [250, 120, 70]]
  for (const [x0, y0, w] of ROOFS) {
    c.rect(x0, y0, w, 180 - y0, "2"); c.hline(x0, y0, w, "4")
    for (let y = y0 + 6; y < 180; y += 7) for (let x = x0 + 4; x < x0 + w - 4; x += 6) if (ih(x, y) < 0.18) c.rect(x, y, 2, 3, ih(y, x) < 0.5 ? "Q" : "C")
  }
  c.ellipse(150, 106, 8, 5, "3"); c.rect(142, 106, 16, 6, "3"); c.vline(290, 96, 24, "4")
  // rain
  for (let i = 0; i < 160; i++) { const x = Math.floor(ih(i, 1) * 320), y = Math.floor(ih(i, 2) * 180); c.line(x, y, x + 1, y + 3, "5") }
  // the railing in front: its top rail across the bottom, two posts
  c.rect(0, 160, 320, 4, "6"); c.hline(0, 164, 320, "4")
  for (const x of [40, 250]) c.rect(x, 164, 5, 16, "5")
})

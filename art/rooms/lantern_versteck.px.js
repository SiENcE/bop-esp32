// lantern_versteck baked from its map (art/rooms/lantern_versteck.map.js) with its kit (art/kit/lantern_versteck.kit.px.js) and the light
// (art/lib/isokit.js); made by tools/new-room.mjs. More kits: include them below (their pieces show in the Iso tab's lists).
//
// Exports (the atlas takes lantern_versteck_* only): lantern_versteck_bg (320x180) and a sprite for each prop, outlined, pivot bottom-centre.
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/lantern_versteck.map.js")
include("../lib/isokit.js")
include("../kit/lantern_versteck.kit.px.js", { palette: true })
include("../kit/flat.kit.px.js", { palette: true })

const LANTERN_VERSTECK = ISOKIT.bake(ISO_MAPS.lantern_versteck, { id: "lantern_versteck", frames: 12, fps: 10 })

// the measured numbers for the game: tools/build_art.sh picks this line up and writes game/rooms/lantern_versteck.layout.js
console.log("ISO_LAYOUT " + JSON.stringify({ id: "lantern_versteck", ...LANTERN_VERSTECK.layout }))

// ---------------------------------------------------------------- the LED ticker on his poster (the user's wish, 2026-11-16)
// A line of amber LEDs running along the foot of the poster over the bed (the opening lv_poster leaves a dark band for it), laid over
// the room's picture as a prop (game/rooms/lantern_versteck.js puts its top left at TICKER.at): the wall's slant drawn into it (a
// column to the right is half a pixel up, as on the left wall), one pixel a frame, the message going round once a loop.
const TICKER = { x0: 88, y0: 76, a0: 2, a1: 45, e0: 1, e1: 9 }                    // the poster's foot on the screen (its opening's parallelogram)
const TICKER_MSG = "+++ STAY AWAKE +++ LULL LIES +++ LANTERN 87.6 +++ WAKE UP, NINTH "
const TICKER_L = TXT.measure(TICKER_MSG, "hud") + 4
const TICKER_TEXT = ISOKIT.raster(TICKER_L, 7, (c) => TXT.draw(c, 0, 1, TICKER_MSG, "Q", { font: "hud" }))
const TICKER_Y = TICKER.y0 - Math.floor(TICKER.a1 / 2) - TICKER.e1
anim("lantern_versteck_ticker", { w: TICKER.a1 + 1, h: TICKER.y0 - 1 - TICKER_Y + 1, frames: TICKER_L, fps: 12 }, (c) => {
  for (let a = TICKER.a0; a <= TICKER.a1; a++) for (let e = TICKER.e0; e <= TICKER.e1; e++) {
    const x = a, y = TICKER.y0 - Math.floor(a / 2) - e - TICKER_Y
    if (e === TICKER.e0 || e === TICKER.e1) { c.px(x, y, "2"); continue }
    const lit = TICKER_TEXT((a + c.frame) % TICKER_L, e - TICKER.e0 - 1)
    c.px(x, y, lit ? "R" : (a + e) % 2 ? "k" : "A")
  }
})
console.log("TICKER_AT " + JSON.stringify([TICKER.x0, TICKER_Y]))

// The alley baked from its map (art/rooms/gasse.map.js) with its kit (art/kit/gasse.kit.px.js) and the light (art/lib/isokit.js).
//
// Exports (the atlas takes gasse_* only): gasse_bg (320x180, 12 frames: the cables dripping, the dryers' steam out of the vent) and a
// sprite for each prop standing in the alley, outlined, pivot bottom-centre.
include("../lib/iso.js", { palette: true })
include("../lib/isomap.js")
include("../rooms/gasse.map.js")
include("../lib/isokit.js")
include("../kit/gasse.kit.px.js", { palette: true })

const GS_P = ISOMAP.projector(ISO_MAPS.gasse)
// the dryers' warm, wet air out of the vent, drifting up into the rain
const gsSteam = (c) => {
  const f = c.frame ?? 0, [x, y] = GS_P.P(5.45, 0, 2.42)
  c.plume(x, y, "hZz", { every: 3, life: 24, rise: 22, wind: -0.2, size: [1, 4], seed: 5, frame: f })
}
const GASSE = ISOKIT.bake(ISO_MAPS.gasse, { id: "gasse", frames: 12, fps: 10, glows: [gsSteam] })

// the measured numbers for the game: tools/build_art.sh picks this line up and writes game/rooms/gasse.layout.js
console.log("ISO_LAYOUT " + JSON.stringify({ id: "gasse", ...GASSE.layout }))

// Chapter 1's mock (docs/kapitel1-design.md): flat blocks for the cameras and streets not yet painted, enough to
// play the chapter through and to judge the layout before anything is painted. The feeds use the phosphor ramp
// (the look comes from the post-effects as on the painted ones), the street rooms a grey-blue. The text is signs of
// the city, English like all of them. Where people stand and what is clickable: game/places.js (at.cam21 and on).
pal({
  0: "#030a0a", 1: "#071514", 2: "#0c221f", 3: "#12332d", 4: "#1a483e",
  5: "#266252", 6: "#388169", 7: "#55a585", 8: "#8acfae", 9: "#d4f7e2",
  k: "#0c0e1a", a: "#131a2a", b: "#1a2337", d: "#232f47", e: "#2f3e5a", f: "#41547a", g: "#617aa0", h: "#a8b8d0",
  m: "#a8238a", M: "#ff4fd3", y: "#eea040", n: "#3e1240", p: "#26102c", v: "#62def0",
})
ramps("0123456789")
include("../lib/text.js")
include("../lib/kanji.js")

const W = 320, H = 180
/** a sign: its board and its text, centred on the board */
const SIGN = (c, x, y, w, s, board = "2", ink = "9") => {
  c.rect(x, y, w, 11, board)
  TXT.draw(c, x + Math.floor(w / 2), y + 2, s, ink, { font: "hud", align: "center" })
}
/** the back wall and the floor of a view from above */
const ROOM = (c, wall, floor, y = 70) => { c.rect(0, 0, W, y, wall); c.rect(0, y, W, H - y, floor); c.hline(0, y, W, "1") }

// (CAM 21 is painted now: art/cams/cam21.px.js)
// (cam14 is the 14th floor's own picture under the feed's filter: game/stadt.js)
// what cam14 adds to it: the morning's papers at the head of the stairs, and Frau Haldane at the floor's scale, asleep on her feet in
// her dressing gown, her arms hanging (the feed's filter turns both green)
anim("mock_papers", { w: 12, h: 6, frames: 1, fps: 1, pivot: "bottom" }, (c) => { c.rect(0, 1, 12, 5, "h"); c.rect(1, 0, 10, 4, "g"); c.hline(2, 2, 7, "e") })
anim("mock_haldane", { w: 15, h: 46, frames: 1, fps: 1, outline: "k", pivot: "bottom" }, (c) => {
  c.rect(4, 0, 7, 4, "h"); c.rect(4, 4, 7, 7, "g"); c.hline(5, 7, 2, "e"); c.hline(8, 7, 2, "e")
  c.rect(2, 11, 11, 31, "f"); c.rect(6, 11, 3, 31, "e"); c.rect(1, 13, 2, 16, "f"); c.rect(12, 13, 2, 16, "f"); c.rect(3, 42, 4, 4, "h"); c.rect(8, 42, 4, 4, "h")
})
// (Ines in the laundromat is painted now: art/characters/ines_waschsalon.px.js)
// (the newspaper page is painted now: look_zeitung in art/ui/look_zeitung.px.js)
// (CAM 22 is painted now: art/cams/cam22.px.js; Ines there at its scale is painted too: ines_feed_bar in art/characters/feed_people.px.js)
// (CAM 24 is painted now: art/cams/cam24.px.js)
// (CAM 30 is painted now: art/cams/cam30.px.js)
// (the look up at the Rings is painted now: art/rooms/dach_blick.px.js, on the geometry of the straight view up the spine)
// (CAM 18 is painted now: art/cams/cam18.px.js)
// (LUCKY STATIC is a room baked from its map now: art/rooms/lucky_static.map.js)
// (the Drain Market is painted now, seen from above: art/rooms/drain_market.px.js)
// (CAM 15 is painted now: art/cams/cam15.px.js)
// (Kessler with the hood is painted now: kessler_hood_feed_* in art/characters/feed_people.px.js)
// (the white carriers' close-up is painted now: look_traeger in art/ui/look_traeger.px.js; they are only voices, never in the street)
// (the bag's items are painted now: art/ui/items.px.js)
// (the sleeper behind the laundromat's counter is painted now: art/characters/schlaefer.px.js)

// ---- job B (game/auftrag_tide.js): Jade Row's cameras, Okonkwo's shop, the people of the night, Ratz
// (the register's customer display is painted now: zoom_keypad in art/ui/zooms.px.js)
// (Okonkwo's shop is painted now: art/rooms/okonkwo_shop.px.js)
// the people of job B and the patrol car are painted now (art/characters/okonkwo.px.js, art/characters/tide_people.px.js)
// (Teo is painted now: art/characters/teo.px.js)
// (the flat's open door is painted now: flat_door_gap and flat_door_leaf, art/rooms/flat.px.js)

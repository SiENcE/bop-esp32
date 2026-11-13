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
// Ines at the laundromat's scale (CAM 23 is the laundromat's own picture), seen from behind as she faces the machines: dark hair
// tied back, the white coat to her knees, a bag on her shoulder
anim("mock_ines", { w: 15, h: 50, frames: 1, fps: 1, outline: "k", pivot: "bottom" }, (c) => {
  c.rect(4, 0, 7, 9, "a"); c.rect(6, 9, 3, 3, "a")                                         // her hair, its knot
  c.rect(2, 11, 11, 25, "h"); c.vline(7, 20, 16, "g"); c.rect(1, 13, 2, 17, "h"); c.rect(12, 13, 2, 17, "h")   // the coat, its back seam, the arms
  c.rect(11, 12, 2, 12, "e"); c.rect(10, 22, 4, 6, "e")                                     // the bag's strap and the bag
  c.rect(4, 36, 3, 11, "d"); c.rect(8, 36, 3, 11, "d"); c.rect(3, 47, 4, 3, "a"); c.rect(8, 47, 4, 3, "a")       // the legs, the shoes
})
// a close-up: one page of the stack, every face in it marked with four corners
scene("look_zeitung", { w: 170, h: 112, bg: "h" }, (c) => {
  c.rect(0, 0, 170, 112, "h"); c.rect(0, 0, 170, 16, "g")
  TXT.draw(c, 85, 5, "NINTH HERALD", "k", { font: "hud", align: "center" })
  for (const [x, y] of [[10, 24], [62, 24], [114, 24], [10, 68], [62, 68], [114, 68]]) {
    c.rect(x, y, 40, 34, "f"); c.rect(x + 13, y + 6, 14, 14, "d"); c.rect(x + 8, y + 20, 24, 14, "e")
    for (const [cx, cy, dx, dy] of [[x + 9, y + 3, 1, 1], [x + 30, y + 3, -1, 1], [x + 9, y + 23, 1, -1], [x + 30, y + 23, -1, -1]]) { c.hline(dx > 0 ? cx : cx - 3, cy, 4, "k"); for (let n = 0; n < 4; n++) c.px(cx, cy + n * dy, "k") }
  }
})
// (CAM 22 is painted now: art/cams/cam22.px.js; Ines there at its scale is painted too: ines_feed_bar in art/characters/feed_people.px.js)
// (CAM 24 is painted now: art/cams/cam24.px.js)
// (CAM 30 is painted now: art/cams/cam30.px.js)
// (the look up at the Rings is painted now: art/rooms/dach_blick.px.js, on the geometry of the straight view up the spine)
// (CAM 18 is painted now: art/cams/cam18.px.js)
// (LUCKY STATIC is a room baked from its map now: art/rooms/lucky_static.map.js)
// (the Drain Market is painted now, seen from above: art/rooms/drain_market.px.js)
// (CAM 15 is painted now: art/cams/cam15.px.js)
// who walks through cam03 and cam15 now: a hood where the scarf was
anim("mock_kessler_hood", { w: 13, h: 24, frames: 1, fps: 1, outline: "1", pivot: "bottom" }, (c) => {
  c.rect(4, 0, 5, 7, "5"); c.rect(5, 3, 3, 3, "2"); c.rect(2, 7, 9, 10, "6"); c.rect(3, 17, 3, 7, "4"); c.rect(7, 17, 3, 7, "4")
})
// a close-up: the white van, two in white carrying a stretcher, a girl in a door
scene("look_traeger", { w: 170, h: 112, bg: "a" }, (c) => {
  c.rect(0, 0, 170, 112, "a"); c.rect(0, 86, 170, 26, "b")
  c.rect(8, 34, 74, 52, "h"); c.rect(8, 34, 22, 20, "d"); c.rect(14, 84, 12, 8, "k"); c.rect(62, 84, 12, 8, "k")
  for (const x of [92, 124]) { c.rect(x, 44, 8, 8, "h"); c.rect(x - 2, 52, 12, 26, "h"); c.rect(x, 78, 8, 12, "g") }
  c.rect(92, 62, 40, 5, "g"); c.rect(100, 56, 14, 6, "f")
  c.rect(146, 20, 22, 70, "m"); c.rect(152, 54, 8, 8, "f"); c.rect(150, 62, 12, 22, "g")
})
// people not painted yet: the white carriers
anim("mock_imai", { w: 19, h: 44, frames: 1, fps: 1, outline: "k", pivot: "bottom" }, (c) => {
  c.rect(6, 0, 7, 8, "h"); c.rect(14, 4, 1, 1, "g"); c.rect(3, 8, 13, 22, "f"); c.rect(5, 30, 9, 14, "d")
})
// what is in the bag, not painted yet
anim("inv_ausweis", { w: 18, h: 13, frames: 1, fps: 1, outline: "k" }, (c) => { c.rect(0, 0, 18, 13, "h"); c.rect(2, 2, 6, 7, "f"); c.rect(10, 3, 6, 1, "f"); c.rect(10, 6, 6, 1, "f"); c.rect(0, 11, 18, 2, "M") })
anim("inv_haken", { w: 18, h: 13, frames: 1, fps: 1, outline: "k" }, (c) => { c.rect(0, 10, 15, 2, "g"); c.rect(14, 3, 2, 8, "g"); c.rect(10, 2, 5, 2, "h"); c.rect(10, 4, 2, 2, "h") })
anim("inv_stick", { w: 18, h: 13, frames: 1, fps: 1, outline: "k" }, (c) => { c.rect(2, 3, 12, 7, "f"); c.rect(14, 5, 3, 3, "h"); c.rect(4, 5, 4, 3, "v") })
// the laundromat's man asleep behind his counter, on a chair tipped back against the wall, his head on his shoulder, facing the
// room (the laundromat itself is a baked map now: art/rooms/laundromat.map.js); his chair is in his figure
anim("mock_sleeper", { w: 22, h: 40, frames: 1, fps: 1, outline: "k", pivot: "bottom" }, (c) => {
  c.rect(3, 4, 2, 36, "e"); c.rect(3, 26, 15, 3, "e"); c.rect(15, 29, 2, 11, "e")     // the chair: its back, the seat, a front leg
  c.rect(5, 12, 9, 15, "f"); c.rect(6, 13, 7, 3, "g")                                // his body, a grey jacket
  c.rect(10, 26, 9, 4, "d"); c.rect(17, 30, 3, 9, "d"); c.rect(16, 38, 5, 2, "a")    // the legs out to the front, a shoe
  c.rect(4, 4, 7, 8, "h"); c.rect(4, 4, 7, 3, "a"); c.hline(7, 9, 3, "e")            // the head on its side, hair, mouth open
  c.rect(12, 20, 2, 8, "g")                                                           // an arm hanging
})

// ---- job B (game/auftrag_tide.js): Jade Row's cameras, Okonkwo's shop, the people of the night, Ratz
pal({ s: "#5a3a2a", S: "#8a5a3e", o: "#6a5030", O: "#a88a58" })
// the register's customer display in close-up: it should show the price; it shows every key he types, the whole code
scene("zoom_keypad", { w: 60, h: 40, bg: "1" }, (c) => {
  c.rect(0, 0, 60, 40, "3"); c.rect(0, 0, 60, 2, "5"); c.rect(4, 8, 52, 20, "1"); c.rect(6, 10, 48, 16, "2")
  TXT.draw(c, 30, 15, "4-1-7-0-9", "9", { font: "hud", align: "center" }); c.rect(26, 30, 8, 10, "3")
})
// (Okonkwo's shop is painted now: art/rooms/okonkwo_shop.px.js)
// the people of job B and the patrol car are painted now (art/characters/okonkwo.px.js, art/characters/tide_people.px.js)
anim("inv_tap", { w: 18, h: 13, frames: 1, fps: 1, outline: "k" }, (c) => { c.rect(1, 4, 10, 6, "e"); c.rect(11, 6, 6, 2, "h"); c.rect(3, 6, 3, 2, "v"); c.rect(0, 2, 2, 9, "g") })
anim("inv_reis", { w: 18, h: 13, frames: 1, fps: 1, outline: "k" }, (c) => { c.rect(1, 2, 16, 9, "h"); c.rect(1, 2, 16, 2, "S"); c.rect(5, 5, 8, 3, "O") })
// (Teo is painted now: art/characters/teo.px.js)
// (the flat's open door is painted now: flat_door_gap and flat_door_leaf, art/rooms/flat.px.js)
// Bao's broth to go: a white bowl with a lid and a twist of steam
anim("inv_suppe", { w: 18, h: 13, frames: 1, fps: 1, outline: "k" }, (c) => { c.rect(3, 6, 12, 6, "h"); c.rect(2, 5, 14, 2, "g"); c.rect(7, 3, 4, 2, "g"); c.px(6, 1, "h"); c.px(7, 0, "h"); c.px(11, 1, "h"); c.rect(5, 8, 8, 1, "f") })

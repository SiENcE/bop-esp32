// Review sheet for Frau Haldane (art/characters/haldane.px.js), never built into the game.
//   haldane_review       every pose (idle SE, the walk SE in its four frames, idle NE, the walk NE, the drawn NW's walk) and the papers;
//                        above as painted, below as CAM 14 shows them (exposure 2.2, then the phosphor's ten steps by brightness, as
//                        Nagiwa.FEED_POST does, without its dither and noise)
//   haldane_review_feed  CAM 14 (build/blocks/haldane/cam14_base_1x.png: a game shot of the feed at 01:15, before she comes) with her on
//                        her way: at her door facing SE, halfway down, at the mat, and back up facing NW; the papers at their place
//   haldane_review_walk  the three walks and the idle side by side on the landing's dark, for the GIF
"use strict"
include("haldane.px.js", { palette: true })
include("../lib/text.js")
pal({ "1": "#131a2a", "3": "#232f47", "6": "#617aa0", "7": "#8e9ab0" })

const hexOf = (v) => [1, 3, 5].map((i) => parseInt(v.slice(i, i + 2), 16))
const PHOS = ["#030a0a", "#071514", "#0c221f", "#12332d", "#1a483e", "#266252", "#388169", "#55a585", "#8acfae", "#d4f7e2"]
const FEED = (v) => { const [r, gg, b] = hexOf(v).map((ch) => Math.min(255, ch * 2.2)); return PHOS[Math.round(((77 * r + 150 * gg + 29 * b) / 256) / 255 * 9)] }
const FSWAP = Object.fromEntries(Object.entries(HALDANE_PAL).map(([k, v]) => [k, FEED(v)]))
const SHOTS = [["idle_se", 0], ["walk_se", 0], ["walk_se", 1], ["walk_se", 2], ["walk_se", 3], ["idle_ne", 0], ["walk_ne", 0], ["walk_ne", 1],
  ["walk_ne", 2], ["walk_ne", 3], ["walk_nw", 0], ["walk_nw", 1], ["walk_nw", 2], ["walk_nw", 3]]
for (const n of ["idle_se", "walk_se", "idle_ne", "walk_ne", "walk_nw"]) anim(`_hr_f_${n}`, { base: `haldane_${n}`, swap: FSWAP })
sprite("_hr_f_papers", { base: "haldane_papers", swap: FSWAP })

scene("haldane_review", { w: 404, h: 132, bg: "3" }, (c) => {
  c.rect(0, 66, 404, 66, PHOS[1])
  SHOTS.forEach(([n, f], i) => {
    const x = 16 + i * 26 + (i > 4 ? 6 : 0) + (i > 9 ? 6 : 0)
    c.stamp(`haldane_${n}`, x, 60, { frame: f }); c.stamp(`_hr_f_${n}`, x, 126, { frame: f })
  })
  c.stamp("haldane_papers", 388, 60); c.stamp("_hr_f_papers", 388, 126)
})

// CAM 14: the door (186, 105) and the mat (187, 135) on the screen (Nagiwa.at.cam14), the papers at AC.mat + [8, -1]
sprite("_hr_cam14", { png: "../../build/blocks/haldane/cam14_base_1x.png" })
scene("haldane_review_feed", { w: 640, h: 180, bg: "k" }, (c) => {
  for (const ox of [0, 320]) { c.stamp("_hr_cam14", ox, 0); c.stamp("_hr_f_papers", ox + 195, 134) }
  c.stamp("_hr_f_idle_se", 186, 105); c.stamp("_hr_f_walk_se", 186, 135, { frame: 2 })
  c.stamp("_hr_f_walk_se", 320 + 186, 120, { frame: 0 }); c.stamp("_hr_f_walk_nw", 320 + 187, 135, { frame: 1 })
})

scene("haldane_review_walk", { w: 120, h: 60, bg: PHOS[1], frames: 8, fps: 4 }, (c) => {
  c.stamp("haldane_idle_se", 16, 55, { frame: Math.floor(c.frame / 2) })
  c.stamp("haldane_walk_se", 44, 55, { frame: c.frame % 4 })
  c.stamp("haldane_walk_ne", 72, 55, { frame: c.frame % 4 })
  c.stamp("haldane_walk_nw", 100, 55, { frame: c.frame % 4 })
})

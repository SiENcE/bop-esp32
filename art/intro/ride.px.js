// The intro's ride D (docs/kapitel0-design.md §5): Juno going down in the lift, the one we know from the street. She has
// taken her yellow coat from her chair in the hall (shot 1) and wears it; the hood is down, as indoors. Her sprite is her
// indoor idle with its breath and blink (art/characters/juno.px.js), with the back arm bent forward to hold the box. The
// box is seen flatter than the street's 2:1 (after the note: 2:1 looked too steep on a thing this small): its long side
// nearly square to us, a narrow end on the right. It hides her satchel.
//   intro_d_juno   33x50, facing SE, pivot bottom-centre: mirror it for SW, as the engine does with her
// In the box a cactus, a cup and the data stick.
//   intro_d_close, _lit  320x180, the box from over its rim at about 700 px per metre, so a 10 cm stick carries its label:
//                  transparent above the box, where the game draws the decks going by; _lit is the same in the light of a
//                  deck's windows, which the game lays over it in moving bands (the things hold still)
//   intro_d_lift   320x180, transparent: the glass lift, its frame, floor and ceiling lamp, in the middle of the shaft
// The stick's label and the box's print are the city's own, in English. Colours as hex here: the palette's keys are
// shared with her sprite, which is included.
include("../lib/text.js")
include("../characters/juno.px.js")
;(() => {
pal({
  k: "#0c0e1a", y: "#eec414", Y: "#fff070", j: "#9a7406", S: "#d79676", s: "#93583f",
  O: "#6b4630", o: "#4d3122", P: "#8a6242", K: "#33211a", q: "#266252", Q: "#55a585", H: "#b9c6d8", W: "#fff4d8", v: "#62def0",
})

// In the frame's own columns and rows: the top's left corner, its two edges, the box's height
const LX = 14, LY = 21, AX = 12, AY = 2, BX = 4, BY = -2, BOXH = 7
const rowOf = (x) => LY + Math.round(((x - LX) * AY) / AX)     // the long front edge, from left to right
sprite("_ride_box", { w: 33, h: 50, outline: "k" }, (c) => {
  // the long side, lit; the narrow end, in shade; a darker line along the bottom
  for (let x = LX; x <= LX + AX; x++) { const y = rowOf(x); c.rect(x, y, 1, BOXH, "P"); c.px(x, y + BOXH, "o") }
  for (let i = 1; i <= BX; i++) {
    const x = LX + AX + i, y = LY + AY + Math.round((i * BY) / BX)
    c.rect(x, y, 1, BOXH, "O"); c.px(x, y + BOXH, "o")
  }
  // the top: the dark inside, the rim round it
  for (let x = LX; x <= LX + AX + BX; x++) {
    const front = x <= LX + AX ? rowOf(x) : Math.round(LY + AY + ((x - LX - AX) * BY) / BX)
    const back = x < LX + BX ? Math.round(LY + ((x - LX) * BY) / BX) : Math.round(LY + BY + ((x - LX - BX) * AY) / AX)
    for (let y = back; y <= front; y++) c.px(x, y, y === back || y === front || x === LX || x === LX + AX + BX ? "P" : "K")
  }
  // what stands in it, leaving her chin free: the cactus on the left, the stick, the cup on the right
  c.rect(18, 15, 2, 6, "q"); c.rect(18, 14, 1, 3, "Q"); c.px(20, 17, "q")
  c.rect(21, 18, 1, 3, "v")
  c.rect(23, 17, 4, 4, "H"); c.rect(23, 17, 4, 1, "W"); c.px(27, 18, "H")
})

const FRAMES = [900, 600, 120, 1100]              // her idle's own timing: arm and box breathe with her
anim("intro_d_juno", { w: 33, h: 50, frames: FRAMES.length, ms: FRAMES, pivot: "bottom" }, (c) => {
  const f = c.frame, dy = f >= 2 ? 1 : 0          // her bob
  c.stamp("juno_in_idle_se", 16.5, 50, { frame: f })
  // what of the satchel would show under the box goes back to coat
  c.rect(20, 29 + dy, 7, 3, "y"); c.rect(20, 32 + dy, 7, 1, "j")
  // the sleeve and the hand that hung down are gone: below the elbow her side is plain coat, its edge a column further in
  for (let y = 23; y <= 29; y++) {
    c.px(7, y + dy, "_"); c.px(8, y + dy, "k"); c.px(9, y + dy, "j"); c.rect(10, y + dy, 2, 1, "y")
  }
  c.stamp("_ride_box", 0, dy)
  // the forearm, forward from the elbow to the box: lit along its top, in shade under it, the cuff at the wrist
  for (let i = 0; i <= 7; i++) {
    const x = 9 + i, y = 22 + Math.round((i * 4) / 7) + dy
    c.px(x, y, "Y"); c.px(x, y + 1, "y"); c.px(x, y + 2, "j")
  }
  c.rect(8, 21 + dy, 2, 3, "y"); c.px(7, 23 + dy, "k"); c.rect(8, 24 + dy, 2, 1, "k")   // the elbow
  c.rect(16, 26 + dy, 1, 3, "j")
  // her hand round the box's lower edge; the far hand under its right corner
  c.rect(17, 26 + dy, 3, 3, "S"); c.px(17, 28 + dy, "s"); c.rect(17, 29 + dy, 3, 1, "k"); c.rect(20, 26 + dy, 1, 3, "k")
  c.rect(28, 28 + dy, 3, 2, "S"); c.px(28, 29 + dy, "s"); c.rect(28, 30 + dy, 3, 1, "k"); c.rect(31, 28 + dy, 1, 2, "k")
})

// ---------------------------------------------------------------- the box, close
const W = 320, H = 180
const DIM = {
  ink: "#0c0e1a", wallIn: "#2c1c16", wallFar: "#4a3122", wall: "#664733", rim: "#84623f", cut: "#3d291c",
  cact: "#123a2c", cactMid: "#1f5a45", cactLit: "#35806a", spine: "#8fa89a", pot: "#5c3322", potMid: "#7d4930", potLit: "#a1623c", soil: "#1c1410",
  cup: "#7b8798", cupMid: "#a4afbf", cupLit: "#c9d2dd", coffee: "#2a1a12", stain: "#6b5a48", logo: "#1f88a4",
  stick: "#1a2337", stickMid: "#2f3e5a", stickLit: "#41547a", metal: "#617aa0", label: "#c9d2dd", labelEdge: "#7b8798", text: "#0c0e1a",
  coat: "#d9ae12", coatLit: "#eec414", coatDark: "#9a7406", skin: "#c08465", skinDark: "#93583f", skinLit: "#d79676", print: "#4a3122",
}
const LIT = {
  ink: "#0c0e1a", wallIn: "#4a3026", wallFar: "#6b4a30", wall: "#8f6a44", rim: "#b58d5c", cut: "#5c4029",
  cact: "#266252", cactMid: "#388169", cactLit: "#6cc0a0", spine: "#d4f7e2", pot: "#7c4630", potMid: "#a06038", potLit: "#c98050", soil: "#33241a",
  cup: "#a6b3c5", cupMid: "#ccd6e2", cupLit: "#f0f4f8", coffee: "#3f281a", stain: "#8f7a62", logo: "#62def0",
  stick: "#2f3e5a", stickMid: "#41547a", stickLit: "#617aa0", metal: "#b9c6d8", label: "#f0f4f8", labelEdge: "#a6b3c5", text: "#0c0e1a",
  coat: "#eec414", coatLit: "#fff070", coatDark: "#9a7406", skin: "#d79676", skinDark: "#a9694c", skinLit: "#f0b898", print: "#664733",
}
const FAR_RIM = 84, NEAR_RIM = 130

function closeUp(c, T) {
  // the inside: the far wall with its rim and its cut flap, the dark bottom
  c.rect(0, FAR_RIM + 4, W, NEAR_RIM - FAR_RIM - 4, T.wallIn)
  c.rect(0, FAR_RIM + 4, W, 14, T.wallFar)
  c.rect(0, FAR_RIM, W, 4, T.rim); c.hline(0, FAR_RIM + 3, W, T.cut)
  for (let x = 3; x < W; x += 4) c.px(x, FAR_RIM + 1, T.cut)                     // the corrugation, seen in the cut edge
  c.rect(0, FAR_RIM - 12, 30, 12, T.wall); c.hline(0, FAR_RIM - 12, 30, T.rim); c.line(30, FAR_RIM - 12, 36, FAR_RIM, T.cut)  // a flap, bent up

  // the cactus, ribbed, in its clay pot, on the left: from the desk, with a spine or two gone
  const CX0 = 54, CX1 = 86, CTOP = 32
  for (let x = CX0; x < CX1; x++) {
    const u = (x - CX0 + 0.5) / (CX1 - CX0), crown = CTOP + Math.round(12 * (1 - Math.sqrt(Math.max(0, 1 - (2 * u - 1) ** 2))))
    const rib = Math.floor(u * 5), inRib = u * 5 - rib
    const tone = inRib < 0.22 ? T.cact : rib === 0 ? T.cactLit : rib === 4 ? T.cact : inRib < 0.55 ? T.cactLit : T.cactMid
    c.rect(x, crown, 1, 104 - crown, tone)
  }
  c.rect(CX1, 58, 7, 18, T.cactMid); c.rect(CX1 + 2, 50, 7, 12, T.cactMid); c.rect(CX1 + 2, 50, 2, 12, T.cactLit)   // its one arm
  for (let r = 0; r < 5; r++) for (let y = CTOP + 12 + (r % 2) * 5; y < 100; y += 10) c.px(CX0 + 3 + r * 6.4, y, T.spine)
  c.rect(46, 100, 48, 5, T.potLit); c.rect(46, 104, 48, 2, T.pot)                // the pot's rim
  for (let y = 106; y < NEAR_RIM; y++) { const inset = Math.round((y - 106) / 8); c.rect(49 + inset, y, 42 - 2 * inset, 1, T.potMid); c.rect(49 + inset, y, 5, 1, T.potLit); c.rect(85 - inset, y, 6, 1, T.pot) }
  c.rect(50, 100, 40, 2, T.soil)

  // the cup on the right, white once, a chip in its rim; the ring of Halcyon on it; yesterday's coffee down its side
  const UX = 228, UW = 56, UTOP = 68
  c.rect(UX - 12, 80, 14, 4, T.cupMid); c.rect(UX - 14, 84, 4, 18, T.cupMid); c.rect(UX - 12, 102, 14, 4, T.cup)   // the handle
  c.rect(UX, UTOP, UW, NEAR_RIM - UTOP, T.cupMid)
  c.rect(UX, UTOP, 8, NEAR_RIM - UTOP, T.cupLit); c.rect(UX + UW - 12, UTOP, 12, NEAR_RIM - UTOP, T.cup)
  c.ellipse(UX + UW / 2, UTOP + 1, UW / 2, 4, T.cupLit); c.ellipse(UX + UW / 2, UTOP + 1, UW / 2 - 3, 3, T.coffee)
  c.rect(UX + 38, UTOP - 3, 4, 3, T.coffee)                                       // the chip
  c.vline(UX + 18, UTOP + 4, 14, T.stain); c.vline(UX + 19, UTOP + 4, 8, T.stain)
  c.ellipse(UX + 28, 96, 11, 11, T.logo); c.ellipse(UX + 28, 96, 7, 7, T.cupMid)

  // the stick, lying against them: heavy, a company thing, its label the shot
  const SX = 98, SY = 102, SW = 126, SH = 28
  c.rect(SX + 2, SY, SW - 4, SH, T.stickMid); c.rect(SX, SY + 2, SW, SH - 4, T.stickMid)
  c.hline(SX + 2, SY, SW - 4, T.stickLit); c.rect(SX, SY + SH - 5, SW, 3, T.stick); c.rect(SX + 2, SY + SH - 2, SW - 4, 2, T.stick)
  c.rect(SX + SW, SY + 8, 12, 12, T.metal); c.rect(SX + SW + 2, SY + 11, 8, 2, T.stick); c.rect(SX + SW + 2, SY + 15, 8, 2, T.stick)  // its plug
  c.ellipse(SX + 6, SY + 14, 2, 2, T.stick)                                        // the hole for a lanyard
  c.rect(SX + 12, SY + 5, 104, 15, T.label); c.hline(SX + 12, SY + 19, 104, T.labelEdge); c.px(SX + 115, SY + 5, T.stickMid); c.px(SX + 114, SY + 5, T.labelEdge)
  TXT.draw(c, SX + 64, SY + 10, "EVAL-7 // DELETE", T.text, { font: "hud", align: "center" })

  // the near wall of the box: its lit cut edge, a tape's end, the supplier's print
  c.rect(0, NEAR_RIM, W, H - NEAR_RIM, T.wall)
  c.rect(0, NEAR_RIM, W, 4, T.rim); c.hline(0, NEAR_RIM + 3, W, T.cut)
  for (let x = 1; x < W; x += 4) c.px(x, NEAR_RIM + 1, T.cut)
  c.rect(120, NEAR_RIM, 34, 16, T.rim); c.hline(120, NEAR_RIM + 15, 34, T.cut)
  TXT.draw(c, 8, NEAR_RIM + 12, "HALCYON SUPPLY  1 OF 1", T.print, { font: "hud" })

  // her sleeve coming in from the right, its cuff, her hand over the rim, four fingers down the outside
  const HX = 244
  for (let i = 0; i < 4; i++) {
    const fx = HX + i * 6, len = i === 0 || i === 3 ? 13 : 15
    c.rect(fx, NEAR_RIM - 4, 5, len + 8, T.skin); c.rect(fx, NEAR_RIM - 4, 1, len + 8, T.skinLit); c.vline(fx + 5, NEAR_RIM - 2, len + 5, T.skinDark)
    c.rect(fx, NEAR_RIM + len + 3, 5, 1, T.skinDark)
  }
  c.rect(HX, NEAR_RIM - 14, 28, 11, T.skin); c.hline(HX, NEAR_RIM - 14, 28, T.skinLit); c.rect(HX, NEAR_RIM - 5, 24, 1, T.skinDark)
  for (let x = HX + 22; x < W; x++) {
    const top = NEAR_RIM - 17 - Math.round((x - HX - 22) * 0.42)
    c.vline(x, top, H - top, T.coat); c.rect(x, top, 1, 3, T.coatLit)
  }
  for (let y = NEAR_RIM - 17; y < H; y++) c.rect(HX + 22, y, 8, 1, T.coatLit)                       // the cuff, turned back
  c.vline(HX + 30, NEAR_RIM - 20, H - NEAR_RIM + 20, T.coatDark); c.vline(HX + 22, NEAR_RIM - 17, H - NEAR_RIM + 17, T.coatDark)
  c.line(HX + 44, NEAR_RIM - 8, HX + 62, NEAR_RIM + 8, T.coatDark); c.line(HX + 52, NEAR_RIM - 12, HX + 76, NEAR_RIM + 6, T.coatDark)
}
sprite("intro_d_close", { w: W, h: H }, (c) => closeUp(c, DIM))
sprite("intro_d_close_lit", { w: W, h: H }, (c) => closeUp(c, LIT))

// ---------------------------------------------------------------- the lift
const L = 92, R = 228, T0 = 60, F = 130
sprite("intro_d_lift", { w: W, h: H }, (c) => {
  // the ceiling with its cold strip of light; the floor, seen a little from above, since she is seen so too, its lit middle
  // under the lamp; its edge, the plate under it. The glass itself shows only by what lies on it
  c.rect(L, T0, R - L, 5, "#41547a"); c.hline(L, T0, R - L, "#617aa0"); c.rect(L + 30, T0 + 4, R - L - 60, 2, "#dafcff")
  c.rect(L, F, R - L, 12, "#2f3e5a"); c.hline(L, F, R - L, "#41547a")
  for (let y = F + 1; y < F + 12; y++) for (let x = L; x < R; x++) {
    const b = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5][(y & 3) * 4 + (x & 3)] / 16
    if (b < 1.25 - Math.abs(x - (L + R) / 2) / 44) c.px(x, y, "#41547a")
  }
  for (let x = L + 16; x < R - 8; x += 26) c.line(x, F + 1, x - 4, F + 11, "#232f47")     // the floor's plates
  c.rect(L, F + 12, R - L, 5, "#617aa0"); c.hline(L, F + 12, R - L, "#b9c6d8"); c.rect(L, F + 17, R - L, 3, "#1a2337")
  // the frame's posts, and the guides that run on the rails
  for (const x of [L, R - 3]) { c.rect(x, T0, 3, F + 17 - T0, "#617aa0"); c.vline(x + (x === L ? 0 : 2), T0, F + 17 - T0, "#b9c6d8") }
  for (const [x, w] of [[87, 5], [228, 5]]) for (const y of [T0 + 6, F + 6]) c.rect(x, y, w, 6, "#41547a")
  // the light on the glass: a long slanted streak each side, broken once
  c.line(L + 16, T0 + 8, L + 28, F - 34, "#41547a"); c.line(L + 32, F - 26, L + 38, F - 10, "#41547a"); c.line(L + 21, T0 + 8, L + 30, F - 42, "#2f3e5a")
  c.line(R - 30, T0 + 8, R - 22, F - 40, "#41547a")
})
})()

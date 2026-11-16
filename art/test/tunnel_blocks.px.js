// Blocks for approval (the user liked the idea, 2026-11-16): the way from the Drain Market out to the swamps goes through a tunnel. The
// market lies under the Ring; where its canal leaves on the right it runs under the Ring's last pillar into the dark, and the ride
// (seen from the side) comes out of that dark into the open, under the night sky for the first time in the game.
//   tunnel_markt   from above, at the market's right edge (art/rooms/drain_market.px.js, 1280 wide): the Ring's pillar over the canal and
//                  both banks, a dark slab with a lit concrete lip where the water goes in under it, the shadow falling out over the water
//   tunnel_fahrt   from the side, the ride's front plane (sumpf_fahrt, 480 wide): the tunnel's dark with its ceiling and a cyan glint
//                  on the water, then the portal (its concrete face lit along its edge, drips) and the Ring's slab reaching out over it;
//                  the game slides it off to the left while the ride begins
"use strict"
pal({ k: "#0c0e1a", n: "#06080f", d: "#131a2a", e: "#1a2337", c: "#2f3e5a", C: "#41547a", l: "#617aa0", L: "#8e9ab0", v: "#1f88a4", V: "#62def0", y: "#eec414" })

// ---- from above: the pillar over the canal at the market's right edge, 56 x 150 (its left edge at world x 1224, its top at y 300)
sprite("tunnel_markt", { w: 56, h: 150 }, (c) => {
  // the shadow it throws out over the water and the banks, dithered toward the market
  for (let y = 0; y < 150; y++) for (let x = 0; x < 16; x++) if ((x + y) % 2 === 0 && x > 4 + ((y * 7) % 5)) c.px(x, y, "n")
  // the slab: dark concrete, a lit lip along its left edge, a yellow hazard stripe painted on the lip, its seams
  c.rect(16, 0, 40, 150, "e")
  c.rect(16, 0, 2, 150, "L"); c.rect(18, 0, 1, 150, "c")
  for (let y = 4; y < 150; y += 10) c.rect(19, y, 2, 5, "y")
  for (let y = 0; y < 150; y += 37) c.hline(22, y, 34, "d")
  // where the canal goes in under it (world y 340 to 395): the dark of the water in the tunnel, a cyan glint on it
  c.rect(16, 40, 40, 55, "n"); c.rect(16, 40, 2, 55, "C"); c.hline(30, 66, 6, "v"); c.hline(40, 72, 4, "v")
})

// ---- from the side: the tunnel and its portal, 480 x 180, laid over the ride's planes
sprite("tunnel_fahrt", { w: 480, h: 180 }, (c) => {
  // the tunnel: its ceiling, its dark, the water with a cyan glint from the raft's screens
  c.rect(0, 0, 400, 180, "n")
  c.rect(0, 0, 400, 22, "e"); for (let x = 0; x < 400; x += 40) c.vline(x, 0, 22, "d")
  c.hline(0, 22, 400, "d")
  for (let i = 0; i < 9; i++) c.hline(30 + i * 41, 150 + (i % 3) * 4, 8 + (i % 2) * 6, "v")
  // the portal: its concrete face, lit along the edge toward the open, drips falling from its top
  c.rect(392, 0, 22, 180, "c"); c.rect(412, 0, 3, 180, "L"); c.vline(392, 0, 180, "e")
  for (let y = 30; y < 140; y += 26) c.rect(396, y, 14, 2, "e")
  // the Ring's slab reaching out over the portal, thinning, its lit underside, the hazard stripes at its edge, drips
  c.rect(392, 0, 88, 26, "e"); c.hline(392, 26, 88, "l"); c.hline(392, 27, 88, "c")
  for (let x = 400; x < 480; x += 12) c.rect(x, 22, 5, 2, "y")
  for (const [x, y] of [[420, 34], [448, 52], [466, 41], [436, 70]]) { c.vline(x, y, 3, "L"); c.px(x, y + 4, "V") }
})

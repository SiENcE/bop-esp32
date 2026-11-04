// H1c: how much of Juno's face shows at 50 px? Five heads for her front three-quarter view (SE, hood up,
// one with the hood down), from as little as now to a cute, clearly readable face, each on the same body
// with the old sprite's shading (light from the upper left: Y on the lit side, y the slicker, j the shade
// and the seams; skin S/s; ink outline). Top row at 1x as the game shows them, bottom row the heads at 3x.
//   A  wie bisher     two dark pixels for eyes, no mouth (the 32 px sprite's face, a size larger)
//   B  Augen          eyes two rows tall, a mouth, the fringe under the hood
//   C  süß            eyes 2x2 with a glint, a blush, a small mouth, the hood pushed back a little
//   D  sehr süß       a slightly bigger head, eyes 2x3 with a lash and a glint, round cheeks
//   E  ohne Kapuze    C with the hood down: short black hair with a fringe
pal({
  k: "#0c0e1a", n: "#06080f", 1: "#131a2a", 2: "#1a2337", 3: "#232f47", 4: "#2f3e5a", 5: "#41547a", 6: "#617aa0",
  j: "#9a7406", y: "#eec414", Y: "#fff070", s: "#93583f", S: "#d79676", T: "#f0b896", g: "#565e70", G: "#8e96a8",
  v: "#62def0", h: "#1b1f2e", H: "#2e3550", w: "#f4f8ff", p: "#e0806a", m: "#7a3a34",
})
include("../lib/text.js")

const HEADS = {
  A: `
    .....kkkkk......
    ...kkYYYYYkk....
    ..kYYYYYYYYyk...
    .kYYYYYYYYYyyk..
    .kYYYYYjjjjjyk..
    kYYYYYjhhhhhjk..
    kYYYYjhSSSSSSk..
    kyYYYjhSkSSkSk..
    kyYYYjSSSSSSvk..
    kyyYYjsSSSSSSk..
    kjyyyjjsSSSSk...
    .kjyyyjjsssk....
    .kjjjjjjjkk.....
    ..kkkkkkk.......`,
  B: `
    .....kkkkk......
    ...kkYYYYYkk....
    ..kYYYYYYYYyk...
    .kYYYYYYYYYyyk..
    .kYYYYYjjjjjyk..
    kYYYYYjhHhHhjk..
    kYYYYjhhSShSSk..
    kyYYYjhSkSSkSk..
    kyYYYjSSkSSkvk..
    kyyYYjsSSSSSSk..
    kjyyyjjsSSmSk...
    .kjyyyjjsssk....
    .kjjjjjjjkk.....
    ..kkkkkkk.......`,
  C: `
    .....kkkkk.......
    ...kkYYYYYkk.....
    ..kYYYYYYYYyk....
    .kYYYYYYYYYyyk...
    .kYYYYjjjjjjjyk..
    kYYYYjhHhhHhhhjk.
    kYYYjhSSSSSSSSk..
    kyYYjhSkwSSkwSk..
    kyYYjSSkkSSkkvk..
    kyyYjsSpSSSSpSk..
    kjyyjjsSSSmSSk...
    .kjyyjjssSSSk....
    .kjjjjjjjskk.....
    ..kkkkkkkk.......`,
  D: `
    ......kkkkkk.......
    ....kkYYYYYYkk.....
    ...kYYYYYYYYYyk....
    ..kYYYYYYYYYYyyk...
    .kYYYYYjjjjjjjjyk..
    .kYYYYjhHhHhhHhhjk.
    kYYYYjhSSSSSSSSSSk.
    kyYYYjhSkwSSSSkwSk.
    kyYYYjSSkkSSSSkkSk.
    kyYYYjSSkkSSSSkkvk.
    kyyYYjsSpSSSSSSpSk.
    kjyyyjjsSSSmmSSSk..
    .kjyyyjjsSSSSSsk...
    .kjjjjjjjssssk.....
    ..kkkkkkkkkk.......`,
  E: `
    .....kkkkk.......
    ...kkhhHHhkk.....
    ..khhHHhhhHhk....
    .khhhhhhhhhhhk...
    .khhhhhhHhhHhhk..
    khhhhhhHhhHhhhk..
    khhhhhSSSSSSSSk..
    .khhhhSkwSSkwSk..
    .khhhSSkkSSkkvk..
    ..khhsSpSSSSpSk..
    ..kkhjsSSSmSSk...
    .kjyyyjssSSSk....
    .kyyyyyyjskk.....
    kyyyyyyyyykk.....`,
}
for (const [name, rows] of Object.entries(HEADS)) sprite(`_head_${name}`, rows)

/** the body under a head (rows 13-49 of a 50 px figure), shaded like the old sprite: lit on the left */
function body(c, x, T) {
  const rect = (a, b, w, h, k) => c.rect(a, b, w, h, k)
  // legs, boots
  rect(x - 5, T + 33, 4, 13, "2"); rect(x + 1, T + 33, 4, 13, "3"); rect(x - 5, T + 33, 1, 13, "3")
  rect(x - 6, T + 45, 6, 4, "1"); rect(x + 1, T + 45, 6, 4, "1"); rect(x - 6, T + 49, 13, 1, "k")
  // the slicker: lit left side Y, the body y, the shade and the far edge j; the opening a third in
  for (let r = 13; r <= 33; r++) {
    const half = 6 + Math.round((r - 13) * 3 / 20), a = x - half, b = x + half
    rect(a, T + r, b - a + 1, 1, "y"); rect(a + 1, T + r, 2, 1, "Y"); rect(b - 1, T + r, 2, 1, "j"); c.px(a, T + r, "k"); c.px(b + 1, T + r, "k")
    c.px(x + 1, T + r, "j")                                                  // the slicker's opening
  }
  rect(x - 9, T + 33, 20, 1, "j"); rect(x - 9, T + 34, 20, 1, "k")
  // the arms, the hands
  rect(x - 9, T + 15, 3, 14, "Y"); rect(x - 9, T + 15, 1, 14, "k"); rect(x - 9, T + 28, 3, 3, "S")
  rect(x + 8, T + 15, 3, 14, "j"); rect(x + 11, T + 15, 1, 14, "k"); rect(x + 8, T + 28, 3, 3, "s")
  // the strap from her right shoulder to her left hip, the satchel on her left hip (far, screen right)
  c.line(x - 5, T + 13, x + 6, T + 25, "G"); c.line(x - 4, T + 13, x + 7, T + 25, "g")
  rect(x + 4, T + 25, 8, 8, "G"); rect(x + 4, T + 25, 8, 1, "k"); rect(x + 4, T + 32, 8, 1, "g"); rect(x + 11, T + 25, 1, 8, "g")
}

const LABELS = { A: "A WIE BISHER", B: "B AUGEN", C: "C SÜSS", D: "D SEHR SÜSS", E: "E OHNE KAPUZE" }
const KEYS = Object.keys(HEADS)
sprite("juno50_faces", { w: 320, h: 180 }, (c) => {
  c.rect(0, 0, 320, 180, "n"); c.rect(0, 74, 320, 1, "3")
  KEYS.forEach((k, i) => {
    const x = 32 + i * 64
    body(c, x, 14)
    TXT.draw(c, x, 70, LABELS[k], "6", { font: "hud", align: "center" })
  })
  // the heads at 3x, read from the same grids
  KEYS.forEach((k, i) => {
    const rows = HEADS[k].trim().split(/\s+/), ox = 32 + i * 64 - Math.floor(rows[0].length * 3 / 2), oy = 84
    rows.forEach((r, y) => { for (let xx = 0; xx < r.length; xx++) if (r[xx] !== ".") c.rect(ox + xx * 3, oy + y * 3, 3, 3, r[xx]) })
  })
  TXT.draw(c, 4, 4, "JUNOS GESICHT BEI 50 PX: OBEN 1X, UNTEN 3X", "v", { font: "hud" })
}, ...KEYS.map((k, i) => stamp(`_head_${k}`, 32 + i * 64 - (k === "D" ? 9 : 7), 14 + (k === "D" ? -1 : 0))))

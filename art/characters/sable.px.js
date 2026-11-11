// Sable, the fence on the Drain Market (story §4: nonbinary, charming, honest about being dishonest; a long magenta coat, a shaved head,
// a burning pipe; #ff4fd3), painted on the approved blocks' lines (art/test/sable_blocks.px.js, way A: the user went on with the
// recommended way on 2026-11-11). Sable sits behind the desk in the booth (art/rooms/sable_booth.px.js), seen from the front, under the
// amber lamp hanging right over the desk: its light lies on the skull, the shoulders, the forearms and the hands; the glowing piece of
// tech is a cyan lens implanted over the left eye (style guide §8a). Only the head, the shoulders and the hands show over the desk.
//   sable_sit    idle: the pipe's ember breathing, its smoke rising and curling, a slow blink, the lens's light pulsing
//   sable_talk   talking round the pipe's stem: the eyes open, the mouth moving at its corner
// Every frame is 21x52: the figure's 40 rows at the bottom (its feet on the floor behind the desk, pivot bottom-centre), the smoke in the
// 12 rows over the head. The ink outline is drawn round the figure only, so the smoke stays soft.
;(() => {

pal({
  k: "#0c0e1a",                                                        // ink
  1: "#131a2a", 2: "#1a2337", 3: "#232f47",                            // the shirt, the trousers, the boots
  n: "#3e1240", o: "#6e1a5e", M: "#a8238a", m: "#e0409f", N: "#ff8fd8", // the coat: deep, shade, mid, lit, the lamp's light on top
  s: "#5a3426", S: "#8e5a44", T: "#b87a5c", U: "#e8a87c",              // skin: shade, mid, lit, the lamp on the skull
  O: "#3a1e14", P: "#6e3a22", Q: "#eea040", R: "#ffd58a",              // the pipe, its ember
  g: "#4e566a", h: "#7d8ca4", H: "#a8b4c4",                            // the smoke, thin to thick
  c: "#123c4e", v: "#62def0", V: "#dafcff",                            // the lens
})

const W = 21, H = 52, TOP = 12
/** @param {any} c @param {{ blink?: boolean, talk?: number, ember?: number, lens?: boolean, smoke?: number }} o */
const sable = (c, o) => {
  const g = (x, y, rows) => rows.forEach((r, j) => [...r].forEach((ch, i) => { if (ch !== ".") c.px(x + i, TOP + y + j, ch) }))
  // below the desk (hidden there, drawn for the silhouette): the coat's skirts over the knees, the legs, the boots
  g(3, 22, [
    "noMMMMMnMMMMMon", "noMMMMMnMMMMMon", "noMMMMMnMMMMMon", "noMMMMMnMMMMMon", "noMMMMMnMMMMMon",
    "noMMMMMnMMMMMon", "noMMMMMnMMMMMon", "nooMMMMnMMMMoon", "nnoooonnnoooonn",
  ])
  g(5, 31, ["3322...3322", "3322...3322", "3322...3322", "3322...3322", "3322...3322", "3322...3322", "3322...3322"])
  g(4, 38, ["11111...11111", "21112...21112"])
  // the coat: the lamp's light on the shoulders, the lapels open over the dark shirt, the arms' line down the sides
  g(1, 10, [
    "....nmNm1mNmn....",
    "..nmNmMm1mMmNmn..",
    ".nmMMmMM1MMmMMmn.",
    "noMoMMMm1mMMMoMon",
    "noMoMMMm1mMMMoMon",
    "noMoMMMm2mMMMoMon",
    "noMoMMMm1mMMMoMon",
    "noMoMMMm1mMMMoMon",
    "noMoMMMM2MMMMoMon",
    "noMoMMMM1MMMMoMon",
    "noMoMMMM1MMMMoMon",
    "nooMMMMMMMMMMMoon",
  ])
  // the high collar round the neck, lit on its top edge
  g(6, 8, ["nm...mn", "nMMsMMn"])
  c.rect(9, TOP + 9, 3, 1, "s")
  // the forearms on the desk, coming toward us, their tops in the lamp's light; the cuffs; the hands folded
  g(3, 18, [".mm.........mm.", "mNmM.......MmNm", "MmMnTTsTTsTnMmM", ".MnsSSSSSSSsnM."])
  // the head: shaved, the lamp's light on the skull; the eyes half shut under heavy lids (open when talking)
  g(6, 0, [
    "..TUUUT..",
    ".STUUUTS.",
    "sSTTTTTSs",
    "sSsSTSsSs",
    "sSkSSSkSs",
    "sSSSTSSSs",
    ".sSSsSSs.",
    "..SskSs..",
    "...sss...",
  ])
  if (o.blink) g(6, 3, ["..sSTSs.."]), g(6, 4, ["..s...s.."])
  if (o.talk !== undefined) {
    g(6, 3, ["..SSTSS.."])                                             // the lids up: awake, attentive
    if (o.talk === 1) { c.px(10, TOP + 7, "k"); c.px(11, TOP + 7, "k"); c.px(10, TOP + 8, "s") }   // the mouth's corner moving round the stem
  }
  // the lens over the left eye: a cyan ring round it, its light pulsing
  c.px(8, TOP + 4, o.lens ? "V" : "v"); c.px(7, TOP + 4, "c"); c.px(9, TOP + 4, "c"); c.px(8, TOP + 3, "c"); c.px(8, TOP + 5, "c")
  // the pipe: the stem from the mouth's corner to the bowl beside the chin, the ember in it
  c.px(12, TOP + 7, "O"); c.px(13, TOP + 7, "P")
  g(14, 5, ["P" + ["O", "P", "Q", "R"][o.ember ?? 0] + "P", "OPO", "OPO", ".O."])

  // the ink outline round the figure (the smoke after it, soft)
  const fig = (x, y) => { if (x < 0 || y < 0 || x >= W || y >= H) return false; const k = c.key(x, y); return !!k && k !== "." && k !== "_" }
  const ink = []
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!fig(x, y) && (fig(x - 1, y) || fig(x + 1, y) || fig(x, y - 1) || fig(x, y + 1))) ink.push([x, y])
  for (const [x, y] of ink) c.px(x, y, "k")

  // the smoke: out of the bowl, rising, swaying, thinning as it goes, three wisps a loop apart
  if (o.smoke !== undefined) for (let w = 0; w < 3; w++) for (let i = 0; i < 6; i++) {
    const t = (o.smoke + w * 4 + i * 0.6) % 12, y = TOP + 3 - Math.round(t * 1.25)
    if (y < 0) continue
    const x = 16 + Math.round(Math.sin(t * 0.7 + w) * 1.4 + t * 0.25)
    if (x < 0 || x >= W || fig(x, y)) continue
    if ((i + w + Math.round(t)) % 3 === 2) continue                  // gaps: smoke is never a line
    c.px(x, y, t < 3 ? "H" : t < 7 ? "h" : "g")
  }
}

const opts = (more) => ({ w: W, h: H, pivot: "bottom", ...more })
// the ember breathing (dim, glowing, bright, glowing, dim, dim), a blink on the fifth frame, the lens's light on the third
anim("sable_sit", opts({ frames: 12, ms: Array(12).fill(200) }),
  (c) => sable(c, { ember: [0, 1, 2, 3, 2, 1, 0, 1, 1, 2, 1, 0][c.frame], blink: c.frame === 9, lens: c.frame % 6 === 2, smoke: c.frame }))
anim("sable_talk", opts({ frames: 2, ms: [200, 200] }), (c) => sable(c, { talk: c.frame, ember: 1, smoke: c.frame * 3 }))

})()

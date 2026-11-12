// A test for the user (2026-11-12): Juno's arms were too short (the hand ended high on the slicker); the user wants
// them down to just above the hip. Three lengths side by side, each Juno built by art/characters/juno.px.js with
// JUNO_ARM_EXTRA rows more arm: as first drawn (0), 2 and 3 rows longer (the user chose 3, now juno.px.js's own). Each row: idle SE, idle NE, indoors SE, and the
// walk's frames 1 and 5 (the arms at their furthest), SE and NE.
//   PXL build art/test/juno_arme.px.js --out build/art/juno_arme --no-preview
pal({ n: "#06080f", 1: "#131a2a", 3: "#232f47", 6: "#617aa0", v: "#62def0" })
globalThis.JUNO_ARM_EXTRA = 0; include("../characters/juno.px.js", { as: "a0" })
globalThis.JUNO_ARM_EXTRA = 2; include("../characters/juno.px.js", { as: "a2" })
globalThis.JUNO_ARM_EXTRA = 3; include("../characters/juno.px.js", { as: "a3" })
delete globalThis.JUNO_ARM_EXTRA
include("../lib/text.js")

const STEP = 30, X0 = 70
const VARIANTS = [["a0", "ALT"], ["a2", "+2 PX"], ["a3", "+3 PX"]]
const POSES = [["juno_idle_se", 0], ["juno_idle_ne", 0], ["juno_in_idle_se", 0], ["juno_walk_se", 1], ["juno_walk_se", 5], ["juno_walk_ne", 1], ["juno_walk_ne", 5]]
const floor = (i) => 70 + i * 70

const stamps = []
VARIANTS.forEach(([as], i) => POSES.forEach(([name, frame], j) => stamps.push(stamp(`${as}.${name}`, X0 + j * STEP, floor(i), { frame }))))

sprite("juno_arme", { w: X0 + POSES.length * STEP, h: floor(VARIANTS.length - 1) + 14 }, (c) => {
  c.rect(0, 0, X0 + POSES.length * STEP, floor(VARIANTS.length - 1) + 14, "n")
  VARIANTS.forEach(([, label], i) => {
    c.rect(0, floor(i), X0 + POSES.length * STEP, 8, "1"); c.rect(0, floor(i), X0 + POSES.length * STEP, 1, "3")
    TXT.draw(c, 6, floor(i) - 30, label, "v", { font: "hud" })
  })
}, ...stamps)

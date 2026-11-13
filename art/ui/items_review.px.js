// Review sheets for art/ui/items.px.js, never built into the game:
//   items_review    the six painted icons over the chosen blocks (art/test/inventar_blocks.px.js, under "blk."),
//                   on the bar's dark panel; docs/rooms/inventar_x4.png
//   items_tasche    the bag as the game shows it, open in the flat with the six (over the block sheet's
//                   screenshot build/blocks/inventar/bag_1x.png: the bar at y 156, cells 26 apart, EVI in the
//                   first); docs/rooms/inventar_tasche_gemalt_x3.png
//   PXL build art/ui/items_review.px.js --out build/paint/inventar --share 4 --no-preview
include("items.px.js")
include("../test/inventar_blocks.px.js", { as: "blk" })   // brings TXT (art/lib/text.js) with it
pal({ z: "#0b1020", 6: "#617aa0", G: "#8e96a8" })

const RV_ITEMS = ["ausweis", "haken", "stick", "tap", "reis", "suppe"]
const RV_CHOSEN = { ausweis: "a", haken: "b", stick: "a", tap: "a", reis: "a", suppe: "a" }
const RV_LABEL = { ausweis: "ID CARD", haken: "HOOK", stick: "STICK", tap: "TAP", reis: "RICE", suppe: "BROTH" }

const RV_CW = 36, RV_X0 = 30
scene("items_review", { w: RV_X0 + RV_ITEMS.length * RV_CW + 2, h: 56, bg: "z" },
  (c) => {
    RV_ITEMS.forEach((it, i) => TXT.draw(c, RV_X0 + i * RV_CW + RV_CW / 2, 4, RV_LABEL[it], "6", { font: "hud", align: "center" }))
    TXT.draw(c, 4, 19, "BLOCK", "G", { font: "hud" })
    TXT.draw(c, 4, 39, "PAINT", "G", { font: "hud" })
  },
  ...RV_ITEMS.flatMap((it, i) => [
    stamp(`blk.inv_${it}_${RV_CHOSEN[it]}`, RV_X0 + i * RV_CW + 8, 14),
    stamp(`inv_${it}`, RV_X0 + i * RV_CW + 8, 34),
  ]))

sprite("_items_bag", { png: "../../build/blocks/inventar/bag_1x.png" })
scene("items_tasche", { w: 320, h: 180 },
  stamp("_items_bag", 0, 0),
  ...RV_ITEMS.map((it, i) => stamp(`inv_${it}`, 34 + 26 * i, 161)))

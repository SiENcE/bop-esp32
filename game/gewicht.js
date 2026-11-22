// Nagiwa: the weight of the Kassenbuch (story §5, the user's decision 2026-11-22: by the moral compass, and the player never sees it).
// In the finale the Witness shows Juno her Kassenbuch, and its weight helps decide whether he trusts her. What counts is what Juno chose,
// not what happened after: the consequences (Okonkwo robbed, Bao hurt, Kessler begging, Ines dead) stand in the book with their faces
// but count through the choice that caused them, or luck would decide. Plus: Juno harmed someone for money or comfort; minus: she
// protected, helped or told the truth without earning by it. A sale whose clip she anonymized first weighs one less.
// Nothing here is a flag: Nagiwa.ledgerWeight() reads the Kassenbuch's own entries (ledger_<id>), whenever a chapter needs it.
"use strict";

(function () {
/** @type {Record<string, Record<string, number>>} entry -> its value -> weight (a value not listed weighs 0) */
const W = {
  // the prologue
  kessler: { cut: 2 },                                          // a made-up affair that ends a marriage, for 100 more
  sable_kessler: { sold: 1, swap: 1 },                          // a man's secret sold
  // Chapter 1
  varga: { sold: 3 },                                           // a man sold to a thug (lied: criminals lied to, nobody hurt)
  kessler_warn: { warned: -1 },
  tide: { sold: 3 },                                            // a shop sold to robbers
  okonkwo: { warned: -1 },
  wren: { sold: 3, sold_back: 3, refused: -1 },                 // a woman sold to her killer, or a no
  wren_live: { paid: 1 },                                       // paid for watching a murder
  imai: { truth: -1, dream: 1 },                                // taken seriously, or soothed into drops against dreaming
  vesper_ring: { sold: 1, seen: 1 },                            // misery as entertainment (anonymized: one less)
  vesper_morrow: { sold: 1, seen: 1 },
  vesper_traeger: { sold: 2, seen: 2 },                         // a child's grief sold
  // Chapter 2
  vesper_ines: { sold: 2 },                                     // her death for 5000 as entertainment, but the truth ran a night
  sable_ines: { sold: 3, proof: 3, warned: 3, proof_warned: 3 },// sold to Nagi·wa, the truth buried, for money
  morrow_ines: { given: -1 },                                   // given as evidence, for nothing, at a risk
  lantern_ines: { given: -2 },                                  // given so the truth is sent
  kessler_alms: { given: -1 },
  haldane: { truth: -1, fake: 1 },                              // honest with a mother, or a merciful fake
  sable_cam51: { ring: 1 },                                     // Kessler's misery sold once more
  imai2: { truth: -1, dream: 1 },
  shop24: { cut: -1, shown: 1, sold: 2 },                       // a lie that shields two, or the homeless man driven off
};
// the clips whose anonymized sale weighs one less (anon_<cache id>, game/deck.js)
const ANON = { vesper_ring: "anon_clip_kessler_ring", vesper_morrow: "anon_clip_morrow_bribe", vesper_traeger: "anon_clip_traeger" };

// every entry and value named here must be the Kassenbuch's own (a typo would weigh nothing, silently): checked when the game loads
for (const [id, vals] of Object.entries(W)) {
  const def = /** @type {any} */ (Nagiwa.ledger)[id];
  if (!def) throw new Error(`Nagiwa weights: no Kassenbuch entry "${id}"`);
  for (const v of Object.keys(vals)) if (!(v in (def.what ?? {}))) throw new Error(`Nagiwa weights: "${id}" has no value "${v}"`);
}

/** The Kassenbuch's weight now (hidden from the player: no screen shows it). @returns {number} */
Nagiwa.ledgerWeight = function () {
  let sum = 0;
  for (const [id, vals] of Object.entries(W)) {
    const v = Cutaway.state.flag(`ledger_${id}`);
    if (v === undefined || v === null || !(String(v) in vals)) continue;
    const w = vals[String(v)];
    sum += w > 0 && /** @type {any} */ (ANON)[id] && Cutaway.state.flag(/** @type {any} */ (ANON)[id]) ? w - 1 : w;
  }
  return sum;
};
})();

// Nagiwa: Sable, behind the curtain on the Drain Market (story §4): her booth and her talk, in every chapter. She sells access and
// buys what is raw. Her talk is a tree, as every talk (docs/dialog-design.md §4): three places on the top level and the way out, so
// never more than four show. Chapter 1 has its own three (CAM 15's code for job A, Varga, what else she sells); Chapter 2 has "Ich such
// was." and "Ich hab was zu verkaufen." in their places, each opening the questions of the threads under it. Each question asks only its
// own thread's flags (CLAUDE.md: threads share no flag), and each says its chapter in its own condition (day<5, day>4), so every option
// of hers stands here, not patched in by the chapter that came later. What she sells comes with its thread's flags:
//   code_cam15 (job A, game/auftrag_varga.js), link_cam51 (Frau Haldane's son, game/kapitel2_haldane.js), code_cam33 (Teo, game/kapitel2_teo.js), know_pike=sable (the way to
//   Lantern, game/kapitel2_lantern.js), e2=sable (decision 2), ledger_shop24=sold (the 24-hour shop, game/kapitel2_laden.js)
"use strict";

(function () {
const AM = Nagiwa.at.drain_market, AB = Nagiwa.at.sable_booth;
const S = (/** @type {string} */ text) => ({ say: "sable", text });
// Sable is drawn from the front, lens over the left eye: the same picture for every facing, so the engine never mirrors it
const every = (/** @type {string} */ anim) => ({ se: anim, sw: anim, ne: anim, nw: anim });

Nagiwa.ledger.sable_kessler.what.swap = "Kesslers Schulden, gegen einen Code";
Cutaway.actor("sable", { name: "Sable", color: "#ff4fd3", room: "sable_booth", at: AB.sable, facing: "sw",
  costume: { idle: every("sable_sit"), walk: every("sable_sit"), talk: every("sable_talk") }, voice: { pitch: 56, range: 3, wave: "triangle", syllable: 80, speed: 0.95 },
  look: ["Sable hat einen Mantel, eine Pfeife und eine Preisliste.", "Bei Sable hat alles einen Preis. Das ist das Ehrliche daran."],
  talk: [S("Juno. Kaufst du, oder verkaufst du?"), { dialog: "sable" }] });

// what each of Chapter 2's questions needs: the thread's own flags, nothing of another's
const HOSTEL = ["haldane_ask", "!link_cam51", "!off_haldane"];           // Frau Haldane asked, the archive's look not bought
const SWAMP = ["know_sumpf", "!know_pike", "!off_lantern"];              // the swamp found under Lantern's noise, Pike not yet known
const PUMP = ["!code_cam33", "!off_teo"];                                // Teo's pump hall, its code not bought (game/kapitel2_teo.js)
const CLIP = ["cache_clip_ines_death", "!e2", "!off_main"];              // the murder's recording, decision 2 still open
const SHOP = ["cache_clip_shop24", "!mont_clip_shop24", "!ledger_shop24", "!off_shop24"];
// Chapter 2's decision 2: the clip sold to Sable at the price she named (the four values of ledger_sable_ines)
const SABLE_CLIP = [{ set: "e2", value: "sable" },
  { if: "forgery_proven", then: [{ if: "k1a=warned", then: [{ ledger: "sable_ines", value: "proof_warned" }], else: [{ ledger: "sable_ines", value: "proof" }] }],
    else: [{ if: "k1a=warned", then: [{ ledger: "sable_ines", value: "warned" }], else: [{ ledger: "sable_ines", value: "sold" }] }] },
  S("Nett."), "Sable fragt nicht, wer sie war. Sable fragt nie.", "Wer sie kauft, sagt Sable auch nicht. Das kostet extra."];
const BACK = { text: "Was anderes.", silent: true, goto: "main" };

Cutaway.dialog("sable", {
  // Chapter 1 shows the first, third and fifth, Chapter 2 the second, fourth and fifth: the same three places
  main: [
    { text: "„Hast du den Code für die Kamera im Morpheus? CAM 15.“", if: ["day<5", "varga_step", "!code_cam15"], goto: "code", then: [S("Achtzig. Oder was, das achtzig wert ist.")] },
    { text: "„Ich such was.“", if: ["day>4", { or: [HOSTEL, SWAMP, PUMP] }], goto: "search", then: [S("Suchen kostet. Was?")] },
    { text: "„Du hast Varga meinen Namen gegeben.“", if: "day<5", then: [S("Verkauft. Geben tu ich nichts."), "Für wie viel?", S("Das kostet extra.")] },
    { text: "„Ich hab was zu verkaufen.“", if: ["day>4", { or: [CLIP, SHOP] }], goto: "sell", then: [S("Zeig.")] },
    { text: "„Was verkaufst du sonst noch?“", then: [S("Steht an der Wand. Namen, Adressen."), "Und Geheimnisse?", S("Frag. Fragen kostet schon.")] },
    { text: "Bis dann.", silent: true, goto: "end" },
  ],
  // ---- Chapter 2: what Juno looks for
  search: [
    // Frau Haldane's son (kapitel2-design §6.2, H2): a look into the archive of his hostel, for chits or a clip
    { text: "„Hast du eine Kamera im Fünften? Im Wohnheim 5-Süd.“", if: HOSTEL, goto: "cam51",
      then: [S("5-Süd. Nagi·was Wohnheim, Schlafsaal C hat eine Kamera."), S("Live nicht. Ins Archiv lass ich dich."), S("Hundertfünfzig. Oder einen Clip, roh. Was Echtes.")] },
    // the way to Lantern (§3.5, L3; the user's wish, 2026-11-21): for once for nothing, once Juno has found the swamp under his noise
    { text: "„Weißt du, wo hier Bäume im Wasser stehen?“", if: SWAMP, goto: "main", then: [
      "Mit grünen Lichtern dazwischen.", S("Draußen. Wo die Ringe aufhören."), S("Pike fährt da raus. Das Datenfloß."),
      { set: "know_pike", value: "sable" }, "Und was kostet das?", S("Das war gratis. Das nächste nicht.")] },
    // Teo's pump hall (§6.6, T2; the user's wish 2026-11-22: Juno has to go out for it): the Flutwerk's own net
    { text: "„Die Pumpenhalle drei. Hast du da eine Kamera?“", if: PUMP, goto: "cam33", then: [S("Flutwerk. Die zahlen schlecht und ändern nie was."), S("Hundert.")] },
    BACK,
  ],
  cam33: [
    { text: "„Hier sind hundert.“", if: "chits>=100", goto: "end", then: [{ ledger: "sable_cam33", value: "paid" }, { set: "code_cam33" }, S("Nett."),
      "Der Code von CAM 33 ist jetzt auf dem Deck. Teos Halle."] },
    { text: "„Das ist mir zu teuer.“", goto: "main", then: [S("Das Flutwerk läuft nicht weg.")] },
  ],
  cam51: [
    { text: "„Hier sind hundertfünfzig.“", if: "chits>=150", goto: "end", then: [{ ledger: "sable_cam51", value: "paid" }, { set: "code_cam51" }, { set: "link_cam51" },
      S("Nett."), "CAM 51 steht jetzt auf dem Deck. Nur das Archiv, einen Monat zurück."] },
    { text: "„Nimm dafür Kesslers Ring.“", if: { or: [["cache_clip_kessler_ring", "!anon_clip_kessler_ring"], "cache_clip_kessler_cut"] }, goto: "end",
      then: [{ ledger: "sable_cam51", value: "ring" }, { set: "code_cam51" }, { set: "link_cam51" }, S("Den Ring will immer noch einer sehen. Nett."),
        "Jetzt zieht Kessler seinen Ring noch mal ab. Für jemand, den ich nicht kenne.", "CAM 51 steht auf dem Deck. Nur das Archiv."] },
    { text: "„Das ist mir zu teuer.“", goto: "main", then: [S("Das Archiv wartet.")] },
  ],
  // ---- Chapter 2: what Juno has to sell
  sell: [
    // decision 2 (kapitel2-design §3.6): Sable buys the clip and sells it on to Nagi·wa
    { text: "„Ich hab die Aufnahme aus der alten Metro.“", if: CLIP, goto: "clip",
      then: [S("Man fragt danach."), "Ines auf der Treppe. Bis er hochsieht.",
        { if: "forgery_proven", then: ["Die im Glass ist gefälscht. Das kann ich zeigen.", S("Mit Beweis kostet's mehr. Auch beim Käufer.")] },
        { if: "k1a=warned", then: [S("Varga redet. Tausend weniger.")] },
        { if: "forgery_proven", then: [{ if: "k1a=warned", then: [S("3000.")], else: [S("4000.")] }],
          else: [{ if: "k1a=warned", then: [S("2000.")], else: [S("3000.")] }] }] },
    // the 24-hour shop's thread (§6.5): she buys the night's clip for the shop's chain
    { text: "„Ich hab einen Clip aus einem 24h-Laden.“", if: SHOP, goto: "shop24",
      then: ["Der Mann mit dem Wagen, um halb drei. Und draußen schläft das Schaf, das auf den Laden aufpassen soll.", S("Die Kette zahlt für so was. Sechzig.")] },
    BACK,
  ],
  shop24: [
    { text: "„Verkauft.“", goto: "end", then: [{ ledger: "shop24", value: "sold" }, S("Nett."), "Die Kette sieht jetzt beide. Den, der nimmt, und den, der schläft."] },
    { text: "„Noch nicht.“", goto: "main", then: [S("Sechzig. Morgen vielleicht noch fünfzig.")] },
  ],
  clip: [
    { text: "„Verkauft.“", if: "cache_clip_ines_cut", goto: "end", then: SABLE_CLIP },
    // the whole clip: EVI asks first about the whisper in it (kapitel2-design §3.1)
    { text: "„Verkauft.“", if: "!cache_clip_ines_cut", goto: "whisper",
      then: [{ evi: "besorgt" }, { say: "evi", text: "Im Clip ist das Flüstern. Willst du, dass das jemand hört?" }] },
    { text: "„Noch nicht.“", goto: "main", then: [S("Ich hab Zeit. Die Aufnahme nicht.")] },
  ],
  whisper: [
    { text: "„Ja. Der Clip geht ganz raus.“", goto: "end", then: SABLE_CLIP },
    { text: "„Nein. Das Flüstern schneid ich vorher raus.“", if: "!off_lantern", goto: "end",
      then: [{ cache: "clip_ines_cut" }, { sfx: "glitch" }, "Ich schneid das Flüstern raus. Dann weiß keiner von der Sechs.", ...SABLE_CLIP] },
    { text: "„Doch nicht.“", goto: "main", then: [S("Ich hab Zeit. Die Aufnahme nicht.")] },
  ],
  // ---- Chapter 1, job A: the Morpheus' camera
  code: [
    { text: "„Hier sind achtzig.“", if: "chits>=80", goto: "end", then: [{ inc: "chits", by: -80 }, { set: "code_cam15" }, S("Nett. Das Morpheus ändert ihn nie."), "CAM 15 steht jetzt auf dem Deck."] },
    { text: "„Ich geb dir Kesslers Schulden für den Code.“", if: ["cache_note_kessler_debt", "!ledger_sable_kessler"], goto: "end", then: [{ ledger: "sable_kessler", value: "swap" }, { set: "code_cam15" }, S("Nett."), "Das landet auch im Kassenbuch. Alles."] },
    { text: "„Das ist zu teuer.“", goto: "main", then: [S("Heute. Morgen auch.")] },
  ],
});

// ---- the booth, behind the curtain at the market's south bank
const AK = Cutaway.room.get("drain_market").hotspots;
AK.curtain = { name: "Vorhang", rect: AM.curtainRect, walkTo: AM.curtain, face: "down", look: "Hinter dem Vorhang riecht's nach Pfeife. Da sitzt Sable.", use: [{ goto: "sable_booth", at: AB.arrive, face: "se" }] };
Cutaway.room("sable_booth", { name: "Sables Bude", background: "sable_booth_bg", walk: AB.walk, props: AB.props,
  ambience: ["neon_buzz"], music: { theme: "juno", intensity: 0.4 },
  hotspots: {
    curtain: { name: "Vorhang", poly: AB.curtainPoly, walkTo: AB.door, face: "nw", use: [{ goto: "drain_market", at: AM.curtain, face: "up" }] },
    prices: { name: "Preisliste", rect: AB.pricesRect, walkTo: AB.front, face: "ne", look: ["NAMES 50. ADDRESSES 80. SECRETS: ASK.", "Ich hab schon teurer gekauft. Und schon billiger verkauft."] },
    screens: { name: "Bildschirme", poly: AB.screensPoly, walkTo: AB.front, face: "nw", look: "Sables Bildschirme. Ich schau nicht genauer hin. Das kostet bestimmt auch." },
    bird: { name: "Vogel", poly: AB.birdPoly, walkTo: AB.cage, face: "ne", look: "Im Käfig sitzt ein Vogel aus Draht. Er singt nicht, und Sable sagt, das ist der Preis." },
  } });
})();

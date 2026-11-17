// Nagiwa: Chapter 2, what comes after Chapter 1 (docs/kapitel2-design.md §5). Each consequence reads only Chapter 1's answers (e1, k1a, k1b)
// and the day; Varga's and the corner shop's stay threads of their own (off_varga, off_tide), and only what Juno can still choose is state:
//   ledger_varga2   paid | owed: K1a lied, so Varga's man waits at the Kessel Block's door on Saturday and Sunday (19:00 to 23:00, the
//                   hours the shadow stands there too, so waiting stops nowhere new); Juno pays him the 200, says she hasn't got it, or
//                   walks past (no flag). Monday's note in the mailbox reads it. Varga's thread ends here
//   ledger_kessler_alms   given: Kessler begging on the Drain Market from Sunday (K1a sold, or no answer: Varga found him himself)
// What follows from an answer alone is no state: the Kassenbuch's lines written at the act's start or overnight (the same for everyone with
// that answer), the looks, Mei's news, Okonkwo's greeting, TIDE's last message, WREN's deleted contact.
// Painted (art/characters/k2_folgen.px.js): Varga's man with his octopus mod, Kessler from above; Bao's bandage (art/characters/bao.px.js).
// On the places, painted on the approved blocks (kapitel2-design §5, §9.1): the planks on Okonkwo's shop (Jade Row and CAM 07V), WHO TALKED?,
// GLASSER LIES, someone at Kessler's machine in CAM 03, the bowl in CAM 22, the tape in CAM 30, the paper boat at the monument.
"use strict";

(function () {
const AW = Nagiwa.at.kowalski, AM = Nagiwa.at.drain_market;
const VARGA = "!off_varga", TIDE = "!off_tide";

// ---- what the Kassenbuch writes by itself (kapitel2-design §5): deterministic, so no state of their own
Object.assign(Nagiwa.ledger, {
  wren_other: { to: "WREN", what: { other: "hat es von jemand anderem" } },
  okonkwo_robbed: { to: "OKONKWO", what: { robbed: "ausgeraubt" } },
  bao_hurt: { to: "BAO", what: { hurt: "Gehirnerschütterung" } },
  kessler_hurt: { to: "KESSLER", what: { begging: "zwei Rippen, ein Arm. Bettelt." } },
  kessler_alms: { to: "KESSLER", what: { given: "fünfzig, auf dem Drain-Markt" }, chits: { given: -50 } },
  varga2: { to: "G. VARGA", what: { paid: "die 200 zurück", owed: "200, geschuldet" }, chits: { paid: -200 } },
});

// ---- WREN (§5): after e1=sold the contact is gone on Saturday, the chits stay; after e1=refused the Kassenbuch has the line (the act's start)
Object.assign(Nagiwa.contacts, { wren_k2: { name: "WREN", color: "#d0d8f0", status: "gelöscht", if: ["day>4", "e1=sold"], unread: "!read_wren_k2",
  open: [{ if: "!read_wren_k2", then: [{ set: "read_wren_k2" }, "Gelöscht. Als hätte es WREN nie gegeben.", "Die Chits sind noch da."] }] } });
Cutaway.state.view("read_wren_k2");
Nagiwa.threads.wren_k2 = [{ from: "wren_k2", text: "KONTAKT GELÖSCHT" }];
Cutaway.i18n.declare("chat", ["gelöscht"]);

// ---- Varga (§5, K1a)
// sold: on Saturday CAM 15 shows capsule 23 open, broken glasses on the floor (Varga's people came on Friday night)
const kapsel23 = Cutaway.room.get("cam15").hotspots.kapsel23, kapselLook = kapsel23.look;
kapsel23.if = { or: [kapsel23.if, ["day>4", "k1a"]] };
kapsel23.look = [{ if: "day>4", then: [
  { if: "k1a=sold", then: ["Kapsel 23 steht offen. Auf dem Boden liegt eine zerbrochene Brille."] },
  { if: "k1a=warned", then: ["Kapsel 23 ist leer. Er ist weg, bevor sie kamen."] },
  { if: "k1a=lied", then: ["Kapsel 23 ist zu. Ob er noch drin ist, will ich nicht wissen."] }], else: kapselLook }];
// sold, or no answer at all (Varga found him himself): from Sunday Kessler sits beside Ratz's stall with his arm in plaster and begs. He
// doesn't know Juno; she can give him fifty or walk on
const K = (/** @type {string} */ text) => ({ say: "kessler_markt", text });
Cutaway.actor("kessler_markt", { name: "Kessler", color: "#b8c890", walkTo: AM.kesslerTalk, face: "up",
  costume: { idle: { down: "kessler_top_idle_down" }, walk: { down: "kessler_top_idle_down" }, talk: { down: "kessler_top_talk_down" } },
  voice: { pitch: 48, range: 3, wave: "triangle", syllable: 85, speed: 0.9 },
  look: ["Das ist Kessler. Der Arm ist in Gips, und er sitzt schief, wegen der Rippen.", "Er sieht mich an wie jeden anderen. Er weiß nicht, wer ich bin."],
  talk: [{ dialog: "k2_kessler" }] });
Cutaway.routine("kessler_markt", [{ day: [6, 7], from: "18:00", to: "04:00", if: [{ or: ["k1a=sold", "!k1a"] }, VARGA], room: "drain_market", at: AM.kessler, face: "down" }]);
Cutaway.dialog("k2_kessler", { main: {
  enter: [K("Haben Sie was übrig? Mit dem Arm nimmt mich keiner.")],
  choices: [
    { text: "„Hier. Fünfzig.“", if: ["chits>=50", "!ledger_kessler_alms"], goto: "end", then: [{ ledger: "kessler_alms", value: "given" }, K("..."), K("Danke."),
      "Er weiß nicht, wofür er sich bedankt. Ich schon."] },
    { text: "„Was ist passiert?“", goto: "main", then: [K("Ich bin die Treppe runter. Dreimal."), "So sagt man das hier."] },
    { text: "Weitergehen.", silent: true, goto: "end", then: [{ if: "ledger_kessler_alms", then: [K("Gute Nacht.")] }] },
  ] } });

// lied: Varga's man waits beside the Kessel Block's door on Saturday and Sunday evening. „Die 200, Glasserin.“ He blocks no way
const VM = (/** @type {string} */ text) => ({ say: "vargas_mann", text });
Cutaway.actor("vargas_mann", { name: "Vargas Mann", color: "#a89888", walkTo: AW.arrive, face: "sw",
  costume: { idle: { se: "vargas_mann_idle_se", ne: "vargas_mann_idle_ne" }, walk: { se: "vargas_mann_idle_se", ne: "vargas_mann_idle_ne" }, talk: { se: "vargas_mann_talk_se", ne: "vargas_mann_idle_ne" } },
  voice: { pitch: 34, range: 2, wave: "triangle", syllable: 110, speed: 0.75 },
  look: ["Der ist breit wie die Tür. Er lehnt an der Wand und wartet.", "Auf mich. Varga hat sein Geld nicht vergessen."],
  talk: [{ dialog: "k2_vargas_mann" }] });
Cutaway.routine("vargas_mann", [{ day: [5, 6], from: "19:00", to: "23:00", if: ["k1a=lied", "!ledger_varga2", VARGA], room: "kowalski", at: AW.vargasMann, face: "se" }]);
Cutaway.dialog("k2_vargas_mann", { main: {
  enter: [VM("Die 200, Glasserin.")],
  choices: [
    { text: "„Hier.“", if: "chits>=200", goto: "end", then: [{ ledger: "varga2", value: "paid" }, VM("..."), VM("Gut."), "Er zählt nicht mal nach. Er geht einfach."] },
    { text: "„Hab ich nicht.“", goto: "end", then: [VM("..."), VM("Nicht? Dann schuldest du Varga was."), { ledger: "varga2", value: "owed" }, "Er stößt sich von der Wand ab und geht."] },
    { text: "„Später.“", silent: true, goto: "end", then: [VM("Ich steh hier gern. Regnet ja nur.")] },
  ] } });
// Monday: a note in Juno's mailbox, by what she did (or didn't)
const mailboxes = Cutaway.room.get("kessel_lobby").hotspots.mailboxes, mailUse = mailboxes.use;
const VARGA_NOTE = [{ if: "ledger_varga2=paid", then: ["Ein Zettel ohne Umschlag. Da steht: QUITT. V."] },
  { if: "ledger_varga2=owed", then: ["Ein Zettel ohne Umschlag. Da steht: 200. DU WEISST. V."] },
  { if: "!ledger_varga2", then: ["Ein Zettel ohne Umschlag. Da steht nur: 200. V.", "Den schmeiß ich weg. Er kommt trotzdem wieder."] }];
mailboxes.use = [{ if: ["day=7", "k1a=lied", VARGA], then: VARGA_NOTE, else: mailUse }];

// Kessler buys his noodles elsewhere now: from Saturday someone else stands at the machine in CAM 03 in the evening and pulls number 7 (one
// of the feeds' commuters, kapitel2-design §9.1; only a look, the hours the others keep)
Cutaway.actor("k2_automat", { name: "Pendlerin", color: "#8acfae",
  costume: { idle: "commuter_d_feed", walk: "commuter_d_feed_walk", talk: "commuter_d_feed" },
  look: ["Jemand zieht Nummer 7. Da stand sonst Kessler."], talk: ["Sie isst Huhn scharf, wie er. Die halbe Pumpenverwaltung isst das."] });
Cutaway.routine("k2_automat", [{ day: [5, 6, 7], from: "19:00", to: "23:00", room: "cam03", at: Nagiwa.at.cam03.vendingSpot, face: "nw" }]);

// Saturday in CAM 22: Ines's place at Pho Pump stays empty, and the cook puts a bowl there anyway (kapitel2-design §9.1)
const cam22 = Cutaway.room.get("cam22"), barLook = cam22.hotspots.bar.look;
cam22.props = [...(cam22.props ?? []), { id: "schale", image: "cam22_schale", at: [Nagiwa.at.cam22.seat[0], Nagiwa.at.cam22.seat[1] + 3], if: "day=5" }];
cam22.hotspots.bar.look = [{ if: "day=5", then: ["Ihr Platz ist leer. Der Koch hat trotzdem eine Schale hingestellt.", "Sie dampft noch."], else: [barLook] }];

// From Saturday: the police tape across the way down in CAM 30 (art/cams/cam30.px.js), and a paper boat at the monument in the alley with
// I. on its side (kapitel2-design §9.1)
const cam30 = Cutaway.room.get("cam30"), signLook = cam30.hotspots.sign.look;
cam30.props = [...(cam30.props ?? []), { id: "tape", image: "cam30_tape", at: [0, 0], anchor: [0, 0], baseline: 0.5, if: "day>4" }];
cam30.hotspots.sign.look = [{ if: "day>4", then: [signLook, "Davor hängt jetzt Absperrband von Revier 9."], else: [signLook] }];
const gasse = Cutaway.room.get("gasse"), statue = gasse.hotspots.statue, statueLook = statue.look;
gasse.props.push({ id: "papierboot", image: "gasse_papierboot", at: Nagiwa.at.gasse.papierboot, anchor: [0, 0], baseline: 179, if: "day>4" });
statue.look = [{ if: "day>4", then: [...statueLook, "Ein Papierboot ist neu. Auf der Seite steht I."], else: statueLook }];

// ---- the corner shop (§5, K1b)
// sold: the raid on Friday night is not shown; from Saturday the shop is boarded up, and the Kassenbuch has it (the act's start)
const SHUT = ["day>4", "k1b=sold"];
const jade = Cutaway.room.get("jade_row").hotspots, shopUse = jade.door.use, shopLook = jade.door.look;
jade.door.look = [{ if: SHUT, then: ["Vor Okonkwos Tür sind Bretter genagelt. Drinnen ist es dunkel."], else: shopLook }];
jade.door.use = [{ if: SHUT, then: ["Da komm ich nicht rein. Und ich hab den Code verkauft, mit dem sie reingekommen sind."], else: shopUse }];
// the planks and the dark windows (art/rooms/jade_row.px.js, the picture painted again boarded up: only what differs, laid over it), and the
// shop's lamps out, so Juno no longer takes on its warm light
const jadeRoom = Cutaway.room.get("jade_row"), JP = Nagiwa.parts.jade_row, AJ = Nagiwa.at.jade_row;
const over = (/** @type {string} */ n, /** @type {any} */ cond) => { const o = JP.overlays[n]; jadeRoom.props.push({ id: n, image: o.name, at: o.at, anchor: [0, 0], baseline: 0.5, if: cond }); };
over("bretter", SHUT);
for (const i of JP.shopLamps) jadeRoom.light.lamps[i].if = { not: SHUT };
for (const id of ["window", "window_near"]) { const h = jade[id], look = h.look; h.look = [{ if: SHUT, then: ["Vor den Fenstern sind Bretter genagelt. Dahinter ist es dunkel.", "Die Regale sind halb leer. Den Rest haben sie mitgenommen."], else: look }]; }
// and CAM 07V across the lane sees the planks close, the shop dark behind them, half its goods and the register gone
// (art/rooms/okonkwo_shop.px.js); its props are a copy, so the shop room keeps its own
const cam07v = Cutaway.room.get("cam07v"), DARK_SHOP = /** @type {Record<string, string>} */ ({ okonkwo_shop_bg: "okonkwo_shop_dunkel", okonkwo_shop_counter: "okonkwo_shop_counter_dunkel" });
cam07v.props = [...cam07v.props.flatMap((/** @type {any} */ p) => DARK_SHOP[p.image]
  ? [{ ...p, if: { not: SHUT } }, { ...p, id: p.id + "_dunkel", image: DARK_SHOP[p.image], if: SHUT }] : [p]),
  { id: "bretter", image: "okonkwo_shop_bretter", at: [0, 0], anchor: [0, 0], baseline: 1000, if: SHUT }];
const v7 = cam07v.hotspots, safeLook = v7.safe.look, shelvesLook = v7.shelves.look;
v7.safe.look = [{ if: SHUT, then: ["Die Kasse ist weg. Der Tresor darunter steht offen.", "Mit meinem Code ging der auf."], else: safeLook }];
v7.shelves.look = [{ if: SHUT, then: ["Die Regale sind halb leer. Nur das Foto hängt noch."], else: shelvesLook }];
// warned: WHO TALKED? on the passage's wall in the arch, sprayed red
const WARNED = ["day>4", "k1b=warned", TIDE];
over("tag", WARNED);
jade.tag = { name: "Graffiti", rect: AJ.tagRect, if: WARNED, walkTo: AJ.back, face: "se", z: 1,
  look: ["Da steht WHO TALKED?, frisch gesprüht und in Rot.", "Die Boys suchen den, der Okonkwo gewarnt hat. Das war ich."], use: jade.back.use };
// sold: Bao got between them, and his cart stands empty on Saturday and Sunday (on Monday he is back, with his bandage): the props and his
// hotspots are gone those evenings, and he himself (placed away at the act's start, back overnight into Monday: the same for everyone)
const BAO_AWAY = ["day>4", "day<7", "k1b=sold"];
const kowalski = Cutaway.room.get("kowalski");
for (const p of kowalski.props) if (p.id === "cart" || p.id === "umbrella") p.if = { not: BAO_AWAY };
// and the cable it ran on, from the electrical box in the passage across the sidewalk, is gone with it (the street baked without it)
kowalski.props.push({ id: "no_cable", image: "kowalski_no_cable", at: AW.noCable, anchor: [0, 0], baseline: 0, if: BAO_AWAY });
for (const id of ["bao", "cart"]) { const h = kowalski.hotspots[id]; h.if = h.if ? [h.if, { not: BAO_AWAY }] : { not: BAO_AWAY }; }
(Nagiwa.nights[7].passes ??= []).push({ if: "k1b=sold", then: [{ place: "bao", room: "kowalski", at: AW.bao, face: "sw" }] });
// (on Monday he stands there all the same, with his bandage: his pose in game/cast.js) and says so (his talk: game/kapitel1_leben.js)
for (const id of ["bao", "cart"]) {
  const h = kowalski.hotspots[id], verb = id === "bao" ? "talk" : "use", before = h[verb];
  h[verb] = [{ if: ["day=7", "k1b=sold"], then: [{ say: "bao", text: "Eine Woche, sagt der Arzt. Ich sag Montag." }, "Er stellt mir die Schale hin, als wär nichts."], else: before }];
}
// lied: the boys failed at the safe; from Saturday GLASSER LIES on Juno's door. warned: Okonkwo greets her like a guest
const LIED = ["day>4", "k1b=lied", TIDE];
Cutaway.room.get("kessel_14").props.push({ id: "glasser", image: "kessel_14_glasser", at: Nagiwa.layouts.kessel_14.glasser, anchor: [0, 0], baseline: 0.5, if: LIED });
const doorJuno = Cutaway.room.get("kessel_14").hotspots.door_juno, doorLook = doorJuno.look;
doorJuno.look = [{ if: LIED, then: ["Auf meiner Tür steht GLASSER LIES. Gesprüht, in Rot.", "Die Tidewater Boys haben gemerkt, dass der Code falsch war."], else: [doorLook] }];
// no answer: TIDE writes once more on Saturday, and that's the end of it
const tide = Nagiwa.contacts.tide;
tide.if = [{ or: [["day>1", "day<5"], ["day=5", "!k1b"]] }, TIDE];
Nagiwa.threads.tide.push({ from: "tide", if: ["day>4", "!k1b"], at: "18:00", text: "Dann eben ohne dich." });
})();

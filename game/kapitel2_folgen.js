// Nagiwa: Chapter 2, what comes after Chapter 1 (docs/kapitel2-design.md §5). Each consequence reads only Chapter 1's answers (e1, k1a, k1b)
// and the day; Varga's and the corner shop's stay threads of their own (off_varga, off_tide), and only what Juno can still choose is state:
//   ledger_varga2   paid | owed: K1a lied, so Varga's man waits at the Kessel Block's door on Saturday and Sunday (19:00 to 23:00, the
//                   hours the shadow stands there too, so waiting stops nowhere new); Juno pays him the 200, says she hasn't got it, or
//                   walks past (no flag). Monday's note in the mailbox reads it. Varga's thread ends here
//   ledger_kessler_alms   given: Kessler begging on the Drain Market from Sunday (K1a sold, or no answer: Varga found him himself)
// What follows from an answer alone is no state: the Kassenbuch's lines written at the act's start or overnight (the same for everyone with
// that answer), the looks, Mei's news, Okonkwo's greeting, TIDE's last message, WREN's deleted contact.
// [PLATZHALTER] figures and pictures until their blocks are approved (§14): Varga's man wears the Tidewater boy, Kessler from above a
// vendor of the market; the boards on Okonkwo's shop, GLASSER LIES, WHO TALKED?, Bao away and with his bandage are not drawn yet
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
  costume: { idle: { down: "haendler_top_3_idle_down" }, walk: { down: "haendler_top_3_idle_down" }, talk: { down: "haendler_top_3_talk_down" } },
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
  costume: { idle: { se: "tideboy_idle_se" }, walk: { se: "tideboy_idle_se" }, talk: { se: "tideboy_talk_se" } },
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

// ---- the corner shop (§5, K1b)
// sold: the raid on Friday night is not shown; from Saturday the shop is boarded up, and the Kassenbuch has it (the act's start)
const SHUT = ["day>4", "k1b=sold"];
const jade = Cutaway.room.get("jade_row").hotspots, shopUse = jade.door.use, shopLook = jade.door.look;
jade.door.look = [{ if: SHUT, then: ["Vor Okonkwos Tür sind Bretter genagelt. Drinnen ist es dunkel."], else: shopLook }];
jade.door.use = [{ if: SHUT, then: ["Da komm ich nicht rein. Und ich hab den Code verkauft, mit dem sie reingekommen sind."], else: shopUse }];
// lied: the boys failed at the safe; from Saturday GLASSER LIES on Juno's door. warned: Okonkwo greets her like a guest
const doorJuno = Cutaway.room.get("kessel_14").hotspots.door_juno, doorLook = doorJuno.look;
doorJuno.look = [{ if: ["day>4", "k1b=lied", TIDE], then: ["Auf meiner Tür steht GLASSER LIES. Gesprüht, in Grün.", "Die Tidewater Boys haben gemerkt, dass der Code falsch war."], else: [doorLook] }];
// no answer: TIDE writes once more on Saturday, and that's the end of it
const tide = Nagiwa.contacts.tide;
tide.if = [{ or: [["day>1", "day<5"], ["day=5", "!k1b"]] }, TIDE];
Nagiwa.threads.tide.push({ from: "tide", if: ["day>4", "!k1b"], at: "18:00", text: "Dann eben ohne dich." });
})();

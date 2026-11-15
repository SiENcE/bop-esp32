// Nagiwa: Chapter 2, the stick (docs/kapitel2-design.md §3.1), on blocks. Ines' wallet is Lantern's, and its key is the stick from dryer 6:
// without both he can't send. Where it is:
//   stick_ines    Juno has it (kept from Chapter 1)
//   stick_dryer   she has put it back into dryer 6, anonymously; Lantern takes it the same night
//   (neither)     Lantern has it: he took it on Friday night if it was still there, or later from the dryer, or from her hand (§3.5)
// He looks into the dryer every night at half past twelve while he hasn't got it, seen in CAM 23 (he comes over the water: the alley is a
// jetty). A stick put back is always gone by the next evening (the user's decision, 2026-11-14): after his look it goes in the night unseen,
// even while Juno sleeps; on Monday, when he has looked already (there is no night after it, and the clock stands at 00:45 in his
// window), he takes it at once. Juno doesn't know his name until Sunday's news (§3.4, game/kapitel2_faelschung.js): to her he is the one
// from the metro until then.
// [PLATZHALTER] Lantern in CAM 23 is his figure from CAM 31 for now, not yet at the laundromat's scale (§10)
"use strict";

(function () {
const A23 = Nagiwa.at.cam23;

// ---- his look, each night from half past twelve while the stick isn't his, until he has looked (the scene walks him in and out: a
// routine's path pauses while a script runs, and once the scene is over he doesn't stand in the door again). Written out night by night,
// so the Schedule tab edits each
Cutaway.time.routines.get("lantern").push(
  { day: 5, from: "00:30", to: "00:45", room: "cam23", at: A23.door, face: "se", if: [{ or: ["stick_ines", "stick_dryer"] }, "!moment:lantern_sat"] },
  { day: 6, from: "00:30", to: "00:45", room: "cam23", at: A23.door, face: "se", if: [{ or: ["stick_ines", "stick_dryer"] }, "!moment:lantern_sun"] },
  { day: 7, from: "00:30", to: "00:45", room: "cam23", at: A23.door, face: "se", if: [{ or: ["stick_ines", "stick_dryer"] }, "!moment:lantern_mon"] },
);
// seen in CAM 23, or it happens unseen as the window ends; the first time Juno sees him come, after that he comes back
Cutaway.moment("lantern_sat", { room: "cam23", day: 5, from: "00:30", to: "00:45", if: { or: ["stick_ines", "stick_dryer"] }, play: [
  "Da kommt jemand übers Wasser, in einem Rollstuhl mit Schwimmern.",
  "Das ist er. Das ist der aus der Metro.",
  { walk: "lantern", to: A23.dryer6, free: true },
  "Er hält vor Trockner sechs.",
  { if: "stick_dryer", then: ["Er greift rein und hat ihn.", { unset: "stick_dryer" }, "Jetzt hat er, was sie ihm geben wollte."],
    else: ["Er greift rein, und die Sechs ist leer.", "Er sitzt eine Weile da, dann fährt er wieder.", "Er sucht ihn. Und ich hab ihn."] },
  { walk: "lantern", to: A23.door, free: true },
  { place: "lantern", room: null },
], unseen: [{ if: "stick_dryer", then: [{ unset: "stick_dryer" }] }] });
Cutaway.moment("lantern_sun", { room: "cam23", day: 6, from: "00:30", to: "00:45", if: { or: ["stick_ines", "stick_dryer"] }, play: [
  "Da ist er wieder, pünktlich um halb eins.",
  { walk: "lantern", to: A23.dryer6, free: true },
  { if: "stick_dryer", then: ["Er greift rein und hat ihn.", { unset: "stick_dryer" }, "Jetzt hat er, was sie ihm geben wollte."],
    else: ["Er greift rein, und die Sechs ist wieder leer.", "Er bleibt länger als gestern.", "Dann fährt er."] },
  { walk: "lantern", to: A23.door, free: true },
  { place: "lantern", room: null },
], unseen: [{ if: "stick_dryer", then: [{ unset: "stick_dryer" }] }] });
Cutaway.moment("lantern_mon", { room: "cam23", day: 7, from: "00:30", to: "00:45", if: { or: ["stick_ines", "stick_dryer"] }, play: [
  "Er kommt wieder. Er gibt nicht auf.",
  { walk: "lantern", to: A23.dryer6, free: true },
  { if: "stick_dryer", then: ["Er greift rein und hat ihn.", { unset: "stick_dryer" }, "Jetzt hat er, was sie ihm geben wollte."],
    else: ["Er greift rein. Wieder nichts.", "Er schlägt einmal mit der flachen Hand auf den Trockner, dann fährt er."] },
  { walk: "lantern", to: A23.door, free: true },
  { place: "lantern", room: null },
], unseen: [{ if: "stick_dryer", then: [{ unset: "stick_dryer" }] }] });
// put back after his look: gone before the next evening, unseen (Nagiwa.nights: what passes overnight)
for (const night of [6, 7]) (Nagiwa.nights[night].passes ??= []).push({ if: "stick_dryer", then: [{ unset: "stick_dryer" }] });

// ---- dryer 6 in Chapter 2: putting it back, anonymously (a click, or the stick on it)
const dryer6 = Cutaway.room.get("laundromat").hotspots.dryer6;
const PUT_BACK = [
  { unset: "stick_ines" }, { if: "has:stick", then: [{ remove: "stick" }] },
  // on Monday, once he has looked: he is still out on the water and takes it at once
  { if: ["day=7", "moment:lantern_mon"], then: ["Ich bin noch nicht an der Tür, da hör ich draußen einen Motor auf dem Wasser.", "Er hat gewartet. Jetzt hat er ihn."],
    else: [{ set: "stick_dryer" }, "So. Keiner weiß, dass ich hier war."] },
];
dryer6.use = [{ if: "day>4", then: [
  { if: "stick_ines", then: [{ if: "day=5", then: ["Hier lag er. Sie hat ihn für den aus der Metro hiergelassen."], else: ["Hier lag er. Sie hat ihn für Lantern hiergelassen."] },
    { dialog: "stick_zurueck" }],
    else: [{ if: "stick_dryer", then: ["Er liegt drin. Wer ihn sucht, findet ihn jetzt."], else: ["Er ist kalt und leer. Er hat ihn."] }] },
], else: dryer6.use }];
// (off_dryer shuts putting it back for the solver's run of the way to Lantern, which checks that the stick always reaches him by hand)
dryer6.with = { ...(dryer6.with ?? {}), stick: [{ if: ["day>4", "stick_ines", "!off_dryer"], then: PUT_BACK, else: ["Der gehört nicht in den Trockner. Noch nicht."] }] };
Cutaway.dialog("stick_zurueck", { main: { choices: [
  { text: "Zurücklegen.", silent: true, if: "!off_dryer", goto: "end", then: PUT_BACK },
  { text: "Behalten.", silent: true, goto: "end", then: ["Noch nicht."] },
] } });
// what she knows of it now: the whisper in CAM 31 told her
const stick = Cutaway.item.get("stick");
stick.look = [{ if: "day=5", then: ["Das ist ihr Schlüssel zu der Wallet. Der aus der Metro braucht ihn, sonst kann er nichts damit anfangen."],
  else: [{ if: "day>5", then: ["Das ist ihr Schlüssel zu der Wallet. Lantern braucht ihn, sonst kann er nichts damit anfangen."], else: [].concat(stick.look) }] }];
})();

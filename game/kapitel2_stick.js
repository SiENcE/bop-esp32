// Nagiwa: Chapter 2, the stick (docs/kapitel2-design.md §3.1). Ines' wallet is Lantern's, and its key is the stick from dryer 6:
// without both he can't send. Where it is:
//   stick_ines    Juno has it (kept from Chapter 1)
//   stick_dryer   she has put it back into dryer 6, anonymously; Lantern takes it the same night
//   (neither)     Lantern has it: he took it on Friday night if it was still there, or later from the dryer, or from her hand (§3.5)
// He looks into the dryer every night at half past twelve while he hasn't got it, seen in CAM 23 (he comes over the water: the alley is a
// jetty). A stick put back is always gone by the next evening (the user's decision, 2026-11-14): after his look it goes in the night unseen,
// even while Juno sleeps; on Monday, when he has looked already (there is no night after it, and the clock stands at 00:45 in his
// window), he takes it at once. Juno doesn't know his name until Sunday's news (§3.4, game/kapitel2_faelschung.js): to her he is the one
// from the metro until then.
// The Quiet at the dryer (quiet_dryer, game/kapitel2.js): once the whole clip has told Nagi·wa where the key lay, a man in white waits in
// the laundromat from the next evening; nothing can be put back then, and Lantern, who sees him from the water, no longer comes, so the
// stick only reaches him by hand (§3.1). (The runs with the way to Lantern shut, off_lantern, keep the dryer open: the way it leaves is
// shut there, and the run of that way alone shuts the dryer anyway, off_dryer.)
// Lantern in CAM 23 is his painted figure at the laundromat's size, turned (lantern23, below). The man in white is one of
// the Quiet's men, in CAM 23 and in the laundromat itself (game/kapitel2_quiet.js gives him his figure and his place in the laundromat)
"use strict";

(function () {
const A23 = Nagiwa.at.cam23;
const DRYER_FREE = { or: ["!quiet_dryer", "off_lantern"] };          // nobody in white sits at the dryer

// ---- his look, each night from half past twelve while the stick isn't his, until he has looked (the scene walks him in and out: a
// routine's path pauses while a script runs, and once the scene is over he doesn't stand in the door again). Written out night by night,
// so the Schedule tab edits each
// In CAM 23 he is the laundromat's size (CAM 23 is its own picture under the filter): his painted figure from the caravan, turned
// (art/characters/lantern.px.js: in SE, at the dryer NE with his hand in the drum, out NW). An actor of his own here, since CAM 31 keeps
// his feed figure. He comes only when nobody is inside (the user, 2026-11-19), so Juno sees him only through the camera
Nagiwa.people.lantern23 = Nagiwa.people.lantern;
Cutaway.actor("lantern23", { name: "Jemand im Rollstuhl", color: "#b0f0a0", speed: [28, 14], voice: { pitch: 46, wave: "square", syllable: 85 },
  costume: { idle: { se: "lantern_drive_se", ne: "lantern_reach_ne", nw: "lantern_drive_nw", sw: "lantern_sit_sw" },
    walk: { se: "lantern_drive_se", ne: "lantern_drive_se", nw: "lantern_drive_nw", sw: "lantern_drive_nw" } },
  look: ["Er trägt einen geflickten Poncho, und an seinem Rollstuhl hängen Schwimmer und Antennen."], talk: ["Er hört mich nicht. Ich bin nur die Kamera."] });
Cutaway.routine("lantern23", [
  { day: 5, from: "00:30", to: "00:45", room: "cam23", at: A23.door, face: "se", if: [{ or: ["stick_ines", "stick_dryer"] }, "!moment:lantern_sat"] },
  { day: 6, from: "00:30", to: "00:45", room: "cam23", at: A23.door, face: "se", if: [{ or: ["stick_ines", "stick_dryer"] }, "!moment:lantern_sun", DRYER_FREE] },
  { day: 7, from: "00:30", to: "00:45", room: "cam23", at: A23.door, face: "se", if: [{ or: ["stick_ines", "stick_dryer"] }, "!moment:lantern_mon", DRYER_FREE] },
]);
// seen in CAM 23, or it happens unseen as the window ends; the first time Juno sees him come, after that he comes back
Cutaway.moment("lantern_sat", { room: "cam23", day: 5, from: "00:30", to: "00:45", if: { or: ["stick_ines", "stick_dryer"] }, play: [
  "Da kommt jemand übers Wasser, in einem Rollstuhl mit Schwimmern.",
  "Das ist er. Das ist der aus der Metro.",
  { walk: "lantern23", to: A23.dryer6, free: true }, { face: "lantern23", to: "ne" },
  "Er hält vor Trockner sechs.",
  { if: "stick_dryer", then: ["Er greift rein und hat ihn.", { unset: "stick_dryer" }, "Jetzt hat er, was sie ihm geben wollte."],
    else: ["Er greift rein, und die Sechs ist leer.", "Er sitzt eine Weile da, dann fährt er wieder.", "Er sucht ihn. Und ich hab ihn."] },
  { walk: "lantern23", to: A23.door, free: true },
  { place: "lantern23", room: null },
], unseen: [{ if: "stick_dryer", then: [{ unset: "stick_dryer" }] }] });
Cutaway.moment("lantern_sun", { room: "cam23", day: 6, from: "00:30", to: "00:45", if: [{ or: ["stick_ines", "stick_dryer"] }, DRYER_FREE], play: [
  "Da ist er wieder, pünktlich um halb eins.",
  { walk: "lantern23", to: A23.dryer6, free: true }, { face: "lantern23", to: "ne" },
  { if: "stick_dryer", then: ["Er greift rein und hat ihn.", { unset: "stick_dryer" }, "Jetzt hat er, was sie ihm geben wollte."],
    else: ["Er greift rein, und die Sechs ist wieder leer.", "Er bleibt länger als gestern.", "Dann fährt er."] },
  { walk: "lantern23", to: A23.door, free: true },
  { place: "lantern23", room: null },
], unseen: [{ if: "stick_dryer", then: [{ unset: "stick_dryer" }] }] });
Cutaway.moment("lantern_mon", { room: "cam23", day: 7, from: "00:30", to: "00:45", if: [{ or: ["stick_ines", "stick_dryer"] }, DRYER_FREE], play: [
  "Er kommt wieder. Er gibt nicht auf.",
  { walk: "lantern23", to: A23.dryer6, free: true }, { face: "lantern23", to: "ne" },
  { if: "stick_dryer", then: ["Er greift rein und hat ihn.", { unset: "stick_dryer" }, "Jetzt hat er, was sie ihm geben wollte."],
    else: ["Er greift rein. Wieder nichts.", "Er schlägt einmal mit der flachen Hand auf den Trockner, dann fährt er."] },
  { walk: "lantern23", to: A23.door, free: true },
  { place: "lantern23", room: null },
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
  { if: "stick_ines", then: [{ if: DRYER_FREE, then: [
    { if: "day=5", then: ["Hier lag er. Sie hat ihn für den aus der Metro hiergelassen."], else: ["Hier lag er. Sie hat ihn für Lantern hiergelassen."] },
    { dialog: "stick_zurueck" }],
    else: ["Da drüben sitzt einer in Weiß und wartet auf keine Wäsche.", "Hier leg ich nichts mehr rein."] }],
    else: [{ if: "stick_dryer", then: ["Er liegt drin. Wer ihn sucht, findet ihn jetzt."], else: ["Er ist kalt und leer. Er hat ihn."] }] },
], else: dryer6.use }];
// (off_dryer shuts putting it back for the solver's run of the way to Lantern, which checks that the stick always reaches him by hand)
dryer6.with = { ...(dryer6.with ?? {}), stick: [{ if: ["day>4", "stick_ines", "!off_dryer", DRYER_FREE], then: PUT_BACK,
  else: [{ if: { not: DRYER_FREE }, then: ["Nicht, solange der in Weiß da sitzt."], else: ["Der gehört nicht in den Trockner. Noch nicht."] }] }] };
Cutaway.dialog("stick_zurueck", { main: { choices: [
  { text: "Zurücklegen.", silent: true, if: ["!off_dryer", DRYER_FREE], goto: "end", then: PUT_BACK },
  { text: "Behalten.", silent: true, goto: "end", then: ["Noch nicht."] },
] } });
// ---- the man in white in CAM 23, every evening once the Quiet knows of the dryer: he stands in the middle and looks at dryer 6 (his
// figure, the Quiet's at street size, and the same man in the laundromat itself: game/kapitel2_quiet.js)
Cutaway.actor("quiet_salon", { name: "In Weiß", color: "#f0f0f0", lit: false, costume: { idle: { se: "quiet_b_idle_se", ne: "quiet_b_idle_ne" } },
  look: ["Ein weißer Regenmantel im Waschsalon, und keine Wäsche.", "Er sitzt da, wo man die Sechs sieht. Die wissen es."],
  talk: ["Die Markierung rutscht ab. Da ist nichts, woran sie hängen bleibt."] });
Cutaway.routine("quiet_salon", [{ day: [6, 7], from: "18:00", to: "01:00", if: "quiet_dryer", room: "cam23", at: A23.quiet, face: "ne" }]);

// what she knows of it now: the whisper in CAM 31 told her
const stick = Cutaway.item.get("stick");
stick.look = [{ if: "day=5", then: ["Das ist ihr Schlüssel zu der Wallet. Der aus der Metro braucht ihn, sonst kann er nichts damit anfangen."],
  else: [{ if: "day>5", then: ["Das ist ihr Schlüssel zu der Wallet. Lantern braucht ihn, sonst kann er nichts damit anfangen."], else: [].concat(stick.look) }] }];
})();

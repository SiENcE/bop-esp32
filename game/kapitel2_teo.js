// Nagiwa: Chapter 2's thread of Teo and the pump hall (kapitel2-design §6.6, the user's wish 2026-11-22: Teo more in the picture).
// From Saturday CAM 33 is on the deck's map, grey: Pumpenhalle 3 is the Flutwerk's, its own net, and Juno's old Nagi·wa access doesn't
// open it. Sable sells its code (game/sable.js, under "Ich such was."), so Juno has to go out for it. Then she sees the shaft from its rim
// (art/cams/cam33.px.js): Teo at his shift from 20:00, tiny on the deck before the basin; in the break from 23:00, the shift
// asleep on the platform's bench, their patches blinking in one beat; Tinte in the lit basin. The basin's node hears what is said at the
// basin, so the feed's sound comes from there: what Teo tells Tinte, and never Juno, a little more each evening (a look: no flag).
//   code_cam33, link_cam33   Sable's code, the camera on the deck (Monday's roof reads link_cam33: Juno has seen Tinte)
//   ledger_sable_cam33       paid
// A thread of its own (off_teo, CLAUDE.md); what CAM 33 shows is only a look, by the clock.
"use strict";

(function () {
const A33 = Nagiwa.at.cam33;
const T = (/** @type {string} */ text) => ({ say: "teo", text }), TI = (/** @type {string} */ text) => ({ say: "tinte", text });
Cutaway.actor("tinte", { name: "Tinte", color: "#b0b8ff", voice: { pitch: 34, range: 2, wave: "sine", syllable: 120, speed: 0.75 } });
Nagiwa.people.tinte = { name: "TINTE" };
Nagiwa.ledger.sable_cam33 = { to: "SABLE", what: { paid: "CAM 33, die Pumpenhalle" }, chits: { paid: -100 } };

Nagiwa.cams.cam33 = { id: "33", place: "PUMPENHALLE 3", owner: "FLUTWERK, PRIVAT", map: [176, 110], if: ["day>4", "!off_teo"],
  tryIt: ["Teos Halle. Die hat ein eigenes Netz.", "Den eigenen Block glasst man nicht. Den eigenen Bruder erst recht nicht."],
  linked: ["Ich geb Sables Code ein. Die Pumpenhalle ist verbunden.", "Den eigenen Bruder glasst man nicht. Ich tu's trotzdem."] };

// what the hall shows by the clock (the game day runs from 18:00): the shift from 20:00 (Teo on the deck), from 23:00 the break, their four
// hours of Lull till three (Saturday and Monday Teo sits by Tinte first, Sunday he sleeps with the others; on Monday night he won't wake,
// and at 03:15 Tinte writes). The break lasts the rest of the evening, so waiting in the feed always stops in it (the clock's last stops,
// 00:45 and 01:00, are there every evening); it adds no stop of its own, which would have moved every other way's waiting
const BREAK = "time>=23:00", SHIFT = ["time>=20:00", "time<23:00"];
const frame = (/** @type {string} */ id, /** @type {any} */ cond) => ({ id, image: `cam33_${id}`, at: [0, 0], anchor: [0, 0], baseline: -999, if: cond });
Nagiwa.camRoom("cam33", { background: "cam33_bg", mic: { at: A33.mic, clear: 200, lost: 400 },
  props: [frame("schicht", SHIFT), frame("pause", [BREAK, { not: "day=6" }]), frame("pause_so", [BREAK, "day=6"]),
    // the patches over them, in Lull's beat, all at once
    { id: "takt", image: "cam33_takt", at: A33.takt, anchor: [0, 0], baseline: -998, if: BREAK }],
  hotspots: {
    tinte: { name: "Tinte", poly: A33.tintePoly,
      look: ["Ganz unten, im Filterbecken, liegt eine Krake. Acht Arme, und jeder macht was anderes.", "Um den Hals hat sie einen Kragen, der leuchtet. Damit redet sie ins Netz."] },
    teo_deck: { name: "Teo", poly: A33.teoDeckPoly, if: SHIFT, z: 5,
      look: ["Teo, bei der Schicht. Von hier oben ist er so klein wie ein Streichholz.", "Die Weste leuchtet. Daran find ich ihn."] },
    // the break: what he tells Tinte, and never me (each evening a little more, kapitel2-design §6.6)
    teo_rim: { name: "Teo", poly: A33.teoRimPoly, if: [BREAK, { not: "day=6" }], z: 5, look: ["Er sitzt auf dem Rand vom Becken, bei der Krake."],
      use: [{ if: "day=5", then: [T("Tinte, meine Schwester hat wieder nicht gegessen."), TI("Und du?"), T("Ich hab Lull. Ich brauch nichts."),
          "Die Krake legt einen Arm ans Glas, dahin, wo er sitzt."],
        else: [T("Wir waren auf dem Dach. Wie früher."), TI("Und?"), T("Sie hat nichts gesagt. Wie Papa, wenn er sich gefreut hat."),
          T("Glaubst du, er hätte das gewollt? Dass ich hier bin?"), TI("Er wollte, dass du singst. Du singst nicht.")] }] },
    teo_bench: { name: "Teo", poly: A33.teoBenchPoly, if: [BREAK, "day=6"], z: 5, look: ["Teo schläft. Am Ende der Bank, den Kopf auf der Brust."],
      use: ["Er zuckt. Die anderen zucken mit ihm, im selben Moment.", TI("Schon wieder."), "Wie die anderen."] },
    bench: { name: "Bank", poly: A33.benchPoly, if: BREAK, z: 4,
      look: ["Die Pause. Sie schlafen alle auf einmal ein.", "Und die Pflaster blinken zusammen."] },
    stairs: { name: "Treppe", poly: A33.stairsPoly, look: "Eine Treppe an der Wand, dreißig Meter runter. Teo nimmt die jeden Abend." },
    pump: { name: "Pumpe", poly: A33.pumpPoly, look: ["Eine Pumpe, so groß wie ein Haus.", "Das Tosen hör ich bis hier oben. Es ist das Meer."] },
  } });
})();

// Nagiwa: what every chapter's evenings share (docs/kapitel0-design.md §4). Juno sleeps in her bed to reach
// the next evening. Each chapter says which evenings it has, what a night's card says and when the clock
// must stop (Nagiwa.clockHold). Loaded before the rooms: the flat's bed uses it.
"use strict";

/** The cards between the evenings: the game day they lead to, the date and which evening it is. */
Nagiwa.nights = /** @type {Record<number, {date: string, evening: string, passes?: any[]}>} */ ({});

/** The bed, once the prologue is over: on to the next evening, as long as there is one. */
Nagiwa.sleep = [
  { if: "bed_closed", then: ["Heute nicht. Heute Nacht schlafe ich nicht."],
    else: [{ if: "time<01:00", then: ["Schlafen? Ich schlaf nicht vor eins. Nie."], else: [
      "Genug für heute.",
      { fade: "out", ms: 700 },
      { night_passes: true },
      { time: "18:00", day: "+1" },
      { evening_card: true },
      { fade: "in", ms: 700 },
    ] }] },
];

// { night_passes: true } what a chapter says changes overnight (Nagiwa.nights[next day].passes): a flag that no longer
// matters is forgotten here, or the next evening comes once for each way of having got there
Cutaway.script.action("night_passes", (s, ctx) => {
  const n = Nagiwa.nights[Number(Cutaway.state.flag("day")) + 1];
  return n?.passes ? Cutaway.script.exec(n.passes, ctx) : undefined;
}, { sets: () => Object.values(Nagiwa.nights).flatMap((n) => (n.passes ?? []).flatMap((/** @type {any} */ p) => [p.set, ...(p.then ?? []).map((/** @type {any} */ q) => q.set)]).filter(Boolean)) });

// { evening_card: true } the card for the evening that has just begun (its text declared by Nagiwa.declareTexts)
Cutaway.script.action("evening_card", (s, ctx) => {
  const day = Number(Cutaway.state.flag("day")), n = Nagiwa.nights[day];
  if (!Nagiwa.nights[day + 1]) Cutaway.state.set("bed_closed");      // the last evening: nobody sleeps through it
  return n ? Cutaway.script.exec([{ card: n.date, title: n.evening }], ctx) : undefined;
}, { sets: () => ["bed_closed"] });

// Halcyon: what every chapter's evenings share (docs/kapitel0-design.md §4). Juno sleeps in her bed to reach
// the next evening. Each chapter says which evenings it has, what a night's card says and when the clock
// must stop (Halcyon.clockHold). Loaded before the rooms: the flat's bed uses it.
"use strict";

/** The cards between the evenings: the game day they lead to, the date and which evening it is. */
Halcyon.nights = /** @type {Record<number, {date: string, evening: string}>} */ ({});

/** The bed, once the prologue is over: on to the next evening, as long as there is one. */
Halcyon.sleep = [
  { if: "bed_closed", then: ["Heute nicht. Heute Nacht schlafe ich nicht."],
    else: [
      "Genug für heute.",
      { fade: "out", ms: 700 },
      { time: "18:00", day: "+1" },
      { evening_card: true },
      { fade: "in", ms: 700 },
    ] },
];

// { evening_card: true } the card for the evening that has just begun (its text declared by Halcyon.declareTexts)
Cutaway.script.action("evening_card", (s, ctx) => {
  const day = Number(Cutaway.state.flag("day")), n = Halcyon.nights[day];
  if (!Halcyon.nights[day + 1]) Cutaway.state.set("bed_closed");      // the last evening: nobody sleeps through it
  return n ? Cutaway.script.exec([{ card: n.date, title: n.evening }], ctx) : undefined;
}, { sets: () => ["bed_closed"] });

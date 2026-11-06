// A talk as a tree: opening a topic brings its own options, and a level never shows more than four choices (the user's rule: docs/dialog-design.md §4).
//   Halcyon.talkTree("id", [topic, topic, topic])
//   a topic is [the choice's text, what is said, its own topics?, when?]; with topics of its own it opens them, and "Was anderes." goes back up;
//   when: a condition, for what Juno can only say once she knows it
// Three topics at most on a level: the fourth choice is the way back or away. Nothing here is a flag, so a talk may be walked again and again.
"use strict";

// A choice is written with its quotes („Wie immer.“): they say that Juno says it. Her subtitle is the line itself, like every other line.
const sayLine = Cutaway.ui.say;
Cutaway.ui.say = (actor, text, o) => sayLine(actor, String(text).replace(/^[„"]([^„"]*)[“"]$/, "$1"), o);

/**
 * @param {string} id @param {any[]} topics @param {string} [bye] the top level's way out
 */
Halcyon.talkTree = function (id, topics, bye = "Bis dann.") {
  /** @type {Record<string, any[]>} */
  const nodes = {};
  /** @param {string} name @param {any[]} list @param {any} way */
  const level = (name, list, way) => {
    if (list.length > 3) throw new Error(`talk ${id}: "${name}" has ${list.length} topics, at most 3 (with the way out, four choices)`);
    nodes[name] = [];         // its place first: the dialogue starts at the first key, which must be "main", not the deepest topic
    nodes[name] = [...list.map(([text, then, more, when], i) => {
      if (!more) return { text, then, ...(when ? { if: when } : {}) };
      const sub = `${name}.${i}`;
      level(sub, more, { text: "Was anderes.", silent: true, goto: name });
      return { text, then, goto: sub };
    }), way];
  };
  level("main", topics, { text: bye, silent: true, goto: "end" });
  Cutaway.dialog(id, nodes);
};

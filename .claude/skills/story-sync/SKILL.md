---
name: story-sync
description: After a change to Glass Sister's story, a chapter design or the facts a chapter relies on, check that every doc (bible, FAQ, reading version, chapter designs, dialogue guides, PLAN, walkthrough) and the game's code still say the same thing, fix what is only out of date, and ask the user about what needs a decision. Use when the user asks for a story sync, or after story decisions were written down.
---

# Story sync

Glass Sister keeps its story in several docs that restate each other. A decision written into one of them is not done until
every other place that tells the same fact agrees. This skill is the check after a story change. It reports in German and
asks the user before changing anything that is a decision (story, names, look); what is only out of date it fixes.

## 1. What changed

- Without an argument: the uncommitted changes (`git diff`, `git diff --cached`) under `docs/` and `game/`. With an argument:
  that commit or range (`git diff <range> -- docs game`).
- Write down each changed **fact**, one per line, in plain words: who does what, when (day and time), a name, a number, a
  flag and its values, what a chapter keeps or hands on, what is decided and what is open. A reworded sentence that tells
  the same fact is no change.

## 2. The tools first

- `node tools/doc-lint.mjs` checks the docs against the game: every flag, room, camera, item and act named in backticks
  exists (or is planned in a chapter design that isn't built), every `flag=value` is a value the game sets, every weekday
  fits its date. Fix what it reports before reading by hand.
- `node tools/doc-lint.mjs --flags` writes `docs/flags.md`, the register of every flag (where it is set and asked, its
  values, which act keeps it). Never edit that file by hand.
- If the change touches what an act keeps or hands on, the studio's tab Handoffs and `node lib/cutaway/tools/handoff.mjs
  build/graph --page index.html` (after the game's `graph` tasks) show whether the acts still fit together.

## 3. Every place that tells the same fact

For each changed fact, search (Grep) all places that can restate it, by its words and by its names:

| where | what it holds |
|---|---|
| `docs/story.md` | the bible; its §10 (§10a ...) holds the decisions: that is the source |
| `docs/faq.md` | answers that retell the bible |
| `docs/story-lesefassung.md` | the story told up to Chapter 1, the spoiler part, the open list |
| `docs/kapitel0-design.md`, `kapitel1-design.md`, `kapitel2-design.md`, ... | each chapter's plan; also what it says other chapters do |
| `docs/dialog-style-guide.md`, `docs/dialog-design.md` | voice cards, inner voices, fixed scenes |
| `docs/PLAN.md` | the status of chapters and engine work |
| `docs/durchspielen/index.html` | the walkthrough, when the way through changes |
| `CLAUDE.md` | the docs table, rules that came from a decision |
| `game/*.js` | lines on screen and facts in the code (flag names and values, times, what an act keeps) |

Never read `docs/ideen.md` unless the user asks for it.

Check each hit: the same fact, the same value, the same reason. The order of authority: the bible's §10 decisions, then the
bible's chapters, then the chapter designs, then FAQ and reading version; the game's code is the truth about what is built.
A claim a design makes about a built chapter (a flag, a value, a time, what every player has done) is checked against the
code, not against another doc.

## 4. An independent read, when it is big

When the change is large (several decisions at once, or a new chapter design), one independent reader catches what the
author no longer sees. Spawn at most one agent (tokens cost; see the memory "Few subagents"): give it the list of changed
facts and the files above, ask it to find leftovers and contradictions with file and line, not to confirm. Check every
finding yourself before you report it. Small changes need no agent.

## 5. Fix and report

- Fix by yourself what is only out of date: a doc that still states the old version of a decided fact, a wrong section
  number, a time or name that the decision changed.
- Ask the user about everything that needs a decision: two docs that disagree and neither is a recorded decision, a gap in
  a plan, names, looks, story logic. Give a recommendation for each.
- When a decision is made, write it into story §10 (dated) and then into the other docs.
- Then run `node tools/doc-lint.mjs` and `node lib/cutaway/tools/validate.mjs index.html`, plus the checks the change needs
  (CLAUDE.md, "Running and checks"), and commit as CLAUDE.md says.
- Tell the user in German, in whole sentences: what was in sync, what you fixed, what needs their decision.

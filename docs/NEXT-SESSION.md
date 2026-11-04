# Prompt for the next session

Copy everything below the line into a new session.

---

We're continuing work on "Glass Sister", our cyberpunk point-and-click adventure, in B:\Github_my\cyberpunk
(engine: Cutaway.js in B:\Github_my\cutaway\). Read CLAUDE.md first; it lists the docs, the commands and
the checks. Talk to me in German (the docs are German, code comments English).

Where we are (everything is committed, in both repos; the engine copy is at Cutaway.js 9db22f4):
- Design: docs/story.md (decisions in §10), docs/kapitel0-design.md (the prologue; §2 the deck and EVI,
  with what was decided and built on 2026-11-04), docs/kapitel1-design.md, docs/dialog-design.md,
  docs/PLAN.md (status at the top, the phases), docs/style-guide.md (§4 the iso scale and rooms from maps,
  §6 characters, §8a every part of the look and its state).
- Done:
  - **Every text goes through i18n**: data texts inline in German; texts the game draws through
    `Halcyon.t` and declared (`Cutaway.i18n.declare`). Never paint German into art (the post-it
    "ESSEN!!" in the flat is the one exception still to fix). A Chinese test: docs/ideas/chinesisch.md.
  - **H1c, the new scale**: 16 units per meter of floor, 30 px per meter of height, Juno ~50 px (face B,
    hood down indoors). A street-mode room is a **map** (`art/rooms/<id>.map.js`, format in
    `art/lib/isomap.js`) baked with a **kit** and its **light** (`art/lib/isokit.js`, `art/kit/<id>.kit.px.js`,
    `art/rooms/<id>.px.js`); `sh tools/build_art.sh room <id>` writes the art and the measured layout
    (`game/rooms/<id>.layout.js`: walk area, front lines, prop places, opening rects, spots) that
    `game/places.js` reads. The old art is in `art/old/`. The cameras (feed mode) keep their own scale.
  - **H2b, the deck as a computer** (`game/deck.js`): desktop with the old photo as animated wallpaper,
    GLAS, CHAT (contacts, threads, replies from the chapter: `Halcyon.contacts/threads/replies`), CACHE with
    the clip editor (cutting makes a new clip), BUCH, KONTO, NETZ, RADIO, MÜLL, the photo whole with the
    music "memory". **EVI** (`game/evi.js`): her voice in its own place (`lineBox`), she says the hints,
    faces, pointing at apps, the boot, message cards over every mode. The prologue's steps 0a–12 have
    her lines.
  - The deck's open window is a **view flag** (`Cutaway.state.view("deck_app")`): no state for the solver,
    which opens views on the way. A view may change what can be clicked, never what a click does.
  - Engine additions on the way (all generic, tested, in the reference): `i18n.declare`, synth `bend`,
    `vibrato.rise`, the `hall` send, room `buttons: false`, `{ hint: true }`, actor `lineBox`,
    `hints.configure({ by })`, `state.view` (and the workers use the solver's own expansion).
- Checks now: validate 0 errors (3 warnings: flags set but not tested yet), `solve --full` ~10 s, no
  soft-locks, every state has a hint; play.mjs all passed.

Next: **H3, the rest of the prologue** (kapitel0-design §5–§7, PLAN H3):
- the rooms `kessel_14` (the corridor: Frau Haldane asleep in her armchair with a blue Lull light, Motte on
  the stairs, the note war "WER KLAUT MEINE ZEITUNG??"), `kessel_lobby` (the lift out of order, the
  mailboxes with the rent notice: 900 Chits, 310 of it hull levy), `kowalski` (the street of mockup C:
  LUCKY STATIC, Bao's cart, the vending machine, the broken ad screen, a drone);
- each room built the new way: a block bake of its map first (like art/test/flat_blocks.px.js) for my
  approval, then its kit painted and baked with its light; Juno with the hood up outside;
- the people: Frau Haldane, Motte (her first dialogue choice: kind, evasive, dismissive), Bao ("Wie
  immer? Ich schreib's an."); each at the new scale (adults ~48–56 px, children 30–40), block sketch first;
- the moment "JUNO.": after eating, the broken ad screen stutters, the eye in the static turns to her, the
  screen says JUNO., the stinger "witness"; EVI from the bag: "Das war nicht ich. Ehrlich.";
- the intro "Die letzte Schicht" (§5) before the title, if it fits in this phase;
- hints for every new step (EVI's voice), and the prologue's end card leading to Chapter 1.
- Consider a side-view room for variety where it tells the scene better (style guide §4, e.g. the
  stairwell); ask me first.

Open points to keep in mind: the post-it "ESSEN!!" painted in German (make it language-free or a
per-language overlay); the flat's empty front floor; E-d (dialogue v2 with the inner voices, the node
editor) and E-e (the Iso tab in the engine) are later phases; the deck's layout already measures its text
(for Chinese later), but the engine still lacks a CJK font fallback and wrapping by character.

How I like to work:
- Small steps; for each, show screenshots (the shot.mjs command is in CLAUDE.md; with a stepped clock
  for moments: advance the clock in 50 ms steps with an await between them).
- For art, block sketches or a mockup first, my approval, then paint. Before painting, read the style
  guide and .claude/skills/claude-pxl/SKILL.md. Big paintings can go to a subagent with an exact brief;
  check its result yourself.
- After every step: validate (0 errors), `solve --full` (no soft-locks), play.mjs (all passed), then commit
  with a descriptive message. No Claude/AI attribution in commits.
- Engine changes: in its own repo, generic (no game content), `node tests/run.mjs` and `npm run check`,
  commit there, then `sh tools/sync-engine.sh "B:/Github_my/cutaway"` here.
- Ask me when a decision is mine (story, look, names); otherwise decide and say so.

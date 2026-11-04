# Prompt for the next session

Copy everything below the line into a new session.

---

We're continuing work on "Glass Sister", our cyberpunk point-and-click adventure, in B:\Github_my\cyberpunk
(engine: Cutaway.js in B:\Github_my\cutaway\). Read CLAUDE.md first; it lists the docs, the commands and
the checks. Talk to me in German (the docs are German, code comments English).

Where we are (everything is committed, in both repos; the engine copy is at Cutaway.js e2bc1d6):
- Design: docs/story.md (decisions in §10), docs/kapitel0-design.md (the prologue; §5 the intro, §6.2 the steps,
  §7.1 the rooms, §8 the people as decided), docs/kapitel1-design.md, docs/dialog-design.md, docs/PLAN.md
  (status at the top), docs/style-guide.md (§4 the iso scale, rooms from maps, other views, see-through props;
  §6 characters; §8a the look, the title screen).
- **The prologue plays from the flat to its end card** (steps 0a-18). Done in H3 (2026-11-04):
  - kessel_14 (Motte on his bench, the look down the stairwell), kessel_lobby (the rent notice);
  - **Kowalski Street** (art/rooms/kowalski.map.js, art/kit/kowalski.kit.px.js, game/rooms/kowalski.js): 416 px,
    scrolls; LUCKY STATIC, the half-broken ad screen, the noodle machine with its tired face, the alley shut,
    the bins, Bao's cart on wheels with its umbrella (see-through over whoever it hides: the engine's
    seeThrough), string lights and cables, strong light pools, a wet sheen and puddles that mirror the neon,
    rain in two layers, splashes, steam from the pot and a drain, haze, glints, drips;
  - **Bao** (art/characters/bao.px.js, head A), behind his cart (drawn SE, used flipped for every facing; the
    street's hotspot "bao" talks to him, he is an unclickable actor); step 16: "Wie immer? Ich schreib's an.",
    cash with 8 Chits (bao_paid), eating (ate_bao);
  - **JUNO.** (steps 17-18): the screen stutters, the eye in its static turns to Juno, JUNO. over the screen,
    the stinger "witness", Bao saw nothing, EVI "Das war nicht ich. Ehrlich.", the card Kapitel 1: Glass
    (the screen's picture is one function, KOW.adScreen, for the opening and the moment's three animations);
  - **the menu screen**: Kowalski Street whole as a still (art/ui/title_bg.px.js bakes it tall with its props and
    a patrol drone, art/characters/drone.px.js; tools/title-backdrop.mjs brings it down to 320x180, the colours
    kept to its own);
  - Juno's street sprites have no implant pixel any more (mirroring moved it between her cheeks).
  - Engine (Cutaway.js): see-through props (seeThrough), an actor's walkTo/face (where to stand to talk to them).
- Checks now: validate 0 errors (3 known warnings: flags set but not yet tested), solve --full no soft-locks,
  every state has a hint, play.mjs all passed (to the end card).

Next: **the intro "Die letzte Schicht"** (kapitel0-design §5): the observation hall three years ago, the last
shift, the announcement, Juno with her box on the **Transitachse** going down: the first **side view** (style
guide §4: a stage, its own walk views for Juno, left and right). Block sketches first for my approval (the hall,
the Transitachse, Juno from the side), then painted; then it plays as the game's intro before the title.

Open points: the post-it "ESSEN!!" painted in German in the flat (make it language-free or an overlay); the
flat's empty front floor; the steam fx in the street was replaced by baked plumes (check the engine's steam
fx is visible somewhere or drop it); the iso tile editor (E-e) is postponed to Chapter 1, to be decided when
rooms need re-arranging often; dialogue v2 (E-d) later; CJK fallback in the engine; docs/walkthroughs/ (other
games' walkthroughs, reference only) is untracked: gitignore it or keep it out.

How I like to work:
- Small steps; for each, show screenshots (the shot.mjs command is in CLAUDE.md; for moments, step the clock
  in 50 ms steps with an await between them).
- For art, block sketches or a mockup first, my approval, then paint. Before painting, read the style guide
  and .claude/skills/claude-pxl/SKILL.md. Big paintings can go to a subagent with an exact brief; check its
  result yourself.
- After every step: validate (0 errors), solve --full (no soft-locks), play.mjs (all passed), then commit with
  a descriptive message. No Claude/AI attribution in commits.
- Engine changes: in its own repo, generic, node tests/run.mjs and npm run check, commit there, then
  sh tools/sync-engine.sh "B:/Github_my/cutaway" here.
- Ask me when a decision is mine (story, look, names); otherwise decide and say so.

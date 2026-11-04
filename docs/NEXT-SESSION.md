# Prompt for the next session

Copy everything below the line into a new session.

---

We're continuing work on "Glass Sister", our cyberpunk point-and-click adventure, in B:\Github_my\cyberpunk
(engine: Cutaway.js in B:\Github_my\cutaway\). Read CLAUDE.md first; it lists the docs, the commands and
the checks. Talk to me in German (the docs are German, code comments English).

Where we are (everything is committed, in both repos; the engine copy is at Cutaway.js 9db22f4):
- Design: docs/story.md (decisions in §10), docs/kapitel0-design.md (the prologue; §6.2 the steps, §7.1 the
  rooms, §8 the people as decided), docs/kapitel1-design.md, docs/dialog-design.md, docs/PLAN.md (status at
  the top), docs/style-guide.md (§4 the iso scale, rooms from maps, other views; §6 characters; §8a the look).
- Done in H3 so far (2026-11-04):
  - **kessel_14**, the 14th floor's landing (art/rooms/kessel_14.map.js, art/kit/kessel_14.kit.px.js,
    game/rooms/kessel.js): Juno's door, Frau Haldane asleep in her armchair seen from behind through her open
    door (only her curlers over the chair's back, the TV's blue light), the note war (no words: the game reads
    them out), the dying tube, the stairs down with the rail, bikes, bin bags, a bench.
  - **Motte** (art/characters/motte.px.js): white beanie with teal stripes and a pink pompom, loud pink
    jacket, teal bag, a handheld; he sits on the bench (his frames flipped to SW for every facing, so the
    engine's turning doesn't move him). His dialogue: kind / evasive / dismissive (moth_met, moth_kind,
    moth_brushed).
  - **The look down the stairwell** (art/ui/looks.px.js, look_shaft): right-click (look) on the stairs in
    kessel_14; street close-ups (look_*) show at their own size in the interface's frame, the lines in the
    bottom bar while they show. The first top-down view.
  - **kessel_lobby** (art/rooms/kessel_lobby.map.js, art/kit/kessel_lobby.kit.px.js): the dark arch to the
    stairs, the lift OUT OF ORDER, Halcyon's poster SLEPT WELL? HALCYON LISTENS., the mailboxes with the rent
    notice (rent_notice), the notice board, the glass street door; the street door ends the test section.
  - cam04's cook, Kessler and Varga at their true size; EVI visible by the satchel while she talks.
  - The bake (art/lib/isokit.js) learnt: stairs down through the floor, rooms seen through open doors
    (open: { depth, floor, wall }, props with behind), light zones, kit light families (green), sheen on
    chosen floor cells; the map format (art/lib/isomap.js): nowalk areas, spots on a step.
- Checks now: validate 0 errors (3 known warnings), solve --full no soft-locks, every state has a hint,
  play.mjs all passed.

Next: **Kowalski Street** (approved as a map and blocks: art/rooms/kowalski.map.js, art/test/kowalski_blocks.px.js,
docs/rooms/kowalski_blocks_x2.png; mockup C is the look, docs/mockups/mock_c_iso_x3.png):
- its kit, painted and baked like the others (the facades going up past the picture's top, LUCKY STATIC's
  window, door and neon, the Kessel Block's door, the vending machine, the big broken ad screen, the alley to
  the Drain Market closed tonight, bins, sidewalk and wet asphalt with puddles mirroring the neon, string
  lights); the room is 416 px wide and scrolls; rain and Bao's steam as the engine's fx (lib/cutaway/fx.js);
- **Bao** (story §4; kapitel0-design §8: umbrella, white apron, #e8c890), block sketch first for my approval,
  then painted; "Wie immer? Ich schreib's an." (step 16), Juno eats under his umbrella (ate_bao);
- the moment **"JUNO."** (step 17): the ad screen stutters, half face, half static, the eye in the static
  turns to her, JUNO. over the whole screen, the stinger "witness"; Bao saw nothing; EVI from the bag: "Das war
  nicht ich. Ehrlich."; then the end card leading to Chapter 1 (step 18);
- hints for every new step, in EVI's voice;
- then the intro "Die letzte Schicht" (kapitel0-design §5) with the descent on the Transitachse as the first
  side view (style guide §4).

Open points: the post-it "ESSEN!!" painted in German in the flat (make it language-free or an overlay); the
flat's empty front floor; dialogue v2 (E-d) and the Iso tab (E-e) are later phases; CJK fallback in the engine.

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

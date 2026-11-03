An original cyberpunk point-and-click adventure (working title "Halcyon"), inspired by the mood of
Dreamweb (`docs/dreamweb.txt`, `docs/screenshots/`) but with its own world, characters and story. It runs on
our engine Cutaway.js (MIT, separate repo `B:\Github_my\cutaway\`, must stay free of game content); the
previous game on it, `B:\Github_my\the_goonies\`, shows how a game is laid out and built.

The art and interface style is decided: follow `docs/style-guide.md` for all game art and UI. The world is
isometric (street mode, `docs/mockups/mock_c_iso_x3.png`); hacking and observation happen through hijacked
cameras (feed mode, `docs/mockups/mock_e_cctv_x3.png`). Before making art, read the style guide and the pxl
skill's `.claude/skills/claude-pxl/SKILL.md`.

The story bible (first draft, in German: world, cast, the secret, 6 chapters, branches, endings; decisions in
its §10) is `docs/story.md`. Game text is German first, English later (all text through i18n; the city's
signs and ads stay English in both). Violent scenes have two variants (black bars, the default, and shown).

The build plan (engine work C1–C11, game phases H0–H10) is `docs/PLAN.md`. Running and checks:
- open `index.html` (file:// works);
- engine copy: `sh tools/sync-engine.sh` (never edit `lib/cutaway/`; change the engine repo, then sync);
- art: `sh tools/build_art.sh [group]`;
- checks: `node lib/cutaway/tools/validate.mjs index.html` (0 errors);
- screenshots: `node lib/cutaway/tools/shot.mjs index.html --size 960x540 --query manual --eval "await Cutaway.debug.settle()" --out build/shots/x3.png --buffer build/shots/1x.png`.

Dialogue (role model: Disco Elysium's depth; Juno's six inner voices, deterministic checks, a log panel;
written in the engine's node editor): `docs/dialog-design.md` (German) and `docs/PLAN.md` C12/C13.

Detailed designs (German): `docs/kapitel0-design.md` (the prologue, plus the rules every chapter uses: the
deck, feed mode, game time and routines) and `docs/kapitel1-design.md` (Chapter 1 "Glas": three jobs over
three evenings, the WREN thread, the murder in cam31).

Premise: Juno, a hacker, watches people through the city's cameras and sells what
she learns on the black market; she goes out for food and to buy and sell; one night she watches a serious
crime, which leads her into a moral conflict and an investigation that slowly uncovers a much larger secret.

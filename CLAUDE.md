# Glass Sister

An original cyberpunk point-and-click adventure. **Glass Sister** is the title; **Halcyon** is the city and
the corporation that owns it. Juno, a hacker in the Lower Ninth, watches people through the city's cameras
and sells what she learns on the black market; she goes out for food and to buy and sell; one night she
watches a serious crime, which leads her into a moral conflict and an investigation that slowly uncovers a
much larger secret. The mood comes from Dreamweb (`docs/dreamweb.txt`, `docs/screenshots/`: internal
reference only, gitignored); the world, characters and story are our own.

Talk to the user in German. Docs are German (except `PLAN.md` and `style-guide.md`, which are English),
code comments English.

## Two repos, one cut

- The engine is **Cutaway.js** (MIT), its own repo `B:\Github_my\cutaway\` with its own CLAUDE.md. It must
  stay free of game content: no names, art or text from this game; every new feature is generic and shown
  in the engine's demo with placeholder art.
- `lib/cutaway/` here is a pinned copy (`lib/cutaway/VERSION.txt`). **Never edit it.** Change the engine
  repo, run its checks there (`node tests/run.mjs` → "all passed", `npm run check` → nothing), commit
  there, then `sh tools/sync-engine.sh` here and commit the sync.
- Generic mechanisms go in the engine (time, routines, watched rooms, post-effects, skin hooks, title
  hooks); the game's own things are plug-ins in `game/` (the deck, feeds, Kassenbuch, OSD, implant
  overlay). If a feature can only be described in this game's words, it belongs in `game/`.
- The previous game on the engine, `B:\Github_my\the_goonies\` ("The Loonies"), shows how a game is laid
  out, built, solved per act and released.

## Docs

| file | what |
|---|---|
| `docs/story.md` | the story bible (German): world, cast, the secret, 6 chapters, branches, endings; decisions in §10 |
| `docs/kapitel0-design.md` | the prologue "Nachtschicht", plus the rules every chapter uses: the deck as a computer and EVI (§2), feed mode (§3), game time and routines (§4), the steps 0–12 (§6) |
| `docs/kapitel1-design.md` | Chapter 1 "Glass": three jobs over three evenings, the WREN thread, the murder in cam31 |
| `docs/dialog-design.md` | dialogue (role model Disco Elysium): Juno's six inner voices, deterministic checks, a log panel; engine work C12/C13 |
| `docs/style-guide.md` | **all art and UI** (decided). §8a "Everything is cyberpunk" lists every part of the screen and its state |
| `docs/PLAN.md` | the build plan: engine work C1–C13, phases H0–H10 with "done when"; status at the top |
| `docs/mockups/` | the decided looks: street mode `mock_c_iso_x3.png`, feed mode `mock_e_cctv_x3.png`; new mockups go here (`mock_f_deck` next) |
| `docs/rooms/`, `docs/cams/`, `docs/characters/` | layout notes and review sheets of finished art (positions are measured from these into `game/places.js`) |

## World words

- Game text is German first, English later (H10). **Every text on screen goes through i18n.** Texts in the
  data are written inline in German (the source text; the engine translates them). Texts the game draws
  itself go through `Halcyon.t(text, { part })` and are declared with `Cutaway.i18n.declare(where, [...])`
  where they are drawn (lists: `Halcyon.declareTexts`), so validate and the editor's Texts tab see them.
  Never put German words into art; painted text is only for signs, ads and the city's tech (English).
- The city's signs and ads are English art in both languages, and so is its slang, also inside German
  sentences: **Glass** (the feeds), **Glasser/Glasserin**, **glassen**, **Shine**, **Sinker**, **Chits**.
- **EVI** is the cute AI on Juno's deck (Halcyon's discarded AUTO-EVAL prototype, trained on Juno's tags);
  she is also the hint button. Talking animals: Ratz, Tinte. NINTH LIVE, tide mods, the inherited flood debt.
- Violent scenes have two variants: black bars (the default) and shown.
- Subtitle colours follow the style guide's colour meanings: red only for threats, cyan only for technology.

## Layout

| path | what |
|---|---|
| `index.html` | loads the engine (in its load order), the built art, then the game; `file://` works |
| `game/game.js` | start-up (`Cutaway.start`: 320x180, `de`, title screen), loaded last |
| `game/halcyon.js` | the global `Halcyon`: the game's own actions and helpers, the registries (`cache`, `ledger`, `cams`, names); its header lists the flag conventions (`chits`, `tag_<who>`, `code_<cam>`, `link_<cam>`, `cache_<id>`, `ledger_<id>`, `rec_on`) |
| `game/places.js` | `Halcyon.at`: every position, walk area and prop placement; rooms built from a map take theirs from `game/rooms/<id>.layout.js` (generated: never edit) |
| `game/cast.js` | the actors (Juno in iso, the feed people) |
| `game/deck.js` | the deck as a computer (mockup F): its room (`buttons: false`, one flag `deck_app` for the open window, `chat_<contact>` for a thread) and its screen: the desktop with the wallpaper, the apps' windows (GLAS, CHAT, CACHE, BUCH, KONTO, NETZ, RADIO, MÜLL), EVI in her corner as the hint button; the chapters fill `Halcyon.contacts`, `threads`, `replies` |
| `game/rooms/<id>.js` | rooms: `cams.js` (cam03, cam04: watched rooms with the phosphor post-effects), `<id>.layout.js` (generated) |
| `game/prolog.js` | the prologue act (steps 0–11), its cache and ledger entries, game time |
| `game/screens.js` | the UI layer that draws the deck's screen, the feeds' OSD, the implant overlay and zoom windows (rooms hold the hotspots so the solver sees every click; this layer only draws) |
| `game/glyphs.js` | the letters of both fonts as plain data, shared by `game/font.js` and the art (`art/lib/text.js` writes with them in pxl, so mockups and interface art read as in the game) |
| `game/skin.js`, `font.js`, `transitions.js`, `sounds.js`, `music.js`, `title.js`, `hints.js` | the look (frames, cards, labels, choices), the fonts, room transitions, synthesised sounds and music, title and menu screens, hints |
| `art/**/*.px.js` | pxl sources: `lib/` (shared `iso.js`, `feed.js`), `characters/`, `rooms/`, `cams/`, `ui/`, `mockups/`, `test/`; `*_review.px.js` are review sheets, never built into the game |
| `assets/*.js` | built atlases (checked in, so the game runs without Node) |
| `tools/` | `build_art.sh`, `sync-engine.sh`, `render-sounds.mjs` |
| `studio.json` | the editor's studio: writable folders, layer files, tasks |
| `build/`, `out/` | scratch (raw pxl output, screenshots, renders), not checked in |
| `.claude/skills/claude-pxl/` | the pxl skill, its own repo (gitignored) |

Planned (PLAN.md §3): `game/evi.js` (H2b: EVI's lines and faces), the clip editor, notification cards, `feed.js`, `ledger.js`, `money.js`, `routines/<chapter>.js`,
`strings/en.js` (H10).

## Conventions

- Same as the engine: classic scripts with `"use strict"`, no build step, no modules, no `fetch`; the game
  is declarative data (rooms, hotspots, actors, dialogs, scripts as action lists) so the Node tools can
  read it. New behaviour goes into actions; interface parts are UI layers. JSDoc types on game code.
- **Everything that matters to the story is a flag**, so saves and the solver see it. Game time and
  routines are discrete (15-minute ticks, routines as pure functions of the tick); keep state small so
  `solve --full` stays exhaustive. Every chapter must solve without soft-locks, and every state on the way
  needs a hint.
- Positions live in `game/places.js`, not scattered in room files. A street-mode room is a map
  (`art/rooms/<id>.map.js`, format in `art/lib/isomap.js`) baked with the kit and its light
  (`art/lib/isokit.js`, `art/kit/`); `sh tools/build_art.sh room <id>` builds the art and writes the measured
  walk area, front lines, prop places, opening rects and spots to `game/rooms/<id>.layout.js`. Change the
  map or the kit, never the numbers. Superseded art (the old scale) is in `art/old/`.
- Room art files export only names starting with the room id (`flat_bg`, `flat_<prop>`); runtime `light`
  uses the same lamp numbers as the pxl art.
- Comments say why, not what. Keep files small and focused.

## Running and checks

- Open `index.html` (file:// works). It opens on the title screen. `?act=prolog` goes straight into the
  prologue (dev), `?manual` freezes the clock, `?nointro`, `?edit` / F10 the editor, F9 the debug overlay.
- The editor with the studio: `node lib/cutaway/tools/studio.mjs` (guide: the engine's `docs/editor.md`, F1).
- Engine copy: `sh tools/sync-engine.sh`.
- Art: `sh tools/build_art.sh [test | characters | ui | title | cams | room <id> | rooms]` (no argument:
  everything).
- Sounds: `node tools/render-sounds.mjs` (every sound of `game/sounds.js` into `build/sounds/`, `all.wav`
  in turn).
- Screenshots (look at both 1x and 3x):
  `node lib/cutaway/tools/shot.mjs index.html --size 960x540 --query "manual&act=prolog" --eval "await Cutaway.debug.settle()" --out build/shots/x3.png --buffer build/shots/1x.png`
  (`--query manual` alone: the title screen).

After every change, all of these:

```sh
node lib/cutaway/tools/validate.mjs index.html        # 0 errors (warnings are known: flags set but not yet tested)
node lib/cutaway/tools/solve.mjs index.html --full    # "no soft-locks", every state has a hint (a few seconds)
node lib/cutaway/tools/play.mjs index.html            # headless playthrough with real clicks: "all passed"
```

## Art

- Read `docs/style-guide.md` and `.claude/skills/claude-pxl/SKILL.md` before making any art.
- 320x180, isometric street mode (2:1), feed mode in the phosphor duotone (style guide §9); check every
  feed with the overlay off.
- New art goes through a block sketch or mockup first, the user's approval, then painting. Big paintings
  can go to a subagent with an exact brief; check its result yourself (1x and 3x).

## How we work

- Small steps. Each step ends with screenshots shown to the user, the three checks above passing, and a
  commit.
- Commit messages: one descriptive paragraph saying what changed and how it looks or plays, ending with the
  check results (e.g. "validate 0 errors, play.mjs: all passed"). **No Claude/AI attribution** (no
  `Co-Authored-By` line) in commits or PRs.
- Decisions about story, look and names are the user's: ask. Technical choices: decide and say so.
- When a decision is made, write it into the doc it belongs to (story §10, style guide, PLAN status).

# Glass Sister

An original cyberpunk point-and-click adventure. **Glass Sister** is the title; **Nagi·wa** is the city and
the corporation that owns it. Juno, a hacker in the Lower Ninth, watches people through the city's cameras
and sells what she learns on the black market; she goes out for food and to buy and sell; one night she
watches a serious crime, which leads her into a moral conflict and an investigation that slowly uncovers a
much larger secret. The mood comes from Dreamweb (`docs/walkthroughs/dreamweb.txt`, `docs/screenshots/`: internal
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
| `docs/faq.md` | questions about the story and their answers (German, spoils everything): Lull and the implant, Teo, why the sleepers watch, EVI, the chapters 2–6, the Witness, the endings; follows the story bible |
| `docs/ideen.md` | ideas not decided (German): feedback, counter-proposals, versions not taken, each dated with where it came from; **only ever appended to**, never rewritten, and **read only when the user asks**; what gets decided goes into the story bible's §10 |
| `docs/story-lesefassung.md` | the story to read, up to and including Chapter 1, then a part marked as a spoiler that tells what lies behind it, and the list of what still contradicts itself or is open |
| `docs/kapitel0-design.md` | the prologue "Nachtschicht", plus the rules every chapter uses: the deck as a computer and EVI (§2), feed mode (§3), game time and routines (§4), the steps 0–12 (§6) |
| `docs/kapitel1-design.md` | Chapter 1 "Glass": three jobs over three evenings, the WREN thread, the murder in cam31 |
| `docs/kapitel2-design.md` | Chapter 2 "Aufnahme" (planned, not built): three evenings Saturday to Monday, the stick and Lantern, the clinic, Ines' flat and the Civic Rest file, the forgery, decision 2, what Chapter 1 leaves behind, the side threads, the end with the protocols; every place of Chapter 1 reused |
| `docs/durchspielen/index.html` | the walkthrough to play by hand (German, HTML, short text and few pictures): for now one way through the prologue and Chapter 1; continue it with each chapter, and change it when the story's way changes |
| `docs/dialog-design.md` | dialogue (role model Disco Elysium): Juno's six inner voices, deterministic checks, a log panel; engine work C12/C13 |
| `docs/dialog-style-guide.md` | **how all text sounds** (German): the tone, the techniques, the kinds of text, hard rules (du/Sie, Lull vs. implant, length), a voice card for every character and inner voice, a checklist; read it before writing any line |
| `docs/style-guide.md` | **all art and UI** (decided). §8a "Everything is cyberpunk" lists every part of the screen and its state |
| `docs/PLAN.md` | the build plan: engine work C1–C13, phases H0–H10 with "done when"; status at the top |
| `docs/engine-fixes.md` | the plan to fix what the engine's code review of 2026-11-10 found (German): steps F1–F11 in order (the solver first), each with its findings, the fix, its tests and "fertig, wenn"; status at the top |
| `docs/plan/` | the city's plan (German), its own, apart from the game: where everything lies, what is built, where new things fit, level by level (the roof, the 14th floor, the street, the Drain Market, the deep); nothing in it changes the game or a map, and neither reads it. Its data `stadtplan.js` (one entry a place: kind, shape, level, status, the game's room a double click opens, walls, doors with the door each leads to, the camera its picture is seen from, a note; the rooms were taken once from the maps and the game's ways on 2026-11-12), drawn by `plan.js` in `index.html` (a level at a time; hover a place for its note); what doesn't fit is listed and numbered; the pictures `stadtplan_<level>.png` (`node tools/stadtplan.mjs`, which prints the list) |
| `docs/mockups/` | the decided looks: street mode `mock_c_iso_x3.png`, feed mode `mock_e_cctv_x3.png`; the deck `mock_f_deck_*.png`; new mockups go here |
| `docs/rooms/`, `docs/cams/`, `docs/characters/` | review sheets of finished art; the cameras' layout notes (their positions go into `game/places.js`) |
| `docs/portraits/` | the character index and marketing portraits (`figuren_index_x3.png`, Teo and Juno from both sides `juno_teo_seite_front_x3.png`, `README.md`), from `art/portraits/portraits.px.js`; not in the game |
| `docs/ideas/` | studies: `iso-tiles.md` (rooms from maps, decided), `chinesisch.md` (a CJK layout test) |
| `docs/editor-iso.md`, `docs/iso-maps.md` | the guide to the editor's Iso-Editor tab (German: how to get there, its tools, save, bake, what to know) and the iso maps' format (the map's keys, the kit's calls, the bake); the editor's Help shows them inside its Editor guide and its Reference (F1 on the tab) |

## World words

- Game text is German first, English later (H10). **Every text on screen goes through i18n.** Texts in the
  data are written inline in German (the source text; the engine translates them). Texts the game draws
  itself go through `Nagiwa.t(text, { part })` and are declared with `Cutaway.i18n.declare(where, [...])`
  where they are drawn (lists: `Nagiwa.declareTexts`), so validate and the editor's Texts tab see them.
  Never put German words into art; painted text is only for signs, ads and the city's tech (English).
- The city's signs and ads are English art in both languages, and so is its slang, also inside German
  sentences: **Glass** (the feeds), **Glasser/Glasserin**, **glassen**, **Shine**, **Sinker**, **Chits**.
- **EVI** is the cute AI on Juno's deck (Nagi·wa's discarded AUTO-EVAL prototype, trained on Juno's tags);
  she is also the hint button. Talking animals: Ratz, Tinte. NINTH LIVE, tide mods, the inherited flood debt.
- Violent scenes have two variants: black bars (the default) and shown.
- Subtitle colours follow the style guide's colour meanings: red only for threats, cyan only for technology.

## Layout

| path | what |
|---|---|
| `index.html` | loads the engine (in its load order), the built art, then the game; `file://` works |
| `game/game.js` | start-up (`Cutaway.start`: 320x180, `de`, title screen), loaded last |
| `game/nagiwa.js` | the global `Nagiwa`: the game's own actions and helpers, the registries (`cache`, `ledger`, `cams`, names); its header lists the flag conventions (`chits`, `tag_<who>`, `code_<cam>`, `link_<cam>`, `cache_<id>`, `ledger_<id>`, `rec_on`) |
| `game/places.js` | `Nagiwa.at`: every position, walk area and prop placement; rooms built from a map take theirs from `game/rooms/<id>.layout.js` (generated: never edit) |
| `game/cast.js`, `game/motte.js` | the actors (Juno in iso, the feed people); what Juno can say to Motte in passing |
| `game/talk.js` | `Nagiwa.talkTree`: a talk as a tree, where a topic opens its own options, never more than four at once |
| `game/deck.js` | the deck as a computer (mockup F): its room (`buttons: false`, one flag `deck_app` for the open window, `chat_<contact>` for a thread) and its screen: the desktop with the wallpaper, the apps' windows (GLASS, CHAT, CACHE, BUCH, KONTO, NETZ, RADIO, MÜLL), EVI in her corner as the hint button; the chapters fill `Nagiwa.contacts`, `threads`, `replies` |
| `game/netz.js` | NETZ on the deck as a small browser: its pages (Nagi·wa, the board's threads, the archive, NINTH LIVE), the bookmarks, the search by the terms Juno knows; the start page is `Nagiwa.netz` (the chapters fill it: `slot`, `page`); only views (`netz_page`, `netz_from`) |
| `game/radio.js` | the RADIO on the deck: three stations (their music in `game/music.js`), heard on the deck and in the flat; the presenters' lines while its window is open; the station a view flag (`radio`) |
| `game/evi.js` | EVI: her voice (lines in their own place beside her corner, `lineBox`), she says the hints (`hints.configure({ by: "evi" })`); actions `{ evi: face }`, `{ evi_point: app }`, `{ deck_boot }`, `{ notify: contact }` (the message card over every mode) |
| `game/rooms/jade_row.js` | Jade Row, the lane left of Kowalski Street: a view down its length, not iso, painted (`art/rooms/jade_row.px.js`, its moving parts and lamps in `game/rooms/jade_row.parts.js`); Okonkwo's shop over the near wall and the machine that sees into it |
| `game/rooms/<id>.js` | rooms: `kessel.js` (the Kessel Block's floors), `kowalski.js` (Kowalski Street), `cams.js` (cam03, cam04: watched rooms with the phosphor post-effects), `<id>.layout.js` (generated) |
| `game/prolog.js` | the prologue act (steps 0–11), its cache and ledger entries, game time |
| `game/stadt.js`, `game/regenleserin.js` | Chapter 1's city: the way on to the roof, the Rain Reader and her talk, the newspaper war, Frau Imai, the white carriers (each a thread of its own); the Drain Market seen from above (its numbers, crowd and sound places in `game/rooms/drain_market.layout.js`, generated by `tools/market-layout.mjs`; its one-shots by chance in `game/markt_klang.js`) |
| `game/vesper.js` | Vesper, the buyer for NINTH LIVE: from Thursday he buys raw clips in the chat, the viewers come into the Kassenbuch overnight; anonymising in the clip editor (only while his thread is open); a thread of its own (`off_vesper`) |
| `game/lucky_static.js`, `game/karaoke.js` | LUCKY STATIC from inside: Mei behind her counter, the slate with the tabs, Nagi·wa's news on the TV, the two regulars; flavour by the day, no flag; the karaoke machine, a small game of its own without a flag |
| `game/auftrag_varga.js` | Chapter 1's job A: Varga wants Kessler found, the hood at the machine in cam03, Sable's booth, the Morpheus (cam15), K1a; a thread of its own (`off_varga`); `game/auftrag_tide.js` job B, Okonkwo's safe in Jade Row (`off_tide`) |
| `game/evenings.js`, `game/kapitel1.js`, `game/kapitel1_leben.js`, `game/kapitel1_ende.js` | what every chapter's evenings share (the bed, the evening's card); Chapter 1: its act on game days 2 to 4, WREN, the rent, Friday's clock (on blocks; the prologue goes on into it, `?act=kapitel1` begins it alone for development); the life around its jobs (Teo's visit, Motte, Bao); its end in cam31, on blocks |
| `game/intro.js`, `intro_sea.js`, `intro_tower.js`, `intro_hall.js`, `intro_desk.js`, `intro_ride.js` | the intro "Die letzte Schicht" (kapitel0-design §5): the sequence `intro` and the shots the game draws itself in perspective (rooms with `float: "<shot>"`, the action `{ float: [from, to], ms }`): the float over the lit sea (A1, A2), the tower and in through its window (C); painted parts in `art/intro/`; the observation hall (the room `intro_hall`, baked from `art/rooms/hall.map.js`); Juno at her desk (what moves over `art/intro/desk.px.js`); the ride down in the lift (`art/intro/ride.px.js`) |
| `game/editor/iso.js` | the editor's Iso-Editor tab (the studio loads it: `studio.json` "editor"): a room's map edited in full over its picture (props, openings, spots, lamps, walls, the stairs, no-walk rects: drawn, dragged, deleted; the floor painted; the room's size; every other key as written), saved back changing only the values touched, baked with the task "art: room"; "Where from?" names the map part and kit piece that painted a pixel (the bake's picks, `build/art/rooms/<id>.pick.json`) and opens either at its line; its tools and kinds as icons in the overlay's colours, kinds shown or hidden, what a click takes lit under the pointer, the map's parts listed on the left, keys (V A F W, 1 to 7, Del, Ctrl+D); New map (the task "room: new") and the cell size |
| `game/editor/plan.js` | the editor's Plan tab (the studio loads it): the city's plan (`docs/plan/stadtplan.js`) arranged and edited as in a vector editor, apart from the game (the one bridge: a double click on a room opens it in the Iso-Editor, or the Room tab when it has no map): pick (a click, Ctrl+click, a frame on the ground, Ctrl+A), drag the picked together (by one of them or anywhere in the box round them), size a rect by its corner (its walls, doors and camera with it), a shape's points (Alt+click adds or takes one), turn the picked round their middle by the round arrow beside them (15° steps, Shift free; [ and ], AltGr on a German keyboard), doors (drag, Del, add, name, link to another place's door both ways), a room's camera (drag its dot, turn its arrow), new items by kind, Ctrl+D, Del, Ctrl+Z and Ctrl+Y; the right button or Space drags the view; what doesn't fit listed, a way that lies apart on purpose marked so (the plan's accept list); Save writes back only the values changed; the task "plan: pictures" |
| `game/screens.js` | the UI layer that draws the deck's screen, the feeds' OSD, the implant overlay and zoom windows (rooms hold the hotspots so the solver sees every click; this layer only draws) |
| `game/glyphs.js` | the letters of both fonts as plain data, shared by `game/font.js` and the art (`art/lib/text.js` writes with them in pxl, so mockups and interface art read as in the game) |
| `game/skin.js`, `font.js`, `transitions.js`, `sounds.js`, `music.js`, `title.js`, `hints.js` | the look (frames, cards, labels, choices), the fonts, room transitions, synthesised sounds and music, title and menu screens, hints |
| `art/**/*.px.js` | pxl sources: `lib/` (shared `iso.js`, `feed.js`), `characters/`, `rooms/`, `cams/`, `mock/` (flat blocks of what isn't painted yet), `ui/`, `intro/`, `mockups/`, `test/`; `*_review.px.js` are review sheets, never built into the game |
| `assets/*.js` | built atlases (checked in, so the game runs without Node) |
| `tools/` | `build_art.sh`, `sync-engine.sh`, `render-sounds.mjs`, `solve-act.mjs` (one act alone), `check.sh` (all the checks), `graph.sh` (the connections to look at), `check-hover.mjs` (the pointer turns hot), `new-room.mjs` (a new street-mode room from a template: map, bake file, own kit, baked, then the game's room, places and index.html; `--remove` takes it out), `iso-layout.mjs` (a map's numbers, as the bake writes them), `room-parts.mjs` (a painted room's PARTS line as `game/rooms/<id>.parts.js`; `build_art.sh room` runs it), `market-layout.mjs` (the Drain Market's numbers from its approved layout: walk area, places, hotspots, the crowd, where it sounds; `build_art.sh room drain_market` runs it), `title-backdrop.mjs` (the menu's backdrop brought to 320x180), `cjk-raster.mjs` (CJK glyphs for layout tests), `portrait-title.py` (the profiles of Juno and Teo, cut from the title picture), `paths/` (the ways to click through, the prologue's and Chapter 1's) |
| `studio.json` | the editor's studio: writable folders, layer files, tasks |
| `build/`, `out/` | scratch (raw pxl output, screenshots, renders), not checked in |
| `.claude/skills/claude-pxl/` | the pxl skill, its own repo (gitignored) |

## Conventions

- Same as the engine: classic scripts with `"use strict"`, no build step, no modules, no `fetch`; the game
  is declarative data (rooms, hotspots, actors, dialogs, scripts as action lists) so the Node tools can
  read it. New behaviour goes into actions; interface parts are UI layers. JSDoc types on game code.
- **Everything that matters to the story is a flag**, so saves and the solver see it. What a screen of
  the game's own only shows (the deck's open window: `deck_app`) is a **view flag**
  (`Cutaway.state.view`): saved, but no state for the solver, which opens views on the way. A view may
  change what can be clicked, never what a click does. `once` blocks are state too: keep them where they
  matter (a line that may repeat needs none). Game time and
  routines are discrete (15-minute ticks, routines as pure functions of the tick); keep state small so
  `solve --full` stays exhaustive. Every chapter must solve without soft-locks, and every state on the way
  needs a hint.
- **What the player finds can be taken and used at once.** Nothing waits for an earlier click without a reason in the world: each thing has its own flag and the test is what the world allows (the item is there, the door is open). A gate needs a reason in the world: a time, knowledge the player really lacks (a date, a code), or a decision of the user's (the bed from 01:00). The prologue's tutorial steps are the exception.
- **A dialogue never shows more than four options,** the way back included. Longer talks nest: a topic opens its own options (`Nagiwa.talkTree`, `docs/dialog-design.md` §4).
- **Looking only tells more; nothing the game needs may hang on it.** Looking is a right click with the mouse (the user's decision, it stays) and a long press on touch; a controller is planned (`docs/PLAN.md`, C14). All input stays pointer clicks on hotspots or choices, so it reaches every device: nothing may be built that a controller couldn't do later (no hover-only information, no dragging, no gestures, no aiming or timing as the only way).
- **A hotspot is a rect only for a thing that is a rect** (the user's decision, 2026-11-09): anything else is a `poly`, so no hotspot
  covers floor one can see or another hotspot. In iso rooms the bake gives every prop its outline, every opening its parallelogram
  and every zone its shape (`<id>Poly`, `docs/iso-maps.md`); no shape under 12 px either way, no more corners than it needs.
  `node tools/hotspot-audit.mjs` measures every room (`build/hotspots/`).
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
- The game's connections: `sh tools/graph.sh [prolog | main | <thread>]` searches as the checks do, watches every move (what it
  needs, what it brings about) and writes `build/graph/<name>.js`; open the link it prints (the engine's `graph.html`): the
  puzzle dependency chart with the winning way, and the state budget (which flag multiplies the states by how much). In the
  editor it is the tab Connections: the studio's tasks "graph: prolog" and "graph: kapitel1 main" make the data
  (`studio.json`, the folder `build/graph`), a step opens its script in Things, a fact lists every place that sets or asks it.
- In the editor with the studio: the tab Map (every room with its exits and script warps, what is unreachable) and the game's
  own tab Iso-Editor (`game/editor/iso.js`): a street-mode room's map edited over its picture and baked from there (`art: room`);
  "Where from?" (or Alt+click) on a pixel opens the kit piece or the map line that made it. Change the map there or in the
  file, never the layout's numbers (the Room tab of a baked room says so on top). A spot's name is what the game calls
  (`Nagiwa.at.<room>.<spot>`): rename one in the map and the game together.
- The tab Schedule (engine; it was called Time): routines and moments over the game day; their times change by dragging, and a picked moment's
  `play` and `unseen` open as blocks, written into the game's file (only the steps that changed; what the code computes,
  as `A.stairs`, is left to the file). So a moment's scene is written as plain steps in its `play` or `unseen`, never built by a
  helper or an action in code: a scene played again elsewhere is `{ replay: "<moment>", from }`, a scene elsewhere and back is
  `{ remember_place }` ... `{ return_place }` (`game/nagiwa.js`).
- The tab Sequences (engine) puts a sequence (the intro) on a timeline under the picture: its shots, rooms, camera drives,
  `float`s, captions and music in lanes; the playhead shows any moment (Space plays from it); a bar's end drags its
  length, a step that goes on at once drags between the waits, steps are added at the playhead; a camera step's frame
  drags on the room's map. The changes go into `game/intro.js` itself (only the steps changed, the comments kept);
  Ctrl+S writes it. The intro's shots the game draws itself (`float`) have no map: their timing is the `float` bar.
- Art: `sh tools/build_art.sh [test | characters | ui | title | intro | cams | mock | room <id> | rooms]` (no argument:
  everything). `room kowalski` and `rooms` build the title too: the menu's backdrop is that street, baked from the same map and kit.
- Sounds: `node tools/render-sounds.mjs` (every sound of `game/sounds.js` into `build/sounds/`, `all.wav`
  in turn).
- Screenshots (look at both 1x and 3x):
  `node lib/cutaway/tools/shot.mjs index.html --size 960x540 --query "manual&act=prolog" --eval "await Cutaway.debug.settle()" --out build/shots/x3.png --buffer build/shots/1x.png`
  (`--query manual` alone: the title screen).

After a change, the checks that fit it (the user's decision, 2026-11-08: the whole of `sh tools/check.sh`, about 25 minutes, is too long
for small changes):

| the change | the checks |
|---|---|
| only the editor, docs or tools (nothing the game loads while it plays) | `validate` |
| the engine's runtime, or the game's code without new state (art, texts, a look, a screen) | `validate` and the whole game with real clicks (`play.mjs ... spiel.json`) |
| story, flags, puzzles, times (anything the solver sees) | as above, and the solver and the click paths of the chapter or thread it touches |
| before a bigger milestone (a chapter done, a release) | all of it: `sh tools/check.sh` |

The checks themselves:

```sh
node lib/cutaway/tools/validate.mjs index.html        # 0 errors (warnings are known: flags set but not yet tested)
node tools/solve-act.mjs prolog --full --set off_roof  # the prologue's way, the roof shut: "no soft-locks", every state has a hint (open, the roof goes past the solver's limit)
node lib/cutaway/tools/play.mjs index.html --act prolog --path tools/paths/prolog.json   # the prologue alone with real clicks (it ends where it would go on): "all passed"
node lib/cutaway/tools/play.mjs index.html --act prolog --path tools/paths/prolog_dach.json   # the prologue with the roof: "all passed"
node lib/cutaway/tools/play.mjs index.html --path tools/paths/spiel.json   # the whole game from the title, the prologue into Chapter 1 and to its end: "all passed"
node tools/solve-act.mjs kapitel1 --full --set off_roof,off_zeitung,off_imai,off_traeger,off_varga,off_tide,off_motte,off_vesper   # Chapter 1's main thread: "no soft-locks", every state has a hint
# and each side story alone (sh tools/check.sh does all of it): --set off_main,know_meeting and off_<the others>
node lib/cutaway/tools/play.mjs index.html --act kapitel1 --path tools/paths/kapitel1_main.json   # its main way with real clicks: "all passed"
```

Keep Chapter 1's state small: a flag nobody asks about doubles every state. What only shows (a dot for unread) is a view flag; what
the prologue leaves open is closed with `day=1`; a chapter marks the rooms Juno knows with `{ been_to: [...] }`; flavour is a look, not a
moment (seen or not doubles what follows); what no longer matters is forgotten overnight (`Nagiwa.nights[day].passes`). Every time is on the
15-minute ticks and only waiting moves the clock: one time off the grid multiplied the states by ten (the one exception is a chain nothing branches on, the end in cam31). Side stories and jobs are threads of their own: each
checked alone with the others shut (`off_<thread>`, `game/stadt.js`), since together they would multiply each other. What they do to each other is
not covered by the solver: keep them independent (their own `<thread>_step` number, no flag shared).

Across chapters (the user's decision, 2026-11-14, story §10h): a chapter takes over only a few flags from the earlier ones, and most
things are settled within the chapter they begin in, or variables and open threads pile up chapter by chapter. Each chapter's design
lists exactly what it keeps (its act's `keep`) and what it hands on.

## Art

- Read `docs/style-guide.md` and `.claude/skills/claude-pxl/SKILL.md` before making any art.
- 320x180, isometric street mode (2:1), feed mode in the phosphor duotone (style guide §9); check every
  feed with the overlay off.
- New art goes through a block sketch or mockup first, the user's approval, then painting. Big paintings
  can go to a subagent with an exact brief; check its result yourself (1x and 3x).

## How we work

- Small steps. Each step ends with screenshots shown to the user, the checks that fit the change passing, and a
  commit.
- Commit messages: one descriptive paragraph saying what changed and how it looks or plays, ending with the
  check results (e.g. "validate 0 errors, play.mjs: all passed"). **No Claude/AI attribution** (no
  `Co-Authored-By` line) in commits or PRs.
- Decisions about story, look and names are the user's: ask. Technical choices: decide and say so.
- When a decision is made, write it into the doc it belongs to (story §10, style guide, PLAN status).

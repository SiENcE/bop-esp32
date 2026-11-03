# Plan: Halcyon on Cutaway.js

Status (2026-11-03): **design done; H0 done** (without `git init`).

H0 (the setup) consists of:
- the engine copy in `lib/cutaway/` (`sh tools/sync-engine.sh`, Cutaway.js 0.1.0, commit 39d7fd7);
- `index.html`, `game/game.js`, `studio.json`;
- `tools/build_art.sh` and a test street (`art/test/street.px.js`, the iso mockup without its interface).

Juno walks in the test street on a 2:1 walk area, with four hotspots. Validate reports 0 errors.

**H2 (the vertical slice) plays** (commit 6513b12):
- What's in it: prologue steps 0–11, with the deck, CAM 03 and CAM 04, Kessler's evening, choice P1 and Sable's offer.
- Checks: validate gives 0 errors, and the solver finds the way in 16 moves with no soft-locks.
- Since done: the flat (art/rooms/flat.px.js: 8 props with front lines, runtime light) and the hints (11, each in three steps; solve --full confirms every state has one).
- Missing:
  - the sounds (tag, link, cache);
  - Juno with the hood down indoors (style guide §6).

**H1 (Juno) done:** `art/characters/juno.px.js` holds SE and NE views, each with idle (4 frames), walk (8 x 100 ms) and talk (2), plus the feed figure (idle 2, walk 6). The lineup is `docs/characters/juno_lineup_x4.png`. She walks in the test street with diagonal facings at 16x8 px/s.

H1 is still missing the shared art helpers: `art/lib/iso.js` and `art/lib/feed.js`, taken from the mockups.

**E-a, E-b and E-c are built in the engine** (uncommitted in `B:\Github_my\cutaway\`; 449 tests pass). E-c consists of:
- C7: post-effects, `src/post.js`;
- C8: a room's `mic`, `lines` and `label`;
- C9: `Cutaway.scene.boxes()`;
- C10: `Cutaway.settings.define` and `setting:` conditions.

C11, the tool updates, went in with each feature.

E-a and E-b:

| Item | What was built |
|---|---|
| C1 | number conditions |
| C2 | diagonal facings |
| C3 | a prop's `front` line |
| C4 | game time, `src/time.js` |
| C5 | routines and moments, with `moment:` and `seen:` |
| C6 | watched rooms (`observe: true`) |

The solver and `play.mjs` wait as a move ("wait": on to the next change).

Compatibility: the demo validates, solves and plays through. In The Loonies the new code paths are never taken (no comparisons, diagonal views, front lines, time or watched rooms in its data). A bounded solve of its Act 1 gives the same states with the old and the new engine. A full headless playthrough (`play.mjs --max 1000000`) can't finish on this machine within a tool run's 2-hour limit: its full-game solve alone takes longer. Run it by hand in The Loonies after its next `sync-engine.sh` (`playthrough.bat`, or `node tools/playthrough.mjs`).

| Done | File |
|---|---|
| style | `docs/style-guide.md` |
| story | `docs/story.md` (German) |
| prologue design | `docs/kapitel0-design.md` |
| Chapter 1 design | `docs/kapitel1-design.md` |

Nothing is built yet. This plan says what the engine needs, what stays in the game, and in which
order to build it. The model is the Loonies' plan (`B:\Github_my\the_goonies\docs\PLAN-engine-and-game.md`).

## 0. Ground rules

- **Two repos, one cut.**
  - The engine is `B:\Github_my\cutaway\` (MIT). It stays free of game content: no Halcyon names,
    art or text, and every new feature is shown in its own demo with placeholder art.
  - The game is this folder and uses a pinned copy in `lib/cutaway/` (synced with
    `tools/sync-engine.sh`, as in the Loonies; never edited here).
- **Generic in the engine, specific in the game.**
  - The engine gets the *mechanisms*: diagonal facings, game time and routines, rooms without a
    played actor, post-effects, overheard lines, number conditions.
  - The game builds its own *things* on them as plug-ins (`game/*.js`, actions and UI layers): the deck,
    the Kassenbuch, clips, the implant overlay, the OSD.
- **Same conventions as the engine:**
  - classic scripts, no build step, runs from `file://`;
  - data as script files;
  - JSDoc plus `tsc --checkJs` in the engine;
  - Node tools: validate, solve, play.
- **The solver stays the safety net.** Game time, routines and moments must be state the solver can
  enumerate (discrete 15-minute ticks, routines as pure functions of the tick). Each chapter is
  solved alone (`solve-act`), as the Loonies did for their acts.
- **Text:** German first, English later. Every string goes through `i18n` from the first line. City
  signs and ads are English art.

## 1. What already exists and fits

From the engine (`docs/reference.md` there):

| Feature | Use here |
|---|---|
| polygon walk areas with holes, A* | they follow the 2:1 lines, so iso works |
| props sorted by baseline | iso depth sorting |
| rooms wider or taller than the screen | the Drain Market (480 px) |
| runtime light (lamps, flicker, glow) with the same numbers as pxl | neon, screens |
| fx | rain, steam, drips |
| `scale far/near` (depth scaling) | the feed cameras |
| scripts, conditions, flags, items, dialogues | |
| several characters | Juno only, but the party code helps with remote actors |
| actors in other rooms speaking from off-screen | voices through a camera mic |
| acts | chapters, prologues |
| hints, saves with migration, settings | |
| sequences, letterbox, caption, dissolve | the intro, cutscenes |
| `tape` (a worn video picture) | close to the feed's artefacts |
| studio and editor | tools for the room editor |
| validate, solve, play, shot, build-atlas | |

## 2. Engine work (in `B:\Github_my\cutaway\`)

Each item: what it is, its data, and how the tools see it. Order = build order.

| # | Feature | Sketch | Tools |
|---|---|---|---|
| **C1** | **Number conditions** | `"chits>=80"`, `"day=2"`, `"tick<88"` beside the existing `"count=3"`; `{ inc, by }` exists | validate parses them |
| **C2** | **Diagonal facings** | costume keys `se`, `ne` (mirrored to `sw`, `nw`), chosen from the walk direction. Facing `"se"` etc. in scripts. Walking on 2:1 at matched x/y speeds. Back-compat: `right/left/up/down` unchanged. | demo: an iso room |
| **C3** | **Prop parts and occlusion** | a prop with `parts: [{ image, baseline }]`, or a `front` mask drawn over actors whose feet are above its line, so Juno can walk behind a cart and in front of its wheel | validate: parts inside the prop |
| **C4** | **Game time and routines** | `Cutaway.time`, separate from the frame clock: a day and a tick (15 min). Script steps `{ time: "+1" }`, `{ time: "22:00" }`, `{ day: "+1", at: "18:00" }`. Conditions `"time>=22:00"`, `"day=2"`. `Cutaway.routine(actor, [{ day, from, to, room, at, path, anim, say, moment }])`: where an actor is and what it does at every tick. An actor's room and position follow the routine when the time changes. Saved with the state. | the solver steps time as an action ("wait one tick", "skip to the next change") and sees the routine's state as a function of the tick |
| **C5** | **Moments** | named events a routine or script emits (`moment: "kessler_ring"`) with day, tick and room. `Cutaway.moments.log` keeps them. Conditions: `"seen:kessler_ring"`, `"moment:kessler_ring"` (it happened). Generic, so another game can use it for a stage play or a clock tower. | solver: moments are flags with a time |
| **C6** | **Watching rooms** | a room with `observe: true`: no played actor is drawn or walks. The left click and the hover go to game hooks (`Cutaway.observe.on("click", fn)`), so the game decides tag, zoom or steer. Actors in it run their routines and paths. | play.mjs: clicks in watching rooms |
| **C7** | **Post-effects** | `room.post: [{ palette: [...], dither: "bayer4" }, { scanlines: 2 }, { noise: 0.05 }, { roll: { speed, depth } }, { vignette: 0.3 }, { bloom }]` over the room and its actors, under the UI. A pure function of the frame clock, so screenshots repeat. `Cutaway.post.add(name, fn)` for a game's own pass. `tape` may become one of them. | off in the Node tools, as fades are |
| **C8** | **Overheard lines** | `say` with a `from` point (the speaker) and a room `mic: [x, y]` (the camera). The text loses words with distance and noise (`garble: 0..1`, deterministic per line and listener), and can show in a fixed bar instead of over the speaker (`lineAt: "bar"`, a UI hook). | validate: both texts in i18n |
| **C9** | **Screen-space overlays** | actors' and hotspots' screen boxes and labels as an API for a game's overlay layer (`Cutaway.room.boxes()`), and a z-band for it between post-effects and UI | — |
| **C10** | **Game settings** | a game adds its own options to the settings pages (`Cutaway.settings.define({ violence: { page: "content", values: ["bars", "shown"], default: "bars" } })`); conditions `"setting:violence=bars"` | the solver plays with the defaults |
| **C12** | **Dialogue v2** (for dialogue as deep as Disco Elysium's; game side: `docs/dialog-design.md`) | Everything optional, so old dialogues stay valid. **(1)** Inner voices are voice-only actors (they exist already: an actor without a costume), so their lines are plain `say` steps. A line may carry its own `if` (`{ say: "haendlerin", text, if: "v_haendlerin>=3" }`); interjections are conditional lines. **(2)** A choice may carry a `tag` shown before its text (`[HÄNDLERIN 3]`), and a `check: { if: cond, pass: goto or script, fail: goto or script, retry: "after:flag" }`. Checks are **deterministic**, never dice, so the solver can follow them; `retry` makes a failed check come back once a flag changes (white checks), and without it the failure stands (red). **(3)** A choice may stay visible but locked while its `if` is false (`show: "locked"`, with a `why` hint). **(4)** Nodes may hold their lines as an ordered list (`lines`: a beat at a time, each with speaker, condition and script) before the choices. **(5)** A **log panel** mode for conversations: the room dims, and a scrolling transcript on one side shows every line in the speaker's colour, with the choices numbered under it (keys 1–9). This is generic: `Cutaway.dialogs.configure({ mode: "log", side, width })`. Lines over heads stay the default. | solver: checks are branches on conditions; validate: tags, check targets, voice actors |
| **C13** | **Node editor for dialogues** (it replaces the current list view in the editor's centre) | The graph is shown on a pannable, zoomable canvas. **Nodes** are cards with the id, the speaker and the first line, plus a count of choices. **Edges** run from each choice's port to its `goto`: dashed for a check's fail branch, a loop arrow for staying, a mark for `end`. **Editing:** drag a card to move it (its position is saved in the edits layer as `layout`, never in the game's data); drag from a port to a card to set the goto, or onto empty space for a new node; double click (or Enter) opens the node in the inspector, which reuses the existing block editor (choices, `if`, `once`, scripts), so nothing is lost. **Seeing it:** the start node is marked, as are unreachable nodes (red) and what is offered now in the running game (lit). There is a search, folding of node groups (`group: "teo/rent"`) and a minimap. **Auto-layout** (layers left to right from the start) for dialogues without a layout. "Test from here" on a node. Keys: arrows move between cards, Tab steps through choices, N adds a node, Del removes one. | `editor-dialogue.js` and its tests; the editor guide |
| **C11** | **Tool updates** | solver and play know time, routines, moments and watching rooms. `solve-act` per chapter. | |

Each item gets tests (`node tests/run.mjs`, "all passed"), `npm run check`, a section in the engine's
`docs/reference.md` (and the editor help rebuilt), and a demo room.

## 3. Game work (this repo)

### Game plug-ins (`game/`)

| File | What |
|---|---|
| `deck.js` | the deck as a computer (`docs/kapitel0-design.md` §2): a full-screen UI layer with a desktop, icons and one app window (GLAS, CHAT, CACHE, BUCH, KONTO, NETZ, RADIO, MÜLL); the messenger (threads, status, choice replies, attachments, messages timed by the clock); notification cards over every mode; the clip editor (cut, later anonymise, check, splice); actions `{ deck: "chat" }`, `{ mail: id }` |
| `evi.js` | EVI, the AI on the deck: her figure on the desktop (6 faces, idle, walk, sleep), her lines, the hint button as her head in the satchel |
| `feed.js` | feed mode on top of C6–C9: tag (max 3), follow (the camera strip), zoom (a zoom window with its own art per target), REC and the 30-minute buffer, steer (camera positions, screens, doors), link (codes), the implant overlay (brackets, tags, labels), the OSD (camera ID, time, REC, thumbnails, the audio bar, the cache) |
| `ledger.js` | the Kassenbuch: entries with later outcomes (`{ ledger: "kessler_varga", text, chits }`, `{ ledger: ..., outcome: ... }`) |
| `money.js` | chits as a number flag, buying and trading with traders, the rent |
| `cast.js`, `places.js`, `rooms/<id>.js`, `cams/<id>.js` | data |
| `routines/<chapter>.js` | the people's schedules per chapter |
| `strings/de.js`, later `strings/en.js` | texts |
| `hints.js`, `music.js`, `sounds.js`, `skin.js`, `font.js` | as in the Loonies |

### Art (`art/`)

- `art/lib/iso.js`:
  - from `mock_c_iso.px.js`: `P()`, `flat()`, `isoBox()`, `halo()`, wet floor (`MIRROR`, `SHEEN`);
  - the world palette.
- `art/lib/feed.js`:
  - from `mock_e_cctv.px.js`: the camera and lens, the blockout ray tracer, the phosphor quantize;
  - the baked layer only. The live artefacts become engine post-effects (C7).
- `art/characters/<name>.px.js`:
  - iso views SE and NE with walk (8 frames), idle, talk;
  - a feed figure: 3–4 phosphor values, about 24 px, a few frames.
- `art/rooms/<id>.px.js` (iso) and `art/cams/<id>.px.js` (a blockout in meters, a camera, baked to
  the phosphor).
- `art/ui/`: the deck (desktop, icons, window frame, notification card), EVI, the overlay brackets,
  the cursor, the bag, the name tag.
- **Fonts:** check that the 5x7 font has Ä Ö Ü ä ö ü ß, and add them if not.
- Build: `tools/build_art.sh` like the Loonies'.

## 4. Phases

| Phase | Where | What | Done when |
|---|---|---|---|
| **H0** | game | Setup: folders as the Loonies, `index.html`, `tools/sync-engine.sh`, `studio.json`, an empty first room that loads; `git init` | the page opens, validate passes |
| **H1** | game | Art foundation: `art/lib/iso.js`, `art/lib/feed.js`, the palette; **Juno** in iso (SE, NE, walk, idle, talk) and as a feed figure | Juno walks in a test room |
| **E-a** | engine | C1, C2, C3 (numbers, diagonal facings, prop parts) | tests, demo room |
| **E-b** | engine | C4, C5, C6 (time, routines, moments, watching rooms) | tests, demo: a watched square with two people on a schedule |
| **E-c** | engine | C7, C8, C9, C10, C11 (post-effects, overheard lines, overlays, settings, tools) | tests, solver plays the demo |
| **H2** | game | **Vertical slice:** prologue steps 0–10. Juno's `flat` with the deck; `cam03` and `cam04`; Kessler and Varga on their routine; tag, listen, zoom, link, REC and the buffer; the clip; choice P1. | it plays through by hand and in `play.mjs`; the solver proves it |
| **H2c** | game + engine | **The cyberpunk pass** (`docs/style-guide.md` §8a): every part that still looks like the engine's defaults gets the Halcyon look. Done: frames, cards (engine `frame.draw`/`card.draw`, `game/skin.js`), the fonts (`game/font.js`: the 5x7 terminal face as the default, the 3x5 HUD font for the camera display and the deck's header), the cursor, the satchel and the buttons (`art/ui/hud.px.js`, EVI as the hint button), the hover labels and the choice panel (engine `label`, `choices.draw`), the room changes (`game/transitions.js`: glitch scan, jack-in, static). Next, in this order: sounds; music; the title screen | nothing on screen or in the speakers is an engine default; screenshots of each part next to the mockups |
| **H2b** | game | **The deck as a computer and EVI** (`docs/kapitel0-design.md` §2): first the mockup `docs/mockups/mock_f_deck` (desktop, chat, clip editor, EVI's faces at 320x180), then `deck.js` and `evi.js` replace the current one-panel deck; the prologue's steps 0a–12 get EVI's lines; the hints become EVI's | the prologue plays through the new deck by hand and in `play.mjs`; the solver still proves it |
| **E-d** | engine | C12, C13 (dialogue v2 and the node editor), then a mockup of the log panel at 320x180 | tests; the demo's dialogue in the node view; The Loonies' dialogues load and solve unchanged |
| **H3** | game | The rest of the prologue: the intro "Die letzte Schicht", `kessel_14`, `kessel_lobby`, `kowalski`, Bao, "JUNO.", hints, music | the prologue solves and plays from the title screen |
| **H4** | game | Chapter 1 (`docs/kapitel1-design.md`): 9 rooms, 12 cameras, three evenings, the Kassenbuch, money, the murder in two variants | `solve-act ch1 --full` |
| **R0** | game | The demo build: prologue plus Chapter 1, web and desktop (as the Loonies' release) | built and played through |
| **H5–H9** | game | Chapters 2–6, each: a design document (German) → art → logic → solve | each chapter solves alone and through to the end |
| **H10** | game | The English version | `validate --lang en` complete |

H2 is the important test. It proves the two modes and the watch–record–sell loop before anything
else is drawn at scale. If feed mode doesn't feel right there, change the design, not the art count.

## 5. Risks

- **Art cost of the feeds:**
  - every camera is a new picture, and many need zoom targets;
  - the blockout ray tracer (mockup E) keeps a camera cheap: boxes and lights in meters, then hand
    figures;
  - plan places and cameras together so one blockout serves the iso room and its cameras.
- **State size:**
  - time ticks times flags times moments can blow up the solver;
  - solve per chapter, and let routines repeat per night;
  - "skip to the next change" should be the solver's only way to wait.
- **Readability of the duotone:** check every feed with the overlay off (style guide §9).
- **The engine cut:** feed mode is the game's heart, but its mechanisms must stay generic.
  - If a feature can only be described with Halcyon words, it belongs in `game/`.

## 6. Open

- `git init` for this folder (there is no version control yet).
- Whether the second deck in Chapter 4 changes the deck's colours (amber) or only its frame.
- Music: synthesised like the Loonies (the engine's synth), its style to be decided (dark synth, sparse
  piano, rain).

# Plan: Glass Sister on Cutaway.js

Status (2026-11-24):

- **Done:** H0, H1, H1c, H2, H2b, H2c; H3 (the prologue solves and plays from the title screen); H4 (Chapter 1, painted, every thread
  solved alone); **H5 (Chapter 2 "Aufnahme")**, played through by the user, his decisions in `docs/story.md` §10h. After the review of
  2026-11-22 (`docs/review.md`, decisions in story §10j): the secret lies less open after Chapter 1, Sable's talk is one tree
  (`game/sable.js`), Teo's talks build on each other and his pump hall is a camera of its own (CAM 33, `game/kapitel2_teo.js`), the
  Kassenbuch has its hidden weights (story §5, `game/gewicht.js`), the flag `traeger` is gone, the hotspots round things
  that are not rects are polys (§4.5). Engine: E-a, E-b, E-c; C15, the solver across the chapter line (each of Chapter 2's runs
  begins from every way its run of Chapter 1 ends, `tools/runs.sh`; it found at once that a fresh act's start lost what Chapter 1 handed
  on, fixed in the engine).
- **Open:** E-d (C12, C13: dialogue v2 and the node editor), E-e, C14 (the controller, before R0), R0 (the demo build). Across the
  chapter line not yet: the prologue into Chapter 1 (87 ways; Chapter 1's runs still begin from its own start). From the review:
  Chapter 2's remaining patches on Chapter 1's rooms (§4.2, to be settled when Chapter 3 first touches them).
- **Now:** H6 (Chapter 3 "Lull"). Its design is drafted (`docs/kapitel3-design.md`, the user's decisions in story §10l), every new place
  has an approved block sketch or mockup (the dream's three states, the checkpoint's long hall, the basin room, the walkway to the
  Flutwerk, a maintenance camera, the station), and the build is planned in steps (§4, "H6 in steps"). **Next:** H6.1.
- **Checks:** the last full run (2026-11-23): `sh tools/check.sh` ALL PASSED (validate 0 errors, 10 warnings; doc-lint 0 errors; the
  prologue 78612 states; Chapter 1 main 115984, roof 52394, zeitung 41712, imai 37158, traeger 12446, varga 109103, tide 142246, motte
  33430, vesper 34258; Chapter 2 main 215148, stick 93050, lantern 271112, the shop 50020, haldane 104272, teo 22074 and the runs of
  Varga, Tide and Frau Imai; every click path, the taps, the pointer; no soft-locks, every state with a hint); `sh tools/graph.sh all`
  13 runs, no soft-locks; `sh tools/handoff.sh --only` 0 errors, 20 warnings, the same as before `teo_talk`, which is handed on cleanly.
  Then (C15) Chapter 2's runs from Chapter 1's ends, each varying e1 and its own answer, every start winnable, no soft-locks, every state
  with a hint: main 430920 states (86 min), stick 186340, lantern 463984 (109 min), varga 317248, tide 95068, the shop 100040, imai 76496,
  haldane 161656, teo 82614; about twice the states of one start, and Chapter 2 now takes about five hours of `check.sh`.

What each step built and how it was decided is in the commits and the chapter designs (`docs/kapitel1-design.md`,
`docs/kapitel2-design.md`).

## 0. Ground rules

- **Two repos, one cut.**
  - The engine is `B:\Github_my\cutaway\` (MIT). It stays free of game content: no names from this game,
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
  - Texts in the data (lines, names, choices, hints, cards) are written inline in German, the source
    text; the engine translates them. An English table later maps source text to English
    (`Cutaway.i18n.table("en", {...})`, or the editor's Texts tab: CSV out, CSV in).
  - Texts the game draws itself (the deck, the feeds' display, the skin's readouts, its own lists:
    cache, Kassenbuch, cameras, people) go through `Nagiwa.t(text, { part })` and are declared with
    `Cutaway.i18n.declare(where, [...])`, so validate and the Texts tab see them too (done 2026-11-04,
    engine commit c429aae). Placeholders like `{n}` are filled in after the translation.
  - Check: a pseudo language (every letter through `t()` becomes x) in a screenshot; anything still
    readable is a text that skips i18n.
  - Text painted into the art is outside i18n: only signs, ads and the city's tech (English anyway).

## 1. What already exists and fits

From the engine (`docs/reference.md` there):

| Feature | Use here |
|---|---|
| polygon walk areas with holes, A* | they follow the 2:1 lines, so iso works |
| props sorted by baseline | iso depth sorting |
| rooms wider or taller than the screen | Kowalski Street (416 px), the alley (416x236), the Drain Market from above (1280x720, 4x4 screens; its walk map with 24 stalls as holes builds quickly since Cutaway 4c6142c) |
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
| **C10** | **Game settings** | a game adds its own options to the settings pages (`Cutaway.settings.define("violence", { page: "content", pageLabel: "Inhalt", label: "Gewalt", options: [["bars", "mit Balken"], ["shown", "gezeigt"]], default: "bars" })`); conditions `"setting:violence=bars"` | the solver plays with the defaults |
| **C12** | **Dialogue v2** (for dialogue as deep as Disco Elysium's; game side: `docs/dialog-design.md`) | Everything optional, so old dialogues stay valid. **(1)** Inner voices are voice-only actors (they exist already: an actor without a costume), so their lines are plain `say` steps. A line may carry its own `if` (`{ say: "haendlerin", text, if: "v_haendlerin>=3" }`); interjections are conditional lines. **(2)** A choice may carry a `tag` shown before its text (`[HÄNDLERIN 3]`), and a `check: { if: cond, pass: goto or script, fail: goto or script, retry: "after:flag" }`. Checks are **deterministic**, never dice, so the solver can follow them; `retry` makes a failed check come back once a flag changes (white checks), and without it the failure stands (red). **(3)** A choice may stay visible but locked while its `if` is false (`show: "locked"`, with a `why` hint). **(4)** Nodes may hold their lines as an ordered list (`lines`: a beat at a time, each with speaker, condition and script) before the choices. **(5)** A **log panel** mode for conversations: the room dims, and a scrolling transcript on one side shows every line in the speaker's colour, with the choices numbered under it (keys 1–9). This is generic: `Cutaway.dialogs.configure({ mode: "log", side, width })`. Lines over heads stay the default. | solver: checks are branches on conditions; validate: tags, check targets, voice actors |
| **C13** | **Node editor for dialogues** (it replaces the current list view in the editor's centre) | The graph is shown on a pannable, zoomable canvas. **Nodes** are cards with the id, the speaker and the first line, plus a count of choices. **Edges** run from each choice's port to its `goto`: dashed for a check's fail branch, a loop arrow for staying, a mark for `end`. **Editing:** drag a card to move it (its position is saved in the edits layer as `layout`, never in the game's data); drag from a port to a card to set the goto, or onto empty space for a new node; double click (or Enter) opens the node in the inspector, which reuses the existing block editor (choices, `if`, `once`, scripts), so nothing is lost. **Seeing it:** the start node is marked, as are unreachable nodes (red) and what is offered now in the running game (lit). There is a search, folding of node groups (`group: "teo/rent"`) and a minimap. **Auto-layout** (layers left to right from the start) for dialogues without a layout. "Test from here" on a node. Keys: arrows move between cards, Tab steps through choices, N adds a node, Del removes one. | `editor-dialogue.js` and its tests; the editor guide |
| **C14** | **Controller** | a gamepad moves a pointer that snaps to hotspots; one button acts, one looks, one opens the bag, one the menu: the same `pointer.click` events as mouse and touch, so the game's data doesn't change. What it snaps to is there already: `Cutaway.ui.targets()`, the hotspots and what the layers say (the deck's scroll arrows). The dialogue's choices and the menu's rows still have to say so too. Planned before the demo build R0. | play.mjs can press its buttons |
| **C15** | **Solver across the chapter line** (stage 2 of the checks, `docs/kapitel2-design.md` §13.7) | `solve` starts from a list of states instead of one: every end state of the act before, cut down to the act's `keep` (the hand-over check and the end states in the graph data exist); a run that solves from each of them, its soft-locks and missing hints reported per start state. Generic, shown in the engine's demo. Built: `--from`, narrowed by `--hold`, `--vary`, `--only` (a later chapter from all ends multiplies its states; a run varies the answers it is about). | before H6 (the user, 2026-11-21); done 2026-11-23 |
| **C11** | **Tool updates** | solver and play know time, routines, moments and watching rooms. `solve-act` per chapter. | |

Each item gets tests (`node tests/run.mjs`, "all passed"), `npm run check`, a section in the engine's
`docs/reference.md` (and the editor help rebuilt), and a demo room.

## 3. Game work (this repo)

### Game plug-ins (`game/`)

| File | What |
|---|---|
| `deck.js` | the deck as a computer (`docs/kapitel0-design.md` §2): a full-screen UI layer with a desktop, icons and one app window (GLASS, CHAT, CACHE, BUCH, KONTO, NETZ, RADIO, MÜLL); the messenger (threads, status, choice replies, attachments, messages timed by the clock); notification cards over every mode; the clip editor (cut, later anonymise, check, splice); actions `{ deck: "chat" }`, `{ mail: id }` |
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
| **H2c** | game + engine | **The cyberpunk pass** (`docs/style-guide.md` §8a): every part that still looks like the engine's defaults gets the game's look. Done: frames, cards (engine `frame.draw`/`card.draw`, `game/skin.js`), the fonts (`game/font.js`: the 5x7 terminal face as the default, the 3x5 HUD font for the camera display and the deck's header), the cursor, the satchel and the buttons (`art/ui/hud.px.js`, EVI as the hint button), the hover labels and the choice panel (engine `label`, `choices.draw`), the room changes (`game/transitions.js`: glitch scan, jack-in, static), a first set of sounds (`game/sounds.js`, `tools/render-sounds.mjs`), the first music (`game/music.js`: Juno's theme, the feeds' drone), the title screen (`game/title.js`). **The pass is done**; what stays a rule for new work (characters, rooms, animation, words) is in §8a | nothing on screen or in the speakers is an engine default; screenshots of each part next to the mockups |
| **H1c** ✔ | game | **Maßstab und Baukasten** (done 2026-11-04: the flat baked from its map with `art/lib/isokit.js` and `art/kit/flat.kit.px.js`, Juno at 50 px with face B, hood down indoors; the layout measured into `game/rooms/flat.layout.js`; the old art in `art/old/`) (`docs/ideas/iso-tiles.md`, style guide §4): the new scale (30 px per meter of height); the map format and the bake (`art/lib/isomap.js`: a map → picture, props and the measured layout: walk area from the cells, front lines from footprints, spots); the flat first as blocks from its map, then Juno at ~50 px (block sketch, approval, paint), then the kit for the flat painted and the flat baked from its map with the light | the flat plays from its baked map with the new Juno; validate, solve, play pass |
| **H2b** ✔ | game | **The deck as a computer and EVI** (done 2026-11-04: `game/deck.js`, `game/evi.js`; steps 0a–12 with EVI's lines, the clip editor, the photo with "memory") (`docs/kapitel0-design.md` §2): first the mockup `docs/mockups/mock_f_deck` (desktop, chat, clip editor, EVI's faces at 320x180), then `deck.js` and `evi.js` replace the current one-panel deck; the prologue's steps 0a–12 get EVI's lines; the hints become EVI's | the prologue plays through the new deck by hand and in `play.mjs`; the solver still proves it |
| **E-d** | engine | C12, C13 (dialogue v2 and the node editor), then a mockup of the log panel at 320x180 | tests; the demo's dialogue in the node view; The Loonies' dialogues load and solve unchanged |
| **E-e** | engine | The Iso tab (`docs/ideas/iso-tiles.md` §4): the 2:1 grid over a room, paint cells, walls on edges, props from the game's list, an unlit preview, bake through a studio task, reload the art; a demo room from placeholder tiles | tests; the demo's room edited and baked |
| **H3** | game | The rest of the prologue: the intro "Die letzte Schicht", `kessel_14`, `kessel_lobby`, `kowalski`, Bao, "JUNO.", hints, music | the prologue solves and plays from the title screen |
| **H4** | game | Chapter 1 (`docs/kapitel1-design.md`): 9 rooms, 12 cameras, three evenings, the Kassenbuch, money, the murder in two variants | `solve-act ch1 --full` |
| **R0** | game | The demo build: prologue plus Chapter 1, web and desktop (as the Loonies' release) | built and played through |
| **H5–H9** | game | Chapters 2–6, each: a design document (German) → art → logic → solve | each chapter solves alone and through to the end; the hand-over is checked (`sh tools/handoff.sh`: nothing read that the act before sets but this one doesn't keep), and from H6 on the solver runs across the chapter line: chapter N from every end state of chapter N−1, cut down to N's `keep` (stage 2 of the checks, 2026-11-14; moved from H5 to H6 by the user, 2026-11-21: C15) |
| **H10** | game | The English version | `validate --lang en` complete |

H2 is the important test. It proves the two modes and the watch–record–sell loop before anything
else is drawn at scale. If feed mode doesn't feel right there, change the design, not the art count.

### H6 in steps (Chapter 3 "Lull", planned 2026-11-24)

The design is `docs/kapitel3-design.md` (§ numbers below are its own). The order puts the risk first, as H2 did: the dream is a
third mode nobody has built, so a spike proves it before the content leans on it. New rooms come in on blocks from their approved
sketches (`tools/new-room.mjs`) and are painted late, when what happens in them has settled. Each step ends with its checks and a
commit; a thread's solver run comes with the thread; Chapter 2's main way runs only where a step touches it.

| Step | What | Checks | Done when |
|---|---|---|---|
| **H6.1** | **The act:** `game/kapitel3.js`, the act `kapitel3` on game days 8 and 9 with its `keep` and `leave` (§2.1), `?act=kapitel3`; Chapter 2's end chain goes on into it; the card on black, CIVIC REST in the CHAT, Teo `schläft`, EVI's lines; the bed and the clock's holds for two evenings; nothing else yet. Last, `sh tools/graph.sh kapitel2` once more, so Chapter 2's ends are cut to Chapter 3's `keep` (the ground for its solver: `graph.sh` already writes `build/graph/kapitel2_<run>.js`, the main run's of 2026-11-23 has 432 winning ends in 600 KB; only the cut needs the act). The fewer starts are already built in: Chapter 3 keeps little, flags only the game's own code reads don't count, and each run varies only its own answers (the main run `e2` and `moth_student`, at most 8 starts) | validate; a click path to the second evening; `handoff.sh --only` for what Chapter 2 hands on | Chapter 3 starts from Chapter 2's end and from `?act=kapitel3`; `kapitel2_main.js` holds the ends cut to its `keep` |
| **H6.2** | **The dream, a spike:** the third mode in `game/traum.js` (§13.1, style guide §9a): the data room drawing the city's feeds as pictures in the void through the dream's ramp, the tunnel as the way into one, the picture made of code over a room, Juno's cyan, the Witness's voices; clicks only, the clock still. A generic piece goes to the engine only if it can be told without this game's words (several rooms as tiles in one, a palette pass) | validate; the whole game with real clicks; screenshots against the mockups at 1x and 3x | one feed reached through all three states, by hand and in `play.mjs` |
| **H6.3** | **The pump hall:** `flutwerk_steg` and `becken_raum` on blocks; BECKEN 3's messages, the photo's stamp `'74`, the staff door's keypad with Teo's PIN, Tinte's talk (`Nagiwa.talkTree`, §3.2), `know_flutwerk`, `know_teo_cam`, `link_cam33` for everyone | validate; the main thread's solver; its click path | Juno talks to Tinte and knows where Teo looks |
| **H6.4** | **OBS-4 and Lull:** PRÜFEN laying data over data (the handbook over the protocols' head, a new kind in `game/pruefen.js`), `know_obs4`; Lull from Marit (she sees the implant) or Sable (100), the thing `lull`, the bed from 01:00 with it | as H6.3 | Juno can take Lull and stay awake |
| **H6.5** | **The first dream night:** the guided chain (§3.5): the feeds, Juno marked, her name in every voice, CAM 31 as the sleepers see it, the station from above; morning is Wednesday evening | as H6.3 | night 1 plays through and the solver passes it as a chain |
| **H6.6** | **The second night and decision 3:** CAM 33 found with `know_teo_cam` (without it a hint, not a lock), Teo on the rim in the picture of code (§3.6, his lines by `teo_talk`), the Witness and `e3` with its three reactions (§3.7) | as H6.3 | every `e3` reachable, none by accident |
| **H6.7** | **The raid and the fire:** the chain (§3.8, §3.9) branching only on `moth_student`, Mama's scarf (`got_schal`), window, ledge, ladder, roof; the deck burning, EVI's face, the raw EVI on the pocket deck (`evi_trust`'s line), the end and the card "Kapitel 4"; the flat burnt as a second bake if Chapter 4 shows it | as H6.3; `handoff.sh` for what Chapter 3 hands on (`e3`, `got_schal`, the threads' answers) | the main way plays from Tuesday to the end |
| **H6.8** | **The checkpoint:** `transit_neun` on blocks, the long hall (§3.3, §9.2): the first check's red gate, the waiting hall's routines by day and hour (looks only), the guard at the application counters, the few behind the glass | validate; the main thread's solver (the hall is never needed) | Juno is turned away there, by hand and in `play.mjs` |
| **H6.9** | **The threads, each alone** (§6): Morrow's daughter (`off_tochter`: Morrow at 20:00 in the hall, Raya on the station in the second night, `morrow_kind`), Ratz' colony (`off_ratz`: WARTUNG 5-17, the maintenance cameras, guiding him, `ratz_kolonie`), Tinte to the sea (`off_tinte`: the notice, the test on Tuesday at 22:00, the release on Wednesday at 23:00, the clip to the foreman or to Sable, `tinte`) | each thread's own solver run and click path, the others shut | each solves alone without soft-locks, every state with a hint |
| **H6.10** | **The life around and what Chapter 2 leaves** (§4, §5, §7): the Quiet coming closer, the lines by `e2`, Lantern on the RADIO, Okonkwo's thanks, Bao at the alley, Frau Haldane's door, the drafts sent from the MÜLL, Motte; the news, the board, the Rain Reader; the hints (§12) | validate; the main thread's solver; the whole game with real clicks | nothing in it is a state the solver didn't need |
| **H6.11** | **The art:** the rooms painted on their sketches' lines (`becken_raum`, `flutwerk_steg`, `transit_neun`, the station), Tinte large, Teo and Raya in the dream, the maintenance cameras, the burnt flat; the dream's pictures readable (§3.5); each block sketch, its approval, then the paint, big paintings perhaps to an agent with an exact brief | validate; the whole game with real clicks; review sheets at 1x and 3x | nothing of Chapter 3 is left on blocks |
| **H6.12** | **Across the chapter line and the milestone:** Chapter 3's runs in `tools/runs.sh` from Chapter 2's ends (C15: the main run varying `e2` and `moth_student`, each thread its own), `handoff.sh`, `doc-lint --flags`; the walkthrough (`docs/durchspielen/`), the timeline, `spiel.json` to Chapter 3's end; the user plays it through | all of it: `sh tools/check.sh`, `graph.sh all`, `handoff.sh --only` | every start winnable, no soft-locks, every state with a hint; the user's play-through |

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
  - If a feature can only be described with this game's words, it belongs in `game/`.

## 6. Open

- `git init` for this folder (there is no version control yet).
- Whether the second deck in Chapter 4 changes the deck's colours (amber) or only its frame.
- Music: synthesised like the Loonies (the engine's synth), its style to be decided (dark synth, sparse
  piano, rain).
- The game's lines in whole sentences (dialog-style-guide §3, decided 2026-11-10): the prologue and Chapter 1 are rewritten (2026-11-10),
  shown to the user as before and after; what the user still changes in them comes on top. The voices' measures are decided
  (§3): Morrow, Sable, DER HUNGER and DIE BEOBACHTERIN in telegram style, the Rain Reader lyrical, Aubrecht in long, smooth sentences.

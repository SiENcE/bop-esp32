# Prompt for the next session

Copy everything below the line into a new session.

---

We're continuing work on "Glass Sister", our cyberpunk point-and-click adventure, in B:\Github_my\cyberpunk
(engine: Cutaway.js in B:\Github_my\cutaway\). Read CLAUDE.md first; it lists the docs, the commands and
the checks. Talk to me in German (the docs are German, code comments English).

Where we are (everything is committed; the engine copy is at Cutaway.js be4941d):
- **The intro "Die letzte Schicht" is done and approved** (docs/kapitel0-design.md §5), about 1:45. The sequence "intro" in game/intro.js; it ends
  on the ride down in the lift, then the title screen.
- **The prologue plays from the flat to its end card**, on Tuesday 2091-11-06 (game day 1). It does not go on into Chapter 1 yet.
- **How all text sounds is written down:** docs/dialog-style-guide.md, with a voice card for every character. Read it before writing any line.
- **Chapter 1 "Glass" is a playable mock on flat blocks:** `index.html?act=kapitel1`, game days 2 to 4 (Wednesday to Friday). I check everything by
  playing it, and I decide what gets painted afterwards. Design: docs/kapitel1-design.md (the mock's simplifications at the end of §2, "Die Stadt" in §7);
  decisions: story §10b, marked provisional until the mock has been played.
  - **game/kapitel1.js:** the evenings (game/evenings.js: the bed opens at 01:00, not on Friday), WREN, the rent, job C: Ines in cam21 to cam24, the stick in
    dryer 6 and the ticket, Lantern at 03:00, the fallback on Friday at the swamp stairs (cam30), cam31 linked by giving the old protocol's handshake, long, short, short, long: the beat of every Lull point (kapitel1 C7; the art already painted, the armchair, the title, the intro, still pulses evenly).
  - **game/stadt.js:** the alley, the Drain Market (so far only the preacher), LUCKY STATIC; side stories: the way on to the roof (the ID on the window, the lift's hook
    on the ladder, the ledge), the Rain Reader, the newspaper war (Frau Haldane steals her own paper in her sleep; cam14), Frau Imai (the UNKNOWN LINK in the queue, cam18's
    archive, the truth or the lie), the white carriers (Thursday 23:30), the half repair.
  - **The roof is the place on the old photo on the deck, twenty years on** (art/ui/deck_wallpaper.px.js paints both, the photo itself unchanged): SLEEP BETTER for RISE ABOVE,
    NOODLES without two letters, Juno can sit down alone (dach_sitzen). The photo is of 2074, Juno 14, Teo 6. The look up at the Rings is mock B
    (docs/mockups/mock_g_ringe_b_x3.png), which I accepted; A is beside it.
  - **Ashe** (Corvin Ashe, formerly Rask) kills because a trial would make the logs public and a murder can be pinned on Lantern; Aubrecht gives the order without calling it one;
    he was an observer in Juno's hall himself, which is why he waves (story §10b).
  - The bag: what Juno holds is an item (ID, hook, Ines's stick; later the tap and the rice), clips and notes stay in the CACHE. EVI sits fixed in the bag and only talks.

  - **The end in cam31 is built on blocks** (game/kapitel1_ende.js, kapitel1-design §8): Ines, Lantern, Ashe; the four tries that all fail, in real time with the VOR button as the way the tools take; black bars or shown (settings, page "Inhalt"); SIGNAL LOST; her flat, where only Juno can be clicked; EVI; the end card. I have only seen stills of it; how long the threat should last and every line not in §8 are mine to judge by playing.
  - **The roof and dach_sitzen are animated** with the same 24 frame loop as the deck's wallpaper; their rain is baked in, so they have no rain fx. It ends at the parapet's top: the parapet and the tar stay dry, no rain, no puddles, and the ladder ends there too. The photo keeps its rain and puddles.
  - **Motte plays** on a wide handheld with two coloured grips, held in both hands, and can be talked to whenever Juno passes (game/motte.js, what it plants in kapitel1-design §7): a Tideboy, the game Sump Runner, his mother on Lull. Motte stays a boy and "er". He only says the light behind her ear blinks oddly; the beat outright is EVI's, as the last step of her hint.
  - **The Rain Reader talks** (game/regenleserin.js): nested topics, no flags, everything can be asked again. Her lines explain the world and plant things for later; what pays off where is in kapitel1-design §7. Her age and past stand (story §10b); the lines are to be judged by playing.

  - **The deck's lists scroll smoothly:** contacts, messages, CACHE, BUCH and NETZ (NETZ all fits so far: when the evenings fill it, raise NETZ_H in game/deck.js), by their arrows, the wheel and a finger (engine: `pointer.wheel`, `pointer.drag` with `claim()`). What is scrolled is only the screen's. The ways click the arrows when a row is out of view (a layer's `reveal`), and the arrows are in `Cutaway.ui.targets()` for a controller (PLAN C14). **GLASS's map is a grid,** so no two cameras' labels meet: x 8, 64, 120, 176, y 14, 38, 62, 86, one camera to a place (free now: 8/62, 64/62, 8/86, 64/86, 176/86; the planned cam07, cam07v and cam15 need three of them).
  - **Bao:** he has one arm, the one with the ladle, the other sleeve pinned up at the shoulder (why is still open: docs/characters/bao_one_arm_x8.png), and he names Lou once ("Lou isst seit vierzig Jahren hier."). On his cart the pot is copper in its own dark ring, and the umbrella's pole no longer shows through the cloth.

**Next, in the agreed order:**
job A (Varga, Kessler), job B (Tide, Okonkwo), life around it (Teo's visit on Wednesday, Mei, Vesper, the NETZ, Motte's lessons, Bao's line, Frau Kessler's messages are in), then the prologue goes on into
the act (`{ act: "next" }` instead of its end card; the act has `fresh` and `keep`), and only then the painting, blocks first. (The way the beat of Lull is drawn in the painted art, the steps' sound on the stairs and how the mock feels overall are for me to judge by playing: I have only seen stills and not heard the steps.)
Also to come: the reading version docs/story-lesefassung.md doesn't know the city yet and still has WREN's money coming back on Wednesday (in the mock the replies are on Friday).

**A dialogue never shows more than four options, the way back included;** topics nest (dialog-design §4, `Halcyon.talkTree` in game/talk.js refuses more).
**Rules of mine: what the player finds can be taken at once.** Nothing waits for an earlier click without a reason in the world (CLAUDE.md, conventions): each thing has its own flag;
a gate needs a time, knowledge the player really lacks, or a decision of mine. **And nothing the game needs hangs on looking:** a right click with the mouse stays, a long press on touch, a controller button later (PLAN C14); looking only tells more. 
**Touch works** and is tested: tap acts, a long press looks, a finger on a thing shows its name, an eye button shows what can be clicked. EVI tells people about the long press after their third tap, and again after 40 and 120 as long as they have never done it; only on real touches, remembered on the device (game/evi.js, localStorage). All the ways are tapped through with `play.mjs --touch`; legibility on a real phone I still have to judge.
**A controller comes later (PLAN C14), and nothing may be built that a controller couldn't do:** no hover-only information, no dragging, no gestures, no aiming or timing as the only way. Everything stays a pointer click on a hotspot or a choice.
**You can test in a real Chrome now:** the `mcp__chrome__*` tools (open `index.html` by its file URL; `emulate` for a phone). `play.mjs` and `shot.mjs` stay the checks.

**The solver is the risk of this chapter** (CLAUDE.md, checks). Every flag nobody asks about doubles all states. All times are on the 15-minute ticks and only waiting moves the clock (walking costs nothing,
provisional: check by playing whether it feels right). Flavour is a look, not a moment; what no longer matters is forgotten overnight (`Halcyon.nights[day].passes`). Each side story is a thread of its own, solved alone
with `--set off_main,know_meeting,off_<the others>`; a new one needs its name in `{ solo }` (game/halcyon.js) and in THREADS in tools/check.sh, and no flag shared with another. What threads do to each other only playing finds.
- All the checks: `sh tools/check.sh` (about 10 minutes, with touch: run it in the background and change nothing while it runs). Now: validate 0 errors (11 known warnings), prologue 53556 states, Chapter 1's main thread 44960, the side stories 5000 to 13000 each, no soft-locks, every state has a hint, all ways clicked.
- The ways it clicks are tools/paths/kapitel1_*.json (plain lists of moves; their generators were scratch files in build/). A new stop of the clock changes how many `wait`s a way needs: when a way fails with "nothing to click", count them first. Actors are `@id`.
- The tools: `node tools/solve-act.mjs kapitel1 --full --set a,b [--json path.json]`, `node lib/cutaway/tools/play.mjs index.html --act kapitel1 --path p.json [--shots dir]`.
- Times off the 15-minute grid are safe only inside a chain nothing branches on: the end in cam31 (22:55, 23:02, 23:03 and so on) is one, and its hold (game/kapitel1.js) lets only the scene move the clock.
- A prologue flag or camera that opens in Chapter 1 needs `day=1`; a chapter's camera needs `day>1` in its `if`, or it is on the prologue's map (the solver shows it: the prologue's states jump).

Decided, keep to it (story §10a, §10b, kapitel0-design §5, style guide §4, §6):
- No sounds in the float and the lift, only music. The hall has its hum; shot 4 is silent. Shot 2 has no words: the marking is enough.
- **Lull is a pale blue point of light behind the ear that pulses**, nothing else (no patch, no pads, no light on the temple). **The implant** sits
  at the same place, smaller, and is always cyan: the point lights only when she tags, her brackets are cyan, in 2088 too; nothing on the small
  street figures. The cyan line on the cheek is the title's alone. Nothing else behind an ear glows. Juno was allowed to keep the implant because taking it out would have cost more; it isn't illegal.
- **Lull is the observer implant made cheap** (the waking taken out, so one protocol). The eye and JUNO. are only in Juno's eye. Juno is not the
  only one left with the implant: very few, scattered, some on Lull or Sinkers. Her observer handbook (protocol OBS-4, the wake layer) is in the CACHE from the first evening; the firmware's id in Ines's logs comes in Chapter 3.
- **The data wallet** (never "Laufwerk") holds Ines's encrypted logs, there is one; **the stick** in the dryer is its key, and the meeting is on the
  ticket, not the stick. **Kessler** works until he has given Varga the ring, then goes under. **WREN** is Halcyon: if Juno sold, the Quiet knows her
  at once; if she refused, it has to search. WREN pays 250 ahead and 1250 on sending (1500 if the advance went back), 750 for the live feed. **Ashe** looks into the camera, a disturbance runs through the picture, the feed is lost; nothing more dramatic.
- **EVI is always in the bag;** that is only why she is there in every scene, bottom right she stands for the help. Leave that and her lines as they are.
- **One building, one plan:** a lift and stairs stand at the same place on every floor. The lift never runs ("supposedly on Tuesdays" stays as a joke). No stairs go on to the roof: out of the window and up the outside ladder.
- Words: the app is **GLASS**; signs in art are English, planned ones too (GLASSER LIES, SUDS & SPIN). Red and yellow keep their meanings: the only
  saturated yellow is Juno's; the people in 2088 wear Halcyon's grey. Sable speaks in #ff4fd3 and wears magenta, Teo #ffa040; the voices DIE HÄNDLERIN and DIE SCHWESTER keep their own colours.
- Exactly two talking animals: Ratz (the cable rat, 26 px, a small dog) and Tinte (the pump octopus, nearly 40, has gills, no longer made for open water). Do not mix up Ratz and Ashe.

Handy, found the hard way:
- A block picture goes in art/mock/ch1_blocks.px.js (assets/mock.js, `sh tools/build_art.sh mock`; its names must fit the `--only` list in tools/build_art.sh). Positions in game/places.js. Feeds need light floors, or the dark figures vanish.
- An item given in an act's `start` needs `to: "juno"`: nobody is active yet.
- A moment nobody watches, as a clock's stop anywhere: `{ room: "deck", day, from, to, if: "~never", unseen: [...] }`, its window one tick before. Without `if` it counts as seen when Juno is on the deck, and its script never runs.
- At the screen's bottom (y 150 and on) a hotspot can't be clicked by the tools: the bag's bar is there.
- A shot the game draws itself is a room with `float: "<shot>"` and a drawer in Halcyon.intro.shots; the action
  { float: [from, to], ms, ease } moves its progress. A room bigger than the screen needs `size` or the camera won't move.
  Non-whole scaling ruins pixel art: draw what must grow from rectangles, in metres, so it stays crisp.
- A prop's loop stops by playing it once: Cutaway.scene.playProp(id, {}) (it runs out, then holds its last frame).
- Screenshots of a moment, with ?manual:
  `node lib/cutaway/tools/shot.mjs index.html --size 960x540 --query "manual&act=kapitel1" --eval "const go=async(ms)=>{for(let i=0;i<ms/50;i++){Cutaway.clock.advance(50);await new Promise(r=>setTimeout(r,0));}}; await go(3000); Cutaway.scene.load('cam21'); await go(1500); Cutaway.script.run([{time:'19:00'}]); await go(3000)" --out build/shots/x3.png --buffer build/shots/1x.png`
  Never await a room load or a transition under ?manual: the clock is frozen and it hangs. Start them, then step.
- A close look at a kit prop: `node .claude/skills/claude-pxl/bin/pxl.js shot art/rooms/hall.px.js hall_d31 --frames 0 --out build/shot`.
  Look close: I find what the 3x picture hides.
- Talks go through `Halcyon.talkTree`: a level with more than three topics throws when the game loads. tools/paths/kapitel1_dach.json walks every topic of both talks with its `choices`: a topic added or moved changes those numbers.
- A menu's first key is where a dialogue starts: build a dialogue's nodes with its start first (it happened with talkTree, and the checks didn't see it: look at the menu itself).
- Long heredocs with apostrophes break in the Bash tool here: write an edit script to build/ with the Write tool and run
  it, or use Edit. Read a file's line endings first: many are CRLF.

**Still open for me:** why Bao has one arm. The Rain Reader's warm drop of the machine (the Crown gives no water back, and the Ruhekern's servers are there, so it proves nothing). Everything else in the talks stands (story §10b), to be judged by playing.

Open points: in the mock, the chat's replies keep gaps in their numbers ([1], then [4]) where one is hidden; the REC button shows in all of Chapter 1 and only does something in the scene in cam31; the fitter stands on the street, without his scaffold; street scenes can't move the clock, so going out and waiting
mean going back to the deck (proposal: the city's scenes move it themselves). Small things I may still want in the hall (the hands hardly show at 1x, the coat is a little stiff, the room's edge and the black
beyond it in the corner of the last picture, the chair back's top is rather straight in shot 2); the flat's empty front floor; the steam fx in the street
was replaced by baked plumes (check the engine's steam fx is visible somewhere or drop it); the iso tile editor (E-e) to be
decided when rooms need re-arranging often; dialogue v2 and the inner voices (E-d) come before Chapter 1's final texts, not yet; CJK fallback in the engine; docs/walkthroughs/ (other games' walkthroughs,
reference only) is untracked: gitignore it or keep it out.

How I like to work:
- Small steps; for each, show screenshots and tell me which files to look at. Be honest about what you only saw as stills, and about what the checks don't cover.
- For art, block sketches or a mockup first, my approval, then paint. Before painting, read the style guide
  and .claude/skills/claude-pxl/SKILL.md. Big paintings can go to a subagent with an exact brief; check its
  result yourself.
- After every step: sh tools/check.sh, then commit with a descriptive message. No Claude/AI attribution in commits.
- Engine changes: in its own repo, generic, node tests/run.mjs and npm run check, commit there, then
  sh tools/sync-engine.sh "B:/Github_my/cutaway" here.
- Ask me when a decision is mine (story, look, names); otherwise decide and say so. When I ask why something is the way
  it is, check the docs before you answer: I catch contradictions.

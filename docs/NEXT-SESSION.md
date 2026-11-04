# Prompt for the next session

Copy everything below the line into a new session.

---

We're continuing work on "Glass Sister", our cyberpunk point-and-click adventure, in B:\Github_my\cyberpunk
(engine: Cutaway.js in B:\Github_my\cutaway\). Read CLAUDE.md first; it lists the docs, the commands and
the checks. Talk to me in German (the docs are German, code comments English).

Where we are (everything is committed; the engine copy is at Cutaway.js e2bc1d6, unchanged this time):
- The prologue plays from the flat to its end card. In the JUNO. moment the implant's cyan brackets now lie round the
  ad screen (the action { implant_mark }, game/screens.js) and Juno says "Das war nicht auf dem Schirm. Das war in
  meinem Auge."
- **The intro "Die letzte Schicht" is half done** (docs/kapitel0-design.md §5 has the table of shots, decided). It is
  the sequence "intro" in game/intro.js, in the game (Cutaway.start({ intro }): by itself on the first start, and
  "Intro ansehen" in the menu). Done, with my notes worked in: A1, A2, C, 1, 2, 3, 4. Its shot marks: a1, a2, c, hall, desk,
  announce, out.
  - A1/A2 the float over the lit sea along a dark channel, the camera masts in the water, Halcyon growing ahead
    (game/intro_sea.js, art/intro/float.px.js); C the tower, in through a green window (game/intro_tower.js);
    1 the hall at the street's scale, the camera drifting to Juno's desk (art/rooms/hall.map.js, art/kit/hall.kit.px.js,
    game/intro_hall.js); 2 Juno close behind her chair's high back, marking a man (art/intro/desk.px.js,
    game/intro_desk.js); 3 the announcement; 4 the screens going out, whoever's monitor is out stops typing, Juno's
    goes out last in the close-up, her face from the title as a raster in the dead glass
    (art/intro/juno_face.data.js).
  - The look so far: docs/rooms/intro_float_a1_x3.png, intro_float_a2_x3.png, intro_tower_c2_x3.png, hall_juno_x3.png,
    intro_desk_x3.png, intro_announce_x3.png, intro_out_rows_x3.png, intro_out_face_x3.png.
- Checks now: validate 0 errors (3 known warnings), solve --full no soft-locks, every state has a hint, play.mjs all
  passed. They take a few minutes together: give them a long timeout.

**Next: the rest of the intro.** After shot 4 the sequence now just fades out. Its storyboard in blocks is approved:
art/test/intro_blocks.px.js, docs/rooms/intro_blocks.png, docs/rooms/intro_blocks_opening_x2.png,
docs/characters/juno2088_blocks_x6.png (older than the decisions below: where they differ, the decisions win; the
blocks still show cables). In this order, small steps, a screenshot and my look at each:
1. **T is gone** (2026-11-04): the sentence about the implant moved to the first tag in the prologue (game/cast.js, Kessler).
2. **D**, the ride down the Transitachse, the game's first side view: a glass lift going down, the rings rushing up
   past it fast, ~10 s, **no words and no sounds, the music alone**. It starts close on the box in her arms (a cactus,
   a cup, the data stick), the stick's label EVAL-7 // DELETE readable for about a second, then the
   whole lift: pixel art doesn't zoom, so a painted close-up and a cut, or whatever you find looks better; say which.
   - **Juno is today's Juno** (decided 2026-11-04): her street sprite with its breath and blink, the hood down, in the
     yellow coat that hung over her chair in the hall; the box over it (art/intro/ride.px.js: intro_d_juno). So the coat
     is not in the box: a cactus, a cup, the stick. Blocks: art/test/intro_d_blocks.px.js, docs/rooms/intro_d_blocks.png.
   - **The melody**, in game/music.js: slow, melancholic, haunting (the instruments of "memory" and "opening" are there:
     br_brass, br_ribbon, br_bells, br_pedal). "opening" faded out in shot 4. Render it with
     lib/cutaway/tools/render-music.mjs into build/music/ for me to listen to; you can't judge it yourself.
3. **6**, today, 2091-11-03 21:30: a phosphor feed on the CRT, the home-built deck, her hand on the mouse in the yellow
   sleeve. The deck stays as it is, CRT and mouse, on purpose.
4. **7**, the title screen with the Glass Sister logo (the splash), then the menu. On the first start the engine
   already goes on to the splash after the sequence; "Intro ansehen" comes back to the menu without it
   (acts.js watchIntro): check how that feels and ask me.
5. **Sound on the first start:** a browser allows sound only after a click, so the intro's first playing is silent
   until then. The engine's `gate` would solve it, but it shows on every start, a second click beside the splash's
   prompt. Show it only when the intro will play (Cutaway.settings.seen("intro")), or find something better.
6. Then the whole intro's length and pace: it was planned at ~1.5 min, and by the timings in game/intro.js it takes
   about that already up to shot 4. You only see stills, so ask me how it feels in real time.

Decided in the last session, keep to it (story §10a, kapitel0-design §5, style guide §6):
- No sounds in the float and the lift, only music. The hall has its hum; shot 4 is silent.
- Shot 2 has no words: the marking is enough. No cables anywhere: the implant lays its tags over what the eye sees.
- **The implant** sits behind the ear, where Teo wears his Lull patch on the title: a cyan point, seen only with the
  hood down; nothing on the small street figures. The cyan line on the cheek is the title's alone. The Lull patch is a
  plaster on the skin and must always read as one, never as the implant.
- **Lull is the observer implant made cheap** (the waking taken out, so one protocol). The eye and JUNO. are only in
  Juno's eye. The scenes that tell the player are planned, not built: her observer handbook on the deck, a Lull user
  as an unknown link in her overlay (Chapter 1 or 2), the firmware's id in Ines's logs (Chapter 3).
- The lens on a mast (the old shot B) stays out; the masts in the water took its place.
- Red and yellow keep their meanings: the only saturated yellow is Juno's; the people in 2088 wear Halcyon's grey.

Handy, found the hard way:
- A shot the game draws itself is a room with `float: "<shot>"` and a drawer in Halcyon.intro.shots; the action
  { float: [from, to], ms, ease } moves its progress. A room bigger than the screen needs `size` or the camera won't move.
  Non-whole scaling ruins pixel art: draw what must grow from rectangles, in metres, so it stays crisp.
- A prop's loop stops by playing it once: Cutaway.scene.playProp(id, {}) (it runs out, then holds its last frame).
- Screenshots of a moment, with ?manual:
  `node lib/cutaway/tools/shot.mjs index.html --size 960x540 --query "manual&act=prolog" --eval "await Cutaway.debug.settle(); const go=async(ms)=>{for(let i=0;i<ms/50;i++){Cutaway.clock.advance(50);await new Promise(r=>setTimeout(r,0));}}; Cutaway.sequence.play('intro', {from: 'desk'}); await go(7000)" --out build/shots/x3.png --buffer build/shots/1x.png`
  Never await a room load or a transition under ?manual: the clock is frozen and it hangs. Start them, then step.
- A close look at a kit prop: `node .claude/skills/claude-pxl/bin/pxl.js shot art/rooms/hall.px.js hall_d31 --frames 0 --out build/shot`.
  Look close: I find what the 3x picture hides.
- Long heredocs with apostrophes break in the Bash tool here: write an edit script to build/ with the Write tool and run
  it, or use Edit.

Open points, beyond the intro: small things I may still want in the hall (the hands hardly show at 1x, the coat is a
little stiff, the room's edge and the black beyond it in the corner of the last picture, the chair back's top is rather
straight in shot 2); the post-it "ESSEN!!" painted in German in the flat (make it language-free or an overlay); the
flat's empty front floor; the steam fx in the street was replaced by baked plumes (check the engine's steam fx is
visible somewhere or drop it); the iso tile editor (E-e) is postponed to Chapter 1, to be decided when rooms need
re-arranging often; dialogue v2 (E-d) later; CJK fallback in the engine; docs/walkthroughs/ (other games' walkthroughs,
reference only) is untracked: gitignore it or keep it out. After the intro: Chapter 1 (docs/kapitel1-design.md, PLAN H4).

How I like to work:
- Small steps; for each, show screenshots and tell me which files to look at. Be honest about what you only saw as stills.
- For art, block sketches or a mockup first, my approval, then paint. Before painting, read the style guide
  and .claude/skills/claude-pxl/SKILL.md. Big paintings can go to a subagent with an exact brief; check its
  result yourself.
- After every step: validate (0 errors), solve --full (no soft-locks), play.mjs (all passed), then commit with
  a descriptive message. No Claude/AI attribution in commits.
- Engine changes: in its own repo, generic, node tests/run.mjs and npm run check, commit there, then
  sh tools/sync-engine.sh "B:/Github_my/cutaway" here.
- Ask me when a decision is mine (story, look, names); otherwise decide and say so. When I ask why something is the way
  it is, check the docs before you answer: I catch contradictions.

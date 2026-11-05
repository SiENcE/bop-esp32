# Prompt for the next session

Copy everything below the line into a new session.

---

We're continuing work on "Glass Sister", our cyberpunk point-and-click adventure, in B:\Github_my\cyberpunk
(engine: Cutaway.js in B:\Github_my\cutaway\). Read CLAUDE.md first; it lists the docs, the commands and
the checks. Talk to me in German (the docs are German, code comments English).

Where we are (everything is committed; the engine copy is at Cutaway.js 5f165f8):
- The prologue plays from the flat to its end card. Juno's first tag (Kessler in cam03) now explains the implant: "Die
  Klammern macht nicht das Deck, die macht mein Implantat. Das durften wir behalten, damals. Sie sagten, das Herausnehmen
  kostet mehr." (game/cast.js).
- **The intro "Die letzte Schicht" plays whole** (docs/kapitel0-design.md §5), 1:46 by its timings. It is the sequence
  "intro" in game/intro.js; its shot marks: a1, a2, c, hall, desk, announce, out, d, today; then the title screen.
  - A1/A2 the float (game/intro_sea.js, art/intro/float.px.js); C the tower (game/intro_tower.js); 1 the hall
    (art/rooms/hall.map.js, game/intro_hall.js); 2 Juno close (art/intro/desk.px.js, game/intro_desk.js); 3 the
    announcement; 4 the screens going out; D the ride, the box close, a cut, then the lift (game/intro_ride.js,
    art/intro/ride.px.js, the melody "descent" in game/music.js); 6 today at the deck (game/intro_today.js,
    art/intro/today.px.js). The sentence about the implant is not in the intro any more.
  - **Juno in D is today's Juno**: her street sprite with its breath and blink, the hood down, in the yellow coat that
    hung over her chair in the hall (intro_d_juno), with a box seen flatter than 2:1 and her arm bent to hold it.
  - The look: docs/rooms/intro_float_a1_x3.png, intro_float_a2_x3.png, intro_tower_c2_x3.png, hall_juno_x3.png,
    intro_desk_x3.png, intro_announce_x3.png, intro_out_rows_x3.png, intro_out_face_x3.png, intro_d_close_x3.png,
    intro_d_lift_mid_x3.png, intro_d_lift_low_x3.png, intro_today_x3.png.
- Sound on the first start: the gate shows on black only when the intro will play (gate: { introOnly }, engine 79d6952).
- Checks now: validate 0 errors (3 known warnings), solve --full no soft-locks, every state has a hint, play.mjs all
  passed; play.mjs --intro plays the intro through as well. They take a few minutes together: give them a long timeout.

**Next:** my look at the whole intro in real time (you only see stills): its length and pace, the ride's speed, and what
"Intro ansehen" should end on (it comes back to the menu without the splash, acts.js watchIntro). After the intro: Chapter 1
(docs/kapitel1-design.md, PLAN H4).

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

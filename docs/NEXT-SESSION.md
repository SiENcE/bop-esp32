# Prompt for the next session

Copy everything below the line into a new session.

---

We're continuing work on "Glass Sister", our cyberpunk point-and-click adventure, in B:\Github_my\cyberpunk
(engine: Cutaway.js in B:\Github_my\cutaway\). Read CLAUDE.md first; it lists the docs, the commands and
the checks. Talk to me in German (the docs are German, code comments English).

Where we are (everything is committed; the engine copy is at Cutaway.js 5f165f8):
- **The intro "Die letzte Schicht" is done and approved** (docs/kapitel0-design.md §5), about 1:45. It is the sequence "intro" in
  game/intro.js; its shot marks: a1, a2, c, hall, desk, announce, out, d. It ends on the ride down in the lift (game/intro_ride.js,
  art/intro/ride.px.js, the melody "descent"), then the title screen; "Intro ansehen" comes back to the menu without it. Where a browser
  refuses sound, the first start asks on black (gate: { introOnly }, engine 79d6952).
- **The prologue plays from the flat to its end card**, on Tuesday 2091-11-06. Juno's first tag (Kessler in cam03, also through the buffer)
  explains the implant. Kessler goes by the noodle machine after his shift, which Chapter 1 builds on.
- **The Kessel Block has one plan:** the lift at the same place on the 14th floor and in the lobby (art/kit/kessel_lift.kit.px.js), the
  lobby's flight rising to where the landing's stairs begin. On the landing Frau Haldane's door is in the left wall, the bin bags stand
  in front of the lift, Halcyon's camera hangs in the corner.
- **The story to read, up to and including Chapter 1:** docs/story-lesefassung.md, and at its end what is still open. Every decision so far is
  in story §10, §10a, §10b. Chapter 1's design (docs/kapitel1-design.md) follows them; none of Chapter 1 is built.
- Checks now: validate 0 errors (3 known warnings), solve --full no soft-locks, every state has a hint, play.mjs all
  passed; play.mjs --intro plays the intro through as well. They take a few minutes together: give them a long timeout.

**Next: Chapter 1** (docs/kapitel1-design.md, PLAN H4). Before building, settle with me: the open points at the end of
docs/story-lesefassung.md, and the proposal for how Chapter 2 gets at the data (story §7, Chapter 2's end: there is one wallet, Lantern has it,
he opens it with the stick and sends it out, nobody believes him, only Juno can lay it beside her cameras). Propose an order of small steps
for Chapter 1 and show me blocks first; what the game needs is in kapitel1-design §13.

Decided, keep to it (story §10a, §10b, kapitel0-design §5, style guide §4, §6):
- No sounds in the float and the lift, only music. The hall has its hum; shot 4 is silent. Shot 2 has no words: the marking is enough.
- **Lull is a pale blue point of light behind the ear that pulses**, nothing else (no patch, no pads, no light on the temple). **The implant** sits
  at the same place, smaller, and is always cyan: the point lights only when she tags, her brackets are cyan, in 2088 too; nothing on the small
  street figures. The cyan line on the cheek is the title's alone. Nothing else behind an ear glows.
- **Lull is the observer implant made cheap** (the waking taken out, so one protocol). The eye and JUNO. are only in Juno's eye. Juno is not the
  only one left with the implant: very few, scattered, some on Lull or Sinkers. The scenes that tell the player are planned, not built: her
  observer handbook in the CACHE from Chapter 1's first evening, a Lull user dozing in cam21's queue as `UNKNOWN LINK` in her overlay (kapitel1 §7), the firmware's id in Ines's logs (Chapter 3).
- **The data wallet** (never "Laufwerk") holds Ines's encrypted logs, there is one; **the stick** in the dryer is its key, and the meeting is on the
  ticket, not the stick. **Kessler** works until he has given Varga the ring, then goes under. **WREN** is Halcyon: if Juno sold, the Quiet knows her
  at once; if she refused, it has to search. **Rask** looks into the camera, a disturbance runs through the picture, the feed is lost; nothing more dramatic.
- **EVI is always in the bag;** that is only why she is there in every scene, bottom right she stands for the help. Leave that and her lines as they are.
- **One building, one plan:** a lift and stairs stand at the same place on every floor. The lift never runs ("supposedly on Tuesdays" stays as a joke).
- Words: the app is **GLASS**; signs in art are English, planned ones too (GLASSER LIES, SUDS & SPIN). Red and yellow keep their meanings: the only
  saturated yellow is Juno's; the people in 2088 wear Halcyon's grey.

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

Open points: small things I may still want in the hall (the hands hardly show at 1x, the coat is a little stiff, the room's edge and the black
beyond it in the corner of the last picture, the chair back's top is rather straight in shot 2); the flat's empty front floor; the steam fx in the street
was replaced by baked plumes (check the engine's steam fx is visible somewhere or drop it); the iso tile editor (E-e) is postponed to Chapter 1, to be
decided when rooms need re-arranging often; dialogue v2 (E-d) later; CJK fallback in the engine; docs/walkthroughs/ (other games' walkthroughs,
reference only) is untracked: gitignore it or keep it out.

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

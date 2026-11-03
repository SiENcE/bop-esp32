# Style mockups

Open `index.html` to see all of them (animated GIFs where built). The brief is `BRIEF.md`; the
sources are `art/mockups/mock_*.px.js`. Each has a 1x `.png`, a 3x `_x3.png` and a 3x `_x3.gif`.

**Status: decided (2026-11-03): C (isometric) for the world, E (hacked CCTV feed) for hacking and
observation.** The rules are in `docs/style-guide.md`.

| | Style | Strengths | Weaknesses | Engine fit |
|---|---|---|---|---|
| A | Dreamweb-like top-down, HUD frame | the Dreamweb mood, the big portrait, cheap rooms | the world gets half the screen; Juno is a yellow dot; no faces in the room | easy: flat walk plane, 4-way 12–16 px actors; the portrait needs expressions |
| B | Cutaway side stage, neon noir | the clearest; wide street; reflections and neon carry the mood; cheap rooms | lamps need tuning per room; wet reflections need an engine pass | best: what Cutaway already does (side rooms, depth scale, lamps, rain) |
| C | Isometric | the richest picture; every wall and the floor at once | every prop drawn in iso; 4–8 direction walk cycles; occlusion masks | good: polygon walk areas follow the 2:1 lines; no depth scaling |
| D | Megablock cross-section | a whole building alive at once; each cell lit apart | ~21 px characters; the street gets a strip | needs a vertically scrolling room, floors linked by stairs |
| E | Hacked CCTV feed | the strongest concept: camera switching as rooms and puzzles | murky; the overlay does the readability work | needs a per-camera perspective walk area, a scale curve, an overlay layer |

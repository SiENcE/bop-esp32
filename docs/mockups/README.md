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

## F: the deck as a computer (2026-11-04, for H2b)

`mock_f_deck_{desktop,chat,clip,evi}.png` (1x) and `_x3.png`, source `art/mockups/mock_f_deck.px.js`. Written
in the game's own fonts (`art/lib/text.js` draws the glyphs of `game/glyphs.js`, the same the game uses), so
what fits here fits in the game. Design: `docs/kapitel0-design.md` §2.

- **desktop**: the old photo as wallpaper (Juno and Teo as kids on a roof in the rain, dimmed), the eight apps
  in two columns of four (24x24 icons, 3x5 labels, a magenta dot for "new"), two files, the header (deck,
  unread, time, date, chits, WARTEN, ZURÜCK), a notification card sliding in, EVI in her corner.
- **chat**: one window (240x137) with the skin's frame; contacts with status (`online`, `abwesend`,
  `schläft`, `Werbung`), Frau Kessler's thread with the photo, "gelesen", Juno's replies as numbered choices
  in her yellow, ANHANG.
- **clip**: the clip editor: the picture (phosphor, the implant's tags), where/when/how long/who, the
  timeline with the moments and the people, the cut in brackets, the playhead, the tools (SCHNEIDEN now;
  ANONYMISIEREN, PRÜFEN, MONTIEREN locked until later chapters).
- **evi**: her eight states at 1x (neutral, the six faces, asleep) and the six faces at 2x.
- EVI's lines on the deck sit in the strip under the window, beside her (a window covers the space above
  her).

## Später dazugekommen

Diese Bilder entstanden nach A bis F, jedes für eine einzelne Frage; die Entscheidung steht jeweils im genannten Dokument.

| Datei | Wozu | Quelle | Entschieden |
|---|---|---|---|
| `deck_photo_x3.png`, `deck_wallpaper_x3.png` (und `.gif`) | das alte Foto von Juno und Teo als Kinder auf dem Dach, als Bild und als gedimmter Hintergrund des Decks, als ruhige Schleife | `art/ui/deck_wallpaper.px.js` | 2026-11-04, `docs/kapitel0-design.md` §2 |
| `game_deck_desktop_x3.png`, `game_deck_glas_x3.png`, `game_deck_clip_x3.png`, `game_deck_cut_x3.png`, `game_evi_boot_x3.png` | Aufnahmen aus dem Spiel, nachdem das Deck nach Mockup F gebaut war: Desktop, GLASS, Clip-Editor, der Schnitt, EVIs Start | das Spiel (H2b) | 2026-11-04 |
| `mock_juno_brackets_x3.png` | die Ecken des Implantats um den Werbeschirm im JUNO.-Moment | Mockup | 2026-11-04 |
| `nagiwa_logo_x4.png` | wie der Name der Stadt und des Konzerns geschrieben werden kann; entschieden ist Nagi·wa | `art/mockups/nagiwa_logo.px.js` | 2026-11-07, `docs/story.md` §10 |
| `mock_g_time.png` | der Zeitstempel des Implantats im Straßenmodus, drei Varianten; gewählt ist A, klein und gedämpft oben links | Mockup | 2026-11-08, `docs/style-guide.md` §8a |
| `mock_g_ringe_a_x3.png`, `mock_g_ringe_b_x3.png` | der Blick vom Dach nach oben zu den Ringen: A genau entlang der Hochachse, B schräg von Junos Platz aus | Mockup | im Spiel steht B, `docs/kapitel1-design.md` („Die Stadt“) |
| `mock_g_traum_raum_x3`, `mock_g_traum_tunnel_x3`, `mock_g_traum_glyphen_x3`, in der zweiten Runde `mock_g_traum_teo_x3` und `mock_g_traum_station_x3` (`.gif`, `.png`) | der Traum, der dritte Modus von Kapitel 3: A der Datenraum mit dem Auge als Sonne am Horizont, B der Tunnel aus Kamerabildern, C CAM 33 aus dem fallenden Takt gebaut; dazu, was Juno in einem Bild findet: Teo von hinten auf dem Rand über dem Schacht, Juno von den Schläfern markiert, und die Station im Fünften mit Rayas Bett | `art/mockups/mock_g_traum.px.js` | 2026-11-24: alle drei zusammen, als die drei Zustände des Traums, `docs/style-guide.md` §9a |
| `zh_deck_compare_x2.png` | ein Test, wie das Deck mit chinesischen Zeichen aussähe (links Deutsch, rechts Chinesisch) | `art/test/cjk_deck.px.js` | nur ein Test, `docs/ideas/chinesisch.md` |


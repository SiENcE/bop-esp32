# Glass Sister: art and interface style guide

Status: **decided** (2026-11-03). Every new piece of game art and interface follows this document.
Before drawing, also read the pxl skill's `.claude/skills/claude-pxl/SKILL.md`.

**Reference images:**
- the world (street mode): `docs/mockups/mock_c_iso_x3.png` (animated: `_x3.gif`), source `art/mockups/mock_c_iso.px.js`
- the cameras (feed mode): `docs/mockups/mock_e_cctv_x3.png` (animated: `_x3.gif`), source `art/mockups/mock_e_cctv.px.js`

When in doubt, match these two.

## 1. The style in one paragraph

A dark, rain-soaked cyberpunk city in **isometric pixel art** (2:1, like the 90s cyber RPGs): night
blues, wet paving that mirrors the neon, hot magenta signs, warm amber windows, cold cyan screens.
The player sees the world in two ways. In **street mode** Juno walks the city in full-colour iso. In
**feed mode** she looks through surveillance cameras she has hijacked: a green phosphor duotone with
scanlines and a camera display, where the only colour is her implant's overlay marking people and
things. Watching is her job, so the feed is half of the game and must be as readable as the street.
The tone is adult, quiet and morally grey: the city is grim, but every scene has small signs of
people living in it.

## 2. The game this serves

These points from the premise shape the art (the story isn't written yet):

- **Juno is a freelance hacker and information broker.** Her day job: watch people through the
  city's cameras, pick up information (affairs, debts, deals, passwords) and sell it on the black
  market.
- **The daily loop:**
  - work at the deck in her apartment (feed mode);
  - go out for food and to buy or sell (street mode: the noodle bar, the market, the fence);
  - come home.
- **The turn:** one night a feed shows a serious crime. She has the footage, and she has to decide
  what to do with it. The investigation reveals a much larger secret, slowly.
- **What that means for the art:**
  - **The same places are seen in both modes.** A street Juno walks through has a camera over it, and a camera
    Juno watches covers a place she can walk to. Plan rooms and cameras together (§9).
  - **Places change over the course of the game.** Day and night, the same flat in a different state,
    a crime scene sealed off later. Draw rooms so their states are swappable props, not repaints.
  - **People must be recognisable from far away and from above.** Each person needs a clear
    silhouette and a signature colour accent, because Juno identifies and follows them across cameras.

## 3. Technical frame

| | |
|---|---|
| Native resolution | **320x180** (16:9), full screen, no interface bar |
| Output | whole-number scaling only: x4 = 1280x720, x6 = 1920x1080; nearest-neighbour |
| Positions | whole pixels only |
| Animation clock | durations on a 100 ms grid; scene loops of **12 frames** (1.2 s), 8 or 16 where it fits better |
| Engine | Cutaway.js (`B:\Github_my\cutaway\`), verb-less: left click acts, right click looks |

## 4. Street mode: the isometric world

### Projection

- **2:1 dimetric, fixed camera, no rotation.** Every floor edge steps 2 px across and 1 px down.
  Vertical edges are vertical.
- **Coordinates** (as in `mock_c_iso.px.js`):
  - `u` runs along the right-hand wall, `v` along the left-hand wall, `h` straight up.
  - `P(u, v, h) = [CX + 2u - 2v, CY + u + v - h]`, where `(CX, CY)` is the back corner at the
    foot of the walls.
- **Scale** (decided 2026-11-04 from the height test, `docs/rooms/iso_height_test_x2.png`, its panel 3;
  before it heights were 18 px per meter, and rooms looked low: a camera true to the 2:1 floor would draw
  39 px, so 30 is a compromise between that and a room that still fits the screen):

  | | |
  |---|---|
  | 1 m of floor | 16 units of u or v, so a 1 m floor tile is a 32x16 diamond |
  | 1 m of height | **30 px** |
  | Juno (1.68 m) | ~50 px |
  | a door (2.0 m) | 60 px |
  | a ceiling (2.6 m) | 78 px |
  | a counter or table top (0.75–0.9 m) | 23–27 px |

  Art drawn at the old scale (Juno, the flat, `art/lib/iso.js`) is redrawn at this one (PLAN H1c).
- **Rooms are built from a kit** (decided 2026-11-04, `docs/ideas/iso-tiles.md`): a room's source is a map
  (floor cells, walls on cell edges with their openings, props from the kit, lights); pxl bakes it with
  the light into the picture and the props, and measures the layout. Unique details stay hand-painted props.
- **Other views for variety** (decided 2026-11-04): most of the city is iso, but a scene may be drawn as a
  **side view** (a stage, like mockup B: a corridor, a lift, a bridge, a ledge) where that tells it
  better, and **top-down** only where it truly fits (a map, a look down a shaft). They keep the palette,
  the light and the interface of street mode; each needs its own walk views for Juno (side: left and
  right).
  The first top-down view (2026-11-04): the Kessel Block's stairwell from the 14th floor's rail, a
  close-up (`look_shaft`, `art/ui/looks.px.js`): street mode's close-ups (`look_*`) show at their own size
  in the interface's frame over the room, the lines in the bottom bar while they show; its depth is
  drawn compressed, as through a long lens, so the floors below stay apart as rings.

- **One building, one plan** (decided 2026-11-05): a lift only goes up and down and stairs stack, so rooms on different floors of a building
  are laid over each other, the lift and the stairs at the same place on every floor (`kessel_14`, `kessel_lobby`).
- **Rooms are cutaways:**
  - Two walls stand at the back (left and right), meeting in a corner.
  - Walls nearer the camera are removed, or cut to a low stub (3–6 px) along the room's front
    edges, so the player always sees in.
  - Outside, the buildings are cut off by the screen's top edge.
- **Stage rule:** what matters stands against the back walls or on the floor in the middle. The
  front third of the screen is open floor for walking, puddles and the UI. Don't let tall props hide
  hotspots.
  Where a tall thing stands in front of where people walk (Bao's umbrella, a lamp post), it is
  see-through over whoever it hides: every other pixel of it over their figure, a checkerboard (decided
  2026-11-04; the engine's `seeThrough`, the map's prop option of the same name).
- **Rooms wider than the screen** scroll horizontally (and vertically if needed). Keep the back
  corner in view in single-screen rooms.

### Drawing rules

- **How walls are made:** draw them flat, as elevations (`flat()`, x along the wall, e up from the
  foot), and shear them onto the slope. Floors and boxes are painted from their iso coordinates
  (`isoBox`), so every edge is exact. Never hand-draw a sloped edge freehand.
- **Outlines:** characters and props get a 1 px outline in ink `k` `#0c0e1a`, never pure black.
  Walls, floors and large surfaces have no outline; their edges are the colour change.
- **2–4 tones per material.** Light comes from the scene's sources, not from a default sun.
- **Dithering** (ordered 4x4 Bayer) is allowed **only for light falloff**: light spilling from a
  window onto a wall (`halo()`), a lamp's pool on the floor, a searchlight's edge. Never on
  materials, never as texture.
- **Wet ground:**
  - Puddles mirror what is above them (`MIRROR` in the mockup): the neon lands in them where it should.
  - Dry paving takes a faint sheen of the nearest light's colour (`SHEEN`).
- **Rain:**
  - Falls diagonally (top-left to bottom-right), 1 px streaks of 3–5 px.
  - Splashes on the floor and on ledges.
  - Never inside rooms; there, rain is seen through the windows.
- **No filler noise.** Every mark has a cause: cables and their sag, stains under ACs, posters and
  their torn layers, graffiti, rust trails, cracks from an impact.
- **The city in the details:** ads selling sleep and happiness, a tired vending machine, laundry over
  a balcony, a cat. Each scene has at least one detail that tells a small story.

## 5. Colour

### The world palette (`mock_c_iso.px.js`)

| Role | Keys | Hex (dark to light) |
|---|---|---|
| ink (outlines) | `k` | `#0c0e1a` |
| night concrete, steel | `1`–`6` | `#131a2a` `#1a2337` `#232f47` `#2f3e5a` `#41547a` `#617aa0` |
| wet paving, asphalt | `e f z Z X` | `#0f151f` `#151d2b` `#1c2738` `#253349` `#32445f` |
| magenta neon | `n M m N` | `#3e1240` `#a8238a` `#ff4fd3` `#ffc0f2` |
| warm light (homes, food) | `O P Q R W` | `#552b1c` `#b0602a` `#eea040` `#ffd58a` `#fff4d8` |
| screen cyan (tech, the city's screens) | `c C v V` | `#123c4e` `#1f88a4` `#62def0` `#dafcff` |
| threat red | `r q` | `#7e1420` `#ff3a3a` |
| Juno's yellow | `j y Y` | `#9a7406` `#eec414` `#fff070` |
| skin (one of several) | `s S` | `#93583f` `#d79676` |
| floor in warm, magenta, cyan light | `a A` `i I` `t T` | `#2c2026` `#4a3026` / `#2a1636` `#46204e` / `#11303d` `#1b495a` |

### Colours mean something

The same meanings hold in both modes, so the feed's overlay feels like Juno's view of the street.

| Colour | Means | Rule |
|---|---|---|
| **yellow** | Juno | Her slicker is the only saturated yellow in the world. In the feed, yellow marks her. Other people never wear it. |
| **red** | threat, authority, the system's eye | drones, police lights, alarms, locked doors. In the feed: hostile tags. Use it sparingly. |
| **cyan** | technology, screens, things to use | ad screens, terminals, implants. In the feed: hotspot brackets. |
| **magenta** | commerce, nightlife, desire | signs, bars, ads, the black market's lure |
| **amber** | people, warmth, home, food | windows, lamps, cooking fires: where someone lives |

A location takes one key hue from this set and plays it against the night blues. Proposed:

| Location | Key | Accent |
|---|---|---|
| Juno's flat | screen cyan (her deck), dim | one amber lamp, magenta from the sign outside the window |
| Street, noodle bar | magenta | amber food light |
| Black market | amber, low and smoky | magenta neon, cyan from the stalls' screens |
| Corporate levels (later) | cold white and pale cyan, clean | almost no warm light at all |

## 6. Characters

- **Hand-drawn grids, never primitives**, outline `k`.
- **Sizes:**

  | Who | Height | Width |
  |---|---|---|
  | Juno | ~50 px (1.68 m at 30 px/m, §4) | about 20 px |
  | adults | 48–56 px | |
  | children | 30–45 px (Motte, 12, 1.45 m: 43 px) | |

  (Until H1c everything was drawn at 32 px; the old sprites are replaced as they are redrawn.)

  Heads are about 1/5 of the height. These are realistic proportions, unlike the Loonies' cartoon
  heads.
- **Facings:**
  - Two drawn views per pose: front three-quarter (facing down-right, SE) and back three-quarter
    (facing up-right, NE).
  - The engine mirrors them for SW and NW.
  - The anchor is bottom-centre, at the feet.
- **Animation:** walk 8 frames x 100 ms per view; idle 2–6 frames; talk 2 frames x 200 ms; one-shot
  actions (reach, type, hand over, crouch) as needed.
- **Silhouette first:** each person has a readable shape at their street size and a **signature accent** that
  survives in the feed's duotone as a value (a white cap, a long coat, a bright bag). Juno's hood is
  the model.
- **Juno Reyes** (placeholder name), freelance hacker and info broker:
  - **clothes:** a yellow hooded rain slicker (hood up outside, down indoors), black cargo trousers,
    heavy boots, a grey satchel on a strap (her deck lives in it);
  - **face and hair:** short black hair. The implant sits behind her ear, where Teo wears his Lull point (decided
    2026-11-04, story §10a): with the hood down, a cyan point there; under the hood nothing shows. The thin cyan line
    along her left cheekbone is the title's alone, a sign on that picture; nowhere else in the game (decided
    2026-11-04). Her portrait in the character index, which isn't in the game, wears it too (decided 2026-11-06).
    **Lull is a patch behind the ear, and the two must not be confused** (story §10b; changed 2026-11-06): it always looks like Teo's in the title picture, an oval pale disc with a darker rim and a brighter stripe (`art/ui/splash.px.js`, his profile in `docs/portraits/juno_teo_seite_front_x3.png`; from straight in front it can't be seen, so his frontal portrait has none, decided 2026-11-06). Lull is pale
    blue, the larger of the two, and pulses in a fixed beat, long, short, short, long, then a pause (`Nagiwa.lullBeat`; the puzzle of cam31 depends on it, decided 2026-11-05: every Lull point in the art has to follow it, those already painted still to be changed); the implant is a smaller cyan point that lights only when she tags. Nothing else
    behind an ear glows (Bao's hearing aid is plain grey). The title's Teo already shows it.
  - **face at 50 px** (decided 2026-11-04, variant B of `docs/characters/juno50_faces_x3.png`): eyes two
    pixels tall, a small mouth, the fringe showing under the hood; cute, but not a cartoon. The street
    sprites leave the implant out (decided 2026-11-04): the engine mirrors them for SW and NW, so a
    pixel on one cheek jumped to the other; it shows where she is drawn unmirrored (the title, close-ups).
- **Animal mods** (decided 2026-11-06, story §10c): the Lower Ninth alters bodies cheaply, and some people show an animal in one large part that says something about them (the Rain Reader's catfish barbels, Frau Imai's sloth fingers, the preacher's gecko eyes, the fitter's mole paws). They carry the silhouette; the rest stays a worn, ordinary person. Not everyone has one: Juno, Bao, Motte and Kessler don't. Still exactly two talking animals, Ratz and Tinte.
- **Faces are 2–4 px in the world.** Feeling comes from posture, from what people do and from the
  words.
  - **Close-up portraits (to try):** for important conversations, a bust portrait (about 64x64,
    hand-grid, the same palette) in a small panel at the side, with talk and 2–3 expression frames.
    Decide this after the first dialogue scene.

## 7. Light

The light has two parts: halos and pools baked into the art, and glows on top.

- **Lamps and spill are painted into the art:**
  - Windows, doors and signs throw dithered halos on the wall (`halo()`).
  - Pools of light are painted on the floor in the "floor in X light" tones (`a A`, `i I`, `t T`).
- **Glows on top** (`glow()`), from the mockup:

  | Key | r | strength |
  |---|---|---|
  | magenta neon `m` | 5 | 0.45 |
  | screen cyan `vV` | 4 | 0.30 |
  | warm `RW` | 4 | 0.35 |
  | threat red `q` | 3 | 0.60 |

- **In the engine:** a room's runtime `light` uses the same lamp positions and colours as the
  art. The ambient is dark: 0.30–0.45, bluish (`#8a9cff`-ish). Lamps flicker by frame (±10%), neon
  stutters now and then.
- **Juno always stays yellow.** Under strong coloured light she turns olive. Give each room a warm key
  near her walk area or limit how much the coloured lamps tint her (a lesson from mockup B).
- **Time of day (proposed):** the Lower Ninth never sees the sun.
  - **"Day"** is the city's grey-amber floodlights, ambient higher (0.5–0.6), fewer neon signs on.
  - **"Night"** is the neon.
  - Rain at both. The same room needs both versions only where the story goes there at both times.
- The interface is drawn after the light and is never lit.

## 8. Street mode interface

Reference: the UI in `mock_c_iso`.

- **No verb bar, full screen.** The left button does the sensible thing (walk, use, take, talk,
  open, go through). The right button looks.
- **Cursor:** a small arrow in pale cyan `V` with an ink outline. Over a hotspot a **label** appears
  next to it in the 3x5 capitals (`BROKEN AD SCREEN`), with an ink outline.
- **Name tag** at the bottom left: Juno's 16x16 head, her name in 5x7 `Y` and a role line in 3x5
  steel `6`.
- **Bag** at the bottom right: a satchel icon with the item count. A click slides up a translucent
  bar of item icons (about 20x14).
- **Implant button** beside the bag (to add): opens feed mode wherever Juno has a link. At the deck in
  her flat, the deck itself opens it.
- **Hint button:** EVI's head peeking out of the satchel (16 px), not a light bulb. EVI is the AI on
  Juno's deck (`docs/kapitel0-design.md` §2.2).
- **A window's list that runs over** (chat, CACHE, BUCH, NETZ) scrolls a pixel at a time, with its arrows and a thin bar between them at its right edge; both show only when there is more. GLASS's map is a grid (`kapitel1` positions in the `Nagiwa.cams` entries): one camera to a place, its label never reaches the next.
- **The deck** is a computer desktop, not a panel: icons (24x24, hand-drawn, ink outline, 3x5 label),
  one app window at a time, a 10 px header, notification cards sliding in at the top right (also over
  the feed and the street). Colours: steel `1`–`6` and cyan `cCvV`; EVI is the only rounded, soft
  shape on it. The second deck (Chapter 4) is patched together and amber. Mockup first:
  `docs/mockups/mock_f_deck`.
- **Speech:** subtitles above the speaker in the speaker's colour, 5x7 font, ink shadow, centred, two
  lines at most.

  | Speaker | Colour |
  |---|---|
  | Juno | `#fff070` |
  | EVI | `#8ef5d8` (mint: cyan's meaning, technology, but softer and greener than the tech cyan) |
  | Frau Kessler | `#eea040` (amber: home, warmth; decided 2026-11-04 with mockup F) |
  | Sable | `#ff4fd3` (magenta: commerce, the black market) |
  | Teo | `#ffa040` (the orange of his vest) |
  | the Rain Reader | `#a8c8e8` (pale water) |
  | Frau Imai | `#c8d8b0` (washed-out green) |
  | the preacher | `#d8c8a0` (coffee with too much milk) |
  | the half repair | `#b0c0b0` (a work coat left out in the rain) |

  Every other character gets a fixed colour when first drawn; add it here. Avoid red and cyan for
  anyone harmless (the meanings in §5). EVI is the exception, because she is technology.
- **Animals and mods:** the two talking animals (Ratz, a cable rat; Tinte, a pump octopus) and the
  tide-modded people (gills, glowing skin marks) follow the same character rules (§6). Their glowing
  marks are their signature accent in the feed: among the brightest values in the picture.
- **Languages:** German first, English later. Every line of dialogue, label and interface text comes
  from the engine's language files, never painted into art. The city's own signs and ads (`NAGI·WA:
  SLEEP BETTER`, `LUCKY STATIC`, `OUT OF ORDER`) are English in both versions and may be painted in.
  The fonts need the German letters (Ä Ö Ü ä ö ü ß).
  **The city's name** (decided 2026-11-07): `NAGI·WA` with its middle dot on signs and screens, and now and then only its two characters `凪輪` (art/lib/kanji.js, drawn by hand at 13x12: the deck's old photo of 2074, the TV in LUCKY STATIC); in text it is Nagi·wa. pxl's own small letters have no middle dot: there it is set by hand.
  **One exception (decided 2026-11-06): Jade Row.** Its tall neon signs carry Chinese glyphs, as art in every language; the shops' names there stay English (`OKONKWO`, `HOT SOUP`). Nothing the player needs may hang on reading a glyph.
- **Fonts** (`game/font.js`, §8a): `nagiwa`, our 5x7 terminal face, for speech, names, menus and
  titles; `hud`, 3x5 capitals, for labels, the OSD and small print. The mockups' art still writes with
  pxl's `lib/ui/font5x7.px.js`; game art that paints letters (signs are English and may be painted)
  can keep it, but anything the game writes at run time uses ours.

## 8a. Everything is cyberpunk

Decided 2026-11-03: **everything** in the game must look, sound, feel and taste like cyberpunk, the way
Shadowrun (SNES, Genesis, Dragonfall), Blade Runner, Snatcher, Ghost in the Shell, Read Only Memories
and Dreamweb do. Nothing may still look like the engine's defaults or like the Loonies (bevels, brass
rivets, wood, rounded friendly letters). When something new is made, it is checked against this list.

| Part | The rule | State |
|---|---|---|
| **Frames and panels** | chamfered corners (45° cuts, top left and bottom right), 1 px cyan lines on night steel, the light catching the cuts, faint scanlines (no magenta tick on the edge or the tab, in the menus and the deck's windows: it read as a broken pixel, the user's decision 2026-11-08), a readout set into the bottom line (`NINTH//SYS`). Headings sit on a slanted cyan tab. No bevels, no rivets. | **done** (`game/skin.js`, engine `frame.draw`) |
| **Cards** (act titles, the end) | a dark monitor: scanlines, a rolling band, corner brackets, small readouts (`NAGI·WA.NET`, `LOWER NINTH`, a counter), the text typing itself on with a block cursor, short glitches (a magenta and cyan split, slipping bands), `>>` when it waits | **done** (`game/skin.js`, engine `card.draw`) |
| **Fonts** | the HUD font: 3x5 capitals (with Ä Ö Ü) for the camera display, the deck's header and labels, readouts and decoration | **done** (`hud` in `game/font.js`) |
| | the main font: our own 5x7 terminal face, square and hard-cornered, with the frames' motif (where a letter closes round a corner, the top left and bottom right are cut at 45°: O C G Q S 0 6 8 9); capitals 7 rows, lowercase x-height 5 with 2-row descenders, line height 10; Ä Ö Ü ä ö ü ß, German quotes, € § ° · … → | **done** (`nagiwa` in `game/font.js`, the default font) |
| **Cursor** | a pale cyan arrow with an ink outline (§8); over a hotspot it becomes four corner brackets round the point with a dot on it, pulsing, like the implant's overlay | **done** (`ui_cursor`, `ui_cursor_hot` in `art/ui/hud.px.js`) |
| **Time and day** | in street mode the implant stamps Juno's view as a camera stamps its picture: the weekday and the time (`MI 22:15`) in the 3x5 HUD font, cyan, a small bracket, at the top left, dim; it lights up for a moment when the clock moves or she comes into a room. Not in the feeds (their own stamp), not on the deck (its clock). The user's choice of three (mockup `docs/mockups/mock_g_time.png`, variant A; B a display on the satchel, C a wrist deck beside EVI), 2026-11-08 | **done** (`timestamp` in `game/screens.js`) |
| **Buttons** | the satchel: Juno's grey bag (her sprite's greys) with a magenta sticker and a cyan status light that blinks (not a brown chest); the hint button: EVI peeking out of a pocket, blinking now and then; touch only: the menu as a small terminal, the hotspot finder as an eye in scan brackets | **done** (`ui_satchel`, `ui_evi`, `ui_menu`, `ui_eye`; engine 0f190ac: they may be animations) |
| **Hover labels** | the HUD font in brackets, `[ DECK ]`, pale cyan with an ink outline | **done** (`label` in `game/skin.js`; engine d05ef57) |
| **Lines and choices** | lines in the speaker's colour with an ink outline, in our font; the choice panel along the bottom: night steel, scanlines, a cyan top edge, a magenta tick, the choices numbered `[1]` in the HUD font, the one under the pointer on a cyan band with a marker | **done** (`choices` in `game/skin.js`; engine d05ef57) |
| **Transitions** | street to street: a glitch scan (rows go dark from the top, a cyan line at the ragged edge, the rows beside it slipping); street to a screen (the deck, a camera): the picture folds into a bright line and opens out of one through snow (jacking in and out); screen to screen: static, the picture drowns in snow and the next comes up out of it | **done** (`game/transitions.js`; engine fc6d96e `fx.setTransition`, 5797606 `frame.screen`) |
| **Title screen** | two screens. **The title screen** (on start-up, before the menu): one idea, the title as a picture, **awake and asleep**: Teo on the left in profile, asleep, leaning on the glass, the back of his head full and round, in Lull's cold pale light (the patch behind his ear pulsing, his gills glowing faintly, ear defenders, the orange vest); Juno on the right in profile, awake, looking at him, the yellow hood up and her back dropping straight from it, the cyan implant on her left cheek, magenta neon behind her, rain only on her side; between them a crack in the glass, which neither figure reaches: Teo's vest and Juno's coat each end on a slant, flaring toward the foot, and the ground shows between them and the crack (the user's decision, 2026-11-06). Under it the title block: a magenta rule, GLASS SISTER as flat outline letters (our font at 3x, one pale colour, no gradient, no shadow), a magenta rule, NAGI·WA . LOWER NINTH . 2091 spaced out. "Klicken zum Starten" blinking, a short glitch now and then. **The menu screen**: Kowalski Street seen whole, as a still (decided 2026-11-04: the game's street baked tall with its props and brought down to 320x180, the colours kept to its own; a slow pan along it looked wrong), a patrol drone hovering before the ad screen with its searchlight on the street, rain over it, the same title block with no plate behind it (a thin ink edge keeps it readable), the JACK IN menu centred, Juno's theme with the drums | **done** (`art/ui/splash.px.js`; the sketches it was chosen from: `art/ui/splash_sketches.px.js`; `art/ui/logo.px.js`, `art/ui/letters.px.js` `titleBlock`, `art/characters/drone.px.js`, `game/title.js`) |
| **Characters** | every person carries at least one piece of tech that glows or blinks (an implant, LED trim, a visor, a sleep patch, gills' glow marks, a collar on the animals); clothes are layered, worn, practical, with English brand prints. Silhouettes stay readable (§6). | rule for all new art |
| **Rooms and props** | screens, cables, vents, steam, wet floors, English signs and ads, something blinking in every room; nothing is new or clean except in the Crown | rule for all new art |
| **Animation** | nothing stands fully still: neon flickers, screens loop, signs blink, steam rises, drones pass, rain falls; idle animations for everyone | rule for all new art |
| **Effects** | rain and drip (fx), scanlines and noise in the feed, a glitch on every hack action (link, steer, REC), the chromatic split when the Witness is near | partly (rain, feed) |
| **Music** | dark synth in the line of Vangelis's *Blade Runner* and the SNES Shadowrun: slow pads (CS-80-like brass and strings), cold arpeggios, a sparse drum machine with a gated snare, the rain mixed in; Juno's theme on an electric piano over a bass that beats like a heart. On the deck the same theme through the wall; in the feeds it steps back to a drone and a glass bell. Synthesised with the engine's synth (instruments as data). | **first themes done** (`game/music.js`: `juno`, `glas`, `memory` (the old photo: a pedal D, CS-80 brass swelling into a long hall, a lead that scoops into its notes, far thunder, crystal bells), stingers `clue`, `witness`; WAVs: `build/music/`) |
| **Sounds** | electric hum, data chirps, keyboard clicks, a modem handshake when a camera links, the REC relay and beep, the lens's servo, glitch bursts, static, rain on glass; no cartoon sounds. Room changes sound by their kind (jack in, jack out, static, glitch); cards type with key clicks; EVI chirps at the hint button. Ambience: rain on the window, the city far below, the sign's buzz, the fridge, the deck's fans, the camera mic's hiss and the rain through it. | **first set done** (`game/sounds.js`; hear them: `node tools/render-sounds.mjs` → `build/sounds/all.wav`) |
| **The deck** | a computer of the future (kapitel0-design §2, mockup F): the old photo dimmed as its wallpaper, 24x24 icons with an ink outline, one window at a time in the skin's frame, the HUD font for labels, EVI the only soft round shape (mint), message cards sliding in at the top right | **done** (`game/deck.js`, `game/evi.js`, `art/ui/deck.px.js`, `art/ui/deck_wallpaper.px.js`) |
| **Words** | the city's slang, English in both languages (Glass, Glasser, Shine, Chits, Sinker), short hard sentences, tech terms used lightly; the city's own signs and readouts in English | rule for all text |

## 9. Feed mode: the hijacked cameras

Feed mode is how Juno works: watching, listening, identifying, recording. It is also how the story
finds her.

### The picture

- **Camera:** a high angle from a building corner or ceiling, 40–60° down, a real perspective with
  a slight wide-angle barrel bend at the edges.
  - Each camera is a fixed view of one place.
  - Some cameras can pan or zoom a little (a few steps, not free).
- **Phosphor duotone, 10 steps:** `0`–`9`, `#030a0a` `#071514` `#0c221f` `#12332d` `#1a483e`
  `#266252` `#388169` `#55a585` `#8acfae` `#d4f7e2`.
  - The street's light survives as value only: neon and screens bloom to `9`, shadows sink to `1`–`2`.
  - People are **silhouettes with 3–4 values**; their signature accents become the brightest value.
- **Artefacts** (on the phosphor only, never on the overlay):
  - scanlines (every second row one step darker) and light per-frame noise;
  - a rolling interference band, a dark vignette, bloom on the brightest values;
  - rain streaks falling toward the bottom of the picture.
- **Readability:** the street must read in the duotone *without* the overlay. Test with the
  overlay off. If it's murky:
  - raise the phosphor values;
  - cut the scanlines to every 4th row;
  - give the scene more light sources.

  The mockup is on the dark side; production feeds go one or two steps brighter.

### The implant overlay (the only colour in a feed)

| Colour | Marks | How |
|---|---|---|
| yellow `#ffd83a` | Juno, when she is in the picture | outline plus a name tag (`J.REYES`) |
| cyan `#3ff2ff` | things and people of interest, hotspots | corner brackets; the hovered one gets large corners, a label and a reticle |
| red `#ff2a3c` | threats: drones, police, armed people | a bracket plus a tag (`PATROL DRONE / HOSTILE`), its field of view dotted |

Tags on people are what Juno knows about them: `UNKNOWN`, then a name, later notes (`DEBT: 12k`,
`MEETS: VOSS`). The overlay is how the player sees the information Juno gathers.

### The camera display (OSD)

All OSD elements are in phosphor values, in 3x5 capitals; only the implant parts are coloured.

| Where | What |
|---|---|
| top left | camera ID and place (`CAM 07 // LOWER NINTH / KOWALSKI ST`), the owner (`NAGI·WA CIVIC SURVEILLANCE`), the link (`LINK: J.REYES IMPLANT OVERRIDE`, cyan) |
| top right | the timestamp (`2091-11-06 23:51:07`), a blinking `● REC`, the lens state (`F2.0 WIDE`, `IR OFF`) |
| bottom left | thumbnails of the linked cameras (`CAM 06`, `CAM 07` marked `LIVE`, `CAM 08`). A click switches cameras; switching is changing rooms. |
| bottom middle | the audio bar: what the camera's mic hears, as `NAME> line` (the speaker's name in their colour, or `???`) |
| bottom right | `CACHE n/8`: Juno's recorded clips, stills and data, the inventory of feed mode |
| right, under the buttons | a room's own buttons, only while they can be clicked (the end in `cam31`: `STEUERN`, `CHAT: INES`, `LAUTSPRECHER`, `REVIER 9`, cyan); once tried, the button keeps what came back, dimmed (`KEIN ZUGRIFF`) |

The overlay's brackets are cyan; the only red ones are a threat's (Ashe in `cam31`, `???` in cyan first, then `BEDROHUNG` in red). `cam31` is older than every other camera: coarser grain, a flicker, darker corners. When a feed dies, its picture goes to grain with `SIGNAL LOST` in phosphor in the middle, and the display stays.

### What the player does in a feed (the art must support it)

- **Watch:** people follow routines on a clock (enter, wait, meet, leave). Their walks must read.
- **Listen:** voices close to the camera come through clearly. Far voices come through broken
  (`...the shipment ... Thursday ...`).
- **Tag and follow:** tag a person, then follow them from camera to camera. The silhouette and the
  accent make them findable.
- **Record:** a clip or still goes into the cache. It is evidence, or goods to sell.
- **Zoom:** a zoom window (a 3x enlargement of part of the view, as in mockup A) reads a screen, a
  face or a number plate. Draw the details that matter large enough to survive the zoom.
- **Camera states:** online, offline (static, needs fixing on site), blind spots, a camera someone
  else is also watching.
- **The secret breaks the rule.** Whatever hides behind the story can intrude on the feed, as the eye
  does in the mockup. It is the only thing that may bring other colours or glitches into the phosphor
  (proposed: a magenta-white corruption). Use it rarely.

### Moving between the modes

- Entering a feed: the picture loses its colour into the phosphor with a scan sweep (about 0.6 s),
  then the OSD types in.
- Leaving: the reverse, back to Juno at her deck (or wherever she jacked in).

## 10. Animation

- **Every scene has small life:**
  - rain and splashes, neon letters stuttering;
  - steam from grates and pots, screens cycling ads or static;
  - drones bobbing with blinking eyes, people at windows.
- Drive scene animation from the frame (`c.phase` or `c.t`) inside 12-frame loops on the 100 ms grid.
- The feed's artefacts (noise, band, REC) loop on their own 16-frame cycle.

## 11. What the engine needs (Cutaway.js)

Cutaway already handles a lot of this:

- polygon walk areas (they follow the 2:1 lines);
- sorting by baseline (it works for iso);
- runtime light, rain and steam effects, scanlines in the display settings;
- several rooms, acts, saves and hints.

New for this game, to plan in the engine repo (no game content there):

1. **Diagonal facings:** a costume with `ne`, `se` (and mirrored `nw`, `sw`) views, picked by the
   direction of the walk.
2. **Tall props in iso:** a prop split into parts with their own baselines, or an occlusion mask, so
   Juno can walk behind a cart and in front of its wheel.
3. **Feed mode:**
   - a room type with perspective depth scaling (the existing `scale far/near` may do);
   - a post-effect layer drawn over the room and its actors (scanlines, noise, band, vignette);
   - phosphor versions of actors' sprites (a palette map, or separate small feed sprites);
   - the overlay drawn from hotspot boxes (brackets, tags, labels);
   - the OSD and the camera strip as UI layers.
4. **Routines:** NPCs walking, waiting and talking on a schedule against a game clock, so things
   happen in a feed whether the player watches or not, and the solver can still check it.
5. **Overheard audio:** lines whose legibility depends on the speaker's distance to the camera.
6. **Evidence:** recorded clips and stills as items with metadata (who, where, when).

## 12. Pipeline

- Art is written as code with the **pxl** skill: `node .claude/skills/claude-pxl/bin/pxl.js build <file> --out <dir>`.
- Review at **1x and 3x** (`--share 3` writes the 3x copies).
- **Street mode recipes** (`mock_c_iso.px.js`):
  - `P()`, `uvAt()`, `atL`/`atR` (a flat wall point onto the screen);
  - `flat()` (drawing elevations), `isoBox()` (boxes from their iso coordinates);
  - `halo()` (dithered light spill), `MIRROR`/`SHEEN` (wet ground).

  When production starts, move them into `art/lib/iso.js` and include that.
- **Feed mode recipes** (`mock_e_cctv.px.js`):
  - `makeCam`, `rayDir`, `project` (the camera and lens);
  - the small ray tracer over boxes (lights, puddle reflections, the searchlight beam);
  - the phosphor quantize with ordered dither;
  - the artefact pass; the overlay and OSD.

  A feed is built from a **blockout** of the place (boxes and lights in meters). Plan each place
  once, then derive the iso room and the camera views from the same layout. Move the shared parts
  into `art/lib/feed.js`.
- Room art files export only names starting with the room's id (`<id>_bg`, `<id>_<prop>`); feed art
  `<id>_cam<nn>_bg`.

## 13. History of the decision

Five mockups of the same moment (outside LUCKY STATIC, the ad screen that says Juno's name), in
`docs/mockups/index.html`:

- A: Dreamweb-like top-down in a HUD frame
- B: side-view neon stage
- C: isometric
- D: a megablock cross-section
- E: hacked CCTV feed

The decision (2026-11-03): **C for the world, E for hacking and observation.** E also became the
heart of the gameplay: Juno's day job is watching people through the cameras.

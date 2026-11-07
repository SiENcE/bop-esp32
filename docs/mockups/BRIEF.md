# Style mockups: the shared brief

All mockups show **the same moment** so that only the visual style and the interface differ.
The game is original: inspired by the *mood* of Dreamweb (dark, rainy, oppressive, adult, grimy
megacity), but its own world, characters and story. Engine: Cutaway.js (`B:\Github_my\cutaway\`),
verb-less (left click acts, right click looks), 320x180 native unless a style says otherwise.

## Working premise (placeholder)

Year 2091, the Lower Ninth Ring of the arcology **Nagi·wa**: a city stacked on itself, where acid
rain never stops and the ad screens never sleep. **Juno Reyes**, a night-shift repair tech, starts
hearing a voice inside the city's broken ad screens. Tonight one of them said her name.

## The moment (same in every mockup)

Night, heavy rain, a narrow street outside the noodle bar **LUCKY STATIC**.

| Thing | Notes |
|---|---|
| **Juno** (protagonist) | yellow hooded rain slicker (hood up, the iconic read, even from above), black cargo trousers, heavy boots, a grey tool satchel on a strap, short black hair under the hood, a thin cyan cyber-implant line on one cheek. Standing, looking at the ad screen. |
| **The broken ad screen** | a big wall screen, cracked, glitching: half an advert (a smiling face, "NAGI·WA: SLEEP BETTER"), half static with a single huge eye in it. The plot hook. Cold cyan/white light. |
| **LUCKY STATIC** | the noodle bar's door and its neon sign (magenta/pink), steamy warm light spilling from the door or window. |
| **Street cook / NPC** | an old man under a battered umbrella at a tiny noodle cart (steam from the pot), or sitting on a crate. |
| **Vending machine** | glowing, one dead panel, a "OUT OF ORDER" sticker. |
| **Patrol drone** | small, hovering, red sensor eye, a searchlight cone on the wet ground (optional if it doesn't fit the view). |
| **Street** | wet ground with neon reflections in puddles, a steam vent, cables and pipes, trash bags, rain everywhere. One exit (an alley or a stair) marked as a way out. |

### Interface moment shown

- The cursor hovers the ad screen, label: **"Broken ad screen"** (or the style's equivalent).
- Juno says: **"It... said my name."**
- Something showing the inventory exists (bag icon, slot bar, or the style's equivalent).

## Palette mood

Night blues/teals for the world; hot magenta + warm amber for the bar; cold cyan for the screen; a
red accent for the drone. Juno's yellow slicker must be the brightest warm thing on the street so
the player always finds her. Never pure black except where a style calls for it (the CCTV feed).

## Output (per mockup)

- source: `art/mockups/mock_<letter>_<name>.px.js`
- `docs/mockups/mock_<letter>_<name>.png`: the real 1x picture
- `docs/mockups/mock_<letter>_<name>_x3.png`: nearest-neighbour 3x for viewing
- optional `docs/mockups/mock_<letter>_<name>_x3.gif`: a short loop (rain, flicker, steam), 8–16 frames at 100 ms

## The styles

| | Style | View | Idea |
|---|---|---|---|
| A | Dreamweb-like top-down | straight down (90°) | small framed play window inside a chunky industrial HUD: big character portrait, location bar, wrist-watch clock, a zoom window; grim, dithered, rain streaks |
| B | Cutaway side stage | side, one vanishing point | the Loonies setup in neon noir: full screen, flat colours, a lighting pass with neon pools, modern verb-less UI |
| C | Isometric | 2:1 dimetric | a street corner in iso like the 90s tactical/cyber RPGs, full screen, slim UI |
| D | Cross-section megablock | side, the building sliced open | a whole stack of floors at once like an ant farm: the street at the bottom, apartments, a bar, a stairwell; tiny characters; the camera scrolls |
| E | Hacked CCTV feed | high angle from a corner camera | the game is seen through surveillance cameras Juno hijacks: duotone phosphor, scanlines, timestamp, camera ID, glitches; switching cameras = changing view |

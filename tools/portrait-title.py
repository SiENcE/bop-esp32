# The portraits of Juno and Teo are the title picture's two figures (art/ui/splash.px.js), cut out and set each to the far side of a panel: Juno to the
# right, since she looks left; Teo to the left, a mirror of hers, since he looks right. Run after `sh tools/build_art.sh title`; writes
# art/portraits/{juno,teo}_title.png. A figure's outline is what closes it off from the background, so a flood from outside stops at the ink. Their shoulders
# end short of the crack in the title picture itself (vestFront, COAT_FRONT), so nothing here has to cut them.
import json
from collections import deque
from PIL import Image

W, H = 80, 100
INK = (0x0c, 0x0e, 0x1a)
SRC = "build/art/title/anims/splash_bg"

sheet = Image.open(SRC + ".png").convert("RGB")
frames = json.load(open(SRC + ".json"))["frames"]
frames = frames if isinstance(frames, list) else list(frames.values())


def title_frame(i):
    f = frames[i]["frame"]
    return sheet.crop((f["x"], f["y"], f["x"] + f["w"], f["y"] + f["h"]))


def cut(x0, y0, frame, area, seed, seeds):
    """What hangs together with `seed` and isn't reached from outside, as an 80x100 picture."""
    image = title_frame(frame)
    px = image.load()
    ax0, ay0, ax1, ay1 = area
    outside, todo = set(), deque(seeds(ax0, ay0, ax1, ay1))
    while todo:
        x, y = todo.popleft()
        if (x, y) in outside or not (ax0 <= x < ax1 and ay0 <= y < ay1) or px[x, y][:3] == INK:
            continue
        outside.add((x, y))
        todo.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    figure, todo = set(), deque([seed])
    while todo:
        x, y = todo.popleft()
        if (x, y) in figure or (x, y) in outside or not (ax0 <= x < ax1 and ay0 <= y < ay1):
            continue
        figure.add((x, y))
        todo.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    o = out.load()
    for y in range(H):
        for x in range(W):
            p = (x + x0, y + y0)
            if p in figure:
                o[x, y] = px[p] + (255,)
    return out


def save(out, name):
    out.save(f"art/portraits/{name}_title.png")
    o = out.load()
    print(f"wrote art/portraits/{name}_title.png, pixels:", sum(1 for y in range(H) for x in range(W) if o[x, y][3]))


# ---- Juno, on the right. The search goes wider than the cut, so the flood can go round her; the crack stands alone in the background and stays behind.
X0, Y0 = 157, 3
juno = cut(X0, Y0, 0, (X0 - 10, 0, min(320, X0 + W + 40), Y0 + H), (X0 + 60, 40),
           lambda ax0, ay0, ax1, ay1: [(x, ay0) for x in range(ax0, ax1)] + [(ax1 - 1, y) for y in range(ay0, ay1)])
o = juno.load()
for y in range(84, H):                                                   # the bright tip of her drawstring would read as a spark at this size
    for x in range(18, 40):
        if o[x, y][3] and o[x, y][2] > 150:
            o[x, y] = o[x - 1, y]
save(juno, "juno")

# ---- Teo, on the left. Frame 2: the Lull patch and the gills at their brightest. The search goes far to the left, as his back runs on under the cut.
X0, Y0 = 85, 3
teo = cut(X0, Y0, 2, (20, 0, X0 + W, Y0 + H), (110, 40),
          lambda ax0, ay0, ax1, ay1: [(x, ay0) for x in range(ax0, ax1)] + [(ax0, y) for y in range(ay0, ay1)])
save(teo, "teo")

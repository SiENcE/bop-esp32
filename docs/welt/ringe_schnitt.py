# The nine Rings in a cut from the side (story.md §3 "Die neun Ringe"): each Ring a deck on supports, its city on it under the next deck,
# the sky only on its outer step, the open shaft round the tower, the Kessel-Block by it. A sketch for the docs, not game art.
#   python -X utf8 docs/welt/ringe_schnitt.py
from PIL import Image, ImageDraw, ImageFont
import math, random, sys
random.seed(5)
W, H = 1400, 745
im = Image.new("RGB", (W, H), (14, 18, 30))
d = ImageDraw.Draw(im)
F = ImageFont.truetype("arial.ttf", 18); FB = ImageFont.truetype("arialbd.ttf", 22); FS = ImageFont.truetype("arial.ttf", 15)

# ------------------------------------------------ A: the cut. Each Ring is a deck; its city stands on it, under the next deck
d.text((30, 18), "Die neun Ringe, im Schnitt (story §3)", font=FB, fill=(230, 230, 240))
cx, sea = 700, 640
hw = [600 - 56 * i for i in range(9)]           # each deck's outer half width: narrower upward (the steps of the intro)
HOLE = 46                                        # the open shaft round the tower: each deck stops short of it
GAP, DECK = 44, 8                                # the height of a Ring (its city) and of a deck
d.rectangle([0, sea, W, sea + 80], fill=(18, 40, 60))
for x in range(60, W - 60, 46):
    h = random.randint(20, 60); d.rectangle([x, sea + 80 - h, x + 26, sea + 80], fill=(24, 52, 70))
d.text((40, sea + 84), "Meer, darunter die ertrunkene alte Stadt", font=FS, fill=(120, 170, 200))
floor = [sea - 40 - i * (GAP + DECK) for i in range(10)]      # the top of deck i (the Ninth's deck on piers over the water)
cols = [(120, 88, 60), (128, 96, 64), (136, 104, 70), (146, 114, 76), (156, 124, 82), (168, 136, 90), (180, 150, 100), (192, 164, 112), (206, 182, 128)]
for x in list(range(cx - hw[0] + 20, cx - HOLE, 64)) + list(range(cx + HOLE + 10, cx + hw[0] - 10, 64)):
    d.rectangle([x, floor[0] + DECK, x + 7, sea], fill=(70, 60, 50))
names = ["9. Neunter", "8.", "7.", "6.", "5.", "4.", "3.", "2.", "1. Krone"]
for i in range(9):
    y = floor[i]
    for (a, b) in ((cx - hw[i], cx - HOLE), (cx + HOLE, cx + hw[i])):
        d.rectangle([a, y, b, y + DECK], fill=cols[i], outline=(60, 45, 35))
    # the city on this deck: houses under the next deck (dark, lit by windows and ads), on the outer step under the sky
    ceil = floor[i + 1] + DECK if i < 8 else y - GAP
    for side in (-1, 1):
        x = cx + side * (HOLE + 6)
        while abs(x - cx) < hw[i] - 8:
            w = random.randint(8, 16); under = i < 8 and abs(x - cx) < hw[i + 1]
            top = random.randint(int(ceil) + 2, int(y) - 12) if under else y - random.randint(10, 30)
            c = (34 + i * 5, 40 + i * 6, 62 + i * 5)
            x0, x1 = (x, x + side * w)
            d.rectangle([min(x0, x1), top, max(x0, x1), y], fill=c)
            for k in range(3):
                if random.random() < 0.6:
                    d.point((min(x0, x1) + random.randint(2, w - 2), random.randint(top + 2, int(y) - 2)), fill=random.choice([(255, 190, 80), (255, 80, 210), (80, 220, 240)]))
            x += side * (w + random.randint(2, 6))
    # the supports from this deck up to the next (the Rings stand on one another)
    if i < 8:
        for side in (-1, 1):
            for k in (0.35, 0.8):
                x = cx + side * (HOLE + (hw[i + 1] - HOLE) * k)
                d.rectangle([x - 3, floor[i + 1] + DECK, x + 3, y], fill=(80, 68, 56))
    d.text((cx + hw[i] - (92 if i == 0 else 70 if i == 8 else 30), y + DECK + 1), names[i], font=FS, fill=(230, 200, 150))
# the tower through the shaft, the lifts (the transit axis), the hall above the Krone
tw = 30; ttop = floor[8] - 150
d.rectangle([cx - tw // 2, ttop, cx + tw // 2, sea], fill=(70, 74, 90))
d.rectangle([cx - tw // 2, ttop + 50, cx + tw // 2, ttop + 62], fill=(60, 220, 120))
d.line([cx, ttop - 36, cx, ttop], fill=(150, 150, 160), width=2); d.ellipse([cx - 4, ttop - 42, cx + 4, ttop - 34], fill=(230, 40, 50))
for y in range(sea - 6, ttop + 70, -26):
    d.rectangle([cx - 4, y - 10, cx + 4, y - 2], fill=(80, 220, 240))
d.text((cx + 26, ttop + 46), "Turm: Beobachtungshalle (grün), Aubrechts Büros", font=FS, fill=(140, 240, 170))
d.text((cx + 26, ttop + 120), "Transitachse: Aufzüge am Turm", font=FS, fill=(120, 220, 240))
d.text((cx + HOLE + 8, floor[4] - 30), "offener Schacht um den Turm", font=FS, fill=(200, 200, 220))
# the rain: from the sky only on the outer steps and the Krone; through the decks it drips on, down to the Ninth
for k in range(320):
    x = random.randint(40, W - 40); y = random.randint(60, sea - 50)
    r = abs(x - cx)
    lim = sea
    for i in range(8, -1, -1):
        if r < hw[i] and r > HOLE:
            lim = floor[i]; break
    if y < lim - 8:
        d.line([x, y, x - 3, y + 12], fill=(90, 120, 170))
for k in range(160):   # the drip under the decks: what the hull lets through
    i = random.randint(0, 7); r = random.uniform(HOLE + 10, hw[i + 1] - 10); x = cx + random.choice((-1, 1)) * r
    y = random.uniform(floor[i + 1] + DECK + 4, floor[i] - 6); d.line([x, y, x, y + 5], fill=(110, 160, 220))
# the swamps: under the Ninth and outside its edge, where no Ring lies above
for side in (-1, 1):
    for k in range(9):
        x = cx + side * random.uniform(hw[0] + 15, hw[0] + 90); d.line([x, sea, x, sea - random.randint(14, 34)], fill=(50, 110, 70), width=3)
d.text((cx + hw[0] + 10, sea - 60), "Sümpfe", font=FS, fill=(120, 200, 140)); d.text((cx - hw[0] - 70, sea - 60), "Sümpfe", font=FS, fill=(120, 200, 140))
d.text((40, 56 + 0), "Jeder Ring ist ein Deck; seine Stadt steht darauf, unter dem Deck darüber.", font=F, fill=(220, 220, 230))
d.text((40, 80), "Himmel nur auf der äußeren Stufe; drinnen tropft es durch die Hülle,", font=F, fill=(150, 180, 230))
d.text((40, 104), "und der Neunte bekommt das Wasser aller Ringe ab.", font=F, fill=(150, 180, 230))
# Juno's roof: the Kessel-Block near the shaft, looking up through the holes
kx = cx - HOLE - 60
d.rectangle([kx - 10, floor[1] + DECK + 8, kx + 10, floor[0]], fill=(200, 200, 70))
d.line([kx, floor[1] + DECK + 8, cx - 4, floor[8] - 30], fill=(230, 230, 110), width=1)
d.text((cx - hw[0] + 30, floor[1] - 34), "Kessel-Block (gelb), sein Dach schaut durch den Schacht hinauf: Decken bis zur Krone", font=FS, fill=(230, 230, 110))

im.save(sys.argv[1] if len(sys.argv) > 1 else "docs/welt/ringe_schnitt.png")

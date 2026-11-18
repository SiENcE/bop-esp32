# Iso-Karten

Das Format der Straßen-Räume des Spiels: eine Karte (`art/rooms/<id>.map.js`) sagt, was wo steht, ein Kit
(`art/kit/*.kit.px.js`) wie es aussieht, und der Bake (`art/lib/isokit.js`) macht daraus mit Licht das Bild,
die Requisiten und das Layout. Die Karte bearbeitet der Reiter **Iso-Editor** (siehe „Iso-Editor“ in der Editor-Anleitung);
diese Seite beschreibt, was in ihr stehen kann. Die maßgebliche Beschreibung steht oben in
`art/lib/isomap.js` (die Karte) und `art/lib/isokit.js` (Kit und Bake).

## Die Karte

`ISO_MAPS.<id> = { ... }`, jede Länge in Metern. Der Boden liegt in u (entlang der rechten Rückwand) und v
(entlang der linken); ein Meter Boden sind 16 Einheiten nach rechts unten, ein Meter Höhe 30 Pixel.

| Schlüssel | was |
|---|---|
| `size: [U, V]` | der Boden, U entlang u, V entlang v |
| `cell: 0.5` | das Raster des Bodens |
| `floor: [...]` | eine Zeichenkette je Reihe in v (v = 0 zuerst), ein Kit-Schlüssel je Zelle in u; `.` kein Boden |
| `at: [CX, CY]` | die hintere Ecke am Fuß der Wände, auf dem Bildschirm |
| `screen: [w, h]` | die Größe des Bildes; ein Raum größer als der Bildschirm scrollt |
| `walls: [...]` | `{ from: [u, v], to: [u, v], h, kit, stub, end }`: eine Wand auf einer Linie mit festem u oder v; ihre Innenseite zeigt zum Betrachter (+u oder +v); `stub`: eine vordere Wand, gekappt auf die Bodenplatte; eine hintere Wand reicht um ihre Dicke über ihr Ende hinaus, über die Ecke der Wand, die dort anstößt; `end: "flush"` lässt sie genau an ihrem Ende aufhören, das Ende im Schnitt wie ihre Oberkante (wo keine Wand anstößt: nur ein Stub, ein Balkon) |
| `openings: [...]` | `{ id, wall: i, from, to, h: [h0, h1], kit }`: Tür, Fenster, Plakat in Wand i, from..to Meter entlang ihr; `open: { depth, floor, wall }` zeigt einen Raum dahinter, depth Meter tief |
| `props: [...]` | `{ id, kit, at: [u, v], foot: [du, dv], h }`: ein Ding auf seiner Grundfläche; `block: false` man geht hindurch (ein Teppich); `seeThrough: true` die Engine zeichnet es durchsichtig über einer Person, die es verdeckt; `standOn: true` seine Oberseite in h ist ein Boden; `behind: <Öffnung>` steht im Raum hinter einer offenen Öffnung (ins Bild gebacken) |
| `stairs` | `{ id, kit, from: [u, v], to: [u, v], down: "+u", rise, tread }`: eine Treppe hinunter durch ein Loch im Boden (seine Zellen `.`), von der obersten Stufe bei from u entlang +u; eine je Raum |
| `nowalk: [...]` | `[u, v, du, dv]`: Boden, der gemalt, aber nicht begangen wird |
| `zones: [...]` | `{ id, at: [u, v], foot: [du, dv], h }`: eine Stelle zum Anklicken, die weder Ding noch Öffnung ist (eine Tür, die nur eine Lücke in einer gekappten Wand ist); die Silhouette ihres Kastens ist die Form des Hotspots (`<id>Poly`) |
| `spots: { name: [u, v, face, h] }` | wo Leute stehen und wohin sie schauen; das Spiel nennt sie `Nagiwa.at.<raum>.<name>`; h: auf einer Stufe |
| `lights: [...]` | `{ id, at: [u, v, h], r, power, color, flicker }`: das Licht im Spiel; `bake: { ... }` das gebackene Licht (Reichweite, Stärke, durch eine Öffnung) |
| `margin: 0.2` | wie weit Füße von Wänden und Requisiten bleiben |

## Das Kit

Die Stücke, die eine Karte beim Namen nennt, registriert ein Kit mit `ISOKIT`:

| Aufruf | was |
|---|---|
| `ISOKIT.floor(key, fn)` | `fn(u, v, o)` gibt den Palettenschlüssel des Bodens an einem Bodenpunkt (nahtlos über die Zellen) |
| `ISOKIT.wall(kit, fn)` | `fn(s, h, o)` die Innenseite einer Wand, s Meter von ihrem `from`, h hoch |
| `ISOKIT.opening(kit, { pad, paint, pass, halo })` | `paint(s, h, o)` was in der Öffnung steht (null: die Wand zeigt); `pass` wo Licht von draußen durchkommt; `halo` was in ihr leuchtet |
| `ISOKIT.prop(kit, { draw, frames, solid, footprint, glows })` | `draw(pen, p, f)` malt die Requisite mit dem Stift in Raum-Metern (`pen.box`, …) |
| `ISOKIT.stairs(kit, { tread, riser, well })` | Stufen, Setzstufen und die Wand des Schachts |

Ein Raum backt nur die Kits, die seine Bake-Datei `art/rooms/<id>.px.js` einbindet (`include("../kit/…")`);
der Reiter Iso bietet nur deren Stücke an.

## Backen

`sh tools/build_art.sh room <id>` (im Reiter: **Bake**, der Task „art: room“) baut den Raum: das Bild
(`<id>_bg`, 12 Frames), die Requisiten als eigene Sprites (`<id>_<prop>`), das Layout
(`game/rooms/<id>.layout.js`: Gehfläche, Vorderkanten, Plätze der Requisiten, Rechtecke der Öffnungen, Spots,
Lampen; nie von Hand ändern) und die Pick-Datei (`build/art/rooms/<id>.pick.json`: welches Teil der Karte
jedes Pixel gemalt hat, für **Where from?**). Gehfläche und Spots kommen erst nach einem Neuladen ins Spiel.

**Die Formen der Hotspots** (entschieden 2026-11-09 von der Nutzerin: ein Rechteck nur für ein Ding, das eines ist, sonst ein
Polygon, damit kein Hotspot sichtbaren Boden oder einen anderen Hotspot verdeckt): Das Layout gibt jeder Requisite mit Sprite
ihren Umriss (`shape`: die Linie um ihre gemalten Pixel, um eins gewachsen, vereinfacht; ihre konvexe Hülle, wo die keinen Boden
und nichts anderes Anklickbare verdeckt), jeder Öffnung ihr Parallelogramm auf der Wand (`openingPolys`) und jeder Zone ihre
Silhouette (`zonePolys`); alles mindestens 12 px breit und hoch, damit Kleines klickbar bleibt, und mit nicht mehr Ecken als nötig.
`game/places.js` macht daraus `<id>Poly`; ein Hotspot im Iso-Raum nimmt `poly: A.<id>Poly`. `node tools/hotspot-audit.mjs [raum ...]`
zeigt für jeden Raum, wie viel sichtbaren Boden Hotspots den Klicks nehmen und wo sie sich überdecken (`build/hotspots/`).

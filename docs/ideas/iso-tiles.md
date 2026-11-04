# Iso-Räume aus Kacheln, mit Editor (Untersuchung, 2026-11-04)

Frage (Florian): Sollen die Straßenmodus-Räume aus isometrischen Kacheln gebaut werden, mit einem Editor in
Cutaway.js, in dem man den Hintergrund baut und Objekte von Hand setzt? Damit gingen größere, scrollende
Szenen, und man könnte sie leichter anpassen. Kamera-Szenen (Feed-Modus) bleiben Bilder. Also eine Mischung.

## Was heute da ist

- Ein Raum ist **ein gemaltes Bild** (`art/rooms/<id>.px.js`, pxl) plus **Props** als eigene Sprites
  (mit Grundlinie und `front`-Linie für die Tiefe), dazu Laufflächen und Hotspots als Polygone
  (`game/places.js`, gemessen aus den Layout-Notizen, `docs/rooms/*_layout.md`).
- Das Licht ist **ins Bild gebacken** (Lichtpfützen am Boden, Halos an den Wänden, nasse Spiegelungen:
  `art/lib/iso.js`); zur Laufzeit tönt `light.js` nur die Figuren.
- **Größer als der Bildschirm geht schon**: `size: [w, h]` scrollt, die Kamera folgt (die Loonies hatten
  breite Räume). Große Szenen sind also keine Frage der Engine, sondern der Arbeit, sie zu malen.
- `art/lib/iso.js` ist schon ein halber Baukasten: `ISO.room`, `isoBox`, `wallL`/`wallR` (Wände als
  Aufrisse), `pen` (Props an ihrem Ort im Raum gezeichnet, in ihr eigenes Sprite).

## Was Kacheln bringen

- **Tempo bei vielen Räumen.** Kapitel 1 hat 9 Räume, das ganze Spiel vielleicht 40. Boden, Wände, Türen,
  Fenster, Treppen, Geländer, Stände einmal als Baukasten zeichnen und dann setzen statt jeden Raum neu.
- **Große Szenen**: eine Straße über drei Bildschirme, ein Markt, ein Dach. Mit Kacheln billig, gemalt teuer.
- **Ändern ohne Neumalen**: einen Stand verschieben, eine Tür versetzen, den Raum einen Meter länger machen.
- **Mehr fällt automatisch ab**: Laufflächen aus begehbaren Zellen, die `front`-Linien der Props aus ihrer
  Grundfläche, die Positionen in `places.js`, Hotspot-Formen aus den Props. Heute messe ich das von Hand.
- **Zustände** (Style Guide §2: „Orte ändern sich“): ein abgesperrter Tatort ist eine zweite Belegung
  derselben Karte, kein neues Bild.

## Was Kacheln kosten

- **Der Look hängt am gebackenen Licht.** Kacheln, die zur Laufzeit einfach nebeneinander liegen, sehen
  flach und wiederholt aus. Das Licht (Pfützen, Halos, Spiegelungen, Regen am Fenster) muss **über das
  zusammengesetzte Bild** laufen.
- **Wiederholung**: jede Szene braucht ihre Einzelstücke (Style Guide §4: „jede Szene ein Detail, das
  eine kleine Geschichte erzählt“). Die bleiben handgemalte Props.
- **Ein Editor ist echte Engine-Arbeit** (etwa so groß wie der Room-Tab aus E6): Gitter, Kachelpalette,
  Wände an Zellkanten, Props mit Grundfläche und Drehung, Rückgängig, Speichern als Ebenen-Datei.
- **Der Maßstab muss vorher feststehen** (siehe den Höhentest, `docs/rooms/iso_height_test_x2.png`):
  ein Baukasten in der falschen Höhe ist doppelt verloren.

## Mein Vorschlag: Karten als Quelle, gebacken zum Bild

Keine Kachel-Engine zur Laufzeit, sondern **Kacheln als Quelle der Räume**, die beim Bauen zu Bild + Props
gebacken werden. Zur Laufzeit bleibt alles, wie es ist (Bild, Props, Polygone): der Solver, die Tools und
die Feeds merken nichts. Das ist genau die „Mischung“: gebaute Räume und frei gemalte stehen nebeneinander.

1. **Die Karte** (Spieldaten, `game/rooms/<id>.map.js`, eine Ebenen-Datei wie `*.geo.js`): Gittergröße,
   pro Zelle die Bodenkachel und ob begehbar, pro Zellkante eine Wand (mit Öffnung: Tür, Fenster), Props
   aus dem Baukasten an (u, v) mit Drehung, Lichter (dieselben Lampen wie `light`), Höhe pro Zelle
   (Stufen, Podeste).
2. **Der Baukasten** (Spiel, pxl): `art/kit/*.px.js`, im gewählten Maßstab; Boden- und Wandstücke,
   Öffnungen, Standard-Props mit Grundfläche.
3. **Das Backen** (Spiel, pxl, `tools/build_art.sh room <id>`): setzt die Karte zusammen, lässt das Licht
   von `art/lib/iso.js` darüber laufen, schreibt `<id>_bg`, die Prop-Sprites und das Layout (Lauffläche
   aus den Zellen, `front`-Linien aus den Grundflächen, Punkte für `places.js`). Handgemalte Einzelstücke
   kommen als Props oder als Übermalung dazu.
4. **Der Editor** (Engine, generisch: ein „Iso“-Tab): zeigt das 2:1-Gitter über dem Raum, malt Zellen,
   setzt Wände und Props aus der Liste, die das Spiel ihm gibt, zeigt eine **ungebackene Vorschau** (die
   Kachel-Sprites unbeleuchtet, sofort) und startet über das Studio das Backen (`studio.json`-Task),
   danach lädt er die Kunst neu (das kann der Art-Tab schon). Die Engine kennt nur Gitter, Zellen, Kanten,
   Props und Grundflächen; welche Kacheln es gibt, sagt das Spiel.
5. **Feeds** bleiben Blockouts mit dem Raytracer (`art/lib/feed.js`). Später könnte der Blockout einer
   Kamera aus derselben Karte kommen (Style Guide §9: „ein Ort, beide Ansichten“): das wäre der größte
   Gewinn, aber erst danach.

## Reihenfolge, wenn wir es machen

1. Den Maßstab entscheiden (Höhentest).
2. Den Baukasten für die Wohnung zeichnen und `flat` aus einer Karte backen, bis es aussieht wie jetzt
   (oder besser): der Beweis, dass das Licht über Kacheln trägt.
3. Das Kartenformat und das Backen festziehen, mit einem zweiten Raum (Kessel-Flur, H3).
4. Dann den Iso-Tab in der Engine (mit Demo-Raum aus Platzhalter-Kacheln, Tests), weil sich ab Kapitel 1
   mit 9 Räumen und Straßen das Setzen von Hand lohnt.

Aufwand grob: Schritt 2–3 eine Phase wie H1 (Kunst und Werkzeug im Spiel), Schritt 4 eine Engine-Phase wie
E6. Bis Schritt 4 geht alles ohne Engine-Änderung.

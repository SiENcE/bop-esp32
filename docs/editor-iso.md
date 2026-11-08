# Iso: die Räume auf der Karte

Der Reiter **Iso** gehört zum Spiel, nicht zur Engine (`game/editor/iso.js`). Er bearbeitet die Karte eines
Straßen-Raums (`art/rooms/<id>.map.js`, das Format steht in `art/lib/isomap.js`) direkt über dem Bild des
Raums und baut den Raum danach neu. Die Hintergründe bleiben dabei Code: Gemalt wird im Kit
(`art/kit/*.kit.px.js`), die Karte sagt, was wo steht.

## Hineinkommen

1. Das Studio starten, im Spielordner: `node lib/cutaway/tools/studio.mjs`. Es öffnet das Spiel mit dem
   Editor im Browser. Ohne Studio (F10 oder `?edit`) gibt es den Reiter nicht: Er liest und schreibt die
   Kartendateien, das kann nur das Studio.
2. Links unter WORKSPACES **Iso** wählen (oder Tools > The game's tabs > Iso).
3. Er öffnet die Karte des Raums, in dem man gerade ist. Räume mit Karte: `flat`, `kessel_14`,
   `kessel_lobby`, `kowalski`, `hall` (der Saal im Intro). Ein anderer Raum: oben im Feld **map** wählen,
   oder links unter ROOMS hingehen.

F1 im Reiter öffnet diese Seite.

## Was man sieht

Über dem Bild liegt die Karte: Wände (violett), Öffnungen, also Türen, Fenster, Plakate (cyan), die Kästen
der Requisiten (orange), die Spots, wo Leute stehen (gelbe Kreuze), die Lampen (gelbe Kreise) und gestrichelt
grün die Gehfläche, wie der Bake sie aus der Karte messen wird. Was man verschoben hat, sieht man sofort; eine
verschobene Requisite zeigt ihr Bild schon an der neuen Stelle, bevor gebacken ist.

## Die Werkzeuge

- **Move:** ein Teil anklicken (die Felder im Inspektor zeigen es), ziehen verschiebt es in Schritten von
  0,05 m. Eine Öffnung gleitet entlang ihrer Wand. Die Pfeiltasten schieben das gewählte Teil entlang des
  Bodens: rechts/links entlang u, runter/hoch entlang v (Shift: 0,25 m).
- **Add:** neue Teile per Klick. *prop*: auf den Boden, mit einem Kit-Teil, das der Raum einbindet.
  *opening*: auf eine Wand; unten geklickt eine Tür, weiter oben ein Fenster. *spot*: wo Leute stehen; man
  gibt ihm gleich einen Namen. *light*: auf den Boden, die Lampe hängt 2,2 m hoch. Das neue Teil ist gleich
  gewählt.
- **Floor:** die Bodenzellen mit einem Schlüssel bemalen (nur die Schlüssel der Kits, die der Raum einbindet;
  „.“ ist kein Boden). Die Zellen zeigen dabei ihre Schlüssel farbig.
- **Where from?** (oder Alt+Klick mit jedem Werkzeug): Welches Teil der Karte und welches Kit-Stück hat dieses
  Pixel gemalt? Die Antwort hat zwei Links: zum Kit-Stück im Quelltext (dort ändert man, wie es aussieht) und
  zur Zeile in der Karte (wo es steht). Das braucht einen Bake des Raums seit dieser Funktion; der Bake
  schreibt mit, wer welches Pixel gemalt hat (`build/art/rooms/<id>.pick.json`).

Im Inspektor hat das gewählte Teil seine Felder: Kit, Lage, Größe, Höhe, ob es den Weg versperrt, die id
(umbenennen), **Duplicate** und **Delete**. Ganz unten der Link auf seine Zeile in der Karte.

## Speichern, Backen, Neu laden

- **Save** (Strg+S) schreibt die Karte zurück und ändert dabei nur die Werte, die man angefasst hat:
  Kommentare und Aufbau der Datei bleiben, wie sie sind.
- **Bake** speichert und baut den Raum neu (der Task „art: room“): das Bild, die Requisiten, das Layout
  (`game/rooms/<id>.layout.js`) und die Pick-Datei. Das neue Bild lädt gleich.
- **Reload game**: Gehfläche, Spots und die Plätze der Requisiten kommen erst nach einem Neuladen ins Spiel
  (sie stehen im Layout, das das Spiel beim Start liest).
- Strg+Z und Strg+Y machen rückgängig und wieder her, Esc hebt die Auswahl auf.

## Was man wissen sollte

- **Nie die Zahlen im Layout ändern** und in einem gebackenen Raum keine Formen im Reiter Room: Der Room-Reiter
  sagt das oben selbst. Was dort gespeichert wird (`rooms/<id>.geo.js`), liegt über jedem späteren Bake.
- **Spots** nennt das Spiel beim Namen (`Nagiwa.at.<raum>.<spot>`). Umbenennen also in der Karte und im Spiel
  zugleich, in der Datei; der Reiter benennt Spots nicht um.
- Was die Karte **in Code berechnet** (die Pulte im Intro-Saal `hall`), zeigt der Reiter, ändert es aber nicht:
  das geht in der Datei.
- Noch nicht im Reiter: Wände anlegen, verschieben, löschen, und Treppen. Das geht in der Datei; das Format
  steht oben in `art/lib/isomap.js`.
- Das Aussehen eines Kit-Stücks (eine Fliese, eine Wand, ein Plakat) ändert man im Kit: **Where from?** führt
  hin, der Quelltext öffnet sich im Reiter Art, „Save + build + reload art“ baut neu.

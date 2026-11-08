# Iso-Editor

Die Räume auf der Karte. Der Reiter **Iso-Editor** gehört zum Spiel, nicht zur Engine (`game/editor/iso.js`). Er bearbeitet die Karte eines
Straßen-Raums (`art/rooms/<id>.map.js`, das Format steht in `art/lib/isomap.js`) direkt über dem Bild des
Raums und baut den Raum danach neu. Die Hintergründe bleiben dabei Code: Gemalt wird im Kit
(`art/kit/*.kit.px.js`), die Karte sagt, was wo steht.

## Hineinkommen

1. Das Studio starten, im Spielordner: `node lib/cutaway/tools/studio.mjs`. Es öffnet das Spiel mit dem
   Editor im Browser. Ohne Studio (F10 oder `?edit`) gibt es den Reiter nicht: Er liest und schreibt die
   Kartendateien, das kann nur das Studio.
2. Links unter WORKSPACES **Iso-Editor** wählen (oder Tools > The game's tabs > Iso-Editor).
3. Er öffnet die Karte des Raums, in dem man gerade ist. Räume mit Karte: `flat`, `kessel_14`,
   `kessel_lobby`, `kowalski`, `hall` (der Saal im Intro). Ein anderer Raum: oben im Feld **map** wählen,
   oder links unter ROOMS hingehen.

F1 im Reiter öffnet diese Seite. Was in einer Karte stehen kann, beschreibt die Reference unter „Iso-Karten“.

## Was man sieht

Über dem Bild liegt die Karte: Wände (violett; die gewählte hat an ihren Enden zwei Griffe), Öffnungen, also
Türen, Fenster, Plakate (cyan), die Kästen der Requisiten (orange), die Treppe (orange gestrichelt, mit ihren
Stufen), die Sperrflächen (rot, mit Kreuz: Boden, der gemalt, aber nicht begangen wird), die Spots, wo Leute
stehen (gelbe Kreuze), die Lampen (gelbe Kreise) und gestrichelt grün die Gehfläche, wie der Bake sie aus der
Karte messen wird. Was man verschoben hat, sieht man sofort; eine
verschobene Requisite zeigt ihr Bild schon an der neuen Stelle, bevor gebacken ist.

- **Unter dem Zeiger** wird weiß umrandet, was ein Klick nehmen würde, mit seinem Namen darüber; die
  Statusleiste unten sagt, wo der Zeiger steht: Bildpunkt, u und v in Metern, die Bodenzelle mit ihrem
  Schlüssel und das Teil darunter. Das gewählte Teil ist magenta und trägt seinen Namen.
- **show:** Die Knöpfe hinter „show“ (in den Farben der Teile, sie sind zugleich die Legende) blenden eine
  Art aus: Gehfläche, Wände, Öffnungen, Requisiten, Treppe, Sperrflächen, Spots, Lampen. Was nicht zu sehen
  ist, lässt sich auf dem Bild auch nicht anklicken; so kommt man an ein Teil hinter einem anderen. Der
  letzte Knopf (A) schreibt jedem Teil seinen Namen dazu. Was ein- und ausgeblendet ist, bleibt auch nach dem Neuladen so.
- **Links** listet der Reiter die Teile der Karte nach Art (statt der Dinge des Raums): ein Klick dort wählt
  ein Teil, auch eines, das auf dem Bild schwer zu treffen ist; eine ausgeblendete Art kommt dabei wieder.

## Die Werkzeuge

Die vier Werkzeuge oben haben Tasten: **V** Move, **A** Add, **F** Floor, **W** Where from?.

- **Move:** ein Teil anklicken (die Felder im Inspektor zeigen es), ziehen verschiebt es in Schritten von
  0,05 m. Liegen mehrere Teile übereinander (ein Spot vor einer Bank), wählt **ein zweiter Klick an derselben
  Stelle** das nächste darunter. Eine Öffnung gleitet entlang ihrer Wand; eine Wand zieht man ganz oder an
  einem ihrer Enden (dann wird sie länger oder kürzer und bleibt auf ihrer Linie). Die Pfeiltasten schieben
  das gewählte Teil entlang des Bodens: rechts/links entlang u, runter/hoch entlang v (Shift: 0,25 m).
  **Entf** nimmt es heraus, **Strg+D** macht eine Kopie (ein Stück nach vorn, eine Öffnung daneben auf
  derselben Wand) mit einer freien id und wählt sie.
- **Add:** neue Teile per Klick; die Tasten **1** bis **7** wählen, was (die Knöpfe in derselben Reihe).
  Unter dem Zeiger zeigt sich, wo das Neue hinkommt: der Kasten einer Requisite, das Kreuz eines Spots, die
  Lampe mit ihrem Lot zum Boden, die Wand, die eine Öffnung bekäme. *prop*: auf den Boden, mit einem Kit-Teil, das der Raum einbindet.
  *opening*: auf eine Wand; unten geklickt eine Tür, weiter oben ein Fenster. *spot*: wo Leute stehen; man
  gibt ihm gleich einen Namen. *light*: auf den Boden, die Lampe hängt 2,2 m hoch. Gezogen statt geklickt:
  *wall*: über den Boden ziehen; die Wand bleibt auf u oder v (die Richtung, in die man weiter gezogen hat) und
  ist so hoch wie die anderen Wände. *stairs*: ihr Rechteck auf den Boden ziehen, die Stufen gehen von der
  obersten bei „from u“ entlang +u nach unten; ein Raum hat höchstens eine Treppe. *nowalk*: eine Sperrfläche
  aufziehen. Das neue Teil ist gleich gewählt.
- **Floor:** die Bodenzellen mit einem Schlüssel bemalen (nur die Schlüssel der Kits, die der Raum einbindet;
  „.“ ist kein Boden). Die Zellen zeigen dabei ihre Schlüssel farbig, die unter dem Zeiger ist weiß umrandet.
- **Where from?** (oder Alt+Klick mit jedem Werkzeug): Welches Teil der Karte und welches Kit-Stück hat dieses
  Pixel gemalt? Die Antwort hat zwei Links: zum Kit-Stück im Quelltext (dort ändert man, wie es aussieht) und
  zur Zeile in der Karte (wo es steht). Das braucht einen Bake des Raums seit dieser Funktion; der Bake
  schreibt mit, wer welches Pixel gemalt hat (`build/art/rooms/<id>.pick.json`).

Im Inspektor hat das gewählte Teil seine Felder: Kit, Lage, Größe, Höhe, ob es den Weg versperrt, die id
(umbenennen), **Duplicate** (Strg+D) und **Delete** (Entf). Ganz unten der Link auf seine Zeile in der Karte.

- **Wand:** Kit, Höhe, beide Enden, ob sie eine vordere, gekappte Wand ist („stub“). **Delete** nimmt ihre
  Öffnungen mit (es fragt vorher), und die Öffnungen der Wände dahinter bekommen ihre neue Wandnummer: alles
  ein Schritt, ein Strg+Z holt es zurück.
- **Treppe:** Kit, beide Ecken, Stufenhöhe (rise) und -tiefe (tread). **Cut the floor** macht die Bodenzellen
  unter ihr zum Loch („.“), wie die Treppe es braucht. Bindet der Raum kein Treppen-Kit ein, sagt der Reiter
  es: Dann wird sie schlicht gezeichnet.
- **Sperrfläche:** Ecke und Größe.
- **more:** jeder Schlüssel des Teils, den das Formular nicht zeigt, so wie er in der Karte steht (zum Beispiel
  `steps` der Treppe im Flur, `open` einer Öffnung mit einem Raum dahinter, `bake` einer Lampe): ändern, mit
  **x** entfernen, mit Schlüssel und Wert hinzufügen. Die Knöpfe hinter „add:“ setzen, was das Format für die
  Art des Teils kennt (`seeThrough`, `standOn`, `behind` einer Requisite; `open` einer Öffnung; `color`,
  `flicker`, `bake` einer Lampe).
- **Nichts gewählt:** die Werte des Raums: seine Größe U × V (die Bodenreihen wachsen mit „.“-Zellen oder werden
  gekürzt), die Zellgröße `cell` (jede neue Zelle nimmt den Schlüssel, der unter ihrer Mitte lag; U und V
  müssen ganze Vielfache sein), wo seine hintere Ecke auf dem Bildschirm liegt (`at`), die Bildgröße (`screen`), der Abstand der
  Füße von Wänden und Requisiten (`margin`), und alle übrigen Schlüssel der Karte unter „more“.

## Ein neuer Raum

**New map** (neben dem Feld map) öffnet ein kleines Formular: die id des Raums (kleine Buchstaben, Ziffern,
`_`) und seine Größe U × V in Metern. **Make** führt den Studio-Task „room: new“ aus (`tools/new-room.mjs`):

- `art/rooms/<id>.map.js`: die Karte, ein Boden aus schlichten Zellen „p“, zwei hintere Wände, zwei vordere
  Stummel, ein Spot `arrive` und eine Lampe;
- `art/rooms/<id>.px.js`: die Bake-Datei, sie bindet das eigene Kit ein (weitere Kits hier dazu, dann stehen
  ihre Teile in den Listen des Reiters);
- `art/kit/<id>.kit.px.js`: das eigene Kit mit dem Boden „p“ und der Wand `<id>_wall`, Platzhalter zum
  Übermalen;
- dann der Bake, und nur wenn er gelingt: `game/rooms/<id>.js` (der Raum im Spiel, noch ohne Hotspots und
  ohne Weg hinein), seine Zeile in `game/places.js` (`Nagiwa.at.<id>`) und seine drei Zeilen in `index.html`.

Danach **Reload game**: Das Spiel lädt den neuen Raum, der Reiter geht hin und öffnet seine Karte. Ein
Fehlgriff geht mit `node tools/new-room.mjs --remove <id>` wieder heraus (nur ein Raum, den das Werkzeug
gemacht hat). Auf der Kommandozeile geht dasselbe ohne Editor: `node tools/new-room.mjs <id> [U] [V]`.

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
- Eine andere **Zellgröße** zeichnet den Boden in neuen Zellen nach; Treppenloch und Muster der Schlüssel
  danach ansehen. Das Format der Karte steht oben in `art/lib/isomap.js`.
- Das Aussehen eines Kit-Stücks (eine Fliese, eine Wand, ein Plakat) ändert man im Kit: **Where from?** führt
  hin, der Quelltext öffnet sich im Reiter Art, „Save + build + reload art“ baut neu.

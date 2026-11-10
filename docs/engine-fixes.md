# Engine-Fixes: der Plan nach der Code-Review

Am 10. November 2026 wurde die ganze Engine (Cutaway.js, Stand `b877f26`) durchgesehen: die Laufzeit, Bild und
Ton, die Node-Tools mit dem Solver und der Editor. Dieses Dokument sagt, wie die gefundenen Fehler behoben werden,
in welcher Reihenfolge und woran man sieht, dass ein Schritt fertig ist. Es liegt im Spiel und nicht in der Engine,
weil es die Prüfungen des Spiels nennt und Stellen aus Glass Sister als Beispiele braucht; die Engine bleibt frei
von Spielinhalt.

Fast alle Befunde wurden durch Ausführen nachgestellt (Node oder Headless-Chrome auf der Demo der Engine). Wo ein
Befund nur gelesen wurde, steht es dabei. Zeilennummern gelten für `b877f26` und wandern mit jedem Schritt.

## Stand

| Schritt | Inhalt | Stand |
|---|---|---|
| F1 | Der Solver sagt die Wahrheit | erledigt am 10.11.2026 (Engine `171d01d`, Spiel `1aa86c7`) |
| F2 | Ein laufendes Skript endet, wenn das Spiel ersetzt wird | erledigt am 10.11.2026 (Engine `56a34c5`, `bc436d3`) |
| F3 | Ein Spielstand hält kein halbes Skript | erledigt am 10.11.2026 (Engine `56a34c5`) |
| F4 | Eine Regel für „der Spieler darf jetzt handeln“ | erledigt am 10.11.2026 (Engine `b01d233`) |
| F5 | Ein Prop mit `if` ist überall dasselbe | erledigt am 10.11.2026 (Engine `5ca641e`) |
| F6 | Der Editor verliert keine Arbeit | offen |
| F7 | Die Tools scheitern laut, validate sieht mehr | offen |
| F8 | Kleine Fehler der Laufzeitlogik | offen |
| F9 | Bild und Ton | offen |
| F10 | Der Editor trifft die richtige Stelle, Undo ist vollständig | offen |
| F11 | Studio-Server und Werkzeuge härten | offen |

## So wird jeder Schritt gemacht

1. In `B:\Github_my\cutaway\` zuerst der Test, der den Fehler zeigt und scheitert, dann die Korrektur. Die Tests
   kommen in die Datei, die das Thema schon hat (`tests/tools.test.mjs`, `script.test.mjs`, `party.test.mjs`,
   `time.test.mjs`, `settings.test.mjs`, die `editor-*.test.mjs`).
2. Dort die Prüfungen der Engine: `node tests/run.mjs` („all passed“), `npm run check` (nichts), auf der Demo
   `validate` (0 errors), `solve --full` und `play.mjs`. Wo sich ein Verhalten ändert, sagen es `docs/reference.md`
   oder `docs/editor.md`, und die Hilfe wird neu gebaut. Dann der Commit in der Engine.
3. Hier `sh tools/sync-engine.sh`, die Prüfungen, die zum Schritt passen (sie stehen bei jedem Schritt), und der
   Commit des Syncs. `lib/cutaway/` wird nie von Hand geändert.
4. Den Stand oben in der Tabelle nachtragen.

Jeder Schritt ist für sich abgeschlossen und lässt die Engine in einem Zustand, in dem alle Prüfungen bestehen.
Wird ein Schritt zu groß, wird er an seinen Unterpunkten geteilt, nicht quer dazu.

## Die Reihenfolge und ihr Grund

F1 kommt zuerst, weil jede Kapitelprüfung auf dem Solver ruht: Solange er Zustände auslässt, ist „no soft-locks“
für kein Kapitel bewiesen. F2 bis F4 gehören zusammen und bauen aufeinander auf (erst kann ein Skript sauber
abgebrochen werden, dann weiß der Spielstand, wo ein Skript beginnt, dann fragt jede Eingabe dieselbe Regel). F5
schließt den letzten Engine-Commit ab und ist klein. F6 schützt die Arbeit im Editor, die täglich geschieht. Der
Rest ist nach Schaden geordnet.

---

## F1 · Der Solver sagt die Wahrheit

Der Solver kann heute „no soft-locks“ melden, obwohl er Zustände nie gesehen hat, und er spielt Züge, die kein
Spieler machen kann.

| Befund | Stelle | Korrektur |
|---|---|---|
| Ein zweiter unbeantworteter Auswahlpunkt im selben verworfenen Lauf überschreibt `need` und landet in `seen`. Zwei Dialoge hintereinander oder ein Dialog in einem Dialog werden nicht ganz gespielt. | `tools/lib/solver.mjs:157-163`, `:177-182` | Nach dem ersten unbeantworteten Auswahlpunkt gilt der Lauf als abgeschnitten: Jeder weitere Aufruf des Choosers gibt −1 zurück, ohne `seen` oder `need` anzufassen. |
| Auswahlpunkte in einem Moment haben alle denselben Schlüssel, weil `save.capture()` dort den gehaltenen Stand von vor dem Moment liefert. | `solver.mjs:160`, `src/save.js:36` | `capture({ live: true })` gibt den Stand, wie er jetzt ist; der Solver nimmt ihn für den Schlüssel. Der gehaltene Stand selbst bleibt, wie er ist. |
| Der Solver bietet `with`, `combine` und `ilook` in Räumen mit `buttons: false` an und benutzt Items mit `fixed` als gehaltenes Item. | `solver.mjs:111-126` gegen `src/inventory.js:58`, `:96` | Die Regel steht nur in `inventory.js`: Es gibt dort eine Abfrage, ob die Tasche offen sein kann und ob ein Item in die Hand geht, und `moves()` fragt sie. Keine zweite Kopie der Regel im Solver. |
| Der Akt fehlt im Zustandsschlüssel: Zwei Akte mit gleichem Anfang sind ein Zustand. | `solver.mjs:95` | `snap.act` kommt in den Schlüssel. |
| `solve --full` endet mit Exit-Code 0, wenn `--max` die Suche abschneidet; die Hinweise werden dann gar nicht geprüft. | `tools/solve.mjs:34`, hier `tools/solve-act.mjs:31` | `process.exitCode = 1`, wenn `--full` nicht vollständig war. |

**Tests** (`tests/tools.test.mjs`, die Demo im Speicher verändert): eine Wahl, die den Zustand bricht, einmal
direkt am Hotspot, einmal im verschachtelten Dialog, einmal als zweite von zwei Dialogen, einmal im Skript eines
Moments. Alle vier müssen Soft-Locks melden (heute nur die erste). Dazu: Der einzige Schlüssel liegt hinter einem
verschachtelten Dialog und das Spiel ist lösbar; ein Raum mit `buttons: false` und ein Item mit `fixed` machen die
Demo unlösbar, und der Solver sagt es; ein abgeschnittenes `--full` endet mit Exit-Code 1.

**Im Spiel danach:** das ganze `sh tools/check.sh`. Zu erwarten ist, dass einzelne Fäden mehr Zustände haben als
vorher. Mottes `talk` (`game/cast.js:37`: `motte_lektion`, dann `motte_mehr`) hat genau die Form des ersten
Befunds; ob dort Zustände fehlten, zeigt erst dieser Lauf. Das Deck ist ein Raum mit `buttons: false`: Fällt dort
ein Item-Zug weg, den ein Lösungsweg brauchte, meldet der Solver „UNSOLVABLE“, und das ist dann ein echter Fehler
des Spiels. Neue Soft-Locks und Zustände ohne Hinweis werden im Spiel behoben, jeder als eigener Commit.

**Fertig, wenn** die neuen Tests bestehen und `check.sh` hier wieder durchläuft.

**Erledigt.** Gebaut wie geplant, mit zwei Dingen mehr:

- Ein Auswahlpunkt wird auch nach den Dialogen unterschieden, die gerade laufen (`ChoicePoint.stack` in
  `dialog.js`: jeder mit dem Pfad des Schritts, der ihn begann). Ohne das galt derselbe Dialog, zweimal in einem
  Skript, beim zweiten Mal als schon gesehen, und alles danach ging verloren. Das war kein Befund der Review; der
  Test dafür hat es gezeigt.
- Mehr als 40 Wahlen in Folge sind ein Fehler mit dem Namen des Zugs. Vorher schnitt der Solver dort still ab.

Die Regeln der Tasche stehen als `Cutaway.inventory.available` und `holdable(id)` in `inventory.js`; der Solver
fragt sie. Die Demo der Engine hat dadurch 896 statt 1792 Zustände: Der Solver hatte den festen Sticker an den
zweiten Roboter weitergegeben, was kein Spieler kann. Zwölf neue Tests in `tests/tools.test.mjs` und
`tests/time.test.mjs`; neun davon scheiterten vor der Korrektur.

**Im Spiel:** `sh tools/check.sh`: ALL PASSED. Zum Vergleich lief der alte Solver (Engine `b877f26`) über alle
Fäden: Er findet in jedem dieselbe Zahl von Zuständen wie der neue.

| Faden | Zustände, alter und neuer Solver |
|---|---|
| Prolog | 78 612 |
| Kapitel 1, Hauptfaden | 38 704 |
| Dach | 17 608 |
| Zeitung | 13 984 |
| Imai | 12 488 |
| Träger | 7 064 |
| Varga | 36 387 |
| Tide | 47 542 |
| Motte | 11 182 |
| Vesper | 11 458 |

In Glass Sister hat die Lücke also keine Zustände verschluckt, auch nicht in Mottes Faden; die bisherigen
„no soft-locks“ waren richtig. Kein Lösungsweg brauchte einen Item-Zug im Deck oder EVI in der Hand.

## F2 · Ein laufendes Skript endet, wenn das Spiel ersetzt wird

Esc öffnet das Pausenmenü während jedes Skripts. Wird von dort geladen, zum Titel gegangen oder ein neues Spiel
begonnen, läuft das alte Skript im neuen Spiel weiter: Seine restlichen `set` und `give` landen im geladenen
Stand, sein `goto` lädt einen Raum über dem Titelbild, und nach einem Laden mitten in einem Gang nimmt das Spiel
keine Klicks mehr an.

| Befund | Stelle | Korrektur |
|---|---|---|
| Nichts bricht das laufende Skript ab, wenn der Stand ersetzt wird. | `src/save.js:77-91`, `src/acts.js:129-138`, `src/menu.js:157-163`, `:202` | `Cutaway.script.abort()`: Alle Skripte des Spiels laufen mit einer gemeinsamen Abbruchmarke (wie eine übersprungene Sequenz ihre `cancel` hat). `abort()` setzt sie, beendet die Zeile auf dem Schirm, schließt offene Auswahlen, lässt wartende Schritte sofort enden (wie `fast` beim Überspringen) und kommt zurück, wenn `busy` auf 0 ist. `save.apply` und `acts.reset` rufen es als Erstes. |
| `Actor.place` leert den Weg, löst aber `arrived` nicht auf. Ein Skript, das auf den Gang wartet, endet nie. | `src/actor.js:109-113` | Eine Methode `settle()` löst `arrived` und `onceDone` auf; `place()`, `stop()`, `walkTo()` und `playOnce()` rufen sie. Heute enden diese Versprechen nach vier verschiedenen Regeln. |
| Ein Gang, der beginnt, während eine Animation mit `wait: false` spielt, startet nie. | `src/actor.js:193-197` | Folgt aus `settle()`: `walkTo` beendet eine wartende Animation zuerst. |
| Ein Gang oder eine Animation eines Akteurs, der nicht im gezeigten Raum ist, endet nie, weil nur die Akteure im Raum Schritte bekommen. | `src/room.js:553-557`, `src/actor.js:148-157`, `:123-128` | Außerhalb des gezeigten Raums kommt der Akteur sofort an: Position setzen, auflösen. Die Node-Tools sehen den Fehler nicht, weil sie `walkTo` ersetzen (`tools/lib/game.mjs:101-107`); der Test braucht deshalb die echte Methode. |

Vor dem Bauen wird gelesen, wie `sequence.js` ein Überspringen heute macht (`cancel` und `fast`), damit `abort()`
denselben Weg geht und kein zweiter entsteht.

**Tests** (`tests/script.test.mjs`, `tests/acts.test.mjs`): Laden während einer Zeile (die Zeile ist weg, kein
`set` des alten Skripts im neuen Stand), Laden während eines Gangs (`busy` ist danach falsch, ein Klick geht),
„Titelbild“ während `["Zeile", { goto }]` (kein Raum über dem Titel, kein Autosave), Gang eines Akteurs im
anderen Raum (endet), Gang nach `{ anim, wait: false }` (endet).

**Im Spiel danach:** `validate` und `play.mjs … spiel.json`.

**Fertig, wenn** kein Weg aus dem Pausenmenü ein Skript überleben lässt und `script.busy` danach immer falsch ist.

**Erledigt**, in drei Punkten anders als oben geplant:

- **Wer `abort()` ruft.** `save.apply` ruft es als Erstes, dazu die Zeilen „Laden“ und „Zum Titelbild“ des
  Pausenmenüs, bevor der Schirm dunkel wird. `acts.reset` ruft es nicht: Dorthin kommt auch ein Skript selbst, mit
  `{ act: "next" }` in einen frischen Akt und mit `{ end }` zurück zum Titel, und es würde auf sich selbst warten.
  „Neues Spiel“ gibt es nur auf dem Titelbild, und dorthin führt aus dem Spiel nur das Pausenmenü (das abbricht)
  oder das Ende.
- **Akteure in einem Raum, der nicht gezeigt wird**, kommen nicht sofort an, sondern werden dort mitgeführt
  (`scene.update` führt jeden, der einen Weg oder eine einmalige Animation hat). So spielt ein Gang, den ein
  Skript beginnt, bevor es in den Raum geht, weiter wie bisher, und der wartende Fall endet trotzdem.
- **Die Ankunftsprüfung aus F4 ist vorgezogen.** Weil `place()` jetzt wartende Gänge auflöst, würde ein Gang zu
  einem Hotspot, der durch einen Raumwechsel weggenommen wird, sofort als Ankunft gelten. `approach` prüft deshalb
  nach dem Gang, ob Raum und Akteur noch dieselben sind und der Akteur noch im Raum ist.

Dabei gefunden: Die erste Fassung dieser Prüfung verwarf den Klick auch, wenn unterwegs ein Skript begann. Im
Touch-Modus sagt EVI beim zweiten Tipp ihren Hinweis zum Halten (`evi.hold`), während Juno zum Deck geht; das Deck
ging dann nicht mehr auf, und beide Touch-Läufe scheiterten am zweiten Zug. Die Bedingung ist wieder heraus
(Engine `bc436d3`), ein Test hält den Fall fest. Für F4 heißt das: Ein Hotspot-Skript, das auf ein anderes
trifft, muss warten, bis es zu Ende ist, und darf nicht verworfen werden.

Ein Dialog endet beim Abbruch von selbst (`dialog.js` fragt `script.stopping`), und ein Raum, der währenddessen
noch betreten wird, schreibt keinen Autosave. `tests/replace.test.mjs` spielt jeden Fall auf der Demo mit echten
Zeilen, Gängen und Wartezeiten.

## F3 · Ein Spielstand hält kein halbes Skript

Die Regel „ein Skript kann nicht halb gespeichert werden“ gilt heute nur für Momente (`save.hold`) und den
Autosave beim Gang zum Titel. Die Zeile „Speichern“ im Menü und der Autosave beim Raumwechsel halten sie nicht.

| Befund | Stelle | Korrektur |
|---|---|---|
| Speichern während einer Zeile schreibt den Stand mit der ersten Hälfte des Skripts; geladen kommt die zweite nie. | `src/menu.js:192`, `:417-420` | Das äußerste `script.run` merkt sich den Stand von davor. Ein Speichern, während ein Skript läuft, schreibt diesen Stand. Geladen steht der Spieler vor seinem Klick. Für Momente gilt das schon so, mit dem Unterschied, dass sie von selbst noch einmal spielen. |
| Der Autosave bei einem `goto` mitten im Skript hält die Schritte danach nicht. | `src/save.js:120`, `src/room.js:306` | Der Autosave nach einem Raumwechsel wird geschrieben, sobald `script.busy` falsch wird, nicht mitten im Skript. |
| Der Hinweis aus dem Menü wird während eines Skripts von dessen nächster Zeile verdrängt, die Hinweisstufe ist verbraucht. | `src/menu.js:191` | Die Zeile „Hinweis“ gibt es nur, wenn `hints.ready()` gilt. |

Der Stand von vor dem Skript wird bei jedem Klick einmal gefasst. Vor dem Bauen wird an Kapitel 1 gemessen, was
das kostet; ist es spürbar, wird er erst gefasst, wenn das Menü während eines Skripts aufgeht, und bis dahin aus
einem Protokoll der Änderungen zurückgerechnet. Die einfache Lösung zuerst.

**Tests** (`tests/acts.test.mjs`, `tests/settings.test.mjs`): Speichern in der Mitte von
`[{ remove }, "Zeile", { give }]`, geladen ist der Stand von davor; ein Skript `[{ goto }, { set }, { give }]`
hinterlässt einen Autosave mit beidem; die Hinweiszeile fehlt, während ein Skript läuft.

**Im Spiel danach:** `validate` und `play.mjs … spiel.json`. Von Hand: in einem langen Gespräch (Regenleserin)
speichern und laden.

**Fertig, wenn** jeder gespeicherte Stand einer ist, den der Solver kennt.

**Erledigt.** `script.js` hält den Spielstand, solange ein Skript läuft (`save.hold` mit dem Stand von vor dem
äußersten Skript); der Autosave eines Raumwechsels im Skript wird geschrieben, wenn `script.busy` falsch wird;
der Autosave auf dem Weg zum Titel wird immer geschrieben. Die Zeile „Hinweis“ fragt `script.busy` und nicht
`hints.ready()`, das auch „kein Menü offen“ verlangt und die Zeile beim Zurückkommen aus den Einstellungen
verschwinden ließe.

- **Was es kostet:** nichts Messbares. Der Stand von vor dem Skript wird bei jedem Klick einmal gefasst; die
  Solver-Läufe von Kapitel 1 sind gleich schnell (Tide 231 s nach 253 s, Motte 56 s nach 57 s, Vesper 61 s nach
  60 s), die Demo der Engine 555 ms nach 551 ms. Das Protokoll der Änderungen braucht es nicht.
- **Ein Moment in einem Skript gehört jetzt zu diesem Skript.** Bisher hielt jeder Moment den Stand von
  unmittelbar vor sich und spielte nach dem Laden von selbst noch einmal (Engine `72e33ff`, für das Ende in
  cam31). Das gilt weiter für einen Moment, der als eigenes Skript spielt (sein Raum wird betreten, wenn seine
  Zeit da ist). Spielt er aber in einem Skript (dem, das gewartet hat oder in den Raum gegangen ist), dann ist
  ein Speichern mittendrin der Stand von vor diesem Skript, und der Spieler macht den Klick noch einmal. Sonst
  gingen die Schritte verloren, die im Skript nach dem Moment kommen. Hängen bleibt das Spiel in keinem der
  beiden Fälle.

Im echten Spiel in Chrome geprüft (Prolog, Junos Wohnung): Speichern mitten in einer Zeile hält den Stand von
davor; Laden mitten in einer Zeile nimmt die Zeile weg, kein Skript läuft mehr, sein späterer Schritt kommt nicht
an; das Pausenmenü zeigt währenddessen keinen Hinweis.

## F4 · Eine Regel für „der Spieler darf jetzt handeln“

Ob der Spieler gerade handeln darf, wird an fünf Stellen einzeln berechnet (`inventory.shown()`,
`party.visibleNow()`, `hints.ready()`, `ui.buttonBoxes()`, der Tasten-Handler der Party), und zwischen einem Klick
und dem Skript, das er auslöst, hält nichts die Eingabe fest.

| Befund | Stelle | Korrektur |
|---|---|---|
| Eine Zifferntaste auf dem Titelbild lädt den Raum des Akteurs hinter dem Menü und überschreibt den Autosave mit einem leeren Spiel. In Glass Sister reicht die Taste `1`. | `src/party.js:131-134` | Eine Abfrage `Cutaway.ui.canAct()`: ein aktiver Akteur, kein Skript, kein Menü, kein Titel, keine Sequenz. Alle fünf Stellen fragen sie und fügen nur das Eigene hinzu. Der Tasten-Handler wechselt außerdem nicht zum schon aktiven Akteur, und `switchTo` weigert sich ohne aktiven Akteur. |
| Zifferntasten wählen eine Dialogoption unter dem offenen Pausenmenü (nur gelesen). | `src/dialog.js:150-153` | Dieselbe Abfrage, hier ohne die Bedingung „kein Skript“. |
| Nach dem Gang zum Hotspot startet dessen Skript, auch wenn inzwischen der Akteur gewechselt wurde oder ein anderes Skript läuft. `approach` nimmt `stop()` als Ankunft. | `src/ui.js:213-233`, `:258-288`, `src/party.js:46` | Mit F2 gebaut: Nach dem Gang bricht `approach` ab, wenn Raum oder aktiver Akteur andere sind als beim Klick oder der Akteur nicht mehr im Raum ist. Noch offen: `switchTo` und ein Halt von außen zählen `clickSeq` hoch; läuft bei der Ankunft ein anderes Skript, wartet das Skript des Hotspots, bis es zu Ende ist (es wird nicht verworfen: EVIs Tipp im Touch-Modus beginnt genau dann). |
| In den 260 ms einer offenen Tür ist `script.busy` falsch; ein zweiter Klick wird angenommen und sein Skript läuft im nächsten Raum. | `src/ui.js:279-283` | Tür zeigen, warten und `goto` laufen als ein Skript, sodass `busy` vom Öffnen an gilt. |
| Ein Zwei-Finger-Tipp löst 450 ms später ein „Ansehen“ aus, weil der Halte-Timer des ersten Fingers weiterläuft. | `src/input.js:53-78` | Solange ein Zeiger unten ist, werden weitere ignoriert. |
| Die Markierungen bleiben an, wenn das Fenster den Fokus verliert, während Tab gehalten wird (nur gelesen). | `src/ui.js:540-541` | `Cutaway.input.isDown("Tab")` fragen, das bei `blur` geleert wird. |

**Tests** (`tests/party.test.mjs`, `tests/input.test.mjs`): Ziffer auf dem Titel ändert weder Raum noch Autosave;
Figurenwechsel während des Gangs zum Regal gibt dem anderen Akteur nichts; ein Klick während der Tür wird nicht
angenommen; zwei Finger geben einen Klick und kein „Ansehen“.

**Im Spiel danach:** `validate`, `play.mjs … spiel.json` und `node tools/check-hover.mjs`.

**Fertig, wenn** es die Regel einmal gibt und der Tasten-Handler der Party sie fragt.

**Erledigt.** `Cutaway.ui.canAct()` ist die Regel: jemand wird gespielt, kein Skript, kein Menü und keine Karte,
nicht das Titelbild oder sein Splash, keine Zwischensequenz. Die Tasche, die Porträts, die Knöpfe neben der
Tasche, der Hinweis (H) und die Tasten 1 bis 9 der Party fragen sie und fügen nur das Eigene hinzu; die Tasten 1
bis 9 eines Dialogs fragen `canAct({ script: true })` (ein Skript darf laufen, das Pausenmenü nicht offen sein).
Die Taste `1` auf dem Titelbild von Glass Sister lässt jetzt Titel und Autosave stehen (im echten Spiel in Chrome
geprüft). Anders als geplant:

- **`switchTo` weigert sich nicht ohne aktiven Akteur.** Die Eingaben fragen `canAct`, das einen aktiven
  Akteur verlangt; Skripte (`{ switch }`, etwa am Anfang eines Akts) dürfen weiter wechseln. Die Taste des
  Akteurs, der schon gespielt wird, tut nichts mehr (sie hielt vorher seinen Gang an).
- **Ein Halt von außen zählt nicht `clickSeq` hoch, sondern `walkTo` sagt es:** Der Gang löst mit `true` auf,
  wenn der Akteur ankam, und mit `false`, wenn er weggenommen wurde (`stop()`, `place()`, ein neuer Gang,
  eine Animation: alles, was `settle()` ruft). Das ist eine Regel für jeden Halt statt einer Zählung an jeder
  Stelle, die anhält. `Cutaway.ui.cancelClick()` lässt den Klick, der gerade läuft, ins Leere gehen; der
  Figurenwechsel, das Laden eines Spielstands und `acts.reset` rufen es. Ohne das lief beim Wechsel zu einem
  Akteur in einem anderen Raum das Skript des Hotspots für den zurückgelassenen, weil der Wechsel erst nach dem
  Ausblenden den aktiven Akteur setzt.
- **Ein Skript, das bei der Ankunft läuft, geht vor:** Das Skript des Hotspots wartet auf sein Ende
  (`Cutaway.script.idle()`), prüft danach noch einmal Raum, Akteur und Klick und läuft dann. Ein Laden
  währenddessen lässt es fallen.
- **Tasche und Porträts verschwinden auch unter dem Pausenmenü und unter einer Karte** (vorher fragten sie nur
  `script.busy`). In Glass Sister ändert sich dadurch nichts Sichtbares: Unter dem Pausenmenü war schon vorher
  nichts davon zu sehen (`build/shots/f4_menu.png` gegen `f2_menu.png`).
- Tab fragt `Cutaway.input.isDown("Tab")`; `Cutaway.ui.marking` sagt, ob die Markierungen gerade an sind.
- Die Tests, die Gänge mit echter Zeit brauchen, stehen in `tests/replace.test.mjs` (dort ist der Aufbau dafür),
  die Tasten auf dem Titel und unter dem Pausenmenü in `party.test.mjs`, zwei Finger und Tab in
  `input.test.mjs`. 13 neue Tests, alle scheiterten vor der Korrektur.

**Im Spiel:** validate 0 errors, 17 bekannte Warnungen; `play.mjs … spiel.json`, beide Touch-Läufe (Prolog und
Kapitel 1, in denen EVI ihren Hinweis zum Halten sagt, während Juno zum Deck geht) und `check-hover.mjs`: all
passed.

## F5 · Ein Prop mit `if` ist überall dasselbe

Der letzte Commit der Engine gab Props eine Bedingung. Ob ein Prop da ist, wird seither in `props()` und in
`hotspots()` je einzeln berechnet und im Editor gar nicht.

| Befund | Stelle | Korrektur |
|---|---|---|
| Die Regel steht zweimal in `room.js` und fehlt im Editor; `hotspots()` kennt `showProp` nicht. | `src/room.js:400-403`, `:499` | Eine Funktion `scene.propThere(p)`, die `hidden`, `if` und das `shown` der Szene kennt. `props()`, `hotspots()` und der Editor rufen sie. |
| Der Tracer zählt die Bedingung des Props nicht als Voraussetzung eines Zugs, wenn der Hotspot seine Fläche vom Prop hat. | `tools/lib/trace.mjs:106-107` | In `begin()` auch `hidden` und `if` des Props lesen, von dem der Hotspot seine Fläche nimmt. |
| Things wählt beim Klick ein Prop, das wegen seines `if` nicht da ist, und zeigt das Feld `if` nicht. | `src/editor-things.js:260`, `:32` | `propThere` beim Klick; ein Feld `if` bei den Props, auch in `docs/editor.md`. |
| State zeigt ein solches Prop als sichtbar; das Häkchen schreibt nur `hidden` in den Stand. | `src/editor-state.js:64-67` | Das Häkchen ist aus und gesperrt, solange die Bedingung nicht gilt, mit der Bedingung daneben. |
| Connections listet ein Prop nicht unter den Stellen einer Tatsache. | `src/editor-graph.js:140-147` | `placesOf` geht auch durch die `if` der Props. |
| validate warnt nicht vor `{ show }` oder `{ hide }` auf einem Prop mit `if`. | `tools/lib/validate.mjs:152` | Eine Warnung. Die überflüssigen `!== undefined` in `validate.mjs:242` und `room.js:403` fallen weg. |
| Der Test „showProp zeigt ein verstecktes Prop“ läuft seit dem Commit gegen ein Prop mit `if`; der Weg über `hidden` ist ungeprüft. | `tests/cinema.test.mjs:287-296` | Je ein Test für `hidden` mit `showProp`, für `if` mit `showProp` und für den Hotspot, der mit seinem Prop kommt und geht. |

**Im Spiel danach:** `validate` und `play.mjs … spiel.json`; dazu `sh tools/graph.sh main`, weil sich die
Voraussetzungen im Graphen ändern können.

**Fertig, wenn** `isHidden` für Props nur noch in `propThere` vorkommt.

**Erledigt** wie geplant. `Cutaway.scene.propThere(p)`: für die Szene gezeigt (`showProp`) ist ein Prop da, sonst
nicht, solange es versteckt ist, und nur, solange sein `if` gilt. Das Bild, die Hotspots, die ihre Fläche von
einem Prop nehmen, Things, State und der Tracer fragen sie; `isHidden` kommt für Props nur noch dort vor. Dazu:

- **Das Feld `if` hat Things bei Props und bei Hotspots** (beiden fehlte es), als Bedingung so geschrieben, wie
  sie im Code steht (`door_open`, `!has:key`), eine Liste oder `{ or }` als JSON.
- **State** zeigt die Bedingung neben dem Ding und hält das Häkchen aus und gesperrt, solange sie nicht gilt,
  auch bei einem Hotspot mit `if`. Im Spiel ist das `alley_open` in der Kowalski Street (`if: "day>=2"`):
  am ersten Tag gesperrt (`build/shots/f5_state.png`).
- Der Test für einen Hotspot, der mit seinem Prop kommt und geht, braucht einen Hotspot mit einer anderen id als
  das Prop (`prop: "plant"`): Hotspot und Prop mit derselben id teilen sich ihren versteckten Zustand, ein
  verstecktes Prop nimmt seinen gleichnamigen Hotspot also ohnehin mit.
- Acht neue Tests (`cinema`, `tools`, `editor-blocks`), alle scheiterten vor der Korrektur.

Glass Sister hat nur dieses eine Prop mit `if`, und kein Hotspot nimmt seine Fläche; validate warnt deshalb nicht
neu, und die Voraussetzungen im Graphen bleiben, wie sie waren.

**Im Spiel:** validate 0 errors, 17 bekannte Warnungen; `play.mjs … spiel.json`: all passed; `sh tools/graph.sh main`:
38 704 Zustände wie bisher, der Graph geschrieben (`build/graph/kapitel1_main.js`).

## F6 · Der Editor verliert keine Arbeit

| Befund | Stelle | Korrektur |
|---|---|---|
| Schedule, Sequences und der Quelltext-Editor halten je eine eigene Kopie einer Datei, lesen sie nie neu und schreiben sie über alles, was seither geändert wurde: über Handänderungen im Code-Editor und über das, was ein anderer Tab gespeichert hat. | `src/editor-sequences.js:427`, `:458`, `src/editor-schedule.js:325`, `:361`, `:416`, `src/editor-art.js:229-248` | Ein gemeinsamer Dateispeicher im Editor (`E.files`): ein Text je Pfad für alle Tabs, mit dem Stand der Platte beim Lesen. Vor einer Änderung ohne Ungespeichertes wird neu gelesen. Vor dem Schreiben wird die Platte mit dem gelesenen Stand verglichen; weicht sie ab, wird nicht geschrieben, und der Editor fragt: neu laden oder überschreiben. |
| Eine andere Quelldatei zu öffnen verwirft die ungespeicherten Änderungen der offenen. | `src/editor-art.js:229-230` | Folgt aus dem Dateispeicher: ein Puffer je Pfad. |
| Ein Raum, im Editor geöffnet, schreibt den Autosave und markiert den Raum als besucht. Ein Klick in der Raumliste nach dem Start mit `?edit` ersetzt einen Autosave mit Fortschritt durch einen leeren. | `src/editor.js:1931-1934`, `src/save.js:120`, `src/room.js:303` | `scene.load(id, { enter: false, peek: true })`: kein Besuch, und das Ereignis trägt `peek`, bei dem `save.js` nicht schreibt. Der Editor lädt Räume nur so. |
| Ein abgebrochener Speichern-Dialog (ohne Studio) markiert die Arbeit als gespeichert. | `src/editor-things.js:141`, `editor-texts.js:119`, `editor-sound.js:79`, `editor-voices.js:237`, `editor-paint.js:590`, `editor-art.js:404` | `E.saveFile` gibt zurück, ob geschrieben wurde; die Tabs behalten ihr „ungespeichert“, wenn nicht. Der Room-Tab prüft das schon. |
| Strg+Z im Dialogue-Tab schreibt in den Dialog, der in der Liste gewählt ist, nicht in den, dem der Undo-Stapel gehört. | `src/editor-dialogue.js:63-79` | Das Modell trägt seine eigene id, `commit` schreibt dorthin; Schließen und ein Wechsel der Auswahl leeren die Stapel. |

**Tests** (`tests/editor-sequences.test.mjs`, `editor-map.test.mjs`, `editor-studio.test.mjs`, `editor.test.mjs`):
eine Datei wird zwischen zwei Speichern von außen geändert (der Editor weigert sich und fragt); eine Änderung im
Tab und eine im Quelltext-Editor an derselben Datei stehen beide in der Datei; ein Raumwechsel im Editor lässt den
Autosave und `visited` unberührt; ein abgebrochener Dialog lässt den Punkt stehen; Strg+Z nach dem Wechsel des
Dialogs ändert nichts.

**Im Spiel danach:** `validate`. Der Iso-Editor (`game/editor/iso.js`) schreibt Karten selbst; es wird nachgesehen,
ob er den gemeinsamen Dateispeicher nehmen kann, und wenn ja, als eigener Commit im Spiel umgestellt.

**Fertig, wenn** keine Datei des Spiels mehr an zwei Stellen im Editor gehalten wird.

## F7 · Die Tools scheitern laut, validate sieht mehr

| Befund | Stelle | Korrektur |
|---|---|---|
| `play.mjs` meldet „all passed“, wenn das Spiel vor dem Ende des Pfads endet. | `tools/play.mjs:167` | Das frühe Ende gilt nur, wenn es das Ende einer Demo ist; sonst scheitert der Pfad. |
| `shot.mjs` schreibt bei einer Seite, die nicht lädt, ein Bild der Fehlerseite und endet mit 0. | `tools/shot.mjs:37`, `tools/lib/chrome.mjs:71-74` | `open()` wirft, wenn `window.Cutaway` nach der Frist fehlt. |
| `send` hat keine Frist und hört nicht auf das Schließen des Sockets; eine abgestürzte Seite lässt `play` und `shot` hängen. Der Port ist zufällig und wird nicht noch einmal versucht (nur gelesen). | `tools/lib/chrome.mjs:25`, `:53-55` | Eine Frist je Befehl, ein Fehler beim Schließen des Sockets, ein zweiter Versuch mit anderem Port. |
| validate nimmt `{ give: …, if: … }` und `{ if: …, than: […] }` hin; die Engine tut dann nichts. | `tools/lib/validate.mjs:112` | Ein Schritt mit `if` oder `once` darf nur `if`, `then`, `else`, `once` tragen; alles andere ist ein Fehler. |
| validate nimmt `null` in einer Skriptliste hin; die Engine bricht dort ab und verliert den Rest. | `validate.mjs:116-117`, `src/script.js:115` | Ein Fehler. |
| Ein `once` an derselben Stelle im `then` und im `else` eines `if` (oder im `once` und seinem `else`) teilt sich einen Schlüssel. | `src/script.js:115-118` | validate meldet es als Fehler. Die Engine bleibt, wie sie ist: Andere Pfade für die Zweige würden die `once`-Marken in jedem alten Spielstand entwerten, auch in denen von The Loonies, und in keinem der Spiele kommt der Fall vor. |
| Der `prologue` eines Akts nennt keine Sequenz; der `act` eines Hinweises wird nicht gegen die Akte geprüft; `"time>=22"` vergleicht Minuten mit 22 und gilt immer. | `validate.mjs:376-383`, `:417-424`, `:88` | Je ein Fehler; für `time` gegen eine blanke Zahl eine Warnung. |

**Tests** (`tests/tools.test.mjs`): je ein Fall für jede Zeile.

**Im Spiel danach:** `validate` (neue Fehler sind echte und werden im Spiel behoben) und alle Klickpfade, weil
`play.mjs` strenger wird.

**Fertig, wenn** jedes Tool bei einem Fehlschlag einen Exit-Code ungleich 0 gibt.

## F8 · Kleine Fehler der Laufzeitlogik

| Befund | Stelle | Korrektur |
|---|---|---|
| `!=` kennt `time` und `day` nicht: `"time!=22:00"` gilt um 22:00, `"day!=1"` gilt am ersten Tag, bevor `day` gesetzt ist. | `src/state.js:75`, `:110` | `!=` liest durch denselben Weg wie `=` und kehrt um. |
| Leerzeichen gehen bei jedem Operator außer `=`: `"count = 3"` ist immer falsch. | `src/state.js:80-82` | Beide Seiten werden gekürzt. |
| Ein Wert in Uhrform macht `=` numerisch; `"station=ninth:live"` wirft. | `src/state.js:80-82` | Ist der Wert des Flags keine Zahl, wird als Text verglichen. |
| `hidden:x` übersieht ein `hidden: true` aus den Daten. | `src/state.js:89` | Die Bedingung fragt den Stand mit dem Wert der Daten. Vorher prüfen, ob der Tracer auf dem heutigen Verhalten steht (`hidden:` zählt dort nur, was ein Skript setzte). |
| Ein Moment mit einer Liste von Tagen läuft nie ungesehen ab, wenn seine Tage vorbei sind. | `src/time.js:157` | Bei einer Liste gilt ein Tag nach dem letzten als vorbei. |
| `Cutaway.time.reset()` wird nirgends gerufen; nach einem zweiten „Neues Spiel“ steht ein Akteur mit Routine an seinem Datenplatz. | `src/time.js:266` | `acts.reset()` und `save.apply()` rufen es (zusammen mit `script.abort()` aus F2). |
| `unlock()` schreibt nur die Akte dieses Builds zurück und vergisst die anderen. | `src/acts.js:116-126` | An die rohe Liste anhängen, erst beim Lesen filtern. |
| Ein Wort, das breiter als die Zeile ist, wird nicht umbrochen und läuft aus dem Kasten. | `src/font.js:83-96` | Ein solches Wort wird an den Zeichen gebrochen. |

**Tests:** `tests/script.test.mjs` (Bedingungen), `tests/time.test.mjs`, `tests/acts.test.mjs`,
`tests/presentation.test.mjs` (Umbruch).

**Im Spiel danach:** `validate`, `play.mjs … spiel.json`, und weil Bedingungen und Zeiten den Solver betreffen,
der Solver für Prolog und Hauptfaden.

## F9 · Bild und Ton

| Befund | Stelle | Korrektur |
|---|---|---|
| Hall, Reverb und Delay der Musik gehen an Musiklautstärke, Spuren, Ducking und Ausblenden vorbei; bei Musik auf 0 bleibt der Hall hörbar. Dasselbe bei Klängen mit `inst` gegen die Effektlautstärke. | `src/music/synth.js:126-129`, `src/audio.js:77-86` | Die Sends werden hinter der Lautstärke genommen, zu der sie gehören: je ein Hall-, Reverb- und Delay-Bus für Musik und für Effekte, der in seinen Bus zurückführt. |
| Die Lautstärke der Musik und das Ducking schreiben in denselben Gain; eine Änderung der Einstellung während einer Zeile nimmt das Ducking weg. | `src/audio.js:125`, `src/music/director.js:142-144` | Ein eigener Gain für das Ducking. |
| Ein zweiter Wechsel der Intensität im selben Takt lässt eine Spur etwa 0,3 s aussetzen. | `src/music/director.js:52-58` | `cancelAndHoldAtTime(time)` vor der Rampe. |
| Pfeiltasten im Menü werden von einer ruhenden Maus zurückgesetzt, weil `hover` in jedem Frame die Zeile neu wählt. | `src/menu.js:391-398`, `src/ui.js:342-350` | Die Zeile unter dem Zeiger gilt nur, wenn sich der Zeiger bewegt hat. |
| Eine farbige Blende lässt ihre Farbe jedem späteren Raumwechsel; der Blitz, den `docs/reference.md:216` empfiehlt, macht den nächsten Übergang weiß. | `src/fx.js:219-220`, `:388-393` | `transition()` gibt seine eigene Farbe mit (schwarz). |
| Ein `dissolve` zeigt das alte Bild ohne die Post-Effekte des Raums. | `src/fx.js:243-248` | `post.render` auch auf das alte Bild, solange der Raum der alte ist. |
| Bei gebrochenem `devicePixelRatio` und einem Fenster, das keine ganze Zahl von Gerätepixeln hat, wird das Bild neu abgetastet. | `src/display.js:57`, `:76-83` | Die CSS-Größe des Canvas ist `dw / dpr` mal `dh / dpr` Pixel. Gemessen wurde nur mit emuliertem dpr: Der Schritt endet mit einem Blick auf einen echten Bildschirm bei 125 % und 150 %. |
| Die Timeline stellt die Musik und den Lautsprecher-Anteil nach dem Schließen nicht wieder her. | `src/timeline.js:64-87` | `freeze` hält auch `music.state`, `audio.speakerAmount`, das Band und die Blendenfarbe; `thaw` setzt sie nach dem Laden des Raums. |

**Tests:** `tests/music.test.mjs` (Musik auf 0 rendert Stille; eine Spur auf stummer Ebene rendert Stille),
`tests/settings.test.mjs` (Pfeiltasten mit ruhendem Zeiger), `tests/cinema.test.mjs` (Blendenfarbe, `dissolve` mit
Post-Effekt), `tests/timeline.test.mjs` (Musik nach `close()`).

**Im Spiel danach:** `validate`, `play.mjs … spiel.json`, `node tools/render-sounds.mjs` und ein Ohr auf die drei
Sender: Mit dem Hall hinter der Lautstärke klingt die Musik bei mittlerer Lautstärke etwas trockener als heute.
Screenshots der Feeds in 1x und 3x, weil `dissolve` und die Post-Effekte dort zusammenkommen.

## F10 · Der Editor trifft die richtige Stelle, Undo ist vollständig

| Befund | Stelle | Korrektur |
|---|---|---|
| Der Schedule-Tab findet einen Aufruf über den ersten Treffer seiner id im Text: in einer auskommentierten Kopie, im ersten von zwei gleichnamigen Aufrufen, in der falschen Zeile nach einer ungespeicherten Änderung darüber, und einen Eintrag über seinen Index, der hinter einem Spread nicht stimmt. | `src/editor-schedule.js:300-311`, `:329-331`; ebenso `src/editor-sequences.js:399-404` | Treffer in Kommentaren und Strings zählen nicht (der Leser aus `editor-literal.js` kennt sie); von mehreren Treffern gilt der an der Zeile aus dem Stack; ein Spread vor dem Eintrag wird als „im Code berechnet“ abgelehnt; vor dem Schreiben wird das gefundene Objekt mit dem Eintrag im Spiel verglichen. |
| `removeKey` schreibt `{}`, wenn der Schlüssel der erste ist und ein Spread folgt: Zeiten und Raum des Eintrags sind aus der Datei. | `src/editor-literal.js:152-158` | Ein Objekt mit Spread wird als berechnet abgelehnt. |
| Ein Schritt `{ ...base, wait: false }`, dessen geänderter Wert aus `base` kommt: Nichts wird geschrieben, der Status meldet trotzdem Erfolg. | `src/editor-literal.js:246-252`, `:284` | Ein geänderter Schlüssel ohne Feld in einem Objekt mit Spread wird abgelehnt. |
| In Dateien mit CRLF bekommen eingefügte Schritte nur `\n`, und ein entfernter Schritt lässt seinen Kommentar oder eine leere Zeile stehen. | `src/editor-literal.js:220-221`, `:234` | Das Zeilenende der Datei erkennen und nehmen; `\r?` in der Prüfung. |
| Undo zurück zum Original lässt eine volle Kopie in der Edits-Schicht; sie überstimmt spätere Handänderungen. | `src/editor-sequences.js:446`, `editor-dialogue.js:64`, `editor-script.js:574` | Beim Undo `edits.revert` für den Pfad, wenn der Wert wieder `edits.original` ist. |
| `edits.revert(kind, id)` ohne Pfad lässt verschachtelte Zusätze in den Daten des Spiels. | `src/layers.js:144-150` | Die verschachtelten Objekte aus `before` ersetzen statt zusammenführen. |
| Ein Eintrag der Schicht für einen Hotspot, den das Spiel entfernt hat, macht einen Hotspot ohne Form, der für immer in den Listen und in `edits.js` bleibt. | `src/layers.js` (`merge`) | Hotspots, die der Raum nicht hat, werden übersprungen; validate meldet sie. |
| Undo im Room-Tab: „+ Hotspot“ lässt einen Hotspot ohne Form zurück; eine zum ersten Mal gesetzte `baseline` und ein `face` an einem Hotspot ohne eigene Form werden nicht zurückgenommen (die letzten beiden nur gelesen). | `src/editor.js:530-546`, `:418-436` | Der Schnappschuss hält auch, welche Schlüssel fehlten und ob es den Hotspot gab. |
| Ein Balken, über den Tagesanfang gezogen, endet vor seinem Beginn (nur gelesen). | `src/editor-schedule.js:234-237`, `:260-262` | Das Ziehen bleibt in der Spanne des Tages und prüft `from < to` wie die Felder. |
| Die Felder in Things haben kein Undo und nehmen alles: Ein geleertes `at` lässt `room.js:423` werfen (nur gelesen). | `src/editor-things.js:173-177` | Prüfung je Feld (`at`, `size`, `scale`) und ein Undo für Felder. |

Das schrittweise Ändern von Listen in `editor-literal.js` hat in 20 000 zufälligen Fällen kein kaputtes JavaScript
geschrieben; daran wird nichts geändert.

**Tests:** `tests/editor-map.test.mjs` (die vier Fälle von `locate`, das Ziehen), `tests/editor-sequences.test.mjs`
(Spread, CRLF, Undo zum Original), `tests/layers.test.mjs` (`revert`, der Hotspot, den es nicht mehr gibt),
`tests/editor.test.mjs` (Undo im Room-Tab).

**Im Spiel danach:** `validate`; von Hand im Schedule-Tab an `game/kapitel1_ende.js` ohne Speichern, weil dort
Momente aus Hilfsfunktionen und berechnete Werte stehen.

## F11 · Studio-Server und Werkzeuge härten

Der Server bindet nur an 127.0.0.1, weist `..`, absolute Pfade und fremde Origins ab und gibt den Token nirgends
heraus. Was bleibt, ist klein.

| Befund | Stelle | Korrektur |
|---|---|---|
| `inside()` vergleicht nur den Text des Pfads; über eine Junction in einem schreibbaren Ordner wird außerhalb geschrieben und gelöscht. | `tools/studio.mjs:59-63` | `realpathSync` des nächsten vorhandenen Elternordners gegen die echte Wurzel. |
| Statische Dateien brauchen keinen Token und der Host-Header wird nicht geprüft; eine Seite mit DNS-Rebinding kann die Dateien des Spiels lesen. | `tools/studio.mjs:143-150` | Ein anderer Host als `127.0.0.1:<port>` oder `localhost:<port>` wird abgelehnt. |
| Unter Windows werden die Argumente einer Aufgabe mit `shell: true` ungeschützt aneinandergehängt. Die `vars` aus der Anfrage sind sicher; es betrifft, was in `studio.json` steht. | `tools/studio.mjs:82` | Die Argumente für cmd quotieren. |
| Nach zehn Minuten beendet `p.kill()` unter Windows nur die Shell; ihre Kinder laufen weiter (nur gelesen). | `tools/studio.mjs:86` | Den Prozessbaum beenden (`taskkill /T /F`). |
| Der Titel eines neuen Spiels kommt nur mit maskiertem `"` in `game.js`; ein Backslash bricht die Datei (nur gelesen). | `tools/new-game.mjs:156`, `:166` | `JSON.stringify`. |
| Das erzeugte `sync-engine.sh` löscht `lib/cutaway`, bevor es kopiert; ein gescheitertes Kopieren lässt den Ordner halb (nur gelesen). | `tools/new-game.mjs:53-59` | In einen Ordner daneben kopieren, dann tauschen. `tools/sync-engine.sh` hier wird auf dasselbe Muster geprüft und gleich behandelt. |

**Tests:** `tests/studio.test.mjs` (Junction, Host), `tests/new-game.test.mjs` (ein Titel mit Backslash).

**Im Spiel danach:** `validate`; das Studio einmal starten und eine Aufgabe laufen lassen („art: room“).

---

## Was dieser Plan entscheidet

Das sind technische Entscheidungen; sie gelten, solange der Nutzer nichts anderes sagt.

- **Speichern während eines Skripts schreibt den Stand von vor dem Skript** (F3). Die Alternative, erst nach dem
  Skript zu schreiben, verliert den Stand, wenn der Spieler gleich danach das Fenster schließt.
- **Ein Moment, der in einem Skript spielt, gehört zu diesem Skript** (F3, beim Bauen entschieden): Ein Speichern
  mittendrin ist der Stand von vor dem Skript, nicht von unmittelbar vor dem Moment.
- **Ein Skript, das während des Gangs zu einem Hotspot beginnt, nimmt den Klick nicht weg** (F2, beim Bauen
  entschieden), weil ein Spiel unterwegs eine Zeile sagen darf.
- **Die `once`-Kollision wird von validate gemeldet, die Engine bleibt** (F7), damit kein alter Spielstand seine
  `once`-Marken verliert.
- **Der Editor weigert sich zu schreiben, wenn die Datei auf der Platte anders ist, und fragt** (F6), statt
  zusammenzuführen.
- **Der Hall liegt hinter der Lautstärke** (F9); die Musik klingt dadurch bei mittlerer Lautstärke etwas trockener.

## Was offen bleibt

- Die Pixelgenauigkeit bei 125 % und 150 % ist nur mit emuliertem dpr gemessen; F9 braucht einen echten Bildschirm.
- `node tests/run.mjs` lief während der Review nicht; alle Befunde stehen gegen `b877f26`, wie es eingecheckt ist.
- Die Zeilennummern in F4 bis F11 gelten für `b877f26`; seit F1 bis F3 sind sie in `script.js`, `save.js`,
  `actor.js`, `dialog.js`, `ui.js`, `menu.js` und `solver.mjs` verschoben.
- In F8 ruft `save.apply()` schon `script.abort()`; `Cutaway.time.reset()` kommt dort dazu.

## Was ohne Befund blieb

`walk.js`, `light.js`, `post.js`, `sfx.js`, `voice.js`, `debug.js`, `hints.js`, `graph-view.js`, der Sequencer der
Musik und das Schließen des Editors (Uhr, Ton, Listener und Kamera werden freigegeben).

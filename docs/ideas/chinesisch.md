# Vereinfachtes Chinesisch: Test mit dem Deck (2026-11-04)

Test: `art/test/cjk_deck.px.js`, Bild `docs/mockups/zh_deck_compare_x2.png` (links Deutsch, rechts
Chinesisch, gleiche Fenster). Die Zeichen sind SimSuns 12-px-Bitmaps, nur für den Test gerastert
(`tools/cjk-raster.mjs`; SimSun darf nicht mit ausgeliefert werden).

## Was der Test zeigt

- **Lesbar ja, in 12 px.** Chinesische Pixelschriften brauchen 12 px (10 px geht knapp, 8 px nur für sehr
  kurze Beschriftungen). Unsere 5x7 und die 3x5-HUD-Schrift haben dafür keinen Ersatz: Was heute 3x5 ist
  (Beschriftungen, Knöpfe, das OSD), wird in Chinesisch 12 px hoch.
- **Chinesisch ist kürzer, aber höher.** Ein Satz braucht etwa so viel Breite wie im Deutschen, aber die
  Zeilen sind 13–14 statt 10 px hoch; die HUD-Zeilen 12–14 statt 7.
- **Was im Mockup bricht**, wenn man nur die Texte tauscht:
  - der Verlauf im Chat: die dritte Nachricht rutscht unter die Antworten (die Zeilen sind höher);
  - Namen: „凯斯勒太太“ (5 Zeichen, 64 px) stößt an den Punkt für „neu“, „HALCYON 服务“ läuft aus der Spalte;
  - die Symbole: „回收站“ ist breiter als die Zelle und stößt an das Nachbarsymbol;
  - die Kopfleiste wird 15 statt 11 px hoch;
  - EVIs Zeile läuft in EVI hinein.

## Was daraus für den Bau folgt (H2b schon so bauen)

1. **Das Deck rechnet sein Layout aus der Schrift**: Zeilenhöhen und Breiten kommen von der Schrift der
   Sprache, nicht als feste Pixel; Listen und der Chat-Verlauf scrollen; zu lange Namen enden mit „…“;
   Knöpfe sind so breit wie ihre Beschrift. Das kostet jetzt wenig und erspart später einen Umbau.
2. **Die Engine** (später, H10-Vorarbeit, generisch):
   - eine Ersatzkette für Schriften (`halcyon` → eine CJK-Schrift für Zeichen, die ihr fehlen; auch für `hud`);
   - Zeilenumbruch nach Zeichen für Sprachen ohne Leerzeichen, mit den Regeln, dass `，。！？、` nie am
     Zeilenanfang stehen;
   - Untertitel und Auswahlen mit der Zeilenhöhe der Schrift (heute fest).
3. **Die Schrift**: eine freie Pixelschrift mit OFL-Lizenz, z. B. Fusion Pixel Font oder Ark Pixel Font
   (12 px, es gibt auch 10 und 8 px), beim Bauen auf die Zeichen beschnitten, die das Spiel wirklich
   benutzt (ein Werkzeug sammelt sie aus der zh-Tabelle).
4. Der Slang der Stadt bleibt Englisch (Glass, Shine, Chits, HALCYON), wie in den anderen Sprachen.

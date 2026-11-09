# Figuren-Index

Porträts für Marketing und zum Auseinanderhalten der Figuren, nicht fürs Spiel. Die Schattierung ist flach, nur Ashe hat eine feinere (Mantel): So hat es der Nutzer entschieden, auf den anderen gefiel sie ihm nicht. Quelle: `art/portraits/portraits.px.js`.

## Juno und Teo

Teo steht im Index vor Juno. Beide sind frontal gezeichnet (Entscheidung des Nutzers, 2026-11-06), nach seiner Vorlage: Gesichtskontur, Haare und Brauen sind auf unser Raster abgetastet und in unsere Töne übertragen, die Augen unter einem Raster abgelesen, bei Juno unten aufgeräumt, damit die Iris klar bleibt. Nase und Mund sind nicht aus der Vorlage, Junos Mund (klein und voll, ein Strich an jedem Winkel) hat der Nutzer so gewählt.

Die Vorlage gibt die Art vor, die Seitenansicht die Maße: Frontal und Profil stehen in `juno_teo_seite_front_x3.png` nebeneinander und müssen zusammenpassen. Wer an einem der vier Bilder etwas ändert, vergleicht es dort.

- **Teo frontal:** dieselben drei Hauttöne wie im Profil (`#c99a8c`, `#93665c`, `#583841`), das Haar beginnt bei `y=7`, die Augen liegen bei `y=47`, das Kinn bei `y=84`. Das rechte Ohr sitzt 2 Pixel näher am Kopf als in der Vorlage. Statt des Gehörschutzes aus der Story trägt er hier Kragen und zwei Gurte mit Schnallen, wie in der Vorlage. Sein Lull-Pflaster sieht man von vorn nicht, es sitzt hinter dem Ohr; man sieht es im Profil.
- **Juno frontal:** Die Kapuze ist so groß wie im Profil, oben und an den Seiten bleibt Hintergrund, was vom Haar nicht in die Öffnung passt, verdeckt sie. Ein schmaler Wangenstreifen auf ihrer linken Wange, 1 Pixel dick, wie auf dem Titelbild (das Spiel selbst zeigt ihn sonst nirgends, Style Guide §6).
- **Die Profile** sind aus dem Titelbild geschnitten (`tools/portrait-title.py`, danach `art/portraits/{juno,teo}_title.png`) und bleiben in der Quelle als `portrait_juno_profil` und `portrait_teo_profil`. Ihre Schultern enden schon im Titelbild vor dem Riss, dort ist Hintergrund (`vestFront` und `COAT_FRONT` in `art/ui/splash.px.js`): Teos Weste endet vorn an einer geraden Schräge, Junos Mantel an einer Tintenlinie, die nach unten ausläuft. Wer das ändert, ändert Titelbild und Profile zugleich und lässt danach das Werkzeug laufen.

## Die Dateien

Die ganze Reihe: `figuren_index_x3.png`. Die Geschwister von vorn und von der Seite: `juno_teo_seite_front_x3.png`. Jede Figur gibt es als `<id>_x4.png` mit Namen und als `<id>_ohne_name_x4.png` ohne.

**Spoiler:** Ashe, Ines und Lantern gehören ans Ende von Kapitel 1. Sie sollten im Marketing besser zurückgehalten werden.

**Noch ohne Porträt:** Mei, Herr Okonkwo (mit seinem Schildkröten-Mod), Lt. Morrow, der Tidewater-Junge und Ratz. Ihre Figuren im Spiel sind gemalt (`docs/characters/`), ihre Porträts fehlen noch.

| Datei (`<id>`) | Name | Wer | |
|---|---|---|---|
| `teo` | Teo Reyes | Junos jüngerer Bruder, Tideboy in der Pumpenhalle | |
| `juno` | Juno Reyes | Glasserin im Lower Ninth, gelber Regenmantel | |
| `evi` | EVI | die neugierige KI auf Junos Deck | |
| `motte` | Motte | Kurierkind, zwölf, zählt alles mit | |
| `bao` | Bao | die Nudelküche vor dem LUCKY STATIC, seit Jahrzehnten; der Kopf steht in der Bildmitte; die Kelle ist eine echte Schöpfkelle, nach einem Foto des Nutzers: langer gerader Stiel, halbkugeliger Kopf, die Öffnung zu ihm hin; sie steht vor seinem Kopf, ihre Spitze liegt auf der Stirn | |
| `haldane` | Frau Haldane | Nachbarin aus 14C, immer müde, immer freundlich | |
| `regenleserin` | Die Regenleserin | 82, kostet auf dem Dach den Regen; ihr Tier ist der Wels: der breite flache Kopf, milchige Augen weit auseinander, eine Bartel hängt in den Eimer | |
| `imai` | Frau Imai | Stammgast im LUCKY STATIC, langsam und müde, in ein schweres Tuch gewickelt; ihr Tier ist das Faultier: drei viel zu lange Finger an der Wange, ein dunkler Streifen vom Auge nach hinten, Moos im Haar; hinter dem Ohr das Lull-Pflaster | |
| `prediger` | Der Prediger | Wache Kirche, seit Tagen wach, schenkt Kaffee aus; sein Tier ist der Gecko: riesige lidlose Augen | |
| `monteur` | Der Monteur | wohnt auf dem Gerüst am großen Werbeschirm; sein Tier ist der Maulwurf: die rosa Schnauze, winzige Pfoten, die Stirnlampe sieht für ihn | |
| `kessler` | Herr Kessler | kleiner Angestellter der Pumpenbehörde, mit Schulden; keine Hand am Schal | |
| `varga` | Gus Varga | Geldverleiher, ruhig wie eine Rechnung | |
| `sable` | Sable | Hehlerei auf dem Drain-Markt, kauft alles, was atmet | |
| `koch` | Der Koch von Yuen's | steht am Herd und hat alles schon gesehen | |
| `ines` | Dr. Ines Calder | Schlaftechnikerin in einer Lull-Klinik; der Zopf kommt hinter dem Kiefer hervor | **Spoiler** |
| `lantern` | Lantern | Oskar Lind, Piratensender: grüner Iro, Okular, Antennen, eine kleine Laterne um den Hals; das Porträt zeigt den Rollstuhl nicht | **Spoiler** |
| `ashe` | Corvin Ashe | der Mann im weißen Regenmantel | **Spoiler** |

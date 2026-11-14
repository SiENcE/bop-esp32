// Nagiwa: NETZ, Nagi·wa-Net on the deck, as a small browser (kapitel0-design §2.1; the user's decisions of 2026-11-08):
// the start page of the evening (Nagiwa.netz, filled by the chapters: each entry in its row, `slot`,
// one that opens a page names it, `page`), bookmarks (START, NAGI·WA, BRETT, ARCHIV, SUCHE), list pages, articles
// and board threads (their text scrolls; links stand only in rows, so every one is a hotspot of the deck), and a
// search without typing: the terms Juno knows are buttons, and not everything can be found yet. Only the world:
// nothing here is needed to play, and the page open is a view flag (`netz_page`), no state for the solver.
// Texts are written in German; the city's labels stay English.
"use strict";

(function () {
  // the page open, and where it was opened from (ZURÜCK goes there: the start page or a search's hits; else the list above it)
  Cutaway.state.view("netz_page", "netz_from");
  // NETZ opens on the start page
  (Nagiwa.appOpen.netz ??= []).unshift({ unset: "netz_page" }, { unset: "netz_from" });
  // { netz_back: true }: ZURÜCK
  Cutaway.script.action("netz_back", () => {
    const S = Cutaway.state, page = String(S.peek("netz_page") ?? ""), from = S.peek("netz_from");
    const to = from ?? (/^such_/.test(page) ? "suche" : Nagiwa.netzPages[page]?.up ?? "start");
    S.unset("netz_from");
    if (to === "start") S.unset("netz_page"); else S.set("netz_page", to);
    Cutaway.events.emit("sfx", { sfx: "type" });
  });

  /**
   * The pages. A list (`rows`: a page each, while its `if` holds) or a text: an article (`text`: paragraphs, `by`)
   * or a thread (`posts`: who wrote what, each while its `if` holds). `up`: where ZURÜCK goes (a list or SUCHE).
   * @type {Record<string, {title: string, label?: string, up?: string, rows?: {page: string, if?: any}[], text?: string[], by?: string,
   *   posts?: {by: string, text: string, if?: any}[]}>}
   */
  Nagiwa.netzPages = {
    // ---------------------------------------------------------------- NAGI·WA: the company speaks
    nagiwa: { title: "NAGI·WA // FÜR SIE DA", rows: [{ page: "lull" }, { page: "rekordtief" }, { page: "huelle" }, { page: "schlafstation" }] },
    lull: { title: "LULL // SLEEP BETTER", label: "Lull: Besser schlafen", up: "nagiwa", by: "Nagi·wa Gesundheit", text: [
      "Vier Stunden, die sich anfühlen wie zehn.",
      "Lull ist Nagi·was Geschenk an alle, die hart arbeiten. Ein kleiner Punkt hinter dem Ohr, und Ihre Nacht gehört wieder Ihnen.",
      "Jetzt gratis in jeder Ausgabestelle, im ganzen Neunten. Ein Geschenk von Nagi·wa.",
      "Lull-Nutzer berichten von ruhigen, klaren Träumen.",
      "Fragen? Die Lull-Kliniken im Neunten sind für Sie da." ] },
    rekordtief: { title: "KRIMINALITÄT AUF REKORDTIEF", label: "Kriminalität im Neunten auf Rekordtief", up: "nagiwa", by: "Nagi·wa Sicherheit", text: [
      "Sechs Jahre. Achtzig Prozent weniger.",
      "Nagi·wa dankt den Bürgern des Neunten Rings für ihre Mitarbeit. Die automatische Auswertung sieht, was Menschen übersehen, und sie wird nie müde.",
      "Ein sicherer Neunter ist ein ruhiger Neunter. Ihre Meldung zählt." ] },
    huelle: { title: "IHRE HÜLLENABGABE", label: "Ihre Hüllenabgabe", up: "nagiwa", by: "Nagi·wa Wohnen", text: [
      "Über Ihnen tragen acht Ringe das Leben einer ganzen Stadt. Ein Teil Ihrer Miete hält sie dort.",
      "Die Hüllenabgabe wird ab Dezember angepasst. Nagi·wa dankt für Ihr Verständnis.",
      "Sie geht mit der Familie weiter, wie ein Versprechen. Den Stand Ihres Haushalts sehen Sie in Ihrem Konto." ] },
    schlafstation: { title: "SCHLAFSTATIONEN", label: "Schlafstationen: Fürsorge, wenn Ruhe zu tief wird", up: "nagiwa", by: "Nagi·wa Gesundheit", text: [
      "Manchmal braucht ein Körper mehr Ruhe, als eine Nacht ihm geben kann. Wir nennen das Ruhe-Erschöpfung.",
      "Betroffene Bürger werden in Nagi·was Schlafstationen gebracht und dort versorgt. Sie sind in guten Händen.",
      "Angehörige werden benachrichtigt, sobald es etwas zu sagen gibt." ] },
    ruhe: { title: "KEIN GRUND ZUR SORGE", label: "Ruhe-Erschöpfung: kein Grund zur Sorge", up: "nagiwa", by: "Nagi·wa Gesundheit", text: [
      "Einzelne Fälle von Ruhe-Erschöpfung im Neunten sind kein Grund zur Sorge, sagen Nagi·was Ärzte.",
      "Wer Lull richtig nutzt, schläft sicher. Die Lull-Kliniken im Neunten haben jetzt auch nachts geöffnet.",
      "Gerüchte über sogenannte Sinker entbehren jeder Grundlage." ] },

    // ---------------------------------------------------------------- the Glasser board: the Ninth writes as it types
    brett: { title: "GLASSER-BRETT", rows: [{ page: "automat" }, { page: "aufzug" }, { page: "abzweiger", if: "day>1" }, { page: "vater", if: "day>2" }, { page: "wach" }] },
    automat: { title: "NUDELAUTOMAT KOWALSKI", label: "Nudelautomat Ecke Kowalski frisst Chits", up: "brett", posts: [
      { by: "K.", text: "Der Automat Ecke Kowalski frisst Chits. Schon wieder." },
      { by: "anonym", text: "Du musst links dagegen treten. Nicht rechts. Links." },
      { by: "K.", text: "Hab links getreten. Jetzt hat er auch meinen Schuh." },
      { by: "Bao", text: "Ich hab Brühe. Die nimmt keine Schuhe." } ] },
    aufzug: { title: "AUFZUG KESSEL-BLOCK", label: "Fährt der Aufzug im Kessel-Block wirklich dienstags?", up: "brett", posts: [
      { by: "14A", text: "Fährt der Aufzug im Kessel-Block wirklich dienstags?" },
      { by: "3F", text: "Ich wohn seit elf Jahren hier. Ich hab ihn einmal fahren sehen. Er war leer." },
      { by: "14A", text: "An einem Dienstag?" },
      { by: "3F", text: "Weiß ich nicht mehr. Es war spät." } ] },
    abzweiger: { title: "SUCHE ABZWEIGER", label: "Suche Abzweiger, zahle bar", up: "brett", posts: [
      { by: "anonym", text: "Suche Abzweiger, zahle bar. Bitte nicht Ratz." },
      { by: "anonym", text: "Warum nicht Ratz?" },
      { by: "anonym", text: "Er redet." },
      { by: "anonym", text: "Er ist eine Ratte. Natürlich redet er." } ] },
    vater: { title: "MEIN VATER WACHT NICHT AUF", label: "Wer weiß was über Ruhe-Erschöpfung?", up: "brett", posts: [
      { by: "L., Kowalski-Straße", text: "Wer weiß was über Ruhe-Erschöpfung? Mein Vater wacht nicht auf." },
      { by: "anonym", text: "Bring ihn in eine Lull-Klinik. Die haben jetzt nachts auf." },
      { by: "M.", text: "Bei meiner Schwester war's genauso. Sie haben sie geholt. Seitdem hab ich nichts gehört." },
      { by: "L., Kowalski-Straße", text: "Mein Vater ist weg. Zwei in Weiß haben ihn abgeholt. Sie waren sehr freundlich.", if: "day>3" } ] },
    wach: { title: "BLEIBT WACH", label: "Bleibt wach.", up: "brett", posts: [
      { by: "Die Wache Kirche", text: "Bleibt wach. Wer schläft, sieht nicht, was er sieht. Kaffee jeden Abend am Drain-Markt." },
      { by: "anonym", text: "Wer schläft, sieht nicht, was er sieht. Hä?" },
      { by: "anonym", text: "Gibt's den Kaffee umsonst?" },
      { by: "Die Wache Kirche", text: "Nein." } ] },

    // ---------------------------------------------------------------- ARCHIV: someone in the Ninth keeps what the water took
    archiv: { title: "WAS DAS WASSER NAHM // EIN ARCHIV", rows: [{ page: "flut" }, { page: "ringe" }, { page: "gezeiten" }] },
    flut: { title: "DIE FLUT", label: "Die Flut", up: "archiv", by: "das Archiv", text: [
      "Unter dem Neunten liegt eine Stadt. Sie hatte Straßen mit Namen, einen Hafen und Ampeln, die man nicht beachtet hat.",
      "Das Meer kam nicht an einem Tag. Es kam jedes Jahr ein Stück, bis die Keller voll waren und dann die Erdgeschosse.",
      "Wer blieb, zog nach oben. Wer heute im Neunten wohnt, stammt meistens von denen ab, die geblieben sind." ] },
    ringe: { title: "DIE RINGE", label: "Die Ringe", up: "archiv", by: "das Archiv", text: [
      "In den Fünfzigern hat Nagi·wa angefangen, über dem Wasser zu bauen. Erst die Pumpen, dann den ersten Ring.",
      "Heute sind es neun. Unten der Neunte, ganz oben die Krone. Dazwischen die Transitachse, der einzige Weg nach oben.",
      "Den Bau der Ringe hat Nagi·wa denen in Rechnung gestellt, über deren Köpfen sie stehen. Die Rechnung ist noch offen." ] },
    gezeiten: { title: "DIE GEZEITENLEUTE", label: "Die Gezeitenleute", up: "archiv", by: "das Archiv", text: [
      "In den Sechzigern brauchte Nagi·wa Leute für die Pumpen und Schleusen. Es hat sie umgebaut: Kiemen am Hals, Häute über den Augen, Licht auf der Haut.",
      "Das Programm ist lange vorbei. Die Mods sind geblieben. Man erbt sie, oder man kauft sie nach, auf dem Drain-Markt.",
      "Wer einmal einen Gezeitenmann im Dunkeln schwimmen gesehen hat, vergisst das Licht nicht." ] },

    // ---------------------------------------------------------------- NINTH LIVE: the Krone watches the Ninth
    ninthlive: { title: "NINTH LIVE // TONIGHT", label: "NINTH LIVE: echtes Leben aus dem Neunten", up: "start", by: "NINTH LIVE", text: [
      "Echtes Leben. Echte Menschen. Kein Drehbuch.",
      "Heute: ein Streit um einen Regenschirm, Kowalski-Straße. Ein Abschied am Aufzug, Transitachse. Ein Mann, der seit Stunden auf jemanden wartet.",
      "Die Menschen im Neunten wissen nicht, dass Sie zusehen. Deshalb ist es echt." ] },
  };

  /**
   * SUCHE: the terms as buttons (two columns, `if`: once Juno knows the word), what each finds (`hits`: pages, each while
   * its `if` holds) or what the page says when it finds nothing (`none`).
   * @type {{term: string, if?: any, hits: {page: string, if?: any}[], none?: string}[]}
   */
  Nagiwa.netzSearch = [
    { term: "Lull", hits: [{ page: "lull" }, { page: "ruhe", if: "day>2" }, { page: "vater", if: "day>2" }] },
    { term: "Nagi·wa", hits: [{ page: "rekordtief" }, { page: "huelle" }, { page: "schlafstation" }] },
    { term: "Flut", hits: [{ page: "flut" }, { page: "ringe" }, { page: "huelle" }] },
    { term: "Sinker", hits: [], none: "Keine Treffer. Meinten Sie: Ruhe-Erschöpfung?" },
    { term: "Kessler", hits: [], none: "Keine Treffer." },
    { term: "NINTH LIVE", hits: [{ page: "ninthlive" }] },
    { term: "Glasser", hits: [], none: "Keine Treffer. Ihre Suche wurde gespeichert." },
    // terms Juno learns later come last, so the buttons she has keep their places
    { term: "Ruhe-Erschöpfung", if: "day>2", hits: [{ page: "ruhe" }, { page: "schlafstation" }, { page: "vater" }] },
  ];

  Cutaway.i18n.declare("netz", ["START", "NAGI·WA", "BRETT", "ARCHIV", "SUCHE", "ZURÜCK", "HEUTE", "MELDUNG", "ANZEIGE", "LIVE", "Wonach suchen Sie?",
    "Keine Treffer.", "TREFFER FÜR „{term}“",
    ...Object.values(Nagiwa.netzPages).flatMap((p) => [p.title, p.label, p.by, ...(p.text ?? []), ...(p.posts ?? []).flatMap((q) => [q.by, q.text])]).filter((x) => typeof x === "string"),
    ...Nagiwa.netzSearch.flatMap((s) => [s.term, s.none]).filter((x) => typeof x === "string")]);
})();

import type { ToolContent } from './types';

// Deutsch. Keine Wort-für-Wort-Übersetzung, sondern Transkreation mit den Begriffen,
// die im Deutschen tatsächlich verwendet werden, um das winmail.dat-Problem von
// Outlook zu erklären. Keine Werbefloskeln (einfach / kinderleicht / perfekt) —
// Datenschutz wird strukturell begründet, nicht versprochen (BRAND-OPERATING-MODEL /
// I18N-SEO-GUIDELINE). Register: informelles „du“, wie bei kostenlosen Browser-Tools üblich.

export const de: ToolContent = {
  htmlLang: 'de',

  meta: {
    title: 'winmail.dat im Browser öffnen — die echten Anhänge herausholen | runlocally',
    description:
      'Öffne eine winmail.dat von Outlook und hole die echten Anhänge heraus — einen Vertrag, eine Rechnung, ein Foto. Nichts wird hochgeladen. Open Source, offline nutzbar.',
    ogTitle: 'winmail.dat öffnen und deine Anhänge zurückbekommen',
    ogDescription:
      'Outlook schickt manchmal eine unbrauchbare winmail.dat statt der Datei, die jemand dir eigentlich senden wollte. Öffne sie hier und lade die echten Anhänge herunter — auf deinem Gerät gelesen, nichts hochgeladen.',
  },

  hero: {
    h1: 'Winmail Viewer',
    tagline:
      'Öffne eine winmail.dat-Datei und hole die echten Anhänge heraus. Nichts wird hochgeladen.',
  },

  intro: {
    h2: 'Warum du eine Datei namens winmail.dat bekommen hast',
    paras: [
      'winmail.dat taucht auf, wenn jemand mit Outlook eine E-Mail im Format „Outlook-Rich-Text“ verschickt und dein Mailprogramm nicht Outlook ist. Statt der Datei, die eigentlich angehängt wurde — ein PDF, ein Foto, eine Tabelle —, bekommst du eine seltsam benannte Datei, die sich scheinbar nicht öffnen lässt. Der echte Anhang ist nicht verloren; er steckt in einem Format namens TNEF in der winmail.dat, und dieses Tool packt ihn online direkt im Browser wieder aus, ganz ohne zusätzliche Software.',
      'Ziehe die Datei hierher, und sie wird direkt in deinem Browser gelesen. Das Tool listet jeden Anhang, den es darin findet, mit Name und Größe auf und lässt dich jeden einzeln — oder alle zusammen — als die gewöhnlichen Dateien herunterladen, die sie schon immer waren.',
    ],
  },

  privacy: {
    h2: 'Warum die Datei auf deinem Gerät bleibt',
    lead: 'In einer winmail.dat steckt oft etwas, das dir jemand im Vertrauen geschickt hat — ein Vertrag, eine Rechnung, der Scan eines Dokuments. Datenschutz ist hier strukturell, kein Versprechen. Es gibt keinen Upload-Schritt, weil es keinen Server gibt, zu dem hochgeladen werden könnte:',
    points: [
      'Die Datei wird vollständig in deinem Browser geöffnet und ausgepackt.',
      'Die Seite wird als statische Dateien ausgeliefert und stellt keine Anfrage, die deine Daten mitschickt.',
      'Der Quellcode ist offen und für alle einsehbar (MIT).',
      'Es funktioniert offline — was nur möglich ist, weil nichts das Gerät verlässt.',
    ],
    note: 'Wenn du es selbst prüfen willst, öffne den Netzwerk-Tab deines Browsers, während du eine Datei öffnest — keine Anfrage trägt sie fort.',
    sourceLinkText: 'Quellcode lesen.',
  },

  howto: {
    h2: 'So funktioniert es',
    steps: [
      {
        h3: 'Die winmail.dat öffnen',
        p: 'Klicke, um die Datei auszuwählen, oder ziehe sie irgendwo auf die Seite. Sie wird auf deinem Gerät gelesen; sie wird nicht hochgeladen.',
      },
      {
        h3: 'Sehen, was drinsteckt',
        p: 'Jeder Anhang, der darin verpackt ist, wird mit Name und Größe aufgelistet.',
      },
      {
        h3: 'Die echten Dateien herunterladen',
        p: 'Lade einen Anhang einzeln herunter, oder nutze „Alle herunterladen“, um alle Anhänge gebündelt in einer .zip zu bekommen.',
      },
    ],
  },

  faqHeading: 'Häufige Fragen',
  faq: [
    {
      q: 'Was ist winmail.dat eigentlich?',
      a: 'Es ist eine Container-Datei in einem Format namens TNEF, die Outlook erzeugt, wenn es eine Nachricht im Format „Outlook-Rich-Text“ an jemanden schickt, dessen Mailprogramm dieses Format nicht versteht. Was der Absender tatsächlich angehängt hat, steckt darin — zusammen mit etwas Formatierung für den Nachrichtentext.',
    },
    {
      q: 'Ist das dasselbe wie eine „windat“-, „win.dat“- oder „winmail dat“-Datei?',
      a: 'Ja. winmail.dat wird manchmal auch als windat, win.dat oder winmail dat geschrieben oder gesucht — gemeint ist immer dieselbe Datei, die Outlook erzeugt. Dieses Tool öffnet sie unabhängig davon, mit welcher Schreibweise du hierher gefunden hast.',
    },
    {
      q: 'Warum ist aus meinem Anhang das hier geworden?',
      a: 'Der Absender benutzt Outlook mit einer Einstellung, die ausgehende Mails im Format Outlook-Rich-Text verschickt (manchmal automatisch aktiviert für Kontakte aus einem Firmenadressbuch). Der Mailserver des Absenders bündelt die Nachricht und ihre Anhänge vor dem Versand in einer winmail.dat. Du hast das nicht verursacht, und meist merkt es nicht einmal der Absender selbst.',
    },
    {
      q: 'Wird meine Datei irgendwohin hochgeladen?',
      a: 'Nein. Die Datei wird vollständig in deinem Browser geöffnet und ausgepackt. Es gibt keine Serverkomponente, also hat sie keinen Weg vom Gerät weg. Der Quellcode ist offen, und du kannst das im Netzwerk-Tab deines Browsers bestätigen.',
    },
    {
      q: 'Kann ich damit auch den Mailtext sehen, nicht nur die Anhänge?',
      a: 'Noch nicht. Der Nachrichtentext in einer winmail.dat wird in einem eigenen, komprimierten Format gespeichert, getrennt von den Anhängen, und ihn zu entschlüsseln ist eine größere, eigenständige Aufgabe. Diese Version extrahiert nur echte Datei-Anhänge. Hat eine winmail.dat gar keine Anhänge, sagt dir das Tool das offen, statt einen Nachrichtentext vorzutäuschen.',
    },
    {
      q: 'Was, wenn die Datei mehr als einen Anhang enthält?',
      a: 'Jeder Anhang darin wird einzeln aufgelistet, mit eigener Größe und eigenem Download-Link. „Alle herunterladen“ bündelt sie alle in einer einzigen .zip, damit du sie nicht einzeln speichern musst.',
    },
    {
      q: 'Was, wenn sich die Datei nicht öffnen lässt?',
      a: 'Ein paar mögliche Meldungen: Die Datei beginnt gar nicht mit der TNEF-Signatur (sie ist womöglich gar keine winmail.dat), die Anhangsdaten wirken unvollständig oder beschädigt, oder die Datei ist gültig, enthält aber tatsächlich keine Anhänge. Jeder Fall bekommt eine eigene, klare Meldung statt eines allgemeinen Fehlers.',
    },
    {
      q: 'Funktioniert es offline?',
      a: 'Ja. Es ist eine PWA. Nach dem ersten Besuch ist es zwischengespeichert, sodass sich Dateien auch ohne Netzverbindung öffnen lassen. Du kannst es auch zum Startbildschirm hinzufügen.',
    },
  ],

  footer: {
    openSourceLabel: 'Open Source (MIT)',
    partOf: 'Teil von',
    brandTail: '— kleine Tools, die lokal auf deinem Gerät laufen.',
    colophon:
      'Erstellt und gepflegt von Geppetto. Ein Teil des Codes entsteht mit KI-Unterstützung; Prüfung und Entscheidungen liegen beim Maintainer.',
    securityText: 'Sicherheit',
  },

  related: {
    h2: 'Ähnliche Tools',
    blogLinkText: 'Technische Hintergründe lesen',
  },
};

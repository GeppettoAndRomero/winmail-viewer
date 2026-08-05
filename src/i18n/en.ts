import type { ToolContent } from './types';

// winmail-viewer. English source content.

export const en: ToolContent = {
  htmlLang: 'en',

  meta: {
    title: 'Open winmail.dat in your browser — get the real attachments | runlocally',
    description:
      'Open a winmail.dat file from Outlook and get the real attachments back out of it — a contract, an invoice, a photo. Nothing is uploaded. Open source, works offline.',
    ogTitle: 'Open winmail.dat and get your attachments back',
    ogDescription:
      'Outlook sometimes sends a useless winmail.dat instead of the file someone meant to send you. Open it here and download the real attachments — read on your device, nothing uploaded.',
  },

  hero: {
    h1: 'Winmail Viewer',
    tagline:
      'Open a winmail.dat file and get the real attachments back out of it. Nothing is uploaded.',
  },

  intro: {
    h2: 'Why you got a file called winmail.dat',
    paras: [
      'winmail.dat shows up when someone using Outlook sends you an email formatted as "Outlook Rich Text" and your mail program is not Outlook. Instead of the file they actually attached — a PDF, a photo, a spreadsheet — you receive one oddly-named file that nothing seems to open. The real attachment is not lost; it is packed inside winmail.dat in a format called TNEF, and this tool unpacks it.',
      'Drop the file here and it is read in your browser, right where it sits. The tool lists every attachment it finds inside, with its name and size, and lets you download each one — or all of them together — as the ordinary files they always were.',
    ],
  },

  privacy: {
    h2: 'Why the file stays on your device',
    lead: 'winmail.dat often carries something someone else sent you in confidence — a contract, an invoice, a scan of a document. Privacy here is structural, not a promise. There is no upload step because there is no server to upload to:',
    points: [
      'The file is opened and unpacked entirely in your browser.',
      'The page is served as static files and makes no request that carries your data.',
      'The source is open and anyone can read it (MIT).',
      'It works offline, which is only possible because nothing leaves the device.',
    ],
    note: 'If you want to check for yourself, open your browser\'s Network panel while opening a file — no request carries it.',
    sourceLinkText: 'Read the source.',
  },

  howto: {
    h2: 'How to use it',
    steps: [
      {
        h3: 'Open the winmail.dat file',
        p: 'Click to choose the file, or drop it anywhere on the page. It is read on your device; it is not uploaded.',
      },
      {
        h3: 'See what is inside',
        p: 'Every attachment packed inside it is listed with its name and size.',
      },
      {
        h3: 'Download the real files',
        p: 'Download an attachment on its own, or use "Download all" to get every attachment bundled into one .zip.',
      },
    ],
  },

  faqHeading: 'FAQ',
  faq: [
    {
      q: 'What is winmail.dat, really?',
      a: 'It is a container file, in a format called TNEF, that Outlook creates when it sends a message formatted as "Outlook Rich Text" to someone whose mail program does not understand that format. Whatever the sender actually attached is stored inside it, along with some formatting for the message text.',
    },
    {
      q: 'Is this the same as a "windat", "win.dat" or "winmail dat" file?',
      a: 'Yes. winmail.dat gets typed and searched for as windat, win.dat or winmail dat too — they all refer to the same file Outlook creates. This tool opens it regardless of how you spelled it to find this page.',
    },
    {
      q: 'Why did my attachment turn into this?',
      a: 'The sender is using Outlook with a setting that formats outgoing mail as Outlook Rich Text (sometimes turned on automatically for contacts in a corporate address book). Their mail server bundles the message and its attachments into one winmail.dat before sending it. Nothing you did caused this, and the sender usually does not realize it happens.',
    },
    {
      q: 'Is my file uploaded anywhere?',
      a: 'No. The file is opened and unpacked entirely in your browser. There is no server component, so it has no path off your device. The source is open and you can confirm this in your browser\'s Network panel.',
    },
    {
      q: 'Can this show me the email text, not just the attachments?',
      a: 'Not yet. The message text inside a winmail.dat is stored in a separate, compressed format from the attachments, and decoding it is a larger, separate piece of work. This version only extracts real file attachments. If a winmail.dat has no attachments at all, the tool tells you that plainly instead of pretending to show a body.',
    },
    {
      q: 'What if the file has more than one attachment?',
      a: 'Every attachment inside is listed on its own, with its own size and its own download link. "Download all" bundles every one of them into a single .zip so you do not have to save them one at a time.',
    },
    {
      q: 'What if the file will not open?',
      a: 'A handful of things it might tell you: the file does not start with the TNEF signature at all (it may not actually be a winmail.dat), the attachment data looks incomplete or corrupted, or the file is valid but genuinely has no attachments packed inside it. Each case gets its own plain message instead of a generic failure.',
    },
    {
      q: 'Does it work offline?',
      a: 'Yes. It is a PWA. After the first visit it is cached, so opening a file works without a network connection. You can also install it to your home screen.',
    },
  ],

  footer: {
    openSourceLabel: 'Open source (MIT)',
    partOf: 'part of',
    brandTail: '— small tools that run locally on your device.',
    colophon:
      'Built and maintained by Geppetto. Some code is written with AI assistance; all review and decisions are the maintainer\'s.',
    securityText: 'Security',
  },
};

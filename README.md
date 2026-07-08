# winmail-viewer

Open a winmail.dat file from Outlook and get the real attachments back out of it,
entirely in your browser. Files are read on your device and never uploaded. Open
source, works offline (PWA).

Part of [runlocally](https://runlocally.app) — small tools that run locally on your device.

## Why this exists

Outlook produces winmail.dat when it sends a message formatted as "Outlook Rich
Text" to a recipient whose mail client is not Outlook/Exchange. The recipient's real
attachment — a PDF, a photo, a spreadsheet — is not lost; it is packed inside a
proprietary binary container called TNEF ([MS-OXTNEF]), along with some formatting
for the message text. This tool unpacks that container and gives back the original
files.

## How it works

`src/utils/tnefEngine.ts` is a hand-written TNEF parser, implemented directly from
the [MS-OXTNEF] specification (there is no well-maintained, permissively-licensed
TNEF library to depend on). TNEF is a flat stream of TLV (type-length-value)
attributes; attachments are reconstructed by grouping the attributes that describe
each one (`attAttachRenddata`, `attAttachTitle` / `attAttachTransportFilename`,
`attAttachData`). The whole pipeline runs client-side — there is no server
component, so a file has no path off your device.

**v1 scope:** attachment extraction only. The message *body*, when TNEF-encoded, is
stored as compressed RTF ([MS-OXRTFCP]) — a separate, harder decompression format —
and this version does not decode it. A winmail.dat with no attachments (a body-only
message) is reported honestly rather than faked.

[MS-OXTNEF]: https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxtnef/
[MS-OXRTFCP]: https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxrtfcp/

## Features

- Lists every attachment packed inside a winmail.dat, with name and size
- Download an attachment individually, or all of them bundled into one .zip
  (via [@zip.js/zip.js](https://github.com/gildas-lormeau/zip.js))
- Validates the TNEF signature by content, not by file name
- Works offline (PWA), installable

## Develop

```bash
npm install
npm run dev      # dev server
npm run build    # type-check + production build to dist/
```

Stack: Astro + Preact + TypeScript. TNEF parsing is hand-written (no dependency);
"download all" bundling uses @zip.js/zip.js (BSD-3).

## Browser support

Works in current Chrome, Edge, Firefox and Safari. Parsing is pure JavaScript
(`DataView` over an `ArrayBuffer`) — no WebAssembly and no native OS support is
required.

## License

[MIT](./LICENSE). Built and maintained by Geppetto. Some code is written with AI
assistance; all review and decisions are the maintainer's.

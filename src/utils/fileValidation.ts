/**
 * File-type acceptance for the winmail.dat / TNEF extractor.
 *
 * winmail.dat has no reserved extension convention beyond Outlook's own default
 * name ("winmail.dat" — no ".tnef" or similar exists in the wild), and some mail
 * gateways rename or strip it in transit. Gating on the file name or a MIME type
 * would reject legitimate files and let nothing else through anyway, so this module
 * does not reject anything up front. Content is authoritative: `tnefEngine`
 * checks the TNEF signature (0x223e9f78) after the bytes are read and throws a
 * stable AppError code that the UI resolves to a localized message. The only thing
 * this module supplies is the `<input accept>` hint for the file picker.
 */
export const ACCEPT_HINT = '.dat';

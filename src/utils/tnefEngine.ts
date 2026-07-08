/**
 * Hand-rolled parser for TNEF (Transport Neutral Encapsulation Format) — the binary
 * format behind winmail.dat. Outlook produces this when it sends "Outlook Rich Text"
 * formatted mail to a recipient whose server/client is not Exchange/Outlook: instead
 * of a normal MIME attachment, the recipient gets one opaque `winmail.dat` file that
 * bundles the real attachment(s) (and the rich-text body) inside a proprietary
 * container. This module extracts the real attachments back out of that container.
 *
 * Format (MS-OXTNEF, §2.1): a 4-byte signature, a 2-byte key, then a flat stream of
 * attributes. Each attribute is a simple TLV:
 *
 *   LEVEL (1 byte) | TAG (4 bytes) | LENGTH (4 bytes) | DATA (LENGTH bytes) | CHECKSUM (2 bytes)
 *
 * All multi-byte integers are little-endian. LEVEL marks whether the attribute
 * describes the message (LVL_MESSAGE) or an attachment (LVL_ATTACHMENT). There is no
 * "attachment record" — attachments are represented by a run of LVL_ATTACHMENT
 * attributes, and each attachment's run is introduced by an attAttachRenddata marker.
 * Reading everything between one marker and the next (or the end of the stream)
 * reconstructs one attachment: its name (attAttachTransportFilename, or the older
 * 8.3-style attAttachTitle as a fallback) and its bytes (attAttachData).
 *
 * Deliberately out of scope (see the tool's issue for the scope decision): the
 * message BODY, when TNEF-encoded, is stored as compressed RTF (MS-OXRTFCP) inside an
 * attribute at the MESSAGE level. Decompressing that is a separate, harder algorithm
 * and this tool does not attempt it — v1 only extracts real file attachments.
 *
 * Also deliberately out of scope: the newer MAPI-property-stream encoding
 * (attMAPIProps / attAttachment) that some Outlook versions add *alongside* the
 * classic attributes above to carry extra properties (e.g. content-type). The classic
 * attributes below already carry the actual bytes and a usable filename for the
 * overwhelming majority of real winmail.dat files, so parsing the property-stream
 * structure (a meaningfully bigger TLV-within-TLV format) was not needed for
 * attachment extraction and was left out rather than half-implemented.
 */

import { AppError } from './appError';

/** MS-OXTNEF §2.1.1: the file must begin with this 32-bit little-endian value. */
const TNEF_SIGNATURE = 0x223e9f78;

/** MS-OXTNEF §2.1.2: attribute levels. */
const LVL_MESSAGE = 0x01;
const LVL_ATTACHMENT = 0x02;

/**
 * MS-OXTNEF §2.1.3.2: attribute tags relevant to attachment extraction. A tag is a
 * 32-bit value where the high 16 bits are the wire "component type" (string, byte
 * array, dword, ...) and the low 16 bits are the attribute's name/ID. Only the full
 * 32-bit tag is used for matching here — the type half is not decoded separately
 * because every attribute this parser cares about has one fixed, known type.
 */
const ATT_ATTACH_RENDDATA = 0x00069002; // marks the start of a new attachment's attribute run
const ATT_ATTACH_TITLE = 0x00018010; // legacy 8.3 (DOS) filename, NUL-terminated ANSI string
const ATT_ATTACH_DATA = 0x0006800f; // the attachment's raw bytes
const ATT_ATTACH_TRANSPORT_FILENAME = 0x00069001; // full filename, NUL-terminated ANSI string

export interface TnefAttachment {
  name: string;
  bytes: Uint8Array;
}

interface RawAttribute {
  level: number;
  tag: number;
  data: Uint8Array;
}

/** Small cursor over a DataView with bounds checks that throw a stable AppError code. */
class ByteReader {
  private pos = 0;
  constructor(private view: DataView) {}

  get remaining(): number {
    return this.view.byteLength - this.pos;
  }

  u16(): number {
    if (this.remaining < 2) throw new AppError('errCorruptStream');
    const v = this.view.getUint16(this.pos, true);
    this.pos += 2;
    return v;
  }

  u32(): number {
    if (this.remaining < 4) throw new AppError('errCorruptStream');
    const v = this.view.getUint32(this.pos, true);
    this.pos += 4;
    return v;
  }

  u8(): number {
    if (this.remaining < 1) throw new AppError('errCorruptStream');
    const v = this.view.getUint8(this.pos);
    this.pos += 1;
    return v;
  }

  /** Copy out `n` bytes (a copy, not a view, so it outlives the source buffer safely). */
  bytes(n: number): Uint8Array {
    if (n < 0 || this.remaining < n) throw new AppError('errCorruptStream');
    const out = new Uint8Array(
      this.view.buffer.slice(this.view.byteOffset + this.pos, this.view.byteOffset + this.pos + n)
    );
    this.pos += n;
    return out;
  }
}

/**
 * Walk the flat TNEF attribute stream into raw {level, tag, data} triples.
 *
 * The per-attribute CHECKSUM (an additive sum of the DATA bytes, mod 65536) is read
 * and discarded rather than verified: LENGTH — not the checksum — is what defines
 * attribute boundaries, and real-world TNEF writers have not always computed it
 * correctly, so treating a mismatch as fatal would reject files that Outlook itself
 * opens fine. A truncated/misaligned stream is still caught, because the bounds
 * checks in ByteReader throw as soon as a LENGTH claims more bytes than remain.
 */
function readAttributes(buf: ArrayBuffer): RawAttribute[] {
  const reader = new ByteReader(new DataView(buf));

  if (reader.u32() !== TNEF_SIGNATURE) throw new AppError('errBadSignature');
  reader.u16(); // Key — an arbitrary seed set by the writer; not needed for extraction

  const attrs: RawAttribute[] = [];
  while (reader.remaining > 0) {
    // A real attribute needs at least LEVEL(1) + TAG(4) + LENGTH(4) more bytes.
    // Anything less at this point is trailing garbage / a truncated file, not a
    // clean end of stream.
    if (reader.remaining < 9) throw new AppError('errCorruptStream');
    const level = reader.u8();
    const tag = reader.u32();
    const length = reader.u32();
    const data = reader.bytes(length);
    reader.u16(); // checksum — see note above
    attrs.push({ level, tag, data });
  }
  return attrs;
}

/** Decode a NUL-terminated single-byte (ANSI/Latin-1) string attribute. */
function decodeCString(bytes: Uint8Array): string {
  let end = bytes.indexOf(0);
  if (end < 0) end = bytes.length;
  let out = '';
  for (let i = 0; i < end; i++) out += String.fromCharCode(bytes[i]);
  return out.trim();
}

/** Strip path separators and control characters so a TNEF-supplied name is safe to use as a bare file name. */
function sanitizeName(name: string): string {
  // eslint-disable-next-line no-control-regex
  const cleaned = name.replace(/[/\\]/g, '_').replace(/[\x00-\x1f]/g, '').trim();
  return cleaned.length > 0 ? cleaned : '';
}

/** True when the buffer starts with the TNEF signature (0x223e9f78, little-endian). */
export function isTnefSignature(buf: ArrayBuffer): boolean {
  if (buf.byteLength < 4) return false;
  return new DataView(buf).getUint32(0, true) === TNEF_SIGNATURE;
}

/**
 * Extract every attachment (name + raw bytes) from a winmail.dat / TNEF buffer.
 *
 * Attachments are reconstructed by grouping the flat attribute stream: each
 * attAttachRenddata attribute starts a new attachment, and every LVL_ATTACHMENT
 * attribute that follows — until the next attAttachRenddata or the end of the
 * stream — belongs to it. Only a group that yields actual bytes (attAttachData) is
 * counted as an attachment; a group with rendering data but no payload (rare, but
 * possible for e.g. an OLE object reference) is skipped rather than emitted empty.
 *
 * Throws AppError('errBadSignature') when the buffer is not TNEF at all, and
 * AppError('errCorruptStream') when the attribute stream is truncated or malformed.
 * Returns an empty array (not an error) when the file is valid TNEF but carries no
 * attachments — e.g. a body-only rich-text message — so callers can show an honest
 * "no attachments" state instead of a scary failure.
 */
export function extractAttachments(buf: ArrayBuffer): TnefAttachment[] {
  const attrs = readAttributes(buf);

  const attachments: TnefAttachment[] = [];
  const usedNames = new Set<string>();
  let current: { title?: string; longName?: string; data?: Uint8Array } | null = null;

  const flush = () => {
    if (!current || !current.data) return;
    let name = sanitizeName(current.longName ?? '') || sanitizeName(current.title ?? '');
    if (!name) name = `attachment${attachments.length + 1}.bin`;
    if (usedNames.has(name)) {
      const dot = name.lastIndexOf('.');
      const stem = dot > 0 ? name.slice(0, dot) : name;
      const ext = dot > 0 ? name.slice(dot) : '';
      let n = 1;
      let candidate = `${stem} (${n})${ext}`;
      while (usedNames.has(candidate)) {
        n += 1;
        candidate = `${stem} (${n})${ext}`;
      }
      name = candidate;
    }
    usedNames.add(name);
    attachments.push({ name, bytes: current.data });
  };

  for (const attr of attrs) {
    if (attr.level !== LVL_ATTACHMENT) continue;
    if (attr.tag === ATT_ATTACH_RENDDATA) {
      flush();
      current = {};
      continue;
    }
    if (!current) continue; // a stray attachment-level attribute before any Renddata marker
    if (attr.tag === ATT_ATTACH_TITLE) current.title = decodeCString(attr.data);
    else if (attr.tag === ATT_ATTACH_TRANSPORT_FILENAME) current.longName = decodeCString(attr.data);
    else if (attr.tag === ATT_ATTACH_DATA) current.data = attr.data;
  }
  flush();

  return attachments;
}

// Re-exported for tests that want to exercise level/tag matching directly without
// hand-assembling a full attribute stream.
export const __internal = { LVL_MESSAGE, LVL_ATTACHMENT, TNEF_SIGNATURE };

/**
 * Hand-assembles a minimal, valid TNEF (winmail.dat) byte stream for tests.
 *
 * There is no safe, redistributable real-world winmail.dat sample to check into
 * this repo (any real one is somebody's actual email). Building the bytes here
 * instead means both the unit tests and the e2e tests can assert against EXACT
 * expected output — the fixture and the assertion are written from the same
 * understanding of the format, which is what actually verifies the parser
 * (`src/utils/tnefEngine.ts`) is decoding the [MS-OXTNEF] structure correctly and
 * not just happening to work on one sample file found online.
 */

export interface AttrSpec {
  level: number;
  tag: number;
  data: Uint8Array;
}

export const SIGNATURE = 0x223e9f78;
export const LVL_MESSAGE = 0x01;
export const LVL_ATTACHMENT = 0x02;

export const ATT_ATTACH_RENDDATA = 0x00069002;
export const ATT_ATTACH_TITLE = 0x00018010;
export const ATT_ATTACH_DATA = 0x0006800f;
export const ATT_ATTACH_TRANSPORT_FILENAME = 0x00069001;
export const ATT_MESSAGE_CLASS = 0x00018008; // message-level, used to build a body-only file

/** NUL-terminated ANSI string, as attAttachTitle/attAttachTransportFilename store it. */
export function cstring(s: string): Uint8Array {
  const bytes = Uint8Array.from(s, (c) => c.charCodeAt(0));
  const out = new Uint8Array(bytes.length + 1);
  out.set(bytes, 0);
  return out; // trailing byte is already 0
}

/** MS-OXTNEF additive checksum: sum of DATA bytes, mod 65536. */
function checksum(data: Uint8Array): number {
  let sum = 0;
  for (const b of data) sum = (sum + b) & 0xffff;
  return sum;
}

function encodeAttribute(spec: AttrSpec, opts?: { badChecksum?: boolean }): Uint8Array {
  const { level, tag, data } = spec;
  const buf = new Uint8Array(1 + 4 + 4 + data.length + 2);
  const view = new DataView(buf.buffer);
  buf[0] = level;
  view.setUint32(1, tag, true);
  view.setUint32(5, data.length, true);
  buf.set(data, 9);
  const sum = opts?.badChecksum ? (checksum(data) + 1) & 0xffff : checksum(data);
  view.setUint16(9 + data.length, sum, true);
  return buf;
}

/** Concatenate the TNEF signature + key header with an encoded attribute stream. */
export function buildTnef(attrs: AttrSpec[], opts?: { badChecksumOn?: number }): Uint8Array {
  const parts: Uint8Array[] = [];
  const header = new Uint8Array(6);
  new DataView(header.buffer).setUint32(0, SIGNATURE, true);
  new DataView(header.buffer).setUint16(4, 0x0001, true); // Key — arbitrary
  parts.push(header);
  attrs.forEach((a, i) => {
    parts.push(encodeAttribute(a, { badChecksum: opts?.badChecksumOn === i }));
  });
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.length;
  }
  return out;
}

/** One attachment's attribute run: Renddata marker, a name attribute, then the bytes. */
export function attachmentGroup(
  name: string,
  bytes: Uint8Array,
  opts?: { nameAttr?: 'title' | 'transport' | 'both' | 'none' },
): AttrSpec[] {
  const nameAttr = opts?.nameAttr ?? 'title';
  const specs: AttrSpec[] = [
    // Real Renddata content is a small fixed struct (version/type/flags); its
    // bytes are not inspected by the parser, only the tag matters as a marker.
    { level: LVL_ATTACHMENT, tag: ATT_ATTACH_RENDDATA, data: new Uint8Array([1, 0, 0, 0]) },
  ];
  if (nameAttr === 'title' || nameAttr === 'both') {
    specs.push({ level: LVL_ATTACHMENT, tag: ATT_ATTACH_TITLE, data: cstring(name) });
  }
  if (nameAttr === 'transport' || nameAttr === 'both') {
    specs.push({ level: LVL_ATTACHMENT, tag: ATT_ATTACH_TRANSPORT_FILENAME, data: cstring(name) });
  }
  specs.push({ level: LVL_ATTACHMENT, tag: ATT_ATTACH_DATA, data: bytes });
  return specs;
}

/** Base64-encode bytes the same way the e2e helpers decode them into a File. */
export function toBase64(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return typeof Buffer !== 'undefined' ? Buffer.from(bytes).toString('base64') : btoa(bin);
}

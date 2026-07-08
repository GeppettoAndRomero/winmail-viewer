import { describe, it, expect } from 'vitest';
import { AppError } from '@/utils/appError';
import { extractAttachments, isTnefSignature } from '@/utils/tnefEngine';
import { buildTnef, attachmentGroup, cstring, ATT_MESSAGE_CLASS, LVL_MESSAGE } from '../fixtures/tnef/buildTnef';

const enc = (s: string) => new TextEncoder().encode(s);

describe('isTnefSignature', () => {
  it('is true for a buffer starting with the TNEF signature', () => {
    const buf = buildTnef([]);
    expect(isTnefSignature(buf.buffer)).toBe(true);
  });

  it('is false for a buffer with the wrong signature', () => {
    const bytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04]); // "PK\x03\x04" — a ZIP, not TNEF
    expect(isTnefSignature(bytes.buffer)).toBe(false);
  });

  it('is false for a buffer shorter than the signature', () => {
    expect(isTnefSignature(new Uint8Array([1, 2]).buffer)).toBe(false);
  });
});

describe('extractAttachments — single attachment', () => {
  it('extracts the exact filename and exact byte content from attAttachTitle + attAttachData', () => {
    const payload = enc('hello from winmail-viewer\n');
    const buf = buildTnef(attachmentGroup('report.pdf', payload));

    const result = extractAttachments(buf.buffer);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('report.pdf');
    expect(result[0].bytes).toEqual(payload);
  });

  it('prefers attAttachTransportFilename (long name) over attAttachTitle when both are present', () => {
    const payload = enc('data');
    const attrs = [
      { level: 2, tag: 0x00069002, data: new Uint8Array([1, 0, 0, 0]) }, // Renddata
      { level: 2, tag: 0x00018010, data: cstring('REPORT~1.PDF') }, // legacy 8.3 title
      { level: 2, tag: 0x00069001, data: cstring('quarterly-report.pdf') }, // long name
      { level: 2, tag: 0x0006800f, data: payload }, // attAttachData
    ];
    const buf = buildTnef(attrs);

    const result = extractAttachments(buf.buffer);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('quarterly-report.pdf');
    expect(result[0].bytes).toEqual(payload);
  });

  it('falls back to a generated name when neither name attribute is present', () => {
    const payload = enc('mystery bytes');
    const buf = buildTnef(attachmentGroup('unused', payload, { nameAttr: 'none' }));

    const result = extractAttachments(buf.buffer);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('attachment1.bin');
    expect(result[0].bytes).toEqual(payload);
  });

  it('sanitizes path separators out of a TNEF-supplied name', () => {
    const payload = enc('x');
    const buf = buildTnef(attachmentGroup('../../etc/passwd', payload));

    const result = extractAttachments(buf.buffer);

    expect(result[0].name).not.toMatch(/[/\\]/);
    expect(result[0].name).toBe('.._.._etc_passwd');
  });
});

describe('extractAttachments — multiple attachments', () => {
  it('groups two attAttachRenddata-delimited runs into two distinct attachments, not one', () => {
    const first = enc('first file contents');
    const second = enc('second file contents, different length');
    const buf = buildTnef([
      ...attachmentGroup('one.txt', first),
      ...attachmentGroup('two.txt', second),
    ]);

    const result = extractAttachments(buf.buffer);

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('one.txt');
    expect(result[0].bytes).toEqual(first);
    expect(result[1].name).toBe('two.txt');
    expect(result[1].bytes).toEqual(second);
  });

  it('de-duplicates identical names across attachments', () => {
    const a = enc('a');
    const b = enc('b');
    const buf = buildTnef([
      ...attachmentGroup('photo.jpg', a),
      ...attachmentGroup('photo.jpg', b),
    ]);

    const result = extractAttachments(buf.buffer);

    expect(result.map((r) => r.name)).toEqual(['photo.jpg', 'photo (1).jpg']);
    expect(result[0].bytes).toEqual(a);
    expect(result[1].bytes).toEqual(b);
  });

  it('handles three attachments (not just a hardcoded two-attachment path)', () => {
    const buf = buildTnef([
      ...attachmentGroup('one.txt', enc('1')),
      ...attachmentGroup('two.txt', enc('22')),
      ...attachmentGroup('three.txt', enc('333')),
    ]);

    const result = extractAttachments(buf.buffer);

    expect(result.map((r) => r.name)).toEqual(['one.txt', 'two.txt', 'three.txt']);
    expect(result.map((r) => new TextDecoder().decode(r.bytes))).toEqual(['1', '22', '333']);
  });
});

describe('extractAttachments — no attachments', () => {
  it('returns an empty array (not an error) for a valid TNEF with only message-level attributes', () => {
    const buf = buildTnef([
      { level: LVL_MESSAGE, tag: ATT_MESSAGE_CLASS, data: cstring('IPM.Note') },
    ]);

    expect(extractAttachments(buf.buffer)).toEqual([]);
  });

  it('returns an empty array for a TNEF with no attributes at all', () => {
    expect(extractAttachments(buildTnef([]).buffer)).toEqual([]);
  });

  it('does not emit an attachment for a Renddata group that never got attAttachData', () => {
    const buf = buildTnef([
      { level: 2, tag: 0x00069002, data: new Uint8Array([1, 0, 0, 0]) }, // Renddata
      { level: 2, tag: 0x00018010, data: cstring('ghost.txt') }, // title, but no data attribute follows
    ]);

    expect(extractAttachments(buf.buffer)).toEqual([]);
  });
});

describe('extractAttachments — malformed input', () => {
  it('throws AppError(errBadSignature) for a file that is not TNEF at all', () => {
    const notTnef = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0, 0, 0, 0]);
    expect(() => extractAttachments(notTnef.buffer)).toThrow(AppError);
    try {
      extractAttachments(notTnef.buffer);
      expect.unreachable();
    } catch (e) {
      expect((e as AppError).code).toBe('errBadSignature');
    }
  });

  it('throws AppError(errCorruptStream) when an attribute LENGTH overruns the buffer', () => {
    const buf = buildTnef(attachmentGroup('x.txt', enc('short')));
    // Truncate the buffer mid-way through the last attribute's data — the LENGTH
    // field still claims the original size, so the reader must detect the shortfall.
    const truncated = buf.slice(0, buf.length - 4);

    expect(() => extractAttachments(truncated.buffer)).toThrow(AppError);
    try {
      extractAttachments(truncated.buffer);
      expect.unreachable();
    } catch (e) {
      expect((e as AppError).code).toBe('errCorruptStream');
    }
  });

  it('throws AppError(errCorruptStream) for trailing garbage shorter than a full attribute header', () => {
    const buf = buildTnef(attachmentGroup('x.txt', enc('y')));
    const withGarbage = new Uint8Array(buf.length + 3);
    withGarbage.set(buf, 0);
    withGarbage.set([0xff, 0xff, 0xff], buf.length);

    expect(() => extractAttachments(withGarbage.buffer)).toThrow(AppError);
  });

  it('does NOT fail on an intentionally wrong per-attribute checksum (LENGTH defines the frame, not the checksum)', () => {
    const payload = enc('checksum should not gate extraction');
    const attrs = attachmentGroup('note.txt', payload);
    const buf = buildTnef(attrs, { badChecksumOn: attrs.length - 1 }); // corrupt the checksum on attAttachData

    const result = extractAttachments(buf.buffer);

    expect(result).toHaveLength(1);
    expect(result[0].bytes).toEqual(payload);
  });
});

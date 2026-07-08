/**
 * Bundle extracted TNEF attachments into a single .zip for "download all" — the same
 * @zip.js/zip.js library the create-zip/unzip tools use, loaded on demand only when
 * a winmail.dat with more than one attachment is opened.
 */

import { ZipWriter, BlobWriter, Uint8ArrayReader } from '@zip.js/zip.js';
import type { TnefAttachment } from './tnefEngine';

export async function bundleAsZip(attachments: TnefAttachment[]): Promise<Blob> {
  const writer = new ZipWriter(new BlobWriter('application/zip'), {
    useUnicodeFileNames: true, // UTF-8 (bit 11) — correct names on Windows
  });
  for (const { name, bytes } of attachments) {
    await writer.add(name, new Uint8ArrayReader(bytes));
  }
  return writer.close();
}

/** Trigger a browser download of a Blob under the given file name. */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke on the next tick so the download has started.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

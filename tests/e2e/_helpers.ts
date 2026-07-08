import { type Page } from '@playwright/test';
import { buildTnef, attachmentGroup, toBase64 } from '../fixtures/tnef/buildTnef';

const enc = (s: string) => new TextEncoder().encode(s);

/** Contents of each attachment in the bundled two-attachment sample, for assertions. */
export const SAMPLE_ATTACHMENTS = {
  first: { name: 'quarterly-report.pdf', text: 'this is the first attachment\n' },
  second: { name: 'photo.jpg', text: 'this is the second attachment, a bit longer than the first\n' },
};

/** A winmail.dat with two real attachments, built the same way the unit tests do. */
export const SAMPLE_WINMAIL_B64 = toBase64(
  buildTnef([
    ...attachmentGroup(SAMPLE_ATTACHMENTS.first.name, enc(SAMPLE_ATTACHMENTS.first.text), {
      nameAttr: 'transport',
    }),
    ...attachmentGroup(SAMPLE_ATTACHMENTS.second.name, enc(SAMPLE_ATTACHMENTS.second.text)),
  ]),
);

/** A valid TNEF stream with no attachments at all — a body-only message. */
export const BODY_ONLY_WINMAIL_B64 = toBase64(
  buildTnef([{ level: 1, tag: 0x00018008, data: Uint8Array.from('IPM.Note\0', (c) => c.charCodeAt(0)) }]),
);

/** Wait until the island has hydrated and is ready to receive files. */
export async function waitReady(page: Page) {
  await page.waitForFunction(() => (window as Record<string, unknown>).__toolReady === true);
}

/** Feed a base64-encoded file through the same drop-zone path the UI uses. */
export async function dropFile(page: Page, opts: { b64: string; name: string; type: string }) {
  await page.evaluate(({ b64, name, type }) => {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const file = new File([bytes], name, { type });
    window.dispatchEvent(new CustomEvent('filesDropped', { detail: [file] }));
  }, opts);
}

/** Open the bundled two-attachment sample winmail.dat and wait for the list to render. */
export async function openSampleWinmail(page: Page) {
  await dropFile(page, { b64: SAMPLE_WINMAIL_B64, name: 'winmail.dat', type: 'application/octet-stream' });
  await page.getByTestId('attachment-list').waitFor();
}

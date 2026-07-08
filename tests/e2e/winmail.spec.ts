import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { waitReady, dropFile, openSampleWinmail, SAMPLE_ATTACHMENTS, BODY_ONLY_WINMAIL_B64 } from './_helpers';

/**
 * Records every request that leaves the local origin. The no-upload covenant:
 * opening a winmail.dat must trigger ZERO cross-origin requests.
 */
function trackExternal(page: Page): string[] {
  const external: string[] = [];
  page.on('request', (req) => {
    const url = req.url();
    if (!url.startsWith('http://localhost:4321') && !url.startsWith('data:') && !url.startsWith('blob:')) {
      external.push(url);
    }
  });
  return external;
}

test.describe('winmail-viewer', () => {
  test('lists both attachments packed inside the sample winmail.dat, with no upload', async ({ page }) => {
    const external = trackExternal(page);
    await page.goto('/winmail-viewer/');
    await waitReady(page);
    await openSampleWinmail(page);

    await expect(page.getByTestId('attachment-count')).toContainText('2');
    const list = page.getByTestId('attachment-list');
    await expect(list).toContainText(SAMPLE_ATTACHMENTS.first.name);
    await expect(list).toContainText(SAMPLE_ATTACHMENTS.second.name);

    expect(external, `unexpected cross-origin requests: ${external.join(', ')}`).toHaveLength(0);
  });

  test('downloads a single attachment with the exact original bytes', async ({ page }) => {
    await page.goto('/winmail-viewer/');
    await waitReady(page);
    await openSampleWinmail(page);

    const downloadPromise = page.waitForEvent('download', { timeout: 15_000 });
    await page.getByRole('button', { name: `Download ${SAMPLE_ATTACHMENTS.first.name}` }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe(SAMPLE_ATTACHMENTS.first.name);
    const path = await download.path();
    expect(path).toBeTruthy();
    expect(readFileSync(path as string).toString()).toBe(SAMPLE_ATTACHMENTS.first.text);
  });

  test('"download all" bundles both attachments into one .zip', async ({ page }) => {
    await page.goto('/winmail-viewer/');
    await waitReady(page);
    await openSampleWinmail(page);

    const downloadPromise = page.waitForEvent('download', { timeout: 15_000 });
    await page.getByTestId('download-all').click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.zip$/);
    const path = await download.path();
    expect(path).toBeTruthy();
    // A real zip starts with the "PK\x03\x04" local file header signature.
    const bytes = readFileSync(path as string);
    expect(bytes.subarray(0, 4).toString('hex')).toBe('504b0304');
  });

  test('shows an honest notice — not an error, not a fake body — for a body-only winmail.dat', async ({ page }) => {
    await page.goto('/winmail-viewer/');
    await waitReady(page);
    await dropFile(page, { b64: BODY_ONLY_WINMAIL_B64, name: 'winmail.dat', type: 'application/octet-stream' });

    const notice = page.getByTestId('no-attachments');
    await expect(notice).toBeVisible();
    await expect(page.getByTestId('no-attachments-message')).toContainText('no extractable attachments');
    await expect(page.getByTestId('attachment-list')).toHaveCount(0);
    await expect(page.getByTestId('error')).toHaveCount(0);
  });

  test('shows a localized error for a file that is not TNEF at all, without crashing', async ({ page }) => {
    await page.goto('/winmail-viewer/');
    await waitReady(page);
    await dropFile(page, { b64: btoa('not a winmail.dat'), name: 'photo.png', type: 'image/png' });

    const err = page.getByTestId('error');
    await expect(err).toBeVisible();
    await expect(err).toContainText('photo.png');
    await expect(page.getByTestId('attachment-list')).toHaveCount(0);
  });

  test('shows a localized error for a truncated/corrupt winmail.dat, without crashing', async ({ page }) => {
    await page.goto('/winmail-viewer/');
    await waitReady(page);
    // Valid signature, then garbage too short to be a real attribute header.
    const bytes = new Uint8Array([0x78, 0x9f, 0x3e, 0x22, 0, 0, 0x02, 0x10, 0x80]);
    let bin = '';
    for (const b of bytes) bin += String.fromCharCode(b);
    await dropFile(page, { b64: btoa(bin), name: 'broken.dat', type: 'application/octet-stream' });

    const err = page.getByTestId('error');
    await expect(err).toBeVisible();
    await expect(page.getByTestId('attachment-list')).toHaveCount(0);
  });
});

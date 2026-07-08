import { test, expect } from '@playwright/test';
import { waitReady, openSampleWinmail } from './_helpers';

// Content routing is engine-independent; one browser is enough.
test.describe('i18n', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'content routing (one engine)');
  });

  for (const loc of [
    { path: '/winmail-viewer/', lang: 'en' },
    { path: '/winmail-viewer/ja/', lang: 'ja' },
  ]) {
    test(`opens the sample winmail.dat on the ${loc.lang} route (#5)`, async ({ page }) => {
      await page.goto(loc.path);
      await waitReady(page);
      await openSampleWinmail(page);
    });
  }

  test('serves every locale with the correct <html lang>', async ({ page }) => {
    const expected: Array<[string, string]> = [
      ['/winmail-viewer/', 'en'],
      ['/winmail-viewer/ja/', 'ja'],
      ['/winmail-viewer/zh/', 'zh-Hans'],
      ['/winmail-viewer/de/', 'de'],
      ['/winmail-viewer/es/', 'es'],
    ];
    for (const [path, lang] of expected) {
      await page.goto(path);
      expect(await page.getAttribute('html', 'lang'), `lang on ${path}`).toBe(lang);
    }
  });
});

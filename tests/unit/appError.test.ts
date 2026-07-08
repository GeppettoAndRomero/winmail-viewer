import { describe, it, expect } from 'vitest';
import { AppError, resolveErrorMessage } from '@/utils/appError';
import { ui } from '@/i18n/ui';

describe('resolveErrorMessage', () => {
  it('maps codes to localized strings', () => {
    expect(resolveErrorMessage(new AppError('errBadSignature'), ui.en)).toBe(
      "This doesn't look like a winmail.dat (TNEF) file — the signature doesn't match.",
    );
    expect(resolveErrorMessage(new AppError('errBadSignature'), ui.ja)).toBe(
      'winmail.dat（TNEF）ファイルではないようです。署名が一致しません。',
    );
    expect(resolveErrorMessage('errNoAttachments', ui.de)).toBe(
      'Diese winmail.dat enthält einen Nachrichtentext, aber keine extrahierbaren Anhänge in dieser Version.',
    );
  });

  it('falls back to the localized generic message for unmapped/undefined errors', () => {
    expect(resolveErrorMessage('some internal DataView error', ui.zh)).toBe(ui.zh.errConversionFailed);
    expect(resolveErrorMessage(undefined, ui.es)).toBe(ui.es.errConversionFailed);
  });

  it('every locale defines the mapped codes', () => {
    for (const loc of ['en', 'ja', 'zh', 'de', 'es'] as const)
      for (const c of ['errBadSignature', 'errCorruptStream', 'errNoAttachments', 'errConversionFailed'])
        expect((ui as any)[loc][c], `${loc}.${c}`).toBeTruthy();
  });
});

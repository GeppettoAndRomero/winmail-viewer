/**
 * WinmailViewerTool — the tool's only non-frozen widget.
 *
 * Opens a winmail.dat (TNEF) file chosen from the picker or dropped anywhere on the
 * page (via the frozen GlobalDropZone's `filesDropped` CustomEvent<File[]>), parses
 * it with the hand-rolled `tnefEngine`, and lists every real attachment trapped
 * inside it — each downloadable on its own, or all of them bundled into one .zip
 * (via @zip.js/zip.js, loaded on demand). Everything runs in the browser: the file
 * is read with `File.arrayBuffer()` and never leaves the device.
 *
 * v1 is attachments-only (see the engine's file header for the scope note on the
 * TNEF message body). A file that parses as valid TNEF but carries no attachments —
 * a body-only rich-text message — is shown as an honest, non-alarming notice rather
 * than an error.
 *
 * The island receives `locale` as a prop (present during SSR) and reads all strings
 * from the i18n table, so SSR and client render identically.
 */

import { useState, useCallback, useEffect } from 'preact/hooks';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';
import { ui } from '@/i18n/ui';
import { AppError, resolveErrorMessage } from '@/utils/appError';
import { extractAttachments, type TnefAttachment } from '@/utils/tnefEngine';
import { bundleAsZip, downloadBlob } from '@/utils/zipBundle';

interface ReadyState {
  fileName: string;
  attachments: TnefAttachment[];
}

function humanSize(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/** "winmail.dat" -> "winmail-attachments.zip" */
function zipFileName(sourceName: string): string {
  const base = sourceName.replace(/\.[^./\\]+$/, '') || 'winmail';
  return `${base}-attachments.zip`;
}

interface WinmailViewerToolProps {
  locale?: string;
}

export function WinmailViewerTool({ locale = 'en' }: WinmailViewerToolProps) {
  const t = (ui as any)[locale] ?? ui.en;

  const [ready, setReady] = useState<ReadyState | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [errorFileName, setErrorFileName] = useState('');
  const [busy, setBusy] = useState(false);
  const [bundling, setBundling] = useState(false);

  const finish = useCallback(() => {
    window.dispatchEvent(new CustomEvent('filesProcessed'));
  }, []);

  const openFile = useCallback(async (file: File) => {
    setBusy(true);
    setErrorCode(null);
    setReady(null);
    try {
      const buf = await file.arrayBuffer();
      const attachments = extractAttachments(buf);
      if (attachments.length === 0) throw new AppError('errNoAttachments');
      setReady({ fileName: file.name, attachments });
    } catch (err) {
      setErrorFileName(file.name);
      setErrorCode(err instanceof AppError ? err.code : 'errConversionFailed');
    } finally {
      setBusy(false);
    }
  }, []);

  const handleFiles = useCallback(
    async (files: File[]) => {
      // The tool works on one winmail.dat at a time; take the first if several
      // are dropped (e.g. a whole inbox export dragged in by mistake).
      const file =
        files.find((f) => f.name.toLowerCase().endsWith('.dat')) ?? files[0];
      if (file) await openFile(file);
      finish();
    },
    [openFile, finish],
  );

  // Signal E2E readiness after mount.
  useEffect(() => {
    (globalThis as Record<string, unknown>).__toolReady = true;
  }, []);

  // Files dropped/pasted anywhere on the page (GlobalDropZone).
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<File[]>).detail;
      void handleFiles(detail ?? []);
    };
    window.addEventListener('filesDropped', handler);
    return () => window.removeEventListener('filesDropped', handler);
  }, [handleFiles]);

  const onPick = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    void handleFiles(files);
    input.value = '';
  };

  const downloadOne = useCallback((att: TnefAttachment) => {
    // Re-wrap: TS's DOM lib types Blob's BlobPart as Uint8Array<ArrayBuffer>, and a
    // Uint8Array produced from a .slice()'d buffer is typed as the wider
    // Uint8Array<ArrayBufferLike> — re-constructing narrows it back down.
    downloadBlob(new Blob([new Uint8Array(att.bytes)]), att.name);
  }, []);

  const downloadAll = useCallback(async () => {
    if (!ready || bundling || ready.attachments.length === 0) return;
    setBundling(true);
    try {
      if (ready.attachments.length === 1) {
        downloadOne(ready.attachments[0]);
        return;
      }
      const blob = await bundleAsZip(ready.attachments);
      downloadBlob(blob, zipFileName(ready.fileName));
    } finally {
      setBundling(false);
    }
  }, [ready, bundling, downloadOne]);

  const clear = useCallback(() => {
    setReady(null);
    setErrorCode(null);
  }, []);

  const isNoAttachments = errorCode === 'errNoAttachments';

  return (
    <div>
      <AppCard>
        <div style="margin-bottom: var(--space-4);">
          <h2 style="margin: 0 0 var(--space-1) 0; font-size: var(--fs-4); font-weight: 600;">
            {t.uploadHeading}
          </h2>
          <p style="margin: 0; font-size: var(--fs-2); color: var(--color-subtle);">
            {t.uploadSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => document.getElementById('winmail-file-input')?.click()}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-1)',
            width: '100%',
            minHeight: '180px',
            padding: 'var(--space-6)',
            border: '2px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-bg)',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          <span style="font-size: 3rem; line-height: 1; margin-bottom: var(--space-2);" aria-hidden="true">
            📎
          </span>
          <span style="font-size: var(--fs-3); font-weight: 600; color: var(--color-text);">
            {t.dropClick}
          </span>
          <span style="font-size: var(--fs-1); color: var(--color-subtle);">{t.dropOr}</span>
          <span style="font-size: var(--fs-1); color: var(--color-subtle);">{t.dropSupported}</span>
        </button>
        <input
          id="winmail-file-input"
          type="file"
          accept=".dat"
          onChange={onPick}
          style="display: none;"
        />

        {busy && (
          <p style="margin-top: var(--space-3); color: var(--color-subtle);">{t.reading}</p>
        )}
      </AppCard>

      {errorCode && !isNoAttachments && (
        <div
          role="alert"
          data-testid="error"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-2)',
            marginTop: 'var(--space-6)',
            padding: 'var(--space-4)',
            background: 'color-mix(in srgb, var(--color-danger) 8%, var(--color-bg))',
            border: '1px solid var(--color-danger)',
            borderLeft: '4px solid var(--color-danger)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text)',
            fontSize: 'var(--fs-2)',
          }}
        >
          <span aria-hidden="true" style="color: var(--color-danger); font-size: var(--fs-3); line-height: 1.3;">
            ⚠
          </span>
          <span>
            <strong style="overflow-wrap: anywhere;">{errorFileName}</strong>
            <br />
            <span data-testid="error-message">{resolveErrorMessage(errorCode, t)}</span>
          </span>
        </div>
      )}

      {errorCode && isNoAttachments && (
        <div
          data-testid="no-attachments"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-2)',
            marginTop: 'var(--space-6)',
            padding: 'var(--space-4)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text)',
            fontSize: 'var(--fs-2)',
          }}
        >
          <span aria-hidden="true" style="font-size: var(--fs-3); line-height: 1.3;">
            ℹ
          </span>
          <span>
            <strong style="overflow-wrap: anywhere;">{errorFileName}</strong>
            <br />
            <span data-testid="no-attachments-message">{resolveErrorMessage(errorCode, t)}</span>
          </span>
        </div>
      )}

      {ready && (
        <AppCard className="mt-6">
          <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--space-3); margin-bottom: var(--space-4);">
            <strong data-testid="file-name" title={ready.fileName} style="overflow-wrap: anywhere;">
              {ready.fileName}
            </strong>
            <span style="font-size: var(--fs-2); color: var(--color-subtle);" class="num" data-testid="attachment-count">
              {ready.attachments.length} {t.attachmentsLabel}
            </span>
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: var(--space-2); justify-content: flex-end; margin-bottom: var(--space-3);">
            <AppButton
              variant="primary"
              onClick={() => void downloadAll()}
              disabled={bundling}
              ariaLabel={t.downloadAll}
            >
              <span data-testid="download-all">{bundling ? t.bundling : t.downloadAll}</span>
            </AppButton>
            <AppButton variant="secondary" onClick={clear}>
              {t.clearAll}
            </AppButton>
          </div>

          <ul
            data-testid="attachment-list"
            aria-label={t.attachmentsAria}
            style="list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px;"
          >
            {ready.attachments.map((att, i) => (
              <li
                key={i}
                data-row
                style="display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2) var(--space-3); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-xs); font-size: var(--fs-2);"
              >
                <span
                  title={att.name}
                  style="flex: 1; min-width: 0; overflow-wrap: anywhere; word-break: break-word;"
                >
                  {att.name}
                </span>
                <span style="flex-shrink: 0; color: var(--color-subtle);" class="num">
                  {humanSize(att.bytes.length)}
                </span>
                <span style="flex-shrink: 0;">
                  <AppButton
                    variant="ghost"
                    onClick={() => downloadOne(att)}
                    ariaLabel={`${t.download} ${att.name}`}
                  >
                    {t.download}
                  </AppButton>
                </span>
              </li>
            ))}
          </ul>
        </AppCard>
      )}
    </div>
  );
}

/**
 * Interactive-island strings, per locale. Separate from page-level content
 * (`en.ts` / `ja.ts` …): this is the text the Preact islands render.
 *
 * IMPORTANT: islands receive `locale` as a PROP (present during SSR) and never
 * read it from `document`. SSR and client render the same string, so there is no
 * hydration mismatch.
 *
 * Error keys (errBadSignature / errCorruptStream / errNoAttachments /
 * errConversionFailed) are resolved via `AppError` + `resolveErrorMessage`
 * (`@/utils/appError`) — see that module for how codes map to these strings.
 */
export const ui = {
  en: {
    // WinmailViewerTool — open / dropzone
    uploadHeading: 'Open a winmail.dat',
    uploadSubtitle: 'Choose the file. It is read on your device.',
    dropClick: 'Click to choose a winmail.dat file',
    dropOr: 'or drop it anywhere on the page',
    dropSupported: 'winmail.dat (TNEF) files',
    reading: 'Reading…',

    // WinmailViewerTool — listing / actions
    attachmentsLabel: 'attachments',
    attachmentsAria: 'Attachments found inside the file',
    download: 'Download',
    downloadAll: 'Download all as .zip',
    bundling: 'Preparing zip…',
    clearAll: 'Clear',

    // WinmailViewerTool — error / notice states (AppError codes)
    errBadSignature: "This doesn't look like a winmail.dat (TNEF) file — the signature doesn't match.",
    errCorruptStream: 'This file could not be read — the attachment data looks incomplete or corrupted.',
    errNoAttachments: 'This winmail.dat contains a message body but no extractable attachments in this version.',
    errConversionFailed: 'Could not read this file.',

    // GlobalDropZone
    dzProcessing: 'Opening {count} file(s)…',
    dzPleaseWait: 'Please wait',
    dzDropTitle: 'Drop a winmail.dat to open it',
    dzDropSub: 'The attachments inside can be extracted',

    // InstallPrompt
    installHeading: 'Install app',
    installBody: 'Add to your home screen for quick access.',
    install: 'Install',
    later: 'Later',

    // ThemeToggle
    themeToLight: 'Switch to light mode',
    themeToDark: 'Switch to dark mode',
    themeLabel: 'Theme',

    // shared
    required: 'Required',
    close: 'Close',
  },
  ja: {
    // WinmailViewerTool — open / dropzone
    uploadHeading: 'winmail.dat を開く',
    uploadSubtitle: 'ファイルを選んでください。端末内で読み込まれます。',
    dropClick: 'クリックして winmail.dat を選択',
    dropOr: 'またはページ上にドロップ',
    dropSupported: 'winmail.dat（TNEF）ファイル',
    reading: '読み込み中…',

    // WinmailViewerTool — listing / actions
    attachmentsLabel: '件の添付',
    attachmentsAria: 'ファイル内で見つかった添付ファイル',
    download: 'ダウンロード',
    downloadAll: 'すべて .zip でダウンロード',
    bundling: 'zip を作成中…',
    clearAll: 'クリア',

    // WinmailViewerTool — error / notice states (AppError codes)
    errBadSignature: 'winmail.dat（TNEF）ファイルではないようです。署名が一致しません。',
    errCorruptStream: 'このファイルを読み込めませんでした。添付データが不完全か破損している可能性があります。',
    errNoAttachments: 'この winmail.dat にはメール本文が含まれていますが、このバージョンで取り出せる添付ファイルはありません。',
    errConversionFailed: 'このファイルを読み込めませんでした。',

    // GlobalDropZone
    dzProcessing: '{count} 件のファイルを開いています…',
    dzPleaseWait: 'お待ちください',
    dzDropTitle: 'ドロップで winmail.dat を開く',
    dzDropSub: '中の添付ファイルを取り出せます',

    // InstallPrompt
    installHeading: 'アプリを追加',
    installBody: 'ホーム画面に追加すると、すぐに開けます。',
    install: '追加',
    later: 'あとで',

    // ThemeToggle
    themeToLight: 'ライトモードに切り替え',
    themeToDark: 'ダークモードに切り替え',
    themeLabel: 'テーマ',

    // shared
    required: '必須',
    close: '閉じる',
  },
  zh: {
    // WinmailViewerTool — open / dropzone
    uploadHeading: '打开 winmail.dat',
    uploadSubtitle: '选择文件。文件在你的设备上读取。',
    dropClick: '点击选择 winmail.dat 文件',
    dropOr: '或把文件拖到页面任意位置',
    dropSupported: 'winmail.dat（TNEF）文件',
    reading: '正在读取…',

    // WinmailViewerTool — listing / actions
    attachmentsLabel: '个附件',
    attachmentsAria: '文件中找到的附件',
    download: '下载',
    downloadAll: '全部下载为 .zip',
    bundling: '正在准备 zip…',
    clearAll: '清除',

    // WinmailViewerTool — error / notice states (AppError codes)
    errBadSignature: '这看起来不是 winmail.dat（TNEF）文件——签名不匹配。',
    errCorruptStream: '无法读取此文件——附件数据看起来不完整或已损坏。',
    errNoAttachments: '这个 winmail.dat 包含邮件正文，但在当前版本中没有可提取的附件。',
    errConversionFailed: '无法读取此文件。',

    // GlobalDropZone
    dzProcessing: '正在打开 {count} 个文件…',
    dzPleaseWait: '请稍候',
    dzDropTitle: '拖入 winmail.dat 即可打开',
    dzDropSub: '可以提取里面的附件',

    // InstallPrompt
    installHeading: '安装应用',
    installBody: '添加到主屏幕，方便随时打开。',
    install: '安装',
    later: '以后再说',

    // ThemeToggle
    themeToLight: '切换到浅色模式',
    themeToDark: '切换到深色模式',
    themeLabel: '主题',

    // shared
    required: '必填',
    close: '关闭',
  },
  de: {
    // WinmailViewerTool — open / dropzone
    uploadHeading: 'winmail.dat öffnen',
    uploadSubtitle: 'Wähle die Datei. Sie wird auf deinem Gerät gelesen.',
    dropClick: 'Zum Auswählen einer winmail.dat klicken',
    dropOr: 'oder Datei irgendwo auf die Seite ziehen',
    dropSupported: 'winmail.dat-Dateien (TNEF)',
    reading: 'Wird gelesen…',

    // WinmailViewerTool — listing / actions
    attachmentsLabel: 'Anhänge',
    attachmentsAria: 'In der Datei gefundene Anhänge',
    download: 'Herunterladen',
    downloadAll: 'Alle als .zip herunterladen',
    bundling: 'ZIP wird vorbereitet…',
    clearAll: 'Leeren',

    // WinmailViewerTool — error / notice states (AppError codes)
    errBadSignature: 'Das sieht nicht nach einer winmail.dat-Datei (TNEF) aus — die Signatur stimmt nicht überein.',
    errCorruptStream: 'Diese Datei konnte nicht gelesen werden — die Anhangsdaten wirken unvollständig oder beschädigt.',
    errNoAttachments: 'Diese winmail.dat enthält einen Nachrichtentext, aber keine extrahierbaren Anhänge in dieser Version.',
    errConversionFailed: 'Diese Datei konnte nicht gelesen werden.',

    // GlobalDropZone
    dzProcessing: '{count} Datei(en) werden geöffnet …',
    dzPleaseWait: 'Bitte warten',
    dzDropTitle: 'Lege eine winmail.dat zum Öffnen ab',
    dzDropSub: 'Die enthaltenen Anhänge können extrahiert werden',

    // InstallPrompt
    installHeading: 'App installieren',
    installBody: 'Zum Startbildschirm hinzufügen, um es direkt zu öffnen.',
    install: 'Installieren',
    later: 'Später',

    // ThemeToggle
    themeToLight: 'Zum hellen Modus wechseln',
    themeToDark: 'Zum dunklen Modus wechseln',
    themeLabel: 'Design',

    // shared
    required: 'Erforderlich',
    close: 'Schließen',
  },
  es: {
    // WinmailViewerTool — open / dropzone
    uploadHeading: 'Abrir un winmail.dat',
    uploadSubtitle: 'Elige el archivo. Se lee en tu dispositivo.',
    dropClick: 'Haz clic para elegir un winmail.dat',
    dropOr: 'o suéltalo en cualquier parte de la página',
    dropSupported: 'Archivos winmail.dat (TNEF)',
    reading: 'Leyendo…',

    // WinmailViewerTool — listing / actions
    attachmentsLabel: 'adjuntos',
    attachmentsAria: 'Adjuntos encontrados dentro del archivo',
    download: 'Descargar',
    downloadAll: 'Descargar todo como .zip',
    bundling: 'Preparando el zip…',
    clearAll: 'Limpiar',

    // WinmailViewerTool — error / notice states (AppError codes)
    errBadSignature: 'Esto no parece un archivo winmail.dat (TNEF): la firma no coincide.',
    errCorruptStream: 'No se pudo leer este archivo: los datos del adjunto parecen incompletos o dañados.',
    errNoAttachments: 'Este winmail.dat contiene el texto de un mensaje, pero no hay adjuntos extraíbles en esta versión.',
    errConversionFailed: 'No se pudo leer este archivo.',

    // GlobalDropZone
    dzProcessing: 'Abriendo {count} archivo(s)…',
    dzPleaseWait: 'Espera un momento',
    dzDropTitle: 'Suelta un winmail.dat para abrirlo',
    dzDropSub: 'Se pueden extraer los adjuntos que contiene',

    // InstallPrompt
    installHeading: 'Instalar la app',
    installBody: 'Añádela a tu pantalla de inicio para tenerla siempre a mano.',
    install: 'Instalar',
    later: 'Más tarde',

    // ThemeToggle
    themeToLight: 'Cambiar al modo claro',
    themeToDark: 'Cambiar al modo oscuro',
    themeLabel: 'Tema',

    // shared
    required: 'Obligatorio',
    close: 'Cerrar',
  },
} as const;

export type UiStrings = (typeof ui)['en'];

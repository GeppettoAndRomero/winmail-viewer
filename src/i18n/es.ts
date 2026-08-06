import type { ToolContent } from './types';

// Español. Transcreación con el vocabulario que se usa realmente en español para
// explicar el problema de winmail.dat en Outlook, no traducción literal. Sin
// palabras publicitarias (fácil / rápido / perfecto…); la privacidad se explica de
// forma estructural, no como promesa. Español pan-regional, registro «tú».

export const es: ToolContent = {
  htmlLang: 'es',

  meta: {
    title: 'Abrir winmail.dat en el navegador — recuperar los archivos adjuntos | runlocally',
    description:
      'Abre un archivo winmail.dat de Outlook y recupera los archivos adjuntos reales que contiene: un contrato, una factura, una foto. No se sube nada. Código abierto, funciona sin conexión.',
    ogTitle: 'Abre winmail.dat y recupera tus archivos adjuntos',
    ogDescription:
      'A veces Outlook envía un winmail.dat inservible en lugar del archivo que alguien quería mandarte. Ábrelo aquí y descarga los adjuntos reales: se lee en tu dispositivo, no se sube nada.',
  },

  hero: {
    h1: 'Winmail Viewer',
    tagline:
      'Abre un archivo winmail.dat y recupera los archivos adjuntos reales que contiene. No se sube nada.',
  },

  intro: {
    h2: 'Por qué te ha llegado un archivo llamado winmail.dat',
    paras: [
      'winmail.dat aparece cuando alguien que usa Outlook te envía un correo con formato «texto enriquecido de Outlook» y tu programa de correo no es Outlook. En vez del archivo que esa persona adjuntó de verdad —un PDF, una foto, una hoja de cálculo—, recibes un archivo con un nombre raro que no parece abrirse con nada. El adjunto real no se ha perdido: está empaquetado dentro de winmail.dat en un formato llamado TNEF, y esta herramienta lo desempaqueta online, directamente en tu navegador, sin instalar nada.',
      'Suelta el archivo aquí y se lee al momento en tu navegador. La herramienta lista cada adjunto que encuentra dentro, con su nombre y tamaño, y te deja descargar cada uno por separado, o todos juntos, tal como eran los archivos originales.',
    ],
  },

  privacy: {
    h2: 'Por qué el archivo se queda en tu dispositivo',
    lead: 'Un winmail.dat suele llevar dentro algo que alguien te envió confiando en ti: un contrato, una factura, el escaneo de un documento. Aquí la privacidad es estructural, no una promesa. No hay paso de subida porque no hay ningún servidor al que subir:',
    points: [
      'El archivo se abre y se desempaqueta por completo en tu navegador.',
      'La página se sirve como archivos estáticos y no hace ninguna petición que lleve tus datos.',
      'El código es abierto y cualquiera puede leerlo (MIT).',
      'Funciona sin conexión, algo que solo es posible porque nada sale del dispositivo.',
    ],
    note: 'Si quieres comprobarlo tú mismo, abre el panel de Red de tu navegador mientras abres un archivo: ninguna petición lo transporta.',
    sourceLinkText: 'Leer el código.',
  },

  howto: {
    h2: 'Cómo se usa',
    steps: [
      {
        h3: 'Abre el archivo winmail.dat',
        p: 'Haz clic para elegir el archivo, o suéltalo en cualquier parte de la página. Se lee en tu dispositivo; no se sube.',
      },
      {
        h3: 'Mira qué hay dentro',
        p: 'Cada adjunto empaquetado dentro se lista con su nombre y su tamaño.',
      },
      {
        h3: 'Descarga los archivos reales',
        p: 'Descarga un adjunto por separado, o usa «Descargar todo» para obtener todos los adjuntos juntos en un .zip.',
      },
    ],
  },

  faqHeading: 'Preguntas frecuentes',
  faq: [
    {
      q: '¿Qué es exactamente winmail.dat?',
      a: 'Es un archivo contenedor, en un formato llamado TNEF, que Outlook crea al enviar un mensaje con formato «texto enriquecido de Outlook» a alguien cuyo programa de correo no entiende ese formato. Lo que el remitente adjuntó de verdad se guarda dentro, junto con parte del formato del texto del mensaje.',
    },
    {
      q: '¿Es lo mismo que un archivo «windat», «win.dat» o «winmail dat»?',
      a: 'Sí. winmail.dat a veces se escribe o se busca también como windat, win.dat o winmail dat — en todos los casos es el mismo archivo que genera Outlook. Esta herramienta lo abre igual, sea cual sea la forma en que lo escribiste para llegar aquí.',
    },
    {
      q: '¿Por qué mi archivo adjunto se convirtió en esto?',
      a: 'El remitente usa Outlook con una opción que da formato de texto enriquecido a los correos salientes (a veces se activa automáticamente para contactos de una libreta de direcciones corporativa). El servidor de correo del remitente empaqueta el mensaje y sus adjuntos en un winmail.dat antes de enviarlo. Tú no has hecho nada mal, y normalmente ni el propio remitente se da cuenta de que ocurre.',
    },
    {
      q: '¿Se sube mi archivo a algún sitio?',
      a: 'No. El archivo se abre y se desempaqueta por completo en tu navegador. No hay componente de servidor, así que no tiene forma de salir del dispositivo. El código es abierto y puedes confirmarlo en el panel de Red de tu navegador.',
    },
    {
      q: '¿Puedo ver el texto del correo, no solo los adjuntos?',
      a: 'Todavía no. El texto del mensaje dentro de un winmail.dat se guarda en un formato comprimido distinto al de los adjuntos, y decodificarlo es un trabajo mayor y separado. Esta versión solo extrae archivos adjuntos reales. Si un winmail.dat no tiene ningún adjunto, la herramienta te lo dice claramente en vez de simular que muestra un texto.',
    },
    {
      q: '¿Y si el archivo tiene más de un adjunto?',
      a: 'Cada adjunto dentro se lista por separado, con su propio tamaño y su propio enlace de descarga. «Descargar todo» los empaqueta todos en un único .zip para que no tengas que guardarlos uno a uno.',
    },
    {
      q: '¿Qué pasa si el archivo no se abre?',
      a: 'Puede indicarte varias cosas: que el archivo no empieza con la firma TNEF (puede que en realidad no sea un winmail.dat), que los datos del adjunto parecen incompletos o dañados, o que el archivo es válido pero realmente no tiene ningún adjunto empaquetado. Cada caso muestra un mensaje claro propio, no un fallo genérico.',
    },
    {
      q: '¿Funciona sin conexión?',
      a: 'Sí. Es una PWA. Tras la primera visita queda en caché, así que abrir un archivo funciona sin conexión. También puedes instalarla en tu pantalla de inicio.',
    },
  ],

  footer: {
    openSourceLabel: 'Código abierto (MIT)',
    partOf: 'parte de',
    brandTail: '— pequeñas herramientas que funcionan localmente en tu dispositivo.',
    colophon:
      'Creado y mantenido por Geppetto. Parte del código se escribe con ayuda de IA; la revisión y las decisiones son del responsable del proyecto.',
    securityText: 'Seguridad',
  },

  related: {
    h2: 'Herramientas relacionadas',
    blogLinkText: 'Leer las notas técnicas',
  },
};

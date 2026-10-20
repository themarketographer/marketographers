// Estilos de referencia: borradores iniciales calcados de las dos landings
// reales de Pablo (estudiographica.com y marketographers.com). Cada estilo
// trae tres cosas:
//   1. `theme`: colores, tipografías y radios medidos del CSS real de cada sitio.
//   2. `draft`: los bloques en el mismo orden de secciones que el sitio real,
//      con la superficie de cada sección (página, contraste o acento) y la
//      animación que esa sección tiene de verdad en el sitio (`refAnimation`).
//   3. `reference`: qué puede mirar la IA del alumno para copiar la forma de
//      construir (repo, archivos clave) y qué NO puede copiar (textos, fotos,
//      marcas, IDs de tracking).
//
// Los textos de los bloques son corchetes con la fórmula de cada sección, para
// que el alumno escriba lo suyo. Nunca se copia el texto de Pablo.

export const GRAPHICA_REPO = 'https://github.com/themarketographer/estudiographica'
const GRAPHICA_RAW = 'https://raw.githubusercontent.com/themarketographer/estudiographica/main'

export const STYLE_REFS = {
  graphica: {
    id: 'graphica',
    label: 'Estudio Graphica',
    tagline: 'Claro, cálido y con foto protagonista. Secciones que alternan papel, tinta y amarillo.',
    swatches: ['#f8f8f8', '#181818', '#ffdd5a'],
    sectionStrip: ['page', 'page', 'contrast', 'page', 'contrast', 'page', 'contrast', 'accent'],
    theme: {
      headingFont: "'Poppins', system-ui, sans-serif",
      bodyFont: "'Poppins', system-ui, sans-serif",
      primaryColor: '#181818',
      primaryTextColor: '#f8f8f8',
      backgroundColor: '#f8f8f8',
      textColor: '#181818',
      accentColor: '#ffdd5a',
      accentTextColor: '#181818',
      radius: 'pill',
    },
    reveal: 'Cada sección entra subiendo 26px desde un desenfoque de 8px, en 0,9 s, una sola vez al aparecer en pantalla.',
    draft: [
      {
        type: 'header',
        overrideProps: { links: 'Inicio, Portafolio, Servicios, Preguntas', ctaText: 'Agenda tu llamada', behavior: 'sticky' },
        refAnimation:
          'Barra flotante tipo píldora de vidrio (backdrop-filter blur 22px, saturate 190%) centrada arriba, a 14px del borde. Se vuelve vidrio oscuro cuando pasa sobre una sección oscura y una línea amarilla de 2px en su borde inferior se llena según el avance del scroll. El logo gira -14° al pasar el mouse.',
      },
      {
        type: 'hero',
        variant: 'texto-izquierda',
        overrideProps: {
          title: '[Consecuencia de tener malas fotos, con una ~~palabra clave~~ resaltada]',
          subtitle: '[Qué haces, para quién y en qué ciudad. Una frase que diga por qué te eligen sin mirar el precio]',
          ctaText: 'Agenda tu diagnóstico gratuito',
          bgType: 'image',
          bgDarken: 0,
          mobileImagePosition: 'bottom',
        },
        refAnimation:
          'El título entra palabra por palabra (cada palabra sube desde un desenfoque, 65ms entre una y otra) y la palabra clave recibe un subrayado amarillo grueso que se dibuja de izquierda a derecha al final. A la derecha, un carrusel de fotos tipo publicación de Instagram que avanza solo, y la foto se inclina en 3D siguiendo el puntero, el dedo, el giroscopio del celular y el scroll. Debajo del CTA, tres cifras que cuentan desde 0 hasta su valor.',
      },
      {
        type: 'trustBar',
        overrideProps: { caption: '[Marcas o clientes que ya pasaron por tu cámara]', logoCount: 6 },
        refAnimation:
          'Cinta de logos en escala de grises que avanza sola de forma continua y también se puede arrastrar con inercia. Los logos se recortan y centran en cuadrados blancos para que todos se vean parejos.',
      },
      {
        type: 'beforeAfter',
        surface: 'contrast',
        overrideProps: {
          title: '[La gente compra primero con los ojos: frase que nombre el dolor]',
          beforeLabel: 'Celular',
          afterLabel: 'Profesional',
          caption: 'Desliza la foto y fíjate cuál elegirías tú',
        },
        refAnimation:
          'Sección oscura con grano de película y un foco de luz amarillo que sigue al puntero. Arriba, una frase manifiesto cuyas palabras se encienden una por una al hacer scroll. El comparador antes/después mueve su línea solo con el scroll y, si la persona lo toca, el dedo toma el control.',
      },
      {
        type: 'garantias',
        overrideProps: {
          title: '[Todos los lugares donde tu cliente ve tu trabajo]',
          cardCount: 4,
          cards: ['[ícono] | [Lugar 1] | [Qué gana tu cliente ahí]', '[ícono] | [Lugar 2] | [Qué gana tu cliente ahí]', '[ícono] | [Lugar 3] | [Qué gana tu cliente ahí]', '[ícono] | [Lugar 4] | [Qué gana tu cliente ahí]'],
        },
        refAnimation:
          'Lista de formatos con ícono de trazo propio. Cada fila sube con desenfoque escalonada 60ms. En el celular, la fila que cruza el centro de la pantalla se ilumina sola (el equivalente táctil del hover).',
      },
      {
        type: 'process',
        surface: 'contrast',
        overrideProps: {
          title: '[Tu plan mes a mes]',
          stepCount: 5,
          steps: ['[Mes 1: qué entregas]', '[Mes 2: qué entregas]', '[Mes 3: qué entregas]', '[Mes 4: qué entregas]', '[Mes 5: qué entregas]'],
        },
        refAnimation:
          'Pista horizontal de tarjetas con vidrio y brillo especular que sigue al puntero. Se arrastra con el mouse con inercia y se imanta a la tarjeta más cercana; tiene flechas y una barra de progreso que se llena según el avance. Los checks de cada tarjeta se dibujan con stroke-dashoffset al entrar.',
      },
      {
        type: 'portfolio',
        variant: 'carrusel',
        overrideProps: { title: '[Pregunta que pique el orgullo de tu cliente]', pieceCount: 8 },
        refAnimation:
          'Carrusel de fotos con esquinas de 36px y sombra larga, que avanza solo y se detiene cuando la persona lo toca, lo arrastra o hace scroll. Cada foto abre un lightbox a pantalla completa.',
      },
      {
        type: 'pricing',
        variant: 'tarjetas-precio-exacto',
        surface: 'contrast',
        overrideProps: { title: '[Dos formas de trabajar contigo]', planCount: 2, highlightedPlan: true },
        refAnimation:
          'Dos tarjetas grandes de vidrio oscuro con un abanico de tres fotos que se abre al pasar el mouse. Los checks de cada beneficio se dibujan al entrar en pantalla y la tarjeta destacada entra con un leve pop de escala.',
      },
      {
        type: 'proximosPasos',
        overrideProps: {
          title: '[Así trabajamos, del primer mensaje a la entrega]',
          stepCount: 4,
          steps: ['[Agendamos una llamada]', '[Revisamos tu negocio]', '[Hacemos la sesión]', '[Recibes tus fotos]'],
          ctaText: 'Empezar ahora',
        },
        refAnimation:
          'Línea de pasos vertical que se llena con el scroll: cada número se enciende en amarillo cuando la línea llega a él.',
      },
      {
        type: 'faq',
        variant: 'acordeon-ancho',
        overrideProps: { title: 'Preguntas frecuentes', questionCount: 5 },
        refAnimation:
          'Acordeón de una pregunta abierta a la vez: el signo más gira 45° y la respuesta abre con transición de altura suave. Las preguntas van redactadas como las diría el cliente.',
      },
      {
        type: 'about',
        surface: 'contrast',
        overrideProps: { title: 'Conoce a tu fotógrafo', bio: '[Por qué tu portafolio habla más que tus títulos. Tres credenciales cortas, sin biografía larga]' },
        refAnimation:
          'Retrato en forma de arco (border-radius de ventana de catedral) con una insignia flotante, sobre fondo oscuro con grano y foco de luz que sigue al puntero.',
      },
      {
        type: 'finalCta',
        surface: 'accent',
        overrideProps: { title: '[Agenda tu diagnóstico gratuito: lo que revisan juntos en la llamada]', buttonText: 'Agendar reunión', align: 'center' },
        refAnimation:
          'Sección amarilla con degradados radiales cálidos, grano y placas de vidrio blanco que se mueven con parallax. Los botones son tinta sobre amarillo. Debajo del botón, una línea corta con el tiempo de respuesta.',
      },
      {
        type: 'footer',
        surface: 'contrast',
        refAnimation: 'Sin animación. Logo blanco sobre tinta, enlaces con subrayado amarillo grueso que se separa del texto al pasar el mouse.',
      },
    ],
    reference: {
      live: 'https://estudiographica.com',
      repo: GRAPHICA_REPO,
      files: [
        [`${GRAPHICA_RAW}/assets/css/eg-ui.css`, 'tokens, superficies (papel, tinta, amarillo), grano, foco de luz, botones con relleno que sube, barra de vidrio, revelado al hacer scroll'],
        [`${GRAPHICA_RAW}/assets/js/eg-ui.js`, 'revelado con IntersectionObserver, barra de vidrio que cambia sobre fondos oscuros, botones magnéticos, foco de luz, títulos palabra por palabra, un solo requestAnimationFrame para todo el scroll'],
        [`${GRAPHICA_RAW}/assets/css/eg-home.css`, 'estilos de cada sección de la portada (hero, marcas, comparador, pista de tarjetas, portafolio, precios, pasos, preguntas, cierre)'],
        [`${GRAPHICA_RAW}/assets/js/eg-home.js`, 'carrusel del hero, inclinación 3D, cinta de logos, frase que se enciende, comparador, arrastre con inercia, lightbox, pasos que se llenan'],
        [`${GRAPHICA_RAW}/index.html`, 'marcado HTML de la portada completa'],
      ],
    },
  },

  marketographers: {
    id: 'marketographers',
    label: 'Marketographers',
    tagline: 'Noche con vidrio y un solo amarillo. Titulares con carácter y movimiento que reacciona al mouse.',
    swatches: ['#0c0c0c', '#1d1d1d', '#fddc5b'],
    sectionStrip: ['page', 'page', 'page', 'contrast', 'page', 'page', 'contrast', 'page'],
    theme: {
      headingFont: "'Working', 'Poppins', system-ui, sans-serif",
      bodyFont: "'Poppins', system-ui, sans-serif",
      primaryColor: '#161616',
      primaryTextColor: '#f8f8f8',
      backgroundColor: '#0c0c0c',
      textColor: '#f8f8f8',
      accentColor: '#fddc5b',
      accentTextColor: '#181818',
      radius: 'pill',
    },
    reveal: 'Cada sección sube 28px y aparece en 0,9 s con la curva cubic-bezier(.22,1,.36,1); varias piezas juntas entran con 90ms de diferencia.',
    draft: [
      {
        type: 'header',
        overrideProps: { links: 'Problema, Qué incluye, Casos, Precio', ctaText: 'Únete', behavior: 'sticky' },
        refAnimation:
          'Píldora de vidrio oscuro fija arriba (blur 20px, saturate 170%) con indicador de la sección activa. En el celular, al pasar el hero aparece una barra inferior con el botón principal, que se esconde al llegar al precio.',
      },
      {
        type: 'hero',
        variant: 'texto-izquierda',
        overrideProps: {
          title: '[Tu cliente ya eligió. ~~Eligió al que sí sabe venderse.~~]',
          subtitle: '[Qué es, para quién, y una pregunta que incomode]',
          ctaText: 'Únete a la comunidad',
          bgType: 'solid',
          bgDarken: 0,
        },
        refAnimation:
          'Titular gigante centrado con la palabra clave en amarillo; las palabras suben una por una. Debajo, el video principal en un marco de 28px de radio que se inclina en 3D siguiendo el puntero (interrumpible) y se reproduce con un solo clic. Anillos amarillos finos de fondo con parallax suave.',
      },
      {
        type: 'stats',
        overrideProps: { statCount: 3, stats: ['+500 | [qué cuentas]', '+17 | [qué cuentas]', '+50k | [qué cuentas]'] },
        refAnimation: 'Cifras con números tabulares que cuentan hacia su valor final una sola vez, en 1,2 s, al entrar en pantalla.',
      },
      {
        type: 'promise',
        overrideProps: {
          title: '[Frase puente que conecta el dolor con la solución]',
          transformation: '[Una sola frase con la palabra clave al final]',
          body: '',
        },
        refAnimation:
          'Frase manifiesto grande en tipografía de display: cada palabra pasa de opacidad 0,2 a 1 mientras el scroll la cruza, y la palabra clave se tiñe de amarillo.',
      },
      {
        type: 'problem',
        surface: 'contrast',
        overrideProps: { title: '[Cifra que duele: el % de tu cliente que fracasa en algo]', body: '[Tres escenas concretas con hora, lugar y una cifra cada una]' },
        refAnimation:
          'Tres tarjetas de escena (hora, lugar y una cifra en rojo) que entran escalonadas. En escritorio se inclinan siguiendo el mouse; en el celular se encienden cuando cruzan el centro de la pantalla.',
      },
      {
        type: 'garantias',
        overrideProps: {
          title: '[Todo lo que necesitas para lograr la promesa]',
          cardCount: 4,
          cards: ['[ícono] | [Beneficio 1] | [Cómo funciona]', '[ícono] | [Beneficio 2] | [Cómo funciona]', '[ícono] | [Beneficio 3] | [Cómo funciona]', '[ícono] | [Beneficio 4] | [Cómo funciona]'],
        },
        refAnimation:
          'Pista horizontal de tarjetas: entran deslizando 90px desde la derecha, se arrastran con inercia (desaceleración 0,998) y se imantan a la tarjeta más cercana; la escala de cada tarjeta depende de su distancia al centro. Un brillo radial sigue al puntero dentro de cada tarjeta.',
      },
      {
        type: 'portfolio',
        variant: 'grid',
        overrideProps: { title: '[Esto es lo que abres el día que entras]', pieceCount: 4 },
        refAnimation:
          'Bento de cuatro mosaicos con el producto real (clase en vivo, chat de ejemplo, herramienta funcionando, pack de recursos), con inclinación al pasar el mouse. Todo ejemplo va rotulado como ejemplo.',
      },
      {
        type: 'testimonials',
        variant: 'carrusel-flechas',
        overrideProps: { title: '[Clientes que ya la están rompiendo]', count: 6 },
        refAnimation:
          'Misma pista horizontal con arrastre e inercia; mientras haya un dedo apoyado el autoplay no toma el control y retoma 2,5 s después de soltar.',
      },
      {
        type: 'about',
        surface: 'contrast',
        overrideProps: { title: '[¿Quién es este loco?]', bio: '[Credenciales en una línea y la razón real por la que haces esto]' },
        refAnimation: 'Foto con esquinas grandes y texto que entra con fade-up; credenciales en una fila corta.',
      },
      {
        type: 'faq',
        variant: 'acordeon-ancho',
        overrideProps: { title: '[Lo que ya te dijiste en la ducha, con su respuesta]', questionCount: 5 },
        refAnimation:
          'Objeciones con humor en tarjetas desplegables, una abierta a la vez; el contenido entra con un desenfoque corto. La última tarjeta es el llamado a la acción.',
      },
      {
        type: 'pricing',
        variant: 'tarjetas-precio-exacto',
        overrideProps: { title: '[Una sola decisión. La que te faltaba tomar.]', planCount: 1, highlightedPlan: true },
        refAnimation:
          'Una sola tarjeta de vidrio. El precio cuenta hacia abajo (de un precio tachado al actual) para leerse como oferta, con números tabulares. Interruptor mensual/anual con píldora que se desliza.',
      },
      {
        type: 'finalCta',
        surface: 'contrast',
        overrideProps: { title: '[¿Vas a seguir igual o vas a aprender a venderte?]', buttonText: 'Únete ahora', align: 'center' },
        refAnimation: 'Titular centrado con dos anillos amarillos concéntricos de fondo y botones magnéticos que se acercan al puntero.',
      },
      {
        type: 'footer',
        refAnimation: 'Sin animación. Wordmark con el punto amarillo y enlaces en gris claro.',
      },
    ],
    reference: {
      live: 'https://marketographers.com',
      repo: 'https://github.com/themarketographer/marketographers',
      files: [[`https://marketographers.com`, 'portada en vivo: el CSS y el JavaScript van dentro del mismo index.html']],
    },
  },
}

// Borrador combinado: las secciones más fuertes de las dos páginas, en el
// orden de una landing que vende (gancho, dolor, prueba, oferta, cierre). Usa
// la paleta clara de Graphica porque alterna papel, tinta y amarillo, que es
// lo que mejor muestra el ritmo de secciones.
STYLE_REFS.inspiracion = {
  id: 'inspiracion',
  label: 'Inspiración',
  tagline: 'Las mejores secciones de Estudio Graphica y Marketographers juntas. Quita, mueve y cambia lo que quieras.',
  swatches: ['#f8f8f8', '#181818', '#ffdd5a'],
  sectionStrip: ['page', 'contrast', 'page', 'contrast', 'page', 'contrast', 'page', 'accent'],
  theme: { ...STYLE_REFS.graphica.theme },
  reveal: STYLE_REFS.graphica.reveal,
  draft: [
    { type: 'header', overrideProps: { links: 'Problema, Servicios, Casos, Precio', ctaText: 'Agenda tu llamada', behavior: 'sticky' }, refAnimation: STYLE_REFS.graphica.draft[0].refAnimation },
    { type: 'heroCarousel' },
    { type: 'trustBar', overrideProps: { caption: '[Marcas o clientes que ya pasaron por tu cámara]', logoCount: 6 }, refAnimation: STYLE_REFS.graphica.draft[2].refAnimation },
    { type: 'statement', surface: 'contrast' },
    { type: 'scenes', surface: 'contrast' },
    { type: 'beforeAfter', overrideProps: { title: '[Muéstrale la diferencia: frase que invite a comparar]', beforeLabel: 'Antes', afterLabel: 'Contigo', caption: 'Desliza la foto y fíjate cuál elegirías tú' }, refAnimation: STYLE_REFS.graphica.draft[3].refAnimation },
    { type: 'formatList' },
    { type: 'cardTrack', surface: 'contrast' },
    { type: 'bento' },
    { type: 'portfolio', variant: 'carrusel', overrideProps: { title: '[Pregunta que pique el orgullo de tu cliente]', pieceCount: 8 }, refAnimation: STYLE_REFS.graphica.draft[6].refAnimation },
    { type: 'painMap', surface: 'contrast' },
    { type: 'testimonials', variant: 'carrusel-flechas', overrideProps: { title: '[Clientes que ya la están rompiendo]', count: 6 }, refAnimation: STYLE_REFS.marketographers.draft[7].refAnimation },
    { type: 'ways', surface: 'contrast' },
    { type: 'pricingToggle' },
    { type: 'stepsLine' },
    { type: 'objections' },
    { type: 'aboutArch', surface: 'contrast' },
    { type: 'finalCta', surface: 'accent', overrideProps: { title: '[Agenda tu llamada: qué revisan juntos y cuánto dura]', buttonText: 'Agendar llamada', align: 'center' }, refAnimation: STYLE_REFS.graphica.draft[11].refAnimation },
    { type: 'footer', surface: 'contrast', refAnimation: STYLE_REFS.graphica.draft[12].refAnimation },
  ],
  reference: {
    live: 'https://estudiographica.com y https://marketographers.com (secciones de las dos)',
    repo: GRAPHICA_REPO,
    files: [...STYLE_REFS.marketographers.reference.files],
  },
}

export const STYLE_IDS = Object.keys(STYLE_REFS)

export function getStyleRef(id) {
  return STYLE_REFS[id] ?? null
}

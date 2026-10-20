// Bloques de inspiración: las secciones características de estudiographica.com
// y marketographers.com convertidas en bloques del wireframe. Cada uno trae su
// esquema de campos (textos como fórmulas entre corchetes), la animación real
// de esa sección en el sitio, y sus notas de SEO y responsive para el prompt.
//
// Se mezclan en BLOCK_SCHEMA desde blockSchema.js (que pasa sus helpers para
// no crear un import circular).

export const INSPIRATION_TYPES = [
  'heroCarousel',
  'heroVideo',
  'statement',
  'scenes',
  'formatList',
  'cardTrack',
  'bento',
  'painMap',
  'ways',
  'pricingToggle',
  'stepsLine',
  'objections',
  'aboutArch',
]

export function inspirationSchemas({ ctaActionFields }) {
  return {
    heroCarousel: {
      label: 'Hero con carrusel',
      origin: 'Graphica',
      variants: null,
      fields: [
        { key: 'title', label: 'Título', type: 'text', default: '[Lo que pierde tu cliente si sigue igual, con una ~~palabra clave~~]' },
        { key: 'subtitle', label: 'Subtítulo', type: 'textarea', default: '[Qué haces, para quién y dónde. Por qué te eligen sin mirar el precio]' },
        { key: 'ctaText', label: 'Texto del botón principal', type: 'text', default: 'Agenda tu diagnóstico gratuito' },
        ...ctaActionFields(),
        { key: 'secondaryText', label: 'Botón secundario (contorno)', type: 'text', default: 'Escríbenos por WhatsApp' },
        { key: 'statCount', label: 'Cantidad de cifras', type: 'number', min: 0, max: 4, default: 3 },
        { key: 'stats', label: 'Cifras', type: 'repeatable', countField: 'statCount', default: '[+400] | [qué cuentas]', placeholder: 'Número | qué cuenta' },
        { key: 'photoCount', label: 'Fotos del carrusel', type: 'number', min: 1, max: 6, default: 4 },
        { key: 'photos', label: 'Fotos (en orden)', type: 'imageList', countField: 'photoCount' },
      ],
    },
    heroVideo: {
      label: 'Hero con video',
      origin: 'Marketographers',
      variants: null,
      fields: [
        { key: 'title', label: 'Título', type: 'text', default: '[Tu cliente ya eligió. ~~Eligió al que sí sabe venderse.~~]' },
        { key: 'subtitle', label: 'Subtítulo', type: 'textarea', default: '[Qué es, para quién, y una pregunta que incomode]' },
        { key: 'ctaText', label: 'Texto del botón', type: 'text', default: 'Únete ahora' },
        ...ctaActionFields(),
        { key: 'videoUrl', label: 'Video (link de YouTube o descripción)', type: 'text', default: '' },
      ],
    },
    statement: {
      label: 'Frase que se enciende',
      origin: 'Las dos',
      variants: null,
      fields: [
        { key: 'text', label: 'Frase', type: 'textarea', default: '[Una frase puente que une el dolor con tu solución y termina en una ~~palabra clave~~]', placeholder: 'Admite ~~palabra clave~~' },
      ],
    },
    scenes: {
      label: 'Escenas del problema',
      origin: 'Marketographers',
      variants: null,
      fields: [
        { key: 'title', label: 'Título', type: 'text', default: '[Una cifra que duela sobre tu cliente]' },
        { key: 'sceneCount', label: 'Cantidad de escenas', type: 'number', min: 2, max: 4, default: 3 },
        { key: 'scenes', label: 'Escenas', type: 'repeatable', countField: 'sceneCount', default: '[Día y hora] | [Lugar] | [Cifra que duele] | [Qué pasa en ese momento]', placeholder: 'Hora | Lugar | Cifra | Qué pasa' },
        { key: 'closing', label: 'Frase que une las escenas', type: 'text', default: '[Lo que tienen en común las tres escenas]' },
      ],
    },
    formatList: {
      label: 'Dónde te ven',
      origin: 'Graphica',
      variants: null,
      fields: [
        { key: 'title', label: 'Título', type: 'text', default: '[Todos los lugares donde tu cliente ve tu trabajo]' },
        { key: 'subtitle', label: 'Bajada', type: 'textarea', default: '[Qué estrategia le dejas para que lo haga solo]' },
        { key: 'rowCount', label: 'Cantidad de filas', type: 'number', min: 3, max: 8, default: 5 },
        { key: 'rows', label: 'Filas', type: 'repeatable', countField: 'rowCount', default: '[Lugar] | [Qué gana tu cliente ahí]', placeholder: 'Lugar | Qué gana' },
      ],
    },
    cardTrack: {
      label: 'Pista de tarjetas',
      origin: 'Las dos',
      variants: null,
      fields: [
        { key: 'title', label: 'Título', type: 'text', default: '[Tu plan, paso a paso]' },
        { key: 'subtitle', label: 'Bajada', type: 'text', default: 'Arrastra las tarjetas para ver el recorrido completo.' },
        { key: 'cardCount', label: 'Cantidad de tarjetas', type: 'number', min: 3, max: 8, default: 5 },
        { key: 'cards', label: 'Tarjetas', type: 'repeatable', countField: 'cardCount', default: '[Etiqueta] | [Título] | [Qué recibe tu cliente]', placeholder: 'Etiqueta (Mes 1) | Título | Texto' },
      ],
    },
    bento: {
      label: 'Por dentro (bento)',
      origin: 'Marketographers',
      variants: null,
      fields: [
        { key: 'title', label: 'Título', type: 'text', default: '[Esto es lo que recibes el día que me contratas]' },
        { key: 'tileCount', label: 'Cantidad de mosaicos', type: 'number', min: 2, max: 4, default: 4 },
        { key: 'tiles', label: 'Mosaicos', type: 'repeatable', countField: 'tileCount', default: '[Etiqueta] | [Qué se ve en la pantalla]', placeholder: 'Etiqueta | Qué muestra' },
        { key: 'images', label: 'Capturas (en orden)', type: 'imageList', countField: 'tileCount' },
      ],
    },
    painMap: {
      label: 'Mapa de dolores',
      origin: 'Marketographers',
      variants: null,
      fields: [
        { key: 'title', label: 'Título', type: 'text', default: '[Dime qué te duele y te digo por dónde empezar]' },
        { key: 'painCount', label: 'Cantidad de dolores', type: 'number', min: 2, max: 6, default: 4 },
        { key: 'pains', label: 'Dolores', type: 'repeatable', countField: 'painCount', default: '[Frase que diría tu cliente en voz alta] | [Servicio o paquete que lo resuelve] | [Texto del enlace]', placeholder: 'Frase del cliente | Qué le ofreces | Texto del enlace' },
      ],
    },
    ways: {
      label: 'Formas de trabajar',
      origin: 'Graphica',
      variants: null,
      fields: [
        { key: 'title', label: 'Título', type: 'text', default: '[Dos formas de trabajar conmigo]' },
        { key: 'wayCount', label: 'Cantidad de opciones', type: 'number', min: 2, max: 3, default: 2 },
        {
          key: 'ways',
          label: 'Opciones',
          type: 'repeatable',
          countField: 'wayCount',
          default: '[Cuándo] | [Nombre del servicio] | [Para quién es y cómo funciona] | [Beneficio 1]; [Beneficio 2] | [Botón]',
          placeholder: 'Etiqueta | Nombre | Texto | beneficios separados por ; | Botón',
        },
        { key: 'photoCount', label: 'Fotos del abanico (por opción)', type: 'number', min: 0, max: 3, default: 3 },
      ],
    },
    pricingToggle: {
      label: 'Precio con interruptor',
      origin: 'Marketographers',
      variants: null,
      fields: [
        { key: 'title', label: 'Título', type: 'text', default: '[Una sola decisión. La que te faltaba tomar.]' },
        { key: 'planName', label: 'Nombre del plan', type: 'text', default: '[Nombre del plan]' },
        { key: 'oldPrice', label: 'Precio tachado', type: 'text', default: '$49' },
        { key: 'price', label: 'Precio mensual', type: 'text', default: '$33' },
        { key: 'annualPrice', label: 'Precio anual', type: 'text', default: '$330' },
        { key: 'annualNote', label: 'Nota del anual', type: 'text', default: '[Pagas 10 meses, 2 gratis]' },
        { key: 'benefitCount', label: 'Cantidad de beneficios', type: 'number', min: 2, max: 8, default: 5 },
        { key: 'benefits', label: 'Beneficios', type: 'repeatable', countField: 'benefitCount', default: '[Beneficio concreto]' },
        { key: 'ctaText', label: 'Texto del botón', type: 'text', default: 'Entrar ahora' },
        ...ctaActionFields(),
        { key: 'fineprint', label: 'Línea bajo el botón', type: 'text', default: '[Cancela cuando quieras]' },
      ],
    },
    stepsLine: {
      label: 'Pasos con línea',
      origin: 'Graphica',
      variants: null,
      fields: [
        { key: 'title', label: 'Título', type: 'text', default: '[Así trabajamos]' },
        { key: 'subtitle', label: 'Bajada', type: 'text', default: '[Cuántos pasos hay del primer mensaje a la entrega]' },
        { key: 'stepCount', label: 'Cantidad de pasos', type: 'number', min: 3, max: 6, default: 5 },
        { key: 'steps', label: 'Pasos', type: 'repeatable', countField: 'stepCount', default: '[Qué pasa] | [Detalle corto]', placeholder: 'Paso | Detalle' },
      ],
    },
    objections: {
      label: 'Objeciones con humor',
      origin: 'Marketographers',
      variants: null,
      fields: [
        { key: 'title', label: 'Título', type: 'text', default: '[Lo que ya te dijiste en la ducha, con su respuesta]' },
        { key: 'itemCount', label: 'Cantidad de objeciones', type: 'number', min: 2, max: 6, default: 4 },
        { key: 'items', label: 'Objeciones', type: 'repeatable', countField: 'itemCount', default: '[La objeción en voz de tu cliente] | [Tu respuesta con un dato]', placeholder: 'Objeción | Respuesta' },
        { key: 'ctaText', label: 'Botón de la última tarjeta', type: 'text', default: 'Ya estoy listo' },
        ...ctaActionFields(),
      ],
    },
    aboutArch: {
      label: 'Sobre mí en arco',
      origin: 'Graphica',
      variants: null,
      fields: [
        { key: 'title', label: 'Título', type: 'text', default: 'Conoce a tu fotógrafo' },
        { key: 'badge', label: 'Insignia sobre la foto', type: 'text', default: '[Tu mejor credencial]' },
        { key: 'bio', label: 'Texto', type: 'textarea', default: '[Por qué tu portafolio habla más que tus títulos]' },
        { key: 'credCount', label: 'Cantidad de credenciales', type: 'number', min: 0, max: 5, default: 3 },
        { key: 'creds', label: 'Credenciales', type: 'repeatable', countField: 'credCount', default: '[Credencial corta]' },
        { key: 'photoImageUrl', label: 'Foto', type: 'image', placeholder: 'Link de Cloudinary de tu foto', default: '' },
        { key: 'ctaText', label: 'Botón', type: 'text', default: 'Ver portafolio' },
      ],
    },
  }
}

// Animación real de cada sección en su sitio de origen.
export const INSPIRATION_ANIMATIONS = {
  heroCarousel:
    'El título entra palabra por palabra (cada palabra sube desde un desenfoque, 65ms entre una y otra) y la palabra clave recibe un subrayado del color de acento que se dibuja de izquierda a derecha al final. A la derecha, un carrusel de fotos tipo publicación de Instagram que avanza solo, y la foto se inclina en 3D siguiendo el puntero, el dedo, el giroscopio del celular y el scroll. Las cifras cuentan desde 0 hasta su valor.',
  heroVideo:
    'Titular grande centrado con la palabra clave en color de acento; las palabras suben una por una. Debajo, el video en un marco de 28px de radio que se inclina en 3D siguiendo el puntero (interrumpible) y se reproduce con un solo clic. Anillos finos del color de acento de fondo con parallax suave.',
  statement:
    'Frase manifiesto grande en la tipografía de títulos: cada palabra pasa de opacidad 0,2 a 1 mientras el scroll la cruza, y la palabra clave se tiñe del color de acento. Con movimiento reducido aparece entera.',
  scenes:
    'Tres tarjetas de escena (hora, lugar y una cifra en rojo) que entran escalonadas 90ms. En escritorio se inclinan siguiendo el mouse; en el celular se encienden cuando cruzan el centro de la pantalla.',
  formatList:
    'Lista de filas con ícono de trazo propio. Cada fila sube con desenfoque, escalonada 60ms. En el celular, la fila que cruza el centro de la pantalla se ilumina sola (el equivalente táctil del hover).',
  cardTrack:
    'Pista horizontal de tarjetas de vidrio con brillo que sigue al puntero. Se arrastra con inercia y se imanta a la tarjeta más cercana; la tarjeta del centro se ve completa y las de los lados se achican un poco. Tiene flechas y una barra de progreso que se llena según el avance.',
  bento:
    'Mosaico de cuatro capturas del producto real con tamaños distintos. Cada mosaico se inclina levemente al pasar el mouse y entra escalonado. Todo ejemplo va rotulado como ejemplo.',
  painMap:
    'Fichas con frases del cliente. Al elegir una, el resultado de abajo cambia con un desenfoque corto (blur 6px a 0, 220ms) y muestra el servicio que lo resuelve con su enlace.',
  ways:
    'Dos tarjetas grandes con un abanico de tres fotos que se abre al pasar el mouse. Los checks de cada beneficio se dibujan con stroke-dashoffset al entrar en pantalla.',
  pricingToggle:
    'Una sola tarjeta de vidrio. El precio cuenta hacia abajo desde el precio tachado hasta el actual (se lee como oferta), con números tabulares. Interruptor mensual/anual con una píldora que se desliza y cambia precio, nota y enlace del botón.',
  stepsLine:
    'Línea de pasos vertical que se llena con el scroll: cada número se enciende en el color de acento cuando la línea llega a él.',
  objections:
    'Tarjetas desplegables, una abierta a la vez; el signo más gira 45° y la respuesta entra con un desenfoque corto. La última tarjeta es el llamado a la acción.',
  aboutArch:
    'Retrato en forma de arco (border-radius de ventana de catedral) con una insignia flotante, sobre fondo oscuro con grano y un foco de luz que sigue al puntero. Las credenciales entran escalonadas.',
}

export const INSPIRATION_HEADINGS = { heroCarousel: 'h1', heroVideo: 'h1', statement: null }

export const INSPIRATION_ALT = {
  heroCarousel: 'Cada foto del carrusel lleva alt con el trabajo concreto, ej. "[plato de pasta con luz lateral para restaurante X]".',
  bento: 'Cada captura lleva alt describiendo qué muestra, ej. "[clase en vivo por Zoom con 20 alumnos]", y un rótulo visible "Ejemplo" si no es real.',
  aboutArch: 'Alt de la foto: "[nombre] fotografiando en [ciudad/estudio]".',
  heroVideo: 'El iframe del video lleva `title` descriptivo y no arranca con sonido hasta el clic.',
}

export const INSPIRATION_RESPONSIVE = {
  heroCarousel: 'Mobile: texto arriba, botones a ancho completo, cifras en fila de 3 chicas y el carrusel debajo a ancho completo. Desktop: texto a la izquierda y carrusel a la derecha.',
  heroVideo: 'Mobile: titular de 2,5rem, video a ancho completo con 16px de margen y sin inclinación (en táctil no hay puntero). Desktop: video de ~980px con inclinación.',
  statement: 'Mobile: 1,7rem con interlineado 1,3 y ancho completo. Desktop: hasta 3,5rem con ancho máximo de 26 caracteres.',
  scenes: 'Mobile: tarjetas apiladas, una por fila. Desktop: tres en fila.',
  formatList: 'Mobile: una columna. Desktop: dos columnas de filas.',
  cardTrack: 'Mobile: tarjeta de 84vw centrada, las vecinas se asoman desvanecidas a los lados; el dedo usa el scroll nativo con scroll-snap. Desktop: arrastre con mouse e inercia, flechas visibles.',
  bento: 'Mobile: mosaicos apilados a ancho completo. Desktop: grilla de 2x2 con el primero más ancho.',
  painMap: 'Mobile: las fichas se desplazan en horizontal en una sola fila. Desktop: fichas en varias filas centradas.',
  ways: 'Mobile: tarjetas apiladas. Desktop: lado a lado.',
  pricingToggle: 'Mobile: tarjeta a ancho completo, interruptor arriba. Desktop: tarjeta centrada de ~520px.',
  stepsLine: 'Mobile y desktop: línea a la izquierda; en desktop el título queda en una columna fija a la izquierda.',
  objections: 'Mobile: una columna. Desktop: dos columnas, la tarjeta del llamado a la acción ocupa el ancho completo al final.',
  aboutArch: 'Mobile: foto arriba (arco más bajo), texto debajo. Desktop: foto a la izquierda y texto a la derecha.',
}

// Catálogo declarativo de los tipos de bloque. El panel de propiedades y
// los valores por defecto se derivan de este objeto en vez de tener un
// formulario hardcodeado por tipo de bloque.
//
// Tipos de campo soportados por PropertiesPanel/fields:
//   text, textarea, select, number, toggle, repeatable
// `repeatable` usa `countField` para saber cuántos items debe tener el
// array (se ajusta solo cuando ese número cambia, sin perder lo escrito).
// Los items de `repeatable` son un string por fila; cuando la fila necesita
// más de un dato (ej. "ícono | título | texto"), se codifica separado por
// `|` y el bloque lo parsea al renderizar — mismo patrón que ya usa
// Estadísticas. `RepeatableListField` ya trae botones ↑↓ para reordenar
// filas, así que cualquier bloque que use `repeatable` permite reordenar
// sus elementos internos sin código extra.
// `showIf(props)` es opcional: si devuelve false, el campo no se renderiza
// en el panel (se usa para las sub-opciones de la acción del botón).
//
// Texto con énfasis: los campos de texto aceptan una sintaxis liviana tipo
// markdown para negrita/itálica/subrayado (**negrita**, *itálica*,
// __subrayado__), tipografía elegante (~~así~~) y glow (^^así^^), que los
// bloques renderizan formateada. No es un editor WYSIWYG — se explica en el
// placeholder de cada campo relevante.

// Sub-schema reutilizable para botones que necesitan una acción real
// (WhatsApp con número y mensaje prellenado, agenda de Cal.com/Calendly,
// bajar a una sección, o ir a otra URL). Se agrega a continuación del campo
// de texto del botón en cada bloque que tiene un CTA.
function ctaActionFields(prefix = '') {
  const key = (k) => (prefix ? `${prefix}${k[0].toUpperCase()}${k.slice(1)}` : k)
  return [
    {
      key: key('ctaAction'),
      label: 'Acción del botón',
      type: 'select',
      options: [
        { value: 'none', label: 'Sin definir (solo wireframe)' },
        { value: 'whatsapp', label: 'Abrir WhatsApp' },
        { value: 'cal', label: 'Agendar (Cal.com / Calendly)' },
        { value: 'scroll', label: 'Bajar a otra sección de la página' },
        { value: 'url', label: 'Ir a otra URL' },
      ],
      default: 'none',
    },
    {
      key: key('whatsappPhone'),
      label: 'Número de WhatsApp',
      type: 'text',
      default: '',
      placeholder: 'Ej: +591 700 00000',
      showIf: (p) => p[key('ctaAction')] === 'whatsapp',
    },
    {
      key: key('whatsappMessage'),
      label: 'Mensaje prellenado',
      type: 'textarea',
      default: '',
      placeholder: 'Hola, vi tu landing y quiero cotizar una sesión',
      showIf: (p) => p[key('ctaAction')] === 'whatsapp',
    },
    {
      key: key('calLink'),
      label: 'Link de Cal.com / Calendly',
      type: 'text',
      default: '',
      placeholder: 'https://cal.com/tu-usuario/llamada',
      showIf: (p) => p[key('ctaAction')] === 'cal',
    },
    {
      key: key('calMode'),
      label: 'Cómo abrir el calendario',
      type: 'select',
      options: [
        { value: 'popup', label: 'Pop-up al hacer clic' },
        { value: 'embed', label: 'Embebido en la página' },
      ],
      default: 'popup',
      showIf: (p) => p[key('ctaAction')] === 'cal',
    },
    {
      key: key('scrollTarget'),
      label: 'Sección a la que baja',
      type: 'text',
      default: '',
      placeholder: 'Ej: precios, testimonios, contacto',
      showIf: (p) => p[key('ctaAction')] === 'scroll',
    },
    {
      key: key('urlTarget'),
      label: 'URL de destino',
      type: 'text',
      default: '',
      placeholder: 'https://... o /gracias',
      showIf: (p) => p[key('ctaAction')] === 'url',
    },
    {
      key: key('urlNewTab'),
      label: 'Abrir en pestaña nueva',
      type: 'toggle',
      default: false,
      showIf: (p) => p[key('ctaAction')] === 'url',
    },
  ]
}

const ALIGN_FIELD = (key = 'align', label = 'Alineación del botón') => ({
  key,
  label,
  type: 'select',
  options: [
    { value: 'left', label: 'Izquierda' },
    { value: 'center', label: 'Centro' },
    { value: 'right', label: 'Derecha' },
  ],
  default: 'left',
})

export const BLOCK_SCHEMA = {
  header: {
    label: 'Header',
    variants: null,
    fields: [
      { key: 'logo', label: 'Logo / nombre', type: 'text', default: '[Nombre del estudio]' },
      { key: 'links', label: 'Links del menú', type: 'text', default: 'Inicio, Portafolio, Precios, Contacto', placeholder: 'Separados por coma' },
      {
        key: 'behavior',
        label: 'Comportamiento al hacer scroll',
        type: 'select',
        options: [
          { value: 'sticky', label: 'Fijo (sticky)' },
          { value: 'static', label: 'Se mueve con la página' },
        ],
        default: 'sticky',
      },
      { key: 'ctaText', label: 'Texto del botón', type: 'text', default: 'Contactar' },
      ...ctaActionFields(),
    ],
  },

  hero: {
    label: 'Hero',
    variants: ['texto-izquierda', 'texto-derecha'],
    variantLabels: { 'texto-izquierda': 'Texto izquierda', 'texto-derecha': 'Texto derecha' },
    defaultVariant: 'texto-izquierda',
    fields: [
      { key: 'title', label: 'Título', type: 'text', default: '[Título principal de tu landing]' },
      { key: 'subtitle', label: 'Subtítulo', type: 'textarea', default: '[Subtítulo que resuelve la primera objeción]', placeholder: 'Admite **negrita**, *itálica*, __subrayado__, ~~elegante~~, ^^glow^^' },
      { key: 'bgType', label: 'Tipo de fondo', type: 'select', options: [
        { value: 'image', label: 'Imagen' },
        { value: 'video', label: 'Video' },
        { value: 'solid', label: 'Color sólido' },
        { value: 'gradient', label: 'Degradado' },
      ], default: 'image' },
      { key: 'bgDarken', label: 'Oscurecido de fondo (%)', type: 'number', min: 0, max: 100, default: 30 },
      {
        key: 'mobileImagePosition',
        label: 'Imagen en móvil',
        type: 'select',
        options: [
          { value: 'top', label: 'Arriba del texto' },
          { value: 'bottom', label: 'Debajo del texto' },
        ],
        default: 'bottom',
      },
      { key: 'ctaText', label: 'Texto del CTA', type: 'text', default: 'Quiero mi sesión' },
      ALIGN_FIELD('ctaAlign', 'Alineación del CTA'),
      ...ctaActionFields(),
    ],
  },

  problem: {
    label: 'Problema',
    variants: null,
    fields: [
      { key: 'title', label: 'Título', type: 'text', default: '[El problema que resuelves]' },
      { key: 'body', label: 'Párrafo', type: 'textarea', default: '[Describe el dolor concreto del cliente antes de contratarte]' },
    ],
  },

  process: {
    label: 'Proceso',
    variants: null,
    fields: [
      { key: 'title', label: 'Título', type: 'text', default: '[Cómo trabajamos]' },
      { key: 'stepCount', label: 'Número de pasos', type: 'number', min: 2, max: 5, default: 3 },
      { key: 'steps', label: 'Pasos', type: 'repeatable', countField: 'stepCount', default: '[Descripción de este paso]' },
    ],
  },

  promise: {
    label: 'Promesa',
    variants: null,
    fields: [
      { key: 'title', label: 'Título', type: 'text', default: '[Lo que vas a lograr]' },
      { key: 'transformation', label: 'Frase de transformación', type: 'text', default: '[De X a Y en Z tiempo]' },
      { key: 'body', label: 'Párrafo', type: 'textarea', default: '[Desarrolla la transformación prometida]' },
    ],
  },

  portfolio: {
    label: 'Portafolio',
    variants: ['grid', 'carrusel'],
    variantLabels: { grid: 'Grid', carrusel: 'Carrusel' },
    defaultVariant: 'grid',
    fields: [
      { key: 'title', label: 'Título', type: 'text', default: '[Trabajos recientes]' },
      { key: 'pieceCount', label: 'Número de piezas', type: 'number', min: 3, max: 12, default: 6 },
    ],
  },

  vsl: {
    label: 'VSL',
    variants: null,
    fields: [
      { key: 'impact', label: 'Impacto (0-10s)', type: 'textarea', default: '[Gancho inicial que detiene el scroll]' },
      { key: 'diagnosis', label: 'Diagnóstico (10-40s)', type: 'textarea', default: '[Nombra el problema del espectador]' },
      { key: 'promise', label: 'Promesa (40-70s)', type: 'textarea', default: '[Qué logra si actúa ahora]' },
      { key: 'ctaText', label: 'Texto del CTA de cierre', type: 'text', default: 'Quiero agendar mi llamada' },
      ...ctaActionFields(),
    ],
  },

  videoBanda: {
    label: 'Video destacado',
    variants: null,
    fields: [
      { key: 'clip', label: 'Video (URL o descripción)', type: 'text', default: '[URL del clip o descripción de qué se muestra]' },
      { key: 'caption', label: 'Texto de pie (opcional)', type: 'text', default: '' },
    ],
  },

  testimonials: {
    label: 'Testimonios',
    variants: ['grid-estatico', 'carrusel-flechas', 'embed-widget'],
    variantLabels: {
      'grid-estatico': 'Grid estático',
      'carrusel-flechas': 'Carrusel con flechas y swipe',
      'embed-widget': 'Widget embebido (reseñas externas)',
    },
    defaultVariant: 'grid-estatico',
    fields: [
      { key: 'title', label: 'Título', type: 'text', default: '[Lo que dicen mis clientes]' },
      { key: 'count', label: 'Cantidad de testimonios', type: 'number', min: 1, max: 12, default: 3 },
      { key: 'showPhoto', label: 'Mostrar foto', type: 'toggle', default: true },
      {
        key: 'embedCode',
        label: 'Código/ID del widget externo',
        type: 'text',
        default: '',
        placeholder: 'Ej: ID de Google Reviews, Elfsight o Trustindex',
      },
    ],
  },

  pricing: {
    label: 'Precios',
    variants: ['rango-precio', 'tarjetas-precio-exacto', 'tabla-comparativa'],
    variantLabels: {
      'rango-precio': 'Rango de precio',
      'tarjetas-precio-exacto': 'Tarjetas con precio exacto',
      'tabla-comparativa': 'Tabla comparativa',
    },
    defaultVariant: 'rango-precio',
    fields: [
      { key: 'title', label: 'Título', type: 'text', default: '[Planes y precios]' },
      { key: 'planCount', label: 'Cantidad de planes', type: 'number', min: 1, max: 4, default: 3 },
      {
        key: 'tiers',
        label: 'Planes (nombre, precio, moneda)',
        type: 'repeatable',
        countField: 'planCount',
        default: '[Plan] | [$X] | USD',
        placeholder: 'Nombre | Precio | Moneda (ISO, ej. USD)',
      },
      { key: 'highlightedPlan', label: 'Plan destacado', type: 'toggle', default: false },
      { key: 'featureCount', label: 'Características (tabla comparativa)', type: 'number', min: 3, max: 8, default: 5 },
      {
        key: 'features',
        label: 'Características (tabla comparativa)',
        type: 'repeatable',
        countField: 'featureCount',
        default: '[Característica incluida]',
      },
      ...ctaActionFields('plan'),
    ],
  },

  faq: {
    label: 'FAQ',
    variants: ['acordeon-ancho', 'columna-fija'],
    variantLabels: { 'acordeon-ancho': 'Acordeón a ancho completo', 'columna-fija': 'Columna fija + acordeón' },
    defaultVariant: 'acordeon-ancho',
    fields: [
      { key: 'title', label: 'Título', type: 'text', default: '[Preguntas frecuentes]' },
      { key: 'questionCount', label: 'Cantidad de preguntas', type: 'number', min: 2, max: 10, default: 5 },
      { key: 'openByDefault', label: 'Acordeón abierto por defecto', type: 'toggle', default: false },
      { key: 'intro', label: 'Intro (columna fija)', type: 'textarea', default: '[Texto corto de apoyo, visible solo en la variante columna fija]' },
      { key: 'ctaText', label: 'Texto del botón (columna fija)', type: 'text', default: 'Escribime' },
      ...ctaActionFields(),
    ],
  },

  about: {
    label: 'Sobre mí',
    variants: null,
    fields: [
      { key: 'title', label: 'Título', type: 'text', default: '[Quién soy]' },
      { key: 'bio', label: 'Bio', type: 'textarea', default: '[Tu historia, experiencia y por qué trabajas en esto]' },
      { key: 'photoAsBackground', label: 'Usar la foto como fondo de la sección', type: 'toggle', default: false },
    ],
  },

  exclusividad: {
    label: 'Exclusividad',
    variants: null,
    fields: [
      { key: 'title', label: 'Título', type: 'text', default: '[Por qué este servicio es distinto]' },
      { key: 'body', label: 'Texto', type: 'textarea', default: '[Explicá qué te hace distinto — remarcá el beneficio clave con ~~así~~ o ^^así^^]' },
      { key: 'ctaText', label: 'Texto del CTA', type: 'text', default: 'Quiero saber más' },
      ...ctaActionFields(),
    ],
  },

  guarantee: {
    label: 'Garantía (simple)',
    variants: null,
    fields: [
      { key: 'title', label: 'Título', type: 'text', default: '[Tu garantía o sello de confianza]' },
      { key: 'body', label: 'Descripción', type: 'textarea', default: '[Explicá qué garantizás y por qué el cliente no arriesga nada]' },
    ],
  },

  pullQuote: {
    label: 'Cita destacada',
    variants: null,
    fields: [
      { key: 'quote', label: 'Frase', type: 'textarea', default: '[Una sola frase textual de un cliente, corta y contundente]' },
      { key: 'author', label: 'Nombre', type: 'text', default: '[Nombre del cliente]' },
      { key: 'role', label: 'Rol / contexto (opcional)', type: 'text', default: '' },
    ],
  },

  embed: {
    label: 'Embed genérico',
    variants: null,
    fields: [
      { key: 'title', label: 'Título (opcional)', type: 'text', default: '' },
      {
        key: 'embedCode',
        label: 'Código o URL a embeber',
        type: 'text',
        default: '',
        placeholder: 'Ej: snippet de Cal.com, feed de Instagram, mapa, widget de reseñas',
      },
      { key: 'heightHint', label: 'Alto aproximado (px)', type: 'number', min: 150, max: 800, default: 350 },
    ],
  },

  garantias: {
    label: 'Garantías (tarjetas)',
    variants: null,
    fields: [
      { key: 'title', label: 'Título', type: 'text', default: '[Por qué podés confiar]' },
      { key: 'cardCount', label: 'Cantidad de tarjetas', type: 'number', min: 2, max: 4, default: 3 },
      {
        key: 'cards',
        label: 'Tarjetas',
        type: 'repeatable',
        countField: 'cardCount',
        default: '✓ | [Título de la garantía] | [Explicación breve]',
        placeholder: 'Ícono | Título | Texto',
      },
    ],
  },

  addons: {
    label: 'Extras / Add-ons',
    variants: null,
    fields: [
      { key: 'title', label: 'Título', type: 'text', default: '[Sumá esto a tu paquete]' },
      { key: 'extraCount', label: 'Cantidad de extras', type: 'number', min: 1, max: 6, default: 3 },
      {
        key: 'extras',
        label: 'Extras',
        type: 'repeatable',
        countField: 'extraCount',
        default: '[Nombre del extra] | [Qué incluye] | Agregar | evento_extra',
        placeholder: 'Título | Texto | Texto del botón | evento de tracking (opcional, snake_case)',
      },
    ],
  },

  proximosPasos: {
    label: 'Próximos pasos',
    variants: null,
    fields: [
      { key: 'title', label: 'Título', type: 'text', default: '[Qué pasa después de que me escribís]' },
      { key: 'stepCount', label: 'Cantidad de pasos', type: 'number', min: 2, max: 4, default: 3 },
      { key: 'steps', label: 'Pasos', type: 'repeatable', countField: 'stepCount', default: '[Descripción de este paso]' },
      { key: 'ctaText', label: 'Texto del CTA final', type: 'text', default: 'Empezar ahora' },
      ...ctaActionFields(),
    ],
  },

  finalCta: {
    label: 'CTA final',
    variants: null,
    fields: [
      { key: 'title', label: 'Título', type: 'text', default: '[Última llamada a la acción]' },
      { key: 'buttonText', label: 'Texto del botón', type: 'text', default: 'Quiero mi sesión' },
      ALIGN_FIELD('align', 'Alineación del contenido'),
      ...ctaActionFields(),
    ],
  },

  formasPago: {
    label: 'Formas de pago',
    variants: null,
    fields: [
      { key: 'title', label: 'Título', type: 'text', default: '[Cómo podés pagar]' },
      { key: 'modeCount', label: 'Cantidad de modalidades', type: 'number', min: 2, max: 3, default: 2 },
      {
        key: 'modes',
        label: 'Modalidades',
        type: 'repeatable',
        countField: 'modeCount',
        default: '[Modalidad de pago] | [Detalle destacado]',
        placeholder: 'Modalidad | Detalle destacado',
      },
    ],
  },

  leadMagnet: {
    label: 'Newsletter / Lead magnet',
    variants: null,
    fields: [
      { key: 'title', label: 'Título', type: 'text', default: '[Descargá la guía gratuita]' },
      { key: 'body', label: 'Descripción', type: 'textarea', default: '[Qué recibe la persona al dejar su email]' },
      { key: 'inputPlaceholder', label: 'Placeholder del campo de email', type: 'text', default: 'Tu email' },
      { key: 'buttonText', label: 'Texto del botón', type: 'text', default: 'Quiero la guía' },
    ],
  },

  trustBar: {
    label: 'Confían en mí',
    variants: null,
    fields: [
      { key: 'caption', label: 'Texto pequeño', type: 'text', default: '[Como se vio en / trabajé con]' },
      { key: 'logoCount', label: 'Cantidad de logos', type: 'number', min: 2, max: 8, default: 5 },
    ],
  },

  stats: {
    label: 'Estadísticas',
    variants: null,
    fields: [
      { key: 'title', label: 'Título (opcional)', type: 'text', default: '' },
      { key: 'statCount', label: 'Cantidad de números', type: 'number', min: 2, max: 5, default: 3 },
      {
        key: 'stats',
        label: 'Números',
        type: 'repeatable',
        countField: 'statCount',
        default: '[500+ | sesiones entregadas]',
        placeholder: 'Formato: número | descripción',
      },
    ],
  },

  footer: {
    label: 'Footer',
    variants: null,
    fields: [
      { key: 'logo', label: 'Logo', type: 'text', default: '[Nombre del estudio]' },
      { key: 'socials', label: 'Redes', type: 'text', default: '[Instagram, WhatsApp, etc.]' },
      { key: 'links', label: 'Links', type: 'text', default: '[Privacidad, contacto]' },
    ],
  },
}

export const BLOCK_TYPES = Object.keys(BLOCK_SCHEMA)

// Agrupa los bloques por función para la paleta (secciones colapsables) —
// mismo orden en que un fotógrafo pensaría su landing de arriba a abajo.
export const BLOCK_GROUPS = [
  { id: 'estructura', label: 'Estructura', types: ['header', 'footer'] },
  { id: 'apertura', label: 'Apertura', types: ['hero', 'vsl', 'videoBanda'] },
  { id: 'argumento', label: 'Argumento de venta', types: ['problem', 'process', 'promise', 'exclusividad'] },
  { id: 'prueba-social', label: 'Prueba social', types: ['portfolio', 'testimonials', 'trustBar', 'stats', 'pullQuote', 'about'] },
  { id: 'confianza', label: 'Confianza', types: ['guarantee', 'garantias'] },
  { id: 'precios', label: 'Precios y oferta', types: ['pricing', 'addons', 'formasPago'] },
  { id: 'conversion', label: 'Conversión', types: ['finalCta', 'proximosPasos', 'leadMagnet', 'faq'] },
  { id: 'otros', label: 'Otros', types: ['embed'] },
]

// Tipos de bloque que tienen al menos un botón con acción real (WhatsApp,
// Cal.com, scroll o URL), usados por el formulario de configuración de
// tracking al exportar para saber qué botones ofrecer.
export const CTA_ACTION_PREFIXES = {
  header: [''],
  hero: [''],
  vsl: [''],
  finalCta: [''],
  pricing: ['plan'],
  faq: [''],
  exclusividad: [''],
  proximosPasos: [''],
}

export function buildDefaultProps(type) {
  const schema = BLOCK_SCHEMA[type]
  if (!schema) throw new Error(`Tipo de bloque desconocido: ${type}`)
  const props = {}
  for (const field of schema.fields) {
    if (field.type === 'repeatable') {
      const count = props[field.countField] ?? field.default
      props[field.key] = Array.from({ length: count }, () => field.default)
    } else {
      props[field.key] = field.default
    }
  }
  return props
}

export function makeBlock(type, overrides = {}) {
  const schema = BLOCK_SCHEMA[type]
  if (!schema) throw new Error(`Tipo de bloque desconocido: ${type}`)
  return {
    type,
    variant: schema.defaultVariant ?? null,
    props: buildDefaultProps(type),
    accentOverride: null,
    radiusOverride: null,
    animationOverride: null,
    ...overrides,
  }
}

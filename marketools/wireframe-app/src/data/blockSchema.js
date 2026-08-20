// Catálogo declarativo de los 12 tipos de bloque. El panel de propiedades y
// los valores por defecto se derivan de este objeto en vez de tener un
// formulario hardcodeado por tipo de bloque.
//
// Tipos de campo soportados por PropertiesPanel/fields:
//   text, textarea, select, number, toggle, repeatable
// `repeatable` usa `countField` para saber cuántos items debe tener el
// array (se ajusta solo cuando ese número cambia, sin perder lo escrito).
// `showIf(props)` es opcional: si devuelve false, el campo no se renderiza
// en el panel (se usa para las sub-opciones de la acción del botón).
//
// Texto con énfasis: los campos de texto aceptan una sintaxis liviana tipo
// markdown para negrita/itálica/subrayado (**negrita**, *itálica*,
// __subrayado__), que los bloques renderizan formateada. No es un editor
// WYSIWYG — se explica en el placeholder de cada campo relevante.

// Sub-schema reutilizable para botones que necesitan una acción real
// (WhatsApp con número y mensaje prellenado, o agenda de Cal.com/Calendly
// con link y modo de apertura). Se agrega a continuación del campo de texto
// del botón en cada bloque que tiene un CTA.
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

  testimonials: {
    label: 'Testimonios',
    variants: ['grid-estatico', 'carrusel-flechas'],
    variantLabels: { 'grid-estatico': 'Grid estático', 'carrusel-flechas': 'Carrusel con flechas y swipe' },
    defaultVariant: 'grid-estatico',
    fields: [
      { key: 'title', label: 'Título', type: 'text', default: '[Lo que dicen mis clientes]' },
      { key: 'count', label: 'Cantidad de testimonios', type: 'number', min: 1, max: 12, default: 3 },
      { key: 'showPhoto', label: 'Mostrar foto', type: 'toggle', default: true },
    ],
  },

  pricing: {
    label: 'Precios',
    variants: ['rango-precio', 'tarjetas-precio-exacto'],
    variantLabels: { 'rango-precio': 'Rango de precio', 'tarjetas-precio-exacto': 'Tarjetas con precio exacto' },
    defaultVariant: 'rango-precio',
    fields: [
      { key: 'title', label: 'Título', type: 'text', default: '[Planes y precios]' },
      { key: 'planCount', label: 'Cantidad de planes', type: 'number', min: 1, max: 4, default: 3 },
      { key: 'highlightedPlan', label: 'Plan destacado', type: 'toggle', default: false },
      ...ctaActionFields('plan'),
    ],
  },

  faq: {
    label: 'FAQ',
    variants: null,
    fields: [
      { key: 'title', label: 'Título', type: 'text', default: '[Preguntas frecuentes]' },
      { key: 'questionCount', label: 'Cantidad de preguntas', type: 'number', min: 2, max: 10, default: 5 },
      { key: 'openByDefault', label: 'Acordeón abierto por defecto', type: 'toggle', default: false },
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

  footer: {
    label: 'Footer',
    variants: null,
    fields: [
      { key: 'logo', label: 'Logo', type: 'text', default: '[Nombre del estudio]' },
      { key: 'socials', label: 'Redes', type: 'text', default: '[Instagram, WhatsApp, etc.]' },
      { key: 'links', label: 'Links', type: 'text', default: '[Privacidad, contacto]' },
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

  guarantee: {
    label: 'Garantía',
    variants: null,
    fields: [
      { key: 'title', label: 'Título', type: 'text', default: '[Tu garantía o sello de confianza]' },
      { key: 'body', label: 'Descripción', type: 'textarea', default: '[Explicá qué garantizás y por qué el cliente no arriesga nada]' },
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
}

export const BLOCK_TYPES = Object.keys(BLOCK_SCHEMA)

// Tipos de bloque que tienen al menos un botón con acción real (WhatsApp o
// Cal.com), usados por el formulario de configuración de tracking al
// exportar para saber qué botones ofrecer.
export const CTA_ACTION_PREFIXES = {
  header: [''],
  hero: [''],
  vsl: [''],
  finalCta: [''],
  pricing: ['plan'],
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

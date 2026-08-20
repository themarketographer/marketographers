// Instrucciones de SEO por tipo de bloque: nivel de encabezado y qué texto
// va en el alt de las imágenes (brief, punto 3 del prompt maestro). Solo el
// Hero lleva h1; el resto de títulos de sección van en h2.

const HEADING_LEVEL = { hero: 'h1', footer: null, header: null, trustBar: null, stats: null, videoBanda: null }

export function getHeadingLevel(type) {
  return HEADING_LEVEL[type] ?? 'h2'
}

const ALT_TEXT = {
  hero: 'Describe la foto/video de fondo con el servicio y el estilo del fotógrafo, ej. "[sesión de bodas en exteriores, estilo documental]".',
  portfolio: 'Cada pieza del portafolio lleva su propio alt describiendo la sesión concreta, ej. "[retrato de producto para marca de café, luz natural]" — nunca "imagen 1", "imagen 2".',
  about: 'Alt de la foto de perfil: "[nombre del fotógrafo] fotografiando en [ciudad/estudio]".',
  testimonials: 'Si se muestra foto del cliente, alt: "[nombre del cliente], cliente de [tipo de sesión]".',
  trustBar: 'Cada logo lleva alt con el nombre real de la marca/medio, ej. "Logo de [nombre]" — nunca "logo 1", "logo 2".',
  videoBanda: 'El video lleva un `<track>` de subtítulos si es posible, o al menos un texto alternativo describiendo qué se ve, para accesibilidad y para que Google entienda el contenido.',
  embed: 'Si el embed es un iframe, agregar `title` descriptivo (ej. "Reseñas de Google", "Calendario de reservas") para lectores de pantalla — un iframe sin title es invisible para accesibilidad.',
}

export function getAltNote(type) {
  return ALT_TEXT[type] ?? null
}

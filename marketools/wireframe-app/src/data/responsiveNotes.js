// Diferencias celular (375px) vs escritorio (1440px) por tipo de bloque, para el punto 4 del prompt
// maestro (brief, sección 8.2). Es texto fijo por tipo, NO se deriva del
// toggle visual de preview — ver nota en Preview/ResponsiveToggle.jsx.

export const RESPONSIVE_NOTES = {
  header: 'Mobile: se oculta el menú de links y queda solo el logo + botón (o un ícono de menú hamburguesa si hay muchos links). Desktop: logo, links y botón en una sola fila.',
  hero: 'Mobile: el texto se apila sobre el fondo (no al costado), CTA a ancho completo. Desktop: texto y fondo lado a lado según la variante elegida.',
  problem: 'Mobile: título y párrafo a ancho completo, padding reducido. Desktop: párrafo centrado con ancho máximo de lectura (~640px).',
  process: 'Mobile: los pasos se apilan verticalmente. Desktop: los pasos se muestran en fila horizontal.',
  promise: 'Mobile: tipografía de la frase de transformación baja de tamaño para no partir línea. Desktop: tamaño completo, centrado.',
  portfolio: 'Mobile: grid pasa de 3 columnas a 1-2; carrusel muestra una pieza casi completa por vez. Desktop: grid completo o carrusel con varias piezas visibles.',
  vsl: 'Mobile: reproductor a ancho completo, controles simplificados. Desktop: reproductor centrado con ancho máximo.',
  testimonials: 'Mobile: grid pasa a 1 columna o el carrusel se desliza con el dedo (swipe). Desktop: grid en 3 columnas o carrusel con flechas visibles.',
  pricing: 'Mobile: tarjetas apiladas verticalmente, la destacada va primera. Desktop: tarjetas en fila, la destacada centrada y más alta.',
  faq: 'Mobile: acordeón a ancho completo. Desktop: acordeón centrado con ancho máximo (~640px).',
  about: 'Mobile: foto arriba, texto debajo. Desktop: foto y texto lado a lado.',
  finalCta: 'Mobile: botón a ancho completo. Desktop: botón de ancho fijo, centrado.',
  footer: 'Mobile: links apilados verticalmente. Desktop: links en fila.',
  trustBar: 'Mobile: logos en fila con scroll horizontal o grid de 2 columnas. Desktop: todos los logos en una sola fila.',
  stats: 'Mobile: números apilados en 1-2 columnas. Desktop: todos los números en una fila.',
  guarantee: 'Mobile: ícono/sello arriba, texto debajo, centrado. Desktop: ícono al costado del texto.',
  leadMagnet: 'Mobile: input y botón apilados, ambos a ancho completo. Desktop: input y botón en una misma fila.',
}

export function getResponsiveNote(type) {
  return RESPONSIVE_NOTES[type] ?? 'Sin diferencias específicas más allá del comportamiento responsive estándar del layout.'
}

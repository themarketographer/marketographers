// Animación sugerida por tipo de bloque, pensada para que las animaciones se
// sientan coherentes entre secciones en vez de efectos sueltos sin relación
// (brief, punto 2 del prompt maestro). Familia base: fade-up al entrar en
// viewport para todo lo que es texto/lectura, con variaciones puntuales para
// grids, carruseles y CTAs.

export const ANIMATION_SUGGESTIONS = {
  header: 'Sin animación de entrada. Si es sticky, un leve cambio de fondo/sombra cuando el scroll pasa los primeros ~40px, para separarlo visualmente del contenido.',
  hero: 'Entrada fade-up + leve escala del fondo (ken burns sutil si es imagen/video) al cargar la página; el CTA tiene un hover con escala 1.03 y sombra suave.',
  problem: 'Fade-up del título y el párrafo al entrar en viewport, sin stagger porque es un solo bloque de texto.',
  process: 'Stagger fade-up de cada paso, uno detrás del otro (100-150ms de diferencia), para que se lean en el orden en que ocurren.',
  promise: 'Fade-up de la frase de transformación con un leve delay respecto al título, para que se lea como una consecuencia.',
  portfolio: 'Grid: stagger fade-in + escala leve (0.96 -> 1) de cada pieza al entrar en viewport. Carrusel: transición slide con easing suave, sin fade entre slides.',
  vsl: 'Fade-in del reproductor de video al cargar, sin animación de scroll (el video es el foco); el CTA de cierre aparece con fade-up cuando el usuario se acerca al final.',
  testimonials: 'Grid estático: stagger fade-up de las tarjetas. Carrusel: transición slide con swipe físico en móvil y flechas con hover que las agranda levemente en escritorio.',
  pricing: 'Fade-up de las tarjetas con un leve "pop" (escala 0.97 -> 1) en la tarjeta destacada, para diferenciarla sin exagerar.',
  faq: 'Fade-up de cada pregunta al entrar en viewport; el acordeón se abre/cierra con una transición de altura suave (no un salto brusco).',
  about: 'Fade-up simple del bloque completo, sin efectos adicionales — es una sección de confianza, no de venta directa.',
  finalCta: 'Fade-up del título; el botón tiene un pulso sutil (escala 1 -> 1.02 -> 1, loop lento) para llamar la atención sin ser irritante.',
  footer: 'Sin animación de entrada — el footer no necesita llamar la atención.',
  trustBar: 'Fade-in simple de la fila completa de logos al entrar en viewport, sin stagger — se leen como un conjunto, no uno por uno.',
  stats: 'Stagger fade-up de cada número; si el desarrollador puede animar el conteo (de 0 al valor final) en ~1s, mejor — si no, el fade-up solo también funciona.',
  guarantee: 'Fade-up simple del bloque completo, con el ícono/sello apareciendo con un leve pop (escala 0.9 -> 1).',
  leadMagnet: 'Fade-up del bloque completo; el input y el botón tienen un foco/hover sutil, sin animación de scroll adicional.',
}

export function getAnimationSuggestion(type) {
  return ANIMATION_SUGGESTIONS[type] ?? 'Fade-up simple al entrar en viewport.'
}

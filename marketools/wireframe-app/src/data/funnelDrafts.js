// Bloques por defecto para cada embudo, en orden. Se combina con
// buildDefaultProps() para materializar bloques completos con id.
// Fuente: brief del proyecto, sección "Mapeo embudo -> borrador inicial".

export const FUNNEL_DRAFTS = {
  2: [
    { type: 'hero' },
    { type: 'problem' },
    { type: 'process' },
    { type: 'promise' },
    { type: 'portfolio' },
    { type: 'about' },
    { type: 'testimonials' },
    { type: 'pricing', variant: 'rango-precio' },
    { type: 'finalCta' },
    { type: 'footer' },
  ],
  3: [
    { type: 'hero' },
    { type: 'problem' },
    { type: 'process' },
    { type: 'promise' },
    { type: 'portfolio' },
    { type: 'about' },
    { type: 'testimonials' },
    { type: 'finalCta' },
    { type: 'footer' },
  ],
  4: [
    { type: 'hero' },
    { type: 'vsl' },
    { type: 'problem' },
    { type: 'promise' },
    { type: 'portfolio' },
    { type: 'testimonials' },
    { type: 'finalCta' },
    { type: 'footer' },
  ],
  5: [
    { type: 'hero' },
    { type: 'portfolio' },
    { type: 'pricing', variant: 'tarjetas-precio-exacto', overrideProps: { highlightedPlan: true } },
    { type: 'testimonials' },
    { type: 'finalCta' },
    { type: 'footer' },
  ],
}

// Borrador genérico para cuando el wizard no resuelve a un embudo 2-5 (ej.
// WhatsApp directo o formulario instantáneo, que en funnels.md no llevan
// landing). En vez de bloquear el acceso al canvas, se le ofrece al alumno
// una landing simple igual: sirve como página de presencia/portafolio aunque
// su embudo principal de venta sea otro.
export const SIMPLE_DRAFT = [
  { type: 'hero' },
  { type: 'problem' },
  { type: 'portfolio' },
  { type: 'testimonials' },
  { type: 'finalCta' },
  { type: 'footer' },
]

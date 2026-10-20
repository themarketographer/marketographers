// Superficie (fondo) de cada sección. Las dos landings de referencia alternan
// secciones claras, oscuras y de color de marca; esto le da al alumno el
// mismo recurso en cualquier estilo, sin elegir colores a mano por bloque.
//   page     → el fondo general del tema
//   contrast → color primario de fondo con su texto propio
//   accent   → color de acento de fondo; los botones pasan a primario
export const SURFACE_OPTIONS = [
  { value: 'page', label: 'Página' },
  { value: 'contrast', label: 'Contraste' },
  { value: 'accent', label: 'Acento' },
]

export const SURFACE_PROMPT = {
  contrast: 'fondo del color primario y texto en el color "texto sobre el primario"',
  accent: 'fondo del color de acento, texto en el color de texto sobre el acento y botones en el color primario',
}

// Variables CSS que se pisan dentro del bloque. Los bloques "invertidos"
// (CTA final, newsletter) pintan su propio panel con --color-primary: dentro
// de una superficie ese panel pasa a ser un tono apenas distinto del fondo de
// la sección, así se ve como una sola sección y no como una caja encima.
export function surfaceVars(surface, type) {
  if (surface === 'contrast') {
    return {
      background: 'var(--root-primary)',
      '--color-text': 'var(--root-on-primary)',
      '--color-primary': 'color-mix(in srgb, var(--color-on-primary) 9%, var(--root-primary))',
      ...(type === 'header' ? {} : { '--color-bg': 'var(--root-primary)' }),
    }
  }
  if (surface === 'accent') {
    return {
      background: 'var(--root-accent)',
      '--color-text': 'var(--root-accent-ink)',
      '--color-on-primary': 'var(--root-accent-ink)',
      '--color-primary': 'color-mix(in srgb, var(--root-accent-ink) 10%, var(--root-accent))',
      '--color-accent': 'var(--root-primary)',
      '--color-accent-ink': 'var(--root-on-primary)',
      ...(type === 'header' ? {} : { '--color-bg': 'var(--root-accent)' }),
    }
  }
  return {}
}

// Sin persistencia entre sesiones en v1 (fuera de alcance, ver brief punto 10).
// Punto de extensión futuro: hidratar este objeto desde sessionStorage acá,
// si se decide agregar guardado dentro de la misma sesión más adelante.

export const initialState = {
  wizard: {
    step: 0,
    answers: { q1: null, q2: null, q3: null, q4: null },
    funnelId: null,
    completed: false,
  },
  canvas: {
    blocks: [],
  },
  theme: {
    presetId: null,
    headingFont: "'Inter', system-ui, sans-serif",
    bodyFont: "'Inter', system-ui, sans-serif",
    primaryColor: '#111111',
    primaryTextColor: '#ffffff',
    styleId: null,
    backgroundColor: '#ffffff',
    textColor: '#1a1a1a',
    accentColor: '#2f6fed',
    accentTextColor: '#ffffff',
    radius: 'soft',
    fontScale: 1,
  },
  preview: {
    mode: 'desktop',
  },
  dnd: {
    draggingBlockId: null,
    draggingPaletteType: null,
    hoverIndex: null,
  },
  flashBlockId: null, // último bloque agregado: se anima su entrada y se lleva a la vista
  replayNonce: 0, // cambia cada vez que se pide "Ver animaciones" del canvas
  animationPreview: null, // { blockId, type } | null — ver AnimationPanel/CanvasBlock
}

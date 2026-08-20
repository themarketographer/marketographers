// Sin persistencia entre sesiones en v1 (fuera de alcance, ver brief punto 10).
// Punto de extensión futuro: hidratar este objeto desde sessionStorage acá,
// si se decide agregar guardado dentro de la misma sesión más adelante.

export const initialState = {
  wizard: {
    step: 0,
    answers: { q1: null, q2: null, q3: null },
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
  animationPreview: null, // { blockId, type } | null — ver AnimationPanel/CanvasBlock
}

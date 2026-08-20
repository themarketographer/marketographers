// Presets de estilo. Cada uno llena los 6 valores del tema global + el radio
// de bordes + el estilo de palabra clave con un clic; el alumno puede seguir
// editando cualquier valor individualmente después sin romper nada (ver
// THEME_SET_FIELD en el reducer).

export const THEME_PRESETS = [
  {
    id: 'editorial',
    label: 'Editorial',
    headingFont: "'Playfair Display', Georgia, serif",
    bodyFont: "'Inter', system-ui, sans-serif",
    primaryColor: '#111111',
    backgroundColor: '#f7f5f0',
    textColor: '#161311',
    accentColor: '#b5502f',
    accentTextColor: '#ffffff',
    radius: 'soft',
  },
  {
    id: 'contraste',
    label: 'Contraste',
    headingFont: "'Archivo Black', 'Helvetica Neue', sans-serif",
    bodyFont: "'Inter', system-ui, sans-serif",
    primaryColor: '#ffffff',
    backgroundColor: '#1c2b4a',
    textColor: '#ffffff',
    accentColor: '#ff5a36',
    accentTextColor: '#ffffff',
    radius: 'sharp',
  },
  {
    id: 'minimalista',
    label: 'Minimalista',
    headingFont: "'Inter', system-ui, sans-serif",
    bodyFont: "'Inter', system-ui, sans-serif",
    primaryColor: '#3a3a3a',
    backgroundColor: '#ffffff',
    textColor: '#3a3a3a',
    accentColor: '#2f6fed',
    accentTextColor: '#ffffff',
    radius: 'soft',
  },
  {
    id: 'tecnologico',
    label: 'Tecnológico',
    headingFont: "'Space Grotesk', system-ui, sans-serif",
    bodyFont: "'Space Grotesk', 'JetBrains Mono', system-ui, sans-serif",
    primaryColor: '#ffffff',
    backgroundColor: '#0e0f12',
    textColor: '#f4f4f4',
    accentColor: '#39ff88',
    accentTextColor: '#0e0f12',
    radius: 'pill',
  },
  {
    id: 'calido',
    label: 'Cálido',
    headingFont: "'Poppins', system-ui, sans-serif",
    bodyFont: "'Inter', system-ui, sans-serif",
    primaryColor: '#141414',
    backgroundColor: '#faf9f6',
    textColor: '#141414',
    accentColor: '#f5b729',
    accentTextColor: '#141414',
    radius: 'pill',
  },
  {
    id: 'clasico',
    label: 'Clásico',
    headingFont: "Georgia, 'Times New Roman', serif",
    bodyFont: "'Inter', system-ui, sans-serif",
    primaryColor: '#1f2937',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    accentColor: '#7a5230',
    accentTextColor: '#ffffff',
    radius: 'sharp',
  },
]

export function getPresetById(id) {
  return THEME_PRESETS.find((p) => p.id === id) ?? null
}

export const RADIUS_VALUES = { sharp: '4px', soft: '14px', pill: '999px' }

export const RADIUS_OPTIONS = [
  { value: 'sharp', label: 'Recto' },
  { value: 'soft', label: 'Redondeado' },
  { value: 'pill', label: 'Muy redondeado' },
]

export const FONT_SCALE_OPTIONS = [
  { value: 0.875, label: 'Chico' },
  { value: 1, label: 'Normal' },
  { value: 1.15, label: 'Grande' },
  { value: 1.3, label: 'Muy grande' },
]

export const ACCENT_TEXT_OPTIONS = [
  { value: '#ffffff', label: 'Claro' },
  { value: '#141414', label: 'Oscuro' },
]

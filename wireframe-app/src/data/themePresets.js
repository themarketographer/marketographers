import { STYLE_REFS } from './styleReferences'

// Presets de estilo. Cada uno llena los 6 valores del tema global + el radio
// de bordes + el estilo de palabra clave con un clic; el alumno puede seguir
// editando cualquier valor individualmente después sin romper nada (ver
// THEME_SET_FIELD en el reducer).

// Los dos primeros son los estilos de referencia (las landings reales de
// Pablo): además de colores y tipografías marcan `styleId`, que activa los
// detalles visuales de ese sitio dentro del canvas y la sección de
// referencia del prompt exportado. El resto de presets limpia `styleId`.
export const THEME_PRESETS = [
  ...Object.values(STYLE_REFS).map((ref) => ({ id: ref.id, label: ref.label, styleId: ref.id, ...ref.theme })),
  {
    id: 'editorial',
    label: 'Editorial',
    headingFont: "'Playfair Display', Georgia, serif",
    bodyFont: "'Inter', system-ui, sans-serif",
    primaryColor: '#111111',
    primaryTextColor: '#f7f5f0',
    styleId: null,
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
    primaryTextColor: '#1c2b4a',
    styleId: null,
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
    primaryTextColor: '#ffffff',
    styleId: null,
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
    primaryTextColor: '#0e0f12',
    styleId: null,
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
    primaryTextColor: '#faf9f6',
    styleId: null,
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
    primaryTextColor: '#ffffff',
    styleId: null,
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

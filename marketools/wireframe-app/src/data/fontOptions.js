// Lista curada de tipografías para el selector del tema (brief: "selector de
// tipografías para no tener que escribirlas"). El `value` es el stack CSS
// completo con fallback, listo para usar directo como font-family.

export const FONT_OPTIONS = [
  { value: "'Inter', system-ui, sans-serif", label: 'Inter (sans neutra)' },
  { value: "'Poppins', system-ui, sans-serif", label: 'Poppins (sans geométrica)' },
  { value: "'Archivo Black', 'Helvetica Neue', sans-serif", label: 'Archivo Black (sans peso fuerte)' },
  { value: "'Space Grotesk', system-ui, sans-serif", label: 'Space Grotesk (sans técnica)' },
  { value: "'Playfair Display', Georgia, serif", label: 'Playfair Display (serif con carácter)' },
  { value: "Georgia, 'Times New Roman', serif", label: 'Georgia (serif clásica)' },
  { value: "'JetBrains Mono', ui-monospace, monospace", label: 'JetBrains Mono (monoespaciada)' },
]

export function getFontLabel(value) {
  return FONT_OPTIONS.find((f) => f.value === value)?.label ?? value
}

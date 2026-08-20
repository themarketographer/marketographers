// Animaciones que el alumno puede elegir a mano por bloque desde la pestaña
// "Animación", en vez de depender siempre de la sugerencia automática de
// animationSuggestions.js. `null`/'auto' usa la sugerencia automática.

export const ANIMATION_OPTIONS = [
  { value: 'auto', label: 'Automática (sugerida)' },
  { value: 'fade-up', label: 'Aparece desde abajo' },
  { value: 'fade-in', label: 'Aparece (fade)' },
  { value: 'zoom-in', label: 'Zoom de entrada' },
  { value: 'slide-left', label: 'Desliza desde la derecha' },
  { value: 'slide-right', label: 'Desliza desde la izquierda' },
  { value: 'none', label: 'Sin animación' },
]

const DESCRIPTIONS = {
  'fade-up': 'El bloque aparece desplazándose ~24px desde abajo mientras aparece (fade-up), al entrar en el viewport.',
  'fade-in': 'El bloque aparece con un fundido simple (opacity 0 a 1), sin desplazamiento, al entrar en el viewport.',
  'zoom-in': 'El bloque aparece con un leve zoom de entrada (escala 0.94 a 1) al entrar en el viewport.',
  'slide-left': 'El bloque entra deslizándose desde la derecha hacia su posición final, al entrar en el viewport.',
  'slide-right': 'El bloque entra deslizándose desde la izquierda hacia su posición final, al entrar en el viewport.',
  none: 'Sin animación de entrada — aparece directo.',
}

export function getAnimationOverrideDescription(value) {
  return DESCRIPTIONS[value] ?? null
}

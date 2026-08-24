import { BLOCK_TYPES } from '../data/blockSchema'

// Guardado de progreso 100% local: todo vive en el localStorage del
// navegador del alumno, en su propia computadora — nunca sale de ahí, no
// hay servidor ni cuenta de por medio. Por eso mismo el progreso no viaja
// entre dispositivos ni sobrevive a "borrar datos de navegación".
const STORAGE_KEY = 'marketools-wireframe-progress-v1'
const VERSION = 1

// Solo persistimos lo que el alumno realmente construyó (wizard, canvas,
// tema). `preview`, `dnd` y `animationPreview` son estado transitorio de la
// UI que no tiene sentido restaurar — arrancar con el drag activo o la
// última animación de preview "pegada" sería un bug, no una conveniencia.
export function saveProgress(state) {
  try {
    const payload = {
      version: VERSION,
      savedAt: Date.now(),
      wizard: state.wizard,
      canvas: state.canvas,
      theme: state.theme,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    return true
  } catch {
    // Cuota llena, modo incógnito con storage bloqueado, etc. — el alumno
    // sigue trabajando igual, simplemente no se guarda nada.
    return false
  }
}

// Filtra bloques de tipos que ya no existan en el schema actual, para que
// un progreso guardado con una versión vieja de la herramienta nunca rompa
// el render al cargar (en vez de crashear, esos bloques se descartan).
function sanitizeCanvas(canvas) {
  if (!canvas || !Array.isArray(canvas.blocks)) return null
  return { blocks: canvas.blocks.filter((b) => b && BLOCK_TYPES.includes(b.type)) }
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || data.version !== VERSION) return null
    const canvas = sanitizeCanvas(data.canvas)
    if (!canvas) return null
    return { wizard: data.wizard, canvas, theme: data.theme, savedAt: data.savedAt }
  } catch {
    return null
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // No hay nada que limpiar si el storage ni siquiera está disponible.
  }
}

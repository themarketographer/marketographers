import { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react'
import { builderReducer } from './builderReducer'
import { initialState } from './initialState'
import { loadProgress, saveProgress, clearProgress } from '../utils/storage'

const BuilderContext = createContext(null)

// Si hay progreso guardado de una visita anterior, arranca desde ahí en vez
// de desde cero — incluye el wizard a medio contestar, no solo un canvas ya
// armado, para que "cerré la pestaña sin terminar las 3 preguntas" también
// se recupere.
function hydrateInitialState() {
  const saved = loadProgress()
  if (!saved) return initialState
  return {
    ...initialState,
    wizard: saved.wizard ?? initialState.wizard,
    canvas: saved.canvas ?? initialState.canvas,
    theme: saved.theme ?? initialState.theme,
  }
}

export function BuilderProvider({ children }) {
  const [state, dispatch] = useReducer(builderReducer, undefined, hydrateInitialState)
  const [lastSavedAt, setLastSavedAt] = useState(() => loadProgress()?.savedAt ?? null)
  const saveTimeoutRef = useRef(null)

  // Guardado automático, sin que el alumno tenga que acordarse de tocar
  // ningún botón. Debounced a 800ms: si está escribiendo un título, no
  // queremos escribir en localStorage en cada tecla — esperamos una pausa.
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      const ok = saveProgress(state)
      if (ok) setLastSavedAt(Date.now())
    }, 800)
    return () => clearTimeout(saveTimeoutRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.wizard, state.canvas, state.theme])

  function clearSavedProgress() {
    clearProgress()
    setLastSavedAt(null)
  }

  return (
    <BuilderContext.Provider value={{ state, dispatch, lastSavedAt, clearSavedProgress }}>
      {children}
    </BuilderContext.Provider>
  )
}

export function useBuilder() {
  const ctx = useContext(BuilderContext)
  if (!ctx) throw new Error('useBuilder debe usarse dentro de <BuilderProvider>')
  return ctx
}

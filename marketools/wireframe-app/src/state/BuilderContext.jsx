import { createContext, useContext, useReducer } from 'react'
import { builderReducer } from './builderReducer'
import { initialState } from './initialState'

const BuilderContext = createContext(null)

export function BuilderProvider({ children }) {
  const [state, dispatch] = useReducer(builderReducer, initialState)
  return <BuilderContext.Provider value={{ state, dispatch }}>{children}</BuilderContext.Provider>
}

export function useBuilder() {
  const ctx = useContext(BuilderContext)
  if (!ctx) throw new Error('useBuilder debe usarse dentro de <BuilderProvider>')
  return ctx
}

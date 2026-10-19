import { useEffect, useState } from 'react'

// Mismo mecanismo del sitio: clave mk-theme en localStorage. Solo se guarda
// "light" (Noche es el valor por defecto y no necesita guardarse).
function readTheme() {
  try {
    return localStorage.getItem('mk-theme') === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function useAppTheme() {
  const [theme, setTheme] = useState(readTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      if (theme === 'light') localStorage.setItem('mk-theme', 'light')
      else localStorage.removeItem('mk-theme')
    } catch {
      /* sin almacenamiento: el tema vale solo para esta visita */
    }
  }, [theme])

  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}

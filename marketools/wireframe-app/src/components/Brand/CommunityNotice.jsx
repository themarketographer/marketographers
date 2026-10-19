import { useState } from 'react'

const NOTICE_KEY = 'mk-wf-aviso'

export default function CommunityNotice() {
  const [open, setOpen] = useState(() => {
    try {
      return localStorage.getItem(NOTICE_KEY) !== 'cerrado'
    } catch {
      return true
    }
  })
  if (!open) return null
  const close = () => {
    setOpen(false)
    try {
      localStorage.setItem(NOTICE_KEY, 'cerrado')
    } catch {
      /* sin almacenamiento, el aviso vuelve en la próxima visita */
    }
  }
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-b px-4 py-2 text-xs"
      style={{ background: 'var(--app-hover)', borderColor: 'var(--app-border)', color: 'var(--app-ink)' }}
    >
      <span>Ya tienes el esqueleto. Convertirlo en una landing que vende se enseña en el curso Landing Pages con IA y dentro de la comunidad.</span>
      <span className="flex items-center gap-2">
        <a
          href="/cursos/landing-pages-con-ia/"
          className="mk-press rounded-full border px-3 py-1 font-medium"
          style={{ borderColor: 'var(--app-border)', color: 'var(--app-ink)' }}
        >
          Ver el curso
        </a>
        <a
          href="/#planes"
          className="mk-press rounded-full px-3 py-1 font-semibold"
          style={{ background: 'var(--app-accent)', color: 'var(--app-accent-ink)' }}
        >
          Entrar a la comunidad
        </a>
        <button
          onClick={close}
          aria-label="Cerrar aviso"
          className="mk-press rounded-full px-2 py-1"
          style={{ color: 'var(--app-muted)' }}
        >
          Cerrar
        </button>
      </span>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useBuilder } from '../../state/BuilderContext'
import { BLOCK_SCHEMA } from '../../data/blockSchema'
import { STYLE_REFS } from '../../data/styleReferences'
import { importRepo, loadMyRepos, saveMyRepos, parseRepoInput, repoKey } from '../../utils/repoImport'
import BlockGlyph from './BlockGlyph'
import Icon from '../Shared/Icon'
import ConfirmDialog from '../Shared/ConfirmDialog'

const PABLO_PAGES = ['inspiracion', 'graphica', 'marketographers']
const GALLERY_URL = `${import.meta.env.BASE_URL}inspiracion.json`

// Texto corto para reconocer cada sección en la lista: su título (o frase)
// tal como quedaría en el lienzo.
function snippet(entry) {
  const schema = BLOCK_SCHEMA[entry.type]
  const props = entry.overrideProps ?? {}
  const field = ['title', 'text', 'caption', 'logo'].find((k) => props[k] || schema.fields.some((f) => f.key === k))
  const value = props[field] ?? schema.fields.find((f) => f.key === field)?.default ?? ''
  return String(value).replace(/~~|\^\^|\*\*/g, '')
}

function pabloSource(id) {
  const ref = STYLE_REFS[id]
  return { kind: 'pablo', id, name: id === 'inspiracion' ? 'Inspiración: las dos páginas' : ref.label, by: 'Pablo', entries: ref.draft, theme: ref.theme, url: ref.reference.live }
}

export default function InspirationPanel() {
  const { state, dispatch } = useBuilder()
  const [source, setSource] = useState(null)
  const [gallery, setGallery] = useState(null) // null = cargando, [] = vacía
  const [mine, setMine] = useState(loadMyRepos)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(null) // key del repo que se está leyendo
  const [error, setError] = useState(null)
  const [confirmAll, setConfirmAll] = useState(false)

  useEffect(() => {
    let alive = true
    fetch(GALLERY_URL)
      .then((r) => (r.ok ? r.json() : { paginas: [] }))
      .then((data) => alive && setGallery(Array.isArray(data?.paginas) ? data.paginas.filter((p) => p.repo) : []))
      .catch(() => alive && setGallery([]))
    return () => {
      alive = false
    }
  }, [])

  async function openRepo(repoUrl, meta = {}) {
    setError(null)
    const ref = parseRepoInput(repoUrl)
    setLoading(ref ? repoKey(ref) : repoUrl)
    try {
      const result = await importRepo(repoUrl)
      setSource({ kind: 'repo', id: result.key, name: meta.nombre || result.name, by: meta.autor || result.key.split('/')[0], entries: result.entries, theme: result.theme, url: result.repoUrl })
      return result
    } catch (e) {
      setError(e.message || 'No pudimos leer ese repo.')
      return null
    } finally {
      setLoading(null)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!input.trim()) return
    const result = await openRepo(input.trim())
    if (result) {
      const next = [{ repo: result.repoUrl, nombre: result.name, key: result.key }, ...mine.filter((m) => m.key !== result.key)]
      setMine(next)
      saveMyRepos(next)
      setInput('')
    }
  }

  function removeMine(key) {
    const next = mine.filter((m) => m.key !== key)
    setMine(next)
    saveMyRepos(next)
  }

  function applyAll() {
    if (source.kind === 'pablo') dispatch({ type: 'CANVAS_LOAD_STYLE', styleId: source.id })
    else dispatch({ type: 'CANVAS_LOAD_ENTRIES', entries: source.entries })
    setConfirmAll(false)
  }

  function applyColors() {
    if (source.kind === 'pablo') dispatch({ type: 'THEME_APPLY_PRESET', presetId: source.id === 'inspiracion' ? 'graphica' : source.id })
    else dispatch({ type: 'THEME_FROM_REPO', theme: source.theme })
  }

  if (source) {
    return (
      <div key={source.id} className="wf-panel-swap flex min-h-0 flex-1 flex-col">
        <div className="px-4 pb-3">
          <button onClick={() => setSource(null)} className="wf-ghost-btn -ml-3">
            <Icon name="arrowLeft" size={14} />
            Todas las páginas
          </button>
          <p className="mt-2 text-[15px] font-semibold leading-snug" style={{ color: 'var(--app-ink)' }}>
            {source.name}
          </p>
          <p className="mt-0.5 text-[11px]" style={{ color: 'var(--app-muted)' }}>
            {source.entries.length} secciones · de {source.by}
            {source.kind === 'repo' && (
              <>
                {' · '}
                <a href={source.url} target="_blank" rel="noopener" className="underline underline-offset-2">ver repo</a>
              </>
            )}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => (state.canvas.blocks.length ? setConfirmAll(true) : applyAll())} className="wf-btn-primary !min-h-[34px] !px-3.5 !text-xs">
              Usar toda la página
            </button>
            {source.theme && (
              <button onClick={applyColors} className="wf-chip-btn" title="Aplica sus colores y tipografías a tu página">
                {[source.theme.backgroundColor, source.theme.primaryColor, source.theme.accentColor].filter(Boolean).map((c, i) => (
                  <i key={i} style={{ background: c }} />
                ))}
                Usar sus colores
              </button>
            )}
          </div>
          <p className="mt-3 text-[11px]" style={{ color: 'var(--app-muted)' }}>
            Haz clic en una sección para sumarla al final, o arrástrala al lugar exacto.
          </p>
        </div>
        <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 pb-6">
          {source.entries.map((entry, i) => (
            <div
              key={i}
              role="button"
              tabIndex={0}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/x-block-entry', JSON.stringify(entry))
                e.dataTransfer.effectAllowed = 'copy'
              }}
              onClick={() => dispatch({ type: 'CANVAS_ADD_ENTRY', entry })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  dispatch({ type: 'CANVAS_ADD_ENTRY', entry })
                }
              }}
              className="wf-pal-item wf-rise !items-start"
              style={{ '--i': Math.min(i, 10) }}
            >
              <BlockGlyph type={entry.type} />
              <span className="min-w-0 flex-1">
                <span className="block truncate">{BLOCK_SCHEMA[entry.type].label}</span>
                <span className="block truncate text-[11px] font-normal" style={{ color: 'var(--app-muted)' }}>
                  {snippet(entry)}
                </span>
              </span>
              <span className="wf-pal-add mt-0.5" aria-hidden="true">
                <Icon name="plus" size={14} strokeWidth={2.2} />
              </span>
            </div>
          ))}
        </div>
        {confirmAll && (
          <ConfirmDialog
            title="¿Reemplazar tu lienzo?"
            body={`Se cambian tus ${state.canvas.blocks.length} secciones por las ${source.entries.length} de esta página. Tus colores no cambian.`}
            confirmLabel="Sí, reemplazar"
            onCancel={() => setConfirmAll(false)}
            onConfirm={applyAll}
          />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-6">
      <p className="px-2 text-[11px]" style={{ color: 'var(--app-muted)' }}>
        Abre una página, mira cómo está armada y llévate las secciones que quieras.
      </p>

      <h4 className="wf-insp-h">Páginas de Pablo</h4>
      {PABLO_PAGES.map((id, i) => {
        const ref = STYLE_REFS[id]
        return (
          <button key={id} onClick={() => setSource(pabloSource(id))} className="wf-source wf-rise" style={{ '--i': i }}>
            <span className="wf-source-dots">
              {ref.swatches.map((c) => (
                <i key={c} style={{ background: c }} />
              ))}
            </span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate">{id === 'inspiracion' ? 'Las dos páginas juntas' : ref.label}</span>
              <span className="block text-[11px] font-normal" style={{ color: 'var(--app-muted)' }}>{ref.draft.length} secciones</span>
            </span>
            <Icon name="chevron" size={13} className="wf-source-arrow" />
          </button>
        )
      })}

      <h4 className="wf-insp-h">De la comunidad</h4>
      {gallery === null && <p className="wf-insp-note">Cargando páginas…</p>}
      {gallery?.length === 0 && <p className="wf-insp-note">Aquí van a aparecer las páginas de alumnos que Pablo vaya sumando.</p>}
      {gallery?.map((g, i) => {
        const key = parseRepoInput(g.repo) ? repoKey(parseRepoInput(g.repo)) : g.repo
        return (
          <button key={key} onClick={() => openRepo(g.repo, g)} className="wf-source wf-rise" style={{ '--i': i + 3 }} disabled={!!loading}>
            <span className="wf-source-avatar">{(g.autor || g.nombre || '?').slice(0, 1).toUpperCase()}</span>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate">{g.nombre || key}</span>
              <span className="block truncate text-[11px] font-normal" style={{ color: 'var(--app-muted)' }}>{g.autor ? `de ${g.autor}` : key}{g.nicho ? ` · ${g.nicho}` : ''}</span>
            </span>
            {loading === key ? <span className="wf-spin" aria-label="Leyendo" /> : <Icon name="chevron" size={13} className="wf-source-arrow" />}
          </button>
        )
      })}

      <h4 className="wf-insp-h">Trae una página de GitHub</h4>
      <form onSubmit={handleSubmit} className="px-2">
        <label className="wf-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
          </svg>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              setError(null)
            }}
            placeholder="github.com/usuario/repo"
            aria-label="Link del repositorio de GitHub"
            spellCheck={false}
          />
        </label>
        <button type="submit" disabled={!input.trim() || !!loading} className="wf-btn-primary mt-2 w-full !min-h-[38px] disabled:opacity-40">
          {loading && !gallery?.some((g) => g.repo === input) ? <span className="wf-spin" /> : null}
          {loading ? 'Leyendo la página…' : 'Traer sus secciones'}
        </button>
        {error && (
          <p className="wf-insp-error" role="alert">
            {error}
          </p>
        )}
        <p className="mt-2 text-[11px] leading-relaxed" style={{ color: 'var(--app-muted)' }}>
          Funciona con repos públicos de HTML. Se lleva la estructura de cada sección; los textos quedan como guía para que escribas los tuyos y las fotos no se copian.
        </p>
      </form>

      {mine.length > 0 && (
        <>
          <h4 className="wf-insp-h">Las que trajiste</h4>
          {mine.map((m) => (
            <div key={m.key} className="wf-source">
              <button onClick={() => openRepo(m.repo)} className="flex min-w-0 flex-1 items-center gap-3 text-left" disabled={!!loading}>
                <span className="wf-source-avatar">{m.key.slice(0, 1).toUpperCase()}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{m.nombre}</span>
                  <span className="block truncate text-[11px] font-normal" style={{ color: 'var(--app-muted)' }}>{m.key}</span>
                </span>
                {loading === m.key && <span className="wf-spin" />}
              </button>
              <button onClick={() => removeMine(m.key)} className="wf-source-x" aria-label={`Quitar ${m.nombre}`} title="Quitar de la lista">
                <Icon name="close" size={12} />
              </button>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

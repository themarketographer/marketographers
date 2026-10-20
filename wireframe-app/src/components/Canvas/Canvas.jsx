import { useRef, useState, useEffect } from 'react'
import { useBuilder } from '../../state/BuilderContext'
import { calcInsertIndex, readBlockRects } from '../../utils/dragPosition'
import CanvasBlock from './CanvasBlock'
import DropIndicator from './DropIndicator'
import EmptyCanvas from './EmptyCanvas'
import Icon from '../Shared/Icon'
import { getStyleRef } from '../../data/styleReferences'

const MIN_ZOOM = 0.4
const MAX_ZOOM = 2
const ZOOM_STEP = 0.1
const EDGE_SCROLL_ZONE = 70
const EDGE_SCROLL_SPEED = 18
const UNDO_TIMEOUT = 6000

export default function Canvas({ selectedBlockId, onSelectBlock }) {
  const { state, dispatch } = useBuilder()
  const { blocks } = state.canvas
  const { draggingBlockId } = state.dnd
  const containerRef = useRef(null)
  const scrollAreaRef = useRef(null)
  // hoverIndex vive en estado local, no en el reducer global: en un dragover
  // real llegan muchos eventos por segundo, y depender de un dispatch async
  // (con su re-render) para saber "hay algo siendo arrastrado" es una carrera
  // que puede perder el primer dragover. dataTransfer.types sí está
  // disponible de forma síncrona, así que se usa eso para decidir si aceptar
  // el drop.
  const [hoverIndex, setHoverIndex] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [fitZoom, setFitZoom] = useState(1)
  // Mientras el alumno no toque el zoom, la página se ajusta sola al ancho
  // disponible (al abrir, al cambiar celular/escritorio y al plegar paneles).
  const userZoomed = useRef(false)

  function manualZoom(update) {
    userZoomed.current = true
    setZoom((z) => clampZoom(typeof update === 'function' ? update(z) : update))
  }
  const [undoState, setUndoState] = useState(null) // { block, atIndex } | null
  const [replaying, setReplaying] = useState(false)
  const styleId = state.theme.styleId

  // "Ver animaciones": vuelve a correr la entrada de todas las secciones,
  // escalonadas, con la curva y el movimiento del estilo elegido. También
  // corre sola cuando se carga un borrador de estilo.
  useEffect(() => {
    if (!state.replayNonce) return
    setReplaying(false)
    const raf = requestAnimationFrame(() => setReplaying(true))
    const t = setTimeout(() => setReplaying(false), 1400 + blocks.length * 90)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.replayNonce])

  // Atajos: Supr/Borrar elimina el bloque seleccionado, Esc lo deselecciona,
  // Ctrl/Cmd + D lo duplica. Nunca se disparan mientras se escribe en un campo.
  useEffect(() => {
    function onKey(e) {
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return
      if (!selectedBlockId) return
      const block = blocks.find((b) => b.id === selectedBlockId)
      if (!block) return
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        handleDeleteBlock(block)
      } else if (e.key === 'Escape') {
        onSelectBlock(null)
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        dispatch({ type: 'BLOCK_DUPLICATE', blockId: block.id })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  useEffect(() => {
    if (!undoState) return
    const t = setTimeout(() => setUndoState(null), UNDO_TIMEOUT)
    return () => clearTimeout(t)
  }, [undoState])

  function clampZoom(z) {
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z))
  }

  // Zoom con Ctrl/Cmd + rueda, y con pellizco de trackpad: los navegadores
  // reportan el gesto de pellizco como un 'wheel' con ctrlKey=true, así que
  // ambos casos se manejan igual acá. La rueda normal (sin Ctrl) sigue
  // scrolleando la página como siempre.
  //
  // Esto NO se puede hacer con la prop `onWheel` de React: React registra
  // los listeners de wheel como passive por defecto (para no trabar el
  // scroll), y en un listener passive `preventDefault()` no hace nada (ni
  // siquiera avisa) — el pellizco terminaba haciendo zoom del navegador
  // entero en vez de solo el canvas. Por eso el listener se agrega a mano
  // con `{ passive: false }`.
  useEffect(() => {
    const scrollArea = scrollAreaRef.current
    if (!scrollArea) return
    function onWheel(e) {
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      manualZoom((z) => z - e.deltaY * 0.01 * ZOOM_STEP * 5)
    }
    scrollArea.addEventListener('wheel', onWheel, { passive: false })
    return () => scrollArea.removeEventListener('wheel', onWheel)
  }, [])

  function autoScrollNearEdges(clientY) {
    const scrollArea = scrollAreaRef.current
    if (!scrollArea) return
    const rect = scrollArea.getBoundingClientRect()
    if (clientY - rect.top < EDGE_SCROLL_ZONE) {
      scrollArea.scrollTop -= EDGE_SCROLL_SPEED
    } else if (rect.bottom - clientY < EDGE_SCROLL_ZONE) {
      scrollArea.scrollTop += EDGE_SCROLL_SPEED
    }
  }

  function handleDragOver(e) {
    const types = e.dataTransfer.types
    const isBlockType = types.includes('application/x-block-type')
    const isBlockId = types.includes('application/x-block-id')
    const isEntry = types.includes('application/x-block-entry')
    if (!isBlockType && !isBlockId && !isEntry) return

    e.preventDefault()
    e.dataTransfer.dropEffect = isBlockId ? 'move' : 'copy'
    // Arrastrar cerca del borde superior/inferior del área visible hace
    // scroll automático, para poder soltar un bloque más arriba o más abajo
    // de lo que entra en pantalla sin soltar el mouse.
    autoScrollNearEdges(e.clientY)
    const rects = readBlockRects(containerRef.current)
    const index = calcInsertIndex(rects, e.clientY)
    setHoverIndex(index)
  }

  function handleDrop(e) {
    e.preventDefault()
    const paletteType = e.dataTransfer.getData('application/x-block-type')
    const blockId = e.dataTransfer.getData('application/x-block-id')
    const entryJson = e.dataTransfer.getData('application/x-block-entry')
    const index = hoverIndex ?? blocks.length
    if (entryJson) {
      try {
        dispatch({ type: 'CANVAS_ADD_ENTRY', entry: JSON.parse(entryJson), atIndex: index })
      } catch {
        /* arrastre de otra página: se ignora */
      }
      setHoverIndex(null)
      dispatch({ type: 'DND_END' })
      return
    }

    if (blockId) {
      dispatch({ type: 'BLOCK_MOVE', blockId, toIndex: index })
    } else if (paletteType) {
      dispatch({ type: 'BLOCK_ADD', blockType: paletteType, atIndex: index })
    }
    setHoverIndex(null)
    dispatch({ type: 'DND_END' })
  }

  function handleDeleteBlock(block) {
    const atIndex = blocks.findIndex((b) => b.id === block.id)
    dispatch({ type: 'BLOCK_REMOVE', blockId: block.id })
    setUndoState({ block, atIndex })
    if (selectedBlockId === block.id) onSelectBlock(null)
  }

  function handleUndo() {
    if (!undoState) return
    dispatch({ type: 'BLOCK_RESTORE', block: undoState.block, atIndex: undoState.atIndex })
    setUndoState(null)
  }

  // El toggle móvil/escritorio fija el ancho del canvas, pero el layout de
  // cada bloque NO debe depender de los prefijos responsive de Tailwind
  // (md:): esos reaccionan al viewport real del navegador, no al ancho del
  // propio canvas, así que a cualquier tamaño de ventana rompían la
  // diagramación (grids que se salían del canvas). En cambio cada bloque
  // recibe `previewMode` y decide su layout en JS, ligado al ancho real del
  // canvas. 1440px de escritorio es un ancho de laptop típico, más realista
  // que el viejo 1280.
  const previewMode = state.preview.mode
  const previewWidth = previewMode === 'mobile' ? 375 : 1440

  // En un celular la vista de escritorio queda microscópica: arranca en la
  // vista de celular (el alumno puede cambiarla igual con el selector).
  useEffect(() => {
    if (window.innerWidth < 700 && state.preview.mode === 'desktop') dispatch({ type: 'PREVIEW_SET_MODE', mode: 'mobile' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const area = scrollAreaRef.current
    if (!area) return
    function fit() {
      const available = area.clientWidth - 48
      const next = Math.round(clampZoom(Math.min(1, available / previewWidth)) * 100) / 100
      setFitZoom(next)
      if (!userZoomed.current) setZoom(next)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(area)
    return () => ro.disconnect()
  }, [previewWidth])

  return (
    <div className="relative min-w-0 flex-1">
      <div
        ref={scrollAreaRef}
        className="wf-stage h-full overflow-auto px-6 pb-24 pt-6"
      >
        <div
          // El zoom usa la propiedad CSS `zoom` (no `transform: scale`) a
          // propósito: `zoom` sí afecta el tamaño de layout, así que el
          // scroll del contenedor padre sigue calculándose bien solo. Con
          // `transform` habría que simular manualmente el tamaño de scroll.
          style={{ width: previewWidth, zoom, margin: '0 auto' }}
        >
          <div
            ref={containerRef}
            onDragOver={handleDragOver}
            onDragLeave={() => setHoverIndex(null)}
            onDrop={handleDrop}
            onClick={() => onSelectBlock(null)}
            data-font-scale=""
            data-style={styleId ?? undefined}
            data-preview={previewMode}
            className={`wf-page min-h-[400px] ${replaying ? 'is-replaying' : ''}`}
            style={{
              width: previewWidth,
              background: 'var(--color-bg)',
              // La landing del alumno usa su propio color de texto, no el del tema de la herramienta.
              color: 'var(--color-text)',
              fontFamily: 'var(--font-body)',
              '--font-scale': state.theme.fontScale,
            }}
          >
            {blocks.length === 0 && <EmptyCanvas funnelId={state.wizard.funnelId} />}
            {blocks.map((block, i) => (
              // `contents`: estos wrappers no deben generar caja propia. Si la
              // tuvieran, un header con position:sticky quedaría "atrapado"
              // dentro de una caja del alto de su propio contenido y se
              // despegaría apenas se scrollea un poco (el sticky necesita que
              // su ancestro real tenga mucha más altura que el elemento).
              <div key={block.id} className="contents">
                {hoverIndex === i && <DropIndicator />}
                <div onClick={(e) => e.stopPropagation()} className="contents">
                  <CanvasBlock
                    block={block}
                    index={i}
                    total={blocks.length}
                    previewMode={previewMode}
                    isSelected={block.id === selectedBlockId}
                    isDragging={block.id === draggingBlockId}
                    onSelect={onSelectBlock}
                    onDelete={handleDeleteBlock}
                  />
                </div>
              </div>
            ))}
            {hoverIndex === blocks.length && <DropIndicator />}
          </div>
        </div>
      </div>

      <div className="wf-dock absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 px-1.5 py-1">
        {blocks.length > 0 && (
          <>
            <button
              onClick={() => dispatch({ type: 'CANVAS_REPLAY' })}
              className="wf-dock-btn"
              aria-label="Ver animaciones"
              title={styleId ? `Reproduce las entradas al estilo ${getStyleRef(styleId)?.label}` : 'Reproduce las entradas de todas las secciones'}
            >
              <Icon name="replay" size={14} />
              <span className="hidden whitespace-nowrap sm:inline">Ver animaciones</span>
            </button>
            <span className="wf-dock-sep" aria-hidden="true" />
          </>
        )}
        <button
          onClick={() => manualZoom((z) => z - ZOOM_STEP)}
          disabled={zoom <= MIN_ZOOM}
          className="grid place-items-center disabled:opacity-30"
          style={{ color: 'var(--app-ink)' }}
          aria-label="Alejar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14" /></svg>
        </button>
        <span className="w-11 text-center text-xs font-medium tabular-nums" style={{ color: 'var(--app-muted)' }}>
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => manualZoom((z) => z + ZOOM_STEP)}
          disabled={zoom >= MAX_ZOOM}
          className="grid place-items-center disabled:opacity-30"
          style={{ color: 'var(--app-ink)' }}
          aria-label="Acercar"
        >
          <Icon name="plus" size={14} strokeWidth={2.2} />
        </button>
        {Math.abs(zoom - fitZoom) > 0.01 && (
          <button
            onClick={() => {
              userZoomed.current = false
              setZoom(fitZoom)
            }}
            className="wf-dock-btn"
            title="Ajusta la página al ancho disponible"
          >
            Ajustar
          </button>
        )}
      </div>

      {undoState && (
        <div className="wf-toast absolute bottom-4 right-4 flex items-center gap-3 px-4 py-2" role="status">
          <span className="text-xs" style={{ color: 'var(--app-ink)' }}>
            Bloque eliminado
          </span>
          <button
            onClick={handleUndo}
            className="text-xs font-semibold"
            style={{ color: 'var(--app-ink)', textDecoration: 'underline' }}
          >
            Deshacer
          </button>
        </div>
      )}
    </div>
  )
}

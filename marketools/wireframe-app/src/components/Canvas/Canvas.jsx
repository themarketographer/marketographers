import { useRef, useState, useEffect } from 'react'
import { useBuilder } from '../../state/BuilderContext'
import { calcInsertIndex, readBlockRects } from '../../utils/dragPosition'
import CanvasBlock from './CanvasBlock'
import DropIndicator from './DropIndicator'

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
  const [undoState, setUndoState] = useState(null) // { block, atIndex } | null

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
      setZoom((z) => clampZoom(z - e.deltaY * 0.01 * ZOOM_STEP * 5))
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
    if (!isBlockType && !isBlockId) return

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
    const index = hoverIndex ?? blocks.length

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

  return (
    <div className="relative min-w-0 flex-1">
      <div
        ref={scrollAreaRef}
        className="h-full overflow-auto p-6"
        style={{ background: '#e5e2db' }}
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
            className="min-h-[400px] shadow-lg"
            style={{
              width: previewWidth,
              background: 'var(--color-bg)',
              fontFamily: 'var(--font-body)',
              '--font-scale': state.theme.fontScale,
            }}
          >
            {blocks.length === 0 && (
              <div className="flex h-64 flex-col items-center justify-center gap-3 text-sm text-neutral-400">
                <p>Arrastrá un bloque de la paleta para empezar</p>
                <button
                  onClick={() => dispatch({ type: 'CANVAS_LOAD_FUNNEL_DRAFT' })}
                  className="rounded-full border px-4 py-2 text-xs font-medium"
                  style={{ borderColor: 'var(--app-border)', color: 'var(--app-ink)' }}
                >
                  {[2, 3, 4, 5].includes(state.wizard.funnelId)
                    ? 'O cargar el borrador sugerido para tu embudo'
                    : 'O cargar un borrador simple para empezar'}
                </button>
              </div>
            )}
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

      <div
        className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border bg-white px-2 py-1 shadow-md"
        style={{ borderColor: 'var(--app-border)' }}
      >
        <button
          onClick={() => setZoom((z) => clampZoom(z - ZOOM_STEP))}
          disabled={zoom <= MIN_ZOOM}
          className="flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold disabled:opacity-30"
          style={{ color: 'var(--app-ink)' }}
          aria-label="Alejar"
        >
          −
        </button>
        <span className="w-10 text-center text-xs font-medium" style={{ color: 'var(--app-muted)' }}>
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => clampZoom(z + ZOOM_STEP))}
          disabled={zoom >= MAX_ZOOM}
          className="flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold disabled:opacity-30"
          style={{ color: 'var(--app-ink)' }}
          aria-label="Acercar"
        >
          +
        </button>
        {zoom !== 1 && (
          <button
            onClick={() => setZoom(1)}
            className="ml-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{ background: 'var(--app-bg)', color: 'var(--app-muted)' }}
          >
            100%
          </button>
        )}
      </div>

      {undoState && (
        <div
          className="absolute bottom-4 right-4 flex items-center gap-3 rounded-full border bg-white px-4 py-2 shadow-md"
          style={{ borderColor: 'var(--app-border)' }}
        >
          <span className="text-xs" style={{ color: 'var(--app-ink)' }}>
            Bloque eliminado
          </span>
          <button
            onClick={handleUndo}
            className="text-xs font-semibold"
            style={{ color: 'var(--app-accent-ink)', textDecoration: 'underline' }}
          >
            Deshacer
          </button>
        </div>
      )}
    </div>
  )
}

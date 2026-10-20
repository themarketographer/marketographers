import { useEffect, useRef } from 'react'
import { useBuilder } from '../../state/BuilderContext'
import { BLOCK_SCHEMA } from '../../data/blockSchema'
import { surfaceVars } from '../../data/surfaces'
import BlockRenderer from '../blocks/BlockRenderer'
import Icon from '../Shared/Icon'

const RADIUS = { sharp: '4px', soft: '14px', pill: '999px' }

export default function CanvasBlock({ block, index, total, previewMode, isSelected, isDragging, onSelect, onDelete }) {
  const { state, dispatch } = useBuilder()
  const ref = useRef(null)

  const preview = state.animationPreview
  const isPreviewing = preview && preview.blockId === block.id
  const previewClass = isPreviewing ? `preview-anim-${preview.type}` : ''
  const isFlash = state.flashBlockId === block.id

  // Bloque recién agregado (desde la paleta, duplicado o soltado): se lleva a
  // la vista, queda seleccionado para editarlo directo y anima su entrada.
  useEffect(() => {
    if (!isFlash) return
    ref.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' })
    onSelect(block.id)
    const t = setTimeout(() => dispatch({ type: 'FLASH_CLEAR' }), 700)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFlash])

  const overrideStyle = { '--i': index, ...surfaceVars(block.surface, block.type) }
  if (block.accentOverride) overrideStyle['--color-accent'] = block.accentOverride
  if (block.radiusOverride) overrideStyle['--radius'] = RADIUS[block.radiusOverride]
  // El sticky del header se aplica acá, en el wrapper que sí llega directo
  // (gracias a los `contents` de Canvas.jsx) hasta el contenedor alto del
  // canvas — no adentro de HeaderBlock, donde su propio padre inmediato
  // mediría lo mismo que el header y el sticky no tendría margen para
  // "quedarse pegado" al hacer scroll.
  const isStickyHeader = block.type === 'header' && block.props.behavior === 'sticky'
  if (isStickyHeader) {
    overrideStyle.position = 'sticky'
    overrideStyle.top = 0
    overrideStyle.zIndex = 30
  }

  function act(e, fn) {
    e.preventDefault()
    e.stopPropagation()
    fn()
  }

  return (
    <div
      ref={ref}
      data-block-id={block.id}
      data-surface={block.surface ?? 'page'}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/x-block-id', block.id)
        e.dataTransfer.effectAllowed = 'move'
        dispatch({ type: 'DND_START_REORDER', blockId: block.id })
      }}
      onDragEnd={() => dispatch({ type: 'DND_END' })}
      onClick={() => onSelect(block.id)}
      onAnimationEnd={(e) => e.target === e.currentTarget && isPreviewing && dispatch({ type: 'ANIMATION_PREVIEW_CLEAR' })}
      className={`wf-block group ${isSelected ? 'is-selected' : ''} ${isDragging ? 'is-dragging' : ''} ${isFlash ? 'is-born' : ''} ${previewClass}`}
      style={overrideStyle}
    >
      <div className="wf-block-bar" onPointerDown={(e) => e.stopPropagation()}>
        <span className="wf-block-name">
          <Icon name="grip" size={12} />
          {BLOCK_SCHEMA[block.type]?.label ?? block.type}
        </span>
        <span className="wf-block-tools" onMouseDown={(e) => e.stopPropagation()}>
          <button type="button" draggable={false} disabled={index === 0} onClick={(e) => act(e, () => dispatch({ type: 'BLOCK_SHIFT', blockId: block.id, delta: -1 }))} aria-label="Subir bloque" title="Subir">
            <Icon name="up" size={14} />
          </button>
          <button type="button" draggable={false} disabled={index === total - 1} onClick={(e) => act(e, () => dispatch({ type: 'BLOCK_SHIFT', blockId: block.id, delta: 1 }))} aria-label="Bajar bloque" title="Bajar">
            <Icon name="down" size={14} />
          </button>
          <button type="button" draggable={false} onClick={(e) => act(e, () => dispatch({ type: 'BLOCK_DUPLICATE', blockId: block.id }))} aria-label="Duplicar bloque" title="Duplicar">
            <Icon name="copy" size={14} />
          </button>
          <button type="button" draggable={false} className="is-danger" onClick={(e) => act(e, () => onDelete(block))} aria-label="Eliminar bloque" title="Eliminar">
            <Icon name="trash" size={14} />
          </button>
        </span>
      </div>
      <BlockRenderer block={block} previewMode={previewMode} />
    </div>
  )
}

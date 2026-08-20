import { useBuilder } from '../../state/BuilderContext'
import BlockRenderer from '../blocks/BlockRenderer'

export default function CanvasBlock({ block, previewMode, isSelected, isDragging, onSelect, onDelete }) {
  const { state, dispatch } = useBuilder()

  const preview = state.animationPreview
  const isPreviewing = preview && preview.blockId === block.id
  const previewClass = isPreviewing ? `preview-anim-${preview.type}` : ''

  const overrideStyle = {}
  if (block.accentOverride) overrideStyle['--color-accent'] = block.accentOverride
  if (block.radiusOverride) {
    overrideStyle['--radius'] = { sharp: '4px', soft: '14px', pill: '999px' }[block.radiusOverride]
  }
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

  return (
    <div
      data-block-id={block.id}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/x-block-id', block.id)
        e.dataTransfer.effectAllowed = 'move'
        dispatch({ type: 'DND_START_REORDER', blockId: block.id })
      }}
      onDragEnd={() => dispatch({ type: 'DND_END' })}
      onClick={() => onSelect(block.id)}
      onAnimationEnd={() => isPreviewing && dispatch({ type: 'ANIMATION_PREVIEW_CLEAR' })}
      className={`group relative cursor-pointer border-2 transition-opacity ${
        isSelected ? '' : 'border-transparent hover:border-black/10'
      } ${isDragging ? 'opacity-30' : 'opacity-100'} ${previewClass}`}
      style={{ ...overrideStyle, borderColor: isSelected ? 'var(--app-accent)' : undefined }}
    >
      <span className="pointer-events-none absolute left-2 top-2 z-40 rounded bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 group-hover:opacity-100">
        {block.type}
      </span>
      <button
        type="button"
        draggable={false}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onDragStart={(e) => e.preventDefault()}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onDelete(block)
        }}
        className={`absolute right-2 top-2 z-40 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-sm text-white transition-opacity hover:bg-red-600 ${
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        aria-label="Eliminar bloque"
      >
        ×
      </button>
      <BlockRenderer block={block} previewMode={previewMode} />
    </div>
  )
}

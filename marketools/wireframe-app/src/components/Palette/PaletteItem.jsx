import { useBuilder } from '../../state/BuilderContext'

export default function PaletteItem({ type, label }) {
  const { dispatch } = useBuilder()

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/x-block-type', type)
        e.dataTransfer.effectAllowed = 'copy'
        dispatch({ type: 'DND_START_PALETTE', blockType: type })
      }}
      onDragEnd={() => dispatch({ type: 'DND_END' })}
      className="cursor-grab select-none rounded-xl border bg-white px-3 py-2 text-sm font-medium shadow-sm transition-colors active:cursor-grabbing"
      style={{ borderColor: 'var(--app-border)', color: 'var(--app-ink)' }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--app-accent)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--app-border)')}
    >
      {label}
    </div>
  )
}

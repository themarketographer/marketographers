import { BLOCK_SCHEMA, BLOCK_TYPES } from '../../data/blockSchema'
import PaletteItem from './PaletteItem'

export default function BlockPalette() {
  return (
    <aside
      className="w-56 shrink-0 space-y-2 overflow-y-auto border-r p-4"
      style={{ borderColor: 'var(--app-border)', background: 'var(--app-bg)' }}
    >
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--app-muted)' }}>
        Bloques
      </h3>
      {BLOCK_TYPES.map((type) => (
        <PaletteItem key={type} type={type} label={BLOCK_SCHEMA[type].label} />
      ))}
    </aside>
  )
}

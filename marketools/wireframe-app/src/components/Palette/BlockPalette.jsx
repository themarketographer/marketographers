import { useState } from 'react'
import { BLOCK_SCHEMA, BLOCK_GROUPS } from '../../data/blockSchema'
import PaletteItem from './PaletteItem'

export default function BlockPalette() {
  const [query, setQuery] = useState('')
  const [collapsedGroups, setCollapsedGroups] = useState({})

  function toggleGroup(id) {
    setCollapsedGroups((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const q = query.trim().toLowerCase()
  const groups = BLOCK_GROUPS.map((group) => ({
    ...group,
    types: group.types.filter((type) => !q || BLOCK_SCHEMA[type].label.toLowerCase().includes(q)),
  })).filter((group) => group.types.length > 0)

  return (
    <aside
      className="flex w-56 shrink-0 flex-col overflow-y-auto border-r p-4"
      style={{ borderColor: 'var(--app-border)', background: 'var(--app-bg)' }}
    >
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--app-muted)' }}>
        Bloques
      </h3>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar bloque..."
        className="mb-3 w-full rounded-lg border px-2 py-1.5 text-xs"
        style={{ borderColor: 'var(--app-border)' }}
      />
      <div className="space-y-3">
        {groups.map((group) => {
          const isCollapsed = !!collapsedGroups[group.id] && !q
          return (
            <div key={group.id}>
              <button
                onClick={() => toggleGroup(group.id)}
                className="flex w-full items-center justify-between py-1 text-left text-xs font-semibold"
                style={{ color: 'var(--app-ink)' }}
              >
                {group.label}
                <span style={{ color: 'var(--app-muted)' }}>{isCollapsed ? '▸' : '▾'}</span>
              </button>
              {!isCollapsed && (
                <div className="mt-1.5 space-y-1.5">
                  {group.types.map((type) => (
                    <PaletteItem key={type} type={type} label={BLOCK_SCHEMA[type].label} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
        {groups.length === 0 && (
          <p className="text-xs" style={{ color: 'var(--app-muted)' }}>
            Ningún bloque coincide con "{query}".
          </p>
        )}
      </div>
    </aside>
  )
}

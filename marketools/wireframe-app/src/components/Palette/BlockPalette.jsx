import { useState } from 'react'
import { BLOCK_SCHEMA, BLOCK_GROUPS } from '../../data/blockSchema'
import PaletteItem from './PaletteItem'
import Icon from '../Shared/Icon'
import InspirationPanel from './InspirationPanel'

const TABS = [
  { id: 'blocks', label: 'Bloques' },
  { id: 'inspiration', label: 'Inspiración' },
]

export default function BlockPalette() {
  const [query, setQuery] = useState('')
  const [collapsedGroups, setCollapsedGroups] = useState({})
  const [tab, setTab] = useState('blocks')

  function toggleGroup(id) {
    setCollapsedGroups((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const q = query.trim().toLowerCase()
  const groups = BLOCK_GROUPS.map((group) => ({
    ...group,
    types: group.types.filter((type) => !q || BLOCK_SCHEMA[type].label.toLowerCase().includes(q)),
  })).filter((group) => group.types.length > 0)

  return (
    <aside className="wf-side wf-side-left flex w-64 shrink-0 flex-col border-r">
      <div className="px-3 pt-3">
        <div className="wf-tabs" role="tablist" style={{ '--n': TABS.length, '--x': TABS.findIndex((t) => t.id === tab) }}>
          <span className="wf-tabs-pill" aria-hidden="true" />
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {tab === 'inspiration' ? (
        <div className="flex min-h-0 flex-1 flex-col pt-3">
          <InspirationPanel />
        </div>
      ) : (
      <>
      <div className="px-4 pb-3 pt-3">
        <p className="text-[11px]" style={{ color: 'var(--app-muted)' }}>
          Arrástralos al lienzo o haz clic para sumarlos al final.
        </p>
        <label className="wf-search mt-3">
          <Icon name="search" size={14} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar bloque"
            aria-label="Buscar bloque"
          />
        </label>
      </div>
      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-6">
        {groups.map((group) => {
          const isCollapsed = !!collapsedGroups[group.id] && !q
          return (
            <div key={group.id}>
              <button
                onClick={() => toggleGroup(group.id)}
                aria-expanded={!isCollapsed}
                className="wf-group-btn"
              >
                <Icon name="chevron" size={12} strokeWidth={2.4} className={`wf-chev ${isCollapsed ? '' : 'is-open'}`} />
                <span className="flex-1 text-left">{group.label}</span>
                <span className="tabular-nums" style={{ color: 'var(--app-muted)' }}>{group.types.length}</span>
              </button>
              <div className={`wf-collapse ${isCollapsed ? '' : 'is-open'}`}>
                <div className="wf-collapse-inner space-y-0.5 pb-1">
                  {group.types.map((type, i) => (
                    <PaletteItem key={type} type={type} label={BLOCK_SCHEMA[type].label} index={i} />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
        {groups.length === 0 && (
          <p className="px-2 text-xs" style={{ color: 'var(--app-muted)' }}>
            Ningún bloque se llama "{query}". Prueba con otra palabra.
          </p>
        )}
      </div>
      </>
      )}
    </aside>
  )
}

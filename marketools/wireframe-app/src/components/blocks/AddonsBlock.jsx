import { renderEmphasis } from '../../utils/textEmphasis'
import { parseRow } from '../../utils/parseRow'

export default function AddonsBlock({ props, previewMode }) {
  const isMobile = previewMode === 'mobile'
  const columns = isMobile ? 1 : Math.min(3, props.extras.length)

  return (
    <div className="p-10">
      <h2 className="mb-6 text-center text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
        {renderEmphasis(props.title)}
      </h2>
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {props.extras.map((raw, i) => {
          const [title, text, buttonText, event] = parseRow(raw, 4)
          return (
            <div key={i} className="min-w-0 border border-black/10 p-4" style={{ borderRadius: 'var(--radius)' }}>
              <p className="font-semibold" style={{ color: 'var(--color-text)' }}>{title}</p>
              <p className="mt-1 text-sm opacity-70" style={{ color: 'var(--color-text)' }}>{renderEmphasis(text)}</p>
              <button
                className="mt-3 px-4 py-2 text-sm font-medium"
                style={{ background: 'var(--color-accent)', borderRadius: 'var(--radius)', color: 'var(--color-accent-ink)' }}
              >
                {buttonText || 'Agregar'}
              </button>
              {event && <p className="mt-1 text-[10px] opacity-60">→ evento: `{event}`</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

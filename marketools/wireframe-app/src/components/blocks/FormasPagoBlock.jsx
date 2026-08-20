import { renderEmphasis } from '../../utils/textEmphasis'
import { parseRow } from '../../utils/parseRow'

export default function FormasPagoBlock({ props, previewMode }) {
  const isMobile = previewMode === 'mobile'
  const columns = isMobile ? 1 : props.modes.length

  return (
    <div className="p-10">
      <h2 className="mb-6 text-center text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
        {renderEmphasis(props.title)}
      </h2>
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {props.modes.map((raw, i) => {
          const [mode, detail] = parseRow(raw, 2)
          return (
            <div key={i} className="min-w-0 border border-black/10 p-4 text-center" style={{ borderRadius: 'var(--radius)' }}>
              <p className="font-semibold" style={{ color: 'var(--color-text)' }}>{mode}</p>
              <p className="mt-1 text-sm" style={{ color: 'var(--color-accent)' }}>{detail}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

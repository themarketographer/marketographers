import { renderEmphasis } from '../../utils/textEmphasis'
import { parseRow } from '../../utils/parseRow'

export default function GarantiasBlock({ props, previewMode }) {
  const isMobile = previewMode === 'mobile'
  const columns = isMobile ? 1 : props.cards.length

  return (
    <div className="p-10">
      <h2 className="mb-6 text-center text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
        {renderEmphasis(props.title)}
      </h2>
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {props.cards.map((raw, i) => {
          const [icon, title, text] = parseRow(raw, 3)
          return (
            <div key={i} className="min-w-0 border border-black/10 p-4 text-center" style={{ borderRadius: 'var(--radius)' }}>
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center text-lg" style={{ color: 'var(--color-accent)' }}>
                {icon}
              </div>
              <p className="font-semibold" style={{ color: 'var(--color-text)' }}>{title}</p>
              <p className="mt-1 text-sm opacity-70" style={{ color: 'var(--color-text)' }}>{text}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

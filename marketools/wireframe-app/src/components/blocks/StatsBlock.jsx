import { renderEmphasis } from '../../utils/textEmphasis'

function parseStat(raw) {
  const [number, ...rest] = raw.split('|')
  return { number: (number ?? '').trim(), label: rest.join('|').trim() }
}

export default function StatsBlock({ props, previewMode }) {
  const isMobile = previewMode === 'mobile'
  const columns = isMobile ? 2 : props.stats.length

  return (
    <div className="p-10">
      {props.title && (
        <h2
          className="mb-6 text-center text-2xl font-bold"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          {renderEmphasis(props.title)}
        </h2>
      )}
      <div className="grid gap-4 text-center" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {props.stats.map((raw, i) => {
          const { number, label } = parseStat(raw)
          return (
            <div key={i} className="min-w-0">
              <p className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>
                {number}
              </p>
              <p className="mt-1 text-sm opacity-70" style={{ color: 'var(--color-text)' }}>
                {label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

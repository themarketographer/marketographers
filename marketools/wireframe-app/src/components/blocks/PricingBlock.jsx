import { renderEmphasis } from '../../utils/textEmphasis'
import { ctaActionLabel } from '../../utils/blockDisplay'
import { parseRow } from '../../utils/parseRow'

function getTier(props, i) {
  const [name, price] = parseRow(props.tiers[i], 3)
  return { name: name || `[Plan ${i + 1}]`, price: price || '[$X]' }
}

export default function PricingBlock({ props, variant, previewMode }) {
  const isMobile = previewMode === 'mobile'
  const actionLabel = ctaActionLabel(props, 'plan')

  if (variant === 'tabla-comparativa') {
    return (
      <div className="p-10">
        <h2 className="mb-6 text-center text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
          {renderEmphasis(props.title)}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left opacity-60">Características</th>
                {Array.from({ length: props.planCount }).map((_, i) => {
                  const { name, price } = getTier(props, i)
                  const isHighlighted = props.highlightedPlan && i === Math.floor(props.planCount / 2)
                  return (
                    <th
                      key={i}
                      className="p-2 text-center"
                      style={isHighlighted ? { color: 'var(--color-accent)' } : { color: 'var(--color-text)' }}
                    >
                      {name}
                      <div className="text-xs font-normal opacity-70">{price}</div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {props.features.map((feature, fi) => (
                <tr key={fi} className="border-t border-black/10">
                  <td className="p-2 opacity-80" style={{ color: 'var(--color-text)' }}>{feature}</td>
                  {Array.from({ length: props.planCount }).map((_, i) => (
                    <td key={i} className="p-2 text-center" style={{ color: 'var(--color-accent)' }}>✓</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {actionLabel && <p className="mt-2 text-center text-[11px] opacity-60">{actionLabel}</p>}
      </div>
    )
  }

  return (
    <div className="p-10 text-center">
      <h2 className="mb-6 text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
        {renderEmphasis(props.title)}
      </h2>
      {variant === 'rango-precio' ? (
        <div>
          <p className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>
            {getTier(props, 0).price}
          </p>
          {actionLabel && <p className="mt-2 text-[11px] opacity-60">{actionLabel}</p>}
        </div>
      ) : (
        <div className={`flex justify-center gap-4 ${isMobile ? 'flex-col' : 'flex-row'}`}>
          {Array.from({ length: props.planCount }).map((_, i) => {
            const isHighlighted = props.highlightedPlan && i === Math.floor(props.planCount / 2)
            const { name, price } = getTier(props, i)
            return (
              <div
                key={i}
                className="flex-1 border p-5"
                style={{
                  borderColor: isHighlighted ? 'var(--color-accent)' : 'rgba(0,0,0,0.1)',
                  borderWidth: isHighlighted ? 2 : 1,
                  borderRadius: 'var(--radius)',
                }}
              >
                <p className="text-sm font-semibold opacity-70">{name}</p>
                <p className="mt-2 text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                  {price}
                </p>
                <button
                  className="mt-3 w-full px-4 py-2 text-sm font-medium"
                  style={{ background: 'var(--color-accent)', borderRadius: 'var(--radius)', color: 'var(--color-accent-ink)' }}
                >
                  Elegir
                </button>
                {actionLabel && <p className="mt-1 text-[10px] opacity-60">{actionLabel}</p>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

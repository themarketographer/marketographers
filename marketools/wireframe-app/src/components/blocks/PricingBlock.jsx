import { renderEmphasis } from '../../utils/textEmphasis'
import { ctaActionLabel } from '../../utils/blockDisplay'

export default function PricingBlock({ props, variant, previewMode }) {
  const isMobile = previewMode === 'mobile'
  const actionLabel = ctaActionLabel(props, 'plan')

  return (
    <div className="p-10 text-center">
      <h2 className="mb-6 text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
        {renderEmphasis(props.title)}
      </h2>
      {variant === 'rango-precio' ? (
        <div>
          <p className="text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>
            [desde $X]
          </p>
          {actionLabel && <p className="mt-2 text-[11px] opacity-60">{actionLabel}</p>}
        </div>
      ) : (
        <div className={`flex justify-center gap-4 ${isMobile ? 'flex-col' : 'flex-row'}`}>
          {Array.from({ length: props.planCount }).map((_, i) => {
            const isHighlighted = props.highlightedPlan && i === Math.floor(props.planCount / 2)
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
                <p className="text-sm font-semibold opacity-70">[Plan {i + 1}]</p>
                <p className="mt-2 text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                  [$X]
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

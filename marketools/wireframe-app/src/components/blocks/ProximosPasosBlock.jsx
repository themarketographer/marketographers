import { renderEmphasis } from '../../utils/textEmphasis'
import { ctaActionLabel } from '../../utils/blockDisplay'

export default function ProximosPasosBlock({ props, previewMode }) {
  const isMobile = previewMode === 'mobile'
  const actionLabel = ctaActionLabel(props)

  return (
    <div className="p-10 text-center">
      <h2 className="mb-6 text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
        {renderEmphasis(props.title)}
      </h2>
      <div className={`mx-auto flex max-w-2xl gap-4 text-left ${isMobile ? 'flex-col' : 'flex-row'}`}>
        {props.steps.map((step, i) => (
          <div key={i} className="flex-1 border border-black/10 p-4" style={{ borderRadius: 'var(--radius)' }}>
            <div
              className="mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
              style={{ background: 'var(--color-accent)', color: 'var(--color-accent-ink)' }}
            >
              {i + 1}
            </div>
            <p className="text-sm opacity-80" style={{ color: 'var(--color-text)' }}>{renderEmphasis(step)}</p>
          </div>
        ))}
      </div>
      <button
        className="mt-6 px-6 py-3 font-medium"
        style={{ background: 'var(--color-accent)', borderRadius: 'var(--radius)', color: 'var(--color-accent-ink)' }}
      >
        {props.ctaText}
      </button>
      {actionLabel && <p className="mt-1 text-[11px] opacity-60">{actionLabel}</p>}
    </div>
  )
}

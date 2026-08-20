import { renderEmphasis } from '../../utils/textEmphasis'
import { ctaActionLabel } from '../../utils/blockDisplay'

export default function VslBlock({ props }) {
  const actionLabel = ctaActionLabel(props)
  return (
    <div className="p-10 text-center">
      <div
        className="mx-auto flex aspect-video max-w-xl items-center justify-center text-sm opacity-70"
        style={{ background: 'var(--color-primary)', color: 'var(--color-bg)', borderRadius: 'var(--radius)' }}
      >
        [VSL]
      </div>
      <div className="mx-auto mt-4 max-w-xl space-y-1 text-left text-sm opacity-80" style={{ color: 'var(--color-text)' }}>
        <p><strong>0-10s (impacto):</strong> {renderEmphasis(props.impact)}</p>
        <p><strong>10-40s (diagnóstico):</strong> {renderEmphasis(props.diagnosis)}</p>
        <p><strong>40-70s (promesa):</strong> {renderEmphasis(props.promise)}</p>
      </div>
      <button
        className="mt-4 px-6 py-3 font-medium"
        style={{ background: 'var(--color-accent)', borderRadius: 'var(--radius)', color: 'var(--color-accent-ink)' }}
      >
        {props.ctaText}
      </button>
      {actionLabel && <p className="mt-1 text-[11px] opacity-60">{actionLabel}</p>}
    </div>
  )
}

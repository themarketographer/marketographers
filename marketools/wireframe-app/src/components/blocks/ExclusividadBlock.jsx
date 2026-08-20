import { renderEmphasis } from '../../utils/textEmphasis'
import { ctaActionLabel } from '../../utils/blockDisplay'

export default function ExclusividadBlock({ props }) {
  const actionLabel = ctaActionLabel(props)
  return (
    <div className="p-10 text-center">
      <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
        {renderEmphasis(props.title)}
      </h2>
      <p className="mx-auto mt-3 max-w-xl opacity-80" style={{ color: 'var(--color-text)' }}>
        {renderEmphasis(props.body)}
      </p>
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

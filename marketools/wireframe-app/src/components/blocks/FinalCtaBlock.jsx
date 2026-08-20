import { renderEmphasis } from '../../utils/textEmphasis'
import { alignToJustify, ctaActionLabel } from '../../utils/blockDisplay'

export default function FinalCtaBlock({ props }) {
  const actionLabel = ctaActionLabel(props)
  const justify = alignToJustify(props.align)
  const textAlign = props.align === 'center' ? 'text-center' : props.align === 'right' ? 'text-right' : 'text-left'

  return (
    <div className={`p-10 ${textAlign}`} style={{ background: 'var(--color-primary)' }}>
      <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-bg)' }}>
        {renderEmphasis(props.title)}
      </h2>
      <div className={`mt-4 flex ${justify}`}>
        <div>
          <button
            className="px-6 py-3 font-medium"
            style={{ background: 'var(--color-accent)', borderRadius: 'var(--radius)', color: 'var(--color-accent-ink)' }}
          >
            {props.buttonText}
          </button>
          {actionLabel && <p className="mt-1 text-[11px] opacity-60" style={{ color: 'var(--color-bg)' }}>{actionLabel}</p>}
        </div>
      </div>
    </div>
  )
}

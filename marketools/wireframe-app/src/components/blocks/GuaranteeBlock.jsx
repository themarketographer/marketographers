import { renderEmphasis } from '../../utils/textEmphasis'

export default function GuaranteeBlock({ props, previewMode }) {
  const isMobile = previewMode === 'mobile'
  return (
    <div
      className={`flex items-center gap-6 p-10 ${isMobile ? 'flex-col text-center' : ''}`}
      style={{ background: 'var(--app-bg, transparent)' }}
    >
      <div
        className="flex h-16 w-16 shrink-0 items-center justify-center text-2xl"
        style={{ background: 'var(--color-accent)', color: 'var(--color-accent-ink)', borderRadius: 'var(--radius)' }}
      >
        ✓
      </div>
      <div>
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
          {renderEmphasis(props.title)}
        </h2>
        <p className="mt-1 opacity-80" style={{ color: 'var(--color-text)' }}>
          {renderEmphasis(props.body)}
        </p>
      </div>
    </div>
  )
}

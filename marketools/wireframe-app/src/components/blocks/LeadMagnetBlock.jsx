import { renderEmphasis } from '../../utils/textEmphasis'

export default function LeadMagnetBlock({ props, previewMode }) {
  const isMobile = previewMode === 'mobile'
  return (
    <div className="p-10 text-center" style={{ background: 'var(--color-primary)' }}>
      <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-bg)' }}>
        {renderEmphasis(props.title)}
      </h2>
      <p className="mx-auto mt-2 max-w-md opacity-80" style={{ color: 'var(--color-bg)' }}>
        {renderEmphasis(props.body)}
      </p>
      <div className={`mx-auto mt-5 flex max-w-md gap-2 ${isMobile ? 'flex-col' : 'flex-row'}`}>
        <input
          type="email"
          disabled
          placeholder={props.inputPlaceholder}
          className="w-full border px-4 py-2 text-sm"
          style={{ borderRadius: 'var(--radius)', borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.08)', color: 'var(--color-bg)' }}
        />
        <button
          className="shrink-0 px-5 py-2 text-sm font-medium"
          style={{ background: 'var(--color-accent)', borderRadius: 'var(--radius)', color: 'var(--color-accent-ink)' }}
        >
          {props.buttonText}
        </button>
      </div>
    </div>
  )
}

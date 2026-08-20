import { renderEmphasis } from '../../utils/textEmphasis'

export default function AboutBlock({ props, previewMode }) {
  const isMobile = previewMode === 'mobile'

  if (props.photoAsBackground) {
    return (
      <div
        className="flex min-h-[220px] items-end p-8"
        style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius)' }}
      >
        <div className="max-w-lg">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-bg)' }}>
            {renderEmphasis(props.title)}
          </h2>
          <p className="mt-2 opacity-90" style={{ color: 'var(--color-bg)' }}>
            {renderEmphasis(props.bio)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex gap-6 p-10 ${isMobile ? 'flex-col items-start' : 'items-center'}`}>
      <div className="h-24 w-24 shrink-0 rounded-full bg-black/10" />
      <div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
          {renderEmphasis(props.title)}
        </h2>
        <p className="mt-2 opacity-80" style={{ color: 'var(--color-text)' }}>
          {renderEmphasis(props.bio)}
        </p>
      </div>
    </div>
  )
}

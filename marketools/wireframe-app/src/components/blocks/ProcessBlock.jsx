import { renderEmphasis } from '../../utils/textEmphasis'

export default function ProcessBlock({ props, previewMode }) {
  const isMobile = previewMode === 'mobile'
  return (
    <div className="p-10">
      <h2
        className="mb-6 text-center text-2xl font-bold"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
      >
        {renderEmphasis(props.title)}
      </h2>
      <div className={`flex gap-4 ${isMobile ? 'flex-col' : 'flex-row'}`}>
        {props.steps.map((step, i) => (
          <div
            key={i}
            className="flex-1 border border-black/10 p-4"
            style={{ borderRadius: 'var(--radius)' }}
          >
            <div
              className="mb-2 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
              style={{ background: 'var(--color-accent)', color: 'var(--color-accent-ink)' }}
            >
              {i + 1}
            </div>
            <p className="text-sm opacity-80" style={{ color: 'var(--color-text)' }}>
              {renderEmphasis(step)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

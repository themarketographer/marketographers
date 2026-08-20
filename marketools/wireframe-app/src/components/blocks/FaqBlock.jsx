import { renderEmphasis } from '../../utils/textEmphasis'
import { ctaActionLabel } from '../../utils/blockDisplay'

function Accordion({ props }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: props.questionCount }).map((_, i) => (
        <div key={i} className="border border-black/10 p-3" style={{ borderRadius: 'var(--radius)' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
            [Pregunta {i + 1}]
          </p>
          {props.openByDefault && i === 0 && <p className="mt-2 text-sm opacity-70">[Respuesta {i + 1}]</p>}
        </div>
      ))}
    </div>
  )
}

export default function FaqBlock({ props, variant, previewMode }) {
  const isMobile = previewMode === 'mobile'

  if (variant === 'columna-fija') {
    const actionLabel = ctaActionLabel(props)
    return (
      <div className={`flex gap-8 p-10 ${isMobile ? 'flex-col' : 'flex-row'}`}>
        <div
          className={isMobile ? 'w-full' : 'w-64 shrink-0'}
          style={isMobile ? undefined : { position: 'sticky', top: 20, alignSelf: 'flex-start' }}
        >
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
            {renderEmphasis(props.title)}
          </h2>
          <p className="mt-2 text-sm opacity-70" style={{ color: 'var(--color-text)' }}>{renderEmphasis(props.intro)}</p>
          <button
            className="mt-4 px-4 py-2 text-sm font-medium"
            style={{ background: 'var(--color-accent)', borderRadius: 'var(--radius)', color: 'var(--color-accent-ink)' }}
          >
            {props.ctaText}
          </button>
          {actionLabel && <p className="mt-1 text-[10px] opacity-60">{actionLabel}</p>}
        </div>
        <div className="min-w-0 flex-1">
          <Accordion props={props} />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl p-10">
      <h2 className="mb-6 text-center text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
        {renderEmphasis(props.title)}
      </h2>
      <Accordion props={props} />
    </div>
  )
}

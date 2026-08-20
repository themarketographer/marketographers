import { renderEmphasis } from '../../utils/textEmphasis'

export default function FaqBlock({ props }) {
  return (
    <div className="mx-auto max-w-xl p-10">
      <h2 className="mb-6 text-center text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
        {renderEmphasis(props.title)}
      </h2>
      <div className="space-y-2">
        {Array.from({ length: props.questionCount }).map((_, i) => (
          <div key={i} className="border border-black/10 p-3" style={{ borderRadius: 'var(--radius)' }}>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              [Pregunta {i + 1}]
            </p>
            {(props.openByDefault && i === 0) && (
              <p className="mt-2 text-sm opacity-70">[Respuesta {i + 1}]</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

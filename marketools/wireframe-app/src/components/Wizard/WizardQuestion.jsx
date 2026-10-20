import StyleThumb from '../Shared/StyleThumb'
import Icon from '../Shared/Icon'
import { getStyleRef } from '../../data/styleReferences'

// Cada opción entra escalonada (--i × 60ms) cuando cambia la pregunta: la
// pregunta se lee primero y las respuestas llegan detrás, en orden.
export default function WizardQuestion({ question, onAnswer }) {
  if (question.layout === 'styles') return <StyleQuestion question={question} onAnswer={onAnswer} />
  return (
    <div className="mx-auto max-w-lg text-center">
      <h2 className="wf-rise font-display-app text-3xl sm:text-4xl" style={{ color: 'var(--app-ink)' }}>
        {question.question}
      </h2>
      <div className="mt-7 flex flex-col gap-2.5">
        {question.options.map((opt, i) => (
          <button
            key={opt.value}
            onClick={() => onAnswer(opt.value)}
            className="wf-option wf-rise group flex items-center justify-between rounded-2xl border px-5 py-4 text-left text-[15px] font-medium"
            style={{ '--i': i + 1 }}
          >
            {opt.label}
            <Icon name="chevron" size={16} className="wf-option-arrow" />
          </button>
        ))}
      </div>
    </div>
  )
}

function StyleQuestion({ question, onAnswer }) {
  return (
    <div className="mx-auto max-w-6xl text-center">
      <h2 className="wf-rise font-display-app text-3xl sm:text-4xl" style={{ color: 'var(--app-ink)' }}>
        {question.question}
      </h2>
      {question.hint && (
        <p className="wf-rise mx-auto mt-3 max-w-md text-sm" style={{ color: 'var(--app-muted)', '--i': 1 }}>
          {question.hint}
        </p>
      )}
      <div className="mt-8 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
        {question.options.map((opt, i) => {
          const ref = getStyleRef(opt.value)
          return (
            <button
              key={opt.value}
              onClick={() => onAnswer(opt.value)}
              className="wf-style-card wf-rise"
              style={{ '--i': i + 2 }}
            >
              <StyleThumb styleId={opt.value} />
              <span className="mt-3.5 block px-1 text-[15px] font-semibold" style={{ color: 'var(--app-ink)' }}>
                {opt.label}
              </span>
              <span className="mt-1 block px-1 text-xs leading-relaxed" style={{ color: 'var(--app-muted)' }}>
                {ref ? ref.tagline : 'Canvas vacío. Arrastras los bloques que quieras desde la izquierda.'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

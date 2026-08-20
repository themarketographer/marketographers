import { useBuilder } from '../../state/BuilderContext'
import { WIZARD_QUESTIONS } from '../../data/wizardQuestions'
import WizardQuestion from './WizardQuestion'

export default function Wizard() {
  const { state, dispatch } = useBuilder()
  const { step } = state.wizard
  const question = WIZARD_QUESTIONS[step]

  function handleAnswer(value) {
    dispatch({ type: 'WIZARD_ANSWER', question: question.key, value })
    if (step === WIZARD_QUESTIONS.length - 1) {
      dispatch({ type: 'WIZARD_RESOLVE' })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6" style={{ background: 'var(--app-bg)' }}>
      <div className="w-full">
        <p className="mb-1 text-center text-xs font-semibold" style={{ color: 'var(--app-accent-ink)' }}>
          <span className="rounded-full px-2.5 py-0.5" style={{ background: 'var(--app-accent)' }}>
            Pregunta {step + 1} de {WIZARD_QUESTIONS.length}
          </span>
        </p>
        <div className="mt-6">
          <WizardQuestion question={question} onAnswer={handleAnswer} />
        </div>
      </div>
    </div>
  )
}

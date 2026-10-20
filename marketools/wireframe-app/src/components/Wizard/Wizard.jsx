import { useBuilder } from '../../state/BuilderContext'
import { WIZARD_QUESTIONS } from '../../data/wizardQuestions'
import WizardQuestion from './WizardQuestion'
import BrandMark from '../Brand/BrandMark'
import ThemeToggle from '../Brand/ThemeToggle'
import CommunityNotice from '../Brand/CommunityNotice'
import Icon from '../Shared/Icon'

export default function Wizard({ theme, onToggleTheme }) {
  const { state, dispatch } = useBuilder()
  const { step } = state.wizard
  const question = WIZARD_QUESTIONS[step]
  const total = WIZARD_QUESTIONS.length

  function handleAnswer(value) {
    dispatch({ type: 'WIZARD_ANSWER', question: question.key, value })
    if (step === total - 1) {
      dispatch({ type: 'WIZARD_RESOLVE' })
    }
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--app-bg)' }}>
      <header className="flex items-center justify-between px-5 py-4">
        <BrandMark theme={theme} size={32} />
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </header>
      <CommunityNotice />
      <main className="flex flex-1 items-center justify-center px-6 pb-16 pt-8">
        <div className="w-full">
          <div className="mx-auto flex max-w-lg items-center justify-center gap-4">
            <button
              onClick={() => dispatch({ type: 'WIZARD_BACK' })}
              className="wf-ghost-btn"
              style={{ visibility: step > 0 ? 'visible' : 'hidden' }}
              aria-label="Volver a la pregunta anterior"
            >
              <Icon name="arrowLeft" size={15} />
              Atrás
            </button>
            <div className="flex flex-col items-center gap-2.5">
              <p className="text-[13px] font-medium tabular-nums" style={{ color: 'var(--app-muted)' }}>
                Pregunta {step + 1} de {total}
              </p>
              <div className="flex gap-1.5" aria-hidden="true">
                {WIZARD_QUESTIONS.map((q, i) => (
                  <span key={q.key} className="wf-step-track">
                    <span className="wf-step-fill" style={{ transform: `scaleX(${i <= step ? 1 : 0})` }} />
                  </span>
                ))}
              </div>
            </div>
            <span className="wf-ghost-btn" style={{ visibility: 'hidden' }} aria-hidden="true">
              <Icon name="arrowLeft" size={15} />
              Atrás
            </span>
          </div>
          {/* key = step: cada pregunta monta de nuevo y vuelve a correr su entrada */}
          <div className="mt-10" key={step}>
            <WizardQuestion question={question} onAnswer={handleAnswer} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default function WizardQuestion({ question, onAnswer }) {
  return (
    <div className="mx-auto max-w-lg text-center">
      <h2 className="font-display-app text-3xl sm:text-4xl" style={{ color: 'var(--app-ink)' }}>
        {question.question}
      </h2>
      <div className="mt-6 flex flex-col gap-3">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onAnswer(opt.value)}
            className="mk-press rounded-2xl border px-5 py-3.5 text-left text-sm font-medium"
            style={{ borderColor: 'var(--app-border)', background: 'var(--app-surface)', color: 'var(--app-ink)' }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function WizardQuestion({ question, onAnswer }) {
  return (
    <div className="mx-auto max-w-lg text-center">
      <h2 className="font-heading-app text-2xl font-extrabold tracking-tight" style={{ color: 'var(--app-ink)' }}>
        {question.question}
      </h2>
      <div className="mt-6 flex flex-col gap-3">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onAnswer(opt.value)}
            className="rounded-2xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors"
            style={{ borderColor: 'var(--app-border)', color: 'var(--app-ink)' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--app-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--app-border)')}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

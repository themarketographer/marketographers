export default function ButtonGroupField({ field, value, onChange, options }) {
  const opts = options ?? field.options

  return (
    <div className="text-xs">
      <span className="mb-1 block font-medium text-neutral-600">{field.label}</span>
      <div className="flex flex-wrap gap-1.5">
        {opts.map((opt) => {
          const optValue = typeof opt === 'string' ? opt : opt.value
          const optLabel = typeof opt === 'string' ? opt : opt.label
          const active = value === optValue
          return (
            <button
              key={optValue}
              type="button"
              onClick={() => onChange(optValue)}
              className="rounded-full border px-3 py-1.5 font-medium transition-colors"
              style={
                active
                  ? { background: 'var(--app-accent)', borderColor: 'var(--app-accent)', color: 'var(--app-accent-ink)' }
                  : { background: '#fff', borderColor: 'var(--app-border)', color: 'var(--app-ink)' }
              }
            >
              {optLabel}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function RepeatableListField({ field, value, onChange }) {
  function move(i, delta) {
    const j = i + delta
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div className="text-xs">
      <span className="mb-1 block font-medium text-neutral-600">{field.label}</span>
      <div className="space-y-1.5">
        {value.map((item, i) => (
          <div key={i} className="flex items-center gap-1">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const next = [...value]
                next[i] = e.target.value
                onChange(next)
              }}
              placeholder={field.placeholder ?? `Item ${i + 1}`}
              className="w-full rounded border border-black/15 px-2 py-1.5 text-sm"
            />
            <button
              type="button"
              onClick={() => move(i, -1)}
              disabled={i === 0}
              aria-label="Mover arriba"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded border text-xs disabled:opacity-30"
              style={{ borderColor: 'var(--app-border)' }}
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              disabled={i === value.length - 1}
              aria-label="Mover abajo"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded border text-xs disabled:opacity-30"
              style={{ borderColor: 'var(--app-border)' }}
            >
              ↓
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

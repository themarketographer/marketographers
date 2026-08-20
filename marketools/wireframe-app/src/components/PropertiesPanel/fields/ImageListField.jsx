// Lista de imágenes (una por pieza de portafolio, logo, foto de testimonio,
// etc.), cada una con su link + preview, y flechas ↑↓ para reordenar — el
// orden acá es el mismo orden en que se listan en el export.
export default function ImageListField({ field, value, onChange }) {
  function setAt(i, url) {
    const next = [...value]
    next[i] = url
    onChange(next)
  }

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
      <div className="space-y-2">
        {value.map((url, i) => (
          <div key={i} className="rounded border border-black/10 p-2">
            <div className="flex items-center gap-1">
              <span className="w-4 shrink-0 text-center font-semibold" style={{ color: 'var(--app-muted)' }}>
                {i + 1}
              </span>
              <input
                type="text"
                value={url}
                onChange={(e) => setAt(i, e.target.value)}
                placeholder="Link de Cloudinary"
                className="w-full rounded border border-black/15 px-2 py-1 text-xs"
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
            {url ? (
              <img
                src={url}
                alt=""
                className="mt-1.5 h-16 w-full rounded object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div className="mt-1.5 flex h-16 w-full items-center justify-center rounded border border-dashed border-black/15 text-[10px] text-neutral-400">
                Sin imagen todavía
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Campo de una sola imagen: un input de texto para pegar el link (pensado
// para Cloudinary, pero funciona con cualquier URL pública) + una
// previsualización real de esa imagen debajo, para ver cómo va a quedar
// sin tener que exportar primero.
export default function ImageField({ field, value, onChange }) {
  return (
    <label className="block text-xs">
      <span className="mb-1 block font-medium text-neutral-600">{field.label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder ?? 'Pegá el link de Cloudinary (o cualquier URL de imagen)'}
        className="w-full rounded border border-black/15 px-2 py-1.5 text-sm focus:border-[var(--app-accent)] focus:outline-none"
      />
      {value ? (
        <img
          src={value}
          alt=""
          className="mt-2 h-24 w-full rounded border border-black/10 object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      ) : (
        <div className="mt-2 flex h-24 w-full items-center justify-center rounded border border-dashed border-black/15 text-[10px] text-neutral-400">
          Sin imagen todavía
        </div>
      )}
    </label>
  )
}

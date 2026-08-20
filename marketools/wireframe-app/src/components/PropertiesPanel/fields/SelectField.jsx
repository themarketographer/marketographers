export default function SelectField({ field, value, onChange, options }) {
  const opts = options ?? field.options
  return (
    <label className="block text-xs">
      <span className="mb-1 block font-medium text-neutral-600">{field.label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-black/15 px-2 py-1.5 text-sm"
      >
        {opts.map((opt) =>
          typeof opt === 'string' ? (
            <option key={opt} value={opt}>{opt}</option>
          ) : (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ),
        )}
      </select>
    </label>
  )
}

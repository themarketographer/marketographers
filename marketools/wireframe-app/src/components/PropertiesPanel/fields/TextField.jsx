export default function TextField({ field, value, onChange }) {
  return (
    <label className="block text-xs">
      <span className="mb-1 block font-medium text-[var(--app-muted)]">{field.label}</span>
      <input
        type="text"
        value={value}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-[var(--app-border)] px-2 py-1.5 text-sm focus:border-[var(--app-accent)] focus:outline-none"
      />
    </label>
  )
}

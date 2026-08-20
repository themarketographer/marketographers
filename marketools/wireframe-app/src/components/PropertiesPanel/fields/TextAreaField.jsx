export default function TextAreaField({ field, value, onChange }) {
  return (
    <label className="block text-xs">
      <span className="mb-1 block font-medium text-neutral-600">{field.label}</span>
      <textarea
        value={value}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded border border-black/15 px-2 py-1.5 text-sm focus:border-[var(--app-accent)] focus:outline-none"
      />
    </label>
  )
}

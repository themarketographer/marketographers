export default function SliderField({ field, value, onChange }) {
  return (
    <label className="block text-xs">
      <span className="mb-1 flex items-center justify-between font-medium text-neutral-600">
        {field.label}
        <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: 'var(--app-bg)', color: 'var(--app-ink)' }}>
          {value}
        </span>
      </span>
      <input
        type="range"
        min={field.min}
        max={field.max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--app-accent)]"
      />
    </label>
  )
}

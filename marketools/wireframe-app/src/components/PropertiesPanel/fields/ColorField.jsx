export default function ColorField({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between text-xs">
      <span className="font-medium text-[var(--app-muted)]">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-10 cursor-pointer rounded border border-[var(--app-border)]"
      />
    </label>
  )
}

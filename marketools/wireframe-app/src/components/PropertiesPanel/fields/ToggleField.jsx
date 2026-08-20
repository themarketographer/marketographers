export default function ToggleField({ field, value, onChange }) {
  return (
    <label className="flex items-center justify-between text-xs">
      <span className="font-medium text-neutral-600">{field.label}</span>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
    </label>
  )
}

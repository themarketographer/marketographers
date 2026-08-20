export default function ColorField({ label, value, onChange }) {
  return (
    <label className="flex items-center justify-between text-xs">
      <span className="font-medium text-neutral-600">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-10 cursor-pointer rounded border border-black/15"
      />
    </label>
  )
}

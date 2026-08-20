import { THEME_PRESETS } from '../../data/themePresets'
import { useBuilder } from '../../state/BuilderContext'

export default function ThemePresetPicker() {
  const { state, dispatch } = useBuilder()

  return (
    <div className="grid grid-cols-2 gap-2">
      {THEME_PRESETS.map((preset) => (
        <button
          key={preset.id}
          onClick={() => dispatch({ type: 'THEME_APPLY_PRESET', presetId: preset.id })}
          className={`rounded-lg border p-2 text-left text-xs font-medium ${
            state.theme.presetId === preset.id ? 'border-blue-500' : 'border-black/15'
          }`}
          style={{ background: preset.backgroundColor, color: preset.textColor }}
        >
          <span className="block h-3 w-3 rounded-full" style={{ background: preset.accentColor }} />
          <span className="mt-1 block">{preset.label}</span>
        </button>
      ))}
    </div>
  )
}

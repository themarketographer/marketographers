import { THEME_PRESETS } from '../../data/themePresets'
import { useBuilder } from '../../state/BuilderContext'
import Icon from '../Shared/Icon'

// Los estilos de referencia (Graphica, Marketographers) van arriba y grandes:
// aplican colores y tipografías del sitio real y activan sus detalles en el
// lienzo. Abajo, los presets genéricos de siempre, más chicos.
export default function ThemePresetPicker() {
  const { state, dispatch } = useBuilder()
  const refs = THEME_PRESETS.filter((p) => p.styleId)
  const generic = THEME_PRESETS.filter((p) => !p.styleId)

  function apply(id) {
    dispatch({ type: 'THEME_APPLY_PRESET', presetId: id })
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {refs.map((p) => {
          const active = state.theme.presetId === p.id
          return (
            <button key={p.id} onClick={() => apply(p.id)} className={`wf-preset wf-preset--ref ${active ? 'is-active' : ''}`} style={{ background: p.backgroundColor, color: p.textColor }}>
              <span className="flex gap-1">
                {[p.primaryColor, p.accentColor].map((c) => (
                  <i key={c} style={{ background: c }} />
                ))}
              </span>
              <span className="mt-3 block text-[13px] leading-tight" style={{ fontFamily: p.headingFont, fontWeight: p.styleId === 'marketographers' ? 400 : 700 }}>
                {p.label}
              </span>
              {active && <Icon name="check" size={13} strokeWidth={2.6} className="wf-preset-check" />}
            </button>
          )
        })}
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {generic.map((p) => {
          const active = state.theme.presetId === p.id
          return (
            <button key={p.id} onClick={() => apply(p.id)} className={`wf-preset ${active ? 'is-active' : ''}`} style={{ background: p.backgroundColor, color: p.textColor }}>
              <i style={{ background: p.accentColor }} />
              <span className="mt-1.5 block text-[11px] font-medium">{p.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

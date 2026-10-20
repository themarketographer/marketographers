import { useBuilder } from '../../state/BuilderContext'
import ThemePresetPicker from './ThemePresetPicker'
import ColorField from '../PropertiesPanel/fields/ColorField'
import SelectField from '../PropertiesPanel/fields/SelectField'
import ButtonGroupField from '../PropertiesPanel/fields/ButtonGroupField'
import { FONT_OPTIONS } from '../../data/fontOptions'
import { RADIUS_OPTIONS, FONT_SCALE_OPTIONS, ACCENT_TEXT_OPTIONS } from '../../data/themePresets'

export default function ThemePanel() {
  const { state, dispatch } = useBuilder()
  const { theme } = state

  function setField(field, value) {
    dispatch({ type: 'THEME_SET_FIELD', field, value })
  }

  return (
    <aside className="wf-panel space-y-5">
      <div>
        <h3 className="font-display-app text-2xl leading-tight" style={{ color: 'var(--app-ink)' }}>Estilo</h3>
        <p className="mt-1 text-[11px]" style={{ color: 'var(--app-muted)' }}>Colores y tipografías de toda la página.</p>
      </div>
      <ThemePresetPicker />

      <div className="space-y-2 border-t border-[var(--app-border)] pt-3">
        <SelectField
          field={{ label: 'Tipografía título' }}
          value={theme.headingFont}
          options={FONT_OPTIONS}
          onChange={(v) => setField('headingFont', v)}
        />
        <SelectField
          field={{ label: 'Tipografía cuerpo' }}
          value={theme.bodyFont}
          options={FONT_OPTIONS}
          onChange={(v) => setField('bodyFont', v)}
        />
        <ColorField label="Color primario" value={theme.primaryColor} onChange={(v) => setField('primaryColor', v)} />
        <ColorField
          label="Texto sobre el primario"
          value={theme.primaryTextColor ?? theme.backgroundColor}
          onChange={(v) => setField('primaryTextColor', v)}
        />
        <ColorField label="Color de fondo" value={theme.backgroundColor} onChange={(v) => setField('backgroundColor', v)} />
        <ColorField label="Color de texto" value={theme.textColor} onChange={(v) => setField('textColor', v)} />
        <div className="space-y-2 rounded-lg p-2" style={{ background: `${theme.accentColor}1a` }}>
          <ColorField label="Color de acento" value={theme.accentColor} onChange={(v) => setField('accentColor', v)} />
          <p className="text-[10px] text-[var(--app-muted)]">
            Se usa en botones, links y detalles clave — no lo guardes solo para el CTA final.
          </p>
          <ButtonGroupField
            field={{ label: 'Color de texto sobre el acento' }}
            value={theme.accentTextColor}
            options={ACCENT_TEXT_OPTIONS}
            onChange={(v) => setField('accentTextColor', v)}
          />
          <p className="text-[10px] text-[var(--app-muted)]">
            Elige oscuro si tu color de acento es claro (amarillo, verde lima) para que el texto de los botones se siga leyendo.
          </p>
        </div>
        <ButtonGroupField
          field={{ label: 'Radio de bordes' }}
          value={theme.radius}
          options={RADIUS_OPTIONS}
          onChange={(v) => setField('radius', v)}
        />
        <ButtonGroupField
          field={{ label: 'Tamaño de texto' }}
          value={theme.fontScale}
          options={FONT_SCALE_OPTIONS}
          onChange={(v) => setField('fontScale', v)}
        />
        <div className="rounded-lg border p-3" style={{ borderColor: 'var(--app-border)' }}>
          <p className="text-xs font-medium" style={{ color: 'var(--app-ink)' }}>
            Palabras clave con estilo propio
          </p>
          <p className="mt-1 text-[11px]" style={{ color: 'var(--app-muted)' }}>
            En cualquier campo de texto, envuelve una palabra o frase así:
          </p>
          <p className="mt-1 text-[11px]">
            <code className="rounded bg-[var(--app-hover)] px-1 py-0.5 kw-elegant">~~elegante~~</code>
            {' '}→ tipografía de título en itálica.
          </p>
          <p className="mt-1 text-[11px]">
            <code className="rounded bg-[var(--app-hover)] px-1 py-0.5 kw-glow">^^glow^^</code>
            {' '}→ resplandor en el color de acento.
          </p>
          <p className="mt-1 text-[11px]" style={{ color: 'var(--app-muted)' }}>
            Los dos se pueden usar juntos, incluso en el mismo texto.
          </p>
        </div>
      </div>
    </aside>
  )
}

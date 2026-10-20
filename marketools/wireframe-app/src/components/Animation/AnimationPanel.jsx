import { useBuilder } from '../../state/BuilderContext'
import { BLOCK_SCHEMA } from '../../data/blockSchema'
import { ANIMATION_OPTIONS } from '../../data/animationOptions'
import { getAnimationSuggestion } from '../../data/animationSuggestions'
import ButtonGroupField from '../PropertiesPanel/fields/ButtonGroupField'
import PanelEmpty from '../Shared/PanelEmpty'
import Icon from '../Shared/Icon'

// 'auto' no es una animación CSS concreta (es una sugerencia en prosa por
// bloque), así que el preview en vivo usa fade-up como aproximación — es la
// familia base que ya usan casi todas las sugerencias de animationSuggestions.js.
const AUTO_PREVIEW_TYPE = 'fade-up'

export default function AnimationPanel({ blockId }) {
  const { state, dispatch } = useBuilder()
  const block = state.canvas.blocks.find((b) => b.id === blockId)

  if (!block) {
    return <PanelEmpty title="Elige un bloque para animarlo" body="Cada sección trae una animación sugerida. Aquí la cambias y la pruebas en vivo." />
  }

  const schema = BLOCK_SCHEMA[block.type]
  const current = block.animationOverride ?? 'auto'

  function handlePlay() {
    const el = document.querySelector(`[data-block-id="${block.id}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    dispatch({ type: 'ANIMATION_PREVIEW_CLEAR' })
    // El re-trigger necesita un frame libre: si ya estaba corriendo la misma
    // animación, despachar el mismo tipo de nuevo no reinicia el CSS.
    requestAnimationFrame(() => {
      dispatch({ type: 'ANIMATION_PREVIEW_PLAY', blockId: block.id, animationType: current === 'auto' ? (state.theme.styleId ? `style-${state.theme.styleId}` : AUTO_PREVIEW_TYPE) : current })
    })
  }

  return (
    <aside key={block.id} className="wf-panel wf-panel-swap space-y-5">
      <h3 className="font-display-app text-2xl leading-tight" style={{ color: 'var(--app-ink)' }}>{schema.label}</h3>

      <ButtonGroupField
        field={{ label: 'Animación de entrada' }}
        value={current}
        options={ANIMATION_OPTIONS}
        onChange={(value) =>
          dispatch({ type: 'BLOCK_SET_ANIMATION_OVERRIDE', blockId: block.id, animation: value === 'auto' ? null : value })
        }
      />

      <button
        onClick={handlePlay}
        className="wf-btn-primary w-full"
      >
        <Icon name="play" size={13} />
        Probar en el lienzo
      </button>

      <div className="wf-note">
        <p className="mb-1 font-medium" style={{ color: 'var(--app-ink)' }}>
          {current !== 'auto' ? 'Se va a usar esta animación' : block.refAnimation ? 'Así se mueve en la landing de referencia' : 'Sugerencia para este bloque'}
        </p>
        <p>
          {current !== 'auto'
            ? ANIMATION_OPTIONS.find((o) => o.value === current)?.label
            : block.refAnimation ?? getAnimationSuggestion(block.type)}
        </p>
        {current === 'auto' && (
          <p className="mt-2 opacity-80">La prueba en el lienzo muestra la entrada; el prompt exportado le pasa a tu IA la descripción completa.</p>
        )}
      </div>
    </aside>
  )
}

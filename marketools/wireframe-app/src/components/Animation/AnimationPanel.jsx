import { useBuilder } from '../../state/BuilderContext'
import { BLOCK_SCHEMA } from '../../data/blockSchema'
import { ANIMATION_OPTIONS } from '../../data/animationOptions'
import { getAnimationSuggestion } from '../../data/animationSuggestions'
import ButtonGroupField from '../PropertiesPanel/fields/ButtonGroupField'

// 'auto' no es una animación CSS concreta (es una sugerencia en prosa por
// bloque), así que el preview en vivo usa fade-up como aproximación — es la
// familia base que ya usan casi todas las sugerencias de animationSuggestions.js.
const AUTO_PREVIEW_TYPE = 'fade-up'

export default function AnimationPanel({ blockId }) {
  const { state, dispatch } = useBuilder()
  const block = state.canvas.blocks.find((b) => b.id === blockId)

  if (!block) {
    return (
      <aside className="w-72 min-h-0 flex-1 border-l border-black/10 bg-neutral-50 p-4 text-sm text-neutral-400">
        Seleccioná un bloque del canvas para elegir su animación.
      </aside>
    )
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
      dispatch({ type: 'ANIMATION_PREVIEW_PLAY', blockId: block.id, animationType: current === 'auto' ? AUTO_PREVIEW_TYPE : current })
    })
  }

  return (
    <aside className="w-72 min-h-0 flex-1 space-y-4 overflow-y-auto border-l border-black/10 bg-neutral-50 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{schema.label} — Animación</h3>

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
        className="flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
        style={{ background: 'var(--app-accent)', color: 'var(--app-accent-ink)' }}
      >
        ▶ Reproducir preview
      </button>

      <div className="rounded-lg p-3 text-xs" style={{ background: 'var(--app-bg)', color: 'var(--app-muted)' }}>
        <p className="mb-1 font-medium" style={{ color: 'var(--app-ink)' }}>
          {current === 'auto' ? 'Sugerencia automática para este bloque:' : 'Se va a usar esta animación:'}
        </p>
        <p>{current === 'auto' ? getAnimationSuggestion(block.type) : ANIMATION_OPTIONS.find((o) => o.value === current)?.label}</p>
        {current === 'auto' && (
          <p className="mt-1 italic">El preview usa "aparece desde abajo" como aproximación de la sugerencia.</p>
        )}
      </div>
    </aside>
  )
}

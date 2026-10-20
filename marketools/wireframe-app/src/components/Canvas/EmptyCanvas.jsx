import { useBuilder } from '../../state/BuilderContext'
import { STYLE_REFS } from '../../data/styleReferences'
import StyleThumb from '../Shared/StyleThumb'
import Icon from '../Shared/Icon'

// Lienzo vacío: en vez de una frase y un botón, tres puntos de partida
// concretos. Los dos estilos cargan la landing completa armada; el tercero
// carga el borrador mínimo que corresponde al embudo del wizard.
export default function EmptyCanvas({ funnelId }) {
  const { dispatch } = useBuilder()
  const hasFunnelDraft = [2, 3, 4, 5].includes(funnelId)

  return (
    <div className="flex flex-col items-center px-10 py-16 text-center" style={{ color: 'var(--color-text)' }}>
      <p className="wf-rise text-2xl font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
        Elige por dónde empezar
      </p>
      <p className="wf-rise mt-2 max-w-md text-sm opacity-70" style={{ '--i': 1 }}>
        Carga una landing armada y la cambias a tu gusto, o arrastra bloques desde la izquierda.
      </p>
      <div className="mt-8 grid w-full max-w-3xl gap-4 text-left sm:grid-cols-3">
        {Object.values(STYLE_REFS).map((ref, i) => (
          <button
            key={ref.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              dispatch({ type: 'CANVAS_LOAD_STYLE', styleId: ref.id })
            }}
            className="wf-style-card wf-style-card--canvas wf-rise"
            style={{ '--i': i + 2 }}
          >
            <StyleThumb styleId={ref.id} />
            <span className="mt-3 block px-1 text-sm font-semibold">Estilo {ref.label}</span>
            <span className="mt-0.5 block px-1 text-xs opacity-60">{ref.draft.length} secciones con sus animaciones</span>
          </button>
        ))}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            dispatch({ type: 'CANVAS_LOAD_FUNNEL_DRAFT' })
          }}
          className="wf-style-card wf-style-card--canvas wf-rise"
          style={{ '--i': 4 }}
        >
          <StyleThumb styleId={null} />
          <span className="mt-3 block px-1 text-sm font-semibold">
            {hasFunnelDraft ? 'Borrador de tu embudo' : 'Borrador simple'}
          </span>
          <span className="mt-0.5 block px-1 text-xs opacity-60">Solo la estructura, con el estilo que ya tienes</span>
        </button>
      </div>
      <p className="wf-rise mt-8 flex items-center gap-2 text-xs opacity-50" style={{ '--i': 5 }}>
        <Icon name="pointer" size={12} />
        Tip: Supr borra el bloque elegido y Ctrl + D lo duplica
      </p>
    </div>
  )
}

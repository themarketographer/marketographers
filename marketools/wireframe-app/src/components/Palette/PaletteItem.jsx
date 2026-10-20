import { useBuilder } from '../../state/BuilderContext'
import BlockGlyph from './BlockGlyph'
import Icon from '../Shared/Icon'

// Fila de la paleta: miniatura + nombre. Se arrastra al canvas para soltar el
// bloque en un lugar exacto, o se toca/clica para agregarlo al final (más
// rápido y funciona igual en pantallas táctiles, donde el drag nativo no).
export default function PaletteItem({ type, label, index }) {
  const { dispatch } = useBuilder()

  return (
    <div
      role="button"
      tabIndex={0}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('application/x-block-type', type)
        e.dataTransfer.effectAllowed = 'copy'
        dispatch({ type: 'DND_START_PALETTE', blockType: type })
      }}
      onDragEnd={() => dispatch({ type: 'DND_END' })}
      onClick={() => dispatch({ type: 'BLOCK_ADD', blockType: type })}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          dispatch({ type: 'BLOCK_ADD', blockType: type })
        }
      }}
      title={`Arrastra o haz clic para agregar ${label}`}
      className="wf-pal-item"
      style={{ '--i': index }}
    >
      <BlockGlyph type={type} />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className="wf-pal-add" aria-hidden="true">
        <Icon name="plus" size={14} strokeWidth={2.2} />
      </span>
    </div>
  )
}

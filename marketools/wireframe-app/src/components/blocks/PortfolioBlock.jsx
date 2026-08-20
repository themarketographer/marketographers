import { renderEmphasis } from '../../utils/textEmphasis'
import ImageOrPlaceholder from './ImageOrPlaceholder'

export default function PortfolioBlock({ props, variant, previewMode }) {
  const isMobile = previewMode === 'mobile'
  const pieces = Array.from({ length: props.pieceCount })
  const columns = isMobile ? 2 : 3

  return (
    <div className="p-10">
      <h2
        className="mb-6 text-center text-2xl font-bold"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
      >
        {renderEmphasis(props.title)}
      </h2>
      {variant === 'carrusel' ? (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {pieces.map((_, i) => (
            <ImageOrPlaceholder
              key={i}
              url={props.pieces[i]}
              alt={`Pieza ${i + 1} del portafolio`}
              className="h-32 w-48 shrink-0"
              style={{ borderRadius: 'var(--radius)' }}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {pieces.map((_, i) => (
            <ImageOrPlaceholder
              key={i}
              url={props.pieces[i]}
              alt={`Pieza ${i + 1} del portafolio`}
              className="aspect-square min-w-0"
              style={{ borderRadius: 'var(--radius)' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

import { renderEmphasis } from '../../utils/textEmphasis'
import ImageOrPlaceholder from './ImageOrPlaceholder'

export default function TestimonialsBlock({ props, variant, previewMode }) {
  const isMobile = previewMode === 'mobile'
  const items = Array.from({ length: props.count })
  const columns = isMobile ? 1 : 3

  if (variant === 'embed-widget') {
    return (
      <div className="p-10">
        <h2
          className="mb-6 text-center text-2xl font-bold"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          {renderEmphasis(props.title)}
        </h2>
        <div
          className="mx-auto flex h-40 max-w-lg items-center justify-center border border-dashed text-sm opacity-60"
          style={{ borderRadius: 'var(--radius)', borderColor: 'var(--color-text)', color: 'var(--color-text)' }}
        >
          [widget: {props.embedCode || 'sin ID/código todavía'}]
        </div>
      </div>
    )
  }

  return (
    <div className="p-10">
      <h2
        className="mb-6 text-center text-2xl font-bold"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
      >
        {renderEmphasis(props.title)}
      </h2>
      <div className={variant === 'carrusel-flechas' ? 'flex items-center gap-2' : 'grid gap-4'} style={variant === 'carrusel-flechas' ? undefined : { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {variant === 'carrusel-flechas' && <span className="shrink-0 opacity-50">&larr;</span>}
        <div className={variant === 'carrusel-flechas' ? 'flex min-w-0 flex-1 gap-3 overflow-x-auto' : 'contents'}>
          {items.map((_, i) => (
            <div
              key={i}
              className="min-w-0 shrink-0 border border-black/10 p-4"
              style={{ borderRadius: 'var(--radius)', width: variant === 'carrusel-flechas' ? 240 : '100%' }}
            >
              {props.showPhoto && (
                <ImageOrPlaceholder
                  url={props.photos[i]}
                  alt={`Foto del testimonio ${i + 1}`}
                  className="mb-2 h-10 w-10 rounded-full"
                />
              )}
              <p className="text-sm opacity-80" style={{ color: 'var(--color-text)' }}>
                {renderEmphasis(`[Testimonio ${i + 1}]`)}
              </p>
            </div>
          ))}
        </div>
        {variant === 'carrusel-flechas' && <span className="shrink-0 opacity-50">&rarr;</span>}
      </div>
    </div>
  )
}

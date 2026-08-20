import { renderEmphasis } from '../../utils/textEmphasis'
import { alignToJustify, ctaActionLabel } from '../../utils/blockDisplay'

export default function HeroBlock({ props, variant, previewMode }) {
  const isMobile = previewMode === 'mobile'
  const reversed = !isMobile && variant === 'texto-derecha'
  const imageFirst = isMobile && props.mobileImagePosition === 'top'
  const actionLabel = ctaActionLabel(props)

  const textCol = (
    <div className={isMobile ? 'w-full space-y-4' : 'flex-1 space-y-4'}>
      <h1
        className={isMobile ? 'text-3xl font-bold' : 'text-4xl font-bold'}
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
      >
        {renderEmphasis(props.title)}
      </h1>
      <p className="text-lg opacity-80" style={{ color: 'var(--color-text)' }}>
        {renderEmphasis(props.subtitle)}
      </p>
      <div className={`flex ${alignToJustify(props.ctaAlign)}`}>
        <div>
          <button
            className="px-6 py-3 font-medium"
            style={{ background: 'var(--color-accent)', borderRadius: 'var(--radius)', color: 'var(--color-accent-ink)' }}
          >
            {props.ctaText}
          </button>
          {actionLabel && <p className="mt-1 text-[11px] opacity-60">{actionLabel}</p>}
        </div>
      </div>
      <p className="text-xs opacity-50">
        Fondo: {props.bgType} · oscurecido {props.bgDarken}%
      </p>
    </div>
  )

  const imageCol = (
    <div
      className={`flex h-48 items-center justify-center text-sm opacity-60 ${isMobile ? 'w-full' : 'flex-1'}`}
      style={{ background: 'var(--color-primary)', color: 'var(--color-bg)', borderRadius: 'var(--radius)' }}
    >
      [fondo {props.bgType}]
    </div>
  )

  return (
    <div
      className={`flex min-h-[320px] items-center gap-8 p-10 ${
        isMobile ? 'flex-col' : reversed ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {isMobile ? (
        <>
          {imageFirst ? imageCol : textCol}
          {imageFirst ? textCol : imageCol}
        </>
      ) : (
        <>
          {textCol}
          {imageCol}
        </>
      )}
    </div>
  )
}

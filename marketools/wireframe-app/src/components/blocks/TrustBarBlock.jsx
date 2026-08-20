import ImageOrPlaceholder from './ImageOrPlaceholder'

export default function TrustBarBlock({ props, previewMode }) {
  const isMobile = previewMode === 'mobile'
  const logos = Array.from({ length: props.logoCount })

  return (
    <div className="px-10 py-8 text-center">
      {props.caption && (
        <p className="mb-4 text-xs font-medium uppercase tracking-wide opacity-60" style={{ color: 'var(--color-text)' }}>
          {props.caption}
        </p>
      )}
      <div className={`flex items-center justify-center gap-8 ${isMobile ? 'flex-wrap' : 'flex-nowrap'}`}>
        {logos.map((_, i) => (
          <ImageOrPlaceholder key={i} url={props.logos[i]} alt={`Logo ${i + 1}`} className="h-8 w-24 shrink-0 rounded" />
        ))}
      </div>
    </div>
  )
}

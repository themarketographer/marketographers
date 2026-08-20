import { renderEmphasis } from '../../utils/textEmphasis'
import ImageOrPlaceholder from './ImageOrPlaceholder'

export default function AboutBlock({ props, previewMode }) {
  const isMobile = previewMode === 'mobile'

  if (props.photoAsBackground) {
    return (
      <div
        className="relative flex min-h-[220px] items-end overflow-hidden p-8"
        style={{ borderRadius: 'var(--radius)' }}
      >
        <ImageOrPlaceholder
          url={props.photoImageUrl}
          alt="Foto de sobre mí"
          className="absolute inset-0 h-full w-full"
          style={{ background: props.photoImageUrl ? undefined : 'var(--color-primary)' }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)' }} />
        <div className="relative max-w-lg">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-bg)' }}>
            {renderEmphasis(props.title)}
          </h2>
          <p className="mt-2 opacity-90" style={{ color: 'var(--color-bg)' }}>
            {renderEmphasis(props.bio)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex gap-6 p-10 ${isMobile ? 'flex-col items-start' : 'items-center'}`}>
      <ImageOrPlaceholder url={props.photoImageUrl} alt="Foto de sobre mí" className="h-24 w-24 shrink-0 rounded-full" />
      <div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
          {renderEmphasis(props.title)}
        </h2>
        <p className="mt-2 opacity-80" style={{ color: 'var(--color-text)' }}>
          {renderEmphasis(props.bio)}
        </p>
      </div>
    </div>
  )
}

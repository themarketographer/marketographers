import { ctaActionLabel } from '../../utils/blockDisplay'

export default function HeaderBlock({ props, previewMode }) {
  const isMobile = previewMode === 'mobile'
  const links = (props.links || '')
    .split(',')
    .map((l) => l.trim())
    .filter(Boolean)
  const actionLabel = ctaActionLabel(props)

  return (
    <div
      className="flex items-center justify-between px-6 py-4"
      style={{
        background: 'var(--color-bg)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <span className="font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
        {props.logo}
      </span>
      {!isMobile && (
        <nav className="flex gap-5 text-sm opacity-80" style={{ color: 'var(--color-text)' }}>
          {links.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </nav>
      )}
      <div className="text-right">
        <button
          className="px-4 py-2 text-sm font-medium"
          style={{ background: 'var(--color-accent)', borderRadius: 'var(--radius)', color: 'var(--color-accent-ink)' }}
        >
          {props.ctaText}
        </button>
        {actionLabel && <p className="mt-1 text-[10px] opacity-60">{actionLabel}</p>}
      </div>
    </div>
  )
}

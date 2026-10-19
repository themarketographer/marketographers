// Isotipo + wordmark oficiales. El isotipo cambia de arte según el tema (dos
// artes del mismo logo, no un filtro) y el wordmark es texto en Working con
// la "g" en accent, igual que en el sitio.
export default function BrandMark({ theme, size = 28, showWord = true, compact = false, className = '' }) {
  const icon = theme === 'light' ? '/marketools/wireframe/brand-icon-light.png' : '/marketools/wireframe/brand-icon-dark.png'
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img src={icon} width={size} height={size} alt="" style={{ borderRadius: 8, display: 'block' }} />
      {showWord && (
        <span className={`mk-wordmark ${compact ? 'hidden sm:inline' : ''}`} style={{ fontSize: size * 0.62 }}>
          the marketo<i>g</i>raphers
        </span>
      )}
    </span>
  )
}

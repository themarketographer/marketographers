// Placeholder gris de siempre, o la imagen real si ya hay un link cargado
// (Cloudinary u otra URL pública) — usado por los bloques con galerías o
// logos (Portafolio, Confían en mí, Testimonios, Sobre mí).
export default function ImageOrPlaceholder({ url, alt, className, style }) {
  if (url) {
    return <img src={url} alt={alt ?? ''} className={className} style={{ objectFit: 'cover', ...style }} />
  }
  return <div className={className} style={{ background: 'rgba(0,0,0,0.1)', ...style }} />
}

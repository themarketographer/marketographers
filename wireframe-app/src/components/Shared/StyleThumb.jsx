import { getStyleRef } from '../../data/styleReferences'

// Miniatura de una landing en el estilo de referencia: una tira de secciones
// con los colores reales de ese sitio (página, contraste y acento), un
// titular en su tipografía y el botón en su forma. Sirve para elegir estilo
// mirando el resultado en vez de leer una descripción.
export default function StyleThumb({ styleId }) {
  const ref = getStyleRef(styleId)
  if (!ref) return <BlankThumb />
  const t = ref.theme
  const surf = {
    page: { bg: t.backgroundColor, fg: t.textColor },
    contrast: { bg: t.primaryColor, fg: t.primaryTextColor },
    accent: { bg: t.accentColor, fg: t.accentTextColor },
  }
  const isMk = styleId === 'marketographers'
  return (
    <div className="wf-thumb" style={{ background: t.backgroundColor }} aria-hidden="true">
      <div className="wf-thumb-scroll">
        <div className="wf-thumb-hero" style={{ color: t.textColor }}>
          <span className="wf-thumb-nav" style={{ background: isMk ? 'rgba(255,255,255,.08)' : 'rgba(24,24,24,.06)' }}>
            <i style={{ background: t.textColor }} />
            <b style={{ background: t.accentColor }} />
          </span>
          <span
            className="wf-thumb-title"
            style={{ fontFamily: t.headingFont, fontWeight: isMk ? 400 : 700, letterSpacing: isMk ? '-0.02em' : '-0.035em' }}
          >
            Tu cliente ya {isMk ? <em style={{ color: t.accentColor, fontStyle: 'normal' }}>eligió</em> : <em className="wf-thumb-mark" style={{ '--hl': t.accentColor }}>eligió</em>}
          </span>
          <span className="wf-thumb-btn" style={{ background: t.accentColor, color: t.accentTextColor }}>Agenda</span>
        </div>
        {ref.sectionStrip.map((s, i) => (
          <div key={i} className="wf-thumb-sec" style={{ background: surf[s].bg }}>
            <i style={{ background: surf[s].fg }} />
            <i style={{ background: surf[s].fg, width: '38%' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function BlankThumb() {
  return (
    <div className="wf-thumb wf-thumb-blank" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} />
      ))}
    </div>
  )
}

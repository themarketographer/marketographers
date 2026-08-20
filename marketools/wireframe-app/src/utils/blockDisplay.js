// Helpers compartidos por los renderers de bloque: alineación de botones y
// una etiqueta corta que muestra en el canvas qué acción real quedó
// configurada en un botón (WhatsApp / Cal.com), para que el alumno vea de
// un vistazo qué botones ya están "conectados" sin abrir el panel.

export function alignToJustify(align) {
  if (align === 'center') return 'justify-center'
  if (align === 'right') return 'justify-end'
  return 'justify-start'
}

export function ctaActionLabel(props, prefix = '') {
  const key = (k) => (prefix ? `${prefix}${k[0].toUpperCase()}${k.slice(1)}` : k)
  const action = props[key('ctaAction')]
  if (action === 'whatsapp') {
    const phone = props[key('whatsappPhone')]
    return `→ WhatsApp${phone ? ` · ${phone}` : ' (sin número aún)'}`
  }
  if (action === 'cal') {
    const mode = props[key('calMode')] === 'embed' ? 'embebido' : 'pop-up'
    const hasLink = props[key('calLink')]
    return `→ Cal.com/Calendly (${mode})${hasLink ? '' : ' — sin link aún'}`
  }
  if (action === 'scroll') {
    const target = props[key('scrollTarget')]
    return `→ Baja a "${target || '(sección sin definir)'}"`
  }
  if (action === 'url') {
    const url = props[key('urlTarget')]
    return `→ ${url || '(URL sin definir)'}`
  }
  return null
}

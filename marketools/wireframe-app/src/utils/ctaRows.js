import { BLOCK_SCHEMA, CTA_ACTION_PREFIXES } from '../data/blockSchema'

// Deriva, a partir de los bloques del canvas, la lista de "botones" que
// tienen una acción real (WhatsApp/Cal.com) configurable — usado por el
// formulario de export para pedir un evento de conversión por botón.
export function getCtaRows(blocks) {
  const rows = []
  blocks.forEach((block) => {
    const prefixes = CTA_ACTION_PREFIXES[block.type]
    if (!prefixes) return
    prefixes.forEach((prefix) => {
      const key = (k) => (prefix ? `${prefix}${k[0].toUpperCase()}${k.slice(1)}` : k)
      rows.push({
        rowKey: `${block.id}:${prefix || 'main'}`,
        blockId: block.id,
        blockLabel: BLOCK_SCHEMA[block.type].label,
        prefix,
        buttonText: block.props[key('ctaText')] ?? block.props[key('buttonText')] ?? '(botón)',
        action: block.props[key('ctaAction')],
      })
    })
  })
  return rows
}

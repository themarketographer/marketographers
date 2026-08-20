import { BLOCK_SCHEMA, CTA_ACTION_PREFIXES } from '../data/blockSchema'
import { getAnimationSuggestion } from '../data/animationSuggestions'
import { getAnimationOverrideDescription } from '../data/animationOptions'
import { getHeadingLevel, getAltNote } from '../data/seoNotes'
import { getResponsiveNote } from '../data/responsiveNotes'
import { buildTrackingSection, TRACKING_REMINDER_NO_PIXEL, TRACKING_REMINDER_WITH_PIXEL } from '../data/trackingCopy'
import { STANDARD_EVENTS } from '../data/standardEvents'
import { buildPixelSnippet, buildGa4Snippet } from '../data/trackingSnippets'
import { parseRow } from '../utils/parseRow'

const VIDEO_RULE =
  'Aplica a todo bloque con un clip (VSL, Video destacado): el video arranca solo cuando entra en el viewport (IntersectionObserver, threshold 0.2) y se pausa al salir. Si el navegador bloquea el autoplay, arranca con el primer toque/clic del usuario. Documentado una sola vez acá — no repetir esta lógica bloque por bloque.'

function visibleFields(schema, props) {
  return schema.fields.filter((f) => !f.showIf || f.showIf(props))
}

function formatPropValue(field, value) {
  if (field.type === 'toggle') return value ? 'sí' : 'no'
  if (field.type === 'repeatable') return value.map((v, i) => `\n     ${i + 1}. ${v}`).join('')
  if (field.type === 'image') return value || '(sin link de imagen todavía)'
  if (field.type === 'imageList') {
    return value.map((v, i) => `\n     ${i + 1}. ${v || '(sin link de imagen todavía)'}`).join('')
  }
  if (field.type === 'select') {
    const opt = field.options?.find((o) => o.value === value)
    return opt ? opt.label : value
  }
  return value || '(vacío)'
}

// Junta todos los links de imagen (Cloudinary u otra URL) de todos los
// bloques, en el orden en que aparecen en el canvas, con un nombre claro
// para cada uno — así el prompt ya trae las imágenes puestas y ordenadas
// en vez de que el modelo tenga que inventar de dónde sacarlas.
function buildImageAssetsSection(blocks) {
  const rows = []
  blocks.forEach((block, blockIndex) => {
    const schema = BLOCK_SCHEMA[block.type]
    visibleFields(schema, block.props).forEach((field) => {
      if (field.type === 'image') {
        const url = block.props[field.key]
        if (url) rows.push(`${rows.length + 1}. ${schema.label} #${blockIndex + 1} — ${field.label}: ${url}`)
      } else if (field.type === 'imageList') {
        const urls = block.props[field.key] || []
        urls.forEach((url, i) => {
          if (url) rows.push(`${rows.length + 1}. ${schema.label} #${blockIndex + 1} — ${field.label} (${i + 1}): ${url}`)
        })
      }
    })
  })
  if (rows.length === 0) return null
  return [
    '## Imágenes (usar estos links tal cual, en este orden, para cada elemento)',
    'Cada imagen de abajo ya tiene su link real (Cloudinary u otro hosting). Usalas exactamente en el `src`',
    'del elemento que indica su nombre — no inventes ni reemplaces estos links por placeholders.',
    '',
    ...rows,
    '',
  ].join('\n')
}

function animationLine(block) {
  if (block.animationOverride) {
    return getAnimationOverrideDescription(block.animationOverride) ?? getAnimationSuggestion(block.type)
  }
  return getAnimationSuggestion(block.type)
}

function buildWireframeSection(blocks) {
  const lines = ['# WIREFRAME', '']
  blocks.forEach((block, i) => {
    const schema = BLOCK_SCHEMA[block.type]
    lines.push(`${i + 1}. ${schema.label}${block.variant ? ` (variante: ${schema.variantLabels?.[block.variant] ?? block.variant})` : ''}`)
    visibleFields(schema, block.props).forEach((field) => {
      lines.push(`   - ${field.label}: ${formatPropValue(field, block.props[field.key])}`)
    })
    lines.push(`   - acento: ${block.accentOverride ? `propio (${block.accentOverride})` : 'usa el tema global'}`)
    lines.push(`   - bordes: ${block.radiusOverride ? `propios (${block.radiusOverride})` : 'usa el tema global'}`)
    lines.push('')
  })
  return lines.join('\n')
}

// Línea de evento para un botón concreto: usa lo que el alumno eligió en el
// formulario de export si hay algo cargado; si lo dejó en "omitir", cae en
// la nota genérica del embudo (misma lógica de siempre).
function eventLineForRow(rowKey, trackingConfig) {
  const entry = trackingConfig?.events?.[rowKey]
  if (!entry || entry.type === 'omit' || !entry.value) return null
  if (entry.type === 'standard') {
    const ev = STANDARD_EVENTS.find((e) => e.value === entry.value)
    return `Evento de este botón: \`${entry.value}\`${ev ? ` — ${ev.label}` : ''}.`
  }
  return `Evento de este botón: \`${entry.value}\` (evento personalizado, snake_case).`
}

// Precios: cada plan (tarjetas o tabla comparativa) ya tiene su propio
// nombre/precio/moneda cargado en props.tiers — el export lee eso solo en
// vez de pedirle al alumno que tipee value/currency a mano por cada botón
// en el formulario de tracking.
function pricingTierLines(block) {
  if (block.type !== 'pricing') return []
  if (!['tarjetas-precio-exacto', 'tabla-comparativa'].includes(block.variant)) return []
  return block.props.tiers.map((raw, i) => {
    const [name, price, currency] = parseRow(raw, 3)
    return `Evento del plan "${name || `Plan ${i + 1}`}": \`InitiateCheckout\` con value=${price || '(sin precio cargado)'}, currency=${currency || '(sin moneda cargada)'} — tomado directo del plan, no lo tipees a mano.`
  })
}

// Addons: cada extra trae su propio evento en la 4ta columna de la fila
// ("Título | Texto | Texto del botón | evento"), porque cada botón de add-on
// necesita su propio evento de tracking (se agregan al pedido, no compiten
// entre sí como los planes de Precios).
function addonsEventLines(block) {
  if (block.type !== 'addons') return []
  return block.props.extras
    .map((raw, i) => {
      const [title, , , event] = parseRow(raw, 4)
      if (!event) return null
      return `Evento del extra "${title || `Extra ${i + 1}`}": \`${event}\`.`
    })
    .filter(Boolean)
}

function buildMasterPromptSection(state, trackingConfig) {
  const { blocks } = state.canvas
  const { theme } = state
  const hasVideo = blocks.some((b) => b.type === 'videoBanda' || b.type === 'vsl')

  const lines = [
    '# PROMPT PARA GENERAR EL HTML DE LA LANDING',
    '',
    'Sos un desarrollador front-end. Con la información de abajo, generá el HTML, CSS y JavaScript completo de',
    'esta landing page — un solo archivo autocontenido, responsive, listo para publicar. No hace falta que sepas',
    'nada más que lo que está en este documento: todos los datos de diseño, contenido y tracking están acá.',
    '',
    '## Sistema de diseño (aplicar a TODA la página, no solo a un bloque)',
    `- Tipografía de títulos: ${theme.headingFont}. Importar la fuente real (Google Fonts) si no es del sistema.`,
    `- Tipografía de cuerpo: ${theme.bodyFont}. Importar la fuente real (Google Fonts) si no es del sistema.`,
    `- Color primario (fondos de énfasis, footer, CTA final): ${theme.primaryColor}`,
    `- Color de fondo general: ${theme.backgroundColor}`,
    `- Color de texto: ${theme.textColor}`,
    `- Color de acento (botones, links, detalles clave): ${theme.accentColor}. Usalo en TODOS los CTAs de la página, no solo en uno.`,
    `- Color del texto sobre el acento (texto de los botones): ${theme.accentTextColor}.`,
    `- Radio de bordes por defecto: ${theme.radius} (recto ≈4px / redondeado ≈14px / muy redondeado ≈999px — interpretalo en botones, tarjetas e inputs).`,
    `- Escala de tamaño de texto: ${Math.round(theme.fontScale * 100)}% del tamaño base de cada elemento (100% = tamaños estándar dados en cada bloque abajo).`,
    '- Texto entre **así** va en negrita, *así* en itálica, __así__ subrayado.',
    '- Texto entre ~~así~~ es una "palabra clave": tipografía de título en itálica, color de acento (igual que en marketographers.com).',
    '- Texto entre ^^así^^ es una "palabra clave" con efecto glow: color de acento + resplandor (text-shadow) alrededor del texto.',
    '',
  ]

  if (hasVideo) {
    lines.push('## Regla de video', VIDEO_RULE, '')
  }

  const imageAssets = buildImageAssetsSection(blocks)
  if (imageAssets) lines.push(imageAssets, '')

  blocks.forEach((block, i) => {
    const schema = BLOCK_SCHEMA[block.type]
    const heading = getHeadingLevel(block.type)
    const alt = getAltNote(block.type)
    lines.push(`## ${i + 1}. ${schema.label}`)
    lines.push(`1. Layout/variante: ${block.variant ? (schema.variantLabels?.[block.variant] ?? block.variant) : 'única (sin variantes)'}`)
    lines.push(`2. Animación: ${animationLine(block)}`)
    lines.push(`3. SEO: ${heading ? `título de esta sección en \`${heading}\`.` : 'sin encabezado de sección.'}${alt ? ` ${alt}` : ''}`)
    lines.push(`4. Responsive (celular vs escritorio): ${getResponsiveNote(block.type)}`)
    lines.push(`5. Contenido real a usar (reemplazá cualquier corchete [así] por este texto tal cual; si está vacío, generá un placeholder de ejemplo creíble):`)
    visibleFields(schema, block.props).forEach((field) => {
      lines.push(`   - ${field.label}: ${formatPropValue(field, block.props[field.key])}`)
    })
    lines.push(`   - Acento de este bloque: ${block.accentOverride ? `${block.accentOverride} (distinto al del resto de la página)` : 'el acento general de arriba'}`)
    lines.push(`   - Bordes de este bloque: ${block.radiusOverride ? `${block.radiusOverride} (distinto al del resto de la página)` : 'el radio general de arriba'}`)

    const prefixes = CTA_ACTION_PREFIXES[block.type]
    if (prefixes) {
      prefixes.forEach((prefix) => {
        const rowKey = `${block.id}:${prefix || 'main'}`
        const line = eventLineForRow(rowKey, trackingConfig)
        if (line) lines.push(`   - ${line}`)
      })
    }
    pricingTierLines(block).forEach((line) => lines.push(`   - ${line}`))
    addonsEventLines(block).forEach((line) => lines.push(`   - ${line}`))

    lines.push('')
  })

  lines.push('## Tracking')
  const tracking = buildTrackingSection(state.wizard.funnelId)
  if (tracking) {
    lines.push(`**${tracking.title}**`)
    tracking.lines.forEach((l) => lines.push(`- ${l}`))
    lines.push('')
  }

  const pixelSnippet = buildPixelSnippet(trackingConfig?.pixelId)
  const ga4Snippet = buildGa4Snippet(trackingConfig?.ga4Id)
  if (pixelSnippet || ga4Snippet) {
    lines.push(TRACKING_REMINDER_WITH_PIXEL)
    lines.push('')
    lines.push('Código real a pegar en el `<head>`, antes de `</head>`:')
    lines.push('```html')
    if (pixelSnippet) lines.push(pixelSnippet)
    if (pixelSnippet && ga4Snippet) lines.push('')
    if (ga4Snippet) lines.push(ga4Snippet)
    lines.push('```')
  } else {
    lines.push(TRACKING_REMINDER_NO_PIXEL)
  }

  return lines.join('\n')
}

export function buildExport(state, trackingConfig) {
  const { blocks } = state.canvas
  if (blocks.length === 0) return 'El canvas está vacío: agregá al menos un bloque antes de exportar.'

  return [buildWireframeSection(blocks), '', '---', '', buildMasterPromptSection(state, trackingConfig)].join('\n')
}

export function useExport() {
  return { buildExport }
}

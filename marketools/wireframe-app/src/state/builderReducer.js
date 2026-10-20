import { resolveFunnel } from '../data/funnelRules'
import { FUNNEL_DRAFTS, SIMPLE_DRAFT } from '../data/funnelDrafts'
import { makeBlock, BLOCK_SCHEMA } from '../data/blockSchema'
import { getPresetById } from '../data/themePresets'
import { getStyleRef } from '../data/styleReferences'
import { makeId } from '../utils/id'

// Un borrador puede cambiar la cantidad de un campo repetible (ej. 8 fotos
// en vez de 6) sin traer la lista ya armada: acá se ajusta cada lista a su
// contador para que el panel y el canvas muestren la cantidad correcta.
function fitRepeatables(type, props, overrideProps) {
  const next = { ...props, ...overrideProps }
  BLOCK_SCHEMA[type].fields
    .filter((f) => (f.type === 'repeatable' || f.type === 'imageList') && !(f.key in overrideProps))
    .forEach((f) => {
      next[f.key] = resizeRepeatable(props[f.key], next[f.countField], f.type === 'imageList' ? '' : f.default)
    })
  return next
}

function draftEntriesToBlocks(draft) {
  return draft.map(({ type, variant, overrideProps, surface, refAnimation }) => {
    const block = makeBlock(type, variant ? { variant } : {})
    if (overrideProps) block.props = fitRepeatables(type, block.props, overrideProps)
    return { id: makeId(), ...block, surface: surface ?? null, refAnimation: refAnimation ?? null }
  })
}

function draftToBlocks(funnelId) {
  return draftEntriesToBlocks(FUNNEL_DRAFTS[funnelId] ?? SIMPLE_DRAFT)
}

// Carga un estilo de referencia completo: bloques + tema del sitio real.
function applyStyle(state, styleId) {
  const ref = getStyleRef(styleId)
  if (!ref) return state
  return {
    ...state,
    canvas: { blocks: draftEntriesToBlocks(ref.draft) },
    theme: { ...state.theme, ...ref.theme, presetId: ref.id, styleId: ref.id },
    replayNonce: Date.now(),
  }
}

// Ajusta un array `repeatable` al nuevo largo `count`, sin perder lo ya escrito.
function resizeRepeatable(list, count, fallback) {
  const next = list.slice(0, count)
  while (next.length < count) next.push(fallback)
  return next
}

export function builderReducer(state, action) {
  switch (action.type) {
    case 'WIZARD_BACK':
      return { ...state, wizard: { ...state.wizard, step: Math.max(0, state.wizard.step - 1) } }

    case 'CANVAS_LOAD_STYLE':
      return applyStyle(state, action.styleId)

    case 'CANVAS_REPLAY':
      return { ...state, replayNonce: Date.now() }

    case 'FLASH_CLEAR':
      return { ...state, flashBlockId: null }

    case 'WIZARD_ANSWER': {
      const { question, value } = action
      return {
        ...state,
        wizard: {
          ...state.wizard,
          answers: { ...state.wizard.answers, [question]: value },
          step: state.wizard.step + 1,
        },
      }
    }

    case 'WIZARD_RESOLVE': {
      const funnelId = resolveFunnel(state.wizard.answers)
      // El embudo resuelto decide qué tracking sugerir al exportar. La 4ta
      // respuesta decide el borrador: uno de los estilos de referencia
      // (Graphica o Marketographers) arranca armado; "en blanco" deja el
      // canvas vacío para armar desde cero.
      const resolved = { ...state, wizard: { ...state.wizard, funnelId, completed: true } }
      return applyStyle(resolved, state.wizard.answers.q4)
    }

    case 'WIZARD_RESTART':
      return {
        ...state,
        wizard: { step: 0, answers: { q1: null, q2: null, q3: null, q4: null }, funnelId: null, completed: false },
        canvas: { blocks: [] },
      }

    case 'CANVAS_LOAD_FUNNEL_DRAFT':
      return { ...state, canvas: { blocks: draftToBlocks(state.wizard.funnelId) }, replayNonce: Date.now() }

    case 'BLOCK_ADD': {
      const { blockType, atIndex } = action
      const block = { id: makeId(), ...makeBlock(blockType), surface: null, refAnimation: null }
      const blocks = [...state.canvas.blocks]
      const index = atIndex ?? blocks.length
      blocks.splice(index, 0, block)
      return { ...state, canvas: { blocks }, flashBlockId: block.id }
    }

    case 'BLOCK_DUPLICATE': {
      const blocks = [...state.canvas.blocks]
      const index = blocks.findIndex((b) => b.id === action.blockId)
      if (index === -1) return state
      const copy = { ...structuredClone(blocks[index]), id: makeId() }
      blocks.splice(index + 1, 0, copy)
      return { ...state, canvas: { blocks }, flashBlockId: copy.id }
    }

    // Sube o baja un bloque una posición (botones ↑ ↓ de la barra del bloque).
    case 'BLOCK_SHIFT': {
      const blocks = [...state.canvas.blocks]
      const from = blocks.findIndex((b) => b.id === action.blockId)
      const to = from + action.delta
      if (from === -1 || to < 0 || to >= blocks.length) return state
      const [moved] = blocks.splice(from, 1)
      blocks.splice(to, 0, moved)
      return { ...state, canvas: { blocks } }
    }

    case 'BLOCK_SET_SURFACE': {
      const { blockId, surface } = action
      return {
        ...state,
        canvas: {
          blocks: state.canvas.blocks.map((b) => (b.id === blockId ? { ...b, surface: surface === 'page' ? null : surface } : b)),
        },
      }
    }

    case 'BLOCK_REMOVE': {
      return {
        ...state,
        canvas: { blocks: state.canvas.blocks.filter((b) => b.id !== action.blockId) },
      }
    }

    // Reinserta un bloque ya armado (con su id original) en un índice
    // puntual — usado por el botón "Deshacer" después de eliminar, en vez de
    // recrear el bloque desde cero.
    case 'BLOCK_RESTORE': {
      const { block, atIndex } = action
      const blocks = [...state.canvas.blocks]
      const index = Math.min(atIndex, blocks.length)
      blocks.splice(index, 0, block)
      return { ...state, canvas: { blocks } }
    }

    case 'BLOCK_MOVE': {
      const { blockId, toIndex } = action
      const blocks = [...state.canvas.blocks]
      const fromIndex = blocks.findIndex((b) => b.id === blockId)
      if (fromIndex === -1) return state
      const [moved] = blocks.splice(fromIndex, 1)
      const adjustedIndex = fromIndex < toIndex ? toIndex - 1 : toIndex
      blocks.splice(adjustedIndex, 0, moved)
      return { ...state, canvas: { blocks } }
    }

    case 'BLOCK_UPDATE_PROPS': {
      const { blockId, props } = action
      return {
        ...state,
        canvas: {
          blocks: state.canvas.blocks.map((b) => {
            if (b.id !== blockId) return b
            const nextProps = { ...b.props, ...props }
            const schema = BLOCK_SCHEMA[b.type]
            // Un bloque puede tener más de un campo repeatable/imageList con
            // su propio countField (ej. Precios: planes y características),
            // así que hay que revisar todos, no solo el primero.
            schema.fields
              .filter((f) => (f.type === 'repeatable' || f.type === 'imageList') && f.countField in props)
              .forEach((f) => {
                const count = props[f.countField]
                nextProps[f.key] = resizeRepeatable(b.props[f.key], count, f.type === 'imageList' ? '' : f.default)
              })
            return { ...b, props: nextProps }
          }),
        },
      }
    }

    case 'BLOCK_SET_VARIANT': {
      const { blockId, variant } = action
      return {
        ...state,
        canvas: {
          blocks: state.canvas.blocks.map((b) => (b.id === blockId ? { ...b, variant } : b)),
        },
      }
    }

    case 'BLOCK_SET_ACCENT_OVERRIDE': {
      const { blockId, color } = action
      return {
        ...state,
        canvas: {
          blocks: state.canvas.blocks.map((b) => (b.id === blockId ? { ...b, accentOverride: color } : b)),
        },
      }
    }

    case 'BLOCK_SET_RADIUS_OVERRIDE': {
      const { blockId, radius } = action
      return {
        ...state,
        canvas: {
          blocks: state.canvas.blocks.map((b) => (b.id === blockId ? { ...b, radiusOverride: radius } : b)),
        },
      }
    }

    case 'BLOCK_SET_ANIMATION_OVERRIDE': {
      const { blockId, animation } = action
      return {
        ...state,
        canvas: {
          blocks: state.canvas.blocks.map((b) => (b.id === blockId ? { ...b, animationOverride: animation } : b)),
        },
      }
    }

    case 'THEME_APPLY_PRESET': {
      const preset = getPresetById(action.presetId)
      if (!preset) return state
      const { id, label: _label, ...themeValues } = preset
      // Merge, no reemplazo total: un preset define sus propios campos (tipografías,
      // colores, radio, etc.), pero no debe borrar otros campos del tema que el
      // preset no menciona (como el tamaño de texto elegido aparte).
      return { ...state, theme: { ...state.theme, styleId: null, ...themeValues, presetId: id } }
    }

    case 'THEME_SET_FIELD': {
      return { ...state, theme: { ...state.theme, [action.field]: action.value } }
    }

    case 'PREVIEW_SET_MODE':
      return { ...state, preview: { mode: action.mode } }

    case 'DND_START_PALETTE':
      return { ...state, dnd: { ...state.dnd, draggingPaletteType: action.blockType, draggingBlockId: null } }

    case 'DND_START_REORDER':
      return { ...state, dnd: { ...state.dnd, draggingBlockId: action.blockId, draggingPaletteType: null } }

    case 'DND_HOVER':
      return { ...state, dnd: { ...state.dnd, hoverIndex: action.index } }

    case 'DND_END':
      return { ...state, dnd: { draggingBlockId: null, draggingPaletteType: null, hoverIndex: null } }

    case 'ANIMATION_PREVIEW_PLAY':
      return { ...state, animationPreview: { blockId: action.blockId, type: action.animationType, nonce: Date.now() } }

    case 'ANIMATION_PREVIEW_CLEAR':
      return { ...state, animationPreview: null }

    default:
      return state
  }
}

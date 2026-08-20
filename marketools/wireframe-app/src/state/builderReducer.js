import { resolveFunnel } from '../data/funnelRules'
import { FUNNEL_DRAFTS, SIMPLE_DRAFT } from '../data/funnelDrafts'
import { makeBlock, BLOCK_SCHEMA } from '../data/blockSchema'
import { getPresetById } from '../data/themePresets'
import { makeId } from '../utils/id'

function draftToBlocks(funnelId) {
  const draft = FUNNEL_DRAFTS[funnelId] ?? SIMPLE_DRAFT
  return draft.map(({ type, variant, overrideProps }) => {
    const block = makeBlock(type, variant ? { variant } : {})
    if (overrideProps) block.props = { ...block.props, ...overrideProps }
    return { id: makeId(), ...block }
  })
}

// Ajusta un array `repeatable` al nuevo largo `count`, sin perder lo ya escrito.
function resizeRepeatable(list, count, fallback) {
  const next = list.slice(0, count)
  while (next.length < count) next.push(fallback)
  return next
}

export function builderReducer(state, action) {
  switch (action.type) {
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
      // El canvas arranca vacío a propósito: el alumno arma su landing desde
      // cero, el embudo resuelto solo decide qué tracking sugerir al exportar.
      return {
        ...state,
        wizard: { ...state.wizard, funnelId, completed: true },
      }
    }

    case 'WIZARD_RESTART':
      return {
        ...state,
        wizard: { step: 0, answers: { q1: null, q2: null, q3: null }, funnelId: null, completed: false },
        canvas: { blocks: [] },
      }

    case 'CANVAS_LOAD_FUNNEL_DRAFT':
      return { ...state, canvas: { blocks: draftToBlocks(state.wizard.funnelId) } }

    case 'BLOCK_ADD': {
      const { blockType, atIndex } = action
      const block = { id: makeId(), ...makeBlock(blockType) }
      const blocks = [...state.canvas.blocks]
      const index = atIndex ?? blocks.length
      blocks.splice(index, 0, block)
      return { ...state, canvas: { blocks } }
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
            const repeatableField = schema.fields.find((f) => f.type === 'repeatable')
            if (repeatableField && repeatableField.countField in props) {
              const count = props[repeatableField.countField]
              nextProps[repeatableField.key] = resizeRepeatable(
                b.props[repeatableField.key],
                count,
                repeatableField.default,
              )
            }
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
      return { ...state, theme: { ...state.theme, ...themeValues, presetId: id } }
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

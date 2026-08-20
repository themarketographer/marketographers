import { useBuilder } from '../../state/BuilderContext'
import { BLOCK_SCHEMA } from '../../data/blockSchema'
import { RADIUS_OPTIONS } from '../../data/themePresets'
import TextField from './fields/TextField'
import TextAreaField from './fields/TextAreaField'
import SelectField from './fields/SelectField'
import ButtonGroupField from './fields/ButtonGroupField'
import SliderField from './fields/SliderField'
import ToggleField from './fields/ToggleField'
import RepeatableListField from './fields/RepeatableListField'
import ImageField from './fields/ImageField'
import ImageListField from './fields/ImageListField'
import ColorField from './fields/ColorField'

// Los selects con pocas opciones se ven mejor (y son más rápidos de tocar)
// como grupo de botones que como <select>; con más opciones un dropdown
// sigue siendo lo más práctico.
const BUTTON_GROUP_MAX_OPTIONS = 5

function FieldComponent({ field, value, onChange }) {
  if (field.type === 'number') return <SliderField field={field} value={value} onChange={onChange} />
  if (field.type === 'select') {
    const Component = field.options.length <= BUTTON_GROUP_MAX_OPTIONS ? ButtonGroupField : SelectField
    return <Component field={field} value={value} onChange={onChange} />
  }
  const Component = {
    text: TextField,
    textarea: TextAreaField,
    toggle: ToggleField,
    repeatable: RepeatableListField,
    image: ImageField,
    imageList: ImageListField,
  }[field.type]
  return <Component field={field} value={value} onChange={onChange} />
}

export default function PropertiesPanel({ blockId }) {
  const { state, dispatch } = useBuilder()
  const block = state.canvas.blocks.find((b) => b.id === blockId)

  if (!block) {
    return (
      <aside className="w-72 min-h-0 flex-1 border-l border-black/10 bg-neutral-50 p-4 text-sm text-neutral-400">
        Seleccioná un bloque del canvas para editar sus propiedades.
      </aside>
    )
  }

  const schema = BLOCK_SCHEMA[block.type]

  function updateProp(key, value) {
    dispatch({ type: 'BLOCK_UPDATE_PROPS', blockId: block.id, props: { [key]: value } })
  }

  return (
    <aside className="w-72 min-h-0 flex-1 space-y-4 overflow-y-auto border-l border-black/10 bg-neutral-50 p-4">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{schema.label}</h3>

      {schema.variants && (
        <ButtonGroupField
          field={{ label: 'Variante' }}
          value={block.variant}
          onChange={(variant) => dispatch({ type: 'BLOCK_SET_VARIANT', blockId: block.id, variant })}
          options={schema.variants.map((v) => ({ value: v, label: schema.variantLabels?.[v] ?? v }))}
        />
      )}

      {schema.fields.map((field) => {
        if (field.showIf && !field.showIf(block.props)) return null
        return (
          <FieldComponent
            key={field.key}
            field={field}
            value={block.props[field.key]}
            onChange={(value) => updateProp(field.key, value)}
          />
        )
      })}

      <div className="space-y-3 border-t border-black/10 pt-3">
        <label className="flex items-center justify-between text-xs">
          <span className="font-medium text-neutral-600">Acento propio del bloque</span>
          <input
            type="checkbox"
            checked={block.accentOverride != null}
            onChange={(e) =>
              dispatch({
                type: 'BLOCK_SET_ACCENT_OVERRIDE',
                blockId: block.id,
                color: e.target.checked ? state.theme.accentColor : null,
              })
            }
            className="h-4 w-4 accent-[var(--app-accent)]"
          />
        </label>
        {block.accentOverride != null && (
          <ColorField
            label="Color de acento"
            value={block.accentOverride}
            onChange={(color) => dispatch({ type: 'BLOCK_SET_ACCENT_OVERRIDE', blockId: block.id, color })}
          />
        )}

        <label className="flex items-center justify-between text-xs">
          <span className="font-medium text-neutral-600">Bordes propios del bloque</span>
          <input
            type="checkbox"
            checked={block.radiusOverride != null}
            onChange={(e) =>
              dispatch({
                type: 'BLOCK_SET_RADIUS_OVERRIDE',
                blockId: block.id,
                radius: e.target.checked ? state.theme.radius : null,
              })
            }
            className="h-4 w-4 accent-[var(--app-accent)]"
          />
        </label>
        {block.radiusOverride != null && (
          <ButtonGroupField
            field={{ label: 'Radio de bordes' }}
            value={block.radiusOverride}
            options={RADIUS_OPTIONS}
            onChange={(radius) => dispatch({ type: 'BLOCK_SET_RADIUS_OVERRIDE', blockId: block.id, radius })}
          />
        )}
      </div>
    </aside>
  )
}

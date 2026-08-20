import { useState } from 'react'
import { useBuilder } from '../../state/BuilderContext'
import { getCtaRows } from '../../utils/ctaRows'
import { STANDARD_EVENTS } from '../../data/standardEvents'

const ACTION_LABEL = {
  whatsapp: 'WhatsApp',
  cal: 'Cal.com / Calendly',
  scroll: 'Baja a otra sección',
  url: 'Va a otra URL',
  none: 'sin acción definida',
}

export default function ExportConfigForm({ onCancel, onContinue }) {
  const { state } = useBuilder()
  const rows = getCtaRows(state.canvas.blocks)
  const [pixelId, setPixelId] = useState('')
  const [ga4Id, setGa4Id] = useState('')
  const [events, setEvents] = useState({})

  function setRow(rowKey, patch) {
    setEvents((prev) => ({ ...prev, [rowKey]: { ...prev[rowKey], ...patch } }))
  }

  function handleContinue() {
    onContinue({ pixelId, ga4Id, events })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={onCancel}>
      <div
        className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b p-4" style={{ borderColor: 'var(--app-border)' }}>
          <h2 className="font-heading-app text-lg font-bold" style={{ color: 'var(--app-ink)' }}>
            Configurá el tracking antes de exportar
          </h2>
          <p className="mt-1 text-xs" style={{ color: 'var(--app-muted)' }}>
            Todo es opcional — lo que dejes en blanco sale como placeholder en el export, listo para completar después.
          </p>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium" style={{ color: 'var(--app-muted)' }}>
                ID del Meta Pixel (si ya lo tenés)
              </label>
              <input
                type="text"
                value={pixelId}
                onChange={(e) => setPixelId(e.target.value)}
                placeholder="Ej: 1234567890123456"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
                style={{ borderColor: 'var(--app-border)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium" style={{ color: 'var(--app-muted)' }}>
                ID de Google Analytics 4 (si ya lo tenés)
              </label>
              <input
                type="text"
                value={ga4Id}
                onChange={(e) => setGa4Id(e.target.value)}
                placeholder="Ej: G-XXXXXXXXXX"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none"
                style={{ borderColor: 'var(--app-border)' }}
              />
            </div>
          </div>
          <p className="-mt-3 text-[11px]" style={{ color: 'var(--app-muted)' }}>
            Si cargás uno de los dos (o los dos), el prompt va a incluir el código real, listo para pegar en el
            &lt;head&gt;. Si los dejás en blanco, el prompt deja el espacio marcado para agregarlos después.
          </p>

          {rows.length === 0 ? (
            <p className="text-xs italic" style={{ color: 'var(--app-muted)' }}>
              Ningún bloque tiene todavía un botón con acción de WhatsApp o Cal.com — el export va a usar la
              sugerencia genérica de tracking según tu embudo.
            </p>
          ) : (
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--app-muted)' }}>
                Evento por botón
              </h3>
              {rows.map((row) => {
                const current = events[row.rowKey] ?? { type: 'omit', value: '' }
                return (
                  <div key={row.rowKey} className="rounded-lg border p-3" style={{ borderColor: 'var(--app-border)' }}>
                    <p className="text-sm font-medium" style={{ color: 'var(--app-ink)' }}>
                      {row.blockLabel} — "{row.buttonText}"
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--app-muted)' }}>
                      Acción configurada: {ACTION_LABEL[row.action] ?? ACTION_LABEL.none}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <select
                        value={current.type}
                        onChange={(e) => setRow(row.rowKey, { type: e.target.value, value: '' })}
                        className="rounded border px-2 py-1.5 text-xs"
                        style={{ borderColor: 'var(--app-border)' }}
                      >
                        <option value="omit">Omitir — usar sugerencia del embudo</option>
                        <option value="standard">Evento estándar</option>
                        <option value="custom">Evento personalizado</option>
                      </select>
                      {current.type === 'standard' && (
                        <select
                          value={current.value}
                          onChange={(e) => setRow(row.rowKey, { value: e.target.value })}
                          className="rounded border px-2 py-1.5 text-xs"
                          style={{ borderColor: 'var(--app-border)' }}
                        >
                          <option value="">Elegir evento…</option>
                          {STANDARD_EVENTS.map((ev) => (
                            <option key={ev.value} value={ev.value}>{ev.label}</option>
                          ))}
                        </select>
                      )}
                      {current.type === 'custom' && (
                        <input
                          type="text"
                          value={current.value}
                          onChange={(e) => setRow(row.rowKey, { value: e.target.value })}
                          placeholder="nombre_del_evento (snake_case)"
                          className="rounded border px-2 py-1.5 text-xs"
                          style={{ borderColor: 'var(--app-border)' }}
                        />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t p-4" style={{ borderColor: 'var(--app-border)' }}>
          <button
            onClick={onCancel}
            className="rounded-full border px-4 py-2 text-sm font-medium"
            style={{ borderColor: 'var(--app-border)', color: 'var(--app-muted)' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleContinue}
            className="rounded-full px-5 py-2 text-sm font-semibold"
            style={{ background: 'var(--app-accent)', color: 'var(--app-accent-ink)' }}
          >
            Generar export
          </button>
        </div>
      </div>
    </div>
  )
}

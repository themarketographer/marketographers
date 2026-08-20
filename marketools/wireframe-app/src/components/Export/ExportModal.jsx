import { useState } from 'react'
import { useBuilder } from '../../state/BuilderContext'
import { buildExport } from '../../hooks/useExport'
import { copyToClipboard } from '../../utils/clipboard'

export default function ExportModal({ onClose, trackingConfig }) {
  const { state } = useBuilder()
  const [copied, setCopied] = useState(false)
  const text = buildExport(state, trackingConfig)

  async function handleCopy() {
    const ok = await copyToClipboard(text)
    setCopied(ok)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={onClose}>
      <div
        className="flex h-[92vh] w-full max-w-5xl flex-col rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b p-4" style={{ borderColor: 'var(--app-border)' }}>
          <h2 className="font-heading-app text-lg font-bold" style={{ color: 'var(--app-ink)' }}>
            Exportar wireframe + prompt maestro
          </h2>
          <button onClick={onClose} className="text-lg leading-none" style={{ color: 'var(--app-muted)' }} aria-label="Cerrar">
            ×
          </button>
        </div>
        <textarea
          readOnly
          value={text}
          className="flex-1 resize-none overflow-y-auto p-5 font-mono text-sm leading-relaxed outline-none"
          style={{ color: 'var(--app-ink)' }}
        />
        <div className="flex justify-end gap-2 border-t p-4" style={{ borderColor: 'var(--app-border)' }}>
          <button
            onClick={handleCopy}
            className="rounded-full px-5 py-2 text-sm font-semibold"
            style={{ background: 'var(--app-accent)', color: 'var(--app-accent-ink)' }}
          >
            {copied ? 'Copiado ✓' : 'Copiar'}
          </button>
        </div>
      </div>
    </div>
  )
}

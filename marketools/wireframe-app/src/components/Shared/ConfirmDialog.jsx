// Modal de confirmación propio, en vez de `window.confirm()`. El nativo
// depende del navegador/entorno donde corre la app y en algunos contextos
// de previsualización queda bloqueado o no dispara el diálogo — el clic
// "no hacía nada" en vez de fallar visiblemente. Este modal siempre
// funciona porque es JSX normal, no una API del navegador.
export default function ConfirmDialog({ title, body, confirmLabel = 'Confirmar', onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-6" onClick={onCancel}>
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-heading-app text-base font-bold" style={{ color: 'var(--app-ink)' }}>
          {title}
        </h2>
        <p className="mt-2 text-sm" style={{ color: 'var(--app-muted)' }}>
          {body}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-full border px-4 py-2 text-sm font-medium"
            style={{ borderColor: 'var(--app-border)', color: 'var(--app-muted)' }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full px-4 py-2 text-sm font-semibold"
            style={{ background: 'var(--app-accent)', color: 'var(--app-accent-ink)' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

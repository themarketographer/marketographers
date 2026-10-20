// Estado vacío de los paneles de la derecha: una ilustración chica de un
// cursor tocando una sección, qué hacer y los atajos que existen.
export default function PanelEmpty({ title, body }) {
  return (
    <aside className="wf-panel flex flex-col items-center justify-center text-center">
      <svg viewBox="0 0 120 84" width="120" height="84" aria-hidden="true" className="wf-empty-art">
        <rect x="10" y="8" width="100" height="16" rx="4" fill="currentColor" opacity=".08" />
        <rect className="wf-empty-pick" x="10" y="30" width="100" height="22" rx="5" fill="none" stroke="var(--app-accent)" strokeWidth="2" />
        <rect x="18" y="37" width="44" height="4" rx="2" fill="currentColor" opacity=".35" />
        <rect x="18" y="44" width="30" height="3" rx="1.5" fill="currentColor" opacity=".2" />
        <rect x="10" y="58" width="100" height="16" rx="4" fill="currentColor" opacity=".08" />
        <path className="wf-empty-cursor" d="M78 40l14 8-6 1.6L83 56z" fill="var(--app-ink)" stroke="var(--app-bg)" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <p className="mt-4 text-sm font-semibold" style={{ color: 'var(--app-ink)' }}>
        {title}
      </p>
      <p className="mt-1.5 max-w-[15rem] text-xs leading-relaxed" style={{ color: 'var(--app-muted)' }}>
        {body}
      </p>
      <dl className="wf-keys mt-6">
        <div><dt><kbd>Supr</kbd></dt><dd>Borrar bloque</dd></div>
        <div><dt><kbd>Ctrl</kbd> <kbd>D</kbd></dt><dd>Duplicar</dd></div>
        <div><dt><kbd>Esc</kbd></dt><dd>Soltar selección</dd></div>
      </dl>
    </aside>
  )
}

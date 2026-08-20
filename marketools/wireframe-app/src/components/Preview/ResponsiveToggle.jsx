import { useBuilder } from '../../state/BuilderContext'

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  )
}

function DesktopIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

export default function ResponsiveToggle() {
  const { state, dispatch } = useBuilder()

  return (
    <div className="flex overflow-hidden rounded-full border text-xs font-medium" style={{ borderColor: 'var(--app-border)' }}>
      {[
        { mode: 'mobile', label: 'Móvil', Icon: PhoneIcon },
        { mode: 'desktop', label: 'Escritorio', Icon: DesktopIcon },
      ].map(({ mode, label, Icon }) => (
        <button
          key={mode}
          onClick={() => dispatch({ type: 'PREVIEW_SET_MODE', mode })}
          title={label}
          aria-label={label}
          className="flex items-center gap-1.5 px-3 py-1.5"
          style={
            state.preview.mode === mode
              ? { background: 'var(--app-accent)', color: 'var(--app-accent-ink)' }
              : { background: '#fff', color: 'var(--app-muted)' }
          }
        >
          <Icon />
        </button>
      ))}
    </div>
  )
}

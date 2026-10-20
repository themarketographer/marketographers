// Íconos de trazo propio, un solo grosor (1.8) y extremos redondeados, en
// currentColor. Reemplazan los caracteres sueltos (▸ ▾ × ▶) que usaba la
// herramienta antes.
const PATHS = {
  plus: 'M12 5v14M5 12h14',
  up: 'M12 19V5M6 11l6-6 6 6',
  down: 'M12 5v14M6 13l6 6 6-6',
  copy: 'M9 9h10v10H9zM5 15V5h10',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  close: 'M6 6l12 12M18 6L6 18',
  chevron: 'M9 6l6 6-6 6',
  play: 'M8 5.5v13l11-6.5z',
  replay: 'M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  grip: 'M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01',
  pointer: 'M6 4l12 7-5.5 1.5L10 18z',
  layers: 'M12 4l8 4-8 4-8-4zM4 12l8 4 8-4M4 16l8 4 8-4',
  arrowLeft: 'M19 12H5M11 6l-6 6 6 6',
  check: 'M5 12.5l4.5 4.5L19 7',
}

export default function Icon({ name, size = 16, className = '', strokeWidth = 1.8 }) {
  const d = PATHS[name]
  const filled = name === 'play' || name === 'pointer'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={name === 'grip' ? 3 : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={d} />
    </svg>
  )
}

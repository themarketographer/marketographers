import { useCallback, useEffect, useRef, useState } from 'react'
import { renderEmphasis } from '../../utils/textEmphasis'
import ImageOrPlaceholder from './ImageOrPlaceholder'

// Comparador de arrastre "antes / después": mismo mecanismo que el de
// estudiographica.com — clip-path sobre la imagen de "antes" que se ajusta
// al mouse (desktop) o al dedo (mobile), con detección de intención en
// touch para no robarle el scroll vertical de la página al alumno que
// visita la landing (solo se bloquea el scroll cuando el gesto es
// claramente horizontal).
export default function BeforeAfterBlock({ props, previewMode }) {
  const isMobile = previewMode === 'mobile'
  const [pos, setPos] = useState(50)
  const boxRef = useRef(null)
  const draggingRef = useRef(false)
  const touchRef = useRef(null)

  const setFromX = useCallback((clientX) => {
    if (!boxRef.current) return
    const rect = boxRef.current.getBoundingClientRect()
    let p = ((clientX - rect.left) / rect.width) * 100
    if (p < 0) p = 0
    if (p > 100) p = 100
    setPos(p)
  }, [])

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!draggingRef.current) return
      setFromX(e.clientX)
    }
    const onMouseUp = () => {
      draggingRef.current = false
    }
    const onTouchMove = (e) => {
      const t = touchRef.current
      if (!t) return
      const x = e.touches[0].clientX
      const y = e.touches[0].clientY
      if (t.mode === null) {
        const dx = Math.abs(x - t.x)
        const dy = Math.abs(y - t.y)
        if (dx < 6 && dy < 6) return
        t.mode = dx > dy ? 'h' : 'v'
      }
      if (t.mode === 'h') {
        if (e.cancelable) e.preventDefault()
        setFromX(x)
      }
    }
    const onTouchEnd = () => {
      touchRef.current = null
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('touchcancel', onTouchEnd)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [setFromX])

  return (
    <div className="p-10">
      {props.title && (
        <h2
          className={`mb-6 text-2xl font-bold ${isMobile ? 'text-center' : 'text-center'}`}
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
        >
          {renderEmphasis(props.title)}
        </h2>
      )}
      <div
        ref={boxRef}
        className="relative mx-auto select-none overflow-hidden"
        style={{
          aspectRatio: '4 / 5',
          maxWidth: 460,
          width: '100%',
          borderRadius: 'var(--radius)',
          cursor: 'ew-resize',
          touchAction: 'pan-y',
          boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
        }}
        onMouseDown={(e) => {
          draggingRef.current = true
          setFromX(e.clientX)
        }}
        onTouchStart={(e) => {
          touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, mode: null }
        }}
      >
        <ImageOrPlaceholder
          url={props.afterImageUrl}
          alt={props.afterLabel || 'Después'}
          className="absolute inset-0 h-full w-full"
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${pos}% 0, ${pos}% 100%, 0 100%)` }}
        >
          <ImageOrPlaceholder
            url={props.beforeImageUrl}
            alt={props.beforeLabel || 'Antes'}
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <div
          className="pointer-events-none absolute top-0 bottom-0"
          style={{ left: `${pos}%`, width: 3, background: 'var(--color-accent)' }}
        />
        <div
          className="absolute flex items-center justify-center rounded-full font-bold"
          style={{
            top: '50%',
            left: `${pos}%`,
            width: 44,
            height: 44,
            transform: 'translate(-50%, -50%)',
            background: 'var(--color-accent)',
            color: 'var(--color-accent-ink)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
            fontSize: 16,
          }}
        >
          ⇆
        </div>
        <div
          className="absolute rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white"
          style={{ top: 16, left: 16, background: 'rgba(0,0,0,0.6)' }}
        >
          {props.beforeLabel || 'Antes'}
        </div>
        <div
          className="absolute rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide"
          style={{ top: 16, right: 16, background: 'var(--color-accent)', color: 'var(--color-accent-ink)' }}
        >
          {props.afterLabel || 'Después'}
        </div>
      </div>
      {props.caption && (
        <p className="mt-3 text-center text-xs italic opacity-60" style={{ color: 'var(--color-text)' }}>
          {renderEmphasis(props.caption)}
        </p>
      )}
    </div>
  )
}

// Renderers de los bloques de inspiración (secciones de estudiographica.com y
// marketographers.com). Son wireframes: muestran la composición real de cada
// sección con los colores del tema, sin intentar reproducir sus animaciones
// (esas viajan descritas en el prompt exportado).
import { renderEmphasis } from '../../utils/textEmphasis'
import { ctaActionLabel } from '../../utils/blockDisplay'
import { parseRow } from '../../utils/parseRow'
import ImageOrPlaceholder from './ImageOrPlaceholder'

const CARD_RADIUS = 'min(var(--radius), 24px)'
const soft = (pct) => `color-mix(in srgb, var(--color-text) ${pct}%, transparent)`

function H2({ children, center = true, className = '' }) {
  return (
    <h2 className={`text-3xl font-bold ${center ? 'text-center' : ''} ${className}`} style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
      {renderEmphasis(children)}
    </h2>
  )
}

function Sub({ children, center = true }) {
  if (!children) return null
  return (
    <p className={`mt-3 text-base opacity-70 ${center ? 'mx-auto max-w-xl text-center' : 'max-w-lg'}`} style={{ color: 'var(--color-text)' }}>
      {renderEmphasis(children)}
    </p>
  )
}

function Btn({ children, ghost = false, props }) {
  const label = props ? ctaActionLabel(props) : null
  return (
    <span className="inline-flex flex-col items-start">
      <button
        className="px-6 py-3 text-sm font-semibold"
        style={
          ghost
            ? { borderRadius: 'var(--radius)', border: `1.5px solid ${soft(60)}`, color: 'var(--color-text)' }
            : { borderRadius: 'var(--radius)', background: 'var(--color-accent)', color: 'var(--color-accent-ink)' }
        }
      >
        {children}
      </button>
      {label && <span className="mt-1 text-[11px] opacity-60">{label}</span>}
    </span>
  )
}

function Card({ children, className = '', style }) {
  return (
    <div className={className} style={{ borderRadius: CARD_RADIUS, background: soft(5), border: `1px solid ${soft(12)}`, ...style }}>
      {children}
    </div>
  )
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 shrink-0">
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  )
}

export function HeroCarouselBlock({ props, previewMode }) {
  const m = previewMode === 'mobile'
  return (
    <div className={`flex gap-10 p-10 ${m ? 'flex-col' : 'items-center'}`}>
      <div className="min-w-0 flex-1 space-y-5">
        <h1 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
          {renderEmphasis(props.title)}
        </h1>
        <p className="text-lg opacity-75" style={{ color: 'var(--color-text)' }}>{renderEmphasis(props.subtitle)}</p>
        <div className="flex flex-wrap gap-3">
          <Btn props={props}>{props.ctaText}</Btn>
          {props.secondaryText && <Btn ghost>{props.secondaryText}</Btn>}
        </div>
        {props.stats.length > 0 && (
          <div className="flex gap-8 pt-2">
            {props.stats.map((raw, i) => {
              const [n, l] = parseRow(raw, 2)
              return (
                <div key={i}>
                  <p className="text-2xl font-bold tabular-nums" style={{ color: 'var(--color-text)' }}>{n}</p>
                  <p className="text-xs opacity-60">{l}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <div className={`relative ${m ? 'w-full' : 'w-[38%]'} shrink-0`}>
        <Card className="overflow-hidden p-3" style={{ background: 'var(--color-bg)', boxShadow: '0 30px 60px -30px rgba(0,0,0,.45)' }}>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-6 w-6 rounded-full" style={{ background: 'var(--color-accent)' }} />
            <span className="h-2 w-20 rounded" style={{ background: soft(20) }} />
          </div>
          <ImageOrPlaceholder url={props.photos[0]} className="aspect-square w-full" style={{ borderRadius: 'min(var(--radius), 18px)' }} />
          <div className="mt-2 flex justify-center gap-1.5">
            {props.photos.map((_, i) => (
              <span key={i} className="h-1.5 rounded-full" style={{ width: i === 0 ? 16 : 6, background: i === 0 ? 'var(--color-accent)' : soft(25) }} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export function HeroVideoBlock({ props, previewMode }) {
  const m = previewMode === 'mobile'
  return (
    <div className="relative overflow-hidden px-10 pb-12 pt-14 text-center">
      <span className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ border: '1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)' }} />
      <h1 className="relative mx-auto max-w-3xl text-4xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
        {renderEmphasis(props.title)}
      </h1>
      <p className="relative mx-auto mt-4 max-w-xl text-lg opacity-70">{renderEmphasis(props.subtitle)}</p>
      <div className="relative mt-6 flex justify-center">
        <Btn props={props}>{props.ctaText}</Btn>
      </div>
      <div
        className={`relative mx-auto mt-10 grid aspect-video place-items-center ${m ? 'w-full' : 'w-[68%]'}`}
        style={{ borderRadius: 'min(var(--radius), 28px)', background: soft(8), border: `1px solid ${soft(14)}`, transform: m ? 'none' : 'perspective(1400px) rotateX(6deg)' }}
      >
        <span className="grid h-16 w-16 place-items-center rounded-full" style={{ background: 'var(--color-accent)', color: 'var(--color-accent-ink)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
        </span>
        <span className="absolute bottom-3 text-xs opacity-60">{props.videoUrl || '[tu video principal]'}</span>
      </div>
    </div>
  )
}

export function StatementBlock({ props }) {
  return (
    <div className="px-10 py-16">
      <p className="mx-auto max-w-[24ch] text-center text-4xl leading-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
        {renderEmphasis(props.text)}
      </p>
    </div>
  )
}

export function ScenesBlock({ props, previewMode }) {
  const m = previewMode === 'mobile'
  return (
    <div className="p-10">
      <H2>{props.title}</H2>
      <div className="mt-8 grid gap-4" style={{ gridTemplateColumns: m ? '1fr' : `repeat(${props.scenes.length}, minmax(0,1fr))` }}>
        {props.scenes.map((raw, i) => {
          const [time, place, figure, what] = parseRow(raw, 4)
          return (
            <Card key={i} className="p-5">
              <p className="text-xs font-semibold opacity-60">{time} · {place}</p>
              <p className="mt-3 text-2xl font-bold tabular-nums" style={{ color: '#ff5c5c' }}>{figure}</p>
              <p className="mt-2 text-sm opacity-80">{what}</p>
            </Card>
          )
        })}
      </div>
      {props.closing && <p className="mx-auto mt-8 max-w-xl text-center text-lg font-semibold">{renderEmphasis(props.closing)}</p>}
    </div>
  )
}

export function FormatListBlock({ props, previewMode }) {
  const m = previewMode === 'mobile'
  return (
    <div className="p-10">
      <H2 center={false}>{props.title}</H2>
      <Sub center={false}>{props.subtitle}</Sub>
      <div className="mt-8 grid gap-x-10" style={{ gridTemplateColumns: m ? '1fr' : '1fr 1fr' }}>
        {props.rows.map((raw, i) => {
          const [t, d] = parseRow(raw, 2)
          return (
            <div key={i} className="flex items-start gap-4 py-4" style={{ borderTop: `1px solid ${soft(14)}` }}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{ background: 'color-mix(in srgb, var(--color-accent) 28%, transparent)' }}>
                <span className="h-3 w-3 rounded-sm" style={{ border: '2px solid var(--color-text)' }} />
              </span>
              <span>
                <span className="block font-semibold">{t}</span>
                <span className="block text-sm opacity-70">{d}</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function CardTrackBlock({ props, previewMode }) {
  const m = previewMode === 'mobile'
  return (
    <div className="overflow-hidden py-10">
      <div className="px-10">
        <H2 center={false}>{props.title}</H2>
        <Sub center={false}>{props.subtitle}</Sub>
      </div>
      <div className="mt-8 flex gap-4 pl-10" style={{ maskImage: 'linear-gradient(90deg,#000 80%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,#000 80%,transparent)' }}>
        {props.cards.map((raw, i) => {
          const [tag, t, d] = parseRow(raw, 3)
          return (
            <Card key={i} className="shrink-0 p-5" style={{ width: m ? '78%' : 300, transform: i === 0 ? 'none' : `scale(${1 - Math.min(i, 3) * 0.02})`, transformOrigin: 'left center' }}>
              <span className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold" style={{ background: 'var(--color-accent)', color: 'var(--color-accent-ink)' }}>{tag}</span>
              <p className="mt-4 text-lg font-bold">{t}</p>
              <p className="mt-1 text-sm opacity-70">{d}</p>
            </Card>
          )
        })}
      </div>
      <div className="mt-6 flex items-center gap-3 px-10">
        {['M15 6l-6 6 6 6', 'M9 6l6 6-6 6'].map((d) => (
          <span key={d} className="grid h-11 w-11 place-items-center rounded-full" style={{ border: `1px solid ${soft(25)}` }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
          </span>
        ))}
        <span className="h-0.5 flex-1 rounded" style={{ background: soft(14) }}>
          <span className="block h-full w-1/4 rounded" style={{ background: 'var(--color-accent)' }} />
        </span>
      </div>
    </div>
  )
}

export function BentoBlock({ props, previewMode }) {
  const m = previewMode === 'mobile'
  return (
    <div className="p-10">
      <H2>{props.title}</H2>
      <div className="mt-8 grid gap-4" style={{ gridTemplateColumns: m ? '1fr' : '1.4fr 1fr' }}>
        {props.tiles.map((raw, i) => {
          const [tag, what] = parseRow(raw, 2)
          return (
            <Card key={i} className="relative overflow-hidden" style={{ minHeight: m ? 160 : i === 0 ? 260 : 180, gridRow: !m && i === 0 && props.tiles.length > 2 ? 'span 2' : undefined }}>
              <ImageOrPlaceholder url={props.images[i]} className="absolute inset-0 h-full w-full" style={{ background: soft(6) }} />
              <span className="absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold" style={{ background: 'rgba(12,12,12,.75)', color: '#f8f8f8' }}>{tag}</span>
              <span className="absolute bottom-4 left-4 right-4 text-sm font-medium">{what}</span>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export function PainMapBlock({ props }) {
  const first = parseRow(props.pains[0], 3)
  return (
    <div className="p-10 text-center">
      <H2>{props.title}</H2>
      <div className="mt-7 flex flex-wrap justify-center gap-2">
        {props.pains.map((raw, i) => (
          <span
            key={i}
            className="rounded-full px-4 py-2 text-sm"
            style={i === 0 ? { background: 'var(--color-accent)', color: 'var(--color-accent-ink)', fontWeight: 600 } : { border: `1px solid ${soft(25)}` }}
          >
            “{parseRow(raw, 3)[0]}”
          </span>
        ))}
      </div>
      <Card className="mx-auto mt-6 flex max-w-xl items-center gap-4 p-5 text-left">
        <span className="h-16 w-16 shrink-0" style={{ borderRadius: 'min(var(--radius), 14px)', background: soft(14) }} />
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">{first[1]}</span>
          <span className="mt-1 block text-sm underline" style={{ textDecorationColor: 'var(--color-accent)', textDecorationThickness: 3, textUnderlineOffset: 5 }}>
            {first[2]}
          </span>
        </span>
      </Card>
    </div>
  )
}

export function WaysBlock({ props, previewMode }) {
  const m = previewMode === 'mobile'
  return (
    <div className="p-10">
      <H2>{props.title}</H2>
      <div className="mt-8 grid gap-5" style={{ gridTemplateColumns: m ? '1fr' : `repeat(${props.ways.length}, minmax(0,1fr))` }}>
        {props.ways.map((raw, i) => {
          const [tag, name, text, benefits, btn] = parseRow(raw, 5)
          return (
            <Card key={i} className="p-6">
              {props.photoCount > 0 && (
                <div className="relative mb-6 h-28">
                  {Array.from({ length: props.photoCount }).map((_, k) => (
                    <span
                      key={k}
                      className="absolute top-0 h-28 w-24"
                      style={{ left: `calc(50% - 48px + ${(k - (props.photoCount - 1) / 2) * 46}px)`, transform: `rotate(${(k - (props.photoCount - 1) / 2) * 8}deg)`, borderRadius: 14, background: soft(14 + k * 6), boxShadow: '0 14px 30px -18px rgba(0,0,0,.6)' }}
                    />
                  ))}
                </div>
              )}
              <span className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold" style={{ background: 'color-mix(in srgb, var(--color-accent) 25%, transparent)' }}>{tag}</span>
              <p className="mt-3 text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{name}</p>
              <p className="mt-2 text-sm opacity-75">{text}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {benefits.split(';').filter((b) => b.trim()).map((b, k) => (
                  <li key={k} className="flex gap-2"><Check />{b.trim()}</li>
                ))}
              </ul>
              {btn && <div className="mt-6"><Btn>{btn}</Btn></div>}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export function PricingToggleBlock({ props }) {
  return (
    <div className="p-10">
      <H2>{props.title}</H2>
      <Card className="mx-auto mt-8 max-w-md p-7">
        <div className="mx-auto flex w-fit rounded-full p-1 text-xs font-semibold" style={{ background: soft(8) }}>
          <span className="rounded-full px-4 py-1.5" style={{ background: 'var(--color-accent)', color: 'var(--color-accent-ink)' }}>Mensual</span>
          <span className="px-4 py-1.5 opacity-70">Anual</span>
        </div>
        <p className="mt-6 text-center text-sm font-semibold opacity-70">{props.planName}</p>
        <p className="mt-2 text-center tabular-nums">
          <span className="mr-2 text-xl line-through opacity-40">{props.oldPrice}</span>
          <span className="text-5xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{props.price}</span>
          <span className="text-sm opacity-60"> /mes</span>
        </p>
        <p className="mt-1 text-center text-xs opacity-60">Anual: {props.annualPrice} · {props.annualNote}</p>
        <ul className="mt-6 space-y-2.5 text-sm">
          {props.benefits.map((b, i) => (
            <li key={i} className="flex gap-2"><Check />{b}</li>
          ))}
        </ul>
        <div className="mt-7 flex justify-center"><Btn props={props}>{props.ctaText}</Btn></div>
        {props.fineprint && <p className="mt-3 text-center text-xs opacity-60">{props.fineprint}</p>}
      </Card>
    </div>
  )
}

export function StepsLineBlock({ props, previewMode }) {
  const m = previewMode === 'mobile'
  return (
    <div className={`grid gap-10 p-10 ${m ? '' : 'grid-cols-[1fr_1.4fr]'}`}>
      <div>
        <H2 center={false}>{props.title}</H2>
        <Sub center={false}>{props.subtitle}</Sub>
      </div>
      <ol className="relative space-y-6 pl-14">
        <span className="absolute bottom-3 left-[19px] top-3 w-0.5" style={{ background: soft(14) }}>
          <span className="block h-2/5 w-full" style={{ background: 'var(--color-accent)' }} />
        </span>
        {props.steps.map((raw, i) => {
          const [t, d] = parseRow(raw, 2)
          const on = i < Math.ceil(props.steps.length * 0.4)
          return (
            <li key={i} className="relative">
              <span
                className="absolute -left-14 grid h-10 w-10 place-items-center rounded-full text-sm font-bold"
                style={on ? { background: 'var(--color-accent)', color: 'var(--color-accent-ink)' } : { background: 'var(--color-bg)', border: `1.5px solid ${soft(25)}` }}
              >
                {i + 1}
              </span>
              <p className="font-semibold">{t}</p>
              <p className="text-sm opacity-70">{d}</p>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export function ObjectionsBlock({ props, previewMode }) {
  const m = previewMode === 'mobile'
  return (
    <div className="p-10">
      <H2>{props.title}</H2>
      <div className="mt-8 grid gap-3" style={{ gridTemplateColumns: m ? '1fr' : '1fr 1fr' }}>
        {props.items.map((raw, i) => {
          const [q, a] = parseRow(raw, 2)
          return (
            <Card key={i} className="p-5">
              <p className="flex items-start justify-between gap-4 font-semibold">
                “{q}”
                <span className="text-xl leading-none" style={{ color: 'var(--color-accent)', transform: i === 0 ? 'rotate(45deg)' : 'none' }}>+</span>
              </p>
              {i === 0 && <p className="mt-3 text-sm opacity-75">{a}</p>}
            </Card>
          )
        })}
        <Card className="flex items-center justify-between gap-4 p-5" style={{ gridColumn: m ? undefined : '1 / -1', background: 'color-mix(in srgb, var(--color-accent) 16%, transparent)' }}>
          <p className="font-semibold">¿Ya no te quedan excusas?</p>
          <Btn props={props}>{props.ctaText}</Btn>
        </Card>
      </div>
    </div>
  )
}

export function AboutArchBlock({ props, previewMode }) {
  const m = previewMode === 'mobile'
  return (
    <div className={`flex gap-10 p-10 ${m ? 'flex-col' : 'items-center'}`}>
      <div className={`relative shrink-0 ${m ? 'mx-auto w-3/4' : 'w-[34%]'}`}>
        <ImageOrPlaceholder
          url={props.photoImageUrl}
          className="aspect-[4/5] w-full"
          style={{ borderRadius: '50% 50% 32px 32px / 38% 38% 32px 32px', background: soft(12), boxShadow: '0 40px 80px -40px rgba(0,0,0,.7)' }}
        />
        {props.badge && (
          <span className="absolute -right-3 bottom-8 rounded-full px-4 py-2 text-xs font-semibold" style={{ background: 'var(--color-accent)', color: 'var(--color-accent-ink)' }}>
            {props.badge}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <H2 center={false}>{props.title}</H2>
        <p className="mt-4 max-w-lg opacity-80">{renderEmphasis(props.bio)}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {props.creds.map((c, i) => (
            <span key={i} className="rounded-full px-3 py-1.5 text-xs" style={{ border: `1px solid ${soft(25)}` }}>{c}</span>
          ))}
        </div>
        {props.ctaText && <div className="mt-6"><Btn ghost>{props.ctaText}</Btn></div>}
      </div>
    </div>
  )
}

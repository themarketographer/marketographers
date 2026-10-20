// Miniatura esquemática de cada tipo de bloque (40x28): le muestra al alumno
// cómo se ve la sección antes de arrastrarla, en vez de solo un nombre.
// `a` = acento (amarillo de la marca), `t` = trazo de texto, `b` = caja.
const A = 'var(--app-accent)'
const T = 'currentColor'

function R({ x, y, w, h, c = T, o = 0.35, r = 1 }) {
  return <rect x={x} y={y} width={w} height={h} rx={r} fill={c} opacity={o} />
}

const GLYPHS = {
  header: () => (<><R x={3} y={4} w={8} h={3} o={0.7} /><R x={18} y={5} w={4} h={1.5} /><R x={24} y={5} w={4} h={1.5} /><R x={31} y={4} w={6} h={3} c={A} o={1} r={1.5} /><R x={3} y={12} w={34} h={12} o={0.08} /></>),
  hero: () => (<><R x={3} y={6} w={15} h={3} o={0.7} /><R x={3} y={11} w={12} h={2} /><R x={3} y={17} w={8} h={3.5} c={A} o={1} r={1.75} /><R x={21} y={4} w={16} h={20} o={0.2} r={2} /></>),
  vsl: () => (<><R x={6} y={4} w={28} h={16} o={0.2} r={2} /><path d="M18 9v6l5-3z" fill={T} opacity={0.7} /><R x={14} y={22} w={12} h={3} c={A} o={1} r={1.5} /></>),
  videoBanda: () => (<><R x={2} y={6} w={36} h={16} o={0.2} r={2} /><path d="M18 11v6l5-3z" fill={T} opacity={0.7} /></>),
  problem: () => (<><R x={10} y={7} w={20} h={3} o={0.7} /><R x={6} y={13} w={28} h={1.6} /><R x={8} y={16.5} w={24} h={1.6} /><R x={11} y={20} w={18} h={1.6} /></>),
  process: () => (<>{[4, 16, 28].map((x) => (<g key={x}><circle cx={x + 4} cy={10} r={3} fill={A} /><R x={x} y={16} w={8} h={1.6} /><R x={x + 1} y={19} w={6} h={1.6} /></g>))}</>),
  promise: () => (<><R x={8} y={6} w={24} h={3} o={0.7} /><R x={6} y={12} w={28} h={4} c={A} o={0.9} r={1} /><R x={9} y={19} w={22} h={1.6} /></>),
  exclusividad: () => (<><R x={4} y={6} w={20} h={3} o={0.7} /><R x={4} y={12} w={28} h={1.6} /><R x={4} y={15.5} w={14} h={1.6} c={A} o={1} /><R x={4} y={20} w={9} h={3.5} c={A} o={1} r={1.75} /></>),
  portfolio: () => (<>{[3, 15, 27].map((x) => [4, 15].map((y) => <R key={`${x}${y}`} x={x} y={y} w={10} h={9} o={0.22} r={1.5} />))}</>),
  beforeAfter: () => (<><R x={4} y={4} w={16} h={20} o={0.12} r={2} /><R x={20} y={4} w={16} h={20} o={0.3} r={2} /><R x={19.3} y={3} w={1.4} h={22} c={A} o={1} r={0.7} /><circle cx={20} cy={14} r={2.6} fill={A} /></>),
  testimonials: () => (<>{[3, 15, 27].map((x) => (<g key={x}><R x={x} y={5} w={10} h={18} o={0.14} r={2} /><circle cx={x + 3} cy={9} r={1.6} fill={T} opacity={0.5} /><R x={x + 1.5} y={13} w={7} h={1.4} /><R x={x + 1.5} y={16} w={5} h={1.4} /></g>))}</>),
  trustBar: () => (<><R x={12} y={6} w={16} h={1.6} /><>{[3, 11, 19, 27].map((x) => <R key={x} x={x + 1} y={13} w={7} h={7} o={0.25} r={1.5} />)}</></>),
  stats: () => (<>{[4, 16, 28].map((x) => (<g key={x}><R x={x} y={8} w={8} h={5} c={A} o={1} r={1} /><R x={x} y={16} w={8} h={1.6} /></g>))}</>),
  pullQuote: () => (<><path d="M8 8h4v4l-2 4H8l2-4H8zM14 8h4v4l-2 4h-2l2-4h-2z" fill={A} /><R x={21} y={9} w={13} h={1.8} o={0.6} /><R x={21} y={13} w={10} h={1.8} o={0.6} /><R x={21} y={19} w={7} h={1.4} /></>),
  about: () => (<><R x={4} y={4} w={13} h={20} o={0.22} r={6.5} /><R x={20} y={7} w={14} h={3} o={0.7} /><R x={20} y={13} w={16} h={1.6} /><R x={20} y={16.5} w={12} h={1.6} /></>),
  guarantee: () => (<><circle cx={20} cy={11} r={5} fill="none" stroke={A} strokeWidth={1.6} /><path d="M17.8 11l1.6 1.6 3-3" stroke={T} strokeWidth={1.4} fill="none" strokeLinecap="round" /><R x={10} y={19} w={20} h={1.6} /></>),
  garantias: () => (<>{[3, 15, 27].map((x) => (<g key={x}><R x={x} y={6} w={10} h={16} o={0.14} r={2} /><circle cx={x + 5} cy={11} r={2} fill={A} /><R x={x + 2} y={16} w={6} h={1.4} /></g>))}</>),
  pricing: () => (<>{[3, 15, 27].map((x, i) => (<g key={x}><R x={x} y={i === 1 ? 3 : 6} w={10} h={i === 1 ? 22 : 18} c={i === 1 ? A : T} o={i === 1 ? 0.9 : 0.16} r={2} /><R x={x + 2} y={i === 1 ? 7 : 10} w={6} h={2.4} o={0.6} /></g>))}</>),
  addons: () => (<>{[5, 12, 19].map((y) => (<g key={y}><R x={4} y={y} w={22} h={4.5} o={0.16} r={1} /><R x={29} y={y + 0.5} w={7} h={3.5} c={A} o={1} r={1.75} /></g>))}</>),
  formasPago: () => (<>{[4, 21].map((x) => (<g key={x}><R x={x} y={7} w={15} h={14} o={0.16} r={2} /><R x={x + 2} y={10} w={8} h={2} c={A} o={1} /><R x={x + 2} y={15} w={10} h={1.4} /></g>))}</>),
  finalCta: () => (<><R x={2} y={3} w={36} h={22} o={0.85} r={3} /><R x={10} y={9} w={20} h={3} c="var(--app-bg)" o={0.9} /><R x={14} y={16} w={12} h={4} c={A} o={1} r={2} /></>),
  proximosPasos: () => (<><R x={7.3} y={5} w={1.4} h={18} o={0.3} /><>{[6, 13, 20].map((y) => (<g key={y}><circle cx={8} cy={y} r={2.2} fill={A} /><R x={13} y={y - 0.8} w={20} h={1.6} /></g>))}</></>),
  leadMagnet: () => (<><R x={8} y={6} w={24} h={3} o={0.7} /><R x={6} y={14} w={18} h={5} o={0.18} r={2.5} /><R x={25} y={14} w={9} h={5} c={A} o={1} r={2.5} /></>),
  faq: () => (<>{[5, 11.5, 18].map((y) => (<g key={y}><R x={4} y={y} w={32} h={5} o={0.14} r={1.5} /><R x={6} y={y + 1.8} w={16} h={1.4} o={0.5} /><path d={`M31 ${y + 2.5}h3M32.5 ${y + 1}v3`} stroke={A} strokeWidth={1.2} /></g>))}</>),
  embed: () => (<><R x={4} y={5} w={32} h={18} o={0.1} r={2} /><path d="M16 11l-3 3 3 3M24 11l3 3-3 3" stroke={T} strokeWidth={1.5} fill="none" strokeLinecap="round" opacity={0.6} /></>),
  footer: () => (<><R x={2} y={10} w={36} h={15} o={0.7} r={1} /><R x={5} y={14} w={8} h={2.4} c="var(--app-bg)" o={0.8} /><R x={24} y={14.5} w={5} h={1.4} c="var(--app-bg)" o={0.6} /><R x={31} y={14.5} w={4} h={1.4} c="var(--app-bg)" o={0.6} /></>),
}

export default function BlockGlyph({ type }) {
  const draw = GLYPHS[type] ?? GLYPHS.embed
  return (
    <svg viewBox="0 0 40 28" width="40" height="28" aria-hidden="true" className="wf-glyph shrink-0">
      {draw()}
    </svg>
  )
}

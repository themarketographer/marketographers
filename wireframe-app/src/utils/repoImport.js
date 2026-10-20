// Lee la landing de un repo público de GitHub y la convierte en bloques del
// wireframe. Todo corre en el navegador del alumno: baja el index.html desde
// raw.githubusercontent.com (permite CORS), lo recorre sección por sección,
// adivina qué tipo de bloque es cada una y detecta tipografías y colores.
//
// Los textos NO se copian tal cual: cada título queda como fórmula
// "[Inspirado en: ...]" para que el alumno escriba lo suyo, y las fotos no se
// traen (son de otra persona). Lo que se hereda es la estructura.
import { BLOCK_SCHEMA } from '../data/blockSchema'

const RAW = 'https://raw.githubusercontent.com'
const PAGE_PATHS = ['index.html', 'public/index.html', 'docs/index.html', 'site/index.html', 'dist/index.html', 'src/index.html']
const BRANCHES = ['main', 'master', 'gh-pages']
const CACHE_PREFIX = 'mk-wf-insp-'
const CACHE_MS = 12 * 60 * 60 * 1000

// Acepta: https://github.com/dueño/repo, .../tree/rama, .../blob/rama/ruta.html,
// github.com/dueño/repo sin https, o simplemente "dueño/repo".
export function parseRepoInput(input) {
  const raw = (input ?? '').trim().replace(/\.git$/, '').replace(/\/+$/, '')
  if (!raw) return null
  const m = raw.match(/^(?:https?:\/\/)?(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+)(?:\/(?:tree|blob)\/([\w./-]+?)(?:\/(.+\.html?))?)?$/i)
  if (m) return { owner: m[1], repo: m[2], branch: m[3] && !m[3].endsWith('.html') ? m[3] : null, path: m[4] ?? null }
  const short = raw.match(/^([\w.-]+)\/([\w.-]+)$/)
  if (short) return { owner: short[1], repo: short[2], branch: null, path: null }
  const rawUrl = raw.match(/^https?:\/\/raw\.githubusercontent\.com\/([\w.-]+)\/([\w.-]+)\/([\w.-]+)\/(.+\.html?)$/i)
  if (rawUrl) return { owner: rawUrl[1], repo: rawUrl[2], branch: rawUrl[3], path: rawUrl[4] }
  return null
}

export function repoKey({ owner, repo }) {
  return `${owner}/${repo}`.toLowerCase()
}

async function fetchText(url) {
  const res = await fetch(url)
  if (!res.ok) return null
  return res.text()
}

async function findPage(ref) {
  const branches = ref.branch ? [ref.branch] : BRANCHES
  const paths = ref.path ? [ref.path] : PAGE_PATHS
  for (const branch of branches) {
    for (const path of paths) {
      const url = `${RAW}/${ref.owner}/${ref.repo}/${branch}/${path}`
      const html = await fetchText(url).catch(() => null)
      if (html && /<html|<body|<section|<div/i.test(html)) {
        const dir = path.includes('/') ? path.slice(0, path.lastIndexOf('/') + 1) : ''
        return { html, url, base: `${RAW}/${ref.owner}/${ref.repo}/${branch}/${dir}`, root: `${RAW}/${ref.owner}/${ref.repo}/${branch}/` }
      }
    }
  }
  return null
}

// ---------- Lectura de secciones ----------

const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'LINK', 'META', 'SVG', 'DIALOG'])
const SECTIONISH = new Set(['SECTION', 'HEADER', 'FOOTER', 'NAV', 'ARTICLE', 'ASIDE'])

function clean(text, max = 90) {
  const t = (text ?? '').replace(/\s+/g, ' ').trim()
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t
}

function inspired(text, fallback) {
  const t = clean(text, 80)
  return t ? `[Inspirado en: "${t}"]` : fallback
}

function sectionCandidates(doc) {
  let root = doc.body
  if (!root) return []
  // Baja por envoltorios de un solo hijo (div#app, main, .page...).
  for (let i = 0; i < 6; i++) {
    const kids = [...root.children].filter((c) => !SKIP.has(c.tagName))
    if (kids.length === 1 && !SECTIONISH.has(kids[0].tagName)) root = kids[0]
    else break
  }
  const out = []
  let afterFooter = false
  const visit = (el, depth) => {
    for (const child of el.children) {
      if (SKIP.has(child.tagName) || afterFooter) continue
      if (isFloating(child)) continue
      const text = clean(child.textContent, 4000)
      const hasMedia = child.querySelector('img,video,iframe,picture')
      if (!text && !hasMedia) continue
      if (child.tagName === 'MAIN' || (depth < 2 && !SECTIONISH.has(child.tagName) && child.querySelectorAll(':scope > section').length >= 2)) {
        visit(child, depth + 1)
        continue
      }
      out.push(child)
      if (child.tagName === 'FOOTER') afterFooter = true
    }
  }
  visit(root, 0)
  return out.slice(0, 30)
}

// Barras fijas, botones flotantes, lightbox, avisos: no son secciones.
const FLOATING = /(^|[\s_-])(sticky|fixed|float|floating|dock|toast|modal|popup|lightbox|lb|overlay|cookie|wa|whatsapp|mobile-?bar|bottom-?bar|progress|cursor|trail|skip)([\s_-]|$)/i
function isFloating(el) {
  const sig = `${el.id} ${typeof el.className === 'string' ? el.className : ''}`
  if (FLOATING.test(sig)) return true
  if (el.hasAttribute('hidden') || el.getAttribute('aria-hidden') === 'true') return true
  return /position\s*:\s*fixed|display\s*:\s*none/i.test(el.getAttribute('style') ?? '')
}

function itemsOf(el) {
  // El grupo más grande de hermanos con la misma etiqueta y clase, que tengan
  // texto propio: tarjetas, filas de una lista, pasos, planes.
  let best = []
  ;[el, ...el.querySelectorAll('*')].forEach((parent) => {
    const groups = {}
    for (const k of parent.children) {
      if (SKIP.has(k.tagName) || clean(k.textContent).length < 4) continue
      const sig = `${k.tagName}.${typeof k.className === 'string' ? k.className.split(' ')[0] : ''}`
      ;(groups[sig] ??= []).push(k)
    }
    Object.values(groups).forEach((g) => {
      if (g.length >= 2 && g.length > best.length && g.length <= 12) best = g
    })
  })
  return best.slice(0, 8).map((k) => {
    const t = k.querySelector('h3,h4,h5,strong,b,dt,summary') ?? [...k.querySelectorAll('*')].find((n) => n.children.length === 0 && clean(n.textContent).length > 2)
    const titleText = clean(t?.textContent ?? k.textContent, 50)
    const p = k.querySelector('p,dd')
    const rest = clean(p?.textContent ?? k.textContent.replace(t?.textContent ?? '', ''), 70)
    return { title: titleText, text: rest === titleText ? '' : rest }
  })
}

function featuresOf(el, index, total) {
  const idcls = `${el.id} ${typeof el.className === 'string' ? el.className : ''} ${el.getAttribute('aria-label') ?? ''}`.toLowerCase()
  const inner = [...el.querySelectorAll('[class],[role]')].slice(0, 300).map((n) => `${typeof n.className === 'string' ? n.className : ''} ${n.getAttribute('role') ?? ''}`).join(' ').toLowerCase()
  const heading = el.querySelector('h1,h2,h3')
  const paras = [...el.querySelectorAll('p')].map((p) => clean(p.textContent, 160)).filter(Boolean)
  const buttons = [...el.querySelectorAll('a,button')]
    .filter((b) => b.tagName === 'BUTTON' || /btn|button|cta|boton/i.test(b.className))
    .map((b) => clean(b.textContent, 40))
    .filter(Boolean)
  const text = clean(el.textContent, 5000)
  const short = [...el.querySelectorAll('strong,b,span,p,h3,div')].map((n) => clean(n.textContent, 20))
  const statLike = short.filter((t) => /^[+\-~]?[$€]?\s?\d[\d.,]*\s?(k|m|%|\+|h|x)?\+?$/i.test(t)).length
  return {
    tag: el.tagName,
    idcls,
    inner,
    index,
    total,
    h1: !!el.querySelector('h1'),
    heading: clean(heading?.textContent, 90),
    paras,
    buttons,
    text,
    imgs: el.querySelectorAll('img,picture').length,
    hasIframe: !!el.querySelector('iframe[src*="youtu"],iframe[src*="vimeo"],video'),
    details: el.querySelectorAll('details').length,
    emailForm: !!el.querySelector('input[type=email]'),
    prices: (text.match(/(\$|bs\.?|usd|€)\s?\d/gi) ?? []).length,
    statLike,
    ol: el.querySelectorAll('ol > li').length,
    items: itemsOf(el),
  }
}

const has = (f, re) => re.test(f.idcls)
const hasIn = (f, re) => re.test(f.idcls) || re.test(f.inner)

function surfaceOf(el) {
  const sig = `${el.id} ${typeof el.className === 'string' ? el.className : ''} ${el.getAttribute('style') ?? ''}`.toLowerCase()
  if (/(^|[\s_-])(dark|ink|negro|black|night|oscuro|s-ink)|bg-(black|gray-9|neutral-9|zinc-9|slate-9|stone-9)/.test(sig)) return 'contrast'
  if (/(^|[\s_-])(yellow|amarillo|accent|s-yellow)|bg-(yellow|amber|primary)/.test(sig)) return 'accent'
  return null
}

function rows(items, count, fmt) {
  const list = items.slice(0, count)
  while (list.length < count) list.push({ title: '', text: '' })
  return list.map((it, i) => fmt({ title: it.title || 'Título', text: it.text || 'Detalle' }, i))
}

// Decide el tipo de bloque y arma sus props a partir de las señales.
function classify(f) {
  const title = inspired(f.heading, undefined)
  const body = f.paras[0] ? inspired(f.paras[0]) : undefined
  const cta = f.buttons[0] ? `[${f.buttons[0]}]` : undefined
  const n = f.items.length
  const pick = (type, props = {}, variant) => ({ type, variant, overrideProps: Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined)) })

  if (f.tag === 'FOOTER' || has(f, /footer|pie/)) return pick('footer')
  if ((f.tag === 'NAV' || f.tag === 'HEADER' || has(f, /(^|\s)(nav|navbar|topbar|menu)/)) && !f.h1 && f.index <= 1) {
    return pick('header', { ctaText: cta })
  }
  if (f.h1 || (f.index <= 1 && f.heading && f.buttons.length)) {
    if (f.hasIframe) return pick('heroVideo', { title, subtitle: body, ctaText: cta })
    if (f.imgs >= 2) return pick('heroCarousel', { title, subtitle: body, ctaText: cta, secondaryText: f.buttons[1] ? `[${f.buttons[1]}]` : undefined })
    return pick('hero', { title, subtitle: body, ctaText: cta }, 'texto-izquierda')
  }
  if (hasIn(f, /marquee|ticker|cinta-?texto/) && !f.heading) return null
  if (has(f, /dudas|objec/)) return pick('objections', { title, itemCount: Math.min(Math.max(n, 2), 6), items: n >= 2 ? rows(f.items, Math.min(n, 6), (it) => `[${it.title}] | [Tu respuesta]`) : undefined })
  if (f.details >= 2 || has(f, /faq|pregunta/)) return pick('faq', { title, questionCount: Math.min(Math.max(f.details || n || 5, 2), 10) }, 'acordeon-ancho')
  if (f.emailForm) return pick('leadMagnet', { title, body })
  if (has(f, /escena|scene/)) return pick('scenes', { title, sceneCount: Math.min(Math.max(n, 2), 4) })
  if (has(f, /mapa|dolor|pain/) || /tablist/.test(f.inner)) return pick('painMap', { title, painCount: Math.min(Math.max(n, 2), 6) })
  if (hasIn(f, /bento|dentro|mosaic/)) return pick('bento', { title, tileCount: Math.min(Math.max(n, 2), 4) })
  if (hasIn(f, /(^|[\s_-])(cmp|compar\w*|before|after|antes|despues)([\s_-]|$)/)) return pick('beforeAfter', { title })
  if (hasIn(f, /(^|[\s_-])(ways?|formas|opciones)([\s_-]|$)/) && n >= 2 && n <= 3) {
    return pick('ways', { title, wayCount: n, ways: rows(f.items, n, (it) => `[Etiqueta] | [${it.title}] | [${it.text}] | [Beneficio 1]; [Beneficio 2] | [Botón]`) })
  }
  if (has(f, /testimon|resen|reseñ|opinion|review|casos|historias/)) return pick('testimonials', { title, count: Math.min(Math.max(n, 3), 12) }, 'carrusel-flechas')
  if (has(f, /logo|marca|brand|client|partner|aliados/) && f.imgs >= 3) return pick('trustBar', { caption: title ?? '[Marcas que confiaron en ti]', logoCount: Math.min(f.imgs, 8) })
  const portfolio = () => pick('portfolio', { title, pieceCount: Math.min(Math.max(f.imgs, 3), 12) }, f.imgs > 8 ? 'carrusel' : 'grid')
  if (has(f, /portaf|portfolio|galer|gallery|trabajos|work/)) return portfolio()
  // Pistas de tarjetas: muchas se llenan con JavaScript, así que el HTML
  // puede venir sin tarjetas; igual se reconoce por su clase.
  if (hasIn(f, /(^|[\s_-])(track|track-sec|rail|slider|carousel|swiper|splide|glide)([\s_-]|$)/)) {
    const count = Math.min(Math.max(n, 3), 8)
    return pick('cardTrack', { title, subtitle: body, cardCount: count, cards: rows(f.items, count, (it, i) => `[${i + 1}] | [${it.title}] | [${it.text}]`) })
  }
  if (f.imgs >= 5) return portfolio()
  if (has(f, /precio|pricing|tarifa|planes/) || f.prices >= 3) {
    if (/toggle|switch|billing|anual|annual/.test(f.inner)) return pick('pricingToggle', { title, ctaText: cta })
    if (n >= 2) {
      const count = Math.min(n, 4)
      return pick('pricing', { title, planCount: count, tiers: rows(f.items, count, (it) => `[${it.title || 'Plan'}] | [precio] | USD`), highlightedPlan: true }, 'tarjetas-precio-exacto')
    }
    return pick('pricingToggle', { title, ctaText: cta })
  }
  if (has(f, /proceso|pasos|steps|process|timeline|como-trabaj/) || f.ol >= 3 || /pstep|step/.test(f.inner)) {
    const count = Math.min(Math.max(n || f.ol || 4, 3), 6)
    return pick('stepsLine', { title, subtitle: body, stepCount: count, steps: rows(f.items, count, (it) => `[${it.title || 'Paso'}] | [${it.text || 'Detalle'}]`) })
  }
  if (has(f, /about|sobre|quien|bio|conoce|fotograf|equipo|team|who/)) {
    return f.imgs ? pick('aboutArch', { title, bio: body }) : pick('about', { title, bio: body })
  }
  if (f.hasIframe) return pick('videoBanda', { caption: f.heading ? inspired(f.heading) : '' })
  if (has(f, /final|cierre|agenda|contact/) || (f.index >= f.total - 3 && f.buttons.length && f.text.length < 500)) {
    return pick('finalCta', { title, buttonText: cta, align: 'center' })
  }
  if (f.statLike >= 3 && f.text.length < 300) return pick('stats', { statCount: Math.min(f.statLike, 5) })
  if (n >= 3) {
    const count = Math.min(n, 8)
    if (count >= 5) return pick('formatList', { title, rowCount: count, rows: rows(f.items, count, (it) => `[${it.title}] | [${it.text}]`) })
    return pick('garantias', { title, cardCount: Math.min(count, 4), cards: rows(f.items, Math.min(count, 4), (it) => `[ícono] | [${it.title}] | [${it.text}]`) })
  }
  if (!f.heading && f.text.length < 25) return null
  if (!f.heading && f.text.length < 260) return pick('statement', { text: inspired(f.text) })
  return pick('problem', { title, body })
}

// Quita props que el esquema no conoce y deja cada lista del largo de su contador.
function sanitize(entry) {
  const schema = BLOCK_SCHEMA[entry.type]
  const keys = new Set(schema.fields.map((x) => x.key))
  const props = Object.fromEntries(Object.entries(entry.overrideProps).filter(([k]) => keys.has(k)))
  schema.fields.forEach((field) => {
    if (field.type === 'number' && props[field.key] != null) props[field.key] = Math.min(field.max ?? 99, Math.max(field.min ?? 0, props[field.key]))
  })
  schema.fields
    .filter((field) => field.type === 'repeatable' && props[field.key])
    .forEach((field) => {
      const count = props[field.countField] ?? schema.fields.find((x) => x.key === field.countField)?.default
      const list = props[field.key].slice(0, count)
      while (list.length < count) list.push(field.default)
      props[field.key] = list
    })
  const variant = entry.variant && schema.variants?.includes(entry.variant) ? entry.variant : undefined
  return { ...entry, variant, overrideProps: props }
}

// ---------- Colores y tipografías ----------

function hexToRgb(hex) {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (h.length !== 6) return null
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}
function lum(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0.5
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
function sat(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  const max = Math.max(...rgb) / 255
  const min = Math.min(...rgb) / 255
  return max === 0 ? 0 : (max - min) / max
}

function detectTheme(doc, cssText) {
  const vars = {}
  ;(cssText.match(/--[\w-]+\s*:\s*[^;}]+/g) ?? []).forEach((d) => {
    const [k, ...v] = d.split(':')
    vars[k.trim()] = v.join(':').trim()
  })
  const resolve = (val) => {
    if (!val) return null
    const ref = val.match(/var\((--[\w-]+)/)
    const out = ref ? vars[ref[1]] : val
    const hex = out?.match(/#[0-9a-f]{3,6}\b/i)
    return hex ? hex[0].toLowerCase() : null
  }
  const rule = (selRe, prop) => {
    const re = new RegExp(`(?:^|[}\\s,])${selRe}\\s*\\{[^}]*?(?:^|[;{\\s])${prop}\\s*:\\s*([^;}]+)`, 'i')
    return cssText.match(re)?.[1]?.trim() ?? null
  }
  const bg = resolve(rule('body', 'background(?:-color)?')) ?? resolve(rule('html', 'background(?:-color)?'))
  const text = resolve(rule('body', 'color'))
  const allHex = [...new Set((cssText.match(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi) ?? []).map((h) => h.toLowerCase()))]
  const freq = (h) => (cssText.toLowerCase().split(h).length - 1)
  // Acento: el color saturado más usado. Una variable cuenta por cada
  // var(--nombre) que la usa, con bonus si se llama accent, brand, primary,
  // y, gold o amarillo; las de estado (error, éxito, aviso) no compiten.
  const scores = {}
  Object.entries(vars).forEach(([name, value]) => {
    const hex = value.match(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/i)?.[0]?.toLowerCase()
    if (!hex || sat(hex) <= 0.45 || lum(hex) <= 0.08) return
    if (/err|error|danger|ok|success|warn|neg|red|rojo|alert/i.test(name)) return
    const uses = cssText.split(`var(${name})`).length - 1
    const bonus = /accent|brand|primary|main|gold|amarillo|yellow|^--y$|^--a$/i.test(name) ? 6 : 0
    scores[hex] = (scores[hex] ?? 0) + uses + bonus
  })
  allHex.filter((h) => sat(h) > 0.45 && lum(h) > 0.08).forEach((h) => (scores[h] = (scores[h] ?? 0) + freq(h) * 0.5))
  const accent = Object.entries(scores).sort((x, y) => y[1] - x[1])[0]?.[0] ?? null

  const families = []
  doc.querySelectorAll('link[href*="fonts.googleapis.com"]').forEach((l) => {
    const href = l.getAttribute('href')
    ;(href.match(/family=([^:&;]+)/g) ?? []).forEach((m) => families.push(decodeURIComponent(m.slice(7)).replace(/\+/g, ' ')))
  })
  const fontOf = (sel) => rule(sel, 'font-family') ?? rule(sel, 'font')
  const headFont = (fontOf('h1') ?? '').match(/["']?([A-Z][\w ]+?)["']?\s*,/)?.[1] ?? families[0]
  const bodyFont = (fontOf('body') ?? '').match(/["']?([A-Z][\w ]+?)["']?\s*,/)?.[1] ?? families[1] ?? families[0]
  const stack = (name) => (name ? `'${name}', system-ui, sans-serif` : null)

  if (!bg && !accent && !headFont) return null
  const page = bg ?? '#ffffff'
  const light = lum(page) > 0.4
  const ink = text ?? (light ? '#181818' : '#f8f8f8')
  const darkest = allHex.filter((h) => lum(h) < 0.03).sort((a, b) => freq(b) - freq(a))[0]
  const surface = light ? darkest ?? '#181818' : allHex.filter((h) => lum(h) > lum(page) && lum(h) < 0.06)[0] ?? '#1a1a1a'
  return {
    headingFont: stack(headFont),
    bodyFont: stack(bodyFont),
    backgroundColor: page,
    textColor: ink,
    primaryColor: surface,
    primaryTextColor: light ? page : ink,
    accentColor: accent ?? (light ? '#181818' : '#f8f8f8'),
    accentTextColor: accent && lum(accent) < 0.4 ? '#ffffff' : '#141414',
    fonts: families,
  }
}

async function collectCss(doc, page) {
  let css = [...doc.querySelectorAll('style')].map((s) => s.textContent).join('\n')
  const links = [...doc.querySelectorAll('link[rel~="stylesheet"][href]')]
    .map((l) => l.getAttribute('href'))
    .filter((h) => !/^(https?:)?\/\//i.test(h))
    .slice(0, 4)
  for (const href of links) {
    const url = href.startsWith('/') ? page.root + href.slice(1) : page.base + href
    const text = await fetchText(url).catch(() => null)
    if (text) css += `\n${text}`
  }
  return css
}

// ---------- Entrada principal ----------

export async function importRepo(input, { force = false } = {}) {
  const ref = parseRepoInput(input)
  if (!ref) throw new Error('Ese link no parece de un repo de GitHub. Pega algo como github.com/usuario/repositorio.')
  const key = repoKey(ref)
  if (!force) {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_PREFIX + key) ?? 'null')
      if (cached && Date.now() - cached.at < CACHE_MS) return cached.result
    } catch {
      /* sin caché */
    }
  }
  const page = await findPage(ref)
  if (!page) {
    throw new Error('No encontramos un index.html en ese repo. Revisa que sea público; si tu página vive en otra carpeta, pega el link directo al archivo .html.')
  }
  const doc = new DOMParser().parseFromString(page.html, 'text/html')
  const cands = sectionCandidates(doc)
  if (cands.length < 2 && doc.querySelector('#root,#app,#__next') && doc.querySelector('script[type=module],script[src]')) {
    throw new Error('Esta página se arma con JavaScript (React, Vite o similar) y su index.html no trae las secciones. Pega un repo de HTML, CSS y JS, o el archivo .html ya publicado.')
  }
  const entries = cands
    .map((el, i) => {
      const entry = classify(featuresOf(el, i, cands.length))
      return entry && { ...entry, surface: surfaceOf(el) }
    })
    .filter(Boolean)
    .filter((e, i, all) => !(e.type === 'header' && all.findIndex((x) => x.type === 'header') !== i))
    .map(sanitize)
  if (entries.length === 0) throw new Error('Encontramos el archivo, pero no tiene secciones que podamos leer.')
  const css = await collectCss(doc, page)
  const theme = detectTheme(doc, css)
  const result = {
    key,
    repoUrl: `https://github.com/${ref.owner}/${ref.repo}`,
    pageUrl: page.url,
    name: clean(doc.querySelector('title')?.textContent, 60) || `${ref.owner}/${ref.repo}`,
    entries: entries.map((e) => ({ ...e, sourceRepo: `https://github.com/${ref.owner}/${ref.repo}` })),
    theme,
  }
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ at: Date.now(), result }))
  } catch {
    /* sin espacio: se vuelve a leer la próxima vez */
  }
  return result
}

// Repos que el alumno agregó, guardados en su compu.
const MINE_KEY = 'mk-wf-mis-inspiraciones'
export function loadMyRepos() {
  try {
    return JSON.parse(localStorage.getItem(MINE_KEY) ?? '[]')
  } catch {
    return []
  }
}
export function saveMyRepos(list) {
  try {
    localStorage.setItem(MINE_KEY, JSON.stringify(list.slice(0, 20)))
  } catch {
    /* sin almacenamiento: la lista dura esta visita */
  }
}

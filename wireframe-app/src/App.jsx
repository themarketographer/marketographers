import { useState } from 'react'
import { BuilderProvider, useBuilder } from './state/BuilderContext'
import { RADIUS_VALUES } from './data/themePresets'
import Wizard from './components/Wizard/Wizard'
import BlockPalette from './components/Palette/BlockPalette'
import Canvas from './components/Canvas/Canvas'
import PropertiesPanel from './components/PropertiesPanel/PropertiesPanel'
import ThemePanel from './components/Theme/ThemePanel'
import AnimationPanel from './components/Animation/AnimationPanel'
import ResponsiveToggle from './components/Preview/ResponsiveToggle'
import ExportConfigForm from './components/Export/ExportConfigForm'
import ExportModal from './components/Export/ExportModal'
import ConfirmDialog from './components/Shared/ConfirmDialog'
import BrandMark from './components/Brand/BrandMark'
import ThemeToggle from './components/Brand/ThemeToggle'
import CommunityNotice from './components/Brand/CommunityNotice'
import { useAppTheme } from './utils/appTheme'
import Icon from './components/Shared/Icon'

const TABS = [
  { id: 'properties', label: 'Contenido' },
  { id: 'theme', label: 'Estilo' },
  { id: 'animation', label: 'Animación' },
]

// Control segmentado: una sola píldora que se desliza hasta la pestaña
// activa (transform, 220ms), en vez de tres fondos que se prenden y apagan.
function PanelTabs({ value, onChange }) {
  const index = TABS.findIndex((t) => t.id === value)
  return (
    <div className="wf-tabs" role="tablist" style={{ '--n': TABS.length, '--x': index }}>
      <span className="wf-tabs-pill" aria-hidden="true" />
      {TABS.map((t) => (
        <button key={t.id} role="tab" aria-selected={value === t.id} onClick={() => onChange(t.id)}>
          {t.label}
        </button>
      ))}
    </div>
  )
}

function CollapseHandle({ collapsed, onClick, side }) {
  // La flecha apunta hacia donde se va a mover el panel al tocarla.
  const pointsLeft = side === 'left' ? !collapsed : collapsed
  return (
    <button
      onClick={onClick}
      aria-label={collapsed ? 'Mostrar panel' : 'Ocultar panel'}
      title={collapsed ? 'Mostrar panel' : 'Ocultar panel'}
      className="wf-handle"
    >
      <Icon name="chevron" size={13} strokeWidth={2.2} className={pointsLeft ? 'rotate-180' : ''} />
    </button>
  )
}

// Texto corto del estado de guardado, al lado del botón de reiniciar — así
// el alumno ve que no necesita hacer nada para no perder su trabajo. Sin
// guardado todavía (recién abrió la herramienta, canvas vacío) no muestra
// nada, para no meter ruido antes de que haya algo que guardar.
function SaveIndicator({ lastSavedAt }) {
  if (!lastSavedAt) return null
  return (
    <span className="hidden items-center gap-1.5 text-[11px] md:flex" style={{ color: 'var(--app-muted)' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--app-ok)', display: 'inline-block' }} />
      Guardado en esta compu
    </span>
  )
}

function BuilderLayout({ theme, onToggleTheme }) {
  const { state, dispatch, lastSavedAt, clearSavedProgress } = useBuilder()
  const [selectedBlockId, setSelectedBlockId] = useState(null)
  const [rightTab, setRightTab] = useState('properties') // 'properties' | 'theme' | 'animation'
  const [exportStep, setExportStep] = useState(null) // null | 'config' | 'result'
  const [trackingConfig, setTrackingConfig] = useState(null)
  const [paletteCollapsed, setPaletteCollapsed] = useState(() => window.innerWidth < 900)
  const [panelCollapsed, setPanelCollapsed] = useState(() => window.innerWidth < 900)
  const [confirmingRestart, setConfirmingRestart] = useState(false)

  // Elegir un bloque lleva a sus controles: si estaba abierta la pestaña de
  // estilo global salta a Contenido, y en pantalla grande abre el panel.
  function selectBlock(id) {
    setSelectedBlockId(id)
    if (!id) return
    setRightTab((t) => (t === 'theme' ? 'properties' : t))
    if (window.innerWidth >= 900) setPanelCollapsed(false)
  }

  function handleRestartClick() {
    if (state.canvas.blocks.length === 0) {
      dispatch({ type: 'WIZARD_RESTART' })
      clearSavedProgress()
    } else {
      setConfirmingRestart(true)
    }
  }

  return (
    <div className="flex h-full flex-col" style={{ background: 'var(--app-bg)' }}>
      <header
        className="flex items-center justify-between border-b px-4 py-2.5"
        style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)' }}
      >
        <div className="flex items-center gap-3">
          <BrandMark theme={theme} size={28} compact />
          <h1 className="hidden border-l pl-3 text-xs font-medium sm:block" style={{ color: 'var(--app-muted)', borderColor: 'var(--app-border)' }}>
            MarkeTool: Crea tu wireframe
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <SaveIndicator lastSavedAt={lastSavedAt} />
          <ResponsiveToggle />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            onClick={handleRestartClick}
            className="mk-press rounded-full border px-3 py-1.5 text-xs font-medium hover:bg-[var(--app-hover)]"
            style={{ borderColor: 'var(--app-border)', color: 'var(--app-muted)' }}
          >
            Reiniciar
          </button>
          <button
            onClick={() => setExportStep('config')}
            className="mk-press rounded-full px-4 py-1.5 text-xs font-semibold"
            style={{ background: 'var(--app-accent)', color: 'var(--app-accent-ink)' }}
          >
            Exportar
          </button>
        </div>
      </header>
      <CommunityNotice />
      <p className="px-4 py-1.5 text-center text-[11px] md:hidden" style={{ background: 'var(--app-hover)', color: 'var(--app-muted)' }}>
        Esta herramienta rinde más en una pantalla grande. Abre las barras laterales con las flechas.
      </p>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {!paletteCollapsed && <BlockPalette />}
        <CollapseHandle side="left" collapsed={paletteCollapsed} onClick={() => setPaletteCollapsed((c) => !c)} />
        <Canvas selectedBlockId={selectedBlockId} onSelectBlock={selectBlock} />
        <CollapseHandle side="right" collapsed={panelCollapsed} onClick={() => setPanelCollapsed((c) => !c)} />
        {!panelCollapsed && (
          // min-h-0 acá es lo que faltaba: sin esto, este contenedor crecía
          // a la altura de TODO su contenido (tabs + panel largo) en vez de
          // quedarse acotado a la altura disponible de la fila, y entonces
          // el overflow-y-auto de los paneles de abajo nunca se activaba —
          // el contenido de más quedaba fuera de pantalla, inalcanzable.
          <div className="wf-side-right flex min-h-0 shrink-0 flex-col">
            <div className="wf-side shrink-0 border-l px-3 pb-1 pt-3">
              <PanelTabs value={rightTab} onChange={setRightTab} />
            </div>
            {rightTab === 'properties' && <PropertiesPanel blockId={selectedBlockId} />}
            {rightTab === 'theme' && <ThemePanel />}
            {rightTab === 'animation' && <AnimationPanel blockId={selectedBlockId} />}
          </div>
        )}
      </div>
      {exportStep === 'config' && (
        <ExportConfigForm
          onCancel={() => setExportStep(null)}
          onContinue={(config) => {
            setTrackingConfig(config)
            setExportStep('result')
          }}
        />
      )}
      {exportStep === 'result' && (
        <ExportModal trackingConfig={trackingConfig} onClose={() => setExportStep(null)} />
      )}
      {confirmingRestart && (
        <ConfirmDialog
          title="¿Reiniciar el wizard?"
          body="Se pierde el wireframe actual, incluido el progreso guardado en esta compu — esta acción no se puede deshacer."
          confirmLabel="Sí, reiniciar"
          onCancel={() => setConfirmingRestart(false)}
          onConfirm={() => {
            dispatch({ type: 'WIZARD_RESTART' })
            clearSavedProgress()
            setConfirmingRestart(false)
          }}
        />
      )}
    </div>
  )
}

function ThemeVarsRoot({ children }) {
  const { state } = useBuilder()
  const { theme } = state
  return (
    <div
      className="h-full"
      style={{
        '--font-heading': theme.headingFont,
        '--font-body': theme.bodyFont,
        '--color-primary': theme.primaryColor,
        '--color-bg': theme.backgroundColor,
        '--color-text': theme.textColor,
        '--color-accent': theme.accentColor,
        '--color-accent-ink': theme.accentTextColor,
        '--color-on-primary': theme.primaryTextColor ?? theme.backgroundColor,
        // Copias fijas del tema: las superficies por sección (data/surfaces.js)
        // pisan las --color-* dentro del bloque y necesitan leer el original.
        '--root-primary': theme.primaryColor,
        '--root-on-primary': theme.primaryTextColor ?? theme.backgroundColor,
        '--root-accent': theme.accentColor,
        '--root-accent-ink': theme.accentTextColor,
        '--radius': RADIUS_VALUES[theme.radius] ?? RADIUS_VALUES.soft,
      }}
    >
      {children}
    </div>
  )
}

function AppShell({ theme, onToggleTheme }) {
  const { state } = useBuilder()
  const { wizard } = state

  // El wizard solo decide el borrador inicial y qué tracking sugerir al
  // exportar — nunca bloquea el acceso al canvas. Antes, algunas
  // combinaciones de respuestas (embudos que en funnels.md no usan landing)
  // mostraban un mensaje de "no la necesitás" en vez del builder, lo cual no
  // tiene sentido en una herramienta cuyo único propósito es armar landings:
  // ahora esos casos abren el canvas igual, con un borrador simple.
  if (!wizard.completed) return <Wizard theme={theme} onToggleTheme={onToggleTheme} />
  return <BuilderLayout theme={theme} onToggleTheme={onToggleTheme} />
}

export default function App() {
  const [theme, toggleTheme] = useAppTheme()
  return (
    <BuilderProvider>
      <ThemeVarsRoot>
        <AppShell theme={theme} onToggleTheme={toggleTheme} />
      </ThemeVarsRoot>
    </BuilderProvider>
  )
}

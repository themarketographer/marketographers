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

function CollapseHandle({ collapsed, onClick, side }) {
  return (
    <button
      onClick={onClick}
      aria-label={collapsed ? 'Mostrar panel' : 'Ocultar panel'}
      // items-start + pt-2 en vez de items-center: la flecha queda pegada
      // arriba del todo, al lado del header, en vez de perdida en el medio
      // vertical del panel donde es fácil no verla.
      className="flex w-4 shrink-0 items-start justify-center border-black/10 pt-2 text-xs hover:bg-neutral-100"
      style={{ background: 'var(--app-bg)', [side === 'left' ? 'borderRight' : 'borderLeft']: '1px solid var(--app-border)' }}
    >
      {side === 'left' ? (collapsed ? '›' : '‹') : collapsed ? '‹' : '›'}
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
    <span className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--app-muted)' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2fae60', display: 'inline-block' }} />
      Guardado en esta compu
    </span>
  )
}

function BuilderLayout() {
  const { state, dispatch, lastSavedAt, clearSavedProgress } = useBuilder()
  const [selectedBlockId, setSelectedBlockId] = useState(null)
  const [rightTab, setRightTab] = useState('properties') // 'properties' | 'theme' | 'animation'
  const [exportStep, setExportStep] = useState(null) // null | 'config' | 'result'
  const [trackingConfig, setTrackingConfig] = useState(null)
  const [paletteCollapsed, setPaletteCollapsed] = useState(false)
  const [panelCollapsed, setPanelCollapsed] = useState(false)
  const [confirmingRestart, setConfirmingRestart] = useState(false)

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
        style={{ background: '#ffffff', borderColor: 'var(--app-border)' }}
      >
        <h1 className="font-heading-app text-sm font-extrabold tracking-tight" style={{ color: 'var(--app-ink)' }}>
          MarkeTool: Crea tu wireframe
        </h1>
        <div className="flex items-center gap-3">
          <SaveIndicator lastSavedAt={lastSavedAt} />
          <ResponsiveToggle />
          <button
            onClick={handleRestartClick}
            className="rounded-full border px-3 py-1.5 text-xs font-medium hover:bg-neutral-50"
            style={{ borderColor: 'var(--app-border)', color: 'var(--app-muted)' }}
          >
            Reiniciar
          </button>
          <button
            onClick={() => setExportStep('config')}
            className="rounded-full px-4 py-1.5 text-xs font-semibold"
            style={{ background: 'var(--app-accent)', color: 'var(--app-accent-ink)' }}
          >
            Exportar
          </button>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {!paletteCollapsed && <BlockPalette />}
        <CollapseHandle side="left" collapsed={paletteCollapsed} onClick={() => setPaletteCollapsed((c) => !c)} />
        <Canvas selectedBlockId={selectedBlockId} onSelectBlock={setSelectedBlockId} />
        <CollapseHandle side="right" collapsed={panelCollapsed} onClick={() => setPanelCollapsed((c) => !c)} />
        {!panelCollapsed && (
          // min-h-0 acá es lo que faltaba: sin esto, este contenedor crecía
          // a la altura de TODO su contenido (tabs + panel largo) en vez de
          // quedarse acotado a la altura disponible de la fila, y entonces
          // el overflow-y-auto de los paneles de abajo nunca se activaba —
          // el contenido de más quedaba fuera de pantalla, inalcanzable.
          <div className="flex min-h-0 shrink-0 flex-col">
            <div className="flex shrink-0 border-b text-xs font-medium" style={{ borderColor: 'var(--app-border)', background: '#fafafa' }}>
              <button
                onClick={() => setRightTab('properties')}
                className="flex-1 px-3 py-2"
                style={rightTab === 'properties' ? { background: '#fff', color: 'var(--app-ink)' } : { color: 'var(--app-muted)' }}
              >
                Propiedades
              </button>
              <button
                onClick={() => setRightTab('theme')}
                className="flex-1 px-3 py-2"
                style={rightTab === 'theme' ? { background: '#fff', color: 'var(--app-ink)' } : { color: 'var(--app-muted)' }}
              >
                Estilo
              </button>
              <button
                onClick={() => setRightTab('animation')}
                className="flex-1 px-3 py-2"
                style={rightTab === 'animation' ? { background: '#fff', color: 'var(--app-ink)' } : { color: 'var(--app-muted)' }}
              >
                Animación
              </button>
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
        '--radius': RADIUS_VALUES[theme.radius] ?? RADIUS_VALUES.soft,
      }}
    >
      {children}
    </div>
  )
}

function AppShell() {
  const { state } = useBuilder()
  const { wizard } = state

  // El wizard solo decide el borrador inicial y qué tracking sugerir al
  // exportar — nunca bloquea el acceso al canvas. Antes, algunas
  // combinaciones de respuestas (embudos que en funnels.md no usan landing)
  // mostraban un mensaje de "no la necesitás" en vez del builder, lo cual no
  // tiene sentido en una herramienta cuyo único propósito es armar landings:
  // ahora esos casos abren el canvas igual, con un borrador simple.
  if (!wizard.completed) return <Wizard />
  return <BuilderLayout />
}

export default function App() {
  return (
    <BuilderProvider>
      <ThemeVarsRoot>
        <AppShell />
      </ThemeVarsRoot>
    </BuilderProvider>
  )
}

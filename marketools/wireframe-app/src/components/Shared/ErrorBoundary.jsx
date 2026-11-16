import { Component } from 'react'

const STORAGE_KEY = 'marketools-wireframe-progress-v1'

// Si un bloque falla al dibujarse, en vez de dejar la pantalla en blanco se muestra
// un aviso con la opción de recargar o bajar el avance guardado.
export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.error('Wireframe: error al dibujar', error)
  }

  descargar = () => {
    let texto = ''
    try {
      texto = localStorage.getItem(STORAGE_KEY) || ''
    } catch {
      // Sin acceso al almacenamiento: se descarga un archivo vacío.
    }
    const url = URL.createObjectURL(new Blob([texto], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'mi-avance-wireframe.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main style={{ maxWidth: 480, margin: '15vh auto', padding: 24, fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
        <h1 style={{ fontSize: 20, marginBottom: 12 }}>Algo falló al dibujar tu wireframe.</h1>
        <p style={{ marginBottom: 20 }}>Tu avance está guardado en este navegador.</p>
        <button type="button" onClick={() => location.reload()} style={{ padding: '10px 18px', marginRight: 8 }}>
          Recargar
        </button>
        <button type="button" onClick={this.descargar} style={{ padding: '10px 18px' }}>
          Descargar mi avance
        </button>
      </main>
    )
  }
}

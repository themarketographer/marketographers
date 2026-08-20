// Calcula en qué índice de la lista debería insertarse un bloque, según
// la posición vertical del cursor respecto al punto medio de cada bloque
// ya presente en el canvas.
export function calcInsertIndex(blockRects, cursorY) {
  for (let i = 0; i < blockRects.length; i++) {
    const midpoint = blockRects[i].top + blockRects[i].height / 2
    if (cursorY < midpoint) return i
  }
  return blockRects.length
}

// Lee los rects actuales de los bloques del canvas desde el DOM.
export function readBlockRects(containerEl) {
  const nodes = containerEl.querySelectorAll('[data-block-id]')
  return Array.from(nodes).map((node) => {
    const rect = node.getBoundingClientRect()
    return { id: node.getAttribute('data-block-id'), top: rect.top, height: rect.height }
  })
}

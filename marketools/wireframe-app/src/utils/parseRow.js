// Parsea una fila de un campo `repeatable` codificada como "a | b | c",
// mismo patrón que ya usa Estadísticas. Devuelve un array de strings
// (recortados), con longitud fija rellenada con '' si faltan partes.
export function parseRow(raw, partCount) {
  const parts = (raw ?? '').split('|').map((p) => p.trim())
  while (parts.length < partCount) parts.push('')
  return parts.slice(0, partCount)
}

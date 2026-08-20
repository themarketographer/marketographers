// Parser liviano de énfasis en texto: **negrita**, *itálica*, __subrayado__,
// ~~tipografía elegante~~, ^^glow^^ — los dos últimos son independientes y se
// pueden combinar en el mismo texto. No es un editor WYSIWYG — el alumno
// escribe la sintaxis a mano en los campos de texto y el bloque la renderiza
// formateada en el canvas y en el export. Devuelve un array de nodos React
// (o el string tal cual si no hay marcado), pensado para usarse como
// children de un elemento de texto.

const PATTERN = /(\*\*.+?\*\*|\*.+?\*|__.+?__|~~.+?~~|\^\^.+?\^\^)/g

export function renderEmphasis(text) {
  if (typeof text !== 'string' || !PATTERN.test(text)) return text
  PATTERN.lastIndex = 0
  const parts = text.split(PATTERN)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('__') && part.endsWith('__')) {
      return <u key={i}>{part.slice(2, -2)}</u>
    }
    if (part.startsWith('~~') && part.endsWith('~~')) {
      return (
        <span key={i} className="kw-elegant">
          {part.slice(2, -2)}
        </span>
      )
    }
    if (part.startsWith('^^') && part.endsWith('^^')) {
      return (
        <span key={i} className="kw-glow">
          {part.slice(2, -2)}
        </span>
      )
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return part
  })
}

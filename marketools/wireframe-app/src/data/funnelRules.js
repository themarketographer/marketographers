// Resuelve qué embudo (1 a 6) corresponde a las 3 respuestas del wizard.
//
// Fuente: skill "photographer-landing", references/funnels.md, tabla maestra
// y sección "Cómo elegir, en tres preguntas". Esa fuente da candidatos por
// pregunta (ej. "$500 a $1.500 -> embudos 2 o 3"), no una función única, así
// que cuando la intersección de las 3 respuestas deja más de un candidato, o
// ninguno, hace falta una regla de desempate que la fuente no da. Reglas
// confirmadas con Pablo:
//
//   - Empate entre 2+ embudos válidos -> elegir el más sofisticado (mayor número).
//   - Ningún candidato válido -> relajar la pregunta 2 (velocidad de respuesta,
//     la menos determinante) y recalcular solo con precio (Q1) x cotización (Q3).
//     Si aun así no hay candidato, se trata como los embudos 1/6 (sin landing).
//
// Solo los embudos 2, 3, 4 y 5 tienen un borrador armado (ver
// funnelDrafts.js). El wizard nunca bloquea el acceso al canvas: para los
// embudos 1 y 6, o un `null` (combinación sin candidato), el alumno igual
// entra al builder y arma una landing simple (ver SIMPLE_DRAFT).

const Q1_CANDIDATES = {
  a: [1, 5, 6], // <$100
  b: [1, 2],    // $100-500
  c: [2, 3],    // $500-1.500
  d: [3, 4],    // >$1.500
}

function applyQ2(list, q2) {
  if (q2 === 'b') return list.filter((f) => ![1, 6].includes(f)) // horas: evitar 1 y 6
  if (q2 === 'c') return list.filter((f) => [2, 5].includes(f))  // día siguiente: solo 2 o 5
  return list // minutos: sin restricción
}

export function resolveFunnel({ q1, q2, q3 }) {
  if (q3 === 'b') return 5 // precio fijo -> siempre embudo 5

  const base = Q1_CANDIDATES[q1].filter((f) => f !== 5) // se cotiza: excluye 5

  let candidates = applyQ2(base, q2)

  if (candidates.length === 0) {
    // Sin candidato: relajar Q2 y recalcular solo con Q1 x Q3
    candidates = base
  }

  if (candidates.length === 0) return null

  const withLanding = candidates.filter((f) => [2, 3, 4, 5].includes(f))
  if (withLanding.length > 0) return Math.max(...withLanding)

  return candidates[0] // 1 o 6 -> sin canvas
}

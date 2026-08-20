// Las 3 preguntas cerradas del wizard, en el orden y texto exactos de
// `funnels.md` (skill photographer-landing), sección "Cómo elegir, en tres preguntas".
export const WIZARD_QUESTIONS = [
  {
    key: 'q1',
    question: '¿Cuánto cobras, en promedio, por trabajo?',
    options: [
      { value: 'a', label: 'Menos de $100' },
      { value: 'b', label: '$100 a $500' },
      { value: 'c', label: '$500 a $1.500' },
      { value: 'd', label: 'Más de $1.500' },
    ],
  },
  {
    key: 'q2',
    question: '¿Cuánto tardas hoy en responder un mensaje de un cliente nuevo?',
    options: [
      { value: 'a', label: 'Minutos' },
      { value: 'b', label: 'Horas' },
      { value: 'c', label: 'A veces al día siguiente' },
    ],
  },
  {
    key: 'q3',
    question: '¿Tu servicio se cotiza caso por caso o tiene precio fijo?',
    options: [
      { value: 'a', label: 'Se cotiza' },
      { value: 'b', label: 'Precio fijo' },
    ],
  },
]

// Eventos estándar de conversión (Meta) que el alumno puede asignarle a un
// botón desde el formulario de export, en vez de depender solo de la
// sugerencia genérica por embudo. Vocabulario alineado con
// codigo-tracking.md de la skill photographer-landing.

export const STANDARD_EVENTS = [
  { value: 'PageView', label: 'PageView' },
  { value: 'ViewContent', label: 'ViewContent' },
  { value: 'Contact', label: 'Contact (chat directo de venta)' },
  { value: 'Lead', label: 'Lead (suscriptor / formulario)' },
  { value: 'Schedule', label: 'Schedule (reserva confirmada, vía webhook)' },
  { value: 'InitiateCheckout', label: 'InitiateCheckout' },
  { value: 'Purchase', label: 'Purchase' },
  { value: 'CompleteRegistration', label: 'CompleteRegistration' },
]

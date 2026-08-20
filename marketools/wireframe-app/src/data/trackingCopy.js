// Texto de tracking del prompt maestro, según el embudo resuelto en el wizard.
// Vocabulario alineado con los archivos reales que arman el HTML final
// (skill photographer-landing: codigo-tracking.md, pixels-guide.md), para
// que este export no invente nombres de evento distintos a los que ese
// código de verdad dispara.

export const TRACKING_REMINDER_NO_PIXEL =
  'Todavía no hay un ID de Meta Pixel ni de Google Analytics 4 cargados. Dejá el bloque de tracking del <head> con comentarios placeholder: `<!-- META PIXEL: pegar aquí -->` y `<!-- GOOGLE TAG (GA4): pegar aquí -->`, para completarlos apenas existan esas cuentas.'

export const TRACKING_REMINDER_WITH_PIXEL =
  'El código de Meta Pixel y/o Google Analytics 4 de abajo va tal cual en el <head>, antes de </head>, en TODAS las páginas del sitio (landing, gracias, blog si existe). No inventes otro pixel ni otro ID: usá exactamente el que está acá.'

export function buildTrackingSection(funnelId) {
  switch (funnelId) {
    case 2:
      return {
        title: 'Tracking (embudo 2 — Ad → Landing → WhatsApp)',
        lines: [
          'Botón de WhatsApp (chat directo de venta): dispara el evento estándar `Contact` directo en el `onclick`.',
          'Si además hay un botón a un grupo/comunidad gratuita, ese botón dispara `Lead`, no `Contact` — son eventos distintos (uno es conversación de venta, el otro es un suscriptor).',
          'La sección de precios dispara `ViewContent` cuando entra en el viewport (no al cargar la página): es la señal de que alguien pasó de mirar fotos a mirar cuánto cuesta.',
        ],
      }
    case 3:
      return {
        title: 'Tracking (embudo 3 — Ad → Landing → Agenda)',
        lines: [
          'El botón de "Agendar llamada" dispara SOLO el evento custom `interesado_reunion` (snake_case) en el `onclick` — mide la fricción del widget de Cal.com, no la conversión real.',
          'El evento estándar `Schedule` se dispara únicamente desde el webhook de Cal.com cuando la reserva se confirma en el servidor, nunca desde el clic del botón.',
          'Esta separación es intencional: un clic abre el widget, pero mucha gente lo cierra sin elegir horario. Mandar `Schedule` en el clic le enseña al algoritmo a optimizar hacia gente que no agenda de verdad.',
        ],
      }
    case 4:
      return {
        title: 'Tracking (embudo 4 — Ad → VSL → Agenda → WhatsApp)',
        lines: [
          'Mismo criterio que el embudo 3: el botón de agendar dispara solo `interesado_reunion` en el clic; `Schedule` se dispara desde el webhook de Cal.com cuando la reserva se confirma.',
          'Se agrega un evento custom cuando el visitante llega al 50% del VSL (`VideoView 50%` o equivalente), para armar la audiencia de retargeting más caliente del embudo.',
        ],
      }
    case 5:
      return {
        title: 'Tracking (embudo 5 — Ad → Landing → Pago directo)',
        lines: [
          '`InitiateCheckout` se dispara al cargar la página de gracias/checkout, con el precio real que la persona configuró (nunca un valor fijo copiado del HTML).',
          '`Purchase` se dispara en el clic del botón de pagar / enviar comprobante, con el monto configurado en ese momento.',
          'Si el cobro es manual por QR de transferencia o billetera (sin pasarela de pago), ese `Purchase` mide intención declarada de haber pagado, no un pago verificado — caso muy común en LATAM. El alumno tiene que entender esa diferencia al leer sus reportes.',
        ],
      }
    default:
      return null
  }
}

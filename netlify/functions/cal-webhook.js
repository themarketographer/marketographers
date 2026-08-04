// netlify/functions/cal-webhook.js
//
// Qué hace este archivo, en orden:
// 1. Recibe el POST que Cal.com manda cada vez que alguien agenda una llamada.
// 2. Verifica que el aviso venga realmente de Cal.com (usando CALCOM_WEBHOOK_SECRET).
// 3. Saca el correo, nombre y teléfono de quien agendó.
// 4. Los hashea (SHA256), porque Meta nunca acepta datos personales en texto plano.
// 5. Busca la audiencia "Agendaron llamada de admisiones - Marketographers" en Meta;
//    si no existe todavía, la crea.
// 6. Agrega a esa persona a la audiencia.
// 7. Manda el evento de conversión a la Conversions API de Meta (CAPI).
//
// Variables de entorno que esta función necesita (ya las pusiste en Netlify):
//   META_ACCESS_TOKEN       -> token del Usuario del Sistema "Netlify Cal Webhook"
//   META_AD_ACCOUNT_ID      -> 1282114138849678 (sin el prefijo "act_", se lo agrega el código)
//   META_PIXEL_ID           -> 467504537642622
//   CALCOM_WEBHOOK_SECRET   -> el texto aleatorio que generamos antes

const crypto = require('crypto');

const GRAPH_API_VERSION = 'v21.0';
const AUDIENCE_NAME = 'Agendaron llamada de admisiones - Marketographers';

// ---------- Utilidades ----------

// Meta exige el hash en minúsculas, sin espacios al inicio/final, en SHA256 hexadecimal.
function hashValue(value) {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

// El teléfono debe ir sin +, espacios, guiones ni paréntesis, solo dígitos, con código de país.
function normalizePhone(phone) {
  if (!phone) return null;
  return phone.replace(/[^\d]/g, '');
}

// Verifica que el webhook venga realmente de Cal.com comparando la firma HMAC.
function isValidSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader) return false;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');
  // timingSafeEqual evita que un atacante adivine la firma comparando tiempos de respuesta.
  const a = Buffer.from(expected);
  const b = Buffer.from(signatureHeader);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// ---------- Llamadas a la API de Meta ----------

async function findOrCreateAudience(adAccountId, accessToken) {
  // 1. Buscar si ya existe una audiencia con este nombre exacto.
  const searchUrl = `https://graph.facebook.com/${GRAPH_API_VERSION}/act_${adAccountId}/customaudiences?fields=id,name&limit=200&access_token=${accessToken}`;
  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();

  if (searchData.error) {
    throw new Error(`Error buscando audiencias: ${JSON.stringify(searchData.error)}`);
  }

  const existing = (searchData.data || []).find((aud) => aud.name === AUDIENCE_NAME);
  if (existing) {
    return existing.id;
  }

  // 2. No existe todavía: la creamos.
  const createUrl = `https://graph.facebook.com/${GRAPH_API_VERSION}/act_${adAccountId}/customaudiences`;
  const createRes = await fetch(createUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: AUDIENCE_NAME,
      subtype: 'CUSTOM',
      description: 'Gente que agendó llamada de admisiones vía Cal.com (creada automáticamente)',
      customer_file_source: 'USER_PROVIDED_ONLY',
      access_token: accessToken,
    }),
  });
  const createData = await createRes.json();

  if (createData.error) {
    throw new Error(`Error creando audiencia: ${JSON.stringify(createData.error)}`);
  }

  return createData.id;
}

async function addUserToAudience(audienceId, hashedEmail, hashedPhone, accessToken) {
  const schema = [];
  const row = [];

  if (hashedEmail) {
    schema.push('EMAIL');
    row.push(hashedEmail);
  }
  if (hashedPhone) {
    schema.push('PHONE');
    row.push(hashedPhone);
  }

  if (schema.length === 0) {
    // No hay ni correo ni teléfono válido, no hay nada que agregar.
    return { skipped: true, reason: 'sin correo ni teléfono' };
  }

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${audienceId}/users`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      payload: {
        schema,
        data: [row],
      },
      access_token: accessToken,
    }),
  });
  const data = await res.json();

  if (data.error) {
    throw new Error(`Error agregando usuario a la audiencia: ${JSON.stringify(data.error)}`);
  }

  return data;
}

async function sendConversionEvent({ pixelId, accessToken, hashedEmail, hashedPhone, eventTime, eventId }) {
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${pixelId}/events`;

  const userData = {};
  if (hashedEmail) userData.em = [hashedEmail];
  if (hashedPhone) userData.ph = [hashedPhone];

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: [
        {
          event_name: 'Lead',
          event_time: eventTime,
          event_id: eventId, // evita duplicados si el pixel del navegador también mandó este evento
          action_source: 'system_generated',
          user_data: userData,
        },
      ],
      access_token: accessToken,
    }),
  });
  const data = await res.json();

  if (data.error) {
    throw new Error(`Error mandando evento a CAPI: ${JSON.stringify(data.error)}`);
  }

  return data;
}

// ---------- Handler principal ----------

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const {
    META_ACCESS_TOKEN,
    META_AD_ACCOUNT_ID,
    META_PIXEL_ID,
    CALCOM_WEBHOOK_SECRET,
  } = process.env;

  // 1. Verificar la firma del webhook.
  const signature = event.headers['x-cal-signature-256'] || event.headers['X-Cal-Signature-256'];
  if (!isValidSignature(event.body, signature, CALCOM_WEBHOOK_SECRET)) {
    console.error('Firma inválida, posible aviso falso.');
    return { statusCode: 401, body: 'Firma inválida' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (err) {
    return { statusCode: 400, body: 'JSON inválido' };
  }

  // Solo nos interesa cuando se crea una reserva nueva.
  if (payload.triggerEvent !== 'BOOKING_CREATED') {
    return { statusCode: 200, body: 'Evento ignorado (no es BOOKING_CREATED)' };
  }

  // Solo nos interesan las reservas del tipo de evento "admisiones"
  // (https://cal.com/themarketographer/admisiones). Cualquier otro
  // tipo de evento que tengas en Cal.com se ignora acá.
  const eventSlug = (
    payload.payload?.eventType?.slug ||
    payload.payload?.type ||
    ''
  ).toLowerCase();

  if (eventSlug !== 'admisiones') {
    console.log(`Reserva ignorada: es del tipo de evento "${eventSlug}", no "admisiones".`);
    return { statusCode: 200, body: `Evento ignorado (tipo de evento: ${eventSlug || 'desconocido'})` };
  }

  try {
    const attendee = payload.payload?.attendees?.[0] || {};
    const email = attendee.email || null;
    const phone = attendee.phoneNumber || attendee.phone || null;
    const bookingUid = payload.payload?.uid || `${Date.now()}`;
    const createdAt = payload.payload?.createdAt || payload.createdAt;
    const eventTime = createdAt ? Math.floor(new Date(createdAt).getTime() / 1000) : Math.floor(Date.now() / 1000);

    const hashedEmail = hashValue(email);
    const hashedPhone = hashValue(normalizePhone(phone));

    if (!hashedEmail && !hashedPhone) {
      console.warn('Reserva sin correo ni teléfono, no hay nada que mandar a Meta.');
      return { statusCode: 200, body: 'Sin datos de contacto, nada que hacer' };
    }

    // 2. Encontrar o crear la audiencia.
    const audienceId = await findOrCreateAudience(META_AD_ACCOUNT_ID, META_ACCESS_TOKEN);

    // 3. Agregar a la persona a la audiencia.
    await addUserToAudience(audienceId, hashedEmail, hashedPhone, META_ACCESS_TOKEN);

    // 4. Mandar el evento de conversión server-side.
    await sendConversionEvent({
      pixelId: META_PIXEL_ID,
      accessToken: META_ACCESS_TOKEN,
      hashedEmail,
      hashedPhone,
      eventTime,
      eventId: bookingUid,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, audienceId }),
    };
  } catch (err) {
    console.error('Error procesando el webhook:', err.message);
    // Respondemos 200 igual para que Cal.com no reintente enviar el mismo aviso una y otra vez.
    return { statusCode: 200, body: `Error interno (registrado en logs): ${err.message}` };
  }
};

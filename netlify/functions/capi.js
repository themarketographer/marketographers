// Netlify Function: reenvía eventos al servidor de Meta (Conversions API)
// para complementar al Pixel del navegador y mejorar la cobertura de eventos.
//
// Requiere una variable de entorno en Netlify llamada META_CAPI_TOKEN
// con el token de acceso de la API de conversiones (se genera en
// Events Manager > Configuración > API de conversiones > Generar token de acceso).

const PIXEL_ID = '467504537642622';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const accessToken = process.env.META_CAPI_TOKEN;
  if (!accessToken) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Falta META_CAPI_TOKEN en las variables de entorno de Netlify' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { event_name, event_id, event_source_url, fbp, fbc } = body;

    if (!event_name || !event_id) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Falta event_name o event_id' }) };
    }

    const clientIp =
      event.headers['x-nf-client-connection-ip'] ||
      (event.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      undefined;
    const userAgent = event.headers['user-agent'];

    const userData = {
      client_ip_address: clientIp,
      client_user_agent: userAgent,
    };
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;

    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id,
          event_source_url,
          action_source: 'website',
          user_data: userData,
        },
      ],
    };

    const res = await fetch(
      `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    return {
      statusCode: res.ok ? 200 : 400,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

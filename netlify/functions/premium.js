// Acceso a las MarkeTools premium (incluidas en la membresía).
// La clave del mes se calcula sola a partir de un secreto guardado en Netlify (MK_PREMIUM_SECRETO):
// cambia el día 1 de cada mes sin tocar nada ni volver a publicar. Pablo la publica dentro de la comunidad.
// Quien deja de pagar ya no ve la clave nueva. Los primeros 3 días del mes todavía vale la del mes anterior.
//   POST { clave }                               -> { ok }
//   GET  con Authorization: Bearer <secreto>     -> { mes, clave, proxima }  (para Pablo)
const crypto = require('crypto');

function mesDe(date, offset) { // "2026-11" en hora de Bolivia, con desplazamiento de meses
  const t = new Date(date.getTime() - 4 * 3600 * 1000);
  const d = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth() + (offset || 0), 1));
  return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0');
}
function claveDe(secreto, mes) {
  // 8 letras y números sin los que se confunden al leer (0, O, 1, I).
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', h = crypto.createHmac('sha256', secreto).update(mes).digest();
  let out = ''; for (let i = 0; i < 8; i++) out += abc[h[i] % abc.length];
  return out;
}
function valida(secreto, clave, date) {
  const dia = new Date(date.getTime() - 4 * 3600 * 1000).getUTCDate();
  const ok = [claveDe(secreto, mesDe(date))].concat(dia <= 3 ? [claveDe(secreto, mesDe(date, -1))] : []);
  return ok.indexOf(String(clave || '').trim().toUpperCase()) > -1;
}
const reply = (statusCode, body) => ({ statusCode, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, body: JSON.stringify(body) });

exports.handler = async function (event) {
  const secreto = process.env.MK_PREMIUM_SECRETO || '';
  if (!secreto) return reply(503, { ok: false, error: 'Falta crear la variable MK_PREMIUM_SECRETO en Netlify.' });
  const now = new Date();
  if (event.httpMethod === 'GET') {
    const got = Buffer.from(String((event.headers || {}).authorization || '').replace(/^Bearer\s+/i, '')), exp = Buffer.from(secreto);
    if (got.length !== exp.length || !crypto.timingSafeEqual(got, exp)) return reply(401, { ok: false, error: 'Secreto incorrecto.' });
    return reply(200, { ok: true, mes: mesDe(now), clave: claveDe(secreto, mesDe(now)), proximoMes: mesDe(now, 1), proxima: claveDe(secreto, mesDe(now, 1)) });
  }
  if (event.httpMethod !== 'POST') return reply(405, { ok: false });
  let d; try { d = JSON.parse(event.body || '{}'); } catch (e) { return reply(400, { ok: false }); }
  return valida(secreto, d.clave, now) ? reply(200, { ok: true }) : reply(401, { ok: false, error: 'Esa clave no es la de este mes. La encuentras fijada en la comunidad.' });
};

if (require.main === module) { // node netlify/functions/premium.js
  const assert = require('assert'), s = 'secreto-de-prueba';
  const nov = new Date('2026-11-15T12:00:00Z'), dic2 = new Date('2026-12-02T12:00:00Z'), dic9 = new Date('2026-12-09T12:00:00Z');
  assert.strictEqual(mesDe(new Date('2026-12-01T02:00:00Z')), '2026-11');          // 30 nov, 22:00 en Bolivia
  assert.strictEqual(mesDe(nov, 2), '2027-01');
  const kNov = claveDe(s, '2026-11'), kDic = claveDe(s, '2026-12');
  assert(/^[A-HJ-NP-Z2-9]{8}$/.test(kNov) && kNov !== kDic && kNov !== claveDe('otro', '2026-11'));
  assert(valida(s, kNov.toLowerCase() + ' ', nov) && !valida(s, kDic, nov) && !valida(s, '', nov));
  assert(valida(s, kNov, dic2) && valida(s, kDic, dic2));                           // días de gracia
  assert(!valida(s, kNov, dic9));                                                   // el que dejó de pagar pierde el acceso
  console.log('premium: 9 comprobaciones pasan');
}

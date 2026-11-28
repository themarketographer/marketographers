// Datos compartidos de marketographers.com/viajeposadas (calendario del viaje a Posadas).
// Cada documento es una clave "doc/<colección>/<id>" en Netlify Blobs; "_rev" cambia en cada escritura
// para que los navegadores sepan cuándo volver a pedir todo. Las fotos van en la clave "photo/<id>".
const SEED = require('./posadas-seed.json');
const COLLS = ['people', 'avail', 'plans', 'votes'];
const ID = /^[a-z0-9_-]{1,90}$/;

function store(event) {
  const { getStore, connectLambda } = require('@netlify/blobs');
  connectLambda(event);
  return getStore({ name: 'viaje-posadas', consistency: 'strong' });
}
function json(code, body) {
  return { statusCode: code, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }, body: JSON.stringify(body) };
}
async function bump(st) { const rev = Date.now().toString(36) + Math.random().toString(36).slice(2, 6); await st.set('_rev', rev); return rev; }
async function seed(st) {
  if (await st.get('_seeded')) return;
  for (const c of COLLS) for (const id of Object.keys(SEED[c] || {})) await st.setJSON('doc/' + c + '/' + id, SEED[c][id]);
  await st.set('_seeded', '1');
  await bump(st);
}
async function readAll(st) {
  const out = { people: {}, avail: {}, plans: {}, votes: {} };
  const { blobs } = await st.list({ prefix: 'doc/' });
  await Promise.all(blobs.map(async (b) => {
    const [, c, id] = b.key.split('/');
    if (out[c]) { const v = await st.get(b.key, { type: 'json' }); if (v) out[c][id] = v; }
  }));
  return out;
}

exports.handler = async function (event) {
  const st = store(event);
  const q = event.queryStringParameters || {};
  try {
    if (event.httpMethod === 'GET' && q.photo) {
      if (!ID.test(q.photo)) return { statusCode: 404, body: '' };
      const p = await st.get('photo/' + q.photo, { type: 'json' });
      if (!p) return { statusCode: 404, body: '' };
      return { statusCode: 200, isBase64Encoded: true, headers: { 'content-type': p.type, 'cache-control': 'public, max-age=31536000, immutable' }, body: p.data };
    }
    if (event.httpMethod === 'GET') {
      await seed(st);
      const rev = (await st.get('_rev')) || '';
      if (q.since && q.since === rev) return json(200, { rev, same: true });
      return json(200, { rev, data: await readAll(st) });
    }
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: '' };
    if ((event.body || '').length > 3000000) return json(413, { error: 'muy grande' });
    let b; try { b = JSON.parse(event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString() : event.body || '{}'); } catch (e) { return json(400, { error: 'json' }); }

    if (b.op === 'photo') {
      if (!/^image\/(jpeg|png|webp)$/.test(b.type || '') || typeof b.data !== 'string') return json(400, { error: 'foto' });
      const id = 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      await st.setJSON('photo/' + id, { type: b.type, data: b.data });
      return json(200, { id });
    }
    if (COLLS.indexOf(b.coll) < 0 || !ID.test(b.id || '')) return json(400, { error: 'ruta' });
    const key = 'doc/' + b.coll + '/' + b.id;
    if (b.op === 'delete') await st.delete(key);
    else {
      if (!b.data || typeof b.data !== 'object' || JSON.stringify(b.data).length > 50000) return json(400, { error: 'datos' });
      if (b.op === 'update') { const cur = (await st.get(key, { type: 'json' })) || {}; await st.setJSON(key, Object.assign(cur, b.data)); }
      else if (b.op === 'set') await st.setJSON(key, b.data);
      else return json(400, { error: 'op' });
    }
    return json(200, { rev: await bump(st) });
  } catch (e) {
    return json(500, { error: 'servidor' });
  }
};

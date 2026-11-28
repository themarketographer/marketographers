// Datos compartidos de marketographers.com/viajeposadas (calendario del viaje a Posadas).
// Cada documento es una clave "doc/<colección>/<id>" en Netlify Blobs; "_rev" cambia en cada escritura
// para que los navegadores sepan cuándo volver a pedir todo. Las fotos van en "photo/<id>".
// Función formato v2 (export default) para poder leer con consistencia fuerte: así todos ven lo último.
import { getStore } from '@netlify/blobs';
const SEED = {"people": {"pablo": {"color": 0, "host": true, "name": "Pablo", "order": 0}, "fer": {"color": 2, "couple": "fer-jackie", "name": "Fer", "order": 1}, "jackie": {"color": 4, "couple": "fer-jackie", "name": "Jackie", "order": 2}, "lucas": {"color": 6, "couple": "lucas-eli", "name": "Lucas", "order": 3}, "eli": {"color": 5, "couple": "lucas-eli", "name": "Eli", "order": 4}, "leandro": {"color": 3, "name": "Leandro", "order": 5}, "ezequiel": {"color": 1, "name": "Ezequiel", "order": 6}, "evelyn": {"color": 8, "name": "Evelyn", "order": 7}, "matias": {"color": 7, "name": "Matías", "order": 8, "zone": "bsas"}}, "avail": {"ezequiel": {"name": "Ezequiel", "done": true, "blocks": [{"d": 1, "from": 420, "id": "s1", "to": 780, "type": "x"}, {"d": 2, "from": 420, "id": "s2", "to": 780, "type": "x"}, {"d": 3, "from": 420, "id": "s3", "to": 780, "type": "x"}, {"d": 4, "from": 420, "id": "s4", "to": 780, "type": "x"}, {"d": 3, "from": 1080, "id": "s5", "to": 1200, "type": "o"}, {"d": 5, "from": 1080, "id": "s6", "to": 1440, "type": "x"}, {"d": 7, "from": 420, "id": "s7", "to": 780, "type": "o"}, {"d": 8, "from": 420, "id": "s8", "to": 780, "type": "o"}, {"d": 9, "from": 420, "id": "s9", "to": 780, "type": "o"}, {"d": 10, "from": 420, "id": "s10", "to": 780, "type": "o"}, {"d": 7, "from": 1260, "id": "s11", "to": 1560, "type": "x"}]}, "fer": {"name": "Fer", "done": true, "blocks": [{"d": 2, "from": 420, "id": "f1", "to": 600, "type": "x"}, {"d": 3, "from": 840, "id": "f2", "to": 1080, "type": "o"}, {"d": 5, "from": 1080, "id": "f3", "to": 1260, "type": "x"}, {"d": 5, "from": 1260, "id": "f4", "to": 1440, "type": "o"}, {"d": 7, "from": 1260, "id": "f5", "to": 1680, "type": "o"}]}, "lucas": {"name": "Lucas", "done": true, "blocks": [{"d": 1, "from": 840, "id": "l1", "to": 960, "type": "o"}, {"d": 3, "from": 840, "id": "l2", "to": 960, "type": "o"}, {"d": 5, "from": 600, "id": "l3", "to": 720, "type": "o"}, {"d": 9, "from": 780, "id": "l4", "to": 900, "type": "o"}]}}, "plans": {"py-novo-rodeiro": {"title": "Novo Rodeiro", "cat": "py", "icon": "flame", "order": 1, "by": "Pablo", "photo": null, "sched": null}, "py-costanera": {"title": "Costanera", "cat": "py", "icon": "wave", "order": 2, "by": "Pablo", "photo": null, "sched": null}, "py-playa-de-noche": {"title": "Playa de noche", "cat": "py", "icon": "moon", "order": 3, "by": "Pablo", "photo": null, "sched": null}, "py-concierto-en-bar": {"title": "Concierto en Bar", "cat": "py", "icon": "music", "order": 4, "by": "Pablo", "photo": null, "sched": null}, "pos-ir-al-brete": {"title": "Ir al Brete", "cat": "pos", "icon": "beer", "order": 5, "by": "Pablo", "photo": null, "sched": null}, "pos-jardin-botanico": {"title": "Jardín botánico", "cat": "pos", "icon": "leaf", "order": 6, "by": "Pablo", "photo": null, "sched": null}, "pos-plaza-san-martin": {"title": "Plaza San Martín", "cat": "pos", "icon": "tree", "order": 7, "by": "Pablo", "photo": null, "sched": null}, "pos-cafe-paris": {"title": "Café Paris", "cat": "pos", "icon": "coffee", "order": 8, "by": "Pablo", "photo": null, "sched": null}, "pos-hatapy": {"title": "Hatapy", "cat": "pos", "icon": "food", "order": 9, "by": "Pablo", "photo": null, "sched": null}, "pos-bodegon-don-fulgencio": {"title": "Bodegon de Don Fulgencio", "cat": "pos", "icon": "food", "order": 10, "by": "Pablo", "photo": null, "sched": null}, "pos-arthem-burger": {"title": "Arthem Burger", "cat": "pos", "icon": "burger", "order": 11, "by": "Pablo", "photo": null, "sched": null}, "pos-bowling": {"title": "Bowling", "cat": "pos", "icon": "bowling", "order": 12, "by": "Pablo", "photo": null, "sched": null}, "pos-flynn-pool": {"title": "Flynn Pool", "cat": "pos", "icon": "pool", "order": 13, "by": "Pablo", "photo": null, "sched": null}, "pos-costanera": {"title": "Costanera", "cat": "pos", "icon": "wave", "order": 14, "by": "Pablo", "photo": null, "sched": null}, "pos-eli-y-lucas": {"title": "Disfrutar de como Eli caga a Lucas a putazos", "cat": "pos", "icon": "sparkles", "order": 15, "by": "Pablo", "photo": null, "sched": null}, "pos-salir-de-joda": {"title": "Salir de joda / bar", "cat": "pos", "icon": "glass", "order": 16, "by": "Pablo", "photo": null, "sched": null}, "pos-karaoke-en-casa": {"title": "Karaoke Bar at home", "cat": "pos", "icon": "mic", "order": 17, "by": "Pablo", "photo": null, "sched": null}, "pos-parrillada-boliviana": {"title": "Parrillada boliviana", "cat": "pos", "icon": "flame", "order": 18, "by": "Pablo", "photo": null, "sched": null}, "pos-parrillada-paraguaya": {"title": "Parrillada paraguaya", "cat": "pos", "icon": "flame", "order": 19, "by": "Pablo", "photo": null, "sched": null}, "pos-chipa-san-ignacio": {"title": "Chipa de la axion en San Ignacio", "cat": "pos", "icon": "pin", "order": 20, "by": "Pablo", "photo": null, "sched": null}, "pos-noche-signani-cacho": {"title": "Noche de Signani / Cacho", "cat": "pos", "icon": "moon", "order": 21, "by": "Pablo", "photo": null, "sched": null}}, "votes": {}};

const COLLS = ['people', 'avail', 'plans', 'votes', 'log', 'joins'];
const ID = /^[a-z0-9_-]{1,90}$/;
const json = (code, body) => new Response(JSON.stringify(body), { status: code, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

async function bump(st) { const rev = Date.now().toString(36) + Math.random().toString(36).slice(2, 6); await st.set('_rev', rev); return rev; }
async function seed(st) {
  if (await st.get('_seeded')) return;
  for (const c of COLLS) for (const id of Object.keys(SEED[c] || {})) await st.setJSON('doc/' + c + '/' + id, SEED[c][id]);
  await st.set('_seeded', '1');
  await bump(st);
}
async function readAll(st) {
  const out = { people: {}, avail: {}, plans: {}, votes: {}, log: {}, joins: {} };
  const { blobs } = await st.list({ prefix: 'doc/' });
  await Promise.all(blobs.map(async (b) => {
    const [, c, id] = b.key.split('/');
    if (out[c]) { const v = await st.get(b.key, { type: 'json' }); if (v) out[c][id] = v; }
  }));
  return out;
}

export default async (req) => {
  const url = new URL(req.url);
  const q = Object.fromEntries(url.searchParams);
  try {
    const st = getStore({ name: 'viaje-posadas', consistency: 'strong' });
    if (req.method === 'GET' && q.photo) {
      if (!ID.test(q.photo)) return new Response('', { status: 404 });
      const p = await st.get('photo/' + q.photo, { type: 'json' });
      if (!p) return new Response('', { status: 404 });
      return new Response(Buffer.from(p.data, 'base64'), { status: 200, headers: { 'content-type': p.type, 'cache-control': 'public, max-age=31536000, immutable' } });
    }
    if (req.method === 'GET') {
      await seed(st);
      const rev = (await st.get('_rev')) || '';
      if (q.since && q.since === rev) return json(200, { rev, same: true });
      return json(200, { rev, data: await readAll(st) });
    }
    if (req.method !== 'POST') return new Response('', { status: 405 });
    const text = await req.text();
    if (text.length > 3000000) return json(413, { error: 'muy grande' });
    let b; try { b = JSON.parse(text || '{}'); } catch (e) { return json(400, { error: 'json' }); }

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
    console.error('posadas', e && e.message);
    return json(500, { error: 'servidor', detail: String(e && e.message || e).slice(0, 300) });
  }
};

export const config = { path: '/api/viajeposadas' };

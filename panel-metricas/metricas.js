/* Lógica del panel de métricas, sin pantalla: leer CSV, entender números y fechas, resumir y avisar desvíos.
   La usa index.html y se prueba con:  node panel-metricas/metricas.js */
(function (root) {
  'use strict';

  // CSV con comillas, saltos de línea dentro de celdas y separador coma, punto y coma o tabulación.
  function parseCsv(text) {
    text = String(text).replace(/^﻿/, '');
    var head = text.slice(0, text.indexOf('\n') > -1 ? text.indexOf('\n') : text.length);
    var sep = [',', ';', '\t'].sort(function (a, b) { return head.split(b).length - head.split(a).length; })[0];
    var rows = [], row = [], cell = '', q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
      else if (c === '"') q = true;
      else if (c === sep) { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); cell = ''; if (row.some(function (x) { return x.trim() !== ''; })) rows.push(row); row = []; }
      else cell += c;
    }
    row.push(cell); if (row.some(function (x) { return x.trim() !== ''; })) rows.push(row);
    var cols = (rows.shift() || []).map(function (h) { return h.trim(); });
    return { cols: cols, rows: rows.map(function (r) { var o = {}; cols.forEach(function (h, j) { o[h] = (r[j] || '').trim(); }); return o; }) };
  }

  // "1.234,56", "1,234.56", "$ 33", "Bs 680" -> número. Vacío o texto -> null.
  function num(v) {
    var s = String(v == null ? '' : v).replace(/[^\d.,-]/g, '');
    if (!/\d/.test(s)) return null;
    var c = s.lastIndexOf(','), d = s.lastIndexOf('.');
    if (c > -1 && d > -1) s = c > d ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
    else if (c > -1) s = /,\d{3}$/.test(s) && s.indexOf(',') === c ? s.replace(',', '') : s.replace(',', '.');
    else if (d > -1 && /\.\d{3}$/.test(s) && s.indexOf('.') !== d) s = s.replace(/\./g, '');
    var n = parseFloat(s);
    return isFinite(n) ? n : null;
  }

  // Fecha a "AAAA-MM-DD". Acepta 2026-11-15, 15/11/2026, 15-11-26 y "Nov 15, 2026". Con barras se asume día/mes (uso latino).
  function fecha(v) {
    var s = String(v || '').trim(), m;
    if ((m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s))) return m[1] + '-' + pad(m[2]) + '-' + pad(m[3]);
    if ((m = /^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})/.exec(s))) return (m[3].length === 2 ? '20' + m[3] : m[3]) + '-' + pad(m[2]) + '-' + pad(m[1]);
    var t = Date.parse(s);
    if (!isNaN(t)) { var d = new Date(t); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
    return null;
  }
  function pad(n) { return String(n).padStart(2, '0'); }

  // Qué columna del archivo corresponde a cada dato, por nombres habituales en español e inglés.
  var SYN = {
    ads: { campana: ['nombre de la campaña', 'campaign name', 'campaña', 'campaign'], gasto: ['importe gastado', 'amount spent', 'gasto', 'spend'], resultados: ['resultados', 'results', 'leads', 'conversiones'], fecha: ['día', 'dia', 'day', 'inicio del informe', 'reporting starts', 'fecha', 'date'], impresiones: ['impresiones', 'impressions'], clics: ['clics en el enlace', 'link clicks', 'clics', 'clicks'] },
    ventas: { fecha: ['fecha', 'date', 'created', 'creado', 'purchase date'], monto: ['monto', 'amount', 'importe', 'total', 'precio', 'price', 'net'], producto: ['producto', 'product', 'plan', 'item', 'nombre', 'name', 'descripción', 'description'] },
    redes: { fecha: ['fecha', 'date', 'día', 'day'], seguidores: ['seguidores', 'followers', 'total followers'], alcance: ['alcance', 'reach', 'visualizaciones', 'views', 'video views'], interacciones: ['interacciones', 'engagement', 'likes', 'me gusta'] }
  };
  function guess(type, cols) {
    var out = {}, low = cols.map(function (c) { return c.toLowerCase(); });
    Object.keys(SYN[type]).forEach(function (k) {
      var hit = -1;
      SYN[type][k].some(function (s) { hit = low.indexOf(s); if (hit < 0) hit = low.findIndex(function (c) { return c.indexOf(s) === 0; }); return hit > -1; });
      out[k] = hit > -1 ? cols[hit] : '';
    });
    return out;
  }

  // Campañas: gasto, resultados y costo por resultado, con una recomendación que solo aparece si hay datos suficientes.
  var MIN_RESULTADOS = 10;
  function campanas(rows) {
    var by = {};
    rows.forEach(function (r) { var c = (by[r.campana] = by[r.campana] || { campana: r.campana, gasto: 0, resultados: 0 }); c.gasto += r.gasto || 0; c.resultados += r.resultados || 0; });
    var list = Object.keys(by).map(function (k) { return by[k]; });
    var tg = list.reduce(function (s, c) { return s + c.gasto; }, 0), tr = list.reduce(function (s, c) { return s + c.resultados; }, 0), prom = tr ? tg / tr : null;
    list.forEach(function (c) {
      c.costo = c.resultados ? c.gasto / c.resultados : null;
      if (prom === null || list.length < 2) c.accion = 'sin-datos';
      else if (!c.resultados && c.gasto >= prom * 3) c.accion = 'cortar';        // gastó lo de 3 resultados y no trajo ninguno
      else if (c.resultados < MIN_RESULTADOS) c.accion = 'sin-datos';
      else if (c.costo <= prom * 0.8) c.accion = 'escalar';
      else if (c.costo >= prom * 1.3) c.accion = 'cortar';
      else c.accion = 'mantener';
    });
    return { lista: list.sort(function (a, b) { return b.gasto - a.gasto; }), gasto: tg, resultados: tr, promedio: prom };
  }

  // Suma por mes ("2026-11") de una lista de { fecha, valor }.
  function porMes(rows, campo) {
    var m = {};
    rows.forEach(function (r) { if (!r.fecha) return; var k = r.fecha.slice(0, 7); m[k] = (m[k] || 0) + (r[campo] || 0); });
    return m;
  }

  // Alerta: el último valor se aleja más de 2 desvíos estándar del promedio de los anteriores (mínimo 4 anteriores).
  function alerta(valores) {
    if (valores.length < 5) return null;
    var prev = valores.slice(0, -1), last = valores[valores.length - 1];
    var mean = prev.reduce(function (s, v) { return s + v; }, 0) / prev.length;
    var sd = Math.sqrt(prev.reduce(function (s, v) { return s + (v - mean) * (v - mean); }, 0) / prev.length);
    if (!sd || Math.abs(last - mean) <= 2 * sd) return null;
    return { ultimo: last, promedio: mean, sube: last > mean, cambio: mean ? (last - mean) / mean : null };
  }

  var api = { parseCsv: parseCsv, num: num, fecha: fecha, guess: guess, campanas: campanas, porMes: porMes, alerta: alerta, MIN_RESULTADOS: MIN_RESULTADOS };
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
    if (require.main === module) {
      var a = require('assert');
      var p = parseCsv('﻿Nombre de la campaña;Importe gastado;Resultados\n"Clase; gratis";"1.234,50";12\nOtra;10;\n\n');
      a.deepStrictEqual(p.cols, ['Nombre de la campaña', 'Importe gastado', 'Resultados']); a.strictEqual(p.rows.length, 2); a.strictEqual(p.rows[0]['Nombre de la campaña'], 'Clase; gratis');
      a.strictEqual(parseCsv('a,b\n"di ""hola""",2').rows[0].a, 'di "hola"');
      a.strictEqual(num('1.234,50'), 1234.5); a.strictEqual(num('1,234.50'), 1234.5); a.strictEqual(num('$ 33'), 33); a.strictEqual(num('12,5'), 12.5); a.strictEqual(num('1,234'), 1234); a.strictEqual(num(''), null); a.strictEqual(num('n/a'), null);
      a.strictEqual(fecha('15/11/2026'), '2026-11-15'); a.strictEqual(fecha('2026-11-05T10:00'), '2026-11-05'); a.strictEqual(fecha('3-1-26'), '2026-01-03'); a.strictEqual(fecha('hola'), null);
      a.strictEqual(guess('ads', p.cols).gasto, 'Importe gastado'); a.strictEqual(guess('ads', ['Campaign name', 'Amount spent (USD)', 'Results']).gasto, 'Amount spent (USD)');
      var c = campanas([{ campana: 'A', gasto: 20, resultados: 20 }, { campana: 'B', gasto: 100, resultados: 20 }, { campana: 'C', gasto: 5, resultados: 2 }, { campana: 'D', gasto: 30, resultados: 0 }]);
      var ac = {}; c.lista.forEach(function (x) { ac[x.campana] = x.accion; });
      a.deepStrictEqual(ac, { A: 'escalar', B: 'cortar', C: 'sin-datos', D: 'cortar' });
      a.strictEqual(campanas([{ campana: 'A', gasto: 20, resultados: 50 }]).lista[0].accion, 'sin-datos'); // una sola campaña no se compara con nada
      a.deepStrictEqual(porMes([{ fecha: '2026-10-30', monto: 33 }, { fecha: '2026-11-02', monto: 33 }, { fecha: '2026-11-20', monto: 49 }], 'monto'), { '2026-10': 33, '2026-11': 82 });
      a.strictEqual(alerta([10, 11, 9, 10]), null); a.strictEqual(alerta([10, 11, 9, 10, 10.5]), null);
      a(alerta([10, 11, 9, 10, 25]).sube); a.strictEqual(alerta([10, 11, 9, 10, 2]).sube, false);
      console.log('metricas: 24 comprobaciones pasan');
    }
  } else root.Metricas = api;
})(this);

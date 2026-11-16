// Pruebas del motor de cálculo de la calculadora de precios. Uso: node marketools/pricing/calc.test.mjs
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const calcSrc = html.split('<script id="calc">')[1].split('</script>')[0];
const defSrc = html.slice(html.indexOf('const mk = '), html.indexOf('const FUND_INFO'));
const { calc, defaults } = new Function(defSrc + calcSrc + '; return { calc, defaults };')();
const casi = (a, b) => Math.abs(a - b) < 1e-6;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };

const o = calc(defaults());
ok(casi(o.total, o.fundAmts.reduce((a, b) => a + b, 0)), 'total = suma de fundAmts');
ok(casi(o.fundPct.reduce((a, b) => a + b, 0), 1), 'fundPct suma 1');
const d = defaults();
ok(casi(o.pStd, o.pBasic * (1 + d.pr.m1 / 100)) && casi(o.pPrem, o.pBasic * (1 + d.pr.m2 / 100)), 'pStd y pPrem por margen');
const z = defaults(); z.pr.clients = 0; const oz = calc(z);
ok(oz.pBasic === 0 && oz.hMin === 0, 'clients = 0 no da NaN ni Infinity');
const r = defaults(); r.cur.rate = 0;
ok(calc(r).rate === 1, 'rate 0 usa 1');
const y = defaults(); y.infl = 0; y.life = 0;
ok(calc(y).yearly === 0, 'life 0 no divide por cero');
console.log(`calc: ${n} comprobaciones pasan`);

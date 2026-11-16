/* Común a las MarkeTools nuevas: medición con GA4, copiar al portapapeles y acceso a las herramientas premium. */
(function (w) {
  'use strict';
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () { w.dataLayer.push(arguments); };
  w.gtag('js', new Date()); w.gtag('config', 'G-GQY8VYBD5T');
  // La librería de Google carga al primer toque o 2,5 s después de cargar la página; los eventos quedan en cola.
  var cargado = false;
  function cargar() { if (cargado) return; cargado = true; var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=G-GQY8VYBD5T'; document.head.appendChild(s); }
  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (e) { addEventListener(e, cargar, { once: true, passive: true }); });
  addEventListener('load', function () { setTimeout(cargar, 2500); });

  var used = false;
  w.Tool = {
    // Se anota una vez por visita que la herramienta se usó, y cada clic hacia la clase gratis.
    used: function (name) { if (!used) { used = true; w.gtag('event', 'tool_use', { tool: name }); } },
    copy: function (text, btn) {
      var done = function () { var t = btn.textContent; btn.textContent = 'Copiado'; setTimeout(function () { btn.textContent = t; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () { prompt('Copia el texto:', text); });
      else prompt('Copia el texto:', text);
    },
    // Herramientas premium: la clave cambia sola cada mes y se publica dentro de la comunidad.
    // Quien deja de pagar deja de ver la clave nueva y pierde el acceso al cambiar el mes.
    premium: function (onOk) {
      var K = 'mk-premium', box = document.getElementById('gate'), app = document.getElementById('app');
      var check = function (clave, silent) {
        return fetch('/.netlify/functions/premium', { method: 'POST', body: JSON.stringify({ clave: clave }) }).then(function (r) { return r.json(); }).then(function (r) {
          if (r.ok) { try { localStorage.setItem(K, clave); } catch (e) {} box.hidden = true; app.hidden = false; onOk(); return; }
          try { localStorage.removeItem(K); } catch (e) {}
          box.hidden = false; app.hidden = true;
          var er = document.getElementById('gateErr'); er.textContent = silent ? 'La clave del mes cambió. Búscala en la comunidad y vuelve a entrar.' : (r.error || 'Esa clave no es la de este mes.'); er.hidden = false;
        }).catch(function () { box.hidden = false; var er = document.getElementById('gateErr'); er.textContent = 'No hay conexión. Vuelve a intentar.'; er.hidden = false; });
      };
      box.addEventListener('submit', function (e) { e.preventDefault(); check(document.getElementById('gateKey').value.trim().toUpperCase()); });
      var saved = null; try { saved = localStorage.getItem(K); } catch (e) {}
      if (saved) check(saved, true); else box.hidden = false;
    }
  };
  document.addEventListener('click', function (e) { var a = e.target.closest('a[data-cta]'); if (a) w.gtag('event', 'tool_cta', { tool: a.dataset.cta }); });
})(window);

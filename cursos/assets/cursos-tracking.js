/* =========================================================
   Tracking de /cursos/ — The Marketographers
   Mismo patrón que el resto del sitio: Pixel principal con
   autoConfig apagado + Conversions API (/.netlify/functions/capi)
   con el mismo event_id, así Meta deduplica en vez de contar doble.

   Cada página define window.MKT_PAGE antes de cargar este archivo:
     hub   -> { tipo:'hub' }
     curso -> { tipo:'curso', curso:'slug', estado, precio, moneda, nombre }

   EVENTOS QUE DISPARA
   Hub (/cursos/):
     PageView            al cargar
     ViewCursosHub       al cargar (personalizado)
     ClickCursoHub       clic en una tarjeta {curso}
   Landing de curso (/cursos/<slug>/):
     PageView            al cargar
     ViewCursoLanding    al cargar {curso, estado} (personalizado)
     ViewContent         al llegar a la sección #precio {content_ids:[curso], value, currency}
     ClickCheckoutCurso  clic al checkout de Nas.io {curso, value, currency} (personalizado)
   Ambos:
     ClickCheckoutLanding clic a la membresía Motion (mismo evento que la home)

   InitiateCheckout NO se dispara aquí: lo dispara Nas.io en su checkout
   con este mismo pixel. Se separa por curso con conversiones
   personalizadas filtrando la URL por el slug del reto.
   ========================================================= */
(function () {
  var PIXEL = '467504537642522';
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('set', 'autoConfig', false, PIXEL);
  fbq('init', PIXEL);

  var P = window.MKT_PAGE || {};

  function makeEventId(prefix){ return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10); }
  function getCookie(name){ var m = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)')); return m ? m[2] : null; }
  function sendCapi(eventName, eventId, customData){
    try{
      fetch('/.netlify/functions/capi', {
        method:'POST', headers:{'Content-Type':'application/json'}, keepalive:true,
        body: JSON.stringify({ event_name:eventName, event_id:eventId, event_source_url:location.href,
          custom_data: customData || undefined, fbp:getCookie('_fbp'), fbc:getCookie('_fbc') })
      }).catch(function(){});
    }catch(e){}
  }
  function track(eventName, params){
    var id = makeEventId(eventName.toLowerCase());
    fbq('track', eventName, params || {}, {eventID:id});
    sendCapi(eventName, id, params);
  }
  function trackCustom(eventName, params){
    var id = makeEventId(eventName.toLowerCase());
    fbq('trackCustom', eventName, params || {}, {eventID:id});
    sendCapi(eventName, id, params);
  }
  function ga(name, params){ try{ if(window.gtag) gtag('event', name, params || {}); }catch(e){} }
  window.MKT_TRACK = { track:track, trackCustom:trackCustom };

  track('PageView');
  if(P.tipo === 'hub'){
    trackCustom('ViewCursosHub');
  } else if(P.tipo === 'curso'){
    trackCustom('ViewCursoLanding', { curso:P.curso, estado:P.estado });
    ga('view_item', { items:[{ item_id:P.curso, item_name:P.nombre, price:P.precio }], currency:P.moneda, value:P.precio });
  }

  // Pasa UTMs y fbclid de la landing al link de Nas.io, para que el GA4 de
  // Nas.io también sepa de qué anuncio vino la persona.
  function withUtms(href){
    try{
      var src = new URLSearchParams(location.search), u = new URL(href), any = false;
      ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid'].forEach(function(k){
        if(src.get(k) && !u.searchParams.get(k)){ u.searchParams.set(k, src.get(k)); any = true; }
      });
      return any ? u.toString() : href;
    }catch(e){ return href; }
  }

  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('a[data-checkout]').forEach(function(a){ a.href = withUtms(a.href); });

    // ViewContent: una vez, al ver el bloque de precio
    var precio = document.getElementById('precio');
    if(precio && 'IntersectionObserver' in window && P.tipo === 'curso'){
      var fired = false;
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(en.isIntersecting && !fired){
            fired = true; io.disconnect();
            track('ViewContent', { content_ids:[P.curso], content_name:P.nombre, content_type:'product', value:P.precio, currency:P.moneda });
          }
        });
      }, {threshold:0.35});
      io.observe(precio);
    }

    // Barra fija de compra en móvil: aparece después del hero
    var sticky = document.querySelector('.sticky-buy'), hero = document.querySelector('.c-hero');
    if(sticky && hero && 'IntersectionObserver' in window){
      new IntersectionObserver(function(en){ sticky.classList.toggle('show', !en[0].isIntersecting); }).observe(hero);
    }
  });

  document.addEventListener('click', function(e){
    var a = e.target.closest('a'); if(!a) return;
    var kind = a.getAttribute('data-checkout');
    if(kind === 'curso'){
      trackCustom('ClickCheckoutCurso', { curso:P.curso, value:P.precio, currency:P.moneda });
      ga('begin_checkout', { items:[{ item_id:P.curso, item_name:P.nombre, price:P.precio }], currency:P.moneda, value:P.precio });
    } else if(kind === 'motion'){
      trackCustom('ClickCheckoutLanding', { origen: P.tipo === 'curso' ? 'curso_' + P.curso : 'cursos_hub' });
    } else if(a.hasAttribute('data-curso')){
      trackCustom('ClickCursoHub', { curso:a.getAttribute('data-curso') });
    }
  });
})();

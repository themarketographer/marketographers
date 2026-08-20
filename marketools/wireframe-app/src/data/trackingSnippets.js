// Código real de Meta Pixel y Google Analytics 4 (GA4), listo para pegar en
// el <head>, generado solo cuando el alumno cargó su ID en el formulario de
// export. Vocabulario y estructura alineados con codigo-tracking.md de la
// skill photographer-landing (autoConfig apagado a propósito, ver comentario
// abajo).

export function buildPixelSnippet(pixelId) {
  if (!pixelId) return null
  return `<!-- Meta Pixel -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

fbq('set','autoConfig',false,'${pixelId}');
fbq('init','${pixelId}');
fbq('track','PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"/></noscript>`
}

export function buildGa4Snippet(ga4Id) {
  if (!ga4Id) return null
  return `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${ga4Id}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${ga4Id}');
</script>`
}

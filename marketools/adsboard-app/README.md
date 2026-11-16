# adsboard

Dashboard de campañas de Meta Ads para alumnos, sin backend.

- HTML/CSS/JS plano (`index.html` más `adsboard.js`), sin dependencias ni build.
- No usa Vite/React porque no hace falta: no hay assets locales que
  requieran rutas base ni un paso de compilación.
- Por eso `adsboard-app/` y `adsboard/` tienen los mismos archivos
  (`index.html` y `adsboard.js`), a diferencia de otras tools de esta carpeta.
- Cada vez que cambie `adsboard.js`, subir el mismo valor de versión en tres
  lugares: `adsboard/index.html` (`adsboard.js?v=...`) y las dos líneas
  de `adsboard/sw.js` (`CACHE` y `SHELL`). Hoy es `extras3`.
- Login con Facebook (Facebook Login for Business), permiso ads_read
  únicamente. El token vive solo en el navegador del alumno, nunca
  pasa por ningún servidor nuestro.
- App ID de Meta: 1602285984897758 (App "MarkeTool Dashboard").
- Config ID del login: 2334408800710806.
- Semáforo de CPR: compara el CPR de cada campaña activa contra la
  mediana de CPR de las campañas activas de esa misma cuenta (no
  contra un benchmark fijo). ≤0.85x mediana = verde, ≤1.3x = amarillo,
  más que eso = rojo. Así el semáforo se ajusta solo a cada alumno
  en vez de imponer un número universal que no aplica a todos los
  nichos de fotografía por igual.
- Modo demo: botón "Ver una demo con datos de ejemplo" en el login,
  para que un alumno sin cuenta conectada entienda qué va a ver.
- Pendiente / próximos pasos: agregar selector de rango de fechas
  (hoy está fijo en últimos 7 días vía date_preset), y mostrar el
  motivo del rechazo cuando hay anuncios DISAPPROVED.

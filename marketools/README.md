# marketools

Herramientas internas de The Marketographers, cada una servida como un sitio estático dentro de este repo.

## Convención por herramienta

Cada tool vive en dos carpetas:

- `<tool>/` — el build estático (HTML/CSS/JS ya compilado), servido tal cual por Netlify en `marketographers.com/marketools/<tool>/`. No se edita a mano.
- `<tool>-app/` — el código fuente completo (proyecto Vite/React), para seguir desarrollando la herramienta.

## Cómo actualizar una herramienta después de editar el código fuente

Desde `<tool>-app/`:

```bash
npm install
npx vite build --base=/marketools/<tool>/
```

Eso genera una carpeta `dist/` con los paths absolutos ya apuntando a `/marketools/<tool>/` (necesario porque la herramienta no vive en la raíz del dominio). Copiá el contenido de `dist/` a `../<tool>/`, reemplazando lo que había, y commiteá los dos cambios juntos (fuente + build).

Algunas tools son un solo `index.html` autocontenido (sin build, sin carpeta `-app/`) cuando no lo justifica, como `link-wpp/`. En esos casos se edita directo el HTML.

## Herramientas

- **wireframe** — MarkeTool: constructor de wireframes de landing pages para alumnos, con export de wireframe + prompt maestro para generar el HTML final. Ver `wireframe-app/README.md`.
- **link-wpp** — Generador de links de WhatsApp (wa.me) personalizados, con mensaje precargado, nombre del cliente incrustable y preview en mockup de celular. Archivo único, sin build.
- **pricing** — Calculadora de precios completa (versión web del Excel "Motion Pricing v3"): gastos, costos, equipo, fondos 50/10/20/10/10, precio por hora y paquetes, punto de equilibrio, proyección a 12 meses y embudo de Meta Ads. Archivo único, sin build. El motor de cálculo está aislado en `<script id="calc">` (sin DOM). Guarda todo en `localStorage`.

- **utm**, **costo-por-cliente**, **seguimiento** — Herramientas gratis de un solo archivo. Comparten estilos y medición en `_ui/` (tokens, componentes y `tool.js`).
- **contrato** — Herramienta premium (incluida en la membresía). Pide la clave del mes.

## Herramientas premium y clave del mes

1. En Netlify crea la variable `MK_PREMIUM_SECRETO` con una frase larga y vuelve a publicar una vez.
2. Abre `marketographers.com/marketools/clave-del-mes/`, pega ese secreto y verás la clave de este mes y la del próximo, con el mensaje listo para fijar en la comunidad.
3. La clave cambia sola el día 1 de cada mes, sin volver a publicar. Los primeros 3 días todavía vale la anterior.
4. Si un alumno deja de pagar, sale de la comunidad, ya no ve la clave nueva y pierde el acceso al cambiar el mes.

Límite honesto: el repositorio es público, así que el texto de una herramienta premium se puede leer en GitHub. La clave frena el uso casual desde el sitio.
Para algo que de verdad no deba verse (plantillas pagadas, cursos), súbelo a Nas.io, no aquí.

## Página índice

`index.html` en la raíz de `marketools/` es el hub público en `marketographers.com/marketools/`, con tarjetas hacia cada herramienta. Actualizarlo (y el `sitemap.xml` del repo) cada vez que se agregue una tool nueva.

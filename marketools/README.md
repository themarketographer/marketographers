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

## Página índice

`index.html` en la raíz de `marketools/` es el hub público en `marketographers.com/marketools/`, con tarjetas hacia cada herramienta. Actualizarlo (y el `sitemap.xml` del repo) cada vez que se agregue una tool nueva.

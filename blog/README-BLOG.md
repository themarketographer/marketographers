# Blog de The Marketographers — Guía de mantenimiento

## Cómo está armado

Mismo modelo que el resto del sitio: HTML puro, sin build, sin frameworks. GitHub guarda los archivos, Netlify los publica automáticamente en cada push. Cero herramientas nuevas que aprender.

```
/assets/global.css                  ← estilos de TODO el sitio (tokens, header, footer, botones)
/blog/
  index.html                       ← listado de artículos
  assets/blog-extra.css            ← estilos exclusivos del blog (se suma a global.css)
  _plantilla-nuevo-articulo/       ← copiar esta carpeta para cada artículo nuevo
  como-cobrar-mas-sin-bajar-precio/ ← primer artículo, ya publicado
```

Cada página del blog carga los dos archivos en este orden: primero `/assets/global.css`, después `/blog/assets/blog-extra.css`. Si cambias un color de marca (el gold, el ink, etc.) lo cambias una sola vez en `global.css` y se actualiza en todo el sitio, no solo en el blog.

Cada artículo vive en su propia carpeta con un `index.html`, así la URL final queda limpia: `marketographers.com/blog/nombre-del-articulo/` sin `.html` al final.

## Publicar un artículo nuevo, paso a paso

1. **Copia la carpeta `_plantilla-nuevo-articulo/`** y renómbrala con el slug del artículo (minúsculas, guiones, sin tildes ni ñ). Ejemplo: `como-fijar-precios-para-bodas`.
2. **Abre el `index.html` de esa carpeta** y reemplaza cada `[VALOR ENTRE CORCHETES]`. Están en dos lugares: el bloque de metadatos SEO arriba del todo, y el contenido dentro de `<article>`.
3. **Sube la imagen de portada** a Cloudinary (o donde subes las demás imágenes del sitio) y pega esa URL en los tres lugares marcados como `[URL_IMAGEN_PORTADA...]`.
4. **Agrega una tarjeta nueva en `/blog/index.html`**, copiando el bloque `<a class="blog-card">` del artículo existente y cambiando el link, la imagen, el título y la descripción corta.
5. **Agrega la URL nueva en `/sitemap.xml`**, copiando el bloque `<url>` del artículo existente.
6. **Sube los cambios a GitHub** (`git add`, `git commit`, `git push`). Netlify hace el deploy solo, no hay que tocar nada más.

## Cómo pedirle el artículo a Claude

Como no vas a escribir el HTML a mano cada vez, lo más simple es pedirme directamente el artículo completo ya en este formato: me das el tema (o uso la skill `alborna-storytelling` / `marketographer-content` para generarlo), yo te entrego el `index.html` de la carpeta ya armado y listo para subir. Solo faltaría la imagen de portada, que la generas o eliges tú.

## Por qué no usamos un CMS (Decap, WordPress, etc.)

Un CMS te ahorraría escribir HTML, pero suma una capa de configuración (autenticación, panel de administración, a veces una base de datos) que no compensa el beneficio dado que tú ya trabajas conmigo para generar el contenido y solo necesitas copiar y pegar archivos. Si en el futuro publicas varias veces por semana y quieres escribir tú mismo desde el celular sin pasar por mí, ahí sí vale la pena migrar a un CMS git-based. Por ahora, este modelo es más rápido de mantener y no depende de un servicio externo que se pueda caer o dar de baja.

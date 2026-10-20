// Plan de trabajo que va al inicio del prompt exportado: en qué orden tiene
// que trabajar la IA del alumno para no gastar créditos ni subir nada antes
// de tiempo. Criterio tomado de las skills photographer-landing y
// meta-ads-fotografos: vista previa local primero, ZIP al final, y Netlify
// solo cuando hace falta código de servidor.

// Embudos cuya conversión real llega por servidor (webhook de Cal.com).
const SERVER_FUNNELS = [3, 4]

export function buildWorkflowSection({ funnelId, hasPixel }) {
  const needsServerSoon = SERVER_FUNNELS.includes(funnelId)
  return [
    '## Cómo vas a trabajar (sigue este orden, no te saltes pasos)',
    '',
    '### Paso 0. Dos preguntas antes de escribir código',
    'Hazle estas preguntas al usuario de a una, con opciones para elegir, y espera cada respuesta:',
    '1. "¿Tienes un sistema de diseño guardado (tus colores, tipografías y componentes)?"',
    '   A) Sí, te lo paso → úsalo por encima de los colores y tipografías de este documento, y respeta sus componentes.',
    '   B) No → si tu plataforma permite guardar un sistema de diseño (en Claude, por ejemplo, existe como tipo de artefacto "Design System" en los planes que lo incluyen), sugiérele crearlo primero con los colores, tipografías y botones de este documento. Así esta página y todas las que haga después salen con el mismo estilo. Si su plan no lo incluye o no quiere, sigue con los valores de este documento.',
    '2. "¿Dónde vas a publicar primero?"',
    '   A) GitHub Pages: gratis, sin límite práctico de publicaciones, ideal para ver la página en línea y compartirla. No corre código de servidor.',
    '   B) Netlify: también gratis, y además corre funciones de servidor (API de Conversiones de Meta, webhook de Cal.com, envío de emails). Cada publicación a producción gasta créditos del plan gratuito.',
    `   Recomienda A si todavía no va a correr anuncios${needsServerSoon ? '' : ' ni necesita formularios que manden emails'}. Recomienda B si ya va a correr anuncios con la API de Conversiones${needsServerSoon ? ' o si quiere medir las reservas de Cal.com como conversión (su embudo depende de eso)' : ''}.`,
    '',
    '### Paso 1. Un solo index.html para afinar el diseño',
    '- Crea UN solo archivo index.html con todo adentro: el CSS en un <style> y el JavaScript en un <script>. Las imágenes van por URL (Cloudinary).',
    '- Muéstralo en vista previa dentro del chat (artefacto, canvas o vista previa de tu plataforma) para que el usuario lo vea sin subir nada. Si tu plataforma no tiene vista previa, entrégale el archivo para que lo abra con doble clic en su navegador.',
    '- Cada cambio que pida el usuario se aplica sobre ese mismo index.html. Todavía no crees otros archivos ni des instrucciones de GitHub o Netlify.',
    hasPixel
      ? '- El código del pixel ya va dentro, pero avísale que no se puede probar abriendo el archivo desde la computadora: los navegadores bloquean esos scripts en archivos locales. Se prueba después de publicar.'
      : '- Deja los espacios del tracking marcados con comentarios, como se indica más abajo.',
    '- Termina cada entrega preguntando qué quiere cambiar, o si ya lo aprueba.',
    '',
    '### Paso 2. Cuando el usuario escriba que lo aprueba: el proyecto completo en un ZIP',
    'Recién ahí separa el archivo en la estructura final y entrégala en un solo ZIP:',
    '```',
    'index.html',
    'assets/css/styles.css      ← todo el CSS que estaba en <style>',
    'assets/js/main.js          ← todo el JavaScript que estaba en <script>',
    `${hasPixel ? 'privacidad.html            ← obligatoria si hay pixel (lo exige Meta)\n' : ''}${[3, 4, 5].includes(funnelId) ? 'gracias.html               ← página de agradecimiento del embudo\n' : ''}404.html                   ← mismo header y footer, con un botón de vuelta al inicio`,
    'robots.txt                 ← Allow: / y la línea Sitemap: con la URL completa',
    'sitemap.xml                ← la home (y gracias.html con noindex fuera del sitemap)',
    'favicon.png                ← o el link al logo de Cloudinary en el <head>',
    'README.md                  ← qué es cada archivo y cómo se publica',
    '```',
    '- Todas las rutas internas van RELATIVAS, sin barra al inicio: `assets/css/styles.css`, nunca `/assets/css/styles.css`. En GitHub Pages la página vive en una subcarpeta (usuario.github.io/repositorio/) y las rutas con barra inicial se rompen.',
    '- Dentro del ZIP los archivos van en la raíz, sin una carpeta que los envuelva, para que el usuario los arrastre directo a GitHub. Ningún nombre de archivo o carpeta empieza con punto ni con guion bajo: en Mac quedan ocultos al arrastrar y GitHub Pages ignora los que empiezan con guion bajo.',
    '- Vuelve a mostrar la vista previa del index.html final para confirmar que la separación no rompió nada.',
    '',
    '### Paso 3. Publicar',
    'Explícale estos pasos al usuario, uno por uno:',
    '1. En github.com: botón "New repository", nombre corto sin espacios, visibilidad Public, crear.',
    '2. En el repositorio nuevo: "Add file" → "Upload files" → arrastrar TODO el contenido del ZIP descomprimido (los archivos, no la carpeta) → "Commit changes".',
    '3. Si eligió GitHub Pages: Settings → Pages → Source: "Deploy from a branch" → rama main, carpeta / (root) → Save. En uno o dos minutos la página queda en usuario.github.io/repositorio/. Cada cambio futuro se sube igual y se publica solo, sin costo.',
    '4. Si eligió Netlify: en app.netlify.com, "Add new project" (o "Add new site") → "Import an existing project" → GitHub → este repositorio. Build command vacío y publish directory "." (punto). Para no gastar créditos, cada cambio futuro se sube primero a una rama aparte, se revisa en el link de vista previa que genera Netlify, y recién aprobado se une a main.',
    '',
    '### Paso 4. Cuando necesite APIs (más adelante, no ahora)',
    'Si empezó en GitHub Pages y después quiere la API de Conversiones de Meta, el webhook de Cal.com o formularios que manden emails, el mismo repositorio se conecta a Netlify (paso 3.4) y se le suman:',
    '- netlify.toml en la raíz (publish = ".", functions = "netlify/functions").',
    '- netlify/functions/ con la función que haga falta (por ejemplo capi.js).',
    '- Las claves secretas (como META_CAPI_TOKEN) las pega el usuario en Netlify → Site configuration → Environment variables. Nunca van escritas en el código ni en el chat.',
    '- Después de conectar el dominio a Netlify, apagar GitHub Pages (Settings → Pages → Unpublish) para que no queden dos copias del sitio compitiendo en Google, y dejar el <link rel="canonical"> apuntando al dominio final.',
    '',
  ].join('\n')
}

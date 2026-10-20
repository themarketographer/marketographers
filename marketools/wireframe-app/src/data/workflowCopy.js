// Plan de trabajo que va al INICIO del prompt exportado: en qué orden tiene
// que trabajar la IA del alumno, qué skills de Pablo invoca en cada etapa y
// cómo queda la estructura final de archivos (la misma de los repos
// estudiographica y marketographers). Criterio tomado de las skills
// photographer-landing y meta-ads-fotografos: vista previa local primero, ZIP
// al final, y Netlify solo cuando hace falta código de servidor.

// Embudos cuya conversión real llega por servidor (webhook de Cal.com).
const SERVER_FUNNELS = [3, 4]

export function buildSkillsSection() {
  return [
    '## Skills de Pablo Villarroel que debes usar (si el usuario las tiene)',
    'The Marketographers tiene skills hechas para este mismo proceso. Antes de empezar, revisa tu lista de skills disponibles.',
    'Por cada skill que exista, invócala con tu herramienta de skills (o pídele al usuario que escriba su nombre con barra,',
    'por ejemplo /photographer-landing) y sigue sus instrucciones durante esa etapa. Si alguna no está disponible, dilo en una',
    'sola línea ("no tengo la skill X, sigo con las reglas de este documento") y continúa sin frenar el trabajo. Lo que diría',
    'una skill que no ves, lo preguntas o lo resuelves con este documento.',
    '',
    '- marketools-wireframe: explica cómo leer este documento y el flujo completo (un solo index.html, ZIP, GitHub Pages y luego Netlify). Si existe, es la guía de este plan.',
    '- photographer-landing: la usas en todo el proyecto. Aporta los embudos, el control de calidad técnico antes del ZIP, el pixel y la API de Conversiones, SEO, la página de privacidad, el deploy y la ficha del fotógrafo. El wireframe de este documento ya cubre su FASE 0 (embudo y datos del negocio) y su FASE 2 (wireframe aprobado), así que no repitas esas preguntas.',
    '- que-no-suene-a-ia: la aplicas a todo texto que escribas tú, sobre todo a las propuestas para lo que viene entre corchetes [así]. Los textos deben sonar a una persona, con la voz del usuario.',
    '- meta-ads-fotografos: cuando la página esté publicada y el usuario quiera anuncios. Se encarga de la auditoría de la cuenta, las audiencias y la campaña. También te dice qué tracking debe tener la página antes de gastar en anuncios.',
    '- anuncios-creativos-fotografos: si el usuario todavía no tiene anuncios hechos, genera las ideas y guiones de los creativos.',
    '- wpp-ia: opcional, para un agente de WhatsApp que responde y agenda solo.',
    '',
    'Prioridad cuando haya diferencias: en diseño, bloques, textos y animaciones manda este documento, porque es lo que el usuario ya armó y aprobó visualmente. En el orden de trabajo, la estructura de archivos del ZIP y la publicación (primero un solo index.html, después GitHub Pages y recién con APIs Netlify) manda este plan. En tracking, SEO, privacidad, seguridad de claves y control de calidad mandan las skills. Si tienes la skill marketools-wireframe, sigue lo que dice para este flujo.',
    '',
  ].join('\n')
}

export function buildWorkflowSection({ funnelId, hasPixel }) {
  const needsServerSoon = SERVER_FUNNELS.includes(funnelId)
  const goodbyePage = [3, 4, 5].includes(funnelId)
  return [
    '## Cómo vas a trabajar (sigue este orden, no te saltes pasos)',
    '',
    '### Paso 0. Dos preguntas antes de escribir código',
    'Hazle estas preguntas al usuario de a una, con opciones para elegir, y espera cada respuesta:',
    '1. "¿Tienes un sistema de diseño guardado (tus colores, tipografías y componentes)?"',
    '   A) Sí, te lo paso: úsalo por encima de los colores y tipografías de este documento y respeta sus componentes.',
    '   B) No: si tu plataforma permite guardar un sistema de diseño (en Claude existe como tipo de artefacto "Design System" en los planes que lo incluyen), sugiérele crearlo primero con los colores, tipografías y botones de este documento. Así esta página y todas las que haga después salen con el mismo estilo. Si su plan no lo incluye o no quiere, sigue con los valores de este documento.',
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
      ? '- El código del pixel ya va dentro, y avísale que no se puede probar abriendo el archivo desde la computadora: los navegadores bloquean esos scripts en archivos locales. Se prueba después de publicar.'
      : '- Deja los espacios del tracking marcados con comentarios, como se indica más abajo.',
    '- Termina cada entrega preguntando qué quiere cambiar o si ya lo aprueba.',
    '',
    '### Paso 2. Cuando el usuario escriba que lo aprueba: control de calidad y proyecto completo en un ZIP',
    'Primero revisa tú mismo el archivo (el usuario no puede ver esto mirando la página):',
    '- Todos los botones y enlaces llevan a un destino real, ninguno queda con href vacío o "#".',
    '- Hay un solo H1, los títulos siguen el orden indicado en cada bloque y cada imagen tiene alt.',
    '- Title, meta description, Open Graph (título, descripción, imagen 1200x630) y canonical completos.',
    '- Se ve bien a 375px de ancho y a escritorio, y con movimiento reducido solo quedan fundidos.',
    '- No hay errores en consola ni rutas rotas.',
    'Después separa el archivo en la estructura final y entrégala en un solo ZIP, igual a la de los repositorios de referencia:',
    '```',
    'index.html',
    'assets/css/styles.css      (todo el CSS que estaba en <style>)',
    'assets/js/main.js          (todo el JavaScript que estaba en <script>)',
    hasPixel ? 'privacidad/index.html     (obligatoria si hay pixel, la exige Meta)' : null,
    goodbyePage ? 'gracias/index.html        (página de agradecimiento del embudo, con noindex)' : null,
    '404.html                   (mismo header y footer, con botón de vuelta al inicio)',
    'robots.txt                 (Allow: / y la línea Sitemap: con la URL completa)',
    'sitemap.xml                (las páginas indexables, con lastmod de hoy)',
    'llms.txt                   (nombre del negocio, resumen de una línea y lista de páginas)',
    'ai.txt                     (tres líneas: pueden entrenarse, rastrear y citar el sitio)',
    'favicon.ico                (más favicon-32x32.png y apple-touch-icon.png, hechos desde el logo)',
    'README.md                  (qué es cada archivo y cómo se publica)',
    '```',
    'Si el usuario tiene fuentes propias en archivo, van en una carpeta fonts/. Si sube fotos locales en vez de Cloudinary, van en images/. Las funciones de servidor y netlify.toml se agregan recién en el Paso 4.',
    '- Cada página vive en su carpeta con un index.html, así la URL queda limpia (/privacidad/). Las rutas internas son relativas según la profundidad: `assets/css/styles.css` desde la raíz y `../assets/css/styles.css` desde una carpeta. Con rutas relativas el sitio funciona igual en GitHub Pages (usuario.github.io/repositorio/), en Netlify y en el dominio final.',
    '- Canonical, og:image, sitemap.xml, robots.txt y llms.txt llevan la URL absoluta donde se publicará. Si no la sabes, pregúntala antes de cerrar el ZIP.',
    '- Dentro del ZIP los archivos van en la raíz, sin una carpeta que los envuelva, para que el usuario los arrastre directo a GitHub. Ningún nombre de archivo o carpeta empieza con punto ni con guion bajo, porque en Mac quedan ocultos al arrastrar y GitHub Pages ignora los que empiezan con guion bajo.',
    '- Vuelve a mostrar la vista previa del resultado final para confirmar que la separación no rompió nada.',
    '',
    '### Paso 3. Publicar',
    'Explícale estos pasos al usuario, uno por uno:',
    '1. En github.com: botón "New repository", nombre corto sin espacios, visibilidad Public, crear.',
    '2. En el repositorio nuevo: "Add file", "Upload files", arrastrar TODO el contenido del ZIP descomprimido (los archivos y carpetas, sin la carpeta madre) y "Commit changes".',
    '3. Si eligió GitHub Pages: Settings, Pages, Source "Deploy from a branch", rama main, carpeta / (root) y Save. En uno o dos minutos la página queda en usuario.github.io/repositorio/. Cada cambio futuro se sube igual y se publica solo, sin costo.',
    '4. Si eligió Netlify: en app.netlify.com, "Add new project" (o "Add new site"), "Import an existing project", GitHub y este repositorio. Build command vacío y publish directory "." (punto). Para no gastar créditos, cada cambio futuro se sube primero a una rama aparte, se revisa en el link de vista previa que genera Netlify y recién aprobado se une a main.',
    '5. Cuando la página esté en línea, prueba lo que no se podía probar en local (pixel, Open Graph, velocidad). La skill photographer-landing tiene la lista de verificación posterior al deploy.',
    '',
    '### Paso 4. Cuando necesite APIs (más adelante, no ahora)',
    'Si empezó en GitHub Pages y después quiere la API de Conversiones de Meta, el webhook de Cal.com o formularios que manden emails, el mismo repositorio se conecta a Netlify (Paso 3.4). Aquí usa la skill photographer-landing (FASE 4 y 5) y, para dejar lista la cuenta de anuncios, meta-ads-fotografos. Se suman estos archivos:',
    '- netlify.toml en la raíz (publish = ".", functions = "netlify/functions").',
    '- netlify/functions/ con la función que haga falta (por ejemplo capi.js para la API de Conversiones).',
    '- Las claves secretas (como META_CAPI_TOKEN) las pega el usuario en Netlify, Site configuration, Environment variables. Tú lo guías hasta el campo y esperas. Nunca escribas una clave en el código ni la repitas en el chat; si el usuario la pega en el chat, pídele que la borre de su mensaje y la ponga directo en Netlify.',
    '- Una función que dependa de una clave y no la encuentre responde con éxito al visitante pero deja marcado "sin configurar", para que se note al probar.',
    '- Después de conectar el dominio a Netlify, apaga GitHub Pages (Settings, Pages, Unpublish) para que no queden dos copias del sitio compitiendo en Google, y deja el <link rel="canonical"> apuntando al dominio final.',
    '',
    '### Al terminar',
    'Cuando la página esté publicada, entrégale al usuario su ficha del fotógrafo actualizada (la define la skill photographer-landing) y dile qué escribir para seguir: "configura mi Meta Ads" para los anuncios, "ayúdame con los creativos" si todavía no tiene anuncios hechos, y opcionalmente el agente de WhatsApp con wpp-ia. Esas etapas no las empieces tú desde aquí.',
    '',
  ]
    .filter((l) => l !== null)
    .join('\n')
}

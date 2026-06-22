// Prerender estático por ruta para la SPA.
// Genera dist/<ruta>/index.html con contenido, título y canonical propios,
// para que crawlers sin JS (Google, motores de IA) reciban HTML real por
// ruta en vez del shell del home. React monta encima para los usuarios.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const ORIGIN = 'https://music-presskit-generator.com';

const template = readFileSync(join(DIST, 'index.html'), 'utf8');

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/** Reemplaza head meta + contenido de #root para una ruta. */
function buildPage({ title, description, canonical, body }) {
  let html = template;

  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/(<meta name="title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${esc(canonical)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${esc(canonical)}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(description)}$2`)
    .replace(/(<meta name="twitter:url" content=")[^"]*(")/, `$1${esc(canonical)}$2`);

  // Reemplaza el contenido de #root (greedy hasta el cierre de </body>).
  const before = html;
  html = html.replace(
    /<div id="root">[\s\S]*<\/div>(\s*<\/body>)/,
    `<div id="root">${body}</div>$1`,
  );
  if (html === before) {
    throw new Error('Prerender: no se pudo reemplazar el contenido de #root (regex sin match).');
  }

  return html;
}

const SHELL_STYLE =
  'max-width:760px;margin:0 auto;padding:48px 24px;font-family:system-ui,sans-serif;color:#1e293b;';

const pages = {
  about: {
    title: 'Nosotros | Presskit Generator para Artistas',
    description:
      'Conoce a Presskit Generator: profesionalizamos la presentación de los artistas independientes con EPKs claros, visuales y listos para abrir puertas.',
    canonical: `${ORIGIN}/about`,
    body: `
      <main style="${SHELL_STYLE}">
        <h1>Profesionalizamos la presentación de los artistas independientes</h1>
        <p>Presskit Generator es una plataforma creada para que músicos, bandas y proyectos independientes presenten su trabajo con el mismo nivel profesional que los artistas de sello, sin depender de un diseñador ni de una agencia. Convertimos tu biografía, fotos, música y logros en un EPK (electronic press kit) claro, visual y listo para abrir puertas.</p>
        <h2>Nuestra historia</h2>
        <p>Trabajando con artistas emergentes de la escena de Bogotá y otras ciudades de Latinoamérica, notamos un patrón: el talento sobraba, pero la presentación fallaba. Construimos Presskit Generator para cerrar esa brecha y darle a cada artista una herramienta que ordene su trayectoria y la presente como merece, en minutos.</p>
        <h2>Lo que nos mueve</h2>
        <ul>
          <li><strong>Hecho por y para la escena independiente:</strong> conocemos lo que un programador de festival o un periodista necesita ver para decir que sí.</li>
          <li><strong>Calidad de agencia, sin precio de agencia:</strong> criterios de diseño y narrativa profesionales en una herramienta accesible.</li>
          <li><strong>Tu información, siempre tuya:</strong> no vendemos tus datos; tu presskit es tuyo.</li>
        </ul>
        <h2>Quién está detrás</h2>
        <p>Presskit Generator es un proyecto de <strong>Al Mejor Estilo Music</strong>, un equipo inmerso en la escena musical independiente de habla hispana. Desde el contacto directo con artistas, productores y managers nació esta herramienta para profesionalizar cómo los proyectos emergentes se presentan a la industria. Síguenos en <a href="https://www.instagram.com/almejorestilomusic" rel="me">Instagram</a> y <a href="https://www.tiktok.com/@almejorestilomusic" rel="me">TikTok</a>.</p>
        <h2>Contacto</h2>
        <p>¿Dudas o colaboraciones? Escríbenos a <a href="mailto:soporte@music-presskit-generator.com">soporte@music-presskit-generator.com</a>.</p>
        <p>
          <a href="/">Inicio</a> ·
          <a href="/#precios">Precios</a> ·
          <a href="/#faq">Preguntas frecuentes</a> ·
          <a href="/privacidad">Privacidad</a> ·
          <a href="/terminos">Términos</a> ·
          <a href="/auth">Crear mi presskit</a>
        </p>
      </main>`,
  },
  privacidad: {
    title: 'Política de Privacidad | Presskit Generator',
    description: 'Cómo Presskit Generator recopila, usa y protege tus datos personales.',
    canonical: `${ORIGIN}/privacidad`,
    body: `
      <main style="${SHELL_STYLE}">
        <h1>Política de Privacidad</h1>
        <p>Presskit Generator es responsable del tratamiento de los datos personales que recopilamos a través de music-presskit-generator.com. Para cualquier consulta escríbenos a <a href="mailto:soporte@music-presskit-generator.com">soporte@music-presskit-generator.com</a>.</p>
        <h2>Datos que recopilamos</h2>
        <p>Datos de cuenta (nombre, correo), el contenido que cargas para tu presskit y datos de pago procesados de forma segura por Mercado Pago (no almacenamos los datos de tu tarjeta).</p>
        <h2>Cómo usamos tus datos</h2>
        <p>Para crear y alojar tu presskit, generar el PDF y el enlace público, procesar pagos, brindar soporte y mejorar el servicio. No vendemos tus datos personales a terceros.</p>
        <h2>Tus derechos</h2>
        <p>Puedes acceder, corregir o eliminar tus datos y tu cuenta en cualquier momento escribiéndonos a soporte@music-presskit-generator.com.</p>
        <p><a href="/">Inicio</a> · <a href="/terminos">Términos de Servicio</a> · <a href="/about">Nosotros</a></p>
      </main>`,
  },
  terminos: {
    title: 'Términos de Servicio | Presskit Generator',
    description: 'Términos y condiciones de uso de la plataforma Presskit Generator.',
    canonical: `${ORIGIN}/terminos`,
    body: `
      <main style="${SHELL_STYLE}">
        <h1>Términos de Servicio</h1>
        <p>Al usar music-presskit-generator.com aceptas estos Términos de Servicio. Si no estás de acuerdo, no utilices la plataforma.</p>
        <h2>Descripción del servicio</h2>
        <p>Presskit Generator es una herramienta que permite a artistas musicales crear un EPK profesional, descargable en PDF y compartible mediante un enlace web público.</p>
        <h2>Planes y pagos</h2>
        <p>Plan por descarga (The Starter Beat, $4.99 USD, incluye enlace público por 20 días) y plan anual (The Headliner Pro, $14.99 USD, con descargas ilimitadas). Los pagos se procesan a través de Mercado Pago.</p>
        <h2>Contenido del usuario</h2>
        <p>Eres responsable del contenido que cargas y declaras que cuentas con los derechos necesarios sobre ese material.</p>
        <p><a href="/">Inicio</a> · <a href="/privacidad">Política de Privacidad</a> · <a href="/about">Nosotros</a></p>
      </main>`,
  },
};

let count = 0;
for (const [route, data] of Object.entries(pages)) {
  const dir = join(DIST, route);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), buildPage(data), 'utf8');
  count += 1;
  console.log(`  prerendered /${route}`);
}
console.log(`✓ Prerender: ${count} rutas generadas`);

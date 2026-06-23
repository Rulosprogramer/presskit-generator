// Metadata SEO por ruta para la SPA.
// Como todas las rutas sirven el mismo index.html, el canonical/título se
// ajustan dinámicamente al navegar para evitar contenido duplicado.
// Googlebot renderiza JS, así que detecta estos valores.

const ORIGIN = 'https://music-presskit-generator.com';

const DEFAULT_DESC =
  'Crea un EPK profesional para presentar tu música a festivales, medios, managers y sellos. Sin diseñador, listo en minutos. Empieza a crear tu presskit ahora.';

interface RouteMeta {
  title: string;
  description: string;
  canonical: string;
  index: boolean;
}

const ROUTES: Record<string, RouteMeta> = {
  '/': {
    title: 'Crea EPKs profesionales para artistas, bandas y músicos',
    description: DEFAULT_DESC,
    canonical: `${ORIGIN}/`,
    index: true,
  },
  '/about': {
    title: 'Nosotros | Presskit Generator para Artistas',
    description:
      'Conoce a Presskit Generator: profesionalizamos la presentación de los artistas independientes con EPKs claros, visuales y listos para abrir puertas.',
    canonical: `${ORIGIN}/about`,
    index: true,
  },
  '/privacidad': {
    title: 'Política de Privacidad | Presskit Generator',
    description: 'Cómo Presskit Generator recopila, usa y protege tus datos personales.',
    canonical: `${ORIGIN}/privacidad`,
    index: true,
  },
  '/terminos': {
    title: 'Términos de Servicio | Presskit Generator',
    description: 'Términos y condiciones de uso de la plataforma Presskit Generator.',
    canonical: `${ORIGIN}/terminos`,
    index: true,
  },
};

// Rutas privadas / de aplicación: no deben indexarse.
const NOINDEX_PREFIXES = ['/dashboard', '/createPresskit', '/checkout', '/presskitPDF', '/auth'];

function setMeta(name: string, content: string, attr: string = 'name') {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function applyRouteMeta(pathname: string) {
  // Presskit público: canonical a su propia URL, indexable.
  if (pathname.startsWith('/presskit/')) {
    const url = `${ORIGIN}${pathname}`;
    setCanonical(url);
    setMeta('robots', 'index, follow');
    setMeta('og:url', url, 'property');
    return;
  }

  // Rutas de aplicación privadas: noindex.
  if (NOINDEX_PREFIXES.some((p) => pathname.startsWith(p))) {
    setMeta('robots', 'noindex, nofollow');
    setCanonical(`${ORIGIN}${pathname}`);
    return;
  }

  const meta = ROUTES[pathname] || ROUTES['/'];
  document.title = meta.title;
  setMeta('title', meta.title);
  setMeta('description', meta.description);
  setMeta('robots', meta.index ? 'index, follow' : 'noindex, nofollow');
  setCanonical(meta.canonical);
  // Open Graph / Twitter en sintonía con la ruta.
  setMeta('og:title', meta.title, 'property');
  setMeta('og:description', meta.description, 'property');
  setMeta('og:url', meta.canonical, 'property');
  setMeta('twitter:title', meta.title);
  setMeta('twitter:description', meta.description);
  setMeta('twitter:url', meta.canonical);
}

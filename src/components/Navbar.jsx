import { useEffect, useState } from 'react';
import logo from '../assets/logo-black-bg.svg';

const navItems = [
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Beneficios', href: '#beneficios' },
  { label: 'Ejemplos', href: '#ejemplos' },
  { label: 'Precios', href: '#precios' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Nosotros', href: '/about', isRoute: true },
  { label: 'Start Creating', href: '#cta', isHighlight: true },
];

function Navbar({ user, pathname = '/' }) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState('');
  const isLanding = pathname === '/';

  // Scroll-spy: resalta la sección visible en el viewport (solo en la landing).
  useEffect(() => {
    if (!isLanding) return undefined;

    const ids = navItems.filter((i) => !i.isRoute).map((i) => i.href.replace('#', ''));
    const offset = 140; // alto del navbar + margen

    const onScroll = () => {
      // ¿Llegamos al final de la página? La sección más abajo (por DOM) queda activa.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
        let bottomId = '';
        let maxTop = -Infinity;
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.offsetTop > maxTop) {
            maxTop = el.offsetTop;
            bottomId = id;
          }
        }
        if (bottomId) {
          setActiveId('#' + bottomId);
          return;
        }
      }
      // Elige la sección cuyo borde superior es el más cercano por encima del offset.
      let current = '';
      let closest = -Infinity;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= offset && top > closest) {
          closest = top;
          current = '#' + id;
        }
      }
      setActiveId(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isLanding]);

  // En páginas que no son la landing, los anchors deben volver al home (/#seccion).
  const hrefFor = (item) => {
    if (item.isRoute) return item.href;
    return isLanding ? item.href : `/${item.href}`;
  };

  const isActive = (item) => {
    if (item.isRoute) return pathname === item.href;
    return isLanding && activeId === item.href;
  };

  const linkClass = (item) => {
    const active = isActive(item);
    if (item.isHighlight || active) {
      return 'text-fuchsia-300 hover:text-fuchsia-200 font-semibold';
    }
    return 'text-zinc-200 hover:text-white';
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-4 lg:px-12">
        <a href={isLanding ? '#inicio' : '/'} className="inline-flex items-center gap-3 text-white">
          <img src={logo} alt="Presskit Generator" className="h-16 w-auto" />
          <span className="hidden text-lg font-extrabold tracking-tight sm:inline">
            Music PressKit Generator
          </span>
        </a>

        <ul className="hidden items-center gap-8 text-sm font-medium text-zinc-200 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                className={`transition ${linkClass(item)}`}
                href={hrefFor(item)}
                onClick={() => { if (!item.isRoute && isLanding) setActiveId(item.href); }}
                aria-current={isActive(item) ? 'page' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-zinc-300 sm:inline">
                Hola, <span className="font-semibold text-white">{user.displayName || user.email}</span>
              </span>
              <a
                href="/createPresskit"
                className="hidden rounded-lg bg-fuchsia-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-fuchsia-300 md:inline-flex"
              >
                Crear presskit
              </a>
            </>
          ) : (
            <a
              href="/auth"
              className="hidden rounded-lg bg-fuchsia-400 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-fuchsia-300 md:inline-flex"
            >
              Iniciar sesión
            </a>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold text-white md:hidden"
          aria-expanded={open}
          aria-label="Abrir menu"
        >
          Menu
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-zinc-900 px-6 py-4 md:hidden">
          <ul className="space-y-3 text-sm font-medium text-zinc-200">
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <li key={item.href}>
                  <a
                    href={hrefFor(item)}
                    className={`block rounded-md px-2 py-1 transition hover:bg-white/10 ${
                      item.isHighlight || active ? 'text-fuchsia-300 font-semibold' : 'hover:text-white'
                    }`}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => {
                      if (!item.isRoute && isLanding) setActiveId(item.href);
                      setOpen(false);
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
          {user && (
            <div className="mt-3 border-t border-white/10 pt-3">
              <p className="px-2 text-xs text-zinc-400">Conectado como:</p>
              <p className="px-2 text-sm font-semibold text-white">{user.displayName || user.email}</p>
            </div>
          )}
          <div className="mt-4 space-y-2">
            {user ? (
              <>
                <a
                  href="/createPresskit"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-lg bg-fuchsia-400 px-4 py-2 text-center text-sm font-semibold text-zinc-950"
                >
                  Crear presskit
                </a>
                <a
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-lg bg-cyan-300 px-4 py-2 text-center text-sm font-semibold text-zinc-950"
                >
                  Mis presskits
                </a>
              </>
            ) : (
              <a
                href="/auth"
                onClick={() => setOpen(false)}
                className="block w-full rounded-lg bg-fuchsia-400 px-4 py-2 text-center text-sm font-semibold text-zinc-950"
              >
                Iniciar sesión
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

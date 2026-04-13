import { useState } from 'react';
import logo from '../assets/logo-black-bg.svg';

const navItems = [
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Beneficios', href: '#beneficios' },
  { label: 'Ejemplos', href: '#ejemplos' },
  { label: 'Precios', href: '#precios' },
  { label: 'Start Creating', href: '#cta', isHighlight: true },
];

function Navbar({ user }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-4 lg:px-12">
        <a href="#inicio" className="inline-flex items-center gap-3 text-white">
          <img src={logo} alt="Presskit Generator" className="h-16 w-auto" />
          <span className="hidden text-lg font-extrabold tracking-tight sm:inline">
            presskit-generator
          </span>
        </a>

        <ul className="hidden items-center gap-8 text-sm font-medium text-zinc-200 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <a className={`transition ${item.isHighlight ? 'text-fuchsia-300 hover:text-fuchsia-200 font-semibold' : 'hover:text-white'}`} href={item.href}>
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
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block rounded-md px-2 py-1 transition hover:bg-white/10 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
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

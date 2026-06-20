function Footer({ pathname = '/' }) {
  const year = new Date().getFullYear();
  const isLanding = pathname === '/';
  // Fuera de la landing, los anchors deben volver al home (/#seccion).
  const sectionHref = (hash) => (isLanding ? hash : `/${hash}`);

  return (
    <footer className="border-t border-white/10 bg-[#0f1624]">
      <div className="mx-auto w-full max-w-400 px-6 py-10 lg:px-12">
        <div className="mx-auto flex w-full max-w-4xl justify-center pb-5">
          <a
            href="/auth"
            className="inline-flex items-center justify-center rounded-lg bg-fuchsia-400 px-6 py-4 text-sm font-semibold text-zinc-950 transition hover:bg-fuchsia-300 sm:text-base"
          >
            Start Creating
          </a>
        </div>

        <div className="w-full border-y border-white/10 bg-linear-to-r from-cyan-400/10 via-fuchsia-400/12 to-cyan-400/10 py-3">
          <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-center text-sm text-[#d7dde6]">
            <a href={sectionHref('#inicio')} className="transition hover:text-white">Inicio</a>
            <a href={sectionHref('#precios')} className="transition hover:text-white">Precios</a>
            <a href={sectionHref('#cta')} className="transition hover:text-white">Empezar</a>
            <a href="/about" className="transition hover:text-white">Nosotros</a>
            <a href="/privacidad" className="transition hover:text-white">Privacidad</a>
            <a href="/terminos" className="transition hover:text-white">Términos</a>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-5 pt-5 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 text-[#9aa8bb]">
            <a
              href="https://www.instagram.com/almejorestilomusic"
              target="_blank"
              rel="noopener noreferrer me"
              aria-label="Instagram"
              className="transition hover:text-white"
            >
              <svg className="h-7 w-7 sm:h-9 sm:w-9" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.62c-3.15 0-3.52.01-4.76.07-.99.04-1.53.21-1.89.35-.47.18-.82.4-1.18.76-.36.36-.58.71-.76 1.18-.14.36-.31.9-.35 1.89-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.04.99.21 1.53.35 1.89.18.47.4.82.76 1.18.36.36.71.58 1.18.76.36.14.9.31 1.89.35 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c.99-.04 1.53-.21 1.89-.35.47-.18.82-.4 1.18-.76.36-.36.58-.71.76-1.18.14-.36.31-.9.35-1.89.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.04-.99-.21-1.53-.35-1.89a3.18 3.18 0 0 0-.76-1.18 3.18 3.18 0 0 0-1.18-.76c-.36-.14-.9-.31-1.89-.35-1.24-.06-1.61-.07-4.76-.07zm0 2.76a5.46 5.46 0 1 1 0 10.92 5.46 5.46 0 0 1 0-10.92zm0 9a3.54 3.54 0 1 0 0-7.08 3.54 3.54 0 0 0 0 7.08zm6.95-9.22a1.28 1.28 0 1 1-2.55 0 1.28 1.28 0 0 1 2.55 0z"/>
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@almejorestilomusic"
              target="_blank"
              rel="noopener noreferrer me"
              aria-label="TikTok"
              className="transition hover:text-white"
            >
              <svg className="h-7 w-7 sm:h-9 sm:w-9" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .59.05.86.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z"/>
              </svg>
            </a>
          </div>

          <p className="text-xs text-[#9aa8bb]">© {year} Presskit Generator</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

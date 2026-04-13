function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-6 py-10 text-sm text-zinc-400 md:flex-row md:items-center md:justify-between lg:px-12">
        <p>2026 presskit-generator. Hecho para artistas independientes.</p>
        <div className="flex items-center gap-5">
          <a href="#inicio" className="transition hover:text-white">
            Inicio
          </a>
          <a href="#precios" className="transition hover:text-white">
            Precios
          </a>
          <a href="#cta" className="transition hover:text-white">
            Empezar
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

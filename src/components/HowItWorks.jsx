function HowItWorks() {
  return (
    <section id="como-funciona" className="mx-auto w-full max-w-[1600px] px-6 py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-lg font-semibold tracking-[0.04em] text-cyan-300 sm:text-xl">
          ¿Cómo Funciona?
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Automatiza tu identidad visual. Domina la industria.
        </h2>
        <p className="mt-3 text-sm text-zinc-400 sm:text-base">
          Transforma datos dispersos en un EPK profesional, listo para abrir puertas.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <article className="group relative rounded-2xl border border-cyan-300/25 bg-white/5 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-300/60 hover:shadow-[0_20px_55px_rgba(34,211,238,0.28)]">
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/10 via-transparent to-fuchsia-500/10 opacity-70" />
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/60 bg-cyan-300/10 text-sm font-extrabold text-cyan-300">
                01
              </span>
              <span className="text-xl text-cyan-300 animate-pulse">✦</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">Sincroniza tu Data</h3>
            <p className="mt-2 text-zinc-300">
              Importa tu catálogo desde Spotify o Apple Music y unifica tu bio,
              redes y logros en un motor inteligente. Olvida los formularios
              infinitos.
            </p>
          </div>
        </article>

        <article className="group relative rounded-2xl border border-fuchsia-300/25 bg-white/5 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-fuchsia-300/65 hover:shadow-[0_20px_55px_rgba(232,121,249,0.25)]">
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-fuchsia-400/15 via-transparent to-violet-500/10 opacity-70" />
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-fuchsia-300/60 bg-fuchsia-300/10 text-sm font-extrabold text-fuchsia-300">
                02
              </span>
              <span className="text-xl text-fuchsia-300 animate-pulse">◆</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">Curaduría de Estilo</h3>
            <p className="mt-2 text-zinc-300">
              Aplica presets diseñados por expertos de la industria. Ajusta la
              estética, el orden de tus videos y tu rider técnico para que hablen
              por ti.
            </p>
          </div>
        </article>

        <article className="group relative rounded-2xl border border-emerald-300/25 bg-white/5 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-emerald-300/60 hover:shadow-[0_20px_55px_rgba(52,211,153,0.25)]">
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400/12 via-transparent to-cyan-400/8 opacity-70" />
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300/60 bg-emerald-300/10 text-sm font-extrabold text-emerald-300">
                03
              </span>
              <span className="text-xl text-emerald-300 animate-pulse">⬢</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-white">Distribución Global</h3>
            <p className="mt-2 text-zinc-300">
              Obtén un enlace dinámico de alto rendimiento. Rastrea quién ve tu
              EPK y compártelo con bookers, sellos y festivales con un solo clic.
            </p>
          </div>
        </article>
      </div>

      <p className="mt-8 text-center text-sm text-zinc-500 sm:text-base">
        Utilizado por productores y managers de la escena independiente en Bogotá.
      </p>
    </section>
  );
}

export default HowItWorks;

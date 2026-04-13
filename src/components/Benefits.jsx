function Benefits() {
  return (
    <section id="beneficios" className="mx-auto w-full max-w-[1600px] px-6 py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-lg font-semibold tracking-[0.04em] text-cyan-300 sm:text-xl">
          Beneficios
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Por qué un EPK puede abrirte más puertas en la industria
        </h2>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <article className="group relative rounded-2xl border border-cyan-300/25 bg-white/5 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-300/60 hover:shadow-[0_20px_55px_rgba(34,211,238,0.25)]">
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/10 via-transparent to-fuchsia-500/8 opacity-75" />
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/60 bg-cyan-300/10 text-sm font-extrabold text-cyan-300">01</span>
              <span className="text-cyan-300 animate-pulse">✦</span>
            </div>
            <p className="mt-4 text-sm font-semibold text-fuchsia-300">Imagen profesional</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Primera impresión sólida</h3>
            <p className="mt-2 text-zinc-300">
              Tu proyecto se presenta con una narrativa clara y una identidad visual coherente.
            </p>
          </div>
        </article>

        <article className="group relative rounded-2xl border border-fuchsia-300/25 bg-white/5 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-fuchsia-300/60 hover:shadow-[0_20px_55px_rgba(232,121,249,0.25)]">
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-fuchsia-400/12 via-transparent to-violet-500/10 opacity-75" />
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-fuchsia-300/60 bg-fuchsia-300/10 text-sm font-extrabold text-fuchsia-300">02</span>
              <span className="text-fuchsia-300 animate-pulse">◆</span>
            </div>
            <p className="mt-4 text-sm font-semibold text-fuchsia-300">Más oportunidades</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Booking y prensa más rápido</h3>
            <p className="mt-2 text-zinc-300">
              Programadores, medios y managers encuentran todo lo necesario en un solo enlace.
            </p>
          </div>
        </article>

        <article className="group relative rounded-2xl border border-emerald-300/25 bg-white/5 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-emerald-300/60 hover:shadow-[0_20px_55px_rgba(52,211,153,0.22)]">
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400/12 via-transparent to-cyan-500/8 opacity-75" />
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300/60 bg-emerald-300/10 text-sm font-extrabold text-emerald-300">03</span>
              <span className="text-emerald-300 animate-pulse">⬢</span>
            </div>
            <p className="mt-4 text-sm font-semibold text-fuchsia-300">Ahorro de tiempo</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Información centralizada</h3>
            <p className="mt-2 text-zinc-300">
              Bio, fotos, música, videos y contacto listos para compartir sin enviar archivos sueltos.
            </p>
          </div>
        </article>

        <article className="group relative rounded-2xl border border-violet-300/25 bg-white/5 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-violet-300/60 hover:shadow-[0_20px_55px_rgba(167,139,250,0.22)]">
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-400/12 via-transparent to-indigo-500/10 opacity-75" />
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-violet-300/60 bg-violet-300/10 text-sm font-extrabold text-violet-300">04</span>
              <span className="text-violet-300 animate-pulse">✺</span>
            </div>
            <p className="mt-4 text-sm font-semibold text-fuchsia-300">Escalable</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Crece contigo</h3>
            <p className="mt-2 text-zinc-300">
              Actualiza tu EPK cada lanzamiento para mantener tu perfil vigente y competitivo.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

export default Benefits;

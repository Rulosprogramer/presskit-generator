function CTA() {
  return (
    <>
      <section id="precios" className="mx-auto w-full max-w-[1600px] px-6 py-16 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg font-semibold tracking-[0.04em] text-cyan-300 sm:text-xl">
            Precios
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            Planes flexibles para cada etapa de tu proyecto
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-2xl font-bold text-white">The Starter Beat</h3>
            <p className="mt-3 text-6xl font-black text-cyan-300">$1</p>
            <p className="mt-2 text-sm text-zinc-400">USD por descarga, una vez por cada actualización</p>

            <p className="mt-6 text-lg font-semibold italic text-fuchsia-300">
              Lanza con impacto sin complicaciones.
            </p>

            <ul className="mt-6 space-y-3 text-zinc-200">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span>
                <span>One-Page Dinámica: Tu info esencial en un solo lugar.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span>
                <span>Integración de Streaming: Enlaces directos a Spotify e iTunes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span>
                <span>Bio Optimizada: Espacio para tu historia y contacto de prensa.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">✓</span>
                <span>Descarga PDF Profesional: Diseño impecable, listo para compartir.</span>
              </li>
            </ul>

            <p className="mt-6 text-sm italic text-zinc-300">
              "Un PDF profesional en minutos, sin esperar una agencia. Por lo que cuesta un café, asegura tu imagen."
            </p>

            <a href="/auth" className="mt-8 inline-block w-full rounded-xl bg-cyan-300 px-6 py-3 text-center text-sm font-semibold text-zinc-950 transition hover:bg-cyan-200">
              Empezar con The Starter Beat
            </a>
          </article>

          <article className="relative rounded-2xl border-2 border-fuchsia-400/60 bg-fuchsia-400/10 p-8">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="inline-block rounded-full bg-fuchsia-400 px-4 py-1 text-xs font-bold uppercase tracking-[0.1em] text-zinc-950">
                ⭐ Recomendado
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white">The Headliner Pro</h3>
            <p className="mt-3 text-6xl font-black text-fuchsia-300">$15</p>
            <p className="mt-2 text-sm text-zinc-400">USD, plan anual</p>

            <p className="mt-6 text-lg font-semibold italic text-cyan-300">
              Tu carrera merece el estándar de la industria.
            </p>

            <ul className="mt-6 space-y-3 text-zinc-200">
              <li className="flex items-start gap-2">
                <span className="text-fuchsia-300">✓</span>
                <span>Todo lo del Plan Básico.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fuchsia-300">✓</span>
                <span>Enlace del EPK: Tu presskit online con Diseño Responsive en todos los dispositivos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fuchsia-300">✓</span>
                <span>Descargas de PDF Ilimitadas: Descarga tu presskit en PDF las veces que necesites.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fuchsia-300">✓</span>
                <span>Galería High-Res: Fotos de prensa descargables (esencial para medios).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fuchsia-300">✓</span>
                <span>Actualiza cuando quieras: Modifica tu contenido en cualquier momento, sin costo adicional.</span>
              </li>
            </ul>

            <p className="mt-6 text-sm italic text-zinc-300">
              "Diseñado para convencer a curadores y programadores. No solo te escuchas pro, te ves pro."
            </p>

            <a href="/auth" className="mt-8 inline-block w-full rounded-xl bg-fuchsia-400 px-6 py-3 text-center text-sm font-semibold text-zinc-950 transition hover:bg-fuchsia-300">
              Empezar con The Headliner Pro
            </a>
          </article>
        </div>
      </section>

      <section id="cta" className="mx-auto w-full max-w-[1600px] px-6 pb-20 lg:px-12 lg:pb-24">
        <div className="rounded-3xl border border-white/15 bg-gradient-to-r from-fuchsia-500/20 to-cyan-400/20 p-8 text-center backdrop-blur lg:p-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Convierte tu música en una presentación profesional
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-200">
            Crea tu primer presskit en minutos y comparte un link listo para la industria.
          </p>
          <a href="/auth" className="mt-8 inline-block rounded-xl bg-white px-7 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200">
            Empezar ahora
          </a>
        </div>
      </section>
    </>
  );
}

export default CTA;

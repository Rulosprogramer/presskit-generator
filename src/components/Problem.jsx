function Problem() {
  return (
    <section id="problema" className="mx-auto w-full max-w-[1600px] px-6 py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-lg font-semibold tracking-[0.04em] text-rose-200 sm:text-xl">
          Problema
        </p>
      </div>

      <div className="group relative mx-auto mt-8 max-w-4xl rounded-3xl border border-rose-300/25 bg-gradient-to-br from-rose-500/12 via-white/5 to-orange-400/8 p-8 shadow-[0_20px_60px_rgba(244,63,94,0.18)] backdrop-blur transition duration-500 hover:-translate-y-1 hover:scale-[1.01] hover:border-cyan-300/45 hover:shadow-[0_25px_80px_rgba(56,189,248,0.25)] sm:p-12">
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.14),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(244,63,94,0.16),transparent_50%)] opacity-0 transition duration-500 group-hover:opacity-100" />
        <div className="relative z-10 text-center">

        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Sabemos lo que te pasa
        </h2>

        <p className="mt-5 text-base leading-relaxed text-zinc-200 sm:text-lg">
          Sabemos que tienes talento, canciones sólidas y una propuesta artística auténtica.
          Pero cuando te piden un press kit, todo se vuelve un caos: links sueltos,
          fotos perdidas, bios desactualizadas y correos que nunca responden.
        </p>

        <p className="mt-4 text-base leading-relaxed text-zinc-300 sm:text-lg">
          No es falta de nivel, es falta de estructura. Y en la industria, la primera impresión
          decide si te abren la puerta o te dejan en visto.
        </p>

        <div className="mt-7 rounded-2xl border border-amber-300/45 bg-amber-100/95 p-4 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-amber-300/35">
          <p className="text-sm font-bold text-zinc-900 sm:text-base">
            Tu música ya está lista para escenarios grandes. Tu presentación también debería estarlo.
          </p>
        </div>
        </div>
      </div>
    </section>
  );
}

export default Problem;

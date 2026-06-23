const useCases = [
  {
    title: 'Press kit para músicos solistas',
    body: 'Reúne tu biografía, fotos y música en un EPK que los medios y curadores entienden en segundos.',
  },
  {
    title: 'EPK para bandas y agrupaciones',
    body: 'Un press kit para agrupaciones musicales con integrantes, trayectoria, rider y galería de prensa.',
  },
  {
    title: 'EPK para festivales',
    body: 'Presenta tu proyecto a programadores con un kit de prensa musical claro y listo para evaluar.',
  },
  {
    title: 'EPK para booking',
    body: 'Dale a managers y bookers toda tu información de contacto y trayectoria en un solo enlace.',
  },
];

function UseCases() {
  return (
    <section id="para-quien" className="mx-auto w-full max-w-[1600px] px-6 py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-lg font-semibold tracking-[0.04em] text-cyan-300 sm:text-xl">
          ¿Para quién es?
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Un Electronic Press Kit para músicos de toda Latinoamérica
        </h2>
        <p className="mt-3 text-sm text-zinc-400 sm:text-base">
          Tanto si buscas un press kit para artistas solistas como un EPK para bandas, te ayudamos a
          crear un kit de prensa musical profesional en minutos.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {useCases.map((u) => (
          <article
            key={u.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-300/50"
          >
            <h3 className="text-lg font-semibold text-white">{u.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">{u.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default UseCases;

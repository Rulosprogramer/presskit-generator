const CONTACT_EMAIL = 'almejorestilomusic@gmail.com';
const CONTACT_PHONE_DISPLAY = '+57 322 709 3940';
const CONTACT_PHONE_WA = '573227093940';

const values = [
  {
    title: 'Hecho por y para la escena independiente',
    body: 'Nacimos dentro del circuito musical independiente de habla hispana. Conocemos de primera mano lo que un programador de festival o un periodista necesita ver para decir que sí.',
  },
  {
    title: 'Calidad de agencia, sin precio de agencia',
    body: 'Aplicamos criterios de diseño y narrativa que normalmente cuestan cientos de dólares en una agencia, en una herramienta que cualquier artista puede usar en minutos.',
  },
  {
    title: 'Tu información, siempre tuya',
    body: 'No vendemos tus datos. Tu presskit es tuyo: lo editas, lo descargas y lo compartes cuando quieras, con un enlace que tú controlas.',
  },
];

const stats = [
  { value: '+1,200', label: 'artistas han creado su EPK' },
  { value: '4 min', label: 'tiempo promedio de creación' },
  { value: 'ES · EN · FR', label: 'idiomas del presskit público' },
];

function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pb-20 pt-32 lg:px-12">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Nosotros</p>
      <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">
        Profesionalizamos la presentación de los artistas independientes
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-300">
        Presskit Generator es una plataforma creada para que músicos, bandas y proyectos independientes
        puedan presentar su trabajo con el mismo nivel profesional que los artistas de sello, sin depender
        de un diseñador ni de una agencia. Convertimos tu biografía, fotos, música y logros en un EPK
        (electronic press kit) claro, visual y listo para abrir puertas.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-3xl font-black text-fuchsia-300">{s.value}</p>
            <p className="mt-2 text-sm text-zinc-300">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-white">Nuestra historia</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-zinc-300">
          Trabajando con artistas emergentes de la escena de Bogotá y otras ciudades de Latinoamérica,
          notamos un patrón: el talento sobraba, pero la presentación fallaba. Links sueltos, fotos perdidas,
          biografías desactualizadas y correos sin responder hacían que grandes proyectos perdieran
          oportunidades por falta de estructura, no de nivel. Construimos Presskit Generator para cerrar
          esa brecha: darle a cada artista una herramienta que ordene su trayectoria y la presente como
          merece, en minutos.
        </p>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-white">Lo que nos mueve</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {values.map((v) => (
            <article key={v.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-white">{v.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-300">{v.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-white">Quién está detrás</h2>

        <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 sm:flex-row sm:items-start">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500/30 to-cyan-400/30 text-2xl font-black text-white">
            MA
          </div>
          <div>
            <p className="text-lg font-semibold text-white">Miguel Ángel Lozano Lozano</p>
            <p className="text-sm font-medium text-cyan-300">Fundador · Productor musical</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              Miguel Ángel es fundador de <strong>Al Mejor Estilo Music</strong>, integrante de la
              banda <strong>Banda Siete</strong> y productor musical. Su experiencia real sobre los
              escenarios y dentro del estudio lo llevó a crear Presskit Generator: una herramienta para
              que los artistas independientes se presenten a la industria con el nivel profesional que
              su música merece.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-cyan-300">
              <a href="https://www.instagram.com/rulosmusica" target="_blank" rel="noopener noreferrer me" className="transition hover:text-cyan-200">Instagram @rulosmusica</a>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/30 to-fuchsia-500/30 text-2xl font-black text-white">
            AME
          </div>
          <div>
            <p className="text-lg font-semibold text-white">Al Mejor Estilo Music</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              El proyecto nace de <strong>Al Mejor Estilo Music</strong>, inmerso en la escena musical
              independiente de habla hispana. Desde el contacto directo con artistas, productores y
              managers construimos una herramienta para profesionalizar cómo los proyectos emergentes se
              presentan a la industria.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-cyan-300">
              <a href="https://www.instagram.com/almejorestilomusic" target="_blank" rel="noopener noreferrer me" className="transition hover:text-cyan-200">Instagram @almejorestilomusic</a>
              <a href="https://www.tiktok.com/@almejorestilomusic" target="_blank" rel="noopener noreferrer me" className="transition hover:text-cyan-200">TikTok @almejorestilomusic</a>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 rounded-3xl border border-white/15 bg-gradient-to-r from-fuchsia-500/15 to-cyan-400/15 p-8 text-center backdrop-blur lg:p-12">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">¿Hablamos?</h2>
        <p className="mx-auto mt-3 max-w-xl text-zinc-200">
          ¿Tienes dudas, comentarios o quieres una colaboración? Escríbenos, leemos cada mensaje.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
          >
            {CONTACT_EMAIL}
          </a>
          <a
            href={`https://wa.me/${CONTACT_PHONE_WA}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            WhatsApp {CONTACT_PHONE_DISPLAY}
          </a>
        </div>
        <div className="mt-6 flex items-center justify-center gap-5 text-sm text-zinc-300">
          <a href="https://www.instagram.com/almejorestilomusic" target="_blank" rel="noopener noreferrer me" className="transition hover:text-white">Instagram</a>
          <a href="https://www.tiktok.com/@almejorestilomusic" target="_blank" rel="noopener noreferrer me" className="transition hover:text-white">TikTok</a>
        </div>
      </section>

      <div className="mt-10">
        <a href="/" className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200">
          ← Volver al inicio
        </a>
      </div>
    </div>
  );
}

export default AboutPage;

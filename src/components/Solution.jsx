import { useEffect, useMemo, useState } from 'react';

const testimonials = [
  {
    name: 'María Rojas',
    role: 'Manager · Bogotá',
    quote:
      'Pasamos de enviar PDFs confusos a cerrar reuniones con programadores en la primera semana.',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop',
  },
  {
    name: 'David Londoño',
    role: 'Artista solista · Medellín',
    quote:
      'Con el EPK organizado, prensa y festivales encontraron todo sin pedirnos material extra.',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
  },
  {
    name: 'Sara Vélez',
    role: 'Booking Agent · Cali',
    quote:
      'Cuando un artista manda este formato, la decisión se acelera porque todo está claro y listo.',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop',
  },
  {
    name: 'Andrés Pineda',
    role: 'Productor · Barranquilla',
    quote:
      'El presskit dejó de ser un dolor de cabeza y se volvió una herramienta real de negociación.',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
  },
  {
    name: 'Luisa Gómez',
    role: 'PR Musical · CDMX',
    quote:
      'Lo usamos para pitching de medios y elevó la calidad percibida del proyecto desde el primer clic.',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&h=300&fit=crop',
  },
  {
    name: 'Nicolás Mejía',
    role: 'Director de Festival',
    quote:
      'Nos permitió revisar riders, fotos y narrativa en minutos. Así se profesionaliza una propuesta.',
    image:
      'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=300&h=300&fit=crop',
  },
];

function Solution() {
  const [startIndex, setStartIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  const slideItems = useMemo(() => {
    const nextItems = [];
    for (let i = 0; i < 4; i += 1) {
      nextItems.push(testimonials[(startIndex + i) % testimonials.length]);
    }
    return nextItems;
  }, [startIndex]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIsSliding(true);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isSliding) return;

    const sync = window.setTimeout(() => {
      setStartIndex((prev) => (prev + 1) % testimonials.length);
      setIsSliding(false);
    }, 650);

    return () => window.clearTimeout(sync);
  }, [isSliding]);

  return (
    <section id="solucion" className="mx-auto w-full max-w-[1600px] px-6 py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-lg font-semibold tracking-[0.04em] text-cyan-300 sm:text-xl">
          Solución
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Convierte tu trayectoria en una presentación que genera confianza
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-zinc-300 sm:text-lg">
          Organizamos tu vida artística en un EPK claro, visual y profesional para que bookers,
          medios y managers entiendan tu valor en segundos.
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur sm:p-4">
        <div
          className={`flex ${isSliding ? 'transition-transform duration-700 ease-out' : ''}`}
          style={{ transform: isSliding ? 'translateX(-25%)' : 'translateX(0%)' }}
        >
          {slideItems.map((item, index) => (
            <article key={`${item.name}-${index}`} className="w-1/4 flex-none px-2">
              <div className="h-full rounded-2xl border border-white/15 bg-zinc-900/70 p-5">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-cyan-300/50"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-zinc-400">{item.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-zinc-200">“{item.quote}”</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <span className="rounded-full border border-white/20 bg-white/8 px-4 py-2 text-sm text-zinc-200">Ideal para festivales</span>
        <span className="rounded-full border border-white/20 bg-white/8 px-4 py-2 text-sm text-zinc-200">Ideal para medios</span>
        <span className="rounded-full border border-white/20 bg-white/8 px-4 py-2 text-sm text-zinc-200">Ideal para managers</span>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-300/25 bg-emerald-400/10 p-5 text-center">
          <p className="text-3xl font-black text-emerald-300">+35</p>
          <p className="mt-1 text-sm text-zinc-200">festivales y circuitos objetivo</p>
          <div className="mx-auto mt-3 h-2 w-32 overflow-hidden rounded-full bg-emerald-900/60">
            <div className="h-full w-[82%] rounded-full bg-emerald-300" />
          </div>
        </div>
        <div className="rounded-2xl border border-cyan-300/25 bg-cyan-400/10 p-5 text-center">
          <p className="text-3xl font-black text-cyan-300">+18</p>
          <p className="mt-1 text-sm text-zinc-200">ruedas de negocio potenciales</p>
          <div className="mx-auto mt-3 h-2 w-32 overflow-hidden rounded-full bg-cyan-900/60">
            <div className="h-full w-[68%] rounded-full bg-cyan-300" />
          </div>
        </div>
        <div className="rounded-2xl border border-fuchsia-300/25 bg-fuchsia-400/10 p-5 text-center">
          <p className="text-3xl font-black text-fuchsia-300">3x</p>
          <p className="mt-1 text-sm text-zinc-200">más claridad en tu propuesta artística</p>
          <div className="mx-auto mt-3 flex h-10 w-24 items-end justify-between gap-1">
            <span className="h-4 w-2 rounded bg-fuchsia-300/55" />
            <span className="h-6 w-2 rounded bg-fuchsia-300/70" />
            <span className="h-8 w-2 rounded bg-fuchsia-300/85" />
            <span className="h-10 w-2 rounded bg-fuchsia-300" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Solution;

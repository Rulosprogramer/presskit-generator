import { useEffect, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';

function Hero() {
  const bookRef = useRef(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const flipApi = bookRef.current?.pageFlip?.();
      if (!flipApi) return;

      const current = flipApi.getCurrentPageIndex();
      const total = flipApi.getPageCount();
      const next = current + 1;

      if (next >= total) {
        flipApi.turnToPage(0);
      } else {
        flipApi.flipNext();
      }
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="inicio" className="relative overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-6 pb-20 pt-32 lg:px-12 lg:pt-36">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
            Presskit Generator para Artistas
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Tu presskit musical
            <span className="block text-fuchsia-300">listo en minutos</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Crea un EPK profesional para presentar tu proyecto a festivales,
            medios, managers y sellos. Sin diseñador, sin fricción,
            con una experiencia pensada para artistas independientes.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href="/auth" className="rounded-xl bg-fuchsia-400 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-fuchsia-300">
              Crear mi presskit
            </a>
            <a href="#ejemplos" className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/10">
              Ver demo
            </a>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-zinc-300">
            <div>
              <p className="text-2xl font-extrabold text-white">+1,200</p>
              <p>artistas activos</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">4 min</p>
              <p>tiempo promedio</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white">100%</p>
              <p>editable</p>
            </div>
          </div>
        </div>

        <div className="relative mt-14">
          <div className="rounded-3xl border border-white/15 bg-white/5 p-4 backdrop-blur sm:p-5">
            <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-4 shadow-2xl shadow-fuchsia-500/10 sm:p-6">
              <p className="text-center text-xs uppercase tracking-[0.18em] text-cyan-200">
                Visualizador de Portafolio Dinámico
              </p>

              <div className="mt-5 flex justify-center">
                <HTMLFlipBook
                  ref={bookRef}
                  width={560}
                  height={520}
                  size="stretch"
                  minWidth={290}
                  maxWidth={680}
                  minHeight={420}
                  maxHeight={620}
                  maxShadowOpacity={0.45}
                  showCover={false}
                  mobileScrollSupport
                  drawShadow
                  flippingTime={950}
                  className="mx-auto"
                  startPage={0}
                  usePortrait={false}
                >
                    <div className="h-full w-full overflow-hidden rounded-xl border border-white/20 bg-zinc-900">
                      <div className="relative h-full">
                        <img
                          src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=1600&fit=crop"
                          alt="Artista de espaldas frente a una multitud"
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6">
                          <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">Portada impactante</p>
                          <h3 className="mt-3 text-3xl font-black text-white">DUNA FEVER</h3>
                          <p className="mt-1 text-sm text-zinc-200">Live at Festival Estéreo Picnic 2026</p>
                          <div className="mt-4 rounded-lg border border-amber-300/50 bg-amber-100/95 p-3 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-amber-300/40">
                            <p className="text-sm font-bold text-zinc-950">
                              Portadas que capturan la atención de los programadores en 2 segundos.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="h-full w-full overflow-hidden rounded-xl border border-white/20 bg-zinc-900 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">Página 2</p>
                      <h3 className="mt-2 text-2xl font-black text-white">OFFICIAL PRESS PHOTOS</h3>
                      <p className="mt-1 text-xs text-zinc-400">Photo Credit: @fictional_photographer</p>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <img
                          src="https://images.unsplash.com/photo-1501612780327-45045538702b?w=600&h=600&fit=crop"
                          alt="Foto de prensa 1"
                          className="h-36 w-full rounded-lg object-cover"
                        />
                        <img
                          src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=600&fit=crop"
                          alt="Foto de prensa 2"
                          className="h-36 w-full rounded-lg object-cover"
                        />
                        <img
                          src="https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?w=600&h=600&fit=crop"
                          alt="Foto de prensa 3"
                          className="h-36 w-full rounded-lg object-cover"
                        />
                        <img
                          src="https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&h=600&fit=crop"
                          alt="Foto de prensa 4"
                          className="h-36 w-full rounded-lg object-cover"
                        />
                      </div>

                      <p className="mt-4 text-sm text-zinc-300">
                        Créditos editoriales: Shock, El Espectador, Rolling Stone Colombia, Radiónica.
                      </p>
                      <div className="mt-3 rounded-lg border border-amber-300/50 bg-amber-100/95 p-3 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-amber-300/40">
                        <p className="text-sm font-bold text-zinc-950">
                          Simplifica el trabajo de los medios con material listo para usar.
                        </p>
                      </div>
                    </div>

                    <div className="h-full w-full overflow-hidden rounded-xl border border-white/20 bg-zinc-900 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">Página 3</p>
                      <h3 className="mt-2 text-2xl font-black text-white">GALERÍA DE PRENSA Y MEDIA</h3>
                      <p className="mt-1 text-xs text-zinc-400">
                        Studio Session 2026 · Live Performance - Bogotá Tour · Vertical assets social media
                      </p>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <img
                          src="https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=600&fit=crop"
                          alt="Studio session"
                          className="h-40 w-full rounded-lg object-cover"
                        />
                        <img
                          src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=600&fit=crop"
                          alt="Live performance"
                          className="h-40 w-full rounded-lg object-cover"
                        />
                        <img
                          src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=600&fit=crop"
                          alt="Vertical asset"
                          className="h-40 w-full rounded-lg object-cover"
                        />
                      </div>

                      <div className="mt-4 rounded-lg border border-white/15 bg-white/5 p-3">
                        <p className="text-sm text-zinc-300">
                          Incluye soporte para descarga directa en .JPG y .PNG transparente para diseñadores.
                        </p>
                        <p className="mt-2 text-sm text-zinc-300">
                          Ofrece una galería de alta calidad que facilite el trabajo de los editores y mejore tu posicionamiento visual.
                        </p>
                      </div>

                      <div className="mt-3 rounded-lg border border-amber-300/50 bg-amber-100/95 p-3 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-amber-300/40">
                        <p className="text-sm font-bold text-zinc-950">
                          Incluye soporte para descarga directa en .JPG y .PNG transparente para diseñadores. Ofrece una galería de alta calidad que facilite el trabajo de los editores y mejore tu posicionamiento visual.
                        </p>
                      </div>
                    </div>
                    <div className="h-full w-full overflow-hidden rounded-xl border border-white/20 bg-zinc-900 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">Página 4</p>
                      <h3 className="mt-2 text-2xl font-black text-white">CRÓNICA Y TRAYECTORIA</h3>
                      <p className="mt-1 text-xs text-zinc-400">La evolución sonora de Duna Fever</p>

                      <div className="mt-4 rounded-lg border border-cyan-300/30 bg-white/5 p-4">
                        <p className="text-sm font-semibold leading-relaxed text-white">
                          Duna Fever fusiona electrónica cinematográfica con
                          pulsos latinos para crear shows inmersivos de alto impacto.
                          Su narrativa visual y sonora convierte cada presentación
                          en una experiencia memorable para audiencias masivas.
                        </p>
                      </div>

                      <div className="mt-4 rounded-lg border border-white/15 bg-white/5 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-fuchsia-300">Hit Milestones</p>
                        <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                          <li>Más de 1M de streams acumulados.</li>
                          <li>Showcase oficial en BIME.</li>
                          <li>Featured act en circuito alternativo de Bogotá.</li>
                        </ul>
                      </div>

                      <div className="mt-4 rounded-lg border border-amber-300/50 bg-amber-100/95 p-3 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-amber-300/40">
                        <p className="text-sm font-bold text-zinc-950">
                          Tu historia, contada para ser publicada. Estructuramos tu trayectoria para que los periodistas encuentren los puntos clave de tu carrera sin esfuerzo.
                        </p>
                      </div>
                    </div>
                  </HTMLFlipBook>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

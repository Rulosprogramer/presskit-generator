import { useState } from 'react';

export const faqItems = [
  {
    q: '¿Qué es un presskit musical o EPK?',
    a: 'Un EPK (Electronic Press Kit) o kit de prensa es un documento digital que reúne todo el material promocional de un artista musical: biografía, fotos de alta resolución, enlaces a streaming, logros, reseñas de prensa y datos de contacto. Es la herramienta estándar de la industria para presentar tu proyecto a festivales, medios, managers y sellos discográficos.',
  },
  {
    q: '¿Cómo creo un presskit profesional?',
    a: 'Con Presskit Generator creas tu EPK en minutos: sincronizas tu información (bio, fotos, música, redes y logros), eliges un estilo visual profesional y obtienes tanto un PDF descargable como un enlace web público listo para compartir. No necesitas un diseñador ni conocimientos técnicos.',
  },
  {
    q: '¿Qué debe incluir un buen press kit de artista?',
    a: 'Un press kit completo incluye: una portada impactante, biografía corta y larga, fotos de prensa en alta resolución, enlaces a tu música en Spotify y Apple Music, logros y métricas (streams, shows, prensa), videos en vivo, y datos de contacto de booking y management. Presskit Generator estructura todos estos elementos automáticamente.',
  },
  {
    q: '¿Cuánto cuesta crear un presskit?',
    a: 'Presskit Generator ofrece dos planes: The Starter Beat por $4.99 USD por descarga (incluye PDF profesional y enlace web público por 20 días) y The Headliner Pro por $14.99 USD al año (incluye EPK online responsive, descargas PDF ilimitadas, galería high-res y actualizaciones ilimitadas).',
  },
  {
    q: '¿Para qué sirve un EPK al contactar festivales y medios?',
    a: 'Un EPK profesional acelera las decisiones de programadores, bookers y periodistas porque encuentran toda tu información en un solo enlace, sin pedir material extra. Una presentación clara y profesional mejora la primera impresión y aumenta tus oportunidades de booking y cobertura de prensa.',
  },
  {
    q: '¿Puedo actualizar mi presskit después de crearlo?',
    a: 'Sí. Con el plan anual The Headliner Pro puedes actualizar tu contenido en cualquier momento sin costo adicional, ideal para mantener tu perfil vigente con cada nuevo lanzamiento. El plan por descarga te permite generar una nueva versión actualizada cuando lo necesites.',
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="mx-auto w-full max-w-[1600px] px-6 py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-lg font-semibold tracking-[0.04em] text-cyan-300 sm:text-xl">
          Preguntas frecuentes
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Todo lo que necesitas saber sobre tu presskit musical
        </h2>
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <article
              key={item.q}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              <h3>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/5"
                >
                  <span className="text-base font-semibold text-white">{item.q}</span>
                  <span className={`text-cyan-300 transition-transform ${isOpen ? 'rotate-45' : ''}`}>＋</span>
                </button>
              </h3>
              {isOpen && (
                <div className="px-5 pb-5 text-sm leading-relaxed text-zinc-300">
                  {item.a}
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="mx-auto mt-8 max-w-3xl text-center text-xs text-zinc-500">
        <p>
          Fuentes sobre el press kit como herramienta de la industria:{' '}
          <a
            href="https://es.wikipedia.org/wiki/Dosier_de_prensa"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition hover:text-zinc-300"
          >
            «Dosier de prensa» (Wikipedia)
          </a>{' '}
          ·{' '}
          <a
            href="https://en.wikipedia.org/wiki/Press_kit"
            target="_blank"
            rel="noopener noreferrer"
            className="underline transition hover:text-zinc-300"
          >
            «Press kit» (Wikipedia)
          </a>
        </p>
      </div>
    </section>
  );
}

export default FAQ;

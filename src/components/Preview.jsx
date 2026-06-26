import { useEffect, useState } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

function Preview() {
  const [presskits, setPresskits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShowcase() {
      try {
        const q = query(
          collection(db, 'presskits'),
          where('status', '==', 'published'),
          where('allowShowcase', '==', true),
          limit(6),
        );
        const snap = await getDocs(q);
        const results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPresskits(results);
      } catch {
        // silencioso — si falla, no muestra nada
      } finally {
        setLoading(false);
      }
    }
    fetchShowcase();
  }, []);

  if (loading || presskits.length === 0) return null;

  return (
    <section id="ejemplos" className="mx-auto w-full max-w-[1600px] px-6 py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-lg font-semibold tracking-[0.04em] text-cyan-300 sm:text-xl">
          Ejemplos reales
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Presskits creados con la plataforma
        </h2>
        <p className="mt-3 text-sm text-zinc-400 sm:text-base">
          Artistas que ya comparten su EPK profesional con el mundo.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {presskits.map((pk) => {
          const coverImage = pk.images?.[0] || pk.images?.[1] || null;
          const href = pk.publishedUrl || (pk.publishedSlug ? `/presskit/${pk.publishedSlug}` : `/presskit/${pk.id}`);

          return (
            <a
              key={pk.id}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="group relative block overflow-hidden rounded-2xl border border-white/20 bg-white/5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/60 hover:shadow-[0_0_48px_rgba(34,211,238,0.25)]"
            >
              {/* Cover */}
              <div className="h-48 w-full overflow-hidden">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={`Portada de ${pk.artistName}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-zinc-800">
                    <span className="text-2xl text-zinc-500">♪</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                {pk.genre && (
                  <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">{pk.genre}</p>
                )}
                <h3 className="mt-1 text-lg font-bold text-white">{pk.artistName}</h3>
                {pk.city && (
                  <p className="mt-0.5 text-xs text-zinc-400">{pk.city}</p>
                )}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400 transition group-hover:text-cyan-300">
                  <span>Ver presskit</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

export default Preview;

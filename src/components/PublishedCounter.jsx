import { useEffect, useRef, useState } from 'react';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Contador en vivo de presskits publicados. Cuenta la colección pública
// `presskit_slugs` (un documento por presskit publicado), sin exponer datos
// privados. Sirve como señal de frescura y prueba social en el homepage.

function useCountUp(target, durationMs = 1400) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (target == null || startedRef.current) return undefined;
    startedRef.current = true;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => raf && cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}

function PublishedCounter() {
  const [count, setCount] = useState(null);
  const animated = useCountUp(count);

  useEffect(() => {
    let active = true;
    getCountFromServer(collection(db, 'presskit_slugs'))
      .then((snap) => {
        if (active) setCount(snap.data().count);
      })
      .catch(() => {
        if (active) setCount(null);
      });
    return () => {
      active = false;
    };
  }, []);

  // Si no se pudo leer el conteo, no renderizamos nada (evita mostrar un 0 frío).
  if (count == null) return null;

  const month = new Date().toLocaleDateString('es', { month: 'long', year: 'numeric' });
  const isFew = count < 10;

  return (
    <section className="mx-auto w-full max-w-[1600px] px-6 py-12 lg:px-12">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 rounded-3xl border border-white/12 bg-gradient-to-r from-fuchsia-500/10 to-cyan-400/10 px-6 py-8 text-center backdrop-blur">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          En vivo
        </span>

        <p className="text-5xl font-black text-white sm:text-6xl tabular-nums">
          {animated.toLocaleString('es')}
        </p>

        <p className="text-base text-zinc-200 sm:text-lg">
          {isFew
            ? 'presskits ya publicados — sé de los próximos en mostrar tu música'
            : 'presskits publicados por artistas con Presskit Generator'}
        </p>

        <p className="text-xs text-zinc-400">Datos actualizados en {month}</p>
      </div>
    </section>
  );
}

export default PublishedCounter;

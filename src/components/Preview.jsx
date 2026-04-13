function Preview() {
  return (
    <section id="ejemplos" className="mx-auto w-full max-w-[1600px] px-6 py-16 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-lg font-semibold tracking-[0.04em] text-cyan-300 sm:text-xl">
          Ejemplos
        </p>
        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          Presskits que convierten visitas en oportunidades
        </h2>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <a
          href="/examples/indie-pop-pro.html"
          target="_blank"
          rel="noreferrer"
          className="group relative block overflow-hidden rounded-2xl border border-white/20 bg-white/8 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/70 hover:shadow-[0_0_48px_rgba(34,211,238,0.35)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-cyan-500/20 opacity-80" />
          <div className="relative z-10">
            <p className="text-sm font-semibold text-fuchsia-300">Indie Pop</p>
            <h3 className="mt-2 text-2xl font-bold text-white">Neon Aura</h3>
            <div className="mt-4 h-44 overflow-hidden rounded-lg border border-white/20">
              <img
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1000&h=700&fit=crop"
                alt="Portada de presskit indie"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
            </div>
            <div className="mt-4 rounded-lg border border-cyan-300/30 bg-white/10 p-3">
              <p className="text-xs font-semibold text-cyan-300">VA: Micro animaciones y gradientes</p>
              <p className="mt-1 text-xs text-zinc-300">Portada dinámica y transiciones suaves para destacar el lanzamiento.</p>
            </div>
          </div>
        </a>

        <a
          href="/examples/urbano-pro.html"
          target="_blank"
          rel="noreferrer"
          className="group relative block overflow-hidden rounded-2xl border border-white/20 bg-white/8 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-zinc-200/80 hover:shadow-[0_0_52px_rgba(255,255,255,0.2)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-zinc-700/20 to-black/40 opacity-90" />
          <div className="relative z-10">
            <p className="text-sm font-semibold text-zinc-300">Urbano</p>
            <h3 className="mt-2 text-4xl font-black tracking-tight text-white">RZN</h3>
            <div className="mt-4 grid h-44 grid-cols-2 gap-2">
              <div className="overflow-hidden rounded-lg border border-white/15">
                <img
                  src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=700&h=700&fit=crop"
                  alt="Foto de prensa urbana"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>
              <div className="relative overflow-hidden rounded-lg border border-white/15">
                <img
                  src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=700&h=700&fit=crop"
                  alt="Cover urbano"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-lg text-zinc-900 shadow-lg transition group-hover:scale-110 group-hover:animate-pulse">
                    ▶
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-zinc-200/30 bg-white/10 p-3">
              <p className="text-xs font-semibold text-zinc-100">VA: Estética brutal + dark mode</p>
              <p className="mt-1 text-xs text-zinc-300">Tipografías grandes y foco en fotos de prensa.</p>
            </div>
          </div>
        </a>

        <a
          href="/examples/electronic-pro.html"
          target="_blank"
          rel="noreferrer"
          className="group relative block overflow-hidden rounded-2xl border border-white/20 bg-white/8 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/70 hover:shadow-[0_0_48px_rgba(34,211,238,0.35)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/20 opacity-90" />
          <div className="relative z-10">
            <p className="text-sm font-semibold text-cyan-300">Electrónica</p>
            <h3 className="mt-2 text-2xl font-bold text-white">Luna Feral</h3>
            <div className="mt-4 h-36 overflow-hidden rounded-lg border border-cyan-300/25">
              <img
                src="https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=1000&h=500&fit=crop"
                alt="Portada de presskit electrónica"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
            </div>
            <div className="mt-4 rounded-lg border border-cyan-300/30 bg-white/10 p-3">
              <p className="text-xs font-semibold text-cyan-300">VA: Stage plot expandible</p>
              <p className="mt-1 text-xs text-zinc-300">Gráfico técnico minimalista que se abre al pasar el cursor.</p>
            </div>
            <div className="mt-4 overflow-hidden rounded-lg border border-cyan-300/25 bg-slate-900/80 p-3">
              <svg className="h-20 w-full transition duration-500 group-hover:scale-105" viewBox="0 0 300 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="70" y="14" width="160" height="46" stroke="#22d3ee" strokeWidth="2" />
                <circle cx="150" cy="37" r="10" stroke="#22d3ee" strokeWidth="2" />
                <circle cx="92" cy="10" r="4" stroke="#a78bfa" strokeWidth="2" />
                <circle cx="150" cy="10" r="4" stroke="#a78bfa" strokeWidth="2" />
                <circle cx="208" cy="10" r="4" stroke="#a78bfa" strokeWidth="2" />
                <path d="M 84 76 Q 150 95 216 76" stroke="#22d3ee" strokeDasharray="5 5" />
              </svg>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
}

export default Preview;

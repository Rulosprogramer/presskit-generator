const themes = [
  { id: 'neon', label: 'Neon', accent: 'from-fuchsia-400 to-cyan-300' },
  { id: 'neutral', label: 'Neutral', accent: 'from-white to-zinc-400' },
  { id: 'dark', label: 'Dark', accent: 'from-zinc-800 to-zinc-600' },
  { id: 'minimal', label: 'Minimal', accent: 'from-emerald-300 to-cyan-300' },
];

function ThemeSlector({ value, onChange }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">5. Tema visual</p>
      <h2 className="mt-2 text-2xl font-bold text-white">Selecciona una estética</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {themes.map((theme) => {
          const active = theme.id === value;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onChange(theme.id)}
              className={`rounded-2xl border p-4 text-left transition duration-300 hover:-translate-y-0.5 ${
                active
                  ? 'border-cyan-300/50 bg-cyan-300/10 shadow-[0_0_28px_rgba(34,211,238,0.2)]'
                  : 'border-white/10 bg-zinc-900/50 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className={`h-2 rounded-full bg-gradient-to-r ${theme.accent}`} />
              <p className="mt-3 text-sm font-semibold text-white">{theme.label}</p>
              <p className="mt-1 text-xs text-zinc-400">Ajusta la identidad visual.</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default ThemeSlector;

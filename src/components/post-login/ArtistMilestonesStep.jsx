import { useState } from 'react';

const categoryConfig = {
  digital: {
    title: 'Tracción Digital',
    helperText: 'Piensa en crecimientos de oyentes, inclusión en playlists o ciudades donde más te escuchan.',
    placeholder: 'Ej: +10k streams en Spotify en el primer mes.',
  },
  live: {
    title: 'Validación en Vivo',
    helperText: 'Menciona tus mejores shows, festivales locales o si fuiste el acto de apertura de otro artista.',
    placeholder: 'Ej: Sold Out en el lanzamiento de EP en [Nombre del Bar].',
  },
  press: {
    title: 'Curaduría y Prensa',
    helperText: '¿Algún blog, radio universitaria o medio local habló de ti? ¿Ganaste alguna convocatoria o beca?',
    placeholder: 'Ej: Reseñado por [Medio/Blog] como artista promesa.',
  },
  collaborations: {
    title: 'Colaboraciones',
    helperText: '¿Has trabajado con productores reconocidos o hecho feats con otros artistas de tu escena?',
    placeholder: 'Ej: Producido por [Nombre] en los estudios [Nombre].',
  },
};

function ArtistMilestonesStep({
  milestones = {},
  onAddMilestone,
  onUpdateMilestone,
  onDeleteMilestone,
  onGenerateMilestone,
  isGeneratingMilestone = false,
  generatingMilestoneKey = '',
  milestoneGenerationError = '',
}) {
  const [openHelpKey, setOpenHelpKey] = useState('');

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-fuchsia-300">5. Hitos del Artista</p>
          <p className="mt-1 text-sm text-zinc-300">Añade hasta 3 hitos por categoría y conviértelos en frases de impacto con IA.</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300">Máximo 12 hitos</span>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {Object.entries(categoryConfig).map(([category, config]) => {
          const items = Array.isArray(milestones[category]) ? milestones[category] : [];
          const canAdd = items.length < 3;

          return (
            <div key={category} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] text-cyan-300">Categoría</p>
                  <h3 className="mt-1 text-lg font-bold text-white">{config.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => onAddMilestone?.(category)}
                  disabled={!canAdd}
                  className="rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  + Agregar hito
                </button>
              </div>

              <p className="mt-3 text-sm text-zinc-300">{config.helperText}</p>
              <p className="mt-1 text-xs text-zinc-500">Máximo 3 inputs en esta categoría.</p>

              <div className="mt-4 space-y-3">
                {items.length > 0 ? (
                  items.map((item, index) => {
                    const key = `${category}-${index}`;
                    const isGenerating = isGeneratingMilestone && generatingMilestoneKey === key;

                    return (
                      <div key={key} className="rounded-2xl border border-white/10 bg-zinc-950/40 p-3">
                        <input
                          value={item || ''}
                          onChange={(event) => onUpdateMilestone?.(category, index, event.target.value)}
                          maxLength={160}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-cyan-300"
                        />

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onGenerateMilestone?.(category, index, item || config.placeholder)}
                            disabled={isGeneratingMilestone}
                            className="rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isGenerating ? 'Generando...' : 'Generar con IA'}
                          </button>
                          <div
                            className="relative"
                            onMouseEnter={() => setOpenHelpKey(key)}
                            onMouseLeave={() => setOpenHelpKey((current) => (current === key ? '' : current))}
                          >
                            <button
                              type="button"
                              onClick={() => setOpenHelpKey((current) => (current === key ? '' : key))}
                              aria-label={`Ayuda para ${config.title}`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-bold text-zinc-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-200"
                            >
                              ?
                            </button>

                            {openHelpKey === key ? (
                              <div className="absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 rounded-xl border border-cyan-300/35 bg-zinc-950/95 p-3 text-xs leading-5 text-zinc-100 shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
                                <p className="font-semibold text-cyan-200">Ejemplo</p>
                                <p className="mt-1 text-zinc-200">{config.placeholder}</p>
                                <p className="mt-2 text-zinc-300">{config.helperText}</p>
                              </div>
                            ) : null}
                          </div>
                          <button
                            type="button"
                            onClick={() => onDeleteMilestone?.(category, index)}
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 transition hover:border-red-300/40 hover:bg-red-500/10 hover:text-red-200"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-sm text-zinc-400">
                    Aún no hay hitos en esta categoría.
                  </div>
                )}
              </div>

              {!canAdd ? <p className="mt-3 text-xs text-amber-300">Ya alcanzaste el máximo de 3 hitos.</p> : null}
            </div>
          );
        })}
      </div>

      {milestoneGenerationError ? (
        <p className="mt-4 rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-200">
          {milestoneGenerationError}
        </p>
      ) : null}
    </div>
  );
}

export default ArtistMilestonesStep;
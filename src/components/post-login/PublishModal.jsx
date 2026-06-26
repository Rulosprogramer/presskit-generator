import { useState } from 'react';

function PublishModal({ isOpen, onClose, onPublish, summary = [] }) {
  const [allowShowcase, setAllowShowcase] = useState(false);

  if (!isOpen) return null;

  const completedCount = summary.filter((item) => item.status === 'completed').length;
  const warningCount = summary.filter((item) => item.status === 'warning').length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-950 p-6 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Publicar</p>
        <h2 className="mt-2 text-2xl font-bold text-white">Revisa tu presskit</h2>
        <p className="mt-2 text-sm text-zinc-300">
          Guardaremos tu información y la dejaremos lista para compartir. {warningCount > 0 ? 'Hay pasos incompletos, pero puedes publicar igualmente.' : 'Todo lo esencial está listo para publicar.'}
        </p>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-white">Checklist de publicación</p>
            <p className="text-xs text-zinc-400">{completedCount}/{summary.length} listo</p>
          </div>

          <div className="mt-4 space-y-2">
            {summary.map((item) => (
              <div
                key={item.label}
                className={`rounded-xl border px-3 py-2 text-sm ${
                  item.status === 'completed'
                    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
                    : 'border-amber-400/30 bg-amber-400/10 text-amber-100'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 text-xs font-black uppercase tracking-[0.14em]">
                    {item.status === 'completed' ? '✓' : '!'}
                  </span>
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="mt-1 text-xs opacity-90">{item.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consentimiento showcase */}
        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/8">
          <input
            type="checkbox"
            checked={allowShowcase}
            onChange={(e) => setAllowShowcase(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-fuchsia-400"
          />
          <div>
            <p className="text-sm font-semibold text-white">Aparecer como ejemplo en la plataforma</p>
            <p className="mt-1 text-xs text-zinc-400">
              Autorizo que mi presskit publicado se muestre de forma rotativa en la sección de ejemplos del homepage, como inspiración para otros artistas. Puedes retirar este permiso en cualquier momento despublicando tu presskit.
            </p>
          </div>
        </label>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/10"
          >
            Seguir editando
          </button>
          <button
            type="button"
            onClick={() => onPublish(allowShowcase)}
            className="rounded-xl bg-fuchsia-400 px-4 py-3 text-sm font-bold text-zinc-950 transition hover:bg-fuchsia-300"
          >
            Publicar ahora
          </button>
        </div>
      </div>
    </div>
  );
}

export default PublishModal;

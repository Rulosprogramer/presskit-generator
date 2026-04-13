function PublishModal({ isOpen, onClose, onPublish, data }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-950 p-6 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Publicar</p>
        <h2 className="mt-2 text-2xl font-bold text-white">Revisa tu presskit</h2>
        <p className="mt-2 text-sm text-zinc-300">
          Guardaremos tu información y la dejaremos lista para compartir.
        </p>

        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-200">
          <p><span className="text-zinc-400">Artista:</span> {data.artistName || 'Sin nombre'}</p>
          <p className="mt-2"><span className="text-zinc-400">Bio:</span> {data.bio ? 'Completada' : 'Pendiente'}</p>
          <p className="mt-2"><span className="text-zinc-400">Tema:</span> {data.theme || 'neon'}</p>
        </div>

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
            onClick={onPublish}
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

function Topbar({ user, onSignOut }) {
  const displayName = user?.displayName || 'Artista';
  const email = user?.email || '';
  const avatar = user?.photoURL || 'https://ui-avatars.com/api/?name=Artista&background=111827&color=ffffff';

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div>
        <h2 className="text-lg font-semibold text-white">Panel del Artista</h2>
        <p className="mt-1 text-sm text-zinc-300">Hola, {displayName}. Gestiona tu presskit y publica actualizaciones.</p>
      </div>

      <div className="flex items-center gap-3">
        <img src={avatar} alt={displayName} className="h-10 w-10 rounded-full object-cover ring-2 ring-cyan-300/60" referrerPolicy="no-referrer" />
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-white">{displayName}</p>
          <p className="text-xs text-zinc-400">{email}</p>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:bg-white/10"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

export default Topbar;

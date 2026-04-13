function Sidebar({ user }) {
  const displayName = user?.displayName || 'Artista';

  return (
    <aside className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Contenido principal</p>
      <h2 className="mt-2 text-xl font-bold text-white">Hola, {displayName}</h2>
      <p className="mt-1 text-sm text-zinc-400">Gestiona toda tu vida artística desde un solo panel.</p>

      <ul className="mt-6 space-y-2 text-sm text-zinc-200">
        <li>
          <a href="/dashboard" className="block rounded-lg border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/12">
            Dashboard
          </a>
        </li>
        <li>
          <a href="/createPresskit" className="block rounded-lg border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/12">
            Create Presskit
          </a>
        </li>
        <li>
          <a href="#" className="block rounded-lg border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/12">
            Mis Presskits
          </a>
        </li>
        <li>
          <a href="#" className="block rounded-lg border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/12">
            Configuración
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import logo from '../../assets/logo-black-bg.svg';
import SettingsModal from './SettingsModal.jsx';

function Sidebar({ user }) {
  const displayName = user?.displayName || 'Artista';
  const [presskit, setPresskit] = useState(null);
  const [loadingPresskit, setLoadingPresskit] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    getDoc(doc(db, 'presskits', user.uid))
      .then((snap) => {
        setPresskit(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      })
      .catch(() => setPresskit(null))
      .finally(() => setLoadingPresskit(false));
  }, [user?.uid]);

  const hasPreskit = !loadingPresskit && presskit !== null;
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <aside className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="mb-4 flex items-center gap-3">
        <img src={logo} alt="Logo" className="h-20 w-auto shrink-0" />
        <p className="text-sm font-medium leading-snug text-zinc-300">Bienvenido a nuestro generador de EPKs</p>
      </div>
      <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Panel del artista</p>
      <h2 className="mt-2 text-xl font-bold text-white">Hola, {displayName}</h2>
      <p className="mt-1 text-sm text-zinc-400">Gestiona toda tu vida artística desde un solo panel.</p>

      <ul className="mt-6 space-y-2 text-sm text-zinc-200">
        <li>
          <a
            href="/createPresskit"
            className="block rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 font-semibold text-cyan-300 transition hover:bg-cyan-300/20"
          >
            {hasPreskit ? 'Actualizar Presskit' : 'Crear Presskit'}
          </a>
        </li>

        <li>
          <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-3">
            <p className="mb-2 text-[10px] uppercase tracking-[0.14em] text-zinc-500">Mis Presskits</p>
            {loadingPresskit ? (
              <p className="px-1 text-xs text-zinc-600">Cargando...</p>
            ) : hasPreskit ? (
              <a
                href="/createPresskit"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-white transition hover:bg-white/10"
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    presskit.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span className="truncate">{presskit.artistName || 'Sin nombre'}</span>
              </a>
            ) : (
              <p className="px-1 text-xs text-zinc-600">Aún no tienes presskits</p>
            )}
          </div>
        </li>

        <li>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left transition hover:bg-white/12"
          >
            Configuración
          </button>
        </li>
      </ul>

      {settingsOpen && <SettingsModal user={user} onClose={() => setSettingsOpen(false)} />}
    </aside>
  );
}

export default Sidebar;

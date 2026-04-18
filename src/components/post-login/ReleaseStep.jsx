import { useState } from 'react';

function ReleaseStep({
  releases = [],
  releaseCtaText = '',
  onReleaseCtaChange,
  onGenerateReleaseCta,
  isGeneratingBio = false,
  generatingBioSection = '',
  generatedBios = {},
  onAddRelease,
  onUpdateRelease,
  onDeleteRelease,
}) {
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddOrUpdate = () => {
    const title = document.getElementById('release-title').value;
    const description = document.getElementById('release-description').value;
    const author = document.getElementById('release-author').value;
    const url = document.getElementById('release-url').value;

    if (!title || !url) {
      alert('Por favor completa el nombre de la canción y el link de YouTube');
      return;
    }

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      alert('Por favor usa un link de YouTube válido');
      return;
    }

    if (editingIndex !== null) {
      onUpdateRelease(editingIndex, { title, description, author, url });
      setEditingIndex(null);
    } else {
      onAddRelease({ title, description, author, url });
    }

    // Limpiar formulario
    document.getElementById('release-title').value = '';
    document.getElementById('release-description').value = '';
    document.getElementById('release-author').value = '';
    document.getElementById('release-url').value = '';
  };

  const handleEditRelease = (index) => {
    const release = releases[index];
    document.getElementById('release-title').value = release.title;
    document.getElementById('release-description').value = release.description || '';
    document.getElementById('release-author').value = release.author || '';
    document.getElementById('release-url').value = release.url;
    setEditingIndex(index);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    document.getElementById('release-title').value = '';
    document.getElementById('release-description').value = '';
    document.getElementById('release-author').value = '';
    document.getElementById('release-url').value = '';
  };

  const getYouTubeThumbnail = (url) => {
    try {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
    } catch {
      return null;
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-sm font-semibold text-fuchsia-300">6. Video Releases</p>
          <p className="text-xs text-zinc-400 mt-1">Añade los videos de tus últimas canciones o álbumes (máximo 8)</p>
        </div>
        <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-zinc-300">{releases.length}/8</span>
      </div>

      {/* Formulario para agregar/editar release */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.12em] text-zinc-400 mb-3">{editingIndex !== null ? 'Editar video release' : 'Agregar nuevo video release'}</p>
        <div className="space-y-3">
          <input
            type="text"
            id="release-title"
            placeholder="Nombre de la canción"
            maxLength={50}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-300 placeholder:text-zinc-500"
          />
          <textarea
            id="release-description"
            placeholder="Describe la canción"
            maxLength={200}
            rows={3}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-300 placeholder:text-zinc-500 resize-none"
          />
          <input
            type="text"
            id="release-author"
            placeholder="Artista, añadir Featuring si existe"
            maxLength={100}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-300 placeholder:text-zinc-500"
          />
          <input
            type="url"
            id="release-url"
            placeholder="https://youtube.com/watch?v=..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-300 placeholder:text-zinc-500"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddOrUpdate}
              disabled={releases.length >= 8 && editingIndex === null}
              className="flex-1 rounded-xl bg-cyan-300/10 border border-cyan-300/40 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-cyan-300/10"
            >
              {editingIndex !== null ? '✓ Actualizar' : '+ Agregar Release'}
            </button>
            {editingIndex !== null && (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl bg-zinc-700/10 border border-zinc-600/40 px-4 py-2 text-sm font-semibold text-zinc-400 transition hover:bg-zinc-700/20"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.12em] text-zinc-400 mb-3">Texto final de la pagina release</p>
        <textarea
          value={releaseCtaText}
          onChange={(event) => onReleaseCtaChange?.(event.target.value)}
          rows={3}
          placeholder="Dale play y disfruta los videos que estan marcando el camino de Rulos."
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-300 placeholder:text-zinc-500 resize-none"
        />
        <button
          type="button"
          onClick={onGenerateReleaseCta}
          disabled={isGeneratingBio}
          className="mt-3 cursor-pointer rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGeneratingBio && generatingBioSection === 'releaseCta' ? 'Generando...' : generatedBios.releaseCta || releaseCtaText ? '🔄 Regenerar' : '✨ Generar con IA'}
        </button>
      </div>

      {/* Lista de releases */}
      {releases.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.12em] text-zinc-400">Video Releases agregados</p>
          {releases.map((release, index) => {
            const thumbnail = getYouTubeThumbnail(release.url);
            return (
              <div key={index} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={release.title}
                    className="h-20 w-20 rounded-lg object-cover shrink-0"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-lg bg-zinc-700 flex items-center justify-center shrink-0">
                    <span className="text-xs text-zinc-400">No thumbnail</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{release.title}</p>
                  {release.author && <p className="text-xs text-zinc-400 truncate">{release.author}</p>}
                  {release.description && (
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{release.description}</p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEditRelease(index)}
                    className="rounded-lg bg-blue-500/10 border border-blue-500/30 px-3 py-2 text-xs text-blue-300 hover:bg-blue-500/20 transition"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`¿Eliminar release "${release.title}"?`)) {
                        onDeleteRelease(index);
                      }
                    }}
                    className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-xs text-red-300 hover:bg-red-500/20 transition"
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/5 p-6 text-center">
          <p className="text-sm text-zinc-400">Aún no tienes releases. Añade tus videos de YouTube.</p>
        </div>
      )}
    </div>
  );
}

export default ReleaseStep;

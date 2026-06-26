import { useRef, useState } from 'react';

const EMPTY_FORM = { title: '', description: '', author: '', url: '' };

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
  onMoveRelease,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingIndex, setEditingIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = 'Requerido';
    if (!form.url.trim()) next.url = 'Requerido';
    else if (!form.url.includes('youtube.com') && !form.url.includes('youtu.be'))
      next.url = 'Debe ser un link de YouTube';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const data = { title: form.title.trim(), description: form.description.trim(), author: form.author.trim(), url: form.url.trim() };
    if (editingIndex !== null) {
      onUpdateRelease(editingIndex, data);
    } else {
      onAddRelease(data);
    }
    setForm(EMPTY_FORM);
    setEditingIndex(null);
    setErrors({});
  };

  const handleEdit = (index) => {
    const r = releases[index];
    setForm({ title: r.title || '', description: r.description || '', author: r.author || '', url: r.url || '' });
    setEditingIndex(index);
    setErrors({});
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditingIndex(null);
    setErrors({});
  };

  const getYouTubeThumbnail = (url) => {
    try {
      const videoId = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
    } catch { return null; }
  };

  const inputClass = (field) =>
    `w-full rounded-xl border bg-white/5 px-4 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-300 placeholder:text-zinc-500 ${errors[field] ? 'border-red-400/60' : 'border-white/10'}`;

  const canAdd = releases.length < 8 && editingIndex === null;

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-fuchsia-300">6. Video Releases</p>
          <p className="text-xs text-zinc-400 mt-1">Añade tus videos de YouTube — hasta 8 releases</p>
        </div>
        <span className="shrink-0 text-xs bg-white/10 px-2 py-1 rounded-full text-zinc-300">{releases.length}/8</span>
      </div>

      {/* Formulario */}
      <div ref={formRef} className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.12em] text-zinc-400 mb-3">
          {editingIndex !== null ? `Editando release ${editingIndex + 1}` : 'Agregar nuevo release'}
        </p>
        <div className="space-y-3">
          <div>
            <input
              type="text"
              value={form.title}
              onChange={set('title')}
              placeholder="Nombre de la canción *"
              maxLength={50}
              className={inputClass('title')}
            />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
          </div>
          <textarea
            value={form.description}
            onChange={set('description')}
            placeholder="Describe la canción (opcional)"
            maxLength={200}
            rows={3}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-300 placeholder:text-zinc-500 resize-none"
          />
          <input
            type="text"
            value={form.author}
            onChange={set('author')}
            placeholder="Artista / Featuring (opcional)"
            maxLength={100}
            className={inputClass('author')}
          />
          <div>
            <input
              type="text"
              inputMode="url"
              value={form.url}
              onChange={set('url')}
              placeholder="https://youtube.com/watch?v=..."
              className={inputClass('url')}
            />
            {errors.url && <p className="mt-1 text-xs text-red-400">{errors.url}</p>}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canAdd && editingIndex === null}
              className="flex-1 rounded-xl bg-cyan-300/10 border border-cyan-300/40 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {editingIndex !== null ? '✓ Guardar cambios' : '+ Agregar Release'}
            </button>
            {editingIndex !== null && (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl border border-zinc-600/40 bg-zinc-700/10 px-4 py-2 text-sm font-semibold text-zinc-400 transition hover:bg-zinc-700/20"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Texto CTA */}
      <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.12em] text-zinc-400 mb-3">Texto de cierre de la página releases</p>
        <textarea
          value={releaseCtaText}
          onChange={(e) => onReleaseCtaChange?.(e.target.value)}
          rows={3}
          placeholder="Dale play y disfruta los videos..."
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-300 placeholder:text-zinc-500 resize-none"
        />
        <button
          type="button"
          onClick={onGenerateReleaseCta}
          disabled={isGeneratingBio}
          className="mt-3 cursor-pointer rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGeneratingBio && generatingBioSection === 'releaseCta' ? 'Generando...' : (generatedBios.releaseCta || releaseCtaText) ? 'Regenerar con IA' : 'Generar con IA'}
        </button>
      </div>

      {/* Lista */}
      {releases.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.12em] text-zinc-400 mb-2">Releases agregados ({releases.length})</p>
          {releases.map((release, index) => {
            const thumbnail = getYouTubeThumbnail(release.url);
            const isEditing = editingIndex === index;
            return (
              <div
                key={index}
                className={`rounded-xl border p-3 transition ${isEditing ? 'border-cyan-300/50 bg-cyan-300/5' : 'border-white/10 bg-white/5'}`}
              >
                {/* Thumbnail ancho completo */}
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={release.title}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                ) : (
                  <div className="w-full h-16 rounded-lg bg-zinc-700/60 flex items-center justify-center mb-2">
                    <span className="text-xs text-zinc-400">Sin thumbnail</span>
                  </div>
                )}
                {/* Texto en bloque vertical */}
                <p className="text-sm font-semibold text-white leading-snug">{release.title}</p>
                {release.author && <p className="text-xs text-zinc-400 mt-0.5">{release.author}</p>}
                {release.description && <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{release.description}</p>}
                <p className="text-[10px] text-zinc-600 mt-1 break-all">{release.url}</p>
                {/* Botones en fila compacta */}
                <div className="flex items-center justify-end gap-1 mt-2">
                  <button
                    type="button"
                    onClick={() => onMoveRelease?.(index, -1)}
                    disabled={index === 0 || editingIndex !== null}
                    title="Subir"
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                  >▲</button>
                  <button
                    type="button"
                    onClick={() => onMoveRelease?.(index, 1)}
                    disabled={index === releases.length - 1 || editingIndex !== null}
                    title="Bajar"
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-zinc-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                  >▼</button>
                  <button
                    type="button"
                    onClick={() => handleEdit(index)}
                    className={`rounded-md border px-3 py-1 text-xs font-medium transition ${isEditing ? 'border-cyan-300/50 bg-cyan-300/10 text-cyan-300' : 'border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20'}`}
                  >{isEditing ? 'Editando' : 'Editar'}</button>
                  <button
                    type="button"
                    onClick={() => { if (window.confirm(`¿Eliminar "${release.title}"?`)) onDeleteRelease(index); }}
                    className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300 hover:bg-red-500/20 transition"
                  >Eliminar</button>
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

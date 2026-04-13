import { useEffect, useState } from 'react';
import { getImageLibrary, deleteImageFromLibrary } from '../../lib/imageLibrary';

function ImageLibraryModal({ userId, isOpen, onClose, onSelectImage, imageType = 'gallery' }) {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !userId) return;

    const loadLibrary = async () => {
      setLoading(true);
      setError('');
      try {
        const images = await getImageLibrary({ userId, type: imageType });
        setLibrary(images);
      } catch (err) {
        setError('No se pudo cargar la biblioteca de imágenes');
        console.warn('Error cargando biblioteca:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLibrary();
  }, [isOpen, userId, imageType]);

  const handleDelete = async (imageId, event) => {
    event.stopPropagation();
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta imagen?')) return;

    try {
      await deleteImageFromLibrary({ userId, imageId });
      setLibrary((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      setError('No se pudo eliminar la imagen');
      console.warn('Error eliminando imagen:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur">
      <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white"
        >
          ✕
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Biblioteca de imágenes</h2>
          <p className="mt-1 text-sm text-zinc-400">Selecciona una imagen de tu biblioteca o sube una nueva</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-cyan-300"></div>
          </div>
        ) : library.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 py-12 text-center">
            <p className="text-sm text-zinc-400">No hay imágenes en tu biblioteca aún</p>
            <p className="mt-1 text-xs text-zinc-500">Sube tu primera imagen para comenzar</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {library.map((image) => (
              <div
                key={image.id}
                onClick={() => {
                  onSelectImage(image);
                  onClose();
                }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 transition hover:border-cyan-300/50 hover:shadow-lg hover:shadow-cyan-300/20"
              >
                <img
                  src={image.url}
                  alt={image.fileName}
                  className="h-40 w-full object-cover transition group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                  <div className="flex h-full flex-col justify-between">
                    <button
                      type="button"
                      onClick={(e) => handleDelete(image.id, e)}
                      className="self-end rounded-lg bg-red-500/80 px-2 py-1 text-xs font-semibold text-white transition hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                    <div>
                      <p className="text-xs font-semibold text-white line-clamp-2">{image.fileName}</p>
                      <p className="text-xs text-zinc-300">
                        {new Date(image.uploadedAt?.toDate?.() || image.uploadedAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageLibraryModal;

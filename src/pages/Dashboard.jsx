import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import PlanPurchaseModal from '../components/post-login/PlanPurchaseModal.jsx';

function Dashboard({ user }) {
  const [presskits, setPresskits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [purchaseAction, setPurchaseAction] = useState('');
  const displayName = user?.displayName || 'Artista';

  useEffect(() => {
    if (!user?.uid) return;

    const loadPresskits = async () => {
      try {
        setLoading(true);
        
        // El documento presskits/{userId} contiene la información del presskit del usuario
        const presskitDocRef = doc(db, 'presskits', user.uid);
        const presskitSnapshot = await getDoc(presskitDocRef);
        
        if (presskitSnapshot.exists()) {
          const presskit = {
            id: user.uid,
            ...presskitSnapshot.data(),
          };
          setPresskits([presskit]);
        } else {
          setPresskits([]);
        }
      } catch (err) {
        console.warn('Error cargando presskit:', err);
        setError('No se pudo cargar tu presskit');
      } finally {
        setLoading(false);
      }
    };

    loadPresskits();
  }, [user?.uid]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Nunca';
    const date = timestamp.toDate?.() || new Date(timestamp);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const openPurchaseModal = (presskit, action) => {
    setPurchaseAction(action);
    setPurchaseModalOpen(true);
  };

  const handleCopyLink = async (presskit) => {
    const url = presskit?.publishedUrl || `${window.location.origin}/presskit/${presskit?.id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert('✓ Enlace copiado al portapapeles');
    } catch (err) {
      console.error('Error al copiar:', err);
      alert('No se pudo copiar el enlace');
    }
  };

  const closePurchaseModal = () => {
    setPurchaseModalOpen(false);
    setPurchaseAction('');
  };

  const handleEssentialPurchase = async () => {
    window.location.assign(`/checkout?plan=essential&action=${encodeURIComponent(purchaseAction || 'buy')}`);
  };

  const handleProfessionalPurchase = async () => {
    window.location.assign(`/checkout?plan=professional&action=${encodeURIComponent(purchaseAction || 'buy')}`);
  };

  const hasPresskits = presskits.length > 0;

  return (
    <section className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-zinc-300">Bienvenido, {displayName}. Aquí viven tus presskits.</p>
        </div>
        <a
          href="/createPresskit"
          className="inline-flex items-center justify-center rounded-xl bg-fuchsia-400 px-6 py-3 text-base font-bold text-zinc-950 transition hover:bg-fuchsia-300"
        >
          Crear Nuevo Press Kit
        </a>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-cyan-300"></div>
        </div>
      ) : hasPresskits ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {presskits.map((item) => (
            <article
              key={item.id}
              className="group rounded-2xl border border-white/15 bg-white/8 p-5 shadow-[0_12px_34px_rgba(0,0,0,0.24)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/50 hover:shadow-[0_18px_42px_rgba(34,211,238,0.25)]"
            >
              {/* Cover Image */}
              {item.images?.[0] && (
                <div className="mb-4 -mx-5 -mt-5 h-40 overflow-hidden rounded-t-2xl">
                  <img
                    src={item.images[0]}
                    alt={item.artistName}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white">{item.artistName || 'Sin nombre'}</h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    {item.genre && <span>{item.genre}</span>}
                    {item.genre && item.city && <span> • </span>}
                    {item.city && <span>{item.city}</span>}
                  </p>
                  <p className="mt-2 text-xs text-zinc-400">
                    Creado: {formatDate(item.createdAt)}
                  </p>
                  <p className="mt-1 text-xs text-zinc-400">
                    Actualizado: {formatDate(item.updatedAt)}
                  </p>
                </div>
                <span
                  className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                    item.status === 'published'
                      ? 'border border-emerald-300/35 bg-emerald-400/15 text-emerald-300'
                      : 'border border-amber-300/35 bg-amber-400/15 text-amber-300'
                  }`}
                >
                  {item.status === 'published' ? 'Publicado' : 'Borrador'}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {item.status === 'draft' ? (
                  <>
                    <a
                      href={`/createPresskit?edit=${item.id}`}
                      className="rounded-lg border border-cyan-300/40 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-300/10"
                    >
                      Continuar editando
                    </a>
                    <a
                      href="/presskitPDF"
                      className="rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:bg-white/10"
                    >
                      Previsualizar PDF
                    </a>
                  </>
                ) : (
                  <>
                    <a
                      href={`/createPresskit?edit=${item.id}`}
                      className="rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:bg-white/10"
                    >
                      Editar
                    </a>
                    <button
                      type="button"
                      onClick={() => openPurchaseModal(item, 'download')}
                      className="rounded-lg border border-amber-300/40 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-300/10"
                    >
                      Descargar PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(item)}
                      className="rounded-lg border border-fuchsia-300/40 px-3 py-2 text-xs font-semibold text-fuchsia-300 transition hover:bg-fuchsia-300/10"
                    >
                      📋 Copiar enlace
                    </button>
                    <button
                      type="button"
                      onClick={() => openPurchaseModal(item, 'view')}
                      className="rounded-lg border border-cyan-300/40 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-300/10"
                    >
                      Ver publicado
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/25 bg-white/5 p-10 text-center">
          <h2 className="text-2xl font-bold text-white">Aún no tienes un press kit…</h2>
          <p className="mx-auto mt-3 max-w-xl text-zinc-300">
            Crea el primero y empieza a abrir puertas 🚀
          </p>
          <a
            href="/createPresskit"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-cyan-300 px-6 py-3 text-sm font-bold text-zinc-950 transition hover:bg-cyan-200"
          >
            Crear mi primer presskit
          </a>
        </div>
      )}

      <PlanPurchaseModal
        isOpen={purchaseModalOpen}
        actionLabel={purchaseAction === 'share' ? 'compartir el enlace' : purchaseAction === 'view' ? 'ver tu presskit' : 'descargar el PDF'}
        onClose={closePurchaseModal}
        onSelectEssential={handleEssentialPurchase}
        onSelectProfessional={handleProfessionalPurchase}
      />
    </section>
  );
}

export default Dashboard;

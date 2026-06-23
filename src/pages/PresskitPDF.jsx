import { useEffect, useMemo, useState } from 'react';
import { BlobProvider, pdf } from '@react-pdf/renderer';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { resolvePdfPresskitData } from '../lib/pdfImageResolver';
import { useTheme } from '../context/ThemeContext.tsx';
import PresskitPdfDocument from '../components/pdfx/PresskitPdfDocument.jsx';
import Topbar from '../components/post-login/Topbar.jsx';
import { isPremiumWhitelisted } from '../lib/premiumAccess.js';

function hexify(color) {
  if (!color) return '#000000';
  if (/^#[0-9a-f]{6}$/i.test(color)) return color;
  const h3 = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(color);
  if (h3) return `#${h3[1]}${h3[1]}${h3[2]}${h3[2]}${h3[3]}${h3[3]}`;
  const m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(color);
  if (m) return '#' + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
  return '#000000';
}

function downloadBlobFromPdfDocument(documentNode) {
  return pdf(documentNode).toBlob();
}

const initialPresskitData = {
  artistName: '',
  genre: '',
  city: '',
  totalStreams: '',
  totalVideoViews: '',
  recognitions: '',
  useRecognitionImage: false,
  recognitionImage: '',
  bioStyle: 'prensa',
  twitterBio: '',
  twitterBioImage: '',
  shortBio: '',
  bio: '',
  bioImage: '',
  longBio: '',
  longBioImage: '',
  performanceLiveLink: '',
  interviewLink: '',
  releases: [],
  images: [],
  pressArticles: [],
  links: {
    spotify: '',
    instagram: '',
    youtube: '',
    tiktok: '',
    facebook: '',
    appleMusic: '',
    soundcloud: '',
  },
  linkMetrics: {
    spotify: '',
    instagram: '',
    youtube: '',
    tiktok: '',
    facebook: '',
    appleMusic: '',
    soundcloud: '',
  },
  contactArtistName: '',
  managerName: '',
  roadManagerName: '',
  contactCountryCode: '+57',
  contactPhone: '',
  whatsappPhone: '',
  contactLogo: '',
  artistMilestones: { digital: [], live: [], press: [], collaborations: [] },
  planTier: '',
  theme: 'neon',
};

function PresskitPDF({ user, onSignOut, presskitId = '' }) {
  const [presskitData, setPresskitData] = useState(initialPresskitData);
  const [pdfPresskitData, setPdfPresskitData] = useState(initialPresskitData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProtectedVisible, setIsProtectedVisible] = useState(true);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [pdfZoom, setPdfZoom] = useState(100);
  const { theme: uiTheme } = useTheme();
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const pdfVariant = searchParams.get('variant') === 'essential' || presskitData.planTier === 'essential' ? 'essential' : 'professional';
  const isWhitelisted = isPremiumWhitelisted(user?.email);
  const hasCleanDownloadAccess = isWhitelisted || Boolean(presskitData.downloadUnlocked || presskitData.subscriptionActive || presskitData.paymentStatus === 'paid');
  const previewNeedsWatermark = !hasCleanDownloadAccess;
  const watermarkLabel = presskitData.artistName || 'PRESSKIT';

  const presskitRef = useMemo(() => {
    const targetId = presskitId || user?.uid;
    if (!targetId) return null;
    return doc(db, 'presskits', targetId);
  }, [presskitId, user]);

  useEffect(() => {
    if (!presskitRef) return;

    setLoading(true);
    const unsubscribe = onSnapshot(
      presskitRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setPresskitData((current) => ({
            ...current,
            artistName: data.artistName || '',
            genre: data.genre || '',
            city: data.city || '',
            totalStreams: data.totalStreams || '',
            totalVideoViews: data.totalVideoViews || '',
            recognitions: data.recognitions || '',
            useRecognitionImage: Boolean(data.useRecognitionImage),
            recognitionImage: data.recognitionImage || '',
            bioStyle: data.bioStyle || 'prensa',
            twitterBio: data.twitterBio || '',
            twitterBioImage: data.twitterBioImage || '',
            shortBio: data.shortBio || data.bio || '',
            bio: data.bio || '',
            bioImage: data.bioImage || '',
            longBio: data.longBio || '',
            longBioImage: data.longBioImage || '',
            performanceLiveLink: data.performanceLiveLink || '',
            interviewLink: data.interviewLink || '',
            releases: Array.isArray(data.releases) ? data.releases : [],
            images: Array.isArray(data.images) ? data.images : [],
            pressArticles: Array.isArray(data.pressArticles) ? data.pressArticles : [],
            links: {
              ...current.links,
              ...(data.links || {}),
            },
            linkMetrics: {
              ...current.linkMetrics,
              ...(data.linkMetrics || {}),
            },
            contactArtistName: data.contactArtistName || '',
            managerName: data.managerName || '',
            roadManagerName: data.roadManagerName || '',
            contactCountryCode: data.contactCountryCode || '+57',
            contactPhone: data.contactPhone || '',
            whatsappPhone: data.whatsappPhone || '',
            contactLogo: data.contactLogo || '',
            artistMilestones: data.artistMilestones || { digital: [], live: [], press: [], collaborations: [] },
            planTier: data.planTier || '',
            theme: data.theme || 'neon',
          }));
        }

        setError('');
        setLoading(false);
      },
      () => {
        setError('No se pudo sincronizar el preview PDF en tiempo real.');
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [presskitRef]);

  useEffect(() => {
    let cancelled = false;

    resolvePdfPresskitData(presskitData).then((resolved) => {
      if (!cancelled) setPdfPresskitData(resolved);
    });

    return () => {
      cancelled = true;
    };
  }, [presskitData]);

  useEffect(() => {
    // Usuarios premium/whitelisted: sin vista protegida ni bloqueos.
    if (isWhitelisted) {
      setIsProtectedVisible(true);
      return;
    }

    const handleVisibilityChange = () => {
      setIsProtectedVisible(document.visibilityState === 'visible');
    };

    const handleWindowBlur = () => {
      setIsProtectedVisible(false);
    };

    const handleWindowFocus = () => {
      setIsProtectedVisible(true);
    };

    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    const handleKeyDown = (event) => {
      const key = String(event.key || '').toLowerCase();
      const commandPressed = event.metaKey || event.ctrlKey;

      if (event.key === 'PrintScreen' || event.key === 'F12') {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (commandPressed && ['p', 's', 'u', 'c'].includes(key)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    handleVisibilityChange();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [isWhitelisted]);

  const pdfColors = {
    bg:       hexify(uiTheme.bgColor),
    card:     uiTheme.cardBg,
    title:    uiTheme.titleColor,
    subtitle: uiTheme.subtitleColor,
    text:     uiTheme.textColor,
    accent:   hexify(uiTheme.accentColor),
    border:   uiTheme.borderColor,
    overlay:  uiTheme.overlayColor,
  };

  const pdfTextEffect = uiTheme.textEffectPdf || 'none';
  const pdfSubtitleEffect = uiTheme.subtitleEffectPdf || 'none';

  // Clave estable de datos + colores: evita regenerar el PDF en re-renders
  // que no cambian el contenido (p. ej. focus/blur al hacer clic en el iframe).
  const docKey = JSON.stringify(pdfPresskitData || {});
  const colorsKey = JSON.stringify(pdfColors) + pdfTextEffect + pdfSubtitleEffect;
  const blobKey = 'v19-metric-abbrev-' + docKey + pdfVariant + (previewNeedsWatermark ? '-wm' : '-clean') + colorsKey;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pdfDocNode = useMemo(
    () => (
      <PresskitPdfDocument
        data={pdfPresskitData}
        variant={pdfVariant}
        colors={pdfColors}
        textEffect={pdfTextEffect}
        subtitleEffect={pdfSubtitleEffect}
        customFonts={pdfPresskitData?.customFonts || {}}
        watermark={previewNeedsWatermark}
        watermarkLabel={watermarkLabel}
      />
    ),
    [blobKey, watermarkLabel],
  );

  const openDownloadModal = () => {
    if (hasCleanDownloadAccess) {
      handleConfirmDownload();
      return;
    }
    setIsDownloadModalOpen(true);
  };

  const closeDownloadModal = () => {
    setIsDownloadModalOpen(false);
  };

  const goToCheckout = (billing) => {
    const params = new URLSearchParams({
      plan: 'professional',
      billing,
      action: 'download',
    });
    window.location.assign(`/checkout?${params.toString()}`);
  };

  const handleConfirmDownload = async () => {
    const useWatermark = !hasCleanDownloadAccess;
    const fileBaseName = (presskitData.artistName || 'presskit').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const pdfFileName = `${fileBaseName}-${pdfVariant}${useWatermark ? '-watermarked' : ''}.pdf`;
    const documentNode = (
      <PresskitPdfDocument
        data={pdfPresskitData}
        variant={pdfVariant}
        colors={pdfColors}
        textEffect={pdfTextEffect}
        subtitleEffect={pdfSubtitleEffect}
        customFonts={pdfPresskitData?.customFonts || {}}
        watermark={useWatermark}
        watermarkLabel={watermarkLabel}
      />
    );

    try {
      const blob = await downloadBlobFromPdfDocument(documentNode);
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = pdfFileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
      closeDownloadModal();
    } catch (err) {
      setError('No se pudo generar la descarga del PDF.');
      closeDownloadModal();
    }
  };

  return (
    <section className="mx-auto min-h-screen w-full max-w-400 px-6 py-8 lg:px-12">
      <div className="mb-6">
        <Topbar user={user} onSignOut={onSignOut} />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-white">presskitPDF</h1>
        <a
          href="/createPresskit"
          className="rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-300/20"
        >
          Volver al editor
        </a>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.16em]" style={{ color: uiTheme.subtitleColor }}>PREVIEW EN VIVO PARA DESCARGAR</p>
        <p className="mt-1 text-[11px] text-zinc-400">
          Vista protegida: atajos de impresión y menú contextual bloqueados. La captura de pantalla del sistema no se puede impedir por completo en web.
        </p>
        {(() => {
          return (
            <BlobProvider
              key={blobKey}
              document={pdfDocNode}
            >
              {({ url, loading: pdfLoading }) => (
                <div className="relative mt-3 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-3 rounded-lg border border-white/10 bg-transparent px-3 py-1 text-xs text-zinc-300">
                      <label htmlFor="pdf-zoom" className="text-[11px] text-zinc-300">Zoom</label>
                      <input
                        id="pdf-zoom"
                        type="range"
                        min="50"
                        max="200"
                        step="5"
                        value={pdfZoom}
                        onChange={(e) => setPdfZoom(Number(e.target.value))}
                        className="h-2 w-40 accent-amber-300"
                        aria-label="Control de zoom del PDF"
                      />
                      <div className="text-xs font-semibold text-amber-300" aria-hidden>{pdfZoom}%</div>
                    </div>

                    <button
                      type="button"
                      onClick={openDownloadModal}
                      className="inline-flex rounded-lg border border-amber-300/40 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-300/10"
                    >
                      {pdfLoading ? 'Generando PDF...' : 'Descargar PDF'}
                    </button>
                  </div>

                  <div
                    className="relative overflow-hidden rounded-2xl border border-white/15 bg-zinc-950 mx-auto"
                    style={{ height: 'min(90vh, 1000px)', maxWidth: '960px', margin: '0 auto' }}
                  >
                    {!isProtectedVisible ? (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 px-6 text-center backdrop-blur-md">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Vista protegida</p>
                          <p className="mt-2 text-sm text-zinc-300">Regresa a la pestaña para continuar viendo el preview.</p>
                        </div>
                      </div>
                    ) : null}
                    {pdfLoading || !url ? (
                      <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                        Generando preview PDF...
                      </div>
                      ) : (
                      <iframe
                        title="Preview PDF"
                        src={`${url}#toolbar=0&zoom=${pdfZoom}`}
                        onContextMenu={(event) => event.preventDefault()}
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none',
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
            </BlobProvider>
          );
        })()}

        {isDownloadModalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-cyan-300">Opciones de pago</p>
                  <h2 className="mt-2 text-2xl font-black text-white">Activa tu descarga limpia</h2>
                  <p className="mt-2 text-sm text-zinc-300">
                    Elige cómo quieres acceder al PDF sin marca de agua. Mientras no completes una de estas opciones, la descarga seguirá protegida.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleConfirmDownload}
                    aria-label="Descargar ahora"
                    className="rounded-lg bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-200 hover:bg-amber-300/20"
                  >
                    {hasCleanDownloadAccess ? 'Descargar limpio' : 'Descargar ahora'}
                  </button>
                  <button
                    type="button"
                    onClick={closeDownloadModal}
                    className="rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-amber-300">Descarga protegida inmediata</p>
                <p className="mt-2 text-sm text-zinc-300">
                  Si solo quieres el archivo ahora, puedes bajarlo con marca de agua sin pasar por el checkout.
                </p>
                <button
                  type="button"
                  onClick={handleConfirmDownload}
                  className="mt-4 inline-flex rounded-xl border border-amber-300/40 bg-amber-300/10 px-4 py-2.5 text-sm font-bold text-amber-200 transition hover:bg-amber-300/20"
                >
                  {hasCleanDownloadAccess ? 'Descargar limpio ahora' : 'Descargar protegida ahora'}
                </button>
              </div>

              {hasCleanDownloadAccess ? (
                <div className="mt-6 rounded-2xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100">
                  Ya tienes acceso limpio. Puedes descargar el PDF sin marca de agua ahora mismo.
                </div>
              ) : (
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => goToCheckout('annual')}
                    className="rounded-2xl border border-fuchsia-300/50 bg-fuchsia-300/10 p-5 text-left transition hover:border-fuchsia-300/80 hover:bg-fuchsia-300/15"
                  >
                    <span className="inline-flex rounded-full bg-fuchsia-400 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-zinc-950">
                      Suscripción anual
                    </span>
                    <span className="mt-3 block text-sm font-bold text-white">Acceso limpio durante 12 meses</span>
                    <span className="mt-1 block text-xs text-zinc-300">
                      Activa la descarga sin marca de agua con renovación anual.
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => goToCheckout('once')}
                    className="rounded-2xl border border-cyan-300/40 bg-cyan-300/10 p-5 text-left transition hover:border-cyan-300/70 hover:bg-cyan-300/15"
                  >
                    <span className="inline-flex rounded-full bg-cyan-300 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-zinc-950">
                      Descarga de una sola vez
                    </span>
                    <span className="mt-3 block text-sm font-bold text-white">Paga una vez y descarga limpio</span>
                    <span className="mt-1 block text-xs text-zinc-300">
                      Ideal si solo necesitas este archivo sin suscripción recurrente.
                    </span>
                  </button>
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeDownloadModal}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDownload}
                  className="rounded-xl bg-fuchsia-400 px-5 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-fuchsia-300"
                >
                  {hasCleanDownloadAccess ? 'Descargar limpio' : 'Descarga protegida'}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {loading ? (
          <p className="mt-3 text-sm text-zinc-400">Sincronizando información del presskit...</p>
        ) : null}
        {error ? (
          <p className="mt-3 rounded-xl border border-amber-300/40 bg-amber-100/95 px-3 py-2 text-sm text-zinc-900">{error}</p>
        ) : null}
      </section>
    </section>
  );
}

export default PresskitPDF;

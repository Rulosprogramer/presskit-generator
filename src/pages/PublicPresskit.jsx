import { useEffect, useState } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import PresskitWeb from '../components/post-login/PresskitWeb.jsx';
import { db } from '../lib/firebase';
import { translatePresskit } from '../lib/translatePresskit.js';

const LANGS = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
];

const initialPresskitData = {
  artistName: '',
  genre: '',
  city: '',
  coverImageScale: 1,
  coverImageOffsetX: 0,
  coverImageOffsetY: 0,
  coverApplyToPDF: false,
  performanceLiveLink: '',
  totalStreams: '',
  totalVideoViews: '',
  recognitions: '',
  useRecognitionImage: false,
  recognitionImage: '',
  bioStyle: 'prensa',
  twitterBio: '',
  twitterBioImage: '',
  bio: '',
  bioImage: '',
  longBio: '',
  longBioImage: '',
  interviewLink: '',
  artistMilestones: {
    digital: [],
    live: [],
    press: [],
    collaborations: [],
  },
  releases: [],
  releasesCtaText: '',
  images: [],
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
  linkScreenshots: {
    youtube: '',
    instagram: '',
    tiktok: '',
    facebook: '',
  },
  contactArtistName: '',
  managerName: '',
  roadManagerName: '',
  contactCountryCode: '+57',
  contactPhone: '',
  whatsappPhone: '',
  contactLogo: '',
  planTier: '',
  pressArticles: [],
  theme: 'neon',
};

function PublicPresskit({ presskitId = '' }) {
  const [presskitData, setPresskitData] = useState(initialPresskitData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expired, setExpired] = useState(false);
  const [activeLang, setActiveLang] = useState('es');
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState('');
  const [translationCache, setTranslationCache] = useState({});
  const [displayData, setDisplayData] = useState(initialPresskitData);

  const handleLangChange = async (langCode) => {
    if (langCode === activeLang) return;
    setActiveLang(langCode);
    setTranslateError('');
    if (langCode === 'es') {
      setDisplayData(presskitData);
      return;
    }
    if (translationCache[langCode]) {
      setDisplayData(translationCache[langCode]);
      return;
    }
    setTranslating(true);
    try {
      const translated = await translatePresskit(presskitData, langCode);
      setTranslationCache(c => ({ ...c, [langCode]: translated }));
      setDisplayData(translated);
    } catch (err) {
      console.warn('Error traduciendo presskit:', err);
      const msg = err?.message?.includes('VITE_GEMINI_API_KEY')
        ? 'Traductor no configurado (falta API key).'
        : 'No se pudo traducir. Intenta de nuevo.';
      setTranslateError(msg);
      setActiveLang('es');
      setDisplayData(presskitData);
    } finally {
      setTranslating(false);
    }
  };

  useEffect(() => {
    if (!presskitId) {
      setLoading(false);
      setError('No se encontró el enlace publicado.');
      return;
    }

    let unsubscribe = () => {};
    setLoading(true);

    const subscribe = (uid) => {
      const ref = doc(db, 'presskits', uid);
      unsubscribe = onSnapshot(
        ref,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          // Caducidad del enlace público: el pago único da acceso por 20 días
          // (campo publicLinkExpiresAt). Una suscripción activa nunca caduca.
          // Si no hay campo de caducidad, se comporta como antes (no rompe lo existente).
          const expiresMs = data.publicLinkExpiresAt?.toMillis ? data.publicLinkExpiresAt.toMillis() : null;
          const isExpired = !data.subscriptionActive && expiresMs != null && expiresMs < Date.now();
          setExpired(isExpired);
          if (isExpired) {
            setLoading(false);
            return;
          }
          setPresskitData((current) => ({
            ...current,
            artistName: data.artistName || '',
            genre: data.genre || '',
            city: data.city || '',
            coverImageScale: data.coverImageScale,
            coverImageOffsetX: data.coverImageOffsetX,
            coverImageOffsetY: data.coverImageOffsetY,
            coverImageZoom: data.coverImageZoom,
            coverImagePositionX: data.coverImagePositionX,
            coverImagePositionY: data.coverImagePositionY,
            performanceLiveLink: data.performanceLiveLink || '',
            totalStreams: data.totalStreams || '',
            totalVideoViews: data.totalVideoViews || '',
            recognitions: data.recognitions || '',
            useRecognitionImage: Boolean(data.useRecognitionImage),
            recognitionImage: data.recognitionImage || '',
            bioStyle: data.bioStyle || 'prensa',
            twitterBio: data.twitterBio || '',
            twitterBioImage: data.twitterBioImage || '',
            bio: data.bio || '',
            bioImage: data.bioImage || '',
            longBio: data.longBio || '',
            longBioImage: data.longBioImage || '',
            interviewLink: data.interviewLink || '',
            artistMilestones: data.artistMilestones || current.artistMilestones,
            releases: Array.isArray(data.releases) ? data.releases : [],
            releasesCtaText: data.releasesCtaText || '',
            images: Array.isArray(data.images) ? data.images : [],
            links: {
              ...current.links,
              ...(data.links || {}),
            },
            linkMetrics: {
              ...current.linkMetrics,
              ...(data.linkMetrics || {}),
            },
            linkScreenshots: {
              ...current.linkScreenshots,
              ...(data.linkScreenshots || {}),
            },
            contactArtistName: data.contactArtistName || '',
            managerName: data.managerName || '',
            roadManagerName: data.roadManagerName || '',
            contactCountryCode: data.contactCountryCode || '+57',
            contactPhone: data.contactPhone || '',
            whatsappPhone: data.whatsappPhone || '',
            contactLogo: data.contactLogo || '',
            planTier: data.planTier || '',
            pressArticles: Array.isArray(data.pressArticles) ? data.pressArticles : [],
            theme: data.theme || 'neon',
            coverApplyToPDF: Boolean(data.coverApplyToPDF),
          }));
          setTranslationCache({});
          setActiveLang('es');
          setError('');
        } else {
          setError('Este presskit publicado no existe o ya no está disponible.');
        }
        setLoading(false);
      },
      () => {
        setError('No se pudo cargar el presskit publicado.');
        setLoading(false);
      },
    );
    };

    // Resolve: primero intenta como slug personalizado, luego como uid (backward compat)
    getDoc(doc(db, 'presskit_slugs', presskitId)).then((slugSnap) => {
      if (slugSnap.exists()) {
        subscribe(slugSnap.data().uid);
      } else {
        subscribe(presskitId);
      }
    }).catch(() => subscribe(presskitId));

    return () => unsubscribe();
  }, [presskitId]);

  // Keep displayData in sync with source when showing ES (no translation active)
  useEffect(() => {
    if (activeLang === 'es') setDisplayData(presskitData);
  }, [presskitData, activeLang]);

  if (loading) {
    return <div className="px-6 py-8 text-sm text-zinc-300">Cargando presskit publicado...</div>;
  }

  if (expired) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 py-8">
        <div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-300">Enlace expirado</p>
          <h1 className="mt-3 text-2xl font-bold text-white">Este presskit ya no está disponible</h1>
          <p className="mt-3 text-sm text-zinc-300">
            El enlace público de pago único tiene una vigencia de 20 días y ha caducado. El artista puede
            renovarlo con una nueva descarga o activar el plan anual para mantenerlo siempre activo.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 py-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-zinc-200">{error}</div>
      </div>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-400 px-6 py-8 lg:px-12">
      {/* Language toggle */}
      <div className="mb-6 flex items-center justify-end gap-2">
        {translateError && (
          <span className="text-xs text-red-400">{translateError}</span>
        )}
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              type="button"
              onClick={() => handleLangChange(code)}
              disabled={translating}
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest transition-all ${
                activeLang === code
                  ? 'bg-white text-zinc-950 shadow'
                  : 'text-zinc-400 hover:text-white'
              } disabled:opacity-50`}
            >
              {translating && code === activeLang ? '…' : label}
            </button>
          ))}
        </div>
      </div>

      {translating && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-2.5 text-xs text-cyan-300">
          <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeDashoffset="12"/>
          </svg>
          Traduciendo presskit…
        </div>
      )}

      <PresskitWeb presskitData={displayData} mode="full" />
    </main>
  );
}

export default PublicPresskit;
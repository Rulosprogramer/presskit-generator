import { useEffect, useMemo, useState } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { FaLink } from 'react-icons/fa';
import {
  SiApplemusic,
  SiFacebook,
  SiInstagram,
  SiSoundcloud,
  SiSpotify,
  SiTiktok,
  SiYoutube,
} from 'react-icons/si';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getTypeface } from '../lib/typefaces.js';
import { useTheme } from '../context/ThemeContext.tsx';
import PresskitPdfDocument from '../components/pdfx/PresskitPdfDocument.jsx';
import Topbar from '../components/post-login/Topbar.jsx';

function hexify(color) {
  if (!color) return '#000000';
  if (/^#[0-9a-f]{6}$/i.test(color)) return color;
  const h3 = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(color);
  if (h3) return `#${h3[1]}${h3[1]}${h3[2]}${h3[2]}${h3[3]}${h3[3]}`;
  const m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(color);
  if (m) return '#' + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
  return '#000000';
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
  links: {
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
  contactLogo: '',
  planTier: '',
  theme: 'neon',
};

function PresskitPDF({ user, onSignOut, presskitId = '' }) {
  const [presskitData, setPresskitData] = useState(initialPresskitData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const pdfVariant = searchParams.get('variant') === 'essential' || presskitData.planTier === 'essential' ? 'essential' : 'professional';

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
            links: {
              ...current.links,
              ...(data.links || {}),
            },
            contactArtistName: data.contactArtistName || '',
            managerName: data.managerName || '',
            roadManagerName: data.roadManagerName || '',
            contactCountryCode: data.contactCountryCode || '+57',
            contactPhone: data.contactPhone || '',
            contactLogo: data.contactLogo || '',
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

  const cover = presskitData.images?.[0];
  const gallery = (presskitData.images || []).slice(1, 5);
  const galleryCollageImages = (presskitData.images || []).slice(1);
  const collageImages = galleryCollageImages.length > 0 ? galleryCollageImages : (cover ? [cover] : []);
  const collageImagesForPdf = collageImages.slice(0, 12);
  const contactArtistName = presskitData.contactArtistName || presskitData.artistName || 'Nombre del artista';
  const managerName = presskitData.managerName || 'No especificado';
  const roadManagerName = presskitData.roadManagerName || 'No especificado';
  const contactCountryCode = presskitData.contactCountryCode || '+57';
  const contactPhone = presskitData.contactPhone || 'No especificado';
  const contactLogo = presskitData.contactLogo || '';
  const filledLinks = Object.entries(presskitData.links || {})
    .filter(([key, value]) => key !== 'youtubeVideo' && value)
    .slice(0, 6);
  const socialNameMap = {
    spotify: 'Spotify',
    instagram: 'Instagram',
    youtube: 'YouTube',
    tiktok: 'TikTok',
    facebook: 'Facebook',
    appleMusic: 'Apple Music',
    soundcloud: 'SoundCloud',
  };
  const socialIconMap = {
    spotify: SiSpotify,
    instagram: SiInstagram,
    youtube: SiYoutube,
    tiktok: SiTiktok,
    facebook: SiFacebook,
    appleMusic: SiApplemusic,
    soundcloud: SiSoundcloud,
  };
  const getProfileHandle = (rawUrl) => {
    if (!rawUrl) return '';
    try {
      const normalized = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
      const url = new URL(normalized);
      const segments = url.pathname.split('/').filter(Boolean);
      if (segments.length === 0) return '';

      if (segments[0].startsWith('@')) return segments[0].slice(1);
      if ((segments[0] === 'channel' || segments[0] === 'c' || segments[0] === 'user') && segments[1]) return segments[1];

      return segments[0].replace(/^@/, '');
    } catch {
      return '';
    }
  };
  const getLinkDomain = (rawUrl) => {
    if (!rawUrl) return '';
    try {
      const normalized = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
      return new URL(normalized).hostname.replace('www.', '');
    } catch {
      return rawUrl;
    }
  };
  const getProfileImageUrl = (key, rawUrl) => {
    const handle = getProfileHandle(rawUrl);
    const domain = getLinkDomain(rawUrl);
    const serviceByKey = {
      spotify: 'spotify',
      instagram: 'instagram',
      youtube: 'youtube',
      tiktok: 'tiktok',
      facebook: 'facebook',
      appleMusic: 'music.apple',
      soundcloud: 'soundcloud',
    };

    const service = serviceByKey[key];
    if (service && handle) return `https://unavatar.io/${service}/${handle}`;
    if (domain) return `https://unavatar.io/${domain}`;
    return '';
  };
  const getYoutubeThumbnailUrl = (url) => {
    if (!url) return '';
    const match = String(url).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    const videoId = match?.[1];
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
  };
  const getMilestonesByCategory = (artistMilestones) => {
    const milestones = artistMilestones || {};
    return [
      { key: 'digital', label: 'Digital', items: Array.isArray(milestones.digital) ? milestones.digital : [] },
      { key: 'live', label: 'Live', items: Array.isArray(milestones.live) ? milestones.live : [] },
      { key: 'press', label: 'Press', items: Array.isArray(milestones.press) ? milestones.press : [] },
      { key: 'collaborations', label: 'Colaboraciones', items: Array.isArray(milestones.collaborations) ? milestones.collaborations : [] },
    ];
  };
  const getCollageSpanClass = (index, total) => {
    if (total <= 1) return 'col-span-3 row-span-3';
    if (total === 2) return index === 0 ? 'col-span-2 row-span-3' : 'col-span-1 row-span-3';
    if (total === 3) {
      return ['col-span-2 row-span-2', 'col-span-1 row-span-1', 'col-span-1 row-span-1'][index] || 'col-span-1 row-span-1';
    }
    if (total === 4) {
      return ['col-span-2 row-span-2', 'col-span-1 row-span-1', 'col-span-1 row-span-1', 'col-span-3 row-span-1'][index] || 'col-span-1 row-span-1';
    }

    const editorialPattern = [
      'col-span-2 row-span-2',
      'col-span-1 row-span-1',
      'col-span-1 row-span-2',
      'col-span-2 row-span-1',
      'col-span-1 row-span-1',
      'col-span-2 row-span-2',
      'col-span-1 row-span-1',
      'col-span-3 row-span-1',
    ];

    return editorialPattern[index % editorialPattern.length];
  };
  const { theme: uiTheme } = useTheme();
  const theme = {
    bgHex:          hexify(uiTheme.bgColor),
    primaryText:    hexify(uiTheme.accentColor),
    textBg:         uiTheme.titleColor,
    textBgSecondary:uiTheme.textColor,
    secondaryText:  uiTheme.subtitleColor,
  };
  const pdfColors = {
    bg:     hexify(uiTheme.bgColor),
    card:   uiTheme.cardBg,
    title:  uiTheme.titleColor,
    text:   uiTheme.textColor,
    accent: hexify(uiTheme.accentColor),
    border: uiTheme.borderColor,
  };
  const typeface = getTypeface(presskitData.typeface || 'neutral');
  const bio140 = presskitData.twitterBio || 'Sin bio de 140 caracteres.';
  const bio140Image = presskitData.twitterBioImage || '';
  const longBio = presskitData.longBio || presskitData.bio || 'Sin biografía completa.';
  const longBioImage = presskitData.longBioImage || '';
  const milestoneCards = getMilestonesByCategory(presskitData.artistMilestones);
  const pdfFileName = `${(presskitData.artistName || 'presskit').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${pdfVariant}.pdf`;

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
        <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.secondaryText }}>PREVIEW EN VIVO PARA DESCARGAR</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPdfPreview((prev) => !prev)}
            className="rounded-lg border border-cyan-300/40 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-300/10"
          >
            {showPdfPreview ? 'Ocultar preview PDF' : 'Previsualizar PDF'}
          </button>

          <PDFDownloadLink
            document={<PresskitPdfDocument data={presskitData} variant={pdfVariant} colors={pdfColors} />}
            fileName={pdfFileName}
            className="rounded-lg border border-amber-300/40 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-300/10"
          >
            {({ loading: pdfLoading }) => (pdfLoading ? 'Generando PDF...' : 'Descargar PDF')}
          </PDFDownloadLink>
        </div>

        {showPdfPreview ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/15">
            <PDFViewer width="100%" height={680} showToolbar>
              <PresskitPdfDocument data={presskitData} variant={pdfVariant} colors={pdfColors} />
            </PDFViewer>
          </div>
        ) : null}

        {loading ? (
          <p className="mt-3 text-sm text-zinc-400">Sincronizando información del presskit...</p>
        ) : null}
        {error ? (
          <p className="mt-3 rounded-xl border border-amber-300/40 bg-amber-100/95 px-3 py-2 text-sm text-zinc-900">{error}</p>
        ) : null}

        <div className="mx-auto mt-4 w-full min-w-0 max-w-xl">
          <div className="w-full overflow-hidden rounded-[30px] p-3 sm:p-4" style={{ backgroundColor: theme.bgHex + '99', borderColor: theme.primaryText + '40' }}>
            <article className="relative flex aspect-8.5/11 w-full max-h-[82vh] flex-col overflow-hidden rounded-[20px]" style={{ backgroundColor: theme.bgHex, borderColor: theme.primaryText + '20', color: theme.textBg, fontFamily: typeface.fontFamily }}>
              <div className="absolute inset-0">
                {cover ? (
                  <img src={cover} alt={presskitData.artistName || 'Cover'} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center" style={{ backgroundColor: theme.bgHex }}>
                    <p className="text-sm" style={{ color: theme.textBgSecondary }}>Sube una portada para ver la preview</p>
                  </div>
                )}
              </div>
              <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to bottom, ${theme.bgHex}73, ${theme.bgHex}40, ${theme.bgHex}a6)` }} />

              <div className="relative z-10 flex h-full flex-col p-4">
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <button type="button" className="bg-transparent p-0 text-sm font-black uppercase tracking-[0.28em] text-white">
                    PRESS-KIT
                  </button>
                </div>

                <div className="space-y-2 text-white">
                  <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>{presskitData.genre || 'Género'} · {presskitData.city || 'Ciudad'}</p>
                  <h3 className="text-center text-2xl font-black" style={{ fontFamily: typeface.fontFamily, letterSpacing: typeface.letterSpacing }}>{presskitData.artistName || 'Nombre del artista'}</h3>
                </div>
              </div>
            </article>

            <article className="relative mt-6 grid aspect-8.5/11 w-full max-h-[82vh] grid-rows-[auto_1fr] overflow-hidden rounded-[20px]" style={{ backgroundColor: theme.bgHex, borderColor: theme.primaryText + '20', color: theme.textBg, fontFamily: typeface.fontFamily }}>
              <header className="px-5 py-4" style={{ borderColor: theme.primaryText + '20', borderBottomWidth: '1px' }}>
                <div className="text-center">
                  <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>CONOCE A</p>
                  <h2 className="mt-2 text-3xl font-black" style={{ fontFamily: typeface.fontFamily, letterSpacing: typeface.letterSpacing, color: theme.textBg }}>{presskitData.artistName || 'Nombre del artista'}</h2>
                </div>
              </header>

              <div className="grid min-h-0 gap-4 overflow-y-auto px-5 py-5" style={{ color: theme.textBgSecondary }}>
                <section className="rounded-2xl border p-4" style={{ borderColor: theme.primaryText + '25', backgroundColor: theme.primaryText + '08' }}>
                  <p className="text-xs uppercase tracking-[0.12em]" style={{ color: theme.primaryText }}>{presskitData.genre || 'Género'} · {presskitData.city || 'Ciudad'}</p>
                  <p className="mt-3 text-sm leading-7" style={{ color: theme.textBgSecondary }}>
                    {presskitData.shortBio || presskitData.bio || 'Completa la biografia corta para mostrar la historia del artista en esta pagina.'}
                  </p>
                </section>

                {presskitData.performanceLiveLink ? (
                  <section className="overflow-hidden rounded-2xl border" style={{ borderColor: theme.primaryText + '25', backgroundColor: theme.primaryText + '08' }}>
                    {getYoutubeThumbnailUrl(presskitData.performanceLiveLink) ? (
                      <img
                        src={getYoutubeThumbnailUrl(presskitData.performanceLiveLink)}
                        alt="Performance en vivo"
                        className="h-56 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-56 items-center justify-center" style={{ backgroundColor: theme.primaryText + '10', color: theme.textBgSecondary }}>
                        Sin thumbnail de video
                      </div>
                    )}

                    <div className="p-4">
                      <p className="text-xs uppercase tracking-[0.12em]" style={{ color: theme.primaryText }}>Live Performance</p>
                      <p className="mt-2 text-xl font-black" style={{ color: theme.textBg }}>Mira mi performance en vivo</p>
                      <a
                        href={presskitData.performanceLiveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex max-w-full rounded-full px-3 py-1 text-xs transition break-all"
                        style={{ borderColor: theme.primaryText + '50', backgroundColor: theme.primaryText + '10', color: theme.primaryText }}
                      >
                        {presskitData.performanceLiveLink}
                      </a>
                    </div>
                  </section>
                ) : null}
              </div>
            </article>

            <article className="relative mt-6 grid aspect-8.5/11 w-full max-h-[82vh] grid-rows-[auto_1fr_auto] overflow-hidden rounded-[20px]" style={{ backgroundColor: theme.bgHex, borderColor: theme.primaryText + '20', color: theme.textBg, fontFamily: typeface.fontFamily }}>
              <header className="px-5 py-4" style={{ borderColor: theme.primaryText + '20', borderBottomWidth: '1px' }}>
                <div className="text-center">
                  <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>Reconocimientos y Streams</p>
                </div>
              </header>

              <div className="grid min-h-0 grid-cols-1 gap-4 px-5 py-5 md:grid-cols-[42%_58%]" style={{ color: theme.textBgSecondary }}>
                <div className="overflow-hidden rounded-2xl border" style={{ borderColor: theme.primaryText + '30' }}>
                  {presskitData.useRecognitionImage && presskitData.recognitionImage ? (
                    <img src={presskitData.recognitionImage} alt="Reconocimientos" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full min-h-72 items-center justify-center px-6 text-center" style={{ backgroundColor: theme.primaryText + '10' }}>
                      <p className="text-sm leading-6" style={{ color: theme.textBgSecondary }}>
                        Sube una imagen de reconocimientos para completar esta página editorial.
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border p-4 text-sm" style={{ backgroundColor: theme.primaryText + '08', borderColor: theme.primaryText + '30' }}>
                  <p className="text-xs uppercase tracking-[0.14em]" style={{ color: theme.primaryText }}>Reconocimientos</p>
                  <p
                    className="mt-2"
                    style={{
                      color: theme.textBgSecondary,
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 9,
                      overflow: 'hidden',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {presskitData.recognitions || 'Añade reconocimientos, escenarios, playlists, becas, festivales o formación para completar esta sección.'}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 px-5 pb-5 pt-0 sm:grid-cols-2" style={{ borderColor: theme.primaryText + '20', borderTopWidth: '1px' }}>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em]" style={{ color: theme.primaryText }}>Total streams</p>
                  <p className="mt-2 text-2xl font-black" style={{ color: theme.textBg }}>{presskitData.totalStreams || 'Sin dato'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em]" style={{ color: theme.primaryText }}>Total video views</p>
                  <p className="mt-2 text-2xl font-black" style={{ color: theme.textBg }}>{presskitData.totalVideoViews || 'Sin dato'}</p>
                </div>
              </div>
            </article>

            {/* Página 4: Biografía */}
            <article className="relative mt-6 grid aspect-8.5/11 w-full max-h-[82vh] grid-rows-[auto_1fr] overflow-hidden rounded-[20px]" style={{ backgroundColor: theme.bgHex, borderColor: theme.primaryText + '20', color: theme.textBg, fontFamily: typeface.fontFamily }}>
              <header className="px-5 py-4" style={{ borderColor: theme.primaryText + '20', borderBottomWidth: '1px' }}>
                <div className="text-center">
                  <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>Biografía</p>
                </div>
              </header>

              <div className="flex min-h-0 flex-col gap-4 px-5 py-5" style={{ color: theme.textBgSecondary }}>
                <section className="shrink-0 rounded-2xl border p-4" style={{ borderColor: theme.primaryText + '25', backgroundColor: theme.primaryText + '08', flex: '0 0 22%' }}>
                  <p
                    className="text-sm leading-7"
                    style={{
                      color: theme.textBgSecondary,
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 6,
                      overflow: 'hidden',
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {bio140}
                  </p>
                </section>

                <section className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border" style={{ borderColor: theme.primaryText + '25', backgroundColor: theme.primaryText + '08' }}>
                  {bio140Image ? (
                    <img src={bio140Image} alt="Bio de 140 caracteres" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full min-h-96 items-center justify-center px-6 text-center" style={{ backgroundColor: theme.primaryText + '10' }}>
                      <p className="text-sm leading-6" style={{ color: theme.textBgSecondary }}>
                        Sube una imagen de bio de 140 caracteres para completar esta página editorial.
                      </p>
                    </div>
                  )}

                  <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to top, ${theme.bgHex}e6, ${theme.bgHex}88, ${theme.bgHex}33)` }} />

                  <div className="absolute left-4 right-4 top-4 flex flex-wrap gap-2">
                    {milestoneCards.map((milestone) => (
                      <div key={milestone.key} className="min-w-[42%] flex-1 rounded-xl border px-3 py-2 backdrop-blur-md" style={{ borderColor: theme.primaryText + '40', backgroundColor: '#0a0a12a8' }}>
                        <p className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: theme.primaryText }}>{milestone.label}</p>
                        <p
                          className="mt-1 text-[11px] leading-4"
                          style={{
                            color: theme.textBg,
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 3,
                            overflow: 'hidden',
                            whiteSpace: 'pre-line',
                          }}
                        >
                          {milestone.items.length > 0 ? milestone.items.slice(0, 3).map((item) => `• ${item}`).join('\n') : 'Sin hitos registrados.'}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </article>

            {/* Página 5: Biografía */}
            {(presskitData.longBio || presskitData.longBioImage) && (
              <article className="relative mt-6 grid aspect-8.5/11 w-full max-h-[82vh] grid-rows-[auto_1fr] overflow-hidden rounded-[20px]" style={{ backgroundColor: theme.bgHex, borderColor: theme.primaryText + '20', color: theme.textBg, fontFamily: typeface.fontFamily }}>
                <header className="px-5 py-4" style={{ borderColor: theme.primaryText + '20', borderBottomWidth: '1px' }}>
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>Biografía</p>
                  </div>
                </header>

                <div className="relative min-h-0 overflow-hidden px-5 py-5">
                  {longBioImage ? (
                    <img src={longBioImage} alt="Biografía" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0" style={{ backgroundColor: theme.bgHex }} />
                  )}

                  <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to top, ${theme.bgHex}f2, ${theme.bgHex}aa 42%, ${theme.bgHex}66)` }} />

                  <div className="relative z-10 flex h-full items-end">
                    <div className="w-full rounded-2xl border p-4 sm:p-5" style={{ borderColor: theme.primaryText + '30', backgroundColor: '#0a0a12b3' }}>
                      <p
                        className="whitespace-pre-line text-sm leading-7 sm:text-[15px]"
                        style={{
                          color: theme.textBg,
                          textShadow: '0 2px 12px rgba(0,0,0,0.85)',
                        }}
                      >
                        {longBio}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            )}

{/* Página: Releases - Múltiples páginas si es necesario */}
            {Array.isArray(presskitData.releases) && presskitData.releases.length > 0 && 
              Array.from({ length: Math.ceil(presskitData.releases.length / 4) }).map((_, pageIndex) => {
                const pageReleases = presskitData.releases.slice(pageIndex * 4, (pageIndex + 1) * 4);
                const releasesCount = pageReleases.length;
                // Calcular escala dinámicamente basado en cantidad de releases
                let releaseScale = 1;
                if (releasesCount === 4) releaseScale = 0.95;
                else if (releasesCount === 5) releaseScale = 0.85;
                else if (releasesCount > 5) releaseScale = 0.75;

                return (
                  <article 
                    key={`releases-page-${pageIndex}`}
                    className="relative mt-6 grid aspect-8.5/11 w-full max-h-[82vh] grid-rows-[auto_1fr] overflow-hidden rounded-[20px]" 
                    style={{ backgroundColor: theme.bgHex, borderColor: theme.primaryText + '20', color: theme.textBg, fontFamily: typeface.fontFamily }}
                  >
                    <header className="px-5 py-4" style={{ borderColor: theme.primaryText + '20', borderBottomWidth: '1px' }}>
                      <div className="text-center">
                        <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>
                          Releases {Math.ceil(presskitData.releases.length / 4) > 1 ? `(${pageIndex + 1}/${Math.ceil(presskitData.releases.length / 4)})` : ''}
                        </p>
                      </div>
                    </header>

                    <div className="grid min-h-0 overflow-hidden grid-cols-1" style={{ transform: `scale(${releaseScale})`, transformOrigin: 'top center' }}>
                      {pageReleases.map((release, relIndex) => {
                        const videoId = release.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
                        const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;

                        return (
                          <div 
                            key={`${pageIndex}-${relIndex}-${release.title}`} 
                            className="grid grid-cols-3 h-full gap-0 border-b" 
                            style={{ 
                              borderColor: relIndex < pageReleases.length - 1 ? theme.primaryText + '20' : 'transparent',
                              minHeight: '120px'
                            }}
                          >
                            {/* Izquierda: Thumbnail con play */}
                            <div className="relative flex items-center justify-center p-3 col-span-1" style={{ borderColor: theme.primaryText + '20', borderRightWidth: '1px' }}>
                              {thumbnail ? (
                                <>
                                  <img
                                    src={thumbnail}
                                    alt={release.title}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                  <a
                                    href={release.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 flex items-center justify-center rounded-lg transition hover:bg-black/30"
                                  >
                                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center hover:bg-white">
                                      <span className="text-lg ml-1">▶</span>
                                    </div>
                                  </a>
                                </>
                              ) : (
                                <div className="w-full h-full rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.primaryText + '15' }}>
                                  <span className="text-xs text-zinc-400">Sin video</span>
                                </div>
                              )}
                            </div>

                            {/* Derecha: Info */}
                            <div className="flex flex-col justify-between p-4 col-span-2">
                              <div>
                                <p className="text-base font-bold line-clamp-2" style={{ color: theme.textBg }}>{release.title}</p>
                                {release.description && (
                                  <p className="text-xs mt-2 leading-4 line-clamp-3" style={{ color: theme.textBgSecondary }}>{release.description}</p>
                                )}
                              </div>
                              {release.author && (
                                <p className="text-sm font-semibold" style={{ color: theme.primaryText }}>{release.author}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                );
              })
            }

            {filledLinks.length > 0 && (
              <article className="relative mt-6 grid aspect-8.5/11 w-full max-h-[82vh] grid-rows-[auto_1fr] overflow-hidden rounded-[20px]" style={{ backgroundColor: theme.bgHex, borderColor: theme.primaryText + '20', color: theme.textBg, fontFamily: typeface.fontFamily }}>
                <header className="px-5 py-4 text-center" style={{ borderColor: theme.primaryText + '20', borderBottomWidth: '1px' }}>
                  <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>CONECTA CON</p>
                  <h2 className="mt-2 text-3xl font-black" style={{ color: theme.textBg }}>{presskitData.artistName || 'Nombre del artista'}</h2>
                </header>

                <div className="grid min-h-0 grid-cols-3 gap-3 overflow-y-auto p-5">
                  {filledLinks.map(([key, value], index) => {
                    const spanClass = index % 5 === 0
                      ? 'col-span-2'
                      : index % 5 === 3
                        ? 'col-span-2'
                        : 'col-span-1';
                    const socialName = socialNameMap[key] || key;
                    const Icon = socialIconMap[key] || FaLink;
                    const domain = getLinkDomain(value);
                    const avatarUrl = getProfileImageUrl(key, value);

                    return (
                      <a
                        key={`connect-${key}-${index}`}
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${spanClass} rounded-2xl border p-4`}
                        style={{ borderColor: theme.primaryText + '35', backgroundColor: theme.primaryText + '10' }}
                      >
                        <div className="flex h-full flex-col justify-between gap-3">
                          <div className="h-24 w-full overflow-hidden rounded-xl" style={{ backgroundColor: theme.primaryText + '12' }}>
                            {avatarUrl ? (
                              <img src={avatarUrl} alt={socialName} className="h-full w-full object-cover" />
                            ) : null}
                          </div>
                          <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: theme.primaryText + '30', color: theme.textBg }}>
                            <Icon className="text-xl" />
                          </div>
                          <div>
                            <p className="text-2xl font-black leading-none" style={{ color: theme.textBg }}>{socialName}</p>
                            <p className="mt-2 text-xs" style={{ color: theme.textBgSecondary }}>{domain}</p>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </article>
            )}

            {collageImagesForPdf.length > 0 && (
              <article className="relative mt-6 grid aspect-8.5/11 w-full max-h-[82vh] grid-rows-[auto_1fr] overflow-hidden rounded-[20px]" style={{ backgroundColor: theme.bgHex, borderColor: theme.primaryText + '20', color: theme.textBg, fontFamily: typeface.fontFamily }}>
                <header className="px-5 py-4 text-center" style={{ borderColor: theme.primaryText + '20', borderBottomWidth: '1px' }}>
                  <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>GALERÍA VISUAL</p>
                </header>

                <div className="grid min-h-0 grid-cols-3 auto-rows-[80px] gap-0 overflow-hidden">
                  {collageImagesForPdf.map((image, index) => (
                    <div key={`collage-pdf-${index}`} className={getCollageSpanClass(index, collageImagesForPdf.length)}>
                      <img src={image} alt={`Galería ${index + 1}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </article>
            )}

            <article className="relative mt-6 grid aspect-8.5/11 w-full max-h-[82vh] grid-rows-[auto_1fr] overflow-hidden rounded-[20px]" style={{ backgroundColor: theme.bgHex, borderColor: theme.primaryText + '20', color: theme.textBg, fontFamily: typeface.fontFamily }}>
              <header className="px-5 py-4 text-center" style={{ borderColor: theme.primaryText + '20', borderBottomWidth: '1px' }}>
                <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>CONTACTO</p>
                <h2 className="mt-2 text-3xl font-black" style={{ color: theme.textBg }}>{contactArtistName}</h2>
                {contactLogo ? (
                  <div className="mt-3 flex justify-center">
                    <img src={contactLogo} alt="Logo de contacto" className="h-auto w-auto max-h-12 max-w-45 object-contain" />
                  </div>
                ) : null}
              </header>

              <div className="grid min-h-0 gap-3 overflow-hidden p-5">
                <div className="rounded-2xl border p-4" style={{ borderColor: theme.primaryText + '35', backgroundColor: theme.primaryText + '10' }}>
                  <p className="text-xs uppercase tracking-[0.12em]" style={{ color: theme.primaryText }}>Manager</p>
                  <p className="mt-1 text-xl font-semibold" style={{ color: theme.textBg }}>{managerName}</p>
                </div>

                <div className="rounded-2xl border p-4" style={{ borderColor: theme.primaryText + '35', backgroundColor: theme.primaryText + '10' }}>
                  <p className="text-xs uppercase tracking-[0.12em]" style={{ color: theme.primaryText }}>Road Manager</p>
                  <p className="mt-1 text-xl font-semibold" style={{ color: theme.textBg }}>{roadManagerName}</p>
                </div>

                <div className="rounded-2xl border p-4" style={{ borderColor: theme.primaryText + '35', backgroundColor: theme.primaryText + '10' }}>
                  <p className="text-xs uppercase tracking-[0.12em]" style={{ color: theme.primaryText }}>Contacto</p>
                  <p className="mt-1 text-xl font-semibold" style={{ color: theme.textBg }}>{contactCountryCode} {contactPhone}</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </section>
  );
}

export default PresskitPDF;

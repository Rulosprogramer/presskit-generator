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
import { getTheme } from '../lib/themeColors.js';
import { getTypeface } from '../lib/typefaces.js';
import PresskitPdfDocument from '../components/pdfx/PresskitPdfDocument.jsx';
import Topbar from '../components/post-login/Topbar.jsx';

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
  bio: '',
  bioImage: '',
  longBio: '',
  longBioImage: '',
  interviewLink: '',
  releases: [],
  images: [],
  links: {
    spotify: '',
    instagram: '',
    youtube: '',
    tiktok: '',
    youtubeVideo: '',
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
            bio: data.bio || '',
            bioImage: data.bioImage || '',
            longBio: data.longBio || '',
            longBioImage: data.longBioImage || '',
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
    .filter(([, value]) => value)
    .slice(0, 6);
  const socialNameMap = {
    spotify: 'Spotify',
    instagram: 'Instagram',
    youtube: 'YouTube',
    tiktok: 'TikTok',
    youtubeVideo: 'YouTube',
    facebook: 'Facebook',
    appleMusic: 'Apple Music',
    soundcloud: 'SoundCloud',
  };
  const socialIconMap = {
    spotify: SiSpotify,
    instagram: SiInstagram,
    youtube: SiYoutube,
    tiktok: SiTiktok,
    youtubeVideo: SiYoutube,
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
      youtubeVideo: 'youtube',
      facebook: 'facebook',
      appleMusic: 'music.apple',
      soundcloud: 'soundcloud',
    };

    const service = serviceByKey[key];
    if (service && handle) return `https://unavatar.io/${service}/${handle}`;
    if (domain) return `https://unavatar.io/${domain}`;
    return '';
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
  const theme = getTheme(presskitData.theme || 'neon');
  const typeface = getTypeface(presskitData.typeface || 'neutral');
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
            document={<PresskitPdfDocument data={presskitData} variant={pdfVariant} />}
            fileName={pdfFileName}
            className="rounded-lg border border-amber-300/40 px-3 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-300/10"
          >
            {({ loading: pdfLoading }) => (pdfLoading ? 'Generando PDF...' : 'Descargar PDF')}
          </PDFDownloadLink>
        </div>

        {showPdfPreview ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/15">
            <PDFViewer width="100%" height={680} showToolbar>
              <PresskitPdfDocument data={presskitData} variant={pdfVariant} />
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
                  <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>Reconocimientos y Streams</p>
                </div>
              </header>

              <div className="grid min-h-0 gap-5 overflow-y-auto px-5 py-5" style={{ color: theme.textBgSecondary }}>
                {presskitData.useRecognitionImage && presskitData.recognitionImage ? (
                  <div className="grid gap-4 md:grid-cols-[42%_58%]">
                    <div className="overflow-hidden rounded-2xl" style={{ borderColor: theme.primaryText + '30', borderWidth: '1px' }}>
                      <img src={presskitData.recognitionImage} alt="Reconocimientos" className="h-full min-h-45 w-full object-cover" />
                    </div>
                    <div className="rounded-2xl p-4 text-sm" style={{ backgroundColor: theme.primaryText + '08', borderColor: theme.primaryText + '30', borderWidth: '1px' }}>
                      <p className="text-xs uppercase tracking-[0.14em]" style={{ color: theme.primaryText }}>Reconocimientos</p>
                      <p className="mt-2 whitespace-pre-line">{presskitData.recognitions || 'Añade reconocimientos, escenarios, playlists, becas, festivales o formación para completar esta sección.'}</p>
                    </div>
                  </div>
                ) : presskitData.recognitions ? (
                  <section>
                    <p className="text-xs uppercase tracking-[0.14em]" style={{ color: theme.primaryText }}>Reconocimientos</p>
                    <p className="mt-2 text-sm leading-7 whitespace-pre-line">{presskitData.recognitions}</p>
                  </section>
                ) : null}

                <div className="mt-auto grid gap-3 pt-4 sm:grid-cols-2" style={{ borderColor: theme.primaryText + '20', borderTopWidth: '1px' }}>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em]" style={{ color: theme.primaryText }}>Total streams</p>
                    <p className="mt-2 text-2xl font-black" style={{ color: theme.textBg }}>{presskitData.totalStreams || 'Sin dato'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em]" style={{ color: theme.primaryText }}>Total video views</p>
                    <p className="mt-2 text-2xl font-black" style={{ color: theme.textBg }}>{presskitData.totalVideoViews || 'Sin dato'}</p>
                  </div>
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

              <div className="grid min-h-0 gap-5 overflow-y-auto px-5 py-5" style={{ color: theme.textBgSecondary }}>
                {/* Fila 1: Bio 140 caracteres */}
                {presskitData.twitterBio && (
                  <div className={`pb-5 ${presskitData.twitterBioImage ? 'grid grid-cols-[1fr_auto] gap-4' : ''}`} style={{ borderColor: theme.primaryText + '20', borderBottomWidth: '1px' }}>
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-[0.12em] mb-2" style={{ color: theme.primaryText }}>La Esencia</p>
                      <p className="text-sm leading-7">{presskitData.twitterBio}</p>
                    </div>
                    {presskitData.twitterBioImage ? (
                      <img
                        src={presskitData.twitterBioImage}
                        alt="Bio 140"
                        className="h-24 w-24 rounded-lg object-cover"
                      />
                    ) : null}
                  </div>
                )}

                {/* Fila 2: Bio Corta */}
                {presskitData.bio && (
                  <div className={`pb-5 ${presskitData.bioImage ? 'grid grid-cols-[auto_1fr] gap-4' : ''}`} style={{ borderColor: theme.primaryText + '20', borderBottomWidth: '1px' }}>
                    {presskitData.bioImage ? (
                      <img
                        src={presskitData.bioImage}
                        alt="Bio Corta"
                        className="h-28 w-28 rounded-lg object-cover"
                      />
                    ) : null}
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-[0.12em] mb-2" style={{ color: theme.primaryText }}>Historia</p>
                      <p className="text-sm leading-7" style={{ color: theme.textBgSecondary }}>{presskitData.bio}</p>
                    </div>
                  </div>
                )}

                {/* Fila 3: Entrevistas */}
                {presskitData.interviewLink ? (
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] mb-2" style={{ color: theme.primaryText }}>Entrevista</p>
                    <a
                      href={presskitData.interviewLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex max-w-full rounded-full px-3 py-1 text-xs transition break-all"
                      style={{ borderColor: theme.primaryText + '50', backgroundColor: theme.primaryText + '10', color: theme.primaryText }}
                    >
                      {presskitData.interviewLink}
                    </a>
                  </div>
                ) : null}
              </div>
            </article>

            {/* Página 4: Bio Larga */}
            {presskitData.longBio && (
              <article className="relative mt-6 grid aspect-8.5/11 w-full max-h-[82vh] grid-rows-[auto_1fr] overflow-hidden rounded-[20px]" style={{ backgroundColor: theme.bgHex, borderColor: theme.primaryText + '20', color: theme.textBg, fontFamily: typeface.fontFamily }}>
                {/* Imagen de fondo */}
                {presskitData.longBioImage && (
                  <img
                    src={presskitData.longBioImage}
                    alt="Bio Completa"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                
                {/* Overlay gradient para legibilidad */}
                <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to top, ${theme.bgHex}e6, ${theme.bgHex}88, ${theme.bgHex}66)` }} />
                
                {/* Contenido de texto */}
                <div className="relative z-10 flex h-full flex-col justify-end p-6">
                  <p className="text-xs uppercase tracking-[0.12em] mb-4" style={{ color: theme.primaryText }}>La Visión Completa</p>
                  <div 
                    style={{
                      fontSize: '13px',
                      lineHeight: '1.4',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      display: '-webkit-box',
                      WebkitLineClamp: 28,
                      WebkitBoxOrient: 'vertical',
                      textShadow: `0 2px 8px rgba(0,0,0,0.8)`,
                      whitespace: 'pre-line',
                      color: theme.textBg,
                    }}
                  >
                    {presskitData.longBio}
                  </div>
                </div>
              </article>
            )}

            {/* Página: Releases */}
            {Array.isArray(presskitData.releases) && presskitData.releases.length > 0 && (
              <article className="relative mt-6 grid aspect-8.5/11 w-full max-h-[82vh] grid-rows-[auto_1fr] overflow-hidden rounded-[20px]" style={{ backgroundColor: theme.bgHex, borderColor: theme.primaryText + '20', color: theme.textBg, fontFamily: typeface.fontFamily }}>
                <header className="px-5 py-4" style={{ borderColor: theme.primaryText + '20', borderBottomWidth: '1px' }}>
                  <div className="text-center">
                    <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>Releases</p>
                  </div>
                </header>

                <div className="grid min-h-0 overflow-hidden grid-cols-1">
                  {presskitData.releases.map((release, index) => {
                    const videoId = release.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
                    const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;

                    return (
                      <div key={index} className="grid grid-cols-3 h-full gap-0 border-b" style={{ borderColor: index < presskitData.releases.length - 1 ? theme.primaryText + '20' : 'transparent' }}>
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
            )}

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

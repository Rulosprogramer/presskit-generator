import { useState } from 'react';
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
import { getTheme } from '../../lib/themeColors.js';
import { getTypeface } from '../../lib/typefaces.js';

function LivePreview({ data }) {
  const [webPage, setWebPage] = useState(0);
  const theme = getTheme(data.theme || 'neon');
  const typeface = getTypeface(data.typeface || 'neutral');
  const cover = data.images?.[0];
  const gallery = (data.images || []).slice(1, 5);
  const galleryCollageImages = (data.images || []).slice(1);
  const collageImages = galleryCollageImages.length > 0 ? galleryCollageImages : (cover ? [cover] : []);
  const filledLinks = Object.entries(data.links || {})
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
  const recognitionImage = data.useRecognitionImage ? data.recognitionImage : '';
  const twitterBio = data.twitterBio || '';
  const twitterBioImage = data.twitterBioImage || '';
  const shortBio = data.bio || '';
  const bioImage = data.bioImage || '';
  const longBio = data.longBio || '';
  const longBioImage = data.longBioImage || '';
  const interviewLink = data.interviewLink || '';
  const releases = Array.isArray(data.releases) ? data.releases : [];
  const totalStreams = data.totalStreams || 'Sin dato';
  const totalVideoViews = data.totalVideoViews || 'Sin dato';
  const recognitions = data.recognitions || '';
  const contactArtistName = data.contactArtistName || data.artistName || 'Nombre del artista';
  const managerName = data.managerName || 'No especificado';
  const roadManagerName = data.roadManagerName || 'No especificado';
  const contactCountryCode = data.contactCountryCode || '+57';
  const contactPhone = data.contactPhone || 'No especificado';
  const contactLogo = data.contactLogo || '';

  const previousWebPage = () => setWebPage((current) => (current === 0 ? 7 : current - 1));
  const nextWebPage = () => setWebPage((current) => (current === 7 ? 0 : current + 1));

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <p className="mb-4 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-zinc-300">
        Tu EPK aparecerá aquí en tiempo real
      </p>

      <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>PREVIEW EN VIVO PARA LA WEB</p>
      <div className="relative mt-4 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 shadow-[0_18px_42px_rgba(0,0,0,0.28)]">
        <button
          type="button"
          onClick={previousWebPage}
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full border border-white/20 bg-black/35 px-3 py-2 text-sm font-bold text-white backdrop-blur"
          aria-label="Página anterior"
        >
          {'<'}
        </button>
        <button
          type="button"
          onClick={nextWebPage}
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full border border-white/20 bg-black/35 px-3 py-2 text-sm font-bold text-white backdrop-blur"
          aria-label="Página siguiente"
        >
          {'>'}
        </button>

        {webPage === 0 ? (
          <div className="relative min-h-[380px] overflow-hidden" style={{ fontFamily: typeface.fontFamily }}>
            {cover ? (
              <img src={cover} alt={data.artistName || 'Cover'} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cyan-400/20 via-fuchsia-400/10 to-zinc-900">
                <p className="text-sm text-zinc-300">Sube una portada para ver la preview</p>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent p-5" style={{ fontFamily: typeface.fontFamily }}>
              <p className="text-xs uppercase tracking-[0.16em] text-cyan-200">{data.genre || 'Género'} · {data.city || 'Ciudad'}</p>
              <h3 className="mt-2 text-center text-3xl font-black text-white" style={{ fontFamily: typeface.fontFamily, letterSpacing: typeface.letterSpacing }}>{data.artistName || 'Nombre del artista'}</h3>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <button type="button" className="bg-transparent p-0 text-sm font-black uppercase tracking-[0.28em] text-white">
                PRESS-KIT
              </button>
            </div>
          </div>
        ) : webPage === 1 ? (
          <div className="relative min-h-[380px] p-5" style={{ backgroundColor: theme.bgHex, color: theme.textBg, fontFamily: typeface.fontFamily }}>
            <p className="text-center text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>Reconocimientos y Streams</p>

            {recognitionImage ? (
              <div className="mt-4 grid gap-4 md:grid-cols-[42%_58%]">
                <div className="overflow-hidden rounded-2xl border border-white/15">
                  <img src={recognitionImage} alt="Reconocimientos" className="h-full min-h-[180px] w-full object-cover" />
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-zinc-200">
                  <p className="text-xs uppercase tracking-[0.14em] text-zinc-300">Reconocimientos</p>
                  <p className="mt-2 whitespace-pre-line">{recognitions || 'Añade reconocimientos, escenarios, playlists, becas, festivales o formación para completar esta sección. Si estás empezando y aún no tienes Grammys o premios nacionales, no dejes este espacio vacío.'}</p>
                </div>
              </div>
            ) : recognitions ? (
              <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-zinc-200">
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-300">Reconocimientos</p>
                <p className="mt-2 whitespace-pre-line">{recognitions}</p>
              </div>
            ) : null}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-cyan-200">Total streams</p>
                <p className="mt-2 text-2xl font-black text-white">{totalStreams}</p>
              </div>
              <div className="rounded-2xl border border-fuchsia-300/30 bg-fuchsia-300/10 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-fuchsia-200">Total video views</p>
                <p className="mt-2 text-2xl font-black text-white">{totalVideoViews}</p>
              </div>
            </div>

          </div>
        ) : webPage === 2 ? (
          <div className="relative min-h-[380px] p-5" style={{ backgroundColor: theme.bgHex, color: theme.textBg, fontFamily: typeface.fontFamily }}>
            <div className="text-center mb-6">
              <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>CONOCE A</p>
              <h3 className="mt-2 text-3xl font-black" style={{ fontFamily: typeface.fontFamily, letterSpacing: typeface.letterSpacing, color: theme.textBg }}>{data.artistName || 'Nombre del artista'}</h3>
            </div>

            <div className="space-y-5" style={{ color: theme.textBgSecondary }}>
              {/* Fila 1: Bio 140 caracteres */}
              {twitterBio && (
                <div className={`border-b pb-5 ${twitterBioImage ? 'grid grid-cols-[1fr_auto] gap-4' : ''}`} style={{ borderColor: theme.primaryText + '30' }}>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.12em] mb-2" style={{ color: theme.primaryText }}>La Esencia</p>
                    <p className="text-sm leading-7">{twitterBio}</p>
                  </div>
                  {twitterBioImage ? (
                    <img
                      src={twitterBioImage}
                      alt="Bio 140"
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  ) : null}
                </div>
              )}

              {/* Fila 2: Bio Corta */}
              {shortBio && (
                <div className={`border-b pb-5 ${bioImage ? 'grid grid-cols-[auto_1fr] gap-4' : ''}`} style={{ borderColor: theme.primaryText + '30' }}>
                  {bioImage ? (
                    <img
                      src={bioImage}
                      alt="Bio Corta"
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                  ) : null}
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-[0.12em] mb-2" style={{ color: theme.primaryText }}>Historia</p>
                    <p className="text-sm leading-7">{shortBio}</p>
                  </div>
                </div>
              )}

              {/* Fila 3: Entrevistas */}
              {interviewLink ? (
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] mb-2" style={{ color: theme.primaryText }}>Entrevista</p>
                  <a
                    href={interviewLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex max-w-full rounded-full px-4 py-2 text-xs transition break-all"
                    style={{ borderColor: theme.primaryText + '50', backgroundColor: theme.primaryText + '10', color: theme.primaryText }}
                  >
                    {interviewLink}
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        ) : webPage === 3 ? (
          <div className="relative min-h-[380px] flex flex-col overflow-hidden rounded-3xl" style={{ backgroundColor: theme.bgHex, fontFamily: typeface.fontFamily }}>
            {/* Bio Larga con foto de fondo */}
            {longBio ? (
              <>
                {longBioImage && (
                  <img
                    src={longBioImage}
                    alt="Bio Completa"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to top, ${theme.bgHex}dd, ${theme.bgHex}88, ${theme.bgHex}44)` }} />
                <div className="relative z-10 flex h-full flex-col justify-end p-5">
                  <p className="text-xs uppercase tracking-[0.12em] mb-3" style={{ color: theme.primaryText }}>La Visión Completa</p>
                  <div
                    className="leading-snug text-white whitespace-pre-line"
                    style={{
                      fontSize: 'clamp(12px, 2.2vw, 16px)',
                      lineHeight: '1.4',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                    }}
                  >
                    {longBio}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-center text-sm" style={{ color: theme.textBgSecondary }}>
                Añade una biografía larga para completar esta página.
              </div>
            )}
          </div>
        ) : webPage === 4 ? (
          <div className="relative flex flex-col overflow-hidden rounded-3xl" style={{ backgroundColor: theme.bgHex, color: theme.textBg, fontFamily: typeface.fontFamily }}>
            <div className="p-5 text-center">
              <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>Releases</p>
            </div>
            <div className="flex-1 grid grid-cols-1 gap-0 overflow-y-auto">
              {releases.length > 0 ? releases.map((release, index) => {
                const videoId = release.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
                const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;

                return (
                  <div key={index} className="flex h-auto min-h-[120px] border-b" style={{ borderColor: index < data.releases.length - 1 ? theme.primaryText + '20' : 'transparent' }}>
                    {/* Izquierda: Thumbnail con play */}
                    <div className="relative flex items-center justify-center p-3 w-1/3 flex-shrink-0" style={{ borderColor: theme.primaryText + '20', borderRightWidth: '1px' }}>
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
                    <div className="flex flex-col justify-between p-3 flex-1 w-2/3">
                      <div>
                        <p className="text-sm font-bold line-clamp-2" style={{ color: theme.textBg }}>{release.title}</p>
                        {release.description && (
                          <p className="text-xs mt-1 line-clamp-2" style={{ color: theme.textBgSecondary }}>{release.description}</p>
                        )}
                      </div>
                      {release.author && (
                        <p className="text-xs font-semibold" style={{ color: theme.primaryText }}>{release.author}</p>
                      )}
                    </div>
                  </div>
                );
              }) : (
                <div className="flex h-full items-center justify-center p-6 text-center text-sm" style={{ color: theme.textBgSecondary }}>
                  Añade releases para ver esta página.
                </div>
              )}
            </div>
          </div>
        ) : webPage === 5 ? (
          <div className="relative min-h-[380px] overflow-hidden rounded-3xl p-5" style={{ backgroundColor: theme.bgHex, color: theme.textBg, fontFamily: typeface.fontFamily }}>
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>CONECTA CON</p>
              <h3 className="mt-2 text-3xl font-black" style={{ color: theme.textBg, fontFamily: typeface.fontFamily }}>{data.artistName || 'Nombre del artista'}</h3>
            </div>

            {filledLinks.length > 0 ? (
              <div className="mt-5 grid grid-cols-3 gap-3 auto-rows-fr">
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
                      key={`${key}-${index}`}
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${spanClass} rounded-2xl border p-4 transition hover:scale-[1.01]`}
                      style={{
                        borderColor: theme.primaryText + '40',
                        backgroundColor: theme.primaryText + '12',
                      }}
                    >
                      <div className="flex h-full flex-col justify-between gap-3">
                        <div className="h-20 w-full overflow-hidden rounded-xl" style={{ backgroundColor: theme.primaryText + '12' }}>
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
            ) : (
              <div className="mt-6 flex items-center justify-center rounded-2xl border p-6 text-center text-sm" style={{ borderColor: theme.primaryText + '30', color: theme.textBgSecondary }}>
                Añade links para generar esta página.
              </div>
            )}
          </div>
        ) : webPage === 6 ? (
          <div className="relative min-h-[380px] overflow-hidden rounded-3xl" style={{ backgroundColor: theme.bgHex, color: theme.textBg, fontFamily: typeface.fontFamily }}>
            <div className="px-5 py-4 text-center">
              <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>GALERÍA VISUAL</p>
            </div>
            {collageImages.length > 0 ? (
              <div className="grid grid-cols-3 auto-rows-[120px] gap-0">
                {collageImages.map((image, index) => (
                  <div key={`collage-web-${index}`} className={getCollageSpanClass(index, collageImages.length)}>
                    <img src={image} alt={`Galería ${index + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full min-h-[300px] items-center justify-center p-6 text-center text-sm" style={{ color: theme.textBgSecondary }}>
                Añade imágenes para generar esta galería.
              </div>
            )}
          </div>
        ) : webPage === 7 ? (
          <div className="relative min-h-[380px] overflow-hidden rounded-3xl p-5" style={{ backgroundColor: theme.bgHex, color: theme.textBg, fontFamily: typeface.fontFamily }}>
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>CONTACTO</p>
              <h3 className="mt-2 text-3xl font-black" style={{ color: theme.textBg }}>{contactArtistName}</h3>
            </div>

            {contactLogo ? (
              <div className="mt-4 flex justify-center">
                <img src={contactLogo} alt="Logo de contacto" className="h-auto w-auto max-h-16 max-w-[220px] object-contain" />
              </div>
            ) : null}

            <div className="mt-6 grid gap-3">
              <div className="rounded-2xl border p-4" style={{ borderColor: theme.primaryText + '35', backgroundColor: theme.primaryText + '10' }}>
                <p className="text-xs uppercase tracking-[0.12em]" style={{ color: theme.primaryText }}>Manager</p>
                <p className="mt-1 text-lg font-semibold" style={{ color: theme.textBg }}>{managerName}</p>
              </div>
              <div className="rounded-2xl border p-4" style={{ borderColor: theme.primaryText + '35', backgroundColor: theme.primaryText + '10' }}>
                <p className="text-xs uppercase tracking-[0.12em]" style={{ color: theme.primaryText }}>Road Manager</p>
                <p className="mt-1 text-lg font-semibold" style={{ color: theme.textBg }}>{roadManagerName}</p>
              </div>
              <div className="rounded-2xl border p-4" style={{ borderColor: theme.primaryText + '35', backgroundColor: theme.primaryText + '10' }}>
                <p className="text-xs uppercase tracking-[0.12em]" style={{ color: theme.primaryText }}>Contacto</p>
                <p className="mt-1 text-lg font-semibold" style={{ color: theme.textBg }}>{contactCountryCode} {contactPhone}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative min-h-[380px] flex items-center justify-center overflow-hidden rounded-3xl p-6 text-center text-sm" style={{ backgroundColor: theme.bgHex, color: theme.textBgSecondary, fontFamily: typeface.fontFamily }}>
            Página no disponible.
          </div>
        )}
      </div>

      <p className="mt-7 text-xs uppercase tracking-[0.16em]" style={{ color: theme.secondaryText }}>PREVIEW EN VIVO PARA DESCARGAR</p>
      <div className="mt-4 h-[620px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/80 shadow-[0_18px_42px_rgba(0,0,0,0.28)] md:h-[680px]">
        <div className="flex h-full items-start justify-center overflow-y-auto p-4">
          <div className="flex flex-col items-center gap-6">
            <article className="relative flex aspect-[8.5/11] w-[360px] max-w-full origin-top scale-[0.86] flex-col overflow-hidden rounded-[20px] sm:scale-[0.95] lg:scale-100" style={{ backgroundColor: theme.bgHex, borderColor: theme.primaryText + '20', borderWidth: '1px', color: theme.textBg }}>
              <div className="absolute inset-0">
                {cover ? (
                  <img src={cover} alt={data.artistName || 'Cover'} className="h-full w-full object-cover" />
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
                  <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>{data.genre || 'Género'} · {data.city || 'Ciudad'}</p>
                  <h3 className="text-center text-2xl font-black" style={{ fontFamily: typeface.fontFamily }}>{data.artistName || 'Nombre del artista'}</h3>
                </div>
              </div>
            </article>

            <article className="relative flex aspect-[8.5/11] w-[360px] max-w-full origin-top scale-[0.86] flex-col overflow-hidden rounded-[20px] sm:scale-[0.95] lg:scale-100" style={{ backgroundColor: theme.bgHex, borderColor: theme.primaryText + '20', borderWidth: '1px', color: theme.textBg }}>
              <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to bottom, ${theme.bgHex}40 0%, ${theme.primaryText}15 50%, ${theme.bgHex}66 100%)` }} />

              <div className="relative z-10 flex h-full flex-col px-5 py-5">
                <p className="text-center text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>Reconocimientos y Streams</p>

                {recognitionImage ? (
                  <div className="mt-4 grid min-h-0 flex-1 gap-5 md:grid-cols-[42%_58%] md:items-start">
                    <img src={recognitionImage} alt="Reconocimientos" className="h-full min-h-[180px] w-full rounded-2xl object-cover" />
                    <div className="pt-1 text-sm leading-7" style={{ color: theme.textBgSecondary }}>
                      <p className="text-xs uppercase tracking-[0.14em]" style={{ color: theme.primaryText }}>Reconocimientos</p>
                      <p className="mt-3 whitespace-pre-line">{recognitions || 'Añade reconocimientos, escenarios, playlists, becas, festivales o formación para completar esta sección. Si estás empezando y aún no tienes Grammys o premios nacionales, no dejes este espacio vacío.'}</p>
                    </div>
                  </div>
                ) : recognitions ? (
                  <div className="mt-4 flex-1 text-sm leading-7" style={{ color: theme.textBgSecondary }}>
                    <p className="text-xs uppercase tracking-[0.14em]" style={{ color: theme.primaryText }}>Reconocimientos</p>
                    <p className="mt-3 whitespace-pre-line">{recognitions}</p>
                  </div>
                ) : null}

                <div className="mt-auto grid gap-3 pt-4 sm:grid-cols-2" style={{ borderColor: theme.primaryText + '20', borderTopWidth: '1px' }}>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em]" style={{ color: theme.primaryText }}>Total streams</p>
                    <p className="mt-2 text-2xl font-black" style={{ color: theme.textBg }}>{totalStreams}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em]" style={{ color: theme.primaryText }}>Total video views</p>
                    <p className="mt-2 text-2xl font-black" style={{ color: theme.textBg }}>{totalVideoViews}</p>
                  </div>
                </div>

              </div>
            </article>

            <article className="relative flex aspect-[8.5/11] w-[360px] max-w-full origin-top scale-[0.86] flex-col overflow-hidden rounded-[20px] sm:scale-[0.95] lg:scale-100" style={{ backgroundColor: theme.bgHex, borderColor: theme.primaryText + '20', borderWidth: '1px', color: theme.textBg, fontFamily: typeface.fontFamily }}>
              <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to bottom, ${theme.bgHex}80, ${theme.bgHex}40, ${theme.bgHex}60)` }} />

              <div className="relative z-10 flex h-full flex-col p-4">
                <div className="text-center mb-3">
                  <p className="text-xs uppercase tracking-[0.18em]" style={{ color: theme.primaryText }}>CONOCE A</p>
                  <h3 className="mt-1 text-2xl font-black" style={{ fontFamily: typeface.fontFamily, color: theme.textBg }}>{data.artistName || 'Nombre del artista'}</h3>
                </div>

                <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-3">
                  {/* Fila 1: Bio 140 caracteres */}
                  {twitterBio && (
                    <div className={`pb-3 min-h-0 ${twitterBioImage ? 'grid grid-cols-[1fr_auto] gap-2' : ''}`} style={{ borderColor: theme.primaryText + '20', borderBottomWidth: '1px' }}>
                      <div className="flex-1 min-h-0 overflow-hidden">
                        <p className="text-xs uppercase tracking-[0.12em] mb-1 truncate" style={{ color: theme.primaryText }}>La Esencia</p>
                        <p 
                          style={{
                            fontSize: 'clamp(7px, 1.5vw, 10px)',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 'tight',
                            color: theme.textBgSecondary,
                          }}
                        >
                          {twitterBio}
                        </p>
                      </div>
                      {twitterBioImage ? (
                        <img
                          src={twitterBioImage}
                          alt="Bio 140"
                          className="h-14 w-14 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : null}
                    </div>
                  )}

                  {/* Fila 2: Bio Corta */}
                  {shortBio && (
                    <div className={`pb-3 min-h-0 ${bioImage ? 'grid grid-cols-[auto_1fr] gap-2' : ''}`} style={{ borderColor: theme.primaryText + '20', borderBottomWidth: '1px' }}>
                      {bioImage ? (
                        <img
                          src={bioImage}
                          alt="Bio Corta"
                          className="h-14 w-14 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : null}
                      <div className="flex-1 min-h-0 overflow-hidden">
                        <p className="text-xs uppercase tracking-[0.12em] mb-1 truncate" style={{ color: theme.primaryText }}>Historia</p>
                        <p 
                          style={{
                            fontSize: 'clamp(7px, 1.5vw, 10px)',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 'tight',
                            color: theme.textBgSecondary,
                          }}
                        >
                          {shortBio}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Fila 3: Entrevistas */}
                  {interviewLink ? (
                    <div className="min-h-0 overflow-hidden">
                      <p className="text-xs uppercase tracking-[0.12em] mb-1 truncate" style={{ color: theme.primaryText }}>Entrevista</p>
                      <a
                        href={interviewLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex max-w-full rounded-full px-2 py-1 text-xs transition truncate"
                        style={{ borderColor: theme.primaryText + '50', backgroundColor: theme.primaryText + '10', color: theme.primaryText }}
                      >
                        {interviewLink}
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>

            {/* Bio Larga */}
            {longBio && (
              <article className="relative flex aspect-[8.5/11] w-[360px] max-w-full origin-top scale-[0.86] flex-col overflow-hidden rounded-[20px] sm:scale-[0.95] lg:scale-100" style={{ backgroundColor: theme.bgHex, borderColor: theme.primaryText + '20', borderWidth: '1px', color: theme.textBg, fontFamily: typeface.fontFamily }}>
                {/* Imagen de fondo */}
                {longBioImage && (
                  <img
                    src={longBioImage}
                    alt="Bio Completa"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                
                {/* Overlay gradient para legibilidad */}
                <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to top, ${theme.bgHex}e6, ${theme.bgHex}88, ${theme.bgHex}66)` }} />
                
                {/* Contenido de texto */}
                <div className="relative z-10 flex h-full flex-col justify-end p-4">
                  <p className="text-xs uppercase tracking-[0.12em] mb-3" style={{ color: theme.primaryText }}>La Visión Completa</p>
                  <div 
                    style={{
                      fontSize: '10px',
                      lineHeight: '1.3',
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      display: '-webkit-box',
                      WebkitLineClamp: 25,
                      WebkitBoxOrient: 'vertical',
                      textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                      color: theme.textBg,
                    }}
                  >
                    {longBio}
                  </div>
                </div>
              </article>
            )}

            {/* Releases */}
            {releases.length > 0 && (
              <article className="relative flex aspect-[8.5/11] w-[360px] max-w-full origin-top scale-[0.86] flex-col overflow-hidden rounded-[20px] sm:scale-[0.95] lg:scale-100" style={{ backgroundColor: theme.bgHex, borderColor: theme.primaryText + '20', borderWidth: '1px', color: theme.textBg, fontFamily: typeface.fontFamily }}>
                <div className="p-4 text-center" style={{ borderBottomWidth: '1px', borderColor: theme.primaryText + '20' }}>
                  <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>Releases</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {releases.map((release, index) => {
                    const videoId = release.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
                    const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;

                    return (
                      <div key={`${index}-${release.title}`} className="grid grid-cols-3 gap-0 border-b" style={{ borderColor: index < releases.length - 1 ? theme.primaryText + '20' : 'transparent', minHeight: '120px' }}>
                        <div className="relative col-span-1 p-2" style={{ borderRightWidth: '1px', borderColor: theme.primaryText + '20' }}>
                          {thumbnail ? (
                            <>
                              <img src={thumbnail} alt={release.title} className="h-full w-full rounded-lg object-cover" />
                              <a
                                href={release.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-2 flex items-center justify-center rounded-lg transition hover:bg-black/30"
                              >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-sm text-black">▶</div>
                              </a>
                            </>
                          ) : (
                            <div className="flex h-full w-full items-center justify-center rounded-lg text-xs" style={{ backgroundColor: theme.primaryText + '15', color: theme.textBgSecondary }}>
                              Sin video
                            </div>
                          )}
                        </div>
                        <div className="col-span-2 flex flex-col justify-between p-3">
                          <div>
                            <p className="text-sm font-bold line-clamp-2" style={{ color: theme.textBg }}>{release.title}</p>
                            {release.description ? (
                              <p className="mt-1 text-xs line-clamp-3" style={{ color: theme.textBgSecondary }}>{release.description}</p>
                            ) : null}
                          </div>
                          {release.author ? (
                            <p className="text-xs font-semibold" style={{ color: theme.primaryText }}>{release.author}</p>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            )}

            {filledLinks.length > 0 && (
              <article className="relative flex aspect-[8.5/11] w-[360px] max-w-full origin-top scale-[0.86] flex-col overflow-hidden rounded-[20px] sm:scale-[0.95] lg:scale-100" style={{ backgroundColor: theme.bgHex, borderColor: theme.primaryText + '20', borderWidth: '1px', color: theme.textBg, fontFamily: typeface.fontFamily }}>
                <div className="px-4 pt-5 text-center">
                  <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>CONECTA CON</p>
                  <h3 className="mt-2 text-2xl font-black" style={{ color: theme.textBg }}>{data.artistName || 'Nombre del artista'}</h3>
                </div>

                <div className="grid flex-1 grid-cols-3 gap-2 p-4">
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
                        key={`pdf-link-${key}-${index}`}
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${spanClass} rounded-xl border p-3`}
                        style={{ borderColor: theme.primaryText + '35', backgroundColor: theme.primaryText + '10' }}
                      >
                        <div className="flex h-full flex-col justify-between gap-2">
                          <div className="h-12 w-full overflow-hidden rounded-lg" style={{ backgroundColor: theme.primaryText + '12' }}>
                            {avatarUrl ? (
                              <img src={avatarUrl} alt={socialName} className="h-full w-full object-cover" />
                            ) : null}
                          </div>
                          <div className="flex h-7 w-7 items-center justify-center rounded-full" style={{ backgroundColor: theme.primaryText + '30', color: theme.textBg }}>
                            <Icon className="text-sm" />
                          </div>
                          <div>
                            <p className="text-lg font-black leading-none" style={{ color: theme.textBg }}>{socialName}</p>
                            <p className="mt-1 text-[10px]" style={{ color: theme.textBgSecondary }}>{domain}</p>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </article>
            )}

            {collageImages.length > 0 && (
              <article className="relative flex aspect-[8.5/11] w-[360px] max-w-full origin-top scale-[0.86] flex-col overflow-hidden rounded-[20px] sm:scale-[0.95] lg:scale-100" style={{ backgroundColor: theme.bgHex, borderColor: theme.primaryText + '20', borderWidth: '1px', color: theme.textBg, fontFamily: typeface.fontFamily }}>
                <div className="px-4 py-4 text-center" style={{ borderBottomWidth: '1px', borderColor: theme.primaryText + '20' }}>
                  <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>GALERÍA VISUAL</p>
                </div>
                <div className="grid flex-1 grid-cols-3 auto-rows-[80px] gap-0">
                  {collageImages.map((image, index) => (
                    <div key={`collage-pdf-live-${index}`} className={getCollageSpanClass(index, collageImages.length)}>
                      <img src={image} alt={`Galería ${index + 1}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </article>
            )}

            <article className="relative flex aspect-[8.5/11] w-[360px] max-w-full origin-top scale-[0.86] flex-col overflow-hidden rounded-[20px] sm:scale-[0.95] lg:scale-100" style={{ backgroundColor: theme.bgHex, borderColor: theme.primaryText + '20', borderWidth: '1px', color: theme.textBg, fontFamily: typeface.fontFamily }}>
              <div className="px-4 py-4 text-center" style={{ borderBottomWidth: '1px', borderColor: theme.primaryText + '20' }}>
                <p className="text-xs uppercase tracking-[0.16em]" style={{ color: theme.primaryText }}>CONTACTO</p>
                <h3 className="mt-2 text-2xl font-black" style={{ color: theme.textBg }}>{contactArtistName}</h3>
                {contactLogo ? (
                  <div className="mt-3 flex justify-center">
                    <img src={contactLogo} alt="Logo de contacto" className="h-auto w-auto max-h-10 max-w-[160px] object-contain" />
                  </div>
                ) : null}
              </div>

              <div className="grid flex-1 gap-3 p-4">
                <div className="rounded-xl border p-3" style={{ borderColor: theme.primaryText + '35', backgroundColor: theme.primaryText + '10' }}>
                  <p className="text-[10px] uppercase tracking-[0.12em]" style={{ color: theme.primaryText }}>Manager</p>
                  <p className="mt-1 text-base font-semibold" style={{ color: theme.textBg }}>{managerName}</p>
                </div>
                <div className="rounded-xl border p-3" style={{ borderColor: theme.primaryText + '35', backgroundColor: theme.primaryText + '10' }}>
                  <p className="text-[10px] uppercase tracking-[0.12em]" style={{ color: theme.primaryText }}>Road Manager</p>
                  <p className="mt-1 text-base font-semibold" style={{ color: theme.textBg }}>{roadManagerName}</p>
                </div>
                <div className="rounded-xl border p-3" style={{ borderColor: theme.primaryText + '35', backgroundColor: theme.primaryText + '10' }}>
                  <p className="text-[10px] uppercase tracking-[0.12em]" style={{ color: theme.primaryText }}>Contacto</p>
                  <p className="mt-1 text-base font-semibold" style={{ color: theme.textBg }}>{contactCountryCode} {contactPhone}</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LivePreview;

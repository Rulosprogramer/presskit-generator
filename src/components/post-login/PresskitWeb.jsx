// Componente para manejar el botón de descarga con touch en móvil y hover en desktop
function GalleryImage({ image, title, gridClass, artistName, index }) {
  const [showDownload, setShowDownload] = useState(false);

  // Detecta si es móvil
  const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 640px)').matches;

  // Handlers para touch
  const handleTouchStart = () => {
    if (isMobile) setShowDownload(true);
  };
  const handleTouchEnd = () => {
    if (isMobile) setTimeout(() => setShowDownload(false), 2000);
  };

  // Nombres personalizados por tipo (sin banner)
  const fileNames = [
    `epk-official-press-photo-${artistName}.jpg`,
    `epk-flyer-ready-${artistName}.jpg`,
    `epk-live-performance-${artistName}.jpg`,
    `epk-esencia-${artistName}.jpg`,
  ];
  const fileName = fileNames[index] || `epk-img-${artistName}.jpg`;

  return (
    <div
      className={`relative flex flex-col items-stretch justify-end overflow-hidden rounded-xl border-4 border-white bg-zinc-900 shadow-lg group ${gridClass}`}
      style={{ minHeight: '140px' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => !isMobile && setShowDownload(true)}
      onMouseLeave={() => !isMobile && setShowDownload(false)}
    >
      <img
        src={image}
        alt={title}
        className={`absolute inset-0 h-full w-full object-cover ${index === 1 ? 'object-top' : 'object-center'} z-0`}
        style={{ filter: 'brightness(0.98)' }}
      />
      <div className="relative z-10 flex flex-col justify-end h-full w-full p-3 bg-linear-to-t from-black/60 via-black/10 to-transparent">
        <div className="backdrop-blur-sm bg-black/40 rounded-lg px-2 py-1 w-fit border border-white/60 mx-auto mb-2 sm:block hidden">
          <span className="block text-xs font-bold uppercase tracking-wider text-white text-center drop-shadow-lg">
            {title}
          </span>
        </div>
        <div className="mx-auto mb-2 block sm:hidden">
          <span className="block text-xs font-bold uppercase tracking-wider text-white text-center">{title}</span>
        </div>
        {(showDownload || (!isMobile && undefined)) && (
          <a
            href={image}
            download
className={`pointer-events-auto absolute bottom-3 right-3 rounded-full border border-white/30 bg-gradient-to-r from-transparent via-white/20 to-transparent backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-lg transition-all duration-300 hover:bg-white/30 hover:shadow-xl hover:scale-105 hover:tracking-[0.2em] focus:opacity-100 ${showDownload || !isMobile ? 'opacity-100 scale-105' : 'opacity-0 group-hover:opacity-100'}`}
            title="Descargar imagen"
            onClick={async (e) => {
              e.preventDefault();
              try {
                const response = await fetch(image, { mode: 'cors' });
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName.replace(/\s+/g, '-').toLowerCase();
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
              } catch (err) {
                console.error('Error descargando imagen:', err);
              }
            }}
          >
            Descargar
          </a>
        )}
      </div>
    </div>
  );
}

function ContactLogo({ image, artistName }) {
  const [showDownload, setShowDownload] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 640px)').matches;

  const handleTouchStart = () => {
    if (isMobile) setShowDownload(true);
  };
  const handleTouchEnd = () => {
    if (isMobile) setTimeout(() => setShowDownload(false), 2000);
  };

  const fileName = `epk-logo-${artistName}`;

  return (
    <div
      className="relative h-full w-full flex items-center justify-center group"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => !isMobile && setShowDownload(true)}
      onMouseLeave={() => !isMobile && setShowDownload(false)}
    >
      <img src={image} alt="Logo de contacto" className="h-full w-full object-contain" />
      {showDownload && (
        <button
          type="button"
          className="absolute bottom-2 right-2 rounded-full border border-white/30 bg-black/60 backdrop-blur-sm px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-black/80 hover:scale-105 active:scale-95 cursor-pointer"
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
              const response = await fetch(image, { mode: 'cors' });
              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = fileName.replace(/\s+/g, '-').toLowerCase();
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            } catch (err) {
              console.error('Error descargando logo:', err);
            }
          }}
        >
          Descargar Logo
        </button>
      )}
    </div>
  );
}
import { useEffect, useMemo, useRef, useState } from 'react';
import { getTheme } from '../../lib/themeColors.js';
import {
  SiApplemusic,
  SiFacebook,
  SiInstagram,
  SiSoundcloud,
  SiSpotify,
  SiTiktok,
  SiYoutube,
} from 'react-icons/si';
import { FaLink } from 'react-icons/fa';

function chunkArray(list, size) {
  const chunks = [];
  for (let i = 0; i < list.length; i += size) {
    chunks.push(list.slice(i, i + size));
  }
  return chunks;
}

function getYoutubeThumbnailUrl(url) {
  if (!url) return '';
  const match = String(url).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  const videoId = match?.[1];
  return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';
}

function getCollageSpanClass(index, total) {
  if (total <= 1) return 'col-span-4 row-span-4';
  if (total === 2) return index === 0 ? 'col-span-2 row-span-4' : 'col-span-2 row-span-4';
  if (total === 3) return ['col-span-2 row-span-2', 'col-span-2 row-span-2', 'col-span-4 row-span-2'][index] || 'col-span-2 row-span-2';

  const pattern = [
    'col-span-2 row-span-2',
    'col-span-2 row-span-1',
    'col-span-1 row-span-2',
    'col-span-1 row-span-1',
    'col-span-2 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-2 row-span-1',
  ];

  return pattern[index % pattern.length];
}

function getGalleryEditorialSpanClass(index) {
  const pattern = [
    'col-span-6 row-span-3',
    'col-span-3 row-span-2',
    'col-span-3 row-span-2',
    'col-span-4 row-span-2',
    'col-span-4 row-span-3',
    'col-span-4 row-span-2',
    'col-span-3 row-span-2',
    'col-span-6 row-span-3',
    'col-span-3 row-span-2',
    'col-span-3 row-span-2',
    'col-span-4 row-span-2',
    'col-span-4 row-span-2',
  ];

  return pattern[index % pattern.length];
}

function getGalleryResponsiveSpanClass(index) {
  const pattern = [
    'col-span-6 row-span-4 md:[grid-column:1/7] md:[grid-row:1/5]',
    'col-span-3 row-span-3 md:[grid-column:7/13] md:[grid-row:1/4]',
    'col-span-3 row-span-3 md:[grid-column:7/13] md:[grid-row:4/7]',
    'col-span-6 row-span-3 md:[grid-column:1/9] md:[grid-row:5/8]',
    'col-span-3 row-span-4 md:[grid-column:9/13] md:[grid-row:5/9]',
    'col-span-3 row-span-3 md:[grid-column:1/5] md:[grid-row:8/11]',
    'col-span-6 row-span-4 md:[grid-column:5/13] md:[grid-row:8/12]',
    'col-span-3 row-span-3 md:[grid-column:1/5] md:[grid-row:11/14]',
    'col-span-3 row-span-3 md:[grid-column:5/9] md:[grid-row:12/15]',
    'col-span-6 row-span-4 md:[grid-column:9/13] md:[grid-row:12/16]',
    'col-span-3 row-span-3 md:[grid-column:1/7] md:[grid-row:14/17]',
    'col-span-3 row-span-3 md:[grid-column:7/13] md:[grid-row:16/19]',
  ];

  return pattern[index % pattern.length];
}

function createEmptyArtistMilestones() {
  return {
    digital: [],
    live: [],
    press: [],
    collaborations: [],
  };
}

function normalizeArtistMilestones(value) {
  const empty = createEmptyArtistMilestones();

  return Object.keys(empty).reduce((accumulator, key) => {
    accumulator[key] = Array.isArray(value?.[key])
      ? value[key]
          .map((item) => String(item || '').trim())
          .filter(Boolean)
          .slice(0, 3)
      : [];
    return accumulator;
  }, empty);
}

function PresskitWeb({ presskitData, mode = 'full' }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const [turnDirection, setTurnDirection] = useState(1);
  const jumpIntervalRef = useRef(null);
  const isCompact = mode === 'compact';
  const isEmbedded = mode === 'embedded';
  const pageViewportClass = isCompact
    ? 'aspect-[9/16] w-full sm:aspect-auto sm:h-96'
    : isEmbedded
      ? 'aspect-[9/16] w-full sm:aspect-auto sm:h-[clamp(19rem,44vw,30rem)]'
      : 'aspect-[9/16] w-full sm:aspect-auto sm:h-[62vh] lg:h-[86vh]';
  const theme = getTheme(presskitData.theme || 'neon');

  const cover = presskitData.images?.[0] || '';
  const gallery = Array.isArray(presskitData.images) ? presskitData.images.slice(1, 6).filter(Boolean) : [];
  const artistName = presskitData.artistName || 'Nombre del artista';
  const genre = presskitData.genre || 'Genero';
  const city = presskitData.city || 'Ciudad';
  const performanceLiveLink = presskitData.performanceLiveLink || '';
  const performanceLiveThumbnail = getYoutubeThumbnailUrl(performanceLiveLink);
  const totalStreams = presskitData.totalStreams || 'Sin dato';
  const totalVideoViews = presskitData.totalVideoViews || 'Sin dato';
  const recognitions = presskitData.recognitions || '';
  const recognitionImage = presskitData.useRecognitionImage ? presskitData.recognitionImage : '';
  const twitterBio = presskitData.twitterBio || '';
  const twitterBioImage = presskitData.twitterBioImage || '';
  const shortBio = presskitData.bio || '';
  const bioImage = presskitData.bioImage || '';
  const longBio = presskitData.longBio || '';
  const longBioImage = presskitData.longBioImage || '';
  const artistMilestones = normalizeArtistMilestones(presskitData.artistMilestones);
  const milestoneItems = [
    ...(artistMilestones.digital || []),
    ...(artistMilestones.live || []),
    ...(artistMilestones.press || []),
    ...(artistMilestones.collaborations || []),
  ].slice(0, 8);
  const milestoneTextSizeClass = isEmbedded
    ? 'text-[clamp(0.68rem,0.9vw,0.88rem)] leading-[clamp(1rem,1.35vw,1.3rem)]'
    : 'text-[clamp(0.82rem,1.15vw,1.05rem)] leading-[clamp(1.15rem,1.6vw,1.55rem)]';
  const releases = Array.isArray(presskitData.releases) ? presskitData.releases : [];
  const releasesCtaText = presskitData.releasesCtaText ?? `Dale play y disfruta los videos que estan marcando el camino de ${artistName}.`;
  const linkMetrics = presskitData.linkMetrics || {};
  const linkScreenshots = presskitData.linkScreenshots || {};
  const platformConfig = {
    spotify: { label: 'Spotify', Icon: SiSpotify },
    instagram: { label: 'Instagram', Icon: SiInstagram },
    youtube: { label: 'YouTube', Icon: SiYoutube },
    tiktok: { label: 'TikTok', Icon: SiTiktok },
    facebook: { label: 'Facebook', Icon: SiFacebook },
    appleMusic: { label: 'Apple Music', Icon: SiApplemusic },
    soundcloud: { label: 'SoundCloud', Icon: SiSoundcloud },
  };
  const links = Object.keys(platformConfig)
    .map((key) => ({
      key,
      url: presskitData.links?.[key] || '',
      metric: linkMetrics[key] || '',
      screenshot: linkScreenshots[key] || '',
      label: platformConfig[key].label,
      Icon: platformConfig[key].Icon,
    }))
    .filter((item) => item.url)
    .slice(0, 8);
  const linkSlots = [
    { key: 'instagram', gridColumn: '3 / 15', gridRow: '2 / 13' },
    { key: 'spotify', gridColumn: '15 / 22', gridRow: '3 / 13' },
    { key: 'facebook', gridColumn: '2 / 13', gridRow: '13 / 24' },
    { key: 'youtube', gridColumn: '13 / 24', gridRow: '13 / 25' },
    { key: 'tiktok', gridColumn: '4 / 13', gridRow: '24 / 36' },
    { key: 'appleMusic', gridColumn: '13 / 17', gridRow: '25 / 34' },
    { key: 'soundcloud', gridColumn: '17 / 23', gridRow: '25 / 35' },
  ];
  const linksByKey = Object.fromEntries(links.map((item) => [item.key, item]));
  const linksCollageImages = (gallery.length ? gallery : cover ? [cover] : []).slice(0, 8);
  const contactArtistName = presskitData.contactArtistName || artistName;
  const managerName = presskitData.managerName || '';
  const roadManagerName = presskitData.roadManagerName || '';
  const contactPhone = `${presskitData.contactCountryCode || '+57'} ${presskitData.contactPhone || ''}`.trim();
  const contactLogo = presskitData.contactLogo || '';

  const webPages = useMemo(() => {
    const pages = [];

    pages.push({
      type: 'cover',
      title: 'Portada',
    });

    if (presskitData.artistName || presskitData.genre || presskitData.city) {
      pages.push({
        type: 'artist',
        title: 'Datos del artista',
      });
    }

    if (recognitions || recognitionImage || presskitData.totalStreams || presskitData.totalVideoViews) {
      pages.push({
        type: 'highlights',
        title: 'Reconocimientos y streams',
      });
    }

    const bioBlocks = [
      { key: 'twitter', title: 'Bio 140', content: twitterBio },
      { key: 'long', title: 'Bio larga', content: longBio },
    ].filter((item) => item.content);

    bioBlocks.forEach((block) => {
      pages.push({
        type: 'bio',
        title: block.key === 'twitter' ? 'Biografia' : `Biografia · ${block.title}`,
        payload: block,
      });
    });

    chunkArray(releases, 4).forEach((releaseChunk, index) => {
      pages.push({
        type: 'releases',
        title: `Video Releases ${index + 1}`,
        payload: releaseChunk,
      });
    });

    if (links.length > 0) {
      pages.push({
        type: 'links',
        title: 'Links',
        payload: links.slice(0, 8),
      });
    }

    if (gallery.length > 0) {
      pages.push({
        type: 'gallery',
        title: 'Galeria',
        payload: gallery,
      });
    }

    // Agregar páginas de artículos de prensa (una por imagen)
    const pressArticles = Array.isArray(presskitData.pressArticles) ? presskitData.pressArticles.filter(Boolean) : [];
    if (pressArticles.length > 0) {
      pressArticles.forEach((img, idx) => {
        pages.push({
          type: 'press-article',
          title: idx === 0 ? 'Artículos de Prensa' : `Prensa (${idx + 1})`,
          payload: img,
        });
      });
    }

    if (contactArtistName || managerName || roadManagerName || presskitData.contactPhone || contactLogo) {
      pages.push({
        type: 'contact',
        title: 'Contacto',
      });
    }

    return pages;
  }, [
    contactArtistName,
    contactLogo,
    contactPhone,
    gallery,
    links,
    artistMilestones,
    longBio,
    managerName,
    presskitData.artistName,
    presskitData.city,
    presskitData.contactPhone,
    presskitData.genre,
    presskitData.totalStreams,
    presskitData.totalVideoViews,
    recognitionImage,
    recognitions,
    releases,
    roadManagerName,
    shortBio,
    twitterBio,
    presskitData.pressArticles,
  ]);

  useEffect(() => {
    if (pageIndex > webPages.length - 1) {
      setPageIndex(Math.max(webPages.length - 1, 0));
    }
  }, [pageIndex, webPages.length]);

  useEffect(() => {
    return () => {
      if (jumpIntervalRef.current) {
        clearInterval(jumpIntervalRef.current);
      }
    };
  }, []);

  const currentPage = webPages[pageIndex] || webPages[0];

  const triggerTurnEffect = (direction) => {
    setTurnDirection(direction);
    setIsTurning(true);
    window.setTimeout(() => setIsTurning(false), 240);
  };

  const goPrev = () => {
    if (jumpIntervalRef.current) return;
    triggerTurnEffect(-1);
    setPageIndex((current) => (current === 0 ? webPages.length - 1 : current - 1));
  };

  const goNext = () => {
    if (jumpIntervalRef.current) return;
    triggerTurnEffect(1);
    setPageIndex((current) => (current === webPages.length - 1 ? 0 : current + 1));
  };

  const pageTurnStyle = isTurning
    ? {
        transform: `perspective(1600px) rotateY(${turnDirection > 0 ? -14 : 14}deg) translateX(${turnDirection > 0 ? 10 : -10}px)`,
        transformOrigin: turnDirection > 0 ? 'left center' : 'right center',
        filter: 'brightness(0.92) saturate(0.92)',
      }
    : {
        transform: 'perspective(1600px) rotateY(0deg) translateX(0px)',
        transformOrigin: 'center center',
        filter: 'brightness(1) saturate(1)',
      };

  const jumpToPage = (targetIndex) => {
    if (targetIndex === pageIndex) return;
    if (jumpIntervalRef.current) {
      clearInterval(jumpIntervalRef.current);
      jumpIntervalRef.current = null;
    }

    let current = pageIndex;
    const direction = targetIndex > current ? 1 : -1;

    triggerTurnEffect(direction);
    jumpIntervalRef.current = window.setInterval(() => {
      current += direction;
      setPageIndex(current);
      triggerTurnEffect(direction);

      if (current === targetIndex) {
        clearInterval(jumpIntervalRef.current);
        jumpIntervalRef.current = null;
      }
    }, 240);
  };

  const renderPage = (page) => {
    if (!page) return null;

    if (page.type === 'press-article') {
      // Página de artículo de prensa: imagen contenida con fondo blanco
      return (
        <div className="relative h-full w-full bg-white flex items-center justify-center p-4">
          {page.payload ? (
            <img
              src={page.payload}
              alt={page.title}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-400">Sin imagen de artículo de prensa</div>
          )}
        </div>
      );
    }

    if (page.type === 'cover') {
      return (
        <div className="relative h-full overflow-hidden">
          {cover ? (
            <img src={cover} alt={artistName} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-800 text-sm text-zinc-400">
              Sube una portada para ver tu cover
            </div>
          )}
          <div className="absolute inset-x-0 top-6 flex justify-center">
            <h3 className="text-center text-3xl font-black text-white">{artistName}</h3>
          </div>
          <div className="absolute inset-x-0 bottom-6 flex justify-center">
            <button type="button" className="bg-transparent p-0 text-sm font-black uppercase tracking-[0.28em] text-white">
              PRESSKIT
            </button>
          </div>
        </div>
      );
    }

    if (page.type === 'artist') {
      return (
        <div className="flex h-full flex-col p-4 sm:p-5">
          <div className="shrink-0 text-center">
            <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-300 sm:text-xs">Conoce A</p>
            <h3 className="mt-2 text-[clamp(1.55rem,3.2vw,2.25rem)] font-black text-white">{artistName}</h3>
          </div>

          <div className="mt-4 grid min-h-0 flex-1 gap-3 lg:grid-cols-[38%_62%]">
            <div className="min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-800">
              {bioImage ? (
                <img src={bioImage} alt={`Bio corta de ${artistName}`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center px-3 text-center text-xs text-zinc-400 sm:text-sm">Sin imagen de bio corta</div>
              )}
            </div>
            <div className={`min-h-0 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 ${isCompact ? '' : 'lg:flex lg:flex-col'}`}>
              <div className={isCompact ? '' : 'lg:min-h-0 lg:flex-1'}>
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-300 sm:text-sm">
                  <p>{genre} · {city}</p>
                  {performanceLiveLink ? (
                    <a
                      href={performanceLiveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-cyan-300 underline decoration-cyan-300/60 underline-offset-2 lg:hidden"
                    >
                      Mira mi performance en vivo
                    </a>
                  ) : null}
                </div>
                <p className="mt-3 max-h-full overflow-y-auto text-xs leading-5 text-zinc-200 sm:text-sm sm:leading-6">
                  {shortBio || 'Completa la biografia para mostrar informacion del artista en esta pagina.'}
                </p>
              </div>

              {performanceLiveLink ? (
                <div className={isCompact || isEmbedded ? 'mt-3' : 'hidden lg:flex lg:min-h-0 lg:flex-1 lg:items-start lg:justify-center'}>
                  <a
                    href={performanceLiveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full max-w-xl overflow-hidden rounded-xl border border-cyan-300/35 bg-cyan-300/10 transition hover:border-cyan-300/55 hover:bg-cyan-300/15"
                  >
                    <div className="grid grid-cols-[42%_58%]">
                      <div className={`relative overflow-hidden border-r border-cyan-300/20 ${isCompact || isEmbedded ? 'h-24 sm:h-28' : 'h-40'}`}>
                        {performanceLiveThumbnail ? (
                          <img src={performanceLiveThumbnail} alt="Performance en vivo" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-zinc-900 text-[11px] text-zinc-300">Sin thumbnail</div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/45 to-transparent" />
                      </div>

                      <div className="flex flex-col justify-center bg-emerald-500/90 p-3">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-cyan-200">Live Performance</p>
                        <p className="mt-1 text-sm font-semibold text-white">Mira mi performance en vivo</p>
                        <p className="mt-1 text-[11px] text-zinc-300">Ver en YouTube</p>
                      </div>
                    </div>
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      );
    }

    if (page.type === 'highlights') {
      return (
        <div className="flex h-full min-h-0 flex-col gap-4 p-5">
          <div className="shrink-0 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-cyan-300/35 bg-cyan-300/10 p-4">
              <p className="text-xs uppercase tracking-wider text-cyan-200">Total streams</p>
              <p className="mt-2 text-3xl font-black text-white">{totalStreams}</p>
            </div>
            <div className="rounded-2xl border border-fuchsia-300/35 bg-fuchsia-300/10 p-4">
              <p className="text-xs uppercase tracking-wider text-fuchsia-200">Total video views</p>
              <p className="mt-2 text-3xl font-black text-white">{totalVideoViews}</p>
            </div>
          </div>
          <div className="min-h-0 flex-1 grid gap-4 lg:grid-cols-[40%_60%]">
            <div className="min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-800">
              {recognitionImage ? (
                <img src={recognitionImage} alt="Reconocimientos" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-zinc-400">Sin imagen de reconocimientos</div>
              )}
            </div>
            <div className="min-h-0 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wider text-fuchsia-300">Reconocimientos</p>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-200">
                {recognitions || 'Agrega reconocimientos para completar esta seccion.'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (page.type === 'bio') {
      if (page.payload.key === 'twitter') {
        return (
          <div className="h-full p-5">
            <div className="mx-auto flex h-full min-h-0 max-w-3xl flex-col gap-4">
              <div className="shrink-0 rounded-2xl border border-cyan-300/35 bg-linear-to-br from-cyan-400/20 via-fuchsia-400/10 to-zinc-900 p-5">
                <p className="whitespace-pre-line text-sm leading-7 text-zinc-100">{page.payload.content}</p>
              </div>

              <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/15 bg-linear-to-br from-cyan-400/20 via-fuchsia-400/18 to-zinc-900">
                {twitterBioImage ? (
                  <div className="relative h-full w-full">
                    <img src={twitterBioImage} alt="Bio 140" className="h-full w-full object-cover" />

                    {milestoneItems.length > 0 ? (
                      <div className="absolute inset-x-3 top-3 z-10 space-y-2">
                        {milestoneItems.map((item, index) => (
                          <p
                            key={`milestone-overlay-${index}`}
                            className={`text-center font-semibold ${milestoneTextSizeClass}`}
                            style={{ color: theme.primary }}
                          >
                            {item}
                          </p>
                        ))}
                      </div>
                    ) : null}

                    <div className="pointer-events-none absolute inset-0" style={{
                      backgroundImage:
                        'linear-gradient(to right, rgba(0,0,0,0.5), transparent 12%, transparent 88%, rgba(0,0,0,0.5)), linear-gradient(to bottom, rgba(0,0,0,0.45), transparent 14%, transparent 86%, rgba(0,0,0,0.55))',
                    }} />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-zinc-400">Agrega una foto para la Bio 140</div>
                )}
              </div>
            </div>
          </div>
        );
      }

      if (page.payload.key === 'long') {
        return (
          <div className="h-full p-5">
            <div className="relative h-full overflow-hidden rounded-2xl border border-white/15">
              {longBioImage ? (
                <img
                  src={longBioImage}
                  alt="Bio larga"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-zinc-800" />
              )}

              <div className="absolute inset-0 bg-linear-to-b from-black/45 via-black/55 to-black/78" />

              <div className="relative z-10 h-full overflow-y-auto p-5 sm:p-6">
                <p className="mx-auto max-w-3xl whitespace-pre-line text-xs leading-6 text-zinc-100 sm:text-sm sm:leading-7">
                  {page.payload.content}
                </p>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="h-full p-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-wider text-cyan-300">{page.payload.title}</p>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-zinc-200">{page.payload.content}</p>
          </div>
        </div>
      );
    }

    if (page.type === 'releases') {
      return (
        <div className="flex h-full flex-col p-1.5 sm:p-4">
          <div className="grid flex-1 grid-cols-1 grid-rows-4 gap-1 sm:grid-cols-2 sm:grid-rows-2 sm:gap-3">
            {page.payload.map((release, index) => {
              const thumbnail = getYoutubeThumbnailUrl(release.url);

              return (
                <a
                  key={`${release.title}-${index}`}
                  href={release.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid min-h-0 grid-cols-[50%_50%] grid-rows-1 gap-1 overflow-hidden rounded-lg border border-fuchsia-300/25 bg-[#0b0b0f] p-0.5 shadow-[0_7px_14px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_18px_rgba(34,211,238,0.1)] sm:grid-cols-[50%_50%] sm:gap-1.5 sm:p-2"
                >
                  <div className="relative min-h-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={release.title || 'Release'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-linear-to-br from-zinc-800 via-zinc-900 to-black px-2 text-center">
                        <span className="rounded-full border border-white/25 bg-white/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-zinc-200 backdrop-blur-sm sm:text-[10px]">
                          Video no disponible
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/25 to-black/65" />
                    <div className="absolute left-1 top-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/30 bg-black/35 text-[7px] text-white backdrop-blur-sm sm:left-1.5 sm:top-1.5 sm:h-6 sm:w-6 sm:text-[10px]">
                      ▶
                    </div>
                  </div>

                  <div className="flex min-h-0 flex-col overflow-y-auto py-0.5 pr-1 sm:py-0.5 sm:pr-0.5">
                    <p className="text-[clamp(0.66rem,1.45vw,0.82rem)] font-black uppercase leading-[0.9] tracking-[0.01em] text-fuchsia-400 sm:text-[clamp(0.7rem,1.35vw,0.98rem)]">
                      {release.title || 'Release sin titulo'}
                    </p>
                    {release.description ? (
                      <p className="mt-0.5 text-[clamp(0.52rem,1.1vw,0.68rem)] leading-[1.05] text-zinc-100/90 sm:mt-1.5 sm:text-[clamp(0.58rem,0.95vw,0.8rem)]">
                        {release.description}
                      </p>
                    ) : null}
                    {release.author ? <p className="mt-0.5 text-[clamp(0.52rem,1.05vw,0.66rem)] font-semibold leading-tight text-cyan-200 sm:mt-1.5 sm:text-[clamp(0.6rem,0.9vw,0.76rem)]">{release.author}</p> : null}
                    {release.url ? (
                      <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-zinc-400 sm:mt-1.5 sm:text-[9px]">
                        Ver video
                      </p>
                    ) : null}
                    </div>
                </a>
              );
            })}
          </div>

          <p className="mt-1 text-center text-[8px] font-semibold tracking-[0.07em] text-zinc-200 sm:mt-3 sm:text-xs whitespace-pre-line">
            {releasesCtaText}
          </p>
        </div>
      );
    }

    if (page.type === 'links') {
      return (
        <div className="h-full p-5">
          <div
            className="relative h-full overflow-hidden"
            style={{
              '--color-background': theme.colorBackground,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
              <div className="grid h-full w-full max-w-5xl grid-cols-2 gap-0 overflow-hidden rounded-2xl md:grid-cols-4 md:grid-rows-4">
                {linksCollageImages.length > 0 ? (
                  linksCollageImages.map((image, index) => (
                    <div key={`${image}-${index}`} className={getCollageSpanClass(index, linksCollageImages.length)}>
                      <img src={image} alt={`Fondo ${index + 1}`} className="h-full w-full object-cover object-center" />
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 row-span-4 bg-zinc-900" />
                )}
              </div>
            </div>

            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(16, 185, 129, 0.8)' }} />

            <div className="relative z-10 p-5">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Conecta Con</p>
                <h3 className="mt-2 text-3xl font-black text-white sm:text-4xl">{artistName}</h3>
              </div>

              <div className="mt-5 flex justify-center px-1 py-1" style={{ height: isEmbedded ? 'min(52vh, 380px)' : 'min(68vh, 540px)' }}>
                {!isEmbedded ? (
                  <div className="flex h-full w-full flex-col gap-2 overflow-y-auto sm:hidden">
                    {linkSlots.map((slot) => {
                      const item = linksByKey[slot.key];
                      if (!item?.url) return null;

                      return (
                        <a
                          key={`mobile-${item.key}`}
                          href={item.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => {
                            if (!item.url) event.preventDefault();
                          }}
                          className="group relative rounded-xl border-2 border-white bg-transparent p-0 backdrop-blur-[1px]"
                        >
                          <div className="relative z-10 flex h-full w-full items-center gap-2 px-3 py-2 text-left">
                            <div className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white bg-white/12">
                              {item.Icon ? <item.Icon className="text-lg text-white" /> : <FaLink className="text-lg text-white" />}
                            </div>
                            <p className="min-w-0 flex-1 truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-300">{item.label}</p>
                            <p className="max-w-[45%] shrink-0 truncate text-right text-[clamp(0.72rem,1.1vw,0.9rem)] font-black uppercase leading-[0.95] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
                              {item.metric || '20K+'}
                            </p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                ) : null}

                <div
                  className={`grid h-full gap-0 overflow-visible ${isEmbedded ? 'w-full grid-cols-6 grid-rows-24' : 'hidden sm:mx-auto sm:grid sm:w-[min(100%,72rem)] sm:grid-cols-24 sm:grid-rows-48'}`}
                  style={{
                    gridTemplateColumns: isEmbedded ? 'repeat(6, minmax(0, 1fr))' : 'repeat(24, minmax(0, 1fr))',
                    gridTemplateRows: isEmbedded ? 'repeat(24, minmax(0, 1fr))' : 'repeat(36, minmax(0, 1fr))',
                  }}
                >
                  {linkSlots.map((slot) => {
                  const item = linksByKey[slot.key];
                  if (!item?.url) return null;
                  const hasScreenshot = ['youtube', 'instagram', 'tiktok', 'facebook'].includes(slot.key);

                    return (
                      <a
                        key={item.key}
                        href={item.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => {
                          if (!item.url) event.preventDefault();
                        }}
                        className={`group relative border-4 border-white bg-transparent p-0 backdrop-blur-[1px] ${isEmbedded ? 'col-span-6 row-span-2' : ''}`}
                        style={isEmbedded ? undefined : { gridColumn: slot.gridColumn, gridRow: slot.gridRow }}
                      >
                        {isEmbedded ? (
                          <div className="relative z-10 flex h-full w-full items-center gap-2 px-3 py-2 text-left">
                            <div className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white bg-white/12">
                              {item.Icon ? <item.Icon className="text-lg text-white" /> : <FaLink className="text-lg text-white" />}
                            </div>
                            <p className="min-w-0 flex-1 truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-300">{item.label}</p>
                            <p className="max-w-[45%] shrink-0 truncate text-right text-[clamp(0.72rem,1.1vw,0.9rem)] font-black uppercase leading-[0.95] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
                              {item.metric || '20K+'}
                            </p>
                          </div>
                        ) : hasScreenshot ? (
                          <div className={`flex h-full w-full flex-col overflow-hidden bg-transparent ${isEmbedded ? '' : 'sm:flex-row'}`}>
                            <div className="flex min-w-0 flex-[0.92] flex-col items-center justify-center p-2 text-center sm:p-2.5">
                              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white bg-white/12">
                                {item.Icon ? <item.Icon className="text-lg text-white" /> : <FaLink className="text-lg text-white" />}
                              </div>

                              <p className="mt-2 line-clamp-2 max-w-full wrap-break-word text-[clamp(0.7rem,1.1vw,0.98rem)] font-black uppercase leading-[0.95] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
                                {item.metric || '20K+'}
                              </p>
                            </div>

                            <div className="relative min-h-28 min-w-0 flex-[1.08] overflow-hidden sm:min-h-0">
                              {item.screenshot ? (
                                <img src={item.screenshot} alt={`${item.label} screenshot`} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full items-center justify-center bg-white/5 px-2 text-center text-[11px] text-zinc-200">
                                  Espacio para captura de pantalla
                                </div>
                              )}
                              <div className="absolute inset-0 bg-linear-to-b from-[#f7b8d4]/10 via-[#f39ac0]/18 to-black/40" />
                            </div>
                          </div>
                        ) : (
                          <div className="relative z-10 flex h-full items-center justify-center text-center">
                            <div className="flex h-full w-full flex-col items-center justify-center px-2 py-3 text-center">
                              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white bg-white/12">
                                {item.Icon ? <item.Icon className="text-lg text-white" /> : <FaLink className="text-lg text-white" />}
                              </div>
                              <p className="mt-2 line-clamp-2 max-w-full wrap-break-word text-center text-[clamp(0.72rem,1.15vw,1rem)] font-black uppercase leading-[0.95] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]">
                                {item.metric}
                              </p>
                            </div>
                          </div>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (page.type === 'gallery') {
      // Definir los títulos para cada imagen (sin Banner / Web Header)
      const galleryTitles = [
        'Official Press Photo',
        'Flyer Ready',
        'Live Performance',
        'Esencia del artista',
      ];
      // Definir clases de jerarquía visual (ajustado a 4 slots)
      const galleryGrid = [
        // Hero: grande, centrado
        'md:col-span-6 md:row-span-6 col-span-6 row-span-4',
        // Flyer Ready: alta
        'md:col-span-6 md:row-span-6 col-span-6 row-span-4',
        // Live Performance: alta
        'md:col-span-6 md:row-span-6 col-span-6 row-span-4',
        // Esencia del artista: más grande
        'md:col-span-6 md:row-span-6 col-span-6 row-span-3',
      ];
      return (
        <div className="relative flex-1 min-h-0 w-full p-5 overflow-y-auto">
          {/* Título y subtítulo para desktop y móvil, sin fondo ni sombra en móvil */}
          <div className="mb-6">
            <h2 className="text-center text-2xl sm:text-3xl font-black uppercase tracking-[0.13em] text-white sm:drop-shadow-lg drop-shadow-none bg-none">GALERÍA Y ASSETS</h2>
            <p className="mt-2 text-center text-sm sm:text-base text-zinc-200 font-medium max-w-2xl mx-auto bg-none drop-shadow-none">Activos oficiales curados para medios y promotores, optimizados para uso digital e impreso.</p>
          </div>

          <div className="grid h-auto max-h-none grid-cols-6 md:grid-cols-12 auto-rows-[64px] md:auto-rows-[52px] gap-3 overflow-x-hidden rounded-2xl overflow-y-auto min-h-0 flex-1">
            {page.payload.map((image, index) => (
              <GalleryImage
                key={`${image}-${index}`}
                image={image}
                title={galleryTitles[index]}
                gridClass={galleryGrid[index] || ''}
                artistName={artistName}
                index={index}
              />
            ))}
          </div>
        </div>
      );
    }

    if (page.type === 'contact') {
      return (
        <div className="h-full p-5">
          <div className="grid gap-4 lg:grid-cols-[34%_66%]">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-800 p-4">
              {contactLogo ? (
                <ContactLogo image={contactLogo} artistName={artistName} />
              ) : (
                <div className="flex h-full min-h-56 items-center justify-center text-sm text-zinc-400">Sin logo</div>
              )}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wider text-fuchsia-300">Contacto</p>
              <h3 className="mt-2 text-2xl font-black text-white">{contactArtistName || 'Nombre del artista'}</h3>
              <div className="mt-4 space-y-2 text-sm text-zinc-200">
                <p><span className="text-zinc-400">Manager:</span> {managerName || 'No especificado'}</p>
                <p><span className="text-zinc-400">Road manager:</span> {roadManagerName || 'No especificado'}</p>
                <p><span className="text-zinc-400">Telefono:</span> {contactPhone || 'No especificado'}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className={isCompact || isEmbedded ? '' : 'lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-4'}>
      {!isCompact && !isEmbedded ? (
        <aside className="hidden lg:block">
          <div className="sticky top-6 rounded-2xl border border-white/10 bg-zinc-900/70 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">Indice</p>
            <div className="mt-3 space-y-2">
              {webPages.map((page, index) => {
                const active = index === pageIndex;
                return (
                  <button
                    key={`${page.title}-${index}`}
                    type="button"
                    onClick={() => jumpToPage(index)}
                    className={`w-full rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                      active
                        ? 'border-cyan-300/45 bg-cyan-300/15 text-cyan-200'
                        : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/25 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {index + 1}. {page.title}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      ) : null}

      <article className="w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 shadow-[0_18px_42px_rgba(0,0,0,0.28)]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-cyan-300">{currentPage?.title || 'Preview'}</p>
          <p className="text-xs text-zinc-400">Pagina {pageIndex + 1} de {webPages.length}</p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 px-3 py-2 text-sm font-bold text-white transition duration-200 hover:scale-110 hover:bg-black/60 cursor-pointer"
            aria-label="Pagina anterior"
          >
            {'<'}
          </button>

          <div className={`relative ${(isCompact || currentPage?.type === 'gallery') ? 'overflow-y-auto overflow-x-hidden' : 'overflow-hidden'} ${pageViewportClass}`}>
            <div
              className="h-full transition-all duration-500 ease-in-out"
              style={{
                opacity: isTurning ? 0.88 : 1,
                transform: isTurning ? 'scale(0.998)' : 'scale(1)',
              }}
            >
              {renderPage(currentPage)}
            </div>
          </div>

          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-black/40 px-3 py-2 text-sm font-bold text-white transition duration-200 hover:scale-110 hover:bg-black/60 cursor-pointer"
            aria-label="Pagina siguiente"
          >
            {'>'}
          </button>
        </div>
      </article>
    </div>
  );
}

export default PresskitWeb;
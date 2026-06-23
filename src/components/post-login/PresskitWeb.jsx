// Componente para manejar el botón de descarga con touch en móvil y hover en desktop
function GalleryImage({ image, title, gridClass, artistName, index, onOpenImage }) {
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
      onClick={() => onOpenImage?.(image, title)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpenImage?.(image, title);
        }
      }}
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
            className={`pointer-events-auto absolute bottom-3 right-3 rounded-full border border-white/30 bg-linear-to-r from-transparent via-white/20 to-transparent backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-lg transition-all duration-300 hover:bg-white/30 hover:shadow-xl hover:scale-105 hover:tracking-[0.2em] focus:opacity-100 ${showDownload || !isMobile ? 'opacity-100 scale-105' : 'opacity-0 group-hover:opacity-100'}`}
            title="Descargar imagen"
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

function HorizontalGalleryImage({ image, artistName, index, onOpenImage }) {
  const [showDownload, setShowDownload] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 640px)').matches;

  const handleTouchStart = () => {
    if (isMobile) setShowDownload(true);
  };
  const handleTouchEnd = () => {
    if (isMobile) setTimeout(() => setShowDownload(false), 2000);
  };

  const fileName = `epk-horizontal-${index + 1}-${artistName}.jpg`;

  return (
    <div
      className="group relative flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/15 bg-zinc-900"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => !isMobile && setShowDownload(true)}
      onMouseLeave={() => !isMobile && setShowDownload(false)}
      onClick={() => onOpenImage?.(image, `Foto horizontal ${index + 1}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpenImage?.(image, `Foto horizontal ${index + 1}`);
        }
      }}
    >
      <img
        src={image}
        alt={`Foto horizontal ${index + 1}`}
        className="h-full w-full object-cover"
      />
      {(showDownload || !isMobile) && (
        <button
          type="button"
          className={`absolute bottom-3 right-3 rounded-full border border-white/30 bg-linear-to-r from-transparent via-white/20 to-transparent backdrop-blur-sm px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-lg transition-all duration-300 hover:bg-white/30 hover:shadow-xl hover:scale-105 hover:tracking-[0.2em] focus:opacity-100 ${showDownload || !isMobile ? 'opacity-100 scale-105' : 'opacity-0 group-hover:opacity-100'}`}
          title="Descargar imagen"
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
              console.error('Error descargando foto horizontal:', err);
            }
          }}
        >
          Descargar
        </button>
      )}
    </div>
  );
}

function ImageLightbox({ image, title, artistName, onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 px-4 py-6 backdrop-blur-md"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative flex h-full w-full max-w-6xl items-center justify-center"
        onClick={(event) => event.stopPropagation()}
        role="presentation"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 z-10 rounded-full border border-white/20 bg-black/60 px-3 py-2 text-sm font-bold text-white transition hover:bg-black/80"
        >
          Cerrar
        </button>
        <button
          type="button"
          onClick={async (e) => {
            e.stopPropagation();
            try {
              const response = await fetch(image, { mode: 'cors' });
              const blob = await response.blob();
              const extMatch = /(\.(jpg|jpeg|png|gif|webp|svg))(?:\?|$)/i.exec(image);
              const ext = extMatch ? extMatch[2] : 'jpg';
              const base = (title || artistName || 'image').replace(/[^a-z0-9\-_\.]/gi, '-').toLowerCase();
              const filename = `${base}.${ext}`;
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = filename;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            } catch (err) {
              console.error('Error descargando imagen desde lightbox:', err);
            }
          }}
          aria-label="Descargar imagen"
          className="absolute right-20 top-2 z-10 rounded-full border border-white/20 bg-black/60 px-3 py-2 text-sm font-bold text-white transition hover:bg-black/80"
        >
          Descargar
        </button>
        <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/90 p-3 shadow-[0_30px_90px_rgba(0,0,0,0.6)]">
          <img
            src={image}
            alt={title}
            className="max-h-[88vh] max-w-full object-contain"
          />
        </div>
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
      <img src={image} alt="Logo de contacto" className="h-48 w-auto max-w-full object-contain sm:h-64" />
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
import { getTextEffectStyle } from '../../lib/textEffects.js';
import { normalizeCoverFrame, coverFrameImageStyle } from '../../lib/coverFrame.js';
import { useTheme } from '../../context/ThemeContext.tsx';
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

// Reparto de releases por página según la cantidad total (máx 8)
const RELEASE_PAGE_SPLITS = {
  1: [1], 2: [1, 1], 3: [1, 2], 4: [2, 2],
  5: [2, 3], 6: [3, 3], 7: [4, 3], 8: [4, 4],
};

function splitReleasesIntoPages(releases) {
  const list = Array.isArray(releases) ? releases.filter((r) => r && (r.url || r.title)) : [];
  const sizes = RELEASE_PAGE_SPLITS[list.length];
  if (!sizes) return chunkArray(list, 4);
  const pages = [];
  let idx = 0;
  for (const size of sizes) {
    pages.push(list.slice(idx, idx + size));
    idx += size;
  }
  return pages;
}

function getYoutubeThumbnailUrl(url) {
  if (!url) return '';
  const match = String(url).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  const videoId = match?.[1];
  return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';
}

function getCollageSpanClass(index, total) {
  // Grid base 2x2 (4 celdas) — siempre se llena por completo, sin huecos.
  if (total <= 1) return 'col-span-2 row-span-2';
  if (total === 2) return 'col-span-1 row-span-2';
  if (total === 3) return index === 0 ? 'col-span-2 row-span-1' : 'col-span-1 row-span-1';
  return 'col-span-1 row-span-1';
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

function PresskitWeb({ presskitData, mode = 'full', onCoverImagePositionChange }) {
  const [pageIndex, setPageIndex] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const [turnDirection, setTurnDirection] = useState(1);
  const [lightboxImage, setLightboxImage] = useState('');
  const [lightboxTitle, setLightboxTitle] = useState('');
  const [lightboxArtistName, setLightboxArtistName] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const jumpIntervalRef = useRef(null);
  const isCompact = mode === 'compact';
  const isEmbedded = mode === 'embedded';
  const pageViewportClass = isCompact
    ? 'aspect-[9/16] w-full sm:aspect-auto sm:h-96'
    : isEmbedded
      ? 'aspect-[9/16] w-full sm:aspect-auto sm:h-[clamp(19rem,44vw,30rem)]'
      : 'aspect-[9/16] w-full sm:aspect-auto sm:h-[62vh] lg:h-[86vh]';
  const { theme: uiTheme, typography } = useTheme();
  const cf = presskitData.customFonts || {};
  const pkFonts = {
    title: cf.title?.url    ? 'presskit-custom-title, sans-serif'    : (typography.titleFont    ? `'${typography.titleFont}', sans-serif`    : undefined),
    sub:   cf.subtitle?.url ? 'presskit-custom-subtitle, sans-serif' : (typography.subtitleFont ? `'${typography.subtitleFont}', sans-serif` : undefined),
    body:  cf.body?.url     ? 'presskit-custom-body, sans-serif'     : (typography.bodyFont     ? `'${typography.bodyFont}', sans-serif`     : undefined),
    label: typography.labelFont ? `'${typography.labelFont}', sans-serif` : undefined,
  };
  const customFontFace = [
    cf.title?.url    && `@font-face{font-family:'presskit-custom-title';src:url('${cf.title.url}');}`,
    cf.subtitle?.url && `@font-face{font-family:'presskit-custom-subtitle';src:url('${cf.subtitle.url}');}`,
    cf.body?.url     && `@font-face{font-family:'presskit-custom-body';src:url('${cf.body.url}');}`,
  ].filter(Boolean).join('');
  const pkCss = [
    customFontFace,
    pkFonts.title && `[data-pk-web] h2,[data-pk-web] h3{font-family:${pkFonts.title}}`,
  ].filter(Boolean).join('');
  const theme = getTheme(presskitData.theme || 'neon');
  // Efectos de texto/subtítulo del paso 11
  const textEffectStyle = getTextEffectStyle(uiTheme.textEffect, uiTheme.textColor);
  const subtitleEffectStyle = getTextEffectStyle(uiTheme.subtitleEffect, uiTheme.subtitleColor);
  // Overlay unificado de todas las páginas, controlado por el slider del paso 11
  const PAGE_OVERLAY = uiTheme.overlayColor;

  const cover = presskitData.images?.[0] || '';
  const coverFrame = normalizeCoverFrame(presskitData);
  const coverImageStyle = coverFrameImageStyle(coverFrame);
  const coverImagePositionLabel = coverFrame.offsetY <= -0.12
    ? 'Más arriba'
    : coverFrame.offsetY >= 0.12
      ? 'Más abajo'
      : 'Centrada';
  const gallery = Array.isArray(presskitData.images) ? presskitData.images.slice(1, 5).filter(Boolean) : [];
  const horizontalImages = [presskitData.images?.[5], presskitData.images?.[6]].filter(Boolean);
  const artistName = presskitData.artistName || 'Nombre del artista';
  const genre = presskitData.genre || 'Genero';
  const city = presskitData.city || 'Ciudad';
  const performanceLiveLink = presskitData.performanceLiveLink || '';
  const performanceLiveThumbnail = getYoutubeThumbnailUrl(performanceLiveLink);
  const totalStreams = presskitData.totalStreams || 'Sin dato';
  const totalVideoViews = presskitData.totalVideoViews || 'Sin dato';
  const recognitions = Array.isArray(presskitData.recognitions)
    ? presskitData.recognitions.filter(Boolean)
    : (presskitData.recognitions || '').split('\n').map(s => s.trim()).filter(Boolean);
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
  ].slice(0, 12);
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
  const contactCountryCode = presskitData.contactCountryCode || '+57';
  const contactPhone = presskitData.contactPhone ? `${contactCountryCode} ${presskitData.contactPhone}`.trim() : '';
  const whatsappPhone = presskitData.whatsappPhone ? `${contactCountryCode} ${presskitData.whatsappPhone}`.trim() : '';
  // tel: conserva el "+"; wa.me solo dígitos
  const telHref = presskitData.contactPhone ? `tel:${`${contactCountryCode}${presskitData.contactPhone}`.replace(/[^\d+]/g, '')}` : '';
  const whatsappHref = presskitData.whatsappPhone ? `https://wa.me/${`${contactCountryCode}${presskitData.whatsappPhone}`.replace(/\D/g, '')}` : '';
  const contactLogo = presskitData.contactLogo || '';
  const handleCoverDoubleClick = (event) => {
    if (typeof onCoverImagePositionChange !== 'function' || !cover) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const isTopHalf = event.clientY < rect.top + rect.height / 2;

    onCoverImagePositionChange(isTopHalf ? -1 : 1);
  };

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
      { key: 'long', title: 'Biografía', content: longBio },
    ].filter((item) => item.content);

    bioBlocks.forEach((block) => {
      pages.push({
        type: 'bio',
        title: 'Biografía',
        payload: block,
      });
    });

    splitReleasesIntoPages(releases).forEach((releaseChunk, index) => {
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

    if (horizontalImages.length > 0) {
      pages.push({
        type: 'gallery-horizontal',
        title: 'Fotos Horizontales',
        payload: horizontalImages,
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
    horizontalImages,
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

  const openImageLightbox = (image, title) => {
    setLightboxImage(image || '');
    setLightboxTitle(title || 'Imagen');
    setLightboxArtistName(artistName || '');
  };

  const closeImageLightbox = () => {
    setLightboxImage('');
    setLightboxTitle('');
    setLightboxArtistName('');
  };

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
        <div
          className={`relative h-full overflow-hidden ${onCoverImagePositionChange ? 'cursor-ns-resize select-none' : ''}`}
          onDoubleClick={handleCoverDoubleClick}
          title={onCoverImagePositionChange ? 'Doble clic arriba o abajo para mover la portada' : undefined}
        >
          {cover ? (
            <img
              src={cover}
              alt={artistName}
              className="select-none"
              style={coverImageStyle}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm" style={{ backgroundColor: uiTheme.cardBg, color: uiTheme.subtitleColor }}>
              Sube una portada para ver tu cover
            </div>
          )}
          <div className="pointer-events-none absolute inset-0" style={{ backgroundColor: PAGE_OVERLAY }} />
          {onCoverImagePositionChange ? (
            <div className="absolute left-4 top-4 z-10 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-sm">
              Doble clic arriba/abajo · {coverImagePositionLabel}
            </div>
          ) : null}
          <div className="absolute inset-x-0 top-6 flex justify-center">
            <h3 className="text-center text-3xl font-black" style={{ color: uiTheme.titleColor }}>{artistName}</h3>
          </div>
          <div className="absolute inset-x-0 bottom-6 flex justify-center">
            <button type="button" className="bg-transparent p-0 text-sm font-black uppercase tracking-[0.28em]" style={{ color: uiTheme.titleColor, ...(pkFonts.title && { fontFamily: pkFonts.title }) }}>
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
            <p className="text-[11px] uppercase tracking-[0.18em] sm:text-xs" style={{ color: uiTheme.subtitleColor, ...(pkFonts.sub && { fontFamily: pkFonts.sub }), ...subtitleEffectStyle }}>Conoce A</p>
            <h3 className="mt-2 text-[clamp(1.55rem,3.2vw,2.25rem)] font-black" style={{ color: uiTheme.titleColor, ...(pkFonts.title && { fontFamily: pkFonts.title }) }}>{artistName}</h3>
          </div>

            <div className="mt-4 grid min-h-0 flex-1 gap-3 lg:grid-cols-[38%_62%]">
            <div className="min-h-0 overflow-hidden rounded-2xl" style={{ backgroundColor: uiTheme.cardBg, border: `1px solid ${uiTheme.borderColor}` }}>
              {bioImage ? (
                <img src={bioImage} alt={`Bio corta de ${artistName}`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center px-3 text-center text-xs sm:text-sm" style={{ color: uiTheme.subtitleColor }}>Sin imagen de bio corta</div>
              )}
            </div>
            <div
              className="min-h-0 overflow-y-auto rounded-2xl p-3 sm:p-4 flex flex-col h-full"
              style={{ backgroundColor: uiTheme.cardBg, border: `1px solid ${uiTheme.borderColor}` }}
            >
              <div className="flex flex-col gap-2">
                <div className="text-xs sm:text-sm" style={{ color: uiTheme.subtitleColor, ...(pkFonts.sub && { fontFamily: pkFonts.sub }), ...subtitleEffectStyle }}>{genre} · {city}</div>
              </div>

              <div className="mt-3 flex-1 min-h-0 overflow-y-auto">
                <p className="text-xs leading-5 sm:text-sm sm:leading-6" style={{ color: uiTheme.textColor, ...(pkFonts.body && { fontFamily: pkFonts.body }), ...textEffectStyle }}>{shortBio || 'Completa la biografia para mostrar informacion del artista en esta pagina.'}</p>
              </div>

              {performanceLiveLink ? (
                <div className="mt-3">
                  <a
                    href={performanceLiveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex-none flex flex-col overflow-hidden rounded-xl transition"
                    style={{ border: `1px solid ${uiTheme.borderColor}` }}
                  >
                    <div className="relative w-full aspect-video overflow-hidden">
                      {performanceLiveThumbnail ? (
                        <img src={performanceLiveThumbnail} alt="Performance en vivo" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[11px]" style={{ backgroundColor: uiTheme.cardBg, color: uiTheme.subtitleColor }}>Sin thumbnail</div>
                      )}
                    </div>

                    <div className="p-3" style={{ backgroundColor: uiTheme.overlayColor }}>
                      <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: uiTheme.subtitleColor, ...(pkFonts.sub && { fontFamily: pkFonts.sub }) }}>Live Performance</p>
                      <p className="mt-1 text-sm font-semibold" style={{ color: uiTheme.subtitleColor, ...(pkFonts.sub && { fontFamily: pkFonts.sub }) }}>Mira mi performance en vivo</p>
                      <p className="mt-1 text-[11px]" style={{ color: uiTheme.textColor, ...(pkFonts.body && { fontFamily: pkFonts.body }) }}>Ver en YouTube</p>
                      <p className="mt-2 text-xs whitespace-pre-line" style={{ color: uiTheme.textColor, ...(pkFonts.body && { fontFamily: pkFonts.body }) }}>{presskitData.performanceDescription || ''}</p>
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
            <div className="rounded-2xl p-4" style={{ border: `1px solid ${uiTheme.borderColor}`, backgroundColor: uiTheme.cardBg }}>
              <p className="text-xs uppercase tracking-wider" style={{ color: uiTheme.subtitleColor, ...(pkFonts.sub && { fontFamily: pkFonts.sub }) }}>Total streams</p>
              <p className="mt-2 text-3xl font-black" style={{ color: uiTheme.titleColor, ...(pkFonts.title && { fontFamily: pkFonts.title }) }}>{totalStreams}</p>
            </div>
            <div className="rounded-2xl p-4" style={{ border: `1px solid ${uiTheme.borderColor}`, backgroundColor: uiTheme.cardBg }}>
              <p className="text-xs uppercase tracking-wider" style={{ color: uiTheme.subtitleColor, ...(pkFonts.sub && { fontFamily: pkFonts.sub }) }}>Total video views</p>
              <p className="mt-2 text-3xl font-black" style={{ color: uiTheme.titleColor, ...(pkFonts.title && { fontFamily: pkFonts.title }) }}>{totalVideoViews}</p>
            </div>
          </div>
          <div className="min-h-0 flex-1 grid gap-4 lg:grid-cols-[40%_60%]">
            <div className="min-h-0 overflow-hidden rounded-2xl" style={{ border: `1px solid ${uiTheme.borderColor}`, backgroundColor: uiTheme.cardBg }}>
              {recognitionImage ? (
                <img src={recognitionImage} alt="Reconocimientos" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm" style={{ color: uiTheme.subtitleColor }}>Sin imagen de reconocimientos</div>
              )}
            </div>
            <div className="min-h-0 overflow-y-auto rounded-2xl p-4" style={{ border: `1px solid ${uiTheme.borderColor}`, backgroundColor: uiTheme.cardBg }}>
              <p className="text-xs uppercase tracking-wider" style={{ color: uiTheme.subtitleColor, ...(pkFonts.sub && { fontFamily: pkFonts.sub }) }}>Reconocimientos</p>
              <div className="mt-2 space-y-1.5">
                {recognitions.length > 0 ? recognitions.map((r, i) => (
                  <p key={i} className="text-sm leading-6" style={{ color: uiTheme.textColor, ...(pkFonts.body && { fontFamily: pkFonts.body }) }}>{r}</p>
                )) : (
                  <p className="text-sm" style={{ color: uiTheme.subtitleColor }}>Agrega reconocimientos para completar esta seccion.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (page.type === 'bio') {
      if (page.payload.key === 'twitter') {
        return (
          <div className="h-full p-5">
            <div className="relative h-full overflow-hidden rounded-2xl border border-white/15">
              {twitterBioImage ? (
                <img src={twitterBioImage} alt="Bio 140" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-zinc-800" />
              )}

              <div className="absolute inset-0" style={{ backgroundColor: PAGE_OVERLAY }} />

              <div className="relative z-10 flex h-full flex-col overflow-y-auto p-5 sm:p-6">
                {/* Header: kicker + nombre */}
                <div className="shrink-0 text-center">
                  <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: uiTheme.subtitleColor, ...(pkFonts.label && { fontFamily: pkFonts.label }), ...subtitleEffectStyle }}>CONOCE A</p>
                  <h3 className="mt-1 text-2xl font-black sm:text-3xl" style={{ color: uiTheme.titleColor, ...(pkFonts.title && { fontFamily: pkFonts.title }) }}>{artistName}</h3>
                </div>

                {/* Bloque central: genero/ciudad + bio */}
                <div className="flex flex-1 flex-col items-center justify-center gap-3 py-4 text-center">
                  {[presskitData.genre, presskitData.city].filter(Boolean).length > 0 ? (
                    <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: uiTheme.subtitleColor, ...(pkFonts.label && { fontFamily: pkFonts.label }), ...subtitleEffectStyle }}>
                      {[presskitData.genre, presskitData.city].filter(Boolean).join(' • ')}
                    </p>
                  ) : null}
                  <p className="mx-auto max-w-2xl whitespace-pre-line text-sm leading-7 sm:text-base" style={{ color: uiTheme.textColor, ...(pkFonts.body && { fontFamily: pkFonts.body }), ...textEffectStyle }}>
                    {page.payload.content}
                  </p>
                  {milestoneItems.length > 0 ? (
                    <div className="mt-2 flex w-full max-w-2xl flex-col gap-2">
                      {milestoneItems.map((item, index) => (
                        <div
                          key={`milestone-overlay-${index}`}
                          className={`rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-center font-semibold backdrop-blur-sm ${milestoneTextSizeClass}`}
                          style={{ color: uiTheme.textColor, ...(pkFonts.body && { fontFamily: pkFonts.body }) }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
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
                  alt="Biografía"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-zinc-800" />
              )}

              <div className="absolute inset-0" style={{ backgroundColor: PAGE_OVERLAY }} />

              <div className="relative z-10 h-full overflow-y-auto p-5 sm:p-6">
                <div className="mb-4 text-center">
                  <h3 className="text-2xl font-black" style={{ color: uiTheme.titleColor, ...(pkFonts.title && { fontFamily: pkFonts.title }) }}>{artistName}</h3>
                </div>
                <p className="mx-auto max-w-3xl whitespace-pre-line text-xs leading-6 sm:text-sm sm:leading-7" style={{ color: uiTheme.textColor, ...(pkFonts.body && { fontFamily: pkFonts.body }), ...textEffectStyle }}>
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
      const items = page.payload;
      const count = items.length;

      const cardClass = 'group overflow-hidden rounded-lg border border-fuchsia-300/25 bg-[#0b0b0f] shadow-[0_7px_14px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_18px_rgba(34,211,238,0.1)]';

      const renderThumb = (release, big = false) => {
        const thumbnail = getYoutubeThumbnailUrl(release.url);
        return (
          <div className="relative h-full min-h-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
            {thumbnail ? (
              <img src={thumbnail} alt={release.title || 'Release'} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-linear-to-br from-zinc-800 via-zinc-900 to-black px-2 text-center">
                <span className="rounded-full border border-white/25 bg-white/10 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-zinc-200 backdrop-blur-sm sm:text-[10px]">
                  Video no disponible
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/25 to-black/65" />
            <div className={`absolute left-1.5 top-1.5 inline-flex items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-sm ${big ? 'h-9 w-9 text-base' : 'h-6 w-6 text-[10px]'}`}>
              ▶
            </div>
          </div>
        );
      };

      const renderInfo = (release, big = false) => (
        <div className="flex min-h-0 flex-col overflow-y-auto">
          <p className={`font-black uppercase leading-[0.95] tracking-[0.01em] text-fuchsia-400 ${big ? 'text-[clamp(1.05rem,2.6vw,1.7rem)]' : 'text-[clamp(0.7rem,1.35vw,0.98rem)]'}`}>
            {release.title || 'Release sin titulo'}
          </p>
          {release.description ? (
            <p className={`mt-1.5 text-zinc-100/90 ${big ? 'text-[clamp(0.8rem,1.3vw,0.98rem)] leading-snug' : 'text-[clamp(0.58rem,0.95vw,0.8rem)] leading-[1.1]'}`}>
              {release.description}
            </p>
          ) : null}
          {release.author ? <p className={`mt-1.5 font-semibold leading-tight text-cyan-200 ${big ? 'text-[clamp(0.72rem,1.1vw,0.92rem)]' : 'text-[clamp(0.6rem,0.9vw,0.76rem)]'}`}>{release.author}</p> : null}
          {release.url ? <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-zinc-400">Ver video</p> : null}
        </div>
      );

      // Tarjeta vertical: miniatura arriba, info abajo
      // Tarjeta horizontal: miniatura a la izquierda, info a la derecha
      const horizontalCard = (release, index) => (
        <a
          key={`${release.title}-${index}`}
          href={release.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={`grid min-h-0 grid-cols-[44%_56%] gap-2 p-1.5 sm:gap-3 sm:p-2 ${cardClass}`}
        >
          {renderThumb(release)}
          <div className="min-h-0 py-0.5 pr-1">{renderInfo(release)}</div>
        </a>
      );

      // Tarjeta destacada (1 release): miniatura arriba, texto abajo
      const featuredCard = (release, index) => (
        <a
          key={`${release.title}-${index}`}
          href={release.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={`grid min-h-0 grid-rows-[1fr_auto] gap-2 p-1.5 sm:gap-3 sm:p-2 ${cardClass}`}
        >
          {renderThumb(release, true)}
          <div className="flex min-h-0 flex-col items-center justify-center px-1 pb-1 text-center">{renderInfo(release, true)}</div>
        </a>
      );

      let grid;
      if (count === 1) {
        grid = (
          <div className="grid min-h-0 flex-1 grid-rows-1">
            {featuredCard(items[0], 0)}
          </div>
        );
      } else if (count === 2) {
        grid = (
          <div className="grid min-h-0 flex-1 grid-rows-2 gap-2 sm:gap-3">
            {items.map((release, index) => horizontalCard(release, index))}
          </div>
        );
      } else if (count === 3) {
        grid = (
          <div className="grid min-h-0 flex-1 grid-rows-3 gap-2 sm:gap-3">
            {items.map((release, index) => horizontalCard(release, index))}
          </div>
        );
      } else {
        grid = (
          <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-4 gap-1 sm:grid-cols-2 sm:grid-rows-2 sm:gap-3">
            {items.map((release, index) => horizontalCard(release, index))}
          </div>
        );
      }

      return (
        <div className="flex h-full flex-col p-1.5 sm:p-4">
          {grid}
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
            <div className="absolute inset-0">
              <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-0 overflow-hidden">
                {linksCollageImages.length > 0 ? (
                  linksCollageImages.slice(0, 4).map((image, index, arr) => (
                    <div key={`${image}-${index}`} className={getCollageSpanClass(index, arr.length)}>
                      <img src={image} alt={`Fondo ${index + 1}`} className="h-full w-full object-cover object-center" />
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 row-span-2 bg-zinc-900" />
                )}
              </div>
            </div>

            <div className="absolute inset-0" style={{ backgroundColor: PAGE_OVERLAY }} />

            <div className="relative z-10 p-5">
              <div className="text-center">
                <p className="text-xs uppercase tracking-[0.18em]" style={{ color: uiTheme.subtitleColor, ...(pkFonts.label && { fontFamily: pkFonts.label }), ...subtitleEffectStyle }}>Conecta Con</p>
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
      return (
        <div className="relative flex-1 min-h-0 w-full p-5 overflow-y-auto">
          {/* Título y subtítulo para desktop y móvil, sin fondo ni sombra en móvil */}
          <div className="mb-6">
            <h2 className="text-center text-2xl sm:text-3xl font-black uppercase tracking-[0.13em] text-white sm:drop-shadow-lg drop-shadow-none bg-none">GALERÍA Y ASSETS</h2>
            <p className="mt-2 text-center text-sm sm:text-base text-zinc-200 font-medium max-w-2xl mx-auto bg-none drop-shadow-none">Activos oficiales curados para medios y promotores, optimizados para uso digital e impreso.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 overflow-x-hidden rounded-2xl">
            {page.payload.map((image, index) => (
              <GalleryImage
                key={`${image}-${index}`}
                image={image}
                title={galleryTitles[index]}
                gridClass="aspect-[3/4]"
                artistName={artistName}
                index={index}
                onOpenImage={openImageLightbox}
              />
            ))}
          </div>
        </div>
      );
    }

    if (page.type === 'gallery-horizontal') {
      return (
        <div className="relative flex h-full min-h-0 w-full flex-col gap-3 overflow-y-auto p-4 sm:p-5" style={{ backgroundColor: uiTheme.bgColor }}>
          <div className="shrink-0">
            <h2 className="text-center text-xl font-black uppercase tracking-[0.13em] text-white sm:text-2xl">GALERÍA</h2>
            <p className="mt-1 text-center text-xs text-zinc-400 sm:text-sm">Fotos en formato horizontal</p>
          </div>
          <div className="flex min-h-0 flex-1 flex-col gap-3">
            {page.payload.map((image, index) => (
              <HorizontalGalleryImage
                key={`horiz-${index}`}
                image={image}
                artistName={artistName}
                index={index}
                onOpenImage={openImageLightbox}
              />
            ))}
          </div>
        </div>
      );
    }

    if (page.type === 'contact') {
      return (
        <div className="h-full p-5" style={{ backgroundColor: uiTheme.bgColor }}>
          <div className="flex h-full flex-col gap-4">
            <div
              className="flex flex-1 items-center justify-center rounded-2xl p-4 text-center"
              style={{ backgroundColor: uiTheme.cardBg, border: `1px solid ${uiTheme.borderColor}` }}
            >
              <div className="max-w-xl space-y-4">
                <h3 className="text-2xl font-black sm:text-3xl" style={{ color: uiTheme.titleColor, ...(pkFonts.title && { fontFamily: pkFonts.title }) }}>
                  {contactArtistName || 'Nombre del artista'}
                </h3>
                <div className="space-y-2 text-sm sm:text-base" style={{ color: uiTheme.textColor, ...(pkFonts.body && { fontFamily: pkFonts.body }) }}>
                  <p>
                    <span style={{ color: uiTheme.subtitleColor, ...(pkFonts.sub && { fontFamily: pkFonts.sub }) }}>Manager:</span> {managerName || 'No especificado'}
                  </p>
                  <p>
                    <span style={{ color: uiTheme.subtitleColor, ...(pkFonts.sub && { fontFamily: pkFonts.sub }) }}>Road manager:</span> {roadManagerName || 'No especificado'}
                  </p>
                  <p>
                    <span style={{ color: uiTheme.subtitleColor, ...(pkFonts.sub && { fontFamily: pkFonts.sub }) }}>Telefono:</span>{' '}
                    {telHref ? (
                      <a href={telHref} className="underline decoration-dotted underline-offset-2 transition hover:opacity-80">{contactPhone}</a>
                    ) : 'No especificado'}
                  </p>
                  {whatsappPhone ? (
                    <p>
                      <span style={{ color: uiTheme.subtitleColor, ...(pkFonts.sub && { fontFamily: pkFonts.sub }) }}>WhatsApp:</span>{' '}
                      <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-2 transition hover:opacity-80">{whatsappPhone}</a>
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-center">
              {contactLogo ? (
                <div className="flex w-full items-center justify-center">
                  <ContactLogo image={contactLogo} artistName={artistName} />
                </div>
              ) : (
                <div className="flex h-full min-h-56 w-full items-center justify-center text-sm" style={{ color: uiTheme.subtitleColor }}>
                  Sin logo
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      data-pk-web=""
      className={isCompact || isEmbedded ? '' : 'lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-4'}
    >
      {pkCss && <style>{pkCss}</style>}
      {!isCompact && !isEmbedded ? (
        <aside className="hidden lg:block">
          <div
            className="sticky top-6 rounded-2xl p-4"
            style={{ backgroundColor: uiTheme.cardBg, border: `1px solid ${uiTheme.borderColor}` }}
          >
            <p className="text-xs uppercase tracking-[0.14em]" style={{ color: uiTheme.accentColor }}>Indice</p>
            <div className="mt-3 space-y-2">
              {webPages.map((page, index) => {
                const active = index === pageIndex;
                return (
                  <button
                    key={`${page.title}-${index}`}
                    type="button"
                    onClick={() => jumpToPage(index)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="w-full rounded-xl px-3 py-2 text-left text-xs font-semibold transform transition-all duration-150 cursor-pointer"
                    style={(() => {
                      if (active) return { backgroundColor: `${uiTheme.accentColor}22`, border: `1px solid ${uiTheme.accentColor}66`, color: uiTheme.accentColor };
                      if (hoveredIndex === index) return { backgroundColor: `${uiTheme.accentColor}12`, border: `1px solid ${uiTheme.accentColor}44`, color: uiTheme.accentColor, transform: 'scale(1.03)' };
                      return { backgroundColor: 'transparent', border: `1px solid ${uiTheme.borderColor}`, color: uiTheme.subtitleColor };
                    })()}
                  >
                    {index + 1}. {page.title}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      ) : null}

      <article
        className="w-full overflow-hidden rounded-2xl shadow-[0_18px_42px_rgba(0,0,0,0.28)]"
        style={{ backgroundColor: uiTheme.bgColor, border: `1px solid ${uiTheme.borderColor}` }}
      >
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: `1px solid ${uiTheme.borderColor}` }}
        >
          <p className="text-xs uppercase tracking-wider" style={{ color: uiTheme.accentColor }}>{currentPage?.title || 'Preview'}</p>
          <div className="flex items-center gap-3">
            <p className="text-xs" style={{ color: uiTheme.accentColor }}>Pagina {pageIndex + 1} de {webPages.length}</p>
            <button
              type="button"
              onClick={() => window.open('/presskitPDF', '_blank')}
              className="inline-flex items-center rounded-lg border border-amber-300/40 px-3 py-1 text-xs font-semibold text-amber-300 transition hover:bg-amber-300/10"
              aria-label="Abrir vista y descargar PDF"
            >
              Descargar PDF
            </button>
          </div>
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

          <div className={`relative ${(isCompact || currentPage?.type === 'gallery' || currentPage?.type === 'gallery-horizontal') ? 'overflow-y-auto overflow-x-hidden' : 'overflow-hidden'} ${pageViewportClass}`}>
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

      {lightboxImage ? (
        <ImageLightbox image={lightboxImage} title={lightboxTitle} artistName={lightboxArtistName} onClose={closeImageLightbox} />
      ) : null}
    </div>
  );
}

export default PresskitWeb;
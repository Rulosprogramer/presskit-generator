import { SiApplemusic, SiFacebook, SiInstagram, SiSoundcloud, SiSpotify, SiTiktok, SiYoutube } from 'react-icons/si';
import { useTheme } from '../../context/ThemeContext.tsx';

const PLATFORM_CONFIG = {
  spotify:    { label: 'Spotify',      Icon: SiSpotify },
  instagram:  { label: 'Instagram',    Icon: SiInstagram },
  youtube:    { label: 'YouTube',      Icon: SiYoutube },
  tiktok:     { label: 'TikTok',       Icon: SiTiktok },
  facebook:   { label: 'Facebook',     Icon: SiFacebook },
  appleMusic: { label: 'Apple Music',  Icon: SiApplemusic },
  soundcloud: { label: 'SoundCloud',   Icon: SiSoundcloud },
};

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;
const DOCUMENT_FONT_SCALE = 1;

function chunkArray(items, size) {
  const result = [];
  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }
  return result;
}

function hexify(color) {
  if (!color) return '#000000';
  if (/^#[0-9a-f]{6}$/i.test(color)) return color;
  const h3 = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(color);
  if (h3) return `#${h3[1]}${h3[1]}${h3[2]}${h3[2]}${h3[3]}${h3[3]}`;
  const m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(color);
  if (m) return '#' + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
  return '#000000';
}

function isHttpUrl(value) {
  return typeof value === 'string' && (value.startsWith('https://') || value.startsWith('http://'));
}

function getLinkDomain(url) {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return String(url).replace(/^https?:\/\//, '').split('/')[0];
  }
}

function makePdfStyles(c) {
  const accentHex = hexify(c.accent);
  const bgHex = hexify(c.bg);
  return {
    pageShell: {
      position: 'relative', overflow: 'hidden',
      backgroundColor: c.bg, color: c.text,
      border: `1px solid ${c.border}`,
      borderRadius: '22px', boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
    },
    pageCanvas: {
      position: 'absolute', top: 0, left: 0, transformOrigin: 'top left',
    },
    cover: {
      position: 'relative', width: '100%', height: '100%',
      overflow: 'hidden', backgroundColor: c.bg,
    },
    coverImage: { width: '100%', height: '100%', objectFit: 'cover' },
    coverFallback: {
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#18181b', color: '#a1a1aa', fontSize: '18px',
    },
    coverOverlay: {
      position: 'absolute', left: 0, right: 0, inset: 0,
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.18), rgba(0,0,0,0.36) 35%, rgba(0,0,0,0.75))',
    },
    coverMeta: {
      margin: 0, textTransform: 'uppercase', letterSpacing: '0.18em',
      color: '#ffffff', fontSize: '14px', textAlign: 'center',
    },
    coverTop: {
      position: 'absolute', top: '34px', left: '34px', right: '34px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    coverTitle: {
      margin: 0, fontSize: '54px', lineHeight: 1,
      fontWeight: 800, color: '#ffffff', textAlign: 'center',
    },
    coverBlock: {
      position: 'absolute', left: 0, right: 0, bottom: 0,
      padding: '34px 30px 30px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
    },
    coverPresskit: {
      margin: 0, color: '#ffffff', fontSize: '13px',
      fontWeight: 800, letterSpacing: '0.32em', textTransform: 'uppercase',
    },
    pageTwo: {
      position: 'relative', width: '100%', height: '100%',
      backgroundColor: c.bg, color: c.title, padding: '42px 40px 40px',
    },
    pageTwoHeader: { textAlign: 'center', marginBottom: '26px' },
    pageTwoKicker: {
      margin: 0, color: c.accent,
      textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '13px',
    },
    pageTwoArtist: {
      margin: '10px 0 0 0', fontSize: '56px', lineHeight: 1,
      fontWeight: 800, color: c.title,
    },
    pageTwoBioCard: {
      borderRadius: '20px', border: `1px solid ${c.border}`,
      backgroundColor: c.card,
      padding: '20px', display: 'flex', flexDirection: 'column',
      gap: '14px', minHeight: 0,
    },
    pageTwoInfo: {
      color: c.accent, textTransform: 'uppercase',
      letterSpacing: '0.16em', fontSize: '12px',
    },
    pageTwoBio: {
      margin: 0, color: c.text, fontSize: '17px',
      lineHeight: 1.55, whiteSpace: 'pre-line',
    },
    pageTwoBody: {
      display: 'flex', flexDirection: 'column', gap: '18px', minHeight: '76%',
    },
    pageTwoVideoCard: {
      borderRadius: '20px', overflow: 'hidden',
      border: `1px solid ${c.border}`,
      backgroundColor: 'rgba(16,185,129,0.12)',
      display: 'flex', flexDirection: 'column',
    },
    pageTwoVideoImage: {
      width: '100%', height: 240, objectFit: 'cover', backgroundColor: '#111827',
    },
    pageTwoVideoBody: { padding: '16px 18px 18px' },
    pageTwoVideoKicker: {
      margin: 0, color: c.accent, fontSize: '12px',
      letterSpacing: '0.16em', textTransform: 'uppercase',
    },
    pageTwoVideoTitle: {
      margin: '8px 0 0 0', color: c.title,
      fontSize: '20px', lineHeight: 1.15, fontWeight: 800,
    },
    pageTwoVideoLink: {
      margin: '8px 0 0 0', color: c.accent,
      fontSize: '12px', textDecoration: 'underline', wordBreak: 'break-all',
    },
    pageThree: {
      position: 'relative', width: '100%', height: '100%',
      backgroundColor: c.bg, color: c.title, overflow: 'hidden',
    },
    pageThreeHeader: {
      height: '88px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderBottom: `1px solid ${c.border}`, padding: '0 24px',
    },
    pageThreeTitle: {
      margin: 0, color: c.accent, textTransform: 'uppercase',
      letterSpacing: '0.18em', fontSize: '13px', fontWeight: 800,
    },
    pageThreeBody: {
      display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '18px',
      height: 'calc(100% - 88px - 122px)', padding: '24px', minHeight: 0,
    },
    pageThreeImageCard: {
      borderRadius: '20px', overflow: 'hidden',
      border: `1px solid ${c.border}`, backgroundColor: c.card, minHeight: 0,
    },
    pageThreeImage: { width: '100%', height: '100%', objectFit: 'cover' },
    pageThreeFallback: {
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#d4d4d8', backgroundColor: 'rgba(255,255,255,0.04)', fontSize: '12px',
    },
    pageThreeCard: {
      borderRadius: '20px', border: `1px solid ${c.border}`,
      backgroundColor: c.card, padding: '18px', minHeight: 0,
    },
    pageThreeLabel: {
      margin: 0, color: c.accent, textTransform: 'uppercase',
      letterSpacing: '0.14em', fontSize: '12px', fontWeight: 800,
    },
    pageThreeText: {
      marginTop: '10px', marginRight: 0, marginBottom: 0, marginLeft: 0,
      color: c.text, fontSize: '15px', lineHeight: 1.5,
      display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 8,
      overflow: 'hidden', whiteSpace: 'pre-line',
    },
    pageThreeFooter: {
      position: 'absolute', left: 0, right: 0, bottom: 0,
      height: '122px', borderTop: `1px solid ${c.border}`,
      padding: '20px 24px 24px',
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
    },
    pageThreeMetric: {
      borderRadius: '18px',
      border: `1px solid ${accentHex}2e`,
      backgroundColor: `${accentHex}14`,
      padding: '16px',
    },
    pageThreeMetricLabel: {
      margin: 0, color: c.accent, textTransform: 'uppercase',
      letterSpacing: '0.14em', fontSize: '11px', fontWeight: 800,
    },
    pageThreeMetricValue: {
      marginTop: '8px', marginRight: 0, marginBottom: 0, marginLeft: 0,
      color: c.title, fontSize: '28px', lineHeight: 1, fontWeight: 900,
    },
    pageFour: {
      position: 'relative', width: '100%', height: '100%',
      backgroundColor: c.bg, color: c.title, overflow: 'hidden',
    },
    pageFourHeader: {
      height: '88px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderBottom: `1px solid ${c.border}`, padding: '0 24px',
    },
    pageFourTitle: {
      margin: 0, color: c.accent, textTransform: 'uppercase',
      letterSpacing: '0.18em', fontSize: `${14 * DOCUMENT_FONT_SCALE}px`, fontWeight: 800,
    },
    pageFourBody: {
      display: 'flex', flexDirection: 'column', gap: '18px',
      flex: 1, padding: '24px', minHeight: 0,
    },
    pageFourBioCard: {
      borderRadius: '20px', border: `1px solid ${c.border}`,
      backgroundColor: c.card, padding: '18px 18px 16px', minHeight: 0,
      flex: '0 0 26%',
    },
    pageFourBioText: {
      margin: 0, color: c.text, fontSize: `${16 * DOCUMENT_FONT_SCALE}px`, lineHeight: 1.55,
      display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 6,
      overflow: 'hidden', whiteSpace: 'pre-line',
    },
    pageFourVisualCard: {
      position: 'relative', flex: 1, minHeight: 0, borderRadius: '20px',
      overflow: 'hidden', border: `1px solid ${c.border}`, backgroundColor: c.card,
    },
    pageFourImageCard: { position: 'absolute', top: 0, left: 0, right: 0, bottom: '18px' },
    pageFourImage: { width: '100%', height: '100%', objectFit: 'cover' },
    pageFourFallback: {
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#d4d4d8', backgroundColor: 'rgba(255,255,255,0.04)', fontSize: `${12 * DOCUMENT_FONT_SCALE}px`,
    },
    pageFourMilestoneOverlay: {
      position: 'absolute', top: '16px', left: '16px', right: '16px',
      display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px',
    },
    pageFourMilestoneCard: {
      flex: '1 1 44%', borderRadius: '16px',
      border: `1px solid ${accentHex}33`,
      backgroundColor: `${bgHex}9e`,
      backdropFilter: 'blur(8px)', padding: '12px', overflow: 'hidden',
    },
    pageFourMilestoneLabel: {
      margin: 0, color: c.accent, textTransform: 'uppercase',
      letterSpacing: '0.14em', fontSize: `${10 * DOCUMENT_FONT_SCALE}px`, fontWeight: 800,
    },
    pageFourMilestoneList: {
      marginTop: '6px', marginRight: 0, marginBottom: 0, marginLeft: 0,
      color: c.text, fontSize: `${12 * DOCUMENT_FONT_SCALE}px`, lineHeight: 1.25,
      display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3,
      overflow: 'hidden', whiteSpace: 'pre-line',
    },
    pageFive: {
      position: 'relative', width: '100%', height: '100%',
      backgroundColor: c.bg, color: c.title, overflow: 'hidden',
    },
    pageFiveHeader: {
      height: '88px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderBottom: `1px solid ${c.border}`, padding: '0 24px',
    },
    pageFiveTitle: {
      margin: 0, color: c.accent, textTransform: 'uppercase',
      letterSpacing: '0.18em', fontSize: `${14 * DOCUMENT_FONT_SCALE}px`, fontWeight: 800,
    },
    pageFiveBody: {
      position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden', padding: '24px',
    },
    pageFiveImageCard: {
      position: 'absolute', inset: 0,
    },
    pageFiveImage: {
      width: '100%', height: '100%', objectFit: 'cover',
    },
    pageFiveFallback: {
      width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#d4d4d8', backgroundColor: 'rgba(255,255,255,0.04)', fontSize: `${12 * DOCUMENT_FONT_SCALE}px`,
    },
    pageFiveOverlay: {
      position: 'absolute', inset: 0, backgroundColor: 'rgba(10,10,18,0.18)',
    },
    pageFiveTextPanel: {
      position: 'absolute', left: '24px', right: '24px', bottom: '24px',
      borderRadius: '20px', border: `1px solid ${c.border}`,
      backgroundColor: 'rgba(10,10,18,0.74)', padding: '18px',
    },
    pageFiveText: {
      margin: 0, color: '#f4f4f5', fontSize: `${14 * DOCUMENT_FONT_SCALE}px`, lineHeight: 1.55, whiteSpace: 'pre-line',
    },
    releasePage: {
      position: 'relative', width: '100%', height: '100%',
      backgroundColor: c.bg, color: c.title, overflow: 'hidden',
    },
    releaseHeader: {
      height: '88px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderBottom: `1px solid ${c.border}`, padding: '0 24px',
    },
    releaseTitle: {
      margin: 0, color: c.accent, textTransform: 'uppercase',
      letterSpacing: '0.18em', fontSize: `${13 * DOCUMENT_FONT_SCALE}px`, fontWeight: 800,
    },
    releaseBody: {
      display: 'flex', flexDirection: 'column', minHeight: 0, padding: '18px 24px 24px',
      gap: 0,
    },
    releaseItem: {
      display: 'flex', flexDirection: 'row', minHeight: '140px',
      borderBottom: `1px solid ${c.border}`,
      overflow: 'hidden',
    },
    releaseItemLast: {
      borderBottom: 'none',
    },
    releaseThumbWrap: {
      position: 'relative', minHeight: '140px', padding: '12px',
      borderRight: `1px solid ${c.border}`,
      flex: '1 1 0%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    releaseThumb: {
      width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px',
      backgroundColor: 'rgba(255,255,255,0.04)',
    },
    releaseThumbFallback: {
      width: '100%', height: '100%', borderRadius: '12px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#d4d4d8', backgroundColor: 'rgba(255,255,255,0.04)', fontSize: `${12 * DOCUMENT_FONT_SCALE}px`,
    },
    releasePlay: {
      position: 'absolute', inset: '12px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.0)', textDecoration: 'none',
    },
    releasePlayButton: {
      width: '48px', height: '48px', borderRadius: '999px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.9)', color: '#0a0a12',
      fontSize: '18px', fontWeight: 900,
    },
    releaseInfo: {
      flex: '2 1 0%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: '14px 16px 14px 16px', minHeight: '140px', gap: '10px',
    },
    releaseName: {
      margin: 0, color: c.title, fontSize: `${16 * DOCUMENT_FONT_SCALE}px`, lineHeight: 1.15, fontWeight: 900,
      display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden',
    },
    releaseDescription: {
      marginTop: '8px', marginRight: 0, marginBottom: 0, marginLeft: 0,
      color: c.text, fontSize: `${12 * DOCUMENT_FONT_SCALE}px`, lineHeight: 1.35,
      display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden',
    },
    releaseAuthor: {
      margin: 0, color: c.accent, fontSize: `${13 * DOCUMENT_FONT_SCALE}px`, lineHeight: 1.2, fontWeight: 700,
    },
    linksPage: {
      position: 'relative', width: '100%', height: '100%',
      backgroundColor: c.bg, color: c.title, overflow: 'hidden',
    },
    linksHeader: {
      height: '88px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderBottom: `1px solid ${c.border}`, padding: '0 24px',
    },
    linksTitle: {
      margin: 0, color: c.accent, textTransform: 'uppercase',
      letterSpacing: '0.18em', fontSize: `${13 * DOCUMENT_FONT_SCALE}px`, fontWeight: 800,
    },
    linksBody: {
      display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '12px',
      flex: 1, minHeight: 0, padding: '20px', overflow: 'hidden',
    },
    linkCard: {
      width: 'calc(50% - 6px)',
      borderRadius: '18px', border: `1px solid ${c.border}`,
      backgroundColor: c.card, padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px',
      overflow: 'hidden', minHeight: 0,
    },
    linkAvatar: {
      width: '100%', height: '96px', borderRadius: '14px',
      overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.04)',
    },
    linkAvatarImg: {
      width: '100%', height: '100%', objectFit: 'cover', display: 'block',
    },
    linkAvatarFallback: {
      width: '100%', height: '96px', borderRadius: '14px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: '6px',
      color: '#d4d4d8', backgroundColor: `${accentHex}1a`, fontSize: `${11 * DOCUMENT_FONT_SCALE}px`,
    },
    linkName: {
      margin: 0, color: c.title, fontSize: `${18 * DOCUMENT_FONT_SCALE}px`, lineHeight: 1.1, fontWeight: 900,
      display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden',
    },
    linkDomain: {
      margin: 0, color: c.accent, fontSize: `${11 * DOCUMENT_FONT_SCALE}px`, lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: '0.14em',
    },
    collagePage: {
      position: 'relative', width: '100%', height: '100%',
      backgroundColor: c.bg, color: c.title, overflow: 'hidden',
    },
    collageHeader: {
      height: '88px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      borderBottom: `1px solid ${c.border}`, padding: '0 24px',
    },
    collageTitle: {
      margin: 0, color: c.accent, textTransform: 'uppercase',
      letterSpacing: '0.18em', fontSize: `${13 * DOCUMENT_FONT_SCALE}px`, fontWeight: 800,
    },
    collageBody: {
      display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '10px',
      flex: 1, minHeight: 0, overflow: 'hidden', padding: '18px 24px 24px',
    },
    collageItem: {
      overflow: 'hidden', borderRadius: '16px',
      backgroundColor: 'rgba(255,255,255,0.05)',
    },
    collageImage: {
      width: '100%', height: '100%', objectFit: 'cover',
    },
    contactPage: {
      position: 'relative', width: '100%', height: '100%',
      backgroundColor: c.bg, color: c.title, overflow: 'hidden',
    },
    contactHeader: {
      minHeight: '130px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      borderBottom: `1px solid ${c.border}`, padding: '18px 24px',
    },
    contactArtist: {
      marginTop: '8px', color: c.title,
      fontSize: '26px', lineHeight: 1.05, fontWeight: 900, textAlign: 'center',
    },
    contactLogoImg: {
      marginTop: '12px', width: '100%', maxHeight: '56px', objectFit: 'contain',
    },
    contactTitle: {
      margin: 0, color: c.accent, textTransform: 'uppercase',
      letterSpacing: '0.18em', fontSize: `${13 * DOCUMENT_FONT_SCALE}px`, fontWeight: 800,
    },
    contactBody: {
      display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px', minHeight: 0,
    },
    contactCard: {
      borderRadius: '18px', border: `1px solid ${c.border}`, backgroundColor: c.card,
      padding: '14px',
    },
    contactLabel: {
      margin: 0, color: c.accent, textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: `${11 * DOCUMENT_FONT_SCALE}px`, fontWeight: 800,
    },
    contactValue: {
      marginTop: '8px', marginRight: 0, marginBottom: 0, marginLeft: 0,
      color: c.title, fontSize: `${20 * DOCUMENT_FONT_SCALE}px`, lineHeight: 1.15, fontWeight: 800,
    },
  };
}

function PageFrame({ scale, pdfStyles, children }) {
  const scaledWidth = A4_WIDTH * scale;
  const scaledHeight = A4_HEIGHT * scale;

  return (
    <article style={{ ...pdfStyles.pageShell, width: `${scaledWidth}px`, height: `${scaledHeight}px` }}>
      <div style={{ ...pdfStyles.pageCanvas, width: `${A4_WIDTH}px`, height: `${A4_HEIGHT}px`, transform: `scale(${scale})` }}>
        {children}
      </div>
    </article>
  );
}

function PresskitDocument({ presskitData, scale = 1 }) {
  const { theme: uiTheme } = useTheme();
  const c = {
    bg:     uiTheme.bgColor     || '#0a0a12',
    card:   uiTheme.cardBg      || 'rgba(255,255,255,0.05)',
    title:  uiTheme.titleColor  || '#ffffff',
    text:   uiTheme.textColor   || '#f4f4f5',
    accent: uiTheme.accentColor || '#67e8f9',
    border: uiTheme.borderColor || 'rgba(255,255,255,0.12)',
  };
  const pdfStyles = makePdfStyles(c);

  const cover = presskitData.images?.[0] || '';
  const artistName = presskitData.artistName || 'Nombre del artista';
  const genre = presskitData.genre || 'Genero';
  const city = presskitData.city || 'Ciudad';
  const bio = presskitData.bio || 'Agrega una biografia para mostrar tu historia.';
  const performanceLiveLink = presskitData.performanceLiveLink || '';
  const performanceLiveThumbnail = getYoutubeThumbnailUrl(performanceLiveLink);
  const recognitionImage = presskitData.recognitionImage || '';
  const recognitions = presskitData.recognitions || 'Añade reconocimientos, escenarios, playlists, becas, festivales o formación para completar esta sección.';
  const totalStreams = presskitData.totalStreams || 'Sin dato';
  const totalVideoViews = presskitData.totalVideoViews || 'Sin dato';
  const bio140Image = presskitData.twitterBioImage || '';
  const bio140 = presskitData.twitterBio || 'Sin bio de 140 caracteres.';
  const longBioImage = presskitData.longBioImage || '';
  const longBio = presskitData.longBio || presskitData.bio || 'Sin biografía completa.';
  const releases = Array.isArray(presskitData.releases) ? presskitData.releases.slice(0, 8) : [];
  const collageImages = (Array.isArray(presskitData.images) ? presskitData.images : []).filter(isHttpUrl).slice(0, 12);
  const filledLinks = Object.entries(presskitData.links || {})
    .filter(([, value]) => isHttpUrl(value))
    .map(([key, value]) => ({
      key,
      value,
      label: PLATFORM_CONFIG[key]?.label || key,
      Icon:  PLATFORM_CONFIG[key]?.Icon  || null,
      screenshot: presskitData.linkScreenshots?.[key] || '',
      metric:     presskitData.linkMetrics?.[key]     || '',
    }));
  const contactArtistName = presskitData.contactArtistName || presskitData.artistName || 'Nombre del artista';
  const managerName = presskitData.managerName || 'Sin manager';
  const roadManagerName = presskitData.roadManagerName || 'Sin road manager';
  const contactCountryCode = presskitData.contactCountryCode || '+57';
  const contactPhone = presskitData.contactPhone || 'Sin teléfono';
  const contactLogo = presskitData.contactLogo || '';
  const milestoneCards = getMilestonesByCategory(presskitData.artistMilestones);
  const releasePages = chunkArray(releases, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
      <PageFrame scale={scale} pdfStyles={pdfStyles}>
        <div style={pdfStyles.cover}>
          {cover ? (
            <img src={cover} alt={artistName} style={pdfStyles.coverImage} />
          ) : (
            <div style={pdfStyles.coverFallback}>Sin portada</div>
          )}
          <div style={pdfStyles.coverOverlay} />
          <div style={pdfStyles.coverTop}>
            <h2 style={pdfStyles.coverTitle}>{artistName}</h2>
          </div>
          <div style={pdfStyles.coverBlock}>
            <p style={pdfStyles.coverPresskit}>PRESSKIT</p>
          </div>
        </div>
      </PageFrame>

      <PageFrame scale={scale} pdfStyles={pdfStyles}>
        <div style={pdfStyles.pageTwo}>
          <div style={pdfStyles.pageTwoHeader}>
            <p style={pdfStyles.pageTwoKicker}>Conoce a</p>
            <h2 style={pdfStyles.pageTwoArtist}>{artistName}</h2>
          </div>

          <div style={pdfStyles.pageTwoBody}>
            <div style={pdfStyles.pageTwoBioCard}>
              <p style={pdfStyles.pageTwoInfo}>{genre} · {city}</p>
              <p style={pdfStyles.pageTwoBio}>{bio}</p>
            </div>
            {performanceLiveLink ? (
              <div style={pdfStyles.pageTwoVideoCard}>
                {performanceLiveThumbnail ? (
                  <img src={performanceLiveThumbnail} alt="Performance en vivo" style={pdfStyles.pageTwoVideoImage} />
                ) : (
                  <div style={{ ...pdfStyles.pageTwoVideoImage, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4d4d8' }}>
                    Sin thumbnail de video
                  </div>
                )}

                <div style={pdfStyles.pageTwoVideoBody}>
                  <p style={pdfStyles.pageTwoVideoKicker}>Live Performance</p>
                  <p style={pdfStyles.pageTwoVideoTitle}>Mira mi performance en vivo</p>
                  <a href={performanceLiveLink} target="_blank" rel="noopener noreferrer" style={pdfStyles.pageTwoVideoLink}>
                    {performanceLiveLink}
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </PageFrame>

      <PageFrame scale={scale} pdfStyles={pdfStyles}>
        <div style={pdfStyles.pageThree}>
          <div style={pdfStyles.pageThreeHeader}>
            <p style={pdfStyles.pageThreeTitle}>Reconocimientos y Streams</p>
          </div>

          <div style={pdfStyles.pageThreeBody}>
            <div style={pdfStyles.pageThreeImageCard}>
              {recognitionImage ? (
                <img src={recognitionImage} alt="Reconocimientos" style={pdfStyles.pageThreeImage} />
              ) : (
                <div style={pdfStyles.pageThreeFallback}>Sin imagen de reconocimientos</div>
              )}
            </div>

            <div style={pdfStyles.pageThreeCard}>
              <p style={pdfStyles.pageThreeLabel}>Reconocimientos</p>
              <p style={pdfStyles.pageThreeText}>{recognitions}</p>
            </div>
          </div>

          <div style={pdfStyles.pageThreeFooter}>
            <div style={pdfStyles.pageThreeMetric}>
              <p style={pdfStyles.pageThreeMetricLabel}>Total streams</p>
              <p style={pdfStyles.pageThreeMetricValue}>{totalStreams}</p>
            </div>
            <div style={pdfStyles.pageThreeMetric}>
              <p style={pdfStyles.pageThreeMetricLabel}>Total video views</p>
              <p style={pdfStyles.pageThreeMetricValue}>{totalVideoViews}</p>
            </div>
          </div>
        </div>
      </PageFrame>

      <PageFrame scale={scale} pdfStyles={pdfStyles}>
        <div style={pdfStyles.pageFour}>
          <div style={pdfStyles.pageFourHeader}>
            <p style={pdfStyles.pageFourTitle}>Biografía</p>
          </div>

          <div style={pdfStyles.pageFourBody}>
            <div style={pdfStyles.pageFourBioCard}>
              <p style={pdfStyles.pageFourBioText}>{bio140}</p>
            </div>

            <div style={pdfStyles.pageFourVisualCard}>
              {bio140Image ? (
                <img src={bio140Image} alt={`Bio de 140 caracteres de ${artistName}`} style={pdfStyles.pageFourImage} />
              ) : (
                <div style={pdfStyles.pageFourFallback}>Sin imagen de bio de 140 caracteres</div>
              )}

              <div style={pdfStyles.pageFourMilestoneOverlay}>
                {milestoneCards.map((milestone) => (
                  <div key={milestone.key} style={pdfStyles.pageFourMilestoneCard}>
                    <p style={pdfStyles.pageFourMilestoneLabel}>{milestone.label}</p>
                    <p style={pdfStyles.pageFourMilestoneList}>
                      {milestone.items.length > 0
                        ? milestone.items.slice(0, 3).map((item) => `• ${item}`).join('\n')
                        : 'Sin hitos registrados.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageFrame>

      <PageFrame scale={scale} pdfStyles={pdfStyles}>
        <div style={pdfStyles.pageFive}>
          <div style={pdfStyles.pageFiveHeader}>
            <p style={pdfStyles.pageFiveTitle}>Biografía</p>
          </div>

          <div style={pdfStyles.pageFiveBody}>
            {longBioImage ? (
              <img src={longBioImage} alt="Biografía" style={pdfStyles.pageFiveImage} />
            ) : (
              <div style={pdfStyles.pageFiveFallback}>Sin imagen de biografía completa</div>
            )}

            <div style={pdfStyles.pageFiveOverlay} />

            <div style={pdfStyles.pageFiveTextPanel}>
              <p style={pdfStyles.pageFiveText}>{longBio}</p>
            </div>
          </div>
        </div>
      </PageFrame>

      {releasePages.map((releaseChunk, pageIndex) => (
        <PageFrame key={`release-page-${pageIndex}`} scale={scale} pdfStyles={pdfStyles}>
          <div style={pdfStyles.releasePage}>
            <div style={pdfStyles.releaseHeader}>
              <p style={pdfStyles.releaseTitle}>
                Video Releases {releasePages.length > 1 ? `(${pageIndex + 1}/${releasePages.length})` : ''}
              </p>
            </div>

            <div style={pdfStyles.releaseBody}>
              {releaseChunk.map((release, releaseIndex) => {
                const videoId = String(release?.url || '').match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
                const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '';
                const isLast = releaseIndex === releaseChunk.length - 1;

                return (
                  <div key={`${pageIndex}-${releaseIndex}-${release?.title || 'release'}`} style={{ ...pdfStyles.releaseItem, ...(isLast ? pdfStyles.releaseItemLast : {}) }}>
                    <div style={pdfStyles.releaseThumbWrap}>
                      {thumbnail ? (
                        <>
                          <img src={thumbnail} alt={release?.title || 'Release'} style={pdfStyles.releaseThumb} />
                          {release?.url ? (
                            <a href={release.url} target="_blank" rel="noopener noreferrer" style={pdfStyles.releasePlay}>
                              <div style={pdfStyles.releasePlayButton}>▶</div>
                            </a>
                          ) : null}
                        </>
                      ) : (
                        <div style={pdfStyles.releaseThumbFallback}>Sin video</div>
                      )}
                    </div>

                    <div style={pdfStyles.releaseInfo}>
                      <div>
                        <p style={pdfStyles.releaseName}>{release?.title || 'Release sin titulo'}</p>
                        {release?.description ? <p style={pdfStyles.releaseDescription}>{release.description}</p> : null}
                      </div>
                      {release?.author ? <p style={pdfStyles.releaseAuthor}>{release.author}</p> : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </PageFrame>
      ))}

      {filledLinks.length > 0 ? (
        <PageFrame scale={scale} pdfStyles={pdfStyles}>
          <div style={pdfStyles.linksPage}>
            <div style={pdfStyles.linksHeader}>
              <p style={pdfStyles.linksTitle}>Conecta con {presskitData.artistName || 'Nombre del artista'}</p>
            </div>

            <div style={pdfStyles.linksBody}>
              {filledLinks.map(({ key, value, label, Icon, screenshot, metric }, index) => {
                const domain = getLinkDomain(value);
                return (
                  <a
                    key={`link-${key}-${index}`}
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...pdfStyles.linkCard, textDecoration: 'none' }}
                  >
                    {screenshot ? (
                      <div style={pdfStyles.linkAvatar}>
                        <img src={screenshot} alt={label} style={pdfStyles.linkAvatarImg} />
                      </div>
                    ) : (
                      <div style={pdfStyles.linkAvatarFallback}>
                        {Icon ? <Icon style={{ fontSize: '28px', color: c.accent }} /> : null}
                        <span>{domain || label}</span>
                      </div>
                    )}
                    <p style={pdfStyles.linkName}>{metric || label}</p>
                    <p style={pdfStyles.linkDomain}>{domain}</p>
                  </a>
                );
              })}
            </div>
          </div>
        </PageFrame>
      ) : null}

      {collageImages.length > 0 ? (
        <PageFrame scale={scale} pdfStyles={pdfStyles}>
          <div style={pdfStyles.collagePage}>
            <div style={pdfStyles.collageHeader}>
              <p style={pdfStyles.collageTitle}>Galería visual</p>
            </div>

            <div style={pdfStyles.collageBody}>
              {collageImages.map((image, index) => {
                const isWide = index % 5 === 0;
                const isTall = index % 5 === 2;
                const width = isWide ? '64%' : isTall ? '32%' : '47%';
                const height = isWide ? '150px' : isTall ? '220px' : '170px';
                return (
                  <div key={`collage-${index}`} style={{ ...pdfStyles.collageItem, width, height }}>
                    <img src={image} alt={`Galería ${index + 1}`} style={pdfStyles.collageImage} />
                  </div>
                );
              })}
            </div>
          </div>
        </PageFrame>
      ) : null}

      <PageFrame scale={scale} pdfStyles={pdfStyles}>
        <div style={pdfStyles.contactPage}>
          <div style={pdfStyles.contactHeader}>
            <p style={pdfStyles.contactTitle}>Contacto</p>
            <h2 style={pdfStyles.contactArtist}>{contactArtistName}</h2>
            {contactLogo ? <img src={contactLogo} alt="Logo de contacto" style={pdfStyles.contactLogoImg} /> : null}
          </div>

          <div style={pdfStyles.contactBody}>

            <div style={pdfStyles.contactCard}>
              <p style={pdfStyles.contactLabel}>Manager</p>
              <p style={pdfStyles.contactValue}>{managerName}</p>
            </div>

            <div style={pdfStyles.contactCard}>
              <p style={pdfStyles.contactLabel}>Road Manager</p>
              <p style={pdfStyles.contactValue}>{roadManagerName}</p>
            </div>

            <div style={pdfStyles.contactCard}>
              <p style={pdfStyles.contactLabel}>Contacto</p>
              <p style={pdfStyles.contactValue}>{contactCountryCode} {contactPhone}</p>
            </div>

            <div style={pdfStyles.contactCard}>
              <p style={pdfStyles.contactLabel}>Artista</p>
              <p style={pdfStyles.contactValue}>{contactArtistName}</p>
            </div>
          </div>
        </div>
      </PageFrame>
    </div>
  );
}

function getYoutubeThumbnailUrl(url) {
  if (!url) return '';
  const match = String(url).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  const videoId = match?.[1];
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
}

function getMilestonesByCategory(artistMilestones) {
  const milestones = artistMilestones || {};
  return [
    { key: 'digital', label: 'Digital', items: Array.isArray(milestones.digital) ? milestones.digital : [] },
    { key: 'live', label: 'Live', items: Array.isArray(milestones.live) ? milestones.live : [] },
    { key: 'press', label: 'Press', items: Array.isArray(milestones.press) ? milestones.press : [] },
    { key: 'collaborations', label: 'Colaboraciones', items: Array.isArray(milestones.collaborations) ? milestones.collaborations : [] },
  ];
}

export default PresskitDocument;

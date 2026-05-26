import { useTheme } from '../../context/ThemeContext.tsx';

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;

function hexify(color) {
  if (!color) return '#000000';
  if (/^#[0-9a-f]{6}$/i.test(color)) return color;
  const h3 = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(color);
  if (h3) return `#${h3[1]}${h3[1]}${h3[2]}${h3[2]}${h3[3]}${h3[3]}`;
  const m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i.exec(color);
  if (m) return '#' + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join('');
  return '#000000';
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
    coverTitle: {
      margin: '14px 0 0 0', fontSize: '54px', lineHeight: 1,
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
      letterSpacing: '0.18em', fontSize: '14px', fontWeight: 800,
    },
    pageFourBody: {
      display: 'flex', flexDirection: 'column', gap: '18px',
      flex: 1, padding: '24px', minHeight: 0,
    },
    pageFourBioCard: {
      borderRadius: '20px', border: `1px solid ${c.border}`,
      backgroundColor: c.card, padding: '18px 18px 16px', minHeight: 0,
    },
    pageFourBioText: {
      margin: 0, color: c.text, fontSize: '16px', lineHeight: 1.55,
      display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 6,
      overflow: 'hidden', whiteSpace: 'pre-line',
    },
    pageFourVisualCard: {
      position: 'relative', flex: 1, minHeight: 0, borderRadius: '20px',
      overflow: 'hidden', border: `1px solid ${c.border}`, backgroundColor: c.card,
    },
    pageFourImageCard: { position: 'absolute', inset: 0 },
    pageFourImage: { width: '100%', height: '100%', objectFit: 'cover' },
    pageFourFallback: {
      width: '100%', height: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#d4d4d8', backgroundColor: 'rgba(255,255,255,0.04)', fontSize: '12px',
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
      letterSpacing: '0.14em', fontSize: '10px', fontWeight: 800,
    },
    pageFourMilestoneList: {
      marginTop: '6px', marginRight: 0, marginBottom: 0, marginLeft: 0,
      color: c.text, fontSize: '12px', lineHeight: 1.25,
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
      letterSpacing: '0.18em', fontSize: '14px', fontWeight: 800,
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
      color: '#d4d4d8', backgroundColor: 'rgba(255,255,255,0.04)', fontSize: '12px',
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
      margin: 0, color: '#f4f4f5', fontSize: '14px', lineHeight: 1.55, whiteSpace: 'pre-line',
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

function PresskitPDF({ presskitData, scale = 1 }) {
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
  const milestoneCards = getMilestonesByCategory(presskitData.artistMilestones);

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
          <div style={pdfStyles.coverBlock}>
            <p style={pdfStyles.coverMeta}>{genre} · {city}</p>
            <h2 style={pdfStyles.coverTitle}>{artistName}</h2>
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

export default PresskitPDF;

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext.tsx';

const PAGE_W = 595;
const PAGE_H = 842;
const PLATFORM_LABELS = {
  instagram: 'Instagram', spotify: 'Spotify', facebook: 'Facebook',
  youtube: 'YouTube', tiktok: 'TikTok', appleMusic: 'Apple Music', soundcloud: 'SoundCloud',
};

function PageHeader({ title, color = '#67e8f9', bg = '#0a0a12', font = 'system-ui, sans-serif', border = 'rgba(255,255,255,0.10)' }) {
  return (
    <div style={{ height: 68, borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: bg }}>
      <span style={{ color, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 11, fontWeight: 800, fontFamily: font }}>{title}</span>
    </div>
  );
}

function BgImage({ src, scrim = 'rgba(0,0,0,0.52)' }) {
  if (!src) return <div style={{ position: 'absolute', inset: 0, background: scrim }} />;
  return (
    <>
      <img src={src} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: scrim }} />
    </>
  );
}

function buildPages(d, tc = {}) {
  const ACCENT   = tc.accent   || '#67e8f9';
  const BG       = tc.bg       || '#0a0a12';
  const WHITE    = tc.title    || '#ffffff';
  const FONT     = tc.fontFamily || 'system-ui, sans-serif';
  const SUBTITLE = tc.subtitle || 'rgba(255,255,255,0.55)';
  const TEXT     = tc.text     || '#f4f4f5';
  const CARD_BG  = tc.cardBg   || 'rgba(255,255,255,0.06)';
  const BORDER   = tc.border   || 'rgba(255,255,255,0.10)';
  const OVERLAY  = tc.overlay  || 'rgba(0,0,0,0.55)';

  const accentRgba = (alpha) => {
    const h = (ACCENT.startsWith('#') ? ACCENT : '#67e8f9').replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };
  const bgRgba = (alpha) => {
    const h = (BG.startsWith('#') ? BG : '#0a0a12').replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };
  const images = d.images || [];
  const coverImg   = images[0] || '';
  const heroImg    = images[1] || '';
  const bioImg     = d.bioImage     || heroImg;
  const longBioImg = d.longBioImage || heroImg;
  const releases   = (d.releases || []).slice(0, 8);
  const galleryImgs = images.slice(1, 5).filter(Boolean);
  const contactLogo = d.contactLogo || '';
  const milestones  = [
    ...(d.artistMilestones?.digital || []),
    ...(d.artistMilestones?.live || []),
    ...(d.artistMilestones?.press || []),
    ...(d.artistMilestones?.collaborations || []),
  ].filter(Boolean).slice(0, 12);
  const filledLinks = Object.entries(d.links || {})
    .filter(([, v]) => typeof v === 'string' && v.startsWith('http'))
    .slice(0, 8);

  const pages = [];

  // ── 1. Cover ──────────────────────────────────────────────────────────────
  pages.push(
    <div key="cover" style={{ width: PAGE_W, height: PAGE_H, position: 'relative', backgroundColor: BG, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
      <BgImage src={coverImg} scrim="rgba(0,0,0,0.38)" />
      <div style={{ position: 'relative', zIndex: 1, paddingTop: 28, textAlign: 'center' }}>
        <div style={{ fontSize: 30, fontWeight: 900, color: WHITE, lineHeight: 1.1, fontFamily: FONT }}>{d.artistName || 'Presskit'}</div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, paddingBottom: 28 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: WHITE }}>PRESSKIT</div>
      </div>
    </div>
  );

  // ── 2. Bio intro ──────────────────────────────────────────────────────────
  pages.push(
    <div key="bio-intro" style={{ width: PAGE_W, height: PAGE_H, position: 'relative', backgroundColor: BG, overflow: 'hidden' }}>
      <BgImage src={bioImg} scrim={OVERLAY} />
      <div style={{ position: 'absolute', top: 28, left: 40, right: 40, zIndex: 1, textAlign: 'center' }}>
        <div style={{ color: ACCENT, fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700 }}>CONOCE A</div>
        <div style={{ fontSize: 40, fontWeight: 900, color: WHITE, lineHeight: 1.05, marginTop: 6 }}>{d.artistName || ''}</div>
      </div>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 40px 60px' }}>
        {(d.genre || d.city) && (
          <div style={{ color: ACCENT, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
            {[d.genre, d.city].filter(Boolean).join(' • ')}
          </div>
        )}
        <div style={{ color: TEXT, fontSize: 13, lineHeight: 1.6, textAlign: 'center' }}>
          {d.shortBio || d.bio || ''}
        </div>
      </div>
    </div>
  );

  // ── 3. Recognitions & Streams ────────────────────────────────────────────
  pages.push(
    <div key="recog" style={{ width: PAGE_W, height: PAGE_H, backgroundColor: BG, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <PageHeader title="Reconocimientos y Streams" color={ACCENT} bg={BG} font={FONT} border={BORDER} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', gap: 14, padding: '16px 18px 0', minHeight: 0, overflow: 'hidden' }}>
        <div style={{ width: '42%', borderRadius: 14, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
          {d.recognitionImage
            ? <img src={d.recognitionImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', background: CARD_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: SUBTITLE, fontSize: 10 }}>Sin imagen</span></div>
          }
        </div>
        <div style={{ flex: 1, borderRadius: 14, border: `1px solid ${BORDER}`, background: CARD_BG, padding: 14, overflow: 'hidden' }}>
          <div style={{ color: ACCENT, fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em' }}>Reconocimientos</div>
          <div style={{ color: WHITE, fontSize: 12, lineHeight: 1.5, marginTop: 8 }}>{d.recognitions || ''}</div>
        </div>
      </div>
      <div style={{ height: 108, borderTop: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'row', gap: 12, padding: '12px 18px 18px', flexShrink: 0 }}>
        {[['Total Streams', d.totalStreams], ['Video Views', d.totalVideoViews]].map(([label, value]) => (
          <div key={label} style={{ flex: 1, borderRadius: 14, border: `1px solid ${accentRgba(0.25)}`, background: accentRgba(0.08), padding: 14 }}>
            <div style={{ color: ACCENT, fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.16em' }}>{label}</div>
            <div style={{ color: WHITE, fontSize: 24, fontWeight: 900, lineHeight: 1, marginTop: 6 }}>{value || 'Sin dato'}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── 4. Biography + milestones ─────────────────────────────────────────────
  pages.push(
    <div key="bio4" style={{ width: PAGE_W, height: PAGE_H, backgroundColor: BG, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <PageHeader title="Biografía" color={ACCENT} bg={BG} font={FONT} border={BORDER} />
      {(d.twitterBio) && (
        <div style={{ padding: '14px 24px', flexShrink: 0, textAlign: 'center' }}>
          <div style={{ color: TEXT, fontSize: 12, lineHeight: 1.5 }}>{d.twitterBio}</div>
        </div>
      )}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {d.twitterBioImage && <img src={d.twitterBioImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
        <div style={{ position: 'absolute', inset: 0, background: OVERLAY }} />
        <div style={{ position: 'absolute', inset: '10px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', zIndex: 1 }}>
          {milestones.map((m, i) => (
            <div key={i} style={{ width: '100%', borderRadius: 8, border: `1px solid ${accentRgba(0.28)}`, background: bgRgba(0.72), padding: `${milestones.length <= 4 ? 7 : 5}px 12px`, textAlign: 'center' }}>
              <span style={{ color: TEXT, fontSize: milestones.length <= 4 ? 11 : milestones.length <= 8 ? 9.5 : 8, fontWeight: 500 }}>{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── 5. Long bio / Press bio ───────────────────────────────────────────────
  const longBio = d.longBio || d.bio || '';
  if (longBio) {
    pages.push(
      <div key="bio5" style={{ width: PAGE_W, height: PAGE_H, position: 'relative', backgroundColor: BG, overflow: 'hidden' }}>
        <BgImage src={longBioImg} scrim={OVERLAY} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 68, borderBottom: `1px solid ${BORDER}`, background: 'rgba(10,10,18,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
          <span style={{ color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 11, fontWeight: 800 }}>BIOGRAFÍA DE PRENSA</span>
        </div>
        <div style={{ position: 'absolute', top: 76, left: 36, right: 36, bottom: 28, zIndex: 1, overflow: 'hidden' }}>
          <div style={{ color: WHITE, fontSize: 16, fontWeight: 800, marginBottom: 14, textAlign: 'center' }}>{d.artistName || ''}</div>
          <div style={{ color: WHITE, fontSize: 13, lineHeight: 1.65, textAlign: 'center' }}>{longBio}</div>
        </div>
      </div>
    );
  }

  // ── 6. Releases ───────────────────────────────────────────────────────────
  if (releases.length > 0) {
    const chunks = [];
    for (let i = 0; i < releases.length; i += 4) chunks.push(releases.slice(i, i + 4));
    chunks.forEach((chunk, ci) => {
      pages.push(
        <div key={`releases-${ci}`} style={{ width: PAGE_W, height: PAGE_H, backgroundColor: BG, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ borderBottom: `1px solid ${BORDER}`, padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 11, fontWeight: 800 }}>
              Video Releases{chunks.length > 1 ? ` (${ci + 1}/${chunks.length})` : ''}
            </span>
            {ci === 0 && d.releasesCtaText && (
              <span style={{ color: SUBTITLE, fontSize: 9, fontStyle: 'italic', marginTop: 4 }}>{d.releasesCtaText}</span>
            )}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px 16px', gap: 8 }}>
            {chunk.map((r, ri) => {
              const vidId = String(r.url || '').match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
              const thumb = vidId ? `https://img.youtube.com/vi/${vidId}/mqdefault.jpg` : '';
              return (
                <div key={ri} style={{ flex: 1, display: 'flex', flexDirection: 'row', borderRadius: 12, border: `1px solid ${BORDER}`, background: CARD_BG, overflow: 'hidden' }}>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    {thumb
                      ? <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', background: '#1a1a2e' }} />
                    }
                  </div>
                  <div style={{ flex: 2, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
                    <div style={{ color: WHITE, fontSize: 13, fontWeight: 900, lineHeight: 1.2 }}>{r.title || ''}</div>
                    {r.author && <div style={{ color: ACCENT, fontSize: 10, marginTop: 4 }}>{r.author}</div>}
                    {r.description && <div style={{ color: SUBTITLE, fontSize: 10, marginTop: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{r.description}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  }

  // ── 7. Links ──────────────────────────────────────────────────────────────
  if (filledLinks.length > 0) {
    pages.push(
      <div key="links" style={{ width: PAGE_W, height: PAGE_H, position: 'relative', backgroundColor: BG, overflow: 'hidden' }}>
        <BgImage src={heroImg || coverImg} scrim={OVERLAY} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 26, zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ color: ACCENT, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.22em' }}>CONECTA CON</span>
          <span style={{ color: WHITE, fontSize: 36, fontWeight: 900, marginTop: 4, lineHeight: 1 }}>{d.artistName || ''}</span>
        </div>
        <div style={{ position: 'absolute', left: 26, right: 26, top: 124, bottom: 22, zIndex: 1, borderRadius: 12, border: `1px solid ${BORDER}`, background: bgRgba(0.75), overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {filledLinks.map(([key, url], i) => {
            const isLast = i === filledLinks.length - 1;
            const label = PLATFORM_LABELS[key] || key;
            const metric = (d.linkMetrics || {})[key] || '';
            const iconUrl = `/icons/pdf-assets/${key === 'appleMusic' ? 'applemusic' : key}.png`;
            return (
              <div key={key} style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: isLast ? 'none' : `1px solid rgba(255,255,255,0.10)` }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: WHITE, border: `2px solid ${WHITE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 14, flexShrink: 0, overflow: 'hidden', padding: 4 }}>
                  <img src={iconUrl} alt={label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
                <span style={{ flex: 1, color: WHITE, textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: 10, fontWeight: 800 }}>{label}</span>
                {metric && <span style={{ color: WHITE, fontSize: 11, fontWeight: 900 }}>{metric}</span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── 8. Gallery ────────────────────────────────────────────────────────────
  if (galleryImgs.length > 0) {
    pages.push(
      <div key="gallery" style={{ width: PAGE_W, height: PAGE_H, backgroundColor: BG, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <PageHeader title="Galería Visual" color={ACCENT} bg={BG} font={FONT} border={BORDER} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 14px 14px', gap: 8 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'row', gap: 8 }}>
            {galleryImgs.slice(0, 2).map((img, i) => (
              <div key={i} style={{ flex: 1, borderRadius: 12, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'row', gap: 8 }}>
            {galleryImgs.slice(2, 4).map((img, i) => (
              <div key={i} style={{ flex: 1, borderRadius: 12, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── 9. Horizontal gallery ─────────────────────────────────────────────────
  const horizImgs = [images[5], images[6]].filter(Boolean);
  if (horizImgs.length > 0) {
    pages.push(
      <div key="gallery-horiz" style={{ width: PAGE_W, height: PAGE_H, backgroundColor: BG, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <PageHeader title="Galería" color={ACCENT} bg={BG} font={FONT} border={BORDER} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 14px 14px', gap: 8 }}>
          {horizImgs.map((img, i) => (
            <div key={i} style={{ flex: 1, borderRadius: 12, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── 10. Contact ───────────────────────────────────────────────────────────
  pages.push(
    <div key="contact" style={{ width: PAGE_W, height: PAGE_H, backgroundColor: BG, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: '16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <span style={{ color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 11, fontWeight: 800 }}>Contacto</span>
        <span style={{ color: WHITE, fontSize: 22, fontWeight: 900, marginTop: 6, textAlign: 'center' }}>{d.contactArtistName || d.artistName || ''}</span>
      </div>
      <div style={{ flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[['Manager', d.managerName], ['Road Manager', d.roadManagerName], ['Contacto', `${d.contactCountryCode || ''} ${d.contactPhone || ''}`.trim()], ['Artista', d.artistName]].map(([label, value]) => (
          <div key={label} style={{ flex: 1, borderRadius: 14, border: `1px solid ${accentRgba(0.22)}`, background: CARD_BG, padding: '10px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: ACCENT, fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em' }}>{label}</div>
            <div style={{ color: WHITE, fontSize: 17, fontWeight: 800, marginTop: 5, textAlign: 'center' }}>{value || 'No especificado'}</div>
          </div>
        ))}
      </div>
      {contactLogo && (
        <div style={{ padding: '10px 0 22px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          <img src={contactLogo} alt="Logo" style={{ maxWidth: 140, maxHeight: 70, objectFit: 'contain' }} />
        </div>
      )}
    </div>
  );

  return pages;
}

export default function HTMLPreview({ presskitData }) {
  const { theme: uiTheme, typography } = useTheme();
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    if (!containerRef.current) return;
    const update = () => {
      const w = containerRef.current.offsetWidth;
      if (w > 0) setScale(w / PAGE_W);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const titleFont = typography?.titleFont || '';
  const fontFamily = titleFont ? `'${titleFont}', sans-serif` : 'system-ui, sans-serif';
  const tc = {
    accent:    uiTheme.accentColor    || '#67e8f9',
    bg:        uiTheme.bgColor        || '#0a0a12',
    title:     uiTheme.titleColor     || '#ffffff',
    subtitle:  uiTheme.subtitleColor  || 'rgba(255,255,255,0.55)',
    text:      uiTheme.textColor      || '#f4f4f5',
    cardBg:    uiTheme.cardBg         || 'rgba(255,255,255,0.06)',
    border:    uiTheme.borderColor    || 'rgba(255,255,255,0.10)',
    overlay:   uiTheme.overlayColor   || 'rgba(0,0,0,0.55)',
    fontFamily,
  };

  const pages = buildPages(presskitData || {}, tc);

  return (
    <div
      ref={containerRef}
      className="h-140 overflow-y-auto overflow-x-hidden rounded-2xl border border-white/10 bg-zinc-950/90"
      style={{ fontFamily }}
    >
      {pages.map((page, i) => (
        <div
          key={i}
          style={{ height: PAGE_H * scale, overflow: 'hidden', position: 'relative', marginBottom: i < pages.length - 1 ? 2 : 0 }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: PAGE_W, height: PAGE_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            {page}
          </div>
        </div>
      ))}
    </div>
  );
}

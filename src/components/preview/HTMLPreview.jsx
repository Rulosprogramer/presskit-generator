import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext.tsx';
import { getTextEffectStyle } from '../../lib/textEffects.js';

const PAGE_W = 595;
const PAGE_H = 842;
const PLATFORM_LABELS = {
  instagram: 'Instagram', spotify: 'Spotify', facebook: 'Facebook',
  youtube: 'YouTube', tiktok: 'TikTok', appleMusic: 'Apple Music', soundcloud: 'SoundCloud',
};

function PageHeader({ title, color = '#67e8f9', bg = '#0a0a12', font = 'system-ui, sans-serif', border = 'rgba(255,255,255,0.10)', fontSize = 11 }) {
  return (
    <div style={{ height: 68, borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: bg }}>
      <span style={{ color, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize, fontWeight: 800, fontFamily: font }}>{title}</span>
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
  const ACCENT      = tc.accent     || '#67e8f9';
  const BG          = tc.bg         || '#0a0a12';
  const WHITE       = tc.title      || '#ffffff';
  const FONT        = tc.fontFamily || 'system-ui, sans-serif';
  const BODY_FONT   = tc.bodyFont   || FONT;
  const SUB_FONT    = tc.subFont    || FONT;
  const LABEL_FONT  = tc.labelFont  || FONT;
  const SUBTITLE    = tc.subtitle   || 'rgba(255,255,255,0.55)';
  const TEXT        = tc.text       || '#f4f4f5';
  const CARD_BG     = tc.cardBg     || 'rgba(255,255,255,0.06)';
  const BORDER      = tc.border     || 'rgba(255,255,255,0.10)';
  const OVERLAY     = tc.overlay    || 'rgba(0,0,0,0.55)';
  const TEXT_FX     = getTextEffectStyle(tc.textEffect || 'none', TEXT);
  const SUB_FX      = getTextEffectStyle(tc.subtitleEffect || 'none', SUBTITLE);

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
  const recognitionsList = Array.isArray(d.recognitions)
    ? d.recognitions.filter(Boolean)
    : (d.recognitions || '').split('\n').map(s => s.trim()).filter(Boolean);
  const filledLinks = Object.entries(d.links || {})
    .filter(([, v]) => typeof v === 'string' && v.startsWith('http'))
    .slice(0, 8);

  const pages = [];

  // ── 1. Cover ──────────────────────────────────────────────────────────────
  pages.push(
    <div key="cover" style={{ width: PAGE_W, height: PAGE_H, position: 'relative', backgroundColor: BG, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
      <BgImage src={coverImg} scrim={OVERLAY} />
      <div style={{ position: 'relative', zIndex: 1, paddingTop: 28, textAlign: 'center' }}>
        <div style={{ fontSize: 30, fontWeight: 900, color: WHITE, lineHeight: 1.1, fontFamily: FONT }}>{d.artistName || 'Presskit'}</div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, paddingBottom: 28 }}>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: WHITE, fontFamily: FONT }}>PRESSKIT</div>
      </div>
    </div>
  );

  // ── 2. Bio intro ──────────────────────────────────────────────────────────
  const perfLink = d.performanceLiveLink || '';
  const perfVidId = perfLink.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
  const perfThumb = perfVidId ? `https://img.youtube.com/vi/${perfVidId}/hqdefault.jpg` : '';
  pages.push(
    <div key="bio-intro" style={{ width: PAGE_W, height: PAGE_H, position: 'relative', backgroundColor: BG, overflow: 'hidden' }}>
      <BgImage src={bioImg} scrim={OVERLAY} />
      <div style={{ position: 'absolute', top: 28, left: 40, right: 40, zIndex: 1, textAlign: 'center' }}>
        <div style={{ color: SUBTITLE, fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700, fontFamily: FONT, ...SUB_FX }}>CONOCE A</div>
        <div style={{ fontSize: 40, fontWeight: 900, color: WHITE, lineHeight: 1.05, marginTop: 6, fontFamily: FONT }}>{d.artistName || ''}</div>
      </div>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: perfLink ? '0 40px 170px' : '0 40px 60px' }}>
        {(d.genre || d.city) && (
          <div style={{ color: SUBTITLE, fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12, fontFamily: FONT, ...SUB_FX }}>
            {[d.genre, d.city].filter(Boolean).join(' • ')}
          </div>
        )}
        <div style={{ color: TEXT, fontSize: 13, lineHeight: 1.6, textAlign: 'center', fontFamily: FONT, ...TEXT_FX }}>
          {d.shortBio || d.bio || ''}
        </div>
      </div>
      {perfLink && (
        <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, zIndex: 2, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 360, borderRadius: 12, overflow: 'hidden', border: `1px solid ${BORDER}`, backgroundColor: bgRgba(0.88), display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {perfThumb && (
              <img src={perfThumb} alt="" style={{ width: '100%', height: 180, objectFit: 'cover' }} />
            )}
            <div style={{ padding: '13px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center' }}>
              <div style={{ color: SUBTITLE, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', fontFamily: FONT }}>Live Performance</div>
              <div style={{ color: WHITE, fontSize: 15, fontWeight: 800, fontFamily: FONT }}>Performance en vivo</div>
              <div style={{ color: ACCENT, fontSize: 11, fontFamily: FONT }}>Ver video →</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ── 3. Recognitions & Streams ────────────────────────────────────────────
  pages.push(
    <div key="recog" style={{ width: PAGE_W, height: PAGE_H, backgroundColor: BG, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ height: 88, borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.22em', fontSize: 13, fontWeight: 800, fontFamily: FONT }}>Reconocimientos y Streams</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', gap: 18, padding: 24, minHeight: 0, overflow: 'hidden' }}>
        <div style={{ width: '42%', borderRadius: 20, overflow: 'hidden', border: `1px solid ${BORDER}`, background: CARD_BG }}>
          {d.recognitionImage
            ? <img src={d.recognitionImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: SUBTITLE, fontSize: 10 }}>Sin imagen</span></div>
          }
        </div>
        <div style={{ width: '58%', borderRadius: 20, border: `1px solid ${BORDER}`, background: CARD_BG, padding: 18, overflow: 'hidden' }}>
          <div style={{ color: SUBTITLE, fontSize: 15, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.22em', fontFamily: SUB_FONT }}>Reconocimientos</div>
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {recognitionsList.length > 0 ? recognitionsList.map((r, i) => (
              <div key={i} style={{ color: TEXT, fontSize: 15, lineHeight: 1.5, fontFamily: BODY_FONT }}>{r}</div>
            )) : (
              <div style={{ color: SUBTITLE, fontSize: 15, fontFamily: BODY_FONT }}>Sin reconocimientos</div>
            )}
          </div>
        </div>
      </div>
      <div style={{ height: 122, borderTop: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'row', gap: 16, padding: '20px 24px 24px', flexShrink: 0 }}>
        {[['Total streams', d.totalStreams], ['Total video views', d.totalVideoViews]].map(([label, value]) => (
          <div key={label} style={{ flex: 1, borderRadius: 18, border: `1px solid ${accentRgba(0.18)}`, background: accentRgba(0.08), padding: '0 16px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ color: ACCENT, fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: LABEL_FONT }}>{label}</div>
            <div style={{ color: WHITE, fontSize: 28, fontWeight: 900, lineHeight: 1, fontFamily: FONT }}>{value || 'Sin dato'}</div>
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
          <div style={{ color: TEXT, fontSize: 12, lineHeight: 1.5, ...TEXT_FX }}>{d.twitterBio}</div>
        </div>
      )}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {d.twitterBioImage && <img src={d.twitterBioImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
        <div style={{ position: 'absolute', inset: 0, background: OVERLAY }} />
        <div style={{ position: 'absolute', inset: '10px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', zIndex: 1 }}>
          {milestones.map((m, i) => {
            const n = milestones.length;
            const fs = n <= 4 ? 15 : n <= 6 ? 13 : n <= 8 ? 11.5 : n <= 10 ? 10.5 : 9;
            const py = n <= 4 ? 9 : n <= 8 ? 6 : 5;
            return (
              <div key={i} style={{ width: '100%', borderRadius: 8, border: `1px solid ${accentRgba(0.28)}`, background: bgRgba(0.72), padding: `${py}px 12px`, textAlign: 'center' }}>
                <span style={{ color: TEXT, fontSize: fs, fontWeight: 500 }}>{m}</span>
              </div>
            );
          })}
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
          <div style={{ color: TEXT, fontSize: 13, lineHeight: 1.65, textAlign: 'center', fontFamily: BODY_FONT, ...TEXT_FX }}>{longBio}</div>
        </div>
      </div>
    );
  }

  // ── 6. Releases ───────────────────────────────────────────────────────────
  const validReleases = releases.filter((r) => r && (r.url || r.title));
  if (validReleases.length > 0) {
    const SPLITS = { 1: [1], 2: [1, 1], 3: [1, 2], 4: [2, 2], 5: [2, 3], 6: [3, 3], 7: [4, 3], 8: [4, 4] };
    const sizes = SPLITS[validReleases.length];
    const chunks = [];
    if (sizes) {
      let idx = 0;
      for (const size of sizes) { chunks.push(validReleases.slice(idx, idx + size)); idx += size; }
    } else {
      for (let i = 0; i < validReleases.length; i += 4) chunks.push(validReleases.slice(i, i + 4));
    }
    const thumbFor = (r) => {
      const vidId = String(r.url || '').match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      return vidId ? `https://img.youtube.com/vi/${vidId}/mqdefault.jpg` : '';
    };
    chunks.forEach((chunk, ci) => {
      const isSingle = chunk.length === 1;
      pages.push(
        <div key={`releases-${ci}`} style={{ width: PAGE_W, height: PAGE_H, backgroundColor: BG, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ borderBottom: `1px solid ${BORDER}`, padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 11, fontWeight: 800 }}>
              Video Releases{chunks.length > 1 ? ` (${ci + 1}/${chunks.length})` : ''}
            </span>
            {ci === 0 && d.releasesCtaText && (
              <span style={{ color: SUBTITLE, fontSize: 12, fontStyle: 'italic', marginTop: 4 }}>{d.releasesCtaText}</span>
            )}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px 16px', gap: 8 }}>
            {isSingle ? (() => {
              const r = chunk[0];
              const thumb = thumbFor(r);
              return (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 12, border: `1px solid ${BORDER}`, background: CARD_BG, overflow: 'hidden' }}>
                  <div style={{ flex: 3, overflow: 'hidden' }}>
                    {thumb
                      ? <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', background: '#1a1a2e' }} />
                    }
                  </div>
                  <div style={{ flex: 1, padding: '16px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', overflow: 'hidden' }}>
                    <div style={{ color: WHITE, fontSize: 18, fontWeight: 900, lineHeight: 1.2 }}>{r.title || ''}</div>
                    {r.author && <div style={{ color: ACCENT, fontSize: 12, marginTop: 6, fontWeight: 700 }}>{r.author}</div>}
                    {r.description && <div style={{ color: SUBTITLE, fontSize: 11, marginTop: 6, lineHeight: 1.35, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{r.description}</div>}
                  </div>
                </div>
              );
            })() : chunk.map((r, ri) => {
              const thumb = thumbFor(r);
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
          <span style={{ color: SUBTITLE, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.22em', ...SUB_FX }}>CONECTA CON</span>
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

  // ── 8. Gallery vertical (2×2 grid, one page) ─────────────────────────────
  if (galleryImgs.length > 0) {
    const HEADER_H = 68;
    const PADDING_V = 12 + 14;
    const GAP = 8;
    const rowH = (PAGE_H - HEADER_H - PADDING_V - GAP) / 2;
    pages.push(
      <div key="gallery" style={{ width: PAGE_W, height: PAGE_H, backgroundColor: BG, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <PageHeader title="Galería Visual" color={ACCENT} bg={BG} font={FONT} border={BORDER} />
        <div style={{ display: 'flex', flexDirection: 'column', padding: '12px 14px 14px', gap: GAP }}>
          {[galleryImgs.slice(0, 2), galleryImgs.slice(2, 4)].map((row, ri) => (
            <div key={ri} style={{ height: rowH, display: 'flex', flexDirection: 'row', gap: 8 }}>
              {row.map((img, i) => (
                <div key={i} style={{ flex: 1, borderRadius: 12, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          ))}
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

  // ── 9.5 Artículos de prensa (una página por imagen) ──────────────────────
  const pressArticles = Array.isArray(d.pressArticles) ? d.pressArticles.filter(Boolean) : [];
  pressArticles.forEach((article, index) => {
    pages.push(
      <div key={`press-${index}`} style={{ width: PAGE_W, height: PAGE_H, backgroundColor: '#ffffff', overflow: 'hidden' }}>
        <div style={{ width: '100%', height: '100%', padding: 20, boxSizing: 'border-box' }}>
          {article ? (
            <img src={article} alt={`Artículo de prensa ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#999999', fontSize: 12 }}>Sin imagen de artículo de prensa</span>
            </div>
          )}
        </div>
      </div>
    );
  });

  // ── 10. Contact ───────────────────────────────────────────────────────────
  pages.push(
    <div key="contact" style={{ width: PAGE_W, height: PAGE_H, backgroundColor: BG, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: '16px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <span style={{ color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 11, fontWeight: 800 }}>Contacto</span>
        <span style={{ color: WHITE, fontSize: 22, fontWeight: 900, marginTop: 6, textAlign: 'center' }}>{d.contactArtistName || d.artistName || ''}</span>
      </div>
      <div style={{ flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          ['Manager', d.managerName],
          ['Road Manager', d.roadManagerName],
          ['Contacto', `${d.contactCountryCode || ''} ${d.contactPhone || ''}`.trim(), d.contactPhone ? `tel:${`${d.contactCountryCode || ''}${d.contactPhone}`.replace(/[^\d+]/g, '')}` : ''],
          ...(d.whatsappPhone ? [['WhatsApp', `${d.contactCountryCode || ''} ${d.whatsappPhone}`.trim(), `https://wa.me/${`${d.contactCountryCode || ''}${d.whatsappPhone}`.replace(/\D/g, '')}`]] : []),
          ['Artista', d.artistName],
        ].map(([label, value, href]) => (
          <div key={label} style={{ flex: 1, borderRadius: 14, border: `1px solid ${accentRgba(0.22)}`, background: CARD_BG, padding: '10px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: ACCENT, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em' }}>{label}</div>
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: WHITE, fontSize: 17, fontWeight: 800, marginTop: 5, textAlign: 'center', textDecoration: 'underline' }}>{value || 'No especificado'}</a>
            ) : (
              <div style={{ color: WHITE, fontSize: 17, fontWeight: 800, marginTop: 5, textAlign: 'center' }}>{value || 'No especificado'}</div>
            )}
          </div>
        ))}
      </div>
      {contactLogo && (
        <div style={{ padding: '10px 0 22px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          <img src={contactLogo} alt="Logo" style={{ maxWidth: 300, maxHeight: 150, objectFit: 'contain' }} />
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

  const toFamily = (name) => name ? `'${name}', sans-serif` : null;
  const cf = (presskitData || {}).customFonts || {};
  const fontFamily     = cf.title?.url    ? 'presskit-custom-title, sans-serif'    : (toFamily(typography?.titleFont)    || 'system-ui, sans-serif');
  const bodyFontFamily = cf.body?.url     ? 'presskit-custom-body, sans-serif'     : (toFamily(typography?.bodyFont)     || fontFamily);
  const subFontFamily  = cf.subtitle?.url ? 'presskit-custom-subtitle, sans-serif' : (toFamily(typography?.subtitleFont) || fontFamily);
  const labelFontFamily= toFamily(typography?.labelFont) || fontFamily;
  const customFontFaceCSS = [
    cf.title?.url    && `@font-face{font-family:'presskit-custom-title';src:url('${cf.title.url}');}`,
    cf.subtitle?.url && `@font-face{font-family:'presskit-custom-subtitle';src:url('${cf.subtitle.url}');}`,
    cf.body?.url     && `@font-face{font-family:'presskit-custom-body';src:url('${cf.body.url}');}`,
  ].filter(Boolean).join('');
  const tc = {
    accent:      uiTheme.accentColor    || '#67e8f9',
    bg:          uiTheme.bgColor        || '#0a0a12',
    title:       uiTheme.titleColor     || '#ffffff',
    subtitle:    uiTheme.subtitleColor  || 'rgba(255,255,255,0.55)',
    text:        uiTheme.textColor      || '#f4f4f5',
    cardBg:      uiTheme.cardBg         || 'rgba(255,255,255,0.06)',
    border:      uiTheme.borderColor    || 'rgba(255,255,255,0.10)',
    overlay:     uiTheme.overlayColor   || 'rgba(0,0,0,0.55)',
    fontFamily,
    bodyFont:    bodyFontFamily,
    subFont:     subFontFamily,
    labelFont:   labelFontFamily,
    textEffect:     uiTheme.textEffectPdf     || 'none',
    subtitleEffect: uiTheme.subtitleEffectPdf || 'none',
  };

  const pages = buildPages(presskitData || {}, tc);

  return (
    <div
      ref={containerRef}
      className="overflow-y-auto overflow-x-hidden rounded-2xl border border-white/10 bg-zinc-950/90"
      style={{ fontFamily, maxHeight: PAGE_H * scale }}
    >
      {customFontFaceCSS && <style>{customFontFaceCSS}</style>}
      {pages.map((page, i) => (
        <div
          key={i}
          style={{ height: PAGE_H * scale, overflow: 'hidden', position: 'relative', marginBottom: i < pages.length - 1 ? 8 : 0 }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: PAGE_W, height: PAGE_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
            {page}
          </div>
        </div>
      ))}
    </div>
  );
}

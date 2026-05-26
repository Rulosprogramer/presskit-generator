import { Document, Image, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { theme as pdfxTheme } from '../../lib/pdfx-theme';

const styles = StyleSheet.create({
  page: {
    backgroundColor: pdfxTheme.colors.background,
    color: pdfxTheme.colors.foreground,
    fontFamily: pdfxTheme.typography.body.fontFamily,
    fontSize: pdfxTheme.typography.body.fontSize,
    paddingTop: pdfxTheme.spacing.page.marginTop,
    paddingRight: pdfxTheme.spacing.page.marginRight,
    paddingBottom: pdfxTheme.spacing.page.marginBottom,
    paddingLeft: pdfxTheme.spacing.page.marginLeft,
  },
  coverPage: {
    backgroundColor: '#0a0a12',
    color: '#ffffff',
    padding: 0,
    position: 'relative',
  },
  coverFrame: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  coverBackground: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  coverScrim: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.36)',
  },
  coverTop: {
    position: 'absolute',
    top: 34,
    left: 34,
    right: 34,
    alignItems: 'center',
  },
  coverArtist: {
    fontSize: 34,
    lineHeight: 1.05,
    fontWeight: pdfxTheme.primitives.fontWeights.bold,
    color: '#ffffff',
    textAlign: 'center',
  },
  coverBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 34,
    alignItems: 'center',
  },
  coverPresskit: {
    fontSize: 13,
    fontWeight: pdfxTheme.primitives.fontWeights.bold,
    color: '#ffffff',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: pdfxTheme.colors.border,
    paddingBottom: 10,
  },
  title: {
    fontSize: pdfxTheme.typography.heading.fontSize.h2,
    fontWeight: pdfxTheme.primitives.fontWeights.bold,
    color: pdfxTheme.colors.primary,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 10,
    color: pdfxTheme.colors.mutedForeground,
  },
  section: {
    marginTop: 14,
    gap: 6,
  },
  sectionTitle: {
    fontSize: pdfxTheme.typography.heading.fontSize.h5,
    fontWeight: pdfxTheme.primitives.fontWeights.semibold,
    color: pdfxTheme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  text: {
    lineHeight: 1.45,
  },
  pageTwo: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#0a0a12',
    color: '#ffffff',
    paddingTop: 42,
    paddingRight: 40,
    paddingBottom: 40,
    paddingLeft: 40,
  },
  pageTwoHeader: {
    textAlign: 'center',
    marginBottom: 26,
  },
  pageTwoKicker: {
    margin: 0,
    color: '#67e8f9',
    textTransform: 'uppercase',
    letterSpacing: 2.5,
    fontSize: 13,
  },
  pageTwoArtist: {
    marginTop: 10,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    fontSize: 56,
    lineHeight: 1,
    fontWeight: 800,
    color: '#ffffff',
  },
  pageTwoBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    minHeight: 0,
  },
  pageTwoBioCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    minHeight: 0,
  },
  pageTwoInfo: {
    color: '#67e8f9',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 12,
  },
  pageTwoBio: {
    margin: 0,
    color: '#f4f4f5',
    fontSize: 17,
    lineHeight: 1.55,
    whiteSpace: 'pre-line',
  },
  pageTwoVideoCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(16,185,129,0.12)',
    display: 'flex',
    flexDirection: 'column',
  },
  pageTwoVideoImage: {
    width: '100%',
    height: 200,
    objectFit: 'cover',
    backgroundColor: '#111827',
  },
  pageTwoVideoBody: {
    paddingTop: 16,
    paddingRight: 18,
    paddingBottom: 18,
    paddingLeft: 18,
  },
  pageTwoVideoKicker: {
    margin: 0,
    color: '#67e8f9',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  pageTwoVideoTitle: {
    marginTop: 8,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    color: '#ffffff',
    fontSize: 20,
    lineHeight: 1.15,
    fontWeight: 800,
  },
  pageTwoVideoLink: {
    marginTop: 8,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    color: '#a7f3d0',
    fontSize: 12,
    textDecoration: 'underline',
    wordBreak: 'break-all',
  },
  pageThree: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#0a0a12',
    color: '#ffffff',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
  pageThreeHeader: {
    height: 88,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageThreeTitle: {
    margin: 0,
    color: '#f472b6',
    textTransform: 'uppercase',
    letterSpacing: 2.4,
    fontSize: 13,
    fontWeight: 800,
  },
  pageThreeBody: {
    flexDirection: 'row',
    gap: 18,
    flex: 1,
    paddingTop: 24,
    paddingRight: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    minHeight: 0,
  },
  pageThreeImageCard: {
    width: '42%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    minHeight: 0,
  },
  pageThreeImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  pageThreeFallback: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#d4d4d8',
    backgroundColor: 'rgba(255,255,255,0.04)',
    fontSize: 12,
  },
  pageThreeCard: {
    width: '58%',
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingTop: 18,
    paddingRight: 18,
    paddingBottom: 18,
    paddingLeft: 18,
    minHeight: 0,
  },
  pageThreeLabel: {
    margin: 0,
    color: '#f472b6',
    textTransform: 'uppercase',
    letterSpacing: 2.2,
    fontSize: 12,
    fontWeight: 800,
  },
  pageThreeText: {
    marginTop: 10,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    color: '#f4f4f5',
    fontSize: 15,
    lineHeight: 1.5,
    whiteSpace: 'pre-line',
  },
  pageThreeFooter: {
    height: 122,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 20,
    paddingRight: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    flexDirection: 'row',
    gap: 16,
  },
  pageThreeMetric: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(244,114,182,0.18)',
    backgroundColor: 'rgba(244,114,182,0.08)',
    paddingTop: 16,
    paddingRight: 16,
    paddingBottom: 16,
    paddingLeft: 16,
  },
  pageThreeMetricLabel: {
    margin: 0,
    color: '#f472b6',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 11,
    fontWeight: 800,
  },
  pageThreeMetricValue: {
    marginTop: 8,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    color: '#ffffff',
    fontSize: 28,
    lineHeight: 1,
    fontWeight: 900,
  },
  pageFour: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#0a0a12',
    color: '#ffffff',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
  },
  pageFourHeader: {
    height: 88,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageFourTitle: {
    margin: 0,
    color: '#67e8f9',
    textTransform: 'uppercase',
    letterSpacing: 2.4,
    fontSize: 14,
    fontWeight: 800,
  },
  pageFourBody: {
    flexDirection: 'column',
    gap: 18,
    flex: 1,
    paddingTop: 24,
    paddingRight: 24,
    paddingBottom: 24,
    paddingLeft: 24,
    minHeight: 0,
  },
  pageFourBioCard: {
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: '22%',
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingTop: 18,
    paddingRight: 18,
    paddingBottom: 18,
    paddingLeft: 18,
  },
  pageFourBioText: {
    margin: 0,
    color: '#f4f4f5',
    fontSize: 16,
    lineHeight: 1.55,
    whiteSpace: 'pre-line',
  },
  pageFourVisualCard: {
    position: 'relative',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '78%',
    flex: 1,
    minHeight: 0,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  pageFourImageCard: {
    position: 'absolute',
    inset: 0,
  },
  pageFourImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  pageFourFallback: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#d4d4d8',
    backgroundColor: 'rgba(255,255,255,0.04)',
    fontSize: 12,
  },
  pageFourMilestoneOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pageFourMilestoneCard: {
    flexGrow: 1,
    flexBasis: '42%',
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(103,232,249,0.20)',
    backgroundColor: 'rgba(10,10,18,0.62)',
    paddingTop: 12,
    paddingRight: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    overflow: 'hidden',
  },
  pageFourMilestoneLabel: {
    margin: 0,
    color: '#67e8f9',
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontSize: 10,
    fontWeight: 800,
  },
  pageFourMilestoneList: {
    marginTop: 6,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    color: '#f4f4f5',
    fontSize: 12,
    lineHeight: 1.25,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 3,
    overflow: 'hidden',
    whiteSpace: 'pre-line',
  },
  pageFive: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#0a0a12',
    color: '#ffffff',
    overflow: 'hidden',
  },
  pageFiveHeader: {
    height: 88,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageFiveTitle: {
    margin: 0,
    color: '#67e8f9',
    textTransform: 'uppercase',
    letterSpacing: 2.4,
    fontSize: 14,
    fontWeight: 800,
  },
  pageFiveBody: {
    position: 'relative',
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
    paddingTop: 24,
    paddingRight: 24,
    paddingBottom: 24,
    paddingLeft: 24,
  },
  pageFiveImageCard: {
    position: 'absolute',
    inset: 0,
  },
  pageFiveImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  pageFiveFallback: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#d4d4d8',
    backgroundColor: 'rgba(255,255,255,0.04)',
    fontSize: 12,
  },
  pageFiveOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(10,10,18,0.18)',
  },
  pageFiveTextPanel: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: 'rgba(10,10,18,0.74)',
    paddingTop: 18,
    paddingRight: 18,
    paddingBottom: 18,
    paddingLeft: 18,
  },
  pageFiveText: {
    margin: 0,
    color: '#f4f4f5',
    fontSize: 14,
    lineHeight: 1.55,
    whiteSpace: 'pre-line',
  },
});

function isHttpUrl(value) {
  return typeof value === 'string' && (value.startsWith('https://') || value.startsWith('http://'));
}

function formatReleaseDate(dateValue) {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return String(dateValue);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
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

export default function PresskitPdfDocument({ data, variant = 'professional', colors = {} }) {
  const c = {
    bg:     colors.bg     || '#0a0a12',
    card:   colors.card   || 'rgba(255,255,255,0.05)',
    title:  colors.title  || '#ffffff',
    text:   colors.text   || '#f4f4f5',
    accent: colors.accent || '#67e8f9',
    border: colors.border || 'rgba(255,255,255,0.12)',
  };

  const safeData = data || {};
  const isEssential = variant === 'essential';
  const safeImages = (safeData.images || []).filter(isHttpUrl);
  const coverImage = safeImages[0] || '';
  const performanceLiveLink = safeData.performanceLiveLink || '';
  const performanceLiveThumbnail = getYoutubeThumbnailUrl(performanceLiveLink);
  const recognitionImage = safeData.recognitionImage || '';
  const recognitions = safeData.recognitions || 'Añade reconocimientos, escenarios, playlists, becas, festivales o formación para completar esta sección.';
  const totalStreams = safeData.totalStreams || 'Sin dato';
  const totalVideoViews = safeData.totalVideoViews || 'Sin dato';
  const bio140Image = safeData.twitterBioImage || '';
  const bio140 = safeData.twitterBio || 'Sin bio de 140 caracteres.';
  const longBio = safeData.longBio || safeData.bio || 'Sin biografía completa.';
  const longBioImage = safeData.longBioImage || '';
  const milestoneCards = getMilestonesByCategory(safeData.artistMilestones);

  return (
    <Document>
      <Page size={pdfxTheme.page.size} style={[styles.coverPage, { backgroundColor: c.bg }]} wrap={false}>
        <View style={styles.coverFrame}>
          {coverImage ? <Image src={coverImage} style={styles.coverBackground} /> : null}
          <View style={styles.coverScrim} />
          <View style={styles.coverTop}>
            <Text style={[styles.coverArtist, { color: c.title }]}>{safeData.artistName || 'Presskit sin nombre'}</Text>
          </View>
          <View style={styles.coverBottom}>
            <Text style={[styles.coverPresskit, { color: c.title }]}>PRESSKIT</Text>
          </View>
        </View>
      </Page>

      <Page size={pdfxTheme.page.size} style={styles.page} wrap={false}>
        <View style={[styles.pageTwo, { backgroundColor: c.bg, color: c.title }]}>
          <View style={styles.pageTwoHeader}>
            <Text style={[styles.pageTwoKicker, { color: c.accent }]}>CONOCE A</Text>
            <Text style={[styles.pageTwoArtist, { color: c.title }]}>{safeData.artistName || 'Presskit sin nombre'}</Text>
          </View>

          <View style={styles.pageTwoBody}>
            <View style={[styles.pageTwoBioCard, { borderColor: c.border, backgroundColor: c.card }]}>
              <Text style={[styles.pageTwoInfo, { color: c.accent }]}>
                {[safeData.genre, safeData.city].filter(Boolean).join(' • ') || 'SIN GENERO NI CIUDAD'}
              </Text>
              <Text style={[styles.pageTwoBio, { color: c.text }]}>{safeData.shortBio || safeData.bio || 'Sin biografia corta.'}</Text>
            </View>

            {performanceLiveLink ? (
              <View style={[styles.pageTwoVideoCard, { borderColor: c.border, backgroundColor: c.card }]}>
                {performanceLiveThumbnail ? (
                  <Image src={performanceLiveThumbnail} style={styles.pageTwoVideoImage} />
                ) : (
                  <View style={{ ...styles.pageTwoVideoImage, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: c.text, fontSize: 12 }}>Sin thumbnail de video</Text>
                  </View>
                )}

                <View style={styles.pageTwoVideoBody}>
                  <Text style={[styles.pageTwoVideoKicker, { color: c.accent }]}>LIVE PERFORMANCE</Text>
                  <Text style={[styles.pageTwoVideoTitle, { color: c.title }]}>Mira mi performance en vivo</Text>
                  <Link src={performanceLiveLink} style={[styles.pageTwoVideoLink, { color: c.accent }]}>
                    {performanceLiveLink}
                  </Link>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </Page>

      <Page size={pdfxTheme.page.size} style={styles.pageThree} wrap={false}>
        <View style={styles.pageThreeHeader}>
          <Text style={styles.pageThreeTitle}>Reconocimientos y Streams</Text>
        </View>

        <View style={styles.pageThreeBody}>
          <View style={styles.pageThreeImageCard}>
            {recognitionImage ? (
              <Image src={recognitionImage} style={styles.pageThreeImage} />
            ) : (
              <View style={styles.pageThreeFallback}>
                <Text>Sin imagen de reconocimientos</Text>
              </View>
            )}
          </View>

          <View style={styles.pageThreeCard}>
            <Text style={styles.pageThreeLabel}>Reconocimientos</Text>
            <Text style={styles.pageThreeText}>{recognitions}</Text>
          </View>
        </View>

        <View style={styles.pageThreeFooter}>
          <View style={styles.pageThreeMetric}>
            <Text style={styles.pageThreeMetricLabel}>Total streams</Text>
            <Text style={styles.pageThreeMetricValue}>{totalStreams}</Text>
          </View>
          <View style={styles.pageThreeMetric}>
            <Text style={styles.pageThreeMetricLabel}>Total video views</Text>
            <Text style={styles.pageThreeMetricValue}>{totalVideoViews}</Text>
          </View>
        </View>
      </Page>

      <Page size={pdfxTheme.page.size} style={styles.pageFour} wrap={false}>
        <View style={styles.pageFourHeader}>
          <Text style={styles.pageFourTitle}>Biografía</Text>
        </View>

        <View style={styles.pageFourBody}>
          <View style={styles.pageFourBioCard}>
            <Text style={styles.pageFourBioText}>{bio140}</Text>
          </View>

          <View style={styles.pageFourVisualCard}>
            <View style={styles.pageFourImageCard}>
              {bio140Image ? (
                <Image src={bio140Image} style={styles.pageFourImage} />
              ) : (
                <View style={styles.pageFourFallback}>
                  <Text>Sin imagen de bio de 140 caracteres</Text>
                </View>
              )}
            </View>

            <View style={styles.pageFourMilestoneOverlay}>
              {milestoneCards.map((milestone) => (
                <View key={milestone.key} style={styles.pageFourMilestoneCard}>
                  <Text style={styles.pageFourMilestoneLabel}>{milestone.label}</Text>
                  <Text style={styles.pageFourMilestoneList}>
                    {milestone.items.length > 0
                      ? milestone.items.slice(0, 3).map((item) => `• ${item}`).join('\n')
                      : 'Sin hitos registrados.'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Page>

      <Page size={pdfxTheme.page.size} style={styles.pageFive} wrap={false}>
        <View style={styles.pageFiveHeader}>
          <Text style={styles.pageFiveTitle}>Biografía</Text>
        </View>

        <View style={styles.pageFiveBody}>
          <View style={styles.pageFiveImageCard}>
            {longBioImage ? (
              <Image src={longBioImage} style={styles.pageFiveImage} />
            ) : (
              <View style={styles.pageFiveFallback}>
                <Text>Sin imagen de biografía completa</Text>
              </View>
            )}
          </View>

          <View style={styles.pageFiveOverlay} />

          <View style={styles.pageFiveTextPanel}>
            <Text style={styles.pageFiveText}>{longBio}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

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
  coverImage: {
    width: '100%',
    height: 220,
    objectFit: 'cover',
    borderRadius: 6,
    marginTop: 10,
  },
  releaseRow: {
    borderWidth: 1,
    borderColor: pdfxTheme.colors.border,
    borderRadius: 6,
    padding: 8,
    marginTop: 6,
  },
  releaseTitle: {
    fontWeight: pdfxTheme.primitives.fontWeights.semibold,
  },
  linksGrid: {
    marginTop: 6,
    gap: 6,
  },
  linkText: {
    color: pdfxTheme.colors.info,
    textDecoration: 'underline',
  },
  gallery: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  galleryImage: {
    width: '48%',
    height: 120,
    objectFit: 'cover',
    borderRadius: 6,
  },
  contactRow: {
    marginTop: 4,
  },
  contactLabel: {
    color: pdfxTheme.colors.mutedForeground,
    fontSize: 10,
  },
  contactValue: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: pdfxTheme.primitives.fontWeights.medium,
  },
  logo: {
    width: 90,
    height: 90,
    objectFit: 'contain',
    marginTop: 10,
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

export default function PresskitPdfDocument({ data, variant = 'professional' }) {
  const safeData = data || {};
  const isEssential = variant === 'essential';
  const safeLinks = Object.entries(safeData.links || {}).filter(([, value]) => Boolean(value));
  const safeImages = (safeData.images || []).filter(isHttpUrl);
  const coverImage = safeImages[0] || '';
  const galleryImages = safeImages.slice(1, 5);

  return (
    <Document>
      <Page size={pdfxTheme.page.size} style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{safeData.artistName || 'Presskit sin nombre'}</Text>
          <Text style={styles.subtitle}>
            {[safeData.genre, safeData.city].filter(Boolean).join(' • ') || 'Sin genero ni ciudad'}
          </Text>
        </View>

        {coverImage ? <Image src={coverImage} style={styles.coverImage} /> : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reconocimientos y metricas</Text>
          <Text style={styles.text}>{safeData.recognitions || 'Sin reconocimientos registrados.'}</Text>
          <Text style={styles.text}>Streams: {safeData.totalStreams || 'Sin dato'}</Text>
          <Text style={styles.text}>Video views: {safeData.totalVideoViews || 'Sin dato'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Biografia</Text>
          <Text style={styles.text}>{safeData.bio || safeData.longBio || 'Sin biografia.'}</Text>
        </View>

        {!isEssential && (safeData.releases || []).length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Releases</Text>
            {(safeData.releases || []).slice(0, 5).map((release, index) => (
              <View key={`release-${index}`} style={styles.releaseRow}>
                <Text style={styles.releaseTitle}>{release?.title || 'Release'}</Text>
                {release?.date ? <Text>{formatReleaseDate(release.date)}</Text> : null}
                {release?.description ? <Text>{release.description}</Text> : null}
              </View>
            ))}
          </View>
        ) : null}

        {!isEssential && safeLinks.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Links</Text>
            <View style={styles.linksGrid}>
              {safeLinks.slice(0, 8).map(([key, value]) => (
                <Link key={key} src={String(value)} style={styles.linkText}>
                  {key}: {String(value)}
                </Link>
              ))}
            </View>
          </View>
        ) : null}

        {!isEssential && galleryImages.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Galeria</Text>
            <View style={styles.gallery}>
              {galleryImages.map((image, index) => (
                <Image key={`gallery-${index}`} src={image} style={styles.galleryImage} />
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contacto</Text>
          {isHttpUrl(safeData.contactLogo) ? <Image src={safeData.contactLogo} style={styles.logo} /> : null}
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Artista</Text>
            <Text style={styles.contactValue}>{safeData.contactArtistName || safeData.artistName || 'No especificado'}</Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Manager</Text>
            <Text style={styles.contactValue}>{safeData.managerName || 'No especificado'}</Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Road Manager</Text>
            <Text style={styles.contactValue}>{safeData.roadManagerName || 'No especificado'}</Text>
          </View>
          <View style={styles.contactRow}>
            <Text style={styles.contactLabel}>Telefono</Text>
            <Text style={styles.contactValue}>{`${safeData.contactCountryCode || '+57'} ${safeData.contactPhone || ''}`.trim() || 'No especificado'}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
